import { W, H, MONO, SANS, rng, clamp, lerp, smooth, easeOut, easeInOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

function dotTexture(T, soft = true) {
  const c = makeCanvas(64, 64), x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(soft ? .25 : .7, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(c); return t;
}
function gauss(R) { return Math.sqrt(-2 * Math.log(R() + 1e-9)) * Math.cos(6.283 * R()); }
function starfield(T, n = 1500, rad = 60) {
  const R = rng(99), pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * 6.283, s = Math.sqrt(1 - u * u);
    pos[i * 3] = s * Math.cos(a) * rad; pos[i * 3 + 1] = u * rad; pos[i * 3 + 2] = s * Math.sin(a) * rad; }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
  return new T.Points(g, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: .7 }));
}

// ---------- ASCII dark ages ----------
const RAMP = ' .:-=+*#%@';
const asciiScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#030403'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 20px ${MONO}`; const cw = ctx.measureText('0').width, lh = 22;
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / lh);
    const contrast = lerp(1.2, 4.2, p), att = Math.pow(p, 2.5);
    const hi = [], lo = [], top = [];
    for (let r = 0; r < rows; r++) {
      let a = '', b = '', c = '';
      for (let k = 0; k < cols; k++) {
        const x = k / cols * 16, y = r / rows * 9;
        let v = fbm(x * .45, y * .45, t * .35, 4) * contrast + .12;
        const dx = (k - cols / 2) / cols * 1.8, dy = (r - rows * .45) / rows;
        v += att * 1.6 * Math.exp(-(dx * dx + dy * dy) * 30);
        v = clamp(v - lerp(0, .25, p), 0, .999);
        const ch = RAMP[Math.floor(v * RAMP.length)];
        if (v > .82) { c += ch; a += ' '; b += ' '; } else if (v > .45) { b += ch; a += ' '; c += ' '; } else { a += ch; b += ' '; c += ' '; }
      }
      lo.push(a); hi.push(b); top.push(c);
    }
    const draw = (arr, col) => { ctx.fillStyle = col; arr.forEach((s, r) => ctx.fillText(s, 0, (r + 1) * lh)); };
    draw(lo, '#3f6a52'); draw(hi, '#9fdcb8'); draw(top, '#eaffef');
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(100, 150, 760, 60);
    ctx.fillStyle = '#9fe0b8'; ctx.font = `bold 26px ${MONO}`;
    ctx.fillText(`no light yet · gravity.clump(ρ) ×${contrast.toFixed(1)}`, 118, 190);
  }
};

