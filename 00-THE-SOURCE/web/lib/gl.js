// ─────────────────────────────────────────────────────────────────────────────
//  gl.js · WebGL2 最小封装：着色器、纹理、离屏缓冲池、全屏三角形
// ─────────────────────────────────────────────────────────────────────────────
export function createGL(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('no webgl2');
  const hdr = !!gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  return { gl, hdr };
}

export function program(gl, vs, fs, name = '?') {
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      const lines = src.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n');
      throw new Error(`[${name}] shader: ${log}\n${lines}`);
    }
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`[${name}] link: ${gl.getProgramInfoLog(p)}`);
  const loc = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const u = gl.getActiveUniform(p, i);
    loc[u.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, u.name);
  }
  const types = {};
  for (let i = 0; i < n; i++) { const u = gl.getActiveUniform(p, i); types[u.name.replace(/\[0\]$/, '')] = u; }
  return { p, loc, types, name };
}

// 统一 uniform 设置：数字 / 数组 / 纹理（{tex, unit}）
export function setUniforms(gl, prog, u) {
  let unit = 0;
  for (const k in u) {
    const l = prog.loc[k];
    if (l === undefined || l === null) continue;
    const v = u[k];
    const ty = prog.types[k].type;
    if (ty === gl.SAMPLER_2D) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, v && v.tex ? v.tex : v);
      gl.uniform1i(l, unit++);
    } else if (ty === gl.FLOAT) gl.uniform1f(l, v);
    else if (ty === gl.INT || ty === gl.BOOL) gl.uniform1i(l, v | 0);
    else if (ty === gl.FLOAT_VEC2) gl.uniform2fv(l, v);
    else if (ty === gl.FLOAT_VEC3) gl.uniform3fv(l, v);
    else if (ty === gl.FLOAT_VEC4) gl.uniform4fv(l, v);
    else if (ty === gl.FLOAT_MAT4) gl.uniformMatrix4fv(l, false, v);
    else if (ty === gl.FLOAT_VEC2 + 1000) gl.uniform2fv(l, v);
    else throw new Error('uniform type ' + k);
  }
}

export function texture(gl, src, { mip = false, wrap = 'clamp', filter = 'linear', flip = true, premul = false } = {}) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premul);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  const W = wrap === 'repeat' ? gl.REPEAT : wrap === 'mirror' ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, W);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, W);
  const F = filter === 'nearest' ? gl.NEAREST : gl.LINEAR;
  if (mip) {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, F);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, F);
  return { tex: t, w: src.width, h: src.height };
}

export function solidTexture(gl, rgba = [255, 255, 255, 255]) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return { tex: t, w: 1, h: 1 };
}

// 离屏缓冲（HDR 优先）
export function fbo(gl, w, h, hdr) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  if (hdr) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error('fbo incomplete ' + st);
  return { fb, tex, w, h };
}

// 缓冲池：按尺寸借还，避免每帧分配
export class Pool {
  constructor(gl, hdr) { this.gl = gl; this.hdr = hdr; this.free = new Map(); this.used = []; }
  get(w, h) {
    const k = `${w}x${h}`;
    const list = this.free.get(k) || [];
    const f = list.pop() || fbo(this.gl, w, h, this.hdr);
    f.key = k;
    this.used.push(f);
    return f;
  }
  release(f) {
    const i = this.used.indexOf(f);
    if (i >= 0) this.used.splice(i, 1);
    if (!this.free.has(f.key)) this.free.set(f.key, []);
    this.free.get(f.key).push(f);
  }
  releaseAll() { for (const f of [...this.used]) this.release(f); }
}
