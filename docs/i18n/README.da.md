# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animerede, tilgængelige diagrammer til din hjemmeside**

### ▶ [Live-demo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Søjler omkring en baseline, grupperede søjler, linjer, nøgletalsfliser og en tabelvisning. Almindeligt JavaScript og CSS uden afhængigheder: værdierne står ved siden af mærkerne, alle diagrammer virker med tastaturet, og med reduceret bevægelse bevæger intet sig.

## Brug

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

## Diagramtyper

| `type` | Viser |
|---|---|
| `bars` | Én søjle pr. værdi, der vokser fra en baseline (`baseline: 1` adskiller hurtigere fra langsommere). Flere serier giver grupperede søjler. |
| `lines` | Én linje pr. serie på tværs af kategorierne, mærket for enden af linjen. |
| `tiles` | Nøgletalsfliser med et tal, der tæller op, et mærke (▲ ▼ =) og en kort tekst. |
| `table` | En almindelig tabel. |

`bars` og `lines` har en omskifter mellem diagram og tabel, en signaturforklaring, der skjuler serier, og en aflæsning under diagrammet.

## Indstillinger

| Indstilling | Standard | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` eller `table` |
| `title` | | Diagrammets titel, også det tilgængelige navn |
| `desc` | | Kort beskrivelse under titlen |
| `categories` | | `[{ label, note }]`, `note` vises i aflæsningen og i tabellen |
| `series` | | `[{ name, values }]`, `null` for en manglende værdi |
| `baseline` | ingen (bars: 0) | Referenceværdi, tegnet som en linje |
| `baselineLabel` | | Tekst ved baselinen, for eksempel `Reference 1.0` |
| `sides` | | `[below, above]`, navne på baselinens to sider, også læst op i aflæsningen |
| `unit` | | Tilføjes til hvert tal, for eksempel `' ms'` |
| `digits` | `2` | Decimaler |
| `catHeader` | | Overskrift på tabellens første kolonne |
| `source` | | Fodtekst under diagrammet |
| `legend` | `true` | `false` skjuler signaturforklaringen |
| `zero` | `false` | Linjer: tag 0 med på værdiaksen |
| `labels` | engelsk | `{ chart, table, view, na, hint, keys }`, dine egne formuleringer |
| `lang` | sidens sprog | Talformat via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` eller `genre` |
| `theme` | automatisk | `light` eller `dark` for at gennemtvinge ét |
| `motion` | automatisk | `off` slår animationen fra |
| `items` | | Kun fliser: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` er `good`, `bad` eller `neutral` |

## API

- `PsoCharts.create(element, spec, options)` tegner et diagram i `element` og returnerer det. `options` tager `style`, `theme`, `motion` og `lang` som standardværdier for specifikationen.
- `chart.set(spec)` erstatter dataene, `chart.show('chart' | 'table')` skifter visning, `chart.destroy()` fjerner det.
- `PsoCharts.auto(root)` tegner hver `<div data-pso-chart>` på siden. Attributten rummer indstillingerne som JSON, `data-chart-source="#id"` angiver datakilden.
- `PsoCharts.read(element)`, `fromLd(json, id)` og `fromTable(table)` laver en datakilde om til en specifikation.

## Datakilder

Dataene kan komme fra tre steder. Indstillinger som `type` og `baseline` hører altid hjemme i attributten `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Tallene står på siden som strukturerede data, som også maskiner kan læse. Hver serie er en `PropertyValue` i `variableMeasured`; dens `valueReference` opregner én `PropertyValue` pr. kategori med `name` og `value`:

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

Med flere datasæt i én `@graph` angiver `dataset` det `@id`, der skal bruges. Skaber, teknik og `isBasedOn` (med `version`) bliver til fodteksten. En `description` på en kategoriværdi bliver dens note. Vi valgte `PropertyValue`, fordi det er en stabil schema.org-type; `Observation` er stadig markeret som afventende dér.

**HTML-tabel.** En eksisterende tabel bliver på siden, med eller uden script. Diagrammet tilføjes ved siden af. Kolonneoverskrifterne er serierne, rækkeoverskrifterne er kategorierne, en `data-value`-attribut på en celle rummer det nøjagtige tal:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Almindelig JSON.** Et `<script type="application/json">` med specifikationen (`categories`, `series`, ...) eller specifikationen direkte i `PsoCharts.create`.

## Stilarter og farver

Farverne er CSS-egenskaber (custom properties) på `.pc`, for lys og mørk (systemindstilling, `:root[data-theme]` eller `data-pc-theme`):

| Egenskab | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Baggrund, tekst, sekundær tekst |
| `--pc-grid`, `--pc-sep` | Gitterlinjer, skillelinjer |
| `--pc-0` til `--pc-3` | Seriefarver |
| `--pc-good`, `--pc-bad` | Flisekant for bedre og dårligere |
| `--pc-cur` | Kontur om det valgte mærke |
| `--pc-font`, `--pc-r` | Skrifttype og hjørneradius |

`data-pc-style` (eller indstillingen `style`) vælger ét af fire sæt: `house` (grøn), `gauge` (rav på papir eller sort, monospace), `plain` (sort-hvid med én accent) og `genre` (varm). Sæt egenskaberne på `.pc` eller på ét enkelt diagram for at bruge dine egne.

## Tilgængelighed

- Billedet er et `img` med en etiket; under det ligger et tastaturområde: Tab når frem til diagrammet, piletasterne skifter mellem mærker, Home og End hopper, Escape rydder valget. Det valgte mærke får en kontur og læses op i et `aria-live`-område.
- Hvert diagram har en tabelvisning med korrekte overskrifter. Serier adskilles ved mønster (søjler) og form (linjer), ikke kun ved farve; bedre og dårligere på fliser ved mærke og ord.
- Al tekst er mindst 13 px og har mindst 4,5:1 kontrast; mærker har mindst 3:1. Testsuiten kontrollerer alle fire stilarter i lys og mørk.
- Med reduceret bevægelse (systemindstilling eller `motion: 'off'`) tegnes søjler og linjer med det samme, og tallene tæller ikke op.

## Ydelse

Omkring 23 KB script og 8 KB CSS, omkring 10 KB gzippet tilsammen, uden afhængigheder. Diagrammer tegnes kun om ved ændring af bredden; animationen bruger CSS og starter, når diagrammet ruller ind i visningen.

## Tests

`python3 tools/build.py` bygger de tre filer fra `src/`. `python3 tests/browser.py` åbner `demo.html` i headless Chromium (kræver Python-pakken `websockets`), kontrollerer kontrast, skriftstørrelse, tastatur, tabelvisning og reduceret bevægelse, og `--photos <folder>` gemmer skærmbilleder i lys, mørk og reduceret bevægelse.

## Oversættelser

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licens

Koden er MIT-licenseret (se [LICENSE](../../LICENSE)). Demoværdierne er opdigtede (se [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Lavet til [psorvia.io](https://psorvia.io).
