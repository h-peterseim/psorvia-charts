# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animētas, pieejamas diagrammas jūsu tīmekļvietnei**

### ▶ [Demonstrācija tiešsaistē](https://h-peterseim.github.io/psorvia-charts/demo.html)

Joslas ap bāzes līniju, grupētas joslas, līnijas, galveno rādītāju flīzes un tabulas skats. Tīrs JavaScript un CSS bez atkarībām: vērtības atrodas blakus atzīmēm, katra diagramma darbojas ar tastatūru, un ar samazinātu kustību nekas nekustas.

## Lietošana

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

## Diagrammu veidi

| `type` | Rāda |
|---|---|
| `bars` | Pa vienai joslai katrai vērtībai, kas aug no bāzes līnijas (`baseline: 1` nošķir ātrāku no lēnāka). Vairākas sērijas veido grupētas joslas. |
| `lines` | Pa vienai līnijai katrai sērijai cauri kategorijām, ar uzrakstu līnijas galā. |
| `tiles` | Galveno rādītāju flīzes ar skaitli, kas skaita līdz vērtībai, atzīmi (▲ ▼ =) un īsu tekstu. |
| `table` | Vienkārša tabula. |

`bars` un `lines` ir slēdzis starp diagrammu un tabulu, leģenda, kas paslēpj sērijas, un rādījumu josla zem diagrammas.

## Opcijas

| Opcija | Noklusējums | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` vai `table` |
| `title` | | Diagrammas virsraksts, arī pieejamais nosaukums |
| `desc` | | Īss apraksts zem virsraksta |
| `categories` | | `[{ label, note }]`, `note` tiek rādīta rādījumos un tabulā |
| `series` | | `[{ name, values }]`, `null` trūkstošai vērtībai |
| `baseline` | nav (bars: 0) | Atsauces vērtība, uzzīmēta kā līnija |
| `baselineLabel` | | Teksts pie bāzes līnijas, piemēram, `Reference 1.0` |
| `sides` | | `[below, above]`, abu bāzes līnijas pušu nosaukumi, ko izrunā arī rādījumos |
| `unit` | | Pievieno katram skaitlim, piemēram, `' ms'` |
| `digits` | `2` | Decimālzīmes |
| `catHeader` | | Tabulas pirmās kolonnas galvene |
| `source` | | Kājenes teksts zem diagrammas |
| `legend` | `true` | `false` paslēpj leģendu |
| `zero` | `false` | Līnijas: iekļaut 0 vērtību asī |
| `labels` | angļu | `{ chart, table, view, na, hint, keys }`, jūsu pašu formulējumi |
| `lang` | lapas valoda | Skaitļu formāts, izmantojot `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` vai `genre` |
| `theme` | automātiska | `light` vai `dark`, lai uzspiestu vienu |
| `motion` | automātiska | `off` izslēdz animāciju |
| `items` | | Tikai flīzēm: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` ir `good`, `bad` vai `neutral` |

## API

- `PsoCharts.create(element, spec, options)` uzzīmē diagrammu iekšā `element` un atgriež to. `options` pieņem `style`, `theme`, `motion` un `lang` kā noklusējumus specifikācijai.
- `chart.set(spec)` nomaina datus, `chart.show('chart' | 'table')` pārslēdz skatu, `chart.destroy()` to noņem.
- `PsoCharts.auto(root)` uzzīmē katru `<div data-pso-chart>` lapā. Atribūts satur opcijas kā JSON, `data-chart-source="#id"` norāda datu avotu.
- `PsoCharts.read(element)`, `fromLd(json, id)` un `fromTable(table)` pārvērš datu avotu specifikācijā.

## Datu avoti

