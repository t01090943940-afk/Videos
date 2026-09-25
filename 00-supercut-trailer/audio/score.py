#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  score.py · 配乐与全部音效：numpy 逐样本合成，48kHz 立体声
#
#  沿用合集的方法论：配乐不是找的 BGM，是和画面共用同一份 EDL 的"第二张乐谱"。
#  鼓点网格 == 剪辑网格：150 BPM，1 拍 = 0.4 s，1 小节 = 1.6 s。
#  本脚本读取 build/cues.json（由 tools/build.mjs 生成），所以
#  "画面第 64 拍下 drop" 和 "音乐第 64 拍落 impact" 永远是同一个数。
#
#  和弦进行（D 小调，每小节一拍一轮）：Dm — B♭ — F — C
#  主题动机：D4–F4–A4–D5（小调五声，结尾以三连音再现）
#
#  用法：python audio/score.py        → assets/score.wav
#        python audio/score.py --mp3  → 另出 assets/score.mp3（预览备用）
# ─────────────────────────────────────────────────────────────────────────────
import json, sys
import numpy as np
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
cues = json.loads((ROOT / 'build/cues.json').read_text(encoding='utf-8'))
SR = 48000
DUR = cues['duration'] + 1.0          # 尾部 1s 余量
N = int(DUR * SR)
BEAT = cues['beat']                    # 0.4
BAR = BEAT * 4
t_ = np.arange(N, dtype=np.float64) / SR
rng = np.random.default_rng(20260926)

busL = np.zeros(N, np.float64)
busR = np.zeros(N, np.float64)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)
def T(s): return int(s * SR)
def env(t, a=0.004, d=0.15): return (1 - np.exp(-t / a)) * np.exp(-t / d)

def add(x, at, g=1.0, pan=0.0):
    i0 = T(at); n = len(x)
    if i0 >= N: return
    n = min(n, N - i0)
    x = x[:n] * g
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    busL[i0:i0 + n] += x * gl
    busR[i0:i0 + n] += x * gr

def sos(f, kind, x, order=2):
    # 一阶 Butterworth 离散（无 scipy 依赖的低通/高通），40 秒内 48k 样本足够快
    from numpy import exp
    rc = 1 / (2 * np.pi * f)
    dt = 1 / SR
    a = dt / (rc + dt)
    y = np.empty_like(x)
    y0 = 0.0
    if kind == 'lowpass':
        for _ in range(order):
            yy = np.empty_like(x); prev = y0
            # αx + (1-α)y_prev  —— 用累积实现避免 Python 级循环太慢
            # 这里用 lfilter 的等价形式
            prev2 = np.empty(len(x))
            pp = 0.0
            for i in range(len(x)):
                pp = pp + a * (x[i] - pp)
                prev2[i] = pp
            y = prev2
    else:
        pp = 0.0
        for i in range(len(x)):
            pp = a * (pp + x[i] - (x[i - 1] if i else 0))
            y[i] = pp
    return y

# scipy 更快——有就用
try:
    from scipy.signal import sosfilt, butter
    def filt(x, f, kind='lowpass', order=2):
        return sosfilt(butter(order, f, btype=kind, fs=SR, output='sos'), x)
except Exception:
    def filt(x, f, kind='lowpass', order=2):
        return sos(f, kind, x, order)

def swept_lowpass(x, fc_fn):
    """时变截止的低通：按 2048 样本分块，块内按中心频率滤波、跨块续状态。"""
    if 'butter' in globals() and 'sosfilt' in globals():
        block = 2048
        zi = None
        out = np.empty_like(x)
        n = len(x)
        for i0 in range(0, n, block):
            i1 = min(i0 + block, n)
            fc = fc_fn(((i0 + i1) / 2) / SR)
            sos_ = butter(1, fc, fs=SR, output='sos')
            if zi is None:
                zi = np.zeros((sos_.shape[0], 2))
            out[i0:i1], zi = sosfilt(sos_, x[i0:i1], zi=zi, axis=0)
        return out
    out = np.empty_like(x); a = 0.0
    for i in range(len(x)):
        k = 1 / (1 + 2 * np.pi * fc_fn(i / SR) / SR)
        a = a * k + x[i] * (1 - k)
        out[i] = a
    return out

