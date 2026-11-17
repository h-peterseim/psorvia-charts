/*! PSOrvia Charts 1.0.0 | MIT | Petit Souris */
const NS = 'http://www.w3.org/2000/svg';
let uid = 0;
const S = (t, a, p, x) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (x != null) e.textContent = x; if (p) p.appendChild(e); return e; };
const H = (t, a, p, x) => { const e = document.createElement(t); for (const k in a) e.setAttribute(k, a[k]); if (x != null) e.textContent = x; if (p) p.appendChild(e); return e; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEF = {
  chart: 'Chart', table: 'Table', view: 'View', series: 'Series', na: 'n/a', source: 'Source',
  hint: 'Pick a mark with the mouse, a tap or the arrow keys.', keys: 'Arrow keys move between marks, Home and End jump, Escape clears.'
};
const MARK = ['circle', 'square', 'diamond', 'triangle'];

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

function niceStep(span, n) {
  const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
}
function ticks(lo, hi, n) {
  const st = niceStep(hi - lo, n), out = [];
  for (let v = Math.ceil(lo / st - 1e-9) * st; v <= hi + 1e-9; v += st) out.push(+v.toFixed(6));
  return { out, dec: st >= 1 ? 0 : st >= 0.1 ? 1 : 2 };
}

function defs(svg, id, n) {
  const d = S('defs', {}, svg);
  for (let k = 0; k < n; k++) {
    const p = S('pattern', { id: id + 'p' + k, width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, d);
    S('rect', { width: 8, height: 8, class: 'pc-f' + k }, p);
    if (k === 1) S('rect', { width: 3, height: 8, class: 'pc-hatch' }, p);
    if (k === 2) S('circle', { cx: 4, cy: 4, r: 1.6, class: 'pc-hatch' }, p);
    if (k === 3) { S('rect', { width: 8, height: 2.5, class: 'pc-hatch' }, p); S('rect', { width: 2.5, height: 8, class: 'pc-hatch' }, p); }
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
  this.fmt = fmtFactory(this.lang, spec.digits != null ? spec.digits : 2);
  this.u = spec.unit || ''; this.hidden.clear(); this.cur = null;
  h.textContent = ''; h.classList.add('pc'); h.setAttribute('data-pc-type', spec.type);
  const st = spec.style || o.style; if (st) h.setAttribute('data-pc-style', st);
  const th = spec.theme || o.theme; if (th) h.setAttribute('data-pc-theme', th);
  if ((spec.motion || o.motion) === 'off') h.classList.add('pc-still');
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
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { h.classList.add('pc-in'); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(h);
  } else h.classList.add('pc-in');
  return this;
};
Chart.prototype.show = function (v) {
  this.view = v; const c = v === 'chart';
  this.plot.hidden = !c; this.read.hidden = !c; this.leg.hidden = !c; this.tw.hidden = c;
  this.bC.setAttribute('aria-pressed', c); this.bT.setAttribute('aria-pressed', !c);
  if (c) { this.W = 0; const w = Math.round(this.plot.clientWidth); if (w) { this.W = w; this.draw(); } }
};
Chart.prototype.legend = function () {
  const sp = this.spec; this.leg.textContent = '';
  if (sp.series.length < 2 || sp.legend === false) { this.leg.hidden = true; return; }
  sp.series.forEach((s, k) => {
    const b = H('button', { type: 'button', 'aria-pressed': 'true' }, H('li', {}, this.leg));
    const sv = S('svg', { width: 18, height: 18, 'aria-hidden': 'true', focusable: 'false' }, b);
    if (sp.type === 'bars') { defs(sv, this.id + 'l', 4); S('rect', { x: 1, y: 3, width: 16, height: 12, fill: 'url(#' + this.id + 'lp' + (k % 4) + ')', class: 'pc-o' + (k % 4) }, sv); }
    else marker(sv, MARK[k % 4], 9, 9, 5, 'pc-m' + (k % 4));
    H('span', {}, b, s.name);
    b.onclick = () => {
      if (this.hidden.has(k)) this.hidden.delete(k); else if (this.hidden.size < sp.series.length - 1) this.hidden.add(k);
      this.leg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', !this.hidden.has(i)));
      this.cur = null; this.draw();
    };
  });
};
Chart.prototype.table = function () {
  const sp = this.spec, t = H('table', { class: 'pc-table' }, this.tw);
  H('caption', {}, t, sp.title + (this.u ? ' (' + this.u.trim() + ')' : ''));
  const tr = H('tr', {}, H('thead', {}, t));
  H('th', { scope: 'col' }, tr, sp.catHeader || '');
  sp.series.forEach(s => H('th', { scope: 'col' }, tr, s.name));
  const tb = H('tbody', {}, t);
  sp.categories.forEach((c, i) => {
    const r = H('tr', {}, tb), th = H('th', { scope: 'row' }, r, c.label);
    if (c.note) { H('br', {}, th); H('span', { class: 'pc-note' }, th, c.note); }
    sp.series.forEach(s => H('td', {}, r, s.values[i] == null ? this.L.na : this.fmt(s.values[i]) + this.u));
  });
};
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
  defs(svg, this.id, 4);
  this.items = [];
  (sp.type === 'lines' ? this.lines : this.bars).call(this, svg, W);
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
  const top = sp.baseline != null ? 40 : 8, barH = 17, g = S('g', {}, svg);
  const rows = []; let y = top;
  sp.categories.forEach((c, i) => {
    const tg = S('g', { class: 'pc-lab' }, g), n = wrap(tg, 0, 0, c.label, labW, 3, 'start');
    const rh = Math.max(vs.length * (barH + 4) + 12, n * 17 + 12);
    rows.push({ y, rh, tg, n, i }); y += rh;
  });
  const tk = ticks(lo, hi, W < 480 ? 3 : 5), tf = fmtFactory(this.lang, tk.dec);
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
      S('text', { x: bx + 8, y: 31, 'text-anchor': 'start', class: 'pc-side' }, g, sp.sides[1] + ' ▶');
    }
  }
  rows.forEach(r => vs.forEach((k, j) => {
    const v = sp.series[k].values[r.i], yy = r.y + 6 + j * (barH + 4), q = k % 4;
    const e = S('g', { class: 'pc-mk' }, g); S('rect', { x: 0, y: r.y, width: W, height: r.rh, class: 'pc-hit' }, e);
    if (v == null) S('text', { x: bx + 6, y: yy + 13, class: 'pc-val' }, e, this.L.na);
    else {
      const xv = X(v), x = Math.min(xv, bx), w = Math.max(Math.abs(xv - bx), 2);
      const bar = S('rect', { x, y: yy, width: w, height: barH, class: 'pc-bar pc-o' + q, fill: `url(#${this.id}p${q})`, style: `transform-origin:${bx}px 0;--d:${(r.i * 3 + j) * 45}ms` }, e);
      S('text', { x: v >= base ? xv + 6 : xv - 6, y: yy + 13, 'text-anchor': v >= base ? 'start' : 'end', class: 'pc-val', style: `--d:${(r.i * 3 + j) * 45 + 300}ms` }, e, this.fmt(v) + this.u);
    }
    this.items.push({ el: e, row: r.i, k, v, vi: j, y: r.y, rh: r.rh });
  }));
  svg.setAttribute('height', y + 26); svg.setAttribute('viewBox', `0 0 ${W} ${y + 26}`);
  this.nav = 'bars';
};
Chart.prototype.lines = function (svg, W) {
  const sp = this.spec, vs = sp.series.map((s, k) => k).filter(k => !this.hidden.has(k)), n = sp.categories.length, base = sp.baseline;
  const nameW = clamp(Math.max.apply(0, vs.map(k => sp.series[k].name.length)) * 7.2, 80, W * 0.34), padL = 46, padR = nameW + 14, padT = 14;
  let lo = Infinity, hi = -Infinity;
  vs.forEach(k => sp.series[k].values.forEach(v => { if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }));
  if (base != null) { lo = Math.min(lo, base); hi = Math.max(hi, base); }
  if (hi - lo < 0.2) { lo -= 0.1; hi += 0.1; }
  const pad = (hi - lo) * 0.1; lo = sp.zero ? Math.min(0, lo) : Math.max(0, lo - pad) === 0 && lo >= 0 ? Math.max(0, lo - pad) : lo - pad; hi += pad;
  const left = padL, right = W - padR, H2 = 250, bot = padT + H2, g = S('g', {}, svg);
  const X = i => n < 2 ? (left + right) / 2 : left + i * (right - left - 8) / (n - 1) + 4, Y = v => bot - (v - lo) / (hi - lo) * H2;
  const tk = ticks(lo, hi, 5), tf = fmtFactory(this.lang, tk.dec);
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
    const s = sp.series[k], q = k % 4, pts = s.values.map((v, i) => v == null ? null : [X(i), Y(v), i]).filter(Boolean);
    if (!pts.length) return;
    S('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), pathLength: 1, class: 'pc-line pc-s' + q, style: `--d:${j * 120}ms` }, g);
    pts.forEach(p => {
      const e = S('g', { class: 'pc-mk pc-pt', style: `--d:${600 + j * 120}ms` }, g);
      S('circle', { cx: p[0], cy: p[1], r: 16, class: 'pc-hit' }, e);
      marker(e, MARK[q], p[0], p[1], 5, 'pc-m' + q);
      if (vs.length <= 2) S('text', { x: p[0], y: p[1] - 11, 'text-anchor': 'middle', class: 'pc-val pc-halo' }, e, this.fmt(s.values[p[2]]) + this.u);
      this.items.push({ el: e, col: p[2], k, v: s.values[p[2]], x: p[0], y: p[1] });
    });
    const lp = pts[pts.length - 1]; ends.push({ k, y: lp[1], x: lp[0], last: lp[2] === n - 1 });
  });
  ends.sort((a, b) => a.y - b.y);
  let prev = -1e9;
  ends.forEach(e => {
    const t = S('g', { class: 'pc-end pc-s' + (e.k % 4) }, g), nm = sp.series[e.k].name;
    const yy = Math.max(e.y + 5, prev + 18), ln = wrap(t, right + 12, yy, nm, nameW, 2, 'start', 'pc-ename');
    S('line', { x1: e.x + 7, x2: right + 8, y1: e.y, y2: yy - 5, class: 'pc-lead' }, t);
    prev = yy + (ln - 1) * 15;
  });
  const hgt = bot + 24 + xl * 16 + 6;
  svg.setAttribute('height', hgt); svg.setAttribute('viewBox', `0 0 ${W} ${hgt}`); this.nav = 'lines';
};
Chart.prototype.say = function (it) {
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
  } else {
    if (k === 'ArrowRight' || k === 'ArrowLeft') { const d = k === 'ArrowRight' ? 1 : -1; let best = null; its.forEach(i => { if (i.k === c.k && (i.col - c.col) * d > 0 && (!best || Math.abs(i.col - c.col) < Math.abs(best.col - c.col))) best = i; }); t = best; }
    else if (k === 'ArrowDown' || k === 'ArrowUp') { const d = k === 'ArrowDown' ? 1 : -1; let best = null; its.forEach(i => { if (i.col === c.col && (i.y - c.y) * d > 0 && (!best || Math.abs(i.y - c.y) < Math.abs(best.y - c.y))) best = i; }); t = best; }
  }
  if (t) { e.preventDefault(); this.mark(t.n); } else if (/^Arrow/.test(k)) e.preventDefault();
};
Chart.prototype.destroy = function () { if (this.ro) this.ro.disconnect(); this.host.textContent = ''; this.host.classList.remove('pc', 'pc-in'); };

