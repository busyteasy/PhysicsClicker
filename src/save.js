// Speichern im Browser und Export/Import als Text.

import { restore } from './game.js';

// Jede Spielwelt hat ihren eigenen Spielstand. Das freie Spiel behält den
// alten Schlüssel, damit bestehende Spielstände einfach weiterlaufen.
const KEY = 'physicsclicker-spielstand-v1';
const MODE_KEY = 'physicsclicker-modus';

export const storageKey = (weltId = 'frei') => (weltId === 'frei' ? KEY : `physicsclicker-${weltId}-v1`);

export function saveLocal(state) {
  // Countdown-Runden (#12) sind Testläufe und überschreiben nie den echten Spielstand.
  if (state.countdown) return false;
  try {
    localStorage.setItem(storageKey(state.welt), JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadLocal(weltId = 'frei') {
  try {
    const raw = localStorage.getItem(storageKey(weltId));
    return raw ? restore(JSON.parse(raw), weltId) : null;
  } catch {
    return null;
  }
}

export function clearLocal(weltId = 'frei') {
  try { localStorage.removeItem(storageKey(weltId)); } catch { /* egal */ }
}

/** Zuletzt gewählte Spielwelt (für den Startbildschirm). */
export function loadMode() {
  try { return localStorage.getItem(MODE_KEY); } catch { return null; }
}

export function saveMode(weltId) {
  try { localStorage.setItem(MODE_KEY, weltId); } catch { /* egal */ }
}

/** Gibt es zu dieser Welt schon einen Spielstand? */
// Einführung (Issue #35): nur beim allerersten Besuch zeigen
const INTRO_KEY = 'physicsclicker-einfuehrung';

/** Erster Besuch: weder Einführung gesehen noch je einen Modus gewählt oder gespielt. */
export function isFirstVisit() {
  try {
    return localStorage.getItem(INTRO_KEY) == null && localStorage.getItem(MODE_KEY) == null
      && localStorage.getItem(storageKey('frei')) == null;
  } catch { return false; }
}

export function markIntroSeen() {
  try { localStorage.setItem(INTRO_KEY, 'gesehen'); } catch { /* egal */ }
}

export function hasSave(weltId) {
  try { return localStorage.getItem(storageKey(weltId)) != null; } catch { return false; }
}

export function exportState(state) {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** Liefert einen Zustand oder wirft einen Fehler mit verständlicher Meldung. */
export function importState(text) {
  try {
    const binary = atob(text.trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return restore(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    throw new Error('Der Text ist kein gültiger Spielstand.');
  }
}

// Bestwert im Countdown-Modus (#12)
const recordKey = (weltId = 'frei') => (weltId === 'frei'
  ? 'physicsclicker-countdown-rekord' : `physicsclicker-countdown-rekord-${weltId}`);

export function loadRecord(weltId = 'frei') {
  try {
    const r = JSON.parse(localStorage.getItem(recordKey(weltId)));
    return r && Number.isFinite(r.insight) ? r : null;
  } catch {
    return null;
  }
}

/** Speichert den Lauf, wenn er besser ist; liefert true bei neuem Rekord. */
export function saveRecord(run, weltId = 'frei') {
  const old = loadRecord(weltId);
  if (old && old.insight >= run.insight) return false;
  try { localStorage.setItem(recordKey(weltId), JSON.stringify(run)); } catch { /* egal */ }
  return true;
}
