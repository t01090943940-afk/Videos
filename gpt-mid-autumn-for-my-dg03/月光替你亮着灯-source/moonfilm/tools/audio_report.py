#!/usr/bin/env python3
"""
Objective checks of the soundtrack  (补全：reconstructed from the conversation)

The score could not be judged by ear during production, so these measurements stood in for
listening. They were separate inline commands at the time; this script runs them together.

    python3 tools/audio_report.py [--audio out/audio] [--meta out/meta.json] [--out out/qc]

Writes
  out/qc/audio_analysis.png  spectrogram of the mix + per-stem RMS + mix RMS (bar lines every 3 s)
  out/qc/music_env.png       music-stem envelope in dB + waveform 3-9 s (phrasing / breaths / dynamic arc)
Prints
  music RMS inside the silence window (should be about -inf: the pre bus is cut to real silence)
  octave-band balance relative to 63-125 Hz (production values after the master EQ:
  2-4 kHz -6.3 dB, 8-16 kHz -19.9 dB; before it -11.1 / -24.4 = dull on phone speakers)
  the largest sample-to-sample jumps (clicks) and the DC offset
Requires numpy, scipy, matplotlib.
"""
import argparse
import json
import os

import numpy as np
from scipy import signal
from scipy.io import wavfile

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", default="out/audio")
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="out/qc")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    sr, mix = wavfile.read(os.path.join(a.audio, "mix.wav"))
    stems = {k: wavfile.read(os.path.join(a.audio, "stems", f"{k}.wav"))[1] for k in ["music", "sfx", "amb"]}

    # ---- spectrogram + stem / mix RMS
    fig, ax = plt.subplots(3, 1, figsize=(16, 10), gridspec_kw={"height_ratios": [3, 1.4, 1.4]})
    m = mix.mean(1)
    f, t, S = signal.spectrogram(m, sr, nperseg=2048, noverlap=1536)
    ax[0].pcolormesh(t, f, 10 * np.log10(S + 1e-12), shading="auto", vmin=-120, vmax=-40, cmap="magma")
    ax[0].set_ylim(0, 9000)
    ax[0].set_title("mix spectrogram")
    for x in range(0, 29, 3):
        ax[0].axvline(x, color="w", lw=0.4, alpha=0.5)
    win = int(0.05 * sr)

    def rms(x):
        x = x.mean(1) if x.ndim > 1 else x
        n = len(x) // win
        return np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1) + 1e-12)

    tt = np.arange(len(m) // win) * 0.05
    for k, v in stems.items():
        r = rms(v)
        ax[1].plot(tt[: len(r)], 20 * np.log10(r), label=k, lw=0.9)
    ax[1].legend()
    ax[1].set_ylim(-80, -5)
    ax[1].grid(alpha=0.3)
    ax[1].set_title("stem RMS (dBFS, 50 ms)")
    r = rms(mix)
    ax[2].plot(tt[: len(r)], 20 * np.log10(r), color="k", lw=0.9)
    ax[2].set_ylim(-70, 0)
    ax[2].grid(alpha=0.3)
    ax[2].set_title("mix RMS")
    for axx in ax[1:]:
        for x in range(0, 29, 3):
            axx.axvline(x, color="gray", lw=0.5, alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(a.out, "audio_analysis.png"), dpi=80)
    plt.close(fig)

    # ---- silence window (from the timeline): the music must really stop
    sil0, sil1 = json.load(open(a.meta, encoding="utf-8"))["cues"]["silence"] if os.path.exists(a.meta) else (23.52, 23.78)
    i0, i1 = int((sil0 + 0.03) * sr), int((sil1 - 0.02) * sr)
    print(f"music RMS in break {sil0:.2f}-{sil1:.2f}s (dBFS):",
          round(float(20 * np.log10(np.sqrt((stems["music"][i0:i1] ** 2).mean()) + 1e-12)), 1))
    print("mix peak (sample):", round(float(np.abs(mix).max()), 4))

    # ---- octave-band tonal balance
    fw, P = signal.welch(m, sr, nperseg=8192)
    ref = None
    print("octave bands relative to 63-125 Hz:")
    for lo, hi in [(63, 125), (125, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]:
        sel = (fw >= lo) & (fw < hi)
        db = 10 * np.log10(P[sel].sum() + 1e-20)
        ref = db if ref is None else ref
        print(f"  {lo:>5}-{hi:<5} Hz  {db - ref:+6.1f} dB")

    # ---- music envelope (breaths between phrases, dynamic arc across the bars)
    mu = stems["music"].mean(1)
    w10 = int(0.01 * sr)
    env = np.sqrt((mu[: len(mu) // w10 * w10].reshape(-1, w10) ** 2).mean(1))
    fig, ax = plt.subplots(2, 1, figsize=(16, 5))
    ax[0].plot(np.arange(len(env)) * 0.01, 20 * np.log10(env + 1e-9))
    ax[0].set_ylim(-60, -5)
    ax[0].grid(alpha=0.3)
    ax[0].set_title("music stem envelope (dB)")
    for b in range(0, 29, 3):
        ax[0].axvline(b, color="r", lw=0.5)
    j0, j1 = int(3.0 * sr), int(9.0 * sr)
    ax[1].plot(np.arange(j1 - j0) / sr + 3.0, mu[j0:j1], lw=0.3)
    ax[1].set_title("music waveform 3-9 s")
    plt.tight_layout()
    plt.savefig(os.path.join(a.out, "music_env.png"), dpi=70)
    plt.close(fig)

    # ---- clicks + DC
    d = np.abs(np.diff(mix[:, 0]))
    idx = np.argsort(d)[-8:]
    print("largest sample jumps (s, size):", [(round(float(i) / sr, 3), round(float(d[i]), 3)) for i in sorted(idx)])
    print("DC:", [round(float(v), 6) for v in mix.mean(0)])
    print("plots:", os.path.join(a.out, "audio_analysis.png"), os.path.join(a.out, "music_env.png"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
