# PhysicsClicker – Konzept

Ein Browserspiel im Stil der Idle-/Clicker-Spiele. Statt zu klicken, **tippt man
Physikwissen** in ein Eingabefeld. Jede erkannte Eingabe bringt **Erkenntnis**
(die Spielwährung). Mit Erkenntnis baut man Forschungseinrichtungen, die jede
weitere Eingabe wertvoller machen.

**Grundregel:** Erkenntnis entsteht ausschließlich durch Eingaben. Nichts im
Spiel erzeugt Erkenntnis von selbst; Einrichtungen und Upgrades geben nur Boni
auf den Gewinn aus Eingaben.

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
  Grundwert je Stufe: 10 / 30 / 80 / 200 / 500, dazu der Bonus der
  Einrichtungen. Formel: (Grundwert × Gebiets-Upgrades + Einrichtungs-Bonus)
  × Tipp-Upgrades × Combo.
- **Konstante mit korrektem Wert:** zusätzliche Entdeckung mit doppeltem Wert.
- **Trinkgeld für Wiederholungen:** 5 % des Werts, aber für denselben Eintrag
  höchstens einmal pro 60 Sekunden. Verhindert Spammen, lässt das Tippen aber
  nie ganz wertlos werden.
- **Combo:** Treffer im Abstand von höchstens 8 Sekunden erhöhen einen
  Multiplikator um je 10 % (bis ×2).

## Einrichtungen (Bonus je Treffer)

Acht Einrichtungen, je eine pro Gebiet, Preis steigt pro Kauf um Faktor 1,15.
Jede Einrichtung gibt einen **festen Bonus auf jeden gewerteten Treffer**, bei
Treffern aus ihrem eigenen Gebiet doppelt. Sie erzeugen keine Erkenntnis von
selbst (siehe Issue #1).

| Einrichtung            | Gebiet       | Preis     | Bonus je Treffer |
|------------------------|--------------|-----------|------------------|
| Apfelbaum              | Mechanik     | 20        | +2               |
| Linsenschleiferei      | Optik        | 60        | +6               |
| Dampfmaschine          | Wärmelehre   | 250       | +15              |
| Elektrolabor           | Elektrizität | 1.500     | +35              |
| Sternwarte             | Astrophysik  | 8.000     | +80              |
| Spektrallabor          | Quanten      | 40.000    | +180             |
| Atomuhr                | Relativität  | 200.000   | +400             |
| Teilchenbeschleuniger  | Kern/Teilchen| 1.000.000 | +900             |

Ausbalanciert mit einer Simulation: Ein Spieler erreicht die Dampfmaschine nach
etwa 25, das Spektrallabor nach etwa 100 und den Teilchenbeschleuniger nach
etwa 175 Entdeckungen.

## Upgrades – an Wissen gekoppelt

- Pro Gebiet zwei Upgrades, freigeschaltet bei 5 bzw. 15 Entdeckungen in diesem
  Gebiet. Wirkung: Grundwert der Eingaben aus dem Gebiet **und** Bonus der
  zugehörigen Einrichtung ×2.
- Allgemeine Upgrades nach Gesamtzahl der Entdeckungen: Tippwert ×1,5 / ×2 / ×3,
  längeres Combo-Fenster, „Wissensnetz“ (+1 % auf alle Eingaben je Entdeckung),
  „Peer Review“ (Bonus aller Einrichtungen ×2).
- Noch gesperrte Upgrades werden mit ihrer Bedingung angezeigt – das zeigt, wo
  es sich lohnt, weiterzulernen.

## Codex

Zeigt pro Gebiet den Fortschritt, alle entdeckten Einträge mit Fun Fact und
wie viele Einträge je Stufe noch fehlen.

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
