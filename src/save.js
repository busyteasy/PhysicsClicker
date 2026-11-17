// Speichern im Browser und Export/Import als Text.

import { restore } from './game.js';

const KEY = 'physicsclicker-spielstand-v1';

export function saveLocal(state) {
  // Countdown-Runden (#12) sind Testläufe und überschreiben nie den echten Spielstand.
  if (state.countdown) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? restore(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function clearLocal() {
  try { localStorage.removeItem(KEY); } catch { /* egal */ }
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
const RECORD_KEY = 'physicsclicker-countdown-rekord';

export function loadRecord() {
  try {
    const r = JSON.parse(localStorage.getItem(RECORD_KEY));
    return r && Number.isFinite(r.insight) ? r : null;
  } catch {
    return null;
  }
}

/** Speichert den Lauf, wenn er besser ist; liefert true bei neuem Rekord. */
export function saveRecord(run) {
  const old = loadRecord();
  if (old && old.insight >= run.insight) return false;
  try { localStorage.setItem(RECORD_KEY, JSON.stringify(run)); } catch { /* egal */ }
  return true;
}
