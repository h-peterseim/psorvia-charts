# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animoidut, saavutettavat kaaviot verkkosivullesi**

### ▶ [Live-demo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Pylväät perusviivan ympärillä, ryhmitetyt pylväät, viivat, tunnuslukulaatat ja taulukkonäkymä. Pelkkää JavaScriptiä ja CSS:ää ilman riippuvuuksia: arvot ovat merkkien vieressä, jokainen kaavio toimii näppäimistöllä, ja vähennetyllä liikkeellä mikään ei liiku.

## Käyttö

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

## Kaaviotyypit

| `type` | Näyttää |
|---|---|
| `bars` | Yhden pylvään arvoa kohti, kasvamassa perusviivasta (`baseline: 1` erottaa nopeamman hitaammasta). Useampi sarja antaa ryhmitetyt pylväät. |
| `lines` | Yhden viivan sarjaa kohti luokkien yli, nimettynä viivan päässä. |
| `tiles` | Tunnuslukulaatat, joissa on ylöspäin laskeva luku, merkki (▲ ▼ =) ja lyhyt teksti. |
| `table` | Tavallinen taulukko. |

`bars`illa ja `lines`illa on kaavion ja taulukon välinen vaihtokytkin, sarjoja piilottava selite ja lukema kaavion alla.

## Asetukset

| Asetus | Oletus | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` tai `table` |
| `title` | | Kaavion otsikko, myös saavutettava nimi |
| `desc` | | Lyhyt kuvaus otsikon alla |
| `categories` | | `[{ label, note }]`, `note` näytetään lukemassa ja taulukossa |
| `series` | | `[{ name, values }]`, `null` puuttuvalle arvolle |
| `baseline` | ei mitään (bars: 0) | Vertailuarvo, piirretty viivana |
| `baselineLabel` | | Teksti perusviivalla, esimerkiksi `Reference 1.0` |
| `sides` | | `[below, above]`, perusviivan kahden puolen nimet, myös ääneen luettuina lukemassa |
| `unit` | | Lisätään jokaiseen lukuun, esimerkiksi `' ms'` |
| `digits` | `2` | Desimaalit |
| `catHeader` | | Taulukon ensimmäisen sarakkeen otsikko |
| `source` | | Alatunnisteteksti kaavion alla |
| `legend` | `true` | `false` piilottaa selitteen |
| `zero` | `false` | Viivat: sisällytä 0 arvoakseliin |
| `labels` | englanti | `{ chart, table, view, na, hint, keys }`, omat sanamuotosi |
| `lang` | sivun kieli | Lukujen muoto, `Intl.NumberFormat`in kautta |
| `style` | `house` | `house`, `gauge`, `plain` tai `genre` |
| `theme` | automaattinen | `light` tai `dark` pakottamaan toinen |
| `motion` | automaattinen | `off` sammuttaa animaation |
| `items` | | Vain laatat: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` on `good`, `bad` tai `neutral` |

## API

- `PsoCharts.create(element, spec, options)` piirtää kaavion elementtiin `element` ja palauttaa sen. `options` ottaa `style`, `theme`, `motion` ja `lang` määrittelyn oletuksiksi.
- `chart.set(spec)` korvaa tiedot, `chart.show('chart' | 'table')` vaihtaa näkymää, `chart.destroy()` poistaa kaavion.
- `PsoCharts.auto(root)` piirtää jokaisen sivun `<div data-pso-chart>` -elementin. Attribuutti sisältää asetukset JSONina, `data-chart-source="#id"` nimeää tietolähteen.
- `PsoCharts.read(element)`, `fromLd(json, id)` ja `fromTable(table)` muuttavat tietolähteen määrittelyksi.

## Tietolähteet

Tiedot voivat tulla kolmesta paikasta. Asetukset kuten `type` ja `baseline` tulevat aina `data-pso-chart`-attribuuttiin.

**JSON-LD (schema.org Dataset).** Luvut ovat sivulla jäsenneltynä tietona, jota myös koneet voivat lukea. Jokainen sarja on `PropertyValue` kentässä `variableMeasured`; sen `valueReference` luettelee yhden `PropertyValue`-arvon luokkaa kohti kentillä `name` ja `value`:

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

