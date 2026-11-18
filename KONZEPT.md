# PhysicsClicker – Konzept

Ein Browserspiel im Stil der Idle-/Clicker-Spiele. Statt zu klicken, **tippt man
Physikwissen** in ein Eingabefeld. Jede erkannte Eingabe bringt **Erkenntnis**
(die Spielwährung). Zu Beginn kann man nur **Physikerinnen und Physiker**
eingeben; mit Erkenntnis schaltet man nach und nach weitere **Bereiche** frei
(Einheiten, Teilchen, Formeln …).

**Grundregel:** Erkenntnis entsteht ausschließlich durch Eingaben. Nichts im
Spiel erzeugt Erkenntnis von selbst (siehe Issue #1).

## Spielmodi: freies Spiel und Klassenstufen (Issue #16)

Beim Laden der Seite wählt man, wie man spielen möchte:

- **Freies Spiel** – das Spiel mit der ganzen Wissensdatenbank (rund 1000
  Einträge, 110 Fragen). Bestehende Spielstände laufen hier unverändert weiter.
- **Nach Klassenstufe** (5 bis 13, Gymnasium) – eine eigene, kleinere Spielwelt
  nur mit dem Stoff dieser Klasse: Größen und Begriffe, Geräte, Versuche,
  Formeln, Gesetze, Einheiten, Konstanten, Personen, Phänomene und ein eigener
  Fragekatalog (37 bis 80 Fragen je Klasse). Die Schwierigkeitsstufen gelten
  *innerhalb* der Klasse: 1 = Grundwissen, 2 = Standard, 3 = anspruchsvoll,
  4 = Zusatzwissen. Was nicht zum Stoff gehört, wird nicht gewertet – das Spiel
  sagt dann „Das gehört nicht zum Stoff von Klasse 7“.

Jede Spielwelt hat ihren **eigenen Spielstand**; gewechselt wird jederzeit über
den Modus-Knopf oben. Eingabefeld, Fragen, Upgrades, Codex, Mindmap und
Countdown funktionieren in allen Welten gleich.

| Klasse | Themen |
|---|---|
| 5 | Magnetismus, einfache Stromkreise, Temperatur und Wärme, Aggregatzustände und Teilchenmodell |
| 6 | Licht und Sehen, Schatten, Spiegel und Linsen, Farben, Schall, Energie und Energieformen |
| 7 | Energieformen und -umwandlung, Bewegungen beschreiben, optische Instrumente und Farben, Sterne und Weltall |
| 8 | Kraft und Masse, Hebel und Flaschenzug, Leistung, elektrische Ladung und Stromkreis, Widerstand und Ohmsches Gesetz |
| 9 | Energie berechnen (Arbeit, Wärme, Wirkungsgrad), Elektromagnetismus und Induktion, Generator, Motor, Transformator, Energieversorgung und Klima |
| 10 | Druck und Auftrieb, Gase und Wärmekraftmaschinen, Radioaktivität und Kernenergie, Halbleiter, beschleunigte Bewegungen |
| 11 | Einführungsphase: Dynamik, Kreisbewegung, Energie und Impuls, Gravitation; Wahlmodule Akustik, optische Abbildungen, Strahlungsphysik |
| 12 | Elektrisches Feld und Kondensator, Magnetfeld und Lorentzkraft, Elektronen in Feldern, Induktion, Schwingungen, Wellen und Interferenz |
| 13 | Photonen und Fotoeffekt, Elektronen als Quantenobjekte, Deutung der Quantenphysik, Atomhülle und Spektren, Atomkern |

**Grundlage** sind die niedersächsischen Kerncurricula für das Gymnasium
(Naturwissenschaften 5–10 von 2015, Physik Sekundarbereich II von 2022). Die
Kerncurricula legen Doppeljahrgänge fest; die Aufteilung auf einzelne Klassen
folgt der Zuordnungstabelle im Anhang A3 des KC 5–10 und kann an einzelnen
Schulen abweichen. Die Oberstufe ist so aufgeteilt: 11 = Einführungsphase,
12 = Elektrizität sowie Schwingungen und Wellen, 13 = Quantenobjekte, Atomhülle
und Atomkern.

In einer Klasse startet man mit dem Bereich **Größen & Begriffe**. Die Preise
für weitere Bereiche richten sich nach der Klasse: Alle Bereiche zusammen kosten
40 % der Erkenntnis, die man in der Klasse ohne Combo verdienen kann; der n-te
Kauf kostet n-mal so viel wie der erste.

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

### Sonderzeichen-Tastatur

Unter dem Eingabefeld (und im Fragenfenster) klappt „λ² Sonderzeichen“ eine
Zeichenleiste aus: griechische Buchstaben, Hoch- und Tiefzahlen und Zeichen wie
`·`, `√`, `∝`. Ein Tipp setzt das Zeichen an der Schreibmarke ein. Ob die
Leiste offen ist, merkt sich der Browser.

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

Die Bereiche sind die Kategorien der Wissensdatenbank. Offen ist im freien
Spiel am Anfang nur **Personen**. Die übrigen neun kauft man mit Erkenntnis frei
– in beliebiger Reihenfolge, so dass jede und jeder mit dem eigenen
Lieblingsthema weitermachen kann. Der Preis hängt nur davon ab, der wievielte
Bereich es ist:

| Freischaltung | 1.  | 2.  | 3.    | 4.    | 5.    | 6.    | 7.     | 8.     | 9.     |
|---------------|-----|-----|-------|-------|-------|-------|--------|--------|--------|
| Preis         | 100 | 500 | 1.200 | 2.500 | 4.500 | 7.000 | 10.000 | 14.000 | 19.000 |

Seit den Klassenstufen gibt es zwei neue Bereiche: **Größen & Begriffe**
(physikalische Größen, Fachbegriffe, Modelle – etwa Stromstärke, Dichte,
Teilchenmodell) und **Geräte & Bauteile** (Messgeräte, Bauteile, technische
Geräte – etwa Kompass, Sammellinse, Transformator). In den Klassenstufen gelten
eigene Preise (siehe oben).

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
- Mit „Überspringen →“ lässt man eine Frage erst einmal aus; sie bleibt offen.
  Es geht reihum weiter – erst im selben Bereich, dann in den anderen offenen.

## Hilfe

Ein „?“-Knopf oben rechts öffnet eine Anleitung mit dem Grundkonzept, allen
Punktwerten, den Bereichspreisen und den Upgrades. Die Zahlen darin werden aus
`src/content.js` erzeugt und stimmen deshalb immer mit dem Spiel überein.

## Codex

Zeigt pro Bereich den Fortschritt (gesperrte Bereiche ausgegraut), alle entdeckten Einträge mit Fun Fact und
wie viele Einträge je Stufe noch fehlen.

## Mindmap

Über „Mindmap“ oben rechts oder im Codex öffnet sich eine Übersicht, in der man
sieht, wo noch etwas fehlt. In der Mitte steht „Physik“, davon gehen die acht
Gebiete ab (Mechanik, Optik …), darunter die **offenen** Bereiche mit ihren
Einträgen. Gesperrte Bereiche erscheinen nicht.

- Entdeckte Einträge stehen mit Namen da, unentdeckte als „?“ mit ihrer Stufe.
- Jedes Gebiet zeigt, wie viele Einträge noch fehlen.
- Entdeckte Personen tragen ihre **Bezüge** (`data/bezuege.js`): Gesetze,
  Experimente, Einheiten usw., die nach ihnen benannt sind oder auf sie
  zurückgehen – z. B. hängen an Einstein seine Experimente, sobald der Bereich
  Experimente offen ist. Unentdeckte Bezüge stehen als „? Experiment“ da.

## Wikipedia-Links

Zu jeder Antwort im Fragekatalog (nach richtiger Antwort, nach dem Auflösen und
in der Liste) und zu jedem Eintrag im Codex gibt es einen Link „Auf Wikipedia
nachlesen“. Die Artikeltitel stehen in `data/wiki.js`; Einträge ohne Titel
verlinken über ihren Namen, Formeln ohne Titel bekommen keinen Link. Der Link
nutzt die Wikipedia-Suche mit „go“ – gibt es den Artikel, öffnet er direkt,
sonst erscheinen die Suchergebnisse.

## Countdown-Modus (Testversion)

Unter „Optionen“ startet man eine **Countdown-Runde**: ein frischer Spielstand
mit einer Uhr, die herunterläuft. Der normale Spielstand bleibt unberührt –
Countdown-Runden werden nie gespeichert. Alle Regeln gelten wie sonst, dazu:

| Ereignis | Zeit |
|---|---|
| Start | 3:00 Minuten |
| Erstentdeckung Stufe 1 / 2 / 3 / 4 / 5 | +10 / 15 / 25 / 40 / 60 s |
| Konstante mit Wert | das 1,5-Fache der Stufe |
| Wiederholung mit Trinkgeld | +2 s |
| Richtige Antwort im Fragekatalog | das Doppelte der Stufe |

Mehr als 10 Minuten passen nicht auf die Uhr. Bei 0:00 ist die Runde vorbei:
Ein Fenster zeigt Erkenntnis, Entdeckungen und Dauer; der beste Lauf wird als
Rekord gemerkt. Danach geht es mit „Neue Runde“ weiter oder zurück ins normale
Spiel. Alle Werte stehen in `COUNTDOWN` in `src/content.js`.

## Speichern

Automatisch im Browser (localStorage), dazu Export/Import als Text und Reset.
Jede Spielwelt speichert getrennt: das freie Spiel wie bisher unter
`physicsclicker-spielstand-v1`, die Klassen unter `physicsclicker-k7-v1` usw.
Der zuletzt gewählte Modus steht unter `physicsclicker-modus`. Ein exportierter
Spielstand weiß, zu welcher Welt er gehört; „Spielstand löschen“ betrifft nur
die aktuelle Welt.

## Technik

- Reines HTML, CSS und JavaScript (ES-Module), kein Build-Schritt
- Hosting als statische Seite, z. B. GitHub Pages
- Tests mit dem eingebauten Test-Runner von Node (`npm test`)

## Später (nach Phase 1)

- Hinweise kaufen (verdeckte Codex-Einträge aufdecken)
- Eureka-Moment: zufällige Blitzfrage mit großem Bonus
- Paradigm Shift: Prestige-Reset mit dauerhaftem Multiplikator
- Achievements, mehr Einträge, englische Sprachversion
