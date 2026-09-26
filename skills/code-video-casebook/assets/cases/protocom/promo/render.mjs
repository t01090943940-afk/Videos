// Full render: node render.mjs [workers] [fps] [out.mp4] [scale] [mode]
// Splits the timeline across headless Chromium workers, concatenates the segments
// and muxes the synthesized soundtrack.
//   scale: canvas supersample factor, e.g. 2 -> 3840x2160 (true 4K, all drawing is vector/timeline based)
//   mode:  jpeg (default) -> pipes jpeg frames, CRF21
//          png            -> writes lossless PNG frames to disk (resumable), x264 qp0 yuv444p master
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { serve, openPage } from './preview.mjs';

let FFMPEG = process.env.FFMPEG;
if (!FFMPEG) {
  try { FFMPEG = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim(); }
  catch { FFMPEG = 'ffmpeg'; }
}
const WORKERS = parseInt(process.argv[2] || '4', 10);
const FPS = parseInt(process.argv[3] || '60', 10);
const OUT = process.argv[4] || 'out/protocom-promo.mp4';
const SCALE = parseFloat(process.argv[5] || '1');
const MODE = process.argv[6] || 'jpeg';
const LOSSLESS = MODE === 'png';
const DURATION = 80;
const TOTAL = DURATION * FPS;
const TMP = 'out/segments';
mkdirSync(TMP, { recursive: true });
console.log(`render ${OUT} · ${FPS}fps · scale ${SCALE} · ${LOSSLESS ? 'lossless png frames (disk)' : 'jpeg frames (pipe)'}`);

const server = await serve();
const t0 = Date.now();
let done = 0;
const tick = () => {
  if (++done % 200 === 0) {
    const el = (Date.now() - t0) / 1000;
    console.log(`${done}/${TOTAL} frames · ${el.toFixed(0)}s · eta ${((el / done) * (TOTAL - done)).toFixed(0)}s`);
  }
};

async function workerPipe(w) {
  const a = Math.floor((TOTAL * w) / WORKERS), b = Math.floor((TOTAL * (w + 1)) / WORKERS);
  const seg = `${TMP}/seg${w}.mp4`;
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const { browser, page } = await openPage(server, SCALE === 1 ? '' : `?scale=${SCALE}`);
  for (let f = a; f < b; f++) {
    const b64 = await page.evaluate((t) => {
      window.renderFrame(t);
      return document.getElementById('out').toDataURL('image/jpeg', 0.96).split(',')[1];
    }, f / FPS);
    const buf = Buffer.from(b64, 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    tick();
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  return seg;
}

async function workerDisk(w) {
  const a = Math.floor((TOTAL * w) / WORKERS), b = Math.floor((TOTAL * (w + 1)) / WORKERS);
  const dir = `${TMP}/frames${w}`;
  mkdirSync(dir, { recursive: true });
  const { browser, page } = await openPage(server, SCALE === 1 ? '' : `?scale=${SCALE}`);
  for (let f = a; f < b; f++) {
    const fp = `${dir}/f${String(f).padStart(6, '0')}.png`;
    if (!existsSync(fp)) {
      let buf = null;
      for (let retry = 0; retry < 3 && (!buf || !buf.length); retry++) {
        const b64 = await page.evaluate((t) => {
          window.renderFrame(t);
          return document.getElementById('out').toDataURL('image/png').split(',')[1];
        }, f / FPS);
        buf = Buffer.from(b64 || '', 'base64');
      }
      if (!buf.length) throw new Error(`empty frame ${f}`);
      writeFileSync(fp, buf);
    }
    tick();
  }
  await browser.close();
  const seg = `${TMP}/seg${w}.mp4`;
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-start_number', String(a), '-i', `${dir}/f%06d.png`,
    '-c:v', 'libx264', '-preset', 'medium', '-qp', '0', '-pix_fmt', 'yuv444p', '-r', String(FPS), seg], { stdio: 'inherit' });
  return seg;
}

const worker = LOSSLESS ? workerDisk : workerPipe;
const segs = await Promise.all([...Array(WORKERS).keys()].map(worker));
server.close();
writeFileSync(`${TMP}/list.txt`, segs.map((s) => `file '${s.split('/').pop()}'`).join('\n'));
if (!existsSync('audio/music.wav')) execFileSync('python3', ['audio/synth.py', 'audio/music.wav'], { stdio: 'inherit' });
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${TMP}/list.txt`, '-i', 'audio/music.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', LOSSLESS ? '320k' : '256k', '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
console.log('done', OUT, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
