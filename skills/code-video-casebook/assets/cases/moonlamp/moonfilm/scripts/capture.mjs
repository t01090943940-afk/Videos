#!/usr/bin/env node
// Deterministic frame capture for a window.film page (see the skill's references/runtime.md).
//
//   node scripts/capture.mjs --frames 0,60,120 --out out/stills         # specific stills
//   node scripts/capture.mjs --range 0:1440 --out out/frames            # a range (resumable)
//   node scripts/capture.mjs --inspect 0:1440:2 --out out/qc/inspect.json  # QC probe, no pixels
//   node scripts/capture.mjs --meta --out out/meta.json
//
// One browser, one page, serial frames: parallel headless WebGL on a small CPU box thrashes.
// Frames already on disk are skipped, so a killed render resumes where it stopped.
// env: CHROME=/path/to/chrome  PAGE=web/film.html  PORT=8765
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const has = (k) => args.includes(k);
const root = path.resolve(opt("--root", "web"));
const page = opt("--page", process.env.PAGE || "film.html");
const port = Number(process.env.PORT || 8765);
const out = opt("--out", "out/frames");
// Chrome: $CHROME, else a Playwright-managed chromium under $PLAYWRIGHT_BROWSERS_PATH, else playwright's default.
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!fs.existsSync(base)) return undefined;
  for (const d of fs.readdirSync(base).filter((d) => d.startsWith("chromium")).sort().reverse()) {
    for (const rel of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
      const p = path.join(base, d, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}
const chrome = findChrome();

const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(port, r));

const browser = await chromium.launch({
  executablePath: chrome,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-vsync", "--no-sandbox"],
});
const W = Number(opt("--width", 1280)), H = Number(opt("--height", 720));
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();
const errors = [];
pg.on("pageerror", (e) => errors.push(String(e)));
pg.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await pg.goto(`http://127.0.0.1:${port}/${page}`, { waitUntil: "domcontentloaded" });
const t0 = Date.now();
const meta = await pg.evaluate(() => window.film.ready);
console.log(`ready in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${meta.total} frames @ ${meta.fps}fps`);
if (errors.length) console.log("page errors:", errors.slice(0, 5));

function parseRange(s, total) {
  const [a, b, step] = s.split(":").map(Number);
  const list = [];
  for (let f = a || 0; f < (b || total); f += step || 1) list.push(f);
  return list;
}

try {
  if (has("--meta")) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(meta, null, 1));
    console.log(`wrote ${out}`);
  } else if (has("--inspect")) {
    const frames = parseRange(opt("--inspect"), meta.total);
    const rows = [];
    for (const f of frames) rows.push(await pg.evaluate((f) => window.film.inspect(f), f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(rows));
    console.log(`inspected ${rows.length} frames → ${out}`);
  } else {
    const frames = has("--frames") ? opt("--frames").split(",").map(Number) : parseRange(opt("--range", `0:${meta.total}`), meta.total);
    fs.mkdirSync(out, { recursive: true });
    let n = 0, tSum = 0;
    for (const f of frames) {
      const file = path.join(out, `f${String(f).padStart(5, "0")}.jpg`);
      if (fs.existsSync(file) && !has("--force")) continue;
      const t = Date.now();
      const url = await pg.evaluate((f) => window.film.frame(f), f);
      fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
      tSum += Date.now() - t;
      n++;
      if (n % 24 === 0 || frames.length < 40) console.log(`${file}  ${((Date.now() - t) / 1000).toFixed(2)}s  (avg ${(tSum / n / 1000).toFixed(2)}s)`);
    }
    console.log(`rendered ${n} frame(s), avg ${(tSum / Math.max(1, n) / 1000).toFixed(2)}s/frame`);
  }
  if (errors.length) console.log("page errors:", errors.slice(0, 8));
} finally {
  await browser.close();
  server.close();
}
