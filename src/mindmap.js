// Daten für die Mindmap (Issue #11) – ohne DOM, damit sie testbar bleiben.
//
// Aufbau: Gebiete (Mechanik, Optik …) → offene Bereiche → Einträge.
// Gesperrte Bereiche erscheinen nicht. Unentdeckte Einträge tragen keinen
// Namen (in der Anzeige ein „?“), damit die Mindmap nichts verrät. Entdeckte
// Personen bekommen ihre Bezüge aus data/bezuege.js mit, soweit deren Bereich
// offen ist – so sieht man, was zu ihnen noch fehlt.
//
// Seit Issue #31 wird das als Sonnensystem gezeichnet: Gebiete sind Planeten,
// offene Bereiche ihre Monde, Einträge Sterne. `verbindungen()` liefert die
// Pfeile zwischen den Planeten – je mehr Bereiche offen sind, desto mehr.

import BEZUEGE from '../data/bezuege.js';
import { AREAS } from './content.js';
import { isOpen, weltOf } from './game.js';

const known = (state, id) => Object.hasOwn(state.discovered, id);

/** Ein Knoten: Name nur, wenn entdeckt. */
function node(state, entry) {
  const isKnown = known(state, entry.id);
  return {
    id: entry.id, cat: entry.cat, bereich: entry.bereich, area: entry.area, tier: entry.tier,
    known: isKnown, name: isKnown ? entry.name : null,
  };
}

/** Bezüge einer entdeckten Person, nur aus offenen Bereichen. */
export function personLinks(state, id) {
  if (!known(state, id)) return [];
  return (BEZUEGE[id] || [])
    .map((x) => weltOf(state).index.byId.get(x))
    .filter((e) => e && isOpen(state, e.bereich))
    .map((e) => node(state, e));
}

/**
 * Pfeile zwischen Gebieten: Eine entdeckte Person zeigt auf ihre Einträge in
 * anderen Gebieten, sobald deren Bereich offen ist (z. B. Newton → Optik:
 * Prismenversuch). Zusammengefasst je Paar von Gebieten.
 */
export function verbindungen(state) {
  const { index } = weltOf(state);
  const byKey = new Map();
  for (const [person, ids] of Object.entries(BEZUEGE)) {
    const p = index.byId.get(person);
    if (!p || !known(state, person)) continue;
    for (const id of ids) {
      const e = index.byId.get(id);
      if (!e || e.area === p.area || !isOpen(state, e.bereich)) continue;
      const key = `${p.area}>${e.area}`;
      if (!byKey.has(key)) byKey.set(key, { key, von: p.area, nach: e.area, anzahl: 0, gefunden: 0, personen: [] });
      const v = byKey.get(key);
      v.anzahl++;
      if (known(state, id)) v.gefunden++;
      if (!v.personen.includes(p.name)) v.personen.push(p.name);
    }
  }
  return [...byKey.values()];
}

/**
 * Was gehört zu einem Eintrag? Für eine Person ihre Bezüge, für jeden anderen
 * Eintrag die Personen, auf die er zurückgeht – jeweils nur aus offenen
 * Bereichen und ohne Namen, solange unentdeckt (Issue #31).
 */
export function bezuege(state, id) {
  const { index } = weltOf(state);
  const entry = index.byId.get(id);
  if (!entry) return null;
  const nach = known(state, id) ? personLinks(state, id) : [];
  const von = Object.entries(BEZUEGE)
    .filter(([, ids]) => ids.includes(id))
    .map(([person]) => index.byId.get(person))
    .filter((p) => p && isOpen(state, p.bereich))
    .map((p) => node(state, p));
  return { node: node(state, entry), nach, von };
}

export function mindmap(state) {
  const { entries: ENTRIES, bereiche: BEREICHE } = weltOf(state);
  const openBereiche = BEREICHE.filter((b) => isOpen(state, b.id));
  const areas = AREAS.map((area) => {
    const bereiche = openBereiche.map((b) => {
      const entries = ENTRIES
        .filter((e) => e.area === area.id && e.bereich === b.id)
        .sort((x, y) => known(state, y.id) - known(state, x.id) || x.tier - y.tier
          || (known(state, x.id) ? x.name.localeCompare(y.name, 'de') : 0));
      const nodes = entries.map((e) => {
        const n = node(state, e);
        if (e.cat === 'person' && n.known) n.links = personLinks(state, e.id);
        return n;
      });
      return { id: b.id, name: b.name, nodes, found: nodes.filter((n) => n.known).length, total: nodes.length };
    }).filter((b) => b.total > 0);
    const found = bereiche.reduce((s, b) => s + b.found, 0);
    const total = bereiche.reduce((s, b) => s + b.total, 0);
    return { id: area.id, name: area.name, kurz: area.kurz, bereiche, found, total, missing: total - found };
  });
  return {
    areas,
    locked: BEREICHE.filter((b) => !isOpen(state, b.id)).map((b) => b.name),
    links: verbindungen(state),
  };
}
