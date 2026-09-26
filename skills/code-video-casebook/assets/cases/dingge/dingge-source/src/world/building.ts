import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { materials } from '../materials/library';
import { mulberry32 } from '../core/math';

// Six-storey RC frame under construction:
//  1F–4F poured (1F–2F brick infill in progress), 5F storey filled with shoring under the 6F formwork deck,
//  6F deck: film-faced plywood + two-layer rebar mesh + column starter cages, south edge guarded by rails.

export interface BuildingParts {
  gapTopRail: THREE.Mesh; gapMidRail: THREE.Mesh;   // the bay 小李 removes
  hoistCage: THREE.Group;
  lifeRing: THREE.Mesh;
  deckRebar: THREE.Group;   // LOD: visible when camera < ~35m
}

export function buildBuilding(b: Builder, root: THREE.Group): BuildingParts {
  const rnd = mulberry32(42);
  const { floorH: H, bx0, bx1, bz0, bz1, col } = L;

  // ---------------- ground slab / foundation plinth
  b.boxMM('concreteOld', bx0 - 0.3, -0.4, bz0 - 0.3, bx1 + 0.3, 0.15, bz1 + 0.3);

  // ---------------- columns (1F..5F) with slight per-pour tone breaks
  for (const x of L.colX) for (const z of L.colZ) for (let s = 0; s < 5; s++) {
    b.box(s % 2 ? 'concrete' : 'concreteDark', x, s * H + H / 2 + 0.075, z, col, H - 0.15, col, 0, 'column');
  }

  // ---------------- poured slabs + downstand beams
  for (let k = 1; k <= L.pouredLevels; k++) {
    const y = k * H;
    b.boxMM('concrete', bx0, y - L.slab, bz0, bx1, y, bz1);
    for (const z of L.colZ) b.box('concreteDark', 0, y - L.slab - 0.2, z, bx1 - bx0, 0.4, 0.25);
    for (const x of L.colX) b.box('concreteDark', x, y - L.slab - 0.2, 0, 0.25, 0.4, bz1 - bz0);
    // slab edge drip + slight lip
    b.boxMM('concreteOld', bx0 - 0.02, y - 0.16, bz1 - 0.01, bx1 + 0.02, y - 0.1, bz1 + 0.02);
  }

  // ---------------- brick infill on 1F/2F (window openings 1.8 x 1.5, sill 0.9)
  const wallBay = (x0: number, x1: number, z0: number, z1: number, y0: number, opening: boolean) => {
    const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const len = alongX ? x1 - x0 : z1 - z0, t = 0.2, h = H - 0.5;
    const c = alongX ? (z0 + z1) / 2 : (x0 + x1) / 2;
    const seg = (a: number, bb: number, ya: number, yb: number) => {
      if (bb - a < 0.01 || yb - ya < 0.01) return;
      if (alongX) b.boxMM('brick', x0 + a, y0 + ya, c - t / 2, x0 + bb, y0 + yb, c + t / 2);
      else b.boxMM('brick', c - t / 2, y0 + ya, z0 + a, c + t / 2, y0 + yb, z0 + bb);
    };
    if (!opening) { seg(0, len, 0, h); return; }
    const w0 = len / 2 - 0.9, w1 = len / 2 + 0.9;
    seg(0, w0, 0, h); seg(w1, len, 0, h); seg(w0, w1, 0, 0.9); seg(w0, w1, 2.4, h);
    // precast lintel
    if (alongX) b.boxMM('concreteDark', x0 + w0 - 0.2, y0 + 2.4, c - t / 2 - 0.005, x0 + w1 + 0.2, y0 + 2.6, c + t / 2 + 0.005);
    else b.boxMM('concreteDark', c - t / 2 - 0.005, y0 + 2.4, z0 + w0 - 0.2, c + t / 2 + 0.005, y0 + 2.6, z0 + w1 + 0.2);
  };
  for (let s = 0; s < 2; s++) {
    const y0 = s * H + 0.15;
    const xs = L.colX, zs = L.colZ;
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i] + col / 2, xb = xs[i + 1] - col / 2;
      wallBay(xa, xb, bz0 + 0.15, bz0 + 0.15, y0, true);                  // north
      if (s === 0 || i < 3) wallBay(xa, xb, bz1 - 0.15, bz1 - 0.15, y0, true); // south (2F partly done)
    }
    for (let j = 0; j < zs.length - 1; j++) {
      const za = zs[j] + col / 2, zb = zs[j + 1] - col / 2;
      wallBay(bx0 + 0.15, bx0 + 0.15, za, zb, y0, j === 0);
      wallBay(bx1 - 0.15, bx1 - 0.15, za, zb, y0, j === 1);
    }
  }
  // unfinished courses on 2F south, bays 3..4: a few stepped courses + mortar tub
  for (let c = 0; c < 6; c++) b.boxMM('brick', L.colX[3] + col / 2, H + 0.15, bz1 - 0.25, L.colX[3] + col / 2 + 5.5 - c * 0.24, H + 0.15 + (c + 1) * 0.063, bz1 - 0.05);

  // ---------------- 5F storey shoring (满堂支撑架) under the 6F deck
  const y0 = 4 * H, yDeck = L.deckY;
  for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) for (let z = bz0 + 0.6; z < bz1 - 0.3; z += 1.2) {
    b.tube('galv', [x, y0, z], [x, yDeck - 0.2, z], 0.024, 5);
    b.box('steelDark', x, yDeck - 0.19, z, 0.14, 0.02, 0.14); // U-head jack
  }
  for (const hy of [y0 + 0.3, y0 + 1.8]) {
    for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) b.tube('galv', [x, hy, bz0 + 0.5], [x, hy, bz1 - 0.5], 0.024, 5);
    for (let z = bz0 + 0.6; z < bz1 - 0.3; z += 1.2) b.tube('galv', [bx0 + 0.5, hy + 0.05, z], [bx1 - 0.5, hy + 0.05, z], 0.024, 5);
  }
  // main steel pipes (double) + timber joists (木方 50x100 @300) under plywood
  for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) {
    b.tube('galv', [x - 0.03, yDeck - 0.15, bz0 + 0.1], [x - 0.03, yDeck - 0.15, bz1 - 0.1], 0.024, 5);
    b.tube('galv', [x + 0.03, yDeck - 0.15, bz0 + 0.1], [x + 0.03, yDeck - 0.15, bz1 - 0.1], 0.024, 5);
  }
  for (let z = bz0 + 0.15; z < bz1; z += 0.3) b.boxMM('timber', bx0 + 0.05, yDeck - 0.118, z - 0.025, bx1 - 0.05, yDeck - 0.018, z + 0.025);
  // plywood deck + beam boxes
  b.boxMM('plywood', bx0, yDeck - 0.018, bz0, bx1, yDeck - 0.001, bz1);
  // edge form (side board) on the perimeter
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz1, bx1 + 0.02, yDeck + 0.15, bz1 + 0.02, 'edgeForm');
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz0 - 0.02, bx1 + 0.02, yDeck + 0.15, bz0);
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz0, bx0, yDeck + 0.15, bz1);
  b.boxMM('plywood', bx1, yDeck - 0.5, bz0, bx1 + 0.02, yDeck + 0.15, bz1);

  // ---------------- two-layer rebar mesh on the deck (Ø10 @200).
  // Whole deck: painted mat (mipmapped, no moiré at distance). Action zone: real bars, shown only when the camera is close.
  b.boxMM('rebarDeck', bx0 + 0.02, yDeck, bz0 + 0.02, bx1 - 0.02, yDeck + 0.002, bz1 - 0.02);
  const rb = new Builder();
  const rr = 0.0065, zx0 = -1.2, zx1 = 12.2, zz0 = 0.6, zz1 = 6.96;
  const layers = [{ y: yDeck + 0.025 }, { y: L.standY - 0.012 }];
  layers.forEach((ly, li) => {
    for (let z = zz0 + 0.1; z < zz1; z += 0.2) rb.tube('rebar', [zx0, ly.y, z], [zx1, ly.y, z], rr, 4);
    for (let x = zx0 + 0.1; x < zx1; x += 0.2) rb.tube('rebar', [x, ly.y + rr * 2, zz0], [x, ly.y + rr * 2, zz1], rr, 4);
    if (li === 1) for (let x = zx0 + 0.5; x < zx1; x += 1.0) for (let z = zz0 + 0.5; z < zz1; z += 1.0) rb.box('orangePlastic', x + 0.1, ly.y - 0.03, z + 0.1, 0.04, 0.05, 0.04);
  });
  // tie-wire twists at a sparse set of intersections (readable in close-ups near 老周's position)
  for (let x = 3.1; x < 7.5; x += 0.2) for (let z = 3.3; z < 6.3; z += 0.2) if (rnd() < 0.55) rb.box('steelDark', x, L.standY - 0.002, z, 0.012, 0.006, 0.012);
  const deckRebar = rb.build('deckRebar');
  root.add(deckRebar);

  // ---------------- column starter cages (8 bars + stirrups @200)
  for (const x of L.colX) for (const z of L.colZ) {
    const hs = col / 2 - 0.04;
    const bars = [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs], [0, -hs], [hs, 0], [0, hs], [-hs, 0]];
    for (const [dx, dz] of bars) b.tube('rebar', [x + dx, yDeck - 0.4, z + dz], [x + dx, L.cageTop + (dx === 0 || dz === 0 ? -0.05 : 0), z + dz], 0.011, 5);
    for (let y = yDeck + 0.15; y < L.cageTop - 0.1; y += 0.2) {
      const s = hs + 0.012;
      b.tube('rebar', [x - s, y, z - s], [x + s, y, z - s], 0.004, 3); b.tube('rebar', [x + s, y, z - s], [x + s, y, z + s], 0.004, 3);
      b.tube('rebar', [x + s, y, z + s], [x - s, y, z + s], 0.004, 3); b.tube('rebar', [x - s, y, z + s], [x - s, y, z - s], 0.004, 3);
    }
    b.colliders.push({ min: new THREE.Vector3(x - col / 2, yDeck, z - col / 2), max: new THREE.Vector3(x + col / 2, L.cageTop, z + col / 2), tag: 'cage' });
  }

  // ---------------- guardrails: 6F deck south edge + open slab edges at 3F/4F/5F
  const rails = (y: number, gap: boolean) => {
    for (const x of L.railPostXs) {
      b.tube('railRW', [x, y, L.railPostZ], [x, y + L.railTop + 0.05, L.railPostZ], 0.024, 6, gap ? 'railPost' : undefined);
      b.box('steelDark', x, y + 0.005, L.railPostZ, 0.16, 0.01, 0.16);
    }
    const xs = L.railPostXs;
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i], xb = xs[i + 1];
      const isGap = gap && xa === L.gapX0;
      if (!isGap) {
        b.tube('railRW', [xa, y + L.railTop, L.railZ], [xb, y + L.railTop, L.railZ], 0.024, 6, gap ? 'railTop' : undefined);
        b.tube('railRW', [xa, y + L.railMid, L.railZ], [xb, y + L.railMid, L.railZ], 0.024, 6, gap ? 'railMid' : undefined);
      }
      // right-angle couplers
      b.box('steelDark', xa, y + L.railTop, L.railZ + 0.03, 0.09, 0.08, 0.07);
      b.box('steelDark', xa, y + L.railMid, L.railZ + 0.03, 0.09, 0.08, 0.07);
    }
    b.boxMM('toeYB', xs[0], y, L.toeZ - 0.012, xs[xs.length - 1], y + L.toeH, L.toeZ + 0.012, gap ? 'toeBoard' : undefined);
    // end returns
    b.tube('railRW', [xs[0], y + L.railTop, L.railZ], [L.bx0 + 0.3, y + L.railTop, L.railZ], 0.024);
    b.tube('railRW', [xs[xs.length - 1], y + L.railTop, L.railZ], [L.bx1 - 0.3, y + L.railTop, L.railZ], 0.024);
  };
  rails(L.deckY, true);
  rails(3 * H, false); rails(4 * H, false);

  const railMat = materials().railRW.mat;
  const railGeo = new THREE.CylinderGeometry(0.024, 0.024, L.gapX1 - L.gapX0, 8);
  railGeo.rotateZ(Math.PI / 2);
  const setRailUV = (g: THREE.BufferGeometry) => { const uv = g.getAttribute('uv'); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i) * 2.5, uv.getX(i) * 0.2); };
  setRailUV(railGeo);
  const gapTopRail = new THREE.Mesh(railGeo, railMat); gapTopRail.castShadow = gapTopRail.receiveShadow = true;
  const gapMidRail = new THREE.Mesh(railGeo, railMat); gapMidRail.castShadow = gapMidRail.receiveShadow = true;
  gapTopRail.name = 'gapTopRail'; gapMidRail.name = 'gapMidRail';
  root.add(gapTopRail, gapMidRail);

  // ---------------- lifeline: two braced stanchions + Ø8 wire rope with slight sag
  const lx = [L.lifeX0, L.lifeX1], ly = L.standY + L.lifeH;
  for (const x of lx) {
    b.tube('craneYellow', [x, L.deckY, L.lifeZ], [x, ly + 0.15, L.lifeZ], 0.04, 8, 'stanchion');
    b.box('steelDark', x, L.deckY + 0.01, L.lifeZ, 0.3, 0.02, 0.3);
    const dir = x < 5 ? -1 : 1;
    b.tube('craneYellow', [x, ly - 0.2, L.lifeZ], [x + dir * 1.1, L.deckY + 0.02, L.lifeZ], 0.022, 6);
    b.tube('craneYellow', [x, ly - 0.4, L.lifeZ], [x, L.deckY + 0.02, L.lifeZ - 1.0], 0.022, 6);
    b.tube('craneYellow', [x, ly - 0.4, L.lifeZ], [x, L.deckY + 0.02, L.lifeZ + 1.0], 0.022, 6);
    b.box('steelDark', x, ly + 0.02, L.lifeZ, 0.12, 0.1, 0.12);
  }
  const segs = 24;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs, t1 = (i + 1) / segs;
    const sag = (t: number) => -0.06 * 4 * t * (1 - t);
    b.tube('cable', [L.lifeX0 + (L.lifeX1 - L.lifeX0) * t0, ly + sag(t0), L.lifeZ], [L.lifeX0 + (L.lifeX1 - L.lifeX0) * t1, ly + sag(t1), L.lifeZ], 0.004, 4);
  }
  // wire-rope clips and turnbuckle
  for (const x of [L.lifeX0 + 0.25, L.lifeX0 + 0.45, L.lifeX1 - 0.3]) b.box('steelDark', x, ly - 0.005, L.lifeZ, 0.05, 0.035, 0.03);
  const lifeRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 8, 20), materials().galv.mat);
  lifeRing.castShadow = true; lifeRing.name = 'lifeRing';
  root.add(lifeRing);

  // ---------------- load landing sleepers (timber) where the crane sets the rebar bundle
  for (const dx of [-2.2, 0, 2.2]) b.boxMM('timber', L.landX + dx - 0.06, L.standY - 0.01, L.landZ - 0.6, L.landX + dx + 0.06, L.standY + 0.1, L.landZ + 0.6, 'sleeper');

  // ---------------- double-row scaffold with dense safety mesh
  scaffold(b);

  // ---------------- construction hoist (施工升降机) on the south face at x=10.5
  const hx = 10.5, hz = L.bz1 + 1.6;
  const mastTop = 21;
  for (const [dx, dz] of [[-0.325, -0.325], [0.325, -0.325], [0.325, 0.325], [-0.325, 0.325]]) b.tube('craneWhite', [hx + dx, 0, hz + dz], [hx + dx, mastTop, hz + dz], 0.038, 6);
  for (let y = 0.5; y < mastTop; y += 0.75) {
    b.tube('craneWhite', [hx - 0.325, y, hz - 0.325], [hx + 0.325, y + 0.37, hz - 0.325], 0.012, 4);
    b.tube('craneWhite', [hx - 0.325, y, hz + 0.325], [hx + 0.325, y + 0.37, hz + 0.325], 0.012, 4);
    b.tube('craneWhite', [hx - 0.325, y + 0.37, hz - 0.325], [hx - 0.325, y + 0.75, hz + 0.325], 0.012, 4);
    b.tube('craneWhite', [hx + 0.325, y + 0.37, hz - 0.325], [hx + 0.325, y + 0.75, hz + 0.325], 0.012, 4);
  }
  // rack
  b.boxMM('steelDark', hx + 0.36, 0, hz - 0.04, hx + 0.4, mastTop, hz + 0.04);
  // base enclosure
  const bx = hx, bz = hz + 1.2;
  for (const [x0, z0, x1, z1] of [[bx - 2, bz - 0.2, bx + 2, bz - 0.15], [bx - 2, bz + 1.45, bx + 2, bz + 1.5], [bx + 1.95, bz - 0.2, bx + 2, bz + 1.5]]) b.boxMM('galv', x0, 0.15, z0, x1, 2.1, z1);
  // floor landings with gates at 1..5
  for (let k = 1; k <= 4; k++) {
    const y = k * H;
    b.boxMM('timber', hx - 1.4, y - 0.05, L.bz1, hx + 1.4, y, hz + 0.3);
    b.boxMM('orangePlastic', hx - 0.8, y, hz + 0.28, hx + 0.8, y + 1.8, hz + 0.32);
  }
  // tie-ins
  for (let y = 4.5; y < mastTop; y += 6) b.tube('craneWhite', [hx, y, hz - 0.33], [hx, y, L.bz1], 0.05);
  const hoistCage = new THREE.Group(); hoistCage.name = 'hoistCage';
  {
    const cb = new Builder();
    cb.boxMM('containerWhite', -1.5, 0, 0.45, 1.5, 0.15, 1.95);               // floor
    cb.boxMM('containerWhite', -1.5, 2.5, 0.45, 1.5, 2.6, 1.95);            // roof
    for (const x of [-1.5, 1.5]) for (const z of [0.45, 1.95]) cb.boxMM('craneYellow', x - 0.04, 0, z - 0.04, x + 0.04, 2.6, z + 0.04);
    cb.boxMM('greenMesh', -1.5, 0.15, 1.94, 1.5, 2.5, 1.96);
    cb.boxMM('greenMesh', -1.5, 0.15, 0.44, -0.4, 2.5, 0.46);
    cb.boxMM('craneYellow', -1.5, 1.0, 1.95, 1.5, 1.1, 2.0);
    cb.boxMM('containerBlue', -0.5, 2.6, 0.9, 0.5, 3.0, 1.5);                  // drive unit
    hoistCage.add(cb.build('hoistCage'));
  }
  hoistCage.position.set(hx, 0, hz - 0.33);
  root.add(hoistCage);

  return { gapTopRail, gapMidRail, hoistCage, lifeRing, deckRebar };
}

