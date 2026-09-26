import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { materials } from '../materials/library';
import { signPanel } from '../materials/textures';

// Hammerhead tower crane (QTZ-class): lattice mast, slewing unit + cab, A-frame tower head,
// triangular jib with trolley, counter-jib with ballast and winch, pendant tie bars, 4-fall hoist rope, hook block,
// two-leg sling carrying a rebar bundle (多点起吊 per 十不吊 #3).

export interface CraneRig {
  group: THREE.Group;
  setState(s: { slew: number; trolley: number; hookY: number; swing?: number; loadAttached?: boolean }): void;
  hookWorld: THREE.Vector3;
  loadGroup: THREE.Group;
  /** slew angle that points the jib at world (x,z), and the trolley radius needed */
  aim(x: number, z: number): { slew: number; radius: number };
}

function lattice(b: Builder, key: 'craneYellow' | 'craneWhite', a: THREE.Vector3, c: THREE.Vector3, r = 0.03) { b.tube(key, a, c, r, 5); }

export function buildCrane(root: THREE.Group): CraneRig {
  const group = new THREE.Group(); group.name = 'crane';
  group.position.set(L.craneX, 0, L.craneZ);
  root.add(group);
  const M = materials();

  // ---------------- static mast
  const sb = new Builder();
  const w = L.mast / 2, top = L.craneJibY - 3.2, sec = 2.8;
  sb.boxMM('concreteOld', -3.5, -0.2, -3.5, 3.5, 0.6, 3.5); // foundation block
  for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) sb.box('craneYellow', x, top / 2 + 0.6, z, 0.14, top, 0.14);
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  for (let y = 0.6; y < top; y += sec) {
    const y1 = Math.min(y + sec, top);
    const faces: [THREE.Vector3, THREE.Vector3][] = [[V(-w, 0, -w), V(w, 0, -w)], [V(w, 0, -w), V(w, 0, w)], [V(w, 0, w), V(-w, 0, w)], [V(-w, 0, w), V(-w, 0, -w)]];
    for (const [p, q] of faces) {
      lattice(sb, 'craneYellow', p.clone().setY(y), q.clone().setY(y), 0.035);
      lattice(sb, 'craneYellow', p.clone().setY(y), q.clone().setY((y + y1) / 2), 0.03);
      lattice(sb, 'craneYellow', q.clone().setY((y + y1) / 2), p.clone().setY(y1), 0.03);
    }
    // bolted splice plates
    for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) sb.box('steelDark', x, y, z, 0.22, 0.12, 0.22);
  }
  // ladder + rest platforms inside mast
  for (let y = 1; y < top; y += 0.3) sb.box('steelDark', 0, y, -w + 0.25, 0.4, 0.02, 0.02);
  for (let y = 9; y < top; y += 9) sb.boxMM('galv', -w, y, -w, w, y + 0.03, w);
  // wall ties to the building (附着) at 12m and 24m
  for (const y of [12, 24]) {
    sb.tube('craneYellow', V(-w, y, w), V(-3, y, L.bz0 - 0.1 - L.craneZ), 0.06);
    sb.tube('craneYellow', V(w, y, w), V(3, y, L.bz0 - 0.1 - L.craneZ), 0.06);
    sb.boxMM('craneYellow', -w - 0.2, y - 0.2, -w - 0.2, w + 0.2, y + 0.2, w + 0.2);
  }
  group.add(sb.build('craneMast'));

  // ---------------- slewing assembly
  const slew = new THREE.Group(); slew.name = 'slew'; slew.position.y = top;
  group.add(slew);
  const b = new Builder();
  const J = L.craneJibLen, C = L.craneCounterLen;
  b.boxMM('craneYellow', -1.4, 0, -1.4, 1.4, 0.8, 1.4);          // slewing ring / turntable
  b.boxMM('steelDark', -1.1, -0.15, -1.1, 1.1, 0, 1.1);
  // platform + tower head A-frame (apex 7m above jib root)
  const jibY = 1.2, apexY = jibY + 7.2;
  for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) lattice(b, 'craneYellow', V(x, 0.8, z), V(0, apexY, 0), 0.08);
  for (let y = 2.5; y < apexY - 1; y += 1.8) {
    const s = w * (1 - (y - 0.8) / (apexY - 0.8));
    for (const [p, q] of [[V(-s, y, -s), V(s, y, -s)], [V(s, y, -s), V(s, y, s)], [V(s, y, s), V(-s, y, s)], [V(-s, y, s), V(-s, y, -s)]]) lattice(b, 'craneYellow', p, q, 0.03);
  }
  b.box('steelDark', 0, apexY + 0.2, 0, 0.5, 0.4, 0.5);
  // jib: triangular, bottom chords at z=±0.6, top chord at y+1.25
  const bz = 0.6, jh = 1.25, panel = 1.25;
  const bot1 = (x: number) => V(x, jibY, -bz), bot2 = (x: number) => V(x, jibY, bz), topc = (x: number) => V(x, jibY + jh * (1 - 0.35 * Math.max(0, (x - J * 0.6) / (J * 0.4))), 0);
  b.box('craneYellow', w + J / 2, jibY, -bz, J, 0.12, 0.12); b.box('craneYellow', w + J / 2, jibY, bz, J, 0.12, 0.12);
  for (let x = w; x < w + J; x += panel) {
    const x1 = Math.min(x + panel, w + J);
    lattice(b, 'craneYellow', topc(x), topc(x1), 0.05);
    lattice(b, 'craneYellow', bot1(x), topc((x + x1) / 2), 0.025); lattice(b, 'craneYellow', topc((x + x1) / 2), bot1(x1), 0.025);
    lattice(b, 'craneYellow', bot2(x), topc((x + x1) / 2), 0.025); lattice(b, 'craneYellow', topc((x + x1) / 2), bot2(x1), 0.025);
    lattice(b, 'craneYellow', bot1(x), bot2(x), 0.022);
    if (((x - w) / panel) % 2 < 1) lattice(b, 'craneYellow', bot1(x), bot2(x1), 0.02);
  }
  // red/white tip + jib-end buffer
  b.box('redPaint', w + J, jibY + 0.4, 0, 0.3, 1.0, 1.4);
  // counter-jib: flat twin girders, walkway, ballast, winch, slogan banner
  b.box('craneYellow', -w - C / 2, jibY, -1.0, C, 0.35, 0.18); b.box('craneYellow', -w - C / 2, jibY, 1.0, C, 0.35, 0.18);
  for (let x = -w; x > -w - C; x -= 1.5) { lattice(b, 'craneYellow', V(x, jibY, -1.0), V(x, jibY, 1.0), 0.04); lattice(b, 'craneYellow', V(x, jibY, -1.0), V(x - 1.5, jibY, 1.0), 0.03); }
  b.boxMM('galv', -w - C, jibY + 0.18, -0.9, -w, jibY + 0.21, 0.9);
  for (let i = 0; i < 4; i++) b.boxMM('concreteOld', -w - C + 0.2 + i * 0.62, jibY - 1.8, -0.8, -w - C + 0.78 + i * 0.62, jibY + 0.1, 0.8);
  b.boxMM('containerBlue', -w - 6.5, jibY + 0.2, -0.7, -w - 3.5, jibY + 1.4, 0.7);      // hoist winch housing
  b.tube('steelDark', V(-w - 5.9, jibY + 0.8, -0.72), V(-w - 5.9, jibY + 0.8, 0.72), 0.35, 12); // drum
  // handrails along counter-jib
  for (const z of [-1.05, 1.05]) { b.tube('craneYellow', V(-w, jibY + 1.1, z), V(-w - C, jibY + 1.1, z), 0.02); for (let x = -w; x > -w - C; x -= 1.5) b.tube('craneYellow', V(x, jibY, z), V(x, jibY + 1.1, z), 0.018); }
  // pendant tie bars
  lattice(b, 'craneYellow', V(0, apexY, 0), topc(w + 19), 0.05);
  lattice(b, 'craneYellow', V(0, apexY, 0), topc(w + 37), 0.045);
  lattice(b, 'craneYellow', V(0, apexY, 0.1), V(-w - C + 0.5, jibY + 0.2, 0.9), 0.05);
  lattice(b, 'craneYellow', V(0, apexY, -0.1), V(-w - C + 0.5, jibY + 0.2, -0.9), 0.05);
  // operator cab on the +z side of the turntable
  b.boxMM('craneWhite', 0.2, 0.2, 1.4, 2.6, 2.6, 3.2);
  b.boxMM('glass', 2.6, 0.7, 1.5, 2.62, 2.5, 3.1);
  b.boxMM('glass', 0.3, 0.7, 3.2, 2.5, 2.5, 3.22);
  b.boxMM('galv', -0.2, 0.15, 1.4, 2.8, 0.2, 3.5);
  slew.add(b.build('craneSlew'));

  // banner on counter-jib
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(C * 0.7, 1.4), new THREE.MeshStandardMaterial({ map: signPanel({ w: 1024, h: 160, bg: '#c62828', lines: [{ text: '安全第一  预防为主', color: '#ffffff', size: 110, y: 82 }] }), roughness: 0.7, side: THREE.DoubleSide }));
  banner.position.set(-w - C / 2 - 0.8, jibY + 1.9, 1.08); banner.castShadow = true;
  slew.add(banner);
  const banner2 = banner.clone(); banner2.position.z = -1.08; banner2.rotation.y = Math.PI; slew.add(banner2);

  // warning light at apex
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshStandardMaterial({ color: 0xff3020, emissive: 0xff2010, emissiveIntensity: 1.5 }));
  beacon.position.set(0, apexY + 0.55, 0); slew.add(beacon);

  // ---------------- trolley, ropes, hook block, load
  const trolley = new THREE.Group(); trolley.name = 'trolley';
  {
    const tb = new Builder();
    tb.boxMM('craneYellow', -0.7, -0.35, -0.75, 0.7, -0.05, 0.75);
    for (const x of [-0.5, 0.5]) for (const z of [-0.6, 0.6]) tb.tube('steelDark', V(x, 0.0, z - 0.08), V(x, 0.0, z + 0.08), 0.1, 10);
    tb.tube('steelDark', V(0, -0.45, -0.3), V(0, -0.45, 0.3), 0.16, 12);
    trolley.add(tb.build('trolley'));
  }
  trolley.position.y = jibY - 0.06;
  slew.add(trolley);

  const ropeMat = M.cable.mat;
  const ropeGeo = new THREE.CylinderGeometry(0.009, 0.009, 1, 5); ropeGeo.translate(0, -0.5, 0);
  const ropes: THREE.Mesh[] = [];
  for (const dz of [-0.12, -0.04, 0.04, 0.12]) { const r = new THREE.Mesh(ropeGeo, ropeMat); r.position.set(0, -0.45, dz); r.castShadow = true; trolley.add(r); ropes.push(r); }

  const hook = new THREE.Group(); hook.name = 'hookBlock';
  {
    const hb = new Builder();
    hb.boxMM('craneYellow', -0.18, -0.25, -0.35, 0.18, 0.35, 0.35);
    hb.tube('steelDark', V(-0.2, 0.15, -0.28), V(-0.2, 0.15, 0.28), 0.14, 12);
    hb.box('redPaint', 0, -0.1, 0.36, 0.3, 0.3, 0.01);
    hb.tube('steelDark', V(0, -0.25, 0), V(0, -0.45, 0), 0.05, 8);
    const hookCurve = new THREE.TorusGeometry(0.12, 0.035, 8, 16, Math.PI * 1.5);
    hb.geo('steelDark', hookCurve, [0, -0.57, 0], [0, 0, Math.PI * 0.75]);
    hook.add(hb.build('hook'));
  }
  group.add(hook);

  const loadGroup = new THREE.Group(); loadGroup.name = 'load';
  {
    const lb = new Builder();
    // bundle of 24 x Ø25 bars, 6m, hexagonal-ish stacking, two tie wires
    let n = 0;
    for (let row = 0; row < 4; row++) for (let c = 0; c < 7 - (row % 2); c++) {
      if (n++ >= 24) break;
      const z = (c - 3 + (row % 2) * 0.5) * 0.052, y = row * 0.045;
      lb.tube('rebar', V(-3, y, z), V(3, y, z), 0.0125, 6);
    }
    for (const x of [-1.8, 1.8]) { lb.box('steelDark', x, 0.07, 0, 0.03, 0.2, 0.4); }
    loadGroup.add(lb.build('load'));
  }
  group.add(loadGroup);
  const slingGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 5); slingGeo.translate(0, 0.5, 0);
  const slings = [new THREE.Mesh(slingGeo, M.orangePlastic.mat), new THREE.Mesh(slingGeo, M.orangePlastic.mat)];
  slings.forEach(s => { s.castShadow = true; group.add(s); });

  const hookWorld = new THREE.Vector3();
  const tmp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const pivot = new THREE.Vector3(L.craneX, 0, L.craneZ);
  const jibDir = new THREE.Vector3();

  function setState(s: { slew: number; trolley: number; hookY: number; swing?: number; loadAttached?: boolean }) {
    slew.rotation.y = s.slew;
    trolley.position.x = w + Math.max(2, Math.min(J - 1, s.trolley));
    const trolleyWorldY = top + jibY - 0.06 - 0.45;
    const ropeLen = Math.max(0.5, trolleyWorldY - (s.hookY + 0.35));
    ropes.forEach(r => (r.scale.y = ropeLen));
    jibDir.set(Math.cos(s.slew), 0, -Math.sin(s.slew));
    const sw = s.swing ?? 0;
    hook.position.set(jibDir.x * trolley.position.x + jibDir.z * sw, s.hookY, jibDir.z * trolley.position.x - jibDir.x * sw);
    hook.rotation.y = s.slew;
    hookWorld.copy(hook.position).add(pivot);
    // load hangs 2.6m under the hook on a two-leg sling, bundle axis along world x (landing orientation)
    const hookEye = hook.position.clone().add(tmp.set(0, -0.62, 0));
    loadGroup.position.set(hookEye.x, hookEye.y - 2.6, hookEye.z);
    loadGroup.rotation.y = 0;
    loadGroup.visible = s.loadAttached !== false;
    const ends = [new THREE.Vector3(-1.8, 0.14, 0), new THREE.Vector3(1.8, 0.14, 0)];
    slings.forEach((sl, i) => {
      sl.visible = loadGroup.visible;
      const a = ends[i].clone().add(loadGroup.position);
      const d = hookEye.clone().sub(a);
      sl.position.copy(a); sl.scale.set(1, d.length(), 1);
      sl.quaternion.setFromUnitVectors(up, d.normalize());
    });
  }
  function aim(x: number, z: number) {
    const dx = x - L.craneX, dz = z - L.craneZ;
    return { slew: Math.atan2(-dz, dx), radius: Math.hypot(dx, dz) - w };
  }
  setState({ slew: 0, trolley: 20, hookY: 20 });
  return { group, setState, hookWorld, loadGroup, aim };
}