// ---------- LOW-POLY first star ----------
let lp;
const lowpolyScene = {
  init(env) {
    const T = env.GL.THREE;
    const scene = new T.Scene(); scene.background = new T.Color(0x05030c);
    const cam = new T.PerspectiveCamera(42, W / H, .1, 200);
    const geo = new T.IcosahedronGeometry(1.6, 1); const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const v = new T.Vector3().fromBufferAttribute(pos, i);
      const h = Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719) * 43758.5453; const k = 1 + (h - Math.floor(h) - .5) * .28; v.multiplyScalar(k); pos.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    const mat = new T.MeshStandardMaterial({ color: 0x3a3450, flatShading: true, roughness: .9, emissive: 0x000000 });
    const star = new T.Mesh(geo, mat); scene.add(star);
    const spikes = new T.Group(); const R = rng(8);
    for (let i = 0; i < 26; i++) { const c = new T.Mesh(new T.ConeGeometry(.18, 1.6, 4), new T.MeshBasicMaterial({ color: 0xbfe8ff }));
      const d = new T.Vector3(gauss(R), gauss(R), gauss(R)).normalize(); c.position.copy(d.clone().multiplyScalar(2.2));
      c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d); c.userData.d = d; c.userData.k = .6 + R() * .8; spikes.add(c); }
    scene.add(spikes);
    const shards = new T.Group();
    for (let i = 0; i < 90; i++) { const m = new T.Mesh(new T.TetrahedronGeometry(.25 + R() * .5), new T.MeshStandardMaterial({ color: 0x4a3a6e, flatShading: true }));
      const a = R() * 6.283, r = 4 + R() * 9, y = gauss(R) * 3; m.position.set(Math.cos(a) * r, y, Math.sin(a) * r); m.rotation.set(R() * 6, R() * 6, R() * 6); m.userData = { a, r, y, s: R() }; shards.add(m); }
    scene.add(shards);
    const glow = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T), color: 0x9fd8ff, blending: T.AdditiveBlending, transparent: true, depthWrite: false }));
    glow.scale.set(9, 9, 1); scene.add(glow);
    scene.add(new T.AmbientLight(0x6060a0, .6));
    const pl = new T.PointLight(0x9fd8ff, 0, 0, 1.2); scene.add(pl);
    const dl = new T.DirectionalLight(0xff66aa, .8); dl.position.set(-5, 3, -4); scene.add(dl);
    scene.add(starfield(T));
    lp = { scene, cam, star, mat, spikes, shards, glow, pl };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, ig = smooth((p - .38) / .25);
    const a = t * .5 + .8; lp.cam.position.set(Math.sin(a) * 10.5, 2.2, Math.cos(a) * 10.5); lp.cam.lookAt(0, 0, 0);
    const sc = lerp(2.2, 1, easeInOut(clamp(p / .45))) * (1 + ig * .06 * Math.sin(t * 25));
    lp.star.scale.setScalar(sc); lp.star.rotation.set(t * .3, t * .5, 0);
    lp.mat.emissive.setRGB(.55 * ig, .8 * ig, 1 * ig); lp.mat.color.setRGB(lerp(.23, .8, ig), lerp(.2, .9, ig), lerp(.31, 1, ig));
    lp.pl.intensity = ig * 60;
    lp.spikes.children.forEach(c => { const s = ig * c.userData.k * (1 + .3 * Math.sin(t * 20 + c.userData.k * 9));
      c.scale.set(s, s * 1.4, s); c.position.copy(c.userData.d.clone().multiplyScalar(1.7 + s * 1.2)); c.visible = s > .02; });
    lp.shards.children.forEach(m => { const u = m.userData; const r = lerp(u.r, u.r * .75, p); const aa = u.a + t * (.4 + u.s * .3);
      m.position.set(Math.cos(aa) * r, u.y, Math.sin(aa) * r); m.rotation.x += 0; m.rotation.y = t * (1 + u.s); });
    lp.glow.material.opacity = ig; lp.glow.scale.setScalar(4 + ig * 9);
    env.GL.draw(ctx, lp.scene, lp.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#bfe8ff';
    ctx.fillText(ig > .1 ? 'fusion.ignite()  ·  Pop III · 100 M☉ · 10⁵ K' : 'H₂ cloud collapsing …', 120, 200);
  }
};

// ---------- CA reionization ----------
const CA = (() => {
  const cs = 16, cw = Math.floor(W / cs), ch = Math.floor(H / cs), N = cw * ch, steps = 64;
  const arr = new Int16Array(N).fill(9999); const R = rng(21); const seeds = [];
  for (let i = 0; i < 26; i++) seeds.push({ x: Math.floor(R() * cw), y: Math.floor(R() * ch), s: Math.floor(R() * 26) });
  let cur = new Uint8Array(N);
  for (let s = 0; s < steps; s++) {
    for (const sd of seeds) if (sd.s === s) { const k = sd.y * cw + sd.x; cur[k] = 1; if (arr[k] > s) arr[k] = s; }
    const nx = cur.slice();
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const k = y * cw + x; if (cur[k]) continue;
      let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy;
        if ((dx || dy) && xx >= 0 && yy >= 0 && xx < cw && yy < ch && cur[yy * cw + xx]) n++; }
      if (n && R() < 1 - Math.pow(.72, n)) { nx[k] = 1; arr[k] = s; } }
    cur = nx;
  }
  return { cs, cw, ch, arr, seeds, steps };
})();
const caScene = {
  draw(ctx, env) {
    const p = env.p, step = Math.floor(p * (CA.steps - 2)) + 1;
    ctx.fillStyle = '#07080d'; ctx.fillRect(0, 0, W, H);
    const { cs, cw, ch, arr } = CA; let ion = 0;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const a = arr[y * cw + x], age = step - a;
      if (age < 0) { ctx.fillStyle = (x + y) % 2 ? '#141827' : '#171b2c'; }
      else { ion++; ctx.fillStyle = age === 0 ? '#ffffff' : age < 3 ? '#aef6ff' : age < 8 ? '#00E5FF' : age < 16 ? '#0aa4c6' : '#086b86'; }
      ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
    }
    for (const s of CA.seeds) if (s.s <= step) { ctx.fillStyle = '#FFD600'; ctx.fillRect(s.x * cs - 3, s.y * cs - 3, cs + 6, cs + 6); }
    ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(100, 150, 820, 100);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#fff';
    ctx.fillText(`step ${String(step).padStart(2, '0')}   ionized ${(ion / (cw * ch) * 100).toFixed(1)}%`, 120, 190);
    ctx.fillStyle = '#00E5FF'; ctx.fillText('P(ion) = 1 − (1 − p)ⁿ   n = lit neighbours', 120, 230);
  }
};

