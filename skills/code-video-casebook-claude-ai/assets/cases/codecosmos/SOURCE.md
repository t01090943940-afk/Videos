# codecosmos · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show codecosmos <路径>`；还原成真实目录：`python3 scripts/casebook.py copy codecosmos <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `music.py` | 211 | 21 |
| 2 | `render.mjs` | 29 | 237 |
| 3 | `web/engine.js` | 163 | 271 |
| 4 | `web/index.html` | 8 | 439 |
| 5 | `web/lib.js` | 67 | 452 |
| 6 | `web/scenes_a.js` | 441 | 524 |
| 7 | `web/scenes_b.js` | 397 | 970 |
| 8 | `web/scenes_c.js` | 328 | 1372 |
| 9 | `web/shots.js` | 37 | 1705 |

---

### 1/9 · `music.py`
<!-- casebook-file {"path": "music.py", "lines": 211, "final_newline": true, "sha256": "34fe4340ef6a00c487a0f0cb9b84c951eb5d5ec01a8c4ebae0213a0f2e761f6c", "original_sha256": "34fe4340ef6a00c487a0f0cb9b84c951eb5d5ec01a8c4ebae0213a0f2e761f6c"} -->
```python
import numpy as np, json, subprocess
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100; BPM = 120; BEAT = 60 / BPM; DUR = 68.0
N = int(SR * DUR) + SR
rs = np.random.RandomState(7)
dry = np.zeros((N, 2)); send = np.zeros((N, 2)); drums = np.zeros((N, 2)); music = np.zeros((N, 2))

# shot table (beats) mirrored from shots.js
SH = [('terminal',6),('hexdump',6),('raymarch',4),('kinetic',4),('tesseract',6),('plasma',4),('graph',4),('ide',6),('pixel',4),('ascii',6),
      ('lowpoly',4),('ca',4),('pointcloud',6),('galaxy',4),('spacetime',6),('glitch',4),('parallax',4),('voxel',4),('rain',4),('cards',6),
      ('dataviz',4),('lightcone',4),('volume',4),('iso',6),('math',4),('scope',6),('tui',6),('loop',6)]
starts = []; acc = 0
for n, b in SH: starts.append((n, acc, b)); acc += b
assert acc == 136

def T(t): return int(t * SR)
def env_exp(n, d): return np.exp(-np.arange(n) / (d * SR))
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def put(buf, t, sig, g=1.0, pan=0.0):
    i = T(t); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[:j - i] * g
    buf[i:j, 0] += s * np.sqrt(0.5 * (1 - pan)) * 1.414; buf[i:j, 1] += s * np.sqrt(0.5 * (1 + pan)) * 1.414
def saw(f, n, ph=0.0):
    t = np.arange(n) / SR; return 2 * ((f * t + ph) % 1) - 1

# ---------- instruments ----------
def kick(g=1.0, big=False):
    n = T(0.5 if big else 0.35); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.03) + (30 * np.exp(-t / 0.2) if big else 0)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.28 if big else 0.16)
    s[:200] += rs.randn(200) * 0.3 * np.linspace(1, 0, 200)
    return np.tanh(s * 1.6) * g
def clap():
    n = T(0.3); x = bp(rs.randn(n), 900, 4000); e = env_exp(n, 0.09)
    for d in (0.0, 0.011, 0.022): e[T(d):T(d) + 60] += 0.6
    return x * e * 0.5
def snare():
    n = T(0.18); x = bp(rs.randn(n), 1200, 7000) * env_exp(n, 0.06)
    t = np.arange(n) / SR; x += np.sin(2 * np.pi * 190 * t) * env_exp(n, 0.04) * 0.5
    return x * 0.6
def hat(open_=False):
    n = T(0.25 if open_ else 0.05); return hp(rs.randn(n), 7000) * env_exp(n, 0.08 if open_ else 0.015) * 0.35
def click():  # keyboard
    n = T(0.012); return hp(rs.randn(n), 2500) * env_exp(n, 0.003) * 0.6
def beep(f=1200, d=0.05):
    n = T(d); t = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * f * t)) * env_exp(n, d / 3) * 0.12
def shutter():
    n = T(0.14); x = hp(rs.randn(n), 1800) * 0.0
    for d, g in ((0.0, 1.0), (0.055, 0.7)):
        k = T(0.02); x[T(d):T(d) + k] += hp(rs.randn(k), 2000) * env_exp(k, 0.004) * g
    return x * 0.9
def impact(g=1.0, dur=1.6):
    n = T(dur); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t / 0.5) + 28) / SR) * env_exp(n, 0.5)
    ns = lp(rs.randn(n), 3000) * env_exp(n, 0.35) * 0.6
    return np.tanh((sub + ns) * 1.5) * g
def whoosh(d=0.35, g=0.35):
    n = T(d); x = bp(rs.randn(n), 400, 5000); e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return x * e * g
def pluck(f, d=0.22, g=0.2):
    n = T(d); s = saw(f, n) + 0.5 * saw(f * 1.005, n); s = lp(s, min(9000, f * 6)); return s * env_exp(n, d / 3) * g
def supersaw(fs, d, cutoff=2500, g=0.08):
    n = T(d); s = np.zeros(n)
    for f in fs:
        for det in (-0.012, -0.005, 0, 0.006, 0.013): s += saw(f * (1 + det), n, rs.rand())
    s = lp(s, cutoff); a = np.minimum(1, np.arange(n) / T(0.02)); r = np.minimum(1, (n - np.arange(n)) / T(0.1))
    return s * a * r * g
def pad(fs, d, cutoff=900, g=0.05):
    n = T(d); s = np.zeros(n); t = np.arange(n) / SR
    for f in fs:
        for det in (-0.004, 0.004): s += np.sin(2 * np.pi * f * (1 + det) * t) + 0.3 * saw(f * (1 + det), n)
    s = lp(s, cutoff); a = np.minimum(1, t / 0.4); r = np.minimum(1, (d - t) / 0.4)
    return s * a * r * g
def riser(d, g=0.3):
    n = T(d); x = rs.randn(n); out = np.zeros(n); y = 0.0
    cut = np.geomspace(300, 12000, n); a = 1 - np.exp(-2 * np.pi * cut / SR)
    for i in range(n): y += a[i] * (x[i] - y); out[i] = y
    t = np.arange(n) / SR; tone = saw(1, n) * 0
    f = np.geomspace(110, 880, n); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return (out + tone) * (np.linspace(0, 1, n) ** 2) * g

# ---------- harmony ----------
A2, C3, D3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4 = 110, 130.81, 146.83, 164.81, 174.61, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440
Gs3 = 207.65
PROG1 = [([A3, C4, E4], 55), ([F3, A3, C4], 43.65), ([C4, E4, G4], 65.41), ([G3, B3, D4], 49)]
PROG3 = [([A3, C4, E4], 55), ([F3, A3, C4], 43.65), ([D3 * 2, F4, A4], 73.42), ([E3 * 2, Gs3 * 2, B3 * 2], 41.2)]

def groove(b0, b1, prog, lead=False, cutoff=3000, drums_on=True, hats=True):
    for b in range(b0, b1):
        t = b * BEAT; bar = (b // 4) % 4; chord, root = prog[bar]
        if drums_on:
            put(drums, t, kick(0.95))
            if b % 2 == 1: put(drums, t, clap(), 0.8)
            if hats:
                put(drums, t + BEAT / 2, hat(True), 0.5, 0.2)
                for k in (1, 3): put(drums, t + k * BEAT / 4, hat(), 0.35, -0.3)
        # offbeat bass
        for k in (1, 2, 3):
            n = T(BEAT / 4 * 0.9); s = saw(root * 2, n) + saw(root * 2 * 1.01, n) + np.sin(2 * np.pi * root * np.arange(n) / SR) * 1.5
            put(music, t + k * BEAT / 4, lp(s, 600) * env_exp(n, 0.12) * 0.22)
        if b % 4 == 0: put(music, t, supersaw(chord, 4 * BEAT, cutoff, 0.05), 1.0)
        # arp 16ths
        tones = chord + [c * 2 for c in chord]
        for k in range(4):
            idx = (b * 4 + k) % 6; put(send, t + k * BEAT / 4, pluck(tones[[0, 1, 2, 3, 2, 1][idx]] * 2, 0.18, 0.09), 1.0, (-.4, .4)[k % 2])
        if lead and b % 2 == 0:
            mel = [chord[2] * 2, chord[1] * 2, chord[0] * 2, chord[1] * 2][(b // 2) % 4]
            put(send, t, supersaw([mel], BEAT * 0.9, 5000, 0.06))

# ---------- arrangement ----------
# intro 0-8s: drone + typing + blips + riser + roll
put(music, 0, pad([A2, E3, A3], 8.2, 700, 0.07))
cmd = './universe --before-time'
for i in range(len(cmd) + 2): put(dry, 0.35 + i / 26, click(), 0.5 + 0.3 * rs.rand(), rs.uniform(-.3, .3))
outT = 0.35 + len(cmd) / 26 + 0.1
for i in range(4): put(dry, outT + i * 0.22, beep(900 + i * 150), 1.0)
for b in range(0, 16, 2): put(drums, b * BEAT, kick(0.35))  # heartbeat
penta = [880, 987.8, 1174.7, 1318.5, 1568, 1760]
for i in range(60):
    tt = 3 + rs.rand() * 3; put(send, tt, pluck(penta[rs.randint(6)] * (2 if rs.rand() < .3 else 1), 0.08, 0.05), 1, rs.uniform(-.8, .8))
put(dry, 4.0, riser(4.0, 0.35))
roll = []
tt = 6.0
while tt < 7.95:
    k = (tt - 6) / 2; put(drums, tt, snare(), 0.15 + 0.6 * k); tt += BEAT / (2 if k < .5 else 4 if k < .8 else 8)
# DROP
put(dry, 8.0, impact(1.0, 2.2)); put(drums, 8.0, kick(1.0, True))
for b in (16, 17, 18): put(drums, b * BEAT, kick(1.0, True)); put(dry, b * BEAT, whoosh(0.3, 0.3))
groove(16, 44, PROG1, lead=False, cutoff=2600)
# dark ages breakdown 22-25s (beats 44-50)
put(music, 22, pad([A2, C3, E3, A3], 3.2, 500, 0.08))
put(dry, 23.0, riser(2.0, 0.3))
tt = 24.0
while tt < 24.97: put(drums, tt, snare(), 0.2 + 0.5 * (tt - 24)); tt += BEAT / 4 if tt < 24.5 else BEAT / 8
put(dry, 25.0, impact(0.8, 1.6))
groove(50, 90, PROG1, lead=True, cutoff=4200)
# you are here 45-48 (beats 90-96)
put(dry, 45.0, impact(0.8, 1.4))
put(music, 45.5, pad([A3, C4, E4, A4], 2.6, 1400, 0.06))
for b in (91, 93, 95): put(drums, b * BEAT, kick(0.6))
put(dry, 46.5, riser(1.5, 0.28))
tt = 47.25
while tt < 47.97: put(drums, tt, snare(), 0.5); tt += BEAT / 8
# groove 3 darker 48-59 (beats 96-118)
put(dry, 48.0, impact(0.8, 1.4))
groove(96, 118, PROG3, lead=True, cutoff=3200)
# black hole era 59-62 (beats 118-124): thin drums, rising tension
groove(118, 124, PROG3, lead=False, cutoff=1200, hats=False)
put(dry, 59.0, riser(2.3, 0.3))
put(dry, 59.0 + 0.93 * 2.5, impact(0.9, 1.8))
# heat death 62-65: tape stop is applied below, then ticking clock
put(music, 62.0, pad([A2 / 2, A2], 6.0, 300, 0.09))
for b in range(124, 130): put(dry, b * BEAT, beep(2400, 0.015), 0.6); put(dry, b * BEAT + 0.25, beep(1800, 0.015), 0.4)
# loop terminal 65-68
lt = 65.0
for i, d in enumerate((0, .45, .8)): put(dry, lt + d, beep(700 + i * 120), 0.9)
for i in range(6): put(dry, lt + 0.9 + i / 14, click(), 0.6)
put(dry, lt + 1.55, whoosh(0.4, 0.25))
put(music, 65.2, pad([A2, E3, A3], 2.8, 700, 0.07))

# cut hits + freeze shutters
for n, b0, b in starts:
    t0 = b0 * BEAT
    if b0 > 0 and n not in ('kinetic',): put(dry, t0 - 0.12, whoosh(0.2, 0.18))
    if n != 'loop':
        tf = (b0 + b - 1) * BEAT
        put(dry, tf, shutter(), 1.0); put(dry, tf, kick(0.5)); put(send, tf, beep(3200, 0.03), 0.4)

# ---------- mix ----------
# sidechain on music
sc = np.ones(N)
for b in range(16, 124):
    if 90 <= b < 96 or 44 <= b < 50: continue
    i = T(b * BEAT); n = T(0.3); e = 1 - 0.75 * np.exp(-np.arange(n) / (0.07 * SR)); sc[i:i + n] = np.minimum(sc[i:i + n], e)
music *= sc[:, None]
ir_n = T(1.8); ir = rs.randn(ir_n, 2) * env_exp(ir_n, 0.45)[:, None]; ir = np.stack([lp(ir[:, 0], 6000), lp(ir[:, 1], 6000)], 1)
wet = np.stack([fftconvolve(send[:, c] + music[:, c] * 0.25, ir[:, c])[:N] for c in range(2)], 1) * 0.08
mix = drums + music + send + dry * 0.9 + wet

# glitch stutter in supernova shot (starts beat 74 -> 37s): stutter at 37.5 and 38.25
for ts in (37.5, 38.25):
    i = T(ts); L = T(BEAT / 8)
    seg = mix[i:i + L].copy()
    for k in range(4): mix[i + k * L:i + (k + 1) * L] = seg * (1 - k * .15)

# tape stop at 62.0 over 0.9s
i0 = T(62.0); L = T(0.9)
speed = np.linspace(1, 0, L) ** 1.3
pos = i0 + np.cumsum(speed)
src = mix[i0:i0 + L + 10].copy()
tape = np.stack([np.interp(pos - i0, np.arange(len(src)), src[:, c]) for c in range(2)], 1) * np.linspace(1, .3, L)[:, None]
after = mix[i0 + L:].copy()
mix[i0:i0 + L] = tape
# after tape stop keep only quiet elements: rebuild from 'dry' + pad (music after 62 already only pad)
keep = (dry * 0.9 + music + send * 0.5)[i0 + L:]
mix[i0 + L:] = keep

mix = mix[:T(DUR)]
# gentle fades for loop
mix[:T(0.02)] *= np.linspace(0, 1, T(0.02))[:, None]
mix[-T(0.3):] *= np.linspace(1, 0, T(0.3))[:, None]
mix = hp(mix.T, 25).T
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix = mix / np.max(np.abs(mix)) * 0.93
wavfile.write('/home/claude/cv/music.wav', SR, (mix * 32767).astype(np.int16))
print('ok', mix.shape[0] / SR)
```

