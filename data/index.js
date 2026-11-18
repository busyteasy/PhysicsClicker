import mechanik from './mechanik.js';
import optik from './optik.js';
import waerme from './waerme.js';
import elektro from './elektro.js';
import astro from './astro.js';
import quanten from './quanten.js';
import relativ from './relativ.js';
import kern from './kern.js';

export const ENTRIES = [
  ...mechanik, ...optik, ...waerme, ...elektro,
  ...astro, ...quanten, ...relativ, ...kern,
];

// Mehrzahl für Texte wie „2 Gesetze und 1 Experiment“
export const CATEGORIES_PLURAL = {
  formel: 'Formeln',
  konstante: 'Konstanten',
  gesetz: 'Gesetze',
  phaenomen: 'Phänomene',
  teilchen: 'Teilchen',
  person: 'Personen',
  einheit: 'Einheiten',
  experiment: 'Experimente',
  begriff: 'Begriffe',
  geraet: 'Geräte',
};

export const CATEGORIES = {
  formel: 'Formel',
  konstante: 'Konstante',
  gesetz: 'Gesetz',
  phaenomen: 'Phänomen',
  teilchen: 'Teilchen',
  person: 'Person',
  einheit: 'Einheit',
  experiment: 'Experiment',
  begriff: 'Begriff',
  geraet: 'Gerät',
};
