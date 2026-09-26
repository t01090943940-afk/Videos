import * as THREE from "three";
import type { Prims } from "../looks/types";
import { rng } from "../runtime/rng";

/**
 * PROP LIBRARY — reusable set pieces. Each builder returns a group plus named ANCHORS
 * (contact points for IK, homes for holdable props). Props are written in meters, semantic
 * materials only, and never know which look draws them.
 */
export interface PropBuild {
  root: THREE.Group;
  anchors: Record<string, THREE.Object3D>;
  /** holdable props: the object + its home anchor (where it rests when not in a hand) */
  holdables?: Record<string, THREE.Object3D>;
  /** state-driven parts (plant leaves, key caps, lights) */
  parts?: Record<string, THREE.Object3D>;
}

type Build = (P: Prims, params: Record<string, any>) => PropBuild;

function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent?: THREE.Object3D): T {
  o.position.set(x, y, z);
  parent?.add(o);
  return o;
}
function anchor(parent: THREE.Object3D, x: number, y: number, z: number, name: string) {
  const a = new THREE.Object3D();
  a.name = name;
  return at(a, x, y, z, parent);
}

export const DESK_H = 0.75;

const desk: Build = (P, { w = 1.6, d = 0.8 }) => {
  const g = new THREE.Group();
  at(P.box(w, 0.04, d, "wood", { collider: true, name: "desktop" }), 0, DESK_H - 0.02, 0, g);
  for (const sx of [-1, 1]) {
    at(P.box(0.05, DESK_H - 0.04, 0.05, "metalDark"), sx * (w / 2 - 0.06), (DESK_H - 0.04) / 2, -d / 2 + 0.06, g);
    at(P.box(0.05, DESK_H - 0.04, 0.05, "metalDark"), sx * (w / 2 - 0.06), (DESK_H - 0.04) / 2, d / 2 - 0.06, g);
    at(P.box(0.04, 0.04, d - 0.12, "metalDark"), sx * (w / 2 - 0.06), 0.12, 0, g);
  }
  at(P.box(w - 0.14, 0.32, 0.02, "metalDark"), 0, DESK_H - 0.26, d / 2 - 0.06, g); // modesty panel (far side)
  return { root: g, anchors: { top: anchor(g, 0, DESK_H, 0, "top") } };
};

const chair: Build = (P, { color = "#3d4b5e", seat = 0.46 }) => {
  const g = new THREE.Group();
  const fab = `fabric:${color}`;
  at(P.box(0.48, 0.07, 0.46, fab, { collider: true, name: "seat" }), 0, seat - 0.035, 0, g);
  at(P.box(0.46, 0.52, 0.06, fab), 0, seat + 0.32, -0.25, g).rotation.x = -0.08;
  at(P.box(0.06, 0.2, 0.05, "metalDark"), 0, seat + 0.04, -0.23, g);
  at(P.cyl(0.03, 0.03, seat - 0.12, "metalDark"), 0, (seat - 0.12) / 2 + 0.06, 0, g);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = at(P.box(0.04, 0.035, 0.3, "metalDark"), Math.sin(a) * 0.14, 0.07, Math.cos(a) * 0.14, g);
    leg.rotation.y = a;
    at(P.cyl(0.028, 0.028, 0.035, "rubber", { seg: 10 }), Math.sin(a) * 0.28, 0.02, Math.cos(a) * 0.28, g);
  }
  return { root: g, anchors: { seat: anchor(g, 0, seat, 0, "seat") } };
};

/** monitor facing −Z (toward the actor sitting on the −Z side) */
const monitor: Build = (P, { screen = 0, w = 0.62, h = 0.36 }) => {
  const g = new THREE.Group();
  at(P.box(0.24, 0.02, 0.18, "plasticDark"), 0, DESK_H + 0.01, 0.05, g);
  at(P.box(0.05, 0.26, 0.04, "plasticDark"), 0, DESK_H + 0.14, 0.08, g);
  const y = DESK_H + 0.2 + h / 2;
  at(P.box(w + 0.03, h + 0.03, 0.035, "plasticDark", { collider: true, name: "monitor" }), 0, y, 0.04, g);
  const scr = at(P.plane(w, h, `screen:${screen}`, { dynamic: true }), 0, y, 0.04 - 0.019, g);
  scr.rotation.y = Math.PI;
  return { root: g, anchors: { screen: anchor(g, 0, y, 0.0, "screen") }, parts: { screen: scr } };
};

