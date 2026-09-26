#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  score.py · 《源 · THE SOURCE》配乐 —— numpy 逐样本合成 + 仓库里的真实音效
#
#  读 build/cues.json（与画面同一张时间表），输出 build/score.wav（48 kHz / 24-bit / 立体声）
#  D 小调 · 120 BPM。织体密度跟着段落走：
#    源(只有 drone) → 卡点(半拍鼓) → 逐像素(四踩) → 造世界(十六分琶音) → A 大三和弦悬停 + 真空半拍
#    → DROP(Dm-B♭-F-C 超锯) → 球(半速 → 全速) → 磁带骤停 → 心跳 + 钟
#    → 四声巨响「通通开源」→ 关系大调第二次 DROP(F-C-Dm-B♭) → 下潜 → 钢琴 → 开放的 Dsus2 结尾
#  音效层：仓库 kimi-ai-beat-sync / swe-ai-rise 源码包里的原始音效，按"峰值对齐拍点"叠在合成音上。
# ─────────────────────────────────────────────────────────────────────────────
import json, wave
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = Path(__file__).resolve().parent.parent
C = json.loads((ROOT / 'build' / 'cues.json').read_text(encoding='utf-8'))
SR = 48000
BEAT = C['BEAT']
DUR = C['DURATION']
N = int((DUR + 0.02) * SR)
T = lambda b: b * BEAT
S = lambda sec: int(round(sec * SR))
rng = np.random.default_rng(20260925)

def bus():
    return np.zeros((N, 2), np.float32)

DRUMS, BASS, MUSIC, FX, SAMP, VERB = bus(), bus(), bus(), bus(), bus(), bus()

def add(buf, x, t0, gain=1.0, pan=0.0, verb=0.0):
    """把单声道/立体声片段 x 放到秒 t0；pan ∈ [-1,1]；verb = 送混响的量"""
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l, x * r], 1) * np.sqrt(2)
    i0 = S(t0)
    j0 = max(0, -i0)
    i0 = max(0, i0)
    n = min(len(x) - j0, N - i0)
    if n <= 0:
        return
    buf[i0:i0 + n] += (x[j0:j0 + n] * gain).astype(np.float32)
    if verb:
        VERB[i0:i0 + n] += (x[j0:j0 + n] * gain * verb).astype(np.float32)

def sos(kind, f, order=2):
    f = float(np.clip(f, 20, SR / 2 * 0.95))
    return butter(order, f, btype=kind, fs=SR, output='sos')
def lp(x, f, o=2): return sosfilt(sos('lowpass', f, o), x, axis=0)
def hp(x, f, o=2): return sosfilt(sos('highpass', f, o), x, axis=0)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype='bandpass', fs=SR, output='sos'), x, axis=0)

