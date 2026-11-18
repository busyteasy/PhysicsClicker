// Kurzschreibweisen für die Klassenstufen (Issue #16).
//
// Eine Klasse besteht aus:
//   klasse    5 … 13
//   themen    Themenbereiche nach Kerncurriculum (für die Anzeige)
//   quelle    Kurzbeleg, woher die Zuordnung stammt
//   eintraege ID eines Eintrags der Wissensdatenbank -> Stufe innerhalb der Klasse
//             (1 Grundwissen, 2 Standard, 3 anspruchsvoll, 4 Zusatzwissen)
//   fragen    eigener Fragekatalog; Antworten müssen Einträge dieser Klasse sein
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
