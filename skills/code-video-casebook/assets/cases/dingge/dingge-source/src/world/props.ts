import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { mulberry32 } from '../core/math';
import { signPanel } from '../materials/textures';
import { materials, type MatKey } from '../materials/library';

// Everything on the site that is not the building or the crane: ground, roads inside the hoarding,
// hoarding + gate + 五牌一图, container offices, rebar shed, material yard, covered spoil heaps, mixer truck,
// small props on the 6F deck. All static geometry goes through the Builder (merged per material).

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export interface PropParts { offcut: THREE.Mesh; signs: THREE.Group }

export function buildProps(b: Builder, root: THREE.Group): PropParts {
  const r = mulberry32(7);
  const { sx0, sx1, sz0, sz1 } = L;

  // ---------------- ground inside the site: compacted soil + hardened concrete haul road (文明施工要求道路硬化)
  b.boxMM('dirt', sx0, -0.2, sz0, sx1, 0, sz1);
  b.boxMM('concreteOld', -27, 0, 9, -19, 0.06, sz1);          // gate road
  b.boxMM('concreteOld', -27, 0, 9, 38, 0.06, 15);            // road along the south of the building
  b.boxMM('concreteOld', -27, 0, -40, -21, 0.06, 9);          // to the yard
  b.boxMM('concreteOld', -21, 0, -26, 38, 0.06, -20);         // north road under the crane
  // wheel-wash bay at the gate: grating + gutters
  b.boxMM('steelDark', -26, 0.06, 19, -20, 0.1, 23);
  for (let x = -26; x <= -20; x += 0.25) b.boxMM('galv', x, 0.1, 19, x + 0.05, 0.12, 23);

  // ---------------- hoarding (2.5m steel panels) with a gap for the gate at x ∈ [-27,-19]
  const H = L.hoardH;
  const hoardRun = (a: THREE.Vector3, c: THREE.Vector3, outward: THREE.Vector3) => {
    const len = a.distanceTo(c), dir = c.clone().sub(a).normalize();
    for (let s = 0; s < len; s += 2) {
      const p = a.clone().addScaledVector(dir, s);
      b.tube('galv', p, p.clone().setY(H + 0.1), 0.04, 6);
      const back = p.clone().addScaledVector(outward, -0.6);
      b.tube('galv', p.clone().setY(H * 0.7), back.setY(0), 0.025, 5);
    }
    const e = c.clone().add(a).multiplyScalar(0.5);
    const yaw = Math.atan2(-dir.z, dir.x);
    b.box('hoardingBlue', e.x + outward.x * 0.03, H / 2 + 0.05, e.z + outward.z * 0.03, len, H - 0.3, 0.04, yaw);
    b.box('containerWhite', e.x + outward.x * 0.035, H - 0.1, e.z + outward.z * 0.035, len, 0.2, 0.05, yaw);
    b.box('containerWhite', e.x + outward.x * 0.035, 0.12, e.z + outward.z * 0.035, len, 0.24, 0.05, yaw);
  };
  hoardRun(V(sx0, 0, sz1), V(-27, 0, sz1), V(0, 0, 1));
  hoardRun(V(-19, 0, sz1), V(sx1, 0, sz1), V(0, 0, 1));
  hoardRun(V(sx1, 0, sz1), V(sx1, 0, sz0), V(1, 0, 0));
  hoardRun(V(sx1, 0, sz0), V(sx0, 0, sz0), V(0, 0, -1));
  hoardRun(V(sx0, 0, sz0), V(sx0, 0, sz1), V(-1, 0, 0));

  // gate portal
  b.boxMM('containerWhite', -27.8, 0, sz1 - 0.4, -27, 5.2, sz1 + 0.4);
  b.boxMM('containerWhite', -19, 0, sz1 - 0.4, -18.2, 5.2, sz1 + 0.4);
  b.boxMM('hoardingBlue', -27.8, 5.2, sz1 - 0.4, -18.2, 6.4, sz1 + 0.4);
  // sliding gate leaves (open)
  for (let x = -18; x < -10; x += 0.2) b.tube('galv', V(x, 0.1, sz1 + 0.2), V(x, 2.2, sz1 + 0.2), 0.012, 4);
  b.tube('galv', V(-18, 2.2, sz1 + 0.2), V(-10, 2.2, sz1 + 0.2), 0.03).tube('galv', V(-18, 0.15, sz1 + 0.2), V(-10, 0.15, sz1 + 0.2), 0.03);
  // guard hut
  b.boxMM('containerWhite', -31, 0, 22, -28.2, 2.8, 25.2).boxMM('glass', -28.19, 1.0, 22.3, -28.18, 2.3, 24.9).boxMM('roofBlue', -31.2, 2.8, 21.8, -28, 3.0, 25.4);

  // ---------------- text boards (canvas textures, not merged)
  const signs = new THREE.Group(); signs.name = 'signs';
  root.add(signs);
  const sign = (tex: THREE.Texture, w: number, h: number, pos: number[], yaw: number, double = false) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, side: double ? THREE.DoubleSide : THREE.FrontSide }));
    m.position.set(pos[0], pos[1], pos[2]); m.rotation.y = yaw; m.castShadow = true; m.receiveShadow = true; signs.add(m); return m;
  };
  const slogan = (t: string, sub: string) => signPanel({ w: 1024, h: 256, bg: '#1d4f91', lines: [{ text: t, color: '#ffffff', size: 118, y: 108 }, { text: sub, color: '#ffd23f', size: 44, weight: 700, y: 212 }] });
  const slogans: [string, string][] = [['安全第一 预防为主', 'SAFETY FIRST · PREVENTION FIRST'], ['进入施工现场 必须戴好安全帽', '安全帽 · 系好下颏带'], ['高处作业 必须系挂安全带', '优先挂在上方牢固挂点'], ['临边洞口 防护齐全', '严禁私自拆除防护设施'], ['文明施工 绿色建造', '绿色 · 低碳 · 标准化工地']];
  for (let i = 0; i < 12; i++) {
    const x = -12 + i * 4.4; if (x > 40) break;
    sign(slogan(...slogans[i % slogans.length]), 4.2, 1.05, [x, 1.3, sz1 + 0.06], 0);
  }
  for (let i = 0; i < 12; i++) { const z = -36 + i * 5; sign(slogan(...slogans[(i + 2) % slogans.length]), 4.8, 1.2, [sx1 + 0.06, 1.3, z], Math.PI / 2); }
  sign(signPanel({ w: 1024, h: 128, bg: '#1d4f91', lines: [{ text: '安全文明施工标准化工地', color: '#ffffff', size: 84, y: 66 }] }), 9.4, 1.1, [-23, 5.8, sz1 + 0.41], 0);
  // 五牌一图 just inside the gate
  const boards = ['工程概况牌', '管理人员名单及监督电话牌', '消防保卫牌', '安全生产牌', '文明施工和环境保护牌', '施工现场总平面图'];
  boards.forEach((t, i) => {
    const x = -34.5 + i * 1.3;
    const tex = signPanel({ w: 256, h: 360, bg: '#f4f6f8', border: '#1d4f91', lines: [{ text: t.length > 6 ? t.slice(0, 6) : t, color: '#1d4f91', size: 26, y: 40 }, ...(t.length > 6 ? [{ text: t.slice(6), color: '#1d4f91', size: 26, y: 72 }] : []), ...Array.from({ length: 8 }, (_, k) => ({ text: '————————', color: '#9aa6b4', size: 18, weight: 400, y: 120 + k * 26 }))] });
    sign(tex, 1.15, 1.6, [x, 1.6, 17.6], 0);
    b.tube('galv', V(x - 0.5, 0, 17.55), V(x - 0.5, 2.5, 17.55), 0.03).tube('galv', V(x + 0.5, 0, 17.55), V(x + 0.5, 2.5, 17.55), 0.03);
  });
  b.boxMM('roofBlue', -35.3, 2.5, 17.2, -27, 2.6, 18.0);
  // gate PPE warning sign (禁止/必须戴安全帽)
  sign(signPanel({ w: 512, h: 640, bg: '#ffffff', border: '#1565c0', lines: [{ text: '必须戴安全帽', color: '#1565c0', size: 64, y: 560 }, { text: '⛑', color: '#1565c0', size: 300, weight: 400, y: 260 }] }), 0.8, 1.0, [-19.6, 1.6, sz1 - 0.42], Math.PI);

  // ---------------- container offices (2 storeys, 8 units per floor) along the west hoarding
  for (let f = 0; f < 2; f++) for (let i = 0; i < 8; i++) {
    const z = -8 + i * 3.05, y = f * 2.95;
    b.boxMM('containerWhite', -40.5, y, z, -34.5, y + 2.9, z + 3.0);
    b.boxMM('containerBlue', -40.55, y + 2.72, z - 0.02, -34.45, y + 2.9, z + 3.02);
    b.boxMM('containerBlue', -40.55, y, z - 0.02, -34.45, y + 0.18, z + 3.02);
    b.boxMM('glass', -34.49, y + 1.0, z + 0.4, -34.48, y + 2.2, z + 1.5);
    b.boxMM('containerBlue', -34.49, y + 0.2, z + 1.9, -34.47, y + 2.2, z + 2.7); // door
  }
  // corridor + rail + stairs
  b.boxMM('galv', -34.5, 2.9, -8, -33.2, 3.0, 16.4);
  for (let z = -8; z <= 16.4; z += 1.5) b.tube('galv', V(-33.25, 3.0, z), V(-33.25, 4.1, z), 0.02);
  b.tube('galv', V(-33.25, 4.1, -8), V(-33.25, 4.1, 16.4), 0.025);
  for (let s = 0; s < 16; s++) b.boxMM('galv', -34.4, s * 0.185, 16.4 + s * 0.25, -33.3, s * 0.185 + 0.03, 16.4 + s * 0.25 + 0.25);

  // ---------------- rebar processing shed (north-west) + stock
  const shed = { x0: -40, x1: -26, z0: -38, z1: -28 };
  for (let x = shed.x0; x <= shed.x1; x += 3.5) for (const z of [shed.z0, shed.z1]) b.box('craneYellow' as MatKey, x, 2.5, z, 0.2, 5, 0.2);
  b.boxMM('roofBlue', shed.x0 - 0.5, 5.0, shed.z0 - 0.5, shed.x1 + 0.5, 5.15, shed.z1 + 0.5);
  b.boxMM('containerWhite', shed.x0 - 0.5, 4.7, shed.z0 - 0.52, shed.x1 + 0.5, 5.0, shed.z0 - 0.48);
  // benches, bending machines
  for (let i = 0; i < 3; i++) { const x = shed.x0 + 2 + i * 4; b.boxMM('containerBlue', x, 0, -34, x + 1.0, 0.8, -33.2).boxMM('steelDark', x + 0.2, 0.8, -33.9, x + 0.8, 0.86, -33.3); }
  // rebar stock racks: bundles of 9m bars on sleepers
  for (let k = 0; k < 6; k++) {
    const z = -26 + k * 0.9;
    for (const x of [-38, -33, -28]) b.boxMM('timber', x, 0, z - 0.4, x + 0.15, 0.15, z + 0.4);
    for (let n = 0; n < 20; n++) b.tube('rebar', V(-38.5, 0.18 + Math.floor(n / 7) * 0.04, z - 0.18 + (n % 7) * 0.05), V(-27.5, 0.18 + Math.floor(n / 7) * 0.04, z - 0.18 + (n % 7) * 0.05), 0.014, 5);
  }
  // timber (木方) & plywood stacks, steel pipe stack
  for (let s = 0; s < 3; s++) {
    const x = -22 + s * 5;
    for (let l = 0; l < 8; l++) for (let n = 0; n < 8; n++) b.boxMM('timber', x + n * 0.13, l * 0.1, -37, x + n * 0.13 + 0.05, l * 0.1 + 0.1, -33);
    for (let l = 0; l < 20; l++) b.boxMM('plywood', x - 0.2, 1.0 + l * 0.018, -32, x + 1.1, 1.0 + (l + 1) * 0.018, -29.6);
  }
  for (let l = 0; l < 6; l++) for (let n = 0; n < 12 - l; n++) b.tube('galv', V(-6 + n * 0.05 + l * 0.025, 0.03 + l * 0.043, -37), V(-6 + n * 0.05 + l * 0.025, 0.03 + l * 0.043, -31), 0.024, 6);

  // ---------------- covered spoil / sand heaps (裸土覆盖 green dust net) on the east
  const heap = (cx: number, cz: number, rx: number, rz: number, h: number, key: MatKey) => {
    const g = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = g.getAttribute('position');
    const n = mulberry32(Math.floor(cx * 13 + cz));
    for (let i = 0; i < p.count; i++) { const k = 1 + (n() - 0.5) * 0.08; p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k); }
    g.computeVertexNormals();
    b.geo(key, g, [cx, 0, cz], [0, 0, 0], [rx, h, rz]);
  };
  heap(30, -12, 7, 5, 2.6, 'greenMesh' as MatKey); heap(30, -12, 6.9, 4.9, 2.55, 'dirt');
  heap(33, 2, 4, 3.5, 1.8, 'greenMesh' as MatKey); heap(33, 2, 3.95, 3.45, 1.78, 'dirt');

  // ---------------- mixer truck (east road) + small plant
  mixerTruck(b, 25, 12, Math.PI);
  // water tank, portable toilets, fire station
  b.tube('containerBlue', V(38, 0, -30), V(38, 3.2, -30), 1.3, 20);
  for (let i = 0; i < 3; i++) b.boxMM(i === 1 ? 'containerBlue' : 'containerWhite', 36 + i * 1.3, 0, 20, 37.2 + i * 1.3, 2.3, 21.2);
  b.boxMM('redPaint' as MatKey, -18, 0, 9.5, -16.8, 1.6, 9.9);
  for (let i = 0; i < 4; i++) b.tube('redPaint' as MatKey, V(-17.8 + i * 0.28, 0.1, 10.1), V(-17.8 + i * 0.28, 0.7, 10.1), 0.08, 10);
  // brick pallets, cement bags, wheelbarrow near the south face
  for (let p = 0; p < 6; p++) {
    const x = -12 + p * 1.6, z = 18;
    b.boxMM('timber', x, 0.06, z, x + 1.1, 0.16, z + 1.1);
    b.boxMM('brick', x + 0.02, 0.16, z + 0.02, x + 1.08, 1.0 + (p % 3) * 0.1, z + 1.08);
  }
  for (let i = 0; i < 30; i++) { const x = 2 + (i % 6) * 0.52, z = 18 + Math.floor(i / 6) * 0.36; b.box('cementBag', x, 0.14 + Math.floor(i / 12) * 0.12, z, 0.48, 0.12, 0.33, (r() - 0.5) * 0.1); }
  wheelbarrow(b, 9.5, 17.5, 0.6);
  // traffic cones along the haul road
  for (let i = 0; i < 8; i++) cone(b, -18 + i * 5, 15.3);

  // ---------------- 6F deck props (visible in the incident shots)
  // bundle of short bars waiting to be placed, tie-wire coil, tool bucket, a loose plank
  for (let n = 0; n < 14; n++) b.tube('rebar', V(-1.5, L.standY + 0.012 + Math.floor(n / 7) * 0.024, 5.2 + (n % 7) * 0.026), V(1.2, L.standY + 0.012 + Math.floor(n / 7) * 0.024, 5.2 + (n % 7) * 0.026), 0.011, 5);
  b.geo('steelDark', new THREE.TorusGeometry(0.16, 0.05, 6, 16), [7.3, L.standY + 0.05, 5.6], [Math.PI / 2, 0, 0]);
  b.tube('orangePlastic', V(7.9, L.standY, 5.1), V(7.9, L.standY + 0.3, 5.1), 0.13, 12);
  b.boxMM('timber', -4, L.standY, 3.6, -1.2, L.standY + 0.05, 3.9);

  // the loose rebar off-cut 老周 steps on (dynamic: it rolls)
  const offGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.55, 6); offGeo.rotateZ(Math.PI / 2);
  const offcut = new THREE.Mesh(offGeo, materials().rebar.mat);
  offcut.castShadow = true; offcut.name = 'offcut';
  root.add(offcut);

  return { offcut, signs };
}