def sweep_lp(x, f_of_t, block=512, order=2):
    """随时间变化截止频率的低通（分块 + 状态延续）"""
    y = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        f = float(np.clip(f_of_t((i + block / 2) / SR), 30, SR * 0.45))
        s = butter(order, f, btype='lowpass', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((s.shape[0], 2) + x.shape[1:])
        y[i:i + block], zi = sosfilt(s, x[i:i + block], axis=0, zi=zi)
    return y

def sweep_bp(x, fc_of_t, q=2.0, block=512):
    y = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        fc = float(np.clip(fc_of_t((i + block / 2) / SR), 60, SR * 0.4))
        s = butter(1, [fc / (1 + 0.5 / q), fc * (1 + 0.5 / q)], btype='bandpass', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((s.shape[0], 2) + x.shape[1:])
        y[i:i + block], zi = sosfilt(s, x[i:i + block], axis=0, zi=zi)
    return y

mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def tt(dur): return np.arange(S(dur)) / SR

# ── 振荡器 ─────────────────────────────────────────────────────────────────
def saw(freq, n, ph0=0.0):
    f = np.broadcast_to(np.asarray(freq, np.float64), (n,))
    dt = f / SR
    ph = (ph0 + np.cumsum(dt)) % 1.0
    s = 2 * ph - 1
    m = ph < dt
    x = ph[m] / dt[m]; s[m] -= x + x - x * x - 1
    m = ph > 1 - dt
    x = (ph[m] - 1) / dt[m]; s[m] -= x * x + x + x + 1
    return s

def supersaw(freq, n, voices=7, detune=0.18, stereo=True, seed=0):
    r = np.random.default_rng(seed)
    out = np.zeros((n, 2))
    for v in range(voices):
        d = (v - (voices - 1) / 2) / ((voices - 1) / 2) if voices > 1 else 0
        f = np.asarray(freq) * 2 ** (d * detune / 12)
        s = saw(f, n, r.random())
        pan = d * 0.8 if stereo else 0
        out[:, 0] += s * np.cos((pan + 1) * np.pi / 4)
        out[:, 1] += s * np.sin((pan + 1) * np.pi / 4)
    return out / np.sqrt(voices)

def sine(freq, n, ph0=0.0):
    f = np.broadcast_to(np.asarray(freq, np.float64), (n,))
    return np.sin(2 * np.pi * (ph0 + np.cumsum(f) / SR))

def noise(n, st=False):
    return rng.standard_normal((n, 2) if st else n)

def env(n, a=0.005, d=0.3, s=0.0, r=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1.0)
    e = np.where(t < a, e, s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    if hold is not None:
        e *= np.clip((hold + r - t) / r, 0, 1)
    return e

def expdec(n, d): return np.exp(-np.arange(n) / SR / d)

# ── 鼓 ─────────────────────────────────────────────────────────────────────
def kick(big=1.0):
    n = S(0.55)
    t = tt(0.55)
    f = 44 + 150 * np.exp(-t / 0.035) + 40 * np.exp(-t / 0.12) * big
    body = sine(f, n) * expdec(n, 0.23 + 0.08 * big)
    click = hp(noise(n), 2500) * expdec(n, 0.004) * 0.5
    x = np.tanh((body + click) * 2.2) * 0.8
    return x

def snare():
    n = S(0.4)
    body = sine(185 * (1 + 0.3 * expdec(n, 0.01)), n) * expdec(n, 0.08)
    nz = bp(noise(n), 1500, 9000) * expdec(n, 0.13)
    return np.tanh((body * 0.8 + nz * 0.9) * 1.5) * 0.7

def clap():
    n = S(0.5)
    x = np.zeros(n)
    for k, d in enumerate([0, 0.011, 0.023]):
        i = S(d)
        m = n - i
        x[i:] += noise(m) * expdec(m, 0.012 if k < 2 else 0.16)
    return bp(x, 900, 5000) * 0.8

def hat(open_=False):
    d = 0.22 if open_ else 0.045
    n = S(d * 4)
    x = hp(noise(n), 7000, 4) * expdec(n, d)
    return x * (0.55 if open_ else 0.45)

def crash(d=2.4):
    n = S(d + 0.5)
    x = hp(noise(n, True), 4000, 2) * expdec(n, d / 3)[:, None]
    met = sum(sine(f, n) for f in [3120, 4250, 5530, 6710, 8200]) * expdec(n, d / 4) * 0.08
    x += met[:, None]
    return x * 0.5

def tom(f0=110):
    n = S(0.6)
    return np.tanh(sine(f0 * (1 + 0.6 * expdec(n, 0.05)), n) * expdec(n, 0.25) * 1.8) * 0.6

# ── 和声 ───────────────────────────────────────────────────────────────────
CH = {
    'Dm': [50, 53, 57, 62, 65, 69], 'Bb': [46, 50, 53, 58, 62, 65], 'F': [41, 48, 53, 57, 60, 65],
    'C': [48, 52, 55, 60, 64, 67], 'A': [45, 52, 57, 61, 64, 69], 'Gm': [43, 50, 55, 58, 62, 67],
    'Dsus2': [38, 50, 57, 62, 64, 69, 74],
}
ROOT_OF = {'Dm': 38, 'Bb': 34, 'F': 41, 'C': 36, 'A': 33, 'Gm': 31, 'Dsus2': 38}
# (起拍, 止拍, 和弦)
HARM = [
    (0, 16, 'Dm'), (16, 20, 'Dm'), (20, 24, 'Bb'), (24, 28, 'F'), (28, 32, 'C'),
    (32, 36, 'Dm'), (36, 40, 'Bb'), (40, 44, 'F'), (44, 46, 'C'), (46, 48, 'Gm'), (48, 51, 'A'),
    (52, 56, 'Dm'), (56, 60, 'Bb'), (60, 64, 'F'), (64, 68, 'C'), (68, 72, 'Dm'),
    (72, 76, 'Bb'), (76, 80, 'C'), (80, 84, 'Dm'), (84, 88, 'Bb'), (88, 90, 'A'),
    (98, 99, 'Dm'), (99, 100, 'Bb'), (100, 101, 'C'), (101, 102, 'A'),
    (102, 106, 'F'), (106, 110, 'C'), (110, 114, 'Dm'), (114, 118, 'Bb'), (118, 120, 'C'),
    (120, 125, 'Dm'), (125, 132, 'Dsus2'),
]
def chord_at(b):
    for b0, b1, c in HARM:
        if b0 <= b < b1:
            return c
    return None

SEC = {s['id']: s for s in C['SECTIONS']}
def in_(b, *ids): return any(SEC[i]['b0'] <= b < SEC[i]['b1'] for i in ids)

# ─────────────────────────────────────────────────────────────────────────────
#  1. 鼓组（按段落写的 pattern）
# ─────────────────────────────────────────────────────────────────────────────
KICKS = []
K, SN, CL = kick(), snare(), clap()
def put_kick(b, g=1.0, big=1.0):
    add(DRUMS, kick(big) if big != 1.0 else K, T(b), 0.95 * g)
    KICKS.append(T(b))

for b16 in range(0, 132 * 4):
    b = b16 / 4
    q = b16 % 4           # 拍内第几个十六分
    beat_in_bar = int(b) % 4
    on = q == 0
    # GEN1：半拍鼓
    if 16 <= b < 24:
        if on and int(b) % 2 == 0: put_kick(b, 0.9)
        if b >= 20 and q == 2: add(DRUMS, hat(), T(b), 0.5, 0.3)
        if b == 23.5: add(DRUMS, tom(95), T(b), 0.7, -0.2)
    # GEN2：四踩 + 拍手
    elif 24 <= b < 32:
        if on: put_kick(b)
        if on and beat_in_bar in (1, 3) and b >= 26: add(DRUMS, CL, T(b), 0.7, 0, verb=0.25)
        if q == 2: add(DRUMS, hat(), T(b), 0.6, 0.25)
    # GEN3：十六分
    elif 32 <= b < 46:
        if on: put_kick(b)
        if on and beat_in_bar in (1, 3): add(DRUMS, SN, T(b), 0.7, 0, verb=0.3); add(DRUMS, CL, T(b), 0.45)
        add(DRUMS, hat(q == 2), T(b), (0.55 if q == 2 else 0.32), 0.25 * (1 if q % 2 else -1))
        if b >= 44 and q in (1, 3) and b < 46: add(DRUMS, SN, T(b), 0.3 + 0.2 * (b - 44))
    # 预告：踩到 48，之后只剩军鼓滚奏（cue 里）
    elif 46 <= b < 48:
        if on: put_kick(b)
        add(DRUMS, hat(q == 2), T(b), 0.4, 0.2)
        if on and beat_in_bar in (1, 3): add(DRUMS, SN, T(b), 0.7, verb=0.3)
    # DROP / 第二 DROP / 里面
    elif (52 <= b < 72) or (76 <= b < 88) or (102 <= b < 118) :
        lift = 1.1 if b >= 102 else 1.0
        if on: put_kick(b, lift, big=1.3 if b in (52, 102) else 1.0)
        if q == 3 and beat_in_bar == 3 and int(b) % 8 == 7: put_kick(b, 0.6)
        if on and beat_in_bar in (1, 3):
            add(DRUMS, SN, T(b), 0.8 * lift, 0, verb=0.35); add(DRUMS, CL, T(b), 0.6 * lift, 0, verb=0.2)
        add(DRUMS, hat(q == 2), T(b), (0.6 if q == 2 else 0.36) * lift, 0.3 * (1 if q % 2 else -1))
        if q == 3 and int(b) % 2 == 1: add(DRUMS, tom(200), T(b), 0.25, 0.5)
        # 进入 inside 的最后两小节：鼓抽掉一半
        if 114 <= b < 118 and q != 0:
            pass
    # 球：半速
    elif 72 <= b < 76:
        if b in (72, 74.5): put_kick(b, 1.1, big=1.3)
        if b in (74,): add(DRUMS, SN, T(b), 1.0, verb=0.6); add(DRUMS, CL, T(b), 0.7, verb=0.5)
        if q == 0 and b in (73, 75, 75.5): add(DRUMS, tom(90 + 20 * (b - 73)), T(b), 0.7, -0.3 + 0.3 * (b - 73), verb=0.3)
        if q == 2: add(DRUMS, hat(True), T(b), 0.35, 0.3)
    elif 88 <= b < 90:
        if on and b < 89.75: put_kick(b)
    # 第二 DROP 之前的补拍
    elif 101.5 <= b < 102:
        add(DRUMS, SN, T(b), 0.5 + (b - 101.5) * 1.2, verb=0.2)
    # 里面最后两拍 → 尾声：无鼓
    if 118 <= b < 120 and on and b < 119:
        put_kick(b, 0.7)

# 军鼓滚奏（cue）
def snareroll(b0, b1, g):
    t0, t1 = T(b0), T(b1)
    t = t0
    while t < t1 - 0.01:
        k = (t - t0) / (t1 - t0)
        add(DRUMS, SN, t, g * (0.25 + 0.75 * k ** 1.5), rng.uniform(-0.2, 0.2), verb=0.2)
        t += BEAT / (2 if k < 0.35 else 4 if k < 0.7 else 8)

# ─────────────────────────────────────────────────────────────────────────────
#  2. 贝斯（sub + 中频 reese），侧链在最后统一做
# ─────────────────────────────────────────────────────────────────────────────
def bass_note(midi, dur, g=1.0, reese=0.5):
    n = S(dur)
    f = mtof(midi)
    sub = sine(f, n) * 0.9
    rz = lp(supersaw(f * 2, n, 3, 0.25, stereo=False, seed=int(midi))[:, 0], 700) * reese
    e = env(n, 0.004, 9, 1.0, 0.03, hold=dur - 0.03)
    return np.tanh((sub + rz) * 1.4) * e * g

for b0, b1, ch in HARM:
    root = ROOT_OF[ch]
    if in_(b0, 'genesis'):
        continue
    if 16 <= b0 < 24:
        add(BASS, bass_note(root, T(b1 - b0), 0.55, 0.2), T(b0))
    elif 24 <= b0 < 46:
        # 八分音符推进
        b = b0
        while b < b1:
            add(BASS, bass_note(root + (12 if int(b * 2) % 4 == 3 else 0), BEAT * 0.45, 0.7, 0.5), T(b))
            b += 0.5
    elif 46 <= b0 < 52:
        add(BASS, bass_note(root, T(min(b1, 51) - b0), 0.8, 0.8), T(b0))
    elif (52 <= b0 < 90) or (102 <= b0 < 118):
        b = b0
        while b < b1 and b < 118:
            if 88 <= b < 90 and b >= 89.75:
                break
            oct_ = 12 if int(b * 4) % 8 in (3, 6) else 0
            add(BASS, bass_note(root + oct_, BEAT * 0.23, 0.9, 0.8), T(b))
            b += 0.25
    elif 98 <= b0 < 102:
        add(BASS, bass_note(root, T(0.9), 1.0, 1.0), T(b0))

# ─────────────────────────────────────────────────────────────────────────────
#  3. 和声层：pad（全程）/ 超锯 stab（DROP）/ 琶音（造世界起）/ 主旋律（DROP）
# ─────────────────────────────────────────────────────────────────────────────
def pad(ch, dur, g, bright=900, seed=0):
    n = S(dur + 1.2)
    x = np.zeros((n, 2))
    for i, m in enumerate(CH[ch][:5]):
        x += supersaw(mtof(m), n, 5, 0.22, True, seed + i) * 0.35
    x = lp(x, bright)
    e = env(n, 0.35, 99, 1.0, 1.0, hold=dur)
    return x * e[:, None] * g

for b0, b1, ch in HARM:
    if b0 >= 90 and b0 < 98:
        continue
    if b0 < 16:
        # drone：只有根音 + 五度，逐渐打开
        continue
    energy = max(s['energy'] for s in C['SECTIONS'] if s['b0'] <= b0 < s['b1'])
    br = 500 + 2600 * energy
    add(MUSIC, pad(ch, T(b1 - b0), 0.22 + 0.12 * energy, br, int(b0)), T(b0), 1.0, verb=0.35)

# 超锯 stab：DROP 段每个反拍八分
def stab(ch, g, seed):
    n = S(BEAT * 0.45)
    x = np.zeros((n, 2))
    for i, m in enumerate(CH[ch][1:6]):
        x += supersaw(mtof(m + 12), n, 7, 0.3, True, seed + i) * 0.3
    x = lp(x, 5200)
    return x * env(n, 0.003, 0.12, 0.25, 0.02, hold=BEAT * 0.4)[:, None] * g

for b2 in range(0, 132 * 2):
    b = b2 / 2
    if (52 <= b < 72 or 76 <= b < 88 or 102 <= b < 118) and b2 % 2 == 1:
        ch = chord_at(b)
        add(MUSIC, stab(ch, 0.55 if b >= 102 else 0.45, b2), T(b), 1.0, verb=0.25)

# 琶音：十六分，和弦音两个八度内循环
def pluck(m, g=1.0, dec=0.14, bright=3200):
    n = S(0.35)
    x = saw(mtof(m), n) * 0.6 + saw(mtof(m) * 1.005, n) * 0.4
    x = lp(x, bright)
    return x * env(n, 0.002, dec) * g

ARP_ORDER = [0, 1, 2, 3, 2, 1, 3, 4]
for b16 in range(0, 132 * 4):
    b = b16 / 4
    if not ((32 <= b < 48) or (52 <= b < 72) or (76 <= b < 88) or (102 <= b < 114.5) or (116 <= b < 118)):
        continue
    ch = chord_at(b)
    notes = CH[ch][1:6]
    m = notes[ARP_ORDER[b16 % 8] % len(notes)] + 12
    g = 0.22 if b < 46 else 0.16
    add(MUSIC, pluck(m, g, 0.12, 2600 if b < 46 else 3600), T(b), 1.0, 0.45 * np.sin(b16 * 0.9), verb=0.3)

# GEN1–GEN2：稀疏的八分琶音（钟琴感）
for b2 in range(32, 64):
    b = b2 / 2
    ch = chord_at(b)
    m = CH[ch][2 + (b2 % 3)] + 24
    add(MUSIC, pluck(m, 0.12, 0.3, 5000), T(b), 1.0, 0.6 * np.sin(b2), verb=0.5)

# 主旋律（DROP / 第二 DROP）：超锯 lead
LEAD1 = [  # (相对 b52 的拍, 时值, midi)
    (0, 1.5, 69), (1.5, 0.5, 67), (2, 1, 65), (3, 1, 64),
    (4, 2, 65), (6, 1, 62), (7, 1, 65),
    (8, 1.5, 72), (9.5, 0.5, 69), (10, 2, 65),
    (12, 1.5, 67), (13.5, 0.5, 64), (14, 2, 60),
    (16, 2, 69), (18, 1, 72), (19, 1, 74),
]
LEAD2 = [  # 第二 DROP（F-C-Dm-B♭）：更高、更亮
    (0, 1.5, 72), (1.5, 0.5, 74), (2, 2, 77),
    (4, 1.5, 76), (5.5, 0.5, 74), (6, 2, 72),
    (8, 1.5, 74), (9.5, 0.5, 72), (10, 2, 69),
    (12, 1, 70), (13, 1, 72), (14, 2, 74),
]
def lead(m, dur, g):
    n = S(dur + 0.4)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.clip((t - 0.25) / 0.3, 0, 1)
    x = supersaw(mtof(m) * vib, n, 7, 0.22, True, int(m)) + supersaw(mtof(m + 12) * vib, n, 3, 0.1, True, int(m) + 7) * 0.3
    x = lp(x, 4200)
    return x * env(n, 0.01, 9, 1.0, 0.25, hold=dur)[:, None] * g

for b, d, m in LEAD1:
    add(MUSIC, lead(m, T(d), 0.2), T(52 + b), 1.0, verb=0.45)
for b, d, m in LEAD1[:12]:
    add(MUSIC, lead(m, T(d), 0.17), T(76 + b), 1.0, verb=0.45)
for b, d, m in LEAD2:
    add(MUSIC, lead(m, T(d), 0.22), T(102 + b), 1.0, verb=0.5)
for b, d, m in LEAD2[:6]:
    add(MUSIC, lead(m, T(d), 0.14), T(114.5 + b), 1.0, verb=0.6)

# 尾声钢琴（加法合成）
def piano(m, dur=2.5, g=0.4):
    n = S(dur)
    f = mtof(m)
    x = sum((0.7 ** k) * sine(f * (k + 1) * (1 + 0.0004 * k * k), n) * expdec(n, dur / (1 + 0.8 * k)) for k in range(7))
    x += hp(noise(n), 2000) * expdec(n, 0.01) * 0.05
    return x * env(n, 0.002, 99, 1.0) * g

for i, m in enumerate([62, 65, 69, 72, 69, 65, 64, 69]):
    add(MUSIC, piano(m, 3.0, 0.22), T(120.5 + i * 0.5), 1.0, (i % 3 - 1) * 0.4, verb=0.6)
for m in [38, 50, 57, 62, 64, 69, 74, 76]:
    add(MUSIC, piano(m, 6.0, 0.2), T(125), 1.0, 0, verb=0.8)
add(MUSIC, pad('Dsus2', T(6), 0.4, 2200, 125), T(125), 1.0, verb=0.8)

# ─────────────────────────────────────────────────────────────────────────────
#  4. 音效：合成 + 仓库真实音效
# ─────────────────────────────────────────────────────────────────────────────
def load(name):
    w = wave.open(str(ROOT / 'assets' / 'sfx' / f'{name}.wav'))
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
    return x
SMP = {}
def smp(name):
    if name not in SMP:
        SMP[name] = load(name)
    return SMP[name]
def peak_t(x): return np.argmax(np.abs(x).sum(1)) / SR
def place_peak(name, t, g, verb=0.0, seg=None):
    x = smp(name)
    if seg:
        x = x[S(seg[0]):S(seg[1])].copy()
        f = min(len(x), S(0.05))
        x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]
    add(SAMP, x, t - peak_t(x), g, verb=verb)
def place(name, t, g, verb=0.0, rate=1.0):
    x = smp(name)
    if rate != 1.0:
        idx = np.arange(0, len(x) - 1, rate)
        x = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in (0, 1)], 1)
    add(SAMP, x, t, g, verb=verb)

