import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buyBereich, isOpen, newState, restore, submit, unlockPrice,
} from '../src/game.js';
import {
  REPEAT_COOLDOWN_MS, START_BEREICHE, TIER_POINTS, UNLOCK_PRICES,
} from '../src/content.js';

/** Zustand mit allen Bereichen offen – für Tests, die nicht ums Freischalten gehen. */
function allOpen() {
  const s = newState();
  s.unlocked = ['person', 'einheit', 'teilchen', 'phaenomen', 'gesetz', 'formel', 'konstante'];
  return s;
}

test('Zu Beginn sind nur Personen offen', () => {
  const s = newState();
  assert.deepEqual(s.unlocked, START_BEREICHE);
  assert.deepEqual(START_BEREICHE, ['person']);

  const person = submit(s, 'Marie Curie', 0);
  assert.equal(person.status, 'treffer');
  assert.equal(person.gained, TIER_POINTS[1]);

  const formel = submit(s, 'F = m·a', 1);
  assert.equal(formel.status, 'gesperrt');
  assert.equal(formel.gained, 0);
  assert.equal(formel.locked[0].cat, 'formel');
  assert.equal(s.discovered.newton2, undefined, 'gesperrte Einträge werden nicht gemerkt');
});

test('Gesperrte Konstanten verraten nichts über den Wert', () => {
  const s = newState();
  assert.equal(submit(s, 'c = 2e8', 0).status, 'gesperrt');
});

test('Mehrdeutige Eingabe zählt nur für offene Bereiche', () => {
  const s = newState();
  const r = submit(s, 'Newton', 0);
  assert.equal(r.status, 'treffer');
  assert.deepEqual(r.items.map((i) => i.entry.id), ['newton']);
  assert.deepEqual(r.locked.map((e) => e.id), ['u_newton']);
});

test('Bereiche kauft man mit Erkenntnis, der Preis steigt mit jedem Kauf', () => {
  const s = newState();
  assert.equal(unlockPrice(s), UNLOCK_PRICES[0]);
  assert.equal(buyBereich(s, 'teilchen'), false, 'zu wenig Erkenntnis');

  s.insight = UNLOCK_PRICES[0] + 5;
  assert.ok(buyBereich(s, 'teilchen'));
  assert.ok(isOpen(s, 'teilchen'));
  assert.equal(s.insight, 5);
  assert.equal(unlockPrice(s), UNLOCK_PRICES[1]);
  assert.equal(submit(s, 'Myon', 0).status, 'treffer');

  s.insight = 1e9;
  assert.equal(buyBereich(s, 'teilchen'), false, 'nicht doppelt');
  assert.equal(buyBereich(s, 'gibtsnicht'), false);
  for (const b of ['einheit', 'phaenomen', 'gesetz', 'formel', 'konstante']) assert.ok(buyBereich(s, b), b);
  assert.equal(unlockPrice(s), null, 'alles offen');
});

test('Erkenntnis entsteht nur durch Eingaben (Issue #1)', async () => {
  const game = await import('../src/game.js');
  assert.equal(game.tick, undefined);
  assert.equal(game.rate, undefined);
});

test('Wiederholung: erst Abklingzeit, dann Trinkgeld', () => {
  const s = allOpen();
  submit(s, 'Myon', 0);
  const early = submit(s, 'Myon', 10_000);
  assert.equal(early.gained, 0);
  assert.equal(early.items[0].art, 'abklingend');
  assert.equal(early.items[0].waitSeconds, 50);

  const later = submit(s, 'Myon', REPEAT_COOLDOWN_MS + 1);
  assert.equal(later.items[0].art, 'wiederholung');
  assert.equal(later.gained, Math.round(TIER_POINTS[3] * 0.05));
});

test('Konstante mit Wert: Name und Wert werden getrennt entdeckt', () => {
  const s = allOpen();
  const r = submit(s, 'c = 3e8 m/s', 0);
  assert.deepEqual(r.items.map((i) => i.art), ['neu', 'wert']);
  assert.equal(r.gained, TIER_POINTS[1] * 3);

  const s2 = allOpen();
  submit(s2, 'Lichtgeschwindigkeit', 0);
  const r2 = submit(s2, 'c = 299792458', 100_000);
  assert.deepEqual(r2.items.map((i) => i.art), ['wert']);
});

test('Combo steigert den Wert schneller Treffer', () => {
  const s = newState();
  submit(s, 'Isaac Newton', 0);
  submit(s, 'Galilei', 1_000);
  const third = submit(s, 'Einstein', 2_000);
  assert.equal(third.combo, 3);
  assert.equal(third.gained, Math.round(TIER_POINTS[1] * 1.2));

  const late = submit(s, 'Marie Curie', 60_000);
  assert.equal(late.combo, 1);
});

test('Spielstand übersteht Speichern und verwirft Unsinn', () => {
  const s = newState();
  submit(s, 'Max Planck', 0);
  s.insight = 500;
  s.totalInsight = 500;
  buyBereich(s, 'formel');
  const copy = restore(JSON.parse(JSON.stringify(s)));
  assert.deepEqual({ ...copy, combo: null }, { ...s, combo: null }); // Combo wird bewusst nicht gespeichert

  const dirty = restore({ insight: -5, unlocked: ['formel', 'quatsch'], discovered: { erfunden: 1 }, buildings: { apfelbaum: 3 } });
  assert.equal(dirty.insight, 0);
  assert.deepEqual(dirty.unlocked, ['person', 'formel'], 'Startbereich bleibt immer offen');
  assert.deepEqual(dirty.discovered, {});
  assert.equal(dirty.buildings, undefined, 'alte Einrichtungen fallen weg');
});
