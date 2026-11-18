// Daten für die Mindmap (Issue #11) – ohne DOM, damit sie testbar bleiben.
//
// Aufbau: Gebiete (Mechanik, Optik …) → offene Bereiche → Einträge.
// Gesperrte Bereiche erscheinen nicht. Unentdeckte Einträge tragen keinen
// Namen (in der Anzeige ein „?“), damit die Mindmap nichts verrät. Entdeckte
// Personen bekommen ihre Bezüge aus data/bezuege.js mit, soweit deren Bereich
// offen ist – so sieht man, was zu ihnen noch fehlt.

import BEZUEGE from '../data/bezuege.js';
import { AREAS } from './content.js';
import { isOpen, weltOf } from './game.js';

const known = (state, id) => Object.hasOwn(state.discovered, id);

/** Ein Knoten: Name nur, wenn entdeckt. */
function node(state, entry) {
  const isKnown = known(state, entry.id);
  return { id: entry.id, cat: entry.cat, tier: entry.tier, known: isKnown, name: isKnown ? entry.name : null };
}

/** Bezüge einer entdeckten Person, nur aus offenen Bereichen. */
export function personLinks(state, id) {
  if (!known(state, id)) return [];
  return (BEZUEGE[id] || [])
    .map((x) => weltOf(state).index.byId.get(x))
    .filter((e) => e && isOpen(state, e.cat))
    .map((e) => node(state, e));
}

export function mindmap(state) {
  const { entries: ENTRIES, bereiche: BEREICHE } = weltOf(state);
  const openBereiche = BEREICHE.filter((b) => isOpen(state, b.id));
  const areas = AREAS.map((area) => {
    const bereiche = openBereiche.map((b) => {
      const entries = ENTRIES
        .filter((e) => e.area === area.id && e.cat === b.id)
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
    return { id: area.id, name: area.name, bereiche, found, total, missing: total - found };
  });
  return {
    areas,
    locked: BEREICHE.filter((b) => !isOpen(state, b.id)).map((b) => b.name),
  };
}
