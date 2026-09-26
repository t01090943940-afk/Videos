"""128 BPM soundtrack, 100% synthesised with numpy. Every section = 1 shot = 16 beats."""
import numpy as np
from scipy import signal
from scipy.io import wavfile
from core import SPB, SCENE_BEATS, TAIL_BEATS
from plan import N_SHOTS, TYPING, BIG_DROPS

SR = 44100
TOTAL_BEATS = N_SHOTS * SCENE_BEATS + TAIL_BEATS
N = int(TOTAL_BEATS * SPB * SR) + SR
rng = np.random.RandomState(7)

L = np.zeros(N); R = np.zeros(N)          # music bus (sidechained)
DL = np.zeros(N); DR = np.zeros(N)        # drum bus
FX = np.zeros((2, N))                     # fx bus (not sidechained)
kick_times = []

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def bi(b): return int(b * SPB * SR)
def add(buf, start, x, gain=1.0):
    if start >= N: return
    e = min(N, start + len(x)); buf[start:e] += x[:e - start] * gain
def addst(bl, br, start, x, g=1.0, pan=0.0):
    add(bl, start, x, g * np.sqrt(.5 * (1 - pan))); add(br, start, x, g * np.sqrt(.5 * (1 + pan)))
def env_adsr(n, a=.005, d=.1, s=.6, r=.1, hold=None):
    a_, d_, r_ = int(a * SR), int(d * SR), int(r * SR)
    hold = n if hold is None else hold
    e = np.zeros(n + r_)
    e[:a_] = np.linspace(0, 1, a_, False) if a_ else 1
    dd = min(d_, max(hold - a_, 0)); e[a_:a_ + dd] = np.linspace(1, s, dd, False)
    e[a_ + dd:hold] = s
    e[hold:hold + r_] = np.linspace(s, 0, r_) if r_ else 0
    return e[:hold + r_]
def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), .99)); return signal.lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), .99), 'high'); return signal.lfilter(b, a, x)
def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), min(hi / (SR / 2), .99)], 'band'); return signal.lfilter(b, a, x)
def saw(f, n, ph=0.0): t = np.arange(n) / SR; return 2 * ((f * t + ph) % 1.0) - 1
def sq(f, n, duty=.5): t = np.arange(n) / SR; return np.where((f * t) % 1.0 < duty, 1.0, -1.0)
def sine(f, n): return np.sin(2 * np.pi * f * np.arange(n) / SR)
def tri(f, n): return 2 * np.abs(saw(f, n)) - 1

