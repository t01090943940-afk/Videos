"""Procedural score — every era gets its own instrumentation and groove.
One leitmotif (E-minor pentatonic) threads through all six acts."""
import numpy as np
import wave, math

SR = 48000
TOTAL = 56.0
N = int(SR * TOTAL)
L = np.zeros(N, np.float64)
R = np.zeros(N, np.float64)

rng = np.random.default_rng(11)

# ---------- dsp helpers ----------
def adsr(n, a, d, s, r, sl=0.0):
    env = np.empty(n)
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n)
    i = 0
    if a_n:
        env[i:i + a_n] = np.linspace(0, 1, a_n); i += a_n
    if d_n:
        env[i:i + d_n] = np.linspace(1, sl, d_n); i += d_n
    if s_n:
        env[i:i + s_n] = sl; i += s_n
    if r_n:
        env[i:i + r_n] = np.linspace(sl, 0, r_n); i += r_n
    return env[:n]

def osc(kind, f, n, det=0.0):
    t = np.arange(n) / SR
    ph = 2 * math.pi * f * t
    if kind == "sine": return np.sin(ph)
    if kind == "tri":  return 2 / math.pi * np.arcsin(np.sin(ph))
    if kind == "sqr":  return np.sign(np.sin(ph)) * 0.7
    if kind == "saw":
        v = 2 * (t * f % 1) - 1
        if det:
            v = 0.5 * (v + (2 * (t * f * (1 + det) % 1) - 1))
        return v * 0.6
    if kind == "noise": return rng.normal(0, 1, n) * 0.5
    raise ValueError(kind)

def place(t0, sig, amp=1.0, pan=0.0, gl=L, gr=R):
    i0 = int(t0 * SR); i1 = min(N, i0 + len(sig))
    if i1 <= i0: return
    seg = sig[:i1 - i0] * amp
    # equal-power pan
    al = math.cos((pan + 1) * math.pi / 4)
    ar = math.sin((pan + 1) * math.pi / 4)
    gl[i0:i1] += seg * al
    gr[i0:i1] += seg * ar

def note(t0, f, dur, kind="sine", amp=0.5, pan=0.0, a=0.01, r=0.08, sl=0.0, det=0.0):
    n = int(dur * SR)
    sig = osc(kind, f, n, det) * adsr(n, a, dur * 0.4, r, sl)
    place(t0, sig, amp, pan)

def bell(t0, f, amp=0.4, pan=0.0, dur=1.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = (np.sin(2 * math.pi * f * tt)
           + 0.45 * np.sin(2 * math.pi * f * 2.76 * tt)
           + 0.18 * np.sin(2 * math.pi * f * 5.40 * tt))
    sig *= np.exp(-tt * (3.2 + f / 500))
    place(t0, sig, amp, pan)

def felt(t0, f, amp=0.45, pan=0.0, dur=1.4):
    """felt-piano-ish: sine + soft 2nd/3rd, fast attack, long decay"""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = (np.sin(2 * math.pi * f * tt)
           + 0.5 * np.sin(2 * math.pi * f * 2 * tt)
           + 0.22 * np.sin(2 * math.pi * f * 3 * tt))
    env = np.exp(-tt * 2.4) * np.clip(tt * 120, 0, 1)
    place(t0, sig * env, amp, pan)

def pad(t0, freqs, dur, amp=0.16, det=0.006):
    n = int(dur * SR)
    env = adsr(n, dur * 0.3, dur * 0.12, dur * 0.45, dur * 0.18, sl=0.6)
    for f in freqs:
        sig = (osc("tri", f, n) + 0.6 * osc("saw", f, n, det)) * env
        place(t0, sig, amp / max(1, len(freqs) * 0.55), rng.uniform(-0.5, 0.5))

def kick(t0, amp=0.9, f0=140, f1=48, dur=0.30, pan=0.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 28)
    ph = 2 * math.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-tt * 12)
    sig += osc("noise", 0, n) * np.exp(-tt * 90) * 0.5
    place(t0, sig, amp, pan)

def taiko(t0, amp=1.0, pan=0.0):
    n = int(0.55 * SR)
    tt = np.arange(n) / SR
    f = 42 + 66 * np.exp(-tt * 18)
    ph = 2 * math.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-tt * 5.5)
    sig += osc("noise", 0, n) * np.exp(-tt * 45) * 0.8
    place(t0, sig, amp, pan)

