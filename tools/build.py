#!/usr/bin/env python3
"""Baut psorvia-charts.esm.js / psorvia-charts.js / psorvia-charts.css aus src/ (nur Kommentar- und Leerraum-Entfernung, keine Fremdwerkzeuge)."""
import re, os, gzip
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def strip_js(s):
    head = s.split('\n', 1)[0]
    out = []
    for l in s.split('\n')[1:]:
        t = l.strip()
        if not t or t.startswith('//') or (t.startswith('/*') and t.endswith('*/')): continue
        t = re.sub(r'\s+//\s[^\'"`]*$', '', t) if re.search(r'\s//\s', t) and not re.search(r'[\'"`/].*\s//\s', t) else t
        out.append(t)
    return head + '\n' + '\n'.join(out) + '\n'
def strip_css(s):
    head = s.split('\n', 1)[0]
    body = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    body = re.sub(r'\n\s*', '', body)
    body = re.sub(r'\s*([{};,>])\s*', r'\1', body).replace(';}', '}')
    return head + '\n' + body + '\n'
js = open(f'{R}/src/psorvia-charts.src.js').read()
esm = strip_js(js)
classic = re.sub(r'\bexport (function|const)\b', r'\1', esm)
exports = 'create,auto,read,fromLd,fromTable,version,kit'
classic = '(function(g){\n' + classic.replace('\n', '\n', 1) + f'g.PsoCharts={{{exports.replace(",", ",")}}};\n}})(typeof window!=="undefined"?window:this);\n'
open(f'{R}/psorvia-charts.esm.js', 'w').write(esm)
open(f'{R}/psorvia-charts.js', 'w').write(classic)
open(f'{R}/psorvia-charts.css', 'w').write(strip_css(open(f'{R}/src/psorvia-charts.css').read()))
xs = strip_js(open(f'{R}/src/psorvia-charts.extra.src.js').read())
open(f'{R}/psorvia-charts.extra.esm.js', 'w').write(xs.split('\n', 1)[0] + "\nimport { kit } from './psorvia-charts.esm.js';\n" + xs.split('\n', 1)[1])
open(f'{R}/psorvia-charts.extra.js', 'w').write('(function(g){\n' + xs.split('\n', 1)[0] + '\nconst kit=g.PsoCharts.kit;\n' + xs.split('\n', 1)[1] + '})(typeof window!=="undefined"?window:this);\n')
tot = 0
for f in ('psorvia-charts.esm.js', 'psorvia-charts.js', 'psorvia-charts.css', 'psorvia-charts.extra.esm.js', 'psorvia-charts.extra.js'):
    b = open(f'{R}/{f}', 'rb').read(); g = len(gzip.compress(b, 9)); print(f, len(b), 'B', g, 'B gz')
    if f in ('psorvia-charts.js', 'psorvia-charts.css'): tot += g
print('Kern (Skript + CSS) gz:', tot, 'B')
