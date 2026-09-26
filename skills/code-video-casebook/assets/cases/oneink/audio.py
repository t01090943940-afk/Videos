import numpy as np, json
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR = 60.5
N = int(SR * DUR)
rng = np.random.default_rng(11)
dry = np.zeros((2, N))
wet = np.zeros((2, N))   # reverb send

EV = json.load(open('events.json'))

def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype='band', fs=SR, output='sos'); return sosfilt(sos, x)
def lp(x, f, order=2):
    sos = butter(order, f, btype='low', fs=SR, output='sos'); return sosfilt(sos, x)
def hp(x, f, order=2):
    sos = butter(order, f, btype='high', fs=SR, output='sos'); return sosfilt(sos, x)

def place(sig, t, gain=1.0, pan=0.0, send=0.3):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    dry[0, i:i + len(sig)] += sig * gain * l
    dry[1, i:i + len(sig)] += sig * gain * r
    wet[0, i:i + len(sig)] += sig * gain * l * send
    wet[1, i:i + len(sig)] += sig * gain * r * send

NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def hz(n):  # 'F3'
    return 440.0 * 2 ** ((NOTE[n[0]] + 12 * (int(n[-1]) + 1) - 69) / 12)

def qin(f0, dur=4.0, amp=1.0, glide=None, vib=0.0, bright=1.0, pluck=0.13):
    """guqin-like string: inharmonic additive partials with pitch contour (吟猱 / slides)"""
    n = int(dur * SR); t = np.arange(n) / SR
    cont = np.ones(n)
    if glide:  # list of (time, ratio)
        ts = [0] + [g[0] for g in glide]; rs = [1] + [g[1] for g in glide]
        cont = np.interp(t, ts, rs)
        cont = lp(cont - 1, 12, 1) + 1
    if vib: cont *= 1 + vib * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / 0.4, 0, 1) * np.exp(-t / (dur * 0.6))
    ph = 2 * np.pi * np.cumsum(f0 * cont) / SR
    out = np.zeros(n)
    B = 0.00012
    for k in range(1, 18):
        fk = k * np.sqrt(1 + B * k * k)
        if f0 * fk > 12000: break
        a = abs(np.sin(np.pi * k * pluck)) / k ** (1.05 / bright)
        dec = np.exp(-t * (0.55 + 0.22 * k ** 1.3) / bright)
        out += a * np.sin(ph * fk + rng.uniform(0, 6)) * dec
    att = np.clip(t / 0.004, 0, 1)
    body = bp(out, 150, 2600, 1) * 0.6 + out * 0.4
    click = bp(rng.normal(size=n), 1500, 6000) * np.exp(-t / 0.006) * 0.25
    return (body * att + click) * amp * 0.25

def harmonic(f0, dur=5.0, amp=1.0):
    """泛音 — flageolet: pure, bell-like"""
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 1.9) + 0.18 * np.sin(2 * np.pi * 2 * f0 * t) * np.exp(-t / 0.9) + 0.06 * np.sin(2 * np.pi * 3.01 * f0 * t) * np.exp(-t / 0.5)
    att = np.clip(t / 0.003, 0, 1)
    return out * att * amp * 0.16

def brush(dur, amp=1.0, dryness=0.3):
    n = int(max(0.05, dur) * SR); t = np.arange(n) / SR
    x = rng.normal(size=n)
    lo, hi = 700 + dryness * 1500, 4200 + dryness * 5000
    y = bp(x, lo, hi)
    env = np.sin(np.pi * np.clip(t / (dur + 1e-6), 0, 1)) ** 0.7
    grain = 1 + dryness * 2.5 * (np.abs(lp(rng.normal(size=n), 60)) * 6)
    return y * env * amp * 0.05 * grain / (1 + dryness)

def noise_bed(dur, lo, hi, amp):
    n = int(dur * SR); return bp(rng.normal(size=n), lo, hi) * amp

