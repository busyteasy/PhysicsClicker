// Gedankenkette und Lückenwort (Issue #33)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LUECKENWORT, TIER_POINTS } from '../src/content.js';
import { anstoesse, zaehlListe } from '../src/anstoss.js';
import {
  INDEX, aufdeckReihenfolge, buyBereich, kaufeBuchstabe, lueckenwort, newState, restore, submit,
} from '../src/game.js';

const text = (w) => w.muster.map((c) => c ?? '_').join('');

test('Lückenwort zeigt Struktur, aber keine verdeckten Buchstaben', () => {
  const s = newState();
  const w = lueckenwort(s, 'newton');
  assert.equal(text(w), '_____ ______', 'Leerzeichen sind sichtbar');
  assert.equal(w.gekauft, 0);
  assert.equal(w.gesamt, 11);
  assert.ok(!JSON.stringify(w.muster).includes('N'));

  s.insight = 1e6;
  assert.ok(buyBereich(s, 'formel'));
  assert.equal(text(lueckenwort(s, 'newton2')), '_ = _·_', 'Zeichen wie = und · sind sichtbar');
});

test('Buchstaben kaufen: erster zuerst, kostet Erkenntnis, letzter bleibt verdeckt', () => {
  const s = newState();
  const preis = Math.max(LUECKENWORT.min, Math.round(TIER_POINTS[1] * LUECKENWORT.faktor));
  assert.equal(lueckenwort(s, 'newton').preis, preis);
  assert.equal(kaufeBuchstabe(s, 'newton'), false, 'ohne Erkenntnis geht nichts');

  s.insight = 1000;
  assert.ok(kaufeBuchstabe(s, 'newton'));
  assert.equal(text(lueckenwort(s, 'newton')), 'I____ ______');
  assert.equal(s.insight, 1000 - preis);

  while (kaufeBuchstabe(s, 'newton'));
  const w = lueckenwort(s, 'newton');
  assert.equal(w.gekauft, w.gesamt - 1);
  assert.ok(w.fertig);
  assert.equal(w.muster.filter((c) => c === null).length, 1, 'genau ein Buchstabe bleibt offen');
});

test('Reihenfolge ist stabil und beginnt mit dem ersten Buchstaben', () => {
  const e = INDEX.byId.get('einstein');
  assert.deepEqual(aufdeckReihenfolge(e), aufdeckReihenfolge(e));
  assert.equal(aufdeckReihenfolge(e)[0], 0);
});

test('Lückenwort: gesperrt oder entdeckt kann man nichts kaufen; Entdecken räumt auf', () => {
  const s = newState();
  s.insight = 1000;
  assert.equal(kaufeBuchstabe(s, 'traegheit'), false, 'Bereich Gesetze noch gesperrt');
  assert.ok(kaufeBuchstabe(s, 'newton'));
  submit(s, 'Isaac Newton', 0);
  assert.equal(s.luecken.newton, undefined);
  const w = lueckenwort(s, 'newton');
  assert.ok(w.bekannt && w.fertig);
  assert.equal(text(w), 'Isaac Newton');
  assert.equal(kaufeBuchstabe(s, 'newton'), false);
});

test('Spielstände: alte ohne Lückenwort laden, kaputte Werte werden bereinigt', () => {
  const alt = restore({ insight: 5, unlocked: ['person'], discovered: { einstein: 1 } });
  assert.deepEqual(alt.luecken, {});
  const kaputt = restore({
    discovered: { einstein: 1 },
    luecken: { newton: 3, einstein: 2, quatsch: 4, galilei: 999, curie: -2 },
  });
  assert.equal(kaputt.luecken.newton, 3);
  assert.equal(kaputt.luecken.einstein, undefined, 'schon entdeckt');
  assert.equal(kaputt.luecken.quatsch, undefined, 'unbekannte ID');
  assert.equal(kaputt.luecken.galilei, lueckenwort(kaputt, 'galilei').gesamt - 1, 'höchstens alle bis auf einen');
  assert.equal(kaputt.luecken.curie, undefined);
});

test('Zählliste: Einzahl, Mehrzahl und fremde Gebiete', () => {
  const e = (cat, area) => ({ cat, area });
  assert.equal(zaehlListe([e('gesetz', 'mechanik'), e('gesetz', 'mechanik'), e('experiment', 'optik')], 'mechanik'),
    '2 Gesetze und 1 Experiment (Optik)');
  assert.equal(zaehlListe([e('person', 'mechanik')], 'mechanik'), '1 Person');
});

test('Gedankenkette: Person entdeckt → was zu ihr fehlt', () => {
  const s = newState();
  submit(s, 'Newton', 0);
  const [gesperrt] = anstoesse(s, ['newton']);
  assert.match(gesperrt.text, /gesperrten Bereichen/);
  assert.equal(gesperrt.ziel, null);

  s.insight = 1e6;
  assert.ok(buyBereich(s, 'gesetz'));
  const [a] = anstoesse(s, ['newton']);
  assert.match(a.text, /^Zu Isaac Newton fehlen dir noch \d+ Gesetze\.$/);
  assert.equal(INDEX.byId.get(a.ziel).cat, 'gesetz');
});

test('Gedankenkette: Begriff entdeckt → Person dahinter, ohne ihren Namen zu verraten', () => {
  const s = newState();
  s.insight = 1e6;
  assert.ok(buyBereich(s, 'gesetz'));
  submit(s, 'Trägheitsprinzip', 0);
  const liste = anstoesse(s, ['traegheit']);
  const person = liste.find((a) => /steckt eine Person/.test(a.text));
  assert.ok(person);
  assert.ok(['newton', 'galilei'].includes(person.ziel));
  assert.ok(liste.every((a) => !/Newton|Galilei/.test(a.text)), 'keine unentdeckten Namen');

  submit(s, 'Newton', 1);
  assert.ok(anstoesse(s, ['traegheit']).some((a) => /gehört zu Isaac Newton – von Newton fehlen dir noch/.test(a.text)));
});

test('Gedankenkette: höchstens drei Anstöße, keine doppelten Ziele, auch in Klassen', () => {
  const s = newState();
  for (const p of ['Newton', 'Einstein', 'Planck', 'Bohr']) submit(s, p, 0);
  const liste = anstoesse(s, ['newton', 'einstein', 'planck', 'bohr']);
  assert.ok(liste.length <= 3);
  const ziele = liste.map((a) => a.ziel).filter(Boolean);
  assert.equal(new Set(ziele).size, ziele.length);

  const k = newState('k5');
  submit(k, 'Stromkreis', 0);
  const [a] = anstoesse(k, ['b_stromkreis']);
  assert.match(a.text, /^In Elektrizität & Magnetismus fehlen dir noch/);
  assert.ok(a.ziel);
});
