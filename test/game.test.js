import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildingCost, buyBuilding, buyUpgrade, newState, rate, restore, submit, tick,
} from '../src/game.js';
import { REPEAT_COOLDOWN_MS, TIER_POINTS } from '../src/content.js';

test('Erstentdeckung bringt den Grundwert der Stufe', () => {
  const s = newState();
  const r = submit(s, 'F = m·a', 1_000);
  assert.equal(r.status, 'treffer');
  assert.equal(r.gained, TIER_POINTS[1]);
  assert.equal(r.items[0].art, 'neu');
  assert.ok(s.discovered.newton2);
  assert.equal(s.insight, TIER_POINTS[1]);
});

test('Wiederholung: erst Abklingzeit, dann Trinkgeld', () => {
  const s = newState();
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
  const s = newState();
  const r = submit(s, 'c = 3e8 m/s', 0);
  assert.deepEqual(r.items.map((i) => i.art), ['neu', 'wert']);
  assert.equal(r.gained, TIER_POINTS[1] * 3);

  const s2 = newState();
  submit(s2, 'Lichtgeschwindigkeit', 0);
  const r2 = submit(s2, 'c = 299792458', 100_000);
  assert.deepEqual(r2.items.map((i) => i.art), ['wert']);
});

test('Combo steigert den Wert schneller Treffer', () => {
  const s = newState();
  submit(s, 'Elektron', 0);
  submit(s, 'Proton', 1_000);
  const third = submit(s, 'Neutron', 2_000);
  assert.equal(third.combo, 3);
  assert.equal(third.gained, Math.round(TIER_POINTS[1] * 1.2));

  const late = submit(s, 'Photon', 60_000);
  assert.equal(late.combo, 1);
});

test('Einrichtungen kosten mit jedem Kauf mehr und produzieren', () => {
  const s = newState();
  s.insight = 1_000;
  assert.equal(buildingCost(s, 'apfelbaum'), 20);
  assert.ok(buyBuilding(s, 'apfelbaum'));
  assert.equal(buildingCost(s, 'apfelbaum'), 23);
  assert.equal(s.insight, 980);
  assert.ok(rate(s) > 0);
  const before = s.insight;
  tick(s, 10);
  assert.ok(Math.abs(s.insight - before - rate(s) * 10) < 1e-9);
  s.insight = 0;
  assert.equal(buyBuilding(s, 'apfelbaum'), false);
});

test('Gebiets-Upgrade braucht Entdeckungen und verdoppelt', () => {
  const s = newState();
  s.insight = 1_000;
  buyBuilding(s, 'apfelbaum');
  assert.equal(buyUpgrade(s, 'mechanik_1'), false, 'noch gesperrt');
  for (const raw of ['F=ma', 'p=mv', 'Reibung', 'Auftrieb', 'Hebelgesetz']) submit(s, raw, 0);
  const before = rate(s);
  assert.ok(buyUpgrade(s, 'mechanik_1'));
  assert.equal(rate(s), before * 2);
  assert.equal(buyUpgrade(s, 'mechanik_1'), false, 'nur einmal');
});

test('Spielstand übersteht Speichern und verwirft Unsinn', () => {
  const s = newState();
  submit(s, 'Ohmsches Gesetz', 0);
  s.buildings.apfelbaum = 3;
  const copy = restore(JSON.parse(JSON.stringify(s)));
  assert.deepEqual({ ...copy, combo: null }, { ...s, combo: null }); // Combo wird bewusst nicht gespeichert

  const dirty = restore({ insight: -5, buildings: { apfelbaum: 'x', gibtsnicht: 4 }, discovered: { erfunden: 1 }, upgrades: ['nope'] });
  assert.equal(dirty.insight, 0);
  assert.equal(dirty.buildings.apfelbaum, 0);
  assert.deepEqual(dirty.discovered, {});
  assert.deepEqual(dirty.upgrades, []);
});