# ── room tone ──
room = lp(rng.normal(size=N), 400) * 0.006
room *= np.clip(np.arange(N) / SR / 2.0, 0, 1)
dry[0] += room; dry[1] += np.roll(room, 1234)

# ── opening: breath of paper, then the drop ──
place(noise_bed(3.0, 200, 1200, 0.004) * np.hanning(int(3.0 * SR)), 0.0, 1, 0, 0.5)
T_DROP = 2.45
n = int(0.12 * SR); t = np.arange(n) / SR
plip = np.sin(2 * np.pi * np.cumsum(500 + 1100 * np.exp(-t / 0.012)) / SR) * np.exp(-t / 0.03)
place(plip * 0.22, T_DROP - 0.005, 1, 0, 0.7)
n = int(0.5 * SR); t = np.arange(n) / SR
place(np.sin(2 * np.pi * 55 * t) * np.exp(-t / 0.12) * 0.35, T_DROP, 1, 0, 0.3)
place(qin(hz('F2'), 7.0, 1.2, bright=0.8), T_DROP + 0.02, 1, 0, 0.55)

# ── 永字八法: five strokes, five notes ──
yong = {}
for e in EV:
    if e['type'] == 'yong': yong[e['i']] = e
yong_notes = [('F5', 'h'), ('C3', [(0.35, 1.0), (0.7, 1.1225)]), ('F3', None), ('G3', None), ('A3', [(0.9, 1.0), (1.6, 0.94)])]
for i, (nt, g) in enumerate(yong_notes):
    e = yong[i]
    place(brush(e['d'], 1.3, 0.15 + 0.1 * i), e['t'], 1, -0.1 + 0.05 * i, 0.3)
    if g == 'h': place(harmonic(hz(nt), 5, 1.1), e['t'] + 0.05, 1, 0.2, 0.6)
    else: place(qin(hz(nt), 5.5, 0.9, glide=g, vib=0.012 if i == 4 else 0.0), e['t'] + 0.02, 1, -0.15 + 0.08 * i, 0.5)

# ── writing textures for every column ──
def column_brush(t0, t1, rate, amp, dryness, pan):
    t = t0
    while t < t1:
        d = rng.uniform(0.06, 0.2)
        place(brush(d, amp * rng.uniform(0.5, 1.0), dryness), t, 1, pan + rng.uniform(-0.15, 0.15), 0.25)
        t += d + rng.exponential(1 / rate)
for e in EV:
    if e['type'] != 'col': continue
    sec = e['sec']
    if sec == 'lan': column_brush(e['t'], e['end'], 6, 0.55, 0.15, 0.2 - 0.1 * e['ci'])
    if sec == 'ji': column_brush(e['t'], e['end'], 8, 0.7, 0.6, 0.1 - 0.1 * e['ci'])
    if sec == 'han': column_brush(e['t'], e['end'], 6, 0.65, 0.3, 0.1 - 0.1 * e['ci'])
    if sec == 'shu': column_brush(e['t'], e['end'], 5, 0.5, 0.2, 0.0)
column_brush(8.55, 12.4, 6, 0.55, 0.12, 0.25)

# ── 蘭亭: unhurried melody, F pentatonic, spring air ──
lan = [(9.0, 'C4', None), (9.9, 'D4', None), (10.8, 'F4', [(0.4, 1.0), (0.8, 1.0595)]), (11.9, 'h:A5', None), (12.6, 'G4', None), (13.5, 'F4', None),
       (14.3, 'D4', None), (15.2, 'C4', [(0.3, 1), (0.9, 0.944)]), (16.3, 'h:F5', None), (17.0, 'A3', None), (18.0, 'G3', [(0.5, 1), (1.2, 1.059)]),
       (19.3, 'h:C6', None), (19.7, 'F3', None), (20.8, 'C3', [(0.8, 1), (2.0, 0.944)])]
for t, nt, g in lan:
    if nt.startswith('h:'): place(harmonic(hz(nt[2:]), 5, 0.9), t, 1, rng.uniform(-0.4, 0.4), 0.7)
    else: place(qin(hz(nt), 5.0, 0.7, glide=g, vib=0.008), t, 1, rng.uniform(-0.3, 0.3), 0.55)

