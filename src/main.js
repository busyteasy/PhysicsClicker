// Oberfläche: verbindet Spiellogik und DOM.

import { CATEGORIES } from '../data/index.js';
import * as C from './content.js';
import { AREA_NAMES, BEREICH_NAMES, BOOSTS, COUNTDOWN } from './content.js';
import { formatNumber as fmt } from './format.js';
import {
  FREI, KLASSEN_WELTEN, answerQuestion, bereichCount, boostBlocked, boostPrice, buyBereich,
  buyBoost, canReveal, comboMultiplier, comboWindow, countdownLeft, countdownOver, discoveryCount, isOpen,
  newCountdownRun, newState, nextOpenQuestion, questionPoints, questionStatus, revealQuestion, submit, unlockPrice,
  weltOf,
} from './game.js';
import {
  clearLocal, exportState, hasSave, importState, loadLocal, loadMode, loadRecord, saveLocal, saveMode, saveRecord,
} from './save.js';
import { isRelation, normWord } from './normalize.js';
import { mindmap } from './mindmap.js';
import { wikiUrl } from './wiki.js';

// Spielwelt (Issue #16): freies Spiel oder eine Klassenstufe. Jede Welt hat
// ihren eigenen Spielstand; zuletzt gespielt wird die zuletzt gewählte.
const startWelt = loadMode() ?? 'frei';
let state = loadLocal(startWelt) ?? newState(startWelt);

const $ = (id) => document.getElementById(id);

/** Kleiner Helfer zum Bauen von Elementen; Text wird nie als HTML gelesen. */
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

/** Ersetzt den Inhalt eines Elements; leere Teile (null, false) werden übersprungen. */
function fill(el, ...children) {
  el.replaceChildren(...children.flat().filter((c) => c != null && c !== false));
}

/** Link „Auf Wikipedia nachlesen“ (#15) – oder null, wenn es keinen gibt. */
function wikiLink(entry, text = 'Auf Wikipedia nachlesen') {
  const href = wikiUrl(entry);
  return href ? h('a', { class: 'wiki-link', href, target: '_blank', rel: 'noopener' }, `${text} ↗`) : null;
}

// Alles, was vom Inhalt abhängt, kommt aus der aktuellen Spielwelt.
const W = () => weltOf(state);
const byBereichCache = new Map();
function entriesOf(bereich) {
  const w = W();
  if (!byBereichCache.has(w.id)) {
    byBereichCache.set(w.id, Object.fromEntries(w.bereiche.map((b) => [b.id, w.entries.filter((e) => e.cat === b.id)])));
  }
  return byBereichCache.get(w.id)[bereich] ?? [];
}
const openBereiche = () => W().bereiche.filter((b) => isOpen(state, b.id));

// ---------- Eingabe ----------

const form = $('eingabe-form');
const input = $('eingabe');
const recent = []; // Liste „Zuletzt eingetragen“

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value;
  const result = submit(state, text);
  if (result.status === 'leer') return;
  if (result.status === 'vorbei') { showCountdownEnd(); return; }
  if (result.timeBonus > 0) showTimeBonus(result.timeBonus);

  showFeedback(result, text);
  flash(result.gained > 0 ? 'treffer' : 'wackeln');
  if (result.gained > 0) floatPoints(result.gained);
  addHistory(result, text);
  input.value = '';

  if (result.items.some((i) => i.art === 'neu' || i.art === 'wert')) {
    renderCodex();
    renderBereiche(true);
    renderHint();
    saveLocal(state);
  }
});

function flash(cls) {
  form.classList.remove('treffer', 'wackeln');
  void form.offsetWidth; // Animation neu starten
  form.classList.add(cls);
  setTimeout(() => form.classList.remove(cls), 600);
}

function floatPoints(points) {
  const el = h('span', { class: 'plus' }, `+${fmt(points)}`);
  el.style.left = `${20 + Math.random() * 50}%`;
  $('plus-ebene').append(el);
  setTimeout(() => el.remove(), 1300);
}

const ART_TEXT = {
  neu: 'Neu entdeckt!',
  wert: 'Wert gewusst!',
  wiederholung: 'Schon bekannt – kleines Trinkgeld',
  wertWiederholung: 'Wert schon bekannt – kleines Trinkgeld',
};

function lockedHint(locked) {
  const names = [...new Set(locked.map((e) => BEREICH_NAMES[e.cat]))];
  return `Gehört zum Bereich ${names.join(' bzw. ')} – den kannst du im Reiter „Bereiche“ freischalten.`;
}

function showFeedback(result, text) {
  const box = $('rueckmeldung');
  box.replaceChildren();

  if (result.status === 'gesperrt') {
    box.append(
      h('p', { class: 'titel warn' }, 'Richtig – aber dieser Bereich ist noch gesperrt.'),
      h('p', { class: 'hinweis' }, lockedHint(result.locked)),
    );
    return;
  }
  if (result.status === 'unbekannt') {
    const open = openBereiche().map((b) => b.name).join(', ');
    const w = W();
    box.append(
      h('p', { class: 'titel schlecht' }, w.klasse ? `Das gehört nicht zum Stoff von ${w.name}.` : 'Das kenne ich (noch) nicht.'),
      h('p', { class: 'hinweis' }, isRelation(text)
        ? 'Formeln vergleiche ich ohne Leerzeichen und Malpunkte, Seiten und Faktoren dürfen vertauscht sein. Vielleicht fehlt diese Form noch in der Datenbank.'
        : `Vielleicht ein Tippfehler – oder der Begriff fehlt noch in der Datenbank. Offen sind gerade: ${open}.`),
      w.klasse && FREI.index.byKey.has(`w:${normWord(text)}`)
        ? h('p', { class: 'hinweis' }, 'Im freien Spiel gibt es diesen Begriff – oben über die Moduswahl erreichbar.')
        : null,
    );
    return;
  }
  if (result.status === 'wertFalsch') {
    box.append(
      h('p', { class: 'titel warn' }, `${result.entry.name}: Der Wert stimmt nicht ganz.`),
      h('p', { class: 'hinweis' }, 'Ich akzeptiere bis zu 0,5 % Abweichung. Schreibweisen wie 6,626e-34 oder 6,626·10^-34 gehen beide.'),
    );
    return;
  }
  if (result.status === 'einheitFalsch') {
    box.append(
      h('p', { class: 'titel warn' }, `${result.entry.name}: Der Wert stimmt, aber die Einheit nicht.`),
      h('p', { class: 'hinweis' }, 'Lass die Einheit weg oder prüfe sie noch einmal.'),
    );
    return;
  }

  const titleClass = result.gained > 0 ? 'titel gut' : 'titel warn';
  const title = result.gained > 0 ? `+${fmt(result.gained)} Erkenntnis` : 'Gerade erst eingegeben';
  box.append(h('p', { class: titleClass }, title));
  if (result.fuzzy) box.append(h('p', { class: 'hinweis' }, 'Fast richtig geschrieben – ich habe es trotzdem gewertet.'));

  const factShown = new Set();
  for (const item of result.items) {
    const { entry } = item;
    const isNew = item.art === 'neu' || item.art === 'wert';
    const showFact = isNew && !factShown.has(entry.id);
    factShown.add(entry.id);
    const art = item.art === 'abklingend'
      ? `Schon eingegeben – in ${item.waitSeconds} s wieder etwas wert`
      : ART_TEXT[item.art];
    box.append(h('div', { class: 'fund' },
      h('div', { class: 'fund-kopf' },
        h('span', { class: `fund-name ${entry.cat}` }, entry.name),
        h('span', { class: `marke${isNew ? ' neu' : ''}` }, BEREICH_NAMES[entry.cat]),
        h('span', { class: 'marke' }, AREA_NAMES[entry.area]),
        h('span', { class: `fund-punkte${item.points ? '' : ' null'}` }, item.points ? `+${fmt(item.points)}` : '±0'),
      ),
      h('div', { class: 'fund-art' }, art),
      showFact ? h('p', { class: 'fund-fakt' }, entry.fact) : null,
    ));
  }
  if (result.locked.length) box.append(h('p', { class: 'hinweis' }, `Außerdem: ${lockedHint(result.locked)}`));
  if (result.boost) {
    box.append(h('p', { class: 'hinweis' }, `${result.boost.name}: ×${fmt(result.boost.factor)}`));
  }
  if (result.combo > 1) {
    box.append(h('p', { class: 'hinweis' }, `Combo ${result.combo} – alles ×${fmt(result.multiplier)}`));
  }
}

