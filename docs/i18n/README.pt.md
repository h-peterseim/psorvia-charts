# PSOrvia Charts

[![PSOrvia Charts](../preview.webp)](https://h-peterseim.github.io/psorvia-charts/demo.html)

**Gráficos animados e acessíveis para o seu site**

### ▶ [Demonstração ao vivo](https://h-peterseim.github.io/psorvia-charts/demo.html)

Barras em torno de uma linha de base, barras agrupadas, linhas, blocos de números-chave e uma vista de tabela. JavaScript e CSS puros, sem dependências: os valores ficam ao lado das marcas, todo gráfico funciona com o teclado e, com movimento reduzido, nada se move.

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
auto();
</script>
```

## Tipos de gráfico

| `type` | Mostra |
|---|---|
| `bars` | Uma barra por valor, crescendo a partir de uma linha de base (`baseline: 1` separa mais rápido de mais lento). Várias séries dão barras agrupadas. |
| `lines` | Uma linha por série ao longo das categorias, com rótulo no fim da linha. |
| `tiles` | Blocos de números-chave com um número que conta para cima, uma marca (▲ ▼ =) e um texto curto. |
| `table` | Uma tabela simples. |

`bars` e `lines` têm um seletor entre gráfico e tabela, uma legenda que oculta séries e uma leitura abaixo do gráfico.

## Opções

| Opção | Padrão | |
|---|---|---|
| `type` | | `bars`, `lines`, `tiles` ou `table` |
| `title` | | Título do gráfico, também o nome acessível |
| `desc` | | Descrição curta sob o título |
| `categories` | | `[{ label, note }]`, `note` é mostrada na leitura e na tabela |
| `series` | | `[{ name, values }]`, `null` para um valor ausente |
| `baseline` | nenhuma (bars: 0) | Valor de referência, desenhado como uma linha |
| `baselineLabel` | | Texto na linha de base, por exemplo `Reference 1.0` |
| `sides` | | `[below, above]`, nomes dos dois lados da linha de base, também falados na leitura |
| `unit` | | Acrescentada a cada número, por exemplo `' ms'` |
| `digits` | `2` | Casas decimais |
| `catHeader` | | Cabeçalho da primeira coluna da tabela |
| `source` | | Texto de rodapé sob o gráfico |
| `legend` | `true` | `false` oculta a legenda |
| `zero` | `false` | Linhas: inclui 0 no eixo de valores |
| `labels` | inglês | `{ chart, table, view, na, hint, keys }`, suas próprias palavras |
| `lang` | idioma da página | Formato numérico, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ou `genre` |
| `theme` | automático | `light` ou `dark` para forçar um |
| `motion` | automático | `off` desliga a animação |
| `items` | | Somente blocos: `[{ label, value, unit, digits, mark, sub, tone }]`, `tone` é `good`, `bad` ou `neutral` |

## API

- `PsoCharts.create(element, spec, options)` desenha um gráfico em `element` e o devolve. `options` aceita `style`, `theme`, `motion` e `lang` como padrões para o spec.
- `chart.set(spec)` substitui os dados, `chart.show('chart' | 'table')` troca a vista, `chart.destroy()` remove o gráfico.
- `PsoCharts.auto(root)` desenha todo `<div data-pso-chart>` da página. O atributo contém as opções em JSON, `data-chart-source="#id"` indica a fonte de dados.
- `PsoCharts.read(element)`, `fromLd(json, id)` e `fromTable(table)` transformam uma fonte de dados em um spec.

## Fontes de dados

Os dados podem vir de três lugares. Opções como `type` e `baseline` sempre vão no atributo `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Os números ficam na página como dados estruturados que as máquinas também podem ler. Cada série é um `PropertyValue` em `variableMeasured`; seu `valueReference` lista um `PropertyValue` por categoria com `name` e `value`:

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

Com vários datasets em um `@graph`, `dataset` indica o `@id` a usar. Criador, técnica e `isBasedOn` (com `version`) formam o rodapé. Uma `description` em um valor de categoria vira a sua nota. Escolhemos `PropertyValue` porque é um tipo estável do schema.org; `Observation` ainda está marcado como pendente lá.

**Tabela HTML.** Uma tabela existente permanece na página, com ou sem script. O gráfico é adicionado ao lado dela. Os cabeçalhos de coluna são as séries, os cabeçalhos de linha as categorias, um atributo `data-value` em uma célula guarda o número exato:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**JSON simples.** Um `<script type="application/json">` com o spec (`categories`, `series`, ...) ou o spec diretamente em `PsoCharts.create`.

## Estilos e cores

As cores são propriedades personalizadas de CSS em `.pc`, para claro e escuro (configuração do sistema, `:root[data-theme]` ou `data-pc-theme`):

| Propriedade | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Fundo, texto, texto secundário |
| `--pc-grid`, `--pc-sep` | Linhas de grade, separadores |
| `--pc-0` a `--pc-3` | Cores das séries |
| `--pc-good`, `--pc-bad` | Borda do bloco para melhor e pior |
| `--pc-cur` | Contorno da marca selecionada |
| `--pc-font`, `--pc-r` | Fonte e raio dos cantos |

`data-pc-style` (ou a opção `style`) escolhe um de quatro conjuntos: `house` (verde), `gauge` (âmbar sobre papel ou preto, monoespaçado), `plain` (preto e branco com um destaque) e `genre` (quente). Defina as propriedades em `.pc` ou em um único gráfico para usar as suas.

## Acessibilidade

- A imagem é um `img` com rótulo; abaixo dela fica uma área de teclado: Tab chega ao gráfico, as setas movem entre as marcas, Home e End saltam, Escape limpa. A marca selecionada recebe contorno e é lida em uma região `aria-live`.
- Todo gráfico tem uma vista de tabela com cabeçalhos corretos. As séries se distinguem por padrão (barras) e forma (linhas), não só por cor; melhor e pior nos blocos, por marca e palavra.
- Todo o texto tem pelo menos 13 px e contraste de pelo menos 4,5:1; as marcas têm pelo menos 3:1. A suíte de testes verifica os quatro estilos em claro e escuro.
- Com movimento reduzido (configuração do sistema ou `motion: 'off'`), barras e linhas são desenhadas de uma vez e os números não contam para cima.

## Desempenho

Cerca de 23 KB de script e 8 KB de CSS, cerca de 10 KB com gzip no total, sem dependências. Os gráficos só são redesenhados quando a largura muda; a animação usa CSS e começa quando o gráfico entra na área visível.

## Testes

`python3 tools/build.py` gera os três arquivos a partir de `src/`. `python3 tests/browser.py` abre `demo.html` no Chromium headless (requer o pacote Python `websockets`), verifica contraste, tamanho de fonte, teclado, vista de tabela e movimento reduzido, e `--photos <folder>` salva capturas de tela em claro, escuro e movimento reduzido.

## Traduções

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licença

O código está sob a licença MIT (veja [LICENSE](../../LICENSE)). Os valores da demonstração são inventados (veja [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Feito para [psorvia.io](https://psorvia.io).
