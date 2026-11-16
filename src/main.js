// Oberfläche: verbindet Spiellogik und DOM.

import { ENTRIES } from '../data/index.js';
import { AREA_NAMES, BEREICHE, BEREICH_NAMES } from './content.js';
import { formatNumber as fmt } from './format.js';
import {
  QUESTIONS, answerQuestion, bereichCount, buyBereich, canReveal, comboMultiplier,
  comboWindow, discoveryCount, isOpen, newState, questionPoints, questionStatus,
  revealQuestion, submit, unlockPrice,
} from './game.js';
import { clearLocal, exportState, importState, loadLocal, saveLocal } from './save.js';
import { isRelation } from './normalize.js';

let state = loadLocal() ?? newState();

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

const ENTRIES_BY_BEREICH = Object.fromEntries(BEREICHE.map((b) => [b.id, ENTRIES.filter((e) => e.cat === b.id)]));
const openBereiche = () => BEREICHE.filter((b) => isOpen(state, b.id));

// ---------- Eingabe ----------

const form = $('eingabe-form');
const input = $('eingabe');
const history = [];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value;
  const result = submit(state, text);
  if (result.status === 'leer') return;

  showFeedback(result, text);
  flash(result.gained > 0 ? 'treffer' : 'wackeln');
  if (result.gained > 0) floatPoints(result.gained);
  addHistory(result, text);
  input.value = '';

  if (result.items.some((i) => i.art === 'neu' || i.art === 'wert')) {
    renderCodex();
    renderBereiche(true);
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
    box.append(
      h('p', { class: 'titel schlecht' }, 'Das kenne ich (noch) nicht.'),
      h('p', { class: 'hinweis' }, isRelation(text)
        ? 'Formeln vergleiche ich ohne Leerzeichen und Malpunkte, Seiten und Faktoren dürfen vertauscht sein. Vielleicht fehlt diese Form noch in der Datenbank.'
        : `Vielleicht ein Tippfehler – oder der Begriff fehlt noch in der Datenbank. Offen sind gerade: ${open}.`),
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
  if (result.combo > 1) {
    box.append(h('p', { class: 'hinweis' }, `Combo ${result.combo} – alles ×${fmt(result.multiplier)}`));
  }
}

function addHistory(result, text) {
  const names = [...new Set(result.items.map((i) => i.entry.name))];
  pushHistory(result.gained, names.length ? names.join(' / ') : text);
}

function pushHistory(points, label) {
  history.unshift({ points, label });
  history.length = Math.min(history.length, 8);
  $('verlauf').replaceChildren(...history.map((e) => h('li', {},
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
    + (open.length < BEREICHE.length ? ' Weitere Bereiche schaltest du im Reiter „Bereiche“ frei.' : '');
}

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
  const signature = state.unlocked.join(',') + '|' + discoveryCount(state);
  const list = $('bereiche');

  if (force || signature !== bereicheSignature) {
    bereicheSignature = signature;
    $('naechster-preis').textContent = price == null
      ? 'Alle Bereiche sind offen.'
      : `Der nächste Bereich kostet ${fmt(price)} Erkenntnis – welcher, entscheidest du.`;

    list.replaceChildren(...BEREICHE.map((b) => {
      const total = ENTRIES_BY_BEREICH[b.id].length;
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

// ---------- Fragen ----------

let openQuestion = null;     // ID der aufgeklappten Frage
let questionFeedback = null; // { id, text, cls }

function renderQuestions() {
  const solved = QUESTIONS.filter((q) => questionStatus(state, q) === 'richtig').length;
  $('fragen-zahl').textContent = `${solved}/${QUESTIONS.length}`;

  $('fragen').replaceChildren(...BEREICHE.map((b) => {
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
      h('ul', { class: 'fragen-liste' }, questions.map(renderQuestion)));
  }));

  const field = document.querySelector('.antwort input');
  if (field) field.focus();
}

function renderQuestion(q) {
  const status = questionStatus(state, q);
  const expanded = openQuestion === q.id && status === 'offen';
  const badge = {
    offen: `+${fmt(questionPoints(q))}`,
    richtig: '✓',
    aufgeloest: 'aufgelöst',
  }[status];

  const li = h('li', { class: `frage ${status}` },
    h('button', {
      type: 'button', class: 'frage-kopf', 'aria-expanded': String(expanded), disabled: status !== 'offen',
      onclick: () => {
        openQuestion = expanded ? null : q.id;
        questionFeedback = null;
        renderQuestions();
      },
    }, h('span', { class: 'frage-text' }, q.frage), h('span', { class: 'frage-punkte' }, badge)));

  if (status !== 'offen') {
    const entry = ENTRIES.find((e) => e.id === q.antwort);
    li.append(h('div', { class: 'frage-loesung' }, `Antwort: ${entry.name}`));
    return li;
  }
  if (!expanded) return li;

  const field = h('input', { type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Antwort' });
  const feedback = questionFeedback?.id === q.id
    ? h('p', { class: `frage-meldung ${questionFeedback.cls}` }, questionFeedback.text)
    : null;
  li.append(h('form', {
    class: 'antwort',
    onsubmit: (event) => {
      event.preventDefault();
      const result = answerQuestion(state, q.id, field.value);
      if (result.status === 'leer') return;
      if (result.status === 'richtig') {
        questionFeedback = null;
        openQuestion = null;
        floatPoints(result.points);
        showQuestionResult(q, result);
        saveLocal(state);
      } else if (result.status === 'falsch') {
        questionFeedback = { id: q.id, cls: 'schlecht', text: result.canReveal
          ? `Leider nicht richtig (${result.attempts}. Versuch). Du kannst die Frage jetzt auflösen.`
          : `Leider nicht richtig (${result.attempts}. Versuch).` };
      }
      renderQuestions();
      update();
    },
  },
  field,
  h('button', { type: 'submit' }, 'Antworten'),
  canReveal(state, q) ? h('button', {
    type: 'button', class: 'aufloesen',
    onclick: () => {
      const entry = revealQuestion(state, q.id);
      if (!entry) return;
      openQuestion = null;
      saveLocal(state);
      renderQuestions();
    },
  }, 'Auflösen') : null,
  feedback));
  return li;
}

/** Zeigt eine richtige Antwort auch in der großen Rückmeldung links. */
function showQuestionResult(q, result) {
  const box = $('rueckmeldung');
  box.replaceChildren(
    h('p', { class: 'titel gut' }, `+${fmt(result.points)} Erkenntnis – Frage richtig beantwortet`),
    h('div', { class: 'fund' },
      h('div', { class: 'fund-kopf' },
        h('span', { class: `fund-name ${result.entry.cat}` }, result.entry.name),
        h('span', { class: 'marke neu' }, 'Frage'),
        h('span', { class: 'fund-punkte' }, `+${fmt(result.points)}`)),
      h('div', { class: 'fund-art' }, q.frage),
      h('p', { class: 'fund-fakt' }, result.entry.fact)),
  );
  pushHistory(result.points, `Frage: ${result.entry.name}`);
}

// ---------- Codex ----------

const openSections = new Set();

function renderCodex() {
  const total = ENTRIES.length;
  const found = discoveryCount(state);
  $('codex-zahl').textContent = `${found}/${total}`;

  $('codex').replaceChildren(
    h('div', { class: 'codex-gesamt' },
      h('strong', {}, `${found} von ${total} Einträgen entdeckt`),
      h('div', { class: 'fortschritt' }, bar(found / total))),
    ...BEREICHE.map((b) => {
      const entries = ENTRIES_BY_BEREICH[b.id];
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
              h('p', { class: 'fakt' }, e.fact))))
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
    ['Entdeckungen', `${discoveryCount(state)} von ${ENTRIES.length}`],
    ['Offene Bereiche', `${state.unlocked.length} von ${BEREICHE.length}`],
    ['Konstanten mit Wert', Object.keys(state.values).length],
    ['Fragen beantwortet', `${Object.keys(state.answered).length} von ${QUESTIONS.length}`],
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
  if (!confirm('Wirklich alles löschen? Erkenntnis, freigeschaltete Bereiche und Codex gehen verloren.')) return;
  clearLocal();
  state = newState();
  history.length = 0;
  $('verlauf').replaceChildren();
  rerenderAll();
});

// ---------- Anzeige ----------

function updateCombo(now) {
  const combo = $('combo');
  const active = state.combo.count > 1 && now < state.combo.until;
  combo.hidden = !active;
  if (!active) return;
  $('combo-text').textContent = `Combo ${state.combo.count} · ×${fmt(comboMultiplier(state.combo.count))}`;
  const share = (state.combo.until - now) / comboWindow();
  $('combo-fuellung').style.width = `${Math.max(0, share * 100)}%`;
}

function update() {
  $('betrag').textContent = fmt(state.insight);
  const price = unlockPrice(state);
  $('rate').textContent = price == null ? 'Alle Bereiche offen' : `Nächster Bereich: ${fmt(price)} Erkenntnis`;
  document.title = `${fmt(state.insight)} Erkenntnis – PhysicsClicker`;
  renderBereiche();
  updateCombo(Date.now());
}

function rerenderAll() {
  renderBereiche(true);
  renderCodex();
  renderQuestions();
  renderStats();
  renderInputHints();
  update();
}

// Nur Anzeige (Combo-Balken, Kaufbarkeit) – Erkenntnis entsteht ausschließlich durch Eingaben.
setInterval(update, 100);

setInterval(() => saveLocal(state), 10_000);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveLocal(state); });
window.addEventListener('pagehide', () => saveLocal(state));

rerenderAll();
input.focus();
