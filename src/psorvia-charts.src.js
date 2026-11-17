/*! PSOrvia Charts 1.1.1 | MIT | Petit Souris */
const NS = 'http://www.w3.org/2000/svg';
let uid = 0;
const S = (t, a, p, x) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (x != null) e.textContent = x; if (p) p.appendChild(e); return e; };
const H = (t, a, p, x) => { const e = document.createElement(t); for (const k in a) e.setAttribute(k, a[k]); if (x != null) e.textContent = x; if (p) p.appendChild(e); return e; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEF = {
  chart: 'Chart', table: 'Table', view: 'View', series: 'Series', na: 'n/a', source: 'Source',
  other: 'Other', sum: 'Total', mean: 'Average', share: 'Share', count: 'Count', range: 'Range', size: 'Size', hint: 'Pick a mark with the mouse, a tap or the arrow keys.', keys: 'Arrow keys move between marks, Home and End jump, Escape clears.'
};
const MARK = ['circle', 'square', 'diamond', 'triangle'];
const TY = { bars: 'bars', stacked: 'stack', percent: 'stack', lines: 'lines', area: 'lines', pie: 'pie', donut: 'pie' }, PREP = {}, CHK = {};
const LEG = { bars: 1, stacked: 1, percent: 1, lines: 1, area: 1 };
function pctFactory(lang) { let f; try { f = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 1 }); } catch (e) { f = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 }); } return f.format.bind(f); }
const num = v => { if (v == null || v === '') return null; const n = typeof v === 'number' ? v : Number(v); return isFinite(n) ? n : null; };
function norm(sp) {
  if (sp.title == null) sp.title = '';
  if (sp.values && !sp.series) { sp.series = [{ name: sp.title || '', values: sp.values }]; if (!sp.categories) sp.categories = sp.values.map((v, i) => ({ label: '#' + (i + 1) })); }
  if (sp.value != null && !sp.series) { sp.categories = [{ label: sp.label || '' }]; sp.series = [{ name: sp.title || '', values: [sp.value] }]; }
  if (Array.isArray(sp.series)) { if (!sp.categories) sp.categories = []; sp.series.forEach(r => { r.values = Array.isArray(r.values) ? r.values.map(num) : []; }); }
  else if (sp.type !== 'tiles') { sp.series = []; if (!sp.categories) sp.categories = []; }
  if (Array.isArray(sp.items)) sp.items.forEach(it => { it.value = num(it.value); });
  return sp;
}
function setup(h, sp, o, cls) {
  h.textContent = ''; h.classList.add('pc'); if (cls) h.classList.add(cls); h.setAttribute('data-pc-type', sp.type);
  const st = sp.style || o.style; if (st) h.setAttribute('data-pc-style', st);
  const th = sp.theme || o.theme; if (th) h.setAttribute('data-pc-theme', th);
  if ((sp.motion || o.motion) === 'off') h.classList.add('pc-still');
  return sp.lang || o.lang || document.documentElement.lang || 'en';
}
function reveal(h, cb) {
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { h.classList.add('pc-in'); io.disconnect(); if (cb) cb(); } }, { threshold: 0.2 });
    io.observe(h);
  } else { h.classList.add('pc-in'); if (cb) cb(); }
}

function fmtFactory(lang, d) {
  let f;
  try { f = new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d }); }
  catch (e) { f = new Intl.NumberFormat('en', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  return v => v == null ? null : f.format(v);
}

/* Text mit Umbruch nach gemessener Breite; gibt die Zeilenzahl zurueck */
function wrap(parent, x, y, text, maxW, maxLines, anchor, cls) {
  const t = S('text', { x, y, 'text-anchor': anchor || 'start', class: cls || '' }, parent);
  const m = S('tspan', {}, t);
  const words = String(text).split(/\s+/); const lines = []; let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w; m.textContent = test;
    if (cur && m.getComputedTextLength() > maxW) { lines.push(cur); cur = w; } else cur = test;
  }
  lines.push(cur);
  if (lines.length > maxLines) { const rest = lines.splice(maxLines - 1).join(' '); lines.push(rest); }
  t.removeChild(m);
  lines.forEach((l, i) => S('tspan', { x, dy: i ? '1.2em' : 0 }, t, l));
  return lines.length;
}

/* Text, der rechts ueber den Rand ragt, nach links schieben */
function fit(t, W) {
  const l = t.getComputedTextLength(), x = +t.getAttribute('x');
  if (t.getAttribute('text-anchor') !== 'end' && x + l > W - 2) t.setAttribute('x', Math.max(2, W - 2 - l));
  return t;
}

function niceStep(span, n) {
  const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
}
function ticks(lo, hi, n) {
  const st = niceStep(hi - lo, n), out = [];
  for (let v = Math.ceil(lo / st - 1e-9) * st; v <= hi + 1e-9; v += st) out.push(+v.toFixed(6));
  return { out, dec: st >= 1 ? 0 : st >= 0.1 ? 1 : 2 };
}

/* Marken so waehlen, dass die Beschriftungen (Textbreite + Mindestabstand) nebeneinander passen */
function fitTicks(lo, hi, pw, fmtT, max) {
  let tk;
  for (let n = max; n >= 2; n--) {
    tk = ticks(lo, hi, n);
    const w = Math.max.apply(0, tk.out.map(v => fmtT(v, tk.dec).length)) * 8.6 + 16;
    if (tk.out.length < 2 || pw / (tk.out.length - 1) >= w) return tk;
  }
  return tk;
}