function addHistory(result, text) {
  const names = [...new Set(result.items.map((i) => i.entry.name))];
  pushHistory(result.gained, names.length ? names.join(' / ') : text);
}

function pushHistory(points, label) {
  recent.unshift({ points, label });
  recent.length = Math.min(recent.length, 8);
  $('verlauf').replaceChildren(...recent.map((e) => h('li', {},
    h('span', { class: `p${e.points ? '' : ' null'}` }, e.points ? `+${fmt(e.points)}` : '–'),
    h('span', { class: 't', title: e.label }, e.label),
  )));
}

/** Platzhalter und Hilfetext zeigen nur, was gerade eingegeben werden kann. */
function renderInputHints() {
  const open = openBereiche();
  const examples = open.map((b) => b.beispiel.split(', ')[0]);
  input.placeholder = `z. B. ${examples.slice(0, 3).join(', ')} …`;
  $('hilfe').textContent = `Offen: ${open.map((b) => b.name).join(', ')}.`
    + (open.length < W().bereiche.length ? ' Weitere Bereiche schaltest du im Reiter „Bereiche“ frei.' : '');
}

// ---------- Sonderzeichen-Tastatur (#13) ----------

// Zeichen, die man für Formeln und Einheiten braucht, aber auf der normalen
// (Handy-)Tastatur kaum findet. Großbuchstaben wie Δ werden beim Vergleichen
// ohnehin zu Kleinbuchstaben – sie stehen hier nur, weil man sie so kennt.
const ZEICHEN = [
  ['Griechisch', 'α β γ δ ε η θ λ μ ν π ρ σ τ φ ψ ω Δ Φ Ω ħ'],
  ['Hoch & tief', '² ³ ⁴ ¹ ⁰ ⁻ ^ ₀ ₁ ₂', 'klein'],
  ['Zeichen', '· × / √ ½ ∝ ∂ ∞ ° ≥ ( )'],
];
const TASTATUR_KEY = 'physicsclicker-tastatur';

let keyboardOpen = (() => {
  try { return localStorage.getItem(TASTATUR_KEY) === 'offen'; } catch { return false; }
})();

/** Setzt Text an der Schreibmarke ein, als hätte man ihn getippt. */
function insertAtCursor(field, text) {
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? start;
  field.setRangeText(text, start, end, 'end');
  field.focus();
}

/** Alle Tastaturen (Eingabe und Fragenfenster) gemeinsam auf- oder zuklappen. */
function setKeyboardOpen(open) {
  keyboardOpen = open;
  try { localStorage.setItem(TASTATUR_KEY, open ? 'offen' : 'zu'); } catch { /* egal */ }
  for (const panel of document.querySelectorAll('.tastatur')) panel.hidden = !open;
  for (const button of document.querySelectorAll('.tastatur-knopf')) button.setAttribute('aria-expanded', String(open));
}

// Knöpfe sollen der Eingabe den Fokus nicht wegnehmen – sonst springt auf dem
// Handy bei jedem Zeichen die Systemtastatur weg und die Schreibmarke ist verloren.
const keepFocus = (event) => event.preventDefault();

/** Ausklappbare Zeichenleiste für ein Eingabefeld. */
function charKeyboard(field, id) {
  const panel = h('div', { class: 'tastatur', id, hidden: !keyboardOpen },
    ZEICHEN.map(([name, chars, art]) => h('div', { class: `tasten-gruppe${art ? ` ${art}` : ''}`, role: 'group', 'aria-label': name },
      h('span', { class: 'tasten-name' }, name),
      chars.split(' ').map((c) => h('button', {
        type: 'button', class: 'taste', 'aria-label': `${c} einfügen`,
        onmousedown: keepFocus, onclick: () => insertAtCursor(field, c),
      }, c)))));
  const toggle = h('button', {
    type: 'button', class: 'tastatur-knopf', 'aria-expanded': String(keyboardOpen), 'aria-controls': id,
    onmousedown: keepFocus, onclick: () => setKeyboardOpen(!keyboardOpen),
  }, h('span', { 'aria-hidden': 'true' }, 'λ²'), ' Sonderzeichen');
  return h('div', { class: 'tastatur-bereich' }, toggle, panel);
}

$('tastatur-platz').replaceWith(charKeyboard(input, 'tastatur-eingabe'));

// ---------- Reiter ----------

for (const tab of document.querySelectorAll('[role="tab"]')) {
  tab.addEventListener('click', () => {
    for (const t of document.querySelectorAll('[role="tab"]')) {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      $(`tab-${t.dataset.tab}`).hidden = !active;
    }
    if (tab.dataset.tab === 'optionen') renderStats();
    if (tab.dataset.tab === 'fragen') renderQuestions();
  });
}

// ---------- Bereiche ----------

let bereicheSignature = '';

