import * as THREE from "three";
import type { MatLib } from "../look/moonwash";
import { TEX } from "../core/tex";
import { rng, hash } from "../core/rng";
import { ROOM, WIN, DESK, CHAIR, BOOK, LAMP, STACK, MUG, PLATE } from "../layout";

/**
 * THE ROOM — her study corner. World code says WHAT things are ("wood", "paper", "cover:#…");
 * the look decides how they are painted. Colliders are recorded as named AABBs for QC.
 */
export interface Collider {
  name: string;
  box: THREE.Box3;
}

export interface RoomHandles {
  group: THREE.Group;
  colliders: Collider[];
  curtains: THREE.Mesh[];
  pages: THREE.Mesh[]; // flipping leaves (posed each frame)
  pageRest: { right: THREE.Mesh; left: THREE.Mesh };
  steam: THREE.Sprite[];
  lampBulb: THREE.Vector3;
  lampAim: THREE.Vector3;
}

let M: MatLib;
function mesh(g: THREE.BufferGeometry, sem: string | THREE.Material | THREE.Material[], o: { cast?: boolean; receive?: boolean } = {}) {
  const m = new THREE.Mesh(g, typeof sem === "string" ? M.get(sem) : sem);
  m.castShadow = o.cast ?? true;
  m.receiveShadow = o.receive ?? true;
  return m;
}
function box(w: number, h: number, d: number, sem: string | THREE.Material | THREE.Material[], x: number, y: number, z: number, o: { cast?: boolean; receive?: boolean } = {}) {
  const m = mesh(new THREE.BoxGeometry(w, h, d), sem, o);
  m.position.set(x, y, z);
  return m;
}

