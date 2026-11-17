# PSOrvia Charts

[![PSOrvia Charts](docs/preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Animated, accessible charts for your website**

### ▶ [Live demo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Bars around a baseline, grouped bars, lines, key-figure tiles and a table view. Plain JavaScript and CSS without dependencies: the values sit next to the marks, every chart works with the keyboard, and with reduced motion nothing moves.

## Usage

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

## Chart types

| `type` | Shows |
|---|---|
| `bars` | One bar per value, growing from a baseline (`baseline: 1` splits faster from slower). Several series give grouped bars. |
| `lines` | One line per series across the categories, labelled at the end of the line. |
| `tiles` | Key-figure tiles with a number that counts up, a mark (▲ ▼ =) and a short text. |
| `table` | A plain table. |

`bars` and `lines` have a switch between chart and table, a legend that hides series, and a readout below the chart.

## Options

| Option | Default | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` or `table` |
| `title` | | Chart title, also the accessible name |
| `desc` | | Short description under the title |
| `categories` | | `[{ label, note }]`, `note` is shown in the readout and in the table |
| `series` | | `[{ name, values }]`, `null` for a missing value |
| `baseline` | none (bars: 0) | Reference value, drawn as a line |
| `baselineLabel` | | Text at the baseline, for example `Reference 1.0` |
| `sides` | | `[below, above]`, names of the two sides of the baseline, also spoken in the readout |
| `unit` | | Appended to every number, for example `' ms'` |
| `digits` | `2` | Decimal places |
| `catHeader` | | Header of the first table column |
| `source` | | Footer text under the chart |
| `legend` | `true` | `false` hides the legend |
| `zero` | `false` | Lines: include 0 on the value axis |
| `labels` | English | `{ chart, table, view, na, hint, keys }`, your own wording |
| `lang` | page language | Number format, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` or `genre` |
| `theme` | automatic | `light` or `dark` to force one |
| `motion` | automatic | `off` switches the animation off |
| `items` | | Tiles only: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` is `good`, `bad` or `neutral` |

## API

- `PsoCharts.create(element, spec, options)` draws a chart into `element` and returns it. `options` takes `style`, `theme`, `motion` and `lang` as defaults for the spec.
- `chart.set(spec)` replaces the data, `chart.show('chart' | 'table')` switches the view, `chart.destroy()` removes it.
- `PsoCharts.auto(root)` draws every `<div data-pso-chart>` on the page. The attribute holds the options as JSON, `data-chart-source="#id"` names the data source.
- `PsoCharts.read(element)`, `fromLd(json, id)` and `fromTable(table)` turn a data source into a spec.

## Data sources

The data can come from three places. Options such as `type` and `baseline` always go into the `data-pso-chart` attribute.

**JSON-LD (schema.org Dataset).** The numbers sit in the page as structured data that machines can read too. Each series is a `PropertyValue` in `variableMeasured`; its `valueReference` lists one `PropertyValue` per category with `name` and `value`:

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

With several datasets in one `@graph`, `dataset` names the `@id` to use. Creator, technique and `isBasedOn` (with `version`) become the footer. A `description` on a category value becomes its note. We chose `PropertyValue` because it is a stable schema.org type; `Observation` is still marked pending there.

**HTML table.** An existing table stays in the page, with or without script. The chart is added next to it. Column headers are the series, row headers the categories, a `data-value` attribute on a cell holds the exact number:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Plain JSON.** A `<script type="application/json">` with the spec (`categories`, `series`, ...) or the spec directly in `PsoCharts.create`.

## Styles and colors

The colors are CSS custom properties on `.pc`, for light and dark (system setting, `:root[data-theme]` or `data-pc-theme`):

| Property | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Background, text, secondary text |
| `--pc-grid`, `--pc-sep` | Grid lines, separators |
| `--pc-0` to `--pc-3` | Series colors |
| `--pc-good`, `--pc-bad` | Tile edge for better and worse |
| `--pc-cur` | Outline of the selected mark |
| `--pc-font`, `--pc-r` | Font and corner radius |

`data-pc-style` (or the `style` option) picks one of four sets: `house` (green), `gauge` (amber on paper or black, monospace), `plain` (black and white with one accent) and `genre` (warm). Set the properties on `.pc` or on a single chart to use your own.

## Accessibility

- The picture is an `img` with a label; below it sits a keyboard area: Tab reaches the chart, the arrow keys move between marks, Home and End jump, Escape clears. The selected mark is outlined and read out in an `aria-live` region.
- Every chart has a table view with proper headers. Series differ by pattern (bars) and shape (lines), not only by color; better and worse on tiles by mark and word.
- All text is at least 13 px and has at least 4.5:1 contrast; marks have at least 3:1. The test suite checks all four styles in light and dark.
- With reduced motion (system setting or `motion: 'off'`) bars and lines are drawn at once and the numbers do not count up.

## Performance

About 23 KB of script and 8 KB of CSS, about 10 KB gzipped together, without dependencies. Charts redraw on width change only; the animation uses CSS and starts when the chart scrolls into view.

## Tests

`python3 tools/build.py` builds the three files from `src/`. `python3 tests/browser.py` opens `demo.html` in headless Chromium (needs the Python package `websockets`), checks contrast, font size, keyboard, table view and reduced motion, and `--photos <folder>` saves screenshots in light, dark and reduced motion.

## Translations

[English](README.md) · [Deutsch](docs/i18n/README.de.md) · [Български](docs/i18n/README.bg.md) · [Čeština](docs/i18n/README.cs.md) · [Dansk](docs/i18n/README.da.md) · [Ελληνικά](docs/i18n/README.el.md) · [Español](docs/i18n/README.es.md) · [Eesti](docs/i18n/README.et.md) · [Suomi](docs/i18n/README.fi.md) · [Français](docs/i18n/README.fr.md) · [Gaeilge](docs/i18n/README.ga.md) · [Hrvatski](docs/i18n/README.hr.md) · [Magyar](docs/i18n/README.hu.md) · [Italiano](docs/i18n/README.it.md) · [Lietuvių](docs/i18n/README.lt.md) · [Latviešu](docs/i18n/README.lv.md) · [Malti](docs/i18n/README.mt.md) · [Nederlands](docs/i18n/README.nl.md) · [Polski](docs/i18n/README.pl.md) · [Português](docs/i18n/README.pt.md) · [Română](docs/i18n/README.ro.md) · [Slovenčina](docs/i18n/README.sk.md) · [Slovenščina](docs/i18n/README.sl.md) · [Svenska](docs/i18n/README.sv.md)

## License

The code is MIT licensed (see [LICENSE](LICENSE)). The demo values are made up (see [media/LICENSE.md](media/LICENSE.md)).

SPDX-License-Identifier: MIT

Built for [psorvia.io](https://psorvia.io).
