// Gebiete, Bereiche und Punktwerte – die Spielbalance an einem Ort.

export const AREAS = [
  { id: 'mechanik', name: 'Mechanik' },
  { id: 'optik', name: 'Optik' },
  { id: 'waerme', name: 'Wärmelehre' },
  { id: 'elektro', name: 'Elektrizität & Magnetismus' },
  { id: 'astro', name: 'Astrophysik' },
  { id: 'quanten', name: 'Quantenphysik' },
  { id: 'relativ', name: 'Relativität' },
  { id: 'kern', name: 'Kern- & Teilchenphysik' },
];

export const AREA_NAMES = Object.fromEntries(AREAS.map((a) => [a.id, a.name]));

// Bereiche = Kategorien der Wissensdatenbank. Zu Beginn ist nur der erste
// offen; die übrigen kauft man mit Erkenntnis frei, in beliebiger Reihenfolge.
export const BEREICHE = [
  { id: 'person', name: 'Personen', beispiel: 'Marie Curie, Newton, Emmy Noether',
    desc: 'Physikerinnen und Physiker – mit Vor- und Nachnamen oder nur dem Nachnamen.' },
  { id: 'einheit', name: 'Einheiten', beispiel: 'Tesla, Joule, 1 N = 1 kg·m/s²',
    desc: 'Maßeinheiten, als Name oder als Definition.' },
  { id: 'teilchen', name: 'Teilchen', beispiel: 'Myon, Gluon, Higgs-Boson',
    desc: 'Elementarteilchen und andere Bausteine der Materie.' },
  { id: 'phaenomen', name: 'Phänomene', beispiel: 'Doppler-Effekt, Supraleitung, Regenbogen',
    desc: 'Effekte, Vorgänge und Erscheinungen der Natur.' },
  { id: 'gesetz', name: 'Gesetze', beispiel: 'Ohmsches Gesetz, Pauli-Prinzip',
    desc: 'Gesetze, Prinzipien und Hauptsätze.' },
  { id: 'formel', name: 'Formeln', beispiel: 'F = m·a, E = mc², pV = nRT',
    desc: 'Gleichungen mit „=“. Leerzeichen, Malpunkte und Reihenfolge sind egal.' },
  { id: 'konstante', name: 'Konstanten', beispiel: 'Lichtgeschwindigkeit, h = 6,626·10⁻³⁴ Js',
    desc: 'Naturkonstanten – mit korrektem Wert gibt es doppelt.' },
];

export const BEREICH_NAMES = Object.fromEntries(BEREICHE.map((b) => [b.id, b.name]));
export const START_BEREICHE = ['person'];

// Preis des n-ten freigekauften Bereichs (unabhängig davon, welcher es ist)
export const UNLOCK_PRICES = [100, 500, 1_200, 2_500, 4_500, 7_000];

// Grundwert einer Erstentdeckung je Stufe (Index = Stufe)
export const TIER_POINTS = [0, 10, 30, 80, 200, 500];
export const VALUE_FACTOR = 2;          // Konstante mit korrektem Wert
export const REPEAT_SHARE = 0.05;       // Trinkgeld für Wiederholungen
export const REPEAT_COOLDOWN_MS = 60_000;
export const COMBO_WINDOW_MS = 8_000;
export const COMBO_STEP = 0.1;
export const COMBO_MAX = 2;
