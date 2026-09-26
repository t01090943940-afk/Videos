# shuchenglin · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show shuchenglin <路径>`；还原成真实目录：`python3 scripts/casebook.py copy shuchenglin <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `树成林宣传片-工程源码/audio.py` | 91 | 22 |
| 2 | `树成林宣传片-工程源码/capture.py` | 47 | 118 |
| 3 | `树成林宣传片-工程源码/cfgA.json` | 4 | 170 |
| 4 | `树成林宣传片-工程源码/cfgB.json` | 10 | 179 |
| 5 | `树成林宣传片-工程源码/cfgC.json` | 1 | 194 |
| 6 | `树成林宣传片-工程源码/comp/comp.js` | 240 | 200 |
| 7 | `树成林宣传片-工程源码/comp/index.html` | 14 | 445 |
| 8 | `树成林宣传片-工程源码/comp/timeline.js` | 593 | 464 |
| 9 | `树成林宣传片-工程源码/render.py` | 28 | 1062 |
| 10 | `树成林宣传片-工程源码/vtime.js` | 27 | 1095 |

---

### 1/10 · `树成林宣传片-工程源码/audio.py`
<!-- casebook-file {"path": "树成林宣传片-工程源码/audio.py", "lines": 91, "final_newline": true, "sha256": "a1a764ebeb76540fb7f7a4e3e31cae656d2fec6ecc6e3d57716befed0c87c39f", "original_sha256": "a1a764ebeb76540fb7f7a4e3e31cae656d2fec6ecc6e3d57716befed0c87c39f"} -->
```python
import numpy as np, librosa, soundfile as sf
sr=48000
y,_=librosa.load('song.mp3',sr=sr,mono=False)  # (2,N)
def seg(a,b): return y[:,int(a*sr):int(b*sr)].copy()
def xjoin(p,q,ms=12):
    n=int(ms/1000*sr); f=np.linspace(0,1,n)
    out=np.concatenate([p[:,:-n], p[:,-n:]*(1-f)+q[:,:n]*f, q[:,n:]],axis=1); return out
A=seg(59.05,81.05+0.006); B=seg(87.05,120.07)
# gentle fade on the very end of B (hard stop but no click)
n=int(0.02*sr); B[:,-n:]*=np.linspace(1,0,n)
m=xjoin(A,B,6)
sil=np.zeros((2,int(0.4*sr)))
C=seg(150.03,155.2); fl=int(3.4*sr); C[:,-fl:]*=np.linspace(1,0,fl)**2
C[:,:int(0.004*sr)]*=np.linspace(0,1,int(0.004*sr))
music=np.concatenate([m,sil,C],axis=1)
fi=int(0.03*sr); music[:,:fi]*=np.linspace(0,1,fi)
T=60.0; N=int(T*sr); music=music[:,:N] if music.shape[1]>=N else np.pad(music,((0,0),(0,N-music.shape[1])))
print('music len', m.shape[1]/sr, 'total', music.shape[1]/sr)
# ---------- SFX ----------
rng=np.random.default_rng(7)
sfx=np.zeros((2,N))
def add(sig,t,g=1.0,pan=0.0):
    i=int(t*sr); j=min(N,i+sig.shape[-1]); s=sig[...,:j-i]
    if s.ndim==1: s=np.vstack([s*(1-max(0,pan)),s*(1+min(0,pan))])
    sfx[:,i:j]+=s*g
def lp(x,a):  # one-pole lowpass, a in (0,1)
    from scipy.signal import lfilter; return lfilter([a],[1,a-1],x)
def hp(x,a): return x-lp(x,a)
def impact(d=1.4):
    t=np.arange(int(d*sr))/sr
    f=38+60*np.exp(-t*9); ph=2*np.pi*np.cumsum(f)/sr
    sub=np.sin(ph)*np.exp(-t*3.2)
    crack=hp(rng.standard_normal(len(t)),0.3)*np.exp(-t*40)*0.6
    body=lp(rng.standard_normal(len(t)),0.05)*np.exp(-t*6)*1.2
    return np.tanh((sub*1.1+crack+body)*1.3)
def riser(d, up=True):
    t=np.arange(int(d*sr))/sr; x=t/d
    noise=rng.standard_normal(len(t))
    out=np.zeros(len(t))
    # sweep filtered noise by chunks
    k=2048
    for i in range(0,len(t),k):
        a=0.02+0.5*(x[i]**2); ch=noise[i:i+k]
        out[i:i+k]=hp(ch,0.9-0.85*x[i])*0 + lp(ch,a)
    f=200+1800*x**2; tone=np.sin(2*np.pi*np.cumsum(f)/sr)*0.25
    env=x**2.2
    return (out*0.9+tone)*env
def whoosh(d=0.35):
    t=np.arange(int(d*sr))/sr; x=t/d
    n=lp(rng.standard_normal(len(t)),0.25)
    return n*np.sin(np.pi*x)**2*0.9
def tick():
    t=np.arange(int(0.03*sr))/sr
    return hp(rng.standard_normal(len(t)),0.5)*np.exp(-t*260)*0.8+np.sin(2*np.pi*2400*t)*np.exp(-t*300)*0.3
def shatter(d=1.2):
    t=np.arange(int(d*sr))/sr; out=np.zeros(len(t))
    for _ in range(90):
        s=int(rng.uniform(0,0.5)**2*sr); L=int(0.05*sr)
        f=rng.uniform(2500,7000); tt=np.arange(L)/sr
        g=np.sin(2*np.pi*f*tt)*np.exp(-tt*rng.uniform(40,120))*rng.uniform(.2,.6)
        out[s:s+L]+=g[:max(0,min(L,len(t)-s))]
    out+=hp(rng.standard_normal(len(t)),0.4)*np.exp(-t*7)*0.7
    return out
def glitch(d=0.12):
    t=np.arange(int(d*sr))/sr
    sq=np.sign(np.sin(2*np.pi*rng.uniform(300,900)*t))*0.3
    return (sq+hp(rng.standard_normal(len(t)),0.6)*0.4)*(t<d)*np.exp(-t*10)
# placement (video time)
for t,g in [(4.0,1.0),(16.0,0.8),(31.0,1.15),(55.42,1.1)]: add(impact(),t,g)
add(riser(3.0),1.0,0.55); add(riser(2.75),28.25,0.7); add(riser(1.2),14.08,0.35)
add(shatter(),31.0,0.8)
for t in [7.0,8.5,10.0,11.5,19.75,22.0,32.5,38.5,44.5,50.5]: add(whoosh(),t-0.2,0.5)
# typing ticks 16.25->17.4
txt='给我一个乔布斯看了都震惊的网页。'
for i in range(len(txt)): add(tick(),16.3+i*(1.05/len(txt)),0.55,pan=rng.uniform(-.3,.3))
add(tick(),17.5,1.0); add(impact(0.6)*0.5,17.5,0.6)
for t in [1.0,1.75,2.5,3.25]: add(glitch(),t,0.45)
for k in range(4): add(impact(0.5)*0.6,27.25+0.375*k,0.55)  # 我不配问 thuds
np.save('sfx_raw.npy',sfx)
print('music peak',np.max(np.abs(music)),'sfx peak',np.max(np.abs(sfx)))
mix=music*0.9+sfx*0.28
# look-ahead-free smooth limiter: gain envelope from peak follower
env=np.max(np.abs(mix),axis=0)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
pk=maximum_filter1d(env,size=int(0.01*sr)); pk=uniform_filter1d(pk,size=int(0.01*sr))
th=0.9; g=np.where(pk>th, th/pk, 1.0)
g=uniform_filter1d(g,size=int(0.005*sr))
mix=mix*g
print('peak after',np.max(np.abs(mix)), 'limited frac', np.mean(g<0.999))
mix=np.clip(mix,-0.98,0.98)
sf.write('soundtrack.wav',mix.T,sr)
```

### 2/10 · `树成林宣传片-工程源码/capture.py`
<!-- casebook-file {"path": "树成林宣传片-工程源码/capture.py", "lines": 47, "final_newline": true, "sha256": "acaa5f1c6efb99e5e63f0734481ef0d1fea2876b95ef42aaf629974f514d7cfc", "original_sha256": "acaa5f1c6efb99e5e63f0734481ef0d1fea2876b95ef42aaf629974f514d7cfc"} -->
```python
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
```

### 3/10 · `树成林宣传片-工程源码/cfgA.json`
<!-- casebook-file {"path": "树成林宣传片-工程源码/cfgA.json", "lines": 4, "final_newline": true, "sha256": "0bd9db886b4cc371927bdebc3dcdc3afb0d31473e4662efce18360ca9c2bc22a", "original_sha256": "0bd9db886b4cc371927bdebc3dcdc3afb0d31473e4662efce18360ca9c2bc22a"} -->
```json
[{"name":"site_intro","url":"index.html","dur":6.5},
 {"name":"site_full","url":"index.html","dur":35.3,"pre":[["adv",7]],"scroll":"t*1400"},
 {"name":"strangers","url":"showcase-assets/video-matrix/code-video-strangers.html","dur":10,"pre":[["click","#startBtn"],["adv",0.3],["click","#ctrlHide"]]}
]
```

