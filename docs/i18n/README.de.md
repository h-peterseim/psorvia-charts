# PSOrvia Charts

**Animierte, barrierefreie Diagramme für deine Website**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Live-Demo](https://h-peterseim.github.io/psorvia-charts/)

Balken, Linien, Kreis- und Ringdiagramme, gestapelte und 100-%-Balken, Flächen, Streu- und Blasendiagramme, Histogramm, Sparkline, Tacho, Heatmap, Radar, Kennzahl-Kacheln und eine Tabellenansicht. Reines JavaScript und CSS ohne Abhängigkeiten: Die Werte stehen neben den Marken, jedes Diagramm funktioniert mit der Tastatur, und bei reduzierter Bewegung bewegt sich nichts.

## Einbindung

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<div id="speed"></div>
<script>
PsoCharts.create(document.getElementById('speed'), {
  type: 'bars', title: 'Speed', baseline: 1, baselineLabel: 'Reference 1.0', sides: ['faster', 'slower'],
  categories: [{ label: 'Read' }, { label: 'Write' }],
  series: [{ name: 'Run A', values: [0.8, 1.2] }, { name: 'Run B', values: [0.7, 1.1] }]
});
</script>
```

```html
<script type="module">
import { create, auto } from './psorvia-charts.esm.js';
import './psorvia-charts.extra.esm.js'; // nur für scatter, hist, gauge, heat, radar
auto();
</script>

Der Kern enthält Balken, Linien, Fläche, Kreis, Ring, gestapelte und 100-%-Balken, Kacheln, Sparkline und Tabelle. Streu-, Histogramm-, Tacho-, Heatmap- und Radardiagramm liegen in einer zweiten Datei, `psorvia-charts.extra.js` (klassisches Skript, nach dem Hauptskript laden) oder `psorvia-charts.extra.esm.js` (Modul). Ohne sie melden diese Typen einen klaren Fehler, und sonst ändert sich nichts.
```

## Diagrammtypen

| `type` | Zeigt |
|---|---|
| `bars` | Einen Balken je Wert, der von einer Bezugslinie aus wächst (`baseline: 1` trennt schneller von langsamer). Mehrere Serien ergeben gruppierte Balken. |
| `lines` | Eine Linie je Serie über die Kategorien, am Linienende beschriftet. |
| `area` | Gefüllte Linien ab null; `stacked: true` stapelt die Serien (negative Werte zählen als 0). |
| `stacked` | Ein Balken je Kategorie, die Serien aneinandergereiht; Wert in jedem Abschnitt, Summe am Ende. |
| `percent` | Dasselbe als 100-%-Balken; jeder Abschnitt zeigt seinen Anteil an der Kategorie. |
| `pie`, `donut` | Eine Serie, ein Stück je Kategorie, Beschriftung mit Wert und Anteil an einer Führungslinie (auf schmalen Bildschirmen in einer Liste darunter). Ab 7 Stücken werden die kleinsten zu „Andere“ zusammengefasst (`maxSlices`, Standard 6; `other: false` behält alle). Der Ring zeigt die Summe in der Mitte (`center: 'mean'` für den Mittelwert, `false` für nichts). |
| `tiles` | Kennzahl-Kacheln mit einer hochzählenden Zahl, einer Marke (▲ ▼ =) und einem kurzen Text. Ein Eintrag kann `spark: [values]` für eine kleine Linie tragen. |
| `table` | Eine einfache Tabelle. |
| `spark` | Eine kleine Linie für Fließtext und Kacheln: `values`, optional `width` und `height`; zeigt den letzten Wert, die Pfeiltasten gehen durch die Punkte. |
| `scatter` | *(extra)* Punkte oder Blasen. Die Kategorien sind die Punkte, die erste Serie ist x, die zweite y, eine optionale dritte die Blasengröße. |
| `hist` | *(extra)* Histogramm der Rohwerte der ersten Serie; `bins` oder `binWidth`, sonst automatisch. Die Tabellenansicht zeigt die Klassen. |
| `gauge` | *(extra)* Ein Zifferblatt je Kategorie aus der ersten Serie, `min` und `max`, optional `bands: [{ to, label }]` als gemusterte Zonen; der Zonenname steht unter der Zahl. |
| `heat` | *(extra)* Raster aus Kategorien (Zeilen) und Serien (Spalten), Zellfarbe nach dem Wert, die Zahl in jeder Zelle. Die Textfarbe wird so gewählt, dass sie 4,5:1 gegen die Zelle hält. |
| `radar` | *(extra)* 3 bis 8 Achsen (Kategorien) und höchstens 3 Serien, Werte an den Punkten. Mehr Achsen oder Serien werden mit einem Fehler abgelehnt: darüber ist ein Radardiagramm nicht lesbar, nimm Balken. |

`values` statt `series` und `categories` ist eine Abkürzung für eine einzelne Serie (`hist`, `spark`); `value` ist eine Abkürzung für ein einzelnes `gauge`. Jeder Diagrammtyp außer `tiles`, `table` und `spark` hat einen Umschalter zwischen Diagramm und Tabelle; Serientypen haben eine Legende, die Serien ausblendet; alle haben eine Anzeige unter dem Diagramm.

## Optionen

| Option | Standard | |
|---|---|---|
| `type` | | Einer der obigen Typen |
| `title` | | Diagrammtitel, zugleich der zugängliche Name |
| `desc` | | Kurze Beschreibung unter dem Titel |
| `categories` | | `[{ label, note }]`, `note` erscheint in der Anzeige und in der Tabelle |
| `series` | | `[{ name, values }]`, `null` für einen fehlenden Wert |
| `baseline` | keine (bars: 0) | Bezugswert, als Linie gezeichnet |
| `baselineLabel` | | Text an der Bezugslinie, zum Beispiel `Reference 1.0` |
| `sides` | | `[below, above]`, Namen der beiden Seiten der Bezugslinie, auch in der Anzeige vorgelesen |
| `unit` | | An jede Zahl angehängt, zum Beispiel `' ms'` |
| `digits` | `2` | Nachkommastellen |
| `catHeader` | | Kopf der ersten Tabellenspalte |
| `source` | | Fußtext unter dem Diagramm |
| `legend` | `true` | `false` blendet die Legende aus |
| `zero` | `false` | Linien: 0 in die Wertachse aufnehmen |
| `stacked` | `false` | Fläche: Serien stapeln |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Kreis und Ring, siehe oben |
| `bins`, `binWidth` | automatisch | Histogramm |
| `min`, `max`, `bands` | `0`, `100` | Tacho (`gauge`) |
| `labels` | Englisch | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, deine eigenen Formulierungen |
| `lang` | Seitensprache | Zahlenformat über `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` oder `genre` |
| `theme` | automatisch | `light` oder `dark`, um eines zu erzwingen |
| `motion` | automatisch | `off` schaltet die Animation aus |
| `items` | | Nur Kacheln: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` ist `good`, `bad` oder `neutral` |

## API

- `PsoCharts.create(element, spec, options)` zeichnet ein Diagramm in `element` und gibt es zurück. `options` nimmt `style`, `theme`, `motion` und `lang` als Vorgaben für die Spezifikation.
- `chart.set(spec)` ersetzt die Daten, `chart.show('chart' | 'table')` wechselt die Ansicht, `chart.destroy()` entfernt das Diagramm.
- `PsoCharts.auto(root)` zeichnet jedes `<div data-pso-chart>` der Seite. Das Attribut enthält die Optionen als JSON, `data-chart-source="#id"` benennt die Datenquelle.
- `PsoCharts.read(element)`, `fromLd(json, id)` und `fromTable(table)` machen aus einer Datenquelle eine Spezifikation.

## Datenquellen

Die Daten können aus drei Quellen kommen. Optionen wie `type` und `baseline` gehören immer ins Attribut `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Die Zahlen stehen als strukturierte Daten in der Seite, die auch Maschinen lesen können. Jede Serie ist eine `PropertyValue` in `variableMeasured`; ihre `valueReference` listet je Kategorie eine `PropertyValue` mit `name` und `value` auf:

```html
<script type="application/ld+json" id="data">
{ "@context": "https://schema.org", "@type": "Dataset", "@id": "https://example.org/p#speed",
  "name": "Speed", "creator": { "@type": "Organization", "name": "Example" },
  "measurementTechnique": "Wall clock", "isBasedOn": { "@type": "SoftwareSourceCode", "name": "Example", "version": "1.2.0" },
  "variableMeasured": [
    { "@type": "PropertyValue", "name": "Run A", "unitText": "ratio",
      "valueReference": [ { "@type": "PropertyValue", "name": "Read", "value": 0.8 }, { "@type": "PropertyValue", "name": "Write", "value": 1.2 } ] } ] }
</script>
<div data-pso-chart='{"type":"bars","baseline":1,"dataset":"https://example.org/p#speed"}' data-chart-source="#data"></div>
<script>PsoCharts.auto();</script>
```

Bei mehreren Datensätzen in einem `@graph` benennt `dataset` die zu verwendende `@id`. Urheber, Verfahren und `isBasedOn` (mit `version`) werden zum Fußtext. Eine `description` an einem Kategoriewert wird zu dessen Notiz. Wir haben `PropertyValue` gewählt, weil es ein stabiler schema.org-Typ ist; `Observation` ist dort noch als ausstehend markiert.

**HTML-Tabelle.** Eine vorhandene Tabelle bleibt in der Seite, mit oder ohne Skript. Das Diagramm kommt daneben. Spaltenköpfe sind die Serien, Zeilenköpfe die Kategorien, ein `data-value`-Attribut an einer Zelle enthält die genaue Zahl:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Reines JSON.** Ein `<script type="application/json">` mit der Spezifikation (`categories`, `series`, ...) oder die Spezifikation direkt in `PsoCharts.create`.

## Stile und Farben

Die Farben sind CSS-Eigenschaften (Custom Properties) auf `.pc`, für Hell und Dunkel (Systemeinstellung, `:root[data-theme]` oder `data-pc-theme`):

| Eigenschaft | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Hintergrund, Text, Nebentext |
| `--pc-grid`, `--pc-sep` | Gitterlinien, Trennlinien |
| `--pc-0` bis `--pc-5` | Serien- und Stückfarben; `--pc-5` ist zugleich die Farbe von „Andere“ |
| `--pc-good`, `--pc-bad` | Kachelrand für besser und schlechter |
| `--pc-cur` | Umriss der ausgewählten Marke |
| `--pc-font`, `--pc-r` | Schrift und Eckenradius |

`data-pc-style` (oder die Option `style`) wählt einen von vier Sätzen: `house` (grün), `gauge` (Bernstein auf Papier oder Schwarz, Festbreitenschrift), `plain` (Schwarzweiß mit einem Akzent) und `genre` (warm). Setze die Eigenschaften auf `.pc` oder auf einem einzelnen Diagramm, um eigene zu verwenden.

## Barrierefreiheit

- Das Bild ist ein `img` mit Beschriftung; darunter liegt ein Tastaturbereich: Mit Tab erreichst du das Diagramm, die Pfeiltasten wechseln zwischen Marken (Stücken, Punkten, Zellen, Zifferblättern, Klassen), Pos1 und Ende springen, Escape hebt die Auswahl auf. Die ausgewählte Marke wird umrandet und in einem `aria-live`-Bereich vorgelesen.
- Jedes Diagramm hat eine Tabellenansicht mit richtigen Überschriften. Serien und Stücke unterscheiden sich durch Muster (Balken, Flächen, Kreise) und Form (Linien, Punkte), nicht nur durch Farbe; Heatmap-Zellen tragen ihre Zahl, Tacho-Zonen ihren Namen; besser und schlechter auf Kacheln durch Marke und Wort.
- Aller Text ist mindestens 13 px groß und hat mindestens 4,5:1 Kontrast; Marken haben mindestens 3:1. Die Testsuite prüft alle vier Stile in Hell und Dunkel.
- Bei reduzierter Bewegung (Systemeinstellung oder `motion: 'off'`) werden Balken und Linien sofort gezeichnet, und die Zahlen zählen nicht hoch.

## Leistung

Der Kern hat etwa 37 KB Skript und 12 KB CSS, zusammen 14,7 KB gzip-komprimiert; die Zusatztypen kommen mit 5,6 KB gzip dazu. Ohne Abhängigkeiten. Diagramme werden nur bei Breitenänderung neu gezeichnet; die Animation nutzt CSS und startet, wenn das Diagramm ins Bild scrollt.

## Tests

`python3 tools/build.py` baut die fünf Dateien aus `src/`. `python3 tests/browser.py` öffnet `demo.html` in headless Chromium (braucht das Python-Paket `websockets`), prüft Kontrast, Schriftgröße, Tastatur, Tabellenansicht und reduzierte Bewegung für jeden Typ, alle drei Datenquellen, Text, der aus dem Diagramm ragt, und `--photos <folder>` speichert Screenshots in Hell, Dunkel und mit reduzierter Bewegung.

## Übersetzungen

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Lizenz

Der Code steht unter der MIT-Lizenz (siehe [LICENSE](../../LICENSE)). Die Demo-Werte sind erfunden (siehe [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Gebaut für [psorvia.io](https://psorvia.io).