// ---------- point cloud cosmic web ----------
let pc;
const pointcloudScene = {
  init(env) {
    const T = env.GL.THREE; const R = rng(33);
    const nodes = []; for (let i = 0; i < 46; i++) nodes.push([gauss(R) * 7, gauss(R) * 5, gauss(R) * 7]);
    const edges = new Set();
    nodes.forEach((a, i) => { const d = nodes.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), j]).sort((x, y) => x[0] - y[0]);
      for (let k = 1; k <= 3; k++) { const j = d[k][1]; edges.add(i < j ? i + ',' + j : j + ',' + i); } });
    const E = [...edges].map(s => s.split(',').map(Number));
    const n = 70000, T0 = new Float32Array(n * 3), I0 = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let x, y, z, c;
      const r = R();
      if (r < .72) { const [a, b] = E[Math.floor(R() * E.length)], u = R(), A = nodes[a], B = nodes[b], s = .18;
        x = lerp(A[0], B[0], u) + gauss(R) * s; y = lerp(A[1], B[1], u) + gauss(R) * s; z = lerp(A[2], B[2], u) + gauss(R) * s; c = [.55, .45, 1]; }
      else if (r < .93) { const A = nodes[Math.floor(R() * nodes.length)], s = .35; x = A[0] + gauss(R) * s; y = A[1] + gauss(R) * s; z = A[2] + gauss(R) * s; c = [1, .55, .85]; }
      else { x = (R() - .5) * 26; y = (R() - .5) * 18; z = (R() - .5) * 26; c = [.3, .35, .6]; }
      T0.set([x, y, z], i * 3); I0.set([(R() - .5) * 26, (R() - .5) * 18, (R() - .5) * 26], i * 3); col.set(c, i * 3);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const pts = new T.Points(g, new T.PointsMaterial({ size: .11, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    const scene = new T.Scene(); scene.background = new T.Color(0x020108); scene.add(pts);
    pc = { scene, cam: new T.PerspectiveCamera(50, W / H, .1, 200), g, T0, I0, n };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, k = easeOut(clamp(p * 1.25));
    const a = pc.g.attributes.position.array;
    for (let i = 0; i < pc.n * 3; i++) a[i] = pc.I0[i] + (pc.T0[i] - pc.I0[i]) * k;
    pc.g.attributes.position.needsUpdate = true;
    const ang = t * .35; const d = lerp(24, 15, easeInOut(p));
    pc.cam.position.set(Math.sin(ang) * d, 4 + Math.sin(t) * 1, Math.cos(ang) * d); pc.cam.lookAt(0, 0, 0);
    env.GL.draw(ctx, pc.scene, pc.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#c9b8ff';
    ctx.fillText(`dark matter · 70 000 pts · collapse ${Math.round(k * 100)}%`, 120, 200);
  }
};

// ---------- galaxy particles ----------
let gx;
const galaxyScene = {
  init(env) {
    const T = env.GL.THREE, R = rng(44), n = 80000;
    const rr = new Float32Array(n), base = new Float32Array(n), off = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const cIn = new T.Color('#ffe2b0'), cOut = new T.Color('#5b8cff'), cPink = new T.Color('#ff5fa2');
    for (let i = 0; i < n; i++) {
      const r = Math.pow(R(), 1.6) * 11; rr[i] = r; const arm = i % 3;
      base[i] = arm * 2.094 + Math.log(r + 1) * 2.4;
      off[i * 3] = gauss(R); off[i * 3 + 1] = gauss(R); off[i * 3 + 2] = gauss(R);
      const c = cIn.clone().lerp(cOut, Math.min(1, r / 9)); if (R() < .06) c.copy(cPink);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const pts = new T.Points(g, new T.PointsMaterial({ size: .09, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    const scene = new T.Scene(); scene.background = new T.Color(0x02020a); scene.add(pts); scene.add(starfield(T));
    const core = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T), color: 0xffd9a0, blending: T.AdditiveBlending, transparent: true, depthWrite: false }));
    core.scale.set(6, 6, 1); scene.add(core);
    gx = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 300), g, rr, base, off, n };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, spread = lerp(2.2, .35, easeOut(p)), a = gx.g.attributes.position.array;
    for (let i = 0; i < gx.n; i++) {
      const r = gx.rr[i], th = gx.base[i] * lerp(.2, 1, easeOut(p)) - t * 1.6 / (r * .35 + .6);
      const s = spread * (.3 + r * .12);
      a[i * 3] = Math.cos(th) * r + gx.off[i * 3] * s; a[i * 3 + 2] = Math.sin(th) * r + gx.off[i * 3 + 2] * s;
      a[i * 3 + 1] = gx.off[i * 3 + 1] * (.5 * Math.exp(-r * .25) + .08) * (1 + spread);
    }
    gx.g.attributes.position.needsUpdate = true;
    const ang = t * .25 + .3; gx.cam.position.set(Math.sin(ang) * 17, lerp(6, 10, p), Math.cos(ang) * 17); gx.cam.lookAt(0, -1, 0);
    env.GL.draw(ctx, gx.scene, gx.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#ffe2b0';
    ctx.fillText('80 000 stars · 3 arms · ω(r) ∝ 1/r', 120, 200);
  }
};

// ---------- spacetime curvature ----------
let sp;
const spacetimeScene = {
  init(env) {
    const T = env.GL.THREE, N = 44, S = 110, L = 13;
    const segs = N * 2 * S; const pos = new Float32Array(segs * 2 * 3), col = new Float32Array(segs * 2 * 3);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const lines = new T.LineSegments(g, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .95 }));
    const scene = new T.Scene(); scene.background = new T.Color(0x03020a); scene.add(lines); scene.add(starfield(T));
    const bh = new T.Mesh(new T.SphereGeometry(.75, 48, 32), new T.MeshBasicMaterial({ color: 0x000000 })); scene.add(bh);
    const ring = new T.Sprite(new T.SpriteMaterial({ map: dotTexture(T, false), color: 0xffa040, blending: T.AdditiveBlending, transparent: true, depthWrite: false })); scene.add(ring);
    const R = rng(55), dn = 9000, dp = new Float32Array(dn * 3), dc = new Float32Array(dn * 3), dr = new Float32Array(dn), da = new Float32Array(dn);
    for (let i = 0; i < dn; i++) { dr[i] = 1.1 + Math.pow(R(), 1.5) * 2.6; da[i] = R() * 6.283; const h = 1 - (dr[i] - 1.1) / 2.6; dc.set([1, .45 + h * .5, .15 + h * .6], i * 3); }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3)); dg.setAttribute('color', new T.BufferAttribute(dc, 3));
    const disk = new T.Points(dg, new T.PointsMaterial({ size: .07, vertexColors: true, map: dotTexture(T), transparent: true, depthWrite: false, blending: T.AdditiveBlending })); scene.add(disk);
    const orbs = []; for (let i = 0; i < 4; i++) { const m = new T.Mesh(new T.SphereGeometry(.22, 16, 12), new T.MeshBasicMaterial({ color: [0x00e5ff, 0xffd600, 0xff3d7f, 0xffffff][i] })); scene.add(m); orbs.push({ m, r: 4 + i * 1.9, w: 1.6 / Math.pow(4 + i * 1.9, 1.5) * 8, a: i * 1.7 }); }
    sp = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 300), g, N, S, L, bh, ring, dg, dr, da, dn, orbs };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, M = lerp(.25, 1.5, easeOut(p));
    const Y = (x, z) => -M * 3 / Math.sqrt(x * x + z * z + .5);
    const { N, S, L } = sp; const pos = sp.g.attributes.position.array, col = sp.g.attributes.color.array; let k = 0;
    const put = (x, z) => { const y = Y(x, z); pos[k] = x; pos[k + 1] = y; pos[k + 2] = z;
      const d = clamp(-y / 4); col[k] = lerp(0, .7, d); col[k + 1] = lerp(.9, .35, d); col[k + 2] = 1; k += 3; };
    for (let i = 0; i < N; i++) { const c = -L + 2 * L * i / (N - 1);
      for (let s = 0; s < S; s++) { const u0 = -L + 2 * L * s / S, u1 = -L + 2 * L * (s + 1) / S; put(u0, c); put(u1, c); put(c, u0); put(c, u1); } }
    sp.g.attributes.position.needsUpdate = true; sp.g.attributes.color.needsUpdate = true;
    const yc = Y(0, 0) + .75; sp.bh.position.set(0, yc, 0); sp.ring.position.set(0, yc, 0); sp.ring.scale.setScalar(4.2 + Math.sin(t * 9) * .2);
    const dp = sp.dg.attributes.position.array;
    for (let i = 0; i < sp.dn; i++) { const r = sp.dr[i], a = sp.da[i] + t * 5 / Math.pow(r, 1.5); dp[i * 3] = Math.cos(a) * r; dp[i * 3 + 2] = Math.sin(a) * r; dp[i * 3 + 1] = yc + Math.sin(a) * r * .08; }
    sp.dg.attributes.position.needsUpdate = true;
    sp.orbs.forEach(o => { const a = o.a + t * o.w; const x = Math.cos(a) * o.r, z = Math.sin(a) * o.r; o.m.position.set(x, Y(x, z) + .22, z); });
    const ang = t * .3 + .4; sp.cam.position.set(Math.sin(ang) * 15, 7.5, Math.cos(ang) * 15); sp.cam.lookAt(0, -2.2, 0);
    env.GL.draw(ctx, sp.scene, sp.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#d8c8ff';
    ctx.fillText(`M = ${(M * 4).toFixed(1)}×10⁹ M☉   ·   ds² = −(1−rₛ/r)c²dt² + …`, 120, 200);
  }
};

