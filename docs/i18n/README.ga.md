# PSOrvia Charts

**Cartaí beoite inrochtana do do shuíomh gréasáin**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Taispeáint bheo](https://h-peterseim.github.io/psorvia-charts/)

Barraí, línte, cairteacha pióg agus fáinní, barraí cruachta agus 100 %, achair, scaipchairteacha agus builíní, histeagram, sparkline, tomhsaire, léarscáil teasa, cairt radair, tíleanna príomhfhigiúirí agus amharc tábla. JavaScript agus CSS simplí gan spleáchais: tá na luachanna taobh leis na marcanna, oibríonn gach cairt leis an méarchlár, agus le gluaiseacht laghdaithe ní bhogann aon rud.

## Úsáid

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<script src="psorvia-charts.extra.js"></script> <!-- le haghaidh scatter, hist, gauge, heat, radar amháin -->
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
import './psorvia-charts.extra.esm.js'; // le haghaidh scatter, hist, gauge, heat, radar amháin
auto();
</script>
```

Clúdaíonn an croí barraí, línte, achar, pie, fáinne, barraí cruachta agus 100 %, tíleanna, sparkline agus tábla. Tá scatter, histeagram, tomhsaire, léarscáil teasa agus radar i ddara comhad, `psorvia-charts.extra.js` (script clasaiceach, luchtaigh é tar éis an phríomhscript) nó `psorvia-charts.extra.esm.js` (modúl). Gan é, tuairiscíonn na cineálacha sin earráid shoiléir agus ní athraíonn aon rud eile.

## Cineálacha cairte

| `type` | Taispeánann |
|---|---|
| `bars` | Barra amháin in aghaidh gach luacha, ag fás ó bhunlíne (scarann `baseline: 1` an t-ábhar níos tapa ón ábhar níos moille). Tugann roinnt sraitheanna barraí grúpáilte. |
| `lines` | Líne amháin in aghaidh gach sraithe trasna na gcatagóirí, lipéadaithe ag deireadh na líne. |
| `area` | Línte líonta ó nialas; cruachann `stacked: true` na sraitheanna (áirítear luachanna diúltacha mar 0). |
| `stacked` | Barra amháin ar gach catagóir, na sraitheanna cruachta ceann ar cheann; luach i ngach deighleog, iomlán ag an deireadh. |
| `percent` | Mar an gcéanna le barraí 100 %; taispeánann gach deighleog a sciar den chatagóir. |
| `pie`, `donut` | Sraith amháin, slis amháin ar gach catagóir, lipéad le luach agus sciar ar líne threorach (ar scáileáin chaola i liosta thíos). Ó 7 slis ar aghaidh, cumasctar na cinn is lú in "Eile" (`maxSlices`, 6 de réir réamhshocraithe; coimeádann `other: false` iad uile). Taispeánann an fáinne an t-iomlán sa lár (`center: 'mean'` don mheán, `false` d'aon rud). |
| `tiles` | Tíleanna príomhfhigiúirí le huimhir a chomhaireann suas, marc (▲ ▼ =) agus téacs gearr. Féadann `spark: [values]` a bheith ar mhír le haghaidh líne bhig. |
| `table` | Tábla simplí. |
| `spark` | Líne bheag do théacs leanúnach agus do thíleanna: `values`, `width` agus `height` roghnach; taispeánann sí an luach deireanach, siúlann na heochracha saigheada trí na pointí. |
| `scatter` | *(extra)* Pointí nó builíní. Is pointí iad na catagóirí, is x í an chéad sraith, is y an dara ceann, tríú ceann roghnach le haghaidh méid an bhuilín. |
| `hist` | *(extra)* Histeagram de luachanna amha na chéad sraithe; `bins` nó `binWidth`, ar shlí eile uathoibríoch. Taispeánann an t-amharc tábla na haicmí. |
| `gauge` | *(extra)* Diail amháin ar gach catagóir ón gcéad sraith, `min` agus `max`, `bands: [{ to, label }]` roghnach tarraingthe mar chriosanna patrúnacha; scríobhtar ainm an chrios faoin uimhir. |
| `heat` | *(extra)* Greille catagóirí (sraitheanna) agus sraitheanna (colúin), dath na cille ón luach, an uimhir i ngach cill. Roghnaítear dath an téacs ionas go gcoimeádann sé 4,5:1 i gcoinne na cille. |
| `radar` | *(extra)* 3 go 8 n-ais (catagóirí) agus 3 sraith ar a mhéad, luachanna ag na pointí. Diúltaítear d'níos mó aiseanna nó sraitheanna le hearráid: thairis sin ní féidir cairt radair a léamh, úsáid barraí. |

Is aicearra do shraith amháin é `values` in ionad `series` agus `categories` (`hist`, `spark`); is aicearra do `gauge` amháin é `value`. Tá lasc idir cairt agus tábla ag gach cineál cairte seachas `tiles`, `table` agus `spark`; tá finscéal a cheleann sraitheanna ag cineálacha sraitheanna; tá léamh faoin gcairt ag gach ceann acu.

## Roghanna

| Rogha | Réamhshocrú | |
|---|---|---|
| `type` | | Ceann de na cineálacha thuas |
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
| `stacked` | `false` | Achar: cruach na sraitheanna |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Pie agus fáinne, féach thuas |
| `bins`, `binWidth` | uathoibríoch | Histeagram |
| `min`, `max`, `bands` | `0`, `100` | Tomhsaire |
| `labels` | Béarla | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, do chuid foclaíochta féin |
| `lang` | teanga an leathanaigh | Formáid uimhreacha, trí `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` nó `genre` |
| `theme` | uathoibríoch | `light` nó `dark` chun ceann amháin a chur i bhfeidhm |
| `motion` | uathoibríoch | Múchann `off` an bheochan |
| `items` | | Tíleanna amháin: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, is é `tone` `good`, `bad` nó `neutral` |

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
| `--pc-0` go `--pc-5` | Dathanna sraitheanna agus slisní; is é `--pc-5` dath "Eile" freisin |
| `--pc-good`, `--pc-bad` | Imeall na tíle do níos fearr agus níos measa |
| `--pc-cur` | Imlíne an mharca roghnaithe |
| `--pc-font`, `--pc-r` | Cló agus ga coirnéil |

Roghnaíonn `data-pc-style` (nó an rogha `style`) ceann de cheithre thacar: `house` (glas), `gauge` (ómra ar pháipéar nó dubh, aon-leithead), `plain` (dubh agus bán le haon chnaipe aitheanta amháin) agus `genre` (te). Socraigh na hairíonna ar `.pc` nó ar chairt amháin chun do cheannsa a úsáid.

## Inrochtaineacht

- Is `img` le lipéad an pictiúr; faoi tá limistéar méarchláir: sroicheann Tab an chairt, bogann na heochracha saigheada idir marcanna (slisní, pointí, cealla, diailí, aicmí), léimeann Home agus End, glanann Escape. Tá imlíne ar an marc roghnaithe agus léitear amach é i réigiún `aria-live`.
- Tá amharc tábla le ceanntásca cearta ag gach cairt. Idirdhealaítear sraitheanna agus slisní le patrún (barraí, achair, slisní) agus cruth (línte, pointí), ní le dath amháin; iompraíonn cealla na léarscáile teasa a n-uimhir agus criosanna an tomhsaire a n-ainm; idirdhealaítear níos fearr agus níos measa ar tíleanna le marc agus focal.
- Tá gach téacs 13 px ar a laghad agus tá codarsnacht 4,5:1 ar a laghad aige; tá 3:1 ar a laghad ag marcanna. Seiceálann an tsraith tástálacha na ceithre stíl ar fad i solas agus i dorchadas.
- Le gluaiseacht laghdaithe (socrú an chórais nó `motion: 'off'`) tarraingítear barraí agus línte ag an am céanna agus ní chomhaireann na huimhreacha suas.

## Feidhmíocht

Tá an croí thart ar 37 KB de script agus 12 KB de CSS, 14.7 KB gzipthe le chéile; cuireann na cineálacha extra 5.6 KB gzipthe leis. Gan spleáchais. Ní aththarraingítear cairteanna ach nuair a athraíonn an leithead; úsáideann an bheochan CSS agus tosaíonn sí nuair a scrollaíonn an chairt isteach san amharc.

## Tástálacha

Tógann `python3 tools/build.py` na cúig chomhad ó `src/`. Osclaíonn `python3 tests/browser.py` `demo.html` i Chromium gan cheann (teastaíonn an pacáiste Python `websockets`), seiceálann sé codarsnacht, méid cló, méarchlár, amharc tábla agus gluaiseacht laghdaithe do gach cineál, na trí fhoinse sonraí agus téacs a théann amach as an gcairt, agus sábhálann `--photos <fillteán>` seatanna scáileáin i solas, i ndorchadas agus le gluaiseacht laghdaithe.

## Aistriúcháin

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Norsk bokmål](README.nb.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md) · [Türkçe](README.tr.md)

## Ceadúnas

Tá an cód faoi cheadúnas MIT (féach [LICENSE](../../LICENSE)). Is luachanna cumtha iad luachanna an taispeána (féach [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Tógtha do [psorvia.io](https://psorvia.io).