def riser(t0, t1, g):
    d = t1 - t0
    n = S(d)
    t = np.arange(n) / SR
    k = t / d
    nz = sweep_bp(noise(n, True), lambda s: 300 * (20 ** (s / d)), 1.5)
    tone = supersaw(110 * 2 ** (k * 2.0), n, 5, 0.4, True, 3) * 0.25
    tone = lp(tone, 4000)
    x = (nz * 0.9 + tone) * (k ** 2.2)[:, None]
    add(FX, x, t0, g, verb=0.3)

def reverse_crash(t1, d, g):
    x = crash(d)[::-1]
    add(FX, x, t1 - len(x) / SR, g, verb=0.3)

def boom(t, g, sub_from=90, dur=2.2):
    n = S(dur)
    tt_ = np.arange(n) / SR
    f = 28 + (sub_from - 28) * np.exp(-tt_ / 0.25)
    x = np.tanh(sine(f, n) * expdec(n, dur / 3) * 2.0)
    x += lp(noise(n), 400) * expdec(n, 0.15) * 0.6
    add(FX, x, t, g, verb=0.4)

def braam(t, g, root=38, dur=2.6):
    n = S(dur)
    x = np.zeros((n, 2))
    for m, a in [(root, 1.0), (root + 12, 0.8), (root + 19, 0.5), (root + 24, 0.35)]:
        x += supersaw(mtof(m), n, 5, 0.35, True, m) * a
    x = sweep_lp(x, lambda s: 180 + 2600 * np.exp(-s / 0.35) * min(s / 0.04, 1))
    x = np.tanh(x * 2.2) * env(n, 0.01, dur / 2.2)[:, None]
    add(FX, x * 0.5, t, g, verb=0.5)

