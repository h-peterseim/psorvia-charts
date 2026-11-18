#!/usr/bin/env python3
"""Browser-Tests von PSOrvia Charts (headless Chromium ueber CDP, Python-Paket websockets).
  python3 tests/browser.py [--photos <ordner>] [--url <seite>]   ohne --url: demo.html aus diesem Ordner
Prueft: keine Skriptfehler, Kontraste der Tokens (4 Stile x hell/dunkel), Schrift >= 13 px, Tastatur (Tab, Pfeile, aria-live,
sichtbarer Fokus), Umschalter Diagramm/Tabelle, reduzierte Bewegung (Marken stehen sofort). Mit --photos je Stil hell/dunkel/reduziert."""
import sys, os, json, asyncio, subprocess, time, base64, argparse, tempfile, threading, shutil, urllib.request, http.server, functools, socket
import websockets
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--photos'); ap.add_argument('--url'); a = ap.parse_args()
def free():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p
fails = []
def ok(c, m):
    if not c: fails.append(m); print('FAIL', m)
def lum(h):
    h = h.lstrip('#'); h = ''.join(x * 2 for x in h) if len(h) == 3 else h; c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]; return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def ratio(a_, b_):
    x, y = sorted((lum(a_), lum(b_)), reverse=True); return (x + .05) / (y + .05)
import re, glob
for _f in ['README.md'] + glob.glob(R + '/docs/i18n/README.*.md'):
    _p = _f if os.path.isabs(_f) else os.path.join(R, _f)
    ok(not re.search(r'!\[|\.webp|\.png|\.gif|<img', open(_p, encoding='utf-8').read()), f'{os.path.basename(_p)} verweist auf ein Bild')
