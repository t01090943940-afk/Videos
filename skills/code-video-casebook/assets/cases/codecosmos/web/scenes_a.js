import { W, H, MONO, SANS, rng, clamp, lerp, smooth, easeOut, back, fbm, noise3, neon, glowDot, scanlines, camera, makeCanvas } from './lib.js';

// ---------- shared terminal ----------
export function terminal(ctx, env, lines, opt = {}) {
  ctx.fillStyle = '#0b0906'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1100);
  g.addColorStop(0, 'rgba(255,176,0,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.font = `bold 46px ${MONO}`; ctx.textBaseline = 'alphabetic';
  let y = 250; const x = 150; let lastX = x, lastY = y;
  for (const L of lines) {
    const txt = L.txt;
    ctx.fillStyle = L.col || '#FFB000';
    ctx.globalAlpha = .25; ctx.fillText(txt, x + 2, y + 2); ctx.globalAlpha = 1; // ghost
    ctx.fillText(txt, x, y); lastX = x + ctx.measureText(txt).width; lastY = y; y += 70;
  }
  if (opt.cursor) { ctx.fillStyle = '#FFB000'; ctx.fillRect(lastX + 6, lastY - 40, 26, 48); }
  scanlines(ctx, .22, 4);
}
function typed(s, k) { return s.slice(0, Math.max(0, Math.floor(k))); }

const AMB = '#FFB000', ERR = '#FF5C5C', OK = '#8CFF9E', DIM = '#8a6a1a';

const terminalScene = {
  draw(ctx, env) {
    const t = env.t, f = env.f;
    const cmd = './universe --before-time';
    const k = (t - 0.35) * 26; // chars typed
    const lines = [{ txt: '$ ' + typed(cmd, k), col: AMB }];
    const outT = 0.35 + cmd.length / 26 + 0.1;
    const outs = [
      { txt: '[boot] loading spacetime ........ FAIL', col: DIM },
      { txt: '[err ] time  is not defined', col: ERR },
      { txt: '[err ] space is not defined', col: ERR },
      { txt: '[warn] ⟨0|H|0⟩ ≠ 0  → vacuum fluctuating…', col: '#FFE08A' },
    ];
    outs.forEach((o, i) => { if (t > outT + i * 0.22) lines.push(o); });
    const blink = Math.floor(f / 3) % 2 === 0 || (k > 0 && k < cmd.length);
    terminal(ctx, env, lines, { cursor: blink });
  }
};

const loopScene = {
  draw(ctx, env) {
    const t = env.t, f = env.f, last = env.liveFrames - 1;
    const blink = Math.floor((last - f) / 3) % 2 === 0;
    if (t < 1.9) {
      const lines = [
        { txt: '[entropy]  S = S_max   (100.000 %)', col: ERR },
        { txt: '[energy ]  free energy = 0 J', col: DIM },
      ];
      if (t > .45) lines.push({ txt: '[sys    ]  universe.exit(0)', col: OK });
      if (t > .8) lines.push({ txt: '$ ' + typed('clear', (t - .9) * 14), col: AMB });
      terminal(ctx, env, lines, { cursor: blink });
      if (t > 1.55) { ctx.fillStyle = `rgba(11,9,6,${clamp((t - 1.55) / .3)})`; ctx.fillRect(0, 0, W, H); scanlines(ctx, .22, 4); }
    } else {
      terminal(ctx, env, [{ txt: '$ ', col: AMB }], { cursor: blink });
    }
  }
};

