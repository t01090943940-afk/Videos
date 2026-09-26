#!/usr/bin/env python3
"""
Original score + sound for 月光替你亮着灯 — deterministic, sample-free, numpy/scipy only.
Every cue is read from out/meta.json (exported by the page from src/timeline.ts), so sound and
picture share one clock.

  python3 audio/score.py --meta out/meta.json --out out/audio [--lufs -16]

Stems (48 kHz float, stereo): music (pad, guzheng, xiao-like flute, bells, bass, hand drum),
sfx (pages, lanterns, stars, seal …), amb (night air + autumn crickets). mix.wav is mastered to
the target LUFS with a 4x-oversampled look-ahead limiter at −2.6 dBTP (headroom for the AAC encode).
"""
import argparse, json, math, os, subprocess, sys, importlib.util
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(915)

# the kit's DSP helpers (reverb, limiter, loudness measure, whoosh …), vendored unchanged in scripts/kit/
# (source-package change: this path used to be an absolute path to the unpacked stop-motion-3d kit)
KIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts", "kit", "audio.py")
spec = importlib.util.spec_from_file_location("kit_audio", KIT)
K = importlib.util.module_from_spec(spec)
spec.loader.exec_module(K)

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def m2f(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def n2m(name):
    """'E5' -> midi"""
    pitch, octv = name[:-1], int(name[-1])
    return 12 * (octv + 1) + NOTE[pitch]


def tax(d):
    return np.arange(int(round(d * SR))) / SR


def add2(buf, mono, t0, g=1.0, pan=0.0):
    K.add2(buf, mono, t0, g, pan)


def lp(x, f, o=2):
    return K.lp(x, f, o)


def hp(x, f, o=2):
    return K.hp(x, f, o)


def bp(x, lo, hi, o=2):
    return K.bp(x, lo, hi, o)


def env(n, a, d_hold, r):
    """attack / hold / release envelope over n samples"""
    t = np.arange(n) / SR
    dur = n / SR
    e = np.clip(t / max(a, 1e-4), 0, 1)
    e *= np.clip((dur - t) / max(r, 1e-4), 0, 1)
    return e


# ----------------------------------------------------------------------------- instruments
def zheng(f, dur=2.4, bend=0.0, bend_at=0.12, vib=0.0, bright=1.0):
    """guzheng-like pluck: additive partials with per-partial decay, pluck transient,
    optional press-bend (按音/推弦) and left-hand vibrato (吟揉)."""
    t = tax(dur)
    bcurve = bend * np.clip((t - bend_at) / 0.16, 0, 1) ** 1.5
    vcurve = vib * np.clip((t - 0.25) / 0.35, 0, 1) * np.sin(2 * np.pi * 5.6 * t)
    fi = f * (2 ** (bcurve / 12)) * (1 + vcurve)
    ph = 2 * np.pi * np.cumsum(fi) / SR
    y = np.zeros_like(t)
    for k in range(1, 11):
        if f * k > 15000:
            break
        a = (1.0 / k ** 0.85) * (1.0 if k < 4 else bright)
        tau = 1.9 / (1 + 0.55 * (k - 1)) * (220 / max(f, 110)) ** 0.25
        y += a * np.sin(k * ph * (1 + 0.00035 * k * k)) * np.exp(-t / tau)
    n = int(0.012 * SR)
    tr = bp(RNG.standard_normal(n), 1500, 7000) * np.exp(-np.arange(n) / (0.002 * SR)) * 0.35
    y[:n] += tr
    att = np.clip(t / 0.002, 0, 1)
    return y * att * 0.32


def xiao_line(phrases, total):
    """a breathing xiao/dizi-like line. phrases = [[(t0, dur, midi, tongued), ...], ...].
    Inside a phrase notes are slurred (45 ms glides) unless tongued; each phrase starts with a
    soft attack and ends with a breath. Long notes swell; vibrato arrives late in each note."""
    n = int(round(total * SR))
    freq = np.full(n, 440.0)
    amp = np.zeros(n)
    vibw = np.zeros(n)
    for ph in phrases:
        p0, p1 = ph[0][0], ph[-1][0] + ph[-1][1]
        for j, (t0, d, m, tongued) in enumerate(ph):
            i0, i1 = int(t0 * SR), min(n, int((t0 + d) * SR))
            L = i1 - i0
            if L <= 0:
                continue
            f = m2f(m)
            seg = np.full(L, f)
            if j > 0:
                pf = m2f(ph[j - 1][2])
                g = min(int((0.03 if tongued else 0.045) * SR), L)
                seg[:g] = pf * (f / pf) ** (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, g)))
            freq[i0:i1] = seg
            tt = np.arange(L) / SR
            a = np.ones(L)
            if d > 0.6:  # swell on long notes
                u = tt / d
                a *= 0.86 + 0.14 * np.sin(np.pi * np.clip(u * 1.15, 0, 1))
            if tongued and j > 0:
                a *= 1 - 0.6 * np.exp(-((tt - 0.012) / 0.014) ** 2)
            amp[i0:i1] = a
            vibw[i0:i1] = np.clip((tt - 0.3) / 0.45, 0, 1) * (1.0 if d > 0.5 else 0.3)
        # phrase envelope: soft attack, breath at the end
        i0, i1 = int(p0 * SR), min(n, int(p1 * SR))
        tt = np.arange(i1 - i0) / SR
        amp[i0:i1] *= np.clip(tt / 0.085, 0, 1) ** 1.5 * np.clip(((p1 - p0) - tt) / 0.2, 0, 1) ** 1.2
    t = np.arange(n) / SR
    fi = freq * (1 + 0.0062 * vibw * np.sin(2 * np.pi * 5.15 * t + 0.35 * np.sin(2 * np.pi * 0.6 * t)))
    phs = 2 * np.pi * np.cumsum(fi) / SR
    tone = np.sin(phs) + 0.3 * np.sin(2 * phs + 0.4) + 0.09 * np.sin(3 * phs + 1.1) + 0.03 * np.sin(4 * phs)
    ampl = lp(amp, 22)
    breath = bp(RNG.standard_normal(n), 900, 5200) * (0.05 + 0.1 * np.clip(np.gradient(ampl) * SR / 12, 0, 1))
    buzz = bp(np.sign(np.sin(phs)) * 0.5, 2500, 7000) * 0.018
    y = (tone * 0.55 + breath + buzz) * ampl
    return y * 0.5