def bq_hiss(d, lo=2000, hi=9000):
    x = rng.standard_normal(T(d))
    x = filt(filt(x, hi, 'lowpass'), lo, 'highpass')
    return x

# ── 乐器 ─────────────────────────────────────────────────────────────────
def kick(big=1.0):
    n = T(0.5)
    tt = np.arange(n) / SR
    f = 45 + 130 * np.exp(-tt / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (0.17 * big))
    s[:600] += rng.standard_normal(600) * 0.35 * np.linspace(1, 0, 600)
    return np.tanh(s * 1.7)

def clap():
    n = T(0.3); x = filt(rng.standard_normal(n), 900, 'highpass'); x = filt(x, 4200)
    e = np.exp(-np.arange(n) / SR / 0.09)
    for d in (0.0, 0.011, 0.022): e[T(d):T(d) + 60] += 0.6
    return x * e * 0.9

def hat(open_=False):
    n = T(0.28 if open_ else 0.06)
    return filt(rng.standard_normal(n), 7000, 'highpass') * np.exp(-np.arange(n) / SR / (0.11 if open_ else 0.025))

def snare():
    n = T(0.3)
    tone = np.sin(2 * np.pi * 190 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR / 0.09)
    noise = filt(filt(rng.standard_normal(n), 1800), 3000, 'highpass') * np.exp(-np.arange(n) / SR / 0.12)
    return tone * 0.7 + noise

def toms(m):
    n = T(0.25)
    f = hz(m) + hz(m + 12) * np.exp(-np.arange(n) / SR / 0.08)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.arange(n) / SR / 0.15)

def subbass(m, d, side=1.0):
    # 侧链泵感：每拍前半让位给底鼓
    n = T(d); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m) * tt) + 0.3 * np.sin(2 * np.pi * hz(m) * 2 * tt)
    duck = 1 - 0.85 * np.exp(-((tt % BEAT) / 0.11))
    return s * np.exp(-tt / 0.9) * np.minimum(1, duck / max(side, 0.01)) * (1 - np.exp(-tt / 0.008))

def supersaw(chord, d, cut=2600):
    n = T(d); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in chord:
        for det in (-13, -6, 0, 6, 13):
            f = hz(m) * 2 ** (det / 1200)
            ph = rng.uniform(0, np.pi * 2)
            s += (2 * ((tt * f + ph / np.pi / 2) % 1) - 1)
    s = filt(s / 15, cut)
    e = (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.7))
    return s * e

def pluck(m, d=0.6, bright=3400):
    n = T(d); tt = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(4 * np.pi * f * tt) + 0.2 * np.sin(6 * np.pi * f * tt)
    return filt(s, bright) * np.exp(-tt / (d * 0.42))

def bell(m, d=2.6):
    n = T(d); tt = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.8) + 0.2 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt / 0.4)
    return s * np.exp(-tt / (d * 0.5)) * (1 - np.exp(-tt / 0.004)) * 0.5

def pad(chord, d, lp=1400, g=1.0):
    n = T(d); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in chord:
        for det in (-4, 4):
            f = hz(m) * 2 ** (det / 1200)
            s += np.sin(2 * np.pi * f * tt) + 0.4 * (2 * ((tt * f * 1.5) % 1) - 1)
    s = filt(s / len(chord), lp)
    e = np.minimum(tt / 0.8, 1) * np.exp(-np.maximum(0, tt - d * 0.55) / (d * 0.25))
    return s * e * 0.12 * g

def riser(d, sweep=True):
    n = T(d); tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    f0, f1 = (500, 12000) if sweep else (4000, 4000)
    x = swept_lowpass(noise, lambda tt_: f0 * (f1 / f0) ** (tt_ / d))
    x = x / max(1e-6, np.abs(x).max())
    grow = np.sin(tt / d * np.pi / 2) ** 2 * np.exp(-np.maximum(0, tt - d + 0.15) / 0.03)
    ph = np.sin(2 * np.pi * np.cumsum(200 + 2400 * tt / d) / SR) * np.exp(-tt / d * 0.5)
    return (x * 0.8 + ph * 0.2) * grow * 0.9

def revcym(d):
    n = T(d)
    x = filt(rng.standard_normal(n), 1200)
    e = (np.arange(n) / n) ** 3.2
    return x * e * 0.5

