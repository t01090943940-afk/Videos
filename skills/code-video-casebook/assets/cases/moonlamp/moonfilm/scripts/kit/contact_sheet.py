#!/usr/bin/env python3
"""Tile rendered keyframes into one labeled contact sheet for visual QC.

usage: python contact_sheet.py <frames_dir> <out.jpg> [--columns 3] [--width 1600]
       python contact_sheet.py <dir_of_dirs> <out.jpg> --rows   # one row per subfolder (e.g. one per style)
Frames are sorted by the trailing _<frame> number (else by name); the stem becomes the label (e.g. S03-b_0180).
Requires Pillow (pip install pillow).
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required: pip install pillow")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frames_dir")
    ap.add_argument("out")
    ap.add_argument("--columns", type=int, default=3)
    ap.add_argument("--width", type=int, default=1600, help="sheet width in px")
    ap.add_argument("--rows", action="store_true", help="each subfolder becomes one labeled row")
    a = ap.parse_args()

    def order(p: Path):
        # keyframes.mjs names files <label>_<frame>.jpg — sort by frame so shots stay in film order
        tail = p.stem.rsplit("_", 1)[-1]
        return (int(tail), p.name) if tail.isdigit() else (10**9, p.name)

    imgs = lambda d: sorted((p for p in Path(d).iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}), key=order)
    if a.rows:
        groups = [(d.name, imgs(d)) for d in sorted(Path(a.frames_dir).iterdir()) if d.is_dir()]
        groups = [(n, f) for n, f in groups if f]
        if not groups:
            sys.exit(f"no image subfolders in {a.frames_dir}")
        a.columns = max(len(f) for _, f in groups)
        files = [f for _, fs in groups for f in fs + [None] * (a.columns - len(fs))]
        row_names = [n for n, _ in groups]
    else:
        files = imgs(a.frames_dir)
        row_names = None
    if not files:
        sys.exit(f"no images in {a.frames_dir}")
    cols = max(1, a.columns)
    rows = (len(files) + cols - 1) // cols
    first = Image.open(next(f for f in files if f))
    cell_w = a.width // cols
    cell_h = round(cell_w * first.height / first.width)
    label_h = 22
    sheet = Image.new("RGB", (cell_w * cols, (cell_h + label_h) * rows), (18, 18, 20))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
    for i, f in enumerate(files):
        if f is None:
            continue
        im = Image.open(f).convert("RGB").resize((cell_w, cell_h))
        x, y = (i % cols) * cell_w, (i // cols) * (cell_h + label_h)
        sheet.paste(im, (x, y + label_h))
        label = f"{row_names[i // cols]} · {f.stem}" if row_names else f.stem
        draw.text((x + 6, y + 4), label, fill=(235, 235, 235), font=font)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    sheet.save(a.out, quality=88)
    print(f"{a.out}: {len(files)} frames, {cols}x{rows}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
