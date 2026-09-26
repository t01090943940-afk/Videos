"""Soundtrack for the protocom promo — synthesized from scratch, locked to the video's cue sheet.

120 BPM (beat = 0.5 s). A minor. Every hit, whoosh and keystroke below is placed at the
same timestamps the renderer uses, so picture and sound cut together on the frame.
"""
import numpy as np
from scipy import signal
import wave, sys

SR = 44100
DUR = 80.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)          # dry bus
RL = np.zeros(N); RR = np.zeros(N)        # reverb send
DUCK = np.ones(N)                          # sidechain envelope (kick-driven)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def at(t):
    return int(round(t * SR))


def add(x, t, gain=1.0, pan=0.0, rev=0.0, duck=False):
    i = at(t)
    if i >= N:
        return
    x = x[: N - i]
    if duck:
        x = x * DUCK[i:i + len(x)]
    gl = gain * np.sqrt(0.5 * (1 - pan)); gr = gain * np.sqrt(0.5 * (1 + pan))
    L[i:i + len(x)] += x * gl; R[i:i + len(x)] += x * gr
    if rev:
        RL[i:i + len(x)] += x * gl * rev; RR[i:i + len(x)] += x * gr * rev


def env(n, a=0.005, d=0.2, curve=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d) ** curve
    return e


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, min(f, SR / 2 - 100), btype='low', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype='high', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def sweep_lp(x, f0, f1, block=512):
    """Time-varying low-pass (exponential cutoff sweep)."""
    out = np.zeros_like(x); zi = None
    nb = int(np.ceil(len(x) / block))
    for b in range(nb):
        f = f0 * (f1 / f0) ** (b / max(1, nb - 1))
        sos = signal.butter(2, min(f, SR / 2 - 200), btype='low', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    return out


def saw(f, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * f + phase) % 1) - 1


# ---------------------------------------------------------------- instruments
def kick(strength=1.0, dur=0.45):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 45 + 120 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.16)
    click = hp(noise(n), 2000) * np.exp(-t / 0.004) * 0.4
    return np.tanh((body + click) * 1.6 * strength)


def clap(dur=0.35):
    n = int(SR * dur); t = np.arange(n) / SR
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-np.maximum(0, t - o) / (0.006 if k < 2 else 0.09))
    return bp(noise(n), 900, 5200) * e * 0.9


def snare(dur=0.25):
    n = int(SR * dur); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05)
    return (bp(noise(n), 1500, 8000) * np.exp(-t / 0.07) * 0.8 + tone * 0.5)


def hat(open_=False):
    d = 0.22 if open_ else 0.035
    n = int(SR * (d * 4)); t = np.arange(n) / SR
    return hp(noise(n), 7500, 4) * np.exp(-t / d) * 0.55


def crash(dur=2.4):
    n = int(SR * dur); t = np.arange(n) / SR
    return hp(noise(n), 3500, 2) * np.exp(-t / 0.7) * 0.5


def sub_boom(dur=2.2, f0=70, f1=32):
    n = int(SR * dur); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.8)


def impact(big=1.0):
    n = int(SR * 3.0); t = np.arange(n) / SR
    x = np.zeros(n)
    k = kick(1.3); x[:len(k)] += k
    s = sub_boom(); x[:len(s)] += s * 0.9
    c = crash(3.0); x[:len(c)] += c * 0.8
    nb = lp(noise(n), 1200) * np.exp(-t / 0.35) * 0.6
    return np.tanh(x * big + nb * big)