def whoosh(d=0.4):
    n = T(d); tt = np.arange(n) / SR
    out = swept_lowpass(rng.standard_normal(n), lambda tt_: 400 + 5600 * np.sin(np.pi * tt_ / d))
    return out * np.sin(np.pi * tt / d) * 0.8

def impact(g=1.0):
    n = T(1.6); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-tt / 0.05)) / SR) * np.exp(-tt / 0.45)
    crack = filt(rng.standard_normal(n), 300, 'highpass') * np.exp(-tt / 0.06)
    tail = filt(rng.standard_normal(n), 800) * np.exp(-tt / 0.8)
    return (boom * 1.5 + crack * 0.5 + tail * 0.25) * g

def megaimpact(i=0):
    n = T(1.4); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(34 + 70 * np.exp(-tt / 0.04)) / SR) * np.exp(-tt / 0.5)
    metal = filt(rng.standard_normal(n), 2400, 'highpass') * np.exp(-tt / 0.05)
    sub = np.sin(2 * np.pi * 30 * tt) * np.exp(-tt / 0.7)
    return np.tanh((boom * 1.8 + metal * (0.55 + i * 0.1) + sub) * 1.2)

def crash(d=1.8):
    n = T(d); tt = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 2600, 'highpass') + 0.3 * filt(rng.standard_normal(n), 800)
    return x * (1 - np.exp(-tt / 0.005)) * np.exp(-tt / (d * 0.4)) * 0.4

def tapestop(d=0.5):
    n = T(d); tt = np.arange(n) / SR
    f = 900 * np.exp(-tt / 0.12) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.25) * 0.8

def heart():
    n = T(0.35); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(52 + 40 * np.exp(-tt / 0.02)) / SR) * np.exp(-tt / 0.12)
    return np.tanh(s * 1.4) * 0.9

def key(seed=0):
    r = np.random.default_rng(seed)
    n = T(0.07); tt = np.arange(n) / SR
    s = r.standard_normal(n) * np.exp(-tt / 0.012)
    f = 3000 + r.uniform(0, 1500)
    return filt(s, f, 'highpass') * 0.5

def enter():
    n = T(0.18); tt = np.arange(n) / SR
    s = filt(rng.standard_normal(n), 1800, 'highpass') * np.exp(-tt / 0.05)
    return s * 0.8 + np.sin(2 * np.pi * 220 * tt) * np.exp(-tt / 0.1) * 0.4

def glitch(d=0.4, seed=1):
    r = np.random.default_rng(seed)
    n = T(d); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(600 + r.uniform(0, 4000, n)) / SR)
    return np.tanh(s * 2) * np.exp(-tt / (d * 0.6)) * 0.35

def snareroll(d):
    out = np.zeros(T(d))
    # 8 分 → 16 分 → 32 分 加速
    steps = []
    t0 = 0.0
    rate = d / 4
    while t0 < d:
        steps.append(t0)
        rate *= 0.93
        t0 += max(rate, 0.012)
    hit = snare() * 0.5
    for st in steps:
        i0 = int(st * SR)
        if i0 + len(hit) < len(out): out[i0:i0 + len(hit)] += hit * min(1.0, 0.4 + st / d)
    return out

def thump():
    n = T(0.5); tt = np.arange(n) / SR
    f = 70 + 160 * np.exp(-tt / 0.02)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.22)
    return np.tanh(s * 1.5) + filt(rng.standard_normal(n), 2500, 'highpass') * np.exp(-tt / 0.02) * 0.4

def strike_sfx(seed=0):
    r = np.random.default_rng(seed)
    n = T(0.22); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (880 + r.uniform(-80, 80)) * tt) * np.exp(-tt / 0.06)
    return s + r.standard_normal(n) * np.exp(-tt / 0.02) * 0.5

def chime():
    return overlay(bell(86, 1.6), bell(90, 1.2) * 0.5)

def suck(d=2.8):
    # 28 声"入文件夹"小 click + 一条下坠滑音
    n = T(d); tt = np.arange(n) / SR
    f = 1400 * np.exp(-tt / (d * 0.6)) + 180
    sweep = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / d) * 0.5
    out = sweep.copy()
    for i in range(28):
        st = i * 0.085 + 0.95
        k = key(i)
        i0 = T(st)
        if i0 + len(k) < n: out[i0:i0 + len(k)] += k * 1.4
    return out

