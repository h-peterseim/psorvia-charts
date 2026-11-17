# Changelog

## Unreleased
- Bar charts choose the number of axis marks by label width, so labels such as "40 %" no longer overlap on narrow screens.

## 1.1.0
- New types: `pie` and `donut` (value and share on leader lines, small slices merged into "Other" from 7 slices on, total or average in the ring), `stacked` and `percent` bars, `area` and stacked area, `spark` (also inside tiles), and in the optional file `psorvia-charts.extra.js`: `scatter` (points and bubbles), `hist`, `gauge`, `heat` and `radar` (3 to 8 axes).
- Two more series colours (`--pc-4`, `--pc-5`) and a fifth pattern in all four styles, light and dark.
- Every new type works with JSON-LD, an HTML table and plain JSON, has a table view, keyboard use with `aria-live` readout and reduced motion.
- READMEs link psorvia.io and carry no preview image; area charts leave room for wide axis labels.

## 1.0.0
- First release: charts as ES module and classic script with a stylesheet.
- Types: bars around a baseline, grouped bars, lines, key-figure tiles and a table.
- Four styles as CSS custom properties, light and dark; animation that follows reduced motion.
- Keyboard use, `aria-live` readout, table view and number format per language.
- Data from a schema.org Dataset in JSON-LD, from an HTML table or from plain JSON.
- Value and side labels that would leave the chart are moved inside.
