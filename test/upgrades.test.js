import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOSTS, COMBO_WINDOW_MS, REPEAT_COOLDOWN_MS, TIER_POINTS } from '../src/content.js';
import {
  INDEX, answerQuestion, boostBlocked, boostPrice, buyBoost, comboWindow, newState, restore, submit,
} from '../src/game.js';

const rich = () => ({ ...newState(), insight: 100_000 });
const price = (id) => BOOSTS.find((b) => b.id === id).price;

test('Geistesblitz verdoppelt genau die nächste gewertete Eingabe (Issue #3)', () => {
  const s = rich();
  assert.ok(buyBoost(s, 'geistesblitz', 0));
  assert.equal(s.insight, 100_000 - price('geistesblitz'));

  const first = submit(s, 'Einstein', 1_000);
  assert.equal(first.gained, TIER_POINTS[1] * 2);
  assert.equal(first.boost.name, 'Geistesblitz');
  assert.equal(s.boosts.mult, null, 'verbraucht');

  const second = submit(s, 'Max Planck', 100_000);
  assert.equal(second.gained, TIER_POINTS[1]);
});

test('Ungewertete Eingaben verbrauchen den Multiplikator nicht', () => {
  const s = rich();
  buyBoost(s, 'heureka', 0);
  submit(s, 'Quatschwort', 1);
  submit(s, 'Myon', 2); // gesperrter Bereich
  assert.ok(s.boosts.mult);
  assert.equal(submit(s, 'Wolfgang Pauli', 3).gained, TIER_POINTS[3] * 3);
});

test('Konzentration wirkt fünfmal', () => {
  const s = rich();
  buyBoost(s, 'konzentration', 0);
  const names = ['Einstein', 'Galilei', 'Kepler', 'Max Planck', 'Hawking', 'Faraday'];
  const gains = names.map((n, i) => submit(s, n, i * 100_000).gained);
  assert.deepEqual(gains, [15, 15, 15, 15, 15, 10]);
});

test('Multiplikator wirkt auch auf Fragen', () => {
  const s = rich();
  buyBoost(s, 'geistesblitz', 0);
  assert.equal(answerQuestion(s, 'f_relativ', 'Einstein', 1).points, TIER_POINTS[1] * 2 * 2);
});

test('Nur ein Multiplikator gleichzeitig, Preis steigt mit jedem Kauf', () => {
  const s = rich();
  assert.ok(buyBoost(s, 'geistesblitz', 0));
  assert.ok(boostBlocked(s, 'heureka', 0));
  assert.equal(buyBoost(s, 'heureka', 0), false);
  submit(s, 'Einstein', 1);
  assert.equal(boostPrice(s, 'geistesblitz'), Math.ceil(price('geistesblitz') * 1.15));
  assert.ok(buyBoost(s, 'heureka', 2));
});

test('Zu wenig Erkenntnis: kein Kauf', () => {
  const s = newState();
  assert.equal(buyBoost(s, 'geistesblitz', 0), false);
  assert.equal(s.boosts.mult, null);
});

test('Kaffeepause verlängert das Combo-Fenster für eine Minute', () => {
  const s = rich();
  assert.equal(comboWindow(s, 0), COMBO_WINDOW_MS);
  buyBoost(s, 'kaffeepause', 0);
  assert.equal(comboWindow(s, 30_000), COMBO_WINDOW_MS * 2);
  assert.equal(comboWindow(s, 61_000), COMBO_WINDOW_MS);
  assert.ok(boostBlocked(s, 'kaffeepause', 30_000));
});

test('Eselsbrücke hebt die Abklingzeit auf', () => {
  const s = rich();
  submit(s, 'Einstein', 0);
  assert.equal(submit(s, 'Einstein', 1_000).gained, 0);
  buyBoost(s, 'eselsbruecke', 2_000);
  const repeat = submit(s, 'Einstein', 3_000);
  assert.equal(repeat.items[0].art, 'wiederholung');
  assert.ok(repeat.gained > 0);
  assert.ok(3_000 < REPEAT_COOLDOWN_MS);
});

test('Spickzettel zeigt einen leichten, unentdeckten Eintrag aus offenen Bereichen', () => {
  const s = rich();
  submit(s, 'Einstein', 0);
  assert.ok(buyBoost(s, 'spickzettel', 1, () => 0));
  const hint = INDEX.byId.get(s.boosts.hint);
  assert.equal(hint.cat, 'person');
  assert.equal(hint.tier, 1);
  assert.notEqual(hint.id, 'einstein');
  assert.ok(boostBlocked(s, 'spickzettel', 2), 'nur ein Spickzettel gleichzeitig');

  submit(s, hint.name, 10);
  assert.equal(s.boosts.hint, null, 'gelöst, sobald entdeckt');
});

test('Aktive Upgrades überstehen das Speichern', () => {
  const s = rich();
  buyBoost(s, 'konzentration', 0);
  buyBoost(s, 'spickzettel', 0, () => 0);
  submit(s, 'Einstein', 1);
  const copy = restore(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(copy.boosts, s.boosts);
});
