import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTRIES } from '../data/index.js';
import { buildIndex, match } from '../src/matcher.js';
import { normFormula, parseQuantity } from '../src/normalize.js';

const index = buildIndex(ENTRIES);
const ids = (raw) => {
  const r = match(index, raw);
  return r.kind === 'treffer' ? r.ids.sort() : r.kind;
};

test('Formeln: Schreibweisen, vertauschte Seiten und Faktoren', () => {
  for (const raw of ['F=ma', 'F = m · a', 'F = m*a', 'ma = F', 'F=am', 'a = F/m']) {
    assert.deepEqual(ids(raw), ['newton2'], raw);
  }
  for (const raw of ['E=mc^2', 'E = m·c²', 'E=m*c**2', 'mc² = E', 'E = c^2 m']) {
    assert.deepEqual(ids(raw), ['emc2'], raw);
  }
  assert.deepEqual(ids('pV = nRT'), ['gasgleichung']);
  assert.deepEqual(ids('p V = R n T'), ['gasgleichung']);
  assert.deepEqual(ids('c = lambda * f'), ['lichtwelle']);
  assert.deepEqual(ids('E = hbar omega'), ['photon_energie']);
  assert.deepEqual(ids('Δx·Δp ≥ ħ/2'), ['unschaerfe_f']);
  assert.deepEqual(ids('E_kin = ½ m v²'), ['ekin']);
  assert.deepEqual(ids('T = 2*pi*sqrt(l/g)'), ['pendel_f']);
});

test('Einheiten als Definition', () => {
  assert.deepEqual(ids('1 N = 1 kg·m/s²'), ['u_newton']);
  assert.deepEqual(ids('N = kg m / s^2'), ['u_newton']);
});

test('Begriffe: Groß/klein, Umlaute, Artikel, Satzzeichen', () => {
  for (const raw of ['Ohmsches Gesetz', 'ohm\'sches gesetz', 'Das Ohmsche Gesetz', 'OHMSCHES GESETZ']) {
    assert.deepEqual(ids(raw), ['ohm'], raw);
  }
  assert.deepEqual(ids('Schroedinger-Gleichung'), ['schroedinger_gl']);
  assert.deepEqual(ids('schrödinger gleichung'), ['schroedinger_gl']);
  assert.deepEqual(ids('Weisser Zwerg'), ['weisser_zwerg']);
  assert.deepEqual(ids('1. Hauptsatz'), ['hs1']);
  assert.deepEqual(ids('Ørsted'), ['oersted']);
});

test('Mehrdeutige Namen zählen für Person und Einheit', () => {
  assert.deepEqual(ids('Newton'), ['newton', 'u_newton']);
  assert.deepEqual(ids('Tesla'), ['tesla_p', 'u_tesla']);
});

test('Kleine Tippfehler bei langen Wörtern werden verziehen', () => {
  const r = match(index, 'Heisenbergsche Unscharferelation');
  assert.equal(r.kind, 'treffer');
  assert.deepEqual(r.ids, ['unschaerfe']);
  assert.equal(r.fuzzy, true);
  assert.equal(ids('Supraleitnug'), 'unbekannt'); // Vertauschung = 2 Fehler bei 12 Zeichen
  assert.equal(ids('Myom'), 'unbekannt');         // zu kurz für Toleranz
});

test('Mehrdeutige Tippfehler werden nicht geraten', () => {
  assert.equal(ids('4. Hauptsatz'), 'unbekannt');
});

test('Konstanten mit Wert', () => {
  const cases = [
    ['c = 299792458 m/s', 'lichtgeschwindigkeit'],
    ['c = 299 792 458 m/s', 'lichtgeschwindigkeit'],
    ['c=3e8', 'lichtgeschwindigkeit'],
    ['c = 3·10^8 m/s', 'lichtgeschwindigkeit'],
    ['c = 300000 km/s', 'lichtgeschwindigkeit'],
    ['Lichtgeschwindigkeit = 3*10^8 m/s', 'lichtgeschwindigkeit'],
    ['h = 6,626·10⁻³⁴ Js', 'planck_h'],
    ['h=6.626e-34', 'planck_h'],
    ['g = 9,81 m/s²', 'erdbeschleunigung'],
    ['G = 6.674e-11', 'gravitationskonstante'],
    ['k_B = 1,38e-23 J/K', 'boltzmannkonstante'],
    ['N_A = 6,022·10^23 1/mol', 'avogadro'],
    ['alpha = 1/137', 'feinstruktur'],
    ['mu0 = 1.2566e-6', 'mu0'],
    ['R = 8,314 J/(mol·K)', 'gaskonstante'],
  ];
  for (const [raw, id] of cases) {
    const r = match(index, raw);
    assert.equal(r.kind, 'treffer', raw);
    assert.deepEqual(r.ids, [id], raw);
    assert.equal(r.wert, id, raw);
  }
});

test('Konstanten: falscher Wert, falsche Einheit', () => {
  assert.deepEqual(match(index, 'c = 2e8'), { kind: 'wertFalsch', id: 'lichtgeschwindigkeit' });
  assert.deepEqual(match(index, 'c = 3e8 kg'), { kind: 'einheitFalsch', id: 'lichtgeschwindigkeit' });
});

test('Formeln mit Zahlen werden nicht als falscher Konstantenwert gewertet', () => {
  assert.deepEqual(ids('E = 1/2 m v^2'), ['ekin']);
  assert.deepEqual(ids('E_n = -13,6 eV/n²'), ['bohr_f']);
});

test('Leere und unbekannte Eingaben', () => {
  assert.equal(ids('   '), 'leer');
  assert.equal(ids('Quatschwort'), 'unbekannt');
  assert.equal(ids('x = y'), 'unbekannt');
});

test('Zahlen lesen', () => {
  assert.deepEqual(parseQuantity('6,626·10⁻³⁴ Js'), { value: 6.626e-34, unit: 'js' });
  assert.equal(parseQuantity('299.792.458 m/s').value, 299792458);
  assert.equal(parseQuantity('1/137').value, 1 / 137);
  assert.equal(parseQuantity('abc'), null);
});

test('Normalisierung von Formeln ist stabil', () => {
  assert.equal(normFormula('F = m · a'), normFormula('a m = F'));
  assert.notEqual(normFormula('F = m·a'), normFormula('F = m·g'));
});