function renderBereiche(force = false) {
  const price = unlockPrice(state);
  const signature = state.welt + '|' + state.unlocked.join(',') + '|' + discoveryCount(state);
  const list = $('bereiche');

  if (force || signature !== bereicheSignature) {
    bereicheSignature = signature;
    $('naechster-preis').textContent = price == null
      ? 'Alle Bereiche sind offen.'
      : `Der nächste Bereich kostet ${fmt(price)} Erkenntnis – welcher, entscheidest du.`;

    list.replaceChildren(...W().bereiche.map((b) => {
      const total = entriesOf(b.id).length;
      if (isOpen(state, b.id)) {
        const found = bereichCount(state, b.id);
        return h('li', { class: 'bereich offen' },
          h('div', { class: 'kopf' },
            h('span', { class: 'name' }, b.name),
            h('span', { class: 'status' }, `${found}/${total}`)),
          h('div', { class: 'beschr' }, b.desc),
          h('div', { class: 'beispiel' }, `z. B. ${b.beispiel}`),
          h('div', { class: 'fortschritt' }, bar(found / total)));
      }
      return h('li', { class: 'bereich gesperrt' },
        h('div', { class: 'kopf' },
          h('span', { class: 'name' }, b.name),
          h('span', { class: 'status' }, `${total} Einträge`)),
        h('div', { class: 'beschr' }, b.desc),
        h('div', { class: 'beispiel' }, `z. B. ${b.beispiel}`),
        h('button', {
          type: 'button', class: 'freischalten', 'data-preis': price,
          onclick: () => {
            if (!buyBereich(state, b.id)) return;
            saveLocal(state);
            renderBereiche(true);
            renderCodex();
            renderQuestions();
            renderInputHints();
            update();
            input.focus();
          },
        }, `Freischalten · ${fmt(price)} Erkenntnis`));
    }));
  }

  for (const button of list.querySelectorAll('.freischalten')) {
    button.disabled = state.insight < Number(button.dataset.preis);
  }
}

// ---------- Overlays (große Fragenansicht, Hilfe) ----------

// Jedes Overlay legt einen Eintrag in den Browserverlauf. So schließt die
// Zurück-Taste von Browser oder Handy das Overlay statt die Seite zu verlassen.
const overlays = {
  frage: $('frage-overlay'), hilfe: $('hilfe-overlay'), mindmap: $('mindmap-overlay'), countdown: $('countdown-overlay'),
  start: $('start-overlay'),
};
let activeOverlay = null;
let overlayReturnFocus = null;

function openOverlay(name) {
  if (activeOverlay === name) return;
  if (activeOverlay) hideOverlay();
  else window.history.pushState({ overlay: name }, '');
  overlayReturnFocus = document.activeElement;
  overlays[name].hidden = false;
  activeOverlay = name;
  document.body.classList.add('overlay-offen');
}

/** Schließt über den Verlauf – dadurch bleibt die Zurück-Taste konsistent. */
function closeOverlay() {
  if (!activeOverlay) return;
  if (window.history.state?.overlay) window.history.back();
  else hideOverlay();
}

function hideOverlay() {
  if (!activeOverlay) return;
  const closed = activeOverlay;
  overlays[activeOverlay].hidden = true;
  activeOverlay = null;
  document.body.classList.remove('overlay-offen');
  overlayReturnFocus?.focus?.();
  // Wer das Ende-Fenster einer Countdown-Runde schließt, kehrt ins normale Spiel zurück.
  if (closed === 'countdown' && state.countdown && countdownOver(state)) leaveCountdown();
}

window.addEventListener('popstate', hideOverlay);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeOverlay) {
    event.preventDefault();
    closeOverlay();
  }
});
for (const overlay of Object.values(overlays)) {
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeOverlay(); });
}

// ---------- Hilfe (Fragezeichen) ----------

const pct = (x) => `${fmt(x * 100)} %`;
const secs = (ms) => `${fmt(ms / 1000)} Sekunden`;

