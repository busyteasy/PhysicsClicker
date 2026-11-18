# Leitfaden für Agents und Mitwirkende

Diese Datei erklärt alles, was man braucht, um an PhysicsClicker weiterzuarbeiten –
egal ob Mensch, Claude Code oder ein anderer Coding-Agent. Spielidee und Regeln
stehen in [KONZEPT.md](KONZEPT.md), Kurzstart in [README.md](README.md).

## Das Projekt in drei Sätzen

PhysicsClicker ist ein deutschsprachiges Browserspiel im Stil von Idle-Spielen:
Man tippt Physikwissen (Personen, Einheiten, Formeln, Konstanten mit Wert …) in
ein Eingabefeld und bekommt dafür „Erkenntnis“. Am Anfang ist nur der Bereich
„Personen“ offen, weitere Bereiche kauft man mit Erkenntnis frei. Es gibt
**kein passives Einkommen** – Erkenntnis entsteht nur durch Eingaben und Fragen.
Beim Laden wählt man das **freie Spiel** oder eine **Klassenstufe** (5–13); jede
Klasse ist eine eigene Spielwelt mit dem Stoff der niedersächsischen
Kerncurricula.

Live: <https://busyteasy.github.io/PhysicsClicker/> (GitHub Pages aus `main`, Ordner `/`)

## Befehle

| Zweck | Befehl |
|---|---|
| Lokal starten | `npm start` → <http://localhost:8000> (Python-`http.server`; ES-Module brauchen einen Server, `file://` geht nicht) |
| Tests | `npm test` (Node-Test-Runner, Node ≥ 18, keine Abhängigkeiten) |
| Einzelne Testdatei | `node --test test/matcher.test.js` |

Es gibt **keinen Build-Schritt, keinen Bundler und keine npm-Abhängigkeiten**. Bitte
auch keine einführen, ohne das vorher abzusprechen: Die Seite muss so, wie sie im
Repo liegt, von GitHub Pages ausgeliefert werden können.

## Grundregeln

- **Sprache:** Oberfläche, Texte, Kommentare, Commit-Nachrichten und Issues sind
  auf Deutsch (Phase 1 ist ein rein deutsches Spiel). Bezeichner im Code sind
  gemischt deutsch/englisch – passe dich dem Umfeld an.
- **Spiellogik ohne DOM:** Alles, was Punkte, Zustand oder Regeln betrifft, gehört
  nach `src/game.js` (oder `matcher.js`/`normalize.js`) und muss mit Node testbar
  sein. `src/main.js` zeigt nur an und reicht Eingaben weiter.
- **Balance an einem Ort:** Alle Zahlen (Punkte, Preise, Zeiten, Faktoren,
  Upgrades) stehen in `src/content.js`. Keine Zahlen in `main.js` oder `game.js`
  hartkodieren. Die Hilfe („?“-Overlay) wird aus `content.js` erzeugt und
  stimmt dadurch automatisch.
- **KONZEPT.md mitpflegen:** Wenn sich Regeln, Zahlen oder Funktionen ändern,
  den passenden Abschnitt in `KONZEPT.md` anpassen.
- **Tests mitliefern:** Neue Spiellogik bekommt Tests; `npm test` muss vor jedem
  Commit grün sein.

## Aufbau

