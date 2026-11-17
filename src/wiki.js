// Links zur deutschen Wikipedia (Issue #15).

import WIKI from '../data/wiki.js';

/** Artikeltitel für einen Eintrag – oder `null`, wenn es keinen sinnvollen gibt. */
export function wikiTitle(entry) {
  if (!entry) return null;
  if (Object.hasOwn(WIKI, entry.id)) return WIKI[entry.id];
  // Formeln ohne eigenen Titel lassen sich nicht sinnvoll suchen
  return entry.cat === 'formel' ? null : entry.name;
}

/**
 * Link über die Wikipedia-Suche mit „go“: führt direkt zum Artikel, wenn es
 * ihn gibt, und sonst zu den Suchergebnissen.
 */
export function wikiUrl(entry) {
  const title = wikiTitle(entry);
  if (!title) return null;
  return `https://de.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}&go=Artikel`;
}
