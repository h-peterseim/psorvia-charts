# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animuotos, prieinamos diagramos jūsų svetainei**

### ▶ [Demonstracija gyvai](https://h-peterseim.github.io/psorvia-charts/demo.html)

Stulpeliai aplink bazinę liniją, grupuoti stulpeliai, linijos, pagrindinių rodiklių plytelės ir lentelės rodinys. Grynas JavaScript ir CSS be priklausomybių: reikšmės rodomos šalia žymių, kiekviena diagrama veikia su klaviatūra, o esant sumažintam judesiui niekas nejuda.

## Naudojimas

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

## Diagramų tipai

| `type` | Rodo |
|---|---|
| `bars` | Po vieną stulpelį kiekvienai reikšmei, augantį nuo bazinės linijos (`baseline: 1` atskiria greitesnį nuo lėtesnio). Kelios serijos sudaro grupuotus stulpelius. |
| `lines` | Po vieną liniją kiekvienai serijai per kategorijas, su užrašu linijos gale. |
| `tiles` | Pagrindinių rodiklių plytelės su skaičiumi, kuris skaičiuojamas iki reikšmės, žyma (▲ ▼ =) ir trumpu tekstu. |
| `table` | Paprasta lentelė. |

`bars` ir `lines` turi jungiklį tarp diagramos ir lentelės, legendą, kuri paslepia serijas, ir rodmenų eilutę po diagrama.

## Parinktys

| Parinktis | Numatytoji | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` arba `table` |
| `title` | | Diagramos pavadinimas, taip pat prieinamasis pavadinimas |
| `desc` | | Trumpas aprašas po pavadinimu |
| `categories` | | `[{ label, note }]`, `note` rodoma rodmenyse ir lentelėje |
| `series` | | `[{ name, values }]`, `null` trūkstamai reikšmei |
| `baseline` | nėra (bars: 0) | Etaloninė reikšmė, nubrėžta kaip linija |
| `baselineLabel` | | Tekstas prie bazinės linijos, pavyzdžiui, `Reference 1.0` |
| `sides` | | `[below, above]`, abiejų bazinės linijos pusių pavadinimai, ištariami ir rodmenyse |
| `unit` | | Pridedama prie kiekvieno skaičiaus, pavyzdžiui, `' ms'` |
| `digits` | `2` | Skaitmenys po kablelio |
| `catHeader` | | Pirmojo lentelės stulpelio antraštė |
| `source` | | Poraštės tekstas po diagrama |
| `legend` | `true` | `false` paslepia legendą |
| `zero` | `false` | Linijos: įtraukti 0 į reikšmių ašį |
| `labels` | anglų | `{ chart, table, view, na, hint, keys }`, jūsų pačių formuluotės |
| `lang` | puslapio kalba | Skaičių formatas per `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` arba `genre` |
| `theme` | automatinė | `light` arba `dark`, kad būtų priverstinai nustatyta viena |
| `motion` | automatinis | `off` išjungia animaciją |
| `items` | | Tik plytelėms: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` yra `good`, `bad` arba `neutral` |

## API

- `PsoCharts.create(element, spec, options)` nupiešia diagramą `element` viduje ir ją grąžina. `options` priima `style`, `theme`, `motion` ir `lang` kaip specifikacijos numatytąsias reikšmes.
- `chart.set(spec)` pakeičia duomenis, `chart.show('chart' | 'table')` perjungia rodinį, `chart.destroy()` ją pašalina.
- `PsoCharts.auto(root)` nupiešia kiekvieną `<div data-pso-chart>` puslapyje. Atributas laiko parinktis kaip JSON, `data-chart-source="#id"` nurodo duomenų šaltinį.
- `PsoCharts.read(element)`, `fromLd(json, id)` ir `fromTable(table)` paverčia duomenų šaltinį specifikacija.

## Duomenų šaltiniai

