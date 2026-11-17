#!/usr/bin/env python3
"""Prueft index.html (Demoseite): keine Skriptfehler, kein waagerechtes Scrollen bei 360 px, Schrift >= 13 px, Sprachwahl, Kopieren; Fotos hell/dunkel, Desktop/Handy.
  python3 tests/pages.py [<fotoordner>]"""
import sys, os, json, asyncio, subprocess, time, base64, tempfile, threading, shutil, urllib.request, http.server, functools, socket
import websockets
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT=sys.argv[1] if len(sys.argv)>1 else tempfile.mkdtemp()
os.makedirs(OUT,exist_ok=True)
def free():
    s=socket.socket(); s.bind(('127.0.0.1',0)); p=s.getsockname()[1]; s.close(); return p
async def main():
    port=free()
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*x): pass
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',port),functools.partial(Q,directory=R)); threading.Thread(target=srv.serve_forever,daemon=True).start()
    cport=free(); tmp=tempfile.mkdtemp()
    p=subprocess.Popen(['chromium','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={cport}',f'--user-data-dir={tmp}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    fails=[]
    try:
        for _ in range(60):
            try: ws=[t for t in json.load(urllib.request.urlopen(f'http://127.0.0.1:{cport}/json')) if t['type']=='page'][0]['webSocketDebuggerUrl']; break
            except Exception: time.sleep(.3)
        async with websockets.connect(ws,max_size=None) as c:
            n=0; errs=[]
            async def cmd(m,**kw):
                nonlocal n; n+=1; i=n; await c.send(json.dumps({'id':i,'method':m,'params':kw}))
                while True:
                    r=json.loads(await c.recv())
                    if r.get('method')=='Runtime.exceptionThrown': errs.append(r['params']['exceptionDetails'].get('exception',{}).get('description','exc'))
                    if r.get('method')=='Runtime.consoleAPICalled' and r['params']['type']=='error': errs.append('console.error '+str(r['params']['args'])[:150])
                    if r.get('id')==i: return r.get('result',{})
            async def js(e):
                r=await cmd('Runtime.evaluate',expression=e,awaitPromise=True,returnByValue=True); return r.get('result',{}).get('value')
            await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument',source="try{localStorage.removeItem('pc-index')}catch(e){}")
            for name,w,h,scheme,mob in [('desktop-hell',1280,900,'light',False),('desktop-dunkel',1280,900,'dark',False),('handy-hell',360,780,'light',True),('handy-dunkel',360,780,'dark',True)]:
                await cmd('Emulation.setDeviceMetricsOverride',width=w,height=h,deviceScaleFactor=1,mobile=mob)
                await cmd('Emulation.setEmulatedMedia',features=[{'name':'prefers-color-scheme','value':scheme},{'name':'prefers-reduced-motion','value':'no-preference'}])
                await cmd('Page.navigate',url=f'http://127.0.0.1:{port}/index.html'); await asyncio.sleep(1.5)
                if name=='desktop-hell':
                    await js("document.querySelectorAll('details').forEach(function(d){d.open=false});document.querySelector('#h_bars').nextSibling.nextSibling.nextSibling.querySelector('details').open=true")
                H=await js("document.body.scrollHeight")
                for y in range(0,H,400): await js(f"window.scrollTo(0,{y})"); await asyncio.sleep(.12)
                await js("window.scrollTo(0,0)"); await asyncio.sleep(2)
                ov=await js("document.documentElement.scrollWidth")
                if ov>w+2: fails.append(f'{name}: waagerechtes Scrollen {ov}>{w}')
                nsvg=await js("document.querySelectorAll('.pc svg').length"); ncode=await js("document.querySelectorAll('details pre').length"); nch=await js("document.querySelectorAll('.pc').length")
                print(name,'Breite',ov,'Diagramme',nch,'svg',nsvg,'Code',ncode)
                H=await js("document.documentElement.scrollHeight")
                # in Streifen, weil sehr hohe Seiten
                r=await cmd('Page.captureScreenshot',format='png',captureBeyondViewport=True,clip={'x':0,'y':0,'width':w,'height':min(H,16000),'scale':1})
                open(os.path.join(OUT,name+'.png'),'wb').write(base64.b64decode(r['data']))
                if name=='desktop-hell':
                    # Sprachwahl, Kopieren
                    await js("var s=document.getElementById('lg');s.value='de';s.dispatchEvent(new Event('change'))"); await asyncio.sleep(.5)
                    t=await js("document.getElementById('tag').textContent"); print('de:',t)
                    if 'Diagramme' not in t and 'barrierefrei' not in t.lower(): fails.append('Sprachwahl de wirkt nicht: '+t)
                    r2=await js("(async function(){var d=document.querySelector('details');d.open=true;var b=d.parentNode.querySelector('.cp');b.click();await new Promise(function(r){setTimeout(r,500)});return document.querySelector('[role=status]').textContent})()")
                    print('kopieren:',repr(r2))
                    for lng in ['bg','el','ga','mt','fi','hu']:
                        await js(f"var s=document.getElementById('lg');s.value='{lng}';s.dispatchEvent(new Event('change'))"); await asyncio.sleep(.3)
                        ov2=await js("document.documentElement.scrollWidth")
                        if ov2>w+2: fails.append(f'Sprache {lng}: Ueberlauf {ov2}')
                if name=='handy-hell':
                    for lng in ['de','fi','hu','el','bg','mt']:
                        await js(f"var s=document.getElementById('lg');s.value='{lng}';s.dispatchEvent(new Event('change'))"); await asyncio.sleep(.4)
                        ov2=await js("document.documentElement.scrollWidth")
                        if ov2>w+2: fails.append(f'Handy {lng}: Ueberlauf {ov2}')
                    sm=await js("Math.min.apply(0,[].slice.call(document.querySelectorAll('.pc text, p, summary, button, select, label')).map(function(e){return parseFloat(getComputedStyle(e).fontSize)}))"); print('kleinste Schrift',sm)
                    if sm<13: fails.append(f'Schrift {sm}')
            if errs: fails.append('Fehler: '+str(errs[:3]))
    finally:
        p.terminate(); shutil.rmtree(tmp,ignore_errors=True); srv.shutdown()
    print('FEHLER',fails) if fails else print('grün')
asyncio.run(main())
