// Schätzen (Issue #46): Wertung, Einmaligkeit, Sperren, Spoiler-Schutz und Balance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import FREIE_SCHAETZFRAGEN from '../data/schaetzen.js';
import { QUESTION_FACTOR, SCHAETZ_BUDGET, SCHAETZ_STUFEN, TIER_POINTS } from '../src/content.js';
import {
  FREI, KLASSEN_WELTEN, bewerteSchaetzung, naechsteSchaetzfrage, newCountdownRun, newState, restore,
  schaetzGrundwert, schaetzSperre, schaetzStatus, schaetze,
} from '../src/game.js';
import { keyOf, normUnit, normWord, parseQuantity } from '../src/normalize.js';
import { formatMesswert } from '../src/format.js';
import { SCHAETZ_REGLER } from '../src/content.js';
import { reglerAusSchaetzung, rundeSchaetzung, schaetzAusRegler } from '../src/game.js';

const WELTEN = [FREI, ...KLASSEN_WELTEN];
const log = Math.log10;

/** Ein Spielstand, in dem alles entdeckt und jeder Wert bekannt ist. */
function allesBekannt(weltId = 'frei') {
  const state = newState(weltId);
  const w = weltId === 'frei' ? FREI : KLASSEN_WELTEN.find((k) => k.id === weltId);
  for (const e of w.entries) {
    state.discovered[e.id] = 1;
    if (e.values) state.values[e.id] = 1;
  }
  return state;
}

// ---------- Spoiler-Scan: Kommen Namen von Einträgen im Text vor? ----------
const ENDUNGEN = ['', 's', 'e', 'n', 'en', 'es', 'er', 'ern', 'ns'];
const woerter = (t) => t.split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(normWord);

function genannteEintraege(welt, texte) {
  const tk = texte.flatMap(woerter);
  const gefunden = new Set();
  for (const e of welt.entries) {
    for (const name of [e.name, ...(e.aliases || [])]) {
      const nt = woerter(name);
      if (!nt.length || nt.join('').length < 4) continue;
      const treffer = tk.some((_, i) => i + nt.length <= tk.length && nt.every((b, j) => {
        const a = tk[i + j];
        return j < nt.length - 1 ? a === b : a.startsWith(b) && ENDUNGEN.includes(a.slice(b.length));
      }));
      if (treffer) { gefunden.add(e.id); break; }
    }
  }
  return gefunden;
}

test('Jede Schätzfrage ist vollständig (Quelle, Erklärung, Stufe, Bereich)', () => {
  for (const w of WELTEN) {
    const ids = new Set();
    for (const s of w.schaetzfragen) {
      assert.match(s.id, /^[a-z0-9_]+$/, s.id);
      assert.ok(!ids.has(s.id), `doppelt: ${s.id}`);
      ids.add(s.id);
      assert.ok(s.tier >= 1 && s.tier <= 4, `${s.id}: Stufe`);
      assert.ok(s.frage?.length > 10 && s.erklaerung?.length > 10, `${s.id}: Texte`);
      assert.ok(s.quelle?.length > 3, `${s.id}: Quelle fehlt`);
      assert.ok(['log', 'linear'].includes(s.skala), `${s.id}: Skala`);
      assert.ok(Number.isFinite(s.wert) && s.min < s.wert && s.wert < s.max, `${s.id}: Wert im Bereich`);
      if (s.skala === 'log') assert.ok(s.min > 0, `${s.id}: Log braucht min > 0`);
      else assert.ok(s.toleranz > 0, `${s.id}: Toleranz fehlt`);
      for (const id of [...s.bezug, ...s.bezugWert]) assert.ok(w.index.byId.has(id), `${s.id}: ${id}`);
    }
  }
});

test('Genug Schätzfragen: ≥ 40 im freien Spiel, 10–15 je Klasse', () => {
  assert.ok(FREI.schaetzfragen.length >= 40);
  for (const k of KLASSEN_WELTEN) {
    assert.ok(k.schaetzfragen.length >= 10 && k.schaetzfragen.length <= 15, `${k.id}: ${k.schaetzfragen.length}`);
  }
});

