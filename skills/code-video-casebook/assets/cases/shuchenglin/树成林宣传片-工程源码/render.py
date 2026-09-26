import asyncio, sys, base64, subprocess, time
from playwright.async_api import async_playwright
URL='http://localhost:8766/work/comp/index.html'
async def main():
  mode=sys.argv[1]
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--disable-web-security'])
    pg=await b.new_page(viewport={'width':1920,'height':1080})
    logs=[]; pg.on('console',lambda m: logs.append(m.text) if m.type in ('error','warning') else None)
    pg.on('pageerror',lambda e: print('PAGEERR',e))
    await pg.goto(URL); print(await pg.evaluate('preload()'))
    if mode=='test':
      ts=[float(x) for x in sys.argv[2].split(',')]
      for t in ts:
        d=await pg.evaluate(f'renderFrame({round(t*30)})')
        open(f'/home/claude/work/test/f_{t:06.2f}.jpg','wb').write(base64.b64decode(d.split(',')[1]))
    else:
      a,bnd=int(sys.argv[2]),int(sys.argv[3]); out=sys.argv[4]
      ff=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
      t0=time.time()
      for i in range(a,bnd):
        d=await pg.evaluate(f'renderFrame({i})')
        ff.stdin.write(base64.b64decode(d.split(',')[1]))
        if i%60==0: print(i, round(time.time()-t0,1), flush=True)
      ff.stdin.close(); ff.wait()
    print('\n'.join(sorted(set(logs))[:20]))
    await b.close()
asyncio.run(main())
