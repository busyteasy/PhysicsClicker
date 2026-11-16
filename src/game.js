// Spiellogik ohne DOM – damit sie sich mit Node testen lässt.

import { ENTRIES } from '../data/index.js';
import { buildIndex, match } from './matcher.js';
import {
  BEREICHE, COMBO_MAX, COMBO_STEP, COMBO_WINDOW_MS, REPEAT_COOLDOWN_MS,
  REPEAT_SHARE, START_BEREICHE, TIER_POINTS, UNLOCK_PRICES, VALUE_FACTOR,
} from './content.js';

export const INDEX = buildIndex(ENTRIES);
const BEREICH_IDS = new Set(BEREICHE.map((b) => b.id));

export function newState() {
  return {
    version: 2,
    insight: 0,          // aktuelles Guthaben an Erkenntnis
    totalInsight: 0,     // insgesamt verdient
    unlocked: [...START_BEREICHE], // freigeschaltete Bereiche (Kategorien)
    discovered: {},      // Eintrag-ID -> Zeitpunkt
    values: {},          // Konstanten-ID -> Zeitpunkt (Wert gewusst)
    lastSeen: {},        // Schlüssel -> Zeitpunkt der letzten Wertung
    combo: { count: 0, until: 0 },
    stats: { inputs: 0, hits: 0 },
  };
}

// ---------- Bereiche ----------

export const isOpen = (state, bereich) => state.unlocked.includes(bereich);

/** Preis für den nächsten Bereich, `null` wenn alle offen sind. */
export function unlockPrice(state) {
  const bought = state.unlocked.filter((b) => !START_BEREICHE.includes(b)).length;
  return UNLOCK_PRICES[bought] ?? null;
}

export function buyBereich(state, bereich) {
  const price = unlockPrice(state);
  if (!BEREICH_IDS.has(bereich) || isOpen(state, bereich) || price == null || state.insight < price) return false;
  state.insight -= price;
  state.unlocked.push(bereich);
  return true;
}

// ---------- Zähler ----------

export function discoveryCount(state) {
  return Object.keys(state.discovered).length;
}

export function bereichCount(state, bereich) {
  let n = 0;
  for (const id of Object.keys(state.discovered)) {
    if (INDEX.byId.get(id)?.cat === bereich) n++;
  }
  return n;
}

export function comboWindow() {
  return COMBO_WINDOW_MS;
}

export function comboMultiplier(count) {
  return Math.min(COMBO_MAX, 1 + COMBO_STEP * Math.max(0, count - 1));
}

// ---------- Eingaben ----------

function entryValue(entry, isValue) {
  return TIER_POINTS[entry.tier] * (isValue ? VALUE_FACTOR : 1);
}

function repeatItem(state, entry, key, isValue, now) {
  const last = state.lastSeen[key] || 0;
  const wait = REPEAT_COOLDOWN_MS - (now - last);
  if (wait > 0) return { entry, art: 'abklingend', points: 0, waitSeconds: Math.ceil(wait / 1000) };
  return { entry, art: isValue ? 'wertWiederholung' : 'wiederholung', points: Math.max(1, entryValue(entry, isValue) * REPEAT_SHARE) };
}

/**
 * Wertet eine Eingabe aus und verändert den Zustand.
 * Rückgabe: { status, items, gained, combo, fuzzy, entry, locked }
 *   status: 'treffer' | 'gesperrt' | 'unbekannt' | 'wertFalsch' | 'einheitFalsch' | 'leer'
 *   items:  [{ entry, art, points, waitSeconds? }]
 *     art: 'neu' | 'wert' | 'wiederholung' | 'wertWiederholung' | 'abklingend'
 *   locked: Einträge, die passen, aber in einem noch gesperrten Bereich liegen
 */
export function submit(state, raw, now = Date.now()) {
  const result = match(INDEX, raw);
  if (result.kind === 'leer') return { status: 'leer', items: [], gained: 0, locked: [] };
  state.stats.inputs++;

  if (result.kind !== 'treffer') {
    const entry = result.id ? INDEX.byId.get(result.id) : null;
    // Bei gesperrten Konstanten nichts über den Wert verraten
    if (entry && !isOpen(state, entry.cat)) return { status: 'gesperrt', items: [], gained: 0, locked: [entry] };
    return { status: result.kind, items: [], gained: 0, entry, locked: [] };
  }

  const matched = result.ids.map((id) => INDEX.byId.get(id));
  const open = matched.filter((e) => isOpen(state, e.cat));
  const locked = matched.filter((e) => !isOpen(state, e.cat));
  if (open.length === 0) return { status: 'gesperrt', items: [], gained: 0, locked };

  const items = [];
  for (const entry of open) {
    const { id } = entry;
    if (!Object.hasOwn(state.discovered, id)) {
      items.push({ entry, art: 'neu', points: entryValue(entry, false) });
    } else if (result.wert !== id) {
      items.push(repeatItem(state, entry, id, false, now));
    }
    if (result.wert === id) {
      if (!Object.hasOwn(state.values, id)) items.push({ entry, art: 'wert', points: entryValue(entry, true) });
      else items.push(repeatItem(state, entry, id + '#wert', true, now));
    }
  }

  const rawTotal = items.reduce((s, i) => s + i.points, 0);
  let combo = state.combo.count;
  if (rawTotal > 0) {
    combo = now < state.combo.until ? state.combo.count + 1 : 1;
    state.combo = { count: combo, until: now + comboWindow() };
  }
  const multiplier = comboMultiplier(combo);

  let gained = 0;
  for (const item of items) {
    if (item.points <= 0) continue;
    item.points = Math.round(item.points * multiplier);
    gained += item.points;
    const id = item.entry.id;
    if (item.art === 'neu') state.discovered[id] = now;
    if (item.art === 'wert') state.values[id] = now;
    const isValue = item.art === 'wert' || item.art === 'wertWiederholung';
    state.lastSeen[isValue ? id + '#wert' : id] = now;
  }

  state.insight += gained;
  state.totalInsight += gained;
  if (gained > 0) state.stats.hits++;
  return {
    status: 'treffer', items, gained, locked,
    combo: rawTotal > 0 ? combo : 0, multiplier, fuzzy: !!result.fuzzy,
  };
}

// ---------- Speichern ----------

/** Übernimmt einen gespeicherten Zustand und verwirft Unbekanntes. */
export function restore(saved) {
  const state = newState();
  if (!saved || typeof saved !== 'object') return state;
  const num = (x) => (Number.isFinite(x) && x >= 0 ? x : 0);
  state.insight = num(saved.insight);
  state.totalInsight = Math.max(num(saved.totalInsight), state.insight);
  for (const b of saved.unlocked || []) {
    if (BEREICH_IDS.has(b) && !state.unlocked.includes(b)) state.unlocked.push(b);
  }
  for (const [id, t] of Object.entries(saved.discovered || {})) if (INDEX.byId.has(id)) state.discovered[id] = num(t);
  for (const [id, t] of Object.entries(saved.values || {})) if (INDEX.byId.get(id)?.values) state.values[id] = num(t);
  for (const [k, t] of Object.entries(saved.lastSeen || {})) state.lastSeen[k] = num(t);
  state.stats = { inputs: num(saved.stats?.inputs), hits: num(saved.stats?.hits) };
  return state;
}
