// Bezüge für die Mindmap (Issue #11): Welche Einträge gehören zu einer Person?
// Schlüssel ist die ID einer Person, Wert die IDs der Einträge, die nach ihr
// benannt sind oder auf sie zurückgehen (Gesetze, Experimente, Einheiten …).
// In der Mindmap hängen sie an der Person, sobald man sie entdeckt hat – als
// „?“, solange man sie selbst noch nicht eingegeben hat.
//
// Nur gesicherte Zusammenhänge eintragen. `test/mindmap.test.js` prüft, dass
// alle IDs existieren.

export default {
  // Mechanik
  newton: ['newton2', 'traegheit', 'aktionsprinzip', 'wechselwirkung', 'gravitationsgesetz', 'gravitation_f', 'u_newton', 'prisma'],
  galilei: ['pisa', 'jupitermonde', 'traegheit', 'freier_fall', 'relativitaetsprinzip'],
  archimedes: ['archimedes_prinzip', 'hebel', 'auftrieb'],
  hooke_p: ['hooke', 'hooke_f'],
  bernoulli_p: ['bernoulli'],
  noether: ['noether_theorem'],
  pascal_p: ['pascal_prinzip', 'u_pascal'],
  doppler_p: ['doppler'],
  gauss_p: ['gauss_gesetz', 'u_gauss'],

  // Optik
  huygens: ['huygens_prinzip'],
  snellius_p: ['snellius', 'brechung_f'],
  young: ['doppelspalt', 'interferenz'],

  // Wärmelehre
  boltzmann_p: ['boltzmannkonstante', 'boltzmann_entropie', 'stefan_boltzmann'],
  carnot_p: ['carnot_prozess', 'carnot_f'],
  joule_p: ['u_joule', 'schaufelrad'],
  watt_p: ['u_watt'],
  kelvin_p: ['u_kelvin', 'kelvin_celsius'],
  clausius: ['hs2', 'entropie'],
  celsius: ['u_grad_celsius'],
  nernst: ['hs3'],

  // Elektrizität & Magnetismus
  faraday: ['induktionsgesetz', 'induktion', 'faradaykaefig', 'faraday_k', 'u_farad', 'elektrolyse'],
  maxwell_p: ['maxwell', 'maxwell_daemon', 'em_welle'],
  ohm_p: ['ohm', 'ohm_f', 'u_ohm'],
  volta: ['u_volt'],
  ampere_p: ['u_ampere', 'ampere_gesetz'],
  coulomb_p: ['coulomb', 'coulomb_f', 'u_coulomb'],
  tesla_p: ['u_tesla'],
  hertz_p: ['u_hertz', 'hertz_versuch'],
  oersted: ['oersted_versuch'],
  kirchhoff: ['knotenregel', 'maschenregel'],
  franklin: ['drachen', 'blitz'],
  henry_p: ['u_henry'],
  weber_p: ['u_weber'],
  siemens_p: ['u_siemens'],
  galvani_p: ['galvani'],
  millikan_p: ['millikan', 'elementarladung'],

  // Astrophysik
  kepler_p: ['kepler1', 'kepler2', 'kepler3', 'kepler3_f'],
  hubble_p: ['hubble_gesetz', 'hubble_f', 'hubble_k', 'expansion'],
  hawking: ['hawking_strahlung', 'schwarzes_loch'],
  chandrasekhar: ['chandrasekhar_grenze', 'weisser_zwerg'],
  lemaitre: ['urknall', 'expansion'],
  zwicky: ['dunkle_materie', 'neutronenstern'],
  bell_burnell: ['pulsar'],
  eddington_p: ['eddington'],

  // Quantenphysik
  planck: ['planck_h', 'hbar', 'planck_gesetz', 'photon_energie', 'schwarzer_koerper'],
  heisenberg: ['unschaerfe', 'unschaerfe_f'],
  schroedinger_p: ['schroedinger_gl', 'schroedinger_f', 'schroedinger_stat', 'katze', 'wellenfunktion'],
  bohr: ['atommodell', 'bohr_f', 'bohr_radius', 'komplementaritaet', 'korrespondenz'],
  pauli_p: ['pauli', 'neutrino'],
  dirac: ['antimaterie', 'positron'],
  de_broglie_p: ['de_broglie_f', 'dualismus'],
  compton_p: ['compton', 'compton_f'],
  bose: ['boson', 'bec'],

  // Relativität
  einstein: ['emc2', 'srt', 'art', 'aequivalenz', 'fahrstuhl', 'photoeffekt', 'photoeffekt_f', 'zeitdilatation', 'gravitationswellen', 'bec'],
  lorentz_p: ['lorentzkraft', 'lorentz_f', 'lorentz_trafo', 'lorentzfaktor'],
  minkowski: ['raumzeit'],
  schwarzschild_p: ['schwarzschild_f', 'schwarzes_loch'],
  michelson: ['michelson_morley'],

  // Kern- & Teilchenphysik
  curie: ['radioaktivitaet', 'u_curie'],
  becquerel_p: ['radioaktivitaet', 'u_becquerel'],
  rutherford: ['rutherford_streu', 'atomkern', 'alphateilchen', 'proton'],
  fermi: ['chicago_pile', 'fermion'],
  meitner: ['kernspaltung'],
  hahn: ['kernspaltung'],
  chadwick: ['neutron'],
  higgs_p: ['higgs'],
  gell_mann: ['quark'],
  yukawa: ['pion'],
  thomson: ['elektron'],
  wu: ['wu_experiment'],
  roentgen: ['roentgenstrahlung'],
};
