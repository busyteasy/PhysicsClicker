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
den Modus-Knopf oben. Eingabefeld, Fragen, Upgrades, Codex und Countdown
funktionieren in allen Welten gleich. Die **Mindmap** gibt es nur im freien
Spiel (Issue #24).

Tippt man im Startbildschirm auf eine Klasse, erscheint zuerst eine kurze
**Inhaltsübersicht** (Issue #27/#28): zwei, drei Sätze, worum es geht, die
Themen, die Zahl der Begriffe und Fragen und welche Bereiche es gibt. Erst der
Knopf „Klasse N spielen“ wechselt die Welt.

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

**Bereiche je Klasse** (Issue #26): Wo eine Klasse nur wenige Einträge einer
Kategorie hat, werden kleine Kategorien zu einem Bereich zusammengefasst, damit
die unteren Klassen weniger, aber vollere Bereiche haben:

| Gruppe | enthält | genutzt in |
|---|---|---|
| Größen & Einheiten | Größen & Begriffe, Einheiten | 5 |
| Forscher & Versuche | Personen, Experimente | 5–9 |
| Phänomene & Gesetze | Phänomene, Gesetze | 6 |
| Einheiten & Konstanten | Einheiten, Konstanten | 6, 8, 9, 10 |
| Phänomene & Teilchen | Phänomene, Teilchen | 8 |
| Gesetze & Formeln | Gesetze, Formeln | 7, 9 |

Klasse 5 hat so 4 Bereiche, Klasse 12 dagegen 10. In den unteren Klassen
kommen außerdem nur bekannte Physikerinnen und Physiker vor (nicht mehr z. B.
William Gilbert, Alhazen oder Lipperhey).

**Alles sofort offen** (Issue #30): In einer Klasse sind alle Bereiche von
Anfang an offen – man kann sofort alles eingeben, was zum Stoff gehört. Es gibt
dort nichts freizuschalten; Erkenntnis braucht man für Upgrades und das
Lückenwort. Der Reiter „Bereiche“ zeigt nur den Fortschritt je Bereich, mit
„Größen & Begriffe“ vorn (Reihenfolge: `KLASSEN_BEREICH_REIHENFOLGE` in
`content.js`). Ältere Klassen-Spielstände laden mit allen Bereichen offen;
Erkenntnis und Entdeckungen bleiben erhalten. Im freien Spiel bleibt das
Freischalten wie unten beschrieben.

Phase 1 ist ein **rein deutsches Spiel**: Oberfläche, Rückmeldungen, Fun Facts
und die Namen in der Wissensdatenbank sind deutsch. Formeln und Einheiten sind
ohnehin sprachneutral.

## Zeugnisse in den Klassen (Issue #42)

In jeder Klasse gibt es für jeden Bereich und für die ganze Klasse eine
Medaille. Es zählt der Anteil aus entdeckten Einträgen und richtig
beantworteten Fragen (aufgelöste Fragen zählen nicht):

| Medaille  | ab   |
|-----------|------|
| 🥉 Bronze | 40 % |
| 🥈 Silber | 70 % |
| 🥇 Gold   | 90 % |

Der Reiter „Bereiche“ zeigt oben das Zeugnis der Klasse und auf jeder Karte die
Medaille des Bereichs mit „Noch X bis …“. Wer eine Stufe neu erreicht, sieht eine
Glückwunsch-Zeile über der Rückmeldung bzw. nach der richtigen Antwort. Im
Startbildschirm steht die Medaille der Klasse auf dem Klassenknopf und in der
Inhaltsübersicht. Das Zeugnis wird aus dem Spielstand berechnet und nicht
gespeichert; alte Spielstände bekommen ihre Medaillen also automatisch. Werte:
`ZEUGNIS_STUFEN` in `content.js`, Logik: `zeugnis()` in `game.js`.

## Wonach wurde ausgewählt? (Issue #43)

Die Wissensdatenbank ist von Hand zusammengestellt und nicht vollständig. Damit
man versteht, warum etwas fehlt, erklärt das Spiel im **freien Spiel** die
Auswahl offen – in der Hilfe (Abschnitt „Wonach wurde ausgewählt?“), auf jeder
Bereichskarte („Ausgewählt: …“ – das ersetzt dort das Beispiel, weil man
Einträge aus der Beschreibung herleiten kann) und als Link bei jeder
unbekannten Eingabe. In den Klassen gibt es das nicht; dort zeigt jede Karte
weiter ein Beispiel. Texte: `AUSWAHL` und `auswahl` je Bereich in `content.js`.

- **Personen:** Namensgeber von Einheiten, Gesetzen, Effekten oder Versuchen;
  Forschende mit grundlegenden Entdeckungen aus Schule und Studium (oft mit
  Nobelpreis); einige, die Physik in den Alltag oder zu vielen Menschen gebracht
  haben (z. B. Edison, Sagan).
- **Andere Bereiche:** was in den Kerncurricula Niedersachsen (5–13), in
  Formelsammlungen und in Einführungsvorlesungen vorkommt und einen eigenen
  Namen hat; Experimente, die Physikgeschichte geschrieben haben, und klassische
  Schulversuche.
- **Bewusst nicht gezählt:** sehr allgemeine Wörter mit unklarer Bedeutung
  („Gewicht“), Abkürzungen unter drei Zeichen (kg, V) und Nachnamen mehrerer
  Personen – dann hilft der vollständige Name („Gustav Hertz“).

Jede Person ist über ihren Nachnamen erreichbar; Ausnahmen sind nur Wu (zu
kurz), Hertz (Heinrich und Gustav) und Gay-Lussac (zugleich ein Gesetz)
(`test/auswahl.test.js`). Dazu wurden fehlende Nachnamen ergänzt (u. a. Thomson
– „Thompson“ wird als Tippfehler erkannt –, Born, Hahn, Higgs, de Broglie) und
die Bezüge von 20 Namensgebern zu ihren Einträgen nachgetragen (z. B. Lenz →
Lenzsche Regel, Geiger → Geiger-Müller-Zählrohr).

## Was das Eingabefeld erkennt

Seit Issue #40 sind typische Grundbegriffe dabei, die vorher fehlten: Magnet,
Magnetismus, Strom, Licht, Gravitation/Schwerkraft, Linse, Spiegel, Auge, Mond,
Sonne, Erde, Pendel, Feder, Welle, Fallgesetz, Meter pro Sekunde, km/h und
Atomkraftwerk (als Schreibweise des Kernreaktors). Sie stehen auch in den
passenden Klassen (z. B. Zerstreuungslinse und Auge in Klasse 7).
`test/grundbegriffe.test.js` prüft, dass sie erkannt werden.

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

## Bereiche freischalten (freies Spiel)

Die Bereiche sind die Kategorien der Wissensdatenbank. Offen ist im freien
Spiel am Anfang nur **Personen**. Die übrigen neun kauft man mit Erkenntnis frei
– in beliebiger Reihenfolge, so dass jede und jeder mit dem eigenen
Lieblingsthema weitermachen kann. Der Preis hängt nur davon ab, der wievielte
Bereich es ist:

| Freischaltung | 1.  | 2.  | 3.  | 4.  | 5.    | 6.    | 7.    | 8.    | 9.    |
|---------------|-----|-----|-----|-----|-------|-------|-------|-------|-------|
| Preis         | 100 | 300 | 600 | 900 | 1.200 | 1.500 | 1.800 | 2.100 | 2.500 |

Seit Issue #41 sind die Preise flacher (vorher bis 19.000). Simuliert mit einer
Spielerin, die alle Einträge der Stufe 1, die Hälfte der Stufe 2 und die
leichten Fragen kennt: Ohne Combo reicht das bis zum 8. Bereich; für den 9.
braucht es etwas Stufe-3-Wissen oder Combos. Alle Freischaltungen zusammen
kosten 11.000 Erkenntnis, rund 14 % dessen, was man insgesamt holen kann.

Seit den Klassenstufen gibt es zwei neue Bereiche: **Größen & Begriffe**
(physikalische Größen, Fachbegriffe, Modelle – etwa Stromstärke, Dichte,
Teilchenmodell) und **Geräte & Bauteile** (Messgeräte, Bauteile, technische
Geräte – etwa Kompass, Sammellinse, Transformator). In den Klassenstufen ist
alles sofort offen (siehe oben).

In den Klassen zeigt jeder Bereich **nur ein Beispiel** (Issue #25), damit man
die Lösungen nicht einfach abtippen kann. Im freien Spiel steht dort stattdessen,
wonach die Einträge ausgewählt wurden (Issue #43).

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

## Schätzen (Issue #46)

Eigener Reiter „Schätzen“ neben „Fragen“: Man schätzt physikalische Größen
(„Wie lange braucht der Donner für einen Kilometer?“) mit einem Regler oder als
Zahl. Danach zeigt das Spiel den echten Wert, wie weit man daneben lag, und eine
kurze Erklärung mit Faustregel. Schätzen gibt es im freien Spiel (40 Fragen) und
in jeder Klasse (je 10 Fragen, eigener Katalog mit IDs `kN_…`). Im
Countdown ist der Reiter ausgeblendet; zum Zeugnis zählt Schätzen nicht.

**Regler:** meist logarithmisch (`min` … `max` über mindestens drei
Zehnerpotenzen), bei Temperaturen linear. Die angezeigte Zahl ist auf drei
gültige Ziffern gerundet und genau die Zahl, die gewertet wird. Das Zahlenfeld
nimmt dieselben Schreibweisen wie das Eingabefeld (`3e8`, `3·10^8`, `300 000`);
Werte außerhalb des Bereichs werden auf den Rand gesetzt.

**Wertung** (`SCHAETZ_STUFEN` in `content.js`), nur ein Versuch je Frage.
Grundwert = Stufenwert × `SCHAETZ_FACTOR` (1,5).

| Bewertung | Faktor daneben (Log) | linear | Anteil |
|---|---|---|---|
| 🎯 Volltreffer | ≤ 1,1 | ≤ 1 × Toleranz | 100 % |
| ◎ Sehr gut | ≤ 1,25 | ≤ 2 × Toleranz | 70 % |
| ○ Gut | ≤ 1,6 | ≤ 4 × Toleranz | 40 % |
| · Richtige Größenordnung | ≤ 3 | ≤ 8 × Toleranz | 15 % |

Mindestens 1 Punkt, sobald eine Stufe erreicht ist. Ein aktiver Multiplikator
(Geistesblitz …) wird nur verbraucht, wenn es Punkte gibt.

**Balance** (Tests in `test/schaetzen.test.js`):
- Alle Volltreffer einer Welt zusammen ≤ 15 % ihrer Fragenpunkte (`SCHAETZ_BUDGET`).
- Der echte Wert liegt nicht in der Reglermitte (≥ 0,3 Zehnerpotenzen bzw.
  > 8 × Toleranz) und nicht am Rand (≥ 0,5 Zehnerpotenzen bzw. ≥ 4 × Toleranz).
- Zufälliges Raten bringt im Mittel weniger als 15 % des Grundwerts.

**Keine Spoiler:**
- Kommt ein Name aus der Wissensdatenbank im Text vor (auch die Einheit), steht
  er in `bezug`; die Schätzfrage öffnet sich erst, wenn man ihn entdeckt hat.
- Lässt sich der Wert aus einer Konstante ablesen (gleiche Einheit, < 10 %
  Abstand) oder braucht man sie zum Rechnen, steht sie in `bezugWert`; dann muss
  man ihren **Zahlenwert** schon eingegeben haben.
- Keine Formeln („=“) in Frage oder Erklärung.
- Verschlossene Schätzfragen zeigen nur Stufe und „Entdecke zuerst eine Konstante
  aus Mechanik mit Zahlenwert“ – nie Namen oder den Fragetext.

## Hilfe

Ein „?“-Knopf oben rechts öffnet eine Anleitung mit dem Grundkonzept, allen
Punktwerten, den Bereichspreisen und den Upgrades. Die Zahlen darin werden aus
`src/content.js` erzeugt und stimmen deshalb immer mit dem Spiel überein.

## Codex

Zeigt pro Bereich den Fortschritt (gesperrte Bereiche ausgegraut), alle entdeckten Einträge mit Fun Fact und
wie viele Einträge je Stufe noch fehlen.

## Einführung beim ersten Besuch (Issue #35)

Wer die Seite zum allerersten Mal öffnet, sieht vier Folien mit je einem kleinen
Bild, einer Überschrift und einem Satz – danach folgt die Moduswahl:

1. **Tippe, was du weißt** – Eingabe → Erkenntnis.
2. **Schalte Bereiche frei** – mit Erkenntnis, in beliebiger Reihenfolge.
3. **Hol mehr heraus** – Fragen, Combo, Upgrades.
4. **Du hängst? Kein Problem** – Weiterdenken, Lückenwort, Mindmap.

Weiter per Knopf, Punkt, Wischen oder Pfeiltaste; „Überspringen“ und Escape
führen direkt zur Moduswahl. Als erster Besuch gilt: kein Merker
`physicsclicker-einfuehrung`, kein gewählter Modus und kein Spielstand im
freien Spiel – wer schon gespielt hat, sieht die Einführung also nicht. In der
Hilfe („?“) gibt es „Einführung noch einmal ansehen“.

## Weiterdenken und Lückenwort (Issue #33)

Damit man nicht hängen bleibt, wenn einem nichts mehr einfällt:

- **Weiterdenken (Gedankenkette):** Unter jedem Treffer stehen bis zu drei
  Anstöße. Nach einer Person: was zu ihr noch fehlt („Zu Isaac Newton fehlen dir
  noch 4 Gesetze und 1 Experiment (Optik).“) oder in welchem gesperrten Bereich
  es mehr gibt. Nach einem anderen Begriff: dass eine noch unentdeckte Person
  dahintersteckt oder was von einer bekannten Person noch fehlt. Sonst: wie viel
  im selben Gebiet und Bereich noch fehlt. Unentdeckte Namen werden nie genannt;
  die Bezüge kommen aus `data/bezuege.js`. Funktioniert auch in den Klassen.
- **Lückenwort:** Jeder Anstoß mit Ziel hat einen Knopf „Lückenwort“; im freien
  Spiel gibt es es auch in der Mindmap beim Antippen eines „?“. Man sieht den
  Namen als Kästchen (`_ = _·_`, `_____ ______`) und kann Buchstaben kaufen:
  zuerst den ersten, dann die übrigen in fester, je Eintrag gemischter
  Reihenfolge. Ein Buchstabe kostet 20 % vom Grundwert der Stufe, mindestens 2
  Erkenntnis (`LUECKENWORT` in `content.js`): Stufe 1 = 2, Stufe 3 = 16,
  Stufe 5 = 100. Den letzten Buchstaben verrät das Spiel nie. Gekaufte
  Buchstaben stehen im Spielstand unter `luecken` und verschwinden, sobald der
  Eintrag entdeckt ist.

## Mindmap

Nur im freien Spiel (Issue #24). Über „Mindmap“ oben rechts oder im Codex öffnet
sich ein **Sonnensystem** (Issue #31), in dem man sieht, wo noch etwas fehlt:

- **Sonne** = Physik, mit der Zahl aller entdeckten Einträge.
- **Planeten** = die acht Gebiete (Mechanik, Optik …). Der Ring um einen Planeten
  zeigt den Fortschritt, die Zahl darin die entdeckten Einträge.
- **Monde** = die offenen Bereiche des Gebiets; leer, halb oder ganz gefüllt.
  Gesperrte Bereiche erscheinen nicht.
- **Pfeile** zwischen Planeten: Eine entdeckte Person zeigt auf ihre Einträge in
  einem anderen Gebiet (z. B. Newton → Optik: Prismenversuch), sobald deren
  Bereich offen ist. Mit jedem freigeschalteten Bereich kommen also neue Pfeile
  dazu; neue werden beim Öffnen gezeichnet und unter dem Bild genannt. Blasse,
  gestrichelte Pfeile führen zu noch unentdeckten Einträgen. Welche Pfeile schon
  gezeigt wurden, steht unter `physicsclicker-mindmap-pfeile` (kein Spielstand).

Tippt man einen Planeten an, zoomt die Mindmap hinein und wird zur Leseansicht:

1. Oben die **Monde** (Bereiche) als Knöpfe mit Fortschrittsring und Zahl.
2. Darunter die **Begriffe** des gewählten Mondes – entdeckte mit Namen, offene
   als „?“ mit Stufe. Hinter jedem Begriff steht, zu welcher schon entdeckten
   Person er gehört (z. B. „? ¹ · Newton“) – unentdeckte Personen bleiben
   verborgen. Personen mit Bezügen tragen eine Zahl.
3. Ein Begriff antippen öffnet das **Bezugsbild**: Der Begriff links, rechts
   untereinander alles, was dazugehört, mit Pfeilen verbunden und ausgeschrieben
   („F = m·a“, „? Experiment · Optik · Stufe 1“). Bei einer Person sind das ihre
   Einträge, bei jedem anderen Begriff die Personen, zu denen er gehört. Jede
   Zeile lässt sich antippen und springt dorthin – auch in ein anderes Gebiet.

Die **Bezüge** stehen in `data/bezuege.js`: Gesetze, Experimente, Einheiten usw.,
die nach einer Person benannt sind oder auf sie zurückgehen.

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
Der zuletzt gewählte Modus steht unter `physicsclicker-modus`. Abgegebene
Schätzungen stehen im Feld `schaetzungen` (fehlt es, ist es leer). Ein exportierter
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
