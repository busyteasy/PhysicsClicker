# PhysicsClicker

Ein Browserspiel im Stil der Idle-Spiele: Statt zu klicken, tippst du
**Physikwissen** ein – Formeln, Konstanten (gern mit Wert), Gesetze, Phänomene,
Teilchen, Personen, Einheiten und Experimente. Jede erkannte Eingabe bringt
Erkenntnis. Am Anfang sind nur Personen offen; mit Erkenntnis schaltest du weitere
Bereiche frei.

Das Konzept steht in [KONZEPT.md](KONZEPT.md). Wer am Code mitarbeitet (auch
Coding-Agents), findet Aufbau, Regeln und Arbeitsablauf in [AGENTS.md](AGENTS.md).

## Starten

Das Spiel ist eine statische Seite ohne Build-Schritt. Weil es ES-Module nutzt,
braucht es einen kleinen lokalen Webserver (direkt per Doppelklick geht es nicht):

```bash
npm start
```

Dann <http://localhost:8000> öffnen.

## Tests

```bash
npm test
```

Läuft mit dem eingebauten Test-Runner von Node (ab Version 18), ohne Abhängigkeiten.

## Aufbau

| Pfad                | Inhalt                                                 |
|---------------------|--------------------------------------------------------|
| `index.html`, `style.css` | Seite und Gestaltung                             |
| `src/main.js`       | Oberfläche, Hauptschleife                              |
| `src/game.js`       | Spiellogik ohne DOM (Punkte, Bereiche, Speichern)      |
| `src/content.js`    | Balance: Bereiche, Preise, Punktwerte                  |
| `src/matcher.js`    | Ordnet Eingaben den Datenbank-Einträgen zu             |
| `src/normalize.js`  | Vereinheitlicht Schreibweisen von Wörtern und Formeln  |
| `data/*.js`         | Wissensdatenbank, eine Datei pro Gebiet                |
| `data/wiki.js`, `src/wiki.js` | Wikipedia-Titel und -Links zu den Einträgen  |
| `test/`             | Tests für Datenbank, Erkennung und Spiellogik          |

## Neue Einträge hinzufügen

In der passenden Datei unter `data/` eine Zeile ergänzen, zum Beispiel:

```js
P('tyndall', 3, 'Tyndall-Effekt', ['Tyndalleffekt'], 'Darum sieht man Lichtstrahlen im Nebel.'),
```

Format und Kategorien sind in `data/helpers.js` beschrieben. `npm test` prüft
danach, dass IDs eindeutig sind, keine Schreibweise mit einem anderen Eintrag
kollidiert und jeder Eintrag über seinen Namen erreichbar ist.
