import { E, F, G, P, U, W, inArea } from './helpers.js';

export default inArea('optik', [
  F('lichtwelle', 1, 'c = λ·f', ['c=λν'], 'Für jede Welle gilt: Geschwindigkeit gleich Wellenlänge mal Frequenz.'),
  F('brechung_f', 3, 'n₁·sin α = n₂·sin β', ['n1sin(α)=n2sin(β)', 'n1sinθ1=n2sinθ2', 'sinα/sinβ=n2/n1'], 'Licht knickt beim Übergang ins optisch dichtere Medium zum Lot hin ab.'),
  F('linsen_f', 2, '1/f = 1/g + 1/b', ['1/f=1/b+1/g'], 'Die Linsengleichung verknüpft Brennweite, Gegenstands- und Bildweite.'),
  F('brechkraft_f', 1, 'D = 1/f', [], 'Eine Brille mit 2 Dioptrien hat 50 cm Brennweite.'),
  F('brechzahl_f', 2, 'n = c/v', ['n=c0/c'], 'In Diamant ist Licht nur etwa 41 % so schnell wie im Vakuum.'),
  F('massstab_f', 2, 'β = B/G', ['V=B/G'], 'Der Abbildungsmaßstab vergleicht Bild- und Gegenstandsgröße.'),

  G('reflexionsgesetz', 1, 'Reflexionsgesetz', ['Einfallswinkel gleich Ausfallswinkel', 'Einfallswinkel = Ausfallswinkel'], 'Einfallswinkel gleich Reflexionswinkel – das Prinzip jedes Spiegels.'),
  G('snellius', 2, 'Snelliussches Brechungsgesetz', ['Brechungsgesetz', 'Snellius-Gesetz', 'Gesetz von Snellius'], 'Willebrord Snellius fand es um 1621 – veröffentlicht hat er es nie.'),
  G('fermat', 3, 'Fermatsches Prinzip', ['Prinzip von Fermat', 'Fermat-Prinzip', 'Prinzip der kürzesten Zeit'], 'Licht wählt einen Weg mit extremaler – meist kürzester – Laufzeit.'),
  G('huygens_prinzip', 3, 'Huygenssches Prinzip', ['Huygens-Prinzip', 'Huygens-Fresnel-Prinzip'], 'Jeder Punkt einer Wellenfront ist Ausgangspunkt einer neuen Elementarwelle.'),

  P('totalreflexion', 2, 'Totalreflexion', [], 'Sie hält das Licht in Glasfasern gefangen.'),
  P('dispersion', 2, 'Dispersion', [], 'Blaues Licht wird stärker gebrochen als rotes – darum fächert ein Prisma weißes Licht auf.'),
  P('beugung', 2, 'Beugung', ['Diffraktion'], 'Wellen laufen um Hindernisse herum – darum hört man auch um die Ecke.'),
  P('interferenz', 2, 'Interferenz', [], 'Sie erzeugt die schillernden Farben von Seifenblasen und Ölfilmen.'),
  P('polarisation', 2, 'Polarisation', [], 'Polfilter in Sonnenbrillen schlucken spiegelnde Reflexe.'),
  P('regenbogen', 1, 'Regenbogen', [], 'Entsteht durch Brechung und Reflexion in Regentropfen – immer gegenüber der Sonne.'),
  E('doppelspalt', 2, 'Doppelspaltexperiment', ['Doppelspalt', 'Doppelspaltversuch'], 'Thomas Young zeigte damit um 1802 die Wellennatur des Lichts.'),
  P('rayleigh', 3, 'Rayleigh-Streuung', [], 'Kurzwelliges Licht wird stärker gestreut – deshalb ist der Himmel blau.'),
  P('fata_morgana', 2, 'Fata Morgana', ['Luftspiegelung'], 'Heiße Luft über dem Boden bricht das Licht so, dass der Himmel wie Wasser aussieht.'),
  P('brennpunkt', 1, 'Brennpunkt', ['Fokus', 'Brennweite'], 'Parallel einfallendes Licht trifft sich hinter einer Sammellinse im Brennpunkt.'),

  W('huygens', 2, 'Christiaan Huygens', ['Huygens'], 'Entwickelte die Wellentheorie des Lichts und baute die erste Pendeluhr.'),
  W('snellius_p', 3, 'Willebrord Snellius', ['Snellius', 'Snell'], 'Niederländischer Mathematiker und Pionier der Landvermessung durch Triangulation.'),
  W('fresnel', 3, 'Augustin Jean Fresnel', ['Fresnel', 'Augustin Fresnel'], 'Seine Stufenlinsen machten Leuchttürme weithin sichtbar.'),
  W('young', 3, 'Thomas Young', [], 'Half nebenbei, die Hieroglyphen auf dem Stein von Rosetta zu entziffern.'),
  W('alhazen', 3, 'Alhazen', ['Ibn al-Haytham', 'Ibn al-Haitham'], 'Erklärte um das Jahr 1000, dass Licht von den Dingen ins Auge fällt – nicht umgekehrt.'),

  U('u_dioptrie', 2, 'Dioptrie', ['dpt'], 'Eine Dioptrie entspricht einer Brennweite von einem Meter.'),
  U('u_candela', 2, 'Candela', [], 'SI-Einheit der Lichtstärke – ungefähr so hell wie eine Kerze.'),
  U('u_lux', 2, 'Lux', [], 'Ein sonniger Sommertag bringt bis zu 100 000 Lux.'),

  E('prisma', 1, 'Newtons Prismenversuch', ['Prismenversuch', 'Prismenexperiment'], 'Newton zeigte um 1666, dass weißes Licht aus allen Farben des Regenbogens besteht.'),
  E('fizeau', 3, 'Fizeau-Experiment', ['Fizeau-Versuch', 'Zahnradmethode'], 'Hippolyte Fizeau maß 1849 die Lichtgeschwindigkeit mit einem rotierenden Zahnrad und einem Spiegel in acht Kilometern Entfernung.'),
  E('roemer', 3, 'Rømers Lichtgeschwindigkeitsmessung', ['Rømers Messung', 'Römers Messung'], 'Ole Rømer schloss 1676 aus Verspätungen der Verfinsterungen des Jupitermonds Io, dass Licht eine endliche Geschwindigkeit hat.'),

  // Erweiterung (Issue #8)
  U('u_steradiant', 3, 'Steradiant', [], 'Einheit des Raumwinkels – die ganze Kugel hat 4π Steradiant.'),
  U('u_lumen', 2, 'Lumen', [], 'Einheit des Lichtstroms, die auf jeder LED-Packung steht.'),
  W('fraunhofer', 3, 'Joseph von Fraunhofer', ['Fraunhofer'], 'Entdeckte die dunklen Linien im Spektrum der Sonne.'),
  W('abbe', 4, 'Ernst Abbe', ['Abbe'], 'Berechnete die Auflösungsgrenze des Mikroskops und baute mit Carl Zeiss die Jenaer Optik auf.'),
  P('tyndall', 3, 'Tyndall-Effekt', [], 'Darum sieht man Lichtstrahlen im Nebel oder im Staub.'),
]);
