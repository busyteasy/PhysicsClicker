// Klasse 8 – Doppeljahrgang 7/8, zweiter Teil: Kraft und Masse, Hebel und
// Flaschenzug, Leistung, elektrischer Stromkreis (Ladung, Stromstärke,
// Spannung, Widerstand, Ohmsches Gesetz, Kirchhoffsche Regeln).
import { Q, QUELLE_SI, S, ausFreiListe } from './helpers.js';

export default {
  klasse: 8,
  beschreibung: 'In Klasse 8 misst du Kräfte und sparst mit Hebel und Flaschenzug Kraft. In der Elektrizitätslehre geht es um Ladung, Stromstärke, Spannung, Widerstand und das Ohmsche Gesetz.',
  // Zusammengefasste Bereiche (Issue #26)
  gruppen: ['phaenomen_teilchen', 'einheit_konstante', 'forschung'],
  themen: ['Kraft und Masse', 'Hebel und Flaschenzug', 'Leistung', 'Elektrische Ladung und Stromkreis', 'Widerstand und Ohmsches Gesetz'],
  quelle: `${QUELLE_SI}, Themenbereiche Mechanik sowie Magnetismus und Elektrizität (Doppeljahrgang 7/8, Zuordnung zu Jahrgang 8 nach Anhang A3)`,
  eintraege: {
    // Größen & Begriffe
    ...S(1, 'b_kraft b_masse b_gewichtskraft b_traegheit b_kraftpfeil b_leistung b_ladung b_stromstaerke b_spannung b_widerstand b_reihe b_parallel b_kurzschluss b_energie'),
    ...S(2, 'b_ersatzkraft b_kraeftegleichgewicht b_elektronengas b_wassermodell b_technische_stromrichtung b_kennlinie b_schwerelosigkeit b_luftwiderstand b_kern_huelle b_energieuebertragung'),
    ...S(3, 'b_tv_diagramm b_beschleunigt b_haftreibung b_gleitreibung b_rollreibung'),
    // Geräte & Bauteile
    ...S(1, 'd_kraftmesser d_waage d_hebel d_flaschenzug d_feste_rolle d_amperemeter d_voltmeter d_multimeter d_batterie'),
    ...S(2, 'd_lose_rolle d_schiefe_ebene d_elektroskop d_rakete d_satellit d_sicherung d_led'),
    ...S(3, 'd_bandgenerator d_netzgeraet'),
    // Teilchen
    ...S(1, 'elektron atom atomkern'),
    ...S(2, 'proton neutron ion'),
    // Phänomene
    ...S(1, 'reibung p_aufladung p_waermewirkung'),
    ...S(2, 'p_rueckstoss blitz'),
    ...S(3, 'p_influenz'),
    // Gesetze
    ...S(1, 'traegheit hebel ohm g_ladungsgesetz'),
    ...S(2, 'wechselwirkung hooke g_goldene_regel knotenregel'),
    ...S(3, 'ladungserhaltung'),
    // Formeln
    ...S(1, 'gewichtskraft ohm_f'),
    ...S(2, 'hooke_f f_hebel el_leistung leistung f_energie_leistung'),
    ...S(3, 'reihenschaltung parallelschaltung ladung_f f_el_energie'),
    // Einheiten
    ...S(1, 'u_newton u_kilogramm u_watt u_ampere u_volt'),
    ...S(2, 'u_kilowattstunde u_ohm'),
    ...S(3, 'u_coulomb'),
    // Konstanten
    ...S(1, 'erdbeschleunigung'),
    ...S(2, 'k_ortsfaktor_mond'),
    ...S(3, 'elementarladung'),
    // Personen
    ...S(1, 'newton ohm_p'),
    ...S(2, 'hooke_p volta ampere_p franklin archimedes watt_p'),
    ...S(3, 'kirchhoff coulomb_p'),
    // Experimente
    ...S(1, 'e_wasserrakete e_zitrone'),
    ...S(2, 'drachen hammer_feder'),
    ...S(3, 'galvani'),
    ...S(2, 'maschenregel'),
    ...S(4, 'b_potenzial'),
    ...S(1, 'b_elektrische_energie'),
    ...S(2, 'b_elektronenstrom b_quellenspannung'),
    // Erweiterung: fehlende Grundbegriffe (Issue #40)
    ...S(1, 'd_feder b_strom'),
    ...S(2, 'gravitation'),
  },
  fragen: [
    // Kraft und Masse
    Q('k8_kraft', 1, 'Welche Größe ist die Ursache von Verformungen und Bewegungsänderungen?', 'b_kraft'),
    Q('k8_newton', 1, 'In welcher Einheit misst man Kräfte?', 'u_newton'),
    Q('k8_kg', 1, 'In welcher Einheit misst man die Masse?', 'u_kilogramm'),
    Q('k8_traegheit', 1, 'Welches Gesetz erklärt, warum man im bremsenden Bus nach vorn kippt?', 'traegheit', false, ['b_traegheit']),
    Q('k8_gewicht', 1, 'Wie heißt die Kraft, mit der die Erde einen Körper anzieht?', 'b_gewichtskraft'),
    Q('k8_fg', 1, 'Mit welcher Formel berechnet man die Gewichtskraft aus Masse und Ortsfaktor?', 'gewichtskraft'),
    Q('k8_g', 2, 'Wie groß ist der Ortsfaktor auf der Erde? (Zahl mit Einheit)', 'erdbeschleunigung', true),
    Q('k8_mond', 3, 'Wie groß ist der Ortsfaktor auf dem Mond? (Zahl mit Einheit)', 'k_ortsfaktor_mond', true),
    Q('k8_hooke', 2, 'Welches Gesetz besagt, dass die Verlängerung einer Feder proportional zur Kraft ist?', 'hooke'),
    Q('k8_kraftmesser', 1, 'Mit welchem Gerät misst man Kräfte?', 'd_kraftmesser'),
    Q('k8_ersatz', 2, 'Wie heißt die einzelne Kraft, die dieselbe Wirkung hat wie zwei Kräfte zusammen?', 'b_ersatzkraft'),
    Q('k8_gleichgewicht', 2, 'Wie nennt man es, wenn sich alle Kräfte an einem Körper gegenseitig aufheben?', 'b_kraeftegleichgewicht'),
    Q('k8_actio', 2, 'Welches Prinzip besagt, dass zu jeder Kraft eine gleich große Gegenkraft gehört?', 'wechselwirkung'),
    Q('k8_rueckstoss', 2, 'Welcher Effekt treibt Raketen auch im luftleeren Weltraum an?', 'p_rueckstoss', false, ['wechselwirkung']),
    Q('k8_haftreibung', 3, 'Welche Reibung muss man überwinden, um einen schweren Schrank überhaupt in Bewegung zu setzen?', 'b_haftreibung'),
    // Hebel, Flaschenzug, Leistung
    Q('k8_hebelgesetz', 1, 'Welches Gesetz sagt: Kraft mal Kraftarm gleich Last mal Lastarm?', 'hebel'),
    Q('k8_flaschenzug', 1, 'Mit welchem Gerät aus mehreren Rollen kann man schwere Lasten mit wenig Kraft heben?', 'd_flaschenzug'),
    Q('k8_goldene', 2, 'Welche Regel besagt: Was man an Kraft spart, muss man an Weg zusetzen?', 'g_goldene_regel'),
    Q('k8_feste_rolle', 2, 'Welche Rolle ändert nur die Richtung der Kraft, nicht ihren Betrag?', 'd_feste_rolle'),
    Q('k8_watt', 1, 'In welcher Einheit misst man die Leistung?', 'u_watt'),
    Q('k8_kwh', 2, 'In welcher Einheit rechnet der Stromversorger die elektrische Energie ab?', 'u_kilowattstunde'),
    Q('k8_ept', 2, 'Mit welcher Formel berechnet man die Energie aus Leistung und Zeit?', 'f_energie_leistung'),
    // Elektrizität
    Q('k8_ladungen', 1, 'Welches Gesetz besagt, dass sich gleichnamige Ladungen abstoßen?', 'g_ladungsgesetz'),
    Q('k8_elektron', 1, 'Welche negativ geladenen Teilchen bewegen sich im Metalldraht, wenn Strom fließt?', 'elektron'),
    Q('k8_aufladung', 1, 'Wie heißt es, wenn sich ein Luftballon durch Reiben an den Haaren elektrisch auflädt?', 'p_aufladung'),
    Q('k8_reibung', 1, 'Welche Kraft bremst einen rollenden Ball auf dem Rasen ab und lässt uns beim Gehen nicht ausrutschen?', 'reibung'),
    Q('k8_kern', 1, 'Wie heißt der winzige, positiv geladene Teil im Zentrum eines Atoms?', 'atomkern'),
    Q('k8_proton', 2, 'Welche positiv geladenen Teilchen befinden sich im Atomkern?', 'proton'),
    Q('k8_elektronengas', 2, 'Mit welchem Modell erklärt man, warum Metalle den Strom leiten?', 'b_elektronengas'),
    Q('k8_stromstaerke', 1, 'Welche Größe misst man mit einem Amperemeter?', 'b_stromstaerke'),
    Q('k8_ampere', 1, 'In welcher Einheit misst man die Stromstärke?', 'u_ampere'),
    Q('k8_voltmeter', 1, 'Welches Messgerät schaltet man parallel zum Verbraucher?', 'd_voltmeter'),
    Q('k8_amperemeter', 2, 'Welches Messgerät schaltet man in Reihe in den Stromkreis?', 'd_amperemeter'),
    Q('k8_spannung', 2, 'Welche Größe ist ein Maß für die Energie, die je Ladung übertragen werden kann?', 'b_spannung'),
    Q('k8_quelle', 2, 'Wie heißt die Spannung, die eine Batterie oder ein Netzgerät bereitstellt?', 'b_quellenspannung'),
    Q('k8_widerstand', 1, 'Welche Größe berechnet man als Quotient aus Spannung und Stromstärke?', 'b_widerstand'),
    Q('k8_ohm_einheit', 2, 'In welcher Einheit misst man den elektrischen Widerstand?', 'u_ohm'),
    Q('k8_ohmgesetz', 2, 'Welches Gesetz sagt, dass bei konstanter Temperatur die Stromstärke proportional zur Spannung ist?', 'ohm'),
    Q('k8_uri', 1, 'Mit welcher Formel hängen Spannung, Widerstand und Stromstärke zusammen?', 'ohm_f'),
    Q('k8_pui', 2, 'Mit welcher Formel berechnet man die elektrische Leistung?', 'el_leistung'),
    Q('k8_knoten', 2, 'Welche Regel besagt, dass an einer Verzweigung so viel Strom hinein- wie hinausfließt?', 'knotenregel'),
    Q('k8_masche', 2, 'Welche Regel besagt, dass sich in einem geschlossenen Umlauf alle Spannungen zu null addieren?', 'maschenregel'),
    Q('k8_reihe_r', 3, 'Wie berechnet man den Gesamtwiderstand zweier Widerstände in Reihe?', 'reihenschaltung'),
    Q('k8_parallel_r', 3, 'Wie berechnet man den Gesamtwiderstand zweier parallel geschalteter Widerstände?', 'parallelschaltung'),
    Q('k8_kennlinie', 2, 'Wie heißt das Diagramm, das die Stromstärke in Abhängigkeit von der Spannung zeigt?', 'b_kennlinie'),
    Q('k8_elektroskop', 2, 'Mit welchem Gerät weist man elektrische Ladung nach?', 'd_elektroskop'),
    Q('k8_ohm_person', 1, 'Welcher deutsche Physiker fand heraus, dass in Metalldrähten die Stromstärke proportional zur Spannung ist?', 'ohm_p'),
    Q('k8_kirchhoff', 3, 'Nach wem sind Knoten- und Maschenregel benannt?', 'kirchhoff'),
    Q('k8_volta', 2, 'Wer baute um 1800 die erste Batterie?', 'volta'),
    Q('k8_drachen', 2, 'Mit welchem Versuch soll Franklin gezeigt haben, dass Blitze elektrische Entladungen sind?', 'drachen'),
    Q('k8_mondfall', 2, 'Welcher Versuch auf dem Mond zeigte, dass ohne Luft alle Körper gleich schnell fallen?', 'hammer_feder'),
  ],
  // Schätzfragen (Issue #46)
  schaetzen: [
    ...ausFreiListe(8, 1, 's_steckdose s_aa_batterie s_wasserkocher s_mondwaage s_mensch_waerme s_luft_liter'),
    ...ausFreiListe(8, 2, 's_handyakku s_blitz_strom s_fall_45m'),
    ...ausFreiListe(8, 3, 's_elektronen_1a'),
  ],
};
