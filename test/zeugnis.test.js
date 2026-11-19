// Zeugnisse in den Klassen (Issue #42)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZEUGNIS_STUFEN } from '../src/content.js';
import {
  answerQuestion, newState, restore, submit, welt, zeugnis, zeugnisFortschritte, zeugnisStufe,
} from '../src/game.js';

test('Stufen: Bronze ab 40 %, Silber ab 70 %, Gold ab 90 %', () => {
  assert.equal(zeugnisStufe(0.39), null);
  assert.equal(zeugnisStufe(0.4).id, 'bronze');
  assert.equal(zeugnisStufe(0.7).id, 'silber');
  assert.equal(zeugnisStufe(0.89).id, 'silber');
  assert.equal(zeugnisStufe(1).id, 'gold');
  assert.deepEqual(ZEUGNIS_STUFEN.map((z) => z.ab), [0.4, 0.7, 0.9]);
});

test('Im freien Spiel gibt es kein Zeugnis', () => {
  assert.equal(zeugnis(newState()), null);
  assert.deepEqual(submit(newState(), 'Newton', 0).ehrungen, []);
});

test('Zeugnis zählt Einträge und richtig beantwortete Fragen je Bereich', () => {
  const s = newState('k5');
  const z = zeugnis(s);
  assert.equal(z.bereiche.length, welt('k5').bereiche.length);
  assert.ok(z.bereiche.every((b) => b.geschafft === 0 && b.stufe === null && b.naechste.id === 'bronze'));
  const w = welt('k5');
  const gesamt = w.entries.length + w.questions.length;
  assert.equal(z.gesamt.gesamt, gesamt);

  submit(s, 'Volta', 0);
  const forschung = zeugnis(s).bereiche.find((b) => b.id === 'forschung');
  assert.equal(forschung.geschafft, 1);
  const q = w.questions.find((x) => x.bereich === 'forschung');
  answerQuestion(s, q.id, w.index.byId.get(q.antwort).name, 1);
  assert.equal(zeugnis(s).bereiche.find((b) => b.id === 'forschung').geschafft, 2);
});

test('Neue Medaillen werden bei der Eingabe gemeldet – einmal', () => {
  const w = welt('k5');
  const s = newState('k5');
  const forschung = w.entries.filter((e) => e.bereich === 'forschung');
  const fragen = w.questions.filter((q) => q.bereich === 'forschung');
  const gesamt = forschung.length + fragen.length;
  // knapp unter Bronze auffüllen
  for (const e of forschung.slice(0, Math.ceil(gesamt * 0.4) - 1)) s.discovered[e.id] = 0;
  assert.equal(zeugnis(s).bereiche.find((b) => b.id === 'forschung').stufe, null);
  const naechster = forschung[Math.ceil(gesamt * 0.4) - 1];
  const r = submit(s, naechster.name, 1);
  assert.equal(r.status, 'treffer');
  assert.deepEqual(r.ehrungen.map((e) => [e.id, e.stufe.id, e.klasse]), [['forschung', 'bronze', false]]);
  // Wiederholung bringt keine neue Medaille
  assert.deepEqual(submit(s, naechster.name, 100_000).ehrungen, []);
});

test('Gold für die ganze Klasse, wenn fast alles geschafft ist', () => {
  const w = welt('k6');
  const s = newState('k6');
  for (const e of w.entries) s.discovered[e.id] = 0;
  for (const q of w.questions.slice(1)) s.answered[q.id] = 0;
  const z = zeugnis(s);
  assert.equal(z.gesamt.stufe.id, 'gold');
  assert.equal(z.gesamt.naechste, null);
});

test('Fortschritte vergleichen: nur Aufstiege zählen', () => {
  const s = newState('k5');
  const vorher = zeugnis(s);
  for (const e of welt('k5').entries) s.discovered[e.id] = 0;
  const auf = zeugnisFortschritte(vorher, zeugnis(s));
  assert.ok(auf.some((x) => x.klasse), 'auch die ganze Klasse steigt auf');
  assert.ok(auf.filter((x) => !x.klasse).length === welt('k5').bereiche.length, 'jeder Bereich steigt auf');
  assert.deepEqual(zeugnisFortschritte(zeugnis(s), vorher), [], 'Abstieg wird nicht gemeldet');
});

test('Alte Klassen-Spielstände bekommen ihre Medaillen ohne Umbau', () => {
  const w = welt('k7');
  const discovered = Object.fromEntries(w.entries.map((e) => [e.id, 1]));
  const s = restore({ welt: 'k7', insight: 3, unlocked: ['begriff'], discovered });
  assert.ok(zeugnis(s).gesamt.stufe, 'Medaille aus vorhandenen Entdeckungen');
});
