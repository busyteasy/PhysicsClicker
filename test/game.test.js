import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as game from '../src/game.js';
import {
  BUILDINGS, HOME_AREA_FACTOR, REPEAT_COOLDOWN_MS, TIER_POINTS,
} from '../src/content.js';

const {
  buildingBonus, buildingCost, buyBuilding, buyUpgrade, facilityBonus, newState, restore, submit,
} = game;

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

test('Einrichtungen kosten mit jedem Kauf mehr', () => {
  const s = newState();
  s.insight = 1_000;
  assert.equal(buildingCost(s, 'apfelbaum'), 20);
  assert.ok(buyBuilding(s, 'apfelbaum'));
  assert.equal(buildingCost(s, 'apfelbaum'), 23);
  assert.equal(s.insight, 980);
  s.insight = 0;
  assert.equal(buyBuilding(s, 'apfelbaum'), false);
});

test('Einrichtungen erzeugen nichts von selbst (Issue #1)', () => {
  const s = newState();
  s.buildings.apfelbaum = 10;
  s.buildings.beschleuniger = 3;
  assert.equal(game.tick, undefined, 'es gibt keine passive Produktion mehr');
  assert.equal(game.rate, undefined);
  assert.equal(s.insight, 0);
});

test('Einrichtungen geben einen Bonus je Treffer, im eigenen Gebiet doppelt', () => {
  const s = newState();
  s.buildings.apfelbaum = 3; // Mechanik
  assert.equal(facilityBonus(s, 'optik'), 3 * BUILDINGS[0].bonus);
  assert.equal(facilityBonus(s, 'mechanik'), 3 * BUILDINGS[0].bonus * HOME_AREA_FACTOR);

  const optik = submit(s, 'Regenbogen', 0);           // Stufe 1, Optik
  assert.equal(optik.gained, TIER_POINTS[1] + 3 * BUILDINGS[0].bonus);
  const mechanik = submit(s, 'Reibung', 600_000);     // Stufe 1, Mechanik
  assert.equal(mechanik.gained, TIER_POINTS[1] + 3 * BUILDINGS[0].bonus * HOME_AREA_FACTOR);
});

test('Gebiets-Upgrade braucht Entdeckungen und verdoppelt Eingaben und Einrichtung', () => {
  const s = newState();
  s.insight = 1_000;
  buyBuilding(s, 'apfelbaum');
  assert.equal(buyUpgrade(s, 'mechanik_1'), false, 'noch gesperrt');
  for (const raw of ['F=ma', 'p=mv', 'Reibung', 'Auftrieb', 'Hebelgesetz']) submit(s, raw, 0);
  const before = buildingBonus(s, 'apfelbaum');
  s.insight = 1_000;
  assert.ok(buyUpgrade(s, 'mechanik_1'));
  assert.equal(buildingBonus(s, 'apfelbaum'), before * 2);
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
