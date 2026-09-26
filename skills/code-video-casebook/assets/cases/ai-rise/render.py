#!/usr/bin/env python3
"""Deterministic frame renderer: seeks window.renderAt(t) per frame."""
import asyncio, sys, os, json
from playwright.async_api import async_playwright

FPS = 30
DUR = 39.95
OUT = "/home/ubuntu/video/frames"
os.makedirs(OUT, exist_ok=True)

async def worker(pw, wid, frames, results):
    browser = await pw.chromium.launch(args=["--allow-file-access-from-files","--force-color-profile=srgb","--disable-lcd-text"])
    page = await browser.new_page(viewport={"width":1920,"height":1080}, device_scale_factor=1)
    await page.goto("file:///home/ubuntu/video/index.html")
    await page.evaluate("document.fonts.ready.then(()=>1)")
    await page.evaluate("1")
    for f in frames:
        t = f / FPS
        await page.evaluate(f"renderAt({t})")
        await page.screenshot(path=f"{OUT}/f_{f:05d}.jpg", type="jpeg", quality=90)
        if f % 120 == 0:
            print(f"[w{wid}] frame {f}", flush=True)
    await browser.close()
    results.append(wid)

async def main(start=0, end=None, nw=6):
    total = int(DUR*FPS)
    if end is None: end = total
    allf = list(range(start, min(end,total)))
    chunks = [allf[i::nw] for i in range(nw)]
    async with async_playwright() as pw:
        results=[]
        await asyncio.gather(*[worker(pw,i,ch,results) for i,ch in enumerate(chunks) if ch])
    print("done")

if __name__=="__main__":
    s=int(sys.argv[1]) if len(sys.argv)>1 else 0
    e=int(sys.argv[2]) if len(sys.argv)>2 else None
    asyncio.run(main(s,e))
