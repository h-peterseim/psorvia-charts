# PSOrvia Charts

**Animowane, dostępne wykresy dla Twojej strony**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Demo na żywo](https://h-peterseim.github.io/psorvia-charts/)

Słupki, linie, wykresy kołowy i pierścieniowy, słupki skumulowane i 100 %, obszary, wykresy punktowy i bąbelkowy, histogram, sparkline, wskaźnik, mapa cieplna, radar, kafelki z kluczowymi liczbami i widok tabeli. Czysty JavaScript i CSS bez zależności: wartości stoją obok znaczników, każdy wykres działa z klawiaturą, a przy ograniczonym ruchu nic się nie porusza.

## Użycie

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
import './psorvia-charts.extra.esm.js'; // tylko dla scatter, hist, gauge, heat, radar
auto();
</script>
```

Rdzeń obejmuje bars, lines, area, pie, ring, słupki skumulowane i 100 %, kafelki, sparkline i tabelę. Wykres punktowy, histogram, wskaźnik, mapa cieplna i radar są w drugim pliku, `psorvia-charts.extra.js` (zwykły skrypt, załaduj po głównym) lub `psorvia-charts.extra.esm.js` (moduł). Bez niego te typy zgłaszają wyraźny błąd, a nic innego się nie zmienia.

## Typy wykresów

| `type` | Pokazuje |
|---|---|
| `bars` | Jeden słupek na wartość, rosnący od linii bazowej (`baseline: 1` oddziela szybsze od wolniejszych). Kilka serii daje słupki grupowane. |
| `lines` | Jedna linia na serię przez kategorie, z etykietą na końcu linii. |
| `area` | Wypełnione linie od zera; `stacked: true` układa serie w stos (wartości ujemne liczą się jako 0). |
| `stacked` | Jeden słupek na kategorię, serie ułożone jedna na drugiej; wartość w każdym segmencie, suma na końcu. |
| `percent` | To samo co słupki 100 %; każdy segment pokazuje swój udział w kategorii. |
| `pie`, `donut` | Jedna seria, jeden wycinek na kategorię, etykieta z wartością i udziałem na linii odniesienia (na wąskich ekranach na liście poniżej). Od 7 wycinków najmniejsze są łączone w „Inne” (`maxSlices`, domyślnie 6; `other: false` zachowuje wszystkie). Pierścień pokazuje sumę pośrodku (`center: 'mean'` dla średniej, `false` dla niczego). |
| `tiles` | Kafelki z kluczowymi liczbami: liczba, która narasta, znacznik (▲ ▼ =) i krótki tekst. Element może zawierać `spark: [values]` dla małej linii. |
| `table` | Zwykła tabela. |
| `spark` | Mała linia do tekstu i kafelków: `values`, opcjonalnie `width` i `height`; pokazuje ostatnią wartość, klawisze strzałek przechodzą po punktach. |
| `scatter` | *(extra)* Punkty lub bąbelki. Kategorie to punkty, pierwsza seria to x, druga y, opcjonalna trzecia to rozmiar bąbelka. |
| `hist` | *(extra)* Histogram surowych wartości pierwszej serii; `bins` lub `binWidth`, w przeciwnym razie automatycznie. Widok tabeli pokazuje klasy. |
| `gauge` | *(extra)* Jeden wskaźnik na kategorię z pierwszej serii, `min` i `max`, opcjonalne `bands: [{ to, label }]` rysowane jako strefy ze wzorem; nazwa strefy jest zapisana pod liczbą. |
| `heat` | *(extra)* Siatka kategorii (wiersze) i serii (kolumny), kolor komórki z wartości, liczba w każdej komórce. Kolor tekstu dobiera się tak, by zachował 4,5:1 względem komórki. |
| `radar` | *(extra)* 3 do 8 osi (kategorie) i najwyżej 3 serie, wartości przy punktach. Więcej osi lub serii jest odrzucane z błędem: dalej wykres radarowy jest nieczytelny, użyj słupków. |

`values` zamiast `series` i `categories` to skrót dla jednej serii (`hist`, `spark`); `value` to skrót dla jednego `gauge`. Każdy typ wykresu poza `tiles`, `table` i `spark` ma przełącznik między wykresem a tabelą; typy seryjne mają legendę ukrywającą serie; wszystkie mają pole odczytu pod wykresem.

## Opcje

| Opcja | Domyślnie | |
|---|---|---|
| `type` | | Jeden z powyższych typów |
| `title` | | Tytuł wykresu, także nazwa dla technologii asystujących |
| `desc` | | Krótki opis pod tytułem |
| `categories` | | `[{ label, note }]`, `note` jest pokazywana w polu odczytu i w tabeli |
| `series` | | `[{ name, values }]`, `null` dla brakującej wartości |
| `baseline` | brak (bars: 0) | Wartość odniesienia, rysowana jako linia |
| `baselineLabel` | | Tekst przy linii bazowej, na przykład `Reference 1.0` |
| `sides` | | `[below, above]`, nazwy dwóch stron linii bazowej, wypowiadane też w polu odczytu |
| `unit` | | Dopisywana do każdej liczby, na przykład `' ms'` |
| `digits` | `2` | Miejsca po przecinku |
| `catHeader` | | Nagłówek pierwszej kolumny tabeli |
| `source` | | Tekst stopki pod wykresem |
| `legend` | `true` | `false` ukrywa legendę |
| `zero` | `false` | Linie: uwzględnia 0 na osi wartości |
| `stacked` | `false` | Obszar: układa serie w stos |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Kołowy i pierścieniowy, zob. wyżej |
| `bins`, `binWidth` | automatycznie | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Wskaźnik |
| `labels` | angielski | `{ chart, table, view, na, hint, keys, other, sum, mean, share, count, range, size }`, własne sformułowania |
| `lang` | język strony | Format liczb, przez `Intl.NumberFormat` |
| `style` | `house` | `house`, `gauge`, `plain` lub `genre` |
| `theme` | automatycznie | `light` lub `dark`, aby wymusić jeden |
| `motion` | automatycznie | `off` wyłącza animację |
| `items` | | Tylko kafelki: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` to `good`, `bad` lub `neutral` |

## API

- `PsoCharts.create(element, spec, options)` rysuje wykres w `element` i go zwraca. `options` przyjmuje `style`, `theme`, `motion` i `lang` jako wartości domyślne dla spec.
- `chart.set(spec)` zastępuje dane, `chart.show('chart' | 'table')` przełącza widok, `chart.destroy()` usuwa wykres.
- `PsoCharts.auto(root)` rysuje każdy `<div data-pso-chart>` na stronie. Atrybut zawiera opcje jako JSON, `data-chart-source="#id"` wskazuje źródło danych.
- `PsoCharts.read(element)`, `fromLd(json, id)` i `fromTable(table)` zamieniają źródło danych w spec.

## Źródła danych

Dane mogą pochodzić z trzech miejsc. Opcje takie jak `type` i `baseline` zawsze trafiają do atrybutu `data-pso-chart`.

**JSON-LD (schema.org Dataset).** Liczby są na stronie jako dane strukturalne, które mogą czytać także maszyny. Każda seria to `PropertyValue` w `variableMeasured`; jej `valueReference` wymienia po jednym `PropertyValue` na kategorię z `name` i `value`:

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

Przy kilku zbiorach danych w jednym `@graph` `dataset` wskazuje `@id` do użycia. Twórca, technika i `isBasedOn` (z `version`) tworzą stopkę. `description` przy wartości kategorii staje się jej notatką. Wybraliśmy `PropertyValue`, bo to stabilny typ schema.org; `Observation` jest tam wciąż oznaczony jako oczekujący.

**Tabela HTML.** Istniejąca tabela zostaje na stronie, ze skryptem lub bez. Wykres jest dodawany obok niej. Nagłówki kolumn to serie, nagłówki wierszy to kategorie, atrybut `data-value` komórki zawiera dokładną liczbę:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Zwykły JSON.** Element `<script type="application/json">` ze spec (`categories`, `series`, ...) albo spec podany bezpośrednio w `PsoCharts.create`.

## Style i kolory

Kolory to właściwości niestandardowe CSS na `.pc`, dla jasnego i ciemnego motywu (ustawienie systemu, `:root[data-theme]` lub `data-pc-theme`):

| Właściwość | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Tło, tekst, tekst drugoplanowy |
| `--pc-grid`, `--pc-sep` | Linie siatki, separatory |
| `--pc-0` do `--pc-5` | Kolory serii i wycinków; `--pc-5` to także kolor „Inne” |
| `--pc-good`, `--pc-bad` | Krawędź kafelka dla lepszego i gorszego |
| `--pc-cur` | Obrys wybranego znacznika |
| `--pc-font`, `--pc-r` | Czcionka i promień zaokrąglenia |

`data-pc-style` (lub opcja `style`) wybiera jeden z czterech zestawów: `house` (zielony), `gauge` (bursztyn na papierze lub czerń, monospace), `plain` (czarno-biały z jednym akcentem) i `genre` (ciepły). Ustaw właściwości na `.pc` lub na pojedynczym wykresie, aby użyć własnych.

## Dostępność

- Obraz to `img` z etykietą; pod nim jest obszar klawiatury: Tab dociera do wykresu, klawisze strzałek przechodzą między znacznikami (wycinkami, punktami, komórkami, wskaźnikami, klasami), Home i End skaczą, Escape czyści wybór. Wybrany znacznik jest obrysowany i odczytywany w regionie `aria-live`.
- Każdy wykres ma widok tabeli z poprawnymi nagłówkami. Serie i wycinki różnią się wzorem (słupki, obszary, kołowe) i kształtem (linie, punkty), nie tylko kolorem; komórki mapy cieplnej niosą swoją liczbę, strefy wskaźnika swoją nazwę; lepsze i gorsze na kafelkach rozróżnia znacznik i słowo.
- Cały tekst ma co najmniej 13 px i kontrast co najmniej 4,5:1; znaczniki mają co najmniej 3:1. Zestaw testów sprawdza wszystkie cztery style w jasnym i ciemnym motywie.
- Przy ograniczonym ruchu (ustawienie systemu lub `motion: 'off'`) słupki i linie są rysowane od razu, a liczby nie narastają.

## Wydajność

Rdzeń to około 37 KB skryptu i 12 KB CSS, razem 14,7 KB po gzipie; dodatkowe typy dodają 5,6 KB po gzipie. Bez zależności. Wykresy są przerysowywane tylko przy zmianie szerokości; animacja używa CSS i startuje, gdy wykres przewinie się do widoku.

## Testy

`python3 tools/build.py` buduje pięć plików z `src/`. `python3 tests/browser.py` otwiera `demo.html` w headless Chromium (wymaga pakietu Pythona `websockets`), sprawdza kontrast, rozmiar czcionki, klawiaturę, widok tabeli i ograniczony ruch dla każdego typu, wszystkie trzy źródła danych oraz tekst wychodzący poza wykres, a `--photos <folder>` zapisuje zrzuty ekranu w trybie jasnym, ciemnym i z ograniczonym ruchem.

## Tłumaczenia

[English](../../README.md) · [Deutsch](README.de.md) · [Български](README.bg.md) · [Čeština](README.cs.md) · [Dansk](README.da.md) · [Ελληνικά](README.el.md) · [Español](README.es.md) · [Eesti](README.et.md) · [Suomi](README.fi.md) · [Français](README.fr.md) · [Gaeilge](README.ga.md) · [Hrvatski](README.hr.md) · [Magyar](README.hu.md) · [Italiano](README.it.md) · [Lietuvių](README.lt.md) · [Latviešu](README.lv.md) · [Malti](README.mt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Português](README.pt.md) · [Română](README.ro.md) · [Slovenčina](README.sk.md) · [Slovenščina](README.sl.md) · [Svenska](README.sv.md)

## Licencja

Kod jest na licencji MIT (zob. [LICENSE](../../LICENSE)). Wartości demonstracyjne są zmyślone (zob. [media/LICENSE.md](../../media/LICENSE.md)).

SPDX-License-Identifier: MIT

Stworzone dla [psorvia.io](https://psorvia.io).
