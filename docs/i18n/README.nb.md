# PSOrvia Charts

**Animerte, tilgjengelige diagrammer for nettstedet ditt**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Live-demo](https://h-peterseim.github.io/psorvia-charts/)

Søyler, linjer, kake og ring, stablede og 100 %-søyler, flater, spredning og bobler, histogram, sparkline, måler, varmekart, radar, nøkkeltallsfliser og en tabellvisning. Ren JavaScript og CSS uten avhengigheter: verdiene står ved siden av markeringene, hvert diagram fungerer med tastaturet, og med redusert bevegelse beveger ingenting seg.

## Bruk

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<script src="psorvia-charts.extra.js"></script> <!-- kun for scatter, hist, gauge, heat, radar -->
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
import './psorvia-charts.extra.esm.js'; // kun for scatter, hist, gauge, heat, radar
auto();
</script>
```

Kjernen dekker søyler, linjer, flate, kake, ring, stablede og 100 %-søyler, fliser, sparkline og tabell. Spredning, histogram, måler, varmekart og radar ligger i en andre fil, `psorvia-charts.extra.js` (klassisk skript, last det etter hovedskriptet) eller `psorvia-charts.extra.esm.js` (modul). Uten den gir disse typene en tydelig feilmelding, og ellers endres ingenting.

## Diagramtyper

| `type` | Viser |
|---|---|
| `bars` | En søyle per verdi, som vokser fra en grunnlinje (`baseline: 1` skiller raskere fra tregere). Flere serier gir grupperte søyler. |
| `lines` | En linje per serie på tvers av kategoriene, merket ved enden av linjen. |
| `area` | Fylte linjer fra null; `stacked: true` stabler seriene (negative verdier teller som 0). |
| `stacked` | En søyle per kategori, seriene stablet etter hverandre; verdi i hvert segment, sum på slutten. |
| `percent` | Det samme som 100 %-søyler; hvert segment viser sin andel av kategorien. |
| `pie`, `donut` | En serie, en sektor per kategori, etikett med verdi og andel på en ledelinje (på smale skjermer i en liste under). Fra 7 sektorer slås de minste sammen til «Andre» (`maxSlices`, standard 6; `other: false` beholder alle). Ringen viser summen i midten (`center: 'mean'` for gjennomsnittet, `false` for ingenting). |
| `tiles` | Nøkkeltallsfliser med et tall som teller opp, et merke (▲ ▼ =) og en kort tekst. Et element kan ha `spark: [values]` for en liten linje og `prefix` (for eksempel `"+"`) som vises foran tallet. |
| `table` | En enkel tabell. |
| `spark` | En liten linje for løpende tekst og fliser: `values`, valgfri `width` og `height`; viser siste verdi, piltastene går gjennom punktene. |
| `scatter` | *(extra)* Punkter eller bobler. Kategoriene er punktene, første serie er x, andre y, en valgfri tredje er boblestørrelsen. |
| `hist` | *(extra)* Histogram av råverdiene i første serie; `bins` eller `binWidth`, ellers automatisk. Tabellvisningen viser klassene. |
| `gauge` | *(extra)* En måler per kategori fra første serie, `min` og `max`, valgfri `bands: [{ to, label }]` tegnet som mønstrede soner; sonenavnet står under tallet. |
| `heat` | *(extra)* Rutenett av kategorier (rader) og serier (kolonner), cellefarge etter verdien, tallet i hver celle. Tekstfargen velges slik at den holder 4,5:1 mot cellen. |
| `radar` | *(extra)* 3 til 8 akser (kategorier) og høyst 3 serier, verdier ved punktene. Flere akser eller serier avvises med en feil: utover dette er et radardiagram ikke lesbart, bruk søyler. |

`values` i stedet for `series` og `categories` er en snarvei for én enkelt serie (`hist`, `spark`); `value` er en snarvei for én `gauge`. Hver diagramtype unntatt `tiles`, `table` og `spark` har en bryter mellom diagram og tabell; serietyper har en forklaring som skjuler serier; alle har en opplesning under diagrammet.

## Alternativer

| Alternativ | Standard | |
|---|---|---|
| `type` | | En av typene ovenfor |
| `title` | | Diagramtittel, også det tilgjengelige navnet |
| `desc` | | Kort beskrivelse under tittelen |
| `categories` | | `[{ label, note }]`, `note` vises i opplesningen og i tabellen |
| `series` | | `[{ name, values }]`, `null` for en manglende verdi |
| `baseline` | none (bars: 0) | Referanseverdi, tegnet som en linje |
| `baselineLabel` | | Tekst ved grunnlinjen, for eksempel `Reference 1.0` |
| `sides` | | `[below, above]`, navn på de to sidene av grunnlinjen, leses også opp i opplesningen |
| `unit` | | Føyes til hvert tall, for eksempel `' ms'` |
| `digits` | `2` | Desimaler |
| `catHeader` | | Overskrift for første tabellkolonne |
| `source` | | Bunntekst under diagrammet |
| `legend` | `true` | `false` skjuler forklaringen |
| `zero` | `false` | Linjer: ta med 0 på verdiaksen |
| `stacked` | `false` | Flate: stable seriene |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Kake og ring, se ovenfor |
| `bins`, `binWidth` | automatic | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Måler |
| `labels` | English | `{ chart, table, view, series, na, source, hint, keys, other, sum, mean, share, count, range, size }`, din egen ordlyd; godtas også som alternativ til `create()` og `auto()` for alle diagrammer samtidig |
| `lang` | page language | Tallformat, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` eller `genre` |
| `theme` | automatic | `light` eller `dark` for å tvinge frem ett |
| `motion` | automatic | `off` slår av animasjonen |
| `items` | | Bare fliser: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` er `good`, `bad` eller `neutral` |

## API

- `PsoCharts.create(element, spec, options)` tegner et diagram i `element` og returnerer det. `options` tar `style`, `theme`, `motion` og `lang` som standardverdier for spesifikasjonen.
- `chart.set(spec)` erstatter dataene, `chart.show('chart' | 'table')` bytter visning, `chart.destroy()` fjerner det.
- `PsoCharts.auto(root)` tegner hver `<div data-pso-chart>` på siden. Attributtet inneholder alternativene som JSON, `data-chart-source="#id"` angir datakilden.
- `PsoCharts.read(element)`, `fromLd(json, id)` og `fromTable(table)` gjør en datakilde om til en spesifikasjon.

## Datakilder

Dataene kan komme fra tre steder. Alternativer som `type` og `baseline` settes alltid i attributtet `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Tallene står på siden som strukturerte data som maskiner også kan lese. Hver serie er en `PropertyValue` i `variableMeasured`; dens `valueReference` lister én `PropertyValue` per kategori med `name` og `value`:

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

Med flere datasett i én `@graph` angir `dataset` hvilken `@id` som skal brukes. Skaper, teknikk og `isBasedOn` (med `version`) blir bunnteksten. En `description` på en kategoriverdi blir dens merknad. Vi valgte `PropertyValue` fordi det er en stabil schema.org-type; `Observation` er der fortsatt merket som under behandling.

**HTML-tabell.** En eksisterende tabell blir stående på siden, med eller uten skript. Diagrammet legges til ved siden av. Kolonneoverskriftene er seriene, radoverskriftene kategoriene, et `data-value`-attributt på en celle holder det nøyaktige tallet:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Ren JSON.** Et `<script type="application/json">` med spesifikasjonen (`categories`, `series`, ...) eller spesifikasjonen direkte i `PsoCharts.create`.

## Stiler og farger

Fargene er CSS-egendefinerte egenskaper på `.pc`, for lys og mørk (systeminnstilling, `:root[data-theme]` eller `data-pc-theme`):

| Egenskap | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Bakgrunn, tekst, sekundærtekst |
| `--pc-grid`, `--pc-sep` | Rutenettlinjer, skillelinjer |
| `--pc-0` til `--pc-5` | Serie- og sektorfarger; `--pc-5` er også fargen til «Andre» |
| `--pc-good`, `--pc-bad` | Flikekant for bedre og dårligere |
| `--pc-cur` | Omriss av den valgte markeringen |
| `--pc-font`, `--pc-r` | Skrift og hjørneradius |

`data-pc-style` (eller alternativet `style`) velger ett av fire sett: `house` (grønn), `gauge` (rav på papir eller svart, monospace), `plain` (svart-hvitt med én aksent) og `genre` (varm). Sett egenskapene på `.pc` eller på et enkelt diagram for å bruke dine egne.

## Tilgjengelighet

- Bildet er et `img` med etikett; under det ligger et tastaturområde: Tab når diagrammet, piltastene beveger mellom markeringer (sektorer, punkter, celler, målere, klasser), Home og End hopper, Escape fjerner valget. Den valgte markeringen får omriss og leses opp i en `aria-live`-region.
- Hvert diagram har en tabellvisning med riktige overskrifter. Serier og sektorer skiller seg med mønster (søyler, flater, kaker) og form (linjer, punkter), ikke bare med farge; varmekartceller bærer tallet sitt, målersoner navnet sitt; bedre og dårligere på fliser ved merke og ord.
- All tekst er minst 13 px og har minst 4,5:1 kontrast; markeringer har minst 3:1. Testpakken kontrollerer alle fire stiler i lys og mørk.
- Med redusert bevegelse (systeminnstilling eller `motion: 'off'`) tegnes søyler og linjer med én gang, og tallene teller ikke opp.

## Ytelse

Kjernen er omtrent 37 KB skript og 12 KB CSS, 14,7 KB gzippet til sammen; de ekstra typene legger til 5,6 KB gzippet. Ingen avhengigheter. Diagrammer tegnes bare på nytt ved breddeendring; animasjonen bruker CSS og starter når diagrammet ruller inn i visningen.

## Tester

`python3 tools/build.py` bygger de fem filene fra `src/`. `python3 tests/browser.py` åpner `demo.html` i hodeløs Chromium (krever Python-pakken `websockets`), kontrollerer kontrast, skriftstørrelse, tastatur, tabellvisning og redusert bevegelse for hver type, alle tre datakilder, tekst som går utenfor diagrammet, og `--photos <folder>` lagrer skjermbilder i lys, mørk og redusert bevegelse.

## Oversettelser

[English](README.md) · [Deutsch](docs/i18n/README.de.md) · [Български](docs/i18n/README.bg.md) · [Čeština](docs/i18n/README.cs.md) · [Dansk](docs/i18n/README.da.md) · [Ελληνικά](docs/i18n/README.el.md) · [Español](docs/i18n/README.es.md) · [Eesti](docs/i18n/README.et.md) · [Suomi](docs/i18n/README.fi.md) · [Français](docs/i18n/README.fr.md) · [Gaeilge](docs/i18n/README.ga.md) · [Hrvatski](docs/i18n/README.hr.md) · [Magyar](docs/i18n/README.hu.md) · [Italiano](docs/i18n/README.it.md) · [Lietuvių](docs/i18n/README.lt.md) · [Latviešu](docs/i18n/README.lv.md) · [Malti](docs/i18n/README.mt.md) · [Norsk bokmål](docs/i18n/README.nb.md) · [Nederlands](docs/i18n/README.nl.md) · [Polski](docs/i18n/README.pl.md) · [Português](docs/i18n/README.pt.md) · [Română](docs/i18n/README.ro.md) · [Slovenčina](docs/i18n/README.sk.md) · [Slovenščina](docs/i18n/README.sl.md) · [Svenska](docs/i18n/README.sv.md) · [Türkçe](docs/i18n/README.tr.md)

## Lisens

Koden er lisensiert under MIT (se [LICENSE](LICENSE)). Demoverdiene er oppdiktet (se [media/LICENSE.md](media/LICENSE.md)).

SPDX-License-Identifier: MIT

Laget for [psorvia.io](https://psorvia.io).