def whoosh(t, g, d=0.45, up=True, seed=0):
    n = S(d)
    k = np.arange(n) / n
    x = sweep_bp(noise(n, True), (lambda s: 400 * 12 ** (s / d)) if up else (lambda s: 5000 * (1 / 12) ** (s / d)), 1.2)
    x *= np.sin(np.pi * k)[:, None] ** 2
    add(FX, x, t - d * 0.6, g * 1.4, verb=0.2)

def click(t, g, f=2400):
    n = S(0.03)
    add(FX, sine(f, n) * expdec(n, 0.006), t, g)

def bell(t, m, g):
    n = S(4.0)
    f = mtof(m)
    mod = sine(f * 3.5, n) * 2.2 * expdec(n, 1.2)
    x = np.sin(2 * np.pi * np.cumsum(np.full(n, f)) / SR + mod) * expdec(n, 1.6)
    x += sine(f * 2, n) * expdec(n, 0.8) * 0.3
    add(FX, x * 0.5, t, g, verb=0.7)

def heart(t, g):
    n = S(0.3)
    x = lp(sine(55 * (1 + 0.5 * expdec(n, 0.02)), n) * expdec(n, 0.09), 180)
    add(FX, np.tanh(x * 3) * 0.8, t, g)

def tapestop(t0, d):
    """音乐 + 鼓 + 贝斯三条总线：t0 起 d 秒内转速 1 → 0，之后静音"""
    for B in (DRUMS, BASS, MUSIC, VERB):
        i0, n = S(t0), S(d)
        rate = np.linspace(1, 0, n) ** 1.3
        pos = i0 + np.cumsum(rate)
        seg_ = np.stack([np.interp(pos, np.arange(len(B)), B[:, c]) for c in (0, 1)], 1)
        seg_ *= np.linspace(1, 0.2, n)[:, None]
        B[i0:i0 + n] = seg_
        B[i0 + n:S(T(97.9))] = 0

