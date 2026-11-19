// Kurzschreibweisen für die Klassenstufen (Issue #16).
//
// Eine Klasse besteht aus:
//   klasse    5 … 13
//   beschreibung  zwei, drei Sätze: Was kommt in dieser Klasse dran? (Startbildschirm)
//   gruppen   optional: Bereichsgruppen aus BEREICH_GRUPPEN (content.js), die kleine
//             Kategorien zusammenfassen, z. B. 'forschung' = Personen + Experimente
//   themen    Themenbereiche nach Kerncurriculum (für die Anzeige)
//   quelle    Kurzbeleg, woher die Zuordnung stammt
//   eintraege ID eines Eintrags der Wissensdatenbank -> Stufe innerhalb der Klasse
//             (1 Grundwissen, 2 Standard, 3 anspruchsvoll, 4 Zusatzwissen)
//   fragen    eigener Fragekatalog; Antworten müssen Einträge dieser Klasse sein
//   schaetzen eigener Katalog an Schätzfragen (Issue #46): ausFrei(…) übernimmt eine
//             Schätzfrage des freien Spiels mit Klassenstufe, SZ(…) legt eine neue an
//             (Format wie in data/schaetzen.js, ID mit Präfix kN_s_)
//
// Die Einträge selbst (Name, Schreibweisen, Fun Fact) stehen wie immer in den
// Gebietsdateien – eine Klasse wählt nur aus und stuft neu ein.

/** S(stufe, 'id id id') -> { id: stufe, … } */
export const S = (tier, ids) => Object.fromEntries(ids.trim().split(/\s+/).map((id) => [id, tier]));

/**
 * Q(id, stufe, frage, antwort, wert?, auch?) – `auch` sind IDs weiterer Einträge,
 * die ebenfalls als richtig gelten (wenn eine Frage mehrere korrekte Antworten
 * zulässt, die in der Klasse eigene Einträge sind).
 */
export const Q = (id, tier, frage, antwort, wert = false, auch = []) => ({ id, tier, frage, antwort, wert, auch });

export const QUELLE_SI = 'Kerncurriculum Naturwissenschaften Gymnasium 5–10, Niedersachsen (2015), Fach Physik';
export const QUELLE_SII = 'Kerncurriculum Physik Sekundarbereich II, Niedersachsen (2022)';

// ---------- Schätzfragen (Issue #46) ----------
import FREIE_SCHAETZFRAGEN, { S as SZ } from '../schaetzen.js';

export { SZ };

/** Übernimmt die Schätzfrage `id` des freien Spiels als `kN_<id>` mit Stufe `tier` der Klasse. */
export function ausFrei(klasse, id, tier) {
  const s = FREIE_SCHAETZFRAGEN.find((x) => x.id === id);
  if (!s) throw new Error(`Unbekannte Schätzfrage ${id}`);
  return { ...s, id: `k${klasse}_${id}`, tier };
}

/** Mehrere auf einmal: alle('s_a s_b', stufe) */
export const ausFreiListe = (klasse, tier, ids) => ids.trim().split(/\s+/).map((id) => ausFrei(klasse, id, tier));
