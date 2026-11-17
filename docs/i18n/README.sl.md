# PSOrvia Charts

**Animirani in dostopni grafikoni za vašo spletno stran**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Predstavitev v živo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Stolpci, črte, tortni in obročni grafikoni, naloženi in 100-odstotni stolpci, ploskve, točkovni in mehurčkasti grafikoni, histogram, sparkline, merilnik, toplotni zemljevid, radar, ploščice s ključnimi številkami in tabelarični pogled. Čisti JavaScript in CSS brez odvisnosti: vrednosti so ob oznakah, vsak grafikon deluje s tipkovnico, pri zmanjšanem gibanju pa se nič ne premika.

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

Jedro obsega stolpce, črte, ploskev, tortni grafikon, obroč, naložene in 100-odstotne stolpce, ploščice, sparkline in tabelo. Točkovni grafikon, histogram, merilnik, toplotni zemljevid in radar so v drugi datoteki, `psorvia-charts.extra.js` (klasičen skript, naložite ga za glavnim skriptom) ali `psorvia-charts.extra.esm.js` (modul). Brez nje ti tipi javijo jasno napako, vse drugo pa ostane enako.
```

## Vrste grafikonov

| `type` | Prikazuje |
|---|---|
| `bars` | En stolpec na vrednost, ki raste od izhodiščne črte (`baseline: 1` loči hitrejše od počasnejšega). Več serij da združene stolpce. |
| `lines` | Ena črta na serijo čez kategorije, z oznako na koncu črte. |
| `area` | Zapolnjene črte od ničle; `stacked: true` naloži serije eno na drugo (negativne vrednosti štejejo kot 0). |
| `stacked` | En stolpec na kategorijo, serije zaporedoma; vrednost v vsakem odseku, vsota na koncu. |
| `percent` | Isto kot 100-odstotni stolpci; vsak odsek kaže svoj delež v kategoriji. |
| `pie`, `donut` | Ena serija, en izsek na kategorijo, oznaka z vrednostjo in deležem na vodilni črti (na ozkih zaslonih na seznamu pod grafikonom). Od 7 izsekov naprej se najmanjši združijo v „Drugo“ (`maxSlices`, privzeto 6; `other: false` obdrži vse). Obroč kaže vsoto v sredini (`center: 'mean'` za povprečje, `false` za nič). |
| `tiles` | Ploščice s ključnimi številkami: število, ki šteje navzgor, oznaka (▲ ▼ =) in kratko besedilo. Element lahko nosi `spark: [values]` za majhno črto. |
| `table` | Navadna tabela. |
| `spark` | Majhna črta za tekoče besedilo in ploščice: `values`, po želji `width` in `height`; kaže zadnjo vrednost, puščice vodijo skozi točke. |
| `scatter` | *(extra)* Točke ali mehurčki. Kategorije so točke, prva serija je x, druga y, neobvezna tretja je velikost mehurčka. |
| `hist` | *(extra)* Histogram surovih vrednosti prve serije; `bins` ali `binWidth`, sicer samodejno. Tabelarični pogled kaže razrede. |
| `gauge` | *(extra)* En merilnik na kategorijo iz prve serije, `min` in `max`, po želji `bands: [{ to, label }]`, narisani kot vzorčasta območja; ime območja je napisano pod številom. |
| `heat` | *(extra)* Mreža kategorij (vrstice) in serij (stolpci), barva celice po vrednosti, število v vsaki celici. Barva besedila je izbrana tako, da proti celici ohrani 4,5:1. |
| `radar` | *(extra)* 3 do 8 osi (kategorij) in največ 3 serije, vrednosti pri točkah. Več osi ali serij je zavrnjenih z napako: čez to radarski grafikon ni več berljiv, uporabite stolpce. |

`values` namesto `series` in `categories` je bližnjica za eno samo serijo (`hist`, `spark`); `value` je bližnjica za en sam `gauge`. Vsak tip grafikona razen `tiles`, `table` in `spark` ima preklop med grafikonom in tabelo; tipi s serijami imajo legendo, ki skrije serije; vsi imajo polje za odčitek pod grafikonom.

## Možnosti

| Možnost | Privzeto | |
|---|---|---|
| `type` | | Eden od zgornjih tipov |
| `title` | | Naslov grafikona, tudi dostopno ime |
| `desc` | | Kratek opis pod naslovom |
| `categories` | | `[{ label, note }]`, `note` se prikaže v polju za odčitek in v tabeli |
| `series` | | `[{ name, values }]`, `null` za manjkajočo vrednost |
| `baseline` | brez (bars: 0) | Referenčna vrednost, narisana kot črta |
| `baselineLabel` | | Besedilo ob izhodiščni črti, na primer `Reference 1.0` |
| `sides` | | `[below, above]`, imeni obeh strani izhodiščne črte, izgovorjeni tudi v polju za odčitek |
| `unit` | | Dodana vsaki številki, na primer `' ms'` |
| `digits` | `2` | Decimalna mesta |
| `catHeader` | | Glava prvega stolpca tabele |
| `source` | | Besedilo noge pod grafikonom |
| `legend` | `true` | `false` skrije legendo |
| `zero` | `false` | Črte: vključi 0 na osi vrednosti |
| `stacked` | `false` | Ploskev: naloži serije eno na drugo |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Tortni grafikon in obroč, glej zgoraj |
| `bins`, `binWidth` | samodejno | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Merilnik (`gauge`) |
| `labels` | angleščina | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, vaše lastne formulacije |
| `lang` | jezik strani | Oblika števil prek `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ali `genre` |
| `theme` | samodejno | `light` ali `dark` za izsiljeno izbiro |
| `motion` | samodejno | `off` izklopi animacijo |
| `items` | | Samo ploščice: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` je `good`, `bad` ali `neutral` |

## API

- `PsoCharts.create(element, spec, options)` nariše grafikon v `element` in ga vrne. `options` sprejme `style`, `theme`, `motion` in `lang` kot privzete vrednosti za spec.
- `chart.set(spec)` zamenja podatke, `chart.show('chart' | 'table')` preklopi pogled, `chart.destroy()` grafikon odstrani.
- `PsoCharts.auto(root)` nariše vsak `<div data-pso-chart>` na strani. Atribut vsebuje možnosti kot JSON, `data-chart-source="#id"` določa vir podatkov.
- `PsoCharts.read(element)`, `fromLd(json, id)` in `fromTable(table)` pretvorijo vir podatkov v spec.

## Viri podatkov

Podatki lahko pridejo iz treh krajev. Možnosti, kot sta `type` in `baseline`, vedno gredo v atribut `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Številke so na strani kot strukturirani podatki, ki jih lahko berejo tudi stroji. Vsaka serija je `PropertyValue` v `variableMeasured`; njen `valueReference` našteje po en `PropertyValue` na kategorijo z `name` in `value`:

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

