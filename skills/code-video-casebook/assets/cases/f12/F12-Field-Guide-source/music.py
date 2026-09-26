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