const keyboard: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.4, 0.018, 0.14, "plasticLight", { collider: true, name: "keyboard" }), 0, DESK_H + 0.009, 0, g);
  const keys = new THREE.Group();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
    if (r === 1 && c === 11) continue;
    at(P.box(0.024, 0.008, 0.024, "plasticDark"), -0.165 + c * 0.03, DESK_H + 0.022, -0.045 + r * 0.03, keys);
  }
  const enter = at(P.box(0.024, 0.008, 0.054, "accent", { dynamic: true }), -0.165 + 11 * 0.03, DESK_H + 0.022, -0.045 + 1.5 * 0.03, g);
  g.add(keys);
  return {
    root: g,
    anchors: { keyboard: anchor(g, 0, DESK_H + 0.026, 0, "keyboard"), enter: anchor(g, enter.position.x, DESK_H + 0.026, enter.position.z, "enter") },
    parts: { enter },
  };
};

const mouse: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.24, 0.004, 0.2, "fabric:#2c3440"), 0, DESK_H + 0.002, 0, g);
  at(P.box(0.06, 0.03, 0.1, "plasticLight"), 0, DESK_H + 0.019, 0, g);
  return { root: g, anchors: { mouse: anchor(g, 0, DESK_H + 0.034, 0.01, "mouse") } };
};

