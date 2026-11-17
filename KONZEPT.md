# PhysicsClicker – Konzept

Ein Browserspiel im Stil der Idle-/Clicker-Spiele. Statt zu klicken, **tippt man
Physikwissen** in ein Eingabefeld. Jede erkannte Eingabe bringt **Erkenntnis**
(die Spielwährung). Zu Beginn kann man nur **Physikerinnen und Physiker**
eingeben; mit Erkenntnis schaltet man nach und nach weitere **Bereiche** frei
(Einheiten, Teilchen, Formeln …).

**Grundregel:** Erkenntnis entsteht ausschließlich durch Eingaben. Nichts im
Spiel erzeugt Erkenntnis von selbst (siehe Issue #1).

Phase 1 ist ein **rein deutsches Spiel**: Oberfläche, Rückmeldungen, Fun Facts
und die Namen in der Wissensdatenbank sind deutsch. Formeln und Einheiten sind
ohnehin sprachneutral.

## Was das Eingabefeld erkennt

Die Eingaben werden gegen eine **lokale Wissensdatenbank** geprüft (`data/`).
Kein Server, keine KI – das Spiel läuft komplett im Browser.

| Kategorie  | Beispiele                                   |
|------------|---------------------------------------------|
| Formel     | `F = m·a`, `E=mc^2`, `pV = nRT`             |
| Konstante  | `Lichtgeschwindigkeit`, `c = 3·10^8 m/s`    |
| Gesetz     | `Ohmsches Gesetz`, `Pauli-Prinzip`          |
| Phänomen   | `Doppler-Effekt`, `Supraleitung`            |
| Teilchen   | `Myon`, `Higgs-Boson`                       |
| Person     | `Emmy Noether`, `Marie Curie`               |
| Einheit    | `Tesla`, `1 N = 1 kg·m/s²`                  |
| Experiment | `Foucaultsches Pendel`, `Millikan-Versuch`  |

Jeder Eintrag gehört zu einem von acht **Gebieten** (Mechanik, Optik,
Wärmelehre, Elektrizität & Magnetismus, Astrophysik, Quantenphysik,
Relativität, Kern- & Teilchenphysik) und hat eine **Stufe** von 1 (Schulwissen)
bis 5 (Spezialwissen).

### Tolerante Erkennung

- Groß-/Kleinschreibung, Leerzeichen, Bindestriche, Apostrophe egal
- Umlaute: `Schrödinger` = `Schroedinger`; Artikel am Anfang werden ignoriert
- Formeln: `*`, `·`, `×` egal; `²` = `^2`; `lambda` = `λ`; Seiten und Faktoren
  dürfen vertauscht werden (`ma = F` = `F = m·a`)
- Konstanten mit Wert: `h = 6,626·10⁻³⁴ Js`, `h=6.626e-34`; Toleranz 0,5 %;
  die Einheit ist optional, muss aber stimmen, wenn sie angegeben wird
- Kleine Tippfehler bei langen Begriffen werden verziehen (1 Zeichen ab 7
  Buchstaben, 2 ab 14)
- Mehrdeutiges wie `Newton` zählt für alle passenden Einträge (Person und Einheit)

## Punkte

- **Erstentdeckung:** volle Punktzahl, der Eintrag kommt in den Codex.
  Grundwert je Stufe: 10 / 30 / 80 / 200 / 500.
- **Konstante mit korrektem Wert:** zusätzliche Entdeckung mit doppeltem Wert.
- **Trinkgeld für Wiederholungen:** 5 % des Werts, aber für denselben Eintrag
  höchstens einmal pro 60 Sekunden. Verhindert Spammen, lässt das Tippen aber
  nie ganz wertlos werden.
- **Combo:** Treffer im Abstand von höchstens 8 Sekunden erhöhen einen
  Multiplikator um je 10 % (bis ×2).

## Bereiche freischalten

Die Bereiche sind die Kategorien der Wissensdatenbank. Offen ist am Anfang nur
**Personen**. Die übrigen sieben kauft man mit Erkenntnis frei – in beliebiger
Reihenfolge, so dass jede und jeder mit dem eigenen Lieblingsthema weitermachen
kann. Der Preis hängt nur davon ab, der wievielte Bereich es ist:

| Freischaltung | 1.  | 2.  | 3.    | 4.    | 5.    | 6.    | 7.     |
|---------------|-----|-----|-------|-------|-------|-------|--------|
| Preis         | 100 | 500 | 1.200 | 2.500 | 4.500 | 7.000 | 10.000 |

Eingaben aus einem gesperrten Bereich werden erkannt, aber nicht gewertet und
nicht gemerkt; das Spiel sagt, welcher Bereich dafür nötig ist. Mehrdeutige
Eingaben wie `Newton` zählen nur für die offenen Bereiche.

Einrichtungen sind vorerst gestrichen.

## Upgrades (Einmal-Effekte)

Upgrades werden mit Erkenntnis gekauft, wirken kurz und sind dann verbraucht.
Das macht das Spiel taktischer: erst einen Multiplikator kaufen, dann das
schwierigste Wissen eingeben.

| Upgrade       | Preis | Wirkung                                             |
|---------------|-------|-----------------------------------------------------|
| Geistesblitz  | 40    | nächste gewertete Eingabe oder Antwort ×2           |
| Heureka!      | 150   | nächste gewertete Eingabe oder Antwort ×3           |
| Konzentration | 120   | nächste 5 gewertete Eingaben oder Antworten ×1,5    |
| Kaffeepause   | 80    | 60 Sekunden lang doppeltes Combo-Fenster            |
| Eselsbrücke   | 100   | 2 Minuten lang keine Abklingzeit bei Wiederholungen |
| Spickzettel   | 60    | Hinweis auf einen unentdeckten Eintrag (offener Bereich, leichteste Stufe; Gebiet, Anfangsbuchstabe, Fun Fact ohne Namen) |

Balance: Es wirkt immer nur **ein** Multiplikator gleichzeitig, ungewertete
Eingaben verbrauchen ihn nicht, und jedes Upgrade wird mit jedem Kauf um 15 %
teurer.

## Fragekatalog

Ein Reiter mit 97 Fragen, nach Bereichen geordnet (z. B. „Wer entdeckte 1896
die Radioaktivität?“). Ein Klick öffnet die Frage **groß** als Overlay (auf dem
Handy bildschirmfüllend). Zurück geht es mit „← Zurück“, Escape oder der
Zurück-Taste von Browser bzw. Handy. Nach einer richtigen Antwort führt
„Nächste Frage“ direkt weiter.

- Die Antwort ist ein Eintrag der Wissensdatenbank und wird genauso tolerant
  erkannt wie jede andere Eingabe; bei Konstanten-Fragen zählt der Zahlenwert.
- Punkte: doppelter Grundwert der Fragen-Stufe, einmal pro Frage.
- Fragen aus gesperrten Bereichen sind sichtbar, aber nicht beantwortbar.
- Nach drei Fehlversuchen kann man die Frage auflösen – dann ohne Punkte.

## Hilfe

Ein „?“-Knopf oben rechts öffnet eine Anleitung mit dem Grundkonzept, allen
Punktwerten, den Bereichspreisen und den Upgrades. Die Zahlen darin werden aus
`src/content.js` erzeugt und stimmen deshalb immer mit dem Spiel überein.

## Codex

Zeigt pro Bereich den Fortschritt (gesperrte Bereiche ausgegraut), alle entdeckten Einträge mit Fun Fact und
wie viele Einträge je Stufe noch fehlen.

## Wikipedia-Links

Zu jeder Antwort im Fragekatalog (nach richtiger Antwort, nach dem Auflösen und
in der Liste) und zu jedem Eintrag im Codex gibt es einen Link „Auf Wikipedia
nachlesen“. Die Artikeltitel stehen in `data/wiki.js`; Einträge ohne Titel
verlinken über ihren Namen, Formeln ohne Titel bekommen keinen Link. Der Link
nutzt die Wikipedia-Suche mit „go“ – gibt es den Artikel, öffnet er direkt,
sonst erscheinen die Suchergebnisse.

## Speichern

Automatisch im Browser (localStorage), dazu Export/Import als Text und Reset.

## Technik

- Reines HTML, CSS und JavaScript (ES-Module), kein Build-Schritt
- Hosting als statische Seite, z. B. GitHub Pages
- Tests mit dem eingebauten Test-Runner von Node (`npm test`)

## Später (nach Phase 1)

- Hinweise kaufen (verdeckte Codex-Einträge aufdecken)
- Eureka-Moment: zufällige Blitzfrage mit großem Bonus
- Paradigm Shift: Prestige-Reset mit dauerhaftem Multiplikator
- Achievements, mehr Einträge, englische Sprachversion
