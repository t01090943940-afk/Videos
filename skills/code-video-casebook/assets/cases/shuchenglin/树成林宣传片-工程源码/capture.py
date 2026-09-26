import base64, asyncio, sys, json, os, urllib.parse
from playwright.async_api import async_playwright
BASE='http://localhost:8765/'
ARGS=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--hide-scrollbars']
VT=open('/home/claude/work/vtime.js').read()
async def cap(b, c):
  out=f"/home/claude/work/cap/{c['name']}"; os.makedirs(out,exist_ok=True)
  ctx=await b.new_context(viewport={'width':1920,'height':1080})
  await ctx.add_init_script(VT)
  pg=await ctx.new_page()
  await pg.route('**/cdnjs.cloudflare.com/**gsap.min.js', lambda r: r.fulfill(path='/home/claude/src/site/base/vendor/gsap.min.js'))
  errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:150]))
  await pg.goto(BASE+urllib.parse.quote(c['url']),wait_until='load',timeout=90000)
  await pg.wait_for_timeout(c.get('realwait',1500))
  fps=30; dt=1000/fps
  # pre-roll virtual time
  for step in c.get('pre',[]):
    if step[0]=='adv':
      for _ in range(int(step[1]*fps)): await pg.evaluate(f'__advance({dt})')
    elif step[0]=='click':
      try: await pg.click(step[1],timeout=5000)
      except Exception as e: print('click fail',step[1],e)
    elif step[0]=='eval': await pg.evaluate(step[1])
    elif step[0]=='realwait': await pg.wait_for_timeout(step[1])
  cdp=await ctx.new_cdp_session(pg)
  n=int(c['dur']*fps)
  scroll=c.get('scroll')  # js expression of t (sec from clip start) returning y, or None
  for i in range(n):
    t=i/fps
    if scroll:
      await pg.evaluate(f"(()=>{{const t={t}; const y=({scroll}); if(window.FX&&FX.lenis){{FX.lenis.scrollTo(y,{{immediate:true,force:true}})}} else window.scrollTo(0,y);}})()")
    await pg.evaluate(f'__advance({dt})')
    if c.get('settle'): await pg.wait_for_timeout(c['settle'])
    r=await cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':88})
    open(f'{out}/{i:04d}.jpg','wb').write(base64.b64decode(r['data']))
  print(c['name'],'frames',n,'errs',errs[:3],flush=True)
  await ctx.close()
async def main():
  cfg=json.load(open(sys.argv[1])); only=sys.argv[2:]
  async with async_playwright() as p:
    b=await p.chromium.launch(args=ARGS)
    for c in cfg:
      if only and c['name'] not in only: continue
      try: await cap(b,c)
      except Exception as e: print('FAIL',c['name'],e,flush=True)
    await b.close()
asyncio.run(main())
