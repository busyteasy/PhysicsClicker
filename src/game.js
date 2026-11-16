// Spiellogik ohne DOM – damit sie sich mit Node testen lässt.

import { ENTRIES } from '../data/index.js';
import FRAGEN from '../data/fragen.js';
import { buildIndex, checkValue, match } from './matcher.js';
import {
  BEREICHE, BOOSTS, BOOST_PRICE_GROWTH, COMBO_MAX, COMBO_STEP, COMBO_WINDOW_MS,
  QUESTION_FACTOR, QUESTION_TRIES, REPEAT_COOLDOWN_MS, REPEAT_SHARE, START_BEREICHE,
  TIER_POINTS, UNLOCK_PRICES, VALUE_FACTOR,
} from './content.js';

export const INDEX = buildIndex(ENTRIES);
const BEREICH_IDS = new Set(BEREICHE.map((b) => b.id));

/** Fragen mit ihrem Bereich (= Kategorie des Antwort-Eintrags) */
export const QUESTIONS = FRAGEN.map((q) => ({ ...q, bereich: INDEX.byId.get(q.antwort)?.cat }));
const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
const BOOST_BY_ID = new Map(BOOSTS.map((b) => [b.id, b]));

export function newState() {
  return {
    version: 2,
    insight: 0,          // aktuelles Guthaben an Erkenntnis
    totalInsight: 0,     // insgesamt verdient
    unlocked: [...START_BEREICHE], // freigeschaltete Bereiche (Kategorien)
    discovered: {},      // Eintrag-ID -> Zeitpunkt
    values: {},          // Konstanten-ID -> Zeitpunkt (Wert gewusst)
    lastSeen: {},        // Schlüssel -> Zeitpunkt der letzten Wertung
    answered: {},        // Frage-ID -> Zeitpunkt (richtig beantwortet)
    revealed: {},        // Frage-ID -> Zeitpunkt (aufgelöst, ohne Punkte)
    attempts: {},        // Frage-ID -> Zahl der Fehlversuche
    combo: { count: 0, until: 0 },
    boosts: newBoosts(),
    stats: { inputs: 0, hits: 0 },
  };
}

