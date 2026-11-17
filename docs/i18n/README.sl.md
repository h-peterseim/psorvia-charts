# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animirani in dostopni grafikoni za vašo spletno stran**

### ▶ [Predstavitev v živo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Stolpci okoli izhodiščne črte, združeni stolpci, črte, ploščice s ključnimi številkami in tabelarični pogled. Čisti JavaScript in CSS brez odvisnosti: vrednosti so ob oznakah, vsak grafikon deluje s tipkovnico, pri zmanjšanem gibanju pa se nič ne premika.

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

## Vrste grafikonov

| `type` | Prikazuje |
|---|---|
| `bars` | En stolpec na vrednost, ki raste od izhodiščne črte (`baseline: 1` loči hitrejše od počasnejšega). Več serij da združene stolpce. |
| `lines` | Ena črta na serijo čez kategorije, z oznako na koncu črte. |
| `tiles` | Ploščice s ključnimi številkami: število, ki šteje navzgor, oznaka (▲ ▼ =) in kratko besedilo. |
| `table` | Navadna tabela. |

`bars` in `lines` imata preklop med grafikonom in tabelo, legendo, ki skrije serije, in polje za odčitek pod grafikonom.

## Možnosti

| Možnost | Privzeto | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` ali `table` |
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
| `labels` | angleščina | `{ chart, table, view, na, hint, keys }`, vaše lastne formulacije |
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
| `--pc-0` do `--pc-3` | Barve serij |
| `--pc-good`, `--pc-bad` | Rob ploščice za boljše in slabše |
| `--pc-cur` | Obroba izbrane oznake |
| `--pc-font`, `--pc-r` | Pisava in polmer vogalov |

`data-pc-style` (ali možnost `style`) izbere enega od štirih naborov: `house` (zelena), `gauge` (jantarna na papirju ali črna, monospace), `plain` (črno-bela z enim poudarkom) in `genre` (topla). Lastnosti nastavite na `.pc` ali na posameznem grafikonu, da uporabite svoje.

## Dostopnost

- Slika je `img` z oznako; pod njo je območje za tipkovnico: Tab doseže grafikon, puščice premikajo med oznakami, Home in End skočita, Escape počisti izbiro. Izbrana oznaka je obrobljena in prebrana v območju `aria-live`.
- Vsak grafikon ima tabelarični pogled s pravilnimi glavami. Serije se razlikujejo po vzorcu (stolpci) in obliki (črte), ne le po barvi; boljše in slabše pri ploščicah po oznaki in besedi.
- Vse besedilo je veliko vsaj 13 px in ima kontrast vsaj 4,5:1; oznake imajo vsaj 3:1. Nabor testov preveri vseh štirih slogov v svetli in temni temi.
- Pri zmanjšanem gibanju (nastavitev sistema ali `motion: 'off'`) se stolpci in črte narišejo naenkrat, številke pa ne štejejo navzgor.

## Zmogljivost

Približno 23 KB skripta in 8 KB CSS, skupaj približno 10 KB po gzip, brez odvisnosti. Grafikoni se prerišejo le ob spremembi širine; animacija uporablja CSS in se začne, ko grafikon zdrsne v vidno polje.

## Testi

`python3 tools/build.py` zgradi tri datoteke iz `src/`. `python3 tests/browser.py` odpre `demo.html` v headless Chromium (potrebuje paket Pythona `websockets`), preveri kontrast, velikost pisave, tipkovnico, tabelarični pogled in zmanjšano gibanje, `--photos <folder>` pa shrani posnetke zaslona v svetli in temni temi ter pri zmanjšanem gibanju.

## Prevodi

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licenca

Koda je pod licenco MIT (glej [LICENSE](../../LICENSE)). Vrednosti v predstavitvi so izmišljene (glej [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Narejeno za [psorvia.io](https://psorvia.io).