def whoosh(dur=0.6, lo=300, hi=6000, peak=0.6):
    n = int(SR * dur); t = np.arange(n) / SR
    x = noise(n)
    out = np.zeros(n); zi = None; block = 256; nb = n // block + 1
    for b in range(nb):
        u = b / nb
        c = lo * (hi / lo) ** u
        sos = signal.butter(2, [c * 0.6, min(c * 1.6, SR / 2 - 100)], btype='band', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    e = np.where(t < dur * peak, (t / (dur * peak)) ** 2, np.exp(-(t - dur * peak) / (dur * 0.15)))
    return out * e * 2.2


def riser(dur, f0=200, f1=2400):
    n = int(SR * dur); t = np.arange(n) / SR
    u = t / dur
    f = f0 * (f1 / f0) ** u
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 + saw(1, n) * 0
    nz = whoosh(dur, 200, 9000, 0.98)[:n] * 0.6
    return (tone * u ** 2 + nz) * (u ** 1.5)


def reverse_swell(dur=0.6):
    c = crash(dur * 1.5)[: int(SR * dur)]
    return c[::-1] * 1.2


def click(freq=3000, dur=0.012, amp=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    return bp(noise(n), freq * 0.6, min(freq * 1.8, 20000)) * np.exp(-t / (dur / 4)) * amp


def key_click():
    x = click(2500 + rng.random() * 2500, 0.03, 0.8)
    y = np.concatenate([np.zeros(int(SR * 0.012)), click(900, 0.018, 0.35)])
    m = min(len(x), len(y))
    x[:m] += y[:m]
    return x


def blip(freq, dur=0.09, amp=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * np.exp(-t / (dur / 3)) * amp


def pluck(freq, dur=1.6, bright=1.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.zeros(n)
    for h, a in [(1, 1), (2, 0.5 * bright), (3, 0.25 * bright), (4, 0.12 * bright), (5, 0.06 * bright)]:
        x += a * np.sin(2 * np.pi * freq * h * t + h) * np.exp(-t * (1.8 + h * 1.1))
    x += 0.2 * np.sin(2 * np.pi * freq * 2.005 * t) * np.exp(-t * 3)
    return x * np.minimum(1, t / 0.003) * 0.4


def supersaw(notes, dur, cutoff=3000, detune=0.22, voices=6):
    n = int(SR * dur)
    x = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for v in range(voices):
            d = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune
            x += saw(f * 2 ** (d / 12), n, rng.random())
    x /= (len(notes) * voices) ** 0.5 * 2.2
    x = lp(x, cutoff)
    t = np.arange(n) / SR
    a = np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.05)
    return x * np.clip(a, 0, 1)


def pad(notes, dur, cutoff=1400):
    n = int(SR * dur); t = np.arange(n) / SR
    x = supersaw(notes, dur, cutoff, 0.12, 5)
    a = np.minimum(1, t / 0.6) * np.clip((dur - t) / 0.8, 0, 1)
    return x * a


def bass_note(m, dur, cutoff=420):
    n = int(SR * dur); t = np.arange(n) / SR
    f = mtof(m)
    x = saw(f, n) * 0.6 + np.sin(2 * np.pi * f / 2 * t) * 0.9
    x = lp(x, cutoff)
    return np.tanh(x * 1.4) * np.minimum(1, t / 0.005) * np.clip((dur - t) / 0.02, 0, 1)


def scratch(dur, amp=0.35):
    """Pencil on paper."""
    n = int(SR * dur); t = np.arange(n) / SR
    x = bp(noise(n), 1800, 7000)
    mod = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * (7 + 4 * np.sin(t * 3)) * t)) + 0.3 * rng.random(n) * 0
    e = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.05)
    return x * mod * np.clip(e, 0, 1) * amp


def thud():
    n = int(SR * 0.5); t = np.arange(n) / SR
    f = 70 + 90 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    wood = bp(noise(n), 200, 1400) * np.exp(-t / 0.03) * 0.7
    return np.tanh((body + wood) * 1.5)


def tape_rewind(dur):
    n = int(SR * dur); t = np.arange(n) / SR
    u = t / dur
    sp = np.sin(np.pi * u) ** 0.6
    f = 300 + 2600 * sp
    chirp = np.sin(2 * np.pi * np.cumsum(f + 200 * np.sin(2 * np.pi * 31 * t)) / SR) * 0.18
    hiss = bp(noise(n), 2000, 9000) * 0.25
    flutter = 0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)
    return (chirp + hiss) * flutter * np.clip(sp * 1.5, 0, 1)


def shutter():
    n = int(SR * 0.08); t = np.arange(n) / SR
    a = hp(noise(n), 2500) * np.exp(-t / 0.006)
    b = np.concatenate([np.zeros(int(SR * 0.03)), hp(noise(n), 1800)[: n - int(SR * 0.03)] * np.exp(-t[: n - int(SR * 0.03)] / 0.01)])
    return (a + b * 0.8) * 0.8


def chime(freq, dur=2.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * dcy) for r, a, dcy in [(1, 1, 1.4), (2.76, 0.4, 3), (5.4, 0.2, 5), (8.9, 0.1, 8)])
    return x * np.minimum(1, t / 0.002) * 0.25