// ---------- glitch supernova ----------
const tmp = makeCanvas(), tctx = tmp.getContext('2d');
const tints = ['#ff0000', '#00ff00', '#0000ff'].map(c => { const cv = makeCanvas(); return { cv, x: cv.getContext('2d'), c }; });
const ELEM = ['Fe', 'Ni', 'Au', 'Pt', 'U', 'Si', 'O', 'C', 'Ca', 'Ag', 'Pb', 'I'];
const glitchScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, f = env.f, boom = .3;
    ctx.fillStyle = '#04020a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 - 20;
    if (p < boom) { const s = 1 + .25 * Math.sin(t * 40) * p / boom;
      glowDot(ctx, cx, cy, 380 * s, 'rgba(255,120,60,.9)', 1); glowDot(ctx, cx, cy, 150 * s, 'rgba(255,240,200,1)', 1);
    } else {
      const age = (p - boom) * env.live;
      glowDot(ctx, cx, cy, 90 + 30 * Math.sin(t * 30), 'rgba(170,220,255,1)', 1);
      ctx.strokeStyle = 'rgba(170,220,255,.9)'; ctx.lineWidth = 6; ctx.beginPath(); const ba = t * 8;
      ctx.moveTo(cx - Math.cos(ba) * 900, cy - Math.sin(ba) * 900); ctx.lineTo(cx + Math.cos(ba) * 900, cy + Math.sin(ba) * 900); ctx.stroke();
      const R = rng(66); ctx.textAlign = 'center';
      for (let i = 0; i < 260; i++) { const a = R() * 6.283, v = 500 + R() * 900, d = v * Math.pow(age, .6);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .8; const c = ['#ff6a2b', '#FFD600', '#ff3d7f', '#fff'][i % 4];
        if (i % 3 === 0) { ctx.font = `bold ${28 + (i % 5) * 8}px ${MONO}`; ctx.fillStyle = c; ctx.fillText(ELEM[i % ELEM.length], x, y); }
        else glowDot(ctx, x, y, 22, c, .9); }
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'rgba(255,200,120,.8)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(cx, cy, 1300 * Math.pow(age, .6), 1040 * Math.pow(age, .6), 0, 0, 7); ctx.stroke();
    }
    ctx.font = `900 120px ${MONO}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(p < boom ? 'CORE COLLAPSE' : 'Fe · Au · U', cx, 250); ctx.textAlign = 'left';
    // ---- glitch pass ----
    const R = rng(f * 31 + 7), amt = clamp(p < boom ? p / boom * .4 : 1.2 - (p - boom) * .9) * (f % 6 < 2 ? 1.4 : .7);
    tctx.drawImage(ctx.canvas, 0, 0);
    const sh = 8 + amt * 26;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    tints.forEach((q, i) => { q.x.globalCompositeOperation = 'source-over'; q.x.drawImage(tmp, 0, 0); q.x.globalCompositeOperation = 'multiply'; q.x.fillStyle = q.c; q.x.fillRect(0, 0, W, H);
      ctx.drawImage(q.cv, (i - 1) * sh, (i - 1) * sh * .3); });
    ctx.globalCompositeOperation = 'source-over';
    tctx.drawImage(ctx.canvas, 0, 0);
    const bands = Math.floor(4 + amt * 16);
    for (let i = 0; i < bands; i++) { const y = R() * H, h = 6 + R() * 70, dx = (R() - .5) * 260 * amt; ctx.drawImage(tmp, 0, y, W, h, dx, y, W, h); }
    for (let i = 0; i < amt * 8; i++) { const w = 60 + R() * 260, h = 20 + R() * 90, sx = R() * W, sy = R() * H;
      ctx.drawImage(tmp, sx, sy, w, h, R() * W, R() * H, w, h); }
    scanlines(ctx, .2, 3);
  }
};

// ---------- parallax solar system ----------
const PX = (() => { const R = rng(77);
  return { stars: Array.from({ length: 400 }, () => [R() * W * 1.6 - W * .3, R() * H, R() * 2 + .5]),
    rocks: Array.from({ length: 7 }, (_, i) => ({ x: i * 420 - 300 + R() * 100, y: i % 2 ? 880 + R() * 80 : 120 + R() * 100, r: 90 + R() * 120, pts: Array.from({ length: 9 }, () => .7 + R() * .4) })),
    dust: Array.from({ length: 30 }, () => [R() * W * 2 - W * .5, R() * H, 20 + R() * 50]) }; })();
const PLANETS = [[150, '#c9b29b', 9], [230, '#e8c27a', 14], [320, '#4f9dff', 15], [410, '#d0674a', 11], [560, '#e0b27f', 34], [700, '#e9d7a3', 28]];
const parallaxScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, cam = lerp(-260, 260, easeInOut(p));
    ctx.fillStyle = '#060818'; ctx.fillRect(0, 0, W, H);
    // L0 stars
    for (const [x, y, s] of PX.stars) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x - cam * .1, y, s, s); }
    // L1 nebula
    ctx.save(); ctx.translate(-cam * .3, 0);
    glowDot(ctx, 500, 350, 520, 'rgba(120,60,200,.35)'); glowDot(ctx, 1500, 700, 600, 'rgba(0,180,200,.25)'); ctx.restore();
    // L2 disk + sun + planets (paper cut layer with shadow)
    ctx.save(); ctx.translate(W / 2 - cam * .6, H / 2 - 20);
    ctx.scale(1, .36);
    const cond = easeOut(clamp((p - .15) / .7));
    for (let r = 120; r < 780; r += 22) { ctx.strokeStyle = `rgba(255,${180 + (r % 60)},120,${(1 - cond) * .35 + .05})`; ctx.lineWidth = 10; ctx.setLineDash([30, 14]); ctx.lineDashOffset = -t * 400 / r * 30; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; for (const [r] of PLANETS) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.translate(W / 2 - cam * .6, H / 2 - 20);
    glowDot(ctx, 0, 0, 260, 'rgba(255,200,80,.8)'); ctx.fillStyle = '#FFE08A'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill();
    PLANETS.forEach(([r, c, s], i) => { const a = t * 3 / Math.sqrt(r / 100) + i * 1.3; const x = Math.cos(a) * r, y = Math.sin(a) * r * .36;
      const sz = s * cond; if (sz < 1) return; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(x + 6, y + 8, sz, 0, 7); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, sz, 0, 7); ctx.fill(); if (i === 5) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, sz * 2, sz * .6, -.3, 0, 7); ctx.stroke(); } });
    ctx.restore();
    // L3 rocks
    ctx.save(); ctx.translate(-cam * 1.2, 0);
    for (const r of PX.rocks) { ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(t * .2);
      ctx.beginPath(); r.pts.forEach((k, i) => { const a = i / r.pts.length * 6.283; const x = Math.cos(a) * r.r * k, y = Math.sin(a) * r.r * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
      ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.fillStyle = '#1b1426'; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#FFD600'; ctx.globalAlpha = .6; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1; ctx.restore(); }
    ctx.restore();
    // L4 dust
    for (const [x, y, s] of PX.dust) glowDot(ctx, x - cam * 2, y, s, 'rgba(255,220,180,.35)');
    // depth labels
    ctx.font = `bold 20px ${MONO}`; ctx.fillStyle = '#FFD600';
    ['z=0.1 stars', 'z=0.3 nebula', 'z=0.6 disk', 'z=1.2 rocks', 'z=2.0 dust'].forEach((s, i) => ctx.fillText(s, 120, 180 + i * 30));
  }
};

// ---------- voxel earth ----------
let vx;
const voxelScene = {
  init(env) {
    const T = env.GL.THREE, R = rng(88), Rad = 13; const cells = [];
    for (let x = -Rad; x <= Rad; x++) for (let y = -Rad; y <= Rad; y++) for (let z = -Rad; z <= Rad; z++) {
      const d = Math.hypot(x, y, z); if (d > Rad || d <= Rad - 1.3) continue;
      const n = fbm(x * .11 + 3, y * .11, z * .11, 4); const land = n > .02;
      let c; if (Math.abs(y) > Rad * .82) c = '#f2f6ff'; else if (land) c = n > .16 ? '#8d6e4a' : (n > .1 ? '#3d8b3d' : '#56b04a'); else c = n < -.12 ? '#154fa8' : '#1f78e0';
      const tgt = new T.Vector3(x, y, z).multiplyScalar(land ? 1.05 : 1);
      const dir = tgt.clone().normalize();
      const start = dir.clone().multiplyScalar(Rad * (2.5 + R() * 2.5)).add(new T.Vector3(gauss(R), gauss(R) + 8, gauss(R)).multiplyScalar(4));
      cells.push({ tgt, start, a: (y + Rad) / (2 * Rad) * .55 + R() * .08, c: new T.Color(c) });
    }
    const mesh = new T.InstancedMesh(new T.BoxGeometry(.94, .94, .94), new T.MeshStandardMaterial({ roughness: .7, flatShading: true }), cells.length);
    cells.forEach((c, i) => mesh.setColorAt(i, c.c));
    const moon = new T.Group(); for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) for (let z = -2; z <= 2; z++) if (Math.hypot(x, y, z) <= 2.3) { const m = new T.Mesh(new T.BoxGeometry(.94, .94, .94), new T.MeshStandardMaterial({ color: 0xaaaaaa, flatShading: true })); m.position.set(x, y, z); moon.add(m); }
    const scene = new T.Scene(); scene.background = new T.Color(0x02030a);
    const grp = new T.Group(); grp.add(mesh); scene.add(grp); scene.add(moon); scene.add(starfield(T));
    scene.add(new T.AmbientLight(0x8090c0, .9)); const sun = new T.DirectionalLight(0xfff1d0, 2.6); sun.position.set(20, 10, 12); scene.add(sun);
    vx = { scene, cam: new T.PerspectiveCamera(40, W / H, .1, 400), mesh, grp, moon, cells, m4: new T.Matrix4(), v: new T.Vector3(), T };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, { cells, mesh, m4, v } = vx;
    cells.forEach((c, i) => { const k = easeOut(clamp((p - c.a) / .28)); v.lerpVectors(c.start, c.tgt, k); v.x = Math.round(v.x * 2) / 2; v.y = Math.round(v.y * 2) / 2; v.z = Math.round(v.z * 2) / 2; if (k >= 1) v.copy(c.tgt);
      const s = k < .02 ? .0001 : 1; m4.makeScale(s, s, s).setPosition(v); mesh.setMatrixAt(i, m4); });
    mesh.instanceMatrix.needsUpdate = true; vx.grp.rotation.y = t * .5; vx.grp.rotation.z = .41;
    const ma = t * .8 + 2; vx.moon.position.set(Math.cos(ma) * 24, 3, Math.sin(ma) * 24); vx.moon.visible = p > .6;
    vx.cam.position.set(0, 8, 56); vx.cam.lookAt(0, 0, 0);
    env.GL.draw(ctx, vx.scene, vx.cam, 1);
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#FF3D7F';
    ctx.fillText(`voxels placed: ${cells.filter(c => p > c.a + .2).length} / ${cells.length}`, 120, 200);
  }
};

// ---------- code rain DNA ----------
const RAIN = (() => { const R = rng(12); return Array.from({ length: 70 }, () => ({ sp: 500 + R() * 700, off: R() * 2000, len: 10 + Math.floor(R() * 18), s: Math.floor(R() * 1000) })); })();
const rainScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p, f = env.f;
    ctx.fillStyle = '#010502'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 26px ${MONO}`; ctx.textAlign = 'center'; const lh = 30;
    RAIN.forEach((c, i) => { const x = 14 + i * 28; const head = (t * c.sp + c.off) % (H + c.len * lh + 200) - 100;
      for (let k = 0; k < c.len; k++) { const y = head - k * lh; if (y < -30 || y > H + 30) continue;
        const ch = 'ATCG'[(c.s + k * 7 + Math.floor(t * 12) * (k === 0 ? 3 : 0) + Math.floor(y / lh)) & 3];
        ctx.fillStyle = k === 0 ? '#eaffea' : `rgba(0,255,90,${(1 - k / c.len) * .75})`; ctx.fillText(ch, x, y); } });
    // DNA helix
    const cx = W / 2, n = 24, shown = Math.floor(easeOut(p * 1.2) * n);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(cx - 280, 100, 560, 800);
    for (let i = 0; i < shown; i++) {
      const y = 140 + i * 30, th = i * .5 + t * 3.2, x1 = cx + Math.cos(th) * 200, x2 = cx - Math.cos(th) * 200, z = Math.sin(th);
      const pair = ['A', 'T', 'C', 'G'][(i * 5 + 1) % 4], comp = { A: 'T', T: 'A', C: 'G', G: 'C' }[pair];
      ctx.strokeStyle = `rgba(160,255,190,${.35 + .3 * Math.abs(z)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.font = `bold ${30 + z * 8}px ${MONO}`;
      ctx.fillStyle = z > 0 ? '#ffffff' : '#62ff9a'; ctx.fillText(pair, x1, y + 10);
      ctx.fillStyle = z > 0 ? '#62ff9a' : '#ffffff'; ctx.fillText(comp, x2, y + 10);
    }
    ctx.textAlign = 'left';
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#62ff9a'; ctx.fillText(`genome.length = ${Math.floor(p * 3.2e9).toLocaleString()} bp`, 120, 200);
  }
};

export const SCENES = { ascii: asciiScene, lowpoly: lowpolyScene, ca: caScene, pointcloud: pointcloudScene, galaxy: galaxyScene,
  spacetime: spacetimeScene, glitch: glitchScene, parallax: parallaxScene, voxel: voxelScene, rain: rainScene };