def hat(t0, amp=0.22, open_=False, pan=0.0):
    n = int((0.16 if open_ else 0.05) * SR)
    sig = osc("noise", 0, n)
    # crude highpass: diff
    sig = np.diff(sig, prepend=0)
    sig *= np.exp(-np.arange(n) / SR * (35 if open_ else 90))
    place(t0, sig, amp, pan)

def snare(t0, amp=0.5, pan=0.0):
    n = int(0.22 * SR)
    tt = np.arange(n) / SR
    sig = osc("noise", 0, n) * np.exp(-tt * 22) * 0.8
    sig += np.sin(2 * math.pi * 185 * tt) * np.exp(-tt * 28) * 0.6
    place(t0, sig, amp, pan)

def riser(t0, dur, amp=0.3, up=True):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f0, f1 = (240, 3200) if up else (3200, 240)
    f = f0 + (f1 - f0) * tt / dur
    sig = osc("noise", 0, n) * 0.4 + np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.5
    sig *= np.clip(tt / dur, 0, 1) ** 2 * np.exp(-(dur - tt) * 0.4)
    place(t0, sig, amp)

def sub_pulse(t0, f=41.2, dur=0.5, amp=0.5):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.sin(2 * math.pi * f * tt) * np.exp(-tt * 4)
    place(t0, sig, amp)

def click_(t0, amp=0.2):
    n = int(0.012 * SR)
    sig = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR * 400)
    place(t0, sig, amp, rng.uniform(-0.4, 0.4))

# ---------- motif ----------
E4, G4, A4, B4, D5, E5 = 329.63, 392.00, 440.00, 493.88, 587.33, 659.25
E2, E3 = 82.41, 164.81
MOTIF = [E4, G4, A4, B4, D5, B4, A4, G4]

# ================= ACT 0 · ambient origin (0-7s) =================
def a0():
    pad(0.0, [E2, E3, 246.94], 7.4, amp=0.30)          # E drone
    pad(1.8, [123.47, 196.0], 5.2, amp=0.10)           # B2 G3 shimmer
    for t0 in (0.7, 1.7, 2.7):                          # heartbeat
        sub_pulse(t0, 55, 0.42, 0.55)
    bell(4.3, E4, 0.30); bell(5.0, G4, 0.28); bell(5.7, A4, 0.30)
    bell(6.3, B4, 0.26, dur=2.2)
    riser(6.0, 1.05, 0.20)

# ================= ACT 1 · clockwork 120bpm (7-15s) =================
def a1():
    b = 60 / 120 / 2                    # eighth note
    t = 7.0
    arp = [E4, E4, G4, E4, A4, G4, B4, A4, D5, B4, A4, G4, E4, G4, A4, E4]
    i = 0
    while t < 14.6:
        note(t, arp[i % len(arp)], b * 0.92, "sqr", amp=0.115,
             pan=-0.35 if i % 2 else 0.35, a=0.004, r=0.05)
        if i % 2 == 0:
            click_(t, 0.10)
        if i % 4 == 0:
            sub_pulse(t, E2 * 2, b * 1.8, 0.30)
        t += b; i += 1
    pad(7.2, [E2 * 2, 246.94], 7.6, amp=0.075)          # low bed under the arp
    # counter switch at 11.6 (global) — pitch riser + sub drop
    riser(11.2, 0.9, 0.16)
    sub_pulse(11.65, E2, 0.6, 0.55)
    # glitch stutter at the tail
    for k in range(6):
        click_(14.55 + k * 0.07, 0.16)
    riser(14.55, 0.45, 0.22)

# ================= ACT 2 · driving montage 128bpm (15-23s) =================
def a2():
    bt = 60 / 128
    roots = [E2, E2, G4 / 4, A4 / 4, B4 / 4, B4 / 4, D5 / 4, E2]   # low roots
    bar = bt * 4
    for bi in range(8):
        t0 = 15 + bi * bar
        if t0 > 22.9: break
        r = roots[bi]
        for q in range(4):                        # four-on-floor kicks
            kick(t0 + q * bt, 0.75 if q == 0 else 0.5, f0=120)
            if q in (1, 3): snare(t0 + q * bt, 0.28)
        for e in range(8):                        # offbeat hats
            hat(t0 + e * bt / 2 + bt / 4, 0.10 + (e % 2) * 0.06)
        for e in range(8):                        # saw bass 8ths
            note(t0 + e * bt / 2, r, bt * 0.44, "saw", amp=0.20, a=0.005, r=0.04, det=0.01)
    # card slams: 8 thuds synced to the visual card landings (1.0s grid)
    for i in range(8):
        taiko(15.12 + i * 0.9375, 0.65, pan=(i % 3 - 1) * 0.3)
    # motif stab lead 20.5-23
    for i, f in enumerate(MOTIF[:6]):
        note(20.6 + i * 0.235, f, 0.24, "saw", amp=0.22, a=0.004, r=0.07, det=0.008)
    riser(22.3, 0.7, 0.25)

