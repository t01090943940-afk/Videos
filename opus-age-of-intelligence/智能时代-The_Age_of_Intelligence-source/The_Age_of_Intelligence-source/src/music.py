"""Original score + sound design, synthesized from scratch on the timeline's beat grid.
F minor, 128.57 BPM, i–VI–III–VII (Fm Db Ab Eb). Outputs master.wav + analysis for visuals.
"""
import os
import numpy as np, json
from scipy.signal import lfilter, butter, sosfilt, fftconvolve
from scipy.ndimage import maximum_filter1d
from scipy.io import wavfile
import timeline as TL

SR, SPB = TL.SR, TL.SPB
TAIL_BEATS = 2
N = (TL.END_BEAT + TAIL_BEATS) * SPB
rng = np.random.default_rng(7)


def bs(b):  # beat -> sample
    return int(round(b * SPB))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], 1)


def add(buf, start, sig):
    if start >= len(buf):
        return
    if start < 0:
        sig = sig[-start:]; start = 0
    n = min(len(sig), len(buf) - start)
    if n <= 0:
        return
    if buf.ndim == 2 and sig.ndim == 1:
        sig = stereo(sig)
    buf[start:start + n] += sig[:n]


def saw(f, n, ph0=None):
    ph0 = rng.random() if ph0 is None else ph0
    dt = f / SR
    t = (ph0 + dt * np.arange(n)) % 1.0
    y = 2 * t - 1
    m = t < dt; x = t[m] / dt; y[m] -= x + x - x * x - 1
    m = t > 1 - dt; x = (t[m] - 1) / dt; y[m] -= x * x + x + x + 1
    return y


def adsr(n, a=0.005, d=0.1, s=0.8, r=0.05, sustain_len=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    hold = n - r if sustain_len is None else sustain_len
    env = np.full(n, s, np.float64)
    ta = min(a, n)
    env[:ta] = np.linspace(0, 1, a, endpoint=False)[:ta]
    if a < n:
        td = min(d, n - a)
        env[a:a + td] = np.linspace(1, s, d, endpoint=False)[:td]
    if 0 < hold < n:
        rel = np.linspace(1, 0, n - hold) ** 2
        env[hold:] *= rel
    return env


def supersaw(m, n, voices=7, detune=0.14, width=1.0):
    out = np.zeros((n, 2))
    dets = np.linspace(-detune, detune, voices)
    for i, d in enumerate(dets):
        pan = (i / (voices - 1) * 2 - 1) * width
        g = 1.0 if abs(d) < 1e-6 else 0.75
        out += stereo(saw(mtof(m + d), n) * g, pan)
    return out / voices * 1.6


def biquad(fc, q, kind):
    w = 2 * np.pi * np.clip(fc, 20, SR * 0.45) / SR
    al = np.sin(w) / (2 * q); c = np.cos(w)
    if kind == 'lp':
        b = [(1 - c) / 2, 1 - c, (1 - c) / 2]
    elif kind == 'hp':
        b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
    else:  # bandpass (constant peak)
        b = [al, 0, -al]
    a = [1 + al, -2 * c, 1 - al]
    return np.array(b) / a[0], np.array(a) / a[0]


def tvf(x, fc, q=0.8, kind='lp', block=128):
    """time-varying biquad; fc is scalar or per-sample array"""
    x = np.asarray(x, np.float64)
    mono = x.ndim == 1
    X = x[:, None] if mono else x
    fc = np.broadcast_to(np.asarray(fc, np.float64), (len(X),))
    Y = np.zeros_like(X)
    for ch in range(X.shape[1]):
        zi = np.zeros(2)
        for s in range(0, len(X), block):
            b, a = biquad(fc[s], q, kind)
            Y[s:s + block, ch], zi = lfilter(b, a, X[s:s + block, ch], zi=zi)
    return Y[:, 0] if mono else Y


def sfilt(x, kind, f, order=2):
    sos = butter(order, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x, axis=0)


def noise(n):
    return rng.standard_normal(n)


def make_ir(rt=2.4, length=3.0, bright=6000, predelay=0.012, seed=1):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-6.9 * t / rt)[:, None]
    ir = sfilt(ir, 'low', bright, 1)
    # darken tail
    ir = ir * (0.55 + 0.45 * np.exp(-t / 0.4))[:, None]
    pd = int(predelay * SR)
    ir = np.vstack([np.zeros((pd, 2)), ir])
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    return ir


IR_BIG = make_ir(2.8, 3.4, 5500, 0.02, 1)
IR_ROOM = make_ir(0.9, 1.2, 7000, 0.006, 2)