function defs(svg, id, n) {
  const d = S('defs', {}, svg);
  for (let k = 0; k < n; k++) {
    const p = S('pattern', { id: id + 'p' + k, width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, d);
    S('rect', { width: 8, height: 8, class: 'pc-f' + k }, p);
    if (k === 1) S('rect', { width: 3, height: 8, class: 'pc-hatch' }, p);
    if (k === 2) S('circle', { cx: 4, cy: 4, r: 1.6, class: 'pc-hatch' }, p);
    if (k === 3) { S('rect', { width: 8, height: 2.5, class: 'pc-hatch' }, p); S('rect', { width: 2.5, height: 8, class: 'pc-hatch' }, p); }
    if (k === 4) { S('rect', { width: 4, height: 4, class: 'pc-hatch' }, p); S('rect', { x: 4, y: 4, width: 4, height: 4, class: 'pc-hatch' }, p); }
  }
}

function marker(g, shape, x, y, r, cls) {
  if (shape === 'circle') return S('circle', { cx: x, cy: y, r, class: cls }, g);
  if (shape === 'square') return S('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, class: cls }, g);
  const pts = shape === 'diamond' ? [[x, y - r * 1.3], [x + r * 1.3, y], [x, y + r * 1.3], [x - r * 1.3, y]] : [[x, y - r * 1.2], [x + r * 1.2, y + r], [x - r * 1.2, y + r]];
  return S('polygon', { points: pts.map(p => p.join(',')).join(' '), class: cls }, g);
}

/* ---------- Diagramm ---------- */
function Chart(host, spec, opt) {
  this.host = host; this.opt = opt || {}; this.id = 'pc' + (++uid) + '-'; this.hidden = new Set(); this.cur = null; this.view = 'chart';
  this.set(spec);
}
Chart.prototype.set = function (spec) {
  const o = this.opt, h = this.host;
  this.spec = spec; this.L = Object.assign({}, DEF, spec.labels); this.lang = spec.lang || o.lang || document.documentElement.lang || 'en';
  this.fmt = fmtFactory(this.lang, spec.digits != null ? spec.digits : 2); this.pc = pctFactory(this.lang);
  this.u = spec.unit || ''; this.hidden.clear(); this.cur = null;
  setup(h, spec, o); this.prep();
  const L = this.L;
  const head = H('div', { class: 'pc-head' }, h);
  H('h3', { class: 'pc-title', id: this.id + 't' }, head, spec.title);
  const sw = H('div', { class: 'pc-view', role: 'group', 'aria-label': L.view }, head);
  this.bC = H('button', { type: 'button', 'aria-pressed': 'true' }, sw, L.chart);
  this.bT = H('button', { type: 'button', 'aria-pressed': 'false' }, sw, L.table);
  this.bC.onclick = () => this.show('chart'); this.bT.onclick = () => this.show('table');
  if (spec.desc) H('p', { class: 'pc-desc' }, h, spec.desc);
  this.leg = H('ul', { class: 'pc-legend' }, h);
  this.plot = H('div', { class: 'pc-plot', tabindex: '0', role: 'group', 'aria-roledescription': 'chart', 'aria-label': spec.title + '. ' + L.keys }, h);
  this.read = H('p', { class: 'pc-read', 'aria-live': 'polite' }, h, L.hint);
  this.tw = H('div', { class: 'pc-tablewrap', hidden: '' }, h);
  if (spec.source) H('p', { class: 'pc-foot' }, h, spec.source);
  this.legend(); this.table();
  this.plot.onkeydown = e => this.key(e);
  this.plot.onblur = () => { if (this.items) this.mark(null, true); };
  if (this.ro) this.ro.disconnect();
  this.W = 0;
  const go = () => { const w = Math.round(this.plot.clientWidth); if (w && w !== this.W && this.view === 'chart') { this.W = w; this.draw(); } };
  this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(go) : null;
  if (this.ro) this.ro.observe(this.plot); else go();
  reveal(h);
  return this;
};
Chart.prototype.show = function (v) {
  this.view = v; const c = v === 'chart';
  this.plot.hidden = !c; this.read.hidden = !c; this.leg.hidden = !c || this.noLeg; this.tw.hidden = c;
  this.bC.setAttribute('aria-pressed', c); this.bT.setAttribute('aria-pressed', !c);
  if (c) { this.W = 0; const w = Math.round(this.plot.clientWidth); if (w) { this.W = w; this.draw(); } }
};
Chart.prototype.legend = function () {
  const sp = this.spec; this.leg.textContent = '';
  this.noLeg = sp.series.length < 2 || sp.legend === false || !LEG[sp.type]; this.leg.hidden = this.noLeg; if (this.noLeg) return;
  const pat = sp.type === 'bars' || sp.type === 'stacked' || sp.type === 'percent' || (sp.type === 'area' && sp.stacked);
  sp.series.forEach((s, k) => {
    const b = H('button', { type: 'button', 'aria-pressed': 'true' }, H('li', {}, this.leg));
    const sv = S('svg', { width: 18, height: 18, 'aria-hidden': 'true', focusable: 'false' }, b);
    if (pat) { defs(sv, this.id + 'l', 6); S('rect', { x: 1, y: 3, width: 16, height: 12, fill: 'url(#' + this.id + 'lp' + (k % 6) + ')', class: 'pc-o' + (k % 6) }, sv); }
    else marker(sv, MARK[k % 4], 9, 9, 5, 'pc-m' + (k % 6));
    H('span', {}, b, s.name);
    b.onclick = () => {
      if (this.hidden.has(k)) this.hidden.delete(k); else if (this.hidden.size < sp.series.length - 1) this.hidden.add(k);
      this.leg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', !this.hidden.has(i)));
      this.cur = null; this.draw();
    };
  });
};
Chart.prototype.table = function () {
  const sp = this.spec, L = this.L, hs = sp.type === 'hist', pi = this.sl, t = H('table', { class: 'pc-table' }, this.tw);
  H('caption', {}, t, sp.title + (this.u ? ' (' + this.u.trim() + ')' : ''));
  const tr = H('tr', {}, H('thead', {}, t)), tb = H('tbody', {}, t);
  if (hs) {
    [L.range, L.count, L.share].forEach(x => H('th', { scope: 'col' }, tr, x));
    this.bins.forEach(b => { const r = H('tr', {}, tb); H('th', { scope: 'row' }, r, b.t); H('td', {}, r, b.v); H('td', {}, r, this.pc(b.v / this.n)); });
    return;
  }
  H('th', { scope: 'col' }, tr, sp.catHeader || '');
  sp.series.forEach(s => H('th', { scope: 'col' }, tr, s.name));
  if (pi) H('th', { scope: 'col' }, tr, L.share);
  const v0 = i => Math.max(0, +sp.series[0].values[i] || 0), tot = pi ? sp.categories.reduce((a, c, i) => a + v0(i), 0) || 1 : 1;
  sp.categories.forEach((c, i) => {
    const r = H('tr', {}, tb), th = H('th', { scope: 'row' }, r, c.label);
    if (c.note) { H('br', {}, th); H('span', { class: 'pc-note' }, th, c.note); }
    sp.series.forEach((s, k) => H('td', {}, r, s.values[i] == null ? L.na : this.fmt(s.values[i]) + this.un(k)));
    if (pi) H('td', {}, r, this.pc(v0(i) / tot));
  });
};
Chart.prototype.un = function (k) { return this.spec.type === 'scatter' ? (this.spec.series[k].unit || '') : this.u; };
Chart.prototype.verdict = function (v) {
  const sp = this.spec, b = sp.baseline;
  if (b == null || !sp.sides || v == null) return '';
  return v < b ? sp.sides[0] : v > b ? sp.sides[1] : (sp.sides[2] || '');
};
Chart.prototype.draw = function () {
  const sp = this.spec, W = this.W; if (!W) return;
  this.plot.querySelectorAll('svg').forEach(x => x.remove());
  const svg = S('svg', { width: W, class: 'pc-svg', role: 'img', 'aria-label': sp.title + (sp.desc ? '. ' + sp.desc : '') }, null);
  this.plot.insertBefore(svg, this.plot.firstChild);
  defs(svg, this.id, 6);
  this.items = [];
  this[TY[sp.type]](svg, W);
  this.items.forEach((it, n) => { it.n = n; it.el.addEventListener('pointerdown', () => this.mark(n)); it.el.addEventListener('pointerenter', () => this.mark(n)); });
  svg.addEventListener('pointerleave', () => this.mark(null, true));
  svg.classList.add('pc-ani');
  this.cur = null;
};
Chart.prototype.bars = function (svg, W) {
  const sp = this.spec, vs = sp.series.map((s, k) => k).filter(k => !this.hidden.has(k));
  const base = sp.baseline != null ? sp.baseline : 0, labW = clamp(W * 0.34, 96, 190), x0 = labW + 8, x1 = W - 6;
  let lo = base, hi = base;
  vs.forEach(k => sp.series[k].values.forEach(v => { if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }));
  if (hi - lo < 0.2) { lo -= 0.1; hi += 0.1; }
  let ml = 4; vs.forEach(k => sp.series[k].values.forEach(v => { if (v != null) ml = Math.max(ml, (this.fmt(v) + this.u).length); }));
  const res = Math.ceil(ml * 8.6 + 12), a = x0 + res, b = x1 - res, X = v => a + (v - lo) / (hi - lo) * (b - a), bx = X(base);
  const narrow = sp.baseline != null && sp.sides && bx + 8 + (sp.sides[1].length + 2) * 7.8 > W - 2;
  const top = sp.baseline != null ? (narrow ? 58 : 40) : 8, barH = 17, g = S('g', {}, svg);
  const rows = []; let y = top;
  sp.categories.forEach((c, i) => {
    const tg = S('g', { class: 'pc-lab' }, g), n = wrap(tg, 0, 0, c.label, labW, 3, 'start');
    const rh = Math.max(vs.length * (barH + 4) + 12, n * 17 + 12);
    rows.push({ y, rh, tg, n, i }); y += rh;
  });
  const tk = fitTicks(lo, hi, b - a, (v, d) => fmtFactory(this.lang, d)(v) + this.u, W < 480 ? 3 : 5), tf = fmtFactory(this.lang, tk.dec);
  tk.out.forEach(v => {
    const x = X(v);
    S('line', { x1: x, x2: x, y1: top - 4, y2: y, class: 'pc-grid' }, g);
    S('text', { x, y: y + 17, 'text-anchor': 'middle', class: 'pc-tick' }, g, tf(v) + this.u);
  });
  rows.forEach(r => {
    r.tg.setAttribute('transform', `translate(0,${r.y + r.rh / 2 - (r.n - 1) * 8.5 + 4})`);
    if (r.i) S('line', { x1: 0, x2: W, y1: r.y, y2: r.y, class: 'pc-sep' }, g);
  });
  const bl = S('line', { x1: bx, x2: bx, y1: top - 8, y2: y + 4, class: 'pc-base' }, g);
  if (sp.baseline != null) {
    if (sp.baselineLabel) S('text', { x: bx, y: 12, 'text-anchor': 'middle', class: 'pc-blab' }, g, sp.baselineLabel);
    if (sp.sides) {
      S('text', { x: bx - 8, y: 31, 'text-anchor': 'end', class: 'pc-side' }, g, '◀ ' + sp.sides[0]);
      if (narrow) S('text', { x: W - 2, y: 49, 'text-anchor': 'end', class: 'pc-side' }, g, sp.sides[1] + ' ▶');
      else fit(S('text', { x: bx + 8, y: 31, 'text-anchor': 'start', class: 'pc-side' }, g, sp.sides[1] + ' ▶'), W);
    }
  }
  rows.forEach(r => vs.forEach((k, j) => {
    const v = sp.series[k].values[r.i], yy = r.y + 6 + j * (barH + 4), q = k % 6;
    const e = S('g', { class: 'pc-mk' }, g); S('rect', { x: 0, y: r.y, width: W, height: r.rh, class: 'pc-hit' }, e);
    if (v == null) fit(S('text', { x: bx + 6, y: yy + 13, class: 'pc-val' }, e, this.L.na), W);
    else {
      const xv = X(v), x = Math.min(xv, bx), w = Math.max(Math.abs(xv - bx), 2);
      const bar = S('rect', { x, y: yy, width: w, height: barH, class: 'pc-bar pc-o' + q, fill: `url(#${this.id}p${q})`, style: `transform-origin:${bx}px 0;--d:${(r.i * 3 + j) * 45}ms` }, e);
      fit(S('text', { x: v >= base ? xv + 6 : xv - 6, y: yy + 13, 'text-anchor': v >= base ? 'start' : 'end', class: 'pc-val', style: `--d:${(r.i * 3 + j) * 45 + 300}ms` }, e, this.fmt(v) + this.u), W);
    }
    this.items.push({ el: e, row: r.i, k, v, vi: j, y: r.y, rh: r.rh });
  }));
  svg.setAttribute('height', y + 26); svg.setAttribute('viewBox', `0 0 ${W} ${y + 26}`);
  this.nav = 'bars';
};
Chart.prototype.lines = function (svg, W) {
  const sp = this.spec, vs = sp.series.map((s, k) => k).filter(k => !this.hidden.has(k)), n = sp.categories.length, base = sp.baseline, ar = sp.type === 'area', st = ar && sp.stacked, cum = {};
  if (st) { const run = new Array(n).fill(0); vs.forEach(k => { cum[k] = sp.series[k].values.map((v, i) => run[i] += Math.max(0, +v || 0)); }); }
  const top = (k, i) => st ? cum[k][i] : sp.series[k].values[i];
  const nameW = clamp(Math.max.apply(0, vs.map(k => sp.series[k].name.length)) * 7.2, 80, W * 0.34), padR = nameW + 14, padT = 14;
  let lo = Infinity, hi = -Infinity;
  vs.forEach(k => sp.series[k].values.forEach((v, i) => { v = top(k, i); if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }));
  if (base != null) { lo = Math.min(lo, base); hi = Math.max(hi, base); }
  if (hi - lo < 0.2) { lo -= 0.1; hi += 0.1; }
  const pad = (hi - lo) * 0.1; lo = sp.zero || ar ? Math.min(0, lo) : Math.max(0, lo - pad) === 0 && lo >= 0 ? Math.max(0, lo - pad) : lo - pad; hi += pad;
  const tk = ticks(lo, hi, 5), tf = fmtFactory(this.lang, tk.dec), left = Math.max(46, Math.ceil(Math.max.apply(0, tk.out.map(v => (tf(v) + this.u).length)) * 8.8 + 14)), right = W - padR, H2 = 250, bot = padT + H2, g = S('g', {}, svg);
  const X = i => n < 2 ? (left + right) / 2 : left + i * (right - left - 8) / (n - 1) + 4, Y = v => bot - (v - lo) / (hi - lo) * H2;
  tk.out.forEach(v => {
    S('line', { x1: left, x2: right, y1: Y(v), y2: Y(v), class: 'pc-grid' }, g);
    S('text', { x: left - 6, y: Y(v) + 5, 'text-anchor': 'end', class: 'pc-tick' }, g, tf(v) + this.u);
  });
  let xl = 1; const step = (right - left) / Math.max(1, n - 1);
  sp.categories.forEach((c, i) => { const t = S('g', {}, g); xl = Math.max(xl, wrap(t, X(i), bot + 20, c.label, Math.min(step - 6, 140), 2, 'middle', 'pc-tick')); });
  if (base != null) {
    S('line', { x1: left, x2: right, y1: Y(base), y2: Y(base), class: 'pc-base' }, g);
    if (sp.baselineLabel) S('text', { x: left + 6, y: Y(base) - 6, class: 'pc-blab' }, g, sp.baselineLabel);
  }
  const ends = [];
  vs.forEach((k, j) => {
    const s = sp.series[k], q = k % 6, pts = s.values.map((v, i) => v == null && !st ? null : [X(i), Y(top(k, i)), i]).filter(Boolean), lowY = i => Y(st && j ? cum[vs[j - 1]][i] : 0);
    if (!pts.length) return;
    if (ar) S('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'L' + pts.slice().reverse().map(p => p[0].toFixed(1) + ' ' + lowY(p[2]).toFixed(1)).join('L') + 'Z', class: 'pc-area' + (st ? '' : ' pc-soft pc-f' + q), style: `--d:${j * 120}ms`, ...(st ? { fill: `url(#${this.id}p${q})` } : {}) }, g);
    S('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), pathLength: 1, class: 'pc-line pc-s' + q, style: `--d:${j * 120}ms` }, g);
    pts.forEach(p => {
      const e = S('g', { class: 'pc-mk pc-pt', style: `--d:${600 + j * 120}ms` }, g);
      S('circle', { cx: p[0], cy: p[1], r: 16, class: 'pc-hit' }, e);
      marker(e, MARK[q % 4], p[0], p[1], 5, 'pc-m' + q);
      if (vs.length <= (ar ? 1 : 2) && !st) S('text', { x: p[0], y: p[1] - 11, 'text-anchor': 'middle', class: 'pc-val pc-halo' }, e, this.fmt(s.values[p[2]]) + this.u);
      this.items.push({ el: e, col: p[2], k, v: s.values[p[2]], x: p[0], y: p[1] });
    });
    const lp = pts[pts.length - 1]; ends.push({ k, y: st ? (lp[1] + lowY(lp[2])) / 2 : lp[1], x: lp[0] });
  });
  ends.sort((a, b) => a.y - b.y);
  let prev = -1e9;
  ends.forEach(e => {
    const t = S('g', { class: 'pc-end pc-s' + (e.k % 6) }, g), nm = sp.series[e.k].name;
    const yy = Math.max(e.y + 5, prev + 18), ln = wrap(t, right + 12, yy, nm, nameW, 2, 'start', 'pc-ename');
    S('line', { x1: e.x + 7, x2: right + 8, y1: e.y, y2: yy - 5, class: 'pc-lead' }, t);
    prev = yy + (ln - 1) * 15;
  });
  const hgt = bot + 24 + xl * 16 + 6;
  svg.setAttribute('height', hgt); svg.setAttribute('viewBox', `0 0 ${W} ${hgt}`); this.nav = 'lines';
};
Chart.prototype.prep = function () {
  const sp = this.spec, t = sp.type; this.sl = this.bins = null;
  if (t === 'pie' || t === 'donut') {
    let a = sp.categories.map((c, i) => ({ label: c.label, note: c.note, v: Math.max(0, +sp.series[0].values[i] || 0) })).filter(x => x.v > 0), mx = sp.maxSlices || 6;
    this.n0 = a.length;
    if (a.length > mx && sp.other !== false) {
      const keep = a.slice().sort((x, y) => y.v - x.v).slice(0, mx - 1), rest = a.filter(x => keep.indexOf(x) < 0);
      a = a.filter(x => keep.indexOf(x) >= 0); a.push({ label: this.L.other, note: rest.map(x => x.label).join(', '), v: rest.reduce((q, x) => q + x.v, 0), other: 1 });
    }
    this.sl = a;
  } else if (PREP[t]) PREP[t].call(this);
};
const vis = c => c.spec.series.map((s, k) => k).filter(k => !c.hidden.has(k));
const fin = (c, svg, W, h, nav) => { svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${W} ${h}`); c.nav = nav; };
Chart.prototype.stack = function (svg, W) {
  const sp = this.spec, pc = sp.type === 'percent', vs = vis(this), labW = clamp(W * 0.34, 96, 190), x0 = labW + 8, g = S('g', {}, svg);
  const val = (k, i) => Math.max(0, +sp.series[k].values[i] || 0), tot = sp.categories.map((c, i) => vs.reduce((q, k) => q + val(k, i), 0));
  const mx = pc ? 1 : Math.max.apply(0, tot.concat(1e-9)), res = pc ? 10 : Math.ceil((this.fmt(mx) + this.u).length * 8.6 + 12), x1 = W - res - 6, X = f => x0 + f / mx * (x1 - x0);
  const rows = []; let y = 6;
  sp.categories.forEach((c, i) => { const tg = S('g', { class: 'pc-lab' }, g), n = wrap(tg, 0, 0, c.label, labW, 3, 'start'), rh = Math.max(40, n * 17 + 12); rows.push({ y, rh, tg, n, i }); y += rh; });
  const tk = pc ? { out: [0, 0.25, 0.5, 0.75, 1] } : ticks(0, mx, W < 480 ? 3 : 5), tf = pc ? this.pc : fmtFactory(this.lang, ticks(0, mx, 5).dec);
  tk.out.forEach(v => { S('line', { x1: X(v), x2: X(v), y1: 2, y2: y, class: 'pc-grid' }, g); S('text', { x: X(v), y: y + 17, 'text-anchor': 'middle', class: 'pc-tick' }, g, pc ? tf(v) : tf(v) + this.u); });
  rows.forEach(r => { r.tg.setAttribute('transform', `translate(0,${r.y + r.rh / 2 - (r.n - 1) * 8.5 + 4})`); if (r.i) S('line', { x1: 0, x2: W, y1: r.y, y2: r.y, class: 'pc-sep' }, g); });
  rows.forEach(r => {
    let cum = 0; const yy = r.y + (r.rh - 24) / 2, T = tot[r.i] || 1, c = sp.categories[r.i];
    vs.forEach((k, j) => {
      const v = val(k, r.i), xa = X((pc ? cum / T : cum)), xb = X(pc ? (cum + v) / T : cum + v), w = Math.max(xb - xa, 2), q = k % 6; cum += v;
      const e = S('g', { class: 'pc-mk' }, g); S('rect', { x: xa, y: r.y, width: w, height: r.rh, class: 'pc-hit' }, e);
      S('rect', { x: xa, y: yy, width: w, height: 24, class: 'pc-bar pc-o' + q, fill: `url(#${this.id}p${q})`, style: `transform-origin:${x0}px 0;--d:${(r.i * 3 + j) * 45}ms` }, e);
      const lb = pc ? this.pc(v / T) : this.fmt(v) + this.u, t = S('text', { x: xa + w / 2, y: yy + 17, 'text-anchor': 'middle', class: 'pc-val pc-halo', style: `--d:${(r.i * 3 + j) * 45 + 300}ms` }, e, lb);
      if (v <= 0 || t.getComputedTextLength() > w - 6) t.remove();
      this.items.push({ el: e, row: r.i, k, v, vi: j, txt: c.label + ' · ' + sp.series[k].name + ': ' + this.fmt(v) + this.u + ' (' + this.pc(v / T) + ')' + (c.note ? ' – ' + c.note : '') });
    });
    if (!pc) fit(S('text', { x: X(cum) + 6, y: yy + 17, class: 'pc-val', style: `--d:${r.i * 135 + 500}ms` }, g, this.fmt(cum) + this.u), W);
  });
  fin(this, svg, W, y + 26, 'bars');
};
Chart.prototype.pie = function (svg, W) {
  const sp = this.spec, sl = this.sl, tot = sl.reduce((q, x) => q + x.v, 0) || 1, dn = sp.type === 'donut', g = S('g', {}, svg), id = this.id;
  const labW = clamp(W * 0.24, 110, 200), wide = (W - 2 * (labW + 30)) / 2 >= 90, R = wide ? clamp((W - 2 * (labW + 30)) / 2, 90, 150) : Math.min(W / 2 - 12, 120), cx = W / 2, cy = R + 14, r0 = dn ? R * 0.58 : 0;
  const P = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const m = S('mask', { id: id + 'm', maskUnits: 'userSpaceOnUse', x: -W, y: -W, width: 3 * W, height: 4 * W }, S('defs', {}, svg));
  S('circle', { cx, cy, r: R / 2 + 10, fill: 'none', stroke: '#fff', 'stroke-width': R + 20, pathLength: 1, class: 'pc-sw', transform: `rotate(-90 ${cx} ${cy})` }, m);
  let a = -Math.PI / 2, H2 = cy + R + 14; const lab = [];
  sl.forEach((x, i) => {
    const f = x.v / tot, a1 = a + Math.min(f, 0.9999) * 2 * Math.PI, am = (a + a1) / 2, q = x.other ? 5 : i % 5, big = a1 - a > Math.PI ? 1 : 0;
    const [x0, y0] = P(R, a), [x1, y1] = P(R, a1), [x2, y2] = P(r0, a1), [x3, y3] = P(r0, a);
    const d = `M${x0} ${y0}A${R} ${R} 0 ${big} 1 ${x1} ${y1}` + (dn ? `L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z` : `L${cx} ${cy}Z`);
    const e = S('g', { class: 'pc-mk', style: `--tx:${(Math.cos(am) * 8).toFixed(1)}px;--ty:${(Math.sin(am) * 8).toFixed(1)}px` }, g);
    S('path', { d, fill: `url(#${id}p${q})`, class: 'pc-wedge', mask: `url(#${id}m)` }, e);
    const vt = this.fmt(x.v) + this.u + ' · ' + this.pc(f);
    this.items.push({ el: e, k: i, v: x.v, txt: x.label + ': ' + vt + (x.note ? ' – ' + x.note : '') });
    if (!wide && f >= 0.07) { const [tx, ty] = P((R + r0) / 2 + (dn ? 0 : R * 0.15), am); S('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', class: 'pc-val pc-halo', style: `--d:${i * 90 + 500}ms` }, e, this.pc(f)); }
    lab.push({ e, x, am, q, vt }); a = a1;
  });
  if (wide) {
    [0, 1].forEach(side => {
      let prev = 4; const ls = lab.filter(l => (Math.cos(l.am) >= 0 ? 0 : 1) === side).sort((p, q) => Math.sin(p.am) - Math.sin(q.am));
      ls.forEach(l => {
        const fi = S('g', { class: 'pc-fi', style: `--d:${600}ms` }, l.e), tg = S('g', {}, fi), lx = side ? cx - R - 40 : cx + R + 40, an = side ? 'end' : 'start';
        const n = wrap(tg, lx, 0, l.x.label, labW, 2, an), hh = (n + 1) * 17;
        S('text', { x: lx, y: n * 17, 'text-anchor': an, class: 'pc-val' }, tg, l.vt);
        const yy = Math.max(cy + Math.sin(l.am) * (R + 16) - hh / 2, prev); tg.setAttribute('transform', `translate(0,${yy + 13})`); prev = yy + hh + 8; H2 = Math.max(H2, prev);
        const [p1, p2] = P(R + 3, l.am), [p3, p4] = P(R + 18, l.am);
        S('polyline', { points: `${p1},${p2} ${p3},${p4} ${lx + (side ? 6 : -6)},${yy + 8}`, class: 'pc-ll' }, fi);
      });
    });
  } else {
    let y = cy + R + 20;
    lab.forEach(l => {
      const fi = S('g', { class: 'pc-fi', style: '--d:600ms' }, l.e), tg = S('g', {}, fi), n = wrap(tg, 30, 0, l.x.label, W - 36, 2, 'start'), hh = (n + 1) * 17;
      S('text', { x: 30, y: n * 17, class: 'pc-val' }, tg, l.vt); tg.setAttribute('transform', `translate(0,${y + 13})`);
      S('rect', { x: 4, y: y + 1, width: 18, height: 18, fill: `url(#${id}p${l.q})`, stroke: 'var(--pc-fg)', 'stroke-width': 1 }, fi);
      S('rect', { x: 0, y: y - 4, width: W, height: hh + 8, class: 'pc-hit' }, l.e); y += hh + 10;
    });
    H2 = y;
  }
  if (dn && sp.center !== false) {
    const sum = sp.center !== 'mean', t1 = S('text', { x: cx, y: cy + 2, 'text-anchor': 'middle', class: 'pc-val pc-big' }, g, this.fmt(sum ? tot : tot / (this.n0 || 1)) + this.u);
    let fs = 26; while (fs > 14 && t1.getComputedTextLength() > r0 * 1.7) t1.setAttribute('style', 'font-size:' + (--fs) + 'px');
    S('text', { x: cx, y: cy + 22, 'text-anchor': 'middle', class: 'pc-tick' }, g, sum ? this.L.sum : this.L.mean);
  }
  fin(this, svg, W, H2 + 4, 'seq');
};
Chart.prototype.say = function (it) {
  if (it.txt) return it.txt;
  const sp = this.spec, s = sp.series[it.k], c = sp.categories[it.row != null ? it.row : it.col];
  const v = it.v == null ? this.L.na : this.fmt(it.v) + this.u, vd = this.verdict(it.v);
  return c.label + (sp.series.length > 1 ? ' · ' + s.name : '') + ': ' + v + (vd ? ' (' + vd + ')' : '') + (c.note ? ' – ' + c.note : '');
};
Chart.prototype.mark = function (n, quiet) {
  this.items.forEach(i => i.el.classList.remove('pc-cur'));
  this.cur = n;
  if (n == null) { if (!quiet) this.read.textContent = this.L.hint; return; }
  const it = this.items[n]; it.el.classList.add('pc-cur'); this.read.textContent = this.say(it);
};
Chart.prototype.key = function (e) {
  if (!this.items || !this.items.length) return;
  const its = this.items, c = this.cur == null ? null : its[this.cur], k = e.key; let t = null;
  if (k === 'Escape') { this.mark(null); return; }
  if (c == null) { if (/^(Arrow|Home|End)/.test(k)) { e.preventDefault(); this.mark(0); } return; }
  const by = (f) => { const r = its.filter(f); return r.length ? r : null; };
  if (k === 'Home') t = its[0]; else if (k === 'End') t = its[its.length - 1];
  else if (this.nav === 'bars') {
    if (k === 'ArrowDown' || k === 'ArrowUp') { const d = k === 'ArrowDown' ? 1 : -1, r = by(i => i.row === c.row + d); if (r) t = r.find(i => i.vi === c.vi) || r[r.length - 1]; }
    else if (k === 'ArrowRight' || k === 'ArrowLeft') t = its[its.indexOf(c) + (k === 'ArrowRight' ? 1 : -1)];
    if (t && t.row !== c.row && (k === 'ArrowRight' || k === 'ArrowLeft')) t = null;
  } else if (this.nav === 'sp') {
    const dx = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0, dy = k === 'ArrowDown' ? 1 : k === 'ArrowUp' ? -1 : 0;
    if (dx || dy) { let bs = 1e9; its.forEach(i => { const a = (i.x - c.x) * dx + (i.y - c.y) * dy, b = Math.abs((i.x - c.x) * dy) + Math.abs((i.y - c.y) * dx); if (a > 0.5 && a + 2 * b < bs) { bs = a + 2 * b; t = i; } }); }
  } else if (this.nav === 'seq') {
    if (k === 'ArrowRight' || k === 'ArrowDown') t = its[its.indexOf(c) + 1]; else if (k === 'ArrowLeft' || k === 'ArrowUp') t = its[its.indexOf(c) - 1];
  } else {
    if (k === 'ArrowRight' || k === 'ArrowLeft') { const d = k === 'ArrowRight' ? 1 : -1; let best = null; its.forEach(i => { if (i.k === c.k && (i.col - c.col) * d > 0 && (!best || Math.abs(i.col - c.col) < Math.abs(best.col - c.col))) best = i; }); t = best; }
    else if (k === 'ArrowDown' || k === 'ArrowUp') { const d = k === 'ArrowDown' ? 1 : -1; let best = null; its.forEach(i => { if (i.col === c.col && (i.y - c.y) * d > 0 && (!best || Math.abs(i.y - c.y) < Math.abs(best.y - c.y))) best = i; }); t = best; }
  }
  if (t) { e.preventDefault(); this.mark(t.n); } else if (/^Arrow/.test(k)) e.preventDefault();
};
Chart.prototype.destroy = function () { if (this.ro) this.ro.disconnect(); if (this.tm) { this.tm.mo.disconnect(); this.tm.mq.removeEventListener('change', this.tm.f); this.tm = null; } this.host.textContent = ''; this.host.classList.remove('pc', 'pc-in'); };