# ================= ACT 3 · contemplation 72bpm (23-31.5s) =================
def a3():
    bar = 60 / 72 * 4
    for i in range(3):
        sub_pulse(23 + i * bar * 2, 36.7, 1.4, 0.42)          # deep root every 2 bars
    # sparse felt motif
    seq = [(23.6, E4), (24.9, G4), (26.2, A4), (27.8, B4), (29.4, D5)]
    for t0, f in seq:
        felt(t0, f, 0.42, pan=rng.uniform(-0.3, 0.3), dur=2.6)
        felt(t0 + 0.02, f * 2, 0.10, dur=1.8)
    pad(23.2, [E3, B4 / 2, D5 / 2], 6.0, amp=0.10)
    pad(28.4, [E3, G4 / 2, B4 / 2, D5 / 2], 3.4, amp=0.12)
    riser(30.3, 1.15, 0.18)

# ================= ACT 4 · monumental 92bpm (31.5-43.5s) =================
def a4():
    bt = 60 / 92
    # sub A: taiko + brass hits synced to visual slams (33.3+... local t)
    slams = [3.3, 4.1, 4.9, 5.4]
    for i, lt in enumerate(slams):
        T = 31.5 + lt
        taiko(T, 0.95)
        for f in [E3, B4 / 4, E4 / 2]:
            note(T, f, 0.55, "saw", amp=0.16, a=0.006, r=0.3, det=0.012)
        sub_pulse(T, E2 / 2, 0.7, 0.5)
    # rolling taiko pattern
    for i in range(14):
        taiko(31.6 + i * bt * 1.0, 0.30, pan=(-1) ** i * 0.3)
    # sub B: slab hits
    for i in range(5):
        T = 38.1 + i * (5.4 / 5)
        kick(T, 0.9, f0=100)
        snare(T, 0.4)
        note(T, D5 / 2, 0.4, "saw", amp=0.14, a=0.005, r=0.2, det=0.015)
    # heroic motif at 40.8
    for i, f in enumerate(MOTIF):
        T = 40.7 + i * 0.32
        for octv in (1, 2):
            note(T, f * octv, 0.34, "saw", amp=0.13 if octv == 1 else 0.08,
                 a=0.008, r=0.12, det=0.01)
        taiko(T, 0.5)
    riser(42.7, 0.8, 0.28)

# ================= ACT 5 · cosmic reprise (43.5-56s) =================
def a5():
    chords = [
        ([E3, B4 / 2, D5 / 2, G4 / 2], 5.0),
        ([164.81 / 2, A4 / 2, 523.25 / 2, E4 / 2], 5.0),   # Cmaj-ish
        ([196.0 / 2, B4 / 2, D5 / 2, G4 / 2], 4.0),
        ([E3, E4, B4, G4], 6.0),
    ]
    t = 43.5
    for fr, dur in chords:
        pad(t, fr, dur, amp=0.16)
        t += dur
    # bell motif reprise, widely spaced
    for i, f in enumerate([E4, G4, A4, B4, D5, E5]):
        bell(44.3 + i * 1.05, f, 0.24, pan=(-1) ** i * 0.35, dur=3.2)
    # heartbeat return at the end
    for t0 in (53.4, 54.3, 55.2):
        sub_pulse(t0, 48, 0.5, 0.5)

# ---------- build ----------
def build():
    for fn in (a0, a1, a2, a3, a4, a5):
        fn()
    mix = np.stack([L, R], axis=1)
    # gentle stereo delay (haas-ish)
    d = int(0.023 * SR)
    mix[d:, 1] += mix[:-d, 0] * 0.18
    mix[d:, 0] += mix[:-d, 1] * 0.12
    # master: soft clip + normalize
    mix = np.tanh(mix * 1.15)
    mix /= (np.abs(mix).max() + 1e-9)
    mix *= 0.94
    # fade in/out
    fi = int(0.25 * SR); fo = int(1.6 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)[:, None]
    mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return (mix * 32767).astype(np.int16)

if __name__ == "__main__":
    m = build()
    with wave.open("out/score.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(m.tobytes())
    print("score.wav", m.shape, m.max(), m.min())