# ── 祭姪: grief — D minor pentatonic, heavy slides downward, low drone ──
n = int(8.5 * SR); t = np.arange(n) / SR
drone = (np.sin(2 * np.pi * hz('D2') * t) + 0.5 * np.sin(2 * np.pi * hz('D2') * 2.003 * t) + 0.3 * np.sin(2 * np.pi * hz('A2') * t)) * np.sin(np.pi * t / 8.5) ** 2
place(lp(drone, 500) * 0.05, 20.4, 1, 0, 0.6)
ji = [(20.7, 'D3', [(0.3, 1), (1.0, 0.94)]), (21.6, 'F3', None), (22.3, 'A2', [(0.4, 1), (1.4, 0.89)]), (23.3, 'C3', None), (24.1, 'D3', [(0.2, 1), (0.9, 0.94), (1.8, 0.89)])]
for tt, nt, g in ji: place(qin(hz(nt), 5.5, 1.0, glide=g, vib=0.015, bright=0.85), tt, 1, rng.uniform(-0.3, 0.3), 0.55)
# the strike-out: a harsh scratch
for e in EV:
    if e['type'] == 'strike':
        place(brush(0.45, 3.0, 1.0), e['t'], 1, 0.0, 0.3)
        place(hp(rng.normal(size=int(0.4 * SR)), 2500) * np.exp(-np.arange(int(0.4 * SR)) / SR / 0.15) * 0.05, e['t'] + 0.05, 1, 0, 0.3)
# 嗚呼哀哉 — four heavy notes, falling
for i, (nt, rat) in enumerate([('D3', 0.94), ('C3', 0.89), ('A2', 0.94), ('D2', 0.97)]):
    place(qin(hz(nt), 6.0, 1.35, glide=[(0.35, 1), (1.3, rat)], vib=0.018, bright=0.8), 25.4 + i * 0.72, 1, -0.2 + 0.13 * i, 0.6)

# ── 寒食: cold rain, sparse harmonics ──
n = int(8.5 * SR); t = np.arange(n) / SR
rain = bp(rng.normal(size=n), 1500, 9000) * 0.012 * np.sin(np.pi * t / 8.5) ** 1.5
drops = np.zeros(n)
for _ in range(420):
    i = rng.integers(0, n - 2000); f = rng.uniform(2500, 6000); tt = np.arange(900) / SR
    drops[i:i + 900] += np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.004) * rng.uniform(0.2, 1)
rain += drops * 0.02 * np.sin(np.pi * t / 8.5) ** 1.5
place(rain, 28.3, 1, 0, 0.35)
place(np.roll(rain, 7777) * 0.8, 28.3, 1, 0.5, 0.35)
han = [(28.8, 'h:D6'), (29.9, 'A3'), (31.0, 'h:A5'), (31.8, 'G3'), (33.0, 'D3'), (34.3, 'h:D5'), (35.3, 'C3')]
for tt, nt in han:
    if nt.startswith('h:'): place(harmonic(hz(nt[2:]), 5, 0.75), tt, 1, rng.uniform(-0.5, 0.5), 0.8)
    else: place(qin(hz(nt), 5, 0.75, vib=0.01, bright=0.9, glide=[(0.6, 1), (1.6, 0.97)]), tt, 1, rng.uniform(-0.3, 0.3), 0.6)
# ash — breath
n = int(3.5 * SR); place(bp(rng.normal(size=n), 300, 1500) * np.hanning(n) * 0.012, 34.2, 1, -0.3, 0.6)

# ── 書譜: return to F — 達其情性，形其哀樂 ──
for tt, nt, g in [(35.6, 'F3', None), (36.4, 'A3', None), (37.2, 'C4', [(0.4, 1), (0.9, 1.1225)]), (38.2, 'F4', None), (39.0, 'h:F5', None)]:
    if nt.startswith('h:'): place(harmonic(hz(nt[2:]), 6, 1.0), tt, 1, 0.1, 0.8)
    else: place(qin(hz(nt), 5.5, 0.8, glide=g, vib=0.01), tt, 1, rng.uniform(-0.2, 0.2), 0.55)

