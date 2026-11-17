import { test } from 'node:test';
import assert from 'node:assert/strict';
import FRAGEN from '../data/fragen.js';
import { BEREICHE, QUESTION_TRIES, TIER_POINTS } from '../src/content.js';
import {
  INDEX, QUESTIONS, answerQuestion, newState, nextOpenQuestion, questionStatus, revealQuestion,
} from '../src/game.js';

const BEREICH_IDS = new Set(BEREICHE.map((b) => b.id));
const allOpen = () => ({ ...newState(), unlocked: BEREICHE.map((b) => b.id) });

test('Jede Frage ist vollständig und verweist auf einen echten Eintrag', () => {
  const seen = new Set();
  for (const q of FRAGEN) {
    assert.match(q.id, /^[a-z0-9_]+$/, q.id);
    assert.ok(!seen.has(q.id), `doppelte ID ${q.id}`);
    seen.add(q.id);
    assert.ok(Number.isInteger(q.tier) && q.tier >= 1 && q.tier <= 5, q.id);
    assert.ok(q.frage.endsWith('?') || q.frage.endsWith(')'), `${q.id}: Fragezeichen`);
    const entry = INDEX.byId.get(q.antwort);
    assert.ok(entry, `${q.id}: Antwort ${q.antwort} fehlt`);
    if (q.wert) assert.ok(entry.values, `${q.id}: Wert-Frage braucht eine Konstante`);
  }
});

test('Jeder Bereich hat Fragen', () => {
  for (const b of BEREICH_IDS) {
    assert.ok(QUESTIONS.filter((q) => q.bereich === b).length >= 4, b);
  }
});

test('Die eigene Antwort jeder Frage wird als richtig erkannt', () => {
  for (const q of QUESTIONS) {
    const s = allOpen();
    const entry = INDEX.byId.get(q.antwort);
    const answer = q.wert ? String(entry.values[0].v) : entry.name;
    assert.equal(answerQuestion(s, q.id, answer, 0).status, 'richtig', q.id);
  }
});

test('Richtige Antwort bringt Punkte, aber nur einmal', () => {
  const s = newState();
  const r = answerQuestion(s, 'f_relativ', 'einstein', 0);
  assert.equal(r.status, 'richtig');
  assert.equal(r.points, TIER_POINTS[1] * 2);
  assert.equal(s.insight, TIER_POINTS[1] * 2);
  assert.equal(answerQuestion(s, 'f_relativ', 'Einstein', 1).status, 'nichtOffen');
  assert.equal(questionStatus(s, QUESTIONS.find((q) => q.id === 'f_relativ')), 'richtig');
});

test('Fragen aus gesperrten Bereichen sind nicht beantwortbar', () => {
  const s = newState();
  assert.equal(answerQuestion(s, 'f_lichtquant', 'Photon', 0).status, 'nichtOffen');
  assert.equal(s.insight, 0);
});

test('Mehrdeutige und tolerante Antworten zählen', () => {
  const s = allOpen();
  assert.equal(answerQuestion(s, 'f_kraft', 'Newton', 0).status, 'richtig');
  assert.equal(answerQuestion(s, 'f_masse_energie', 'E = m c²', 0).status, 'richtig');
  assert.equal(answerQuestion(s, 'f_oeltropfen', 'Öltröpfchenversuch', 0).status, 'richtig');
});

test('Wert-Fragen brauchen den Zahlenwert, mit oder ohne Formelzeichen', () => {
  for (const answer of ['299792458 m/s', '3e8', 'c = 3·10^8 m/s', '300000 km/s']) {
    assert.equal(answerQuestion(allOpen(), 'f_c', answer, 0).status, 'richtig', answer);
  }
  const s = allOpen();
  assert.equal(answerQuestion(s, 'f_c', 'Lichtgeschwindigkeit', 0).status, 'falsch');
  assert.equal(answerQuestion(s, 'f_c', '3e8 kg', 0).status, 'falsch');
});

test('Auflösen erst nach drei Fehlversuchen und ohne Punkte', () => {
  const s = newState();
  for (let i = 1; i < QUESTION_TRIES; i++) {
    const r = answerQuestion(s, 'f_relativ', 'Newton', i);
    assert.equal(r.status, 'falsch');
    assert.equal(r.canReveal, false);
  }
  assert.equal(revealQuestion(s, 'f_relativ'), null, 'noch zu früh');
  assert.equal(answerQuestion(s, 'f_relativ', 'Galilei', 9).canReveal, true);
  assert.equal(revealQuestion(s, 'f_relativ').id, 'einstein');
  assert.equal(answerQuestion(s, 'f_relativ', 'Einstein', 10).status, 'nichtOffen');
  assert.equal(s.insight, 0);
});

test('Überspringen geht reihum durch alle offenen Fragen des Bereichs (#14)', () => {
  const s = newState(); // nur Personen offen
  const personen = QUESTIONS.filter((q) => q.bereich === 'person');
  const seen = [personen[0].id];
  let id = personen[0].id;
  for (let i = 1; i < personen.length; i++) {
    id = nextOpenQuestion(s, id).id;
    seen.push(id);
  }
  assert.deepEqual(new Set(seen), new Set(personen.map((q) => q.id)), 'jede Personen-Frage kommt einmal dran');
  assert.equal(nextOpenQuestion(s, id).id, personen[0].id, 'danach wieder von vorn');
  assert.equal(s.insight, 0, 'Überspringen kostet und bringt nichts');
});

test('Überspringen lässt beantwortete Fragen aus und wechselt notfalls den Bereich (#14)', () => {
  const s = allOpen();
  const personen = QUESTIONS.filter((q) => q.bereich === 'person');
  for (const q of personen.slice(1)) answerQuestion(s, q.id, INDEX.byId.get(q.antwort).name, 0);
  const next = nextOpenQuestion(s, personen[0].id);
  assert.notEqual(next.bereich, 'person');
  assert.equal(questionStatus(s, next), 'offen');
  const t = newState();
  for (const q of personen) answerQuestion(t, q.id, INDEX.byId.get(q.antwort).name, 0);
  assert.equal(nextOpenQuestion(t, personen[0].id), null, 'keine offene Frage mehr');
});
