// Gedankenkette (Issue #33): Nach einem Treffer schlägt das Spiel vor, woran
// man als Nächstes denken könnte – damit man nicht hängen bleibt, wenn einem
// nichts mehr einfällt. Ohne DOM, damit es testbar bleibt.
//
// Quellen der Anstöße, in dieser Reihenfolge:
//   1. Person entdeckt     → was zu ihr noch fehlt (aus data/bezuege.js)
//   2. Begriff entdeckt    → die Person dahinter (falls noch unbekannt) oder
//                            was von dieser Person noch fehlt
//   3. sonst               → was im selben Gebiet und Bereich noch fehlt
// Jeder Anstoß nennt nur Zahlen und Kategorien, nie unentdeckte Namen, und hat
// ein `ziel` (leichtester fehlender Eintrag) für das Lückenwort.

import BEZUEGE from '../data/bezuege.js';
import { CATEGORIES, CATEGORIES_PLURAL } from '../data/index.js';
import { ANSTOESSE_MAX, AREA_NAMES, BEREICH_NAMES } from './content.js';
import { isOpen, weltOf } from './game.js';
import { personenZu } from './mindmap.js';

const bekannt = (state, id) => Object.hasOwn(state.discovered, id);
const nachname = (name) => name.split(' ').at(-1);

/** Leichtester Eintrag zuerst (bei gleicher Stufe in Datenreihenfolge). */
const leichtester = (entries) => [...entries].sort((a, b) => a.tier - b.tier)[0];

/** „2 Gesetze und 1 Experiment (Optik)“ – Gebiet nur, wenn es ein anderes ist. */
export function zaehlListe(entries, heimat) {
  const gruppen = new Map();
  for (const e of entries) {
    const key = `${e.cat}|${e.area}`;
    gruppen.set(key, [...(gruppen.get(key) ?? []), e]);
  }
  const teile = [...gruppen.values()].map((g) => {
    const { cat, area } = g[0];
    const wort = g.length === 1 ? CATEGORIES[cat] : CATEGORIES_PLURAL[cat];
    return `${g.length} ${wort}${area !== heimat ? ` (${AREA_NAMES[area]})` : ''}`;
  });
  return teile.length > 1 ? `${teile.slice(0, -1).join(', ')} und ${teile.at(-1)}` : teile[0];
}

/** Einträge einer Person in dieser Welt, getrennt nach offen/gesperrt. */
function bezuegeVon(state, personId) {
  const { index } = weltOf(state);
  const alle = (BEZUEGE[personId] ?? []).map((id) => index.byId.get(id)).filter(Boolean);
  return {
    fehlend: alle.filter((e) => isOpen(state, e.bereich) && !bekannt(state, e.id)),
    gesperrt: alle.filter((e) => !isOpen(state, e.bereich)),
  };
}

function personAnstoss(state, person) {
  const { fehlend, gesperrt } = bezuegeVon(state, person.id);
  if (fehlend.length) {
    return { text: `Zu ${person.name} fehlen dir noch ${zaehlListe(fehlend, person.area)}.`, ziel: leichtester(fehlend).id };
  }
  if (gesperrt.length) {
    const b = [...new Set(gesperrt.map((e) => BEREICH_NAMES[e.bereich]))];
    const liste = b.length > 1 ? `${b.slice(0, -1).join(', ')} und ${b.at(-1)}` : b[0];
    return {
      text: `Zu ${person.name} gibt es noch mehr – ${b.length > 1 ? `in den gesperrten Bereichen ${liste}` : `im gesperrten Bereich ${liste}`}.`,
      ziel: null,
    };
  }
  return null;
}

function begriffAnstoesse(state, entry) {
  const { index } = weltOf(state);
  const out = [];
  for (const pid of personenZu(entry.id)) {
    const p = index.byId.get(pid);
    if (!p || !isOpen(state, p.bereich)) continue;
    if (!bekannt(state, pid)) {
      out.push({ text: `Hinter „${entry.name}“ steckt eine Person, die du noch nicht entdeckt hast.`, ziel: pid });
      continue;
    }
    const { fehlend } = bezuegeVon(state, pid);
    if (fehlend.length) {
      out.push({
        text: `${entry.name} gehört zu ${p.name} – von ${nachname(p.name)} fehlen dir noch ${zaehlListe(fehlend, entry.area)}.`,
        ziel: leichtester(fehlend).id,
      });
    }
  }
  return out;
}

function nachbarAnstoss(state, entry) {
  const fehlend = weltOf(state).entries
    .filter((e) => e.area === entry.area && e.bereich === entry.bereich && !bekannt(state, e.id));
  if (!fehlend.length) return null;
  return {
    text: `In ${AREA_NAMES[entry.area]} fehlen dir noch ${zaehlListe(fehlend, entry.area)}.`,
    ziel: leichtester(fehlend).id,
  };
}

/** Anstöße zu den gerade getroffenen Einträgen (IDs), höchstens ANSTOESSE_MAX. */
export function anstoesse(state, ids) {
  const { index } = weltOf(state);
  const entries = [...new Set(ids)].map((id) => index.byId.get(id)).filter((e) => e && isOpen(state, e.bereich));
  const kandidaten = [];
  for (const e of entries) {
    if (e.cat === 'person') kandidaten.push(personAnstoss(state, e));
    else kandidaten.push(...begriffAnstoesse(state, e));
  }
  for (const e of entries) kandidaten.push(nachbarAnstoss(state, e));

  const out = [];
  const ziele = new Set();
  for (const a of kandidaten) {
    if (!a || out.some((x) => x.text === a.text)) continue;
    if (a.ziel && ziele.has(a.ziel)) continue;
    if (a.ziel) ziele.add(a.ziel);
    out.push(a);
    if (out.length >= ANSTOESSE_MAX) break;
  }
  return out;
}
