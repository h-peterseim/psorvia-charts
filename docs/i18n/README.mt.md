# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Charts animati u aċċessibbli għas-sit web tiegħek**

### ▶ [Demo ħajja](https://h-peterseim.github.io/psorvia-charts/demo.html)

Vireg madwar linja bażi, vireg miġbura f'gruppi, linji, tiles taċ-ċifri ewlenin u veduta ta' tabella. JavaScript u CSS sempliċi mingħajr dipendenzi: il-valuri jinsabu ħdejn il-marki, kull chart jaħdem bit-tastiera, u b'moviment imnaqqas xejn ma jiċċaqlaq.

## Użu

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

## Tipi ta' chart

| `type` | Juri |
|---|---|
| `bars` | Vireg wieħed għal kull valur, li jikber minn linja bażi (`baseline: 1` jifred l-aktar mgħaġġel mill-aktar bil-mod). Diversi sensiela jagħtu vireg miġbura f'gruppi. |
| `lines` | Linja waħda għal kull sensiela matul il-kategoriji, b'tikketta fl-aħħar tal-linja. |
| `tiles` | Tiles taċ-ċifri ewlenin b'numru li jgħodd 'il fuq, marka (▲ ▼ =) u test qasir. |
| `table` | Tabella sempliċi. |

`bars` u `lines` għandhom swiċċ bejn chart u tabella, leġġenda li taħbi s-sensiela, u qari taħt il-chart.

## Għażliet

| Għażla | Predefinit | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` jew `table` |
| `title` | | Titlu tal-chart, ukoll l-isem aċċessibbli |
| `desc` | | Deskrizzjoni qasira taħt it-titlu |
| `categories` | | `[{ label, note }]`, `note` jidher fil-qari u fit-tabella |
| `series` | | `[{ name, values }]`, `null` għal valur nieqes |
| `baseline` | xejn (bars: 0) | Valur ta' referenza, miġbud bħala linja |
| `baselineLabel` | | Test fuq il-linja bażi, pereżempju `Reference 1.0` |
| `sides` | | `[below, above]`, ismijiet taż-żewġ naħat tal-linja bażi, li jinqraw ukoll fil-qari |
| `unit` | | Miżjud ma' kull numru, pereżempju `' ms'` |
| `digits` | `2` | Postijiet deċimali |
| `catHeader` | | Header tal-ewwel kolonna tat-tabella |
| `source` | | Test tal-footer taħt il-chart |
| `legend` | `true` | `false` jaħbi l-leġġenda |
| `zero` | `false` | Linji: inkludi 0 fuq l-assi tal-valuri |
| `labels` | Ingliż | `{ chart, table, view, na, hint, keys }`, kliem tiegħek stess |
| `lang` | lingwa tal-paġna | Format tan-numri, permezz ta' `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` jew `genre` |
| `theme` | awtomatiku | `light` jew `dark` biex tiġi mġiegħla waħda |
| `motion` | awtomatiku | `off` jitfi l-animazzjoni |
| `items` | | Tiles biss: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` huwa `good`, `bad` jew `neutral` |

## API

- `PsoCharts.create(element, spec, options)` ixomm chart ġo `element` u jirritornah. `options` jaċċetta `style`, `theme`, `motion` u `lang` bħala valuri predefiniti għall-ispeċifikazzjoni.
- `chart.set(spec)` jissostitwixxi d-dejta, `chart.show('chart' | 'table')` jaqleb il-veduta, `chart.destroy()` ineħħih.
- `PsoCharts.auto(root)` ixomm kull `<div data-pso-chart>` fil-paġna. L-attribut iżomm l-għażliet bħala JSON, `data-chart-source="#id"` jagħti isem is-sors tad-dejta.
- `PsoCharts.read(element)`, `fromLd(json, id)` u `fromTable(table)` jibdlu sors tad-dejta f'ispeċifikazzjoni.

## Sorsi tad-dejta

Id-dejta tista' tiġi minn tliet postijiet. Għażliet bħal `type` u `baseline` dejjem jidħlu fl-attribut `data-pso-chart`.

