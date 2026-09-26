#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  prep.py · 把整个仓库"读"一遍，变成总片要用的素材与数据
#
#  输入：仓库里的一切（00-supercut-trailer 已切好的镜头代理、各作品源码包、
#        CoExp 复盘文档、AI_BEYOND 工程包里的原片、kimi / AI:RISE 源码包里的音效）
#  输出（全部落在 00-THE-SOURCE/assets/，可随时删掉重跑）：
#    frames/<clip>/0001.jpg …   每个镜头代理逐帧 JPEG（WebGL 逐帧取纹理，确定性）
#    atlas/mosaic.jpg           28 部 × 12 帧 = 336 格小帧图集（"通通开源"马赛克）
#    data/code.json             每部作品的真实源码行（代码字形 / 瀑布用）
#    data/tree.json             所有源码包里的真实文件路径
#    data/stats.json            仓库实测统计（行数 / 文件数 / 字数 …）
#    sfx/*.wav                  源码包里的真实音效，统一 48k 立体声
#
#  用法：python3 tools/prep.py [--force]
# ─────────────────────────────────────────────────────────────────────────────
import io, json, os, re, subprocess, sys, tarfile, zipfile, glob, shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
TRAILER = REPO / '00-supercut-trailer'
CLIPS = TRAILER / 'assets' / 'clips'
A = ROOT / 'assets'
FORCE = '--force' in sys.argv
FF = shutil.which('ffmpeg') or 'ffmpeg'

for d in ['frames', 'atlas', 'data', 'sfx', 'tmp']:
    (A / d).mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(ROOT / 'tools'))
from works import WORKS  # noqa: E402

def ff(*args):
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)

# ── 1. 镜头代理 → 逐帧 JPEG ─────────────────────────────────────────────────
def extract(src, out_dir, extra=None, q=2):
    out_dir = Path(out_dir)
    if out_dir.exists() and any(out_dir.iterdir()) and not FORCE:
        return
    out_dir.mkdir(parents=True, exist_ok=True)
    ff(*(extra or []), '-i', src, '-q:v', q, '-start_number', 0, out_dir / '%04d.jpg')

jobs = []
for f in sorted(CLIPS.glob('*.mp4')):
    jobs.append((f, A / 'frames' / f.stem, None, 3 if f.stem.startswith(('wall-', 'grid-')) else 2))

# AI_BEYOND 工程包里带着 120s 原片：十五个世界，每个 8 s，从每个世界中段取 1.3 s
beyond_mp4 = A / 'tmp' / 'beyond.mp4'
if not beyond_mp4.exists():
    z = zipfile.ZipFile(REPO / 'gpt-15-style-ai-beyond-generation' / 'AI_BEYOND_GENERATION_Project.zip')
    beyond_mp4.write_bytes(z.read('AI_BEYOND_GENERATION/AI_BEYOND_GENERATION_1080p.mp4'))
for k in range(15):
    t0 = k * 8 + 3.4
    jobs.append((beyond_mp4, A / 'frames' / f'bw{k:02d}', ['-ss', f'{t0:.3f}', '-t', '1.3'], 2))

with ThreadPoolExecutor(4) as ex:
    list(ex.map(lambda j: extract(*j), jobs))
print('frames:', len(jobs), 'clips')

