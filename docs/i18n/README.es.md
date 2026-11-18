# PSOrvia Charts

**Gráficos animados y accesibles para tu sitio web**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demo en vivo](https://h-peterseim.github.io/psorvia-charts/)

Barras, líneas, sectores y anillo, barras apiladas y al 100 %, áreas, dispersión y burbujas, histograma, sparkline, dial, mapa de calor, radar, tarjetas de cifras clave y una vista de tabla. JavaScript y CSS sin más y sin dependencias: los valores están junto a las marcas, todos los gráficos funcionan con el teclado y, con movimiento reducido, nada se mueve.

## Uso

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
import './psorvia-charts.extra.esm.js'; // solo para scatter, hist, gauge, heat, radar
auto();
</script>
```

El núcleo cubre bars, lines, area, pie, ring, barras apiladas y al 100 %, tiles, sparkline y table. Dispersión, histograma, dial, mapa de calor y radar están en un segundo archivo, `psorvia-charts.extra.js` (script clásico, cárgalo después del script principal) o `psorvia-charts.extra.esm.js` (módulo). Sin él, esos tipos informan de un error claro y nada más cambia.

## Tipos de gráfico

| `type` | Muestra |
|---|---|
| `bars` | Una barra por valor, que crece desde una línea base (`baseline: 1` separa lo más rápido de lo más lento). Varias series dan barras agrupadas. |
| `lines` | Una línea por serie a lo largo de las categorías, con etiqueta al final de la línea. |
| `area` | Líneas rellenas desde cero; `stacked: true` apila las series (los valores negativos cuentan como 0). |
| `stacked` | Una barra por categoría, con las series apiladas una tras otra; valor en cada segmento, total al final. |
| `percent` | Lo mismo que las barras al 100 %; cada segmento muestra su parte de la categoría. |
| `pie`, `donut` | Una serie, un sector por categoría, etiqueta con valor y porcentaje sobre una línea guía (en pantallas estrechas en una lista debajo). A partir de 7 sectores, los más pequeños se unen en «Otros» (`maxSlices`, por defecto 6; `other: false` los conserva todos). El anillo muestra el total en el centro (`center: 'mean'` para la media, `false` para nada). |
| `tiles` | Tarjetas de cifras clave con un número que cuenta hacia arriba, una marca (▲ ▼ =) y un texto breve. Un elemento puede llevar `spark: [values]` para una línea pequeña. |
| `table` | Una tabla sencilla. |
| `spark` | Una línea pequeña para texto corrido y tarjetas: `values`, `width` y `height` opcionales; muestra el último valor, las flechas recorren los puntos. |
| `scatter` | *(extra)* Puntos o burbujas. Las categorías son los puntos, la primera serie es x, la segunda y, una tercera opcional el tamaño de la burbuja. |
| `hist` | *(extra)* Histograma de los valores en bruto de la primera serie; `bins` o `binWidth`, si no, automático. La vista de tabla muestra las clases. |
| `gauge` | *(extra)* Un dial por categoría a partir de la primera serie, `min` y `max`, `bands: [{ to, label }]` opcional dibujado como zonas con patrón; el nombre de la zona se escribe bajo el número. |
| `heat` | *(extra)* Cuadrícula de categorías (filas) y series (columnas), color de celda según el valor, el número en cada celda. El color del texto se elige para que mantenga 4,5:1 frente a la celda. |
| `radar` | *(extra)* De 3 a 8 ejes (categorías) y como máximo 3 series, valores en los puntos. Más ejes o series se rechazan con un error: más allá, un gráfico de radar no se lee, usa barras. |

`values` en lugar de `series` y `categories` es un atajo para una sola serie (`hist`, `spark`); `value` es un atajo para un solo `gauge`. Todos los tipos de gráfico salvo `tiles`, `table` y `spark` tienen un conmutador entre gráfico y tabla; los tipos con series tienen una leyenda que oculta series; todos tienen una lectura bajo el gráfico.

## Opciones

| Opción | Valor por defecto | |
|---|---|---|
| `type` | | Uno de los tipos anteriores |
| `title` | | Título del gráfico, también el nombre accesible |
| `desc` | | Descripción breve bajo el título |
| `categories` | | `[{ label, note }]`, `note` se muestra en la lectura y en la tabla |
| `series` | | `[{ name, values }]`, `null` para un valor que falta |
| `baseline` | ninguna (bars: 0) | Valor de referencia, dibujado como una línea |
| `baselineLabel` | | Texto en la línea base, por ejemplo `Reference 1.0` |
| `sides` | | `[below, above]`, nombres de los dos lados de la línea base, también leídos en voz alta en la lectura |
| `unit` | | Se añade a cada número, por ejemplo `' ms'` |
| `digits` | `2` | Decimales |
| `catHeader` | | Encabezado de la primera columna de la tabla |
| `source` | | Texto de pie bajo el gráfico |
| `legend` | `true` | `false` oculta la leyenda |
| `zero` | `false` | Líneas: incluir el 0 en el eje de valores |
| `stacked` | `false` | Área: apilar las series |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Sectores y anillo, véase arriba |
| `bins`, `binWidth` | automático | Histograma |
| `min`, `max`, `bands` | `0`, `100` | Dial |
| `labels` | inglés | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, tus propias formulaciones |
| `lang` | idioma de la página | Formato de números, mediante `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` o `genre` |
| `theme` | automático | `light` o `dark` para forzar uno |
| `motion` | automático | `off` desactiva la animación |
| `items` | | Solo tarjetas: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` es `good`, `bad` o `neutral` |

## API

- `PsoCharts.create(element, spec, options)` dibuja un gráfico en `element` y lo devuelve. `options` acepta `style`, `theme`, `motion` y `lang` como valores por defecto de la especificación.
- `chart.set(spec)` sustituye los datos, `chart.show('chart' | 'table')` cambia la vista, `chart.destroy()` lo elimina.
- `PsoCharts.auto(root)` dibuja cada `<div data-pso-chart>` de la página. El atributo contiene las opciones como JSON, `data-chart-source="#id"` nombra la fuente de datos.
- `PsoCharts.read(element)`, `fromLd(json, id)` y `fromTable(table)` convierten una fuente de datos en una especificación.

## Fuentes de datos

Los datos pueden venir de tres lugares. Las opciones como `type` y `baseline` van siempre en el atributo `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Los números están en la página como datos estructurados que también pueden leer las máquinas. Cada serie es un `PropertyValue` en `variableMeasured`; su `valueReference` enumera un `PropertyValue` por categoría con `name` y `value`:

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

Con varios conjuntos de datos en un `@graph`, `dataset` indica el `@id` que se debe usar. El creador, la técnica y `isBasedOn` (con `version`) pasan a ser el pie. Una `description` en el valor de una categoría pasa a ser su nota. Elegimos `PropertyValue` porque es un tipo estable de schema.org; `Observation` sigue marcado allí como pendiente.

**Tabla HTML.** Una tabla existente se queda en la página, con o sin script. El gráfico se añade a su lado. Los encabezados de columna son las series, los encabezados de fila las categorías, un atributo `data-value` en una celda contiene el número exacto:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON sin más.** Un `<script type="application/json">` con la especificación (`categories`, `series`, ...) o la especificación directamente en `PsoCharts.create`.

## Estilos y colores

Los colores son propiedades personalizadas de CSS en `.pc`, para claro y oscuro (ajuste del sistema, `:root[data-theme]` o `data-pc-theme`):

| Propiedad | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Fondo, texto, texto secundario |
| `--pc-grid`, `--pc-sep` | Líneas de cuadrícula, separadores |
| `--pc-0` a `--pc-5` | Colores de serie y de sector; `--pc-5` es también el color de «Otros» |
| `--pc-good`, `--pc-bad` | Borde de la tarjeta para mejor y peor |
| `--pc-cur` | Contorno de la marca seleccionada |
| `--pc-font`, `--pc-r` | Fuente y radio de las esquinas |

`data-pc-style` (o la opción `style`) elige uno de cuatro juegos: `house` (verde), `gauge` (ámbar sobre papel o negro, monoespaciado), `plain` (blanco y negro con un acento) y `genre` (cálido). Define las propiedades en `.pc` o en un solo gráfico para usar las tuyas.

## Accesibilidad

- La imagen es un `img` con etiqueta; debajo hay una zona de teclado: Tab llega al gráfico, las flechas se mueven entre marcas (sectores, puntos, celdas, diales, clases), Inicio y Fin saltan, Escape borra la selección. La marca seleccionada se perfila y se lee en una región `aria-live`.
- Cada gráfico tiene una vista de tabla con encabezados correctos. Las series y los sectores se distinguen por patrón (barras, áreas, sectores circulares) y forma (líneas, puntos), no solo por color; las celdas del mapa de calor llevan su número, las zonas del dial su nombre; mejor y peor en las tarjetas por marca y palabra.
- Todo el texto mide al menos 13 px y tiene al menos 4,5:1 de contraste; las marcas, al menos 3:1. La batería de pruebas comprueba los cuatro estilos en claro y oscuro.
- Con movimiento reducido (ajuste del sistema o `motion: 'off'`) las barras y las líneas se dibujan de golpe y los números no cuentan hacia arriba.

## Rendimiento

El núcleo ocupa unos 37 KB de script y 12 KB de CSS, 14,7 KB comprimidos con gzip en conjunto; los tipos extra añaden 5,6 KB con gzip. Sin dependencias. Los gráficos solo se redibujan al cambiar el ancho; la animación usa CSS y empieza cuando el gráfico entra en pantalla al desplazarse.

## Pruebas

`python3 tools/build.py` genera los cinco archivos a partir de `src/`. `python3 tests/browser.py` abre `demo.html` en Chromium sin interfaz (necesita el paquete de Python `websockets`), comprueba contraste, tamaño de fuente, teclado, vista de tabla y movimiento reducido de cada tipo, las tres fuentes de datos, el texto que se sale del gráfico, y `--photos <folder>` guarda capturas en claro, oscuro y con movimiento reducido.

## Traducciones

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Norsk bokmål](README.nb.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md) · [Türkçe](README.tr.md)

## Licencia

El código tiene licencia MIT (véase [LICENSE](../../LICENSE)). Los valores de la demo son inventados (véase [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Creado para [psorvia.io](https://psorvia.io).