### 2/9 · `render.mjs`
<!-- casebook-file {"path": "render.mjs", "lines": 29, "final_newline": true, "sha256": "f161a35e013efd2b96f97c227d4665dc7457cc9bd501cca77285102dcb175e75", "original_sha256": "f161a35e013efd2b96f97c227d4665dc7457cc9bd501cca77285102dcb175e75"} -->
```js
import { chromium } from 'playwright';
import fs from 'fs';
import http from 'http';
import path from 'path';
const root = path.resolve('web');
const types = { '.js':'text/javascript', '.html':'text/html', '.json':'application/json' };
const srv = http.createServer((q,r)=>{ let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f+='index.html';
  fs.readFile(f,(e,d)=>{ if(e){r.writeHead(404);r.end();return;} r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}); r.end(d); }); }).listen(8765);
const args = process.argv.slice(2);
const outDir = args[0]; const frames = args[1] ? args[1].split(',').flatMap(s=>{ if(s.includes('-')){const [a,b]=s.split('-').map(Number); return Array.from({length:b-a+1},(_,i)=>a+i);} return [Number(s)]; }) : null;
fs.mkdirSync(outDir,{recursive:true});
const b = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:1920,height:1080}});
p.on('console', m=>{ if(m.type()==='error') console.log('console:', m.text()); });
p.on('pageerror', e=>console.log('pageerror:', e.message));
await p.goto('http://localhost:8765/index.html');
await p.waitForFunction(()=>window.READY||window.ERR, null, {timeout:60000});
const err = await p.evaluate(()=>window.ERR); if (err) { console.log('ERR', err); process.exit(1); }
await p.evaluate(()=>document.fonts.ready);
const total = await p.evaluate(()=>window.TOTAL_FRAMES);
const list = frames || Array.from({length: total}, (_,i)=>i);
const t0 = Date.now(); let n=0;
for (const f of list) {
  const url = await p.evaluate((f)=>{ window.renderFrame(f); return document.getElementById('out').toDataURL('image/jpeg', 0.93); }, f);
  fs.writeFileSync(`${outDir}/f${String(f).padStart(5,'0')}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  n++; if (n % 50 === 0) console.log(`${n}/${list.length}  ${((Date.now()-t0)/n).toFixed(0)} ms/f`);
}
console.log('done', n, ((Date.now()-t0)/n).toFixed(0), 'ms/f');
await b.close(); srv.close();
```

### 3/9 · `web/engine.js`
<!-- casebook-file {"path": "web/engine.js", "lines": 163, "final_newline": true, "sha256": "40d6d6bf0d5fba7fed6d17b6fd9d8e3eb0f78584ed9d2419c1601590f2ef960c", "original_sha256": "40d6d6bf0d5fba7fed6d17b6fd9d8e3eb0f78584ed9d2419c1601590f2ef960c"} -->
```js
import * as THREE from 'three';
import { SHOTS, FPB, FPS, TOTAL_FRAMES } from './shots.js';
import { W, H, MONO, SANS, rng, clamp, lerp, easeOut, back, makeCanvas } from './lib.js';
import { SCENES as A } from './scenes_a.js';
import { SCENES as B } from './scenes_b.js';
import { SCENES as C } from './scenes_c.js';
const SCENES = { ...A, ...B, ...C };

const out = document.getElementById('out');
const octx = out.getContext('2d');
const sceneCanvas = makeCanvas(); const sctx = sceneCanvas.getContext('2d');
const glCanvas = makeCanvas();
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
let glScale = 1;
const GL = {
  THREE, renderer, canvas: glCanvas,
  draw(ctx, scene, cam, scale = 1) {
    if (scale !== glScale) { renderer.setSize(Math.round(W * scale), Math.round(H * scale), false); glScale = scale; }
    renderer.render(scene, cam);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(glCanvas, 0, 0, W, H); ctx.restore();
  },
};
export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };

const inited = new Set();
const vignette = (() => { const c = makeCanvas(); const x = c.getContext('2d');
  const g = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.72)'); x.fillStyle = g; x.fillRect(0, 0, W, H); return c; })();

function locate(F) {
  const beat = F / FPB;
  let i = SHOTS.findIndex(s => beat >= s.start && beat < s.start + s.b); if (i < 0) i = SHOTS.length - 1;
  return i;
}

function drawScene(i, sf, liveFrames) {
  const s = SHOTS[i], sc = SCENES[s.id];
  if (!sc) { sctx.fillStyle = '#300'; sctx.fillRect(0, 0, W, H); sctx.fillStyle = '#fff'; sctx.font = `60px ${MONO}`; sctx.fillText('TODO ' + s.id, 100, 200); return; }
  const env = { t: sf / FPS, f: sf, p: clamp(sf / Math.max(1, liveFrames - 1)), beat: sf / FPB, live: liveFrames / FPS,
    liveFrames, GL, shot: s, acc: ACC[s.dim] };
  if (!inited.has(s.id)) { sc.init && sc.init(env); inited.add(s.id); }
  sctx.save(); sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalAlpha = 1; sctx.globalCompositeOperation = 'source-over';
  sc.draw(sctx, env); sctx.restore();
}

function roundRect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }

function hud(i, lf, freeze, F) {
  const s = SHOTS[i], acc = ACC[s.dim], c = octx;
  c.save();
  let g = c.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, 150);
  g = c.createLinearGradient(0, 800, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.82)');
  c.fillStyle = g; c.fillRect(0, 800, W, H - 800);
  // top-left brand + counter
  c.textBaseline = 'alphabetic';
  c.font = `bold 22px ${MONO}`; c.fillStyle = 'rgba(255,255,255,.9)'; c.fillText('CODE × COSMOS', 60, 70);
  c.font = `20px ${MONO}`; c.fillStyle = acc;
  const n = String(i + 1).padStart(2, '0');
  c.fillText(`SHOT ${n}/${SHOTS.length}  ·  STYLE #${n}`, 60, 102);
  // top-right dimension chips
  const dims = ['2D', '2.5D', '3D', '4D']; let x = W - 60;
  c.font = `bold 22px ${MONO}`; c.textAlign = 'center';
  for (let k = dims.length - 1; k >= 0; k--) {
    const d = dims[k], w = d.length > 2 ? 92 : 70; x -= w;
    roundRect(c, x, 44, w, 42, 8);
    if (d === s.dim) { c.fillStyle = ACC[d]; c.fill(); c.fillStyle = '#000'; }
    else { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.stroke(); c.fillStyle = 'rgba(255,255,255,.45)'; }
    c.fillText(d, x + w / 2, 73); x -= 12;
  }
  c.textAlign = 'left';
  // bottom-left event
  c.font = `900 66px ${SANS}`; c.fillStyle = '#fff'; c.fillText(s.ev, 60, 968);
  c.font = `bold 30px ${MONO}`; c.fillStyle = acc; c.fillText(s.t, 62, 1012);
  // bottom-right style
  c.textAlign = 'right';
  c.font = `bold 34px ${MONO}`; c.fillStyle = '#fff'; c.fillText(s.style, W - 60, 942);
  c.font = `500 24px ${SANS}`; c.fillStyle = 'rgba(255,255,255,.75)'; c.fillText(`${s.zh} · ${s.dim}`, W - 60, 976);
  c.font = `20px ${MONO}`; const cw = c.measureText(s.code).width + 28;
  roundRect(c, W - 60 - cw, 990, cw, 34, 6); c.fillStyle = 'rgba(0,0,0,.6)'; c.fill();
  c.strokeStyle = acc; c.globalAlpha = .6; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
  c.fillStyle = acc; c.fillText(s.code, W - 60 - 14, 1014);
  c.textAlign = 'left';
  // timeline
  const x0 = 60, x1 = W - 60, total = SHOTS.reduce((a, b) => a + b.b, 0), gap = 4;
  const usable = x1 - x0 - gap * (SHOTS.length - 1); let xx = x0;
  const resetting = s.id === 'loop' && lf >= (s.b - 1) * FPB; // loop: timeline resets at the very end
  SHOTS.forEach((t, k) => {
    const w = usable * t.b / total;
    let fill = 'rgba(255,255,255,.14)';
    if (!resetting) {
      if (k < i) fill = ACC[t.dim] + 'aa';
      if (k === i) fill = ACC[t.dim];
    } else if (k === 0) fill = ACC['2D'] + '66';
    c.fillStyle = fill; c.fillRect(xx, 1042, w, k === i && !resetting ? 10 : 6);
    xx += w + gap;
  });
  c.font = `13px ${MONO}`; c.fillStyle = 'rgba(255,255,255,.5)';
  c.fillText('BEFORE TIME', x0, 1072); c.textAlign = 'right'; c.fillText('HEAT DEATH → ?', x1, 1072); c.textAlign = 'left';
  c.restore();
}

function stamp(i, k) {
  const s = SHOTS[i], acc = ACC[s.dim], c = octx;
  if (k < 1) return;
  const sc = lerp(1.7, 1, back(Math.min(1, (k - 1) / 1.5)));
  c.save(); c.translate(W / 2 + 520, H / 2 + 200); c.rotate(-0.1); c.scale(sc, sc);
  c.font = `900 54px ${MONO}`; const tw = c.measureText(s.style).width;
  const bw = Math.max(tw, 360) + 56, bh = 150;
  c.fillStyle = 'rgba(0,0,0,.88)'; roundRect(c, -bw / 2, -bh / 2, bw, bh, 10); c.fill();
  c.strokeStyle = acc; c.lineWidth = 6; c.stroke();
  c.textAlign = 'center'; c.fillStyle = acc;
  c.font = `bold 24px ${MONO}`; c.fillText(`#${String(i + 1).padStart(2, '0')} · ${s.dim}`, 0, -30);
  c.font = `900 54px ${MONO}`; c.fillStyle = '#fff'; c.fillText(s.style, 0, 26);
  c.font = `bold 26px ${SANS}`; c.fillStyle = acc; c.fillText(s.zh, 0, 62);
  c.restore();
}

