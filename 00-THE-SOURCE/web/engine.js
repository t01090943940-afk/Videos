// ─────────────────────────────────────────────────────────────────────────────
//  engine.js · 自写 WebGL2 合成器
//
//  renderFrame(i, fps)：
//    1) collect 阶段：跑一遍场景，只登记本帧需要的源片帧（不画）
//    2) 并行解码所有缺的 JPEG → 纹理（LRU 缓存）
//    3) draw 阶段：场景画进 HDR 缓冲 → 泛光链 → 最终调色合成到画布
//  没有 requestAnimationFrame、没有 Date.now、没有 Math.random：同一个 i 永远同一帧。
// ─────────────────────────────────────────────────────────────────────────────
import { createGL, program, setUniforms, texture, solidTexture, Pool } from './lib/gl.js';
import * as S from './lib/shaders.js';
import { M4, clamp } from './lib/math.js';

const BASE = '/00-THE-SOURCE/assets';
const FONTS = '/00-supercut-trailer/assets/fonts';

export const FAM = {
  sans: 'NSC', sans7: 'NSC7', serif: 'SHSerif', serifvf: 'NSerif', barlow: 'Barlow', mono: 'Plex',
};

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.W = canvas.width; this.H = canvas.height;
    this.k = this.W / 1920; // 预览缩放
    const { gl, hdr } = createGL(canvas);
    this.gl = gl; this.hdr = hdr;
    this.pool = new Pool(gl, hdr);
    this.cache = new Map(); // 源片帧纹理 LRU
    this.pending = new Map();
    this.textCache = new Map();
    this.codePages = new Map();
    this.useTick = 0;
  }

  async init() {
    const gl = this.gl;
    // 字体
    const faces = [
      [FAM.sans, 'NotoSansSC-900.ttf', '900'], [FAM.sans7, 'NotoSansSC-700.ttf', '700'],
      [FAM.serif, 'SourceHanSerifSC-Heavy.ttf', '900'], [FAM.serifvf, 'NotoSerifSC-VF.ttf', '200 900'],
      [FAM.barlow, 'Barlow-600.ttf', '600'], [FAM.barlow, 'Barlow-800.ttf', '800'], [FAM.barlow, 'Barlow-900.ttf', '900'],
      [FAM.mono, 'IBMPlexMono-500.ttf', '500'],
    ];
    await Promise.all(faces.map(async ([fam, file, weight]) => {
      const f = new FontFace(fam, `url(${FONTS}/${file})`, { weight });
      await f.load();
      document.fonts.add(f);
    }));
    const J = async (p) => (await fetch(`${BASE}/${p}`)).json();
    [this.frames, this.code, this.stats, this.tree, this.heads] = await Promise.all(
      ['data/frames.json', 'data/code.json', 'data/stats.json', 'data/tree.json', 'data/heads.json'].map(J));
    // 程序
    this.P = {
      sprite: program(gl, S.VS_SPRITE, S.FS_SPRITE, 'sprite'),
      copy: program(gl, S.VS_FULL, S.FS_COPY, 'copy'),
      pre: program(gl, S.VS_FULL, S.FS_BLOOM_PRE, 'pre'),
      down: program(gl, S.VS_FULL, S.FS_DOWN, 'down'),
      up: program(gl, S.VS_FULL, S.FS_UP, 'up'),
      final: program(gl, S.VS_FULL, S.FS_FINAL, 'final'),
      trans: program(gl, S.VS_FULL, S.FS_TRANS, 'trans'),
      mosaic: program(gl, S.VS_FULL, S.FS_MOSAIC, 'mosaic'),
      swarm: program(gl, S.VS_SWARM, S.FS_SWARM, 'swarm'),
      tiles: program(gl, S.VS_TILES, S.FS_TILES, 'tiles'),
    };
    // 几何
    this.quadVAO = gl.createVertexArray();
    gl.bindVertexArray(this.quadVAO);
    this.quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.triVAO = gl.createVertexArray();
    gl.bindVertexArray(this.triVAO);
    const tb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    this.white = solidTexture(gl, [255, 255, 255, 255]);
    this.black = solidTexture(gl, [0, 0, 0, 255]);
    // 图集
    const img = await this.loadImage(`${BASE}/atlas/mosaic.jpg`);
    this.atlas = texture(gl, img, { mip: true });
    this.atlasGrid = [12, 28];
    this.glyphs = this.buildGlyphAtlas();
    this.instBuf = gl.createBuffer();
  }

  _makeTex(canvas, opts = { mip: true }) { return texture(this.gl, canvas, opts); }

  loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  // ── 源片帧 ───────────────────────────────────────────────────────────────
  frameKey(clip, localT, loop = false) {
    const m = this.frames[clip];
    if (!m) throw new Error('no clip ' + clip);
    let n = Math.floor(localT * 30 + 1e-4);
    n = loop ? ((n % m.n) + m.n) % m.n : clamp(n, 0, m.n - 1);
    return `${clip}/${String(n).padStart(4, '0')}`;
  }
  async loadFrame(key) {
    if (this.cache.has(key)) return;
    if (!this.pending.has(key)) {
      this.pending.set(key, (async () => {
        const blob = await (await fetch(`${BASE}/frames/${key}.jpg`)).blob();
        const bmp = await createImageBitmap(blob, { imageOrientation: 'flipY' });
        const t = texture(this.gl, bmp, { flip: false });
        bmp.close();
        this.cache.set(key, { ...t, use: this.useTick });
        this.pending.delete(key);
      })());
    }
    return this.pending.get(key);
  }
  evict(max = 150) {
    if (this.cache.size <= max) return;
    const arr = [...this.cache.entries()].sort((a, b) => a[1].use - b[1].use);
    for (let i = 0; i < arr.length - max; i++) { this.gl.deleteTexture(arr[i][1].tex); this.cache.delete(arr[i][0]); }
  }

  // ── 文字纹理（canvas 2D 排版一次，缓存）──────────────────────────────────
  font(style) {
    const { fam = 'sans', size = 64, weight } = style;
    const w = weight || (fam === 'mono' ? 500 : fam === 'barlow' ? 800 : fam === 'sans7' ? 700 : 900);
    return `${w} ${size}px ${FAM[fam] || fam}`;
  }
  textTex(str, style = {}) {
    const key = JSON.stringify([str, style]);
    let t = this.textCache.get(key);
    if (t) return t;
    const { size = 64, spacing = 0, pad = 0.35 } = style;
    const c = document.createElement('canvas');
    const x = c.getContext('2d');
    x.font = this.font(style);
    x.letterSpacing = `${spacing}px`;
    const m = x.measureText(str);
    const p = Math.ceil(size * pad);
    const w = Math.ceil(m.width + p * 2), h = Math.ceil(size * 1.45 + p * 2);
    c.width = Math.max(w, 2); c.height = h;
    x.font = this.font(style);
    x.letterSpacing = `${spacing}px`;
    x.fillStyle = '#fff';
    x.textBaseline = 'middle';
    x.fillText(str, p, h / 2);
    t = texture(this.gl, c, { mip: true, premul: false });
    t.adv = m.width; t.pad = p;
    this.textCache.set(key, t);
    return t;
  }
  measure(str, style) {
    const c = this._mc || (this._mc = document.createElement('canvas').getContext('2d'));
    c.font = this.font(style); c.letterSpacing = `${style.spacing || 0}px`;
    return c.measureText(str).width;
  }

  // 等宽字形图集（ASCII 32–127，16×6）
  buildGlyphAtlas() {
    const cw = 32, ch = 48, c = document.createElement('canvas');
    c.width = cw * 16; c.height = ch * 6;
    const x = c.getContext('2d');
    x.font = `500 40px ${FAM.mono}`; x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'center';
    for (let i = 0; i < 96; i++) x.fillText(String.fromCharCode(32 + i), (i % 16) * cw + cw / 2, Math.floor(i / 16) * ch + ch / 2 + 2);
    return texture(this.gl, c, { mip: true });
  }

  // 代码页：把某部作品的真实源码按等宽网格排满一屏（cols×rows 个字符格）
  codePage(work, density = 'coarse') {
    const key = work + '|' + density;
    if (this.codePages.has(key)) return this.codePages.get(key);
    const [cols, rows, fs] = density === 'fine' ? [240, 90, 11] : density === 'tile' ? [160, 60, 14] : [120, 45, 21];
    const cw = 1920 / cols, ch = 1080 / rows;
    const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
    const x = c.getContext('2d');
    x.font = `500 ${fs}px ${FAM.mono}`; x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'center';
    const lines = this.code[work];
    const grid = [];
    let li = 0;
    for (let r = 0; r < rows; r++) {
      let s = lines[li % lines.length]; li++;
      // 短行接着拼下一行，让网格更满（像一面代码墙）
      while (s.length < cols) { s += '   ' + lines[li % lines.length].trim(); li++; }
      s = s.slice(0, cols);
      grid.push(s);
      for (let k = 0; k < cols; k++) {
        const chr = s[k];
        if (chr !== ' ') x.fillText(chr, k * cw + cw / 2, r * ch + ch / 2);
      }
    }
    const t = texture(this.gl, c, { mip: true, wrap: 'repeat' });
    t.cells = [cols, rows]; t.grid = grid;
    this.codePages.set(key, t);
    return t;
  }

  // ── 帧 ───────────────────────────────────────────────────────────────────
  async renderFrame(i, fps, scene) {
    const t = i / fps;
    this.useTick++;
    // 1) collect
    const need = new Set();
    const ctx = new Ctx(this, t, fps, i, need);
    ctx.collecting = true;
    scene(ctx);
    await Promise.all([...need].map((k) => this.loadFrame(k)));
    // 2) draw
    const gl = this.gl;
    const main = this.pool.get(this.W, this.H);
    gl.bindFramebuffer(gl.FRAMEBUFFER, main.fb);
    gl.viewport(0, 0, this.W, this.H);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    const dctx = new Ctx(this, t, fps, i, null);
    dctx.target = main;
    scene(dctx);
    this.post(main, dctx.post, t);
    this.pool.releaseAll();
    this.evict();
  }

  fullDraw(prog, u, target) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
    gl.viewport(0, 0, target ? target.w : this.W, target ? target.h : this.H);
    gl.useProgram(prog.p);
    setUniforms(gl, prog, u);
    gl.bindVertexArray(this.triVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  post(main, P, t) {
    const gl = this.gl;
    gl.disable(gl.BLEND);
    // 泛光链
    let w = this.W >> 1, h = this.H >> 1;
    const chain = [];
    const pre = this.pool.get(w, h);
    this.fullDraw(this.P.pre, { uTex: main, uTexel: [1 / this.W, 1 / this.H], uThresh: P.bloomThresh }, pre);
    chain.push(pre);
    for (let k = 0; k < 5; k++) {
      const src = chain[chain.length - 1];
      w = Math.max(w >> 1, 4); h = Math.max(h >> 1, 4);
      const d = this.pool.get(w, h);
      this.fullDraw(this.P.down, { uTex: src, uTexel: [1 / src.w, 1 / src.h] }, d);
      chain.push(d);
    }
    let acc = chain[chain.length - 1];
    for (let k = chain.length - 2; k >= 0; k--) {
      const dst = this.pool.get(chain[k].w, chain[k].h);
      this.fullDraw(this.P.up, { uTex: acc, uPrev: chain[k], uTexel: [1 / acc.w, 1 / acc.h] }, dst);
      acc = dst;
    }
    this.fullDraw(this.P.final, {
      uScene: main, uBloom: acc, uBloomAmt: P.bloom, uExposure: P.exposure, uCA: P.ca, uGrain: P.grain, uVig: P.vignette,
      uLetter: P.letterbox, uFade: P.fade, uWarp: P.warp, uSat: P.sat, uTime: t, uZoom: P.zoom, uRot: P.rot,
      uContrast: P.contrast, uShake: P.shake, uFlash: P.flash, uLift: P.lift, uGain: P.gain,
    }, null);
  }

  readPixels() {
    const gl = this.gl;
    if (!this._px) this._px = new Uint8Array(this.W * this.H * 4);
    gl.readPixels(0, 0, this.W, this.H, gl.RGBA, gl.UNSIGNED_BYTE, this._px);
    return this._px;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Ctx · 场景拿到的全部画笔
// ─────────────────────────────────────────────────────────────────────────────
export class Ctx {
  constructor(eng, t, fps, frame, need) {
    this.e = eng; this.gl = eng.gl; this.t = t; this.fps = fps; this.frame = frame; this.need = need;
    this.collecting = false;
    this.b = t * 2; // 拍（120 BPM）
    this.post = {
      bloom: 0.55, bloomThresh: 0.72, exposure: 1, ca: 0.0012, grain: 0.035, vignette: 0.55, letterbox: 0, fade: 0,
      warp: 0.0, sat: 1, zoom: 1, rot: 0, contrast: 1.0, shake: [0, 0], flash: [0, 0, 0], lift: [0, 0, 0], gain: [1, 1, 1],
    };
    this.cam2d();
  }

  // 相机
  cam2d() {
    this.VP = M4.ortho(-960, 960, -540, 540, -5000, 5000);
    this.is3d = false;
    return this;
  }
  cam3d({ eye = [0, 0, 1483.6], at = [0, 0, 0], up = [0, 1, 0], fov = 40 } = {}) {
    const P = M4.persp((fov * Math.PI) / 180, 16 / 9, 5, 60000);
    this.VP = M4.mul(P, M4.lookAt(eye, at, up));
    this.is3d = true;
    return this;
  }
  static camDist(fov = 40) { return 540 / Math.tan(((fov * Math.PI) / 180) / 2); }

  // 源片帧
  video(clip, localT, loop = false) {
    const key = this.e.frameKey(clip, localT, loop);
    if (this.collecting) { this.need.add(key); return this.e.white; }
    const t = this.e.cache.get(key);
    if (!t) throw new Error('frame not loaded ' + key);
    t.use = this.e.useTick;
    return t;
  }
  clipInfo(clip) { return this.e.frames[clip]; }

  // 离屏图层
  layer(fn, w = this.e.W, h = this.e.H) {
    if (this.collecting) { fn(this); return { tex: this.e.black.tex, w, h, dummy: true }; }
    const gl = this.gl;
    const f = this.e.pool.get(w, h);
    const prev = this.target, prevVP = this.VP, prev3 = this.is3d;
    this.target = f;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.fb);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    fn(this);
    this.target = prev; this.VP = prevVP; this.is3d = prev3;
    gl.bindFramebuffer(gl.FRAMEBUFFER, prev.fb);
    gl.viewport(0, 0, prev.w, prev.h);
    return f;
  }

  bind() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.target.fb);
    gl.viewport(0, 0, this.target.w, this.target.h);
  }

  blend(mode) {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    if (mode === 'add') gl.blendFunc(gl.ONE, gl.ONE);
    else if (mode === 'screen') gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  // 通用四边形。o.m 给定则直接用模型矩阵，否则用 x,y,z,rx,ry,rz,s
  sprite(o) {
    if (this.collecting) return;
    const gl = this.gl, P = this.e.P.sprite;
    const s = o.s ?? 1;
    const m = o.m || M4.trs(o.x || 0, o.y || 0, o.z || 0, o.rx || 0, o.ry || 0, o.rz || 0, s * (o.sx ?? 1), s * (o.sy ?? 1), 1);
    const col = o.color || [1, 1, 1];
    const a = o.alpha ?? 1;
    if (!(a > 0.001)) return;
    const g = o.glyph;
    let code = this.e.white, cells = [1, 1];
    if (g && g.amount > 0) { code = this.e.codePage(g.work, g.density || 'coarse'); cells = code.cells; }
    this.bind();
    this.blend(o.blend);
    gl.useProgram(P.p);
    setUniforms(gl, P, {
      uMVP: M4.mul(this.VP, m), uSize: [o.w, o.h], uTex: o.tex || this.e.white, uUV: o.uv || [0, 0, 1, 1],
      uColor: [col[0], col[1], col[2], a], uMode: o.mode ?? (o.tex ? 0 : 2), uRadius: o.radius || 0,
      uBright: o.bright ?? 1, uSat: o.sat ?? 1, uContrast: o.contrast ?? 1, uRGB: o.rgb || 0,
      uGlyph: g ? g.amount : 0, uReveal: g ? g.reveal ?? 0 : 0, uScroll: g ? g.scroll || 0 : 0, uTick: g ? g.tick ?? this.t * 30 : 0,
      uSeed: g ? g.seed || 0 : 0, uHot: g ? g.hot ?? 1 : 0, uHotColor: g ? g.hotColor || [0.55, 0.85, 1] : [0, 0, 0],
      uCode: code, uCells: cells, uEdge: o.edge || 0, uEdgeColor: o.edgeColor || [0, 0, 0],
    });
    gl.bindVertexArray(this.e.quadVAO);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  rect(o) { this.sprite({ ...o, tex: null, mode: 2 }); }

  // 视频/图片按 cover 适配到 w×h
  coverUV(tw, th, w, h, zoom = 1, ox = 0, oy = 0) {
    const ta = tw / th, a = w / h;
    let sx = 1, sy = 1;
    if (ta > a) sx = a / ta; else sy = ta / a;
    sx /= zoom; sy /= zoom;
    const cx = 0.5 + ox, cy = 0.5 + oy;
    return [cx - sx / 2, cy - sy / 2, cx + sx / 2, cy + sy / 2];
  }

  // 文字：anchor 0=左 .5=中 1=右；x,y 为锚点（世界/屏幕坐标，y 向上）
  text(str, style, o = {}) {
    if (this.collecting || !str) return null;
    const t = this.e.textTex(str, style);
    const s = o.s ?? 1;
    const ax = o.anchor ?? 0.5;
    const cx = (o.x || 0) + (0.5 - ax) * t.adv * s + (0.5 * (t.w - 2 * t.pad) - 0.5 * t.adv) * s;
    this.sprite({ ...o, tex: t, mode: 1, w: t.w, h: t.h, x: cx, y: o.y || 0 });
    return t;
  }
  // 逐字（每个字单独变换）：fn(i, ch, x) → 该字的额外参数
  chars(str, style, o, fn) {
    const arr = [...str];
    const widths = arr.map((c) => this.e.measure(c, style) + (style.spacing || 0));
    const total = widths.reduce((a, b) => a + b, 0) - (style.spacing || 0);
    const s = o.s ?? 1;
    let x = (o.x || 0) - total * s * (o.anchor ?? 0.5);
    arr.forEach((c, i) => {
      const cx = x + (widths[i] - (style.spacing || 0)) * s * 0.5;
      const extra = fn ? fn(i, c, cx) : {};
      if (extra !== null && c !== ' ') this.text(c, style, { ...o, anchor: 0.5, x: cx, ...extra });
      x += widths[i] * s;
    });
    return total * s;
  }

  full(progName, u) {
    if (this.collecting) return;
    const gl = this.gl;
    this.bind();
    this.blend(u.__blend);
    gl.useProgram(this.e.P[progName].p);
    setUniforms(gl, this.e.P[progName], u);
    gl.bindVertexArray(this.e.triVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // 把一个图层铺满当前目标
  paste(f, alpha = 1, blend) {
    if (this.collecting) return;
    this.full('copy', { uTex: f, uAlpha: alpha, __blend: blend });
  }

  trans(A, B, p, type, seed = 0, center = [0.5, 0.5]) {
    const T = { cut: 0, slice: 1, zoom: 2, shatter: 3, ink: 4, pixel: 5, rgb: 6, whip: 7 }[type] ?? 0;
    this.full('trans', { uA: A, uB: B, uP: p, uType: T, uSeed: seed, uCenter: center, __blend: 'normal' });
  }

  // 实例化绘制
  instanced(progName, u, attribs, count) {
    if (this.collecting) return;
    const gl = this.gl, e = this.e;
    this.bind();
    this.blend(u.__blend);
    gl.useProgram(e.P[progName].p);
    setUniforms(gl, e.P[progName], u);
    if (!e._ivao) e._ivao = gl.createVertexArray();
    gl.bindVertexArray(e._ivao);
    gl.bindBuffer(gl.ARRAY_BUFFER, e.quadBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(0, 0);
    if (!e._ibufs) e._ibufs = [];
    attribs.forEach((a, k) => {
      const loc = k + 1;
      if (!e._ibufs[k]) e._ibufs[k] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, e._ibufs[k]);
      gl.bufferData(gl.ARRAY_BUFFER, a.data, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, a.size, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(loc, 1);
    });
    for (let k = attribs.length; k < 4; k++) gl.disableVertexAttribArray(k + 1);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    gl.bindVertexArray(null);
  }
}
