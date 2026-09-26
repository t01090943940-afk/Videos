# Synthesized score + SFX for 嘟嘟追风筝 (150 BPM, 30 s)
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
DUR = 30.0
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)
BEAT = 0.4
S16 = 0.1


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(d * SR)) / SR


def add(t0, sig, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0:
        return
    j = min(N, i + len(sig))
    seg = sig[: j - i] * g
    L[i:j] += seg * np.sqrt((1 - pan) / 2) * 1.414
    R[i:j] += seg * np.sqrt((1 + pan) / 2) * 1.414


def lp(x, fc, order=2):
    b, a = butter(order, min(fc / (SR / 2), 0.99), "low")
    return lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high")
    return lfilter(b, a, x)


def bp(x, f1, f2):
    b, a = butter(2, [f1 / (SR / 2), min(f2 / (SR / 2), 0.99)], "band")
    return lfilter(b, a, x)


def adsr(n, a=0.005, r=0.03):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def square(f, d, harm=12, vib=0.0):
    t = tt(d)
    ph = 2 * np.pi * f * t + (vib * np.sin(2 * np.pi * 5.5 * t) * np.clip(t * 4 - 0.4, 0, 1))
    s = np.zeros_like(t)
    for k in range(1, harm * 2, 2):
        if k * f > 12000:
            break
        s += np.sin(k * ph) / k
    return s * 0.8


def saw(f, d, detune=0.0):
    t = tt(d)
    s = np.zeros_like(t)
    for k in range(1, 40):
        if k * f > 10000:
            break
        s += np.sin(2 * np.pi * k * f * (1 + detune) * t) * ((-1) ** (k + 1)) / k
    return s * 0.6


def tri(f, d):
    t = tt(d)
    return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t))


def bell(f, d=1.2):
    t = tt(d)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
            + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 10)) * np.exp(-t * 3.5)


# ---------- drums ----------
def kick(g=1.0):
    t = tt(0.35)
    f = 48 + 110 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 8.5)
    s[:60] += rng.standard_normal(60) * 0.3
    return s * g


def snare(g=1.0):
    t = tt(0.25)
    n = hp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 17)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)
    return (n * 0.55 + tone * 0.45) * g


def hat(g=1.0, d=0.05):
    t = tt(d)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * 70) * g


def crash(g=1.0):
    t = tt(2.2)
    return hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 2.2) * g


# ---------- sfx ----------
def pop():
    t = tt(0.08)
    f = 500 + 1100 * t / 0.08
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35)


def whoosh(d, up=True, f0=300, f1=4000):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 40
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        q = c / chunks
        fc = f0 * (f1 / f0) ** (q if up else 1 - q)
        out[a:b] = bp(x[max(0, a - 2000):b], fc * 0.6, fc * 1.6)[-(b - a):]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return out * e * 2.5


def snap():
    t = tt(0.3)
    s = rng.standard_normal(len(t)) * np.exp(-t * 90)
    s += np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 60) * 0.6
    s += np.sin(2 * np.pi * 90 * t) * np.exp(-t * 20) * 0.8
    return s


def boing(d=0.7, f0=160, f1=520):
    t = tt(d)
    f = f0 + (f1 - f0) * (t / d) ** 0.6
    f = f * (1 + 0.18 * np.sin(2 * np.pi * 16 * t) * np.exp(-t * 3))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.exp(-t * 2.5) * adsr(len(t), 0.005, 0.1)


def jump(d=0.18, f0=350, f1=1100):
    t = tt(d)
    f = f0 + (f1 - f0) * t / d
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * 0.5
    return lp(s, 5000) * adsr(len(t), 0.003, 0.04)


def thud():
    t = tt(0.25)
    return (np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 14)
            + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 25) * 0.6)


def womp(f0=330, f1=240, d=0.38):
    t = tt(d)
    f = f0 + (f1 - f0) * np.clip(t / (d * 0.6), 0, 1)
    f = f * (1 + 0.03 * np.sin(2 * np.pi * 7 * t) * (t > d * 0.5))
    ph = np.cumsum(f) / SR
    s = np.zeros_like(t)
    for k in range(1, 15):
        s += np.sin(2 * np.pi * k * ph) / k
    return lp(s, 1400) * adsr(len(t), 0.02, 0.08)


def slide(f0=1000, f1=180, d=0.4):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * adsr(len(t), 0.005, 0.05) * np.exp(-t * 2)


def stab(notes, d=0.7):
    t = tt(d)
    s = np.zeros_like(t)
    for m in notes:
        s += saw(mtof(m), d, 0.003) + saw(mtof(m), d, -0.003)
    s = lp(s, 3500) * np.exp(-t * 5) * adsr(len(t), 0.003, 0.05)
    s += hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 18) * 0.5
    return s / len(notes)


