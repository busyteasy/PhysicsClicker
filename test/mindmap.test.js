import { test } from 'node:test';
import assert from 'node:assert/strict';
import BEZUEGE from '../data/bezuege.js';
import { BEREICHE } from '../src/content.js';
import { INDEX, buyBereich, newState, submit } from '../src/game.js';
import { mindmap, personLinks, verbindungen } from '../src/mindmap.js';

test('Bezüge: nur Personen als Schlüssel, nur echte Einträge als Ziele', () => {
  for (const [person, ids] of Object.entries(BEZUEGE)) {
    assert.equal(INDEX.byId.get(person)?.cat, 'person', `${person} ist keine Person`);
    assert.equal(new Set(ids).size, ids.length, `${person}: doppelte Bezüge`);
    for (const id of ids) {
      assert.ok(INDEX.byId.has(id), `${person}: unbekannte ID ${id}`);
      assert.notEqual(INDEX.byId.get(id).cat, 'person', `${person} → ${id}: keine Person-zu-Person-Bezüge`);
    }
  }
});

test('Mindmap zeigt nur offene Bereiche und verrät keine Namen', () => {
  const s = newState();
  const map = mindmap(s);
  assert.equal(map.locked.length, BEREICHE.length - 1);
  for (const area of map.areas) {
    for (const b of area.bereiche) {
      assert.equal(b.id, 'person');
      for (const n of b.nodes) {
        assert.equal(n.known, false);
        assert.equal(n.name, null);
      }
    }
  }
  const total = map.areas.reduce((x, a) => x + a.total, 0);
  assert.equal(total, [...INDEX.byId.values()].filter((e) => e.cat === 'person').length);
});

test('Entdeckte Einträge erscheinen mit Namen und zählen als gefunden', () => {
  const s = newState();
  submit(s, 'Einstein', 0);
  const relativ = mindmap(s).areas.find((a) => a.id === 'relativ');
  const einstein = relativ.bereiche[0].nodes.find((n) => n.id === 'einstein');
  assert.equal(einstein.name, 'Albert Einstein');
  assert.equal(relativ.found, 1);
  assert.equal(relativ.missing, relativ.total - 1);
  assert.equal(relativ.bereiche[0].nodes[0].id, 'einstein', 'Entdecktes steht vorn');
});

test('Bezüge einer Person erscheinen erst, wenn Person und Bereich bekannt sind (#11)', () => {
  const s = newState();
  assert.deepEqual(personLinks(s, 'einstein'), [], 'Person noch nicht entdeckt');
  submit(s, 'Einstein', 0);
  assert.deepEqual(personLinks(s, 'einstein'), [], 'Experimente noch gesperrt');

  s.insight = 1000;
  assert.ok(buyBereich(s, 'experiment'));
  const links = personLinks(s, 'einstein');
  assert.ok(links.length > 0);
  assert.ok(links.every((n) => n.cat === 'experiment' && !n.known && n.name === null));

  submit(s, 'Einsteins Fahrstuhl', 1);
  const fahrstuhl = personLinks(s, 'einstein').find((n) => n.id === 'fahrstuhl');
  assert.equal(fahrstuhl.known, true);
  assert.ok(fahrstuhl.name);

  const node = mindmap(s).areas.find((a) => a.id === 'relativ').bereiche
    .find((b) => b.id === 'person').nodes.find((n) => n.id === 'einstein');
  assert.deepEqual(node.links, personLinks(s, 'einstein'));
});

// Issue #31: Pfeile zwischen den Planeten kommen mit weiteren offenen Bereichen dazu
test('Pfeile zwischen Gebieten erscheinen erst mit weiteren offenen Bereichen', () => {
  const s = newState();
  submit(s, 'Newton', 0);
  assert.deepEqual(verbindungen(s), [], 'nur Personen offen: keine Pfeile');

  s.insight = 1e6;
  assert.ok(buyBereich(s, 'experiment'));
  const pfeil = verbindungen(s).find((v) => v.key === 'mechanik>optik');
  assert.ok(pfeil, 'Newton → Prismenversuch (Optik)');
  assert.deepEqual([pfeil.von, pfeil.nach, pfeil.anzahl, pfeil.gefunden], ['mechanik', 'optik', 1, 0]);
  assert.deepEqual(pfeil.personen, ['Isaac Newton']);

  submit(s, 'Prismenversuch', 1);
  assert.equal(verbindungen(s).find((v) => v.key === 'mechanik>optik').gefunden, 1);
  assert.ok(verbindungen(s).every((v) => v.von !== v.nach), 'nur Pfeile zu anderen Gebieten');
  assert.deepEqual(mindmap(s).links, verbindungen(s));
});

test('Mehr offene Bereiche bringen mehr Pfeile', () => {
  const s = newState();
  for (const p of ['Einstein', 'Planck', 'Dirac', 'Lorentz']) submit(s, p, 0);
  s.insight = 1e6;
  assert.ok(buyBereich(s, 'phaenomen'));
  const vorher = verbindungen(s).reduce((x, v) => x + v.anzahl, 0);
  assert.ok(vorher > 0);
  assert.ok(buyBereich(s, 'formel'));
  const nachher = verbindungen(s).reduce((x, v) => x + v.anzahl, 0);
  assert.ok(nachher > vorher, `${vorher} → ${nachher}`);
});
