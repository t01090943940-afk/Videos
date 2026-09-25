#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  ship.py · 母版 → 交付
#    renders/master_1080p120.mkv（近无损 4:4:4）+ build/score.wav
#    → renders/THE-SOURCE_1080p60.mp4   H.264 High · 60fps（120 帧两两融合 = 真实运动模糊）
#    → renders/THE-SOURCE_1080p120.mp4  HEVC Main · 120fps（hvc1，Apple/主流播放器可播）
#    → renders/poster.jpg
#  两个文件都用两遍编码压在 95 MB 以内（GitHub 单文件上限 100 MB）。
# ─────────────────────────────────────────────────────────────────────────────
import subprocess, sys, os
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
R = ROOT / 'renders'
MASTER = R / 'master_1080p120.mkv'
WAV = ROOT / 'build' / 'score.wav'
DUR = 66.0
LIMIT_MB = 94
AUDIO_K = 256
FF = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y']

def vbit():
    return int((LIMIT_MB * 8 * 1024 * 1024 / DUR) / 1000 - AUDIO_K - 150)  # kbps，留 150k 容器余量

def run(args):
    print(' '.join(map(str, args))[:220], '…')
    subprocess.run(args, check=True)

def two_pass(vf, codec, extra, out, fps):
    br = vbit()
    log = str(ROOT / 'build' / f'2pass_{codec}')
    common = ['-i', MASTER, '-vf', vf, '-r', str(fps), '-pix_fmt', 'yuv420p', '-c:v', codec, '-b:v', f'{br}k',
              '-maxrate', f'{int(br * 1.8)}k', '-bufsize', f'{br * 3}k', '-color_primaries', 'bt709', '-color_trc', 'bt709',
              '-colorspace', 'bt709', *extra]
    if codec == 'libx265':
        p1 = [*FF, *common, '-x265-params', f'pass=1:stats={log}.log:log-level=error', '-an', '-f', 'null', '-']
        p2 = [*FF, *common, '-x265-params', f'pass=2:stats={log}.log:log-level=error', '-i', WAV, '-map', '0:v', '-map', '1:a',
              '-c:a', 'aac', '-b:a', f'{AUDIO_K}k', '-movflags', '+faststart', '-tag:v', 'hvc1', '-shortest', out]
    else:
        p1 = [*FF, *common, '-pass', '1', '-passlogfile', log, '-an', '-f', 'null', '-']
        p2 = [*FF, *common, '-pass', '2', '-passlogfile', log, '-i', WAV, '-map', '0:v', '-map', '1:a',
              '-c:a', 'aac', '-b:a', f'{AUDIO_K}k', '-movflags', '+faststart', '-shortest', out]
    run(p1); run(p2)
    print(out.name, f'{out.stat().st_size / 1e6:.1f} MB')

which = sys.argv[1:] or ['60', '120', 'poster']
if '60' in which:
    two_pass('tmix=frames=2:weights=1 1,select=not(mod(n\\,2)),setpts=N/60/TB', 'libx264',
             ['-preset', 'slow', '-profile:v', 'high', '-level', '4.2', '-tune', 'grain', '-g', '120', '-bf', '3'],
             R / 'THE-SOURCE_1080p60.mp4', 60)
if '120' in which:
    two_pass('null', 'libx265', ['-preset', 'medium', '-g', '240'], R / 'THE-SOURCE_1080p120.mp4', 120)
if 'poster' in which:
    run([*FF, '-ss', '51.2', '-i', MASTER, '-frames:v', '1', '-q:v', '2', R / 'poster.jpg'])