def granular(t0, t1, g, lo=2500, hi=7000, dens=40, seed=0):
    r = np.random.default_rng(seed)
    t = t0
    while t < t1:
        k = (t - t0) / max(t1 - t0, 1e-3)
        n = S(0.03)
        f = r.uniform(lo, hi)
        x = sine(f, n) * np.hanning(n)
        add(FX, x, t, g * (1 - 0.6 * k) * r.uniform(0.3, 1), r.uniform(-0.9, 0.9), verb=0.5)
        t += r.exponential(1 / dens)

def downlifter(t0, t1, g):
    d = t1 - t0
    n = S(d)
    x = sweep_bp(noise(n, True), lambda s: 6000 * (1 / 30) ** (s / d), 1.5)
    x += (sine(400 * (1 / 8) ** (np.arange(n) / n), n) * 0.2)[:, None]
    x *= (1 - np.arange(n) / n)[:, None] ** 1.5
    add(FX, x, t0, g, verb=0.4)

def drone(t0, t1, g):
    d = t1 - t0
    n = S(d)
    k = np.arange(n) / n
    x = supersaw(mtof(26), n, 3, 0.15, True, 1) + supersaw(mtof(33), n, 3, 0.15, True, 2) * 0.6 + supersaw(mtof(50), n, 5, 0.2, True, 3) * 0.3
    x = sweep_lp(x, lambda s: 90 + 900 * (s / d) ** 2.2)
    air = hp(noise(n, True), 6000) * 0.02
    x = (x * 0.5 + air) * (np.clip(k * 4, 0, 1) * (1 - np.clip((k - 0.96) / 0.04, 0, 1)))[:, None]
    add(MUSIC, x, t0, g, verb=0.5)

