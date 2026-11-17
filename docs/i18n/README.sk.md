# PSOrvia Charts

**Animované a prístupné grafy pre váš web**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Živá ukážka](https://h-peterseim.github.io/psorvia-charts/)

Stĺpce, čiary, koláčové a prstencové grafy, skladané a 100 % stĺpce, plochy, bodové a bublinové grafy, histogram, sparkline, ciferník, teplotná mapa, radar, dlaždice s kľúčovými číslami a tabuľkové zobrazenie. Čistý JavaScript a CSS bez závislostí: hodnoty sú vedľa značiek, každý graf funguje s klávesnicou a pri obmedzenom pohybe sa nič nehýbe.

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
import './psorvia-charts.extra.esm.js'; // iba pre scatter, hist, gauge, heat, radar
auto();
</script>

Jadro obsahuje stĺpce, čiary, plochu, koláč, prstenec, skladané a 100 % stĺpce, dlaždice, sparkline a tabuľku. Bodový graf, histogram, ciferník, teplotná mapa a radar sú v druhom súbore, `psorvia-charts.extra.js` (klasický skript, načítajte ho po hlavnom skripte) alebo `psorvia-charts.extra.esm.js` (modul). Bez neho tieto typy hlásia jasnú chybu a nič iné sa nemení.
```

## Typy grafov

| `type` | Zobrazuje |
|---|---|
| `bars` | Jeden stĺpec na hodnotu, rastúci od základnej čiary (`baseline: 1` oddeľuje rýchlejšie od pomalšieho). Viac sérií dáva zoskupené stĺpce. |
| `lines` | Jedna čiara na sériu cez kategórie, s popisom na konci čiary. |
| `area` | Vyplnené čiary od nuly; `stacked: true` skladá série na seba (záporné hodnoty sa počítajú ako 0). |
| `stacked` | Jeden stĺpec na kategóriu, série zoradené za sebou; hodnota v každom úseku, súčet na konci. |
| `percent` | To isté ako 100 % stĺpce; každý úsek ukazuje svoj podiel na kategórii. |
| `pie`, `donut` | Jedna séria, jeden výsek na kategóriu, popis s hodnotou a podielom na vodiacej čiare (na úzkych obrazovkách v zozname pod grafom). Od 7 výsekov sa najmenšie zlúčia do „Ostatné“ (`maxSlices`, predvolene 6; `other: false` ponechá všetky). Prstenec ukazuje súčet v strede (`center: 'mean'` pre priemer, `false` pre nič). |
| `tiles` | Dlaždice s kľúčovými číslami: číslo, ktoré sa počíta nahor, značka (▲ ▼ =) a krátky text. Položka môže niesť `spark: [values]` pre malú čiaru. |
| `table` | Obyčajná tabuľka. |
| `spark` | Malá čiara pre plynulý text a dlaždice: `values`, voliteľne `width` a `height`; ukazuje poslednú hodnotu, šípky prechádzajú body. |
| `scatter` | *(extra)* Body alebo bubliny. Kategórie sú body, prvá séria je x, druhá y, voliteľná tretia veľkosť bubliny. |
| `hist` | *(extra)* Histogram surových hodnôt prvej série; `bins` alebo `binWidth`, inak automaticky. Tabuľkové zobrazenie ukazuje triedy. |
| `gauge` | *(extra)* Jeden ciferník na kategóriu z prvej série, `min` a `max`, voliteľne `bands: [{ to, label }]` vykreslené ako zóny so vzorom; názov zóny je napísaný pod číslom. |
| `heat` | *(extra)* Mriežka kategórií (riadky) a sérií (stĺpce), farba bunky podľa hodnoty, číslo v každej bunke. Farba textu sa volí tak, aby voči bunke držala 4,5:1. |
| `radar` | *(extra)* 3 až 8 osí (kategórie) a najviac 3 série, hodnoty pri bodoch. Viac osí alebo sérií sa odmietne s chybou: nad to už radarový graf nie je čitateľný, použite stĺpce. |

`values` namiesto `series` a `categories` je skratka pre jednu sériu (`hist`, `spark`); `value` je skratka pre jeden `gauge`. Každý typ grafu okrem `tiles`, `table` a `spark` má prepínač medzi grafom a tabuľkou; typy so sériami majú legendu, ktorá skrýva série; všetky majú pole s údajmi pod grafom.

## Možnosti

| Možnosť | Predvolené | |
|---|---|---|
| `type` | | Jeden z typov vyššie |
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
| `stacked` | `false` | Plocha: skladať série na seba |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Koláč a prstenec, pozri vyššie |
| `bins`, `binWidth` | automaticky | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Ciferník (`gauge`) |
| `labels` | angličtina | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, vaše vlastné formulácie |
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
| `--pc-0` až `--pc-5` | Farby sérií a výsekov; `--pc-5` je zároveň farba pre „Ostatné“ |
| `--pc-good`, `--pc-bad` | Okraj dlaždice pre lepšie a horšie |
| `--pc-cur` | Obrys vybranej značky |
| `--pc-font`, `--pc-r` | Písmo a polomer rohov |

`data-pc-style` (alebo možnosť `style`) vyberie jednu zo štyroch sád: `house` (zelená), `gauge` (jantárová na papieri alebo čierna, monospace), `plain` (čiernobiela s jedným akcentom) a `genre` (teplá). Nastavte vlastnosti na `.pc` alebo na jednom grafe, aby ste použili vlastné.

## Prístupnosť

- Obrázok je `img` s popisom; pod ním je klávesnicová oblasť: Tab dosiahne graf, šípky sa presúvajú medzi značkami (výseky, body, bunky, ciferníky, triedy), Home a End skáču, Escape zruší výber. Vybraná značka má obrys a číta sa v regióne `aria-live`.
- Každý graf má tabuľkové zobrazenie so správnymi hlavičkami. Série a výseky sa líšia vzorom (stĺpce, plochy, koláče) a tvarom (čiary, body), nielen farbou; bunky teplotnej mapy nesú svoje číslo, zóny ciferníka svoj názov; lepšie a horšie pri dlaždiciach značkou a slovom.
- Všetok text má aspoň 13 px a kontrast aspoň 4,5:1; značky majú aspoň 3:1. Testovacia sada kontroluje všetky štyri štýly vo svetlom aj tmavom režime.
- Pri obmedzenom pohybe (nastavenie systému alebo `motion: 'off'`) sa stĺpce a čiary nakreslia naraz a čísla sa nepočítajú nahor.

## Výkon

Jadro má približne 37 KB skriptu a 12 KB CSS, spolu 14,7 KB po gzip; extra typy pridajú 5,6 KB po gzip. Bez závislostí. Grafy sa prekresľujú iba pri zmene šírky; animácia používa CSS a začne, keď graf zajde do zorného poľa.

## Testy

`python3 tools/build.py` zostaví päť súborov zo `src/`. `python3 tests/browser.py` otvorí `demo.html` v headless Chromium (vyžaduje balík Pythonu `websockets`), skontroluje kontrast, veľkosť písma, klávesnicu, tabuľkové zobrazenie a obmedzený pohyb pre každý typ, všetky tri zdroje údajov, text, ktorý presahuje graf, a `--photos <folder>` uloží snímky obrazovky vo svetlom, tmavom režime a s obmedzeným pohybom.

## Preklady

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencia

Kód je pod licenciou MIT (pozri [LICENSE](../../LICENSE)). Ukážkové hodnoty sú vymyslené (pozri [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Vytvorené pre [psorvia.io](https://psorvia.io).
