# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animované a prístupné grafy pre váš web**

### ▶ [Živá ukážka](https://h-peterseim.github.io/psorvia-charts/demo.html)

Stĺpce okolo základnej čiary, zoskupené stĺpce, čiary, dlaždice s kľúčovými číslami a tabuľkové zobrazenie. Čistý JavaScript a CSS bez závislostí: hodnoty sú vedľa značiek, každý graf funguje s klávesnicou a pri obmedzenom pohybe sa nič nehýbe.

## Použitie

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

## Typy grafov

| `type` | Zobrazuje |
|---|---|
| `bars` | Jeden stĺpec na hodnotu, rastúci od základnej čiary (`baseline: 1` oddeľuje rýchlejšie od pomalšieho). Viac sérií dáva zoskupené stĺpce. |
| `lines` | Jedna čiara na sériu cez kategórie, s popisom na konci čiary. |
| `tiles` | Dlaždice s kľúčovými číslami: číslo, ktoré sa počíta nahor, značka (▲ ▼ =) a krátky text. |
| `table` | Obyčajná tabuľka. |

`bars` a `lines` majú prepínač medzi grafom a tabuľkou, legendu, ktorá skrýva série, a pole s údajmi pod grafom.

## Možnosti

| Možnosť | Predvolené | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` alebo `table` |
| `title` | | Názov grafu, zároveň prístupný názov |
| `desc` | | Krátky popis pod názvom |
| `categories` | | `[{ label, note }]`, `note` sa zobrazí v poli s údajmi a v tabuľke |
| `series` | | `[{ name, values }]`, `null` pre chýbajúcu hodnotu |
| `baseline` | žiadna (bars: 0) | Referenčná hodnota, nakreslená ako čiara |
| `baselineLabel` | | Text pri základnej čiare, napríklad `Reference 1.0` |
| `sides` | | `[below, above]`, názvy dvoch strán základnej čiary, vyslovené aj v poli s údajmi |
| `unit` | | Pripojená ku každému číslu, napríklad `' ms'` |
| `digits` | `2` | Desatinné miesta |
| `catHeader` | | Hlavička prvého stĺpca tabuľky |
| `source` | | Text päty pod grafom |
| `legend` | `true` | `false` skryje legendu |
| `zero` | `false` | Čiary: zahrnie 0 na osi hodnôt |
| `labels` | angličtina | `{ chart, table, view, na, hint, keys }`, vaše vlastné formulácie |
| `lang` | jazyk stránky | Formát čísel cez `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` alebo `genre` |
| `theme` | automaticky | `light` alebo `dark` na vynútenie jednej |
| `motion` | automaticky | `off` vypne animáciu |
| `items` | | Iba dlaždice: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` je `good`, `bad` alebo `neutral` |

## API

- `PsoCharts.create(element, spec, options)` nakreslí graf do `element` a vráti ho. `options` prijíma `style`, `theme`, `motion` a `lang` ako predvolené hodnoty pre spec.
- `chart.set(spec)` nahradí údaje, `chart.show('chart' | 'table')` prepne zobrazenie, `chart.destroy()` graf odstráni.
- `PsoCharts.auto(root)` nakreslí každý `<div data-pso-chart>` na stránke. Atribút obsahuje možnosti ako JSON, `data-chart-source="#id"` určuje zdroj údajov.
- `PsoCharts.read(element)`, `fromLd(json, id)` a `fromTable(table)` premenia zdroj údajov na spec.

## Zdroje údajov

Údaje môžu pochádzať z troch miest. Možnosti ako `type` a `baseline` idú vždy do atribútu `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Čísla sú na stránke ako štruktúrované údaje, ktoré vedia čítať aj stroje. Každá séria je `PropertyValue` v `variableMeasured`; jej `valueReference` uvádza jednu `PropertyValue` na kategóriu s `name` a `value`:

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

Pri viacerých datasetoch v jednom `@graph` určuje `dataset` použité `@id`. Autor, technika a `isBasedOn` (s `version`) tvoria pätu. `description` pri hodnote kategórie sa stane jej poznámkou. Zvolili sme `PropertyValue`, lebo je to stabilný typ schema.org; `Observation` je tam stále označený ako čakajúci.

**Tabuľka HTML.** Existujúca tabuľka zostáva na stránke, so skriptom aj bez neho. Graf sa pridá vedľa nej. Hlavičky stĺpcov sú série, hlavičky riadkov kategórie, atribút `data-value` na bunke obsahuje presné číslo:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Obyčajný JSON.** Prvok `<script type="application/json">` so spec (`categories`, `series`, ...) alebo spec priamo v `PsoCharts.create`.

## Štýly a farby

Farby sú vlastné vlastnosti CSS na `.pc`, pre svetlý a tmavý režim (nastavenie systému, `:root[data-theme]` alebo `data-pc-theme`):

| Vlastnosť | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Pozadie, text, vedľajší text |
| `--pc-grid`, `--pc-sep` | Čiary mriežky, oddeľovače |
| `--pc-0` až `--pc-3` | Farby sérií |
| `--pc-good`, `--pc-bad` | Okraj dlaždice pre lepšie a horšie |
| `--pc-cur` | Obrys vybranej značky |
| `--pc-font`, `--pc-r` | Písmo a polomer rohov |

`data-pc-style` (alebo možnosť `style`) vyberie jednu zo štyroch sád: `house` (zelená), `gauge` (jantárová na papieri alebo čierna, monospace), `plain` (čiernobiela s jedným akcentom) a `genre` (teplá). Nastavte vlastnosti na `.pc` alebo na jednom grafe, aby ste použili vlastné.

## Prístupnosť

- Obrázok je `img` s popisom; pod ním je klávesnicová oblasť: Tab dosiahne graf, šípky sa presúvajú medzi značkami, Home a End skáču, Escape zruší výber. Vybraná značka má obrys a číta sa v regióne `aria-live`.
- Každý graf má tabuľkové zobrazenie so správnymi hlavičkami. Série sa líšia vzorom (stĺpce) a tvarom (čiary), nielen farbou; lepšie a horšie pri dlaždiciach značkou a slovom.
- Všetok text má aspoň 13 px a kontrast aspoň 4,5:1; značky majú aspoň 3:1. Testovacia sada kontroluje všetky štyri štýly vo svetlom aj tmavom režime.
- Pri obmedzenom pohybe (nastavenie systému alebo `motion: 'off'`) sa stĺpce a čiary nakreslia naraz a čísla sa nepočítajú nahor.

## Výkon

Približne 23 KB skriptu a 8 KB CSS, spolu približne 10 KB po gzip, bez závislostí. Grafy sa prekresľujú iba pri zmene šírky; animácia používa CSS a začne, keď graf zajde do zorného poľa.

## Testy

`python3 tools/build.py` zostaví tri súbory zo `src/`. `python3 tests/browser.py` otvorí `demo.html` v headless Chromium (vyžaduje balík Pythonu `websockets`), skontroluje kontrast, veľkosť písma, klávesnicu, tabuľkové zobrazenie a obmedzený pohyb a `--photos <folder>` uloží snímky obrazovky vo svetlom, tmavom režime a s obmedzeným pohybom.

## Preklady

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencia

Kód je pod licenciou MIT (pozri [LICENSE](../../LICENSE)). Ukážkové hodnoty sú vymyslené (pozri [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Vytvorené pre [psorvia.io](https://psorvia.io).
