#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  render.mjs · 无头 Chromium（SwiftShader）逐帧渲染 → WebSocket 回传 RGBA → ffmpeg
//
//  为什么走 WebSocket：实测 1080p 一帧 8.3 MB，fetch POST 要 660 ms，
//  WebSocket 二进制只要 ~90 ms —— 这是 120fps 能在云端跑完的前提。
//
//  用法：
//    node tools/render.mjs --fps 120 --out renders/master_1080p120.mkv [--workers 2] [--from 0 --to 66]
//    node tools/render.mjs --stills 3,8.5,20 [--w 960]     → build/stills/*.jpg（按"秒"）
//    node tools/render.mjs --beats 0,8,16 --w 960          → 按"拍"取静帧
// ─────────────────────────────────────────────────────────────────────────────
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { DURATION } from '../src/timeline.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 120);
const Wd = +arg('w', 1920), Hd = Math.round((Wd * 9) / 16);
const WORKERS = +arg('workers', 1);
const OUT = arg('out', null);
const FROM = +arg('from', 0), TO = +arg('to', DURATION);
const STILLS = arg('stills', null), BEATS = arg('beats', null);
const FF = 'ffmpeg';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const p = path.join(REPO, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(REPO) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const HTTP = server.address().port;
const wss = new WebSocketServer({ port: 0 });
await new Promise((r) => wss.on('listening', r));
const WSP = wss.address().port;
const sinks = []; // 每个连接按顺序对应一个 worker
wss.on('connection', (ws) => {
  const k = sinks.findIndex((s) => !s.ws);
  sinks[k].ws = ws;
  ws.on('message', async (d) => { await sinks[k].onFrame(Buffer.from(d)); ws.send('k'); });
});

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    '--disable-gpu-driver-bug-workarounds', '--js-flags=--max-old-space-size=6144'],
});

async function openWorker(onFrame) {
  const sink = { ws: null, onFrame };
  sinks.push(sink);
  const page = await browser.newPage({ viewport: { width: Wd, height: Hd } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${HTTP}/00-THE-SOURCE/web/index.html?w=${Wd}&ws=${WSP}`);
  await page.waitForFunction(() => window.READY || window.ERR, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.ERR);
  if (err) throw new Error(err);
  return page;
}

function ffmpegRaw(outArgs) {
  const p = spawn(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${Wd}x${Hd}`,
    '-r', String(FPS), '-i', '-', '-vf', 'vflip', ...outArgs], { stdio: ['pipe', 'inherit', 'inherit'] });
  const write = (buf) => new Promise((r) => (p.stdin.write(buf) ? r() : p.stdin.once('drain', r)));
  const done = new Promise((r) => p.on('close', r));
  return { write, end: () => (p.stdin.end(), done) };
}

async function renderFrames(page, frames, label) {
  let t0 = Date.now(), n = 0;
  for (const i of frames) {
    const [tr, tx] = await page.evaluate(([i, f]) => window.renderFrame(i, f), [i, FPS]);
    n++;
    if (n % 60 === 0 || n === frames.length) {
      const el = (Date.now() - t0) / 1000;
      console.log(`[${label}] ${n}/${frames.length}  ${(el / n).toFixed(3)} s/f  (draw ${tr.toFixed(0)}ms, xfer ${tx.toFixed(0)}ms)  eta ${((frames.length - n) * el / n / 60).toFixed(1)} min`);
    }
  }
}

if (STILLS || BEATS) {
  const times = (STILLS || BEATS).split(',').map(Number).map((x) => (BEATS ? x * 0.5 : x));
  const dir = path.join(ROOT, 'build', 'stills');
  fs.mkdirSync(dir, { recursive: true });
  let cur = null;
  const page = await openWorker(async (buf) => { await cur.write(buf); });
  for (const tt of times) {
    const name = BEATS ? `b${(tt * 2).toFixed(2).padStart(6, '0')}` : `t${tt.toFixed(3).padStart(7, '0')}`;
    cur = ffmpegRaw(['-frames:v', '1', '-q:v', '2', path.join(dir, name + '.jpg')]);
    const t0 = Date.now();
    await page.evaluate(([i, f]) => window.renderFrame(i, f), [Math.round(tt * FPS), FPS]);
    await cur.end();
    console.log('still', name, Date.now() - t0, 'ms');
  }
} else {
  const f0 = Math.round(FROM * FPS), f1 = Math.round(TO * FPS);
  const all = Array.from({ length: f1 - f0 }, (_, k) => f0 + k);
  const chunk = Math.ceil(all.length / WORKERS);
  const enc = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '6', '-pix_fmt', 'yuv444p', '-g', String(FPS)];
  const parts = [];
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const frames = all.slice(w * chunk, (w + 1) * chunk);
    if (!frames.length) return;
    const out = WORKERS > 1 ? OUT.replace(/(\.\w+)$/, `.part${w}$1`) : OUT;
    parts[w] = out;
    fs.mkdirSync(path.dirname(path.resolve(ROOT, out)), { recursive: true });
    const ff = ffmpegRaw([...enc, path.resolve(ROOT, out)]);
    const page = await openWorker((buf) => ff.write(buf));
    await renderFrames(page, frames, `w${w}`);
    await ff.end();
  }));
  if (WORKERS > 1) {
    const list = path.resolve(ROOT, OUT + '.txt');
    fs.writeFileSync(list, parts.filter(Boolean).map((p) => `file '${path.resolve(ROOT, p)}'`).join('\n'));
    await new Promise((r) => spawn(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', path.resolve(ROOT, OUT)], { stdio: 'inherit' }).on('close', r));
    for (const p of parts.filter(Boolean)) fs.unlinkSync(path.resolve(ROOT, p));
    fs.unlinkSync(list);
  }
  console.log('done →', OUT);
}
await browser.close();
server.close(); wss.close();
process.exit(0);