```
index.html        Seite: Eingabe-Spalte, Reiter (Bereiche, Fragen, Upgrades, Codex, Optionen), Overlays (Start, Frage, Hilfe, Mindmap, Countdown)
style.css         „Laborheft“-Look; Farben als CSS-Variablen in :root, Dunkelmodus per prefers-color-scheme
src/
  content.js      Balance + Stammdaten: AREAS, BEREICHE, Preise, TIER_POINTS, BOOSTS …
  welt.js         Spielwelten: FREI und KLASSEN_WELTEN (Einträge, Index, Fragen, Bereiche, Preise); welt(id), weltOf(state)
  game.js         Zustand und Regeln: newState(weltId), submit, buyBereich, answerQuestion, buyBoost, restore,
                  Countdown-Modus (newCountdownRun, countdownLeft, countdownOver) …
  matcher.js      buildIndex(ENTRIES) und match(index, eingabe) – Eingabe → Einträge
  normalize.js    Vereinheitlicht Wörter, Formeln, Einheiten; parseQuantity liest Zahlen
  save.js         localStorage, Export/Import als Base64-Text
  format.js       Zahlenformat (de-DE, „Mio.“, „Mrd.“ …)
  mindmap.js      mindmap(state): Gebiete → offene Bereiche → Einträge (ohne Namen, solange unentdeckt);
                  verbindungen(state): Pfeile zwischen Gebieten für das Sonnensystem
  wiki.js         wikiUrl(entry): Link zur deutschen Wikipedia (über die Suche mit „go“)
  main.js         UI: Rendering, Overlays, Hauptschleife (update alle 100 ms), Autosave
data/
  helpers.js      Kurzschreibweisen F, G, P, T, W, U, E, K und inArea – Format ist dort dokumentiert
  index.js        ENTRIES (alle Gebiete zusammen) und CATEGORIES (Einzahl-Bezeichnungen)
  mechanik.js …   Ein Gebiet pro Datei (mechanik, optik, waerme, elektro, astro, quanten, relativ, kern)
  fragen.js       Fragekatalog
  bezuege.js      Person → zugehörige Einträge (für die Mindmap)
  wiki.js         Wikipedia-Artikeltitel je Eintrag-ID (Pflicht für jede Fragen-Antwort, Test)
  klassen/        k5.js … k13.js: Auswahl der Einträge je Klasse mit Stufe 1–4 und eigenem Fragekatalog
test/             data, matcher, game, fragen, upgrades, wiki, mindmap, countdown, klassen
```

### Begriffe

| Begriff | Bedeutung |
|---|---|
| **Gebiet** (`area`) | Physikalisches Themenfeld, z. B. Mechanik. Nur zur Ordnung der Daten. |
| **Kategorie / Bereich** (`cat`) | Art des Wissens: `person`, `einheit`, `teilchen`, `phaenomen`, `gesetz`, `formel`, `konstante`, `experiment`. Ein Bereich ist das, was man im Spiel freischaltet. |
| **Stufe** (`tier`) | 1 (Schulwissen) bis 5 (Spezialwissen), bestimmt die Punkte. |
| **Erkenntnis** (`insight`) | Die Spielwährung. |
| **Boost / Upgrade** | Einmal-Effekt aus `BOOSTS` (Geistesblitz, Spickzettel …). |
| **Spielwelt** (`welt`) | `frei` oder `k5` … `k13`. Bestimmt Einträge, Fragen, Bereiche und Preise; steht im Spielstand. |

### Datenfluss einer Eingabe

1. `main.js` ruft `submit(state, text, now)` aus `game.js`.
2. `match()` in `matcher.js` sucht im Index:
   - enthält die Eingabe `=`, `<`, `>`, `~` oder `∝`, wird sie zuerst als
     Konstante mit Wert (`c = 3e8 m/s`) und dann als Formel geprüft;
   - sonst als Wort, notfalls mit Tippfehler-Toleranz (Levenshtein: 1 Fehler ab
     7 Zeichen, 2 ab 14; nur wenn eindeutig).
3. `submit` wertet: Erstentdeckung, Wert-Bonus, Trinkgeld für Wiederholungen,
   Combo, aktiver Multiplikator. Gesperrte Bereiche bringen nichts und werden
   nicht gespeichert.
4. Rückgabe ist ein Ergebnisobjekt (`status`, `items`, `gained` …), das `main.js`
   anzeigt.

## Häufige Aufgaben

### Neuen Eintrag in die Wissensdatenbank

In der passenden Gebietsdatei unter `data/` eine Zeile ergänzen:

```js
P('tyndall', 3, 'Tyndall-Effekt', ['Tyndalleffekt'], 'Darum sieht man Lichtstrahlen im Nebel.'),
K('erdbeschleunigung', 1, 'Erdbeschleunigung', ['Fallbeschleunigung'], ['g'],
  [[9.81, ['m/s^2', 'N/kg']]], 'Rund 9,81 m/s² …'),
```

Regeln (alle werden von `test/data.test.js` geprüft):

