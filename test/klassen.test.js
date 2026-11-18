import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTRIES } from '../data/index.js';
import KLASSEN from '../data/klassen/index.js';
import { BEREICHE, KLASSEN_BEREICH_REIHENFOLGE } from '../src/content.js';
import {
  FREI, KLASSEN_WELTEN, answerQuestion, buyBereich, newState, restore, submit, unlockPrice, welt,
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
      for (const a of q.auch) assert.ok(Object.hasOwn(k.eintraege, a), `${q.id}: Alternative ${a} gehört nicht zur Klasse`);
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
      const n = w.entries.filter((e) => e.bereich === b.id).length;
      const q = w.questions.filter((x) => x.bereich === b.id).length;
      assert.ok(n >= 3, `${w.name}: Bereich ${b.name} hat nur ${n} Einträge`);
      assert.ok(q >= 2, `${w.name}: Bereich ${b.name} hat nur ${q} Fragen`);
    }
    assert.ok(w.bereiche[0].id.startsWith('begriff'), `${w.name}: Größen & Begriffe stehen vorn`);
  }
});

// Issue #30: In den Klassen ist alles sofort offen, nur im freien Spiel wird freigeschaltet
test('In jeder Klasse sind alle Bereiche von Anfang an offen', () => {
  for (const w of KLASSEN_WELTEN) {
    const s = newState(w.id);
    assert.deepEqual([...s.unlocked].sort(), w.bereiche.map((b) => b.id).sort(), w.name);
    assert.equal(unlockPrice(s), null, `${w.name}: nichts zu kaufen`);
    s.insight = 1e9;
    assert.ok(w.bereiche.every((b) => !buyBereich(s, b.id)), `${w.name}: Kaufen geht ins Leere`);
    assert.equal(s.insight, 1e9, 'keine Erkenntnis abgezogen');
  }
  assert.deepEqual(newState('frei').unlocked, ['person'], 'im freien Spiel bleibt es beim Freischalten');
});

test('Die Klassen-Reihenfolge der Bereiche kennt jede Kategorie', () => {
  assert.deepEqual([...KLASSEN_BEREICH_REIHENFOLGE].sort(), BEREICHE.map((b) => b.id).sort());
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
      for (const a of q.auch) {
        const t = newState(w.id);
        t.unlocked = s.unlocked;
        assert.equal(answerQuestion(t, q.id, w.index.byId.get(a).name, 0).status, 'richtig', `${q.id}: Alternative ${a}`);
      }
    }
  }
});

test('Eine Klassenwelt kennt nur ihre eigenen Einträge', () => {
  const k5 = welt('k5');
  assert.equal(k5.name, 'Klasse 5');
  const s = newState('k5');
  assert.equal(s.welt, 'k5');
  assert.equal(submit(s, 'Stromkreis', 0).status, 'treffer');
  assert.equal(submit(s, 'Volta', 0).status, 'treffer', 'auch Personen sofort');
  assert.equal(submit(s, 'Schrödinger-Gleichung', 1).status, 'unbekannt', 'gehört nicht zur Klasse 5');
  assert.equal(match(FREI.index, 'Schrödinger-Gleichung').kind, 'treffer', 'im freien Spiel schon');
  // Stufe innerhalb der Klasse statt der Stufe im freien Spiel
  assert.equal(k5.index.byId.get('b_reihe').tier, 1);
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

// Issue #26: Kleine Klassen fassen Kategorien zu weniger Bereichen zusammen
test('Untere Klassen haben weniger Bereiche als die Oberstufe', () => {
  const n = (id) => welt(id).bereiche.length;
  assert.ok(n('k5') <= 4, `Klasse 5 hat ${n('k5')} Bereiche`);
  assert.ok(n('k5') < n('k7') && n('k7') < n('k12'));
  const k5 = welt('k5');
  assert.deepEqual(k5.bereiche.map((b) => b.name).sort(), ['Forscher & Versuche', 'Geräte & Bauteile', 'Größen & Einheiten', 'Phänomene']);
  // Einträge behalten ihre Kategorie, gehören aber zum zusammengefassten Bereich
  const volta = k5.index.byId.get('volta');
  assert.equal(volta.cat, 'person');
  assert.equal(volta.bereich, 'forschung');
  // Im freien Spiel ist jede Kategorie ihr eigener Bereich
  assert.ok(welt('frei').entries.every((e) => e.bereich === e.cat));
});

test('Gruppierte Bereiche lassen sich sofort bespielen', () => {
  const s = newState('k5');
  assert.equal(submit(s, 'Volta', 0).status, 'treffer');
  assert.equal(submit(s, 'Kugel-Ring-Versuch', 1).status, 'treffer');
  assert.equal(submit(s, 'Volt', 2).status, 'treffer', 'Einheiten stecken in „Größen & Einheiten“');
});

test('Alte Klassen-Spielstände laden – mit allen Bereichen offen und ihrer Erkenntnis', () => {
  // Stand von vor #26 (einzelne Kategorien) und vor #30 (nur einiges freigekauft)
  const s = restore({ welt: 'k5', insight: 7, unlocked: ['begriff', 'einheit', 'person'], discovered: { volta: 1 } });
  assert.deepEqual([...s.unlocked].sort(), welt('k5').bereiche.map((b) => b.id).sort());
  assert.equal(s.insight, 7);
  assert.ok(s.discovered.volta);
});

// Issue #25: nur ein Beispiel je Bereich, damit man nicht einfach abtippt
test('Jeder Bereich zeigt genau ein Beispiel', () => {
  for (const w of [welt('frei'), ...KLASSEN_WELTEN]) {
    for (const b of w.bereiche) assert.ok(b.beispiel && !b.beispiel.includes(', '), `${w.name}/${b.name}: ${b.beispiel}`);
  }
});

// Issue #27/#28: jede Klasse hat eine Beschreibung und eine Themenliste
test('Jede Klasse hat eine kurze Inhaltsübersicht', () => {
  for (const w of KLASSEN_WELTEN) {
    assert.ok(w.info.beschreibung?.length > 30, `${w.name}: Beschreibung fehlt`);
    assert.ok(w.info.themen.length >= 3, `${w.name}: zu wenige Themen`);
  }
});
