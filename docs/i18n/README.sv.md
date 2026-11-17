# PSOrvia Charts

**Animerade, tillgängliga diagram för din webbplats**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Livedemo](https://h-peterseim.github.io/psorvia-charts/)

Staplar, linjer, cirkel- och ringdiagram, staplade och 100-procentsstaplar, ytor, punkt- och bubbeldiagram, histogram, sparkline, mätare, värmekarta, radar, brickor med nyckeltal och en tabellvy. Ren JavaScript och CSS utan beroenden: värdena står intill markeringarna, varje diagram fungerar med tangentbord, och vid reducerad rörelse rör sig ingenting.

## Användning

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
import './psorvia-charts.extra.esm.js'; // endast för scatter, hist, gauge, heat, radar
auto();
</script>

Kärnan omfattar staplar, linjer, yta, cirkel, ring, staplade och 100-procentsstaplar, brickor, sparkline och tabell. Punktdiagram, histogram, mätare, värmekarta och radar finns i en andra fil, `psorvia-charts.extra.js` (klassiskt skript, ladda det efter huvudskriptet) eller `psorvia-charts.extra.esm.js` (modul). Utan den rapporterar dessa typer ett tydligt fel och inget annat ändras.
```

## Diagramtyper

| `type` | Visar |
|---|---|
| `bars` | En stapel per värde, växande från en baslinje (`baseline: 1` skiljer snabbare från långsammare). Flera serier ger grupperade staplar. |
| `lines` | En linje per serie över kategorierna, med etikett i slutet av linjen. |
| `area` | Fyllda linjer från noll; `stacked: true` staplar serierna (negativa värden räknas som 0). |
| `stacked` | En stapel per kategori, serierna lagda efter varandra; värdet i varje segment, totalen i slutet. |
| `percent` | Samma sak som 100-procentsstaplar; varje segment visar sin andel av kategorin. |
| `pie`, `donut` | En serie, en sektor per kategori, etikett med värde och andel på en ledlinje (på smala skärmar i en lista under diagrammet). Från 7 sektorer slås de minsta ihop till ”Övrigt” (`maxSlices`, standard 6; `other: false` behåller alla). Ringen visar totalen i mitten (`center: 'mean'` för medelvärdet, `false` för ingenting). |
| `tiles` | Brickor med nyckeltal: ett tal som räknar upp, en markering (▲ ▼ =) och en kort text. Ett objekt kan ha `spark: [values]` för en liten linje. |
| `table` | En vanlig tabell. |
| `spark` | En liten linje för löpande text och brickor: `values`, valfritt `width` och `height`; visar det sista värdet, piltangenterna stegar genom punkterna. |
| `scatter` | *(extra)* Punkter eller bubblor. Kategorierna är punkterna, första serien är x, andra y, en valfri tredje ger bubblans storlek. |
| `hist` | *(extra)* Histogram över råvärdena i första serien; `bins` eller `binWidth`, annars automatiskt. Tabellvyn visar klasserna. |
| `gauge` | *(extra)* En mätare per kategori från första serien, `min` och `max`, valfritt `bands: [{ to, label }]` ritade som mönstrade zoner; zonens namn står under talet. |
| `heat` | *(extra)* Rutnät av kategorier (rader) och serier (kolumner), cellfärg efter värdet, talet i varje cell. Textfärgen väljs så att den håller 4,5:1 mot cellen. |
| `radar` | *(extra)* 3 till 8 axlar (kategorier) och högst 3 serier, värden vid punkterna. Fler axlar eller serier avvisas med ett fel: bortom det går ett radardiagram inte att läsa, använd staplar. |

`values` i stället för `series` och `categories` är en genväg för en enda serie (`hist`, `spark`); `value` är en genväg för en enda `gauge`. Varje diagramtyp utom `tiles`, `table` och `spark` har en omkopplare mellan diagram och tabell; serietyper har en förklaring som döljer serier; alla har en avläsning under diagrammet.

## Alternativ

| Alternativ | Standard | |
|---|---|---|
| `type` | | En av typerna ovan |
| `title` | | Diagrammets rubrik, även det tillgängliga namnet |
| `desc` | | Kort beskrivning under rubriken |
| `categories` | | `[{ label, note }]`, `note` visas i avläsningen och i tabellen |
| `series` | | `[{ name, values }]`, `null` för ett saknat värde |
| `baseline` | ingen (bars: 0) | Referensvärde, ritat som en linje |
| `baselineLabel` | | Text vid baslinjen, till exempel `Reference 1.0` |
| `sides` | | `[below, above]`, namnen på baslinjens två sidor, även uppläst i avläsningen |
| `unit` | | Läggs till efter varje tal, till exempel `' ms'` |
| `digits` | `2` | Decimaler |
| `catHeader` | | Rubrik för tabellens första kolumn |
| `source` | | Sidfotstext under diagrammet |
| `legend` | `true` | `false` döljer förklaringen |
| `zero` | `false` | Linjer: ta med 0 på värdeaxeln |
| `stacked` | `false` | Yta: stapla serierna |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Cirkel och ring, se ovan |
| `bins`, `binWidth` | automatiskt | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Mätare (`gauge`) |
| `labels` | engelska | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, dina egna formuleringar |
| `lang` | sidans språk | Talformat, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` eller `genre` |
| `theme` | automatiskt | `light` eller `dark` för att tvinga fram ett |
| `motion` | automatiskt | `off` stänger av animationen |
| `items` | | Bara brickor: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` är `good`, `bad` eller `neutral` |

## API

- `PsoCharts.create(element, spec, options)` ritar ett diagram i `element` och returnerar det. `options` tar `style`, `theme`, `motion` och `lang` som standardvärden för spec.
- `chart.set(spec)` ersätter data, `chart.show('chart' | 'table')` byter vy, `chart.destroy()` tar bort diagrammet.
- `PsoCharts.auto(root)` ritar varje `<div data-pso-chart>` på sidan. Attributet innehåller alternativen som JSON, `data-chart-source="#id"` anger datakällan.
- `PsoCharts.read(element)`, `fromLd(json, id)` och `fromTable(table)` gör om en datakälla till en spec.

## Datakällor

Data kan komma från tre ställen. Alternativ som `type` och `baseline` hamnar alltid i attributet `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Siffrorna finns på sidan som strukturerad data som även maskiner kan läsa. Varje serie är en `PropertyValue` i `variableMeasured`; dess `valueReference` listar en `PropertyValue` per kategori med `name` och `value`:

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

Med flera dataset i en `@graph` anger `dataset` vilket `@id` som används. Upphovsperson, teknik och `isBasedOn` (med `version`) blir sidfoten. En `description` på ett kategorivärde blir dess anteckning. Vi valde `PropertyValue` eftersom det är en stabil schema.org-typ; `Observation` är där fortfarande markerad som under behandling.

**HTML-tabell.** En befintlig tabell finns kvar på sidan, med eller utan skript. Diagrammet läggs till bredvid. Kolumnrubrikerna är serierna, radrubrikerna kategorierna, ett `data-value`-attribut på en cell håller det exakta talet:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Vanlig JSON.** Ett `<script type="application/json">` med spec (`categories`, `series`, ...) eller spec direkt i `PsoCharts.create`.

## Stilar och färger

Färgerna är anpassade CSS-egenskaper på `.pc`, för ljust och mörkt (systeminställning, `:root[data-theme]` eller `data-pc-theme`):

| Egenskap | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Bakgrund, text, sekundär text |
| `--pc-grid`, `--pc-sep` | Rutnätslinjer, avskiljare |
| `--pc-0` till `--pc-5` | Serie- och sektorfärger; `--pc-5` är också färgen för ”Övrigt” |
| `--pc-good`, `--pc-bad` | Brickkant för bättre och sämre |
| `--pc-cur` | Kontur kring den valda markeringen |
| `--pc-font`, `--pc-r` | Typsnitt och hörnradie |

`data-pc-style` (eller alternativet `style`) väljer en av fyra uppsättningar: `house` (grön), `gauge` (bärnsten på papper eller svart, monospace), `plain` (svartvitt med en accent) och `genre` (varm). Sätt egenskaperna på `.pc` eller på ett enskilt diagram för att använda dina egna.

## Tillgänglighet

- Bilden är en `img` med en etikett; under den finns en tangentbordsyta: Tab når diagrammet, piltangenterna flyttar mellan markeringar (sektorer, punkter, celler, mätare, klasser), Home och End hoppar, Escape rensar. Den valda markeringen får en kontur och läses upp i en `aria-live`-region.
- Varje diagram har en tabellvy med riktiga rubriker. Serier och sektorer skiljer sig åt genom mönster (staplar, ytor, cirklar) och form (linjer, punkter), inte bara färg; värmekartans celler bär sitt tal, mätarens zoner sitt namn; bättre och sämre på brickor genom markering och ord.
- All text är minst 13 px och har minst 4,5:1 i kontrast; markeringar har minst 3:1. Testsviten kontrollerar alla fyra stilar i ljust och mörkt.
- Vid reducerad rörelse (systeminställning eller `motion: 'off'`) ritas staplar och linjer på en gång och talen räknar inte upp.

## Prestanda

Kärnan är cirka 37 KB skript och 12 KB CSS, tillsammans 14,7 KB gzippat; extratyperna lägger till 5,6 KB gzippat. Inga beroenden. Diagram ritas om bara när bredden ändras; animationen använder CSS och startar när diagrammet rullas i bild.

## Tester

`python3 tools/build.py` bygger de fem filerna från `src/`. `python3 tests/browser.py` öppnar `demo.html` i headless Chromium (kräver Python-paketet `websockets`), kontrollerar kontrast, teckenstorlek, tangentbord, tabellvy och reducerad rörelse för varje typ, alla tre datakällor, text som sticker ut ur diagrammet, och `--photos <folder>` sparar skärmbilder i ljust, mörkt och reducerad rörelse.

## Översättningar

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licens

Koden har MIT-licens (se [LICENSE](../../LICENSE)). Demovärdena är påhittade (se [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Byggd för [psorvia.io](https://psorvia.io).