# ── 诗云: the pull-back, dissolution, a galaxy of poems ──
T0, T1, TC0, TC1 = 39.4, 49.38, 47.55, 49.35
n = int((T1 - T0) * SR); t = np.arange(n) / SR + T0
sw = np.clip((t - 40.0) / 9.0, 0, 1) ** 2
cut = 1 - np.clip((t - 49.28) / 0.1, 0, 1)
dr = np.zeros(n)
for f, a in [(hz('F1'), 0.6), (hz('C2'), 0.4), (hz('F2'), 0.35), (hz('A2'), 0.18), (hz('C3'), 0.15), (hz('F3') * 1.003, 0.12)]:
    dr += a * np.sin(2 * np.pi * f * (t - T0) * (1 + 0.0005 * np.sin(t * 0.7)))
dr = lp(dr, 900) * (0.05 + 0.1 * sw) * cut
place(dr, T0, 1, 0, 0.5)
air = bp(rng.normal(size=n), 400, 6000) * (0.002 + 0.018 * sw) * cut
place(air, T0, 1, 0.3, 0.6); place(np.roll(air, 999), T0, 1, -0.3, 0.6)
# the murmur of ten thousand poems: granular harmonics converging to one note
pent = ['F', 'G', 'A', 'C', 'D']
target = hz('F4')
for i in range(2600):
    tt = 40.6 + (TC1 - 40.6) * rng.random() ** 0.55
    dens = np.clip((tt - 40.6) / 8.0, 0, 1)
    if rng.random() > 0.25 + 0.75 * dens: continue
    nt = pent[rng.integers(0, 5)] + str(rng.integers(3, 7))
    f = hz(nt)
    q = np.clip((tt - TC0) / (TC1 - TC0), 0, 1) ** 1.4
    f = f * (1 - q) + target * q * (1 + rng.normal() * 0.004 * (1 - q))
    dur = 0.6 + 1.2 * rng.random()
    g = harmonic(f, dur, rng.uniform(0.05, 0.16) * (0.3 + dens))
    if tt + dur > 49.36:
        k = int((49.36 - tt) * SR)
        if k <= 0: continue
        g = g[:k] * np.linspace(1, 0.2, k)
    place(g, tt, 1, rng.uniform(-0.9, 0.9) * (1 - 0.8 * q), 0.6)

# ── 一畫: silence, then the press and the sweep ──
T_PRESS, TS0, TS1 = 50.0, 50.26, 51.05
n = int(3.0 * SR); t = np.arange(n) / SR
boom = np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.9) * 0.9
place(boom, T_PRESS, 1, 0, 0.25)
splash = bp(rng.normal(size=int(0.6 * SR)), 300, 7000) * np.exp(-np.arange(int(0.6 * SR)) / SR / 0.08) * 0.5
place(splash, T_PRESS, 1, -0.6, 0.5)
for f, a in [('F1', 2.0), ('C2', 1.5), ('F2', 1.3), ('C3', 0.7)]:
    place(qin(hz(f), 9.0, a, bright=0.75), T_PRESS + 0.01, 1, -0.2, 0.7)
