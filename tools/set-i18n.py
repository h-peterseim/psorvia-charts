#!/usr/bin/env python3
"""Schreibt die Demo-Texte aus <ordner>/<code>.json (je Sprache ein Objekt, Schluessel wie en.json) in demo.html.
  python3 tools/set-i18n.py <ordner>"""
import sys, os, json, re, glob
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = {}
for f in sorted(glob.glob(os.path.join(sys.argv[1], '*.json'))):
    d[os.path.basename(f)[:-5]] = json.load(open(f, encoding='utf-8'))
order = ['en', 'de'] + sorted(k for k in d if k not in ('en', 'de'))
d = {k: d[k] for k in order if k in d}
p = os.path.join(R, 'demo.html'); s = open(p, encoding='utf-8').read()
s = re.sub(r'(<script type="application/json" id="i18n">).*?(</script>)', lambda m: m.group(1) + json.dumps(d, ensure_ascii=False) + m.group(2), s, flags=re.S)
open(p, 'w', encoding='utf-8').write(s); print(len(d), 'Sprachen')
