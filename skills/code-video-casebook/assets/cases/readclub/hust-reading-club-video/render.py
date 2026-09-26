import base64, asyncio, subprocess, time
from playwright.async_api import async_playwright
import os, pathlib
HERE=os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
VIDEO_URL=pathlib.Path(HERE,'video.html').as_uri()
FPS=30; DUR=37.0  # 与 video.src.html 中 DUR 保持一致; N=int(DUR*FPS)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1080,'height':1920})
        await pg.goto(VIDEO_URL+'?render=1')
        await pg.wait_for_function('window.__ready===true', timeout=60000)
        wav=await pg.evaluate('window.__renderAudio()')
        open('audio.wav','wb').write(base64.b64decode(wav)); print('audio ok',flush=True)
        ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-i','audio.wav',
            '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest','out.mp4'],stdin=subprocess.PIPE)
        t0=time.time()
        for i in range(N):
            d=await pg.evaluate(f'window.__frame({i/FPS})')
            ff.stdin.write(base64.b64decode(d.split(',')[1]))
            if i%150==0: print(i, round(time.time()-t0,1), flush=True)
        ff.stdin.close(); ff.wait(); await b.close()
asyncio.run(main())
