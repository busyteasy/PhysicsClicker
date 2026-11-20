// Schätzfragen für das freie Spiel (Issue #46). Format und Regeln:
//
//   S(id, stufe, gebiet, frage, wert, einheit, optionen)
//     id        eindeutig, a-z 0-9 _, Präfix s_
//     stufe     1–4 (bestimmt die Punkte: TIER_POINTS × SCHAETZ_FACTOR)
//     gebiet    'mechanik' | 'optik' | 'waerme' | 'elektro' | 'astro' | 'quanten' | 'relativ' | 'kern'
//     frage     Fragetext – nennt er Einträge der Wissensdatenbank, gehören sie in `bezug`
//     wert      echter Wert, als Zahl in `einheit`
//     einheit   Symbol, das hinter Regler und Zahl steht
//     optionen  min, max         Reglerbereich
//               skala            'log' (Standard) oder 'linear' (z. B. °C)
//               toleranz         nur linear: Abweichung für „Volltreffer“
//               bezug            Einträge, die man entdeckt haben muss (Namen im Text)
//               bezugWert        Konstanten, deren Wert man kennen muss, weil sich
//                                der Wert daraus berechnen lässt (Spoiler-Schutz)
//               erklaerung       1–2 Sätze mit Rechenweg oder Faustregel
//               quelle           Beleg für den Wert (wird nicht angezeigt)
//
// `test/schaetzen.test.js` prüft Spoiler-Schutz, faire Reglerbereiche und das
// Punktebudget. Werte vor dem Eintragen gegen die Quelle prüfen.

export const S = (id, tier, gebiet, frage, wert, einheit, o) => ({
  id, tier, gebiet, frage, wert, einheit,
  min: o.min, max: o.max, skala: o.skala ?? 'log', toleranz: o.toleranz ?? null,
  bezug: o.bezug ?? [], bezugWert: o.bezugWert ?? [],
  erklaerung: o.erklaerung, quelle: o.quelle,
});

