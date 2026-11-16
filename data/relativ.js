import { E, F, G, K, P, W, inArea } from './helpers.js';

export default inArea('relativ', [
  F('emc2', 2, 'E = m·c²', ['m=E/c^2'], 'Schon ein Gramm Masse entspricht rund 25 Millionen Kilowattstunden.'),
  F('zeitdilatation_f', 4, "Δt' = γ·Δt", ["t'=γt", 'Δt=γΔt0', 't=γt0'], 'Bewegte Uhren gehen langsamer.'),
  F('lorentzfaktor', 4, 'γ = 1/√(1 − v²/c²)', ['γ=1/√(1-β^2)', 'γ=(1-v^2/c^2)^(-1/2)', 'γ=(1-v^2/c^2)^-1/2'], 'Bei 87 % der Lichtgeschwindigkeit ist γ rund 2.'),
  F('laengenkontraktion_f', 4, 'L = L₀/γ', ['L=L0√(1-v^2/c^2)'], 'Bewegte Maßstäbe sind in Bewegungsrichtung verkürzt.'),
  F('energie_impuls', 4, 'E² = (p·c)² + (m·c²)²', ['E^2=p^2c^2+m^2c^4', 'E^2=(mc^2)^2+(pc)^2', 'E^2=m^2c^4+p^2c^2'], 'Für ruhende Körper wird daraus E = mc², für Photonen E = pc.'),
  F('schwarzschild_f', 4, 'r_s = 2GM/c²', ['r=2GM/c^2'], 'Die Erde müsste auf etwa 9 mm zusammengepresst werden, um ein Schwarzes Loch zu werden.'),
  F('feldgleichungen_f', 5, 'G_μν = 8πG/c⁴·T_μν', ['Gμν=8πGTμν/c^4', 'Gμν=κTμν', 'Gμν+Λgμν=8πG/c^4Tμν'], 'Nach John Wheeler: Materie krümmt die Raumzeit, und die Raumzeit lenkt die Materie.'),

  G('srt', 2, 'Spezielle Relativitätstheorie', ['SRT'], 'Einstein veröffentlichte sie 1905, in seinem „Wunderjahr“.'),
  G('art', 2, 'Allgemeine Relativitätstheorie', [], '1915 vollendet – sie erklärt die Gravitation als Krümmung der Raumzeit.'),
  G('relativitaetsprinzip', 3, 'Relativitätsprinzip', [], 'Die Naturgesetze sind in allen Inertialsystemen gleich.'),
  G('aequivalenz', 3, 'Äquivalenzprinzip', [], 'Schwere und träge Masse sind gleich – im frei fallenden Aufzug spürt man keine Schwerkraft.'),
  G('konstanz_c', 3, 'Konstanz der Lichtgeschwindigkeit', ['Prinzip der Konstanz der Lichtgeschwindigkeit'], 'Licht ist für jeden Beobachter gleich schnell, egal wie schnell er sich bewegt.'),

  P('zeitdilatation', 2, 'Zeitdilatation', [], 'GPS-Satelliten müssen sie berücksichtigen, sonst läge die Navigation täglich kilometerweit daneben.'),
  P('laengenkontraktion', 2, 'Längenkontraktion', ['Lorentz-Kontraktion'], 'Sie wirkt nur in Bewegungsrichtung und wird erst nahe der Lichtgeschwindigkeit spürbar.'),
  P('zwillingsparadoxon', 2, 'Zwillingsparadoxon', ['Zwillingsparadox'], 'Der reisende Zwilling kommt jünger zurück.'),
  P('gravitationswellen', 3, 'Gravitationswellen', ['Gravitationswelle'], '2015 erstmals direkt gemessen – ausgelöst von zwei verschmelzenden Schwarzen Löchern.'),
  P('raumzeit', 2, 'Raumzeit', ['Minkowski-Raum'], 'Raum und Zeit verschmelzen zu einem vierdimensionalen Gebilde.'),
  P('gravitationslinse', 3, 'Gravitationslinse', ['Gravitationslinseneffekt', 'Einsteinring'], 'Massen lenken Licht ab – ferne Galaxien erscheinen verzerrt oder doppelt.'),
  P('grav_rotverschiebung', 4, 'Gravitative Rotverschiebung', ['Gravitationsrotverschiebung'], 'Licht verliert Energie, wenn es aus einem Schwerefeld aufsteigt.'),
  P('lorentz_trafo', 3, 'Lorentz-Transformation', [], 'Sie rechnet Raum- und Zeitkoordinaten zwischen bewegten Bezugssystemen um.'),
  E('michelson_morley', 3, 'Michelson-Morley-Experiment', ['Michelson-Morley-Versuch'], 'Suchte 1887 den Äther – und fand ihn nicht.'),
  P('periheldrehung', 4, 'Periheldrehung des Merkur', ['Periheldrehung', 'Merkurperihel'], 'Die ART erklärte die fehlenden 43 Bogensekunden pro Jahrhundert.'),

  W('einstein', 1, 'Albert Einstein', ['Einstein'], 'Bekam den Nobelpreis nicht für die Relativitätstheorie, sondern für den Photoeffekt.'),
  W('lorentz_p', 3, 'Hendrik Antoon Lorentz', ['Lorentz', 'Hendrik Lorentz'], 'Nobelpreis 1902 – seine Transformationen wurden zum Fundament der SRT.'),
  W('minkowski', 3, 'Hermann Minkowski', ['Minkowski'], 'Einsteins früherer Mathematiklehrer prägte das Bild der Raumzeit.'),
  W('schwarzschild_p', 3, 'Karl Schwarzschild', ['Schwarzschild'], 'Fand 1915 als Soldat die erste exakte Lösung der einsteinschen Feldgleichungen.'),
  W('michelson', 3, 'Albert A. Michelson', ['Michelson', 'Albert Michelson'], 'Erster US-amerikanischer Nobelpreisträger in den Naturwissenschaften.'),

  K('lichtgeschwindigkeit', 1, 'Lichtgeschwindigkeit', ['Vakuumlichtgeschwindigkeit'], ['c', 'c0', 'c_0'], [[299792458, ['m/s', 'ms^-1']], [299792.458, ['km/s']], [1.0792528488e9, ['km/h']]], 'Exakt 299 792 458 m/s – der Meter ist darüber definiert.'),

  E('eddington', 3, 'Eddingtons Sonnenfinsternis-Expedition', ['Sonnenfinsternis 1919', 'Eddington-Experiment'], 'Die Lichtablenkung an der Sonne bestätigte 1919 Einsteins Allgemeine Relativitätstheorie.'),
  E('ligo', 3, 'LIGO', ['LIGO-Experiment', 'Gravitationswellendetektor'], 'Vier Kilometer lange Laserarme maßen 2015 eine Längenänderung von weniger als einem Tausendstel Protonendurchmesser.'),
  E('hafele_keating', 4, 'Hafele-Keating-Experiment', ['Hafele-Keating-Versuch'], 'Atomuhren flogen 1971 in Linienflugzeugen um die Welt und gingen danach messbar anders als am Boden.'),
  E('pound_rebka', 5, 'Pound-Rebka-Experiment', ['Pound-Rebka-Versuch'], 'Robert Pound und Glen Rebka maßen 1959 in einem gut 22 Meter hohen Turm die gravitative Rotverschiebung.'),
  E('fahrstuhl', 3, 'Einsteins Fahrstuhl', ['Einstein-Fahrstuhl', 'Fahrstuhl-Gedankenexperiment'], 'Im geschlossenen Fahrstuhl lässt sich Schwerkraft nicht von Beschleunigung unterscheiden.'),
]);