Duomenys gali ateiti iš trijų vietų. Parinktys, tokios kaip `type` ir `baseline`, visada rašomos į atributą `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Skaičiai puslapyje yra kaip struktūriniai duomenys, kuriuos gali skaityti ir mašinos. Kiekviena serija yra `PropertyValue` lauke `variableMeasured`; jos `valueReference` išvardija po vieną `PropertyValue` kiekvienai kategorijai su `name` ir `value`:

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

Kai viename `@graph` yra keli duomenų rinkiniai, `dataset` nurodo naudotiną `@id`. Autorius, metodika ir `isBasedOn` (su `version`) sudaro poraštę. Kategorijos reikšmės `description` tampa jos pastaba. Pasirinkome `PropertyValue`, nes tai stabilus schema.org tipas; `Observation` ten vis dar pažymėtas kaip laukiantis.

**HTML lentelė.** Esama lentelė lieka puslapyje, su skriptu ar be jo. Diagrama pridedama šalia. Stulpelių antraštės yra serijos, eilučių antraštės – kategorijos, langelio atributas `data-value` laiko tikslų skaičių:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Paprastas JSON.** `<script type="application/json">` su specifikacija (`categories`, `series`, ...) arba specifikacija tiesiai `PsoCharts.create`.

## Stiliai ir spalvos

Spalvos yra CSS pasirinktinės savybės ant `.pc`, šviesiai ir tamsiai temai (sistemos nustatymas, `:root[data-theme]` arba `data-pc-theme`):

| Savybė | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Fonas, tekstas, antrinis tekstas |
| `--pc-grid`, `--pc-sep` | Tinklelio linijos, skirtukai |
| nuo `--pc-0` iki `--pc-3` | Serijų spalvos |
| `--pc-good`, `--pc-bad` | Plytelės kraštas geresniam ir blogesniam |
| `--pc-cur` | Pasirinktos žymės kontūras |
| `--pc-font`, `--pc-r` | Šriftas ir kampų spindulys |

`data-pc-style` (arba parinktis `style`) pasirenka vieną iš keturių rinkinių: `house` (žalias), `gauge` (gintaro spalva ant popieriaus arba juoda, lygiaplotis šriftas), `plain` (juoda ir balta su vienu akcentu) ir `genre` (šiltas). Nustatykite savybes ant `.pc` arba ant vienos diagramos, kad naudotumėte savąsias.

## Prieinamumas

- Paveikslas yra `img` su pavadinimu; po juo yra klaviatūros sritis: Tab pasiekia diagramą, rodyklių klavišai perkelia tarp žymių, Home ir End peršoka, Escape panaikina. Pasirinkta žymė apvedama kontūru ir perskaitoma `aria-live` srityje.
- Kiekviena diagrama turi lentelės rodinį su tinkamomis antraštėmis. Serijos skiriasi raštu (stulpeliai) ir forma (linijos), ne vien spalva; geresnis ir blogesnis plytelėse skiriami žyma ir žodžiu.
- Visas tekstas yra bent 13 px ir turi bent 4,5:1 kontrastą; žymės – bent 3:1. Bandymų rinkinys tikrina visus keturis stilius šviesioje ir tamsioje temoje.
- Esant sumažintam judesiui (sistemos nustatymas arba `motion: 'off'`) stulpeliai ir linijos nupiešiami iš karto, o skaičiai neskaičiuojami iki reikšmės.

## Našumas

Apie 23 KB skripto ir 8 KB CSS, kartu apie 10 KB suspaudus gzip, be priklausomybių. Diagramos perpiešiamos tik pasikeitus pločiui; animacija naudoja CSS ir prasideda, kai diagrama pasirodo matomoje srityje.

## Bandymai

`python3 tools/build.py` sukuria tris failus iš `src/`. `python3 tests/browser.py` atidaro `demo.html` be sąsajos veikiančiame Chromium (reikia Python paketo `websockets`), tikrina kontrastą, šrifto dydį, klaviatūrą, lentelės rodinį ir sumažintą judesį, o `--photos <aplankas>` išsaugo ekrano nuotraukas šviesioje, tamsioje temoje ir su sumažintu judesiu.

## Vertimai

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencija

Kodas licencijuotas pagal MIT (žr. [LICENSE](../../LICENSE)). Demonstracinės reikšmės yra išgalvotos (žr. [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Sukurta [psorvia.io](https://psorvia.io).