export default [
  // Mechanik
  S('s_donner', 1, 'mechanik', 'Wie lange braucht der Donner für einen Kilometer?', 2.9, 's', {
    min: 0.01, max: 100, bezugWert: ['schallgeschwindigkeit'],
    erklaerung: 'Bei rund 343 m/s knapp 3 s. Faustregel: Zeit in s zwischen Aufleuchten und Donner durch 3 ergibt die Entfernung in km.',
    quelle: '1000 m / 343 m/s = 2,92 s (20 °C)',
  }),
  S('s_50kmh', 1, 'mechanik', 'Wie weit kommt ein Auto bei 50 km/h in 1 s?', 13.9, 'm', {
    min: 0.1, max: 10_000, bezug: ['u_km_h'],
    erklaerung: 'Durch 3,6 teilen: 50 km/h sind knapp 14 m/s – so weit fährt man schon, bevor man überhaupt reagiert.',
    quelle: '50 / 3,6 = 13,89',
  }),
  S('s_flugzeug', 1, 'mechanik', 'Wie schnell fliegt ein Verkehrsflugzeug in Reiseflughöhe?', 900, 'km/h', {
    min: 10, max: 1_000_000, bezug: ['u_km_h'],
    erklaerung: 'Rund 900 km/h, je nach Typ 800 bis 950 km/h – in gut einer Stunde von Hamburg nach München.',
    quelle: 'Typische Reisegeschwindigkeit Airbus A320/Boeing 737: 830–900 km/h',
  }),
  S('s_sprinter', 1, 'mechanik', 'Wie schnell ist der 100-m-Weltrekordläufer im Durchschnitt?', 37.6, 'km/h', {
    min: 0.1, max: 10_000_000, bezug: ['u_km_h'],
    erklaerung: '100 m in 9,58 s sind 10,4 m/s, also rund 38 km/h – in der Spitze sogar über 44 km/h.',
    quelle: 'Usain Bolt 2009: 100 m in 9,58 s → 37,58 km/h',
  }),
  S('s_fahrrad', 1, 'mechanik', 'Wie schnell fährt man gemütlich mit dem Fahrrad?', 15, 'km/h', {
    min: 0.01, max: 100_000, bezug: ['u_km_h'],
    erklaerung: 'Gemütlich etwa 15 km/h – rund viermal so schnell wie zu Fuß.',
    quelle: 'Übliche Reisegeschwindigkeit Alltagsradverkehr 12–18 km/h',
  }),
  S('s_fall_45m', 2, 'mechanik', 'Wie lange fällt ein Stein aus 45 m Höhe, wenn die Luft ihn nicht bremst?', 3.0, 's', {
    min: 0.01, max: 100, bezugWert: ['erdbeschleunigung'],
    erklaerung: 'Rund 3 s. Gut zu merken: In 1, 2 und 3 s fällt man 5 m, 20 m und 45 m – die Strecke wächst mit dem Quadrat der Zeit.',
    quelle: '√(2·45/9,81) = 3,03 s',
  }),
  S('s_luft_liter', 2, 'mechanik', 'Wie viel wiegt die Luft in einer 1-l-Flasche auf Meereshöhe?', 1.2, 'g', {
    min: 0.01, max: 10_000,
    erklaerung: 'Etwa 1,2 g – Luft ist rund 800-mal leichter als Wasser, aber die Luft in einem Klassenzimmer wiegt trotzdem über 200 kg.',
    quelle: 'Luftdichte bei 20 °C und 1013 hPa: 1,204 kg/m³',
  }),
  S('s_wasser_100m', 2, 'mechanik', 'Wie viel bar kommen in 100 m Meerestiefe durch das Wasser zusätzlich dazu?', 9.8, 'bar', {
    min: 0.001, max: 1_000_000, bezug: ['u_bar'], bezugWert: ['erdbeschleunigung', 'k_dichte_wasser'],
    erklaerung: 'Alle 10 m Wasser kommt etwa 1 bar dazu – in 100 m also rund 10 bar.',
    quelle: 'ρ·g·h = 1000 · 9,81 · 100 Pa = 9,81 bar',
  }),
  S('s_mondwaage', 2, 'mechanik', 'Eine Personenwaage zeigt auf der Erde 60 kg an. Was zeigt sie auf dem Mond?', 10, 'kg', {
    min: 0.01, max: 100_000, bezug: ['b_mond', 'b_erde'], bezugWert: ['k_ortsfaktor_mond'],
    erklaerung: 'Rund 10 kg: Dort zieht der Mond nur etwa ein Sechstel so stark. Der Körper selbst ist natürlich nicht leichter geworden.',
    quelle: '60 kg · 1,62 / 9,81 = 9,9 kg',
  }),
  S('s_eiffelturm', 2, 'mechanik', 'Um wie viele Zentimeter wird der Eiffelturm an einem heißen Sommertag höher als im Winter?', 15, 'cm', {
    min: 0.0001, max: 100_000,
    erklaerung: 'Rund 15 cm: Stahl wird pro m und Grad etwa 0,012 mm länger – bei 324 m Höhe und rund 40 Grad Unterschied läppert sich das.',
    quelle: '324 m · 1,2·10⁻⁵ /K · 40 K ≈ 15,6 cm; Angabe der Société d’Exploitation de la Tour Eiffel: bis zu 15 cm',
  }),
  S('s_pendel_1m', 2, 'mechanik', 'Wie lange dauert eine volle Hin- und Herschwingung eines 1 m langen Fadenpendels?', 2.0, 's', {
    min: 0.01, max: 100, bezug: ['b_fadenpendel', 'b_pendel'], bezugWert: ['erdbeschleunigung'],
    erklaerung: 'Rund 2 s – jeder einzelne Ausschlag dauert also etwa 1 s. Die Dauer hängt nur von der Länge ab, nicht vom Gewicht.',
    quelle: '2π·√(1/9,81) = 2,006 s',
  }),

  // Optik
  S('s_sonnenlicht', 1, 'optik', 'Wie viele Minuten braucht Licht von der Sonne bis zur Erde?', 8.3, 'min', {
    min: 0.01, max: 1000, bezug: ['b_licht', 'b_sonne', 'b_erde'], bezugWert: ['lichtgeschwindigkeit'],
    erklaerung: 'Rund 8 min 20 s: 150 Millionen km geteilt durch 300 000 km/s.',
    quelle: '1 AE / c = 499 s = 8,32 min',
  }),
  S('s_mondlicht', 1, 'optik', 'Wie lange braucht Licht vom Mond bis zur Erde?', 1.3, 's', {
    min: 0.0001, max: 10, bezug: ['b_licht', 'b_mond', 'b_erde'], bezugWert: ['lichtgeschwindigkeit'],
    erklaerung: 'Gut 1 s – 384 400 km bei 300 000 km/s.',
    quelle: '384 400 km / 299 792 km/s = 1,28 s',
  }),
  S('s_licht_meter', 2, 'optik', 'Wie lange braucht Licht für 1 m?', 3.3, 'ns', {
    min: 0.001, max: 1000, bezug: ['b_licht'], bezugWert: ['lichtgeschwindigkeit'],
    erklaerung: 'Gut 3 ns – deshalb müssen Leiterbahnen in schnellen Computern so kurz sein.',
    quelle: '1 m / 299 792 458 m/s = 3,34 ns',
  }),
  S('s_gruenes_licht', 2, 'optik', 'Welche Wellenlänge hat grünes Licht?', 530, 'nm', {
    min: 0.1, max: 100_000, bezug: ['b_licht', 'b_wellenlaenge'],
    erklaerung: 'Rund 530 nm. Sichtbar ist nur der schmale Bereich von etwa 380 nm (violett) bis 780 nm (rot).',
    quelle: 'Grün: etwa 495–570 nm; 530 nm typisch für grüne LEDs',
  }),

  // Wärme
  S('s_wasser_1grad', 2, 'waerme', 'Wie viele J braucht man, um 1 l Wasser um 1 °C wärmer zu machen?', 4190, 'J', {
    min: 1, max: 1_000_000, bezugWert: ['k_c_wasser'],
    erklaerung: 'Rund 4,2 kJ – Wasser heizt sich nur langsam auf und kühlt langsam ab. Darum mildern Meere das Klima.',
    quelle: 'c(Wasser) = 4,19 kJ/(kg·K), 1 L ≈ 1 kg',
  }),
  S('s_zugspitze', 3, 'waerme', 'Bei wie viel °C siedet Wasser auf der Zugspitze (2962 m)?', 90, '°C', {
    min: -50, max: 150, skala: 'linear', toleranz: 2, bezugWert: ['k_siede_wasser'],
    erklaerung: 'Bei etwa 90 °C: Oben lastet nur gut 70 % so viel Luft auf dem Wasser wie am Meer – dann kocht es schon früher. Nudeln brauchen dort länger.',
    quelle: 'Luftdruck Zugspitze ≈ 700 hPa → Siedepunkt ≈ 90 °C',
  }),
  S('s_kerze', 2, 'waerme', 'Wie heiß wird der heißeste Teil einer Kerzenflamme?', 1400, '°C', {
    min: 10, max: 1_000_000,
    erklaerung: 'Bis etwa 1400 °C im äußeren, fast unsichtbaren Saum – der leuchtende gelbe Teil ist kühler.',
    quelle: 'Flammentemperatur Kerze: 1200–1400 °C',
  }),
  S('s_mensch_waerme', 2, 'waerme', 'Wie viel W Abwärme gibt ein ruhender Mensch ab?', 100, 'W', {
    min: 0.01, max: 100_000,
    erklaerung: 'Etwa 100 W – so viel wie eine alte 100-W-Lampe. Ein voller Hörsaal heizt sich deshalb ganz von selbst.',
    quelle: 'Grundumsatz ≈ 7–8 MJ/Tag ≈ 80–100 W',
  }),
  S('s_blitz_temp', 2, 'waerme', 'Wie heiß wird die Luft in einem Blitzkanal?', 30_000, '°C', {
    min: 10, max: 1_000_000_000,
    erklaerung: 'Rund 30 000 °C, fünfmal so heiß wie die Sonnenoberfläche. Die Luft dehnt sich explosionsartig aus – das hört man als Donner.',
    quelle: 'Blitzkanal kurzzeitig ≈ 30 000 K',
  }),
  S('s_sonne_oberflaeche', 3, 'waerme', 'Wie heiß ist die Oberfläche der Sonne?', 5800, 'K', {
    min: 100, max: 10_000_000, bezug: ['b_sonne', 'b_licht'],
    erklaerung: 'Rund 5800 K. Das liest man aus der Farbe ihres Lichts ab: Je heißer ein Körper, desto weiter ins Blaue verschiebt sich sein Strahlungsmaximum.',
    quelle: 'Effektive Temperatur der Sonne 5772 K (IAU)',
  }),

  // Elektrizität
  S('s_steckdose', 1, 'elektro', 'Wie viel V liegen an einer Haushaltssteckdose in Deutschland an?', 230, 'V', {
    min: 0.1, max: 100_000,
    erklaerung: '230 V mit 50 Hz – in den USA sind es nur 120 V.',
    quelle: 'Nennspannung Niederspannungsnetz EU: 230 V (DIN EN 60038)',
  }),
  S('s_aa_batterie', 1, 'elektro', 'Wie viel V hat eine frische AA-Zelle (Mignon)?', 1.5, 'V', {
    min: 0.0001, max: 1000,
    erklaerung: '1,5 V – ein 9-V-Block enthält innen sechs solche Zellen hintereinander.',
    quelle: 'Alkali-Mangan-Zelle: Nennspannung 1,5 V',
  }),
  S('s_wasserkocher', 1, 'elektro', 'Wie viel W hat ein typischer Wasserkocher?', 2000, 'W', {
    min: 0.01, max: 10_000_000,
    erklaerung: 'Rund 2000 W – mit das Stärkste im Haushalt. Darum kocht 1 l in knapp drei Minuten.',
    quelle: 'Handelsübliche Wasserkocher 1800–2200 W',
  }),
  S('s_handyakku', 2, 'elektro', 'Wie viele Wh speichert ein typisches Smartphone?', 15, 'Wh', {
    min: 0.01, max: 100_000,
    erklaerung: 'Etwa 15 Wh (4000 mAh bei 3,85 V). Damit könnte ein Wasserkocher nur rund 27 s laufen.',
    quelle: '4000 mAh · 3,85 V = 15,4 Wh',
  }),
  S('s_blitz_strom', 2, 'elektro', 'Wie viele A fließen in einem typischen Blitz?', 30_000, 'A', {
    min: 0.01, max: 1_000_000_000, bezug: ['blitz'],
    erklaerung: 'Rund 30 000 A, manchmal über 100 000 A – aber nur für einen winzigen Augenblick.',
    quelle: 'Median Erstblitz-Spitzenstrom ≈ 30 kA (Berger 1975)',
  }),
  S('s_elektronen_1a', 2, 'elektro', 'Wie viele Elektronen fließen pro s durch einen Draht bei 1 A?', 6.2e18, '', {
    min: 100_000, max: 1e30, bezug: ['elektron'], bezugWert: ['elementarladung'],
    erklaerung: 'Rund 6 Trillionen – so viele Elementarladungen ergeben zusammen 1 A über 1 s.',
    quelle: '1 C / 1,602·10⁻¹⁹ C = 6,24·10¹⁸',
  }),

  // Astronomie
  S('s_mond_abstand', 1, 'astro', 'Wie viele Kilometer ist der Mond im Mittel von der Erde entfernt?', 384_400, 'km', {
    min: 1000, max: 10_000_000, bezug: ['b_mond', 'b_erde'],
    erklaerung: 'Rund 384 000 km – etwa 30 Erddurchmesser hintereinander.',
    quelle: 'Mittlere Entfernung Erde–Mond 384 400 km (NASA)',
  }),
  S('s_erde_sonne', 1, 'astro', 'Wie viele Kilometer ist die Erde von der Sonne entfernt?', 1.5e8, 'km', {
    min: 100_000, max: 1e12, bezug: ['b_erde', 'b_sonne'],
    erklaerung: 'Rund 150 Millionen km – so groß, dass die Astronomie daraus eine eigene Maßeinheit gemacht hat.',
    quelle: '1 AE = 149 597 871 km',
  }),
  S('s_mond_umlauf', 1, 'astro', 'Wie viele Tage braucht der Mond für eine Runde um die Erde (gemessen am Fixsternhimmel)?', 27.3, 'Tage', {
    min: 0.1, max: 10_000_000, bezug: ['b_mond', 'b_erde'],
    erklaerung: '27,3 Tage. Von einer vollen Mondscheibe bis zur nächsten sind es 29,5 Tage, weil die Erde inzwischen ein Stück weitergezogen ist.',
    quelle: 'Siderischer Monat 27,32 d',
  }),
  S('s_iss', 2, 'astro', 'Wie schnell fliegt die ISS um die Erde?', 27_600, 'km/h', {
    min: 10, max: 10_000_000, bezug: ['b_erde', 'u_km_h'],
    erklaerung: 'Rund 27 600 km/h – sie umrundet die Erde in 92 Minuten, die Crew sieht 16 Sonnenaufgänge am Tag.',
    quelle: 'ISS ≈ 7,66 km/s = 27 600 km/h (NASA)',
  }),
  S('s_aequator', 2, 'astro', 'Wie schnell bewegt sich ein Punkt am Äquator durch die Drehung der Erde?', 1670, 'km/h', {
    min: 1, max: 100_000, bezug: ['b_erde', 'u_km_h'],
    erklaerung: 'Rund 1670 km/h: 40 000 km Umfang in knapp 24 Stunden. Wir merken nichts davon, weil alles mitfliegt.',
    quelle: '40 075 km / 23,93 h = 1674 km/h',
  }),
  S('s_sonne_erden', 2, 'astro', 'Wie viele Erdkugeln passen ungefähr in die Sonne?', 1.3e6, '', {
    min: 1, max: 1e15, bezug: ['b_sonne'],
    erklaerung: 'Rund 1,3 Millionen: Der Sonnenradius ist gut 109-mal so groß, das Volumen also 109³-mal.',
    quelle: '(696 000 / 6371)³ = 1,30·10⁶',
  }),
  S('s_universum', 2, 'astro', 'Wie viele Milliarden Jahre ist das Universum alt?', 13.8, 'Mrd. Jahre', {
    min: 0.001, max: 1_000_000, bezugWert: ['hubble_k'],
    erklaerung: 'Rund 13,8 Milliarden Jahre – das zeigt die Ausdehnung des Alls, wenn man sie zurückrechnet.',
    quelle: 'Planck-Kollaboration 2018: 13,787 Mrd. Jahre',
  }),

  // Quanten, Kern, Relativität
  S('s_atom_groesse', 2, 'quanten', 'Wie viele Nanometer misst ein Wasserstoffatom im Durchmesser?', 0.1, 'nm', {
    min: 0.000001, max: 100_000, bezugWert: ['bohr_radius'],
    erklaerung: 'Rund 0,1 nm. Zehn Millionen davon nebeneinander ergäben gerade 1 mm.',
    quelle: '2 · Bohrscher Radius = 0,106 nm',
  }),
  S('s_c14', 2, 'kern', 'Nach wie vielen Jahren ist die Hälfte des Kohlenstoff-14 in einem Knochen zerfallen?', 5730, 'Jahre', {
    min: 1, max: 1_000_000_000,
    erklaerung: 'Nach rund 5730 Jahren – darum eignet sich C-14 zum Datieren von Funden bis etwa 50 000 Jahre.',
    quelle: 'Halbwertszeit C-14: 5730 ± 40 a',
  }),
  S('s_kernkraftwerk', 2, 'kern', 'Wie viele MW liefert ein großer Kernkraftwerksblock ins Stromnetz?', 1400, 'MW', {
    min: 0.01, max: 10_000_000,
    erklaerung: 'Rund 1400 MW – genug für mehrere Millionen Haushalte. Etwa doppelt so viel geht als Abwärme über die Kühltürme verloren.',
    quelle: 'Deutsche Konvoi-Anlagen (z. B. Isar 2): ≈ 1400–1500 MW elektrisch',
  }),
  S('s_mensch_atome', 2, 'kern', 'Wie viele Atome stecken in einem erwachsenen Menschen?', 7e27, '', {
    min: 1e10, max: 1e40, bezug: ['atom'],
    erklaerung: 'Rund 7·10²⁷ – zwei Drittel davon sind Wasserstoffatome.',
    quelle: '70 kg Mensch ≈ 7·10²⁷ Atome',
  }),
  S('s_schluck_wasser', 3, 'kern', 'Wie viele Wassermoleküle stecken in einem Schluck Wasser (20 ml)?', 6.7e23, '', {
    min: 1e10, max: 1e40, bezugWert: ['avogadro'],
    erklaerung: '20 g Wasser sind gut 1,1 Mol, also rund 6,7·10²³ Moleküle – mehr als es Sandkörner an allen Stränden gibt.',
    quelle: '20 g / 18 g/mol · 6,022·10²³ /mol = 6,7·10²³',
  }),
  S('s_gps', 3, 'relativ', 'Um wie viele Mikrosekunden pro Tag gehen GPS-Uhren gegenüber Uhren am Boden vor?', 38, 'µs', {
    min: 0.0001, max: 1_000_000,
    erklaerung: 'Rund 38 µs: Die schwächere Anziehung lässt sie 45 µs schneller laufen, das Tempo 7 µs langsamer. Unkorrigiert läge die Ortung nach einem Tag 10 km daneben.',
    quelle: 'Allgemeine (+45,9 µs) und spezielle (−7,2 µs) Relativitätstheorie: +38,6 µs/Tag',
  }),
];