/** Baut die Anleitung aus den echten Spielwerten – sie bleibt so immer aktuell. */
function renderHelp() {
  const table = (head, rows) => h('table', { class: 'hilfe-tabelle' },
    h('thead', {}, h('tr', {}, head.map((x) => h('th', {}, x)))),
    h('tbody', {}, rows.map((r) => h('tr', {}, r.map((x) => h('td', {}, x))))));

  $('hilfe-inhalt').replaceChildren(
    h('div', { class: 'overlay-leiste' },
      h('button', { type: 'button', class: 'zurueck', onclick: closeOverlay }, '← Zurück'),
      h('span', { class: 'overlay-info' }, 'Anleitung')),
    h('h2', { id: 'hilfe-titel' }, 'So funktioniert PhysicsClicker'),
    h('p', {}, 'Tippe Physikwissen in das Eingabefeld – Namen, Begriffe, Formeln oder Konstanten. '
      + 'Jede richtige Eingabe bringt Erkenntnis, die Spielwährung. Erkenntnis gibt es ausschließlich '
      + 'für deine Eingaben und Antworten: Nichts läuft von selbst.'),
    h('p', {}, (W().klasse ? 'Zu Beginn sind nur „Größen & Begriffe“ offen.' : 'Zu Beginn kannst du nur Physikerinnen und Physiker eingeben.')
      + ' Mit Erkenntnis schaltest du im Reiter „Bereiche“ weitere Bereiche frei – in der Reihenfolge, die du willst. '
      + 'Alles, was du entdeckst, sammelt sich mit einem Fun Fact im Codex.'),

    h('h3', {}, 'Punkte für Eingaben'),
    table(['Stufe', 'Erstentdeckung'], [1, 2, 3, 4, 5].map((t) => [`Stufe ${t}`, `${fmt(C.TIER_POINTS[t])} Erkenntnis`])),
    h('ul', {},
      h('li', {}, (W().klasse ? 'In den Klassenstufen ist Stufe 1 Grundwissen und Stufe 4 Zusatzwissen.' : 'Stufe 1 ist Schulwissen, Stufe 5 Spezialwissen.')
        + ' Jeder Eintrag zählt beim ersten Mal voll.'),
      h('li', {}, `Konstante mit richtigem Wert (z. B. c = 3·10^8 m/s): zusätzlich das ${fmt(C.VALUE_FACTOR)}-Fache.`),
      h('li', {}, `Wiederholung: ${pct(C.REPEAT_SHARE)} des Werts als Trinkgeld – höchstens alle ${secs(C.REPEAT_COOLDOWN_MS)} pro Eintrag.`),
      h('li', {}, `Combo: Jeder Treffer innerhalb von ${secs(C.COMBO_WINDOW_MS)} nach dem letzten erhöht den Wert um ${pct(C.COMBO_STEP)}, bis höchstens ×${fmt(C.COMBO_MAX)}.`),
      h('li', {}, 'Einträge aus gesperrten Bereichen werden erkannt, bringen aber noch nichts.')),

    h('h3', {}, 'Fragen'),
    h('p', {}, `Jede Frage im Fragekatalog bringt einmalig das ${fmt(C.QUESTION_FACTOR)}-Fache ihrer Stufe, `
      + `also zwischen ${fmt(C.TIER_POINTS[1] * C.QUESTION_FACTOR)} und ${fmt(C.TIER_POINTS[5] * C.QUESTION_FACTOR)} Erkenntnis. `
      + `Nach ${C.QUESTION_TRIES} Fehlversuchen kannst du eine Frage auflösen – dann ohne Punkte.`),

    h('h3', {}, 'Bereiche freischalten'),
    h('p', {}, W().klasse
      ? `Du spielst ${W().name}: nur Inhalte dieser Klassenstufe, mit Stufen innerhalb der Klasse (1 = Grundwissen, 4 = Zusatzwissen). Die Preise passen sich der Klasse an.`
      : 'Du spielst das freie Spiel mit der ganzen Wissensdatenbank.'),
    table(['Freischaltung', 'Preis'], W().prices.slice(0, W().bereiche.length - W().start.length)
      .map((p, i) => [`${i + 1}. Bereich`, `${fmt(p)} Erkenntnis`])),

    h('h3', {}, 'Upgrades'),
    h('p', {}, `Einmalige Effekte für den richtigen Moment. Es wirkt immer nur ein Multiplikator gleichzeitig, `
      + `und jedes Upgrade wird mit jedem Kauf um ${pct(C.BOOST_PRICE_GROWTH - 1)} teurer.`),
    table(['Upgrade', 'Startpreis', 'Wirkung'], BOOSTS.map((b) => [b.name, fmt(b.price), b.desc])),

    h('h3', {}, 'Tipps zur Eingabe'),
    h('ul', {},
      h('li', {}, 'Groß- und Kleinschreibung, Leerzeichen und Bindestriche sind egal; „oe“ geht statt „ö“.'),
      h('li', {}, 'Formeln mit „=“: Malpunkte und Reihenfolge sind egal, F = m·a ist dasselbe wie ma = F. Hochzahlen als ² oder ^2.'),
      h('li', {}, 'Konstanten mit Wert: h = 6,626·10^-34 Js oder h = 6.626e-34. Die Einheit ist freiwillig.'),
      h('li', {}, 'Kleine Tippfehler in langen Begriffen werden verziehen.'),
      h('li', {}, 'Griechische Buchstaben, Hochzahlen und Zeichen wie √ findest du unter „λ² Sonderzeichen“ – oder du schreibst sie aus: lambda, sqrt, ^2.')),
  );
}

$('hilfe-knopf').addEventListener('click', () => {
  renderHelp();
  openOverlay('hilfe');
  $('hilfe-inhalt').querySelector('.zurueck').focus();
});

// ---------- Startbildschirm und Moduswahl (#16) ----------

/** Kurzer Stand einer Welt für den Startbildschirm, ohne sie zu wechseln. */
function worldProgress(w) {
  const s = w.id === state.welt && !state.countdown ? state : loadLocal(w.id);
  if (!s && !hasSave(w.id)) return null;
  return { found: s ? discoveryCount(s) : 0, total: w.entries.length };
}

function renderStart() {
  const current = W();
  const frei = worldProgress(FREI);
  fill($('start-inhalt'),
    h('h2', { id: 'start-titel' }, 'Wie möchtest du spielen?'),
    h('p', { class: 'start-intro' }, 'Jeder Modus hat seinen eigenen Spielstand. Wechseln kannst du jederzeit oben über den Modus-Knopf.'),
    h('button', { type: 'button', class: 'primaer start-weiter', onclick: closeOverlay }, `Weiter mit ${current.name} →`),
    h('div', { class: 'start-wahl' },
      h('button', {
        type: 'button', class: `start-karte${current.id === 'frei' ? ' aktiv' : ''}`, onclick: () => chooseWelt('frei'),
      },
      h('span', { class: 'start-name' }, 'Freies Spiel'),
      h('span', { class: 'start-beschr' }, `Die ganze Wissensdatenbank mit ${fmt(FREI.entries.length)} Einträgen und `
        + `${fmt(FREI.questions.length)} Fragen – von Archimedes bis zur Quantenphysik.`),
      frei ? h('span', { class: 'start-stand' }, `Dein Stand: ${fmt(frei.found)} von ${fmt(frei.total)} entdeckt`) : null),
      h('div', { class: `start-karte${current.klasse ? ' aktiv' : ''}` },
        h('span', { class: 'start-name' }, 'Nach Klassenstufe'),
        h('span', { class: 'start-beschr' }, 'Nur der Stoff deiner Klasse am Gymnasium – Begriffe, Formeln, Geräte, Versuche und eigene Fragen. '
          + 'Ideal zum Lernen und Wiederholen.'),
        h('div', { class: 'klassen-raster', role: 'group', 'aria-label': 'Klassenstufe wählen' },
          KLASSEN_WELTEN.map((w) => {
            const p = worldProgress(w);
            return h('button', {
              type: 'button', class: `klasse-knopf${current.id === w.id ? ' aktiv' : ''}`,
              title: w.info.themen.join(' · '), onclick: () => chooseWelt(w.id),
            },
            h('span', { class: 'klasse-zahl' }, h('small', {}, 'Klasse'), w.klasse),
            h('span', { class: 'klasse-stand' }, p ? `${p.found}/${p.total}` : `${w.entries.length} Einträge`));
          })),
        h('details', { class: 'klassen-themen' },
          h('summary', {}, 'Was kommt in welcher Klasse dran?'),
          h('dl', {}, KLASSEN_WELTEN.map((w) => [h('dt', {}, w.name), h('dd', {}, w.info.themen.join(' · '))]))),
        h('p', { class: 'start-quelle' }, 'Grundlage: Kerncurricula für das Gymnasium in Niedersachsen (Naturwissenschaften 5–10, Physik Sek II). '
          + 'Die Kerncurricula legen Doppeljahrgänge fest – die Aufteilung auf einzelne Klassen folgt der Zuordnungstabelle im Kerncurriculum und kann an deiner Schule abweichen.'))),
  );
}

function openStart() {
  renderStart();
  openOverlay('start');
  $('start-inhalt').querySelector('.start-weiter').focus();
}