# ── 2. 马赛克图集：28 部 × 12 帧 ──────────────────────────────────────────
TW, TH, PER = 160, 90, 12
atlas_path = A / 'atlas' / 'mosaic.jpg'
if FORCE or not atlas_path.exists():
    atlas = Image.new('RGB', (TW * PER, TH * len(WORKS)))
    for r, w in enumerate(WORKS):
        fr = sorted((A / 'frames' / f"wall-{w['key']}").glob('*.jpg'))
        for c in range(PER):
            im = Image.open(fr[int(c * (len(fr) - 1) / (PER - 1))]).convert('RGB')
            im = im.resize((TW, TH), Image.LANCZOS)
            atlas.paste(im, (c * TW, r * TH))
    atlas.save(atlas_path, quality=92)
    # 同时给每部作品存一张 480×270 海报（隧道 / 画廊用）
    for w in WORKS:
        fr = sorted((A / 'frames' / f"wall-{w['key']}").glob('*.jpg'))
        Image.open(fr[len(fr) // 2]).convert('RGB').resize((480, 270), Image.LANCZOS).save(A / 'atlas' / f"{w['key']}.jpg", quality=92)
print('atlas:', atlas_path)

# ── 3. 读所有源码包：文件树、真实代码行、行数统计 ───────────────────────────
CODE_EXT = ('.py', '.js', '.mjs', '.ts', '.html', '.css', '.glsl', '.sh')

def read_archive(path):
    """yield (name, bytes|None, size)"""
    if str(path).endswith('.tgz'):
        t = tarfile.open(path)
        for m in t.getmembers():
            if m.isfile():
                yield m.name.lstrip('./'), (lambda m=m: t.extractfile(m).read()), m.size
    else:
        z = zipfile.ZipFile(path)
        for i in z.infolist():
            if not i.is_dir() and '__MACOSX' not in i.filename:
                yield i.filename, (lambda n=i.filename: z.read(n)), i.file_size

archives = sorted(p for p in list(REPO.glob('*/*.zip')) + list(REPO.glob('*/*.tgz')) + list(REPO.glob('*/*.skill'))
                  if p.name != 'stop-motion-3d.zip' and p.parent.name != ROOT.name and p.parent.name != TRAILER.name)
tree, loc_total, files_total, code_files = [], 0, 0, {}
for arc in archives:
    folder = arc.parent.name
    for name, getb, size in read_archive(arc):
        files_total += 1
        tree.append(f'{folder}/{name}')
        if name.endswith(CODE_EXT) and 'node_modules' not in name and size < 400_000 and 'package-lock' not in name:
            txt = getb().decode('utf8', 'ignore')
            loc_total += txt.count('\n')
            code_files[f'{folder}::{name}'] = txt

# CoExp 复盘：字数 + 代码块
coexp = sorted(REPO.glob('*/*CoExp*.md'))
coexp_chars = 0
coexp_han = 0
coexp_blocks = {}
coexp_heads = []
for md in coexp:
    s = md.read_text('utf8')
    coexp_chars += len(s)
    coexp_han += len(re.findall(r'[一-鿿]', s))
    coexp_blocks[md.parent.name] = '\n'.join(re.findall(r'```[a-zA-Z]*\n(.*?)```', s, re.S))
    for h in re.findall(r'^#{2,4} (.+)$', s, re.M):
        h = h.strip().strip('*')
        if 6 <= len(h) <= 34:
            coexp_heads.append({'w': md.parent.name, 'h': h})

def pick(folder, *needles):
    """从某个源码包里挑文件，按 needles 顺序拼接"""
    out = []
    for n in needles:
        for k, v in code_files.items():
            f, name = k.split('::', 1)
            if f == folder and name.endswith(n):
                out.append(v)
                break
    return '\n'.join(out)

SRC = {
    'kimi-beat': pick('kimi-ai-beat-sync', '04-f4-drop.html', '03-f3-montage.html'),
    'ai-rise': pick('swe-ai-rise', 'scenes_v2.js', 'main_v2.js'),
    'kimi-film': pick('swe-kimi-source-intro', 'scenes.py', 'kit.py'),
    'cosmos30': pick('gpt-universe-30-change', 'COSMOS/render.py'),
    'beyond': pick('gpt-15-style-ai-beyond-generation', 'source/art.py', 'source/nativegl.py'),
    'gpt-autumn': pick('gpt-mid-autumn-general-video', 'src/film60.py'),
    'moon-letter': pick('gpt-mid-autumn-for-my-dg03', 'audio/score.py', 'scripts/kit/audio.py'),
    'shatter': coexp_blocks.get('opus-broken-reround', ''),
    'oneink': pick('opus-oneink', 'main.js'),
    'dingge': pick('opus-factory-safety-videos', 'film/shots.ts', 'film/mg.ts', 'world/crane.ts'),
    'claude15': pick('opus-claude-intro-with-15-way', 'scenes_a.py'),
    'protocom': pick('opus-production-video-protocom-intro', 'src/act1.js', 'src/act3.js'),
    'codecosmos': pick('opus-universe-history-video', 'web/scenes_a.js', 'web/scenes_b.js'),
    'phasegate': coexp_blocks.get('opus-production-video-ai-phase-skill', ''),
    'ageint': pick('opus-age-of-intelligence', 'src/scenes.py', 'src/core.py'),
    'skillshub': pick('opus-production-video-skill-hub', 'scenes/chaos.js', 'js/fx.js'),
    'f12': pick('opus-F12-teaching', 'video.html'),
    'hust1037': coexp_blocks.get('opus-1037-hust-story', ''),
    'xuanlan': coexp_blocks.get('opus-introduction-video-xuanlan', ''),
    'studysolo': coexp_blocks.get('opus-production-video-studysolo', ''),
    'yusheng': coexp_blocks.get('opus-production-video-ys-blog', ''),
    'shuchenglin': pick('opus-shuchenglin-into', 'comp/timeline.js'),
    'stopmotion': pick('skill-方块系列定格动画', 'scripts/validate.py', 'scripts/audio.py'),
    'samemoon': coexp_blocks.get('opus-mid-autumn-genergal-videos', ''),
    'gongcishi': coexp_blocks.get('opus-mid-autumn-highschool-videos', ''),
    'moonlamp': coexp_blocks.get('opus-mid-autumn-for-my-dg02', ''),
    'readclub': pick('opus-hust-read-join-video-v1', 'video.src.html'),
    'senpai': coexp_blocks.get('opus-mid-autumn-for-my-dg01', ''),
}

def clean(txt, n=900):
    """代码字形网格要求等宽：去掉非 ASCII、制表符转空格、去空行、截断过长行"""
    out = []
    for ln in txt.splitlines():
        ln = ln.replace('\t', '  ')
        ln = re.sub(r'[^\x20-\x7e]', '', ln).rstrip()
        if len(ln.strip()) < 3:
            continue
        if len(ln) > 400:
            ln = ln[:400]
        out.append(ln)
        if len(out) >= n:
            break
    return out

code = {}
for w in WORKS:
    lines = clean(SRC.get(w['key'], ''))
    if len(lines) < 60:  # 兜底：用它自己文件夹的 CoExp 代码块
        lines += clean(coexp_blocks.get(w['folder'], ''))
    assert len(lines) >= 20, (w['key'], len(lines))
    code[w['key']] = lines
(A / 'data' / 'code.json').write_text(json.dumps(code, ensure_ascii=False), encoding='utf-8')
(A / 'data' / 'tree.json').write_text(json.dumps(sorted(tree), ensure_ascii=False), encoding='utf-8')
(A / 'data' / 'heads.json').write_text(json.dumps(coexp_heads, ensure_ascii=False), encoding='utf-8')

stats = {
    'films': len(WORKS),
    'archives': len(archives),
    'files': files_total,
    'loc': loc_total,
    'coexp': len(coexp),
    'coexpChars': coexp_chars,
    'coexpHan': coexp_han,
    'heads': len(coexp_heads),
}
(A / 'data' / 'stats.json').write_text(json.dumps(stats, ensure_ascii=False, indent=1), encoding='utf-8')
print('stats:', stats)

# ── 4. 真实音效（kimi-ai-beat-sync / swe-ai-rise 源码包里带的 SFX）──────────
SFX = {
    'kimi-ai-beat-sync/ai-beat-sync-src.zip': ['impact-bass-1', 'impact-bass-2', 'whoosh-cinematic', 'whoosh-short',
                                               'riser', 'glitch-1', 'glitch-2', 'glitch-3', 'key-press', 'typing', 'click'],
    'swe-ai-rise/ai_rise_source.zip': ['sfx_1143', 'sfx_788', 'sfx_2908', 'sfx_2595', 'sfx_1044', 'sfx_1093', 'sfx_2608',
                                       'sfx_1088', 'sfx_2150', 'sfx_2521', 'sfx_2672', 'sfx_1039', 'sfx_2507', 'sfx_1486',
                                       'sfx_561', 'sfx_784', 'sfx_2297', 'sfx_2902', 'sfx_790', 'sfx_3116', 'sfx_1490',
                                       'sfx_1492', 'sfx_2964', 'sfx_175', 'sfx_900', 'sfx_2520', 'sfx_2637', 'sfx_1457',
                                       ],
}
for arc, names in SFX.items():
    z = zipfile.ZipFile(REPO / arc)
    for info in z.infolist():
        stem = Path(info.filename).stem
        if info.filename.endswith('.mp3') and stem in names:
            out = A / 'sfx' / f'{stem}.wav'
            if out.exists() and not FORCE:
                continue
            tmp = A / 'tmp' / f'{stem}.mp3'
            tmp.write_bytes(z.read(info.filename))
            ff('-i', tmp, '-ar', 48000, '-ac', 2, '-c:a', 'pcm_s16le', out)
print('sfx:', len(list((A / 'sfx').glob('*.wav'))))

# ── 5. 帧清单（渲染器据此把时间映射到帧号）──────────────────────────────────
man = {}
for d in sorted((A / 'frames').iterdir()):
    fr = sorted(d.glob('*.jpg'))
    if fr:
        w, h = Image.open(fr[0]).size
        man[d.name] = {'n': len(fr), 'w': w, 'h': h}
(A / 'data' / 'frames.json').write_text(json.dumps(man), encoding='utf-8')
print('manifest:', len(man))
