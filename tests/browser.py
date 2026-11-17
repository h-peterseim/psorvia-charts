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
                if 'exceptionDetails' in r: errs.append(str(r['exceptionDetails'])[:200])
                return r.get('result', {}).get('value')
            async def key(k, code=None, vk=0):
                for t in ('keyDown', 'keyUp'): await cmd('Input.dispatchKeyEvent', type=t, key=k, code=code or k, windowsVirtualKeyCode=vk)
            await cmd('Runtime.enable'); await cmd('Page.enable')
            async def load(w=1100, h=900, scheme='light', reduce=False, mobile=False):
                await cmd('Emulation.setDeviceMetricsOverride', width=w, height=h, deviceScaleFactor=1, mobile=mobile)
                await cmd('Emulation.setEmulatedMedia', features=[{'name': 'prefers-color-scheme', 'value': scheme}, {'name': 'prefers-reduced-motion', 'value': 'reduce' if reduce else 'no-preference'}])
                await cmd('Page.navigate', url=url); await asyncio.sleep(1.2)
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
                      return {bg:g('--pc-bg'),fg:g('--pc-fg'),mut:g('--pc-mut'),s:[0,1,2,3].map(function(i){return g('--pc-'+i)}),good:g('--pc-good'),bad:g('--pc-bad'),cur:g('--pc-cur')}})()""")
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
            # --- Fotos + reduziert
            for scheme in ('light', 'dark'):
                await load(scheme=scheme)
                for st in STY:
                    await setsel('st', st); await settle()
                    if a.photos and (st in ('house', 'gauge') or True): await shot(f'{st}-{"hell" if scheme == "light" else "dunkel"}.png')
            await load(scheme='light', reduce=True); await settle()
            red = await js("""(function(){var b=document.querySelector('.pc-bar'),s=getComputedStyle(b),v=document.querySelector('.pc-val');return [s.animationName,s.transform,getComputedStyle(v).opacity]})()""")
            ok(red[0] == 'none' and red[2] == '1' and 'matrix(0' not in red[1], f'reduzierte Bewegung: {red}')
            if a.photos: await shot('house-reduziert.png')
            await load(w=390, h=800, scheme='light', mobile=True); await settle()
            ok(await js("document.documentElement.scrollWidth<=392"), 'kein waagerechtes Scrollen am Handy')
            if a.photos: await shot('house-handy.png', 390)
            ok(not errs, f'Skriptfehler: {errs[:3]}')
    finally:
        p.terminate(); shutil.rmtree(tmp, ignore_errors=True)
        if srv: srv.shutdown()
asyncio.run(main())
print('FEHLER', len(fails)) if fails else print('alle Pruefungen gruen'); sys.exit(1 if fails else 0)