function scaffold(b: Builder) {
  const { bx0, bx1, bz0, bz1 } = L;
  const inner = 0.35, rowGap = 1.05, bay = 1.5, lift = 1.8;
  type Face = { a: THREE.Vector3; dir: THREE.Vector3; out: THREE.Vector3; len: number; top: number };
  const faces: Face[] = [
    { a: new THREE.Vector3(bx0 - inner - rowGap, 0, bz0 - inner), dir: new THREE.Vector3(1, 0, 0), out: new THREE.Vector3(0, 0, -1), len: bx1 - bx0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx1 + inner, 0, bz0 - inner - rowGap), dir: new THREE.Vector3(0, 0, 1), out: new THREE.Vector3(1, 0, 0), len: bz1 - bz0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx0 - inner, 0, bz0 - inner - rowGap), dir: new THREE.Vector3(0, 0, 1), out: new THREE.Vector3(-1, 0, 0), len: bz1 - bz0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx0 - inner - rowGap, 0, bz1 + inner), dir: new THREE.Vector3(1, 0, 0), out: new THREE.Vector3(0, 0, 1), len: 13.5, top: 7.6 }, // south, west part only
  ];
  const P = (f: Face, s: number, row: number, y: number) => f.a.clone().addScaledVector(f.dir, s).addScaledVector(f.out, row * rowGap).setY(y);
  for (const f of faces) {
    const n = Math.floor(f.len / bay);
    for (let i = 0; i <= n; i++) for (const row of [0, 1]) {
      const p = P(f, i * bay, row, 0.05);
      b.tube('galv', p, P(f, i * bay, row, f.top + (row ? 1.2 : 0)), 0.024, 5);
      b.box('timber', p.x, 0.03, p.z, 0.25, 0.05, 0.25);
    }
    for (let y = 0.2; y <= f.top + 1.2; y += lift) for (const row of [0, 1]) {
      if (!row && y > f.top) continue;
      b.tube('galv', P(f, 0, row, y), P(f, n * bay, row, y), 0.024, 5);
      b.tube('galv', P(f, 0, row, y + 0.9), P(f, n * bay, row, y + 0.9), 0.02, 5).tube('galv', P(f, 0, 1, y + 0.45), P(f, n * bay, 1, y + 0.45), 0.02, 5);
    }
    for (let y = 0.2; y <= f.top; y += lift) for (let i = 0; i <= n; i++) b.tube('galv', P(f, i * bay, -0.2, y + 0.06), P(f, i * bay, 1.1, y + 0.06), 0.024, 5);
    // working platforms: steel planks on every other lift + toe board
    for (let y = 0.2 + lift * 2; y <= f.top; y += lift * 2) {
      const a = P(f, 0, 0, y + 0.1), c = P(f, n * bay, 1, y + 0.13);
      b.boxMM('galv', Math.min(a.x, c.x), y + 0.1, Math.min(a.z, c.z), Math.max(a.x, c.x), y + 0.13, Math.max(a.z, c.z));
    }
    // scissor bracing on the outer face
    for (let i = 0; i + 4 <= n; i += 4) for (let y = 0.2; y + lift * 3 <= f.top + 1.3; y += lift * 3) {
      b.tube('galv', P(f, i * bay, 1.03, y), P(f, (i + 4) * bay, 1.03, y + lift * 3), 0.022, 5);
      b.tube('galv', P(f, (i + 4) * bay, 1.05, y), P(f, i * bay, 1.05, y + lift * 3), 0.022, 5);
    }
    // dense mesh on the outer face
    const m0 = P(f, 0, 1.06, 0.4), m1 = P(f, n * bay, 1.06, f.top + 1.2);
    if (Math.abs(f.dir.x) > 0) b.boxMM('greenMesh', Math.min(m0.x, m1.x), 0.4, m0.z - 0.004, Math.max(m0.x, m1.x), f.top + 1.2, m0.z + 0.004);
    else b.boxMM('greenMesh', m0.x - 0.004, 0.4, Math.min(m0.z, m1.z), m0.x + 0.004, f.top + 1.2, Math.max(m0.z, m1.z));
  }
}
