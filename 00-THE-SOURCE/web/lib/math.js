// ─────────────────────────────────────────────────────────────────────────────
//  math.js · 矩阵 / 缓动 / 确定性随机
//  全片没有一次 Math.random()：所有"随机"都是坐标的哈希，同一 t 永远同一帧。
// ─────────────────────────────────────────────────────────────────────────────
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (x, a, b) => clamp((x - a) / (b - a));
export const smooth = (t) => (t = clamp(t), t * t * (3 - 2 * t));
export const smoother = (t) => (t = clamp(t), t * t * t * (t * (t * 6 - 15) + 10));

export const E = {
  lin: (t) => clamp(t),
  in2: (t) => (t = clamp(t), t * t),
  out2: (t) => (t = clamp(t), 1 - (1 - t) * (1 - t)),
  out3: (t) => (t = clamp(t), 1 - (1 - t) ** 3),
  in3: (t) => (t = clamp(t), t * t * t),
  io2: (t) => (t = clamp(t), t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  io3: (t) => (t = clamp(t), t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outExpo: (t) => (t = clamp(t), t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  inExpo: (t) => (t = clamp(t), t <= 0 ? 0 : 2 ** (10 * t - 10)),
  ioExpo: (t) => (t = clamp(t), t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2),
  outBack: (t, s = 1.7) => (t = clamp(t), 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2),
  outElastic: (t) => {
    t = clamp(t);
    if (t === 0 || t === 1) return t;
    return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};

// 整数哈希 → [0,1)
export function hash(...n) {
  let h = 2166136261 >>> 0;
  for (const v of n) {
    let x = Math.floor(v * 1000003) | 0;
    h ^= x;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
}
export const hs = (...n) => hash(...n) * 2 - 1;

// 平滑值噪声（1D），用于镜头手持感
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i;
  const a = hs(i, seed), b = hs(i + 1, seed);
  return lerp(a, b, f * f * (3 - 2 * f));
}

// 冲击包络：t 秒前发生的一次 hit，指数衰减
export const hit = (t, at, decay = 0.25) => (t < at ? 0 : Math.exp(-(t - at) / decay));

// ── mat4（列主序，与 GLSL 一致）──────────────────────────────────────────
export const M4 = {
  ident: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++)
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    return o;
  },
  persp(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  },
  ortho(l, r, b, t, n, f) {
    return new Float32Array([2 / (r - l), 0, 0, 0, 0, 2 / (t - b), 0, 0, 0, 0, -2 / (f - n), 0,
      -(r + l) / (r - l), -(t + b) / (t - b), -(f + n) / (f - n), 1]);
  },
  lookAt(eye, at, up = [0, 1, 0]) {
    let zx = eye[0] - at[0], zy = eye[1] - at[1], zz = eye[2] - at[2];
    let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx;
    l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]), -(yx * eye[0] + yy * eye[1] + yz * eye[2]), -(zx * eye[0] + zy * eye[1] + zz * eye[2]), 1]);
  },
  // T · Rz · Ry · Rx · S
  trs(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const cx = Math.cos(rx), sxn = Math.sin(rx), cy = Math.cos(ry), syn = Math.sin(ry), cz = Math.cos(rz), szn = Math.sin(rz);
    // R = Rz*Ry*Rx
    const r00 = cz * cy, r01 = cz * syn * sxn - szn * cx, r02 = cz * syn * cx + szn * sxn;
    const r10 = szn * cy, r11 = szn * syn * sxn + cz * cx, r12 = szn * syn * cx - cz * sxn;
    const r20 = -syn, r21 = cy * sxn, r22 = cy * cx;
    return new Float32Array([r00 * sx, r10 * sx, r20 * sx, 0, r01 * sy, r11 * sy, r21 * sy, 0, r02 * sz, r12 * sz, r22 * sz, 0, x, y, z, 1]);
  },
};
