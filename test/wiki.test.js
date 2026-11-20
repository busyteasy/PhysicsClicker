import { test } from 'node:test';
import assert from 'node:assert/strict';
import WIKI from '../data/wiki.js';
import { INDEX, QUESTIONS } from '../src/game.js';
import { wikiUrl } from '../src/wiki.js';

test('Jede Antwort im Fragekatalog hat einen Wikipedia-Link (#15)', () => {
  for (const q of QUESTIONS) {
    const entry = INDEX.byId.get(q.antwort);
    assert.ok(Object.hasOwn(WIKI, entry.id), `${q.id}: Titel für ${entry.id} fehlt in data/wiki.js`);
    const url = wikiUrl(entry);
    assert.match(url, /^https:\/\/de\.wikipedia\.org\/w\/index\.php\?search=[^&]+&go=Artikel$/, q.id);
  }
});

test('data/wiki.js verweist nur auf echte Einträge und hat sinnvolle Titel', () => {
  for (const [id, title] of Object.entries(WIKI)) {
    assert.ok(INDEX.byId.has(id), `unbekannte ID ${id}`);
    if (title === null) continue; // bewusst ohne Link (z. B. Easter Egg, Issue #48)
    assert.ok(title.trim().length >= 3 && !/[=·]/.test(title), `${id}: Titel „${title}“`);
  }
  assert.equal(wikiUrl(INDEX.byId.get('einstein')),
    'https://de.wikipedia.org/w/index.php?search=Albert%20Einstein&go=Artikel');
});

test('Formeln ohne Titel bekommen keinen Link, andere Einträge den Namen', () => {
  const formel = [...INDEX.byId.values()].find((e) => e.cat === 'formel' && !Object.hasOwn(WIKI, e.id));
  if (formel) assert.equal(wikiUrl(formel), null);
  const sonst = [...INDEX.byId.values()].find((e) => e.cat !== 'formel' && !Object.hasOwn(WIKI, e.id));
  assert.match(wikiUrl(sonst), new RegExp(encodeURIComponent(sonst.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