### 4/10 · `树成林宣传片-工程源码/cfgB.json`
<!-- casebook-file {"path": "树成林宣传片-工程源码/cfgB.json", "lines": 10, "final_newline": true, "sha256": "6d3265ea45addd3d14e065e7e0306607110010685fea6bbc8813387ff686f483", "original_sha256": "6d3265ea45addd3d14e065e7e0306607110010685fea6bbc8813387ff686f483"} -->
```json
[{"name":"zero_intro","url":"showcase-assets/live-works/视觉效果比较好的/从0到1是最贵的（树林）.html","dur":4},
 {"name":"zero_full","url":"showcase-assets/live-works/视觉效果比较好的/从0到1是最贵的（树林）.html","dur":8.6,"pre":[["adv",4]],"scroll":"t*1500"},
 {"name":"truth_intro","url":"showcase-assets/live-works/视觉效果比较好的/AI时代的残酷真相与破局之道.html","dur":3.5},
 {"name":"truth_full","url":"showcase-assets/live-works/视觉效果比较好的/AI时代的残酷真相与破局之道.html","dur":18.6,"pre":[["adv",3.5]],"scroll":"t*1500"},
 {"name":"lang_intro","url":"showcase-assets/live-works/视觉效果比较好的/语言的力量.html","dur":3},
 {"name":"lang_full","url":"showcase-assets/live-works/视觉效果比较好的/语言的力量.html","dur":7.5,"pre":[["adv",3]],"scroll":"t*1500"},
 {"name":"attn_intro","url":"showcase-assets/live-works/把注意力放回自己身上（树林）.html","dur":3},
 {"name":"attn_part","url":"showcase-assets/live-works/把注意力放回自己身上（树林）.html","dur":5,"pre":[["adv",3]],"scroll":"t*1400"},
 {"name":"last2","url":"showcase-assets/video-matrix/code-video-最后两天.html","dur":10,"pre":[["click","#play"],["adv",0.2]]}
]
```

### 5/10 · `树成林宣传片-工程源码/cfgC.json`
<!-- casebook-file {"path": "树成林宣传片-工程源码/cfgC.json", "lines": 1, "final_newline": true, "sha256": "c938dcad7fcb7d95705ebf5fcf7ee5b0bbdefbcb3454d878808bdb802ed57196", "original_sha256": "c938dcad7fcb7d95705ebf5fcf7ee5b0bbdefbcb3454d878808bdb802ed57196"} -->
```json
[{"name":"last2","url":"showcase-assets/video-matrix/code-video-最后两天.html","dur":6,"pre":[["eval","__go()"],["adv",0.8]]}]
```

