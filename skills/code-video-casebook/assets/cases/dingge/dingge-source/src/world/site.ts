import * as THREE from 'three';
import { Builder, type AABB } from './geo';
import { buildBuilding, type BuildingParts } from './building';
import { buildProps, type PropParts } from './props';
import { buildCity } from './city';
import { buildCrane, type CraneRig } from './crane';
import { buildDaylight, type Daylight } from './sky';

// The reusable filming location. Everything a new film needs from the set is exposed here:
// dynamic parts (crane, removable rails, hoist, offcut), colliders for the clipping check, and the daylight rig.

export interface Site {
  scene: THREE.Scene;
  building: BuildingParts;
  props: PropParts;
  crane: CraneRig;
  light: Daylight;
  colliders: AABB[];
  stats: { drawables: number; triangles: number };
}

export function buildSite(renderer: THREE.WebGLRenderer, opts: { shadowRes?: number; city?: boolean } = {}): Site {
  const scene = new THREE.Scene();
  const dyn = new THREE.Group(); dyn.name = 'dynamic'; scene.add(dyn);

  const b = new Builder();
  const building = buildBuilding(b, dyn);
  const props = buildProps(b, dyn);
  const colliders = [...b.colliders];
  scene.add(b.build('site'));

  if (opts.city !== false) {
    const cb = new Builder();
    buildCity(cb);
    const city = cb.build('city');
    city.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = false; } });
    scene.add(city);
  }

  const crane = buildCrane(dyn);
  const light = buildDaylight(scene, renderer, opts.shadowRes ?? 4096);

  let drawables = 0, triangles = 0;
  scene.traverse(o => {
    const m = o as THREE.Mesh;
    if (m.isMesh) { drawables++; const g = m.geometry; triangles += (g.index ? g.index.count : g.getAttribute('position')?.count ?? 0) / 3; }
  });
  return { scene, building, props, crane, light, colliders, stats: { drawables, triangles: Math.round(triangles) } };
}