# ------------------------------------------------------------------ harmony
PROG = [  # (bass, pad voicing) per bar : Am  F  C  G
    (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
HOOK = [[(0, 76, .5), (.75, 72, .25), (1.5, 69, .5), (2.5, 72, .5), (3, 76, .75)],
        [(0, 77, .5), (.75, 76, .25), (1.5, 72, .5), (2.5, 69, 1.)],
        [(0, 79, .5), (.75, 76, .25), (1.5, 72, .5), (2.5, 76, .5), (3, 79, .75)],
        [(0, 74, .5), (.75, 71, .25), (1.5, 67, .5), (2.5, 71, .5), (3, 74, 1.)]]
def chord_at(beat): return PROG[int(beat // 4) % 4]

# ------------------------------------------------------------------ voices
def v_kick(b, g=1.0, hard=False):
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 42 + 150 * np.exp(-t * 32); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * (7 if hard else 9))
    x[:200] += rng.randn(200) * .25 * np.linspace(1, 0, 200)
    x = np.tanh(x * 1.6)
    addst(DL, DR, bi(b), x, .95 * g); kick_times.append(bi(b))
def v_clap(b, g=1.0):
    n = int(.3 * SR); t = np.arange(n) / SR; z = bp(rng.randn(n), 900, 5000)
    e = np.exp(-t * 18); 
    for o in (.0, .011, .022): e += np.where(t >= o, np.exp(-(t - o) * 160), 0) * .6
    x = z * e * .35
    addst(DL, DR, bi(b), x, g, -.1); addst(FX[0], FX[1], bi(b), x, .12 * g, .2)
def v_hat(b, g=1.0, open_=False, pan=.25):
    n = int((.25 if open_ else .06) * SR); t = np.arange(n) / SR
    x = hp(rng.randn(n), 7500) * np.exp(-t * (14 if open_ else 70))
    addst(DL, DR, bi(b), x, .22 * g, pan)
def v_bass(b, m, dur, g=1.0, bright=900, chip=False):
    n = int(dur * SPB * SR)
    if chip:
        x = sq(mtof(m), n, .5) * .35 * env_adsr(n, .002, .05, .8, .02, n)[:n]
    else:
        f = mtof(m); x = .6 * saw(f, n) + .5 * saw(f * 1.005, n, .3) + .7 * sine(f / 2, n)
        x = lp(x, bright) * env_adsr(n, .004, .12, .7, .03, n)[:n]
    addst(L, R, bi(b), x, .42 * g)
def v_pad(b, notes, dur, g=1.0, cutoff=2200):
    n = int(dur * SPB * SR); x = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for d, ph in ((-.12, .1), (0, .5), (.11, .8)):
            x += saw(f * 2 ** (d / 12), n, ph)
    x = lp(x / (len(notes) * 3), cutoff) * env_adsr(n, .25, .3, .8, .5, n)[:n]
    xr = np.roll(x, 331)
    add(L, bi(b), x, .38 * g); add(R, bi(b), xr, .38 * g)
def v_pluck(b, m, g=1.0, pan=0.0, dec=9.0, bright=5000):
    n = int(.5 * SR); t = np.arange(n) / SR; f = mtof(m)
    x = (saw(f, n) * .6 + sq(f, n) * .3) * np.exp(-t * dec)
    x = lp(x, bright)
    addst(L, R, bi(b), x, .22 * g, pan); addst(FX[0], FX[1], bi(b), x, .06 * g, -pan)
def v_chip(b, m, dur, g=1.0, duty=.25, pan=0.):
    n = int(dur * SPB * SR); x = sq(mtof(m), n, duty) * env_adsr(n, .001, .06, .6, .01, n)[:n]
    addst(L, R, bi(b), x, .11 * g, pan)
def v_lead(b, m, dur, g=1.0):
    n = int(dur * SPB * SR); f = mtof(m); t = np.arange(n) / SR
    vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t * 4, 0, 1)
    x = np.zeros(n)
    for d in (-.18, -.07, 0, .07, .18):
        x += 2 * ((np.cumsum(f * vib * 2 ** (d / 12)) / SR) % 1.0) - 1
    x = lp(x / 5, 4200) * env_adsr(n, .01, .15, .75, .12, n)[:n]
    addst(L, R, bi(b), x, .2 * g, .0); addst(FX[0], FX[1], bi(b), x, .08 * g)
def v_stab(b, notes, g=1.0):
    n = int(.35 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for d in (-.1, .1): x += saw(mtof(m + 12) * 2 ** (d / 12), n)
    x = lp(x / len(notes), 3500) * np.exp(-t * 9)
    addst(L, R, bi(b), x, .16 * g); addst(FX[0], FX[1], bi(b), x, .1 * g)
def v_riser(b0, b1, g=1.0):
    n = bi(b1) - bi(b0); t = np.linspace(0, 1, n)
    z = rng.randn(n); out = np.zeros(n); chunk = 2048
    for i in range(0, n, chunk):
        fc = 400 + 9000 * t[i] ** 2
        out[i:i + chunk] = bp(z[i:i + chunk], fc * .7, fc * 1.3) if i else 0
    f = 110 * 2 ** (t * 3); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .25
    x = (out * 1.2 + tone) * t ** 2
    add(FX[0], bi(b0), x, .45 * g); add(FX[1], bi(b0), np.roll(x, 200), .45 * g)
def v_impact(b, g=1.0):
    n = int(2.2 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2)
    crash = hp(rng.randn(n), 3000) * np.exp(-t * 2.8) * .35
    x = np.tanh(boom * 1.4) * .9 + crash
    add(DL, bi(b), x, .8 * g); add(DR, bi(b), x, .8 * g); addst(FX[0], FX[1], bi(b), crash, .3 * g)
def v_whoosh(b_end, length=1.0, g=1.0):
    n = int(length * SPB * SR); t = np.linspace(0, 1, n)
    z = rng.randn(n); out = np.zeros(n); chunk = 1024
    for i in range(chunk, n, chunk):
        fc = 300 + 5000 * t[i] ** 1.5; out[i:i + chunk] = bp(z[i:i + chunk], fc * .6, fc * 1.4)
    x = out * np.sin(np.pi * t * .5) ** 2 * .55
    add(FX[0], bi(b_end) - n, x, g); add(FX[1], bi(b_end) - n, np.roll(x, 90), g)
def v_click(b, g=1.0):
    n = int(.03 * SR); t = np.arange(n) / SR
    x = hp(rng.randn(n), 2500) * np.exp(-t * 220) + sine(1800 + rng.rand() * 800, n) * np.exp(-t * 400) * .4
    addst(FX[0], FX[1], bi(b), x, .35 * g, rng.uniform(-.4, .4))
def v_blip(b, m=84, g=1.0):
    n = int(.08 * SR); x = sq(mtof(m), n, .5) * np.exp(-np.arange(n) / SR * 40)
    addst(FX[0], FX[1], bi(b), x, .08 * g)

# ------------------------------------------------------------------ arrangement
def section(s):
    B = s * SCENE_BEATS
    full_drums = s in (2, 4, 5, 6, 9, 10, 13)
    for bar in range(4):
        b0 = B + bar * 4; bass, pad = PROG[bar]
        # ---------- harmony beds
        if s in (0,):
            v_pad(b0, pad, 4, .7, cutoff=700 + bar * 250)
            add(L, bi(b0), sine(mtof(33), bi(4)) * .12); add(R, bi(b0), sine(mtof(33), bi(4)) * .12)
        elif s in (7, 11):  # chiptune shots
            for i in range(8): v_bass(b0 + i * .5, bass - 12 + (12 if i % 2 else 0), .45, .8, chip=True)
            arp = pad + [pad[1] + 12]
            for i in range(16 if s == 11 else 8):
                st = .25 if s == 11 else .5
                v_chip(b0 + i * st, arp[i % len(arp)] + 12, st * .9, 1.0, .25, pan=.3 if i % 2 else -.3)
        elif s == 14:
            v_pad(b0, pad, 4, .9, cutoff=1600)
            for i, m in enumerate(pad):
                v_pluck(b0 + i * .5 + (bar == 3) * 0, m + 12, .6, pan=(i - 1.5) * .3, dec=4, bright=3000)
            if bar < 2: v_bass(b0, bass - 12, 3.5, .7, bright=500)
        elif s == 12:  # blueprint build
            v_pad(b0, pad, 4, .8, cutoff=900 + bar * 700)
            for i in range(8): v_pluck(b0 + i * .5, pad[i % 4] + 12, .55 + bar * .12, pan=.3 * (-1) ** i, bright=2000 + bar * 1000)
            if bar >= 2:
                for i in range(8): v_bass(b0 + i * .5, bass, .4, .8)
        elif s == 8:  # half-time clay
            v_pad(b0, pad, 4, .9, cutoff=1800)
            v_bass(b0, bass - 12, 1.5, 1.0, bright=500); v_bass(b0 + 2.5, bass - 12, 1.0, .8, bright=500)
            for i in (0, 1.5, 3): v_pluck(b0 + i, pad[int(i) % 4] + 12, .7, pan=-.2, dec=6)
        else:
            v_pad(b0, pad, 4, .55 if s in (1, 3) else .75, cutoff=2600 if s != 3 else 1500)
            for i in range(8):  # offbeat pumping bass
                v_bass(b0 + i * .5, bass + (12 if i % 4 == 3 and s >= 4 else 0), .42, .9 if s > 1 else .7, bright=700 + 250 * (s >= 4))
            if s in (1, 3, 6, 9):
                st = .25 if s in (6, 9) else .5
                seq = pad + pad[::-1][1:3]
                for i in range(int(4 / st)):
                    v_pluck(b0 + i * st, seq[i % len(seq)] + (12 if s != 3 else 0), .9 if s != 3 else 1.1,
                            pan=.35 * np.sin(i), dec=12 if s == 3 else 9, bright=2600 if s == 3 else 5000)
            if s in (4, 5, 13):
                for (o, m, d) in HOOK[bar]: v_lead(b0 + o, m, d, 1.0 if s != 5 else .75)
            if s == 13:
                for i in range(16): v_pluck(b0 + i * .25, pad[i % 4] + 24, .45, pan=.4 * (-1) ** i)
            if s == 10:
                for i in range(4): v_stab(b0 + i, pad, 1.0)
        # ---------- drums
        for i in range(4):
            b = b0 + i
            if s == 0: continue
            if s == 8:
                if i in (0,): v_kick(b)
                if i == 2: v_clap(b, 1.0)
                if i == 1: v_kick(b + .5, .7)
                for k in range(2): v_hat(b + k * .5 + .25, .5)
                continue
            if s == 12:
                if bar == 2: v_kick(b, .8); v_kick(b + .5, .6)
                if bar == 3:
                    for k in range(4): v_kick(b + k * .25, .5 + .12 * i); v_clap(b + k * .25, .25 + i * .12)
                continue
            if s == 14 and bar >= 2: continue
            if s in (7, 11):
                v_kick(b, .8)
                n_ = int(.12 * SR); nz = rng.randn(n_) * np.exp(-np.arange(n_) / SR * 30)
                if i % 2: addst(DL, DR, bi(b), np.sign(nz) * np.abs(nz) ** .5 * .15)
                v_hat(b + .5, .5)
                continue
            v_kick(b, 1.0, hard=s == 13)
            if i % 2 == 1 and s >= 2: v_clap(b)
            if s >= 1: v_hat(b + .5, .8 if full_drums else .5, open_=full_drums and s in (5, 13), pan=.2)
            if full_drums:
                v_hat(b + .25, .35, pan=-.3); v_hat(b + .75, .35, pan=-.3)
        if s == 10 and bar == 3: v_clap(b0 + 3.5, .8); v_clap(b0 + 3.75, .9)
    # ---------- transitions
    if s < N_SHOTS - 1:
        v_whoosh(B + 16, .75, .8)
    if s in BIG_DROPS: v_impact(B, 1.0)
    elif s > 0: v_impact(B, .35)

def build(path):
    for s in range(N_SHOTS): section(s)
    # S00 specifics: typing clicks, riser, boot blips
    for b0, b1, txt in TYPING:
        for i in range(len(txt)): v_click(b0 + (b1 - b0) * i / len(txt))
    for k in range(4): v_blip(8 + k * .5, 84 + k * 3)
    v_riser(12, 15.5, 1.0); v_riser(12 * 16 + 8, 13 * 16, 1.0)
    # outro final hit + long chord
    END = N_SHOTS * SCENE_BEATS
    v_impact(END, .7)
    v_pad(END, [45, 57, 64, 69, 72], TAIL_BEATS, 1.0, cutoff=1200)
    v_kick(END, .8)
    # sidechain
    sc = np.ones(N); env = np.exp(-np.arange(int(.22 * SR)) / SR * 16)
    for k in kick_times:
        e = min(N, k + len(env)); sc[k:e] = np.minimum(sc[k:e], 1 - .72 * env[:e - k])
    # reverb on fx + music send
    ir_n = int(2.0 * SR); tt = np.arange(ir_n) / SR
    irL = rng.randn(ir_n) * np.exp(-tt * 3.2); irR = rng.randn(ir_n) * np.exp(-tt * 3.2)
    irL = lp(irL, 5000); irR = lp(irR, 5000)
    send = FX + np.stack([L, R]) * .15
    wetL = signal.fftconvolve(send[0], irL)[:N] * .09; wetR = signal.fftconvolve(send[1], irR)[:N] * .09
    outL = L * sc + DL + FX[0] + wetL; outR = R * sc + DR + FX[1] + wetR
    out = np.stack([outL, outR], 1)
    out = hp(out.T, 25).T
    out = np.tanh(out * 1.3) / np.tanh(1.3)
    # fade tail
    endi = int(TOTAL_BEATS * SPB * SR); fade = int(1.5 * SR)
    out[endi - fade:endi] *= np.linspace(1, 0, fade)[:, None]; out = out[:endi]
    out = out / np.max(np.abs(out)) * .93
    wavfile.write(path, SR, (out * 32767).astype(np.int16))
    print('audio', out.shape[0] / SR, 's')

if __name__ == '__main__':
    import sys; build(sys.argv[1] if len(sys.argv) > 1 else 'music.wav')
