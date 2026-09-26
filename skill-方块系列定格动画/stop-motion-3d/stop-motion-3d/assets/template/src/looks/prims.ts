import * as THREE from "three";
import type { LookDef, PrimOpts, Prims, Sem } from "./types";

/** World-level registry filled while building one look's copy of the world. */
export interface BuildRegistry {
  colliders: THREE.Mesh[];
  screens: THREE.Mesh[];
}

export const EMISSIVE_KINDS = new Set(["screen", "neon", "glow", "backdrop", "sky", "tv"]);

export function parseSem(spec: string, palette: Record<string, string>): Sem {
  const [kind, arg] = spec.split(":");
  const sem: Sem = { key: spec, kind, hex: palette[kind] ?? "#ff00ff", emissive: EMISSIVE_KINDS.has(kind) };
  if (arg?.startsWith("#")) sem.hex = arg;
  else if (kind === "screen" && arg !== undefined) sem.screen = Number(arg);
  return sem;
}

/** Scale BoxGeometry-style UVs to world size so textures keep one physical density everywhere. */
function worldUV(g: THREE.BufferGeometry, w: number, h: number, d: number, unit: number) {
  const uv = g.getAttribute("uv") as THREE.BufferAttribute | undefined;
  const n = g.getAttribute("normal") as THREE.BufferAttribute | undefined;
  if (!uv || !n) return;
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let su = w, sv = h;
    if (ax >= ay && ax >= az) { su = d; sv = h; } else if (ay >= az) { su = w; sv = d; }
    uv.setXY(i, (uv.getX(i) * su) / unit, (uv.getY(i) * sv) / unit);
  }
  uv.needsUpdate = true;
}

export function makePrims(look: LookDef, palette: Record<string, string>, reg: BuildRegistry): Prims {
  const matCache = new Map<string, THREE.Material>();
  const mat = (spec: string) => {
    let m = matCache.get(spec);
    if (!m) {
      m = look.material(parseSem(spec, palette));
      matCache.set(spec, m);
    }
    return m;
  };
  const finish = (mesh: THREE.Mesh, sem: string, o: PrimOpts = {}) => {
    const s = parseSem(sem, palette);
    mesh.castShadow = o.cast ?? !s.emissive;
    mesh.receiveShadow = o.receive ?? !s.emissive;
    mesh.userData.sem = sem;
    mesh.userData.dynamic = !!o.dynamic;
    if (o.name) mesh.name = o.name;
    if (o.collider) reg.colliders.push(mesh);
    if (s.kind === "screen" || s.kind === "tv") reg.screens.push(mesh);
    return mesh;
  };
  return {
    look,
    box(w, h, d, sem, o) {
      const g = look.geometry?.box?.(w, h, d) ?? new THREE.BoxGeometry(w, h, d);
      worldUV(g, w, h, d, look.uvUnit);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    cyl(rt, rb, h, sem, o) {
      const seg = o?.seg ?? 20;
      const g = look.geometry?.cyl?.(rt, rb, h, seg) ?? new THREE.CylinderGeometry(rt, rb, h, seg);
      worldUV(g, Math.PI * 2 * Math.max(rt, rb), h, Math.PI * 2 * Math.max(rt, rb), look.uvUnit);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    sphere(r, sem, o) {
      const g = look.geometry?.sphere?.(r) ?? new THREE.SphereGeometry(r, 18, 12);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    plane(w, h, sem, o) {
      const g = new THREE.PlaneGeometry(w, h);
      return finish(new THREE.Mesh(g, mat(sem)), sem, { cast: false, ...o });
    },
  };
}