for c in C['CUES']:
    b, kind, g = c['b'], c['kind'], c.get('gain', 1.0)
    t = T(b)
    t1 = T(c['b1']) if 'b1' in c else None
    if kind == 'drone': drone(t, t1, g)
    elif kind == 'tick': click(t, g * 0.6, 3000); place('sfx_2521', t, g * 0.25)
    elif kind == 'sub': boom(t, g * 0.7, 60, 1.5)
    elif kind == 'key':
        place('key-press', t - 0.05, g * 0.9, rate=0.92 + 0.16 * ((c.get('seed', 0) * 7919) % 100) / 100)
        click(t, g * 0.25, 1800 + 400 * (c.get('seed', 0) % 5))
    elif kind == 'enter': place('click', t - 0.04, g); boom(t, g * 0.4, 110, 0.6)
    elif kind == 'boom': boom(t, g, 120, 2.5); place_peak('impact-bass-1', t, g * 0.6, verb=0.3)
    elif kind == 'swarm': granular(t, t1, g * 0.5, 2000, 9000, 70, 11); whoosh(t + 0.6, g * 0.8, 1.2)
    elif kind == 'riser': riser(t - 0.0, t1, g * 0.55)
    elif kind == 'revcym': reverse_crash(t1, t1 - t, g * 0.8)
    elif kind == 'impact':
        boom(t, g * 0.8, 100, 1.8); add(FX, crash(1.8), t, g * 0.35, verb=0.3)
        place_peak('sfx_1143', t, g * 0.7, verb=0.3)
    elif kind == 'braam': braam(t, g)
    elif kind == 'whoosh': place('whoosh-short', t - 0.16, g * 0.9, rate=0.9 + 0.2 * ((b * 13) % 1)); whoosh(t, g * 0.4, 0.35)
    elif kind == 'whooshbig': place_peak('whoosh-cinematic', t, g * 0.8, verb=0.3)
    elif kind == 'shutter':
        click(t, g * 0.5, 4200); add(FX, hp(noise(S(0.05)), 3000) * expdec(S(0.05), 0.012), t + 0.012, g * 0.5)
    elif kind == 'blip':
        m = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84][c.get('note', 0) % 10]
        add(FX, pluck(m + 12, 0.8, 0.08, 6000), t, g * 0.8, 0.5 * np.sin(c.get('note', 0)), verb=0.4)
    elif kind == 'suck': place('sfx_2608', t1 - 0.45 - 0.05, g * 0.9); reverse_crash(t1, t1 - t, g * 0.5)
    elif kind == 'snareroll': snareroll(b, c['b1'], g)
    elif kind == 'megaimpact':
        seed = c.get('seed', 0)
        root = {10: 38, 11: 34, 12: 36, 13: 33, 1: 38, 99: 38}.get(seed, 38)
        boom(t, g, 140, 3.0); braam(t, g * 0.9, root, 3.0)
        place_peak('impact-bass-2' if seed % 2 else 'impact-bass-1', t, g * 0.8, verb=0.35)
        place_peak('sfx_1143', t, g * 0.45, verb=0.4)
        add(FX, crash(2.8), t, g * 0.4, verb=0.4)
    elif kind == 'crash': add(DRUMS, crash(2.4), t, g * 0.8, verb=0.3)
    elif kind == 'hit':
        place_peak('sfx_2150', t, g * 0.6)
        add(FX, tom(160 + 60 * ((b * 7) % 3)), t, g * 0.5)
    elif kind == 'swoosh': whoosh(t, g, 0.7, up=False)
    elif kind == 'glitch':
        x = smp('glitch-2')[:S(c.get('len', 1.0) * 0.5 + 0.3)].copy()
        x[-S(0.05):] *= np.linspace(1, 0, S(0.05))[:, None]
        add(SAMP, x, t, g * 0.5)
    elif kind == 'tapestop': tapestop(t - 0.55, 0.55)
    elif kind == 'bell': bell(t, c.get('note', 69), g * 0.6)
    elif kind == 'heart': heart(t, g)
    elif kind == 'revswell':
        n = S(t1 - t)
        x = pad('Dm', t1 - t, 1.0, 3000, 77)[:n] * (np.linspace(0, 1, n) ** 3)[:, None]
        add(FX, x, t, g * 0.9, verb=0.6); reverse_crash(t1, t1 - t, g * 0.6)
    elif kind == 'inhale': whoosh(t + 0.12, g, 0.25)
    elif kind == 'datastream': granular(t, t1, g * 0.35, 3000, 12000, 22, 21)
    elif kind == 'thump': boom(t, g * 0.55, 90, 0.8); click(t, g * 0.3, 1200)
    elif kind == 'counter':
        for k in range(16):
            click(t + (t1 - t) * (1 - (1 - k / 16) ** 2), g * 0.5, 2500 + k * 80)
    elif kind == 'downlifter': downlifter(t, t1, g)
    elif kind == 'rewind':
        place('sfx_1088', t - 0.2, g * 0.8)
        n = S(t1 - t)
        x = sweep_bp(noise(n, True), lambda s: 5000 * (1 / 20) ** (s / (t1 - t)), 1.2) * np.linspace(1, 0.2, n)[:, None]
        add(FX, x, t, g * 0.6)
    else:
        print('unknown cue kind', kind)