export function renderFrame(F) {
  const i = locate(F), s = SHOTS[i];
  const lf = F - s.start * FPB;
  const noFreeze = s.id === 'loop';
  const liveFrames = noFreeze ? s.b * FPB : (s.b - 1) * FPB;
  const freeze = lf >= liveFrames;
  const sf = freeze ? liveFrames - 1 : lf;
  drawScene(i, sf, liveFrames);
  const r = rng(F * 7919 + 17);
  const c = octx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  if (!freeze) {
    const k = lf % FPB, first = lf === 0;
    let punch = [0.05, 0.028, 0.013, 0.005, 0, 0][k]; if (first) punch = 0.085;
    const scl = 1.02 + punch, rot = (r() - .5) * 0.006, dx = (r() - .5) * 7, dy = (r() - .5) * 7;
    c.translate(W / 2 + dx, H / 2 + dy); c.rotate(rot); c.scale(scl, scl); c.drawImage(sceneCanvas, -W / 2, -H / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = `rgba(0,0,0,${r() * .07})`; c.fillRect(0, 0, W, H); // exposure flicker
    c.drawImage(vignette, 0, 0);
    hud(i, lf, false, F);
    const fl = first ? .6 : (k === 0 ? .12 : (first && k === 1 ? .2 : 0));
    if (fl) { c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, W, H); }
  } else {
    const k = lf - liveFrames; const sign = i % 2 ? 1 : -1;
    c.filter = 'blur(10px) brightness(0.32) saturate(1.4)'; c.drawImage(sceneCanvas, -60, -34, W + 120, H + 68); c.filter = 'none';
    const e = easeOut(Math.min(1, k / 2)); const scl = lerp(1.0, 0.8, e), rot = sign * lerp(0, 0.04, e);
    const jx = (r() - .5) * 3, jy = (r() - .5) * 3;
    c.translate(W / 2 + jx, H / 2 - 30 + jy); c.rotate(rot); c.scale(scl, scl);
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-W / 2 + 18, -H / 2 + 26, W + 40, H + 40);
    c.fillStyle = '#f4f1ea'; c.fillRect(-W / 2 - 22, -H / 2 - 22, W + 44, H + 44);
    c.drawImage(sceneCanvas, -W / 2, -H / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(vignette, 0, 0);
    hud(i, lf, true, F);
    stamp(i, k);
    const fl = [0.85, 0.35, 0.1, 0, 0, 0][k];
    if (fl) { c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, W, H); }
  }
  c.restore();
  return true;
}
window.renderFrame = renderFrame;
window.TOTAL_FRAMES = TOTAL_FRAMES;
window.SHOTS = SHOTS;
window.READY = true;
```

### 4/9 · `web/index.html`
<!-- casebook-file {"path": "web/index.html", "lines": 8, "final_newline": true, "sha256": "e6032afcefa7d9134f91c9b2edce52ac938b078c5354e7f8ac77accf24804d84", "original_sha256": "e6032afcefa7d9134f91c9b2edce52ac938b078c5354e7f8ac77accf24804d84"} -->
```html
<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js"}}</script>
</head><body><canvas id="out" width="1920" height="1080"></canvas>
<script type="module">
window.onerror = (m)=>{ window.ERR = String(m); };
import('./engine.js').catch(e=>{ window.ERR = String(e.stack||e); });
</script></body></html>
```

### 5/9 · `web/lib.js`
<!-- casebook-file {"path": "web/lib.js", "lines": 67, "final_newline": true, "sha256": "d4e49c072e5a13b7913a27d2ea390a824f3462d09d8efb8b0f85341409e2d5d7", "original_sha256": "d4e49c072e5a13b7913a27d2ea390a824f3462d09d8efb8b0f85341409e2d5d7"} -->
```js
// shared helpers
export const W = 1920, H = 1080;
export const MONO = '"DejaVu Sans Mono","Noto Sans Mono CJK SC",monospace';
export const SANS = '"Noto Sans CJK SC","DejaVu Sans",sans-serif';
export const MATH = '"Latin Modern Roman","LM Roman 10","DejaVu Serif",serif';

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = t => Math.pow(clamp(t), 3);
export const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const back = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// value noise
const P = new Uint8Array(512); { const r = rng(7); const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
function grad(h, x, y, z) { const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
export function noise3(x, y, z = 0) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  return lerp(lerp(lerp(grad(P[AA] & 15, x, y, z), grad(P[BA] & 15, x - 1, y, z), u),
    lerp(grad(P[AB] & 15, x, y - 1, z), grad(P[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(P[AA + 1] & 15, x, y, z - 1), grad(P[BA + 1] & 15, x - 1, y, z - 1), u),
      lerp(grad(P[AB + 1] & 15, x, y - 1, z - 1), grad(P[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
}
export function fbm(x, y, z = 0, o = 4) { let s = 0, a = .5, f = 1;
  for (let i = 0; i < o; i++) { s += a * noise3(x * f, y * f, z * f); a *= .5; f *= 2; } return s; }

export function makeCanvas(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// neon line: wide faint + thin bright
export function neon(ctx, pathFn, color, w = 3, glow = 14, a = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
  ctx.globalAlpha = .18 * a; ctx.lineWidth = glow; ctx.beginPath(); pathFn(); ctx.stroke();
  ctx.globalAlpha = .35 * a; ctx.lineWidth = glow * .45; ctx.beginPath(); pathFn(); ctx.stroke();
  ctx.globalAlpha = a; ctx.lineWidth = w; ctx.beginPath(); pathFn(); ctx.stroke(); ctx.restore();
}
export function glowDot(ctx, x, y, r, color, a = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
export function scanlines(ctx, a = .18, gap = 4) {
  ctx.save(); ctx.fillStyle = `rgba(0,0,0,${a})`;
  for (let y = 0; y < H; y += gap) ctx.fillRect(0, y, W, gap / 2); ctx.restore();
}
// simple 3D camera projection for canvas scenes
export function camera(yaw, pitch, dist, fov = 900, cx = W / 2, cy = H / 2) {
  const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return (x, y, z) => {
    let X = x * cy_ - z * sy, Z = x * sy + z * cy_;
    let Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    Z += dist; const k = fov / Math.max(Z, .01);
    return [cx + X * k, cy - Y * k, Z, k];
  };
}
```

### 6/9 · `web/scenes_a.js`
<!-- casebook-file {"path": "web/scenes_a.js", "lines": 441, "final_newline": true, "sha256": "143ae7081ea067a572e3fb814ff7b928abf8e0771faa0eda6633a9860d267580", "original_sha256": "143ae7081ea067a572e3fb814ff7b928abf8e0771faa0eda6633a9860d267580"} -->
```js
import { W, H, MONO, SANS, rng, clamp, lerp, smooth, easeOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

// ---------- shared terminal ----------
export function terminal(ctx, env, lines, opt = {}) {
  ctx.fillStyle = '#0b0906'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1100);
  g.addColorStop(0, 'rgba(255,176,0,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.font = `bold 46px ${MONO}`; ctx.textBaseline = 'alphabetic';
  let y = 250; const x = 150; let lastX = x, lastY = y;
  for (const L of lines) {
    const txt = L.txt;
    ctx.fillStyle = L.col || '#FFB000';
    ctx.globalAlpha = .25; ctx.fillText(txt, x + 2, y + 2); ctx.globalAlpha = 1; // ghost
    ctx.fillText(txt, x, y); lastX = x + ctx.measureText(txt).width; lastY = y; y += 70;
  }
  if (opt.cursor) { ctx.fillStyle = '#FFB000'; ctx.fillRect(lastX + 6, lastY - 40, 26, 48); }
  scanlines(ctx, .22, 4);
}
function typed(s, k) { return s.slice(0, Math.max(0, Math.floor(k))); }

const AMB = '#FFB000', ERR = '#FF5C5C', OK = '#8CFF9E', DIM = '#8a6a1a';

const terminalScene = {
  draw(ctx, env) {
    const t = env.t, f = env.f;
    const cmd = './universe --before-time';
    const k = (t - 0.35) * 26; // chars typed
    const lines = [{ txt: '$ ' + typed(cmd, k), col: AMB }];
    const outT = 0.35 + cmd.length / 26 + 0.1;
    const outs = [
      { txt: '[boot] loading spacetime ........ FAIL', col: DIM },
      { txt: '[err ] time  is not defined', col: ERR },
      { txt: '[err ] space is not defined', col: ERR },
      { txt: '[warn] ⟨0|H|0⟩ ≠ 0  → vacuum fluctuating…', col: '#FFE08A' },
    ];
    outs.forEach((o, i) => { if (t > outT + i * 0.22) lines.push(o); });
    const blink = Math.floor(f / 3) % 2 === 0 || (k > 0 && k < cmd.length);
    terminal(ctx, env, lines, { cursor: blink });
  }
};

const loopScene = {
  draw(ctx, env) {
    const t = env.t, f = env.f, last = env.liveFrames - 1;
    const blink = Math.floor((last - f) / 3) % 2 === 0;
    if (t < 1.9) {
      const lines = [
        { txt: '[entropy]  S = S_max   (100.000 %)', col: ERR },
        { txt: '[energy ]  free energy = 0 J', col: DIM },
      ];
      if (t > .45) lines.push({ txt: '[sys    ]  universe.exit(0)', col: OK });
      if (t > .8) lines.push({ txt: '$ ' + typed('clear', (t - .9) * 14), col: AMB });
      terminal(ctx, env, lines, { cursor: blink });
      if (t > 1.55) { ctx.fillStyle = `rgba(11,9,6,${clamp((t - 1.55) / .3)})`; ctx.fillRect(0, 0, W, H); scanlines(ctx, .22, 4); }
    } else {
      terminal(ctx, env, [{ txt: '$ ', col: AMB }], { cursor: blink });
    }
  }
};

// ---------- hexdump ----------
const hexScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#05070c'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 30px ${MONO}`; ctx.textBaseline = 'alphabetic';
    const cw = ctx.measureText('0').width, lh = 42;
    const cols = 16, rowLen = 10 + cols * 3 + 2 + 18;
    const x0 = (W - rowLen * cw) / 2, y0 = 210;
    ctx.fillStyle = '#4a5a70'; ctx.fillText('vacuum.bin   ·   0 bytes of matter   ·   ⟨0|H|0⟩ ≠ 0', x0, 170);
    const base = Math.floor(t * 5);
    const cx = 7.5, cy = 8;
    for (let r = 0; r < 17; r++) {
      const row = base + r, y = y0 + r * lh;
      ctx.fillStyle = '#34465e'; ctx.fillText((row * 16).toString(16).padStart(8, '0'), x0, y);
      let ascii = '';
      for (let c = 0; c < cols; c++) {
        const R = rng(row * 131 + c * 7 + 3);
        const x = x0 + (10 + c * 3 + (c >= 8 ? 1 : 0)) * cw;
        let v = 0, a = 0;
        // fluctuation events: probability rises with p
        for (let e = 0; e < 3; e++) {
          const et = R() * 3.2, dur = .12 + R() * .25, thr = R();
          if (thr < .12 + p * .55 && t > et && t < et + dur) { v = Math.floor(R() * 255) + 1; a = 1 - (t - et) / dur; }
        }
        // convergence to centre near the end
        const d = Math.hypot(c - cx, r - cy);
        const conv = clamp((p - .72) / .28);
        if (conv > 0 && d < conv * 9) { const q = rng(row * 999 + c + Math.floor(t * 12))(); if (q < .7) { v = Math.floor(q * 360) + 1; a = Math.max(a, 1 - d / 10); } }
        if (r === 8 && c === 8 && p > .85) { v = 255; a = 1; }
        const hx = v.toString(16).padStart(2, '0').toUpperCase();
        if (v) {
          ctx.fillStyle = `rgba(0,229,255,${.25 * a})`; ctx.fillRect(x - 4, y - 30, cw * 2 + 8, 38);
          ctx.fillStyle = a > .5 ? '#E8FDFF' : '#00E5FF';
        } else ctx.fillStyle = '#1f2a3a';
        ctx.fillText(hx, x, y);
        ascii += v ? String.fromCharCode(33 + (v % 90)) : '.';
      }
      ctx.fillStyle = '#2c3a4e'; ctx.fillText('|' + ascii + '|', x0 + (10 + cols * 3 + 2) * cw, y);
    }
    if (p > .85) glowDot(ctx, x0 + (10 + 8 * 3 + 1) * cw + cw, y0 + 8 * lh - 12, 120 + 200 * (p - .85) / .15, 'rgba(200,250,255,.9)', .8);
    scanlines(ctx, .12, 3);
  }
};

// ---------- raymarch singularity ----------
let rm;
const raymarchScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uP: { value: 0 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `
precision highp float; varying vec2 vUv; uniform float uT, uP; uniform vec2 uRes;
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float map(vec3 p, float r){
  float d = length(p) - r;
  float k = 5.0/(r+0.25);
  d += sin(p.x*k+uT*3.)*sin(p.y*k-uT*2.3)*sin(p.z*k+uT*1.7)*0.12*r;
  return d;
}
void main(){
  vec2 uv = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.);
  float a = uT*0.6; vec3 ro = vec3(3.2*sin(a),0.6,3.2*cos(a));
  vec3 fw = normalize(-ro), rt = normalize(cross(vec3(0,1,0),fw)), up = cross(fw,rt);
  vec3 rd = normalize(fw*1.6 + uv.x*rt + uv.y*up);
  float r = mix(1.15, 0.035, pow(uP,0.8));
  float t = 0., glow = 0., hit = 0.;
  for(int i=0;i<72;i++){
    vec3 p = ro+rd*t; float d = map(p,r);
    glow += 0.012/(0.02+d*d*6.);
    if(d<0.001){hit=1.;break;}
    t += d*0.8; if(t>8.) break;
  }
  // lensed background stars
  vec3 b = rd; float imp = length(cross(ro, rd));
  b += normalize(-ro)*0.35*r/(imp*imp+0.05);
  vec3 q = floor(normalize(b)*160.);
  float st = step(0.995, hash(q)) * (0.5+0.5*sin(uT*4.+hash(q+1.)*30.));
  vec3 col = vec3(st)*0.9;
  vec3 hot = mix(vec3(1.0,0.35,0.55), vec3(0.75,0.95,1.0), uP);
  if(hit>0.){
    vec3 p = ro+rd*t; vec2 e = vec2(0.002,0);
    vec3 n = normalize(vec3(map(p+e.xyy,r)-map(p-e.xyy,r), map(p+e.yxy,r)-map(p-e.yxy,r), map(p+e.yyx,r)-map(p-e.yyx,r)));
    float fr = pow(1.-max(dot(n,-rd),0.),2.5);
    col = mix(vec3(0.05,0.02,0.08), hot*1.6, fr) + 0.5*vec3(0.5+0.5*n.x,0.3,0.5+0.5*n.y)*(1.-fr);
  }
  col += hot*glow*(0.08+uP*0.5);
  col += vec3(1.)*smoothstep(0.82,1.0,uP)*0.9*exp(-length(uv)*2.);
  gl_FragColor = vec4(col,1.);
}`});
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    rm = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    rm.mat.uniforms.uT.value = env.t; rm.mat.uniforms.uP.value = env.p;
    env.GL.draw(ctx, rm.scene, rm.cam, 0.5);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = `bold 26px ${MONO}`;
    ctx.fillText(`r = ${(Math.max(1.15 * Math.pow(1 - env.p, 3), 1e-35)).toExponential(2)} m`, 120, 200);
    ctx.fillText(`ρ → ∞`, 120, 240);
  }
};

// ---------- kinetic type: big bang ----------
const kineticScene = {
  draw(ctx, env) {
    const f = env.f, t = env.t, beat = Math.floor(f / 6), k = f % 6;
    const inv = beat === 1;
    ctx.fillStyle = inv ? '#fff' : '#000'; ctx.fillRect(0, 0, W, H);
    // shock rings
    for (let i = 0; i <= beat; i++) {
      const age = t - i * .5; if (age < 0) continue;
      const R = 80 + age * 1400;
      ctx.strokeStyle = inv ? `rgba(255,80,0,${.8 - age})` : `rgba(255,${140 + i * 40},0,${Math.max(0, .9 - age * .9)})`;
      ctx.lineWidth = 30 * Math.max(.1, 1 - age); ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, 7); ctx.stroke();
    }
    // particles
    const R = rng(42);
    for (let i = 0; i < 700; i++) {
      const a = R() * 6.283, sp = 300 + R() * 1500, s0 = R() * .4, len = 20 + R() * 120;
      const age = t - s0; if (age < 0) continue;
      const d = sp * Math.pow(age, .7);
      const x = W / 2 + Math.cos(a) * d, y = H / 2 + Math.sin(a) * d;
      const x2 = W / 2 + Math.cos(a) * Math.max(0, d - len), y2 = H / 2 + Math.sin(a) * Math.max(0, d - len);
      const c = R();
      ctx.strokeStyle = inv ? '#111' : (c < .33 ? '#fff' : c < .66 ? '#FFB347' : '#00E5FF');
      ctx.lineWidth = 1 + R() * 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pop = back(Math.min(1, k / 2.2)), sc = lerp(2.4, 1, pop);
    ctx.save(); ctx.translate(W / 2, H / 2 - 20); ctx.scale(sc, sc);
    if (beat === 0) { ctx.font = `900 430px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText('BIG', 0, 0); }
    else if (beat === 1) { ctx.font = `900 400px ${SANS}`; ctx.fillStyle = '#000'; ctx.fillText('BANG', 0, 0); }
    else {
      ctx.font = `900 150px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText('大爆炸', 0, -120);
      ctx.font = `bold 110px ${MONO}`; ctx.fillStyle = '#00E5FF';
      ctx.fillText(typed('new Universe();', k * 4 + 3), 0, 60);
    }
    ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
};

// ---------- tesseract ----------
const DC = ['#00E5FF', '#FFD600', '#FF3D7F', '#B388FF'];
const V4 = []; for (let i = 0; i < 16; i++) V4.push([0, 1, 2, 3].map(b => (i >> b & 1) ? 1 : -1));
const E4 = []; for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (j > i) E4.push([i, j, b]); }
const tesseractScene = {
  draw(ctx, env) {
    const t = env.t, bt = env.beat;
    ctx.fillStyle = '#07040f'; ctx.fillRect(0, 0, W, H);
    // dot grid
    ctx.fillStyle = 'rgba(179,136,255,.18)';
    for (let x = 40; x < W; x += 60) for (let y = 40; y < H; y += 60) ctx.fillRect(x, y, 3, 3);
    const s = [0, 1, 2, 3].map(i => easeOut(clamp((bt - (i + .6)) / .55)));
    const infl = lerp(.9, 1.25, clamp(t / 2.5));
    const aw = s[3] * (t - 2.2) * 1.8;
    const cam = camera(t * .7 + .5, .45, 6.5, 1500 * infl, W / 2, H / 2 - 10);
    const P = V4.map(v => {
      let [x, y, z, w] = v.map((c, i) => c * s[i]);
      // XW + ZW rotation
      let x2 = x * Math.cos(aw) - w * Math.sin(aw), w2 = x * Math.sin(aw) + w * Math.cos(aw);
      let z2 = z * Math.cos(aw * .7) - w2 * Math.sin(aw * .7), w3 = z * Math.sin(aw * .7) + w2 * Math.cos(aw * .7);
      const k = 3 / (3 - w3 * .9);
      return cam(x2 * k, y * k, z2 * k);
    });
    for (const [i, j, b] of E4) {
      const a = P[i], c = P[j];
      if (Math.hypot(a[0] - c[0], a[1] - c[1]) < .5 && s[b] < .01) continue;
      neon(ctx, () => { ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); }, DC[b], 3.5, 18, .95);
    }
    for (const q of P) { glowDot(ctx, q[0], q[1], 26, 'rgba(255,255,255,.9)', .7); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fill(); }
    // dimension chips
    const cur = Math.min(4, Math.floor(bt + .4 - .6) + 1 < 0 ? 0 : Math.floor(bt - .05));
    ctx.font = `bold 34px ${MONO}`; ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = W / 2 + (i - 2) * 150, y = 190, on = i <= cur;
      ctx.fillStyle = on ? (i ? DC[i - 1] : '#fff') : 'rgba(255,255,255,.15)';
      ctx.fillText(i + 'D', x, y);
      if (i < 4) { ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillText('→', x + 75, y); }
    }
    ctx.textAlign = 'left';
    ctx.font = `bold 24px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillText(`scale ×10^${Math.round(lerp(0, 26, clamp(t / 2.4)))}`, 120, 300);
  }
};

// ---------- plasma shader ----------
let pl;
const plasmaScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `precision highp float; varying vec2 vUv; uniform float uT; uniform vec2 uRes;
vec2 h2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.+2.*fract(sin(p)*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
 return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1,0)),f-vec2(1,0)),u.x), mix(dot(h2(i+vec2(0,1)),f-vec2(0,1)),dot(h2(i+1.),f-1.),u.x),u.y); }
float fbm(vec2 p){ float s=0.,a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5;} return s; }
void main(){
  vec2 p = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.)*1.6;
  vec2 q = vec2(fbm(p+uT*.9), fbm(p+vec2(5.2,1.3)-uT*.7));
  vec2 r = vec2(fbm(p+3.*q+vec2(1.7,9.2)+uT*1.3), fbm(p+3.*q+vec2(8.3,2.8)-uT));
  float f = fbm(p+3.*r);
  vec3 c = mix(vec3(.25,0.,.35), vec3(1.,.1,.45), clamp(f*2.+.5,0.,1.));
  c = mix(c, vec3(1.,.6,.1), clamp(length(q)*1.6,0.,1.));
  c = mix(c, vec3(1.,1.,.85), clamp(pow(length(r),3.)*4.,0.,1.));
  c *= .75+.6*f;
  gl_FragColor = vec4(c,1.);
}`});
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    pl = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    pl.mat.uniforms.uT.value = env.t * 1.4;
    env.GL.draw(ctx, pl.scene, pl.cam, 0.5);
    const R = rng(5), cols = ['#ff4d6d', '#3ddc84', '#4dabff'], t = env.t;
    ctx.font = `bold 22px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 60; i++) {
      const x0 = R() * W, y0 = R() * H, ph = R() * 100, c = cols[i % 3];
      const x = x0 + noise3(ph, t * 2.5) * 260, y = y0 + noise3(ph + 50, t * 2.5) * 260;
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.fill();
      ctx.fillStyle = '#000'; ctx.fillText('uds'[i % 3], x, y + 1);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `bold 28px ${MONO}`; ctx.fillStyle = '#fff'; ctx.fillText('T ≈ 10¹⁵ K   ·   quarks + gluons, unbound', 120, 200);
  }
};

// ---------- force graph: hadrons ----------
const HAD = (() => { const R = rng(11); const hs = [];
  const spots = [[380, 330], [760, 280], [1160, 330], [1540, 300], [520, 600], [940, 560], [1360, 610], [300, 780], [1700, 560], [1120, 800]];
  spots.forEach((c, k) => { const pr = k < 6; hs.push({ c, pr, delay: R() * .45, q: (pr ? ['u', 'u', 'd'] : ['u', 'd', 'd']).map((f, j) => ({ f, col: j, x0: R() * W, y0: 150 + R() * 750, ph: R() * 50 })) }); });
  return hs; })();
const graphScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#0a0e18'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(80,120,200,.08)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const cols = ['#ff4d6d', '#3ddc84', '#4dabff'];
    const all = [];
    for (const h of HAD) {
      const g = smooth((p - h.delay) / .4);
      h.q.forEach((q, j) => {
        const wx = q.x0 + noise3(q.ph, t * 1.5) * 200, wy = q.y0 + noise3(q.ph + 9, t * 1.5) * 200;
        const a = j * 2.094 + t * 4 * (h.pr ? 1 : -1);
        q.x = lerp(wx, h.c[0] + Math.cos(a) * 40, g); q.y = lerp(wy, h.c[1] + Math.sin(a) * 40, g); q.g = g; all.push(q);
      });
      if (g > .02) {
        ctx.strokeStyle = `rgba(255,255,255,${g * .9})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(h.c[0], h.c[1], 72, 0, 7); ctx.stroke();
        for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
          const A = h.q[a], B = h.q[b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
          ctx.strokeStyle = `rgba(255,214,0,${g})`; ctx.lineWidth = 2.5; ctx.beginPath();
          for (let s = 0; s <= 20; s++) { const u = s / 20, w = Math.sin(u * 18 + t * 20) * 7;
            const x = A.x + dx * u - dy / L * w, y = A.y + dy * u + dx / L * w; s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
        }
        ctx.font = `bold 34px ${MONO}`; ctx.fillStyle = `rgba(255,255,255,${g})`; ctx.textAlign = 'center';
        ctx.fillText(h.pr ? 'p⁺' : 'n⁰', h.c[0], h.c[1] - 90); ctx.textAlign = 'left';
      }
    }
    // force-graph links between free quarks
    ctx.setLineDash([6, 8]); ctx.lineWidth = 1.5;
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
      const A = all[i], B = all[j], d = Math.hypot(A.x - B.x, A.y - B.y), f = (1 - A.g) * (1 - B.g);
      if (d < 260 && f > .05) { ctx.strokeStyle = `rgba(0,229,255,${f * (1 - d / 260) * .8})`; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
    }
    ctx.setLineDash([]);
    ctx.font = `bold 22px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const q of all) { ctx.fillStyle = cols[q.col]; ctx.beginPath(); ctx.arc(q.x, q.y, 17, 0, 7); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillText(q.f, q.x, q.y + 1); }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
};

// ---------- IDE ----------
const C = { kw: '#C586C0', dec: '#569CD6', fn: '#DCDCAA', str: '#CE9178', num: '#B5CEA8', com: '#6A9955', v: '#9CDCFE', ty: '#4EC9B0', p: '#D4D4D4' };
const CODE = [
  [['// t = 180 s · T = 10⁹ K · 宇宙变成核反应堆', C.com]],
  [['import', C.kw], [' { Proton, Neutron, fuse } ', C.p], ['from', C.kw], [" './nuclear'", C.str]],
  [],
  [['const', C.dec], [' p', C.v], [' = ', C.p], ['Proton', C.ty], ['(), ', C.p], ['n', C.v], [' = ', C.p], ['Neutron', C.ty], ['();', C.p]],
  [['let', C.dec], [' D   ', C.v], ['= ', C.p], ['fuse', C.fn], ['(p, n);      ', C.p], ['// 氘', C.com]],
  [['let', C.dec], [' He3 ', C.v], ['= ', C.p], ['fuse', C.fn], ['(D, p);', C.p]],
  [['let', C.dec], [' He4 ', C.v], ['= ', C.p], ['fuse', C.fn], ['(He3, n);    ', C.p], ['// 氦-4', C.com]],
  [],
  [['universe', C.v], ['.abundance = {', C.p]],
  [['  H', C.v], [':  ', C.p], ['0.75', C.num], [',', C.p]],
  [['  He', C.v], [': ', C.p], ['0.25', C.num], [',', C.p]],
  [['  Li', C.v], [': ', C.p], ['1e-9', C.num], [',', C.p]],
  [['};', C.p]],
];
const ideScene = {
  draw(ctx, env) {
    const p = env.p;
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
    const X = 90, Y = 140, WW = 1740, HH = 760;
    ctx.fillStyle = '#1e1e1e'; ctx.fillRect(X, Y, WW, HH);
    ctx.fillStyle = '#323233'; ctx.fillRect(X, Y, WW, 44);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 26 + i * 26, Y + 22, 8, 0, 7); ctx.fill(); });
    ctx.fillStyle = '#252526'; ctx.fillRect(X, Y + 44, 300, HH - 44);
    ctx.font = `22px ${MONO}`; ctx.fillStyle = '#ccc'; ctx.fillText('EXPLORER', X + 24, Y + 86);
    ['⌄ universe/', '   inflation.ts', '   quarks.ts', '   bbn.ts', '   cmb.ts', '   stars.ts', '   heat_death.ts'].forEach((s, i) => {
      if (i === 3) { ctx.fillStyle = '#37373d'; ctx.fillRect(X, Y + 104 + i * 38, 300, 38); }
      ctx.fillStyle = i === 3 ? '#fff' : '#aaa'; ctx.fillText(s, X + 20, Y + 130 + i * 38); });
    ctx.fillStyle = '#1e1e1e'; ctx.fillRect(X + 300, Y + 44, 190, 44);
    ctx.fillStyle = '#fff'; ctx.fillText('bbn.ts  ●', X + 322, Y + 74);
    ctx.fillStyle = '#FFD600'; ctx.fillRect(X + 300, Y + 44, 190, 3);
    // code
    const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0) + 1, 0);
    let budget = Math.floor(p * 1.1 * total);
    ctx.font = `28px ${MONO}`; const cw = ctx.measureText('0').width, lh = 44, cx = X + 400, cy = Y + 140;
    let curL = 0, curX = cx;
    CODE.forEach((line, li) => {
      const y = cy + li * lh;
      ctx.fillStyle = '#858585'; ctx.textAlign = 'right'; ctx.fillText(String(li + 1), cx - 30, y); ctx.textAlign = 'left';
      let x = cx;
      for (const [s, col] of line) {
        if (budget <= 0) break;
        const part = s.slice(0, budget); budget -= part.length;
        ctx.fillStyle = col; ctx.fillText(part, x, y); x += cw * part.length;
      }
      if (budget > 0 || (budget === 0 && li === 0)) { curL = li; curX = x; }
      budget -= 1; if (budget >= 0) { curL = li + 1; curX = cx; }
    });
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(X + 300, cy + curL * lh - 32, 1100, lh);
    if (env.f % 4 < 2 || p < 1) { ctx.fillStyle = '#AEAFAD'; ctx.fillRect(curX + 1, cy + curL * lh - 30, 3, 38); }
    // abundance panel
    const px = X + 1400, py = Y + 110;
    ctx.fillStyle = '#252526'; ctx.fillRect(px, py - 50, 300, 560);
    ctx.fillStyle = '#ddd'; ctx.font = `bold 22px ${MONO}`; ctx.fillText('ABUNDANCE', px + 24, py - 12);
    const bars = [['H', .75, '#00E5FF', 9], ['He', .25, '#FFD600', 10], ['Li', .02, '#FF3D7F', 11]];
    bars.forEach(([n, v, c, line], i) => {
      const on = curL > line ? 1 : 0; const g = on * easeOut(clamp((p - (line / 13)) * 5));
      const bh = 380 * v * g, bx = px + 30 + i * 90, by = py + 440;
      ctx.fillStyle = c; ctx.fillRect(bx, by - bh, 60, bh);
      ctx.fillStyle = '#fff'; ctx.font = `bold 24px ${MONO}`; ctx.fillText(n, bx + 10, by + 34);
      if (g > .5) { ctx.font = `18px ${MONO}`; ctx.fillText(n === 'Li' ? '1e-9' : Math.round(v * 100) + '%', bx, by - bh - 10); }
    });
    ctx.fillStyle = '#007acc'; ctx.fillRect(X, Y + HH - 30, WW, 30);
    ctx.fillStyle = '#fff'; ctx.font = `18px ${MONO}`; ctx.fillText('⎇ main   ✓ 0 errors   Ln ' + (curL + 1) + '   TypeScript   T = 10⁹ K', X + 20, Y + HH - 9);
  }
};

// ---------- pixel CMB ----------
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const PAL = ['#0b1f6b', '#1646b8', '#1f8fff', '#48d6ff', '#fff38a', '#ffb13b', '#ff6a2b', '#d01f2e'];
const pixCanvas = makeCanvas(400, 60);
const pixelScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = 560, A = 740, B = 320, s = 24;
    for (let y = cy - B; y < cy + B; y += s) for (let x = cx - A; x < cx + A; x += s) {
      const nx = (x + s / 2 - cx) / A, ny = (y + s / 2 - cy) / B; if (nx * nx + ny * ny > 1) continue;
      const gx = Math.round(x / s), gy = Math.round(y / s);
      const th = (BAYER[(gx & 3) + (gy & 3) * 4] + .5) / 16;
      const reveal = clamp(p * 1.6 - (1 - Math.abs(nx)) * .25);
      if (th > reveal) { ctx.fillStyle = '#16121f'; ctx.fillRect(x + 2, y + 2, s - 4, s - 4); continue; }
      const v = fbm(gx * .09, gy * .09, 3, 4) * 1.6 + .5 + .08 * Math.sin(t * 6 + gx);
      ctx.fillStyle = PAL[Math.max(0, Math.min(7, Math.floor(v * 8)))]; ctx.fillRect(x, y, s, s);
    }
    // photon sprites escaping
    const R = rng(3);
    for (let i = 0; i < 40; i++) {
      const a = R() * 6.283, st = R() * 1.2 + .3, sp = 300 + R() * 400; const age = t - st; if (age < 0) continue;
      const x = cx + Math.cos(a) * (A * .95 + age * sp), y = cy + Math.sin(a) * (B * .95 + age * sp * .6);
      const q = Math.round(x / 8) * 8, w = Math.round(y / 8) * 8;
      ctx.fillStyle = '#fff'; ctx.fillRect(q, w, 16, 16); ctx.fillStyle = '#FFD600'; ctx.fillRect(q - 8, w, 8, 16); ctx.fillRect(q - 16, w + 4, 8, 8);
    }
    const pc = pixCanvas.getContext('2d'); pc.clearRect(0, 0, 400, 60);
    pc.font = `bold 16px ${MONO}`; pc.fillStyle = '#fff';
    pc.fillText(`T = ${Math.round(lerp(3000, 2.7, easeOut(p)) * 10) / 10} K   PHOTONS FREE!`, 4, 20);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(pixCanvas, 0, 0, 400, 30, 360, 140, 1200, 90); ctx.imageSmoothingEnabled = true;
  }
};

export const SCENES = { terminal: terminalScene, loop: loopScene, hexdump: hexScene, raymarch: raymarchScene,
  kinetic: kineticScene, tesseract: tesseractScene, plasma: plasmaScene, graph: graphScene, ide: ideScene, pixel: pixelScene };
```

### 7/9 · `web/scenes_b.js`
<!-- casebook-file {"path": "web/scenes_b.js", "lines": 397, "final_newline": true, "sha256": "9128ac2583557d9e72faba36004b6ef4274de7b447d5ea3572649bacd410895e", "original_sha256": "9128ac2583557d9e72faba36004b6ef4274de7b447d5ea3572649bacd410895e"} -->
```js
import { W, H, MONO, SANS, rng, clamp, lerp, smooth, easeOut, easeInOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

function dotTexture(T, soft = true) {
  const c = makeCanvas(64, 64), x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(soft ? .25 : .7, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(c); return t;
}
function gauss(R) { return Math.sqrt(-2 * Math.log(R() + 1e-9)) * Math.cos(6.283 * R()); }
function starfield(T, n = 1500, rad = 60) {
  const R = rng(99), pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * 6.283, s = Math.sqrt(1 - u * u);
    pos[i * 3] = s * Math.cos(a) * rad; pos[i * 3 + 1] = u * rad; pos[i * 3 + 2] = s * Math.sin(a) * rad; }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
  return new T.Points(g, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: .7 }));
}

// ---------- ASCII dark ages ----------
const RAMP = ' .:-=+*#%@';
const asciiScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#030403'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 20px ${MONO}`; const cw = ctx.measureText('0').width, lh = 22;
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / lh);
    const contrast = lerp(1.2, 4.2, p), att = Math.pow(p, 2.5);
    const hi = [], lo = [], top = [];
    for (let r = 0; r < rows; r++) {
      let a = '', b = '', c = '';
      for (let k = 0; k < cols; k++) {
        const x = k / cols * 16, y = r / rows * 9;
        let v = fbm(x * .45, y * .45, t * .35, 4) * contrast + .12;
        const dx = (k - cols / 2) / cols * 1.8, dy = (r - rows * .45) / rows;
        v += att * 1.6 * Math.exp(-(dx * dx + dy * dy) * 30);
        v = clamp(v - lerp(0, .25, p), 0, .999);
        const ch = RAMP[Math.floor(v * RAMP.length)];
        if (v > .82) { c += ch; a += ' '; b += ' '; } else if (v > .45) { b += ch; a += ' '; c += ' '; } else { a += ch; b += ' '; c += ' '; }
      }
      lo.push(a); hi.push(b); top.push(c);
    }
    const draw = (arr, col) => { ctx.fillStyle = col; arr.forEach((s, r) => ctx.fillText(s, 0, (r + 1) * lh)); };
    draw(lo, '#3f6a52'); draw(hi, '#9fdcb8'); draw(top, '#eaffef');
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(100, 150, 760, 60);
    ctx.fillStyle = '#9fe0b8'; ctx.font = `bold 26px ${MONO}`;
    ctx.fillText(`no light yet · gravity.clump(ρ) ×${contrast.toFixed(1)}`, 118, 190);
  }
};

// ---------- LOW-POLY first star ----------
let lp;
const lowpolyScene = {
  init(env) {
    const T = env.GL.THREE;
    const scene = new T.Scene(); scene.background = new T.Color(0x05030c);
    const cam = new T.PerspectiveCamera(42, W / H, .1, 200);
    const geo = new T.IcosahedronGeometry(1.6, 1); const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const v = new T.Vector3().fromBufferAttribute(pos, i);
      const h = Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719) * 43758.5453; const k = 1 + (h - Math.floor(h) - .5) * .28; v.multiplyScalar(k); pos.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    const mat = new T.MeshStandardMaterial({ color: 0x3a3450, flatShading: true, roughness: .9, emissive: 0x000000 });
    const star = new T.Mesh(geo, mat); scene.add(star);
    const spikes = new T.Group(); const R = rng(8);
    for (let i = 0; i < 26; i++) { const c = new T.Mesh(new T.ConeGeometry(.18, 1.6, 4), new T.MeshBasicMaterial({ color: 0xbfe8ff }));
      const d = new T.Vector3(gauss(R), gauss(R), gauss(R)).normalize(); c.position.copy(d.clone().multiplyScalar(2.2));
      c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d); c.userData.d = d; c.userData.k = .6 + R() * .8; spikes.add(c); }
    scene.add(spikes);
    const shards = new T.Group();
    for (let i = 0; i < 90; i++) { const m = new T.Mesh(new T.TetrahedronGeometry(.25 + R() * .5), new T.MeshStandardMaterial({ color: 0x4a3a6e, flatShading: true }));
      const a = R() * 6.283, r = 4 + R() * 9, y = gauss(R) * 3; m.position.set(Math.cos(a) * r, y, Math.sin(a) * r); m.rotation.set(R() * 6, R() * 6, R() * 6); m.userData = { a, r, y, s: R() }; shards.add(m); }
    scene.add(shards);
    const glow = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T), color: 0x9fd8ff, blending: T.AdditiveBlending, transparent: true, depthWrite: false }));
    glow.scale.set(9, 9, 1); scene.add(glow);
    scene.add(new T.AmbientLight(0x6060a0, .6));
    const pl = new T.PointLight(0x9fd8ff, 0, 0, 1.2); scene.add(pl);
    const dl = new T.DirectionalLight(0xff66aa, .8); dl.position.set(-5, 3, -4); scene.add(dl);
    scene.add(starfield(T));
    lp = { scene, cam, star, mat, spikes, shards, glow, pl };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, ig = smooth((p - .38) / .25);
    const a = t * .5 + .8; lp.cam.position.set(Math.sin(a) * 10.5, 2.2, Math.cos(a) * 10.5); lp.cam.lookAt(0, 0, 0);
    const sc = lerp(2.2, 1, easeInOut(clamp(p / .45))) * (1 + ig * .06 * Math.sin(t * 25));
    lp.star.scale.setScalar(sc); lp.star.rotation.set(t * .3, t * .5, 0);
    lp.mat.emissive.setRGB(.55 * ig, .8 * ig, 1 * ig); lp.mat.color.setRGB(lerp(.23, .8, ig), lerp(.2, .9, ig), lerp(.31, 1, ig));
    lp.pl.intensity = ig * 60;
    lp.spikes.children.forEach(c => { const s = ig * c.userData.k * (1 + .3 * Math.sin(t * 20 + c.userData.k * 9));
      c.scale.set(s, s * 1.4, s); c.position.copy(c.userData.d.clone().multiplyScalar(1.7 + s * 1.2)); c.visible = s > .02; });
    lp.shards.children.forEach(m => { const u = m.userData; const r = lerp(u.r, u.r * .75, p); const aa = u.a + t * (.4 + u.s * .3);
      m.position.set(Math.cos(aa) * r, u.y, Math.sin(aa) * r); m.rotation.x += 0; m.rotation.y = t * (1 + u.s); });
    lp.glow.material.opacity = ig; lp.glow.scale.setScalar(4 + ig * 9);
    env.GL.draw(ctx, lp.scene, lp.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#bfe8ff';
    ctx.fillText(ig > .1 ? 'fusion.ignite()  ·  Pop III · 100 M☉ · 10⁵ K' : 'H₂ cloud collapsing …', 120, 200);
  }
};

