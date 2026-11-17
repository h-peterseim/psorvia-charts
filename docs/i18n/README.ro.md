# PSOrvia Charts

**Grafice animate și accesibile pentru site-ul tău**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demonstrație live](https://h-peterseim.github.io/psorvia-charts/)

Bare, linii, grafice circulare și inel, bare suprapuse și de 100 %, arii, puncte și bule, histogramă, sparkline, cadran, hartă termică, radar, plăci cu cifre-cheie și o vizualizare ca tabel. JavaScript și CSS simplu, fără dependențe: valorile stau lângă marcaje, fiecare grafic funcționează cu tastatura, iar cu mișcare redusă nu se mișcă nimic.

## Utilizare

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
import './psorvia-charts.extra.esm.js'; // doar pentru scatter, hist, gauge, heat, radar
auto();
</script>

Nucleul cuprinde bare, linii, arie, grafic circular, inel, bare suprapuse și de 100 %, plăci, sparkline și tabel. Graficele scatter, histogramă, cadran, hartă termică și radar se află într-un al doilea fișier, `psorvia-charts.extra.js` (script clasic, încărcat după scriptul principal) sau `psorvia-charts.extra.esm.js` (modul). Fără el, aceste tipuri raportează o eroare clară și nimic altceva nu se schimbă.
```

## Tipuri de grafice

| `type` | Arată |
|---|---|
| `bars` | O bară pe valoare, crescând de la o linie de bază (`baseline: 1` separă mai rapid de mai lent). Mai multe serii dau bare grupate. |
| `lines` | O linie pe serie peste categorii, cu etichetă la capătul liniei. |
| `area` | Linii umplute de la zero; `stacked: true` suprapune seriile (valorile negative contează ca 0). |
| `stacked` | O bară pe categorie, seriile puse cap la cap; valoarea în fiecare segment, totalul la capăt. |
| `percent` | Același lucru ca bare de 100 %; fiecare segment arată ponderea sa în categorie. |
| `pie`, `donut` | O serie, o felie pe categorie, etichetă cu valoare și pondere pe o linie de ghidaj (pe ecrane înguste într-o listă dedesubt). De la 7 felii în sus, cele mai mici se unesc în „Altele” (`maxSlices`, implicit 6; `other: false` le păstrează pe toate). Inelul arată totalul la mijloc (`center: 'mean'` pentru medie, `false` pentru nimic). |
| `tiles` | Plăci cu cifre-cheie, cu un număr care numără în sus, un marcaj (▲ ▼ =) și un text scurt. Un element poate purta `spark: [values]` pentru o linie mică. |
| `table` | Un tabel simplu. |
| `spark` | O linie mică pentru text curgător și plăci: `values`, opțional `width` și `height`; arată ultima valoare, săgețile parcurg punctele. |
| `scatter` | *(extra)* Puncte sau bule. Categoriile sunt punctele, prima serie este x, a doua y, o a treia opțională dă mărimea bulei. |
| `hist` | *(extra)* Histogramă a valorilor brute din prima serie; `bins` sau `binWidth`, altfel automat. Vizualizarea ca tabel arată clasele. |
| `gauge` | *(extra)* Un cadran pe categorie din prima serie, `min` și `max`, opțional `bands: [{ to, label }]` desenate ca zone cu model; numele zonei apare sub număr. |
| `heat` | *(extra)* Grilă de categorii (rânduri) și serii (coloane), culoarea celulei după valoare, numărul în fiecare celulă. Culoarea textului este aleasă astfel încât să păstreze 4,5:1 față de celulă. |
| `radar` | *(extra)* 3 până la 8 axe (categorii) și cel mult 3 serii, valorile la puncte. Mai multe axe sau serii sunt respinse cu o eroare: dincolo de asta un grafic radar nu mai e lizibil, folosește bare. |

`values` în loc de `series` și `categories` este o scurtătură pentru o singură serie (`hist`, `spark`); `value` este o scurtătură pentru un singur `gauge`. Fiecare tip de grafic, cu excepția `tiles`, `table` și `spark`, are un comutator între grafic și tabel; tipurile cu serii au o legendă care ascunde serii; toate au o zonă de citire sub grafic.

## Opțiuni

| Opțiune | Implicit | |
|---|---|---|
| `type` | | Unul dintre tipurile de mai sus |
| `title` | | Titlul graficului, totodată numele accesibil |
| `desc` | | Descriere scurtă sub titlu |
| `categories` | | `[{ label, note }]`, `note` apare în zona de citire și în tabel |
| `series` | | `[{ name, values }]`, `null` pentru o valoare lipsă |
| `baseline` | niciuna (bars: 0) | Valoare de referință, desenată ca linie |
| `baselineLabel` | | Text la linia de bază, de exemplu `Reference 1.0` |
| `sides` | | `[below, above]`, numele celor două părți ale liniei de bază, rostite și în zona de citire |
| `unit` | | Adăugată la fiecare număr, de exemplu `' ms'` |
| `digits` | `2` | Zecimale |
| `catHeader` | | Antetul primei coloane a tabelului |
| `source` | | Text de subsol sub grafic |
| `legend` | `true` | `false` ascunde legenda |
| `zero` | `false` | Linii: include 0 pe axa valorilor |
| `stacked` | `false` | Arie: suprapune seriile |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Grafic circular și inel, vezi mai sus |
| `bins`, `binWidth` | automat | Histogramă |
| `min`, `max`, `bands` | `0`, `100` | Cadran (`gauge`) |
| `labels` | engleză | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, formulările tale |
| `lang` | limba paginii | Formatul numerelor, prin `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` sau `genre` |
| `theme` | automat | `light` sau `dark` pentru a forța una |
| `motion` | automat | `off` oprește animația |
| `items` | | Doar plăci: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` este `good`, `bad` sau `neutral` |

## API

- `PsoCharts.create(element, spec, options)` desenează un grafic în `element` și îl returnează. `options` acceptă `style`, `theme`, `motion` și `lang` ca valori implicite pentru spec.
- `chart.set(spec)` înlocuiește datele, `chart.show('chart' | 'table')` schimbă vizualizarea, `chart.destroy()` elimină graficul.
- `PsoCharts.auto(root)` desenează fiecare `<div data-pso-chart>` din pagină. Atributul conține opțiunile ca JSON, `data-chart-source="#id"` indică sursa de date.
- `PsoCharts.read(element)`, `fromLd(json, id)` și `fromTable(table)` transformă o sursă de date într-un spec.

## Surse de date

Datele pot veni din trei locuri. Opțiunile precum `type` și `baseline` merg întotdeauna în atributul `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Numerele se află în pagină ca date structurate pe care le pot citi și mașinile. Fiecare serie este un `PropertyValue` în `variableMeasured`; `valueReference` al său listează câte un `PropertyValue` pe categorie, cu `name` și `value`:

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

Cu mai multe seturi de date într-un `@graph`, `dataset` indică `@id`-ul de folosit. Creatorul, tehnica și `isBasedOn` (cu `version`) formează subsolul. Un `description` la o valoare de categorie devine nota ei. Am ales `PropertyValue` pentru că este un tip stabil din schema.org; `Observation` este acolo încă marcat ca în așteptare.

**Tabel HTML.** Un tabel existent rămâne în pagină, cu sau fără script. Graficul este adăugat lângă el. Antetele de coloană sunt seriile, antetele de rând categoriile, un atribut `data-value` pe o celulă conține numărul exact:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON simplu.** Un `<script type="application/json">` cu spec-ul (`categories`, `series`, ...) sau spec-ul direct în `PsoCharts.create`.

## Stiluri și culori

Culorile sunt proprietăți personalizate CSS pe `.pc`, pentru luminos și întunecat (setarea sistemului, `:root[data-theme]` sau `data-pc-theme`):

| Proprietate | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Fundal, text, text secundar |
| `--pc-grid`, `--pc-sep` | Linii de grilă, separatoare |
| `--pc-0` până la `--pc-5` | Culorile seriilor și ale feliilor; `--pc-5` este și culoarea pentru „Altele” |
| `--pc-good`, `--pc-bad` | Marginea plăcii pentru mai bine și mai rău |
| `--pc-cur` | Conturul marcajului selectat |
| `--pc-font`, `--pc-r` | Font și raza colțurilor |

`data-pc-style` (sau opțiunea `style`) alege unul dintre patru seturi: `house` (verde), `gauge` (chihlimbar pe hârtie sau negru, monospațiat), `plain` (alb-negru cu un accent) și `genre` (cald). Setează proprietățile pe `.pc` sau pe un singur grafic pentru a le folosi pe ale tale.

## Accesibilitate

- Imaginea este un `img` cu etichetă; sub ea se află o zonă de tastatură: Tab ajunge la grafic, săgețile se mută între marcaje (felii, puncte, celule, cadrane, clase), Home și End sar, Escape șterge selecția. Marcajul selectat este conturat și citit într-o regiune `aria-live`.
- Fiecare grafic are o vizualizare ca tabel, cu anteturi corecte. Seriile și feliile se deosebesc prin model (bare, arii, grafice circulare) și formă (linii, puncte), nu doar prin culoare; celulele hărții termice poartă numărul, zonele cadranului numele lor; mai bine și mai rău la plăci prin marcaj și cuvânt.
- Tot textul are cel puțin 13 px și un contrast de cel puțin 4,5:1; marcajele au cel puțin 3:1. Suita de teste verifică toate cele patru stiluri în luminos și întunecat.
- Cu mișcare redusă (setarea sistemului sau `motion: 'off'`) barele și liniile sunt desenate imediat, iar numerele nu numără în sus.

## Performanță

Nucleul are aproximativ 37 KB de script și 12 KB de CSS, împreună 14,7 KB cu gzip; tipurile extra adaugă 5,6 KB cu gzip. Fără dependențe. Graficele se redesenează doar la schimbarea lățimii; animația folosește CSS și pornește când graficul ajunge în vizor.

## Teste

`python3 tools/build.py` construiește cele cinci fișiere din `src/`. `python3 tests/browser.py` deschide `demo.html` în Chromium headless (necesită pachetul Python `websockets`), verifică contrastul, dimensiunea fontului, tastatura, vizualizarea ca tabel și mișcarea redusă pentru fiecare tip, toate cele trei surse de date, textul care iese din grafic, iar `--photos <folder>` salvează capturi de ecran în luminos, întunecat și cu mișcare redusă.

## Traduceri

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licență

Codul este sub licență MIT (vezi [LICENSE](../../LICENSE)). Valorile din demonstrație sunt inventate (vezi [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Creat pentru [psorvia.io](https://psorvia.io).
