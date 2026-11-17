# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Κινούμενα, προσβάσιμα διαγράμματα για τον ιστότοπό σας**

### ▶ [Ζωντανή επίδειξη](https://h-peterseim.github.io/psorvia-charts/demo.html)

Ράβδοι γύρω από μια γραμμή αναφοράς, ομαδοποιημένες ράβδοι, γραμμές, πλακίδια βασικών αριθμών και προβολή πίνακα. Απλή JavaScript και CSS χωρίς εξαρτήσεις: οι τιμές βρίσκονται δίπλα στα σημάδια, κάθε διάγραμμα λειτουργεί με το πληκτρολόγιο και με μειωμένη κίνηση τίποτα δεν κινείται.

## Χρήση

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

## Τύποι διαγραμμάτων

| `type` | Εμφανίζει |
|---|---|
| `bars` | Μία ράβδο ανά τιμή, που αναπτύσσεται από μια γραμμή αναφοράς (το `baseline: 1` ξεχωρίζει το ταχύτερο από το πιο αργό). Περισσότερες σειρές δίνουν ομαδοποιημένες ράβδους. |
| `lines` | Μία γραμμή ανά σειρά κατά μήκος των κατηγοριών, με ετικέτα στο τέλος της γραμμής. |
| `tiles` | Πλακίδια βασικών αριθμών με έναν αριθμό που μετράει προς τα πάνω, ένα σημάδι (▲ ▼ =) και ένα σύντομο κείμενο. |
| `table` | Έναν απλό πίνακα. |

Τα `bars` και `lines` έχουν διακόπτη μεταξύ διαγράμματος και πίνακα, υπόμνημα που κρύβει σειρές και ένδειξη κάτω από το διάγραμμα.

## Επιλογές

| Επιλογή | Προεπιλογή | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` ή `table` |
| `title` | | Τίτλος του διαγράμματος, και προσβάσιμο όνομα |
| `desc` | | Σύντομη περιγραφή κάτω από τον τίτλο |
| `categories` | | `[{ label, note }]`, το `note` εμφανίζεται στην ένδειξη και στον πίνακα |
| `series` | | `[{ name, values }]`, `null` για τιμή που λείπει |
| `baseline` | καμία (bars: 0) | Τιμή αναφοράς, σχεδιασμένη ως γραμμή |
| `baselineLabel` | | Κείμενο στη γραμμή αναφοράς, για παράδειγμα `Reference 1.0` |
| `sides` | | `[below, above]`, ονόματα των δύο πλευρών της γραμμής αναφοράς, εκφωνούνται και στην ένδειξη |
| `unit` | | Προστίθεται σε κάθε αριθμό, για παράδειγμα `' ms'` |
| `digits` | `2` | Δεκαδικά ψηφία |
| `catHeader` | | Κεφαλίδα της πρώτης στήλης του πίνακα |
| `source` | | Κείμενο υποσέλιδου κάτω από το διάγραμμα |
| `legend` | `true` | Το `false` κρύβει το υπόμνημα |
| `zero` | `false` | Γραμμές: συμπερίληψη του 0 στον άξονα τιμών |
| `labels` | αγγλικά | `{ chart, table, view, na, hint, keys }`, δικές σας διατυπώσεις |
| `lang` | γλώσσα της σελίδας | Μορφή αριθμών, μέσω `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ή `genre` |
| `theme` | αυτόματο | `light` ή `dark` για επιβολή ενός |
| `motion` | αυτόματο | Το `off` απενεργοποιεί την κινούμενη εικόνα |
| `items` | | Μόνο πλακίδια: `[{ label, value, unit, digits, mark, sub, tone }]`, το `tone` είναι `good`, `bad` ή `neutral` |

## API

- Το `PsoCharts.create(element, spec, options)` σχεδιάζει ένα διάγραμμα μέσα στο `element` και το επιστρέφει. Το `options` δέχεται τα `style`, `theme`, `motion` και `lang` ως προεπιλογές για την προδιαγραφή.
- Το `chart.set(spec)` αντικαθιστά τα δεδομένα, το `chart.show('chart' | 'table')` αλλάζει την προβολή, το `chart.destroy()` το αφαιρεί.
- Το `PsoCharts.auto(root)` σχεδιάζει κάθε `<div data-pso-chart>` της σελίδας. Το χαρακτηριστικό περιέχει τις επιλογές ως JSON, το `data-chart-source="#id"` ονομάζει την πηγή δεδομένων.
- Τα `PsoCharts.read(element)`, `fromLd(json, id)` και `fromTable(table)` μετατρέπουν μια πηγή δεδομένων σε προδιαγραφή.

## Πηγές δεδομένων