// ---------- CA reionization ----------
const CA = (() => {
  const cs = 16, cw = Math.floor(W / cs), ch = Math.floor(H / cs), N = cw * ch, steps = 64;
  const arr = new Int16Array(N).fill(9999); const R = rng(21); const seeds = [];
  for (let i = 0; i < 26; i++) seeds.push({ x: Math.floor(R() * cw), y: Math.floor(R() * ch), s: Math.floor(R() * 26) });
  let cur = new Uint8Array(N);
  for (let s = 0; s < steps; s++) {
    for (const sd of seeds) if (sd.s === s) { const k = sd.y * cw + sd.x; cur[k] = 1; if (arr[k] > s) arr[k] = s; }
    const nx = cur.slice();
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const k = y * cw + x; if (cur[k]) continue;
      let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy;
        if ((dx || dy) && xx >= 0 && yy >= 0 && xx < cw && yy < ch && cur[yy * cw + xx]) n++; }
      if (n && R() < 1 - Math.pow(.72, n)) { nx[k] = 1; arr[k] = s; } }
    cur = nx;
  }
  return { cs, cw, ch, arr, seeds, steps };
})();
const caScene = {
  draw(ctx, env) {
    const p = env.p, step = Math.floor(p * (CA.steps - 2)) + 1;
    ctx.fillStyle = '#07080d'; ctx.fillRect(0, 0, W, H);
    const { cs, cw, ch, arr } = CA; let ion = 0;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const a = arr[y * cw + x], age = step - a;
      if (age < 0) { ctx.fillStyle = (x + y) % 2 ? '#141827' : '#171b2c'; }
      else { ion++; ctx.fillStyle = age === 0 ? '#ffffff' : age < 3 ? '#aef6ff' : age < 8 ? '#00E5FF' : age < 16 ? '#0aa4c6' : '#086b86'; }
      ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
    }
    for (const s of CA.seeds) if (s.s <= step) { ctx.fillStyle = '#FFD600'; ctx.fillRect(s.x * cs - 3, s.y * cs - 3, cs + 6, cs + 6); }
    ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(100, 150, 820, 100);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#fff';
    ctx.fillText(`step ${String(step).padStart(2, '0')}   ionized ${(ion / (cw * ch) * 100).toFixed(1)}%`, 120, 190);
    ctx.fillStyle = '#00E5FF'; ctx.fillText('P(ion) = 1 − (1 − p)ⁿ   n = lit neighbours', 120, 230);
  }
};

// ---------- point cloud cosmic web ----------
let pc;
const pointcloudScene = {
  init(env) {
    const T = env.GL.THREE; const R = rng(33);
    const nodes = []; for (let i = 0; i < 46; i++) nodes.push([gauss(R) * 7, gauss(R) * 5, gauss(R) * 7]);
    const edges = new Set();
    nodes.forEach((a, i) => { const d = nodes.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), j]).sort((x, y) => x[0] - y[0]);
      for (let k = 1; k <= 3; k++) { const j = d[k][1]; edges.add(i < j ? i + ',' + j : j + ',' + i); } });
    const E = [...edges].map(s => s.split(',').map(Number));
    const n = 70000, T0 = new Float32Array(n * 3), I0 = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let x, y, z, c;
      const r = R();
      if (r < .72) { const [a, b] = E[Math.floor(R() * E.length)], u = R(), A = nodes[a], B = nodes[b], s = .18;
        x = lerp(A[0], B[0], u) + gauss(R) * s; y = lerp(A[1], B[1], u) + gauss(R) * s; z = lerp(A[2], B[2], u) + gauss(R) * s; c = [.55, .45, 1]; }
      else if (r < .93) { const A = nodes[Math.floor(R() * nodes.length)], s = .35; x = A[0] + gauss(R) * s; y = A[1] + gauss(R) * s; z = A[2] + gauss(R) * s; c = [1, .55, .85]; }
      else { x = (R() - .5) * 26; y = (R() - .5) * 18; z = (R() - .5) * 26; c = [.3, .35, .6]; }
      T0.set([x, y, z], i * 3); I0.set([(R() - .5) * 26, (R() - .5) * 18, (R() - .5) * 26], i * 3); col.set(c, i * 3);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const pts = new T.Points(g, new T.PointsMaterial({ size: .11, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    const scene = new T.Scene(); scene.background = new T.Color(0x020108); scene.add(pts);
    pc = { scene, cam: new T.PerspectiveCamera(50, W / H, .1, 200), g, T0, I0, n };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, k = easeOut(clamp(p * 1.25));
    const a = pc.g.attributes.position.array;
    for (let i = 0; i < pc.n * 3; i++) a[i] = pc.I0[i] + (pc.T0[i] - pc.I0[i]) * k;
    pc.g.attributes.position.needsUpdate = true;
    const ang = t * .35; const d = lerp(24, 15, easeInOut(p));
    pc.cam.position.set(Math.sin(ang) * d, 4 + Math.sin(t) * 1, Math.cos(ang) * d); pc.cam.lookAt(0, 0, 0);
    env.GL.draw(ctx, pc.scene, pc.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#c9b8ff';
    ctx.fillText(`dark matter · 70 000 pts · collapse ${Math.round(k * 100)}%`, 120, 200);
  }
};

// ---------- galaxy particles ----------
let gx;
const galaxyScene = {
  init(env) {
    const T = env.GL.THREE, R = rng(44), n = 80000;
    const rr = new Float32Array(n), base = new Float32Array(n), off = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const cIn = new T.Color('#ffe2b0'), cOut = new T.Color('#5b8cff'), cPink = new T.Color('#ff5fa2');
    for (let i = 0; i < n; i++) {
      const r = Math.pow(R(), 1.6) * 11; rr[i] = r; const arm = i % 3;
      base[i] = arm * 2.094 + Math.log(r + 1) * 2.4;
      off[i * 3] = gauss(R); off[i * 3 + 1] = gauss(R); off[i * 3 + 2] = gauss(R);
      const c = cIn.clone().lerp(cOut, Math.min(1, r / 9)); if (R() < .06) c.copy(cPink);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const pts = new T.Points(g, new T.PointsMaterial({ size: .09, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    const scene = new T.Scene(); scene.background = new T.Color(0x02020a); scene.add(pts); scene.add(starfield(T));
    const core = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T), color: 0xffd9a0, blending: T.AdditiveBlending, transparent: true, depthWrite: false }));
    core.scale.set(6, 6, 1); scene.add(core);
    gx = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 300), g, rr, base, off, n };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, spread = lerp(2.2, .35, easeOut(p)), a = gx.g.attributes.position.array;
    for (let i = 0; i < gx.n; i++) {
      const r = gx.rr[i], th = gx.base[i] * lerp(.2, 1, easeOut(p)) - t * 1.6 / (r * .35 + .6);
      const s = spread * (.3 + r * .12);
      a[i * 3] = Math.cos(th) * r + gx.off[i * 3] * s; a[i * 3 + 2] = Math.sin(th) * r + gx.off[i * 3 + 2] * s;
      a[i * 3 + 1] = gx.off[i * 3 + 1] * (.5 * Math.exp(-r * .25) + .08) * (1 + spread);
    }
    gx.g.attributes.position.needsUpdate = true;
    const ang = t * .25 + .3; gx.cam.position.set(Math.sin(ang) * 17, lerp(6, 10, p), Math.cos(ang) * 17); gx.cam.lookAt(0, -1, 0);
    env.GL.draw(ctx, gx.scene, gx.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#ffe2b0';
    ctx.fillText('80 000 stars · 3 arms · ω(r) ∝ 1/r', 120, 200);
  }
};

// ---------- spacetime curvature ----------
let sp;
const spacetimeScene = {
  init(env) {
    const T = env.GL.THREE, N = 44, S = 110, L = 13;
    const segs = N * 2 * S; const pos = new Float32Array(segs * 2 * 3), col = new Float32Array(segs * 2 * 3);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const lines = new T.LineSegments(g, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .95 }));
    const scene = new T.Scene(); scene.background = new T.Color(0x03020a); scene.add(lines); scene.add(starfield(T));
    const bh = new T.Mesh(new T.SphereGeometry(.75, 48, 32), new T.MeshBasicMaterial({ color: 0x000000 })); scene.add(bh);
    const ring = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T, false), color: 0xffa040, blending: T.AdditiveBlending, transparent: true, depthWrite: false })); scene.add(ring);
    const R = rng(55), dn = 9000, dp = new Float32Array(dn * 3), dc = new Float32Array(dn * 3), dr = new Float32Array(dn), da = new Float32Array(dn);
    for (let i = 0; i < dn; i++) { dr[i] = 1.1 + Math.pow(R(), 1.5) * 2.6; da[i] = R() * 6.283; const h = 1 - (dr[i] - 1.1) / 2.6; dc.set([1, .45 + h * .5, .15 + h * .6], i * 3); }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3)); dg.setAttribute('color', new T.BufferAttribute(dc, 3));
    const disk = new T.Points(dg, new T.PointsMaterial({ size: .07, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending })); scene.add(disk);
    const orbs = []; for (let i = 0; i < 4; i++) { const m = new T.Mesh(new T.SphereGeometry(.22, 16, 12), new T.MeshBasicMaterial({ color: [0x00e5ff, 0xffd600, 0xff3d7f, 0xffffff][i] })); scene.add(m); orbs.push({ m, r: 4 + i * 1.9, w: 1.6 / Math.pow(4 + i * 1.9, 1.5) * 8, a: i * 1.7 }); }
    sp = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 300), g, N, S, L, bh, ring, dg, dr, da, dn, orbs };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, M = lerp(.25, 1.5, easeOut(p));
    const Y = (x, z) => -M * 3 / Math.sqrt(x * x + z * z + .5);
    const { N, S, L } = sp; const pos = sp.g.attributes.position.array, col = sp.g.attributes.color.array; let k = 0;
    const put = (x, z) => { const y = Y(x, z); pos[k] = x; pos[k + 1] = y; pos[k + 2] = z;
      const d = clamp(-y / 4); col[k] = lerp(0, .7, d); col[k + 1] = lerp(.9, .35, d); col[k + 2] = 1; k += 3; };
    for (let i = 0; i < N; i++) { const c = -L + 2 * L * i / (N - 1);
      for (let s = 0; s < S; s++) { const u0 = -L + 2 * L * s / S, u1 = -L + 2 * L * (s + 1) / S; put(u0, c); put(u1, c); put(c, u0); put(c, u1); } }
    sp.g.attributes.position.needsUpdate = true; sp.g.attributes.color.needsUpdate = true;
    const yc = Y(0, 0) + .75; sp.bh.position.set(0, yc, 0); sp.ring.position.set(0, yc, 0); sp.ring.scale.setScalar(4.2 + Math.sin(t * 9) * .2);
    const dp = sp.dg.attributes.position.array;
    for (let i = 0; i < sp.dn; i++) { const r = sp.dr[i], a = sp.da[i] + t * 5 / Math.pow(r, 1.5); dp[i * 3] = Math.cos(a) * r; dp[i * 3 + 2] = Math.sin(a) * r; dp[i * 3 + 1] = yc + Math.sin(a) * r * .08; }
    sp.dg.attributes.position.needsUpdate = true;
    sp.orbs.forEach(o => { const a = o.a + t * o.w; const x = Math.cos(a) * o.r, z = Math.sin(a) * o.r; o.m.position.set(x, Y(x, z) + .22, z); });
    const ang = t * .3 + .4; sp.cam.position.set(Math.sin(ang) * 15, 7.5, Math.cos(ang) * 15); sp.cam.lookAt(0, -2.2, 0);
    env.GL.draw(ctx, sp.scene, sp.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#d8c8ff';
    ctx.fillText(`M = ${(M * 4).toFixed(1)}×10⁹ M☉   ·   ds² = −(1−rₛ/r)c²dt² + …`, 120, 200);
  }
};

