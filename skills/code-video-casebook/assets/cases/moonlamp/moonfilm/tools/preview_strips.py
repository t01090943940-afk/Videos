#!/usr/bin/env python3
"""
Time-labelled contact sheets from preview frames  (补全：reconstructed from the conversation)

The best way to review motion, transitions and rhythm without watching the video: tile the
half-resolution preview frames (every 4th frame = 6 fps) with the time in seconds on each tile.
During production this was an inline command that wrote out/qc/strip_0.jpg … strip_3.jpg.

    python3 tools/preview_strips.py out/preview                       # -> out/qc/strip_<n>.jpg
    python3 tools/preview_strips.py out/preview2 --single out/qc/strip_trans.jpg

Frames must be named f00000.jpg … (as scripts/capture.mjs writes them). Requires Pillow.
"""
import argparse
import glob
import os

from PIL import Image, ImageDraw


def sheet(files, cols, w, fps):
    h = int(w * 9 / 16)
    rows = (len(files) + cols - 1) // cols
    s = Image.new("RGB", (cols * w, rows * (h + 18)), (20, 20, 20))
    d = ImageDraw.Draw(s)
    for i, f in enumerate(files):
        im = Image.open(f).resize((w, h))
        x, y = (i % cols) * w, (i // cols) * (h + 18)
        s.paste(im, (x, y + 18))
        fr = int(os.path.basename(f)[1:6])
        d.text((x + 4, y + 3), f"{fr / fps:.2f}s", fill=(230, 230, 230))
    return s


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frames_dir")
    ap.add_argument("--out-prefix", default="out/qc/strip")
    ap.add_argument("--single", help="write one sheet with every frame to this path instead")
    ap.add_argument("--per", type=int, default=42, help="frames per sheet")
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--width", type=int, default=400, help="tile width in px")
    ap.add_argument("--fps", type=float, default=24)
    a = ap.parse_args()
    files = sorted(glob.glob(os.path.join(a.frames_dir, "f*.jpg")))
    if not files:
        raise SystemExit(f"no f*.jpg in {a.frames_dir}")
    if a.single:
        os.makedirs(os.path.dirname(a.single) or ".", exist_ok=True)
        sheet(files, a.cols, a.width, a.fps).save(a.single, quality=88)
        print(a.single, len(files))
        return 0
    os.makedirs(os.path.dirname(a.out_prefix) or ".", exist_ok=True)
    for s in range(0, len(files), a.per):
        chunk = files[s:s + a.per]
        out = f"{a.out_prefix}_{s // a.per}.jpg"
        sheet(chunk, a.cols, a.width, a.fps).save(out, quality=88)
        print(out, len(chunk))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