// ---------- hexdump ----------
const hexScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#05070c'; ctx.fillRect(0, 0, W, H);
    ctx.font = `bold 30px ${MONO}`; ctx.textBaseline = 'alphabetic';
    const cw = ctx.measureText('0').width, lh = 42;
    const cols = 16, rowLen = 10 + cols * 3 + 2 + 18;
    const x0 = (W - rowLen * cw) / 2, y0 = 210;
    ctx.fillStyle = '#4a5a70'; ctx.fillText('vacuum.bin   ·   0 bytes of matter   ·   ⟨0|H|0⟩ ≠ 0', x0, 170);
    const base = Math.floor(t * 5);
    const cx = 7.5, cy = 8;
    for (let r = 0; r < 17; r++) {
      const row = base + r, y = y0 + r * lh;
      ctx.fillStyle = '#34465e'; ctx.fillText((row * 16).toString(16).padStart(8, '0'), x0, y);
      let ascii = '';
      for (let c = 0; c < cols; c++) {
        const R = rng(row * 131 + c * 7 + 3);
        const x = x0 + (10 + c * 3 + (c >= 8 ? 1 : 0)) * cw;
        let v = 0, a = 0;
        // fluctuation events: probability rises with p
        for (let e = 0; e < 3; e++) {
          const et = R() * 3.2, dur = .12 + R() * .25, thr = R();
          if (thr < .12 + p * .55 && t > et && t < et + dur) { v = Math.floor(R() * 255) + 1; a = 1 - (t - et) / dur; }
        }
        // convergence to centre near the end
        const d = Math.hypot(c - cx, r - cy);
        const conv = clamp((p - .72) / .28);
        if (conv > 0 && d < conv * 9) { const q = rng(row * 999 + c + Math.floor(t * 12))(); if (q < .7) { v = Math.floor(q * 360) + 1; a = Math.max(a, 1 - d / 10); } }
        if (r === 8 && c === 8 && p > .85) { v = 255; a = 1; }
        const hx = v.toString(16).padStart(2, '0').toUpperCase();
        if (v) {
          ctx.fillStyle = `rgba(0,229,255,${.25 * a})`; ctx.fillRect(x - 4, y - 30, cw * 2 + 8, 38);
          ctx.fillStyle = a > .5 ? '#E8FDFF' : '#00E5FF';
        } else ctx.fillStyle = '#1f2a3a';
        ctx.fillText(hx, x, y);
        ascii += v ? String.fromCharCode(33 + (v % 90)) : '.';
      }
      ctx.fillStyle = '#2c3a4e'; ctx.fillText('|' + ascii + '|', x0 + (10 + cols * 3 + 2) * cw, y);
    }
    if (p > .85) glowDot(ctx, x0 + (10 + 8 * 3 + 1) * cw + cw, y0 + 8 * lh - 12, 120 + 200 * (p - .85) / .15, 'rgba(200,250,255,.9)', .8);
    scanlines(ctx, .12, 3);
  }
};

// ---------- raymarch singularity ----------
let rm;
const raymarchScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uP: { value: 0 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `
precision highp float; varying vec2 vUv; uniform float uT, uP; uniform vec2 uRes;
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float map(vec3 p, float r){
  float d = length(p) - r;
  float k = 5.0/(r+0.25);
  d += sin(p.x*k+uT*3.)*sin(p.y*k-uT*2.3)*sin(p.z*k+uT*1.7)*0.12*r;
  return d;
}
void main(){
  vec2 uv = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.);
  float a = uT*0.6; vec3 ro = vec3(3.2*sin(a),0.6,3.2*cos(a));
  vec3 fw = normalize(-ro), rt = normalize(cross(vec3(0,1,0),fw)), up = cross(fw,rt);
  vec3 rd = normalize(fw*1.6 + uv.x*rt + uv.y*up);
  float r = mix(1.15, 0.035, pow(uP,0.8));
  float t = 0., glow = 0., hit = 0.;
  for(int i=0;i<72;i++){
    vec3 p = ro+rd*t; float d = map(p,r);
    glow += 0.012/(0.02+d*d*6.);
    if(d<0.001){hit=1.;break;}
    t += d*0.8; if(t>8.) break;
  }
  // lensed background stars
  vec3 b = rd; float imp = length(cross(ro, rd));
  b += normalize(-ro)*0.35*r/(imp*imp+0.05);
  vec3 q = floor(normalize(b)*160.);
  float st = step(0.995, hash(q)) * (0.5+0.5*sin(uT*4.+hash(q+1.)*30.));
  vec3 col = vec3(st)*0.9;
  vec3 hot = mix(vec3(1.0,0.35,0.55), vec3(0.75,0.95,1.0), uP);
  if(hit>0.){
    vec3 p = ro+rd*t; vec2 e = vec2(0.002,0);
    vec3 n = normalize(vec3(map(p+e.xyy,r)-map(p-e.xyy,r), map(p+e.yxy,r)-map(p-e.yxy,r), map(p+e.yyx,r)-map(p-e.yyx,r)));
    float fr = pow(1.-max(dot(n,-rd),0.),2.5);
    col = mix(vec3(0.05,0.02,0.08), hot*1.6, fr) + 0.5*vec3(0.5+0.5*n.x,0.3,0.5+0.5*n.y)*(1.-fr);
  }
  col += hot*glow*(0.08+uP*0.5);
  col += vec3(1.)*smoothstep(0.82,1.0,uP)*0.9*exp(-length(uv)*2.);
  gl_FragColor = vec4(col,1.);
}`});
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    rm = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    rm.mat.uniforms.uT.value = env.t; rm.mat.uniforms.uP.value = env.p;
    env.GL.draw(ctx, rm.scene, rm.cam, 0.5);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = `bold 26px ${MONO}`;
    ctx.fillText(`r = ${(Math.max(1.15 * Math.pow(1 - env.p, 3), 1e-35)).toExponential(2)} m`, 120, 200);
    ctx.fillText(`ρ → ∞`, 120, 240);
  }
};