def downlifter(d=1.6):
    n = T(d); tt = np.arange(n) / SR
    f = 3000 * np.exp(-tt / (d * 0.55)) + 300
    s = filt(rng.standard_normal(n), 5000, 'highpass') * np.exp(-tt / (d * 0.5))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (d * 0.6)) * 0.4 + s * 0.2

def overlay(*xs):
    """不等长混音：全部从 0 叠到最长长度。"""
    n = max(len(x) for x in xs)
    out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out

def boom():
    return overlay(impact(0.7), subbass(26, 0.8) * 0.6)

def tunnel_sfx(d):
    n = T(d); tt = np.arange(n) / SR
    out = swept_lowpass(rng.standard_normal(n), lambda tt_: 300 + 3800 * (tt_ / d) ** 1.6)
    beat_amp = 1 - 0.5 * np.exp(-((tt % BEAT) / 0.09))
    return out * np.minimum(1, 0.3 + tt / d) * np.exp(-np.maximum(0, tt - d + 0.3) / 0.12) * beat_amp * 0.7

# ── 和声与主旋律 ──────────────────────────────────────────────────────────
CHORDS = {
    'Dm': [50, 53, 57],      # D3 F3 A3
    'Bb': [46, 50, 53],      # Bb2 D3 F3
    'F':  [41, 45, 48],      # F2 A2 C3
    'C':  [48, 52, 55],      # C3 E3 G3
}
PROG = ['Dm', 'Bb', 'F', 'C'] * 10
MOTIF = [(0, 50), (1, 53), (2, 57), (3, 62)]  # D4 F4 A4 D5
PROOT = {'Dm': 38, 'Bb': 34, 'F': 29, 'C': 36}

def bar_chord(bar): return CHORDS[PROG[bar % len(PROG)]]
def bar_root(bar): return PROOT[PROG[bar % len(PROG)]]

def section_energy(b):
    for s in cues['sections']:
        if s['b0'] <= b < s['b1']: return s
    return cues['sections'][-1]

# ── 编曲引擎：每个循环按 section energy 决定织体密度 ─────────────────────
def arrange():
    # 底鼓：era1 起一拍一个；breath 停
    for b in np.arange(0, cues['totalBeats']):
        sec = section_energy(b)
        e = sec['energy']
        if e >= 0.5 and sec['id'] not in ('era4card',):
            add(kick(1.25 if sec['id'] in ('drop', 'wall', 'reveal') else 0.9), b * BEAT)
        if sec['id'] == 'era4card' and b % 2 == 0:
            add(kick(0.7), b * BEAT)
    # 军鼓/拍手：反拍
    for b in np.arange(0, cues['totalBeats']):
        sec = section_energy(b)
        if sec['energy'] >= 0.55 and b % 2 == 1:
            add(snare() * (1.0 if sec['energy'] > 0.9 else 0.7), b * BEAT)
        if sec['id'] in ('drop', 'wall', 'reveal') and b % 4 == 2:
            add(clap(), b * BEAT)
    # hi-hat
    for b in np.arange(0, cues['totalBeats'] * 2):
        sec = section_energy(b / 2)
        e = sec['energy']
        if e >= 0.5:
            off = b % 2 == 1
            n16 = e > 0.75
            steps = 2 if n16 else 1
            for s in range(steps):
                if s == 1 and not off: continue
                tt = (b + (s * 0.5 if n16 else 0.5)) * BEAT
                add(hat(open_=(off and e > 0.8)), tt, g=0.32 if off else 0.25, pan=(hash_(b) - 0.5) * 0.7)
    # 贝斯：跟和弦根音，侧链让位给底鼓
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['energy'] >= 0.5 and sec['id'] not in ('breath', 'outro'):
            root = bar_root(bar) + (0 if sec['energy'] < 0.9 else 12)
            for bt in range(4):
                add(subbass(root, BEAT * 0.9, side=sec['energy']), (bar * 4 + bt) * BEAT, g=0.5, pan=0)
    # supersaw 和弦 stab：小节强拍 + 后半拍
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['energy'] >= 0.75:
            add(supersaw(bar_chord(bar), BAR, cut=3000), bar * BAR, g=0.28)
            if sec['energy'] >= 0.9:
                add(supersaw(bar_chord(bar), BEAT * 0.7, cut=4200), (bar * 4 + 3.5) * BEAT, g=0.2)
    # 主旋律：动机按段落移调
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['id'] in ('era1', 'era2', 'era3', 'drop', 'wall'):
            shift = {'era1': 0, 'era2': 2, 'era3': 5, 'drop': 7, 'wall': 12}.get(sec['id'], 0)
            for beat_idx, m in MOTIF:
                add(pluck(m + shift, 0.5, bright=5200), (bar * 4 + beat_idx) * BEAT, g=0.34)
    # Pad：冷开场 + 凝视 + 尾声 的静默织体
    for bar in [0, 1, 2, 3]:
        add(pad(CHORDS['Dm'], BAR * 1.05, lp=900, g=1.4), bar * BAR)
    for bar in range(40, 44):  # outro 前段
        pass
    add(pad([38, 41, 45, 50], 14, lp=700, g=1.2), 26 * BAR)  # breath
    add(pad([50, 53, 57, 62], 22, lp=1100, g=0.9), 35 * BAR) # outro

