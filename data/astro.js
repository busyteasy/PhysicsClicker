import { E, F, G, K, P, U, W, inArea } from './helpers.js';

export default inArea('astro', [
  G('kepler1', 2, 'Erstes Keplersches Gesetz', ['1. keplersches Gesetz', 'erstes Kepler-Gesetz', 'Ellipsensatz'], 'Planeten laufen auf Ellipsen, in deren einem Brennpunkt die Sonne steht.'),
  G('kepler2', 2, 'Zweites Keplersches Gesetz', ['2. keplersches Gesetz', 'zweites Kepler-Gesetz', 'Flächensatz'], 'In gleichen Zeiten überstreicht der Fahrstrahl gleiche Flächen.'),
  G('kepler3', 2, 'Drittes Keplersches Gesetz', ['3. keplersches Gesetz', 'drittes Kepler-Gesetz'], 'Die Quadrate der Umlaufzeiten verhalten sich wie die Kuben der großen Halbachsen.'),
  G('hubble_gesetz', 3, 'Hubble-Lemaître-Gesetz', ['Hubble-Gesetz', 'hubblesches Gesetz'], 'Je weiter eine Galaxie entfernt ist, desto schneller entfernt sie sich.'),

  F('kepler3_f', 3, 'T²/a³ = konstant', ['T^2/a^3=const', 'T^2~a^3', 'T^2∝a^3', 'T1^2/T2^2=a1^3/a2^3'], 'Ein doppelt so weit entfernter Planet braucht 2,8-mal so lange für einen Umlauf.'),
  F('hubble_f', 3, 'v = H₀·d', ['v=H0r'], 'Die Fluchtgeschwindigkeit der Galaxien wächst mit ihrer Entfernung.'),
  F('flucht_f', 3, 'v = √(2GM/r)', ['v=sqrt(2GM/r)', 'v2=sqrt(2GM/r)', 'v=(2GM/r)^(1/2)'], 'Von der Erdoberfläche aus sind das gut 11,2 km/s.'),
  F('kreisbahn_f', 3, 'v = √(GM/r)', ['v=sqrt(GM/r)', 'v1=sqrt(GM/r)'], 'Die Geschwindigkeit für eine Kreisbahn – dicht über der Erde rund 7,9 km/s.'),

  P('schwarzes_loch', 1, 'Schwarzes Loch', ['Schwarze Löcher'], 'Nicht einmal Licht kann ihm entkommen.'),
  P('urknall', 1, 'Urknall', ['Urknalltheorie', 'Big Bang'], 'Vor etwa 13,8 Milliarden Jahren begann das Universum heiß und dicht.'),
  P('dunkle_materie', 2, 'Dunkle Materie', [], 'Es gibt rund fünfmal so viel davon wie sichtbare Materie – und keiner weiß, woraus sie besteht.'),
  P('dunkle_energie', 3, 'Dunkle Energie', [], 'Sie treibt die beschleunigte Expansion des Universums an.'),
  P('supernova', 2, 'Supernova', ['Supernovae'], 'Eine Sternexplosion kann kurzzeitig heller strahlen als eine ganze Galaxie.'),
  P('neutronenstern', 2, 'Neutronenstern', [], 'Ein Teelöffel davon wöge Milliarden Tonnen.'),
  P('pulsar', 3, 'Pulsar', ['Pulsare'], 'Ein rotierender Neutronenstern, dessen Strahl wie ein Leuchtturm über die Erde streicht.'),
  P('weisser_zwerg', 2, 'Weißer Zwerg', ['Weiße Zwerge'], 'So wird unsere Sonne einmal enden.'),
  P('roter_riese', 2, 'Roter Riese', ['Rote Riesen'], 'In etwa 5 Milliarden Jahren bläht sich die Sonne zu einem Roten Riesen auf.'),
  P('cmb', 3, 'Kosmische Hintergrundstrahlung', ['Hintergrundstrahlung', 'CMB', 'Mikrowellenhintergrund', 'kosmischer Mikrowellenhintergrund'], 'Das Nachglühen des Urknalls, heute bei 2,7 Kelvin.'),
  P('rotverschiebung', 2, 'Rotverschiebung', ['kosmologische Rotverschiebung'], 'Das Licht ferner Galaxien ist zu längeren Wellenlängen verschoben.'),
  P('ereignishorizont', 3, 'Ereignishorizont', [], 'Die Grenze, hinter der nichts mehr nach außen dringt.'),
  P('hawking_strahlung', 4, 'Hawking-Strahlung', [], 'Schwarze Löcher verdampfen – nur extrem langsam.'),
  P('gezeiten', 1, 'Gezeiten', ['Ebbe und Flut', 'Gezeitenkraft'], 'Vor allem der Mond zieht unterschiedlich stark an der nahen und der fernen Erdseite.'),
  P('inflation', 4, 'Kosmische Inflation', ['Inflationstheorie'], 'In winzigen Sekundenbruchteilen soll sich das junge Universum enorm aufgebläht haben.'),
  P('quasar', 3, 'Quasar', ['Quasare'], 'Extrem helle Kerne ferner Galaxien, angetrieben von Schwarzen Löchern.'),
  P('chandrasekhar_grenze', 4, 'Chandrasekhar-Grenze', ['Chandrasekhar-Grenzmasse'], 'Über etwa 1,4 Sonnenmassen kann ein Weißer Zwerg nicht stabil bleiben.'),
  P('expansion', 2, 'Expansion des Universums', ['Ausdehnung des Universums'], 'Der Raum selbst dehnt sich aus.'),

  W('kepler_p', 1, 'Johannes Kepler', ['Kepler'], 'Leitete aus Tycho Brahes Beobachtungen die Planetengesetze ab.'),
  W('kopernikus', 1, 'Nikolaus Kopernikus', ['Kopernikus', 'Copernicus'], 'Setzte die Sonne ins Zentrum des Planetensystems.'),
  W('hubble_p', 2, 'Edwin Hubble', ['Hubble'], 'Zeigte 1924, dass es Galaxien jenseits der Milchstraße gibt.'),
  W('hawking', 1, 'Stephen Hawking', ['Hawking'], 'Schrieb mit „Eine kurze Geschichte der Zeit“ einen Weltbestseller.'),
  W('chandrasekhar', 4, 'Subrahmanyan Chandrasekhar', ['Chandrasekhar'], 'Berechnete die Grenzmasse Weißer Zwerge mit 19 Jahren auf der Schiffsreise nach England.'),
  W('lemaitre', 3, 'Georges Lemaître', ['Lemaître'], 'Belgischer Priester und Physiker – ein Vater der Urknalltheorie.'),
  W('brahe', 2, 'Tycho Brahe', ['Brahe', 'Tycho'], 'Vermaß den Himmel ohne Fernrohr genauer als alle vor ihm.'),
  W('herschel', 3, 'Wilhelm Herschel', ['Herschel', 'William Herschel'], 'Entdeckte 1781 den Uranus und später die Infrarotstrahlung.'),
  W('payne', 4, 'Cecilia Payne-Gaposchkin', ['Cecilia Payne', 'Payne-Gaposchkin'], 'Zeigte 1925, dass Sterne überwiegend aus Wasserstoff bestehen.'),

  U('u_lichtjahr', 1, 'Lichtjahr', ['Lichtjahre'], 'Eine Strecke, keine Zeit: rund 9,46 Billionen Kilometer.'),
  U('u_parsec', 2, 'Parsec', ['Parsek'], 'Rund 3,26 Lichtjahre.'),
  U('u_ae', 2, 'Astronomische Einheit', [], 'Der mittlere Abstand zwischen Erde und Sonne, rund 150 Millionen Kilometer.'),

  K('hubble_k', 3, 'Hubble-Konstante', ['Hubble-Parameter'], ['H0', 'H_0'], [[70, ['km/(sMpc)', 'km/s/Mpc', 'km/(Mpcs)'], 0.06]], 'Ihr genauer Wert ist umstritten: Die Messungen liegen zwischen etwa 67 und 73 km/s pro Megaparsec.'),

  E('jupitermonde', 1, 'Galileis Jupitermonde', ['Entdeckung der Jupitermonde', 'galileische Monde'], 'Galilei entdeckte 1610 vier Monde um Jupiter – nicht alles kreist um die Erde.'),
  E('penzias_wilson', 3, 'Entdeckung der Hintergrundstrahlung', ['Penzias und Wilson', 'Penzias-Wilson-Experiment'], 'Arno Penzias und Robert Wilson hielten 1964 das Rauschen ihrer Antenne zuerst für Taubendreck.'),
]);
