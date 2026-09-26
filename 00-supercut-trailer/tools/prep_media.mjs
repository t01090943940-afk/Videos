#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  prep_media.mjs · 把 28 部原片切成本片要用的代理素材
//
//  为什么要预切：原片里有 4K60（protocom）、1440p60（定格 566MB）等大文件，
//  直接塞进 HyperFrames 会让帧抽取极慢。这里按 EDL 精确切出每个镜头需要的
//  那一小段（+0.3s 余量），统一 30fps / H.264 / 短 GOP / 无音轨。
//
//  产物：
//    assets/clips/<shotId>.mp4      每个镜头一段
//    assets/clips/grid-cosmos.mp4   COSMOS 全片 640×360（16 格宫格共用，不同 media-start）
//    assets/clips/wall-<key>.mp4    28 宫格巨墙，每部 3.4s，480×270
//    assets/posters/<key>.jpg       28 张海报（隧道 / 爆散 / 吸入文件夹用）
//    build/qa/contact-shots.jpg     所有镜头中间帧联系表（给验收用）
//    build/qa/contact-wall.jpg      28 张海报联系表
//
//  用法：node tools/prep_media.mjs [--force] [--only=h01,w03]
// ─────────────────────────────────────────────────────────────────────────────
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS, byKey } from '../src/catalog.mjs';
import { SHOTS, GRID, WALL, BEAT, clipSpan } from '../src/edl.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const FORCE = process.argv.includes('--force');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const JOBS = Math.max(2, Math.min(6, (await import('node:os')).cpus().length >> 1));

const P = (...a) => path.join(ROOT, ...a);
for (const d of ['assets/clips', 'assets/posters', 'build/qa']) fs.mkdirSync(P(d), { recursive: true });

const srcOf = (key) => {
  const w = byKey[key];
  if (!w) throw new Error(`catalog 里没有 ${key}`);
  const f = path.join(REPO, w.folder, w.file);
  if (!fs.existsSync(f)) throw new Error(`找不到源文件：${f}`);
  return f;
};

// ── 滤镜 ──────────────────────────────────────────────────────────────────
const cover = (w, h) => `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h},setsar=1`;
// 竖屏源 → 横屏格子：模糊铺底 + 居中原画（不裁掉内容）
const blurPad = (w, h) =>
  `split[a][b];[a]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},boxblur=24:2,eq=brightness=-0.18:saturation=1.2[bg];` +
  `[b]scale=-2:${h}:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:0,setsar=1`;

const SIZE = {
  win: [1280, 720],
  full: [1920, 1080],
  duoL: [1920, 1080],
  split: [1280, 720],
  phone: [608, 1080],
  phoneR: [608, 1080],
  pair: [1280, 720],
};

function run(args, label) {
  return new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (c) => (c === 0 ? res() : rej(new Error(`[${label}] ffmpeg 失败\n${err}`))));
  });
}

