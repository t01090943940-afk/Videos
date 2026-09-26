import * as THREE from "three";
import { MatLib } from "../look/moonwash";
import { indexNoOutline } from "../core/post";
import { makeSky } from "./sky";
import { buildRoom, type RoomHandles, type Collider } from "./room";
import { buildOutside, type OutsideHandles } from "./outside";
import { Girl, RELEASE, type GirlProbe } from "./girl";
import { MOON_DIR, BOOK, MUG, DESK } from "../layout";
import { HAND_FLIPS, HAND_FLIP_DUR, BREEZE_FLIPS, BREEZE_FLIP_DUR, MOON_FULL, SKY_LANTERNS, PETALS_IN, MOONBEAM } from "../timeline";
import { clamp01, smooth, smoother, win, pulse } from "../core/anim";

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export interface WorldState {
  moonBright: number;
  exposure: number;
  lift: number;
  bloom: number;
}

export class World {
  scene = new THREE.Scene();
  M = new MatLib();
  sky = makeSky();
  room: RoomHandles;
  out: OutsideHandles;
  girl: Girl;
  moon: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  spot: THREE.SpotLight;
  bounce: THREE.PointLight;
  fill: THREE.PointLight;
  spill: THREE.PointLight;
  colliders: Collider[];
  probe!: GirlProbe;

  constructor() {
    const s = this.scene;
    s.add(this.sky.dome);
    this.room = buildRoom(this.M);
    s.add(this.room.group);
    this.out = buildOutside(this.M);
    s.add(this.out.group);
    this.girl = new Girl(this.M);
    s.add(this.girl.root);
    this.girl.worldParts().forEach((p) => s.add(p));
    this.colliders = this.room.colliders;
    // ---------------------------------------------------------------- light
    const md = V(...MOON_DIR);
    this.moon = new THREE.DirectionalLight("#b3c3ff", 0.6);
    const tgt = V(0, 0.95, -0.9);
    this.moon.position.copy(tgt).add(md.clone().multiplyScalar(14));
    this.moon.target.position.copy(tgt);
    this.moon.castShadow = true;
    this.moon.shadow.mapSize.set(2048, 2048);
    const sc = this.moon.shadow.camera as THREE.OrthographicCamera;
    sc.left = -2.4;
    sc.right = 2.4;
    sc.top = 2.4;
    sc.bottom = -2.4;
    sc.near = 2;
    sc.far = 30;
    this.moon.shadow.bias = -0.0006;
    this.moon.shadow.normalBias = 0.02;
    s.add(this.moon, this.moon.target);
    this.hemi = new THREE.HemisphereLight("#3b4d8c", "#23180f", 0.6);
    s.add(this.hemi);
    this.spot = new THREE.SpotLight("#ffc98a", 0.62, 0, 0.95, 0.85, 2);
    this.spot.position.copy(this.room.lampBulb);
    this.spot.target.position.copy(this.room.lampAim);
    s.add(this.spot, this.spot.target);
    this.bounce = new THREE.PointLight("#ffb877", 0.2, 3.2, 2);
    this.bounce.position.set(0.02, 0.97, -0.6);
    s.add(this.bounce);
    // a warm glow from the room behind her, so her hair never sinks into the dark
    this.fill = new THREE.PointLight("#ffc08a", 0.5, 7, 2);
    this.fill.position.set(1.62, 1.28, -2.3);
    s.add(this.fill);
    // the lanterns' warmth spilling in through the window (grows with the lit lanterns + the ending)
    this.spill = new THREE.PointLight("#ffa060", 0, 4.5, 2);
    this.spill.position.set(0.1, 2.05, 0.7);
    this.spill.visible = false;
    s.add(this.spill);
    indexNoOutline(s);
  }