def bell(f, dur=2.6, idx=1.6, dec=0.9):
    t = tax(dur)
    mod = idx * np.exp(-t / 0.45) * np.sin(2 * np.pi * f * 3.5 * t)
    y = np.sin(2 * np.pi * f * t + mod) * np.exp(-t / dec)
    y += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dec * 0.35))
    return y * np.clip(t / 0.0015, 0, 1) * 0.5


def pad(midis, dur, a=0.9, r=1.0, cut=1900, g=1.0):
    t = tax(dur)
    y = np.zeros_like(t)
    for m in midis:
        f = m2f(m)
        for det in (-0.09, 0.0, 0.1):
            ph0 = RNG.uniform(0, 6.28)
            for k in range(1, 7):
                if f * k > 9000:
                    break
                y += np.sin(2 * np.pi * f * k * (1 + det / 100) * t + ph0 * k) / (k ** 1.25)
    y = lp(y, cut)
    e = np.minimum(np.clip(t / a, 0, 1), np.clip((dur - t) / r, 0, 1)) ** 1.4
    return y * e * g / (len(midis) * 3.2)


def bass(f, dur):
    t = tax(dur)
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return y * np.clip(t / 0.04, 0, 1) * np.exp(-t / 1.6) * np.clip((dur - t) / 0.2, 0, 1) * 0.5


def hand_drum(low=True):
    t = tax(0.5)
    f = (95 if low else 170) + (70 if low else 120) * np.exp(-t / 0.035)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.16 if low else 0.08))
    n = int(0.03 * SR)
    y[:n] += bp(RNG.standard_normal(n), 400, 3500) * np.exp(-np.arange(n) / (0.006 * SR)) * 0.4
    return y * 0.7


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return hp(RNG.standard_normal(n), 5000) * np.exp(-((t - 0.02) / 0.018) ** 2) * 0.22