# ---------------------------------------------------------------- arrangement helpers
B = 0.5
PROG_A = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]  # Am F C G
PROG_B = [(48, [48, 52, 55]), (55, [55, 59, 62]), (57, [57, 60, 64]), (53, [53, 57, 60])]  # C G Am F


def kicks(t0, t1, step=B, strength=1.0, gain=0.9):
    t = t0
    while t < t1 - 1e-6:
        add(kick(strength), t, gain)
        i = at(t); n = int(SR * 0.28)
        u = np.arange(n) / n
        DUCK[i:i + n] = np.minimum(DUCK[i:i + n], 0.25 + 0.75 * u ** 0.7)
        t += step


def drums(t0, t1, claps=True, hats16=True, open_hats=True, gain=1.0):
    kicks(t0, t1, gain=0.9 * gain)
    t = t0
    k = 0
    while t < t1 - 1e-6:
        if claps and k % 2 == 1:
            add(clap(), t, 0.55 * gain, rev=0.25)
        if open_hats:
            add(hat(True), t + B / 2, 0.22 * gain, pan=0.2)
        if hats16:
            for s in (0.125, 0.375):
                add(hat(False), t + s, 0.18 * gain, pan=-0.25 + rng.random() * 0.1)
        t += B; k += 1


def bassline(t0, t1, prog, gain=0.5, cutoff=420, pattern='8th'):
    t = t0; bar = 0
    while t < t1 - 1e-6:
        root = prog[bar % 4][0] - 24
        step = B / 2 if pattern == '8th' else B
        for s in np.arange(0, 2.0, step):
            if t + s >= t1:
                break
            m = root + (12 if pattern == '8th' and int(s / step) % 4 == 3 else 0)
            add(bass_note(m, step * 0.92, cutoff), t + s, gain, duck=True)
        t += 2.0; bar += 1


def chords(t0, t1, prog, gain=0.35, cutoff=3200, fn=None):
    t = t0; bar = 0
    while t < t1 - 1e-6:
        notes = prog[bar % 4][1]
        d = min(2.0, t1 - t)
        x = supersaw([m + 12 for m in notes] + [notes[0]], d, cutoff) if fn is None else fn(notes, d)
        add(x, t, gain, rev=0.3, duck=True)
        t += 2.0; bar += 1


def arp(t0, t1, prog, gain=0.2, step=B / 2, octave=12, bright=1.0, rev=0.4):
    t = t0; bar = 0
    pat = [0, 1, 2, 1, 2, 0, 1, 2]
    while t < t1 - 1e-6:
        notes = prog[bar % 4][1]
        for i, s in enumerate(np.arange(0, 2.0, step)):
            if t + s >= t1:
                break
            m = notes[pat[i % len(pat)]] + octave + (12 if i % 8 == 6 else 0)
            add(pluck(mtof(m), 1.2, bright), t + s, gain, pan=0.3 * np.sin(i), rev=rev)
        t += 2.0; bar += 1


def type_times(a, b, n):
    return [a + (k / n) * (b - a) for k in range(1, n + 1)]


# ================================================================ SCORE
# ---- 0–4 · cold open: drone + keys
d = pad([33, 40, 45], 4.2, 600); add(d, 0.0, 0.35, rev=0.3)
air = lp(noise(int(SR * 4)), 900) * np.linspace(0, 1, int(SR * 4)) ** 2 * 0.05
add(air, 0.0, 1.0)
for tt in type_times(0.35, 1.5, 11) + type_times(1.75, 2.9, 10):
    add(key_click(), tt, 0.5, pan=rng.random() * 0.4 - 0.2)
add(reverse_swell(0.5), 3.5, 0.6)
add(whoosh(0.5, 300, 5000, 0.9), 3.55, 0.35)

# ---- 4–20 · the sketch era: warm plucked arpeggios, pencil, bricks
add(sub_boom(1.5, 60, 40), 4.0, 0.35)
arp(4.0, 16.0, PROG_A, gain=0.16, step=B, octave=0, bright=0.6, rev=0.55)
chords(8.0, 16.0, PROG_A, gain=0.16, fn=lambda n, d: pad(n, d, 900))
for a, b in [(4.05, 5.6), (5.2, 6.0), (6.8, 7.8), (7.0, 8.0), (14.3, 15.1), (15.0, 15.9)]:
    add(scratch(b - a), a, 0.28, pan=rng.random() - 0.5)