Kun yhdessä `@graph`-rakenteessa on useita aineistoja, `dataset` nimeää käytettävän `@id`:n. Tekijä, tekniikka ja `isBasedOn` (`version`ineen) muuttuvat alatunnisteeksi. Luokan arvon `description` muuttuu sen huomautukseksi. Valitsimme `PropertyValue`n, koska se on vakaa schema.org-tyyppi; `Observation` on siellä yhä merkitty odottavaksi.

**HTML-taulukko.** Olemassa oleva taulukko pysyy sivulla, skriptin kanssa tai ilman. Kaavio lisätään sen viereen. Sarakeotsikot ovat sarjat, riviotsikot luokat, solun `data-value`-attribuutti sisältää tarkan luvun:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Pelkkä JSON.** `<script type="application/json">`, jossa on määrittely (`categories`, `series`, ...), tai määrittely suoraan `PsoCharts.create`ssa.

## Tyylit ja värit

Värit ovat CSS-mukautettuja ominaisuuksia (custom properties) elementillä `.pc`, vaaleaa ja tummaa varten (järjestelmäasetus, `:root[data-theme]` tai `data-pc-theme`):

| Ominaisuus | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Tausta, teksti, toissijainen teksti |
| `--pc-grid`, `--pc-sep` | Ruudukon viivat, erottimet |
| `--pc-0` – `--pc-3` | Sarjojen värit |
| `--pc-good`, `--pc-bad` | Laatan reuna paremmalle ja huonommalle |
| `--pc-cur` | Valitun merkin ääriviiva |
| `--pc-font`, `--pc-r` | Fontti ja kulmien pyöristys |

`data-pc-style` (tai `style`-asetus) valitsee yhden neljästä kokonaisuudesta: `house` (vihreä), `gauge` (meripihka paperilla tai musta, tasalevyinen), `plain` (mustavalkoinen yhdellä korostuksella) ja `genre` (lämmin). Aseta ominaisuudet elementille `.pc` tai yksittäiselle kaaviolle käyttääksesi omiasi.

## Saavutettavuus

- Kuva on `img`, jolla on nimi; sen alla on näppäimistöalue: Tab pääsee kaavioon, nuolinäppäimet siirtyvät merkkien välillä, Home ja End hyppäävät, Escape tyhjentää valinnan. Valittu merkki saa ääriviivan ja luetaan ääneen `aria-live`-alueella.
- Jokaisella kaaviolla on taulukkonäkymä, jossa on oikeat otsikot. Sarjat erottuvat kuviolla (pylväät) ja muodolla (viivat), ei vain värillä; parempi ja huonompi laatoissa merkillä ja sanalla.
- Kaikki teksti on vähintään 13 px ja kontrasti vähintään 4,5:1; merkeillä vähintään 3:1. Testisarja tarkistaa kaikki neljä tyyliä vaaleana ja tummana.
- Vähennetyllä liikkeellä (järjestelmäasetus tai `motion: 'off'`) pylväät ja viivat piirretään heti, eivätkä luvut laske ylöspäin.

## Suorituskyky

Noin 23 KB skriptiä ja 8 KB CSS:ää, yhdessä noin 10 KB gzip-pakattuna, ilman riippuvuuksia. Kaaviot piirretään uudelleen vain leveyden muuttuessa; animaatio käyttää CSS:ää ja alkaa, kun kaavio vierittyy näkyviin.

## Testit

`python3 tools/build.py` rakentaa kolme tiedostoa hakemistosta `src/`. `python3 tests/browser.py` avaa `demo.html`:n näkymättömässä Chromiumissa (tarvitsee Python-paketin `websockets`), tarkistaa kontrastin, fonttikoon, näppäimistön, taulukkonäkymän ja vähennetyn liikkeen, ja `--photos <folder>` tallentaa kuvakaappaukset vaaleana, tummana ja vähennetyllä liikkeellä.

## Käännökset

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Lisenssi

Koodi on MIT-lisenssillä (katso [LICENSE](../../LICENSE)). Demoarvot on keksitty (katso [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Tehty sivustolle [psorvia.io](https://psorvia.io).
