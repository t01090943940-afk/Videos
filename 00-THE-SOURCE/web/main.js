// 入口：?w=1920 控制分辨率（预览可用 960）；?ws=端口 连上渲染器回传像素
import { Engine } from './engine.js';
import { scene, prepareScenes } from './scenes/index.js';

const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 1920);
const canvas = document.getElementById('c');
canvas.width = W; canvas.height = Math.round((W * 9) / 16);
window.ERR = null;
window.addEventListener('error', (e) => (window.ERR = String(e.error?.stack || e.message)));
window.addEventListener('unhandledrejection', (e) => (window.ERR = String(e.reason?.stack || e.reason)));

const eng = new Engine(canvas);
let ws = null;
if (q.get('ws')) {
  ws = new WebSocket(`ws://localhost:${q.get('ws')}`);
  ws.binaryType = 'arraybuffer';
  await new Promise((r) => (ws.onopen = r));
}
await eng.init();
await prepareScenes(eng);

// 渲染第 i 帧并把 RGBA 像素回传（等待 ack，形成背压）
window.renderFrame = async (i, fps) => {
  const t0 = performance.now();
  await eng.renderFrame(i, fps, scene);
  const t1 = performance.now();
  const px = eng.readPixels();
  if (ws) await new Promise((r) => { ws.onmessage = r; ws.send(px); });
  return [t1 - t0, performance.now() - t1];
};
window.READY = true;
