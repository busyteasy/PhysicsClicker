// Fragekatalog. Jede Frage verweist auf den Eintrag, der sie beantwortet –
// die Antwort wird also genauso tolerant erkannt wie jede andere Eingabe.
// Der Bereich einer Frage ist der Bereich (die Kategorie) ihrer Antwort.
//
//   id      eindeutig, nur a-z, 0-9 und _
//   tier    Schwierigkeit 1–5, bestimmt die Punkte
//   frage   Fragetext
//   antwort ID des Eintrags in der Wissensdatenbank
//   wert    true: Bei Konstanten muss der Zahlenwert genannt werden

const Q = (id, tier, frage, antwort, wert = false) => ({ id, tier, frage, antwort, wert });

export default [
  // Personen
  Q('f_relativ', 1, 'Wer entwickelte die Relativitätstheorie?', 'einstein'),
  Q('f_zwei_nobel', 1, 'Wer erhielt Nobelpreise sowohl in Physik als auch in Chemie?', 'curie'),
  Q('f_radioaktiv', 2, 'Wer entdeckte 1896 die Radioaktivität?', 'becquerel_p'),
  Q('f_atommodell', 2, 'Wer stellte 1913 ein Atommodell mit festen Elektronenbahnen auf?', 'bohr'),
  Q('f_kern_entdeckt', 2, 'Wer entdeckte mit einem Streuversuch an Goldfolie den Atomkern?', 'rutherford'),
  Q('f_noether', 3, 'Welche Mathematikerin bewies, dass jede Symmetrie eine Erhaltungsgröße mit sich bringt?', 'noether'),
  Q('f_neutron', 3, 'Wer entdeckte 1932 das Neutron?', 'chadwick'),

  // Einheiten
  Q('f_kraft', 1, 'In welcher Einheit misst man eine Kraft?', 'u_newton'),
  Q('f_spannung', 1, 'Welche Einheit hat die elektrische Spannung?', 'u_volt'),
  Q('f_frequenz', 1, 'In welcher Einheit wird eine Frequenz angegeben?', 'u_hertz'),
  Q('f_lichtjahr', 1, 'Wie heißt die Strecke, die Licht in einem Jahr zurücklegt?', 'u_lichtjahr'),
  Q('f_flussdichte', 2, 'Welche Einheit hat die magnetische Flussdichte?', 'u_tesla'),
  Q('f_aktivitaet', 2, 'In welcher Einheit misst man die Aktivität einer radioaktiven Quelle?', 'u_becquerel'),

  // Teilchen
  Q('f_elektron', 1, 'Welches negativ geladene Teilchen umgibt den Atomkern?', 'elektron'),
  Q('f_lichtquant', 1, 'Wie heißt das Teilchen des Lichts?', 'photon'),
  Q('f_antielektron', 2, 'Wie heißt das Antiteilchen des Elektrons?', 'positron'),
  Q('f_cern_2012', 2, 'Welches Teilchen wurde 2012 am CERN nachgewiesen?', 'higgs'),
  Q('f_klebstoff', 3, 'Welches Austauschteilchen hält die Quarks zusammen?', 'gluon'),
  Q('f_schweres_elektron', 3, 'Welches Lepton ist etwa 207-mal schwerer als das Elektron?', 'myon'),

  // Phänomene
  Q('f_martinshorn', 2, 'Warum klingt ein vorbeifahrendes Martinshorn erst höher und dann tiefer?', 'doppler'),
  Q('f_licht_loest', 2, 'Wie heißt der Effekt, bei dem Licht Elektronen aus einem Metall löst?', 'photoeffekt'),
  Q('f_glasfaser', 2, 'Was hält das Licht in einer Glasfaser gefangen?', 'totalreflexion'),
  Q('f_widerstand_null', 3, 'Wie heißt der Zustand, in dem der elektrische Widerstand exakt auf null fällt?', 'supraleitung'),
  Q('f_himmel_blau', 3, 'Welcher Effekt sorgt dafür, dass der Himmel blau ist?', 'rayleigh'),
  Q('f_kein_entkommen', 3, 'Wie heißt die Grenze um ein Schwarzes Loch, hinter der nichts mehr entkommt?', 'ereignishorizont'),

  // Gesetze
  Q('f_uri', 1, 'Welches Gesetz besagt U = R·I?', 'ohm'),
  Q('f_actio', 2, 'Wie heißt das Prinzip „actio gleich reactio“?', 'wechselwirkung'),
  Q('f_waerme_fluss', 2, 'Welcher Hauptsatz besagt, dass Wärme von selbst nur vom Warmen zum Kalten fließt?', 'hs2'),
  Q('f_schiff', 2, 'Welches Prinzip erklärt, warum ein Schiff schwimmt?', 'archimedes_prinzip'),
  Q('f_zwei_elektronen', 3, 'Welches Prinzip verbietet zwei Elektronen, denselben Quantenzustand einzunehmen?', 'pauli'),
  Q('f_gegen_ursache', 3, 'Welche Regel besagt, dass ein induzierter Strom seiner Ursache entgegenwirkt?', 'lenz'),

  // Formeln
  Q('f_newton2', 1, 'Wie lautet das zweite newtonsche Axiom als Formel?', 'newton2'),
  Q('f_masse_energie', 1, 'Mit welcher Formel hängen Masse und Energie zusammen?', 'emc2'),
  Q('f_ekin', 2, 'Wie berechnet man die kinetische Energie?', 'ekin'),
  Q('f_gas', 2, 'Wie lautet die ideale Gasgleichung?', 'gasgleichung'),
  Q('f_photon', 2, 'Wie berechnet man die Energie eines Photons aus seiner Frequenz?', 'photon_energie'),
  Q('f_materiewelle', 3, 'Wie berechnet man die Wellenlänge eines Teilchens aus seinem Impuls?', 'de_broglie_f'),

  // Konstanten (mit Wert)
  Q('f_g', 1, 'Wie groß ist die Erdbeschleunigung? (Zahl mit Einheit)', 'erdbeschleunigung', true),
  Q('f_c', 2, 'Wie schnell ist Licht im Vakuum? (Zahl mit Einheit)', 'lichtgeschwindigkeit', true),
  Q('f_mol', 2, 'Wie viele Teilchen enthält ein Mol?', 'avogadro', true),
  Q('f_e', 3, 'Wie groß ist die Elementarladung? (Zahl mit Einheit)', 'elementarladung', true),
  Q('f_h', 3, 'Welchen Wert hat das Plancksche Wirkungsquantum?', 'planck_h', true),

  // Experimente
  Q('f_atomkern_versuch', 2, 'Mit welchem Versuch wurde der Atomkern entdeckt?', 'rutherford_streu'),
  Q('f_erddrehung', 2, 'Welches Pendel machte 1851 die Drehung der Erde sichtbar?', 'foucault'),
  Q('f_oeltropfen', 2, 'Mit welchem Versuch bestimmte Robert Millikan die Elementarladung?', 'millikan'),
  Q('f_katze', 2, 'Mit welchem Gedankenexperiment spitzte Schrödinger 1935 die Quantenmechanik zu?', 'katze'),
  Q('f_aether', 3, 'Welches Experiment suchte 1887 vergeblich nach dem Äther?', 'michelson_morley'),
  Q('f_silberatome', 3, 'Welcher Versuch spaltete 1922 einen Strahl aus Silberatomen im Magnetfeld auf?', 'stern_gerlach'),
  // ---------- Erweiterung (Issue #7) ----------

  // Personen
  Q('f_bewegungsgesetze', 1, 'Wer formulierte die Bewegungsgesetze und das Gravitationsgesetz?', 'newton'),
  Q('f_blitzableiter', 1, 'Wer erfand den Blitzableiter?', 'franklin'),
  Q('f_xstrahlen', 1, 'Wer entdeckte 1895 die nach ihm benannten X-Strahlen?', 'roentgen'),
  Q('f_unschaerfe', 2, 'Wer formulierte die Unschärferelation?', 'heisenberg'),
  Q('f_fahrenheit', 2, 'Nach wem ist die Temperaturskala benannt, die in den USA gilt?', 'fahrenheit'),
  Q('f_los_alamos', 2, 'Wer leitete im Zweiten Weltkrieg das Labor in Los Alamos?', 'oppenheimer'),
  Q('f_pulsar', 4, 'Welche Doktorandin entdeckte 1967 den ersten Pulsar?', 'bell_burnell'),
  Q('f_dunkle_materie', 4, 'Wer vermutete schon 1933 die Dunkle Materie?', 'zwicky'),

  // Einheiten
  Q('f_energie_einheit', 1, 'In welcher Einheit misst man Energie?', 'u_joule'),
  Q('f_leistung_einheit', 1, 'In welcher Einheit misst man Leistung?', 'u_watt'),
  Q('f_widerstand_einheit', 1, 'In welcher Einheit misst man den elektrischen Widerstand?', 'u_ohm'),
  Q('f_temperatur_einheit', 1, 'Wie heißt die SI-Einheit der Temperatur?', 'u_kelvin'),
  Q('f_stromrechnung', 1, 'In welcher Einheit rechnet der Stromversorger ab?', 'u_kilowattstunde'),
  Q('f_ladung_einheit', 2, 'Welche Einheit hat die elektrische Ladung?', 'u_coulomb'),

  // Teilchen
  Q('f_nukleon', 2, 'Wie lautet der Oberbegriff für Proton und Neutron?', 'nukleon'),
  Q('f_drei_quarks', 3, 'Wie heißen Teilchen aus drei Quarks, zu denen Proton und Neutron gehören?', 'baryon'),
  Q('f_quark_antiquark', 3, 'Wie heißt ein Teilchen aus einem Quark und einem Antiquark?', 'meson'),
  Q('f_betazerfall_teilchen', 3, 'Welches neutrale Teilchen entsteht beim Betazerfall zusammen mit dem Elektron?', 'antineutrino'),
  Q('f_waschmittel', 5, 'Welcher Kandidat für Dunkle Materie ist nach einem Waschmittel benannt?', 'axion'),

  // Phänomene
  Q('f_polarlicht', 1, 'Wie heißt das farbige Leuchten am Himmel in der Nähe der Pole?', 'polarlicht'),
  Q('f_roentgenstrahlung', 1, 'Welche Strahlung macht im Krankenhaus das Skelett sichtbar?', 'roentgenstrahlung'),
  Q('f_tiefdruck', 3, 'Welche Scheinkraft lässt Tiefdruckgebiete auf der Nordhalbkugel gegen den Uhrzeigersinn drehen?', 'coriolis'),
  Q('f_angeschnitten', 3, 'Welcher Effekt lässt einen angeschnittenen Ball eine Kurve fliegen?', 'magnus'),
  Q('f_herdplatte', 3, 'Welcher Effekt lässt Wassertropfen auf einer heißen Herdplatte tanzen?', 'leidenfrost'),
  Q('f_blaues_leuchten', 4, 'Was erzeugt das blaue Leuchten im Wasser von Kernreaktoren?', 'cherenkov'),

  // Gesetze
  Q('f_energie_weg', 1, 'Welcher Satz besagt, dass Energie weder entsteht noch verloren geht?', 'energieerhaltung'),
  Q('f_ellipsen', 2, 'Welches Gesetz besagt, dass Planeten auf Ellipsen um die Sonne laufen?', 'kepler1'),
  Q('f_hydraulik', 2, 'Welches Prinzip nutzt jede hydraulische Presse?', 'pascal_prinzip'),
  Q('f_druck_volumen', 2, 'Welches Gesetz verknüpft Druck und Volumen eines Gases bei konstanter Temperatur?', 'boyle_mariotte'),
  Q('f_nullpunkt', 3, 'Welcher Hauptsatz macht den absoluten Nullpunkt unerreichbar?', 'hs3'),
  Q('f_schwarzer_koerper', 3, 'Welches Gesetz beschreibt das Spektrum eines Schwarzen Körpers?', 'planck_gesetz'),

  // Formeln
  Q('f_ohm_formel', 1, 'Wie lautet das ohmsche Gesetz als Formel?', 'ohm_f'),
  Q('f_druck_formel', 1, 'Wie berechnet man den Druck aus Kraft und Fläche?', 'druck'),
  Q('f_lageenergie', 1, 'Wie berechnet man die Lageenergie?', 'epot'),
  Q('f_periodendauer', 1, 'Wie hängen Frequenz und Periodendauer zusammen?', 'frequenz_f'),
  Q('f_el_leistung', 1, 'Wie berechnet man die elektrische Leistung aus Spannung und Strom?', 'el_leistung'),
  Q('f_reihe', 2, 'Wie berechnet man den Gesamtwiderstand einer Reihenschaltung aus zwei Widerständen?', 'reihenschaltung'),
  Q('f_pendel', 3, 'Wie berechnet man die Schwingungsdauer eines Fadenpendels?', 'pendel_f'),

  // Konstanten (mit Wert)
  Q('f_schall', 1, 'Wie schnell ist Schall in Luft? (Zahl mit Einheit)', 'schallgeschwindigkeit', true),
  Q('f_erdradius', 2, 'Wie groß ist der Erdradius? (Zahl mit Einheit)', 'erdradius', true),
  Q('f_boltzmann', 4, 'Welchen Wert hat die Boltzmann-Konstante?', 'boltzmannkonstante', true),
  Q('f_gravitation', 4, 'Welchen Wert hat die Gravitationskonstante?', 'gravitationskonstante', true),
  Q('f_feinstruktur', 5, 'Welchen Wert hat die Feinstrukturkonstante? (Bruch oder Dezimalzahl)', 'feinstruktur', true),

  // Experimente
  Q('f_prisma', 1, 'Mit welchem Versuch zeigte Newton, dass weißes Licht aus vielen Farben besteht?', 'prisma'),
  Q('f_halbkugeln', 2, 'Welche luftleer gepumpten Kugeln konnten nicht einmal Pferdegespanne trennen?', 'magdeburg'),
  Q('f_gravitationswellen', 3, 'Welches Experiment maß 2015 erstmals Gravitationswellen?', 'ligo'),
  Q('f_higgs_maschine', 3, 'In welchem Beschleuniger wurde 2012 das Higgs-Boson nachgewiesen?', 'lhc'),
  Q('f_daemon', 3, 'Wie heißt das Gedankenexperiment mit einem Wesen, das schnelle und langsame Moleküle sortiert?', 'maxwell_daemon'),
  Q('f_erdumfang', 3, 'Wie heißt der antike Versuch, mit Schattenwinkeln den Erdumfang zu bestimmen?', 'eratosthenes'),
];