// ---------- glitch supernova ----------
const tmp = makeCanvas(), tctx = tmp.getContext('2d');
const tints = ['#ff0000', '#00ff00', '#0000ff'].map(c => { const cv = makeCanvas(); return { cv, x: cv.getContext('2d'), c }; });
const ELEM = ['Fe', 'Ni', 'Au', 'Pt', 'U', 'Si', 'O', 'C', 'Ca', 'Ag', 'Pb', 'I'];
const glitchScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, f = env.f, boom = .3;
    ctx.fillStyle = '#04020a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 - 20;
    if (p < boom) { const s = 1 + .25 * Math.sin(t * 40) * p / boom;
      glowDot(ctx, cx, cy, 380 * s, 'rgba(255,120,60,.9)', 1); glowDot(ctx, cx, cy, 150 * s, 'rgba(255,240,200,1)', 1);
    } else {
      const age = (p - boom) * env.live;
      glowDot(ctx, cx, cy, 90 + 30 * Math.sin(t * 30), 'rgba(170,220,255,1)', 1);
      ctx.strokeStyle = 'rgba(170,220,255,.9)'; ctx.lineWidth = 6; ctx.beginPath(); const ba = t * 8;
      ctx.moveTo(cx - Math.cos(ba) * 900, cy - Math.sin(ba) * 900); ctx.lineTo(cx + Math.cos(ba) * 900, cy + Math.sin(ba) * 900); ctx.stroke();
      const R = rng(66); ctx.textAlign = 'center';
      for (let i = 0; i < 260; i++) { const a = R() * 6.283, v = 500 + R() * 900, d = v * Math.pow(age, .6);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .8; const c = ['#ff6a2b', '#FFD600', '#ff3d7f', '#fff'][i % 4];
        if (i % 3 === 0) { ctx.font = `bold ${28 + (i % 5) * 8}px ${MONO}`; ctx.fillStyle = c; ctx.fillText(ELEM[i % ELEM.length], x, y); }
        else glowDot(ctx, x, y, 22, c, .9); }
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'rgba(255,200,120,.8)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(cx, cy, 1300 * Math.pow(age, .6), 1040 * Math.pow(age, .6), 0, 0, 7); ctx.stroke();
    }
    ctx.font = `900 120px ${MONO}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(p < boom ? 'CORE COLLAPSE' : 'Fe · Au · U', cx, 250); ctx.textAlign = 'left';
    // ---- glitch pass ----
    const R = rng(f * 31 + 7), amt = clamp(p < boom ? p / boom * .4 : 1.2 - (p - boom) * .9) * (f % 6 < 2 ? 1.4 : .7);
    tctx.drawImage(ctx.canvas, 0, 0);
    const sh = 8 + amt * 26;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    tints.forEach((q, i) => { q.x.globalCompositeOperation = 'source-over'; q.x.drawImage(tmp, 0, 0); q.x.globalCompositeOperation = 'multiply'; q.x.fillStyle = q.c; q.x.fillRect(0, 0, W, H);
      ctx.drawImage(q.cv, (i - 1) * sh, (i - 1) * sh * .3); });
    ctx.globalCompositeOperation = 'source-over';
    tctx.drawImage(ctx.canvas, 0, 0);
    const bands = Math.floor(4 + amt * 16);
    for (let i = 0; i < bands; i++) { const y = R() * H, h = 6 + R() * 70, dx = (R() - .5) * 260 * amt; ctx.drawImage(tmp, 0, y, W, h, dx, y, W, h); }
    for (let i = 0; i < amt * 8; i++) { const w = 60 + R() * 260, h = 20 + R() * 90, sx = R() * W, sy = R() * H;
      ctx.drawImage(tmp, sx, sy, w, h, R() * W, R() * H, w, h); }
    scanlines(ctx, .2, 3);
  }
};

// ---------- parallax solar system ----------
const PX = (() => { const R = rng(77);
  return { stars: Array.from({ length: 400 }, () => [R() * W * 1.6 - W * .3, R() * H, R() * 2 + .5]),
    rocks: Array.from({ length: 7 }, (_, i) => ({ x: i * 420 - 300 + R() * 100, y: i % 2 ? 880 + R() * 80 : 120 + R() * 100, r: 90 + R() * 120, pts: Array.from({ length: 9 }, () => .7 + R() * .4) })),
    dust: Array.from({ length: 30 }, () => [R() * W * 2 - W * .5, R() * H, 20 + R() * 50]) }; })();
const PLANETS = [[150, '#c9b29b', 9], [230, '#e8c27a', 14], [320, '#4f9dff', 15], [410, '#d0674a', 11], [560, '#e0b27f', 34], [700, '#e9d7a3', 28]];
const parallaxScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, cam = lerp(-260, 260, easeInOut(p));
    ctx.fillStyle = '#060818'; ctx.fillRect(0, 0, W, H);
    // L0 stars
    for (const [x, y, s] of PX.stars) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x - cam * .1, y, s, s); }
    // L1 nebula
    ctx.save(); ctx.translate(-cam * .3, 0);
    glowDot(ctx, 500, 350, 520, 'rgba(120,60,200,.35)'); glowDot(ctx, 1500, 700, 600, 'rgba(0,180,200,.25)'); ctx.restore();
    // L2 disk + sun + planets (paper cut layer with shadow)
    ctx.save(); ctx.translate(W / 2 - cam * .6, H / 2 - 20);
    ctx.scale(1, .36);
    const cond = easeOut(clamp((p - .15) / .7));
    for (let r = 120; r < 780; r += 22) { ctx.strokeStyle = `rgba(255,${180 + (r % 60)},120,${(1 - cond) * .35 + .05})`; ctx.lineWidth = 10; ctx.setLineDash([30, 14]); ctx.lineDashOffset = -t * 400 / r * 30; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; for (const [r] of PLANETS) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.translate(W / 2 - cam * .6, H / 2 - 20);
    glowDot(ctx, 0, 0, 260, 'rgba(255,200,80,.8)'); ctx.fillStyle = '#FFE08A'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill();
    PLANETS.forEach(([r, c, s], i) => { const a = t * 3 / Math.sqrt(r / 100) + i * 1.3; const x = Math.cos(a) * r, y = Math.sin(a) * r * .36;
      const sz = s * cond; if (sz < 1) return; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(x + 6, y + 8, sz, 0, 7); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, sz, 0, 7); ctx.fill(); if (i === 5) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, sz * 2, sz * .6, -.3, 0, 7); ctx.stroke(); } });
    ctx.restore();
    // L3 rocks
    ctx.save(); ctx.translate(-cam * 1.2, 0);
    for (const r of PX.rocks) { ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(t * .2);
      ctx.beginPath(); r.pts.forEach((k, i) => { const a = i / r.pts.length * 6.283; const x = Math.cos(a) * r.r * k, y = Math.sin(a) * r.r * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
      ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.fillStyle = '#1b1426'; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#FFD600'; ctx.globalAlpha = .6; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1; ctx.restore(); }
    ctx.restore();
    // L4 dust
    for (const [x, y, s] of PX.dust) glowDot(ctx, x - cam * 2, y, s, 'rgba(255,220,180,.35)');
    // depth labels
    ctx.font = `bold 20px ${MONO}`; ctx.fillStyle = '#FFD600';
    ['z=0.1 stars', 'z=0.3 nebula', 'z=0.6 disk', 'z=1.2 rocks', 'z=2.0 dust'].forEach((s, i) => ctx.fillText(s, 120, 180 + i * 30));
  }
};

// ---------- voxel earth ----------
let vx;
const voxelScene = {
  init(env) {
    const T = env.GL.THREE, R = rng(88), Rad = 13; const cells = [];
    for (let x = -Rad; x <= Rad; x++) for (let y = -Rad; y <= Rad; y++) for (let z = -Rad; z <= Rad; z++) {
      const d = Math.hypot(x, y, z); if (d > Rad || d <= Rad - 1.3) continue;
      const n = fbm(x * .11 + 3, y * .11, z * .11, 4); const land = n > .02;
      let c; if (Math.abs(y) > Rad * .82) c = '#f2f6ff'; else if (land) c = n > .16 ? '#8d6e4a' : (n > .1 ? '#3d8b3d' : '#56b04a'); else c = n < -.12 ? '#154fa8' : '#1f78e0';
      const tgt = new T.Vector3(x, y, z).multiplyScalar(land ? 1.05 : 1);
      const dir = tgt.clone().normalize();
      const start = dir.clone().multiplyScalar(Rad * (2.5 + R() * 2.5)).add(new T.Vector3(gauss(R), gauss(R) + 8, gauss(R)).multiplyScalar(4));
      cells.push({ tgt, start, a: (y + Rad) / (2 * Rad) * .55 + R() * .08, c: new T.Color(c) });
    }
    const mesh = new T.InstancedMesh(new T.BoxGeometry(.94, .94, .94), new T.MeshStandardMaterial({ roughness: .7, flatShading: true }), cells.length);
    cells.forEach((c, i) => mesh.setColorAt(i, c.c));
    const moon = new T.Group(); for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) for (let z = -2; z <= 2; z++) if (Math.hypot(x, y, z) <= 2.3) { const m = new T.Mesh(new T.BoxGeometry(.94, .94, .94), new T.MeshStandardMaterial({ color: 0xaaaaaa, flatShading: true })); m.position.set(x, y, z); moon.add(m); }
    const scene = new T.Scene(); scene.background = new T.Color(0x02030a);
    const grp = new T.Group(); grp.add(mesh); scene.add(grp); scene.add(moon); scene.add(starfield(T));
    scene.add(new T.AmbientLight(0x8090c0, .9)); const sun = new T.DirectionalLight(0xfff1d0, 2.6); sun.position.set(20, 10, 12); scene.add(sun);
    vx = { scene, cam: new T.PerspectiveCamera(40, W / H, .1, 400), mesh, grp, moon, cells, m4: new T.Matrix4(), v: new T.Vector3(), T };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, { cells, mesh, m4, v } = vx;
    cells.forEach((c, i) => { const k = easeOut(clamp((p - c.a) / .28)); v.lerpVectors(c.start, c.tgt, k); v.x = Math.round(v.x * 2) / 2; v.y = Math.round(v.y * 2) / 2; v.z = Math.round(v.z * 2) / 2; if (k >= 1) v.copy(c.tgt);
      const s = k < .02 ? .0001 : 1; m4.makeScale(s, s, s).setPosition(v); mesh.setMatrixAt(i, m4); });
    mesh.instanceMatrix.needsUpdate = true; vx.grp.rotation.y = t * .5; vx.grp.rotation.z = .41;
    const ma = t * .8 + 2; vx.moon.position.set(Math.cos(ma) * 24, 3, Math.sin(ma) * 24); vx.moon.visible = p > .6;
    vx.cam.position.set(0, 8, 56); vx.cam.lookAt(0, 0, 0);
    env.GL.draw(ctx, vx.scene, vx.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#FF3D7F';
    ctx.fillText(`voxels placed: ${cells.filter(c => p > c.a + .2).length} / ${cells.length}`, 120, 200);
  }
};

// ---------- code rain DNA ----------
const RAIN = (() => { const R = rng(12); return Array.from({ length: 70 }, () => ({ sp: 500 + R() * 700, off: R() * 2000, len: 10 + Math.floor(R() * 18), s: Math.floor(R() * 1000) })); })();
const rainScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, f = env.f;
    ctx.fillStyle = '#010502'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 26px ${MONO}`; ctx.textAlign = 'center'; const lh = 30;
    RAIN.forEach((c, i) => { const x = 14 + i * 28; const head = (t * c.sp + c.off) % (H + c.len * lh + 200) - 100;
      for (let k = 0; k < c.len; k++) { const y = head - k * lh; if (y < -30 || y > H + 30) continue;
        const ch = 'ATCG'[(c.s + k * 7 + Math.floor(t * 12) * (k === 0 ? 3 : 0) + Math.floor(y / lh)) & 3];
        ctx.fillStyle = k === 0 ? '#eaffea' : `rgba(0,255,90,${(1 - k / c.len) * .75})`; ctx.fillText(ch, x, y); } });
    // DNA helix
    const cx = W / 2, n = 24, shown = Math.floor(easeOut(p * 1.2) * n);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(cx - 280, 100, 560, 800);
    for (let i = 0; i < shown; i++) {
      const y = 140 + i * 30, th = i * .5 + t * 3.2, x1 = cx + Math.cos(th) * 200, x2 = cx - Math.cos(th) * 200, z = Math.sin(th);
      const pair = ['A', 'T', 'C', 'G'][(i * 5 + 1) % 4], comp = { A: 'T', T: 'A', C: 'G', G: 'C' }[pair];
      ctx.strokeStyle = `rgba(160,255,190,${.35 + .3 * Math.abs(z)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.font = `bold ${30 + z * 8}px ${MONO}`;
      ctx.fillStyle = z > 0 ? '#ffffff' : '#62ff9a'; ctx.fillText(pair, x1, y + 10);
      ctx.fillStyle = z > 0 ? '#62ff9a' : '#ffffff'; ctx.fillText(comp, x2, y + 10);
    }
    ctx.textAlign = 'left';
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#62ff9a'; ctx.fillText(`genome.length = ${Math.floor(p * 3.2e9).toLocaleString()} bp`, 120, 200);
  }
};

export const SCENES = { ascii: asciiScene, lowpoly: lowpolyScene, ca: caScene, pointcloud: pointcloudScene, galaxy: galaxyScene,
  spacetime: spacetimeScene, glitch: glitchScene, parallax: parallaxScene, voxel: voxelScene, rain: rainScene };
```

### 8/9 · `web/scenes_c.js`
<!-- casebook-file {"path": "web/scenes_c.js", "lines": 328, "final_newline": true, "sha256": "b2f3bef80c8fd1cab70ee6700965990a192946ebe17fac0ce32d40a1c12170e8", "original_sha256": "b2f3bef80c8fd1cab70ee6700965990a192946ebe17fac0ce32d40a1c12170e8"} -->
```js
import { W, H, MONO, SANS, MATH, rng, clamp, lerp, smooth, easeOut, easeInOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

// ---------- 3D card stack (today) ----------
const SNIPS = [
  ['while (alive) {', '  learn();', '  build();', '}'], ['human.ask("why?")'], ['git commit -m', '  "civilization"'],
  ['const me =', '  stardust.recombine()'], ['telescope', '  .point(sky)'], ['import { curiosity }', '  from "@human"'],
  ['for (;;) wonder++'], ['print("hello,', '  universe")'], ['await think()'], ['new Language()'],
];
const CARD_C = ['#00E5FF', '#FFD600', '#FF3D7F', '#B388FF'];
let cd;
function cardTex(T, lines, i, hero) {
  const c = makeCanvas(640, 400), x = c.getContext('2d');
  x.fillStyle = hero ? '#FFD600' : '#12141c'; x.fillRect(0, 0, 640, 400);
  if (!hero) {
    x.fillStyle = CARD_C[i % 4]; x.fillRect(0, 0, 640, 44);
    x.fillStyle = '#000'; x.font = `bold 24px ${MONO}`; x.fillText(`human_${String(i).padStart(2, '0')}.js`, 18, 31);
    x.font = `bold 38px ${MONO}`; lines.forEach((l, k) => { x.fillStyle = k % 2 ? '#9CDCFE' : '#fff'; x.fillText(l, 30, 120 + k * 58); });
    x.strokeStyle = CARD_C[i % 4]; x.lineWidth = 6; x.strokeRect(3, 3, 634, 394);
  } else {
    x.fillStyle = '#000'; x.font = `900 76px ${SANS}`; x.fillText('你在这里', 40, 130);
    x.font = `900 60px ${MONO}`; x.fillText('YOU ARE HERE', 40, 220);
    x.font = `bold 34px ${MONO}`; x.fillText('13.8 Gyr · 1 planet', 40, 300); x.fillText('8 billion observers', 40, 350);
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}
const cardsScene = {
  init(env) {
    const T = env.GL.THREE; const scene = new T.Scene(); scene.background = new T.Color(0x0b0a12);
    const cards = SNIPS.map((s, i) => { const m = new T.Mesh(new T.PlaneGeometry(3.2, 2), new T.MeshBasicMaterial({ map: cardTex(T, s, i, false), side: T.DoubleSide })); scene.add(m); return m; });
    const hero = new T.Mesh(new T.PlaneGeometry(4.2, 2.62), new T.MeshBasicMaterial({ map: cardTex(T, [], 0, true), side: T.DoubleSide })); scene.add(hero);
    const grid = new T.GridHelper(40, 40, 0x333355, 0x1a1a2a); grid.position.y = -3; scene.add(grid);
    cd = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 200), cards, hero };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p;
    cd.cards.forEach((m, i) => {
      const a = i / cd.cards.length * 6.283 + t * .6, r = 6.2, y = (i % 5 - 2) * 1.1;
      const arrive = easeOut(clamp((p * 1.6 - i * .06) / .5));
      const R = lerp(20, r, arrive);
      m.position.set(Math.cos(a) * R, y + (1 - arrive) * 6, Math.sin(a) * R);
      m.lookAt(0, y, 0); m.rotateY(Math.PI);
    });
    const hp = back(clamp((p - .35) / .25));
    cd.hero.scale.setScalar(Math.max(.001, hp)); cd.hero.position.set(0, .2, 0);
    const ca = Math.sin(t * .5) * .35; cd.cam.position.set(Math.sin(ca) * 11, 2.2, Math.cos(ca) * 11); cd.cam.lookAt(0, 0, 0);
    cd.hero.lookAt(cd.cam.position);
    env.GL.draw(ctx, cd.scene, cd.cam, 1);
    if (hp > .5) { for (let k = 0; k < 3; k++) { const ph = (t * 1.2 + k / 3) % 1; ctx.strokeStyle = `rgba(255,214,0,${1 - ph})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(W / 2, H / 2 - 20, 260 + ph * 320, 0, 7); ctx.stroke(); } }
  }
};

