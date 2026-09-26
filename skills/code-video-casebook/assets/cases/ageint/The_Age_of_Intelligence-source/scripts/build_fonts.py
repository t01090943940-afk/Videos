"""[补全] Rebuild fonts/*.ttf from the @fontsource npm packages (the session did this with inline commands).

1) woff -> ttf for the Latin fonts
2) Noto Sans SC ships as 102 unicode-range subsets per weight -> merged into one TTF per weight
   (copy glyf/hmtx entries under uXXXXX names, decompose composites, rebuild cmap 4 + 12, drop GSUB/GPOS/GDEF)
usage (from repo root, after `npm install`):  python3 scripts/build_fonts.py
"""
import glob, os
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib.tables import _c_m_a_p
from fontTools.ttLib.tables._c_m_a_p import cmap_format_12

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, 'node_modules', '@fontsource')
OUT = os.path.join(ROOT, 'fonts')
TMP = os.path.join(ROOT, 'build', 'sc_subsets')
os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)

want = {'anton': 'anton/files/anton-latin-400-normal.woff',
        'bebas': 'bebas-neue/files/bebas-neue-latin-400-normal.woff'}
for w in [400, 500, 700]:
    want[f'grotesk{w}'] = f'space-grotesk/files/space-grotesk-latin-{w}-normal.woff'
for w in [400, 700, 800]:
    want[f'mono{w}'] = f'jetbrains-mono/files/jetbrains-mono-latin-{w}-normal.woff'
for w in [300, 400, 600, 800, 900]:
    want[f'inter{w}'] = f'inter/files/inter-latin-{w}-normal.woff'
for w in [800, 900]:
    want[f'unbounded{w}'] = f'unbounded/files/unbounded-latin-{w}-normal.woff'
for k, p in want.items():
    f = TTFont(os.path.join(NM, p)); f.flavor = None; f.save(os.path.join(OUT, f'{k}.ttf'))
print('latin fonts ok:', len(want))

for w in [500, 700, 900]:
    subs = sorted(glob.glob(os.path.join(NM, 'noto-sans-sc', 'files', f'noto-sans-sc-*-{w}-normal.woff')))
    paths = []
    for p in subs:
        f = TTFont(p); f.flavor = None
        q = os.path.join(TMP, os.path.basename(p).replace('.woff', '.ttf')); f.save(q); paths.append(q)
    base = TTFont(paths[0])
    for t in ['GSUB', 'GPOS', 'GDEF']:
        if t in base:
            del base[t]
    glyf = base['glyf']; hmtx = base['hmtx']; order = list(base.getGlyphOrder()); cmap = {}
    for p in paths:
        f = TTFont(p); fg = f['glyf']; fh = f['hmtx']
        for cp, gn in f.getBestCmap().items():
            if cp in cmap:
                continue
            new = f'u{cp:05X}'
            g = fg[gn]
            if g.isComposite():
                pen = TTGlyphPen(f.getGlyphSet()); f.getGlyphSet()[gn].draw(pen); g = pen.glyph()
            glyf.glyphs[new] = g; hmtx.metrics[new] = fh[gn]; order.append(new); cmap[cp] = new
    base.setGlyphOrder(order); glyf.glyphOrder = order
    t = _c_m_a_p.table__c_m_a_p(); t.tableVersion = 0
    s12 = cmap_format_12(12); s12.platformID = 3; s12.platEncID = 10; s12.format = 12
    s12.reserved = 0; s12.length = 0; s12.language = 0; s12.cmap = cmap
    s4 = _c_m_a_p.CmapSubtable.newSubtable(4); s4.platformID = 3; s4.platEncID = 1; s4.language = 0
    s4.cmap = {k: v for k, v in cmap.items() if k < 0x10000}
    t.tables = [s4, s12]; base['cmap'] = t
    base['maxp'].numGlyphs = len(order)
    if 'post' in base:
        base['post'].formatType = 3.0
    base.save(os.path.join(OUT, f'notosc{w}.ttf'))
    print(f'notosc{w}.ttf: {len(subs)} subsets merged, {len(cmap)} chars')

dv = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
if not os.path.exists(os.path.join(OUT, 'DejaVuSans.ttf')) and os.path.exists(dv):
    import shutil; shutil.copy(dv, OUT)
