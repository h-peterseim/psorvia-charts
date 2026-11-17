# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Geanimeerde, toegankelijke grafieken voor je website**

### ▶ [Live-demo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Staven rond een basislijn, gegroepeerde staven, lijnen, tegels met kerncijfers en een tabelweergave. Gewoon JavaScript en CSS zonder afhankelijkheden: de waarden staan naast de markeringen, elke grafiek werkt met het toetsenbord en bij beperkte beweging beweegt er niets.

## Gebruik

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
auto();
</script>
```

## Soorten grafieken

| `type` | Toont |
|---|---|
| `bars` | Eén staaf per waarde, groeiend vanaf een basislijn (`baseline: 1` scheidt sneller van langzamer). Meerdere reeksen geven gegroepeerde staven. |
| `lines` | Eén lijn per reeks over de categorieën, met een label aan het einde van de lijn. |
| `tiles` | Tegels met kerncijfers: een getal dat optelt, een markering (▲ ▼ =) en een korte tekst. |
| `table` | Een gewone tabel. |

`bars` en `lines` hebben een schakelaar tussen grafiek en tabel, een legenda waarmee je reeksen verbergt en een uitleesveld onder de grafiek.

## Opties

| Optie | Standaard | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` of `table` |
| `title` | | Titel van de grafiek, ook de toegankelijke naam |
| `desc` | | Korte beschrijving onder de titel |
| `categories` | | `[{ label, note }]`, `note` wordt getoond in het uitleesveld en in de tabel |
| `series` | | `[{ name, values }]`, `null` voor een ontbrekende waarde |
| `baseline` | geen (bars: 0) | Referentiewaarde, getekend als lijn |
| `baselineLabel` | | Tekst bij de basislijn, bijvoorbeeld `Reference 1.0` |
| `sides` | | `[below, above]`, namen van de twee kanten van de basislijn, ook uitgesproken in het uitleesveld |
| `unit` | | Wordt achter elk getal gezet, bijvoorbeeld `' ms'` |
| `digits` | `2` | Decimalen |
| `catHeader` | | Kop van de eerste tabelkolom |
| `source` | | Voettekst onder de grafiek |
| `legend` | `true` | `false` verbergt de legenda |
| `zero` | `false` | Lijnen: neem 0 op in de waardeas |
| `labels` | Engels | `{ chart, table, view, na, hint, keys }`, je eigen formulering |
| `lang` | paginataal | Getalnotatie, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` of `genre` |
| `theme` | automatisch | `light` of `dark` om er een te forceren |
| `motion` | automatisch | `off` schakelt de animatie uit |
| `items` | | Alleen tegels: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` is `good`, `bad` of `neutral` |

## API

- `PsoCharts.create(element, spec, options)` tekent een grafiek in `element` en geeft die terug. `options` accepteert `style`, `theme`, `motion` en `lang` als standaardwaarden voor de spec.
- `chart.set(spec)` vervangt de gegevens, `chart.show('chart' | 'table')` wisselt de weergave, `chart.destroy()` verwijdert de grafiek.
- `PsoCharts.auto(root)` tekent elke `<div data-pso-chart>` op de pagina. Het attribuut bevat de opties als JSON, `data-chart-source="#id"` noemt de gegevensbron.
- `PsoCharts.read(element)`, `fromLd(json, id)` en `fromTable(table)` zetten een gegevensbron om in een spec.

## Gegevensbronnen

De gegevens kunnen uit drie bronnen komen. Opties zoals `type` en `baseline` komen altijd in het attribuut `data-pso-chart`.

**JSON-LD (schema.org Dataset).** De cijfers staan in de pagina als gestructureerde gegevens die ook machines kunnen lezen. Elke reeks is een `PropertyValue` in `variableMeasured`; de `valueReference` daarvan bevat per categorie één `PropertyValue` met `name` en `value`:

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

Bij meerdere datasets in één `@graph` geeft `dataset` de te gebruiken `@id` aan. Maker, techniek en `isBasedOn` (met `version`) vormen de voettekst. Een `description` bij een categoriewaarde wordt de bijbehorende toelichting. We kozen `PropertyValue` omdat het een stabiel schema.org-type is; `Observation` staat daar nog als in behandeling.

**HTML-tabel.** Een bestaande tabel blijft in de pagina staan, met of zonder script. De grafiek wordt ernaast toegevoegd. Kolomkoppen zijn de reeksen, rijkoppen de categorieën, een `data-value`-attribuut op een cel bevat het exacte getal:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Gewone JSON.** Een `<script type="application/json">` met de spec (`categories`, `series`, ...) of de spec rechtstreeks in `PsoCharts.create`.

## Stijlen en kleuren

De kleuren zijn CSS custom properties op `.pc`, voor licht en donker (systeeminstelling, `:root[data-theme]` of `data-pc-theme`):

| Eigenschap | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Achtergrond, tekst, secundaire tekst |
| `--pc-grid`, `--pc-sep` | Rasterlijnen, scheidingslijnen |
| `--pc-0` tot `--pc-3` | Reekskleuren |
| `--pc-good`, `--pc-bad` | Tegelrand voor beter en slechter |
| `--pc-cur` | Omlijning van de geselecteerde markering |
| `--pc-font`, `--pc-r` | Lettertype en hoekradius |

`data-pc-style` (of de optie `style`) kiest een van vier sets: `house` (groen), `gauge` (amber op papier of zwart, monospace), `plain` (zwart-wit met één accent) en `genre` (warm). Zet de eigenschappen op `.pc` of op één grafiek om je eigen kleuren te gebruiken.

## Toegankelijkheid

- De afbeelding is een `img` met een label; eronder zit een toetsenbordgebied: met Tab kom je bij de grafiek, de pijltjestoetsen gaan van markering naar markering, Home en End springen, Escape wist de selectie. De geselecteerde markering krijgt een omlijning en wordt voorgelezen in een `aria-live`-gebied.
- Elke grafiek heeft een tabelweergave met correcte koppen. Reeksen verschillen door patroon (staven) en vorm (lijnen), niet alleen door kleur; beter en slechter bij tegels door markering en woord.
- Alle tekst is minstens 13 px en heeft een contrast van minstens 4,5:1; markeringen hebben minstens 3:1. De testsuite controleert alle vier de stijlen in licht en donker.
- Bij beperkte beweging (systeeminstelling of `motion: 'off'`) worden staven en lijnen meteen getekend en tellen de getallen niet op.

## Prestaties

Ongeveer 23 KB script en 8 KB CSS, samen ongeveer 10 KB gzipped, zonder afhankelijkheden. Grafieken worden alleen opnieuw getekend als de breedte verandert; de animatie gebruikt CSS en start zodra de grafiek in beeld scrolt.

## Tests

`python3 tools/build.py` bouwt de drie bestanden uit `src/`. `python3 tests/browser.py` opent `demo.html` in headless Chromium (vereist het Python-pakket `websockets`), controleert contrast, lettergrootte, toetsenbord, tabelweergave en beperkte beweging, en `--photos <folder>` slaat schermafbeeldingen op in licht, donker en beperkte beweging.

## Vertalingen

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licentie

De code valt onder de MIT-licentie (zie [LICENSE](../../LICENSE)). De demowaarden zijn verzonnen (zie [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Gemaakt voor [psorvia.io](https://psorvia.io).