/* ---------- Kennzahl-Kacheln ---------- */
function Tiles(host, spec, opt) {
  this.host = host; opt = opt || {}; const lang = setup(host, spec, opt, 'pc-tilebox');
  if (spec.title) H('h3', { class: 'pc-title' }, host, spec.title);
  const ul = H('ul', { class: 'pc-tiles' }, host), anim = [];
  (spec.items || []).forEach(it => {
    const f = fmtFactory(lang, it.digits != null ? it.digits : 2), li = H('li', { class: 'pc-tile pc-tone-' + (it.tone || 'neutral') }, ul);
    H('span', { class: 'pc-tl' }, li, it.label);
    const txt = it.value == null ? DEF.na : f(it.value) + (it.unit || ''), v = H('b', { class: 'pc-tv', 'aria-hidden': 'true' }, li, txt);
    H('span', { class: 'pc-sr' }, li, txt);
    const sub = H('span', { class: 'pc-ts' }, li);
    if (it.mark) H('span', { class: 'pc-tm', 'aria-hidden': 'true' }, sub, it.mark + ' ');
    sub.appendChild(document.createTextNode(it.sub || ''));
    if (it.value != null) anim.push([v, it.value, f, it.unit || '']);
    if (it.spark) new Spark(H('span', { class: 'pc-ts' }, li), { type: 'spark', values: it.spark, title: it.label, lang, style: spec.style || opt.style, theme: spec.theme || opt.theme, motion: spec.motion || opt.motion }, {});
  });
  const run = () => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches || host.classList.contains('pc-still')) return;
    const t0 = performance.now();
    const step = t => { const p = clamp((t - t0) / 700, 0, 1), e = 1 - Math.pow(1 - p, 3); anim.forEach(a => { a[0].textContent = a[2](a[1] * e) + a[3]; }); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  reveal(host, run);
}

