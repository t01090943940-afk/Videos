import { W, H, MONO, SANS, MATH, rng, clamp, lerp, smooth, easeOut, easeInOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

// ---------- 3D card stack (today) ----------
const SNIPS = [
  ['while (alive) {', '  learn();', '  build();', '}'], ['human.ask("why?")'], ['git commit -m', '  "civilization"'],
  ['const me =', '  stardust.recombine()'], ['telescope', '  .point(sky)'], ['import { curiosity }', '  from "@human"'],
  ['for (;;) wonder++'], ['print("hello,', '  universe")'], ['await think()'], ['new Language()'],
];
const CARD_C = ['#00E5FF', '#FFD600', '#FF3D7F', '#B388FF'];
let cd;
function cardTex(T, lines, i, hero) {
  const c = makeCanvas(640, 400), x = c.getContext('2d');
  x.fillStyle = hero ? '#FFD600' : '#12141c'; x.fillRect(0, 0, 640, 400);
  if (!hero) {
    x.fillStyle = CARD_C[i % 4]; x.fillRect(0, 0, 640, 44);
    x.fillStyle = '#000'; x.font = `bold 24px ${MONO}`; x.fillText(`human_${String(i).padStart(2, '0')}.js`, 18, 31);
    x.font = `bold 38px ${MONO}`; lines.forEach((l, k) => { x.fillStyle = k % 2 ? '#9CDCFE' : '#fff'; x.fillText(l, 30, 120 + k * 58); });
    x.strokeStyle = CARD_C[i % 4]; x.lineWidth = 6; x.strokeRect(3, 3, 634, 394);
  } else {
    x.fillStyle = '#000'; x.font = `900 76px ${SANS}`; x.fillText('你在这里', 40, 130);
    x.font = `900 60px ${MONO}`; x.fillText('YOU ARE HERE', 40, 220);
    x.font = `bold 34px ${MONO}`; x.fillText('13.8 Gyr · 1 planet', 40, 300); x.fillText('8 billion observers', 40, 350);
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}
const cardsScene = {
  init(env) {
    const T = env.GL.THREE; const scene = new T.Scene(); scene.background = new T.Color(0x0b0a12);
    const cards = SNIPS.map((s, i) => { const m = new T.Mesh(new T.PlaneGeometry(3.2, 2), new T.MeshBasicMaterial({ map: cardTex(T, s, i, false), side: T.DoubleSide })); scene.add(m); return m; });
    const hero = new T.Mesh(new T.PlaneGeometry(4.2, 2.62), new T.MeshBasicMaterial({ map: cardTex(T, [], 0, true), side: T.DoubleSide })); scene.add(hero);
    const grid = new T.GridHelper(40, 40, 0x333355, 0x1a1a2a); grid.position.y = -3; scene.add(grid);
    cd = { scene, cam: new T.PerspectiveCamera(45, W / H, .1, 200), cards, hero };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p;
    cd.cards.forEach((m, i) => {
      const a = i / cd.cards.length * 6.283 + t * .6, r = 6.2, y = (i % 5 - 2) * 1.1;
      const arrive = easeOut(clamp((p * 1.6 - i * .06) / .5));
      const R = lerp(20, r, arrive);
      m.position.set(Math.cos(a) * R, y + (1 - arrive) * 6, Math.sin(a) * R);
      m.lookAt(0, y, 0); m.rotateY(Math.PI);
    });
    const hp = back(clamp((p - .35) / .25));
    cd.hero.scale.setScalar(Math.max(.001, hp)); cd.hero.position.set(0, .2, 0);
    const ca = Math.sin(t * .5) * .35; cd.cam.position.set(Math.sin(ca) * 11, 2.2, Math.cos(ca) * 11); cd.cam.lookAt(0, 0, 0);
    cd.hero.lookAt(cd.cam.position);
    env.GL.draw(ctx, cd.scene, cd.cam, 1);
    if (hp > .5) { for (let k = 0; k < 3; k++) { const ph = (t * 1.2 + k / 3) % 1; ctx.strokeStyle = `rgba(255,214,0,${1 - ph})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(W / 2, H / 2 - 20, 260 + ph * 320, 0, 7); ctx.stroke(); } }
  }
};

// ---------- data viz: dark energy ----------
const Om = .31, OL = .69, TH = 14.4;
const aT = t => Math.pow(Om / OL, 1 / 3) * Math.pow(Math.sinh(1.5 * Math.sqrt(OL) * t / TH), 2 / 3);
const datavizScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#0c0f16'; ctx.fillRect(0, 0, W, H);
    const X0 = 190, X1 = 1380, Y0 = 820, Y1 = 170, TM = 60, AM = 16;
    const sx = v => X0 + (X1 - X0) * v / TM, sy = v => Y0 - (Y0 - Y1) * v / AM;
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.font = `20px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let v = 0; v <= TM; v += 10) { ctx.beginPath(); ctx.moveTo(sx(v), Y0); ctx.lineTo(sx(v), Y1); ctx.stroke(); ctx.fillText(v, sx(v) - 10, Y0 + 32); }
    for (let v = 0; v <= AM; v += 4) { ctx.beginPath(); ctx.moveTo(X0, sy(v)); ctx.lineTo(X1, sy(v)); ctx.stroke(); ctx.fillText(v, X0 - 40, sy(v) + 7); }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, Y1); ctx.lineTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `bold 24px ${MONO}`; ctx.fillText('t / Gyr →', X1 - 120, Y0 + 70); ctx.fillText('a(t)  宇宙尺度因子', X0, Y1 - 24);
    const tEnd = lerp(3, TM, easeInOut(p));
    // DE region
    ctx.fillStyle = 'rgba(0,229,255,.07)'; ctx.fillRect(sx(7.7), Y1, sx(Math.min(tEnd, TM)) - sx(7.7), Y0 - Y1);
    // matter only (dashed)
    ctx.setLineDash([10, 10]); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 3; ctx.beginPath();
    for (let v = 0; v <= tEnd; v += .25) { const y = sy(Math.pow(v / 13.8, 2 / 3)); v ? ctx.lineTo(sx(v), y) : ctx.moveTo(sx(v), y); } ctx.stroke(); ctx.setLineDash([]);
    neon(ctx, () => { for (let v = 0.01; v <= tEnd; v += .2) { const y = sy(Math.min(AM + 2, aT(v))); v > .02 ? ctx.lineTo(sx(v), y) : ctx.moveTo(sx(v), y); } }, '#00E5FF', 5, 22);
    const hx = sx(tEnd), hy = sy(Math.min(AM + 2, aT(tEnd))); glowDot(ctx, hx, hy, 40, '#ffffff');
    // annotations
    const ann = (tv, lab, col) => { if (tEnd < tv) return; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(sx(tv), Y0); ctx.lineTo(sx(tv), Y1 + 60); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.font = `bold 24px ${SANS}`; ctx.fillText(lab, sx(tv) + 10, Y1 + (tv > 10 ? 120 : 80)); };
    ann(7.7, '开始加速', '#FFD600'); ann(13.8, '今天', '#FF3D7F');
    ctx.font = `bold 22px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText('- - - 无暗能量', X1 - 300, sy(4.2));
    // donut
    const at = aT(tEnd), fDE = OL / (OL + Om * Math.pow(at, -3));
    const cx = 1640, cy = 470, r = 150;
    ctx.lineWidth = 56; ctx.strokeStyle = '#FFD600'; ctx.beginPath(); ctx.arc(cx, cy, r, -1.5708, 6.283 - 1.5708); ctx.stroke();
    ctx.strokeStyle = '#00E5FF'; ctx.beginPath(); ctx.arc(cx, cy, r, -1.5708, -1.5708 + 6.283 * fDE); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = `900 56px ${MONO}`; ctx.fillText(Math.round(fDE * 100) + '%', cx, cy + 10);
    ctx.font = `bold 22px ${SANS}`; ctx.fillText('暗能量占比', cx, cy + 46);
    ctx.fillStyle = '#00E5FF'; ctx.fillText('■ 暗能量 Λ', cx - 70, cy + 250); ctx.fillStyle = '#FFD600'; ctx.fillText('■ 物质', cx + 90, cy + 250);
    ctx.fillStyle = '#fff'; ctx.font = `bold 26px ${MONO}`; ctx.fillText(`t = ${tEnd.toFixed(1)} Gyr   a = ${at.toFixed(2)}`, cx, cy - 220);
    ctx.textAlign = 'left';
  }
};

// ---------- light cone (3+1) ----------
const LC = (() => { const R = rng(9); return Array.from({ length: 22 }, (_, i) => { const a = R() * 6.283, r = i < 4 ? .25 + R() * .25 : .5 + R() * .9; return { x: Math.cos(a) * r, z: Math.sin(a) * r, bound: i < 4 }; }); })();
const gU = u => Math.pow(Math.sinh(3.4 * u) / Math.sinh(3.4), 2 / 3) * 7 + .6;
const lightconeScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#06030e'; ctx.fillRect(0, 0, W, H);
    const cam = camera(t * .45 + .6, .3, 24, 1650, W / 2 + 80, H / 2 + 330);
    const HT = 12, Rh = 5.2, uNow = lerp(.35, 1, easeInOut(p));
    const P = (x, u, z) => cam(x, u * HT, z);
    const line = (pts, col, w, a = 1) => neon(ctx, () => pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])), col, w, w * 5, a);
    // horizon cylinder
    for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283; line([P(Math.cos(a) * Rh, 0, Math.sin(a) * Rh), P(Math.cos(a) * Rh, 1, Math.sin(a) * Rh)], '#FF3D7F', 1, .25); }
    for (const u of [0, .5, 1]) line(Array.from({ length: 49 }, (_, k) => P(Math.cos(k / 48 * 6.283) * Rh, u, Math.sin(k / 48 * 6.283) * Rh)), '#FF3D7F', 1.5, .4);
    // now plane
    line(Array.from({ length: 49 }, (_, k) => P(Math.cos(k / 48 * 6.283) * 11, uNow, Math.sin(k / 48 * 6.283) * 11)), '#ffffff', 1.5, .35);
    // our worldline + light cone
    line([P(0, 0, 0), P(0, uNow, 0)], '#FFD600', 4);
    const u0 = .35; for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283, rr = (uNow - u0) * 9; if (uNow > u0) line([P(0, u0, 0), P(Math.cos(a) * rr, uNow, Math.sin(a) * rr)], '#B388FF', 1.2, .5); }
    // galaxies
    for (const g of LC) {
      const pts = []; let out = false;
      for (let u = 0; u <= uNow; u += .02) { const s = g.bound ? 2 : gU(u); const x = g.x * s, z = g.z * s; pts.push(P(x, u, z)); if (Math.hypot(x, z) > Rh) out = true; }
      const col = g.bound ? '#3dffa0' : out ? '#FF3D7F' : '#00E5FF';
      line(pts, col, 2.2, out ? .55 : 1);
      const q = pts[pts.length - 1]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, 7); ctx.fill();
    }
    ctx.font = `bold 24px ${MONO}`;
    const lab = (x, u, z, s, c) => { const q = P(x, u, z); ctx.fillStyle = c; ctx.fillText(s, q[0] + 12, q[1]); };
    lab(0, 1.02, 0, 'time ↑', '#fff'); lab(Rh, .15, 0, 'event horizon', '#FF3D7F');
    ctx.fillStyle = '#3dffa0'; ctx.fillText('● 本星系群 (引力束缚)', 120, 190); ctx.fillStyle = '#FF3D7F'; ctx.fillText('● 已越过视界 · 永不可见', 120, 226); ctx.fillStyle = '#00E5FF'; ctx.fillText('● 仍可见', 120, 262);
  }
};

// ---------- volumetric red giant ----------
let vo;
const volumeScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({ uniforms: { uT: { value: 0 }, uR: { value: .6 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `precision highp float; varying vec2 vUv; uniform float uT, uR; uniform vec2 uRes;
float h(vec3 p){ p = fract(p*0.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float n(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
 return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*n(p); p=p*2.1; a*=.5; } return s; }
void main(){
  vec2 uv = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.);
  vec3 ro = vec3(0,0,-4.), rd = normalize(vec3(uv,1.8));
  vec3 col = vec3(0.); float T = 1.;
  float b = dot(ro,rd), c = dot(ro,ro)-uR*uR*1.25, disc = b*b-c;
  vec3 sp = floor(rd*300.); col += vec3(step(.997,h(sp)))*.6;
  if(disc>0.){
    float t0 = -b-sqrt(disc), t1 = -b+sqrt(disc); float dt = (t1-t0)/40.;
    vec3 acc = vec3(0.);
    for(int i=0;i<40;i++){
      vec3 p = ro+rd*(t0+dt*(float(i)+.5));
      float r = length(p)/uR;
      float d = fbm(p*2.2/uR + vec3(0.,uT*.6,uT*.3)) ;
      float den = clamp((1.08-r)*3.,0.,1.)*(0.35+d*1.3);
      vec3 e = mix(vec3(1.,.95,.7), vec3(1.,.28,.05), smoothstep(.2,.95,r));
      e = mix(e, vec3(.5,.02,.02), smoothstep(.85,1.1,r));
      acc += T*den*dt*e*3.2; T *= exp(-den*dt*3.5);
      if(T<.02) break;
    }
    col = col*T + acc;
  }
  col += vec3(1.,.3,.1)*.25*exp(-max(length(uv)-uR*.45,0.)*3.);
  gl_FragColor = vec4(col,1.);
}` });
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    vo = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    const t = env.t, p = env.p, R = lerp(.35, 2.1, easeInOut(p));
    vo.mat.uniforms.uT.value = t; vo.mat.uniforms.uR.value = R;
    env.GL.draw(ctx, vo.scene, vo.cam, .5);
    const rpx = R * 1.8 / Math.sqrt(16 - R * R) * 540;
    const orbs = [['水星', 190], ['金星', 330], ['地球 ?', 470], ['火星', 720]];
    ctx.font = `bold 24px ${SANS}`;
    orbs.forEach(([n, r], i) => { const gone = rpx > r * .98; const a = t * (1.6 - i * .3) + i * 2;
      ctx.strokeStyle = gone ? 'rgba(255,60,60,.8)' : 'rgba(255,255,255,.4)'; ctx.lineWidth = 2; ctx.setLineDash(gone ? [8, 8] : []);
      ctx.beginPath(); ctx.ellipse(W / 2, H / 2, r, r * .3, -.15, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const x = W / 2 + Math.cos(a) * r * Math.cos(-.15) - Math.sin(a) * r * .3 * Math.sin(-.15), y = H / 2 + Math.cos(a) * r * Math.sin(-.15) + Math.sin(a) * r * .3 * Math.cos(-.15);
      if (!gone) { ctx.fillStyle = i === 2 ? '#4f9dff' : '#ddd'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); }
      ctx.fillStyle = gone ? '#ff5c5c' : '#fff'; ctx.fillText(gone ? n + ' ✕' : n, W / 2 + r * .98 + 10, H / 2 - r * .14 - 8); });
    ctx.font = `bold 26px ${MONO}`; ctx.fillStyle = '#ffb38a'; ctx.fillText(`R☉ × ${Math.round(lerp(1, 250, easeInOut(p)))}`, 120, 200);
  }
};

// ---------- isometric: stars dying ----------
const ISO = (() => { const R = rng(4), N = 11, cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const m = R();
    const type = m < .1 ? 0 : m < .25 ? 1 : m < .5 ? 2 : m < .75 ? 3 : 4; // O B→white→yellow→orange→red
    const d = [0.02, .18, .38, .58, .76][type] + R() * .16; cells.push({ x, y, type, d, h: [300, 220, 160, 110, 70][type] * (.8 + R() * .4) }); }
  return { N, cells }; })();
const SC = ['#7fb0ff', '#e9f1ff', '#ffe98a', '#ffb05a', '#ff5a4a'], REM = ['#140024', '#ffffff', '#dfe7ff', '#c8c8c8', '#6a2a2a'];
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * k, g = (n >> 8 & 255) * k, b = (n & 255) * k; return `rgb(${r | 0},${g | 0},${b | 0})`; }
function isoBox(ctx, sx, sy, tw, th, h, col) {
  ctx.fillStyle = shade(col, 1); ctx.beginPath(); ctx.moveTo(sx, sy - h - th); ctx.lineTo(sx + tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx - tw, sy - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, .7); ctx.beginPath(); ctx.moveTo(sx - tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx, sy + th); ctx.lineTo(sx - tw, sy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, .45); ctx.beginPath(); ctx.moveTo(sx + tw, sy - h); ctx.lineTo(sx, sy - h + th); ctx.lineTo(sx, sy + th); ctx.lineTo(sx + tw, sy); ctx.closePath(); ctx.fill();
}
const isoScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, W, H);
    const tw = 52, th = 26, ox = W / 2, oy = 330; let alive = 0;
    const cells = [...ISO.cells].sort((a, b) => (a.x + a.y) - (b.x + b.y));
    for (const c of cells) {
      const sx = ox + (c.x - c.y) * tw, sy = oy + (c.x + c.y) * th;
      isoBox(ctx, sx, sy, tw - 2, th - 1, 6, '#2a2438');
      const k = 1 - smooth((p - c.d) / .1);
      if (k > .01) { alive++; const h = c.h * k * (1 + .04 * Math.sin(t * 9 + c.x)); isoBox(ctx, sx, sy - 6, tw * .55, th * .55, h, SC[c.type]);
        if (k < .6) glowDot(ctx, sx, sy - 6 - h, 60, 'rgba(255,255,255,.8)', (.6 - k) * 1.6); }
      else { const col = REM[c.type]; isoBox(ctx, sx, sy - 6, tw * (c.type === 0 ? .3 : .22), th * .22, c.type === 0 ? 20 : 14, col);
        if (c.type === 0) { ctx.strokeStyle = '#B388FF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy - 20, 26, 12, 0, 0, 7); ctx.stroke(); } }
    }
    ctx.font = `bold 30px ${MONO}`; ctx.fillStyle = '#FFD600';
    ctx.fillText(`stars.alive = ${alive.toString().padStart(3, ' ')} / ${ISO.cells.length}`, 120, 200);
    ctx.font = `bold 22px ${SANS}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('大质量先死 → 红矮星最后熄灭 · 余下白矮星 / 黑洞', 120, 240);
  }
};

// ---------- math animation ----------
function reveal(ctx, x, y, w, h, k, fn) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * clamp(k), h); ctx.clip(); fn(); ctx.restore(); }
const mathScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const M = (s, sz = 86, it = true) => `${it ? 'italic ' : ''}${sz}px ${MATH}`;
    // line 1
    reveal(ctx, 180, 150, 900, 140, p / .28, () => {
      ctx.font = M(''); ctx.fillStyle = '#FFD600'; ctx.fillText('p⁺', 200, 250);
      ctx.fillStyle = '#fff'; ctx.font = M('', 86, false); ctx.fillText('→', 330, 250); ctx.font = M(''); ctx.fillText('e⁺ + π⁰', 460, 250); });
    reveal(ctx, 180, 290, 900, 140, (p - .22) / .25, () => {
      ctx.font = M(''); ctx.fillStyle = '#fff'; ctx.fillText('τ', 200, 390); ctx.font = `64px ${MATH}`; ctx.fillText('p', 238, 408);
      ctx.font = M('', 86, false); ctx.fillText('> 10', 300, 390); ctx.font = `56px ${MATH}`; ctx.fillText('34', 470, 345); ctx.font = M('', 86, false); ctx.fillText('yr  ?', 560, 390); });
    if (p > .4) { const k = clamp((p - .4) / .12); ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 4; ctx.beginPath(); const L = 2 * (130 + 120) * k; // surrounding rect draw-on
      ctx.setLineDash([L, 9999]); ctx.strokeRect(186, 310, 130, 120); ctx.setLineDash([]); }
    reveal(ctx, 180, 440, 1000, 150, (p - .42) / .25, () => {
      ctx.font = M(''); ctx.fillStyle = '#58C4DD'; ctx.fillText('N(t) = N', 200, 540); ctx.font = `56px ${MATH}`; ctx.fillText('0', 540, 560);
      ctx.font = M(''); ctx.fillText('· e', 590, 540); ctx.font = `italic 56px ${MATH}`; ctx.fillText('−t/τ', 700, 490); });
    // plot
    const X0 = 200, X1 = 1000, Y0 = 820, Y1 = 620, k = clamp((p - .55) / .45);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, Y1 - 20); ctx.lineTo(X0, Y0); ctx.lineTo(X1 + 20, Y0); ctx.stroke();
    ctx.strokeStyle = '#58C4DD'; ctx.lineWidth = 6; ctx.beginPath();
    for (let x = 0; x <= k; x += .01) { const y = Y0 - (Y0 - Y1) * Math.exp(-x * 4); x ? ctx.lineTo(X0 + x * (X1 - X0), y) : ctx.moveTo(X0, y); } ctx.stroke();
    if (k > 0) glowDot(ctx, X0 + k * (X1 - X0), Y0 - (Y0 - Y1) * Math.exp(-k * 4), 30, '#FFD600');
    // proton dots decaying
    const R = rng(123), frac = Math.exp(-k * 4);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) { const r = R(); const x = 1200 + i * 50, y = 200 + j * 72;
      const alive = r < frac; ctx.fillStyle = alive ? '#FFD600' : 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(x, y, alive ? 16 : 6, 0, 7); ctx.fill();
      if (!alive && r < frac + .05) glowDot(ctx, x, y, 40, 'rgba(255,90,90,1)', .9); }
    ctx.font = `bold 24px ${MONO}`; ctx.fillStyle = '#fff'; ctx.fillText(`protons left: ${Math.round(frac * 100)}%`, 1200, 800);
  }
};