test('Kein Spoiler: Namen im Text sind als Bezug eingetragen (alle Welten)', () => {
  for (const w of WELTEN) {
    for (const s of w.schaetzfragen) {
      const frei = new Set([...s.bezug, ...s.bezugWert]);
      const fehlt = [...genannteEintraege(w, [s.frage, s.erklaerung])].filter((id) => !frei.has(id));
      const einheit = s.einheit && w.index.byKey.get(keyOf(s.einheit));
      for (const id of einheit ?? []) if (!s.bezug.includes(id)) fehlt.push(`${id} (Einheit)`);
      assert.deepEqual(fehlt, [], `${w.id}/${s.id}`);
    }
  }
});

test('Kein Spoiler: keine Formeln („=“) in Frage oder Erklärung', () => {
  for (const w of WELTEN) for (const s of w.schaetzfragen) {
    assert.ok(!/=/.test(s.frage + s.erklaerung), `${w.id}/${s.id}`);
  }
});

test('Kein Spoiler: Ein Wert nahe einer Konstante ist erst offen, wenn man ihren Wert kennt', () => {
  for (const w of WELTEN) {
    for (const s of w.schaetzfragen) {
      for (const k of w.entries.filter((e) => e.values && !s.bezugWert.includes(e.id))) {
        for (const v of k.values) {
          const gleicheEinheit = v.units.some((u) => normUnit(u) === normUnit(s.einheit));
          assert.ok(!(gleicheEinheit && Math.abs(s.wert / v.v - 1) < 0.1), `${w.id}/${s.id} verrät ${k.id}`);
        }
      }
    }
  }
});

test('Faire Bereiche: Wert weder in der Reglermitte noch am Rand', () => {
  for (const w of WELTEN) for (const s of w.schaetzfragen) {
    if (s.skala === 'linear') {
      const mitte = (s.min + s.max) / 2, t = s.toleranz;
      assert.ok(Math.abs(s.wert - mitte) > 8 * t, `${s.id}: Mitte`);
      assert.ok(s.wert - s.min >= 4 * t && s.max - s.wert >= 4 * t, `${s.id}: Rand`);
      assert.ok(s.max - s.min >= 20 * t, `${s.id}: zu schmal`);
    } else {
      const a = log(s.min), b = log(s.max), x = log(s.wert);
      assert.ok(b - a >= 3, `${s.id}: < 3 Zehnerpotenzen`);
      assert.ok(Math.abs(x - (a + b) / 2) >= 0.3, `${w.id}/${s.id}: Mitte`);
      assert.ok(x - a >= 0.5 && b - x >= 0.5, `${w.id}/${s.id}: Rand`);
    }
  }
});

test('Budget: alle Volltreffer ≤ 15 % der Fragenpunkte je Welt', () => {
  for (const w of WELTEN) {
    const fragen = w.questions.reduce((sum, q) => sum + TIER_POINTS[q.tier] * QUESTION_FACTOR, 0);
    const schaetzen = w.schaetzfragen.reduce((sum, s) => sum + schaetzGrundwert(s), 0);
    assert.ok(schaetzen <= fragen * SCHAETZ_BUDGET, `${w.id}: ${schaetzen} > ${fragen * SCHAETZ_BUDGET}`);
  }
});

test('Raten lohnt sich nicht: Zufallsschätzungen bringen < 15 % des Grundwerts', () => {
  let seed = 46;
  const zufall = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  for (const w of WELTEN) {
    let erwartet = 0, grund = 0;
    for (const s of w.schaetzfragen) {
      for (let i = 0; i < 10000 / w.schaetzfragen.length; i++) {
        const r = zufall();
        const zahl = s.skala === 'log' ? 10 ** (log(s.min) + r * (log(s.max) - log(s.min))) : s.min + r * (s.max - s.min);
        erwartet += bewerteSchaetzung(s, zahl).anteil * schaetzGrundwert(s);
        grund += schaetzGrundwert(s);
      }
    }
    assert.ok(erwartet / grund < 0.15, `${w.id}: ${(erwartet / grund * 100).toFixed(1)} %`);
  }
});

