import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, ENTRIES } from '../data/index.js';
import { AREAS, BEREICHE, START_BEREICHE, UNLOCK_PRICES } from '../src/content.js';
import { buildIndex, match } from '../src/matcher.js';
import { isRelation, keyOf, normWord } from '../src/normalize.js';

const AREA_IDS = new Set(AREAS.map((a) => a.id));

test('Jeder Eintrag ist vollständig', () => {
  const seen = new Set();
  for (const e of ENTRIES) {
    assert.match(e.id, /^[a-z0-9_]+$/, e.id);
    assert.ok(!seen.has(e.id), `doppelte ID ${e.id}`);
    seen.add(e.id);
    assert.ok(CATEGORIES[e.cat], `${e.id}: Kategorie ${e.cat}`);
    assert.ok(AREA_IDS.has(e.area), `${e.id}: Gebiet ${e.area}`);
    assert.ok(Number.isInteger(e.tier) && e.tier >= 1 && e.tier <= 5, `${e.id}: Stufe`);
    assert.ok(e.name && e.fact, `${e.id}: Name und Fun Fact`);
    assert.ok(Array.isArray(e.aliases), `${e.id}: aliases`);
    if (e.cat === 'konstante') {
      assert.ok(e.values.length && e.symbols.length, `${e.id}: Werte und Symbole`);
      for (const v of e.values) assert.ok(Number.isFinite(v.v) && v.v !== 0, `${e.id}: Wert`);
    }
  }
});

test('Begriffe sind mindestens drei Zeichen lang', () => {
  for (const e of ENTRIES) {
    for (const alias of [e.name, ...e.aliases]) {
      if (!isRelation(alias)) assert.ok(normWord(alias).length >= 3, `${e.id}: "${alias}" zu kurz`);
    }
  }
});

test('Schreibweisen kollidieren nur zwischen Person und Einheit', () => {
  const byKey = new Map();
  for (const e of ENTRIES) {
    for (const alias of [e.name, ...e.aliases]) {
      const key = keyOf(alias);
      if (!byKey.has(key)) byKey.set(key, new Map());
      byKey.get(key).set(e.id, e.cat);
    }
  }
  for (const [key, owners] of byKey) {
    if (owners.size < 2) continue;
    const cats = [...owners.values()].sort();
    assert.deepEqual(cats, ['einheit', 'person'], `Kollision bei ${key}: ${[...owners.keys()]}`);
  }
});

test('Jeder Eintrag ist über seinen eigenen Namen erreichbar', () => {
  const index = buildIndex(ENTRIES);
  for (const e of ENTRIES) {
    const r = match(index, e.name);
    assert.equal(r.kind, 'treffer', e.name);
    assert.ok(r.ids.includes(e.id), `${e.name} -> ${r.ids}`);
  }
});

test('Jede Kategorie ist ein Bereich, und es gibt genug Preise', () => {
  assert.deepEqual(BEREICHE.map((b) => b.id).sort(), Object.keys(CATEGORIES).sort());
  assert.equal(UNLOCK_PRICES.length, BEREICHE.length - START_BEREICHE.length);
  for (let i = 1; i < UNLOCK_PRICES.length; i++) assert.ok(UNLOCK_PRICES[i] > UNLOCK_PRICES[i - 1]);
});
