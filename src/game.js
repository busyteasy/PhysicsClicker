// Spiellogik ohne DOM – damit sie sich mit Node testen lässt.

import { checkValue, match } from './matcher.js';
import {
  BOOSTS, BOOST_PRICE_GROWTH, COMBO_MAX, COUNTDOWN, COMBO_STEP, COMBO_WINDOW_MS, LUECKENWORT, ZEUGNIS_STUFEN,
  SCHAETZ_FACTOR, SCHAETZ_REGLER, SCHAETZ_STUFEN, SCHAETZ_ZIFFERN,
  QUESTION_FACTOR, QUESTION_TRIES, REPEAT_COOLDOWN_MS, REPEAT_SHARE,
  TIER_POINTS, VALUE_FACTOR,
} from './content.js';
import { FREI, isWelt, welt, weltOf } from './welt.js';

export { FREI, KLASSEN_WELTEN, isWelt, welt, weltOf } from './welt.js';

// Index und Fragen des freien Spiels – für Stellen, die keinen Spielstand kennen
export const INDEX = FREI.index;
export const QUESTIONS = FREI.questions;
const BOOST_BY_ID = new Map(BOOSTS.map((b) => [b.id, b]));

/** Neuer Spielstand – im freien Spiel oder in einer Klassenwelt (`'k7'` …). */
export function newState(weltId = 'frei') {
  const w = welt(weltId);
  return {
    version: 2,
    welt: w.id,          // Spielwelt (Issue #16)
    insight: 0,          // aktuelles Guthaben an Erkenntnis
    totalInsight: 0,     // insgesamt verdient
    unlocked: [...w.start], // freigeschaltete Bereiche (Kategorien)
    discovered: {},      // Eintrag-ID -> Zeitpunkt
    values: {},          // Konstanten-ID -> Zeitpunkt (Wert gewusst)
    lastSeen: {},        // Schlüssel -> Zeitpunkt der letzten Wertung
    answered: {},        // Frage-ID -> Zeitpunkt (richtig beantwortet)
    revealed: {},        // Frage-ID -> Zeitpunkt (aufgelöst, ohne Punkte)
    attempts: {},        // Frage-ID -> Zahl der Fehlversuche
    luecken: {},         // Eintrag-ID -> gekaufte Buchstaben im Lückenwort (Issue #33)
    schaetzungen: {},    // Schätzfrage-ID -> { t, schaetzung, punkte } (Issue #46)
    combo: { count: 0, until: 0 },
    boosts: newBoosts(),
    stats: { inputs: 0, hits: 0 },
    countdown: null,     // { startedAt, endsAt, endedAt } nur im Countdown-Modus (#12)
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

// ---------- Zeugnisse in den Klassen (Issue #42) ----------
//
// Je Bereich und für die ganze Klasse: Anteil aus entdeckten Einträgen und
// richtig beantworteten Fragen → Bronze, Silber oder Gold (ZEUGNIS_STUFEN).
// Wird nur berechnet, nicht gespeichert – alte Spielstände bekommen ihre
// Medaillen also automatisch.

/** Höchste erreichte Stufe für einen Anteil (0…1), sonst null. */
export function zeugnisStufe(anteil) {
  let stufe = null;
  for (const z of ZEUGNIS_STUFEN) if (anteil >= z.ab - 1e-9) stufe = z;
  return stufe;
}

function zeugnisZeile(state, id, name, entries, questions) {
  const geschafft = entries.filter((e) => Object.hasOwn(state.discovered, e.id)).length
    + questions.filter((q) => Object.hasOwn(state.answered, q.id)).length;
  const gesamt = entries.length + questions.length;
  const anteil = gesamt ? geschafft / gesamt : 0;
  return {
    id, name, geschafft, gesamt, anteil,
    stufe: zeugnisStufe(anteil),
    naechste: ZEUGNIS_STUFEN.find((z) => anteil < z.ab - 1e-9) ?? null,
  };
}

/** Zeugnis einer Klassenwelt; im freien Spiel null. */
export function zeugnis(state) {
  const w = weltOf(state);
  if (w.klasse == null) return null;
  return {
    gesamt: zeugnisZeile(state, w.id, w.name, w.entries, w.questions),
    bereiche: w.bereiche.map((b) => zeugnisZeile(state, b.id, b.name,
      w.entries.filter((e) => e.bereich === b.id), w.questions.filter((q) => q.bereich === b.id))),
  };
}

const stufenRang = (z) => (z ? ZEUGNIS_STUFEN.indexOf(z) + 1 : 0);

/** Medaillen, die zwischen zwei Zeugnissen neu dazugekommen sind. */
export function zeugnisFortschritte(vorher, nachher) {
  if (!vorher || !nachher) return [];
  const paare = [[vorher.gesamt, nachher.gesamt, true],
    ...nachher.bereiche.map((b, i) => [vorher.bereiche[i], b, false])];
  return paare
    .filter(([a, b]) => stufenRang(b.stufe) > stufenRang(a?.stufe))
    .map(([, b, klasse]) => ({ id: b.id, name: b.name, stufe: b.stufe, klasse }));
}

function mitEhrungen(state, aktion) {
  const vorher = zeugnis(state);
  const result = aktion();
  result.ehrungen = zeugnisFortschritte(vorher, zeugnis(state));
  return result;
}

// ---------- Schätzen (Issue #46) ----------
//
// Jede Schätzfrage wird genau einmal gewertet. Sie ist verschlossen, solange
// man Einträge aus ihrem Text (`bezug`) noch nicht entdeckt hat oder den Wert
// einer Konstante (`bezugWert`) noch nicht kennt, aus der sich ihr Wert
// berechnen ließe – so verrät Schätzen nichts, was man selbst holen kann.

/** Grundwert einer Schätzfrage (Volltreffer). */
export const schaetzGrundwert = (s) => TIER_POINTS[s.tier] * SCHAETZ_FACTOR;

/**
 * Rundet eine Schätzung so, wie der Regler sie anzeigt (und wie sie gewertet wird):
 * Log-Skala auf drei gültige Ziffern, lineare Skala auf eine Zehnerstufe unter der Toleranz.
 */
export function rundeSchaetzung(s, zahl) {
  if (s.skala === 'linear') {
    const schritt = 10 ** Math.floor(Math.log10(s.toleranz));
    return Number((Math.round(zahl / schritt) * schritt).toFixed(Math.max(0, -Math.log10(schritt))));
  }
  return Number(zahl.toPrecision(SCHAETZ_ZIFFERN));
}

/** Reglerstellung 0 … SCHAETZ_REGLER → gerundete Schätzung. */
export function schaetzAusRegler(s, pos) {
  const t = Math.min(1, Math.max(0, pos / SCHAETZ_REGLER));
  const roh = s.skala === 'linear'
    ? s.min + t * (s.max - s.min)
    : 10 ** (Math.log10(s.min) + t * (Math.log10(s.max) - Math.log10(s.min)));
  return Math.min(s.max, Math.max(s.min, rundeSchaetzung(s, roh)));
}

/** Schätzung → Reglerstellung 0 … SCHAETZ_REGLER (auch für die Marken im Ergebnis). */
export function reglerAusSchaetzung(s, zahl) {
  const t = s.skala === 'linear'
    ? (zahl - s.min) / (s.max - s.min)
    : (Math.log10(zahl) - Math.log10(s.min)) / (Math.log10(s.max) - Math.log10(s.min));
  return Math.round(Math.min(1, Math.max(0, t)) * SCHAETZ_REGLER);
}

/** Rein rechnerisch: Wie gut ist eine Schätzung? null bei ungültiger Zahl. */
export function bewerteSchaetzung(s, zahl) {
  if (typeof zahl !== 'number' || !Number.isFinite(zahl)) return null;
  if (s.skala === 'linear') {
    const abweichung = Math.abs(zahl - s.wert);
    const stufe = SCHAETZ_STUFEN.find((z) => abweichung <= z.linear * s.toleranz + 1e-9) ?? null;
    return { faktor: null, abweichung, stufe, anteil: stufe?.anteil ?? 0 };
  }
  if (zahl <= 0) return null;
  const faktor = Math.max(zahl / s.wert, s.wert / zahl);
  const stufe = SCHAETZ_STUFEN.find((z) => faktor <= z.faktor + 1e-9) ?? null;
  return { faktor, abweichung: null, stufe, anteil: stufe?.anteil ?? 0 };
}

/**
 * Was fehlt noch, damit eine Schätzfrage offen ist? Nur Kategorie und Gebiet –
 * nie Namen, denn die wären selbst ein Spoiler.
 */
export function schaetzSperre(state, s) {
  const { index } = weltOf(state);
  const fehlt = [];
  for (const id of s.bezug) {
    if (!Object.hasOwn(state.discovered, id)) fehlt.push({ cat: index.byId.get(id).cat, area: index.byId.get(id).area, wert: false });
  }
  for (const id of s.bezugWert) {
    if (!Object.hasOwn(state.values, id)) fehlt.push({ cat: index.byId.get(id).cat, area: index.byId.get(id).area, wert: true });
  }
  return fehlt;
}

export function schaetzStatus(state, s) {
  if (Object.hasOwn(state.schaetzungen, s.id)) return 'geschaetzt';
  return schaetzSperre(state, s).length ? 'verschlossen' : 'offen';
}

/** Nächste offene Schätzfrage nach `afterId` – erst im selben Gebiet, dann irgendwo. */
export function naechsteSchaetzfrage(state, afterId) {
  const liste = weltOf(state).schaetzfragen;
  const i = liste.findIndex((x) => x.id === afterId);
  const after = liste[i];
  const ring = [...liste.slice(i + 1), ...liste.slice(0, Math.max(0, i))]
    .filter((x) => schaetzStatus(state, x) === 'offen');
  return ring.find((x) => x.gebiet === after?.gebiet) ?? ring[0] ?? null;
}

/**
 * Eine Schätzung abgeben. Rückgabe:
 *   { status: 'geschaetzt', punkte, stufe, faktor, abweichung, wert, schaetzung, boost }
 *   oder { status: 'nichtOffen' | 'countdown' | 'ungueltig', punkte: 0 }
 */
export function schaetze(state, id, zahl, now = Date.now()) {
  const s = weltOf(state).schaetzById.get(id);
  if (!s || schaetzStatus(state, s) !== 'offen') return { status: 'nichtOffen', punkte: 0 };
  if (state.countdown) return { status: 'countdown', punkte: 0 };
  if (typeof zahl !== 'number' || !Number.isFinite(zahl)) return { status: 'ungueltig', punkte: 0 };
  const schaetzung = Math.min(s.max, Math.max(s.min, zahl)); // wie der Regler
  const bewertung = bewerteSchaetzung(s, schaetzung);
  if (!bewertung) return { status: 'ungueltig', punkte: 0 };
  const boost = bewertung.anteil > 0 ? consumeMultiplier(state) : null;
  const punkte = bewertung.anteil > 0
    ? Math.max(1, Math.round(schaetzGrundwert(s) * bewertung.anteil * (boost?.factor ?? 1)))
    : 0;
  state.schaetzungen[id] = { t: now, schaetzung, punkte };
  state.insight += punkte;
  state.totalInsight += punkte;
  return { status: 'geschaetzt', punkte, ...bewertung, wert: s.wert, schaetzung, boost };
}

// ---------- Lückenwort (Issue #33) ----------
//
// Für einen noch unentdeckten Eintrag kann man Buchstaben kaufen. Leerzeichen,
// Bindestriche und Zeichen wie „=“ oder „·“ sind von Anfang an sichtbar; der
// erste Buchstabe kommt zuerst, danach die übrigen in einer festen, je Eintrag
// gemischten Reihenfolge. Den letzten Buchstaben verrät das Spiel nie.

const istBuchstabe = (c) => /[\p{L}\p{N}]/u.test(c);

/** Kleiner, stabiler Hash, damit die Reihenfolge bei jedem Laden gleich bleibt. */
function hash(text) {
  let x = 2166136261;
  for (const c of text) x = Math.imul(x ^ c.codePointAt(0), 16777619) >>> 0;
  return x;
}

/** Positionen der Buchstaben in Aufdeck-Reihenfolge. */
export function aufdeckReihenfolge(entry) {
  const zeichen = Array.from(entry.name);
  const pos = zeichen.map((c, i) => (istBuchstabe(c) ? i : -1)).filter((i) => i >= 0);
  const [erster, ...rest] = pos;
  rest.sort((a, b) => hash(`${entry.id}:${a}`) - hash(`${entry.id}:${b}`));
  return erster == null ? [] : [erster, ...rest];
}

/** Preis eines Buchstabens: Anteil vom Grundwert der Stufe. */
export function buchstabenPreis(entry) {
  return Math.max(LUECKENWORT.min, Math.round(TIER_POINTS[entry.tier] * LUECKENWORT.faktor));
}

/**
 * Lückenwort eines Eintrags. `muster` enthält je Zeichen das Zeichen selbst
 * oder `null` für eine noch verdeckte Lücke – verdeckte Buchstaben verlässt
 * diese Funktion nie.
 */
export function lueckenwort(state, id) {
  const entry = weltOf(state).index.byId.get(id);
  if (!entry) return null;
  const zeichen = Array.from(entry.name);
  const reihenfolge = aufdeckReihenfolge(entry);
  const bekannt = Object.hasOwn(state.discovered, id);
  const gekauft = bekannt ? reihenfolge.length : (state.luecken[id] ?? 0);
  const offen = new Set(reihenfolge.slice(0, gekauft));
  const muster = zeichen.map((c, i) => (!istBuchstabe(c) || offen.has(i) ? c : null));
  const max = Math.max(0, reihenfolge.length - 1);
  return {
    id, entry, muster, bekannt,
    gekauft: Math.min(gekauft, reihenfolge.length), gesamt: reihenfolge.length,
    preis: buchstabenPreis(entry),
    gesperrt: !isOpen(state, entry.bereich),
    fertig: bekannt || gekauft >= max,   // nichts mehr zu kaufen
  };
}

/** Kauft den nächsten Buchstaben; `false`, wenn das nicht geht. */
export function kaufeBuchstabe(state, id) {
  const w = lueckenwort(state, id);
  if (!w || w.bekannt || w.gesperrt || w.fertig || state.insight < w.preis) return false;
  state.insight -= w.preis;
  state.luecken[id] = w.gekauft + 1;
  return true;
}

// ---------- Bereiche ----------

export const isOpen = (state, bereich) => state.unlocked.includes(bereich);

/** Preis für den nächsten Bereich, `null` wenn alle offen sind. */
export function unlockPrice(state) {
  const w = weltOf(state);
  const bought = state.unlocked.filter((b) => !w.start.includes(b)).length;
  if (bought >= w.bereiche.length - w.start.length) return null;
  return w.prices[bought] ?? null;
}

export function buyBereich(state, bereich) {
  const price = unlockPrice(state);
  if (!weltOf(state).bereichIds.has(bereich) || isOpen(state, bereich) || price == null || state.insight < price) return false;
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
    if (weltOf(state).index.byId.get(id)?.bereich === bereich) n++;
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

// ---------- Countdown-Modus (#12) ----------

/** Neue Countdown-Runde: frischer Spielstand mit laufender Uhr. */
export function newCountdownRun(now = Date.now(), weltId = 'frei') {
  const state = newState(weltId);
  state.countdown = { startedAt: now, endsAt: now + COUNTDOWN.startMs, endedAt: null };
  return state;
}

/** Restzeit in ms (0, wenn abgelaufen oder kein Countdown läuft). */
export function countdownLeft(state, now = Date.now()) {
  const c = state.countdown;
  if (!c || c.endedAt != null) return 0;
  return Math.max(0, c.endsAt - now);
}

/** Prüft die Uhr und beendet die Runde, wenn sie abgelaufen ist. */
export function countdownOver(state, now = Date.now()) {
  const c = state.countdown;
  if (!c) return false;
  if (c.endedAt == null && now >= c.endsAt) c.endedAt = c.endsAt;
  return c.endedAt != null;
}

/** Zeitbonus für die gewerteten Teile einer Eingabe. */
function itemTimeBonus(item) {
  if (item.points <= 0) return 0;
  const base = COUNTDOWN.bonusMs[item.entry.tier];
  if (item.art === 'neu') return base;
  if (item.art === 'wert') return Math.round(base * COUNTDOWN.valueFactor);
  return COUNTDOWN.repeatMs;
}

function addTime(state, ms, now) {
  if (!state.countdown || ms <= 0) return 0;
  const before = state.countdown.endsAt;
  state.countdown.endsAt = Math.min(before + ms, now + COUNTDOWN.maxMs);
  return Math.max(0, state.countdown.endsAt - before);
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
/** Eingabe werten; meldet zusätzlich neu erreichte Zeugnis-Medaillen (Issue #42). */
export function submit(state, raw, now = Date.now()) {
  return mitEhrungen(state, () => submitIntern(state, raw, now));
}

function submitIntern(state, raw, now) {
  const { index: INDEX } = weltOf(state);
  const result = match(INDEX, raw);
  if (result.kind === 'leer') return { status: 'leer', items: [], gained: 0, locked: [] };
  if (countdownOver(state, now)) return { status: 'vorbei', items: [], gained: 0, locked: [] };
  state.stats.inputs++;

  if (result.kind !== 'treffer') {
    const entry = result.id ? INDEX.byId.get(result.id) : null;
    // Bei gesperrten Konstanten nichts über den Wert verraten
    if (entry && !isOpen(state, entry.bereich)) return { status: 'gesperrt', items: [], gained: 0, locked: [entry] };
    return { status: result.kind, items: [], gained: 0, entry, locked: [] };
  }

  const matched = result.ids.map((id) => INDEX.byId.get(id));
  const open = matched.filter((e) => isOpen(state, e.bereich));
  const locked = matched.filter((e) => !isOpen(state, e.bereich));
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
    if (item.art === 'neu') {
      state.discovered[id] = now;
      delete state.luecken[id];
    }
    if (item.art === 'neu' && state.boosts.hint === id) state.boosts.hint = null;
    if (item.art === 'wert') state.values[id] = now;
    const isValue = item.art === 'wert' || item.art === 'wertWiederholung';
    state.lastSeen[isValue ? id + '#wert' : id] = now;
  }

  state.insight += gained;
  state.totalInsight += gained;
  if (gained > 0) state.stats.hits++;
  const timeBonus = addTime(state, items.reduce((s, i) => s + itemTimeBonus(i), 0), now);
  return {
    status: 'treffer', items, gained, locked, timeBonus,
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
 * Nächste offene Frage nach `afterId` – erst im selben Bereich, dann irgendwo.
 * Es geht reihum durch den Katalog, so dass wiederholtes Überspringen alle
 * offenen Fragen erreicht und erst danach wieder bei der ersten ankommt.
 */
export function nextOpenQuestion(state, afterId) {
  const { questions: QUESTIONS } = weltOf(state);
  const i = QUESTIONS.findIndex((q) => q.id === afterId);
  const after = QUESTIONS[i];
  const ring = [...QUESTIONS.slice(i + 1), ...QUESTIONS.slice(0, Math.max(0, i))]
    .filter((q) => questionStatus(state, q) === 'offen');
  return ring.find((q) => q.bereich === after?.bereich) ?? ring[0] ?? null;
}

/**
 * Beantwortet eine Frage aus dem Katalog.
 * Rückgabe: { status: 'richtig' | 'falsch' | 'leer' | 'nichtOffen', points, attempts, canReveal }
 */
/** Antwort werten; meldet zusätzlich neu erreichte Zeugnis-Medaillen (Issue #42). */
export function answerQuestion(state, id, raw, now = Date.now()) {
  return mitEhrungen(state, () => answerQuestionIntern(state, id, raw, now));
}

function answerQuestionIntern(state, id, raw, now) {
  const { index: INDEX, questionById } = weltOf(state);
  const q = questionById.get(id);
  if (!q || questionStatus(state, q) !== 'offen') return { status: 'nichtOffen', points: 0 };
  if (countdownOver(state, now)) return { status: 'vorbei', points: 0 };
  if (!String(raw).trim()) return { status: 'leer', points: 0 };

  const entry = INDEX.byId.get(q.antwort);
  let correct;
  if (q.wert) {
    correct = checkValue(entry, raw) === 'ok';
  } else {
    // Neben der Antwort zählen auch ausdrücklich erlaubte Alternativen (`auch`)
    const accepted = [q.antwort, ...(q.auch ?? [])];
    const result = match(INDEX, raw);
    correct = result.kind === 'treffer' && result.ids.some((x) => accepted.includes(x));
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
  const timeBonus = addTime(state, COUNTDOWN.bonusMs[q.tier] * COUNTDOWN.questionFactor, now);
  return { status: 'richtig', points, entry, boost, timeBonus };
}

/** Löst eine Frage nach genug Fehlversuchen auf – ohne Punkte. */
export function revealQuestion(state, id, now = Date.now()) {
  const { index, questionById } = weltOf(state);
  const q = questionById.get(id);
  if (!q || questionStatus(state, q) !== 'offen' || !canReveal(state, q)) return null;
  state.revealed[id] = now;
  return index.byId.get(q.antwort);
}

// ---------- Einmal-Upgrades ----------

export function boostPrice(state, id) {
  const b = BOOST_BY_ID.get(id);
  return Math.ceil(b.price * BOOST_PRICE_GROWTH ** (state.boosts.bought[id] || 0));
}

/** Einträge, für die ein Spickzettel infrage kommt: offen, aber noch nicht entdeckt. */
function hintCandidates(state) {
  return weltOf(state).entries.filter((e) => isOpen(state, e.bereich) && !Object.hasOwn(state.discovered, e.id));
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

/**
 * Übernimmt einen gespeicherten Zustand und verwirft Unbekanntes.
 * Alte Spielstände ohne `welt` gehören zum freien Spiel; `weltId` erzwingt
 * eine Welt (z. B. beim Laden eines Klassen-Spielstands).
 */
export function restore(saved, weltId) {
  const ok = saved && typeof saved === 'object';
  const id = weltId ?? (ok && isWelt(saved.welt) ? saved.welt : 'frei');
  const state = newState(id);
  if (!ok) return state;
  const { index: INDEX, questionById: QUESTION_BY_ID, bereichIds: BEREICH_IDS, zuBereich } = weltOf(state);
  const num = (x) => (Number.isFinite(x) && x >= 0 ? x : 0);
  state.insight = num(saved.insight);
  state.totalInsight = Math.max(num(saved.totalInsight), state.insight);
  for (const old of saved.unlocked || []) {
    // Alte Kategorien gehen in ihrem (zusammengefassten) Bereich auf (Issue #26)
    const b = BEREICH_IDS.has(old) ? old : zuBereich.get(old);
    if (BEREICH_IDS.has(b) && !state.unlocked.includes(b)) state.unlocked.push(b);
  }
  for (const [id, t] of Object.entries(saved.discovered || {})) if (INDEX.byId.has(id)) state.discovered[id] = num(t);
  for (const [id, t] of Object.entries(saved.values || {})) if (INDEX.byId.get(id)?.values) state.values[id] = num(t);
  for (const [k, t] of Object.entries(saved.lastSeen || {})) state.lastSeen[k] = num(t);
  for (const key of ['answered', 'revealed', 'attempts']) {
    for (const [id, v] of Object.entries(saved[key] || {})) if (QUESTION_BY_ID.has(id)) state[key][id] = num(v);
  }
  for (const [id, n] of Object.entries(saved.luecken || {})) {
    if (!INDEX.byId.has(id) || Object.hasOwn(state.discovered, id)) continue;
    const max = aufdeckReihenfolge(INDEX.byId.get(id)).length - 1;
    const k = Math.min(Math.floor(num(n)), max);
    if (k > 0) state.luecken[id] = k;
  }
  // Schätzungen (Issue #46): nur bekannte IDs, gültige Zahlen, Punkte gedeckelt
  const { schaetzById } = weltOf(state);
  for (const [sid, v] of Object.entries(saved.schaetzungen || {})) {
    const s = schaetzById.get(sid);
    if (!s || !v || typeof v !== 'object' || !Number.isFinite(v.schaetzung)) continue;
    if (s.skala !== 'linear' && v.schaetzung <= 0) continue;
    state.schaetzungen[sid] = {
      t: num(v.t), schaetzung: v.schaetzung, punkte: Math.min(Math.round(num(v.punkte)), schaetzGrundwert(s) * 2),
    };
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