test('bewerteSchaetzung: Stufengrenzen auf Log-Skala', () => {
  const s = { skala: 'log', wert: 100 };
  assert.equal(bewerteSchaetzung(s, 100).stufe.id, 'voll');
  assert.equal(bewerteSchaetzung(s, 110).stufe.id, 'voll');
  assert.equal(bewerteSchaetzung(s, 100 / 1.1).stufe.id, 'voll');
  assert.equal(bewerteSchaetzung(s, 120).stufe.id, 'sehrgut');
  assert.equal(bewerteSchaetzung(s, 160).stufe.id, 'gut');
  assert.equal(bewerteSchaetzung(s, 300).stufe.id, 'ordnung');
  assert.equal(bewerteSchaetzung(s, 34).stufe.id, 'ordnung');
  assert.equal(bewerteSchaetzung(s, 30).stufe, null);
  assert.equal(bewerteSchaetzung(s, 301).stufe, null);
  assert.equal(bewerteSchaetzung(s, 301).anteil, 0);
  assert.equal(bewerteSchaetzung(s, 0), null);
  assert.equal(bewerteSchaetzung(s, -5), null);
  assert.equal(bewerteSchaetzung(s, NaN), null);
});

test('bewerteSchaetzung: Stufengrenzen auf linearer Skala', () => {
  const s = { skala: 'linear', wert: 90, toleranz: 2 };
  assert.equal(bewerteSchaetzung(s, 92).stufe.id, 'voll');
  assert.equal(bewerteSchaetzung(s, 86).stufe.id, 'sehrgut');
  assert.equal(bewerteSchaetzung(s, 98).stufe.id, 'gut');
  assert.equal(bewerteSchaetzung(s, 74).stufe.id, 'ordnung');
  assert.equal(bewerteSchaetzung(s, 73).stufe, null);
  assert.equal(bewerteSchaetzung(s, -10).anteil, 0); // negative Zahlen sind linear erlaubt
  assert.deepEqual(SCHAETZ_STUFEN.map((z) => z.anteil), [1, 0.7, 0.4, 0.15]);
});

test('schaetze: Punkte, nur ein Versuch, Wert auf den Bereich begrenzt', () => {
  const state = allesBekannt();
  const s = FREI.schaetzById.get('s_steckdose');
  const r = schaetze(state, s.id, 230, 1000);
  assert.equal(r.status, 'geschaetzt');
  assert.equal(r.punkte, schaetzGrundwert(s));
  assert.equal(state.insight, r.punkte);
  assert.equal(schaetzStatus(state, s), 'geschaetzt');
  assert.equal(schaetze(state, s.id, 230).status, 'nichtOffen');
  assert.equal(state.insight, r.punkte, 'kein zweites Mal');

  const t = FREI.schaetzById.get('s_mond_abstand');
  const weit = schaetze(state, t.id, 1e30);
  assert.equal(weit.schaetzung, t.max);
  assert.equal(weit.punkte, 0);
  assert.equal(state.schaetzungen[t.id].punkte, 0);
  assert.equal(schaetze(state, 's_aa_batterie', NaN).status, 'ungueltig');
  assert.equal(schaetzStatus(state, FREI.schaetzById.get('s_aa_batterie')), 'offen');
});

test('schaetze: mindestens 1 Punkt, wenn die Größenordnung stimmt', () => {
  const state = allesBekannt();
  const s = FREI.schaetzById.get('s_donner');
  const r = schaetze(state, s.id, s.wert * 2.9);
  assert.equal(r.stufe.id, 'ordnung');
  assert.ok(r.punkte >= 1);
});

test('schaetze: im Countdown nicht möglich', () => {
  const state = newCountdownRun(0);
  Object.assign(state.discovered, allesBekannt().discovered);
  Object.assign(state.values, allesBekannt().values);
  assert.equal(schaetze(state, 's_steckdose', 230).status, 'countdown');
});

test('Sperre: Schätzfrage mit Bezug ist verschlossen und nennt keine Namen', () => {
  const state = newState();
  const s = FREI.schaetzfragen.find((x) => x.bezugWert.length);
  assert.ok(s, 'Es gibt Schätzfragen mit Wert-Bezug');
  assert.equal(schaetzStatus(state, s), 'verschlossen');
  assert.equal(schaetze(state, s.id, s.wert).status, 'nichtOffen');
  for (const f of schaetzSperre(state, s)) {
    assert.deepEqual(Object.keys(f).sort(), ['area', 'cat', 'wert']);
  }
  // Nur entdeckt reicht nicht – der Wert muss bekannt sein
  for (const id of s.bezugWert) state.discovered[id] = 1;
  for (const id of s.bezug) state.discovered[id] = 1;
  assert.equal(schaetzStatus(state, s), 'verschlossen');
  for (const id of s.bezugWert) state.values[id] = 1;
  assert.equal(schaetzStatus(state, s), 'offen');
});