def reverb(x, ir, wet):
    y = np.stack([fftconvolve(x[:, 0], ir[:, 0])[:len(x)], fftconvolve(x[:, 1], ir[:, 1])[:len(x)]], 1)
    return y * wet


def delay(x, beats, fb=0.45, taps=5, pingpong=True):
    d = bs(beats)
    y = np.zeros_like(x)
    g = 1.0
    for k in range(1, taps + 1):
        g *= fb
        sh = np.zeros_like(x)
        sh[d * k:] = x[:-d * k]
        if pingpong:
            sh = sh[:, ::-1] if k % 2 else sh
        y += sh * g
    return y


# ------------------------------------------------------------------ drum one-shots
def kick_s(hard=1.0):
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = 46 + 130 * np.exp(-t / 0.032) + 260 * np.exp(-t / 0.004)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.30 * hard))
    body = np.tanh(body * 1.8) / np.tanh(1.8)
    click = sfilt(noise(n), 'high', 3000) * np.exp(-t / 0.0025) * 0.35
    return (body + click) * 0.95


def clap_s():
    n = int(0.6 * SR); t = np.arange(n) / SR
    env = np.zeros(n)
    for k, o in enumerate([0, 0.010, 0.021, 0.030]):
        m = t >= o
        env[m] += np.exp(-(t[m] - o) / (0.006 if k < 3 else 0.16)) * (1 if k < 3 else 0.9)
    x = sfilt(noise(n), 'band', [800, 3200], 2) * env
    return x * 1.3


def snare_s(pitch=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 185 * pitch * t) + 0.5 * np.sin(2 * np.pi * 330 * pitch * t)) * np.exp(-t / 0.06)
    nz = sfilt(noise(n), 'band', [1200 * pitch, 9000], 2) * np.exp(-t / 0.12)
    return (tone * 0.6 + nz * 1.1) * 0.9


def metal(n):
    t = np.arange(n) / SR
    fs = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]
    x = sum(np.sign(np.sin(2 * np.pi * f * t + rng.random() * 6)) for f in fs)
    return x / 6


def hat_s(open_=False):
    n = int((0.35 if open_ else 0.08) * SR); t = np.arange(n) / SR
    x = sfilt(noise(n) * 0.7 + metal(n) * 0.6, 'high', 7500, 2)
    return x * np.exp(-t / (0.12 if open_ else 0.022)) * 1.0


def crash_s():
    n = int(2.6 * SR); t = np.arange(n) / SR
    x = sfilt(noise(n) * 0.8 + metal(n) * 0.5, 'high', 3500, 2) * np.exp(-t / 0.9)
    return x * 0.5


def impact_s():
    n = int(3.0 * SR); t = np.arange(n) / SR
    f = 28 + 60 * np.exp(-t / 0.25)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.1)
    sub = np.tanh(sub * 2.2) * 0.9
    nz = sfilt(noise(n), 'low', 2500, 2) * np.exp(-t / 0.35) * 0.5
    return sub + nz


# ------------------------------------------------------------------ song data
CH = [  # chord tones (mid register), root midi (sub), bass root
    dict(tones=[65, 68, 72], root=29, name='Fm'),
    dict(tones=[65, 68, 73], root=37, name='Db'),
    dict(tones=[63, 68, 72], root=32, name='Ab'),
    dict(tones=[63, 67, 70], root=39, name='Eb'),
]


