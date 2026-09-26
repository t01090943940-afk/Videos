import re, base64, io, json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = os.path.join(HERE,'video.src.html')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE,'video.html')
FS = os.path.join(HERE,'node_modules','@fontsource')
html = open(SRC, encoding='utf-8').read()

# 收集页面中出现的全部字符
chars = set(ch for ch in html if ord(ch) >= 32)
chars |= set('0123456789+×.:,·—/#%-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ')
text = ''.join(sorted(chars))

fonts = [
    ('MSZ', 'ma-shan-zheng', 400),
    ('KL', 'zcool-kuaile', 400),
    ('QK', 'zcool-qingke-huangyou', 400),
    ('LC', 'long-cang', 400),
    ('NSerif', 'noto-serif-sc', 400),
    ('NSerif', 'noto-serif-sc', 700),
    ('NSerif', 'noto-serif-sc', 900),
]
css = []
total = 0
for fam, pkg, wgt in fonts:
    for part in ('chinese-simplified', 'latin'):
        path = f'{FS}/{pkg}/files/{pkg}-{part}-{wgt}-normal.woff2'
        f = TTFont(path)
        cmap = f.getBestCmap()
        keep = [c for c in text if ord(c) in cmap]
        if not keep:
            continue
        opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']
        sub = subset.Subsetter(opts); sub.populate(text=''.join(keep)); sub.subset(f)
        buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
        b = buf.getvalue(); total += len(b)
        css.append(f"@font-face{{font-family:'{fam}';font-weight:{wgt};font-style:normal;font-display:block;src:url(data:font/woff2;base64,{base64.b64encode(b).decode()}) format('woff2');}}")
print('font bytes', total, 'chars', len(text))
html = html.replace('/*FONTS*/', '\n'.join(css), 1)
cjk = ''.join(c for c in text if ord(c) > 127 or c.isalnum())
html = html.replace('/*CHARS*/', 'const CHARS=' + json.dumps(cjk, ensure_ascii=False) + ';', 1)
open(OUT, 'w', encoding='utf-8').write(html)
print('wrote', OUT, len(html))
