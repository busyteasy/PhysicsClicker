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

export const CATEGORIES = {
  formel: 'Formel',
  konstante: 'Konstante',
  gesetz: 'Gesetz',
  phaenomen: 'Phänomen',
  teilchen: 'Teilchen',
  person: 'Person',
  einheit: 'Einheit',
};