### 6/10 · `树成林宣传片-工程源码/comp/comp.js`
<!-- casebook-file {"path": "树成林宣传片-工程源码/comp/comp.js", "lines": 240, "final_newline": true, "sha256": "3fdc4135b5ec1eeb0316d6a53a13aa7c77abd84353baaa6895e1b718025afa8b", "original_sha256": "3fdc4135b5ec1eeb0316d6a53a13aa7c77abd84353baaa6895e1b718025afa8b"} -->
```js
/* ================================================================
   树成林 · 60s 宣传片 — code-driven compositor
   seek(t) renders the exact frame for time t (sec). Deterministic.
   ================================================================ */
const W = 1920, H = 1080, FPS = 30, DUR = 60;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const RED = '#E32B16';
const CJK = '"Noto Sans CJK SC", "Noto Sans SC", sans-serif';
const LAT = '"Archivo", "Noto Sans CJK SC", sans-serif';
const MONO = '"Space Mono", "Noto Sans CJK SC", monospace';

/* ---------- math ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, s, d) => clamp((t - s) / d);
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inCubic: x => x * x * x,
  inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (n) => rng(n * 9301 + 49297)();

/* ---------- beat grid (music edited so the grid is continuous) ---------- */
const T0 = 4.0, BEAT = 0.375, BAR = 1.5;
const bt = k => T0 + BEAT * k;
const DROPS = [[4.0, 15.28], [16.0, 23.55], [31.0, 55.02]];

/* ---------- assets ---------- */
const R = '/src/site/';
const SH = R + 'sections/m-web/assets/shots/';
const SK = R + 'sections/m-skill/assets/';
const VD = R + 'sections/m-video/assets/';
const IMG = {
  wjm1: SH + 'wangjiemin-1.jpg', wjm2: SH + 'wangjiemin-2.jpg', wjm3: SH + 'wangjiemin-3.jpg', wjm4: SH + 'wangjiemin-4.jpg',
  kaijie1: SH + 'kaijie-1.jpg', kaijie2: SH + 'kaijie-2.jpg', live1: SH + '25ip-live-1.jpg', live2: SH + '25ip-live-2.jpg',
  ipr1: SH + 'ipreview-1.jpg', ipr2: SH + 'ipreview-2.jpg', demos1: SH + 'web-demos-1.jpg', mirror1: SH + 'mirror-1.jpg',
  feng1: SH + 'fenglisu-1.jpg', feng2: SH + 'fenglisu-2.jpg', lucky1: SH + 'lucky-sprite-1.jpg', lucky2: SH + 'lucky-sprite-2.jpg',
  mom1: SH + 'mothers-day-1.jpg', wed1: SH + 'wedding-1.jpg', wed2: SH + 'wedding-2.jpg', biaobai1: SH + 'biaobai-1.jpg',
  archive1: SH + 'portrait-archive-1.jpg', yezhen1: SH + 'yezhen-1.jpg',
  porsche: SH + 'shot-porsche.jpg', nuelian: SH + 'shot-nuelian.jpg', fourlaws: SH + 'shot-fourlaws.jpg',
  manifesto: SH + 'shot-manifesto.jpg', structure: SH + 'shot-structure.jpg',
  flang: SH + 'file-language.jpg', fpixel: SH + 'file-language-pixel.jpg', ftruth: SH + 'file-truth.jpg',
  fwall: SH + 'file-wall.jpg', fzero: SH + 'file-zero2one.jpg', fhoper: SH + 'file-hoper.jpg', fstruct: SH + 'file-structure.jpg',
  cJiang: SK + 'collage-jiangge.jpg', cQiu: SK + 'collage-qiuting.jpg', cShu: SK + 'collage-shulin.jpg', cYi: SK + 'collage-yixing.jpg',
  clipRaw: SK + 'poster-clip-raw.jpg', clipCut: SK + 'poster-clip-cut.jpg', imgflow: SK + 'skill-imagegen-workflow.png',
  gen1: VD + 'gen-01-poster.jpg', gen2: VD + 'gen-02-poster.jpg', gen3: VD + 'gen-03-poster.jpg', gen4: VD + 'gen-04-poster.jpg',
  kb01: VD + 'kb-01-poster.jpg', codeLive2: VD + 'code-live-2-poster.jpg', codeZuihou: VD + 'code-live-zuihou-poster.jpg',
  zhuA: R + 'showcase-assets/video-matrix/zhuning-a-poster.jpg',
  qr: R + 'base/assets/qr-course.png',
};
const CREDIT = {
  wjm1: 'wangjiemin.com — 王杰民', wjm2: 'wangjiemin.com — 王杰民', wjm3: 'wangjiemin.com — 王杰民', wjm4: 'wangjiemin.com — 王杰民',
  kaijie1: 'kaijie — 凯杰', kaijie2: 'kaijie — 凯杰', live1: '25IP Live Exhibition — 东渐西被', live2: '25IP Live Exhibition — 东渐西被',
  ipr1: 'ipreview — Rheos', ipr2: 'ipreview — Rheos', demos1: 'web-demos — FATE', mirror1: 'mirror — FATE',
  feng1: 'fancy-fenglisu — 不忧白', feng2: 'fancy-fenglisu — 不忧白', lucky1: 'lucky-sprite — 半杯箫暮', lucky2: 'lucky-sprite — 半杯箫暮',
  mom1: '母亲节贺卡 — 万象榕', wed1: '婚礼祝福网站 — dawn', wed2: '婚礼祝福网站 — dawn', biaobai1: '表白网站 — 昕',
  yezhen1: '野针 AI 识别 — 王杰民', flang: '语言的力量 — 雪糕wo', fpixel: '语言的力量 · 像素版 — 雪糕wo', structure: 'structure — 亮作', fstruct: 'structure — 亮作',
  fzero: '从 0 到 1，是最贵的', ftruth: 'AI 时代的残酷真相', fwall: '有一道看不见的墙', fhoper: 'HOPER VOL.002',
  porsche: 'PORSCHE · 676 帧 · 单文件', nuelian: '虐恋的完美配方', fourlaws: '一切都会 AI 化',
};
const SEQ = {
  site_intro: { dir: '/work/cap/site_intro/', n: 195, base: 0 },
  site_full: { dir: '/work/cap/site_full/', n: 1059, base: 0 },
  zero_intro: { dir: '/work/cap/zero_intro/', n: 120, base: 0 },
  zero_full: { dir: '/work/cap/zero_full/', n: 258, base: 0 },
  truth_intro: { dir: '/work/cap/truth_intro/', n: 105, base: 0 },
  truth_full: { dir: '/work/cap/truth_full/', n: 558, base: 0 },
  lang_intro: { dir: '/work/cap/lang_intro/', n: 90, base: 0 },
  lang_full: { dir: '/work/cap/lang_full/', n: 225, base: 0 },
  attn_intro: { dir: '/work/cap/attn_intro/', n: 90, base: 0 },
  attn_part: { dir: '/work/cap/attn_part/', n: 150, base: 0 },
  strangers: { dir: '/work/cap/strangers/', n: 300, base: 0 },
  last2: { dir: '/work/cap/last2/', n: 180, base: 0 },
  aiweb: { dir: '/work/vid/row-ai-webpage/', n: 485, base: 1 },
  bot: { dir: '/work/vid/row-bot-install/', n: 161, base: 1 },
  kb: { dir: '/work/vid/row-wechat-kb/', n: 336, base: 1 },
  xhs: { dir: '/work/vid/row-xhs-crawler/', n: 900, base: 1 },
  p918a: { dir: '/work/vid/riv-vid-918a/', n: 243, base: 1 },
  p918b: { dir: '/work/vid/riv-vid-918b/', n: 243, base: 1 },
  rAiweb: { dir: '/work/vid/riv-vid-aiweb/', n: 243, base: 1 },
  gallery: { dir: '/work/vid/riv-vid-gallery/', n: 298, base: 1 },
  flow: { dir: '/work/vid/riv-vid-flow/', n: 331, base: 1 },
  wxkb: { dir: '/work/vid/riv-vid-wxkb/', n: 243, base: 1 },
  l0: { dir: '/work/vid/l0/', n: 105, base: 1 }, l3: { dir: '/work/vid/l3/', n: 105, base: 1 }, l5: { dir: '/work/vid/l5/', n: 105, base: 1 },
};
const still = new Map(), frames = new Map();
function loadImg(src) {
  return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => { console.error('ERR ' + src); res(null); }; im.src = src; });
}
async function img(key) { if (!still.has(key)) still.set(key, loadImg(IMG[key] || key)); return still.get(key); }
async function seq(name, sec, { loop = false } = {}) {
  const S = SEQ[name]; let i = Math.floor(sec * FPS + 1e-6);
  i = loop ? ((i % S.n) + S.n) % S.n : clamp(i, 0, S.n - 1);
  const src = S.dir + String(i + S.base).padStart(4, '0') + '.jpg';
  if (!frames.has(src)) {
    frames.set(src, loadImg(src));
    if (frames.size > 260) frames.delete(frames.keys().next().value);
  }
  return frames.get(src);
}

/* ---------- drawing primitives ---------- */
function cover(im, o = {}) {
  if (!im) return;
  const { x = 0, y = 0, w = W, h = H, zoom = 1, fx = .5, fy = .5, alpha = 1, filter = null, contain = false } = o;
  const s = (contain ? Math.min(w / im.width, h / im.height) : Math.max(w / im.width, h / im.height)) * zoom;
  const dw = im.width * s, dh = im.height * s;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.globalAlpha = alpha; if (filter) ctx.filter = filter;
  ctx.drawImage(im, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
  ctx.restore();
}
function fill(c, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function font(size, fam = CJK, wt = 900) { return `${wt} ${size}px ${fam}`; }

/* per-char text engine: modes rise | drop | slam | type | roll | fade | none */
function text(str, x, y, o = {}) {
  const { size = 100, fam = CJK, wt = 900, color = '#fff', align = 'center', lt = 99, mode = 'rise', stagger = .035, dur = .55,
    ls = 0, out = null, outDur = .35, alpha = 1, shadow = 0, stroke = null } = o;
  ctx.save(); ctx.font = font(size, fam, wt); ctx.textBaseline = 'alphabetic';
  const chars = [...str]; const ws = chars.map(c => ctx.measureText(c).width + ls);
  const total = ws.reduce((a, b) => a + b, 0) - ls;
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const shown = mode === 'type' ? Math.floor(clamp(lt / dur) * chars.length + 1e-6) : chars.length;
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = shadow; }
  chars.forEach((c, i) => {
    if (i >= shown) return;
    const p = prog(lt, i * stagger, dur);
    let dy = 0, a = alpha, sc = 1;
    let op = 0; if (out !== null) op = E.inExpo(prog(lt, out + i * stagger * .5, outDur));
    if (mode === 'rise') { dy = (1 - E.outExpo(p)) * size * 1.15 - op * size * 1.15; }
    else if (mode === 'drop') { const q = E.outBack(p); dy = -(1 - q) * size * .9; a *= clamp(p * 3); a *= 1 - op; }
    else if (mode === 'fade') { a *= E.outCubic(p) * (1 - op); }
    else if (mode === 'slam') { const q = prog(lt, 0, .28); sc = 1 + (1 - E.outExpo(q)) * .9; a *= clamp(q * 5) * (1 - op); }
    else if (mode === 'roll') { dy = (1 - E.outExpo(p)) * size * 1.1 - op * size * 1.1; }
    ctx.save();
    if (mode === 'rise' || mode === 'roll') { ctx.beginPath(); ctx.rect(cx - 4, y - size * 1.02, ws[i] + 8, size * 1.28); ctx.clip(); }
    ctx.globalAlpha = clamp(a);
    if (sc !== 1) { const mx = x, my = y - size * .38; ctx.translate(mx, my); ctx.scale(sc, sc); ctx.translate(-mx, -my); }
    if (stroke) { ctx.lineWidth = stroke[1]; ctx.strokeStyle = stroke[0]; ctx.strokeText(c, cx, y + dy); }
    ctx.fillStyle = color; ctx.fillText(c, cx, y + dy);
    ctx.restore();
    cx += ws[i];
  });
  ctx.restore();
  return total;
}
function measure(str, size, fam = CJK, wt = 900, ls = 0) { ctx.save(); ctx.font = font(size, fam, wt); const w = [...str].reduce((a, c) => a + ctx.measureText(c).width + ls, 0) - ls; ctx.restore(); return w; }
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>';
function scramble(str, x, y, lt, o = {}) {
  const { size = 60, color = '#fff', align = 'center', per = .035, start = .08, fam = LAT, ls = size * .08 } = o;
  const r = rng(Math.floor(lt * 30) * 131 + str.length);
  const out = [...str].map((c, i) => (c === ' ' || lt > start + i * per) ? c : GLYPHS[Math.floor(r() * GLYPHS.length)]).join('');
  return text(out, x, y, { size, fam, color, align, mode: 'none', ls });
}
function mono(str, x, y, o = {}) { const { size = 18, color = 'rgba(255,255,255,.75)', align = 'left', ls = 3, wt = 400 } = o; return text(str, x, y, { size, fam: MONO, wt, color, align, mode: 'none', ls }); }

/* browser-window frame around a screenshot (斜置橱窗 style) */
function browser(im, x, y, w, h, url = '', o = {}) {
  const { zoom = 1, fy = 0, alpha = 1 } = o;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#161616'; ctx.fillRect(x, y, w, h); ctx.restore();
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = '#1d1d1d'; ctx.fillRect(x, y, w, 38);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 22 + i * 20, y + 19, 6, 0, 7); ctx.fill(); });
  ctx.fillStyle = '#0e0e0e'; ctx.fillRect(x + w * .3, y + 8, w * .4, 22);
  ctx.restore();
  if (url) { ctx.save(); ctx.globalAlpha = alpha; mono(url, x + w / 2, y + 25, { size: 13, align: 'center', ls: 1, color: 'rgba(255,255,255,.6)' }); ctx.restore(); }
  cover(im, { x, y: y + 38, w, h: h - 38, zoom, fy, alpha });
}

/* ---------- global FX state (collected per frame) ---------- */
let FX;
function resetFX() { FX = { punch: 0, shakeAmp: 0, rgb: 0, glitch: 0, flash: 0, flashC: '#fff', hud: true, chapter: '', credit: '', grain: .1, gray: false, dark: 0 }; }
function beatPunch(t) {
  for (const [s, e] of DROPS) {
    if (t >= s && t < e) {
      const k = Math.floor((t - s) / BEAT + 1e-6), since = t - (s + k * BEAT);
      const isBar = ((s - T0) / BEAT + k) % 4 === 0;
      return (isBar ? .045 : .02) * Math.exp(-since * 11);
    }
  }
  return 0;
}
const HITS = [[4.0, 1], [16.0, .8], [17.5, .5], [31.0, 1.2], [40.0, .6], [46.75, .5], [55.42, .7]];

/* ---------- offscreen helpers ---------- */
function mk(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const OFF = mk(), OFFc = OFF.getContext('2d');
const CH = [mk(), mk(), mk()];
function rgbSplit(amt) {
  if (amt < .5) return;
  OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0);
  ['#f00', '#0f0', '#00f'].forEach((c, i) => {
    const g = CH[i].getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.drawImage(OFF, 0, 0);
    g.globalCompositeOperation = 'multiply'; g.fillStyle = c; g.fillRect(0, 0, W, H);
  });
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(CH[0], amt, 0); ctx.drawImage(CH[1], 0, 0); ctx.drawImage(CH[2], -amt, 0); ctx.restore();
}
function glitchSlices(amt, seed) {
  if (amt <= 0) return;
  OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0);
  const r = rng(seed); const n = 6 + Math.floor(amt * 10);
  for (let i = 0; i < n; i++) {
    const y = r() * H, h = 8 + r() * 90 * amt, dx = (r() - .5) * 220 * amt;
    ctx.drawImage(OFF, 0, y, W, h, dx, y, W, h);
  }
}
const GR = [0, 1, 2].map(s => { const c = mk(960, 540), g = c.getContext('2d'), d = g.createImageData(960, 540), r = rng(s + 7); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
const VIG = (() => { const c = mk(), g = c.getContext('2d'); const gr = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.72)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); return c; })();

/* ---------- HUD (site chrome, persistent memory anchor) ---------- */
function hud(t) {
  const a = FX.hud ? 1 : 0; if (!a) return;
  ctx.save();
  mono('树成林 · STUDENT AI ARCHIVE ®', 56, 58, { size: 17, color: 'rgba(255,255,255,.85)', wt: 700, ls: 2 });
  mono('FIRST EDUCATION', W - 56, 58, { size: 17, align: 'right', color: 'rgba(255,255,255,.85)', wt: 700, ls: 3 });
  // corner marks
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
  [[40, 90, 1, 1], [W - 40, 90, -1, 1], [40, H - 90, 1, -1], [W - 40, H - 90, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x, y + 26 * sy); ctx.lineTo(x, y); ctx.lineTo(x + 26 * sx, y); ctx.stroke(); });
  const s = Math.floor(t), f = Math.floor((t - s) * 30);
  mono(`REC ● 00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`, 56, H - 44, { size: 16, color: 'rgba(255,255,255,.7)' });
  // progress
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(W - 356, H - 52, 300, 3);
  ctx.fillStyle = RED; ctx.fillRect(W - 356, H - 52, 300 * t / DUR, 3);
  if (FX.chapter) mono(FX.chapter, W - 56, H - 64, { size: 16, align: 'right', color: 'rgba(255,255,255,.85)', wt: 700 });
  if (FX.credit) {
    ctx.fillStyle = RED; ctx.fillRect(56, H - 108, 12, 12);
    mono(FX.credit, 80, H - 97, { size: 19, color: '#fff', wt: 700, ls: 1 });
  }
  ctx.restore();
}
```