Dati var nākt no trim vietām. Opcijas, piemēram, `type` un `baseline`, vienmēr tiek ierakstītas atribūtā `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Skaitļi atrodas lapā kā strukturēti dati, ko var lasīt arī mašīnas. Katra sērija ir `PropertyValue` laukā `variableMeasured`; tās `valueReference` uzskaita pa vienam `PropertyValue` katrai kategorijai ar `name` un `value`:

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

Ja vienā `@graph` ir vairākas datu kopas, `dataset` norāda izmantojamo `@id`. Autors, metodika un `isBasedOn` (ar `version`) veido kājeni. Kategorijas vērtības `description` kļūst par tās piezīmi. Mēs izvēlējāmies `PropertyValue`, jo tas ir stabils schema.org tips; `Observation` tur joprojām ir atzīmēts kā gaidošs.

**HTML tabula.** Esoša tabula paliek lapā, ar skriptu vai bez tā. Diagramma tiek pievienota blakus. Kolonnu galvenes ir sērijas, rindu galvenes ir kategorijas, šūnas atribūts `data-value` satur precīzo skaitli:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Vienkāršs JSON.** `<script type="application/json">` ar specifikāciju (`categories`, `series`, ...) vai specifikācija tieši `PsoCharts.create`.

## Stili un krāsas

Krāsas ir CSS pielāgotie rekvizīti uz `.pc`, gaišai un tumšai tēmai (sistēmas iestatījums, `:root[data-theme]` vai `data-pc-theme`):

| Rekvizīts | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Fons, teksts, sekundārais teksts |
| `--pc-grid`, `--pc-sep` | Režģa līnijas, atdalītāji |
| no `--pc-0` līdz `--pc-3` | Sēriju krāsas |
| `--pc-good`, `--pc-bad` | Flīzes mala labākam un sliktākam |
| `--pc-cur` | Izvēlētās atzīmes kontūra |
| `--pc-font`, `--pc-r` | Fonts un stūru rādiuss |

`data-pc-style` (vai opcija `style`) izvēlas vienu no četriem komplektiem: `house` (zaļš), `gauge` (dzintara krāsa uz papīra vai melns, vienplatuma burti), `plain` (melnbalts ar vienu akcentu) un `genre` (silts). Iestatiet rekvizītus uz `.pc` vai uz vienas diagrammas, lai izmantotu savus.

## Pieejamība

- Attēls ir `img` ar nosaukumu; zem tā atrodas tastatūras apgabals: Tab sasniedz diagrammu, bulttaustiņi pārvietojas starp atzīmēm, Home un End pārlec, Escape atceļ. Izvēlētā atzīme tiek apvilkta ar kontūru un nolasīta `aria-live` apgabalā.
- Katrai diagrammai ir tabulas skats ar pareizām galvenēm. Sērijas atšķiras ar rakstu (joslas) un formu (līnijas), ne tikai ar krāsu; labāks un sliktāks uz flīzēm tiek atšķirts ar atzīmi un vārdu.
- Viss teksts ir vismaz 13 px un tā kontrasts ir vismaz 4,5:1; atzīmēm ir vismaz 3:1. Testu komplekts pārbauda visus četrus stilus gaišā un tumšā tēmā.
- Ar samazinātu kustību (sistēmas iestatījums vai `motion: 'off'`) joslas un līnijas tiek uzzīmētas uzreiz, un skaitļi neskaita līdz vērtībai.

## Veiktspēja

Aptuveni 23 KB skripta un 8 KB CSS, kopā aptuveni 10 KB ar gzip, bez atkarībām. Diagrammas tiek pārzīmētas tikai mainoties platumam; animācija izmanto CSS un sākas, kad diagramma ritinot nonāk redzamajā apgabalā.

## Testi

`python3 tools/build.py` izveido trīs failus no `src/`. `python3 tests/browser.py` atver `demo.html` bezgalvas Chromium (vajadzīga Python pakotne `websockets`), pārbauda kontrastu, fonta izmēru, tastatūru, tabulas skatu un samazināto kustību, bet `--photos <mape>` saglabā ekrānuzņēmumus gaišā, tumšā tēmā un ar samazinātu kustību.

## Tulkojumi

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licence

Kods ir licencēts ar MIT (skatiet [LICENSE](../../LICENSE)). Demonstrācijas vērtības ir izdomātas (skatiet [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Izveidots vietnei [psorvia.io](https://psorvia.io).
