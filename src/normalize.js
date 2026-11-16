// Vereinheitlicht Eingaben, damit verschiedene Schreibweisen auf denselben
// Schlüssel fallen. Wird für die Datenbank-Aliasse und für die Spielereingabe
// gleichermaßen benutzt – so bleiben beide Seiten automatisch konsistent.

const SUP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+',
};
const SUB = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

// Ausgeschriebene griechische Buchstaben (nur in Formeln). Die Reihenfolge ist
// wichtig: "epsilon" enthält "psi", "beta"/"theta"/"zeta" enthalten "eta".
const GREEK = [
  ['hbar', 'ħ'], ['sqrt', '√'], ['epsilon', 'ε'], ['lambda', 'λ'],
  ['omega', 'ω'], ['sigma', 'σ'], ['kappa', 'κ'], ['alpha', 'α'],
  ['gamma', 'γ'], ['delta', 'δ'], ['theta', 'θ'], ['beta', 'β'],
  ['zeta', 'ζ'], ['eta', 'η'], ['phi', 'φ'], ['psi', 'ψ'], ['rho', 'ρ'],
  ['tau', 'τ'], ['chi', 'χ'], ['mu', 'μ'], ['nu', 'ν'], ['pi', 'π'],
];

const RELATION = /[=<>~∝]/;
const LETTER = 'a-zα-ωħ';

/** Grundreinigung, die für alle Eingabearten gilt. */
export function base(raw) {
  let s = String(raw ?? '').normalize('NFC').replace(/µ/g, 'μ').toLowerCase();
  s = s
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss').replace(/ø/g, 'oe').replace(/æ/g, 'ae')
    .replace(/ł/g, 'l').replace(/ς/g, 'σ').replace(/½/g, '1/2');
  s = s.replace(/[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUP[c]).join(''));
  s = s.replace(/[₀-₉]/g, (c) => SUB[c]);
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
  s = s.replace(/[−–—]/g, '-').replace(/≥/g, '>=').replace(/≤/g, '<=');
  return s.trim();
}

/** Ist die Eingabe eine Gleichung/Relation (Formel, Konstante mit Wert)? */
export function isRelation(raw) {
  return RELATION.test(base(raw));
}

/** Begriffe: nur Buchstaben und Ziffern, Artikel am Anfang fallen weg. */
export function normWord(raw) {
  const s = base(raw).replace(/^(der|die|das|ein|eine)\s+/, '');
  return s.replace(new RegExp(`[^${LETTER}0-9]`, 'g'), '');
}

/** Formeln: Schreibweisen vereinheitlichen, Seiten und Faktoren sortieren. */
export function normFormula(raw) {
  let s = base(raw);
  for (const [word, letter] of GREEK) s = s.split(word).join(letter);
  s = s.replace(/\*\*/g, '^');
  s = s.replace(/[\s*·⋅×∙_{}]/g, '').replace(/,/g, '.');
  // Einser-Koeffizienten weglassen: "1N=1kgm/s^2" -> "N=kgm/s^2"
  s = s.replace(new RegExp(`(^|=)1(?=[${LETTER}])`, 'g'), '$1');
  return canonEquation(s);
}

function canonEquation(s) {
  // Nur bei einer einfachen Gleichung mit genau einem "=" dürfen die Seiten
  // getauscht werden (bei ">=" oder "~" nicht).
  if (!/^[^=<>~∝]+=[^=<>~∝]+$/.test(s)) return s;
  return s.split('=').map(canonSide).sort().join('=');
}

const PURE_PRODUCT = new RegExp(`^([${LETTER}](\\^-?\\d+)?)+$`);
const FACTOR = new RegExp(`[${LETTER}](\\^-?\\d+)?`, 'g');

function canonSide(side) {
  // Reine Produkte aus Einzelbuchstaben ("mc^2", "nrt") dürfen umsortiert werden.
  if (!PURE_PRODUCT.test(side)) return side;
  return side.match(FACTOR).sort().join('');
}

/** Einheiten: Leerzeichen und Malzeichen weg, Hochzahlen vereinheitlicht. */
export function normUnit(raw) {
  return base(raw).replace(/\*\*/g, '^').replace(/[\s*·⋅×∙]/g, '');
}

/** Schlüssel für die Nachschlagetabelle; Präfix trennt Begriffe von Formeln. */
export function keyOf(raw) {
  return isRelation(raw) ? 'f:' + normFormula(raw) : 'w:' + normWord(raw);
}

/**
 * Liest eine Zahl mit optionaler Zehnerpotenz und Einheit.
 * "6,626·10⁻³⁴ Js" -> { value: 6.626e-34, unit: "js" }
 */
export function parseQuantity(raw) {
  let s = base(raw);
  s = s.replace(/(\d)[\s '](?=\d{3}(\D|$))/g, '$1'); // 299 792 458
  const m = s.match(/^[+-]?\d[\d.,]*/);
  if (!m) return null;
  let value = parseLocaleNumber(m[0]);
  if (!Number.isFinite(value)) return null;
  let rest = s.slice(m[0].length).trim();

  const frac = rest.match(/^\/\s*(\d[\d.,]*)/);
  if (frac) {
    value /= parseLocaleNumber(frac[1]);
    rest = rest.slice(frac[0].length).trim();
  }
  const exp = rest.match(/^(?:e([+-]?\d+)|(?:[*·⋅×x]\s*)?10\s*\^\s*\(?\s*([+-]?\d+)\s*\)?)/);
  if (exp) {
    value *= 10 ** Number(exp[1] ?? exp[2]);
    rest = rest.slice(exp[0].length).trim();
  }
  if (!Number.isFinite(value)) return null;
  return { value, unit: normUnit(rest) };
}

function parseLocaleNumber(text) {
  let t = text.replace(/[.,]$/, '');
  const dots = (t.match(/\./g) || []).length;
  const commas = (t.match(/,/g) || []).length;
  if (commas && dots) t = t.replace(/\./g, '').replace(',', '.'); // 1.234,5
  else if (commas === 1) t = t.replace(',', '.');                   // 6,626
  else if (commas > 1) t = t.replace(/,/g, '');
  else if (dots > 1) t = t.replace(/\./g, '');                      // 299.792.458
  return Number(t);
}