# ─────────────────────────────────────────────────────────────────────────────
#  5. 混音：侧链 → 混响 → 母线压缩 → 限幅
# ─────────────────────────────────────────────────────────────────────────────
t_axis = np.arange(N) / SR
# 段落自动化：能量曲线 → 音乐总线增益（音效不受影响），交界处 0.5 拍平滑
LEVEL = {'genesis': 0.5, 'gen1': 0.52, 'gen2': 0.62, 'gen3': 0.74, 'predrop': 0.84, 'drop': 1.0, 'orb': 0.93,
         'silence': 1.0, 'reveal': 1.0, 'inside': 0.9, 'outro': 0.8}
lv = np.ones(N, np.float32)
for s_ in C['SECTIONS']:
    lv[S(T(s_['b0'])):S(T(s_['b1']))] = LEVEL[s_['id']]
k_ = S(0.25)
lv = np.convolve(np.pad(lv, (k_, k_), mode='edge'), np.ones(2 * k_ + 1) / (2 * k_ + 1), mode='valid')[:N].astype(np.float32)
for B in (DRUMS, BASS, MUSIC):
    B *= lv[:, None]
duck = np.ones(N, np.float32)
for kt in KICKS:
    i0 = S(kt)
    n = min(S(0.32), N - i0)
    if n <= 0:
        continue
    tt_ = np.arange(n) / SR
    g = 1 - 0.62 * np.exp(-tt_ / 0.11) * np.clip(tt_ / 0.004, 0, 1) + 0.0
    duck[i0:i0 + n] = np.minimum(duck[i0:i0 + n], g)
