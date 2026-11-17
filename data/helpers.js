// Kurzschreibweisen für die Datendateien. Jeder Eintrag:
//   id      eindeutig, nur a-z, 0-9 und _
//   cat     formel | konstante | gesetz | phaenomen | teilchen | person | einheit | experiment
//           | begriff (B) | geraet (D)
//   tier    1 (Schulwissen) bis 5 (Spezialwissen)
//   name    Anzeigename; wird automatisch auch als Eingabe akzeptiert
//   aliases weitere akzeptierte Schreibweisen
//   fact    kurzer Fun Fact, wird nach der Entdeckung angezeigt
// Konstanten haben zusätzlich:
//   symbols Formelzeichen, die nur zusammen mit einem Wert zählen ("c = …")
//   values  [{ v, units, tol? }] – akzeptierte Zahlenwerte mit Einheiten

const make = (cat) => (id, tier, name, aliases, fact) => ({ id, cat, tier, name, aliases, fact });

export const F = make('formel');
export const G = make('gesetz');
export const P = make('phaenomen');
export const T = make('teilchen');
export const W = make('person');
export const U = make('einheit');
export const E = make('experiment');
export const B = make('begriff');   // Größen, Fachbegriffe, Modelle
export const D = make('geraet');    // Geräte und Bauteile

export const K = (id, tier, name, aliases, symbols, values, fact) => ({
  id, cat: 'konstante', tier, name, aliases, symbols,
  values: values.map(([v, units, tol]) => ({ v, units, tol })),
  fact,
});

export const inArea = (area, entries) => entries.map((e) => ({ ...e, area }));