/** handwritten page: faint rules, ink lines, one highlighted phrase, a tiny moon doodle */
function pageTexture(seed: string, doodle: boolean) {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 360;
  const g = cv.getContext("2d")!;
  const r = rng(hash(seed));
  g.fillStyle = "#f4ecdc";
  g.fillRect(0, 0, 256, 360);
  g.strokeStyle = "rgba(120,140,170,0.35)";
  g.lineWidth = 1;
  for (let y = 40; y < 350; y += 20) {
    g.beginPath();
    g.moveTo(14, y);
    g.lineTo(242, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(40,50,90,0.75)";
  g.lineWidth = 1.6;
  for (let y = 36; y < 340; y += 20) {
    let x = 20 + r() * 8;
    const end = 150 + r() * 90;
    while (x < end) {
      const w = 5 + r() * 7;
      g.beginPath();
      g.moveTo(x, y - 2 - r() * 5);
      g.lineTo(x + w * 0.5, y - r() * 3);
      g.lineTo(x + w, y - 3 - r() * 4);
      g.stroke();
      x += w + 2 + r() * 3;
    }
    if (r() < 0.14) {
      g.fillStyle = "rgba(250,210,80,0.45)";
      g.fillRect(24 + r() * 60, y - 12, 50 + r() * 60, 12);
    }
  }
  if (doodle) {
    g.strokeStyle = "rgba(200,120,40,0.9)";
    g.lineWidth = 2.2;
    g.beginPath();
    g.arc(214, 316, 14, Math.PI * 0.35, Math.PI * 1.65);
    g.arc(206, 316, 11, Math.PI * 1.55, Math.PI * 0.45, true);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function buildRoom(lib: MatLib): RoomHandles {
  M = lib;
  const group = new THREE.Group();
  group.name = "room";
  const colliders: Collider[] = [];
  const addC = (name: string, o: THREE.Object3D) => {
    o.updateMatrixWorld(true);
    colliders.push({ name, box: new THREE.Box3().setFromObject(o) });
  };
  const { x0, x1, zBack, h, wallT } = ROOM;
  const W = x1 - x0;
  // ---------------------------------------------------------------- shell
  const floor = box(W, 0.04, -zBack + 0.3, "floor", 0, -0.02, zBack / 2 + 0.05);
  const ceil = box(W, 0.04, -zBack + 0.3, "ceiling", 0, h + 0.02, zBack / 2 + 0.05, { cast: false });
  const back = box(W, h, 0.1, "wall", 0, h / 2, zBack - 0.05);
  const left = box(0.1, h, -zBack, "wall", x1 + 0.05, h / 2, zBack / 2);
  const right = box(0.1, h, -zBack, "wall", x0 - 0.05, h / 2, zBack / 2);
  group.add(floor, ceil, back, left, right);
  addC("wall.left", left);
  addC("wall.right", right);
  addC("floor", floor);
  addC("ceiling", ceil);
  // front wall around the window opening (z = 0 plane, thickness wallT)
  const fw = [
    box(x1 - WIN.x1, h, wallT, "wall", (x1 + WIN.x1) / 2, h / 2, 0),
    box(WIN.x0 - x0, h, wallT, "wall", (x0 + WIN.x0) / 2, h / 2, 0),
    box(WIN.x1 - WIN.x0, h - WIN.y1, wallT, "wall", 0, (h + WIN.y1) / 2, 0),
    box(WIN.x1 - WIN.x0, WIN.y0, wallT, "wall", 0, WIN.y0 / 2, 0),
  ];
  fw.forEach((m, i) => {
    group.add(m);
    addC(`wall.front${i}`, m);
  });
  // soft round rug under the chair (a quiet circle in the room)
  const rug = mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.012, 48), "cover:#6f5a7e", { cast: false });
  rug.position.set(0, 0.006, -1.05);
  group.add(rug);
  // ---------------------------------------------------------------- window: casing, sill, open sashes, curtains
  const cas = 0.07;
  const casing = [
    box(cas, WIN.y1 - WIN.y0 + cas * 2, 0.05, "frame", WIN.x1 + cas / 2, (WIN.y0 + WIN.y1) / 2, WIN.zIn - 0.02),
    box(cas, WIN.y1 - WIN.y0 + cas * 2, 0.05, "frame", WIN.x0 - cas / 2, (WIN.y0 + WIN.y1) / 2, WIN.zIn - 0.02),
    box(WIN.x1 - WIN.x0 + cas * 2, cas, 0.05, "frame", 0, WIN.y1 + cas / 2, WIN.zIn - 0.02),
  ];
  casing.forEach((m, i) => {
    group.add(m);
    addC(`casing${i}`, m);
  });
  const sill = box(WIN.x1 - WIN.x0 + 0.2, 0.045, 0.3, "frame", 0, WIN.y0 - 0.0225, -0.02);
  group.add(sill);
  addC("sill", sill);
  // a small plant on the sill, right corner
  const pot = mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 14), "plantPot");
  pot.position.set(-0.7, WIN.y0 + 0.04, -0.05);
  const leaves = mesh(new THREE.SphereGeometry(0.075, 12, 8), "plant");
  leaves.scale.set(1, 0.8, 1);
  leaves.position.set(-0.7, WIN.y0 + 0.13, -0.05);
  group.add(pot, leaves);
  // open casement sashes (swung outward to the sides), each with a cross bar
  for (const s of [-1, 1]) {
    const sash = new THREE.Group();
    const sw = (WIN.x1 - WIN.x0) / 2, sh = WIN.y1 - WIN.y0, bar = 0.045;
    const bars = [
      box(bar, sh, bar, "frame", -s * bar / 2, sh / 2, 0),
      box(bar, sh, bar, "frame", -s * (sw - bar / 2), sh / 2, 0),
      box(sw, bar, bar, "frame", -s * sw / 2, bar / 2, 0),
      box(sw, bar, bar, "frame", -s * sw / 2, sh - bar / 2, 0),
      box(sw, bar * 0.7, bar * 0.7, "frame", -s * sw / 2, sh * 0.55, 0),
      box(bar * 0.7, sh, bar * 0.7, "frame", -s * sw / 2, sh / 2, 0),
    ];
    bars.forEach((b) => sash.add(b));
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ color: "#c8d8ff", transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }));
    glass.position.set(-s * sw / 2, sh / 2, 0);
    glass.userData.noOutline = true;
    sash.add(glass);
    sash.position.set(s > 0 ? WIN.x1 : WIN.x0, WIN.y0, WIN.zOut + 0.02);
    sash.rotation.y = s * 1.25; // opened ~72° outward (free edge swings toward +z)
    group.add(sash);
  }
  // curtains: gathered sheer panels either side, posed per frame (breeze)
  const curtains: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const g = new THREE.PlaneGeometry(0.46, 1.68, 18, 12);
    g.userData.base = (g.getAttribute("position") as THREE.BufferAttribute).array.slice();
    const c = mesh(g, "curtain", { cast: false, receive: true });
    c.position.set(s * (WIN.x1 + 0.2), 1.66, -0.2);
    c.userData.side = s;
    c.userData.noOutline = true;
    curtains.push(c);
    group.add(c);
  }
  const rod = mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.3, 8), "woodDark");
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, 2.51, -0.2);
  group.add(rod);
  // sticky notes on the wall right of the window (her right, −x)
  const notes = [["#f4d468", -1.02, 1.62, 0.05], ["#f2a6a0", -1.1, 1.5, -0.08], ["#a8d8c0", -0.99, 1.43, 0.12]] as const;
  for (const [c, x, y, rot] of notes) {
    const n = box(0.075, 0.075, 0.004, `cover:${c}`, x, y, WIN.zIn - 0.002, { cast: false });
    n.rotation.z = rot;
    group.add(n);
  }
  // ---------------------------------------------------------------- desk + chair
  const top = box(DESK.x1 - DESK.x0, DESK.t, DESK.zFar - DESK.zNear, "wood", 0, DESK.top - DESK.t / 2, (DESK.zFar + DESK.zNear) / 2);
  group.add(top);
  addC("desk.top", top);
  for (const [lx, lz] of [[DESK.x0 + 0.04, DESK.zNear + 0.04], [DESK.x1 - 0.04, DESK.zNear + 0.04], [DESK.x0 + 0.04, DESK.zFar - 0.04], [DESK.x1 - 0.04, DESK.zFar - 0.04]]) {
    group.add(box(0.045, DESK.top - DESK.t, 0.045, "woodDark", lx, (DESK.top - DESK.t) / 2, lz));
  }
  const drawer = box(0.42, 0.12, 0.5, "wood", -0.46, DESK.top - DESK.t - 0.06, (DESK.zFar + DESK.zNear) / 2);
  group.add(drawer);
  const seat = box(0.44, 0.04, 0.42, "woodLight", CHAIR.x, CHAIR.seat - 0.02, CHAIR.z);
  group.add(seat);
  addC("chair.seat", seat);
  for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) {
    group.add(box(0.035, CHAIR.seat - 0.04, 0.035, "woodDark", CHAIR.x + lx, (CHAIR.seat - 0.04) / 2, CHAIR.z + lz));
  }
  for (const lx of [-0.19, 0.19]) group.add(box(0.03, 0.36, 0.03, "woodDark", CHAIR.x + lx, CHAIR.seat + 0.18, CHAIR.z - 0.2));
  const rail = box(0.44, 0.07, 0.03, "woodLight", CHAIR.x, CHAIR.seat + 0.31, CHAIR.z - 0.205);
  group.add(rail);
  addC("chair.back", rail);
  // ---------------------------------------------------------------- lamp (her left, +x)
  const lampY = DESK.top;
  const base = mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.022, 24), "lampMetal");
  base.position.set(LAMP.x, lampY + 0.011, LAMP.z);
  const stemA = new THREE.Vector3(LAMP.x, lampY + 0.02, LAMP.z);
  const elbow = new THREE.Vector3(LAMP.x - 0.02, lampY + 0.36, LAMP.z + 0.02);
  const head = new THREE.Vector3(LAMP.x - 0.15, lampY + 0.4, LAMP.z - 0.06);
  const rodMesh = (a: THREE.Vector3, b: THREE.Vector3) => {
    const m = mesh(new THREE.CylinderGeometry(0.009, 0.009, a.distanceTo(b), 8), "lampMetal");
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  };
  group.add(base, rodMesh(stemA, elbow), rodMesh(elbow, head));
  const aim = new THREE.Vector3(BOOK.x + 0.02, BOOK.y, BOOK.z);
  const shadeDir = aim.clone().sub(head).normalize();
  const shadeOut = mesh(new THREE.CylinderGeometry(0.048, 0.105, 0.13, 28, 1, true), "lampMetal");
  const shadeIn = mesh(new THREE.CylinderGeometry(0.047, 0.104, 0.129, 28, 1, true), "lampShadeIn", { cast: false, receive: false });
  const bulbPos = head.clone().add(shadeDir.clone().multiplyScalar(0.05));
  for (const s of [shadeOut, shadeIn]) {
    s.position.copy(head).add(shadeDir.clone().multiplyScalar(0.065));
    s.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), shadeDir);
    group.add(s);
  }
  const bulb = mesh(new THREE.SphereGeometry(0.026, 12, 8), "bulb", { cast: false, receive: false });
  bulb.position.copy(bulbPos);
  group.add(bulb);
  addC("lamp.shade", shadeOut);
  // ---------------------------------------------------------------- the open book
  const cover = box(0.36, 0.008, BOOK.pageD + 0.02, "cover:#2f5d62", BOOK.x, DESK.top + 0.004, BOOK.z);
  group.add(cover);
  const edge = M.get("pageEdge");
  const pmR = new THREE.MeshLambertMaterial({ map: pageTexture("pageR", false) });
  const pmL = new THREE.MeshLambertMaterial({ map: pageTexture("pageL", true) });
  const blockH = BOOK.y - (DESK.top + 0.008);
  const rightB = box(BOOK.pageW, blockH, BOOK.pageD, [edge, edge, pmR, edge, edge, edge], BOOK.x - BOOK.pageW / 2 - 0.003, DESK.top + 0.008 + blockH / 2, BOOK.z);
  const leftB = box(BOOK.pageW, blockH, BOOK.pageD, [edge, edge, pmL, edge, edge, edge], BOOK.x + BOOK.pageW / 2 + 0.003, DESK.top + 0.008 + blockH / 2, BOOK.z);
  group.add(rightB, leftB);
  addC("book", rightB);
  addC("book", leftB);
  // flipping leaves: bendable strips (posed per frame)
  const pages: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.PlaneGeometry(BOOK.pageW, BOOK.pageD, 14, 1);
    const tex = pageTexture(`leaf${i}`, i === 1);
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }));
    m.castShadow = true;
    m.receiveShadow = true;
    m.visible = false;
    pages.push(m);
    group.add(m);
  }
  // ---------------------------------------------------------------- the stack: law on top of sociology
  const titles: [string, string, string][] = [
    ["社会学概论", "#6d3b3b", "#f1dcb4"],
    ["法理学", "#34506b", "#f3e6c9"],
    ["宪法学", "#3f6b5a", "#f3e6c9"],
    ["民法学", "#8a6a3a", "#fbf0d6"],
    ["刑法学", "#5a4a6b", "#f3e6c9"],
    ["诉讼法", "#2f3f4f", "#e8cf98"],
  ];
  let y = DESK.top;
  const r = rng(77);
  titles.forEach(([t, bg, fg], i) => {
    const hgt = 0.036 + r() * 0.016;
    const w = 0.25 + r() * 0.03, d = 0.18 + r() * 0.02;
    const coverM = M.get(`cover:${bg}`);
    const spineM = new THREE.MeshLambertMaterial({ map: TEX.spine(t, bg, fg) });
    const b = box(w, hgt, d, [edge, edge, coverM, coverM, edge, spineM], STACK.x + (r() - 0.5) * 0.02, y + hgt / 2, STACK.z + (r() - 0.5) * 0.02);
    b.rotation.y = (r() - 0.5) * 0.16 + (i === 0 ? 0 : 0.02);
    group.add(b);
    addC("stack", b);
    y += hgt;
  });
  // ---------------------------------------------------------------- tea + mooncake
  const mug = mesh(new THREE.CylinderGeometry(0.042, 0.039, 0.095, 24), "mug");
  mug.position.set(MUG.x, DESK.top + 0.0475, MUG.z);
  const band = mesh(new THREE.CylinderGeometry(0.0425, 0.0425, 0.014, 24, 1, true), "mugBand", { cast: false });
  band.position.set(MUG.x, DESK.top + 0.07, MUG.z);
  const tea = mesh(new THREE.CylinderGeometry(0.037, 0.037, 0.003, 20), "tea", { cast: false });
  tea.position.set(MUG.x, DESK.top + 0.083, MUG.z);
  const handle = mesh(new THREE.TorusGeometry(0.024, 0.0075, 8, 14, Math.PI), "mug");
  handle.rotation.set(0, Math.PI / 2 + 0.6, -Math.PI / 2);
  handle.position.set(MUG.x - 0.036, DESK.top + 0.05, MUG.z - 0.026);
  group.add(mug, band, tea, handle);
  addC("mug", mug);
  const plate = mesh(new THREE.CylinderGeometry(0.078, 0.07, 0.012, 32), "plate");
  plate.position.set(PLATE.x, DESK.top + 0.006, PLATE.z);
  const cake = mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.03, 32), [M.get("cakeSide"), M.get("mooncakeTop"), M.get("cakeSide")]);
  cake.position.set(PLATE.x, DESK.top + 0.012 + 0.015, PLATE.z);
  group.add(plate, cake);
  addC("plate", plate);
  // steam wisps (sprites, looped deterministically)
  const steam: THREE.Sprite[] = [];
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow(), color: "#dfe6f5", transparent: true, opacity: 0, depthWrite: false }));
    s.userData.noOutline = true;
    steam.push(s);
    group.add(s);
  }
  // ---------------------------------------------------------------- dressing: shelf (−x wall), cork board (+x wall), floor plant
  const shelf = box(0.3, 1.7, 1.1, "shelf", x0 + 0.16, 0.85, -1.9);
  group.add(shelf);
  const sr = rng(5);
  for (let row = 0; row < 4; row++) {
    let z = -2.4;
    while (z < -1.42) {
      const bw = 0.03 + sr() * 0.03, bh = 0.2 + sr() * 0.1;
      const cols = ["#7c3b3b", "#34506b", "#3f6b5a", "#8a6a3a", "#5a4a6b", "#c8b48a", "#2f3f4f"];
      group.add(box(0.2, bh, bw, `cover:${cols[Math.floor(sr() * cols.length)]}`, x0 + 0.24, 0.2 + row * 0.4 + bh / 2, z + bw / 2, { cast: false }));
      z += bw + 0.004;
    }
  }
  const cork = box(0.03, 0.62, 0.9, "cover:#b58e62", x1 - 0.015, 1.55, -1.55, { cast: false });
  group.add(cork);
  const cr = rng(9);
  for (let k = 0; k < 7; k++) {
    const cols = ["#f4d468", "#f2a6a0", "#a8d8c0", "#f7efe0", "#9fc0e6"];
    const n = box(0.004, 0.09 + cr() * 0.05, 0.1 + cr() * 0.05, `cover:${cols[k % cols.length]}`, x1 - 0.034, 1.35 + cr() * 0.4, -1.9 + cr() * 0.7, { cast: false });
    n.rotation.x = (cr() - 0.5) * 0.3;
    group.add(n);
  }
  // a round paper lamp on a small shelf behind her (+x back corner): warm light from the room
  const shelf2 = box(0.34, 0.03, 0.26, "woodDark", x1 - 0.2, 1.12, -2.35);
  group.add(shelf2);
  const paperLamp = mesh(new THREE.SphereGeometry(0.11, 20, 14), "paperLamp", { cast: false, receive: false });
  paperLamp.scale.set(1, 0.92, 1);
  paperLamp.position.set(x1 - 0.2, 1.24, -2.35);
  group.add(paperLamp);
  const plg = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow(), color: new THREE.Color("#ffb46a"), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  plg.scale.setScalar(0.9);
  plg.position.copy(paperLamp.position);
  plg.userData.noOutline = true;
  group.add(plg);
  return {
    group,
    colliders,
    curtains,
    pages,
    pageRest: { right: rightB, left: leftB },
    steam,
    lampBulb: bulbPos,
    lampAim: aim,
  };
}