### 7/10 · `树成林宣传片-工程源码/comp/index.html`
<!-- casebook-file {"path": "树成林宣传片-工程源码/comp/index.html", "lines": 14, "final_newline": true, "sha256": "74219b28b0ba701fc1de94a90dbee6b0565e902c502618f19ef55a4f0d89e38c", "original_sha256": "74219b28b0ba701fc1de94a90dbee6b0565e902c502618f19ef55a4f0d89e38c"} -->
```html
<!doctype html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:"Archivo";font-weight:900;src:url(/src/site/base/fonts/archivo-latin-900.woff2) format("woff2");}
@font-face{font-family:"Space Mono";font-weight:400;src:url(/src/site/base/fonts/space-mono-latin-400.woff2) format("woff2");}
@font-face{font-family:"Space Mono";font-weight:700;src:url(/src/site/base/fonts/space-mono-latin-700.woff2) format("woff2");}
html,body{margin:0;background:#000;}
canvas{display:block;}
</style></head>
<body>
<canvas id="c"></canvas>
<script src="comp.js"></script>
<script src="timeline.js"></script>
</body></html>
```

### 8/10 · `树成林宣传片-工程源码/comp/timeline.js`
<!-- casebook-file {"path": "树成林宣传片-工程源码/comp/timeline.js", "lines": 593, "final_newline": true, "sha256": "81d8229de59398872075d7e3440f6674c9d54cae05ce6259f8ccf538fa1b0d04", "original_sha256": "81d8229de59398872075d7e3440f6674c9d54cae05ce6259f8ccf538fa1b0d04"} -->
```js
/* ================================================================
   TIMELINE — every cut sits on the music grid (beat = .375s from 4.0)
   ACT0 0–4 冷开场 | ACT1 4–15.28 作品混剪 | 15.28–16 断拍
   ACT1b 16–23.55 说一句话→拿到成品 | ACT2 23.55–31 墙 | ACT3 31–55.02 拆墙后全面爆发
   ACT4 55.02–60 品牌落版
   ================================================================ */
const SHOTS = [], OVER = [];
const shot = (s, e, f) => SHOTS.push({ s, e, f });
const over = (s, e, f) => OVER.push({ s, e, f });
const OFFS = window.OFFS || {};
const off = (k, d) => (OFFS[k] !== undefined ? OFFS[k] : d);

/* ---- helpers ---- */
const SMALL = mk(160, 90), SMc = SMALL.getContext('2d');
function blurBg(im, dark = .55) {
  if (!im) return; SMc.clearRect(0, 0, 160, 90);
  const s = Math.max(160 / im.width, 90 / im.height); SMc.drawImage(im, (160 - im.width * s) / 2, (90 - im.height * s) / 2, im.width * s, im.height * s);
  ctx.save(); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(SMALL, -40, -20, W + 80, H + 40); ctx.restore(); fill('#000', dark);
}
function stamp(word, lt, { size = 380, dur = .34, color = '#fff', solid = false } = {}) {
  if (lt > dur) return;
  const p = prog(lt, 0, dur);
  ctx.save(); if (!solid) ctx.globalCompositeOperation = 'difference'; else { ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 60; }
  const sc = 1.25 - .25 * E.outExpo(p * 2);
  ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
  ctx.globalAlpha = 1 - E.inCubic(prog(lt, dur * .55, dur * .45));
  text(word, W / 2, H / 2 + size * .36, { size, mode: 'none', color, ls: size * .04 });
  ctx.restore();
}
// full-bleed still with Ken Burns
function full(key, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await img(key); const d = e - s;
    const z0 = o.z0 ?? 1.06, z1 = o.z1 ?? 1.16;
    cover(im, { zoom: lerp(z0, z1, lt / Math.max(d, .01)), fx: o.fx ?? .5, fy: o.fy ?? .5, filter: o.filter });
    if (o.dark) fill('#000', o.dark);
    FX.credit = o.credit ?? CREDIT[key] ?? '';
  });
}
// browser-framed still over blurred self
function win(key, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await img(key); const d = e - s, p = lt / Math.max(d, .01);
    blurBg(im, .5);
    const w = o.w ?? 1480, h = w * 0.625 + 38;
    const x = (W - w) / 2 + (o.dx ?? 0) * (1 - p) , y = (H - h) / 2 + lerp(40, -10, E.outCubic(p));
    const sc = lerp(.94, 1, E.outExpo(clamp(p * 3)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.rotate((o.rot ?? 0) * (1 - E.outExpo(clamp(p * 2)))); ctx.translate(-W / 2, -H / 2);
    browser(im, x, y, w, h, o.url ?? (CREDIT[key] || '').split(' — ')[0]);
    ctx.restore();
    FX.credit = o.credit ?? CREDIT[key] ?? '';
  });
}
// sequence full-bleed
function seqFull(name, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await seq(name, (o.from ?? 0) / FPS + lt * (o.speed ?? 1), { loop: o.loop });
    cover(im, { zoom: lerp(o.z0 ?? 1.02, o.z1 ?? 1.08, lt / (e - s)), fx: o.fx ?? .5, fy: o.fy ?? .5, filter: o.filter });
    if (o.dark) fill('#000', o.dark);
    FX.credit = o.credit ?? '';
  });
}
function seqWin(name, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await seq(name, (o.from ?? 0) / FPS + lt * (o.speed ?? 1));
    blurBg(im, .6);
    const w = o.w ?? 1500, h = w * 0.5625 + 38, p = lt / (e - s);
    browser(im, (W - w) / 2, (H - h) / 2 + lerp(30, -10, E.outCubic(p)), w, h, o.url ?? '');
    FX.credit = o.credit ?? '';
  });
}
function chapter(s, e, label) { over(s, e, () => { FX.chapter = label; }); }
function hudOff(s, e) { over(s, e, () => { FX.hud = false; }); }
function caption(s, e, str, o = {}) {
  over(s, e, (lt) => {
    const size = o.size ?? 72, y = o.y ?? 900;
    const w = measure(str, size) + 80;
    ctx.save(); ctx.globalAlpha = E.outExpo(clamp(lt / .12));
    ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fillRect(W / 2 - w / 2, y - size * 1.02, w, size * 1.36);
    ctx.fillStyle = RED; ctx.fillRect(W / 2 - w / 2, y - size * 1.02, 8, size * 1.36);
    ctx.restore();
    text(str, W / 2, y, { size, lt, mode: 'rise', stagger: .018, dur: .3 });
  });
}

/* =================== ACT 0 · 冷开场 0–4.0 =================== */
hudOff(0, 4.0);
shot(0, 4.0, async () => { fill('#000'); });
over(0, 1.0, (lt) => {           // 载入计数(官网开场同款)
  const n = Math.floor(E.inCubic(clamp(lt / 1.0)) * 180);
  text(String(n).padStart(3, '0'), W / 2, H / 2 + 60, { size: 200, fam: LAT, mode: 'none', ls: 6 });
  mono('FIRST EDUCATION — LOADING', W / 2, H / 2 + 140, { size: 18, align: 'center', color: 'rgba(255,255,255,.6)' });
});
over(1.0, 1.75, (lt) => { text('一个群。', W / 2, H / 2 + 70, { size: 200, lt, mode: 'drop', stagger: .03, dur: .35 }); });
over(1.75, 2.5, (lt) => {
  const w1 = measure('12', 230, LAT), w2 = measure(' 天。', 200);
  const x0 = W / 2 - (w1 + w2) / 2;
  text('12', x0, H / 2 + 80, { size: 230, fam: LAT, align: 'left', lt, mode: 'drop', dur: .3 });
  text(' 天。', x0 + w1, H / 2 + 80, { size: 200, align: 'left', lt: lt - .05, mode: 'drop', dur: .35 });
});
over(2.5, 3.25, (lt) => {
  const n = Math.round(lerp(180, 264, E.outExpo(clamp(lt / .25))));
  const w1 = measure('264', 230, LAT), w2 = measure(' 个网站。', 170);
  const x0 = W / 2 - (w1 + w2) / 2;
  text(String(n), x0, H / 2 + 80, { size: 230, fam: LAT, align: 'left', mode: 'none', color: RED });
  text(' 个网站。', x0 + w1, H / 2 + 80, { size: 170, align: 'left', lt, mode: 'drop', dur: .35 });
  mono('25IP 训练营 · 群内作品分享记录', W / 2, H / 2 + 190, { size: 20, align: 'center', color: 'rgba(255,255,255,.55)' });
});
over(0, 3.25, (lt) => { ctx.fillStyle = RED; ctx.fillRect(0, H - 6, W * E.inCubic(lt / 3.25), 6); });
over(3.25, 4.0, (lt) => {        // 红幕上切 + FIRST EDUCATION 字符锁定
  const p = E.outExpo(prog(lt, 0, .3));
  ctx.fillStyle = RED; ctx.fillRect(0, H * (1 - p), W, H * p);
  if (lt > .12) scramble('FIRST EDUCATION', W / 2, H / 2 + 40, lt - .12, { size: 120, color: '#000', per: .028 });
  if (lt > .55) { const q = E.inExpo(prog(lt, .55, .2)); fill('#fff', q); }
});
over(0.85, 4.0, (lt, t) => { // 八分音符脉冲
  const k = Math.floor((t - 0.85) / .1875); FX.glitch = (k % 4 === 0 && (t - .85 - k * .1875) < .05) ? .35 : 0;
});

/* =================== ACT 1 · 作品混剪 4.0–15.28 =================== */
chapter(4.0, 7.0, '01 — 网站 · WEBSITE');
full('wjm1', bt(0), bt(1), { z0: 1.12, z1: 1.02 });
seqFull('p918b', bt(1), bt(2), { from: off('p918b', 212), speed: 1.4, credit: 'PORSCHE 918 · 帧序列网页' });
seqFull('zero_intro', bt(2), bt(3), { from: off('zero_intro', 40), speed: 1.5, credit: '从 0 到 1，是最贵的' });
win('wjm3', bt(3), bt(4), { rot: -.04 });
seqFull('lang_intro', bt(4), bt(5), { from: off('lang_intro', 60), credit: '语言的力量 — 雪糕wo' });
full('nuelian', bt(5), bt(6), { z0: 1.2, z1: 1.05 });
seqFull('truth_intro', bt(6), bt(7), { from: off('truth_intro', 40), credit: 'AI 时代的残酷真相' });
win('kaijie1', bt(7), bt(8), { rot: .04 });
over(bt(0), bt(0) + .4, (lt) => stamp('网站', lt));

chapter(7.0, 10.0, '02 — 写真 · PORTRAIT');
seqFull('gallery', bt(8), bt(9), { from: off('gallery', 20), speed: 2.2, credit: 'AI 海报精选 · 真实生成结果', z0: 1.25, z1: 1.3 });
// 盖牌叠层:三张写真合辑逐拍落位
shot(bt(9), bt(12), async (lt, t) => {
  fill('#0a0a0a');
  const keys = ['cJiang', 'cQiu', 'cShu'], xs = [W / 2 - 560, W / 2, W / 2 + 560], rots = [-.05, .02, .05];
  for (let i = 0; i < 3; i++) {
    const lt2 = t - bt(9 + i); if (lt2 < 0) continue;
    const im = await img(keys[i]); const p = E.outBack(clamp(lt2 / .3));
    const h = 820, w = h * im.width / im.height;
    ctx.save(); ctx.translate(xs[i], H / 2 + (1 - p) * -700); ctx.rotate(rots[i] * (1.6 - .6 * p));
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 50; ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20);
    ctx.shadowBlur = 0; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  }
  FX.credit = '个性写真 · 没有摄影师，整本杂志级写真';
});
shot(bt(12), bt(13), async (lt) => { const im = await img('cYi'); blurBg(im, .45); cover(im, { contain: true, zoom: lerp(.92, 1, lt / BEAT) }); FX.credit = '个性写真 · 合辑海报'; });
seqFull('gallery', bt(13), bt(14), { from: off('gallery2', 200), speed: 1.5, credit: 'AI 海报精选 · 真实生成结果', z0: 1.25, z1: 1.3 });
win('archive1', bt(15), bt(16), { rot: -.03, url: 'portrait-archive · 写真档案馆', credit: '写真档案馆 · 真实生成结果' });
full('imgflow', bt(14), bt(15), { credit: '写真工作流 · 一张照片进，整套风格出', z0: 1.0, z1: 1.08 });
over(bt(8), bt(8) + .4, (lt) => stamp('写真', lt));

chapter(10.0, 11.5, '03 — 视频 · VIDEO');
full('gen1', bt(16), bt(17), { z0: 1.25, z1: 1.08, credit: 'AI 生视频' });
full('gen3', bt(17), bt(18), { z0: 1.2, z1: 1.05, credit: 'AI 生视频' });
full('gen2', bt(18), bt(19), { z0: 1.05, z1: 1.2, credit: 'AI 生视频' });
full('gen4', bt(19), bt(20), { z0: 1.05, z1: 1.2, credit: 'AI 生视频' });
over(bt(16), bt(16) + .4, (lt) => stamp('视频', lt));

chapter(11.5, 15.28, '04 — 智能体 · AGENT');
seqWin('xhs', bt(20), bt(22), { from: off('xhs', 200), speed: 3, url: 'xhs-crawler · 实录', credit: '数据 · 选题调研' });
caption(bt(20) + .08, bt(22), '关键词进去，选题库出来。');
seqWin('aiweb', bt(22), bt(24), { from: off('aiweb', 0), speed: 3, url: 'ai-webpage · 实录', credit: '网站 · 浏览器里即时生成' });
caption(bt(22) + .08, bt(24), '一句需求进去，网站出来。');
seqWin('kb', bt(24), bt(26), { from: off('kb', 60), speed: 4, url: 'feishu kb · 公众号内容知识库', credit: '知识库 · 内容沉淀' });
caption(bt(24) + .08, bt(26), '一堆资料，长成知识库。');
shot(bt(26), bt(28), async (lt) => {   // 剪辑前后分屏
  const a = await img('clipRaw'), b = await img('clipCut'); fill('#0a0a0a');
  const p = E.outExpo(clamp(lt / .3));
  cover(a, { x: 0, y: 0, w: W / 2 - 4, h: H, zoom: 1.05, filter: 'grayscale(1) brightness(.8)' });
  cover(b, { x: W / 2 + 4, y: H * (1 - p), w: W / 2 - 4, h: H, zoom: 1.05 });
  mono('原素材 RAW', 80, 150, { size: 20, wt: 700 }); mono('成片 CUT', W / 2 + 60, 150, { size: 20, wt: 700, color: RED });
  FX.credit = '视频 · 智能剪辑';
});
caption(bt(26) + .08, bt(28), '口播素材进，成片出。');
over(bt(20), bt(20) + .4, (lt) => stamp('智能体', lt, { size: 320 }));

// 十六分音符快闪 14.5–15.28
const FLASH1 = ['lucky1', 'mom1', 'feng1', 'ipr1', 'mirror1', 'fwall', 'fourlaws', 'demos1', 'live2'];
FLASH1.forEach((k, i) => {
  const s = 14.5 + i * .09375, e = Math.min(15.28, s + .09375);
  if (s < 15.28) full(k, s, e, { z0: 1.1 + i * .05, z1: 1.14 + i * .05 });
});
over(14.5, 15.28, (lt) => { FX.rgb = 6 + lt * 18; FX.glitch = .25; });
// 断拍 15.28–16.0:冻结 + 去色
shot(15.28, 16.0, async (lt) => {
  const im = await img('live2'); cover(im, { zoom: 1.5, filter: 'grayscale(1) brightness(.16) blur(3px)' });
  FX.credit = '';
});
over(15.3, 16.0, (lt) => {
  text('每一件，', W / 2, H / 2 - 10, { size: 96, lt, mode: 'rise', stagger: .03, dur: .35 });
  text('都从一句话开始。', W / 2, H / 2 + 120, { size: 96, lt: lt - .2, mode: 'rise', stagger: .03, dur: .35 });
});

/* =================== ACT 1b · 说一句话 → 拿到成品 16.0–23.55 =================== */
chapter(16.0, 23.55, '05 — 许愿式开发 · ONE PROMPT');
shot(16.0, 17.5, async (lt, t) => {
  fill('#050505');
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  const p = E.outExpo(clamp(lt / .3)), sc = 1.18 - .18 * p;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = clamp(p * 2);
  const x = 170, y = 440, w = W - 340, h = 190;
  ctx.fillStyle = '#0d0d0d'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
  mono('PROMPT ▸', x, y - 28, { size: 26, wt: 700, color: RED });
  mono('树成林 · 许愿式开发', x + w, y - 26, { size: 18, align: 'right', color: 'rgba(255,255,255,.55)' });
  const str = '给我一个乔布斯看了都震惊的网页。';
  const n = Math.floor(clamp((t - 16.3) / 1.05) * [...str].length + 1e-6);
  const shown = [...str].slice(0, n).join('');
  const tw = text(shown, x + 60, y + 124, { size: 84, wt: 700, align: 'left', mode: 'none' });
  if (Math.floor(t * 4) % 2 === 0 || n < [...str].length) { ctx.fillStyle = RED; ctx.fillRect(x + 68 + (n ? tw : 0), y + 44, 10, 100); }
  if (t > 17.3) mono('ENTER ↵', x + w - 30, y + h + 50, { size: 22, wt: 700, align: 'right', color: '#fff' });
  ctx.restore();
  FX.credit = '';
});
seqFull('site_intro', 17.5, 19.75, { from: 22, speed: 2.0, z0: 1.0, z1: 1.04, credit: 'shuchenglin-handbook.pages.dev' });
shot(19.75, 21.25, async (lt) => {
  const im = await seq('site_intro', 6.4 - .01); cover(im, { zoom: 1.08 + lt * .03 }); fill('#000', .72);
  FX.credit = '';
});
over(19.75, 21.25, (lt) => {
  const f = { size: 190, stagger: .05, dur: .5 };
  text('说一句话。', W / 2, 500, { ...f, lt, mode: 'rise' });
  text('拿到成品。', W / 2, 720, { ...f, lt: lt - .375, mode: 'rise' });
  ctx.fillStyle = RED; ctx.fillRect(W / 2 - 60, 780, 120 * E.outExpo(prog(lt, .6, .4)), 10);
});
seqFull('site_full', 21.25, 22.0, { from: off('site_full', 300), speed: 1.5, z0: 1.0, z1: 1.02, credit: 'shuchenglin-handbook.pages.dev · 由多个 AI 窗口并行建造' });

// 作品墙 pull-back
const POOL = ['wjm1', 'porsche', 'fzero', 'flang', 'live1', 'kaijie1', 'nuelian', 'feng1', 'cJiang', 'gen1', 'ipr2', 'lucky1', 'wed1', 'mom1', 'ftruth', 'fwall',
  'wjm2', 'cQiu', 'mirror1', 'fourlaws', 'demos1', 'biaobai1', 'gen2', 'archive1', 'live2', 'kaijie2', 'cShu', 'fpixel', 'wjm4', 'gen3', 'yezhen1', 'manifesto',
  'feng2', 'wed2', 'cYi', 'structure', 'ipr1', 'lucky2', 'gen4', 'fhoper', 'wjm3', 'zhuA'];
async function mosaic({ cols = 8, rows = 6, count = 1e9, seed = 3, zoom = 1, fxp = .5, fyp = .5, gray = false, bright = 1 }) {
  const tw = W / cols, th = H / rows; const r = rng(seed);
  const order = [...Array(cols * rows).keys()].sort(() => r() - .5);
  const rank = new Map(order.map((v, i) => [v, i]));
  ctx.save(); ctx.translate(W * fxp, H * fyp); ctx.scale(zoom, zoom); ctx.translate(-W * fxp, -H * fyp);
  for (let i = 0; i < cols * rows; i++) {
    if (rank.get(i) >= count) continue;
    const c = i % cols, rr = Math.floor(i / cols);
    const im = await img(POOL[(i * 13 + seed) % POOL.length]);
    cover(im, { x: c * tw + 3, y: rr * th + 3, w: tw - 6, h: th - 6, filter: gray ? 'grayscale(1) brightness(.5)' : (bright !== 1 ? `brightness(${bright})` : null) });
  }
  ctx.restore();
}
shot(22.0, 23.55, async (lt) => {
  fill('#000');
  const z = lerp(8, 1, E.inOutExpo(clamp(lt / .9)));
  await mosaic({ zoom: z, fxp: .4375, fyp: .0833, bright: lerp(1, .55, clamp((lt - .6) / .5)) });
  FX.credit = '';
});
over(22.375, 23.55, (lt) => {
  text('这，是树成林的日常。', W / 2, H / 2 + 40, { size: 120, lt, mode: 'rise', stagger: .035, dur: .45, shadow: 30 });
});

/* =================== ACT 2 · 墙 23.55–31.0 (breakdown) =================== */
hudOff(23.55, 31.0);
const WALLBG = (() => {
  const c = mk(), g = c.getContext('2d'); g.fillStyle = '#0e0e0e'; g.fillRect(0, 0, W, H);
  const r = rng(11); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 4;
  for (let y = 0, row = 0; y < H + 90; y += 90, row++) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    for (let x = (row % 2) * 120; x < W; x += 240) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 90); g.stroke(); }
  }
  const d = g.getImageData(0, 0, W, H); for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * 18; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0);
  return c;
})();
const CHARS4 = ['我', '不', '配', '问'], CX = [W / 2 - 480, W / 2 - 160, W / 2 + 160, W / 2 + 480];
const CRACKS = (() => {
  const r = rng(29), lines = [];
  function walk(x, y, a, len, depth) {
    const pts = [[x, y]]; let L = 0;
    for (let i = 0; i < len; i++) { a += (r() - .5) * .7; const s = 25 + r() * 45; x += Math.cos(a) * s; y += Math.sin(a) * s; L += s; pts.push([x, y]);
      if (depth < 2 && r() < .16) walk(x, y, a + (r() - .5) * 1.6, Math.floor(len * .5), depth + 1); }
    lines.push({ pts, d: depth });
  }
  for (let i = 0; i < 16; i++) walk(W / 2 + (r() - .5) * 60, H / 2 - 40 + (r() - .5) * 40, i / 16 * Math.PI * 2 + r() * .3, 22, 0);
  return lines;
})();
function drawCracks(g, p) {
  if (p <= 0) return;
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const pass of [0, 1]) {
    g.strokeStyle = pass ? '#fff' : RED; g.lineWidth = pass ? 1.6 : 6; g.shadowColor = RED; g.shadowBlur = pass ? 0 : 28;
    for (const ln of CRACKS) {
      const pp = clamp(p * 1.4 - ln.d * .25); const n = Math.floor(pp * (ln.pts.length - 1)); if (n < 1) continue;
      g.beginPath(); g.moveTo(...ln.pts[0]); for (let i = 1; i <= n; i++) g.lineTo(...ln.pts[i]); g.stroke();
    }
  }
  g.restore();
}
function drawWall(t, g = ctx) {
  g.drawImage(WALLBG, 0, 0);
  CHARS4.forEach((c, i) => {
    const lt = t - bt(62 + i); if (lt < 0) return;
    const p = E.outExpo(clamp(lt / .18)), sc = 1.6 - .6 * p;
    g.save(); g.translate(CX[i], H / 2 + 20); g.scale(sc, sc); g.globalAlpha = clamp(p * 2);
    g.font = font(300); g.textAlign = 'center'; g.fillStyle = '#f2f2f2'; g.fillText(c, 0, 105); g.restore();
  });
  drawCracks(g, E.inCubic(prog(t, 28.5, 2.45)));
}
shot(23.55, 25.05, async () => { fill('#000'); });
over(23.6, 25.05, (lt) => {
  text('拉开差距的，', W / 2, 470, { size: 110, lt, mode: 'rise', stagger: .04, dur: .5 });
  text('从来不是技术。', W / 2, 640, { size: 110, lt: lt - .75, mode: 'rise', stagger: .04, dur: .5, out: 1.2 - .75 });
});
shot(25.05, 31.0, async (lt, t) => {
  const a = E.outCubic(clamp(lt / 1.2));
  const sh = t > 28.5 ? (t - 28.5) * 3.2 : 0; const r = rng(Math.floor(t * 30));
  ctx.save(); ctx.translate((r() - .5) * sh, (r() - .5) * sh); ctx.globalAlpha = a; drawWall(t); ctx.restore();
  fill('#000', .15 + .5 * (1 - a));
});
over(25.1, 26.5, (lt) => { text('是一堵墙。', W / 2, H / 2 + 60, { size: 150, lt, mode: 'rise', stagger: .05, dur: .5, out: 1.1 }); });
over(26.5, 31.0, (lt) => { text('墙上写着四个字 ——', W / 2, 250, { size: 46, wt: 500, color: 'rgba(255,255,255,.6)', lt, mode: 'fade', stagger: .02 }); });
over(30.25, 31.0, (lt) => {
  const w1 = measure('今天，', 96);
  text('今天，', W / 2 - 60, 900, { size: 96, lt, mode: 'rise', align: 'right' });
  text('拆了它。', W / 2 - 60, 900, { size: 96, lt: lt - .375, mode: 'rise', align: 'left', color: RED });
});
over(27.25, 31.0, (lt, t) => { // 每落一字一次震
  const k = Math.floor((t - 27.25) / BEAT); const since = t - 27.25 - k * BEAT;
  if (k < 4) FX.shakeAmp = 22 * Math.exp(-since * 14);
});

/* =================== ACT 3 · 拆墙 → 全面爆发 31.0–55.02 =================== */
// 墙碎片
const WALLCV = mk();
let wallBaked = false;
const SHARDS = (() => {
  const r = rng(77), cols = 9, rows = 6, P = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
    const edge = i === 0 || j === 0 || i === cols || j === rows;
    P.push([i * W / cols + (edge ? 0 : (r() - .5) * 150), j * H / rows + (edge ? 0 : (r() - .5) * 120)]);
  }
  const S = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = P[j * (cols + 1) + i], b = P[j * (cols + 1) + i + 1], c = P[(j + 1) * (cols + 1) + i + 1], d = P[(j + 1) * (cols + 1) + i];
    for (const tri of (r() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]])) {
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      const ang = Math.atan2(cy - H / 2, cx - W / 2), dist = Math.hypot(cx - W / 2, cy - H / 2);
      S.push({ tri, cx, cy, vx: Math.cos(ang) * (900 + r() * 1400) * (0.6 + dist / 900), vy: Math.sin(ang) * (700 + r() * 1100) * (0.6 + dist / 900) + 200, vr: (r() - .5) * 9, vz: 1.2 + r() * 2.2 });
    }
  }
  return S;
})();
const BURST = ['p918b', 'gallery', 'wjm2', 'fzero', 'live1', 'feng2', 'gen3', 'wjm4'];
BURST.forEach((k, i) => {
  const s = 31.0 + i * .1875, e = s + .1875;
  if (k === 'p918b' || k === 'gallery') seqFull(k, s, e, { from: k === 'p918b' ? 190 : 120, z0: 1.15, z1: 1.2 });
  else full(k, s, e, { z0: 1.15, z1: 1.25 });
});
over(31.0, 32.0, (lt) => {
  if (!wallBaked) { const g = WALLCV.getContext('2d'); drawWall(30.99, g); wallBaked = true; }
  const p = E.outCubic(clamp(lt / .9));
  for (const s of SHARDS) {
    const tt = lt * lt * .9 + lt * .35;
    ctx.save();
    ctx.translate(s.cx + s.vx * tt * .6, s.cy + s.vy * tt * .6); ctx.rotate(s.vr * tt); ctx.scale(1 + s.vz * tt, 1 + s.vz * tt); ctx.translate(-s.cx, -s.cy);
    ctx.globalAlpha = 1 - E.inCubic(p);
    ctx.beginPath(); ctx.moveTo(...s.tri[0]); ctx.lineTo(...s.tri[1]); ctx.lineTo(...s.tri[2]); ctx.closePath(); ctx.clip();
    ctx.drawImage(WALLCV, 0, 0);
    ctx.strokeStyle = 'rgba(227,43,22,.8)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }
  FX.rgb = 14 * (1 - p); FX.hud = lt > .4;
});
chapter(31.0, 32.5, '06 — 拆墙 · BREAK THROUGH');

// GUIDE 列表 32.5–38.5:8 项 × 2 拍(官网「学生使用指南」同构)
const GUIDE = [
  ['01', '顶级审美的网站', '任何一个学生，一个能上线的网站', { seq: 'rAiweb', from: 30, speed: 2 }],
  ['02', '杂志级个人写真', '没有摄影师，整本杂志级写真', { seq: 'gallery', from: 60, speed: 2 }],
  ['03', '一键产出视频', 'AI 生视频 / AI 代码视频，两条流水线', { key: 'gen4' }],
  ['04', '微信聊天 → 需求单', '群聊 78 条 → 精华 38 条', { seq: 'bot', from: 20, speed: 2 }],
  ['05', '口播素材 → 成片', '字幕、花字、节奏一次到位', { key: 'clipCut' }],
  ['06', '关键词 → 选题库', '小红书爆款笔记，自动采集整理', { seq: 'xhs', from: 420, speed: 3 }],
  ['07', '一堆资料 → 知识库', '公众号 108 篇 → 自动分成 9 类', { seq: 'wxkb', from: 40, speed: 2 }],
  ['08', '整首成歌 · 海报 · 文案', '词曲、合辑海报、公众号长文', { key: 'cShu' }],
];
shot(32.5, 38.5, async (lt, t) => {
  fill('#000');
  const i = clamp(Math.floor(lt / .75), 0, 7), li = lt - i * .75;
  const [num, title, sub, media] = GUIDE[i];
  // media window (right)
  const mx = 980, my = 250, mw = 800, mh = 450;
  const im = media.seq ? await seq(media.seq, media.from / FPS + li * media.speed) : await img(media.key);
  const wp = E.outExpo(clamp(li / .25));
  ctx.save(); ctx.beginPath(); ctx.rect(mx, my + mh * (1 - wp), mw, mh * wp); ctx.clip();
  cover(im, { x: mx, y: my, w: mw, h: mh, zoom: 1.05 + li * .06 });
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.strokeRect(mx, my, mw, mh);
  mono(`PREVIEW · ${num} / 08`, mx, my - 18, { size: 16, color: 'rgba(255,255,255,.6)' });
  // left: number roll + title
  text(num, 140, 520, { size: 240, fam: LAT, align: 'left', lt: li, mode: 'roll', dur: .3, color: RED, ls: -8 });
  text(title, 140, 680, { size: 96, align: 'left', lt: li - .04, mode: 'rise', stagger: .02, dur: .35 });
  text(sub, 144, 760, { size: 36, wt: 500, align: 'left', lt: li - .1, mode: 'fade', stagger: .01, dur: .25, color: 'rgba(255,255,255,.7)' });
  // index rail
  for (let k = 0; k < 8; k++) { ctx.fillStyle = k === i ? RED : 'rgba(255,255,255,.25)'; ctx.fillRect(144 + k * 46, 850, 34, k === i ? 6 : 3); }
  mono('GUIDE — 在树成林，说一句话就能拿到', 140, 200, { size: 22, wt: 700, color: '#fff', ls: 2 });
  FX.credit = '';
});
chapter(32.5, 38.5, '07 — 使用指南 · GUIDE');

// 斜率 38.5–43.0
chapter(38.5, 43.0, '08 — 斜率 · SLOPE');
shot(38.5, 43.0, async (lt, t) => {
  fill('#000');
  const O = [260, 960];
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
  const ax = E.outExpo(clamp(lt / .3));
  ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(O[0] + 1460 * ax, O[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(O[0], O[1] - 800 * ax); ctx.stroke();
  ctx.restore();
  mono('时间 TIME →', O[0] + 1460, O[1] + 40, { size: 18, align: 'right' });
  mono('成长 GROWTH ↑', O[0] - 10, O[1] - 820, { size: 18 });
  mono('成长斜率 · GROWTH SLOPE', 260, 150, { size: 22, wt: 700, color: '#fff' });
  // 15° grey
  const g = E.inOutCubic(prog(t, 38.7, .9)), L1 = 1440;
  const a1 = 15 * Math.PI / 180;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(O[0] + L1 * g, O[1] - L1 * g * Math.tan(a1)); ctx.stroke();
  ctx.beginPath(); ctx.arc(O[0], O[1], 200, -a1 * g, 0); ctx.stroke(); ctx.restore();
  if (t > 39.3) text('IP 时代 · 15°', O[0] + L1, O[1] - L1 * Math.tan(a1) - 30, { size: 44, wt: 700, align: 'right', color: 'rgba(255,255,255,.6)', lt: t - 39.3, mode: 'fade' });
  // 60° red
  if (t >= 40.0) {
    const q = E.outExpo(clamp((t - 40.0) / .45)), a2 = 60 * Math.PI / 180, L2 = 1150;
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.shadowColor = RED; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(O[0] + L2 * q * Math.cos(a2), O[1] - L2 * q * Math.sin(a2)); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(O[0], O[1], 280, -a2 * q, 0); ctx.stroke(); ctx.restore();
    const deg = Math.round(60 * q);
    text(`AI 时代 · ${deg}°`, 640, 380, { size: 56, align: 'left', color: RED, mode: 'none' });
  }
  if (t < 41.45) text('两个时代，两种斜率。', 1060, 300, { size: 76, align: 'left', lt: t - 38.55, mode: 'rise', stagger: .03, out: 2.6, outDur: .25 });
  if (t > 41.5) {
    text('斜率，', 1060, 300, { size: 100, align: 'left', lt: t - 41.5, mode: 'rise' });
    text('被 AI 拉得无限陡峭。', 1060, 420, { size: 70, align: 'left', lt: t - 41.875, mode: 'rise', stagger: .025 });
  }
  FX.credit = t > 41.5 ? '摘自 · 从 0 到 1，是最贵的' : '';
});
// 重机枪对骑兵 43.0–44.5
shot(43.0, 44.5, async (lt) => {
  const im = await seq('truth_intro', 100 / FPS);
  cover(im, { zoom: 1.1 + lt * .05, filter: 'brightness(.14) blur(6px)' });
  FX.credit = '摘自 · AI 时代的残酷真相与破局之道';
});
over(43.0, 44.5, (lt) => {
  text('AI 对传统做法，', W / 2, 420, { size: 72, lt, mode: 'rise', stagger: .02 });
  const w1 = measure('是', 170), w2 = measure('重机枪', 170), w3 = measure('对骑兵。', 170); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('是', x0, 640, { size: 170, align: 'left', lt: lt - .375, mode: 'rise' });
  text('重机枪', x0 + w1, 640, { size: 170, align: 'left', lt: lt - .42, mode: 'rise', color: RED });
  text('对骑兵。', x0 + w1 + w2, 640, { size: 170, align: 'left', lt: lt - .5, mode: 'rise' });
  text('这就是代差。', W / 2, 800, { size: 56, wt: 500, lt: lt - .9, mode: 'fade', color: 'rgba(255,255,255,.75)' });
});

// FOMO 44.5–50.5
chapter(44.5, 50.5, '09 — 你在哪 · WHERE ARE YOU');
const FEED = ['cJiang', 'gen1', 'cQiu', 'gen4', 'cShu', 'gen2', 'cYi', 'zhuA', 'gen3', 'kb01', 'codeLive2', 'codeZuihou'];
shot(44.5, 46.75, async (lt, t) => {
  fill('#000');
  const cw = 300, chh = 533;
  for (let c = 0; c < 6; c++) {
    const speed = 1400 + (c % 3) * 400, y0 = -((lt * speed + c * 230) % (chh + 30));
    for (let k = -1; k < 4; k++) {
      const im = await img(FEED[(c * 3 + k + 12 + Math.floor((lt * speed + c * 230) / (chh + 30))) % FEED.length]);
      cover(im, { x: 60 + c * 310, y: y0 + k * (chh + 30), w: cw, h: chh, filter: 'grayscale(1) brightness(.33) blur(2px)' });
    }
  }
  FX.credit = '';
});
over(44.5, 46.0, (lt) => {
  const w1 = measure('你刷短视频的 ', 110), w2 = measure('12', 130, LAT), w3 = measure(' 天里，', 110); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('你刷短视频的 ', x0, H / 2 + 40, { size: 110, align: 'left', lt, mode: 'rise', stagger: .03, shadow: 40 });
  text('12', x0 + w1, H / 2 + 40, { size: 130, fam: LAT, align: 'left', lt: lt - .2, mode: 'rise', color: RED });
  text(' 天里，', x0 + w1 + w2, H / 2 + 40, { size: 110, align: 'left', lt: lt - .25, mode: 'rise', shadow: 40 });
});
over(46.0, 46.75, (lt) => { text('他们往群里，晒出了', W / 2, H / 2 + 40, { size: 110, lt, mode: 'rise', stagger: .03, shadow: 40 }); });
shot(46.75, 50.5, async (lt, t) => {
  fill('#000');
  const cnt = Math.floor(96 * E.outCubic(clamp(lt / 2.25))) + (lt > 2.25 ? 96 : 0);
  await mosaic({ cols: 12, rows: 8, count: cnt, seed: 5, bright: t < 49.0 ? .75 : .9 });
  FX.credit = '';
});
over(46.75, 49.0, (lt) => {
  const n = Math.round(264 * E.outCubic(clamp(lt / 2.25)));
  ctx.fillStyle = 'rgba(0,0,0,.8)'; ctx.fillRect(0, H / 2 - 230, W, 400);
  const w1 = measure('264', 330, LAT), w2 = measure(' 个网站', 110); const x0 = W / 2 - (w1 + w2) / 2;
  text(String(n).padStart(3, '0'), x0, H / 2 + 110, { size: 330, fam: LAT, align: 'left', mode: 'none', color: '#fff', ls: -6 });
  text(' 个网站', x0 + w1, H / 2 + 110, { size: 110, align: 'left', mode: 'none', color: RED });
});
['网站', '写真', '视频', '歌'].forEach((wd, i) => over(bt(120 + i), bt(120 + i) + .37, (lt) => stamp(wd, lt, { size: 420, solid: true })));

// 先做，再想。50.5–52.0
chapter(50.5, 55.02, '10 — 现在 · NOW');
shot(50.5, 52.0, async (lt) => {
  const im = await seq('zero_full', 238 / FPS + lt * 1.1);
  cover(im, { zoom: 1.0 + lt * .08, fy: .5 });
  FX.credit = '摘自 · 从 0 到 1，是最贵的（HOPER VOL.002）';
});
caption(51.1, 52.0, '从 0 到 1 不是知识问题，是动作问题。', { size: 54, y: 960 });
// 快闪 52.0–53.5(16 × 十六分音符)
const FLASH2 = ['wjm1', 'porsche', 'cJiang', 'fzero', 'gen1', 'live1', 'nuelian', 'kaijie1', 'cQiu', 'flang', 'feng1', 'gen3', 'wjm3', 'ftruth', 'cShu', 'fourlaws'];
FLASH2.forEach((k, i) => full(k, 52.0 + i * .09375, 52.0 + (i + 1) * .09375, { z0: 1.05 + i * .02, z1: 1.1 + i * .02 }));
over(52.0, 53.5, (lt) => { FX.rgb = 4 + lt * 10; FX.glitch = lt > 1.1 ? .5 : .15; });
// 下一件作品,署你的名字。53.5–55.02(反白)
shot(53.5, 55.02, async () => { fill('#f4f4f4'); FX.hud = false; FX.grain = .05; });
over(53.5, 55.02, (lt) => {
  text('下一件作品，', W / 2, 470, { size: 150, lt, mode: 'rise', color: '#000', stagger: .04 });
  const w1 = measure('署', 190), w2 = measure('你的名字', 190), w3 = measure('。', 190); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('署', x0, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: '#000' });
  text('你的名字', x0 + w1, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: RED });
  text('。', x0 + w1 + w2, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: '#000' });
});

/* =================== ACT 4 · 品牌落版 55.02–60 =================== */
hudOff(55.02, 60);
shot(55.02, 60, async (lt, t) => {
  fill('#000');
  if (t < 55.42) { const a = E.outCubic(prog(t, 55.1, .3)); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(W / 2, H / 2, 10 * a, 0, 7); ctx.fill(); return; }
  const lt2 = t - 55.42;
  const slide = E.inOutExpo(prog(t, 56.9, .6));
  const cx = lerp(W / 2, 700, slide);
  text('树成林', cx, 560, { size: 250, lt: lt2, mode: 'slam', ls: 10 });
  ctx.fillStyle = RED; ctx.fillRect(cx - 70, 612, 140 * E.outExpo(prog(lt2, .2, .4)), 10);
  text('全国最大的大学生AI社群', cx, 720, { size: 52, wt: 500, lt: lt2 - .35, mode: 'fade', stagger: .02, color: 'rgba(255,255,255,.85)' });
  if (t > 56.9) {
    const q = E.outExpo(prog(t, 57.1, .5)), qr = await img('qr');
    const x = 1230, y = 250, w = 420;
    ctx.save(); ctx.globalAlpha = q; ctx.translate(0, (1 - q) * 60);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, w + 110);
    ctx.drawImage(qr, x + 30, y + 30, w - 60, w - 60);
    text('欢迎加入我们', x + w / 2, y + w + 55, { size: 40, color: '#000', mode: 'none' });
    mono('SCAN · WECHAT', x + w / 2, y + w + 92, { size: 15, align: 'center', color: '#8a8a8a' });
    ctx.restore();
  }
  if (t > 57.8) {
    ctx.save(); ctx.globalAlpha = E.outCubic(prog(t, 57.8, .5));
    mono('FIRST EDUCATION · STUDENT AI ARCHIVE © 2026', 56, H - 60, { size: 17, wt: 700 });
    mono('shuchenglin-handbook.pages.dev', W - 56, H - 60, { size: 17, wt: 700, align: 'right' });
    // 未完待续 · 红点呼吸(官网终幕同款)
    text('未完待续', cx - 30, 830, { size: 34, wt: 500, mode: 'none', color: 'rgba(255,255,255,.6)' });
    const br = .6 + .4 * Math.sin(t * 5);
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(cx + 58, 820, 7 * br + 3, 0, 7); ctx.fill();
    ctx.restore();
  }
  FX.grain = .08;
  const fo = E.inCubic(prog(t, 59.35, .65)); if (fo > 0) fill('#000', fo);
});

/* =================== RENDER =================== */
async function seek(t) {
  resetFX();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  fill('#000');
  // overlays that set FX first (cheap pre-pass so camera knows about shake)
  // camera
  let punch = beatPunch(t);
  for (const [ht, a] of HITS) if (t >= ht && t < ht + .6) { punch += .08 * a * Math.exp(-(t - ht) * 9); }
  let shake = 0; for (const [ht, a] of HITS) if (t >= ht && t < ht + .5) shake += 26 * a * Math.exp(-(t - ht) * 10);
  // base
  const active = SHOTS.filter(s => t >= s.s && t < s.e);
  const r = rng(Math.floor(t * 30) + 1);
  ctx.save();
  const sc = 1 + punch + (shake > 0 ? .03 : 0);
  ctx.translate(W / 2 + (r() - .5) * shake, H / 2 + (r() - .5) * shake); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
  for (const s of active) await s.f(t - s.s, t);
  ctx.restore();
  // overlays
  for (const o of OVER) if (t >= o.s && t < o.e) {
    await o.f(t - o.s, t);
  }
  if (FX.shakeAmp > 0) { OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0); fill('#000'); ctx.drawImage(OFF, (r() - .5) * FX.shakeAmp, (r() - .5) * FX.shakeAmp); }
  // hit flashes
  for (const [ht, a] of HITS) if (t >= ht && t < ht + .25) fill('#fff', .55 * a * (1 - (t - ht) / .25));
  // chroma on bars in drops
  const bp = beatPunch(t); if (bp > .03) FX.rgb = Math.max(FX.rgb, bp * 260);
  glitchSlices(FX.glitch, Math.floor(t * 30) * 17);
  rgbSplit(FX.rgb);
  // grain + vignette
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = FX.grain; ctx.drawImage(GR[Math.floor(t * 30) % 3], 0, 0, W, H); ctx.restore();
  ctx.drawImage(VIG, 0, 0);
  hud(t);
}
window.renderFrame = async (i) => { await seek(i / FPS); return cv.toDataURL('image/jpeg', .93); };
window.preload = async () => {
  await document.fonts.load('900 100px "Noto Sans CJK SC"'); await document.fonts.load('500 100px "Noto Sans CJK SC"');
  await document.fonts.load('700 100px "Noto Sans CJK SC"');
  await document.fonts.load('900 100px "Archivo"'); await document.fonts.load('400 20px "Space Mono"'); await document.fonts.load('700 20px "Space Mono"');
  await Promise.all(Object.keys(IMG).map(img));
  return 'ok';
};
```

