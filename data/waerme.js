import { F, G, K, P, U, W, inArea } from './helpers.js';

export default inArea('waerme', [
  F('gasgleichung', 2, 'p·V = n·R·T', ['pV=NkT', 'pV=NkBT'], 'Die ideale Gasgleichung verbindet Druck, Volumen und Temperatur.'),
  F('waermemenge', 2, 'Q = c·m·ΔT', ['Q=cmdT', 'Q=cmΔϑ'], 'Wasser braucht 4,19 kJ, um ein Kilogramm um ein Grad zu erwärmen.'),
  F('hauptsatz1_f', 2, 'ΔU = Q + W', ['ΔU=W+Q', 'dU=Q+W', 'dU=W+Q'], 'Die innere Energie ändert sich durch zugeführte Wärme und Arbeit.'),
  F('carnot_f', 3, 'η = 1 − T_k/T_w', ['η=1-T2/T1', 'η=1-Tc/Th', 'η=(Tw-Tk)/Tw'], 'Keine Wärmekraftmaschine kann diesen Wirkungsgrad übertreffen.'),
  F('boyle_f', 2, 'p·V = konstant', ['pV=const', 'pV=konst', 'p1V1=p2V2'], 'Bei konstanter Temperatur gilt: halbes Volumen, doppelter Druck.'),
  F('boltzmann_entropie', 4, 'S = k·ln Ω', ['S=kBlnΩ', 'S=klnW', 'S=kBlnW', 'S=kln(W)', 'S=kln(Ω)', 'S=kBln(Ω)'], 'Diese Formel steht auf Ludwig Boltzmanns Grabstein in Wien.'),
  F('stefan_f', 3, 'P = σ·A·T⁴', ['M=σT^4', 'j=σT^4'], 'Doppelte Temperatur bedeutet sechzehnfache Strahlungsleistung.'),
  F('wien_f', 3, 'λ_max·T = b', ['λmax=b/T', 'λmaxT=konst'], 'Je heißer ein Körper, desto kürzer die Wellenlänge seines Strahlungsmaximums.'),

  G('hs0', 3, 'Nullter Hauptsatz der Thermodynamik', ['nullter Hauptsatz', '0. Hauptsatz'], 'Er wurde erst nach den anderen formuliert, war aber zu grundlegend für eine höhere Nummer.'),
  G('hs1', 2, 'Erster Hauptsatz der Thermodynamik', ['erster Hauptsatz', '1. Hauptsatz', '1. Hauptsatz der Thermodynamik'], 'Ein Perpetuum mobile erster Art ist unmöglich.'),
  G('hs2', 2, 'Zweiter Hauptsatz der Thermodynamik', ['zweiter Hauptsatz', '2. Hauptsatz', '2. Hauptsatz der Thermodynamik'], 'Wärme fließt von selbst nur vom Warmen zum Kalten.'),
  G('hs3', 3, 'Dritter Hauptsatz der Thermodynamik', ['dritter Hauptsatz', '3. Hauptsatz', 'Nernst-Theorem', 'nernstsches Wärmetheorem'], 'Der absolute Nullpunkt ist unerreichbar.'),
  G('boyle_mariotte', 2, 'Gesetz von Boyle-Mariotte', ['Boyle-Mariotte', 'Boyle-Mariotte-Gesetz'], 'Unabhängig voneinander entdeckt von Robert Boyle (1662) und Edme Mariotte (1676).'),
  G('gay_lussac', 2, 'Gesetz von Gay-Lussac', ['Gay-Lussac', 'Gay-Lussac-Gesetz'], 'Bei konstantem Druck wächst das Volumen eines Gases proportional zur Temperatur.'),
  G('stefan_boltzmann', 3, 'Stefan-Boltzmann-Gesetz', ['Stefan-Boltzmann'], 'Die Strahlungsleistung wächst mit der vierten Potenz der Temperatur.'),
  G('wien', 3, 'Wiensches Verschiebungsgesetz', ['Verschiebungsgesetz', 'wiensches Gesetz'], 'Damit liest man die Oberflächentemperatur von Sternen an ihrer Farbe ab.'),

  P('entropie', 2, 'Entropie', [], 'Ein Maß für die Zahl der Mikrozustände – und dafür, warum Tassen zerbrechen, aber nie von selbst heil werden.'),
  P('waermeleitung', 1, 'Wärmeleitung', ['Konduktion'], 'Metall fühlt sich kälter an als Holz, weil es Wärme schneller ableitet.'),
  P('konvektion', 1, 'Konvektion', ['Wärmeströmung'], 'Warme Luft steigt auf – so entstehen Gewitterwolken.'),
  P('waermestrahlung', 1, 'Wärmestrahlung', ['thermische Strahlung', 'Infrarotstrahlung'], 'Jeder Körper über dem absoluten Nullpunkt strahlt Wärme ab.'),
  P('brownsche', 2, 'Brownsche Bewegung', ['brownsche Molekularbewegung'], 'Einsteins Erklärung von 1905 half, die Existenz von Atomen zu belegen.'),
  P('nullpunkt', 1, 'Absoluter Nullpunkt', [], '0 Kelvin entsprechen −273,15 °C.'),
  P('carnot_prozess', 3, 'Carnot-Prozess', ['Carnot-Kreisprozess', 'Carnotprozess'], 'Ein idealer Kreisprozess mit dem höchstmöglichen Wirkungsgrad.'),
  P('schwarzer_koerper', 3, 'Schwarzer Körper', ['schwarzer Strahler', 'Hohlraumstrahler'], 'Seine Strahlung zu erklären, führte Max Planck 1900 zur Quantenhypothese.'),
  P('aggregatzustand', 1, 'Aggregatzustand', ['Aggregatzustände', 'Phasenübergang'], 'Fest, flüssig, gasförmig – und Plasma als vierter Zustand.'),
  P('perpetuum', 2, 'Perpetuum mobile', [], 'Unmöglich – das verbieten die Hauptsätze der Thermodynamik.'),

  W('boltzmann_p', 2, 'Ludwig Boltzmann', ['Boltzmann'], 'Begründete die statistische Mechanik und kämpfte zeitlebens für die Atomtheorie.'),
  W('carnot_p', 3, 'Sadi Carnot', ['Carnot', 'Nicolas Léonard Sadi Carnot'], 'Veröffentlichte 1824 seine einzige Schrift – sie begründete die Thermodynamik.'),
  W('joule_p', 2, 'James Prescott Joule', ['Joule', 'James Joule'], 'Der Brauerssohn zeigte, dass sich Arbeit und Wärme ineinander umwandeln lassen.'),
  W('watt_p', 1, 'James Watt', ['Watt'], 'Verbesserte die Dampfmaschine so sehr, dass sie die Industrialisierung antrieb.'),
  W('kelvin_p', 2, 'Lord Kelvin', ['Kelvin', 'William Thomson'], 'Schlug die absolute Temperaturskala vor, die heute seinen Namen trägt.'),
  W('clausius', 3, 'Rudolf Clausius', ['Clausius'], 'Prägte 1865 den Begriff Entropie.'),
  W('celsius', 1, 'Anders Celsius', ['Celsius'], 'Setzte in seiner ursprünglichen Skala den Siedepunkt auf 0 und den Gefrierpunkt auf 100 Grad.'),

  U('u_kelvin', 1, 'Kelvin', [], 'Die SI-Einheit der Temperatur – ganz ohne „Grad“.'),
  U('u_kalorie', 1, 'Kalorie', ['cal'], 'Eine Kalorie sind etwa 4,184 Joule.'),
  U('u_mol', 1, 'Mol', ['Stoffmenge'], 'Ein Mol enthält genau 6,02214076·10²³ Teilchen.'),

  K('boltzmannkonstante', 3, 'Boltzmann-Konstante', ['Boltzmannkonstante'], ['k', 'kB', 'k_B'], [[1.380649e-23, ['J/K']]], 'Sie verknüpft die Temperatur mit der mittleren Energie der Teilchen.'),
  K('gaskonstante', 2, 'Universelle Gaskonstante', ['Gaskonstante', 'allgemeine Gaskonstante', 'molare Gaskonstante'], ['R'], [[8.314, ['J/(molK)', 'J/molK', 'J/(Kmol)', 'Jmol^-1K^-1', 'J/mol/K']]], 'Boltzmann-Konstante mal Avogadro-Konstante.'),
  K('avogadro', 2, 'Avogadro-Konstante', ['Avogadrokonstante', 'Avogadro-Zahl', 'Avogadrozahl'], ['NA', 'N_A'], [[6.02214076e23, ['1/mol', 'mol^-1']]], 'So viele Teilchen stecken in einem Mol.'),
  K('stefan_k', 4, 'Stefan-Boltzmann-Konstante', [], ['σ', 'sigma'], [[5.670374e-8, ['W/(m^2K^4)', 'Wm^-2K^-4', 'W/m^2K^4']]], 'Rund 5,67·10⁻⁸ W/(m²·K⁴).'),
]);
