// Spielwelten (Issue #16): Das freie Spiel mit der ganzen Wissensdatenbank und
// je eine kleinere Welt pro Klassenstufe. Eine Welt bündelt alles, was die
// Spiellogik über „den Inhalt“ wissen muss: Einträge, Suchindex, Fragen,
// Bereiche, Startbereiche und Preise. Ohne DOM, damit sie testbar bleibt.

import { ENTRIES } from '../data/index.js';
import FRAGEN from '../data/fragen.js';
import KLASSEN from '../data/klassen/index.js';
import { buildIndex } from './matcher.js';
import {
  BEREICH_GRUPPEN, BEREICHE, KLASSEN_PREIS_ANTEIL, KLASSEN_START, QUESTION_FACTOR, START_BEREICHE, TIER_POINTS,
  UNLOCK_PRICES,
} from './content.js';

const ENTRY_BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));

const GRUPPE_BY_ID = new Map(BEREICH_GRUPPEN.map((g) => [g.id, g]));

/** Kategorie → Bereich einer Welt; ohne Gruppe ist jede Kategorie ihr eigener Bereich. */
function bereichMap(gruppen) {
  const map = new Map(BEREICHE.map((b) => [b.id, b.id]));
  for (const id of gruppen) {
    const g = GRUPPE_BY_ID.get(id);
    if (!g) throw new Error(`Unbekannte Bereichsgruppe ${id}`);
    for (const cat of g.teile) map.set(cat, g.id);
  }
  return map;
}

function makeWelt({ id, name, kurz, klasse = null, entries: raw, fragen, start: startCats, gruppen = [], prices, info = null }) {
  const zuBereich = bereichMap(gruppen);
  // Jeder Eintrag kennt seinen Bereich in dieser Welt; `cat` bleibt die Kategorie.
  const entries = raw.map((e) => ({ ...e, bereich: zuBereich.get(e.cat) }));
  const index = buildIndex(entries);
  const questions = fragen.map((q) => ({ ...q, bereich: index.byId.get(q.antwort)?.bereich }));
  const present = new Set(entries.map((e) => e.bereich));
  const start = [...new Set(startCats.map((c) => zuBereich.get(c) ?? c))].filter((b) => present.has(b));
  // Startbereiche zuerst, danach in der üblichen Reihenfolge – nur Bereiche mit Inhalt
  const order = [...new Set(BEREICHE.map((b) => zuBereich.get(b.id)))];
  const bereiche = [...start, ...order.filter((b) => !start.includes(b) && present.has(b))].map((bid) => {
    const def = GRUPPE_BY_ID.get(bid) ?? BEREICHE.find((b) => b.id === bid);
    const own = entries.filter((e) => e.bereich === bid).sort((x, y) => x.tier - y.tier);
    // Nur ein Beispiel (Issue #25), in Klassenwelten aus der Klasse selbst
    return { id: bid, name: def.name, desc: def.desc, beispiel: klasse == null && def.beispiel ? def.beispiel : own[0].name };
  });
  return {
    id, name, kurz, klasse, info, entries, index, questions,
    questionById: new Map(questions.map((q) => [q.id, q])),
    bereiche,
    bereichIds: new Set(bereiche.map((b) => b.id)),
    zuBereich,
    start,
    prices: typeof prices === 'function' ? prices(entries, questions, bereiche.length - start.length) : prices,
  };
}

/** Preise einer Klasse: steigend, zusammen KLASSEN_PREIS_ANTEIL der möglichen Erkenntnis. */
function klassenPreise(entries, fragen, buyable) {
  const total = entries.reduce((s, e) => s + TIER_POINTS[e.tier], 0)
    + fragen.reduce((s, q) => s + TIER_POINTS[q.tier] * QUESTION_FACTOR, 0);
  const weights = Array.from({ length: buyable }, (_, i) => i + 1);
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.max(10, Math.round((KLASSEN_PREIS_ANTEIL * total * w) / sum / 10) * 10));
}

/** Einträge einer Klasse: dieselben Einträge, aber mit der Stufe innerhalb der Klasse. */
function klassenEintraege(k) {
  return Object.entries(k.eintraege).map(([id, tier]) => {
    const e = ENTRY_BY_ID.get(id);
    if (!e) throw new Error(`Klasse ${k.klasse}: unbekannter Eintrag ${id}`);
    return { ...e, tier };
  });
}

export const FREI = makeWelt({
  id: 'frei', name: 'Freies Spiel', kurz: 'Freies Spiel',
  entries: ENTRIES, fragen: FRAGEN, start: START_BEREICHE, prices: UNLOCK_PRICES,
});

export const KLASSEN_WELTEN = KLASSEN.map((k) => makeWelt({
  id: `k${k.klasse}`, name: `Klasse ${k.klasse}`, kurz: `Kl. ${k.klasse}`, klasse: k.klasse,
  entries: klassenEintraege(k), fragen: k.fragen, start: KLASSEN_START, gruppen: k.gruppen ?? [],
  prices: klassenPreise,
  info: { beschreibung: k.beschreibung, themen: k.themen, quelle: k.quelle },
}));

const WELTEN = new Map([FREI, ...KLASSEN_WELTEN].map((w) => [w.id, w]));

export const isWelt = (id) => WELTEN.has(id);

/** Welt zu einer ID; unbekannte IDs landen im freien Spiel. */
export const welt = (id) => WELTEN.get(id) ?? FREI;

/** Welt eines Spielstands (alte Spielstände ohne `welt` gehören zum freien Spiel). */
export const weltOf = (state) => welt(state?.welt);
