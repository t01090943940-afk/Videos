import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { mulberry32 } from '../core/math';
import type { MatKey } from '../materials/library';

// The surroundings that frame every exterior shot: ring roads with markings and street trees, then a believable
// Chinese residential district (6-storey walk-ups near, 18–33 storey towers behind), then fogged skyline + hills.
// Facade UVs are written per building (1 UV tile = 1 bay × 1 storey) so windows line up with floors.

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function facadeBox(b: Builder, key: MatKey, cx: number, cz: number, w: number, d: number, floors: number, fh = 3.0, bay = 3.3) {
  const h = floors * fh;
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.getAttribute('uv'), n = g.getAttribute('normal');
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), az = Math.abs(n.getZ(i));
    const span = ax > 0.5 ? d : az > 0.5 ? w : 0;
    if (span === 0) { uv.setXY(i, 0.05, 0.95); continue; } // roofs sample the slab band
    uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(span / bay)), uv.getY(i) * floors);
  }
  b.geo(key, g, [cx, h / 2, cz], [0, 0, 0], [1, 1, 1], true);
  // roof: parapet + water tank + stair house
  b.boxMM('roofGrey', cx - w / 2, h, cz - d / 2, cx + w / 2, h + 0.05, cz + d / 2);
  b.boxMM('concreteOld', cx - w / 2, h, cz - d / 2, cx + w / 2, h + 1.1, cz - d / 2 + 0.2);
  b.boxMM('concreteOld', cx - w / 2, h, cz + d / 2 - 0.2, cx + w / 2, h + 1.1, cz + d / 2);
  b.boxMM('concreteOld', cx - w * 0.15, h, cz - d * 0.2, cx + w * 0.15, h + 3.0, cz + d * 0.2);
}

