// Final-pass WebGL shader: chromatic aberration, zoom/directional blur, glitch slices,
// inversion, mirror, scanlines, vignette, film grain, flash.
const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; v.y = 1.0-v.y; gl_Position = vec4(p,0.,1.); }`;
const FS = `
precision highp float;
varying vec2 v;
uniform sampler2D tex;
uniform vec2 res;
uniform float time, invert, ca, grain, vig, glitch, flash, zoomBlur, scan, mirror, warm, bloom;
uniform vec2 dirBlur;
uniform vec3 flashColor;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
vec3 samp(vec2 u, float k){
  vec2 d = (u-0.5)*k;
  return vec3(texture2D(tex, u+d).r, texture2D(tex, u).g, texture2D(tex, u-d).b);
}
void main(){
  vec2 uv = v;
  if (mirror > 0.5 && uv.x > 0.5) uv.x = 1.0 - uv.x;
  if (mirror > 1.5 && uv.y > 0.5) uv.y = 1.0 - uv.y;
  float fr = floor(time*24.0);
  if (glitch > 0.0) {
    float row = floor(uv.y * 28.0);
    float r = h(vec2(row, fr));
    if (r < glitch*0.6) uv.x += (h(vec2(row*1.7, fr+3.0))-0.5) * 0.18 * glitch;
    float blk = h(vec2(floor(uv.y*9.0), floor(uv.x*6.0)+fr));
    if (blk < glitch*0.12) uv = uv + vec2(0.03, 0.0)*glitch;
  }
  vec3 col = vec3(0.0);
  float cak = ca + glitch*0.012;
  if (zoomBlur > 0.0005 || length(dirBlur) > 0.0005) {
    for (int i = 0; i < 14; i++) {
      float k = float(i)/13.0;
      vec2 u = uv - (uv-0.5)*zoomBlur*k - dirBlur*(k-0.5);
      col += samp(u, cak);
    }
    col /= 14.0;
  } else {
    col = samp(uv, cak);
  }
  if (bloom > 0.0) {
    vec3 b = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float a = float(i)*0.785398;
      vec2 o = vec2(cos(a), sin(a)) * 0.006;
      b += max(texture2D(tex, uv+o).rgb - 0.55, 0.0);
      b += max(texture2D(tex, uv+o*2.2).rgb - 0.55, 0.0);
    }
    col += b/16.0 * bloom * 2.2;
  }
  col = mix(col, 1.0-col, invert);
  if (scan > 0.0) col *= 1.0 - scan*0.18*(0.5+0.5*sin(gl_FragCoord.y*3.14159*0.5));
  vec2 q = v - 0.5;
  col *= 1.0 - vig * dot(q,q) * 1.35;
  col = mix(col, col*vec3(1.04,1.0,0.94), warm);
  float g = h(gl_FragCoord.xy + fract(time*7.13)*vec2(391.0, 173.0)) - 0.5;
  col += g * grain;
  col = mix(col, flashColor, flash);
  gl_FragColor = vec4(col, 1.0);
}`;

export function createPost(canvas) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const U = {};
  ['tex', 'res', 'time', 'invert', 'ca', 'grain', 'vig', 'glitch', 'flash', 'zoomBlur', 'scan', 'mirror', 'warm', 'bloom', 'dirBlur', 'flashColor']
    .forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
  return (src, P) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.uniform1i(U.tex, 0);
    gl.uniform2f(U.res, canvas.width, canvas.height);
    for (const k of ['time', 'invert', 'ca', 'grain', 'vig', 'glitch', 'flash', 'zoomBlur', 'scan', 'mirror', 'warm', 'bloom'])
      gl.uniform1f(U[k], P[k] || 0);
    gl.uniform2f(U.dirBlur, ...(P.dirBlur || [0, 0]));
    gl.uniform3f(U.flashColor, ...(P.flashColor || [1, 1, 1]));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