# sweep — the brush crosses the paper from left to right
dur = TS1 - TS0 + 0.35
n = int(dur * SR); t = np.arange(n) / SR
x = rng.normal(size=n)
env = np.clip(t / 0.08, 0, 1) * np.exp(-np.clip(t - (TS1 - TS0), 0, None) / 0.12)
lo = bp(x, 150, 900) * 0.5; mid = bp(x, 900, 3500); hi = bp(x, 3500, 11000)
dryx = np.clip(t / (TS1 - TS0), 0, 1)
sweep = (lo * (1 - dryx) + mid * 0.8 + hi * (0.2 + 1.2 * dryx) * (1 + 3 * np.abs(lp(rng.normal(size=n), 90)) * dryx)) * env * 0.16
pan = np.clip(-0.85 + 1.7 * dryx, -1, 1)
L = np.cos((pan + 1) * np.pi / 4); R = np.sin((pan + 1) * np.pi / 4)
i0 = int(TS0 * SR); dry[0, i0:i0 + n] += sweep * L; dry[1, i0:i0 + n] += sweep * R
wet[0, i0:i0 + n] += sweep * L * 0.5; wet[1, i0:i0 + n] += sweep * R * 0.5
# flicked droplets
for k in range(8):
    tt = TS1 + rng.uniform(0.05, 0.35); m = int(0.03 * SR); tq = np.arange(m) / SR
    place(np.sin(2 * np.pi * rng.uniform(1800, 3200) * tq) * np.exp(-tq / 0.005) * 0.08, tt, 1, 0.8, 0.5)
# after-ring: harmonics like light on the filaments
for tt, nt in [(51.8, 'h:F5'), (52.9, 'h:C6'), (53.9, 'h:A5'), (54.9, 'h:F6')]:
    place(harmonic(hz(nt[2:]), 6, 0.7), tt, 1, rng.uniform(-0.3, 0.5), 0.9)

# ── inscription & seal ──
for e in EV:
    if e['type'] == 'inscr': column_brush(55.2, 57.6, 5, 0.35, 0.15, -0.3)
for tt, nt, g in [(55.3, 'C4', None), (56.3, 'A3', [(0.5, 1), (1.2, 0.944)]), (57.2, 'F3', None)]:
    place(qin(hz(nt), 5.5, 0.6, glide=g, vib=0.01), tt, 1, -0.2, 0.55)
T_SEAL = 57.9
n = int(0.25 * SR); t = np.arange(n) / SR
thock = (np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.03) + 0.5 * np.sin(2 * np.pi * 410 * t) * np.exp(-t / 0.02) + bp(rng.normal(size=n), 800, 4000) * np.exp(-t / 0.008) * 0.6) * 0.3
place(thock, T_SEAL, 1, -0.3, 0.3)
place(harmonic(hz('F5'), 6, 1.0), T_SEAL + 0.25, 1, 0, 0.9)
place(harmonic(hz('C6'), 6, 0.5), T_SEAL + 0.3, 1, 0.2, 0.9)
place(qin(hz('F2'), 6, 0.5, bright=0.8), T_SEAL + 0.25, 1, 0, 0.7)

# ── reverb (synthetic hall) ──
def ir(seconds, seed):
    r = np.random.default_rng(seed); n = int(seconds * SR); t = np.arange(n) / SR
    x = r.normal(size=n) * np.exp(-t / (seconds / 6.5))
    x = lp(x, 6000) * 0.7 + lp(x, 2000) * 0.3
    x[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return x / np.sqrt(np.sum(x * x))
revL = fftconvolve(wet[0], ir(4.2, 1))[:N]; revR = fftconvolve(wet[1], ir(4.2, 2))[:N]
mix = dry + np.stack([revL, revR]) * 0.9
# collapse silence: duck everything but the room between 49.38 and 50.0
t = np.arange(N) / SR
duck = 1 - 0.92 * np.clip((t - 49.33) / 0.06, 0, 1) * (1 - np.clip((t - 49.98) / 0.02, 0, 1))
mix *= duck
# final fade (end card)
mix *= 1 - np.clip((t - 59.6) / 0.9, 0, 1)
mix *= np.clip(t / 0.05, 0, 1)
rms = np.sqrt(np.mean(mix[:, int(50 * SR):int(52 * SR)] ** 2))
mix = mix / rms * 10 ** (-15 / 20)
mix = np.tanh(mix / 0.9) * 0.9
peak = rms
wavfile.write('score.wav', SR, (mix.T * 32767).astype(np.int16))
print('ok peak', peak)
