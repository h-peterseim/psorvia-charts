# PSOrvia Charts

**Animirani, pristupačni grafikoni za vašu web-stranicu**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demo uživo](https://h-peterseim.github.io/psorvia-charts/)

Stupci, linije, kružni i prstenasti grafikoni, složeni stupci i stupci od 100 %, površine, raspršeni grafikoni i mjehurići, histogram, sparkline, mjerač, toplinska karta, radarski grafikon, pločice s ključnim pokazateljima i prikaz tablice. Čisti JavaScript i CSS bez ovisnosti: vrijednosti stoje uz oznake, svaki grafikon radi s tipkovnicom, a uz smanjeno kretanje ništa se ne miče.

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
import './psorvia-charts.extra.esm.js'; // samo za scatter, hist, gauge, heat, radar
auto();
</script>
```

Jezgra pokriva stupce, linije, površine, pie, prsten, složene stupce i stupce od 100 %, pločice, sparkline i tablicu. Scatter, histogram, mjerač, toplinska karta i radar nalaze se u drugoj datoteci, `psorvia-charts.extra.js` (klasična skripta, učitaj je nakon glavne skripte) ili `psorvia-charts.extra.esm.js` (modul). Bez nje ti tipovi javljaju jasnu pogrešku, a ništa drugo se ne mijenja.

## Vrste grafikona

| `type` | Prikazuje |
|---|---|
| `bars` | Po jedan stupac za svaku vrijednost, koji raste od polazne crte (`baseline: 1` odvaja brže od sporijeg). Više serija daje grupirane stupce. |
| `lines` | Po jednu liniju za svaku seriju kroz kategorije, s natpisom na kraju linije. |
| `area` | Ispunjene linije od nule; `stacked: true` slaže serije jednu na drugu (negativne vrijednosti računaju se kao 0). |
| `stacked` | Jedan stupac po kategoriji, serije složene jedna na drugu; vrijednost u svakom segmentu, zbroj na kraju. |
| `percent` | Isto kao stupci od 100 %; svaki segment prikazuje svoj udio u kategoriji. |
| `pie`, `donut` | Jedna serija, jedan isječak po kategoriji, oznaka s vrijednošću i udjelom na pokaznoj liniji (na uskim zaslonima u popisu ispod). Od 7 isječaka nadalje najmanji se spajaju u "Ostalo" (`maxSlices`, zadano 6; `other: false` zadržava sve). Prsten u sredini prikazuje zbroj (`center: 'mean'` za prosjek, `false` za ništa). |
| `tiles` | Pločice s ključnim pokazateljima: broj koji se broji do vrijednosti, oznaka (▲ ▼ =) i kratak tekst. Stavka može imati `spark: [values]` za malu liniju. |
| `table` | Obična tablica. |
| `spark` | Mala linija za tekst i pločice: `values`, neobavezni `width` i `height`; prikazuje zadnju vrijednost, tipke sa strelicama prolaze kroz točke. |
| `scatter` | *(extra)* Točke ili mjehurići. Kategorije su točke, prva serija je x, druga y, neobavezna treća veličina mjehurića. |
| `hist` | *(extra)* Histogram sirovih vrijednosti prve serije; `bins` ili `binWidth`, inače automatski. Prikaz tablice prikazuje razrede. |
| `gauge` | *(extra)* Jedan brojčanik po kategoriji iz prve serije, `min` i `max`, neobavezni `bands: [{ to, label }]` nacrtani kao zone s uzorkom; naziv zone ispisan je ispod broja. |
| `heat` | *(extra)* Mreža kategorija (retci) i serija (stupci), boja ćelije prema vrijednosti, broj u svakoj ćeliji. Boja teksta bira se tako da zadrži 4,5:1 prema ćeliji. |
| `radar` | *(extra)* 3 do 8 osi (kategorije) i najviše 3 serije, vrijednosti u točkama. Više osi ili serija odbija se pogreškom: iznad toga radarski grafikon nije čitljiv, koristite stupce. |

`values` umjesto `series` i `categories` prečac je za jednu seriju (`hist`, `spark`); `value` je prečac za jedan `gauge`. Svaki tip grafikona osim `tiles`, `table` i `spark` ima prekidač između grafikona i tablice; tipovi sa serijama imaju legendu koja skriva serije; svi imaju ispis očitanja ispod grafikona.

## Opcije

| Opcija | Zadano | |
|---|---|---|
| `type` | | Jedan od gornjih tipova |
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
| `stacked` | `false` | Površina: složi serije |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Pie i prsten, vidi gore |
| `bins`, `binWidth` | automatski | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Mjerač |
| `labels` | engleski | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, vaši vlastiti izrazi |
| `lang` | jezik stranice | Format brojeva, preko `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ili `genre` |
| `theme` | automatski | `light` ili `dark` za nametanje jedne |
| `motion` | automatski | `off` isključuje animaciju |
| `items` | | Samo pločice: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` je `good`, `bad` ili `neutral` |

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
| `--pc-0` do `--pc-5` | Boje serija i isječaka; `--pc-5` je ujedno boja za "Ostalo" |
| `--pc-good`, `--pc-bad` | Rub pločice za bolje i lošije |
| `--pc-cur` | Obris odabrane oznake |
| `--pc-font`, `--pc-r` | Font i polumjer kutova |

`data-pc-style` (ili opcija `style`) bira jedan od četiri skupa: `house` (zelena), `gauge` (jantarna na papiru ili crna, jednaka širina znakova), `plain` (crno-bijelo s jednim naglaskom) i `genre` (topla). Postavite svojstva na `.pc` ili na pojedinačni grafikon da biste koristili vlastita.

## Pristupačnost

- Slika je `img` s oznakom; ispod nje je područje za tipkovnicu: Tab dolazi do grafikona, tipke sa strelicama prelaze među oznakama (isječci, točke, ćelije, brojčanici, razredi), Home i End skaču, Escape briše. Odabrana oznaka ima obris i čita se u regiji `aria-live`.
- Svaki grafikon ima prikaz tablice s ispravnim zaglavljima. Serije i isječci razlikuju se uzorkom (stupci, površine, isječci) i oblikom (linije, točke), a ne samo bojom; ćelije toplinske karte nose svoj broj, zone mjerača svoj naziv; bolje i lošije na pločicama razlikuju se oznakom i riječju.
- Sav je tekst velik najmanje 13 px i ima kontrast najmanje 4,5:1; oznake imaju najmanje 3:1. Skup testova provjerava sva četiri stila u svijetloj i tamnoj temi.
- Uz smanjeno kretanje (postavka sustava ili `motion: 'off'`) stupci i linije crtaju se odmah, a brojevi se ne broje do vrijednosti.

## Performanse

Jezgra je oko 37 KB skripte i 12 KB CSS-a, zajedno 14,7 KB gzipano; extra tipovi dodaju 5,6 KB gzipano. Bez ovisnosti. Grafikoni se ponovno crtaju samo pri promjeni širine; animacija koristi CSS i počinje kad grafikon uđe u vidljivo područje.

## Testovi

`python3 tools/build.py` gradi pet datoteka iz `src/`. `python3 tests/browser.py` otvara `demo.html` u Chromiumu bez sučelja (treba Python paket `websockets`), provjerava kontrast, veličinu fonta, tipkovnicu, prikaz tablice i smanjeno kretanje za svaki tip, sva tri izvora podataka i tekst koji izlazi iz grafikona, a `--photos <mapa>` sprema snimke zaslona u svijetloj i tamnoj temi te sa smanjenim kretanjem.

## Prijevodi

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencija

Kôd je pod licencijom MIT (vidi [LICENSE](../../LICENSE)). Vrijednosti u demou su izmišljene (vidi [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Izrađeno za [psorvia.io](https://psorvia.io).
