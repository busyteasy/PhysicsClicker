// Ordnet eine Eingabe den Einträgen der Wissensdatenbank zu.

import {
  base, isRelation, keyOf, normFormula, normUnit, normWord, parseQuantity,
} from './normalize.js';

const DEFAULT_TOLERANCE = 0.005; // 0,5 % relative Abweichung

export function buildIndex(entries) {
  const byKey = new Map();       // Schlüssel -> Set von Eintrag-IDs
  const constBySymbol = new Map();
  const constByName = new Map();
  const byId = new Map();

  const add = (map, key, value) => {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(value);
  };

  for (const e of entries) {
    byId.set(e.id, e);
    const names = [e.name, ...(e.aliases || [])];
    for (const alias of names) add(byKey, keyOf(alias), e.id);
    if (e.values) {
      for (const sym of e.symbols || []) add(constBySymbol, normFormula(sym), e.id);
      for (const alias of names) {
        if (!isRelation(alias)) add(constByName, normWord(alias), e.id);
      }
    }
  }

  const words = [...byKey.keys()]
    .filter((k) => k.startsWith('w:'))
    .map((k) => k.slice(2));

  return { byKey, constBySymbol, constByName, byId, words };
}

/**
 * Ergebnis:
 *  { kind: 'treffer', ids: [...], wert?: id, fuzzy?: true }
 *  { kind: 'wertFalsch' | 'einheitFalsch', id }
 *  { kind: 'unbekannt' } | { kind: 'leer' }
 */
export function match(index, raw) {
  if (!base(raw)) return { kind: 'leer' };

  if (isRelation(raw)) {
    const constant = matchConstant(index, raw);
    if (constant?.kind === 'treffer') return constant;
    const ids = index.byKey.get('f:' + normFormula(raw));
    if (ids) return { kind: 'treffer', ids: [...ids] };
    return constant ?? { kind: 'unbekannt' };
  }

  const word = normWord(raw);
  if (!word) return { kind: 'unbekannt' };
  const ids = index.byKey.get('w:' + word);
  if (ids) return { kind: 'treffer', ids: [...ids] };
  return matchFuzzy(index, word) ?? { kind: 'unbekannt' };
}

function matchConstant(index, raw) {
  const parts = base(raw).split('=');
  if (parts.length !== 2 || /[<>~∝]/.test(parts[0])) return null;
  const [left, right] = raw.split('=');
  const quantity = parseQuantity(right);
  if (!quantity) return null;

  const candidates = new Set([
    ...(index.constBySymbol.get(normFormula(left)) || []),
    ...(index.constByName.get(normWord(left)) || []),
  ]);
  if (candidates.size === 0) return null;

  let unitWrong = null;
  for (const id of candidates) {
    const entry = index.byId.get(id);
    for (const spec of entry.values) {
      const tolerance = spec.tol ?? DEFAULT_TOLERANCE;
      const off = Math.abs(quantity.value - spec.v) / Math.abs(spec.v);
      if (off > tolerance) continue;
      const unitOk = !quantity.unit || spec.units.some((u) => normUnit(u) === quantity.unit);
      if (unitOk) return { kind: 'treffer', ids: [id], wert: id };
      unitWrong = id;
    }
  }
  if (unitWrong) return { kind: 'einheitFalsch', id: unitWrong };
  return { kind: 'wertFalsch', id: [...candidates][0] };
}

function matchFuzzy(index, word) {
  const maxDistance = word.length >= 14 ? 2 : word.length >= 7 ? 1 : 0;
  if (maxDistance === 0) return null;

  let best = maxDistance + 1;
  let keys = [];
  for (const candidate of index.words) {
    if (Math.abs(candidate.length - word.length) > maxDistance) continue;
    const d = levenshtein(word, candidate, best);
    if (d < best) { best = d; keys = [candidate]; }
    else if (d === best) keys.push(candidate);
  }
  if (best > maxDistance) return null;

  const ids = new Set(keys.flatMap((k) => [...index.byKey.get('w:' + k)]));
  // Eindeutig ist es, wenn nur ein Begriff in Frage kommt oder alle
  // Kandidaten zum selben Eintrag gehören.
  if (keys.length !== 1 && ids.size !== 1) return null;
  return { kind: 'treffer', ids: [...ids], fuzzy: true };
}

/** Levenshtein-Distanz; bricht mit `limit + 1` ab, sobald `limit` sicher überschritten ist. */
export function levenshtein(a, b, limit = Infinity) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > limit) return limit + 1;
    prev = cur;
  }
  return prev[b.length];
}
