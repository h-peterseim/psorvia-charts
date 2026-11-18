# PSOrvia Charts

**Gráficos animados e acessíveis para o seu site**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demonstração ao vivo](https://h-peterseim.github.io/psorvia-charts/)

Barras, linhas, pizza e anel, barras empilhadas e de 100 %, áreas, dispersão e bolhas, histograma, sparkline, medidor, mapa de calor, radar, blocos de números-chave e uma vista de tabela. JavaScript e CSS puros, sem dependências: os valores ficam ao lado das marcas, todo gráfico funciona com o teclado e, com movimento reduzido, nada se move.

## Uso

```html
<link rel="stylesheet" href="psorvia-charts.css">
<script src="psorvia-charts.js"></script>
<script src="psorvia-charts.extra.js"></script> <!-- só para scatter, hist, gauge, heat, radar -->
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
import './psorvia-charts.extra.esm.js'; // só para scatter, hist, gauge, heat, radar
auto();
</script>
```

O núcleo cobre bars, lines, area, pie, ring, barras empilhadas e de 100 %, tiles, sparkline e table. Dispersão, histograma, medidor, mapa de calor e radar ficam em um segundo arquivo, `psorvia-charts.extra.js` (script clássico, carregue depois do principal) ou `psorvia-charts.extra.esm.js` (módulo). Sem ele, esses tipos informam um erro claro e nada mais muda.

## Tipos de gráfico

| `type` | Mostra |
|---|---|
| `bars` | Uma barra por valor, crescendo a partir de uma linha de base (`baseline: 1` separa mais rápido de mais lento). Várias séries dão barras agrupadas. |
| `lines` | Uma linha por série ao longo das categorias, com rótulo no fim da linha. |
| `area` | Linhas preenchidas a partir de zero; `stacked: true` empilha as séries (valores negativos contam como 0). |
| `stacked` | Uma barra por categoria, as séries empilhadas de ponta a ponta; valor em cada segmento, total no fim. |
| `percent` | O mesmo que barras de 100 %; cada segmento mostra sua parte da categoria. |
| `pie`, `donut` | Uma série, uma fatia por categoria, rótulo com valor e parte em uma linha-guia (em telas estreitas, em uma lista abaixo). A partir de 7 fatias, as menores são reunidas em "Outros" (`maxSlices`, padrão 6; `other: false` mantém todas). O anel mostra o total no meio (`center: 'mean'` para a média, `false` para nada). |
| `tiles` | Blocos de números-chave com um número que conta para cima, uma marca (▲ ▼ =) e um texto curto. Um item pode levar `spark: [values]` para uma linha pequena. |
| `table` | Uma tabela simples. |
| `spark` | Uma linha pequena para texto corrido e blocos: `values`, `width` e `height` opcionais; mostra o último valor, as setas percorrem os pontos. |
| `scatter` | *(extra)* Pontos ou bolhas. As categorias são os pontos, a primeira série é x, a segunda y, uma terceira opcional é o tamanho da bolha. |
| `hist` | *(extra)* Histograma dos valores brutos da primeira série; `bins` ou `binWidth`, senão automático. A vista de tabela mostra as classes. |
| `gauge` | *(extra)* Um mostrador por categoria a partir da primeira série, `min` e `max`, `bands: [{ to, label }]` opcional, desenhado como zonas com padrão; o nome da zona é escrito sob o número. |
| `heat` | *(extra)* Grade de categorias (linhas) e séries (colunas), cor da célula a partir do valor, o número em cada célula. A cor do texto é escolhida para manter 4,5:1 contra a célula. |
| `radar` | *(extra)* 3 a 8 eixos (categorias) e no máximo 3 séries, valores nos pontos. Mais eixos ou séries são recusados com um erro: além disso um gráfico de radar não é legível, use barras. |

`values` em vez de `series` e `categories` é um atalho para uma única série (`hist`, `spark`); `value` é um atalho para um `gauge`. Todo tipo de gráfico, exceto `tiles`, `table` e `spark`, tem um seletor entre gráfico e tabela; os tipos de séries têm uma legenda que oculta séries; todos têm uma leitura abaixo do gráfico.

## Opções

| Opção | Padrão | |
|---|---|---|
| `type` | | Um dos tipos acima |
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
| `stacked` | `false` | Área: empilhar as séries |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Pizza e anel, veja acima |
| `bins`, `binWidth` | automático | Histograma |
| `min`, `max`, `bands` | `0`, `100` | Medidor |
| `labels` | inglês | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, suas próprias palavras |
| `lang` | idioma da página | Formato numérico, via `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` ou `genre` |
| `theme` | automático | `light` ou `dark` para forçar um |
| `motion` | automático | `off` desliga a animação |
| `items` | | Somente blocos: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` é `good`, `bad` ou `neutral` |

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
| `--pc-0` a `--pc-5` | Cores das séries e das fatias; `--pc-5` também é a cor de "Outros" |
| `--pc-good`, `--pc-bad` | Borda do bloco para melhor e pior |
| `--pc-cur` | Contorno da marca selecionada |
| `--pc-font`, `--pc-r` | Fonte e raio dos cantos |

`data-pc-style` (ou a opção `style`) escolhe um de quatro conjuntos: `house` (verde), `gauge` (âmbar sobre papel ou preto, monoespaçado), `plain` (preto e branco com um destaque) e `genre` (quente). Defina as propriedades em `.pc` ou em um único gráfico para usar as suas.

## Acessibilidade

- A imagem é um `img` com rótulo; abaixo dela fica uma área de teclado: Tab chega ao gráfico, as setas movem entre as marcas (fatias, pontos, células, mostradores, classes), Home e End saltam, Escape limpa. A marca selecionada recebe contorno e é lida em uma região `aria-live`.
- Todo gráfico tem uma vista de tabela com cabeçalhos corretos. As séries e fatias se distinguem por padrão (barras, áreas, pizzas) e forma (linhas, pontos), não só por cor; as células do mapa de calor trazem o número, as zonas do medidor o nome; melhor e pior nos blocos, por marca e palavra.
- Todo o texto tem pelo menos 13 px e contraste de pelo menos 4,5:1; as marcas têm pelo menos 3:1. A suíte de testes verifica os quatro estilos em claro e escuro.
- Com movimento reduzido (configuração do sistema ou `motion: 'off'`), barras e linhas são desenhadas de uma vez e os números não contam para cima.

## Desempenho

O núcleo tem cerca de 37 KB de script e 12 KB de CSS, 14,7 KB com gzip no total; os tipos extras acrescentam 5,6 KB com gzip. Sem dependências. Os gráficos só são redesenhados quando a largura muda; a animação usa CSS e começa quando o gráfico entra na área visível.

## Testes

`python3 tools/build.py` gera os cinco arquivos a partir de `src/`. `python3 tests/browser.py` abre `demo.html` no Chromium headless (requer o pacote Python `websockets`), verifica contraste, tamanho de fonte, teclado, vista de tabela e movimento reduzido para cada tipo, as três fontes de dados e texto que sai do gráfico, e `--photos <folder>` salva capturas de tela em claro, escuro e movimento reduzido.

## Traduções

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Norsk bokmål](README.nb.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md) · [Türkçe](README.tr.md)

## Licença

O código está sob a licença MIT (veja [LICENSE](../../LICENSE)). Os valores da demonstração são inventados (veja [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Feito para [psorvia.io](https://psorvia.io).
