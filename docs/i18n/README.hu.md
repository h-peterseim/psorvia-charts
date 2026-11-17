# PSOrvia Charts

**Animált, akadálymentes diagramok a weboldaladhoz**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Élő demó](https://h-peterseim.github.io/psorvia-charts/demo.html)

Oszlopok, vonalak, kör- és gyűrűdiagram, halmozott és 100 %-os oszlopok, területek, pont- és buborékdiagram, hisztogram, sparkline, mérőóra, hőtérkép, radardiagram, kulcsszám-csempék és táblázatnézet. Tiszta JavaScript és CSS függőségek nélkül: az értékek a jelölők mellett állnak, minden diagram használható billentyűzettel, és csökkentett mozgásnál semmi sem mozog.

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
import './psorvia-charts.extra.esm.js'; // csak scatter, hist, gauge, heat, radar esetén
auto();
</script>
```

A mag az oszlopokat, vonalakat, területet, kört, gyűrűt, halmozott és 100 %-os oszlopokat, csempéket, sparkline-t és táblázatot fedi le. A scatter, hisztogram, mérőóra, hőtérkép és radar egy második fájlban van, `psorvia-charts.extra.js` (klasszikus szkript, a fő szkript után töltsd be) vagy `psorvia-charts.extra.esm.js` (modul). Nélküle ezek a típusok egyértelmű hibát jeleznek, és semmi más nem változik.

## Diagramtípusok

| `type` | Mit mutat |
|---|---|
| `bars` | Értékenként egy oszlop, amely az alapvonalról indul (a `baseline: 1` elválasztja a gyorsabbat a lassabbtól). Több sorozat csoportos oszlopokat ad. |
| `lines` | Sorozatonként egy vonal a kategóriákon át, a vonal végén felirattal. |
| `area` | Kitöltött vonalak nullától; a `stacked: true` egymásra halmozza a sorozatokat (a negatív értékek 0-nak számítanak). |
| `stacked` | Kategóriánként egy oszlop, a sorozatok egymás után halmozva; érték minden szakaszban, összeg a végén. |
| `percent` | Ugyanaz, mint a 100 %-os oszlopok; minden szakasz a kategóriából való részesedését mutatja. |
| `pie`, `donut` | Egy sorozat, kategóriánként egy szelet, felirat értékkel és részesedéssel egy vezetővonalon (keskeny képernyőn alatta egy listában). A 7. szelettől a legkisebbek „Egyéb” alá vonódnak össze (`maxSlices`, alapértelmezés 6; `other: false` mindet megtartja). A gyűrű közepén az összeg látszik (`center: 'mean'` az átlaghoz, `false` ha semmi). |
| `tiles` | Kulcsszám-csempék felfelé számoló számmal, jelölővel (▲ ▼ =) és rövid szöveggel. Egy elem hordozhat `spark: [values]` értéket egy kis vonalhoz. |
| `table` | Egyszerű táblázat. |
| `spark` | Kis vonal folyó szöveghez és csempékhez: `values`, opcionális `width` és `height`; az utolsó értéket mutatja, a nyílbillentyűk lépkednek a pontokon. |
| `scatter` | *(extra)* Pontok vagy buborékok. A kategóriák a pontok, az első sorozat az x, a második az y, egy opcionális harmadik a buborék mérete. |
| `hist` | *(extra)* Az első sorozat nyers értékeinek hisztogramja; `bins` vagy `binWidth`, különben automatikus. A táblázatnézet az osztályokat mutatja. |
| `gauge` | *(extra)* Kategóriánként egy mérőóra az első sorozatból, `min` és `max`, opcionális `bands: [{ to, label }]` mintás zónákként rajzolva; a zóna neve a szám alá íródik. |
| `heat` | *(extra)* Kategóriák (sorok) és sorozatok (oszlopok) rácsa, a cella színe az értékből, a szám minden cellában. A szöveg színe úgy van megválasztva, hogy a cellával szemben megtartsa a 4,5:1 arányt. |
| `radar` | *(extra)* 3–8 tengely (kategória) és legfeljebb 3 sorozat, az értékek a pontoknál. A több tengelyt vagy sorozatot hibával elutasítja: ezen túl a radardiagram nem olvasható, használj oszlopokat. |

A `values` a `series` és `categories` helyett gyorsírás egyetlen sorozathoz (`hist`, `spark`); a `value` gyorsírás egyetlen `gauge`-hoz. A `tiles`, `table` és `spark` kivételével minden diagramtípuson van váltó diagram és táblázat között; a sorozattípusokon van sorozatokat elrejtő jelmagyarázat; mindegyiken van kijelzés a diagram alatt.

## Beállítások

| Beállítás | Alapérték | |
|---|---|---|
| `type` | | A fenti típusok egyike |
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
| `stacked` | `false` | Terület: a sorozatok halmozása |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Kör és gyűrű, lásd fent |
| `bins`, `binWidth` | automatikus | Hisztogram |
| `min`, `max`, `bands` | `0`, `100` | Mérőóra |
| `labels` | angol | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, a saját megfogalmazásod |
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
| `--pc-0` – `--pc-5` | Sorozat- és szeletszínek; a `--pc-5` az „Egyéb” színe is |
| `--pc-good`, `--pc-bad` | A csempe széle a jobbhoz és a rosszabbhoz |
| `--pc-cur` | A kijelölt jelölő körvonala |
| `--pc-font`, `--pc-r` | Betűtípus és sarokrádiusz |

A `data-pc-style` (vagy a `style` beállítás) négy készlet közül választ: `house` (zöld), `gauge` (borostyán papíron vagy fekete, egyenközű), `plain` (fekete-fehér egy hangsúlyszínnel) és `genre` (meleg). Állítsd be a tulajdonságokat a `.pc` elemen vagy egyetlen diagramon, hogy a saját színeidet használd.

## Akadálymentesség

- A kép egy címkézett `img`; alatta billentyűzetes terület van: a Tab a diagramhoz visz, a nyílbillentyűk jelölők (szeletek, pontok, cellák, mérőórák, osztályok) között lépnek, a Home és az End ugrik, az Escape töröl. A kijelölt jelölőt körvonal veszi körül, és egy `aria-live` régióban felolvassa.
- Minden diagramnak van megfelelő fejlécekkel ellátott táblázatnézete. A sorozatokat és szeleteket minta (oszlopok, területek, körök) és alak (vonalak, pontok) különbözteti meg, nem csak a szín; a hőtérkép celláin ott a számuk, a mérőóra zónáin a nevük; a jobb és a rosszabb a csempéken jelölővel és szóval jelenik meg.
- Minden szöveg legalább 13 px, és legalább 4,5:1 kontrasztú; a jelölők legalább 3:1-esek. A tesztcsomag mind a négy stílust ellenőrzi világos és sötét módban.
- Csökkentett mozgásnál (rendszerbeállítás vagy `motion: 'off'`) az oszlopok és a vonalak azonnal megrajzolódnak, a számok pedig nem számolnak felfelé.

## Teljesítmény

A mag körülbelül 37 KB szkript és 12 KB CSS, együtt 14,7 KB gzip-pel tömörítve; az extra típusok 5,6 KB-ot tesznek hozzá gzip-pel tömörítve. Függőségek nélkül. A diagramok csak szélességváltozáskor rajzolódnak újra; az animáció CSS-t használ, és akkor indul, amikor a diagram a látótérbe görgetődik.

## Tesztek

A `python3 tools/build.py` a `src/` mappából építi fel az öt fájlt. A `python3 tests/browser.py` fej nélküli Chromiumban megnyitja a `demo.html`-t (a `websockets` Python-csomag kell hozzá), ellenőrzi a kontrasztot, a betűméretet, a billentyűzetet, a táblázatnézetet és a csökkentett mozgást minden típusnál, mind a három adatforrást és a diagramból kilógó szöveget, a `--photos <mappa>` pedig képernyőképeket ment világos, sötét és csökkentett mozgású módban.

## Fordítások

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licenc

A kód MIT licenc alatt áll (lásd [LICENSE](../../LICENSE)). A demóértékek kitaláltak (lásd [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

A [psorvia.io](https://psorvia.io) számára készült.