// ---------- vector scope: hawking ----------
const scopeScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#010a04'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2 - 220, cy = H / 2 - 20;
    ctx.strokeStyle = 'rgba(57,255,122,.12)'; ctx.lineWidth = 1;
    for (let x = cx - 700; x <= cx + 700; x += 70) { ctx.beginPath(); ctx.moveTo(x, cy - 350); ctx.lineTo(x, cy + 350); ctx.stroke(); }
    for (let y = cy - 350; y <= cy + 350; y += 70) { ctx.beginPath(); ctx.moveTo(cx - 700, y); ctx.lineTo(cx + 700, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(57,255,122,.3)'; ctx.beginPath(); ctx.moveTo(cx - 700, cy); ctx.lineTo(cx + 700, cy); ctx.moveTo(cx, cy - 350); ctx.lineTo(cx, cy + 350); ctx.stroke();
    const Mf = q => Math.pow(Math.max(0, 1 - q * .985), 1 / 3);
    for (let e = 3; e >= 0; e--) { // phosphor persistence
      const q = Math.max(0, p - e * .02), Rb = 330 * Mf(q), a = e ? .18 / e : 1;
      neon(ctx, () => { for (let k = 0; k <= 120; k++) { const an = k / 120 * 6.283, w = 1 + .03 * Math.sin(an * 7 + t * 20) * (1 - Mf(q) + .2);
        const x = cx + Math.cos(an) * Rb * w, y = cy + Math.sin(an) * Rb * w; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, '#39ff7a', 3, 16, a);
    }
    const M = Mf(p), Rb = 330 * M, rate = Math.min(400, 12 / Math.max(M, .03));
    const R = rng(Math.floor(t * 12) * 13 + 1);
    ctx.strokeStyle = '#b8ffcf'; ctx.lineWidth = 2;
    for (let i = 0; i < rate; i++) { const an = R() * 6.283, d = Rb + R() * 500, l = 16 + R() * 30;
      ctx.globalAlpha = .9 - (d - Rb) / 600; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * d, cy + Math.sin(an) * d); ctx.lineTo(cx + Math.cos(an) * (d + l), cy + Math.sin(an) * (d + l)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (p > .93) glowDot(ctx, cx, cy, 700 * (p - .93) / .07 + 50, 'rgba(220,255,230,1)', 1);
    // readout panel: T vs t
    const X0 = 1400, X1 = 1840, Y0 = 700, Y1 = 380;
    ctx.strokeStyle = 'rgba(57,255,122,.5)'; ctx.lineWidth = 2; ctx.strokeRect(X0, Y1, X1 - X0, Y0 - Y1);
    neon(ctx, () => { for (let q = 0; q <= p; q += .005) { const T = Math.min(1, .08 / Math.max(Mf(q), .08)); const x = X0 + (X1 - X0) * q, y = Y0 - (Y0 - Y1) * T; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, '#39ff7a', 2.5, 10);
    ctx.font = `bold 22px ${MONO}`; ctx.fillStyle = '#39ff7a';
    ctx.fillText('CH1  T_H(t)', X0, Y1 - 16); ctx.fillText(`M = ${(M * 100).toFixed(1)}%`, X0, Y0 + 36); ctx.fillText('T_H = ħc³ / 8πGMk_B', X0, Y0 + 72); ctx.fillText('M³ ∝ (t_evap − t)', X0, Y0 + 106);
    ctx.fillText('10 ms/div   ·   5 V/div   ·   TRIG ▲', cx - 700, cy - 370);
    scanlines(ctx, .15, 3);
  }
};

// ---------- TUI heat death ----------
const tuiScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    const fadeG = smooth((p - .72) / .28);
    ctx.fillStyle = '#000814'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 28px ${MONO}`; const cw = ctx.measureText('0').width, lh = 42, x0 = 110; let y = 190;
    const col = c => fadeG > 0 ? mix(c, '#5a5a5a', fadeG) : c;
    const bar = (lab, v, txt, c) => { const n = 56, k = Math.round(clamp(v) * n);
      ctx.fillStyle = col('#00E5FF'); ctx.fillText(lab, x0, y);
      ctx.fillStyle = col('#fff'); ctx.fillText('[' + ' '.repeat(n) + ']', x0 + cw * 4, y);
      ctx.fillStyle = col(c); ctx.fillText('|'.repeat(k), x0 + cw * 5, y);
      ctx.fillStyle = col('#eee'); ctx.fillText(txt, x0 + cw * (4 + n + 3), y); y += lh; };
    const S = lerp(.9, 1, easeOut(clamp(p / .7)));
    bar('  S', S, (S * 100).toFixed(4) + '%', S > .999 ? '#ff4d4d' : '#3ddc84');
    bar('  F', 1 - S, ((1 - S) * 100).toFixed(4) + '%', '#FFD600');
    bar('  T', .02 * (1 - p), `1e-${Math.round(lerp(20, 30, p))} K`, '#B388FF');
    y += 10; ctx.fillStyle = col('#ddd');
    ctx.fillText(`  Tasks: stars 0, black holes ${Math.max(0, Math.round(3 * (1 - p * 1.4)))}, photons ∞ (redshifting)`, x0, y); y += lh;
    ctx.fillText(`  Load average: 0.00 0.00 0.00    Uptime: 10^${Math.round(lerp(100, 1000, p))} yr`, x0, y); y += lh + 14;
    ctx.fillStyle = col('#3ddc84'); ctx.fillRect(x0, y - 32, W - 2 * x0, lh); ctx.fillStyle = '#000';
    ctx.fillText('  PID USER       PRI  S   %CPU  %MEM  COMMAND', x0, y); y += lh + 6;
    const rows = [
      ['    1', 'cosmos   ', ' 20', 'S', ' 0.0', ' 0.0', '/sbin/universe --idle', '#fff'],
      ['   42', 'photon   ', ' 20', 'R', ' 0.0', '   ∞', 'redshift --forever', '#9CDCFE'],
      ['   77', 'electron ', ' 20', 'S', ' 0.0', ' 0.0', 'drift', '#9CDCFE'],
      ['  108', 'neutrino ', ' 20', 'S', ' 0.0', ' 0.0', 'drift', '#9CDCFE'],
      ['  404', 'star     ', ' --', 'X', '   —', '   —', '[defunct]', '#ff5c5c'],
      ['  666', 'blackhole', ' --', 'X', '   —', '   —', '[evaporated]', '#ff5c5c'],
      ['  999', 'you      ', ' --', 'X', '   —', '   —', '[remembered]', '#FFD600'],
    ];
    rows.forEach((r, i) => { if (p < i * .07) return; ctx.fillStyle = col(r[7]);
      ctx.fillText(`${r[0]} ${r[1]}  ${r[2]}  ${r[3]}  ${r[4]}  ${r[5]}  ${r[6]}`, x0, y); y += lh; });
    const fy = 880; const keys = ['F1Help', 'F2Setup', 'F3Search', 'F5Tree', 'F9Kill', 'F10Quit'];
    let fx = x0; ctx.font = `bold 24px ${MONO}`;
    keys.forEach((k, i) => { const w = ctx.measureText(k).width + 30; ctx.fillStyle = i === 5 && p > .6 ? col('#ff4d4d') : col('#00E5FF'); ctx.fillRect(fx, fy - 28, w, 38); ctx.fillStyle = '#000'; ctx.fillText(k, fx + 15, fy); fx += w + 10; });
    if (fadeG > 0) { ctx.fillStyle = `rgba(90,90,90,${fadeG * .85})`; ctx.fillRect(0, 0, W, H); }
    if (p > .85) { ctx.textAlign = 'center'; ctx.fillStyle = `rgba(255,255,255,${(p - .85) / .15})`; ctx.font = `900 60px ${MONO}`; ctx.fillText('S = S_max · nothing left to compute', W / 2, H / 2); ctx.textAlign = 'left'; }
  }
};
function mix(a, b, k) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map(s => Math.round(lerp(A >> s & 255, B >> s & 255, k))); return `rgb(${c.join(',')})`; }

export const SCENES = { cards: cardsScene, dataviz: datavizScene, lightcone: lightconeScene, volume: volumeScene, iso: isoScene, math: mathScene, scope: scopeScene, tui: tuiScene };
