#!/usr/bin/env python3
"""
Procedural soundtrack for a stop-motion-3d episode — deterministic, no samples, numpy only.

Everything is DERIVED from what the picture already knows, so sound can never drift from it:
  * meta.json     (capture.mjs --meta)     -> shot starts, looks, state events
  * inspect.json  (capture.mjs --inspect)  -> per-frame pose signatures ("a>b@u") per actor
  * episode.json                            -> transitions (wipes), bands, end-title timing

Layers (stems written separately, then mixed):
  room   : room tone per variant (day studio / night city) — never true digital silence
  music  : original music, one instrument family per LOOK, chord grid locked to the style cuts
  foley  : keystrokes / pencil / enter clack / mug / paper / water ... from pose arrivals + events
  fx     : wipe whooshes (pre-lapped, audio leads picture) + a signature "stamp" per style
Punctuation: a short music drop-out before the end title, then the final chord.

Usage:
  python3 scripts/audio.py --meta out/meta.json --inspect out/qc/inspect.json \
      --episode src/episode/episode.json --out out/audio [--sound sound.json] [--lufs -16]
Outputs: out/audio/mix.wav (48k float), stems/*.wav, cues.json, loudness.json
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(7)

# ----------------------------------------------------------------------------- defaults (override via --sound)
DEFAULTS = {
    "bpm": 96,                       # 96 BPM -> 2.5 s bars: 7.5 s style segments land on bar lines
    "progression": ["C", "G", "Am", "F"],
    "look_instrument": {             # look id -> instrument family
        "diorama": "musicbox", "block": "chip", "clay": "marimba", "vox": "pizz",
        "sketch": "piano", "comic": "synth", "watercolor": "bells",
    },
    "pose_foley": {                  # pose name (on ARRIVAL) -> foley kind
        "type_a": "key", "type_b": "key", "hit_enter": "enter", "draw_a": "pencil", "draw_b": "pencil",
        "draw_c": "pencil", "tap": "tick", "reach_mug": None, "fist_pump": "stab", "cheer": "pop",
    },
    "event_foley": {                 # state key -> {value: kind}
        "hold.mug": {"*.R": "mug_up", "home": "mug_down"},
        "hold.sheet": {"*.R": "paper", "home": "paper"},
        "hold.can": {"*.R": "can_up", "home": "can_down"},
        "rin.pour": {"true": "pour_start", "false": "pour_end"},
        "plant.watered": {"true": "sparkle"},
    },
    "background_gain": 0.18,         # off-focus actors' foley (they are in frame only in wides)
    "lead": 0.33,                    # s — audio leads picture on transitions
    "silence": [-0.8, -0.3],         # s relative to end-title start: drop-out window
    "night_looks": ["comic"],
}

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
CHORD = {"C": [0, 4, 7], "G": [7, 11, 14], "Am": [9, 12, 16], "F": [5, 9, 12], "Dm": [2, 5, 9], "Em": [4, 7, 11]}


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def chord_notes(name, octave=4):
    base = 12 * (octave + 1)
    return [base + n for n in CHORD[name]]


# ----------------------------------------------------------------------------- DSP primitives
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env_ad(n, a=0.004, d=0.3, curve=1.0):
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return att * np.exp(-np.maximum(t - a, 0) / d) ** curve


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def noise(n):
    return RNG.standard_normal(n)


def add(buf, x, t0, gain=1.0):
    i = int(round(t0 * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i] * gain


def pan(mono, p):
    """p in [-1,1] -> stereo (constant power)."""
    a = (p + 1) * math.pi / 4
    return np.stack([mono * math.cos(a), mono * math.sin(a)], 1)


def add2(buf2, mono, t0, gain=1.0, p=0.0):
    s = pan(mono, p)
    i = int(round(t0 * SR))
    if i < 0:
        s = s[-i:]
        i = 0
    j = min(len(buf2), i + len(s))
    if j > i:
        buf2[i:j] += s[: j - i] * gain


def reverb_ir(dur=1.6, damp=3000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = noise(n) * np.exp(-t / (dur / 6.9) * 1.0)
    ir = lp(ir, damp)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt(np.sum(ir ** 2))


def reverb(x2, wet=0.18, dur=1.6):
    out = np.zeros_like(x2)
    for c in range(2):
        ir = reverb_ir(dur)
        out[:, c] = signal.fftconvolve(x2[:, c], ir)[: len(x2)]
    return x2 + out * wet


# ----------------------------------------------------------------------------- instruments (note -> mono)
def osc_additive(f, dur, harm, decay=0.5, a=0.003):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for k, amp in harm:
        if f * k < SR / 2 - 500:
            y += amp * np.sin(2 * np.pi * f * k * t + RNG.uniform(0, 6.28))
    return y * env_ad(len(t), a, decay)


def inst_musicbox(f, dur=1.4):
    return osc_additive(f, dur, [(1, 1), (2.01, 0.25), (3.98, 0.12), (6.1, 0.05)], decay=0.45)


def inst_chip(f, dur=0.22, duty=0.25):
    t = t_axis(dur)
    ph = (f * t) % 1.0
    y = np.where(ph < duty, 1.0, -1.0) - (2 * duty - 1)
    y = lp(y, 7000)
    return y * env_ad(len(t), 0.002, 0.09) * 0.45


def inst_marimba(f, dur=0.7):
    return osc_additive(f, dur, [(1, 1), (3.93, 0.28), (9.2, 0.06)], decay=0.16, a=0.002)


def karplus(f, dur=0.6, bright=0.5):
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = RNG.uniform(-1, 1, p)
    buf = lp(buf, 800 + 6000 * bright, 1)
    out = np.zeros(n)
    idx = 0
    for i in range(n):
        v = buf[idx]
        nxt = buf[(idx + 1) % p]
        buf[idx] = 0.996 * 0.5 * (v + nxt)
        out[i] = v
        idx = (idx + 1) % p
    return out * env_ad(n, 0.001, dur / 3)


_ks_cache = {}


def inst_pizz(f, dur=0.45):
    key = (round(f, 1), dur)
    if key not in _ks_cache:
        _ks_cache[key] = karplus(f, dur, 0.45) * 2.6
    return _ks_cache[key]


def inst_piano(f, dur=1.8):
    y = osc_additive(f, dur, [(1, 1), (2.002, 0.45), (3.005, 0.22), (4.01, 0.12), (5.02, 0.06)], decay=0.55, a=0.002)
    return lp(y, 5000) * 0.9


def inst_saw(f, dur=0.25, cut=1800, dec=0.12):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for k in range(1, 40):
        if f * k > SR / 2 - 1000:
            break
        y += np.sin(2 * np.pi * f * k * t) / k
    y = lp(y, cut)
    return y * env_ad(len(t), 0.003, dec) * 0.5


def inst_bell(f, dur=2.2, idx=2.2):
    t = t_axis(dur)
    mod = idx * np.exp(-t / 0.5) * np.sin(2 * np.pi * f * 3.5 * t)
    return np.sin(2 * np.pi * f * t + mod) * env_ad(len(t), 0.002, 0.7) * 0.6


def pad(freqs, dur, a=0.6, r=0.8):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            y += np.sin(2 * np.pi * f * (1 + det / 100) * t + RNG.uniform(0, 6.28))
            y += 0.3 * np.sin(2 * np.pi * 2 * f * (1 + det / 100) * t)
    e = np.minimum(np.clip(t / a, 0, 1), np.clip((dur - t) / r, 0, 1))
    return lp(y, 2400) * e / (len(freqs) * 3)


def drum_kick(dur=0.35, f0=120, f1=45):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_ad(len(t), 0.001, 0.12)


def drum_snare(dur=0.2):
    n = int(dur * SR)
    return (bp(noise(n), 1500, 7000) * 0.7 + np.sin(2 * np.pi * 190 * np.arange(n) / SR) * 0.4) * env_ad(n, 0.001, 0.06)


def drum_hat(dur=0.06):
    n = int(dur * SR)
    return hp(noise(n), 7000) * env_ad(n, 0.0005, 0.018) * 0.5


def clap():
    n = int(0.25 * SR)
    y = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        seg = bp(noise(n), 900, 4000) * env_ad(n, 0.0005, 0.012 if k < 2 else 0.07)
        add(y, seg, off)
    return y * 0.6


def woodblock():
    return osc_additive(1250, 0.12, [(1, 1), (2.7, 0.3)], decay=0.025) * 0.5


# ----------------------------------------------------------------------------- music: one pattern per family
def music_segment(fam, t0, t1, bpm, prog, out2, intensity=1.0):
    """Trigger notes whose onset is in [t0,t1). Tails may ring past t1 (natural decays)."""
    beat = 60.0 / bpm
    bar = 4 * beat
    e8 = beat / 2
    notes = []  # (time, mono, gain, pan)

    def chord_at(t):
        return prog[int(math.floor(t / bar + 1e-6)) % len(prog)]

    t = math.ceil(t0 / e8 - 1e-6) * e8
    while t < t1 - 1e-6:
        step = int(round(t / e8)) % 8  # 8ths within bar
        ch = chord_at(t)
        tones = chord_notes(ch, 4)
        root = chord_notes(ch, 2)[0]
        if fam == "musicbox":
            if step % 2 == 0:
                m = tones[(step // 2) % 3] + 12
                notes.append((t, inst_musicbox(midi_hz(m)), 0.33, 0.3 * ((step // 2) % 2 * 2 - 1)))
        elif fam == "chip":
            seq = [0, 1, 2, 1, 0, 2, 1, 2]
            notes.append((t, inst_chip(midi_hz(tones[seq[step]] + 12)), 0.3, 0.25))
            if step % 2 == 0:
                notes.append((t, inst_chip(midi_hz(root + 12), 0.28, 0.5), 0.34, -0.1))
            if step in (0, 4):
                notes.append((t, drum_kick(0.2, 160, 60), 0.5, 0))
            notes.append((t, drum_hat(), 0.18, 0.4))
        elif fam == "marimba":
            pat = {0: 0, 1: None, 2: 1, 3: 2, 4: None, 5: 1, 6: 2, 7: 0}
            if pat[step] is not None:
                notes.append((t, inst_marimba(midi_hz(tones[pat[step]] + 12)), 0.4, 0.2 * (step % 3 - 1)))
            if step in (0, 4):
                notes.append((t, inst_marimba(midi_hz(root + 12), 0.9), 0.42, -0.1))
            if step in (2, 6):
                notes.append((t, woodblock(), 0.35, 0.35))
        elif fam == "pizz":
            if step in (0, 2, 3, 5, 6):
                notes.append((t, inst_pizz(midi_hz(tones[step % 3] + 12)), 0.55, 0.3))
            if step in (0, 4):
                notes.append((t, inst_pizz(midi_hz(root + 12), 0.7), 0.6, -0.25))
            if step in (2, 6):
                notes.append((t, clap(), 0.45, 0.05))
        elif fam == "piano":
            if step == 0:
                notes.append((t, inst_piano(midi_hz(root + 12), 2.4), 0.45, -0.2))
            if step in (2, 4, 6):
                notes.append((t, inst_piano(midi_hz(tones[(step // 2) % 3] + 12)), 0.32, 0.2))
            if step == 7:
                notes.append((t, inst_piano(midi_hz(tones[2] + 24), 1.0), 0.18, 0.35))
        elif fam == "synth":
            notes.append((t, inst_saw(midi_hz(root), 0.26, 900, 0.14), 0.62, 0))
            for k in range(2):  # 16ths arp
                m = tones[(step * 2 + k) % 3] + 12
                notes.append((t + k * e8 / 2, inst_saw(midi_hz(m), 0.12, 4200, 0.05), 0.2, 0.45 * (1 if k else -1)))
            if step % 2 == 0:
                notes.append((t, drum_kick(0.3, 140, 42), 0.62, 0))
            if step in (2, 6):
                notes.append((t, drum_snare(), 0.4, 0.05))
            notes.append((t + e8 / 2, drum_hat(), 0.18, 0.4))
        elif fam == "bells":
            if step in (0, 3, 6):
                m = tones[[0, 2, 1][step // 3]] + 12
                notes.append((t, inst_bell(midi_hz(m)), 0.3, 0.35 * (1 if step == 3 else -1)))
        t += e8

    # a soft pad under every family except the drum-heavy ones — glues the segments
    if fam in ("musicbox", "piano", "bells", "marimba"):
        b = math.floor(t0 / bar + 1e-6)
        while b * bar < t1 - 1e-6:
            s = max(b * bar, t0)
            e = min((b + 1) * bar, t1)
            fr = [midi_hz(m) for m in chord_notes(prog[b % len(prog)], 3)]
            notes.append((s, pad(fr, e - s + 0.4, 0.25, 0.45), 0.22 if fam != "bells" else 0.3, 0))
            b += 1
    for (tt, x, g, p) in notes:
        add2(out2, x, tt, g * intensity, p)


# ----------------------------------------------------------------------------- foley
def foley(kind, rs):
    r = rs.uniform
    if kind == "key":
        n = int(0.05 * SR)
        y = bp(noise(n), 1800 * r(0.8, 1.2), 7000) * env_ad(n, 0.0005, 0.008)
        y += bp(noise(n), 300, 900) * env_ad(n, 0.0005, 0.012) * 0.5
        return y * r(0.6, 1.0)
    if kind == "enter":
        n = int(0.16 * SR)
        y = bp(noise(n), 900, 4000) * env_ad(n, 0.0005, 0.02) * 1.3
        y += np.sin(2 * np.pi * 170 * np.arange(n) / SR) * env_ad(n, 0.001, 0.04) * 0.7
        return y
    if kind == "pencil":
        n = int(0.22 * SR)
        am = 0.6 + 0.4 * np.sin(2 * np.pi * r(28, 40) * np.arange(n) / SR)
        return bp(noise(n), 2500, 9000) * am * env_ad(n, 0.02, 0.07) * 0.3
    if kind == "tick":
        n = int(0.06 * SR)
        return bp(noise(n), 2000, 6000) * env_ad(n, 0.0003, 0.006) * 1.1
    if kind in ("mug_up", "mug_down"):
        y = osc_additive(2150, 0.5, [(1, 1), (1.58, 0.5), (2.43, 0.3)], decay=0.09) * 0.35
        if kind == "mug_down":
            n = int(0.1 * SR)
            y[:n] += lp(noise(n), 400) * env_ad(n, 0.001, 0.02) * 1.2
        return y
    if kind == "paper":
        n = int(0.5 * SR)
        am = np.abs(lp(noise(n), 30)) * 3
        return bp(noise(n), 1200, 7000) * np.clip(am, 0, 1.5) * env_ad(n, 0.04, 0.2) * 0.5
    if kind in ("can_up", "can_down"):
        y = osc_additive(1450, 0.4, [(1, 1), (2.76, 0.4), (5.4, 0.2)], decay=0.07) * 0.28
        n = int(0.08 * SR)
        y[:n] += lp(noise(n), 500) * env_ad(n, 0.001, 0.02) * (1.0 if kind == "can_down" else 0.4)
        return y
    if kind == "stab":
        return inst_saw(midi_hz(72), 0.4, 3000, 0.18) * 0.8 + inst_saw(midi_hz(79), 0.4, 3000, 0.18) * 0.5
    if kind == "pop":
        t = t_axis(0.18)
        f = 400 + 900 * (1 - np.exp(-t / 0.03))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.002, 0.05) * 0.4
    if kind == "sparkle":
        y = np.zeros(int(1.6 * SR))
        for k, m in enumerate([84, 88, 91, 96]):
            add(y, inst_bell(midi_hz(m), 1.2, 1.2), k * 0.07, 0.35)
        return y
    return None


def pour_bed(dur, rs):
    """water stream + bubbles for `dur` seconds."""
    n = int(dur * SR)
    stream = bp(noise(n), 500, 2600) * (0.55 + 0.25 * np.abs(lp(noise(n), 8)) * 4)
    y = np.clip(stream, -3, 3) * 0.12
    t = 0.0
    while t < dur - 0.1:
        tt = t_axis(0.05)
        f0 = rs.uniform(600, 1400)
        f = f0 * (1 + 2.5 * tt / 0.05)
        add(y, np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(tt), 0.002, 0.012) * 0.12, t)
        t += rs.uniform(0.03, 0.09)
    fade = np.minimum(1, np.minimum(np.arange(n) / (0.12 * SR), (n - np.arange(n)) / (0.2 * SR)))
    return y * fade


# ----------------------------------------------------------------------------- fx: whoosh + style stamps
def whoosh(dur=0.8, peak=0.55, f_lo=300, f_hi=5000):
    """Band-swept noise via STFT masking. peak = fraction of dur where it is loudest."""
    n = int(dur * SR)
    x = noise(n)
    f, tt, Z = signal.stft(x, SR, nperseg=1024)
    u = tt / dur
    centre = f_lo * (f_hi / f_lo) ** np.clip(u / peak, 0, 1)
    centre = np.where(u > peak, f_hi * (f_lo * 2 / f_hi) ** np.clip((u - peak) / (1 - peak), 0, 1), centre)
    mask = np.exp(-((np.log(f[:, None] + 1) - np.log(centre[None, :])) ** 2) / (2 * 0.35 ** 2))
    amp = np.where(u < peak, (u / peak) ** 2, np.exp(-(u - peak) / (1 - peak) * 4))
    _, y = signal.istft(Z * mask * amp[None, :], SR, nperseg=1024)
    y = y[:n]
    return y / (np.max(np.abs(y)) + 1e-9) * 0.5


def stamp(look, rs):
    if look == "block":   # coin blip
        a = inst_chip(midi_hz(83), 0.08, 0.5)
        b = inst_chip(midi_hz(88), 0.3, 0.5)
        y = np.zeros(int(0.4 * SR)); add(y, a, 0); add(y, b, 0.07); return y * 0.9
    if look == "clay":    # squish-boing
        t = t_axis(0.35)
        f = 180 + 260 * np.exp(-t / 0.05) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / 0.15)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.004, 0.12) * 0.7
    if look == "vox":     # scissor snip + paper flap
        y = np.zeros(int(0.35 * SR))
        for k in range(2):
            n = int(0.03 * SR)
            add(y, bp(noise(n), 3000, 9000) * env_ad(n, 0.0003, 0.006), k * 0.07, 1.1)
        add(y, foley("paper", rs)[: int(0.25 * SR)], 0.12, 0.8)
        return y
    if look == "sketch":  # pencil flourish
        n = int(0.4 * SR)
        am = np.clip(np.sin(np.pi * np.arange(n) / n) * 1.3, 0, 1)
        return bp(noise(n), 2500, 10000) * am * 0.5
    if look == "comic":   # synth zap
        t = t_axis(0.3)
        f = 2400 * np.exp(-t / 0.06) + 120
        return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env_ad(len(t), 0.001, 0.08) * 0.28
    if look == "watercolor":  # water drop plip
        t = t_axis(0.25)
        f = 700 * (1 + 2.2 * np.clip(t / 0.03, 0, 1))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.035) * 0.55
    return np.zeros(10)


# ----------------------------------------------------------------------------- room tone
def room_tone(dur, night):
    n = int(dur * SR)
    br = np.cumsum(noise(n)) / 400
    br = hp(br, 25)
    br = lp(br, 260 if not night else 180)
    air = hp(noise(n), 3000) * 0.012
    y = br / (np.std(br) + 1e-9) * 0.02 + air
    if night:
        t = np.arange(n) / SR
        y += 0.006 * np.sin(2 * np.pi * 55 * t) + 0.003 * np.sin(2 * np.pi * 110 * t)
    return y


# ----------------------------------------------------------------------------- loudness helpers (ffmpeg ebur128)
def measure(path):
    cmd = ["ffmpeg", "-nostats", "-hide_banner", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    j = json.loads(err[err.rfind("{"): err.rfind("}") + 1])
    return {"I": float(j["input_i"]), "TP": float(j["input_tp"]), "LRA": float(j["input_lra"])}


def limiter(x2, ceiling_db=-1.6, look=0.004, release=0.08):
    """Look-ahead peak limiter on 4x-oversampled peaks (true-peak-ish)."""
    ceil = 10 ** (ceiling_db / 20)
    up = signal.resample_poly(np.max(np.abs(x2), 1), 4, 1)
    pk = np.abs(up).reshape(-1, 4).max(1)[: len(x2)]
    need = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    la = int(look * SR)
    # sliding min over a symmetric window = gain reaches its floor BEFORE the peak (look-ahead)
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * la + 1, origin=0)
    # release smoothing (one-pole, only on the way up)
    a = math.exp(-1 / (release * SR))
    out = np.empty_like(g)
    cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else a * cur + (1 - a) * g[i]
        out[i] = cur
    return x2 * out[:, None]


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--inspect", default="out/qc/inspect.json")
    ap.add_argument("--episode", default="src/episode/episode.json")
    ap.add_argument("--sound", default=None, help="optional JSON overriding DEFAULTS keys")
    ap.add_argument("--out", default="out/audio")
    ap.add_argument("--lufs", type=float, default=-16.0)
    a = ap.parse_args()

    cfg = dict(DEFAULTS)
    if a.sound and os.path.exists(a.sound):
        cfg.update(json.load(open(a.sound)))
    meta = json.load(open(a.meta))
    insp = json.load(open(a.inspect))
    ep = json.load(open(a.episode))
    fps = meta["fps"]
    dur = meta["total"] / fps
    N = int(round(dur * SR))
    os.makedirs(os.path.join(a.out, "stems"), exist_ok=True)

    shots = ep["shots"]
    starts = {s["id"]: m["start"] / fps for s, m in zip(shots, meta["shots"])}
    ends = {s["id"]: starts[s["id"]] + s["duration"] for s in shots}
    cues = []

    # --- style segments = maximal runs of the same look (music changes family only here)
    segs = []
    for s in shots:
        if segs and segs[-1]["look"] == s["look"] and not s.get("bands"):
            segs[-1]["t1"] = ends[s["id"]]
        else:
            segs.append({"look": s["look"], "t0": starts[s["id"]], "t1": ends[s["id"]], "shot": s})

    # end title (first title MG in the last shot with bands) -> punctuation window
    last = shots[-1]
    title_t = None
    for m in last.get("mg", []):
        if m["kind"] == "title":
            title_t = starts[last["id"]] + m["from"]
            break
    sil0 = sil1 = None
    if title_t is not None:
        sil0, sil1 = title_t + cfg["silence"][0], title_t + cfg["silence"][1]

    room = np.zeros((N, 2)); music = np.zeros((N, 2)); fol = np.zeros((N, 2)); fx = np.zeros((N, 2))

    # --- room tone per segment (night variant for night looks), crossfaded
    for sg in segs:
        night = sg["look"] in cfg["night_looks"]
        d = sg["t1"] - sg["t0"] + 0.3
        rt = room_tone(d, night)
        fade = np.minimum(1, np.minimum(np.arange(len(rt)) / (0.15 * SR), (len(rt) - np.arange(len(rt))) / (0.15 * SR)))
        add2(room, rt * fade, sg["t0"] - 0.15, 1.0, 0)
        add2(room, room_tone(d, night)[::-1] * fade, sg["t0"] - 0.15, 0.6, 0.6)
    cues.append({"layer": "room", "segments": [(s["look"], round(s["t0"], 2), round(s["t1"], 2)) for s in segs]})

    # --- music
    bpm, prog = cfg["bpm"], cfg["progression"]
    for i, sg in enumerate(segs):
        fam = cfg["look_instrument"].get(sg["look"], "musicbox")
        t0, t1 = sg["t0"], sg["t1"]
        if sg["shot"].get("bands"):
            # finale: bells + pad + soft pluck build, drop-out, final chord on the title (audio leads)
            stop = sil0 if sil0 else t1
            music_segment("bells", t0, stop, bpm, prog, music, 0.9)
            music_segment("musicbox", t0, stop, bpm, prog, music, 0.7)
            b = sg["shot"]["bands"]
            for k, lk in enumerate(b["looks"]):  # one signature note per band as it appears
                tt = t0 + b["start"] + k * b["stagger"]
                famk = cfg["look_instrument"].get(lk, "bells")
                m = [60, 62, 64, 67, 69, 72][k % 6] + 12
                x = {"chip": inst_chip(midi_hz(m), 0.3, 0.5), "marimba": inst_marimba(midi_hz(m)), "pizz": inst_pizz(midi_hz(m)),
                     "piano": inst_piano(midi_hz(m), 1.2), "synth": inst_saw(midi_hz(m), 0.3, 4000, 0.12), "bells": inst_bell(midi_hz(m))}.get(famk, inst_bell(midi_hz(m)))
                add2(music, x, tt - 0.04, 0.55, -0.6 + 1.2 * k / max(1, len(b["looks"]) - 1))
                add2(fx, stamp(lk, RNG), tt - 0.02, 0.35, -0.6 + 1.2 * k / max(1, len(b["looks"]) - 1))
            if sil1:
                hit = sil1
                fr = [midi_hz(m) for m in [48, 55, 60, 64, 67, 72]]
                add2(music, pad(fr, dur - hit, 0.02, 2.5), hit, 1.1, 0)
                for m in [60, 64, 67, 72, 76]:
                    add2(music, inst_bell(midi_hz(m), 3.5, 1.5), hit + RNG.uniform(0, 0.02), 0.28, RNG.uniform(-0.4, 0.4))
                    add2(music, inst_piano(midi_hz(m - 12), 3.5), hit, 0.22, RNG.uniform(-0.3, 0.3))
                add2(music, drum_kick(0.6, 90, 38), hit, 0.6, 0)
                cues.append({"layer": "music", "t": round(hit, 3), "what": "final chord (title at %.2f)" % title_t})
        else:
            music_segment(fam, t0, t1, bpm, prog, music, 1.0)
        cues.append({"layer": "music", "t0": round(t0, 2), "t1": round(t1, 2), "family": fam, "look": sg["look"]})

    # music bus: reverb, then hard drop-out window (the silence IS the punctuation)
    music = reverb(music, 0.22, 1.8)
    if sil0 is not None:
        i0, i1 = int(sil0 * SR), int(sil1 * SR)
        f = int(0.06 * SR)
        music[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
        music[i0:i1] = 0
        # the final chord starts at sil1 — rebuild what reverb smeared into the gap is already zeroed
        room[i0:i1] *= 0.5
        fol[i0:i1] *= 0.25
        cues.append({"layer": "music", "t0": round(sil0, 3), "t1": round(sil1, 3), "what": "drop-out (silence punctuation)"})

    # --- foley from pose ARRIVALS (sig "a>b@u": a new key begins when the pair changes; arrival = b reached)
    focus = {}
    for s in shots:
        focus[s["id"]] = {k["actor"] for k in s.get("acting", []) if "actor" in k}
    prev = {}
    rs = np.random.default_rng(11)
    nk = 0
    pans = {}
    for fr in insp:
        sid = fr["shot"]
        wide = not focus[sid]
        for actor, sig in fr["sig"].items():
            pair = sig.split("@")[0]
            a_, b_ = pair.split(">")
            key = (sid, actor)
            if prev.get(key) != pair:
                prev[key] = pair
                arrived = a_ == b_  # held key == pose reached (stepped clock)
                if not arrived:
                    continue
                kind = cfg["pose_foley"].get(b_)
                if not kind:
                    continue
                x = foley(kind, rs)
                if x is None:
                    continue
                g = 1.0 if actor in focus[sid] else (0.22 if wide else cfg["background_gain"])
                if actor not in pans:
                    pans[actor] = -0.7 + 1.4 * (len(pans) / 5)
                p = 0.15 if actor in focus[sid] else pans[actor]
                add2(fol, x, fr["frame"] / fps, g * (0.8 if kind == "key" else 1.0), p)
                nk += 1
    cues.append({"layer": "foley", "pose_hits": nk})

    # --- foley from STATE EVENTS (continuity layer)
    pour_on = None
    for ev in meta["events"]:
        t = ev["frame"] / fps
        for k, v in ev["set"].items():
            rules = cfg["event_foley"].get(k, {})
            vs = str(v).lower()
            kind = rules.get(vs) or next((kk for pat, kk in rules.items() if pat.startswith("*") and vs.endswith(pat[1:])), None)
            if not kind:
                continue
            if kind == "pour_start":
                pour_on = t
            elif kind == "pour_end" and pour_on is not None:
                add2(fol, pour_bed(t - pour_on + 0.25, rs), pour_on, 0.9, 0.1)
                cues.append({"layer": "foley", "t0": round(pour_on, 2), "t1": round(t, 2), "what": "pour"})
                pour_on = None
            else:
                x = foley(kind, rs)
                if x is not None:
                    add2(fol, x, t, 0.9, 0.12)
                    cues.append({"layer": "foley", "t": round(t, 2), "what": kind, "event": f"{k}={v}"})

    # --- fx: wipe whoosh (pre-lapped) + style stamp
    for s in shots:
        tr = s.get("transition") or {}
        if tr.get("type") == "wipe":
            t = starts[s["id"]]
            wd = tr.get("frames", 14) / fps
            w = whoosh(cfg["lead"] + wd + 0.2, peak=(cfg["lead"] + wd * 0.5) / (cfg["lead"] + wd + 0.2))
            add2(fx, w, t - cfg["lead"], 0.55, 0)
            add2(fx, stamp(s["look"], RNG), t + wd * 0.6, 0.6, 0.2)
            cues.append({"layer": "fx", "t": round(t - cfg["lead"], 3), "what": f"whoosh -> {s['look']} (+stamp)"})

    # fades at the very edges (no hard digital start/stop)
    for buf in (room, music, fol, fx):
        f = int(0.25 * SR)
        buf[:f] *= np.linspace(0, 1, f)[:, None]
        g = int(1.2 * SR)
        buf[-g:] *= np.linspace(1, 0, g)[:, None] ** 1.5

    stems = {"room": room * 0.3, "music": music * 0.55, "foley": fol * 0.8, "fx": fx * 0.7}
    for k, v in stems.items():
        wavfile.write(os.path.join(a.out, "stems", f"{k}.wav"), SR, v.astype(np.float32))
    mix = sum(stems.values())
    # a touch of shared room so foley and music sit in one space
    mix = reverb(mix, 0.05, 0.6)

    # loudness: measure -> gain -> limit -> verify
    tmp = os.path.join(a.out, "_pre.wav")
    wavfile.write(tmp, SR, mix.astype(np.float32))
    m0 = measure(tmp)
    mix *= 10 ** ((a.lufs - m0["I"]) / 20)
    mix = limiter(mix, -2.0)
    out = os.path.join(a.out, "mix.wav")
    wavfile.write(out, SR, mix.astype(np.float32))
    os.remove(tmp)
    m1 = measure(out)
    rep = {"target_lufs": a.lufs, "pre": m0, "final": m1, "duration": dur, "sr": SR,
           "ok": abs(m1["I"] - a.lufs) < 1.0 and m1["TP"] <= -1.0}
    json.dump(rep, open(os.path.join(a.out, "loudness.json"), "w"), indent=2)
    json.dump(cues, open(os.path.join(a.out, "cues.json"), "w"), indent=2, ensure_ascii=False)
    print(json.dumps(rep))
    if not rep["ok"]:
        print("LOUDNESS OUT OF SPEC", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