def sparkle_arp(t0, notes=(84, 88, 91, 96, 100), sp=0.045, g=0.18):
    for i, m in enumerate(notes):
        add(t0 + i * sp, bell(mtof(m), 0.9), g, pan=-0.5 + i * 0.25)


def riser(d, g=1.0):
    t = tt(d)
    f = 200 * (8 ** (t / d))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return (s + whoosh(d, True, 400, 6000) * 0.5) * (t / d) ** 1.5 * g


# ---------- music ----------
PROG = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
MEL = [
    [(76, 1), (79, 1), (84, 2), (83, 1), (84, 1), (79, 2)],
    [(74, 1), (79, 1), (83, 2), (81, 1), (79, 1), (74, 2)],
    [(76, 1), (81, 1), (84, 2), (83, 1), (81, 1), (76, 2)],
    [(77, 1), (76, 1), (74, 1), (72, 1), (74, 2), (79, 2)],
]
BAR = 1.6


def chord_at(t):
    return PROG[int(t / BAR) % 4]


def in_any(t, spans):
    return any(a <= t < b for a, b in spans)


GROOVE = [(2.8, 7.6), (10.0, 18.0), (21.2, 25.2)]
SOFT = [(25.2, 28.4)]
SILENT = [(7.6, 8.2)]

