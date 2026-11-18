# PSOrvia Charts

**Animeeritud, ligipääsetavad diagrammid sinu veebilehele**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Otsedemo](https://h-peterseim.github.io/psorvia-charts/)

Tulbad, jooned, sektor- ja rõngasdiagramm, virnastatud ja 100 % tulbad, alad, punkt- ja mulldiagramm, histogramm, sparkline, ketasnäidik, kuumakaart, radar, võtenumbrite paanid ja tabelivaade. Puhas JavaScript ja CSS ilma sõltuvusteta: väärtused asuvad märkide kõrval, iga diagramm töötab klaviatuuriga ja vähendatud liikumise korral ei liigu miski.

## Kasutamine

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<script src="psorvia-charts.extra.js"></script> <!-- ainult scatter, hist, gauge, heat, radar jaoks -->
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
import './psorvia-charts.extra.esm.js'; // ainult scatter, hist, gauge, heat, radar jaoks
auto();
</script>
```

Tuum katab bars, lines, area, pie, ring, virnastatud ja 100 % tulbad, tiles, sparkline ja table. Punktdiagramm, histogramm, ketasnäidik, kuumakaart ja radar asuvad teises failis: `psorvia-charts.extra.js` (klassikaline skript, laadi see pärast põhiskripti) või `psorvia-charts.extra.esm.js` (moodul). Ilma selleta teatavad need tüübid selgest veast ja midagi muud ei muutu.

## Diagrammitüübid

| `type` | Näitab |
|---|---|
| `bars` | Ühte tulpa väärtuse kohta, mis kasvab algjoonelt (`baseline: 1` eraldab kiirema aeglasemast). Mitu andmerida annavad rühmitatud tulbad. |
| `lines` | Ühte joont andmerea kohta üle kategooriate, joone lõpus sildiga. |
| `area` | Täidetud jooned nullist; `stacked: true` virnastab andmeread (negatiivsed väärtused loetakse nulliks). |
| `stacked` | Üks tulp kategooria kohta, andmeread virnastatud otsapidi; väärtus igas segmendis, summa lõpus. |
| `percent` | Sama mis 100 % tulbad; iga segment näitab oma osa kategoorias. |
| `pie`, `donut` | Üks andmerida, üks sektor kategooria kohta, silt väärtuse ja osakaaluga juhtjoonel (kitsastel ekraanidel allpool loendis). Alates 7 sektorist liidetakse väikseimad rühma „Muud“ (`maxSlices`, vaikimisi 6; `other: false` jätab kõik alles). Rõngas näitab keskel kogusummat (`center: 'mean'` keskmise jaoks, `false` mitte millegi jaoks). |
| `tiles` | Võtenumbrite paanid koos ülespoole loendava numbri, märgi (▲ ▼ =) ja lühikese tekstiga. Kirje võib kanda `spark: [values]` väikese joone jaoks. |
| `table` | Lihtne tabel. |
| `spark` | Väike joon jooksva teksti ja paanide jaoks: `values`, valikuline `width` ja `height`; näitab viimast väärtust, nooleklahvid käivad punktid läbi. |
| `scatter` | *(extra)* Punktid või mullid. Kategooriad on punktid, esimene andmerida on x, teine y, valikuline kolmas mulli suurus. |
| `hist` | *(extra)* Esimese andmerea toorväärtuste histogramm; `bins` või `binWidth`, muidu automaatselt. Tabelivaade näitab klasse. |
| `gauge` | *(extra)* Üks ketasnäidik kategooria kohta esimesest andmereast, `min` ja `max`, valikuline `bands: [{ to, label }]` joonistatakse mustriga tsoonidena; tsooni nimi on kirjutatud numbri alla. |
| `heat` | *(extra)* Kategooriate (read) ja andmeridade (veerud) ruudustik, lahtri värv väärtuse järgi, number igas lahtris. Teksti värv valitakse nii, et see hoiab lahtri suhtes 4,5:1. |
| `radar` | *(extra)* 3 kuni 8 telge (kategooriat) ja kuni 3 andmerida, väärtused punktide juures. Rohkem telgi või andmeridu lükatakse veaga tagasi: sellest edasi pole radardiagramm loetav, kasuta tulpasid. |

`values` asemel `series` ja `categories` on otsetee ühe andmerea jaoks (`hist`, `spark`); `value` on otsetee ühe `gauge` jaoks. Igal diagrammitüübil peale `tiles`, `table` ja `spark` on diagrammi ja tabeli vahelüliti; andmeridadega tüüpidel on andmeridu peitev legend; kõigil on diagrammi all näit.

## Valikud

| Valik | Vaikimisi | |
|---|---|---|
| `type` | | Üks ülaltoodud tüüpidest |
| `title` | | Diagrammi pealkiri, ühtlasi ligipääsetav nimi |
| `desc` | | Lühikirjeldus pealkirja all |
| `categories` | | `[{ label, note }]`, `note` kuvatakse näidus ja tabelis |
| `series` | | `[{ name, values }]`, `null` puuduva väärtuse jaoks |
| `baseline` | puudub (bars: 0) | Võrdlusväärtus, joonistatud joonena |
| `baselineLabel` | | Tekst algjoone juures, näiteks `Reference 1.0` |
| `sides` | | `[below, above]`, algjoone kahe külje nimed, kõlavad ka näidus ette |
| `unit` | | Lisatakse igale arvule, näiteks `' ms'` |
| `digits` | `2` | Kümnendkohad |
| `catHeader` | | Tabeli esimese veeru päis |
| `source` | | Jalusetekst diagrammi all |
| `legend` | `true` | `false` peidab legendi |
| `zero` | `false` | Jooned: lisa väärtustelje peale 0 |
| `stacked` | `false` | Ala: virnasta andmeread |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Sektor- ja rõngasdiagramm, vt ülal |
| `bins`, `binWidth` | automaatne | Histogramm |
| `min`, `max`, `bands` | `0`, `100` | Ketasnäidik |
| `labels` | inglise keel | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, sinu enda sõnastus |
| `lang` | lehe keel | Arvuvorming, `Intl.NumberFormat` kaudu |
| `style` | `house` | `house`, `gauge`, `plain` või `genre` |
| `theme` | automaatne | `light` või `dark` ühe sundimiseks |
| `motion` | automaatne | `off` lülitab animatsiooni välja |
| `items` | | Ainult paanid: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` on `good`, `bad` või `neutral` |

## API

- `PsoCharts.create(element, spec, options)` joonistab diagrammi elementi `element` ja tagastab selle. `options` võtab `style`, `theme`, `motion` ja `lang` spetsifikatsiooni vaikeväärtustena.
- `chart.set(spec)` asendab andmed, `chart.show('chart' | 'table')` vahetab vaadet, `chart.destroy()` eemaldab diagrammi.
- `PsoCharts.auto(root)` joonistab iga lehel oleva `<div data-pso-chart>`. Atribuut sisaldab valikuid JSON-ina, `data-chart-source="#id"` nimetab andmeallika.
- `PsoCharts.read(element)`, `fromLd(json, id)` ja `fromTable(table)` muudavad andmeallika spetsifikatsiooniks.

## Andmeallikad

Andmed võivad tulla kolmest kohast. Valikud nagu `type` ja `baseline` lähevad alati atribuuti `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Arvud asuvad lehel struktureeritud andmetena, mida saavad lugeda ka masinad. Iga andmerida on `PropertyValue` väljas `variableMeasured`; selle `valueReference` loetleb kategooria kohta ühe `PropertyValue` koos `name` ja `value`:

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

Mitme andmekogumi korral ühes `@graph`-is nimetab `dataset` kasutatava `@id`. Looja, meetod ja `isBasedOn` (koos `version`-iga) muutuvad jaluseks. Kategooria väärtuse `description` muutub selle märkuseks. Valisime `PropertyValue`, sest see on stabiilne schema.org tüüp; `Observation` on seal veel märgitud ootel olevaks.

**HTML-tabel.** Olemasolev tabel jääb lehele, skriptiga või ilma. Diagramm lisatakse selle kõrvale. Veergude päised on andmeread, reapäised kategooriad, lahtri atribuut `data-value` hoiab täpset arvu:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Lihtne JSON.** `<script type="application/json">` spetsifikatsiooniga (`categories`, `series`, ...) või spetsifikatsioon otse `PsoCharts.create` kutses.

## Stiilid ja värvid

Värvid on CSS-i kohandatud omadused elemendil `.pc`, heleda ja tumeda jaoks (süsteemi seadistus, `:root[data-theme]` või `data-pc-theme`):

| Omadus | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Taust, tekst, teisejärguline tekst |
| `--pc-grid`, `--pc-sep` | Ruudustiku jooned, eraldajad |
| `--pc-0` kuni `--pc-5` | Andmeridade ja sektorite värvid; `--pc-5` on ühtlasi rühma „Muud“ värv |
| `--pc-good`, `--pc-bad` | Paani serv parema ja halvema jaoks |
| `--pc-cur` | Valitud märgi kontuur |
| `--pc-font`, `--pc-r` | Kirjatüüp ja nurkade raadius |

`data-pc-style` (või valik `style`) valib ühe nelja komplekti seast: `house` (roheline), `gauge` (merevaik paberil või must, püsilaiusega), `plain` (mustvalge ühe rõhuvärviga) ja `genre` (soe). Määra omadused elemendil `.pc` või üksikul diagrammil, et kasutada enda omi.

## Ligipääsetavus

- Pilt on sildiga `img`; selle all on klaviatuuriala: Tab jõuab diagrammini, nooleklahvid liiguvad märkide vahel (sektorid, punktid, lahtrid, ketasnäidikud, klassid), Home ja End hüppavad, Escape tühistab valiku. Valitud märk kontuuritakse ja loetakse ette `aria-live` piirkonnas.
- Igal diagrammil on tabelivaade korrektsete päistega. Andmeread ja sektorid erinevad mustri (tulbad, alad, sektordiagrammid) ja kuju (jooned, punktid) poolest, mitte ainult värvi poolest; kuumakaardi lahtrid kannavad oma numbrit, ketasnäidiku tsoonid oma nime; parem ja halvem paanidel märgi ja sõna poolest.
- Kogu tekst on vähemalt 13 px ja kontrast on vähemalt 4,5:1; märkidel vähemalt 3:1. Testikomplekt kontrollib kõiki nelja stiili heledas ja tumedas.
- Vähendatud liikumise korral (süsteemi seadistus või `motion: 'off'`) joonistatakse tulbad ja jooned korraga ning numbrid ei loenda üles.

## Jõudlus

Tuum on umbes 37 KB skripti ja 12 KB CSS-i, kokku 14,7 KB gzip-tihendatult; lisatüübid lisavad 5,6 KB gzip-tihendatult. Sõltuvusteta. Diagramme joonistatakse uuesti ainult laiuse muutumisel; animatsioon kasutab CSS-i ja algab, kui diagramm kerimisel vaatesse jõuab.

## Testid

`python3 tools/build.py` ehitab viis faili kaustast `src/`. `python3 tests/browser.py` avab `demo.html` peata Chromiumis (vajab Pythoni paketti `websockets`), kontrollib kontrasti, kirjasuurust, klaviatuuri, tabelivaadet ja vähendatud liikumist iga tüübi puhul, kõiki kolme andmeallikat, diagrammist välja ulatuvat teksti ning `--photos <folder>` salvestab ekraanipildid heledas, tumedas ja vähendatud liikumisega.

## Tõlked

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Norsk bokmål](README.nb.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md) · [Türkçe](README.tr.md)

## Litsents

Kood on MIT-litsentsi all (vt [LICENSE](../../LICENSE)). Demoväärtused on välja mõeldud (vt [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Tehtud saidile [psorvia.io](https://psorvia.io).