// ---------- kinetic type: big bang ----------
const kineticScene = {
  draw(ctx, env) {
    const f = env.f, t = env.t, beat = Math.floor(f / 6), k = f % 6;
    const inv = beat === 1;
    ctx.fillStyle = inv ? '#fff' : '#000'; ctx.fillRect(0, 0, W, H);
    // shock rings
    for (let i = 0; i <= beat; i++) {
      const age = t - i * .5; if (age < 0) continue;
      const R = 80 + age * 1400;
      ctx.strokeStyle = inv ? `rgba(255,80,0,${.8 - age})` : `rgba(255,${140 + i * 40},0,${Math.max(0, .9 - age * .9)})`;
      ctx.lineWidth = 30 * Math.max(.1, 1 - age); ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, 7); ctx.stroke();
    }
    // particles
    const R = rng(42);
    for (let i = 0; i < 700; i++) {
      const a = R() * 6.283, sp = 300 + R() * 1500, s0 = R() * .4, len = 20 + R() * 120;
      const age = t - s0; if (age < 0) continue;
      const d = sp * Math.pow(age, .7);
      const x = W / 2 + Math.cos(a) * d, y = H / 2 + Math.sin(a) * d;
      const x2 = W / 2 + Math.cos(a) * Math.max(0, d - len), y2 = H / 2 + Math.sin(a) * Math.max(0, d - len);
      const c = R();
      ctx.strokeStyle = inv ? '#111' : (c < .33 ? '#fff' : c < .66 ? '#FFB347' : '#00E5FF');
      ctx.lineWidth = 1 + R() * 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pop = back(Math.min(1, k / 2.2)), sc = lerp(2.4, 1, pop);
    ctx.save(); ctx.translate(W / 2, H / 2 - 20); ctx.scale(sc, sc);
    if (beat === 0) { ctx.font = `900 430px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText('BIG', 0, 0); }
    else if (beat === 1) { ctx.font = `900 400px ${SANS}`; ctx.fillStyle = '#000'; ctx.fillText('BANG', 0, 0); }
    else {
      ctx.font = `900 150px ${SANS}`; ctx.fillStyle = '#fff'; ctx.fillText('大爆炸', 0, -120);
      ctx.font = `bold 110px ${MONO}`; ctx.fillStyle = '#00E5FF';
      ctx.fillText(typed('new Universe();', k * 4 + 3), 0, 60);
    }
    ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
};

// ---------- tesseract ----------
const DC = ['#00E5FF', '#FFD600', '#FF3D7F', '#B388FF'];
const V4 = []; for (let i = 0; i < 16; i++) V4.push([0, 1, 2, 3].map(b => (i >> b & 1) ? 1 : -1));
const E4 = []; for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (j > i) E4.push([i, j, b]); }
const tesseractScene = {
  draw(ctx, env) {
    const t = env.t, bt = env.beat;
    ctx.fillStyle = '#07040f'; ctx.fillRect(0, 0, W, H);
    // dot grid
    ctx.fillStyle = 'rgba(179,136,255,.18)';
    for (let x = 40; x < W; x += 60) for (let y = 40; y < H; y += 60) ctx.fillRect(x, y, 3, 3);
    const s = [0, 1, 2, 3].map(i => easeOut(clamp((bt - (i + .6)) / .55)));
    const infl = lerp(.9, 1.25, clamp(t / 2.5));
    const aw = s[3] * (t - 2.2) * 1.8;
    const cam = camera(t * .7 + .5, .45, 6.5, 1500 * infl, W / 2, H / 2 - 10);
    const P = V4.map(v => {
      let [x, y, z, w] = v.map((c, i) => c * s[i]);
      // XW + ZW rotation
      let x2 = x * Math.cos(aw) - w * Math.sin(aw), w2 = x * Math.sin(aw) + w * Math.cos(aw);
      let z2 = z * Math.cos(aw * .7) - w2 * Math.sin(aw * .7), w3 = z * Math.sin(aw * .7) + w2 * Math.cos(aw * .7);
      const k = 3 / (3 - w3 * .9);
      return cam(x2 * k, y * k, z2 * k);
    });
    for (const [i, j, b] of E4) {
      const a = P[i], c = P[j];
      if (Math.hypot(a[0] - c[0], a[1] - c[1]) < .5 && s[b] < .01) continue;
      neon(ctx, () => { ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); }, DC[b], 3.5, 18, .95);
    }
    for (const q of P) { glowDot(ctx, q[0], q[1], 26, 'rgba(255,255,255,.9)', .7); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fill(); }
    // dimension chips
    const cur = Math.min(4, Math.floor(bt + .4 - .6) + 1 < 0 ? 0 : Math.floor(bt - .05));
    ctx.font = `bold 34px ${MONO}`; ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = W / 2 + (i - 2) * 150, y = 190, on = i <= cur;
      ctx.fillStyle = on ? (i ? DC[i - 1] : '#fff') : 'rgba(255,255,255,.15)';
      ctx.fillText(i + 'D', x, y);
      if (i < 4) { ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillText('→', x + 75, y); }
    }
    ctx.textAlign = 'left';
    ctx.font = `bold 24px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillText(`scale ×10^${Math.round(lerp(0, 26, clamp(t / 2.4)))}`, 120, 300);
  }
};

// ---------- plasma shader ----------
let pl;
const plasmaScene = {
  init(env) {
    const T = env.GL.THREE;
    const mat = new T.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uRes: { value: new T.Vector2(W, H) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }`,
      fragmentShader: `precision highp float; varying vec2 vUv; uniform float uT; uniform vec2 uRes;
vec2 h2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.+2.*fract(sin(p)*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
 return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1,0)),f-vec2(1,0)),u.x), mix(dot(h2(i+vec2(0,1)),f-vec2(0,1)),dot(h2(i+1.),f-1.),u.x),u.y); }