### 9/10 · `树成林宣传片-工程源码/render.py`
<!-- casebook-file {"path": "树成林宣传片-工程源码/render.py", "lines": 28, "final_newline": true, "sha256": "081196357e04f91e83b1404dc306a0714eaf3169db42ed2f245547b2d6796377", "original_sha256": "081196357e04f91e83b1404dc306a0714eaf3169db42ed2f245547b2d6796377"} -->
```python
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
```

### 10/10 · `树成林宣传片-工程源码/vtime.js`
<!-- casebook-file {"path": "树成林宣传片-工程源码/vtime.js", "lines": 27, "final_newline": true, "sha256": "66a7b8dd13d25b7baa5c7fa40cdc00ff13f97ae851f52aa9f2b8b70d7721d56c", "original_sha256": "66a7b8dd13d25b7baa5c7fa40cdc00ff13f97ae851f52aa9f2b8b70d7721d56c"} -->
```js
(()=>{
  let vt=0; const t0=Date.now();
  const rafQ=new Map(); let rafId=1; const timers=new Map(); let tid=1;
  const _pn=performance.now.bind(performance);
  performance.now=()=>vt;
  Date.now=()=>t0+vt;
  const OD=Date;
  window.Date=class extends OD{constructor(...a){ if(a.length===0) super(t0+vt); else super(...a);} static now(){return t0+vt}};
  window.requestAnimationFrame=cb=>{const id=rafId++;rafQ.set(id,cb);return id};
  window.cancelAnimationFrame=id=>{rafQ.delete(id)};
  window.setTimeout=(cb,ms=0,...a)=>{const id=tid++;timers.set(id,{cb,at:vt+Math.max(0,+ms||0),a});return id};
  window.clearTimeout=id=>{timers.delete(id)};
  window.setInterval=(cb,ms=0,...a)=>{const e=Math.max(4,+ms||0);const id=tid++;timers.set(id,{cb,at:vt+e,a,every:e});return id};
  window.clearInterval=window.clearTimeout;
  const animStart=new WeakMap();
  window.__vt=()=>vt;
  window.__advance=(dt)=>{
    const target=vt+dt; let guard=0;
    while(guard++<5000){ let nid=null,nt=null; for(const [id,t] of timers){ if(t.at<=target && (!nt||t.at<nt.at)){nid=id;nt=t;} } if(!nt)break;
      vt=Math.max(vt,nt.at); if(nt.every) nt.at+=nt.every; else timers.delete(nid);
      try{ typeof nt.cb==='function'?nt.cb(...nt.a):(0,eval)(nt.cb)}catch(e){console.error(e)} }
    vt=target;
    const cbs=[...rafQ.values()]; rafQ.clear(); for(const cb of cbs){try{cb(vt)}catch(e){console.error(e)}}
    try{ for(const a of document.getAnimations()){ if(!animStart.has(a)) animStart.set(a, vt-(a.currentTime||0)); a.pause(); a.currentTime=vt-animStart.get(a);} }catch(e){}
    document.querySelectorAll('video').forEach(v=>{ if(v.__vt0===undefined){v.__vt0=vt;} try{ v.pause(); if(v.duration) v.currentTime=((vt-v.__vt0)/1000)%v.duration; }catch(e){} });
  };
})();
```

