import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTRIES } from '../data/index.js';
import KLASSEN from '../data/klassen/index.js';
import { QUESTION_FACTOR, TIER_POINTS } from '../src/content.js';
import {
  FREI, KLASSEN_WELTEN, answerQuestion, buyBereich, isOpen, newState, restore, submit, unlockPrice, welt,
} from '../src/game.js';
import { match } from '../src/matcher.js';
import { wikiUrl } from '../src/wiki.js';

const IDS = new Set(ENTRIES.map((e) => e.id));

test('Klassen 5 bis 13 sind vollständig und eindeutig', () => {
  assert.deepEqual(KLASSEN.map((k) => k.klasse), KLASSEN.map((k) => k.klasse).sort((a, b) => a - b));
  for (const k of KLASSEN) {
    assert.ok(k.themen.length > 0 && k.quelle, `Klasse ${k.klasse}: Themen und Quelle`);
    for (const [id, tier] of Object.entries(k.eintraege)) {
      assert.ok(IDS.has(id), `Klasse ${k.klasse}: unbekannter Eintrag ${id}`);
      assert.ok([1, 2, 3, 4].includes(tier), `Klasse ${k.klasse}: Stufe von ${id}`);
    }
    const qids = new Set();
    for (const q of k.fragen) {
      assert.match(q.id, new RegExp(`^k${k.klasse}_[a-z0-9_]+$`), q.id);
      assert.ok(!qids.has(q.id), `doppelte Frage ${q.id}`);
      qids.add(q.id);
      assert.ok(Object.hasOwn(k.eintraege, q.antwort), `${q.id}: Antwort ${q.antwort} gehört nicht zur Klasse`);
      assert.ok([1, 2, 3, 4].includes(q.tier), `${q.id}: Stufe`);
      assert.match(q.frage, /[?.)]$/, `${q.id}: Satzzeichen`);
    }
  }
});

test('Jede Klasse bietet genug zu spielen', () => {
  for (const w of KLASSEN_WELTEN) {
    assert.ok(w.entries.length >= 60, `${w.name}: nur ${w.entries.length} Einträge`);
    assert.ok(w.questions.length >= 30, `${w.name}: nur ${w.questions.length} Fragen`);
    for (const b of w.bereiche) {
      const n = w.entries.filter((e) => e.cat === b.id).length;
      const q = w.questions.filter((x) => x.bereich === b.id).length;
      assert.ok(n >= 3, `${w.name}: Bereich ${b.name} hat nur ${n} Einträge`);
      assert.ok(q >= 2, `${w.name}: Bereich ${b.name} hat nur ${q} Fragen`);
    }
    assert.deepEqual(w.start, ['begriff'], `${w.name}: Start mit Größen & Begriffe`);
  }
});

test('Freikaufen ist in jeder Klasse gut erreichbar', () => {
  for (const w of KLASSEN_WELTEN) {
    const points = w.entries.reduce((s, e) => s + TIER_POINTS[e.tier], 0)
      + w.questions.reduce((s, q) => s + TIER_POINTS[q.tier] * QUESTION_FACTOR, 0);
    const buyable = w.bereiche.length - w.start.length;
    const cost = w.prices.slice(0, buyable).reduce((a, b) => a + b, 0);
    assert.ok(cost <= 0.6 * points, `${w.name}: Freikaufen kostet ${cost}, erreichbar sind ${points}`);
    assert.ok(w.prices.length >= buyable, `${w.name}: zu wenige Preise`);
  }
});

test('Jede Frage ist mit dem Namen ihrer Antwort lösbar und hat einen Wikipedia-Link', () => {
  for (const w of KLASSEN_WELTEN) {
    const s = newState(w.id);
    s.unlocked = w.bereiche.map((b) => b.id);
    for (const q of w.questions) {
      const entry = w.index.byId.get(q.antwort);
      const answer = q.wert ? `${entry.symbols[0]} = ${entry.values[0].v} ${entry.values[0].units[0]}` : entry.name;
      assert.equal(answerQuestion(s, q.id, answer, 0).status, 'richtig', `${q.id}: „${answer}“`);
      assert.ok(wikiUrl(entry), `${q.id}: kein Wikipedia-Link für ${entry.id}`);
    }
  }
});

test('Eine Klassenwelt kennt nur ihre eigenen Einträge', () => {
  const k5 = welt('k5');
  assert.equal(k5.name, 'Klasse 5');
  const s = newState('k5');
  assert.equal(s.welt, 'k5');
  assert.deepEqual(s.unlocked, ['begriff']);
  assert.equal(submit(s, 'Stromkreis', 0).status, 'treffer');
  assert.equal(submit(s, 'Schrödinger-Gleichung', 1).status, 'unbekannt', 'gehört nicht zur Klasse 5');
  assert.equal(match(FREI.index, 'Schrödinger-Gleichung').kind, 'treffer', 'im freien Spiel schon');
  // Stufe innerhalb der Klasse statt der Stufe im freien Spiel
  assert.equal(k5.index.byId.get('b_reihe').tier, 1);
});

test('Freikaufen in einer Klasse nutzt die Klassenpreise', () => {
  const w = welt('k5');
  const s = newState('k5');
  assert.equal(unlockPrice(s), w.prices[0]);
  s.insight = 1e9;
  assert.equal(buyBereich(s, 'teilchen'), false, 'Teilchen gibt es in Klasse 5 nicht');
  for (const b of w.bereiche.slice(1)) assert.ok(buyBereich(s, b.id), b.id);
  assert.equal(unlockPrice(s), null);
  assert.ok(w.bereiche.every((b) => isOpen(s, b.id)));
});

test('Spielstände bleiben in ihrer Welt', () => {
  const s = newState('k5');
  submit(s, 'Stromkreis', 0);
  const back = restore(JSON.parse(JSON.stringify(s)));
  assert.equal(back.welt, 'k5');
  assert.ok(Object.hasOwn(back.discovered, 'b_stromkreis'));
  // Ein alter Spielstand ohne Welt gehört zum freien Spiel
  const old = restore({ insight: 5, unlocked: ['person'], discovered: { einstein: 1 } });
  assert.equal(old.welt, 'frei');
  assert.ok(old.discovered.einstein);
  // Erzwungene Welt verwirft fremde Einträge
  const forced = restore({ welt: 'frei', discovered: { einstein: 1, b_stromkreis: 2 } }, 'k5');
  assert.equal(forced.welt, 'k5');
  assert.deepEqual(Object.keys(forced.discovered), ['b_stromkreis']);
});
