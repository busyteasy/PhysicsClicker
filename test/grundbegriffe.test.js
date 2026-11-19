// Issue #40: Typische Eingaben müssen erkannt werden.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { match } from '../src/matcher.js';
import { FREI, welt } from '../src/welt.js';

const FREI_EINGABEN = [
  'Magnet', 'Magnetismus', 'Strom', 'Licht', 'Gravitation', 'Schwerkraft', 'Linse', 'Spiegel',
  'Mond', 'Sonne', 'Erde', 'Pendel', 'Feder', 'Welle', 'Fallgesetz', 'Atomkraftwerk', 'Auge',
  'km/h', 'Meter pro Sekunde', 'Newton', 'Einstein', 'E = mc²', 'Ohmsches Gesetz', 'Kernkraftwerk',
];

const KLASSEN_EINGABEN = {
  k5: ['Magnet', 'Strom', 'Magnetismus'],
  k6: ['Licht', 'Spiegel', 'Auge', 'Linse'],
  k7: ['Linse', 'Zerstreuungslinse', 'Auge', 'Mond', 'Sonne', 'Erde', 'km/h', 'Meter pro Sekunde'],
  k8: ['Feder', 'Strom'],
  k10: ['Fallgesetz'],
  k11: ['Gravitation', 'Fallgesetz'],
  k12: ['Pendel', 'Welle'],
};

test('Grundbegriffe werden im freien Spiel erkannt', () => {
  for (const t of FREI_EINGABEN) assert.equal(match(FREI.index, t).kind, 'treffer', t);
});

test('Grundbegriffe werden in ihrer Klasse erkannt', () => {
  for (const [id, liste] of Object.entries(KLASSEN_EINGABEN)) {
    for (const t of liste) assert.equal(match(welt(id).index, t).kind, 'treffer', `${id}: ${t}`);
  }
});
