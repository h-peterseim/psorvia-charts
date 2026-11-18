# PSOrvia Charts

**Charts animati u aċċessibbli għas-sit web tiegħek**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demo ħajja](https://h-peterseim.github.io/psorvia-charts/)

Vireg, linji, pie u ring, vireg impilati u ta' 100 %, erjas, scatter u bubbles, histogram, sparkline, gauge, heatmap, radar, tiles taċ-ċifri ewlenin u veduta ta' tabella. JavaScript u CSS sempliċi mingħajr dipendenzi: il-valuri jinsabu ħdejn il-marki, kull chart jaħdem bit-tastiera, u b'moviment imnaqqas xejn ma jiċċaqlaq.

## Użu

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<script src="psorvia-charts.extra.js"></script> <!-- biss għal scatter, hist, gauge, heat, radar -->
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
import './psorvia-charts.extra.esm.js'; // biss għal scatter, hist, gauge, heat, radar
auto();
</script>
```

Il-qalba tkopri bars, lines, area, pie, ring, vireg impilati u ta' 100 %, tiles, sparkline u tabella. Scatter, histogram, gauge, heatmap u radar jinsabu f'fajl tieni, `psorvia-charts.extra.js` (script klassiku, tgħabbih wara l-ewlieni) jew `psorvia-charts.extra.esm.js` (modulu). Mingħajru dawn it-tipi jirrapportaw żball ċar u xejn aktar ma jinbidel.

## Tipi ta' chart

| `type` | Juri |
|---|---|
| `bars` | Vireg wieħed għal kull valur, li jikber minn linja bażi (`baseline: 1` jifred l-aktar mgħaġġel mill-aktar bil-mod). Diversi sensiela jagħtu vireg miġbura f'gruppi. |
| `lines` | Linja waħda għal kull sensiela matul il-kategoriji, b'tikketta fl-aħħar tal-linja. |
| `area` | Linji mimlija minn żero; `stacked: true` jimpila s-sensiela (valuri negattivi jgħoddu bħala 0). |
| `stacked` | Vireg wieħed għal kull kategorija, is-sensiela mpilata tmiem ma' tmiem; valur f'kull segment, total fl-aħħar. |
| `percent` | L-istess bħal vireg ta' 100 %; kull segment juri sehemu mill-kategorija. |
| `pie`, `donut` | Sensiela waħda, porzjon wieħed għal kull kategorija, tikketta b'valur u sehem fuq linja gwida (fuq skrins dojoq f'lista taħt). Minn 7 porzjonijiet 'il fuq, l-iżgħar jingħaqdu f'"Oħrajn" (`maxSlices`, default 6; `other: false` iżomm kollha). Iċ-ċirku juri t-total fnofsu (`center: 'mean'` għall-medja, `false` għal xejn). |
| `tiles` | Tiles taċ-ċifri ewlenin b'numru li jgħodd 'il fuq, marka (▲ ▼ =) u test qasir. Element jista' jġorr `spark: [values]` għal linja żgħira. |
| `table` | Tabella sempliċi. |
| `spark` | Linja żgħira għat-test u t-tiles: `values`, `width` u `height` jekk trid; juri l-aħħar valur, iċ-ċwievet tal-vleġeġ jgħaddu mill-punti. |
| `scatter` | *(extra)* Punti jew bubbles. Il-kategoriji huma l-punti, l-ewwel sensiela hija x, it-tieni y, tielet fakultattiva hija d-daqs tal-bubble. |
| `hist` | *(extra)* Histogram tal-valuri mhux ipproċessati tal-ewwel sensiela; `bins` jew `binWidth`, inkella awtomatiku. Il-veduta tat-tabella turi l-klassijiet. |
| `gauge` | *(extra)* Dial wieħed għal kull kategorija mill-ewwel sensiela, `min` u `max`, `bands: [{ to, label }]` fakultattivi miġbuda bħala żoni b'mudell; l-isem taż-żona jinkiteb taħt in-numru. |
| `heat` | *(extra)* Grilja ta' kategoriji (ringieli) u sensiela (kolonni), kulur taċ-ċellula mill-valur, in-numru f'kull ċellula. Il-kulur tat-test jintgħażel biex iżomm 4.5:1 kontra ċ-ċellula. |
| `radar` | *(extra)* 3 sa 8 assi (kategoriji) u l-aktar 3 sensiela, valuri fil-punti. Aktar assi jew sensiela jiġu rrifjutati b'żball: warajhom chart radar ma jinqarax, uża vireg. |

`values` minflok `series` u `categories` huwa shortcut għal sensiela waħda (`hist`, `spark`); `value` huwa shortcut għal `gauge` wieħed. Kull tip ta' chart ħlief `tiles`, `table` u `spark` għandu swiċċ bejn chart u tabella; it-tipi ta' sensiela għandhom leġġenda li taħbi s-sensiela; kollha għandhom qari taħt il-chart.

## Għażliet

| Għażla | Predefinit | |
|---|---|---|
| `type` | | Wieħed mit-tipi ta' hawn fuq |
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
| `stacked` | `false` | Erja: timpila s-sensiela |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Pie u ring, ara hawn fuq |
| `bins`, `binWidth` | awtomatiku | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Gauge |
| `labels` | Ingliż | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, kliem tiegħek stess |
| `lang` | lingwa tal-paġna | Format tan-numri, permezz ta' `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` jew `genre` |
| `theme` | awtomatiku | `light` jew `dark` biex tiġi mġiegħla waħda |
| `motion` | awtomatiku | `off` jitfi l-animazzjoni |
| `items` | | Tiles biss: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` huwa `good`, `bad` jew `neutral` |

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
| `--pc-0` sa `--pc-5` | Kuluri tas-sensiela u tal-porzjonijiet; `--pc-5` huwa wkoll il-kulur ta' "Oħrajn" |
| `--pc-good`, `--pc-bad` | Xifer tat-tile għal aħjar u agħar |
| `--pc-cur` | Kontorn tal-marka magħżula |
| `--pc-font`, `--pc-r` | Font u raġġ tal-kantunieri |

`data-pc-style` (jew l-għażla `style`) jagħżel wieħed minn erba' settijiet: `house` (aħdar), `gauge` (ambra fuq karta jew iswed, monospace), `plain` (iswed u abjad b'aċċent wieħed) u `genre` (sħun). Issettja l-proprjetajiet fuq `.pc` jew fuq chart wieħed biex tuża tiegħek.

