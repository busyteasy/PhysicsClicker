// Oberfläche: verbindet Spiellogik und DOM.

import { CATEGORIES, ENTRIES } from '../data/index.js';
import { AREAS, AREA_NAMES, BUILDINGS, UPGRADES } from './content.js';
import { formatNumber as fmt } from './format.js';
import {
  areaCount, buildingCost, buildingRate, buyBuilding, buyUpgrade, comboMultiplier,
  comboWindow, discoveryCount, isUnlocked, newState, rate, submit, tick,
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

const ENTRIES_BY_AREA = Object.fromEntries(AREAS.map((a) => [a.id, ENTRIES.filter((e) => e.area === a.id)]));

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
    renderUpgrades(true);
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

function showFeedback(result, text) {
  const box = $('rueckmeldung');
  box.replaceChildren();

  if (result.status === 'unbekannt') {
    box.append(
      h('p', { class: 'titel schlecht' }, 'Das kenne ich (noch) nicht.'),
      h('p', { class: 'hinweis' }, isRelation(text)
        ? 'Formeln vergleiche ich ohne Leerzeichen und Malpunkte, Seiten und Faktoren dürfen vertauscht sein. Vielleicht fehlt diese Form noch in der Datenbank.'
        : 'Vielleicht ein Tippfehler – oder der Begriff fehlt noch in der Datenbank.'),
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
        h('span', { class: `marke${isNew ? ' neu' : ''}` }, CATEGORIES[entry.cat]),
        h('span', { class: 'marke' }, AREA_NAMES[entry.area]),
        h('span', { class: `fund-punkte${item.points ? '' : ' null'}` }, item.points ? `+${fmt(item.points)}` : '±0'),
      ),
      h('div', { class: 'fund-art' }, art),
      showFact ? h('p', { class: 'fund-fakt' }, entry.fact) : null,
    ));
  }
  if (result.combo > 1) {
    box.append(h('p', { class: 'hinweis' }, `Combo ${result.combo} – alles ×${fmt(result.multiplier)}`));
  }
}

function addHistory(result, text) {
  const names = [...new Set(result.items.map((i) => i.entry.name))];
  const label = names.length ? names.join(' / ') : text;
  history.unshift({ points: result.gained, label });
  history.length = Math.min(history.length, 8);
  $('verlauf').replaceChildren(...history.map((e) => h('li', {},
    h('span', { class: `p${e.points ? '' : ' null'}` }, e.points ? `+${fmt(e.points)}` : '–'),
    h('span', { class: 't', title: e.label }, e.label),
  )));
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
  });
}

// ---------- Einrichtungen ----------

const buildingRows = new Map();

function createBuildings() {
  const list = $('einrichtungen');
  for (const b of BUILDINGS) {
    const button = h('button', { type: 'button', class: 'einrichtung', onclick: () => {
      if (buyBuilding(state, b.id)) update();
    } });
    const li = h('li', {}, button);
    list.append(li);
    buildingRows.set(b.id, { li, button, shown: null });
  }
}

function renderBuildings() {
  let teaserShown = false;
  BUILDINGS.forEach((b, i) => {
    const row = buildingRows.get(b.id);
    const count = state.buildings[b.id];
    const cost = buildingCost(state, b.id);
    const visible = i === 0 || count > 0 || state.buildings[BUILDINGS[i - 1].id] > 0 || state.totalInsight >= b.cost;
    const mode = visible ? 'offen' : !teaserShown ? 'teaser' : 'aus';
    if (mode === 'teaser') teaserShown = true;

    row.li.hidden = mode === 'aus';
    const key = `${mode}|${count}|${cost}|${buildingRate(state, b.id)}`;
    if (row.shown !== key) {
      row.shown = key;
      row.button.classList.toggle('teaser', mode === 'teaser');
      if (mode === 'teaser') {
        row.button.replaceChildren(
          h('span', { class: 'name' }, '???'),
          h('span', { class: 'anzahl' }, ''),
          h('span', { class: 'beschr' }, `Noch unbekannte Einrichtung (${AREA_NAMES[b.area]})`),
          h('span', { class: 'zahlen' }, h('span', { class: 'preis' }, fmt(cost)), ' Erkenntnis'),
        );
      } else {
        const each = buildingRate(state, b.id);
        row.button.replaceChildren(
          h('span', { class: 'name' }, b.name),
          h('span', { class: 'anzahl' }, count),
          h('span', { class: 'beschr' }, b.desc),
          h('span', { class: 'zahlen' },
            h('span', { class: 'preis' }, fmt(cost)), ' · ',
            `+${fmt(each)}/s je Stück`,
            count ? ` · zusammen ${fmt(each * count)}/s` : ''),
        );
      }
    }
    row.button.disabled = mode !== 'offen' || state.insight < cost;
  });
}

