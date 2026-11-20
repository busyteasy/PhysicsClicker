// Zahlen auf Deutsch: 1.234 · 12,5 Mio. · 3,2 Mrd.

const UNITS = [
  [1e18, 'Trio.'],
  [1e15, 'Brd.'],
  [1e12, 'Bio.'],
  [1e9, 'Mrd.'],
  [1e6, 'Mio.'],
];

const de = (n, digits) => n.toLocaleString('de-DE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: digits,
});

export function formatNumber(n) {
  if (!Number.isFinite(n)) return '∞';
  if (Math.abs(n) >= 1e21) return n.toExponential(2).replace('.', ',');
  for (const [size, label] of UNITS) {
    if (Math.abs(n) >= size) return `${de(n / size, 2)} ${label}`;
  }
  if (Math.abs(n) < 10 && n % 1 !== 0) return de(n, 1);
  return de(Math.floor(n), 0);
}

const HOCH = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/**
 * Messwert für das Schätzen (Issue #46): drei gültige Ziffern, schmale Leerzeichen
 * als Tausendertrenner, sehr große und kleine Zahlen als „6,7 · 10²³“.
 */
export function formatMesswert(n, ziffern = 3) {
  if (!Number.isFinite(n)) return '–';
  if (n === 0) return '0';
  const r = Number(n.toPrecision(ziffern));
  let e = Math.floor(Math.log10(Math.abs(r)));
  if (Math.abs(r) / 10 ** e >= 10) e += 1;
  if (e >= 6 || e < -3) {
    const m = Number((r / 10 ** e).toPrecision(ziffern));
    return `${de(m, ziffern - 1)} · 10${String(e).split('').map((c) => HOCH[c]).join('')}`.replace(/^-/, '−');
  }
  return r.toLocaleString('de-DE', { maximumFractionDigits: 10 }).replace(/\./g, '\u202f').replace(/^-/, '−');
}