## Aċċessibbiltà

- L-istampa hija `img` b'tikketta; taħtha hemm żona tat-tastiera: Tab jilħaq il-chart, iċ-ċwievet tal-vleġeġ jiċċaqilqu bejn il-marki (porzjonijiet, punti, ċelloli, dials, klassijiet), Home u End jaqbżu, Escape jneħħi. Il-marka magħżula għandha kontorn u tinqara f'reġjun `aria-live`.
- Kull chart għandu veduta ta' tabella b'headers xierqa. Is-sensiela u l-porzjonijiet jvarjaw b'mudell (vireg, erjas, pie) u forma (linji, punti), mhux biss bil-kulur; iċ-ċelloli tal-heatmap iġorru n-numru tagħhom, iż-żoni tal-gauge isimhom; aħjar u agħar fuq it-tiles bi marka u kelma.
- It-test kollu huwa mill-inqas 13 px u għandu kuntrast ta' mill-inqas 4.5:1; il-marki mill-inqas 3:1. Is-suite tat-testijiet tiċċekkja l-erba' stili kollha fid-dawl u fid-dlam.
- B'moviment imnaqqas (issettjar tas-sistema jew `motion: 'off'`) il-vireg u l-linji jinġibdu minnufih u n-numri ma jgħoddux 'il fuq.

## Prestazzjoni

Il-qalba hija madwar 37 KB ta' script u 12 KB ta' CSS, 14.7 KB gzipped flimkien; it-tipi extra jżidu 5.6 KB gzipped. Mingħajr dipendenzi. Il-charts jerġgħu jinġibdu biss meta jinbidel il-wisa'; l-animazzjoni tuża CSS u tibda meta l-chart jidħol fil-vista.

## Testijiet

`python3 tools/build.py` jibni il-ħames fajls minn `src/`. `python3 tests/browser.py` jiftaħ `demo.html` f'Chromium headless (jeħtieġ il-pakkett Python `websockets`), jiċċekkja l-kuntrast, id-daqs tal-font, it-tastiera, il-veduta tat-tabella u l-moviment imnaqqas għal kull tip, it-tliet sorsi tad-data kollha u t-test li joħroġ barra mill-chart, u `--photos <folder>` isalva screenshots fid-dawl, fid-dlam u b'moviment imnaqqas.

## Traduzzjonijiet

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Norsk bokmål](README.nb.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md) · [Türkçe](README.tr.md)

## Liċenzja

Il-kodiċi huwa liċenzjat MIT (ara [LICENSE](../../LICENSE)). Il-valuri tad-demo huma maħluqa (ara [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Mibni għal [psorvia.io](https://psorvia.io).
