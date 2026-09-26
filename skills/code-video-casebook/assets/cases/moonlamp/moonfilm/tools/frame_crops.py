#!/usr/bin/env python3
"""
Crops of the MP4 at chosen times, tiled 2 across  (补全：reconstructed from the conversation)

Used for the A/V-sync fix of the 加油 seal: decode the delivered MP4 just before, at, and after
the cue (SEAL.at = 25.5 s, where the "thump" sits) and check the seal has landed exactly at 25.50.

    python3 tools/frame_crops.py out/final.mp4                     # the seal check -> out/qc/seal_seq.jpg
    python3 tools/frame_crops.py out/final.mp4 --times 9.3,9.4,9.5,9.6 --crop 700,300,1300,700 --out out/qc/lanterns.jpg

Requires ffmpeg + Pillow.
"""
import argparse
import os
import subprocess

from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4", nargs="?", default="out/final.mp4")
    ap.add_argument("--times", default="25.30,25.50,25.62,26.00")
    ap.add_argument("--crop", default="1150,450,1750,850", help="x0,y0,x1,y1 in 1920x1080 pixels")
    ap.add_argument("--out", default="out/qc/seal_seq.jpg")
    ap.add_argument("--dir", default="out/qc/verify")
    a = ap.parse_args()
    os.makedirs(a.dir, exist_ok=True)
    box = tuple(map(int, a.crop.split(",")))
    cw, ch = box[2] - box[0], box[3] - box[1]
    times = a.times.split(",")
    ims = []
    for t in times:
        f = os.path.join(a.dir, f"crop_{t}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", a.mp4, "-frames:v", "1", "-q:v", "3", f], check=True)
        ims.append(Image.open(f).crop(box))
    rows = (len(ims) + 1) // 2
    s = Image.new("RGB", (2 * cw, rows * ch))
    for i, im in enumerate(ims):
        s.paste(im, ((i % 2) * cw, (i // 2) * ch))
    s.save(a.out)
    print(a.out, "times:", ", ".join(times))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
