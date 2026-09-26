#!/usr/bin/env python3
"""
Rebuild the bundled font subsets in web/fonts/  (added for the source package)

All text in the film (subtitles, end title, the 加油 seal, the inscription, the book-spine titles)
is drawn on canvas with 'Noto Serif CJK SC' at weights 400 / 600 / 700 / 900. The original render
used the system copies of those fonts (Ubuntu packages fonts-noto-cjk + fonts-noto-cjk-extra,
Noto Serif CJK version 2.002). So that the project renders the same text on a machine without them,
web/film.html loads subsets of exactly those files through @font-face (scoped to the render page;
nothing is installed system-wide). This script regenerates the subsets.

    python3 scripts/make_fonts.py                       # uses /usr/share/fonts/opentype/noto
    python3 scripts/make_fonts.py --src-dir ~/Downloads/NotoSerifCJK   # .ttc collections or SC .otf files

Characters kept: printable ASCII + every non-ASCII character that appears anywhere in src/**/*.ts
(a superset of what the film draws). Run it again after changing any on-screen text.
All name-table records are kept, so the family stays 'Noto Serif CJK SC' with the right weights;
the original timestamps are kept too, so the output is byte-for-byte reproducible.
Requires fonttools:  pip install fonttools
"""
import argparse
import sys
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTCollection, TTFont
except ImportError:
    sys.exit("fonttools is required: pip install fonttools")

ROOT = Path(__file__).resolve().parent.parent
# CSS weight -> (file stem in the Noto CJK distribution, output name)
WEIGHTS = {
    400: ("Regular", "NotoSerifCJKsc-Regular.subset.otf"),
    600: ("SemiBold", "NotoSerifCJKsc-SemiBold.subset.otf"),
    700: ("Bold", "NotoSerifCJKsc-Bold.subset.otf"),
    900: ("Black", "NotoSerifCJKsc-Black.subset.otf"),
}


def charset() -> str:
    chars = {chr(c) for c in range(0x20, 0x7F)}
    for p in sorted((ROOT / "src").rglob("*.ts")):
        chars.update(ch for ch in p.read_text(encoding="utf-8") if ord(ch) > 0x7F and ch not in "\r\n\t")
    return "".join(sorted(chars))


def family_of(font: TTFont) -> str:
    n = font["name"]
    return n.getDebugName(16) or n.getDebugName(1) or ""


def load_sc(src_dir: Path, stem: str) -> TTFont:
    """The SC face of NotoSerifCJK-<stem>.ttc, or a stand-alone NotoSerifCJKsc-<stem>.otf."""
    ttc = src_dir / f"NotoSerifCJK-{stem}.ttc"
    otf = src_dir / f"NotoSerifCJKsc-{stem}.otf"
    if ttc.exists():
        coll = TTCollection(str(ttc), lazy=True)
        for i, f in enumerate(coll.fonts):
            if family_of(f).startswith("Noto Serif CJK SC"):
                return TTFont(str(ttc), fontNumber=i, recalcTimestamp=False)
        sys.exit(f"no 'Noto Serif CJK SC' face inside {ttc}")
    if otf.exists():
        return TTFont(str(otf), recalcTimestamp=False)
    sys.exit(f"missing {ttc.name} (or {otf.name}) in {src_dir}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src-dir", default="/usr/share/fonts/opentype/noto")
    ap.add_argument("--out-dir", default=str(ROOT / "web" / "fonts"))
    a = ap.parse_args()
    src_dir, out_dir = Path(a.src_dir).expanduser(), Path(a.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    text = charset()
    (out_dir / "charset.txt").write_text(text + "\n", encoding="utf-8")

    opts = subset.Options()
    opts.name_IDs = ["*"]          # keep family / subfamily / typographic names -> same CSS family
    opts.name_languages = ["*"]
    opts.name_legacy = True
    opts.layout_features = ["*"]   # same shaping as the full font
    opts.notdef_outline = True
    opts.recalc_bounds = False
    opts.prune_unicode_ranges = False

    for weight, (stem, out_name) in WEIGHTS.items():
        font = load_sc(src_dir, stem)
        version = font["name"].getDebugName(5)
        sub = subset.Subsetter(options=opts)
        sub.populate(text=text)
        sub.subset(font)
        missing = [ch for ch in text if ord(ch) > 0x7F and ord(ch) not in font.getBestCmap()]
        font.save(str(out_dir / out_name))
        size = (out_dir / out_name).stat().st_size
        print(f"{weight}  {out_name:40s} {size / 1024:7.1f} KB  glyphs={len(font.getGlyphOrder())}  ({version})")
        if missing:
            # only characters from code comments may be missing; anything drawn on screen must be present
            print("     not in font (comment-only characters are fine):", " ".join(f"U+{ord(c):04X}" for c in missing))
    print(f"{len(text)} characters -> {out_dir / 'charset.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