Τα δεδομένα μπορούν να προέρχονται από τρία σημεία. Επιλογές όπως τα `type` και `baseline` μπαίνουν πάντα στο χαρακτηριστικό `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Οι αριθμοί βρίσκονται στη σελίδα ως δομημένα δεδομένα που μπορούν να διαβάσουν και μηχανές. Κάθε σειρά είναι ένα `PropertyValue` στο `variableMeasured`· το `valueReference` της απαριθμεί ένα `PropertyValue` ανά κατηγορία με `name` και `value`:

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

Με πολλά σύνολα δεδομένων σε ένα `@graph`, το `dataset` ονομάζει το `@id` που θα χρησιμοποιηθεί. Ο δημιουργός, η τεχνική και το `isBasedOn` (με `version`) γίνονται το υποσέλιδο. Ένα `description` σε μια τιμή κατηγορίας γίνεται η σημείωσή της. Επιλέξαμε το `PropertyValue` επειδή είναι σταθερός τύπος του schema.org· το `Observation` εκεί εξακολουθεί να φέρει την ένδειξη «σε εκκρεμότητα».

**Πίνακας HTML.** Ένας υπάρχων πίνακας παραμένει στη σελίδα, με ή χωρίς σενάριο. Το διάγραμμα προστίθεται δίπλα του. Οι κεφαλίδες στηλών είναι οι σειρές, οι κεφαλίδες γραμμών οι κατηγορίες, ένα χαρακτηριστικό `data-value` σε ένα κελί κρατά τον ακριβή αριθμό:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Απλό JSON.** Ένα `<script type="application/json">` με την προδιαγραφή (`categories`, `series`, ...) ή η προδιαγραφή απευθείας στο `PsoCharts.create`.

## Στιλ και χρώματα

Τα χρώματα είναι ιδιότητες CSS (custom properties) στο `.pc`, για ανοιχτό και σκούρο θέμα (ρύθμιση συστήματος, `:root[data-theme]` ή `data-pc-theme`):

| Ιδιότητα | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Φόντο, κείμενο, δευτερεύον κείμενο |
| `--pc-grid`, `--pc-sep` | Γραμμές πλέγματος, διαχωριστικά |
| `--pc-0` έως `--pc-3` | Χρώματα σειρών |
| `--pc-good`, `--pc-bad` | Άκρη πλακιδίου για καλύτερο και χειρότερο |
| `--pc-cur` | Περίγραμμα του επιλεγμένου σημαδιού |
| `--pc-font`, `--pc-r` | Γραμματοσειρά και ακτίνα γωνιών |

Το `data-pc-style` (ή η επιλογή `style`) διαλέγει ένα από τέσσερα σύνολα: `house` (πράσινο), `gauge` (κεχριμπαρί σε χαρτί ή μαύρο, σταθερού πλάτους), `plain` (ασπρόμαυρο με μία έμφαση) και `genre` (ζεστό). Ορίστε τις ιδιότητες στο `.pc` ή σε ένα μεμονωμένο διάγραμμα για να χρησιμοποιήσετε τις δικές σας.

## Προσβασιμότητα

- Η εικόνα είναι ένα `img` με ετικέτα· από κάτω βρίσκεται μια περιοχή πληκτρολογίου: το Tab φτάνει στο διάγραμμα, τα βελάκια μετακινούν μεταξύ των σημαδιών, τα Home και End πηγαίνουν στην αρχή και στο τέλος, το Escape καθαρίζει την επιλογή. Το επιλεγμένο σημάδι περιγράφεται με περίγραμμα και εκφωνείται σε μια περιοχή `aria-live`.
- Κάθε διάγραμμα έχει προβολή πίνακα με σωστές κεφαλίδες. Οι σειρές διαφέρουν με μοτίβο (ράβδοι) και σχήμα (γραμμές), όχι μόνο με χρώμα· το καλύτερο και το χειρότερο στα πλακίδια με σημάδι και λέξη.
- Όλο το κείμενο είναι τουλάχιστον 13 px και έχει αντίθεση τουλάχιστον 4,5:1· τα σημάδια έχουν τουλάχιστον 3:1. Η σουίτα δοκιμών ελέγχει και τα τέσσερα στιλ σε ανοιχτό και σκούρο θέμα.
- Με μειωμένη κίνηση (ρύθμιση συστήματος ή `motion: 'off'`) οι ράβδοι και οι γραμμές σχεδιάζονται αμέσως και οι αριθμοί δεν μετράνε προς τα πάνω.

## Επιδόσεις

Περίπου 23 KB σεναρίου και 8 KB CSS, περίπου 10 KB μαζί συμπιεσμένα με gzip, χωρίς εξαρτήσεις. Τα διαγράμματα ξανασχεδιάζονται μόνο όταν αλλάζει το πλάτος· η κινούμενη εικόνα χρησιμοποιεί CSS και ξεκινά όταν το διάγραμμα εμφανιστεί στην οθόνη με κύλιση.

## Δοκιμές

Το `python3 tools/build.py` δημιουργεί τα τρία αρχεία από το `src/`. Το `python3 tests/browser.py` ανοίγει το `demo.html` σε Chromium χωρίς γραφικό περιβάλλον (απαιτεί το πακέτο Python `websockets`), ελέγχει αντίθεση, μέγεθος γραμματοσειράς, πληκτρολόγιο, προβολή πίνακα και μειωμένη κίνηση, και το `--photos <folder>` αποθηκεύει στιγμιότυπα σε ανοιχτό, σκούρο και με μειωμένη κίνηση.

## Μεταφράσεις

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Άδεια

Ο κώδικας διατίθεται με άδεια MIT (δείτε το [LICENSE](../../LICENSE)). Οι τιμές της επίδειξης είναι επινοημένες (δείτε το [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Φτιαγμένο για το [psorvia.io](https://psorvia.io).