// ---------- data viz: dark energy ----------
const Om = .31, OL = .69, TH = 14.4;
const aT = t => Math.pow(Om / OL, 1 / 3) * Math.pow(Math.sinh(1.5 * Math.sqrt(OL) * t / TH), 2 / 3);
const datavizScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#0c0f16'; ctx.fillRect(0, 0, W, H);
    const X0 = 190, X1 = 1380, Y0 = 820, Y1 = 170, TM = 60, AM = 16;
    const sx = v => X0 + (X1 - X0) * v / TM, sy = v => Y0 - (Y0 - Y1) * v / AM;
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.font = `20px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let v = 0; v <= TM; v += 10) { ctx.beginPath(); ctx.moveTo(sx(v), Y0); ctx.lineTo(sx(v), Y1); ctx.stroke(); ctx.fillText(v, sx(v) - 10, Y0 + 32); }
    for (let v = 0; v <= AM; v += 4) { ctx.beginPath(); ctx.moveTo(X0, sy(v)); ctx.lineTo(X1, sy(v)); ctx.stroke(); ctx.fillText(v, X0 - 40, sy(v) + 7); }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, Y1); ctx.lineTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `bold 24px ${MONO}`; ctx.fillText('t / Gyr →', X1 - 120, Y0 + 70); ctx.fillText('a(t)  宇宙尺度因子', X0, Y1 - 24);
    const tEnd = lerp(3, TM, easeInOut(p));
    // DE region
    ctx.fillStyle = 'rgba(0,229,255,.07)'; ctx.fillRect(sx(7.7), Y1, sx(Math.min(tEnd, TM)) - sx(7.7), Y0 - Y1);
    // matter only (dashed)
    ctx.setLineDash([10, 10]); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 3; ctx.beginPath();
    for (let v = 0; v <= tEnd; v += .25) { const y = sy(Math.pow(v / 13.8, 2 / 3)); v ? ctx.lineTo(sx(v), y) : ctx.moveTo(sx(v), y); } ctx.stroke(); ctx.setLineDash([]);
    neon(ctx, () => { for (let v = 0.01; v <= tEnd; v += .2) { const y = sy(Math.min(AM + 2, aT(v))); v > .02 ? ctx.lineTo(sx(v), y) : ctx.moveTo(sx(v), y); } }, '#00E5FF', 5, 22);
    const hx = sx(tEnd), hy = sy(Math.min(AM + 2, aT(tEnd))); glowDot(ctx, hx, hy, 40, '#ffffff');
    // annotations
    const ann = (tv, lab, col) => { if (tEnd < tv) return; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(sx(tv), Y0); ctx.lineTo(sx(tv), Y1 + 60); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.font = `bold 24px ${SANS}`; ctx.fillText(lab, sx(tv) + 10, Y1 + (tv > 10 ? 120 : 80)); };
    ann(7.7, '开始加速', '#FFD600'); ann(13.8, '今天', '#FF3D7F');
    ctx.font = `bold 22px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText('- - - 无暗能量', X1 - 300, sy(4.2));
    // donut
    const at = aT(tEnd), fDE = OL / (OL + Om * Math.pow(at, -3));
    const cx = 1640, cy = 470, r = 150;
    ctx.lineWidth = 56; ctx.strokeStyle = '#FFD600'; ctx.beginPath(); ctx.arc(cx, cy, r, -1.5708, 6.283 - 1.5708); ctx.stroke();
    ctx.strokeStyle = '#00E5FF'; ctx.beginPath(); ctx.arc(cx, cy, r, -1.5708, -1.5708 + 6.283 * fDE); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = `900 56px ${MONO}`; ctx.fillText(Math.round(fDE * 100) + '%', cx, cy + 10);
    ctx.font = `bold 22px ${SANS}`; ctx.fillText('暗能量占比', cx, cy + 46);
    ctx.fillStyle = '#00E5FF'; ctx.fillText('■ 暗能量 Λ', cx - 70, cy + 250); ctx.fillStyle = '#FFD600'; ctx.fillText('■ 物质', cx + 90, cy + 250);
    ctx.fillStyle = '#fff'; ctx.font = `bold 26px ${MONO}`; ctx.fillText(`t = ${tEnd.toFixed(1)} Gyr   a = ${at.toFixed(2)}`, cx, cy - 220);
    ctx.textAlign = 'left';
  }
};

// ---------- light cone (3+1) ----------
const LC = (() => { const R = rng(9); return Array.from({ length: 22 }, (_, i) => { const a = R() * 6.283, r = i < 4 ? .25 + R() * .25 : .5 + R() * .9; return { x: Math.cos(a) * r, z: Math.sin(a) * r, bound: i < 4 }; }); })();
const gU = u => Math.pow(Math.sinh(3.4 * u) / Math.sinh(3.4), 2 / 3) * 7 + .6;
const lightconeScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#06030e'; ctx.fillRect(0, 0, W, H);
    const cam = camera(t * .45 + .6, .3, 24, 1650, W / 2 + 80, H / 2 + 330);
    const HT = 12, Rh = 5.2, uNow = lerp(.35, 1, easeInOut(p));
    const P = (x, u, z) => cam(x, u * HT, z);
    const line = (pts, col, w, a = 1) => neon(ctx, () => pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])), col, w, w * 5, a);
    // horizon cylinder
    for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283; line([P(Math.cos(a) * Rh, 0, Math.sin(a) * Rh), P(Math.cos(a) * Rh, 1, Math.sin(a) * Rh)], '#FF3D7F', 1, .25); }
    for (const u of [0, .5, 1]) line(Array.from({ length: 49 }, (_, k) => P(Math.cos(k / 48 * 6.283) * Rh, u, Math.sin(k / 48 * 6.283) * Rh)), '#FF3D7F', 1.5, .4);
    // now plane
    line(Array.from({ length: 49 }, (_, k) => P(Math.cos(k / 48 * 6.283) * 11, uNow, Math.sin(k / 48 * 6.283) * 11)), '#ffffff', 1.5, .35);
    // our worldline + light cone
    line([P(0, 0, 0), P(0, uNow, 0)], '#FFD600', 4);
    const u0 = .35; for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283, rr = (uNow - u0) * 9; if (uNow > u0) line([P(0, u0, 0), P(Math.cos(a) * rr, uNow, Math.sin(a) * rr)], '#B388FF', 1.2, .5); }
    // galaxies
    for (const g of LC) {
      const pts = []; let out = false;
      for (let u = 0; u <= uNow; u += .02) { const s = g.bound ? 2 : gU(u); const x = g.x * s, z = g.z * s; pts.push(P(x, u, z)); if (Math.hypot(x, z) > Rh) out = true; }
      const col = g.bound ? '#3dffa0' : out ? '#FF3D7F' : '#00E5FF';
      line(pts, col, 2.2, out ? .55 : 1);
      const q = pts[pts.length - 1]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, 7); ctx.fill();
    }
    ctx.font = `bold 24px ${MONO}`;
    const lab = (x, u, z, s, c) => { const q = P(x, u, z); ctx.fillStyle = c; ctx.fillText(s, q[0] + 12, q[1]); };
    lab(0, 1.02, 0, 'time ↑', '#fff'); lab(Rh, .15, 0, 'event horizon', '#FF3D7F');
    ctx.fillStyle = '#3dffa0'; ctx.fillText('● 本星系群 (引力束缚)', 120, 190); ctx.fillStyle = '#FF3D7F'; ctx.fillText('● 已越过视界 · 永不可见', 120, 226); ctx.fillStyle = '#00E5FF'; ctx.fillText('● 仍可见', 120, 262);
  }
};

// ---------- volumetric red giant ----------
let vo;
const volumeScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({ uniforms: { uT: { value: 0 }, uR: { value: .6 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `precision highp float; varying vec2 vUv; uniform float uT, uR; uniform vec2 uRes;
float h(vec3 p){ p = fract(p*0.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float n(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
 return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*n(p); p=p*2.1; a*=.5; } return s; }
void main(){
  vec2 uv = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.);
  vec3 ro = vec3(0,0,-4.), rd = normalize(vec3(uv,1.8));
  vec3 col = vec3(0.); float T = 1.;
  float b = dot(ro,rd), c = dot(ro,ro)-uR*uR*1.25, disc = b*b-c;
  vec3 sp = floor(rd*300.); col += vec3(step(.997,h(sp)))*.6;
  if(disc>0.){
    float t0 = -b-sqrt(disc), t1 = -b+sqrt(disc); float dt = (t1-t0)/40.;
    vec3 acc = vec3(0.);
    for(int i=0;i<40;i++){
      vec3 p = ro+rd*(t0+dt*(float(i)+.5));
      float r = length(p)/uR;
      float d = fbm(p*2.2/uR + vec3(0.,uT*.6,uT*.3)) ;
      float den = clamp((1.08-r)*3.,0.,1.)*(0.35+d*1.3);
      vec3 e = mix(vec3(1.,.95,.7), vec3(1.,.28,.05), smoothstep(.2,.95,r));
      e = mix(e, vec3(.5,.02,.02), smoothstep(.85,1.1,r));
      acc += T*den*dt*e*3.2; T *= exp(-den*dt*3.5);
      if(T<.02) break;
    }
    col = col*T + acc;
  }
  col += vec3(1.,.3,.1)*.25*exp(-max(length(uv)-uR*.45,0.)*3.);
  gl_FragColor = vec4(col,1.);
}` });
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    vo = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, R = lerp(.35, 2.1, easeInOut(p));
    vo.mat.uniforms.uT.value = t; vo.mat.uniforms.uR.value = R;
    env.GL.draw(ctx, vo.scene, vo.cam, .5);
    const rpx = R * 1.8 / Math.sqrt(16 - R * R) * 540;
    const orbs = [['水星', 190], ['金星', 330], ['地球 ?', 470], ['火星', 720]];
    ctx.font = `bold 24px ${SANS}`;
    orbs.forEach(([n, r], i) => { const gone = rpx > r * .98; const a = t * (1.6 - i * .3) + i * 2;
      ctx.strokeStyle = gone ? 'rgba(255,60,60,.8)' : 'rgba(255,255,255,.4)'; ctx.lineWidth = 2; ctx.setLineDash(gone ? [8, 8] : []);
      ctx.beginPath(); ctx.ellipse(W / 2, H / 2, r, r * .3, -.15, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const x = W / 2 + Math.cos(a) * r * Math.cos(-.15) - Math.sin(a) * r * .3 * Math.sin(-.15), y = H / 2 + Math.cos(a) * r * Math.sin(-.15) + Math.sin(a) * r * .3 * Math.cos(-.15);
      if (!gone) { ctx.fillStyle = i === 2 ? '#4f9dff' : '#ddd'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); }
      ctx.fillStyle = gone ? '#ff5c5c' : '#fff'; ctx.fillText(gone ? n + ' ✕' : n, W / 2 + r * .98 + 10, H / 2 - r * .14 - 8); });
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#ffb38a'; ctx.fillText(`R☉ × ${Math.round(lerp(1, 250, easeInOut(p)))}`, 120, 200);
  }
};

// ---------- isometric: stars dying ----------
const ISO = (() => { const R = rng(4), N = 11, cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const m = R();
    const type = m < .1 ? 0 : m < .25 ? 1 : m < .5 ? 2 : m < .75 ? 3 : 4; // O B→white→yellow→orange→red
    const d = [0.02, .18, .38, .58, .76][type] + R() * .16; cells.push({ x, y, type, d, h: [300, 220, 160, 110, 70][type] * (.8 + R() * .4) }); }
  return { N, cells }; })();