function cone(b: Builder, x: number, z: number) {
  b.geo('orangePlastic', new THREE.ConeGeometry(0.15, 0.7, 12), [x, 0.41, z]);
  b.boxMM('blackMatte', x - 0.2, 0.06, z - 0.2, x + 0.2, 0.09, z + 0.2);
  b.geo('lineWhite', new THREE.CylinderGeometry(0.095, 0.11, 0.1, 12, 1, true), [x, 0.5, z]);
}

function wheelbarrow(b: Builder, x: number, z: number, yaw: number) {
  const g = new THREE.Group();
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const P = (lx: number, ly: number, lz: number) => new THREE.Vector3(x + lx * c + lz * s, ly, z - lx * s + lz * c);
  b.tube('galv', P(-0.8, 0.55, -0.25), P(0.4, 0.35, -0.2), 0.02).tube('galv', P(-0.8, 0.55, 0.25), P(0.4, 0.35, 0.2), 0.02);
  b.tube('rubber', P(0.5, 0.2, -0.05), P(0.5, 0.2, 0.05), 0.2, 14);
  b.box('containerBlue', x, 0.55, z, 0.8, 0.3, 0.6, yaw);
  void g;
}

function mixerTruck(b: Builder, x: number, z: number, yaw: number) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const P = (lx: number, ly: number, lz: number) => [x + lx * c + lz * s, ly, z - lx * s + lz * c];
  const box = (k: MatKey, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number) => { const p = P(lx, ly, lz); b.box(k, p[0], p[1], p[2], sx, sy, sz, yaw); };
  box('blackMatte', 0, 0.9, 0, 8.8, 0.3, 1.0);                         // chassis
  box('containerWhite', 3.6, 1.9, 0, 1.8, 1.9, 2.4);                   // cab
  box('glass', 4.52, 2.3, 0, 0.02, 0.8, 2.1);
  box('redPaint' as MatKey, 3.6, 1.0, 0, 1.9, 0.4, 2.45);
  const drum = new THREE.CylinderGeometry(1.0, 1.25, 4.6, 18, 1); drum.rotateZ(Math.PI / 2 - 0.12);
  const dp = P(-0.9, 2.45, 0); b.geo('craneWhite', drum, dp, [0, yaw, 0]);
  const cone1 = new THREE.ConeGeometry(1.0, 1.1, 18); cone1.rotateZ(Math.PI / 2 + 0.12);
  b.geo('craneWhite', cone1, P(-3.6, 2.2, 0), [0, yaw, 0]);
  const stripes = new THREE.CylinderGeometry(1.26, 1.26, 0.3, 18, 1, true); stripes.rotateZ(Math.PI / 2 - 0.12);
  b.geo('redPaint' as MatKey, stripes, P(-0.4, 2.47, 0), [0, yaw, 0]);
  box('galv', -4.2, 2.0, 0, 0.8, 0.9, 1.0);                             // chute
  for (const lx of [3.4, -1.2, -2.6, -3.9]) for (const lz of [-1.05, 1.05]) {
    const w = new THREE.CylinderGeometry(0.5, 0.5, 0.36, 16); w.rotateX(Math.PI / 2);
    b.geo('rubber', w, P(lx, 0.5, lz), [0, yaw, 0]);
  }
}