const mug: Build = (P, { color = "#e0663f", holdable = false }) => {
  const g = new THREE.Group();
  at(P.cyl(0.055, 0.055, 0.006, "cork", { seg: 16 }), 0, DESK_H + 0.003, 0, g); // coaster
  const home = anchor(g, 0, DESK_H + 0.006, 0, "mug_home");
  const m = new THREE.Group();
  at(P.cyl(0.036, 0.032, 0.09, `ceramic:${color}`, { seg: 16, dynamic: holdable }), 0, 0.045, 0, m);
  at(P.box(0.012, 0.05, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.045, 0.05, 0, m);
  at(P.box(0.02, 0.01, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.038, 0.074, 0, m);
  at(P.box(0.02, 0.01, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.038, 0.026, 0, m);
  at(P.cyl(0.03, 0.03, 0.004, "soil", { seg: 12, dynamic: holdable }), 0, 0.085, 0, m); // coffee
  home.add(m);
  return { root: g, anchors: { mug_home: home, mug_grip: anchor(g, -0.05, DESK_H + 0.05, 0, "mug_grip") }, holdables: holdable ? { mug: m } : undefined };
};

const lamp: Build = (P, { night = false }) => {
  const g = new THREE.Group();
  at(P.cyl(0.07, 0.08, 0.02, "metalDark"), 0, DESK_H + 0.01, 0, g);
  const a1 = at(P.box(0.02, 0.36, 0.02, "metalDark"), 0, DESK_H + 0.19, 0.03, g);
  a1.rotation.x = 0.25;
  const a2 = at(P.box(0.02, 0.3, 0.02, "metalDark"), 0, DESK_H + 0.4, 0.16, g);
  a2.rotation.x = 1.25;
  const head = at(P.cyl(0.03, 0.075, 0.1, "accent", { seg: 16 }), 0, DESK_H + 0.4, 0.28, g);
  head.rotation.x = 0.5;
  at(P.sphere(0.028, "glow", { cast: false }), 0, DESK_H + 0.36, 0.3, g);
  const light = new THREE.PointLight("#ffcf8a", night ? 1.4 : 0.25, 2.2, 1.6);
  at(light, 0, DESK_H + 0.3, 0.3, g);
  return { root: g, anchors: {}, parts: { light } };
};

const plant: Build = (P, { size = 1, seed = 3 }) => {
  const g = new THREE.Group();
  const s = size;
  at(P.cyl(0.07 * s, 0.055 * s, 0.11 * s, "terracotta", { seg: 14 }), 0, 0.055 * s, 0, g);
  at(P.cyl(0.062 * s, 0.062 * s, 0.01, "soil", { seg: 14 }), 0, 0.105 * s, 0, g);
  const leaves = new THREE.Group();
  leaves.position.y = 0.11 * s;
  const r = rng(seed);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + r();
    const stem = new THREE.Group();
    stem.rotation.set(0.35 + r() * 0.35, a, 0);
    const leaf = at(P.box(0.05 * s, 0.14 * s, 0.012 * s, i % 2 ? "plant" : "plantDark", { dynamic: true }), 0, 0.07 * s, 0, stem);
    leaf.rotation.z = (r() - 0.5) * 0.3;
    leaves.add(stem);
  }
  g.add(leaves);
  return { root: g, anchors: { plant: anchor(g, 0, 0.3 * s, 0, "plant") }, parts: { leaves } };
};

const cubeToy: Build = (P) => {
  const g = new THREE.Group();
  const cols = ["#e0663f", "#f2c14e", "#3f9ad6", "#57b36a", "#f2f2ee", "#c0463a"];
  const r = rng(7);
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++)
    at(P.box(0.022, 0.022, 0.022, `plasticLight:${cols[Math.floor(r() * 6)]}`), (x - 1) * 0.024, DESK_H + 0.012 + y * 0.024, (z - 1) * 0.024, g);
  g.rotation.y = 0.5;
  return { root: g, anchors: {} };
};

const paperStack: Build = (P, { holdable = false }) => {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) at(P.box(0.21, 0.004, 0.29, "paper"), (i % 2) * 0.006, DESK_H + 0.002 + i * 0.004, 0, g).rotation.y = (i - 3) * 0.02;
  const home = anchor(g, 0, DESK_H + 0.03, 0, "sheet_home");
  const sheet = new THREE.Group();
  // the held sheet: a printed collage page (poster colors) — hangs from the grip at its top edge
  const page = at(P.box(0.21, 0.29, 0.004, "paper", { dynamic: true }), 0, -0.13, 0.01, sheet);
  at(P.box(0.15, 0.08, 0.002, "accent", { dynamic: true }), 0, -0.07, 0.014, sheet);
  at(P.box(0.08, 0.1, 0.002, "neon:#27e3ff", { dynamic: true }), -0.04, -0.19, 0.014, sheet);
  at(P.box(0.06, 0.06, 0.002, "cloth:#f2c14e", { dynamic: true }), 0.05, -0.2, 0.014, sheet);
  page.userData.sheet = true;
  sheet.rotation.x = -Math.PI / 2; // lying flat at home
  home.add(sheet);
  return { root: g, anchors: { sheet_home: home, stack: anchor(g, 0, DESK_H + 0.03, 0, "stack") }, holdables: holdable ? { sheet } : undefined };
};

const tablet: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.36, 0.014, 0.24, "plasticDark", { collider: true, name: "tablet" }), 0, DESK_H + 0.007, 0, g);
  at(P.box(0.3, 0.002, 0.18, "paper"), 0, DESK_H + 0.015, 0, g);
  // a few "drawn" strokes on the tablet
  for (let i = 0; i < 4; i++) at(P.box(0.12 - i * 0.02, 0.001, 0.006, "eyes"), -0.03 + i * 0.01, DESK_H + 0.017, -0.05 + i * 0.03, g);
  const stylus = new THREE.Group();
  const pen = at(P.cyl(0.006, 0.006, 0.15, "plasticDark", { seg: 8, dynamic: true }), 0, -0.02, 0.02, stylus);
  pen.rotation.x = 0.9;
  return { root: g, anchors: { tablet: anchor(g, 0, DESK_H + 0.016, 0, "tablet") }, holdables: { stylus } };
};