# drums & bass on 16th grid
for step in range(int(DUR / S16)):
    t = step * S16
    s16 = step % 4
    beat = step // 4
    if in_any(t, SILENT) or t >= 28.4:
        continue
    root, ch = chord_at(t)
    groove = in_any(t, GROOVE)
    soft = in_any(t, SOFT)
    if groove or soft or (1.6 <= t < 2.8):
        if s16 == 0:
            add(t, kick(0.95 if groove else 0.7))
        if groove and 10.0 <= t < 18.0 and s16 == 2 and beat % 4 == 3:
            add(t, kick(0.6))
    if groove and s16 == 0 and beat % 2 == 1:
        add(t, snare(0.55), pan=0.1)
    if groove or soft:
        chase = 10.0 <= t < 18.0 or 21.2 <= t < 25.2
        if chase or s16 % 2 == 0:
            add(t, hat(0.22 if s16 % 2 == 0 else 0.13), pan=0.35)
    # bass
    if (groove or soft) and s16 % 2 == 0:
        m = root + (12 if s16 == 2 else 0)
        d = 0.19
        tb = tt(d)
        b = lp(saw(mtof(m), d) + 0.5 * np.sin(2 * np.pi * mtof(m) * tb), 900) * np.exp(-tb * 5) * adsr(len(tb), 0.003, 0.02)
        add(t, b, 0.42 if groove else 0.3)
    # arps (intro, groove, sunset)
    if (t < 2.8 or groove or soft or 18.0 <= t < 21.2):
        m = ch[(step) % 3] + (12 if (step // 3) % 2 else 0) + 12
        if 18.0 <= t < 21.2:
            if s16 != 0:
                continue
            m = [69, 72, 76, 72][beat % 4] if int(t / BAR) % 2 == 1 else [65, 69, 72, 69][beat % 4]
        d = 0.16
        a = tri(mtof(m), d) * np.exp(-tt(d) * 14)
        add(t, a, 0.07 if not 18.0 <= t < 21.2 else 0.12, pan=0.4 * np.sin(step * 0.7))

# lead melody
LEAD = [(2.8, 7.6, 0), (10.0, 17.6, 0), (21.2, 25.2, 12), (25.2, 28.4, 12)]
for a, b, tr in LEAD:
    t = np.floor(a / BAR + 1e-6) * BAR
    while t < b:
        bi = int(round(t / BAR)) % 4
        tp = t
        for m, ln in MEL[bi]:
            d = ln * 0.2
            if tp >= a and tp + d <= b + 0.01:
                soft = tp >= 25.2
                if soft:
                    s = bell(mtof(m + tr - 12), d + 0.6) * 0.9
                    add(tp, s, 0.16, pan=-0.2)
                else:
                    s = square(mtof(m + tr - (12 if tr else 0)), d * 0.92, vib=0.25 if ln > 1 else 0) * adsr(int(d * 0.92 * SR), 0.004, 0.03)
                    s = lp(s, 4500)
                    add(tp, s, 0.12, pan=-0.15)
                    add(tp + 0.3, s, 0.04, pan=0.6)  # echo
            tp += d
        t += BAR

# pads in breakdown + sunset
for (a, b, g) in [(18.0, 20.4, 0.05), (25.2, 28.4, 0.035)]:
    t = int(a / BAR) * BAR
    while t < b:
        root, ch = chord_at(t)
        s0, s1 = max(t, a), min(t + BAR, b)
        d = s1 - s0
        if d > 0.05:
            pad = np.zeros(int(d * SR))
            for m in ch:
                pad += saw(mtof(m), d, 0.004) + saw(mtof(m), d, -0.004)
            pad = lp(pad, 1300) * adsr(len(pad), 0.25, 0.3)
            add(s0, pad, g)
        t += BAR

# tense section 8.2-9.3
for i, tb in enumerate(np.arange(8.2, 9.3, 0.2)):
    tb2 = tt(0.18)
    add(tb, lp(saw(mtof(33), 0.18), 500) * np.exp(-tb2 * 8), 0.5)
add(8.4, womp(330, 250), 0.35)
add(8.8, womp(300, 200, 0.5), 0.35)

# ---------- SFX timeline ----------
for i in range(5):
    add(0.2 + i * 0.12, pop(), 0.35, pan=-0.6 + i * 0.3)
add(0.0, riser(1.2), 0.35)
add(1.25, boing(0.45, 220, 500), 0.25)
add(1.5, whoosh(0.5), 0.3)
add(2.5, whoosh(0.6, True, 300, 5000), 0.45)     # wipe
add(2.8, crash(0.3))
add(3.3, pop(), 0.3)
add(6.1, whoosh(1.5, True, 200, 2500), 0.7)       # gust
add(7.6, snap(), 0.9)
add(7.6, crash(0.55))
add(7.6, stab([48, 55, 60, 63]), 0.5)
add(8.45, pop(), 0.3)
add(9.3, stab([48, 60, 64, 67, 72]), 0.7)
add(9.3, crash(0.4))
for k in range(12):
    tk = 9.4 + k * 0.05
    add(tk, snare(0.15 + k * 0.03), pan=0.1)
add(9.6, riser(0.45), 0.4)
add(9.7, whoosh(0.6, True, 300, 5000), 0.5)       # wipe
add(10.0, crash(0.45))
add(11.45, whoosh(0.6, True, 500, 3000), 0.35)    # board rolls in
add(11.85, jump(), 0.2)
add(12.2, thud(), 0.5)
add(12.2, whoosh(0.7, False, 600, 4000), 0.35)
for (s, d, h, f) in [(13.0, 0.6, 150, 0), (14.6, 0.6, 170, 0), (15.9, 1.1, 290, 1)]:
    add(s, jump(0.22 if not f else 0.45, 350, 1200 if not f else 1600), 0.2)
for tl in (13.6, 15.2, 17.0):
    add(tl, thud(), 0.55)
add(15.9, whoosh(1.0), 0.35)
add(16.2, pop(), 0.3)
sparkle_arp(16.3, g=0.12)
add(17.55, slide(900, 150, 0.45), 0.25)
add(18.0, slide(200, 900, 0.4), 0.2)
add(19.75, womp(262, 196, 0.6), 0.3)
add(20.4, bell(mtof(96), 1.2), 0.3)
add(20.4, bell(mtof(100), 1.2), 0.2)
for k in range(16):
    tk = 20.4 + k * 0.05
    add(tk, snare(0.1 + k * 0.025), pan=0.1)
for k in range(4):
    add(20.4 + k * 0.2, kick(0.6))
add(20.4, riser(0.8), 0.5)
add(21.2, crash(0.45))
add(21.2, jump(0.3, 300, 900), 0.2)
add(22.02, boing(0.8, 140, 600), 0.6)
add(22.1, whoosh(1.4, True, 200, 6000), 0.6)
add(22.1, riser(1.45), 0.4)
add(23.6, crash(0.6))
add(23.6, stab([60, 64, 67, 72, 76]), 0.6)
sparkle_arp(23.62, g=0.2)
add(23.65, pop(), 0.3)
add(25.1, whoosh(0.5), 0.35)
add(25.2, crash(0.35))
sparkle_arp(25.25, (96, 91, 88, 84, 79), g=0.12)
for i in range(5):
    add(26.3 + i * 0.3, bell(mtof(88 + [0, 3, 7, 12, 7][i]), 0.5), 0.08, pan=0.3)
add(27.95, slide(300, 1000, 0.45), 0.15)
add(28.4, stab([48, 55, 60, 64, 67, 72]), 0.8)
add(28.4, crash(0.5))
add(28.4, kick(1.0))
sparkle_arp(28.95, (84, 88, 91, 96, 100, 103), g=0.2)
add(28.95, pop(), 0.35)
add(29.05, pop(), 0.3)
t = tt(1.5)
final = np.zeros(len(t))
for m in (60, 64, 67, 72):
    final += bell(mtof(m + 12), 1.5)
add(28.45, final, 0.12)

# ---------- master ----------
mix = np.stack([L, R], 1)
fade = np.ones(N)
nf = int(0.3 * SR)
fade[-nf:] = np.linspace(1, 0, nf)
mix *= fade[:, None]
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix /= np.max(np.abs(mix)) * 1.12
wavfile.write("audio.wav", SR, (mix * 32767).astype(np.int16))
print("ok", mix.shape)