# ----------------------------------------------------------------------------- sfx
def page_flip(dur=0.45, g=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    am = np.clip(np.abs(lp(RNG.standard_normal(n), 35)) * 3.2, 0, 1.6)
    swell = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.7
    y = bp(RNG.standard_normal(n), 900, 7500) * am * swell * 0.55
    # the landing flap
    k = int(0.03 * SR)
    y[-k - int(0.05 * SR):-int(0.05 * SR)] += bp(RNG.standard_normal(k), 300, 2500) * np.exp(-np.arange(k) / (0.006 * SR)) * 0.5
    return y * g


def breeze(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = bp(RNG.standard_normal(n), 250, 2200) * (0.4 + 0.6 * np.abs(lp(RNG.standard_normal(n), 2.5)) * 4)
    return y * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5 * 0.35


def sparkle(base_m, n=4, spread=0.06, g=1.0):
    y = np.zeros(int(1.8 * SR))
    pent = [0, 2, 4, 7, 9, 12, 14, 16]
    for k in range(n):
        m = base_m + pent[int(RNG.integers(0, len(pent)))]
        K.add(y, bell(m2f(m), 1.4, 0.8, 0.45), k * spread + RNG.uniform(0, 0.02), 0.28)
    return y * g


def ignite():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    puff = lp(RNG.standard_normal(n), 900) * np.exp(-t / 0.09) * np.clip(t / 0.01, 0, 1)
    return puff * 0.5


def whoosh_air(dur, peak=0.55, lo=200, hi=3500, g=1.0):
    return K.whoosh(dur, peak, lo, hi) * g


def shimmer(dur, base=2600):
    t = tax(dur)
    y = np.zeros_like(t)
    for k, f in enumerate([base, base * 1.26, base * 1.5, base * 1.89, base * 2.25]):
        y += np.sin(2 * np.pi * f * t + k) * (0.5 + 0.5 * np.sin(2 * np.pi * (6 + k * 1.3) * t + k))
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.2
    return y * e * 0.05


def stamp():
    """the seal: a padded wooden thump + a tiny bright tick + paper"""
    t = tax(0.6)
    f = 70 + 90 * np.exp(-t / 0.02)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    n = int(0.02 * SR)
    knock = np.zeros_like(t)
    knock[:n] = bp(RNG.standard_normal(n), 800, 5000) * np.exp(-np.arange(n) / (0.004 * SR))
    return body * 0.9 + knock * 0.5


def pen_scratch(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    strokes = (0.5 + 0.5 * np.sin(2 * np.pi * 7.3 * t + 2 * np.sin(2 * np.pi * 1.1 * t))) ** 3
    y = bp(RNG.standard_normal(n), 2500, 9000) * strokes * 0.12
    return y


def crickets(dur):
    """two autumn crickets, far and near"""
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for (fc, rate, pan, g) in [(4350, 0.83, -0.55, 0.05), (5100, 1.27, 0.6, 0.032), (3900, 1.9, 0.1, 0.02)]:
        t = 0.2 + RNG.uniform(0, 0.4)
        while t < dur - 0.3:
            ch = np.zeros(int(0.2 * SR))
            for p in range(3):
                seg = tax(0.018)
                tone = np.sin(2 * np.pi * fc * seg) * np.sin(np.pi * seg / 0.018)
                K.add(ch, tone, p * 0.034)
            add2(out, ch, t, g, pan)
            t += rate * RNG.uniform(0.8, 1.25)
    return out


def night_air(dur):
    n = int(dur * SR)
    b = np.cumsum(RNG.standard_normal(n)) / 600
    b = hp(b, 30)
    b = lp(b, 420)
    b = b / (np.std(b) + 1e-9) * 0.018
    air = bp(RNG.standard_normal(n), 400, 2500) * (0.006 + 0.006 * np.abs(lp(RNG.standard_normal(n), 0.4)) * 6)
    return b + air


# ----------------------------------------------------------------------------- master EQ (RBJ biquads)
def _biquad(kind, f0, gain_db=0.0, q=0.707):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / (2 * q)
    if kind == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]
        a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == "lowshelf":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + sq), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sq)]
        a = [(A + 1) + (A - 1) * cw + sq, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sq]
    elif kind == "highshelf":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + sq), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - sq)]
        a = [(A + 1) - (A - 1) * cw + sq, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - sq]
    return np.array(b) / a[0], np.array(a) / a[0]


def master_eq(x2):
    """phones first: trim sub-bass, lift presence so the melody and bells carry on small speakers"""
    y = K.hp(x2.T, 45, 2).T if False else np.stack([K.hp(x2[:, c], 45) for c in range(2)], 1)
    for kind, f0, g, q in [("lowshelf", 160, -2.0, 0.7), ("peak", 420, -1.5, 0.9), ("peak", 2900, 3.0, 0.8), ("highshelf", 6500, 2.5, 0.7)]:
        b, a = _biquad(kind, f0, g, q)
        y = signal.lfilter(b, a, y, axis=0)
    return y