/* ---------- Sparkline ---------- */
function Spark(host, spec, opt) {
  this.host = host; opt = opt || {}; norm(spec); const lang = setup(host, spec, opt, 'pc-spark'), s0 = spec.series[0], vals = s0.values, n = vals.length;
  const f = fmtFactory(lang, spec.digits != null ? spec.digits : 2), u = spec.unit || '', w = spec.width || 120, h = spec.height || 32, pad = 5, lab = i => (spec.categories && spec.categories[i] ? spec.categories[i].label + ': ' : '');
  const nums = vals.filter(v => v != null); let lo = Math.min.apply(0, nums), hi = Math.max.apply(0, nums); if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
  if (!nums.length) { H('b', { class: 'pc-spv' }, host, DEF.na); host.setAttribute('role', 'img'); host.setAttribute('aria-label', (spec.title || '') + ' ' + DEF.na); return; }
  const X = i => pad + i * (w - 2 * pad) / Math.max(1, n - 1), Y = v => h - pad - (v - lo) / (hi - lo) * (h - 2 * pad), pts = vals.map((v, i) => v == null ? null : [X(i), Y(v), i]).filter(Boolean);
  host.setAttribute('role', 'group'); host.setAttribute('tabindex', '0'); host.setAttribute('aria-roledescription', 'chart'); host.setAttribute('aria-label', (spec.title || '') + '. ' + (spec.keys || DEF.keys));
  const svg = S('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, 'aria-hidden': 'true', focusable: 'false', class: 'pc-spk' }, host), d = pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
  S('path', { d: 'M' + d + 'L' + pts[pts.length - 1][0] + ' ' + (h - pad) + 'L' + pts[0][0] + ' ' + (h - pad) + 'Z', class: 'pc-area pc-soft pc-f0' }, svg);
  S('path', { d: 'M' + d, pathLength: 1, class: 'pc-line pc-s0' }, svg);
  const last = pts[pts.length - 1], dot = S('circle', { cx: last[0], cy: last[1], r: 4, class: 'pc-m0 pc-spd' }, svg), val = H('b', { class: 'pc-spv' }, host, f(vals[last[2]]) + u), live = H('span', { class: 'pc-sr', 'aria-live': 'polite' }, host);
  const t = H('table', { class: 'pc-sr' }, host); H('caption', {}, t, spec.title || ''); const tb = H('tbody', {}, t);
  vals.forEach((v, i) => { const r = H('tr', {}, tb); H('th', { scope: 'row' }, r, spec.categories ? spec.categories[i].label : '#' + (i + 1)); H('td', {}, r, v == null ? DEF.na : f(v) + u); });
  let cur = null;
  const at = i => { cur = i; const p = pts.find(q => q[2] === i) || last; dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.classList.toggle('pc-cur', i != null); val.textContent = f(vals[p[2]]) + u; if (i != null) live.textContent = lab(p[2]) + f(vals[p[2]]) + u; };
  host.onkeydown = e => {
    const k = e.key, ix = pts.map(p => p[2]), c = cur == null ? ix.indexOf(last[2]) : ix.indexOf(cur); let m = null;
    if (k === 'ArrowRight' || k === 'ArrowDown') m = ix[Math.min(ix.length - 1, c + 1)]; else if (k === 'ArrowLeft' || k === 'ArrowUp') m = ix[Math.max(0, c - 1)]; else if (k === 'Home') m = ix[0]; else if (k === 'End') m = ix[ix.length - 1];
    else if (k === 'Escape') { at(null); return; } else return;
    e.preventDefault(); at(m);
  };
  host.onblur = () => at(null);
  svg.onpointermove = e => { const b = svg.getBoundingClientRect(); let best = pts[0], bd = 1e9; pts.forEach(p => { const dd = Math.abs(p[0] - (e.clientX - b.left)); if (dd < bd) { bd = dd; best = p; } }); at(best[2]); };
  svg.onpointerleave = () => at(null);
  reveal(host);
}
Spark.prototype.destroy = function () { this.host.textContent = ''; };

/* ---------- Tabelle ---------- */
function Tab(host, spec, opt) {
  const lang = setup(host, spec, opt || {}), f = fmtFactory(lang, spec.digits != null ? spec.digits : 2);
  const w = H('div', { class: 'pc-tablewrap' }, host), t = H('table', { class: 'pc-table' }, w);
  H('caption', {}, t, spec.title);
  const tr = H('tr', {}, H('thead', {}, t)); H('th', { scope: 'col' }, tr, spec.catHeader || '');
  spec.series.forEach(s => H('th', { scope: 'col' }, tr, s.name));
  const tb = H('tbody', {}, t);
  spec.categories.forEach((c, i) => {
    const r = H('tr', {}, tb); H('th', { scope: 'row' }, r, c.label);
    spec.series.forEach(s => H('td', {}, r, s.values[i] == null ? (spec.na || DEF.na) : f(s.values[i]) + (spec.unit || '')));
  });
}

if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('beforeprint', () => document.querySelectorAll('.pc').forEach(e => e.classList.add('pc-in')));
export function create(host, spec, opt) {
  const t = spec.type; norm(spec);
  if (t === 'tiles') return new Tiles(host, spec, opt);
  if (t === 'table') return new Tab(host, spec, opt);
  if (t === 'spark') return new Spark(host, spec, opt);
  if (!TY[t]) throw new Error('PsoCharts: unknown type ' + t + ' (scatter, hist, gauge, heat and radar need psorvia-charts.extra.js)');
  if (CHK[t]) CHK[t](spec);
  return new Chart(host, spec, opt);
}
const arr = x => x == null ? [] : Array.isArray(x) ? x : [x];
const nm = x => x == null ? '' : typeof x === 'string' ? x : (x.name || x.url || x['@id'] || '');
/* schema.org-Dataset: variableMeasured = je Reihe ein PropertyValue, dessen valueReference je Kategorie ein PropertyValue mit value traegt */
export function fromLd(json, id) {
  const find = o => { if (!o || typeof o !== 'object') return null; if (Array.isArray(o)) { for (const x of o) { const r = find(x); if (r) return r; } return null; }
    if (arr(o['@type']).includes('Dataset') && (!id || o['@id'] === id)) return o; return find(o['@graph']); };
  const d = find(json); if (!d) throw new Error('PsoCharts: no Dataset in JSON-LD');
  const cats = [], idx = {}, series = arr(d.variableMeasured).map(v => {
    const vals = []; arr(v.valueReference).forEach(p => {
      const key = p.name; if (!(key in idx)) { idx[key] = cats.length; cats.push({ label: key, note: p.description || '' }); }
      else if (p.description && !cats[idx[key]].note) cats[idx[key]].note = p.description;
      vals[idx[key]] = p.value == null ? null : +p.value;
    });
    return { name: v.name, unit: v.unitText, values: vals };
  });
  series.forEach(s => { for (let i = 0; i < cats.length; i++) if (s.values[i] === undefined) s.values[i] = null; });
  const foot = [nm(d.creator), d.measurementTechnique, [nm(d.isBasedOn), d.isBasedOn && d.isBasedOn.version].filter(Boolean).join(' ')].filter(Boolean).join(' \u00B7 ');
  return { type: 'bars', title: d.name, desc: d.description, categories: cats, series, source: foot, unit: '' };
}
/* vorhandene HTML-Tabelle: th scope=col = Reihen, th scope=row = Kategorien, Zahl aus data-value oder dem Text */
export function fromTable(t) {
  const hs = [...t.querySelectorAll('thead th')].slice(1).map(x => x.textContent.trim()), cats = [], rows = [];
  t.querySelectorAll('tbody tr').forEach(tr => {
    const th = tr.querySelector('th'); if (!th) return; cats.push({ label: th.firstChild ? th.firstChild.textContent.trim() : th.textContent.trim() });
    rows.push([...tr.querySelectorAll('td')].map(td => { const v = td.getAttribute('data-value'); const x = v != null ? v : td.textContent.replace(/[^\d.,\-]/g, '').replace(',', '.'); return x === '' || isNaN(+x) ? null : +x; }));
  });
  const cap = t.querySelector('caption');
  return { type: 'bars', title: cap ? cap.textContent.trim() : '', categories: cats, series: hs.map((n, k) => ({ name: n, values: rows.map(r => r[k] == null ? null : r[k]) })) };
}
export function read(src, id) {
  if (src.tagName === 'TABLE') return fromTable(src);
  const j = JSON.parse(src.textContent);
  return /ld\+json/.test(src.type || '') || j['@context'] ? fromLd(j, id) : j;
}
export function auto(root, opt) {
  const out = [];
  (root || document).querySelectorAll('[data-pso-chart]').forEach(el => {
    try {
      const sel = el.getAttribute('data-chart-source'), src = sel ? document.querySelector(sel) : el.querySelector('script[type="application/json"],script[type="application/ld+json"]');
      const cfg = el.getAttribute('data-pso-chart'), c = cfg ? JSON.parse(cfg) : {}, spec = src ? Object.assign(read(src, c.dataset), c) : c;
      if (!src && !c.type) return;
      if (spec.title == null) spec.title = '';
      out.push(create(el, spec, opt));
    } catch (e) { if (window.console) console.error(e); }
  });
  return out;
}
export const version = '1.1.1';
export const kit = { S, H, wrap, fit, ticks, niceStep, clamp, fmtFactory, marker, vis, fin, MARK, TY, LEG, PREP, CHK, Chart };
