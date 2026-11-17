// Klasse 11 – Einführungsphase: Dynamik (verbindlich), dazu die Inhalte der
// Wahlmodule Akustik, Optische Abbildungen und Strahlungsphysik sowie Impuls,
// Reibung und Gravitation als Ergänzung.
import { Q, QUELLE_SII, S } from './helpers.js';

export default {
  klasse: 11,
  themen: ['Dynamik: Fall, Wurf, Newtonsche Axiome', 'Kreisbewegung', 'Energie und Impuls', 'Gravitation und Planetenbahnen', 'Wahlmodule: Akustik, Optische Abbildungen, Strahlungsphysik'],
  quelle: `${QUELLE_SII}, Einführungsphase: Dynamik und Wahlmodule; Impuls, Reibung und Gravitation als Ergänzung`,
  eintraege: {
    // Größen & Begriffe
    ...S(1, 'b_geschwindigkeit b_beschleunigung b_masse b_kraft b_bezugssystem b_gleichfoermig b_beschleunigt b_ts_diagramm b_tv_diagramm b_impuls b_bewegungsenergie b_hoehenenergie b_spannenergie b_frequenz b_amplitude b_schall b_brennweite'),
    ...S(2, 'b_waagerechter_wurf b_kreisbewegung b_umlaufdauer b_bahngeschwindigkeit b_zentripetalkraft b_ersatzkraft b_luftwiderstand b_endgeschwindigkeit b_gleitreibung b_haftreibung b_kraftstoss b_elastischer_stoss b_unelastischer_stoss b_wirkungsgrad b_gegenstandsweite b_bildweite b_reelles_bild b_virtuelles_bild b_ton b_klang b_geraeusch b_tonhoehe b_lautstaerke b_schallpegel b_schwingungsbild b_strahlungsgleichgewicht b_treibhausgas b_albedo b_gravitationsfeld b_schwerelosigkeit'),
    ...S(3, 'b_schiefer_wurf b_zentripetalbeschleunigung b_klangfarbe b_oberton b_oktave b_fluchtgeschwindigkeit b_kreisbahngeschw b_geostationaer b_vergroesserung'),
    // Geräte & Bauteile
    ...S(1, 'd_lichtschranke d_stoppuhr d_kraftmesser d_sammellinse d_mikrofon d_oszilloskop'),
    ...S(2, 'd_fahrbahn d_fotoapparat d_beamer d_mikroskop d_fernrohr d_stimmgabel d_satellit d_rakete'),
    ...S(3, 'd_kepler_fernrohr'),
    // Phänomene
    ...S(1, 'freier_fall reibung p_rueckstoss p_treibhauseffekt waermestrahlung'),
    ...S(2, 'zentrifugal'),
    ...S(3, 'p_schwebung p_selektive_absorption schwarzer_koerper'),
    // Gesetze
    ...S(1, 'traegheit aktionsprinzip wechselwirkung energieerhaltung'),
    ...S(2, 'impulserhaltung gravitationsgesetz kepler1'),
    ...S(3, 'kepler2 kepler3 stefan_boltzmann wien g_superposition'),
    // Formeln
    ...S(1, 'newton2 geschwindigkeit beschleunigung f_v_at f_fall_v ekin epot gewichtskraft frequenz_f'),
    ...S(2, 'weg_zeit f_fall_s zentripetal_f f_bahngeschw impuls reibung_f leistung f_wirkungsgrad linsen_f'),
    ...S(3, 'f_zentripetalbeschl f_kraftstoss massstab_f gravitation_f kepler3_f stefan_f wien_f federenergie'),
    // Einheiten
    ...S(1, 'u_newton u_joule u_watt u_hertz'),
    ...S(2, 'u_dezibel u_dioptrie'),
    // Konstanten
    ...S(1, 'erdbeschleunigung schallgeschwindigkeit'),
    ...S(2, 'erdradius'),
    ...S(3, 'gravitationskonstante solarkonstante stefan_k erdmasse'),
    // Personen
    ...S(1, 'newton galilei kepler_p'),
    ...S(2, 'brahe boltzmann_p'),
    ...S(3, 'w_wien w_stefan abbe'),
    // Experimente
    ...S(1, 'pisa hammer_feder'),
    ...S(2, 'e_fallschnur e_wasserrakete'),
    ...S(3, 'cavendish'),
  },
  fragen: [
    // Fall und Wurf
    Q('k11_freier_fall', 1, 'Wie heißt die Bewegung eines Körpers, auf den nur die Gewichtskraft wirkt?', 'freier_fall'),
    Q('k11_g', 1, 'Wie groß ist die Fallbeschleunigung auf der Erde? (Zahl mit Einheit)', 'erdbeschleunigung', true),
    Q('k11_fall_s', 2, 'Mit welcher Formel berechnet man die Fallstrecke nach der Zeit t?', 'f_fall_s'),
    Q('k11_fall_v', 1, 'Mit welcher Formel berechnet man die Geschwindigkeit beim freien Fall nach der Zeit t?', 'f_fall_v'),
    Q('k11_waagerecht', 2, 'Welche Bewegung setzt sich aus gleichförmiger Bewegung nach vorn und freiem Fall nach unten zusammen?', 'b_waagerechter_wurf'),
    Q('k11_schief', 3, 'Bei welcher Wurfart erreicht man ohne Luftwiderstand unter 45° die größte Weite?', 'b_schiefer_wurf'),
    Q('k11_tv', 1, 'In welchem Diagramm ist die Fläche unter dem Graphen der zurückgelegte Weg?', 'b_tv_diagramm'),
    Q('k11_fallschnur', 2, 'Welcher Versuch mit Kugeln in den Abständen 1 : 4 : 9 : 16 zeigt, dass der Fallweg mit t² wächst?', 'e_fallschnur'),
    Q('k11_galilei', 1, 'Wer untersuchte als Erster systematisch den freien Fall und die Bewegung auf der schiefen Ebene?', 'galilei'),
    // Newtonsche Axiome
    Q('k11_grundgleichung', 1, 'Wie lautet die Grundgleichung der Mechanik?', 'newton2'),
    Q('k11_axiom1', 1, 'Wie heißt das erste Newtonsche Axiom?', 'traegheit'),
    Q('k11_axiom2', 1, 'Wie heißt das zweite Newtonsche Axiom, nach dem eine Kraft die Bewegung ändert?', 'aktionsprinzip'),
    Q('k11_axiom3', 1, 'Wie heißt das dritte Newtonsche Axiom?', 'wechselwirkung'),
    Q('k11_newton_einheit', 1, 'Welche Einheit ist als 1 kg·m/s² definiert?', 'u_newton'),
    Q('k11_joule', 1, 'Welche Einheit entspricht 1 N·m und wird für Energie und Arbeit benutzt?', 'u_joule'),
    Q('k11_dioptrie', 2, 'In welcher Einheit gibt man die Brechkraft einer Linse an?', 'u_dioptrie'),
    Q('k11_reibung', 2, 'Mit welcher Formel berechnet man die Gleitreibungskraft?', 'reibung_f'),
    Q('k11_endgeschw', 2, 'Wie heißt die Geschwindigkeit, bei der Luftwiderstand und Gewichtskraft gleich groß sind?', 'b_endgeschwindigkeit'),
    Q('k11_fahrbahn', 2, 'Auf welcher Fahrbahn lassen sich Bewegungen fast ohne Reibung untersuchen?', 'd_fahrbahn'),
    // Kreisbewegung
    Q('k11_zentripetal', 2, 'Wie heißt die zum Kreismittelpunkt gerichtete Kraft, die einen Körper auf der Kreisbahn hält?', 'b_zentripetalkraft'),
    Q('k11_fz', 2, 'Mit welcher Formel berechnet man die Zentripetalkraft?', 'zentripetal_f'),
    Q('k11_az', 3, 'Mit welcher Formel berechnet man die Zentripetalbeschleunigung?', 'f_zentripetalbeschl'),
    Q('k11_bahngeschw', 2, 'Mit welcher Formel berechnet man die Bahngeschwindigkeit aus Radius und Umlaufdauer?', 'f_bahngeschw'),
    Q('k11_umlauf', 2, 'Wie heißt die Zeit für einen vollen Umlauf auf der Kreisbahn?', 'b_umlaufdauer'),
    Q('k11_flieh', 2, 'Wie heißt die Scheinkraft, die man im rotierenden Karussell nach außen spürt?', 'zentrifugal'),
    // Energie und Impuls
    Q('k11_ekin', 1, 'Mit welcher Formel berechnet man die kinetische Energie?', 'ekin'),
    Q('k11_ees', 1, 'Welcher Satz besagt, dass in einem abgeschlossenen System die Gesamtenergie konstant bleibt?', 'energieerhaltung'),
    Q('k11_feder', 3, 'Mit welcher Formel berechnet man die Spannenergie einer Feder?', 'federenergie'),
    Q('k11_impuls', 2, 'Mit welcher Formel berechnet man den Impuls?', 'impuls'),
    Q('k11_impulserhaltung', 2, 'Welcher Erhaltungssatz erklärt den Rückstoß einer Rakete?', 'impulserhaltung'),
    Q('k11_unelastisch', 3, 'Wie heißt ein Stoß, nach dem sich beide Körper gemeinsam weiterbewegen?', 'b_unelastischer_stoss'),
    Q('k11_kraftstoss', 3, 'Wie heißt das Produkt aus Kraft und Einwirkdauer, das den Impuls ändert?', 'b_kraftstoss'),
    Q('k11_wirkungsgrad', 2, 'Wie heißt das Verhältnis von nutzbarer zu zugeführter Energie?', 'b_wirkungsgrad'),
    // Gravitation
    Q('k11_newton', 1, 'Wer erkannte, dass dieselbe Kraft Äpfel fallen und den Mond um die Erde kreisen lässt?', 'newton'),
    Q('k11_kepler', 1, 'Wer leitete aus Tycho Brahes Beobachtungen die Gesetze der Planetenbewegung ab?', 'kepler_p'),
    Q('k11_brahe', 2, 'Welcher Astronom vermaß ohne Fernrohr den Himmel so genau, dass Kepler seine Gesetze finden konnte?', 'brahe'),
    Q('k11_gravitation', 2, 'Welches Gesetz beschreibt die Anziehung zweier Massen?', 'gravitationsgesetz'),
    Q('k11_g_wert', 3, 'Wie groß ist die Gravitationskonstante? (Zahl mit Einheit)', 'gravitationskonstante', true),
    Q('k11_cavendish', 3, 'Mit welchem Experiment wurde die Gravitationskonstante erstmals im Labor gemessen?', 'cavendish'),
    Q('k11_kepler1', 2, 'Welches Gesetz besagt, dass Planeten auf Ellipsen um die Sonne laufen?', 'kepler1'),
    Q('k11_kepler2', 3, 'Wie heißt das Keplersche Gesetz, nach dem der Fahrstrahl in gleichen Zeiten gleiche Flächen überstreicht?', 'kepler2'),
    Q('k11_kepler3f', 3, 'Wie lautet das dritte Keplersche Gesetz als Formel?', 'kepler3_f'),
    Q('k11_geostationaer', 3, 'Wie heißt die Bahn, auf der ein Satellit über einem festen Punkt des Äquators zu stehen scheint?', 'b_geostationaer'),
    Q('k11_flucht', 3, 'Wie heißt die Geschwindigkeit von rund 11,2 km/s, mit der man das Schwerefeld der Erde verlassen kann?', 'b_fluchtgeschwindigkeit'),
    // Akustik
    Q('k11_ton', 2, 'Wie heißt ein Schallereignis mit genau einer Frequenz, dessen Schwingungsbild eine Sinuskurve ist?', 'b_ton'),
    Q('k11_klangfarbe', 3, 'Was unterscheidet denselben Ton auf Geige und Flöte? Gesucht ist der Fachbegriff.', 'b_klangfarbe'),
    Q('k11_oktave', 3, 'Wie heißt das Intervall zweier Töne mit dem Frequenzverhältnis 2 : 1?', 'b_oktave'),
    Q('k11_pegel', 2, 'Wie heißt die in Dezibel angegebene Größe für die Lautstärke eines Signals?', 'b_schallpegel'),
    Q('k11_schall', 1, 'Wie schnell ist Schall in Luft? (Zahl mit Einheit)', 'schallgeschwindigkeit', true),
    Q('k11_schwebung', 3, 'Wie heißt das An- und Abschwellen, wenn zwei Töne fast gleicher Frequenz zusammen klingen?', 'p_schwebung'),
    Q('k11_oszi', 1, 'Mit welchem Gerät macht man Schwingungsbilder von Tönen sichtbar?', 'd_oszilloskop'),
    // Optische Abbildungen
    Q('k11_linsengleichung', 2, 'Welche Gleichung verknüpft Brennweite, Gegenstandsweite und Bildweite?', 'linsen_f'),
    Q('k11_massstab', 3, 'Mit welcher Formel berechnet man den Abbildungsmaßstab?', 'massstab_f'),
    Q('k11_reell', 2, 'Was für ein Bild entsteht, wenn der Gegenstand außerhalb der doppelten Brennweite steht?', 'b_reelles_bild'),
    Q('k11_beamer', 2, 'Welches Gerät erzeugt mit einer Linse ein stark vergrößertes, reelles Bild an der Wand?', 'd_beamer'),
    // Strahlungsphysik
    Q('k11_stefan', 3, 'Welches Gesetz besagt, dass die Strahlungsleistung mit der vierten Potenz der Temperatur wächst?', 'stefan_boltzmann'),
    Q('k11_wien', 3, 'Welches Gesetz verknüpft die Wellenlänge des Strahlungsmaximums mit der Temperatur?', 'wien'),
    Q('k11_gleichgewicht', 2, 'Wie heißt der Zustand, in dem die Erde so viel Energie abstrahlt, wie sie von der Sonne aufnimmt?', 'b_strahlungsgleichgewicht'),
    Q('k11_selektiv', 3, 'Wie heißt es, dass CO₂ nur bestimmte Wellenlängen im Infraroten absorbiert?', 'p_selektive_absorption'),
    Q('k11_solar', 3, 'Wie groß ist die Solarkonstante? (Zahl mit Einheit)', 'solarkonstante', true),
  ],
};