float fbm(vec2 p){ float s=0.,a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5;} return s; }
void main(){
  vec2 p = (vUv*2.-1.)*vec2(uRes.x/uRes.y,1.)*1.6;
  vec2 q = vec2(fbm(p+uT*.9), fbm(p+vec2(5.2,1.3)-uT*.7));
  vec2 r = vec2(fbm(p+3.*q+vec2(1.7,9.2)+uT*1.3), fbm(p+3.*q+vec2(8.3,2.8)-uT));
  float f = fbm(p+3.*r);
  vec3 c = mix(vec3(.25,0.,.35), vec3(1.,.1,.45), clamp(f*2.+.5,0.,1.));
  c = mix(c, vec3(1.,.6,.1), clamp(length(q)*1.6,0.,1.));
  c = mix(c, vec3(1.,1.,.85), clamp(pow(length(r),3.)*4.,0.,1.));
  c *= .75+.6*f;
  gl_FragColor = vec4(c,1.);
}`});
    const scene = new T.Scene(); scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), mat));
    pl = { mat, scene, cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  },
  draw(ctx, env) {
    pl.mat.uniforms.uT.value = env.t * 1.4;
    env.GL.draw(ctx, pl.scene, pl.cam, 0.5);
    const R = rng(5), cols = ['#ff4d6d', '#3ddc84', '#4dabff'], t = env.t;
    ctx.font = `bold 22px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 60; i++) {
      const x0 = R() * W, y0 = R() * H, ph = R() * 100, c = cols[i % 3];
      const x = x0 + noise3(ph, t * 2.5) * 260, y = y0 + noise3(ph + 50, t * 2.5) * 260;
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.fill();
      ctx.fillStyle = '#000'; ctx.fillText('uds'[i % 3], x, y + 1);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `bold 28px ${MONO}`; ctx.fillStyle = '#fff'; ctx.fillText('T ≈ 10¹⁵ K   ·   quarks + gluons, unbound', 120, 200);
  }
};