def hash_(x):  # 确定性的小装饰
    s = np.sin(x * 127.1 + 311.7) * 43758.5453
    return s - int(s)

# ── SFX cue ───────────────────────────────────────────────────────────────
def sfx():
    makers = {
        'key': lambda o: key(o.get('seed', 0)),
        'enter': lambda o: enter(),
        'thump': lambda o: thump(),
        'strike': lambda o: strike_sfx(o.get('seed', 0)),
        'swoosh': lambda o: whoosh(o.get('len', 0.4)),
        'whoosh': lambda o: whoosh(o.get('len', 0.35)),
        'riser': lambda o: riser((o['b1'] - o['b']) * BEAT),
        'revcym': lambda o: revcym(o.get('len', 2.4)),
        'revswell': lambda o: revcym((o['b1'] - o['b']) * BEAT) * 1.6,
        'impact': lambda o: impact(),
        'megaimpact': lambda o: megaimpact(o.get('seed', 0)),
        'boom': lambda o: boom(),
        'crash': lambda o: crash(),
        'shutter': lambda o: key(o.get('n', 1) % 7 + 3) * 1.2,
        'hit': lambda o: overlay(thump() * 0.5, key(o.get('seed', 0) % 17) * 0.4),
        'glitch': lambda o: glitch(o.get('len', 0.4), seed=7),
        'tapestop': lambda o: tapestop(),
        'heart': lambda o: heart(),
        'bell': lambda o: bell(o.get('note', 62), 2.2),
        'chime': lambda o: chime(),
        'scan': lambda o: (lambda d: riser(d, sweep=False) * 0.5)((o['b1'] - o['b']) * BEAT),
        'snareroll': lambda o: snareroll((o['b1'] - o['b']) * BEAT),
        'suck': lambda o: suck((o['b1'] - o['b']) * BEAT),
        'downlifter': lambda o: downlifter((o['b1'] - o['b']) * BEAT),
        'tunnel': lambda o: tunnel_sfx((o['b1'] - o['b']) * BEAT),
    }
    for cue in cues['sfx']:
        mk = makers.get(cue['kind'])
        if not mk: continue
        add(mk(cue), cue['b'] * BEAT, g=cue.get('gain', 1.0))

# ── 母带 ──────────────────────────────────────────────────────────────────
def master():
    for b in (busL, busR):
        np.clip(np.tanh(b / max(1.0, np.abs(b).max() / 0.9)) * 0.92, -1, 1, out=b)
    # 简单限幅 + 响度归一（两遍式留给 ffmpeg loudnorm 可选）
    peak = max(np.abs(busL).max(), np.abs(busR).max())
    g = 10 ** (-1.5 / 20) / peak
    out = np.stack([busL * g, busR * g], axis=1)
    return (out * 32767).astype(np.int16)

arrange()
sfx()
pcm = master()

out = ROOT / 'assets/score.wav'
out.parent.mkdir(exist_ok=True, parents=True)
import wave
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"score.wav → {out.stat().st_size / 1e6:.1f} MB / {len(pcm)/SR:.2f}s")

if '--mp3' in sys.argv:
    subprocess.run(['ffmpeg', '-y', '-i', str(out), '-c:a', 'libmp3lame', '-b:a', '256k', str(ROOT / 'assets/score.mp3')], check=True)
