# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Cartaí beoite inrochtana do do shuíomh gréasáin**

### ▶ [Taispeáint bheo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Barraí timpeall bunlíne, barraí grúpáilte, línte, tíleanna príomhfhigiúirí agus amharc tábla. JavaScript agus CSS simplí gan spleáchais: tá na luachanna taobh leis na marcanna, oibríonn gach cairt leis an méarchlár, agus le gluaiseacht laghdaithe ní bhogann aon rud.

## Úsáid

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

## Cineálacha cairte

| `type` | Taispeánann |
|---|---|
| `bars` | Barra amháin in aghaidh gach luacha, ag fás ó bhunlíne (scarann `baseline: 1` an t-ábhar níos tapa ón ábhar níos moille). Tugann roinnt sraitheanna barraí grúpáilte. |
| `lines` | Líne amháin in aghaidh gach sraithe trasna na gcatagóirí, lipéadaithe ag deireadh na líne. |
| `tiles` | Tíleanna príomhfhigiúirí le huimhir a chomhaireann suas, marc (▲ ▼ =) agus téacs gearr. |
| `table` | Tábla simplí. |

Tá lasc idir cairt agus tábla ag `bars` agus `lines`, finscéal a cheleann sraitheanna, agus léamh faoin gcairt.

## Roghanna