// ---------- Upgrades ----------

let upgradeSignature = '';

function requirementText(u) {
  if (u.req.area) {
    const missing = u.req.n - areaCount(state, u.req.area);
    return `Noch ${missing} ${missing === 1 ? 'Entdeckung' : 'Entdeckungen'} in ${AREA_NAMES[u.req.area]}`;
  }
  const missing = u.req.total - discoveryCount(state);
  return `Noch ${missing} ${missing === 1 ? 'Entdeckung' : 'Entdeckungen'} insgesamt`;
}

function lockedProgress(u) {
  return u.req.area ? areaCount(state, u.req.area) / u.req.n : discoveryCount(state) / u.req.total;
}

function renderUpgrades(force = false) {
  const open = UPGRADES.filter((u) => !state.upgrades.includes(u.id));
  const available = open.filter((u) => isUnlocked(state, u)).sort((a, b) => a.cost - b.cost);
  const locked = open.filter((u) => !isUnlocked(state, u))
    .sort((a, b) => lockedProgress(b) - lockedProgress(a) || a.cost - b.cost)
    .slice(0, 3);

  const signature = [...available, ...locked].map((u) => u.id + requirementText(u)).join(',') + state.upgrades.join(',');
  const list = $('upgrades');
  if (force || signature !== upgradeSignature) {
    upgradeSignature = signature;
    const cards = available.map((u) => h('li', {}, h('button', {
      type: 'button', class: 'upgrade', 'data-id': u.id, 'data-cost': u.cost,
      onclick: () => { if (buyUpgrade(state, u.id)) { renderUpgrades(true); update(); saveLocal(state); } },
    },
    h('span', { class: 'name' }, u.name),
    h('span', { class: 'beschr' }, u.desc),
    h('span', { class: 'preis' }, `${fmt(u.cost)} Erkenntnis`))));
    const teasers = locked.map((u) => h('li', {}, h('button', { type: 'button', class: 'upgrade gesperrt', disabled: true },
      h('span', { class: 'name' }, u.name),
      h('span', { class: 'beschr' }, u.desc),
      h('span', { class: 'preis' }, requirementText(u)))));
    list.replaceChildren(...cards, ...teasers);
    if (!cards.length && !teasers.length) list.append(h('li', { class: 'leer-hinweis' }, 'Alle Upgrades gekauft.'));

    const bought = state.upgrades.map((id) => UPGRADES.find((u) => u.id === id)?.name).filter(Boolean);
    $('gekauft').textContent = bought.length ? `Gekauft: ${bought.join(', ')}` : '';
  }
  for (const button of list.querySelectorAll('.upgrade[data-id]')) {
    const tooExpensive = state.insight < Number(button.dataset.cost);
    button.disabled = tooExpensive;
    button.classList.toggle('zu-teuer', tooExpensive);
  }
}

// ---------- Codex ----------

const openAreas = new Set();

