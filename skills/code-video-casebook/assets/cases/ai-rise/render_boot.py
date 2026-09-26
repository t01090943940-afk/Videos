import asyncio, pathlib
from playwright.async_api import async_playwright
FR=pathlib.Path('frames')
async def wk(pw,i,nw):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1920,'height':1080})
    await pg.goto('file:///home/ubuntu/video/index.html');await pg.wait_for_timeout(400)
    for f in range(i,389,nw):
        await pg.evaluate(f"renderAt({f/30})")
        await pg.screenshot(path=str(FR/f'f_{f:05d}.jpg'),type='jpeg',quality=90)
    await b.close()
async def main():
    async with async_playwright() as pw:
        await asyncio.gather(*[wk(pw,i,6) for i in range(6)])
asyncio.run(main())
