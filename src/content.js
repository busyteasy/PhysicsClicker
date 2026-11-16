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
// Zusätzlich: Stufe × so viele Sekunden der aktuellen Produktion
export const PRODUCTION_SECONDS_PER_TIER = 5;
export const VALUE_FACTOR = 2;          // Konstante mit korrektem Wert
export const REPEAT_SHARE = 0.05;       // Trinkgeld für Wiederholungen
export const REPEAT_COOLDOWN_MS = 60_000;
export const COMBO_WINDOW_MS = 8_000;
export const COMBO_STEP = 0.1;
export const COMBO_MAX = 2;
export const COST_GROWTH = 1.15;

export const BUILDINGS = [
  { id: 'apfelbaum', name: 'Apfelbaum', area: 'mechanik', cost: 20, rate: 0.2,
    desc: 'Ein Apfel fällt – und jemand denkt darüber nach.' },
  { id: 'linsenschleiferei', name: 'Linsenschleiferei', area: 'optik', cost: 150, rate: 1.5,
    desc: 'Geschliffenes Glas bringt alles schärfer in den Blick.' },
  { id: 'dampfmaschine', name: 'Dampfmaschine', area: 'waerme', cost: 1_600, rate: 10,
    desc: 'Zischt, stampft und liefert Thermodynamik zum Anfassen.' },
  { id: 'elektrolabor', name: 'Elektrolabor', area: 'elektro', cost: 18_000, rate: 70,
    desc: 'Spulen, Magnete und gelegentlich ein Funkenschlag.' },
  { id: 'sternwarte', name: 'Sternwarte', area: 'astro', cost: 200_000, rate: 400,
    desc: 'Jede klare Nacht ein Blick tiefer ins All.' },
  { id: 'spektrallabor', name: 'Spektrallabor', area: 'quanten', cost: 2_400_000, rate: 2_500,
    desc: 'Scharfe Linien im Spektrum verraten den Bau der Atome.' },
  { id: 'atomuhr', name: 'Atomuhr', area: 'relativ', cost: 30_000_000, rate: 15_000,
    desc: 'So genau, dass sie die Zeitdilatation im Treppenhaus misst.' },
  { id: 'beschleuniger', name: 'Teilchenbeschleuniger', area: 'kern', cost: 450_000_000, rate: 90_000,
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
//   { area, factor }   Eingaben des Gebiets und die zugehörige Einrichtung
//   { typing: factor } alle Eingaben
//   { comboMs }        längeres Combo-Fenster
//   { network: 0.01 }  +1 % Produktion je Entdeckung
//   { production: f }  gesamte Produktion
export const UPGRADES = [
  ...BUILDINGS.flatMap((b) => {
    const [first, second] = AREA_UPGRADES[b.area];
    const area = AREA_NAMES[b.area];
    return [
      { id: `${b.area}_1`, name: first, cost: Math.max(100, b.cost * 5),
        req: { area: b.area, n: 5 }, effect: { area: b.area, factor: 2 },
        desc: `${area}: Eingaben und ${b.name} ×2` },
      { id: `${b.area}_2`, name: second, cost: b.cost * 60,
        req: { area: b.area, n: 15 }, effect: { area: b.area, factor: 2 },
        desc: `${area}: Eingaben und ${b.name} noch einmal ×2` },
    ];
  }),
  { id: 'notizbuch', name: 'Notizbuch', cost: 200, req: { total: 10 },
    effect: { typing: 1.5 }, desc: 'Alle Eingaben ×1,5' },
  { id: 'kreidetafel', name: 'Kreidetafel', cost: 2_000, req: { total: 20 },
    effect: { comboMs: 4_000 }, desc: 'Combo-Fenster +4 Sekunden' },
  { id: 'wissensnetz', name: 'Wissensnetz', cost: 50_000, req: { total: 25 },
    effect: { network: 0.01 }, desc: '+1 % Produktion je Entdeckung' },
  { id: 'formelsammlung', name: 'Formelsammlung', cost: 25_000, req: { total: 40 },
    effect: { typing: 2 }, desc: 'Alle Eingaben ×2' },
  { id: 'bibliothek', name: 'Bibliothek', cost: 5_000_000, req: { total: 80 },
    effect: { typing: 3 }, desc: 'Alle Eingaben ×3' },
  { id: 'peer_review', name: 'Peer Review', cost: 100_000_000, req: { total: 120 },
    effect: { production: 2 }, desc: 'Gesamte Produktion ×2' },
];