Pri več naborih podatkov v enem `@graph` `dataset` določa `@id`, ki se uporabi. Avtor, tehnika in `isBasedOn` (z `version`) tvorijo nogo. `description` pri vrednosti kategorije postane njena opomba. Izbrali smo `PropertyValue`, ker je stabilen tip schema.org; `Observation` je tam še vedno označen kot čakajoč.

**Tabela HTML.** Obstoječa tabela ostane na strani, s skriptom ali brez njega. Grafikon se doda ob njej. Glave stolpcev so serije, glave vrstic kategorije, atribut `data-value` na celici vsebuje natančno število:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Navaden JSON.** Element `<script type="application/json">` s spec (`categories`, `series`, ...) ali spec neposredno v `PsoCharts.create`.

## Slogi in barve

Barve so lastne lastnosti CSS na `.pc`, za svetlo in temno temo (nastavitev sistema, `:root[data-theme]` ali `data-pc-theme`):

| Lastnost | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Ozadje, besedilo, sekundarno besedilo |
| `--pc-grid`, `--pc-sep` | Črte mreže, ločilnice |
| `--pc-0` do `--pc-5` | Barve serij in izsekov; `--pc-5` je hkrati barva za „Drugo“ |
| `--pc-good`, `--pc-bad` | Rob ploščice za boljše in slabše |
| `--pc-cur` | Obroba izbrane oznake |
| `--pc-font`, `--pc-r` | Pisava in polmer vogalov |

`data-pc-style` (ali možnost `style`) izbere enega od štirih naborov: `house` (zelena), `gauge` (jantarna na papirju ali črna, monospace), `plain` (črno-bela z enim poudarkom) in `genre` (topla). Lastnosti nastavite na `.pc` ali na posameznem grafikonu, da uporabite svoje.

## Dostopnost

- Slika je `img` z oznako; pod njo je območje za tipkovnico: Tab doseže grafikon, puščice premikajo med oznakami (izseki, točke, celice, merilniki, razredi), Home in End skočita, Escape počisti izbiro. Izbrana oznaka je obrobljena in prebrana v območju `aria-live`.
- Vsak grafikon ima tabelarični pogled s pravilnimi glavami. Serije in izseki se razlikujejo po vzorcu (stolpci, ploskve, torte) in obliki (črte, točke), ne le po barvi; celice toplotnega zemljevida nosijo svoje število, območja merilnika svoje ime; boljše in slabše pri ploščicah po oznaki in besedi.
- Vse besedilo je veliko vsaj 13 px in ima kontrast vsaj 4,5:1; oznake imajo vsaj 3:1. Nabor testov preveri vseh štirih slogov v svetli in temni temi.
- Pri zmanjšanem gibanju (nastavitev sistema ali `motion: 'off'`) se stolpci in črte narišejo naenkrat, številke pa ne štejejo navzgor.

## Zmogljivost

Jedro ima približno 37 KB skripta in 12 KB CSS, skupaj 14,7 KB po gzip; dodatni tipi dodajo 5,6 KB po gzip. Brez odvisnosti. Grafikoni se prerišejo le ob spremembi širine; animacija uporablja CSS in se začne, ko grafikon zdrsne v vidno polje.

## Testi

`python3 tools/build.py` zgradi pet datotek iz `src/`. `python3 tests/browser.py` odpre `demo.html` v headless Chromium (potrebuje paket Pythona `websockets`), preveri kontrast, velikost pisave, tipkovnico, tabelarični pogled in zmanjšano gibanje za vsak tip, vse tri vire podatkov, besedilo, ki štrli iz grafikona, `--photos <folder>` pa shrani posnetke zaslona v svetli in temni temi ter pri zmanjšanem gibanju.

## Prevodi

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licenca

Koda je pod licenco MIT (glej [LICENSE](../../LICENSE)). Vrednosti v predstavitvi so izmišljene (glej [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Narejeno za [psorvia.io](https://psorvia.io).
