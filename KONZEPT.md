# PhysicsClicker – Konzept

Ein Browserspiel im Stil der Idle-/Clicker-Spiele. Statt zu klicken, **tippt man
Physikwissen** in ein Eingabefeld. Jede erkannte Eingabe bringt **Erkenntnis**
(die Spielwährung). Mit Erkenntnis baut man Forschungseinrichtungen, die von
selbst weiter Erkenntnis erzeugen.

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
  Grundwert je Stufe: 10 / 30 / 80 / 200 / 500, dazu Stufe × 5 Sekunden der
  aktuellen Produktion, damit Tippen auch später wertvoll bleibt.
- **Konstante mit korrektem Wert:** zusätzliche Entdeckung mit doppeltem Wert.
- **Trinkgeld für Wiederholungen:** 5 % des Werts, aber für denselben Eintrag
  höchstens einmal pro 60 Sekunden. Verhindert Spammen, lässt das Tippen aber
  nie ganz wertlos werden.
- **Combo:** Treffer im Abstand von höchstens 8 Sekunden erhöhen einen
  Multiplikator um je 10 % (bis ×2).

## Einrichtungen (passives Einkommen)

Acht Einrichtungen, je eine pro Gebiet, Preis steigt pro Kauf um Faktor 1,15:

Apfelbaum → Linsenschleiferei → Dampfmaschine → Elektrolabor → Sternwarte →
Spektrallabor → Atomuhr → Teilchenbeschleuniger

## Upgrades – an Wissen gekoppelt

- Pro Gebiet zwei Upgrades, freigeschaltet bei 5 bzw. 15 Entdeckungen in diesem
  Gebiet. Wirkung: Eingaben aus dem Gebiet **und** die zugehörige Einrichtung ×2.
- Allgemeine Upgrades nach Gesamtzahl der Entdeckungen: Tippwert ×1,5 / ×2 / ×3,
  längeres Combo-Fenster, „Wissensnetz“ (+1 % Produktion je Entdeckung),
  „Peer Review“ (Produktion ×2).
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
