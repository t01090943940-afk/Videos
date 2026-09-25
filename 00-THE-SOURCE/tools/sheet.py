#!/usr/bin/env python3
# 把 build/stills/*.jpg 拼成联系表：python3 tools/sheet.py [out.jpg] [cols] [thumbW]
import sys, glob
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
out = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'build' / 'sheet.jpg')
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4
tw = int(sys.argv[3]) if len(sys.argv) > 3 else 640
fs = sorted(glob.glob(str(ROOT / 'build' / 'stills' / '*.jpg')))
th = tw * 9 // 16
rows = (len(fs) + cols - 1) // cols
im = Image.new('RGB', (cols * tw, rows * (th + 18)), (40, 40, 40))
d = ImageDraw.Draw(im)
for i, f in enumerate(fs):
    x, y = (i % cols) * tw, (i // cols) * (th + 18)
    im.paste(Image.open(f).resize((tw, th), Image.LANCZOS), (x, y))
    d.text((x + 4, y + th + 3), Path(f).stem, fill=(255, 220, 0))
im.save(out, quality=88)
print(out, len(fs))