/** Wechselt in eine andere Spielwelt und lädt deren eigenen Spielstand. */
function chooseWelt(id) {
  saveMode(id);
  if (id !== state.welt || state.countdown) {
    if (!state.countdown) saveLocal(state);
    state = loadLocal(id) ?? newState(id);
    countdownEndShown = false;
    recent.length = 0;
    $('verlauf').replaceChildren();
    fill($('rueckmeldung'), h('p', { class: 'leer' }, `Du spielst jetzt: ${W().name}. Viel Erfolg!`));
    rerenderAll();
  }
  closeOverlay();
  input.focus();
}

$('modus-knopf').addEventListener('click', openStart);

// ---------- Mindmap (#11) ----------

const closedAreas = new Set(); // zugeklappte Gebiete bleiben zu, solange die Seite offen ist

/** Ein Knoten: Name, wenn entdeckt – sonst ein Fragezeichen. */
function mindmapChip(n, withCategory = false) {
  return n.known
    ? h('span', { class: `mm-knoten bekannt ${n.cat}`, title: `${CATEGORIES[n.cat]} · Stufe ${n.tier}` }, n.name)
    : h('span', { class: 'mm-knoten unbekannt', title: `Noch nicht entdeckt: ${CATEGORIES[n.cat]}, Stufe ${n.tier}` },
      withCategory ? `? ${CATEGORIES[n.cat]}` : '?', h('sub', {}, n.tier));
}

function renderMindmap() {
  const map = mindmap(state);
  const found = map.areas.reduce((s, a) => s + a.found, 0);
  const total = map.areas.reduce((s, a) => s + a.total, 0);

  fill($('mindmap-inhalt'),
    h('div', { class: 'overlay-leiste' },
      h('button', { type: 'button', class: 'zurueck', onclick: closeOverlay }, '← Zurück'),
      h('span', { class: 'overlay-info' }, '? = noch nicht entdeckt')),
    h('h2', { id: 'mindmap-titel', class: 'mm-titel' }, 'Mindmap'),
    h('div', { class: 'mm-wurzel' },
      h('span', { class: 'mm-wurzel-name' }, 'Physik'),
      h('span', { class: 'mm-zahl' }, `${found}/${total} entdeckt`)),
    h('div', { class: 'mm-gebiete' }, map.areas.filter((a) => a.total > 0).map((a) => {
      const details = h('details', { class: `mm-gebiet g-${a.id}`, open: !closedAreas.has(a.id) },
        h('summary', {},
          h('span', { class: 'mm-gebiet-name' }, a.name),
          h('span', { class: 'mm-zahl' }, a.missing ? `${a.found}/${a.total} · ${a.missing} fehlen` : `${a.total}/${a.total} ✓`)),
        h('ul', { class: 'mm-ast' }, a.bereiche.map((b) => h('li', { class: 'mm-bereich' },
          h('div', { class: 'mm-bereich-kopf' }, b.name, h('span', { class: 'mm-zahl' }, `${b.found}/${b.total}`)),
          h('div', { class: 'mm-knoten-liste' }, b.nodes.map((n) => (n.links?.length
            ? h('div', { class: 'mm-person' },
              mindmapChip(n),
              h('div', { class: 'mm-bezuege', 'aria-label': `Bezüge von ${n.name}` }, n.links.map((x) => mindmapChip(x, true))))
            : mindmapChip(n))))))));
      details.addEventListener('toggle', () => {
        if (details.open) closedAreas.delete(a.id); else closedAreas.add(a.id);
      });
      return details;
    })),
    map.locked.length
      ? h('p', { class: 'mm-gesperrt' }, `Noch gesperrt und deshalb nicht in der Mindmap: ${map.locked.join(', ')}.`)
      : null,
    h('p', { class: 'mm-gesperrt' }, 'Entdeckte Personen zeigen, was zu ihnen gehört – zum Beispiel ihre Experimente oder Gesetze, sobald der Bereich offen ist.'),
  );
}

function openMindmap() {
  renderMindmap();
  openOverlay('mindmap');
  $('mindmap-inhalt').querySelector('.zurueck').focus();
}
$('mindmap-knopf').addEventListener('click', openMindmap);
$('mindmap-codex').addEventListener('click', openMindmap);

// ---------- Fragen ----------

let currentQuestion = null;   // ID der groß angezeigten Frage
let questionFeedback = null;  // { text, cls }
let questionSolved = null;    // Ergebnis einer gerade richtig beantworteten Frage

function renderQuestions() {
  const { questions: QUESTIONS } = W();
  const solved = QUESTIONS.filter((q) => questionStatus(state, q) === 'richtig').length;
  $('fragen-zahl').textContent = `${solved}/${QUESTIONS.length}`;

  $('fragen').replaceChildren(...W().bereiche.map((b) => {
    const questions = QUESTIONS.filter((q) => q.bereich === b.id);
    if (!questions.length) return null;
    if (!isOpen(state, b.id)) {
      return h('section', { class: 'fragen-gruppe zu' },
        h('h3', {}, `🔒 ${b.name}`, h('span', { class: 'zahl' }, `${questions.length} Fragen`)),
        h('p', { class: 'offen' }, 'Schalte den Bereich frei, um diese Fragen zu beantworten.'));
    }
    const done = questions.filter((q) => questionStatus(state, q) === 'richtig').length;
    return h('section', { class: 'fragen-gruppe' },
      h('h3', {}, b.name, h('span', { class: 'zahl' }, `${done}/${questions.length}`)),
      h('ul', { class: 'fragen-liste' }, questions.map(renderQuestionRow)));
  }));
}

function renderQuestionRow(q) {
  const status = questionStatus(state, q);
  const badge = { offen: `+${fmt(questionPoints(q))}`, richtig: '✓', aufgeloest: 'aufgelöst' }[status];
  const li = h('li', { class: `frage ${status}` },
    h('button', {
      type: 'button', class: 'frage-kopf', disabled: status !== 'offen', 'data-frage': q.id,
      onclick: () => showQuestion(q.id),
    }, h('span', { class: 'frage-text' }, q.frage), h('span', { class: 'frage-punkte' }, badge)));
  if (status !== 'offen') {
    const entry = W().index.byId.get(q.antwort);
    li.append(h('div', { class: 'frage-loesung' }, `Antwort: ${entry.name}`, wikiLink(entry, 'Wikipedia')));
  }
  return li;
}

/** Öffnet eine Frage groß im Overlay. */
function showQuestion(id) {
  currentQuestion = id;
  questionFeedback = null;
  questionSolved = null;
  openOverlay('frage');
  renderQuestionView();
}