const wateringCan: Build = (P) => {
  const g = new THREE.Group();
  const home = anchor(g, 0, DESK_H, 0, "can_home");
  const can = new THREE.Group();
  // held by the top handle: body hangs below the grip
  at(P.cyl(0.05, 0.055, 0.1, "metal:#6aa6c9", { seg: 16, dynamic: true }), 0, -0.1, 0, can);
  at(P.box(0.012, 0.06, 0.012, "metal:#6aa6c9", { dynamic: true }), 0, -0.025, -0.03, can);
  at(P.box(0.012, 0.012, 0.07, "metal:#6aa6c9", { dynamic: true }), 0, 0.0, 0.0, can);
  const spout = at(P.cyl(0.008, 0.012, 0.14, "metal:#6aa6c9", { seg: 8, dynamic: true }), 0, -0.08, 0.09, can);
  spout.rotation.x = 1.0;
  can.position.y = 0.155; // rests on the desk
  home.add(can);
  const spoutTip = anchor(can, 0, -0.04, 0.15, "spout");
  return { root: g, anchors: { can_home: home, spout: spoutTip }, holdables: { can } };
};

const neonSign: Build = (P, { color = "#ff3fa4", color2 = "#27e3ff" }) => {
  const g = new THREE.Group();
  at(P.box(0.34, 0.02, 0.08, "plasticDark"), 0, DESK_H + 0.01, 0, g);
  // "</>" in tubes
  const tube = (w: number, h: number, x: number, y: number, rz: number, c: string) => {
    const m = at(P.box(w, h, 0.015, `neon:${c}`, { cast: false }), x, DESK_H + 0.13 + y, 0, g);
    m.rotation.z = rz;
  };
  tube(0.018, 0.1, -0.09, 0.03, 0.7, color);
  tube(0.018, 0.1, -0.09, -0.03, -0.7, color);
  tube(0.018, 0.22, 0, 0, -0.35, color2);
  tube(0.018, 0.1, 0.09, 0.03, -0.7, color);
  tube(0.018, 0.1, 0.09, -0.03, 0.7, color);
  const light = new THREE.PointLight(color, 0, 2.5, 1.5);
  at(light, 0, DESK_H + 0.15, -0.1, g);
  return { root: g, anchors: {}, parts: { light } };
};

const can: Build = (P, { color = "#27e3ff" }) => {
  const g = new THREE.Group();
  at(P.cyl(0.03, 0.03, 0.12, `metal:${color}`, { seg: 14 }), 0, DESK_H + 0.06, 0, g);
  return { root: g, anchors: {} };
};

const speaker: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.1, 0.16, 0.1, "plasticDark"), 0, DESK_H + 0.08, 0, g);
  at(P.cyl(0.03, 0.03, 0.01, "metal", { seg: 12 }), 0, DESK_H + 0.1, -0.052, g).rotation.x = Math.PI / 2;
  return { root: g, anchors: {} };
};

const brushJar: Build = (P) => {
  const g = new THREE.Group();
  at(P.cyl(0.04, 0.035, 0.1, "glass", { seg: 14 }), 0, DESK_H + 0.05, 0, g).userData.noOutline = true;
  const r = rng(11);
  for (let i = 0; i < 4; i++) {
    const b = at(P.cyl(0.004, 0.004, 0.18, i % 2 ? "wood" : "accent", { seg: 6 }), (r() - 0.5) * 0.03, DESK_H + 0.12, (r() - 0.5) * 0.03, g);
    b.rotation.set((r() - 0.5) * 0.4, 0, (r() - 0.5) * 0.4);
  }
  return { root: g, anchors: {} };
};

const stickyNotes: Build = (P, { colors = ["#f2c14e", "#ff8fb1"] }) => {
  const g = new THREE.Group();
  (colors as string[]).forEach((c, i) => at(P.box(0.06, 0.06, 0.002, `paper:${c}`), i * 0.07, 0, 0, g).rotation.z = (i - 0.5) * 0.15);
  return { root: g, anchors: {} };
};

export const PROPS: Record<string, Build> = {
  desk, chair, monitor, keyboard, mouse, mug, lamp, plant, cubeToy, paperStack, tablet, wateringCan, neonSign, can, speaker, brushJar, stickyNotes,
};