// ---------- force graph: hadrons ----------
const HAD = (() => { const R = rng(11); const hs = [];
  const spots = [[380, 330], [760, 280], [1160, 330], [1540, 300], [520, 600], [940, 560], [1360, 610], [300, 780], [1700, 560], [1120, 800]];
  spots.forEach((c, k) => { const pr = k < 6; hs.push({ c, pr, delay: R() * .45, q: (pr ? ['u', 'u', 'd'] : ['u', 'd', 'd']).map((f, j) => ({ f, col: j, x0: R() * W, y0: 150 + R() * 750, ph: R() * 50 })) }); });
  return hs; })();
const graphScene = {
  draw(ctx, env) {
    const t = env.t, p = env.p;
    ctx.fillStyle = '#0a0e18'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(80,120,200,.08)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const cols = ['#ff4d6d', '#3ddc84', '#4dabff'];
    const all = [];
    for (const h of HAD) {
      const g = smooth((p - h.delay) / .4);
      h.q.forEach((q, j) => {
        const wx = q.x0 + noise3(q.ph, t * 1.5) * 200, wy = q.y0 + noise3(q.ph + 9, t * 1.5) * 200;
        const a = j * 2.094 + t * 4 * (h.pr ? 1 : -1);
        q.x = lerp(wx, h.c[0] + Math.cos(a) * 40, g); q.y = lerp(wy, h.c[1] + Math.sin(a) * 40, g); q.g = g; all.push(q);
      });
      if (g > .02) {
        ctx.strokeStyle = `rgba(255,255,255,${g * .9})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(h.c[0], h.c[1], 72, 0, 7); ctx.stroke();
        for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
          const A = h.q[a], B = h.q[b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
          ctx.strokeStyle = `rgba(255,214,0,${g})`; ctx.lineWidth = 2.5; ctx.beginPath();
          for (let s = 0; s <= 20; s++) { const u = s / 20, w = Math.sin(u * 18 + t * 20) * 7;
            const x = A.x + dx * u - dy / L * w, y = A.y + dy * u + dx / L * w; s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
        }
        ctx.font = `bold 34px ${MONO}`; ctx.fillStyle = `rgba(255,255,255,${g})`; ctx.textAlign = 'center';
        ctx.fillText(h.pr ? 'p⁺' : 'n⁰', h.c[0], h.c[1] - 90); ctx.textAlign = 'left';
      }
    }
    // force-graph links between free quarks
    ctx.setLineDash([6, 8]); ctx.lineWidth = 1.5;
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
      const A = all[i], B = all[j], d = Math.hypot(A.x - B.x, A.y - B.y), f = (1 - A.g) * (1 - B.g);
      if (d < 260 && f > .05) { ctx.strokeStyle = `rgba(0,229,255,${f * (1 - d / 260) * .8})`; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
    }
    ctx.setLineDash([]);
    ctx.font = `bold 22px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const q of all) { ctx.fillStyle = cols[q.col]; ctx.beginPath(); ctx.arc(q.x, q.y, 17, 0, 7); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillText(q.f, q.x, q.y + 1); }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
};

// ---------- IDE ----------
const C = { kw: '#C586C0', dec: '#569CD6', fn: '#DCDCAA', str: '#CE9178', num: '#B5CEA8', com: '#6A9955', v: '#9CDCFE', ty: '#4EC9B0', p: '#D4D4D4' };
const CODE = [
  [['// t = 180 s · T = 10⁹ K · 宇宙变成核反应堆', C.com]],
  [['import', C.kw], [' { Proton, Neutron, fuse } ', C.p], ['from', C.kw], [" './nuclear'", C.str]],
  [],
  [['const', C.dec], [' p', C.v], [' = ', C.p], ['Proton', C.ty], ['(), ', C.p], ['n', C.v], [' = ', C.p], ['Neutron', C.ty], ['();', C.p]],
  [['let', C.dec], [' D   ', C.v], ['= ', C.p], ['fuse', C.fn], ['(p, n);      ', C.p], ['// 氘', C.com]],
  [['let', C.dec], [' He3 ', C.v], ['= ', C.p], ['fuse', C.fn], ['(D, p);', C.p]],
  [['let', C.dec], [' He4 ', C.v], ['= ', C.p], ['fuse', C.fn], ['(He3, n);    ', C.p], ['// 氦-4', C.com]],
  [],
  [['universe', C.v], ['.abundance = {', C.p]],
  [['  H', C.v], [':  ', C.p], ['0.75', C.num], [',', C.p]],
  [['  He', C.v], [': ', C.p], ['0.25', C.num], [',', C.p]],
  [['  Li', C.v], [': ', C.p], ['1e-9', C.num], [',', C.p]],
  [['};', C.p]],
];
const ideScene = {
  draw(ctx, env) {
    const p = env.p;
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
    const X = 90, Y = 140, WW = 1740, HH = 760;
    ctx.fillStyle = '#1e1e1e'; ctx.fillRect(X, Y, WW, HH);
    ctx.fillStyle = '#323233'; ctx.fillRect(X, Y, WW, 44);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 26 + i * 26, Y + 22, 8, 0, 7); ctx.fill(); });
    ctx.fillStyle = '#252526'; ctx.fillRect(X, Y + 44, 300, HH - 44);
    ctx.font = `22px ${MONO}`; ctx.fillStyle = '#ccc'; ctx.fillText('EXPLORER', X + 24, Y + 86);
    ['⌄ universe/', '   inflation.ts', '   quarks.ts', '   bbn.ts', '   cmb.ts', '   stars.ts', '   heat_death.ts'].forEach((s, i) => {
      if (i === 3) { ctx.fillStyle = '#37373d'; ctx.fillRect(X, Y + 104 + i * 38, 300, 38); }
      ctx.fillStyle = i === 3 ? '#fff' : '#aaa'; ctx.fillText(s, X + 20, Y + 130 + i * 38); });
    ctx.fillStyle = '#1e1e1e'; ctx.fillRect(X + 300, Y + 44, 190, 44);
    ctx.fillStyle = '#fff'; ctx.fillText('bbn.ts  ●', X + 322, Y + 74);
    ctx.fillStyle = '#FFD600'; ctx.fillRect(X + 300, Y + 44, 190, 3);
    // code
    const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0) + 1, 0);
    let budget = Math.floor(p * 1.1 * total);
    ctx.font = `28px ${MONO}`; const cw = ctx.measureText('0').width, lh = 44, cx = X + 400, cy = Y + 140;
    let curL = 0, curX = cx;
    CODE.forEach((line, li) => {
      const y = cy + li * lh;
      ctx.fillStyle = '#858585'; ctx.textAlign = 'right'; ctx.fillText(String(li + 1), cx - 30, y); ctx.textAlign = 'left';
      let x = cx;
      for (const [s, col] of line) {
        if (budget <= 0) break;
        const part = s.slice(0, budget); budget -= part.length;
        ctx.fillStyle = col; ctx.fillText(part, x, y); x += cw * part.length;
      }
      if (budget > 0 || (budget === 0 && li === 0)) { curL = li; curX = x; }
      budget -= 1; if (budget >= 0) { curL = li + 1; curX = cx; }
    });
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(X + 300, cy + curL * lh - 32, 1100, lh);
    if (env.f % 4 < 2 || p < 1) { ctx.fillStyle = '#AEAFAD'; ctx.fillRect(curX + 1, cy + curL * lh - 30, 3, 38); }
    // abundance panel
    const px = X + 1400, py = Y + 110;
    ctx.fillStyle = '#252526'; ctx.fillRect(px, py - 50, 300, 560);
    ctx.fillStyle = '#ddd'; ctx.font = `bold 22px ${MONO}`; ctx.fillText('ABUNDANCE', px + 24, py - 12);
    const bars = [['H', .75, '#00E5FF', 9], ['He', .25, '#FFD600', 10], ['Li', .02, '#FF3D7F', 11]];
    bars.forEach(([n, v, c, line], i) => {
      const on = curL > line ? 1 : 0; const g = on * easeOut(clamp((p - (line / 13)) * 5));
      const bh = 380 * v * g, bx = px + 30 + i * 90, by = py + 440;
      ctx.fillStyle = c; ctx.fillRect(bx, by - bh, 60, bh);
      ctx.fillStyle = '#fff'; ctx.font = `bold 24px ${MONO}`; ctx.fillText(n, bx + 10, by + 34);
      if (g > .5) { ctx.font = `18px ${MONO}`; ctx.fillText(n === 'Li' ? '1e-9' : Math.round(v * 100) + '%', bx, by - bh - 10); }
    });
    ctx.fillStyle = '#007acc'; ctx.fillRect(X, Y + HH - 30, WW, 30);
    ctx.fillStyle = '#fff'; ctx.font = `18px ${MONO}`; ctx.fillText('⎇ main   ✓ 0 errors   Ln ' + (curL + 1) + '   TypeScript   T = 10⁹ K', X + 20, Y + HH - 9);
  }
};

