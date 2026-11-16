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
];
