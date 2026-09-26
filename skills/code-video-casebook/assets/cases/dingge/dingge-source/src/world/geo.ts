import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { materials, type MatKey } from '../materials/library';

// Static-geometry batcher. Every static piece of the site is pushed here, transformed into world space,
// given world-space box-projected UVs (so textures keep real-world scale), then merged per material.
// Result: thousands of tubes / bars / panels → a few dozen draw calls, which is what keeps the sandbox at 60fps.

export interface AABB { min: THREE.Vector3; max: THREE.Vector3; tag: string }

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const cylCache = new Map<number, THREE.CylinderGeometry>();
function unitCyl(seg: number) {
  if (!cylCache.has(seg)) cylCache.set(seg, new THREE.CylinderGeometry(1, 1, 1, seg, 1, false));
  return cylCache.get(seg)!;
}

export function worldUV(g: THREE.BufferGeometry, scale: number) {
  const p = g.getAttribute('position'), n = g.getAttribute('normal');
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u: number, v: number;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else if (ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / scale; uv[i * 2 + 1] = v / scale;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

export class Builder {
  private parts = new Map<MatKey, THREE.BufferGeometry[]>();
  colliders: AABB[] = [];
  noShadow = new Set<MatKey>(['greenMesh', 'flatNet', 'lineWhite', 'lineYellow', 'dirt', 'asphalt', 'grass', 'paving', 'kerb', 'rebarDeck']);

  add(key: MatKey, geo: THREE.BufferGeometry, matrix?: THREE.Matrix4, keepUV = false) {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (matrix) g.applyMatrix4(matrix);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!keepUV || !g.getAttribute('uv')) worldUV(g, materials()[key].uvScale);
    if (!this.parts.has(key)) this.parts.set(key, []);
    this.parts.get(key)!.push(g);
    return this;
  }

  /** Axis-aligned box by centre & size, optional yaw. */
  box(key: MatKey, cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw = 0, collide?: string) {
    _q.setFromAxisAngle(UP, yaw);
    _m.compose(_v.set(cx, cy, cz), _q, _s.set(sx, sy, sz));
    this.add(key, unitBox, _m);
    if (collide && yaw === 0) this.colliders.push({ min: new THREE.Vector3(cx - sx / 2, cy - sy / 2, cz - sz / 2), max: new THREE.Vector3(cx + sx / 2, cy + sy / 2, cz + sz / 2), tag: collide });
    return this;
  }
  boxMM(key: MatKey, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, collide?: string) {
    return this.box(key, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), 0, collide);
  }
  /** Cylinder between two points. */
  tube(key: MatKey, a: THREE.Vector3 | number[], b: THREE.Vector3 | number[], r: number, seg = 6, collide?: string) {
    const A = Array.isArray(a) ? new THREE.Vector3(a[0], a[1], a[2]) : a;
    const B = Array.isArray(b) ? new THREE.Vector3(b[0], b[1], b[2]) : b;
    const d = _v.subVectors(B, A); const len = d.length(); if (len < 1e-4) return this;
    _q.setFromUnitVectors(UP, d.normalize());
    const mid = A.clone().add(B).multiplyScalar(0.5);
    _m.compose(mid, _q, _s.set(r, len, r));
    this.add(key, unitCyl(seg), _m);
    if (collide) {
      this.colliders.push({ min: new THREE.Vector3(Math.min(A.x, B.x) - r, Math.min(A.y, B.y) - r, Math.min(A.z, B.z) - r), max: new THREE.Vector3(Math.max(A.x, B.x) + r, Math.max(A.y, B.y) + r, Math.max(A.z, B.z) + r), tag: collide });
    }
    return this;
  }
  geo(key: MatKey, g: THREE.BufferGeometry, pos: number[], rot: number[] = [0, 0, 0], scl: number[] = [1, 1, 1], keepUV = false) {
    _q.setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2]));
    _m.compose(_v.set(pos[0], pos[1], pos[2]), _q, _s.set(scl[0], scl[1], scl[2]));
    return this.add(key, g, _m, keepUV);
  }

  build(name = 'static'): THREE.Group {
    const grp = new THREE.Group(); grp.name = name;
    const L = materials();
    for (const [key, list] of this.parts) {
      // merge in chunks to keep individual buffers reasonable
      for (let i = 0; i < list.length; i += 4000) {
        const merged = mergeGeometries(list.slice(i, i + 4000), false);
        if (!merged) continue;
        merged.computeBoundingSphere();
        const mesh = new THREE.Mesh(merged, L[key].mat);
        mesh.name = `${name}:${key}`;
        mesh.castShadow = !this.noShadow.has(key);
        mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false;
        grp.add(mesh);
      }
    }
    this.parts.clear();
    return grp;
  }
}