def chord_at_beat(b):
    return CH[int(b // 4) % 4]


HOOK = [  # (16th step, midi, len steps) over 4 bars
    (0, 72, 2), (2, 72, 2), (4, 68, 2), (6, 72, 2), (8, 75, 3), (11, 72, 2), (13, 70, 1), (14, 68, 2),
    (16, 77, 3), (19, 75, 3), (22, 72, 2), (24, 73, 2), (26, 72, 2), (28, 70, 2), (30, 68, 2),
    (32, 72, 2), (34, 72, 2), (36, 68, 2), (38, 72, 2), (40, 75, 3), (43, 77, 2), (45, 75, 1), (46, 72, 2),
    (48, 70, 3), (51, 68, 3), (54, 67, 2), (56, 68, 2), (58, 70, 2), (60, 72, 4),
]

drums = np.zeros((N, 2)); bass = np.zeros((N, 2)); synth = np.zeros((N, 2)); fx = np.zeros((N, 2))
send_big = np.zeros((N, 2))
kicks = []; snares = []; impacts = []

K = kick_s(); CL = clap_s(); HC = hat_s(False); HO = hat_s(True); CR = crash_s(); IM = impact_s()


def hit(buf, b, sample, gain=1.0, pan=0.0, send=0.0):
    s = stereo(sample * gain, pan) if sample.ndim == 1 else sample * gain
    add(buf, bs(b), s)
    if send:
        add(send_big, bs(b), s * send)


def kick(b, g=1.0):
    hit(drums, b, K, g); kicks.append((b, g))


# ------------------------------------------------------------------ arrangement: drums
# verse
for b in range(16, 48):
    kick(b, 0.7 if b < 32 else 0.8)
    hit(drums, b + 0.5, HC, 0.55 if b < 32 else 0.7, pan=0.25)
    if b >= 32:
        if b % 2 == 1:
            hit(drums, b, CL, 0.55, send=0.25); snares.append(b)
        hit(drums, b + 0.25, HC, 0.25, pan=-0.3); hit(drums, b + 0.75, HC, 0.3, pan=-0.3)
hit(drums, 16, CR, 0.6, send=0.3)
hit(drums, 32, CR, 0.5, send=0.3)
# build 1: kick 4/4 then snare roll
for b in range(48, 60):
    kick(b, 0.9)
roll = []
roll += [48 + i for i in range(8)]
roll += [56 + i * 0.5 for i in range(8)]
roll += [60 + i * 0.25 for i in range(8)]
roll += [62 + i * 0.125 for i in range(8)]
for i, b in enumerate(roll):
    g = 0.25 + 0.55 * (i / len(roll)) ** 1.3
    hit(drums, b, snare_s(1.0 + 0.6 * i / len(roll)), g, pan=0.0, send=0.25); snares.append(b)
for b in range(60, 63):
    kick(b, 0.8)
    kick(b + 0.5, 0.6)


def drop_drums(b0, b1, heavy=False, halftime=None):
    for b in range(b0, b1):
        if halftime and halftime[0] <= b < halftime[1]:
            if b % 4 == 0:
                kick(b, 1.0); kick(b + 1.5, 0.8)
            if b % 4 == 2:
                hit(drums, b, CL, 0.9, send=0.35); hit(drums, b, snare_s(0.9), 0.5); snares.append(b)
            for s in range(4):
                hit(drums, b + s * 0.25, HC, 0.35 if s % 2 else 0.5, pan=0.3 * (1 if s % 2 else -1))
            continue
        kick(b, 1.0)
        if b % 2 == 1:
            hit(drums, b, CL, 1.0, send=0.3); snares.append(b)
            if heavy:
                hit(drums, b, snare_s(1.1), 0.4)
        hit(drums, b + 0.5, HO, 0.55, pan=0.2)
        for s in [0.25, 0.75]:
            hit(drums, b + s, HC, 0.4, pan=-0.35)
        if heavy:
            hit(drums, b + 0.125 * 7, HC, 0.18, pan=0.5)


drop_drums(64, 96)
hit(drums, 64, CR, 0.9, send=0.4); hit(drums, 80, CR, 0.7, send=0.4)
hit(fx, 64, IM, 1.0); impacts.append(64)
# break: sparse
for b in range(104, 112):
    if b % 4 == 0:
        kick(b, 0.6)
    for s in range(4):
        hit(drums, b + s * 0.25, HC, 0.12 + 0.1 * (s == 2), pan=0.4)
hit(drums, 96, CR, 0.6, send=0.5)
# build 2
for b in range(112, 120):
    kick(b, 0.95)
for b in np.arange(120, 124, 0.5):
    kick(b, 0.9)
for b in np.arange(124, 126, 0.25):
    kick(b, 0.85)
roll2 = [112 + i for i in range(8)] + [120 + i * 0.5 for i in range(8)] + \
        [124 + i * 0.25 for i in range(8)] + [126 + i * 0.125 for i in range(8)]
for i, b in enumerate(roll2):
    g = 0.3 + 0.6 * (i / len(roll2)) ** 1.2
    hit(drums, b, snare_s(1.0 + 0.9 * i / len(roll2)), g, send=0.25); snares.append(b)
hit(drums, 112, CR, 0.6, send=0.3)
# drop 2
drop_drums(128, 172, heavy=True, halftime=(168, 172))
for b in [128, 144, 160, 168]:
    hit(drums, b, CR, 0.8, send=0.4)
hit(fx, 128, IM, 1.1); impacts.append(128)
# final stutter bar 172-176: snare roll + kick 16ths accel
for i in range(16):
    b = 172 + i * 0.25
    hit(drums, b, snare_s(1.0 + i / 16), 0.35 + 0.5 * i / 16, send=0.2); snares.append(b)
    if i % 2 == 0:
        kick(b, 0.8)
# outro
hit(fx, 176, IM, 0.9); impacts.append(176); hit(drums, 176, CR, 0.9, send=0.5); kick(176, 1.0)
hit(fx, 184, IM, 0.8); impacts.append(184); hit(drums, 184, CR, 0.7, send=0.6); kick(184, 0.9)

# ------------------------------------------------------------------ bass
def sub_note(b0, b1, m, g=0.55):
    n = bs(b1) - bs(b0); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * mtof(m) * t) * adsr(n, 0.004, 0.05, 1.0, 0.03)
    add(bass, bs(b0), stereo(np.tanh(x * 1.3) * g))


def mid_bass(b0, b1, m, g=0.25, cutoff=900):
    n = bs(b1) - bs(b0)
    x = (saw(mtof(m + 12), n) + 0.6 * saw(mtof(m + 12.08), n)) * adsr(n, 0.003, 0.08, 0.8, 0.03)
    x = sfilt(x, 'low', cutoff, 2)
    add(bass, bs(b0), stereo(x * g))


for b in range(16, 48, 4):
    c = chord_at_beat(b)
    for k in range(4):
        sub_note(b + k, b + k + 1, c['root'], 0.3 if b < 32 else 0.36)
for b in range(48, 63, 1):
    c = chord_at_beat(b); sub_note(b, b + 1, c['root'], 0.36)
for rng_ in [(64, 96), (128, 172)]:
    for b in range(*rng_):
        c = chord_at_beat(b)
        sub_note(b, b + 1, c['root'], 0.46)
        mid_bass(b + 0.5, b + 1, c['root'], 0.3, 1400)
# growl / FM wobble bass for drop 2
def growl(b0, b1, m, rate_beats=0.5, g=0.22):
    n = bs(b1) - bs(b0); t = np.arange(n) / SR
    f = mtof(m + 12)
    lfo = 0.5 - 0.5 * np.cos(2 * np.pi * t / (rate_beats * TL.BEAT))
    idx = 0.5 + 5.5 * lfo
    mod = np.sin(2 * np.pi * f * 1.0 * t) * idx
    car = np.sin(2 * np.pi * f * t + mod) + 0.5 * saw(f * 1.005, n)
    x = np.tanh(car * 2.2)
    x = tvf(x, 250 + 3200 * lfo, 1.4, 'lp', 64)
    x *= adsr(n, 0.004, 0.05, 1, 0.02)
    add(bass, bs(b0), stereo(x * g))


for b in range(128, 172):
    if 168 <= b < 172:
        continue
    c = chord_at_beat(b)
    if b % 2 == 0:
        growl(b + 0.5, b + 1.0, c['root'], 0.25, 0.27)
    else:
        growl(b + 0.25, b + 1.0, c['root'], 0.375, 0.27)
for b in range(168, 172):
    c = chord_at_beat(b)
    if b % 4 in (0, 2):
        sub_note(b, b + 2, c['root'], 0.6)
        growl(b, b + 2, c['root'], 1.0, 0.24)
for b in range(96, 112, 4):  # break sub
    c = chord_at_beat(b); sub_note(b, b + 4, c['root'], 0.3)
sub_note(176, 184, 29, 0.45); sub_note(184, 196, 29, 0.4)

# ------------------------------------------------------------------ synths
def pad(b0, b1, tones, g=0.12, detune=0.25, attack=0.6, release=1.2):
    n = bs(b1) - bs(b0) + int(release * SR)
    x = sum(supersaw(m, n, 5, detune) for m in tones)
    x *= adsr(n, attack, 0.5, 0.9, release)[:, None]
    add(synth, bs(b0), x * g); add(send_big, bs(b0), x * g * 0.8)


# intro pad + break pad + outro pad
for b in range(0, 16, 4):
    c = CH[0] if b < 8 else CH[(b // 4) % 4]
    pad(b, b + 4, [m - 12 for m in c['tones']] + [c['tones'][0]], 0.04, attack=1.2)
for b in range(96, 112, 4):
    c = chord_at_beat(b); pad(b, b + 4, [m - 12 for m in c['tones']] + c['tones'], 0.04, attack=0.9)
pad(176, 184, [53, 56, 60, 65, 68, 72], 0.05, attack=0.05)
pad(184, 196, [53, 56, 60, 63, 65, 72, 79], 0.05, attack=0.05, release=2.5)


def bell(m, n, g=0.3):
    t = np.arange(n) / SR; f = mtof(m)
    idx = 3.0 * np.exp(-t / 0.25)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 0.9)
    return x * g


# intro glass notes, break hook on bells, outro hook bells
for i, (st, m, ln) in enumerate(HOOK[::2]):
    pass
for b, m in [(2, 84), (3.5, 80), (5, 87), (6.5, 84), (10, 84), (11.5, 89), (13, 87), (14.5, 84)]:
    x = stereo(bell(m, int(2.5 * SR), 0.06), pan=rng.uniform(-0.6, 0.6))
    add(synth, bs(b), x); add(send_big, bs(b), x * 0.9)
for rep in range(2):
    for st, m, ln in HOOK:
        b = 96 + rep * 8 + st * 0.5 / 1.0 * 0.25 * 2  # half speed: 16th -> 8th
        b = 96 + rep * 16 + st * 0.25
        if b >= 112:
            continue
        x = stereo(bell(m + 12, int(1.8 * SR), 0.07), pan=0.3 * np.sin(st))
        add(synth, bs(b), x); add(send_big, bs(b), x)
for st, m, ln in HOOK[:16]:
    b = 186 + st * 0.5
    if b < 197:
        x = stereo(bell(m + 12, int(2.2 * SR), 0.08 * (1 - (b - 186) / 12)), pan=0.4 * np.sin(st))
        add(synth, bs(b), x); add(send_big, bs(b), x * 1.4)

# pluck arp (verse + build 1) through one time-varying filter
arp = np.zeros((N, 2))
ARP_PAT = [0, 1, 2, 3, 2, 1, 3, 4, 0, 2, 1, 3, 4, 3, 2, 1]
for b in np.concatenate([np.arange(16, 63, 0.25), np.arange(112, 127, 0.25)]):
    c = chord_at_beat(b)
    tones = c['tones'] + [c['tones'][0] + 12, c['tones'][1] + 12]
    step = int(round((b - 16) * 4)) % 16
    m = tones[ARP_PAT[step]]
    n = int(0.3 * SR)
    x = (saw(mtof(m), n) * 0.7 + np.sign(np.sin(2 * np.pi * mtof(m + 12) * np.arange(n) / SR)) * 0.2)
    x *= np.exp(-np.arange(n) / SR / 0.13)
    add(arp, bs(b), stereo(x * 0.26, pan=0.35 * np.sin(step * 0.9)))
tt = np.arange(N) / SR
beatpos = tt / TL.BEAT
env16 = np.exp(-((beatpos * 4) % 1) * TL.BEAT / 4 / 0.045)
base = np.interp(beatpos, [16, 32, 48, 56, 63, 112, 120, 127], [500, 1100, 2200, 3500, 7000, 1500, 3500, 9000])
arp = tvf(arp, base * (1 + 2.5 * env16), 1.1, 'lp', 128)
arp[:bs(16)] = 0
synth += arp; send_big += arp * 0.25
synth += delay(arp, 0.75, 0.35, 4) * 0.35

# drop chords + lead
lead = np.zeros((N, 2)); chords = np.zeros((N, 2))


def drop_music(b0, bars, oct_up=False):
    for bar in range(bars):
        b = b0 + bar * 4
        c = chord_at_beat(b)
        n = bs(4)
        x = sum(supersaw(m, n, 7, 0.16) for m in c['tones'] + [c['tones'][0] - 12])
        x *= adsr(n, 0.004, 0.2, 0.85, 0.05)[:, None]
        add(chords, bs(b), x * 0.13)
    for rep in range(bars // 4):
        for st, m, ln in HOOK:
            b = b0 + rep * 16 + st * 0.25
            n = int(ln * 0.25 * TL.BEAT * SR)
            for mm, gg in ([(m, 1.0), (m + 12, 0.45)] if oct_up else [(m, 1.0)]):
                x = supersaw(mm, n + int(0.08 * SR), 7, 0.12)
                x *= adsr(n + int(0.08 * SR), 0.004, 0.08, 0.8, 0.08, sustain_len=n)[:, None]
                add(lead, bs(b), x * 0.2 * gg)


drop_music(64, 8)
drop_music(128, 10, oct_up=True)
# half-time switch bars 168-171: sustained big chords (stutter handled later)
for b in [168, 170]:
    c = chord_at_beat(b); n = bs(2)
    x = sum(supersaw(m, n, 7, 0.2) for m in c['tones'] + [c['tones'][0] + 12])
    add(chords, bs(b), x * adsr(n, 0.003, 0.3, 0.7, 0.1)[:, None] * 0.08)
# stutter bar source: repeated chord
for b in [172]:
    c = CH[3]; n = bs(4)
    x = sum(supersaw(m, n, 7, 0.16) for m in c['tones'] + [c['tones'][0] + 12])
    add(chords, bs(b), x * np.linspace(0.5, 1, n)[:, None] * 0.08)
# outro final chord stab
n = bs(3)
x = sum(supersaw(m, n, 7, 0.18) for m in [53, 60, 65, 68, 72, 77])
add(chords, bs(176), x * adsr(n, 0.003, 0.5, 0.4, 1.0)[:, None] * 0.08)

lead = sfilt(lead, 'low', 7000, 2)
chords = sfilt(chords, 'low', 5200, 2)
synth += lead + chords
send_big += lead * 0.35 + chords * 0.2
synth += delay(lead, 0.75, 0.4, 4) * 0.28

# risers
def riser(b0, b1, g=0.35):
    n = bs(b1) - bs(b0); t = np.linspace(0, 1, n)
    x = noise(n)
    x = tvf(x, 300 * (30 ** t), 2.5, 'bp', 128) * (t ** 2) * g
    f = mtof(53) * (4 ** t)
    x += saw(1, n) * 0  # placeholder for phase continuity
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(ph * k + k) / k for k in range(1, 5)) * (t ** 2.5) * g * 0.35
    s = np.stack([x + tone * 0.8, x * 0.9 + tone], 1)
    add(fx, bs(b0), s); add(send_big, bs(b0), s * 0.6)


riser(48, 63, 0.4)
riser(112, 127, 0.5)
riser(172, 176, 0.35)

# ------------------------------------------------------------------ sound design cues
def sd_key(space=False, seed=0):
    r = np.random.default_rng(seed)
    n = int(0.05 * SR); t = np.arange(n) / SR
    x = sfilt(r.standard_normal(n), 'band', [1500, 6000] if not space else [500, 2500], 2) * np.exp(-t / 0.004)
    x += np.sin(2 * np.pi * (140 if space else 220) * t) * np.exp(-t / 0.01) * 0.4
    return stereo(x * (0.5 if not space else 0.6), r.uniform(-0.3, 0.3))


def sd_blip(f=1200, n_s=0.09, g=0.18):
    n = int(n_s * SR); t = np.arange(n) / SR
    ff = f * (1 + 0.5 * (t / n_s))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.03)
    return stereo(x * g)


def sd_whoosh(length=0.6, pan=0.5, g=0.35):
    n = bs(length); t = np.linspace(0, 1, n)
    fc = 300 + 3500 * np.sin(np.pi * t) ** 2
    x = tvf(noise(n), fc, 1.8, 'bp', 64) * np.sin(np.pi * t) ** 1.5 * g
    p = -pan + 2 * pan * t
    l = np.cos((p + 1) * np.pi / 4); r_ = np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l, x * r_], 1) * 1.4