- `id` eindeutig, nur `a-z`, `0-9`, `_`.
- Name und Aliase mindestens 3 Zeichen (nach Normalisierung).
- Keine Schreibweise darf mit einem anderen Eintrag kollidieren. **Einzige
  Ausnahme:** Person + gleichnamige Einheit (Newton, Tesla, Ohm …); die Person
  bekommt dann eine ID wie `tesla_p`, die Einheit `u_tesla`.
- Jeder Eintrag muss über seinen eigenen Namen gefunden werden.
- Formeln werden normalisiert (Seiten und Faktoren sortiert, `·`/`*`/Leerzeichen
  egal). Zwei Formeln, die gleich normalisieren, kollidieren.
- Fakten sollen kurz, korrekt und überraschend sein. Physikalische Angaben
  sorgfältig prüfen – sie werden den Spielenden als Wissen gezeigt.

### Neue Frage

In `data/fragen.js`: `Q(id, stufe, frage, antwortId, wert)`. `antwortId` ist die
ID eines Eintrags; die Antwort wird damit genauso tolerant erkannt wie jede
Eingabe. `wert = true` nur bei Konstanten, dann muss der Zahlenwert genannt
werden. Der Bereich der Frage ergibt sich aus der Kategorie der Antwort. Jeder
Bereich braucht mindestens 4 Fragen (Test).
Die Antwort braucht außerdem einen Wikipedia-Titel in `data/wiki.js` (Test).

### Klassenstufe pflegen

Jede Klasse steht in `data/klassen/kN.js` (Format in `data/klassen/helpers.js`):
`eintraege` ordnet IDs aus der Wissensdatenbank eine Stufe **innerhalb der
Klasse** zu (`S(stufe, 'id id id')`), `fragen` ist ein eigener Katalog mit IDs
`kN_…`. Neue Begriffe zuerst ganz normal in einer Gebietsdatei anlegen, dann in
der Klasse auswählen. `test/klassen.test.js` prüft unter anderem:

- alle IDs existieren, Stufen 1–4, Fragen-Antworten gehören zur Klasse;
- mindestens 60 Einträge und 30 Fragen je Klasse;
- jeder Bereich einer Klasse hat mindestens 3 Einträge und 2 Fragen;
- jede Frage ist mit dem Namen ihrer Antwort lösbar und hat einen
  Wikipedia-Link (Formeln brauchen dafür einen Titel in `data/wiki.js`);
- das Freikaufen aller Bereiche bleibt erreichbar.

Inhalte richten sich nach den niedersächsischen Kerncurricula (Gymnasium,
Naturwissenschaften 5–10 und Physik Sek II). Die Zuordnung der Doppeljahrgänge
zu einzelnen Klassen folgt Anhang A3 des KC 5–10.

### Neuer Bereich, neues Upgrade, Balance ändern

- Bereich: Eintrag in `BEREICHE` (`content.js`) + `CATEGORIES` (`data/index.js`)
  + Fabrik in `helpers.js`; ggf. einen Preis in `UNLOCK_PRICES` ergänzen.
- Upgrade: Eintrag in `BOOSTS`; neue Effektarten in `game.js` (`buyBoost`,
  `submit`, `restore`) umsetzen und in `test/upgrades.test.js` testen.
- Balance: nur Werte in `content.js` ändern, `KONZEPT.md` anpassen.

### Spielstand-Format ändern

Der Zustand des freien Spiels liegt in `localStorage` unter
`physicsclicker-spielstand-v1`, Klassenwelten unter `physicsclicker-k7-v1` usw.
(`storageKey` in `save.js`); der zuletzt gewählte Modus unter `physicsclicker-modus`.
Ein Spielstand ohne Feld `welt` gehört zum freien Spiel.
Countdown-Runden (`state.countdown` gesetzt) werden von `saveLocal` nie gespeichert;
ihr Rekord liegt separat unter `physicsclicker-countdown-rekord`.
Spielende haben echte Spielstände – **niemals einfach brechen**:

- Neue Felder in `newState()` mit Standardwert anlegen.
- `restore()` in `game.js` muss jeden alten oder kaputten Spielstand annehmen,
  Unbekanntes verwerfen und Werte prüfen (das ist auch der Schutz beim Import).
