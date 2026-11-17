// Spielwelten (Issue #16): Das freie Spiel mit der ganzen Wissensdatenbank und
// je eine kleinere Welt pro Klassenstufe. Eine Welt bündelt alles, was die
// Spiellogik über „den Inhalt“ wissen muss: Einträge, Suchindex, Fragen,
// Bereiche, Startbereiche und Preise. Ohne DOM, damit sie testbar bleibt.

import { ENTRIES } from '../data/index.js';
import FRAGEN from '../data/fragen.js';
import KLASSEN from '../data/klassen/index.js';
import { buildIndex } from './matcher.js';
import {
  BEREICHE, KLASSEN_PREIS_ANTEIL, KLASSEN_START, QUESTION_FACTOR, START_BEREICHE, TIER_POINTS,
  UNLOCK_PRICES,
} from './content.js';

const ENTRY_BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));

function makeWelt({ id, name, kurz, klasse = null, entries, fragen, start, prices, info = null }) {
  const index = buildIndex(entries);
  const questions = fragen.map((q) => ({ ...q, bereich: index.byId.get(q.antwort)?.cat }));
  const present = new Set(entries.map((e) => e.cat));
  // Startbereiche zuerst, danach in der üblichen Reihenfolge – nur Bereiche mit Inhalt
  const bereiche = [
    ...BEREICHE.filter((b) => start.includes(b.id)),
    ...BEREICHE.filter((b) => !start.includes(b.id)),
  ].filter((b) => present.has(b.id)).map((b) => ({
    ...b,
    // In Klassenwelten stammen die Beispiele aus der Klasse selbst
    beispiel: klasse == null ? b.beispiel : entries
      .filter((e) => e.cat === b.id).sort((x, y) => x.tier - y.tier).slice(0, 3).map((e) => e.name).join(', '),
  }));
  return {
    id, name, kurz, klasse, info, entries, index, questions,
    questionById: new Map(questions.map((q) => [q.id, q])),
    bereiche,
    bereichIds: new Set(bereiche.map((b) => b.id)),
    start: start.filter((b) => present.has(b)),
    prices,
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

export const KLASSEN_WELTEN = KLASSEN.map((k) => {
  const entries = klassenEintraege(k);
  const cats = new Set(entries.map((e) => e.cat));
  const buyable = [...cats].filter((c) => !KLASSEN_START.includes(c)).length;
  return makeWelt({
    id: `k${k.klasse}`, name: `Klasse ${k.klasse}`, kurz: `Kl. ${k.klasse}`, klasse: k.klasse,
    entries, fragen: k.fragen, start: KLASSEN_START, prices: klassenPreise(entries, k.fragen, buyable),
    info: { themen: k.themen, quelle: k.quelle },
  });
});

const WELTEN = new Map([FREI, ...KLASSEN_WELTEN].map((w) => [w.id, w]));

export const isWelt = (id) => WELTEN.has(id);

/** Welt zu einer ID; unbekannte IDs landen im freien Spiel. */
export const welt = (id) => WELTEN.get(id) ?? FREI;

/** Welt eines Spielstands (alte Spielstände ohne `welt` gehören zum freien Spiel). */
export const weltOf = (state) => welt(state?.welt);