def sd_glitch(length=0.12, seed=0):
    r = np.random.default_rng(seed)
    n = bs(length)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        seg = int(r.uniform(0.008, 0.03) * SR)
        f = r.choice([220, 440, 880, 1760, 3520, 130])
        tt_ = np.arange(seg) / SR
        kind = r.integers(3)
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * f * tt_))
        elif kind == 1:
            s = r.standard_normal(seg)
        else:
            s = np.round(np.sin(2 * np.pi * f * tt_) * 3) / 3
        x[pos:pos + seg] = s[:n - pos] * r.uniform(0.3, 0.8)
        pos += seg
    x = np.round(x * 8) / 8
    return stereo(x * 0.22, r.uniform(-0.5, 0.5))


def sd_data_hit():
    n = int(0.25 * SR); t = np.arange(n) / SR
    sq = np.sign(np.sin(2 * np.pi * 1760 * t)) * np.exp(-t / 0.02) * 0.15
    cr = np.round(rng.standard_normal(n) * 2) / 2 * np.exp(-t / 0.03) * 0.12
    th = np.sin(2 * np.pi * (60 + 80 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.08) * 0.35
    return stereo(sq + cr + th)


def sd_reverse_suck(length_b=1.0):
    n = bs(length_b); t = np.arange(n) / SR
    x = sfilt(noise(n), 'band', [300, 6000], 2) * np.exp(-t / 0.18) * 0.5
    x += np.sin(2 * np.pi * 45 * t) * np.exp(-t / 0.3) * 0.4
    x = x[::-1] * np.linspace(0.2, 1, n)
    x = x * (1 - np.exp(-np.arange(n)[::-1] / (0.004 * SR)))  # hard stop at downbeat
    return np.stack([x, x * 0.95], 1)


def sd_swell(length_b=4, rev=True):
    n = bs(length_b); t = np.linspace(0, 1, n)
    x = tvf(noise(n), 400 + 5000 * t ** 2, 1.2, 'bp', 128) * (t ** 2.2) * 0.25
    return np.stack([x, np.roll(x, 300)], 1)


def sd_hit_soft():
    n = int(2.0 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * (38 + 40 * np.exp(-t / 0.1)) * t) * np.exp(-t / 0.6) * 0.6
    x += sfilt(noise(n), 'low', 1200, 2) * np.exp(-t / 0.15) * 0.25
    return stereo(x)


def sd_success():
    out = np.zeros((int(1.6 * SR), 2))
    for i, m in enumerate([84, 91, 96]):
        add(out, int(i * 0.07 * SR), stereo(bell(m, int(1.4 * SR), 0.12), 0.3 * (i - 1)))
    return out


def sd_shimmer():
    out = np.zeros((int(3.5 * SR), 2))
    for i, m in enumerate([89, 92, 96, 99, 101, 104, 108]):
        add(out, int(i * 0.045 * SR), stereo(bell(m, int(3.0 * SR), 0.06), np.sin(i * 1.7) * 0.8))
    return out


def sd_zap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 2400 * np.exp(-t / 0.08) + 90
    x = np.sin(2 * np.pi * np.cumsum(f) / SR + 2 * np.sin(2 * np.pi * 57 * t)) * np.exp(-t / 0.12)
    return stereo(np.tanh(x * 2) * 0.22)


for b, kind, kw in TL.SFX:
    if kind == 'key':
        s = sd_key(kw.get('space', False), kw.get('seed', 0))
    elif kind == 'enter':
        s = sd_key(True, 999) * 1.4; add(fx, bs(b + 0.05), sd_blip(1500, 0.12, 0.12))
    elif kind in ('blip', 'tick'):
        s = sd_blip(kw.get('f', 1200), 0.07 if kind == 'blip' else 0.035, 0.14 if kind == 'blip' else 0.09)
    elif kind == 'whoosh':
        s = sd_whoosh(kw.get('length', 0.6), kw.get('pan', 0.5), 0.33)
    elif kind == 'swish':
        s = sd_whoosh(kw.get('length', 0.3), 0.8, 0.26)
    elif kind == 'glitch':
        s = sd_glitch(kw.get('length', 0.1), kw.get('seed', 0))
    elif kind == 'data_hit':
        s = sd_data_hit()
    elif kind == 'sub_drop_in':
        s = sd_reverse_suck(1.0)
    elif kind in ('swell', 'swell_rev'):
        L = kw.get('length', 4); s = sd_swell(L)
    elif kind == 'hit_soft':
        s = sd_hit_soft()
    elif kind == 'success':
        s = sd_success()
    elif kind == 'shimmer':
        s = sd_shimmer()
    elif kind == 'zap':
        s = sd_zap()
    else:
        continue
    add(fx, bs(b), s)
    add(send_big, bs(b), s * 0.3)

# ------------------------------------------------------------------ sidechain
sc = np.ones(N)
L = int(0.30 * SR); tt_sc = np.arange(L) / SR
curve = 1 - 0.82 * np.exp(-tt_sc / 0.075) * (1 - np.exp(-tt_sc / 0.002))
curve[:int(0.004 * SR)] = np.minimum(curve[:int(0.004 * SR)], 1 - 0.82 * np.linspace(0, 1, int(0.004 * SR)))
for b, g in kicks:
    s = bs(b); e = min(N, s + L)
    sc[s:e] = np.minimum(sc[s:e], 1 - (1 - curve[:e - s]) * min(1, g))
bass *= sc[:, None]
synth *= (0.35 + 0.65 * sc)[:, None]

# ------------------------------------------------------------------ busses, reverb, master
wet = reverb(send_big, IR_BIG, 0.55)
room = reverb(drums * 0.25, IR_ROOM, 0.5)
music_bus = synth + wet * (0.5 + 0.5 * sc)[:, None]
drums_bus = drums + room
drums_bus = sfilt(drums_bus, 'high', 30, 2)

# build filter sweeps (highpass on music during builds)
hpf = np.full(N, 20.0)
for a, b_, f0, f1 in [(56, 63, 20, 900), (120, 127, 20, 1200)]:
    s, e = bs(a), bs(b_)
    hpf[s:e] = f0 * (f1 / f0) ** np.linspace(0, 1, e - s)
music_bus = tvf(music_bus, hpf, 0.7, 'hp', 256)
bass_hp = bass.copy()
for a, b_ in [(60, 63), (124, 127)]:
    s, e = bs(a), bs(b_)
    bass_hp[s:e] *= np.linspace(1, 0.2, e - s)[:, None]

mix = drums_bus * 0.5 + bass_hp * 0.85 + music_bus * 2.8

# tape stop + silence in the two "gaps" before drops, stutter in bar 43
def tape_stop(x, b0, b1):
    s, e = bs(b0), bs(b1)
    n = e - s
    rate = np.linspace(1, 0, n) ** 1.3
    pos = s + np.cumsum(rate)
    for ch in range(2):
        x[s:e, ch] = np.interp(pos, np.arange(len(x)), x[:, ch]) * np.linspace(1, 0.3, n)
    return x


for g0 in [63, 127]:
    mix = tape_stop(mix, g0 - 0.5, g0)
    s, e = bs(g0), bs(g0 + 1)
    tail = np.exp(-np.arange(e - s) / (0.05 * SR))
    mix[s:e] *= tail[:, None] * 0.0 + 0.0
    mix[s:e] += (wet[s:e] * 0.25) * np.linspace(1, 0, e - s)[:, None]


def stutter(x, b0, b1, slot_b, rep_b):
    for s0 in np.arange(b0, b1, slot_b):
        s, e = bs(s0), bs(s0 + slot_b)
        chunk = x[s:s + bs(rep_b)].copy()
        fade = min(64, len(chunk) // 4)
        chunk[:fade] *= np.linspace(0, 1, fade)[:, None]; chunk[-fade:] *= np.linspace(1, 0, fade)[:, None]
        reps = int(np.ceil((e - s) / len(chunk)))
        x[s:e] = np.tile(chunk, (reps, 1))[:e - s]
    return x


music_only = music_bus * 2.8 + bass_hp * 0.85
stut = stutter(music_only.copy(), 172, 174, 0.25, 0.125)
stut = stutter(stut, 174, 176, 0.25, 0.0625)
s, e = bs(172), bs(176)
mix[s:e] = drums_bus[s:e] * 0.5 + (stut[s:e] - music_only[s:e]) * 0 + (stut[s:e] * np.linspace(0.8, 1.1, e - s)[:, None]) * 1.0
mix[s:e] += 0  # stutter bus already scaled below

mix += fx * 0.75

# master: highpass, soft clip, limiter
mix = sfilt(mix, 'high', 25, 2)
mix = np.tanh(mix * 1.1) / 1.1
env = maximum_filter1d(np.max(np.abs(mix), 1), size=int(0.004 * SR))
thr = 0.89
g = np.minimum(1.0, thr / np.maximum(env, 1e-9))
# smooth gain (fast attack via min-filter already, release 80ms)
a = np.exp(-1 / (0.08 * SR))
g = lfilter([1 - a], [1, -a], g)
g = np.minimum(g, thr / np.maximum(env, 1e-9))
mix = mix * g[:, None]
# end fade
fe = bs(TL.END_BEAT); fs_ = bs(TL.END_BEAT - 3)
mix[fs_:fe] *= np.linspace(1, 0, fe - fs_)[:, None] ** 1.5
mix[fe:] = 0
mix = mix[:bs(TL.END_BEAT)]
mix *= 0.95 / np.max(np.abs(mix))
wavfile.write(os.path.join(TL.BUILD, 'master.wav'), SR, (mix * 32767).astype(np.int16))

# ------------------------------------------------------------------ analysis for visuals
fpb = TL.FPB
nf = TL.N_FRAMES
spf = SR // TL.FPS
mono = np.abs(mix).mean(1)
low = np.abs(sfilt(mix.mean(1), 'low', 150, 2))
rms = np.array([np.sqrt(np.mean(mono[i * spf:(i + 1) * spf] ** 2)) for i in range(nf)])
lowr = np.array([np.sqrt(np.mean(low[i * spf:(i + 1) * spf] ** 2)) for i in range(nf)])
json.dump(dict(kicks=sorted(set(float(b) for b, g in kicks)), snares=sorted(set(float(b) for b in snares)),
               impacts=impacts, rms=(rms / rms.max()).round(4).tolist(), low=(lowr / lowr.max()).round(4).tolist()),
          open(os.path.join(TL.BUILD, 'audio_analysis.json'), 'w'))
print('done', mix.shape, 'peak', np.max(np.abs(mix)), 'rms dB', 20 * np.log10(np.sqrt(np.mean(mix ** 2))))

if __name__ == '__main__':
    for nm, arr in [('drums', drums_bus), ('bass', bass_hp), ('music', music_bus), ('fx', fx), ('lead', lead), ('chords', chords), ('arp', arp)]:
        out = []
        for s_, e_, n_ in TL.SECTIONS:
            a_, b_ = s_ * SPB, e_ * SPB
            out.append(f"{n_}:{20*np.log10(np.sqrt(np.mean(arr[a_:b_]**2))+1e-9):6.1f}")
        print(f"{nm:7s}", ' '.join(out))
