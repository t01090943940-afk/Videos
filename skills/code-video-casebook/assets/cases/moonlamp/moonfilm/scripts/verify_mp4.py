#!/usr/bin/env python3
"""Independent check of the delivered MP4: streams, duration, and a contact sheet of frames
decoded FROM THE MP4 at every subtitle line + the end card (so type/encoding is verified on
the actual file, not on the source JPEGs)."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw

mp4 = Path(sys.argv[1] if len(sys.argv) > 1 else "out/final.mp4")
meta = json.load(open("out/meta.json"))
out = Path("out/qc/verify")
out.mkdir(parents=True, exist_ok=True)

pj = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)], capture_output=True, text=True).stdout)
v = next(s for s in pj["streams"] if s["codec_type"] == "video")
a = next(s for s in pj["streams"] if s["codec_type"] == "audio")
info = {
    "container_duration_s": float(pj["format"]["duration"]),
    "video": f'{v["codec_name"]} {v.get("profile")} {v["width"]}x{v["height"]} {v["pix_fmt"]} {v["r_frame_rate"]}',
    "audio": f'{a["codec_name"]} {a.get("profile")} {a["sample_rate"]} Hz {a["channels"]} ch',
    "size_MB": round(int(pj["format"]["size"]) / 1e6, 2),
}
print(json.dumps(info, ensure_ascii=False, indent=1))

times = []
for s in meta["cues"]["subs"]:
    last = s["segs"][-1]
    times.append((s["id"], min(s["out"] - 0.05, last["at"] + 0.9)))
times += [("TITLE", 25.2), ("SEAL", 26.6), ("END", 27.9)]
tiles = []
for name, t in times:
    f = out / f"{name}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", "-q:v", "3", str(f)], check=True)
    tiles.append((name, t, f))
W, H = 640, 360
cols = 3
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 22)), (18, 18, 18))
d = ImageDraw.Draw(sheet)
for i, (name, t, f) in enumerate(tiles):
    im = Image.open(f).resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    sheet.paste(im, (x, y + 22))
    d.text((x + 6, y + 5), f"{name} @ {t:.2f}s (decoded from MP4)", fill=(235, 235, 235))
sheet.save("out/qc/verify_sheet.jpg", quality=90)
print("out/qc/verify_sheet.jpg")
