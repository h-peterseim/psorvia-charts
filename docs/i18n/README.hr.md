# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animirani, pristupačni grafikoni za vašu web-stranicu**

### ▶ [Demo uživo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Stupci oko polazne crte, grupirani stupci, linije, pločice s ključnim pokazateljima i prikaz tablice. Čisti JavaScript i CSS bez ovisnosti: vrijednosti stoje uz oznake, svaki grafikon radi s tipkovnicom, a uz smanjeno kretanje ništa se ne miče.

## Uporaba

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

## Vrste grafikona

| `type` | Prikazuje |
|---|---|
| `bars` | Po jedan stupac za svaku vrijednost, koji raste od polazne crte (`baseline: 1` odvaja brže od sporijeg). Više serija daje grupirane stupce. |
| `lines` | Po jednu liniju za svaku seriju kroz kategorije, s natpisom na kraju linije. |
| `tiles` | Pločice s ključnim pokazateljima: broj koji se broji do vrijednosti, oznaka (▲ ▼ =) i kratak tekst. |
| `table` | Obična tablica. |

`bars` i `lines` imaju prekidač između grafikona i tablice, legendu koja skriva serije i ispis očitanja ispod grafikona.

## Opcije

| Opcija | Zadano | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` ili `table` |
| `title` | | Naslov grafikona, ujedno i pristupačni naziv |
| `desc` | | Kratak opis ispod naslova |
| `categories` | | `[{ label, note }]`, `note` se prikazuje u očitanju i u tablici |
| `series` | | `[{ name, values }]`, `null` za nedostajuću vrijednost |
| `baseline` | nema (bars: 0) | Referentna vrijednost, nacrtana kao crta |
| `baselineLabel` | | Tekst na polaznoj crti, na primjer `Reference 1.0` |
| `sides` | | `[below, above]`, nazivi dviju strana polazne crte, izgovaraju se i u očitanju |
| `unit` | | Dodaje se svakom broju, na primjer `' ms'` |
| `digits` | `2` | Decimalna mjesta |
| `catHeader` | | Zaglavlje prvog stupca tablice |
| `source` | | Tekst podnožja ispod grafikona |
| `legend` | `true` | `false` skriva legendu |
| `zero` | `false` | Linije: uključi 0 na osi vrijednosti |
| `labels` | engleski | `{ chart, table, view, na, hint, keys }`, vaši vlastiti izrazi |
| `lang` | jezik stranice | Format brojeva, preko `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ili `genre` |
| `theme` | automatski | `light` ili `dark` za nametanje jedne |
| `motion` | automatski | `off` isključuje animaciju |
| `items` | | Samo pločice: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` je `good`, `bad` ili `neutral` |

## API

- `PsoCharts.create(element, spec, options)` crta grafikon u `element` i vraća ga. `options` prima `style`, `theme`, `motion` i `lang` kao zadane vrijednosti za specifikaciju.
- `chart.set(spec)` zamjenjuje podatke, `chart.show('chart' | 'table')` mijenja prikaz, `chart.destroy()` ga uklanja.
- `PsoCharts.auto(root)` crta svaki `<div data-pso-chart>` na stranici. Atribut sadrži opcije kao JSON, `data-chart-source="#id"` imenuje izvor podataka.
- `PsoCharts.read(element)`, `fromLd(json, id)` i `fromTable(table)` pretvaraju izvor podataka u specifikaciju.

## Izvori podataka

Podaci mogu doći s tri mjesta. Opcije kao što su `type` i `baseline` uvijek idu u atribut `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Brojke su na stranici kao strukturirani podaci koje mogu čitati i strojevi. Svaka je serija `PropertyValue` u `variableMeasured`; njezin `valueReference` navodi po jedan `PropertyValue` za svaku kategoriju s `name` i `value`:

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

Kad je više skupova podataka u jednom `@graph`, `dataset` imenuje `@id` koji treba upotrijebiti. Autor, tehnika i `isBasedOn` (s `version`) čine podnožje. `description` na vrijednosti kategorije postaje njezina napomena. Odabrali smo `PropertyValue` jer je to stabilan tip schema.org; `Observation` je ondje još označen kao na čekanju.

**HTML tablica.** Postojeća tablica ostaje na stranici, sa skriptom ili bez nje. Grafikon se dodaje pokraj nje. Zaglavlja stupaca su serije, zaglavlja redaka kategorije, a atribut `data-value` na ćeliji sadrži točan broj:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Običan JSON.** `<script type="application/json">` sa specifikacijom (`categories`, `series`, ...) ili specifikacija izravno u `PsoCharts.create`.

## Stilovi i boje

Boje su prilagođena CSS svojstva na `.pc`, za svijetlu i tamnu temu (postavka sustava, `:root[data-theme]` ili `data-pc-theme`):

| Svojstvo | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Pozadina, tekst, sekundarni tekst |
| `--pc-grid`, `--pc-sep` | Linije mreže, razdjelnici |
| `--pc-0` do `--pc-3` | Boje serija |
| `--pc-good`, `--pc-bad` | Rub pločice za bolje i lošije |
| `--pc-cur` | Obris odabrane oznake |
| `--pc-font`, `--pc-r` | Font i polumjer kutova |

`data-pc-style` (ili opcija `style`) bira jedan od četiri skupa: `house` (zelena), `gauge` (jantarna na papiru ili crna, jednaka širina znakova), `plain` (crno-bijelo s jednim naglaskom) i `genre` (topla). Postavite svojstva na `.pc` ili na pojedinačni grafikon da biste koristili vlastita.

## Pristupačnost

- Slika je `img` s oznakom; ispod nje je područje za tipkovnicu: Tab dolazi do grafikona, tipke sa strelicama prelaze među oznakama, Home i End skaču, Escape briše. Odabrana oznaka ima obris i čita se u regiji `aria-live`.
- Svaki grafikon ima prikaz tablice s ispravnim zaglavljima. Serije se razlikuju uzorkom (stupci) i oblikom (linije), a ne samo bojom; bolje i lošije na pločicama razlikuju se oznakom i riječju.
- Sav je tekst velik najmanje 13 px i ima kontrast najmanje 4,5:1; oznake imaju najmanje 3:1. Skup testova provjerava sva četiri stila u svijetloj i tamnoj temi.
- Uz smanjeno kretanje (postavka sustava ili `motion: 'off'`) stupci i linije crtaju se odmah, a brojevi se ne broje do vrijednosti.

## Performanse

Oko 23 KB skripte i 8 KB CSS-a, zajedno oko 10 KB gzipano, bez ovisnosti. Grafikoni se ponovno crtaju samo pri promjeni širine; animacija koristi CSS i počinje kad grafikon uđe u vidljivo područje.

## Testovi

`python3 tools/build.py` gradi tri datoteke iz `src/`. `python3 tests/browser.py` otvara `demo.html` u Chromiumu bez sučelja (treba Python paket `websockets`), provjerava kontrast, veličinu fonta, tipkovnicu, prikaz tablice i smanjeno kretanje, a `--photos <mapa>` sprema snimke zaslona u svijetloj i tamnoj temi te sa smanjenim kretanjem.

## Prijevodi

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencija

Kôd je pod licencijom MIT (vidi [LICENSE](../../LICENSE)). Vrijednosti u demou su izmišljene (vidi [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Izrađeno za [psorvia.io](https://psorvia.io).
