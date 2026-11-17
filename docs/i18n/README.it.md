# PSOrvia Charts

**Grafici animati e accessibili per il tuo sito web**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demo dal vivo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Barre, linee, torte e anelli, barre impilate e al 100%, aree, dispersione e bolle, istogramma, sparkline, indicatore, mappa di calore, radar, riquadri di cifre chiave e vista a tabella. JavaScript e CSS puri, senza dipendenze: i valori stanno accanto ai segni, ogni grafico funziona con la tastiera e con il movimento ridotto non si muove nulla.

## Utilizzo

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
import './psorvia-charts.extra.esm.js'; // solo per scatter, hist, gauge, heat, radar
auto();
</script>
```

Il nucleo copre barre, linee, aree, torte, anelli, barre impilate e al 100%, riquadri, sparkline e tabella. Scatter, istogramma, indicatore, mappa di calore e radar si trovano in un secondo file, `psorvia-charts.extra.js` (script classico, da caricare dopo lo script principale) o `psorvia-charts.extra.esm.js` (modulo). Senza di esso questi tipi segnalano un errore chiaro e nient'altro cambia.

## Tipi di grafico

| `type` | Mostra |
|---|---|
| `bars` | Una barra per valore, che parte da una linea di base (`baseline: 1` separa il più veloce dal più lento). Più serie danno barre raggruppate. |
| `lines` | Una linea per serie lungo le categorie, con etichetta alla fine della linea. |
| `area` | Linee riempite a partire da zero; `stacked: true` impila le serie (i valori negativi contano come 0). |
| `stacked` | Una barra per categoria, con le serie impilate una dopo l'altra; il valore in ogni segmento, il totale in fondo. |
| `percent` | Come le barre al 100%; ogni segmento mostra la sua quota della categoria. |
| `pie`, `donut` | Una serie, una fetta per categoria, etichetta con valore e quota su una linea guida (su schermi stretti in un elenco sotto). Da 7 fette in poi le più piccole vengono unite in "Altro" (`maxSlices`, predefinito 6; `other: false` le mantiene tutte). L'anello mostra il totale al centro (`center: 'mean'` per la media, `false` per niente). |
| `tiles` | Riquadri di cifre chiave con un numero che conta fino al valore, un segno (▲ ▼ =) e un breve testo. Un elemento può avere `spark: [values]` per una piccola linea. |
| `table` | Una semplice tabella. |
| `spark` | Una piccola linea per il testo corrente e i riquadri: `values`, `width` e `height` facoltativi; mostra l'ultimo valore, i tasti freccia scorrono i punti. |
| `scatter` | *(extra)* Punti o bolle. Le categorie sono i punti, la prima serie è x, la seconda y, una terza facoltativa la dimensione della bolla. |
| `hist` | *(extra)* Istogramma dei valori grezzi della prima serie; `bins` o `binWidth`, altrimenti automatico. La vista a tabella mostra le classi. |
| `gauge` | *(extra)* Un quadrante per categoria dalla prima serie, `min` e `max`, `bands: [{ to, label }]` facoltativo disegnato come zone a motivo; il nome della zona è scritto sotto il numero. |
| `heat` | *(extra)* Griglia di categorie (righe) e serie (colonne), colore della cella dal valore, il numero in ogni cella. Il colore del testo è scelto in modo da mantenere 4,5:1 rispetto alla cella. |
| `radar` | *(extra)* Da 3 a 8 assi (categorie) e al massimo 3 serie, valori nei punti. Più assi o serie vengono rifiutati con un errore: oltre, un radar non è leggibile, usa le barre. |

`values` al posto di `series` e `categories` è una scorciatoia per una sola serie (`hist`, `spark`); `value` è una scorciatoia per un solo `gauge`. Ogni tipo di grafico tranne `tiles`, `table` e `spark` ha un interruttore tra grafico e tabella; i tipi a serie hanno una legenda che nasconde le serie; tutti hanno una lettura sotto il grafico.

## Opzioni

| Opzione | Predefinito | |
|---|---|---|
| `type` | | Uno dei tipi sopra |
| `title` | | Titolo del grafico, anche nome accessibile |
| `desc` | | Breve descrizione sotto il titolo |
| `categories` | | `[{ label, note }]`, `note` compare nella lettura e nella tabella |
| `series` | | `[{ name, values }]`, `null` per un valore mancante |
| `baseline` | nessuna (bars: 0) | Valore di riferimento, disegnato come linea |
| `baselineLabel` | | Testo sulla linea di base, per esempio `Reference 1.0` |
| `sides` | | `[below, above]`, nomi dei due lati della linea di base, letti anche nella lettura |
| `unit` | | Aggiunta a ogni numero, per esempio `' ms'` |
| `digits` | `2` | Cifre decimali |
| `catHeader` | | Intestazione della prima colonna della tabella |
| `source` | | Testo a piè di grafico |
| `legend` | `true` | `false` nasconde la legenda |
| `zero` | `false` | Linee: include lo 0 sull'asse dei valori |
| `stacked` | `false` | Aree: impila le serie |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Torta e anello, vedi sopra |
| `bins`, `binWidth` | automatico | Istogramma |
| `min`, `max`, `bands` | `0`, `100` | Indicatore |
| `labels` | inglese | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, le tue diciture |
| `lang` | lingua della pagina | Formato dei numeri, tramite `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` o `genre` |
| `theme` | automatico | `light` o `dark` per forzarne uno |
| `motion` | automatico | `off` disattiva l'animazione |
| `items` | | Solo riquadri: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` è `good`, `bad` o `neutral` |