async def main():
    srv = None
    url = a.url
    if not url:
        port = free()
        class Q(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *x): pass
        h = functools.partial(Q, directory=R)
        srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
        url = f'http://127.0.0.1:{port}/demo.html'
    cport = free(); tmp = tempfile.mkdtemp()
    p = subprocess.Popen(['chromium', '--headless=new', '--no-sandbox', '--disable-gpu', f'--remote-debugging-port={cport}', f'--user-data-dir={tmp}', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try: ws = [t for t in json.load(urllib.request.urlopen(f'http://127.0.0.1:{cport}/json')) if t['type'] == 'page'][0]['webSocketDebuggerUrl']; break
            except Exception: time.sleep(.3)
        async with websockets.connect(ws, max_size=None) as c:
            n = 0; errs = []
            async def cmd(m, **kw):
                nonlocal n; n += 1; i = n; await c.send(json.dumps({'id': i, 'method': m, 'params': kw}))
                while True:
                    r = json.loads(await c.recv())
                    if r.get('method') == 'Runtime.exceptionThrown': errs.append(r['params']['exceptionDetails'].get('exception', {}).get('description', 'exception'))
                    if r.get('method') == 'Runtime.consoleAPICalled' and r['params']['type'] == 'error': errs.append('console.error')
                    if r.get('id') == i: return r.get('result', {})
            async def js(e):
                r = await cmd('Runtime.evaluate', expression=e, awaitPromise=True, returnByValue=True)
                if 'exceptionDetails' in r: errs.append(r['exceptionDetails'].get('exception', {}).get('description', str(r['exceptionDetails']))[:300])
                return r.get('result', {}).get('value')
            async def key(k, code=None, vk=0):
                for t in ('keyDown', 'keyUp'): await cmd('Input.dispatchKeyEvent', type=t, key=k, code=code or k, windowsVirtualKeyCode=vk)
            await cmd('Runtime.enable'); await cmd('Page.enable')
            async def load(w=1100, h=900, scheme='light', reduce=False, mobile=False):
                await cmd('Emulation.setDeviceMetricsOverride', width=w, height=h, deviceScaleFactor=1, mobile=mobile)
                await cmd('Emulation.setEmulatedMedia', features=[{'name': 'prefers-color-scheme', 'value': scheme}, {'name': 'prefers-reduced-motion', 'value': 'reduce' if reduce else 'no-preference'}])
                await cmd('Page.navigate', url=url); await asyncio.sleep(1.2)
                for _ in range(60):
                    if await js("document.readyState==='complete'&&!!document.getElementById('st')"): break
                    await asyncio.sleep(.25)
            async def setsel(i, v):
                await js(f"(function(){{var s=document.getElementById('{i}');s.value='{v}';s.dispatchEvent(new Event('change'))}})()"); await asyncio.sleep(.3)
            async def settle():
                await js("window.scrollTo(0,0)"); await asyncio.sleep(.2)
                H = await js("document.body.scrollHeight")
                for y in range(0, H, 500): await js(f"window.scrollTo(0,{y})"); await asyncio.sleep(.15)
                await js("window.scrollTo(0,0)"); await asyncio.sleep(1.8)
            async def shot(name, w=1100):
                H = await js("document.documentElement.scrollHeight")
                r = await cmd('Page.captureScreenshot', format='png', captureBeyondViewport=True, clip={'x': 0, 'y': 0, 'width': w, 'height': H, 'scale': 1})
                open(os.path.join(a.photos, name), 'wb').write(base64.b64decode(r['data']))
            if a.photos: os.makedirs(a.photos, exist_ok=True)
            STY = ['house', 'gauge', 'plain', 'genre']
            # --- Kontraste und Schrift (alle Stile, beide Schemata)
            for scheme in ('light', 'dark'):
                await load(scheme=scheme)
                for st in STY:
                    await setsel('st', st)
                    v = await js("""(function(){var e=document.querySelector('.pc'),s=getComputedStyle(e),g=function(k){return s.getPropertyValue(k).trim()};
                      return {bg:g('--pc-bg'),fg:g('--pc-fg'),mut:g('--pc-mut'),s:[0,1,2,3,4,5].map(function(i){return g('--pc-'+i)}),good:g('--pc-good'),bad:g('--pc-bad'),cur:g('--pc-cur')}})()""")
                    ok(ratio(v['fg'], v['bg']) >= 4.5, f'{st}/{scheme}: Text/Grund {ratio(v["fg"], v["bg"]):.2f}')
                    ok(ratio(v['mut'], v['bg']) >= 4.5, f'{st}/{scheme}: Grauton {ratio(v["mut"], v["bg"]):.2f}')
                    for i, col in enumerate(v['s']): ok(ratio(col, v['bg']) >= 3, f'{st}/{scheme}: Reihe {i} {ratio(col, v["bg"]):.2f}')
                    ok(ratio(v['good'], v['bg']) >= 3 and ratio(v['bad'], v['bg']) >= 3, f'{st}/{scheme}: Kachelrand')
                    ok(ratio(v['cur'], v['bg']) >= 3, f'{st}/{scheme}: Auswahlrand')
                    print(f'{st:6} {scheme:5} Text {ratio(v["fg"], v["bg"]):.1f}  Grau {ratio(v["mut"], v["bg"]):.1f}  Reihen ' + ' '.join(f'{ratio(c_, v["bg"]):.1f}' for c_ in v['s']))
            small = await js("""(function(){var bad=[];document.querySelectorAll('.pc text,.pc p,.pc button,.pc td,.pc th,.pc li,.pc span,.pc b').forEach(function(e){if(e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<13)bad.push(e.className.baseVal||e.className||e.tagName)});return bad})()""")
            ok(not small, f'Schrift < 13 px: {small}')
            # --- Tastatur
            await load(scheme='light'); await setsel('st', 'house'); await settle()
            for _ in range(40):
                await key('Tab', 'Tab', 9)
                if await js("document.activeElement.className=='pc-plot'"): break
            foc = await js("(function(){var s=getComputedStyle(document.activeElement);return [document.activeElement.className,s.outlineStyle,s.outlineWidth]})()")
            ok(foc[0] == 'pc-plot' and foc[1] != 'none' and float(foc[2][:-2]) >= 2, f'Fokusring: {foc}')
            before = await js("document.querySelector('.pc-read').textContent")
            await key('ArrowDown', 'ArrowDown', 40); await key('ArrowRight', 'ArrowRight', 39)
            r1 = await js("document.querySelector('.pc-read').textContent"); await key('ArrowDown', 'ArrowDown', 40)
            r2 = await js("document.querySelector('.pc-read').textContent")
            ok(r1 != before and r2 != r1 and ':' in r2, f'Pfeiltasten melden Werte: {before!r} {r1!r} {r2!r}')
            ok(await js("document.querySelector('.pc-read').getAttribute('aria-live')") == 'polite', 'aria-live')
            ok(await js("document.querySelectorAll('.pc-cur').length") == 1, 'genau eine Auswahl')
            await key('Escape', 'Escape', 27)
            ok(await js("document.querySelectorAll('.pc-cur').length") == 0, 'Escape hebt Auswahl auf')
            await key('Home', 'Home', 36); await key('End', 'End', 35)
            ok(await js("document.querySelectorAll('.pc-cur').length") == 1, 'Home/End')
            ok(await js("!!document.querySelector('.pc svg[role=img][aria-label]')"), 'role=img + aria-label')
            ok(await js("document.querySelectorAll('.pc-view button').length") >= 10, 'Umschalter vorhanden')
            await js("document.querySelectorAll('.pc-view button')[1].click()"); await asyncio.sleep(.2)
            ok(await js("(function(){var t=document.querySelector('.pc .pc-tablewrap');return !t.hidden&&t.querySelectorAll('tbody tr').length>=3&&!!t.querySelector('th[scope=row]')})()"), 'Tabellenansicht')
            await js("document.querySelectorAll('.pc-view button')[0].click()"); await asyncio.sleep(.3)
            ok(await js("!!document.querySelector('.pc svg.pc-svg')"), 'zurueck zum Diagramm')
            await js("document.querySelector('.pc-legend button').click()"); await asyncio.sleep(.3)
            ok(await js("document.querySelector('.pc-legend button').getAttribute('aria-pressed')") == 'false', 'Legende schaltet')
            ok(await js("document.getElementById('c_tab').querySelector('.pc-title')!==null && document.getElementById('c_ld').querySelectorAll('.pc-bar').length>0"), 'Quellen JSON-LD und HTML-Tabelle')
            # --- neue Typen: Zeichnen, Tastatur, Tabelle, Quellen, Kontrast der Zellen, Ueberlauf
            NEW = ['n_pie', 'n_donut', 'n_stack', 'n_pct', 'n_area', 'n_sarea', 'n_scatter', 'n_bubble', 'n_hist', 'n_gauge', 'n_heat', 'n_radar']
            async def overflow(tag):
                bad = await js("""(function(){var out=[];document.querySelectorAll('#more .pc-svg').forEach(function(s){var r=s.getBoundingClientRect();
                  s.querySelectorAll('text').forEach(function(t){var b=t.getBoundingClientRect();if(b.width&&(b.left<r.left-2||b.right>r.right+2))out.push(s.parentNode.parentNode.id+':'+t.textContent.slice(0,12))})});return out})()""")
                ok(not bad, f'Text ausserhalb des Diagramms ({tag}): {bad[:4]}')
            for scheme in ('light', 'dark'):
                await load(scheme=scheme)
                for st in STY:
                    await setsel('st', st); await settle()
                    for i in NEW:
                        n_ = await js(f"document.querySelectorAll('#{i} .pc-mk').length")
                        ok(n_ and n_ >= 2, f'{i} {st}/{scheme}: Marken {n_}')
                    await overflow(f'{st}/{scheme}')
                    mins = await js("""(function(){var bad=[];document.querySelectorAll('#more .pc-svg text').forEach(function(t){var fs=parseFloat(getComputedStyle(t).fontSize);if(fs<13)bad.push(t.textContent)});return bad})()""")
                    ok(not mins, f'Schrift < 13 px {st}/{scheme}: {mins[:3]}')
                    # Kontrast der Zahlentexte: Heatmap-Zellen und Segmenttexte gegen ihren Grund
                    cells = await js("""(function(){var o=[];document.querySelectorAll('#n_heat .pc-hit.pc-cell').forEach(function(c){var t=c.parentNode.querySelector('text');if(c.style.fill&&t)o.push([getComputedStyle(c).fill,getComputedStyle(t).fill])});return o})()""")
                    for f, t in cells:
                        import re as _re
                        tt = '#%02x%02x%02x' % tuple(int(x) for x in _re.findall(r'\d+', t)[:3]); f = '#%02x%02x%02x' % tuple(int(x) for x in _re.findall(r'\d+', f)[:3])
                        ok(ratio(f, tt) >= 4.5, f'Heatmap-Zelle {st}/{scheme}: {f} {tt} {ratio(f, tt):.2f}')
                    if a.photos and scheme and st in STY:
                        for i in NEW:
                            r = await js(f"(function(){{var r=document.getElementById('{i}').getBoundingClientRect();return [r.left,r.top+scrollY,r.width,r.height]}})()")
                            res = await cmd('Page.captureScreenshot', format='png', captureBeyondViewport=True, clip={'x': r[0], 'y': r[1], 'width': r[2], 'height': r[3], 'scale': 1})
                            open(os.path.join(a.photos, f'{i[2:]}-{st}-{"hell" if scheme == "light" else "dunkel"}.png'), 'wb').write(base64.b64decode(res['data']))
            # Tastatur und Tabelle je neuer Typ
            await load(scheme='light'); await setsel('st', 'house'); await settle()
            for i in NEW:
                await js(f"document.querySelector('#{i} .pc-plot').scrollIntoView({{block:'center'}});document.querySelector('#{i} .pc-plot').focus()"); await asyncio.sleep(.4)
                reads = []
                for kk, vk in (('ArrowRight', 39), ('ArrowRight', 39), ('ArrowDown', 40), ('ArrowLeft', 37)):
                    await key(kk, kk, vk); reads.append(await js(f"document.querySelector('#{i} .pc-read').textContent"))
                ok(len(set(reads)) >= 2 and all(reads), f'{i}: Pfeiltasten melden Werte {reads}')
                ok(await js(f"document.querySelectorAll('#{i} .pc-cur').length") == 1, f'{i}: genau eine Auswahl')
                await key('Escape', 'Escape', 27)
                ok(await js(f"document.querySelectorAll('#{i} .pc-cur').length") == 0, f'{i}: Escape')
                await js(f"document.querySelectorAll('#{i} .pc-view button')[1].click()"); await asyncio.sleep(.2)
                ok(await js(f"(function(){{var t=document.querySelector('#{i} .pc-tablewrap');return !t.hidden&&t.querySelectorAll('tbody tr').length>=2&&!!t.querySelector('th[scope=row]')}})()"), f'{i}: Tabellenansicht')
                await js(f"document.querySelectorAll('#{i} .pc-view button')[0].click()"); await asyncio.sleep(.3)
            # Ring/Torte mit langen Beschriftungen: kein Text ausserhalb des Diagrammkastens, Schrift >= 13 px, bei allen Breiten
            for w_ in (360, 390, 768, 1100, 1440):
                await load(w=w_, scheme='light', mobile=w_ < 500)
                bad = await js("""(function(){var out=[],L=['Glocken, Platten und gestimmtes Schlagwerk','Holzblasinstrumente','Blechblasinstrumente','Freie Zungen und Lamellen','Gestrichene Saiten','Supercalifragilisticexpialidocious-Instrumente'];
                  ['pie','donut'].forEach(function(ty){var box=document.createElement('div');box.style.cssText='width:'+Math.min(innerWidth-32,620)+'px;margin:0';document.body.appendChild(box);
                    PsoCharts.create(box,{type:ty,title:'T',categories:L.map(function(l){return{label:l}}),series:[{name:'S',values:[31,44,18,39,17,9]}],maxSlices:12,other:false,motion:'off'});
                    var r=box.getBoundingClientRect();box.querySelectorAll('svg.pc-svg text').forEach(function(t){var b=t.getBoundingClientRect(),fs=parseFloat(getComputedStyle(t).fontSize);
                      if(b.width&&(b.left<r.left-1||b.right>r.right+1))out.push(ty+':'+Math.round(r.width)+':'+t.textContent.slice(0,14));if(fs<13)out.push('klein:'+t.textContent.slice(0,10))});box.remove()});return out})()""")
                ok(not bad, f'Ring/Torte lange Beschriftungen bei {w_} px: {bad[:4]}')
            # Sparkline: Tastatur
            await js("var sp=document.querySelector('#p_spark .pc-spark');sp.scrollIntoView();sp.focus()"); await asyncio.sleep(.3)
            await key('ArrowLeft', 'ArrowLeft', 37)
            ok(await js("document.querySelector('#p_spark [aria-live]').textContent.length>0"), 'Sparkline: aria-live')
            ok(await js("!!document.querySelector('#p_spark table')"), 'Sparkline: Tabelle')
            # alle drei Quellen je Typ gleich viele Marken
            src = await js("""(async function(){
              var pend=[];var specs={pie:{type:'pie',categories:[{label:'A'},{label:'B'},{label:'C'}],series:[{name:'S',values:[3,2,1]}]},
                donut:{type:'donut',categories:[{label:'A'},{label:'B'},{label:'C'}],series:[{name:'S',values:[3,2,1]}]},
                stacked:{type:'stacked',categories:[{label:'A'},{label:'B'}],series:[{name:'S',values:[3,2]},{name:'T',values:[1,2]}]},
                percent:{type:'percent',categories:[{label:'A'},{label:'B'}],series:[{name:'S',values:[3,2]},{name:'T',values:[1,2]}]},
                area:{type:'area',stacked:true,categories:[{label:'A'},{label:'B'},{label:'C'}],series:[{name:'S',values:[3,2,4]},{name:'T',values:[1,2,3]}]},
                scatter:{type:'scatter',categories:[{label:'A'},{label:'B'},{label:'C'}],series:[{name:'X',values:[1,2,3]},{name:'Y',values:[3,1,2]},{name:'Z',values:[5,6,7]}]},
                hist:{type:'hist',categories:[{label:'a'},{label:'b'},{label:'c'},{label:'d'},{label:'e'},{label:'f'}],series:[{name:'V',values:[1,2,2,3,5,8]}]},
                gauge:{type:'gauge',min:0,max:10,categories:[{label:'A'},{label:'B'}],series:[{name:'V',values:[3,7]}]},
                heat:{type:'heat',categories:[{label:'A'},{label:'B'}],series:[{name:'S',values:[3,2]},{name:'T',values:[1,null]}]},
                radar:{type:'radar',categories:[{label:'A'},{label:'B'},{label:'C'}],series:[{name:'S',values:[3,2,4]}]}};
              var res={};
              Object.keys(specs).forEach(function(k){var sp=specs[k],out=[];
                var a=document.createElement('div');document.body.appendChild(a);a.style.width='700px';PsoCharts.create(a,JSON.parse(JSON.stringify(sp)));
                var ld={'@context':'https://schema.org','@type':'Dataset','name':'t',variableMeasured:sp.series.map(function(s){return{'@type':'PropertyValue',name:s.name,valueReference:s.values.map(function(v,i){return{'@type':'PropertyValue',name:sp.categories[i].label,value:v}})}})};
                var sc=document.createElement('script');sc.type='application/ld+json';sc.id='ld_'+k;sc.textContent=JSON.stringify(ld);document.body.appendChild(sc);
                var b=document.createElement('div');b.style.width='700px';document.body.appendChild(b);b.setAttribute('data-pso-chart',JSON.stringify({type:sp.type,stacked:sp.stacked,min:sp.min,max:sp.max,title:'t'}));b.setAttribute('data-chart-source','#ld_'+k);
                var tb=document.createElement('table');tb.id='tb_'+k;tb.innerHTML='<thead><tr><th></th>'+sp.series.map(function(s){return'<th scope=col>'+s.name+'</th>'}).join('')+'</tr></thead><tbody>'+sp.categories.map(function(c,i){return'<tr><th scope=row>'+c.label+'</th>'+sp.series.map(function(s){return'<td data-value="'+(s.values[i]==null?'':s.values[i])+'"></td>'}).join('')+'</tr>'}).join('')+'</tbody>';document.body.appendChild(tb);
                var c=document.createElement('div');c.style.width='700px';document.body.appendChild(c);c.setAttribute('data-pso-chart',JSON.stringify({type:sp.type,stacked:sp.stacked,min:sp.min,max:sp.max,title:'t'}));c.setAttribute('data-chart-source','#tb_'+k);
                PsoCharts.auto(document.body);
                pend.push([k,a,b,c,tb,sc])});
              await new Promise(function(r){setTimeout(r,700)});
              pend.forEach(function(q){res[q[0]]=[q[1],q[2],q[3]].map(function(x){return x.querySelectorAll('.pc-mk').length});[q[1],q[2],q[3],q[4],q[5]].forEach(function(x){x.remove()})});
              return res})()""")
            await asyncio.sleep(.5)
            for k, v in src.items(): ok(v[0] > 0 and v[0] == v[1] == v[2], f'Quellen {k}: JSON/JSON-LD/Tabelle {v}')
            # Grenzen
            lim = await js("""(async function(){var o=[];try{PsoCharts.create(document.createElement('div'),{type:'radar',categories:[1,2,3,4,5,6,7,8,9].map(function(i){return{label:''+i}}),series:[{name:'a',values:[1,2,3,4,5,6,7,8,9]}]});o.push('keine Sperre')}catch(e){o.push('ok')}
              var p=document.createElement('div');p.style.width='700px';document.body.appendChild(p);PsoCharts.create(p,{type:'pie',categories:[1,2,3,4,5,6].map(function(i){return{label:'k'+i}}),series:[{name:'a',values:[1,2,3,4,5,6]}]});
              var q=document.createElement('div');q.style.width='700px';document.body.appendChild(q);PsoCharts.create(q,{type:'pie',categories:[1,2,3,4,5,6,7].map(function(i){return{label:'k'+i}}),series:[{name:'a',values:[1,2,3,4,5,6,7]}]});await new Promise(function(r){setTimeout(r,600)});o.push(p.querySelectorAll('.pc-mk').length);o.push(q.querySelectorAll('.pc-mk').length);o.push(/Other/.test(q.textContent));p.remove();q.remove();return o})()""")
            ok(lim == ['ok', 6, 6, True], f'Radar-Grenze / Sonstiges ab 7: {lim}')
            # --- Fotos + reduziert
            for scheme in ('light', 'dark'):
                await load(scheme=scheme)
                for st in STY:
                    await setsel('st', st); await settle()
                    if a.photos and (st in ('house', 'gauge') or True): await shot(f'{st}-{"hell" if scheme == "light" else "dunkel"}.png')
            await load(scheme='light', reduce=True); await settle()
            red = await js("""(function(){var b=document.querySelector('.pc-bar'),s=getComputedStyle(b),v=document.querySelector('.pc-val');return [s.animationName,s.transform,getComputedStyle(v).opacity]})()""")
            ok(red[0] == 'none' and red[2] == '1' and 'matrix(0' not in red[1], f'reduzierte Bewegung: {red}')
            rn = await js("""(function(){var bad=[];document.querySelectorAll('#more .pc-fi,#more .pc-pt,#more .pc-val').forEach(function(e){if(getComputedStyle(e).opacity!=='1')bad.push(e.getAttribute('class'))});
              document.querySelectorAll('#more .pc-sw').forEach(function(e){if(parseFloat(getComputedStyle(e).strokeDashoffset)!==0)bad.push('sw')});
              document.querySelectorAll('#more .pc-vbar,#more .pc-area,#more .pc-poly').forEach(function(e){var t=getComputedStyle(e).transform;if(t!=='none'&&/matrix\\(0|matrix\\([^,]+, [^,]+, [^,]+, 0,/.test(t))bad.push('t '+t)});
              document.querySelectorAll('#more .pc-needle').forEach(function(e){if(getComputedStyle(e).animationName!=='none')bad.push('needle')});return bad.slice(0,5)})()""")
            ok(not rn, f'reduzierte Bewegung bei neuen Typen: {rn}')
            if a.photos: await shot('house-reduziert.png')
            await load(w=390, h=800, scheme='light', mobile=True); await settle()
            ok(await js("document.documentElement.scrollWidth<=392"), 'kein waagerechtes Scrollen am Handy')
            if a.photos: await shot('house-handy.png', 390)
            await load(w=390, h=800, scheme='light', mobile=True); await settle(); await overflow('Handy')
            if a.photos:
                for i in NEW:
                    r = await js(f"(function(){{var r=document.getElementById('{i}').getBoundingClientRect();return [r.left,r.top+scrollY,r.width,r.height]}})()")
                    res = await cmd('Page.captureScreenshot', format='png', captureBeyondViewport=True, clip={'x': r[0], 'y': r[1], 'width': r[2], 'height': r[3], 'scale': 1})
                    open(os.path.join(a.photos, f'{i[2:]}-handy.png'), 'wb').write(base64.b64decode(res['data']))
            # --- Achsenbeschriftungen duerfen sich bei schmaler Breite nicht ueberlappen (Balken mit Prozent-Einheit)
            for w in (360, 390):
                await load(w=w, h=800, scheme='light', mobile=True)
                r = await js("""(async function(){var m=await import('./psorvia-charts.esm.js');var h=document.createElement('div');document.body.prepend(h);
                  m.create(h,{type:'bars',baseline:100,baselineLabel:'SQLite = 100 %',unit:' %',digits:0,sides:['Base schneller','Base langsamer'],title:'t',
                  categories:[{label:'Punktlesen nach Schluessel'},{label:'Aggregation'}],series:[{name:'x',values:[72,30]},{name:'y',values:[87,109]}]});
                  await new Promise(function(r){setTimeout(r,1500)});var t=[].slice.call(h.querySelectorAll('.pc-tick')).map(function(e){var b=e.getBoundingClientRect();return [b.left,b.right,getComputedStyle(e).fontSize]});
                  var sd=[].slice.call(h.querySelectorAll('.pc-side')).map(function(e){return e.getBoundingClientRect()});var sb=0;for(var a=0;a<sd.length;a++)for(var b=a+1;b<sd.length;b++)if(sd[a].left<sd[b].right-1&&sd[b].left<sd[a].right-1&&sd[a].top<sd[b].bottom-1&&sd[b].top<sd[a].bottom-1)sb++;t.sort(function(x,y){return x[0]-y[0]});var bad=sb;for(var i=1;i<t.length;i++)if(t[i][0]<t[i-1][1]+4)bad++;return {n:t.length,bad:bad,fs:Math.min.apply(0,t.map(function(x){return parseFloat(x[2])}))}})()""")
                print('ticks', w, r); ok(r and r['n'] >= 2 and r['bad'] == 0, f'Achsenmarken ueberlappen bei {w} px: {r}')
                ok(r and r['fs'] >= 13, f'Achsenschrift unter 13 px bei {w} px: {r}')
            # --- Randfaelle: leere, nicht endliche und Text-Werte duerfen weder werfen noch NaN/null/undefined anzeigen
            await load(w=900, h=800, scheme='light')
            r = await js("""(async function(){var m=await import('./psorvia-charts.esm.js');await import('./psorvia-charts.extra.esm.js');var C=[{label:'A'},{label:'B'},{label:'C'}],out=[];
              var cs=[{type:'bars',categories:C},{type:'bars',categories:C,series:[{name:'x',values:[NaN,'3','a']}]},{type:'lines',categories:C,series:[{name:'x',values:[null,null,null]}]},
               {type:'hist',values:[]},{type:'hist',values:Array.from({length:200000},function(_,i){return Math.sin(i)*50})},{type:'spark',values:[]},{type:'spark',values:[1,NaN,3]},
               {type:'tiles',items:[{label:'a',value:NaN},{label:'b',value:null}]},{type:'tiles'},{type:'pie',categories:C,series:[{name:'x',values:[0,0,0]}]},
               {type:'scatter',categories:[],series:[{name:'x',values:[]},{name:'y',values:[]}]},{type:'gauge',categories:C,series:[{name:'x',values:[null,NaN,50]}]}];
              cs.forEach(function(c,i){var h=document.createElement('div');document.body.prepend(h);try{m.create(h,c,{motion:'off'})}catch(e){out.push(i+' wirft '+e.message)}});
              await new Promise(function(r){setTimeout(r,1500)});
              cs.forEach(function(c,i){});[].slice.call(document.querySelectorAll('.pc')).slice(0,cs.length).forEach(function(h){var t=h.textContent;if(/NaN|Infinity|undefined|\bnull\b/.test(t))out.push(h.getAttribute('data-pc-type')+' zeigt '+(t.match(/.{0,15}(NaN|Infinity|undefined|null).{0,8}/)||[''])[0])});
              return out})()""")
            ok(r == [], f'Randfaelle: {r}')
            ok(not errs, f'Skriptfehler: {errs[:3]}')
    finally:
        p.terminate(); shutil.rmtree(tmp, ignore_errors=True)
        if srv: srv.shutdown()
asyncio.run(main())
print('FEHLER', len(fails)) if fails else print('alle Pruefungen gruen'); sys.exit(1 if fails else 0)