function newBoosts() {
  return {
    mult: null,          // { id, factor, uses } – aktiver Multiplikator
    comboUntil: 0,       // Kaffeepause aktiv bis
    noCooldownUntil: 0,  // Eselsbrücke aktiv bis
    hint: null,          // Eintrag-ID des Spickzettels
    bought: {},          // Upgrade-ID -> Anzahl Käufe (für den Preis)
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

export function comboWindow(state, now = Date.now()) {
  const coffee = BOOST_BY_ID.get('kaffeepause').effect.comboMs;
  return COMBO_WINDOW_MS + (now < state.boosts.comboUntil ? coffee : 0);
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
  const wait = now < state.boosts.noCooldownUntil ? 0 : REPEAT_COOLDOWN_MS - (now - last);
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
    state.combo = { count: combo, until: now + comboWindow(state, now) };
  }
  const boost = rawTotal > 0 ? consumeMultiplier(state) : null;
  const multiplier = comboMultiplier(combo) * (boost?.factor ?? 1);

  let gained = 0;
  for (const item of items) {
    if (item.points <= 0) continue;
    item.points = Math.round(item.points * multiplier);
    gained += item.points;
    const id = item.entry.id;
    if (item.art === 'neu') state.discovered[id] = now;
    if (item.art === 'neu' && state.boosts.hint === id) state.boosts.hint = null;
    if (item.art === 'wert') state.values[id] = now;
    const isValue = item.art === 'wert' || item.art === 'wertWiederholung';
    state.lastSeen[isValue ? id + '#wert' : id] = now;
  }

  state.insight += gained;
  state.totalInsight += gained;
  if (gained > 0) state.stats.hits++;
  return {
    status: 'treffer', items, gained, locked,
    combo: rawTotal > 0 ? combo : 0, multiplier, boost, fuzzy: !!result.fuzzy,
  };
}

// ---------- Fragen ----------

export const questionPoints = (q) => TIER_POINTS[q.tier] * QUESTION_FACTOR;

/** 'offen' | 'gesperrt' | 'richtig' | 'aufgeloest' */
export function questionStatus(state, q) {
  if (Object.hasOwn(state.answered, q.id)) return 'richtig';
  if (Object.hasOwn(state.revealed, q.id)) return 'aufgeloest';
  return isOpen(state, q.bereich) ? 'offen' : 'gesperrt';
}

export const canReveal = (state, q) => (state.attempts[q.id] || 0) >= QUESTION_TRIES;

/**
 * Beantwortet eine Frage aus dem Katalog.
 * Rückgabe: { status: 'richtig' | 'falsch' | 'leer' | 'nichtOffen', points, attempts, canReveal }
 */
export function answerQuestion(state, id, raw, now = Date.now()) {
  const q = QUESTION_BY_ID.get(id);
  if (!q || questionStatus(state, q) !== 'offen') return { status: 'nichtOffen', points: 0 };
  if (!String(raw).trim()) return { status: 'leer', points: 0 };

  const entry = INDEX.byId.get(q.antwort);
  let correct;
  if (q.wert) {
    correct = checkValue(entry, raw) === 'ok';
  } else {
    const result = match(INDEX, raw);
    correct = result.kind === 'treffer' && result.ids.includes(q.antwort);
  }

  if (!correct) {
    state.attempts[id] = (state.attempts[id] || 0) + 1;
    return { status: 'falsch', points: 0, attempts: state.attempts[id], canReveal: canReveal(state, q) };
  }
  const boost = consumeMultiplier(state);
  const points = Math.round(questionPoints(q) * (boost?.factor ?? 1));
  state.answered[id] = now;
  state.insight += points;
  state.totalInsight += points;
  return { status: 'richtig', points, entry, boost };
}

/** Löst eine Frage nach genug Fehlversuchen auf – ohne Punkte. */
export function revealQuestion(state, id, now = Date.now()) {
  const q = QUESTION_BY_ID.get(id);
  if (!q || questionStatus(state, q) !== 'offen' || !canReveal(state, q)) return null;
  state.revealed[id] = now;
  return INDEX.byId.get(q.antwort);
}

// ---------- Einmal-Upgrades ----------

export function boostPrice(state, id) {
  const b = BOOST_BY_ID.get(id);
  return Math.ceil(b.price * BOOST_PRICE_GROWTH ** (state.boosts.bought[id] || 0));
}

/** Einträge, für die ein Spickzettel infrage kommt: offen, aber noch nicht entdeckt. */
function hintCandidates(state) {
  return ENTRIES.filter((e) => isOpen(state, e.cat) && !Object.hasOwn(state.discovered, e.id));
}

/** Warum ein Upgrade gerade nicht kaufbar ist (oder null). Der Preis wird separat geprüft. */
export function boostBlocked(state, id, now = Date.now()) {
  const { effect } = BOOST_BY_ID.get(id);
  const b = state.boosts;
  if (effect.mult && b.mult) return 'Es ist schon ein Multiplikator aktiv.';
  if (effect.comboMs && now < b.comboUntil) return 'Läuft noch.';
  if (effect.noCooldown && now < b.noCooldownUntil) return 'Läuft noch.';
  if (effect.hint && b.hint) return 'Du hast schon einen Spickzettel.';
  if (effect.hint && hintCandidates(state).length === 0) return 'In den offenen Bereichen ist alles entdeckt.';
  return null;
}

export function buyBoost(state, id, now = Date.now(), random = Math.random) {
  const boost = BOOST_BY_ID.get(id);
  if (!boost || boostBlocked(state, id, now)) return false;
  const price = boostPrice(state, id);
  if (state.insight < price) return false;
  state.insight -= price;
  state.boosts.bought[id] = (state.boosts.bought[id] || 0) + 1;

  const { effect } = boost;
  if (effect.mult) state.boosts.mult = { id, factor: effect.mult, uses: effect.uses };
  if (effect.comboMs) state.boosts.comboUntil = now + effect.durationMs;
  if (effect.noCooldown) state.boosts.noCooldownUntil = now + effect.durationMs;
  if (effect.hint) {
    // Bevorzugt leichte Einträge: zufällig aus der niedrigsten offenen Stufe
    const candidates = hintCandidates(state);
    const lowest = Math.min(...candidates.map((e) => e.tier));
    const pool = candidates.filter((e) => e.tier === lowest);
    state.boosts.hint = pool[Math.floor(random() * pool.length)].id;
  }
  return true;
}

/** Verbraucht eine Ladung des aktiven Multiplikators und liefert ihn zurück. */
function consumeMultiplier(state) {
  const active = state.boosts.mult;
  if (!active) return null;
  active.uses--;
  if (active.uses <= 0) state.boosts.mult = null;
  return { id: active.id, factor: active.factor, name: BOOST_BY_ID.get(active.id).name };
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
  for (const key of ['answered', 'revealed', 'attempts']) {
    for (const [id, v] of Object.entries(saved[key] || {})) if (QUESTION_BY_ID.has(id)) state[key][id] = num(v);
  }
  const b = saved.boosts || {};
  if (b.mult && BOOST_BY_ID.get(b.mult.id)?.effect.mult && num(b.mult.uses) > 0) {
    state.boosts.mult = { id: b.mult.id, factor: BOOST_BY_ID.get(b.mult.id).effect.mult, uses: Math.floor(num(b.mult.uses)) };
  }
  state.boosts.comboUntil = num(b.comboUntil);
  state.boosts.noCooldownUntil = num(b.noCooldownUntil);
  if (INDEX.byId.has(b.hint) && !Object.hasOwn(state.discovered, b.hint)) state.boosts.hint = b.hint;
  for (const [id, n] of Object.entries(b.bought || {})) if (BOOST_BY_ID.has(id)) state.boosts.bought[id] = Math.floor(num(n));
  state.stats = { inputs: num(saved.stats?.inputs), hits: num(saved.stats?.hits) };
  return state;
}
