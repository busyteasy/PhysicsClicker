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
