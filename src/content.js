// Gebiete, Bereiche und Punktwerte – die Spielbalance an einem Ort.

export const AREAS = [
  { id: 'mechanik', name: 'Mechanik', kurz: 'Mechanik' },
  { id: 'optik', name: 'Optik', kurz: 'Optik' },
  { id: 'waerme', name: 'Wärmelehre', kurz: 'Wärme' },
  { id: 'elektro', name: 'Elektrizität & Magnetismus', kurz: 'Elektro' },
  { id: 'astro', name: 'Astrophysik', kurz: 'Astro' },
  { id: 'quanten', name: 'Quantenphysik', kurz: 'Quanten' },
  { id: 'relativ', name: 'Relativität', kurz: 'Relativität' },
  { id: 'kern', name: 'Kern- & Teilchenphysik', kurz: 'Kern' },
];

export const AREA_NAMES = Object.fromEntries(AREAS.map((a) => [a.id, a.name]));

// Bereiche = Kategorien der Wissensdatenbank. Zu Beginn ist nur der erste
// offen; die übrigen kauft man mit Erkenntnis frei, in beliebiger Reihenfolge.
export const BEREICHE = [
  { id: 'person', name: 'Personen', beispiel: 'Marie Curie',
    desc: 'Physikerinnen und Physiker – mit Vor- und Nachnamen oder nur dem Nachnamen.' },
  { id: 'einheit', name: 'Einheiten', beispiel: '1 N = 1 kg·m/s²',
    desc: 'Maßeinheiten, als Name oder als Definition.' },
  { id: 'teilchen', name: 'Teilchen', beispiel: 'Myon',
    desc: 'Elementarteilchen und andere Bausteine der Materie.' },
  { id: 'phaenomen', name: 'Phänomene', beispiel: 'Regenbogen',
    desc: 'Effekte, Vorgänge und Erscheinungen der Natur.' },
  { id: 'gesetz', name: 'Gesetze', beispiel: 'Pauli-Prinzip',
    desc: 'Gesetze, Prinzipien und Hauptsätze.' },
  { id: 'formel', name: 'Formeln', beispiel: 'F = m·a',
    desc: 'Gleichungen mit „=“. Leerzeichen, Malpunkte und Reihenfolge sind egal.' },
  { id: 'konstante', name: 'Konstanten', beispiel: 'h = 6,626·10⁻³⁴ Js',
    desc: 'Naturkonstanten – mit korrektem Wert gibt es doppelt.' },
  { id: 'experiment', name: 'Experimente', beispiel: 'Schrödingers Katze',
    desc: 'Berühmte Versuche und Gedankenexperimente.' },
  // Neu für die Klassenstufen (Issue #16), auch im freien Spiel
  { id: 'begriff', name: 'Größen & Begriffe', beispiel: 'Dichte',
    desc: 'Physikalische Größen, Fachbegriffe und Modelle.' },
  { id: 'geraet', name: 'Geräte & Bauteile', beispiel: 'Kompass',
    desc: 'Messgeräte, Bauteile und technische Geräte.' },
];

// Zusammengefasste Bereiche (Issue #26): Klassen mit wenig Stoff legen kleine
// Kategorien zusammen, z. B. Personen und Experimente zu „Forscher & Versuche“.
// Welche Gruppen eine Klasse nutzt, steht in ihrer Datei unter `gruppen`.
export const BEREICH_GRUPPEN = [
  { id: 'begriff_einheit', name: 'Größen & Einheiten', teile: ['begriff', 'einheit'],
    desc: 'Physikalische Größen, Fachbegriffe, Modelle – und die Einheiten, in denen man misst.' },
  { id: 'einheit_konstante', name: 'Einheiten & Konstanten', teile: ['einheit', 'konstante'],
    desc: 'Maßeinheiten und feste Werte der Physik – Konstanten mit korrektem Wert zählen doppelt.' },
  { id: 'phaenomen_gesetz', name: 'Phänomene & Gesetze', teile: ['phaenomen', 'gesetz'],
    desc: 'Was man in der Natur beobachtet, und die Regeln, nach denen es abläuft.' },
  { id: 'phaenomen_teilchen', name: 'Phänomene & Teilchen', teile: ['phaenomen', 'teilchen'],
    desc: 'Erscheinungen der Natur und die kleinen Bausteine der Materie.' },
  { id: 'gesetz_formel', name: 'Gesetze & Formeln', teile: ['gesetz', 'formel'],
    desc: 'Gesetze in Worten und als Gleichung mit „=“ – Malpunkte und Reihenfolge sind egal.' },
  { id: 'forschung', name: 'Forscher & Versuche', teile: ['person', 'experiment'],
    desc: 'Physikerinnen und Physiker und die Versuche, mit denen sie etwas herausgefunden haben.' },
];