export function buildCity(b: Builder) {
  const r = mulberry32(99);
  const road = L.roadW, walk = 4;
  const ox0 = L.sx0 - walk, ox1 = L.sx1 + walk, oz0 = L.sz0 - walk, oz1 = L.sz1 + walk; // outer edge of pavements next to hoarding

  // ---------------- base ground to the horizon
  b.boxMM('grass', -1600, -0.35, -1600, 1600, -0.25, 1600);

  // pavements around the hoarding
  b.boxMM('paving', ox0, -0.2, oz1 - walk, ox1, 0.12, oz1);
  b.boxMM('paving', ox0, -0.2, oz0, ox1, 0.12, oz0 + walk);
  b.boxMM('paving', ox0, -0.2, oz0, ox0 + walk, 0.12, oz1);
  b.boxMM('paving', ox1 - walk, -0.2, oz0, ox1, 0.12, oz1);

  // ring roads (long straight roads extending to the fog so the edge of the world never shows)
  const R = 900;
  const roads: [number, number, number, number][] = [
    [-R, oz1, R, oz1 + road], [-R, oz0 - road, R, oz0],
    [ox0 - road, -R, ox0, R], [ox1, -R, ox1 + road, R],
  ];
  for (const [x0, z0, x1, z1] of roads) b.boxMM('asphalt', x0, -0.25, z0, x1, 0.0, z1);
  // kerbs + far pavements
  b.boxMM('kerb', -R, -0.2, oz1 + road, R, 0.15, oz1 + road + 0.2).boxMM('paving', -R, -0.2, oz1 + road + 0.2, R, 0.13, oz1 + road + walk);
  b.boxMM('kerb', -R, -0.2, oz0 - road - 0.2, R, 0.15, oz0 - road).boxMM('paving', -R, -0.2, oz0 - road - walk, R, 0.13, oz0 - road - 0.2);
  b.boxMM('kerb', ox0 - road - 0.2, -0.2, -R, ox0 - road, 0.15, R).boxMM('paving', ox0 - road - walk, -0.2, -R, ox0 - road - 0.2, 0.13, R);
  b.boxMM('kerb', ox1 + road, -0.2, -R, ox1 + road + 0.2, 0.15, R).boxMM('paving', ox1 + road + 0.2, -0.2, -R, ox1 + road + walk, 0.13, R);
  // lane markings: dashed white lanes, double yellow centre
  const dash = (a: THREE.Vector3, c: THREE.Vector3, key: MatKey, w = 0.15, dl = 4, gl = 6) => {
    const len = a.distanceTo(c), dir = c.clone().sub(a).normalize();
    for (let s = 0; s < len; s += dl + gl) {
      const p = a.clone().addScaledVector(dir, s), q = a.clone().addScaledVector(dir, Math.min(len, s + dl));
      const m = p.clone().add(q).multiplyScalar(0.5);
      b.box(key, m.x, 0.005, m.z, Math.abs(dir.x) * (dl) + w * Math.abs(dir.z), 0.01, Math.abs(dir.z) * dl + w * Math.abs(dir.x));
    }
  };
  const zc1 = oz1 + road / 2, zc0 = oz0 - road / 2, xc0 = ox0 - road / 2, xc1 = ox1 + road / 2;
  for (const zc of [zc1, zc0]) {
    b.boxMM('lineYellow', -R, 0.0, zc - 0.2, R, 0.01, zc - 0.08).boxMM('lineYellow', -R, 0.0, zc + 0.08, R, 0.01, zc + 0.2);
    dash(V(-R, 0, zc - road / 4), V(R, 0, zc - road / 4), 'lineWhite');
    dash(V(-R, 0, zc + road / 4), V(R, 0, zc + road / 4), 'lineWhite');
  }
  for (const xc of [xc0, xc1]) {
    b.boxMM('lineYellow', xc - 0.2, 0.0, -R, xc - 0.08, 0.01, R).boxMM('lineYellow', xc + 0.08, 0.0, -R, xc + 0.2, 0.01, R);
    dash(V(xc - road / 4, 0, -R), V(xc - road / 4, 0, R), 'lineWhite');
    dash(V(xc + road / 4, 0, -R), V(xc + road / 4, 0, R), 'lineWhite');
  }
  // zebra crossing at the gate
  for (let i = 0; i < 10; i++) b.boxMM('lineWhite', -27 + i * 0.8, 0.0, oz1 + 0.5, -26.5 + i * 0.8, 0.012, oz1 + road - 0.5);

  // ---------------- street trees + lamps along all four sides of the site
  const tree = (x: number, z: number, s: number) => {
    b.tube('bark', V(x, 0, z), V(x, 2.2 * s, z), 0.12 * s, 6);
    const k = r() < 0.5 ? 'treeLeaf' : 'treeLeaf2';
    for (let i = 0; i < 4; i++) {
      const g = new THREE.IcosahedronGeometry(1.3 * s * (0.8 + r() * 0.4), 0);
      b.geo(k, g, [x + (r() - 0.5) * 1.4 * s, (3.2 + r() * 1.4) * s, z + (r() - 0.5) * 1.4 * s], [r(), r(), r()]);
    }
    b.boxMM('concreteOld', x - 0.6, 0.12, z - 0.6, x + 0.6, 0.18, z + 0.6);
  };
  const lamp = (x: number, z: number, dirx: number, dirz: number) => {
    b.tube('galv', V(x, 0, z), V(x, 8, z), 0.08, 8).tube('galv', V(x, 8, z), V(x + dirx * 1.6, 8.3, z + dirz * 1.6), 0.05, 6);
    b.box('lamp', x + dirx * 1.7, 8.2, z + dirz * 1.7, 0.7, 0.12, 0.35);
  };
  for (let x = -R * 0.35; x < R * 0.35; x += 8) {
    if (x > -30 && x < -16) continue;
    tree(x, oz1 + road + 2, 0.9 + r() * 0.3); tree(x + 4, oz0 - road - 2, 0.9 + r() * 0.3);
    if (Math.round(x / 8) % 3 === 0) { lamp(x + 2, oz1 + road + 0.8, 0, -1); lamp(x + 2, oz0 - road - 0.8, 0, 1); }
  }
  for (let z = -R * 0.35; z < R * 0.35; z += 8) {
    tree(ox0 - road - 2, z, 0.9 + r() * 0.3); tree(ox1 + road + 2, z + 4, 0.9 + r() * 0.3);
    if (Math.round(z / 8) % 3 === 0) { lamp(ox0 - road - 0.8, z + 2, 1, 0); lamp(ox1 + road + 0.8, z + 2, -1, 0); }
  }
  // parked / queued cars on the far kerbs
  const carKeys: MatKey[] = ['containerWhite', 'blackMatte', 'galv', 'redPaint', 'containerBlue', 'containerWhite'];
  const car = (x: number, z: number, yaw: number) => {
    const k = carKeys[Math.floor(r() * carKeys.length)];
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const P = (lx: number, lz: number) => [x + lx * c + lz * s, z - lx * s + lz * c];
    let p = P(0, 0); b.box(k, p[0], 0.62, p[1], 4.5, 0.7, 1.8, yaw);
    p = P(-0.2, 0); b.box('glass', p[0], 1.2, p[1], 2.4, 0.55, 1.62, yaw);
    for (const lx of [-1.45, 1.45]) for (const lz of [-0.8, 0.8]) { p = P(lx, lz); const w = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 12); w.rotateX(Math.PI / 2); b.geo('rubber', w, [p[0], 0.33, p[1]], [0, yaw, 0]); }
  };
  for (let x = -200; x < 200; x += 5.5 + r() * 9) if (Math.abs(x + 23) > 10) car(x, oz1 + road - 1.6, 0);
  for (let x = -200; x < 200; x += 5.5 + r() * 12) car(x, oz0 - road + 1.6, Math.PI);
  for (let z = -150; z < 150; z += 6 + r() * 12) { car(ox1 + road - 1.6, z, -Math.PI / 2); car(ox0 - road + 1.6, z, Math.PI / 2); }

  // ---------------- residential blocks
  const keys: MatKey[] = ['facadeA', 'facadeB', 'facadeC', 'facadeD'];
  const occupied: [number, number, number, number][] = [[ox0 - road - walk - 2, oz0 - road - walk - 2, ox1 + road + walk + 2, oz1 + road + walk + 2]];
  const free = (x0: number, z0: number, x1: number, z1: number) => !occupied.some(o => x1 > o[0] && x0 < o[2] && z1 > o[1] && z0 < o[3]);
  let tries = 0;
  while (tries++ < 2600) {
    const ang = r() * Math.PI * 2, dist = 30 + Math.pow(r(), 0.8) * 520;
    const cx = Math.cos(ang) * dist + (r() - 0.5) * 20, cz = Math.sin(ang) * dist;
    const tall = dist > 110 && r() < 0.55;
    const floors = tall ? 18 + Math.floor(r() * 16) : 5 + Math.floor(r() * 3);
    const w = tall ? 16 + r() * 18 : 30 + r() * 30, d = tall ? 14 + r() * 6 : 11 + r() * 3;
    const rot = r() < 0.5;
    const W = rot ? d : w, D = rot ? w : d;
    const pad = tall ? 16 : 10;
    if (!free(cx - W / 2 - pad, cz - D / 2 - pad, cx + W / 2 + pad, cz + D / 2 + pad)) continue;
    occupied.push([cx - W / 2 - pad / 2, cz - D / 2 - pad / 2, cx + W / 2 + pad / 2, cz + D / 2 + pad / 2]);
    facadeBox(b, keys[Math.floor(r() * keys.length)], cx, cz, W, D, floors);
    // ground-floor paving pad + a couple of trees for the yard
    b.boxMM('paving', cx - W / 2 - 3, -0.25, cz - D / 2 - 3, cx + W / 2 + 3, 0.02, cz + D / 2 + 3);
    if (dist < 260) for (let i = 0; i < 3; i++) tree(cx + (r() - 0.5) * (W + 10), cz + (rot ? 1 : -1) * (D / 2 + 5), 0.8 + r() * 0.4);
  }

  // ---------------- far skyline + hills (fog does the rest)
  for (let i = 0; i < 90; i++) {
    const ang = (i / 90) * Math.PI * 2 + r() * 0.05, dist = 700 + r() * 350;
    const h = 30 + r() * 90, w = 20 + r() * 40;
    b.box('concreteOld', Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist, w, h, w * 0.7, ang);
  }
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2 + r(), dist = 1300 + r() * 200;
    const g = new THREE.SphereGeometry(1, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    b.geo('treeLeaf2', g, [Math.cos(ang) * dist, -10, Math.sin(ang) * dist], [0, 0, 0], [260 + r() * 200, 90 + r() * 120, 200 + r() * 100]);
  }
}
