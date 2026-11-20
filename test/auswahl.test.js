// Auswahl transparent machen (Issue #43)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AUSWAHL, BEREICHE } from '../src/content.js';
import { match } from '../src/matcher.js';
import { FREI } from '../src/welt.js';

// Nachnamen, die bewusst nicht allein reichen: zu kurz (Wu), von mehreren
// Personen getragen (Hertz) oder schon der Name eines Gesetzes (Gay-Lussac)
const AUSNAHMEN = new Set(['Wu', 'Hertz', 'Gay-Lussac']);

test('Jede Person ist über ihren Nachnamen erreichbar (außer begründeten Ausnahmen)', () => {
  for (const p of FREI.entries.filter((e) => e.cat === 'person')) {
    const nachname = p.name.split(/\s+/).at(-1);
    if (AUSNAHMEN.has(nachname)) continue;
    const r = match(FREI.index, nachname);
    assert.ok(r.kind === 'treffer' && r.ids.includes(p.id), `${p.name}: „${nachname}“ → ${r.kind}`);
  }
});

test('„Thomson“ und der Tippfehler „Thompson“ finden J. J. Thomson', () => {
  assert.deepEqual(match(FREI.index, 'Thomson').ids, ['thomson']);
  const r = match(FREI.index, 'Thompson');
  assert.equal(r.kind, 'treffer');
  assert.deepEqual(r.ids, ['thomson']);
});

test('Jeder Bereich erklärt, wonach ausgewählt wurde', () => {
  for (const b of BEREICHE) assert.ok(b.auswahl?.length > 40, `${b.id}: keine Auswahlbeschreibung`);
  for (const k of ['allgemein', 'nichtGezaehlt']) assert.ok(AUSWAHL[k]?.length > 40, k);
  assert.ok(FREI.bereiche.every((b) => b.auswahl), 'Bereiche der Welt tragen die Beschreibung mit');
});

test('Easter Egg (Issue #48): „Wulze“ zählt als Person, ohne Wikipedia-Link', async () => {
  const { wikiUrl } = await import('../src/wiki.js');
  const r = match(FREI.index, 'Wulze');
  assert.equal(r.kind, 'treffer');
  assert.deepEqual(r.ids, ['wulze']);
  const e = FREI.index.byId.get('wulze');
  assert.equal(e.cat, 'person');
  assert.equal(wikiUrl(e), null);
});