/* ---------- Kennzahl-Kacheln ---------- */
function Tiles(host, spec, opt) {
  this.host = host; const lang = spec.lang || (opt && opt.lang) || document.documentElement.lang || 'en';
  host.textContent = ''; host.classList.add('pc', 'pc-tilebox'); host.setAttribute('data-pc-type', 'tiles');
  const st = spec.style || (opt && opt.style); if (st) host.setAttribute('data-pc-style', st);
  const th = spec.theme || (opt && opt.theme); if (th) host.setAttribute('data-pc-theme', th);
  if ((spec.motion || (opt && opt.motion)) === 'off') host.classList.add('pc-still');
  if (spec.title) H('h3', { class: 'pc-title' }, host, spec.title);
  const ul = H('ul', { class: 'pc-tiles' }, host), anim = [];
  spec.items.forEach(it => {
    const f = fmtFactory(lang, it.digits != null ? it.digits : 2), li = H('li', { class: 'pc-tile pc-tone-' + (it.tone || 'neutral') }, ul);
    H('span', { class: 'pc-tl' }, li, it.label);
    const txt = f(it.value) + (it.unit || ''), v = H('b', { class: 'pc-tv', 'aria-hidden': 'true' }, li, txt);
    H('span', { class: 'pc-sr' }, li, txt);
    const sub = H('span', { class: 'pc-ts' }, li);
    if (it.mark) H('span', { class: 'pc-tm', 'aria-hidden': 'true' }, sub, it.mark + ' ');
    sub.appendChild(document.createTextNode(it.sub || ''));
    anim.push([v, it.value, f, it.unit || '']);
  });
  const run = () => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches || host.classList.contains('pc-still')) return;
    const t0 = performance.now();
    const step = t => { const p = clamp((t - t0) / 700, 0, 1), e = 1 - Math.pow(1 - p, 3); anim.forEach(a => { a[0].textContent = a[2](a[1] * e) + a[3]; }); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { host.classList.add('pc-in'); io.disconnect(); run(); } }, { threshold: 0.2 });
    io.observe(host);
  } else host.classList.add('pc-in');
}

/* ---------- Tabelle ---------- */
function Tab(host, spec, opt) {
  host.textContent = ''; host.classList.add('pc'); host.setAttribute('data-pc-type', 'table');
  const st = spec.style || (opt && opt.style); if (st) host.setAttribute('data-pc-style', st);
  const th = spec.theme || (opt && opt.theme); if (th) host.setAttribute('data-pc-theme', th);
  const lang = spec.lang || (opt && opt.lang) || document.documentElement.lang || 'en', f = fmtFactory(lang, spec.digits != null ? spec.digits : 2);
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

export function create(host, spec, opt) {
  const t = spec.type;
  if (t === 'tiles') return new Tiles(host, spec, opt);
  if (t === 'table') return new Tab(host, spec, opt);
  if (t !== 'bars' && t !== 'lines') throw new Error('PsoCharts: unknown type ' + t);
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
export const version = '1.0.0';