- Einen Test in `test/game.test.js` ergänzen, der einen alten Stand lädt.

## UI-Konventionen (`src/main.js`)

- Elemente mit `h(tag, props, ...kinder)` bauen, Inhalte mit `fill(el, ...kinder)`
  ersetzen – `fill` filtert `null`/`false` heraus. **Nicht** `replaceChildren`
  mit möglichen `null`-Werten aufrufen (sonst steht „null“ auf der Seite).
- Keine Modul-Variable `history` nennen – sie verdeckt `window.history`
  (Overlays nutzen `window.history.pushState`). Die Verlaufsliste heißt `recent`.
- Inhalte immer über die aktuelle Welt holen (`W()` in `main.js`, `weltOf(state)`
  in der Logik) – nie direkt `ENTRIES`, `QUESTIONS` oder `BEREICHE` benutzen.
- Overlays (`start`, `frage`, `hilfe`, `mindmap`, `countdown`) über `openOverlay(name)` / `closeOverlay()` öffnen
  und schließen; sie legen einen History-Eintrag an, damit Escape, der
  „Zurück“-Knopf und die Browser-/Handy-Zurück-Taste funktionieren.
- Teure Listen (Bereiche, Upgrades) rendern nur neu, wenn sich ihre „Signatur“
  ändert; `update()` alle 100 ms darf nur billige Anzeigen aktualisieren.
- `[hidden]` ist in `style.css` mit `!important` erzwungen – `hidden` funktioniert
  also auch bei Elementen mit `display: flex`.
- Neue Farben als Variablen in `:root` anlegen und im Dunkelmodus-Block mit
  überschreiben. Die Seite muss auf Handybreite (375 px) ohne seitliches
  Scrollen funktionieren.

## Arbeitsablauf

- Aufgaben kommen als GitHub-Issues in `busyteasy/PhysicsClicker`
  (`gh issue list`). Pro Aufgabe ein Branch von `main`, z. B.
  `feature/<kurzname>` oder `fix/<kurzname>`.
- Commits auf Deutsch im Stil `feat: Kurzbeschreibung (#Issue)` bzw. `fix: …`.
- Pull Request mit `Fixes #N` im Text, damit das Issue beim Merge schließt.
  Gemergt wird erst nach ausdrücklicher Freigabe durch den Projektinhaber, der
  Änderungen gern vorher selbst ausprobiert.
  Merge-Methode: Merge-Commit.
- Nach dem Merge baut GitHub Pages automatisch neu (1–2 Minuten).
- Hinweis zu `gh`: `gh pr edit` scheitert derzeit an einer GraphQL-Abkündigung
  (Projects classic). Stattdessen die REST-API nutzen, z. B.
  `gh api -X PATCH repos/busyteasy/PhysicsClicker/pulls/N -f body=…`.

### Mehrere Agents parallel

- Jeder Agent auf seinem eigenen Branch (am besten eigener Worktree:
  `git worktree add ../PhysicsClicker-<name> -b feature/<name>`).
- Konfliktträchtige Dateien: `src/main.js`, `src/content.js`, `index.html`,
  `style.css`, `KONZEPT.md` und die Enden der `data/*.js`-Dateien. Wenn zwei
  Aufgaben dieselben Dateien stark ändern, lieber nacheinander erledigen.
- Neue Einträge in den Datendateien als eigenen Block mit Kommentar anhängen
  (`// Erweiterung (Issue #N)`); das macht Merges leichter.
- Nach einem Rebase/Merge immer `npm test` laufen lassen – gerade
  Namenskollisionen zwischen neuen Einträgen fallen erst dann auf.

## Prüfen vor dem PR

1. `npm test` grün.
2. `npm start`, im Browser durchspielen, was sich geändert hat; Konsole ohne Fehler.
3. Mit leerem Spielstand testen (Optionen → „Spielstand löschen“ oder
   `localStorage.clear()`) **und** mit einem bestehenden Spielstand.
4. Handyansicht (375 px breit) und Dunkelmodus kurz ansehen.
5. `KONZEPT.md`/`README.md` aktualisiert, falls Regeln oder Aufbau sich geändert haben.
