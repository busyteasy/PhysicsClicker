// Klasse 5 – Doppeljahrgang 5/6, erster Teil: Magnetismus und Elektrizität,
// Temperatur und Wärme (Teilchenmodell, Aggregatzustände).
import { Q, QUELLE_SI, S } from './helpers.js';

export default {
  klasse: 5,
  themen: ['Magnetismus', 'Einfache Stromkreise', 'Temperatur und Wärme', 'Aggregatzustände und Teilchenmodell'],
  quelle: `${QUELLE_SI}, Themenbereich Magnetismus und Elektrizität (Doppeljahrgang 5/6); Temperatur und Wärme nach Anhang A3`,
  eintraege: {
    // Größen & Begriffe
    ...S(1, 'b_nordpol b_suedpol b_magnetfeld b_feldlinien b_magnetisch b_erdmagnetfeld b_stromkreis b_leiter b_isolator b_kurzschluss b_reihe b_parallel b_temperatur b_celsius_skala b_teilchenmodell b_schmelzen b_erstarren b_verdampfen b_kondensieren b_waermeleiter'),
    ...S(2, 'b_elementarmagnete b_magnetisieren b_schaltplan b_spannung b_waermeausdehnung b_schmelztemperatur b_siedetemperatur b_verdunsten b_waermedaemmung b_energie b_waerme b_treibhausgas b_klimawandel'),
    ...S(3, 'b_und b_oder b_wechselschaltung b_wassermodell b_sublimieren b_resublimieren b_schutzleiter b_energieuebertragung'),
    // Geräte & Bauteile
    ...S(1, 'd_kompass d_dauermagnet d_batterie d_gluehlampe d_schalter d_thermometer'),
    ...S(2, 'd_hufeisenmagnet d_elektromagnet d_spule d_sicherung d_bimetall d_thermoskanne d_led'),
    ...S(3, 'd_klingel d_relais d_fi'),
    // Phänomene
    ...S(1, 'aggregatzustand waermeleitung konvektion waermestrahlung p_waermewirkung p_magnetwirkung p_lichtwirkung'),
    ...S(2, 'p_verdunstungskaelte p_treibhauseffekt brownsche'),
    ...S(3, 'p_anomalie nullpunkt ferromagnetismus'),
    // Einheiten
    ...S(1, 'u_grad_celsius u_meter u_sekunde u_kilogramm'),
    ...S(2, 'u_volt'),
    ...S(3, 'u_kelvin'),
    // Personen
    ...S(2, 'celsius volta'),
    ...S(3, 'oersted w_gilbert fahrenheit'),
    // Experimente
    ...S(1, 'e_eisenfeilspaene e_kugel_ring'),
    ...S(2, 'e_tinte e_zitrone'),
    ...S(3, 'oersted_versuch'),
  },
  fragen: [
    // Begriffe
    Q('k5_pole', 1, 'Wie heißt der Pol eines Magneten, der sich nach Norden ausrichtet?', 'b_nordpol'),
    Q('k5_feld', 1, 'Wie nennt man den Raum um einen Magneten, in dem magnetische Kräfte wirken?', 'b_magnetfeld'),
    Q('k5_feldlinien', 1, 'Was macht man mit Eisenfeilspänen um einen Magneten sichtbar?', 'b_feldlinien'),
    Q('k5_elementar', 2, 'Mit welchem Modell erklärt man, warum ein Eisennagel durch Streichen magnetisch wird?', 'b_elementarmagnete'),
    Q('k5_kreis', 1, 'Was muss geschlossen sein, damit eine Lampe an einer Batterie leuchtet?', 'b_stromkreis'),
    Q('k5_isolator', 1, 'Wie heißt ein Stoff, der den elektrischen Strom nicht leitet, zum Beispiel Kunststoff?', 'b_isolator'),
    Q('k5_reihe', 2, 'Wie heißt die Schaltung, bei der alle Lampen ausgehen, wenn eine kaputtgeht?', 'b_reihe'),
    Q('k5_parallel', 2, 'In welcher Schaltung sind die Steckdosen im Haus angeschlossen?', 'b_parallel'),
    Q('k5_kurzschluss', 2, 'Wie nennt man es, wenn der Strom ohne Verbraucher direkt von Pol zu Pol fließt?', 'b_kurzschluss'),
    Q('k5_und', 3, 'Welche Schaltung mit zwei Schaltern lässt die Lampe nur leuchten, wenn beide geschlossen sind?', 'b_und'),
    Q('k5_wechsel', 3, 'Welche Schaltung braucht man, um eine Flurlampe von zwei Stellen aus zu schalten?', 'b_wechselschaltung'),
    Q('k5_teilchen', 1, 'Mit welchem Modell erklärt man, dass sich Stoffe beim Erwärmen ausdehnen?', 'b_teilchenmodell'),
    Q('k5_schmelzen', 1, 'Wie heißt der Übergang von fest zu flüssig?', 'b_schmelzen'),
    Q('k5_kondensieren', 2, 'Wie heißt der Übergang von gasförmig zu flüssig, etwa wenn ein Spiegel beschlägt?', 'b_kondensieren'),
    Q('k5_sublimieren', 3, 'Wie heißt der direkte Übergang von fest zu gasförmig?', 'b_sublimieren'),
    Q('k5_resublimieren', 3, 'Durch welchen Übergang entsteht Raureif direkt aus Wasserdampf?', 'b_resublimieren'),
    Q('k5_siede', 2, 'Wie heißt die Temperatur, bei der eine Flüssigkeit zu sieden beginnt?', 'b_siedetemperatur'),
    Q('k5_daemmung', 2, 'Wie nennt man Maßnahmen, mit denen ein Haus im Winter weniger Wärme verliert?', 'b_waermedaemmung'),
    // Geräte
    Q('k5_kompass', 1, 'Mit welchem Gerät findet man mithilfe einer Magnetnadel die Nordrichtung?', 'd_kompass'),
    Q('k5_elektromagnet', 2, 'Wie heißt ein Magnet, der nur magnetisch ist, solange Strom durch seine Spule fließt?', 'd_elektromagnet'),
    Q('k5_sicherung', 2, 'Welches Bauteil unterbricht den Stromkreis, bevor Leitungen gefährlich heiß werden?', 'd_sicherung'),
    Q('k5_bimetall', 2, 'Welcher Streifen aus zwei Metallen verbiegt sich beim Erwärmen und schaltet so einen Toaster ab?', 'd_bimetall'),
    Q('k5_thermoskanne', 2, 'Welches Gefäß hält Getränke durch Vakuum und Verspiegelung lange warm?', 'd_thermoskanne'),
    Q('k5_thermometer', 1, 'Mit welchem Gerät misst man die Temperatur?', 'd_thermometer'),
    // Phänomene
    Q('k5_leitung', 1, 'Wie heißt die Wärmeübertragung, bei der ein Metalllöffel im heißen Tee am Griff warm wird?', 'waermeleitung'),
    Q('k5_konvektion', 2, 'Wie heißt die Wärmeübertragung, bei der warme Luft über der Heizung nach oben steigt?', 'konvektion'),
    Q('k5_strahlung', 2, 'Auf welche Weise gelangt die Wärme der Sonne durch den leeren Weltraum zu uns?', 'waermestrahlung'),
    Q('k5_waermewirkung', 1, 'Welche Wirkung des elektrischen Stroms nutzt ein Wasserkocher?', 'p_waermewirkung'),
    Q('k5_kaelte', 2, 'Warum kühlt Schwitzen den Körper? Gesucht ist der Fachbegriff.', 'p_verdunstungskaelte'),
    Q('k5_anomalie', 3, 'Wie heißt die Besonderheit, dass Wasser bei 4 °C seine größte Dichte hat?', 'p_anomalie'),
    Q('k5_treibhaus', 2, 'Welcher Effekt hält die Erde durch Gase wie Kohlenstoffdioxid wärmer?', 'p_treibhauseffekt'),
    // Einheiten, Personen, Experimente
    Q('k5_volt', 2, 'In welcher Einheit gibt man die Spannung einer Batterie an?', 'u_volt'),
    Q('k5_kelvin', 3, 'In welcher Einheit misst man Temperaturen, wenn die Skala am absoluten Nullpunkt beginnt?', 'u_kelvin'),
    Q('k5_celsius', 2, 'Nach welchem schwedischen Astronomen ist unsere Temperaturskala benannt?', 'celsius'),
    Q('k5_oersted', 3, 'Wer entdeckte 1820, dass ein stromdurchflossener Draht eine Kompassnadel ablenkt?', 'oersted'),
    Q('k5_kugel', 1, 'Bei welchem Versuch passt eine erhitzte Metallkugel nicht mehr durch einen Ring?', 'e_kugel_ring'),
    Q('k5_tinte', 2, 'Welcher Versuch zeigt, dass sich Teilchen in warmem Wasser schneller bewegen?', 'e_tinte'),
  ],
};
