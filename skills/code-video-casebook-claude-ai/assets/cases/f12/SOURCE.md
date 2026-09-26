# f12 · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show f12 <路径>`；还原成真实目录：`python3 scripts/casebook.py copy f12 <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `F12-Field-Guide-source/build.py` | 6 | 28 |
| 2 | `F12-Field-Guide-source/music.py` | 266 | 39 |
| 3 | `F12-Field-Guide-source/package.json` | 17 | 310 |
| 4 | `F12-Field-Guide-source/render.mjs` | 38 | 332 |
| 5 | `F12-Field-Guide-source/site/src/app.js` | 71 | 375 |
| 6 | `F12-Field-Guide-source/site/src/console.js` | 112 | 451 |
| 7 | `F12-Field-Guide-source/site/src/core.js` | 245 | 568 |
| 8 | `F12-Field-Guide-source/site/src/elements.js` | 191 | 818 |
| 9 | `F12-Field-Guide-source/site/src/network.js` | 67 | 1014 |
| 10 | `F12-Field-Guide-source/site/src/page.html` | 524 | 1086 |
| 11 | `F12-Field-Guide-source/site/src/perf.js` | 123 | 1615 |
| 12 | `F12-Field-Guide-source/site/src/shell.js` | 217 | 1743 |
| 13 | `F12-Field-Guide-source/site/src/sources.js` | 262 | 1965 |
| 14 | `F12-Field-Guide-source/smoke.mjs` | 54 | 2232 |
| 15 | `F12-Field-Guide-source/video.html` | 822 | 2291 |
| 16 | `F12-Field-Guide.html` | 1823 | 3118 |

---

### 1/16 · `F12-Field-Guide-source/build.py`
<!-- casebook-file {"path": "F12-Field-Guide-source/build.py", "lines": 6, "final_newline": true, "sha256": "540180380ed15e0ee8aea9df86b971aee2545facd1c7896c87ac2bec6692dcdb", "original_sha256": "540180380ed15e0ee8aea9df86b971aee2545facd1c7896c87ac2bec6692dcdb"} -->
```python
src='site/src/'
page=open(src+'page.html').read()
js='\n'.join(open(src+f).read() for f in ['core.js','elements.js','console.js','sources.js','network.js','perf.js','app.js','shell.js'])
js=js.replace('</script>','<\\/script>')
open('site/index.html','w').write(page+'\n<script>\n"use strict";\n'.replace('"use strict";\n','')+js+'\n</script>\n')
print(len(page)+len(js))
```

### 2/16 · `F12-Field-Guide-source/music.py`
<!-- casebook-file {"path": "F12-Field-Guide-source/music.py", "lines": 266, "final_newline": true, "sha256": "0e22f0aa3e7bdece24848d4dce5a71e2805c67c964aa8d3f17fc0f605e56a622", "original_sha256": "0e22f0aa3e7bdece24848d4dce5a71e2805c67c964aa8d3f17fc0f605e56a622"} -->
```python
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
DUR = 60.0
N = int(SR * DUR)
B = 60 / 128
BAR = 4 * B
rng = np.random.default_rng(12)

L = np.zeros(N); R = np.zeros(N)
send = np.zeros(N)  # reverb send (mono)


def t_arr(d):
    return np.arange(int(d * SR)) / SR


def add(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= N: return
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def addst(sig, t0, gain=1.0, pan=0.0, rev=0.0):
    gl = np.cos((pan + 1) * np.pi / 4); gr = np.sin((pan + 1) * np.pi / 4)
    add(L, sig, t0, gain * gl * 1.414); add(R, sig, t0, gain * gr * 1.414)
    if rev: add(send, sig, t0, gain * rev)


def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def saw(freq, t):
    ph = (freq * t) % 1.0
    return 2 * ph - 1


def env(t, a, d):
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)

# ---------------- instruments ----------------

def kick(g=1.0):
    t = t_arr(0.45)
    f = 45 + 110 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.28)
    s += 0.25 * np.sin(ph * 2) * np.exp(-t / 0.05)
    click = signal.sosfilt(sos('highpass', 3000), rng.standard_normal(len(t))) * np.exp(-t / 0.004) * 0.4
    return np.tanh((s + click) * 1.6) * g


def clap():
    t = t_arr(0.35)
    n = rng.standard_normal(len(t))
    e = np.zeros(len(t))
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-np.maximum(0, t - o) / (0.008 if k < 2 else 0.12))
    s = signal.sosfilt(sos('bandpass', [900, 4200]), n) * e
    return s * 0.9


def hat(open_=False):
    t = t_arr(0.3 if open_ else 0.06)
    n = rng.standard_normal(len(t))
    s = signal.sosfilt(sos('highpass', 7500), n) * np.exp(-t / (0.09 if open_ else 0.014))
    return s * (0.35 if open_ else 0.25)


def bass(freq, d):
    t = t_arr(d)
    s = saw(freq, t) + 0.6 * saw(freq * 1.005, t) + 0.5 * np.sin(2 * np.pi * freq / 2 * t)
    s = signal.sosfilt(sos('lowpass', 520), s)
    return s * env(t, 0.004, d * 0.9) * 0.5


def pluck(freq, d=0.25, bright=3200):
    t = t_arr(d)
    s = saw(freq, t) * 0.6 + np.sign(np.sin(2 * np.pi * freq * 1.002 * t)) * 0.4
    s = signal.sosfilt(sos('lowpass', bright), s)
    return s * env(t, 0.002, 0.07) * 0.22


def supersaw(freqs, d, cutoff=2400):
    t = t_arr(d)
    s = np.zeros(len(t))
    for f in freqs:
        for det in (-0.012, -0.005, 0, 0.006, 0.013):
            s += saw(f * (1 + det), t + rng.random())
    s = signal.sosfilt(sos('lowpass', cutoff), s) / (len(freqs) * 5)
    a = np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.08)
    return s * a


def pad(freqs, d):
    t = t_arr(d)
    s = np.zeros(len(t))
    for f in freqs:
        for det in (-0.004, 0.004):
            s += np.sin(2 * np.pi * f * (1 + det) * t) + 0.3 * np.sin(2 * np.pi * f * 2 * (1 + det) * t)
    a = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)
    return s * a / (len(freqs) * 2) * 0.5


def impact(g=1.0):
    t = t_arr(2.2)
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.7)
    n = signal.sosfilt(sos('lowpass', 5000), rng.standard_normal(len(t))) * np.exp(-t / 0.18) * 0.6
    return np.tanh((boom + n) * 1.4) * g


def riser(d):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    blk = 1024
    for i in range(0, len(t), blk):
        p = i / len(t)
        fc = 300 * (1 - p) + 9000 * p
        seg = n[i:i + blk]
        out[i:i + blk] = signal.sosfilt(sos('bandpass', [fc * 0.6, min(fc * 1.6, 20000)], 1), seg)
    f = 200 * (1 + 6 * (t / d) ** 2)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    return (out * 0.6 + tone) * (t / d) ** 1.6


def whoosh(d=0.5):
    t = t_arr(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    blk = 512
    for i in range(0, len(t), blk):
        p = i / len(t)
        fc = 6000 * (1 - p) + 400 * p
        out[i:i + blk] = signal.sosfilt(sos('bandpass', [fc * 0.7, fc * 1.4], 1), n[i:i + blk])
    return out * np.sin(np.pi * t / d) ** 0.7 * 0.8


def glitch():
    t = t_arr(0.14)
    f = 1200 * (1 + (np.floor(t * 180) % 4))
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.25
    s = np.round(s * 4) / 4
    return s * np.exp(-t / 0.08)

# ---------------- arrangement ----------------
chords = {  # A minor: i - VI - III - VII
    0: (55.0, [220.0, 261.63, 329.63]),
    1: (43.65, [174.61, 220.0, 261.63]),
    2: (65.41, [196.0, 261.63, 329.63]),
    3: (49.0, [196.0, 246.94, 293.66]),
}
DROP1 = (4, 21)    # bars [4, 21)
BREAK = (21, 23)
DROP2 = (23, 31)
cuts_bars = [2, 4, 7, 9, 12, 15, 18, 21, 23, 25, 27, 29, 31]

sc = np.ones(N)  # sidechain gain curve


def in_drop(bar):
    return DROP1[0] <= bar < DROP1[1] or DROP2[0] <= bar < DROP2[1]

for bar in range(32):
    t0 = bar * BAR
    root, tri = chords[bar % 4]
    drop = in_drop(bar)
    # pads everywhere except drop2 uses supersaw
    if bar < 4 or BREAK[0] <= bar < BREAK[1]:
        addst(pad([f / 2 for f in tri] + tri, BAR), t0, 0.55, 0, rev=0.4)
    if drop:
        hi = bar >= DROP2[0]
        for beat in range(4):
            tb = t0 + beat * B
            addst(kick(), tb, 0.95)
            i = int(tb * SR); k = int(0.22 * SR)
            if i < N:
                j = min(N, i + k)
                sc[i:j] = np.minimum(sc[i:j], 0.25 + 0.75 * (np.arange(j - i) / k) ** 0.6)
            if beat in (1, 3):
                addst(clap(), tb, 0.55, 0, rev=0.25)
            addst(hat(True), tb + B / 2, 0.55, 0.25)
            for s16 in range(4):
                addst(hat(), tb + s16 * B / 4, 0.5 if s16 % 2 else 0.3, -0.3)
            # bass: offbeat 8ths (pumping)
            for e in range(2):
                addst(bass(root * (2 if e else 1), B / 2 * 0.95), tb + e * B / 2, 0.9)
        # arp 16ths
        notes = [tri[0], tri[1], tri[2], tri[1] * 2, tri[2] * 2, tri[0] * 2, tri[1], tri[2]]
        for s in range(16):
            f = notes[s % 8] * 2
            addst(pluck(f, 0.22, 2600 + 1800 * (s % 4 == 0)), t0 + s * B / 4, 0.8 if hi else 0.65, 0.5 if s % 2 else -0.5, rev=0.25)
        if hi or bar >= 12:
            addst(supersaw([f for f in tri] + [tri[0] * 2], BAR, 2600 if hi else 1800), t0, 0.55 if hi else 0.35, 0, rev=0.3)
    elif bar < 4:
        # intro: filtered arp + hats from bar 2
        notes = [tri[0], tri[1], tri[2], tri[1] * 2]
        for s in range(8):
            addst(pluck(notes[s % 4] * 2, 0.3, 900 + 500 * bar), t0 + s * B / 2, 0.55, 0.4 if s % 2 else -0.4, rev=0.5)
        if bar >= 2:
            for s in range(8):
                addst(hat(), t0 + s * B / 2, 0.35)
    elif BREAK[0] <= bar < BREAK[1]:
        notes = [tri[0], tri[1], tri[2], tri[1] * 2]
        for s in range(8):
            addst(pluck(notes[s % 4] * 2, 0.35, 1100), t0 + s * B / 2, 0.55, 0.4 if s % 2 else -0.4, rev=0.6)
        addst(kick(0.7), t0, 0.7)

# risers + snare rolls into drops
for start_bar, length in [(2, 2), (22, 1), (29.5, 1.5)]:
    addst(riser(length * BAR), start_bar * BAR, 0.5, 0, rev=0.3)
for rb in [3, 22]:
    n = 16
    for k in range(n):
        tt = rb * BAR + BAR * (1 - 0.5 ** (k / 3.5)) if False else rb * BAR + k * BAR / n
        addst(clap(), tt, 0.15 + 0.4 * k / n, 0, rev=0.2)

# impacts
addst(impact(1.0), B, 0.9, 0, rev=0.5)          # F12 slam
addst(impact(0.9), 4 * BAR, 0.8, 0, rev=0.4)    # drop 1
addst(impact(0.9), 23 * BAR, 0.8, 0, rev=0.4)   # drop 2
addst(impact(1.0), 31 * BAR, 1.0, 0, rev=0.6)   # outro
# outro chord tail
addst(supersaw([220.0, 261.63, 329.63, 440.0], 1.9, 3000), 31 * BAR, 0.6, 0, rev=0.6)
addst(pad([110, 220.0, 261.63, 329.63], 1.9), 31 * BAR, 0.6, 0, rev=0.5)

# transitions: whoosh ending at cut + glitch on cut
for cb in cuts_bars:
    tc = cb * BAR
    addst(whoosh(0.45), tc - 0.42, 0.45, rng.uniform(-.5, .5), rev=0.2)
    addst(glitch(), tc, 0.35, rng.uniform(-.6, .6))

# apply sidechain to everything but kicks is complex; approximate: duck musical bus by sc
# (kick is already mixed in; ducking it slightly is fine since sc recovers by next beat)
L *= sc ** 0.55; R *= sc ** 0.55
# re-add kicks punch on top (so they are not ducked)
for bar in range(32):
    if in_drop(bar):
        for beat in range(4):
            addst(kick(), bar * BAR + beat * B, 0.35)

# reverb via convolution with decaying noise IR
irt = t_arr(2.4)
irL = rng.standard_normal(len(irt)) * np.exp(-irt / 0.55)
irR = rng.standard_normal(len(irt)) * np.exp(-irt / 0.55)
irL = signal.sosfilt(sos('lowpass', 6000), irL); irR = signal.sosfilt(sos('lowpass', 6000), irR)
wet_src = signal.sosfilt(sos('highpass', 250), send)
wl = signal.fftconvolve(wet_src, irL)[:N]; wr = signal.fftconvolve(wet_src, irR)[:N]
wl /= np.max(np.abs(wl)) + 1e-9; wr /= np.max(np.abs(wr)) + 1e-9
L += wl * 0.18; R += wr * 0.18

# master: gentle low-end tidy, soft clip, fade
mix = np.stack([L, R], 1)
mix = signal.sosfilt(sos('highpass', 28), mix, axis=0)
mix /= np.percentile(np.abs(mix), 99.7)
mix = np.tanh(mix * 1.15) * 0.92
fade = np.ones(N); fl = int(0.6 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
fi = int(0.01 * SR); fade[:fi] = np.linspace(0, 1, fi)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.93
wavfile.write('/home/claude/f12/music.wav', SR, (mix * 32767).astype(np.int16))
print('ok', mix.shape)
```

### 3/16 · `F12-Field-Guide-source/package.json`
<!-- casebook-file {"path": "F12-Field-Guide-source/package.json", "lines": 17, "final_newline": true, "sha256": "cdbdfbfa3245280e6004fee23efbaa611016b34b72cc0b4cf01e868c22eebadf", "original_sha256": "cdbdfbfa3245280e6004fee23efbaa611016b34b72cc0b4cf01e868c22eebadf"} -->
```json
{
  "name": "f12",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@fontsource/bricolage-grotesque": "^5.3.0",
    "@fontsource/ibm-plex-sans": "^5.3.0",
    "@fontsource/jetbrains-mono": "^5.3.0"
  }
}
```

### 4/16 · `F12-Field-Guide-source/render.mjs`
<!-- casebook-file {"path": "F12-Field-Guide-source/render.mjs", "lines": 38, "final_newline": true, "sha256": "0173ef3fbff67020861b643108ed902904bdaba72f00b01adb1ae3ff541400eb", "original_sha256": "0173ef3fbff67020861b643108ed902904bdaba72f00b01adb1ae3ff541400eb"} -->
```js
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import fs from 'fs';

const mode = process.argv[2] || 'sample';
const FPS = 30, DUR = 60;
const browser = await chromium.launch({ args: ['--disable-web-security', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGEERR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto('file:///home/claude/f12/video.html');
await page.waitForFunction(() => window.__ready === true);

if (mode === 'sample') {
  const times = (process.argv[3] || '1,2.5,5,9,11,12.5,15,19,21.5,25,27,30,33,35.5,38,41,44,46,48,50,52,55,57.5,59').split(',').map(Number);
  fs.mkdirSync('/home/claude/f12/samples', { recursive: true });
  for (const t of times) {
    // walk from scene start to t so any first-frame builders run
    await page.evaluate(t => { window.render(Math.max(0, t - 0.5)); window.render(t); }, t);
    await page.screenshot({ path: `/home/claude/f12/samples/t${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 80 });
  }
  console.log('samples done');
} else {
  const start = +(process.argv[3] || 0), end = +(process.argv[4] || FPS * DUR);
  const out = process.argv[5] || '/home/claude/f12/video_raw.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = start; f < end; f++) {
    await page.evaluate(t => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', out);
}
await browser.close();
```

### 5/16 · `F12-Field-Guide-source/site/src/app.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/app.js", "lines": 71, "final_newline": true, "sha256": "067feeaae6dc63a737572f284974210cfcf8fe4525e2e901e0fc9cf28e299d87", "original_sha256": "067feeaae6dc63a737572f284974210cfcf8fe4525e2e901e0fc9cf28e299d87"} -->
```js
/* ================= Application ================= */
const AP={view:'ls'};
const ATREE=[['h','Application'],[1,'manifest','📄 Manifest'],[1,'sw','⚙ Service workers'],[1,'storage','▤ Storage'],['h','Storage'],[1,null,'▾ ▦ Local storage'],[2,'ls','https://driftwood.coffee'],[1,null,'▾ ▦ Session storage'],[2,'ss','https://driftwood.coffee'],[1,null,'▾ ⛁ IndexedDB'],[2,'idb','driftwood-db · orders'],[1,null,'▾ ◔ Cookies'],[2,'cookies','https://driftwood.coffee'],[1,null,'▾ ⛁ Cache storage'],[2,'cache','sw-v3 — https://driftwood.coffee'],['h','Background services'],[1,'bfcache','⇆ Back/forward cache'],[1,'push','✉ Push messaging']];
function buildApp(p){p.innerHTML=`<div style="flex:1;display:flex;min-height:0"><div class="atree scroll" id="atree" data-hs="app-tree"></div><div class="aview" id="aview" data-hs="app-view"></div></div>`;
 $('#atree').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;AP.view=b.dataset.v;renderApp();track('app-'+AP.view)};bus.on('storage',()=>{if(P.application.built&&document.activeElement?.tagName!=='TD')renderApp()});renderApp()}
function renderApp(){const t=$('#atree'),v=$('#aview');if(!t)return;t.innerHTML=ATREE.map(([d,k,l])=>d==='h'?`<div class="h">${l}</div>`:`<button style="--d:${d}" ${k?`data-v="${k}"`:''} class="${k===AP.view?'on':''}">${l}</button>`).join('');
 const kvTable=(M,label)=>{v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="kvClear" title="Clear all">${IC.clear}</button><button class="tbb" id="kvDel" title="Delete selected">✕</button><input class="inp" id="kvF" placeholder="Filter"></div><div class="scroll" style="flex:1"><table class="tbl" id="kvT"><thead><tr><th style="width:34%">Key</th><th>Value</th></tr></thead><tbody>${[...M].map(([k,val],i)=>`<tr data-k="${esc(k)}"><td class="m" contenteditable="true" data-f="k">${esc(k)}</td><td class="m" contenteditable="true" data-f="v">${esc(val)}</td></tr>`).join('')}<tr><td class="m" contenteditable="true" data-f="new" style="color:#6E7379"></td><td class="m"></td></tr></tbody></table><div style="padding:10px 12px;font:400 12px/1.6 var(--body);color:#9AA0A6;border-top:1px solid var(--dtl)">Double-click a value to edit it; the page reads these keys. Try setting <code>theme</code> to <code>dark</code>. ${label}</div><div id="kvPrev" class="pre" style="border-top:1px solid var(--dtl)"></div></div>`;
  const T=$('#kvT');let selK=null;T.onclick=e=>{const tr=e.target.closest('tr[data-k]');if(!tr)return;$$('tr',T).forEach(r=>r.classList.toggle('sel',r===tr));selK=tr.dataset.k;const val=M.get(selK);const pv=$('#kvPrev');pv.innerHTML='';try{pv.appendChild(renderVal(JSON.parse(val),false,true));const hd=$('.hd',pv);if(hd)hd.click()}catch{pv.textContent=val}};
  T.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();e.target.blur()}});
  T.addEventListener('focusout',e=>{const td=e.target;if(!td.dataset||!td.dataset.f)return;const tr=td.closest('tr');const txt=td.textContent.trim();
   if(td.dataset.f==='new'){if(txt){M.set(txt,'');bus.emit('storage');track('storage-edit')}return}
   const k=tr.dataset.k;if(td.dataset.f==='v'){if(M.get(k)!==txt){M.set(k,txt);if(M===LS&&k==='theme')setTheme(txt==='dark'?'dark':'light');if(M===LS&&k==='cart')syncCartFromLS();track('storage-edit');bus.emit('storage')}}
   else if(txt!==k){const val=M.get(k);M.delete(k);if(txt)M.set(txt,val);bus.emit('storage')}});
  $('#kvClear').onclick=()=>{M.clear();if(M===LS){cart.items=[];renderCart()}bus.emit('storage')};$('#kvDel').onclick=()=>{if(selK!=null){M.delete(selK);if(M===LS&&selK==='cart'){cart.items=[];renderCart()}bus.emit('storage')}};
  $('#kvF').oninput=e=>{$$('tr[data-k]',T).forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(e.target.value.toLowerCase()))}};
 if(AP.view==='ls')kvTable(LS,'localStorage survives restarts; it is readable by any script on the origin, so never put tokens here.');
 else if(AP.view==='ss')kvTable(SS,'sessionStorage is per tab and is wiped when the tab closes.');
 else if(AP.view==='cookies'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="ckClear" title="Clear all cookies">${IC.clear}</button><button class="tbb" id="ckDel" title="Delete selected">✕</button><input class="inp" placeholder="Filter"><label class="ck"><input type="checkbox" id="ckIssue">Only show cookies with an issue</label></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>Path</th><th>Expires / Max-Age</th><th>Size</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th><th>Priority</th></tr></thead><tbody>${COOKIES.filter(c=>!AP.onlyIssue||c.issue).map((c,i)=>`<tr data-i="${COOKIES.indexOf(c)}" style="${c.issue?'background:rgba(253,214,99,.1)':''}"><td>${c.issue?'<span style="color:#FDD663">▲</span> ':''}${esc(c.name)}</td><td class="m" contenteditable="true" data-cv="${COOKIES.indexOf(c)}">${esc(c.value)}</td><td>${c.domain}</td><td>${c.path}</td><td class="m">${c.expires}</td><td class="m">${c.name.length+c.value.length}</td><td class="g">${c.httpOnly?'✓':''}</td><td class="g">${c.secure?'✓':''}</td><td>${c.sameSite}</td><td>${c.priority}</td></tr>`).join('')}</tbody></table>
  <div id="ckInfo" style="padding:10px 12px;font:400 12.5px/1.6 var(--body);color:#BDC1C6;border-top:1px solid var(--dtl)"><b>HttpOnly</b> cookies are invisible to <code>document.cookie</code> (try it in the Console). <b>Secure</b> means HTTPS only. <b>SameSite</b> controls whether the cookie rides along on cross-site requests: <code>Strict</code> never, <code>Lax</code> on top-level navigation, <code>None</code> always (and then it must be Secure).</div></div>`;
  let sel=null;$$('tr[data-i]',v).forEach(tr=>tr.onclick=()=>{sel=+tr.dataset.i;$$('tr',v).forEach(r=>r.classList.toggle('sel',r===tr));const c=COOKIES[sel];$('#ckInfo').innerHTML=c.issue?`<span style="color:#FDD663">▲ ${esc(c.issue)}</span>`:`<span class="mono">${esc(c.name)}=${esc(c.value)}</span><br><span style="color:#9AA0A6">${c.httpOnly?'HttpOnly — hidden from JavaScript. ':''}${c.secure?'Secure — HTTPS only. ':''}SameSite=${c.sameSite}.</span>`;track('cookie-inspect')});
  $$('[data-cv]',v).forEach(td=>{td.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();td.blur()}};td.onblur=()=>{COOKIES[+td.dataset.cv].value=td.textContent.trim();track('storage-edit')}});
  $('#ckIssue').checked=!!AP.onlyIssue;$('#ckIssue').onchange=e=>{AP.onlyIssue=e.target.checked;renderApp()};$('#ckClear').onclick=()=>{COOKIES=[];renderApp()};$('#ckDel').onclick=()=>{if(sel!=null){COOKIES.splice(sel,1);renderApp()}}}
 else if(AP.view==='idb'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="idbClear">${IC.clear} Clear object store</button><span style="color:#9AA0A6">Start from key</span><input class="inp" style="width:100px"></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th style="width:50px">#</th><th style="width:160px">Key (Key path: "id")</th><th>Value</th></tr></thead><tbody>${IDB.map((r,i)=>`<tr><td class="m">${i}</td><td class="m">"${esc(r.key)}"</td><td class="m">${esc(r.value)}</td></tr>`).join('')}</tbody></table><div style="padding:10px 12px;color:#9AA0A6;font:400 12.5px var(--body)">Total entries: ${IDB.length} · Database version 3 · Object store "orders"</div></div>`;$('#idbClear').onclick=()=>{IDB=[];renderApp()}}
 else if(AP.view==='cache'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb">${IC.clear}</button><input class="inp" placeholder="Filter by path"></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>#</th><th>Name</th><th>Response-Type</th><th>Content-Type</th><th>Content-Length</th><th>Time Cached</th></tr></thead><tbody>${(CACHES[0]?CACHES[0].entries:[]).map((e,i)=>`<tr><td class="m">${i}</td><td class="m">${e[0]}</td><td>basic</td><td>${e[1]}</td><td class="m">${e[2]}</td><td class="m">9/24/2026, 9:14:03 PM</td></tr>`).join('')}</tbody></table><div style="padding:10px 12px;color:#9AA0A6;font:400 12.5px var(--body)">The service worker serves these copies when the network is unavailable.</div></div>`}
 else if(AP.view==='sw'){v.innerHTML=`<div class="scroll" style="flex:1;padding:14px 16px;font:400 12.5px/1.9 var(--body)"><div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:10px"><label class="ck"><input type="checkbox" id="swOff" ${ST.offline?'checked':''}>Offline</label><label class="ck"><input type="checkbox" id="swUpd" ${SW.updateOnReload?'checked':''}>Update on reload</label><label class="ck"><input type="checkbox" id="swBy" ${SW.bypass?'checked':''}>Bypass for network</label></div>
  <div class="kv" style="padding:0"><div><b>Source</b><span style="color:#8AB4F8;text-decoration:underline">sw.js</span><span style="color:#9AA0A6;font-family:var(--body)">&nbsp; Received 9/24/2026, 9:14:03 PM</span></div><div><b>Status</b><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#81C995;margin-right:6px"></i>${SW.version} ${SW.status}</span> <button class="pill" id="swStop" style="margin-left:8px">stop</button></div><div><b>Clients</b><span>https://driftwood.coffee/shop</span></div><div><b>Push</b><span><input class="inp" value="Test push message from DevTools." style="width:220px;font-family:var(--body)"> <button class="pill" id="swPush">Push</button></span></div><div><b>Sync</b><span><input class="inp" value="test-tag-from-devtools" style="width:220px"> <button class="pill">Sync</button></span></div><div><b>Update Cycle</b><span>#412 Install ✓ · Wait ✓ · Activate ✓</span></div></div>
  <p style="color:#9AA0A6;margin-top:10px">Tick <b>Offline</b>, then reload the page: the Network panel shows every request failing and the page gets the offline error. Untick it and reload to recover.</p></div>`;
  $('#swOff').onchange=e=>{ST.offline=e.target.checked;toast(ST.offline?'Offline — reload to see it':'Back online');track('sw-offline')};$('#swUpd').onchange=e=>SW.updateOnReload=e.target.checked;$('#swBy').onchange=e=>SW.bypass=e.target.checked;$('#swPush').onclick=()=>toast('Push event delivered to the service worker');$('#swStop').onclick=()=>toast('Service worker stopped — it restarts on the next fetch')}
 else if(AP.view==='manifest'){v.innerHTML=`<div class="scroll" style="flex:1;padding:14px 16px;font:400 12.5px/1.9 var(--body)"><div style="font:600 14px var(--body)">App Manifest <span style="color:#8AB4F8;font-weight:400;text-decoration:underline">manifest.json</span></div>
  <div class="kv" style="padding:6px 0"><div><b>Name</b><span>Driftwood Specialty Coffee</span></div><div><b>Short name</b><span>Driftwood</span></div><div><b>Start URL</b><span>/shop?source=pwa</span></div><div><b>Theme color</b><span><i style="display:inline-block;width:11px;height:11px;background:#E4572E;border:1px solid #777;margin-right:6px"></i>#E4572E</span></div><div><b>Background color</b><span><i style="display:inline-block;width:11px;height:11px;background:#F4EFE8;border:1px solid #777;margin-right:6px"></i>#F4EFE8</span></div><div><b>Display</b><span>standalone</span></div></div>
  <div style="font:600 13px var(--body);margin-top:8px">Installability</div><div style="color:#FDD663">▲ Manifest does not have a 512×512 PNG icon — add one to be installable.</div><div style="font:600 13px var(--body);margin-top:8px">Icons</div><div style="display:flex;gap:14px;align-items:end"><div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#E4572E,#7A2E1A)"></div><div style="width:96px;height:96px;border-radius:22px;background:linear-gradient(135deg,#E4572E,#7A2E1A)"></div><span style="color:#9AA0A6">192×192 · 96×96</span></div></div>`}
 else if(AP.view==='storage'){const ls=[...LS].reduce((a,[k,x])=>a+k.length+x.length,0)*2;const parts=[['IndexedDB',IDB.length?2.9e6:0,'#4FA3F7'],['Cache storage',CACHES.length?1.1e6:0,'#93C47D'],['Service workers',2e5,'#F6B26B'],['Local storage',ls,'#FFE599']];const tot=parts.reduce((a,p)=>a+p[1],0);let off=25;
  v.innerHTML=`<div class="scroll" style="flex:1;padding:16px 18px;font:400 13px/1.9 var(--body)"><div style="font:600 15px var(--body)">Storage</div><div style="color:#9AA0A6">https://driftwood.coffee</div><div style="display:flex;gap:26px;align-items:center;margin-top:10px;flex-wrap:wrap"><svg viewBox="0 0 42 42" width="150" height="150"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/>${tot?parts.map(([n,s,c])=>{const pc=s/tot*100;const o=`<circle cx="21" cy="21" r="15.9" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${off}"/>`;off-=pc;return o}).join(''):''}</svg>
  <div><div><b class="mono" style="font-size:19px">${fmtBytes(tot)}</b> used out of 1.8 GB storage quota</div>${parts.map(([n,s,c])=>`<div><i style="display:inline-block;width:10px;height:10px;background:${c};margin-right:8px"></i>${n} <span class="mono">${fmtBytes(s)}</span></div>`).join('')}</div></div>
  <div style="margin-top:12px;display:flex;flex-direction:column;gap:2px"><label class="ck"><input type="checkbox" checked>Unregister service workers</label><label class="ck"><input type="checkbox" checked>Local and session storage</label><label class="ck"><input type="checkbox" checked>IndexedDB</label><label class="ck"><input type="checkbox" checked>Cookies</label><label class="ck"><input type="checkbox" checked>Cache storage</label></div>
  <div style="margin-top:10px"><button class="btnp" id="csd">Clear site data</button> <label class="ck" style="margin-left:10px"><input type="checkbox">Simulate custom storage quota</label></div></div>`;
  $('#csd').onclick=clearSiteData}
 else if(AP.view==='bfcache'){v.innerHTML=`<div style="padding:16px 18px;font:400 13px/1.8 var(--body)"><div style="font:600 15px var(--body)">Back/forward cache</div><p style="color:#BDC1C6;margin:4px 0 12px">Tests whether the page can be restored instantly when the user presses Back.</p><button class="btnp" id="bfTest">Test back/forward cache</button><div id="bfRes" style="margin-top:14px"></div></div>`;
  $('#bfTest').onclick=()=>{$('#bfRes').innerHTML='<span style="color:#9AA0A6">Navigating away and back…</span>';setTimeout(()=>{$('#bfRes').innerHTML=`<div style="color:#FDD663">▲ Not served from back/forward cache: 1 actionable issue</div><div class="card" style="margin:8px 0 0"><b>Pages with cache-control: no-store cannot enter back/forward cache.</b><div style="color:#9AA0A6">Frame: https://driftwood.coffee/shop · Header on the main document response.</div></div>`;track('bfcache')},1200)}}
 else v.innerHTML=`<div class="empty">Push messaging: record push events for 3 days, even when DevTools is closed.<br><br><button class="btns">${IC.rec} Start recording events</button></div>`}
function syncCartFromLS(){try{const saved=JSON.parse(LS.get('cart')||'[]');cart.items=saved.map(({id,qty})=>{const p=PRODUCTS.find(x=>x.id===id);return p?{id,name:p.name,price:p.price,qty:+qty||1}:null}).filter(Boolean);renderCart()}catch{pageConsole.error('Unexpected token in JSON at position 0 (cart)')}}
function clearSiteData(){LS.clear();SS.clear();COOKIES=[];IDB=[];CACHES=[];cart.items=[];renderCart();setTheme('light');LS.clear();bus.emit('storage');toast('Site data cleared');track('clear-site-data');renderApp()}

/* ================= Lighthouse ================= */
const LH={state:'form',mode:'navigation',device:'mobile',cats:{perf:true,a11y:true,bp:true,seo:true},report:null};
function buildLH(p){p.innerHTML=`<div id="lhBody" class="scroll" style="flex:1"></div>`;renderLH()}
function renderLH(){const b=$('#lhBody');if(!b)return;
 if(LH.state==='form'){b.innerHTML=`<div style="padding:18px 24px 0;display:flex;align-items:center;gap:14px"><div style="width:42px;height:42px;border-radius:50%;background:conic-gradient(#F28B82 0 25%,#FCAD70 0 50%,#81C995 0 100%)"></div><div><div style="font:600 16px var(--body)">Generate a Lighthouse report</div><div style="color:#9AA0A6;font-size:12.5px">Audits the page for performance, accessibility, best practices and SEO.</div></div><button class="btnp" id="lhGo" style="margin-left:auto">Analyze page load</button></div>
  <div class="lhform" data-hs="lh-form"><div><h5>Mode</h5>${[['navigation','Navigation (Default)'],['timespan','Timespan'],['snapshot','Snapshot']].map(([k,l])=>`<label><input type="radio" name="lhm" value="${k}" ${LH.mode===k?'checked':''}>${l}</label>`).join('')}</div><div><h5>Device</h5>${[['mobile','Mobile'],['desktop','Desktop']].map(([k,l])=>`<label><input type="radio" name="lhd" value="${k}" ${LH.device===k?'checked':''}>${l}</label>`).join('')}</div><div><h5>Categories</h5>${[['perf','Performance'],['a11y','Accessibility'],['bp','Best practices'],['seo','SEO']].map(([k,l])=>`<label><input type="checkbox" data-c="${k}" ${LH.cats[k]?'checked':''}>${l}</label>`).join('')}</div></div>
  <div class="card" style="margin:0 24px;color:#BDC1C6;font-size:12.5px;line-height:1.6">Tip: the orange “Order beans” button fails the contrast check. Change its <code>background</code> to something darker (say <code>#B3401F</code>) in Elements ▸ Styles, then run the audit again and watch Accessibility reach 100.</div>`;
  $$('[name="lhm"]',b).forEach(r=>r.onchange=()=>LH.mode=r.value);$$('[name="lhd"]',b).forEach(r=>r.onchange=()=>LH.device=r.value);$$('[data-c]',b).forEach(c=>c.onchange=()=>LH.cats[c.dataset.c]=c.checked);$('#lhGo').onclick=runLH;return}
 if(LH.state==='running'){b.innerHTML=`<div style="padding:60px 24px;text-align:center;font:400 13px var(--body)"><div style="font:600 15px var(--body);margin-bottom:12px" id="lhMsg">Loading page &amp; waiting for onload</div><div class="bar6" style="width:360px;margin:0 auto"><i id="lhBar" style="transition:width .3s"></i></div><div style="color:#9AA0A6;margin-top:14px">${LH.device==='mobile'?'Emulated Moto G Power · Slow 4G throttling · 4× CPU slowdown':'Emulated Desktop · custom throttling'}</div><button class="btns" style="margin-top:18px" id="lhCancel">Cancel</button></div>`;$('#lhCancel').onclick=()=>{LH.state='form';clearInterval(LH.t);renderLH()};return}
 const R=LH.report;const g=(n,v)=>{const col=v>=90?'#81C995':v>=50?'#FCAD70':'#F28B82';return`<div class="gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="${col}1A" stroke="${col}33" stroke-width="8"/><circle class="arc" cx="60" cy="60" r="52" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="0 400" data-v="${v}"/><text x="60" y="72" text-anchor="middle" fill="${col}" style="font:600 34px var(--mono)" class="gv">0</text></svg>${n}</div>`};
 b.innerHTML=`<div class="lh"><div style="display:flex;gap:10px;align-items:center;color:#9AA0A6;font-size:12px;margin-bottom:12px"><span>https://driftwood.coffee/shop · ${LH.device==='mobile'?'Moto G Power · Slow 4G':'Desktop'} · Lighthouse 12.8</span><button class="btns" id="lhNew" style="margin-left:auto">+ New report</button></div>
  <div class="gauges" data-hs="lh-gauges">${R.scores.map(([n,v])=>g(n,v)).join('')}</div><div style="display:flex;gap:16px;justify-content:center;margin:10px 0 4px;font-size:12px;color:#9AA0A6"><span><b style="color:#F28B82">▲</b> 0–49</span><span><b style="color:#FCAD70">■</b> 50–89</span><span><b style="color:#81C995">●</b> 90–100</span></div>
  ${R.metrics?`<h4 style="margin:18px 0 4px;font:600 12px var(--body);letter-spacing:.06em;color:#9AA0A6">METRICS</h4><div class="lhm" data-hs="lh-metrics">${R.metrics.map(([n,v,s])=>`<div><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${s==='g'?'#81C995':s==='o'?'#FCAD70':'#F28B82'};margin-right:8px"></i>${n}</span><b class="mono ${s}">${v}</b></div>`).join('')}</div>`:''}
  <h4 style="margin:18px 0 4px;font:600 12px var(--body);letter-spacing:.06em;color:#9AA0A6">DIAGNOSTICS &amp; FAILED AUDITS</h4><div data-hs="lh-audits">${R.audits.map(([sev,t,sav,d])=>`<details class="aud"><summary><b style="color:${sev==='r'?'#F28B82':sev==='o'?'#FCAD70':'#9AA0A6'}">${sev==='r'?'▲':'■'}</b>${esc(t)}<span style="margin-left:auto;color:#9AA0A6">${esc(sav)} ▾</span></summary><p>${d}</p></details>`).join('')}</div>
  <div style="color:#9AA0A6;margin-top:12px;font-size:12.5px">${R.passed} passed audits · ${R.na} not applicable</div></div>`;
 $('#lhNew').onclick=()=>{LH.state='form';renderLH()};
 $$('.arc',b).forEach((a,i)=>{const v=+a.dataset.v;const t0=now();const C=2*Math.PI*52;const st=()=>{const p=Math.min(1,(now()-t0-i*120)/900);const e=p<0?0:1-Math.pow(1-p,3);const val=Math.round(v*e);a.setAttribute('stroke-dasharray',`${C*val/100} 400`);a.parentNode.querySelector('.gv').textContent=val;if(p<1)requestAnimationFrame(st)};st()})}
function runLH(){LH.state='running';renderLH();const steps=['Loading page & waiting for onload','Gathering trace','Gathering artifacts: CSS usage, accessibility tree','Auditing Performance','Auditing Accessibility','Auditing Best Practices · SEO','Generating report'];let i=0;
 LH.t=setInterval(()=>{i++;const m=$('#lhMsg'),bar=$('#lhBar');if(m&&steps[i])m.textContent=steps[i];if(bar)bar.style.width=Math.min(100,i/steps.length*100)+'%';if(i>=steps.length){clearInterval(LH.t);LH.report=makeReport();LH.state='report';renderLH();track('lighthouse');if(LH.device==='desktop')track('lh-desktop');if((LH.report.scores.find(s=>s[0]==='Accessibility')||[])[1]===100)track('a11y-100')}},420)}
function makeReport(){const mob=LH.device==='mobile';const cta=PAGE.q('.btn.cta');const ct=contrastOf(cta)||3.6;const blockedCss=ST.blocked.has('app.css');
 const perf=Math.round((mob?86:98)-(ST.cpu>1?6:0)-(blockedCss?3:0));const a11y=ct>=4.5?100:92;const bp=COOKIES.some(c=>c.issue)?96:100;const seo=100;
 const sc=[];if(LH.cats.perf)sc.push(['Performance',perf]);if(LH.cats.a11y)sc.push(['Accessibility',a11y]);if(LH.cats.bp)sc.push(['Best Practices',bp]);if(LH.cats.seo)sc.push(['SEO',seo]);
 const m=mob?[['First Contentful Paint','1.4 s','g'],['Largest Contentful Paint','2.6 s','o'],['Total Blocking Time','190 ms','o'],['Cumulative Layout Shift','0.02','g'],['Speed Index','2.1 s','g']]:[['First Contentful Paint','0.4 s','g'],['Largest Contentful Paint','0.8 s','g'],['Total Blocking Time','40 ms','g'],['Cumulative Layout Shift','0.01','g'],['Speed Index','0.7 s','g']];
 const audits=[];if(LH.cats.perf)audits.push(['o','Reduce JavaScript execution time','1.3 s','<code>analytics.js</code> spends 182 ms evaluating on load — it shows up as a red-cornered long task in the Performance panel.'],['o','Properly size images','Est savings of 420 KiB','<code>hero.avif</code> is 1200 px wide but displayed at 360 px.'],['o','Reduce unused JavaScript','Est savings of 138 KiB','65% of <code>vendor.min.js</code> never runs. Open More tools ▸ Coverage to see which lines.'],['r','Avoid serving legacy JavaScript to modern browsers','Est savings of 12 KiB','Polyfills for features every modern browser already supports.']);
 if(LH.cats.a11y&&ct<4.5)audits.push(['r','Background and foreground colors do not have a sufficient contrast ratio',`${ct.toFixed(2)} : 1`,`<code>a.btn.cta</code> “Order beans →” has contrast ${ct.toFixed(2)}, below the 4.5 AA minimum. Darken its background in the Styles pane.`]);
 if(LH.cats.bp&&bp<100)audits.push(['o','Issues were logged in the Issues panel','1 issue','Cookie <code>cart_id</code> uses SameSite=None without Secure.']);
 if(LH.cats.bp)audits.push(['n','Browser errors were logged to the console','2 errors','404 for <code>og-image.png</code> and a 500 from <code>/api/cart</code> if you tried checkout.']);
 return{scores:sc,metrics:LH.cats.perf?m:null,audits,passed:62+(a11y===100?1:0),na:18}}
```

### 6/16 · `F12-Field-Guide-source/site/src/console.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/console.js", "lines": 112, "final_newline": true, "sha256": "7efcd74fa9c7602e263f0d25a96ebd87c339b69074d95276f59bd44a61c59e33", "original_sha256": "7efcd74fa9c7602e263f0d25a96ebd87c339b69074d95276f59bd44a61c59e33"} -->
```js
/* ================= Console ================= */
let EVAL_OK=true;try{EVAL_OK=new Function('return 7')()===7}catch{EVAL_OK=false}
const CONSOLE_VARS={};const selHist=[];bus.on('select',n=>{if(selHist[0]!==n){selHist.unshift(n);selHist.length=Math.min(selHist.length,5)}});
const CSET={levels:{verbose:false,info:true,warn:true,error:true},filter:'',preserve:false,group:true,hideNet:false,eager:true};
const DOC=new Proxy({},{get(t,k){switch(k){case'title':return HEAD.querySelector('title').textContent;case'body':return BODY;case'head':return HEAD;case'documentElement':return HTML;
 case'querySelector':return s=>HTML.querySelector(s);case'querySelectorAll':return s=>HTML.querySelectorAll(s);case'getElementById':return id=>HTML.querySelector('#'+CSS.escape(id));case'getElementsByClassName':return c=>HTML.getElementsByClassName(c);case'getElementsByTagName':return tg=>HTML.getElementsByTagName(tg);
 case'cookie':return COOKIES.filter(c=>!c.httpOnly).map(c=>c.name+'='+c.value).join('; ');case'URL':return'https://driftwood.coffee/shop';case'location':return LOC;case'readyState':return'complete';case'images':return BODY.querySelectorAll('img');case'forms':return BODY.querySelectorAll('form');case'links':return BODY.querySelectorAll('a');
 case'addEventListener':return(...a)=>BODY.addEventListener(...a);case Symbol.toStringTag:return'HTMLDocument'}const v=document[k];return typeof v==='function'?v.bind(document):v},
 set(t,k,v){if(k==='title'){HEAD.querySelector('title').textContent=v;$('#tabTitle').textContent=v;return true}if(k==='cookie'){const [nv]=String(v).split(';');const [n,...val]=nv.split('=');const c=COOKIES.find(c=>c.name===n.trim());if(c)c.value=val.join('=');else COOKIES.push({name:n.trim(),value:val.join('='),domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'});bus.emit('storage');return true}return true},has(){return true}});
const LOC={href:'https://driftwood.coffee/shop',origin:'https://driftwood.coffee',hostname:'driftwood.coffee',pathname:'/shop',protocol:'https:',search:'',hash:'',reload:()=>reloadPage(),toString(){return this.href}};
const mkStorage=(M,name)=>new Proxy({},{get(t,k){if(k==='getItem')return x=>M.has(String(x))?M.get(String(x)):null;if(k==='setItem')return(x,v)=>{M.set(String(x),String(v));bus.emit('storage');if(String(x)==='theme')setTheme(String(v))};if(k==='removeItem')return x=>{M.delete(String(x));bus.emit('storage')};if(k==='clear')return()=>{M.clear();bus.emit('storage')};if(k==='key')return i=>[...M.keys()][i]??null;if(k==='length')return M.size;if(k===Symbol.toStringTag)return'Storage';if(typeof k==='string'&&M.has(k))return M.get(k);return undefined},
 set(t,k,v){M.set(String(k),String(v));bus.emit('storage');return true},ownKeys(){return[...M.keys()]},getOwnPropertyDescriptor(t,k){return M.has(k)?{enumerable:true,configurable:true,value:M.get(k)}:undefined}});
const SCOPE={document:DOC,window:new Proxy(globalThis,{get(t,k){if(k==='document')return DOC;if(k==='location')return LOC;if(k==='localStorage')return SCOPE.localStorage;const v=t[k];return typeof v==='function'&&!/^[A-Z]/.test(String(k))?v.bind(t):v}}),location:LOC,
 localStorage:mkStorage(LS),sessionStorage:mkStorage(SS),console:pageConsole,fetch:(u,o={})=>simFetch(u,{...o,initiator:'VM'+(CON.vm||1)+':1'}),
 $:(s,root)=>(root||HTML).querySelector(s),$$:(s,root)=>[...(root||HTML).querySelectorAll(s)],$x:(xp)=>{const r=[];const it=document.evaluate(xp,BODY,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let i=0;i<it.snapshotLength;i++)r.push(it.snapshotItem(i));return r},
 copy:v=>{copyText(typeof v==='string'?v:v&&v.nodeType?v.outerHTML:JSON.stringify(v,null,2));track('copy')},clear:()=>pageConsole.clear(),inspect:n=>{if(n&&n.nodeType===1){setPanel('elements');select(n)}},keys:Object.keys,values:Object.values,dir:o=>pageConsole.dir(o),
 getEventListeners:n=>{const o={};LISTENERS.filter(l=>l.el===n&&!l.removed).forEach(l=>(o[l.type]=o[l.type]||[]).push({listener:l.fn,once:false,passive:false,type:l.type,useCapture:false}));return o},
 monitorEvents:(n,types)=>{[].concat(types||['click']).forEach(t=>n.addEventListener(t,e=>CON.add({type:'log',args:[t,e],src:''})));},
 queryObjects:c=>{const map={Promise:0,HTMLDivElement:toastCache.length};CON.add({type:'log',args:[`Array(${map[c&&c.name]||0})`],plain:true,src:''})},
 cart,orders,products:PRODUCTS,addToCart,checkout,calcTotal,renderCart,toastCache,setTheme};
Object.defineProperty(SCOPE,'$0',{get:()=>ST.sel,enumerable:true});[1,2,3,4].forEach(i=>Object.defineProperty(SCOPE,'$'+i,{get:()=>selHist[i],enumerable:true}));SCOPE.$_=undefined;
const scopeP=new Proxy({},{has:(t,k)=>typeof k==='string'&&!k.startsWith('__')&&(k in CONSOLE_VARS||k in SCOPE),get:(t,k)=>k===Symbol.unscopables?undefined:k in CONSOLE_VARS?CONSOLE_VARS[k]:SCOPE[k],set:(t,k,v)=>{if(k in SCOPE&&k!=='$_'&&typeof SCOPE[k]!=='object'){SCOPE[k]=v;return true}CONSOLE_VARS[k]=v;return true}});
function runCode(code){CON.vm=(CON.vm||200)+1;let src=code.trim();
 src=src.replace(/^(?:let|const|var)\s+([A-Za-z_$][\w$]*)\s*=/gm,(m,n)=>{CONSOLE_VARS[n]=undefined;return n+' ='}).replace(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)/gm,(m,a,n)=>{CONSOLE_VARS[n]=undefined;return n+' = '+(a||'')+'function '+n});
 if(/\bawait\b/.test(src)){try{return new Function('__s',`with(__s){return (async()=>(${src}\n))()}`)(scopeP)}catch(e){if(!(e instanceof SyntaxError))throw e;return new Function('__s',`with(__s){return (async()=>{${src}\n})()}`)(scopeP)}}
 if(/^\{/.test(src)&&!/;\s*$/.test(src))src='('+src+')';
 return new Function('__s','__c','with(__s){return eval(__c)}')(scopeP,src)}
const CANNED={"document.title":()=>DOC.title,"$0":()=>ST.sel,"$$('.card').length":()=>PAGE.qa('.card').length,"console.table(orders)":()=>{pageConsole.table(orders)},"cart.items":()=>cart.items,"localStorage.getItem('theme')":()=>LS.get('theme'),
 "await fetch('/api/cart', {method:'POST'})":()=>simFetch('/api/cart',{method:'POST',initiator:'VM1:1'}),"document.body.dataset.theme = 'dark'":()=>{setTheme('dark');return'dark'},"$0.style.outline = '3px solid red'":()=>{ST.sel.style.outline='3px solid red';return'3px solid red'},"copy($0.outerHTML)":()=>{SCOPE.copy(ST.sel.outerHTML)},
 "console.time('t'); calcTotal(cart.items); console.timeEnd('t')":()=>{pageConsole.time('t');calcTotal(cart.items);pageConsole.timeEnd('t')},"getEventListeners($0)":()=>SCOPE.getEventListeners(ST.sel)};
const hist=store.get('hist',[]);
async function evaluate(code){code=code.trim();if(!code)return;CON.add({type:'input',args:[code]});hist.push(code);if(hist.length>60)hist.shift();store.set('hist',hist);
 let r,threw=false;try{if(EVAL_OK)r=runCode(code);else if(CANNED[code])r=CANNED[code]();else throw new EvalError('This page blocks eval, so only the example chips run here.');
  if(r&&typeof r.then==='function'&&/\bawait\b/.test(code))r=await r}
 catch(e){threw=true;CON.add({type:'error',args:[`Uncaught ${e&&e.name?`${e.name}: ${e.message}`:fmtPlain(e)}`],src:'VM'+(CON.vm||1)+':1',stack:'    at <anonymous>:1:1'})}
 if(!threw){SCOPE.$_=r;CON.add({type:'result',args:[r]})}
 track('console-eval');if(/\$0/.test(code))track('console-$0');if(/table\(/.test(code))track('console-table');if(/fetch\(/.test(code))track('console-fetch')}
function fmtPlain(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch{return String(v)}}

/* ---------- value rendering ---------- */
function typeName(v){if(v===null)return'null';const t=Object.prototype.toString.call(v).slice(8,-1);if(v&&v[Symbol.toStringTag])return v[Symbol.toStringTag];if(v&&v.constructor&&v.constructor.name&&v.constructor!==Object)return v.constructor.name;return t}
function prevShort(v,d=0){if(v===null)return'<span class="ov-null">null</span>';if(v===undefined)return'<span class="ov-null">undefined</span>';const t=typeof v;
 if(t==='string')return`<span class="ov-str">'${esc(v.length>60?v.slice(0,60)+'…':v)}'</span>`;if(t==='number'||t==='bigint')return`<span class="ov-num">${String(v)}</span>`;if(t==='boolean')return`<span class="ov-kw">${v}</span>`;if(t==='function')return`<span class="ov-fn">ƒ</span>`;if(t==='symbol')return`<span class="ov-str">${esc(String(v))}</span>`;
 if(v.nodeType===1)return`<span class="ov-kw">${esc(nodeLabel(v))}</span>`;if(v.nodeType)return`<span class="ov-dim">#${esc(v.nodeName)}</span>`;
 if(Array.isArray(v))return d>0?`Array(${v.length})`:`(${v.length}) [${v.slice(0,6).map(x=>prevShort(x,d+1)).join(', ')}${v.length>6?', …':''}]`;
 if(v instanceof Map)return`Map(${v.size})`;if(v instanceof Set)return`Set(${v.size})`;if(v instanceof Promise)return'Promise';if(v instanceof Error)return`<span class="r">${esc(v.name)}</span>`;
 const tn=typeName(v);if(d>0)return tn==='Object'?'{…}':tn;const ks=safeKeys(v).slice(0,5);return`${tn==='Object'?'':esc(tn)+' '}{${ks.map(k=>`<span class="ov-key">${esc(k)}</span>: ${prevShort(safeGet(v,k),d+1)}`).join(', ')}${safeKeys(v).length>5?', …':''}}`}
function safeKeys(v){try{return Object.keys(v)}catch{return[]}}
function safeGet(v,k){try{return v[k]}catch(e){return'(…)'}}
function renderVal(v,top,asResult){if(v===null||v===undefined||typeof v!=='object'&&typeof v!=='function'){if(typeof v==='string'&&!asResult&&top)return h(`<span>${esc(v)}</span>`);return h(`<span>${prevShort(v)}</span>`)}
 if(typeof v==='function')return h(`<span class="ov-fn">ƒ ${esc(v.name||'anonymous')}(${esc(String(v).match(/\(([^)]*)\)/)?.[1]||'')})</span>`);
 if(v.nodeType===1){const s=h(`<span class="nodeprev">&lt;${esc(v.tagName.toLowerCase())}${[...v.attributes].filter(a=>a.name!=='style'||true).slice(0,3).map(a=>` <span class="an" style="color:var(--an)">${esc(a.name)}</span>=<span style="color:var(--av)">"${esc(a.value.replace(/\s*__hov/,'').slice(0,40))}"</span>`).join('')}&gt;${v.children.length?'…':esc(v.textContent.trim().slice(0,30))}&lt;/${esc(v.tagName.toLowerCase())}&gt;</span>`);
  s.onmouseenter=()=>highlight(v);s.onmouseleave=clearHL;s.onclick=()=>{setPanel('elements');select(v);track('console-node')};s.title='Click to reveal in Elements panel';return s}
 if(v instanceof Promise){const s=h('<span>Promise {<span class="ov-dim">&lt;pending&gt;</span>}</span>');return s}
 if(v instanceof Error){return h(`<span class="r">${esc(v.stack||v.name+': '+v.message)}</span>`)}
 const o=h(`<span class="obj"><span class="hd">${prevShort(v)}</span><span class="kids"></span></span>`);let built=false;
 o.querySelector('.hd').onclick=e=>{e.stopPropagation();o.classList.toggle('open');if(!built){built=true;const kids=o.querySelector('.kids');let entries=[];
   if(v instanceof Map)entries=[...v.entries()].map(([k,x],i)=>[i,{key:k,value:x}]);else if(v instanceof Set)entries=[...v].map((x,i)=>[i,x]);else{const own=Array.isArray(v)?[...v.keys()].map(String):Object.getOwnPropertyNames(v);entries=own.slice(0,120).map(k=>[k,safeGet(v,k)]);if(v.nodeType||own.length===0&&typeName(v)!=='Object'){entries=[];for(const k in v){entries.push([k,safeGet(v,k)]);if(entries.length>80)break}}}
   if(Array.isArray(v))entries.push(['length',v.length]);entries.forEach(([k,x])=>{const r=h(`<div><span class="ov-key">${esc(String(k))}</span>: </div>`);r.appendChild(renderVal(x,false,true));kids.appendChild(r)});
   kids.appendChild(h(`<div><span class="ov-dim">[[Prototype]]</span>: <span class="ov-dim">${Array.isArray(v)?'Array(0)':esc(typeName(Object.getPrototypeOf(v)||{})||'Object')}</span></div>`))}};return o}

/* ---------- console view (panel + drawer share this) ---------- */
function makeConsole(root,compact){root.innerHTML=`<div class="tb" data-hs="con-tb"><button class="tbb" data-a="clear" title="Clear console (Ctrl+L)">${IC.clear}</button><span class="pill" title="JavaScript context">top ▾</span><button class="tbb" data-a="live" title="Create live expression">${IC.eye}</button><input class="inp" data-a="filter" placeholder="Filter" value="${esc(CSET.filter)}" style="flex:1;min-width:80px" data-hs="con-filter"><button class="pill" data-a="levels" data-hs="con-levels">Default levels ▾</button><button class="tbb" data-a="settings" title="Console settings">${IC.gear}</button></div>
 <div class="settings" hidden style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;font:400 12px var(--body)"><label class="ck"><input type="checkbox" data-s="hideNet">Hide network</label><label class="ck"><input type="checkbox" data-s="preserve">Preserve log</label><label class="ck"><input type="checkbox" data-s="group" checked>Group similar messages</label><label class="ck"><input type="checkbox" data-s="eager" checked>Eager evaluation</label></div>
 <div class="liveb"></div><div class="con scroll" data-hs="con-log"></div><div class="cprompt" data-hs="con-prompt"><span class="ic">›</span><div style="flex:1;position:relative"><textarea spellcheck="false" aria-label="Console prompt" rows="1"></textarea><div class="ghost" style="position:absolute;left:0;top:0;pointer-events:none;font:400 12.5px/18px var(--mono);color:#6E7379;white-space:pre"></div><div class="eager" style="font:400 12px/16px var(--mono);color:#9AA0A6;min-height:0"></div></div></div>
 ${compact?'':`<div class="chips" data-hs="con-chips"><small>Try:</small>${Object.keys(CANNED).map(c=>`<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>`}`;
 const log=$('.con',root),ta=$('textarea',root),ghost=$('.ghost',root),eager=$('.eager',root);let hi=hist.length;
 const visible=m=>{if(m.type==='input'||m.type==='result')return !CSET.filter||match(m);const lv=m.type==='log'?'info':m.type;if(CSET.levels[lv]===false)return false;if(CSET.hideNet&&m.net)return false;return !CSET.filter||match(m)};
 const match=m=>{const txt=m.args.map(a=>typeof a==='string'?a:fmtPlain(a)).join(' ')+' '+(m.src||'');const f=CSET.filter;if(/^\/.+\/$/.test(f)){try{return new RegExp(f.slice(1,-1),'i').test(txt)}catch{return true}}return f.split(/\s+/).every(w=>w.startsWith('-')?!txt.toLowerCase().includes(w.slice(1).toLowerCase()):txt.toLowerCase().includes(w.toLowerCase()))};
 const row=m=>{const d=h(`<div class="cm ${m.type==='log'?'':m.type}${m.group?' group':''}" data-id="${m.id}"><span class="ic">${({input:'›',result:'←',warn:'▲',error:'✕',info:'ⓘ'})[m.type]||''}</span></div>`);
  if(m.count>1)d.appendChild(h(`<span class="cnt">${m.count}</span>`));
  if(m.src){const s=h(`<span class="src">${esc(m.src)}</span>`);s.onclick=()=>{const [f,l]=m.src.split(':');if(SRC.files[f])SRC.open(f,+l||1);else if(f==='shop')setPanel('network')};d.appendChild(s)}
  if(m.table){d.appendChild(tableEl(m.table))}else if(m.type==='input'){d.appendChild(h(`<span style="color:#C7D7F8">${esc(m.args[0])}</span>`))}
  else m.args.forEach((a,i)=>{if(i)d.appendChild(document.createTextNode(' '));d.appendChild(renderVal(a,true,m.type==='result'))});
  if(m.stack)d.appendChild(h(`<div style="color:inherit;opacity:.8">${esc(m.stack)}</div>`));return d};
 const redraw=()=>{log.innerHTML='';CON.msgs.filter(visible).forEach(m=>log.appendChild(row(m)));log.scrollTop=1e9};
 const lis=(ev,m)=>{if(!root.isConnected){CON.listeners.splice(CON.listeners.indexOf(lis),1);return}if(ev==='clear'){log.innerHTML='';return}if(ev==='update'){const old=$(`[data-id="${m.id}"]`,log);if(old&&visible(m))old.replaceWith(row(m));return}if(visible(m)){const stick=log.scrollTop+log.clientHeight>=log.scrollHeight-30;log.appendChild(row(m));if(stick||m.type==='input'||m.type==='result')log.scrollTop=1e9}};CON.listeners.push(lis);
 bus.on('console-redraw',()=>{if(root.isConnected)redraw()});redraw();
 root.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
  if(k==='clear'){CON.clear();track('console-clear')}
  if(k==='levels'){const r=a.getBoundingClientRect();openMenu(r.left,r.bottom+2,[['verbose','Verbose'],['info','Info'],['warn','Warnings'],['error','Errors']].map(([lv,l])=>({label:(CSET.levels[lv]?'✓ ':'   ')+l,act:()=>{CSET.levels[lv]=!CSET.levels[lv];bus.emit('console-redraw');track('console-levels')}})))}
  if(k==='settings'){const s=$('.settings',root);s.hidden=!s.hidden}
  if(k==='live'){LIVE.push({expr:'',edit:true});renderLive()}});
 $('[data-a="filter"]',root).oninput=e=>{CSET.filter=e.target.value;bus.emit('console-redraw');$$('[data-a="filter"]').forEach(x=>{if(x!==e.target)x.value=CSET.filter});track('console-filter')};
 $$('[data-s]',root).forEach(c=>{c.checked=CSET[c.dataset.s];c.onchange=()=>{CSET[c.dataset.s]=c.checked;bus.emit('console-redraw')}});
 $$('.chips button',root).forEach(b=>b.onclick=()=>{ta.value=b.dataset.c;ta.focus();autosize();onType()});
 const autosize=()=>{ta.style.height='18px';ta.style.height=Math.min(120,ta.scrollHeight)+'px'};
 let sugg=[],si=0;
 const onType=()=>{autosize();ghost.textContent='';eager.textContent='';sugg=[];const v=ta.value;if(!EVAL_OK||!v||v.includes('\n'))return;
  const m=v.match(/([\w$]+(?:\.[\w$]+)*)\.([\w$]*)$/);try{if(m){const obj=runSafe(m[1]);if(obj!=null){const ks=new Set();let o=obj;let depth=0;while(o&&depth<4){Object.getOwnPropertyNames(o).forEach(k=>ks.add(k));o=Object.getPrototypeOf(o);depth++}if(obj===DOC)['title','body','head','querySelector','querySelectorAll','getElementById','cookie','documentElement','location','images','links'].forEach(k=>ks.add(k));sugg=[...ks].filter(k=>k.startsWith(m[2])&&k!==m[2]&&!/^__|^constructor$/.test(k)).sort().slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(m[2].length))}`}}
   else{const w=(v.match(/([\w$]+)$/)||[])[1];if(w&&w.length>=2){sugg=[...Object.keys(SCOPE),...Object.keys(CONSOLE_VARS),'document','window','JSON','Math','Object','Array','performance'].filter(k=>k.startsWith(w)&&k!==w).slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(w.length))}`}}}catch{}
  if(CSET.eager&&isSafe(v)){try{const r=runSafe(v);if(r!==undefined){const el=renderVal(r,false,true);eager.innerHTML='';eager.appendChild(el)}}catch{}}};
 ta.addEventListener('input',onType);
 ta.addEventListener('keydown',e=>{e.stopPropagation();
  if((e.key==='Tab'||e.key==='ArrowRight'&&ta.selectionStart===ta.value.length)&&sugg[0]){const m=ta.value.match(/([\w$]+)$/)||[''];const part=(ta.value.match(/\.([\w$]*)$/)||ta.value.match(/([\w$]*)$/))[1];ta.value=ta.value.slice(0,ta.value.length-part.length)+sugg[0];e.preventDefault();onType();return}
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const c=ta.value;ta.value='';ghost.textContent='';eager.textContent='';autosize();hi=hist.length+1;evaluate(c);return}
  if(e.key==='ArrowUp'&&!ta.value.includes('\n')&&hist.length){e.preventDefault();hi=Math.max(0,Math.min(hi,hist.length)-1);ta.value=hist[hi]||'';onType()}
  if(e.key==='ArrowDown'&&!ta.value.includes('\n')){e.preventDefault();hi=Math.min(hist.length,hi+1);ta.value=hist[hi]||'';onType()}
  if(e.key==='l'&&(e.ctrlKey||e.metaKey)){e.preventDefault();CON.clear()}});
 log.addEventListener('click',e=>{if(e.target===log)ta.focus()});
 const liveb=$('.liveb',root);root._live=liveb;renderLive();return{root,ta}}
function runSafe(expr){return runCode(expr)}
function isSafe(v){if(/[=;]|\+\+|--|\bawait\b|\bnew\b|\bdelete\b/.test(v.replace(/[=!]==?|[<>]=/g,'')))return false;const calls=v.match(/([\w$.]+)\s*\(/g)||[];return calls.every(c=>/^(\$|\$\$|\$x|Object\.keys|Object\.values|JSON\.stringify|Math\.\w+|[\w$.]*\.(toFixed|toUpperCase|toLowerCase|slice|includes|matches|getAttribute|querySelector|querySelectorAll|getItem|map|filter|join|at))\s*\($/.test(c.trim()))}
function tableEl(data){const rows=Array.isArray(data)?data:Object.entries(data).map(([k,v])=>Object.assign({__k:k},v));const keys=[...new Set(rows.flatMap(r=>typeof r==='object'&&r?Object.keys(r).filter(k=>k!=='__k'):['Value']))].slice(0,7);
 const t=h(`<div><table class="ctab"><tr><th>(index)</th>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr>${rows.map((r,i)=>`<tr><td>${esc(r&&r.__k!==undefined?r.__k:i)}</td>${keys.map(k=>`<td>${typeof r==='object'&&r?prevShort(r[k],1):k==='Value'?prevShort(r,1):''}</td>`).join('')}</tr>`).join('')}</table><span class="ov-dim">${Array.isArray(data)?`Array(${data.length})`:'Object'}</span></div>`);return t}
const LIVE=[];
function renderLive(){$$('.liveb').forEach(b=>{b.className='liveb'+(LIVE.length?' live':'');b.innerHTML=LIVE.map((l,i)=>l.edit?`<div class="le"><span style="color:#9AA0A6">⊙</span><input class="inp" data-li="${i}" placeholder="Expression, e.g. performance.now()" style="flex:1"></div>`:`<div class="le" data-hs="con-live"><span style="color:#9AA0A6">⊙</span><b>${esc(l.expr)}</b><button data-rm="${i}" title="Remove">✕</button></div><div class="lv" data-lv="${i}" style="padding-left:20px"></div>`).join('');
  $$('[data-li]',b).forEach(inp=>{inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=inp.value.trim();const L=LIVE[+inp.dataset.li];if(v){L.expr=v;L.edit=false;track('live-expr')}else LIVE.splice(+inp.dataset.li,1);renderLive()}if(e.key==='Escape'){LIVE.splice(+inp.dataset.li,1);renderLive()}}});
  $$('[data-rm]',b).forEach(x=>x.onclick=()=>{LIVE.splice(+x.dataset.rm,1);renderLive()})})}
setInterval(()=>{if(!LIVE.length)return;LIVE.forEach((l,i)=>{if(l.edit)return;let out;try{out=EVAL_OK?runCode(l.expr):'(eval blocked)'}catch(e){out=e.name+': '+e.message}$$(`[data-lv="${i}"]`).forEach(d=>{d.innerHTML='';d.appendChild(renderVal(out,false,true))})})},250);
bus.on('reload',()=>{if(!CSET.preserve)CON.clear();else CON.add({type:'info',args:['Navigated to https://driftwood.coffee/shop'],src:''})});
bus.on('console-count',()=>{let e=0,w=0;CON.msgs.forEach(m=>{if(m.type==='error')e+=m.count||1;if(m.type==='warn')w+=m.count||1});const eb=$('#errBdg'),wb=$('#warnBdg');eb.querySelector('span').textContent=e;wb.querySelector('span').textContent=w;eb.hidden=!e;wb.hidden=!w});
```

### 7/16 · `F12-Field-Guide-source/site/src/core.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/core.js", "lines": 245, "final_newline": true, "sha256": "01de3de07bca00403a67e229514341c8e4719b045c82fb78ee8503613951ee0d", "original_sha256": "01de3de07bca00403a67e229514341c8e4719b045c82fb78ee8503613951ee0d"} -->
```js
/* ================= core ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const h=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmtBytes=b=>b===0?'0 B':b<1000?b+' B':b<1e6?(b/1000).toFixed(1)+' kB':(b/1e6).toFixed(1)+' MB';
const fmtMs=ms=>ms<1000?Math.round(ms)+' ms':(ms/1000).toFixed(2)+' s';
const now=()=>performance.now();
const store={get(k,d){try{const v=localStorage.getItem('f12g:'+k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem('f12g:'+k,JSON.stringify(v))}catch{}}};

const bus={h:{},on(e,f){(this.h[e]=this.h[e]||[]).push(f)},emit(e,d){(this.h[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})}};
const track=t=>bus.emit('task',t);

const IC={
 clear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M4.2 11.8l7.6-7.6"/></svg>',
 rec:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4.2"/></svg>',
 reload:'<svg class="i" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/></svg>',
 eye:'<svg class="i" viewBox="0 0 16 16"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>',
 gear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>',
 dl:'<svg class="i" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3M3 13.5h10"/></svg>',
 up:'<svg class="i" viewBox="0 0 16 16"><path d="M8 14V6M5 9l3-3 3 3M3 2.5h10"/></svg>',
 funnel:'<svg class="i" viewBox="0 0 16 16"><path d="M2 3h12l-4.5 5.5V13l-3-1.5v-3z"/></svg>',
 resume:'<svg class="i" viewBox="0 0 16 16"><path d="M3 3v10"/><path d="M6.5 3l7 5-7 5z" fill="currentColor"/></svg>',
 over:'<svg class="i" viewBox="0 0 16 16"><path d="M2.5 9a5.5 5.5 0 0 1 10.3-2.6"/><path d="M13.3 2.8v3.8H9.6"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor"/></svg>',
 into:'<svg class="i" viewBox="0 0 16 16"><path d="M8 1.5v7.5M5 6l3 3 3-3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 out:'<svg class="i" viewBox="0 0 16 16"><path d="M8 10V2.5M5 5.5l3-3 3 3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 step:'<svg class="i" viewBox="0 0 16 16"><path d="M2 8h9M8 5l3 3-3 3"/><circle cx="13.5" cy="8" r="1.2" fill="currentColor"/></svg>',
 deact:'<svg class="i" viewBox="0 0 16 16"><path d="M2 4.5h8l3.5 3.5-3.5 3.5H2z"/><path d="M1.5 14L14 2"/></svg>',
 trash:'<svg class="i" viewBox="0 0 16 16"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.7 9h5.6l.7-9"/></svg>',
 play:'<svg class="i" viewBox="0 0 16 16"><path d="M4.5 3l8 5-8 5z" fill="currentColor"/></svg>',
 plus:'<svg class="i" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
};

/* ---------- simulator state ---------- */
const ST={open:true,dock:'bottom',panel:'elements',inspecting:false,device:false,drawer:false,drawerTab:'console',sel:null,
 throttle:'none',cpu:1,offline:false,disableCache:true,preserve:false,blocked:new Set(),jsDisabled:false,forceHover:new WeakSet(),
 scheme:'light',vision:'none',paint:false,shifts:false,fps:false,hidden:new WeakSet(),loadCount:0,coverage:null,changes:[]};
const PANELS=[['elements','Elements'],['console','Console'],['sources','Sources'],['network','Network'],['performance','Performance'],['memory','Memory'],['application','Application'],['lighthouse','Lighthouse']];

/* ---------- toast inside the simulated browser ---------- */
let toastT;function toast(msg){const b=$('#browser');let t=$('.toast',b);if(!t){t=h('<div class="toast"></div>');b.appendChild(t)}t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2200)}

/* ---------- context menus ---------- */
function openMenu(x,y,items,anchor=$('#browser')){closeMenu();const m=h('<div class="menu" role="menu"></div>');
 items.forEach(it=>{if(it==='-'){m.appendChild(document.createElement('hr'));return}if(it.head){m.appendChild(h(`<div class="h">${esc(it.head)}</div>`));return}
  const b=h(`<button role="menuitem">${esc(it.label)}${it.hint?`<small>${esc(it.hint)}</small>`:''}</button>`);b.onclick=e=>{e.stopPropagation();closeMenu();it.act&&it.act()};m.appendChild(b)});
 anchor.appendChild(m);const ar=anchor.getBoundingClientRect();let lx=x-ar.left,ly=y-ar.top;const mw=m.offsetWidth,mh=m.offsetHeight;if(lx+mw>ar.width-4)lx=ar.width-mw-4;if(ly+mh>ar.height-4)ly=Math.max(4,ly-mh);m.style.left=lx+'px';m.style.top=ly+'px';
 setTimeout(()=>document.addEventListener('mousedown',closeMenuOut,{once:true}),0);return m}
function closeMenuOut(e){if(!e.target.closest('.menu'))closeMenu();else document.addEventListener('mousedown',closeMenuOut,{once:true})}
function closeMenu(){$$('.menu').forEach(m=>m.remove())}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copied to clipboard')}catch{toast('Clipboard blocked here — text logged to Console');CON.add({type:'log',args:[t],src:'copy'})}}

/* ================= demo page (lives in a shadow root) ================= */
const PRODUCTS=[
 {id:'guji',name:'Ethiopia Guji',notes:'Peach · jasmine · honey',price:18.5,art:'linear-gradient(135deg,#C8553D,#F28F3B)'},
 {id:'huila',name:'Colombia Huila',notes:'Red apple · cocoa · caramel',price:17,art:'linear-gradient(135deg,#588B8B,#C8D5B9)'},
 {id:'nyeri',name:'Kenya Nyeri',notes:'Blackcurrant · grapefruit',price:19.5,art:'linear-gradient(135deg,#6B4E71,#E0A458)'}];

/* CSS rule model = the site's app.css. Styles pane edits this. */
let RULES=[
 {sel:'body.shop',d:[['margin','0'],['font-family','"IBM Plex Sans", system-ui, sans-serif'],['color','#1C1714'],['background','#F4EFE8'],['line-height','1.5']]},
 {sel:'.nav',d:[['display','flex'],['align-items','center'],['gap','18px'],['padding','14px 24px'],['border-bottom','1px solid #E3D9CC'],['position','sticky'],['top','0'],['background','#F4EFE8'],['z-index','5']]},
 {sel:'.logo',d:[['font','800 18px/1 "Bricolage Grotesque", sans-serif'],['letter-spacing','0.12em'],['color','#1C1714'],['text-decoration','none'],['margin-right','auto']]},
 {sel:'.nav-link',d:[['color','#5B4F45'],['text-decoration','none'],['font-size','14px']]},
 {sel:'.icon-btn',d:[['border','1px solid #D8CCBD'],['background','transparent'],['color','#1C1714'],['border-radius','999px'],['padding','5px 12px'],['font-family','inherit'],['font-size','13px'],['cursor','pointer']]},
 {sel:'.hero',d:[['display','grid'],['grid-template-columns','1.3fr 1fr'],['gap','24px'],['align-items','center'],['padding','32px 24px 28px']]},
 {sel:'.hero-title',d:[['font','800 44px/1.02 "Bricolage Grotesque", sans-serif'],['letter-spacing','-0.02em'],['margin','0']]},
 {sel:'.lede',d:[['color','#6A5D52'],['font-size','16px'],['margin','10px 0 18px']]},
 {sel:'.hero-art',d:[['aspect-ratio','4 / 3'],['border-radius','16px'],['background','linear-gradient(135deg, #C8553D, #F28F3B 55%, #FFD6A5)']]},
 {sel:'.btn',d:[['display','inline-block'],['background','#333'],['color','#fff'],['padding','10px 16px'],['border','0'],['border-radius','6px'],['font-family','inherit'],['font-size','14px'],['font-weight','600'],['text-decoration','none'],['cursor','pointer']]},
 {sel:'.btn.cta',d:[['background','#E4572E'],['padding','14px 28px'],['border-radius','999px'],['font-size','16px'],['transition','transform .15s, box-shadow .15s']]},
 {sel:'.btn.cta:hover',d:[['transform','translateY(-2px)'],['box-shadow','0 8px 20px rgb(228 87 46 / 40%)']]},
 {sel:'.cards',d:[['display','grid'],['grid-template-columns','repeat(3, 1fr)'],['gap','16px'],['padding','0 24px 24px']]},
 {sel:'.card',d:[['background','#fff'],['border-radius','12px'],['overflow','hidden'],['box-shadow','0 1px 0 #E3D9CC']]},
 {sel:'.thumb',d:[['height','96px'],['background','var(--art)']]},
 {sel:'.card h3',d:[['font-size','15px'],['margin','10px 12px 2px']]},
 {sel:'.notes',d:[['font-size','12.5px'],['color','#8A7B6D'],['margin','0 12px']]},
 {sel:'.card .row',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['padding','10px 12px 12px']]},
 {sel:'.price',d:[['font','600 13px "JetBrains Mono", monospace'],['color','#5B4F45']]},
 {sel:'.btn.add',d:[['padding','6px 12px'],['font-size','13px']]},
 {sel:'.cart-bar',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['gap','12px'],['margin','0 24px 18px'],['padding','12px 16px'],['background','#1C1714'],['color','#F4EFE8'],['border-radius','12px']]},
 {sel:'.btn.checkout',d:[['background','#F4EFE8'],['color','#1C1714']]},
 {sel:'.news',d:[['display','flex'],['gap','12px'],['align-items','center'],['justify-content','space-between'],['padding','8px 24px 48px'],['color','#6A5D52']]},
 {sel:'.toasts',d:[['position','sticky'],['bottom','14px'],['height','0'],['display','flex'],['flex-direction','column'],['justify-content','flex-end'],['align-items','center'],['gap','8px']]},
 {sel:'.toast',d:[['background','#1C1714'],['color','#fff'],['padding','10px 16px'],['border-radius','10px'],['font-size','14px'],['box-shadow','0 8px 20px rgb(0 0 0 / 25%)']]},
 {sel:'.toast.err',d:[['background','#B3261E']]},
 {sel:'body.shop[data-theme="dark"]',d:[['background','#171311'],['color','#F1E9DF']]},
 {sel:'[data-theme="dark"] .nav',d:[['background','#171311'],['border-color','#3A302A']]},
 {sel:'[data-theme="dark"] .card',d:[['background','#241E1B'],['box-shadow','none']]},
 {sel:'[data-theme="dark"] .logo, [data-theme="dark"] .icon-btn',d:[['color','#F1E9DF']]},
 {sel:'.hero',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.hero-art',media:'(max-width: 620px)',d:[['aspect-ratio','16 / 6']]},
 {sel:'.hero-title',media:'(max-width: 620px)',d:[['font-size','34px']]},
 {sel:'.cards',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.nav-link',media:'(max-width: 440px)',d:[['display','none']]},
];
RULES.forEach((r,i)=>{r.id=i;r.d=r.d.map(([p,v])=>({p,v,on:true,orig:v}))});
function cssText(forSources){let out='/* Driftwood · app.css */\n';let line=2;const lines=[];
 const emit=s=>{out+=s+'\n';line++};
 let lastMedia=null;
 RULES.forEach(r=>{if(r.media!==lastMedia){if(lastMedia)emit('}');if(r.media)emit(`@media ${r.media} {`);lastMedia=r.media}
  const ind=r.media?'  ':'';r.line=line;emit(`${ind}${r.sel} {`);r.d.forEach(dd=>{dd.line=line;emit(`${ind}  ${dd.on?'':'/* '}${dd.p}: ${dd.v};${dd.on?'':' */'}`)});emit(`${ind}}`)});
 if(lastMedia)emit('}');return out}
function genCSS(){let css='';RULES.forEach(r=>{const body=r.d.filter(d=>d.on).map(d=>`${d.p}:${d.v}`).join(';');let sel=r.sel;if(sel.includes(':hover'))sel=sel+', '+sel.replace(/:hover/g,'.__hov');const blk=`${sel}{${body}}`;css+=r.media?`@container page ${r.media}{${blk}}`:blk});return css}
function specificity(sel){const s=sel.replace(/::[\w-]+/g,'');const a=(s.match(/#[\w-]+/g)||[]).length,b=(s.match(/(\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+)/g)||[]).length,c=(s.replace(/(\.[\w-]+|\[[^\]]+\]|:[\w-]+|#[\w-]+)/g,' ').match(/(^|[\s>+~])[a-z][\w-]*/gi)||[]).length;return a*10000+b*100+c}

const pageHost=$('#pageHost');const shadow=pageHost.attachShadow({mode:'open'});
shadow.innerHTML=`<style>:host{display:block;position:absolute;inset:0;overflow:auto;container-type:inline-size;container-name:page;background:#F4EFE8;scrollbar-width:thin}
html{display:block;min-height:100%}head{display:none}
.__web-inspector-hide-shortcut__{visibility:hidden!important}
.hero-art.__blocked{background:repeating-linear-gradient(45deg,#e8e0d6 0 10px,#efe8df 10px 20px)!important;outline:1px dashed #c9bba9}
.__nojs .btn{cursor:not-allowed}
</style><style id="appcss"></style>`;
const appcss=$('#appcss',shadow);
function applyCSS(){cssText();appcss.textContent=ST.effBlocked&&ST.effBlocked.has('app.css')?'':genCSS();bus.emit('css')}
const HTML=document.createElement('html');HTML.setAttribute('lang','en');
const HEAD=document.createElement('head');HEAD.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Driftwood — Specialty Coffee</title><link rel="manifest" href="/manifest.json"><script src="/js/vendor.min.js" defer></'+'script><script src="/js/app.js" type="module"></'+'script><script src="/js/cart.js" type="module"></'+'script>';
const BODY=document.createElement('body');BODY.className='shop';BODY.dataset.theme='light';
BODY.innerHTML=`<nav class="nav"><a class="logo" href="/">DRIFTWOOD</a><a class="nav-link" href="/shop">Shop</a><a class="nav-link" href="/guides">Brew guides</a><button class="icon-btn theme-toggle" aria-label="Toggle dark theme">☾ Theme</button><button class="icon-btn cart-pill">Cart <b class="count">0</b></button></nav>
<header class="hero"><div><h1 class="hero-title">Slow coffee, fast site.</h1><p class="lede">Single-origin beans, roasted every Tuesday in small batches.</p><a class="btn cta" href="#shop">Order beans →</a></div><div class="hero-art" role="img" aria-label="Pour-over coffee"></div></header>
<section class="cards" id="shop">${PRODUCTS.map(p=>`<article class="card" data-id="${p.id}" style="--art:${p.art}"><div class="thumb"></div><h3>${p.name}</h3><p class="notes">${p.notes}</p><div class="row"><span class="price">$${p.price.toFixed(2)}</span><button class="btn add">Add</button></div></article>`).join('')}</section>
<aside class="cart-bar"><span>Cart: <b class="count">0</b> items · <b class="total">$0.00</b></span><button class="btn checkout">Checkout</button></aside>
<section class="news"><p>Roast-day emails, once a week.</p><button class="btn subscribe">Subscribe</button></section>
<div class="toasts" aria-live="polite"></div>`;
HTML.append(HEAD,BODY);shadow.appendChild(HTML);
const PAGE={root:HTML,body:BODY,shadow,q:s=>BODY.querySelector(s),qa:s=>[...BODY.querySelectorAll(s)]};

/* ---------- storage model (Application panel) ---------- */
const LS=new Map([['theme','light'],['cart','[]'],['lastVisit','2026-09-24T21:14:03Z'],['ab_hero','B'],['consent','{"analytics":true,"ads":false}']]);
const SS=new Map([['checkoutStep','1'],['utm_source','newsletter']]);
let COOKIES=[
 {name:'session',value:'8f2c1d77e91a4b0c',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Lax',priority:'Medium'},
 {name:'csrf_token',value:'Zk3r9Qa7Lm2x',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Strict',priority:'High'},
 {name:'cart_id',value:'c_20931',domain:'.driftwood.coffee',path:'/',expires:'2026-10-24T21:14:03Z',httpOnly:false,secure:false,sameSite:'None',priority:'Medium',issue:'SameSite=None without Secure: this cookie is rejected by the browser.'},
 {name:'_ga',value:'GA1.1.447190.1727212443',domain:'.driftwood.coffee',path:'/',expires:'2027-10-29T09:00:00Z',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'},
 {name:'theme',value:'light',domain:'driftwood.coffee',path:'/',expires:'2027-09-24T21:14:03Z',httpOnly:false,secure:true,sameSite:'Lax',priority:'Low'}];
let IDB=[{key:'A-1042',value:'{item:"Ethiopia Guji", qty:2, total:37}'},{key:'A-1043',value:'{item:"Colombia Huila", qty:1, total:17}'},{key:'A-1044',value:'{item:"Kenya Nyeri", qty:3, total:58.5}'}];
let CACHES=[{name:'sw-v3',entries:[['/','text/html','14.2 kB'],['/css/app.css','text/css','8.1 kB'],['/js/app.js','text/javascript','42.7 kB'],['/js/cart.js','text/javascript','6.4 kB'],['/img/hero.avif','image/avif','182 kB']]}];
const SW={status:'activated and is running',offline:false,updateOnReload:false,bypass:false,version:'#412'};

/* ================= console model ================= */
const CON={msgs:[],listeners:[],add(m){m.id=CON.msgs.length?CON.msgs[CON.msgs.length-1].id+1:1;m.time=Date.now();
  const last=CON.msgs[CON.msgs.length-1];
  if(last&&last.type===m.type&&m.type!=='result'&&m.type!=='input'&&!m.table&&last.sig&&last.sig===(m.sig=sigOf(m))){last.count=(last.count||1)+1;CON.listeners.forEach(f=>f('update',last));return last}
  m.sig=m.sig||sigOf(m);CON.msgs.push(m);CON.listeners.forEach(f=>f('add',m));bus.emit('console-count');return m},
 clear(){CON.msgs=[];CON.listeners.forEach(f=>f('clear'));bus.emit('console-count')}};
function sigOf(m){try{return m.type+'|'+(m.src||'')+'|'+m.args.map(a=>typeof a==='object'&&a!==null?'[o]':String(a)).join(' ')}catch{return ''}}
const pageConsole={};
['log','info','warn','error','debug'].forEach(k=>pageConsole[k]=(...args)=>CON.add({type:k==='debug'?'verbose':k,args,src:pageConsole._src||'VM1:1'}));
pageConsole.table=(data)=>CON.add({type:'log',table:data,args:[data],src:pageConsole._src||'VM1:1'});
const timers={},counters={};
pageConsole.time=(l='default')=>{timers[l]=now()};
pageConsole.timeEnd=(l='default')=>{if(timers[l]==null){pageConsole.warn(`Timer '${l}' does not exist`);return}const d=now()-timers[l];delete timers[l];CON.add({type:'log',args:[`${l}: ${d.toFixed(3)} ms`],src:pageConsole._src||'VM1:1',plain:true})};
pageConsole.count=(l='default')=>{counters[l]=(counters[l]||0)+1;CON.add({type:'log',args:[`${l}: ${counters[l]}`],plain:true,src:pageConsole._src||'VM1:1'})};
pageConsole.group=(...a)=>CON.add({type:'log',group:true,args:a.length?a:['console.group'],src:'VM1:1'});pageConsole.groupEnd=()=>{};
pageConsole.trace=(...a)=>CON.add({type:'log',args:['console.trace',...a],trace:['(anonymous) @ VM1:1'],src:'VM1:1'});
pageConsole.assert=(c,...a)=>{if(!c)CON.add({type:'error',args:['Assertion failed:',...a],src:'VM1:1'})};
pageConsole.dir=(o)=>CON.add({type:'log',args:[o],src:'VM1:1'});
pageConsole.clear=()=>{CON.clear();CON.add({type:'verbose',args:['Console was cleared'],plain:true,src:''})};
function withSrc(src,fn){const p=pageConsole._src;pageConsole._src=src;try{fn()}finally{pageConsole._src=p}}

/* ================= network model ================= */
const THROTTLE={none:{k:1,label:'No throttling'},fast4g:{k:1.7,label:'Fast 4G'},slow4g:{k:3.4,label:'Slow 4G'},'3g':{k:5.5,label:'3G'},offline:{k:1,label:'Offline'}};
const RESOURCES=[
 {name:'shop',path:'/shop',type:'document',mime:'text/html',init:'Other',size:14200,start:0,dur:212,first:true},
 {name:'app.css',path:'/css/app.css',type:'stylesheet',mime:'text/css',init:'shop',size:8100,start:226,dur:64,cache:true},
 {name:'IBMPlexSans.woff2',path:'/fonts/IBMPlexSans.woff2',type:'font',mime:'font/woff2',init:'app.css',size:48300,start:298,dur:88,cache:true},
 {name:'app.js',path:'/js/app.js',type:'script',mime:'text/javascript',init:'shop',size:42700,start:228,dur:120,cache:true},
 {name:'cart.js',path:'/js/cart.js',type:'script',mime:'text/javascript',init:'app.js:3',size:6400,start:352,dur:41,cache:true},
 {name:'vendor.min.js',path:'/js/vendor.min.js',type:'script',mime:'text/javascript',init:'shop',size:188000,start:230,dur:170,cache:true},
 {name:'hero.avif',path:'/img/hero.avif',type:'avif',mime:'image/avif',init:'shop',size:182000,start:240,dur:260,cache:true},
 {name:'guji.webp',path:'/img/guji.webp',type:'webp',mime:'image/webp',init:'shop',size:34200,start:420,dur:96,cache:true},
 {name:'huila.webp',path:'/img/huila.webp',type:'webp',mime:'image/webp',init:'shop',size:31800,start:424,dur:91,cache:true},
 {name:'nyeri.webp',path:'/img/nyeri.webp',type:'webp',mime:'image/webp',init:'shop',size:36000,start:430,dur:102,cache:true},
 {name:'products?limit=12',path:'/api/products?limit=12',type:'fetch',mime:'application/json',init:'app.js:41',size:3100,start:520,dur:148,api:true},
 {name:'analytics.js',path:'/js/analytics.js',type:'script',mime:'text/javascript',init:'shop',size:22500,start:560,dur:76,cache:true},
 {name:'og-image.png',path:'/img/og-image.png',type:'png',mime:'text/html',init:'shop',size:512,start:600,dur:48,status:404},
 {name:'collect?v=2',path:'/collect?v=2&tid=G-D1',type:'ping',mime:'text/plain',init:'analytics.js:1',size:0,start:760,dur:35,status:204},
 {name:'manifest.json',path:'/manifest.json',type:'manifest',mime:'application/manifest+json',init:'Other',size:1100,start:820,dur:12,cache:true},
 {name:'sw.js',path:'/sw.js',type:'script',mime:'text/javascript',init:'app.js:88',size:3400,start:840,dur:26},
 {name:'favicon.svg',path:'/favicon.svg',type:'svg+xml',mime:'image/svg+xml',init:'Other',size:912,start:870,dur:14,cache:true}];
const TYPEGROUP={document:'Doc',stylesheet:'CSS',font:'Font',script:'JS',avif:'Img',webp:'Img',png:'Img','svg+xml':'Img',fetch:'Fetch/XHR',xhr:'Fetch/XHR',ping:'Other',manifest:'Manifest'};
const NET={entries:[],seq:0,navStart:0,dcl:0,load:0,listeners:[],emit(){this.listeners.forEach(f=>f())},
 mk(o){const k=THROTTLE[ST.throttle].k;const fromCache=!ST.disableCache&&o.cache&&ST.loadCount>1;const blocked=ST.blocked.has(o.name);const offline=ST.offline||ST.throttle==='offline';
  const dur=fromCache?1+Math.random()*3:o.dur*k*(ST.cpu>1?1.05:1)*(0.9+Math.random()*0.2);
  const e={id:++NET.seq,name:o.name,url:'https://driftwood.coffee'+o.path,path:o.path,method:o.method||'GET',type:o.type,mime:o.mime,initiator:o.init,
   status:blocked?0:offline?0:(o.status||200),size:o.size,transferred:fromCache?0:o.size+ (o.size?420:180),fromCache,blocked,failed:blocked||offline,
   start:o.start*k,dur:blocked||offline?2:dur,phases:null,api:o.api,body:o.body,resBody:o.resBody,t0:now(),reqBody:o.reqBody};
  const d=e.dur;e.phases=o.first&&!fromCache?{queue:d*.04,dns:d*.1,connect:d*.13,ssl:d*.12,ttfb:d*.36,download:d*.25}:fromCache?{queue:d*.4,ttfb:d*.4,download:d*.2}:{queue:d*.08,ttfb:d*.6,download:d*.32};
  e.statusText=e.blocked?'(blocked:devtools)':offline?'(failed)':({200:'OK',204:'No Content',404:'Not Found',500:'Internal Server Error',201:'Created'})[e.status]||'';
  return e},
 pageLoad(){if(!ST.preserve)NET.entries=[];NET.navStart=now();ST.loadCount++;const k=THROTTLE[ST.throttle].k;
  RESOURCES.forEach(r=>{const e=NET.mk(r);e.t0=NET.navStart+e.start/ (k>2?1.4:1)*0+e.start;NET.entries.push(e)});
  NET.dcl=412*k;NET.load=1210*k;NET.emit();
  // console side effects of a load
  setTimeout(()=>{if(ST.offline||ST.throttle==='offline'){CON.add({type:'error',args:['GET https://driftwood.coffee/shop net::ERR_INTERNET_DISCONNECTED'],src:'shop'});return}
   if(!ST.blocked.has('og-image.png'))CON.add({type:'error',args:['GET https://driftwood.coffee/img/og-image.png 404 (Not Found)'],src:'shop:1',net:true});
   CON.add({type:'warn',args:['DevTools failed to load source map: Could not load content for https://driftwood.coffee/js/vendor.min.js.map: HTTP error: status code 404'],src:''});
   if(ST.blocked.has('app.js'))CON.add({type:'error',args:['GET https://driftwood.coffee/js/app.js net::ERR_BLOCKED_BY_CLIENT'],src:'shop:12'});
   else withSrc('app.js:41',()=>pageConsole.info('Driftwood v2.4.1 · 12 products loaded'));
   withSrc('analytics.js:1',()=>pageConsole.debug('[analytics] page_view sent'));
  },Math.min(900,700*k))},
 request(url,opts={}){const path=url.replace(/^https?:\/\/[^/]+/,'');const name=path.split('/').pop()||path;const method=(opts.method||'GET').toUpperCase();
  let status=200,resBody='{}';if(path.startsWith('/api/cart')&&method==='POST'){status=500;resBody='{\n  "error": "inventory service timeout",\n  "requestId": "7f3a9c2e-51b0"\n}'}
  else if(path.startsWith('/api/cart')){resBody=JSON.stringify({items:cart.items},null,2)}else if(path.startsWith('/api/products')){resBody=JSON.stringify(PRODUCTS.map(({art,...p})=>p),null,2)}else if(path.startsWith('/api/')){status=404;resBody='{"error":"not found"}'}
  const e=NET.mk({name,path,type:'fetch',mime:'application/json',init:opts.initiator||'VM1:1',size:resBody.length,start:0,dur:opts.dur||(status===500?310:140),status,method});
  e.reqBody=opts.body||null;e.resBody=resBody;e.t0=now();e.start=now()-(NET.navStart||now());
  if(ST.recordingNet!==false)NET.entries.push(e);NET.emit();
  return new Promise((res,rej)=>{setTimeout(()=>{if(e.failed){const err=new TypeError('Failed to fetch');CON.add({type:'error',args:[`${method} ${e.url} ${e.blocked?'net::ERR_BLOCKED_BY_CLIENT':'net::ERR_INTERNET_DISCONNECTED'}`],src:opts.initiator||'VM1:1'});rej(err);return}
   if(status>=400)CON.add({type:'error',args:[`${method} ${e.url} ${status} (${e.statusText})`],src:opts.initiator||'VM1:1',net:true});
   res({ok:status<400,status,statusText:e.statusText,url:e.url,headers:{'content-type':'application/json'},json:async()=>JSON.parse(resBody),text:async()=>resBody,[Symbol.toStringTag]:'Response'})},e.dur)})}};
const simFetch=(u,o)=>NET.request(String(u),o);

/* ================= demo app logic ("app.js" / "cart.js") ================= */
const cart={items:[]};const orders=[{id:'A-1042',item:'Ethiopia Guji',qty:2,total:37},{id:'A-1043',item:'Colombia Huila',qty:1,total:17},{id:'A-1044',item:'Kenya Nyeri',qty:3,total:58.5}];
const toastCache=[];
function round(n){return Math.round(n*100)/100}
function calcTotal(items){let total=0;for(const item of items){const line=item.price*item.qty;total+=line}if(total>100)total*=0.9;return round(total)}
function renderCart(){const n=cart.items.reduce((a,i)=>a+i.qty,0);PAGE.qa('.count').forEach(c=>c.textContent=n);PAGE.q('.total').textContent='$'+calcTotal(cart.items).toFixed(2)}
function saveCart(){LS.set('cart',JSON.stringify(cart.items.map(i=>({id:i.id,qty:i.qty}))));bus.emit('storage')}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const it=cart.items.find(i=>i.id===id);if(it)it.qty++;else cart.items.push({id,name:p.name,price:p.price,qty:1});saveCart();renderCart();withSrc('cart.js:24',()=>pageConsole.debug(`added ${p.name} → cart has ${cart.items.length} line(s)`))}
function pageToast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.textContent=msg;PAGE.q('.toasts').appendChild(t);if(window.__memToastHook)window.__memToastHook();setTimeout(()=>{t.remove();toastCache.push(t)},2600)}
function setTheme(v){BODY.dataset.theme=v;LS.set('theme',v);const c=COOKIES.find(c=>c.name==='theme');if(c)c.value=v;bus.emit('storage')}
async function checkout(){if(!cart.items.length){pageToast('Your cart is empty — add a coffee first.');return}
 const total=await DBG.run(cart);  // may pause on breakpoints
 const res=await simFetch('/api/cart',{method:'POST',body:JSON.stringify({total}),initiator:'cart.js:16'}).catch(()=>null);
 if(!res||!res.ok)pageToast(`Checkout failed (${res?res.status:'offline'}). Try again.`,true);}
const LISTENERS=[];
function on(el,type,fn,src){const L={el,type,src,fn};el.addEventListener(type,e=>{if(L.removed||ST.jsDisabled||ST.effBlocked&&ST.effBlocked.has(src.split(':')[0]))return;perfHook(type,el);fn(e)});LISTENERS.push(L)}
function wirePage(){
 on(PAGE.q('.theme-toggle'),'click',()=>setTheme(BODY.dataset.theme==='dark'?'light':'dark'),'app.js:57');
 PAGE.qa('.btn.add').forEach(b=>on(b,'click',()=>addToCart(b.closest('.card').dataset.id),'cart.js:18'));
 on(PAGE.q('.btn.checkout'),'click',()=>checkout(),'cart.js:31');
 on(PAGE.q('.cart-pill'),'click',()=>PAGE.q('.cart-bar').scrollIntoView({behavior:'smooth',block:'center'}),'app.js:63');
 on(PAGE.q('.btn.cta'),'click',e=>{e.preventDefault();PAGE.q('#shop').scrollIntoView({behavior:'smooth'})},'app.js:49');
 on(PAGE.q('.btn.subscribe'),'click',()=>pageToast('Subscribed ✓ See you on roast day.'),'app.js:72');
 PAGE.qa('a').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
}
function perfHook(type,el){bus.emit('page-event',{type,el,t:now()})}
function reloadPage(silent){const vp=$('#viewport');vp.style.transition='none';vp.style.opacity='.25';ST.effBlocked=new Set(ST.blocked);
 PAGE.q('.hero-art').classList.toggle('__blocked',ST.blocked.has('hero.avif'));
 NET.pageLoad();applyCSS();bus.emit('reload');
 const off=ST.offline||ST.throttle==='offline';let dino=$('#dino');if(off&&!dino){dino=h('<div id="dino" style="position:absolute;inset:0;z-index:15;background:#fff;color:#5F6368;display:flex;flex-direction:column;justify-content:center;padding:0 12%;font:400 15px/1.6 var(--body)"><div style="font:600 22px var(--body);color:#202124;margin-bottom:8px">No internet</div><div>Try checking the network cables, modem, and router.</div><div style="font:400 12px var(--mono);margin-top:14px">ERR_INTERNET_DISCONNECTED</div></div>');$('#pagearea').appendChild(dino)}else if(!off&&dino)dino.remove();
 setTimeout(()=>{vp.style.transition='opacity .35s';vp.style.opacity='1'},Math.min(900,260*THROTTLE[ST.throttle].k));
 if(silent!==true)track('reload')}
```

### 8/16 · `F12-Field-Guide-source/site/src/elements.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/elements.js", "lines": 191, "final_newline": true, "sha256": "16068815cf3096b208a437e233dd7e3029efaec843c6453d0646387b074f78e2", "original_sha256": "16068815cf3096b208a437e233dd7e3029efaec843c6453d0646387b074f78e2"} -->
```js
/* ================= Elements panel ================= */
const EL={opened:new WeakSet(),rows:[],flashNodes:new Set(),grids:new Set(),domBps:new Map(),undo:[],sub:'styles'};
const VOID=new Set(['meta','link','img','br','input','hr','source']);
const HIDE_CLS='__web-inspector-hide-shortcut__';
[HTML,BODY,PAGE.q('.hero'),PAGE.q('.hero > div'),PAGE.q('.cards')].forEach(n=>EL.opened.add(n));

function nodeLabel(n){if(!n||n.nodeType!==1)return'';const cls=[...n.classList].filter(c=>c!=='__hov'&&c!==HIDE_CLS);return n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(cls.length?'.'+cls.join('.'):'')}
function attrsHTML(n){return [...n.attributes].map(a=>{let v=a.value;if(a.name==='class')v=v.split(/\s+/).filter(c=>c!=='__hov').join(' ');if(a.name==='class'&&!v)return'';return ` <span class="an" data-attr="${esc(a.name)}">${esc(a.name)}</span>${v!==''||a.name!=='hidden'?`=<span class="av" data-attr-v="${esc(a.name)}">"${esc(v)}"</span>`:''}`}).join('')}

function buildElements(p){
 p.innerHTML=`<div class="split adapt" style="flex:1;min-height:0">
 <div class="a"><div class="tree scroll" id="tree" tabindex="0" data-hs="el-tree" aria-label="DOM tree"></div><div class="crumbs" id="crumbs" data-hs="el-crumbs"></div></div>
 <div class="b"><div class="subt" id="elSub" data-hs="el-sub">${[['styles','Styles'],['computed','Computed'],['layout','Layout'],['listeners','Event Listeners'],['a11y','Accessibility']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='styles'}">${l}</button>`).join('')}</div>
  <div id="elView" class="scroll" style="flex:1;min-height:0"></div></div></div>`;
 const tree=$('#tree');
 tree.addEventListener('mouseover',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];if(n&&n.nodeType===1){highlight(n);track('hover-node')}});
 tree.addEventListener('mouseleave',()=>{if(!ST.inspecting)clearHL()});
 tree.addEventListener('click',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  if(e.target.classList.contains('lbadge')){toggleGrid(n);return}
  if(e.target.classList.contains('tw')){if(EL.opened.has(n))EL.opened.delete(n);else EL.opened.add(n);if(e.altKey)n.querySelectorAll('*').forEach(c=>EL.opened.add(c));renderTree();return}
  if(n&&n.nodeType===1)select(n);else if(n&&n.parentNode)select(n.parentNode)});
 tree.addEventListener('dblclick',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  const av=e.target.closest('[data-attr-v]');if(av){editInline(av,av.textContent.replace(/^"|"$/g,''),v=>{n.setAttribute(av.dataset.attrV,v);track('edit-dom')});return}
  const tx=e.target.closest('.tx');if(tx){const tn=[...n.childNodes].find(c=>c.nodeType===3&&c.textContent.trim())||n;editInline(tx,tn.textContent.trim(),v=>{if(tn.nodeType===3)tn.textContent=v;else n.textContent=v;track('edit-dom')});return}});
 tree.addEventListener('contextmenu',e=>{const r=e.target.closest('.tr');if(!r)return;e.preventDefault();const n=EL.rows[+r.dataset.i];if(!n||n.nodeType!==1)return;select(n);elMenu(n,e.clientX,e.clientY)});
 tree.addEventListener('keydown',treeKeys);
 $('#elSub').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;EL.sub=b.dataset.k;$$('#elSub button').forEach(x=>x.setAttribute('aria-selected',x===b));renderSide();if(EL.sub==='computed')track('computed')});
 new MutationObserver(ms=>{let domBp=null;ms.forEach(m=>{const t=m.type==='characterData'?m.target.parentNode:m.target;if(t&&t.nodeType===1&&!(m.type==='attributes'&&m.attributeName==='class'&&String(m.oldValue||'').includes('__hov')!==(t.className||'').includes('__hov')&&false)){EL.flashNodes.add(t)}
   for(const [bn,types] of EL.domBps){if(types.has('subtree')&&bn!==t&&bn.contains(t)&&m.type!=='attributes')domBp={node:bn,type:'subtree modifications'};if(types.has('attributes')&&bn===t&&m.type==='attributes'&&!m.attributeName.startsWith('__'))domBp={node:bn,type:'attribute modifications'}}});
  scheduleTree();if(domBp)DBG.pauseDom(domBp)}).observe(HTML,{subtree:true,childList:true,attributes:true,characterData:true,attributeOldValue:true});
 renderTree();select(PAGE.q('.btn.cta'),true);
}
let treeT;function scheduleTree(){clearTimeout(treeT);treeT=setTimeout(()=>{if(P.elements.built){renderTree();if(EL.sub!=='styles'||!document.activeElement||!document.activeElement.closest('#elView'))renderSide()}},30)}

function renderTree(){const tree=$('#tree');if(!tree)return;const st=tree.scrollTop;EL.rows=[];let html='';
 const row=(n,d,inner,cls='')=>{const i=EL.rows.push(n)-1;const flash=EL.flashNodes.has(n)?' flash':'';html+=`<div class="tr${n===ST.sel?' sel':''}${cls}${flash}" data-i="${i}" style="padding-left:${d*14+6}px">${inner}</div>`};
 html+=`<div class="tr" data-i="-1" style="padding-left:6px"><span class="tw"></span><span class="cm">&lt;!DOCTYPE html&gt;</span></div>`;
 const walk=(n,d)=>{if(n.nodeType===3){const t=n.textContent.trim();if(t)row(n,d,`<span class="tw"></span><span class="tx">"${esc(t.length>80?t.slice(0,80)+'…':t)}"</span>`);return}
  if(n.nodeType===8){row(n,d,`<span class="tw"></span><span class="cm">&lt;!--${esc(n.textContent)}--&gt;</span>`);return}
  if(n.nodeType!==1)return;const tag=n.tagName.toLowerCase();const kids=[...n.childNodes].filter(c=>c.nodeType===1||c.nodeType===8||(c.nodeType===3&&c.textContent.trim()));
  const hid=n.classList.contains(HIDE_CLS)?' hid':'';let badge='';if(n.nodeType===1&&n.isConnected&&n!==HTML&&n!==HEAD&&!HEAD.contains(n)){const dsp=getComputedStyle(n).display;if(/grid/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle grid overlay">grid</span>`;else if(/flex/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle flexbox overlay">flex</span>`}
  const eq=n===ST.sel?'<span class="eq">== $0</span>':'';const open=`<span class="tg">&lt;${tag}</span>${attrsHTML(n)}<span class="tg">&gt;</span>`;const close=`<span class="tg">&lt;/${tag}&gt;</span>`;
  if(VOID.has(tag)){row(n,d,`<span class="tw"></span>${open}${badge}${eq}`,hid);return}
  if(!kids.length){row(n,d,`<span class="tw"></span>${open}${close}${badge}${eq}`,hid);return}
  if(kids.length===1&&kids[0].nodeType===3&&kids[0].textContent.trim().length<70){row(n,d,`<span class="tw"></span>${open}<span class="tx">${esc(kids[0].textContent.trim())}</span>${close}${badge}${eq}`,hid);return}
  const isOpen=EL.opened.has(n);
  if(!isOpen){row(n,d,`<span class="tw">▸</span>${open}…${close}${badge}${eq}`,hid);return}
  row(n,d,`<span class="tw">▾</span>${open}${badge}${eq}`,hid);kids.forEach(k=>walk(k,d+1));const ci=EL.rows.push(n)-1;html+=`<div class="tr${n===ST.sel?' sel':''}" data-i="${ci}" style="padding-left:${d*14+6}px"><span class="tw"></span>${close}</div>`};
 walk(HTML,0);tree.innerHTML=html;tree.scrollTop=st;EL.flashNodes.clear();renderCrumbs()}
function renderCrumbs(){const c=$('#crumbs');if(!c)return;const chain=[];let n=ST.sel;while(n&&n.nodeType===1){chain.unshift(n);if(n===HTML)break;n=n.parentNode}
 c.innerHTML='';chain.forEach(x=>{const b=h(`<button class="${x===ST.sel?'on':''}">${esc(nodeLabel(x))}</button>`);b.onclick=()=>select(x);b.onmouseenter=()=>highlight(x);b.onmouseleave=clearHL;c.appendChild(b)})}
function select(n,quiet){if(!n||n.nodeType!==1)return;ST.sel=n;let p=n.parentNode;while(p&&p.nodeType===1){EL.opened.add(p);p=p.parentNode}
 window.$0=n;if(P.elements.built){renderTree();renderSide();const r=$('#tree .tr.sel');if(r&&!quiet){const tr=$('#tree');const rt=r.offsetTop;if(rt<tr.scrollTop||rt>tr.scrollTop+tr.clientHeight-30)tr.scrollTop=rt-tr.clientHeight/3}}
 if(!quiet)track('select-node');bus.emit('select',n)}
function editInline(span,val,commit){const e=h(`<span class="edit" contenteditable="true" spellcheck="false"></span>`);e.textContent=val;span.replaceWith(e);e.focus();document.getSelection().selectAllChildren(e);
 let done=false;const fin=ok=>{if(done)return;done=true;const v=e.textContent;if(ok&&v!==val)commit(v);renderTree()};
 e.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Enter'){ev.preventDefault();fin(true)}if(ev.key==='Escape')fin(false)});e.addEventListener('blur',()=>fin(true))}
function treeKeys(e){const n=ST.sel;if(!n)return;const els=EL.rows.filter((x,i,a)=>x&&x.nodeType===1&&a.indexOf(x)===i);const i=els.indexOf(n);
 if(e.key==='ArrowDown'){e.preventDefault();select(els[Math.min(els.length-1,i+1)])}
 else if(e.key==='ArrowUp'){e.preventDefault();select(els[Math.max(0,i-1)])}
 else if(e.key==='ArrowRight'){e.preventDefault();if(!EL.opened.has(n)&&n.children.length){EL.opened.add(n);renderTree()}else if(n.firstElementChild)select(n.firstElementChild)}
 else if(e.key==='ArrowLeft'){e.preventDefault();if(EL.opened.has(n)){EL.opened.delete(n);renderTree()}else if(n.parentNode&&n.parentNode.nodeType===1)select(n.parentNode)}
 else if(e.key==='h'||e.key==='H'){if(BODY.contains(n)&&n!==BODY){n.classList.toggle(HIDE_CLS);track('hide-node')}}
 else if(e.key==='Delete'||e.key==='Backspace'){if(BODY.contains(n)&&n!==BODY){e.preventDefault();removeNode(n)}}
 else if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();const u=EL.undo.pop();if(u){u.parent.insertBefore(u.node,u.next);select(u.node);toast('Undo: node restored')}}}
function removeNode(n){const u={node:n,parent:n.parentNode,next:n.nextSibling};const nx=n.nextElementSibling||n.previousElementSibling||n.parentNode;n.remove();EL.undo.push(u);select(nx);toast('Deleted — Ctrl+Z in the tree restores it');track('delete-node')}
function cssPath(n){const parts=[];while(n&&n.nodeType===1&&n!==BODY){let s=n.tagName.toLowerCase();if(n.id){parts.unshift('#'+n.id);break}const cls=[...n.classList].filter(c=>!c.startsWith('__'));if(cls.length)s+='.'+cls.join('.');const sib=[...n.parentNode.children].filter(c=>c.tagName===n.tagName);if(sib.length>1)s+=`:nth-of-type(${sib.indexOf(n)+1})`;parts.unshift(s);n=n.parentNode}return (parts[0]&&parts[0].startsWith('#')?'':'body > ')+parts.join(' > ')}
function elMenu(n,x,y){const bps=EL.domBps.get(n)||new Set();const tog=t=>{if(bps.has(t))bps.delete(t);else bps.add(t);EL.domBps.set(n,bps);toast(bps.has(t)?`DOM breakpoint set: ${t==='subtree'?'subtree modifications':'attribute modifications'}`:'DOM breakpoint removed');track('dom-bp')};
 openMenu(x,y,[{label:'Add attribute',act:()=>{const at='data-note';n.setAttribute(at,'');renderTree()}},{label:'Edit as HTML',act:()=>editAsHTML(n)},'-',
  {label:ST.forceHover.has(n)?'✓ Force state :hover':'Force state :hover',act:()=>setForceHover(n,!ST.forceHover.has(n))},{label:n.classList.contains(HIDE_CLS)?'Show element':'Hide element',hint:'H',act:()=>{n.classList.toggle(HIDE_CLS);track('hide-node')}},{label:'Delete element',hint:'Del',act:()=>removeNode(n)},'-',
  {label:'Copy selector',act:()=>copyText(cssPath(n))},{label:'Copy JS path',act:()=>copyText(`document.querySelector("${cssPath(n)}")`)},{label:'Copy outerHTML',act:()=>copyText(n.outerHTML)},'-',
  {head:'Break on…'},{label:(bps.has('subtree')?'✓ ':'')+'subtree modifications',act:()=>tog('subtree')},{label:(bps.has('attributes')?'✓ ':'')+'attribute modifications',act:()=>tog('attributes')},'-',
  {label:'Store as global variable',act:()=>{let k=1;while(CONSOLE_VARS['temp'+k])k++;CONSOLE_VARS['temp'+k]=n;CON.add({type:'input',args:['temp'+k]});CON.add({type:'result',args:[n]});setPanel('console')}},{label:'Scroll into view',act:()=>n.scrollIntoView({block:'center',behavior:'smooth'})}])}
function editAsHTML(n){const r=[...$$('#tree .tr')].find(x=>EL.rows[+x.dataset.i]===n);if(!r)return;const ta=h('<textarea spellcheck="false" style="width:calc(100% - 20px);margin:2px 10px;height:120px;background:#17181A;color:#E3E3E3;border:1px solid #8AB4F8;font:400 12px/1.5 var(--mono);outline:none"></textarea>');ta.value=n.outerHTML;r.replaceWith(ta);ta.focus();
 const fin=()=>{try{const t=document.createElement('template');t.innerHTML=ta.value;const nn=t.content.firstElementChild;if(nn&&nn.outerHTML!==n.outerHTML){n.replaceWith(nn);select(nn);toast('Replaced — listeners on the old node are gone');track('edit-dom')}else renderTree()}catch{renderTree()}};ta.addEventListener('blur',fin);ta.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))ta.blur();if(e.key==='Escape'){ta.value=n.outerHTML;ta.blur()}})}
function setForceHover(n,on){if(on){ST.forceHover.add(n);n.classList.add('__hov')}else{ST.forceHover.delete(n);n.classList.remove('__hov')}renderSide();track('force-hover')}

/* ---------- highlight overlay ---------- */
function relRect(n){const pa=$('#pagearea').getBoundingClientRect();const r=n.getBoundingClientRect();return{x:r.left-pa.left,y:r.top-pa.top,w:r.width,h:r.height,pa}}
function highlight(n,inspect){const hl=$('#hl');hl.innerHTML='';if(!n||n.nodeType!==1||!n.isConnected||n===HTML||HEAD.contains(n)||n===HEAD)return;
 const r=relRect(n);if(!r.w&&!r.h&&n!==BODY)return;const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const px=k=>(parseFloat(cs[k])||0)*sc;
 const m=[px('marginTop'),px('marginRight'),px('marginBottom'),px('marginLeft')],b=[px('borderTopWidth'),px('borderRightWidth'),px('borderBottomWidth'),px('borderLeftWidth')],p=[px('paddingTop'),px('paddingRight'),px('paddingBottom'),px('paddingLeft')];
 const ring=(x,y,w,hh,bw,col,bg)=>{const d=document.createElement('div');d.className='ring';Object.assign(d.style,{left:x+'px',top:y+'px',width:Math.max(0,w)+'px',height:Math.max(0,hh)+'px',borderWidth:bw.map(v=>Math.max(0,v)+'px').join(' '),borderColor:col,background:bg||'transparent'});hl.appendChild(d)};
 ring(r.x-m[3],r.y-m[0],r.w+m[1]+m[3],r.h+m[0]+m[2],m,'rgba(246,178,107,.66)');ring(r.x,r.y,r.w,r.h,b,'rgba(255,229,153,.66)');ring(r.x+b[3],r.y+b[0],r.w-b[1]-b[3],r.h-b[0]-b[2],p,'rgba(147,196,125,.66)');
 ring(r.x+b[3]+p[3],r.y+b[0]+p[0],r.w-b[1]-b[3]-p[1]-p[3],r.h-b[0]-b[2]-p[0]-p[2],[0,0,0,0],'transparent','rgba(111,168,220,.6)');
 const cls=[...n.classList].filter(c=>!c.startsWith('__'));let tip=`<span class="t">${n.tagName.toLowerCase()}</span><span class="c">${n.id?'#'+n.id:''}${cls.length?'.'+cls.join('.'):''}</span><span class="d">${Math.round(n.offsetWidth*100)/100} × ${Math.round(n.offsetHeight*100)/100}</span>`;
 if(inspect){const ct=contrastOf(n);const nm=accName(n);tip+=`<table><tr><td>Color</td><td>${swatchTxt(cs.color)}</td></tr><tr><td>Font</td><td>${esc(cs.fontSize+' '+cs.fontFamily.split(',')[0].replace(/"/g,''))}</td></tr>${effBg(n)?`<tr><td>Background</td><td>${swatchTxt(effBg(n))}</td></tr>`:''}${cs.padding!=='0px'?`<tr><td>Padding</td><td>${cs.padding}</td></tr>`:''}${cs.margin!=='0px'?`<tr><td>Margin</td><td>${cs.margin}</td></tr>`:''}
  <tr><td colspan="2" class="sec">ACCESSIBILITY</td></tr>${ct&&n.textContent.trim()?`<tr><td>Contrast</td><td>Aa ${ct.toFixed(2)} <b style="color:${ct>=4.5?'#188038':'#E37400'}">${ct>=4.5?'✓':'⚠'}</b></td></tr>`:''}<tr><td>Name</td><td>${esc((nm||'').slice(0,26))}</td></tr><tr><td>Role</td><td>${roleOf(n)}</td></tr><tr><td>Keyboard-focusable</td><td>${n.tabIndex>=0?'<b style="color:#188038">✓</b>':'<span style="color:#9AA0A6">⊘</span>'}</td></tr></table>`}
 const t=h(`<div class="hltip">${tip}</div>`);hl.appendChild(t);const pa=r.pa;let ty=r.y+r.h+m[2]+8;if(ty+t.offsetHeight>pa.height-4)ty=Math.max(4,r.y-m[0]-t.offsetHeight-8);let tx=clamp(r.x,4,pa.width-t.offsetWidth-4);t.style.left=tx+'px';t.style.top=ty+'px'}
function clearHL(){const hl=$('#hl');if(hl)hl.innerHTML=''}
function swatchTxt(c){const hx=toHex(c);return `<i style="display:inline-block;width:10px;height:10px;border:1px solid #999;background:${c};vertical-align:-1px;margin-right:4px"></i>${hx||c}`}
function parseRGB(c){const m=String(c).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null}
function toHex(c){if(/^#/.test(c))return c.toUpperCase();const v=parseRGB(c);if(!v)return null;return'#'+v.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase()}
function effBg(n){let x=n;while(x&&x.nodeType===1){const cs=getComputedStyle(x);const v=parseRGB(cs.backgroundColor);if(v&&v[3]>0.5)return cs.backgroundColor;if(cs.backgroundImage!=='none'){const m=cs.backgroundImage.match(/rgba?\([^)]+\)/);if(m)return m[0]}x=x.parentNode}return 'rgb(244, 239, 232)'}
function lum(v){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(v[0])+.7152*f(v[1])+.0722*f(v[2])}
function contrast(a,b){const A=lum(a)+.05,B=lum(b)+.05;return Math.max(A,B)/Math.min(A,B)}
function contrastOf(n){const fg=parseRGB(getComputedStyle(n).color),bg=parseRGB(effBg(n));return fg&&bg?contrast(fg,bg):null}
function roleOf(n){const t=n.tagName.toLowerCase();return n.getAttribute('role')||({a:'link',button:'button',h1:'heading',h2:'heading',h3:'heading',nav:'navigation',header:'banner',section:'region',article:'article',aside:'complementary',p:'paragraph',body:'generic',img:'image'})[t]||'generic'}
function accName(n){return n.getAttribute('aria-label')||(/^(a|button|h\d|p|span|b)$/i.test(n.tagName)?n.textContent.trim():'')}

/* ---------- inspect mode ---------- */
function setInspect(on){ST.inspecting=on;$('#inspectBtn').setAttribute('aria-pressed',on);$('#pagearea').style.cursor=on?'crosshair':'';if(!on)clearHL();else{toast('Hover the page, click to select an element')}}
shadow.addEventListener('mousemove',e=>{if(!ST.inspecting)return;const t=e.composedPath()[0];if(t&&t.nodeType===1){highlight(t,true);ST._hov=t}},true);
shadow.addEventListener('click',e=>{if(!ST.inspecting)return;e.preventDefault();e.stopPropagation();const t=e.composedPath()[0];setInspect(false);if(!ST.open)toggleDevtools(true);setPanel('elements');select(t);highlight(t);setTimeout(clearHL,900);track('inspect-pick')},true);
pageHost.addEventListener('mouseleave',()=>{if(ST.inspecting)clearHL()});
pageHost.addEventListener('scroll',()=>{clearHL();drawGrids()},{passive:true});

/* ---------- grid / flex overlays ---------- */
function toggleGrid(n){if(EL.grids.has(n))EL.grids.delete(n);else EL.grids.add(n);renderTree();drawGrids();if(EL.sub==='layout')renderSide();track('grid-overlay')}
function drawGrids(){$$('.gridov').forEach(g=>g.remove());const pa=$('#pagearea');if(!pa)return;EL.grids.forEach(n=>{if(!n.isConnected)return;const r=relRect(n);const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const isGrid=/grid/.test(cs.display);const col=isGrid?'#C76EDC':'#8AB4F8';
  const g=h(`<div class="gridov" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`);let s=`<div style="position:absolute;inset:0;border:2px ${isGrid?'solid':'dashed'} ${col}"></div>`;
  const pl=(parseFloat(cs.paddingLeft)||0)*sc,pt=(parseFloat(cs.paddingTop)||0)*sc,pb=(parseFloat(cs.paddingBottom)||0)*sc;
  if(isGrid){const cols=cs.gridTemplateColumns.split(' ').map(parseFloat).filter(x=>!isNaN(x)).map(x=>x*sc);const gap=(parseFloat(cs.columnGap)||0)*sc;let x=pl;const lines=[x];cols.forEach((w,i)=>{x+=w;lines.push(x);if(i<cols.length-1){s+=`<div style="position:absolute;left:${x}px;width:${gap}px;top:${pt}px;bottom:${pb}px;background:repeating-linear-gradient(45deg,rgba(199,110,220,.45) 0 2px,transparent 2px 6px)"></div>`;x+=gap;lines.push(x)}});
   lines.forEach((lx,i)=>{s+=`<div style="position:absolute;left:${lx}px;top:${pt}px;bottom:${pb}px;border-left:1.5px dashed ${col}"></div>`});
   const starts=[pl];let acc=pl;cols.forEach((w,i)=>{acc+=w+(i<cols.length-1?gap:0);starts.push(acc)});starts.forEach((lx,i)=>s+=`<div style="position:absolute;left:${lx-9}px;top:${Math.max(-18,pt-18)}px;background:${col};color:#fff;font:700 10px/16px var(--mono);padding:0 4px;border-radius:3px">${i+1}</div>`);
   let cx=pl;cols.forEach((w,i)=>{s+=`<div style="position:absolute;left:${cx+w/2-24}px;top:${pt+4}px;background:rgba(255,255,255,.9);color:#6E2B7F;font:600 10px/15px var(--mono);padding:0 4px;border-radius:3px;border:1px solid ${col}">${(w/sc).toFixed(1)}px</div>`;cx+=w+gap})}
  else{[...n.children].forEach(c=>{const cr=relRect(c);s+=`<div style="position:absolute;left:${cr.x-r.x}px;top:${cr.y-r.y}px;width:${cr.w}px;height:${cr.h}px;border:1px dashed ${col};background:rgba(138,180,248,.08)"></div>`})}
  g.innerHTML=s;pa.appendChild(g)})}
bus.on('css',()=>requestAnimationFrame(drawGrids));

/* ---------- side panes ---------- */
const UA={h1:[['display','block'],['font-size','2em'],['margin-block','0.67em'],['font-weight','bold']],h3:[['display','block'],['font-size','1.17em'],['margin-block','1em'],['font-weight','bold']],p:[['display','block'],['margin-block','1em']],a:[['color','-webkit-link'],['cursor','pointer'],['text-decoration','underline']],
 button:[['padding-block','1px'],['padding-inline','6px'],['border','2px outset buttonborder'],['background-color','buttonface'],['font','-webkit-small-control'],['color','buttontext']],nav:[['display','block']],header:[['display','block']],section:[['display','block']],article:[['display','block']],aside:[['display','block']],body:[['display','block'],['margin','8px']],div:[['display','block']]};
const INH=/^(color|font|font-.+|line-height|letter-spacing|text-align|visibility|cursor|white-space|word-spacing|text-transform)$/;
function mediaOk(m){const mm=m.match(/max-width:\s*(\d+)px/);return !mm||pageHost.clientWidth<=+mm[1]}
function matched(el){const res=[];RULES.forEach(r=>{let best=-1;r.sel.split(',').map(s=>s.trim()).forEach(part=>{const hov=/:hover/.test(part);const test=part.replace(/:hover/g,'');try{if(el.matches(test)&&(!hov||ST.forceHover.has(el)))best=Math.max(best,specificity(part))}catch{}});if(best>=0&&(!r.media||mediaOk(r.media)))res.push({r,spec:best})});
 res.sort((a,b)=>b.spec-a.spec||(b.r.media?1:0)-(a.r.media?1:0)||b.r.id-a.r.id);return res}
function inlineDecls(el){const s=el.getAttribute('style')||'';return s.split(';').map(x=>x.trim()).filter(Boolean).filter(x=>!x.startsWith('--art')||el.classList.contains('card')).map(x=>{const i=x.indexOf(':');return{p:x.slice(0,i).trim(),v:x.slice(i+1).trim(),on:true,inline:true}})}
function renderSide(){const v=$('#elView');if(!v)return;const el=ST.sel;if(!el){v.innerHTML='<div class="empty">Select a node</div>';return}
 if(EL.sub==='styles')renderStyles(v,el);else if(EL.sub==='computed')renderComputed(v,el);else if(EL.sub==='layout')renderLayout(v);else if(EL.sub==='listeners')renderListeners(v,el);else renderA11y(v,el)}
function renderStyles(v,el){const flt=(EL.filter||'').toLowerCase();
 v.innerHTML=`<div class="tb" data-hs="el-filter"><input class="inp" id="stFilter" placeholder="Filter" value="${esc(EL.filter||'')}" style="flex:1;min-width:60px"><button class="tbb" id="hovBtn" aria-pressed="${!!EL.hovOpen}" title="Toggle element state">:hov</button><button class="tbb" id="clsBtn" aria-pressed="${!!EL.clsOpen}" title="Element classes">.cls</button></div>
 ${EL.hovOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><div style="color:#9AA0A6;margin-bottom:4px">Force element state</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 8px">${[':active',':hover',':focus',':visited',':focus-within',':focus-visible',':target'].map(s=>`<label class="ck"><input type="checkbox" data-st="${s}" ${s===':hover'&&ST.forceHover.has(el)?'checked':''}>${s}</label>`).join('')}</div></div>`:''}
 ${EL.clsOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><input class="inp" id="addCls" placeholder="Add new class" style="width:100%"><div style="display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:5px">${[...el.classList].filter(c=>!c.startsWith('__')).concat(EL.offCls&&EL.offCls.el===el?EL.offCls.list:[]).map(c=>`<label class="ck"><input type="checkbox" data-cls="${esc(c)}" ${el.classList.contains(c)?'checked':''}>${esc(c)}</label>`).join('')}</div></div>`:''}
 <div class="styles" id="styles" data-hs="el-styles"></div>`;
 const box=$('#styles',v);const winners={};const blocks=[];
 const inl=inlineDecls(el);blocks.push({kind:'inline',decls:inl});
 matched(el).forEach(({r})=>blocks.push({kind:'rule',r,decls:r.d}));
 const ua=UA[el.tagName.toLowerCase()];if(ua)blocks.push({kind:'ua',sel:el.tagName.toLowerCase()==='a'?'a:-webkit-any-link':el.tagName.toLowerCase(),decls:ua.map(([p,v])=>({p,v,on:true}))});
 blocks.forEach(b=>b.decls.forEach(d=>{d._st=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')}));
 // inherited
 const inh=[];let a=el.parentNode;while(a&&a.nodeType===1&&a!==HTML){const ms=matched(a).map(({r})=>({r,decls:r.d.filter(d=>INH.test(d.p))})).filter(x=>x.decls.length);if(ms.length)inh.push({a,ms});a=a.parentNode}
 inh.forEach(g=>g.ms.forEach(m=>m.decls.forEach(d=>{m._st=m._st||{};m._st[d.p]=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')})));
 const declHTML=(d,ri,di,st)=>{if(flt&&!(d.p+':'+d.v).toLowerCase().includes(flt))return'';const col=/^(#|rgb|hsl)/i.test(d.v)||/^(color|background|background-color|border-color)$/.test(d.p)&&/#[0-9a-f]{3,8}|rgb/i.test(d.v);const cm=d.v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/);
  return `<div class="dcl ${st==='over'?'over':st==='off'?'off':''}">${ri!=null?`<input type="checkbox" ${d.on?'checked':''} data-r="${ri}" data-d="${di}" aria-label="Toggle ${esc(d.p)}">`:''}<span class="p">${esc(d.p)}</span>: <span class="v" ${ri!=null?`data-r="${ri}" data-d="${di}"`:''}>${cm&&ri!=null?`<i class="sw" style="background:${esc(cm[0])}" data-r="${ri}" data-d="${di}" title="Open color picker"></i>`:''}${esc(d.v)}</span>;</div>`};
 let out='';
 blocks.forEach(b=>{if(b.kind==='inline'){out+=`<div class="rule"><span>element.style</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}<div class="dcl" style="padding-left:20px"><span class="v" id="addInline" style="color:#6E7379;cursor:text">+ add declaration</span></div>}</div>`;return}
  if(b.kind==='ua'){out+=`<div class="rule"><span class="src ua">user agent stylesheet</span><span>${esc(b.sel)}</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}}</div>`;return}
  const r=b.r;out+=`<div class="rule">${r.media?`<div class="media">@media ${esc(r.media)}</div>`:''}<button class="src" data-line="${r.line}">app.css:${r.line}</button><span>${esc(r.sel)}</span> {${r.d.map((d,i)=>declHTML(d,r.id,i,d._st)).join('')}}</div>`});
 inh.forEach(g=>{out+=`<div class="inh">Inherited from <span style="color:var(--tag);font-family:var(--mono)">${esc(nodeLabel(g.a))}</span></div>`;g.ms.forEach(m=>{out+=`<div class="rule"><button class="src" data-line="${m.r.line}">app.css:${m.r.line}</button><span>${esc(m.r.sel)}</span> {${m.decls.map(d=>declHTML(d,m.r.id,m.r.d.indexOf(d),m._st[d.p])).join('')}}</div>`})});
 box.innerHTML=out;
 // box model at bottom (like the Computed tab preview)
 box.insertAdjacentHTML('beforeend',boxModelHTML(el));
 const fi=$('#stFilter',v);fi.oninput=()=>{EL.filter=fi.value;renderStyles(v,el);const f2=$('#stFilter',v);f2.focus();f2.setSelectionRange(f2.value.length,f2.value.length)};
 $('#hovBtn',v).onclick=()=>{EL.hovOpen=!EL.hovOpen;renderStyles(v,el)};$('#clsBtn',v).onclick=()=>{EL.clsOpen=!EL.clsOpen;renderStyles(v,el)};
 $$('[data-st]',v).forEach(c=>c.onchange=()=>{if(c.dataset.st===':hover')setForceHover(el,c.checked)});
 $$('[data-cls]',v).forEach(c=>c.onchange=()=>{const k=c.dataset.cls;if(!EL.offCls||EL.offCls.el!==el)EL.offCls={el,list:[]};if(c.checked){el.classList.add(k);EL.offCls.list=EL.offCls.list.filter(x=>x!==k)}else{el.classList.remove(k);EL.offCls.list.push(k)}});
 const ac=$('#addCls',v);if(ac)ac.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&ac.value.trim()){el.classList.add(...ac.value.trim().split(/\s+/));ac.value=''}};
 box.onchange=e=>{const c=e.target;if(c.dataset.r==null)return;const d=RULES[+c.dataset.r].d[+c.dataset.d];d.on=c.checked;logChange(RULES[+c.dataset.r],d,c.checked?'enabled':'disabled');applyCSS();renderStyles(v,el);track('toggle-decl')};
 box.onclick=e=>{const sw=e.target.closest('.sw');if(sw){pickColor(sw,el);return}const src=e.target.closest('.src[data-line]');if(src){SRC.open('app.css',+src.dataset.line);return}
  const vv=e.target.closest('.v[data-r]');if(vv){editDecl(vv,el);return}if(e.target.id==='addInline')addInline(e.target,el)}}
function logChange(r,d,what){ST.changes.push({sel:r.sel,p:d.p,from:d.orig,to:d.v,on:d.on,what,t:Date.now()});bus.emit('changes')}
function editDecl(span,el){const d=RULES[+span.dataset.r].d[+span.dataset.d];const r=RULES[+span.dataset.r];const old=d.v;span.innerHTML='';span.textContent=old;span.contentEditable='true';span.classList.add('edit');span.focus();document.getSelection().selectAllChildren(span);
 const apply=v=>{d.v=v;applyCSS()};let done=false;
 span.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();span.blur()}else if(e.key==='Escape'){span.textContent=old;apply(old);done=true;span.blur()}
  else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();const step=(e.shiftKey?10:e.altKey?0.1:1)*(e.key==='ArrowUp'?1:-1);const t=span.textContent.replace(/-?\d*\.?\d+/,m=>String(Math.round((parseFloat(m)+step)*10)/10));span.textContent=t;apply(t);document.getSelection().selectAllChildren(span);track('nudge-value')}};
 span.oninput=()=>apply(span.textContent);
 span.onblur=()=>{if(!done){d.v=span.textContent.trim()||old;applyCSS();if(d.v!==old){logChange(r,d,'edited');track('edit-value')}}renderStyles($('#elView'),el)}}
function addInline(span,el){const inp=h('<span class="edit" contenteditable="true" spellcheck="false"></span>');span.replaceWith(inp);inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();inp.blur()}if(e.key==='Escape'){inp.textContent='';inp.blur()}};
 inp.onblur=()=>{const t=inp.textContent.trim();if(t.includes(':')){const [p,...rest]=t.split(':');el.style.setProperty(p.trim(),rest.join(':').replace(/;$/,'').trim());track('edit-value');ST.changes.push({sel:'element.style',p:p.trim(),from:'',to:rest.join(':').trim(),what:'added',t:Date.now()});bus.emit('changes')}renderStyles($('#elView'),el)}}
function pickColor(sw,el){const d=RULES[+sw.dataset.r].d[+sw.dataset.d];const r=RULES[+sw.dataset.r];const cur=(d.v.match(/#[0-9a-fA-F]{6}\b/)||[])[0]||toHex(getComputedStyle(el).color)||'#000000';
 const inp=document.createElement('input');inp.type='color';inp.value=cur.length===7?cur:'#000000';inp.style.cssText='position:fixed;left:-100px;top:0;opacity:0';document.body.appendChild(inp);
 inp.oninput=()=>{d.v=d.v.replace(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/,inp.value.toUpperCase());if(!/#|rgb/.test(d.v))d.v=inp.value;applyCSS();sw.style.background=inp.value};
 inp.onchange=()=>{logChange(r,d,'color');track('color-pick');renderStyles($('#elView'),el);inp.remove()};inp.click();setTimeout(()=>{if(document.body.contains(inp)&&!inp.value)inp.remove()},60000)}
function boxModelHTML(el){const cs=getComputedStyle(el);const n=k=>{const v=parseFloat(cs[k])||0;return v?Math.round(v*100)/100:'–'};
 return `<div style="padding:4px 10px 14px"><div class="boxm" data-hs="el-box"><div><span class="lab">margin</span>${n('marginTop')}<div><span class="lab">border</span>${n('borderTopWidth')}<div><span class="lab">padding</span>${n('paddingTop')}<div class="row"><span>${n('paddingLeft')}</span><span class="cbox">${Math.round((el.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0))*100)/100} × ${Math.round((el.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0))*100)/100}</span><span>${n('paddingRight')}</span></div>${n('paddingBottom')}</div>${n('borderBottomWidth')}</div>${n('marginBottom')}</div></div></div>`}
const COMP=['display','position','box-sizing','width','height','margin','padding','border-radius','color','background-color','background-image','font-family','font-size','font-weight','line-height','letter-spacing','text-decoration','cursor','grid-template-columns','gap','align-items','justify-content','flex-direction','overflow','z-index','transform','box-shadow','transition','visibility','opacity'];
function renderComputed(v,el){const cs=getComputedStyle(el);const all=!!EL.compAll;const props=all?[...cs].sort():COMP;const f=(EL.cfilter||'').toLowerCase();
 v.innerHTML=boxModelHTML(el)+`<div class="tb"><input class="inp" id="cFilter" placeholder="Filter" value="${esc(EL.cfilter||'')}" style="flex:1"><label class="ck"><input type="checkbox" id="cAll" ${all?'checked':''}>Show all</label></div><div class="comp">${props.filter(p=>!f||p.includes(f)).map(p=>`<div><span class="p">${p}</span><span class="v">${/color/.test(p)?swatchTxt(cs.getPropertyValue(p)):esc(cs.getPropertyValue(p))}</span></div>`).join('')}</div>`;
 const fi=$('#cFilter',v);fi.oninput=()=>{EL.cfilter=fi.value;renderComputed(v,el);$('#cFilter',v).focus();$('#cFilter',v).setSelectionRange(99,99)};$('#cAll',v).onchange=e=>{EL.compAll=e.target.checked;renderComputed(v,el)}}
function renderLayout(v){const grids=PAGE.qa('*').filter(n=>/grid/.test(getComputedStyle(n).display));const flexes=PAGE.qa('*').filter(n=>/flex/.test(getComputedStyle(n).display));
 const row=n=>`<label class="ck" style="display:flex;padding:3px 0;font:400 12.5px var(--mono)"><input type="checkbox" data-g="${PAGE.qa('*').indexOf(n)}" ${EL.grids.has(n)?'checked':''}><span style="color:var(--tag)">${esc(nodeLabel(n))}</span></label>`;
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px var(--body)"><div style="font-weight:600;margin-bottom:6px">Grid</div><div style="color:#9AA0A6;margin-bottom:6px">Overlay display settings: line numbers · track sizes</div>${grids.map(row).join('')||'<div class="muted">No grid layouts</div>'}
 <div style="font-weight:600;margin:14px 0 6px">Flexbox</div>${flexes.map(row).join('')}</div>`;$$('[data-g]',v).forEach(c=>c.onchange=()=>toggleGrid(PAGE.qa('*')[+c.dataset.g]))}
function renderListeners(v,el){let x=el;const rows=[];while(x&&x!==HTML){LISTENERS.filter(l=>l.el===x&&!l.removed).forEach(l=>rows.push(l));x=x.parentNode}
 const types=[...new Set(rows.map(r=>r.type))];v.innerHTML=`<div class="tb"><button class="tbb" id="lRefresh">${IC.reload}</button><label class="ck"><input type="checkbox" checked disabled>Ancestors</label><span style="color:#9AA0A6">Framework listeners</span></div>`+
  (types.length?types.map(t=>`<div style="padding:4px 10px;font:600 12.5px var(--mono);background:#232428;border-bottom:1px solid #2E3035">▾ ${t}</div>`+rows.filter(r=>r.type===t).map(r=>`<div style="display:flex;gap:10px;padding:3px 10px 3px 26px;font:400 12px var(--mono);border-bottom:1px solid #2A2B2F"><span style="color:var(--tag)">${esc(nodeLabel(r.el))}</span><span style="margin-left:auto;color:#9AA0A6;text-decoration:underline;cursor:pointer" data-src="${r.src}">${r.src}</span><button class="pill" data-rm="${LISTENERS.indexOf(r)}">Remove</button></div>`).join('')).join(''):'<div class="empty">No event listeners on this node or its ancestors.<br>Select a button in the page.</div>');
 $$('[data-rm]',v).forEach(b=>b.onclick=()=>{LISTENERS[+b.dataset.rm].removed=true;toast('Listener removed — clicking it now does nothing');renderListeners(v,el);track('remove-listener')});$$('[data-src]',v).forEach(s=>s.onclick=()=>{const [f,l]=s.dataset.src.split(':');SRC.open(f,+l)})}
function renderA11y(v,el){const chain=[];let x=el;while(x&&x!==HTML){chain.unshift(x);x=x.parentNode}const ct=contrastOf(el);
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px/22px var(--body)"><div style="font-weight:600;margin-bottom:4px">Accessibility tree</div><div style="font-family:var(--mono);font-size:12px">RootWebArea "Driftwood — Specialty Coffee"${chain.filter(c=>roleOf(c)!=='generic'||c===el).map((c,i)=>`<div style="padding-left:${(i+1)*12}px;${c===el?'background:var(--dsel)':''}">${roleOf(c)} ${accName(c)?`"${esc(accName(c).slice(0,40))}"`:''}</div>`).join('')}</div>
 <div style="font-weight:600;margin:12px 0 4px">Computed properties</div><div class="kv" style="padding:0"><div><b>Name</b><span>${esc(accName(el)||'""')}</span></div><div><b>Role</b><span>${roleOf(el)}</span></div><div><b>Focusable</b><span>${el.tabIndex>=0}</span></div>${ct?`<div><b>Contrast ratio</b><span class="${ct>=4.5?'g':'o'}">${ct.toFixed(2)} ${ct>=4.5?'✓ AA':'✗ fails AA 4.5'}</span></div>`:''}</div></div>`}
```

### 9/16 · `F12-Field-Guide-source/site/src/network.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/network.js", "lines": 67, "final_newline": true, "sha256": "b007ddf0da6fde3f0104083b1424bce78b436e5032cc47bd47d9227f4989cfc4", "original_sha256": "b007ddf0da6fde3f0104083b1424bce78b436e5032cc47bd47d9227f4989cfc4"} -->
```js
/* ================= Network ================= */
const NW={type:'All',filter:'',invert:false,sel:null,tab:'headers',rec:true,raf:0,shiftRow:null};
const NCHIPS=['All','Fetch/XHR','Doc','CSS','JS','Font','Img','Media','Manifest','WS','Wasm','Other'];
function buildNetwork(p){p.innerHTML=`<div class="tb" data-hs="net-tb"><button class="tbb rec" id="nRec" aria-pressed="true" title="Stop recording network log">${IC.rec}</button><button class="tbb" id="nClear" title="Clear network log">${IC.clear}</button><span class="sep"></span>
 <label class="ck" data-hs="net-preserve"><input type="checkbox" id="nPreserve">Preserve log</label><label class="ck"><input type="checkbox" id="nCache" checked>Disable cache</label>
 <select class="inp" id="nThrottle" data-hs="net-throttle" title="Throttling">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><span class="sep"></span>
 <button class="tbb" id="nHar" title="Export HAR (copies JSON)">${IC.dl}</button><button class="tbb" id="nReload" title="Reload page and record">${IC.reload} Reload</button></div>
 <div class="tb" data-hs="net-filter"><input class="inp" id="nFilter" placeholder="Filter (try: -analytics, status-code:500, method:POST)" style="width:260px"><label class="ck"><input type="checkbox" id="nInvert">Invert</label><span class="sep"></span><div class="chipset" id="nChips">${NCHIPS.map(c=>`<button aria-pressed="${c==='All'}" data-c="${c}">${c}</button>`).join('')}</div></div>
 <div class="nov" id="nOv" data-hs="net-overview"></div>
 <div class="nwrap"><div class="ntable"><div class="scroll" id="nScroll" style="flex:1" data-hs="net-table"><div class="nr h"><span>Name</span><span>Status</span><span>Type</span><span>Initiator</span><span>Size</span><span>Time</span><span data-hs="net-waterfall">Waterfall</span></div><div id="nRows"></div></div></div><div class="ndet" id="nDet" hidden data-hs="net-details"></div></div>
 <div class="nstatus" id="nStat" data-hs="net-status"></div>`;
 $('#nRec').onclick=e=>{NW.rec=!NW.rec;ST.recordingNet=NW.rec;e.currentTarget.setAttribute('aria-pressed',NW.rec);toast(NW.rec?'Recording network activity':'Recording stopped — new requests are not logged')};
 $('#nClear').onclick=()=>{NET.entries=[];NW.sel=null;$('#nDet').hidden=true;renderNet()};
 $('#nPreserve').onchange=e=>{ST.preserve=e.target.checked;track('preserve-log')};$('#nCache').onchange=e=>{ST.disableCache=e.target.checked;toast(ST.disableCache?'Cache disabled while DevTools is open':'Cache enabled — reload twice to see (memory cache)');track('cache')};
 $('#nThrottle').onchange=e=>{ST.throttle=e.target.value;toast(`${THROTTLE[ST.throttle].label} — reload to feel it`);track('throttle');syncThrottle()};
 $('#nReload').onclick=reloadPage;$('#nHar').onclick=()=>{copyText(JSON.stringify({log:{version:'1.2',creator:{name:'WebInspector',version:'537.36'},entries:NET.entries.map(e=>({startedDateTime:new Date().toISOString(),time:e.dur,request:{method:e.method,url:e.url},response:{status:e.status,statusText:e.statusText,content:{size:e.size,mimeType:e.mime}},timings:e.phases}))}},null,2));track('har')};
 $('#nFilter').oninput=e=>{NW.filter=e.target.value;renderNet();track('net-filter')};$('#nInvert').onchange=e=>{NW.invert=e.target.checked;renderNet()};
 $('#nChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;NW.type=b.dataset.c;$$('#nChips button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderNet();track('net-type')};
 const rows=$('#nRows');
 rows.onclick=e=>{const r=e.target.closest('.nr');if(!r)return;if(e.target.classList.contains('init')){const [f,l]=e.target.textContent.split(':');if(SRC.files[f])SRC.open(f,+l||1);return}NW.sel=+r.dataset.id;NW.tab=NW.tab||'headers';renderNet();renderDet();track('net-detail')};
 rows.oncontextmenu=e=>{const r=e.target.closest('.nr');if(!r)return;e.preventDefault();const en=NET.entries.find(x=>x.id===+r.dataset.id);if(!en)return;const bl=ST.blocked.has(en.name);
  openMenu(e.clientX,e.clientY,[{label:'Open in new tab'},{label:'Open in Sources panel',act:()=>{const f=en.name==='shop'?'(index)':en.name;if(SRC.files[f])SRC.open(f,1);else toast('Not a source file')}},'-',{label:'Clear browser cache',act:()=>toast('Browser cache cleared')},'-',
   {label:'Copy URL',act:()=>copyText(en.url)},{label:'Copy as cURL (bash)',act:()=>{copyText(curlOf(en));track('copy-curl')}},{label:'Copy as fetch',act:()=>{copyText(`fetch("${en.url}", {\n  "headers": { "accept": "*/*" },\n  "method": "${en.method}"${en.reqBody?`,\n  "body": ${JSON.stringify(en.reqBody)}`:''}\n});`);track('copy-curl')}},{label:'Copy response',act:()=>copyText(en.resBody||'')},'-',
   {label:bl?`Unblock ${en.name}`:'Block request URL',act:()=>{if(bl)ST.blocked.delete(en.name);else ST.blocked.add(en.name);toast(bl?'Unblocked':`Blocked ${en.name} — reload to see the page without it`);track('block');renderNet()}},...(en.type==='fetch'?[{label:'Replay XHR',act:()=>{simFetch(en.path,{method:en.method,body:en.reqBody,initiator:en.initiator});track('replay')}}]:[]),{label:'Override content',act:()=>toast('Pick an overrides folder first (Sources ▸ Overrides)')},'-',{label:'Save all as HAR with content',act:()=>$('#nHar').click()}])};
 rows.addEventListener('mousemove',e=>{const r=e.target.closest('.nr');const id=e.shiftKey&&r?+r.dataset.id:null;if(id!==NW.shiftRow){NW.shiftRow=id;renderNet()}});rows.addEventListener('mouseleave',()=>{if(NW.shiftRow){NW.shiftRow=null;renderNet()}});
 NET.listeners.push(()=>loopNet());renderNet()}
function syncThrottle(){$$('#nThrottle,#devThrottle').forEach(s=>s.value=ST.throttle)}
function curlOf(e){return `curl '${e.url}' \\\n  -H 'accept: */*' \\\n  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0' ${e.method!=='GET'?`\\\n  -X ${e.method} `:''}${e.reqBody?`\\\n  --data-raw '${e.reqBody}' `:''}`}
function loopNet(){cancelAnimationFrame(NW.raf);const step=()=>{renderNet();const busy=NET.entries.some(e=>now()<e.t0+e.dur+30);if(busy)NW.raf=requestAnimationFrame(step)};step()}
function netVisible(e){if(now()<e.t0)return false;let ok=NW.type==='All'||(TYPEGROUP[e.type]||'Other')===NW.type;const f=NW.filter.trim();if(f){ok=ok&&f.split(/\s+/).every(t=>{let neg=false;if(t.startsWith('-')){neg=true;t=t.slice(1)}let m;
  if((m=t.match(/^status-code:(\d+)/)))return (String(e.status)===m[1])!==neg;if((m=t.match(/^method:(\w+)/i)))return (e.method===m[1].toUpperCase())!==neg;if((m=t.match(/^larger-than:(\d+)(k?)/i)))return (e.size>(+m[1]*(m[2]?1000:1)))!==neg;if((m=t.match(/^domain:(.+)/)))return e.url.includes(m[1])!==neg;
  return e.url.toLowerCase().includes(t.toLowerCase())!==neg});if(NW.invert)ok=!ok}return ok}
function renderNet(){if(!P.network.built)return;const rows=$('#nRows');const list=NET.entries.filter(netVisible);const tnow=now();
 const endOf=e=>e.start+Math.min(e.dur,Math.max(0,tnow-e.t0));const span=Math.max(2000*(THROTTLE[ST.throttle].k>2?2:1),...NET.entries.map(e=>e.start+e.dur))*1.06;
 const wfW=Math.max(120,(rows.querySelector('.wf')||{clientWidth:0}).clientWidth||$('#nScroll').clientWidth*0.3);
 const sh=NW.shiftRow?NET.entries.find(x=>x.id===NW.shiftRow):null;
 rows.innerHTML=list.map(e=>{const el=Math.max(0,tnow-e.t0);const done=el>=e.dur;const dur=Math.min(el,e.dur);
  const px=v=>v/span*wfW;let x=px(e.start);let segs='';const ph=e.phases;const col={queue:'#9AA0A6',dns:'#26A69A',connect:'#F6B26B',ssl:'#B388FF',ttfb:'#81C995',download:'#4FA3F7'};let acc=0;
  if(!e.failed)for(const [k,v] of Object.entries(ph)){const vis=Math.max(0,Math.min(v,dur-acc));if(vis<=0)break;const w=Math.max(1,px(vis));segs+=`<i style="left:${x}px;width:${w}px;background:${col[k]}"></i>`;x+=w;acc+=v}else segs=`<i style="left:${x}px;width:2px;background:#F28B82"></i>`;
  let shade='';if(sh&&sh!==e){const base=(e.initiator||'').split(':')[0];if(sh.initiator&&sh.initiator.split(':')[0]===e.name)shade='background:rgba(129,201,149,.25)';else if(base===sh.name)shade='background:rgba(242,139,130,.22)'}
  const status=!done?'(pending)':e.blocked?'(blocked:devtools)':e.failed?'(failed)':e.status;const size=!done?'':e.failed?'0 B':e.fromCache?'(memory cache)':fmtBytes(e.transferred);
  return `<div class="nr${e.status>=400||e.failed?' bad':''}${NW.sel===e.id?' sel':''}" data-id="${e.id}" style="${shade}"><span title="${esc(e.url)}">${esc(e.name)}</span><span>${status}</span><span>${e.type}</span><span><span class="init">${esc(e.initiator)}</span></span><span>${size}</span><span>${done?fmtMs(e.dur):fmtMs(dur)}</span><span class="wf">${segs}</span></div>`}).join('');
 const ov=$('#nOv');const OW=ov.clientWidth||600;let o='';const vis=NET.entries.filter(e=>tnow>=e.t0);
 [0,1,2,3,4,5,6,7,8].forEach(i=>{const t=i*span/8;o+=`<span style="position:absolute;left:${t/span*OW+3}px;top:2px;font:400 10px var(--body);color:#6E7379">${fmtMs(t)}</span><i style="position:absolute;left:${t/span*OW}px;top:0;bottom:0;border-left:1px solid #2C2E33"></i>`});
 vis.forEach((e,i)=>{o+=`<i style="position:absolute;top:${16+(i%9)*3}px;height:2px;left:${e.start/span*OW}px;width:${Math.max(2,Math.min(e.dur,tnow-e.t0)/span*OW)}px;background:${e.failed||e.status>=400?'#F28B82':'#4FA3F7'}"></i>`});
 if(NET.navStart&&vis.length){o+=`<i style="position:absolute;left:${NET.dcl/span*OW}px;top:0;bottom:0;border-left:2px solid #8AB4F8"></i><i style="position:absolute;left:${NET.load/span*OW}px;top:0;bottom:0;border-left:2px solid #F28B82"></i>`}ov.innerHTML=o;
 const all=NET.entries.filter(e=>tnow>=e.t0);const fin=Math.max(0,...all.map(e=>e.start+Math.min(e.dur,tnow-e.t0)));
 $('#nStat').innerHTML=`${list.length} / ${all.length} requests │ ${fmtBytes(all.reduce((a,e)=>a+(e.failed?0:e.transferred),0))} transferred │ ${fmtBytes(all.reduce((a,e)=>a+(e.failed?0:e.size),0))} resources │ Finish: ${fmtMs(fin)} │ <span class="dcl">DOMContentLoaded: ${fmtMs(NET.dcl)}</span> │ <span class="ld">Load: ${fmtMs(NET.load)}</span>`;
 if(NW.sel&&!$('#nDet').hidden&&NW._detFor!==NW.sel)renderDet()}
function renderDet(){const d=$('#nDet');const e=NET.entries.find(x=>x.id===NW.sel);if(!e){d.hidden=true;return}d.hidden=false;NW._detFor=e.id;
 const tabs=[['headers','Headers'],...(e.reqBody?[['payload','Payload']]:[]),['preview','Preview'],['response','Response'],['initiator','Initiator'],['timing','Timing'],...(e.type==='document'?[['cookies','Cookies']]:[])];if(!tabs.find(t=>t[0]===NW.tab))NW.tab='headers';
 let body='';const H=(k,v)=>`<div><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`;
 if(NW.tab==='headers')body=`<div class="hdr"><h5>General</h5>${H('Request URL',e.url)}${H('Request Method',e.method)}<div><span class="k">Status Code</span><span class="v"><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${e.status>=400||e.failed?'#F28B82':'#81C995'};margin-right:6px"></i>${e.failed?e.statusText:e.status+' '+e.statusText}</span></div>${H('Remote Address','104.18.22.7:443')}${H('Referrer Policy','strict-origin-when-cross-origin')}
  <h5>Response Headers</h5>${H('content-type',e.mime)}${H('cache-control',e.type==='fetch'?'no-store':'public, max-age=31536000, immutable')}${H('content-length',String(e.size))}${H('server','cloudflare')}${e.type==='fetch'?H('x-request-id','7f3a9c2e-51b0'):''}${e.fromCache?H('(from memory cache)','served without a network round-trip'):''}
  <h5>Request Headers</h5>${H(':authority','driftwood.coffee')}${H(':method',e.method)}${H(':path',e.path)}${H('accept',e.type==='document'?'text/html,application/xhtml+xml':'*/*')}${H('cookie','session=8f2c1d…; cart_id=c_20931; _ga=GA1.1…')}${H('user-agent','Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0 Safari/537.36')}</div>`;
 else if(NW.tab==='payload')body=`<div class="hdr"><h5>Request Payload</h5></div><div class="pre">${esc(e.reqBody)}</div>`;
 else if(NW.tab==='preview'){if(/image/.test(e.mime))body=`<div style="padding:20px;display:flex;flex-direction:column;align-items:center;gap:10px;font:400 12px var(--body);color:#9AA0A6"><div style="width:220px;height:150px;border-radius:6px;background:${e.name.startsWith('guji')?PRODUCTS[0].art:e.name.startsWith('huila')?PRODUCTS[1].art:e.name.startsWith('nyeri')?PRODUCTS[2].art:'linear-gradient(135deg,#C8553D,#F28F3B 55%,#FFD6A5)'}"></div>${e.name} · 1200 × 900 · ${fmtBytes(e.size)} · ${e.mime}</div>`;
  else if(e.resBody){body='<div class="pre" id="prevTree"></div>'}else body=`<div class="pre" style="color:#9AA0A6">${e.type==='document'?'Rendered HTML preview':'No preview available for this resource type'}</div>`}
 else if(NW.tab==='response')body=`<div class="pre">${esc(e.resBody||(e.name==='shop'?INDEX_HTML:e.name==='app.css'?cssText():e.name==='app.js'?APP_JS:e.name==='cart.js'?CART_JS:e.name==='vendor.min.js'?VENDOR_MIN:'(binary data)'))}</div>`;
 else if(NW.tab==='initiator')body=`<div class="hdr"><h5>Request call stack</h5>${e.type==='fetch'?`<div class="v">checkout @ <a href="#" data-src="cart.js:36">cart.js:36</a></div><div class="v">(anonymous) @ cart.js:44</div>`:`<div class="v">${esc(e.initiator)}</div>`}<h5>Request initiator chain</h5><div class="v">https://driftwood.coffee/shop</div>${e.initiator!=='Other'&&e.initiator!=='shop'?`<div class="v" style="padding-left:14px">↳ ${esc(e.initiator.split(':')[0])}</div>`:''}<div class="v" style="padding-left:${e.initiator!=='Other'&&e.initiator!=='shop'?28:14}px">↳ ${esc(e.name)}</div></div>`;
 else if(NW.tab==='timing'){const ph=e.phases;const tot=e.dur;const lab={queue:'Queueing',dns:'DNS Lookup',connect:'Initial connection',ssl:'SSL',ttfb:'Waiting for server response',download:'Content Download'};const col={queue:'#9AA0A6',dns:'#26A69A',connect:'#F6B26B',ssl:'#B388FF',ttfb:'#81C995',download:'#4FA3F7'};let acc=0;
  body=`<div class="timing"><div style="color:#9AA0A6;grid-template-columns:1fr">Queued at ${fmtMs(e.start)} · Started at ${fmtMs(e.start+ph.queue)}</div>${Object.entries(ph).map(([k,v])=>{const l=acc/tot*100;acc+=v;return `<div><span>${lab[k]}</span><span style="position:relative;height:9px"><i style="position:absolute;left:${l}%;width:${Math.max(.8,v/tot*100)}%;background:${col[k]}"></i></span><span class="mono" style="text-align:right">${v.toFixed(2)} ms</span></div>`}).join('')}<div style="border-top:1px solid var(--dtl);margin-top:6px;padding-top:4px"><b>Total</b><span></span><b class="mono" style="text-align:right">${tot.toFixed(2)} ms</b></div><p style="color:#9AA0A6;margin:10px 0 0;line-height:1.5">Waiting for server response is Time To First Byte (TTFB). A long bar here means the server, not the network, is slow.</p></div>`}
 else if(NW.tab==='cookies')body=`<table class="tbl"><thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th></tr></thead><tbody>${COOKIES.map(c=>`<tr><td>${esc(c.name)}</td><td class="m">${esc(c.value)}</td><td>${c.domain}</td><td>${c.httpOnly?'✓':''}</td><td>${c.secure?'✓':''}</td><td>${c.sameSite}</td></tr>`).join('')}</tbody></table>`;
 d.innerHTML=`<div class="subt"><button id="nDetX" title="Close">✕</button>${tabs.map(([k,l])=>`<button data-t="${k}" aria-selected="${k===NW.tab}">${l}</button>`).join('')}</div><div class="scroll" style="flex:1">${body}</div>`;
 $('#nDetX').onclick=()=>{d.hidden=true;NW.sel=null;renderNet()};$$('[data-t]',d).forEach(b=>b.onclick=()=>{NW.tab=b.dataset.t;renderDet();if(NW.tab==='timing')track('net-timing')});
 const pv=$('#prevTree',d);if(pv){try{pv.appendChild(renderVal(JSON.parse(e.resBody),false,true));const hd=$('.hd',pv);if(hd)hd.click()}catch{pv.textContent=e.resBody}}
 $$('[data-src]',d).forEach(a=>a.onclick=ev=>{ev.preventDefault();const [f,l]=a.dataset.src.split(':');SRC.open(f,+l)})}
```

### 10/16 · `F12-Field-Guide-source/site/src/page.html`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/page.html", "lines": 524, "final_newline": true, "sha256": "5eaeeb51d1afef2bee536cfc504185c8a05b2d8d436b88193389733b65e6eb57", "original_sha256": "5eaeeb51d1afef2bee536cfc504185c8a05b2d8d436b88193389733b65e6eb57"} -->
```html
<title>F12 Field Guide</title>
<meta name="description" content="A working browser with DevTools docked: every core F12 panel, live and explained.">
<style>
@font-face{font-family:"Bricolage Grotesque";src:url(fonts/bricolage-grotesque-latin-800-normal.woff2) format("woff2");font-weight:800;font-display:swap}
@font-face{font-family:"Bricolage Grotesque";src:url(fonts/bricolage-grotesque-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(fonts/jetbrains-mono-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(fonts/jetbrains-mono-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
:root{
 color-scheme:dark;
 --ground:#0A0E18;--ground2:#0E1422;--surface:#131A2B;--surface2:#182036;--rule:#232C44;--rule2:#2E3A58;
 --ink:#E9EEF7;--ink2:#C3CCDD;--mut:#8C97AF;--faint:#5D6883;
 --content:#6FA8DC;--padding:#93C47D;--border:#FFE599;--margin:#F6B26B;--act:#8AB4F8;--hot:#FF5C8A;
 --display:"Bricolage Grotesque","IBM Plex Sans",system-ui,sans-serif;
 --body:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
 --mono:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;
 /* devtools skin */
 --dt:#1F1F22;--dt2:#28292D;--dt3:#303136;--dtl:#3B3D43;--dtx:#E3E3E3;--dtm:#9AA0A6;--dsel:#0B4A78;--dhov:#2A3B52;
 --tag:#5DB0D7;--an:#9BBBDC;--av:#F29766;--pn:#35D4C7;--num:#9980FF;--kw:#C792EA;--fn:#82AAFF;--str:#F29766;--com:#7F8C8D;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
section[id],main{scroll-margin-top:70px}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ground);color:var(--ink);font:400 16px/1.55 var(--body);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:var(--act)}
:focus-visible{outline:2px solid var(--act);outline-offset:2px}
button{font:inherit;color:inherit}
code,kbd,.mono{font-family:var(--mono)}
.wrap{max-width:1560px;margin:0 auto;padding-inline:clamp(16px,3vw,40px)}
.kbd{display:inline-flex;align-items:center;justify-content:center;min-width:1.9em;height:1.9em;padding:0 .45em;border-radius:6px;background:linear-gradient(#27304A,#1A2135);border:1px solid #3A4666;box-shadow:0 2px 0 #0B0F1B,inset 0 1px 0 rgba(255,255,255,.1);font:600 .78em/1 var(--mono);color:#fff;white-space:nowrap}
/* top bar */
.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;background:rgba(10,14,24,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.top .wrap{display:flex;align-items:center;gap:22px;height:58px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font:800 20px/1 var(--display);letter-spacing:-.01em;white-space:nowrap}
.brand .kbd{font-size:13px;height:28px;min-width:44px}
.top nav{display:flex;gap:4px;margin-left:auto;overflow-x:auto;scrollbar-width:none}
.top nav a{color:var(--ink2);text-decoration:none;font:500 14px/1 var(--body);padding:9px 12px;border-radius:8px;white-space:nowrap}
.top nav a:hover{background:var(--surface);color:#fff}
/* intro */
.intro{padding-block:48px 26px;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:40px;align-items:end}
.eyebrow{font:600 12.5px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--content);display:flex;align-items:center;gap:10px;margin:0 0 18px}
.eyebrow::before{content:"";width:26px;height:2px;background:currentColor}
h1{margin:0;font:800 clamp(40px,6.2vw,92px)/.93 var(--display);letter-spacing:-.035em;text-wrap:balance}
h1 .k{display:inline-flex;vertical-align:.08em;font:800 .62em/1 var(--display);padding:.12em .3em .16em;border-radius:.2em;background:linear-gradient(#2D3857,#1A2238);border:2px solid #45547D;box-shadow:0 .09em 0 #0B0F1B;letter-spacing:-.03em}
.lede{font-size:18px;line-height:1.6;color:var(--ink2);max-width:62ch;margin:0}
.boxkey{margin-top:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;font:500 13px var(--body);color:var(--mut)}
.boxkey .bm{position:relative;width:118px;height:62px;flex:none}
.boxkey .bm div{position:absolute;inset:0}
.boxkey .bm .m{background:rgba(246,178,107,.55)}.boxkey .bm .b{inset:8px;background:rgba(255,229,153,.7)}.boxkey .bm .p{inset:12px;background:rgba(147,196,125,.75)}.boxkey .bm .c{inset:22px 30px;background:rgba(111,168,220,.9)}
.boxkey ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,auto);gap:4px 18px}
.boxkey li{display:flex;align-items:center;gap:8px;white-space:nowrap}.boxkey li i{width:11px;height:11px;border-radius:2px;background:var(--c)}
/* controls strip */
.keys{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;margin:0 0 12px;font:500 13px var(--body);color:var(--mut)}
.keybtn{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--rule2);border-radius:10px;padding:6px 10px 6px 8px;cursor:pointer;color:var(--ink2);font:500 13px var(--body)}
.keybtn:hover{border-color:var(--act);color:#fff}
.keybtn[aria-pressed="true"]{border-color:var(--act);background:#15223D;color:#fff}
.keybtn .kbd{font-size:11px}
/* sim layout */
.simgrid{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:22px;align-items:start}
.simscroll{overflow-x:auto;border-radius:14px}
.browser{min-width:880px;height:820px;border-radius:14px;overflow:hidden;background:#1B1C1F;border:1px solid #33384A;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.4);display:flex;flex-direction:column;position:relative;font:400 13px/1.35 var(--body);color:var(--dtx)}
.browser:focus{outline:none}
.bch{flex:none;background:#2B2C30}
.btabs{height:38px;display:flex;align-items:flex-end;gap:2px;padding:0 10px;background:#1E1F22}
.lights{display:flex;gap:7px;margin:0 12px 12px 4px}.lights i{width:12px;height:12px;border-radius:50%;background:#FF5F57}.lights i:nth-child(2){background:#FEBC2E}.lights i:nth-child(3){background:#28C840}
.btab{height:30px;padding:0 12px;display:flex;align-items:center;gap:8px;font:500 13px var(--body);color:#9AA0A6;border-radius:8px 8px 0 0;min-width:0;width:210px;white-space:nowrap;overflow:hidden}
.btab.on{background:#2B2C30;color:#E8EAED}
.btab .fav{width:14px;height:14px;border-radius:3px;background:linear-gradient(135deg,#E4572E,#7A2E1A);flex:none}
.btab span{overflow:hidden;text-overflow:ellipsis}
.omni{height:42px;display:flex;align-items:center;gap:6px;padding:0 10px;color:#9AA0A6}
.omni button{width:30px;height:30px;border-radius:50%;border:0;background:none;display:grid;place-items:center;cursor:pointer;color:#C4C7CC}
.omni button:hover{background:#3A3B3F}
.url{flex:1;height:30px;border-radius:15px;background:#1E1F22;display:flex;align-items:center;gap:8px;padding:0 14px;font:400 14px var(--body);color:#E8EAED;min-width:0;white-space:nowrap;overflow:hidden}
.url .dim{color:#9AA0A6}
.bbody{flex:1;display:flex;min-height:0;position:relative}
.bbody.bottom{flex-direction:column}
.pagearea{position:relative;background:#F4EFE8;overflow:hidden;flex:1 1 auto;min-width:0;min-height:0}
.bbody.bottom .pagearea{flex:0 0 var(--ph,270px)}
.bbody.bottom.dev .pagearea{flex-basis:max(var(--ph,270px),58%)}
.bbody.right .pagearea{flex:0 0 var(--pw,44%)}
.bbody.closed .pagearea{flex:1 1 auto}
.viewport{position:absolute;inset:0;overflow:hidden}
#pageHost{position:absolute;inset:0}
.dt{flex:1;min-width:0;min-height:0;background:var(--dt);display:flex;flex-direction:column;position:relative;container-type:inline-size;container-name:dt}
.bbody.bottom .dt{border-top:1px solid var(--dtl)}
.bbody.right .dt{border-left:1px solid var(--dtl)}
.bbody.closed .dt,.bbody.closed .splitter{display:none}
.splitter{flex:none;background:var(--dtl);position:relative;z-index:3}
.bbody.bottom .splitter{height:4px;cursor:ns-resize;margin:-2px 0}
.bbody.right .splitter{width:4px;cursor:ew-resize;margin:0 -2px}
.splitter:hover{background:var(--act)}
/* devtools chrome */
.dtt{height:34px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-bottom:1px solid var(--dtl);font:500 13px var(--body);color:#BDC1C6;min-width:0}
.dtt .icb{width:34px;flex:none;display:grid;place-items:center;border:0;border-right:1px solid var(--dtl);background:none;cursor:pointer;color:#9AA0A6;padding:0}
.dtt .icb:hover{background:var(--dt3)}
.dtt .icb[aria-pressed="true"] svg{stroke:#8AB4F8}
.ptabs{display:flex;min-width:0;overflow:hidden;flex:1}
.ptab{padding:0 11px;display:flex;align-items:center;border:0;background:none;border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer;color:#BDC1C6;font:500 13px var(--body)}
.ptab:hover{background:var(--dt3);color:#fff}
.ptab[aria-selected="true"]{color:#fff;border-bottom-color:#8AB4F8;background:#303134}
.dtr{display:flex;align-items:center;gap:6px;padding:0 6px;flex:none}
.dtr .icb{border:0;width:28px;height:28px;border-radius:4px}
.bdg{font:600 11px var(--mono);padding:2px 6px;border-radius:9px;display:inline-flex;gap:4px;align-items:center;border:0;cursor:pointer}
.bdg.e{background:#4E1D1D;color:#F28B82}.bdg.w{background:#4A3C12;color:#FDD663}
.bdg[hidden]{display:none}
svg.i{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.panels{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}
.panel{flex:1;min-height:0;display:none;flex-direction:column}
.panel.on{display:flex}
.tb{min-height:30px;flex:none;display:flex;align-items:center;gap:8px;padding:0 8px;background:var(--dt2);border-bottom:1px solid var(--dtl);font:400 12.5px var(--body);color:#BDC1C6;white-space:nowrap;overflow-x:auto;scrollbar-width:none}
.tb .sep{width:1px;height:16px;background:var(--dtl);flex:none}
.tbb{border:0;background:none;color:#BDC1C6;height:24px;min-width:24px;padding:0 6px;border-radius:4px;display:inline-flex;align-items:center;gap:5px;cursor:pointer;font:400 12.5px var(--body)}
.tbb:hover{background:var(--dt3);color:#fff}
.tbb[aria-pressed="true"]{color:#8AB4F8}
.tbb.rec[aria-pressed="true"] svg{stroke:#F28B82;fill:#F28B82}
.inp{height:22px;border-radius:4px;background:#17181A;border:1px solid #45474C;padding:0 7px;color:var(--dtx);font:400 12.5px var(--body);min-width:120px;outline:none}
.inp:focus{border-color:#8AB4F8}
select.inp{padding:0 4px;min-width:0}
.ck{display:inline-flex;align-items:center;gap:5px;cursor:pointer;user-select:none}
.ck input{accent-color:#8AB4F8;margin:0;width:13px;height:13px}
.subt{height:28px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-bottom:1px solid var(--dtl);font:500 12.5px var(--body);overflow-x:auto;scrollbar-width:none}
.subt button{padding:0 10px;border:0;background:none;color:#BDC1C6;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;font:500 12.5px var(--body)}
.subt button:hover{color:#fff;background:var(--dt3)}
.subt button[aria-selected="true"]{color:#fff;border-bottom-color:#8AB4F8}
.scroll{overflow:auto;min-height:0;scrollbar-color:#4A4C52 transparent;scrollbar-width:thin}
.split{flex:1;display:flex;min-height:0}
.split>.a{flex:1 1 55%;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--dtl)}
.split>.b{flex:1 1 45%;min-width:0;display:flex;flex-direction:column}
@container dt (max-width:700px){.split.adapt{flex-direction:column}.split.adapt>.a{border-right:0;border-bottom:1px solid var(--dtl);flex:1 1 50%}.split.adapt>.b{flex:1 1 50%}}
.empty{padding:28px;color:var(--dtm);text-align:center;font:400 13px var(--body)}
.pill{border:1px solid #45474C;border-radius:4px;padding:0 7px;height:22px;display:inline-flex;align-items:center;cursor:pointer;background:none;color:#BDC1C6;font:400 12.5px var(--body)}
.btnp{background:#8AB4F8;color:#202124;border:0;border-radius:14px;padding:6px 14px;font:600 12.5px var(--body);cursor:pointer}
.btnp:hover{background:#AECBFA}
.btns{background:none;color:#8AB4F8;border:1px solid #5F6368;border-radius:14px;padding:5px 13px;font:600 12.5px var(--body);cursor:pointer}
.btns:hover{background:rgba(138,180,248,.08)}
/* elements */
.tree{font:400 12.5px/20px var(--mono);padding:4px 0 30px;white-space:nowrap;user-select:none;flex:1}
.tr{position:relative;padding-right:10px;cursor:default}
.tr .tg{color:var(--tag)}.tr .an{color:var(--an)}.tr .av{color:var(--av)}.tr .tx{color:var(--dtx)}.tr .cm{color:#8C9296}
.tr:hover{background:var(--dhov)}
.tr.sel{background:var(--dsel)}
.tr.flash{animation:fl 1.2s ease-out}
@keyframes fl{0%{background:rgba(186,104,200,.55)}100%{background:transparent}}
.tr .tw{display:inline-block;width:12px;color:#9AA0A6;cursor:pointer;text-align:center}
.tr .eq{color:#9AA0A6;margin-left:6px}
.tr.hid .tg,.tr.hid .an,.tr.hid .av{opacity:.5}
.lbadge{font:600 9.5px/1 var(--body);color:#C8CCD1;border:1px solid #6F737A;border-radius:7px;padding:1px 5px 2px;margin-left:6px;cursor:pointer;vertical-align:1px}
.lbadge.on{background:#8AB4F8;color:#1F1F1F;border-color:#8AB4F8}
.crumbs{height:24px;flex:none;border-top:1px solid var(--dtl);display:flex;align-items:center;font:400 12px var(--mono);color:#BDC1C6;padding:0 4px;background:var(--dt2);overflow:hidden;white-space:nowrap}
.crumbs button{border:0;background:none;color:inherit;font:inherit;padding:0 6px;height:100%;cursor:pointer}
.crumbs button:hover{background:var(--dt3)}.crumbs button.on{background:#3C4043;color:#fff}
.edit{outline:1px solid #8AB4F8;background:#17181A;color:#E3E3E3;padding:0 2px;border-radius:2px;min-width:20px;display:inline-block}
.styles{font:400 12.5px/19px var(--mono);color:var(--dtx);padding-bottom:30px}
.rule{padding:4px 10px 6px;border-bottom:1px solid #2E3035;position:relative}
.rule .src{position:absolute;right:10px;top:4px;color:#9AA0A6;text-decoration:underline;cursor:pointer;font-size:11.5px;background:none;border:0;font-family:var(--mono);padding:0}
.rule .src.ua{text-decoration:none;font-style:italic;cursor:default}
.rule .media{color:#9AA0A6;font-size:11.5px}
.inh{padding:5px 10px;font:400 11.5px var(--body);color:#9AA0A6;background:#232428;border-bottom:1px solid #2E3035}
.dcl{padding-left:20px;position:relative}
.dcl input{position:absolute;left:2px;top:3px;margin:0;width:12px;height:12px;accent-color:#8AB4F8;opacity:.35}
.dcl:hover input,.dcl input:not(:checked){opacity:1}
.dcl .p{color:var(--pn)}.dcl .v{color:var(--dtx);cursor:text;border-radius:2px}
.dcl .v:hover{background:#2A2B2F}
.dcl.over .p,.dcl.over .v,.dcl.off .p,.dcl.off .v{text-decoration:line-through;color:#7F868C}
.sw{display:inline-block;width:11px;height:11px;border:1px solid #888;vertical-align:-1px;margin-right:4px;border-radius:2px;cursor:pointer}
.boxm{margin:12px auto 10px;max-width:420px;font:400 11px var(--mono);color:#202124;text-align:center;user-select:none}
.boxm>div{padding:4px 8px 6px;position:relative;border:1px dashed #333;background:#F9CC9D}
.boxm>div>div{padding:4px 8px 6px;position:relative;border:1.5px solid #000;background:#FFEEBC;margin:2px 20px}
.boxm>div>div>div{padding:4px 8px 6px;position:relative;background:#C3D08B;margin:2px 20px}
.boxm .lab{position:absolute;left:5px;top:2px;font-size:9.5px;color:#202124}
.boxm .row{display:flex;align-items:center;justify-content:center;gap:10px;margin:2px 0}
.boxm .cbox{background:#8CB6C0;padding:5px 12px;border:1px solid #555}
.comp{font:400 12.5px/20px var(--mono);padding:0 10px 30px}
.comp div{display:flex;gap:12px;border-bottom:1px solid #2A2B2F}.comp .p{color:var(--pn);width:170px;flex:none}.comp .v{color:var(--dtx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kv{font:400 12.5px/22px var(--body);padding:8px 12px}
.kv div{display:flex;gap:10px;border-bottom:1px solid #2A2B2F}.kv b{font-weight:500;color:#9AA0A6;width:150px;flex:none}.kv span{font-family:var(--mono);font-size:12px}
/* overlay on page */
#hl{position:absolute;inset:0;pointer-events:none;z-index:20}
#hl .ring{position:absolute;box-sizing:border-box;border-style:solid;border-width:0}
.hltip{position:absolute;background:#fff;color:#202124;border-radius:5px;box-shadow:0 2px 12px rgba(0,0,0,.35);font:400 12px/1.45 var(--body);padding:6px 9px;white-space:nowrap;z-index:21;pointer-events:none}
.hltip .t{color:#881280;font-weight:600;font-family:var(--mono)}.hltip .c{color:#1A1AA6;font-family:var(--mono)}.hltip .d{color:#5F6368;margin-left:14px;font-family:var(--mono);float:right}
.hltip table{border-collapse:collapse;margin-top:3px;font:400 11.5px var(--body);clear:both}.hltip td{padding:0}.hltip td+td{padding-left:22px;text-align:right;font-family:var(--mono)}
.hltip .sec{font:700 9.5px var(--body);letter-spacing:.08em;color:#5F6368;padding-top:5px}
.gridov{position:absolute;pointer-events:none;z-index:19}
/* console */
.con{font:400 12.5px/1.45 var(--mono);flex:1}
.cm{padding:3px 10px 3px 28px;border-bottom:1px solid #2C2E33;position:relative;white-space:pre-wrap;word-break:break-word}
.cm .ic{position:absolute;left:9px;top:3px;width:12px;text-align:center;font-weight:700}
.cm.in .ic{color:#8AB4F8}.cm.out .ic{color:#9AA0A6;font-weight:400}
.cm.warn{background:#413A1B;color:#FDD663;border-color:#65571A}.cm.warn .ic{color:#FDD663;font-size:10px}
.cm.error{background:#3C1E1E;color:#F28B82;border-color:#6B2B2B}.cm.error .ic{color:#F28B82}
.cm.info .ic{color:#8AB4F8}.cm.verbose{color:#9AA0A6}
.cm .src{float:right;color:#9AA0A6;text-decoration:underline;cursor:pointer;margin-left:14px}
.cm .cnt{display:inline-block;background:#5F6368;color:#fff;border-radius:8px;padding:0 5px;margin-right:6px;font-size:10.5px;line-height:15px}
.cm.group{font-weight:600}
.ov-str{color:var(--str)}.ov-num{color:var(--num)}.ov-kw{color:#C792EA}.ov-null{color:#9AA0A6}.ov-key{color:#E3A7FF}.ov-fn{color:#82AAFF;font-style:italic}.ov-dim{color:#9AA0A6}
.obj{cursor:pointer}.obj>.kids{padding-left:14px;display:none}.obj.open>.kids{display:block}
.obj>.hd::before{content:"▸ ";color:#9AA0A6}.obj.open>.hd::before{content:"▾ "}
.nodeprev{color:var(--tag);cursor:pointer;border-radius:2px}.nodeprev:hover{background:var(--dhov)}
.ctab{border-collapse:collapse;margin:3px 0;font:400 12px var(--mono)}.ctab td,.ctab th{border:1px solid #45474C;padding:1px 10px;text-align:left}.ctab th{background:#303134;font-weight:600}
.cprompt{display:flex;align-items:flex-start;gap:8px;padding:4px 10px 4px 10px;border-top:1px solid #2C2E33;min-height:26px}
.cprompt .ic{color:#8AB4F8;font:700 13px var(--mono);line-height:18px}
.cprompt textarea{flex:1;background:none;border:0;outline:none;color:var(--dtx);font:400 12.5px/18px var(--mono);resize:none;height:18px;padding:0}
.chips{display:flex;gap:6px;padding:6px 10px;flex-wrap:wrap;border-top:1px solid #2C2E33;background:#1B1C1E}
.chips button{border:1px solid #3C4043;background:#232428;color:#C7D7F8;border-radius:12px;padding:2px 9px;font:400 11.5px var(--mono);cursor:pointer;white-space:nowrap}
.chips button:hover{border-color:#8AB4F8}
.chips small{font:500 11px var(--body);color:#9AA0A6;align-self:center}
.live{flex:none;border-bottom:1px solid var(--dtl);padding:3px 10px;font:400 12px/1.5 var(--mono);background:#232428}
.live .le{display:flex;gap:8px}.live .le b{font-weight:400;color:#E3E3E3}.live .le button{margin-left:auto;border:0;background:none;color:#9AA0A6;cursor:pointer}
.menu{position:absolute;z-index:80;background:#2D2E31;border:1px solid #4A4C52;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:400 12.5px/26px var(--body);color:#E3E3E3;padding:4px 0;min-width:200px}
.menu button{display:flex;width:100%;border:0;background:none;color:inherit;font:inherit;padding:0 14px;text-align:left;cursor:pointer;gap:16px;align-items:center;white-space:nowrap}
.menu button:hover,.menu button.hi{background:var(--dsel)}
.menu button small{margin-left:auto;color:#9AA0A6}
.menu hr{border:0;border-top:1px solid #45474C;margin:4px 0}
.menu .h{padding:0 14px;color:#9AA0A6;font-size:11px}
/* sources */
.nav{width:210px;flex:none;border-right:1px solid var(--dtl);display:flex;flex-direction:column;min-height:0}
.ftree{font:400 12.5px/22px var(--body);padding:4px 0}
.ftree button{display:flex;align-items:center;gap:6px;width:100%;border:0;background:none;color:#D5D7DB;cursor:pointer;padding:0 8px 0 calc(var(--d)*14px + 8px);text-align:left;white-space:nowrap;font:inherit}
.ftree button:hover{background:var(--dt3)}.ftree button.on{background:var(--dsel)}
.fi{width:12px;height:13px;border-radius:2px;display:inline-block;flex:none}
.ed{flex:1;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--dtl)}
.edtabs{height:28px;flex:none;display:flex;background:var(--dt2);border-bottom:1px solid var(--dtl);font:400 12px var(--body);color:#BDC1C6;overflow:hidden}
.edtabs span{padding:0 10px;display:flex;align-items:center;gap:6px;border-right:1px solid var(--dtl);white-space:nowrap}.edtabs span.on{background:var(--dt);color:#fff}
.code{font:400 12.5px/20px var(--mono);padding:4px 0 40px;flex:1;counter-reset:ln}
.ln{display:flex;white-space:pre;position:relative;min-height:20px}
.ln .g{width:46px;flex:none;text-align:right;padding-right:12px;color:#6E7379;position:relative;cursor:pointer;user-select:none}
.ln .g:hover{color:#E3E3E3}
.ln .g.bp{color:#fff}
.ln .g.bp::before{content:"";position:absolute;right:2px;top:1px;height:18px;left:4px;background:#1A73E8;clip-path:polygon(0 0,84% 0,100% 50%,84% 100%,0 100%);z-index:-1}
.ln .g.bp.cond::before{background:#E37400}.ln .g.bp.log::before{background:#D01884}.ln .g.bp.dis::before{opacity:.45}
.ln .g{z-index:1}
.ln.cur{background:rgba(64,120,80,.45)}
.ln .cov{position:absolute;left:44px;top:0;bottom:0;width:3px}
.ln .t{flex:1;padding-left:6px}
.ln .inl{color:#9AA0A6;font-style:italic;margin-left:18px;background:rgba(138,180,248,.12);padding:0 5px;border-radius:3px;font-size:11.5px}
.bpedit{margin:2px 10px 4px 50px;background:#2D2E31;border:1px solid #E37400;border-radius:4px;padding:6px 8px;font:400 12px var(--body);color:#FCAD70;white-space:normal}
.bpedit.log{border-color:#D01884;color:#FF7FC4}
.bpedit input{display:block;width:100%;margin-top:5px;background:#17181A;border:1px solid #45474C;color:#E3E3E3;font:400 12.5px var(--mono);padding:3px 6px;outline:none}
.dbg{width:300px;flex:none;display:flex;flex-direction:column;min-height:0;font:400 12.5px/21px var(--body)}
.dbgb{height:30px;flex:none;display:flex;align-items:center;gap:2px;padding:0 6px;background:var(--dt2);border-bottom:1px solid var(--dtl)}
.dbgb button{width:28px;height:24px;border:0;background:none;border-radius:4px;color:#8AB4F8;cursor:pointer;display:grid;place-items:center}
.dbgb button:disabled{color:#5F6368;cursor:default}
.dbgb button:not(:disabled):hover{background:var(--dt3)}
.pane h4{margin:0;font:600 12px/26px var(--body);padding:0 8px;background:#27282C;color:#E3E3E3;border-bottom:1px solid var(--dtl);border-top:1px solid var(--dtl);cursor:pointer;user-select:none}
.pane h4::before{content:"▾ ";color:#9AA0A6}
.pane .pb{padding:2px 0 6px}
.pane .pb>div{padding:0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:400 12px/21px var(--mono)}
.pane .muted{color:#9AA0A6;font-family:var(--body)!important;font-style:italic}
.pausemsg{background:#3A3517;color:#FDD663;font:500 12px/28px var(--body);padding:0 10px;border-bottom:1px solid var(--dtl)}
.pausebar{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:#FFF3C4;border:1px solid #E2C766;color:#3C3000;font:500 13px var(--body);padding:5px 8px 5px 12px;border-radius:5px;display:flex;gap:8px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.25);z-index:30;white-space:nowrap}
.pausebar button{border:0;background:#1A73E8;color:#fff;width:26px;height:22px;border-radius:3px;cursor:pointer;display:grid;place-items:center}
.pausedim{position:absolute;inset:0;background:rgba(0,0,0,.2);z-index:29}
/* network */
.nwrap{flex:1;display:flex;min-height:0;position:relative}
.ntable{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.nr{display:grid;grid-template-columns:minmax(120px,1.4fr) 56px 76px minmax(80px,.8fr) 68px 60px minmax(140px,2fr);font:400 12.5px/22px var(--body);border-bottom:1px solid #2C2E33;white-space:nowrap;cursor:default}
.nr>span{padding:0 7px;overflow:hidden;text-overflow:ellipsis;border-right:1px solid #2C2E33}
.nr.h{background:var(--dt2);color:#BDC1C6;font-weight:500;position:sticky;top:0;z-index:2}
.nr:not(.h):nth-child(even){background:#232428}
.nr:not(.h):hover{background:var(--dhov)}
.nr.bad{color:#F28B82}.nr.sel{background:var(--dsel)!important}
.nr .init{color:#8AB4F8;text-decoration:underline}
.wf{position:relative}
.wf i{position:absolute;top:7px;height:8px}
.nov{height:48px;flex:none;border-bottom:1px solid var(--dtl);position:relative;background:#1B1C1F;overflow:hidden}
.nstatus{height:24px;flex:none;border-top:1px solid var(--dtl);display:flex;align-items:center;gap:10px;padding:0 10px;font:400 12px var(--body);color:#BDC1C6;background:var(--dt2);white-space:nowrap;overflow:hidden}
.nstatus .dcl{color:#8AB4F8}.nstatus .ld{color:#F28B82}
.ndet{position:absolute;right:0;top:0;bottom:0;width:min(560px,62%);background:var(--dt);border-left:1px solid var(--dtl);z-index:5;display:flex;flex-direction:column}
.hdr{font:400 12.5px/21px var(--body);padding:4px 12px 20px}
.hdr .k{color:#9AA0A6;display:inline-block;width:170px;vertical-align:top}.hdr .v{font:400 12px var(--mono);color:#E3E3E3;word-break:break-all}
.hdr h5{margin:10px 0 2px;font:600 12.5px var(--body);color:#E3E3E3}
.pre{font:400 12px/1.5 var(--mono);padding:10px 12px;white-space:pre-wrap;color:#E3E3E3}
.timing{padding:10px 12px;font:400 12px/24px var(--body)}
.timing div{display:grid;grid-template-columns:170px 1fr 70px;gap:10px;align-items:center}
.timing i{display:block;height:9px}
.chipset{display:flex;gap:2px}
.chipset button{border:0;background:none;color:#BDC1C6;padding:1px 8px;border-radius:10px;font:500 12px/20px var(--body);cursor:pointer}
.chipset button[aria-pressed="true"]{background:#3C4043;color:#fff}
/* performance */
.pcan{display:block;width:100%;cursor:crosshair}
.ptip{position:absolute;z-index:30;background:#2D2E31;border:1px solid #4A4C52;border-radius:4px;padding:5px 8px;font:400 12px/1.45 var(--body);color:#E3E3E3;pointer-events:none;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.5)}
.pbottom{height:138px;flex:none;border-top:1px solid var(--dtl);display:flex;min-height:0}
.vit{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px}
.vit div{background:#27282C;border-radius:8px;padding:10px 12px;border:1px solid #3A3C42}
.vit b{display:block;font:600 11px/1 var(--body);letter-spacing:.06em;color:#9AA0A6}
.vit span{display:block;font:600 24px/1.25 var(--mono);margin-top:6px}
.vit small{font:500 11.5px var(--body);color:#9AA0A6}
.g{color:#81C995}.o{color:#FCAD70}.r{color:#F28B82}
.prec{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:360px;background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;padding:16px 18px;z-index:5;font:400 13px var(--body);box-shadow:0 10px 30px rgba(0,0,0,.5)}
.bar6{height:6px;background:#45474C;border-radius:3px;margin:10px 0}.bar6 i{display:block;height:100%;background:#8AB4F8;border-radius:3px;width:0}
.tbl{width:100%;border-collapse:collapse;font:400 12.5px/22px var(--body)}
.tbl th{position:sticky;top:0;background:var(--dt2);text-align:left;font-weight:500;color:#BDC1C6;padding:0 8px;border-bottom:1px solid var(--dtl);border-right:1px solid #2C2E33;white-space:nowrap}
.tbl td{padding:0 8px;border-bottom:1px solid #2C2E33;border-right:1px solid #2C2E33;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px}
.tbl tr:nth-child(even) td{background:#232428}
.tbl tbody tr:hover td{background:var(--dhov)}
.tbl tr.sel td{background:var(--dsel)!important}
.tbl td.m{font-family:var(--mono);font-size:12px}
.tbl td[contenteditable]{outline:none;cursor:text}.tbl td[contenteditable]:focus{outline:1px solid #8AB4F8;background:#17181A}
/* application */
.atree{width:220px;flex:none;border-right:1px solid var(--dtl);font:400 12.5px/23px var(--body);padding:4px 0}
.atree .h{padding:6px 10px 0;font:600 11px/22px var(--body);color:#9AA0A6;letter-spacing:.04em}
.atree button{display:flex;gap:7px;align-items:center;width:100%;border:0;background:none;color:#D5D7DB;padding:0 8px 0 calc(var(--d)*14px + 6px);text-align:left;cursor:pointer;white-space:nowrap;font:inherit}
.atree button:hover{background:var(--dt3)}.atree button.on{background:var(--dsel)}
.aview{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.card{background:#232428;border:1px solid #3A3C42;border-radius:8px;padding:12px 14px;margin:12px}
/* lighthouse */
.lh{padding:16px 22px 40px;font:400 13px var(--body)}
.gauges{display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px;padding:6px 0 18px;border-bottom:1px solid var(--dtl)}
.gauge{display:flex;flex-direction:column;align-items:center;gap:8px;font:500 13px var(--body);width:120px;text-align:center}
.gauge svg{width:96px;height:96px}
.lhm{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 30px;margin:12px 0}
.lhm div{display:flex;justify-content:space-between;border-bottom:1px solid #2E3035;padding:6px 0}
.aud{border-bottom:1px solid #2E3035}
.aud summary{cursor:pointer;padding:7px 0;display:flex;gap:10px;align-items:center;list-style:none}
.aud summary::-webkit-details-marker{display:none}
.aud p{margin:0 0 10px 22px;color:#BDC1C6;font-size:12.5px;line-height:1.55}
.lhform{padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;font:400 13px/1.8 var(--body)}
.lhform h5{margin:0 0 4px;font:600 12px var(--body);color:#9AA0A6;letter-spacing:.05em;text-transform:uppercase}
.lhform label{display:flex;gap:7px;align-items:center;cursor:pointer}
.lhform input{accent-color:#8AB4F8}
/* device toolbar */
.devbar{position:absolute;left:0;right:0;top:0;height:30px;background:#35363A;border-bottom:1px solid #45474C;display:flex;align-items:center;justify-content:center;gap:8px;font:400 12px var(--body);color:#E3E3E3;z-index:12;white-space:nowrap;padding:0 8px;overflow:hidden}
.devbar .inp{min-width:0;width:54px;text-align:center;height:21px}
.devbar select.inp{width:auto}
.mq{position:absolute;left:0;right:0;top:30px;height:24px;display:flex;flex-direction:column;gap:1px;padding:1px 0;z-index:12;background:#2A2B2F}
.mq i{flex:1;margin:0 auto;cursor:pointer;opacity:.55}
.mq i:hover{opacity:1}
.devstage{position:absolute;left:0;right:0;bottom:0;top:54px;background:#2A2B2F;display:flex;align-items:center;justify-content:center;overflow:hidden}
.devframe{position:relative;flex:none;background:#F4EFE8;box-shadow:0 0 0 1px #555,0 12px 30px rgba(0,0,0,.4);transform-origin:center center}
.devhandle{position:absolute;right:-14px;top:50%;width:10px;height:44px;margin-top:-22px;border-radius:5px;background:#5F6368;cursor:ew-resize}
/* drawer */
.drawer{flex:0 0 38%;border-top:1px solid var(--dtl);display:none;flex-direction:column;min-height:0;background:var(--dt)}
.drawer.on{display:flex}
/* command menu */
.cmdk{position:absolute;left:50%;top:48px;transform:translateX(-50%);width:min(620px,90%);background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;box-shadow:0 14px 40px rgba(0,0,0,.6);z-index:90;overflow:hidden}
.cmdk input{width:100%;background:#1B1C1E;border:0;border-bottom:1px solid #45474C;color:#E3E3E3;font:400 15px var(--mono);padding:11px 14px;outline:none}
.cmdk .list{max-height:320px;overflow:auto}
.cmdk .it{display:flex;gap:14px;padding:0 14px;font:400 13px/34px var(--body);cursor:pointer;color:#E3E3E3}
.cmdk .it small{width:88px;color:#9AA0A6;flex:none;font-size:11.5px}
.cmdk .it.hi{background:var(--dsel)}
.cmdk .it b{color:#8AB4F8;font-weight:600}
.cmdk .foot{display:flex;gap:14px;flex-wrap:wrap;padding:7px 14px;border-top:1px solid #45474C;font:400 11.5px var(--body);color:#9AA0A6}
.cmdk .foot b{color:#FFE599;font-family:var(--mono)}
.toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#E8EAED;color:#202124;border-radius:6px;padding:8px 14px;font:500 13px var(--body);z-index:95;box-shadow:0 6px 20px rgba(0,0,0,.4);pointer-events:none;white-space:nowrap}
.fps{position:absolute;right:8px;top:8px;z-index:25;background:rgba(0,0,0,.78);color:#81C995;font:600 11px/1.4 var(--mono);padding:6px 8px;border-radius:4px;pointer-events:none;width:128px}
.fps canvas{display:block;margin-top:4px}
.flashbox{position:absolute;z-index:24;pointer-events:none;background:rgba(0,255,0,.3);border:1px solid #0f0}
.shiftbox{position:absolute;z-index:24;pointer-events:none;background:rgba(79,163,247,.35);border:1px solid #4FA3F7}
/* hotspots */
.pin{position:absolute;z-index:70;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#FFE599;color:#111;font:700 12px/22px var(--mono);text-align:center;box-shadow:0 0 0 3px rgba(255,229,153,.3),0 3px 10px rgba(0,0,0,.5);pointer-events:none;animation:pinin .3s ease-out both}
@keyframes pinin{from{transform:scale(.3);opacity:0}}
.spot{position:absolute;z-index:69;pointer-events:none;border:2px solid #FFE599;border-radius:6px;box-shadow:0 0 0 9999px rgba(0,0,0,.35),0 0 24px rgba(255,229,153,.5);transition:all .18s}
/* guide rail */
.guide{position:sticky;top:74px;background:var(--surface);border:1px solid var(--rule);border-radius:14px;max-height:calc(100vh - 92px);overflow:auto;scrollbar-width:thin;scrollbar-color:#2E3A58 transparent}
.guide header{padding:18px 20px 14px;border-bottom:1px solid var(--rule)}
.guide .gk{font:600 11.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--c,var(--content))}
.guide h2{margin:8px 0 6px;font:800 34px/1 var(--display);letter-spacing:-.025em}
.guide .gl{margin:0;color:var(--ink2);font-size:14.5px;line-height:1.55}
.guide section{padding:14px 20px;border-bottom:1px solid var(--rule)}
.guide h3{margin:0 0 10px;font:600 11.5px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mut);display:flex;align-items:center;gap:10px}
.guide h3 button{margin-left:auto;font:500 11.5px var(--body);letter-spacing:0;text-transform:none;background:none;border:1px solid var(--rule2);border-radius:6px;color:var(--ink2);padding:3px 8px;cursor:pointer}
.guide h3 button[aria-pressed="true"]{border-color:#FFE599;color:#FFE599}
.map{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.map li{display:flex;gap:10px;padding:6px 8px;border-radius:8px;font-size:13.5px;line-height:1.45;color:var(--ink2);cursor:default}
.map li:hover{background:var(--surface2)}
.map li b{color:#fff;font-weight:600}
.map .n{flex:none;width:21px;height:21px;border-radius:50%;background:#FFE599;color:#111;font:700 11px/21px var(--mono);text-align:center;margin-top:1px}
.tasks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.tasks li{display:flex;gap:10px;font-size:13.5px;line-height:1.45;color:var(--ink2);padding:7px 9px;border:1px solid var(--rule);border-radius:8px}
.tasks li i{flex:none;width:16px;height:16px;border-radius:4px;border:1.5px solid var(--faint);margin-top:2px;display:grid;place-items:center;font:700 11px/1 var(--body);font-style:normal;color:#0A0E18}
.tasks li.done{border-color:rgba(147,196,125,.45);background:rgba(147,196,125,.06)}
.tasks li.done i{background:var(--padding);border-color:var(--padding)}
.tasks li.done i::after{content:"✓"}
.tasks code,.guide p code,.facts code{font-size:.86em;color:#9FD6FF;background:rgba(111,168,220,.1);padding:1px 5px;border-radius:4px}
.tasks button.go{margin-left:auto;flex:none;align-self:center;font:500 11.5px var(--body);background:none;border:1px solid var(--rule2);color:var(--act);border-radius:6px;padding:2px 8px;cursor:pointer}
.gkeys{display:flex;flex-direction:column;gap:6px;font-size:13.5px;color:var(--ink2)}
.gkeys div{display:flex;justify-content:space-between;gap:10px;align-items:center}
.gkeys span.ks{display:flex;gap:3px;flex:none}
.facts{margin:0;padding-left:18px;font-size:13.5px;color:var(--ink2);line-height:1.5;display:flex;flex-direction:column;gap:6px}
.progress{display:flex;gap:4px;margin-top:12px}
.progress i{flex:1;height:4px;border-radius:2px;background:var(--rule2)}
.progress i.on{background:var(--c,var(--content))}
/* sections below */
.sec{padding-block:80px 10px}
.sech{display:flex;align-items:end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px}
.sech h2{margin:0;font:800 clamp(32px,4.4vw,58px)/.95 var(--display);letter-spacing:-.03em;text-wrap:balance;max-width:18ch}
.sech p{margin:0;color:var(--ink2);max-width:52ch}
.vidgrid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:start}
.vid{position:relative;border-radius:14px;overflow:hidden;background:#000;border:1px solid var(--rule2);aspect-ratio:16/9;max-width:100%}
.vid video{display:block;width:100%;height:100%}
.chap{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;counter-reset:c}
.chap button{width:100%;display:flex;gap:12px;align-items:center;border:0;background:none;color:var(--ink2);padding:7px 10px;border-radius:8px;cursor:pointer;text-align:left;font:500 14px var(--body)}
.chap button:hover{background:var(--surface)}
.chap button.on{background:var(--surface2);color:#fff}
.chap time{font:600 12px var(--mono);color:var(--mut);width:40px;flex:none}
.chap i{width:9px;height:9px;border-radius:2px;background:var(--c);flex:none}
.oskey{display:inline-flex;border:1px solid var(--rule2);border-radius:10px;padding:3px;gap:3px}
.oskey button{border:0;background:none;color:var(--ink2);padding:6px 14px;border-radius:7px;cursor:pointer;font:600 13px var(--body)}
.oskey button[aria-pressed="true"]{background:var(--surface2);color:#fff}
.kgrid{columns:4 280px;column-gap:16px}
.kgrid .kgroup{break-inside:avoid;margin-bottom:16px}
.kgroup{background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:16px 18px}
.kgroup h3{margin:0 0 12px;font:600 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--c)}
.krow{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:6px 0;border-top:1px solid var(--rule);font-size:14px;color:var(--ink2)}
.krow:first-of-type{border-top:0}
.krow .ks{display:flex;gap:3px;flex:none;flex-wrap:wrap;justify-content:flex-end}
.triage{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media (max-width:1100px){.triage{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.triage{grid-template-columns:1fr}}
.tcard{text-align:left;background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:16px 16px 14px;cursor:pointer;color:var(--ink);display:flex;flex-direction:column;gap:10px;font:inherit;position:relative;overflow:hidden}
.tcard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:var(--c);transition:width .18s}
.tcard:hover{border-color:var(--c)}
.tcard:hover::before{width:4px}
.tcard q{font:600 17px/1.3 var(--body);quotes:"“" "”"}
.tcard span{font:600 12px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--c);display:flex;align-items:center;gap:8px}
.tcard small{color:var(--mut);font-size:13px;line-height:1.45}
.xb{overflow-x:auto;border:1px solid var(--rule);border-radius:12px}
.xb table{width:100%;border-collapse:collapse;min-width:640px;font-size:14px}
.xb th,.xb td{padding:11px 16px;text-align:left;border-bottom:1px solid var(--rule)}
.xb th{font:600 12px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);background:var(--ground2)}
.xb td:first-child{font-weight:600;color:#fff}
.xb td{color:var(--ink2)}
.xb tr:last-child td{border-bottom:0}
footer{padding-block:70px 60px;color:var(--mut);font-size:13.5px}
footer .wrap{border-top:1px solid var(--rule);padding-top:22px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:1180px){.simgrid{grid-template-columns:1fr}.guide{position:static;max-height:none}.intro{grid-template-columns:1fr}.vidgrid{grid-template-columns:1fr}}
@media (max-width:640px){.browser{height:720px}.sec{padding-block:56px 6px}.intro{padding-block:32px 18px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}html{scroll-behavior:auto}}
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="f-protan"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>
<filter id="f-deuter"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>
<filter id="f-tritan"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>
</defs></svg>

<header class="top"><div class="wrap">
 <a class="brand" href="#top"><span class="kbd">F12</span>Field Guide</a>
 <nav aria-label="Sections"><a href="#sim">Simulator</a><a href="#video">60-second video</a><a href="#shortcuts">Shortcuts</a><a href="#triage">Which panel?</a><a href="#browsers">Other browsers</a></nav>
</div></header>

<main id="top">
<section class="wrap intro">
 <div>
  <p class="eyebrow">Interactive tour · Chromium DevTools</p>
  <h1>Press <span class="k">F12</span>. Here’s everything that opens.</h1>
 </div>
 <div>
  <p class="lede">Below is a working browser with DevTools docked. Every panel is live: inspect the page, edit CSS, run JavaScript in the Console, pause code on a breakpoint, block a request, record a profile. The guide beside it labels each part of the panel and gives you things to try.</p>
  <div class="boxkey"><div class="bm" aria-hidden="true"><div class="m"></div><div class="b"></div><div class="p"></div><div class="c"></div></div>
   <ul><li><i style="--c:var(--content)"></i>content</li><li><i style="--c:var(--padding)"></i>padding</li><li><i style="--c:var(--border)"></i>border</li><li><i style="--c:var(--margin)"></i>margin</li></ul>
   <span>The four colors DevTools paints over any element you hover. This guide uses them throughout.</span></div>
 </div>
</section>

<section class="wrap" id="sim" aria-label="DevTools simulator">
 <div class="keys" id="keys"></div>
 <div class="simgrid">
  <div class="simscroll"><div class="browser" id="browser" tabindex="0" aria-label="Simulated browser with DevTools">
   <div class="bch">
    <div class="btabs"><span class="lights"><i></i><i></i><i></i></span><div class="btab on"><span class="fav"></span><span id="tabTitle">Driftwood — Specialty Coffee</span></div><div class="btab"><span>New Tab</span></div></div>
    <div class="omni"><button aria-label="Back" tabindex="-1"><svg class="i" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5"/></svg></button><button aria-label="Forward" tabindex="-1"><svg class="i" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></button><button id="reloadBtn" aria-label="Reload page" title="Reload (records in Network)"><svg class="i" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/></svg></button>
     <div class="url"><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px;color:#9AA0A6"><rect x="3.5" y="7" width="9" height="6.5" rx="1.2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>driftwood.coffee<span class="dim">/shop</span></span></div>
     <button aria-label="Toggle DevTools (F12)" id="f12btn" title="F12"><svg class="i" viewBox="0 0 16 16"><rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M9 2.5v11"/></svg></button></div>
   </div>
   <div class="bbody bottom" id="bbody">
    <div class="pagearea" id="pagearea"><div class="viewport" id="viewport"><div id="pageHost"></div></div><div id="hl"></div></div>
    <div class="splitter" id="splitter"></div>
    <div class="dt" id="dt">
     <div class="dtt">
      <button class="icb" id="inspectBtn" aria-pressed="false" title="Select an element to inspect it (Ctrl+Shift+C)" data-hs="tabs-inspect"><svg class="i" viewBox="0 0 16 16"><path d="M7 2.5H3.3a.8.8 0 0 0-.8.8v8.4a.8.8 0 0 0 .8.8H7"/><path d="M8 7l6.5 2.4-2.8 1.2-1.3 2.9z"/></svg></button>
      <button class="icb" id="deviceBtn" aria-pressed="false" title="Toggle device toolbar (Ctrl+Shift+M)"><svg class="i" viewBox="0 0 16 16"><rect x="1.5" y="3" width="8.5" height="11" rx="1.2"/><rect x="11" y="6.5" width="3.8" height="7.5" rx=".8"/></svg></button>
      <div class="ptabs" role="tablist" id="ptabs"></div>
      <div class="dtr"><button class="bdg e" id="errBdg" title="Open Console">✕ <span>0</span></button><button class="bdg w" id="warnBdg" title="Open Console">▲ <span>0</span></button>
       <button class="icb" id="kebab" title="Customize and control DevTools"><svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="3.5" r=".8"/><circle cx="8" cy="8" r=".8"/><circle cx="8" cy="12.5" r=".8"/></svg></button>
       <button class="icb" id="closeDt" title="Close DevTools"><svg class="i" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>
     </div>
     <div class="panels" id="panels"></div>
     <div class="drawer" id="drawer"></div>
    </div>
   </div>
  </div></div>
  <aside class="guide" id="guide" aria-live="polite"></aside>
 </div>
</section>

<section class="wrap sec" id="video">
 <div class="sech"><h2>The whole toolbox in 60 seconds</h2><p>Twelve chapters, one per panel, cut to the beat. Jump to any chapter from the list, or watch it straight through with sound on.</p></div>
 <div class="vidgrid">
  <div class="vid"><video id="vid" controls playsinline preload="metadata" poster="poster.jpg"><source src="devtools-60s.mp4" type="video/mp4"></video></div>
  <ol class="chap" id="chap"></ol>
 </div>
</section>

<section class="wrap sec" id="shortcuts">
 <div class="sech"><h2>Shortcuts worth memorizing</h2><div class="oskey" role="group" aria-label="Keyboard layout"><button aria-pressed="true" data-os="win">Windows / Linux</button><button aria-pressed="false" data-os="mac">macOS</button></div></div>
 <div class="kgrid" id="kgrid"></div>
</section>

<section class="wrap sec" id="triage">
 <div class="sech"><h2>Which panel do I open?</h2><p>Start from the symptom. Each card opens the right panel in the simulator above with the relevant part highlighted.</p></div>
 <div class="triage" id="tgrid"></div>
</section>

<section class="wrap sec" id="browsers">
 <div class="sech"><h2>Same tools, other names</h2><p>Edge uses Chromium DevTools unchanged. Firefox and Safari ship equivalents under different panel names.</p></div>
 <div class="xb"><table><thead><tr><th>Job</th><th>Chrome · Edge</th><th>Firefox</th><th>Safari</th></tr></thead><tbody>
  <tr><td>DOM &amp; CSS</td><td>Elements</td><td>Inspector</td><td>Elements</td></tr>
  <tr><td>Run JavaScript, read logs</td><td>Console</td><td>Console</td><td>Console</td></tr>
  <tr><td>Breakpoints &amp; stepping</td><td>Sources</td><td>Debugger</td><td>Sources</td></tr>
  <tr><td>Requests &amp; timing</td><td>Network</td><td>Network</td><td>Network</td></tr>
  <tr><td>Runtime profiling</td><td>Performance</td><td>Performance (Firefox Profiler)</td><td>Timelines</td></tr>
  <tr><td>Heap &amp; leaks</td><td>Memory</td><td>Memory</td><td>Timelines › JavaScript Allocations</td></tr>
  <tr><td>Storage, cookies, service workers</td><td>Application</td><td>Storage</td><td>Storage</td></tr>
  <tr><td>Mobile viewport</td><td>Device toolbar (Ctrl+Shift+M)</td><td>Responsive Design Mode (Ctrl+Shift+M)</td><td>Develop › Enter Responsive Design Mode</td></tr>
  <tr><td>Open the tools</td><td>F12 · Ctrl+Shift+I · ⌘⌥I</td><td>F12 · Ctrl+Shift+I · ⌘⌥I</td><td>⌘⌥I (enable Develop menu first)</td></tr>
 </tbody></table></div>
</section>
</main>
<footer><div class="wrap"><span>F12 Field Guide · simulator modeled on Chromium DevTools. Driftwood is a fictional demo shop; nothing here makes real network requests.</span><span>Keyboard: click the browser first, then use the shortcuts shown above it.</span></div></footer>
```

### 11/16 · `F12-Field-Guide-source/site/src/perf.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/perf.js", "lines": 123, "final_newline": true, "sha256": "abc040bad35fa698568a29f63a1dfffbb22f8145d0b687eb6d4e5a0617adfbfb", "original_sha256": "abc040bad35fa698568a29f63a1dfffbb22f8145d0b687eb6d4e5a0617adfbfb"} -->
```js
/* ================= Performance ================= */
const CAT={loading:['#6FA8DC','Loading'],scripting:['#F2C94C','Scripting'],rendering:['#A67CF7','Rendering'],painting:['#7CC57C','Painting'],system:['#9AA0A6','System'],task:['#8E9297','Task']};
const PF={prof:null,v0:0,v1:1,sel:null,hov:null,tab:'summary',rec:false,t0:0,evs:[],reload:false,drag:null,live:{inters:[],shifts:[]}};
bus.on('page-event',e=>{const lbl=nodeLabel(e.el);const base={click:24}[e.type]||10;const extra=/checkout/.test(lbl)?150:/theme/.test(lbl)?120:/add/.test(lbl)?30:0;const d=Math.round((base+extra+Math.random()*30)*ST.cpu);PF.live.inters.unshift({type:'pointer',el:lbl,d});PF.live.inters.length=Math.min(PF.live.inters.length,6);if(PF.rec)PF.evs.push({t:now()-PF.t0,type:e.type,lbl});if(P.performance.built&&!PF.prof)renderPerf()});
bus.on('reload',()=>{if(PF.rec&&PF.reload)return;PF.live.shifts.unshift({score:0.02,el:'section.cards'})});
function buildPerf(p){p.innerHTML=`<div class="tb" data-hs="perf-tb"><button class="tbb rec" id="pfRec" aria-pressed="false" title="Record (Ctrl+E)">${IC.rec}</button><button class="tbb" id="pfReload" title="Record and reload (Ctrl+Shift+E)">${IC.reload}</button><button class="tbb" id="pfClear" title="Clear">${IC.clear}</button><span class="sep"></span><label class="ck"><input type="checkbox" checked>Screenshots</label><label class="ck"><input type="checkbox" id="pfMem">Memory</label><span class="sep"></span>
 <label data-hs="perf-cpu">CPU: <select class="inp" id="pfCpu"><option value="1">No throttling</option><option value="4">4× slowdown</option><option value="6">6× slowdown</option><option value="20">20× slowdown (low-end)</option></select></label><label>Network: <select class="inp" id="pfNet">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label></div>
 <div id="pfBody" style="flex:1;display:flex;flex-direction:column;min-height:0;position:relative"></div>`;
 $('#pfRec').onclick=()=>PF.rec?stopRec():startRec(false);$('#pfReload').onclick=()=>startRec(true);$('#pfClear').onclick=()=>{PF.prof=null;PF.sel=null;renderPerf()};
 $('#pfCpu').onchange=e=>{ST.cpu=+e.target.value;toast(ST.cpu>1?`CPU ${ST.cpu}× slower — every task in the next recording stretches`:'CPU throttling off');track('cpu-throttle');renderPerf()};$('#pfNet').onchange=e=>{ST.throttle=e.target.value;syncThrottle()};renderPerf()}
function startRec(reload){PF.rec=true;PF.reload=reload;PF.t0=now();PF.evs=[];$('#pfRec').setAttribute('aria-pressed','true');renderPerf();if(reload)setTimeout(reloadPage,150);PF.auto=setTimeout(stopRec,reload?3200*Math.min(2,THROTTLE[ST.throttle].k):12000);track('perf-record');
 const tick=()=>{if(!PF.rec)return;const e=$('#pfT');if(e){const s=(now()-PF.t0)/1000;e.textContent=s.toFixed(1)+' s';$('#pfB').style.width=Math.min(100,s/12*100)+'%'}requestAnimationFrame(tick)};tick()}
function stopRec(){if(!PF.rec)return;clearTimeout(PF.auto);PF.rec=false;$('#pfRec').setAttribute('aria-pressed','false');const dur=Math.max(1500,now()-PF.t0);const b=$('#pfBody');b.innerHTML=`<div class="prec"><b>Loading profile…</b><div class="bar6"><i style="width:0;transition:width .6s" id="pfL"></i></div><span style="color:#9AA0A6">Processing trace · ${Math.round(dur)} ms · ${PF.evs.length} interaction(s)</span></div>`;requestAnimationFrame(()=>{const l=$('#pfL');if(l)l.style.width='100%'});
 setTimeout(()=>{PF.prof=makeProfile(dur,PF.evs,ST.cpu,PF.reload);PF.v0=0;PF.v1=PF.prof.dur;const it=PF.prof.ev.find(e=>e.inter)||PF.prof.ev.find(e=>e.long);PF.sel=PF.prof.ev.find(e=>e.long)||it||null;if(it){const pad=Math.max(80,it.d*1.2);PF.v0=Math.max(0,it.s-pad);PF.v1=Math.min(PF.prof.dur,it.s+it.d+pad*2)}renderPerf();track('perf-profile')},700)}
function makeProfile(dur,evs,cpu,reload){const out=[];const N=(name,cat,d,kids=[],x={})=>({name,cat,d,kids,...x});
 const place=(n,s,dep)=>{const e={s,d:n.d,depth:dep,name:n.name,cat:n.cat,url:n.url,self:n.d};out.push(e);let t=s+Math.min(0.4,n.d*0.02);n.kids.forEach(c=>{place(c,t,dep+1);e.self-=c.d;t+=c.d+Math.min(0.3,n.d*0.01)});return e};
 const task=(s,kids)=>{const d=kids.reduce((a,k)=>a+k.d,0)*1.04+0.4;const e=place(N('Task','task',d,kids),s,0);e.long=d>50;return e};const c=cpu;
 if(reload){task(0,[N('Send Request','loading',1)]);task(212,[N('Parse HTML','loading',38*c,[N('Parse Stylesheet','loading',6*c)])]);
  task(300,[N('Evaluate Script','scripting',58*c,[N('Compile Code','scripting',9*c),N('(anonymous)','scripting',42*c,[N('define','scripting',14*c),N('Emitter','scripting',11*c)])],{url:'vendor.min.js'})]);
  task(365,[N('Evaluate Script','scripting',44*c,[N('Compile Code','scripting',6*c),N('loadProducts','scripting',18*c,[N('fetch','scripting',3*c)]),N('restoreCart','scripting',14*c,[N('renderCart','scripting',10*c,[N('calcTotal','scripting',3*c)])])],{url:'app.js'})]);
  task(412,[N('Event: DOMContentLoaded','scripting',4*c)]);task(430,[N('Recalculate Style','rendering',18*c),N('Layout','rendering',26*c),N('Pre-paint','rendering',3*c),N('Paint','painting',9*c),N('Layerize','painting',2*c)]);
  task(600,[N('Evaluate Script','scripting',182*c,[N('Compile Code','scripting',12*c),N('(anonymous)','scripting',160*c,[N('collectMetrics','scripting',96*c,[N('JSON.stringify','scripting',38*c),N('getEntriesByType','scripting',22*c)]),N('sendBeacon','scripting',30*c)])],{url:'analytics.js'})]);
  task(830,[N('Run Microtasks','scripting',22*c,[N('loadProducts','scripting',18*c,[N('JSON.parse','scripting',6*c),N('restoreCart','scripting',8*c)])])]);task(860,[N('Recalculate Style','rendering',7*c),N('Layout','rendering',11*c),N('Paint','painting',5*c)]);
  task(1210,[N('Event: load','scripting',6*c)]);}
 for(let t=reload?1400:180;t<dur-40;t+=480+((t*7)%130)){task(t,[N('Timer Fired','scripting',2.2*c,[N('heartbeat','scripting',1.6*c)])])}
 for(let t=reload?1700:900;t<dur-40;t+=1300){task(t,[N('Minor GC','system',3.5*c)])}
 evs.forEach(ev=>{const t=ev.t;const L=ev.lbl;let kids;
  if(/add/.test(L))kids=[N('Event: click','scripting',22*c,[N('Function Call','scripting',20*c,[N('(anonymous)','scripting',18*c,[N('addToCart','scripting',16*c,[N('setItem','scripting',3*c),N('renderCart','scripting',9*c,[N('calcTotal','scripting',2*c),N('querySelectorAll','scripting',2*c)])])])],{url:'cart.js'})]),N('Recalculate Style','rendering',6*c),N('Layout','rendering',9*c),N('Paint','painting',3*c)];
  else if(/checkout/.test(L))kids=[N('Event: click','scripting',48*c,[N('Function Call','scripting',46*c,[N('checkout','scripting',44*c,[N('calcTotal','scripting',6*c),N('fetch','scripting',4*c),N('JSON.stringify','scripting',24*c)])],{url:'cart.js'})]),N('Recalculate Style','rendering',8*c),N('Layout','rendering',12*c)];
  else if(/theme/.test(L))kids=[N('Event: click','scripting',8*c,[N('Function Call','scripting',7*c,[N('(anonymous)','scripting',6*c,[N('setItem','scripting',2*c)])],{url:'app.js'})]),N('Recalculate Style','rendering',48*c),N('Layout','rendering',21*c),N('Paint','painting',14*c)];
  else kids=[N('Event: '+ev.type,'scripting',3*c,[N('Function Call','scripting',2.4*c)]),N('Paint','painting',2*c)];
  const tk=task(t,kids);tk.inter=L;if(/checkout/.test(L))task(t+320,[N('Run Microtasks','scripting',14*c,[N('(anonymous)','scripting',12*c,[N('toast','scripting',8*c,[N('appendChild','scripting',3*c)])])]),N('Layout','rendering',6*c)])});
 out.sort((a,b)=>a.s-b.s||a.depth-b.depth);const end=Math.max(dur,...out.map(e=>e.s+e.d))+60;return{ev:out,dur:end,reload,evs,cpu}}
function renderPerf(){const b=$('#pfBody');if(!b)return;
 if(PF.rec){b.innerHTML=`<div class="prec"><div style="display:flex;justify-content:space-between"><b>Recording</b><span class="mono" id="pfT">0.0 s</span></div><div class="bar6"><i id="pfB"></i></div><div style="color:#9AA0A6;margin-bottom:10px">${PF.reload?'Reloading the page and profiling the load…':'Interact with the page now — click Add, Theme or Checkout.'}</div><div style="text-align:right"><button class="btnp" id="pfStop">Stop</button></div></div>`;$('#pfStop').onclick=stopRec;return}
 if(!PF.prof){const L=PF.live;const inp=L.inters.length?Math.max(...L.inters.map(i=>i.d)):null;const cls=L.shifts.reduce((a,s)=>a+s.score,0.02);const lcp=1.62*(ST.cpu>1?1+ST.cpu*0.18:1)*(THROTTLE[ST.throttle].k>2?2.1:1);
  const rate=(v,g,n)=>v==null?'':v<=g?'g':v<=n?'o':'r';
  b.innerHTML=`<div class="scroll" style="flex:1"><div style="padding:14px 16px 0;font:600 15px var(--body)">Local metrics <span style="font:400 12.5px var(--body);color:#9AA0A6;margin-left:8px">measured live on this page${ST.cpu>1?` · CPU ${ST.cpu}× slowdown`:''}</span></div>
  <div class="vit" data-hs="perf-vitals"><div><b>LARGEST CONTENTFUL PAINT</b><span class="${rate(lcp,2.5,4)}">${lcp.toFixed(2)} s</span><small>LCP element: div.hero-art</small></div><div><b>CUMULATIVE LAYOUT SHIFT</b><span class="${rate(cls,.1,.25)}">${cls.toFixed(2)}</span><small>${L.shifts.length} shift cluster(s)</small></div><div><b>INTERACTION TO NEXT PAINT</b><span class="${rate(inp,200,500)}">${inp==null?'–':inp+' ms'}</span><small>${inp==null?'Click something on the page':'worst of '+L.inters.length+' interaction(s)'}</small></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 12px 12px"><div class="card" style="margin:0"><b style="font-size:12.5px">Interactions</b>${L.inters.length?L.inters.map(i=>`<div style="display:flex;justify-content:space-between;font:400 12px/24px var(--mono);border-top:1px solid #2E3035"><span style="color:var(--tag)">${esc(i.el)}</span><span class="${rate(i.d,200,500)}">${i.d} ms</span></div>`).join(''):'<div style="color:#9AA0A6;font-size:12.5px;margin-top:6px">None yet. Click Add or Theme in the page.</div>'}</div>
   <div class="card" style="margin:0"><b style="font-size:12.5px">Next steps</b><div style="color:#BDC1C6;font-size:12.5px;line-height:1.6;margin-top:6px">Press <span class="kbd">●</span> Record, click around the page, then Stop to get a flame chart of the main thread. <span class="kbd">⟳</span> profiles a full page load.<div style="display:flex;gap:8px;margin-top:10px"><button class="btnp" id="pfGo">Record</button><button class="btns" id="pfGo2">Record and reload</button></div></div></div></div></div>`;
  $('#pfGo').onclick=()=>startRec(false);$('#pfGo2').onclick=()=>startRec(true);return}
 b.innerHTML=`<canvas class="pcan" id="pfOv" height="60" data-hs="perf-overview"></canvas><div style="flex:1;min-height:0;position:relative" data-hs="perf-flame"><canvas class="pcan" id="pfCan" tabindex="0" style="position:absolute;inset:0;height:100%"></canvas></div>
 <div class="pbottom" data-hs="perf-bottom"><div style="flex:1;min-width:0;display:flex;flex-direction:column"><div class="subt">${[['summary','Summary'],['bottomup','Bottom-up'],['calltree','Call tree'],['log','Event log']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k===PF.tab}">${l}</button>`).join('')}</div><div class="scroll" id="pfSum" style="flex:1"></div></div></div>`;
 $$('.pbottom .subt button').forEach(x=>x.onclick=()=>{PF.tab=x.dataset.k;$$('.pbottom .subt button').forEach(y=>y.setAttribute('aria-selected',y===x));renderSum();if(PF.tab!=='summary')track('bottom-up')});
 const cv=$('#pfCan');const ov=$('#pfOv');
 cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();const f=(e.clientX-r.left-110)/(r.width-110);const span=PF.v1-PF.v0;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){const d=(e.deltaX||e.deltaY)/r.width*span;pan(d)}else{const z=Math.exp(e.deltaY*0.0018);zoomAt(clamp(f,0,1),z)}track('perf-zoom')},{passive:false});
 cv.addEventListener('mousedown',e=>{PF.drag={x:e.clientX,v0:PF.v0,v1:PF.v1,moved:false}});
 window.addEventListener('mousemove',perfMove);window.addEventListener('mouseup',perfUp);
 cv.addEventListener('mouseleave',()=>{PF.hov=null;drawPerf();$$('.ptip').forEach(t=>t.remove())});
 cv.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='w')zoomAt(.5,.8);if(k==='s')zoomAt(.5,1.25);if(k==='a')pan(-(PF.v1-PF.v0)*.1);if(k==='d')pan((PF.v1-PF.v0)*.1)});
 ov.addEventListener('mousedown',e=>{const r=ov.getBoundingClientRect();const t=(e.clientX-r.left)/r.width*PF.prof.dur;PF.ovDrag={t0:t}});
 ov.addEventListener('mousemove',e=>{if(!PF.ovDrag)return;const r=ov.getBoundingClientRect();const t=clamp((e.clientX-r.left)/r.width*PF.prof.dur,0,PF.prof.dur);if(Math.abs(t-PF.ovDrag.t0)>PF.prof.dur/200){PF.v0=Math.min(t,PF.ovDrag.t0);PF.v1=Math.max(t,PF.ovDrag.t0);drawPerf();renderSum()}});
 ov.addEventListener('mouseup',()=>{PF.ovDrag=null});ov.addEventListener('dblclick',()=>{PF.v0=0;PF.v1=PF.prof.dur;drawPerf();renderSum()});
 new ResizeObserver(()=>drawPerf()).observe(cv.parentNode);drawPerf();renderSum()}
function zoomAt(f,z){const span=PF.v1-PF.v0;const c=PF.v0+span*f;let ns=clamp(span*z,2,PF.prof.dur);PF.v0=clamp(c-ns*f,0,PF.prof.dur-ns);PF.v1=PF.v0+ns;drawPerf();renderSum()}
function pan(d){const span=PF.v1-PF.v0;PF.v0=clamp(PF.v0+d,0,PF.prof.dur-span);PF.v1=PF.v0+span;drawPerf()}
function perfMove(e){const cv=$('#pfCan');if(!cv)return;if(PF.drag){const dx=e.clientX-PF.drag.x;if(Math.abs(dx)>3)PF.drag.moved=true;const span=PF.drag.v1-PF.drag.v0;const d=-dx/(cv.clientWidth-110)*span;PF.v0=clamp(PF.drag.v0+d,0,PF.prof.dur-span);PF.v1=PF.v0+span;drawPerf();return}
 const r=cv.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;const hit=perfHit(e.clientX-r.left,e.clientY-r.top);if(hit!==PF.hov){PF.hov=hit;drawPerf()}
 $$('.ptip').forEach(t=>t.remove());if(hit){const t=h(`<div class="ptip"><b class="mono">${fmtMs(hit.d)}</b> ${esc(hit.name)}${hit.url?` <span style="color:#9AA0A6">${hit.url}</span>`:''}${hit.long?`<br><span style="color:#F28B82">Long task took ${fmtMs(hit.d-50)} over the 50 ms budget.</span>`:''}</div>`);const host=cv.parentNode;host.appendChild(t);t.style.left=Math.min(e.clientX-r.left+14,r.width-t.offsetWidth-4)+'px';t.style.top=(e.clientY-r.top+14)+'px'}}
function perfUp(e){if(!PF.drag)return;const cv=$('#pfCan');const moved=PF.drag.moved;PF.drag=null;if(moved||!cv)return;const r=cv.getBoundingClientRect();const hit=perfHit(e.clientX-r.left,e.clientY-r.top);if(hit){PF.sel=hit;PF.tab='summary';$$('.pbottom .subt button').forEach(y=>y.setAttribute('aria-selected',y.dataset.k==='summary'));drawPerf();renderSum();track('perf-select');if(hit.long)track('long-task')}}
const PL={lab:110,ruler:18,net:0,frames:16,tim:18,inter:18,mainHead:18,row:17};
function perfLayout(){const p=PF.prof;const L={y:PL.ruler};L.net=p.reload?L.y:null;if(p.reload)L.y+=28;L.frames=L.y;L.y+=PL.frames;L.tim=p.reload?L.y:null;if(p.reload)L.y+=PL.tim;L.inter=p.evs.length?L.y:null;if(p.evs.length)L.y+=PL.inter;L.main=L.y;L.flame=L.y+PL.mainHead;return L}
function perfHit(x,y){if(!PF.prof||x<PL.lab)return null;const L=perfLayout();const W=$('#pfCan').clientWidth-PL.lab;const t=PF.v0+(x-PL.lab)/W*(PF.v1-PF.v0);const dep=Math.floor((y-L.flame)/PL.row);if(dep<0)return null;return PF.prof.ev.find(e=>e.depth===dep&&t>=e.s&&t<=e.s+e.d)||null}
function drawPerf(){const cv=$('#pfCan');if(!cv||!PF.prof)return;const dpr=window.devicePixelRatio||1;const W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);c.fillStyle='#1F1F22';c.fillRect(0,0,W,H);
 const p=PF.prof,L=perfLayout(),lab=PL.lab,FW=W-lab,x=t=>lab+(t-PF.v0)/(PF.v1-PF.v0)*FW;c.font='11px "IBM Plex Sans", sans-serif';c.textBaseline='middle';
 // ruler + grid
 const span=PF.v1-PF.v0;const steps=[1,2,5,10,20,50,100,200,500,1000,2000];const st=steps.find(s=>FW/(span/s)>=70)||5000;c.strokeStyle='#2C2E33';c.fillStyle='#9AA0A6';
 for(let t=Math.ceil(PF.v0/st)*st;t<=PF.v1;t+=st){const xx=x(t);c.beginPath();c.moveTo(xx,0);c.lineTo(xx,H);c.stroke();c.fillText(fmtMs(t),xx+3,9)}
 c.fillStyle='#28292D';c.fillRect(0,0,lab,H);c.strokeStyle='#3B3D43';c.beginPath();c.moveTo(lab,0);c.lineTo(lab,H);c.stroke();c.fillStyle='#BDC1C6';
 const labRow=(y,hh,t)=>{c.fillStyle='#BDC1C6';c.fillText(t,8,y+hh/2);c.strokeStyle='#3B3D43';c.beginPath();c.moveTo(0,y+hh);c.lineTo(W,y+hh);c.stroke()};
 if(L.net!=null){labRow(L.net,28,'Network');NET.entries.slice(0,30).forEach((e,i)=>{const s=e.start,d=e.dur;c.fillStyle=e.failed||e.status>=400?'#F28B82':/script/.test(e.type)?'#F2C94C':/stylesheet|font/.test(e.type)?'#A67CF7':/document/.test(e.type)?'#6FA8DC':'#7CC57C';const xx=x(s),ww=Math.max(1,x(s+d)-xx);c.fillRect(xx,L.net+3+(i%5)*5,ww,3.5)})}
 labRow(L.frames,PL.frames,'Frames');const longs=p.ev.filter(e=>e.depth===0&&e.d>16.7);for(let t=0;t<p.dur;t+=16.7){if(t+16.7<PF.v0||t>PF.v1)continue;const bad=longs.some(e=>t>=e.s&&t<e.s+e.d);c.fillStyle=bad?'#E46962':'rgba(129,201,149,.55)';c.fillRect(x(t)+.5,L.frames+3,Math.max(1,x(t+16.7)-x(t)-1),PL.frames-6)}
 if(L.tim!=null){labRow(L.tim,PL.tim,'Timings');[[180,'DCL','#8AB4F8'],[610,'FCP','#81C995'],[1620*(ST.cpu>1?1.3:1),'LCP','#1E8E3E'],[1210,'L','#F28B82']].forEach(([t,l,col])=>{const xx=x(t);if(xx<lab||xx>W)return;c.fillStyle=col;const tw=c.measureText(l).width+8;c.fillRect(xx,L.tim+3,tw,PL.tim-6);c.fillStyle='#111';c.fillText(l,xx+4,L.tim+PL.tim/2)})}
 if(L.inter!=null){labRow(L.inter,PL.inter,'Interactions');p.ev.filter(e=>e.inter).forEach(e=>{const xx=x(e.s),ww=Math.max(4,x(e.s+e.d)-xx);c.fillStyle=e.d>200?'#F28B82':e.d>100?'#FCAD70':'#F6B26B';c.fillRect(xx,L.inter+3,ww,PL.inter-6);if(ww>60){c.fillStyle='#111';c.fillText(`${e.inter} · ${Math.round(e.d)} ms`,xx+4,L.inter+PL.inter/2)}})}
 c.fillStyle='#BDC1C6';c.font='600 11px "IBM Plex Sans", sans-serif';c.fillText('Main — https://driftwood.coffee/shop',8,L.main+PL.mainHead/2);c.font='11px "IBM Plex Sans", sans-serif';
 p.ev.forEach(e=>{if(e.s+e.d<PF.v0||e.s>PF.v1)return;const xx=Math.max(lab,x(e.s)),x2=Math.min(W,x(e.s+e.d)),ww=x2-xx;if(ww<0.4)return;const y=L.flame+e.depth*PL.row;const col=CAT[e.cat][0];
  c.fillStyle=col;c.globalAlpha=PF.hov&&PF.hov!==e?.9:1;c.fillRect(xx,y,Math.max(.8,ww-.5),PL.row-1);c.globalAlpha=1;
  if(e.long){const over=x(e.s+50);if(over<x2){c.fillStyle='rgba(228,57,53,.35)';for(let hx=Math.max(xx,over);hx<x2;hx+=6)c.fillRect(hx,y,2,PL.row-1)}c.fillStyle='#E53935';c.beginPath();c.moveTo(x2-8,y);c.lineTo(x2,y);c.lineTo(x2,y+8);c.fill()}
  if(ww>28){c.fillStyle='#1B1B1B';c.save();c.beginPath();c.rect(xx,y,ww-2,PL.row);c.clip();c.fillText(e.name,xx+3,y+PL.row/2);c.restore()}
  if(e===PF.sel){c.strokeStyle='#8AB4F8';c.lineWidth=2;c.strokeRect(xx+1,y+1,Math.max(2,ww-2),PL.row-3);c.lineWidth=1}});
 // overview
 const ov=$('#pfOv');if(!ov)return;const OW=ov.clientWidth,OH=60;ov.width=OW*dpr;ov.height=OH*dpr;const o=ov.getContext('2d');o.scale(dpr,dpr);o.fillStyle='#1B1C1F';o.fillRect(0,0,OW,OH);
 const bins=Math.floor(OW/2);const acc=Array.from({length:bins},()=>({}));p.ev.forEach(e=>{if(e.depth===0)return;const b0=Math.floor(e.s/p.dur*bins),b1=Math.floor((e.s+e.self)/p.dur*bins);for(let b=b0;b<=Math.min(bins-1,b1);b++)acc[b][e.cat]=(acc[b][e.cat]||0)+1});
 acc.forEach((a,i)=>{let y=37;['scripting','rendering','painting','loading','system'].forEach(k=>{if(!a[k])return;const hh=Math.min(34,a[k]*8);o.fillStyle=CAT[k][0];o.fillRect(i*2,y-hh,2,hh);y-=hh})});
 for(let i=0;i<8;i++){const fx=i*OW/8+3;o.fillStyle='#F4EFE8';o.globalAlpha=.85;o.fillRect(fx,40,OW/8-6,18);o.globalAlpha=1;o.fillStyle='#1C1714';o.fillRect(fx+5,44,(OW/8-16)*(i<1&&p.reload?.1:.6),3);o.fillStyle='#E4572E';o.fillRect(fx+5,50,(i<2&&p.reload)?0:(OW/8-16)*.35,4)}
 if(document.getElementById('pfMem')&&$('#pfMem').checked){o.strokeStyle='#4FA3F7';o.beginPath();for(let i=0;i<=40;i++){const xx=i/40*OW;const yy=40-Math.min(30,8+i*.45+(i%9)*1.4+toastCache.length*.6);i?o.lineTo(xx,yy):o.moveTo(xx,yy)}o.stroke()}
 o.fillStyle='rgba(138,180,248,.14)';o.strokeStyle='#8AB4F8';const vx=PF.v0/p.dur*OW,vw=(PF.v1-PF.v0)/p.dur*OW;o.fillRect(vx,0,vw,OH);o.strokeRect(vx+.5,.5,vw-1,OH-1)}
function renderSum(){const s=$('#pfSum');if(!s||!PF.prof)return;const p=PF.prof;const inR=e=>e.s+e.d>=PF.v0&&e.s<=PF.v1;
 const tot={};p.ev.filter(inR).forEach(e=>{if(e.cat==='task')return;tot[e.cat]=(tot[e.cat]||0)+Math.max(0,e.self)});const busy=Object.values(tot).reduce((a,b)=>a+b,0);const range=PF.v1-PF.v0;
 const donut=(parts,total)=>{let off=25,out='<svg viewBox="0 0 42 42" width="104" height="104"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/>';parts.forEach(([k,v])=>{const pc=v/total*100;out+=`<circle cx="21" cy="21" r="15.9" fill="none" stroke="${CAT[k]?CAT[k][0]:'#E3E3E3'}" stroke-width="6" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${off}"/>`;off-=pc});return out+'</svg>'};
 if(PF.tab==='summary'){if(PF.sel){const e=PF.sel;const kids={};p.ev.filter(x=>x.s>=e.s&&x.s+x.d<=e.s+e.d+0.01&&x.depth>e.depth).forEach(x=>{if(x.cat!=='task')kids[x.cat]=(kids[x.cat]||0)+Math.max(0,x.self)});const parts=Object.entries(kids);
   s.innerHTML=`<div style="display:flex;gap:18px;padding:10px 14px;align-items:center">${parts.length?donut(parts,e.d):''}<div style="font:400 12.5px/1.7 var(--body)"><div style="font:600 14px var(--body)"><i style="display:inline-block;width:10px;height:10px;background:${CAT[e.cat][0]};margin-right:6px"></i>${esc(e.name)}${e.url?` <span style="color:#8AB4F8;font-weight:400;text-decoration:underline">${e.url}</span>`:''}</div>${e.long?`<div style="color:#F28B82">⚠ Long task took ${fmtMs(e.d-50)} over the 50 ms budget — input is blocked for this long.</div>`:''}<div>Duration <b class="mono">${e.d.toFixed(2)} ms</b> · Self time <b class="mono">${Math.max(0,e.self).toFixed(2)} ms</b> · Start <span class="mono">${fmtMs(e.s)}</span></div>${parts.map(([k,v])=>`<span style="margin-right:14px"><i style="display:inline-block;width:9px;height:9px;background:${CAT[k][0]};margin-right:5px"></i>${CAT[k][1]} <span class="mono">${v.toFixed(1)} ms</span></span>`).join('')}</div></div>`}
  else{const parts=Object.entries(tot);s.innerHTML=`<div style="display:flex;gap:18px;padding:10px 14px;align-items:center">${donut(parts.concat([['idle',Math.max(0,range-busy)]]),range)}<div style="font:400 12.5px/1.8 var(--body)"><div>Range <span class="mono">${fmtMs(PF.v0)} – ${fmtMs(PF.v1)}</span> · CPU ${p.cpu}×</div>${parts.map(([k,v])=>`<div><i style="display:inline-block;width:9px;height:9px;background:${CAT[k][0]};margin-right:6px"></i>${CAT[k][1]} <span class="mono">${v.toFixed(1)} ms</span></div>`).join('')}<div><i style="display:inline-block;width:9px;height:9px;background:#E3E3E3;margin-right:6px"></i>Idle <span class="mono">${Math.max(0,range-busy).toFixed(0)} ms</span></div></div><div style="margin-left:auto;align-self:flex-start;color:#9AA0A6;font:400 12px/1.6 var(--body);max-width:260px">Scroll to zoom, drag to pan, click a bar for details. Drag across the overview to pick a range, double-click it to reset.</div></div>`}}
 else if(PF.tab==='bottomup'||PF.tab==='calltree'){const agg={};p.ev.filter(inR).forEach(e=>{if(e.name==='Task')return;if(PF.tab==='calltree'&&e.depth>3)return;const k=e.name+(e.url?' · '+e.url:'');const a=agg[k]=agg[k]||{self:0,total:0,cat:e.cat,depth:e.depth};a.self+=Math.max(0,e.self);a.total+=e.d});
  const rows=Object.entries(agg).sort((a,b)=>PF.tab==='bottomup'?b[1].self-a[1].self:b[1].total-a[1].total).slice(0,40);const T=busy||1;
  s.innerHTML=`<table class="tbl"><thead><tr><th style="width:130px">Self time</th><th style="width:130px">Total time</th><th>Activity</th></tr></thead><tbody>${rows.map(([k,a])=>`<tr><td class="m">${a.self.toFixed(1)} ms <span style="color:#9AA0A6">${(a.self/T*100).toFixed(1)}%</span></td><td class="m">${a.total.toFixed(1)} ms</td><td style="padding-left:${PF.tab==='calltree'?8+a.depth*14:8}px"><i style="display:inline-block;width:9px;height:9px;background:${CAT[a.cat][0]};margin-right:6px"></i>${esc(k)}</td></tr>`).join('')}</tbody></table>`}
 else s.innerHTML=`<table class="tbl"><thead><tr><th style="width:100px">Start</th><th style="width:110px">Duration</th><th>Activity</th></tr></thead><tbody>${p.ev.filter(e=>e.depth===0&&inR(e)).map(e=>{const k=p.ev.find(x=>x.depth===1&&x.s>=e.s&&x.s<e.s+e.d);return`<tr><td class="m">${fmtMs(e.s)}</td><td class="m ${e.long?'r':''}">${e.d.toFixed(1)} ms</td><td>${esc(k?k.name:'Task')}${e.long?' <span class="r">· long task</span>':''}</td></tr>`}).join('')}</tbody></table>`}

/* ================= Memory ================= */
const MEM={snaps:[],view:'summary',filter:'',sel:null,taking:false,type:'heap',timeline:null};
function heapCounts(){const divs=PAGE.qa('div').length,btn=PAGE.qa('button').length;return{'(string)':14202+cart.items.length*12+toastCache.length*3,'(closure)':5120+LIVE.length*4,'Object':9880+cart.items.length*6+CON.msgs.length*2,'Array':2104+cart.items.length,'(compiled code)':1006,'system / Context':640,'HTMLDivElement':divs,'HTMLButtonElement':btn,'Text':410+toastCache.length,'Detached <div class="toast">':toastCache.length,'Detached Text':toastCache.length,'(array)':870}}
const SIZE={'(string)':180,'(closure)':96,'Object':220,'Array':64,'(compiled code)':4200,'system / Context':240,'HTMLDivElement':188,'HTMLButtonElement':196,'Text':96,'Detached <div class="toast">':1740,'Detached Text':120,'(array)':1200};
function buildMemory(p){p.innerHTML=`<div class="tb" data-hs="mem-tb"><button class="tbb rec" id="mRec" title="Take heap snapshot">${IC.rec}</button><button class="tbb" id="mClear" title="Clear all profiles">${IC.clear}</button><button class="tbb" id="mGc" title="Collect garbage">${IC.trash}</button><span class="sep"></span><select class="inp" id="mView"><option value="summary">Summary</option><option value="comparison">Comparison</option><option value="containment">Containment</option></select><input class="inp" id="mFilter" placeholder="Class filter" style="width:170px" data-hs="mem-filter"><span style="color:#9AA0A6">All objects ▾</span></div>
 <div style="flex:1;display:flex;min-height:0"><div style="width:200px;flex:none;border-right:1px solid var(--dtl);font:400 12.5px/26px var(--body)" id="mSide" data-hs="mem-side"></div><div style="flex:1;min-width:0;display:flex;flex-direction:column" id="mMain"></div></div>`;
 $('#mRec').onclick=takeSnap;$('#mClear').onclick=()=>{MEM.snaps=[];MEM.sel=null;renderMem()};$('#mGc').onclick=()=>{toast('Garbage collected — anything still referenced (like toastCache) survives');track('gc')};
 $('#mView').onchange=e=>{MEM.view=e.target.value;renderMem();if(MEM.view==='comparison')track('mem-compare')};$('#mFilter').oninput=e=>{MEM.filter=e.target.value;renderMem();if(/detach/i.test(MEM.filter))track('mem-detached')};renderMem()}
function takeSnap(){if(MEM.taking)return;MEM.taking=true;MEM.cur=null;const n=MEM.snaps.length+1;renderMem();const t0=now();const tick=()=>{const p=(now()-t0)/1300;const m=$('#mMain');if(m&&MEM.taking){m.innerHTML=`<div class="empty" style="margin:auto">Snapshot ${n} — ${p<.55?'Snapshotting… '+Math.round(p/.55*100)+'%':'Building dominator tree…'}<div class="bar6" style="width:320px;margin:12px auto"><i style="width:${Math.min(100,p*100)}%"></i></div></div>`}if(p<1)requestAnimationFrame(tick);else{const counts=heapCounts();const size=Object.entries(counts).reduce((a,[k,v])=>a+v*(SIZE[k]||50),0);MEM.snaps.push({n,counts,size});MEM.sel=null;MEM.cur=MEM.snaps.length-1;MEM.taking=false;if(MEM.snaps.length>1){MEM.view='comparison';$('#mView').value='comparison'}renderMem();track('heap-snapshot')}};tick()}
function renderMem(){const side=$('#mSide'),m=$('#mMain');if(!side)return;side.innerHTML=`<div style="padding:0 10px;color:#9AA0A6;font:600 11px/28px var(--body);letter-spacing:.05em">HEAP SNAPSHOTS</div>${MEM.snaps.map((s,i)=>`<div data-s="${i}" style="padding:0 10px;cursor:pointer;display:flex;justify-content:space-between;${MEM.cur===i?'background:var(--dsel)':''}"><span>▣ Snapshot ${s.n}</span><span class="mono">${(s.size/1e6).toFixed(1)} MB</span></div>`).join('')||'<div style="padding:0 10px;color:#9AA0A6">None yet</div>'}`;
 $$('[data-s]',side).forEach(d=>d.onclick=()=>{MEM.cur=+d.dataset.s;renderMem()});if(MEM.taking)return;
 if(MEM.cur==null){m.innerHTML=`<div style="padding:16px 20px;font:400 13px/1.7 var(--body);overflow:auto"><div style="font:600 15px var(--body);margin-bottom:6px">Select profiling type</div>${[['heap','Heap snapshot','See memory distribution among the page’s JavaScript objects and related DOM nodes.'],['timeline','Allocations on timeline','Record allocations over time. Blue bars that stay blue are objects that were never freed.'],['sampling','Allocation sampling','Low-overhead sampling of which functions allocate memory.']].map(([k,l,d])=>`<label style="display:flex;gap:10px;margin:8px 0;cursor:pointer"><input type="radio" name="mt" value="${k}" ${MEM.type===k?'checked':''} style="accent-color:#8AB4F8;margin-top:5px"><span><b>${l}</b><br><span style="color:#9AA0A6">${d}</span></span></label>`).join('')}
  <div style="margin:14px 0 6px;color:#9AA0A6">JavaScript VM instance: <span class="mono" style="color:#E3E3E3">${(Object.entries(heapCounts()).reduce((a,[k,v])=>a+v*(SIZE[k]||50),0)/1e6).toFixed(1)} MB</span> driftwood.coffee</div><button class="btnp" id="mGo">${MEM.type==='timeline'?'Start':'Take snapshot'}</button>
  <div class="card" style="margin:16px 0 0;color:#BDC1C6">Leak hunt: take a snapshot, click <b>Subscribe</b> in the page 5 times, take another, choose <b>Comparison</b> and type <code>Detached</code> in the class filter.</div></div>`;
  $$('[name="mt"]',m).forEach(r=>r.onchange=()=>{MEM.type=r.value;renderMem()});$('#mGo',m).onclick=()=>MEM.type==='timeline'?memTimeline():takeSnap();return}
 const s=MEM.snaps[MEM.cur],prev=MEM.snaps[MEM.cur-1];const f=MEM.filter.toLowerCase();let rows;
 if(MEM.view==='comparison'&&prev){rows=Object.keys(s.counts).map(k=>{const a=s.counts[k],b=prev.counts[k]||0;const nw=Math.max(0,a-b)+Math.round(a*0.02*(k.startsWith('(')?1:0));const del=nw-(a-b);return{k,cells:[nw,del,a-b,((a-b)*(SIZE[k]||50))],det:k.startsWith('Detached')}}).filter(r=>r.cells[0]||r.cells[1]);
  m.innerHTML=`<div style="padding:4px 10px;color:#9AA0A6;font:400 12px var(--body);border-bottom:1px solid var(--dtl)">Snapshot ${s.n} compared with Snapshot ${prev.n}</div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Constructor</th><th># New</th><th># Deleted</th><th># Delta</th><th>Size Delta</th></tr></thead><tbody>${rows.filter(r=>!f||r.k.toLowerCase().includes(f)).sort((a,b)=>b.cells[3]-a.cells[3]).map(r=>`<tr data-k="${esc(r.k)}" class="${MEM.sel===r.k?'sel':''}" style="${r.det&&r.cells[2]>0?'color:#F6B26B':''}"><td>▸ ${esc(r.k)}</td><td class="m">${r.cells[0].toLocaleString()}</td><td class="m">${r.cells[1].toLocaleString()}</td><td class="m">${r.cells[2]>0?'+':''}${r.cells[2].toLocaleString()}</td><td class="m">${r.cells[3]>0?'+':''}${fmtBytes(Math.abs(r.cells[3]))}</td></tr>`).join('')}</tbody></table></div><div id="mRet"></div>`}
 else{rows=Object.entries(s.counts).map(([k,v])=>({k,v,sh:v*(SIZE[k]||50)}));const T=s.size;m.innerHTML=`${MEM.view==='comparison'?'<div style="padding:4px 10px;color:#FDD663;font:400 12px var(--body)">Take a second snapshot to compare.</div>':''}<div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Constructor</th><th>Distance</th><th>Shallow Size</th><th>Retained Size</th></tr></thead><tbody>${rows.filter(r=>!f||r.k.toLowerCase().includes(f)).sort((a,b)=>b.sh-a.sh).map(r=>`<tr data-k="${esc(r.k)}" class="${MEM.sel===r.k?'sel':''}" style="${r.k.startsWith('Detached')&&r.v?'color:#F6B26B':''}"><td>▸ ${esc(r.k)} <span style="color:#9AA0A6">×${r.v.toLocaleString()}</span></td><td class="m">${r.k.startsWith('Detached')?4:r.k.startsWith('HTML')?3:2}</td><td class="m">${fmtBytes(r.sh)} <span style="color:#9AA0A6">${(r.sh/T*100).toFixed(0)}%</span></td><td class="m">${fmtBytes(r.sh*1.6)}</td></tr>`).join('')}</tbody></table></div><div id="mRet"></div>`}
 $$('tr[data-k]',m).forEach(tr=>tr.onclick=()=>{MEM.sel=tr.dataset.k;renderMem();track('retainers')});
 if(MEM.sel){const det=MEM.sel.startsWith('Detached');$('#mRet',m).innerHTML=`<div style="border-top:2px solid var(--dtl);max-height:140px;overflow:auto" data-hs="mem-ret"><div style="padding:0 10px;font:600 12px/26px var(--body);background:#27282C">Retainers <span style="font-weight:400;color:#9AA0A6">for ${esc(MEM.sel)} — Object · Distance · Retained</span></div>${det?`<div style="padding:0 14px;font:400 12px/22px var(--mono)">▾ [${Math.max(0,toastCache.length-1)}] in <span style="color:#F6B26B">Array</span> @84211 <span style="float:right;color:#9AA0A6">3 · ${fmtBytes(toastCache.length*1740)}</span></div><div style="padding:0 30px;font:400 12px/22px var(--mono)">▾ toastCache in <span style="color:#8AB4F8">Window</span> / app.js:22 <span style="float:right;color:#9AA0A6">2</span></div><div style="padding:4px 14px 8px;font:400 12px var(--body);color:#FDD663">This toast was removed from the DOM but <code>toastCache</code> still points at it, so it can never be garbage collected.</div>`:`<div style="padding:0 14px;font:400 12px/22px var(--mono)">▾ ${esc(MEM.sel)} in (GC roots) <span style="float:right;color:#9AA0A6">1</span></div>`}</div>`}}
function memTimeline(){const m=$('#mMain');MEM.timeline={t0:now(),bars:[]};m.onclick=e=>{if(e.target.id==='mStop'){MEM.timeline=null;m.onclick=null;takeSnap()}};const on=()=>{if(!MEM.timeline)return;const T=MEM.timeline;const s=(now()-T.t0)/1000;if(T.bars.length<Math.floor(s*4)){T.bars.push({h:6+Math.random()*26,live:false,toast:false})}
  m.innerHTML=`<div style="padding:10px 14px;display:flex;gap:10px;align-items:center"><b>Recording allocations…</b><span class="mono">${s.toFixed(1)} s</span><button class="btnp" id="mStop" style="margin-left:auto">Stop</button></div><div style="height:120px;position:relative;margin:0 14px;border:1px solid var(--dtl);background:#1B1C1F">${T.bars.map((b,i)=>`<i style="position:absolute;bottom:0;left:${i*7+4}px;width:4px;height:${b.h+(b.toast?40:0)}px;background:${b.live||b.toast?'#4FA3F7':'#5F6368'}"></i>`).join('')}</div><div style="padding:10px 14px;color:#9AA0A6;font:400 12.5px var(--body)">Click <b>Subscribe</b> in the page: each toast leaves a tall blue bar that never turns grey — that allocation is never freed.</div>`;
  setTimeout(on,250)};window.__memToastHook=()=>{if(MEM.timeline)MEM.timeline.bars.push({h:8,toast:true})};on()}
```

### 12/16 · `F12-Field-Guide-source/site/src/shell.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/shell.js", "lines": 217, "final_newline": true, "sha256": "ac1b789055a291a0752b3c3cf48d9c62d133a83ded2c4a1e05b80eae5ec092d5", "original_sha256": "ac1b789055a291a0752b3c3cf48d9c62d133a83ded2c4a1e05b80eae5ec092d5"} -->
```js
/* ================= shell: panels, dock, device, drawer, command menu ================= */
const P={};const BUILD={elements:buildElements,console:el=>{makeConsole(el,false)},sources:buildSources,network:buildNetwork,performance:buildPerf,memory:buildMemory,application:buildApp,lighthouse:buildLH};
const panelsEl=$('#panels');PANELS.forEach(([id,l])=>{const el=h(`<div class="panel" data-p="${id}" role="tabpanel"></div>`);panelsEl.appendChild(el);P[id]={el,built:false}});
$('#ptabs').innerHTML=PANELS.map(([id,l])=>`<button class="ptab" role="tab" data-p="${id}" aria-selected="false" data-hs="tab-${id}">${l}</button>`).join('');
$('#ptabs').onclick=e=>{const b=e.target.closest('.ptab');if(b)setPanel(b.dataset.p)};
function setPanel(id){ST.panel=id;if(!ST.open)toggleDevtools(true);$$('.ptab').forEach(t=>t.setAttribute('aria-selected',t.dataset.p===id));$$('.panel').forEach(p=>p.classList.toggle('on',p.dataset.p===id));
 const pn=P[id];if(!pn.built){pn.built=true;BUILD[id](pn.el)}if(id==='network')loopNet();if(id==='performance')requestAnimationFrame(drawPerf);if(id==='sources')SRC.render();if(id==='application')renderApp();if(id==='memory')renderMem();
 const t=$(`.ptab[data-p="${id}"]`);if(t)t.scrollIntoView({block:'nearest',inline:'nearest'});setGuide(id);track('panel-'+id)}
function toggleDevtools(on){ST.open=on===undefined?!ST.open:on;$('#bbody').classList.toggle('closed',!ST.open);$('#f12btn').style.color=ST.open?'#8AB4F8':'';if(!ST.open){setInspect(false);setGuide('closed')}else setGuide(ST.device?'device':ST.panel);updateKeys();placePins();if(ST.open)track('open-devtools')}
function setDock(d){ST.dock=d;const b=$('#bbody');b.classList.remove('bottom','right');b.classList.add(d);toast(`Docked to ${d}`);placePins();requestAnimationFrame(()=>{drawPerf();drawGrids()});track('dock')}
$('#closeDt').onclick=()=>toggleDevtools(false);$('#f12btn').onclick=()=>toggleDevtools();$('#inspectBtn').onclick=()=>{setInspect(!ST.inspecting)};$('#deviceBtn').onclick=()=>setDevice(!ST.device);
$('#errBdg').onclick=$('#warnBdg').onclick=()=>setPanel('console');$('#reloadBtn').onclick=reloadPage;
$('#kebab').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();openMenu(r.right-230,r.bottom+2,[{head:'Dock side'},{label:(ST.dock==='bottom'?'✓ ':'')+'Dock to bottom',act:()=>setDock('bottom')},{label:(ST.dock==='right'?'✓ ':'')+'Dock to right',act:()=>setDock('right')},'-',{label:'Run command',hint:'Ctrl+Shift+P',act:()=>openCmd('>')},{label:'Open file',hint:'Ctrl+P',act:()=>openCmd('')},{label:ST.drawer?'Hide console drawer':'Show console drawer',hint:'Esc',act:()=>toggleDrawer()},'-',{head:'More tools'},{label:'Rendering',act:()=>openDrawer('rendering')},{label:'Coverage',act:()=>openDrawer('coverage')},{label:'Changes',act:()=>openDrawer('changes')},{label:'Issues',act:()=>openDrawer('issues')},'-',{label:'Shortcuts',act:()=>document.getElementById('shortcuts').scrollIntoView()}])};
// splitter
(()=>{const sp=$('#splitter');let drag=null;sp.addEventListener('mousedown',e=>{drag={x:e.clientX,y:e.clientY,r:$('#bbody').getBoundingClientRect()};e.preventDefault()});
 window.addEventListener('mousemove',e=>{if(!drag)return;const b=$('#bbody');if(ST.dock==='bottom'){const ph=clamp(e.clientY-drag.r.top,90,drag.r.height-140);b.style.setProperty('--ph',ph+'px')}else{const pw=clamp((e.clientX-drag.r.left)/drag.r.width*100,22,75);b.style.setProperty('--pw',pw+'%')}if(ST.device)fitDevice()});
 window.addEventListener('mouseup',()=>{if(drag){drag=null;placePins();drawPerf();drawGrids()}})})();

/* ---------- device mode ---------- */
const DEVICES=[['Responsive',null,null,1],['iPhone SE',375,667,2],['iPhone 14 Pro Max',430,932,3],['Pixel 7',412,915,2.625],['Samsung Galaxy S20 Ultra',412,915,3.5],['iPad Mini',768,1024,2],['iPad Air',820,1180,2],['Surface Pro 7',912,1368,2],['Nest Hub',1024,600,2]];
const DV={dev:'Responsive',w:390,h:700,zoom:'fit',rot:false};
function setDevice(on){ST.device=on;$('#deviceBtn').setAttribute('aria-pressed',on);$('#bbody').classList.toggle('dev',on);const pa=$('#pagearea');
 if(on){pa.insertAdjacentHTML('afterbegin',`<div class="devbar" id="devbar" data-hs="dev-bar"><span>Dimensions:</span><select class="inp" id="devSel">${DEVICES.map(d=>`<option ${d[0]===DV.dev?'selected':''}>${d[0]}</option>`).join('')}</select><input class="inp" id="devW" value="${DV.w}" aria-label="Width"><span>×</span><input class="inp" id="devH" value="${DV.h}" aria-label="Height"><select class="inp" id="devZoom"><option value="fit">Fit</option><option value="0.5">50%</option><option value="0.75">75%</option><option value="1">100%</option></select><span id="devDpr" style="color:#9AA0A6">DPR 1</span><select class="inp" id="devThrottle">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><button class="tbb" id="devRot" title="Rotate">⟲</button></div><div class="mq" id="mq" data-hs="dev-mq"></div><div class="devstage" id="devstage"><div class="devframe" id="devframe" data-hs="dev-frame"><div class="devhandle" id="devHandle" title="Drag to resize"></div></div></div>`);
  $('#devframe').prepend(pageHost);$('#devSel').onchange=e=>{const d=DEVICES.find(x=>x[0]===e.target.value);DV.dev=d[0];if(d[1]){DV.w=d[1];DV.h=d[2];DV.rot=false}fitDevice();track('dev-preset')};
  $('#devW').onchange=e=>{DV.w=clamp(+e.target.value||390,200,1600);DV.dev='Responsive';fitDevice()};$('#devH').onchange=e=>{DV.h=clamp(+e.target.value||700,200,1600);DV.dev='Responsive';fitDevice()};$('#devZoom').onchange=e=>{DV.zoom=e.target.value;fitDevice()};
  $('#devThrottle').value=ST.throttle;$('#devThrottle').onchange=e=>{ST.throttle=e.target.value;syncThrottle();toast(`${THROTTLE[ST.throttle].label} — reload to feel it`)};$('#devRot').onclick=()=>{const t=DV.w;DV.w=DV.h;DV.h=t;DV.rot=!DV.rot;fitDevice();track('dev-rotate')};
  const hd=$('#devHandle');let drag=null;hd.addEventListener('mousedown',e=>{drag={x:e.clientX,w:DV.w};e.preventDefault()});window.addEventListener('mousemove',e=>{if(!drag)return;const sc=+$('#devframe').dataset.sc||1;DV.w=Math.round(clamp(drag.w+(e.clientX-drag.x)*2/sc,220,1400));DV.dev='Responsive';fitDevice()});window.addEventListener('mouseup',()=>{if(drag){drag=null;track('dev-drag')}});
  fitDevice();setGuide('device');track('device')}
 else{$('#viewport').appendChild(pageHost);['devbar','mq','devstage'].forEach(id=>{const x=document.getElementById(id);if(x)x.remove()});pageHost.style.cursor='';setGuide(ST.panel)}
 clearHL();requestAnimationFrame(()=>{drawGrids();placePins()});if(P.elements.built)renderSide()}
function fitDevice(){const f=$('#devframe'),st=$('#devstage');if(!f)return;const d=DEVICES.find(x=>x[0]===DV.dev);f.style.width=DV.w+'px';f.style.height=DV.h+'px';const avW=st.clientWidth-40,avH=st.clientHeight-30;let sc=DV.zoom==='fit'?Math.min(1,avW/DV.w,avH/DV.h):+DV.zoom;f.style.transform=`scale(${sc})`;f.dataset.sc=sc;
 $('#devW').value=DV.w;$('#devH').value=DV.h;$('#devSel').value=DV.dev;$('#devDpr').textContent='DPR '+(d&&d[3]?d[3]:1);const touch=DV.dev!=='Responsive';pageHost.style.cursor=touch?`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Ccircle cx='13' cy='13' r='10' fill='rgba(120,120,120,.45)' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E") 13 13, pointer`:'';
 const mq=$('#mq');const bps=[...new Set(RULES.filter(r=>r.media).map(r=>+r.media.match(/(\d+)/)[1]))].sort((a,b)=>b-a);mq.innerHTML=bps.map((bp,i)=>`<i data-w="${bp}" title="@media (max-width: ${bp}px)" style="width:${Math.min(100,bp*sc/mq.clientWidth*100)}%;background:${['#6FA8DC','#93C47D','#F6B26B'][i%3]}"></i>`).join('')+`<i data-w="1024" title="Laptop 1024px" style="width:${Math.min(100,1024*sc/mq.clientWidth*100)}%;background:#9AA0A6;opacity:.3"></i>`;
 $$('i',mq).forEach(b=>b.onclick=()=>{DV.w=+b.dataset.w;DV.dev='Responsive';fitDevice();track('dev-mq')});requestAnimationFrame(()=>{drawGrids();if(P.elements.built&&EL.sub==='styles')renderSide()})}
window.addEventListener('resize',()=>{fitDevice();placePins();drawGrids()});

/* ---------- drawer ---------- */
const DRAWER_TABS=[['console','Console'],['rendering','Rendering'],['coverage','Coverage'],['changes','Changes'],['issues','Issues']];let drawerConsole=null;
function toggleDrawer(on){ST.drawer=on===undefined?!ST.drawer:on;renderDrawer();if(ST.drawer)track('drawer')}
function openDrawer(tab){ST.drawer=true;ST.drawerTab=tab;renderDrawer();setGuide('drawer');track('drawer-'+tab)}
function renderDrawer(){const d=$('#drawer');d.classList.toggle('on',ST.drawer);if(!ST.drawer){placePins();return}
 d.innerHTML=`<div class="subt" data-hs="drw-tabs">${DRAWER_TABS.map(([k,l])=>`<button data-k="${k}" aria-selected="${k===ST.drawerTab}">${l}</button>`).join('')}<button style="margin-left:auto" id="drwX" title="Close drawer">✕</button></div><div id="drwBody" style="flex:1;min-height:0;display:flex;flex-direction:column" data-hs="drw-body"></div>`;
 $$('.subt button[data-k]',d).forEach(b=>b.onclick=()=>{ST.drawerTab=b.dataset.k;renderDrawer();track('drawer-'+ST.drawerTab)});$('#drwX').onclick=()=>toggleDrawer(false);const body=$('#drwBody');
 if(ST.drawerTab==='console'){makeConsole(body,true)}
 else if(ST.drawerTab==='rendering'){body.innerHTML=`<div class="scroll" style="flex:1;padding:8px 14px;font:400 12.5px/1.5 var(--body)">${[['paint','Paint flashing','Highlights areas of the page (green) that need to be repainted.'],['shifts','Layout Shift Regions','Highlights areas of the page (blue) that were shifted.'],['fps','Frame Rendering Stats','Plots frame throughput, dropped frames distribution, and GPU memory.']].map(([k,l,dd])=>`<label class="ck" style="display:flex;align-items:flex-start;gap:8px;margin:6px 0"><input type="checkbox" data-r="${k}" ${ST[k]?'checked':''} style="margin-top:3px"><span><b style="font-weight:600">${l}</b><br><span style="color:#9AA0A6">${dd}</span></span></label>`).join('')}
  <div style="margin:10px 0 4px;font-weight:600">Emulate CSS media feature prefers-color-scheme</div><select class="inp" id="rScheme"><option value="">No emulation</option><option value="light">prefers-color-scheme: light</option><option value="dark">prefers-color-scheme: dark</option></select>
  <div style="margin:10px 0 4px;font-weight:600">Emulate vision deficiencies</div><select class="inp" id="rVision"><option value="none">No emulation</option><option value="blur">Blurred vision</option><option value="protan">Protanopia (no red)</option><option value="deuter">Deuteranopia (no green)</option><option value="tritan">Tritanopia (no blue)</option><option value="achro">Achromatopsia (no color)</option></select>
  <div style="margin:10px 0 4px;font-weight:600">Emulate CSS media feature prefers-reduced-motion</div><select class="inp"><option>No emulation</option><option>prefers-reduced-motion: reduce</option></select></div>`;
  $$('[data-r]',body).forEach(c=>c.onchange=()=>{ST[c.dataset.r]=c.checked;if(c.dataset.r==='fps')fpsMeter(c.checked);track('rendering-'+c.dataset.r)});$('#rScheme',body).value=ST.schemeEmu||'';$('#rScheme',body).onchange=e=>{ST.schemeEmu=e.target.value;if(e.target.value)BODY.dataset.theme=e.target.value;else BODY.dataset.theme=LS.get('theme')||'light';track('rendering-scheme')};
  $('#rVision',body).value=ST.vision;$('#rVision',body).onchange=e=>{ST.vision=e.target.value;$('#viewport').style.filter={none:'',blur:'blur(2px)',protan:'url(#f-protan)',deuter:'url(#f-deuter)',tritan:'url(#f-tritan)',achro:'grayscale(1)'}[ST.vision];track('rendering-vision')}}
 else if(ST.drawerTab==='coverage'){renderCoverage(body)}
 else if(ST.drawerTab==='changes'){const ch=ST.changes;body.innerHTML=`<div class="tb"><button class="tbb" id="chCopy">Copy all changes</button><button class="tbb" id="chRevert">Revert all</button><span style="color:#9AA0A6">${ch.length} change(s) to app.css</span></div><div class="scroll" style="flex:1;font:400 12.5px/22px var(--mono)">${ch.length?ch.map(c=>`<div style="padding:0 12px;color:#9AA0A6">${esc(c.sel)} {</div>${c.from!==undefined&&c.from!==''?`<div style="padding:0 12px 0 26px;background:rgba(228,105,98,.16);color:#F28B82">-   ${esc(c.p)}: ${esc(c.from)};</div>`:''}${c.on!==false?`<div style="padding:0 12px 0 26px;background:rgba(129,201,149,.16);color:#81C995">+   ${esc(c.p)}: ${esc(c.to)};</div>`:`<div style="padding:0 12px 0 26px;color:#9AA0A6">    /* ${esc(c.p)} disabled */</div>`}<div style="padding:0 12px;color:#9AA0A6">}</div>`).join(''):'<div class="empty">No changes yet. Edit a value in Elements ▸ Styles and it appears here as a diff.</div>'}</div>`;
  $('#chCopy').onclick=()=>copyText(ST.changes.map(c=>`${c.sel} {\n  ${c.p}: ${c.to};\n}`).join('\n'));$('#chRevert').onclick=()=>{RULES.forEach(r=>r.d.forEach(d=>{d.v=d.orig;d.on=true}));ST.changes=[];applyCSS();renderDrawer();if(P.elements.built)renderSide();toast('All CSS changes reverted')}}
 else{body.innerHTML=`<div class="scroll" style="flex:1;font:400 12.5px/1.6 var(--body)"><div class="tb"><label class="ck"><input type="checkbox">Include third-party cookie issues</label><span style="margin-left:auto;color:#9AA0A6">2 issues</span></div>
  <details class="aud" style="padding:0 12px" open><summary><b style="color:#FDD663">▲</b> Mark cross-site cookies as Secure to allow setting them in cross-site contexts</summary><p>Cookies marked with <code>SameSite=None</code> must also be marked <code>Secure</code>. Affected: <code>cart_id</code> on driftwood.coffee. Fix: add the Secure attribute. <a href="#" id="isC">Open in Application ▸ Cookies</a></p></details>
  <details class="aud" style="padding:0 12px"><summary><b style="color:#8AB4F8">ⓘ</b> Deprecated feature used: unload event listeners</summary><p><code>analytics.js</code> registers an <code>unload</code> handler, which blocks the back/forward cache. Use <code>pagehide</code> instead.</p></details></div>`;const ic=$('#isC',body);if(ic)ic.onclick=e=>{e.preventDefault();setPanel('application');AP.view='cookies';renderApp()}}
 placePins()}
function renderCoverage(body){const cov=ST.coverage;body.innerHTML=`<div class="tb"><button class="tbb rec" id="covGo" title="Start instrumenting coverage and reload page">${IC.reload} Start instrumenting coverage and reload</button><span style="color:#9AA0A6">Per function ▾</span></div><div class="scroll" style="flex:1">${cov?`<table class="tbl"><thead><tr><th>URL</th><th>Type</th><th>Total Bytes</th><th>Unused Bytes</th><th style="width:40%">Usage Visualization</th></tr></thead><tbody>${[['vendor.min.js','JS',188000,.64],['app.js','JS',42700,.31],['analytics.js','JS',22500,.83],['app.css','CSS',8100,.42],['cart.js','JS',6400,.12]].map(([u,t,b,un])=>`<tr data-f="${u}" style="cursor:pointer"><td>https://driftwood.coffee/…/${u}</td><td>${t}</td><td class="m">${b.toLocaleString()}</td><td class="m">${Math.round(b*un).toLocaleString()} <span style="color:#9AA0A6">${Math.round(un*100)}%</span></td><td><span style="display:flex;height:11px;width:${30+b/188000*70}%"><b style="flex:${1-un};background:#4FA3F7"></b><b style="flex:${un};background:#E46962"></b></span></td></tr>`).join('')}</tbody></table><div style="padding:8px 12px;color:#9AA0A6;font:400 12.5px var(--body)">161 kB of 268 kB (60%) belongs to code that never ran. Click a row to see used (blue) and unused (red) lines in Sources.</div>`:'<div class="empty">Click the record button to start capturing coverage. Coverage shows which bytes of JS and CSS actually ran.</div>'}</div>`;
 $('#covGo').onclick=()=>{reloadPage();setTimeout(()=>{const mk=(f,frac)=>{const n=SRC.files[f].text().split('\n').length;return Array.from({length:n},(_,i)=>((i*7919)%100)/100>frac)};ST.coverage={'app.js':mk('app.js',.31),'cart.js':mk('cart.js',.12),'app.css':mk('app.css',.42),'vendor.min.js':mk('vendor.min.js',.64)};renderCoverage(body);track('coverage')},900)};
 $$('tr[data-f]',body).forEach(tr=>tr.onclick=()=>{if(SRC.files[tr.dataset.f])SRC.open(tr.dataset.f,1)})}
/* paint flashing & layout shift regions */
new MutationObserver(ms=>{if(!ST.paint)return;const seen=new Set();ms.forEach(m=>{let t=m.type==='characterData'?m.target.parentNode:m.target;if(t&&t.nodeType===1&&!seen.has(t)){seen.add(t);flashBox(t,'flashbox')}})}).observe(BODY,{subtree:true,childList:true,characterData:true,attributes:true});
function flashBox(n,cls){if(!n.isConnected)return;const r=relRect(n);if(!r.w)return;const b=h(`<div class="${cls}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`);$('#pagearea').appendChild(b);setTimeout(()=>b.remove(),380)}
bus.on('reload',()=>{if(ST.shifts)setTimeout(()=>flashBox(PAGE.q('.cards'),'shiftbox'),600);if(ST.paint)setTimeout(()=>flashBox(BODY,'flashbox'),300)});
pageHost.addEventListener('scroll',()=>{if(ST.paint)flashBox(BODY,'flashbox')},{passive:true});
let fpsRaf=0;function fpsMeter(on){cancelAnimationFrame(fpsRaf);$$('.fps').forEach(x=>x.remove());if(!on)return;const box=h('<div class="fps"><div>Frame rate <span id="fpsN">60</span> fps</div><div style="color:#9AA0A6">GPU raster: on · 0 dropped</div><canvas width="112" height="30"></canvas></div>');$('#pagearea').appendChild(box);const cv=$('canvas',box),c=cv.getContext('2d');const hist=[];let last=now();
 const step=()=>{const t=now();const dt=t-last;last=t;const f=Math.min(60,1000/dt);hist.push(f);if(hist.length>56)hist.shift();c.clearRect(0,0,112,30);hist.forEach((v,i)=>{c.fillStyle=v<50?'#F28B82':'#81C995';c.fillRect(i*2,30-v/2,1.5,v/2)});$('#fpsN').textContent=Math.round(hist.slice(-10).reduce((a,b)=>a+b,0)/Math.min(10,hist.length));fpsRaf=requestAnimationFrame(step)};step()}

/* ---------- command menu ---------- */
const CMDS=[...PANELS.map(([id,l])=>['Panel',`Show ${l}`,()=>setPanel(id)]),['Drawer','Show Console drawer',()=>openDrawer('console')],['Drawer','Show Rendering',()=>openDrawer('rendering')],['Drawer','Show Coverage',()=>openDrawer('coverage')],['Drawer','Show Changes',()=>openDrawer('changes')],['Drawer','Show Issues',()=>openDrawer('issues')],
 ['Mobile','Toggle device toolbar',()=>setDevice(!ST.device)],['Screenshot','Capture screenshot',()=>shot('viewport')],['Screenshot','Capture full size screenshot',()=>shot('full size')],['Screenshot','Capture node screenshot',()=>shot('node '+nodeLabel(ST.sel))],
 ['Debugger','Disable JavaScript',()=>{ST.jsDisabled=true;BODY.classList.add('__nojs');toast('JavaScript disabled — the page’s buttons stop working');track('cmd-js')}],['Debugger','Enable JavaScript',()=>{ST.jsDisabled=false;BODY.classList.remove('__nojs');toast('JavaScript enabled')}],
 ['Rendering','Emulate CSS prefers-color-scheme: dark',()=>{ST.schemeEmu='dark';BODY.dataset.theme='dark';toast('prefers-color-scheme: dark')}],['Rendering','Emulate CSS prefers-color-scheme: light',()=>{ST.schemeEmu='light';BODY.dataset.theme='light'}],['Rendering','Show paint flashing rectangles',()=>{ST.paint=true;toast('Paint flashing on')}],['Rendering','Show layout shift regions',()=>{ST.shifts=true;toast('Layout shift regions on')}],['Rendering','Show frames per second (FPS) meter',()=>{ST.fps=true;fpsMeter(true)}],
 ['Network','Go offline',()=>{ST.throttle='offline';syncThrottle();toast('Offline — reload to see it')}],['Network','Go online',()=>{ST.throttle='none';ST.offline=false;syncThrottle();toast('Online')}],['Network','Enable slow 4G throttling',()=>{ST.throttle='slow4g';syncThrottle()}],['Network','Disable network throttling',()=>{ST.throttle='none';syncThrottle()}],
 ['Application','Clear site data',()=>clearSiteData()],['Global','Dock to right',()=>setDock('right')],['Global','Dock to bottom',()=>setDock('bottom')],['Global','Reload page',()=>reloadPage()],['Sources','Pretty print vendor.min.js',()=>{SRC.pretty=true;SRC.open('vendor.min.js')}],['Elements','Select an element in the page to inspect it',()=>setInspect(true)]];
function shot(kind){const f=h('<div style="position:absolute;inset:0;background:#fff;z-index:99;opacity:.8;transition:opacity .5s"></div>');$('#pagearea').appendChild(f);requestAnimationFrame(()=>f.style.opacity=0);setTimeout(()=>f.remove(),520);toast(`Captured ${kind} screenshot — downloads are off in this preview, so no file was saved`);track('screenshot')}
function openCmd(prefix){closeCmd();const b=$('#browser');const m=h(`<div class="cmdk" role="dialog" aria-label="Command menu"><input spellcheck="false" aria-label="Command"><div class="list"></div><div class="foot"><span><b>&gt;</b> run command</span><span><b>!</b> run snippet</span><span><b>@</b> go to symbol</span><span><b>:</b> go to line</span><span><b>?</b> help</span><span>no prefix → open file</span></div></div>`);b.appendChild(m);const inp=$('input',m),list=$('.list',m);inp.value=prefix;let items=[],hi=0;
 const render=()=>{const v=inp.value;let q=v,mode='file';if(v.startsWith('>')){mode='cmd';q=v.slice(1)}else if(v.startsWith('!')){mode='snip';q=v.slice(1)}else if(v.startsWith('@')){mode='sym';q=v.slice(1)}else if(v.startsWith(':')){mode='line';q=v.slice(1)}else if(v.startsWith('?')){mode='help'}
  q=q.trim().toLowerCase();const fz=s=>{if(!q)return true;let i=0;for(const ch of s.toLowerCase()){if(ch===q[i])i++;if(i===q.length)return true}return false};const mark=s=>{if(!q)return esc(s);let i=0,out='';for(const ch of s){if(i<q.length&&ch.toLowerCase()===q[i]){out+=`<b>${esc(ch)}</b>`;i++}else out+=esc(ch)}return out};
  if(mode==='cmd')items=CMDS.filter(c=>fz(c[1])).map(c=>({cat:c[0],l:c[1],act:c[2]}));else if(mode==='snip')items=Object.keys(SNIPPETS).filter(fz).map(s=>({cat:'Snippet',l:s,act:()=>{SRC.nav='snip';runSnippet(s)}}));
  else if(mode==='sym'){const f=SRC.files[SRC.cur]?SRC.cur:'cart.js';items=SRC.files[f].text().split('\n').map((l,i)=>{const m=l.match(/function\s+([\w$]+)|^(?:export\s+)?const\s+([\w$]+)\s*=/);return m?{cat:f,l:(m[1]||m[2])+(m[1]?'()':''),line:i+1}:null}).filter(x=>x&&fz(x.l)).map(x=>({cat:':'+x.line,l:x.l,act:()=>SRC.open(f,x.line)}))}
  else if(mode==='line'){const n=parseInt(q);items=n?[{cat:SRC.cur,l:`Go to line ${n}`,act:()=>SRC.open(SRC.cur,n)}]:[{cat:'',l:'Type a line number, e.g. :11'}]}
  else if(mode==='help')items=[['>','Run command'],['!','Run snippet'],['@','Go to symbol'],[':','Go to line'],['','Open file']].map(([p,l])=>({cat:p||'(none)',l,act:()=>{inp.value=p;render();inp.focus();return'keep'}}));
  else items=Object.keys(SRC.files).filter(fz).map(f=>({cat:SRC.files[f].path.split('/').slice(0,-1).join('/'),l:f,act:()=>SRC.open(f,1)}));
  hi=Math.min(hi,Math.max(0,items.length-1));list.innerHTML=items.map((it,i)=>`<div class="it${i===hi?' hi':''}" data-i="${i}"><small>${esc(it.cat)}</small><span>${mark(it.l)}</span></div>`).join('')||'<div class="it"><small></small><span style="color:#9AA0A6">No results</span></div>'};
 const run=i=>{const it=items[i];if(!it||!it.act)return;const r=it.act();if(r!=='keep'){closeCmd();track('command')}};
 inp.oninput=()=>{hi=0;render()};inp.onkeydown=e=>{e.stopPropagation();if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(items.length-1,hi+1);render()}if(e.key==='ArrowUp'){e.preventDefault();hi=Math.max(0,hi-1);render()}if(e.key==='Enter'){e.preventDefault();run(hi)}if(e.key==='Escape')closeCmd()};
 list.onclick=e=>{const it=e.target.closest('[data-i]');if(it)run(+it.dataset.i)};render();inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);setTimeout(()=>document.addEventListener('mousedown',cmdOut),0);setGuide('cmd')}
function cmdOut(e){if(!e.target.closest('.cmdk'))closeCmd();else document.addEventListener('mousedown',cmdOut,{once:true})}
function closeCmd(){const was=$$('.cmdk').length;$$('.cmdk').forEach(x=>x.remove());document.removeEventListener('mousedown',cmdOut);if(was&&GKEY==='cmd')setGuide(!ST.open?'closed':ST.device?'device':ST.panel)}

/* ---------- keyboard ---------- */
$('#browser').addEventListener('keydown',e=>{const mod=e.ctrlKey||e.metaKey;const k=e.key.toLowerCase();const inField=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable;
 if(e.key==='F12'){e.preventDefault();toggleDevtools();return}
 if(DBG.state&&['F8','F10','F11','F9'].includes(e.key)){e.preventDefault();DBG.cmd(e.key==='F8'?'resume':e.key==='F10'?'over':e.key==='F11'?(e.shiftKey?'out':'into'):'into');return}
 if(mod&&e.shiftKey&&k==='c'){e.preventDefault();if(!ST.open)toggleDevtools(true);setInspect(!ST.inspecting);return}
 if(mod&&e.shiftKey&&k==='m'){e.preventDefault();if(!ST.open)toggleDevtools(true);setDevice(!ST.device);return}
 if(mod&&e.shiftKey&&k==='p'){e.preventDefault();if(!ST.open)toggleDevtools(true);openCmd('>');return}
 if(mod&&e.shiftKey&&k==='j'){e.preventDefault();setPanel('console');setTimeout(()=>{const t=$('.panel.on textarea');if(t)t.focus()},30);return}
 if(mod&&e.shiftKey&&k==='i'){e.preventDefault();toggleDevtools();return}
 if(mod&&e.shiftKey&&k==='d'){e.preventDefault();setDock(ST.dock==='bottom'?'right':'bottom');return}
 if(mod&&!e.shiftKey&&k==='p'){e.preventDefault();openCmd('');return}
 if(mod&&(e.key==='['||e.key===']')){e.preventDefault();const i=PANELS.findIndex(p=>p[0]===ST.panel);setPanel(PANELS[(i+(e.key===']'?1:PANELS.length-1))%PANELS.length][0]);return}
 if(mod&&k==='e'&&ST.panel==='performance'&&P.performance.built){e.preventDefault();e.shiftKey?startRec(true):PF.rec?stopRec():startRec(false);return}
 if(e.key==='Escape'&&!inField){if($('.cmdk')){closeCmd();return}if(ST.inspecting){setInspect(false);return}if(ST.open){e.preventDefault();toggleDrawer()}}});

/* ================= guide rail ================= */
const OSK={os:store.get('os',/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'mac':'win')};
const K=(w,m)=>OSK.os==='mac'?m:w;
const kc=arr=>arr.map(x=>`<span class="kbd">${esc(x)}</span>`).join('');
const GUIDE={
 closed:{c:'var(--content)',k:'DevTools closed',t:'Press F12',l:'The page is on its own now. Open the tools with <b>F12</b>, <b>Ctrl+Shift+I</b> (⌘⌥I on a Mac) or by right-clicking anything and choosing <b>Inspect</b>.',map:[],tasks:[['open-devtools','Press <code>F12</code> with the browser focused, or click the keycap above it.']],keys:[[['F12'],['F12'],'Toggle DevTools'],[['Ctrl','Shift','I'],['⌘','⌥','I'],'Open DevTools'],[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open straight to Console'],[['Ctrl','Shift','C'],['⌘','⇧','C'],'Open in inspect mode']],facts:['Edge uses the same tools. Safari needs Settings ▸ Advanced ▸ Show features for web developers first.']},
 elements:{c:'var(--content)',k:'Panel 1 of 8',t:'Elements',l:'The live DOM and every CSS rule that touches it. This is the page as it is right now, after JavaScript ran, which is not always the HTML the server sent.',
  map:[['el-tree','DOM tree','Click to select. Double-click text or an attribute value to edit it. Right-click for Hide, Delete, Copy selector and DOM breakpoints.'],['el-crumbs','Breadcrumbs','The path from <code>html</code> to the selected node. Click a step to jump up the tree.'],['el-sub','Sidebar tabs','Styles, Computed (final values), Layout (grid and flex overlays), Event Listeners, Accessibility.'],['el-filter','Filter · :hov · .cls','Search declarations, force :hover or :focus, toggle classes on the node.'],['el-styles','Styles','Matching rules, most specific first. Struck-through lines lost the cascade. Checkboxes toggle a declaration; click a value to edit it.'],['tab-elements','Inspect arrow','Beside the tabs. Click it, then click anything in the page (Ctrl+Shift+C).']],
  tasks:[['inspect-pick','Click the inspect arrow (or press <code>Ctrl+Shift+C</code>), then click a card in the page.'],['hover-node','Hover rows in the tree. The page paints content, padding, border and margin.'],['toggle-decl','Untick <code>border-radius</code> under <code>.btn.cta</code>. The pill turns square.'],['edit-value','Click a value such as <code>44px</code> on <code>.hero-title</code> and change it. ↑/↓ nudge numbers.'],['edit-dom','Double-click the headline text in the tree and rewrite it.'],['grid-overlay','Click the <code>grid</code> badge next to <code>section.cards</code>.'],['force-hover','Open <code>:hov</code> and tick <code>:hover</code> to reveal the hover rule.'],['hide-node','Select a node in the tree and press <code>H</code> to hide it. Press it again to bring it back.']],
  keys:[[['Ctrl','Shift','C'],['⌘','⇧','C'],'Inspect mode'],[['H'],['H'],'Hide node'],[['Del'],['⌫'],'Delete node'],[['Ctrl','Z'],['⌘','Z'],'Undo in the tree'],[['↑','↓'],['↑','↓'],'Move / nudge a value'],[['Alt','click ▸'],['⌥','click ▸'],'Expand all descendants']],
  facts:['The selected node is <code>$0</code> in the Console; earlier picks are <code>$1</code>–<code>$4</code>.','Purple flashes in the tree mean the page’s JavaScript just changed that node. Click <b>Add</b> in the page to see one.','Edits live until reload. The Changes drawer turns them into a diff you can copy.']},
 console:{c:'var(--border)',k:'Panel 2 of 8',t:'Console',l:'A JavaScript prompt that runs inside the page, plus every log, warning and error the page produces. Everything typed here runs for real against the demo shop.',
  map:[['con-tb','Toolbar','Clear, JavaScript context, live expression (eye), filter, log levels, settings.'],['con-log','Messages','Newest at the bottom. The link on the right opens the line in Sources. Repeats collapse into a counter.'],['con-prompt','Prompt','Enter runs, Shift+Enter adds a line, ↑ recalls history, Tab accepts the grey autocomplete. The line below previews the result before you run it.'],['con-levels','Log levels','Verbose is hidden by default. The page’s debug messages live there.'],['con-chips','Examples','Click one to put it in the prompt.']],
  tasks:[['console-eval','Run <code>document.title</code>.'],['console-$0','Run <code>$0</code>, then hover the result: it highlights in the page. Click it to jump to Elements.'],['console-table','Run <code>console.table(orders)</code>.'],['console-fetch','Run <code>await fetch(\'/api/cart\', {method:\'POST\'})</code> and watch the 500 land here and in Network.'],['live-expr','Click the eye icon, add <code>cart.items.length</code>, then click <b>Add</b> in the page.'],['console-levels','Open <b>Default levels</b> and turn on <b>Verbose</b>.'],['console-filter','Type <code>-analytics</code> or <code>/404|500/</code> into the filter.']],
  keys:[[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open Console'],[['Ctrl','L'],['⌘','K'],'Clear'],[['↑','↓'],['↑','↓'],'History'],[['Tab'],['Tab'],'Accept autocomplete'],[['Shift','Enter'],['⇧','Enter'],'New line']],
  facts:['<code>$(sel)</code> is querySelector, <code>$$(sel)</code> returns an array, <code>$x(path)</code> runs XPath.','Top-level <code>await</code> works here; it doesn’t in a normal script.','<code>copy(value)</code> puts anything on your clipboard. <code>getEventListeners(node)</code> lists its handlers.']},
 sources:{c:'var(--margin)',k:'Panel 3 of 8',t:'Sources',l:'Pause JavaScript on any line and walk through it with every variable in view. Also where you edit, pretty-print and save scripts.',
  map:[['src-nav','Navigator','Page lists what the site loaded. Workspace and Overrides persist edits; Snippets are scripts you keep.'],['src-editor','Editor','Click a line number for a breakpoint (blue). Right-click it for conditional (orange) or logpoint (pink).'],['src-controls','Step controls','Resume F8 · Step over F10 · Step into F11 · Step out Shift+F11 · Deactivate all.'],['src-watch','Watch','Expressions re-evaluated at every pause.'],['src-bps','Breakpoints','Every breakpoint, including DOM breakpoints set from Elements. Untick to disable.'],['src-scope','Scope','Local variables at the paused line, then closure and global.'],['src-stack','Call Stack','How execution got here. The top frame is where you’re paused.']],
  tasks:[['set-bp','In <code>cart.js</code> click line <b>11</b>. Add a coffee in the page, then click <b>Checkout</b>.'],['step','While paused, press Step over (F10) and watch <code>total</code> grow in Scope.'],['cond-bp','Right-click line <b>14</b> ▸ Add conditional breakpoint ▸ <code>total &gt; 50</code>.'],['logpoint','Right-click line <b>12</b> ▸ Add logpoint ▸ <code>\'line\', line</code>. It logs without pausing.'],['watch','Add a watch expression such as <code>item.qty * 2</code> with the + button.'],['pretty-print','Open <code>vendor.min.js</code> and press <code>{ }</code>.'],['dom-bp','In Elements right-click <code>aside.cart-bar</code> ▸ subtree modifications, then click Add in the page.'],['snippet','Open the Snippets tab and run <code>list-cookies.js</code>.']],
  keys:[[['F8'],['F8'],'Resume'],[['F10'],['F10'],'Step over'],[['F11'],['F11'],'Step into'],[['Shift','F11'],['⇧','F11'],'Step out'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all files']],
  facts:['Compare Sources ▸ <code>(index)</code> with the Elements tree: the server sent an empty <code>section.cards</code>; JavaScript filled it.','A <code>debugger;</code> statement pauses exactly like a breakpoint.','Source maps let you debug the original TypeScript or SCSS instead of the bundle.']},
 network:{c:'var(--act)',k:'Panel 4 of 8',t:'Network',l:'Every request the page makes: what it asked for, what came back, how big it was and where the time went.',
  map:[['net-tb','Toolbar','Record, clear, Preserve log, Disable cache, throttling, reload.'],['net-filter','Filters','Text filter (try <code>-analytics</code>, <code>status-code:404</code>, <code>method:POST</code>) and type chips.'],['net-overview','Overview','Every request on one timeline. Blue line = DOMContentLoaded, red line = Load.'],['net-table','Requests','Status, type, initiator (click it to open the code), size, time. Right-click for copy and block options.'],['net-waterfall','Waterfall','Grey queued · teal DNS · orange connect · purple TLS · green waiting (TTFB) · blue download.'],['net-status','Summary','Request count, bytes over the wire vs uncompressed, and load milestones.']],
  tasks:[['reload','Press <b>Reload</b> in the toolbar (or ⟳ in the browser bar) and watch the waterfall build.'],['throttle','Set throttling to <b>Slow 4G</b>, then reload.'],['net-detail','Click a request to open Headers, Preview, Response and Timing.'],['net-type','Click the <b>JS</b> chip, then <b>Img</b>.'],['block','Right-click <code>app.css</code> ▸ Block request URL, then reload. Unblock it the same way.'],['copy-curl','Right-click any request ▸ Copy as cURL.'],['preserve-log','Tick <b>Preserve log</b> so reloads keep the old requests.'],['cache','Untick <b>Disable cache</b> and reload twice to see <code>(memory cache)</code>.']],
  keys:[[['Ctrl','Shift','R'],['⌘','⇧','R'],'Hard reload'],[['Ctrl','F'],['⌘','F'],'Search request bodies'],[['Shift','hover'],['⇧','hover'],'Show initiators / dependents']],
  facts:['Hold <b>Shift</b> over a row: green rows started it, red rows were started by it.','Right-click the browser’s reload button (with DevTools open) for <b>Empty cache and hard reload</b>.','Time vs Waiting (TTFB): a long green bar means the server is slow, not the network.']},
 performance:{c:'var(--hot)',k:'Panel 5 of 8',t:'Performance',l:'Records what the main thread did, millisecond by millisecond, so you can see why a click felt slow or a page took long to paint.',
  map:[['perf-tb','Toolbar','Record (Ctrl+E), record-and-reload, clear, CPU and network throttling.'],['perf-vitals','Live metrics','LCP, CLS and INP measured on this page as you interact.'],['perf-overview','Overview','CPU activity by category with screenshots. Drag across it to zoom to a range.'],['perf-flame','Flame chart','Each bar is a function call; bars below were called by bars above. Width is time.'],['perf-bottom','Summary tabs','Summary, Bottom-up (heaviest functions), Call tree, Event log.']],
  tasks:[['perf-record','Press <b>Record</b>, click <b>Theme</b> and <b>Add</b> in the page, then Stop.'],['perf-zoom','Scroll over the flame chart to zoom; drag to pan (W A S D work too).'],['long-task','Click a task with a red corner. That is a Long Task over 50 ms.'],['cpu-throttle','Set CPU to <b>6× slowdown</b> and record again. Every bar stretches.'],['bottom-up','Open <b>Bottom-up</b> to rank activities by self time.']],
  keys:[[['Ctrl','E'],['⌘','E'],'Start / stop recording'],[['Ctrl','Shift','E'],['⌘','⇧','E'],'Record and reload'],[['W','S'],['W','S'],'Zoom in / out'],[['A','D'],['A','D'],'Pan']],
  facts:['Colors: <b style="color:#F2C94C">scripting</b>, <b style="color:#A67CF7">rendering</b>, <b style="color:#7CC57C">painting</b>, <b style="color:#6FA8DC">loading</b>, grey system.','INP is good at ≤ 200 ms, LCP at ≤ 2.5 s, CLS at ≤ 0.1.','Clicking <b>Theme</b> costs mostly <i>Recalculate Style</i>: one attribute change restyles the whole page.']},
 memory:{c:'#B388FF',k:'Panel 6 of 8',t:'Memory',l:'What is on the JavaScript heap and who is keeping it alive. The tool for tabs that get heavier the longer they stay open.',
  map:[['mem-tb','Toolbar','Take snapshot, clear, force garbage collection, view (Summary / Comparison / Containment).'],['mem-side','Profiles','Each snapshot with its heap size.'],['mem-filter','Class filter','Narrow by constructor. <code>Detached</code> finds DOM removed from the page but still referenced.'],['mem-ret','Retainers','The chain of references keeping the selected object alive.']],
  tasks:[['heap-snapshot','Take a heap snapshot.'],['mem-compare','Click <b>Subscribe</b> in the page 5 times, take a second snapshot, then open Comparison.'],['mem-detached','Type <code>Detached</code> in the class filter.'],['retainers','Click the Detached row. The retainer is <code>toastCache</code> in app.js.'],['gc','Press the trash can to collect garbage. The leak survives.']],
  keys:[],facts:['Shallow size is the object itself; retained size is what would be freed if it went away.','A growing <b># Delta</b> between identical actions is the classic leak signature.','Allocations on timeline: bars that stay blue were never freed.']},
 application:{c:'var(--padding)',k:'Panel 7 of 8',t:'Application',l:'Everything the site stores in your browser: storage, cookies, databases, caches, the service worker and the install manifest.',
  map:[['app-tree','Sidebar','Grouped into Application (manifest, service worker, storage), Storage (per type) and Background services.'],['app-view','Viewer','Tables are editable. Double-click a value, press Enter, and the page reacts.']],
  tasks:[['app-ls','Open <b>Local storage</b> ▸ driftwood.coffee.'],['storage-edit','Double-click the value of <code>theme</code>, type <code>dark</code>, press Enter.'],['cookie-inspect','Open <b>Cookies</b> and click <code>cart_id</code> to read its warning.'],['sw-offline','Service workers ▸ tick <b>Offline</b>, then reload the page.'],['clear-site-data','Storage ▸ <b>Clear site data</b>. The cart empties.'],['bfcache','Back/forward cache ▸ Test.']],
  keys:[],facts:['<b>HttpOnly</b> cookies never appear in <code>document.cookie</code>. Check in the Console.','localStorage is synchronous and readable by any script on the origin: fine for preferences, wrong for tokens.','Remember to untick <b>Offline</b> when you’re done.']},
 lighthouse:{c:'#81C995',k:'Panel 8 of 8',t:'Lighthouse',l:'An automated audit that loads the page under throttling and scores it on performance, accessibility, best practices and SEO, with the fix for each failure.',
  map:[['lh-form','Settings','Navigation (full load), Timespan (a period of interaction) or Snapshot (current state); mobile or desktop; categories.'],['lh-gauges','Scores','0–49 red, 50–89 orange, 90–100 green.'],['lh-metrics','Metrics','Lab measurements that feed the Performance score.'],['lh-audits','Audits','Each failure expands into the cause and the fix.']],
  tasks:[['lighthouse','Click <b>Analyze page load</b>.'],['a11y-100','Fix the contrast: Elements ▸ <code>.btn.cta</code> ▸ background <code>#B3401F</code>. Run again for Accessibility 100.'],['lh-desktop','Switch Device to <b>Desktop</b> and compare.']],
  keys:[],facts:['Lighthouse is lab data from one simulated run. Real-user field data (CrUX) can differ.','Scores wobble a few points between runs; compare trends, not single numbers.']},
 device:{c:'var(--margin)',k:'Device toolbar',t:'Device mode',l:'Shrinks the viewport to a phone or tablet and emulates its pixel ratio and touch input, so you can check responsive layouts without a device.',
  map:[['dev-bar','Device toolbar','Preset, width × height, zoom, pixel ratio, throttling, rotate.'],['dev-mq','Media-query bars','One bar per breakpoint in the site’s CSS. Click one to jump to it.'],['dev-frame','Viewport','The emulated screen. In Responsive, drag the handle on the right edge to resize.']],
  tasks:[['device','Toggle the toolbar with the phone icon or <code>Ctrl+Shift+M</code>.'],['dev-preset','Pick <b>iPhone SE</b>. The cards stack into one column.'],['dev-rotate','Rotate to landscape with ⟲.'],['dev-mq','Click a media-query bar.'],['dev-drag','Choose Responsive and drag the handle.']],
  keys:[[['Ctrl','Shift','M'],['⌘','⇧','M'],'Toggle device toolbar']],facts:['Emulation is not a real phone: it doesn’t reproduce mobile GPUs or real network radios. Use remote debugging for that.','Add CPU throttling to feel how slow a mid-range phone is.']},
 drawer:{c:'var(--border)',k:'Drawer',t:'The drawer',l:'A second pane under any panel (Esc). It holds the Console plus tools that don’t need a whole panel.',
  map:[['drw-tabs','Drawer tabs','Console, Rendering, Coverage, Changes, Issues. More under ⋮ ▸ More tools.'],['drw-body','Tool','Rendering overlays, coverage report, CSS diff or the issue list.']],
  tasks:[['drawer','Press <code>Esc</code> in any panel to open the drawer.'],['rendering-paint','Rendering ▸ Paint flashing, then click Add in the page.'],['rendering-fps','Rendering ▸ Frame Rendering Stats.'],['rendering-vision','Rendering ▸ emulate Protanopia and check the orange button.'],['coverage','Coverage ▸ start instrumenting and reload.'],['drawer-changes','Edit a style, then open Changes.']],
  keys:[[['Esc'],['Esc'],'Toggle drawer']],facts:['Coverage rows open in Sources with used (blue) and unused (red) lines marked.']},
 cmd:{c:'var(--act)',k:'Command menu',t:'Command menu',l:'Every DevTools action by name. Faster than hunting for a menu, and many tools only live here.',
  map:[],tasks:[['command','Run a command: try <code>screenshot</code>, <code>dark</code> or <code>offline</code>.']],
  keys:[[['Ctrl','Shift','P'],['⌘','⇧','P'],'Run command'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all sources']],facts:['Prefixes: <b>&gt;</b> command, <b>!</b> snippet, <b>@</b> symbol, <b>:</b> line, <b>?</b> help.']}};
const DONE=new Set(store.get('done',[]));let GKEY='elements';let showPins=store.get('pins',true);
bus.on('task',t=>{if(!DONE.has(t)){DONE.add(t);store.set('done',[...DONE]);renderGuide()}});
function setGuide(k){GKEY=k;renderGuide();placePins()}
function renderGuide(){const g=GUIDE[GKEY]||GUIDE.elements;const G=$('#guide');const done=g.tasks.filter(t=>DONE.has(t[0])).length;
 G.style.setProperty('--c',g.c);G.innerHTML=`<header><div class="gk">${esc(g.k)}</div><h2>${esc(g.t)}</h2><p class="gl">${g.l}</p>${g.tasks.length>1?`<div class="progress" aria-label="${done} of ${g.tasks.length} tried">${g.tasks.map(t=>`<i class="${DONE.has(t[0])?'on':''}"></i>`).join('')}</div>`:''}</header>
 ${g.map.length?`<section><h3>What you’re looking at <button id="pinTog" aria-pressed="${showPins}">${showPins?'Hide':'Show'} labels</button></h3><ol class="map">${g.map.map((m,i)=>`<li data-hs="${m[0]}"><span class="n">${i+1}</span><span><b>${m[1]}.</b> ${m[2]}</span></li>`).join('')}</ol></section>`:''}
 <section><h3>Try it · ${done}/${g.tasks.length}</h3><ul class="tasks">${g.tasks.map(t=>`<li class="${DONE.has(t[0])?'done':''}"><i></i><span>${t[1]}</span></li>`).join('')}</ul></section>
 ${g.keys.length?`<section><h3>Shortcuts</h3><div class="gkeys">${g.keys.map(k=>`<div><span>${esc(k[2])}</span><span class="ks">${kc(K(k[0],k[1]))}</span></div>`).join('')}</div></section>`:''}
 <section><h3>Good to know</h3><ul class="facts">${g.facts.map(f=>`<li>${f}</li>`).join('')}</ul></section>`;
 const pt=$('#pinTog');if(pt)pt.onclick=()=>{showPins=!showPins;store.set('pins',showPins);renderGuide();placePins()};
 $$('.map li',G).forEach(li=>{li.onmouseenter=()=>spot(li.dataset.hs);li.onmouseleave=()=>spot(null)})}
function hsTarget(k){return $$(`#browser [data-hs="${k}"]`).find(el=>el.offsetParent!==null&&el.getBoundingClientRect().width>0)}
function spot(k,ms){$$('#browser .spot').forEach(s=>s.remove());if(!k)return;const t=hsTarget(k);if(!t)return;const b=$('#browser').getBoundingClientRect(),r=t.getBoundingClientRect();const x=Math.max(0,r.left-b.left),y=Math.max(0,r.top-b.top),w=Math.min(b.width-x,r.width),hh=Math.min(b.height-y,r.height);
 const s=h(`<div class="spot" style="left:${x-3}px;top:${y-3}px;width:${w+6}px;height:${hh+6}px"></div>`);$('#browser').appendChild(s);if(ms)setTimeout(()=>s.remove(),ms)}
let pinT;function placePins(){clearTimeout(pinT);pinT=setTimeout(()=>{$$('#browser .pin').forEach(p=>p.remove());if(!showPins)return;const g=GUIDE[GKEY];if(!g)return;const b=$('#browser').getBoundingClientRect();
 g.map.forEach((m,i)=>{const t=hsTarget(m[0]);if(!t)return;const r=t.getBoundingClientRect();let x=r.right-b.left-14,y=r.top-b.top+12;if(r.width<60)x=r.left-b.left+r.width/2;if(x<8||y<8||x>b.width-8||y>b.height-8)return;const p=h(`<div class="pin" style="left:${x}px;top:${y}px">${i+1}</div>`);$('#browser').appendChild(p)})},60)}

/* ---------- key strip ---------- */
function updateKeys(){const ks=[[K(['F12'],['F12']),'Toggle DevTools',()=>toggleDevtools(),()=>ST.open],[K(['Ctrl','Shift','C'],['⌘','⇧','C']),'Inspect',()=>{if(!ST.open)toggleDevtools(true);setInspect(!ST.inspecting)},()=>ST.inspecting],[K(['Ctrl','Shift','M'],['⌘','⇧','M']),'Device',()=>{if(!ST.open)toggleDevtools(true);setDevice(!ST.device)},()=>ST.device],[['Esc'],'Drawer',()=>{if(!ST.open)toggleDevtools(true);toggleDrawer()},()=>ST.drawer],[K(['Ctrl','Shift','P'],['⌘','⇧','P']),'Command menu',()=>{if(!ST.open)toggleDevtools(true);openCmd('>')}],[K(['Ctrl','P'],['⌘','P']),'Open file',()=>{if(!ST.open)toggleDevtools(true);openCmd('')}],[['⟳'],'Reload page',()=>reloadPage()],[['⇄'],'Dock side',()=>{if(!ST.open)toggleDevtools(true);setDock(ST.dock==='bottom'?'right':'bottom')}]];
 const box=$('#keys');box.innerHTML='';ks.forEach(([k,l,act,st])=>{const b=h(`<button class="keybtn" ${st?`aria-pressed="${!!st()}"`:''}>${kc(k)}<span>${esc(l)}</span></button>`);b.onclick=()=>{act();updateKeys()};box.appendChild(b)})}
bus.on('task',()=>updateKeys());

/* ================= page sections ================= */
const CHAPS=[[0,'Intro','#6FA8DC'],[3.75,'Open it','#8AB4F8'],[7.5,'Elements','#6FA8DC'],[13.125,'Styles','#93C47D'],[16.875,'Console','#FFE599'],[22.5,'Sources','#F6B26B'],[28.125,'Network','#3FD8F2'],[33.75,'Performance','#FF4F8B'],[39.375,'Memory','#B388FF'],[43.125,'Application','#93C47D'],[46.875,'Device mode','#F6B26B'],[50.625,'Lighthouse','#81C995'],[54.375,'Power tools','#FF4F8B'],[58.125,'Outro','#FFE599']];
(()=>{const v=$('#vid'),ol=$('#chap');ol.innerHTML=CHAPS.map(([t,l,c],i)=>`<li><button data-t="${t}" style="--c:${c}"><time>${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}</time><i></i>${l}</button></li>`).join('');
 ol.onclick=e=>{const b=e.target.closest('button');if(!b)return;v.currentTime=+b.dataset.t+0.01;v.play().catch(()=>{})};
 v.addEventListener('timeupdate',()=>{let cur=0;CHAPS.forEach((c,i)=>{if(v.currentTime>=c[0])cur=i});$$('button',ol).forEach((b,i)=>b.classList.toggle('on',i===cur))})})();
const SC=[['Open & move around','#6FA8DC',[[['F12'],['F12'],'Toggle DevTools'],[['Ctrl','Shift','I'],['⌘','⌥','I'],'Open DevTools'],[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open Console'],[['Ctrl','Shift','C'],['⌘','⇧','C'],'Inspect element'],[['Ctrl','Shift','P'],['⌘','⇧','P'],'Command menu'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','['],['⌘','['],'Previous panel'],[['Ctrl',']'],['⌘',']'],'Next panel'],[['Ctrl','Shift','D'],['⌘','⇧','D'],'Switch dock side'],[['Esc'],['Esc'],'Toggle drawer']]],
 ['Elements','#93C47D',[[['H'],['H'],'Hide selected node'],[['Del'],['⌫'],'Delete node'],[['F2'],['F2'],'Edit as HTML'],[['Ctrl','Z'],['⌘','Z'],'Undo'],[['Alt','click'],['⌥','click'],'Expand all children'],[['Ctrl','F'],['⌘','F'],'Search the DOM'],[['↑'],['↑'],'Value +1 (Shift ×10, Alt ×0.1)'],[['Shift','click'],['⇧','click'],'Color swatch: cycle formats']]],
 ['Console','#FFE599',[[['Ctrl','L'],['⌘','K'],'Clear console'],[['Tab'],['Tab'],'Accept suggestion'],[['Shift','Enter'],['⇧','Enter'],'New line'],[['↑','↓'],['↑','↓'],'Command history'],[['Ctrl','U'],['⌘','U'],'Clear the prompt']]],
 ['Sources & debugger','#F6B26B',[[['F8'],['F8'],'Pause / resume'],[['F10'],['F10'],'Step over'],[['F11'],['F11'],'Step into'],[['Shift','F11'],['⇧','F11'],'Step out'],[['Ctrl','B'],['⌘','B'],'Toggle breakpoint'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all files'],[['Ctrl','O'],['⌘','O'],'Go to file'],[['Ctrl','Shift','O'],['⌘','⇧','O'],'Go to symbol'],[['Ctrl','Enter'],['⌘','Enter'],'Run snippet']]],
 ['Network & reload','#8AB4F8',[[['Ctrl','Shift','R'],['⌘','⇧','R'],'Hard reload'],[['Ctrl','R'],['⌘','R'],'Reload'],[['Ctrl','E'],['⌘','E'],'Start / stop network log'],[['Shift','hover'],['⇧','hover'],'Initiator / dependents']]],
 ['Performance','#FF5C8A',[[['Ctrl','E'],['⌘','E'],'Start / stop recording'],[['Ctrl','Shift','E'],['⌘','⇧','E'],'Record and reload'],[['W','S'],['W','S'],'Zoom in / out'],[['A','D'],['A','D'],'Pan left / right']]],
 ['Device mode','#B388FF',[[['Ctrl','Shift','M'],['⌘','⇧','M'],'Toggle device toolbar'],[['Ctrl','Shift','P'],['⌘','⇧','P'],'…then “screenshot” for full-page captures']]]];
function renderShortcuts(){$('#kgrid').innerHTML=SC.map(([t,c,rows])=>`<div class="kgroup" style="--c:${c}"><h3>${t}</h3>${rows.map(r=>`<div class="krow"><span>${esc(r[2])}</span><span class="ks">${kc(K(r[0],r[1]))}</span></div>`).join('')}</div>`).join('')}
$$('.oskey button').forEach(b=>b.onclick=()=>{OSK.os=b.dataset.os;store.set('os',OSK.os);$$('.oskey button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderShortcuts();renderGuide();updateKeys()});
$$('.oskey button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.os===OSK.os));
const TRIAGE=[['“The button looks wrong.”','Elements ▸ Styles','#6FA8DC','See which rule wins and edit it live.',()=>{setPanel('elements');select(PAGE.q('.btn.cta'));EL.sub='styles';renderSide()},'el-styles'],
 ['“Something is undefined” or a red error appeared.','Console','#FFE599','Errors with the file and line, plus a prompt to poke at values.',()=>setPanel('console'),'con-log'],
 ['“The total comes out wrong.”','Sources ▸ breakpoint','#F6B26B','Pause inside calcTotal and watch the numbers change.',()=>{SRC.open('cart.js',11);if(!SRC.bps.has('cart.js:11'))toggleBp('cart.js',11)},'src-editor'],
 ['“An API call fails” or “the page loads slowly.”','Network','#8AB4F8','Status codes, payloads and the timing waterfall.',()=>{setPanel('network');reloadPage()},'net-waterfall'],
 ['“Clicking feels laggy.”','Performance','#FF5C8A','Record the click and look for long tasks.',()=>setPanel('performance'),'perf-tb'],
 ['“The tab gets heavier the longer it’s open.”','Memory','#B388FF','Compare heap snapshots; hunt detached nodes.',()=>setPanel('memory'),'mem-tb'],
 ['“I’m logged out” or “old data after a deploy.”','Application','#93C47D','Cookies, storage and the service worker cache.',()=>{setPanel('application');AP.view='cookies';renderApp()},'app-view'],
 ['“It breaks on phones.”','Device mode','#F6B26B','Emulate a phone viewport and touch.',()=>{if(!ST.device)setDevice(true)},'dev-bar'],
 ['“Our SEO or accessibility score is low.”','Lighthouse','#81C995','An audit with the fix for each failure.',()=>setPanel('lighthouse'),'lh-form'],
 ['“We ship too much CSS and JS.”','Coverage','#FF5C8A','Bytes that never ran, per file and per line.',()=>openDrawer('coverage'),'drw-body'],
 ['“It has to work offline.”','Application ▸ Service workers','#93C47D','Toggle offline and watch requests fail.',()=>{setPanel('application');AP.view='sw';renderApp()},'app-view'],
 ['“Which request started this one?”','Network ▸ Initiator','#8AB4F8','Hold Shift over a row, or open its Initiator tab.',()=>setPanel('network'),'net-table']];
$('#tgrid').innerHTML=TRIAGE.map((t,i)=>`<button class="tcard" data-i="${i}" style="--c:${t[2]}"><q>${t[0].replace(/[“”]/g,'')}</q><span>→ ${esc(t[1])}</span><small>${esc(t[3])}</small></button>`).join('');
$('#tgrid').onclick=e=>{const b=e.target.closest('.tcard');if(!b)return;const t=TRIAGE[+b.dataset.i];if(!ST.open)toggleDevtools(true);document.getElementById('sim').scrollIntoView({behavior:'smooth'});t[4]();setTimeout(()=>{spot(t[5],2600)},650)};

/* ================= boot ================= */
applyCSS();wirePage();renderCart();
window.addEventListener('load',()=>{});
reloadPage(true);updateKeys();setPanel('elements');renderShortcuts();
$('#browser').addEventListener('scroll',placePins,true);new ResizeObserver(()=>placePins()).observe($('#browser'));
```

### 13/16 · `F12-Field-Guide-source/site/src/sources.js`
<!-- casebook-file {"path": "F12-Field-Guide-source/site/src/sources.js", "lines": 262, "final_newline": true, "sha256": "742545b913b0d7d7e8a76b28c21fb84e041d78ab48c5b3667bd4209984523395", "original_sha256": "742545b913b0d7d7e8a76b28c21fb84e041d78ab48c5b3667bd4209984523395"} -->
```js
/* ================= Sources + debugger ================= */
const CART_JS=`// cart.js — cart state, totals and checkout
import { api } from './api.js';
import { products, round, toast } from './app.js';

export const cart = { items: [] };

/** Sum the cart and apply the 10% bulk discount */
export function calcTotal(items) {
  let total = 0;
  for (const item of items) {
    const line = item.price * item.qty;
    total += line;
  }
  if (total > 100) total *= 0.9;
  return round(total);
}

export function addToCart(id) {
  const p = products.find(x => x.id === id);
  const it = cart.items.find(i => i.id === id);
  if (it) it.qty++;
  else cart.items.push({ id, name: p.name, price: p.price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart.items));
  console.debug(\`added \${p.name} → cart has \${cart.items.length} line(s)\`);
  renderCart();
}

export function renderCart() {
  const n = cart.items.reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll('.count').forEach(c => c.textContent = n);
  document.querySelector('.total').textContent = '$' + calcTotal(cart.items).toFixed(2);
}

export async function checkout() {
  const total = calcTotal(cart.items);
  const res = await api.post('/cart', { total });
  if (!res.ok) toast(\`Checkout failed (\${res.status}). Try again.\`);
  return res;
}

document.querySelectorAll('.btn.add').forEach(b =>
  b.addEventListener('click', () => addToCart(b.closest('.card').dataset.id)));
document.querySelector('.btn.checkout')
  .addEventListener('click', checkout);`;
const APP_JS=`// app.js — Driftwood storefront
import { cart, renderCart } from './cart.js';
import './vendor.min.js';

export const VERSION = '2.4.1';
export const products = [];

export function round(n) {
  return Math.round(n * 100) / 100;
}

export function toast(msg, isError = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' err' : '');
  t.textContent = msg;
  document.querySelector('.toasts').append(t);
  setTimeout(() => {
    t.remove();
    toastCache.push(t);   // ⚠ keeps a reference: detached DOM leak
  }, 2600);
}

export const toastCache = [];

function restoreCart() {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  saved.forEach(({ id, qty }) => {
    const p = products.find(x => x.id === id);
    if (p) cart.items.push({ ...p, qty });
  });
  renderCart();
}

async function loadProducts() {
  const res = await fetch('/api/products?limit=12');
  products.push(...(await res.json()));
  restoreCart();
}

loadProducts().then(() =>
  console.info(\`Driftwood v\${VERSION} · \${products.length} products loaded\`));

// Smooth-scroll the hero call to action
const cta = document.querySelector('.btn.cta');
cta.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
});

// Theme toggle, persisted in localStorage
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
});

document.querySelector('.cart-pill').addEventListener('click', () =>
  document.querySelector('.cart-bar').scrollIntoView({ block: 'center' }));

// Newsletter
const subscribe = document.querySelector('.btn.subscribe');
subscribe.addEventListener('click', () =>
  toast('Subscribed ✓ See you on roast day.'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`;
const VENDOR_MIN=`!function(e,t){"object"==typeof exports?module.exports=t():e.tiny=t()}(this,function(){"use strict";var e={},t=function(n){return n&&n.__esModule?n:{default:n}};function r(n,o){for(var i=0;i<o.length;i++){var a=o[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(n,a.key,a)}}var o=function(){function n(o){this.el=o,this.handlers={}}return n.prototype.on=function(n,o){return(this.handlers[n]=this.handlers[n]||[]).push(o),this},n.prototype.emit=function(n,o){(this.handlers[n]||[]).forEach(function(i){return i(o)})},n}();return e.Emitter=o,e.interop=t,e.define=r,e});`;
const VENDOR_PRETTY=`!function(e, t) {
    "object" == typeof exports ? module.exports = t() : e.tiny = t()
}(this, function() {
    "use strict";
    var e = {}
      , t = function(n) {
        return n && n.__esModule ? n : {
            default: n
        }
    };
    function r(n, o) {
        for (var i = 0; i < o.length; i++) {
            var a = o[i];
            a.enumerable = a.enumerable || !1,
            a.configurable = !0,
            "value" in a && (a.writable = !0),
            Object.defineProperty(n, a.key, a)
        }
    }
    var o = function() {
        function n(o) {
            this.el = o,
            this.handlers = {}
        }
        return n.prototype.on = function(n, o) {
            return (this.handlers[n] = this.handlers[n] || []).push(o),
            this
        }
        ,
        n.prototype.emit = function(n, o) {
            (this.handlers[n] || []).forEach(function(i) {
                return i(o)
            })
        }
        ,
        n
    }();
    return e.Emitter = o,
    e.interop = t,
    e.define = r,
    e
});`;
const INDEX_HTML=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Driftwood — Specialty Coffee</title>
  <link rel="stylesheet" href="/css/app.css">
  <link rel="manifest" href="/manifest.json">
  <meta property="og:image" content="/img/og-image.png">
  <script src="/js/vendor.min.js" defer></script>
  <script src="/js/app.js" type="module"></script>
  <script src="/js/cart.js" type="module"></script>
  <script src="/js/analytics.js" async></script>
</head>
<body class="shop" data-theme="light">
  <nav class="nav">…</nav>
  <header class="hero">…</header>
  <section class="cards" id="shop"></section>  <!-- filled by app.js -->
  <aside class="cart-bar">…</aside>
  <section class="news">…</section>
  <div class="toasts" aria-live="polite"></div>
</body>
</html>`;
const SNIPPETS={'list-cookies.js':`// Snippet: print every readable cookie as a table\nconsole.table(document.cookie.split('; ').map(c => {\n  const [name, ...v] = c.split('=');\n  return { name, value: v.join('=') };\n}));`,
 'outline-everything.js':`// Snippet: outline every element to debug layout\n$$('body *').forEach(el => el.style.outline = '1px solid rgb(255 0 128 / 50%)');\n'outlined ' + $$('body *').length + ' elements';`};
const SRC={files:{'(index)':{kind:'html',text:()=>INDEX_HTML,path:'driftwood.coffee/(index)'},'app.css':{kind:'css',text:()=>cssText(),path:'driftwood.coffee/css/app.css'},'app.js':{kind:'js',text:()=>APP_JS,path:'driftwood.coffee/js/app.js'},'cart.js':{kind:'js',text:()=>CART_JS,path:'driftwood.coffee/js/cart.js'},'vendor.min.js':{kind:'js',text:()=>SRC.pretty?VENDOR_PRETTY:VENDOR_MIN,path:'driftwood.coffee/js/vendor.min.js'}},
 cur:'cart.js',openTabs:['app.js','cart.js'],bps:new Map(),nav:'page',pretty:false,active:true,watch:['total > 50','cart.items.length'],editing:null,
 open(f,line){if(SNIPPETS[f]){SRC.cur=f}else if(!SRC.files[f])return;SRC.cur=f;if(!SRC.openTabs.includes(f))SRC.openTabs.push(f);setPanel('sources');SRC.render();if(line)setTimeout(()=>{const r=$(`#code .ln[data-l="${line}"]`);if(r){const c=$('#code');c.scrollTop=r.offsetTop-c.clientHeight/3;r.style.transition='none';r.style.background='rgba(255,229,153,.25)';setTimeout(()=>{r.style.transition='background 1.2s';r.style.background=''},60)}},30);track('open-source')}};
function hlJS(s){return esc(s).replace(/(\/\/.*$|\/\*\*?.*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|\b(import|from|export|function|let|const|var|for|of|if|else|return|async|await|new|typeof|this|true|false|null|undefined|in)\b|\b(\d+(?:\.\d+)?)\b/g,(m,c,s1,k,n)=>c?`<span style="color:var(--com);font-style:italic">${c}</span>`:s1?`<span style="color:var(--str)">${s1}</span>`:k?`<span style="color:var(--kw)">${k}</span>`:`<span style="color:var(--num)">${n}</span>`)}
function hlCSS(s){return esc(s).replace(/(\/\*.*?\*\/)|^(\s*)([^:{}]+?)(\s*\{)$|^(\s*)([\w-]+)(:)(.*)$/,(m,c,a,sel,b,i2,p,col,v)=>c?`<span style="color:var(--com)">${c}</span>`:sel?`${a}<span style="color:#E3E3E3">${sel}</span>${b}`:`${i2}<span style="color:var(--pn)">${p}</span>${col}<span style="color:#F29766">${v}</span>`)}
function hlHTML(s){return esc(s).replace(/(&lt;!--.*?--&gt;)|(&lt;\/?)([\w!-]+)|([\w-]+)=(&quot;[^&]*&quot;|"[^"]*")/g,(m,c,lt,tag,an,av)=>c?`<span style="color:var(--com)">${c}</span>`:tag?`${lt}<span style="color:var(--tag)">${tag}</span>`:`<span style="color:var(--an)">${an}</span>=<span style="color:var(--av)">${av}</span>`)}

function buildSources(p){p.innerHTML=`<div class="split" style="flex:1;min-height:0">
 <div class="nav" data-hs="src-nav"><div class="subt" id="srcNavT">${[['page','Page'],['ws','Workspace'],['ov','Overrides'],['snip','Snippets']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='page'}">${l}</button>`).join('')}</div><div class="ftree scroll" id="ftree" style="flex:1"></div></div>
 <div class="ed" data-hs="src-editor"><div class="edtabs" id="edtabs"></div><div class="code scroll" id="code" tabindex="0"></div><div class="tb" id="edfoot" style="border-top:1px solid var(--dtl);border-bottom:0"></div></div>
 <div class="dbg" data-hs="src-debugger"><div class="dbgb" data-hs="src-controls"><button id="dResume" title="Resume (F8)">${IC.resume}</button><button id="dOver" title="Step over (F10)">${IC.over}</button><button id="dInto" title="Step into (F11)">${IC.into}</button><button id="dOut" title="Step out (Shift+F11)">${IC.out}</button><button id="dStep" title="Step (F9)">${IC.step}</button><span style="width:1px;height:16px;background:var(--dtl);margin:0 4px"></span><button id="dDeact" title="Deactivate breakpoints">${IC.deact}</button></div>
  <div id="dbgBody" class="scroll" style="flex:1"></div></div></div>`;
 $('#srcNavT').onclick=e=>{const b=e.target.closest('button');if(!b)return;SRC.nav=b.dataset.k;$$('#srcNavT button').forEach(x=>x.setAttribute('aria-selected',x===b));renderNav()};
 $('#ftree').onclick=e=>{const b=e.target.closest('[data-f]');if(b)SRC.open(b.dataset.f);const n=e.target.closest('[data-new]');if(n){const name=`snippet-${Object.keys(SNIPPETS).length+1}.js`;SNIPPETS[name]='// New snippet\n';SRC.open(name);renderNav()}};
 $('#dResume').onclick=()=>DBG.cmd('resume');$('#dOver').onclick=()=>DBG.cmd('over');$('#dInto').onclick=()=>DBG.cmd('into');$('#dOut').onclick=()=>DBG.cmd('out');$('#dStep').onclick=()=>DBG.cmd('into');
 $('#dDeact').onclick=()=>{SRC.active=!SRC.active;$('#dDeact').style.color=SRC.active?'':'#8AB4F8';toast(SRC.active?'Breakpoints active':'Breakpoints deactivated — nothing will pause');SRC.render()};
 const code=$('#code');
 code.addEventListener('click',e=>{const g=e.target.closest('.g');if(!g)return;const ln=+g.parentNode.dataset.l;toggleBp(SRC.cur,ln)});
 code.addEventListener('contextmenu',e=>{const g=e.target.closest('.g');if(!g)return;e.preventDefault();const ln=+g.parentNode.dataset.l;const k=SRC.cur+':'+ln;const bp=SRC.bps.get(k);if(SRC.files[SRC.cur]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}
  openMenu(e.clientX,e.clientY,bp?[{label:'Edit breakpoint…',act:()=>{SRC.editing={line:ln,type:bp.type==='log'?'log':'cond'};SRC.render()}},{label:bp.enabled?'Disable breakpoint':'Enable breakpoint',act:()=>{bp.enabled=!bp.enabled;SRC.render()}},{label:'Remove breakpoint',act:()=>{SRC.bps.delete(k);SRC.render()}}]:
   [{label:'Add breakpoint',act:()=>toggleBp(SRC.cur,ln)},{label:'Add conditional breakpoint…',act:()=>{SRC.editing={line:ln,type:'cond'};SRC.render()}},{label:'Add logpoint…',act:()=>{SRC.editing={line:ln,type:'log'};SRC.render()}},'-',{label:'Never pause here',act:()=>{SRC.bps.set(k,{file:SRC.cur,line:ln,type:'cond',expr:'false',enabled:true});SRC.render()}}])});
 SRC.render()}
function toggleBp(f,ln){if(SRC.files[f]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}const k=f+':'+ln;if(SRC.bps.has(k))SRC.bps.delete(k);else{SRC.bps.set(k,{file:f,line:ln,type:'bp',enabled:true});track('set-bp')}SRC.render()}
function renderNav(){const t=$('#ftree');if(!t)return;const it=(d,label,f,ic)=>`<button style="--d:${d}" ${f?`data-f="${f}"`:''} class="${f&&f===SRC.cur?'on':''}">${ic}${label}</button>`;const fi=c=>`<i class="fi" style="background:${c}"></i>`;
 if(SRC.nav==='page')t.innerHTML=it(0,'▾ top','',fi('#9AA0A6'))+it(1,'▾ driftwood.coffee','',fi('#9AA0A6'))+it(2,'▾ css','',fi('#C9A15A'))+it(3,'app.css','app.css',fi('#6FA8DC'))+it(2,'▾ js','',fi('#C9A15A'))+it(3,'app.js','app.js',fi('#E8C547'))+it(3,'cart.js','cart.js',fi('#E8C547'))+it(3,'vendor.min.js','vendor.min.js',fi('#E8C547'))+it(2,'▸ img','',fi('#C9A15A'))+it(2,'(index)','(index)',fi('#9AA0A6'))+it(1,'▸ fonts.gstatic.com','',fi('#9AA0A6'));
 else if(SRC.nav==='snip')t.innerHTML=Object.keys(SNIPPETS).map(n=>it(0,n,n,fi('#E8C547'))).join('')+`<button style="--d:0;color:#8AB4F8" data-new="1">+ New snippet</button>`;
 else if(SRC.nav==='ov')t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Overrides let you edit a response (HTML, CSS, JS, even headers) and keep the edit across reloads. Pick a local folder and DevTools serves your copy instead of the network one.<br><br><button class="btns">Select folder for overrides</button><br><br><span style="color:#9AA0A6">Network ▸ right-click a request ▸ <b>Override content</b> does the same.</span></div>`;
 else t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Workspace maps a folder on disk to the site so edits made in DevTools save straight to your source files.<br><br><button class="btns">+ Add folder</button></div>`}
SRC.render=function(){if(!P.sources.built)return;renderNav();const f=SRC.cur;const isSnip=!!SNIPPETS[f];
 $('#edtabs').innerHTML=SRC.openTabs.concat(isSnip&&!SRC.openTabs.includes(f)?[f]:[]).map(n=>`<span class="${n===f?'on':''}" data-t="${esc(n)}">${esc(n)}${n==='vendor.min.js'&&SRC.pretty?':formatted':''} <b data-x="${esc(n)}" style="cursor:pointer;opacity:.6">×</b></span>`).join('');
 $$('#edtabs [data-t]').forEach(s=>s.onclick=e=>{if(e.target.dataset.x){SRC.openTabs=SRC.openTabs.filter(x=>x!==e.target.dataset.x);if(SRC.cur===e.target.dataset.x)SRC.cur=SRC.openTabs[0]||'cart.js';SRC.render();return}SRC.cur=s.dataset.t;SRC.render()});
 const code=$('#code');
 if(isSnip){code.innerHTML=`<textarea id="snipTa" spellcheck="false" style="width:100%;height:100%;min-height:260px;background:transparent;border:0;outline:none;color:#E3E3E3;font:400 12.5px/20px var(--mono);padding:4px 12px;resize:none"></textarea>`;const ta=$('#snipTa');ta.value=SNIPPETS[f];ta.oninput=()=>SNIPPETS[f]=ta.value;ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runSnippet(f)}};
  $('#edfoot').innerHTML=`<button class="btnp" id="runSnip">${IC.play} Run</button><span style="color:#9AA0A6">Ctrl+Enter · output goes to the Console</span>`;$('#runSnip').onclick=()=>runSnippet(f);renderDbg();return}
 const F=SRC.files[f];const lines=F.text().split('\n');const paused=DBG.state&&DBG.state.file===f?DBG.state:null;const cov=ST.coverage&&ST.coverage[f];
 code.innerHTML=lines.map((l,i)=>{const n=i+1;const bp=SRC.bps.get(f+':'+n);const cls=bp?`bp${bp.type==='cond'?' cond':bp.type==='log'?' log':''}${!bp.enabled||!SRC.active?' dis':''}`:'';
  const inl=paused&&paused.inline&&paused.inline[n]?`<span class="inl">${esc(paused.inline[n])}</span>`:'';const cv=cov?`<i class="cov" style="background:${cov[i]?'#4FA3F7':'#E46962'}"></i>`:'';
  const hl=F.kind==='js'?hlJS(l):F.kind==='css'?hlCSS(l):hlHTML(l);
  let edit='';if(SRC.editing&&SRC.editing.line===n){const ex=bp&&bp.expr||'';edit=`<div class="bpedit ${SRC.editing.type==='log'?'log':''}">${SRC.editing.type==='log'?'Logpoint — log a message when this line runs (e.g. <code>\'total\', total</code>)':'Conditional breakpoint — pause only when this is true'}<input id="bpInput" value="${esc(ex)}" placeholder="${SRC.editing.type==='log'?"'total is', total":'total > 100'}"></div>`}
  return `<div class="ln${paused&&paused.line===n?' cur':''}" data-l="${n}"><span class="g ${cls}">${n}</span>${cv}<span class="t">${hl||' '}${inl}</span></div>${edit}`}).join('');
 const bi=$('#bpInput');if(bi){bi.focus();bi.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=bi.value.trim();const k=f+':'+SRC.editing.line;if(v)SRC.bps.set(k,{file:f,line:SRC.editing.line,type:SRC.editing.type,expr:v,enabled:true});track(SRC.editing.type==='log'?'logpoint':'cond-bp');SRC.editing=null;SRC.render()}if(e.key==='Escape'){SRC.editing=null;SRC.render()}};bi.onblur=()=>{if(SRC.editing){SRC.editing=null;SRC.render()}}}
 const minified=f==='vendor.min.js';$('#edfoot').innerHTML=`<button class="tbb" id="pp" title="Pretty print" aria-pressed="${SRC.pretty}" style="font:600 13px var(--mono)">{ }</button><span style="color:#9AA0A6">${minified&&!SRC.pretty?'Minified file — click { } to pretty-print':F.kind==='js'?'Click a line number to add a breakpoint · right-click for conditional / logpoint':F.kind==='css'?(ST.changes.length?'Modified by your Styles edits':'Edits made in the Styles pane show up here'):'The HTML the server sent, before JavaScript ran'}</span>${cov?'<span style="margin-left:auto;color:#E46962">■ unused</span><span style="color:#4FA3F7">■ used</span>':''}`;
 $('#pp').onclick=()=>{if(f!=='vendor.min.js'){toast('Only minified files need pretty-printing');return}SRC.pretty=!SRC.pretty;SRC.render();track('pretty-print')};
 if(paused){const r=$(`#code .ln[data-l="${paused.line}"]`);if(r){const c=$('#code');if(r.offsetTop<c.scrollTop||r.offsetTop>c.scrollTop+c.clientHeight-40)c.scrollTop=r.offsetTop-c.clientHeight/3}}
 renderDbg()};
function runSnippet(f){CON.add({type:'input',args:[`// ${f}`]});try{const r=EVAL_OK?runCode(SNIPPETS[f]):undefined;if(!EVAL_OK)throw new EvalError('eval is blocked here');CON.add({type:'result',args:[r]})}catch(e){CON.add({type:'error',args:[`Uncaught ${e.name}: ${e.message}`],src:f})}ST.drawer=true;ST.drawerTab='console';renderDrawer();track('snippet')}
function evalIn(expr,scope){try{if(!EVAL_OK){if(expr in scope)return scope[expr];const m=expr.match(/^([\w$.]+)\s*(>|<|>=|<=|===|==)\s*([\d.]+)$/);if(m){const a=m[1].split('.').reduce((o,k)=>o&&o[k],scope);return eval2(a,m[2],+m[3])}return undefined}
 const ks=Object.keys(scope);return new Function(...ks,'cart','$0',`return (${expr})`)(...ks.map(k=>scope[k]),cart,ST.sel)}catch(e){return e}}
function eval2(a,op,b){return op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:op==='<='?a<=b:a==b}
function renderDbg(){const b=$('#dbgBody');if(!b)return;const s=DBG.state;
 const bps=[...SRC.bps.values()];const scope=s?s.scope:null;
 b.innerHTML=(s?`<div class="pausemsg">⏸ ${esc(s.reason)}</div>`:'')+
 `<div class="pane" data-hs="src-watch"><h4>Watch <span style="float:right;color:#8AB4F8" id="addWatch">+</span></h4><div class="pb">${SRC.watch.map((w,i)=>{const v=s?evalIn(w,{...s.scope}):undefined;return`<div><span style="color:#E3E3E3">${esc(w)}</span>: ${s?(v instanceof Error?`<span class="muted">&lt;not available&gt;</span>`:prevShort(v)):'<span class="muted">&lt;not available&gt;</span>'} <b data-wx="${i}" style="float:right;cursor:pointer;color:#9AA0A6">×</b></div>`}).join('')}<div id="watchIn"></div></div></div>
 <div class="pane" data-hs="src-bps"><h4>Breakpoints</h4><div class="pb">${bps.length?bps.map(bp=>`<div style="color:${bp.type==='cond'?'#FCAD70':bp.type==='log'?'#FF7FC4':'#E3E3E3'}"><label class="ck"><input type="checkbox" data-bpk="${bp.file}:${bp.line}" ${bp.enabled?'checked':''}>${bp.file}:${bp.line}</label> <span class="muted" style="font-style:normal!important">${bp.expr?esc(bp.expr):esc((SRC.files[bp.file].text().split('\n')[bp.line-1]||'').trim().slice(0,28))}</span></div>`).join(''):'<div class="muted">No breakpoints</div>'}
  ${[...EL.domBps].filter(([n,t])=>t.size).map(([n,t])=>`<div style="color:#C792EA">DOM · ${esc(nodeLabel(n))} · ${[...t].join(', ')}</div>`).join('')}</div></div>
 <div class="pane" data-hs="src-scope"><h4>Scope</h4><div class="pb">${scope?`<div style="color:#9AA0A6">▾ Local</div>${Object.entries(scope).map(([k,v])=>`<div style="padding-left:22px"><span style="color:#E3A7FF">${esc(k)}</span>: ${prevShort(v)}</div>`).join('')}<div style="color:#9AA0A6">▸ Module <span class="muted" style="font-style:normal!important">cart, api, products</span></div><div style="color:#9AA0A6">▸ Global <span style="float:right" class="muted">Window</span></div>`:'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane" data-hs="src-stack"><h4>Call Stack</h4><div class="pb">${s?s.stack.map((fr,i)=>`<div style="${i===0?'background:var(--dsel)':''}"><span style="color:#E3E3E3">${i===0?'▸ ':'&nbsp; '}${esc(fr[0])}</span><span style="float:right;color:#9AA0A6">${esc(fr[1])}</span></div>`).join('')+'<div class="muted">— async: click —</div>':'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane"><h4>XHR/fetch Breakpoints</h4><div class="pb"><div class="muted">Pause when a URL contains…</div></div></div>
 <div class="pane"><h4>Event Listener Breakpoints</h4><div class="pb"><div class="muted">▸ Mouse · Keyboard · Timer · XHR…</div></div></div>`;
 ['dResume','dOver','dInto','dOut','dStep'].forEach(id=>$('#'+id).disabled=!s);
 $$('[data-bpk]',b).forEach(c=>c.onchange=()=>{SRC.bps.get(c.dataset.bpk).enabled=c.checked;SRC.render()});
 $$('[data-wx]',b).forEach(x=>x.onclick=()=>{SRC.watch.splice(+x.dataset.wx,1);renderDbg()});
 $('#addWatch',b).onclick=e=>{e.stopPropagation();const w=$('#watchIn',b);w.innerHTML='<input class="inp" style="width:100%" placeholder="Expression, e.g. item.qty">';const i=$('input',w);i.focus();i.onkeydown=ev=>{ev.stopPropagation();if(ev.key==='Enter'&&i.value.trim()){SRC.watch.push(i.value.trim());track('watch');renderDbg()}if(ev.key==='Escape')renderDbg()}}}

/* ---------- execution trace + stepping ---------- */
const DBG={state:null,resolve:null,trace:null,i:0,
 build(c){const items=c.items.map(x=>({...x}));const T=[];const fr=(fn,ln)=>[fn,'cart.js:'+ln];
  const S=(line,depth,scope,inline)=>T.push({file:'cart.js',line,depth,scope,inline,stack:depth?[fr('calcTotal',line),fr('checkout',35),['(anonymous)','cart.js:44']]:[fr('checkout',line),['(anonymous)','cart.js:44']]});
  S(35,0,{cart:c,total:undefined},{});let total=0;S(9,1,{items,total:undefined},{8:`items = Array(${items.length})`});
  for(const item of items){S(10,1,{items,total,item},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});S(11,1,{items,total,item,line:undefined},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});const line=item.price*item.qty;S(12,1,{items,total,item,line},{9:`total = ${total}`,11:`line = ${line}`});total+=line}
  S(14,1,{items,total},{9:`total = ${total}`});if(total>100)total*=0.9;S(15,1,{items,total},{14:`total = ${round(total)}`});const res=round(total);S(36,0,{cart:c,total:res},{35:`total = ${res}`});this.result=res;return T},
 async run(c){this.trace=this.build(c);this.i=-1;return new Promise(res=>{this.resolve=res;this.advance(t=>this.hitBp(t))})},
 hitBp(step){const bp=SRC.bps.get(step.file+':'+step.line);if(!bp||!bp.enabled||!SRC.active)return false;if(bp.type==='log'){const v=evalIn(`[${bp.expr}]`,step.scope);withSrc(`cart.js:${step.line}`,()=>pageConsole.log(...(Array.isArray(v)?v:[v])));track('logpoint-hit');return false}if(bp.type==='cond'){const v=evalIn(bp.expr,step.scope);return v===true||(v&&!(v instanceof Error))}return true},
 advance(stop){while(++this.i<this.trace.length){const st=this.trace[this.i];const isStop=stop(st);if(isStop){const bp=SRC.bps.get(st.file+':'+st.line);this.pause(st,bp&&bp.enabled&&SRC.active&&bp.type!=='log'?'Paused on breakpoint':'Debugger paused');return}}
  this.finish()},
 pause(st,reason){this.state={...st,reason};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur=st.file;if(!SRC.openTabs.includes(st.file))SRC.openTabs.push(st.file);SRC.render();showPauseBar(true);track('paused')},
 finish(){this.state=null;showPauseBar(false);SRC.render();const r=this.resolve;this.resolve=null;if(r)r(this.result)},
 cmd(k){if(!this.state)return;if(this.state.dom){this.state=null;showPauseBar(false);SRC.render();return}const d=this.state.depth;this.state=null;
  const f={resume:st=>this.hitBp(st),over:st=>st.depth<=d||this.hitBp(st),into:()=>true,out:st=>st.depth<d||this.hitBp(st)}[k];
  if(k!=='resume')track('step');this.advance(f)},
 pauseDom({node,type}){if(this.state)return;this.state={file:'cart.js',line:30,depth:0,dom:true,scope:{n:cart.items.reduce((a,i)=>a+i.qty,0)},inline:{},reason:`Paused on ${type}: ${nodeLabel(node)}`,stack:[['renderCart','cart.js:30'],['addToCart','cart.js:25'],['(anonymous)','cart.js:42']]};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur='cart.js';SRC.render();showPauseBar(true);track('dom-bp-hit')}};
function showPauseBar(on){$$('.pausebar,.pausedim').forEach(x=>x.remove());if(!on)return;const pa=$('#pagearea');pa.appendChild(h('<div class="pausedim"></div>'));const bar=h(`<div class="pausebar">Paused in debugger <button title="Resume (F8)">${IC.resume}</button><button title="Step over (F10)">${IC.over}</button></div>`);const [r,o]=$$('button',bar);r.onclick=()=>DBG.cmd('resume');o.onclick=()=>DBG.cmd('over');pa.appendChild(bar)}
```

### 14/16 · `F12-Field-Guide-source/smoke.mjs`
<!-- casebook-file {"path": "F12-Field-Guide-source/smoke.mjs", "lines": 54, "final_newline": true, "sha256": "0a53da8c7ab9979925e48cb4e44844785e5e97634dcc050f3bc95444c95b2c43", "original_sha256": "0a53da8c7ab9979925e48cb4e44844785e5e97634dcc050f3bc95444c95b2c43"} -->
```js
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
pg.on('pageerror', e => errs.push('PAGEERR ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await pg.goto('file:///home/claude/f12/site/index.html');
await pg.waitForTimeout(1200);
const shot = async n => pg.locator('#sim').screenshot({ path: `/home/claude/f12/samples/s_${n}.png` });
const step = async (name, fn) => { try { await fn(); } catch (e) { errs.push(`STEP ${name}: ${e.message.split('\n')[0]}`); } };
const inPage = sel => pg.locator('#pageHost').locator(sel); // playwright pierces open shadow roots

await step('elements hover', async () => { await pg.hover('#tree .tr:nth-child(8)'); await pg.waitForTimeout(150); });
await shot('elements');
await step('toggle decl', async () => { await pg.locator('#styles input[type=checkbox]').nth(2).click(); });
await step('inspect', async () => { await pg.click('#inspectBtn'); await inPage('.card').first().hover(); await pg.waitForTimeout(100); await inPage('.card').first().click(); });
await step('computed', async () => { await pg.click('#elSub [data-k=computed]'); await pg.click('#elSub [data-k=layout]'); await pg.click('#elSub [data-k=listeners]'); await pg.click('#elSub [data-k=a11y]'); await pg.click('#elSub [data-k=styles]'); });
await step('add to cart', async () => { await inPage('.btn.add').first().click(); await inPage('.btn.add').nth(2).click(); await inPage('.btn.add').nth(2).click(); });
await step('console', async () => {
  await pg.click('.ptab[data-p=console]');
  const ta = pg.locator('.panel.on textarea');
  for (const c of ["document.title", "$0", "$$('.card').length", "console.table(orders)", "await fetch('/api/cart', {method:'POST'})", "let q = 5", "q * 2", "cart.items", "nope.x"]) { await ta.fill(c); await ta.press('Enter'); await pg.waitForTimeout(120); }
  await pg.waitForTimeout(500);
});
await shot('console');
await step('sources', async () => {
  await pg.click('.ptab[data-p=sources]');
  await pg.click('#code .ln[data-l="11"] .g');
  await inPage('.btn.checkout').click();
  await pg.waitForTimeout(300);
  await pg.click('#dOver'); await pg.click('#dOver');
});
await shot('sources');
await step("resume", async () => { for (let i = 0; i < 8; i++) { if (await pg.locator("#dResume").isEnabled()) await pg.click("#dResume"); await pg.waitForTimeout(60);} });
await step('network', async () => { await pg.click('.ptab[data-p=network]'); await pg.click('#nReload'); await pg.waitForTimeout(1500); await pg.evaluate(()=>document.querySelector('#nRows .nr').click()); await pg.click('#nDet [data-t=timing]'); });
await shot('network');
await step('perf', async () => { await pg.click('.ptab[data-p=performance]'); await pg.click('#pfRec'); await pg.waitForTimeout(300); await pg.click('#browser .ptab[data-p=performance]'); await inPage('.theme-toggle').click(); await inPage('.btn.add').first().click(); await pg.waitForTimeout(600); await pg.click('#pfStop'); await pg.waitForTimeout(1000); });
await shot('perf');
await step('perf tabs', async () => { await pg.click('.pbottom [data-k=bottomup]'); await pg.click('.pbottom [data-k=calltree]'); await pg.click('.pbottom [data-k=log]'); });
await step('memory', async () => { await pg.click('.ptab[data-p=memory]'); await pg.click('#mGo'); await pg.waitForTimeout(1500); for (let i = 0; i < 3; i++) await inPage('.btn.subscribe').click(); await pg.waitForTimeout(2800); await pg.click('#mRec'); await pg.waitForTimeout(1600); await pg.fill('#mFilter', 'Detached'); await pg.locator('#mMain tr[data-k]').first().click(); });
await shot('memory');
await step('app', async () => { await pg.click('.ptab[data-p=application]'); for (const v of ['ss', 'idb', 'cookies', 'cache', 'sw', 'manifest', 'storage', 'bfcache', 'ls']) await pg.click(`#atree [data-v=${v}]`); });
await step('lighthouse', async () => { await pg.click('.ptab[data-p=lighthouse]'); await pg.click('#lhGo'); await pg.waitForTimeout(3600); });
await shot('lighthouse');
await step('device', async () => { await pg.click('#deviceBtn'); await pg.selectOption('#devSel', 'iPhone SE'); await pg.waitForTimeout(200); });
await shot('device');
await step('drawer', async () => { await pg.click('#deviceBtn'); await pg.click('.ptab[data-p=elements]'); await pg.click('#tree'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(100); for (const t of ['rendering', 'coverage', 'changes', 'issues', 'console']) await pg.click(`#drawer [data-k=${t}]`); });
await step('cmd', async () => { await pg.click('#kebab'); await pg.click('.menu button:has-text("Run command")'); await pg.keyboard.type('dark'); await pg.keyboard.press('Enter'); });
await shot('drawer');
const info = await pg.evaluate(() => ({ con: CON.msgs.map(m => m.type + ':' + (m.args || []).map(a => typeof a === 'string' ? a : typeof a).join(' ')).slice(-20), done: [...DONE], net: NET.entries.length }));
console.log(JSON.stringify(info, null, 1));
await pg.screenshot({ path: '/home/claude/f12/samples/s_full.png', fullPage: true });
console.log(errs.join('\n') || 'NO ERRORS');
await b.close();
```

### 15/16 · `F12-Field-Guide-source/video.html`
<!-- casebook-file {"path": "F12-Field-Guide-source/video.html", "lines": 822, "final_newline": true, "sha256": "6fbfeb93e6c92ba6821b1f09baec360900e3e4a7b49645e4033acbecef1e9e31", "original_sha256": "6fbfeb93e6c92ba6821b1f09baec360900e3e4a7b49645e4033acbecef1e9e31"} -->
```html
<!doctype html>
<html><head><meta charset="utf-8"><title>F12 in 60 Seconds</title>
<style>
@font-face{font-family:Brico;src:url(fonts/bricolage-grotesque-latin-800-normal.woff2);font-weight:800}
@font-face{font-family:Brico;src:url(fonts/bricolage-grotesque-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Brico;src:url(fonts/bricolage-grotesque-latin-400-normal.woff2);font-weight:400}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-latin-400-normal.woff2);font-weight:400}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-latin-500-normal.woff2);font-weight:500}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:JBM;src:url(fonts/jetbrains-mono-latin-400-normal.woff2);font-weight:400}
@font-face{font-family:JBM;src:url(fonts/jetbrains-mono-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:JBM;src:url(fonts/jetbrains-mono-latin-700-normal.woff2);font-weight:700}
:root{--bg:#070A12;--ink:#EAF0FA;--mut:#8791A8;--blue:#6FA8DC;--green:#93C47D;--yellow:#FFE599;--orange:#F6B26B;--pink:#FF4F8B;--cyan:#3FD8F2;--acc:#6FA8DC;
--dt:#1F2023;--dt2:#28292D;--dt3:#303136;--line:#3A3C42;--dtx:#E3E3E3;--dtm:#9AA0A6;--sel:#0B4A78;--tag:#5DB0D7;--attr:#9BBBDC;--val:#F29766;--str:#F29766;--num:#9980FF;--prop:#35D4C7;--kw:#C792EA}
*{box-sizing:border-box}
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:var(--bg);color:var(--ink);font-family:Plex,'DejaVu Sans',sans-serif}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(1200px 800px at 30% 45%,#101A33 0%,#070A12 70%)}
#grid{position:absolute;inset:-80px;background-image:linear-gradient(rgba(111,168,220,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(111,168,220,.07) 1px,transparent 1px);background-size:40px 40px}
#glow{position:absolute;width:1400px;height:1400px;left:-200px;top:-300px;border-radius:50%;background:radial-gradient(circle,var(--acc) 0%,transparent 60%);opacity:.10;mix-blend-mode:screen}
#water{position:absolute;top:760px;left:0;white-space:nowrap;font:800 330px/1 Brico;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.06);letter-spacing:-.02em}
#fx{position:absolute;inset:0;pointer-events:none}
.scene{position:absolute;inset:0;display:none}
#stage{position:absolute;left:56px;top:122px;width:1140px;height:808px}
.si{position:absolute;inset:0;transform-origin:50% 50%}
/* HUD */
#hud-top{position:absolute;left:56px;right:56px;top:34px;height:60px;display:flex;gap:6px;align-items:flex-end}
.seg{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;gap:7px}
.seg b{font:600 13px/1 JBM;letter-spacing:.08em;color:#56607A;white-space:nowrap;overflow:hidden}
.seg i{display:block;height:5px;background:#1A2236;border-radius:3px;overflow:hidden;position:relative}
.seg i u{position:absolute;inset:0;transform-origin:left;background:var(--c,#6FA8DC);transform:scaleX(0)}
.seg.on b{color:var(--c)}
.seg.done b{color:#8A94AB}
#hud-bot{position:absolute;left:0;right:0;bottom:0;height:62px;background:linear-gradient(90deg,#0C1222,#0A0F1C);border-top:1px solid #1C2640;display:flex;align-items:center;overflow:hidden}
#tc{flex:none;width:250px;padding-left:56px;font:700 22px/1 JBM;color:var(--acc);letter-spacing:.02em}
#tc small{display:block;font:600 11px/1.4 JBM;color:#5E6983;letter-spacing:.12em;margin-top:4px}
#tick-wrap{flex:1;overflow:hidden;position:relative;height:100%;mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
#tick{position:absolute;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;font:500 19px/1 Plex;color:#B8C2D6}
#tick span{padding:0 26px;display:inline-flex;align-items:center;gap:10px}
#tick b{font:700 13px/1 JBM;color:#070A12;background:var(--yellow);padding:4px 7px;border-radius:4px;letter-spacing:.06em}
#tick code{font:600 17px/1 JBM;color:var(--cyan)}
#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;mix-blend-mode:screen}
#bands{position:absolute;inset:0;pointer-events:none}
#bands div{position:absolute;left:0;right:0;mix-blend-mode:screen}
#vign{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)}
#scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.018) 0 1px,transparent 1px 3px)}
/* INFO column */
.info{position:absolute;left:1238px;top:122px;width:630px;height:808px;display:flex;flex-direction:column;gap:18px}
.kick{font:700 16px/1 JBM;letter-spacing:.18em;color:var(--acc);display:flex;gap:12px;align-items:center}
.kick::before{content:"";width:34px;height:3px;background:var(--acc)}
.ttl{margin:0;font:800 104px/.9 Brico;letter-spacing:-.035em;color:#fff;white-space:nowrap;transform-origin:left center;text-shadow:0 0 40px color-mix(in srgb,var(--acc) 55%,transparent)}
.sub{font:500 25px/1.25 Plex;color:#C9D2E3;max-width:610px}
.sub em{font-style:normal;color:var(--acc)}
.keys{display:flex;flex-wrap:wrap;gap:10px 18px}
.combo{display:flex;align-items:center;gap:6px}
.combo em{font:700 18px JBM;color:#58627A;font-style:normal}
.combo small{font:500 16px/1 Plex;color:#95A0B8;margin-left:6px}
.kc{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:44px;padding:0 11px;border-radius:9px;background:linear-gradient(#2A3350,#1B2238);border:1px solid #3D4868;box-shadow:0 4px 0 #0E1322,0 6px 14px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.12);font:700 18px/1 JBM;color:#fff}
.bul{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:13px}
.bul li{display:flex;gap:14px;align-items:flex-start;font:500 23px/1.28 Plex;color:#E4EAF5}
.bul li i{flex:none;width:14px;height:14px;margin-top:7px;border:3px solid var(--acc);box-shadow:inset 0 0 0 3px #070A12,inset 0 0 0 9px var(--acc)}
.bul li:nth-child(4n+2) i{border-color:var(--green);box-shadow:inset 0 0 0 3px #070A12,inset 0 0 0 9px var(--green)}
.bul li:nth-child(4n+3) i{border-color:var(--yellow);box-shadow:inset 0 0 0 3px #070A12,inset 0 0 0 9px var(--yellow)}
.bul li:nth-child(4n+4) i{border-color:var(--orange);box-shadow:inset 0 0 0 3px #070A12,inset 0 0 0 9px var(--orange)}
.bul code,.sub code{font:600 .88em JBM;color:var(--cyan);background:rgba(63,216,242,.08);padding:1px 6px;border-radius:5px}
.bul b{color:#fff}
.legend{display:flex;flex-wrap:wrap;gap:8px 16px;font:600 15px/1 JBM;color:#AEB8CC}
.legend span{display:inline-flex;align-items:center;gap:7px}
.legend span::before{content:"";width:16px;height:16px;border-radius:3px;background:var(--c)}
/* browser window */
.win{position:absolute;inset:0;border-radius:14px;overflow:hidden;background:#1B1C1F;box-shadow:0 0 0 1px #34384A,0 40px 90px rgba(0,0,0,.6),0 0 120px color-mix(in srgb,var(--acc) 22%,transparent);display:flex;flex-direction:column}
.bch{flex:none;background:#2B2C30}
.btabs{height:40px;display:flex;align-items:flex-end;gap:2px;padding:0 12px;background:#1E1F22}
.lights{display:flex;gap:8px;margin:0 14px 13px 4px}.lights i{width:13px;height:13px;border-radius:50%;background:#FF5F57}.lights i+i{background:#FEBC2E}.lights i+i+i{background:#28C840}
.btab{height:32px;padding:0 14px;display:flex;align-items:center;gap:9px;font:500 14px Plex;color:#9AA0A6;border-radius:9px 9px 0 0;min-width:180px}
.btab.on{background:#2B2C30;color:#E8EAED}
.btab .fav{width:15px;height:15px;border-radius:4px;background:linear-gradient(135deg,#E4572E,#7A2E1A)}
.btab b{margin-left:auto;font-weight:400;opacity:.6}
.omni{height:44px;display:flex;align-items:center;gap:14px;padding:0 14px;color:#9AA0A6;font:500 18px Plex}
.url{flex:1;height:32px;border-radius:16px;background:#1E1F22;display:flex;align-items:center;gap:10px;padding:0 16px;font:400 15px Plex;color:#E8EAED}
.url s{text-decoration:none;color:#9AA0A6}
.bbody{flex:1;display:flex;min-height:0;position:relative}
.bbody.bottom{flex-direction:column}
.pagebox{position:relative;overflow:hidden;background:#F4EFE8;flex:none}
.dt{flex:1;min-width:0;min-height:0;background:var(--dt);color:var(--dtx);font:400 14px/1.35 Plex;display:flex;flex-direction:column;border-left:1px solid var(--line);position:relative}
.bottom .dt{border-left:0;border-top:1px solid var(--line)}
.dtt{height:36px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-bottom:1px solid var(--line);font:500 14px Plex;color:#BDC1C6}
.dtt .ic{width:38px;display:flex;align-items:center;justify-content:center;border-right:1px solid var(--line)}
.dtt .ic.on svg{stroke:#8AB4F8}
.dtt span{padding:0 13px;display:flex;align-items:center;border-bottom:2px solid transparent;white-space:nowrap}
.dtt span.on{color:#E8EAED;border-bottom-color:#8AB4F8;background:#303134}
.dtt .rt{margin-left:auto;display:flex;align-items:center;gap:14px;padding:0 12px;color:#9AA0A6}
.badge{font:600 12px JBM;padding:2px 7px;border-radius:9px;display:inline-flex;gap:5px;align-items:center}
.badge.err{background:#4E1D1D;color:#F28B82}.badge.warn{background:#4A3C12;color:#FDD663}.badge.iss{background:#1D3350;color:#8AB4F8}
svg.i{width:18px;height:18px;fill:none;stroke:#9AA0A6;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.tb{height:32px;flex:none;display:flex;align-items:center;gap:12px;padding:0 10px;background:var(--dt2);border-bottom:1px solid var(--line);font:400 13px Plex;color:#BDC1C6;white-space:nowrap}
.tb .sep{width:1px;height:18px;background:var(--line)}
.tb .inp{height:22px;border-radius:4px;background:#1B1C1E;border:1px solid #45474C;padding:0 8px;display:flex;align-items:center;color:#9AA0A6;min-width:150px}
.chk{display:inline-flex;align-items:center;gap:6px}
.chk::before{content:"";width:13px;height:13px;border-radius:3px;border:1.5px solid #9AA0A6}
.chk.y::before{background:#8AB4F8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2l2.3 2.3 4.7-5' stroke='%23202124' stroke-width='1.8' fill='none'/%3E%3C/svg%3E") center/100%;border-color:#8AB4F8}
.mono{font-family:JBM,monospace}
/* demo site */
.site{position:absolute;left:0;top:0;width:100%;font-family:Plex;color:#1C1714;background:#F4EFE8}
.snav{display:flex;align-items:center;gap:18px;padding:14px 22px;font:500 13px Plex;color:#5B4F45;border-bottom:1px solid #E3D9CC}
.snav b{font:800 17px Brico;letter-spacing:.12em;color:#1C1714;margin-right:auto}
.shero{padding:26px 22px 22px}
.stitle{margin:0;font:800 42px/1.02 Brico;letter-spacing:-.02em;color:#1C1714;display:inline-block}
.shero p{margin:10px 0 18px;font:400 15px/1.4 Plex;color:#6A5D52}
.scta{display:inline-block;background:#E4572E;color:#fff;padding:14px 28px;border-radius:999px;font:600 16px/1.25 Plex;margin:0 0 4px;transition:none}
.scards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:6px 22px 22px;position:relative}
.mini .shero{padding:10px 22px 0}.mini .stitle{font-size:26px}.mini .shero p,.mini .scta{display:none}
.scard{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 0 #E3D9CC}
.scard i{display:block;height:92px}
.scard b{display:block;font:600 13px Plex;padding:8px 10px 0}
.scard span{display:block;font:500 12px JBM;color:#8A7B6D;padding:2px 10px 10px}
/* elements */
.tree{flex:none;font:400 14px/23px JBM;padding:6px 0;white-space:nowrap;color:var(--dtx)}
.tree div{padding-left:calc(var(--d,0)*18px + 14px);position:relative}
.tree div.hov{background:#2A3B52}
.tree div.selr{background:#0B4A78}
.tg{color:var(--tag)}.an{color:var(--attr)}.av{color:var(--val)}.tx{color:#E3E3E3}.cm{color:#8C9296}
.dol{color:#9AA0A6;font-size:12px;margin-left:8px}
.flexb{font:600 10px Plex;color:#C8CCD1;border:1px solid #6F737A;border-radius:8px;padding:0 5px;margin-left:6px;vertical-align:1px}
.flexb.on{background:#8AB4F8;color:#1F1F1F;border-color:#8AB4F8}
.subt{height:30px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);font:500 13px Plex;color:#BDC1C6}
.subt span{padding:0 10px;display:flex;align-items:center;border-bottom:2px solid transparent;white-space:nowrap}
.subt span.on{color:#E8EAED;border-bottom-color:#8AB4F8}
.crumbs{height:26px;flex:none;border-top:1px solid var(--line);display:flex;align-items:center;gap:0;font:400 13px JBM;color:#BDC1C6;padding:0 6px;background:var(--dt2)}
.crumbs span{padding:0 8px}.crumbs span.on{background:#3C4043}
.styles{font:400 14px/22px JBM;padding:4px 0;color:var(--dtx)}
.rule{padding:5px 12px 7px;border-bottom:1px solid #2E3035;position:relative}
.rule .src{position:absolute;right:12px;top:5px;color:#9AA0A6;text-decoration:underline;font-size:12.5px}
.rule .sel{color:#E3E3E3}
.decl{padding-left:22px;position:relative}
.decl .cb{position:absolute;left:0;top:5px;width:13px;height:13px;border:1.5px solid #9AA0A6;border-radius:2px;opacity:.9}
.decl .cb.y{background:#8AB4F8;border-color:#8AB4F8}
.pn{color:var(--prop)}.pv{color:#E3E3E3}
.decl.off{text-decoration:line-through;color:#7F868C}.decl.off .pn,.decl.off .pv{color:#7F868C}
.sw{display:inline-block;width:12px;height:12px;border:1px solid #777;vertical-align:-1px;margin-right:5px;border-radius:2px}
.ua{color:#9AA0A6;font-style:italic}
/* overlays */
.ovl{position:absolute;pointer-events:none;display:none}
.ovl div{position:absolute;box-sizing:border-box;border-style:solid;border-width:0}
.tip{position:absolute;display:none;background:#fff;color:#202124;border-radius:6px;box-shadow:0 3px 14px rgba(0,0,0,.35);font:400 13px/1.45 Plex;padding:8px 11px;white-space:nowrap;z-index:5}
.tip .tn{color:#881280;font-weight:600;font-family:JBM}.tip .tc{color:#1A1AA6;font-family:JBM}.tip .dim{color:#5F6368;float:right;margin-left:18px;font-family:JBM}
.tip table{border-collapse:collapse;margin-top:4px;font:400 12.5px Plex}
.tip td{padding:1px 0}.tip td+td{padding-left:26px;text-align:right;font-family:JBM}
.tip .sec{font:700 10.5px Plex;letter-spacing:.08em;color:#5F6368;padding-top:6px}
.cursor{position:absolute;left:0;top:0;width:34px;height:34px;z-index:20;pointer-events:none;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6))}
.ripple{position:absolute;width:10px;height:10px;border-radius:50%;border:3px solid #fff;z-index:19;pointer-events:none;opacity:0}
/* console */
.con{flex:1;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;font:400 15px/1.45 JBM;min-height:0}
.cl{padding:4px 14px 4px 34px;border-bottom:1px solid #2C2E33;position:relative;white-space:pre}
.cl::before{position:absolute;left:12px;top:4px;color:#8AB4F8}
.cl.in::before{content:"›";color:#8AB4F8;font-weight:700}
.cl.out::before{content:"←";color:#9AA0A6;font-size:13px}
.cl.warn{background:#413A1B;color:#FDD663;border-color:#65571A}
.cl.warn::before{content:"▲";color:#FDD663;font-size:11px;top:6px}
.cl.err{background:#3C1E1E;color:#F28B82;border-color:#6B2B2B}
.cl.err::before{content:"✕";color:#F28B82;font-weight:700;font-size:12px;top:5px}
.cl .loc{position:absolute;right:14px;top:4px;color:#9AA0A6;text-decoration:underline;font-size:13px}
.ctab{border-collapse:collapse;margin:4px 0 2px;font:400 14px JBM}
.ctab td,.ctab th{border:1px solid #45474C;padding:2px 12px;text-align:left}
.ctab th{background:#303134;font-weight:600;color:#E3E3E3}
.caret{display:inline-block;width:9px;height:18px;background:#8AB4F8;vertical-align:-3px;margin-left:1px}
.live{flex:none;border-bottom:1px solid var(--line);padding:6px 14px;font:400 14px/1.5 JBM;background:#232428}
.live div{display:flex;gap:14px}.live b{color:#E3E3E3;font-weight:400}.live span{color:var(--num)}
/* sources */
.srcw{flex:1;display:flex;min-height:0}
.nav{width:228px;flex:none;border-right:1px solid var(--line);font:400 14px/24px Plex;overflow:hidden}
.nav .subt{border-top:0}
.nav div.f{padding-left:calc(var(--d)*16px + 10px);white-space:nowrap;color:#D5D7DB;display:flex;align-items:center;gap:6px}
.nav div.f.sel{background:#0B4A78}
.fi{width:13px;height:14px;border-radius:2px;background:#6D8FB5;display:inline-block}.fi.d{background:#C9A15A;border-radius:1px 4px 2px 2px}.fi.js{background:#E8C547}.fi.css{background:#6FA8DC}.fi.cloud{background:#9AA0A6;border-radius:50%}
.ed{flex:1;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--line)}
.edt{height:32px;flex:none;display:flex;background:var(--dt2);border-bottom:1px solid var(--line);font:400 13px Plex;color:#BDC1C6}
.edt span{padding:0 12px;display:flex;align-items:center;gap:8px;border-right:1px solid var(--line)}.edt span.on{background:var(--dt);color:#fff}
.code{flex:1;font:400 15px/25px JBM;padding-top:6px;position:relative;overflow:hidden}
.ln{display:flex;white-space:pre;position:relative}
.ln .g{width:52px;flex:none;text-align:right;padding-right:14px;color:#6E7379;position:relative}
.ln.cur{background:rgba(64,120,80,.45)}
.ln.cur .g{color:#fff}
.bp{position:absolute;right:3px;top:2px;height:21px;width:44px;background:#1A73E8;color:#fff;border-radius:2px 0 0 2px;clip-path:polygon(0 0,82% 0,100% 50%,82% 100%,0 100%);padding-right:12px;text-align:right;display:none}
.bp.cond{background:#E37400}.bp.log{background:#D01884}
.kw{color:#C792EA}.fn{color:#82AAFF}.st{color:#F29766}.nm{color:#9980FF}.co{color:#7F8C8D;font-style:italic}.vr{color:#E3E3E3}
.inl{color:#9AA0A6;font-style:italic;margin-left:22px;background:rgba(138,180,248,.12);padding:0 6px;border-radius:3px;font-size:13.5px}
.dbg{width:340px;flex:none;display:flex;flex-direction:column;font:400 14px/23px Plex;overflow:hidden}
.dbgb{height:34px;flex:none;display:flex;align-items:center;gap:16px;padding:0 12px;background:var(--dt2);border-bottom:1px solid var(--line)}
.dbgb svg{width:19px;height:19px}
.pane{border-bottom:1px solid var(--line)}
.pane h4{margin:0;font:600 13px/28px Plex;padding:0 10px;background:#27282C;color:#E3E3E3}
.pane h4::before{content:"▾ ";color:#9AA0A6}
.pane div{padding:0 14px;white-space:nowrap;font:400 13.5px/23px JBM}
.pane .sk{color:#C792EA}
.pausebar{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:#FFF3C4;border:1px solid #E2C766;color:#3C3000;font:500 14px Plex;padding:6px 12px;border-radius:5px;display:flex;gap:12px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:4}
.pausebar i{font-style:normal;background:#1A73E8;color:#fff;width:24px;height:20px;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:11px}
.dim{position:absolute;inset:0;background:rgba(0,0,0,.18);z-index:3}
.ctx{position:absolute;background:#2D2E31;border:1px solid #4A4C52;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:400 14px/30px Plex;color:#E3E3E3;padding:5px 0;z-index:8;min-width:260px}
.ctx div{padding:0 18px;white-space:nowrap}.ctx div.h{background:#0B4A78}.ctx hr{border:0;border-top:1px solid #45474C;margin:4px 0}
.ctx div small{float:right;color:#9AA0A6;margin-left:30px}
/* network */
.nt{flex:1;display:flex;flex-direction:column;min-height:0;position:relative}
.ntrow{display:grid;grid-template-columns:170px 60px 84px 100px 76px 72px 1fr;font:400 13.5px/24px Plex;border-bottom:1px solid #2C2E33;white-space:nowrap}
.ntrow>*{padding:0 8px;overflow:hidden;text-overflow:ellipsis;border-right:1px solid #2C2E33}
.ntrow.h{background:var(--dt2);color:#BDC1C6;font-weight:500}
.ntrow:nth-child(even):not(.h){background:#232428}
.ntrow.bad{color:#F28B82}
.ntrow.pick{background:#0B4A78!important}
.wf{position:relative}
.wf i{position:absolute;top:8px;height:9px}
.chips{display:flex;gap:4px;align-items:center}
.chips span{padding:1px 9px;border-radius:10px;font:500 12.5px/20px Plex;color:#BDC1C6}
.chips span.on{background:#3C4043;color:#fff}
.ov{height:56px;flex:none;border-bottom:1px solid var(--line);position:relative;background:#1B1C1F}
.status{height:28px;flex:none;border-top:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 10px;font:400 13px Plex;color:#BDC1C6;background:var(--dt2);white-space:nowrap}
.status .dcl{color:#8AB4F8}.status .ld{color:#F28B82}
.drawer{position:absolute;right:0;top:0;bottom:0;width:560px;background:var(--dt);border-left:1px solid var(--line);z-index:6;display:flex;flex-direction:column}
.hdr{font:400 13.5px/23px Plex;padding:0 14px}
.hdr .k{color:#9AA0A6;display:inline-block;width:190px}
.hdr .v{color:#E3E3E3;font-family:JBM;font-size:13px}
.hdr h5{margin:8px 0 2px;font:600 13px Plex;color:#E3E3E3}
.hdr h5::before{content:"▾ ";color:#9AA0A6}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#F28B82;margin-right:6px}
/* perf */
.flame{position:relative;overflow:hidden}
.flame i{position:absolute;height:19px;font:500 11.5px/19px Plex;color:#1B1B1B;padding:0 4px;overflow:hidden;white-space:nowrap;border-right:1px solid rgba(0,0,0,.25);font-style:normal}
.flame i.lt::after{content:"";position:absolute;right:0;top:0;width:0;height:0;border-top:9px solid #E53935;border-left:9px solid transparent}
.track{display:flex;border-bottom:1px solid var(--line);font:500 12.5px/1 Plex;color:#BDC1C6}
.track>b{width:110px;flex:none;padding:6px 8px;font-weight:500;border-right:1px solid var(--line);background:#232428}
.track>div{flex:1;position:relative}
.vit{display:flex;gap:10px}
.vit div{flex:1;background:#27282C;border-radius:8px;padding:10px 12px;border:1px solid #3A3C42}
.vit b{display:block;font:600 11.5px/1 Plex;letter-spacing:.06em;color:#9AA0A6}
.vit span{display:block;font:700 22px/1.2 JBM;margin-top:6px;white-space:nowrap}
.vit small{font:500 12px Plex;color:#9AA0A6}
.g{color:#81C995}.o{color:#FCAD70}.r{color:#F28B82}
/* generic */
.tile{position:absolute;background:var(--dt);border-radius:12px;border:1px solid #3A3C42;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.5)}
.tile h6{margin:0;height:36px;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--dt2);border-bottom:1px solid var(--line);font:600 14px Plex;color:#E8EAED}
.tile h6 em{font-style:normal;font:600 11px JBM;color:#070A12;background:var(--acc);padding:3px 7px;border-radius:4px;margin-left:auto}
.gauge{display:flex;flex-direction:column;align-items:center;gap:10px;font:600 17px Plex;color:#E3E3E3}
.gauge svg{width:150px;height:150px}
.gauge text{font:700 44px JBM}
/* intro */
.bigkey{position:absolute;left:50%;top:50%;width:360px;height:300px;margin:-190px 0 0 -180px;border-radius:44px;background:linear-gradient(#34405F,#1B2238);border:2px solid #56648A;box-shadow:0 26px 0 #0B0F1C,0 40px 80px rgba(0,0,0,.7),inset 0 3px 0 rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font:800 150px/1 Brico;color:#fff;letter-spacing:-.04em}
.ring{position:absolute;left:50%;top:50%;border-radius:50%;border:6px solid var(--blue);transform:translate(-50%,-50%);opacity:0}
.hero-t{position:absolute;left:0;right:0;text-align:center;font:800 250px/.9 Brico;letter-spacing:-.05em;color:#fff}
.hero-t span{display:inline-block}
</style></head>
<body><div id="root">
<div id="grid"></div><div id="glow"></div><div id="water"></div>
<canvas id="fx" width="1920" height="1080"></canvas>
<div id="scenes"></div>
<div id="hud-top"></div>
<div id="hud-bot"><div id="tc">00:00.0<small>DEVTOOLS · 60S</small></div><div id="tick-wrap"><div id="tick"></div></div></div>
<div id="bands"></div><div id="flash"></div><div id="scan"></div><div id="vign"></div>
</div>
<script>
const B=60/128, BAR=4*B;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const E={out:t=>1-Math.pow(1-t,3),back:t=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,expo:t=>t>=1?1:1-Math.pow(2,-10*t)};
const lerp=(a,b,t)=>a+(b-a)*t;
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- icons ---------- */
const I={
inspect:'<svg class="i" viewBox="0 0 20 20"><path d="M8 3H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/><path d="M9 8l8 3-3.5 1.5L12 16z"/></svg>',
device:'<svg class="i" viewBox="0 0 20 20"><rect x="2" y="4" width="10" height="13" rx="1.5"/><rect x="13" y="8" width="5" height="9" rx="1"/></svg>',
gear:'<svg class="i" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2.6"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M4.3 15.7l1.8-1.8M13.9 6.1l1.8-1.8"/></svg>',
kebab:'<svg class="i" viewBox="0 0 20 20"><circle cx="10" cy="4.5" r=".9"/><circle cx="10" cy="10" r=".9"/><circle cx="10" cy="15.5" r=".9"/></svg>',
x:'<svg class="i" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg>',
lock:'<svg class="i" viewBox="0 0 20 20" style="width:15px;height:15px"><rect x="4.5" y="9" width="11" height="8" rx="1.5"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg>',
clear:'<svg class="i" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"/><path d="M5 15L15 5"/></svg>',
eye:'<svg class="i" viewBox="0 0 20 20"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.4"/></svg>',
funnel:'<svg class="i" viewBox="0 0 20 20"><path d="M3 4h14l-5.5 6.5V16l-3-1.5v-4z"/></svg>',
rec:'<svg class="i" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5.5" fill="#F28B82" stroke="none"/></svg>',
resume:'<svg class="i" viewBox="0 0 20 20" style="stroke:#8AB4F8"><path d="M4 4v12M8 4l9 6-9 6z" fill="#8AB4F8"/></svg>',
over:'<svg class="i" viewBox="0 0 20 20" style="stroke:#8AB4F8"><path d="M3 11a7 7 0 0 1 13-3"/><path d="M16.5 3.5V8H12"/><circle cx="10" cy="15" r="1.6" fill="#8AB4F8"/></svg>',
into:'<svg class="i" viewBox="0 0 20 20" style="stroke:#8AB4F8"><path d="M10 2v9M6 7l4 4 4-4"/><circle cx="10" cy="16" r="1.6" fill="#8AB4F8"/></svg>',
out:'<svg class="i" viewBox="0 0 20 20" style="stroke:#8AB4F8"><path d="M10 12V3M6 7l4-4 4 4"/><circle cx="10" cy="16" r="1.6" fill="#8AB4F8"/></svg>',
step:'<svg class="i" viewBox="0 0 20 20" style="stroke:#8AB4F8"><path d="M3 10h11M10 6l4 4-4 4"/><circle cx="17" cy="10" r="1.4" fill="#8AB4F8"/></svg>',
deact:'<svg class="i" viewBox="0 0 20 20"><path d="M3 5h10l4 5-4 5H3z"/><path d="M2 17L17 3"/></svg>',
dl:'<svg class="i" viewBox="0 0 20 20"><path d="M10 3v10M6 9l4 4 4-4M4 17h12"/></svg>',
};
const cursorSVG={arrow:'<svg class="cursor" viewBox="0 0 24 24"><path d="M4 2l15 10.5-6.7 1.2 4 7.3-3 1.6-4-7.4L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>',
touch:'<svg class="cursor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="rgba(120,120,120,.45)" stroke="rgba(255,255,255,.9)" stroke-width="1.5"/></svg>'};

/* ---------- shared markup ---------- */
function kc(k){return `<span class="kc">${k}</span>`}
function combo(keys,label,tin){return `<div class="combo" data-in="${tin}" data-fx="pop">${keys.map(kc).join('<em>+</em>')}${label?`<small>${label}</small>`:''}</div>`}
function chromeBar(url='driftwood.coffee/shop'){return `<div class="bch"><div class="btabs"><span class="lights"><i></i><i></i><i></i></span><div class="btab on"><span class="fav"></span>Driftwood — Specialty Coffee<b>×</b></div><div class="btab">New Tab<b>×</b></div><span style="color:#9AA0A6;margin:0 0 8px 8px;font:400 20px Plex">+</span></div><div class="omni"><span>‹</span><span>›</span><span>⟳</span><div class="url">${I.lock}<span>${url.split('/')[0]}<s>/${url.split('/').slice(1).join('/')}</s></span></div><span>☆</span><span>⋮</span></div></div>`}
const PANELS=['Elements','Console','Sources','Network','Performance','Memory','Application','Lighthouse'];
function dtTabs(active,extra=''){return `<div class="dtt"><div class="ic ${extra.includes('insp')?'on':''} insp">${I.inspect}</div><div class="ic dev">${I.device}</div>${PANELS.map(p=>`<span class="${p===active?'on':''}">${p}</span>`).join('')}<span>»</span><div class="rt"><span class="badge err">✕ ${extra.includes('e1')?'1':'0'}</span><span class="badge warn">▲ ${extra.includes('w1')?'1':'0'}</span><span class="badge iss">■ 2</span>${I.gear}${I.kebab}${I.x}</div></div>`}
function site(cls=''){return `<div class="site ${cls}"><div class="snav"><b>DRIFTWOOD</b><span>Shop</span><span>Brew guides</span><span>Cart (2)</span></div><header class="shero"><h1 class="stitle">Slow coffee, fast site.</h1><p>Single-origin beans, roasted every Tuesday.</p><a class="scta">Order beans →</a></header><section class="scards"><div class="scard"><i style="background:linear-gradient(135deg,#C8553D,#F28F3B)"></i><b>Ethiopia Guji</b><span>$18.50</span></div><div class="scard"><i style="background:linear-gradient(135deg,#588B8B,#C8D5B9)"></i><b>Colombia Huila</b><span>$17.00</span></div><div class="scard"><i style="background:linear-gradient(135deg,#6B4E71,#E0A458)"></i><b>Kenya Nyeri</b><span>$19.50</span></div></section></div>`}
function win(inner,{dock='right',page=460,url,pageCls=''}={}){const st=dock==='right'?`width:${page}px;height:100%`:`height:${page}px;width:100%`;return `<div class="win">${chromeBar(url)}<div class="bbody ${dock}"><div class="pagebox" style="${st}">${site(pageCls)}</div>${inner}</div></div>`}
function info(s){return `<div class="info"><div class="kick" data-in="0.02" data-fx="left">${s.kick}</div><h2 class="ttl" data-in="0" data-fx="slam">${s.name}</h2><div class="sub" data-in="0.12" data-fx="wipe">${s.sub}</div><div class="keys">${(s.keys||[]).map((k,i)=>combo(k[0],k[1],0.2+i*0.1)).join('')}</div>${s.legend?`<div class="legend" data-in="0.45" data-fx="wipe">${s.legend}</div>`:''}<ul class="bul">${s.bul.map((b,i)=>`<li data-in="${(s.b0??0.55)+i*(s.bs??B)}" data-fx="left"><i></i><span>${b}</span></li>`).join('')}</ul></div>`}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function hl(line){ // tiny JS highlighter for sources
 return esc(line).replace(/(\/\*\*.*\*\/|\/\/.*$)/,'<span class="co">$1</span>').replace(/('[^']*')/g,'<span class="st">$1</span>').replace(/\b(import|from|export|function|let|const|for|of|if|return|async|await)\b/g,'<span class="kw">$1</span>').replace(/\b(\d+(\.\d+)?)\b/g,'<span class="nm">$1</span>').replace(/\b(calcTotal|checkout|round|post|json)\b/g,'<span class="fn">$1</span>')}

/* ---------- scenes ---------- */
const S=[];let T0=0;
function scene(bars,def){def.start=T0;def.end=T0+bars*BAR;T0=def.end;S.push(def);return def}

scene(2,{id:'intro',acc:'#6FA8DC',hud:false,water:'F12 F12 F12 F12 F12',
 html:()=>`<div class="ring" id="r1"></div><div class="ring" id="r2" style="border-color:var(--orange)"></div><div class="bigkey" id="bk">F12</div>
 <div class="hero-t" id="ht" style="top:250px;opacity:0">${'DEVTOOLS'.split('').map(c=>`<span>${c}</span>`).join('')}</div>
 <div id="hs" style="position:absolute;left:0;right:0;top:520px;text-align:center;font:600 34px Plex;color:#C9D2E3;opacity:0">Every core panel of your browser's <span style="font:700 32px JBM;color:var(--yellow)">F12</span> tools — how each one looks and behaves</div>
 <div id="hs2" style="position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center;gap:14px;opacity:0">${['ELEMENTS','CONSOLE','SOURCES','NETWORK','PERFORMANCE','MEMORY','APPLICATION','DEVICE MODE','LIGHTHOUSE','COMMAND MENU'].map((p,i)=>`<span style="font:700 15px JBM;letter-spacing:.1em;padding:8px 12px;border:1.5px solid ${['#6FA8DC','#93C47D','#FFE599','#F6B26B'][i%4]};color:${['#6FA8DC','#93C47D','#FFE599','#F6B26B'][i%4]};border-radius:6px">${p}</span>`).join('')}</div>`,
 update(lt,el){const bk=$('#bk',el);
  const drop=E.out(clamp(lt/B));const y=lerp(-900,0,drop);const squash=lt>B&&lt<B+0.12?0.9:1;
  let s=1, op=1;
  if(lt>2.2*B){const p=clamp((lt-2.2*B)/(1.4*B));s=lerp(1,0.42,E.io(p));}
  const ky=lt>2.2*B?lerp(0,-300,E.io(clamp((lt-2.2*B)/(1.4*B)))):0;
  if(lt>6.4*B){op=1-clamp((lt-6.4*B)/(0.8*B))}
  bk.style.transform=`translateY(${y+ky}px) scale(${s},${s*squash})`;bk.style.opacity=op;
  [['#r1',B],['#r2',B+0.1]].forEach(([id,t0])=>{const p=clamp((lt-t0)/0.7);const r=$(id,el);r.style.opacity=p>0&&p<1?1-p:0;const d=lerp(200,1600,E.out(p));r.style.width=r.style.height=d+'px';});
  const ht=$('#ht',el);ht.style.opacity=lt>3.4*B?1:0;
  $$('span',ht).forEach((sp,i)=>{const p=clamp((lt-3.4*B-i*0.045)/0.3);sp.style.transform=`translateY(${lerp(120,0,E.back(p))}px) scale(${lerp(1.8,1,E.out(p))})`;sp.style.opacity=p;sp.style.color=p<1?['#6FA8DC','#93C47D','#FFE599','#F6B26B'][i%4]:'#fff'});
  $('#hs',el).style.opacity=clamp((lt-4.6*B)/0.3);$('#hs',el).style.transform=`translateY(${lerp(20,0,E.out(clamp((lt-4.6*B)/0.3)))}px)`;
  const h2=$('#hs2',el);h2.style.opacity=lt>5.2*B?1:0;$$('span',h2).forEach((sp,i)=>{const p=clamp((lt-5.2*B-i*0.05)/0.2);sp.style.opacity=p;sp.style.transform=`scale(${lerp(.4,1,E.back(p))})`});
 }});

scene(2,{id:'open',acc:'#8AB4F8',label:'OPEN',water:'OPEN · DOCK · OPEN · DOCK',
 info:{kick:'CH 01 · OPEN IT',name:'OPEN IT',sub:'Four ways in. <em>F12</em> toggles the whole toolbox on any page.',keys:[[['F12'],'toggle'],[['Ctrl','Shift','I'],'open'],[['Ctrl','Shift','J'],'→ Console'],[['Ctrl','Shift','C'],'→ inspect'],[['⌘','⌥','I'],'macOS']],b0:0.9,bs:0.42,
  bul:['Right-click anything → <b>Inspect</b>','Dock <b>right · bottom · left · undocked</b> via ⋮ menu','<code>Ctrl+Shift+D</code> swaps to the last dock side','<code>Esc</code> opens the Drawer under any panel','<code>Ctrl+[</code> / <code>Ctrl+]</code> cycle panels']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt" id="dtp">${dtTabs('Elements')}<div style="padding:20px;font:400 14px/23px JBM;color:#8C9296">&lt;!DOCTYPE html&gt;<br>&lt;html lang="en"&gt;<br>&nbsp;&nbsp;&lt;head&gt;…&lt;/head&gt;<br>&nbsp;&nbsp;&lt;body class="shop"&gt;…&lt;/body&gt;<br>&lt;/html&gt;</div></div>`,{page:1140})}</div>
 <div class="ctx" id="rc" style="left:330px;top:380px;display:none"><div>Back</div><div>Reload</div><hr><div>Save as…</div><div>Print…</div><hr><div class="h">Inspect</div></div>
 <div id="dockchip" style="position:absolute;right:24px;top:92px;z-index:9;font:700 15px JBM;background:#FFE599;color:#111;padding:8px 12px;border-radius:6px;opacity:0">DOCK ▸ RIGHT</div>`,
 update(lt,el){const pb=$('.pagebox',el), dt=$('#dtp',el), bb=$('.bbody',el);
  $('#rc',el).style.display=lt>0.25&&lt<0.95?'block':'none';
  let mode='none';if(lt>1.0)mode='right';if(lt>2.0)mode='bottom';if(lt>2.9)mode='left';
  const p=E.out(clamp((lt-(mode==='right'?1.0:mode==='bottom'?2.0:2.9))/0.3));
  bb.className='bbody '+(mode==='bottom'?'bottom':'right');bb.style.flexDirection=mode==='left'?'row-reverse':'';
  if(mode==='none'){pb.style.width='1140px';pb.style.height='100%';dt.style.display='none'}
  else{dt.style.display='flex';if(mode==='bottom'){pb.style.width='100%';pb.style.height=lerp(732,330,p)+'px'}else{pb.style.height='100%';pb.style.width=lerp(1140,560,p)+'px'}}
  const ch=$('#dockchip',el);ch.style.opacity=mode==='none'?0:1;ch.textContent='DOCK ▸ '+mode.toUpperCase();
 },cursor:[[0,700,600],[0.22,390,360,1],[0.6,420,555],[0.8,420,555,1],[1.6,900,300]]});

scene(3,{id:'elements',acc:'#6FA8DC',label:'ELEMENTS',water:'ELEMENTS <DOM/> ELEMENTS',
 info:{kick:'CH 02 · ELEMENTS PANEL',name:'ELEMENTS',sub:'The <em>live DOM</em>, not your source file. Hover to see the box; edit anything in place.',keys:[[['Ctrl','Shift','C'],'pick an element'],[['Ctrl','F'],'search DOM']],
  legend:'<span style="--c:rgba(111,168,220,.9)">content</span><span style="--c:rgba(147,196,125,.9)">padding</span><span style="--c:rgba(255,229,153,.9)">border</span><span style="--c:rgba(246,178,107,.9)">margin</span>',b0:0.8,bs:0.62,
  bul:['Hover a node → page overlay shows <b>size, color, font, contrast</b>','Selected node becomes <code>$0</code> in the Console','Double-click to edit text, tags, attributes','<code>H</code> hides a node · <code>Del</code> removes · drag to reorder','Right-click → <b>Break on</b> subtree / attribute changes','<b>Alt-click</b> ▸ expands every descendant']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Elements','insp')}
 <div class="tree" style="height:305px;overflow:hidden">
  <div class="cm" style="--d:0">&lt;!DOCTYPE html&gt;</div>
  <div style="--d:0">▾<span class="tg">&lt;html</span> <span class="an">lang</span>=<span class="av">"en"</span><span class="tg">&gt;</span></div>
  <div style="--d:1">▸<span class="tg">&lt;head&gt;</span>…<span class="tg">&lt;/head&gt;</span></div>
  <div style="--d:1">▾<span class="tg">&lt;body</span> <span class="an">class</span>=<span class="av">"shop"</span><span class="tg">&gt;</span></div>
  <div style="--d:2" id="r-nav">▸<span class="tg">&lt;nav</span> <span class="an">class</span>=<span class="av">"site-nav"</span><span class="tg">&gt;</span>…<span class="tg">&lt;/nav&gt;</span><span class="flexb">flex</span></div>
  <div style="--d:2">▾<span class="tg">&lt;header</span> <span class="an">class</span>=<span class="av">"hero"</span><span class="tg">&gt;</span></div>
  <div style="--d:3" id="r-h1"><span class="tg">&lt;h1</span> <span class="an">class</span>=<span class="av">"hero-title"</span><span class="tg">&gt;</span><span class="tx" id="h1txt">Slow coffee, fast site.</span><span class="tg">&lt;/h1&gt;</span></div>
  <div style="--d:3"><span class="tg">&lt;p</span> <span class="an">class</span>=<span class="av">"lede"</span><span class="tg">&gt;</span><span class="tx">Single-origin beans…</span><span class="tg">&lt;/p&gt;</span></div>
  <div style="--d:3" id="r-a"><span class="tg">&lt;a</span> <span class="an">class</span>=<span class="av">"btn cta"</span> <span class="an">href</span>=<span class="av">"/shop"</span><span class="tg">&gt;</span><span class="tx">Order beans →</span><span class="tg">&lt;/a&gt;</span><span class="dol" id="d0" style="display:none">== $0</span></div>
  <div style="--d:2"><span class="tg">&lt;/header&gt;</span></div>
  <div style="--d:2">▸<span class="tg">&lt;section</span> <span class="an">class</span>=<span class="av">"cards"</span><span class="tg">&gt;</span>…<span class="tg">&lt;/section&gt;</span><span class="flexb">grid</span></div>
  <div style="--d:2"><span class="tg">&lt;script</span> <span class="an">src</span>=<span class="av">"/js/app.js"</span> <span class="an">type</span>=<span class="av">"module"</span><span class="tg">&gt;&lt;/script&gt;</span></div>
 </div>
 <div class="crumbs"><span>html</span><span>body.shop</span><span>header.hero</span><span class="on" id="crumb">h1.hero-title</span></div>
 <div class="subt"><span class="on">Styles</span><span>Computed</span><span>Layout</span><span>Event Listeners</span><span>DOM Breakpoints</span><span>Properties</span><span>Accessibility</span></div>
 <div class="tb"><div class="inp">Filter</div><span style="margin-left:auto">:hov</span><span>.cls</span><span>+</span></div>
 <div class="styles" id="stA">
  <div class="rule"><span class="sel">element.style</span> {<br>}</div>
  <div class="rule"><span class="src">app.css:22</span><span class="sel">.hero-title</span> {<div class="decl"><span class="cb y"></span><span class="pn">font</span>: <span class="pv">800 42px/1.02 Bricolage, serif</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">letter-spacing</span>: <span class="pv">-0.02em</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">margin</span>: <span class="pv">▸ 0</span>;</div>}</div>
  <div class="rule"><span class="src ua" style="text-decoration:none">user agent stylesheet</span><span class="sel">h1</span> {<div class="decl off"><span class="pn">margin-block</span>: <span class="pv">0.67em</span>;</div><div class="decl"><span class="pn">display</span>: <span class="pv">block</span>;</div>}</div>
 </div>
 <div class="styles" id="stB" style="display:none">
  <div class="rule"><span class="sel">element.style</span> {<br>}</div>
  <div class="rule"><span class="src">app.css:31</span><span class="sel">.btn.cta</span> {<div class="decl"><span class="cb y"></span><span class="pn">background</span>: <span class="pv"><i class="sw" style="background:#E4572E"></i>#E4572E</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">padding</span>: <span class="pv">▸ 14px 28px</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">border-radius</span>: <span class="pv">999px</span>;</div>}</div>
  <div class="rule"><span class="src">app.css:12</span><span class="sel">.btn</span> {<div class="decl off"><span class="pn">background</span>: <span class="pv"><i class="sw" style="background:#333"></i>#333</span>;</div><div class="decl"><span class="pn">display</span>: <span class="pv">inline-block</span>;</div>}</div>
 </div>
 </div>`,{page:470})}
 <div class="ovl" id="ov"><div class="m" style="border-color:rgba(246,178,107,.66)"></div><div class="b"></div><div class="p" style="border-color:rgba(147,196,125,.66)"></div><div class="c" style="background:rgba(111,168,220,.62)"></div></div>
 <div class="tip" id="tip"></div></div>`,
 update(lt,el){
  const h1=$('.stitle',el), a=$('.scta',el), rh=$('#r-h1',el), ra=$('#r-a',el);
  let tgt=null; if(lt>1.15&&lt<2.35)tgt=h1; if(lt>2.9&&lt<4.1)tgt=a;
  rh.classList.toggle('hov',tgt===h1); ra.classList.toggle('hov',tgt===a&&lt<3.6); ra.classList.toggle('selr',lt>=3.6);
  $('#d0',el).style.display=lt>=3.6?'inline':'none';
  $('#crumb',el).textContent=lt>=3.6?'a.btn.cta':'h1.hero-title';
  $('#stA',el).style.display=lt>=3.6?'none':'block';$('#stB',el).style.display=lt>=3.6?'block':'none';
  drawOverlay(el,tgt,tgt===h1?`<span class="tn">h1</span><span class="tc">.hero-title</span><span class="dim">${Math.round(h1.offsetWidth)} × ${Math.round(h1.offsetHeight)}</span>`:
   `<span class="tn">a</span><span class="tc">.btn.cta</span><span class="dim">${a.offsetWidth} × ${a.offsetHeight}</span><table><tr><td>Color</td><td><i class="sw" style="background:#fff"></i>#FFFFFF</td></tr><tr><td>Font</td><td>16px Plex, sans-serif</td></tr><tr><td>Background</td><td><i class="sw" style="background:#E4572E"></i>#E4572E</td></tr><tr><td>Padding</td><td>14px 28px</td></tr><tr><td colspan=2 class="sec">ACCESSIBILITY</td></tr><tr><td>Contrast</td><td>Aa 3.81 <b style="color:#E37400">⚠</b></td></tr><tr><td>Name</td><td>Order beans →</td></tr><tr><td>Role</td><td>link</td></tr><tr><td>Keyboard-focusable</td><td style="color:#188038">✓</td></tr></table>`);
  // live edit
  const target='Hello, DevTools.';let txt='Slow coffee, fast site.';
  if(lt>4.35){const n=Math.floor((lt-4.35)*26);txt=target.slice(0,Math.min(n,target.length));}
  $('#h1txt',el).innerHTML=lt>4.2&&lt<5.3?`<span style="outline:1px solid #8AB4F8;background:#1B1C1E;padding:0 3px">${esc(txt)}<span class="caret"></span></span>`:esc(lt>4.35?txt:'Slow coffee, fast site.');
  h1.textContent=lt>4.35?(txt||' '):'Slow coffee, fast site.';
 },cursor:[[0,1000,700],[0.5,40,60,1],[1.15,['.stitle',0.4,0.5]],[2.35,['.stitle',0.8,0.6]],[2.9,['.scta',0.5,0.5]],[3.55,['.scta',0.55,0.55],1],[3.9,['#r-h1',0.5,0.5]],[4.15,['#h1txt',0.5,0.5],1],[5.6,['#h1txt',0.6,0.5]]]});

scene(2,{id:'styles',acc:'#93C47D',label:'STYLES',water:'CASCADE {} CASCADE {}',
 info:{kick:'CH 03 · STYLES · COMPUTED · LAYOUT',name:'STYLES',sub:'Every rule that matches, in <em>cascade order</em>. Losers are struck through.',keys:[[['Shift','click'],'swatch = cycle hex/rgb/hsl'],[['↑','↓'],'nudge values']],b0:0.5,bs:0.4,
  bul:['Checkbox toggles a declaration live','Color picker: <b>eyedropper, palettes, contrast AA/AAA</b>','<code>:hov</code> forces <b>:hover :focus :active</b>','<code>grid</code> / <code>flex</code> badges draw overlays on the page','<b>Computed</b> = final values + which rule won','<b>Changes</b> drawer diffs every edit you made']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Elements')}
 <div class="tree" style="height:118px;overflow:hidden;font-size:13.5px;line-height:22px">
  <div style="--d:1">▾<span class="tg">&lt;header</span> <span class="an">class</span>=<span class="av">"hero"</span><span class="tg">&gt;</span></div>
  <div style="--d:2" class="selr"><span class="tg">&lt;a</span> <span class="an">class</span>=<span class="av">"btn cta"</span><span class="tg">&gt;</span>Order beans →<span class="tg">&lt;/a&gt;</span><span class="dol">== $0</span></div>
  <div style="--d:1"><span class="tg">&lt;/header&gt;</span></div>
  <div style="--d:1">▸<span class="tg">&lt;section</span> <span class="an">class</span>=<span class="av">"cards"</span><span class="tg">&gt;</span>…<span class="tg">&lt;/section&gt;</span><span class="flexb" id="gb">grid</span></div>
 </div>
 <div class="subt"><span class="on">Styles</span><span>Computed</span><span>Layout</span><span>Event Listeners</span><span>Accessibility</span></div>
 <div class="tb"><div class="inp">Filter</div><span style="margin-left:auto" id="hovb">:hov</span><span>.cls</span><span>+</span></div>
 <div id="hovp" style="display:none;padding:6px 12px;border-bottom:1px solid var(--line);font:400 13px Plex;color:#BDC1C6;background:#232428"><div style="margin-bottom:4px">Force element state</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px"><span class="chk">:active</span><span class="chk" id="hovc">:hover</span><span class="chk">:focus</span><span class="chk">:visited</span><span class="chk">:focus-within</span><span class="chk">:focus-visible</span><span class="chk">:target</span></div></div>
 <div class="styles" style="position:relative">
  <div class="rule"><span class="sel">element.style</span> {<br>}</div>
  <div class="rule" id="hrule" style="display:none;background:rgba(147,196,125,.08)"><span class="src">app.css:48</span><span class="sel">.btn.cta:hover</span> {<div class="decl"><span class="cb y"></span><span class="pn">transform</span>: <span class="pv">translateY(-3px)</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">box-shadow</span>: <span class="pv">0 10px 22px <i class="sw" style="background:rgba(228,87,46,.5)"></i>rgb(228 87 46 / 45%)</span>;</div>}</div>
  <div class="rule"><span class="src">app.css:31</span><span class="sel">.btn.cta</span> {<div class="decl"><span class="cb y"></span><span class="pn">background</span>: <span class="pv"><i class="sw" id="sw" style="background:#E4572E"></i><span id="hex">#E4572E</span></span>;</div><div class="decl"><span class="cb y"></span><span class="pn">color</span>: <span class="pv"><i class="sw" style="background:#fff"></i>#fff</span>;</div><div class="decl"><span class="cb y"></span><span class="pn">padding</span>: <span class="pv">▸ 14px 28px</span>;</div><div class="decl" id="brd"><span class="cb y" id="brcb"></span><span class="pn">border-radius</span>: <span class="pv">999px</span>;</div>}</div>
  <div class="rule"><span class="src">app.css:12</span><span class="sel">.btn</span> {<div class="decl off"><span class="pn">background</span>: <span class="pv"><i class="sw" style="background:#333"></i>#333</span>;</div><div class="decl off"><span class="pn">padding</span>: <span class="pv">▸ 10px 16px</span>;</div><div class="decl"><span class="pn">display</span>: <span class="pv">inline-block</span>;</div>}</div>
  <div class="rule"><span class="src ua" style="text-decoration:none">user agent stylesheet</span><span class="sel">a:-webkit-any-link</span> {<div class="decl off"><span class="pn">color</span>: <span class="pv">-webkit-link</span>;</div><div class="decl"><span class="pn">cursor</span>: <span class="pv">pointer</span>;</div>}</div>
  <div id="cp" style="position:absolute;left:40px;top:118px;width:270px;background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.6);display:none;z-index:4;overflow:hidden">
   <div id="spec" style="height:130px;position:relative"><div style="position:absolute;inset:0;background:linear-gradient(90deg,#fff,transparent)"></div><div style="position:absolute;inset:0;background:linear-gradient(0deg,#000,transparent)"></div><i id="spk" style="position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #000;left:212px;top:18px"></i></div>
   <div style="padding:10px 12px;display:flex;gap:10px;align-items:center"><span style="font-size:16px">⌖</span><i id="cpsw" style="width:26px;height:26px;border-radius:50%;background:#E4572E;flex:none"></i><div style="flex:1;display:flex;flex-direction:column;gap:7px"><div style="height:10px;border-radius:5px;background:linear-gradient(90deg,red,#ff0,lime,cyan,blue,#f0f,red);position:relative"><i id="hk" style="position:absolute;top:-2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #000;left:8px"></i></div><div style="height:10px;border-radius:5px;background:linear-gradient(90deg,transparent,#E4572E),repeating-conic-gradient(#666 0 25%,#999 0 50%) 0 0/8px 8px"></div></div></div>
   <div style="padding:0 12px 8px;font:500 13px JBM;color:#E3E3E3;display:flex;justify-content:space-between"><span id="cphex">#E4572E</span><span style="color:#9AA0A6">HEX ⇅</span></div>
   <div style="padding:6px 12px 10px;border-top:1px solid #45474C;font:400 12.5px Plex;color:#BDC1C6">Contrast ratio <b id="cr" style="font-family:JBM;color:#E3E3E3">3.81</b> <span id="crk" style="color:#F28B82">⚠</span><span style="float:right;color:#9AA0A6">AA 4.5</span></div>
  </div>
 </div>
 <div style="margin-top:auto;padding:10px 14px 14px;border-top:1px solid var(--line);background:#232428"><div style="font:600 12px Plex;color:#9AA0A6;margin-bottom:8px">BOX MODEL</div>
  <div style="font:500 12px JBM;color:#202124;text-align:center">
   <div style="background:#F9CC9D;padding:4px 10px 6px;border:1px dashed #333;position:relative"><span style="position:absolute;left:5px;top:2px;font-size:10px">margin</span>0
    <div style="background:#FFEEBC;padding:4px 10px 6px;border:1.5px solid #000;margin:3px 30px;position:relative"><span style="position:absolute;left:5px;top:2px;font-size:10px">border</span>–
     <div style="background:#C3D08B;padding:4px 10px 6px;margin:3px 30px;position:relative"><span style="position:absolute;left:5px;top:2px;font-size:10px">padding</span>14
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin:2px 0"><span>28</span><span style="background:#8CB6C0;padding:4px 14px;border:1px solid #555" id="bmc">129 × 20</span><span>28</span></div>14</div>–</div>0</div></div></div>
 </div>`,{page:520})}
 <div id="gov" style="position:absolute;display:none;pointer-events:none"></div></div>`,
 update(lt,el){const a=$('.scta',el);
  const off=lt>0.45&&lt<1.35;$('#brd',el).classList.toggle('off',off);$('#brcb',el).classList.toggle('y',!off);
  a.style.borderRadius=off?'0':'999px';
  // color picker
  const cpOn=lt>1.35&&lt<2.55;$('#cp',el).style.display=cpOn?'block':'none';
  const hp=E.io(clamp((lt-1.6)/0.8));const hue=lerp(13,212,hp);const L=lerp(54,40,hp);const col=`hsl(${hue} 76% ${L}%)`;
  const hex=hslHex(hue,76,L);$('#spec',el).style.background=`hsl(${hue} 100% 50%)`;$('#hk',el).style.left=(8+hue/360*150)+'px';
  [$('#sw',el),$('#cpsw',el)].forEach(x=>x.style.background=hex);$('#hex',el).textContent=hex;$('#cphex',el).textContent=hex;a.style.background=hex;
  const cr=lerp(3.81,6.12,hp);$('#cr',el).textContent=cr.toFixed(2);$('#crk',el).textContent=cr>=4.5?'✓ AA':'⚠';$('#crk',el).style.color=cr>=4.5?'#81C995':'#F28B82';
  // hov
  $('#hovp',el).style.display=lt>2.45?'block':'none';$('#hovc',el).classList.toggle('y',lt>2.7);$('#hrule',el).style.display=lt>2.7?'block':'none';
  a.style.transform=lt>2.7?'translateY(-3px)':'';a.style.boxShadow=lt>2.7?'0 10px 22px rgba(228,87,46,.45)':'';
  // grid overlay
  const gOn=lt>3.05;$('#gb',el).classList.toggle('on',gOn);const g=$('#gov',el);g.style.display=gOn?'block':'none';
  if(gOn){const r=rel(el,$('.scards',el));g.style.left=r.x+'px';g.style.top=r.y+'px';g.style.width=r.w+'px';g.style.height=r.h+'px';
   if(!g.dataset.b){g.dataset.b=1;const cw=(r.w-44-32)/3;let h='';const xs=[22,22+cw,22+cw+16,22+2*cw+16,22+2*cw+32,22+3*cw+32];
    h+=`<div style="position:absolute;inset:6px 22px 22px;background:repeating-linear-gradient(45deg,rgba(186,104,200,.0) 0 6px,rgba(186,104,200,.0) 6px 12px)"></div>`;
    [[xs[1],xs[2]],[xs[3],xs[4]]].forEach(([a1,b1])=>h+=`<div style="position:absolute;left:${a1}px;width:${b1-a1}px;top:6px;bottom:22px;background:repeating-linear-gradient(45deg,rgba(199,110,220,.55) 0 2px,transparent 2px 6px)"></div>`);
    xs.forEach((x,i)=>h+=`<div style="position:absolute;left:${x}px;top:6px;bottom:22px;border-left:2px dashed #C76EDC"></div>`);
    [1,2,3,4].forEach((n,i)=>h+=`<div style="position:absolute;left:${[xs[0],xs[2],xs[4],xs[5]][i]-10}px;top:-16px;background:#C76EDC;color:#fff;font:700 11px JBM;padding:1px 5px;border-radius:3px">${n}</div>`);
    h+=`<div style="position:absolute;left:22px;right:22px;top:6px;bottom:22px;border:2px solid #C76EDC"></div>`;g.innerHTML=h;}}
 },cursor:[[0,900,700],[0.35,['#brcb',0.5,0.5],1],[1.2,['#sw',0.5,0.5],1],[1.6,['#hk',0.5,0.5]],[2.4,['#hk',0.5,0.5]],[2.45,['#hovb',0.5,0.5],1],[2.65,['#hovc',0.2,0.5],1],[2.95,['#gb',0.5,0.5],1],[3.7,['#gb',0.6,0.6]]]});

function hslHex(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('').toUpperCase()}

const conLines=[
 {t:0.15,in:"document.title",out:`<span class="st">'Driftwood — Specialty Coffee'</span>`,d:0.5},
 {t:0.75,in:"$0",out:`<span class="tg">&lt;a</span> <span class="an">class</span>=<span class="av">"btn cta"</span> <span class="an">href</span>=<span class="av">"/shop"</span><span class="tg">&gt;</span>Order beans →<span class="tg">&lt;/a&gt;</span>`,d:0.3},
 {t:1.15,in:"$$('img').length",out:`<span class="nm">12</span>`,d:0.45},
 {t:1.7,in:"console.table(orders)",table:true,d:0.5},
 {t:2.75,in:"console.warn('Low stock:', 'Kenya Nyeri')",warn:`Low stock: Kenya Nyeri`,d:0.55,loc:'VM88:1'},
 {t:3.45,in:"await fetch('/api/cart', {method:'POST'})",err:`POST https://driftwood.coffee/api/cart <b>500 (Internal Server Error)</b>\n    (anonymous)  @ VM212:1`,d:0.55,loc:'VM212:1'},
 {t:4.25,in:"console.time('render'); renderCart(); console.timeEnd('render')",log:`render: <span class="nm">12.84</span> ms`,d:0.7,loc:'cart.js:52'},
 {t:5.1,in:"copy($0.outerHTML)",out:`<span style="color:#9AA0A6">undefined</span>   <span style="color:#81C995;font-family:Plex;font-size:13px">✓ copied to clipboard</span>`,d:0.3},
];
scene(3,{id:'console',acc:'#FFE599',label:'CONSOLE',water:'> CONSOLE $0 $$ > CONSOLE',
 info:{kick:'CH 04 · CONSOLE',name:'CONSOLE',sub:'A <em>live REPL</em> running inside the page, plus every log, warning and error it throws.',keys:[[['Ctrl','Shift','J'],'open'],[['Ctrl','L'],'clear']],b0:0.6,bs:0.62,
  bul:['<code>$0</code>…<code>$4</code> recent picks · <code>$_</code> last result','<code>$(sel)</code> <code>$$(sel)</code> <code>$x(xpath)</code> query helpers','<code>console.table</code> · <code>group</code> · <code>time</code> · <code>count</code> · <code>trace</code>','<b>Live Expressions</b> (eye icon) re-evaluate constantly','Filter by level, text or <code>/regex/</code> · hide network','<code>copy()</code> · <code>monitor(fn)</code> · <code>getEventListeners()</code>']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Console','e1w1')}
 <div class="tb">${I.clear}<span style="padding:0 6px;border:1px solid #45474C;border-radius:4px">top ▾</span><span id="eyeb">${I.eye}</span><div class="inp" style="min-width:260px">Filter</div><span id="lv" style="position:relative">Default levels ▾</span><span style="margin-left:auto" class="badge iss">■ 2 Issues</span>${I.gear}</div>
 <div class="live" id="live"><div><span style="color:#9AA0A6">⊙</span><b>performance.now()</b></div><div style="padding-left:24px"><span id="pn">0</span></div><div><span style="color:#9AA0A6">⊙</span><b>cart.items.length</b></div><div style="padding-left:24px"><span>3</span></div></div>
 <div class="con" id="con">${conLines.map((c,i)=>`<div class="cl in" data-i="${i}"><span class="typ"></span></div>`+
  (c.out?`<div class="cl out" data-o="${i}">${c.out}</div>`:'')+
  (c.table?`<div class="cl" data-o="${i}" style="padding-left:34px"><table class="ctab"><tr><th>(index)</th><th>id</th><th>item</th><th>qty</th><th>total</th></tr><tr><td>0</td><td class="st">'A-1042'</td><td class="st">'Ethiopia Guji'</td><td class="nm">2</td><td class="nm">37</td></tr><tr><td>1</td><td class="st">'A-1043'</td><td class="st">'Colombia Huila'</td><td class="nm">1</td><td class="nm">17</td></tr><tr><td>2</td><td class="st">'A-1044'</td><td class="st">'Kenya Nyeri'</td><td class="nm">3</td><td class="nm">58.5</td></tr></table><span style="color:#9AA0A6">Array(3)</span></div>`:'')+
  (c.warn?`<div class="cl warn" data-o="${i}">${c.warn}<span class="loc">${c.loc}</span></div>`:'')+
  (c.err?`<div class="cl err" data-o="${i}">${c.err}<span class="loc">${c.loc}</span></div>`:'')+
  (c.log?`<div class="cl" data-o="${i}">${c.log}<span class="loc">${c.loc}</span></div>`:'')).join('')}
  <div class="cl in" id="prompt"><span class="caret"></span></div>
 </div>
 <div class="ctx" id="lvm" style="right:320px;top:74px;display:none;min-width:200px"><div>☑ Verbose</div><div>☑ Info</div><div class="h">☑ Warnings</div><div>☑ Errors</div></div>
 </div>`,{dock:'bottom',page:128})}</div>`,
 update(lt,el){$('#pn',el).textContent=(18422.6+lt*1000).toFixed(1);
  let typing=-1;
  conLines.forEach((c,i)=>{const row=$(`[data-i="${i}"]`,el);const on=lt>=c.t;row.style.display=on?'block':'none';
   const n=Math.floor((lt-c.t)*62);const done=n>=c.in.length;row.querySelector('.typ').innerHTML=esc(c.in.slice(0,Math.max(0,n)))+(on&&!done?'<span class="caret"></span>':'');if(on&&!done)typing=i;
   $$(`[data-o="${i}"]`,el).forEach(o=>o.style.display=lt>=c.t+c.d?'block':'none')});
  $('#prompt',el).style.display=typing<0?'block':'none';
  $('#lvm',el).style.display=lt>5.3?'block':'none';
 },cursor:[[0,1050,650],[4.9,1050,650],[5.25,['#lv',0.5,0.5],1],[5.6,['#lv',0.5,1.6]]]});

const code=["import { api } from './api.js';","","/** Sum the cart, apply bulk discount */","export function calcTotal(items) {","  let total = 0;","  for (const item of items) {","    const line = item.price * item.qty;","    total += line;","  }","  if (total > 100) total *= 0.9;","  return round(total);","}","","export async function checkout(cart) {","  const total = calcTotal(cart.items);","  const res = await api.post('/cart', { total });","  return res.json();","}"];
const items=[{n:'Ethiopia Guji',p:18.5,q:2},{n:'Colombia Huila',p:17,q:1},{n:'Kenya Nyeri',p:19.5,q:3}];
const dbgSteps=[ // [time, line, itemIdx, total, lineVal]
 [0.75,7,0,0,undefined],[1.35,8,0,0,37],[1.85,7,1,37,undefined],[2.35,8,1,37,17],[2.85,7,2,54,undefined]];
scene(3,{id:'sources',acc:'#F6B26B',label:'SOURCES',water:'BREAKPOINT ● STEP ⤼ BREAKPOINT',
 info:{kick:'CH 05 · SOURCES · DEBUGGER',name:'SOURCES',sub:'Pause real code mid-flight, then <em>step line by line</em> and read every variable.',keys:[[['F8'],'resume'],[['F10'],'over'],[['F11'],'into'],[['Shift','F11'],'out'],[['Ctrl','P'],'open file']],b0:0.75,bs:0.6,
  bul:['Click a line number → <b>breakpoint</b>','<b>Scope · Watch · Call Stack</b> at every pause','Inline values appear right in the code','<b style="color:#F6B26B">Conditional</b> breakpoints &amp; <b style="color:#FF7FC4">Logpoints</b> — no <code>console.log</code> edits','<code>{ }</code> pretty-prints minified bundles · source maps','<b>Overrides</b> persist edits · <b>Snippets</b> save scripts']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Sources','e1')}
 <div class="srcw"><div class="nav"><div class="subt"><span class="on">Page</span><span>Workspace</span><span>Overrides</span><span>Snippets</span></div>
  <div style="padding-top:4px">${[[0,'▾ <span class="fi cloud"></span> top'],[1,'▾ <span class="fi cloud"></span> driftwood.coffee'],[2,'▸ <span class="fi d"></span> css'],[2,'▾ <span class="fi d"></span> js'],[3,'<span class="fi js"></span> api.js'],[3,'<span class="fi js"></span> app.js'],[3,'<span class="fi js"></span> cart.js','sel'],[2,'▸ <span class="fi d"></span> img'],[2,'<span class="fi"></span> (index)'],[1,'▸ <span class="fi cloud"></span> cdn.jsdelivr.net'],[1,'▸ <span class="fi cloud"></span> fonts.gstatic.com']].map(([d,t,c])=>`<div class="f ${c||''}" style="--d:${d}">${t}</div>`).join('')}</div></div>
 <div class="ed"><div class="edt"><span>app.js ×</span><span class="on">cart.js ×</span><span style="margin-left:auto;border:0">{ }</span></div>
  <div class="code" id="code">${code.map((l,i)=>`<div class="ln" data-l="${i+1}"><span class="g">${i+1}<span class="bp" data-bp="${i+1}">${i+1}</span></span><span>${hl(l)}</span><span class="inl" style="display:none"></span></div>`).join('')}
   <div id="condbox" style="position:absolute;left:52px;top:0;right:12px;display:none;background:#2D2E31;border:1px solid #E37400;border-radius:4px;padding:8px 10px;font:400 13px Plex;color:#BDC1C6;z-index:3"><span style="color:#FCAD70">Conditional breakpoint ▾</span><div style="margin-top:6px;background:#1B1C1E;border:1px solid #45474C;padding:4px 8px;font:400 14px JBM;color:#E3E3E3" id="condtxt"></div></div>
  </div>
  <div id="lpout" style="display:none;border-top:1px solid var(--line);padding:4px 12px;font:400 13.5px JBM;background:#232428;color:#E3E3E3"><span style="color:#FF7FC4">◆ logpoint</span>&nbsp;&nbsp;posting <span class="nm">101.25</span><span style="float:right;color:#9AA0A6;text-decoration:underline">cart.js:16</span></div>
 </div>
 <div class="dbg"><div class="dbgb">${I.resume}${I.over}${I.into}${I.out}${I.step}${I.deact}</div>
  <div id="pausedMsg" style="display:none;padding:6px 12px;background:#3A3517;color:#FDD663;font:500 13px Plex;border-bottom:1px solid var(--line)">⏸ Paused on breakpoint</div>
  <div class="pane"><h4>Watch</h4><div><span class="vr">total &gt; 50</span>: <span class="kw" id="w1">false</span></div></div>
  <div class="pane"><h4>Breakpoints</h4><div id="bpl1" style="display:none"><span class="chk y" style="font-family:JBM">cart.js:7</span></div><div id="bpl2" style="display:none;color:#FCAD70"><span class="chk y">cart.js:10  total &gt; 100</span></div><div id="bpl3" style="display:none;color:#FF7FC4"><span class="chk y">cart.js:16  'posting', total</span></div></div>
  <div class="pane"><h4>Scope</h4><div style="color:#9AA0A6">▾ Local</div><div id="sc1" style="padding-left:28px"></div><div id="sc2" style="padding-left:28px"></div><div id="sc3" style="padding-left:28px"></div><div style="color:#9AA0A6">▸ Closure</div><div style="color:#9AA0A6">▸ Global <span style="float:right">Window</span></div></div>
  <div class="pane"><h4>Call Stack</h4><div id="cs" style="display:none"><div style="padding:0;background:#0B4A78">▸ calcTotal <span style="float:right;color:#9AA0A6">cart.js:7</span></div><div style="padding:0">&nbsp; checkout <span style="float:right;color:#9AA0A6">cart.js:15</span></div><div style="padding:0">&nbsp; onClick <span style="float:right;color:#9AA0A6">app.js:22</span></div><div style="padding:0;color:#9AA0A6">&nbsp; — async —</div></div></div>
 </div></div></div>`,{dock:'bottom',page:96,pageCls:'mini'})}
 <div class="ctx" id="gctx" style="display:none"><div>Add breakpoint</div><div class="h">Add conditional breakpoint…</div><div>Add logpoint…</div><div>Never pause here</div><hr><div>Continue to here</div></div></div>`,
 update(lt,el){const pb=$('.pagebox',el);
  if(!pb.querySelector('.pausebar')){pb.insertAdjacentHTML('beforeend','<div class="dim"></div><div class="pausebar">Paused in debugger <i>▶</i><i>⤼</i></div>')}
  const paused=lt>0.75&&lt<3.3;$('.pausebar',pb).style.display=paused?'flex':'none';$('.dim',pb).style.display=paused?'block':'none';
  $('#pausedMsg',el).style.display=paused?'block':'none';$('#cs',el).style.display=paused?'block':'none';
  $('[data-bp="7"]',el).style.display=lt>0.45?'block':'none';$('#bpl1',el).style.display=lt>0.45?'block':'none';
  let st=null;dbgSteps.forEach(s=>{if(lt>=s[0])st=s});if(!paused)st=null;
  $$('.ln',el).forEach(l=>{l.classList.toggle('cur',!!st&&+l.dataset.l===st[1]);l.querySelector('.inl').style.display='none'});
  if(st){const it=items[st[2]];
   $('#sc1',el).innerHTML=`<span class="vr">item</span>: <span style="color:#9AA0A6">{name: <span class="st">'${it.n}'</span>, price: <span class="nm">${it.p}</span>, qty: <span class="nm">${it.q}</span>}</span>`;
   $('#sc2',el).innerHTML=`<span class="vr">line</span>: ${st[4]===undefined?'<span style="color:#9AA0A6">undefined</span>':`<span class="nm" style="background:rgba(255,229,153,.25)">${st[4]}</span>`}`;
   $('#sc3',el).innerHTML=`<span class="vr">total</span>: <span class="nm" ${st[3]?'style="background:rgba(255,229,153,.25)"':''}>${st[3]}</span>`;
   $('#w1',el).textContent=st[3]>50?'true':'false';
   const inl=(ln,t)=>{const x=$(`[data-l="${ln}"] .inl`,el);x.style.display='inline';x.textContent=t};
   inl(5,`total = ${st[3]}`);inl(6,`item = {name: '${it.n}', …}`);if(st[4]!==undefined)inl(7,`line = ${st[4]}`);
  }else{['#sc1','#sc2','#sc3'].forEach(s=>$(s,el).innerHTML='');$('#sc1',el).innerHTML='<span style="color:#9AA0A6">Not paused</span>'}
  const ctx=$('#gctx',el);ctx.style.display=lt>3.35&&lt<3.7?'block':'none';if(lt>3.3){const r=rel(el,$('[data-l="10"] .g',el));ctx.style.left=(r.x+40)+'px';ctx.style.top=(r.y-150)+'px'}
  const cb=$('#condbox',el);const cOn=lt>3.7&&lt<4.5;cb.style.display=cOn?'block':'none';if(cOn){cb.style.top=($('[data-l="10"]',el).offsetTop+27)+'px';const s='total > 100';$('#condtxt',el).innerHTML=esc(s.slice(0,Math.floor((lt-3.75)*30)))+'<span class="caret"></span>'}
  $('[data-bp="10"]',el).style.display=lt>4.45?'block':'none';$('[data-bp="10"]',el).className='bp cond';$('#bpl2',el).style.display=lt>4.45?'block':'none';
  $('[data-bp="16"]',el).style.display=lt>4.8?'block':'none';$('[data-bp="16"]',el).className='bp log';$('#bpl3',el).style.display=lt>4.8?'block':'none';
  $('#lpout',el).style.display=lt>5.15?'block':'none';
 },cursor:[[0,700,700],[0.4,['[data-l="7"] .g',0.6,0.5],1],[1.2,['.dbgb svg:nth-child(2)',0.5,0.5],1],[1.75,['.dbgb svg:nth-child(2)',0.5,0.5],1],[2.25,['.dbgb svg:nth-child(2)',0.5,0.5],1],[2.75,['.dbgb svg:nth-child(2)',0.5,0.5],1],[3.2,['.dbgb svg:nth-child(1)',0.5,0.5],1],[3.35,['[data-l="10"] .g',0.6,0.5],1],[3.6,['[data-l="10"] .g',2.4,-5.2],1],[4.6,['[data-l="16"] .g',0.6,0.5],1],[5.6,['[data-l="16"] .g',1.2,0.5]]]});

const reqs=[['shop','200','document','Other','14.2 kB',0,212,1],['app.css','200','stylesheet','shop','8.1 kB',230,64],['inter.woff2','200','font','app.css','48.3 kB',300,88],['app.js','200','script','shop','42.7 kB',232,120],['cart.js','200','script','app.js','6.4 kB',360,41],['hero.avif','200','avif','shop','182 kB',240,260],['guji.webp','200','webp','shop','34.2 kB',420,96],['huila.webp','200','webp','shop','31.8 kB',424,91],['nyeri.webp','200','webp','shop','36.0 kB',430,102],['products?limit=12','200','fetch','app.js:41','3.1 kB',520,148],['cart','500','fetch','cart.js:16','412 B',700,310],['analytics.js','200','script','(index)','22.5 kB',560,76],['collect?v=2','204','ping','analytics.js','0 B',760,35],['manifest.json','200','manifest','Other','1.1 kB',820,12],['sw.js','200','script','(index)','3.4 kB',840,26],['favicon.svg','200','svg+xml','Other','912 B',870,14]];
scene(3,{id:'network',acc:'#3FD8F2',label:'NETWORK',water:'200 304 404 500 · NETWORK',
 info:{kick:'CH 06 · NETWORK',name:'NETWORK',sub:'Every request the page makes, with <em>status, size and a timing waterfall</em>.',keys:[[['Ctrl','Shift','R'],'hard reload'],[['Ctrl','F'],'search bodies']],
  legend:'<span style="--c:#9AA0A6">queue</span><span style="--c:#26A69A">DNS</span><span style="--c:#F6B26B">connect</span><span style="--c:#B388FF">TLS</span><span style="--c:#81C995">TTFB</span><span style="--c:#4FA3F7">download</span>',b0:0.7,bs:0.6,
  bul:['Filter: <b>Fetch/XHR · Doc · CSS · JS · Font · Img · WS</b>','Throttle: <b>Fast 4G · Slow 4G · Offline</b> · custom','<b>Disable cache</b> + <b>Preserve log</b> across reloads','Headers · Payload · Preview · Response · Timing','<b>Copy as cURL / fetch</b> · Block URL · Replay XHR','Export / import <b>HAR</b> · Override responses']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Network','e1')}
 <div class="tb"><span id="recb">${I.rec}</span>${I.clear}${I.funnel}<div class="sep"></div><span class="chk y">Preserve log</span><span class="chk y">Disable cache</span><span id="thr" style="padding:1px 8px;border:1px solid #45474C;border-radius:4px;position:relative">No throttling ▾</span><span style="margin-left:auto">${I.dl}</span>${I.gear}</div>
 <div class="tb"><div class="inp" style="min-width:150px">Filter</div><div class="chips"><span class="on">All</span><span>Fetch/XHR</span><span>Doc</span><span>CSS</span><span>JS</span><span>Font</span><span>Img</span><span>Media</span><span>Manifest</span><span>WS</span><span>Wasm</span><span>Other</span></div></div>
 <div class="ov" id="ov"></div>
 <div class="nt"><div class="ntrow h"><span>Name</span><span>Status</span><span>Type</span><span>Initiator</span><span>Size</span><span>Time</span><span>Waterfall</span></div>
 ${reqs.map((r,i)=>`<div class="ntrow ${r[1]==='500'?'bad':''}" data-r="${i}"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span style="color:${r[1]==='500'?'':'#8AB4F8'};text-decoration:underline">${r[3]}</span><span>${r[4]}</span><span class="tm">${r[6]} ms</span><span class="wf"></span></div>`).join('')}
 <div id="thm" class="ctx" style="display:none;left:290px;top:-4px;min-width:200px"><div style="color:#9AA0A6;font-size:12px">Presets</div><div>No throttling</div><div>Fast 4G</div><div class="h">Slow 4G</div><div>3G</div><div>Offline</div><hr><div>Custom… Add</div></div>
 <div class="drawer" id="drw" style="display:none"><div class="subt" style="border-top:0"><span>✕</span><span class="on">Headers</span><span>Payload</span><span>Preview</span><span>Response</span><span>Initiator</span><span>Timing</span><span>Cookies</span></div>
  <div class="hdr"><h5>General</h5><div><span class="k">Request URL</span><span class="v">https://driftwood.coffee/api/cart</span></div><div><span class="k">Request Method</span><span class="v">POST</span></div><div><span class="k">Status Code</span><span class="v"><i class="dot"></i>500 Internal Server Error</span></div><div><span class="k">Remote Address</span><span class="v">104.18.22.7:443</span></div><div><span class="k">Referrer Policy</span><span class="v">strict-origin-when-cross-origin</span></div>
  <h5>Response Headers</h5><div><span class="k">content-type</span><span class="v">application/json</span></div><div><span class="k">cache-control</span><span class="v">no-store</span></div><div><span class="k">server</span><span class="v">cloudflare</span></div><div><span class="k">x-request-id</span><span class="v">7f3a9c2e-51b0</span></div>
  <h5>Request Headers</h5><div><span class="k">content-type</span><span class="v">application/json</span></div><div><span class="k">cookie</span><span class="v">session=8f2c…e91; cart_id=…</span></div><div><span class="k">origin</span><span class="v">https://driftwood.coffee</span></div></div></div>
 <div class="ctx" id="nctx" style="display:none;left:150px;top:250px"><div>Open in new tab</div><div>Clear browser cache</div><hr><div class="h">Copy as cURL (bash) <small>▸</small></div><div>Copy as fetch</div><div>Copy response</div><hr><div>Block request URL</div><div>Replay XHR</div><div>Override content</div><hr><div>Save all as HAR with content</div></div>
 </div>
 <div class="status" id="stat"></div>
 </div>`,{dock:'bottom',page:96,pageCls:'mini'})}</div>`,
 update(lt,el){const slow=lt>2.3;const k=slow?lerp(1,3.2,E.io(clamp((lt-2.3)/0.9))):1;
  const rowsIn=slow?2.35:0.1;const W=$('.wf',el).offsetWidth||380;const span=slow?6000:2000;
  $('#thm',el).style.display=lt>1.75&&lt<2.3?'block':'none';$('#thr',el).textContent=slow?'Slow 4G ▾':'No throttling ▾';$('#thr',el).style.color=slow?'#FDD663':'';
  reqs.forEach((r,i)=>{const row=$(`[data-r="${i}"]`,el);const t0=rowsIn+i*0.07;const vis=lt>=t0;row.style.visibility=vis?'visible':'hidden';
   const grow=clamp((lt-t0)/0.5);const st=r[5]*k, du=r[6]*k*grow;
   row.querySelector('.tm').textContent=Math.round(r[6]*k*Math.max(grow,.02))+' ms';
   const px=v=>v/span*W;let h='';let x=px(st);const segs=r[7]?[['#9AA0A6',.05],['#26A69A',.12],['#F6B26B',.14],['#B388FF',.14],['#81C995',.35],['#4FA3F7',.2]]:[['#9AA0A6',.08],['#81C995',.6],['#4FA3F7',.32]];
   segs.forEach(([c,f])=>{const w=Math.max(1,px(du*f));h+=`<i style="left:${x}px;width:${w}px;background:${c}"></i>`;x+=w});row.querySelector('.wf').innerHTML=h;
   row.classList.toggle('pick',lt>3.55&&i===10)});
  const ov=$('#ov',el);const OW=ov.offsetWidth;const dcl=412*k,ld=1210*k;
  let oh=`<div style="position:absolute;left:${dcl/(slow?6000:2000)*OW}px;top:0;bottom:0;border-left:2px solid #8AB4F8"></div><div style="position:absolute;left:${ld/(slow?6000:2000)*OW}px;top:0;bottom:0;border-left:2px solid #F28B82"></div>`;
  reqs.forEach((r,i)=>{const t0=rowsIn+i*0.07;if(lt<t0)return;const g=clamp((lt-t0)/0.5);oh+=`<i style="position:absolute;top:${6+i*3}px;height:2px;left:${r[5]*k/(slow?6000:2000)*OW}px;width:${Math.max(2,r[6]*k*g/(slow?6000:2000)*OW)}px;background:${r[1]==='500'?'#F28B82':'#4FA3F7'}"></i>`});
  [0,1,2,3,4,5,6].forEach(n=>{if(n*(slow?1000:500)<(slow?6000:2000))oh+=`<span style="position:absolute;left:${n*(slow?1000:500)/(slow?6000:2000)*OW+3}px;top:40px;font:400 11px Plex;color:#6E7379">${n*(slow?1000:500)} ms</span>`});ov.innerHTML=oh;
  $('#stat',el).innerHTML=`16 requests │ 432 kB transferred │ 1.3 MB resources │ Finish: ${(1.84*k).toFixed(2)} s │ <span class="dcl">DOMContentLoaded: ${Math.round(dcl)} ms</span> │ <span class="ld">Load: ${(ld/1000).toFixed(2)} s</span>`;
  $('#drw',el).style.display=lt>3.6?'flex':'none';$('#nctx',el).style.display=lt>4.6?'block':'none';
  $('#recb',el).style.opacity=(Math.floor(lt*4)%2)?1:.4;
 },cursor:[[0,900,700],[1.6,['#thr',0.5,0.5],1],[2.05,['#thr',0.5,0.5]],[2.2,['#thm .h',0.4,0.5],1],[3.4,['[data-r="10"] span',0.4,0.5],1],[4.45,['[data-r="10"] span',0.4,0.5],1],[4.8,['#nctx .h',0.4,0.5]],[5.6,['#nctx .h',0.5,0.5]]]});

/* flame chart data */
const flame=[];(function(){const R=rng(7);
 const F=(s,d,dep,l,c,lt)=>flame.push({s,d,dep,l,c,lt});
 const Y='#F2C94C',Y2='#E6B84B',P='#A67CF7',G='#7CC57C',Gy='#8E9297',Bl='#6FA8DC';
 F(60,110,0,'Task',Gy);F(62,40,1,'Parse HTML',Bl);F(104,64,1,'Evaluate Script',Y);F(106,20,2,'Compile Code',Y2);F(128,40,2,'(anonymous)',Y2);F(130,34,3,'renderProducts',Y);F(134,22,4,'createElement',Y2);
 F(300,38,0,'Task',Gy);F(302,30,1,'Recalculate Style',P);F(334,4,1,'Layout',P);
 F(420,70,0,'Task',Gy);F(422,66,1,'Evaluate Script',Y);F(424,50,2,'app.js',Y2);F(430,30,3,'hydrate',Y);F(436,18,4,'JSON.parse',Y2);
 F(980,286,0,'Task',Gy,1);F(982,282,1,'Event: click',Y);F(984,190,2,'Function Call',Y2);F(986,186,3,'onClick',Y);F(988,120,4,'checkout',Y);F(990,70,5,'calcTotal',Y2);F(1062,44,5,'renderCart',Y2);F(1064,30,6,'innerHTML',Y);F(1110,58,4,'updateBadge',Y);F(1112,50,5,'getBoundingClientRect',P);F(1176,36,2,'Recalculate Style',P);F(1214,42,2,'Layout',P,1);F(1258,6,2,'Paint',G);
 F(1400,30,0,'Task',Gy);F(1402,16,1,'Timer Fired',Y);F(1420,8,1,'Paint',G);F(1440,10,0,'Composite Layers',G);
 F(1700,120,0,'Task',Gy,1);F(1702,110,1,'Animation Frame Fired',Y);F(1704,96,2,'updateCarousel',Y2);F(1710,40,3,'Layout',P);F(1760,30,3,'Recalculate Style',P);
 F(2200,60,0,'Task',Gy,1);F(2202,54,1,'Event: load',Y);F(2204,40,2,'Run Microtasks',Y2);F(2206,32,3,'JSON.parse',Y);
 for(let i=0;i<22;i++){const s=500+R()*2400;if((s>970&&s<1280)||(s>1690&&s<1830)||(s>2190&&s<2270))continue;const d=4+R()*18;F(s,d,0,'Task',Gy);F(s+1,d-2,1,['Timer Fired','Paint','Parse HTML','Minor GC','XHR Load'][i%5],[Y,G,Bl,Y2,Y][i%5])}
})();
scene(3,{id:'perf',acc:'#FF4F8B',label:'PERF',water:'60FPS · 16.7MS · LONG TASK',
 info:{kick:'CH 07 · PERFORMANCE',name:'PERFORMANCE',sub:'Record a moment, then read the <em>main thread</em> millisecond by millisecond.',keys:[[['Ctrl','E'],'record'],[['Ctrl','Shift','E'],'reload + profile'],[['W','A','S','D'],'zoom & pan']],b0:0.7,bs:0.62,
  bul:['Flame chart: <b>who ran, for how long, called by whom</b>','<b style="color:#F28B82">Red corner</b> = Long Task &gt; 50 ms blocks input','Live <b>Core Web Vitals</b>: LCP · CLS · INP','<b>CPU 4× / 6× slowdown</b> to fake a mid-range phone','Colors: <b style="color:#F2C94C">scripting</b> · <b style="color:#A67CF7">rendering</b> · <b style="color:#7CC57C">painting</b>','Bottom-Up / Call Tree find the heaviest functions']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Performance')}
 <div class="tb"><span id="prec">${I.rec}</span><span>⟳</span>${I.clear}<div class="sep"></div><span>driftwood.coffee ▾</span><span class="chk y">Screenshots</span><span class="chk">Memory</span><span style="margin-left:auto;color:#FDD663">CPU: 4× slowdown</span><span style="color:#FDD663">Network: Fast 4G</span>${I.gear}</div>
 <div id="precd" style="position:absolute;left:50%;top:190px;transform:translateX(-50%);width:420px;background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;padding:18px 20px;z-index:5;font:400 14px Plex;color:#E3E3E3;box-shadow:0 10px 30px rgba(0,0,0,.5)"><div style="display:flex;justify-content:space-between"><b id="prst">Recording</b><span class="mono" id="prt">0.0 s</span></div><div style="height:6px;background:#45474C;border-radius:3px;margin:12px 0"><i id="prb" style="display:block;height:100%;background:#8AB4F8;border-radius:3px;width:0"></i></div><div style="text-align:right"><span style="background:#8AB4F8;color:#202124;padding:5px 14px;border-radius:14px;font-weight:600">Stop</span></div></div>
 <div id="pres" style="flex:1;display:flex;flex-direction:column;min-height:0">
  <div style="height:78px;flex:none;position:relative;border-bottom:1px solid var(--line);background:#1B1C1F" id="povw"></div>
  <div class="track" style="height:34px"><b>Frames</b><div id="frames"></div></div>
  <div class="track" style="height:30px"><b>Interactions</b><div><i style="position:absolute;left:0;top:7px;height:16px;border-radius:3px;background:#F6B26B;font:600 11px/16px Plex;color:#111;padding:0 6px;font-style:normal" id="inter">click · 240 ms</i></div></div>
  <div class="track" style="height:28px"><b>Timings</b><div id="timings"></div></div>
  <div class="track" style="flex:1;min-height:0"><b>Main<br><small style="color:#6E7379;font-weight:400">driftwood.coffee</small></b><div class="flame" id="flame"></div></div>
  <div style="height:150px;flex:none;border-top:1px solid var(--line);display:flex">
   <div style="flex:1;padding:10px 14px;font:400 13.5px/1.6 Plex;color:#BDC1C6" id="psum"></div>
   <div style="width:400px;padding:10px 14px;border-left:1px solid var(--line)" class="vit"><div><b>LCP</b><span class="g">1.62 s</span><small>good</small></div><div><b>CLS</b><span class="g">0.02</span><small>good</small></div><div><b>INP</b><span class="o">240 ms</span><small>needs work</small></div></div>
  </div>
 </div></div>`,{dock:'bottom',page:0})}<div class="tip" id="ptip"></div></div>`,
 update(lt,el){const rec=lt<1.15;$('#precd',el).style.display=rec?'block':'none';$('#pres',el).style.visibility=rec?'hidden':'visible';
  $('#prt',el).textContent=(Math.min(lt,0.8)*3.75).toFixed(1)+' s';$('#prst',el).textContent=lt<0.8?'Recording':'Loading profile…';$('#prb',el).style.width=(lt<0.8?clamp(lt/0.8)*100:clamp((lt-0.8)/0.35)*100)+'%';
  if(rec)return;
  const z=E.io(clamp((lt-1.8)/0.9));const v0=lerp(0,880,z),v1=lerp(3000,1360,z);const fl=$('#flame',el);const W=fl.offsetWidth;
  if(!fl.dataset.b){fl.dataset.b=1;fl.innerHTML=flame.map((f,i)=>`<i data-f="${i}" class="${f.lt?'lt':''}" style="top:${4+f.dep*20}px;background:${f.c}">${f.l}</i>`).join('')}
  $$('i',fl).forEach(n=>{const f=flame[+n.dataset.f];const x=(f.s-v0)/(v1-v0)*W,w=f.d/(v1-v0)*W;n.style.left=x+'px';n.style.width=Math.max(1,w)+'px';n.style.color=w>40?'#1B1B1B':'transparent';n.style.outline=(lt>2.85&&f.s===980&&f.dep===0)?'2px solid #8AB4F8':''});
  const px=v=>(v-v0)/(v1-v0)*W;
  $('#timings',el).innerHTML=[[180,'DCL','#8AB4F8'],[610,'FCP','#81C995'],[1620,'LCP','#0F9D58'],[1210,'L','#F28B82']].map(([t,l,c])=>`<i style="position:absolute;left:${px(t)}px;top:5px;font:700 11px/16px JBM;color:#111;background:${c};padding:0 4px;border-radius:2px;font-style:normal">${l}</i>`).join('');
  $('#inter',el).style.left=px(980)+'px';$('#inter',el).style.width=Math.max(20,px(1220)-px(980))+'px';
  let fh='';for(let t=0;t<3000;t+=16.7){const long=(t>980&&t<1266)||(t>1700&&t<1820);fh+=`<i style="position:absolute;left:${px(t)}px;width:${Math.max(1,px(t+16.7)-px(t)-1)}px;top:4px;bottom:4px;background:${long?'#F28B82':'#81C995'};opacity:${long?.9:.55}"></i>`}$('#frames',el).innerHTML=fh;
  const pv=$('#povw',el);if(!pv.dataset.b){pv.dataset.b=1;const OW=pv.offsetWidth;let s='<svg width="'+OW+'" height="78" style="position:absolute;left:0;top:0">';const dens=t=>flame.filter(f=>f.dep===1&&t>=f.s&&t<f.s+f.d).length;
   let pY='M0 78',pP='M0 78';for(let x=0;x<=OW;x+=4){const t=x/OW*3000;const d=dens(t);const busy=flame.some(f=>f.dep===0&&t>=f.s&&t<f.s+f.d);pY+=` L${x} ${busy?78-(d?44:10):78}`;pP+=` L${x} ${busy?78-(d?54:14):78}`}
   s+=`<path d="${pP} L${OW} 78Z" fill="#A67CF7" opacity=".8"/><path d="${pY} L${OW} 78Z" fill="#F2C94C"/>`;for(let i=0;i<9;i++)s+=`<rect x="${i*OW/9+4}" y="4" width="${OW/9-8}" height="22" rx="2" fill="#F4EFE8" opacity=".85"/><rect x="${i*OW/9+10}" y="10" width="${(OW/9-20)*(i<2?.2:.7)}" height="5" fill="#1C1714" opacity=".7"/><rect x="${i*OW/9+10}" y="18" width="${i<3?0:(OW/9-20)*.4}" height="4" fill="#E4572E"/>`;s+='</svg>';pv.innerHTML=s+'<div id="vwin" style="position:absolute;top:0;bottom:0;border:1.5px solid #8AB4F8;background:rgba(138,180,248,.12)"></div>'}
  const OW=pv.offsetWidth;$('#vwin',el).style.left=(v0/3000*OW)+'px';$('#vwin',el).style.width=((v1-v0)/3000*OW)+'px';
  const sel=lt>2.85;$('#psum',el).innerHTML=sel?`<b style="color:#E3E3E3;font-size:15px">Task</b> <span style="color:#F28B82;margin-left:8px">⚠ Long task took <b>236.43 ms</b> (≥ 50 ms)</span><br>Total time <span class="mono">286.43 ms</span> &nbsp;·&nbsp; Self time <span class="mono">4.12 ms</span><br><span style="display:inline-flex;gap:16px;margin-top:6px">${[['#F2C94C','Scripting','842 ms'],['#A67CF7','Rendering','214 ms'],['#7CC57C','Painting','96 ms'],['#8E9297','System','121 ms'],['#E3E3E3','Idle','1,727 ms']].map(([c,a,b])=>`<span><i style="display:inline-block;width:10px;height:10px;background:${c};margin-right:5px"></i>${a} <span class="mono">${b}</span></span>`).join('')}</span>`:
   `<b style="color:#E3E3E3">Summary</b> · Range 0 – 3,000 ms<br><span style="display:inline-flex;gap:16px;margin-top:6px">${[['#F2C94C','Scripting','842 ms'],['#A67CF7','Rendering','214 ms'],['#7CC57C','Painting','96 ms'],['#8E9297','System','121 ms']].map(([c,a,b])=>`<span><i style="display:inline-block;width:10px;height:10px;background:${c};margin-right:5px"></i>${a} <span class="mono">${b}</span></span>`).join('')}</span><br><span style="color:#9AA0A6">Bottom-up · Call tree · Event log</span>`;
  const tip=$('#ptip',el);if(lt>2.6&&lt<2.85){const n=$('[data-f="15"]',el);const r=rel(el,n);tip.style.display='block';tip.style.left=(r.x+30)+'px';tip.style.top=(r.y-58)+'px';tip.innerHTML='<b class="mono">286.43 ms</b> Task<br><span style="color:#D93025">Long task took 236.43 ms.</span>'}else tip.style.display='none';
 },cursor:[[0,900,700],[0.6,['#precd span span',0.5,0.5]],[0.75,['#precd span span',0.5,0.5],1],[2.4,700,500],[2.75,['[data-f="15"]',0.3,0.5],1],[5.6,['[data-f="15"]',0.35,0.5]]]});

scene(2,{id:'memory',acc:'#B388FF',label:'MEMORY',water:'HEAP · DETACHED · RETAINERS',
 info:{kick:'CH 08 · MEMORY',name:'MEMORY',sub:'Find <em>leaks</em>: what is on the heap, and who is still holding it.',keys:[[['🗑'],'force GC first']],b0:0.45,bs:0.45,
  bul:['<b>Heap snapshot</b> · <b>Allocations on timeline</b> · Sampling','<b>Comparison</b> view shows growth between snapshots','Filter <code>Detached</code> → DOM removed but still referenced','<b>Retainers</b> explain why an object can’t be freed','Shallow vs <b>Retained size</b> — what freeing it saves']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Memory')}
 <div class="tb">${I.rec}${I.clear}<span>🗑</span><div class="sep"></div><span id="cmpb" style="padding:1px 8px;border:1px solid #45474C;border-radius:4px">Summary ▾</span><div class="inp" id="clsf" style="min-width:200px">Class filter</div><span>All objects ▾</span></div>
 <div style="flex:1;display:flex;min-height:0">
  <div style="width:220px;border-right:1px solid var(--line);font:400 13.5px/26px Plex;padding:6px 0">
   <div style="padding:0 12px;color:#9AA0A6;font:600 11px/26px Plex;letter-spacing:.06em">HEAP SNAPSHOTS</div>
   <div style="padding:0 12px" id="s1"><span style="color:#8AB4F8">▣</span> Snapshot 1 <span style="float:right" class="mono">12.4 MB</span></div>
   <div style="padding:0 12px" id="s2"><span style="color:#8AB4F8">▣</span> Snapshot 2 <span style="float:right" class="mono">18.9 MB</span></div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;min-width:0;position:relative">
   <div id="mprog" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font:400 15px Plex;color:#E3E3E3"><div>Snapshot 2 — <span id="mpt">Building dominator tree…</span></div><div style="width:360px;height:6px;background:#45474C;border-radius:3px"><i id="mpb" style="display:block;height:100%;width:0;background:#8AB4F8;border-radius:3px"></i></div></div>
   <div id="mtab" style="display:none;flex:1">
    <div id="alloc" style="height:64px;border-bottom:1px solid var(--line);position:relative;background:#1B1C1F"></div>
    <div class="ntrow h" style="grid-template-columns:1fr 90px 90px 90px 110px"><span>Constructor</span><span># New</span><span># Deleted</span><span># Delta</span><span>Size Delta</span></div>
    ${[['Detached &lt;div class="toast"&gt;','1,204','0','+1,204','+2.1 MB',1],['Detached &lt;img&gt;','402','0','+402','+860 kB',1],['Detached Text','3,611','0','+3,611','+115 kB',1],['(closure)','5,120','4,800','+320','+41 kB'],['Object','9,880','9,468','+412','+29 kB'],['Array','2,104','2,016','+88','+18 kB'],['(string)','14,202','12,188','+2,014','+306 kB'],['(compiled code)','1,006','1,001','+5','+12 kB'],['system / Context','640','610','+30','+3 kB']].map((r,i)=>`<div class="ntrow" data-m="${i}" data-det="${r[5]?1:0}" style="grid-template-columns:1fr 90px 90px 90px 110px;${r[5]?'color:#F6B26B':''}"><span>▸ ${r[0]}<span style="color:#9AA0A6"> ×${r[1]}</span></span><span class="mono">${r[1]}</span><span class="mono">${r[2]}</span><span class="mono">${r[3]}</span><span class="mono">${r[4]}</span></div>`).join('')}
    <div id="ret" style="display:none;border-top:2px solid var(--line);font:400 13.5px/24px JBM;padding:4px 0"><div style="padding:0 12px;font:600 13px/28px Plex;background:#27282C">Retainers <span style="color:#9AA0A6;font-weight:400">— Object · Distance · Shallow · Retained</span></div>
     <div style="padding:0 14px">▾ <span class="vr">[417]</span> in <span style="color:#F6B26B">Array</span> @84211 <span style="float:right;color:#9AA0A6">3 · 32 B · 2.1 MB</span></div><div style="padding:0 34px">▾ <span class="vr">toastCache</span> in <span style="color:#8AB4F8">Window</span> / driftwood.coffee <span style="float:right;color:#9AA0A6">2 · 64 B · 2.1 MB</span></div></div>
   </div>
  </div></div></div>`,{dock:'bottom',page:96})}</div>`,
 update(lt,el){const done=lt>0.95;$('#mprog',el).style.display=done?'none':'flex';$('#mtab',el).style.display=done?'block':'none';$('#s2',el).style.visibility=done?'visible':'hidden';$('#s2',el).style.background=done?'#0B4A78':'';
  $('#mpb',el).style.width=clamp(lt/0.9)*100+'%';$('#mpt',el).textContent=lt<0.45?'Snapshotting… '+Math.round(clamp(lt/0.45)*100)+'%':'Building dominator tree…';
  $('#cmpb',el).textContent=lt>1.2?'Comparison ▾':'Summary ▾';$('#cmpb',el).style.color=lt>1.2?'#8AB4F8':'';
  const fs='Detached';const ft=lt>1.55?fs.slice(0,Math.floor((lt-1.55)*28)):'';$('#clsf',el).innerHTML=ft?`<span style="color:#E3E3E3">${ft}</span>`:'Class filter';
  const filt=ft.length>=8;$$('[data-m]',el).forEach(r=>{r.style.display=filt&&r.dataset.det==='0'?'none':'grid';r.classList.toggle('pick',lt>2.45&&r.dataset.m==='0')});
  $('#ret',el).style.display=lt>2.5?'block':'none';
  const al=$('#alloc',el);if(done&&!al.dataset.b){al.dataset.b=1;const R=rng(3);let h='';for(let i=0;i<70;i++){const hgt=6+R()*40;const live=R()>.55||i>52;h+=`<i style="position:absolute;bottom:4px;left:${8+i*11}px;width:6px;height:${hgt}px;background:${live?'#4FA3F7':'#5F6368'}"></i>`}al.innerHTML=h+'<span style="position:absolute;right:10px;top:6px;font:400 11px Plex;color:#9AA0A6">blue = still alive · grey = collected</span>'}
 },cursor:[[0,700,600],[1.05,['#cmpb',0.5,0.5],1],[1.45,['#clsf',0.3,0.5],1],[2.35,['[data-m="0"]',0.2,0.5],1],[3.7,['[data-m="0"]',0.3,0.5]]]});

scene(2,{id:'app',acc:'#93C47D',label:'APP',water:'STORAGE · COOKIES · SW',
 info:{kick:'CH 09 · APPLICATION',name:'APPLICATION',sub:'Everything the site <em>stores on your machine</em> — readable and editable.',keys:[],b0:0.35,bs:0.45,
  bul:['<b>Local / Session storage</b>: double-click to edit','<b>Cookies</b>: HttpOnly · Secure · SameSite · Expires','<b>IndexedDB</b> &amp; <b>Cache storage</b> browsers','<b>Service workers</b>: update, bypass, go offline','<b>Manifest</b> &amp; install checks · bfcache test','<b>Clear site data</b> wipes it all in one click']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Application')}
 <div style="flex:1;display:flex;min-height:0">
  <div style="width:250px;flex:none;border-right:1px solid var(--line);font:400 13.5px/24px Plex;padding:4px 0;white-space:nowrap;overflow:hidden" id="atree">
   ${[['h','Application'],[1,'📄 Manifest'],[1,'⚙ Service workers'],[1,'▤ Storage','st'],['h','Storage'],[1,'▾ ▦ Local storage'],[2,'driftwood.coffee','ls'],[1,'▸ ▦ Session storage'],[1,'▸ ⛁ IndexedDB'],[2,'driftwood-db · orders'],[1,'▾ ◔ Cookies'],[2,'driftwood.coffee','ck'],[1,'▸ ⛁ Cache storage'],[1,'▸ ⛁ Storage buckets'],['h','Background services'],[1,'⇆ Back/forward cache'],[1,'✉ Push messaging']].map(([d,t,id])=>d==='h'?`<div style="padding:4px 10px 0;font:600 11.5px/24px Plex;color:#9AA0A6;letter-spacing:.04em">${t}</div>`:`<div ${id?`data-a="${id}"`:''} style="padding-left:${d*16+4}px">${t}</div>`).join('')}
  </div>
  <div style="flex:1;min-width:0;position:relative" id="amain">
   <div id="vls"><div class="tb"><span>⟳</span>${I.clear}<div class="inp">Filter</div></div><div class="ntrow h" style="grid-template-columns:180px 1fr"><span>Key</span><span>Value</span></div>
    ${[['theme','dark'],['cart','[{"id":"guji","qty":2},{"id":"huila","qty":1},{"id":"nyeri","qty":3}]'],['lastVisit','2026-09-24T21:14:03Z'],['ab_hero','B'],['consent','{"analytics":true,"ads":false}']].map((r,i)=>`<div class="ntrow" style="grid-template-columns:180px 1fr;font-family:JBM;font-size:13px"><span>${r[0]}</span><span ${i===0?'id="thv"':''}>${esc(r[1])}</span></div>`).join('')}
    <div style="padding:10px 14px;font:400 13px JBM;color:#9AA0A6;border-top:1px solid var(--line);margin-top:8px">▾ cart: Array(3)<br>&nbsp;&nbsp;▸ 0: {id: <span class="st">"guji"</span>, qty: <span class="nm">2</span>}<br>&nbsp;&nbsp;▸ 1: {id: <span class="st">"huila"</span>, qty: <span class="nm">1</span>}</div></div>
   <div id="vck" style="display:none"><div class="tb"><span>⟳</span>${I.clear}<div class="inp">Filter</div><span class="chk">Only show cookies with an issue</span></div>
    <div class="ntrow h" style="grid-template-columns:110px 1fr 130px 40px 110px 70px 70px 70px"><span>Name</span><span>Value</span><span>Domain</span><span>Path</span><span>Expires</span><span>HttpOnly</span><span>Secure</span><span>SameSite</span></div>
    ${[['session','8f2c1d…e91','driftwood.coffee','/','Session','✓','✓','Lax'],['csrf_token','Zk3…Qa9','driftwood.coffee','/','Session','✓','✓','Strict'],['cart_id','c_20931','.driftwood.coffee','/','2026-10-24','','✓','None'],['_ga','GA1.1.4471…','.driftwood.coffee','/','2027-10-29','','','Lax'],['theme','dark','driftwood.coffee','/','2027-09-24','','✓','Lax']].map((r,i)=>`<div class="ntrow" style="grid-template-columns:110px 1fr 130px 40px 110px 70px 70px 70px;font-size:13px;${i===2?'background:rgba(253,214,99,.12)!important':''}">${r.map((c,j)=>`<span style="${j>=5&&j<=6?'color:#81C995;text-align:center':''}${j===1?';font-family:JBM':''}">${c}</span>`).join('')}</div>`).join('')}
    <div style="padding:10px 14px;font:400 13px Plex;color:#FDD663">▲ cart_id: SameSite=None requires Secure — cookie will be rejected in cross-site contexts without it.</div></div>
   <div id="vst" style="display:none;padding:18px 22px;font:400 14px Plex;color:#E3E3E3"><div style="font:600 18px Plex">Storage</div><div style="color:#9AA0A6;margin:4px 0 14px">https://driftwood.coffee</div>
    <div style="display:flex;gap:28px;align-items:center"><svg viewBox="0 0 42 42" width="170" height="170" id="donut"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/></svg>
     <div style="font:400 14px/2 Plex"><div><b class="mono" id="usage" style="font-size:20px">4.2 MB</b> used of 1.8 GB quota</div><div><i style="display:inline-block;width:11px;height:11px;background:#4FA3F7;margin-right:8px"></i>IndexedDB <span class="mono">2.9 MB</span></div><div><i style="display:inline-block;width:11px;height:11px;background:#93C47D;margin-right:8px"></i>Cache storage <span class="mono">1.1 MB</span></div><div><i style="display:inline-block;width:11px;height:11px;background:#F6B26B;margin-right:8px"></i>Service workers <span class="mono">0.2 MB</span></div>
      <div style="margin-top:8px"><span id="csd" style="background:#8AB4F8;color:#202124;padding:6px 14px;border-radius:14px;font-weight:600">Clear site data</span></div></div></div></div>
  </div></div></div>`,{dock:'bottom',page:96})}</div>`,
 update(lt,el){const v=lt<1.35?'ls':lt<2.55?'ck':'st';$('#vls',el).style.display=v==='ls'?'block':'none';$('#vck',el).style.display=v==='ck'?'block':'none';$('#vst',el).style.display=v==='st'?'block':'none';
  $$('[data-a]',el).forEach(a=>a.style.background=a.dataset.a===v?'#0B4A78':'');
  const th=$('#thv',el);if(lt>0.55&&lt<0.95)th.innerHTML=`<span style="outline:1px solid #8AB4F8;padding:0 4px;background:#1B1C1E">${'light'.slice(0,Math.floor((lt-0.6)*20))}<span class="caret"></span></span>`;else th.textContent=lt>=0.95?'light':'dark';
  const cl=clamp((lt-3.05)/0.4);const f=1-E.out(cl);const segs=[[2.9,'#4FA3F7'],[1.1,'#93C47D'],[0.2,'#F6B26B']];let off=25,s='<circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/>';const grow=E.out(clamp((lt-2.6)/0.4));
  segs.forEach(([mb,c])=>{const pct=mb/4.2*100*f*grow;s+=`<circle cx="21" cy="21" r="15.9" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${pct} ${100-pct}" stroke-dashoffset="${off}"/>`;off-=pct});$('#donut',el).innerHTML=s;
  $('#usage',el).textContent=(4.2*f).toFixed(1)+' MB';$('#csd',el).style.background=lt>3.0&&lt<3.2?'#AECBFA':'#8AB4F8';
 },cursor:[[0,700,600],[0.45,['#thv',0.1,0.5],1],[1.2,['[data-a="ck"]',0.5,0.5],1],[2.45,['[data-a="st"]',0.5,0.5],1],[2.95,['#csd',0.5,0.5],1],[3.7,['#csd',0.6,0.6]]]});

scene(2,{id:'device',acc:'#F6B26B',label:'DEVICE',water:'393×852 · DPR 3 · TOUCH',
 info:{kick:'CH 10 · DEVICE MODE',name:'DEVICE MODE',sub:'Test <em>mobile layouts</em> without a phone: viewport, touch, pixel ratio.',keys:[[['Ctrl','Shift','M'],'toggle toolbar']],b0:0.35,bs:0.45,
  bul:['Presets (iPhone, Pixel, iPad…) or <b>Responsive</b> drag','Emulates <b>DPR</b>, touch events and user-agent','<b>Rotate</b> · throttle CPU &amp; network per device','Media-query bars jump to each breakpoint','<b>Capture screenshot</b> / full-size screenshot','Sensors: fake <b>geolocation</b> &amp; orientation']},
 html:()=>`<div class="si" id="w"><div class="win">${chromeBar()}<div class="bbody right"><div class="pagebox" style="width:760px;height:100%;background:#2A2B2F">
  <div style="height:38px;background:#35363A;display:flex;align-items:center;justify-content:center;gap:16px;font:400 13.5px Plex;color:#E3E3E3;border-bottom:1px solid #45474C;white-space:nowrap"><span>Dimensions: <b id="dname" style="font-weight:500">Responsive</b> ▾</span><span class="mono" id="ddim">760 × 690</span><span>100% ▾</span><span>DPR: <span id="dpr">1.0</span></span><span>No throttling ▾</span><span id="rot" style="font-size:17px">⟲</span></div>
  <div style="height:22px;display:flex;flex-direction:column;gap:2px;padding:2px 0" id="mq"><i style="flex:1;background:#6FA8DC;opacity:.5;margin:0 30%"></i><i style="flex:1;background:#93C47D;opacity:.5;margin:0 18%"></i><i style="flex:1;background:#F6B26B;opacity:.5;margin:0 4%"></i></div>
  <div style="position:absolute;left:0;right:0;top:64px;bottom:0;display:flex;align-items:center;justify-content:center">
   <div id="phone" style="position:relative;background:#111;border-radius:0;padding:0;transition:none">
    <div id="vp" style="position:relative;overflow:hidden;background:#F4EFE8;width:700px;height:620px">${site()}</div></div></div>
  <div class="ctx" id="dmenu" style="display:none;left:190px;top:34px"><div>Responsive</div><div>iPhone SE</div><div>iPhone 14 Pro Max</div><div id="dpx">Pixel 7</div><div>Samsung Galaxy S20 Ultra</div><div>iPad Air</div><div>iPad Mini</div><div>Surface Pro 7</div><hr><div>Edit…</div></div>
 </div><div class="dt">${dtTabs('Elements')}<div class="tree"><div style="--d:0">▾<span class="tg">&lt;body</span> <span class="an">class</span>=<span class="av">"shop"</span><span class="tg">&gt;</span></div><div style="--d:1">▸<span class="tg">&lt;nav&gt;</span>…</div><div style="--d:1">▸<span class="tg">&lt;header&gt;</span>…</div><div style="--d:1" class="selr">▸<span class="tg">&lt;section</span> <span class="an">class</span>=<span class="av">"cards"</span><span class="tg">&gt;</span>…<span class="flexb on">grid</span></div></div>
 <div class="styles"><div class="rule"><span class="src">app.css:60</span><span class="sel">.cards</span> {<div class="decl"><span class="cb y"></span><span class="pn">grid-template-columns</span>: <span class="pv">repeat(3, 1fr)</span>;</div>}</div><div class="rule" id="mqr" style="opacity:.35"><span class="src">app.css:88</span><span style="color:#9AA0A6">@media (max-width: 600px)</span><br><span class="sel">.cards</span> {<div class="decl"><span class="cb y"></span><span class="pn">grid-template-columns</span>: <span class="pv">1fr</span>;</div>}</div></div></div></div></div></div>`,
 update(lt,el){let w=700,h=620,name='Responsive',dpr='1.0',mob=false;
  const p1=E.io(clamp((lt-0.2)/0.5));if(lt>0.2){w=lerp(700,300,p1);h=lerp(620,610,p1);name='iPhone 14 Pro';dpr='3.0'}
  if(lt>1.75){name='Pixel 7';dpr='2.6';w=lerp(300,290,clamp((lt-1.75)/0.2));}
  const rp=E.io(clamp((lt-2.35)/0.45));let rot=0;if(lt>2.35){rot=rp}
  const W=rot?lerp(w,560,rot):w,H=rot?lerp(h,270,rot):h;
  mob=W<600;$('#vp',el).style.width=W+'px';$('#vp',el).style.height=H+'px';
  const s=$('.site',$('#vp',el));$('.scards',s).style.gridTemplateColumns=mob&&W<420?'1fr':'repeat(3,1fr)';$('.stitle',s).style.fontSize=W<420?'34px':'42px';
  $('#mqr',el).style.opacity=W<420?1:.35;
  const ph=$('#phone',el);ph.style.padding=lt>0.2?'14px 12px':'0';ph.style.borderRadius=lt>0.2?'34px':'0';ph.style.boxShadow=lt>0.2?'0 0 0 2px #444, 0 20px 40px rgba(0,0,0,.5)':'';
  $('#dname',el).textContent=name;$('#ddim',el).textContent=lt<0.2?'760 × 690':(lt>2.35?(name==='Pixel 7'?'915 × 412':''):(name==='Pixel 7'?'412 × 915':'393 × 852'));$('#dpr',el).textContent=dpr;
  $('#dmenu',el).style.display=lt>1.05&&lt<1.75?'block':'none';$('#dpx',el).className=lt>1.5?'h':'';
 },cursor:[[0,600,600],[0.9,['#dname',0.5,0.5],1],[1.2,['#dname',0.5,0.5]],[1.55,['#dpx',0.3,0.5],1],[2.2,['#rot',0.5,0.5],1],[3.0,['#vp .scta',0.5,0.5],'touch'],[3.7,['#vp .scta',0.5,0.5]]],touchFrom:2.9});

scene(2,{id:'lh',acc:'#81C995',label:'LIGHTHOUSE',water:'94 · 100 · 96 · 100',
 info:{kick:'CH 11 · LIGHTHOUSE',name:'LIGHTHOUSE',sub:'A one-click <em>audit</em> with scores, metrics and exact fixes.',keys:[],b0:0.35,bs:0.5,
  bul:['<b>Performance · Accessibility · Best Practices · SEO</b>','Modes: <b>Navigation · Timespan · Snapshot</b>','Mobile or desktop, with simulated throttling','<b style="color:#F28B82">0–49</b> · <b style="color:#FCAD70">50–89</b> · <b style="color:#81C995">90–100</b>','Every failed audit links to the fix + savings']},
 html:()=>`<div class="si" id="w">${win(`<div class="dt">${dtTabs('Lighthouse')}
 <div class="tb"><span>+</span><span>driftwood.coffee — 2:08:14 AM ▾</span>${I.clear}<span style="margin-left:auto;color:#9AA0A6">Emulated Moto G Power · Lighthouse 12.8 · Slow 4G</span></div>
 <div style="flex:1;padding:18px 26px;display:flex;flex-direction:column;gap:18px;overflow:hidden">
  <div style="display:flex;justify-content:space-around" id="gs">${[['Performance',94],['Accessibility',100],['Best Practices',96],['SEO',100]].map(([n,v],i)=>`<div class="gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="rgba(129,201,149,.1)" stroke="rgba(129,201,149,.18)" stroke-width="9"/><circle class="arc" data-v="${v}" cx="60" cy="60" r="52" fill="none" stroke="#81C995" stroke-width="9" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="0 400"/><text x="60" y="76" text-anchor="middle" fill="#81C995" class="gv">0</text></svg>${n}</div>`).join('')}</div>
  <div style="border-top:1px solid var(--line);padding-top:12px"><div style="font:600 13px Plex;color:#9AA0A6;letter-spacing:.06em;margin-bottom:10px">METRICS</div>
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 30px;font:400 14px Plex" id="lhm">${[['First Contentful Paint','0.8 s'],['Largest Contentful Paint','1.6 s'],['Total Blocking Time','90 ms'],['Cumulative Layout Shift','0.01'],['Speed Index','1.2 s']].map(([a,b],i)=>`<div data-in="${1.3+i*0.1}" data-fx="up" style="display:flex;justify-content:space-between;border-bottom:1px solid #2E3035;padding-bottom:6px"><span><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#81C995;margin-right:8px"></i>${a}</span><b class="mono g" style="font-size:18px">${b}</b></div>`).join('')}</div></div>
  <div><div style="font:600 13px Plex;color:#9AA0A6;letter-spacing:.06em;margin-bottom:6px">DIAGNOSTICS</div>${[['Properly size images','Est savings of 420 KiB','#FCAD70'],['Reduce unused JavaScript','Est savings of 138 KiB','#FCAD70'],['Eliminate render-blocking resources','Est savings of 310 ms','#F28B82'],['Serve static assets with an efficient cache policy','14 resources found','#9AA0A6']].map(([a,b,c],i)=>`<div data-in="${2.0+i*0.14}" data-fx="left" style="display:flex;justify-content:space-between;font:400 14px/34px Plex;border-bottom:1px solid #2E3035"><span><b style="color:${c}">▲</b>&nbsp; ${a}</span><span style="color:#9AA0A6">${b} ▾</span></div>`).join('')}</div>
 </div></div>`,{dock:'bottom',page:80,pageCls:'mini'})}</div>`,
 update(lt,el){$$('.arc',el).forEach((a,i)=>{const v=+a.dataset.v;const p=E.out(clamp((lt-0.15-i*0.12)/1.0));const val=Math.round(v*p);const C=2*Math.PI*52;a.setAttribute('stroke-dasharray',`${C*val/100} 400`);a.parentNode.querySelector('.gv').textContent=val;
  const col=val>=90?'#81C995':val>=50?'#FCAD70':'#F28B82';a.setAttribute('stroke',col);a.parentNode.querySelector('.gv').setAttribute('fill',col)});
 }});

const cmds=[['Panel','Show Coverage'],['Drawer','Show Rendering'],['Panel','Show Recorder'],['Drawer','Show Animations'],['Drawer','Show Changes'],['Screenshot','Capture full size screenshot'],['Debugger','Disable JavaScript'],['Rendering','Emulate CSS prefers-color-scheme: dark'],['Appearance','Switch to light theme']];
scene(2,{id:'power',acc:'#FF4F8B',label:'POWER',water:'CTRL+SHIFT+P › RUN COMMAND',
 info:{kick:'CH 12 · POWER TOOLS',name:'POWER TOOLS',sub:'<code>Ctrl+Shift+P</code> runs <em>any of 400+ commands</em> by name.',keys:[[['Ctrl','Shift','P'],'command menu'],[['Ctrl','Shift','F'],'search all files']],b0:0.45,bs:0.42,
  bul:['<b>Coverage</b>: red = bytes never executed','<b>Rendering</b>: paint flashing, layout-shift regions, FPS','<b>Recorder</b>: record a user flow, replay, measure','<b>Changes</b>: diff of every CSS/JS edit','Screenshot a node, the viewport, or full page','Emulate dark mode, reduced motion, vision deficiencies']},
 html:()=>`<div class="si" id="w">
  <div class="tile" id="cmdm" style="left:60px;top:30px;width:1020px;z-index:3"><div style="padding:18px 18px;border-bottom:1px solid var(--line);font:400 26px JBM;color:#E3E3E3;display:flex;gap:10px;align-items:center"><span style="color:#8AB4F8">Run ›</span><span id="cq"></span><span class="caret"></span></div>
   <div id="cl">${cmds.map((c,i)=>`<div data-c="${i}" style="display:flex;gap:18px;padding:0 18px;font:400 20px/50px Plex;color:#E3E3E3"><span style="width:130px;color:#9AA0A6;font-size:15px;flex:none">${c[0]}</span><span>${c[1].replace(/(show|s)/i,'<b style="color:#8AB4F8">$1</b>')}</span></div>`).join('')}</div><div style="display:flex;gap:22px;padding:14px 18px;border-top:1px solid var(--line);font:500 16px Plex;color:#BDC1C6;background:#232428">${[['&gt;','run command'],['!','run snippet'],['@','go to symbol'],[':','go to line'],['?','help'],['(none)','open file']].map(([k,v])=>`<span><b class="mono" style="color:#FFE599;margin-right:6px">${k}</b>${v}</span>`).join('')}</div></div>
  <div class="tile" data-in="1.55" data-fx="pop" style="left:0;top:0;width:560px;height:390px"><h6>Coverage <em>JS + CSS</em></h6><div class="ntrow h" style="grid-template-columns:130px 60px 90px 1fr"><span>URL</span><span>Type</span><span>Unused</span><span>Usage</span></div>
   ${[['vendor.js','JS','188 kB',64],['app.js','JS','42.7 kB',71],['app.css','CSS','8.1 kB',58],['analytics.js','JS','22.5 kB',83],['cart.js','JS','6.4 kB',22]].map((r,i)=>`<div class="ntrow" style="grid-template-columns:130px 60px 90px 1fr"><span>${r[0]}</span><span>${r[1]}</span><span class="mono">${r[3]}%</span><span style="display:flex;align-items:center;padding-top:6px"><i data-in="${1.7+i*0.08}" data-fx="bar" style="display:flex;height:12px;width:${60+ (5-i)*25}px"><b style="flex:${100-r[3]};background:#4FA3F7"></b><b style="flex:${r[3]};background:#E46962"></b></i></span></div>`).join('')}
   <div style="padding:10px 12px;font:400 13px Plex;color:#9AA0A6">268 kB of 412 kB (65%) is unused. Click a row to see red lines in Sources.</div></div>
  <div class="tile" data-in="1.8" data-fx="pop" style="left:580px;top:0;width:560px;height:390px"><h6>Rendering <em>overlays</em></h6><div style="display:flex;height:354px"><div style="flex:1;position:relative;overflow:hidden" id="rpage">${site()}<div id="pf"></div></div>
   <div style="width:210px;padding:10px;font:400 13px/2 Plex;color:#E3E3E3;border-left:1px solid var(--line)"><div class="chk y">Paint flashing</div><div class="chk y">Layout Shift Regions</div><div class="chk y">Frame Rendering Stats</div><div class="chk">Scrolling issues</div><div style="color:#9AA0A6;margin-top:4px">prefers-color-scheme</div><div style="border:1px solid #45474C;border-radius:4px;padding:0 8px;line-height:24px">dark ▾</div><div style="color:#9AA0A6">Vision deficiency</div><div style="border:1px solid #45474C;border-radius:4px;padding:0 8px;line-height:24px">Blurred vision ▾</div></div></div></div>
  <div class="tile" data-in="2.05" data-fx="pop" style="left:0;top:410px;width:560px;height:398px"><h6>Recorder <em>user flow</em></h6><div style="padding:10px 16px;font:400 14px/1.2 Plex;color:#E3E3E3">${[['Navigate','driftwood.coffee/shop'],['Click','a.btn.cta  "Order beans →"'],['Change','input#qty  → "2"'],['Click','button  "Checkout"'],['Wait for','aria/Order placed']].map((s,i)=>`<div data-in="${2.15+i*0.12}" data-fx="left" style="display:flex;gap:12px;align-items:center;padding:7px 0"><i style="width:14px;height:14px;border-radius:50%;background:${i<4?'#8AB4F8':'#81C995'};flex:none;box-shadow:0 0 0 4px rgba(138,180,248,.2)"></i><b style="width:80px">${s[0]}</b><span class="mono" style="color:#BDC1C6;font-size:13px">${s[1]}</span></div>`).join('')}
   <div style="display:flex;gap:10px;margin-top:14px"><span style="background:#8AB4F8;color:#202124;padding:7px 16px;border-radius:16px;font-weight:600">▶ Replay</span><span style="border:1px solid #8AB4F8;color:#8AB4F8;padding:7px 16px;border-radius:16px;font-weight:600">Measure performance</span><span style="color:#9AA0A6;padding:7px 4px">Export as Puppeteer ▾</span></div></div></div>
  <div class="tile" data-in="2.3" data-fx="pop" style="left:580px;top:410px;width:560px;height:398px"><h6>Changes <em>diff</em></h6><div style="font:400 14px/26px JBM;padding:8px 0">
   <div style="padding:0 14px;color:#9AA0A6">app.css</div>
   <div style="padding:0 14px;background:rgba(228,105,98,.18);color:#F28B82">- 31  background: #E4572E;</div><div style="padding:0 14px;background:rgba(129,201,149,.18);color:#81C995">+ 31  background: #2E6BE4;</div>
   <div style="padding:0 14px;background:rgba(228,105,98,.18);color:#F28B82">- 34  border-radius: 999px;</div><div style="padding:0 14px;background:rgba(129,201,149,.18);color:#81C995">+ 34  border-radius: 12px;</div>
   <div style="padding:0 14px;color:#9AA0A6;margin-top:6px">index.html</div><div style="padding:0 14px;background:rgba(228,105,98,.18);color:#F28B82">- &lt;h1&gt;Slow coffee, fast site.&lt;/h1&gt;</div><div style="padding:0 14px;background:rgba(129,201,149,.18);color:#81C995">+ &lt;h1&gt;Hello, DevTools.&lt;/h1&gt;</div>
   <div style="padding:10px 14px 0;font:400 13px Plex;color:#8AB4F8">⎘ Copy all changes as CSS</div></div></div>
 </div>`,
 update(lt,el){const q='show';$('#cq',el).textContent=q.slice(0,Math.floor(clamp((lt-0.1)/0.3)*4));const cm=$('#cmdm',el);cm.style.display=lt<1.5?'block':'none';
  const vis=[0,1,2,3,4,8];const hi=vis[Math.min(5,Math.floor(clamp((lt-0.45)/0.95)*6))];$$('[data-c]',el).forEach((d,i)=>{d.style.background=i===hi?'#0B4A78':'';d.style.display=(lt>0.4&&i>4&&i<8)?'none':'flex'});
  const pf=$('#pf',el);if(lt>1.8){const k=Math.floor(lt*6)%3;pf.innerHTML=[[20,120,170,60],[210,300,120,50],[20,200,250,30]].map((r,i)=>`<div style="position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;background:${i===2?'rgba(79,163,247,.35)':'rgba(0,255,0,.35)'};border:2px solid ${i===2?'#4FA3F7':'#0f0'};opacity:${(k+i)%3===0?1:.15}"></div>`).join('')+`<div style="position:absolute;right:8px;top:8px;background:rgba(0,0,0,.75);color:#81C995;font:700 12px JBM;padding:6px 8px;border-radius:4px">60 fps<br><span style="color:#9AA0A6;font-weight:400">GPU raster: on</span></div>`}
 }});

scene(1,{id:'outro',acc:'#FFE599',hud:false,water:'F12 · INSPECT EVERYTHING',
 html:()=>`<div id="og" style="position:absolute;left:120px;right:120px;top:170px;display:grid;grid-template-columns:repeat(6,1fr);gap:16px">${['Elements','Styles','Console','Sources','Network','Performance','Memory','Application','Device Mode','Lighthouse','Coverage','Recorder'].map((p,i)=>`<div data-in="${i*0.05}" data-fx="pop" style="height:84px;border-radius:12px;border:2px solid ${['#6FA8DC','#93C47D','#FFE599','#F6B26B'][i%4]};display:flex;align-items:center;justify-content:center;font:700 22px Plex;color:#fff;background:rgba(255,255,255,.03)">${p}</div>`).join('')}</div>
 <div style="position:absolute;left:0;right:0;top:430px;text-align:center" data-in="0.55" data-fx="slam"><span style="font:800 200px/1 Brico;letter-spacing:-.05em;color:#fff">Press </span><span class="kc" style="font:800 150px/1 Brico;height:210px;min-width:360px;border-radius:40px;vertical-align:-20px">F12</span></div>
 <div style="position:absolute;left:0;right:0;top:720px;text-align:center;font:600 40px Plex;color:#C9D2E3" data-in="0.95" data-fx="up">Inspect everything. Break anything. <span style="color:var(--yellow)">Fix it live.</span></div>`});

/* ---------- build ---------- */
const root=$('#scenes');
S.forEach((s,i)=>{const d=document.createElement('div');d.className='scene';d.id='sc-'+s.id;d.style.setProperty('--acc',s.acc);
 d.innerHTML=(s.info?`<div id="stage">${s.html()}</div>`+info(s.info):s.html());root.appendChild(d);s.el=d;
 s.anims=$$('[data-in]',d).map(e=>({e,tin:+e.dataset.in,d:+(e.dataset.d||0.3),fx:e.dataset.fx||'up'}));
 if(s.info){const ttl=$('.ttl',d);s.ttl=ttl;}
 if(s.cursor){d.querySelector('#stage').insertAdjacentHTML('beforeend',cursorSVG.arrow.replace('class="cursor"','class="cursor" data-k="arrow"')+cursorSVG.touch.replace('class="cursor"','class="cursor" data-k="touch" style="display:none"')+'<div class="ripple"></div>')}
});
// fit titles
document.fonts.ready.then(()=>{S.forEach(s=>{if(s.ttl){s.el.style.display='block';const w=s.ttl.scrollWidth;if(w>630){s.ttl.style.fontSize=(104*630/w)+'px'}s.el.style.display='none'}});window.__ready=true});
// HUD
const chap=S.filter(s=>s.label);$('#hud-top').innerHTML=chap.map(s=>`<div class="seg" style="--c:${s.acc}" data-s="${s.id}"><b>${s.label}</b><i><u></u></i></div>`).join('');
const tips=[['TIP','Right-click ⟳ with DevTools open → <code>Empty cache and hard reload</code>'],['TIP','<code>debugger;</code> in code pauses like a breakpoint'],['TIP','Shift-click a color swatch to cycle HEX / RGB / HSL'],['TIP','<code>$_</code> holds the last Console result'],['TIP','Network: hold Shift over a row — green = initiators, red = dependents'],['TIP','<code>Ctrl+P</code> opens any source file by name'],['TIP','Elements: <code>H</code> toggles visibility of the selected node'],['TIP','<code>monitorEvents(window, "resize")</code> logs events live'],['TIP','Sources ▸ Snippets: save scripts you run on any page'],['TIP','Console: <code>queryObjects(Promise)</code> lists live instances'],['TIP','Drag a row in the Elements tree to move it in the DOM'],['TIP','Performance ▸ Enable advanced paint instrumentation for layer detail']];
const tk=tips.map(t=>`<span><b>${t[0]}</b>${t[1]}</span>`).join('');$('#tick').innerHTML=tk+tk;

/* ---------- geometry ---------- */
function rel(sceneEl,node){const st=sceneEl.querySelector('#stage')||sceneEl;const si=st;const a=si.getBoundingClientRect(),b=node.getBoundingClientRect();const sc=a.width/si.offsetWidth||1;return{x:(b.left-a.left)/sc,y:(b.top-a.top)/sc,w:b.width/sc,h:b.height/sc}}
function drawOverlay(el,node,tipHTML){const ov=$('#ov',el),tip=$('#tip',el);if(!node){ov.style.display='none';tip.style.display='none';return}
 const r=rel(el,node);const cs=getComputedStyle(node);const n=k=>parseFloat(cs[k])||0;
 const m=[n('marginTop'),n('marginRight'),n('marginBottom'),n('marginLeft')],p=[n('paddingTop'),n('paddingRight'),n('paddingBottom'),n('paddingLeft')];
 ov.style.display='block';const M=$('.m',ov),Bd=$('.b',ov),P=$('.p',ov),C=$('.c',ov);
 const set=(e,x,y,w,h)=>{e.style.left=x+'px';e.style.top=y+'px';e.style.width=w+'px';e.style.height=h+'px'};
 ov.style.left='0';ov.style.top='0';set(M,r.x-m[3],r.y-m[0],r.w+m[1]+m[3],r.h+m[0]+m[2]);M.style.borderWidth=m.map(v=>v+'px').join(' ');set(Bd,r.x,r.y,0,0);set(P,r.x,r.y,r.w,r.h);P.style.borderWidth=p.map(v=>v+'px').join(' ');set(C,r.x+p[3],r.y+p[0],r.w-p[1]-p[3],r.h-p[0]-p[2]);
 tip.style.display='block';tip.innerHTML=tipHTML;tip.style.left=Math.max(6,r.x)+'px';const th=tip.offsetHeight;tip.style.top=(r.y+r.h+m[2]+10+th>800?r.y-m[0]-th-10:r.y+r.h+m[2]+10)+'px'}
function resolvePt(el,p){if(typeof p[1]==='number')return{x:p[1],y:p[2]};const [sel,fx,fy]=p[1];const n=el.querySelector(sel);if(!n)return{x:500,y:400};const r=rel(el,n);return{x:r.x+r.w*fx,y:r.y+r.h*fy}}

/* ---------- fx canvas ---------- */
const cv=$('#fx'),cx=cv.getContext('2d');
function drawFX(t,acc,energy){cx.clearRect(0,0,1920,1080);
 // glyph drift
 const R=rng(99);cx.font='600 22px JBM';for(let i=0;i<34;i++){const gx=(R()*1920+t*(20+R()*40))%1980-30;const gy=(R()*1000+Math.sin(t*.7+i)*20);cx.fillStyle=`rgba(138,180,248,${0.05+R()*0.08})`;cx.fillText(['{ }','</>','$0','=>','200','F12','::','px','#','fn','[ ]','ms'][i%12],gx,gy)}
 // beat sparks
 const bi=Math.floor(t/B);for(let k=0;k<2;k++){const b=bi-k;if(b<0)continue;const tb=t-b*B;if(tb>0.6)continue;const r2=rng(b*31+7);const n=Math.round(10*energy);const ox=200+r2()*1520,oy=150+r2()*700;
  for(let i=0;i<n;i++){const a=r2()*Math.PI*2,sp=200+r2()*500;const x=ox+Math.cos(a)*sp*tb,y=oy+Math.sin(a)*sp*tb+300*tb*tb;const al=Math.max(0,1-tb/0.6);cx.fillStyle=i%3?acc:'#ffffff';cx.globalAlpha=al*0.8;cx.fillRect(x,y,3+r2()*3,3+r2()*3)}cx.globalAlpha=1}}

/* ---------- render ---------- */
const DROP=[[7.5,39.375],[43.125,58.125]];
function energyAt(t){for(const [a,b] of DROP)if(t>=a&&t<b)return 1;return t<7.5?0.35:0.5}
let lastScene=null;
window.render=function(t){
 const s=S.find(x=>t>=x.start&&t<x.end)||S[S.length-1];const lt=t-s.start;
 if(lastScene!==s){S.forEach(x=>x.el.style.display='none');s.el.style.display='block';lastScene=s;document.documentElement.style.setProperty('--acc',s.acc);$('#water').textContent=(s.water+' · ').repeat(3)}
 const en=energyAt(t);const bp=(t%B)/B;const kick=Math.exp(-bp*7)*en;
 // generic anims
 s.anims.forEach(a=>{const p=clamp((lt-a.tin)/a.d);const e=a.e;if(a.fx==='bar'){e.style.transform=`scaleX(${E.out(p)})`;e.style.transformOrigin='left';return}
  e.style.opacity=p<=0?0:Math.min(1,p*2.2);let tr='';
  if(a.fx==='up')tr=`translateY(${(1-E.out(p))*22}px)`;else if(a.fx==='left')tr=`translateX(${(1-E.out(p))*-40}px)`;else if(a.fx==='pop')tr=`scale(${lerp(.4,1,E.back(p))})`;else if(a.fx==='slam')tr=`scale(${lerp(1.9,1,E.expo(p))})`;
  else if(a.fx==='wipe'){e.style.clipPath=`inset(0 ${(1-E.out(p))*100}% 0 0)`;e.style.opacity=p>0?1:0}
  e.style.transform=tr});
 if(s.ttl){s.ttl.style.transform+=` scale(${1+kick*0.035})`}
 if(s.update)s.update(lt,s.el);
 // cursor
 if(s.cursor){const cur=s.el.querySelector('[data-k="arrow"]'),tch=s.el.querySelector('[data-k="touch"]'),rp=s.el.querySelector('.ripple');const K=s.cursor;let i=0;while(i<K.length-1&&lt>=K[i+1][0])i++;
  const a=K[i],b=K[Math.min(i+1,K.length-1)];const pa=resolvePt(s.el,a),pb=resolvePt(s.el,b);const seg=b[0]-a[0];const f=seg>0?E.io(clamp((lt-a[0])/Math.min(seg,0.45))):1;
  const x=lerp(pa.x,pb.x,f),y=lerp(pa.y,pb.y,f);const touch=s.touchFrom&&lt>=s.touchFrom;const c=touch?tch:cur;cur.style.display=touch?'none':'block';tch.style.display=touch?'block':'none';
  c.style.transform=`translate(${x-(touch?17:6)}px,${y-(touch?17:3)}px)`;
  let rip=null;K.forEach(k=>{if(k[3]&&lt>=k[0]&&lt<k[0]+0.4)rip=k});rp.style.opacity=0;if(rip){const q=(lt-rip[0])/0.4;const pt=resolvePt(s.el,rip);const d=10+q*50;rp.style.opacity=1-q;rp.style.width=rp.style.height=d+'px';rp.style.left=(pt.x-d/2)+'px';rp.style.top=(pt.y-d/2)+'px';rp.style.borderColor=s.acc}}
 // stage entrance & pulse
 const st=s.el.querySelector('#stage');if(st){const ep=E.expo(clamp(lt/0.45));st.style.transform=`perspective(1600px) translateX(${(1-ep)*-80}px) rotateY(${(1-ep)*8}deg) scale(${lerp(0.9,1,ep)*(1+kick*0.006)})`;st.style.opacity=clamp(lt/0.12)}
 // HUD
 $('#hud-top').style.opacity=s.hud===false?0:1;$('#hud-bot').style.opacity=1;
 chap.forEach(c=>{const seg=$(`[data-s="${c.id}"]`);const p=clamp((t-c.start)/(c.end-c.start));seg.querySelector('u').style.transform=`scaleX(${p})`;seg.className='seg'+(c===s?' on':p>=1?' done':'')});
 const ci=chap.indexOf(s);$('#tc').innerHTML=`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(1).padStart(4,'0')}<small>${ci>=0?`PANEL ${String(ci+1).padStart(2,'0')}/${chap.length} · ${s.label}`:'DEVTOOLS · 60S'}</small>`;
 $('#tick').style.transform=`translateX(${-(t*150)%($('#tick').scrollWidth/2)}px)`;
 $('#grid').style.transform=`translate(${-(t*30)%40}px,${-(t*18)%40}px)`;
 $('#water').style.transform=`translateX(${-t*90%1400}px)`;
 $('#glow').style.opacity=0.08+kick*0.12;$('#glow').style.left=(-200+Math.sin(t*.4)*200)+'px';
 // transitions: flash + glitch bands
 const since=lt, until=s.end-t;const fl=Math.max(0,1-since/0.16)*0.55*(s.id==='intro'?0:1)+(s.id==='intro'&&lt>B&&lt<B+0.12?0.6*(1-(lt-B)/0.12):0);$('#flash').style.opacity=fl;
 const gl=since<0.14||until<0.06;const bands=$('#bands');if(gl){const R=rng(Math.floor(t*30)+5);let h='';for(let i=0;i<7;i++){h+=`<div style="top:${R()*1080}px;height:${4+R()*50}px;background:${['rgba(255,79,139,.55)','rgba(63,216,242,.55)','rgba(255,229,153,.4)'][i%3]};transform:translateX(${(R()-.5)*200}px)"></div>`}bands.innerHTML=h;$('#scenes').style.filter='drop-shadow(-7px 0 0 rgba(255,40,100,.6)) drop-shadow(7px 0 0 rgba(0,220,255,.6))';$('#scenes').style.transform=`translateX(${(R()-.5)*30}px)`}else{bands.innerHTML='';$('#scenes').style.filter='';$('#scenes').style.transform=''}
 drawFX(t,s.acc,en);
};
</script></body></html>
```

### 16/16 · `F12-Field-Guide.html`
<!-- casebook-file {"path": "F12-Field-Guide.html", "lines": 1823, "final_newline": true, "sha256": "2a8d12787c1c3ba0cbbe3ce27d97333afad19f3234eeff96f2089370fe16ba4f", "original_sha256": "2a8d12787c1c3ba0cbbe3ce27d97333afad19f3234eeff96f2089370fe16ba4f"} -->
```html
<title>F12 Field Guide</title>
<meta name="description" content="A working browser with DevTools docked: every core F12 panel, live and explained.">
<style>
@font-face{font-family:"Bricolage Grotesque";src:url(fonts/bricolage-grotesque-latin-800-normal.woff2) format("woff2");font-weight:800;font-display:swap}
@font-face{font-family:"Bricolage Grotesque";src:url(fonts/bricolage-grotesque-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"IBM Plex Sans";src:url(fonts/ibm-plex-sans-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(fonts/jetbrains-mono-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(fonts/jetbrains-mono-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
:root{
 color-scheme:dark;
 --ground:#0A0E18;--ground2:#0E1422;--surface:#131A2B;--surface2:#182036;--rule:#232C44;--rule2:#2E3A58;
 --ink:#E9EEF7;--ink2:#C3CCDD;--mut:#8C97AF;--faint:#5D6883;
 --content:#6FA8DC;--padding:#93C47D;--border:#FFE599;--margin:#F6B26B;--act:#8AB4F8;--hot:#FF5C8A;
 --display:"Bricolage Grotesque","IBM Plex Sans",system-ui,sans-serif;
 --body:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
 --mono:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;
 /* devtools skin */
 --dt:#1F1F22;--dt2:#28292D;--dt3:#303136;--dtl:#3B3D43;--dtx:#E3E3E3;--dtm:#9AA0A6;--dsel:#0B4A78;--dhov:#2A3B52;
 --tag:#5DB0D7;--an:#9BBBDC;--av:#F29766;--pn:#35D4C7;--num:#9980FF;--kw:#C792EA;--fn:#82AAFF;--str:#F29766;--com:#7F8C8D;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
section[id],main{scroll-margin-top:70px}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ground);color:var(--ink);font:400 16px/1.55 var(--body);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:var(--act)}
:focus-visible{outline:2px solid var(--act);outline-offset:2px}
button{font:inherit;color:inherit}
code,kbd,.mono{font-family:var(--mono)}
.wrap{max-width:1560px;margin:0 auto;padding-inline:clamp(16px,3vw,40px)}
.kbd{display:inline-flex;align-items:center;justify-content:center;min-width:1.9em;height:1.9em;padding:0 .45em;border-radius:6px;background:linear-gradient(#27304A,#1A2135);border:1px solid #3A4666;box-shadow:0 2px 0 #0B0F1B,inset 0 1px 0 rgba(255,255,255,.1);font:600 .78em/1 var(--mono);color:#fff;white-space:nowrap}
/* top bar */
.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;background:rgba(10,14,24,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.top .wrap{display:flex;align-items:center;gap:22px;height:58px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font:800 20px/1 var(--display);letter-spacing:-.01em;white-space:nowrap}
.brand .kbd{font-size:13px;height:28px;min-width:44px}
.top nav{display:flex;gap:4px;margin-left:auto;overflow-x:auto;scrollbar-width:none}
.top nav a{color:var(--ink2);text-decoration:none;font:500 14px/1 var(--body);padding:9px 12px;border-radius:8px;white-space:nowrap}
.top nav a:hover{background:var(--surface);color:#fff}
/* intro */
.intro{padding-block:48px 26px;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:40px;align-items:end}
.eyebrow{font:600 12.5px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--content);display:flex;align-items:center;gap:10px;margin:0 0 18px}
.eyebrow::before{content:"";width:26px;height:2px;background:currentColor}
h1{margin:0;font:800 clamp(40px,6.2vw,92px)/.93 var(--display);letter-spacing:-.035em;text-wrap:balance}
h1 .k{display:inline-flex;vertical-align:.08em;font:800 .62em/1 var(--display);padding:.12em .3em .16em;border-radius:.2em;background:linear-gradient(#2D3857,#1A2238);border:2px solid #45547D;box-shadow:0 .09em 0 #0B0F1B;letter-spacing:-.03em}
.lede{font-size:18px;line-height:1.6;color:var(--ink2);max-width:62ch;margin:0}
.boxkey{margin-top:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;font:500 13px var(--body);color:var(--mut)}
.boxkey .bm{position:relative;width:118px;height:62px;flex:none}
.boxkey .bm div{position:absolute;inset:0}
.boxkey .bm .m{background:rgba(246,178,107,.55)}.boxkey .bm .b{inset:8px;background:rgba(255,229,153,.7)}.boxkey .bm .p{inset:12px;background:rgba(147,196,125,.75)}.boxkey .bm .c{inset:22px 30px;background:rgba(111,168,220,.9)}
.boxkey ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,auto);gap:4px 18px}
.boxkey li{display:flex;align-items:center;gap:8px;white-space:nowrap}.boxkey li i{width:11px;height:11px;border-radius:2px;background:var(--c)}
/* controls strip */
.keys{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;margin:0 0 12px;font:500 13px var(--body);color:var(--mut)}
.keybtn{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--rule2);border-radius:10px;padding:6px 10px 6px 8px;cursor:pointer;color:var(--ink2);font:500 13px var(--body)}
.keybtn:hover{border-color:var(--act);color:#fff}
.keybtn[aria-pressed="true"]{border-color:var(--act);background:#15223D;color:#fff}
.keybtn .kbd{font-size:11px}
/* sim layout */
.simgrid{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:22px;align-items:start}
.simscroll{overflow-x:auto;border-radius:14px}
.browser{min-width:880px;height:820px;border-radius:14px;overflow:hidden;background:#1B1C1F;border:1px solid #33384A;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.4);display:flex;flex-direction:column;position:relative;font:400 13px/1.35 var(--body);color:var(--dtx)}
.browser:focus{outline:none}
.bch{flex:none;background:#2B2C30}
.btabs{height:38px;display:flex;align-items:flex-end;gap:2px;padding:0 10px;background:#1E1F22}
.lights{display:flex;gap:7px;margin:0 12px 12px 4px}.lights i{width:12px;height:12px;border-radius:50%;background:#FF5F57}.lights i:nth-child(2){background:#FEBC2E}.lights i:nth-child(3){background:#28C840}
.btab{height:30px;padding:0 12px;display:flex;align-items:center;gap:8px;font:500 13px var(--body);color:#9AA0A6;border-radius:8px 8px 0 0;min-width:0;width:210px;white-space:nowrap;overflow:hidden}
.btab.on{background:#2B2C30;color:#E8EAED}
.btab .fav{width:14px;height:14px;border-radius:3px;background:linear-gradient(135deg,#E4572E,#7A2E1A);flex:none}
.btab span{overflow:hidden;text-overflow:ellipsis}
.omni{height:42px;display:flex;align-items:center;gap:6px;padding:0 10px;color:#9AA0A6}
.omni button{width:30px;height:30px;border-radius:50%;border:0;background:none;display:grid;place-items:center;cursor:pointer;color:#C4C7CC}
.omni button:hover{background:#3A3B3F}
.url{flex:1;height:30px;border-radius:15px;background:#1E1F22;display:flex;align-items:center;gap:8px;padding:0 14px;font:400 14px var(--body);color:#E8EAED;min-width:0;white-space:nowrap;overflow:hidden}
.url .dim{color:#9AA0A6}
.bbody{flex:1;display:flex;min-height:0;position:relative}
.bbody.bottom{flex-direction:column}
.pagearea{position:relative;background:#F4EFE8;overflow:hidden;flex:1 1 auto;min-width:0;min-height:0}
.bbody.bottom .pagearea{flex:0 0 var(--ph,270px)}
.bbody.bottom.dev .pagearea{flex-basis:max(var(--ph,270px),58%)}
.bbody.right .pagearea{flex:0 0 var(--pw,44%)}
.bbody.closed .pagearea{flex:1 1 auto}
.viewport{position:absolute;inset:0;overflow:hidden}
#pageHost{position:absolute;inset:0}
.dt{flex:1;min-width:0;min-height:0;background:var(--dt);display:flex;flex-direction:column;position:relative;container-type:inline-size;container-name:dt}
.bbody.bottom .dt{border-top:1px solid var(--dtl)}
.bbody.right .dt{border-left:1px solid var(--dtl)}
.bbody.closed .dt,.bbody.closed .splitter{display:none}
.splitter{flex:none;background:var(--dtl);position:relative;z-index:3}
.bbody.bottom .splitter{height:4px;cursor:ns-resize;margin:-2px 0}
.bbody.right .splitter{width:4px;cursor:ew-resize;margin:0 -2px}
.splitter:hover{background:var(--act)}
/* devtools chrome */
.dtt{height:34px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-bottom:1px solid var(--dtl);font:500 13px var(--body);color:#BDC1C6;min-width:0}
.dtt .icb{width:34px;flex:none;display:grid;place-items:center;border:0;border-right:1px solid var(--dtl);background:none;cursor:pointer;color:#9AA0A6;padding:0}
.dtt .icb:hover{background:var(--dt3)}
.dtt .icb[aria-pressed="true"] svg{stroke:#8AB4F8}
.ptabs{display:flex;min-width:0;overflow:hidden;flex:1}
.ptab{padding:0 11px;display:flex;align-items:center;border:0;background:none;border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer;color:#BDC1C6;font:500 13px var(--body)}
.ptab:hover{background:var(--dt3);color:#fff}
.ptab[aria-selected="true"]{color:#fff;border-bottom-color:#8AB4F8;background:#303134}
.dtr{display:flex;align-items:center;gap:6px;padding:0 6px;flex:none}
.dtr .icb{border:0;width:28px;height:28px;border-radius:4px}
.bdg{font:600 11px var(--mono);padding:2px 6px;border-radius:9px;display:inline-flex;gap:4px;align-items:center;border:0;cursor:pointer}
.bdg.e{background:#4E1D1D;color:#F28B82}.bdg.w{background:#4A3C12;color:#FDD663}
.bdg[hidden]{display:none}
svg.i{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.panels{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}
.panel{flex:1;min-height:0;display:none;flex-direction:column}
.panel.on{display:flex}
.tb{min-height:30px;flex:none;display:flex;align-items:center;gap:8px;padding:0 8px;background:var(--dt2);border-bottom:1px solid var(--dtl);font:400 12.5px var(--body);color:#BDC1C6;white-space:nowrap;overflow-x:auto;scrollbar-width:none}
.tb .sep{width:1px;height:16px;background:var(--dtl);flex:none}
.tbb{border:0;background:none;color:#BDC1C6;height:24px;min-width:24px;padding:0 6px;border-radius:4px;display:inline-flex;align-items:center;gap:5px;cursor:pointer;font:400 12.5px var(--body)}
.tbb:hover{background:var(--dt3);color:#fff}
.tbb[aria-pressed="true"]{color:#8AB4F8}
.tbb.rec[aria-pressed="true"] svg{stroke:#F28B82;fill:#F28B82}
.inp{height:22px;border-radius:4px;background:#17181A;border:1px solid #45474C;padding:0 7px;color:var(--dtx);font:400 12.5px var(--body);min-width:120px;outline:none}
.inp:focus{border-color:#8AB4F8}
select.inp{padding:0 4px;min-width:0}
.ck{display:inline-flex;align-items:center;gap:5px;cursor:pointer;user-select:none}
.ck input{accent-color:#8AB4F8;margin:0;width:13px;height:13px}
.subt{height:28px;flex:none;display:flex;align-items:stretch;background:var(--dt2);border-bottom:1px solid var(--dtl);font:500 12.5px var(--body);overflow-x:auto;scrollbar-width:none}
.subt button{padding:0 10px;border:0;background:none;color:#BDC1C6;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;font:500 12.5px var(--body)}
.subt button:hover{color:#fff;background:var(--dt3)}
.subt button[aria-selected="true"]{color:#fff;border-bottom-color:#8AB4F8}
.scroll{overflow:auto;min-height:0;scrollbar-color:#4A4C52 transparent;scrollbar-width:thin}
.split{flex:1;display:flex;min-height:0}
.split>.a{flex:1 1 55%;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--dtl)}
.split>.b{flex:1 1 45%;min-width:0;display:flex;flex-direction:column}
@container dt (max-width:700px){.split.adapt{flex-direction:column}.split.adapt>.a{border-right:0;border-bottom:1px solid var(--dtl);flex:1 1 50%}.split.adapt>.b{flex:1 1 50%}}
.empty{padding:28px;color:var(--dtm);text-align:center;font:400 13px var(--body)}
.pill{border:1px solid #45474C;border-radius:4px;padding:0 7px;height:22px;display:inline-flex;align-items:center;cursor:pointer;background:none;color:#BDC1C6;font:400 12.5px var(--body)}
.btnp{background:#8AB4F8;color:#202124;border:0;border-radius:14px;padding:6px 14px;font:600 12.5px var(--body);cursor:pointer}
.btnp:hover{background:#AECBFA}
.btns{background:none;color:#8AB4F8;border:1px solid #5F6368;border-radius:14px;padding:5px 13px;font:600 12.5px var(--body);cursor:pointer}
.btns:hover{background:rgba(138,180,248,.08)}
/* elements */
.tree{font:400 12.5px/20px var(--mono);padding:4px 0 30px;white-space:nowrap;user-select:none;flex:1}
.tr{position:relative;padding-right:10px;cursor:default}
.tr .tg{color:var(--tag)}.tr .an{color:var(--an)}.tr .av{color:var(--av)}.tr .tx{color:var(--dtx)}.tr .cm{color:#8C9296}
.tr:hover{background:var(--dhov)}
.tr.sel{background:var(--dsel)}
.tr.flash{animation:fl 1.2s ease-out}
@keyframes fl{0%{background:rgba(186,104,200,.55)}100%{background:transparent}}
.tr .tw{display:inline-block;width:12px;color:#9AA0A6;cursor:pointer;text-align:center}
.tr .eq{color:#9AA0A6;margin-left:6px}
.tr.hid .tg,.tr.hid .an,.tr.hid .av{opacity:.5}
.lbadge{font:600 9.5px/1 var(--body);color:#C8CCD1;border:1px solid #6F737A;border-radius:7px;padding:1px 5px 2px;margin-left:6px;cursor:pointer;vertical-align:1px}
.lbadge.on{background:#8AB4F8;color:#1F1F1F;border-color:#8AB4F8}
.crumbs{height:24px;flex:none;border-top:1px solid var(--dtl);display:flex;align-items:center;font:400 12px var(--mono);color:#BDC1C6;padding:0 4px;background:var(--dt2);overflow:hidden;white-space:nowrap}
.crumbs button{border:0;background:none;color:inherit;font:inherit;padding:0 6px;height:100%;cursor:pointer}
.crumbs button:hover{background:var(--dt3)}.crumbs button.on{background:#3C4043;color:#fff}
.edit{outline:1px solid #8AB4F8;background:#17181A;color:#E3E3E3;padding:0 2px;border-radius:2px;min-width:20px;display:inline-block}
.styles{font:400 12.5px/19px var(--mono);color:var(--dtx);padding-bottom:30px}
.rule{padding:4px 10px 6px;border-bottom:1px solid #2E3035;position:relative}
.rule .src{position:absolute;right:10px;top:4px;color:#9AA0A6;text-decoration:underline;cursor:pointer;font-size:11.5px;background:none;border:0;font-family:var(--mono);padding:0}
.rule .src.ua{text-decoration:none;font-style:italic;cursor:default}
.rule .media{color:#9AA0A6;font-size:11.5px}
.inh{padding:5px 10px;font:400 11.5px var(--body);color:#9AA0A6;background:#232428;border-bottom:1px solid #2E3035}
.dcl{padding-left:20px;position:relative}
.dcl input{position:absolute;left:2px;top:3px;margin:0;width:12px;height:12px;accent-color:#8AB4F8;opacity:.35}
.dcl:hover input,.dcl input:not(:checked){opacity:1}
.dcl .p{color:var(--pn)}.dcl .v{color:var(--dtx);cursor:text;border-radius:2px}
.dcl .v:hover{background:#2A2B2F}
.dcl.over .p,.dcl.over .v,.dcl.off .p,.dcl.off .v{text-decoration:line-through;color:#7F868C}
.sw{display:inline-block;width:11px;height:11px;border:1px solid #888;vertical-align:-1px;margin-right:4px;border-radius:2px;cursor:pointer}
.boxm{margin:12px auto 10px;max-width:420px;font:400 11px var(--mono);color:#202124;text-align:center;user-select:none}
.boxm>div{padding:4px 8px 6px;position:relative;border:1px dashed #333;background:#F9CC9D}
.boxm>div>div{padding:4px 8px 6px;position:relative;border:1.5px solid #000;background:#FFEEBC;margin:2px 20px}
.boxm>div>div>div{padding:4px 8px 6px;position:relative;background:#C3D08B;margin:2px 20px}
.boxm .lab{position:absolute;left:5px;top:2px;font-size:9.5px;color:#202124}
.boxm .row{display:flex;align-items:center;justify-content:center;gap:10px;margin:2px 0}
.boxm .cbox{background:#8CB6C0;padding:5px 12px;border:1px solid #555}
.comp{font:400 12.5px/20px var(--mono);padding:0 10px 30px}
.comp div{display:flex;gap:12px;border-bottom:1px solid #2A2B2F}.comp .p{color:var(--pn);width:170px;flex:none}.comp .v{color:var(--dtx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kv{font:400 12.5px/22px var(--body);padding:8px 12px}
.kv div{display:flex;gap:10px;border-bottom:1px solid #2A2B2F}.kv b{font-weight:500;color:#9AA0A6;width:150px;flex:none}.kv span{font-family:var(--mono);font-size:12px}
/* overlay on page */
#hl{position:absolute;inset:0;pointer-events:none;z-index:20}
#hl .ring{position:absolute;box-sizing:border-box;border-style:solid;border-width:0}
.hltip{position:absolute;background:#fff;color:#202124;border-radius:5px;box-shadow:0 2px 12px rgba(0,0,0,.35);font:400 12px/1.45 var(--body);padding:6px 9px;white-space:nowrap;z-index:21;pointer-events:none}
.hltip .t{color:#881280;font-weight:600;font-family:var(--mono)}.hltip .c{color:#1A1AA6;font-family:var(--mono)}.hltip .d{color:#5F6368;margin-left:14px;font-family:var(--mono);float:right}
.hltip table{border-collapse:collapse;margin-top:3px;font:400 11.5px var(--body);clear:both}.hltip td{padding:0}.hltip td+td{padding-left:22px;text-align:right;font-family:var(--mono)}
.hltip .sec{font:700 9.5px var(--body);letter-spacing:.08em;color:#5F6368;padding-top:5px}
.gridov{position:absolute;pointer-events:none;z-index:19}
/* console */
.con{font:400 12.5px/1.45 var(--mono);flex:1}
.cm{padding:3px 10px 3px 28px;border-bottom:1px solid #2C2E33;position:relative;white-space:pre-wrap;word-break:break-word}
.cm .ic{position:absolute;left:9px;top:3px;width:12px;text-align:center;font-weight:700}
.cm.in .ic{color:#8AB4F8}.cm.out .ic{color:#9AA0A6;font-weight:400}
.cm.warn{background:#413A1B;color:#FDD663;border-color:#65571A}.cm.warn .ic{color:#FDD663;font-size:10px}
.cm.error{background:#3C1E1E;color:#F28B82;border-color:#6B2B2B}.cm.error .ic{color:#F28B82}
.cm.info .ic{color:#8AB4F8}.cm.verbose{color:#9AA0A6}
.cm .src{float:right;color:#9AA0A6;text-decoration:underline;cursor:pointer;margin-left:14px}
.cm .cnt{display:inline-block;background:#5F6368;color:#fff;border-radius:8px;padding:0 5px;margin-right:6px;font-size:10.5px;line-height:15px}
.cm.group{font-weight:600}
.ov-str{color:var(--str)}.ov-num{color:var(--num)}.ov-kw{color:#C792EA}.ov-null{color:#9AA0A6}.ov-key{color:#E3A7FF}.ov-fn{color:#82AAFF;font-style:italic}.ov-dim{color:#9AA0A6}
.obj{cursor:pointer}.obj>.kids{padding-left:14px;display:none}.obj.open>.kids{display:block}
.obj>.hd::before{content:"▸ ";color:#9AA0A6}.obj.open>.hd::before{content:"▾ "}
.nodeprev{color:var(--tag);cursor:pointer;border-radius:2px}.nodeprev:hover{background:var(--dhov)}
.ctab{border-collapse:collapse;margin:3px 0;font:400 12px var(--mono)}.ctab td,.ctab th{border:1px solid #45474C;padding:1px 10px;text-align:left}.ctab th{background:#303134;font-weight:600}
.cprompt{display:flex;align-items:flex-start;gap:8px;padding:4px 10px 4px 10px;border-top:1px solid #2C2E33;min-height:26px}
.cprompt .ic{color:#8AB4F8;font:700 13px var(--mono);line-height:18px}
.cprompt textarea{flex:1;background:none;border:0;outline:none;color:var(--dtx);font:400 12.5px/18px var(--mono);resize:none;height:18px;padding:0}
.chips{display:flex;gap:6px;padding:6px 10px;flex-wrap:wrap;border-top:1px solid #2C2E33;background:#1B1C1E}
.chips button{border:1px solid #3C4043;background:#232428;color:#C7D7F8;border-radius:12px;padding:2px 9px;font:400 11.5px var(--mono);cursor:pointer;white-space:nowrap}
.chips button:hover{border-color:#8AB4F8}
.chips small{font:500 11px var(--body);color:#9AA0A6;align-self:center}
.live{flex:none;border-bottom:1px solid var(--dtl);padding:3px 10px;font:400 12px/1.5 var(--mono);background:#232428}
.live .le{display:flex;gap:8px}.live .le b{font-weight:400;color:#E3E3E3}.live .le button{margin-left:auto;border:0;background:none;color:#9AA0A6;cursor:pointer}
.menu{position:absolute;z-index:80;background:#2D2E31;border:1px solid #4A4C52;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:400 12.5px/26px var(--body);color:#E3E3E3;padding:4px 0;min-width:200px}
.menu button{display:flex;width:100%;border:0;background:none;color:inherit;font:inherit;padding:0 14px;text-align:left;cursor:pointer;gap:16px;align-items:center;white-space:nowrap}
.menu button:hover,.menu button.hi{background:var(--dsel)}
.menu button small{margin-left:auto;color:#9AA0A6}
.menu hr{border:0;border-top:1px solid #45474C;margin:4px 0}
.menu .h{padding:0 14px;color:#9AA0A6;font-size:11px}
/* sources */
.nav{width:210px;flex:none;border-right:1px solid var(--dtl);display:flex;flex-direction:column;min-height:0}
.ftree{font:400 12.5px/22px var(--body);padding:4px 0}
.ftree button{display:flex;align-items:center;gap:6px;width:100%;border:0;background:none;color:#D5D7DB;cursor:pointer;padding:0 8px 0 calc(var(--d)*14px + 8px);text-align:left;white-space:nowrap;font:inherit}
.ftree button:hover{background:var(--dt3)}.ftree button.on{background:var(--dsel)}
.fi{width:12px;height:13px;border-radius:2px;display:inline-block;flex:none}
.ed{flex:1;min-width:0;display:flex;flex-direction:column;border-right:1px solid var(--dtl)}
.edtabs{height:28px;flex:none;display:flex;background:var(--dt2);border-bottom:1px solid var(--dtl);font:400 12px var(--body);color:#BDC1C6;overflow:hidden}
.edtabs span{padding:0 10px;display:flex;align-items:center;gap:6px;border-right:1px solid var(--dtl);white-space:nowrap}.edtabs span.on{background:var(--dt);color:#fff}
.code{font:400 12.5px/20px var(--mono);padding:4px 0 40px;flex:1;counter-reset:ln}
.ln{display:flex;white-space:pre;position:relative;min-height:20px}
.ln .g{width:46px;flex:none;text-align:right;padding-right:12px;color:#6E7379;position:relative;cursor:pointer;user-select:none}
.ln .g:hover{color:#E3E3E3}
.ln .g.bp{color:#fff}
.ln .g.bp::before{content:"";position:absolute;right:2px;top:1px;height:18px;left:4px;background:#1A73E8;clip-path:polygon(0 0,84% 0,100% 50%,84% 100%,0 100%);z-index:-1}
.ln .g.bp.cond::before{background:#E37400}.ln .g.bp.log::before{background:#D01884}.ln .g.bp.dis::before{opacity:.45}
.ln .g{z-index:1}
.ln.cur{background:rgba(64,120,80,.45)}
.ln .cov{position:absolute;left:44px;top:0;bottom:0;width:3px}
.ln .t{flex:1;padding-left:6px}
.ln .inl{color:#9AA0A6;font-style:italic;margin-left:18px;background:rgba(138,180,248,.12);padding:0 5px;border-radius:3px;font-size:11.5px}
.bpedit{margin:2px 10px 4px 50px;background:#2D2E31;border:1px solid #E37400;border-radius:4px;padding:6px 8px;font:400 12px var(--body);color:#FCAD70;white-space:normal}
.bpedit.log{border-color:#D01884;color:#FF7FC4}
.bpedit input{display:block;width:100%;margin-top:5px;background:#17181A;border:1px solid #45474C;color:#E3E3E3;font:400 12.5px var(--mono);padding:3px 6px;outline:none}
.dbg{width:300px;flex:none;display:flex;flex-direction:column;min-height:0;font:400 12.5px/21px var(--body)}
.dbgb{height:30px;flex:none;display:flex;align-items:center;gap:2px;padding:0 6px;background:var(--dt2);border-bottom:1px solid var(--dtl)}
.dbgb button{width:28px;height:24px;border:0;background:none;border-radius:4px;color:#8AB4F8;cursor:pointer;display:grid;place-items:center}
.dbgb button:disabled{color:#5F6368;cursor:default}
.dbgb button:not(:disabled):hover{background:var(--dt3)}
.pane h4{margin:0;font:600 12px/26px var(--body);padding:0 8px;background:#27282C;color:#E3E3E3;border-bottom:1px solid var(--dtl);border-top:1px solid var(--dtl);cursor:pointer;user-select:none}
.pane h4::before{content:"▾ ";color:#9AA0A6}
.pane .pb{padding:2px 0 6px}
.pane .pb>div{padding:0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:400 12px/21px var(--mono)}
.pane .muted{color:#9AA0A6;font-family:var(--body)!important;font-style:italic}
.pausemsg{background:#3A3517;color:#FDD663;font:500 12px/28px var(--body);padding:0 10px;border-bottom:1px solid var(--dtl)}
.pausebar{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:#FFF3C4;border:1px solid #E2C766;color:#3C3000;font:500 13px var(--body);padding:5px 8px 5px 12px;border-radius:5px;display:flex;gap:8px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.25);z-index:30;white-space:nowrap}
.pausebar button{border:0;background:#1A73E8;color:#fff;width:26px;height:22px;border-radius:3px;cursor:pointer;display:grid;place-items:center}
.pausedim{position:absolute;inset:0;background:rgba(0,0,0,.2);z-index:29}
/* network */
.nwrap{flex:1;display:flex;min-height:0;position:relative}
.ntable{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.nr{display:grid;grid-template-columns:minmax(120px,1.4fr) 56px 76px minmax(80px,.8fr) 68px 60px minmax(140px,2fr);font:400 12.5px/22px var(--body);border-bottom:1px solid #2C2E33;white-space:nowrap;cursor:default}
.nr>span{padding:0 7px;overflow:hidden;text-overflow:ellipsis;border-right:1px solid #2C2E33}
.nr.h{background:var(--dt2);color:#BDC1C6;font-weight:500;position:sticky;top:0;z-index:2}
.nr:not(.h):nth-child(even){background:#232428}
.nr:not(.h):hover{background:var(--dhov)}
.nr.bad{color:#F28B82}.nr.sel{background:var(--dsel)!important}
.nr .init{color:#8AB4F8;text-decoration:underline}
.wf{position:relative}
.wf i{position:absolute;top:7px;height:8px}
.nov{height:48px;flex:none;border-bottom:1px solid var(--dtl);position:relative;background:#1B1C1F;overflow:hidden}
.nstatus{height:24px;flex:none;border-top:1px solid var(--dtl);display:flex;align-items:center;gap:10px;padding:0 10px;font:400 12px var(--body);color:#BDC1C6;background:var(--dt2);white-space:nowrap;overflow:hidden}
.nstatus .dcl{color:#8AB4F8}.nstatus .ld{color:#F28B82}
.ndet{position:absolute;right:0;top:0;bottom:0;width:min(560px,62%);background:var(--dt);border-left:1px solid var(--dtl);z-index:5;display:flex;flex-direction:column}
.hdr{font:400 12.5px/21px var(--body);padding:4px 12px 20px}
.hdr .k{color:#9AA0A6;display:inline-block;width:170px;vertical-align:top}.hdr .v{font:400 12px var(--mono);color:#E3E3E3;word-break:break-all}
.hdr h5{margin:10px 0 2px;font:600 12.5px var(--body);color:#E3E3E3}
.pre{font:400 12px/1.5 var(--mono);padding:10px 12px;white-space:pre-wrap;color:#E3E3E3}
.timing{padding:10px 12px;font:400 12px/24px var(--body)}
.timing div{display:grid;grid-template-columns:170px 1fr 70px;gap:10px;align-items:center}
.timing i{display:block;height:9px}
.chipset{display:flex;gap:2px}
.chipset button{border:0;background:none;color:#BDC1C6;padding:1px 8px;border-radius:10px;font:500 12px/20px var(--body);cursor:pointer}
.chipset button[aria-pressed="true"]{background:#3C4043;color:#fff}
/* performance */
.pcan{display:block;width:100%;cursor:crosshair}
.ptip{position:absolute;z-index:30;background:#2D2E31;border:1px solid #4A4C52;border-radius:4px;padding:5px 8px;font:400 12px/1.45 var(--body);color:#E3E3E3;pointer-events:none;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.5)}
.pbottom{height:138px;flex:none;border-top:1px solid var(--dtl);display:flex;min-height:0}
.vit{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px}
.vit div{background:#27282C;border-radius:8px;padding:10px 12px;border:1px solid #3A3C42}
.vit b{display:block;font:600 11px/1 var(--body);letter-spacing:.06em;color:#9AA0A6}
.vit span{display:block;font:600 24px/1.25 var(--mono);margin-top:6px}
.vit small{font:500 11.5px var(--body);color:#9AA0A6}
.g{color:#81C995}.o{color:#FCAD70}.r{color:#F28B82}
.prec{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:360px;background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;padding:16px 18px;z-index:5;font:400 13px var(--body);box-shadow:0 10px 30px rgba(0,0,0,.5)}
.bar6{height:6px;background:#45474C;border-radius:3px;margin:10px 0}.bar6 i{display:block;height:100%;background:#8AB4F8;border-radius:3px;width:0}
.tbl{width:100%;border-collapse:collapse;font:400 12.5px/22px var(--body)}
.tbl th{position:sticky;top:0;background:var(--dt2);text-align:left;font-weight:500;color:#BDC1C6;padding:0 8px;border-bottom:1px solid var(--dtl);border-right:1px solid #2C2E33;white-space:nowrap}
.tbl td{padding:0 8px;border-bottom:1px solid #2C2E33;border-right:1px solid #2C2E33;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px}
.tbl tr:nth-child(even) td{background:#232428}
.tbl tbody tr:hover td{background:var(--dhov)}
.tbl tr.sel td{background:var(--dsel)!important}
.tbl td.m{font-family:var(--mono);font-size:12px}
.tbl td[contenteditable]{outline:none;cursor:text}.tbl td[contenteditable]:focus{outline:1px solid #8AB4F8;background:#17181A}
/* application */
.atree{width:220px;flex:none;border-right:1px solid var(--dtl);font:400 12.5px/23px var(--body);padding:4px 0}
.atree .h{padding:6px 10px 0;font:600 11px/22px var(--body);color:#9AA0A6;letter-spacing:.04em}
.atree button{display:flex;gap:7px;align-items:center;width:100%;border:0;background:none;color:#D5D7DB;padding:0 8px 0 calc(var(--d)*14px + 6px);text-align:left;cursor:pointer;white-space:nowrap;font:inherit}
.atree button:hover{background:var(--dt3)}.atree button.on{background:var(--dsel)}
.aview{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.card{background:#232428;border:1px solid #3A3C42;border-radius:8px;padding:12px 14px;margin:12px}
/* lighthouse */
.lh{padding:16px 22px 40px;font:400 13px var(--body)}
.gauges{display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px;padding:6px 0 18px;border-bottom:1px solid var(--dtl)}
.gauge{display:flex;flex-direction:column;align-items:center;gap:8px;font:500 13px var(--body);width:120px;text-align:center}
.gauge svg{width:96px;height:96px}
.lhm{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 30px;margin:12px 0}
.lhm div{display:flex;justify-content:space-between;border-bottom:1px solid #2E3035;padding:6px 0}
.aud{border-bottom:1px solid #2E3035}
.aud summary{cursor:pointer;padding:7px 0;display:flex;gap:10px;align-items:center;list-style:none}
.aud summary::-webkit-details-marker{display:none}
.aud p{margin:0 0 10px 22px;color:#BDC1C6;font-size:12.5px;line-height:1.55}
.lhform{padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;font:400 13px/1.8 var(--body)}
.lhform h5{margin:0 0 4px;font:600 12px var(--body);color:#9AA0A6;letter-spacing:.05em;text-transform:uppercase}
.lhform label{display:flex;gap:7px;align-items:center;cursor:pointer}
.lhform input{accent-color:#8AB4F8}
/* device toolbar */
.devbar{position:absolute;left:0;right:0;top:0;height:30px;background:#35363A;border-bottom:1px solid #45474C;display:flex;align-items:center;justify-content:center;gap:8px;font:400 12px var(--body);color:#E3E3E3;z-index:12;white-space:nowrap;padding:0 8px;overflow:hidden}
.devbar .inp{min-width:0;width:54px;text-align:center;height:21px}
.devbar select.inp{width:auto}
.mq{position:absolute;left:0;right:0;top:30px;height:24px;display:flex;flex-direction:column;gap:1px;padding:1px 0;z-index:12;background:#2A2B2F}
.mq i{flex:1;margin:0 auto;cursor:pointer;opacity:.55}
.mq i:hover{opacity:1}
.devstage{position:absolute;left:0;right:0;bottom:0;top:54px;background:#2A2B2F;display:flex;align-items:center;justify-content:center;overflow:hidden}
.devframe{position:relative;flex:none;background:#F4EFE8;box-shadow:0 0 0 1px #555,0 12px 30px rgba(0,0,0,.4);transform-origin:center center}
.devhandle{position:absolute;right:-14px;top:50%;width:10px;height:44px;margin-top:-22px;border-radius:5px;background:#5F6368;cursor:ew-resize}
/* drawer */
.drawer{flex:0 0 38%;border-top:1px solid var(--dtl);display:none;flex-direction:column;min-height:0;background:var(--dt)}
.drawer.on{display:flex}
/* command menu */
.cmdk{position:absolute;left:50%;top:48px;transform:translateX(-50%);width:min(620px,90%);background:#2D2E31;border:1px solid #4A4C52;border-radius:8px;box-shadow:0 14px 40px rgba(0,0,0,.6);z-index:90;overflow:hidden}
.cmdk input{width:100%;background:#1B1C1E;border:0;border-bottom:1px solid #45474C;color:#E3E3E3;font:400 15px var(--mono);padding:11px 14px;outline:none}
.cmdk .list{max-height:320px;overflow:auto}
.cmdk .it{display:flex;gap:14px;padding:0 14px;font:400 13px/34px var(--body);cursor:pointer;color:#E3E3E3}
.cmdk .it small{width:88px;color:#9AA0A6;flex:none;font-size:11.5px}
.cmdk .it.hi{background:var(--dsel)}
.cmdk .it b{color:#8AB4F8;font-weight:600}
.cmdk .foot{display:flex;gap:14px;flex-wrap:wrap;padding:7px 14px;border-top:1px solid #45474C;font:400 11.5px var(--body);color:#9AA0A6}
.cmdk .foot b{color:#FFE599;font-family:var(--mono)}
.toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#E8EAED;color:#202124;border-radius:6px;padding:8px 14px;font:500 13px var(--body);z-index:95;box-shadow:0 6px 20px rgba(0,0,0,.4);pointer-events:none;white-space:nowrap}
.fps{position:absolute;right:8px;top:8px;z-index:25;background:rgba(0,0,0,.78);color:#81C995;font:600 11px/1.4 var(--mono);padding:6px 8px;border-radius:4px;pointer-events:none;width:128px}
.fps canvas{display:block;margin-top:4px}
.flashbox{position:absolute;z-index:24;pointer-events:none;background:rgba(0,255,0,.3);border:1px solid #0f0}
.shiftbox{position:absolute;z-index:24;pointer-events:none;background:rgba(79,163,247,.35);border:1px solid #4FA3F7}
/* hotspots */
.pin{position:absolute;z-index:70;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#FFE599;color:#111;font:700 12px/22px var(--mono);text-align:center;box-shadow:0 0 0 3px rgba(255,229,153,.3),0 3px 10px rgba(0,0,0,.5);pointer-events:none;animation:pinin .3s ease-out both}
@keyframes pinin{from{transform:scale(.3);opacity:0}}
.spot{position:absolute;z-index:69;pointer-events:none;border:2px solid #FFE599;border-radius:6px;box-shadow:0 0 0 9999px rgba(0,0,0,.35),0 0 24px rgba(255,229,153,.5);transition:all .18s}
/* guide rail */
.guide{position:sticky;top:74px;background:var(--surface);border:1px solid var(--rule);border-radius:14px;max-height:calc(100vh - 92px);overflow:auto;scrollbar-width:thin;scrollbar-color:#2E3A58 transparent}
.guide header{padding:18px 20px 14px;border-bottom:1px solid var(--rule)}
.guide .gk{font:600 11.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--c,var(--content))}
.guide h2{margin:8px 0 6px;font:800 34px/1 var(--display);letter-spacing:-.025em}
.guide .gl{margin:0;color:var(--ink2);font-size:14.5px;line-height:1.55}
.guide section{padding:14px 20px;border-bottom:1px solid var(--rule)}
.guide h3{margin:0 0 10px;font:600 11.5px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mut);display:flex;align-items:center;gap:10px}
.guide h3 button{margin-left:auto;font:500 11.5px var(--body);letter-spacing:0;text-transform:none;background:none;border:1px solid var(--rule2);border-radius:6px;color:var(--ink2);padding:3px 8px;cursor:pointer}
.guide h3 button[aria-pressed="true"]{border-color:#FFE599;color:#FFE599}
.map{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.map li{display:flex;gap:10px;padding:6px 8px;border-radius:8px;font-size:13.5px;line-height:1.45;color:var(--ink2);cursor:default}
.map li:hover{background:var(--surface2)}
.map li b{color:#fff;font-weight:600}
.map .n{flex:none;width:21px;height:21px;border-radius:50%;background:#FFE599;color:#111;font:700 11px/21px var(--mono);text-align:center;margin-top:1px}
.tasks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.tasks li{display:flex;gap:10px;font-size:13.5px;line-height:1.45;color:var(--ink2);padding:7px 9px;border:1px solid var(--rule);border-radius:8px}
.tasks li i{flex:none;width:16px;height:16px;border-radius:4px;border:1.5px solid var(--faint);margin-top:2px;display:grid;place-items:center;font:700 11px/1 var(--body);font-style:normal;color:#0A0E18}
.tasks li.done{border-color:rgba(147,196,125,.45);background:rgba(147,196,125,.06)}
.tasks li.done i{background:var(--padding);border-color:var(--padding)}
.tasks li.done i::after{content:"✓"}
.tasks code,.guide p code,.facts code{font-size:.86em;color:#9FD6FF;background:rgba(111,168,220,.1);padding:1px 5px;border-radius:4px}
.tasks button.go{margin-left:auto;flex:none;align-self:center;font:500 11.5px var(--body);background:none;border:1px solid var(--rule2);color:var(--act);border-radius:6px;padding:2px 8px;cursor:pointer}
.gkeys{display:flex;flex-direction:column;gap:6px;font-size:13.5px;color:var(--ink2)}
.gkeys div{display:flex;justify-content:space-between;gap:10px;align-items:center}
.gkeys span.ks{display:flex;gap:3px;flex:none}
.facts{margin:0;padding-left:18px;font-size:13.5px;color:var(--ink2);line-height:1.5;display:flex;flex-direction:column;gap:6px}
.progress{display:flex;gap:4px;margin-top:12px}
.progress i{flex:1;height:4px;border-radius:2px;background:var(--rule2)}
.progress i.on{background:var(--c,var(--content))}
/* sections below */
.sec{padding-block:80px 10px}
.sech{display:flex;align-items:end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px}
.sech h2{margin:0;font:800 clamp(32px,4.4vw,58px)/.95 var(--display);letter-spacing:-.03em;text-wrap:balance;max-width:18ch}
.sech p{margin:0;color:var(--ink2);max-width:52ch}
.vidgrid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:start}
.vid{position:relative;border-radius:14px;overflow:hidden;background:#000;border:1px solid var(--rule2);aspect-ratio:16/9;max-width:100%}
.vid video{display:block;width:100%;height:100%}
.chap{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;counter-reset:c}
.chap button{width:100%;display:flex;gap:12px;align-items:center;border:0;background:none;color:var(--ink2);padding:7px 10px;border-radius:8px;cursor:pointer;text-align:left;font:500 14px var(--body)}
.chap button:hover{background:var(--surface)}
.chap button.on{background:var(--surface2);color:#fff}
.chap time{font:600 12px var(--mono);color:var(--mut);width:40px;flex:none}
.chap i{width:9px;height:9px;border-radius:2px;background:var(--c);flex:none}
.oskey{display:inline-flex;border:1px solid var(--rule2);border-radius:10px;padding:3px;gap:3px}
.oskey button{border:0;background:none;color:var(--ink2);padding:6px 14px;border-radius:7px;cursor:pointer;font:600 13px var(--body)}
.oskey button[aria-pressed="true"]{background:var(--surface2);color:#fff}
.kgrid{columns:4 280px;column-gap:16px}
.kgrid .kgroup{break-inside:avoid;margin-bottom:16px}
.kgroup{background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:16px 18px}
.kgroup h3{margin:0 0 12px;font:600 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--c)}
.krow{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:6px 0;border-top:1px solid var(--rule);font-size:14px;color:var(--ink2)}
.krow:first-of-type{border-top:0}
.krow .ks{display:flex;gap:3px;flex:none;flex-wrap:wrap;justify-content:flex-end}
.triage{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media (max-width:1100px){.triage{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.triage{grid-template-columns:1fr}}
.tcard{text-align:left;background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:16px 16px 14px;cursor:pointer;color:var(--ink);display:flex;flex-direction:column;gap:10px;font:inherit;position:relative;overflow:hidden}
.tcard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:var(--c);transition:width .18s}
.tcard:hover{border-color:var(--c)}
.tcard:hover::before{width:4px}
.tcard q{font:600 17px/1.3 var(--body);quotes:"“" "”"}
.tcard span{font:600 12px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--c);display:flex;align-items:center;gap:8px}
.tcard small{color:var(--mut);font-size:13px;line-height:1.45}
.xb{overflow-x:auto;border:1px solid var(--rule);border-radius:12px}
.xb table{width:100%;border-collapse:collapse;min-width:640px;font-size:14px}
.xb th,.xb td{padding:11px 16px;text-align:left;border-bottom:1px solid var(--rule)}
.xb th{font:600 12px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);background:var(--ground2)}
.xb td:first-child{font-weight:600;color:#fff}
.xb td{color:var(--ink2)}
.xb tr:last-child td{border-bottom:0}
footer{padding-block:70px 60px;color:var(--mut);font-size:13.5px}
footer .wrap{border-top:1px solid var(--rule);padding-top:22px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:1180px){.simgrid{grid-template-columns:1fr}.guide{position:static;max-height:none}.intro{grid-template-columns:1fr}.vidgrid{grid-template-columns:1fr}}
@media (max-width:640px){.browser{height:720px}.sec{padding-block:56px 6px}.intro{padding-block:32px 18px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}html{scroll-behavior:auto}}
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="f-protan"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>
<filter id="f-deuter"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>
<filter id="f-tritan"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>
</defs></svg>

<header class="top"><div class="wrap">
 <a class="brand" href="#top"><span class="kbd">F12</span>Field Guide</a>
 <nav aria-label="Sections"><a href="#sim">Simulator</a><a href="#video">60-second video</a><a href="#shortcuts">Shortcuts</a><a href="#triage">Which panel?</a><a href="#browsers">Other browsers</a></nav>
</div></header>

<main id="top">
<section class="wrap intro">
 <div>
  <p class="eyebrow">Interactive tour · Chromium DevTools</p>
  <h1>Press <span class="k">F12</span>. Here’s everything that opens.</h1>
 </div>
 <div>
  <p class="lede">Below is a working browser with DevTools docked. Every panel is live: inspect the page, edit CSS, run JavaScript in the Console, pause code on a breakpoint, block a request, record a profile. The guide beside it labels each part of the panel and gives you things to try.</p>
  <div class="boxkey"><div class="bm" aria-hidden="true"><div class="m"></div><div class="b"></div><div class="p"></div><div class="c"></div></div>
   <ul><li><i style="--c:var(--content)"></i>content</li><li><i style="--c:var(--padding)"></i>padding</li><li><i style="--c:var(--border)"></i>border</li><li><i style="--c:var(--margin)"></i>margin</li></ul>
   <span>The four colors DevTools paints over any element you hover. This guide uses them throughout.</span></div>
 </div>
</section>

<section class="wrap" id="sim" aria-label="DevTools simulator">
 <div class="keys" id="keys"></div>
 <div class="simgrid">
  <div class="simscroll"><div class="browser" id="browser" tabindex="0" aria-label="Simulated browser with DevTools">
   <div class="bch">
    <div class="btabs"><span class="lights"><i></i><i></i><i></i></span><div class="btab on"><span class="fav"></span><span id="tabTitle">Driftwood — Specialty Coffee</span></div><div class="btab"><span>New Tab</span></div></div>
    <div class="omni"><button aria-label="Back" tabindex="-1"><svg class="i" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5"/></svg></button><button aria-label="Forward" tabindex="-1"><svg class="i" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></button><button id="reloadBtn" aria-label="Reload page" title="Reload (records in Network)"><svg class="i" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/></svg></button>
     <div class="url"><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px;color:#9AA0A6"><rect x="3.5" y="7" width="9" height="6.5" rx="1.2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>driftwood.coffee<span class="dim">/shop</span></span></div>
     <button aria-label="Toggle DevTools (F12)" id="f12btn" title="F12"><svg class="i" viewBox="0 0 16 16"><rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M9 2.5v11"/></svg></button></div>
   </div>
   <div class="bbody bottom" id="bbody">
    <div class="pagearea" id="pagearea"><div class="viewport" id="viewport"><div id="pageHost"></div></div><div id="hl"></div></div>
    <div class="splitter" id="splitter"></div>
    <div class="dt" id="dt">
     <div class="dtt">
      <button class="icb" id="inspectBtn" aria-pressed="false" title="Select an element to inspect it (Ctrl+Shift+C)" data-hs="tabs-inspect"><svg class="i" viewBox="0 0 16 16"><path d="M7 2.5H3.3a.8.8 0 0 0-.8.8v8.4a.8.8 0 0 0 .8.8H7"/><path d="M8 7l6.5 2.4-2.8 1.2-1.3 2.9z"/></svg></button>
      <button class="icb" id="deviceBtn" aria-pressed="false" title="Toggle device toolbar (Ctrl+Shift+M)"><svg class="i" viewBox="0 0 16 16"><rect x="1.5" y="3" width="8.5" height="11" rx="1.2"/><rect x="11" y="6.5" width="3.8" height="7.5" rx=".8"/></svg></button>
      <div class="ptabs" role="tablist" id="ptabs"></div>
      <div class="dtr"><button class="bdg e" id="errBdg" title="Open Console">✕ <span>0</span></button><button class="bdg w" id="warnBdg" title="Open Console">▲ <span>0</span></button>
       <button class="icb" id="kebab" title="Customize and control DevTools"><svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="3.5" r=".8"/><circle cx="8" cy="8" r=".8"/><circle cx="8" cy="12.5" r=".8"/></svg></button>
       <button class="icb" id="closeDt" title="Close DevTools"><svg class="i" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>
     </div>
     <div class="panels" id="panels"></div>
     <div class="drawer" id="drawer"></div>
    </div>
   </div>
  </div></div>
  <aside class="guide" id="guide" aria-live="polite"></aside>
 </div>
</section>

<section class="wrap sec" id="video">
 <div class="sech"><h2>The whole toolbox in 60 seconds</h2><p>Twelve chapters, one per panel, cut to the beat. Jump to any chapter from the list, or watch it straight through with sound on.</p></div>
 <div class="vidgrid">
  <div class="vid"><video id="vid" controls playsinline preload="metadata" poster="poster.jpg"><source src="devtools-60s.mp4" type="video/mp4"></video></div>
  <ol class="chap" id="chap"></ol>
 </div>
</section>

<section class="wrap sec" id="shortcuts">
 <div class="sech"><h2>Shortcuts worth memorizing</h2><div class="oskey" role="group" aria-label="Keyboard layout"><button aria-pressed="true" data-os="win">Windows / Linux</button><button aria-pressed="false" data-os="mac">macOS</button></div></div>
 <div class="kgrid" id="kgrid"></div>
</section>

<section class="wrap sec" id="triage">
 <div class="sech"><h2>Which panel do I open?</h2><p>Start from the symptom. Each card opens the right panel in the simulator above with the relevant part highlighted.</p></div>
 <div class="triage" id="tgrid"></div>
</section>

<section class="wrap sec" id="browsers">
 <div class="sech"><h2>Same tools, other names</h2><p>Edge uses Chromium DevTools unchanged. Firefox and Safari ship equivalents under different panel names.</p></div>
 <div class="xb"><table><thead><tr><th>Job</th><th>Chrome · Edge</th><th>Firefox</th><th>Safari</th></tr></thead><tbody>
  <tr><td>DOM &amp; CSS</td><td>Elements</td><td>Inspector</td><td>Elements</td></tr>
  <tr><td>Run JavaScript, read logs</td><td>Console</td><td>Console</td><td>Console</td></tr>
  <tr><td>Breakpoints &amp; stepping</td><td>Sources</td><td>Debugger</td><td>Sources</td></tr>
  <tr><td>Requests &amp; timing</td><td>Network</td><td>Network</td><td>Network</td></tr>
  <tr><td>Runtime profiling</td><td>Performance</td><td>Performance (Firefox Profiler)</td><td>Timelines</td></tr>
  <tr><td>Heap &amp; leaks</td><td>Memory</td><td>Memory</td><td>Timelines › JavaScript Allocations</td></tr>
  <tr><td>Storage, cookies, service workers</td><td>Application</td><td>Storage</td><td>Storage</td></tr>
  <tr><td>Mobile viewport</td><td>Device toolbar (Ctrl+Shift+M)</td><td>Responsive Design Mode (Ctrl+Shift+M)</td><td>Develop › Enter Responsive Design Mode</td></tr>
  <tr><td>Open the tools</td><td>F12 · Ctrl+Shift+I · ⌘⌥I</td><td>F12 · Ctrl+Shift+I · ⌘⌥I</td><td>⌘⌥I (enable Develop menu first)</td></tr>
 </tbody></table></div>
</section>
</main>
<footer><div class="wrap"><span>F12 Field Guide · simulator modeled on Chromium DevTools. Driftwood is a fictional demo shop; nothing here makes real network requests.</span><span>Keyboard: click the browser first, then use the shortcuts shown above it.</span></div></footer>

<script>
/* ================= core ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const h=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmtBytes=b=>b===0?'0 B':b<1000?b+' B':b<1e6?(b/1000).toFixed(1)+' kB':(b/1e6).toFixed(1)+' MB';
const fmtMs=ms=>ms<1000?Math.round(ms)+' ms':(ms/1000).toFixed(2)+' s';
const now=()=>performance.now();
const store={get(k,d){try{const v=localStorage.getItem('f12g:'+k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem('f12g:'+k,JSON.stringify(v))}catch{}}};

const bus={h:{},on(e,f){(this.h[e]=this.h[e]||[]).push(f)},emit(e,d){(this.h[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})}};
const track=t=>bus.emit('task',t);

const IC={
 clear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M4.2 11.8l7.6-7.6"/></svg>',
 rec:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4.2"/></svg>',
 reload:'<svg class="i" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/></svg>',
 eye:'<svg class="i" viewBox="0 0 16 16"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>',
 gear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>',
 dl:'<svg class="i" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3M3 13.5h10"/></svg>',
 up:'<svg class="i" viewBox="0 0 16 16"><path d="M8 14V6M5 9l3-3 3 3M3 2.5h10"/></svg>',
 funnel:'<svg class="i" viewBox="0 0 16 16"><path d="M2 3h12l-4.5 5.5V13l-3-1.5v-3z"/></svg>',
 resume:'<svg class="i" viewBox="0 0 16 16"><path d="M3 3v10"/><path d="M6.5 3l7 5-7 5z" fill="currentColor"/></svg>',
 over:'<svg class="i" viewBox="0 0 16 16"><path d="M2.5 9a5.5 5.5 0 0 1 10.3-2.6"/><path d="M13.3 2.8v3.8H9.6"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor"/></svg>',
 into:'<svg class="i" viewBox="0 0 16 16"><path d="M8 1.5v7.5M5 6l3 3 3-3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 out:'<svg class="i" viewBox="0 0 16 16"><path d="M8 10V2.5M5 5.5l3-3 3 3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 step:'<svg class="i" viewBox="0 0 16 16"><path d="M2 8h9M8 5l3 3-3 3"/><circle cx="13.5" cy="8" r="1.2" fill="currentColor"/></svg>',
 deact:'<svg class="i" viewBox="0 0 16 16"><path d="M2 4.5h8l3.5 3.5-3.5 3.5H2z"/><path d="M1.5 14L14 2"/></svg>',
 trash:'<svg class="i" viewBox="0 0 16 16"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.7 9h5.6l.7-9"/></svg>',
 play:'<svg class="i" viewBox="0 0 16 16"><path d="M4.5 3l8 5-8 5z" fill="currentColor"/></svg>',
 plus:'<svg class="i" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
};

/* ---------- simulator state ---------- */
const ST={open:true,dock:'bottom',panel:'elements',inspecting:false,device:false,drawer:false,drawerTab:'console',sel:null,
 throttle:'none',cpu:1,offline:false,disableCache:true,preserve:false,blocked:new Set(),jsDisabled:false,forceHover:new WeakSet(),
 scheme:'light',vision:'none',paint:false,shifts:false,fps:false,hidden:new WeakSet(),loadCount:0,coverage:null,changes:[]};
const PANELS=[['elements','Elements'],['console','Console'],['sources','Sources'],['network','Network'],['performance','Performance'],['memory','Memory'],['application','Application'],['lighthouse','Lighthouse']];

/* ---------- toast inside the simulated browser ---------- */
let toastT;function toast(msg){const b=$('#browser');let t=$('.toast',b);if(!t){t=h('<div class="toast"></div>');b.appendChild(t)}t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2200)}

/* ---------- context menus ---------- */
function openMenu(x,y,items,anchor=$('#browser')){closeMenu();const m=h('<div class="menu" role="menu"></div>');
 items.forEach(it=>{if(it==='-'){m.appendChild(document.createElement('hr'));return}if(it.head){m.appendChild(h(`<div class="h">${esc(it.head)}</div>`));return}
  const b=h(`<button role="menuitem">${esc(it.label)}${it.hint?`<small>${esc(it.hint)}</small>`:''}</button>`);b.onclick=e=>{e.stopPropagation();closeMenu();it.act&&it.act()};m.appendChild(b)});
 anchor.appendChild(m);const ar=anchor.getBoundingClientRect();let lx=x-ar.left,ly=y-ar.top;const mw=m.offsetWidth,mh=m.offsetHeight;if(lx+mw>ar.width-4)lx=ar.width-mw-4;if(ly+mh>ar.height-4)ly=Math.max(4,ly-mh);m.style.left=lx+'px';m.style.top=ly+'px';
 setTimeout(()=>document.addEventListener('mousedown',closeMenuOut,{once:true}),0);return m}
function closeMenuOut(e){if(!e.target.closest('.menu'))closeMenu();else document.addEventListener('mousedown',closeMenuOut,{once:true})}
function closeMenu(){$$('.menu').forEach(m=>m.remove())}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copied to clipboard')}catch{toast('Clipboard blocked here — text logged to Console');CON.add({type:'log',args:[t],src:'copy'})}}

/* ================= demo page (lives in a shadow root) ================= */
const PRODUCTS=[
 {id:'guji',name:'Ethiopia Guji',notes:'Peach · jasmine · honey',price:18.5,art:'linear-gradient(135deg,#C8553D,#F28F3B)'},
 {id:'huila',name:'Colombia Huila',notes:'Red apple · cocoa · caramel',price:17,art:'linear-gradient(135deg,#588B8B,#C8D5B9)'},
 {id:'nyeri',name:'Kenya Nyeri',notes:'Blackcurrant · grapefruit',price:19.5,art:'linear-gradient(135deg,#6B4E71,#E0A458)'}];

/* CSS rule model = the site's app.css. Styles pane edits this. */
let RULES=[
 {sel:'body.shop',d:[['margin','0'],['font-family','"IBM Plex Sans", system-ui, sans-serif'],['color','#1C1714'],['background','#F4EFE8'],['line-height','1.5']]},
 {sel:'.nav',d:[['display','flex'],['align-items','center'],['gap','18px'],['padding','14px 24px'],['border-bottom','1px solid #E3D9CC'],['position','sticky'],['top','0'],['background','#F4EFE8'],['z-index','5']]},
 {sel:'.logo',d:[['font','800 18px/1 "Bricolage Grotesque", sans-serif'],['letter-spacing','0.12em'],['color','#1C1714'],['text-decoration','none'],['margin-right','auto']]},
 {sel:'.nav-link',d:[['color','#5B4F45'],['text-decoration','none'],['font-size','14px']]},
 {sel:'.icon-btn',d:[['border','1px solid #D8CCBD'],['background','transparent'],['color','#1C1714'],['border-radius','999px'],['padding','5px 12px'],['font-family','inherit'],['font-size','13px'],['cursor','pointer']]},
 {sel:'.hero',d:[['display','grid'],['grid-template-columns','1.3fr 1fr'],['gap','24px'],['align-items','center'],['padding','32px 24px 28px']]},
 {sel:'.hero-title',d:[['font','800 44px/1.02 "Bricolage Grotesque", sans-serif'],['letter-spacing','-0.02em'],['margin','0']]},
 {sel:'.lede',d:[['color','#6A5D52'],['font-size','16px'],['margin','10px 0 18px']]},
 {sel:'.hero-art',d:[['aspect-ratio','4 / 3'],['border-radius','16px'],['background','linear-gradient(135deg, #C8553D, #F28F3B 55%, #FFD6A5)']]},
 {sel:'.btn',d:[['display','inline-block'],['background','#333'],['color','#fff'],['padding','10px 16px'],['border','0'],['border-radius','6px'],['font-family','inherit'],['font-size','14px'],['font-weight','600'],['text-decoration','none'],['cursor','pointer']]},
 {sel:'.btn.cta',d:[['background','#E4572E'],['padding','14px 28px'],['border-radius','999px'],['font-size','16px'],['transition','transform .15s, box-shadow .15s']]},
 {sel:'.btn.cta:hover',d:[['transform','translateY(-2px)'],['box-shadow','0 8px 20px rgb(228 87 46 / 40%)']]},
 {sel:'.cards',d:[['display','grid'],['grid-template-columns','repeat(3, 1fr)'],['gap','16px'],['padding','0 24px 24px']]},
 {sel:'.card',d:[['background','#fff'],['border-radius','12px'],['overflow','hidden'],['box-shadow','0 1px 0 #E3D9CC']]},
 {sel:'.thumb',d:[['height','96px'],['background','var(--art)']]},
 {sel:'.card h3',d:[['font-size','15px'],['margin','10px 12px 2px']]},
 {sel:'.notes',d:[['font-size','12.5px'],['color','#8A7B6D'],['margin','0 12px']]},
 {sel:'.card .row',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['padding','10px 12px 12px']]},
 {sel:'.price',d:[['font','600 13px "JetBrains Mono", monospace'],['color','#5B4F45']]},
 {sel:'.btn.add',d:[['padding','6px 12px'],['font-size','13px']]},
 {sel:'.cart-bar',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['gap','12px'],['margin','0 24px 18px'],['padding','12px 16px'],['background','#1C1714'],['color','#F4EFE8'],['border-radius','12px']]},
 {sel:'.btn.checkout',d:[['background','#F4EFE8'],['color','#1C1714']]},
 {sel:'.news',d:[['display','flex'],['gap','12px'],['align-items','center'],['justify-content','space-between'],['padding','8px 24px 48px'],['color','#6A5D52']]},
 {sel:'.toasts',d:[['position','sticky'],['bottom','14px'],['height','0'],['display','flex'],['flex-direction','column'],['justify-content','flex-end'],['align-items','center'],['gap','8px']]},
 {sel:'.toast',d:[['background','#1C1714'],['color','#fff'],['padding','10px 16px'],['border-radius','10px'],['font-size','14px'],['box-shadow','0 8px 20px rgb(0 0 0 / 25%)']]},
 {sel:'.toast.err',d:[['background','#B3261E']]},
 {sel:'body.shop[data-theme="dark"]',d:[['background','#171311'],['color','#F1E9DF']]},
 {sel:'[data-theme="dark"] .nav',d:[['background','#171311'],['border-color','#3A302A']]},
 {sel:'[data-theme="dark"] .card',d:[['background','#241E1B'],['box-shadow','none']]},
 {sel:'[data-theme="dark"] .logo, [data-theme="dark"] .icon-btn',d:[['color','#F1E9DF']]},
 {sel:'.hero',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.hero-art',media:'(max-width: 620px)',d:[['aspect-ratio','16 / 6']]},
 {sel:'.hero-title',media:'(max-width: 620px)',d:[['font-size','34px']]},
 {sel:'.cards',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.nav-link',media:'(max-width: 440px)',d:[['display','none']]},
];
RULES.forEach((r,i)=>{r.id=i;r.d=r.d.map(([p,v])=>({p,v,on:true,orig:v}))});
function cssText(forSources){let out='/* Driftwood · app.css */\n';let line=2;const lines=[];
 const emit=s=>{out+=s+'\n';line++};
 let lastMedia=null;
 RULES.forEach(r=>{if(r.media!==lastMedia){if(lastMedia)emit('}');if(r.media)emit(`@media ${r.media} {`);lastMedia=r.media}
  const ind=r.media?'  ':'';r.line=line;emit(`${ind}${r.sel} {`);r.d.forEach(dd=>{dd.line=line;emit(`${ind}  ${dd.on?'':'/* '}${dd.p}: ${dd.v};${dd.on?'':' */'}`)});emit(`${ind}}`)});
 if(lastMedia)emit('}');return out}
function genCSS(){let css='';RULES.forEach(r=>{const body=r.d.filter(d=>d.on).map(d=>`${d.p}:${d.v}`).join(';');let sel=r.sel;if(sel.includes(':hover'))sel=sel+', '+sel.replace(/:hover/g,'.__hov');const blk=`${sel}{${body}}`;css+=r.media?`@container page ${r.media}{${blk}}`:blk});return css}
function specificity(sel){const s=sel.replace(/::[\w-]+/g,'');const a=(s.match(/#[\w-]+/g)||[]).length,b=(s.match(/(\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+)/g)||[]).length,c=(s.replace(/(\.[\w-]+|\[[^\]]+\]|:[\w-]+|#[\w-]+)/g,' ').match(/(^|[\s>+~])[a-z][\w-]*/gi)||[]).length;return a*10000+b*100+c}

const pageHost=$('#pageHost');const shadow=pageHost.attachShadow({mode:'open'});
shadow.innerHTML=`<style>:host{display:block;position:absolute;inset:0;overflow:auto;container-type:inline-size;container-name:page;background:#F4EFE8;scrollbar-width:thin}
html{display:block;min-height:100%}head{display:none}
.__web-inspector-hide-shortcut__{visibility:hidden!important}
.hero-art.__blocked{background:repeating-linear-gradient(45deg,#e8e0d6 0 10px,#efe8df 10px 20px)!important;outline:1px dashed #c9bba9}
.__nojs .btn{cursor:not-allowed}
</style><style id="appcss"></style>`;
const appcss=$('#appcss',shadow);
function applyCSS(){cssText();appcss.textContent=ST.effBlocked&&ST.effBlocked.has('app.css')?'':genCSS();bus.emit('css')}
const HTML=document.createElement('html');HTML.setAttribute('lang','en');
const HEAD=document.createElement('head');HEAD.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Driftwood — Specialty Coffee</title><link rel="manifest" href="/manifest.json"><script src="/js/vendor.min.js" defer></'+'script><script src="/js/app.js" type="module"></'+'script><script src="/js/cart.js" type="module"></'+'script>';
const BODY=document.createElement('body');BODY.className='shop';BODY.dataset.theme='light';
BODY.innerHTML=`<nav class="nav"><a class="logo" href="/">DRIFTWOOD</a><a class="nav-link" href="/shop">Shop</a><a class="nav-link" href="/guides">Brew guides</a><button class="icon-btn theme-toggle" aria-label="Toggle dark theme">☾ Theme</button><button class="icon-btn cart-pill">Cart <b class="count">0</b></button></nav>
<header class="hero"><div><h1 class="hero-title">Slow coffee, fast site.</h1><p class="lede">Single-origin beans, roasted every Tuesday in small batches.</p><a class="btn cta" href="#shop">Order beans →</a></div><div class="hero-art" role="img" aria-label="Pour-over coffee"></div></header>
<section class="cards" id="shop">${PRODUCTS.map(p=>`<article class="card" data-id="${p.id}" style="--art:${p.art}"><div class="thumb"></div><h3>${p.name}</h3><p class="notes">${p.notes}</p><div class="row"><span class="price">$${p.price.toFixed(2)}</span><button class="btn add">Add</button></div></article>`).join('')}</section>
<aside class="cart-bar"><span>Cart: <b class="count">0</b> items · <b class="total">$0.00</b></span><button class="btn checkout">Checkout</button></aside>
<section class="news"><p>Roast-day emails, once a week.</p><button class="btn subscribe">Subscribe</button></section>
<div class="toasts" aria-live="polite"></div>`;
HTML.append(HEAD,BODY);shadow.appendChild(HTML);
const PAGE={root:HTML,body:BODY,shadow,q:s=>BODY.querySelector(s),qa:s=>[...BODY.querySelectorAll(s)]};

/* ---------- storage model (Application panel) ---------- */
const LS=new Map([['theme','light'],['cart','[]'],['lastVisit','2026-09-24T21:14:03Z'],['ab_hero','B'],['consent','{"analytics":true,"ads":false}']]);
const SS=new Map([['checkoutStep','1'],['utm_source','newsletter']]);
let COOKIES=[
 {name:'session',value:'8f2c1d77e91a4b0c',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Lax',priority:'Medium'},
 {name:'csrf_token',value:'Zk3r9Qa7Lm2x',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Strict',priority:'High'},
 {name:'cart_id',value:'c_20931',domain:'.driftwood.coffee',path:'/',expires:'2026-10-24T21:14:03Z',httpOnly:false,secure:false,sameSite:'None',priority:'Medium',issue:'SameSite=None without Secure: this cookie is rejected by the browser.'},
 {name:'_ga',value:'GA1.1.447190.1727212443',domain:'.driftwood.coffee',path:'/',expires:'2027-10-29T09:00:00Z',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'},
 {name:'theme',value:'light',domain:'driftwood.coffee',path:'/',expires:'2027-09-24T21:14:03Z',httpOnly:false,secure:true,sameSite:'Lax',priority:'Low'}];
let IDB=[{key:'A-1042',value:'{item:"Ethiopia Guji", qty:2, total:37}'},{key:'A-1043',value:'{item:"Colombia Huila", qty:1, total:17}'},{key:'A-1044',value:'{item:"Kenya Nyeri", qty:3, total:58.5}'}];
let CACHES=[{name:'sw-v3',entries:[['/','text/html','14.2 kB'],['/css/app.css','text/css','8.1 kB'],['/js/app.js','text/javascript','42.7 kB'],['/js/cart.js','text/javascript','6.4 kB'],['/img/hero.avif','image/avif','182 kB']]}];
const SW={status:'activated and is running',offline:false,updateOnReload:false,bypass:false,version:'#412'};

/* ================= console model ================= */
const CON={msgs:[],listeners:[],add(m){m.id=CON.msgs.length?CON.msgs[CON.msgs.length-1].id+1:1;m.time=Date.now();
  const last=CON.msgs[CON.msgs.length-1];
  if(last&&last.type===m.type&&m.type!=='result'&&m.type!=='input'&&!m.table&&last.sig&&last.sig===(m.sig=sigOf(m))){last.count=(last.count||1)+1;CON.listeners.forEach(f=>f('update',last));return last}
  m.sig=m.sig||sigOf(m);CON.msgs.push(m);CON.listeners.forEach(f=>f('add',m));bus.emit('console-count');return m},
 clear(){CON.msgs=[];CON.listeners.forEach(f=>f('clear'));bus.emit('console-count')}};
function sigOf(m){try{return m.type+'|'+(m.src||'')+'|'+m.args.map(a=>typeof a==='object'&&a!==null?'[o]':String(a)).join(' ')}catch{return ''}}
const pageConsole={};
['log','info','warn','error','debug'].forEach(k=>pageConsole[k]=(...args)=>CON.add({type:k==='debug'?'verbose':k,args,src:pageConsole._src||'VM1:1'}));
pageConsole.table=(data)=>CON.add({type:'log',table:data,args:[data],src:pageConsole._src||'VM1:1'});
const timers={},counters={};
pageConsole.time=(l='default')=>{timers[l]=now()};
pageConsole.timeEnd=(l='default')=>{if(timers[l]==null){pageConsole.warn(`Timer '${l}' does not exist`);return}const d=now()-timers[l];delete timers[l];CON.add({type:'log',args:[`${l}: ${d.toFixed(3)} ms`],src:pageConsole._src||'VM1:1',plain:true})};
pageConsole.count=(l='default')=>{counters[l]=(counters[l]||0)+1;CON.add({type:'log',args:[`${l}: ${counters[l]}`],plain:true,src:pageConsole._src||'VM1:1'})};
pageConsole.group=(...a)=>CON.add({type:'log',group:true,args:a.length?a:['console.group'],src:'VM1:1'});pageConsole.groupEnd=()=>{};
pageConsole.trace=(...a)=>CON.add({type:'log',args:['console.trace',...a],trace:['(anonymous) @ VM1:1'],src:'VM1:1'});
pageConsole.assert=(c,...a)=>{if(!c)CON.add({type:'error',args:['Assertion failed:',...a],src:'VM1:1'})};
pageConsole.dir=(o)=>CON.add({type:'log',args:[o],src:'VM1:1'});
pageConsole.clear=()=>{CON.clear();CON.add({type:'verbose',args:['Console was cleared'],plain:true,src:''})};
function withSrc(src,fn){const p=pageConsole._src;pageConsole._src=src;try{fn()}finally{pageConsole._src=p}}

/* ================= network model ================= */
const THROTTLE={none:{k:1,label:'No throttling'},fast4g:{k:1.7,label:'Fast 4G'},slow4g:{k:3.4,label:'Slow 4G'},'3g':{k:5.5,label:'3G'},offline:{k:1,label:'Offline'}};
const RESOURCES=[
 {name:'shop',path:'/shop',type:'document',mime:'text/html',init:'Other',size:14200,start:0,dur:212,first:true},
 {name:'app.css',path:'/css/app.css',type:'stylesheet',mime:'text/css',init:'shop',size:8100,start:226,dur:64,cache:true},
 {name:'IBMPlexSans.woff2',path:'/fonts/IBMPlexSans.woff2',type:'font',mime:'font/woff2',init:'app.css',size:48300,start:298,dur:88,cache:true},
 {name:'app.js',path:'/js/app.js',type:'script',mime:'text/javascript',init:'shop',size:42700,start:228,dur:120,cache:true},
 {name:'cart.js',path:'/js/cart.js',type:'script',mime:'text/javascript',init:'app.js:3',size:6400,start:352,dur:41,cache:true},
 {name:'vendor.min.js',path:'/js/vendor.min.js',type:'script',mime:'text/javascript',init:'shop',size:188000,start:230,dur:170,cache:true},
 {name:'hero.avif',path:'/img/hero.avif',type:'avif',mime:'image/avif',init:'shop',size:182000,start:240,dur:260,cache:true},
 {name:'guji.webp',path:'/img/guji.webp',type:'webp',mime:'image/webp',init:'shop',size:34200,start:420,dur:96,cache:true},
 {name:'huila.webp',path:'/img/huila.webp',type:'webp',mime:'image/webp',init:'shop',size:31800,start:424,dur:91,cache:true},
 {name:'nyeri.webp',path:'/img/nyeri.webp',type:'webp',mime:'image/webp',init:'shop',size:36000,start:430,dur:102,cache:true},
 {name:'products?limit=12',path:'/api/products?limit=12',type:'fetch',mime:'application/json',init:'app.js:41',size:3100,start:520,dur:148,api:true},
 {name:'analytics.js',path:'/js/analytics.js',type:'script',mime:'text/javascript',init:'shop',size:22500,start:560,dur:76,cache:true},
 {name:'og-image.png',path:'/img/og-image.png',type:'png',mime:'text/html',init:'shop',size:512,start:600,dur:48,status:404},
 {name:'collect?v=2',path:'/collect?v=2&tid=G-D1',type:'ping',mime:'text/plain',init:'analytics.js:1',size:0,start:760,dur:35,status:204},
 {name:'manifest.json',path:'/manifest.json',type:'manifest',mime:'application/manifest+json',init:'Other',size:1100,start:820,dur:12,cache:true},
 {name:'sw.js',path:'/sw.js',type:'script',mime:'text/javascript',init:'app.js:88',size:3400,start:840,dur:26},
 {name:'favicon.svg',path:'/favicon.svg',type:'svg+xml',mime:'image/svg+xml',init:'Other',size:912,start:870,dur:14,cache:true}];
const TYPEGROUP={document:'Doc',stylesheet:'CSS',font:'Font',script:'JS',avif:'Img',webp:'Img',png:'Img','svg+xml':'Img',fetch:'Fetch/XHR',xhr:'Fetch/XHR',ping:'Other',manifest:'Manifest'};
const NET={entries:[],seq:0,navStart:0,dcl:0,load:0,listeners:[],emit(){this.listeners.forEach(f=>f())},
 mk(o){const k=THROTTLE[ST.throttle].k;const fromCache=!ST.disableCache&&o.cache&&ST.loadCount>1;const blocked=ST.blocked.has(o.name);const offline=ST.offline||ST.throttle==='offline';
  const dur=fromCache?1+Math.random()*3:o.dur*k*(ST.cpu>1?1.05:1)*(0.9+Math.random()*0.2);
  const e={id:++NET.seq,name:o.name,url:'https://driftwood.coffee'+o.path,path:o.path,method:o.method||'GET',type:o.type,mime:o.mime,initiator:o.init,
   status:blocked?0:offline?0:(o.status||200),size:o.size,transferred:fromCache?0:o.size+ (o.size?420:180),fromCache,blocked,failed:blocked||offline,
   start:o.start*k,dur:blocked||offline?2:dur,phases:null,api:o.api,body:o.body,resBody:o.resBody,t0:now(),reqBody:o.reqBody};
  const d=e.dur;e.phases=o.first&&!fromCache?{queue:d*.04,dns:d*.1,connect:d*.13,ssl:d*.12,ttfb:d*.36,download:d*.25}:fromCache?{queue:d*.4,ttfb:d*.4,download:d*.2}:{queue:d*.08,ttfb:d*.6,download:d*.32};
  e.statusText=e.blocked?'(blocked:devtools)':offline?'(failed)':({200:'OK',204:'No Content',404:'Not Found',500:'Internal Server Error',201:'Created'})[e.status]||'';
  return e},
 pageLoad(){if(!ST.preserve)NET.entries=[];NET.navStart=now();ST.loadCount++;const k=THROTTLE[ST.throttle].k;
  RESOURCES.forEach(r=>{const e=NET.mk(r);e.t0=NET.navStart+e.start/ (k>2?1.4:1)*0+e.start;NET.entries.push(e)});
  NET.dcl=412*k;NET.load=1210*k;NET.emit();
  // console side effects of a load
  setTimeout(()=>{if(ST.offline||ST.throttle==='offline'){CON.add({type:'error',args:['GET https://driftwood.coffee/shop net::ERR_INTERNET_DISCONNECTED'],src:'shop'});return}
   if(!ST.blocked.has('og-image.png'))CON.add({type:'error',args:['GET https://driftwood.coffee/img/og-image.png 404 (Not Found)'],src:'shop:1',net:true});
   CON.add({type:'warn',args:['DevTools failed to load source map: Could not load content for https://driftwood.coffee/js/vendor.min.js.map: HTTP error: status code 404'],src:''});
   if(ST.blocked.has('app.js'))CON.add({type:'error',args:['GET https://driftwood.coffee/js/app.js net::ERR_BLOCKED_BY_CLIENT'],src:'shop:12'});
   else withSrc('app.js:41',()=>pageConsole.info('Driftwood v2.4.1 · 12 products loaded'));
   withSrc('analytics.js:1',()=>pageConsole.debug('[analytics] page_view sent'));
  },Math.min(900,700*k))},
 request(url,opts={}){const path=url.replace(/^https?:\/\/[^/]+/,'');const name=path.split('/').pop()||path;const method=(opts.method||'GET').toUpperCase();
  let status=200,resBody='{}';if(path.startsWith('/api/cart')&&method==='POST'){status=500;resBody='{\n  "error": "inventory service timeout",\n  "requestId": "7f3a9c2e-51b0"\n}'}
  else if(path.startsWith('/api/cart')){resBody=JSON.stringify({items:cart.items},null,2)}else if(path.startsWith('/api/products')){resBody=JSON.stringify(PRODUCTS.map(({art,...p})=>p),null,2)}else if(path.startsWith('/api/')){status=404;resBody='{"error":"not found"}'}
  const e=NET.mk({name,path,type:'fetch',mime:'application/json',init:opts.initiator||'VM1:1',size:resBody.length,start:0,dur:opts.dur||(status===500?310:140),status,method});
  e.reqBody=opts.body||null;e.resBody=resBody;e.t0=now();e.start=now()-(NET.navStart||now());
  if(ST.recordingNet!==false)NET.entries.push(e);NET.emit();
  return new Promise((res,rej)=>{setTimeout(()=>{if(e.failed){const err=new TypeError('Failed to fetch');CON.add({type:'error',args:[`${method} ${e.url} ${e.blocked?'net::ERR_BLOCKED_BY_CLIENT':'net::ERR_INTERNET_DISCONNECTED'}`],src:opts.initiator||'VM1:1'});rej(err);return}
   if(status>=400)CON.add({type:'error',args:[`${method} ${e.url} ${status} (${e.statusText})`],src:opts.initiator||'VM1:1',net:true});
   res({ok:status<400,status,statusText:e.statusText,url:e.url,headers:{'content-type':'application/json'},json:async()=>JSON.parse(resBody),text:async()=>resBody,[Symbol.toStringTag]:'Response'})},e.dur)})}};
const simFetch=(u,o)=>NET.request(String(u),o);

/* ================= demo app logic ("app.js" / "cart.js") ================= */
const cart={items:[]};const orders=[{id:'A-1042',item:'Ethiopia Guji',qty:2,total:37},{id:'A-1043',item:'Colombia Huila',qty:1,total:17},{id:'A-1044',item:'Kenya Nyeri',qty:3,total:58.5}];
const toastCache=[];
function round(n){return Math.round(n*100)/100}
function calcTotal(items){let total=0;for(const item of items){const line=item.price*item.qty;total+=line}if(total>100)total*=0.9;return round(total)}
function renderCart(){const n=cart.items.reduce((a,i)=>a+i.qty,0);PAGE.qa('.count').forEach(c=>c.textContent=n);PAGE.q('.total').textContent='$'+calcTotal(cart.items).toFixed(2)}
function saveCart(){LS.set('cart',JSON.stringify(cart.items.map(i=>({id:i.id,qty:i.qty}))));bus.emit('storage')}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const it=cart.items.find(i=>i.id===id);if(it)it.qty++;else cart.items.push({id,name:p.name,price:p.price,qty:1});saveCart();renderCart();withSrc('cart.js:24',()=>pageConsole.debug(`added ${p.name} → cart has ${cart.items.length} line(s)`))}
function pageToast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.textContent=msg;PAGE.q('.toasts').appendChild(t);if(window.__memToastHook)window.__memToastHook();setTimeout(()=>{t.remove();toastCache.push(t)},2600)}
function setTheme(v){BODY.dataset.theme=v;LS.set('theme',v);const c=COOKIES.find(c=>c.name==='theme');if(c)c.value=v;bus.emit('storage')}
async function checkout(){if(!cart.items.length){pageToast('Your cart is empty — add a coffee first.');return}
 const total=await DBG.run(cart);  // may pause on breakpoints
 const res=await simFetch('/api/cart',{method:'POST',body:JSON.stringify({total}),initiator:'cart.js:16'}).catch(()=>null);
 if(!res||!res.ok)pageToast(`Checkout failed (${res?res.status:'offline'}). Try again.`,true);}
const LISTENERS=[];
function on(el,type,fn,src){const L={el,type,src,fn};el.addEventListener(type,e=>{if(L.removed||ST.jsDisabled||ST.effBlocked&&ST.effBlocked.has(src.split(':')[0]))return;perfHook(type,el);fn(e)});LISTENERS.push(L)}
function wirePage(){
 on(PAGE.q('.theme-toggle'),'click',()=>setTheme(BODY.dataset.theme==='dark'?'light':'dark'),'app.js:57');
 PAGE.qa('.btn.add').forEach(b=>on(b,'click',()=>addToCart(b.closest('.card').dataset.id),'cart.js:18'));
 on(PAGE.q('.btn.checkout'),'click',()=>checkout(),'cart.js:31');
 on(PAGE.q('.cart-pill'),'click',()=>PAGE.q('.cart-bar').scrollIntoView({behavior:'smooth',block:'center'}),'app.js:63');
 on(PAGE.q('.btn.cta'),'click',e=>{e.preventDefault();PAGE.q('#shop').scrollIntoView({behavior:'smooth'})},'app.js:49');
 on(PAGE.q('.btn.subscribe'),'click',()=>pageToast('Subscribed ✓ See you on roast day.'),'app.js:72');
 PAGE.qa('a').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
}
function perfHook(type,el){bus.emit('page-event',{type,el,t:now()})}
function reloadPage(silent){const vp=$('#viewport');vp.style.transition='none';vp.style.opacity='.25';ST.effBlocked=new Set(ST.blocked);
 PAGE.q('.hero-art').classList.toggle('__blocked',ST.blocked.has('hero.avif'));
 NET.pageLoad();applyCSS();bus.emit('reload');
 const off=ST.offline||ST.throttle==='offline';let dino=$('#dino');if(off&&!dino){dino=h('<div id="dino" style="position:absolute;inset:0;z-index:15;background:#fff;color:#5F6368;display:flex;flex-direction:column;justify-content:center;padding:0 12%;font:400 15px/1.6 var(--body)"><div style="font:600 22px var(--body);color:#202124;margin-bottom:8px">No internet</div><div>Try checking the network cables, modem, and router.</div><div style="font:400 12px var(--mono);margin-top:14px">ERR_INTERNET_DISCONNECTED</div></div>');$('#pagearea').appendChild(dino)}else if(!off&&dino)dino.remove();
 setTimeout(()=>{vp.style.transition='opacity .35s';vp.style.opacity='1'},Math.min(900,260*THROTTLE[ST.throttle].k));
 if(silent!==true)track('reload')}

/* ================= Elements panel ================= */
const EL={opened:new WeakSet(),rows:[],flashNodes:new Set(),grids:new Set(),domBps:new Map(),undo:[],sub:'styles'};
const VOID=new Set(['meta','link','img','br','input','hr','source']);
const HIDE_CLS='__web-inspector-hide-shortcut__';
[HTML,BODY,PAGE.q('.hero'),PAGE.q('.hero > div'),PAGE.q('.cards')].forEach(n=>EL.opened.add(n));

function nodeLabel(n){if(!n||n.nodeType!==1)return'';const cls=[...n.classList].filter(c=>c!=='__hov'&&c!==HIDE_CLS);return n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(cls.length?'.'+cls.join('.'):'')}
function attrsHTML(n){return [...n.attributes].map(a=>{let v=a.value;if(a.name==='class')v=v.split(/\s+/).filter(c=>c!=='__hov').join(' ');if(a.name==='class'&&!v)return'';return ` <span class="an" data-attr="${esc(a.name)}">${esc(a.name)}</span>${v!==''||a.name!=='hidden'?`=<span class="av" data-attr-v="${esc(a.name)}">"${esc(v)}"</span>`:''}`}).join('')}

function buildElements(p){
 p.innerHTML=`<div class="split adapt" style="flex:1;min-height:0">
 <div class="a"><div class="tree scroll" id="tree" tabindex="0" data-hs="el-tree" aria-label="DOM tree"></div><div class="crumbs" id="crumbs" data-hs="el-crumbs"></div></div>
 <div class="b"><div class="subt" id="elSub" data-hs="el-sub">${[['styles','Styles'],['computed','Computed'],['layout','Layout'],['listeners','Event Listeners'],['a11y','Accessibility']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='styles'}">${l}</button>`).join('')}</div>
  <div id="elView" class="scroll" style="flex:1;min-height:0"></div></div></div>`;
 const tree=$('#tree');
 tree.addEventListener('mouseover',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];if(n&&n.nodeType===1){highlight(n);track('hover-node')}});
 tree.addEventListener('mouseleave',()=>{if(!ST.inspecting)clearHL()});
 tree.addEventListener('click',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  if(e.target.classList.contains('lbadge')){toggleGrid(n);return}
  if(e.target.classList.contains('tw')){if(EL.opened.has(n))EL.opened.delete(n);else EL.opened.add(n);if(e.altKey)n.querySelectorAll('*').forEach(c=>EL.opened.add(c));renderTree();return}
  if(n&&n.nodeType===1)select(n);else if(n&&n.parentNode)select(n.parentNode)});
 tree.addEventListener('dblclick',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  const av=e.target.closest('[data-attr-v]');if(av){editInline(av,av.textContent.replace(/^"|"$/g,''),v=>{n.setAttribute(av.dataset.attrV,v);track('edit-dom')});return}
  const tx=e.target.closest('.tx');if(tx){const tn=[...n.childNodes].find(c=>c.nodeType===3&&c.textContent.trim())||n;editInline(tx,tn.textContent.trim(),v=>{if(tn.nodeType===3)tn.textContent=v;else n.textContent=v;track('edit-dom')});return}});
 tree.addEventListener('contextmenu',e=>{const r=e.target.closest('.tr');if(!r)return;e.preventDefault();const n=EL.rows[+r.dataset.i];if(!n||n.nodeType!==1)return;select(n);elMenu(n,e.clientX,e.clientY)});
 tree.addEventListener('keydown',treeKeys);
 $('#elSub').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;EL.sub=b.dataset.k;$$('#elSub button').forEach(x=>x.setAttribute('aria-selected',x===b));renderSide();if(EL.sub==='computed')track('computed')});
 new MutationObserver(ms=>{let domBp=null;ms.forEach(m=>{const t=m.type==='characterData'?m.target.parentNode:m.target;if(t&&t.nodeType===1&&!(m.type==='attributes'&&m.attributeName==='class'&&String(m.oldValue||'').includes('__hov')!==(t.className||'').includes('__hov')&&false)){EL.flashNodes.add(t)}
   for(const [bn,types] of EL.domBps){if(types.has('subtree')&&bn!==t&&bn.contains(t)&&m.type!=='attributes')domBp={node:bn,type:'subtree modifications'};if(types.has('attributes')&&bn===t&&m.type==='attributes'&&!m.attributeName.startsWith('__'))domBp={node:bn,type:'attribute modifications'}}});
  scheduleTree();if(domBp)DBG.pauseDom(domBp)}).observe(HTML,{subtree:true,childList:true,attributes:true,characterData:true,attributeOldValue:true});
 renderTree();select(PAGE.q('.btn.cta'),true);
}
let treeT;function scheduleTree(){clearTimeout(treeT);treeT=setTimeout(()=>{if(P.elements.built){renderTree();if(EL.sub!=='styles'||!document.activeElement||!document.activeElement.closest('#elView'))renderSide()}},30)}

function renderTree(){const tree=$('#tree');if(!tree)return;const st=tree.scrollTop;EL.rows=[];let html='';
 const row=(n,d,inner,cls='')=>{const i=EL.rows.push(n)-1;const flash=EL.flashNodes.has(n)?' flash':'';html+=`<div class="tr${n===ST.sel?' sel':''}${cls}${flash}" data-i="${i}" style="padding-left:${d*14+6}px">${inner}</div>`};
 html+=`<div class="tr" data-i="-1" style="padding-left:6px"><span class="tw"></span><span class="cm">&lt;!DOCTYPE html&gt;</span></div>`;
 const walk=(n,d)=>{if(n.nodeType===3){const t=n.textContent.trim();if(t)row(n,d,`<span class="tw"></span><span class="tx">"${esc(t.length>80?t.slice(0,80)+'…':t)}"</span>`);return}
  if(n.nodeType===8){row(n,d,`<span class="tw"></span><span class="cm">&lt;!--${esc(n.textContent)}--&gt;</span>`);return}
  if(n.nodeType!==1)return;const tag=n.tagName.toLowerCase();const kids=[...n.childNodes].filter(c=>c.nodeType===1||c.nodeType===8||(c.nodeType===3&&c.textContent.trim()));
  const hid=n.classList.contains(HIDE_CLS)?' hid':'';let badge='';if(n.nodeType===1&&n.isConnected&&n!==HTML&&n!==HEAD&&!HEAD.contains(n)){const dsp=getComputedStyle(n).display;if(/grid/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle grid overlay">grid</span>`;else if(/flex/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle flexbox overlay">flex</span>`}
  const eq=n===ST.sel?'<span class="eq">== $0</span>':'';const open=`<span class="tg">&lt;${tag}</span>${attrsHTML(n)}<span class="tg">&gt;</span>`;const close=`<span class="tg">&lt;/${tag}&gt;</span>`;
  if(VOID.has(tag)){row(n,d,`<span class="tw"></span>${open}${badge}${eq}`,hid);return}
  if(!kids.length){row(n,d,`<span class="tw"></span>${open}${close}${badge}${eq}`,hid);return}
  if(kids.length===1&&kids[0].nodeType===3&&kids[0].textContent.trim().length<70){row(n,d,`<span class="tw"></span>${open}<span class="tx">${esc(kids[0].textContent.trim())}</span>${close}${badge}${eq}`,hid);return}
  const isOpen=EL.opened.has(n);
  if(!isOpen){row(n,d,`<span class="tw">▸</span>${open}…${close}${badge}${eq}`,hid);return}
  row(n,d,`<span class="tw">▾</span>${open}${badge}${eq}`,hid);kids.forEach(k=>walk(k,d+1));const ci=EL.rows.push(n)-1;html+=`<div class="tr${n===ST.sel?' sel':''}" data-i="${ci}" style="padding-left:${d*14+6}px"><span class="tw"></span>${close}</div>`};
 walk(HTML,0);tree.innerHTML=html;tree.scrollTop=st;EL.flashNodes.clear();renderCrumbs()}
function renderCrumbs(){const c=$('#crumbs');if(!c)return;const chain=[];let n=ST.sel;while(n&&n.nodeType===1){chain.unshift(n);if(n===HTML)break;n=n.parentNode}
 c.innerHTML='';chain.forEach(x=>{const b=h(`<button class="${x===ST.sel?'on':''}">${esc(nodeLabel(x))}</button>`);b.onclick=()=>select(x);b.onmouseenter=()=>highlight(x);b.onmouseleave=clearHL;c.appendChild(b)})}
function select(n,quiet){if(!n||n.nodeType!==1)return;ST.sel=n;let p=n.parentNode;while(p&&p.nodeType===1){EL.opened.add(p);p=p.parentNode}
 window.$0=n;if(P.elements.built){renderTree();renderSide();const r=$('#tree .tr.sel');if(r&&!quiet){const tr=$('#tree');const rt=r.offsetTop;if(rt<tr.scrollTop||rt>tr.scrollTop+tr.clientHeight-30)tr.scrollTop=rt-tr.clientHeight/3}}
 if(!quiet)track('select-node');bus.emit('select',n)}
function editInline(span,val,commit){const e=h(`<span class="edit" contenteditable="true" spellcheck="false"></span>`);e.textContent=val;span.replaceWith(e);e.focus();document.getSelection().selectAllChildren(e);
 let done=false;const fin=ok=>{if(done)return;done=true;const v=e.textContent;if(ok&&v!==val)commit(v);renderTree()};
 e.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Enter'){ev.preventDefault();fin(true)}if(ev.key==='Escape')fin(false)});e.addEventListener('blur',()=>fin(true))}
function treeKeys(e){const n=ST.sel;if(!n)return;const els=EL.rows.filter((x,i,a)=>x&&x.nodeType===1&&a.indexOf(x)===i);const i=els.indexOf(n);
 if(e.key==='ArrowDown'){e.preventDefault();select(els[Math.min(els.length-1,i+1)])}
 else if(e.key==='ArrowUp'){e.preventDefault();select(els[Math.max(0,i-1)])}
 else if(e.key==='ArrowRight'){e.preventDefault();if(!EL.opened.has(n)&&n.children.length){EL.opened.add(n);renderTree()}else if(n.firstElementChild)select(n.firstElementChild)}
 else if(e.key==='ArrowLeft'){e.preventDefault();if(EL.opened.has(n)){EL.opened.delete(n);renderTree()}else if(n.parentNode&&n.parentNode.nodeType===1)select(n.parentNode)}
 else if(e.key==='h'||e.key==='H'){if(BODY.contains(n)&&n!==BODY){n.classList.toggle(HIDE_CLS);track('hide-node')}}
 else if(e.key==='Delete'||e.key==='Backspace'){if(BODY.contains(n)&&n!==BODY){e.preventDefault();removeNode(n)}}
 else if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();const u=EL.undo.pop();if(u){u.parent.insertBefore(u.node,u.next);select(u.node);toast('Undo: node restored')}}}
function removeNode(n){const u={node:n,parent:n.parentNode,next:n.nextSibling};const nx=n.nextElementSibling||n.previousElementSibling||n.parentNode;n.remove();EL.undo.push(u);select(nx);toast('Deleted — Ctrl+Z in the tree restores it');track('delete-node')}
function cssPath(n){const parts=[];while(n&&n.nodeType===1&&n!==BODY){let s=n.tagName.toLowerCase();if(n.id){parts.unshift('#'+n.id);break}const cls=[...n.classList].filter(c=>!c.startsWith('__'));if(cls.length)s+='.'+cls.join('.');const sib=[...n.parentNode.children].filter(c=>c.tagName===n.tagName);if(sib.length>1)s+=`:nth-of-type(${sib.indexOf(n)+1})`;parts.unshift(s);n=n.parentNode}return (parts[0]&&parts[0].startsWith('#')?'':'body > ')+parts.join(' > ')}
function elMenu(n,x,y){const bps=EL.domBps.get(n)||new Set();const tog=t=>{if(bps.has(t))bps.delete(t);else bps.add(t);EL.domBps.set(n,bps);toast(bps.has(t)?`DOM breakpoint set: ${t==='subtree'?'subtree modifications':'attribute modifications'}`:'DOM breakpoint removed');track('dom-bp')};
 openMenu(x,y,[{label:'Add attribute',act:()=>{const at='data-note';n.setAttribute(at,'');renderTree()}},{label:'Edit as HTML',act:()=>editAsHTML(n)},'-',
  {label:ST.forceHover.has(n)?'✓ Force state :hover':'Force state :hover',act:()=>setForceHover(n,!ST.forceHover.has(n))},{label:n.classList.contains(HIDE_CLS)?'Show element':'Hide element',hint:'H',act:()=>{n.classList.toggle(HIDE_CLS);track('hide-node')}},{label:'Delete element',hint:'Del',act:()=>removeNode(n)},'-',
  {label:'Copy selector',act:()=>copyText(cssPath(n))},{label:'Copy JS path',act:()=>copyText(`document.querySelector("${cssPath(n)}")`)},{label:'Copy outerHTML',act:()=>copyText(n.outerHTML)},'-',
  {head:'Break on…'},{label:(bps.has('subtree')?'✓ ':'')+'subtree modifications',act:()=>tog('subtree')},{label:(bps.has('attributes')?'✓ ':'')+'attribute modifications',act:()=>tog('attributes')},'-',
  {label:'Store as global variable',act:()=>{let k=1;while(CONSOLE_VARS['temp'+k])k++;CONSOLE_VARS['temp'+k]=n;CON.add({type:'input',args:['temp'+k]});CON.add({type:'result',args:[n]});setPanel('console')}},{label:'Scroll into view',act:()=>n.scrollIntoView({block:'center',behavior:'smooth'})}])}
function editAsHTML(n){const r=[...$$('#tree .tr')].find(x=>EL.rows[+x.dataset.i]===n);if(!r)return;const ta=h('<textarea spellcheck="false" style="width:calc(100% - 20px);margin:2px 10px;height:120px;background:#17181A;color:#E3E3E3;border:1px solid #8AB4F8;font:400 12px/1.5 var(--mono);outline:none"></textarea>');ta.value=n.outerHTML;r.replaceWith(ta);ta.focus();
 const fin=()=>{try{const t=document.createElement('template');t.innerHTML=ta.value;const nn=t.content.firstElementChild;if(nn&&nn.outerHTML!==n.outerHTML){n.replaceWith(nn);select(nn);toast('Replaced — listeners on the old node are gone');track('edit-dom')}else renderTree()}catch{renderTree()}};ta.addEventListener('blur',fin);ta.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))ta.blur();if(e.key==='Escape'){ta.value=n.outerHTML;ta.blur()}})}
function setForceHover(n,on){if(on){ST.forceHover.add(n);n.classList.add('__hov')}else{ST.forceHover.delete(n);n.classList.remove('__hov')}renderSide();track('force-hover')}

/* ---------- highlight overlay ---------- */
function relRect(n){const pa=$('#pagearea').getBoundingClientRect();const r=n.getBoundingClientRect();return{x:r.left-pa.left,y:r.top-pa.top,w:r.width,h:r.height,pa}}
function highlight(n,inspect){const hl=$('#hl');hl.innerHTML='';if(!n||n.nodeType!==1||!n.isConnected||n===HTML||HEAD.contains(n)||n===HEAD)return;
 const r=relRect(n);if(!r.w&&!r.h&&n!==BODY)return;const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const px=k=>(parseFloat(cs[k])||0)*sc;
 const m=[px('marginTop'),px('marginRight'),px('marginBottom'),px('marginLeft')],b=[px('borderTopWidth'),px('borderRightWidth'),px('borderBottomWidth'),px('borderLeftWidth')],p=[px('paddingTop'),px('paddingRight'),px('paddingBottom'),px('paddingLeft')];
 const ring=(x,y,w,hh,bw,col,bg)=>{const d=document.createElement('div');d.className='ring';Object.assign(d.style,{left:x+'px',top:y+'px',width:Math.max(0,w)+'px',height:Math.max(0,hh)+'px',borderWidth:bw.map(v=>Math.max(0,v)+'px').join(' '),borderColor:col,background:bg||'transparent'});hl.appendChild(d)};
 ring(r.x-m[3],r.y-m[0],r.w+m[1]+m[3],r.h+m[0]+m[2],m,'rgba(246,178,107,.66)');ring(r.x,r.y,r.w,r.h,b,'rgba(255,229,153,.66)');ring(r.x+b[3],r.y+b[0],r.w-b[1]-b[3],r.h-b[0]-b[2],p,'rgba(147,196,125,.66)');
 ring(r.x+b[3]+p[3],r.y+b[0]+p[0],r.w-b[1]-b[3]-p[1]-p[3],r.h-b[0]-b[2]-p[0]-p[2],[0,0,0,0],'transparent','rgba(111,168,220,.6)');
 const cls=[...n.classList].filter(c=>!c.startsWith('__'));let tip=`<span class="t">${n.tagName.toLowerCase()}</span><span class="c">${n.id?'#'+n.id:''}${cls.length?'.'+cls.join('.'):''}</span><span class="d">${Math.round(n.offsetWidth*100)/100} × ${Math.round(n.offsetHeight*100)/100}</span>`;
 if(inspect){const ct=contrastOf(n);const nm=accName(n);tip+=`<table><tr><td>Color</td><td>${swatchTxt(cs.color)}</td></tr><tr><td>Font</td><td>${esc(cs.fontSize+' '+cs.fontFamily.split(',')[0].replace(/"/g,''))}</td></tr>${effBg(n)?`<tr><td>Background</td><td>${swatchTxt(effBg(n))}</td></tr>`:''}${cs.padding!=='0px'?`<tr><td>Padding</td><td>${cs.padding}</td></tr>`:''}${cs.margin!=='0px'?`<tr><td>Margin</td><td>${cs.margin}</td></tr>`:''}
  <tr><td colspan="2" class="sec">ACCESSIBILITY</td></tr>${ct&&n.textContent.trim()?`<tr><td>Contrast</td><td>Aa ${ct.toFixed(2)} <b style="color:${ct>=4.5?'#188038':'#E37400'}">${ct>=4.5?'✓':'⚠'}</b></td></tr>`:''}<tr><td>Name</td><td>${esc((nm||'').slice(0,26))}</td></tr><tr><td>Role</td><td>${roleOf(n)}</td></tr><tr><td>Keyboard-focusable</td><td>${n.tabIndex>=0?'<b style="color:#188038">✓</b>':'<span style="color:#9AA0A6">⊘</span>'}</td></tr></table>`}
 const t=h(`<div class="hltip">${tip}</div>`);hl.appendChild(t);const pa=r.pa;let ty=r.y+r.h+m[2]+8;if(ty+t.offsetHeight>pa.height-4)ty=Math.max(4,r.y-m[0]-t.offsetHeight-8);let tx=clamp(r.x,4,pa.width-t.offsetWidth-4);t.style.left=tx+'px';t.style.top=ty+'px'}
function clearHL(){const hl=$('#hl');if(hl)hl.innerHTML=''}
function swatchTxt(c){const hx=toHex(c);return `<i style="display:inline-block;width:10px;height:10px;border:1px solid #999;background:${c};vertical-align:-1px;margin-right:4px"></i>${hx||c}`}
function parseRGB(c){const m=String(c).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null}
function toHex(c){if(/^#/.test(c))return c.toUpperCase();const v=parseRGB(c);if(!v)return null;return'#'+v.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase()}
function effBg(n){let x=n;while(x&&x.nodeType===1){const cs=getComputedStyle(x);const v=parseRGB(cs.backgroundColor);if(v&&v[3]>0.5)return cs.backgroundColor;if(cs.backgroundImage!=='none'){const m=cs.backgroundImage.match(/rgba?\([^)]+\)/);if(m)return m[0]}x=x.parentNode}return 'rgb(244, 239, 232)'}
function lum(v){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(v[0])+.7152*f(v[1])+.0722*f(v[2])}
function contrast(a,b){const A=lum(a)+.05,B=lum(b)+.05;return Math.max(A,B)/Math.min(A,B)}
function contrastOf(n){const fg=parseRGB(getComputedStyle(n).color),bg=parseRGB(effBg(n));return fg&&bg?contrast(fg,bg):null}
function roleOf(n){const t=n.tagName.toLowerCase();return n.getAttribute('role')||({a:'link',button:'button',h1:'heading',h2:'heading',h3:'heading',nav:'navigation',header:'banner',section:'region',article:'article',aside:'complementary',p:'paragraph',body:'generic',img:'image'})[t]||'generic'}
function accName(n){return n.getAttribute('aria-label')||(/^(a|button|h\d|p|span|b)$/i.test(n.tagName)?n.textContent.trim():'')}

/* ---------- inspect mode ---------- */
function setInspect(on){ST.inspecting=on;$('#inspectBtn').setAttribute('aria-pressed',on);$('#pagearea').style.cursor=on?'crosshair':'';if(!on)clearHL();else{toast('Hover the page, click to select an element')}}
shadow.addEventListener('mousemove',e=>{if(!ST.inspecting)return;const t=e.composedPath()[0];if(t&&t.nodeType===1){highlight(t,true);ST._hov=t}},true);
shadow.addEventListener('click',e=>{if(!ST.inspecting)return;e.preventDefault();e.stopPropagation();const t=e.composedPath()[0];setInspect(false);if(!ST.open)toggleDevtools(true);setPanel('elements');select(t);highlight(t);setTimeout(clearHL,900);track('inspect-pick')},true);
pageHost.addEventListener('mouseleave',()=>{if(ST.inspecting)clearHL()});
pageHost.addEventListener('scroll',()=>{clearHL();drawGrids()},{passive:true});

/* ---------- grid / flex overlays ---------- */
function toggleGrid(n){if(EL.grids.has(n))EL.grids.delete(n);else EL.grids.add(n);renderTree();drawGrids();if(EL.sub==='layout')renderSide();track('grid-overlay')}
function drawGrids(){$$('.gridov').forEach(g=>g.remove());const pa=$('#pagearea');if(!pa)return;EL.grids.forEach(n=>{if(!n.isConnected)return;const r=relRect(n);const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const isGrid=/grid/.test(cs.display);const col=isGrid?'#C76EDC':'#8AB4F8';
  const g=h(`<div class="gridov" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`);let s=`<div style="position:absolute;inset:0;border:2px ${isGrid?'solid':'dashed'} ${col}"></div>`;
  const pl=(parseFloat(cs.paddingLeft)||0)*sc,pt=(parseFloat(cs.paddingTop)||0)*sc,pb=(parseFloat(cs.paddingBottom)||0)*sc;
  if(isGrid){const cols=cs.gridTemplateColumns.split(' ').map(parseFloat).filter(x=>!isNaN(x)).map(x=>x*sc);const gap=(parseFloat(cs.columnGap)||0)*sc;let x=pl;const lines=[x];cols.forEach((w,i)=>{x+=w;lines.push(x);if(i<cols.length-1){s+=`<div style="position:absolute;left:${x}px;width:${gap}px;top:${pt}px;bottom:${pb}px;background:repeating-linear-gradient(45deg,rgba(199,110,220,.45) 0 2px,transparent 2px 6px)"></div>`;x+=gap;lines.push(x)}});
   lines.forEach((lx,i)=>{s+=`<div style="position:absolute;left:${lx}px;top:${pt}px;bottom:${pb}px;border-left:1.5px dashed ${col}"></div>`});
   const starts=[pl];let acc=pl;cols.forEach((w,i)=>{acc+=w+(i<cols.length-1?gap:0);starts.push(acc)});starts.forEach((lx,i)=>s+=`<div style="position:absolute;left:${lx-9}px;top:${Math.max(-18,pt-18)}px;background:${col};color:#fff;font:700 10px/16px var(--mono);padding:0 4px;border-radius:3px">${i+1}</div>`);
   let cx=pl;cols.forEach((w,i)=>{s+=`<div style="position:absolute;left:${cx+w/2-24}px;top:${pt+4}px;background:rgba(255,255,255,.9);color:#6E2B7F;font:600 10px/15px var(--mono);padding:0 4px;border-radius:3px;border:1px solid ${col}">${(w/sc).toFixed(1)}px</div>`;cx+=w+gap})}
  else{[...n.children].forEach(c=>{const cr=relRect(c);s+=`<div style="position:absolute;left:${cr.x-r.x}px;top:${cr.y-r.y}px;width:${cr.w}px;height:${cr.h}px;border:1px dashed ${col};background:rgba(138,180,248,.08)"></div>`})}
  g.innerHTML=s;pa.appendChild(g)})}
bus.on('css',()=>requestAnimationFrame(drawGrids));

/* ---------- side panes ---------- */
const UA={h1:[['display','block'],['font-size','2em'],['margin-block','0.67em'],['font-weight','bold']],h3:[['display','block'],['font-size','1.17em'],['margin-block','1em'],['font-weight','bold']],p:[['display','block'],['margin-block','1em']],a:[['color','-webkit-link'],['cursor','pointer'],['text-decoration','underline']],
 button:[['padding-block','1px'],['padding-inline','6px'],['border','2px outset buttonborder'],['background-color','buttonface'],['font','-webkit-small-control'],['color','buttontext']],nav:[['display','block']],header:[['display','block']],section:[['display','block']],article:[['display','block']],aside:[['display','block']],body:[['display','block'],['margin','8px']],div:[['display','block']]};
const INH=/^(color|font|font-.+|line-height|letter-spacing|text-align|visibility|cursor|white-space|word-spacing|text-transform)$/;
function mediaOk(m){const mm=m.match(/max-width:\s*(\d+)px/);return !mm||pageHost.clientWidth<=+mm[1]}
function matched(el){const res=[];RULES.forEach(r=>{let best=-1;r.sel.split(',').map(s=>s.trim()).forEach(part=>{const hov=/:hover/.test(part);const test=part.replace(/:hover/g,'');try{if(el.matches(test)&&(!hov||ST.forceHover.has(el)))best=Math.max(best,specificity(part))}catch{}});if(best>=0&&(!r.media||mediaOk(r.media)))res.push({r,spec:best})});
 res.sort((a,b)=>b.spec-a.spec||(b.r.media?1:0)-(a.r.media?1:0)||b.r.id-a.r.id);return res}
function inlineDecls(el){const s=el.getAttribute('style')||'';return s.split(';').map(x=>x.trim()).filter(Boolean).filter(x=>!x.startsWith('--art')||el.classList.contains('card')).map(x=>{const i=x.indexOf(':');return{p:x.slice(0,i).trim(),v:x.slice(i+1).trim(),on:true,inline:true}})}
function renderSide(){const v=$('#elView');if(!v)return;const el=ST.sel;if(!el){v.innerHTML='<div class="empty">Select a node</div>';return}
 if(EL.sub==='styles')renderStyles(v,el);else if(EL.sub==='computed')renderComputed(v,el);else if(EL.sub==='layout')renderLayout(v);else if(EL.sub==='listeners')renderListeners(v,el);else renderA11y(v,el)}
function renderStyles(v,el){const flt=(EL.filter||'').toLowerCase();
 v.innerHTML=`<div class="tb" data-hs="el-filter"><input class="inp" id="stFilter" placeholder="Filter" value="${esc(EL.filter||'')}" style="flex:1;min-width:60px"><button class="tbb" id="hovBtn" aria-pressed="${!!EL.hovOpen}" title="Toggle element state">:hov</button><button class="tbb" id="clsBtn" aria-pressed="${!!EL.clsOpen}" title="Element classes">.cls</button></div>
 ${EL.hovOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><div style="color:#9AA0A6;margin-bottom:4px">Force element state</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 8px">${[':active',':hover',':focus',':visited',':focus-within',':focus-visible',':target'].map(s=>`<label class="ck"><input type="checkbox" data-st="${s}" ${s===':hover'&&ST.forceHover.has(el)?'checked':''}>${s}</label>`).join('')}</div></div>`:''}
 ${EL.clsOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><input class="inp" id="addCls" placeholder="Add new class" style="width:100%"><div style="display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:5px">${[...el.classList].filter(c=>!c.startsWith('__')).concat(EL.offCls&&EL.offCls.el===el?EL.offCls.list:[]).map(c=>`<label class="ck"><input type="checkbox" data-cls="${esc(c)}" ${el.classList.contains(c)?'checked':''}>${esc(c)}</label>`).join('')}</div></div>`:''}
 <div class="styles" id="styles" data-hs="el-styles"></div>`;
 const box=$('#styles',v);const winners={};const blocks=[];
 const inl=inlineDecls(el);blocks.push({kind:'inline',decls:inl});
 matched(el).forEach(({r})=>blocks.push({kind:'rule',r,decls:r.d}));
 const ua=UA[el.tagName.toLowerCase()];if(ua)blocks.push({kind:'ua',sel:el.tagName.toLowerCase()==='a'?'a:-webkit-any-link':el.tagName.toLowerCase(),decls:ua.map(([p,v])=>({p,v,on:true}))});
 blocks.forEach(b=>b.decls.forEach(d=>{d._st=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')}));
 // inherited
 const inh=[];let a=el.parentNode;while(a&&a.nodeType===1&&a!==HTML){const ms=matched(a).map(({r})=>({r,decls:r.d.filter(d=>INH.test(d.p))})).filter(x=>x.decls.length);if(ms.length)inh.push({a,ms});a=a.parentNode}
 inh.forEach(g=>g.ms.forEach(m=>m.decls.forEach(d=>{m._st=m._st||{};m._st[d.p]=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')})));
 const declHTML=(d,ri,di,st)=>{if(flt&&!(d.p+':'+d.v).toLowerCase().includes(flt))return'';const col=/^(#|rgb|hsl)/i.test(d.v)||/^(color|background|background-color|border-color)$/.test(d.p)&&/#[0-9a-f]{3,8}|rgb/i.test(d.v);const cm=d.v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/);
  return `<div class="dcl ${st==='over'?'over':st==='off'?'off':''}">${ri!=null?`<input type="checkbox" ${d.on?'checked':''} data-r="${ri}" data-d="${di}" aria-label="Toggle ${esc(d.p)}">`:''}<span class="p">${esc(d.p)}</span>: <span class="v" ${ri!=null?`data-r="${ri}" data-d="${di}"`:''}>${cm&&ri!=null?`<i class="sw" style="background:${esc(cm[0])}" data-r="${ri}" data-d="${di}" title="Open color picker"></i>`:''}${esc(d.v)}</span>;</div>`};
 let out='';
 blocks.forEach(b=>{if(b.kind==='inline'){out+=`<div class="rule"><span>element.style</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}<div class="dcl" style="padding-left:20px"><span class="v" id="addInline" style="color:#6E7379;cursor:text">+ add declaration</span></div>}</div>`;return}
  if(b.kind==='ua'){out+=`<div class="rule"><span class="src ua">user agent stylesheet</span><span>${esc(b.sel)}</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}}</div>`;return}
  const r=b.r;out+=`<div class="rule">${r.media?`<div class="media">@media ${esc(r.media)}</div>`:''}<button class="src" data-line="${r.line}">app.css:${r.line}</button><span>${esc(r.sel)}</span> {${r.d.map((d,i)=>declHTML(d,r.id,i,d._st)).join('')}}</div>`});
 inh.forEach(g=>{out+=`<div class="inh">Inherited from <span style="color:var(--tag);font-family:var(--mono)">${esc(nodeLabel(g.a))}</span></div>`;g.ms.forEach(m=>{out+=`<div class="rule"><button class="src" data-line="${m.r.line}">app.css:${m.r.line}</button><span>${esc(m.r.sel)}</span> {${m.decls.map(d=>declHTML(d,m.r.id,m.r.d.indexOf(d),m._st[d.p])).join('')}}</div>`})});
 box.innerHTML=out;
 // box model at bottom (like the Computed tab preview)
 box.insertAdjacentHTML('beforeend',boxModelHTML(el));
 const fi=$('#stFilter',v);fi.oninput=()=>{EL.filter=fi.value;renderStyles(v,el);const f2=$('#stFilter',v);f2.focus();f2.setSelectionRange(f2.value.length,f2.value.length)};
 $('#hovBtn',v).onclick=()=>{EL.hovOpen=!EL.hovOpen;renderStyles(v,el)};$('#clsBtn',v).onclick=()=>{EL.clsOpen=!EL.clsOpen;renderStyles(v,el)};
 $$('[data-st]',v).forEach(c=>c.onchange=()=>{if(c.dataset.st===':hover')setForceHover(el,c.checked)});
 $$('[data-cls]',v).forEach(c=>c.onchange=()=>{const k=c.dataset.cls;if(!EL.offCls||EL.offCls.el!==el)EL.offCls={el,list:[]};if(c.checked){el.classList.add(k);EL.offCls.list=EL.offCls.list.filter(x=>x!==k)}else{el.classList.remove(k);EL.offCls.list.push(k)}});
 const ac=$('#addCls',v);if(ac)ac.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&ac.value.trim()){el.classList.add(...ac.value.trim().split(/\s+/));ac.value=''}};
 box.onchange=e=>{const c=e.target;if(c.dataset.r==null)return;const d=RULES[+c.dataset.r].d[+c.dataset.d];d.on=c.checked;logChange(RULES[+c.dataset.r],d,c.checked?'enabled':'disabled');applyCSS();renderStyles(v,el);track('toggle-decl')};
 box.onclick=e=>{const sw=e.target.closest('.sw');if(sw){pickColor(sw,el);return}const src=e.target.closest('.src[data-line]');if(src){SRC.open('app.css',+src.dataset.line);return}
  const vv=e.target.closest('.v[data-r]');if(vv){editDecl(vv,el);return}if(e.target.id==='addInline')addInline(e.target,el)}}
function logChange(r,d,what){ST.changes.push({sel:r.sel,p:d.p,from:d.orig,to:d.v,on:d.on,what,t:Date.now()});bus.emit('changes')}
function editDecl(span,el){const d=RULES[+span.dataset.r].d[+span.dataset.d];const r=RULES[+span.dataset.r];const old=d.v;span.innerHTML='';span.textContent=old;span.contentEditable='true';span.classList.add('edit');span.focus();document.getSelection().selectAllChildren(span);
 const apply=v=>{d.v=v;applyCSS()};let done=false;
 span.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();span.blur()}else if(e.key==='Escape'){span.textContent=old;apply(old);done=true;span.blur()}
  else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();const step=(e.shiftKey?10:e.altKey?0.1:1)*(e.key==='ArrowUp'?1:-1);const t=span.textContent.replace(/-?\d*\.?\d+/,m=>String(Math.round((parseFloat(m)+step)*10)/10));span.textContent=t;apply(t);document.getSelection().selectAllChildren(span);track('nudge-value')}};
 span.oninput=()=>apply(span.textContent);
 span.onblur=()=>{if(!done){d.v=span.textContent.trim()||old;applyCSS();if(d.v!==old){logChange(r,d,'edited');track('edit-value')}}renderStyles($('#elView'),el)}}
function addInline(span,el){const inp=h('<span class="edit" contenteditable="true" spellcheck="false"></span>');span.replaceWith(inp);inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();inp.blur()}if(e.key==='Escape'){inp.textContent='';inp.blur()}};
 inp.onblur=()=>{const t=inp.textContent.trim();if(t.includes(':')){const [p,...rest]=t.split(':');el.style.setProperty(p.trim(),rest.join(':').replace(/;$/,'').trim());track('edit-value');ST.changes.push({sel:'element.style',p:p.trim(),from:'',to:rest.join(':').trim(),what:'added',t:Date.now()});bus.emit('changes')}renderStyles($('#elView'),el)}}
function pickColor(sw,el){const d=RULES[+sw.dataset.r].d[+sw.dataset.d];const r=RULES[+sw.dataset.r];const cur=(d.v.match(/#[0-9a-fA-F]{6}\b/)||[])[0]||toHex(getComputedStyle(el).color)||'#000000';
 const inp=document.createElement('input');inp.type='color';inp.value=cur.length===7?cur:'#000000';inp.style.cssText='position:fixed;left:-100px;top:0;opacity:0';document.body.appendChild(inp);
 inp.oninput=()=>{d.v=d.v.replace(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/,inp.value.toUpperCase());if(!/#|rgb/.test(d.v))d.v=inp.value;applyCSS();sw.style.background=inp.value};
 inp.onchange=()=>{logChange(r,d,'color');track('color-pick');renderStyles($('#elView'),el);inp.remove()};inp.click();setTimeout(()=>{if(document.body.contains(inp)&&!inp.value)inp.remove()},60000)}
function boxModelHTML(el){const cs=getComputedStyle(el);const n=k=>{const v=parseFloat(cs[k])||0;return v?Math.round(v*100)/100:'–'};
 return `<div style="padding:4px 10px 14px"><div class="boxm" data-hs="el-box"><div><span class="lab">margin</span>${n('marginTop')}<div><span class="lab">border</span>${n('borderTopWidth')}<div><span class="lab">padding</span>${n('paddingTop')}<div class="row"><span>${n('paddingLeft')}</span><span class="cbox">${Math.round((el.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0))*100)/100} × ${Math.round((el.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0))*100)/100}</span><span>${n('paddingRight')}</span></div>${n('paddingBottom')}</div>${n('borderBottomWidth')}</div>${n('marginBottom')}</div></div></div>`}
const COMP=['display','position','box-sizing','width','height','margin','padding','border-radius','color','background-color','background-image','font-family','font-size','font-weight','line-height','letter-spacing','text-decoration','cursor','grid-template-columns','gap','align-items','justify-content','flex-direction','overflow','z-index','transform','box-shadow','transition','visibility','opacity'];
function renderComputed(v,el){const cs=getComputedStyle(el);const all=!!EL.compAll;const props=all?[...cs].sort():COMP;const f=(EL.cfilter||'').toLowerCase();
 v.innerHTML=boxModelHTML(el)+`<div class="tb"><input class="inp" id="cFilter" placeholder="Filter" value="${esc(EL.cfilter||'')}" style="flex:1"><label class="ck"><input type="checkbox" id="cAll" ${all?'checked':''}>Show all</label></div><div class="comp">${props.filter(p=>!f||p.includes(f)).map(p=>`<div><span class="p">${p}</span><span class="v">${/color/.test(p)?swatchTxt(cs.getPropertyValue(p)):esc(cs.getPropertyValue(p))}</span></div>`).join('')}</div>`;
 const fi=$('#cFilter',v);fi.oninput=()=>{EL.cfilter=fi.value;renderComputed(v,el);$('#cFilter',v).focus();$('#cFilter',v).setSelectionRange(99,99)};$('#cAll',v).onchange=e=>{EL.compAll=e.target.checked;renderComputed(v,el)}}
function renderLayout(v){const grids=PAGE.qa('*').filter(n=>/grid/.test(getComputedStyle(n).display));const flexes=PAGE.qa('*').filter(n=>/flex/.test(getComputedStyle(n).display));
 const row=n=>`<label class="ck" style="display:flex;padding:3px 0;font:400 12.5px var(--mono)"><input type="checkbox" data-g="${PAGE.qa('*').indexOf(n)}" ${EL.grids.has(n)?'checked':''}><span style="color:var(--tag)">${esc(nodeLabel(n))}</span></label>`;
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px var(--body)"><div style="font-weight:600;margin-bottom:6px">Grid</div><div style="color:#9AA0A6;margin-bottom:6px">Overlay display settings: line numbers · track sizes</div>${grids.map(row).join('')||'<div class="muted">No grid layouts</div>'}
 <div style="font-weight:600;margin:14px 0 6px">Flexbox</div>${flexes.map(row).join('')}</div>`;$$('[data-g]',v).forEach(c=>c.onchange=()=>toggleGrid(PAGE.qa('*')[+c.dataset.g]))}
function renderListeners(v,el){let x=el;const rows=[];while(x&&x!==HTML){LISTENERS.filter(l=>l.el===x&&!l.removed).forEach(l=>rows.push(l));x=x.parentNode}
 const types=[...new Set(rows.map(r=>r.type))];v.innerHTML=`<div class="tb"><button class="tbb" id="lRefresh">${IC.reload}</button><label class="ck"><input type="checkbox" checked disabled>Ancestors</label><span style="color:#9AA0A6">Framework listeners</span></div>`+
  (types.length?types.map(t=>`<div style="padding:4px 10px;font:600 12.5px var(--mono);background:#232428;border-bottom:1px solid #2E3035">▾ ${t}</div>`+rows.filter(r=>r.type===t).map(r=>`<div style="display:flex;gap:10px;padding:3px 10px 3px 26px;font:400 12px var(--mono);border-bottom:1px solid #2A2B2F"><span style="color:var(--tag)">${esc(nodeLabel(r.el))}</span><span style="margin-left:auto;color:#9AA0A6;text-decoration:underline;cursor:pointer" data-src="${r.src}">${r.src}</span><button class="pill" data-rm="${LISTENERS.indexOf(r)}">Remove</button></div>`).join('')).join(''):'<div class="empty">No event listeners on this node or its ancestors.<br>Select a button in the page.</div>');
 $$('[data-rm]',v).forEach(b=>b.onclick=()=>{LISTENERS[+b.dataset.rm].removed=true;toast('Listener removed — clicking it now does nothing');renderListeners(v,el);track('remove-listener')});$$('[data-src]',v).forEach(s=>s.onclick=()=>{const [f,l]=s.dataset.src.split(':');SRC.open(f,+l)})}
function renderA11y(v,el){const chain=[];let x=el;while(x&&x!==HTML){chain.unshift(x);x=x.parentNode}const ct=contrastOf(el);
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px/22px var(--body)"><div style="font-weight:600;margin-bottom:4px">Accessibility tree</div><div style="font-family:var(--mono);font-size:12px">RootWebArea "Driftwood — Specialty Coffee"${chain.filter(c=>roleOf(c)!=='generic'||c===el).map((c,i)=>`<div style="padding-left:${(i+1)*12}px;${c===el?'background:var(--dsel)':''}">${roleOf(c)} ${accName(c)?`"${esc(accName(c).slice(0,40))}"`:''}</div>`).join('')}</div>
 <div style="font-weight:600;margin:12px 0 4px">Computed properties</div><div class="kv" style="padding:0"><div><b>Name</b><span>${esc(accName(el)||'""')}</span></div><div><b>Role</b><span>${roleOf(el)}</span></div><div><b>Focusable</b><span>${el.tabIndex>=0}</span></div>${ct?`<div><b>Contrast ratio</b><span class="${ct>=4.5?'g':'o'}">${ct.toFixed(2)} ${ct>=4.5?'✓ AA':'✗ fails AA 4.5'}</span></div>`:''}</div></div>`}

/* ================= Console ================= */
let EVAL_OK=true;try{EVAL_OK=new Function('return 7')()===7}catch{EVAL_OK=false}
const CONSOLE_VARS={};const selHist=[];bus.on('select',n=>{if(selHist[0]!==n){selHist.unshift(n);selHist.length=Math.min(selHist.length,5)}});
const CSET={levels:{verbose:false,info:true,warn:true,error:true},filter:'',preserve:false,group:true,hideNet:false,eager:true};
const DOC=new Proxy({},{get(t,k){switch(k){case'title':return HEAD.querySelector('title').textContent;case'body':return BODY;case'head':return HEAD;case'documentElement':return HTML;
 case'querySelector':return s=>HTML.querySelector(s);case'querySelectorAll':return s=>HTML.querySelectorAll(s);case'getElementById':return id=>HTML.querySelector('#'+CSS.escape(id));case'getElementsByClassName':return c=>HTML.getElementsByClassName(c);case'getElementsByTagName':return tg=>HTML.getElementsByTagName(tg);
 case'cookie':return COOKIES.filter(c=>!c.httpOnly).map(c=>c.name+'='+c.value).join('; ');case'URL':return'https://driftwood.coffee/shop';case'location':return LOC;case'readyState':return'complete';case'images':return BODY.querySelectorAll('img');case'forms':return BODY.querySelectorAll('form');case'links':return BODY.querySelectorAll('a');
 case'addEventListener':return(...a)=>BODY.addEventListener(...a);case Symbol.toStringTag:return'HTMLDocument'}const v=document[k];return typeof v==='function'?v.bind(document):v},
 set(t,k,v){if(k==='title'){HEAD.querySelector('title').textContent=v;$('#tabTitle').textContent=v;return true}if(k==='cookie'){const [nv]=String(v).split(';');const [n,...val]=nv.split('=');const c=COOKIES.find(c=>c.name===n.trim());if(c)c.value=val.join('=');else COOKIES.push({name:n.trim(),value:val.join('='),domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'});bus.emit('storage');return true}return true},has(){return true}});
const LOC={href:'https://driftwood.coffee/shop',origin:'https://driftwood.coffee',hostname:'driftwood.coffee',pathname:'/shop',protocol:'https:',search:'',hash:'',reload:()=>reloadPage(),toString(){return this.href}};
const mkStorage=(M,name)=>new Proxy({},{get(t,k){if(k==='getItem')return x=>M.has(String(x))?M.get(String(x)):null;if(k==='setItem')return(x,v)=>{M.set(String(x),String(v));bus.emit('storage');if(String(x)==='theme')setTheme(String(v))};if(k==='removeItem')return x=>{M.delete(String(x));bus.emit('storage')};if(k==='clear')return()=>{M.clear();bus.emit('storage')};if(k==='key')return i=>[...M.keys()][i]??null;if(k==='length')return M.size;if(k===Symbol.toStringTag)return'Storage';if(typeof k==='string'&&M.has(k))return M.get(k);return undefined},
 set(t,k,v){M.set(String(k),String(v));bus.emit('storage');return true},ownKeys(){return[...M.keys()]},getOwnPropertyDescriptor(t,k){return M.has(k)?{enumerable:true,configurable:true,value:M.get(k)}:undefined}});
const SCOPE={document:DOC,window:new Proxy(globalThis,{get(t,k){if(k==='document')return DOC;if(k==='location')return LOC;if(k==='localStorage')return SCOPE.localStorage;const v=t[k];return typeof v==='function'&&!/^[A-Z]/.test(String(k))?v.bind(t):v}}),location:LOC,
 localStorage:mkStorage(LS),sessionStorage:mkStorage(SS),console:pageConsole,fetch:(u,o={})=>simFetch(u,{...o,initiator:'VM'+(CON.vm||1)+':1'}),
 $:(s,root)=>(root||HTML).querySelector(s),$$:(s,root)=>[...(root||HTML).querySelectorAll(s)],$x:(xp)=>{const r=[];const it=document.evaluate(xp,BODY,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let i=0;i<it.snapshotLength;i++)r.push(it.snapshotItem(i));return r},
 copy:v=>{copyText(typeof v==='string'?v:v&&v.nodeType?v.outerHTML:JSON.stringify(v,null,2));track('copy')},clear:()=>pageConsole.clear(),inspect:n=>{if(n&&n.nodeType===1){setPanel('elements');select(n)}},keys:Object.keys,values:Object.values,dir:o=>pageConsole.dir(o),
 getEventListeners:n=>{const o={};LISTENERS.filter(l=>l.el===n&&!l.removed).forEach(l=>(o[l.type]=o[l.type]||[]).push({listener:l.fn,once:false,passive:false,type:l.type,useCapture:false}));return o},
 monitorEvents:(n,types)=>{[].concat(types||['click']).forEach(t=>n.addEventListener(t,e=>CON.add({type:'log',args:[t,e],src:''})));},
 queryObjects:c=>{const map={Promise:0,HTMLDivElement:toastCache.length};CON.add({type:'log',args:[`Array(${map[c&&c.name]||0})`],plain:true,src:''})},
 cart,orders,products:PRODUCTS,addToCart,checkout,calcTotal,renderCart,toastCache,setTheme};
Object.defineProperty(SCOPE,'$0',{get:()=>ST.sel,enumerable:true});[1,2,3,4].forEach(i=>Object.defineProperty(SCOPE,'$'+i,{get:()=>selHist[i],enumerable:true}));SCOPE.$_=undefined;
const scopeP=new Proxy({},{has:(t,k)=>typeof k==='string'&&!k.startsWith('__')&&(k in CONSOLE_VARS||k in SCOPE),get:(t,k)=>k===Symbol.unscopables?undefined:k in CONSOLE_VARS?CONSOLE_VARS[k]:SCOPE[k],set:(t,k,v)=>{if(k in SCOPE&&k!=='$_'&&typeof SCOPE[k]!=='object'){SCOPE[k]=v;return true}CONSOLE_VARS[k]=v;return true}});
function runCode(code){CON.vm=(CON.vm||200)+1;let src=code.trim();
 src=src.replace(/^(?:let|const|var)\s+([A-Za-z_$][\w$]*)\s*=/gm,(m,n)=>{CONSOLE_VARS[n]=undefined;return n+' ='}).replace(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)/gm,(m,a,n)=>{CONSOLE_VARS[n]=undefined;return n+' = '+(a||'')+'function '+n});
 if(/\bawait\b/.test(src)){try{return new Function('__s',`with(__s){return (async()=>(${src}\n))()}`)(scopeP)}catch(e){if(!(e instanceof SyntaxError))throw e;return new Function('__s',`with(__s){return (async()=>{${src}\n})()}`)(scopeP)}}
 if(/^\{/.test(src)&&!/;\s*$/.test(src))src='('+src+')';
 return new Function('__s','__c','with(__s){return eval(__c)}')(scopeP,src)}
const CANNED={"document.title":()=>DOC.title,"$0":()=>ST.sel,"$$('.card').length":()=>PAGE.qa('.card').length,"console.table(orders)":()=>{pageConsole.table(orders)},"cart.items":()=>cart.items,"localStorage.getItem('theme')":()=>LS.get('theme'),
 "await fetch('/api/cart', {method:'POST'})":()=>simFetch('/api/cart',{method:'POST',initiator:'VM1:1'}),"document.body.dataset.theme = 'dark'":()=>{setTheme('dark');return'dark'},"$0.style.outline = '3px solid red'":()=>{ST.sel.style.outline='3px solid red';return'3px solid red'},"copy($0.outerHTML)":()=>{SCOPE.copy(ST.sel.outerHTML)},
 "console.time('t'); calcTotal(cart.items); console.timeEnd('t')":()=>{pageConsole.time('t');calcTotal(cart.items);pageConsole.timeEnd('t')},"getEventListeners($0)":()=>SCOPE.getEventListeners(ST.sel)};
const hist=store.get('hist',[]);
async function evaluate(code){code=code.trim();if(!code)return;CON.add({type:'input',args:[code]});hist.push(code);if(hist.length>60)hist.shift();store.set('hist',hist);
 let r,threw=false;try{if(EVAL_OK)r=runCode(code);else if(CANNED[code])r=CANNED[code]();else throw new EvalError('This page blocks eval, so only the example chips run here.');
  if(r&&typeof r.then==='function'&&/\bawait\b/.test(code))r=await r}
 catch(e){threw=true;CON.add({type:'error',args:[`Uncaught ${e&&e.name?`${e.name}: ${e.message}`:fmtPlain(e)}`],src:'VM'+(CON.vm||1)+':1',stack:'    at <anonymous>:1:1'})}
 if(!threw){SCOPE.$_=r;CON.add({type:'result',args:[r]})}
 track('console-eval');if(/\$0/.test(code))track('console-$0');if(/table\(/.test(code))track('console-table');if(/fetch\(/.test(code))track('console-fetch')}
function fmtPlain(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch{return String(v)}}

/* ---------- value rendering ---------- */
function typeName(v){if(v===null)return'null';const t=Object.prototype.toString.call(v).slice(8,-1);if(v&&v[Symbol.toStringTag])return v[Symbol.toStringTag];if(v&&v.constructor&&v.constructor.name&&v.constructor!==Object)return v.constructor.name;return t}
function prevShort(v,d=0){if(v===null)return'<span class="ov-null">null</span>';if(v===undefined)return'<span class="ov-null">undefined</span>';const t=typeof v;
 if(t==='string')return`<span class="ov-str">'${esc(v.length>60?v.slice(0,60)+'…':v)}'</span>`;if(t==='number'||t==='bigint')return`<span class="ov-num">${String(v)}</span>`;if(t==='boolean')return`<span class="ov-kw">${v}</span>`;if(t==='function')return`<span class="ov-fn">ƒ</span>`;if(t==='symbol')return`<span class="ov-str">${esc(String(v))}</span>`;
 if(v.nodeType===1)return`<span class="ov-kw">${esc(nodeLabel(v))}</span>`;if(v.nodeType)return`<span class="ov-dim">#${esc(v.nodeName)}</span>`;
 if(Array.isArray(v))return d>0?`Array(${v.length})`:`(${v.length}) [${v.slice(0,6).map(x=>prevShort(x,d+1)).join(', ')}${v.length>6?', …':''}]`;
 if(v instanceof Map)return`Map(${v.size})`;if(v instanceof Set)return`Set(${v.size})`;if(v instanceof Promise)return'Promise';if(v instanceof Error)return`<span class="r">${esc(v.name)}</span>`;
 const tn=typeName(v);if(d>0)return tn==='Object'?'{…}':tn;const ks=safeKeys(v).slice(0,5);return`${tn==='Object'?'':esc(tn)+' '}{${ks.map(k=>`<span class="ov-key">${esc(k)}</span>: ${prevShort(safeGet(v,k),d+1)}`).join(', ')}${safeKeys(v).length>5?', …':''}}`}
function safeKeys(v){try{return Object.keys(v)}catch{return[]}}
function safeGet(v,k){try{return v[k]}catch(e){return'(…)'}}
function renderVal(v,top,asResult){if(v===null||v===undefined||typeof v!=='object'&&typeof v!=='function'){if(typeof v==='string'&&!asResult&&top)return h(`<span>${esc(v)}</span>`);return h(`<span>${prevShort(v)}</span>`)}
 if(typeof v==='function')return h(`<span class="ov-fn">ƒ ${esc(v.name||'anonymous')}(${esc(String(v).match(/\(([^)]*)\)/)?.[1]||'')})</span>`);
 if(v.nodeType===1){const s=h(`<span class="nodeprev">&lt;${esc(v.tagName.toLowerCase())}${[...v.attributes].filter(a=>a.name!=='style'||true).slice(0,3).map(a=>` <span class="an" style="color:var(--an)">${esc(a.name)}</span>=<span style="color:var(--av)">"${esc(a.value.replace(/\s*__hov/,'').slice(0,40))}"</span>`).join('')}&gt;${v.children.length?'…':esc(v.textContent.trim().slice(0,30))}&lt;/${esc(v.tagName.toLowerCase())}&gt;</span>`);
  s.onmouseenter=()=>highlight(v);s.onmouseleave=clearHL;s.onclick=()=>{setPanel('elements');select(v);track('console-node')};s.title='Click to reveal in Elements panel';return s}
 if(v instanceof Promise){const s=h('<span>Promise {<span class="ov-dim">&lt;pending&gt;</span>}</span>');return s}
 if(v instanceof Error){return h(`<span class="r">${esc(v.stack||v.name+': '+v.message)}</span>`)}
 const o=h(`<span class="obj"><span class="hd">${prevShort(v)}</span><span class="kids"></span></span>`);let built=false;
 o.querySelector('.hd').onclick=e=>{e.stopPropagation();o.classList.toggle('open');if(!built){built=true;const kids=o.querySelector('.kids');let entries=[];
   if(v instanceof Map)entries=[...v.entries()].map(([k,x],i)=>[i,{key:k,value:x}]);else if(v instanceof Set)entries=[...v].map((x,i)=>[i,x]);else{const own=Array.isArray(v)?[...v.keys()].map(String):Object.getOwnPropertyNames(v);entries=own.slice(0,120).map(k=>[k,safeGet(v,k)]);if(v.nodeType||own.length===0&&typeName(v)!=='Object'){entries=[];for(const k in v){entries.push([k,safeGet(v,k)]);if(entries.length>80)break}}}
   if(Array.isArray(v))entries.push(['length',v.length]);entries.forEach(([k,x])=>{const r=h(`<div><span class="ov-key">${esc(String(k))}</span>: </div>`);r.appendChild(renderVal(x,false,true));kids.appendChild(r)});
   kids.appendChild(h(`<div><span class="ov-dim">[[Prototype]]</span>: <span class="ov-dim">${Array.isArray(v)?'Array(0)':esc(typeName(Object.getPrototypeOf(v)||{})||'Object')}</span></div>`))}};return o}

/* ---------- console view (panel + drawer share this) ---------- */
function makeConsole(root,compact){root.innerHTML=`<div class="tb" data-hs="con-tb"><button class="tbb" data-a="clear" title="Clear console (Ctrl+L)">${IC.clear}</button><span class="pill" title="JavaScript context">top ▾</span><button class="tbb" data-a="live" title="Create live expression">${IC.eye}</button><input class="inp" data-a="filter" placeholder="Filter" value="${esc(CSET.filter)}" style="flex:1;min-width:80px" data-hs="con-filter"><button class="pill" data-a="levels" data-hs="con-levels">Default levels ▾</button><button class="tbb" data-a="settings" title="Console settings">${IC.gear}</button></div>
 <div class="settings" hidden style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;font:400 12px var(--body)"><label class="ck"><input type="checkbox" data-s="hideNet">Hide network</label><label class="ck"><input type="checkbox" data-s="preserve">Preserve log</label><label class="ck"><input type="checkbox" data-s="group" checked>Group similar messages</label><label class="ck"><input type="checkbox" data-s="eager" checked>Eager evaluation</label></div>
 <div class="liveb"></div><div class="con scroll" data-hs="con-log"></div><div class="cprompt" data-hs="con-prompt"><span class="ic">›</span><div style="flex:1;position:relative"><textarea spellcheck="false" aria-label="Console prompt" rows="1"></textarea><div class="ghost" style="position:absolute;left:0;top:0;pointer-events:none;font:400 12.5px/18px var(--mono);color:#6E7379;white-space:pre"></div><div class="eager" style="font:400 12px/16px var(--mono);color:#9AA0A6;min-height:0"></div></div></div>
 ${compact?'':`<div class="chips" data-hs="con-chips"><small>Try:</small>${Object.keys(CANNED).map(c=>`<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>`}`;
 const log=$('.con',root),ta=$('textarea',root),ghost=$('.ghost',root),eager=$('.eager',root);let hi=hist.length;
 const visible=m=>{if(m.type==='input'||m.type==='result')return !CSET.filter||match(m);const lv=m.type==='log'?'info':m.type;if(CSET.levels[lv]===false)return false;if(CSET.hideNet&&m.net)return false;return !CSET.filter||match(m)};
 const match=m=>{const txt=m.args.map(a=>typeof a==='string'?a:fmtPlain(a)).join(' ')+' '+(m.src||'');const f=CSET.filter;if(/^\/.+\/$/.test(f)){try{return new RegExp(f.slice(1,-1),'i').test(txt)}catch{return true}}return f.split(/\s+/).every(w=>w.startsWith('-')?!txt.toLowerCase().includes(w.slice(1).toLowerCase()):txt.toLowerCase().includes(w.toLowerCase()))};
 const row=m=>{const d=h(`<div class="cm ${m.type==='log'?'':m.type}${m.group?' group':''}" data-id="${m.id}"><span class="ic">${({input:'›',result:'←',warn:'▲',error:'✕',info:'ⓘ'})[m.type]||''}</span></div>`);
  if(m.count>1)d.appendChild(h(`<span class="cnt">${m.count}</span>`));
  if(m.src){const s=h(`<span class="src">${esc(m.src)}</span>`);s.onclick=()=>{const [f,l]=m.src.split(':');if(SRC.files[f])SRC.open(f,+l||1);else if(f==='shop')setPanel('network')};d.appendChild(s)}
  if(m.table){d.appendChild(tableEl(m.table))}else if(m.type==='input'){d.appendChild(h(`<span style="color:#C7D7F8">${esc(m.args[0])}</span>`))}
  else m.args.forEach((a,i)=>{if(i)d.appendChild(document.createTextNode(' '));d.appendChild(renderVal(a,true,m.type==='result'))});
  if(m.stack)d.appendChild(h(`<div style="color:inherit;opacity:.8">${esc(m.stack)}</div>`));return d};
 const redraw=()=>{log.innerHTML='';CON.msgs.filter(visible).forEach(m=>log.appendChild(row(m)));log.scrollTop=1e9};
 const lis=(ev,m)=>{if(!root.isConnected){CON.listeners.splice(CON.listeners.indexOf(lis),1);return}if(ev==='clear'){log.innerHTML='';return}if(ev==='update'){const old=$(`[data-id="${m.id}"]`,log);if(old&&visible(m))old.replaceWith(row(m));return}if(visible(m)){const stick=log.scrollTop+log.clientHeight>=log.scrollHeight-30;log.appendChild(row(m));if(stick||m.type==='input'||m.type==='result')log.scrollTop=1e9}};CON.listeners.push(lis);
 bus.on('console-redraw',()=>{if(root.isConnected)redraw()});redraw();
 root.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
  if(k==='clear'){CON.clear();track('console-clear')}
  if(k==='levels'){const r=a.getBoundingClientRect();openMenu(r.left,r.bottom+2,[['verbose','Verbose'],['info','Info'],['warn','Warnings'],['error','Errors']].map(([lv,l])=>({label:(CSET.levels[lv]?'✓ ':'   ')+l,act:()=>{CSET.levels[lv]=!CSET.levels[lv];bus.emit('console-redraw');track('console-levels')}})))}
  if(k==='settings'){const s=$('.settings',root);s.hidden=!s.hidden}
  if(k==='live'){LIVE.push({expr:'',edit:true});renderLive()}});
 $('[data-a="filter"]',root).oninput=e=>{CSET.filter=e.target.value;bus.emit('console-redraw');$$('[data-a="filter"]').forEach(x=>{if(x!==e.target)x.value=CSET.filter});track('console-filter')};
 $$('[data-s]',root).forEach(c=>{c.checked=CSET[c.dataset.s];c.onchange=()=>{CSET[c.dataset.s]=c.checked;bus.emit('console-redraw')}});
 $$('.chips button',root).forEach(b=>b.onclick=()=>{ta.value=b.dataset.c;ta.focus();autosize();onType()});
 const autosize=()=>{ta.style.height='18px';ta.style.height=Math.min(120,ta.scrollHeight)+'px'};
 let sugg=[],si=0;
 const onType=()=>{autosize();ghost.textContent='';eager.textContent='';sugg=[];const v=ta.value;if(!EVAL_OK||!v||v.includes('\n'))return;
  const m=v.match(/([\w$]+(?:\.[\w$]+)*)\.([\w$]*)$/);try{if(m){const obj=runSafe(m[1]);if(obj!=null){const ks=new Set();let o=obj;let depth=0;while(o&&depth<4){Object.getOwnPropertyNames(o).forEach(k=>ks.add(k));o=Object.getPrototypeOf(o);depth++}if(obj===DOC)['title','body','head','querySelector','querySelectorAll','getElementById','cookie','documentElement','location','images','links'].forEach(k=>ks.add(k));sugg=[...ks].filter(k=>k.startsWith(m[2])&&k!==m[2]&&!/^__|^constructor$/.test(k)).sort().slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(m[2].length))}`}}
   else{const w=(v.match(/([\w$]+)$/)||[])[1];if(w&&w.length>=2){sugg=[...Object.keys(SCOPE),...Object.keys(CONSOLE_VARS),'document','window','JSON','Math','Object','Array','performance'].filter(k=>k.startsWith(w)&&k!==w).slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(w.length))}`}}}catch{}
  if(CSET.eager&&isSafe(v)){try{const r=runSafe(v);if(r!==undefined){const el=renderVal(r,false,true);eager.innerHTML='';eager.appendChild(el)}}catch{}}};
 ta.addEventListener('input',onType);
 ta.addEventListener('keydown',e=>{e.stopPropagation();
  if((e.key==='Tab'||e.key==='ArrowRight'&&ta.selectionStart===ta.value.length)&&sugg[0]){const m=ta.value.match(/([\w$]+)$/)||[''];const part=(ta.value.match(/\.([\w$]*)$/)||ta.value.match(/([\w$]*)$/))[1];ta.value=ta.value.slice(0,ta.value.length-part.length)+sugg[0];e.preventDefault();onType();return}
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const c=ta.value;ta.value='';ghost.textContent='';eager.textContent='';autosize();hi=hist.length+1;evaluate(c);return}
  if(e.key==='ArrowUp'&&!ta.value.includes('\n')&&hist.length){e.preventDefault();hi=Math.max(0,Math.min(hi,hist.length)-1);ta.value=hist[hi]||'';onType()}
  if(e.key==='ArrowDown'&&!ta.value.includes('\n')){e.preventDefault();hi=Math.min(hist.length,hi+1);ta.value=hist[hi]||'';onType()}
  if(e.key==='l'&&(e.ctrlKey||e.metaKey)){e.preventDefault();CON.clear()}});
 log.addEventListener('click',e=>{if(e.target===log)ta.focus()});
 const liveb=$('.liveb',root);root._live=liveb;renderLive();return{root,ta}}
function runSafe(expr){return runCode(expr)}
function isSafe(v){if(/[=;]|\+\+|--|\bawait\b|\bnew\b|\bdelete\b/.test(v.replace(/[=!]==?|[<>]=/g,'')))return false;const calls=v.match(/([\w$.]+)\s*\(/g)||[];return calls.every(c=>/^(\$|\$\$|\$x|Object\.keys|Object\.values|JSON\.stringify|Math\.\w+|[\w$.]*\.(toFixed|toUpperCase|toLowerCase|slice|includes|matches|getAttribute|querySelector|querySelectorAll|getItem|map|filter|join|at))\s*\($/.test(c.trim()))}
function tableEl(data){const rows=Array.isArray(data)?data:Object.entries(data).map(([k,v])=>Object.assign({__k:k},v));const keys=[...new Set(rows.flatMap(r=>typeof r==='object'&&r?Object.keys(r).filter(k=>k!=='__k'):['Value']))].slice(0,7);
 const t=h(`<div><table class="ctab"><tr><th>(index)</th>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr>${rows.map((r,i)=>`<tr><td>${esc(r&&r.__k!==undefined?r.__k:i)}</td>${keys.map(k=>`<td>${typeof r==='object'&&r?prevShort(r[k],1):k==='Value'?prevShort(r,1):''}</td>`).join('')}</tr>`).join('')}</table><span class="ov-dim">${Array.isArray(data)?`Array(${data.length})`:'Object'}</span></div>`);return t}
const LIVE=[];
function renderLive(){$$('.liveb').forEach(b=>{b.className='liveb'+(LIVE.length?' live':'');b.innerHTML=LIVE.map((l,i)=>l.edit?`<div class="le"><span style="color:#9AA0A6">⊙</span><input class="inp" data-li="${i}" placeholder="Expression, e.g. performance.now()" style="flex:1"></div>`:`<div class="le" data-hs="con-live"><span style="color:#9AA0A6">⊙</span><b>${esc(l.expr)}</b><button data-rm="${i}" title="Remove">✕</button></div><div class="lv" data-lv="${i}" style="padding-left:20px"></div>`).join('');
  $$('[data-li]',b).forEach(inp=>{inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=inp.value.trim();const L=LIVE[+inp.dataset.li];if(v){L.expr=v;L.edit=false;track('live-expr')}else LIVE.splice(+inp.dataset.li,1);renderLive()}if(e.key==='Escape'){LIVE.splice(+inp.dataset.li,1);renderLive()}}});
  $$('[data-rm]',b).forEach(x=>x.onclick=()=>{LIVE.splice(+x.dataset.rm,1);renderLive()})})}
setInterval(()=>{if(!LIVE.length)return;LIVE.forEach((l,i)=>{if(l.edit)return;let out;try{out=EVAL_OK?runCode(l.expr):'(eval blocked)'}catch(e){out=e.name+': '+e.message}$$(`[data-lv="${i}"]`).forEach(d=>{d.innerHTML='';d.appendChild(renderVal(out,false,true))})})},250);
bus.on('reload',()=>{if(!CSET.preserve)CON.clear();else CON.add({type:'info',args:['Navigated to https://driftwood.coffee/shop'],src:''})});
bus.on('console-count',()=>{let e=0,w=0;CON.msgs.forEach(m=>{if(m.type==='error')e+=m.count||1;if(m.type==='warn')w+=m.count||1});const eb=$('#errBdg'),wb=$('#warnBdg');eb.querySelector('span').textContent=e;wb.querySelector('span').textContent=w;eb.hidden=!e;wb.hidden=!w});

/* ================= Sources + debugger ================= */
const CART_JS=`// cart.js — cart state, totals and checkout
import { api } from './api.js';
import { products, round, toast } from './app.js';

export const cart = { items: [] };

/** Sum the cart and apply the 10% bulk discount */
export function calcTotal(items) {
  let total = 0;
  for (const item of items) {
    const line = item.price * item.qty;
    total += line;
  }
  if (total > 100) total *= 0.9;
  return round(total);
}

export function addToCart(id) {
  const p = products.find(x => x.id === id);
  const it = cart.items.find(i => i.id === id);
  if (it) it.qty++;
  else cart.items.push({ id, name: p.name, price: p.price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart.items));
  console.debug(\`added \${p.name} → cart has \${cart.items.length} line(s)\`);
  renderCart();
}

export function renderCart() {
  const n = cart.items.reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll('.count').forEach(c => c.textContent = n);
  document.querySelector('.total').textContent = '$' + calcTotal(cart.items).toFixed(2);
}

export async function checkout() {
  const total = calcTotal(cart.items);
  const res = await api.post('/cart', { total });
  if (!res.ok) toast(\`Checkout failed (\${res.status}). Try again.\`);
  return res;
}

document.querySelectorAll('.btn.add').forEach(b =>
  b.addEventListener('click', () => addToCart(b.closest('.card').dataset.id)));
document.querySelector('.btn.checkout')
  .addEventListener('click', checkout);`;
const APP_JS=`// app.js — Driftwood storefront
import { cart, renderCart } from './cart.js';
import './vendor.min.js';

export const VERSION = '2.4.1';
export const products = [];

export function round(n) {
  return Math.round(n * 100) / 100;
}

export function toast(msg, isError = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' err' : '');
  t.textContent = msg;
  document.querySelector('.toasts').append(t);
  setTimeout(() => {
    t.remove();
    toastCache.push(t);   // ⚠ keeps a reference: detached DOM leak
  }, 2600);
}

export const toastCache = [];

function restoreCart() {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  saved.forEach(({ id, qty }) => {
    const p = products.find(x => x.id === id);
    if (p) cart.items.push({ ...p, qty });
  });
  renderCart();
}

async function loadProducts() {
  const res = await fetch('/api/products?limit=12');
  products.push(...(await res.json()));
  restoreCart();
}

loadProducts().then(() =>
  console.info(\`Driftwood v\${VERSION} · \${products.length} products loaded\`));

// Smooth-scroll the hero call to action
const cta = document.querySelector('.btn.cta');
cta.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
});

// Theme toggle, persisted in localStorage
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
});

document.querySelector('.cart-pill').addEventListener('click', () =>
  document.querySelector('.cart-bar').scrollIntoView({ block: 'center' }));

// Newsletter
const subscribe = document.querySelector('.btn.subscribe');
subscribe.addEventListener('click', () =>
  toast('Subscribed ✓ See you on roast day.'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`;
const VENDOR_MIN=`!function(e,t){"object"==typeof exports?module.exports=t():e.tiny=t()}(this,function(){"use strict";var e={},t=function(n){return n&&n.__esModule?n:{default:n}};function r(n,o){for(var i=0;i<o.length;i++){var a=o[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(n,a.key,a)}}var o=function(){function n(o){this.el=o,this.handlers={}}return n.prototype.on=function(n,o){return(this.handlers[n]=this.handlers[n]||[]).push(o),this},n.prototype.emit=function(n,o){(this.handlers[n]||[]).forEach(function(i){return i(o)})},n}();return e.Emitter=o,e.interop=t,e.define=r,e});`;
const VENDOR_PRETTY=`!function(e, t) {
    "object" == typeof exports ? module.exports = t() : e.tiny = t()
}(this, function() {
    "use strict";
    var e = {}
      , t = function(n) {
        return n && n.__esModule ? n : {
            default: n
        }
    };
    function r(n, o) {
        for (var i = 0; i < o.length; i++) {
            var a = o[i];
            a.enumerable = a.enumerable || !1,
            a.configurable = !0,
            "value" in a && (a.writable = !0),
            Object.defineProperty(n, a.key, a)
        }
    }
    var o = function() {
        function n(o) {
            this.el = o,
            this.handlers = {}
        }
        return n.prototype.on = function(n, o) {
            return (this.handlers[n] = this.handlers[n] || []).push(o),
            this
        }
        ,
        n.prototype.emit = function(n, o) {
            (this.handlers[n] || []).forEach(function(i) {
                return i(o)
            })
        }
        ,
        n
    }();
    return e.Emitter = o,
    e.interop = t,
    e.define = r,
    e
});`;
const INDEX_HTML=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Driftwood — Specialty Coffee</title>
  <link rel="stylesheet" href="/css/app.css">
  <link rel="manifest" href="/manifest.json">
  <meta property="og:image" content="/img/og-image.png">
  <script src="/js/vendor.min.js" defer><\/script>
  <script src="/js/app.js" type="module"><\/script>
  <script src="/js/cart.js" type="module"><\/script>
  <script src="/js/analytics.js" async><\/script>
</head>
<body class="shop" data-theme="light">
  <nav class="nav">…</nav>
  <header class="hero">…</header>
  <section class="cards" id="shop"></section>  <!-- filled by app.js -->
  <aside class="cart-bar">…</aside>
  <section class="news">…</section>
  <div class="toasts" aria-live="polite"></div>
</body>
</html>`;
const SNIPPETS={'list-cookies.js':`// Snippet: print every readable cookie as a table\nconsole.table(document.cookie.split('; ').map(c => {\n  const [name, ...v] = c.split('=');\n  return { name, value: v.join('=') };\n}));`,
 'outline-everything.js':`// Snippet: outline every element to debug layout\n$$('body *').forEach(el => el.style.outline = '1px solid rgb(255 0 128 / 50%)');\n'outlined ' + $$('body *').length + ' elements';`};
const SRC={files:{'(index)':{kind:'html',text:()=>INDEX_HTML,path:'driftwood.coffee/(index)'},'app.css':{kind:'css',text:()=>cssText(),path:'driftwood.coffee/css/app.css'},'app.js':{kind:'js',text:()=>APP_JS,path:'driftwood.coffee/js/app.js'},'cart.js':{kind:'js',text:()=>CART_JS,path:'driftwood.coffee/js/cart.js'},'vendor.min.js':{kind:'js',text:()=>SRC.pretty?VENDOR_PRETTY:VENDOR_MIN,path:'driftwood.coffee/js/vendor.min.js'}},
 cur:'cart.js',openTabs:['app.js','cart.js'],bps:new Map(),nav:'page',pretty:false,active:true,watch:['total > 50','cart.items.length'],editing:null,
 open(f,line){if(SNIPPETS[f]){SRC.cur=f}else if(!SRC.files[f])return;SRC.cur=f;if(!SRC.openTabs.includes(f))SRC.openTabs.push(f);setPanel('sources');SRC.render();if(line)setTimeout(()=>{const r=$(`#code .ln[data-l="${line}"]`);if(r){const c=$('#code');c.scrollTop=r.offsetTop-c.clientHeight/3;r.style.transition='none';r.style.background='rgba(255,229,153,.25)';setTimeout(()=>{r.style.transition='background 1.2s';r.style.background=''},60)}},30);track('open-source')}};
function hlJS(s){return esc(s).replace(/(\/\/.*$|\/\*\*?.*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|\b(import|from|export|function|let|const|var|for|of|if|else|return|async|await|new|typeof|this|true|false|null|undefined|in)\b|\b(\d+(?:\.\d+)?)\b/g,(m,c,s1,k,n)=>c?`<span style="color:var(--com);font-style:italic">${c}</span>`:s1?`<span style="color:var(--str)">${s1}</span>`:k?`<span style="color:var(--kw)">${k}</span>`:`<span style="color:var(--num)">${n}</span>`)}
function hlCSS(s){return esc(s).replace(/(\/\*.*?\*\/)|^(\s*)([^:{}]+?)(\s*\{)$|^(\s*)([\w-]+)(:)(.*)$/,(m,c,a,sel,b,i2,p,col,v)=>c?`<span style="color:var(--com)">${c}</span>`:sel?`${a}<span style="color:#E3E3E3">${sel}</span>${b}`:`${i2}<span style="color:var(--pn)">${p}</span>${col}<span style="color:#F29766">${v}</span>`)}
function hlHTML(s){return esc(s).replace(/(&lt;!--.*?--&gt;)|(&lt;\/?)([\w!-]+)|([\w-]+)=(&quot;[^&]*&quot;|"[^"]*")/g,(m,c,lt,tag,an,av)=>c?`<span style="color:var(--com)">${c}</span>`:tag?`${lt}<span style="color:var(--tag)">${tag}</span>`:`<span style="color:var(--an)">${an}</span>=<span style="color:var(--av)">${av}</span>`)}

function buildSources(p){p.innerHTML=`<div class="split" style="flex:1;min-height:0">
 <div class="nav" data-hs="src-nav"><div class="subt" id="srcNavT">${[['page','Page'],['ws','Workspace'],['ov','Overrides'],['snip','Snippets']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='page'}">${l}</button>`).join('')}</div><div class="ftree scroll" id="ftree" style="flex:1"></div></div>
 <div class="ed" data-hs="src-editor"><div class="edtabs" id="edtabs"></div><div class="code scroll" id="code" tabindex="0"></div><div class="tb" id="edfoot" style="border-top:1px solid var(--dtl);border-bottom:0"></div></div>
 <div class="dbg" data-hs="src-debugger"><div class="dbgb" data-hs="src-controls"><button id="dResume" title="Resume (F8)">${IC.resume}</button><button id="dOver" title="Step over (F10)">${IC.over}</button><button id="dInto" title="Step into (F11)">${IC.into}</button><button id="dOut" title="Step out (Shift+F11)">${IC.out}</button><button id="dStep" title="Step (F9)">${IC.step}</button><span style="width:1px;height:16px;background:var(--dtl);margin:0 4px"></span><button id="dDeact" title="Deactivate breakpoints">${IC.deact}</button></div>
  <div id="dbgBody" class="scroll" style="flex:1"></div></div></div>`;
 $('#srcNavT').onclick=e=>{const b=e.target.closest('button');if(!b)return;SRC.nav=b.dataset.k;$$('#srcNavT button').forEach(x=>x.setAttribute('aria-selected',x===b));renderNav()};
 $('#ftree').onclick=e=>{const b=e.target.closest('[data-f]');if(b)SRC.open(b.dataset.f);const n=e.target.closest('[data-new]');if(n){const name=`snippet-${Object.keys(SNIPPETS).length+1}.js`;SNIPPETS[name]='// New snippet\n';SRC.open(name);renderNav()}};
 $('#dResume').onclick=()=>DBG.cmd('resume');$('#dOver').onclick=()=>DBG.cmd('over');$('#dInto').onclick=()=>DBG.cmd('into');$('#dOut').onclick=()=>DBG.cmd('out');$('#dStep').onclick=()=>DBG.cmd('into');
 $('#dDeact').onclick=()=>{SRC.active=!SRC.active;$('#dDeact').style.color=SRC.active?'':'#8AB4F8';toast(SRC.active?'Breakpoints active':'Breakpoints deactivated — nothing will pause');SRC.render()};
 const code=$('#code');
 code.addEventListener('click',e=>{const g=e.target.closest('.g');if(!g)return;const ln=+g.parentNode.dataset.l;toggleBp(SRC.cur,ln)});
 code.addEventListener('contextmenu',e=>{const g=e.target.closest('.g');if(!g)return;e.preventDefault();const ln=+g.parentNode.dataset.l;const k=SRC.cur+':'+ln;const bp=SRC.bps.get(k);if(SRC.files[SRC.cur]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}
  openMenu(e.clientX,e.clientY,bp?[{label:'Edit breakpoint…',act:()=>{SRC.editing={line:ln,type:bp.type==='log'?'log':'cond'};SRC.render()}},{label:bp.enabled?'Disable breakpoint':'Enable breakpoint',act:()=>{bp.enabled=!bp.enabled;SRC.render()}},{label:'Remove breakpoint',act:()=>{SRC.bps.delete(k);SRC.render()}}]:
   [{label:'Add breakpoint',act:()=>toggleBp(SRC.cur,ln)},{label:'Add conditional breakpoint…',act:()=>{SRC.editing={line:ln,type:'cond'};SRC.render()}},{label:'Add logpoint…',act:()=>{SRC.editing={line:ln,type:'log'};SRC.render()}},'-',{label:'Never pause here',act:()=>{SRC.bps.set(k,{file:SRC.cur,line:ln,type:'cond',expr:'false',enabled:true});SRC.render()}}])});
 SRC.render()}
function toggleBp(f,ln){if(SRC.files[f]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}const k=f+':'+ln;if(SRC.bps.has(k))SRC.bps.delete(k);else{SRC.bps.set(k,{file:f,line:ln,type:'bp',enabled:true});track('set-bp')}SRC.render()}
function renderNav(){const t=$('#ftree');if(!t)return;const it=(d,label,f,ic)=>`<button style="--d:${d}" ${f?`data-f="${f}"`:''} class="${f&&f===SRC.cur?'on':''}">${ic}${label}</button>`;const fi=c=>`<i class="fi" style="background:${c}"></i>`;
 if(SRC.nav==='page')t.innerHTML=it(0,'▾ top','',fi('#9AA0A6'))+it(1,'▾ driftwood.coffee','',fi('#9AA0A6'))+it(2,'▾ css','',fi('#C9A15A'))+it(3,'app.css','app.css',fi('#6FA8DC'))+it(2,'▾ js','',fi('#C9A15A'))+it(3,'app.js','app.js',fi('#E8C547'))+it(3,'cart.js','cart.js',fi('#E8C547'))+it(3,'vendor.min.js','vendor.min.js',fi('#E8C547'))+it(2,'▸ img','',fi('#C9A15A'))+it(2,'(index)','(index)',fi('#9AA0A6'))+it(1,'▸ fonts.gstatic.com','',fi('#9AA0A6'));
 else if(SRC.nav==='snip')t.innerHTML=Object.keys(SNIPPETS).map(n=>it(0,n,n,fi('#E8C547'))).join('')+`<button style="--d:0;color:#8AB4F8" data-new="1">+ New snippet</button>`;
 else if(SRC.nav==='ov')t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Overrides let you edit a response (HTML, CSS, JS, even headers) and keep the edit across reloads. Pick a local folder and DevTools serves your copy instead of the network one.<br><br><button class="btns">Select folder for overrides</button><br><br><span style="color:#9AA0A6">Network ▸ right-click a request ▸ <b>Override content</b> does the same.</span></div>`;
 else t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Workspace maps a folder on disk to the site so edits made in DevTools save straight to your source files.<br><br><button class="btns">+ Add folder</button></div>`}
SRC.render=function(){if(!P.sources.built)return;renderNav();const f=SRC.cur;const isSnip=!!SNIPPETS[f];
 $('#edtabs').innerHTML=SRC.openTabs.concat(isSnip&&!SRC.openTabs.includes(f)?[f]:[]).map(n=>`<span class="${n===f?'on':''}" data-t="${esc(n)}">${esc(n)}${n==='vendor.min.js'&&SRC.pretty?':formatted':''} <b data-x="${esc(n)}" style="cursor:pointer;opacity:.6">×</b></span>`).join('');
 $$('#edtabs [data-t]').forEach(s=>s.onclick=e=>{if(e.target.dataset.x){SRC.openTabs=SRC.openTabs.filter(x=>x!==e.target.dataset.x);if(SRC.cur===e.target.dataset.x)SRC.cur=SRC.openTabs[0]||'cart.js';SRC.render();return}SRC.cur=s.dataset.t;SRC.render()});
 const code=$('#code');
 if(isSnip){code.innerHTML=`<textarea id="snipTa" spellcheck="false" style="width:100%;height:100%;min-height:260px;background:transparent;border:0;outline:none;color:#E3E3E3;font:400 12.5px/20px var(--mono);padding:4px 12px;resize:none"></textarea>`;const ta=$('#snipTa');ta.value=SNIPPETS[f];ta.oninput=()=>SNIPPETS[f]=ta.value;ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runSnippet(f)}};
  $('#edfoot').innerHTML=`<button class="btnp" id="runSnip">${IC.play} Run</button><span style="color:#9AA0A6">Ctrl+Enter · output goes to the Console</span>`;$('#runSnip').onclick=()=>runSnippet(f);renderDbg();return}
 const F=SRC.files[f];const lines=F.text().split('\n');const paused=DBG.state&&DBG.state.file===f?DBG.state:null;const cov=ST.coverage&&ST.coverage[f];
 code.innerHTML=lines.map((l,i)=>{const n=i+1;const bp=SRC.bps.get(f+':'+n);const cls=bp?`bp${bp.type==='cond'?' cond':bp.type==='log'?' log':''}${!bp.enabled||!SRC.active?' dis':''}`:'';
  const inl=paused&&paused.inline&&paused.inline[n]?`<span class="inl">${esc(paused.inline[n])}</span>`:'';const cv=cov?`<i class="cov" style="background:${cov[i]?'#4FA3F7':'#E46962'}"></i>`:'';
  const hl=F.kind==='js'?hlJS(l):F.kind==='css'?hlCSS(l):hlHTML(l);
  let edit='';if(SRC.editing&&SRC.editing.line===n){const ex=bp&&bp.expr||'';edit=`<div class="bpedit ${SRC.editing.type==='log'?'log':''}">${SRC.editing.type==='log'?'Logpoint — log a message when this line runs (e.g. <code>\'total\', total</code>)':'Conditional breakpoint — pause only when this is true'}<input id="bpInput" value="${esc(ex)}" placeholder="${SRC.editing.type==='log'?"'total is', total":'total > 100'}"></div>`}
  return `<div class="ln${paused&&paused.line===n?' cur':''}" data-l="${n}"><span class="g ${cls}">${n}</span>${cv}<span class="t">${hl||' '}${inl}</span></div>${edit}`}).join('');
 const bi=$('#bpInput');if(bi){bi.focus();bi.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=bi.value.trim();const k=f+':'+SRC.editing.line;if(v)SRC.bps.set(k,{file:f,line:SRC.editing.line,type:SRC.editing.type,expr:v,enabled:true});track(SRC.editing.type==='log'?'logpoint':'cond-bp');SRC.editing=null;SRC.render()}if(e.key==='Escape'){SRC.editing=null;SRC.render()}};bi.onblur=()=>{if(SRC.editing){SRC.editing=null;SRC.render()}}}
 const minified=f==='vendor.min.js';$('#edfoot').innerHTML=`<button class="tbb" id="pp" title="Pretty print" aria-pressed="${SRC.pretty}" style="font:600 13px var(--mono)">{ }</button><span style="color:#9AA0A6">${minified&&!SRC.pretty?'Minified file — click { } to pretty-print':F.kind==='js'?'Click a line number to add a breakpoint · right-click for conditional / logpoint':F.kind==='css'?(ST.changes.length?'Modified by your Styles edits':'Edits made in the Styles pane show up here'):'The HTML the server sent, before JavaScript ran'}</span>${cov?'<span style="margin-left:auto;color:#E46962">■ unused</span><span style="color:#4FA3F7">■ used</span>':''}`;
 $('#pp').onclick=()=>{if(f!=='vendor.min.js'){toast('Only minified files need pretty-printing');return}SRC.pretty=!SRC.pretty;SRC.render();track('pretty-print')};
 if(paused){const r=$(`#code .ln[data-l="${paused.line}"]`);if(r){const c=$('#code');if(r.offsetTop<c.scrollTop||r.offsetTop>c.scrollTop+c.clientHeight-40)c.scrollTop=r.offsetTop-c.clientHeight/3}}
 renderDbg()};
function runSnippet(f){CON.add({type:'input',args:[`// ${f}`]});try{const r=EVAL_OK?runCode(SNIPPETS[f]):undefined;if(!EVAL_OK)throw new EvalError('eval is blocked here');CON.add({type:'result',args:[r]})}catch(e){CON.add({type:'error',args:[`Uncaught ${e.name}: ${e.message}`],src:f})}ST.drawer=true;ST.drawerTab='console';renderDrawer();track('snippet')}
function evalIn(expr,scope){try{if(!EVAL_OK){if(expr in scope)return scope[expr];const m=expr.match(/^([\w$.]+)\s*(>|<|>=|<=|===|==)\s*([\d.]+)$/);if(m){const a=m[1].split('.').reduce((o,k)=>o&&o[k],scope);return eval2(a,m[2],+m[3])}return undefined}
 const ks=Object.keys(scope);return new Function(...ks,'cart','$0',`return (${expr})`)(...ks.map(k=>scope[k]),cart,ST.sel)}catch(e){return e}}
function eval2(a,op,b){return op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:op==='<='?a<=b:a==b}
function renderDbg(){const b=$('#dbgBody');if(!b)return;const s=DBG.state;
 const bps=[...SRC.bps.values()];const scope=s?s.scope:null;
 b.innerHTML=(s?`<div class="pausemsg">⏸ ${esc(s.reason)}</div>`:'')+
 `<div class="pane" data-hs="src-watch"><h4>Watch <span style="float:right;color:#8AB4F8" id="addWatch">+</span></h4><div class="pb">${SRC.watch.map((w,i)=>{const v=s?evalIn(w,{...s.scope}):undefined;return`<div><span style="color:#E3E3E3">${esc(w)}</span>: ${s?(v instanceof Error?`<span class="muted">&lt;not available&gt;</span>`:prevShort(v)):'<span class="muted">&lt;not available&gt;</span>'} <b data-wx="${i}" style="float:right;cursor:pointer;color:#9AA0A6">×</b></div>`}).join('')}<div id="watchIn"></div></div></div>
 <div class="pane" data-hs="src-bps"><h4>Breakpoints</h4><div class="pb">${bps.length?bps.map(bp=>`<div style="color:${bp.type==='cond'?'#FCAD70':bp.type==='log'?'#FF7FC4':'#E3E3E3'}"><label class="ck"><input type="checkbox" data-bpk="${bp.file}:${bp.line}" ${bp.enabled?'checked':''}>${bp.file}:${bp.line}</label> <span class="muted" style="font-style:normal!important">${bp.expr?esc(bp.expr):esc((SRC.files[bp.file].text().split('\n')[bp.line-1]||'').trim().slice(0,28))}</span></div>`).join(''):'<div class="muted">No breakpoints</div>'}
  ${[...EL.domBps].filter(([n,t])=>t.size).map(([n,t])=>`<div style="color:#C792EA">DOM · ${esc(nodeLabel(n))} · ${[...t].join(', ')}</div>`).join('')}</div></div>
 <div class="pane" data-hs="src-scope"><h4>Scope</h4><div class="pb">${scope?`<div style="color:#9AA0A6">▾ Local</div>${Object.entries(scope).map(([k,v])=>`<div style="padding-left:22px"><span style="color:#E3A7FF">${esc(k)}</span>: ${prevShort(v)}</div>`).join('')}<div style="color:#9AA0A6">▸ Module <span class="muted" style="font-style:normal!important">cart, api, products</span></div><div style="color:#9AA0A6">▸ Global <span style="float:right" class="muted">Window</span></div>`:'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane" data-hs="src-stack"><h4>Call Stack</h4><div class="pb">${s?s.stack.map((fr,i)=>`<div style="${i===0?'background:var(--dsel)':''}"><span style="color:#E3E3E3">${i===0?'▸ ':'&nbsp; '}${esc(fr[0])}</span><span style="float:right;color:#9AA0A6">${esc(fr[1])}</span></div>`).join('')+'<div class="muted">— async: click —</div>':'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane"><h4>XHR/fetch Breakpoints</h4><div class="pb"><div class="muted">Pause when a URL contains…</div></div></div>
 <div class="pane"><h4>Event Listener Breakpoints</h4><div class="pb"><div class="muted">▸ Mouse · Keyboard · Timer · XHR…</div></div></div>`;
 ['dResume','dOver','dInto','dOut','dStep'].forEach(id=>$('#'+id).disabled=!s);
 $$('[data-bpk]',b).forEach(c=>c.onchange=()=>{SRC.bps.get(c.dataset.bpk).enabled=c.checked;SRC.render()});
 $$('[data-wx]',b).forEach(x=>x.onclick=()=>{SRC.watch.splice(+x.dataset.wx,1);renderDbg()});
 $('#addWatch',b).onclick=e=>{e.stopPropagation();const w=$('#watchIn',b);w.innerHTML='<input class="inp" style="width:100%" placeholder="Expression, e.g. item.qty">';const i=$('input',w);i.focus();i.onkeydown=ev=>{ev.stopPropagation();if(ev.key==='Enter'&&i.value.trim()){SRC.watch.push(i.value.trim());track('watch');renderDbg()}if(ev.key==='Escape')renderDbg()}}}

/* ---------- execution trace + stepping ---------- */
const DBG={state:null,resolve:null,trace:null,i:0,
 build(c){const items=c.items.map(x=>({...x}));const T=[];const fr=(fn,ln)=>[fn,'cart.js:'+ln];
  const S=(line,depth,scope,inline)=>T.push({file:'cart.js',line,depth,scope,inline,stack:depth?[fr('calcTotal',line),fr('checkout',35),['(anonymous)','cart.js:44']]:[fr('checkout',line),['(anonymous)','cart.js:44']]});
  S(35,0,{cart:c,total:undefined},{});let total=0;S(9,1,{items,total:undefined},{8:`items = Array(${items.length})`});
  for(const item of items){S(10,1,{items,total,item},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});S(11,1,{items,total,item,line:undefined},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});const line=item.price*item.qty;S(12,1,{items,total,item,line},{9:`total = ${total}`,11:`line = ${line}`});total+=line}
  S(14,1,{items,total},{9:`total = ${total}`});if(total>100)total*=0.9;S(15,1,{items,total},{14:`total = ${round(total)}`});const res=round(total);S(36,0,{cart:c,total:res},{35:`total = ${res}`});this.result=res;return T},
 async run(c){this.trace=this.build(c);this.i=-1;return new Promise(res=>{this.resolve=res;this.advance(t=>this.hitBp(t))})},
 hitBp(step){const bp=SRC.bps.get(step.file+':'+step.line);if(!bp||!bp.enabled||!SRC.active)return false;if(bp.type==='log'){const v=evalIn(`[${bp.expr}]`,step.scope);withSrc(`cart.js:${step.line}`,()=>pageConsole.log(...(Array.isArray(v)?v:[v])));track('logpoint-hit');return false}if(bp.type==='cond'){const v=evalIn(bp.expr,step.scope);return v===true||(v&&!(v instanceof Error))}return true},
 advance(stop){while(++this.i<this.trace.length){const st=this.trace[this.i];const isStop=stop(st);if(isStop){const bp=SRC.bps.get(st.file+':'+st.line);this.pause(st,bp&&bp.enabled&&SRC.active&&bp.type!=='log'?'Paused on breakpoint':'Debugger paused');return}}
  this.finish()},
 pause(st,reason){this.state={...st,reason};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur=st.file;if(!SRC.openTabs.includes(st.file))SRC.openTabs.push(st.file);SRC.render();showPauseBar(true);track('paused')},
 finish(){this.state=null;showPauseBar(false);SRC.render();const r=this.resolve;this.resolve=null;if(r)r(this.result)},
 cmd(k){if(!this.state)return;if(this.state.dom){this.state=null;showPauseBar(false);SRC.render();return}const d=this.state.depth;this.state=null;
  const f={resume:st=>this.hitBp(st),over:st=>st.depth<=d||this.hitBp(st),into:()=>true,out:st=>st.depth<d||this.hitBp(st)}[k];
  if(k!=='resume')track('step');this.advance(f)},
 pauseDom({node,type}){if(this.state)return;this.state={file:'cart.js',line:30,depth:0,dom:true,scope:{n:cart.items.reduce((a,i)=>a+i.qty,0)},inline:{},reason:`Paused on ${type}: ${nodeLabel(node)}`,stack:[['renderCart','cart.js:30'],['addToCart','cart.js:25'],['(anonymous)','cart.js:42']]};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur='cart.js';SRC.render();showPauseBar(true);track('dom-bp-hit')}};
function showPauseBar(on){$$('.pausebar,.pausedim').forEach(x=>x.remove());if(!on)return;const pa=$('#pagearea');pa.appendChild(h('<div class="pausedim"></div>'));const bar=h(`<div class="pausebar">Paused in debugger <button title="Resume (F8)">${IC.resume}</button><button title="Step over (F10)">${IC.over}</button></div>`);const [r,o]=$$('button',bar);r.onclick=()=>DBG.cmd('resume');o.onclick=()=>DBG.cmd('over');pa.appendChild(bar)}

/* ================= Network ================= */
const NW={type:'All',filter:'',invert:false,sel:null,tab:'headers',rec:true,raf:0,shiftRow:null};
const NCHIPS=['All','Fetch/XHR','Doc','CSS','JS','Font','Img','Media','Manifest','WS','Wasm','Other'];
function buildNetwork(p){p.innerHTML=`<div class="tb" data-hs="net-tb"><button class="tbb rec" id="nRec" aria-pressed="true" title="Stop recording network log">${IC.rec}</button><button class="tbb" id="nClear" title="Clear network log">${IC.clear}</button><span class="sep"></span>
 <label class="ck" data-hs="net-preserve"><input type="checkbox" id="nPreserve">Preserve log</label><label class="ck"><input type="checkbox" id="nCache" checked>Disable cache</label>
 <select class="inp" id="nThrottle" data-hs="net-throttle" title="Throttling">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><span class="sep"></span>
 <button class="tbb" id="nHar" title="Export HAR (copies JSON)">${IC.dl}</button><button class="tbb" id="nReload" title="Reload page and record">${IC.reload} Reload</button></div>
 <div class="tb" data-hs="net-filter"><input class="inp" id="nFilter" placeholder="Filter (try: -analytics, status-code:500, method:POST)" style="width:260px"><label class="ck"><input type="checkbox" id="nInvert">Invert</label><span class="sep"></span><div class="chipset" id="nChips">${NCHIPS.map(c=>`<button aria-pressed="${c==='All'}" data-c="${c}">${c}</button>`).join('')}</div></div>
 <div class="nov" id="nOv" data-hs="net-overview"></div>
 <div class="nwrap"><div class="ntable"><div class="scroll" id="nScroll" style="flex:1" data-hs="net-table"><div class="nr h"><span>Name</span><span>Status</span><span>Type</span><span>Initiator</span><span>Size</span><span>Time</span><span data-hs="net-waterfall">Waterfall</span></div><div id="nRows"></div></div></div><div class="ndet" id="nDet" hidden data-hs="net-details"></div></div>
 <div class="nstatus" id="nStat" data-hs="net-status"></div>`;
 $('#nRec').onclick=e=>{NW.rec=!NW.rec;ST.recordingNet=NW.rec;e.currentTarget.setAttribute('aria-pressed',NW.rec);toast(NW.rec?'Recording network activity':'Recording stopped — new requests are not logged')};
 $('#nClear').onclick=()=>{NET.entries=[];NW.sel=null;$('#nDet').hidden=true;renderNet()};
 $('#nPreserve').onchange=e=>{ST.preserve=e.target.checked;track('preserve-log')};$('#nCache').onchange=e=>{ST.disableCache=e.target.checked;toast(ST.disableCache?'Cache disabled while DevTools is open':'Cache enabled — reload twice to see (memory cache)');track('cache')};
 $('#nThrottle').onchange=e=>{ST.throttle=e.target.value;toast(`${THROTTLE[ST.throttle].label} — reload to feel it`);track('throttle');syncThrottle()};
 $('#nReload').onclick=reloadPage;$('#nHar').onclick=()=>{copyText(JSON.stringify({log:{version:'1.2',creator:{name:'WebInspector',version:'537.36'},entries:NET.entries.map(e=>({startedDateTime:new Date().toISOString(),time:e.dur,request:{method:e.method,url:e.url},response:{status:e.status,statusText:e.statusText,content:{size:e.size,mimeType:e.mime}},timings:e.phases}))}},null,2));track('har')};
 $('#nFilter').oninput=e=>{NW.filter=e.target.value;renderNet();track('net-filter')};$('#nInvert').onchange=e=>{NW.invert=e.target.checked;renderNet()};
 $('#nChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;NW.type=b.dataset.c;$$('#nChips button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderNet();track('net-type')};
 const rows=$('#nRows');
 rows.onclick=e=>{const r=e.target.closest('.nr');if(!r)return;if(e.target.classList.contains('init')){const [f,l]=e.target.textContent.split(':');if(SRC.files[f])SRC.open(f,+l||1);return}NW.sel=+r.dataset.id;NW.tab=NW.tab||'headers';renderNet();renderDet();track('net-detail')};
 rows.oncontextmenu=e=>{const r=e.target.closest('.nr');if(!r)return;e.preventDefault();const en=NET.entries.find(x=>x.id===+r.dataset.id);if(!en)return;const bl=ST.blocked.has(en.name);
  openMenu(e.clientX,e.clientY,[{label:'Open in new tab'},{label:'Open in Sources panel',act:()=>{const f=en.name==='shop'?'(index)':en.name;if(SRC.files[f])SRC.open(f,1);else toast('Not a source file')}},'-',{label:'Clear browser cache',act:()=>toast('Browser cache cleared')},'-',
   {label:'Copy URL',act:()=>copyText(en.url)},{label:'Copy as cURL (bash)',act:()=>{copyText(curlOf(en));track('copy-curl')}},{label:'Copy as fetch',act:()=>{copyText(`fetch("${en.url}", {\n  "headers": { "accept": "*/*" },\n  "method": "${en.method}"${en.reqBody?`,\n  "body": ${JSON.stringify(en.reqBody)}`:''}\n});`);track('copy-curl')}},{label:'Copy response',act:()=>copyText(en.resBody||'')},'-',
   {label:bl?`Unblock ${en.name}`:'Block request URL',act:()=>{if(bl)ST.blocked.delete(en.name);else ST.blocked.add(en.name);toast(bl?'Unblocked':`Blocked ${en.name} — reload to see the page without it`);track('block');renderNet()}},...(en.type==='fetch'?[{label:'Replay XHR',act:()=>{simFetch(en.path,{method:en.method,body:en.reqBody,initiator:en.initiator});track('replay')}}]:[]),{label:'Override content',act:()=>toast('Pick an overrides folder first (Sources ▸ Overrides)')},'-',{label:'Save all as HAR with content',act:()=>$('#nHar').click()}])};
 rows.addEventListener('mousemove',e=>{const r=e.target.closest('.nr');const id=e.shiftKey&&r?+r.dataset.id:null;if(id!==NW.shiftRow){NW.shiftRow=id;renderNet()}});rows.addEventListener('mouseleave',()=>{if(NW.shiftRow){NW.shiftRow=null;renderNet()}});
 NET.listeners.push(()=>loopNet());renderNet()}
function syncThrottle(){$$('#nThrottle,#devThrottle').forEach(s=>s.value=ST.throttle)}
function curlOf(e){return `curl '${e.url}' \\\n  -H 'accept: */*' \\\n  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0' ${e.method!=='GET'?`\\\n  -X ${e.method} `:''}${e.reqBody?`\\\n  --data-raw '${e.reqBody}' `:''}`}
function loopNet(){cancelAnimationFrame(NW.raf);const step=()=>{renderNet();const busy=NET.entries.some(e=>now()<e.t0+e.dur+30);if(busy)NW.raf=requestAnimationFrame(step)};step()}
function netVisible(e){if(now()<e.t0)return false;let ok=NW.type==='All'||(TYPEGROUP[e.type]||'Other')===NW.type;const f=NW.filter.trim();if(f){ok=ok&&f.split(/\s+/).every(t=>{let neg=false;if(t.startsWith('-')){neg=true;t=t.slice(1)}let m;
  if((m=t.match(/^status-code:(\d+)/)))return (String(e.status)===m[1])!==neg;if((m=t.match(/^method:(\w+)/i)))return (e.method===m[1].toUpperCase())!==neg;if((m=t.match(/^larger-than:(\d+)(k?)/i)))return (e.size>(+m[1]*(m[2]?1000:1)))!==neg;if((m=t.match(/^domain:(.+)/)))return e.url.includes(m[1])!==neg;
  return e.url.toLowerCase().includes(t.toLowerCase())!==neg});if(NW.invert)ok=!ok}return ok}
function renderNet(){if(!P.network.built)return;const rows=$('#nRows');const list=NET.entries.filter(netVisible);const tnow=now();
 const endOf=e=>e.start+Math.min(e.dur,Math.max(0,tnow-e.t0));const span=Math.max(2000*(THROTTLE[ST.throttle].k>2?2:1),...NET.entries.map(e=>e.start+e.dur))*1.06;
 const wfW=Math.max(120,(rows.querySelector('.wf')||{clientWidth:0}).clientWidth||$('#nScroll').clientWidth*0.3);
 const sh=NW.shiftRow?NET.entries.find(x=>x.id===NW.shiftRow):null;
 rows.innerHTML=list.map(e=>{const el=Math.max(0,tnow-e.t0);const done=el>=e.dur;const dur=Math.min(el,e.dur);
  const px=v=>v/span*wfW;let x=px(e.start);let segs='';const ph=e.phases;const col={queue:'#9AA0A6',dns:'#26A69A',connect:'#F6B26B',ssl:'#B388FF',ttfb:'#81C995',download:'#4FA3F7'};let acc=0;
  if(!e.failed)for(const [k,v] of Object.entries(ph)){const vis=Math.max(0,Math.min(v,dur-acc));if(vis<=0)break;const w=Math.max(1,px(vis));segs+=`<i style="left:${x}px;width:${w}px;background:${col[k]}"></i>`;x+=w;acc+=v}else segs=`<i style="left:${x}px;width:2px;background:#F28B82"></i>`;
  let shade='';if(sh&&sh!==e){const base=(e.initiator||'').split(':')[0];if(sh.initiator&&sh.initiator.split(':')[0]===e.name)shade='background:rgba(129,201,149,.25)';else if(base===sh.name)shade='background:rgba(242,139,130,.22)'}
  const status=!done?'(pending)':e.blocked?'(blocked:devtools)':e.failed?'(failed)':e.status;const size=!done?'':e.failed?'0 B':e.fromCache?'(memory cache)':fmtBytes(e.transferred);
  return `<div class="nr${e.status>=400||e.failed?' bad':''}${NW.sel===e.id?' sel':''}" data-id="${e.id}" style="${shade}"><span title="${esc(e.url)}">${esc(e.name)}</span><span>${status}</span><span>${e.type}</span><span><span class="init">${esc(e.initiator)}</span></span><span>${size}</span><span>${done?fmtMs(e.dur):fmtMs(dur)}</span><span class="wf">${segs}</span></div>`}).join('');
 const ov=$('#nOv');const OW=ov.clientWidth||600;let o='';const vis=NET.entries.filter(e=>tnow>=e.t0);
 [0,1,2,3,4,5,6,7,8].forEach(i=>{const t=i*span/8;o+=`<span style="position:absolute;left:${t/span*OW+3}px;top:2px;font:400 10px var(--body);color:#6E7379">${fmtMs(t)}</span><i style="position:absolute;left:${t/span*OW}px;top:0;bottom:0;border-left:1px solid #2C2E33"></i>`});
 vis.forEach((e,i)=>{o+=`<i style="position:absolute;top:${16+(i%9)*3}px;height:2px;left:${e.start/span*OW}px;width:${Math.max(2,Math.min(e.dur,tnow-e.t0)/span*OW)}px;background:${e.failed||e.status>=400?'#F28B82':'#4FA3F7'}"></i>`});
 if(NET.navStart&&vis.length){o+=`<i style="position:absolute;left:${NET.dcl/span*OW}px;top:0;bottom:0;border-left:2px solid #8AB4F8"></i><i style="position:absolute;left:${NET.load/span*OW}px;top:0;bottom:0;border-left:2px solid #F28B82"></i>`}ov.innerHTML=o;
 const all=NET.entries.filter(e=>tnow>=e.t0);const fin=Math.max(0,...all.map(e=>e.start+Math.min(e.dur,tnow-e.t0)));
 $('#nStat').innerHTML=`${list.length} / ${all.length} requests │ ${fmtBytes(all.reduce((a,e)=>a+(e.failed?0:e.transferred),0))} transferred │ ${fmtBytes(all.reduce((a,e)=>a+(e.failed?0:e.size),0))} resources │ Finish: ${fmtMs(fin)} │ <span class="dcl">DOMContentLoaded: ${fmtMs(NET.dcl)}</span> │ <span class="ld">Load: ${fmtMs(NET.load)}</span>`;
 if(NW.sel&&!$('#nDet').hidden&&NW._detFor!==NW.sel)renderDet()}
function renderDet(){const d=$('#nDet');const e=NET.entries.find(x=>x.id===NW.sel);if(!e){d.hidden=true;return}d.hidden=false;NW._detFor=e.id;
 const tabs=[['headers','Headers'],...(e.reqBody?[['payload','Payload']]:[]),['preview','Preview'],['response','Response'],['initiator','Initiator'],['timing','Timing'],...(e.type==='document'?[['cookies','Cookies']]:[])];if(!tabs.find(t=>t[0]===NW.tab))NW.tab='headers';
 let body='';const H=(k,v)=>`<div><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`;
 if(NW.tab==='headers')body=`<div class="hdr"><h5>General</h5>${H('Request URL',e.url)}${H('Request Method',e.method)}<div><span class="k">Status Code</span><span class="v"><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${e.status>=400||e.failed?'#F28B82':'#81C995'};margin-right:6px"></i>${e.failed?e.statusText:e.status+' '+e.statusText}</span></div>${H('Remote Address','104.18.22.7:443')}${H('Referrer Policy','strict-origin-when-cross-origin')}
  <h5>Response Headers</h5>${H('content-type',e.mime)}${H('cache-control',e.type==='fetch'?'no-store':'public, max-age=31536000, immutable')}${H('content-length',String(e.size))}${H('server','cloudflare')}${e.type==='fetch'?H('x-request-id','7f3a9c2e-51b0'):''}${e.fromCache?H('(from memory cache)','served without a network round-trip'):''}
  <h5>Request Headers</h5>${H(':authority','driftwood.coffee')}${H(':method',e.method)}${H(':path',e.path)}${H('accept',e.type==='document'?'text/html,application/xhtml+xml':'*/*')}${H('cookie','session=8f2c1d…; cart_id=c_20931; _ga=GA1.1…')}${H('user-agent','Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0 Safari/537.36')}</div>`;
 else if(NW.tab==='payload')body=`<div class="hdr"><h5>Request Payload</h5></div><div class="pre">${esc(e.reqBody)}</div>`;
 else if(NW.tab==='preview'){if(/image/.test(e.mime))body=`<div style="padding:20px;display:flex;flex-direction:column;align-items:center;gap:10px;font:400 12px var(--body);color:#9AA0A6"><div style="width:220px;height:150px;border-radius:6px;background:${e.name.startsWith('guji')?PRODUCTS[0].art:e.name.startsWith('huila')?PRODUCTS[1].art:e.name.startsWith('nyeri')?PRODUCTS[2].art:'linear-gradient(135deg,#C8553D,#F28F3B 55%,#FFD6A5)'}"></div>${e.name} · 1200 × 900 · ${fmtBytes(e.size)} · ${e.mime}</div>`;
  else if(e.resBody){body='<div class="pre" id="prevTree"></div>'}else body=`<div class="pre" style="color:#9AA0A6">${e.type==='document'?'Rendered HTML preview':'No preview available for this resource type'}</div>`}
 else if(NW.tab==='response')body=`<div class="pre">${esc(e.resBody||(e.name==='shop'?INDEX_HTML:e.name==='app.css'?cssText():e.name==='app.js'?APP_JS:e.name==='cart.js'?CART_JS:e.name==='vendor.min.js'?VENDOR_MIN:'(binary data)'))}</div>`;
 else if(NW.tab==='initiator')body=`<div class="hdr"><h5>Request call stack</h5>${e.type==='fetch'?`<div class="v">checkout @ <a href="#" data-src="cart.js:36">cart.js:36</a></div><div class="v">(anonymous) @ cart.js:44</div>`:`<div class="v">${esc(e.initiator)}</div>`}<h5>Request initiator chain</h5><div class="v">https://driftwood.coffee/shop</div>${e.initiator!=='Other'&&e.initiator!=='shop'?`<div class="v" style="padding-left:14px">↳ ${esc(e.initiator.split(':')[0])}</div>`:''}<div class="v" style="padding-left:${e.initiator!=='Other'&&e.initiator!=='shop'?28:14}px">↳ ${esc(e.name)}</div></div>`;
 else if(NW.tab==='timing'){const ph=e.phases;const tot=e.dur;const lab={queue:'Queueing',dns:'DNS Lookup',connect:'Initial connection',ssl:'SSL',ttfb:'Waiting for server response',download:'Content Download'};const col={queue:'#9AA0A6',dns:'#26A69A',connect:'#F6B26B',ssl:'#B388FF',ttfb:'#81C995',download:'#4FA3F7'};let acc=0;
  body=`<div class="timing"><div style="color:#9AA0A6;grid-template-columns:1fr">Queued at ${fmtMs(e.start)} · Started at ${fmtMs(e.start+ph.queue)}</div>${Object.entries(ph).map(([k,v])=>{const l=acc/tot*100;acc+=v;return `<div><span>${lab[k]}</span><span style="position:relative;height:9px"><i style="position:absolute;left:${l}%;width:${Math.max(.8,v/tot*100)}%;background:${col[k]}"></i></span><span class="mono" style="text-align:right">${v.toFixed(2)} ms</span></div>`}).join('')}<div style="border-top:1px solid var(--dtl);margin-top:6px;padding-top:4px"><b>Total</b><span></span><b class="mono" style="text-align:right">${tot.toFixed(2)} ms</b></div><p style="color:#9AA0A6;margin:10px 0 0;line-height:1.5">Waiting for server response is Time To First Byte (TTFB). A long bar here means the server, not the network, is slow.</p></div>`}
 else if(NW.tab==='cookies')body=`<table class="tbl"><thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th></tr></thead><tbody>${COOKIES.map(c=>`<tr><td>${esc(c.name)}</td><td class="m">${esc(c.value)}</td><td>${c.domain}</td><td>${c.httpOnly?'✓':''}</td><td>${c.secure?'✓':''}</td><td>${c.sameSite}</td></tr>`).join('')}</tbody></table>`;
 d.innerHTML=`<div class="subt"><button id="nDetX" title="Close">✕</button>${tabs.map(([k,l])=>`<button data-t="${k}" aria-selected="${k===NW.tab}">${l}</button>`).join('')}</div><div class="scroll" style="flex:1">${body}</div>`;
 $('#nDetX').onclick=()=>{d.hidden=true;NW.sel=null;renderNet()};$$('[data-t]',d).forEach(b=>b.onclick=()=>{NW.tab=b.dataset.t;renderDet();if(NW.tab==='timing')track('net-timing')});
 const pv=$('#prevTree',d);if(pv){try{pv.appendChild(renderVal(JSON.parse(e.resBody),false,true));const hd=$('.hd',pv);if(hd)hd.click()}catch{pv.textContent=e.resBody}}
 $$('[data-src]',d).forEach(a=>a.onclick=ev=>{ev.preventDefault();const [f,l]=a.dataset.src.split(':');SRC.open(f,+l)})}

/* ================= Performance ================= */
const CAT={loading:['#6FA8DC','Loading'],scripting:['#F2C94C','Scripting'],rendering:['#A67CF7','Rendering'],painting:['#7CC57C','Painting'],system:['#9AA0A6','System'],task:['#8E9297','Task']};
const PF={prof:null,v0:0,v1:1,sel:null,hov:null,tab:'summary',rec:false,t0:0,evs:[],reload:false,drag:null,live:{inters:[],shifts:[]}};
bus.on('page-event',e=>{const lbl=nodeLabel(e.el);const base={click:24}[e.type]||10;const extra=/checkout/.test(lbl)?150:/theme/.test(lbl)?120:/add/.test(lbl)?30:0;const d=Math.round((base+extra+Math.random()*30)*ST.cpu);PF.live.inters.unshift({type:'pointer',el:lbl,d});PF.live.inters.length=Math.min(PF.live.inters.length,6);if(PF.rec)PF.evs.push({t:now()-PF.t0,type:e.type,lbl});if(P.performance.built&&!PF.prof)renderPerf()});
bus.on('reload',()=>{if(PF.rec&&PF.reload)return;PF.live.shifts.unshift({score:0.02,el:'section.cards'})});
function buildPerf(p){p.innerHTML=`<div class="tb" data-hs="perf-tb"><button class="tbb rec" id="pfRec" aria-pressed="false" title="Record (Ctrl+E)">${IC.rec}</button><button class="tbb" id="pfReload" title="Record and reload (Ctrl+Shift+E)">${IC.reload}</button><button class="tbb" id="pfClear" title="Clear">${IC.clear}</button><span class="sep"></span><label class="ck"><input type="checkbox" checked>Screenshots</label><label class="ck"><input type="checkbox" id="pfMem">Memory</label><span class="sep"></span>
 <label data-hs="perf-cpu">CPU: <select class="inp" id="pfCpu"><option value="1">No throttling</option><option value="4">4× slowdown</option><option value="6">6× slowdown</option><option value="20">20× slowdown (low-end)</option></select></label><label>Network: <select class="inp" id="pfNet">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label></div>
 <div id="pfBody" style="flex:1;display:flex;flex-direction:column;min-height:0;position:relative"></div>`;
 $('#pfRec').onclick=()=>PF.rec?stopRec():startRec(false);$('#pfReload').onclick=()=>startRec(true);$('#pfClear').onclick=()=>{PF.prof=null;PF.sel=null;renderPerf()};
 $('#pfCpu').onchange=e=>{ST.cpu=+e.target.value;toast(ST.cpu>1?`CPU ${ST.cpu}× slower — every task in the next recording stretches`:'CPU throttling off');track('cpu-throttle');renderPerf()};$('#pfNet').onchange=e=>{ST.throttle=e.target.value;syncThrottle()};renderPerf()}
function startRec(reload){PF.rec=true;PF.reload=reload;PF.t0=now();PF.evs=[];$('#pfRec').setAttribute('aria-pressed','true');renderPerf();if(reload)setTimeout(reloadPage,150);PF.auto=setTimeout(stopRec,reload?3200*Math.min(2,THROTTLE[ST.throttle].k):12000);track('perf-record');
 const tick=()=>{if(!PF.rec)return;const e=$('#pfT');if(e){const s=(now()-PF.t0)/1000;e.textContent=s.toFixed(1)+' s';$('#pfB').style.width=Math.min(100,s/12*100)+'%'}requestAnimationFrame(tick)};tick()}
function stopRec(){if(!PF.rec)return;clearTimeout(PF.auto);PF.rec=false;$('#pfRec').setAttribute('aria-pressed','false');const dur=Math.max(1500,now()-PF.t0);const b=$('#pfBody');b.innerHTML=`<div class="prec"><b>Loading profile…</b><div class="bar6"><i style="width:0;transition:width .6s" id="pfL"></i></div><span style="color:#9AA0A6">Processing trace · ${Math.round(dur)} ms · ${PF.evs.length} interaction(s)</span></div>`;requestAnimationFrame(()=>{const l=$('#pfL');if(l)l.style.width='100%'});
 setTimeout(()=>{PF.prof=makeProfile(dur,PF.evs,ST.cpu,PF.reload);PF.v0=0;PF.v1=PF.prof.dur;const it=PF.prof.ev.find(e=>e.inter)||PF.prof.ev.find(e=>e.long);PF.sel=PF.prof.ev.find(e=>e.long)||it||null;if(it){const pad=Math.max(80,it.d*1.2);PF.v0=Math.max(0,it.s-pad);PF.v1=Math.min(PF.prof.dur,it.s+it.d+pad*2)}renderPerf();track('perf-profile')},700)}
function makeProfile(dur,evs,cpu,reload){const out=[];const N=(name,cat,d,kids=[],x={})=>({name,cat,d,kids,...x});
 const place=(n,s,dep)=>{const e={s,d:n.d,depth:dep,name:n.name,cat:n.cat,url:n.url,self:n.d};out.push(e);let t=s+Math.min(0.4,n.d*0.02);n.kids.forEach(c=>{place(c,t,dep+1);e.self-=c.d;t+=c.d+Math.min(0.3,n.d*0.01)});return e};
 const task=(s,kids)=>{const d=kids.reduce((a,k)=>a+k.d,0)*1.04+0.4;const e=place(N('Task','task',d,kids),s,0);e.long=d>50;return e};const c=cpu;
 if(reload){task(0,[N('Send Request','loading',1)]);task(212,[N('Parse HTML','loading',38*c,[N('Parse Stylesheet','loading',6*c)])]);
  task(300,[N('Evaluate Script','scripting',58*c,[N('Compile Code','scripting',9*c),N('(anonymous)','scripting',42*c,[N('define','scripting',14*c),N('Emitter','scripting',11*c)])],{url:'vendor.min.js'})]);
  task(365,[N('Evaluate Script','scripting',44*c,[N('Compile Code','scripting',6*c),N('loadProducts','scripting',18*c,[N('fetch','scripting',3*c)]),N('restoreCart','scripting',14*c,[N('renderCart','scripting',10*c,[N('calcTotal','scripting',3*c)])])],{url:'app.js'})]);
  task(412,[N('Event: DOMContentLoaded','scripting',4*c)]);task(430,[N('Recalculate Style','rendering',18*c),N('Layout','rendering',26*c),N('Pre-paint','rendering',3*c),N('Paint','painting',9*c),N('Layerize','painting',2*c)]);
  task(600,[N('Evaluate Script','scripting',182*c,[N('Compile Code','scripting',12*c),N('(anonymous)','scripting',160*c,[N('collectMetrics','scripting',96*c,[N('JSON.stringify','scripting',38*c),N('getEntriesByType','scripting',22*c)]),N('sendBeacon','scripting',30*c)])],{url:'analytics.js'})]);
  task(830,[N('Run Microtasks','scripting',22*c,[N('loadProducts','scripting',18*c,[N('JSON.parse','scripting',6*c),N('restoreCart','scripting',8*c)])])]);task(860,[N('Recalculate Style','rendering',7*c),N('Layout','rendering',11*c),N('Paint','painting',5*c)]);
  task(1210,[N('Event: load','scripting',6*c)]);}
 for(let t=reload?1400:180;t<dur-40;t+=480+((t*7)%130)){task(t,[N('Timer Fired','scripting',2.2*c,[N('heartbeat','scripting',1.6*c)])])}
 for(let t=reload?1700:900;t<dur-40;t+=1300){task(t,[N('Minor GC','system',3.5*c)])}
 evs.forEach(ev=>{const t=ev.t;const L=ev.lbl;let kids;
  if(/add/.test(L))kids=[N('Event: click','scripting',22*c,[N('Function Call','scripting',20*c,[N('(anonymous)','scripting',18*c,[N('addToCart','scripting',16*c,[N('setItem','scripting',3*c),N('renderCart','scripting',9*c,[N('calcTotal','scripting',2*c),N('querySelectorAll','scripting',2*c)])])])],{url:'cart.js'})]),N('Recalculate Style','rendering',6*c),N('Layout','rendering',9*c),N('Paint','painting',3*c)];
  else if(/checkout/.test(L))kids=[N('Event: click','scripting',48*c,[N('Function Call','scripting',46*c,[N('checkout','scripting',44*c,[N('calcTotal','scripting',6*c),N('fetch','scripting',4*c),N('JSON.stringify','scripting',24*c)])],{url:'cart.js'})]),N('Recalculate Style','rendering',8*c),N('Layout','rendering',12*c)];
  else if(/theme/.test(L))kids=[N('Event: click','scripting',8*c,[N('Function Call','scripting',7*c,[N('(anonymous)','scripting',6*c,[N('setItem','scripting',2*c)])],{url:'app.js'})]),N('Recalculate Style','rendering',48*c),N('Layout','rendering',21*c),N('Paint','painting',14*c)];
  else kids=[N('Event: '+ev.type,'scripting',3*c,[N('Function Call','scripting',2.4*c)]),N('Paint','painting',2*c)];
  const tk=task(t,kids);tk.inter=L;if(/checkout/.test(L))task(t+320,[N('Run Microtasks','scripting',14*c,[N('(anonymous)','scripting',12*c,[N('toast','scripting',8*c,[N('appendChild','scripting',3*c)])])]),N('Layout','rendering',6*c)])});
 out.sort((a,b)=>a.s-b.s||a.depth-b.depth);const end=Math.max(dur,...out.map(e=>e.s+e.d))+60;return{ev:out,dur:end,reload,evs,cpu}}
function renderPerf(){const b=$('#pfBody');if(!b)return;
 if(PF.rec){b.innerHTML=`<div class="prec"><div style="display:flex;justify-content:space-between"><b>Recording</b><span class="mono" id="pfT">0.0 s</span></div><div class="bar6"><i id="pfB"></i></div><div style="color:#9AA0A6;margin-bottom:10px">${PF.reload?'Reloading the page and profiling the load…':'Interact with the page now — click Add, Theme or Checkout.'}</div><div style="text-align:right"><button class="btnp" id="pfStop">Stop</button></div></div>`;$('#pfStop').onclick=stopRec;return}
 if(!PF.prof){const L=PF.live;const inp=L.inters.length?Math.max(...L.inters.map(i=>i.d)):null;const cls=L.shifts.reduce((a,s)=>a+s.score,0.02);const lcp=1.62*(ST.cpu>1?1+ST.cpu*0.18:1)*(THROTTLE[ST.throttle].k>2?2.1:1);
  const rate=(v,g,n)=>v==null?'':v<=g?'g':v<=n?'o':'r';
  b.innerHTML=`<div class="scroll" style="flex:1"><div style="padding:14px 16px 0;font:600 15px var(--body)">Local metrics <span style="font:400 12.5px var(--body);color:#9AA0A6;margin-left:8px">measured live on this page${ST.cpu>1?` · CPU ${ST.cpu}× slowdown`:''}</span></div>
  <div class="vit" data-hs="perf-vitals"><div><b>LARGEST CONTENTFUL PAINT</b><span class="${rate(lcp,2.5,4)}">${lcp.toFixed(2)} s</span><small>LCP element: div.hero-art</small></div><div><b>CUMULATIVE LAYOUT SHIFT</b><span class="${rate(cls,.1,.25)}">${cls.toFixed(2)}</span><small>${L.shifts.length} shift cluster(s)</small></div><div><b>INTERACTION TO NEXT PAINT</b><span class="${rate(inp,200,500)}">${inp==null?'–':inp+' ms'}</span><small>${inp==null?'Click something on the page':'worst of '+L.inters.length+' interaction(s)'}</small></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 12px 12px"><div class="card" style="margin:0"><b style="font-size:12.5px">Interactions</b>${L.inters.length?L.inters.map(i=>`<div style="display:flex;justify-content:space-between;font:400 12px/24px var(--mono);border-top:1px solid #2E3035"><span style="color:var(--tag)">${esc(i.el)}</span><span class="${rate(i.d,200,500)}">${i.d} ms</span></div>`).join(''):'<div style="color:#9AA0A6;font-size:12.5px;margin-top:6px">None yet. Click Add or Theme in the page.</div>'}</div>
   <div class="card" style="margin:0"><b style="font-size:12.5px">Next steps</b><div style="color:#BDC1C6;font-size:12.5px;line-height:1.6;margin-top:6px">Press <span class="kbd">●</span> Record, click around the page, then Stop to get a flame chart of the main thread. <span class="kbd">⟳</span> profiles a full page load.<div style="display:flex;gap:8px;margin-top:10px"><button class="btnp" id="pfGo">Record</button><button class="btns" id="pfGo2">Record and reload</button></div></div></div></div></div>`;
  $('#pfGo').onclick=()=>startRec(false);$('#pfGo2').onclick=()=>startRec(true);return}
 b.innerHTML=`<canvas class="pcan" id="pfOv" height="60" data-hs="perf-overview"></canvas><div style="flex:1;min-height:0;position:relative" data-hs="perf-flame"><canvas class="pcan" id="pfCan" tabindex="0" style="position:absolute;inset:0;height:100%"></canvas></div>
 <div class="pbottom" data-hs="perf-bottom"><div style="flex:1;min-width:0;display:flex;flex-direction:column"><div class="subt">${[['summary','Summary'],['bottomup','Bottom-up'],['calltree','Call tree'],['log','Event log']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k===PF.tab}">${l}</button>`).join('')}</div><div class="scroll" id="pfSum" style="flex:1"></div></div></div>`;
 $$('.pbottom .subt button').forEach(x=>x.onclick=()=>{PF.tab=x.dataset.k;$$('.pbottom .subt button').forEach(y=>y.setAttribute('aria-selected',y===x));renderSum();if(PF.tab!=='summary')track('bottom-up')});
 const cv=$('#pfCan');const ov=$('#pfOv');
 cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();const f=(e.clientX-r.left-110)/(r.width-110);const span=PF.v1-PF.v0;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){const d=(e.deltaX||e.deltaY)/r.width*span;pan(d)}else{const z=Math.exp(e.deltaY*0.0018);zoomAt(clamp(f,0,1),z)}track('perf-zoom')},{passive:false});
 cv.addEventListener('mousedown',e=>{PF.drag={x:e.clientX,v0:PF.v0,v1:PF.v1,moved:false}});
 window.addEventListener('mousemove',perfMove);window.addEventListener('mouseup',perfUp);
 cv.addEventListener('mouseleave',()=>{PF.hov=null;drawPerf();$$('.ptip').forEach(t=>t.remove())});
 cv.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='w')zoomAt(.5,.8);if(k==='s')zoomAt(.5,1.25);if(k==='a')pan(-(PF.v1-PF.v0)*.1);if(k==='d')pan((PF.v1-PF.v0)*.1)});
 ov.addEventListener('mousedown',e=>{const r=ov.getBoundingClientRect();const t=(e.clientX-r.left)/r.width*PF.prof.dur;PF.ovDrag={t0:t}});
 ov.addEventListener('mousemove',e=>{if(!PF.ovDrag)return;const r=ov.getBoundingClientRect();const t=clamp((e.clientX-r.left)/r.width*PF.prof.dur,0,PF.prof.dur);if(Math.abs(t-PF.ovDrag.t0)>PF.prof.dur/200){PF.v0=Math.min(t,PF.ovDrag.t0);PF.v1=Math.max(t,PF.ovDrag.t0);drawPerf();renderSum()}});
 ov.addEventListener('mouseup',()=>{PF.ovDrag=null});ov.addEventListener('dblclick',()=>{PF.v0=0;PF.v1=PF.prof.dur;drawPerf();renderSum()});
 new ResizeObserver(()=>drawPerf()).observe(cv.parentNode);drawPerf();renderSum()}
function zoomAt(f,z){const span=PF.v1-PF.v0;const c=PF.v0+span*f;let ns=clamp(span*z,2,PF.prof.dur);PF.v0=clamp(c-ns*f,0,PF.prof.dur-ns);PF.v1=PF.v0+ns;drawPerf();renderSum()}
function pan(d){const span=PF.v1-PF.v0;PF.v0=clamp(PF.v0+d,0,PF.prof.dur-span);PF.v1=PF.v0+span;drawPerf()}
function perfMove(e){const cv=$('#pfCan');if(!cv)return;if(PF.drag){const dx=e.clientX-PF.drag.x;if(Math.abs(dx)>3)PF.drag.moved=true;const span=PF.drag.v1-PF.drag.v0;const d=-dx/(cv.clientWidth-110)*span;PF.v0=clamp(PF.drag.v0+d,0,PF.prof.dur-span);PF.v1=PF.v0+span;drawPerf();return}
 const r=cv.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;const hit=perfHit(e.clientX-r.left,e.clientY-r.top);if(hit!==PF.hov){PF.hov=hit;drawPerf()}
 $$('.ptip').forEach(t=>t.remove());if(hit){const t=h(`<div class="ptip"><b class="mono">${fmtMs(hit.d)}</b> ${esc(hit.name)}${hit.url?` <span style="color:#9AA0A6">${hit.url}</span>`:''}${hit.long?`<br><span style="color:#F28B82">Long task took ${fmtMs(hit.d-50)} over the 50 ms budget.</span>`:''}</div>`);const host=cv.parentNode;host.appendChild(t);t.style.left=Math.min(e.clientX-r.left+14,r.width-t.offsetWidth-4)+'px';t.style.top=(e.clientY-r.top+14)+'px'}}
function perfUp(e){if(!PF.drag)return;const cv=$('#pfCan');const moved=PF.drag.moved;PF.drag=null;if(moved||!cv)return;const r=cv.getBoundingClientRect();const hit=perfHit(e.clientX-r.left,e.clientY-r.top);if(hit){PF.sel=hit;PF.tab='summary';$$('.pbottom .subt button').forEach(y=>y.setAttribute('aria-selected',y.dataset.k==='summary'));drawPerf();renderSum();track('perf-select');if(hit.long)track('long-task')}}
const PL={lab:110,ruler:18,net:0,frames:16,tim:18,inter:18,mainHead:18,row:17};
function perfLayout(){const p=PF.prof;const L={y:PL.ruler};L.net=p.reload?L.y:null;if(p.reload)L.y+=28;L.frames=L.y;L.y+=PL.frames;L.tim=p.reload?L.y:null;if(p.reload)L.y+=PL.tim;L.inter=p.evs.length?L.y:null;if(p.evs.length)L.y+=PL.inter;L.main=L.y;L.flame=L.y+PL.mainHead;return L}
function perfHit(x,y){if(!PF.prof||x<PL.lab)return null;const L=perfLayout();const W=$('#pfCan').clientWidth-PL.lab;const t=PF.v0+(x-PL.lab)/W*(PF.v1-PF.v0);const dep=Math.floor((y-L.flame)/PL.row);if(dep<0)return null;return PF.prof.ev.find(e=>e.depth===dep&&t>=e.s&&t<=e.s+e.d)||null}
function drawPerf(){const cv=$('#pfCan');if(!cv||!PF.prof)return;const dpr=window.devicePixelRatio||1;const W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);c.fillStyle='#1F1F22';c.fillRect(0,0,W,H);
 const p=PF.prof,L=perfLayout(),lab=PL.lab,FW=W-lab,x=t=>lab+(t-PF.v0)/(PF.v1-PF.v0)*FW;c.font='11px "IBM Plex Sans", sans-serif';c.textBaseline='middle';
 // ruler + grid
 const span=PF.v1-PF.v0;const steps=[1,2,5,10,20,50,100,200,500,1000,2000];const st=steps.find(s=>FW/(span/s)>=70)||5000;c.strokeStyle='#2C2E33';c.fillStyle='#9AA0A6';
 for(let t=Math.ceil(PF.v0/st)*st;t<=PF.v1;t+=st){const xx=x(t);c.beginPath();c.moveTo(xx,0);c.lineTo(xx,H);c.stroke();c.fillText(fmtMs(t),xx+3,9)}
 c.fillStyle='#28292D';c.fillRect(0,0,lab,H);c.strokeStyle='#3B3D43';c.beginPath();c.moveTo(lab,0);c.lineTo(lab,H);c.stroke();c.fillStyle='#BDC1C6';
 const labRow=(y,hh,t)=>{c.fillStyle='#BDC1C6';c.fillText(t,8,y+hh/2);c.strokeStyle='#3B3D43';c.beginPath();c.moveTo(0,y+hh);c.lineTo(W,y+hh);c.stroke()};
 if(L.net!=null){labRow(L.net,28,'Network');NET.entries.slice(0,30).forEach((e,i)=>{const s=e.start,d=e.dur;c.fillStyle=e.failed||e.status>=400?'#F28B82':/script/.test(e.type)?'#F2C94C':/stylesheet|font/.test(e.type)?'#A67CF7':/document/.test(e.type)?'#6FA8DC':'#7CC57C';const xx=x(s),ww=Math.max(1,x(s+d)-xx);c.fillRect(xx,L.net+3+(i%5)*5,ww,3.5)})}
 labRow(L.frames,PL.frames,'Frames');const longs=p.ev.filter(e=>e.depth===0&&e.d>16.7);for(let t=0;t<p.dur;t+=16.7){if(t+16.7<PF.v0||t>PF.v1)continue;const bad=longs.some(e=>t>=e.s&&t<e.s+e.d);c.fillStyle=bad?'#E46962':'rgba(129,201,149,.55)';c.fillRect(x(t)+.5,L.frames+3,Math.max(1,x(t+16.7)-x(t)-1),PL.frames-6)}
 if(L.tim!=null){labRow(L.tim,PL.tim,'Timings');[[180,'DCL','#8AB4F8'],[610,'FCP','#81C995'],[1620*(ST.cpu>1?1.3:1),'LCP','#1E8E3E'],[1210,'L','#F28B82']].forEach(([t,l,col])=>{const xx=x(t);if(xx<lab||xx>W)return;c.fillStyle=col;const tw=c.measureText(l).width+8;c.fillRect(xx,L.tim+3,tw,PL.tim-6);c.fillStyle='#111';c.fillText(l,xx+4,L.tim+PL.tim/2)})}
 if(L.inter!=null){labRow(L.inter,PL.inter,'Interactions');p.ev.filter(e=>e.inter).forEach(e=>{const xx=x(e.s),ww=Math.max(4,x(e.s+e.d)-xx);c.fillStyle=e.d>200?'#F28B82':e.d>100?'#FCAD70':'#F6B26B';c.fillRect(xx,L.inter+3,ww,PL.inter-6);if(ww>60){c.fillStyle='#111';c.fillText(`${e.inter} · ${Math.round(e.d)} ms`,xx+4,L.inter+PL.inter/2)}})}
 c.fillStyle='#BDC1C6';c.font='600 11px "IBM Plex Sans", sans-serif';c.fillText('Main — https://driftwood.coffee/shop',8,L.main+PL.mainHead/2);c.font='11px "IBM Plex Sans", sans-serif';
 p.ev.forEach(e=>{if(e.s+e.d<PF.v0||e.s>PF.v1)return;const xx=Math.max(lab,x(e.s)),x2=Math.min(W,x(e.s+e.d)),ww=x2-xx;if(ww<0.4)return;const y=L.flame+e.depth*PL.row;const col=CAT[e.cat][0];
  c.fillStyle=col;c.globalAlpha=PF.hov&&PF.hov!==e?.9:1;c.fillRect(xx,y,Math.max(.8,ww-.5),PL.row-1);c.globalAlpha=1;
  if(e.long){const over=x(e.s+50);if(over<x2){c.fillStyle='rgba(228,57,53,.35)';for(let hx=Math.max(xx,over);hx<x2;hx+=6)c.fillRect(hx,y,2,PL.row-1)}c.fillStyle='#E53935';c.beginPath();c.moveTo(x2-8,y);c.lineTo(x2,y);c.lineTo(x2,y+8);c.fill()}
  if(ww>28){c.fillStyle='#1B1B1B';c.save();c.beginPath();c.rect(xx,y,ww-2,PL.row);c.clip();c.fillText(e.name,xx+3,y+PL.row/2);c.restore()}
  if(e===PF.sel){c.strokeStyle='#8AB4F8';c.lineWidth=2;c.strokeRect(xx+1,y+1,Math.max(2,ww-2),PL.row-3);c.lineWidth=1}});
 // overview
 const ov=$('#pfOv');if(!ov)return;const OW=ov.clientWidth,OH=60;ov.width=OW*dpr;ov.height=OH*dpr;const o=ov.getContext('2d');o.scale(dpr,dpr);o.fillStyle='#1B1C1F';o.fillRect(0,0,OW,OH);
 const bins=Math.floor(OW/2);const acc=Array.from({length:bins},()=>({}));p.ev.forEach(e=>{if(e.depth===0)return;const b0=Math.floor(e.s/p.dur*bins),b1=Math.floor((e.s+e.self)/p.dur*bins);for(let b=b0;b<=Math.min(bins-1,b1);b++)acc[b][e.cat]=(acc[b][e.cat]||0)+1});
 acc.forEach((a,i)=>{let y=37;['scripting','rendering','painting','loading','system'].forEach(k=>{if(!a[k])return;const hh=Math.min(34,a[k]*8);o.fillStyle=CAT[k][0];o.fillRect(i*2,y-hh,2,hh);y-=hh})});
 for(let i=0;i<8;i++){const fx=i*OW/8+3;o.fillStyle='#F4EFE8';o.globalAlpha=.85;o.fillRect(fx,40,OW/8-6,18);o.globalAlpha=1;o.fillStyle='#1C1714';o.fillRect(fx+5,44,(OW/8-16)*(i<1&&p.reload?.1:.6),3);o.fillStyle='#E4572E';o.fillRect(fx+5,50,(i<2&&p.reload)?0:(OW/8-16)*.35,4)}
 if(document.getElementById('pfMem')&&$('#pfMem').checked){o.strokeStyle='#4FA3F7';o.beginPath();for(let i=0;i<=40;i++){const xx=i/40*OW;const yy=40-Math.min(30,8+i*.45+(i%9)*1.4+toastCache.length*.6);i?o.lineTo(xx,yy):o.moveTo(xx,yy)}o.stroke()}
 o.fillStyle='rgba(138,180,248,.14)';o.strokeStyle='#8AB4F8';const vx=PF.v0/p.dur*OW,vw=(PF.v1-PF.v0)/p.dur*OW;o.fillRect(vx,0,vw,OH);o.strokeRect(vx+.5,.5,vw-1,OH-1)}
function renderSum(){const s=$('#pfSum');if(!s||!PF.prof)return;const p=PF.prof;const inR=e=>e.s+e.d>=PF.v0&&e.s<=PF.v1;
 const tot={};p.ev.filter(inR).forEach(e=>{if(e.cat==='task')return;tot[e.cat]=(tot[e.cat]||0)+Math.max(0,e.self)});const busy=Object.values(tot).reduce((a,b)=>a+b,0);const range=PF.v1-PF.v0;
 const donut=(parts,total)=>{let off=25,out='<svg viewBox="0 0 42 42" width="104" height="104"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/>';parts.forEach(([k,v])=>{const pc=v/total*100;out+=`<circle cx="21" cy="21" r="15.9" fill="none" stroke="${CAT[k]?CAT[k][0]:'#E3E3E3'}" stroke-width="6" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${off}"/>`;off-=pc});return out+'</svg>'};
 if(PF.tab==='summary'){if(PF.sel){const e=PF.sel;const kids={};p.ev.filter(x=>x.s>=e.s&&x.s+x.d<=e.s+e.d+0.01&&x.depth>e.depth).forEach(x=>{if(x.cat!=='task')kids[x.cat]=(kids[x.cat]||0)+Math.max(0,x.self)});const parts=Object.entries(kids);
   s.innerHTML=`<div style="display:flex;gap:18px;padding:10px 14px;align-items:center">${parts.length?donut(parts,e.d):''}<div style="font:400 12.5px/1.7 var(--body)"><div style="font:600 14px var(--body)"><i style="display:inline-block;width:10px;height:10px;background:${CAT[e.cat][0]};margin-right:6px"></i>${esc(e.name)}${e.url?` <span style="color:#8AB4F8;font-weight:400;text-decoration:underline">${e.url}</span>`:''}</div>${e.long?`<div style="color:#F28B82">⚠ Long task took ${fmtMs(e.d-50)} over the 50 ms budget — input is blocked for this long.</div>`:''}<div>Duration <b class="mono">${e.d.toFixed(2)} ms</b> · Self time <b class="mono">${Math.max(0,e.self).toFixed(2)} ms</b> · Start <span class="mono">${fmtMs(e.s)}</span></div>${parts.map(([k,v])=>`<span style="margin-right:14px"><i style="display:inline-block;width:9px;height:9px;background:${CAT[k][0]};margin-right:5px"></i>${CAT[k][1]} <span class="mono">${v.toFixed(1)} ms</span></span>`).join('')}</div></div>`}
  else{const parts=Object.entries(tot);s.innerHTML=`<div style="display:flex;gap:18px;padding:10px 14px;align-items:center">${donut(parts.concat([['idle',Math.max(0,range-busy)]]),range)}<div style="font:400 12.5px/1.8 var(--body)"><div>Range <span class="mono">${fmtMs(PF.v0)} – ${fmtMs(PF.v1)}</span> · CPU ${p.cpu}×</div>${parts.map(([k,v])=>`<div><i style="display:inline-block;width:9px;height:9px;background:${CAT[k][0]};margin-right:6px"></i>${CAT[k][1]} <span class="mono">${v.toFixed(1)} ms</span></div>`).join('')}<div><i style="display:inline-block;width:9px;height:9px;background:#E3E3E3;margin-right:6px"></i>Idle <span class="mono">${Math.max(0,range-busy).toFixed(0)} ms</span></div></div><div style="margin-left:auto;align-self:flex-start;color:#9AA0A6;font:400 12px/1.6 var(--body);max-width:260px">Scroll to zoom, drag to pan, click a bar for details. Drag across the overview to pick a range, double-click it to reset.</div></div>`}}
 else if(PF.tab==='bottomup'||PF.tab==='calltree'){const agg={};p.ev.filter(inR).forEach(e=>{if(e.name==='Task')return;if(PF.tab==='calltree'&&e.depth>3)return;const k=e.name+(e.url?' · '+e.url:'');const a=agg[k]=agg[k]||{self:0,total:0,cat:e.cat,depth:e.depth};a.self+=Math.max(0,e.self);a.total+=e.d});
  const rows=Object.entries(agg).sort((a,b)=>PF.tab==='bottomup'?b[1].self-a[1].self:b[1].total-a[1].total).slice(0,40);const T=busy||1;
  s.innerHTML=`<table class="tbl"><thead><tr><th style="width:130px">Self time</th><th style="width:130px">Total time</th><th>Activity</th></tr></thead><tbody>${rows.map(([k,a])=>`<tr><td class="m">${a.self.toFixed(1)} ms <span style="color:#9AA0A6">${(a.self/T*100).toFixed(1)}%</span></td><td class="m">${a.total.toFixed(1)} ms</td><td style="padding-left:${PF.tab==='calltree'?8+a.depth*14:8}px"><i style="display:inline-block;width:9px;height:9px;background:${CAT[a.cat][0]};margin-right:6px"></i>${esc(k)}</td></tr>`).join('')}</tbody></table>`}
 else s.innerHTML=`<table class="tbl"><thead><tr><th style="width:100px">Start</th><th style="width:110px">Duration</th><th>Activity</th></tr></thead><tbody>${p.ev.filter(e=>e.depth===0&&inR(e)).map(e=>{const k=p.ev.find(x=>x.depth===1&&x.s>=e.s&&x.s<e.s+e.d);return`<tr><td class="m">${fmtMs(e.s)}</td><td class="m ${e.long?'r':''}">${e.d.toFixed(1)} ms</td><td>${esc(k?k.name:'Task')}${e.long?' <span class="r">· long task</span>':''}</td></tr>`}).join('')}</tbody></table>`}

/* ================= Memory ================= */
const MEM={snaps:[],view:'summary',filter:'',sel:null,taking:false,type:'heap',timeline:null};
function heapCounts(){const divs=PAGE.qa('div').length,btn=PAGE.qa('button').length;return{'(string)':14202+cart.items.length*12+toastCache.length*3,'(closure)':5120+LIVE.length*4,'Object':9880+cart.items.length*6+CON.msgs.length*2,'Array':2104+cart.items.length,'(compiled code)':1006,'system / Context':640,'HTMLDivElement':divs,'HTMLButtonElement':btn,'Text':410+toastCache.length,'Detached <div class="toast">':toastCache.length,'Detached Text':toastCache.length,'(array)':870}}
const SIZE={'(string)':180,'(closure)':96,'Object':220,'Array':64,'(compiled code)':4200,'system / Context':240,'HTMLDivElement':188,'HTMLButtonElement':196,'Text':96,'Detached <div class="toast">':1740,'Detached Text':120,'(array)':1200};
function buildMemory(p){p.innerHTML=`<div class="tb" data-hs="mem-tb"><button class="tbb rec" id="mRec" title="Take heap snapshot">${IC.rec}</button><button class="tbb" id="mClear" title="Clear all profiles">${IC.clear}</button><button class="tbb" id="mGc" title="Collect garbage">${IC.trash}</button><span class="sep"></span><select class="inp" id="mView"><option value="summary">Summary</option><option value="comparison">Comparison</option><option value="containment">Containment</option></select><input class="inp" id="mFilter" placeholder="Class filter" style="width:170px" data-hs="mem-filter"><span style="color:#9AA0A6">All objects ▾</span></div>
 <div style="flex:1;display:flex;min-height:0"><div style="width:200px;flex:none;border-right:1px solid var(--dtl);font:400 12.5px/26px var(--body)" id="mSide" data-hs="mem-side"></div><div style="flex:1;min-width:0;display:flex;flex-direction:column" id="mMain"></div></div>`;
 $('#mRec').onclick=takeSnap;$('#mClear').onclick=()=>{MEM.snaps=[];MEM.sel=null;renderMem()};$('#mGc').onclick=()=>{toast('Garbage collected — anything still referenced (like toastCache) survives');track('gc')};
 $('#mView').onchange=e=>{MEM.view=e.target.value;renderMem();if(MEM.view==='comparison')track('mem-compare')};$('#mFilter').oninput=e=>{MEM.filter=e.target.value;renderMem();if(/detach/i.test(MEM.filter))track('mem-detached')};renderMem()}
function takeSnap(){if(MEM.taking)return;MEM.taking=true;MEM.cur=null;const n=MEM.snaps.length+1;renderMem();const t0=now();const tick=()=>{const p=(now()-t0)/1300;const m=$('#mMain');if(m&&MEM.taking){m.innerHTML=`<div class="empty" style="margin:auto">Snapshot ${n} — ${p<.55?'Snapshotting… '+Math.round(p/.55*100)+'%':'Building dominator tree…'}<div class="bar6" style="width:320px;margin:12px auto"><i style="width:${Math.min(100,p*100)}%"></i></div></div>`}if(p<1)requestAnimationFrame(tick);else{const counts=heapCounts();const size=Object.entries(counts).reduce((a,[k,v])=>a+v*(SIZE[k]||50),0);MEM.snaps.push({n,counts,size});MEM.sel=null;MEM.cur=MEM.snaps.length-1;MEM.taking=false;if(MEM.snaps.length>1){MEM.view='comparison';$('#mView').value='comparison'}renderMem();track('heap-snapshot')}};tick()}
function renderMem(){const side=$('#mSide'),m=$('#mMain');if(!side)return;side.innerHTML=`<div style="padding:0 10px;color:#9AA0A6;font:600 11px/28px var(--body);letter-spacing:.05em">HEAP SNAPSHOTS</div>${MEM.snaps.map((s,i)=>`<div data-s="${i}" style="padding:0 10px;cursor:pointer;display:flex;justify-content:space-between;${MEM.cur===i?'background:var(--dsel)':''}"><span>▣ Snapshot ${s.n}</span><span class="mono">${(s.size/1e6).toFixed(1)} MB</span></div>`).join('')||'<div style="padding:0 10px;color:#9AA0A6">None yet</div>'}`;
 $$('[data-s]',side).forEach(d=>d.onclick=()=>{MEM.cur=+d.dataset.s;renderMem()});if(MEM.taking)return;
 if(MEM.cur==null){m.innerHTML=`<div style="padding:16px 20px;font:400 13px/1.7 var(--body);overflow:auto"><div style="font:600 15px var(--body);margin-bottom:6px">Select profiling type</div>${[['heap','Heap snapshot','See memory distribution among the page’s JavaScript objects and related DOM nodes.'],['timeline','Allocations on timeline','Record allocations over time. Blue bars that stay blue are objects that were never freed.'],['sampling','Allocation sampling','Low-overhead sampling of which functions allocate memory.']].map(([k,l,d])=>`<label style="display:flex;gap:10px;margin:8px 0;cursor:pointer"><input type="radio" name="mt" value="${k}" ${MEM.type===k?'checked':''} style="accent-color:#8AB4F8;margin-top:5px"><span><b>${l}</b><br><span style="color:#9AA0A6">${d}</span></span></label>`).join('')}
  <div style="margin:14px 0 6px;color:#9AA0A6">JavaScript VM instance: <span class="mono" style="color:#E3E3E3">${(Object.entries(heapCounts()).reduce((a,[k,v])=>a+v*(SIZE[k]||50),0)/1e6).toFixed(1)} MB</span> driftwood.coffee</div><button class="btnp" id="mGo">${MEM.type==='timeline'?'Start':'Take snapshot'}</button>
  <div class="card" style="margin:16px 0 0;color:#BDC1C6">Leak hunt: take a snapshot, click <b>Subscribe</b> in the page 5 times, take another, choose <b>Comparison</b> and type <code>Detached</code> in the class filter.</div></div>`;
  $$('[name="mt"]',m).forEach(r=>r.onchange=()=>{MEM.type=r.value;renderMem()});$('#mGo',m).onclick=()=>MEM.type==='timeline'?memTimeline():takeSnap();return}
 const s=MEM.snaps[MEM.cur],prev=MEM.snaps[MEM.cur-1];const f=MEM.filter.toLowerCase();let rows;
 if(MEM.view==='comparison'&&prev){rows=Object.keys(s.counts).map(k=>{const a=s.counts[k],b=prev.counts[k]||0;const nw=Math.max(0,a-b)+Math.round(a*0.02*(k.startsWith('(')?1:0));const del=nw-(a-b);return{k,cells:[nw,del,a-b,((a-b)*(SIZE[k]||50))],det:k.startsWith('Detached')}}).filter(r=>r.cells[0]||r.cells[1]);
  m.innerHTML=`<div style="padding:4px 10px;color:#9AA0A6;font:400 12px var(--body);border-bottom:1px solid var(--dtl)">Snapshot ${s.n} compared with Snapshot ${prev.n}</div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Constructor</th><th># New</th><th># Deleted</th><th># Delta</th><th>Size Delta</th></tr></thead><tbody>${rows.filter(r=>!f||r.k.toLowerCase().includes(f)).sort((a,b)=>b.cells[3]-a.cells[3]).map(r=>`<tr data-k="${esc(r.k)}" class="${MEM.sel===r.k?'sel':''}" style="${r.det&&r.cells[2]>0?'color:#F6B26B':''}"><td>▸ ${esc(r.k)}</td><td class="m">${r.cells[0].toLocaleString()}</td><td class="m">${r.cells[1].toLocaleString()}</td><td class="m">${r.cells[2]>0?'+':''}${r.cells[2].toLocaleString()}</td><td class="m">${r.cells[3]>0?'+':''}${fmtBytes(Math.abs(r.cells[3]))}</td></tr>`).join('')}</tbody></table></div><div id="mRet"></div>`}
 else{rows=Object.entries(s.counts).map(([k,v])=>({k,v,sh:v*(SIZE[k]||50)}));const T=s.size;m.innerHTML=`${MEM.view==='comparison'?'<div style="padding:4px 10px;color:#FDD663;font:400 12px var(--body)">Take a second snapshot to compare.</div>':''}<div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Constructor</th><th>Distance</th><th>Shallow Size</th><th>Retained Size</th></tr></thead><tbody>${rows.filter(r=>!f||r.k.toLowerCase().includes(f)).sort((a,b)=>b.sh-a.sh).map(r=>`<tr data-k="${esc(r.k)}" class="${MEM.sel===r.k?'sel':''}" style="${r.k.startsWith('Detached')&&r.v?'color:#F6B26B':''}"><td>▸ ${esc(r.k)} <span style="color:#9AA0A6">×${r.v.toLocaleString()}</span></td><td class="m">${r.k.startsWith('Detached')?4:r.k.startsWith('HTML')?3:2}</td><td class="m">${fmtBytes(r.sh)} <span style="color:#9AA0A6">${(r.sh/T*100).toFixed(0)}%</span></td><td class="m">${fmtBytes(r.sh*1.6)}</td></tr>`).join('')}</tbody></table></div><div id="mRet"></div>`}
 $$('tr[data-k]',m).forEach(tr=>tr.onclick=()=>{MEM.sel=tr.dataset.k;renderMem();track('retainers')});
 if(MEM.sel){const det=MEM.sel.startsWith('Detached');$('#mRet',m).innerHTML=`<div style="border-top:2px solid var(--dtl);max-height:140px;overflow:auto" data-hs="mem-ret"><div style="padding:0 10px;font:600 12px/26px var(--body);background:#27282C">Retainers <span style="font-weight:400;color:#9AA0A6">for ${esc(MEM.sel)} — Object · Distance · Retained</span></div>${det?`<div style="padding:0 14px;font:400 12px/22px var(--mono)">▾ [${Math.max(0,toastCache.length-1)}] in <span style="color:#F6B26B">Array</span> @84211 <span style="float:right;color:#9AA0A6">3 · ${fmtBytes(toastCache.length*1740)}</span></div><div style="padding:0 30px;font:400 12px/22px var(--mono)">▾ toastCache in <span style="color:#8AB4F8">Window</span> / app.js:22 <span style="float:right;color:#9AA0A6">2</span></div><div style="padding:4px 14px 8px;font:400 12px var(--body);color:#FDD663">This toast was removed from the DOM but <code>toastCache</code> still points at it, so it can never be garbage collected.</div>`:`<div style="padding:0 14px;font:400 12px/22px var(--mono)">▾ ${esc(MEM.sel)} in (GC roots) <span style="float:right;color:#9AA0A6">1</span></div>`}</div>`}}
function memTimeline(){const m=$('#mMain');MEM.timeline={t0:now(),bars:[]};m.onclick=e=>{if(e.target.id==='mStop'){MEM.timeline=null;m.onclick=null;takeSnap()}};const on=()=>{if(!MEM.timeline)return;const T=MEM.timeline;const s=(now()-T.t0)/1000;if(T.bars.length<Math.floor(s*4)){T.bars.push({h:6+Math.random()*26,live:false,toast:false})}
  m.innerHTML=`<div style="padding:10px 14px;display:flex;gap:10px;align-items:center"><b>Recording allocations…</b><span class="mono">${s.toFixed(1)} s</span><button class="btnp" id="mStop" style="margin-left:auto">Stop</button></div><div style="height:120px;position:relative;margin:0 14px;border:1px solid var(--dtl);background:#1B1C1F">${T.bars.map((b,i)=>`<i style="position:absolute;bottom:0;left:${i*7+4}px;width:4px;height:${b.h+(b.toast?40:0)}px;background:${b.live||b.toast?'#4FA3F7':'#5F6368'}"></i>`).join('')}</div><div style="padding:10px 14px;color:#9AA0A6;font:400 12.5px var(--body)">Click <b>Subscribe</b> in the page: each toast leaves a tall blue bar that never turns grey — that allocation is never freed.</div>`;
  setTimeout(on,250)};window.__memToastHook=()=>{if(MEM.timeline)MEM.timeline.bars.push({h:8,toast:true})};on()}

/* ================= Application ================= */
const AP={view:'ls'};
const ATREE=[['h','Application'],[1,'manifest','📄 Manifest'],[1,'sw','⚙ Service workers'],[1,'storage','▤ Storage'],['h','Storage'],[1,null,'▾ ▦ Local storage'],[2,'ls','https://driftwood.coffee'],[1,null,'▾ ▦ Session storage'],[2,'ss','https://driftwood.coffee'],[1,null,'▾ ⛁ IndexedDB'],[2,'idb','driftwood-db · orders'],[1,null,'▾ ◔ Cookies'],[2,'cookies','https://driftwood.coffee'],[1,null,'▾ ⛁ Cache storage'],[2,'cache','sw-v3 — https://driftwood.coffee'],['h','Background services'],[1,'bfcache','⇆ Back/forward cache'],[1,'push','✉ Push messaging']];
function buildApp(p){p.innerHTML=`<div style="flex:1;display:flex;min-height:0"><div class="atree scroll" id="atree" data-hs="app-tree"></div><div class="aview" id="aview" data-hs="app-view"></div></div>`;
 $('#atree').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;AP.view=b.dataset.v;renderApp();track('app-'+AP.view)};bus.on('storage',()=>{if(P.application.built&&document.activeElement?.tagName!=='TD')renderApp()});renderApp()}
function renderApp(){const t=$('#atree'),v=$('#aview');if(!t)return;t.innerHTML=ATREE.map(([d,k,l])=>d==='h'?`<div class="h">${l}</div>`:`<button style="--d:${d}" ${k?`data-v="${k}"`:''} class="${k===AP.view?'on':''}">${l}</button>`).join('');
 const kvTable=(M,label)=>{v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="kvClear" title="Clear all">${IC.clear}</button><button class="tbb" id="kvDel" title="Delete selected">✕</button><input class="inp" id="kvF" placeholder="Filter"></div><div class="scroll" style="flex:1"><table class="tbl" id="kvT"><thead><tr><th style="width:34%">Key</th><th>Value</th></tr></thead><tbody>${[...M].map(([k,val],i)=>`<tr data-k="${esc(k)}"><td class="m" contenteditable="true" data-f="k">${esc(k)}</td><td class="m" contenteditable="true" data-f="v">${esc(val)}</td></tr>`).join('')}<tr><td class="m" contenteditable="true" data-f="new" style="color:#6E7379"></td><td class="m"></td></tr></tbody></table><div style="padding:10px 12px;font:400 12px/1.6 var(--body);color:#9AA0A6;border-top:1px solid var(--dtl)">Double-click a value to edit it; the page reads these keys. Try setting <code>theme</code> to <code>dark</code>. ${label}</div><div id="kvPrev" class="pre" style="border-top:1px solid var(--dtl)"></div></div>`;
  const T=$('#kvT');let selK=null;T.onclick=e=>{const tr=e.target.closest('tr[data-k]');if(!tr)return;$$('tr',T).forEach(r=>r.classList.toggle('sel',r===tr));selK=tr.dataset.k;const val=M.get(selK);const pv=$('#kvPrev');pv.innerHTML='';try{pv.appendChild(renderVal(JSON.parse(val),false,true));const hd=$('.hd',pv);if(hd)hd.click()}catch{pv.textContent=val}};
  T.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();e.target.blur()}});
  T.addEventListener('focusout',e=>{const td=e.target;if(!td.dataset||!td.dataset.f)return;const tr=td.closest('tr');const txt=td.textContent.trim();
   if(td.dataset.f==='new'){if(txt){M.set(txt,'');bus.emit('storage');track('storage-edit')}return}
   const k=tr.dataset.k;if(td.dataset.f==='v'){if(M.get(k)!==txt){M.set(k,txt);if(M===LS&&k==='theme')setTheme(txt==='dark'?'dark':'light');if(M===LS&&k==='cart')syncCartFromLS();track('storage-edit');bus.emit('storage')}}
   else if(txt!==k){const val=M.get(k);M.delete(k);if(txt)M.set(txt,val);bus.emit('storage')}});
  $('#kvClear').onclick=()=>{M.clear();if(M===LS){cart.items=[];renderCart()}bus.emit('storage')};$('#kvDel').onclick=()=>{if(selK!=null){M.delete(selK);if(M===LS&&selK==='cart'){cart.items=[];renderCart()}bus.emit('storage')}};
  $('#kvF').oninput=e=>{$$('tr[data-k]',T).forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(e.target.value.toLowerCase()))}};
 if(AP.view==='ls')kvTable(LS,'localStorage survives restarts; it is readable by any script on the origin, so never put tokens here.');
 else if(AP.view==='ss')kvTable(SS,'sessionStorage is per tab and is wiped when the tab closes.');
 else if(AP.view==='cookies'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="ckClear" title="Clear all cookies">${IC.clear}</button><button class="tbb" id="ckDel" title="Delete selected">✕</button><input class="inp" placeholder="Filter"><label class="ck"><input type="checkbox" id="ckIssue">Only show cookies with an issue</label></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>Path</th><th>Expires / Max-Age</th><th>Size</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th><th>Priority</th></tr></thead><tbody>${COOKIES.filter(c=>!AP.onlyIssue||c.issue).map((c,i)=>`<tr data-i="${COOKIES.indexOf(c)}" style="${c.issue?'background:rgba(253,214,99,.1)':''}"><td>${c.issue?'<span style="color:#FDD663">▲</span> ':''}${esc(c.name)}</td><td class="m" contenteditable="true" data-cv="${COOKIES.indexOf(c)}">${esc(c.value)}</td><td>${c.domain}</td><td>${c.path}</td><td class="m">${c.expires}</td><td class="m">${c.name.length+c.value.length}</td><td class="g">${c.httpOnly?'✓':''}</td><td class="g">${c.secure?'✓':''}</td><td>${c.sameSite}</td><td>${c.priority}</td></tr>`).join('')}</tbody></table>
  <div id="ckInfo" style="padding:10px 12px;font:400 12.5px/1.6 var(--body);color:#BDC1C6;border-top:1px solid var(--dtl)"><b>HttpOnly</b> cookies are invisible to <code>document.cookie</code> (try it in the Console). <b>Secure</b> means HTTPS only. <b>SameSite</b> controls whether the cookie rides along on cross-site requests: <code>Strict</code> never, <code>Lax</code> on top-level navigation, <code>None</code> always (and then it must be Secure).</div></div>`;
  let sel=null;$$('tr[data-i]',v).forEach(tr=>tr.onclick=()=>{sel=+tr.dataset.i;$$('tr',v).forEach(r=>r.classList.toggle('sel',r===tr));const c=COOKIES[sel];$('#ckInfo').innerHTML=c.issue?`<span style="color:#FDD663">▲ ${esc(c.issue)}</span>`:`<span class="mono">${esc(c.name)}=${esc(c.value)}</span><br><span style="color:#9AA0A6">${c.httpOnly?'HttpOnly — hidden from JavaScript. ':''}${c.secure?'Secure — HTTPS only. ':''}SameSite=${c.sameSite}.</span>`;track('cookie-inspect')});
  $$('[data-cv]',v).forEach(td=>{td.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();td.blur()}};td.onblur=()=>{COOKIES[+td.dataset.cv].value=td.textContent.trim();track('storage-edit')}});
  $('#ckIssue').checked=!!AP.onlyIssue;$('#ckIssue').onchange=e=>{AP.onlyIssue=e.target.checked;renderApp()};$('#ckClear').onclick=()=>{COOKIES=[];renderApp()};$('#ckDel').onclick=()=>{if(sel!=null){COOKIES.splice(sel,1);renderApp()}}}
 else if(AP.view==='idb'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb" id="idbClear">${IC.clear} Clear object store</button><span style="color:#9AA0A6">Start from key</span><input class="inp" style="width:100px"></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th style="width:50px">#</th><th style="width:160px">Key (Key path: "id")</th><th>Value</th></tr></thead><tbody>${IDB.map((r,i)=>`<tr><td class="m">${i}</td><td class="m">"${esc(r.key)}"</td><td class="m">${esc(r.value)}</td></tr>`).join('')}</tbody></table><div style="padding:10px 12px;color:#9AA0A6;font:400 12.5px var(--body)">Total entries: ${IDB.length} · Database version 3 · Object store "orders"</div></div>`;$('#idbClear').onclick=()=>{IDB=[];renderApp()}}
 else if(AP.view==='cache'){v.innerHTML=`<div class="tb">${IC.reload}<button class="tbb">${IC.clear}</button><input class="inp" placeholder="Filter by path"></div><div class="scroll" style="flex:1"><table class="tbl"><thead><tr><th>#</th><th>Name</th><th>Response-Type</th><th>Content-Type</th><th>Content-Length</th><th>Time Cached</th></tr></thead><tbody>${(CACHES[0]?CACHES[0].entries:[]).map((e,i)=>`<tr><td class="m">${i}</td><td class="m">${e[0]}</td><td>basic</td><td>${e[1]}</td><td class="m">${e[2]}</td><td class="m">9/24/2026, 9:14:03 PM</td></tr>`).join('')}</tbody></table><div style="padding:10px 12px;color:#9AA0A6;font:400 12.5px var(--body)">The service worker serves these copies when the network is unavailable.</div></div>`}
 else if(AP.view==='sw'){v.innerHTML=`<div class="scroll" style="flex:1;padding:14px 16px;font:400 12.5px/1.9 var(--body)"><div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:10px"><label class="ck"><input type="checkbox" id="swOff" ${ST.offline?'checked':''}>Offline</label><label class="ck"><input type="checkbox" id="swUpd" ${SW.updateOnReload?'checked':''}>Update on reload</label><label class="ck"><input type="checkbox" id="swBy" ${SW.bypass?'checked':''}>Bypass for network</label></div>
  <div class="kv" style="padding:0"><div><b>Source</b><span style="color:#8AB4F8;text-decoration:underline">sw.js</span><span style="color:#9AA0A6;font-family:var(--body)">&nbsp; Received 9/24/2026, 9:14:03 PM</span></div><div><b>Status</b><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#81C995;margin-right:6px"></i>${SW.version} ${SW.status}</span> <button class="pill" id="swStop" style="margin-left:8px">stop</button></div><div><b>Clients</b><span>https://driftwood.coffee/shop</span></div><div><b>Push</b><span><input class="inp" value="Test push message from DevTools." style="width:220px;font-family:var(--body)"> <button class="pill" id="swPush">Push</button></span></div><div><b>Sync</b><span><input class="inp" value="test-tag-from-devtools" style="width:220px"> <button class="pill">Sync</button></span></div><div><b>Update Cycle</b><span>#412 Install ✓ · Wait ✓ · Activate ✓</span></div></div>
  <p style="color:#9AA0A6;margin-top:10px">Tick <b>Offline</b>, then reload the page: the Network panel shows every request failing and the page gets the offline error. Untick it and reload to recover.</p></div>`;
  $('#swOff').onchange=e=>{ST.offline=e.target.checked;toast(ST.offline?'Offline — reload to see it':'Back online');track('sw-offline')};$('#swUpd').onchange=e=>SW.updateOnReload=e.target.checked;$('#swBy').onchange=e=>SW.bypass=e.target.checked;$('#swPush').onclick=()=>toast('Push event delivered to the service worker');$('#swStop').onclick=()=>toast('Service worker stopped — it restarts on the next fetch')}
 else if(AP.view==='manifest'){v.innerHTML=`<div class="scroll" style="flex:1;padding:14px 16px;font:400 12.5px/1.9 var(--body)"><div style="font:600 14px var(--body)">App Manifest <span style="color:#8AB4F8;font-weight:400;text-decoration:underline">manifest.json</span></div>
  <div class="kv" style="padding:6px 0"><div><b>Name</b><span>Driftwood Specialty Coffee</span></div><div><b>Short name</b><span>Driftwood</span></div><div><b>Start URL</b><span>/shop?source=pwa</span></div><div><b>Theme color</b><span><i style="display:inline-block;width:11px;height:11px;background:#E4572E;border:1px solid #777;margin-right:6px"></i>#E4572E</span></div><div><b>Background color</b><span><i style="display:inline-block;width:11px;height:11px;background:#F4EFE8;border:1px solid #777;margin-right:6px"></i>#F4EFE8</span></div><div><b>Display</b><span>standalone</span></div></div>
  <div style="font:600 13px var(--body);margin-top:8px">Installability</div><div style="color:#FDD663">▲ Manifest does not have a 512×512 PNG icon — add one to be installable.</div><div style="font:600 13px var(--body);margin-top:8px">Icons</div><div style="display:flex;gap:14px;align-items:end"><div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#E4572E,#7A2E1A)"></div><div style="width:96px;height:96px;border-radius:22px;background:linear-gradient(135deg,#E4572E,#7A2E1A)"></div><span style="color:#9AA0A6">192×192 · 96×96</span></div></div>`}
 else if(AP.view==='storage'){const ls=[...LS].reduce((a,[k,x])=>a+k.length+x.length,0)*2;const parts=[['IndexedDB',IDB.length?2.9e6:0,'#4FA3F7'],['Cache storage',CACHES.length?1.1e6:0,'#93C47D'],['Service workers',2e5,'#F6B26B'],['Local storage',ls,'#FFE599']];const tot=parts.reduce((a,p)=>a+p[1],0);let off=25;
  v.innerHTML=`<div class="scroll" style="flex:1;padding:16px 18px;font:400 13px/1.9 var(--body)"><div style="font:600 15px var(--body)">Storage</div><div style="color:#9AA0A6">https://driftwood.coffee</div><div style="display:flex;gap:26px;align-items:center;margin-top:10px;flex-wrap:wrap"><svg viewBox="0 0 42 42" width="150" height="150"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3C4043" stroke-width="6"/>${tot?parts.map(([n,s,c])=>{const pc=s/tot*100;const o=`<circle cx="21" cy="21" r="15.9" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${pc} ${100-pc}" stroke-dashoffset="${off}"/>`;off-=pc;return o}).join(''):''}</svg>
  <div><div><b class="mono" style="font-size:19px">${fmtBytes(tot)}</b> used out of 1.8 GB storage quota</div>${parts.map(([n,s,c])=>`<div><i style="display:inline-block;width:10px;height:10px;background:${c};margin-right:8px"></i>${n} <span class="mono">${fmtBytes(s)}</span></div>`).join('')}</div></div>
  <div style="margin-top:12px;display:flex;flex-direction:column;gap:2px"><label class="ck"><input type="checkbox" checked>Unregister service workers</label><label class="ck"><input type="checkbox" checked>Local and session storage</label><label class="ck"><input type="checkbox" checked>IndexedDB</label><label class="ck"><input type="checkbox" checked>Cookies</label><label class="ck"><input type="checkbox" checked>Cache storage</label></div>
  <div style="margin-top:10px"><button class="btnp" id="csd">Clear site data</button> <label class="ck" style="margin-left:10px"><input type="checkbox">Simulate custom storage quota</label></div></div>`;
  $('#csd').onclick=clearSiteData}
 else if(AP.view==='bfcache'){v.innerHTML=`<div style="padding:16px 18px;font:400 13px/1.8 var(--body)"><div style="font:600 15px var(--body)">Back/forward cache</div><p style="color:#BDC1C6;margin:4px 0 12px">Tests whether the page can be restored instantly when the user presses Back.</p><button class="btnp" id="bfTest">Test back/forward cache</button><div id="bfRes" style="margin-top:14px"></div></div>`;
  $('#bfTest').onclick=()=>{$('#bfRes').innerHTML='<span style="color:#9AA0A6">Navigating away and back…</span>';setTimeout(()=>{$('#bfRes').innerHTML=`<div style="color:#FDD663">▲ Not served from back/forward cache: 1 actionable issue</div><div class="card" style="margin:8px 0 0"><b>Pages with cache-control: no-store cannot enter back/forward cache.</b><div style="color:#9AA0A6">Frame: https://driftwood.coffee/shop · Header on the main document response.</div></div>`;track('bfcache')},1200)}}
 else v.innerHTML=`<div class="empty">Push messaging: record push events for 3 days, even when DevTools is closed.<br><br><button class="btns">${IC.rec} Start recording events</button></div>`}
function syncCartFromLS(){try{const saved=JSON.parse(LS.get('cart')||'[]');cart.items=saved.map(({id,qty})=>{const p=PRODUCTS.find(x=>x.id===id);return p?{id,name:p.name,price:p.price,qty:+qty||1}:null}).filter(Boolean);renderCart()}catch{pageConsole.error('Unexpected token in JSON at position 0 (cart)')}}
function clearSiteData(){LS.clear();SS.clear();COOKIES=[];IDB=[];CACHES=[];cart.items=[];renderCart();setTheme('light');LS.clear();bus.emit('storage');toast('Site data cleared');track('clear-site-data');renderApp()}

/* ================= Lighthouse ================= */
const LH={state:'form',mode:'navigation',device:'mobile',cats:{perf:true,a11y:true,bp:true,seo:true},report:null};
function buildLH(p){p.innerHTML=`<div id="lhBody" class="scroll" style="flex:1"></div>`;renderLH()}
function renderLH(){const b=$('#lhBody');if(!b)return;
 if(LH.state==='form'){b.innerHTML=`<div style="padding:18px 24px 0;display:flex;align-items:center;gap:14px"><div style="width:42px;height:42px;border-radius:50%;background:conic-gradient(#F28B82 0 25%,#FCAD70 0 50%,#81C995 0 100%)"></div><div><div style="font:600 16px var(--body)">Generate a Lighthouse report</div><div style="color:#9AA0A6;font-size:12.5px">Audits the page for performance, accessibility, best practices and SEO.</div></div><button class="btnp" id="lhGo" style="margin-left:auto">Analyze page load</button></div>
  <div class="lhform" data-hs="lh-form"><div><h5>Mode</h5>${[['navigation','Navigation (Default)'],['timespan','Timespan'],['snapshot','Snapshot']].map(([k,l])=>`<label><input type="radio" name="lhm" value="${k}" ${LH.mode===k?'checked':''}>${l}</label>`).join('')}</div><div><h5>Device</h5>${[['mobile','Mobile'],['desktop','Desktop']].map(([k,l])=>`<label><input type="radio" name="lhd" value="${k}" ${LH.device===k?'checked':''}>${l}</label>`).join('')}</div><div><h5>Categories</h5>${[['perf','Performance'],['a11y','Accessibility'],['bp','Best practices'],['seo','SEO']].map(([k,l])=>`<label><input type="checkbox" data-c="${k}" ${LH.cats[k]?'checked':''}>${l}</label>`).join('')}</div></div>
  <div class="card" style="margin:0 24px;color:#BDC1C6;font-size:12.5px;line-height:1.6">Tip: the orange “Order beans” button fails the contrast check. Change its <code>background</code> to something darker (say <code>#B3401F</code>) in Elements ▸ Styles, then run the audit again and watch Accessibility reach 100.</div>`;
  $$('[name="lhm"]',b).forEach(r=>r.onchange=()=>LH.mode=r.value);$$('[name="lhd"]',b).forEach(r=>r.onchange=()=>LH.device=r.value);$$('[data-c]',b).forEach(c=>c.onchange=()=>LH.cats[c.dataset.c]=c.checked);$('#lhGo').onclick=runLH;return}
 if(LH.state==='running'){b.innerHTML=`<div style="padding:60px 24px;text-align:center;font:400 13px var(--body)"><div style="font:600 15px var(--body);margin-bottom:12px" id="lhMsg">Loading page &amp; waiting for onload</div><div class="bar6" style="width:360px;margin:0 auto"><i id="lhBar" style="transition:width .3s"></i></div><div style="color:#9AA0A6;margin-top:14px">${LH.device==='mobile'?'Emulated Moto G Power · Slow 4G throttling · 4× CPU slowdown':'Emulated Desktop · custom throttling'}</div><button class="btns" style="margin-top:18px" id="lhCancel">Cancel</button></div>`;$('#lhCancel').onclick=()=>{LH.state='form';clearInterval(LH.t);renderLH()};return}
 const R=LH.report;const g=(n,v)=>{const col=v>=90?'#81C995':v>=50?'#FCAD70':'#F28B82';return`<div class="gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="${col}1A" stroke="${col}33" stroke-width="8"/><circle class="arc" cx="60" cy="60" r="52" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="0 400" data-v="${v}"/><text x="60" y="72" text-anchor="middle" fill="${col}" style="font:600 34px var(--mono)" class="gv">0</text></svg>${n}</div>`};
 b.innerHTML=`<div class="lh"><div style="display:flex;gap:10px;align-items:center;color:#9AA0A6;font-size:12px;margin-bottom:12px"><span>https://driftwood.coffee/shop · ${LH.device==='mobile'?'Moto G Power · Slow 4G':'Desktop'} · Lighthouse 12.8</span><button class="btns" id="lhNew" style="margin-left:auto">+ New report</button></div>
  <div class="gauges" data-hs="lh-gauges">${R.scores.map(([n,v])=>g(n,v)).join('')}</div><div style="display:flex;gap:16px;justify-content:center;margin:10px 0 4px;font-size:12px;color:#9AA0A6"><span><b style="color:#F28B82">▲</b> 0–49</span><span><b style="color:#FCAD70">■</b> 50–89</span><span><b style="color:#81C995">●</b> 90–100</span></div>
  ${R.metrics?`<h4 style="margin:18px 0 4px;font:600 12px var(--body);letter-spacing:.06em;color:#9AA0A6">METRICS</h4><div class="lhm" data-hs="lh-metrics">${R.metrics.map(([n,v,s])=>`<div><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${s==='g'?'#81C995':s==='o'?'#FCAD70':'#F28B82'};margin-right:8px"></i>${n}</span><b class="mono ${s}">${v}</b></div>`).join('')}</div>`:''}
  <h4 style="margin:18px 0 4px;font:600 12px var(--body);letter-spacing:.06em;color:#9AA0A6">DIAGNOSTICS &amp; FAILED AUDITS</h4><div data-hs="lh-audits">${R.audits.map(([sev,t,sav,d])=>`<details class="aud"><summary><b style="color:${sev==='r'?'#F28B82':sev==='o'?'#FCAD70':'#9AA0A6'}">${sev==='r'?'▲':'■'}</b>${esc(t)}<span style="margin-left:auto;color:#9AA0A6">${esc(sav)} ▾</span></summary><p>${d}</p></details>`).join('')}</div>
  <div style="color:#9AA0A6;margin-top:12px;font-size:12.5px">${R.passed} passed audits · ${R.na} not applicable</div></div>`;
 $('#lhNew').onclick=()=>{LH.state='form';renderLH()};
 $$('.arc',b).forEach((a,i)=>{const v=+a.dataset.v;const t0=now();const C=2*Math.PI*52;const st=()=>{const p=Math.min(1,(now()-t0-i*120)/900);const e=p<0?0:1-Math.pow(1-p,3);const val=Math.round(v*e);a.setAttribute('stroke-dasharray',`${C*val/100} 400`);a.parentNode.querySelector('.gv').textContent=val;if(p<1)requestAnimationFrame(st)};st()})}
function runLH(){LH.state='running';renderLH();const steps=['Loading page & waiting for onload','Gathering trace','Gathering artifacts: CSS usage, accessibility tree','Auditing Performance','Auditing Accessibility','Auditing Best Practices · SEO','Generating report'];let i=0;
 LH.t=setInterval(()=>{i++;const m=$('#lhMsg'),bar=$('#lhBar');if(m&&steps[i])m.textContent=steps[i];if(bar)bar.style.width=Math.min(100,i/steps.length*100)+'%';if(i>=steps.length){clearInterval(LH.t);LH.report=makeReport();LH.state='report';renderLH();track('lighthouse');if(LH.device==='desktop')track('lh-desktop');if((LH.report.scores.find(s=>s[0]==='Accessibility')||[])[1]===100)track('a11y-100')}},420)}
function makeReport(){const mob=LH.device==='mobile';const cta=PAGE.q('.btn.cta');const ct=contrastOf(cta)||3.6;const blockedCss=ST.blocked.has('app.css');
 const perf=Math.round((mob?86:98)-(ST.cpu>1?6:0)-(blockedCss?3:0));const a11y=ct>=4.5?100:92;const bp=COOKIES.some(c=>c.issue)?96:100;const seo=100;
 const sc=[];if(LH.cats.perf)sc.push(['Performance',perf]);if(LH.cats.a11y)sc.push(['Accessibility',a11y]);if(LH.cats.bp)sc.push(['Best Practices',bp]);if(LH.cats.seo)sc.push(['SEO',seo]);
 const m=mob?[['First Contentful Paint','1.4 s','g'],['Largest Contentful Paint','2.6 s','o'],['Total Blocking Time','190 ms','o'],['Cumulative Layout Shift','0.02','g'],['Speed Index','2.1 s','g']]:[['First Contentful Paint','0.4 s','g'],['Largest Contentful Paint','0.8 s','g'],['Total Blocking Time','40 ms','g'],['Cumulative Layout Shift','0.01','g'],['Speed Index','0.7 s','g']];
 const audits=[];if(LH.cats.perf)audits.push(['o','Reduce JavaScript execution time','1.3 s','<code>analytics.js</code> spends 182 ms evaluating on load — it shows up as a red-cornered long task in the Performance panel.'],['o','Properly size images','Est savings of 420 KiB','<code>hero.avif</code> is 1200 px wide but displayed at 360 px.'],['o','Reduce unused JavaScript','Est savings of 138 KiB','65% of <code>vendor.min.js</code> never runs. Open More tools ▸ Coverage to see which lines.'],['r','Avoid serving legacy JavaScript to modern browsers','Est savings of 12 KiB','Polyfills for features every modern browser already supports.']);
 if(LH.cats.a11y&&ct<4.5)audits.push(['r','Background and foreground colors do not have a sufficient contrast ratio',`${ct.toFixed(2)} : 1`,`<code>a.btn.cta</code> “Order beans →” has contrast ${ct.toFixed(2)}, below the 4.5 AA minimum. Darken its background in the Styles pane.`]);
 if(LH.cats.bp&&bp<100)audits.push(['o','Issues were logged in the Issues panel','1 issue','Cookie <code>cart_id</code> uses SameSite=None without Secure.']);
 if(LH.cats.bp)audits.push(['n','Browser errors were logged to the console','2 errors','404 for <code>og-image.png</code> and a 500 from <code>/api/cart</code> if you tried checkout.']);
 return{scores:sc,metrics:LH.cats.perf?m:null,audits,passed:62+(a11y===100?1:0),na:18}}

/* ================= shell: panels, dock, device, drawer, command menu ================= */
const P={};const BUILD={elements:buildElements,console:el=>{makeConsole(el,false)},sources:buildSources,network:buildNetwork,performance:buildPerf,memory:buildMemory,application:buildApp,lighthouse:buildLH};
const panelsEl=$('#panels');PANELS.forEach(([id,l])=>{const el=h(`<div class="panel" data-p="${id}" role="tabpanel"></div>`);panelsEl.appendChild(el);P[id]={el,built:false}});
$('#ptabs').innerHTML=PANELS.map(([id,l])=>`<button class="ptab" role="tab" data-p="${id}" aria-selected="false" data-hs="tab-${id}">${l}</button>`).join('');
$('#ptabs').onclick=e=>{const b=e.target.closest('.ptab');if(b)setPanel(b.dataset.p)};
function setPanel(id){ST.panel=id;if(!ST.open)toggleDevtools(true);$$('.ptab').forEach(t=>t.setAttribute('aria-selected',t.dataset.p===id));$$('.panel').forEach(p=>p.classList.toggle('on',p.dataset.p===id));
 const pn=P[id];if(!pn.built){pn.built=true;BUILD[id](pn.el)}if(id==='network')loopNet();if(id==='performance')requestAnimationFrame(drawPerf);if(id==='sources')SRC.render();if(id==='application')renderApp();if(id==='memory')renderMem();
 const t=$(`.ptab[data-p="${id}"]`);if(t)t.scrollIntoView({block:'nearest',inline:'nearest'});setGuide(id);track('panel-'+id)}
function toggleDevtools(on){ST.open=on===undefined?!ST.open:on;$('#bbody').classList.toggle('closed',!ST.open);$('#f12btn').style.color=ST.open?'#8AB4F8':'';if(!ST.open){setInspect(false);setGuide('closed')}else setGuide(ST.device?'device':ST.panel);updateKeys();placePins();if(ST.open)track('open-devtools')}
function setDock(d){ST.dock=d;const b=$('#bbody');b.classList.remove('bottom','right');b.classList.add(d);toast(`Docked to ${d}`);placePins();requestAnimationFrame(()=>{drawPerf();drawGrids()});track('dock')}
$('#closeDt').onclick=()=>toggleDevtools(false);$('#f12btn').onclick=()=>toggleDevtools();$('#inspectBtn').onclick=()=>{setInspect(!ST.inspecting)};$('#deviceBtn').onclick=()=>setDevice(!ST.device);
$('#errBdg').onclick=$('#warnBdg').onclick=()=>setPanel('console');$('#reloadBtn').onclick=reloadPage;
$('#kebab').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();openMenu(r.right-230,r.bottom+2,[{head:'Dock side'},{label:(ST.dock==='bottom'?'✓ ':'')+'Dock to bottom',act:()=>setDock('bottom')},{label:(ST.dock==='right'?'✓ ':'')+'Dock to right',act:()=>setDock('right')},'-',{label:'Run command',hint:'Ctrl+Shift+P',act:()=>openCmd('>')},{label:'Open file',hint:'Ctrl+P',act:()=>openCmd('')},{label:ST.drawer?'Hide console drawer':'Show console drawer',hint:'Esc',act:()=>toggleDrawer()},'-',{head:'More tools'},{label:'Rendering',act:()=>openDrawer('rendering')},{label:'Coverage',act:()=>openDrawer('coverage')},{label:'Changes',act:()=>openDrawer('changes')},{label:'Issues',act:()=>openDrawer('issues')},'-',{label:'Shortcuts',act:()=>document.getElementById('shortcuts').scrollIntoView()}])};
// splitter
(()=>{const sp=$('#splitter');let drag=null;sp.addEventListener('mousedown',e=>{drag={x:e.clientX,y:e.clientY,r:$('#bbody').getBoundingClientRect()};e.preventDefault()});
 window.addEventListener('mousemove',e=>{if(!drag)return;const b=$('#bbody');if(ST.dock==='bottom'){const ph=clamp(e.clientY-drag.r.top,90,drag.r.height-140);b.style.setProperty('--ph',ph+'px')}else{const pw=clamp((e.clientX-drag.r.left)/drag.r.width*100,22,75);b.style.setProperty('--pw',pw+'%')}if(ST.device)fitDevice()});
 window.addEventListener('mouseup',()=>{if(drag){drag=null;placePins();drawPerf();drawGrids()}})})();

/* ---------- device mode ---------- */
const DEVICES=[['Responsive',null,null,1],['iPhone SE',375,667,2],['iPhone 14 Pro Max',430,932,3],['Pixel 7',412,915,2.625],['Samsung Galaxy S20 Ultra',412,915,3.5],['iPad Mini',768,1024,2],['iPad Air',820,1180,2],['Surface Pro 7',912,1368,2],['Nest Hub',1024,600,2]];
const DV={dev:'Responsive',w:390,h:700,zoom:'fit',rot:false};
function setDevice(on){ST.device=on;$('#deviceBtn').setAttribute('aria-pressed',on);$('#bbody').classList.toggle('dev',on);const pa=$('#pagearea');
 if(on){pa.insertAdjacentHTML('afterbegin',`<div class="devbar" id="devbar" data-hs="dev-bar"><span>Dimensions:</span><select class="inp" id="devSel">${DEVICES.map(d=>`<option ${d[0]===DV.dev?'selected':''}>${d[0]}</option>`).join('')}</select><input class="inp" id="devW" value="${DV.w}" aria-label="Width"><span>×</span><input class="inp" id="devH" value="${DV.h}" aria-label="Height"><select class="inp" id="devZoom"><option value="fit">Fit</option><option value="0.5">50%</option><option value="0.75">75%</option><option value="1">100%</option></select><span id="devDpr" style="color:#9AA0A6">DPR 1</span><select class="inp" id="devThrottle">${Object.entries(THROTTLE).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><button class="tbb" id="devRot" title="Rotate">⟲</button></div><div class="mq" id="mq" data-hs="dev-mq"></div><div class="devstage" id="devstage"><div class="devframe" id="devframe" data-hs="dev-frame"><div class="devhandle" id="devHandle" title="Drag to resize"></div></div></div>`);
  $('#devframe').prepend(pageHost);$('#devSel').onchange=e=>{const d=DEVICES.find(x=>x[0]===e.target.value);DV.dev=d[0];if(d[1]){DV.w=d[1];DV.h=d[2];DV.rot=false}fitDevice();track('dev-preset')};
  $('#devW').onchange=e=>{DV.w=clamp(+e.target.value||390,200,1600);DV.dev='Responsive';fitDevice()};$('#devH').onchange=e=>{DV.h=clamp(+e.target.value||700,200,1600);DV.dev='Responsive';fitDevice()};$('#devZoom').onchange=e=>{DV.zoom=e.target.value;fitDevice()};
  $('#devThrottle').value=ST.throttle;$('#devThrottle').onchange=e=>{ST.throttle=e.target.value;syncThrottle();toast(`${THROTTLE[ST.throttle].label} — reload to feel it`)};$('#devRot').onclick=()=>{const t=DV.w;DV.w=DV.h;DV.h=t;DV.rot=!DV.rot;fitDevice();track('dev-rotate')};
  const hd=$('#devHandle');let drag=null;hd.addEventListener('mousedown',e=>{drag={x:e.clientX,w:DV.w};e.preventDefault()});window.addEventListener('mousemove',e=>{if(!drag)return;const sc=+$('#devframe').dataset.sc||1;DV.w=Math.round(clamp(drag.w+(e.clientX-drag.x)*2/sc,220,1400));DV.dev='Responsive';fitDevice()});window.addEventListener('mouseup',()=>{if(drag){drag=null;track('dev-drag')}});
  fitDevice();setGuide('device');track('device')}
 else{$('#viewport').appendChild(pageHost);['devbar','mq','devstage'].forEach(id=>{const x=document.getElementById(id);if(x)x.remove()});pageHost.style.cursor='';setGuide(ST.panel)}
 clearHL();requestAnimationFrame(()=>{drawGrids();placePins()});if(P.elements.built)renderSide()}
function fitDevice(){const f=$('#devframe'),st=$('#devstage');if(!f)return;const d=DEVICES.find(x=>x[0]===DV.dev);f.style.width=DV.w+'px';f.style.height=DV.h+'px';const avW=st.clientWidth-40,avH=st.clientHeight-30;let sc=DV.zoom==='fit'?Math.min(1,avW/DV.w,avH/DV.h):+DV.zoom;f.style.transform=`scale(${sc})`;f.dataset.sc=sc;
 $('#devW').value=DV.w;$('#devH').value=DV.h;$('#devSel').value=DV.dev;$('#devDpr').textContent='DPR '+(d&&d[3]?d[3]:1);const touch=DV.dev!=='Responsive';pageHost.style.cursor=touch?`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Ccircle cx='13' cy='13' r='10' fill='rgba(120,120,120,.45)' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E") 13 13, pointer`:'';
 const mq=$('#mq');const bps=[...new Set(RULES.filter(r=>r.media).map(r=>+r.media.match(/(\d+)/)[1]))].sort((a,b)=>b-a);mq.innerHTML=bps.map((bp,i)=>`<i data-w="${bp}" title="@media (max-width: ${bp}px)" style="width:${Math.min(100,bp*sc/mq.clientWidth*100)}%;background:${['#6FA8DC','#93C47D','#F6B26B'][i%3]}"></i>`).join('')+`<i data-w="1024" title="Laptop 1024px" style="width:${Math.min(100,1024*sc/mq.clientWidth*100)}%;background:#9AA0A6;opacity:.3"></i>`;
 $$('i',mq).forEach(b=>b.onclick=()=>{DV.w=+b.dataset.w;DV.dev='Responsive';fitDevice();track('dev-mq')});requestAnimationFrame(()=>{drawGrids();if(P.elements.built&&EL.sub==='styles')renderSide()})}
window.addEventListener('resize',()=>{fitDevice();placePins();drawGrids()});

/* ---------- drawer ---------- */
const DRAWER_TABS=[['console','Console'],['rendering','Rendering'],['coverage','Coverage'],['changes','Changes'],['issues','Issues']];let drawerConsole=null;
function toggleDrawer(on){ST.drawer=on===undefined?!ST.drawer:on;renderDrawer();if(ST.drawer)track('drawer')}
function openDrawer(tab){ST.drawer=true;ST.drawerTab=tab;renderDrawer();setGuide('drawer');track('drawer-'+tab)}
function renderDrawer(){const d=$('#drawer');d.classList.toggle('on',ST.drawer);if(!ST.drawer){placePins();return}
 d.innerHTML=`<div class="subt" data-hs="drw-tabs">${DRAWER_TABS.map(([k,l])=>`<button data-k="${k}" aria-selected="${k===ST.drawerTab}">${l}</button>`).join('')}<button style="margin-left:auto" id="drwX" title="Close drawer">✕</button></div><div id="drwBody" style="flex:1;min-height:0;display:flex;flex-direction:column" data-hs="drw-body"></div>`;
 $$('.subt button[data-k]',d).forEach(b=>b.onclick=()=>{ST.drawerTab=b.dataset.k;renderDrawer();track('drawer-'+ST.drawerTab)});$('#drwX').onclick=()=>toggleDrawer(false);const body=$('#drwBody');
 if(ST.drawerTab==='console'){makeConsole(body,true)}
 else if(ST.drawerTab==='rendering'){body.innerHTML=`<div class="scroll" style="flex:1;padding:8px 14px;font:400 12.5px/1.5 var(--body)">${[['paint','Paint flashing','Highlights areas of the page (green) that need to be repainted.'],['shifts','Layout Shift Regions','Highlights areas of the page (blue) that were shifted.'],['fps','Frame Rendering Stats','Plots frame throughput, dropped frames distribution, and GPU memory.']].map(([k,l,dd])=>`<label class="ck" style="display:flex;align-items:flex-start;gap:8px;margin:6px 0"><input type="checkbox" data-r="${k}" ${ST[k]?'checked':''} style="margin-top:3px"><span><b style="font-weight:600">${l}</b><br><span style="color:#9AA0A6">${dd}</span></span></label>`).join('')}
  <div style="margin:10px 0 4px;font-weight:600">Emulate CSS media feature prefers-color-scheme</div><select class="inp" id="rScheme"><option value="">No emulation</option><option value="light">prefers-color-scheme: light</option><option value="dark">prefers-color-scheme: dark</option></select>
  <div style="margin:10px 0 4px;font-weight:600">Emulate vision deficiencies</div><select class="inp" id="rVision"><option value="none">No emulation</option><option value="blur">Blurred vision</option><option value="protan">Protanopia (no red)</option><option value="deuter">Deuteranopia (no green)</option><option value="tritan">Tritanopia (no blue)</option><option value="achro">Achromatopsia (no color)</option></select>
  <div style="margin:10px 0 4px;font-weight:600">Emulate CSS media feature prefers-reduced-motion</div><select class="inp"><option>No emulation</option><option>prefers-reduced-motion: reduce</option></select></div>`;
  $$('[data-r]',body).forEach(c=>c.onchange=()=>{ST[c.dataset.r]=c.checked;if(c.dataset.r==='fps')fpsMeter(c.checked);track('rendering-'+c.dataset.r)});$('#rScheme',body).value=ST.schemeEmu||'';$('#rScheme',body).onchange=e=>{ST.schemeEmu=e.target.value;if(e.target.value)BODY.dataset.theme=e.target.value;else BODY.dataset.theme=LS.get('theme')||'light';track('rendering-scheme')};
  $('#rVision',body).value=ST.vision;$('#rVision',body).onchange=e=>{ST.vision=e.target.value;$('#viewport').style.filter={none:'',blur:'blur(2px)',protan:'url(#f-protan)',deuter:'url(#f-deuter)',tritan:'url(#f-tritan)',achro:'grayscale(1)'}[ST.vision];track('rendering-vision')}}
 else if(ST.drawerTab==='coverage'){renderCoverage(body)}
 else if(ST.drawerTab==='changes'){const ch=ST.changes;body.innerHTML=`<div class="tb"><button class="tbb" id="chCopy">Copy all changes</button><button class="tbb" id="chRevert">Revert all</button><span style="color:#9AA0A6">${ch.length} change(s) to app.css</span></div><div class="scroll" style="flex:1;font:400 12.5px/22px var(--mono)">${ch.length?ch.map(c=>`<div style="padding:0 12px;color:#9AA0A6">${esc(c.sel)} {</div>${c.from!==undefined&&c.from!==''?`<div style="padding:0 12px 0 26px;background:rgba(228,105,98,.16);color:#F28B82">-   ${esc(c.p)}: ${esc(c.from)};</div>`:''}${c.on!==false?`<div style="padding:0 12px 0 26px;background:rgba(129,201,149,.16);color:#81C995">+   ${esc(c.p)}: ${esc(c.to)};</div>`:`<div style="padding:0 12px 0 26px;color:#9AA0A6">    /* ${esc(c.p)} disabled */</div>`}<div style="padding:0 12px;color:#9AA0A6">}</div>`).join(''):'<div class="empty">No changes yet. Edit a value in Elements ▸ Styles and it appears here as a diff.</div>'}</div>`;
  $('#chCopy').onclick=()=>copyText(ST.changes.map(c=>`${c.sel} {\n  ${c.p}: ${c.to};\n}`).join('\n'));$('#chRevert').onclick=()=>{RULES.forEach(r=>r.d.forEach(d=>{d.v=d.orig;d.on=true}));ST.changes=[];applyCSS();renderDrawer();if(P.elements.built)renderSide();toast('All CSS changes reverted')}}
 else{body.innerHTML=`<div class="scroll" style="flex:1;font:400 12.5px/1.6 var(--body)"><div class="tb"><label class="ck"><input type="checkbox">Include third-party cookie issues</label><span style="margin-left:auto;color:#9AA0A6">2 issues</span></div>
  <details class="aud" style="padding:0 12px" open><summary><b style="color:#FDD663">▲</b> Mark cross-site cookies as Secure to allow setting them in cross-site contexts</summary><p>Cookies marked with <code>SameSite=None</code> must also be marked <code>Secure</code>. Affected: <code>cart_id</code> on driftwood.coffee. Fix: add the Secure attribute. <a href="#" id="isC">Open in Application ▸ Cookies</a></p></details>
  <details class="aud" style="padding:0 12px"><summary><b style="color:#8AB4F8">ⓘ</b> Deprecated feature used: unload event listeners</summary><p><code>analytics.js</code> registers an <code>unload</code> handler, which blocks the back/forward cache. Use <code>pagehide</code> instead.</p></details></div>`;const ic=$('#isC',body);if(ic)ic.onclick=e=>{e.preventDefault();setPanel('application');AP.view='cookies';renderApp()}}
 placePins()}
function renderCoverage(body){const cov=ST.coverage;body.innerHTML=`<div class="tb"><button class="tbb rec" id="covGo" title="Start instrumenting coverage and reload page">${IC.reload} Start instrumenting coverage and reload</button><span style="color:#9AA0A6">Per function ▾</span></div><div class="scroll" style="flex:1">${cov?`<table class="tbl"><thead><tr><th>URL</th><th>Type</th><th>Total Bytes</th><th>Unused Bytes</th><th style="width:40%">Usage Visualization</th></tr></thead><tbody>${[['vendor.min.js','JS',188000,.64],['app.js','JS',42700,.31],['analytics.js','JS',22500,.83],['app.css','CSS',8100,.42],['cart.js','JS',6400,.12]].map(([u,t,b,un])=>`<tr data-f="${u}" style="cursor:pointer"><td>https://driftwood.coffee/…/${u}</td><td>${t}</td><td class="m">${b.toLocaleString()}</td><td class="m">${Math.round(b*un).toLocaleString()} <span style="color:#9AA0A6">${Math.round(un*100)}%</span></td><td><span style="display:flex;height:11px;width:${30+b/188000*70}%"><b style="flex:${1-un};background:#4FA3F7"></b><b style="flex:${un};background:#E46962"></b></span></td></tr>`).join('')}</tbody></table><div style="padding:8px 12px;color:#9AA0A6;font:400 12.5px var(--body)">161 kB of 268 kB (60%) belongs to code that never ran. Click a row to see used (blue) and unused (red) lines in Sources.</div>`:'<div class="empty">Click the record button to start capturing coverage. Coverage shows which bytes of JS and CSS actually ran.</div>'}</div>`;
 $('#covGo').onclick=()=>{reloadPage();setTimeout(()=>{const mk=(f,frac)=>{const n=SRC.files[f].text().split('\n').length;return Array.from({length:n},(_,i)=>((i*7919)%100)/100>frac)};ST.coverage={'app.js':mk('app.js',.31),'cart.js':mk('cart.js',.12),'app.css':mk('app.css',.42),'vendor.min.js':mk('vendor.min.js',.64)};renderCoverage(body);track('coverage')},900)};
 $$('tr[data-f]',body).forEach(tr=>tr.onclick=()=>{if(SRC.files[tr.dataset.f])SRC.open(tr.dataset.f,1)})}
/* paint flashing & layout shift regions */
new MutationObserver(ms=>{if(!ST.paint)return;const seen=new Set();ms.forEach(m=>{let t=m.type==='characterData'?m.target.parentNode:m.target;if(t&&t.nodeType===1&&!seen.has(t)){seen.add(t);flashBox(t,'flashbox')}})}).observe(BODY,{subtree:true,childList:true,characterData:true,attributes:true});
function flashBox(n,cls){if(!n.isConnected)return;const r=relRect(n);if(!r.w)return;const b=h(`<div class="${cls}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`);$('#pagearea').appendChild(b);setTimeout(()=>b.remove(),380)}
bus.on('reload',()=>{if(ST.shifts)setTimeout(()=>flashBox(PAGE.q('.cards'),'shiftbox'),600);if(ST.paint)setTimeout(()=>flashBox(BODY,'flashbox'),300)});
pageHost.addEventListener('scroll',()=>{if(ST.paint)flashBox(BODY,'flashbox')},{passive:true});
let fpsRaf=0;function fpsMeter(on){cancelAnimationFrame(fpsRaf);$$('.fps').forEach(x=>x.remove());if(!on)return;const box=h('<div class="fps"><div>Frame rate <span id="fpsN">60</span> fps</div><div style="color:#9AA0A6">GPU raster: on · 0 dropped</div><canvas width="112" height="30"></canvas></div>');$('#pagearea').appendChild(box);const cv=$('canvas',box),c=cv.getContext('2d');const hist=[];let last=now();
 const step=()=>{const t=now();const dt=t-last;last=t;const f=Math.min(60,1000/dt);hist.push(f);if(hist.length>56)hist.shift();c.clearRect(0,0,112,30);hist.forEach((v,i)=>{c.fillStyle=v<50?'#F28B82':'#81C995';c.fillRect(i*2,30-v/2,1.5,v/2)});$('#fpsN').textContent=Math.round(hist.slice(-10).reduce((a,b)=>a+b,0)/Math.min(10,hist.length));fpsRaf=requestAnimationFrame(step)};step()}

/* ---------- command menu ---------- */
const CMDS=[...PANELS.map(([id,l])=>['Panel',`Show ${l}`,()=>setPanel(id)]),['Drawer','Show Console drawer',()=>openDrawer('console')],['Drawer','Show Rendering',()=>openDrawer('rendering')],['Drawer','Show Coverage',()=>openDrawer('coverage')],['Drawer','Show Changes',()=>openDrawer('changes')],['Drawer','Show Issues',()=>openDrawer('issues')],
 ['Mobile','Toggle device toolbar',()=>setDevice(!ST.device)],['Screenshot','Capture screenshot',()=>shot('viewport')],['Screenshot','Capture full size screenshot',()=>shot('full size')],['Screenshot','Capture node screenshot',()=>shot('node '+nodeLabel(ST.sel))],
 ['Debugger','Disable JavaScript',()=>{ST.jsDisabled=true;BODY.classList.add('__nojs');toast('JavaScript disabled — the page’s buttons stop working');track('cmd-js')}],['Debugger','Enable JavaScript',()=>{ST.jsDisabled=false;BODY.classList.remove('__nojs');toast('JavaScript enabled')}],
 ['Rendering','Emulate CSS prefers-color-scheme: dark',()=>{ST.schemeEmu='dark';BODY.dataset.theme='dark';toast('prefers-color-scheme: dark')}],['Rendering','Emulate CSS prefers-color-scheme: light',()=>{ST.schemeEmu='light';BODY.dataset.theme='light'}],['Rendering','Show paint flashing rectangles',()=>{ST.paint=true;toast('Paint flashing on')}],['Rendering','Show layout shift regions',()=>{ST.shifts=true;toast('Layout shift regions on')}],['Rendering','Show frames per second (FPS) meter',()=>{ST.fps=true;fpsMeter(true)}],
 ['Network','Go offline',()=>{ST.throttle='offline';syncThrottle();toast('Offline — reload to see it')}],['Network','Go online',()=>{ST.throttle='none';ST.offline=false;syncThrottle();toast('Online')}],['Network','Enable slow 4G throttling',()=>{ST.throttle='slow4g';syncThrottle()}],['Network','Disable network throttling',()=>{ST.throttle='none';syncThrottle()}],
 ['Application','Clear site data',()=>clearSiteData()],['Global','Dock to right',()=>setDock('right')],['Global','Dock to bottom',()=>setDock('bottom')],['Global','Reload page',()=>reloadPage()],['Sources','Pretty print vendor.min.js',()=>{SRC.pretty=true;SRC.open('vendor.min.js')}],['Elements','Select an element in the page to inspect it',()=>setInspect(true)]];
function shot(kind){const f=h('<div style="position:absolute;inset:0;background:#fff;z-index:99;opacity:.8;transition:opacity .5s"></div>');$('#pagearea').appendChild(f);requestAnimationFrame(()=>f.style.opacity=0);setTimeout(()=>f.remove(),520);toast(`Captured ${kind} screenshot — downloads are off in this preview, so no file was saved`);track('screenshot')}
function openCmd(prefix){closeCmd();const b=$('#browser');const m=h(`<div class="cmdk" role="dialog" aria-label="Command menu"><input spellcheck="false" aria-label="Command"><div class="list"></div><div class="foot"><span><b>&gt;</b> run command</span><span><b>!</b> run snippet</span><span><b>@</b> go to symbol</span><span><b>:</b> go to line</span><span><b>?</b> help</span><span>no prefix → open file</span></div></div>`);b.appendChild(m);const inp=$('input',m),list=$('.list',m);inp.value=prefix;let items=[],hi=0;
 const render=()=>{const v=inp.value;let q=v,mode='file';if(v.startsWith('>')){mode='cmd';q=v.slice(1)}else if(v.startsWith('!')){mode='snip';q=v.slice(1)}else if(v.startsWith('@')){mode='sym';q=v.slice(1)}else if(v.startsWith(':')){mode='line';q=v.slice(1)}else if(v.startsWith('?')){mode='help'}
  q=q.trim().toLowerCase();const fz=s=>{if(!q)return true;let i=0;for(const ch of s.toLowerCase()){if(ch===q[i])i++;if(i===q.length)return true}return false};const mark=s=>{if(!q)return esc(s);let i=0,out='';for(const ch of s){if(i<q.length&&ch.toLowerCase()===q[i]){out+=`<b>${esc(ch)}</b>`;i++}else out+=esc(ch)}return out};
  if(mode==='cmd')items=CMDS.filter(c=>fz(c[1])).map(c=>({cat:c[0],l:c[1],act:c[2]}));else if(mode==='snip')items=Object.keys(SNIPPETS).filter(fz).map(s=>({cat:'Snippet',l:s,act:()=>{SRC.nav='snip';runSnippet(s)}}));
  else if(mode==='sym'){const f=SRC.files[SRC.cur]?SRC.cur:'cart.js';items=SRC.files[f].text().split('\n').map((l,i)=>{const m=l.match(/function\s+([\w$]+)|^(?:export\s+)?const\s+([\w$]+)\s*=/);return m?{cat:f,l:(m[1]||m[2])+(m[1]?'()':''),line:i+1}:null}).filter(x=>x&&fz(x.l)).map(x=>({cat:':'+x.line,l:x.l,act:()=>SRC.open(f,x.line)}))}
  else if(mode==='line'){const n=parseInt(q);items=n?[{cat:SRC.cur,l:`Go to line ${n}`,act:()=>SRC.open(SRC.cur,n)}]:[{cat:'',l:'Type a line number, e.g. :11'}]}
  else if(mode==='help')items=[['>','Run command'],['!','Run snippet'],['@','Go to symbol'],[':','Go to line'],['','Open file']].map(([p,l])=>({cat:p||'(none)',l,act:()=>{inp.value=p;render();inp.focus();return'keep'}}));
  else items=Object.keys(SRC.files).filter(fz).map(f=>({cat:SRC.files[f].path.split('/').slice(0,-1).join('/'),l:f,act:()=>SRC.open(f,1)}));
  hi=Math.min(hi,Math.max(0,items.length-1));list.innerHTML=items.map((it,i)=>`<div class="it${i===hi?' hi':''}" data-i="${i}"><small>${esc(it.cat)}</small><span>${mark(it.l)}</span></div>`).join('')||'<div class="it"><small></small><span style="color:#9AA0A6">No results</span></div>'};
 const run=i=>{const it=items[i];if(!it||!it.act)return;const r=it.act();if(r!=='keep'){closeCmd();track('command')}};
 inp.oninput=()=>{hi=0;render()};inp.onkeydown=e=>{e.stopPropagation();if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(items.length-1,hi+1);render()}if(e.key==='ArrowUp'){e.preventDefault();hi=Math.max(0,hi-1);render()}if(e.key==='Enter'){e.preventDefault();run(hi)}if(e.key==='Escape')closeCmd()};
 list.onclick=e=>{const it=e.target.closest('[data-i]');if(it)run(+it.dataset.i)};render();inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);setTimeout(()=>document.addEventListener('mousedown',cmdOut),0);setGuide('cmd')}
function cmdOut(e){if(!e.target.closest('.cmdk'))closeCmd();else document.addEventListener('mousedown',cmdOut,{once:true})}
function closeCmd(){const was=$$('.cmdk').length;$$('.cmdk').forEach(x=>x.remove());document.removeEventListener('mousedown',cmdOut);if(was&&GKEY==='cmd')setGuide(!ST.open?'closed':ST.device?'device':ST.panel)}

/* ---------- keyboard ---------- */
$('#browser').addEventListener('keydown',e=>{const mod=e.ctrlKey||e.metaKey;const k=e.key.toLowerCase();const inField=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable;
 if(e.key==='F12'){e.preventDefault();toggleDevtools();return}
 if(DBG.state&&['F8','F10','F11','F9'].includes(e.key)){e.preventDefault();DBG.cmd(e.key==='F8'?'resume':e.key==='F10'?'over':e.key==='F11'?(e.shiftKey?'out':'into'):'into');return}
 if(mod&&e.shiftKey&&k==='c'){e.preventDefault();if(!ST.open)toggleDevtools(true);setInspect(!ST.inspecting);return}
 if(mod&&e.shiftKey&&k==='m'){e.preventDefault();if(!ST.open)toggleDevtools(true);setDevice(!ST.device);return}
 if(mod&&e.shiftKey&&k==='p'){e.preventDefault();if(!ST.open)toggleDevtools(true);openCmd('>');return}
 if(mod&&e.shiftKey&&k==='j'){e.preventDefault();setPanel('console');setTimeout(()=>{const t=$('.panel.on textarea');if(t)t.focus()},30);return}
 if(mod&&e.shiftKey&&k==='i'){e.preventDefault();toggleDevtools();return}
 if(mod&&e.shiftKey&&k==='d'){e.preventDefault();setDock(ST.dock==='bottom'?'right':'bottom');return}
 if(mod&&!e.shiftKey&&k==='p'){e.preventDefault();openCmd('');return}
 if(mod&&(e.key==='['||e.key===']')){e.preventDefault();const i=PANELS.findIndex(p=>p[0]===ST.panel);setPanel(PANELS[(i+(e.key===']'?1:PANELS.length-1))%PANELS.length][0]);return}
 if(mod&&k==='e'&&ST.panel==='performance'&&P.performance.built){e.preventDefault();e.shiftKey?startRec(true):PF.rec?stopRec():startRec(false);return}
 if(e.key==='Escape'&&!inField){if($('.cmdk')){closeCmd();return}if(ST.inspecting){setInspect(false);return}if(ST.open){e.preventDefault();toggleDrawer()}}});

/* ================= guide rail ================= */
const OSK={os:store.get('os',/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'mac':'win')};
const K=(w,m)=>OSK.os==='mac'?m:w;
const kc=arr=>arr.map(x=>`<span class="kbd">${esc(x)}</span>`).join('');
const GUIDE={
 closed:{c:'var(--content)',k:'DevTools closed',t:'Press F12',l:'The page is on its own now. Open the tools with <b>F12</b>, <b>Ctrl+Shift+I</b> (⌘⌥I on a Mac) or by right-clicking anything and choosing <b>Inspect</b>.',map:[],tasks:[['open-devtools','Press <code>F12</code> with the browser focused, or click the keycap above it.']],keys:[[['F12'],['F12'],'Toggle DevTools'],[['Ctrl','Shift','I'],['⌘','⌥','I'],'Open DevTools'],[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open straight to Console'],[['Ctrl','Shift','C'],['⌘','⇧','C'],'Open in inspect mode']],facts:['Edge uses the same tools. Safari needs Settings ▸ Advanced ▸ Show features for web developers first.']},
 elements:{c:'var(--content)',k:'Panel 1 of 8',t:'Elements',l:'The live DOM and every CSS rule that touches it. This is the page as it is right now, after JavaScript ran, which is not always the HTML the server sent.',
  map:[['el-tree','DOM tree','Click to select. Double-click text or an attribute value to edit it. Right-click for Hide, Delete, Copy selector and DOM breakpoints.'],['el-crumbs','Breadcrumbs','The path from <code>html</code> to the selected node. Click a step to jump up the tree.'],['el-sub','Sidebar tabs','Styles, Computed (final values), Layout (grid and flex overlays), Event Listeners, Accessibility.'],['el-filter','Filter · :hov · .cls','Search declarations, force :hover or :focus, toggle classes on the node.'],['el-styles','Styles','Matching rules, most specific first. Struck-through lines lost the cascade. Checkboxes toggle a declaration; click a value to edit it.'],['tab-elements','Inspect arrow','Beside the tabs. Click it, then click anything in the page (Ctrl+Shift+C).']],
  tasks:[['inspect-pick','Click the inspect arrow (or press <code>Ctrl+Shift+C</code>), then click a card in the page.'],['hover-node','Hover rows in the tree. The page paints content, padding, border and margin.'],['toggle-decl','Untick <code>border-radius</code> under <code>.btn.cta</code>. The pill turns square.'],['edit-value','Click a value such as <code>44px</code> on <code>.hero-title</code> and change it. ↑/↓ nudge numbers.'],['edit-dom','Double-click the headline text in the tree and rewrite it.'],['grid-overlay','Click the <code>grid</code> badge next to <code>section.cards</code>.'],['force-hover','Open <code>:hov</code> and tick <code>:hover</code> to reveal the hover rule.'],['hide-node','Select a node in the tree and press <code>H</code> to hide it. Press it again to bring it back.']],
  keys:[[['Ctrl','Shift','C'],['⌘','⇧','C'],'Inspect mode'],[['H'],['H'],'Hide node'],[['Del'],['⌫'],'Delete node'],[['Ctrl','Z'],['⌘','Z'],'Undo in the tree'],[['↑','↓'],['↑','↓'],'Move / nudge a value'],[['Alt','click ▸'],['⌥','click ▸'],'Expand all descendants']],
  facts:['The selected node is <code>$0</code> in the Console; earlier picks are <code>$1</code>–<code>$4</code>.','Purple flashes in the tree mean the page’s JavaScript just changed that node. Click <b>Add</b> in the page to see one.','Edits live until reload. The Changes drawer turns them into a diff you can copy.']},
 console:{c:'var(--border)',k:'Panel 2 of 8',t:'Console',l:'A JavaScript prompt that runs inside the page, plus every log, warning and error the page produces. Everything typed here runs for real against the demo shop.',
  map:[['con-tb','Toolbar','Clear, JavaScript context, live expression (eye), filter, log levels, settings.'],['con-log','Messages','Newest at the bottom. The link on the right opens the line in Sources. Repeats collapse into a counter.'],['con-prompt','Prompt','Enter runs, Shift+Enter adds a line, ↑ recalls history, Tab accepts the grey autocomplete. The line below previews the result before you run it.'],['con-levels','Log levels','Verbose is hidden by default. The page’s debug messages live there.'],['con-chips','Examples','Click one to put it in the prompt.']],
  tasks:[['console-eval','Run <code>document.title</code>.'],['console-$0','Run <code>$0</code>, then hover the result: it highlights in the page. Click it to jump to Elements.'],['console-table','Run <code>console.table(orders)</code>.'],['console-fetch','Run <code>await fetch(\'/api/cart\', {method:\'POST\'})</code> and watch the 500 land here and in Network.'],['live-expr','Click the eye icon, add <code>cart.items.length</code>, then click <b>Add</b> in the page.'],['console-levels','Open <b>Default levels</b> and turn on <b>Verbose</b>.'],['console-filter','Type <code>-analytics</code> or <code>/404|500/</code> into the filter.']],
  keys:[[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open Console'],[['Ctrl','L'],['⌘','K'],'Clear'],[['↑','↓'],['↑','↓'],'History'],[['Tab'],['Tab'],'Accept autocomplete'],[['Shift','Enter'],['⇧','Enter'],'New line']],
  facts:['<code>$(sel)</code> is querySelector, <code>$$(sel)</code> returns an array, <code>$x(path)</code> runs XPath.','Top-level <code>await</code> works here; it doesn’t in a normal script.','<code>copy(value)</code> puts anything on your clipboard. <code>getEventListeners(node)</code> lists its handlers.']},
 sources:{c:'var(--margin)',k:'Panel 3 of 8',t:'Sources',l:'Pause JavaScript on any line and walk through it with every variable in view. Also where you edit, pretty-print and save scripts.',
  map:[['src-nav','Navigator','Page lists what the site loaded. Workspace and Overrides persist edits; Snippets are scripts you keep.'],['src-editor','Editor','Click a line number for a breakpoint (blue). Right-click it for conditional (orange) or logpoint (pink).'],['src-controls','Step controls','Resume F8 · Step over F10 · Step into F11 · Step out Shift+F11 · Deactivate all.'],['src-watch','Watch','Expressions re-evaluated at every pause.'],['src-bps','Breakpoints','Every breakpoint, including DOM breakpoints set from Elements. Untick to disable.'],['src-scope','Scope','Local variables at the paused line, then closure and global.'],['src-stack','Call Stack','How execution got here. The top frame is where you’re paused.']],
  tasks:[['set-bp','In <code>cart.js</code> click line <b>11</b>. Add a coffee in the page, then click <b>Checkout</b>.'],['step','While paused, press Step over (F10) and watch <code>total</code> grow in Scope.'],['cond-bp','Right-click line <b>14</b> ▸ Add conditional breakpoint ▸ <code>total &gt; 50</code>.'],['logpoint','Right-click line <b>12</b> ▸ Add logpoint ▸ <code>\'line\', line</code>. It logs without pausing.'],['watch','Add a watch expression such as <code>item.qty * 2</code> with the + button.'],['pretty-print','Open <code>vendor.min.js</code> and press <code>{ }</code>.'],['dom-bp','In Elements right-click <code>aside.cart-bar</code> ▸ subtree modifications, then click Add in the page.'],['snippet','Open the Snippets tab and run <code>list-cookies.js</code>.']],
  keys:[[['F8'],['F8'],'Resume'],[['F10'],['F10'],'Step over'],[['F11'],['F11'],'Step into'],[['Shift','F11'],['⇧','F11'],'Step out'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all files']],
  facts:['Compare Sources ▸ <code>(index)</code> with the Elements tree: the server sent an empty <code>section.cards</code>; JavaScript filled it.','A <code>debugger;</code> statement pauses exactly like a breakpoint.','Source maps let you debug the original TypeScript or SCSS instead of the bundle.']},
 network:{c:'var(--act)',k:'Panel 4 of 8',t:'Network',l:'Every request the page makes: what it asked for, what came back, how big it was and where the time went.',
  map:[['net-tb','Toolbar','Record, clear, Preserve log, Disable cache, throttling, reload.'],['net-filter','Filters','Text filter (try <code>-analytics</code>, <code>status-code:404</code>, <code>method:POST</code>) and type chips.'],['net-overview','Overview','Every request on one timeline. Blue line = DOMContentLoaded, red line = Load.'],['net-table','Requests','Status, type, initiator (click it to open the code), size, time. Right-click for copy and block options.'],['net-waterfall','Waterfall','Grey queued · teal DNS · orange connect · purple TLS · green waiting (TTFB) · blue download.'],['net-status','Summary','Request count, bytes over the wire vs uncompressed, and load milestones.']],
  tasks:[['reload','Press <b>Reload</b> in the toolbar (or ⟳ in the browser bar) and watch the waterfall build.'],['throttle','Set throttling to <b>Slow 4G</b>, then reload.'],['net-detail','Click a request to open Headers, Preview, Response and Timing.'],['net-type','Click the <b>JS</b> chip, then <b>Img</b>.'],['block','Right-click <code>app.css</code> ▸ Block request URL, then reload. Unblock it the same way.'],['copy-curl','Right-click any request ▸ Copy as cURL.'],['preserve-log','Tick <b>Preserve log</b> so reloads keep the old requests.'],['cache','Untick <b>Disable cache</b> and reload twice to see <code>(memory cache)</code>.']],
  keys:[[['Ctrl','Shift','R'],['⌘','⇧','R'],'Hard reload'],[['Ctrl','F'],['⌘','F'],'Search request bodies'],[['Shift','hover'],['⇧','hover'],'Show initiators / dependents']],
  facts:['Hold <b>Shift</b> over a row: green rows started it, red rows were started by it.','Right-click the browser’s reload button (with DevTools open) for <b>Empty cache and hard reload</b>.','Time vs Waiting (TTFB): a long green bar means the server is slow, not the network.']},
 performance:{c:'var(--hot)',k:'Panel 5 of 8',t:'Performance',l:'Records what the main thread did, millisecond by millisecond, so you can see why a click felt slow or a page took long to paint.',
  map:[['perf-tb','Toolbar','Record (Ctrl+E), record-and-reload, clear, CPU and network throttling.'],['perf-vitals','Live metrics','LCP, CLS and INP measured on this page as you interact.'],['perf-overview','Overview','CPU activity by category with screenshots. Drag across it to zoom to a range.'],['perf-flame','Flame chart','Each bar is a function call; bars below were called by bars above. Width is time.'],['perf-bottom','Summary tabs','Summary, Bottom-up (heaviest functions), Call tree, Event log.']],
  tasks:[['perf-record','Press <b>Record</b>, click <b>Theme</b> and <b>Add</b> in the page, then Stop.'],['perf-zoom','Scroll over the flame chart to zoom; drag to pan (W A S D work too).'],['long-task','Click a task with a red corner. That is a Long Task over 50 ms.'],['cpu-throttle','Set CPU to <b>6× slowdown</b> and record again. Every bar stretches.'],['bottom-up','Open <b>Bottom-up</b> to rank activities by self time.']],
  keys:[[['Ctrl','E'],['⌘','E'],'Start / stop recording'],[['Ctrl','Shift','E'],['⌘','⇧','E'],'Record and reload'],[['W','S'],['W','S'],'Zoom in / out'],[['A','D'],['A','D'],'Pan']],
  facts:['Colors: <b style="color:#F2C94C">scripting</b>, <b style="color:#A67CF7">rendering</b>, <b style="color:#7CC57C">painting</b>, <b style="color:#6FA8DC">loading</b>, grey system.','INP is good at ≤ 200 ms, LCP at ≤ 2.5 s, CLS at ≤ 0.1.','Clicking <b>Theme</b> costs mostly <i>Recalculate Style</i>: one attribute change restyles the whole page.']},
 memory:{c:'#B388FF',k:'Panel 6 of 8',t:'Memory',l:'What is on the JavaScript heap and who is keeping it alive. The tool for tabs that get heavier the longer they stay open.',
  map:[['mem-tb','Toolbar','Take snapshot, clear, force garbage collection, view (Summary / Comparison / Containment).'],['mem-side','Profiles','Each snapshot with its heap size.'],['mem-filter','Class filter','Narrow by constructor. <code>Detached</code> finds DOM removed from the page but still referenced.'],['mem-ret','Retainers','The chain of references keeping the selected object alive.']],
  tasks:[['heap-snapshot','Take a heap snapshot.'],['mem-compare','Click <b>Subscribe</b> in the page 5 times, take a second snapshot, then open Comparison.'],['mem-detached','Type <code>Detached</code> in the class filter.'],['retainers','Click the Detached row. The retainer is <code>toastCache</code> in app.js.'],['gc','Press the trash can to collect garbage. The leak survives.']],
  keys:[],facts:['Shallow size is the object itself; retained size is what would be freed if it went away.','A growing <b># Delta</b> between identical actions is the classic leak signature.','Allocations on timeline: bars that stay blue were never freed.']},
 application:{c:'var(--padding)',k:'Panel 7 of 8',t:'Application',l:'Everything the site stores in your browser: storage, cookies, databases, caches, the service worker and the install manifest.',
  map:[['app-tree','Sidebar','Grouped into Application (manifest, service worker, storage), Storage (per type) and Background services.'],['app-view','Viewer','Tables are editable. Double-click a value, press Enter, and the page reacts.']],
  tasks:[['app-ls','Open <b>Local storage</b> ▸ driftwood.coffee.'],['storage-edit','Double-click the value of <code>theme</code>, type <code>dark</code>, press Enter.'],['cookie-inspect','Open <b>Cookies</b> and click <code>cart_id</code> to read its warning.'],['sw-offline','Service workers ▸ tick <b>Offline</b>, then reload the page.'],['clear-site-data','Storage ▸ <b>Clear site data</b>. The cart empties.'],['bfcache','Back/forward cache ▸ Test.']],
  keys:[],facts:['<b>HttpOnly</b> cookies never appear in <code>document.cookie</code>. Check in the Console.','localStorage is synchronous and readable by any script on the origin: fine for preferences, wrong for tokens.','Remember to untick <b>Offline</b> when you’re done.']},
 lighthouse:{c:'#81C995',k:'Panel 8 of 8',t:'Lighthouse',l:'An automated audit that loads the page under throttling and scores it on performance, accessibility, best practices and SEO, with the fix for each failure.',
  map:[['lh-form','Settings','Navigation (full load), Timespan (a period of interaction) or Snapshot (current state); mobile or desktop; categories.'],['lh-gauges','Scores','0–49 red, 50–89 orange, 90–100 green.'],['lh-metrics','Metrics','Lab measurements that feed the Performance score.'],['lh-audits','Audits','Each failure expands into the cause and the fix.']],
  tasks:[['lighthouse','Click <b>Analyze page load</b>.'],['a11y-100','Fix the contrast: Elements ▸ <code>.btn.cta</code> ▸ background <code>#B3401F</code>. Run again for Accessibility 100.'],['lh-desktop','Switch Device to <b>Desktop</b> and compare.']],
  keys:[],facts:['Lighthouse is lab data from one simulated run. Real-user field data (CrUX) can differ.','Scores wobble a few points between runs; compare trends, not single numbers.']},
 device:{c:'var(--margin)',k:'Device toolbar',t:'Device mode',l:'Shrinks the viewport to a phone or tablet and emulates its pixel ratio and touch input, so you can check responsive layouts without a device.',
  map:[['dev-bar','Device toolbar','Preset, width × height, zoom, pixel ratio, throttling, rotate.'],['dev-mq','Media-query bars','One bar per breakpoint in the site’s CSS. Click one to jump to it.'],['dev-frame','Viewport','The emulated screen. In Responsive, drag the handle on the right edge to resize.']],
  tasks:[['device','Toggle the toolbar with the phone icon or <code>Ctrl+Shift+M</code>.'],['dev-preset','Pick <b>iPhone SE</b>. The cards stack into one column.'],['dev-rotate','Rotate to landscape with ⟲.'],['dev-mq','Click a media-query bar.'],['dev-drag','Choose Responsive and drag the handle.']],
  keys:[[['Ctrl','Shift','M'],['⌘','⇧','M'],'Toggle device toolbar']],facts:['Emulation is not a real phone: it doesn’t reproduce mobile GPUs or real network radios. Use remote debugging for that.','Add CPU throttling to feel how slow a mid-range phone is.']},
 drawer:{c:'var(--border)',k:'Drawer',t:'The drawer',l:'A second pane under any panel (Esc). It holds the Console plus tools that don’t need a whole panel.',
  map:[['drw-tabs','Drawer tabs','Console, Rendering, Coverage, Changes, Issues. More under ⋮ ▸ More tools.'],['drw-body','Tool','Rendering overlays, coverage report, CSS diff or the issue list.']],
  tasks:[['drawer','Press <code>Esc</code> in any panel to open the drawer.'],['rendering-paint','Rendering ▸ Paint flashing, then click Add in the page.'],['rendering-fps','Rendering ▸ Frame Rendering Stats.'],['rendering-vision','Rendering ▸ emulate Protanopia and check the orange button.'],['coverage','Coverage ▸ start instrumenting and reload.'],['drawer-changes','Edit a style, then open Changes.']],
  keys:[[['Esc'],['Esc'],'Toggle drawer']],facts:['Coverage rows open in Sources with used (blue) and unused (red) lines marked.']},
 cmd:{c:'var(--act)',k:'Command menu',t:'Command menu',l:'Every DevTools action by name. Faster than hunting for a menu, and many tools only live here.',
  map:[],tasks:[['command','Run a command: try <code>screenshot</code>, <code>dark</code> or <code>offline</code>.']],
  keys:[[['Ctrl','Shift','P'],['⌘','⇧','P'],'Run command'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all sources']],facts:['Prefixes: <b>&gt;</b> command, <b>!</b> snippet, <b>@</b> symbol, <b>:</b> line, <b>?</b> help.']}};
const DONE=new Set(store.get('done',[]));let GKEY='elements';let showPins=store.get('pins',true);
bus.on('task',t=>{if(!DONE.has(t)){DONE.add(t);store.set('done',[...DONE]);renderGuide()}});
function setGuide(k){GKEY=k;renderGuide();placePins()}
function renderGuide(){const g=GUIDE[GKEY]||GUIDE.elements;const G=$('#guide');const done=g.tasks.filter(t=>DONE.has(t[0])).length;
 G.style.setProperty('--c',g.c);G.innerHTML=`<header><div class="gk">${esc(g.k)}</div><h2>${esc(g.t)}</h2><p class="gl">${g.l}</p>${g.tasks.length>1?`<div class="progress" aria-label="${done} of ${g.tasks.length} tried">${g.tasks.map(t=>`<i class="${DONE.has(t[0])?'on':''}"></i>`).join('')}</div>`:''}</header>
 ${g.map.length?`<section><h3>What you’re looking at <button id="pinTog" aria-pressed="${showPins}">${showPins?'Hide':'Show'} labels</button></h3><ol class="map">${g.map.map((m,i)=>`<li data-hs="${m[0]}"><span class="n">${i+1}</span><span><b>${m[1]}.</b> ${m[2]}</span></li>`).join('')}</ol></section>`:''}
 <section><h3>Try it · ${done}/${g.tasks.length}</h3><ul class="tasks">${g.tasks.map(t=>`<li class="${DONE.has(t[0])?'done':''}"><i></i><span>${t[1]}</span></li>`).join('')}</ul></section>
 ${g.keys.length?`<section><h3>Shortcuts</h3><div class="gkeys">${g.keys.map(k=>`<div><span>${esc(k[2])}</span><span class="ks">${kc(K(k[0],k[1]))}</span></div>`).join('')}</div></section>`:''}
 <section><h3>Good to know</h3><ul class="facts">${g.facts.map(f=>`<li>${f}</li>`).join('')}</ul></section>`;
 const pt=$('#pinTog');if(pt)pt.onclick=()=>{showPins=!showPins;store.set('pins',showPins);renderGuide();placePins()};
 $$('.map li',G).forEach(li=>{li.onmouseenter=()=>spot(li.dataset.hs);li.onmouseleave=()=>spot(null)})}
function hsTarget(k){return $$(`#browser [data-hs="${k}"]`).find(el=>el.offsetParent!==null&&el.getBoundingClientRect().width>0)}
function spot(k,ms){$$('#browser .spot').forEach(s=>s.remove());if(!k)return;const t=hsTarget(k);if(!t)return;const b=$('#browser').getBoundingClientRect(),r=t.getBoundingClientRect();const x=Math.max(0,r.left-b.left),y=Math.max(0,r.top-b.top),w=Math.min(b.width-x,r.width),hh=Math.min(b.height-y,r.height);
 const s=h(`<div class="spot" style="left:${x-3}px;top:${y-3}px;width:${w+6}px;height:${hh+6}px"></div>`);$('#browser').appendChild(s);if(ms)setTimeout(()=>s.remove(),ms)}
let pinT;function placePins(){clearTimeout(pinT);pinT=setTimeout(()=>{$$('#browser .pin').forEach(p=>p.remove());if(!showPins)return;const g=GUIDE[GKEY];if(!g)return;const b=$('#browser').getBoundingClientRect();
 g.map.forEach((m,i)=>{const t=hsTarget(m[0]);if(!t)return;const r=t.getBoundingClientRect();let x=r.right-b.left-14,y=r.top-b.top+12;if(r.width<60)x=r.left-b.left+r.width/2;if(x<8||y<8||x>b.width-8||y>b.height-8)return;const p=h(`<div class="pin" style="left:${x}px;top:${y}px">${i+1}</div>`);$('#browser').appendChild(p)})},60)}

/* ---------- key strip ---------- */
function updateKeys(){const ks=[[K(['F12'],['F12']),'Toggle DevTools',()=>toggleDevtools(),()=>ST.open],[K(['Ctrl','Shift','C'],['⌘','⇧','C']),'Inspect',()=>{if(!ST.open)toggleDevtools(true);setInspect(!ST.inspecting)},()=>ST.inspecting],[K(['Ctrl','Shift','M'],['⌘','⇧','M']),'Device',()=>{if(!ST.open)toggleDevtools(true);setDevice(!ST.device)},()=>ST.device],[['Esc'],'Drawer',()=>{if(!ST.open)toggleDevtools(true);toggleDrawer()},()=>ST.drawer],[K(['Ctrl','Shift','P'],['⌘','⇧','P']),'Command menu',()=>{if(!ST.open)toggleDevtools(true);openCmd('>')}],[K(['Ctrl','P'],['⌘','P']),'Open file',()=>{if(!ST.open)toggleDevtools(true);openCmd('')}],[['⟳'],'Reload page',()=>reloadPage()],[['⇄'],'Dock side',()=>{if(!ST.open)toggleDevtools(true);setDock(ST.dock==='bottom'?'right':'bottom')}]];
 const box=$('#keys');box.innerHTML='';ks.forEach(([k,l,act,st])=>{const b=h(`<button class="keybtn" ${st?`aria-pressed="${!!st()}"`:''}>${kc(k)}<span>${esc(l)}</span></button>`);b.onclick=()=>{act();updateKeys()};box.appendChild(b)})}
bus.on('task',()=>updateKeys());

/* ================= page sections ================= */
const CHAPS=[[0,'Intro','#6FA8DC'],[3.75,'Open it','#8AB4F8'],[7.5,'Elements','#6FA8DC'],[13.125,'Styles','#93C47D'],[16.875,'Console','#FFE599'],[22.5,'Sources','#F6B26B'],[28.125,'Network','#3FD8F2'],[33.75,'Performance','#FF4F8B'],[39.375,'Memory','#B388FF'],[43.125,'Application','#93C47D'],[46.875,'Device mode','#F6B26B'],[50.625,'Lighthouse','#81C995'],[54.375,'Power tools','#FF4F8B'],[58.125,'Outro','#FFE599']];
(()=>{const v=$('#vid'),ol=$('#chap');ol.innerHTML=CHAPS.map(([t,l,c],i)=>`<li><button data-t="${t}" style="--c:${c}"><time>${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}</time><i></i>${l}</button></li>`).join('');
 ol.onclick=e=>{const b=e.target.closest('button');if(!b)return;v.currentTime=+b.dataset.t+0.01;v.play().catch(()=>{})};
 v.addEventListener('timeupdate',()=>{let cur=0;CHAPS.forEach((c,i)=>{if(v.currentTime>=c[0])cur=i});$$('button',ol).forEach((b,i)=>b.classList.toggle('on',i===cur))})})();
const SC=[['Open & move around','#6FA8DC',[[['F12'],['F12'],'Toggle DevTools'],[['Ctrl','Shift','I'],['⌘','⌥','I'],'Open DevTools'],[['Ctrl','Shift','J'],['⌘','⌥','J'],'Open Console'],[['Ctrl','Shift','C'],['⌘','⇧','C'],'Inspect element'],[['Ctrl','Shift','P'],['⌘','⇧','P'],'Command menu'],[['Ctrl','P'],['⌘','P'],'Open file'],[['Ctrl','['],['⌘','['],'Previous panel'],[['Ctrl',']'],['⌘',']'],'Next panel'],[['Ctrl','Shift','D'],['⌘','⇧','D'],'Switch dock side'],[['Esc'],['Esc'],'Toggle drawer']]],
 ['Elements','#93C47D',[[['H'],['H'],'Hide selected node'],[['Del'],['⌫'],'Delete node'],[['F2'],['F2'],'Edit as HTML'],[['Ctrl','Z'],['⌘','Z'],'Undo'],[['Alt','click'],['⌥','click'],'Expand all children'],[['Ctrl','F'],['⌘','F'],'Search the DOM'],[['↑'],['↑'],'Value +1 (Shift ×10, Alt ×0.1)'],[['Shift','click'],['⇧','click'],'Color swatch: cycle formats']]],
 ['Console','#FFE599',[[['Ctrl','L'],['⌘','K'],'Clear console'],[['Tab'],['Tab'],'Accept suggestion'],[['Shift','Enter'],['⇧','Enter'],'New line'],[['↑','↓'],['↑','↓'],'Command history'],[['Ctrl','U'],['⌘','U'],'Clear the prompt']]],
 ['Sources & debugger','#F6B26B',[[['F8'],['F8'],'Pause / resume'],[['F10'],['F10'],'Step over'],[['F11'],['F11'],'Step into'],[['Shift','F11'],['⇧','F11'],'Step out'],[['Ctrl','B'],['⌘','B'],'Toggle breakpoint'],[['Ctrl','Shift','F'],['⌘','⌥','F'],'Search all files'],[['Ctrl','O'],['⌘','O'],'Go to file'],[['Ctrl','Shift','O'],['⌘','⇧','O'],'Go to symbol'],[['Ctrl','Enter'],['⌘','Enter'],'Run snippet']]],
 ['Network & reload','#8AB4F8',[[['Ctrl','Shift','R'],['⌘','⇧','R'],'Hard reload'],[['Ctrl','R'],['⌘','R'],'Reload'],[['Ctrl','E'],['⌘','E'],'Start / stop network log'],[['Shift','hover'],['⇧','hover'],'Initiator / dependents']]],
 ['Performance','#FF5C8A',[[['Ctrl','E'],['⌘','E'],'Start / stop recording'],[['Ctrl','Shift','E'],['⌘','⇧','E'],'Record and reload'],[['W','S'],['W','S'],'Zoom in / out'],[['A','D'],['A','D'],'Pan left / right']]],
 ['Device mode','#B388FF',[[['Ctrl','Shift','M'],['⌘','⇧','M'],'Toggle device toolbar'],[['Ctrl','Shift','P'],['⌘','⇧','P'],'…then “screenshot” for full-page captures']]]];
function renderShortcuts(){$('#kgrid').innerHTML=SC.map(([t,c,rows])=>`<div class="kgroup" style="--c:${c}"><h3>${t}</h3>${rows.map(r=>`<div class="krow"><span>${esc(r[2])}</span><span class="ks">${kc(K(r[0],r[1]))}</span></div>`).join('')}</div>`).join('')}
$$('.oskey button').forEach(b=>b.onclick=()=>{OSK.os=b.dataset.os;store.set('os',OSK.os);$$('.oskey button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderShortcuts();renderGuide();updateKeys()});
$$('.oskey button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.os===OSK.os));
const TRIAGE=[['“The button looks wrong.”','Elements ▸ Styles','#6FA8DC','See which rule wins and edit it live.',()=>{setPanel('elements');select(PAGE.q('.btn.cta'));EL.sub='styles';renderSide()},'el-styles'],
 ['“Something is undefined” or a red error appeared.','Console','#FFE599','Errors with the file and line, plus a prompt to poke at values.',()=>setPanel('console'),'con-log'],
 ['“The total comes out wrong.”','Sources ▸ breakpoint','#F6B26B','Pause inside calcTotal and watch the numbers change.',()=>{SRC.open('cart.js',11);if(!SRC.bps.has('cart.js:11'))toggleBp('cart.js',11)},'src-editor'],
 ['“An API call fails” or “the page loads slowly.”','Network','#8AB4F8','Status codes, payloads and the timing waterfall.',()=>{setPanel('network');reloadPage()},'net-waterfall'],
 ['“Clicking feels laggy.”','Performance','#FF5C8A','Record the click and look for long tasks.',()=>setPanel('performance'),'perf-tb'],
 ['“The tab gets heavier the longer it’s open.”','Memory','#B388FF','Compare heap snapshots; hunt detached nodes.',()=>setPanel('memory'),'mem-tb'],
 ['“I’m logged out” or “old data after a deploy.”','Application','#93C47D','Cookies, storage and the service worker cache.',()=>{setPanel('application');AP.view='cookies';renderApp()},'app-view'],
 ['“It breaks on phones.”','Device mode','#F6B26B','Emulate a phone viewport and touch.',()=>{if(!ST.device)setDevice(true)},'dev-bar'],
 ['“Our SEO or accessibility score is low.”','Lighthouse','#81C995','An audit with the fix for each failure.',()=>setPanel('lighthouse'),'lh-form'],
 ['“We ship too much CSS and JS.”','Coverage','#FF5C8A','Bytes that never ran, per file and per line.',()=>openDrawer('coverage'),'drw-body'],
 ['“It has to work offline.”','Application ▸ Service workers','#93C47D','Toggle offline and watch requests fail.',()=>{setPanel('application');AP.view='sw';renderApp()},'app-view'],
 ['“Which request started this one?”','Network ▸ Initiator','#8AB4F8','Hold Shift over a row, or open its Initiator tab.',()=>setPanel('network'),'net-table']];
$('#tgrid').innerHTML=TRIAGE.map((t,i)=>`<button class="tcard" data-i="${i}" style="--c:${t[2]}"><q>${t[0].replace(/[“”]/g,'')}</q><span>→ ${esc(t[1])}</span><small>${esc(t[3])}</small></button>`).join('');
$('#tgrid').onclick=e=>{const b=e.target.closest('.tcard');if(!b)return;const t=TRIAGE[+b.dataset.i];if(!ST.open)toggleDevtools(true);document.getElementById('sim').scrollIntoView({behavior:'smooth'});t[4]();setTimeout(()=>{spot(t[5],2600)},650)};

/* ================= boot ================= */
applyCSS();wirePage();renderCart();
window.addEventListener('load',()=>{});
reloadPage(true);updateKeys();setPanel('elements');renderShortcuts();
$('#browser').addEventListener('scroll',placePins,true);new ResizeObserver(()=>placePins()).observe($('#browser'));

</script>
```

