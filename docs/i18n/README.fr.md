# PSOrvia Charts

**Des graphiques animés et accessibles pour votre site web**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Démo en direct](https://h-peterseim.github.io/psorvia-charts/)

Barres, courbes, secteurs et anneaux, barres empilées et à 100 %, aires, nuages de points et bulles, histogramme, sparkline, jauge, carte de chaleur, radar, tuiles de chiffres clés et vue en tableau. JavaScript et CSS purs, sans dépendances : les valeurs se trouvent à côté des repères, chaque graphique fonctionne au clavier, et avec la réduction des animations plus rien ne bouge.

## Utilisation

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
import './psorvia-charts.extra.esm.js'; // uniquement pour scatter, hist, gauge, heat, radar
auto();
</script>
```

Le noyau couvre les barres, les courbes, les aires, les secteurs, les anneaux, les barres empilées et à 100 %, les tuiles, la sparkline et le tableau. Scatter, histogramme, jauge, carte de chaleur et radar se trouvent dans un second fichier, `psorvia-charts.extra.js` (script classique, à charger après le script principal) ou `psorvia-charts.extra.esm.js` (module). Sans lui, ces types signalent une erreur claire et rien d'autre ne change.

## Types de graphiques

| `type` | Affiche |
|---|---|
| `bars` | Une barre par valeur, qui part d'une ligne de référence (`baseline: 1` sépare le plus rapide du plus lent). Plusieurs séries donnent des barres groupées. |
| `lines` | Une courbe par série à travers les catégories, avec une étiquette à son extrémité. |
| `area` | Courbes remplies à partir de zéro ; `stacked: true` empile les séries (les valeurs négatives comptent pour 0). |
| `stacked` | Une barre par catégorie, les séries empilées bout à bout ; la valeur dans chaque segment, le total au bout. |
| `percent` | Comme les barres à 100 % ; chaque segment affiche sa part de la catégorie. |
| `pie`, `donut` | Une série, une part par catégorie, étiquette avec valeur et part sur une ligne de rappel (sur les écrans étroits dans une liste en dessous). À partir de 7 parts, les plus petites sont regroupées dans « Autres » (`maxSlices`, 6 par défaut ; `other: false` les garde toutes). L'anneau affiche le total au centre (`center: 'mean'` pour la moyenne, `false` pour rien). |
| `tiles` | Des tuiles de chiffres clés avec un nombre qui s'incrémente, un repère (▲ ▼ =) et un court texte. Un élément peut porter `spark: [values]` pour une petite courbe. |
| `table` | Un simple tableau. |
| `spark` | Une petite courbe pour le texte courant et les tuiles : `values`, `width` et `height` facultatifs ; affiche la dernière valeur, les flèches parcourent les points. |
| `scatter` | *(extra)* Points ou bulles. Les catégories sont les points, la première série est x, la deuxième y, une troisième facultative donne la taille de la bulle. |
| `hist` | *(extra)* Histogramme des valeurs brutes de la première série ; `bins` ou `binWidth`, sinon automatique. La vue en tableau affiche les classes. |
| `gauge` | *(extra)* Un cadran par catégorie à partir de la première série, `min` et `max`, `bands: [{ to, label }]` facultatif dessiné en zones à motifs ; le nom de la zone est écrit sous le nombre. |
| `heat` | *(extra)* Grille de catégories (lignes) et de séries (colonnes), couleur de la cellule selon la valeur, le nombre dans chaque cellule. La couleur du texte est choisie pour garder 4,5:1 contre la cellule. |
| `radar` | *(extra)* 3 à 8 axes (catégories) et 3 séries au plus, valeurs aux points. Davantage d'axes ou de séries sont refusés par une erreur : au-delà, un radar n'est plus lisible, utilisez des barres. |

`values` à la place de `series` et `categories` est un raccourci pour une seule série (`hist`, `spark`) ; `value` est un raccourci pour un seul `gauge`. Chaque type de graphique sauf `tiles`, `table` et `spark` dispose d'un commutateur entre graphique et tableau ; les types à séries ont une légende qui masque des séries ; tous ont un affichage de lecture sous le graphique.

## Options

| Option | Par défaut | |
|---|---|---|
| `type` | | L'un des types ci-dessus |
| `title` | | Titre du graphique, aussi son nom accessible |
| `desc` | | Courte description sous le titre |
| `categories` | | `[{ label, note }]`, `note` apparaît dans l'affichage de lecture et dans le tableau |
| `series` | | `[{ name, values }]`, `null` pour une valeur manquante |
| `baseline` | aucune (bars : 0) | Valeur de référence, tracée sous forme de ligne |
| `baselineLabel` | | Texte sur la ligne de référence, par exemple `Reference 1.0` |
| `sides` | | `[below, above]`, noms des deux côtés de la ligne de référence, aussi énoncés dans l'affichage de lecture |
| `unit` | | Ajoutée à chaque nombre, par exemple `' ms'` |
| `digits` | `2` | Décimales |
| `catHeader` | | En-tête de la première colonne du tableau |
| `source` | | Texte de pied sous le graphique |
| `legend` | `true` | `false` masque la légende |
| `zero` | `false` | Courbes : inclure 0 sur l'axe des valeurs |
| `stacked` | `false` | Aires : empiler les séries |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Secteurs et anneau, voir ci-dessus |
| `bins`, `binWidth` | automatique | Histogramme |
| `min`, `max`, `bands` | `0`, `100` | Jauge |
| `labels` | anglais | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, vos propres libellés |
| `lang` | langue de la page | Format des nombres, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ou `genre` |
| `theme` | automatique | `light` ou `dark` pour en imposer un |
| `motion` | automatique | `off` désactive l'animation |
| `items` | | Tuiles uniquement : `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` vaut `good`, `bad` ou `neutral` |

## API

- `PsoCharts.create(element, spec, options)` dessine un graphique dans `element` et le renvoie. `options` accepte `style`, `theme`, `motion` et `lang` comme valeurs par défaut de la spécification.
- `chart.set(spec)` remplace les données, `chart.show('chart' | 'table')` change la vue, `chart.destroy()` le supprime.
- `PsoCharts.auto(root)` dessine chaque `<div data-pso-chart>` de la page. L'attribut contient les options en JSON, `data-chart-source="#id"` désigne la source de données.
- `PsoCharts.read(element)`, `fromLd(json, id)` et `fromTable(table)` transforment une source de données en spécification.

## Sources de données

Les données peuvent venir de trois endroits. Les options comme `type` et `baseline` vont toujours dans l'attribut `data-pso-chart`.

**JSON-LD (Dataset schema.org).** Les chiffres se trouvent dans la page sous forme de données structurées que les machines peuvent aussi lire. Chaque série est un `PropertyValue` dans `variableMeasured` ; son `valueReference` liste un `PropertyValue` par catégorie avec `name` et `value` :

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

Avec plusieurs jeux de données dans un seul `@graph`, `dataset` désigne l'`@id` à utiliser. Le créateur, la technique et `isBasedOn` (avec `version`) forment le pied de page. Une `description` sur une valeur de catégorie devient sa note. Nous avons choisi `PropertyValue` parce que c'est un type schema.org stable ; `Observation` y est encore marqué comme en attente.

**Tableau HTML.** Un tableau existant reste dans la page, avec ou sans script. Le graphique est ajouté à côté. Les en-têtes de colonnes sont les séries, les en-têtes de lignes les catégories, un attribut `data-value` sur une cellule contient le nombre exact :

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON simple.** Un `<script type="application/json">` avec la spécification (`categories`, `series`, ...) ou la spécification directement dans `PsoCharts.create`.

## Styles et couleurs

Les couleurs sont des propriétés personnalisées CSS sur `.pc`, pour clair et sombre (réglage du système, `:root[data-theme]` ou `data-pc-theme`) :

| Propriété | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Arrière-plan, texte, texte secondaire |
| `--pc-grid`, `--pc-sep` | Lignes de grille, séparateurs |
| `--pc-0` à `--pc-5` | Couleurs des séries et des parts ; `--pc-5` est aussi la couleur de « Autres » |
| `--pc-good`, `--pc-bad` | Bordure des tuiles pour mieux et moins bien |
| `--pc-cur` | Contour du repère sélectionné |
| `--pc-font`, `--pc-r` | Police et rayon des coins |

`data-pc-style` (ou l'option `style`) choisit l'un des quatre jeux : `house` (vert), `gauge` (ambre sur papier ou noir, chasse fixe), `plain` (noir et blanc avec un accent) et `genre` (chaud). Définissez les propriétés sur `.pc` ou sur un seul graphique pour utiliser les vôtres.

## Accessibilité

- L'image est un `img` avec un libellé ; en dessous se trouve une zone clavier : Tab atteint le graphique, les flèches passent d'un repère (parts, points, cellules, cadrans, classes) à l'autre, Début et Fin sautent, Échap efface. Le repère sélectionné est entouré et lu dans une région `aria-live`.
- Chaque graphique a une vue en tableau avec de vrais en-têtes. Les séries et les parts se distinguent par le motif (barres, aires, secteurs) et la forme (courbes, points), pas seulement par la couleur ; les cellules de la carte de chaleur portent leur nombre, les zones de la jauge leur nom ; mieux et moins bien sur les tuiles par un repère et un mot.
- Tout le texte fait au moins 13 px et a un contraste d'au moins 4,5:1 ; les repères ont au moins 3:1. La suite de tests vérifie les quatre styles en clair et en sombre.
- Avec la réduction des animations (réglage du système ou `motion: 'off'`), les barres et les courbes sont tracées d'un coup et les nombres ne s'incrémentent pas.

## Performances

Le noyau pèse environ 37 KB de script et 12 KB de CSS, 14,7 KB compressés avec gzip ensemble ; les types extra ajoutent 5,6 KB compressés. Sans dépendances. Les graphiques ne se redessinent que lorsque la largeur change ; l'animation utilise CSS et démarre quand le graphique entre dans la zone visible.

## Tests

`python3 tools/build.py` construit les cinq fichiers à partir de `src/`. `python3 tests/browser.py` ouvre `demo.html` dans Chromium sans interface (nécessite le paquet Python `websockets`), vérifie le contraste, la taille de police, le clavier, la vue en tableau et la réduction des animations pour chaque type, les trois sources de données et le texte qui dépasse du graphique, et `--photos <dossier>` enregistre des captures en clair, en sombre et avec animations réduites.

## Traductions

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licence

Le code est sous licence MIT (voir [LICENSE](../../LICENSE)). Les valeurs de la démo sont inventées (voir [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Conçu pour [psorvia.io](https://psorvia.io).