export const BEREICH_NAMES = Object.fromEntries([...BEREICHE, ...BEREICH_GRUPPEN].map((b) => [b.id, b.name]));
export const START_BEREICHE = ['person'];

// Preis des n-ten freigekauften Bereichs (unabhängig davon, welcher es ist)
export const UNLOCK_PRICES = [100, 500, 1_200, 2_500, 4_500, 7_000, 10_000, 14_000, 19_000];

// Klassenstufen (Issue #16): Jede Klasse ist eine eigene, kleinere Spielwelt.
// Man startet mit „Größen & Begriffe“. Die Preise richten sich nach der
// Datenmenge der Klasse: Alle Bereiche zusammen kosten diesen Anteil der
// Erkenntnis, die man in der Klasse insgesamt verdienen kann (ohne Combo).
// Der n-te Kauf kostet n-mal so viel wie der erste.
export const KLASSEN_START = ['begriff'];
export const KLASSEN_PREIS_ANTEIL = 0.4;

// Grundwert einer Erstentdeckung je Stufe (Index = Stufe)
export const TIER_POINTS = [0, 10, 30, 80, 200, 500];
export const VALUE_FACTOR = 2;          // Konstante mit korrektem Wert
export const QUESTION_FACTOR = 2;       // Fragen bringen das Doppelte ihrer Stufe
export const QUESTION_TRIES = 3;        // nach so vielen Fehlversuchen darf man auflösen

// Lückenwort (Issue #33): Buchstaben eines unentdeckten Eintrags kaufen.
// Ein Buchstabe kostet diesen Anteil vom Grundwert der Stufe (mindestens `min`).
// Der letzte Buchstabe wird nie verraten – den Rest muss man selbst wissen.
export const LUECKENWORT = { faktor: 0.2, min: 2 };
// Gedankenkette (Issue #33): so viele Anstöße höchstens nach einem Treffer
export const ANSTOESSE_MAX = 3;
export const REPEAT_SHARE = 0.05;       // Trinkgeld für Wiederholungen
export const REPEAT_COOLDOWN_MS = 60_000;
export const COMBO_WINDOW_MS = 8_000;
export const COMBO_STEP = 0.1;
export const COMBO_MAX = 2;

// Countdown-Modus (Testversion, Issue #12): Eine eigene Runde mit frischem
// Spielstand und einer Uhr, die herunterläuft. Jeder gewertete Treffer bringt
// Zeit zurück – schwierigeres Wissen mehr. Bei 0 ist die Runde vorbei.
// Bewusst großzügig: 3 Minuten Start, und schon ein Stufe-1-Begriff bringt
// 10 Sekunden.
export const COUNTDOWN = {
  startMs: 180_000,
  bonusMs: [0, 10_000, 15_000, 25_000, 40_000, 60_000], // Erstentdeckung je Stufe
  valueFactor: 1.5,      // Konstante mit Wert: so viel mehr Zeit wie die Stufe
  repeatMs: 2_000,       // Trinkgeld-Treffer (Wiederholung nach der Abklingzeit)
  questionFactor: 2,     // richtige Antwort im Fragekatalog
  maxMs: 600_000,        // höchstens 10 Minuten auf der Uhr
};

// Einmal-Upgrades: werden gekauft, wirken kurz und sind dann verbraucht.
// Es kann immer nur ein Multiplikator (mult) gleichzeitig aktiv sein; jeder
// Kauf macht dasselbe Upgrade um BOOST_PRICE_GROWTH teurer.
export const BOOST_PRICE_GROWTH = 1.15;
export const BOOSTS = [
  { id: 'geistesblitz', name: 'Geistesblitz', price: 40, effect: { mult: 2, uses: 1 },
    desc: 'Die nächste gewertete Eingabe oder Antwort zählt doppelt.' },
  { id: 'heureka', name: 'Heureka!', price: 150, effect: { mult: 3, uses: 1 },
    desc: 'Die nächste gewertete Eingabe oder Antwort zählt dreifach.' },
  { id: 'konzentration', name: 'Konzentration', price: 120, effect: { mult: 1.5, uses: 5 },
    desc: 'Die nächsten 5 gewerteten Eingaben oder Antworten zählen 1,5-fach.' },
  { id: 'kaffeepause', name: 'Kaffeepause', price: 80, effect: { comboMs: 8_000, durationMs: 60_000 },
    desc: 'Eine Minute lang ist das Combo-Fenster doppelt so lang.' },
  { id: 'eselsbruecke', name: 'Eselsbrücke', price: 100, effect: { noCooldown: true, durationMs: 120_000 },
    desc: 'Zwei Minuten lang keine Abklingzeit bei Wiederholungen.' },
  { id: 'spickzettel', name: 'Spickzettel', price: 60, effect: { hint: true },
    desc: 'Ein Hinweis auf einen Eintrag, den du noch nicht entdeckt hast.' },
];