BASS *= duck[:, None]
MUSIC *= (0.35 + 0.65 * duck)[:, None]

# 混响：衰减噪声 IR（立体声去相关），预延迟 22 ms
ir_n = S(2.8)
ir_t = np.arange(ir_n) / SR
ir = np.stack([rng.standard_normal(ir_n), rng.standard_normal(ir_n)], 1) * np.exp(-ir_t / 0.62)[:, None]
ir = lp(hp(ir, 250), 6500)
ir[:S(0.022)] = 0
ir /= np.sqrt((ir ** 2).sum(0))
VERB += MUSIC * 0.18 + DRUMS * 0.05
wet = np.stack([fftconvolve(VERB[:, c], ir[:, c])[:N] for c in (0, 1)], 1).astype(np.float32)

mix = DRUMS * 0.9 + BASS * 0.85 + MUSIC * 0.8 + FX * 0.9 + SAMP * 0.9 + wet * 0.55
mix = hp(mix, 22, 2)

# 母线：慢速 RMS 压缩（胶水感）
def envelope(x, att, rel):
    lvl = np.abs(x).max(1)
    # 分块近似：先取 5ms 块峰值，再做一阶平滑
    blk = S(0.005)
    nb = int(np.ceil(len(lvl) / blk))
    pk = np.pad(lvl, (0, nb * blk - len(lvl))).reshape(nb, blk).max(1)
    e = np.zeros(nb)
    a_att, a_rel = np.exp(-blk / SR / att), np.exp(-blk / SR / rel)
    cur = 0.0
    for i, v in enumerate(pk):
        cur = a_att * cur + (1 - a_att) * v if v > cur else a_rel * cur + (1 - a_rel) * v
        e[i] = cur
    return np.repeat(e, blk)[:len(lvl)]

e = envelope(mix, 0.01, 0.25)
thr = 0.5
gain = np.where(e > thr, (thr + (e - thr) / 1.8) / np.maximum(e, 1e-9), 1.0)
mix *= gain[:, None]

# 目标响度前的整体增益（粗调），再软削波 + 前视限幅
rms = np.sqrt((mix[S(26):S(36)] ** 2).mean())
mix *= 0.24 / max(rms, 1e-6)
mix = np.tanh(mix * 1.05) / np.tanh(1.05) * 0.98
look = S(0.004)
e2 = envelope(np.roll(mix, -look, 0), 0.0005, 0.08)
ceil_ = 0.891  # -1 dBFS
g2 = np.minimum(1.0, ceil_ / np.maximum(e2, 1e-9))
mix *= g2[:, None]
mix = np.clip(mix, -ceil_, ceil_)
# 结尾淡出
fade = np.clip((T(132) - t_axis) / 1.6, 0, 1) ** 1.5
mix *= fade[:, None]
mix = mix[:S(DUR)]

out = ROOT / 'build' / 'score.wav'
pcm = (np.clip(mix, -1, 1) * 8388607).astype(np.int32)
b24 = np.zeros((pcm.size, 3), np.uint8)
flat = pcm.reshape(-1)
b24[:, 0] = flat & 255; b24[:, 1] = (flat >> 8) & 255; b24[:, 2] = (flat >> 16) & 255
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR)
    w.writeframes(b24.tobytes())
print('score →', out, f'{len(mix) / SR:.2f}s', 'peak', float(np.abs(mix).max()))
