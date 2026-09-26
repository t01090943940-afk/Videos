#!/usr/bin/env python3
# 配乐可视化验收：频谱图 + 短时响度曲线 + 段落/拍线 → build/audio_report.png
import json, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
C = json.loads((ROOT / 'build' / 'cues.json').read_text())
w = wave.open(str(ROOT / 'build' / 'score.wav'))
n, sw = w.getnframes(), w.getsampwidth()
raw = np.frombuffer(w.readframes(n), np.uint8).reshape(-1, 3)
x = (raw[:, 0].astype(np.int32) | (raw[:, 1].astype(np.int32) << 8) | (raw[:, 2].astype(np.int32) << 16))
x = np.where(x >= 1 << 23, x - (1 << 24), x).reshape(-1, 2).astype(np.float32) / (1 << 23)
m = x.mean(1); SR = 48000
Wd, Hs, Hl = 2400, 500, 220
hop = len(m) // Wd; win = 4096
spec = np.zeros((Hs, Wd))
fr = np.fft.rfftfreq(win, 1 / SR)
ybins = np.geomspace(30, 16000, Hs + 1)
for i in range(Wd):
    s = m[i * hop:i * hop + win]
    if len(s) < win: s = np.pad(s, (0, win - len(s)))
    p = np.abs(np.fft.rfft(s * np.hanning(win))) ** 2
    idx = np.searchsorted(fr, ybins)
    spec[:, i] = [p[idx[k]:max(idx[k + 1], idx[k] + 1)].mean() for k in range(Hs)]
db = 10 * np.log10(spec + 1e-12); db = np.clip((db - db.max() + 80) / 80, 0, 1)
img = np.zeros((Hs, Wd, 3), np.uint8)
img[..., 0] = (np.clip(db * 1.5, 0, 1) * 255); img[..., 1] = (np.clip(db * 1.5 - 0.5, 0, 1) * 255); img[..., 2] = (np.clip(db * 3 - 2, 0, 1) * 255 + db * 60).clip(0, 255)
img = img[::-1]
im = Image.new('RGB', (Wd, Hs + Hl + 40), (10, 10, 12)); im.paste(Image.fromarray(img), (0, 0))
d = ImageDraw.Draw(im)
# 短时响度（400ms RMS, dBFS）
blk = int(0.4 * SR); step = int(0.05 * SR)
pts = []
for i in range(0, len(m) - blk, step):
    r = np.sqrt((x[i:i + blk] ** 2).mean()) + 1e-9
    pts.append((i / len(m) * Wd, Hs + Hl - (np.clip(20 * np.log10(r), -60, 0) + 60) / 60 * Hl))
d.line(pts, fill=(255, 200, 80), width=2)
dur = len(m) / SR
for s in C['SECTIONS']:
    X = s['b0'] * C['BEAT'] / dur * Wd
    d.line([(X, 0), (X, Hs + Hl)], fill=(90, 200, 255), width=1)
    d.text((X + 3, Hs + Hl + 5), s['id'], fill=(90, 200, 255))
for db_ in (-6, -12, -24, -48):
    Y = Hs + Hl - (db_ + 60) / 60 * Hl
    d.line([(0, Y), (Wd, Y)], fill=(50, 50, 55)); d.text((2, Y - 12), f'{db_}dB', fill=(120, 120, 120))
im.save(ROOT / 'build' / 'audio_report.png')
print('ok')