// ---------- pixel CMB ----------
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const PAL = ['#0b1f6b', '#1646b8', '#1f8fff', '#48d6ff', '#fff38a', '#ffb13b', '#ff6a2b', '#d01f2e'];
const pixCanvas = makeCanvas(400, 60);
const pixelScene = {
  draw(ctx, env) {
    const p = env.p, t = env.t;
    ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = 560, A = 740, B = 320, s = 24;
    for (let y = cy - B; y < cy + B; y += s) for (let x = cx - A; x < cx + A; x += s) {
      const nx = (x + s / 2 - cx) / A, ny = (y + s / 2 - cy) / B; if (nx * nx + ny * ny > 1) continue;
      const gx = Math.round(x / s), gy = Math.round(y / s);
      const th = (BAYER[(gx & 3) + (gy & 3) * 4] + .5) / 16;
      const reveal = clamp(p * 1.6 - (1 - Math.abs(nx)) * .25);
      if (th > reveal) { ctx.fillStyle = '#16121f'; ctx.fillRect(x + 2, y + 2, s - 4, s - 4); continue; }
      const v = fbm(gx * .09, gy * .09, 3, 4) * 1.6 + .5 + .08 * Math.sin(t * 6 + gx);
      ctx.fillStyle = PAL[Math.max(0, Math.min(7, Math.floor(v * 8)))]; ctx.fillRect(x, y, s, s);
    }
    // photon sprites escaping
    const R = rng(3);
    for (let i = 0; i < 40; i++) {
      const a = R() * 6.283, st = R() * 1.2 + .3, sp = 300 + R() * 400; const age = t - st; if (age < 0) continue;
      const x = cx + Math.cos(a) * (A * .95 + age * sp), y = cy + Math.sin(a) * (B * .95 + age * sp * .6);
      const q = Math.round(x / 8) * 8, w = Math.round(y / 8) * 8;
      ctx.fillStyle = '#fff'; ctx.fillRect(q, w, 16, 16); ctx.fillStyle = '#FFD600'; ctx.fillRect(q - 8, w, 8, 16); ctx.fillRect(q - 16, w + 4, 8, 8);
    }
    const pc = pixCanvas.getContext('2d'); pc.clearRect(0, 0, 400, 60);
    pc.font = `bold 16px ${MONO}`; pc.fillStyle = '#fff';
    pc.fillText(`T = ${Math.round(lerp(3000, 2.7, easeOut(p)) * 10) / 10} K   PHOTONS FREE!`, 4, 20);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(pixCanvas, 0, 0, 400, 30, 360, 140, 1200, 90); ctx.imageSmoothingEnabled = true;
  }
};

export const SCENES = { terminal: terminalScene, loop: loopScene, hexdump: hexScene, raymarch: raymarchScene,
  kinetic: kineticScene, tesseract: tesseractScene, plasma: plasmaScene, graph: graphScene, ide: ideScene, pixel: pixelScene };
