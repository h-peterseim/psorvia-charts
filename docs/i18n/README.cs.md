# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animované, přístupné grafy pro váš web**

### ▶ [Živá ukázka](https://h-peterseim.github.io/psorvia-charts/demo.html)

Sloupce kolem základní linie, seskupené sloupce, čáry, dlaždice s klíčovými čísly a tabulkový pohled. Čisté JavaScript a CSS bez závislostí: hodnoty jsou vedle značek, každý graf funguje s klávesnicí a při omezeném pohybu se nic nehýbe.

## Použití

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

## Typy grafů

| `type` | Zobrazuje |
|---|---|
| `bars` | Jeden sloupec na hodnotu, rostoucí od základní linie (`baseline: 1` odděluje rychlejší od pomalejšího). Více řad dává seskupené sloupce. |
| `lines` | Jednu čáru na řadu přes kategorie, popsanou na konci čáry. |
| `tiles` | Dlaždice s klíčovými čísly s číslem, které se počítá nahoru, značkou (▲ ▼ =) a krátkým textem. |
| `table` | Obyčejnou tabulku. |

`bars` a `lines` mají přepínač mezi grafem a tabulkou, legendu, která skrývá řady, a údaj pod grafem.

## Volby

| Volba | Výchozí | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` nebo `table` |
| `title` | | Název grafu, zároveň přístupný název |
| `desc` | | Krátký popis pod názvem |
| `categories` | | `[{ label, note }]`, `note` se zobrazí v údaji pod grafem a v tabulce |
| `series` | | `[{ name, values }]`, `null` pro chybějící hodnotu |
| `baseline` | žádná (bars: 0) | Referenční hodnota, vykreslená jako čára |
| `baselineLabel` | | Text u základní linie, například `Reference 1.0` |
| `sides` | | `[below, above]`, názvy obou stran základní linie, vyslovují se i v údaji pod grafem |
| `unit` | | Připojí se ke každému číslu, například `' ms'` |
| `digits` | `2` | Desetinná místa |
| `catHeader` | | Záhlaví prvního sloupce tabulky |
| `source` | | Text v patičce pod grafem |
| `legend` | `true` | `false` skryje legendu |
| `zero` | `false` | Čáry: zahrne 0 na osu hodnot |
| `labels` | angličtina | `{ chart, table, view, na, hint, keys }`, vaše vlastní formulace |
| `lang` | jazyk stránky | Formát čísel přes `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` nebo `genre` |
| `theme` | automaticky | `light` nebo `dark` pro pevnou volbu |
| `motion` | automaticky | `off` vypne animaci |
| `items` | | Jen dlaždice: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` je `good`, `bad` nebo `neutral` |

## API

- `PsoCharts.create(element, spec, options)` vykreslí graf do `element` a vrátí ho. `options` přijímá `style`, `theme`, `motion` a `lang` jako výchozí hodnoty pro specifikaci.
- `chart.set(spec)` nahradí data, `chart.show('chart' | 'table')` přepne zobrazení, `chart.destroy()` graf odstraní.
- `PsoCharts.auto(root)` vykreslí každý `<div data-pso-chart>` na stránce. Atribut obsahuje volby jako JSON, `data-chart-source="#id"` určuje zdroj dat.
- `PsoCharts.read(element)`, `fromLd(json, id)` a `fromTable(table)` převedou zdroj dat na specifikaci.

## Zdroje dat

Data mohou pocházet ze tří míst. Volby jako `type` a `baseline` patří vždy do atributu `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Čísla jsou na stránce jako strukturovaná data, která čtou i stroje. Každá řada je `PropertyValue` ve `variableMeasured`; její `valueReference` uvádí jednu `PropertyValue` na kategorii s `name` a `value`:

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

Při více datových sadách v jednom `@graph` určuje `dataset`, které `@id` použít. Autor, technika a `isBasedOn` (s `version`) se stanou patičkou. `description` u hodnoty kategorie se stane její poznámkou. Zvolili jsme `PropertyValue`, protože je to stabilní typ schema.org; `Observation` je tam stále označen jako čekající.

**HTML tabulka.** Existující tabulka zůstává na stránce, se skriptem i bez něj. Graf se přidá vedle ní. Záhlaví sloupců jsou řady, záhlaví řádků kategorie, atribut `data-value` u buňky nese přesné číslo:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Čisté JSON.** `<script type="application/json">` se specifikací (`categories`, `series`, ...) nebo specifikace přímo v `PsoCharts.create`.

## Styly a barvy

Barvy jsou vlastní vlastnosti CSS na `.pc`, pro světlý i tmavý režim (nastavení systému, `:root[data-theme]` nebo `data-pc-theme`):

| Vlastnost | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Pozadí, text, vedlejší text |
| `--pc-grid`, `--pc-sep` | Čáry mřížky, oddělovače |
| `--pc-0` až `--pc-3` | Barvy řad |
| `--pc-good`, `--pc-bad` | Okraj dlaždice pro lepší a horší |
| `--pc-cur` | Obrys vybrané značky |
| `--pc-font`, `--pc-r` | Písmo a poloměr rohů |

`data-pc-style` (nebo volba `style`) vybírá jednu ze čtyř sad: `house` (zelená), `gauge` (jantarová na papíru nebo černá, neproporcionální písmo), `plain` (černobílá s jedním akcentem) a `genre` (teplá). Nastavte vlastnosti na `.pc` nebo na jednom grafu a použijte vlastní.

## Přístupnost

- Obrázek je `img` s popiskem; pod ním je oblast pro klávesnici: Tab dojde ke grafu, šipky přecházejí mezi značkami, Home a End skáčou, Escape zruší výběr. Vybraná značka je orámována a přečtena v oblasti `aria-live`.
- Každý graf má tabulkový pohled se správnými záhlavími. Řady se liší vzorem (sloupce) a tvarem (čáry), nejen barvou; lepší a horší na dlaždicích značkou a slovem.
- Veškerý text má alespoň 13 px a kontrast alespoň 4,5:1; značky mají alespoň 3:1. Testovací sada kontroluje všechny čtyři styly ve světlém i tmavém režimu.
- Při omezeném pohybu (nastavení systému nebo `motion: 'off'`) se sloupce a čáry vykreslí hned a čísla se nepočítají nahoru.

## Výkon

Asi 23 KB skriptu a 8 KB CSS, dohromady asi 10 KB po komprimaci gzip, bez závislostí. Grafy se překreslují jen při změně šířky; animace používá CSS a spustí se, když graf vyjede do zobrazení.

## Testy

`python3 tools/build.py` sestaví tři soubory ze `src/`. `python3 tests/browser.py` otevře `demo.html` v bezhlavém Chromiu (vyžaduje balíček Pythonu `websockets`), zkontroluje kontrast, velikost písma, klávesnici, tabulkový pohled a omezený pohyb a `--photos <folder>` uloží snímky obrazovky ve světlém, tmavém režimu a při omezeném pohybu.

## Překlady

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licence

Kód je pod licencí MIT (viz [LICENSE](../../LICENSE)). Ukázkové hodnoty jsou vymyšlené (viz [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Vytvořeno pro [psorvia.io](https://psorvia.io).