**JSON-LD (Dataset ta' schema.org).** In-numri jinsabu fil-paġna bħala dejta strutturata li jistgħu jaqraw ukoll il-magni. Kull sensiela hija `PropertyValue` f'`variableMeasured`; il-`valueReference` tagħha telenka `PropertyValue` wieħed għal kull kategorija b'`name` u `value`:

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

B'diversi datasets f'`@graph` wieħed, `dataset` jagħti isem l-`@id` li għandu jintuża. Il-kreatur, it-teknika u `isBasedOn` (b'`version`) isiru l-footer. `description` fuq valur ta' kategorija ssir in-nota tagħha. Għażilna `PropertyValue` għax huwa tip stabbli ta' schema.org; `Observation` għadu mmarkat hemmhekk bħala pendenti.

**Tabella HTML.** Tabella eżistenti tibqa' fil-paġna, bi script jew mingħajru. Il-chart jiżdied maġenbha. L-headers tal-kolonni huma s-sensiela, l-headers tar-ringieli huma l-kategoriji, attribut `data-value` fuq ċellola jżomm in-numru eżatt:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON sempliċi.** `<script type="application/json">` bl-ispeċifikazzjoni (`categories`, `series`, ...) jew l-ispeċifikazzjoni direttament f'`PsoCharts.create`.

## Stili u kuluri

Il-kuluri huma proprjetajiet personalizzati tas-CSS fuq `.pc`, għal ċar u skur (issettjar tas-sistema, `:root[data-theme]` jew `data-pc-theme`):

| Proprjetà | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Sfond, test, test sekondarju |
| `--pc-grid`, `--pc-sep` | Linji tal-griglja, separaturi |
| `--pc-0` sa `--pc-3` | Kuluri tas-sensiela |
| `--pc-good`, `--pc-bad` | Xifer tat-tile għal aħjar u agħar |
| `--pc-cur` | Kontorn tal-marka magħżula |
| `--pc-font`, `--pc-r` | Font u raġġ tal-kantunieri |

`data-pc-style` (jew l-għażla `style`) jagħżel wieħed minn erba' settijiet: `house` (aħdar), `gauge` (ambra fuq karta jew iswed, monospace), `plain` (iswed u abjad b'aċċent wieħed) u `genre` (sħun). Issettja l-proprjetajiet fuq `.pc` jew fuq chart wieħed biex tuża tiegħek.

## Aċċessibbiltà

- L-istampa hija `img` b'tikketta; taħtha hemm żona tat-tastiera: Tab jilħaq il-chart, iċ-ċwievet tal-vleġeġ jiċċaqilqu bejn il-marki, Home u End jaqbżu, Escape jneħħi. Il-marka magħżula għandha kontorn u tinqara f'reġjun `aria-live`.
- Kull chart għandu veduta ta' tabella b'headers xierqa. Is-sensiela jvarjaw b'mudell (vireg) u forma (linji), mhux biss bil-kulur; aħjar u agħar fuq it-tiles bi marka u kelma.
- It-test kollu huwa mill-inqas 13 px u għandu kuntrast ta' mill-inqas 4.5:1; il-marki mill-inqas 3:1. Is-suite tat-testijiet tiċċekkja l-erba' stili kollha fid-dawl u fid-dlam.
- B'moviment imnaqqas (issettjar tas-sistema jew `motion: 'off'`) il-vireg u l-linji jinġibdu minnufih u n-numri ma jgħoddux 'il fuq.

## Prestazzjoni

Madwar 23 KB ta' script u 8 KB ta' CSS, madwar 10 KB gzipped flimkien, mingħajr dipendenzi. Il-charts jerġgħu jinġibdu biss meta jinbidel il-wisa'; l-animazzjoni tuża CSS u tibda meta l-chart jidħol fil-vista.

## Testijiet

`python3 tools/build.py` jibni t-tliet fajls minn `src/`. `python3 tests/browser.py` jiftaħ `demo.html` f'Chromium headless (jeħtieġ il-pakkett Python `websockets`), jiċċekkja l-kuntrast, id-daqs tal-font, it-tastiera, il-veduta tat-tabella u l-moviment imnaqqas, u `--photos <folder>` isalva screenshots fid-dawl, fid-dlam u b'moviment imnaqqas.

## Traduzzjonijiet

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Liċenzja

Il-kodiċi huwa liċenzjat MIT (ara [LICENSE](../../LICENSE)). Il-valuri tad-demo huma maħluqa (ara [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Mibni għal [psorvia.io](https://psorvia.io).