# ----------------------------------------------------------------------------- score
PROG = [  # (bar index 0-based, chord pitch classes for pad/guzheng, bass root midi)
    ("C", [48, 55, 60, 62, 64], 36),        # bar 1  Cadd9
    ("Am7", [45, 52, 57, 60, 64, 67], 45),   # bar 2
    ("Fmaj7", [41, 48, 53, 57, 60, 64], 41), # bar 3
    ("Gsus2", [43, 50, 55, 57, 62], 43),     # bar 4
    ("Em7", [40, 47, 52, 55, 59, 62], 40),   # bar 5
    ("Am7", [45, 52, 57, 60, 64, 67], 45),   # bar 6
    ("Fmaj7", [41, 48, 53, 57, 60, 64], 41), # bar 7
    ("G", [43, 50, 55, 59, 62, 67], 43),     # bar 8
    ("Cadd9", [36, 48, 55, 60, 62, 64, 67], 36),  # bar 9
]
# zheng arpeggio voicings (pentatonic-friendly)
ARP = {
    "C": [48, 55, 60, 62, 64, 67, 64, 62],
    "Am7": [45, 52, 57, 60, 64, 67, 64, 60],
    "Fmaj7": [41, 48, 53, 57, 60, 64, 60, 57],
    "Gsus2": [43, 50, 55, 57, 62, 67, 62, 57],
    "Em7": [40, 47, 52, 55, 59, 62, 59, 55],
    "G": [43, 50, 55, 62, 67, 69, 67, 62],
    "Cadd9": [48, 55, 60, 64, 67, 72, 74, 76],
}
# melody (bar, beat, dur-beats, note[, "t" = tongued]); a new phrase starts at each "|" bar
PHRASE_STARTS = {2, 4, 6, 8, 9}
MEL = [
    (2, 0, 1, "A4"), (2, 1, 0.5, "C5"), (2, 1.5, 0.5, "D5"), (2, 2, 2, "E5"),
    (3, 0, 1, "G5"), (3, 1, 0.5, "E5"), (3, 1.5, 0.5, "D5"), (3, 2, 1, "C5"), (3, 3, 1, "D5"),
    (4, 0, 1.5, "E5"), (4, 1.5, 0.5, "G5"), (4, 2, 2, "A5"),
    (5, 0, 1, "G5"), (5, 1, 1, "E5"), (5, 2, 1.5, "D5"), (5, 3.5, 0.5, "E5"),
    (6, 0, 1, "C5"), (6, 1, 0.5, "D5"), (6, 1.5, 0.5, "E5"), (6, 2, 1, "G5"), (6, 3, 1, "A5"),
    (7, 0, 2, "C6"), (7, 2, 1, "A5"), (7, 3, 1, "G5"),
    (8, 0, 1, "A5"), (8, 1, 0.5, "G5"), (8, 1.5, 0.5, "E5"), (8, 2, 1.1, "D5"),
    (9, 0, 0.5, "E5"), (9, 0.5, 0.5, "G5"), (9, 1, 2, "C6"), (9, 3, 0.5, "D6"), (9, 3.5, 1.9, "C6"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="out/audio")
    ap.add_argument("--lufs", type=float, default=-16.0)
    a = ap.parse_args()
    meta = json.load(open(a.meta))
    C = meta["cues"]
    fps, total = meta["fps"], meta["total"]
    dur = total / fps
    N = int(round(dur * SR))
    bar, beat = C["bar"], C["bar"] / 4
    os.makedirs(os.path.join(a.out, "stems"), exist_ok=True)
    pre = np.zeros((N, 2))   # everything that starts before the break
    post = np.zeros((N, 2))  # the glissando and the end card
    sfx = np.zeros((N, 2))
    amb = np.zeros((N, 2))
    cues = []
    sil0, sil1 = C["silence"]

    def T(b, bt):  # bar (1-based), beat -> seconds
        return (b - 1) * bar + bt * beat

    def madd(x, t0, g=1.0, pan=0.0):
        add2(pre if t0 < sil0 - 1e-3 else post, x, t0, g, pan)

    # ------------------------------------------------------------- pad (grows through the film)
    for i, (name, notes, root) in enumerate(PROG):
        t0 = i * bar
        d = bar + (1.2 if i < 8 else 2.2)
        g = [0.36, 0.56, 0.64, 0.72, 0.8, 0.86, 0.95, 0.95, 1.1][i]
        madd(pad(notes, d, a=0.7 if i else 1.4, r=1.0, cut=1600 + 120 * i, g=g * 0.8), t0 - (0.05 if i else 0), 1.0, 0)
    cues.append({"layer": "music", "what": "pad", "progression": [p[0] for p in PROG]})

    # ------------------------------------------------------------- guzheng
    def zheng_bar(b, density):
        name = PROG[b - 1][0]
        arp = ARP[name]
        steps = {1: [0, 3, 5, 6], 2: [0, 2, 3, 4, 6], 3: list(range(8))}[density]
        for s in steps:
            t = T(b, s * 0.5)
            m = arp[s % len(arp)] + (12 if density >= 2 and s % 4 == 3 else 0)
            bend = 2.0 if (b in (3, 6) and s == 5) else 0.0
            vib = 0.004 if s in (0, 4) else 0.0
            madd(zheng(m2f(m), 2.2, bend=bend, vib=vib), t, (0.55 if s else 0.7) * (0.7 if b == 1 else 1.0), -0.35 + 0.1 * (s % 3))

    zheng_bar(1, 1)
    for b in (2, 3, 4):
        zheng_bar(b, 2)
    for b in (5, 6, 7):
        zheng_bar(b, 3)
    # bar 8: arpeggio up to the break, stops at the silence
    for s in range(7):
        t = T(8, s * 0.5)
        if t >= sil0 - 0.05:
            break
        madd(zheng(m2f(ARP["G"][s]), 1.6), t, 0.55, -0.3)
    # bar 9: glissando into the downbeat (audio leads the title), then bright 8ths
    pent = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79]
    g0 = sil1 + 0.002
    for k, m in enumerate(pent):
        madd(zheng(m2f(m), 1.8, bright=1.2), g0 + k * 0.017, 0.42, -0.5 + k * 0.07)
    for s in range(8):
        madd(zheng(m2f(ARP["Cadd9"][s]), 2.4, vib=0.004 if s % 4 == 0 else 0), T(9, s * 0.5) + 0.01, 0.55, -0.3 + 0.08 * s)
    madd(zheng(m2f(72), 3.2, vib=0.005), T(10, 0) + 0.01, 0.5, 0.1)  # tail
    cues.append({"layer": "music", "what": "guzheng arpeggios; glissando", "t": round(g0, 3)})

    # ------------------------------------------------------------- xiao melody (breathes between phrases)
    phrases, cur = [], []
    for k, (b, bt, d, nm) in enumerate(MEL):
        if b in PHRASE_STARTS and bt == 0 and cur:
            phrases.append(cur)
            cur = []
        t0 = T(b, bt)
        dd = d * beat
        if t0 < sil1 and t0 + dd > sil0:
            dd = max(0.05, sil0 - t0 - 0.02)
        prev = MEL[k - 1] if k else None
        tongued = prev is not None and (abs(n2m(nm) - n2m(prev[3])) >= 5 or n2m(nm) == n2m(prev[3]))
        cur.append((t0, dd, n2m(nm), tongued))
    phrases.append(cur)
    # breath: shorten the last note of every phrase a little
    for ph in phrases[:-1]:
        t0, dd, m, tg = ph[-1]
        ph[-1] = (t0, max(0.2, dd - 0.22), m, tg)
    fl_pre = xiao_line([p for p in phrases if p[0][0] < sil0], dur)
    fl_post = xiao_line([p for p in phrases if p[0][0] >= sil0], dur)
    add2(pre, fl_pre, 0, 0.62, 0.12)
    add2(post, fl_post, 0, 0.62, 0.12)
    cues.append({"layer": "music", "what": "xiao melody", "phrases": len(phrases)})

    # ------------------------------------------------------------- bass (from bar 5), warmth
    for i in range(4, 9):
        root = PROG[i][2]
        madd(bass(m2f(root), bar * 0.98), i * bar, 0.55, 0)
        madd(bass(m2f(root + 7), bar * 0.45), i * bar + 2 * beat, 0.28, 0)
    madd(bass(m2f(36), 3.8), T(10, 0) - 0.02, 0.5, 0)

    # ------------------------------------------------------------- bells: lanterns, stars, scale, title
    lant = ["G5", "A5", "C6", "D6", "E6", "G6"]
    for k, t in enumerate(C["lanternIgnite"]):
        madd(bell(m2f(n2m(lant[k])), 2.4, 1.3, 0.9), t, 0.34, -0.5 + 0.2 * k)
    for i in range(14):
        ts = C["constSettle0"] + i * C["constStagger"]
        m = [83, 86, 88, 91, 95, 98, 100][i % 7]  # Em7 colours for the stars
        madd(bell(m2f(m), 1.2, 0.7, 0.4), ts, 0.1, 0.5 - 0.06 * i)
    madd(bell(m2f(n2m("C6")), 3.8, 1.8, 1.4), C["scaleChime"], 0.4, 0.3)
    madd(bell(m2f(n2m("G6")), 3.4, 1.4, 1.2), C["scaleChime"] + 0.01, 0.26, 0.4)
    for k, m in enumerate([72, 76, 79, 84, 88]):
        madd(bell(m2f(m), 3.2, 1.4, 1.2), sil1 + k * 0.045, 0.24, -0.4 + 0.2 * k)
    cues.append({"layer": "music", "what": "bells on lanterns/stars/scale/title"})

    # ------------------------------------------------------------- hand drum + shaker (bar 8 lift, bar 9 joy)
    for s in (2, 3):
        madd(hand_drum(False), T(8, s), 0.22, 0.1)
    for s in range(8):
        t = T(9, s * 0.5)
        if s in (0, 3, 4, 6):
            madd(hand_drum(s in (0, 4)), t, 0.5 if s in (0, 4) else 0.3, 0.05)
        madd(shaker(), t + 0.02, 0.6, 0.45)
    for s in range(4):
        madd(shaker(), T(10, s * 0.5) + 0.02, 0.45 * (1 - s / 4), 0.45)
    madd(hand_drum(True), T(10, 0), 0.45, 0)

    # ------------------------------------------------------------- the break before the end card
    i0, i1 = int(sil0 * SR), int(sil1 * SR)
    f = int(0.07 * SR)
    pre = K.reverb(pre, 0.24, 2.2)
    pre[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
    pre[i0:] = 0  # the break is real silence: no reverb tails cross it
    post = K.reverb(post, 0.24, 2.2)
    music = pre + post
    cues.append({"layer": "music", "what": "silence (punctuation)", "t0": sil0, "t1": sil1})

    # ------------------------------------------------------------- sfx
    add2(sfx, whoosh_air(1.6, 0.5, 180, 2600, 0.5), 1.0, 1.0, 0.0)  # through the window
    ps = pen_scratch(4.1)
    ps *= np.clip(np.arange(len(ps)) / (0.6 * SR), 0, 1) * np.clip((len(ps) - np.arange(len(ps))) / (0.3 * SR), 0, 1)
    add2(sfx, ps, 2.3, 0.55, -0.2)
    for t in C["handFlips"]:
        add2(sfx, page_flip(0.5, 1.0), t + 0.02, 0.9, -0.15)
    for t in C["breezeFlips"]:
        add2(sfx, page_flip(0.34, 0.7), t, 0.8, -0.1 + RNG.uniform(-0.2, 0.2))
    add2(sfx, breeze(1.6), 7.72, 0.9, 0.3)
    for t in C["moteEmit"]:
        add2(sfx, sparkle(84, 3, 0.05, 0.8), t, 0.5, -0.1)
    for k, t in enumerate(C["lanternIgnite"]):
        add2(sfx, ignite(), t - 0.02, 0.45, -0.5 + 0.2 * k)
    for i in range(14):
        tl = C["constLift0"] + i * C["constStagger"]
        if i % 3 == 0:
            add2(sfx, whoosh_air(0.9, 0.6, 500, 5000, 0.18), tl, 1.0, 0.4)
    a0, a1 = C["constLines"]
    add2(sfx, shimmer(a1 - a0 + 0.4, 2600), a0, 0.8, 0.45)
    s0, s1 = C["streams"]
    add2(sfx, shimmer(s1 - s0 + 0.6, 3100), s0, 0.9, 0.2)
    add2(sfx, whoosh_air(2.2, 0.62, 250, 4200, 0.28), C["moonbeam"] - 1.2, 1.0, 0.0)
    add2(sfx, sparkle(88, 5, 0.07, 0.9), C["moonbeam"] + 0.02, 0.5, 0.2)
    pd = C["act"]["penDown"]
    tap = bp(RNG.standard_normal(int(0.04 * SR)), 900, 5000) * np.exp(-np.arange(int(0.04 * SR)) / (0.005 * SR))
    add2(sfx, tap, pd[1] - 0.08, 0.35, -0.3)
    st = C["act"]["stretch"]
    add2(sfx, breeze(1.0) * 0.6, st[0], 0.5, 0.0)
    r0, r1 = C["ring"]
    add2(sfx, shimmer(r1 - r0 + 0.3, 2200), r0, 0.8, 0.1)
    for k in range(6):
        add2(sfx, whoosh_air(1.4, 0.5, 300, 3000, 0.12), C["skyLanterns"] + 0.1 + k * 0.45, 1.0, -0.5 + 0.2 * k)
    add2(sfx, stamp(), C["seal"]["at"] - 0.005, 0.95, 0.35)
    add2(sfx, sparkle(91, 4, 0.05, 1.0), C["seal"]["at"] + 0.03, 0.4, 0.35)
    brush = bp(RNG.standard_normal(int(0.5 * SR)), 1500, 7000) * np.sin(np.pi * np.linspace(0, 1, int(0.5 * SR))) * 0.12
    add2(sfx, brush, C["inscription"]["at"], 0.6, 0.0)
    # petals: occasional tiny tinkles
    for k in range(9):
        t = C["petalsIn"] + 0.4 + k * 0.62 + RNG.uniform(0, 0.2)
        add2(sfx, bell(m2f(96 + [0, 2, 4, 7, 9][k % 5]), 0.8, 0.5, 0.25), t, 0.05, RNG.uniform(-0.6, 0.6))
    cues.append({"layer": "sfx", "what": "window whoosh, pen, pages, breeze, motes, lantern puffs, star shimmer, moonlight, pen tap, stretch, ring, sky lanterns, seal, brush, petals"})

    # ------------------------------------------------------------- ambience
    air = night_air(dur + 0.5)
    add2(amb, air, 0, 1.0, -0.2)
    add2(amb, night_air(dur + 0.5)[::-1], 0, 0.8, 0.3)
    cr = crickets(dur)
    amb[: len(cr)] += cr * np.clip(1 - np.linspace(0, 1, len(cr)) * 0.35, 0, 1)[:, None]
    amb[i0:i1] *= 1.2  # during the silence the night is heard
    cues.append({"layer": "amb", "what": "night air + three crickets"})

    # ------------------------------------------------------------- edges, stems, mix
    for buf in (music, sfx, amb):
        f0 = int(0.12 * SR)
        buf[:f0] *= np.linspace(0, 1, f0)[:, None]
        g = int(0.9 * SR)
        buf[-g:] *= (np.linspace(1, 0, g) ** 1.6)[:, None]
    stems = {"music": music * 0.62, "sfx": K.reverb(sfx, 0.12, 1.2) * 0.55, "amb": amb * 0.5}
    for k, v in stems.items():
        wavfile.write(os.path.join(a.out, "stems", f"{k}.wav"), SR, v.astype(np.float32))
    mix = master_eq(sum(stems.values()))
    tmp = os.path.join(a.out, "_pre.wav")
    wavfile.write(tmp, SR, mix.astype(np.float32))
    m0 = K.measure(tmp)
    mix *= 10 ** ((a.lufs - m0["I"]) / 20)
    mix = K.limiter(mix, -2.6)
    out = os.path.join(a.out, "mix.wav")
    wavfile.write(out, SR, mix.astype(np.float32))
    os.remove(tmp)
    m1 = K.measure(out)
    rep = {"target_lufs": a.lufs, "pre": m0, "final": m1, "duration": dur, "sr": SR, "ok": abs(m1["I"] - a.lufs) < 1.0 and m1["TP"] <= -1.0}
    json.dump(rep, open(os.path.join(a.out, "loudness.json"), "w"), indent=2)
    json.dump(cues, open(os.path.join(a.out, "cues.json"), "w"), indent=2, ensure_ascii=False)
    print(json.dumps(rep))
    if not rep["ok"]:
        print("LOUDNESS OUT OF SPEC", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
