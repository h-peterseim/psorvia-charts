# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animált, akadálymentes diagramok a weboldaladhoz**

### ▶ [Élő demó](https://h-peterseim.github.io/psorvia-charts/demo.html)

Oszlopok egy alapvonal körül, csoportos oszlopok, vonalak, kulcsszám-csempék és táblázatnézet. Tiszta JavaScript és CSS függőségek nélkül: az értékek a jelölők mellett állnak, minden diagram használható billentyűzettel, és csökkentett mozgásnál semmi sem mozog.

## Használat

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

## Diagramtípusok

| `type` | Mit mutat |
|---|---|
| `bars` | Értékenként egy oszlop, amely az alapvonalról indul (a `baseline: 1` elválasztja a gyorsabbat a lassabbtól). Több sorozat csoportos oszlopokat ad. |
| `lines` | Sorozatonként egy vonal a kategóriákon át, a vonal végén felirattal. |
| `tiles` | Kulcsszám-csempék felfelé számoló számmal, jelölővel (▲ ▼ =) és rövid szöveggel. |
| `table` | Egyszerű táblázat. |

A `bars` és a `lines` típusban van kapcsoló diagram és táblázat között, sorozatokat elrejtő jelmagyarázat, és a diagram alatt egy kiolvasósor.

## Beállítások

