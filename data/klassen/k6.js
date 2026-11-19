// Klasse 6 – Doppeljahrgang 5/6, zweiter Teil: phänomenorientierte Optik,
// Schall und ein erster Energiebegriff.
import { Q, QUELLE_SI, S, ausFreiListe, SZ } from './helpers.js';

export default {
  klasse: 6,
  beschreibung: 'In Klasse 6 geht es um Licht und Schall: wie wir sehen, wie Schatten, Spiegel- und Linsenbilder entstehen, woher Farben kommen und wie sich Schall ausbreitet. Außerdem lernst du Energieformen kennen.',
  // Zusammengefasste Bereiche (Issue #26)
  gruppen: ['phaenomen_gesetz', 'einheit_konstante', 'forschung'],
  themen: ['Licht und Sehen', 'Schatten, Spiegel und Linsen', 'Farben', 'Schall', 'Energie und Energieformen'],
  quelle: `${QUELLE_SI}, Themenbereich Phänomenorientierte Optik (Doppeljahrgang 5/6); Schall (im KC Sek I nicht verbindlich) und ein erster Energiebegriff (im KC ab Jahrgang 7) nach gängigen Schulbuchreihen`,
  eintraege: {
    // Größen & Begriffe
    ...S(1, 'b_lichtquelle b_beleuchtet b_lichtbuendel b_lichtstrahl b_sender_empfaenger b_schatten b_kernschatten b_spiegelbild b_einfallswinkel b_reflexionswinkel b_einfallslot b_spektrum b_schall b_ton b_tonhoehe b_lautstaerke b_netzhaut b_pupille b_augenlinse b_ultraschall b_hoerbereich b_laerm'),
    ...S(2, 'b_halbschatten b_strahlenmodell b_brennweite b_reelles_bild b_virtuelles_bild b_infrarot b_uv b_infraschall b_schallschutz b_energieumwandlung b_energieuebertragung b_energiekette b_chemische_energie b_innere_energie b_spannenergie b_geraeusch b_klang b_schwingungsbild'),
    ...S(3, 'b_brechungswinkel b_akkommodation b_kurzsichtig b_weitsichtig b_optische_achse b_mittelpunktstrahl b_parallelstrahl b_brennpunktstrahl b_knall b_schallpegel b_periodendauer b_additiv b_subtraktiv'),
    // Geräte & Bauteile
    ...S(1, 'd_lochkamera d_planspiegel d_sammellinse d_zerstreuungslinse d_lupe d_brille d_stimmgabel d_prisma'),
    ...S(2, 'd_hohlspiegel d_woelbspiegel d_fotoapparat d_lautsprecher d_mikrofon d_echolot'),
    ...S(3, 'd_oszilloskop d_lichtleiter'),
    // Phänomene
    ...S(1, 'p_reflexion p_brechung p_streuung p_absorption p_sonnenfinsternis p_mondfinsternis p_mondphasen regenbogen p_echo brennpunkt'),
    ...S(2, 'totalreflexion dispersion'),
    ...S(3, 'fata_morgana resonanz'),
    // Gesetze
    ...S(1, 'g_lichtausbreitung reflexionsgesetz'),
    ...S(2, 'energieerhaltung'),
    ...S(3, 'snellius'),
    // Einheiten
    ...S(1, 'u_hertz'),
    ...S(2, 'u_joule u_dezibel'),
    ...S(3, 'u_dioptrie'),
    // Konstanten
    ...S(2, 'schallgeschwindigkeit lichtgeschwindigkeit'),
    ...S(3, 'k_schall_wasser'),
    // Personen
    ...S(2, 'newton'),
    ...S(3, 'snellius_p'),
    // Experimente
    ...S(1, 'e_muenze'),
    ...S(2, 'prisma e_farbscheibe'),
    ...S(3, 'roemer'),
    ...S(2, 'b_energie'),
    ...S(2, 'b_energieform'),
    ...S(2, 'b_bewegungsenergie'),
    ...S(2, 'b_hoehenenergie'),
    ...S(2, 'b_frequenz'),
    ...S(2, 'b_amplitude'),
    ...S(2, 'b_lichtenergie b_elektrische_energie'),
    // Erweiterung: fehlende Grundbegriffe (Issue #40)
    ...S(1, 'b_licht d_spiegel b_auge b_sonne b_mond'),
    ...S(2, 'd_linse'),
  },
  fragen: [
    // Begriffe
    Q('k6_quelle', 1, 'Wie nennt man einen Körper, der selbst Licht aussendet, wie die Sonne oder eine Kerze?', 'b_lichtquelle'),
    Q('k6_sehen', 1, 'Mit welcher Vorstellung erklärt man, dass wir einen Gegenstand nur sehen, wenn Licht von ihm in unser Auge fällt?', 'b_sender_empfaenger'),
    Q('k6_kernschatten', 1, 'Wie heißt der Schattenbereich, in den von keiner der Lichtquellen Licht gelangt?', 'b_kernschatten'),
    Q('k6_halbschatten', 2, 'Wie heißt der Schattenbereich, in den nur von einer von zwei Lampen Licht fällt?', 'b_halbschatten'),
    Q('k6_lot', 1, 'Wie heißt die Senkrechte zur Spiegelfläche, von der aus man Einfalls- und Reflexionswinkel misst?', 'b_einfallslot'),
    Q('k6_virtuell', 2, 'Wie nennt man ein Bild, das man nicht auf einem Schirm auffangen kann, etwa das Spiegelbild?', 'b_virtuelles_bild'),
    Q('k6_reell', 2, 'Wie nennt man ein Bild, das sich auf einem Schirm auffangen lässt, etwa bei der Lochkamera?', 'b_reelles_bild'),
    Q('k6_brennweite', 2, 'Wie heißt der Abstand zwischen der Linsenmitte und ihrem Brennpunkt?', 'b_brennweite'),
    Q('k6_mittelpunkt', 3, 'Welcher Strahl geht bei der Bildkonstruktion ungebrochen durch die Linsenmitte?', 'b_mittelpunktstrahl'),
    Q('k6_kurzsichtig', 3, 'Welcher Sehfehler liegt vor, wenn das Bild vor der Netzhaut entsteht?', 'b_kurzsichtig'),
    Q('k6_akkommodation', 3, 'Wie heißt das Scharfstellen des Auges durch Verformen der Augenlinse?', 'b_akkommodation'),
    Q('k6_spektrum', 1, 'Wie nennt man die Farben, in die ein Prisma weißes Licht zerlegt?', 'b_spektrum'),
    Q('k6_uv', 2, 'Welche unsichtbare Strahlung jenseits von Violett verursacht Sonnenbrand?', 'b_uv'),
    Q('k6_ir', 2, 'Welche unsichtbare Strahlung jenseits von Rot spüren wir als Wärme?', 'b_infrarot'),
    Q('k6_additiv', 3, 'Wie heißt die Farbmischung, bei der Rot, Grün und Blau zusammen Weiß ergeben?', 'b_additiv'),
    Q('k6_tonhoehe', 1, 'Welche Eigenschaft eines Tons hängt von der Frequenz ab?', 'b_tonhoehe'),
    Q('k6_lautstaerke', 2, 'Welche Eigenschaft eines Tons hängt von der Amplitude der Schwingung ab?', 'b_lautstaerke'),
    Q('k6_ultraschall', 1, 'Wie heißt Schall mit Frequenzen über 20 000 Hz, den Fledermäuse nutzen?', 'b_ultraschall'),
    Q('k6_klang', 2, 'Wie heißt ein Schall aus einem Grundton und mehreren Obertönen, wie ihn ein Instrument erzeugt?', 'b_klang'),
    Q('k6_energieform', 1, 'Welche Energieform besitzt ein Ball, weil er rollt?', 'b_bewegungsenergie'),
    Q('k6_hoehe', 1, 'Welche Energieform besitzt ein Stein, den man auf einen Tisch gehoben hat?', 'b_hoehenenergie'),
    Q('k6_kette', 2, 'Wie heißt die Darstellung, die zeigt, über welche Stationen Energie von der Sonne bis zur Lampe gelangt?', 'b_energiekette'),
    // Geräte
    Q('k6_lochkamera', 1, 'Welches einfache Gerät erzeugt durch ein kleines Loch ein umgekehrtes Bild?', 'd_lochkamera'),
    Q('k6_sammellinse', 1, 'Welche Linse ist in der Mitte dicker als am Rand?', 'd_sammellinse'),
    Q('k6_zerstreuung', 2, 'Welche Linse korrigiert Kurzsichtigkeit?', 'd_zerstreuungslinse'),
    Q('k6_woelb', 2, 'Welcher Spiegel hängt an unübersichtlichen Kreuzungen, weil er einen großen Bereich zeigt?', 'd_woelbspiegel'),
    Q('k6_stimmgabel', 1, 'Mit welchem Gerät erzeugt man einen fast reinen Ton, etwa den Kammerton a¹ mit 440 Hz?', 'd_stimmgabel'),
    Q('k6_echolot', 2, 'Mit welchem Gerät messen Schiffe die Wassertiefe über die Laufzeit von Schall?', 'd_echolot'),
    // Phänomene, Gesetze
    Q('k6_brechung', 1, 'Wie heißt es, wenn ein Stab im Wasser geknickt aussieht, weil Licht seine Richtung ändert?', 'p_brechung'),
    Q('k6_sofi', 1, 'Wie heißt das Ereignis, bei dem der Mond die Sonne verdeckt?', 'p_sonnenfinsternis'),
    Q('k6_mofi', 2, 'Wie heißt das Ereignis, bei dem der Mond durch den Schatten der Erde wandert?', 'p_mondfinsternis'),
    Q('k6_mondphasen', 1, 'Wie nennt man die wechselnden Lichtgestalten des Mondes, etwa Neumond und Vollmond?', 'p_mondphasen'),
    Q('k6_echo', 1, 'Wie heißt reflektierter Schall, den man getrennt vom Original hört?', 'p_echo'),
    Q('k6_totalreflexion', 3, 'Mit welchem Effekt leiten Glasfasern Licht fast verlustfrei über weite Strecken?', 'totalreflexion'),
    Q('k6_ausbreitung', 1, 'Welche Eigenschaft des Lichts erklärt, dass hinter undurchsichtigen Körpern Schatten entstehen?', 'g_lichtausbreitung'),
    Q('k6_reflexion', 2, 'Welches Gesetz besagt, dass Einfallswinkel und Reflexionswinkel gleich groß sind?', 'reflexionsgesetz'),
    // Einheiten, Konstanten, Personen, Experimente
    Q('k6_hertz', 1, 'In welcher Einheit gibt man Frequenzen an?', 'u_hertz'),
    Q('k6_dezibel', 2, 'In welcher Einheit misst man den Schallpegel?', 'u_dezibel'),
    Q('k6_schall', 2, 'Wie schnell breitet sich Schall in Luft aus? (Zahl mit Einheit)', 'schallgeschwindigkeit', true),
    Q('k6_licht', 3, 'Wie schnell ist Licht? (Zahl mit Einheit)', 'lichtgeschwindigkeit', true),
    Q('k6_newton', 2, 'Wer zeigte mit einem Prisma, dass weißes Licht aus Farben besteht?', 'newton'),
    Q('k6_muenze', 1, 'Bei welchem Versuch taucht eine verdeckte Münze auf, wenn man Wasser in die Tasse gießt?', 'e_muenze'),
    Q('k6_farbscheibe', 2, 'Welche drehende Scheibe zeigt, dass Spektralfarben zusammen Weiß ergeben?', 'e_farbscheibe'),
  ],
  // Schätzfragen (Issue #46)
  schaetzen: [
    ...ausFreiListe(6, 1, 's_sonnenlicht s_mondlicht s_donner s_mond_abstand s_mond_umlauf'),
    ...ausFreiListe(6, 2, 's_erde_sonne s_sonne_erden'),
    ...ausFreiListe(6, 3, 's_gruenes_licht'),
    SZ('k6_s_kammerton', 2, 'mechanik', 'Wie oft pro Sekunde schwingt die Luft beim Kammerton a, nach dem Orchester stimmen?', 440, 'Hz',
      { min: 10, max: 1e6, bezug: ['u_hertz'],
        erklaerung: 'Der Kammerton a schwingt 440-mal pro Sekunde. Danach stimmen Orchester ihre Instrumente.',
        quelle: 'ISO 16 (Kammerton a¹ = 440 Hz)' }),
    SZ('k6_s_echo', 1, 'mechanik', 'Du rufst gegen eine Felswand und hörst die Antwort nach 2 s. Wie viele Meter ist die Wand entfernt?', 343, 'm',
      { min: 1, max: 1e6, bezugWert: ['schallgeschwindigkeit'],
        erklaerung: 'Der Ruf muss hin und zurück, also braucht er für jeden Weg 1 s. In einer Sekunde kommt er in Luft rund 340 m weit.',
        quelle: 'Schall in Luft bei 20 °C, 343 m/s' }),
  ],
};