function renderQuestionView() {
  const q = W().questionById.get(currentQuestion);
  const card = $('frage-gross');
  if (!q) return;

  const top = h('div', { class: 'overlay-leiste' },
    h('button', { type: 'button', class: 'zurueck', onclick: closeOverlay }, '← Zurück'),
    h('span', { class: 'overlay-info' }, `${BEREICH_NAMES[q.bereich]} · Stufe ${q.tier}`));

  if (questionSolved) {
    const { entry, points, boost } = questionSolved;
    const next = nextOpenQuestion(state, q.id);
    fill(card, top,
      h('p', { class: 'frage-gross-text' }, q.frage),
      h('div', { class: 'frage-erfolg' },
        h('p', { class: 'titel gut' }, `Richtig! +${fmt(points)} Erkenntnis`),
        h('p', { class: 'loesung' }, entry.name),
        h('p', { class: 'hinweis' }, entry.fact),
        boost ? h('p', { class: 'hinweis' }, `${boost.name}: ×${fmt(boost.factor)}`) : null,
        wikiLink(entry)),
      h('div', { class: 'knopfreihe' },
        next ? h('button', { type: 'button', class: 'primaer', onclick: () => showQuestionInPlace(next.id) }, 'Nächste Frage →') : null,
        h('button', { type: 'button', class: 'zweitrangig', onclick: closeOverlay }, 'Zurück zur Liste')));
    card.querySelector('.primaer, .zweitrangig').focus();
    return;
  }

  const next = nextOpenQuestion(state, q.id);
  const field = h('input', {
    type: 'text', id: 'frage-antwort', spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off',
    placeholder: q.wert ? 'Zahl mit Einheit, z. B. 3·10^8 m/s' : 'Deine Antwort …',
  });
  fill(card, top,
    h('label', { class: 'frage-gross-text', for: 'frage-antwort', id: 'frage-titel' }, q.frage),
    h('p', { class: 'frage-wert' }, `+${fmt(questionPoints(q))} Erkenntnis`),
    h('form', {
      class: 'antwort-gross',
      onsubmit: (event) => {
        event.preventDefault();
        const result = answerQuestion(state, q.id, field.value);
        if (result.status === 'leer') return;
        if (result.status === 'vorbei') { showCountdownEnd(); return; }
        if (result.status === 'richtig') {
          if (result.timeBonus > 0) showTimeBonus(result.timeBonus);
          questionSolved = result;
          floatPoints(result.points);
          showQuestionResult(q, result);
          renderHint();
          saveLocal(state);
        } else if (result.status === 'falsch') {
          questionFeedback = { cls: 'schlecht', text: result.canReveal
            ? `Leider nicht richtig (${result.attempts}. Versuch). Du kannst die Frage jetzt auflösen.`
            : `Leider nicht richtig (${result.attempts}. Versuch).` };
        }
        renderQuestionView();
        renderQuestions();
        update();
      },
    }, field, h('button', { type: 'submit' }, 'Antworten')),
    charKeyboard(field, 'tastatur-frage'),
    questionFeedback ? h('p', { class: `frage-meldung ${questionFeedback.cls}` }, questionFeedback.text) : null,
    next ? h('button', {
      type: 'button', class: 'ueberspringen', title: 'Diese Frage erst einmal auslassen – sie bleibt offen.',
      onclick: () => showQuestionInPlace(next.id),
    }, 'Überspringen →') : null,
    canReveal(state, q) ? h('button', {
      type: 'button', class: 'aufloesen',
      onclick: () => {
        const entry = revealQuestion(state, q.id);
        if (!entry) return;
        saveLocal(state);
        questionFeedback = null;
        renderQuestions();
        const after = nextOpenQuestion(state, q.id);
        fill(card, top,
          h('p', { class: 'frage-gross-text' }, q.frage),
          h('div', { class: 'frage-erfolg' },
            h('p', { class: 'titel' }, 'Aufgelöst – diesmal ohne Punkte.'),
            h('p', { class: 'loesung' }, entry.name),
            h('p', { class: 'hinweis' }, entry.fact),
            wikiLink(entry)),
          h('div', { class: 'knopfreihe' },
            after ? h('button', { type: 'button', class: 'primaer', onclick: () => showQuestionInPlace(after.id) }, 'Nächste Frage →') : null,
            h('button', { type: 'button', class: 'zweitrangig', onclick: closeOverlay }, 'Zurück zur Liste')));
        card.querySelector('.primaer, .zweitrangig').focus();
      },
    }, 'Auflösen') : null);
  field.focus();
}

/** Wechselt im offenen Overlay zur nächsten Frage, ohne einen neuen Verlaufseintrag. */
function showQuestionInPlace(id) {
  currentQuestion = id;
  questionFeedback = null;
  questionSolved = null;
  renderQuestionView();
}

/** Zeigt eine richtige Antwort auch in der großen Rückmeldung links. */
function showQuestionResult(q, result) {
  const box = $('rueckmeldung');
  fill(box, [
    h('p', { class: 'titel gut' }, `+${fmt(result.points)} Erkenntnis – Frage richtig beantwortet`),
    h('div', { class: 'fund' },
      h('div', { class: 'fund-kopf' },
        h('span', { class: `fund-name ${result.entry.cat}` }, result.entry.name),
        h('span', { class: 'marke neu' }, 'Frage'),
        h('span', { class: 'fund-punkte' }, `+${fmt(result.points)}`)),
      h('div', { class: 'fund-art' }, q.frage),
      h('p', { class: 'fund-fakt' }, result.entry.fact)),
    result.boost ? h('p', { class: 'hinweis' }, `${result.boost.name}: ×${fmt(result.boost.factor)}`) : null,
  ]);
  pushHistory(result.points, `Frage: ${result.entry.name}`);
}

// ---------- Upgrades ----------

let boostSignature = '';

function renderBoosts(force = false) {
  const now = Date.now();
  const signature = BOOSTS.map((b) => `${boostPrice(state, b.id)}|${boostBlocked(state, b.id, now)}`).join(',');
  const list = $('upgrades');
  if (force || signature !== boostSignature) {
    boostSignature = signature;
    list.replaceChildren(...BOOSTS.map((b) => {
      const blocked = boostBlocked(state, b.id, now);
      const price = boostPrice(state, b.id);
      return h('li', {}, h('button', {
        type: 'button', class: 'upgrade', 'data-preis': price, 'data-blockiert': blocked ? '1' : '',
        onclick: () => {
          if (!buyBoost(state, b.id)) return;
          saveLocal(state);
          renderBoosts(true);
          renderHint();
          update();
          input.focus();
        },
      },
      h('span', { class: 'name' }, b.name),
      h('span', { class: 'beschr' }, b.desc),
      h('span', { class: 'preis' }, blocked ?? `${fmt(price)} Erkenntnis`)));
    }));
  }
  for (const button of list.querySelectorAll('.upgrade')) {
    button.disabled = Boolean(button.dataset.blockiert) || state.insight < Number(button.dataset.preis);
  }
}