## API

- `PsoCharts.create(element, spec, options)` disegna un grafico in `element` e lo restituisce. `options` accetta `style`, `theme`, `motion` e `lang` come valori predefiniti per la specifica.
- `chart.set(spec)` sostituisce i dati, `chart.show('chart' | 'table')` cambia la vista, `chart.destroy()` lo rimuove.
- `PsoCharts.auto(root)` disegna ogni `<div data-pso-chart>` della pagina. L'attributo contiene le opzioni come JSON, `data-chart-source="#id"` indica la fonte dei dati.
- `PsoCharts.read(element)`, `fromLd(json, id)` e `fromTable(table)` trasformano una fonte di dati in una specifica.

## Fonti di dati

I dati possono arrivare da tre posti. Opzioni come `type` e `baseline` vanno sempre nell'attributo `data-pso-chart`.

**JSON-LD (Dataset schema.org).** I numeri stanno nella pagina come dati strutturati che anche le macchine possono leggere. Ogni serie è un `PropertyValue` in `variableMeasured`; il suo `valueReference` elenca un `PropertyValue` per categoria con `name` e `value`:

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

Con più dataset in un unico `@graph`, `dataset` indica l'`@id` da usare. Creatore, tecnica e `isBasedOn` (con `version`) formano il piè di pagina. Una `description` su un valore di categoria diventa la sua nota. Abbiamo scelto `PropertyValue` perché è un tipo stabile di schema.org; `Observation` vi è ancora segnato come in sospeso.

**Tabella HTML.** Una tabella esistente resta nella pagina, con o senza script. Il grafico viene aggiunto accanto. Le intestazioni di colonna sono le serie, quelle di riga le categorie, un attributo `data-value` su una cella contiene il numero esatto:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON semplice.** Un `<script type="application/json">` con la specifica (`categories`, `series`, ...) oppure la specifica direttamente in `PsoCharts.create`.

## Stili e colori

I colori sono proprietà personalizzate CSS su `.pc`, per chiaro e scuro (impostazione di sistema, `:root[data-theme]` o `data-pc-theme`):

| Proprietà | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Sfondo, testo, testo secondario |
| `--pc-grid`, `--pc-sep` | Linee della griglia, separatori |
| da `--pc-0` a `--pc-5` | Colori delle serie e delle fette; `--pc-5` è anche il colore di "Altro" |
| `--pc-good`, `--pc-bad` | Bordo del riquadro per meglio e peggio |
| `--pc-cur` | Contorno del segno selezionato |
| `--pc-font`, `--pc-r` | Carattere e raggio degli angoli |

`data-pc-style` (o l'opzione `style`) sceglie uno di quattro set: `house` (verde), `gauge` (ambra su carta o nero, spaziatura fissa), `plain` (bianco e nero con un solo accento) e `genre` (caldo). Imposta le proprietà su `.pc` o su un singolo grafico per usare le tue.

## Accessibilità

- L'immagine è un `img` con etichetta; sotto c'è un'area per la tastiera: Tab raggiunge il grafico, i tasti freccia passano da un segno (fette, punti, celle, quadranti, classi) all'altro, Home e Fine saltano, Esc annulla. Il segno selezionato ha un contorno ed è letto in una regione `aria-live`.
- Ogni grafico ha una vista a tabella con intestazioni corrette. Le serie e le fette si distinguono per motivo (barre, aree, torte) e forma (linee, punti), non solo per colore; le celle della mappa di calore portano il loro numero, le zone dell'indicatore il loro nome; meglio e peggio sui riquadri si distinguono per segno e parola.
- Tutto il testo è di almeno 13 px e ha un contrasto di almeno 4,5:1; i segni hanno almeno 3:1. La suite di test controlla tutti e quattro gli stili in chiaro e scuro.
- Con il movimento ridotto (impostazione di sistema o `motion: 'off'`) barre e linee vengono disegnate subito e i numeri non contano fino al valore.

## Prestazioni

Il nucleo pesa circa 37 KB di script e 12 KB di CSS, 14,7 KB compressi con gzip insieme; i tipi extra aggiungono 5,6 KB compressi. Senza dipendenze. I grafici si ridisegnano solo quando cambia la larghezza; l'animazione usa CSS e parte quando il grafico entra nell'area visibile.

## Test

`python3 tools/build.py` costruisce i cinque file da `src/`. `python3 tests/browser.py` apre `demo.html` in Chromium headless (richiede il pacchetto Python `websockets`), controlla contrasto, dimensione del carattere, tastiera, vista a tabella e movimento ridotto per ogni tipo, tutte e tre le fonti di dati e il testo che esce dal grafico, e `--photos <cartella>` salva schermate in chiaro, scuro e con movimento ridotto.

## Traduzioni

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licenza

Il codice è sotto licenza MIT (vedi [LICENSE](../../LICENSE)). I valori della demo sono inventati (vedi [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Realizzato per [psorvia.io](https://psorvia.io).