| Rogha | Réamhshocrú | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` nó `table` |
| `title` | | Teideal na cairte, an t-ainm inrochtana freisin |
| `desc` | | Cur síos gairid faoin teideal |
| `categories` | | `[{ label, note }]`, taispeántar `note` sa léamh agus sa tábla |
| `series` | | `[{ name, values }]`, `null` do luach atá ar iarraidh |
| `baseline` | aon cheann (bars: 0) | Luach tagartha, tarraingthe mar líne |
| `baselineLabel` | | Téacs ag an mbunlíne, mar shampla `Reference 1.0` |
| `sides` | | `[below, above]`, ainmneacha dhá thaobh na bunlíne, a labhraítear sa léamh freisin |
| `unit` | | Cuirtear le gach uimhir é, mar shampla `' ms'` |
| `digits` | `2` | Áiteanna deachúlacha |
| `catHeader` | | Ceanntásc an chéad cholúin sa tábla |
| `source` | | Téacs buntásc faoin gcairt |
| `legend` | `true` | Folaíonn `false` an finscéal |
| `zero` | `false` | Línte: cuir 0 san áireamh ar ais na luachanna |
| `labels` | Béarla | `{ chart, table, view, na, hint, keys }`, do chuid foclaíochta féin |
| `lang` | teanga an leathanaigh | Formáid uimhreacha, trí `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` nó `genre` |
| `theme` | uathoibríoch | `light` nó `dark` chun ceann amháin a chur i bhfeidhm |
| `motion` | uathoibríoch | Múchann `off` an bheochan |
| `items` | | Tíleanna amháin: `[{ label, value, unit, digits, mark, sub, tone }]`, is é `tone` `good`, `bad` nó `neutral` |

## API

- Tarraingíonn `PsoCharts.create(element, spec, options)` cairt isteach in `element` agus tugann ar ais í. Glacann `options` le `style`, `theme`, `motion` agus `lang` mar réamhshocruithe don spec.
- Cuireann `chart.set(spec)` na sonraí in ionad na sean-sonraí, athraíonn `chart.show('chart' | 'table')` an t-amharc, baineann `chart.destroy()` í.
- Tarraingíonn `PsoCharts.auto(root)` gach `<div data-pso-chart>` ar an leathanach. Coinníonn an tréith na roghanna mar JSON, ainmníonn `data-chart-source="#id"` foinse na sonraí.
- Athraíonn `PsoCharts.read(element)`, `fromLd(json, id)` agus `fromTable(table)` foinse sonraí ina spec.

## Foinsí sonraí

Is féidir leis na sonraí teacht ó thrí áit. Téann roghanna cosúil le `type` agus `baseline` isteach sa tréith `data-pso-chart` i gcónaí.

**JSON-LD (Dataset schema.org).** Tá na huimhreacha sa leathanach mar shonraí struchtúrtha ar féidir le meaisíní iad a léamh freisin. Is `PropertyValue` in `variableMeasured` í gach sraith; liostaíonn a `valueReference` `PropertyValue` amháin in aghaidh gach catagóire le `name` agus `value`:

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

Le roinnt tacar sonraí in `@graph` amháin, ainmníonn `dataset` an `@id` atá le húsáid. Déanann an cruthaitheoir, an teicníc agus `isBasedOn` (le `version`) an buntásc. Éiríonn `description` ar luach catagóire ina nóta. Roghnaíomar `PropertyValue` toisc gur cineál seasmhach schema.org é; tá `Observation` marcáilte fós mar ar feitheamh ansin.

**Tábla HTML.** Fanann tábla atá ann cheana sa leathanach, le script nó gan script. Cuirtear an chairt lena thaobh. Is iad ceanntásca na gcolún na sraitheanna, ceanntásca na sraitheanna na catagóirí, coinníonn tréith `data-value` ar chill an uimhir cheart:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON simplí.** `<script type="application/json">` leis an spec (`categories`, `series`, ...) nó an spec go díreach in `PsoCharts.create`.

## Stíleanna agus dathanna

Is airíonna saincheaptha CSS ar `.pc` iad na dathanna, d'éadrom agus de dhorcha (socrú an chórais, `:root[data-theme]` nó `data-pc-theme`):

| Airí | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Cúlra, téacs, téacs tánaisteach |
| `--pc-grid`, `--pc-sep` | Línte eangaí, deighilteoirí |
| `--pc-0` go `--pc-3` | Dathanna na sraitheanna |
| `--pc-good`, `--pc-bad` | Imeall na tíle do níos fearr agus níos measa |
| `--pc-cur` | Imlíne an mharca roghnaithe |
| `--pc-font`, `--pc-r` | Cló agus ga coirnéil |

Roghnaíonn `data-pc-style` (nó an rogha `style`) ceann de cheithre thacar: `house` (glas), `gauge` (ómra ar pháipéar nó dubh, aon-leithead), `plain` (dubh agus bán le haon chnaipe aitheanta amháin) agus `genre` (te). Socraigh na hairíonna ar `.pc` nó ar chairt amháin chun do cheannsa a úsáid.

## Inrochtaineacht

- Is `img` le lipéad an pictiúr; faoi tá limistéar méarchláir: sroicheann Tab an chairt, bogann na heochracha saigheada idir marcanna, léimeann Home agus End, glanann Escape. Tá imlíne ar an marc roghnaithe agus léitear amach é i réigiún `aria-live`.
- Tá amharc tábla le ceanntásca cearta ag gach cairt. Idirdhealaítear sraitheanna le patrún (barraí) agus cruth (línte), ní le dath amháin; idirdhealaítear níos fearr agus níos measa ar tíleanna le marc agus focal.
- Tá gach téacs 13 px ar a laghad agus tá codarsnacht 4,5:1 ar a laghad aige; tá 3:1 ar a laghad ag marcanna. Seiceálann an tsraith tástálacha na ceithre stíl ar fad i solas agus i dorchadas.
- Le gluaiseacht laghdaithe (socrú an chórais nó `motion: 'off'`) tarraingítear barraí agus línte ag an am céanna agus ní chomhaireann na huimhreacha suas.

## Feidhmíocht

Thart ar 23 KB de script agus 8 KB de CSS, thart ar 10 KB gzipthe le chéile, gan spleáchais. Ní aththarraingítear cairteanna ach nuair a athraíonn an leithead; úsáideann an bheochan CSS agus tosaíonn sí nuair a scrollaíonn an chairt isteach san amharc.

## Tástálacha

Tógann `python3 tools/build.py` na trí chomhad ó `src/`. Osclaíonn `python3 tests/browser.py` `demo.html` i Chromium gan cheann (teastaíonn an pacáiste Python `websockets`), seiceálann sé codarsnacht, méid cló, méarchlár, amharc tábla agus gluaiseacht laghdaithe, agus sábhálann `--photos <fillteán>` seatanna scáileáin i solas, i ndorchadas agus le gluaiseacht laghdaithe.

## Aistriúcháin

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Ceadúnas

Tá an cód faoi cheadúnas MIT (féach [LICENSE](../../LICENSE)). Is luachanna cumtha iad luachanna an taispeána (féach [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Tógtha do [psorvia.io](https://psorvia.io).