for i in range(6):
    t0 = 8 + i
    add(scratch(0.3, 0.2), t0, 1.0)
    add(thud(), t0 + 0.16, 0.8)
    add(thud()[: int(SR * 0.2)] * 0.3, t0 + 0.31, 0.5)
kicks(8.0, 14.0, B * 2, 0.7, 0.45)
kicks(14.0, 16.0, B, 0.8, 0.55)
for k in range(8):
    add(hat(False), 12.0 + k * 0.5 + 0.25, 0.1)
add(whoosh(0.7, 200, 3000, 0.6), 13.9, 0.5)
# 16–19.5 · the AI moment: build
add(riser(3.5, 150, 1800), 16.0, 0.55)
build = supersaw([57, 60, 64, 69], 3.5, 3000)
build = sweep_lp(build, 250, 6000)
add(build, 16.0, 0.22, rev=0.3)
add(click(4000, 0.015, 0.6), 16.5, 0.6)
add(blip(1320, 0.12, 0.4), 17.05, 0.5)
for tt in type_times(17.45, 18.25, 6):
    add(key_click(), tt, 0.55)
t = 17.0
while t < 19.0:
    step = B / 4 if t < 18.0 else B / 8
    add(snare(), t, 0.18 + 0.25 * (t - 17) / 2)
    t += step
add(click(2500, 0.03, 1.0), 19.0, 0.9)
add(kick(0.6), 19.0, 0.4)
add(reverse_swell(0.5), 19.0, 0.8)
add(blip(220, 0.25, 0.3), 19.55, 0.4, rev=0.5)

# ---- 20–38 · the AI big bang
add(impact(1.2), 20.0, 1.0, rev=0.4)
glitch = hp(noise(int(SR * 0.6)), 400) * (np.sin(2 * np.pi * 60 * np.arange(int(SR * 0.6)) / SR) > 0) * np.linspace(1, 0, int(SR * 0.6))
add(glitch, 20.1, 0.18)
drums(20.0, 33.0)
bassline(20.0, 33.0, PROG_A, 0.5)
chords(20.0, 33.0, PROG_A, 0.28)
add(riser(0.8, 400, 3000), 21.2, 0.4)
for i in range(8):
    add(whoosh(0.25, 800, 9000, 0.3)[::-1], 22.0 + i * 0.5 - 0.12, 0.25)
    add(sub_boom(0.6, 90, 40), 22.0 + i * 0.5, 0.45)
    add(crash(0.5), 22.0 + i * 0.5, 0.25)