| Beállítás | Alapérték | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` vagy `table` |
| `title` | | A diagram címe, egyben az akadálymentes neve |
| `desc` | | Rövid leírás a cím alatt |
| `categories` | | `[{ label, note }]`, a `note` a kiolvasósorban és a táblázatban jelenik meg |
| `series` | | `[{ name, values }]`, hiányzó értéknél `null` |
| `baseline` | nincs (bars: 0) | Referenciaérték, vonalként megrajzolva |
| `baselineLabel` | | Az alapvonalnál álló szöveg, például `Reference 1.0` |
| `sides` | | `[below, above]`, az alapvonal két oldalának neve, a kiolvasósorban is felolvassa |
| `unit` | | Minden számhoz hozzáfűzve, például `' ms'` |
| `digits` | `2` | Tizedesjegyek |
| `catHeader` | | A táblázat első oszlopának fejléce |
| `source` | | Lábjegyzet-szöveg a diagram alatt |
| `legend` | `true` | A `false` elrejti a jelmagyarázatot |
| `zero` | `false` | Vonalak: a 0 is szerepeljen az értéktengelyen |
| `labels` | angol | `{ chart, table, view, na, hint, keys }`, a saját megfogalmazásod |
| `lang` | az oldal nyelve | Számformátum, az `Intl.NumberFormat` révén |
| `style` | `house` | `house`, `gauge`, `plain` vagy `genre` |
| `theme` | automatikus | `light` vagy `dark` az egyik kikényszerítéséhez |
| `motion` | automatikus | az `off` kikapcsolja az animációt |
| `items` | | Csak csempéknél: `[{ label, value, unit, digits, mark, sub, tone }]`, a `tone` értéke `good`, `bad` vagy `neutral` |

## API

- A `PsoCharts.create(element, spec, options)` diagramot rajzol az `element`-be, és visszaadja azt. Az `options` a `style`, `theme`, `motion` és `lang` értékeket fogadja a specifikáció alapértékeiként.
- A `chart.set(spec)` lecseréli az adatokat, a `chart.show('chart' | 'table')` nézetet vált, a `chart.destroy()` eltávolítja a diagramot.
- A `PsoCharts.auto(root)` megrajzol minden `<div data-pso-chart>` elemet az oldalon. Az attribútum JSON-ként tartalmazza a beállításokat, a `data-chart-source="#id"` megnevezi az adatforrást.
- A `PsoCharts.read(element)`, a `fromLd(json, id)` és a `fromTable(table)` egy adatforrásból specifikációt készít.

## Adatforrások

Az adatok három helyről jöhetnek. A beállítások, például a `type` és a `baseline`, mindig a `data-pso-chart` attribútumba kerülnek.

**JSON-LD (schema.org Dataset).** A számok strukturált adatként vannak az oldalban, amelyet gépek is olvashatnak. Minden sorozat egy `PropertyValue` a `variableMeasured` alatt; a `valueReference` kategóriánként egy `PropertyValue`-t sorol fel `name` és `value` mezővel:

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

Ha több adatkészlet van egyetlen `@graph`-ban, a `dataset` megnevezi a használandó `@id`-t. A létrehozó, a technika és az `isBasedOn` (a `version`-nel) adja a láblécet. A kategóriaértéken lévő `description` a megjegyzése lesz. A `PropertyValue`-t azért választottuk, mert stabil schema.org-típus; az `Observation` ott még függőben jelölésű.

**HTML-táblázat.** Egy meglévő táblázat az oldalban marad, szkripttel vagy anélkül. A diagram mellé kerül. Az oszlopfejlécek a sorozatok, a sorfejlécek a kategóriák, a cellán lévő `data-value` attribútum a pontos számot tartalmazza:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Egyszerű JSON.** Egy `<script type="application/json">` a specifikációval (`categories`, `series`, ...), vagy a specifikáció közvetlenül a `PsoCharts.create`-ben.

## Stílusok és színek

A színek CSS egyéni tulajdonságok a `.pc` elemen, világos és sötét módra (rendszerbeállítás, `:root[data-theme]` vagy `data-pc-theme`):

| Tulajdonság | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Háttér, szöveg, másodlagos szöveg |
| `--pc-grid`, `--pc-sep` | Rácsvonalak, elválasztók |
| `--pc-0` – `--pc-3` | Sorozatszínek |
| `--pc-good`, `--pc-bad` | A csempe széle a jobbhoz és a rosszabbhoz |
| `--pc-cur` | A kijelölt jelölő körvonala |
| `--pc-font`, `--pc-r` | Betűtípus és sarokrádiusz |

A `data-pc-style` (vagy a `style` beállítás) négy készlet közül választ: `house` (zöld), `gauge` (borostyán papíron vagy fekete, egyenközű), `plain` (fekete-fehér egy hangsúlyszínnel) és `genre` (meleg). Állítsd be a tulajdonságokat a `.pc` elemen vagy egyetlen diagramon, hogy a saját színeidet használd.

## Akadálymentesség

- A kép egy címkézett `img`; alatta billentyűzetes terület van: a Tab a diagramhoz visz, a nyílbillentyűk jelölők között lépnek, a Home és az End ugrik, az Escape töröl. A kijelölt jelölőt körvonal veszi körül, és egy `aria-live` régióban felolvassa.
- Minden diagramnak van megfelelő fejlécekkel ellátott táblázatnézete. A sorozatokat minta (oszlopok) és alak (vonalak) különbözteti meg, nem csak a szín; a jobb és a rosszabb a csempéken jelölővel és szóval jelenik meg.
- Minden szöveg legalább 13 px, és legalább 4,5:1 kontrasztú; a jelölők legalább 3:1-esek. A tesztcsomag mind a négy stílust ellenőrzi világos és sötét módban.
- Csökkentett mozgásnál (rendszerbeállítás vagy `motion: 'off'`) az oszlopok és a vonalak azonnal megrajzolódnak, a számok pedig nem számolnak felfelé.

## Teljesítmény

Körülbelül 23 KB szkript és 8 KB CSS, együtt körülbelül 10 KB gzip-pel tömörítve, függőségek nélkül. A diagramok csak szélességváltozáskor rajzolódnak újra; az animáció CSS-t használ, és akkor indul, amikor a diagram a látótérbe görgetődik.

## Tesztek

A `python3 tools/build.py` a `src/` mappából építi fel a három fájlt. A `python3 tests/browser.py` fej nélküli Chromiumban megnyitja a `demo.html`-t (a `websockets` Python-csomag kell hozzá), ellenőrzi a kontrasztot, a betűméretet, a billentyűzetet, a táblázatnézetet és a csökkentett mozgást, a `--photos <mappa>` pedig képernyőképeket ment világos, sötét és csökkentett mozgású módban.

## Fordítások

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licenc

A kód MIT licenc alatt áll (lásd [LICENSE](../../LICENSE)). A demóértékek kitaláltak (lásd [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

A [psorvia.io](https://psorvia.io) számára készült.
