/*! PSOrvia Charts extra types 1.1.0 | MIT | Petit Souris */
const { S, wrap, ticks, niceStep, clamp, fmtFactory, marker, vis, fin, MARK, TY, LEG, PREP, CHK, Chart } = kit;
const rgb = c => { c = c.trim(); let m = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(c); if (m) { let h = m[1]; if (h.length === 3) h = h.replace(/./g, '$&$&'); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); } m = c.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; };
const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const hex = c => '#' + c.map(v => (v < 16 ? '0' : '') + v.toString(16)).join('');
function dom(lo, hi, n) { if (hi - lo < 1e-9) { lo -= 1; hi += 1; } const st = niceStep(hi - lo, n); return [Math.floor(lo / st + 1e-9) * st, Math.ceil(hi / st - 1e-9) * st]; }
CHK.radar = sp => { if (sp.categories.length < 3 || sp.categories.length > 8 || sp.series.length > 3) throw new Error('PsoCharts: radar takes 3 to 8 axes and at most 3 series, use bars for more'); };
CHK.scatter = sp => { if (sp.series.length < 2) throw new Error('PsoCharts: scatter needs an x series and a y series'); };
Object.assign(TY, { scatter: 'scatter', hist: 'hist', heat: 'heat', gauge: 'gauge', radar: 'radar' }); LEG.radar = 1;
PREP.hist = function () {
  const sp = this.spec;
    const v = this.spec.series[0].values.filter(x => x != null && isFinite(x)), lo = Math.min.apply(0, v), hi = Math.max.apply(0, v);
    const st = sp.binWidth || niceStep(hi - lo || 1, sp.bins || clamp(Math.ceil(Math.sqrt(v.length)), 4, 12)), a = Math.floor(lo / st + 1e-9) * st, nb = Math.max(1, Math.ceil((hi - a) / st - 1e-9));
    const f = fmtFactory(this.lang, Math.min(4, Math.max(0, Math.ceil(-Math.log10(st) + 1e-9)))), b = [];
    for (let i = 0; i < nb; i++) b.push({ lo: a + i * st, hi: a + (i + 1) * st, v: 0, t: f(a + i * st) + '–' + f(a + (i + 1) * st) + this.u });
    v.forEach(x => { b[Math.min(nb - 1, Math.floor((x - a) / st + 1e-9))].v++; });
    this.bins = b; this.n = v.length || 1; this.bf = f;
};
Chart.prototype.scatter = function (svg, W) {
  const sp = this.spec, [XS, YS, ZS] = sp.series, g = S('g', {}, svg), L = this.L, un = k => sp.series[k] ? sp.series[k].unit || '' : '';
  const pts = []; sp.categories.forEach((c, i) => { const x = XS.values[i], y = YS.values[i]; if (x != null && y != null) pts.push({ c, x, y, z: ZS ? ZS.values[i] : null }); });
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y), zs = pts.map(p => p.z).filter(z => z != null), zl = Math.min.apply(0, zs), zh = Math.max.apply(0, zs);
  const [xl, xh] = dom(Math.min.apply(0, xs), Math.max.apply(0, xs), 5), [yl, yh] = dom(Math.min.apply(0, ys), Math.max.apply(0, ys), 5);
  const left = 56, right = W - 24, top = 26, H2 = clamp(W * 0.7, 230, 340), bot = top + H2, X = v => left + (v - xl) / (xh - xl) * (right - left), Y = v => bot - (v - yl) / (yh - yl) * H2;
  const tx = ticks(xl, xh, W < 480 ? 4 : 6), ty = ticks(yl, yh, 5), fx = fmtFactory(this.lang, tx.dec), fy = fmtFactory(this.lang, ty.dec);
  tx.out.forEach(v => { S('line', { x1: X(v), x2: X(v), y1: top, y2: bot, class: 'pc-grid' }, g); S('text', { x: X(v), y: bot + 18, 'text-anchor': 'middle', class: 'pc-tick' }, g, fx(v)); });
  ty.out.forEach(v => { S('line', { x1: left, x2: right, y1: Y(v), y2: Y(v), class: 'pc-grid' }, g); S('text', { x: left - 6, y: Y(v) + 5, 'text-anchor': 'end', class: 'pc-tick' }, g, fy(v)); });
  S('line', { x1: left, x2: right, y1: bot, y2: bot, class: 'pc-base' }, g); S('line', { x1: left, x2: left, y1: top, y2: bot, class: 'pc-base' }, g);
  S('text', { x: (left + right) / 2, y: bot + 40, 'text-anchor': 'middle', class: 'pc-axt' }, g, XS.name + (un(0) ? ' (' + un(0).trim() + ')' : ''));
  S('text', { x: 2, y: 14, class: 'pc-axt' }, g, YS.name + (un(1) ? ' (' + un(1).trim() + ')' : ''));
  let hh = bot + 48; if (ZS) { S('text', { x: (left + right) / 2, y: bot + 62, 'text-anchor': 'middle', class: 'pc-tick' }, g, '◯ ' + L.size + ': ' + ZS.name + ' (' + this.fmt(zl) + '–' + this.fmt(zh) + (un(2) ? un(2) : '') + ')'); hh += 20; }
  const rad = p => p.z == null ? 7 : 8 + 22 * Math.sqrt(zh > zl ? (p.z - zl) / (zh - zl) : 0.5), boxes = [];
  pts.sort((p, q) => rad(q) - rad(p)).forEach((p, i) => {
    const px = X(p.x), py = Y(p.y), r = rad(p), e = S('g', { class: 'pc-mk pc-pt', style: `--d:${300 + i * 40}ms` }, g);
    S('circle', { cx: px, cy: py, r: Math.max(r, 14), class: 'pc-hit' }, e);
    S('circle', { cx: px, cy: py, r, class: ZS ? 'pc-bub pc-f0 pc-o0' : 'pc-dot pc-f0' }, e);
    const lbl = S('text', { x: px + r + 5, y: py + 5, class: 'pc-val pc-halo' }, e, p.c.label), w = lbl.getComputedTextLength();
    if (px + r + 5 + w > W - 2) { lbl.setAttribute('x', px - r - 5); lbl.setAttribute('text-anchor', 'end'); }
    const bx = +lbl.getAttribute('x') - (lbl.getAttribute('text-anchor') === 'end' ? w : 0), bb = [bx, py - 12, bx + w, py + 6];
    if (boxes.some(o => bb[0] < o[2] && bb[2] > o[0] && bb[1] < o[3] && bb[3] > o[1])) lbl.remove(); else boxes.push(bb);
    this.items.push({ el: e, x: px, y: py, v: p.y, txt: p.c.label + ': ' + XS.name + ' ' + this.fmt(p.x) + un(0) + ', ' + YS.name + ' ' + this.fmt(p.y) + un(1) + (ZS ? ', ' + ZS.name + ' ' + this.fmt(p.z) + un(2) : '') + (p.c.note ? ' – ' + p.c.note : '') });
  });
  fin(this, svg, W, hh, 'sp');
};
Chart.prototype.hist = function (svg, W) {
  const sp = this.spec, bins = this.bins, g = S('g', {}, svg), nb = bins.length, mx = Math.max.apply(0, bins.map(b => b.v)) || 1;
  const left = 46, right = W - 24, top = 30, H2 = clamp(W * 0.5, 200, 300), bot = top + H2, bw = (right - left) / nb, Y = v => bot - v / (ty.out[ty.out.length - 1] || mx) * H2;
  const ty = ticks(0, mx, 4); ty.out = ty.out.filter(Number.isInteger); if (ty.out[ty.out.length - 1] < mx) ty.out.push(Math.ceil(mx));
  ty.out.forEach(v => { S('line', { x1: left, x2: right, y1: Y(v), y2: Y(v), class: 'pc-grid' }, g); S('text', { x: left - 6, y: Y(v) + 5, 'text-anchor': 'end', class: 'pc-tick' }, g, this.fmt0(v)); });
  S('text', { x: 2, y: 14, class: 'pc-axt' }, g, this.L.count);
  const f = this.bf, edge = i => i < nb ? bins[i].lo : bins[nb - 1].hi, ml = Math.max.apply(0, bins.map(b => f(b.hi).length)), skip = Math.ceil((ml * 8.6 + 8) / bw);
  for (let i = 0; i <= nb; i++) if (i % skip === 0 || i === nb && (nb % skip) * bw > ml * 8.6 + 8) S('text', { x: left + i * bw, y: bot + 18, 'text-anchor': 'middle', class: 'pc-tick' }, g, f(edge(i)));
  S('text', { x: (left + right) / 2, y: bot + 40, 'text-anchor': 'middle', class: 'pc-axt' }, g, sp.series[0].name + (this.u ? ' (' + this.u.trim() + ')' : ''));
  S('line', { x1: left, x2: right, y1: bot, y2: bot, class: 'pc-base' }, g);
  bins.forEach((b, i) => {
    const e = S('g', { class: 'pc-mk' }, g), x = left + i * bw, h = bot - Y(b.v) < 0 ? 0 : bot - Y(b.v);
    S('rect', { x, y: top - 14, width: bw, height: H2 + 14, class: 'pc-hit' }, e);
    S('rect', { x: x + 1, y: bot - h, width: Math.max(bw - 2, 1), height: h, fill: `url(#${this.id}p0)`, class: 'pc-vbar', style: `--d:${i * 50}ms` }, e);
    S('text', { x: x + bw / 2, y: bot - h - 6, 'text-anchor': 'middle', class: 'pc-val pc-halo', style: `--d:${i * 50 + 500}ms` }, e, this.fmt0(b.v));
    this.items.push({ el: e, x: x + bw / 2, y: bot - h, v: b.v, txt: b.t + ': ' + b.v + ' (' + this.pc(b.v / this.n) + ')' });
  });
  fin(this, svg, W, bot + 50, 'seq');
};
Chart.prototype.fmt0 = function (v) { return new Intl.NumberFormat(this.lang).format(v); };
Chart.prototype.heat = function (svg, W) {
  const sp = this.spec, g = S('g', {}, svg), cs = getComputedStyle(this.host), col = n => rgb(cs.getPropertyValue(n)), bg = col('--pc-bg'), fg = col('--pc-fg'), ac = col('--pc-0');
  const NS = 6, nc = sp.series.length, labW = clamp(W * 0.28, 70, 170), cw = (W - labW - 4) / nc, ch = 40;
  let lo = Infinity, hi = -Infinity; sp.series.forEach(s => s.values.forEach(v => { if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }));
  const steps = []; for (let s = 0; s < NS; s++) {
    let t = 0.08 + 0.87 * s / (NS - 1), c, tc, n = 0;
    for (; n < 40; n++) { c = mix(bg, ac, t); const a = cr(c, fg), b = cr(c, bg); tc = a >= b ? fg : bg; if (Math.max(a, b) >= 4.5) break; t += (t < 0.5 ? -1 : 1) * 0.03; }
    steps.push([hex(c), hex(tc)]);
  }
  let hl = 1; const hs = sp.series.map((s, j) => { const t = S('g', {}, g); hl = Math.max(hl, wrap(t, labW + j * cw + cw / 2, 14, s.name, cw - 6, 3, 'middle', 'pc-tick')); return t; });
  const top = hl * 17 + 14; let y = top;
  const rows = sp.categories.map((c, i) => { const tg = S('g', { class: 'pc-lab' }, g), n = wrap(tg, 0, 0, c.label, labW - 8, 3, 'start'), rh = Math.max(ch, n * 17 + 8); const r = { y, rh, i }; tg.setAttribute('transform', `translate(0,${y + rh / 2 - (n - 1) * 8.5 + 4})`); y += rh; return r; });
  rows.forEach(r => sp.series.forEach((s, j) => {
    const v = s.values[r.i], e = S('g', { class: 'pc-mk pc-fi', style: `--d:${(r.i + j) * 40}ms` }, g), x = labW + j * cw, c = sp.categories[r.i];
    const k = v == null ? null : steps[hi > lo ? clamp(Math.floor((v - lo) / (hi - lo) * NS), 0, NS - 1) : NS >> 1];
    S('rect', { x: x + 1, y: r.y + 1, width: cw - 2, height: r.rh - 2, class: 'pc-hit pc-cell' + (k ? '' : ' pc-na'), ...(k ? { style: 'fill:' + k[0] } : {}) }, e);
    S('text', { x: x + cw / 2, y: r.y + r.rh / 2 + 5, 'text-anchor': 'middle', class: 'pc-val', style: k ? 'fill:' + k[1] : '' }, e, v == null ? this.L.na : this.fmt(v) + this.u);
    this.items.push({ el: e, row: r.i, vi: j, v, txt: c.label + ' · ' + s.name + ': ' + (v == null ? this.L.na : this.fmt(v) + this.u) + (c.note ? ' – ' + c.note : '') });
  }));
  const sw = Math.min(34, (W - labW) / (NS + 4)), ly = y + 14, tl = S('text', { x: labW - 8, y: ly + 12, 'text-anchor': 'end', class: 'pc-tick' }, g, this.fmt(lo) + this.u);
  steps.forEach((k, s) => S('rect', { x: labW + s * sw, y: ly, width: sw, height: 16, fill: k[0], class: 'pc-cell' }, g));
  S('text', { x: labW + NS * sw + 8, y: ly + 12, class: 'pc-tick' }, g, this.fmt(hi) + this.u);
  fin(this, svg, W, ly + 34, 'bars');
  if (!this.tm) {
    const f = () => { if (this.view === 'chart') this.draw(); }, mo = new MutationObserver(f), mq = matchMedia('(prefers-color-scheme:dark)');
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); mo.observe(this.host, { attributes: true, attributeFilter: ['data-pc-theme', 'data-pc-style'] }); mq.addEventListener('change', f); this.tm = { mo, mq, f };
  }
};
Chart.prototype.gauge = function (svg, W) {
  const sp = this.spec, s = sp.series[0], n = sp.categories.length, mn = sp.min != null ? sp.min : 0, mx = sp.max != null ? sp.max : 100, bands = sp.bands || [], g = S('g', {}, svg), id = this.id;
  const cols = clamp(Math.floor(W / 230), 1, n), cw = W / cols, r = Math.min(cw / 2 - 34, 120), th = Math.max(16, r * 0.2), up = th / 2 + 26, rh = r + up + 118;
  const ang = f => Math.PI * (1 - f), P = (cx, cy, rr, f) => [cx + rr * Math.cos(ang(f)), cy - rr * Math.sin(ang(f))], F = v => clamp((v - mn) / (mx - mn), 0, 1);
  const arc = (cx, cy, f0, f1) => { const [a, b] = P(cx, cy, r, f0), [c, d] = P(cx, cy, r, f1); return `M${a} ${b}A${r} ${r} 0 ${f1 - f0 > 0.5 ? 1 : 0} 1 ${c} ${d}`; };
  sp.categories.forEach((c, i) => {
    const cx = (i % cols) * cw + cw / 2, oy = Math.floor(i / cols) * rh, cy = oy + up + r, v = s.values[i], f = v == null ? 0 : F(v), e = S('g', { class: 'pc-mk' }, g);
    S('rect', { x: cx - cw / 2, y: oy, width: cw, height: rh, class: 'pc-hit' }, e);
    let bi = -1, prev = mn;
    if (bands.length) {
      bands.forEach((b, j) => { S('path', { d: arc(cx, cy, F(prev), F(b.to)), fill: 'none', stroke: `url(#${id}p${j % 6})`, 'stroke-width': th }, e); if (v != null && v >= prev && (v < b.to || j === bands.length - 1) && bi < 0) bi = j; prev = b.to;
        if (b.to < mx) { const [x1, y1] = P(cx, cy, r - th / 2 - 1, F(b.to)), [x2, y2] = P(cx, cy, r + th / 2 + 1, F(b.to)); S('line', { x1, y1, x2, y2, class: 'pc-sepl' }, e); const [lx, ly] = P(cx, cy, r + th / 2 + 12, F(b.to)); S('text', { x: lx, y: ly + 4, 'text-anchor': 'middle', class: 'pc-tick' }, e, this.fmt0(b.to)); } });
    } else {
      S('path', { d: arc(cx, cy, 0, 1), class: 'pc-track', 'stroke-width': th }, e);
      if (v != null && f > 0) S('path', { d: arc(cx, cy, 0, f), pathLength: 1, class: 'pc-line pc-s0', style: `stroke-width:${th}px;stroke-linecap:butt` }, e);
    }
    S('text', { x: cx - r, y: cy + 22, 'text-anchor': 'middle', class: 'pc-tick' }, e, this.fmt0(mn)); S('text', { x: cx + r, y: cy + 22, 'text-anchor': 'middle', class: 'pc-tick' }, e, this.fmt0(mx));
    if (v != null) { const nd = S('g', { class: 'pc-needle', style: `--a:${(f - 0.5) * 180}deg;transform-origin:${cx}px ${cy}px` }, e); S('polygon', { points: `${cx - 6},${cy} ${cx},${cy - r - th / 2 + 2} ${cx + 6},${cy}`, class: 'pc-nd' }, nd); }
    S('circle', { cx, cy, r: 9, class: 'pc-hub' }, e);
    S('text', { x: cx, y: cy + 52, 'text-anchor': 'middle', class: 'pc-val pc-big' }, e, v == null ? this.L.na : this.fmt(v) + this.u);
    let ly = cy + 74; if (bi >= 0 && bands[bi].label) { S('text', { x: cx, y: ly, 'text-anchor': 'middle', class: 'pc-val' }, e, bands[bi].label); ly += 20; }
    if (c.label) { const t = S('g', {}, e); wrap(t, cx, ly, c.label, cw - 24, 2, 'middle', 'pc-tick'); }
    this.items.push({ el: e, row: i, v, txt: c.label + ': ' + (v == null ? this.L.na : this.fmt(v) + this.u) + (bi >= 0 && bands[bi].label ? ' (' + bands[bi].label + ')' : '') + (c.note ? ' – ' + c.note : '') });
  });
  fin(this, svg, W, Math.ceil(n / cols) * rh, 'seq');
};
Chart.prototype.radar = function (svg, W) {
  const sp = this.spec, vs = vis(this), n = sp.categories.length, g = S('g', {}, svg), labW = clamp(W * 0.22, 64, 120), R = clamp((W - 2 * labW - 24) / 2, 70, 170), cx = W / 2, cy = R + 44;
  let hi = 0; vs.forEach(k => sp.series[k].values.forEach(v => { if (v != null) hi = Math.max(hi, v); }));
  const [, top] = dom(0, hi || 1, 4), tk = ticks(0, top, 4), tf = fmtFactory(this.lang, tk.dec), A = i => -Math.PI / 2 + i * 2 * Math.PI / n, P = (r, i) => [cx + r * Math.cos(A(i)), cy + r * Math.sin(A(i))];
  tk.out.filter(v => v > 0).forEach(v => S('polygon', { points: sp.categories.map((c, i) => P(v / top * R, i).join(',')).join(' '), class: 'pc-grid pc-ring' }, g));
  const ba = (A(0) + A(1)) / 2; tk.out.filter(v => v > 0).forEach(v => S('text', { x: cx + Math.cos(ba) * v / top * R + 4, y: cy + Math.sin(ba) * v / top * R + 4, class: 'pc-tick pc-halo' }, g, tf(v) + this.u));
  let up = 0;
  sp.categories.forEach((c, i) => {
    const [x, y] = P(R, i), [lx, ly] = P(R + 12, i), co = Math.cos(A(i)), si = Math.sin(A(i)), t = S('g', {}, g);
    S('line', { x1: cx, y1: cy, x2: x, y2: y, class: 'pc-grid' }, g);
    const m = wrap(t, lx, 0, c.label, labW, 2, co > 0.3 ? 'start' : co < -0.3 ? 'end' : 'middle', 'pc-axl'), ty = si < -0.3 ? ly - (m - 1) * 17 - 4 : si > 0.3 ? ly + 14 : ly + 5;
    t.setAttribute('transform', `translate(0,${ty})`); up = Math.min(up, ty - 14);
  });
  vs.forEach((k, j) => {
    const q = k % 6, s = sp.series[k], pts = sp.categories.map((c, i) => P((s.values[i] || 0) / top * R, i));
    S('polygon', { points: pts.map(p => p.join(',')).join(' '), class: 'pc-poly pc-soft pc-f' + q + ' pc-s' + q, style: `transform-origin:${cx}px ${cy}px;--d:${j * 150}ms` }, g);
    pts.forEach((p, i) => {
      const e = S('g', { class: 'pc-mk pc-pt', style: `--d:${700 + j * 100}ms` }, g), v = s.values[i], [vx, vy] = P((s.values[i] || 0) / top * R + 14, i);
      S('circle', { cx: p[0], cy: p[1], r: 16, class: 'pc-hit' }, e); marker(e, MARK[q % 4], p[0], p[1], 5, 'pc-m' + q);
      if (vs.length <= 3 && v != null) S('text', { x: vx, y: vy + 5, 'text-anchor': 'middle', class: 'pc-val pc-halo' }, e, this.fmt(v) + this.u);
      this.items.push({ el: e, x: p[0], y: p[1], v, txt: sp.categories[i].label + (sp.series.length > 1 ? ' · ' + s.name : '') + ': ' + (v == null ? this.L.na : this.fmt(v) + this.u) });
    });
  });
  fin(this, svg, W, cy + R + 40, 'seq');
};