penta = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91]
for k in range(32):
    add(blip(mtof(penta[k % 10] + 12 * (k // 10) - 12), 0.07, 0.25), 26.0 + k * 0.036, 0.35, pan=np.sin(k))
add(riser(0.75, 300, 4000), 27.25, 0.6)
add(impact(0.9), 28.0, 0.8, rev=0.35)
for k in range(24):
    u = k / 24
    add(blip(1800 + 400 * u, 0.03, 0.3), 28.05 + (1.25 * (1 - (1 - u) ** 2.5)), 0.25)
for tt in type_times(31.05, 31.7, 21) + type_times(31.7, 32.15, 14):
    add(key_click(), tt, 0.35)
add(sub_boom(1.2, 80, 36), 33.0, 0.6)
add(crash(1.5), 33.0, 0.35)
add(pad([45, 52, 57, 60], 1.0, 1400), 33.0, 0.35, rev=0.5)
add(tape_rewind(1.0), 34.0, 0.7)
add(whoosh(0.45, 400, 8000, 0.9), 35.0, 0.45)
add(pluck(mtof(69), 1.5, 0.6), 35.45, 0.35, rev=0.6)
add(pluck(mtof(76), 1.5, 0.6), 35.45, 0.2, rev=0.6)
for i, tt in enumerate([36.0, 36.5, 37.0]):
    add(impact(0.9 + i * 0.1), tt, 0.75, rev=0.3)
    stab = supersaw([[57, 64, 69], [53, 60, 65], [60, 64, 72]][i], 0.45, 4000)
    add(stab, tt, 0.35, rev=0.4)
add(sub_boom(1.0, 70, 35), 37.5, 0.5)
add(chime(mtof(81)), 37.5, 0.3, rev=0.6)
add(whoosh(0.35, 500, 9000, 0.9), 37.65, 0.4)

# ---- 38–62 · us
add(impact(0.7), 38.0, 0.55, rev=0.5)
arp(38.0, 41.0, PROG_B, gain=0.18, step=B / 2, octave=12, bright=0.8)
chords(38.0, 41.0, PROG_B, gain=0.18, fn=lambda n, d: pad(n, d, 1600))
kicks(38.0, 41.0, B * 2, 0.8, 0.55)
for tt in [39.0, 40.0]:
    add(snare(), tt, 0.35, rev=0.3)
for k in range(11):
    add(blip(mtof(76 + [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24][k]), 0.06, 0.25), 39.6 + k * 0.05, 0.3)
add(whoosh(0.45, 200, 5000, 0.95), 40.55, 0.5)
drums(41.0, 55.0)
bassline(41.0, 55.0, PROG_B, 0.48)
chords(41.0, 55.0, PROG_B, 0.2, cutoff=2600)
arp(41.0, 55.0, PROG_B, gain=0.1, step=B / 2, octave=24, bright=1.0, rev=0.3)
for i in range(4):
    add(shutter(), 41.0 + i * 0.5, 0.7)
for i in range(7):
    add(shutter(), 43.0 + i * 0.25, 0.6)
    add(snare(), 43.0 + i * 0.25, 0.25)
add(impact(0.6), 44.75, 0.5, rev=0.3)
add(shutter(), 44.75, 0.9)
for k in range(12):
    add(blip(mtof(84 + [0, 2, 4, 7, 9, 12][k % 6]), 0.05, 0.2), 44.85 + k * 0.05, 0.3)
for k in range(20):
    u = k / 20
    add(blip(1400 + 900 * u, 0.03, 0.25), 47.05 + 1.15 * (1 - (1 - u) ** 2.5), 0.2)
add(whoosh(0.6, 300, 6000, 0.8), 48.4, 0.35)
for i in range(4):
    add(whoosh(0.3, 800, 7000, 0.5), 48.75 + i * 0.12 - 0.1, 0.18)
add(sub_boom(0.8, 80, 40), 51.0, 0.4)
add(sub_boom(0.8, 80, 40), 51.55, 0.4)
add(whoosh(0.5, 300, 5000, 0.8), 52.0, 0.35)
for i in range(4):
    add(blip(mtof(79 + i * 3), 0.06, 0.25), 52.2 + i * 0.1, 0.3)
# principles: a hit per second, energy climbing
drums(55.0, 61.0, gain=1.05)
bassline(55.0, 61.0, PROG_A, 0.5, cutoff=600)
ss = supersaw([69, 72, 76, 81], 6.0, 3000)
add(sweep_lp(ss, 900, 9000), 55.0, 0.2, rev=0.3, duck=True)
for i in range(6):
    tt = 55.0 + i
    add(crash(1.0), tt, 0.3)
    add(sub_boom(0.7, 90, 40), tt, 0.4)
    add(whoosh(0.4, 600, 8000, 0.3)[::-1], tt - 0.1, 0.25)
t = 60.0
while t < 61.0:
    add(snare(), t, 0.2 + 0.3 * (t - 60))
    t += B / 4
add(reverse_swell(0.85), 61.0, 0.7)
add(riser(0.85, 300, 3000), 61.0, 0.4)

# ---- 62–80 · ascension
add(sub_boom(3.0, 55, 30), 62.0, 0.6)
add(chime(mtof(88), 3.0), 62.0, 0.35, rev=0.7)
for k in range(11):
    add(chime(mtof([69, 72, 76, 79, 81, 84, 88, 91, 93, 96, 100][k]), 1.5), 62.05 + k * 0.07, 0.12, pan=np.sin(k * 1.7), rev=0.6)
arp(62.0, 66.0, PROG_A, gain=0.2, step=B / 2, octave=0, bright=0.5, rev=0.7)
chords(62.0, 72.0, PROG_A, gain=0.2, fn=lambda n, d: pad([m - 12 for m in n] + [n[0] + 12], d, 1300))
for i, tt in enumerate([62.9, 63.85, 64.8]):
    add(chime(mtof([76, 79, 84][i]), 1.6), tt, 0.25, rev=0.6)
kicks(66.0, 68.0, B, 0.9, 0.55)
kicks(68.0, 70.0, B / 2, 0.9, 0.5)
kicks(70.0, 71.0, B / 4, 0.8, 0.45)
add(sub_boom(1.0, 80, 40), 66.2, 0.45)
add(crash(1.2), 68.4, 0.35)
add(crash(1.2), 69.85, 0.4)
bassline(68.0, 71.0, PROG_A, 0.4, pattern='8th')
add(riser(3.4, 200, 3000), 68.5, 0.6)
t = 70.0
while t < 71.8:
    add(snare(), t, 0.2 + 0.25 * (t - 70) / 1.8)
    t += B / 4 if t < 71 else B / 8
add(reverse_swell(0.9), 71.0, 0.9)
# 73.3–74.8 · the thesis
add(whoosh(0.45, 300, 4000, 0.6), 73.28, 0.35)
add(sub_boom(1.2, 70, 36), 73.3, 0.5)
add(chime(mtof(93), 2.2), 73.35, 0.3, rev=0.6)
add(reverse_swell(0.7), 74.15, 0.8)
# 74.8 · the mark
add(impact(1.3), 74.8, 1.0, rev=0.5)
for i, f in enumerate([81, 88, 93, 100]):
    add(chime(mtof(f), 2.5), 74.9 + i * 0.12, 0.25, rev=0.6)
drums(72.0, 76.0)
bassline(72.0, 76.0, PROG_A, 0.5)
chords(72.0, 76.0, PROG_A, 0.3, cutoff=5000)
arp(72.0, 76.0, PROG_A, gain=0.12, step=B / 2, octave=24, bright=1.0, rev=0.4)
for k in range(11):
    add(blip(mtof(84 + [0, 3, 7, 10, 12, 15, 19, 22, 24, 27, 31][k]), 0.05, 0.2), 75.2 + k * 0.045, 0.25)
# 76 · the invitation: everything drops out to one chord and a keyboard
add(impact(0.8), 76.0, 0.7, rev=0.6)
add(pad([45, 52, 57, 60, 64, 69], 4.0, 2200), 76.0, 0.4, rev=0.6)
add(pluck(mtof(69), 3.0, 0.6), 76.3, 0.35, rev=0.7)
add(pluck(mtof(76), 3.0, 0.6), 76.55, 0.25, rev=0.7)
add(pluck(mtof(81), 3.0, 0.6), 76.8, 0.2, rev=0.7)
cmd = '> join Protocom --as @你'
for tt in type_times(77.0, 77.9, len(cmd)):
    add(key_click(), tt, 0.45)
add(key_click(), 78.2, 0.6)
add(sub_boom(1.6, 50, 30), 78.2, 0.3)

# ---------------------------------------------------------------- reverb + master
ir_n = int(SR * 2.6)
ir_t = np.arange(ir_n) / SR
irL = lp(noise(ir_n), 6000) * np.exp(-ir_t / 0.55)
irR = lp(noise(ir_n), 6000) * np.exp(-ir_t / 0.55)
irL /= np.abs(irL).sum() ** 0.5 * 18; irR /= np.abs(irR).sum() ** 0.5 * 18
wetL = signal.fftconvolve(RL, irL)[:N]; wetR = signal.fftconvolve(RR, irR)[:N]
mixL = L + wetL * 0.9; mixR = R + wetR * 0.9
mixL = hp(mixL, 28); mixR = hp(mixR, 28)
# gentle glue: soft clip then normalise
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
mixL /= peak / 1.6; mixR /= peak / 1.6
mixL = np.tanh(mixL) ; mixR = np.tanh(mixR)
# master fades
fi = int(SR * 0.05); mixL[:fi] *= np.linspace(0, 1, fi); mixR[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 1.6); mixL[-fo:] *= np.linspace(1, 0, fo) ** 1.5; mixR[-fo:] *= np.linspace(1, 0, fo) ** 1.5
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
mixL *= 0.93 / peak; mixR *= 0.93 / peak

out = sys.argv[1] if len(sys.argv) > 1 else 'music.wav'
st = np.stack([mixL, mixR], 1)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote', out, f'{DUR:.1f}s')
