# PSOrvia Charts

**Web siteniz için animasyonlu, erişilebilir grafikler**

PSOrvia · [psorvia.io](https://psorvia.io)

### ▶ [Canlı demo](https://h-peterseim.github.io/psorvia-charts/)

Çubuklar, çizgiler, pasta ve halka, yığılmış ve %100 çubuklar, alanlar, serpme ve baloncuklar, histogram, sparkline, gösterge, ısı haritası, radar, anahtar rakam kutuları ve tablo görünümü. Bağımlılıksız saf JavaScript ve CSS: değerler işaretlerin yanında yer alır, her grafik klavyeyle çalışır ve hareket azaltıldığında hiçbir şey hareket etmez.

## Kullanım

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
import './psorvia-charts.extra.esm.js'; // only for scatter, hist, gauge, heat, radar
auto();
</script>
```

Çekirdek; çubuk, çizgi, alan, pasta, halka, yığılmış ve %100 çubuk, kutu, sparkline ve tabloyu kapsar. Serpme, histogram, gösterge, ısı haritası ve radar ikinci bir dosyada bulunur: `psorvia-charts.extra.js` (klasik betik, ana betikten sonra yükleyin) veya `psorvia-charts.extra.esm.js` (modül). Bu dosya olmadan söz konusu türler net bir hata bildirir, başka hiçbir şey değişmez.

## Grafik türleri

| `type` | Gösterir |
|---|---|
| `bars` | Değer başına bir çubuk, bir taban çizgisinden büyür (`baseline: 1` daha hızlıyı daha yavaştan ayırır). Birden çok seri gruplanmış çubuk verir. |
| `lines` | Kategoriler boyunca seri başına bir çizgi, çizginin ucunda etiketli. |
| `area` | Sıfırdan başlayan dolu çizgiler; `stacked: true` serileri üst üste yığar (negatif değerler 0 sayılır). |
| `stacked` | Kategori başına bir çubuk, seriler uç uca yığılır; her bölümde değer, sonda toplam. |
| `percent` | %100 çubuklarla aynı; her bölüm kategorideki payını gösterir. |
| `pie`, `donut` | Bir seri, kategori başına bir dilim, değer ve payı gösteren etiket bir kılavuz çizgisinde (dar ekranlarda aşağıda bir listede). 7 dilimden itibaren en küçükler "Diğer" altında birleştirilir (`maxSlices`, varsayılan 6; `other: false` hepsini korur). Halka ortada toplamı gösterir (`center: 'mean'` ortalama için, `false` hiçbir şey için). |
| `tiles` | Yukarı sayan bir sayı, bir işaret (▲ ▼ =) ve kısa bir metin içeren anahtar rakam kutuları. Bir öğe küçük bir çizgi için `spark: [values]` ve sayının önünde gösterilen `prefix` (örneğin `"+"`) taşıyabilir. |
| `table` | Sade bir tablo. |
| `spark` | Akan metin ve kutular için küçük bir çizgi: `values`, isteğe bağlı `width` ve `height`; son değeri gösterir, ok tuşları noktalar arasında gezinir. |
| `scatter` | *(extra)* Noktalar veya baloncuklar. Kategoriler noktalardır, ilk seri x, ikinci y, isteğe bağlı üçüncü baloncuk boyutudur. |
| `hist` | *(extra)* İlk serinin ham değerlerinin histogramı; `bins` veya `binWidth`, aksi halde otomatik. Tablo görünümü sınıfları gösterir. |
| `gauge` | *(extra)* İlk seriden kategori başına bir kadran, `min` ve `max`, isteğe bağlı `bands: [{ to, label }]` desenli bölgeler olarak çizilir; bölge adı sayının altına yazılır. |
| `heat` | *(extra)* Kategoriler (satırlar) ve serilerden (sütunlar) oluşan ızgara, hücre rengi değere göre, her hücrede sayı. Metin rengi, hücreye karşı 4,5:1 kontrastı koruyacak şekilde seçilir. |
| `radar` | *(extra)* 3 ila 8 eksen (kategori) ve en fazla 3 seri, değerler noktalarda. Daha fazla eksen veya seri hatayla reddedilir: bunun ötesinde radar grafiği okunamaz, çubuk kullanın. |

`series` ve `categories` yerine `values`, tek bir seri için kısayoldur (`hist`, `spark`); `value`, tek bir `gauge` için kısayoldur. `tiles`, `table` ve `spark` dışındaki her grafik türünde grafik ile tablo arasında bir anahtar bulunur; seri türlerinde serileri gizleyen bir gösterge vardır; hepsinde grafiğin altında bir okuma alanı bulunur.

## Seçenekler

| Seçenek | Varsayılan | |
|---|---|---|
| `type` | | Yukarıdaki türlerden biri |
| `title` | | Grafik başlığı, aynı zamanda erişilebilir ad |
| `desc` | | Başlığın altında kısa açıklama |
| `categories` | | `[{ label, note }]`, `note` okuma alanında ve tabloda gösterilir |
| `series` | | `[{ name, values }]`, eksik değer için `null` |
| `baseline` | none (bars: 0) | Referans değeri, çizgi olarak çizilir |
| `baselineLabel` | | Taban çizgisindeki metin, örneğin `Reference 1.0` |
| `sides` | | `[below, above]`, taban çizgisinin iki tarafının adları, okuma alanında da seslendirilir |
| `unit` | | Her sayının sonuna eklenir, örneğin `' ms'` |
| `digits` | `2` | Ondalık basamak |
| `catHeader` | | İlk tablo sütununun başlığı |
| `source` | | Grafiğin altındaki alt bilgi metni |
| `legend` | `true` | `false` göstergeyi gizler |
| `zero` | `false` | Çizgiler: değer ekseninde 0'ı dahil et |
| `stacked` | `false` | Alan: serileri yığ |
| `maxSlices`, `other`, `center` | `6`, `true`, `'sum'` | Pasta ve halka, yukarıya bakın |
| `bins`, `binWidth` | automatic | Histogram |
| `min`, `max`, `bands` | `0`, `100` | Gösterge |
| `labels` | English | `{ chart, table, view, series, na, source, hint, keys, other, sum, mean, share, count, range, size }`, kendi ifadeleriniz; tüm grafikler için aynı anda `create()` ve `auto()` seçeneği olarak da kabul edilir |
| `lang` | page language | Sayı biçimi, `Intl.NumberFormat` ile |
| `style` | `house` | `house`, `gauge`, `plain` veya `genre` |
| `theme` | automatic | Birini zorlamak için `light` veya `dark` |
| `motion` | automatic | `off` animasyonu kapatır |
| `items` | | Yalnızca kutular: `[{ label, value, prefix, unit, digits, mark, sub, tone }]`, `tone` değeri `good`, `bad` veya `neutral` |

## API

- `PsoCharts.create(element, spec, options)` `element` içine bir grafik çizer ve onu döndürür. `options`, spesifikasyon için varsayılan olarak `style`, `theme`, `motion` ve `lang` alır.
- `chart.set(spec)` verileri değiştirir, `chart.show('chart' | 'table')` görünümü değiştirir, `chart.destroy()` grafiği kaldırır.
- `PsoCharts.auto(root)` sayfadaki her `<div data-pso-chart>` öğesini çizer. Öznitelik seçenekleri JSON olarak tutar, `data-chart-source="#id"` veri kaynağını belirtir.
- `PsoCharts.read(element)`, `fromLd(json, id)` ve `fromTable(table)` bir veri kaynağını spesifikasyona dönüştürür.

## Veri kaynakları

Veriler üç yerden gelebilir. `type` ve `baseline` gibi seçenekler her zaman `data-pso-chart` özniteliğine yazılır.

**JSON-LD (schema.org Dataset).** Sayılar sayfada, makinelerin de okuyabildiği yapılandırılmış veri olarak bulunur. Her seri `variableMeasured` içinde bir `PropertyValue`'dur; `valueReference` alanı, kategori başına `name` ve `value` ile bir `PropertyValue` listeler:

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

Bir `@graph` içinde birden çok veri kümesi olduğunda `dataset`, kullanılacak `@id` değerini belirtir. Oluşturan, teknik ve `isBasedOn` (`version` ile) alt bilgi olur. Bir kategori değerindeki `description` onun notu olur. `PropertyValue` seçtik, çünkü kararlı bir schema.org türüdür; `Observation` orada hâlâ beklemede olarak işaretlidir.

**HTML tablosu.** Mevcut bir tablo, betikle veya betiksiz sayfada kalır. Grafik yanına eklenir. Sütun başlıkları seriler, satır başlıkları kategorilerdir; bir hücredeki `data-value` özniteliği kesin sayıyı tutar:

```html
<table id="t"><caption>Speed</caption>
<thead><tr><th></th><th scope="col">Run A</th></tr></thead>
<tbody><tr><th scope="row">Read</th><td data-value="0.8">0.80</td></tr></tbody></table>
<div data-pso-chart='{"type":"bars"}' data-chart-source="#t"></div>
```

**Düz JSON.** Spesifikasyonu (`categories`, `series`, ...) içeren bir `<script type="application/json">` veya spesifikasyonun doğrudan `PsoCharts.create` içinde verilmesi.

## Stiller ve renkler

Renkler, `.pc` üzerinde açık ve koyu için CSS özel özellikleridir (sistem ayarı, `:root[data-theme]` veya `data-pc-theme`):

| Özellik | |
|---|---|
| `--pc-bg`, `--pc-fg`, `--pc-mut` | Arka plan, metin, ikincil metin |
| `--pc-grid`, `--pc-sep` | Izgara çizgileri, ayırıcılar |
| `--pc-0` – `--pc-5` | Seri ve dilim renkleri; `--pc-5` aynı zamanda "Diğer" rengidir |
| `--pc-good`, `--pc-bad` | Daha iyi ve daha kötü için kutu kenarı |
| `--pc-cur` | Seçili işaretin dış çizgisi |
| `--pc-font`, `--pc-r` | Yazı tipi ve köşe yarıçapı |

`data-pc-style` (veya `style` seçeneği) dört setten birini seçer: `house` (yeşil), `gauge` (kağıt veya siyah üzerinde kehribar, eş aralıklı), `plain` (tek vurgulu siyah-beyaz) ve `genre` (sıcak). Kendi değerlerinizi kullanmak için özellikleri `.pc` üzerinde veya tek bir grafikte ayarlayın.

## Erişilebilirlik

- Görsel, etiketli bir `img`'dir; altında bir klavye alanı bulunur: Tab ile grafiğe ulaşılır, ok tuşları işaretler (dilimler, noktalar, hücreler, kadranlar, sınıflar) arasında gezinir, Home ve End atlar, Escape seçimi temizler. Seçili işaret çerçevelenir ve bir `aria-live` bölgesinde okunur.
- Her grafiğin uygun başlıklara sahip bir tablo görünümü vardır. Seriler ve dilimler yalnızca renkle değil, desen (çubuklar, alanlar, pastalar) ve biçimle (çizgiler, noktalar) de ayrışır; ısı haritası hücreleri sayılarını, gösterge bölgeleri adlarını taşır; kutularda daha iyi ve daha kötü işaret ve sözcükle belirtilir.
- Tüm metin en az 13 px'tir ve en az 4,5:1 kontrasta sahiptir; işaretler en az 3:1 kontrasta sahiptir. Test paketi dört stili de açık ve koyu modda denetler.
- Azaltılmış harekette (sistem ayarı veya `motion: 'off'`) çubuklar ve çizgiler bir anda çizilir, sayılar yukarı sayılmaz.

## Performans

Çekirdek yaklaşık 37 KB betik ve 12 KB CSS'tir, birlikte gzip ile 14,7 KB; ek türler gzip ile 5,6 KB ekler. Bağımlılık yoktur. Grafikler yalnızca genişlik değiştiğinde yeniden çizilir; animasyon CSS kullanır ve grafik görünüme kaydırıldığında başlar.

## Testler

`python3 tools/build.py`, beş dosyayı `src/` içinden derler. `python3 tests/browser.py`, `demo.html` dosyasını başsız Chromium'da açar (Python paketi `websockets` gerekir), her tür için kontrastı, yazı boyutunu, klavyeyi, tablo görünümünü ve azaltılmış hareketi, üç veri kaynağını ve grafikten taşan metni denetler; `--photos <folder>` açık, koyu ve azaltılmış harekette ekran görüntüleri kaydeder.

## Çeviriler

[English](README.md) · [Deutsch](docs/i18n/README.de.md) · [Български](docs/i18n/README.bg.md) · [Čeština](docs/i18n/README.cs.md) · [Dansk](docs/i18n/README.da.md) · [Ελληνικά](docs/i18n/README.el.md) · [Español](docs/i18n/README.es.md) · [Eesti](docs/i18n/README.et.md) · [Suomi](docs/i18n/README.fi.md) · [Français](docs/i18n/README.fr.md) · [Gaeilge](docs/i18n/README.ga.md) · [Hrvatski](docs/i18n/README.hr.md) · [Magyar](docs/i18n/README.hu.md) · [Italiano](docs/i18n/README.it.md) · [Lietuvių](docs/i18n/README.lt.md) · [Latviešu](docs/i18n/README.lv.md) · [Malti](docs/i18n/README.mt.md) · [Norsk bokmål](docs/i18n/README.nb.md) · [Nederlands](docs/i18n/README.nl.md) · [Polski](docs/i18n/README.pl.md) · [Português](docs/i18n/README.pt.md) · [Română](docs/i18n/README.ro.md) · [Slovenčina](docs/i18n/README.sk.md) · [Slovenščina](docs/i18n/README.sl.md) · [Svenska](docs/i18n/README.sv.md) · [Türkçe](docs/i18n/README.tr.md)

## Lisans

Kod MIT lisansı altındadır (bkz. [LICENSE](LICENSE)). Demo değerleri uydurmadır (bkz. [media/LICENSE.md](media/LICENSE.md)).

SPDX-License-Identifier: MIT

[psorvia.io](https://psorvia.io) için geliştirildi.