/** Kleine Plaketten unter dem Eingabefeld für alles, was gerade wirkt. */
function renderActive(now) {
  const b = state.boosts;
  const chips = [];
  if (b.mult) {
    const name = BOOSTS.find((x) => x.id === b.mult.id).name;
    chips.push(`${name} ×${fmt(b.mult.factor)}` + (b.mult.uses > 1 ? ` (noch ${b.mult.uses})` : ''));
  }
  if (now < b.comboUntil) chips.push(`Kaffeepause ${Math.ceil((b.comboUntil - now) / 1000)} s`);
  if (now < b.noCooldownUntil) chips.push(`Eselsbrücke ${Math.ceil((b.noCooldownUntil - now) / 1000)} s`);
  const text = chips.join('|');
  const list = $('aktiv');
  if (list.dataset.text !== text) {
    list.dataset.text = text;
    list.replaceChildren(...chips.map((c) => h('li', {}, c)));
  }
}

/** Der Spickzettel verrät Bereich, Gebiet, Anfangsbuchstaben und den Fun Fact – ohne den Namen. */
function renderHint() {
  const card = $('spickzettel');
  const entry = state.boosts.hint ? W().index.byId.get(state.boosts.hint) : null;
  card.hidden = !entry;
  if (!entry) return;
  const words = [entry.name, ...entry.aliases]
    .flatMap((n) => n.split(/[^\p{L}]+/u))
    .filter((w) => w.length >= 4);
  let fact = entry.fact;
  for (const w of words) fact = fact.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '…');
  fill(card,
    h('p', { class: 'titel' }, '📝 Spickzettel'),
    h('p', {}, `Gesucht: ${CATEGORIES[entry.cat]} aus ${AREA_NAMES[entry.area]}, Stufe ${entry.tier}, beginnt mit „${entry.name[0]}“.`),
    h('p', { class: 'hinweis' }, fact),
  );
}

// ---------- Codex ----------

const openSections = new Set();

function renderCodex() {
  const total = W().entries.length;
  const found = discoveryCount(state);
  $('codex-zahl').textContent = `${found}/${total}`;

  $('codex').replaceChildren(
    h('div', { class: 'codex-gesamt' },
      h('strong', {}, `${found} von ${total} Einträgen entdeckt`),
      h('div', { class: 'fortschritt' }, bar(found / total))),
    ...W().bereiche.map((b) => {
      const entries = entriesOf(b.id);
      const known = entries.filter((e) => state.discovered[e.id] != null)
        .sort((x, y) => x.tier - y.tier || x.name.localeCompare(y.name, 'de'));
      const open = isOpen(state, b.id);
      const missingByTier = [1, 2, 3, 4, 5]
        .map((t) => [t, entries.filter((e) => e.tier === t && state.discovered[e.id] == null).length])
        .filter(([, n]) => n > 0);

      const details = h('details', { class: `gebiet${open ? '' : ' zu'}`, open: openSections.has(b.id) },
        h('summary', {},
          h('span', { class: 'name' }, b.name + (open ? '' : ' (gesperrt)')),
          h('span', { class: 'zahl' }, `${known.length}/${entries.length}`),
          h('div', { class: 'fortschritt' }, bar(known.length / entries.length))),
        h('div', { class: 'gebiet-inhalt' },
          known.length
            ? h('ul', { class: 'codex-liste' }, known.map((e) => h('li', {},
              h('div', { class: 'kopfzeile' },
                h('span', { class: `name ${e.cat}` }, e.name),
                h('span', { class: 'marke' }, AREA_NAMES[e.area]),
                h('span', { class: 'marke' }, `Stufe ${e.tier}`),
                e.values ? h('span', { class: 'marke' }, state.values[e.id] != null ? '✓ Wert' : 'Wert fehlt') : null),
              h('p', { class: 'fakt' }, e.fact, ' ', wikiLink(e, 'Wikipedia')))))
            : h('p', { class: 'offen' }, open ? 'Noch nichts entdeckt.' : 'Schalte den Bereich frei, um hier Einträge zu sammeln.'),
          missingByTier.length
            ? h('p', { class: 'offen' }, 'Noch offen: ' + missingByTier.map(([t, n]) => `Stufe ${t}: ${n}`).join(' · '))
            : h('p', { class: 'offen' }, 'Bereich vollständig!')));
      details.addEventListener('toggle', () => {
        if (details.open) openSections.add(b.id); else openSections.delete(b.id);
      });
      return details;
    }),
  );
}

function bar(share) {
  const fill = h('span');
  fill.style.width = `${Math.min(100, share * 100).toFixed(1)}%`;
  return fill;
}

// ---------- Optionen ----------

function renderStats() {
  const rows = [
    ['Spielmodus', W().name],
    ['Entdeckungen', `${discoveryCount(state)} von ${W().entries.length}`],
    ['Offene Bereiche', `${state.unlocked.length} von ${W().bereiche.length}`],
    ['Konstanten mit Wert', Object.keys(state.values).length],
    ['Fragen beantwortet', `${Object.keys(state.answered).length} von ${W().questions.length}`],
    ['Eingaben', fmt(state.stats.inputs)],
    ['Davon gewertet', fmt(state.stats.hits)],
    ['Erkenntnis insgesamt', fmt(state.totalInsight)],
  ];
  $('statistik').replaceChildren(...rows.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]));
}

$('export-knopf').addEventListener('click', () => {
  const area = $('export-text');
  area.value = exportState(state);
  area.hidden = false;
  $('kopieren-knopf').hidden = false;
  area.select();
});

$('kopieren-knopf').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('export-text').value);
    $('kopieren-knopf').textContent = 'Kopiert!';
  } catch {
    $('export-text').select();
  }
});

$('import-knopf').addEventListener('click', () => {
  const message = $('import-meldung');
  try {
    state = importState($('import-text').value);
    saveLocal(state);
    saveMode(state.welt);
    $('import-text').value = '';
    message.textContent = 'Spielstand geladen.';
    message.className = 'meldung gut';
    rerenderAll();
  } catch (err) {
    message.textContent = err.message;
    message.className = 'meldung schlecht';
  }
});

$('reset-knopf').addEventListener('click', () => {
  if (!confirm(`Wirklich den Spielstand von „${W().name}“ löschen? Erkenntnis, freigeschaltete Bereiche und Codex gehen verloren.`)) return;
  clearLocal(state.welt);
  state = newState(state.welt);
  recent.length = 0;
  $('verlauf').replaceChildren();
  rerenderAll();
});