test('Ohne Bezug ist eine Schätzfrage von Anfang an offen', () => {
  const state = newState();
  const offen = FREI.schaetzfragen.filter((s) => schaetzStatus(state, s) === 'offen');
  assert.ok(offen.length >= 10, `nur ${offen.length} offen`);
  assert.ok(offen.every((s) => !s.bezug.length && !s.bezugWert.length));
});

test('naechsteSchaetzfrage überspringt Erledigtes und Verschlossenes', () => {
  const state = allesBekannt();
  const [a, b] = FREI.schaetzfragen;
  schaetze(state, b.id, b.wert);
  const n = naechsteSchaetzfrage(state, a.id);
  assert.ok(n && n.id !== a.id && n.id !== b.id);
  for (const s of FREI.schaetzfragen) state.schaetzungen[s.id] = { t: 0, schaetzung: 1, punkte: 0 };
  assert.equal(naechsteSchaetzfrage(state, a.id), null);
});

test('Klassen haben eigene Schätzfragen mit Präfix kN_', () => {
  for (const k of KLASSEN_WELTEN) {
    for (const s of k.schaetzfragen) assert.ok(s.id.startsWith(`${k.id}_`), s.id);
    const state = allesBekannt(k.id);
    const s = k.schaetzfragen[0];
    assert.equal(schaetze(state, s.id, s.wert).punkte, schaetzGrundwert(s));
  }
});

test('Spielstand: alter Stand ohne Schätzungen und kaputte Einträge', () => {
  const alt = restore({ insight: 5, discovered: {} });
  assert.deepEqual(alt.schaetzungen, {});
  const s = FREIE_SCHAETZFRAGEN[0];
  const r = restore({
    schaetzungen: {
      [s.id]: { t: 1, schaetzung: 3, punkte: 1e9 },
      unbekannt: { t: 1, schaetzung: 3, punkte: 5 },
      s_mond_abstand: { schaetzung: 'viel' },
      s_aa_batterie: null,
    },
  });
  assert.deepEqual(Object.keys(r.schaetzungen), [s.id]);
  assert.ok(r.schaetzungen[s.id].punkte <= schaetzGrundwert(s) * 2);
  const gespeichert = allesBekannt();
  schaetze(gespeichert, 's_steckdose', 200, 7);
  const neu = restore(JSON.parse(JSON.stringify(gespeichert)));
  assert.deepEqual(neu.schaetzungen, gespeichert.schaetzungen);
});

test('Regler: gerundete Werte, Hin- und Rückweg, Grenzen', () => {
  for (const s of FREI.schaetzfragen) {
    assert.equal(schaetzAusRegler(s, 0), rundeSchaetzung(s, s.min));
    assert.ok(schaetzAusRegler(s, SCHAETZ_REGLER) <= s.max);
    for (const pos of [1, 250, 500, 999]) {
      const v = schaetzAusRegler(s, pos);
      assert.ok(Math.abs(reglerAusSchaetzung(s, v) - pos) <= 2, `${s.id} @${pos}`);
    }
    // Der echte Wert ist mit dem Regler als Volltreffer erreichbar
    const best = schaetzAusRegler(s, reglerAusSchaetzung(s, s.wert));
    assert.equal(bewerteSchaetzung(s, best).stufe?.id, 'voll', s.id);
  }
  assert.equal(rundeSchaetzung({ skala: 'linear', toleranz: 0.5 }, 38.26), 38.3);
  assert.equal(rundeSchaetzung({ skala: 'log' }, 384399), 384000);
});

test('formatMesswert: deutsch, gerundet und wieder einlesbar', () => {
  assert.equal(formatMesswert(2.9), '2,9');
  assert.equal(formatMesswert(384400), '384\u202f000');
  assert.equal(formatMesswert(6.7e23), '6,7 · 10²³');
  assert.equal(formatMesswert(3.3e-9), '3,3 · 10⁻⁹');
  assert.equal(formatMesswert(-18), '−18');
  for (const n of [2.9, 384000, 1.5e8, 6.7e23, 3.3e-9, 0.00123, -18, 1400]) {
    assert.equal(parseQuantity(formatMesswert(n)).value, n);
  }
});
