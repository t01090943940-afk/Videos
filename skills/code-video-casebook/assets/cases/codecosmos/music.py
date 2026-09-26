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