// ---------- Countdown-Modus (#12) ----------

const clock = (ms) => {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
let countdownEndShown = false;

function renderCountdownInfo() {
  $('countdown-erklaerung').textContent = `Eine eigene Testrunde (${W().name}) mit frischem Spielstand – dein normaler `
    + `Spielstand bleibt unberührt. Die Uhr startet bei ${clock(COUNTDOWN.startMs)} Minuten und läuft herunter. `
    + `Jede neue Entdeckung bringt Zeit zurück: von ${fmt(COUNTDOWN.bonusMs[1] / 1000)} Sekunden (Stufe 1) `
    + `bis ${fmt(COUNTDOWN.bonusMs[5] / 1000)} Sekunden (Stufe 5), Fragen das ${fmt(COUNTDOWN.questionFactor)}-Fache. `
    + `Bei 0:00 ist die Runde vorbei.`;
  const record = loadRecord(state.welt);
  $('countdown-rekord').textContent = record
    ? `Dein Rekord: ${fmt(record.insight)} Erkenntnis, ${record.found === 1 ? '1 Eintrag' : `${record.found} Einträge`}, `
      + `${clock(record.durationMs)} durchgehalten.`
    : '';
}

function startCountdown() {
  if (!state.countdown) saveLocal(state); // normalen Spielstand sichern
  state = newCountdownRun(Date.now(), state.welt);
  countdownEndShown = false;
  recent.length = 0;
  $('verlauf').replaceChildren();
  fill($('rueckmeldung'), h('p', { class: 'leer' }, 'Die Uhr läuft! Jede neue Entdeckung bringt Zeit zurück.'));
  document.querySelector('[data-tab="bereiche"]').click();
  rerenderAll();
  input.focus();
}

function leaveCountdown() {
  state = loadLocal(state.welt) ?? newState(state.welt);
  countdownEndShown = false;
  recent.length = 0;
  $('verlauf').replaceChildren();
  fill($('rueckmeldung'), h('p', { class: 'leer' }, 'Zurück im normalen Spiel.'));
  rerenderAll();
}

function showTimeBonus(ms) {
  const el = $('countdown-bonus');
  el.textContent = `+${fmt(ms / 1000)} s`;
  el.classList.remove('neu');
  void el.offsetWidth;
  el.classList.add('neu');
}

function showCountdownEnd() {
  if (!state.countdown || countdownEndShown) return;
  const expired = countdownOver(state);
  if (!expired) state.countdown.endedAt = Date.now(); // freiwillig beendet
  countdownEndShown = true;
  const run = {
    insight: state.totalInsight,
    found: discoveryCount(state),
    durationMs: state.countdown.endedAt - state.countdown.startedAt,
    date: new Date().toISOString().slice(0, 10),
  };
  const isRecord = saveRecord(run, state.welt);
  const record = loadRecord(state.welt);
  fill($('countdown-inhalt'),
    h('h2', { id: 'countdown-titel', class: 'countdown-titel' }, expired ? 'Zeit abgelaufen!' : 'Runde beendet'),
    isRecord ? h('p', { class: 'titel gut' }, '🏆 Neuer Rekord!') : null,
    h('dl', { class: 'statistik' },
      h('dt', {}, 'Erkenntnis'), h('dd', {}, fmt(run.insight)),
      h('dt', {}, 'Entdeckt'), h('dd', {}, run.found === 1 ? '1 Eintrag' : `${run.found} Einträge`),
      h('dt', {}, 'Durchgehalten'), h('dd', {}, clock(run.durationMs)),
      !isRecord && record ? [h('dt', {}, 'Rekord'), h('dd', {}, `${fmt(record.insight)} Erkenntnis`)] : null),
    h('p', { class: 'erklaerung' }, 'Dein normaler Spielstand ist unverändert.'),
    h('div', { class: 'knopfreihe' },
      h('button', { type: 'button', class: 'primaer', onclick: () => { startCountdown(); closeOverlay(); } }, 'Neue Runde'),
      h('button', { type: 'button', class: 'zweitrangig', onclick: closeOverlay }, 'Zurück zum normalen Spiel')));
  openOverlay('countdown');
  $('countdown-inhalt').querySelector('.primaer').focus();
}

$('countdown-start').addEventListener('click', startCountdown);
$('countdown-ende').addEventListener('click', () => {
  if (confirm('Runde jetzt beenden?')) showCountdownEnd();
});

function updateCountdown(now) {
  const run = Boolean(state.countdown);
  document.body.classList.toggle('countdown-aktiv', run);
  $('countdown').hidden = !run;
  if (!run) return;
  const left = countdownLeft(state, now);
  $('countdown-zeit').textContent = clock(left);
  $('countdown').classList.toggle('knapp', left <= 30_000);
  $('countdown-fuellung').style.width = `${Math.min(100, (left / COUNTDOWN.startMs) * 100)}%`;
  if (countdownOver(state, now)) showCountdownEnd();
}

// ---------- Anzeige ----------

function updateCombo(now) {
  const combo = $('combo');
  const active = state.combo.count > 1 && now < state.combo.until;
  combo.hidden = !active;
  if (!active) return;
  $('combo-text').textContent = `Combo ${state.combo.count} · ×${fmt(comboMultiplier(state.combo.count))}`;
  const share = (state.combo.until - now) / comboWindow(state, now);
  $('combo-fuellung').style.width = `${Math.max(0, share * 100)}%`;
}

function update() {
  $('betrag').textContent = fmt(state.insight);
  const price = unlockPrice(state);
  $('rate').textContent = price == null ? 'Alle Bereiche offen' : `Nächster Bereich: ${fmt(price)} Erkenntnis`;
  document.title = `${fmt(state.insight)} Erkenntnis – PhysicsClicker`;
  const now = Date.now();
  renderBereiche();
  renderBoosts();
  renderActive(now);
  updateCombo(now);
  updateCountdown(now);
}

function rerenderAll() {
  $('modus-knopf').textContent = W().name;
  renderBereiche(true);
  renderCodex();
  renderQuestions();
  renderBoosts(true);
  renderHint();
  renderStats();
  renderInputHints();
  renderCountdownInfo();
  update();
}

// Nur Anzeige (Combo-Balken, Kaufbarkeit) – Erkenntnis entsteht ausschließlich durch Eingaben.
setInterval(update, 100);

setInterval(() => saveLocal(state), 10_000);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveLocal(state); });
window.addEventListener('pagehide', () => saveLocal(state));

rerenderAll();
openStart(); // Beim Laden wählt man den Spielmodus (#16)
