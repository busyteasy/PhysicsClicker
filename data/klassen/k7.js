// Klasse 7 – Doppeljahrgang 7/8, erster Teil: Energie (Formen, Umwandlung,
// Übertragung, Energieflussdiagramme), Bewegungen beschreiben, optische
// Instrumente und Farben, Sterne und Weltall.
import { Q, QUELLE_SI, S } from './helpers.js';

export default {
  klasse: 7,
  beschreibung: 'Klasse 7 verfolgt Energie durch ihre Umwandlungen und beschreibt Bewegungen mit Weg, Zeit und Geschwindigkeit. Mit Linsen geht es zu Fernrohr, Mikroskop und Auge – und zum Schluss hinaus ins Weltall.',
  // Zusammengefasste Bereiche (Issue #26)
  gruppen: ['gesetz_formel', 'forschung'],
  themen: ['Energieformen und Energieumwandlung', 'Bewegungen beschreiben', 'Optische Instrumente und Farben', 'Sterne und Weltall'],
  quelle: `${QUELLE_SI}, Themenbereiche Energie (Zuordnung zu Jahrgang 7 nach Anhang A3) und Mechanik (Doppeljahrgang 7/8); optische Instrumente sowie Sterne und Weltall (im KC Sek I nicht verbindlich) nach gängigen Schulbuchreihen`,
  eintraege: {
    // Größen & Begriffe
    ...S(1, 'b_energie b_energieform b_bewegungsenergie b_hoehenenergie b_spannenergie b_chemische_energie b_energieumwandlung b_energieuebertragung b_energiekette b_geschwindigkeit b_gleichfoermig b_ts_diagramm b_planet b_stern b_sonnensystem b_galaxie b_milchstrasse b_komet b_jahreszeiten b_brennweite b_spektrum'),
    ...S(2, 'b_innere_energie b_energieflussdiagramm b_energiekonto b_bezugssystem b_gegenstandsweite b_bildweite b_vergroesserung b_additiv b_subtraktiv b_akkommodation b_kurzsichtig b_weitsichtig b_infrarot b_uv b_virtuelles_bild b_reelles_bild b_heliozentrisch b_geozentrisch b_asteroid b_sternschnuppe'),
    ...S(3, 'b_energieentwertung b_beschleunigt b_tv_diagramm b_komplementaer b_brechzahl b_exoplanet b_brechungswinkel b_nebel'),
    // Geräte & Bauteile
    ...S(1, 'd_lupe d_fernrohr d_mikroskop d_sammellinse d_fotoapparat d_brille'),
    ...S(2, 'd_beamer d_lichtleiter d_prisma d_stoppuhr d_rakete'),
    ...S(3, 'd_lichtschranke d_spektroskop d_hohlspiegel d_satellit'),
    // Phänomene
    ...S(1, 'p_mondphasen p_sonnenfinsternis p_mondfinsternis regenbogen'),
    ...S(2, 'totalreflexion dispersion urknall gezeiten fata_morgana p_brechung'),
    ...S(3, 'supernova roter_riese weisser_zwerg schwarzes_loch rotverschiebung expansion rayleigh'),
    // Gesetze
    ...S(1, 'energieerhaltung g_lichtausbreitung reflexionsgesetz'),
    // Formeln
    ...S(1, 'geschwindigkeit'),
    ...S(3, 'massstab_f'),
    // Einheiten
    ...S(1, 'u_joule u_meter u_sekunde'),
    ...S(2, 'u_lichtjahr u_ae u_dioptrie'),
    // Personen
    ...S(1, 'kopernikus galilei'),
    ...S(2, 'kepler_p ptolemaeus joule_p'),
    ...S(3, 'brahe hubble_p'),
    // Experimente
    ...S(1, 'prisma'),
    ...S(2, 'jupitermonde'),
    ...S(3, 'eratosthenes roemer'),
    ...S(3, 'snellius'),
    ...S(3, 'brechkraft_f'),
    ...S(3, 'd_kepler_fernrohr'),
    ...S(3, 'd_galilei_fernrohr'),
    ...S(1, 'b_lichtenergie b_elektrische_energie'),
  },
  fragen: [
    // Energie
    Q('k7_energie', 1, 'In welcher SI-Einheit misst man Energie?', 'u_joule'),
    Q('k7_spann', 1, 'Welche Energieform steckt in einem gespannten Bogen?', 'b_spannenergie'),
    Q('k7_chemisch', 1, 'Welche Energieform ist in Nahrung, Holz und Benzin gespeichert?', 'b_chemische_energie'),
    Q('k7_licht', 1, 'Welche Energieform nutzt eine Solarzelle?', 'b_lichtenergie'),
    Q('k7_elektrisch', 1, 'Welche Energieform liefert die Steckdose?', 'b_elektrische_energie'),
    Q('k7_innere', 2, 'Welche Energie steigt, wenn sich ein Körper erwärmt?', 'b_innere_energie'),
    Q('k7_umwandlung', 1, 'Wie heißt der Vorgang, wenn ein Fahrraddynamo Bewegungsenergie zu elektrischer Energie macht?', 'b_energieumwandlung'),
    Q('k7_fluss', 2, 'Wie heißt das Diagramm, in dem die Breite der Pfeile zeigt, wie viel Energie wohin fließt?', 'b_energieflussdiagramm'),
    Q('k7_konto', 2, 'In welchem Modell wird Energie wie Geld zwischen Konten gebucht?', 'b_energiekonto'),
    Q('k7_erhaltung', 1, 'Welcher Satz besagt, dass Energie weder erzeugt noch vernichtet werden kann?', 'energieerhaltung'),
    Q('k7_entwertung', 3, 'Wie nennt man es, dass Energie als Wärme in die Umgebung geht und kaum noch nutzbar ist?', 'b_energieentwertung'),
    // Bewegung
    Q('k7_gleichfoermig', 1, 'Wie heißt eine Bewegung mit konstanter Geschwindigkeit?', 'b_gleichfoermig'),
    Q('k7_ts', 1, 'In welchem Diagramm ist die Steigung der Kurve die Geschwindigkeit?', 'b_ts_diagramm'),
    Q('k7_v', 1, 'Mit welcher Formel berechnet man die Geschwindigkeit aus Weg und Zeit?', 'geschwindigkeit'),
    Q('k7_bezug', 2, 'Wovon hängt es ab, ob man im fahrenden Zug ruht oder sich bewegt?', 'b_bezugssystem'),
    Q('k7_lichtschranke', 3, 'Mit welchem Gerät misst man Zeiten genauer als mit einer Stoppuhr per Hand?', 'd_lichtschranke'),
    // Optik
    Q('k7_lupe', 1, 'Welches Gerät ist eine einzelne Sammellinse, durch die man Dinge vergrößert sieht?', 'd_lupe'),
    Q('k7_mikroskop', 1, 'Welches Gerät vergrößert mit Objektiv und Okular winzige Dinge bis etwa 1000-fach?', 'd_mikroskop'),
    Q('k7_kepler_fr', 2, 'Welches Fernrohr aus zwei Sammellinsen zeigt das Bild auf dem Kopf?', 'd_kepler_fernrohr'),
    Q('k7_dioptrie', 2, 'In welcher Einheit gibt man die Brechkraft einer Brille an?', 'u_dioptrie'),
    Q('k7_brechkraft', 3, 'Mit welcher Formel berechnet man die Brechkraft aus der Brennweite?', 'brechkraft_f'),
    Q('k7_akkommodation', 2, 'Wie nennt man die Anpassung des Auges an unterschiedliche Entfernungen?', 'b_akkommodation'),
    Q('k7_weitsichtig', 2, 'Welcher Sehfehler wird mit einer Sammellinse korrigiert?', 'b_weitsichtig'),
    Q('k7_dispersion', 2, 'Wie heißt es, dass blaues Licht im Prisma stärker gebrochen wird als rotes?', 'dispersion'),
    Q('k7_subtraktiv', 2, 'Welche Farbmischung nutzen Drucker mit Cyan, Magenta und Gelb?', 'b_subtraktiv'),
    Q('k7_glasfaser', 2, 'Wie heißt das Kabel, das Internetdaten als Licht durch Totalreflexion transportiert?', 'd_lichtleiter'),
    Q('k7_snellius', 3, 'Welches Gesetz beschreibt, wie stark Licht beim Übergang zwischen zwei Stoffen gebrochen wird?', 'snellius'),
    Q('k7_himmelblau', 3, 'Welche Streuung sorgt dafür, dass der Himmel blau ist?', 'rayleigh'),
    // Weltall
    Q('k7_planeten', 1, 'Wie heißen die acht großen Himmelskörper, die die Sonne umkreisen?', 'b_planet'),
    Q('k7_milchstrasse', 1, 'Wie heißt unsere Heimatgalaxie?', 'b_milchstrasse'),
    Q('k7_jahreszeiten', 1, 'Was entsteht durch die schräge Lage der Erdachse?', 'b_jahreszeiten'),
    Q('k7_helio', 2, 'Wie heißt das Weltbild mit der Sonne im Mittelpunkt?', 'b_heliozentrisch'),
    Q('k7_kopernikus', 1, 'Wer setzte 1543 die Sonne in den Mittelpunkt des Planetensystems?', 'kopernikus'),
    Q('k7_jupitermonde', 2, 'Welche Entdeckung Galileis von 1610 zeigte, dass nicht alles um die Erde kreist?', 'jupitermonde'),
    Q('k7_lichtjahr', 2, 'Wie heißt die Strecke, die das Licht in einem Jahr zurücklegt?', 'u_lichtjahr'),
    Q('k7_ae', 2, 'Wie heißt die Längeneinheit für den mittleren Abstand Erde–Sonne?', 'u_ae'),
    Q('k7_gezeiten', 2, 'Wie heißt das Steigen und Fallen des Meeresspiegels, das vor allem der Mond verursacht?', 'gezeiten'),
    Q('k7_urknall', 2, 'Wie heißt der Beginn des Universums vor etwa 13,8 Milliarden Jahren?', 'urknall'),
    Q('k7_komet', 1, 'Wie heißt ein Himmelskörper aus Eis und Staub, der nahe der Sonne einen Schweif bildet?', 'b_komet'),
    Q('k7_sonnenende', 3, 'Welcher Sternrest bleibt am Ende von unserer Sonne übrig?', 'weisser_zwerg'),
    Q('k7_eratosthenes', 3, 'Wie heißt der antike Versuch, den Erdumfang mit Schattenwinkeln zu bestimmen?', 'eratosthenes'),
  ],
};