const ENC = (crf) => ['-an', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-g', '15', '-bf', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

function clipJob({ id, key, inSec, dur, w, h, crf = 16 }) {
  const out = P('assets/clips', `${id}.mp4`);
  if (!FORCE && fs.existsSync(out)) return null;
  const vertSrc = !!byKey[key].vertical;
  const vertOut = h > w;
  // 竖屏源进横屏格子 → blurPad；横屏源进竖屏手机 → cover 居中裁；同向 → cover
  const vf = vertSrc && !vertOut ? blurPad(w, h) : cover(w, h);
  const useComplex = vf.includes('[');
  return () =>
    run(
      ['-ss', inSec.toFixed(3), '-t', dur.toFixed(3), '-i', srcOf(key), ...(useComplex ? ['-filter_complex', vf] : ['-vf', vf]), ...ENC(crf), out],
      id,
    );
}

// 海报：<key>.jpg 取 wallIn+1.2s（隧道/爆散/吸入用）
//       <key>-end.jpg 取巨墙片段的最后一帧附近（b104 音乐骤停时，巨墙"冻结"成这张，无跳帧）
function posterJob(w, suffix, at) {
  const out = P('assets/posters', `${w.key}${suffix}.jpg`);
  if (!FORCE && fs.existsSync(out)) return null;
  const vf = w.vertical ? blurPad(640, 360) : cover(640, 360);
  return () =>
    run(['-ss', at.toFixed(3), '-i', srcOf(w.key), '-frames:v', '1', ...(vf.includes('[') ? ['-filter_complex', vf] : ['-vf', vf]), '-q:v', '3', out], `poster:${w.key}${suffix}`);
}

// ── 组装任务 ──────────────────────────────────────────────────────────────
const jobs = [];
const want = (id) => !ONLY.length || ONLY.includes(id);

for (const s of SHOTS) {
  if (!want(s.id)) continue;
  const [w, h] = SIZE[s.type];
  const span = clipSpan(s);
  const dur = (span.b1 - span.b0) * BEAT + 0.3;
  const j = clipJob({ id: s.id, key: s.work, inSec: s.in, dur, w, h, crf: s.type === 'full' || s.type === 'duoL' ? 15 : 17 });
  if (j) jobs.push(j);
}
// 宫格：16 格各切独立文件 —— 不能靠 data-media-start 区分同一文件（会被按 src 去重）
GRID.shots.forEach((shotNo, i) => {
  const id = `grid-${String(i).padStart(2, '0')}`;
  if (!want(id) && !want('grid')) return;
  const j = clipJob({ id, key: GRID.work, inSec: shotNo * GRID.shotLen + 0.05, dur: (GRID.b1 - GRID.b0) * BEAT + 0.3, w: 640, h: 360, crf: 20 });
  if (j) jobs.push(j);
});
for (const w of WORKS) {
  if (!want(`wall-${w.key}`) && !want('wall')) continue;
  const j = clipJob({ id: `wall-${w.key}`, key: w.key, inSec: w.wallIn, dur: WALL.clipLen, w: 480, h: 270, crf: 20 });
  if (j) jobs.push(j);
}
for (const w of WORKS) {
  if (!want(`poster-${w.key}`) && !want('poster')) continue;
  // -end 海报必须取定格时刻视频实际播到的那一帧（freezeAt - b0 拍之后），否则换图瞬间会跳
  const freezeT = ((WALL.freezeAt ?? WALL.b1) - WALL.b0) * BEAT;
  for (const j of [posterJob(w, '', w.wallIn + 1.2), posterJob(w, '-end', w.wallIn + freezeT - 1 / 30)]) if (j) jobs.push(j);
}

console.log(`prep_media: ${jobs.length} 个任务，并行 ${JOBS}`);
let done = 0;
const t0 = Date.now();
async function worker() {
  while (jobs.length) {
    const j = jobs.shift();
    await j();
    done++;
    if (done % 10 === 0) console.log(`  … ${done} 完成（${((Date.now() - t0) / 1000).toFixed(0)}s）`);
  }
}
await Promise.all(Array.from({ length: JOBS }, worker));

// ── QA 联系表 ─────────────────────────────────────────────────────────────
async function contactSheets() {
  const qa = P('build/qa/frames');
  fs.rmSync(qa, { recursive: true, force: true });
  fs.mkdirSync(qa, { recursive: true });
  let i = 0;
  for (const s of SHOTS) {
    const f = P('assets/clips', `${s.id}.mp4`);
    if (!fs.existsSync(f)) continue;
    const mid = ((s.b1 - s.b0) * BEAT) / 2;
    await run(['-ss', mid.toFixed(3), '-i', f, '-frames:v', '1', '-vf', 'scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2', P('build/qa/frames', `${String(i++).padStart(3, '0')}.jpg`)], `qa:${s.id}`);
  }
  if (i) await run(['-framerate', '1', '-i', P('build/qa/frames', '%03d.jpg'), '-vf', 'tile=8x8:padding=4:color=white', '-frames:v', '1', P('build/qa/contact-shots.jpg')], 'contact-shots');
  const posters = WORKS.map((w) => P('assets/posters', `${w.key}.jpg`)).filter((f) => fs.existsSync(f));
  if (posters.length) {
    const list = P('build/qa/posters.txt');
    fs.writeFileSync(list, posters.map((f) => `file '${f.replace(/\\/g, '/')}'\nduration 1`).join('\n'));
    await run(['-f', 'concat', '-safe', '0', '-i', list, '-vf', 'scale=320:180,tile=7x4:padding=4:color=white', '-frames:v', '1', P('build/qa/contact-wall.jpg')], 'contact-wall');
  }
  console.log(`联系表：build/qa/contact-shots.jpg（按 SHOTS 顺序）· build/qa/contact-wall.jpg（按 WORKS 顺序）`);
}
await contactSheets();
console.log(`prep_media 完成，用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