  /** pose the whole world at time t (pure function of t) */
  update(t: number, cam: THREE.Camera): WorldState {
    // moon & sky
    const full = smoother((t - MOON_FULL[0]) / (MOON_FULL[1] - MOON_FULL[0]));
    const moonBright = 0.52 + 0.48 * full;
    const u = this.sky.uniforms;
    u.uMoonBright.value = moonBright;
    u.uVeil.value = 1 - 0.9 * full;
    u.uClear.value = full;
    u.uTime.value = t;
    this.sky.dome.position.copy(cam.position);
    // "今晚换月亮照亮你": a swell of moonlight on her face when the line lands
    const swell = Math.exp(-Math.pow((t - (MOONBEAM + 0.55)) / 0.9, 2));
    this.moon.intensity = 0.75 + 1.25 * full + 0.9 * swell;
    this.hemi.intensity = 0.55 + 0.25 * full + 0.35 * win(t, 23.8, 25.4);
    this.fill.intensity = 0.5 + 0.8 * win(t, 23.6, 25.2);
    const lit = this.out.lanternLit(t) / 6;
    this.spill.intensity = 0.35 * lit + 0.9 * win(t, 23.8, 25.6);
    this.spill.visible = this.spill.intensity > 0.01;
    // world
    this.out.update(t, cam);
    this.poseCurtains(t);
    this.posePages(t);
    this.poseSteam(t);
    this.probe = this.girl.update(t);
    const end = win(t, SKY_LANTERNS, SKY_LANTERNS + 1.6);
    return {
      moonBright,
      exposure: 1.08 + 0.1 * full + 0.12 * end,
      lift: 0.25 * full + 0.6 * end,
      bloom: 0.95 + 0.25 * full + 0.2 * end,
    };
  }

  private gust(t: number) {
    return 0.22 + 0.2 * Math.sin(t * 0.7) * 0.5 + 0.9 * pulse(t, 7.8, 8.05, 8.7, 9.5) + 0.7 * pulse(t, PETALS_IN - 0.2, PETALS_IN + 0.4, 19.8, 21.2) + 0.5 * pulse(t, 23.8, 24.4, 26, 27.5);
  }

  private poseCurtains(t: number) {
    const g = this.gust(t);
    for (const c of this.room.curtains) {
      const geo = c.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const base = geo.userData.base as Float32Array;
      const side = c.userData.side as number;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1];
        const v = (y + 0.84) / 1.68; // 0 bottom … 1 rod
        const free = Math.pow(1 - v, 1.4);
        const pleat = 0.032 * Math.sin(x * 44 + side) * (0.55 + 0.45 * v);
        const sway = g * free * (0.1 * Math.sin(t * 2.2 + x * 7 + side) + 0.08);
        pos.setXYZ(i, x - side * g * free * 0.05, y, pleat - sway);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
  }

  /** leaves: rigid while her hand rides the edge, then fall with a lagging curl */
  private posePages(t: number) {
    const flips = [
      ...HAND_FLIPS.map((t0) => ({ t0, dur: HAND_FLIP_DUR, hand: true })),
      ...BREEZE_FLIPS.map((t0) => ({ t0, dur: BREEZE_FLIP_DUR, hand: false })),
    ];
    this.room.pages.forEach((m, i) => {
      const f = flips[i];
      const u = (t - f.t0) / f.dur;
      m.visible = u > 0 && u < 1;
      if (!m.visible) return;
      const theta = Math.PI * smoother(u);
      let curl: number;
      if (f.hand) curl = u < RELEASE ? 0 : -0.55 * Math.sin((Math.PI * (u - RELEASE)) / (1 - RELEASE));
      else curl = -0.75 * Math.sin(Math.PI * u);
      const geo = m.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const cols = 15; // 14 segments → 15 vertices per row
      const W = BOOK.pageW;
      for (let row = 0; row < 2; row++) {
        const z = BOOK.z + (row === 0 ? BOOK.pageD / 2 : -BOOK.pageD / 2);
        let x = BOOK.x, y = BOOK.y + 0.0015 + i * 0.0004;
        for (let c = 0; c < cols; c++) {
          const s = c / (cols - 1);
          if (c > 0) {
            const ang = theta + curl * s;
            x -= Math.cos(ang) * (W / (cols - 1));
            y += Math.sin(ang) * (W / (cols - 1));
          }
          // PlaneGeometry vertex order: rows top→bottom, columns left→right; column 0 = spine side
          pos.setXYZ(row * cols + (cols - 1 - c), x, Math.max(y, BOOK.y + 0.001), z);
        }
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    });
  }

  private poseSteam(t: number) {
    this.room.steam.forEach((s, i) => {
      const period = 2.6;
      const a = ((t + i * (period / 4)) % period) / period;
      s.position.set(MUG.x + 0.02 * Math.sin(a * 6 + i) + a * 0.02, DESK.top + 0.1 + a * 0.24, MUG.z + 0.01 * Math.cos(a * 5 + i));
      s.scale.setScalar(0.04 + a * 0.1);
      (s.material as THREE.SpriteMaterial).opacity = 0.07 * Math.sin(Math.PI * a);
    });
  }
}
