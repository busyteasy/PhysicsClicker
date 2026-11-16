// Gebiete, Einrichtungen und Upgrades – die Spielbalance an einem Ort.

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

// Grundwert einer Erstentdeckung je Stufe (Index = Stufe)
export const TIER_POINTS = [0, 10, 30, 80, 200, 500];
// Erkenntnis entsteht nur durch Eingaben. Einrichtungen erzeugen nichts von
// selbst, sondern geben einen festen Bonus auf jeden Treffer – im eigenen
// Gebiet um diesen Faktor mehr.
export const HOME_AREA_FACTOR = 2;
export const VALUE_FACTOR = 2;          // Konstante mit korrektem Wert
export const REPEAT_SHARE = 0.05;       // Trinkgeld für Wiederholungen
export const REPEAT_COOLDOWN_MS = 60_000;
export const COMBO_WINDOW_MS = 8_000;
export const COMBO_STEP = 0.1;
export const COMBO_MAX = 2;
export const COST_GROWTH = 1.15;

export const BUILDINGS = [
  { id: 'apfelbaum', name: 'Apfelbaum', area: 'mechanik', cost: 20, bonus: 2,
    desc: 'Ein Apfel fällt – und jemand denkt darüber nach.' },
  { id: 'linsenschleiferei', name: 'Linsenschleiferei', area: 'optik', cost: 60, bonus: 6,
    desc: 'Geschliffenes Glas bringt alles schärfer in den Blick.' },
  { id: 'dampfmaschine', name: 'Dampfmaschine', area: 'waerme', cost: 250, bonus: 15,
    desc: 'Zischt, stampft und liefert Thermodynamik zum Anfassen.' },
  { id: 'elektrolabor', name: 'Elektrolabor', area: 'elektro', cost: 1_500, bonus: 35,
    desc: 'Spulen, Magnete und gelegentlich ein Funkenschlag.' },
  { id: 'sternwarte', name: 'Sternwarte', area: 'astro', cost: 8_000, bonus: 80,
    desc: 'Jede klare Nacht ein Blick tiefer ins All.' },
  { id: 'spektrallabor', name: 'Spektrallabor', area: 'quanten', cost: 40_000, bonus: 180,
    desc: 'Scharfe Linien im Spektrum verraten den Bau der Atome.' },
  { id: 'atomuhr', name: 'Atomuhr', area: 'relativ', cost: 200_000, bonus: 400,
    desc: 'So genau, dass sie die Zeitdilatation im Treppenhaus misst.' },
  { id: 'beschleuniger', name: 'Teilchenbeschleuniger', area: 'kern', cost: 1_000_000, bonus: 900,
    desc: 'Lässt Teilchen fast mit Lichtgeschwindigkeit zusammenkrachen.' },
];

const AREA_UPGRADES = {
  mechanik: ['Principia', 'Lagrange-Formalismus'],
  optik: ['Linsenhandbuch', 'Wellenoptik'],
  waerme: ['Dampftafeln', 'Statistische Mechanik'],
  elektro: ['Faradays Notizbuch', 'Maxwells Abhandlung'],
  astro: ['Sternkatalog', 'Himmelsdurchmusterung'],
  quanten: ['Bohrsches Atommodell', 'Kopenhagener Deutung'],
  relativ: ['Wunderjahr 1905', 'Feldgleichungen'],
  kern: ['Nebelkammerfotos', 'Standardmodell-Poster'],
};

// Effekte:
//   { area, factor }   Grundwert der Eingaben des Gebiets und Bonus der zugehörigen Einrichtung
//   { typing: factor } alle Eingaben
//   { comboMs }        längeres Combo-Fenster
//   { network: 0.01 }  +1 % auf alle Eingaben je Entdeckung
//   { facilities: f }  Bonus aller Einrichtungen
export const UPGRADES = [
  ...BUILDINGS.flatMap((b) => {
    const [first, second] = AREA_UPGRADES[b.area];
    const area = AREA_NAMES[b.area];
    return [
      { id: `${b.area}_1`, name: first, cost: Math.max(100, b.cost * 4),
        req: { area: b.area, n: 5 }, effect: { area: b.area, factor: 2 },
        desc: `${area}: Eingaben und Bonus der ${b.name} ×2` },
      { id: `${b.area}_2`, name: second, cost: b.cost * 25,
        req: { area: b.area, n: 15 }, effect: { area: b.area, factor: 2 },
        desc: `${area}: Eingaben und Bonus der ${b.name} noch einmal ×2` },
    ];
  }),
  { id: 'notizbuch', name: 'Notizbuch', cost: 200, req: { total: 10 },
    effect: { typing: 1.5 }, desc: 'Alle Eingaben ×1,5' },
  { id: 'kreidetafel', name: 'Kreidetafel', cost: 2_000, req: { total: 20 },
    effect: { comboMs: 4_000 }, desc: 'Combo-Fenster +4 Sekunden' },
  { id: 'wissensnetz', name: 'Wissensnetz', cost: 15_000, req: { total: 40 },
    effect: { network: 0.01 }, desc: '+1 % auf alle Eingaben je Entdeckung' },
  { id: 'formelsammlung', name: 'Formelsammlung', cost: 6_000, req: { total: 30 },
    effect: { typing: 2 }, desc: 'Alle Eingaben ×2' },
  { id: 'bibliothek', name: 'Bibliothek', cost: 250_000, req: { total: 80 },
    effect: { typing: 3 }, desc: 'Alle Eingaben ×3' },
  { id: 'peer_review', name: 'Peer Review', cost: 2_000_000, req: { total: 120 },
    effect: { facilities: 2 }, desc: 'Bonus aller Einrichtungen ×2' },
];