function renderCodex() {
  const total = ENTRIES.length;
  const found = discoveryCount(state);
  $('codex-zahl').textContent = `${found}/${total}`;

  const container = $('codex');
  container.replaceChildren(
    h('div', { class: 'codex-gesamt' },
      h('strong', {}, `${found} von ${total} Einträgen entdeckt`),
      h('div', { class: 'fortschritt' }, bar(found / total))),
    ...AREAS.map((area) => {
      const entries = ENTRIES_BY_AREA[area.id];
      const known = entries.filter((e) => state.discovered[e.id])
        .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name, 'de'));
      const missingByTier = [1, 2, 3, 4, 5]
        .map((t) => [t, entries.filter((e) => e.tier === t && !state.discovered[e.id]).length])
        .filter(([, n]) => n > 0);

      const details = h('details', { class: 'gebiet', open: openAreas.has(area.id) },
        h('summary', {},
          h('span', { class: 'name' }, area.name),
          h('span', { class: 'zahl' }, `${known.length}/${entries.length}`),
          h('div', { class: 'fortschritt' }, bar(known.length / entries.length))),
        h('div', { class: 'gebiet-inhalt' },
          known.length
            ? h('ul', { class: 'codex-liste' }, known.map((e) => h('li', {},
              h('div', { class: 'kopfzeile' },
                h('span', { class: `name ${e.cat}` }, e.name),
                h('span', { class: 'marke' }, CATEGORIES[e.cat]),
                h('span', { class: 'marke' }, `Stufe ${e.tier}`),
                e.values ? h('span', { class: 'marke' }, state.values[e.id] ? '✓ Wert' : 'Wert fehlt') : null),
              h('p', { class: 'fakt' }, e.fact))))
            : h('p', { class: 'offen' }, 'Noch nichts entdeckt.'),
          missingByTier.length
            ? h('p', { class: 'offen' }, 'Noch offen: ' + missingByTier.map(([t, n]) => `Stufe ${t}: ${n}`).join(' · '))
            : h('p', { class: 'offen' }, 'Gebiet vollständig!')));
      details.addEventListener('toggle', () => {
        if (details.open) openAreas.add(area.id); else openAreas.delete(area.id);
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
    ['Konstanten mit Wert', Object.keys(state.values).length],
    ['Eingaben', fmt(state.stats.inputs)],
    ['Davon gewertet', fmt(state.stats.hits)],
    ['Erkenntnis insgesamt', fmt(state.totalInsight)],
    ['Einrichtungen', BUILDINGS.reduce((s, b) => s + state.buildings[b.id], 0)],
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
  if (!confirm('Wirklich alles löschen? Erkenntnis, Einrichtungen, Upgrades und Codex gehen verloren.')) return;
  clearLocal();
  state = newState();
  history.length = 0;
  $('verlauf').replaceChildren();
  rerenderAll();
});

// ---------- Hauptschleife ----------

function updateCombo(now) {
  const combo = $('combo');
  const active = state.combo.count > 1 && now < state.combo.until;
  combo.hidden = !active;
  if (!active) return;
  $('combo-text').textContent = `Combo ${state.combo.count} · ×${fmt(comboMultiplier(state.combo.count))}`;
  const share = (state.combo.until - now) / comboWindow(state);
  $('combo-fuellung').style.width = `${Math.max(0, share * 100)}%`;
}

function update() {
  $('betrag').textContent = fmt(state.insight);
  $('rate').textContent = `${fmt(rate(state))} pro Sekunde`;
  document.title = `${fmt(state.insight)} Erkenntnis – PhysicsClicker`;
  renderBuildings();
  renderUpgrades();
  updateCombo(Date.now());
}

function rerenderAll() {
  upgradeSignature = '';
  for (const row of buildingRows.values()) row.shown = null;
  renderCodex();
  renderStats();
  update();
}

let last = Date.now();
setInterval(() => {
  const now = Date.now();
  const seconds = Math.min(3600, Math.max(0, (now - last) / 1000));
  last = now;
  tick(state, seconds);
  update();
}, 100);

setInterval(() => saveLocal(state), 10_000);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveLocal(state); });
window.addEventListener('pagehide', () => saveLocal(state));

createBuildings();
rerenderAll();
input.focus();