const SC = ['#7fb0ff', '#e9f1ff', '#ffe98a', '#ffb05a', '#ff5a4a'], REM = ['#140024', '#ffffff', '#dfe7ff', '#c8c8c8', '#6a2a2a'];
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * k, g = (n >> 8 & 255) * k, b = (n & 255) * k; return `rgb(${r | 0},${g | 0},${b | 0})`; }
function isoBox(ctx, sx, sy, tw, th, h, col) {
  ctx.fillStyle = shade(col, 1); ctx.beginPath(); ctx.moveTo(sx, sy - h - th); ctx.lineTo(sx + tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx - tw, sy - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, .7); ctx.beginPath(); ctx.moveTo(sx - tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx, sy + th); ctx.lineTo(sx - tw, sy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, .45); ctx.beginPath(); ctx.moveTo(sx + tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx, sy + th); ctx.lineTo(sx + tw, sy); ctx.closePath(); ctx.fill();
}
const isoScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, W, H);
    const tw = 52, th = 26, ox = W / 2, oy = 330; let alive = 0;
    const cells = [...ISO.cells].sort((a, b) => (a.x + a.y) - (b.x + b.y));
    for (const c of cells) {
      const sx = ox + (c.x - c.y) * tw, sy = oy + (c.x + c.y) * th;
      isoBox(ctx, sx, sy, tw - 2, th - 1, 6, '#2a2438');
      const k = 1 - smooth((p - c.d) / .1);
      if (k > .01) { alive++; const h = c.h * k * (1 + .04 * Math.sin(t * 9 + c.x)); isoBox(ctx, sx, sy - 6, tw * .55, th * .55, h, SC[c.type]);
        if (k < .6) glowDot(ctx, sx, sy - 6 - h, 60, 'rgba(255,255,255,.8)', (.6 - k) * 1.6); }
      else { const col = REM[c.type]; isoBox(ctx, sx, sy - 6, tw * (c.type === 0 ? .3 : .22), th * .22, c.type === 0 ? 20 : 14, col);
        if (c.type === 0) { ctx.strokeStyle = '#B388FF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy - 20, 26, 12, 0, 0, 7); ctx.stroke(); } }
    }
    ctx.font = `bold 30px ${MONO}`; ctx.fillStyle = '#FFD600';
    ctx.fillText(`stars.alive = ${alive.toString().padStart(3, ' ')} / ${ISO.cells.length}`, 120, 200);
    ctx.font = `bold 22px ${SANS}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('大质量先死 → 红矮星最后熄灭 · 余下白矮星 / 黑洞', 120, 240);
  }
};

// ---------- math animation ----------
function reveal(ctx, x, y, w, h, k, fn) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * clamp(k), h); ctx.clip(); fn(); ctx.restore(); }
const mathScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const M = (s, sz = 86, it = true) => `${it ? 'italic ' : ''}${sz}px ${MATH}`;
    // line 1
    reveal(ctx, 180, 150, 900, 140, p / .28, () => {
      ctx.font = M(''); ctx.fillStyle = '#FFD600'; ctx.fillText('p⁺', 200, 250);
      ctx.fillStyle = '#fff'; ctx.font = M('', 86, false); ctx.fillText('→', 330, 250); ctx.font = M(''); ctx.fillText('e⁺ + π⁰', 460, 250); });
    reveal(ctx, 180, 290, 900, 140, (p - .22) / .25, () => {
      ctx.font = M(''); ctx.fillStyle = '#fff'; ctx.fillText('τ', 200, 390); ctx.font = `64px ${MATH}`; ctx.fillText('p', 238, 408);
      ctx.font = M('', 86, false); ctx.fillText('> 10', 300, 390); ctx.font = `56px ${MATH}`; ctx.fillText('34', 470, 345); ctx.font = M('', 86, false); ctx.fillText('yr  ?', 560, 390); });
    if (p > .4) { const k = clamp((p - .4) / .12); ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 4; ctx.beginPath(); const L = 2 * (130 + 120) * k; // surrounding rect draw-on
      ctx.setLineDash([L, 9999]); ctx.strokeRect(186, 310, 130, 120); ctx.setLineDash([]); }
    reveal(ctx, 180, 440, 1000, 150, (p - .42) / .25, () => {
      ctx.font = M(''); ctx.fillStyle = '#58C4DD'; ctx.fillText('N(t) = N', 200, 540); ctx.font = `56px ${MATH}`; ctx.fillText('0', 540, 560);
      ctx.font = M(''); ctx.fillText('· e', 590, 540); ctx.font = `italic 56px ${MATH}`; ctx.fillText('−t/τ', 700, 490); });
    // plot
    const X0 = 200, X1 = 1000, Y0 = 820, Y1 = 620, k = clamp((p - .55) / .45);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, Y1 - 20); ctx.lineTo(X0, Y0); ctx.lineTo(X1 + 20, Y0); ctx.stroke();
    ctx.strokeStyle = '#58C4DD'; ctx.lineWidth = 6; ctx.beginPath();
    for (let x = 0; x <= k; x += .01) { const y = Y0 - (Y0 - Y1) * Math.exp(-x * 4); x ? ctx.lineTo(X0 + x * (X1 - X0), y) : ctx.moveTo(X0, y); } ctx.stroke();
    if (k > 0) glowDot(ctx, X0 + k * (X1 - X0), Y0 - (Y0 - Y1) * Math.exp(-k * 4), 30, '#FFD600');
    // proton dots decaying
    const R = rng(123), frac = Math.exp(-k * 4);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) { const r = R(); const x = 1200 + i * 50, y = 200 + j * 72;
      const alive = r < frac; ctx.fillStyle = alive ? '#FFD600' : 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(x, y, alive ? 16 : 6, 0, 7); ctx.fill();
      if (!alive && r < frac + .05) glowDot(ctx, x, y, 40, 'rgba(255,90,90,1)', .9); }
    ctx.font = `bold 24px ${MONO}`; ctx.fillStyle = '#fff'; ctx.fillText(`protons left: ${Math.round(frac * 100)}%`, 1200, 800);
  }
};

// ---------- vector scope: hawking ----------
const scopeScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#010a04'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2 - 220, cy = H / 2 - 20;
    ctx.strokeStyle = 'rgba(57,255,122,.12)'; ctx.lineWidth = 1;
    for (let x = cx - 700; x <= cx + 700; x += 70) { ctx.beginPath(); ctx.moveTo(x, cy - 350); ctx.lineTo(x, cy + 350); ctx.stroke(); }
    for (let y = cy - 350; y <= cy + 350; y += 70) { ctx.beginPath(); ctx.moveTo(cx - 700, y); ctx.lineTo(cx + 700, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(57,255,122,.3)'; ctx.beginPath(); ctx.moveTo(cx - 700, cy); ctx.lineTo(cx + 700, cy); ctx.moveTo(cx, cy - 350); ctx.lineTo(cx, cy + 350); ctx.stroke();
    const Mf = q => Math.pow(Math.max(0, 1 - q * .985), 1 / 3);
    for (let e = 3; e >= 0; e--) { // phosphor persistence
      const q = Math.max(0, p - e * .02), Rb = 330 * Mf(q), a = e ? .18 / e : 1;
      neon(ctx, () => { for (let k = 0; k <= 120; k++) { const an = k / 120 * 6.283, w = 1 + .03 * Math.sin(an * 7 + t * 20) * (1 - Mf(q) + .2);
        const x = cx + Math.cos(an) * Rb * w, y = cy + Math.sin(an) * Rb * w; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, '#39ff7a', 3, 16, a);
    }
    const M = Mf(p), Rb = 330 * M, rate = Math.min(400, 12 / Math.max(M, .03));
    const R = rng(Math.floor(t * 12) * 13 + 1);
    ctx.strokeStyle = '#b8ffcf'; ctx.lineWidth = 2;
    for (let i = 0; i < rate; i++) { const an = R() * 6.283, d = Rb + R() * 500, l = 16 + R() * 30;
      ctx.globalAlpha = .9 - (d - Rb) / 600; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * d, cy + Math.sin(an) * d); ctx.lineTo(cx + Math.cos(an) * (d + l), cy + Math.sin(an) * (d + l)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (p > .93) glowDot(ctx, cx, cy, 700 * (p - .93) / .07 + 50, 'rgba(220,255,230,1)', 1);
    // readout panel: T vs t
    const X0 = 1400, X1 = 1840, Y0 = 700, Y1 = 380;
    ctx.strokeStyle = 'rgba(57,255,122,.5)'; ctx.lineWidth = 2; ctx.strokeRect(X0, Y1, X1 - X0, Y0 - Y1);
    neon(ctx, () => { for (let q = 0; q <= p; q += .005) { const T = Math.min(1, .08 / Math.max(Mf(q), .08)); const x = X0 + (X1 - X0) * q, y = Y0 - (Y0 - Y1) * T; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, '#39ff7a', 2.5, 10);
    ctx.font = `bold 22px ${MONO}`; ctx.fillStyle = '#39ff7a';
    ctx.fillText('CH1  T_H(t)', X0, Y1 - 16); ctx.fillText(`M = ${(M * 100).toFixed(1)}%`, X0, Y0 + 36); ctx.fillText('T_H = ħc³ / 8πGMk_B', X0, Y0 + 72); ctx.fillText('M³ ∝ (t_evap − t)', X0, Y0 + 106);
    ctx.fillText('10 ms/div   ·   5 V/div   ·   TRIG ▲', cx - 700, cy - 370);
    scanlines(ctx, .15, 3);
  }
};

// ---------- TUI heat death ----------
const tuiScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    const fadeG = smooth((p - .72) / .28);
    ctx.fillStyle = '#000814'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 28px ${MONO}`; const cw = ctx.measureText('0').width, lh = 42, x0 = 110; let y = 190;
    const col = c => fadeG > 0 ? mix(c, '#5a5a5a', fadeG) : c;
    const bar = (lab, v, txt, c) => { const n = 56, k = Math.round(clamp(v) * n);
      ctx.fillStyle = col('#00E5FF'); ctx.fillText(lab, x0, y);
      ctx.fillStyle = col('#fff'); ctx.fillText('[' + ' '.repeat(n) + ']', x0 + cw * 4, y);
      ctx.fillStyle = col(c); ctx.fillText('|'.repeat(k), x0 + cw * 5, y);
      ctx.fillStyle = col('#eee'); ctx.fillText(txt, x0 + cw * (4 + n + 3), y); y += lh; };
    const S = lerp(.9, 1, easeOut(clamp(p / .7)));
    bar('  S', S, (S * 100).toFixed(4) + '%', S > .999 ? '#ff4d4d' : '#3ddc84');
    bar('  F', 1 - S, ((1 - S) * 100).toFixed(4) + '%', '#FFD600');
    bar('  T', .02 * (1 - p), `1e-${Math.round(lerp(20, 30, p))} K`, '#B388FF');
    y += 10; ctx.fillStyle = col('#ddd');
    ctx.fillText(`  Tasks: stars 0, black holes ${Math.max(0, Math.round(3 * (1 - p * 1.4)))}, photons ∞ (redshifting)`, x0, y); y += lh;
    ctx.fillText(`  Load average: 0.00 0.00 0.00    Uptime: 10^${Math.round(lerp(100, 1000, p))} yr`, x0, y); y += lh + 14;
    ctx.fillStyle = col('#3ddc84'); ctx.fillRect(x0, y - 32, W - 2 * x0, lh); ctx.fillStyle = '#000';
    ctx.fillText('  PID USER       PRI  S   %CPU  %MEM  COMMAND', x0, y); y += lh + 6;
    const rows = [
      ['    1', 'cosmos   ', ' 20', 'S', ' 0.0', ' 0.0', '/sbin/universe --idle', '#fff'],
      ['   42', 'photon   ', ' 20', 'R', ' 0.0', '   ∞', 'redshift --forever', '#9CDCFE'],
      ['   77', 'electron ', ' 20', 'S', ' 0.0', ' 0.0', 'drift', '#9CDCFE'],
      ['  108', 'neutrino ', ' 20', 'S', ' 0.0', ' 0.0', 'drift', '#9CDCFE'],
      ['  404', 'star     ', ' --', 'X', '   —', '   —', '[defunct]', '#ff5c5c'],
      ['  666', 'blackhole', ' --', 'X', '   —', '   —', '[evaporated]', '#ff5c5c'],
      ['  999', 'you      ', ' --', 'X', '   —', '   —', '[remembered]', '#FFD600'],
    ];
    rows.forEach((r, i) => { if (p < i * .07) return; ctx.fillStyle = col(r[7]);
      ctx.fillText(`${r[0]} ${r[1]}  ${r[2]}  ${r[3]}  ${r[4]}  ${r[5]}  ${r[6]}`, x0, y); y += lh; });
    const fy = 880; const keys = ['F1Help', 'F2Setup', 'F3Search', 'F5Tree', 'F9Kill', 'F10Quit'];
    let fx = x0; ctx.font = `bold 24px ${MONO}`;
    keys.forEach((k, i) => { const w = ctx.measureText(k).width + 30; ctx.fillStyle = i === 5 && p > .6 ? col('#ff4d4d') : col('#00E5FF'); ctx.fillRect(fx, fy - 28, w, 38); ctx.fillStyle = '#000'; ctx.fillText(k, fx + 15, fy); fx += w + 10; });
    if (fadeG > 0) { ctx.fillStyle = `rgba(90,90,90,${fadeG * .85})`; ctx.fillRect(0, 0, W, H); }
    if (p > .85) { ctx.textAlign = 'center'; ctx.fillStyle = `rgba(255,255,255,${(p - .85) / .15})`; ctx.font = `900 60px ${MONO}`; ctx.fillText('S = S_max · nothing left to compute', W / 2, H / 2); ctx.textAlign = 'left'; }
  }
};
function mix(a, b, k) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map(s => Math.round(lerp(A >> s & 255, B >> s & 255, k))); return `rgb(${c.join(',')})`; }

export const SCENES = { cards: cardsScene, dataviz: datavizScene, lightcone: lightconeScene, volume: volumeScene, iso: isoScene, math: mathScene, scope: scopeScene, tui: tuiScene };
```

### 9/9 · `web/shots.js`
<!-- casebook-file {"path": "web/shots.js", "lines": 37, "final_newline": true, "sha256": "32390400b6019219ecc73147db7d6ad5de90dc0d5973ef9e329cd0f151308fac", "original_sha256": "32390400b6019219ecc73147db7d6ad5de90dc0d5973ef9e329cd0f151308fac"} -->
```js
// 120 BPM · 12 unique fps (stop-motion) · 6 frames per beat
// beats: shot length in beats (4 = 2s, 6 = 3s). Last beat of every shot = FREEZE card (定格).
export const BPM = 120, FPS = 12, FPB = 6;
export const SHOTS = [
  { id:'terminal',  b:6, dim:'2D',   style:'TERMINAL TYPEWRITER', zh:'终端打字机',   ev:'宇宙之前',        t:'t = undefined',     code:'$ ./universe --before-time' },
  { id:'hexdump',   b:6, dim:'2D',   style:'HEX DUMP',            zh:'十六进制内存',  ev:'量子涨落 · 虚空不空', t:'t < 0 ?',          code:'xxd vacuum.bin | grep -v 00' },
  { id:'raymarch',  b:4, dim:'3D',   style:'RAYMARCHING SDF',     zh:'光线步进',     ev:'奇点',            t:'t → 0',             code:'d = length(p) - r(t);' },
  { id:'kinetic',   b:4, dim:'2D',   style:'KINETIC TYPE',        zh:'动态文字',     ev:'大爆炸',          t:'t = 0',             code:'new Universe();' },
  { id:'tesseract', b:6, dim:'4D',   style:'TESSERACT PROJECTION',zh:'四维超立方投影', ev:'暴胀 · 维度展开',   t:'t = 10⁻³⁶ s',        code:'rotate(XW, YW); project(4→3→2)' },
  { id:'plasma',    b:4, dim:'2D',   style:'FRAGMENT SHADER',     zh:'片元着色器',    ev:'夸克-胶子等离子体',  t:'t = 10⁻¹² s',        code:'col = fbm(p + fbm(p + t));' },
  { id:'graph',     b:4, dim:'2D',   style:'FORCE GRAPH',         zh:'力导向图',     ev:'强子形成',         t:'t = 10⁻⁶ s',         code:'link(u, u, d) // proton' },
  { id:'ide',       b:6, dim:'2D',   style:'IDE SYNTAX',          zh:'编辑器语法高亮', ev:'太初核合成',        t:'t = 3 min',          code:'fuse(p, n) → D → He' },
  { id:'pixel',     b:4, dim:'2D',   style:'PIXEL ART',           zh:'像素画',       ev:'复合 · 宇宙微波背景', t:'t = 38 万年',         code:'ctx.fillRect(x*24, y*24, 24, 24)' },
  { id:'ascii',     b:6, dim:'2D',   style:'ASCII RENDER',        zh:'字符画',       ev:'黑暗时代',         t:'t = 1 亿年',          code:'" .:-=+*#%@"[ρ * 9]' },
  { id:'lowpoly',   b:4, dim:'3D',   style:'LOW-POLY',            zh:'低多边形',     ev:'第一代恒星点亮',     t:'t = 1.8 亿年',        code:'new IcosahedronGeometry(1, 1)' },
  { id:'ca',        b:4, dim:'2D',   style:'CELLULAR AUTOMATA',   zh:'元胞自动机',    ev:'再电离',           t:'t = 5 亿年',          code:'if (n > 0 && rnd < p) ion = 1' },
  { id:'pointcloud',b:6, dim:'3D',   style:'POINT CLOUD',         zh:'点云',         ev:'宇宙网 · 暗物质骨架', t:'t = 8 亿年',          code:'new Points(web, 60_000)' },
  { id:'galaxy',    b:4, dim:'3D',   style:'GPU PARTICLES',       zh:'粒子系统',     ev:'星系诞生',         t:'t = 10 亿年',         code:'θ = arm + k·log(r) - ω(r)·t' },
  { id:'spacetime', b:6, dim:'4D',   style:'SPACETIME CURVATURE', zh:'时空曲率网格',  ev:'超大质量黑洞',      t:'t = 12 亿年',         code:'y = -M / √(r² + ε)' },
  { id:'glitch',    b:4, dim:'2D',   style:'GLITCH / DATAMOSH',   zh:'故障艺术',     ev:'超新星 · 锻造重元素', t:'t = 数十亿年',        code:'slice(y).shift(dx); rgbSplit()' },
  { id:'parallax',  b:4, dim:'2.5D', style:'PARALLAX LAYERS',     zh:'多层视差',     ev:'太阳系形成',        t:'t = 92 亿年',         code:'layer.x = cam.x * depth' },
  { id:'voxel',     b:4, dim:'3D',   style:'VOXEL',               zh:'体素',         ev:'地球',            t:'t = 93 亿年',         code:'new InstancedMesh(box, mat, n)' },
  { id:'rain',      b:4, dim:'2D',   style:'CODE RAIN',           zh:'代码雨',       ev:'生命 · DNA',        t:'t = 100 亿年',        code:'"ATCG"[rand() * 4]' },
  { id:'cards',     b:6, dim:'2.5D', style:'3D CARD STACK',       zh:'透视卡片',     ev:'今天 · 你在这里',     t:'t = 138 亿年',        code:'transform: rotateY(θ) translateZ(r)' },
  { id:'dataviz',   b:4, dim:'2D',   style:'DATA VIZ',            zh:'数据可视化',    ev:'暗能量 · 加速膨胀',   t:'t = +100 亿年',       code:'a(t) ∝ sinh^(2/3)(1.5·√ΩΛ·H₀t)' },
  { id:'lightcone', b:4, dim:'4D',   style:'LIGHT CONE (3+1)',    zh:'时空光锥',     ev:'星系逃离视界',       t:'t = +1500 亿年',      code:'x(t) = x₀ · a(t)' },
  { id:'volume',    b:4, dim:'3D',   style:'VOLUMETRIC',          zh:'体积渲染',     ev:'太阳 · 红巨星',      t:'t = +50 亿年 (太阳)',  code:'ρ += fbm(p) * step' },
  { id:'iso',       b:6, dim:'2.5D', style:'ISOMETRIC',           zh:'等距视角',     ev:'恒星时代终结',       t:'t = 10¹⁴ 年',         code:'sx = (x - y) · cos30°' },
  { id:'math',      b:4, dim:'2D',   style:'MATH ANIMATION',      zh:'公式动画',     ev:'简并时代 · 质子衰变?', t:'t = 10³⁴⁺ 年',        code:'N(t) = N₀ · e^(-t/τ)' },
  { id:'scope',     b:6, dim:'2D',   style:'VECTOR SCOPE',        zh:'示波器矢量',    ev:'黑洞蒸发 · 霍金辐射',  t:'t = 10¹⁰⁰ 年',        code:'T = ħc³ / 8πGMk' },
  { id:'tui',       b:6, dim:'2D',   style:'TUI DASHBOARD',       zh:'终端仪表盘',    ev:'热寂 · 熵 = MAX',     t:'t → ∞',              code:'htop --universe' },
  { id:'loop',      b:6, dim:'2D',   style:'TERMINAL · LOOP',     zh:'终端 · 闭环',   ev:'回到之前',          t:'t = undefined',     code:'universe.exit(0); clear' },
];
let acc = 0;
for (const s of SHOTS) { s.start = acc; acc += s.b; }
export const TOTAL_BEATS = acc;
export const TOTAL_FRAMES = acc * FPB;
```

