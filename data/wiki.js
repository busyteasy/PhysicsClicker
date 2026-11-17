// Wikipedia-Artikel zum Nachlesen (Issue #15). Schlüssel ist die ID eines
// Eintrags, Wert der Titel des deutschen Wikipedia-Artikels.
//
// Nötig ist ein Titel nur, wenn der Anzeigename kein guter Artikeltitel ist –
// vor allem bei Formeln („F = m·a“) und bei Begriffen, deren Artikel anders
// heißt. Alle anderen Einträge verlinken über ihren Namen. Der Link geht über
// die Wikipedia-Suche mit „go“: Gibt es den Artikel, landet man direkt dort,
// sonst bei den Suchergebnissen – ein falscher Titel führt also nie ins Leere.
//
// Für jede Antwort im Fragekatalog steht hier ein Titel (das prüft ein Test).

export default {
  // Personen
  einstein: 'Albert Einstein',
  curie: 'Marie Curie',
  becquerel_p: 'Henri Becquerel',
  bohr: 'Niels Bohr',
  rutherford: 'Ernest Rutherford',
  noether: 'Emmy Noether',
  chadwick: 'James Chadwick',
  newton: 'Isaac Newton',
  franklin: 'Benjamin Franklin',
  roentgen: 'Wilhelm Conrad Röntgen',
  heisenberg: 'Werner Heisenberg',
  fahrenheit: 'Daniel Gabriel Fahrenheit',
  oppenheimer: 'J. Robert Oppenheimer',
  bell_burnell: 'Jocelyn Bell Burnell',
  zwicky: 'Fritz Zwicky',

  // Einheiten
  u_newton: 'Newton (Einheit)',
  u_volt: 'Volt',
  u_hertz: 'Hertz (Einheit)',
  u_lichtjahr: 'Lichtjahr',
  u_tesla: 'Tesla (Einheit)',
  u_becquerel: 'Becquerel (Einheit)',
  u_joule: 'Joule',
  u_watt: 'Watt (Einheit)',
  u_ohm: 'Ohm (Einheit)',
  u_kelvin: 'Kelvin',
  u_kilowattstunde: 'Kilowattstunde',
  u_coulomb: 'Coulomb',

  // Teilchen
  elektron: 'Elektron',
  photon: 'Photon',
  positron: 'Positron',
  higgs: 'Higgs-Boson',
  gluon: 'Gluon',
  myon: 'Myon',
  nukleon: 'Nukleon',
  baryon: 'Baryon',
  meson: 'Meson',
  antineutrino: 'Neutrino',
  axion: 'Axion',

  // Phänomene
  doppler: 'Doppler-Effekt',
  photoeffekt: 'Photoelektrischer Effekt',
  totalreflexion: 'Totalreflexion',
  supraleitung: 'Supraleiter',
  rayleigh: 'Rayleigh-Streuung',
  ereignishorizont: 'Ereignishorizont',
  polarlicht: 'Polarlicht',
  roentgenstrahlung: 'Röntgenstrahlung',
  coriolis: 'Corioliskraft',
  magnus: 'Magnus-Effekt',
  leidenfrost: 'Leidenfrost-Effekt',
  cherenkov: 'Tscherenkow-Strahlung',

  // Gesetze
  ohm: 'Ohmsches Gesetz',
  wechselwirkung: 'Newtonsche Gesetze',
  hs2: 'Zweiter Hauptsatz der Thermodynamik',
  archimedes_prinzip: 'Archimedisches Prinzip',
  pauli: 'Pauli-Prinzip',
  lenz: 'Lenzsche Regel',
  energieerhaltung: 'Energieerhaltungssatz',
  kepler1: 'Keplersche Gesetze',
  pascal_prinzip: 'Pascalsches Gesetz',
  boyle_mariotte: 'Gesetz von Boyle-Mariotte',
  hs3: 'Dritter Hauptsatz der Thermodynamik',
  planck_gesetz: 'Plancksches Strahlungsgesetz',

  // Formeln – hier ist der Titel immer nötig
  newton2: 'Newtonsche Gesetze',
  emc2: 'Äquivalenz von Masse und Energie',
  ekin: 'Kinetische Energie',
  gasgleichung: 'Thermische Zustandsgleichung idealer Gase',
  photon_energie: 'Photon',
  de_broglie_f: 'Materiewelle',
  ohm_f: 'Ohmsches Gesetz',
  druck: 'Druck (Physik)',
  epot: 'Potentielle Energie',
  frequenz_f: 'Frequenz',
  el_leistung: 'Elektrische Leistung',
  reihenschaltung: 'Reihenschaltung',
  pendel_f: 'Mathematisches Pendel',

  // Konstanten
  erdbeschleunigung: 'Fallbeschleunigung',
  lichtgeschwindigkeit: 'Lichtgeschwindigkeit',
  avogadro: 'Avogadro-Konstante',
  elementarladung: 'Elementarladung',
  planck_h: 'Plancksches Wirkungsquantum',
  schallgeschwindigkeit: 'Schallgeschwindigkeit',
  erdradius: 'Erdradius',
  boltzmannkonstante: 'Boltzmann-Konstante',
  gravitationskonstante: 'Gravitationskonstante',
  feinstruktur: 'Feinstrukturkonstante',

  // Experimente
  rutherford_streu: 'Rutherford-Streuung',
  foucault: 'Foucaultsches Pendel',
  millikan: 'Millikan-Versuch',
  katze: 'Schrödingers Katze',
  michelson_morley: 'Michelson-Morley-Experiment',
  stern_gerlach: 'Stern-Gerlach-Versuch',
  prisma: 'Prisma (Optik)',
  magdeburg: 'Magdeburger Halbkugeln',
  ligo: 'LIGO',
  lhc: 'Large Hadron Collider',
  maxwell_daemon: 'Maxwellscher Dämon',
  eratosthenes: 'Eratosthenes',

  // Erweiterung Klassenstufen (Issue #16)
  b_dichte: 'Dichte',
  b_stromstaerke: 'Elektrische Stromstärke',
  b_teilchenmodell: 'Teilchenmodell',
  b_wirkungsgrad: 'Wirkungsgrad',
  b_halbleiter: 'Halbleiter',
  b_isotop: 'Isotop',
  b_orbital: 'Atomorbital',
  d_kompass: 'Kompass',
  d_bimetall: 'Bimetall',
  d_trafo: 'Transformator',
  d_geiger: 'Geiger-Müller-Zählrohr',
  d_lichtleiter: 'Lichtwellenleiter',
  d_fadenstrahlrohr: 'Fadenstrahlrohr',
};
