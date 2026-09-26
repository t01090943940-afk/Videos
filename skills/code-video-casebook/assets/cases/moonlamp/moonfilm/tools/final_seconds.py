#!/usr/bin/env python3
"""
One frame per second from the finished MP4, as one labelled sheet  (补全：reconstructed from the conversation)

The last look before delivery: decode the delivered file itself (not the source JPEGs) at 1 fps
and tile the 28 frames, so the whole arc can be checked at a glance.

    python3 tools/final_seconds.py out/final.mp4        # -> out/qc/final_sec/s01.jpg … + out/qc/final_seconds.jpg

Requires ffmpeg + Pillow.
"""
import argparse
import glob
import os
import subprocess

from PIL import Image, ImageDraw


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4", nargs="?", default="out/final.mp4")
    ap.add_argument("--dir", default="out/qc/final_sec")
    ap.add_argument("--out", default="out/qc/final_seconds.jpg")
    a = ap.parse_args()
    os.makedirs(a.dir, exist_ok=True)
    for f in glob.glob(os.path.join(a.dir, "s*.jpg")):
        os.remove(f)
    subprocess.run(["ffmpeg", "-v", "error", "-i", a.mp4, "-vf", "fps=1,scale=480:-1", "-q:v", "3",
                    os.path.join(a.dir, "s%02d.jpg")], check=True)
    files = sorted(glob.glob(os.path.join(a.dir, "s*.jpg")))
    w, h, cols = 480, 270, 7
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * (h + 18)), (18, 18, 18))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        x, y = (i % cols) * w, (i // cols) * (h + 18)
        sheet.paste(Image.open(f), (x, y + 18))
        d.text((x + 4, y + 3), f"{i:02d}s", fill=(230, 230, 230))
    sheet.save(a.out, quality=88)
    print(a.out, len(files))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
