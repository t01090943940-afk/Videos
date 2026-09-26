#!/usr/bin/env python3
"""
Create a stop-motion-3d project from the bundled template (runtime + 7 looks + studio world +
sample episode + capture harness + sandbox viewer).

  python3 init_project.py <dir> [--title "My Film"] [--episode promo|story] [--install] [--no-build]

  --episode promo   the 60 s six-look skill promo (default; montage template)
  --episode story   a 30 s single-look short (comic, night) reusing the same world
  --install         npm install (needs network once) and build web/dist/*
Afterwards:  cd <dir> && python3 <skill>/scripts/validate.py . --timeline
"""
import argparse, json, re, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TPL = HERE.parent / "assets" / "template"
EXAMPLES = HERE.parent / "assets" / "examples"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--title", default=None)
    ap.add_argument("--episode", choices=["promo", "story"], default="promo")
    ap.add_argument("--install", action="store_true")
    ap.add_argument("--no-build", action="store_true")
    a = ap.parse_args()
    dst = Path(a.dir).resolve()
    if dst.exists() and any(dst.iterdir()):
        sys.exit(f"{dst} exists and is not empty")
    shutil.copytree(TPL, dst, ignore=shutil.ignore_patterns("node_modules", "out", "dist"), dirs_exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", (a.title or dst.name).lower()).strip("-") or "stopmo-film"
    pkg = json.loads((dst / "package.json").read_text())
    pkg["name"] = slug
    (dst / "package.json").write_text(json.dumps(pkg, indent=2) + "\n")
    ep_path = dst / "src/episode/episode.json"
    if a.episode == "story":
        shutil.copy(EXAMPLES / "story-episode.json", ep_path)
    if a.title:
        ep = json.loads(ep_path.read_text())
        ep["title"] = a.title
        ep_path.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
    for d in ("out/frames", "out/qc", "out/audio", "out/logs"):
        (dst / d).mkdir(parents=True, exist_ok=True)
    print(f"created {dst}  (episode template: {a.episode})")
    if a.install:
        subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=dst, check=True)
        if not a.no_build:
            subprocess.run(["npm", "run", "-s", "build"], cwd=dst, check=True)
            print("built web/dist/film.js + sandbox.js")
    print("next: validate.py . --timeline → capture.mjs --meta → stills → full render → audio.py → finalize.py")


if __name__ == "__main__":
    main()
