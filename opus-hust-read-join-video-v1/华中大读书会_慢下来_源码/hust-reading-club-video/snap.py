import sys, base64, asyncio
from playwright.async_api import async_playwright
import os, pathlib
HERE=os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
VIDEO_URL=pathlib.Path(HERE,'video.html').as_uri()
ts=[float(x) for x in sys.argv[1].split(',')]
os.makedirs('snaps',exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1080,'height':1920})
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(VIDEO_URL+'?render=1')
        await pg.wait_for_function('window.__ready===true', timeout=60000)
        for t in ts:
            d=await pg.evaluate(f'window.__frame({t})')
            open(f'snaps/f_{t:05.2f}.jpg','wb').write(base64.b64decode(d.split(',')[1]))
        print('errors:',errs[:5])
        await b.close()
asyncio.run(main())
