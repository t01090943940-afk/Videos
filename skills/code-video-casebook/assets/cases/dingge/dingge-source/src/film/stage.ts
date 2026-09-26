import * as THREE from 'three';
import type { Site } from '../world/site';
import { L } from '../world/layout';
import { Puppet, STYLES, type JointRot, type PuppetStyle } from '../characters/rig';
import { Actor, Lanyard, type PerformanceDef } from '../characters/actor';
import { addRot } from '../characters/poses';
import { DEG, sampleKeys, smooth, invLerp, clamp, mulberry32, lerp, type Key } from '../core/math';
import { materials } from '../materials/library';

// The Stage owns every moving thing on the set and evaluates a TAKE (a continuous performance) at world time T.
// Shots never animate anything themselves: they only pick a window of a take and a camera. That is how real
// coverage works, and it is why cut-on-action and match cuts line up for free.

export type TakeName = 'bad' | 'good';

export const T_FREEZE = 12.3;      // the frame the film stops on
export const T_SLIP = 11.4;
const Y = L.standY;
const FACE_NORTH = Math.PI, FACE_EAST = Math.PI / 2, FACE_WEST = -Math.PI / 2;
const RING = new THREE.Vector3(5.2, L.standY + L.lifeH - 0.035, L.lifeZ);

interface TakeState { zhou: PerformanceDef; li: PerformanceDef; lin: PerformanceDef }

export class Stage {
  site: Site;
  zhou: Actor; li: Actor; lin: Actor;
  bg: { actor: Actor; period: number; t0: number }[] = [];
  lanyard = new Lanyard(2.0);
  landedLoad: THREE.Object3D;
  defs: Record<TakeName, TakeState>;
  helmetHome = new THREE.Matrix4();
  helmetDetach: THREE.Matrix4 | null = null;
  offcutHome = new THREE.Vector3();
  caughtTilt = -10 * DEG;
  take: TakeName = 'bad';
  private tmp = new THREE.Vector3();

  constructor(site: Site) {
    this.site = site;
    const dyn = site.scene.getObjectByName('dynamic')!;
    const zp = new Puppet(STYLES.zhou), lp = new Puppet(STYLES.li), sp = new Puppet(STYLES.lin);
    dyn.add(zp.root, lp.root, sp.root);
    this.lanyard.addTo(dyn);
    this.defs = { bad: this.badTake(), good: this.goodTake() };
    this.zhou = new Actor(zp, this.defs.bad.zhou);
    this.li = new Actor(lp, this.defs.bad.li);
    this.lin = new Actor(sp, this.defs.bad.lin);
    this.helmetHome.copy(zp.helmet.matrix);

    // offcut sits exactly under 老周's right heel at the moment of the slip (solved, not hand-placed)
    this.zhou.evaluate(T_SLIP - 0.02);
    zp.samplePts[zp.sampleNames.indexOf('heelR')].getWorldPosition(this.offcutHome);
    this.offcutHome.set(this.offcutHome.x, Y + 0.011, this.offcutHome.z + 0.02);

    // contact solve: how far can he tip back before his back meets the top rail? (bisection on tilt)
    this.zhou.setDef(this.defs.good.zhou);
    this.caughtTilt = this.solveCaughtTilt();
    this.defs.good = this.goodTake();
    this.zhou.setDef(this.defs.bad.zhou);

    // the bundle left on the sleepers after the crane unhooks
    this.landedLoad = site.crane.loadGroup.clone();
    this.landedLoad.position.set(L.landX, Y + 0.1 + 0.0125, L.landZ);
    this.landedLoad.visible = false;
    dyn.add(this.landedLoad);

    this.buildBackground(dyn);
    site.light.refreshEnv();
  }

  // ------------------------------------------------------------------ takes
  private zhouCommon(): Partial<PerformanceDef> {
    return {
      floorY: Y, blinkSeed: 2,
      overlay: undefined,
    };
  }

  private badTake(): TakeState {
    const tie = (t: number, rot: JointRot) => {
      if (t < 3.0) { const w = 1 - smooth(invLerp(2.7, 3.0, t)); addRot(rot, { forearmR: [0, 38 * Math.sin(t * 2 * Math.PI * 2.4), 0], handR: [12 * Math.sin(t * 2 * Math.PI * 2.4 + 1), 0, 0] }, w); }
    };
    const signal = (t: number, rot: JointRot) => {
      if (t > 8.4 && t < 11.5) addRot(rot, { handR: [0, 28 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0], forearmR: [-6 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0, 0] }, smooth(invLerp(8.4, 8.8, t)) * (1 - smooth(invLerp(11.3, 11.5, t))));
    };
    const zhou: PerformanceDef = {
      ...this.zhouCommon(), floorY: Y,
      path: [{ t: -30, v: [5.2, 4.95] }, { t: 8.5, v: [5.2, 4.95] }, { t: 11.4, v: [5.25, 6.4], e: 'inOutSine' }, { t: 11.75, v: [5.27, 6.52], e: 'outQuad' }, { t: 12.3, v: [5.3, 6.78], e: 'inQuad' }],
      yaw: [{ t: -30, v: FACE_EAST }, { t: 4.2, v: FACE_EAST }, { t: 5.1, v: FACE_NORTH }],
      poses: [
        { t: -30, pose: 'crouchTie' }, { t: 3.0, pose: 'crouchTie' }, { t: 3.35, pose: { ...POSE_ANTIC } , e: 'inOutQuad' }, { t: 4.2, pose: 'stand' },
        { t: 5.0, pose: 'lookUp' }, { t: 6.0, pose: 'lookUp' }, { t: 6.6, pose: 'reachUpR' }, { t: 6.9, pose: 'reachUpR' },
        { t: 7.6, pose: 'reachUpRNear' }, { t: 8.3, pose: 'lookUp' }, { t: 8.9, pose: 'signalDown' }, { t: 11.35, pose: 'signalDown' },
        { t: 11.6, pose: 'stumble', e: 'outQuad' }, { t: 12.3, pose: 'fallBack', e: 'inOutQuad' },
      ],
      walks: [{ t0: 8.55, t1: 11.3, back: true, arms: false }],
      overlay: (t, rot) => { tie(t, rot); signal(t, rot); slipLeg(t, rot, 1); },
      snap: [{ t: -30, v: 1 }, { t: 11.62, v: 1 }, { t: 11.7, v: 0 }],
      pivot: [-0.095, 0.02, -0.34],
      tilt: [{ t: -30, v: 0 }, { t: 11.66, v: 0 }, { t: 12.3, v: -74 * DEG, e: 'inQuad' }],
      lift: [{ t: -30, v: 0 }, { t: 11.7, v: 0 }, { t: 12.3, v: 0.12, e: 'outQuad' }],
      chin: () => false,
    };
    const li: PerformanceDef = {
      floorY: Y, blinkSeed: 5,
      path: [{ t: -30, v: [5.0, 6.33] }, { t: 1.5, v: [5.0, 6.33] }, { t: 2.8, v: [4.1, 6.28] }, { t: 3.6, v: [4.1, 6.28] }, { t: 4.3, v: [3.7, 5.8], e: 'linear' }, { t: 8.5, v: [-1.8, 6.0], e: 'linear' }],
      yaw: [{ t: -30, v: 0 }, { t: 1.4, v: 0 }, { t: 2.2, v: FACE_WEST }, { t: 3.3, v: FACE_WEST }],
      poses: [
        { t: -30, pose: 'stand' }, { t: 0.2, pose: 'stand' }, { t: 0.85, pose: 'liftLow' }, { t: 1.0, pose: 'liftLow' }, { t: 1.55, pose: 'carry' },
        { t: 2.8, pose: 'carry' }, { t: 3.2, pose: 'pushRail' }, { t: 3.5, pose: 'pushRail' }, { t: 3.9, pose: 'standRelaxed' },
      ],
      walks: [{ t0: 1.55, t1: 2.8, arms: false }, { t0: 3.6, t1: 8.5 }],
      chin: () => true,
    };
    const lin: PerformanceDef = { floorY: 0.06, path: [{ t: -30, v: [-24, 20.4] }, { t: 30, v: [-24, 20.4] }], yaw: [{ t: -30, v: 0.3 }], poses: [{ t: -30, pose: 'handsOnHips' }], blinkSeed: 7 };
    return { zhou, li, lin };
  }

  private goodTake(): TakeState {
    const bad = this.badTake();
    const tug = (t: number, rot: JointRot) => {
      if (t > 6.8 && t < 7.7) { const k = Math.max(0, Math.sin((t - 6.8) / 0.45 * Math.PI * 2)); addRot(rot, { upperArmR: [14 * k, 0, 0], forearmR: [-10 * k, 0, 0] }); }
    };
    const signal = (t: number, rot: JointRot) => {
      if (t > 8.4 && t < 11.5) addRot(rot, { handR: [0, 28 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0], forearmR: [-6 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0, 0] }, smooth(invLerp(8.4, 8.8, t)) * (1 - smooth(invLerp(11.3, 11.5, t))));
    };
    const tie = (t: number, rot: JointRot) => {
      if (t < 3.0) { const w = 1 - smooth(invLerp(2.7, 3.0, t)); addRot(rot, { forearmR: [0, 38 * Math.sin(t * 2 * Math.PI * 2.4), 0], handR: [12 * Math.sin(t * 2 * Math.PI * 2.4 + 1), 0, 0] }, w); }
    };
    const ct = this.caughtTilt;
    const zhou: PerformanceDef = {
      ...bad.zhou,
      path: [{ t: -30, v: [5.2, 4.95] }, { t: 8.5, v: [5.2, 4.95] }, { t: 11.4, v: [5.25, 6.4], e: 'inOutSine' }, { t: 11.62, v: [5.26, 6.57], e: 'outQuad' }, { t: 12.8, v: [5.26, 6.57] }, { t: 13.8, v: [5.24, 6.3] }],
      pivot: [-0.095, 0.02, -0.23],
      poses: [
        { t: -30, pose: 'crouchTie' }, { t: 3.0, pose: 'crouchTie' }, { t: 3.35, pose: { ...POSE_ANTIC }, e: 'inOutQuad' }, { t: 4.2, pose: 'stand' },
        { t: 4.6, pose: 'buckleChin' }, { t: 5.2, pose: 'buckleChin' }, { t: 5.7, pose: 'lookUp' }, { t: 6.0, pose: 'lookUp' },
        { t: 6.6, pose: 'reachUpR' }, { t: 7.7, pose: 'reachUpR' }, { t: 8.3, pose: 'lookUp' }, { t: 8.9, pose: 'signalDown' }, { t: 11.35, pose: 'signalDown' },
        { t: 11.55, pose: 'stumble', e: 'outQuad' }, { t: 11.85, pose: 'caught', e: 'outQuad' }, { t: 12.9, pose: 'caught' }, { t: 13.6, pose: 'exhale' },
        { t: 14.4, pose: 'exhale' }, { t: 15.2, pose: 'lookUp' },
      ],
      walks: [{ t0: 8.55, t1: 11.3, back: true, arms: false }, { t0: 12.9, t1: 13.8 }],
      overlay: (t, rot) => { tie(t, rot); tug(t, rot); signal(t, rot); slipLeg(t, rot, 0.55); },
      snap: [{ t: -30, v: 1 }, { t: 11.5, v: 1 }, { t: 11.56, v: 0 }, { t: 12.8, v: 0 }, { t: 13.0, v: 1 }],
      tilt: [{ t: -30, v: 0 }, { t: 11.5, v: 0 }, { t: 11.66, v: ct, e: 'inQuad' }, { t: 11.74, v: ct * 0.8, e: 'outQuad' }, { t: 11.84, v: ct, e: 'inQuad' }, { t: 12.8, v: ct }, { t: 13.0, v: 0 }],
      lift: undefined,
      chin: t => t > 5.0,
    };
    const li: PerformanceDef = {
      floorY: Y, blinkSeed: 5,
      path: [{ t: -30, v: [2.6, 5.9] }, { t: 0.0, v: [2.6, 5.9] }, { t: 1.0, v: [5.0, 6.36], e: 'inOutSine' }, { t: 3.0, v: [5.0, 6.36] }, { t: 3.8, v: [4.3, 5.8], e: 'linear' }, { t: 8.0, v: [-1.8, 6.0], e: 'linear' }],
      yaw: [{ t: -30, v: FACE_EAST }, { t: 0.7, v: FACE_EAST }, { t: 1.1, v: 0 }, { t: 2.9, v: 0 }, { t: 3.4, v: FACE_WEST }],
      poses: [{ t: -30, pose: 'stand' }, { t: 1.0, pose: 'stand' }, { t: 1.4, pose: 'pushRail' }, { t: 2.5, pose: 'pushRail' }, { t: 3.0, pose: 'standRelaxed' }],
      walks: [{ t0: 0.0, t1: 1.0 }, { t0: 3.1, t1: 8.0 }],
      overlay: (t, rot) => {
        if (t > 1.6 && t < 2.3) addRot(rot, { spine: [6 * Math.sin((t - 1.6) / 0.35 * Math.PI), 0, 0] });   // shove the rail twice: it holds
        if (t > 2.4 && t < 2.9) addRot(rot, { head: [14 * Math.sin((t - 2.4) / 0.25 * Math.PI), 0, 0] });  // nod
      },
      chin: () => true,
    };
    const lin: PerformanceDef = {
      floorY: Y, blinkSeed: 7,
      path: [{ t: -30, v: [8.9, 3.7] }, { t: 30, v: [8.9, 3.7] }],
      yaw: [{ t: -30, v: FACE_WEST + 0.35 }],
      poses: [{ t: -30, pose: 'handsOnHips' }, { t: 14.3, pose: 'handsOnHips' }, { t: 14.9, pose: 'thumbsUp', e: 'outBack' }, { t: 16.6, pose: 'thumbsUp' }, { t: 17.2, pose: 'handsOnHips' }],
      chin: () => true,
    };
    return { zhou, li, lin };
  }

  private solveCaughtTilt(): number {
    const P = this.zhou.puppet;
    const back = ['chestB', 'pelvisB'].map(n => P.samplePts[P.sampleNames.indexOf(n)]);
    const limitZ = L.railZ - 0.024 - 0.005;
    const d = this.zhou.def;
    const test = (th: number) => {
      d.tilt = [{ t: -30, v: th }];
      this.zhou.evaluate(11.62);
      return Math.max(...back.map(o => o.getWorldPosition(this.tmp).z));
    };
    let lo = 0, hi = -40 * DEG;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (test(mid) < limitZ) lo = mid; else hi = mid; }
    return lo;
  }

  // ------------------------------------------------------------------ background crew (looping, deterministic)
  private buildBackground(dyn: THREE.Object3D) {
    const r = mulberry32(3);
    const gen = (i: number): PuppetStyle => ({
      name: 'bg' + i, helmet: [0xf5c400, 0xf5c400, 0xf5c400, 0x1e88e5, 0xffffff][i % 5], shirt: [0x3d5a80, 0x5d6d4e, 0x8d6e63, 0x455a64, 0x6d4c41][i % 5],
      pants: [0x2b3345, 0x37474f, 0x3e2723][i % 3], vest: [0xff6d00, 0xc6ff00][i % 2], face: 'generic', seed: 40 + i, scale: 0.96 + r() * 0.08, harness: i % 2 === 0,
    });
    const G = 0.06;
    const loops: { style: PuppetStyle; def: PerformanceDef; period: number }[] = [];
    // two walkers along the haul road, one carrying a bucket-like load
    const walkLoop = (x0: number, z0: number, x1: number, z1: number, speed: number, carry: boolean, t0: number) => {
      const len = Math.hypot(x1 - x0, z1 - z0), dur = len / speed, turn = 1.0;
      const yawA = Math.atan2(x1 - x0, z1 - z0), yawB = yawA + Math.PI;
      return {
        period: 2 * (dur + turn),
        def: {
          floorY: G, path: [{ t: t0, v: [x0, z0] }, { t: t0 + dur, v: [x1, z1], e: 'linear' as const }, { t: t0 + dur + turn, v: [x1, z1] }, { t: t0 + 2 * dur + turn, v: [x0, z0], e: 'linear' as const }, { t: t0 + 2 * dur + 2 * turn, v: [x0, z0] }],
          yaw: [{ t: t0, v: yawA }, { t: t0 + dur, v: yawA }, { t: t0 + dur + turn, v: yawB }, { t: t0 + 2 * dur + turn, v: yawB }, { t: t0 + 2 * dur + 2 * turn, v: yawA + Math.PI * 2 }],
          poses: [{ t: t0, pose: carry ? 'carry' as const : 'stand' as const }],
          walks: [{ t0: t0, t1: t0 + dur, arms: !carry }, { t0: t0 + dur + turn, t1: t0 + 2 * dur + turn, arms: !carry }],
        } as PerformanceDef,
      };
    };
    const add = (i: number, l: { period: number; def: PerformanceDef }) => loops.push({ style: gen(i), ...l });
    add(0, walkLoop(-24, 12, 18, 12.5, 1.15, false, -40));
    add(1, walkLoop(16, 13.6, -22, 13.2, 1.05, true, -40));
    add(2, walkLoop(-23.5, -18, -23.5, 8, 1.2, false, -40));
    add(3, walkLoop(-30, -24, -20, -24, 0.9, true, -40));
    // crouched rebar fixers on the far side of the deck
    const fixer = (x: number, z: number, yaw: number, ph: number): { period: number; def: PerformanceDef } => ({
      period: 4, def: { floorY: Y, path: [{ t: 0, v: [x, z] }, { t: 4, v: [x, z] }], yaw: [{ t: 0, v: yaw }], poses: [{ t: 0, pose: 'crouchTie' }], overlay: (t, rot) => addRot(rot, { forearmR: [0, 36 * Math.sin((t + ph) * 2 * Math.PI * 2.2), 0] }) },
    });
    add(4, fixer(-8.2, -3.1, 0.4, 0.3));
    add(5, fixer(-11.5, 2.4, -2.2, 0.8));
    add(6, fixer(-5.2, 3.6, 2.6, 0.5));
    // brick handlers at the pallets, hammering at the rebar shed
    const bender = (x: number, z: number, yaw: number, ph: number, floor = G): { period: number; def: PerformanceDef } => ({
      period: 3.2, def: { floorY: floor, path: [{ t: 0, v: [x, z] }, { t: 3.2, v: [x, z] }], yaw: [{ t: 0, v: yaw }], poses: [{ t: 0, pose: 'stand' }, { t: 0.8 + ph, pose: 'liftLow' }, { t: 1.4 + ph, pose: 'liftLow' }, { t: 2.2 + ph, pose: 'carry' }, { t: 3.2, pose: 'stand' }] },
    });
    add(7, bender(-9.5, 19.6, Math.PI, 0.0));
    add(8, bender(-6.4, 19.7, Math.PI + 0.3, 0.3));
    add(9, { period: 1.2, def: { floorY: G, path: [{ t: 0, v: [-33.5, -32.8] }, { t: 1.2, v: [-33.5, -32.8] }], yaw: [{ t: 0, v: Math.PI }], poses: [{ t: 0, pose: 'hammer' }], overlay: (t, rot) => addRot(rot, { upperArmR: [40 * Math.max(0, Math.sin(t * 2 * Math.PI / 1.2)), 0, 0], forearmR: [30 * Math.max(0, Math.sin(t * 2 * Math.PI / 1.2)), 0, 0] }) } });
    for (const l of loops) {
      const p = new Puppet(l.style); dyn.add(p.root);
      this.bg.push({ actor: new Actor(p, l.def), period: l.period, t0: l.def.path[0].t });
    }
  }

  // ------------------------------------------------------------------ evaluate
  apply(take: TakeName, T: number, frame = 0, boil = 0) {
    if (take !== this.take) {
      this.take = take;
      this.zhou.setDef(this.defs[take].zhou); this.li.setDef(this.defs[take].li); this.lin.setDef(this.defs[take].lin);
    }
    const s = this.site, P = this.zhou.puppet;
    this.zhou.evaluate(T, boil, frame);
    this.li.evaluate(T, boil, frame + 101);
    this.lin.evaluate(T, boil, frame + 202);
    for (const b of this.bg) b.actor.evaluate(b.t0 + (((T - b.t0) % b.period) + b.period) % b.period, boil * 0.6, frame + 303);

    // ---- crane: slew from yard to landing, lower, unhook, raise
    const yard = s.crane.aim(-30, -26), land = s.crane.aim(L.landX, L.landZ);
    const hookLand = Y + 0.1 + 0.0125 + 3.22;
    const slewK: Key<number>[] = [{ t: -40, v: yard.slew + 0.3 }, { t: -16, v: yard.slew }, { t: -1, v: land.slew, e: 'inOutSine' }];
    const trolK: Key<number>[] = [{ t: -40, v: yard.radius }, { t: -12, v: yard.radius }, { t: 2.5, v: land.radius, e: 'inOutSine' }];
    const hookK: Key<number>[] = [{ t: -40, v: 4 }, { t: -24, v: 4 }, { t: -16, v: 27, e: 'inOutSine' }, { t: 4.5, v: 27 }, { t: 12.8, v: hookLand + 0.5, e: 'inOutSine' }, { t: 14.5, v: hookLand, e: 'outQuad' }, { t: 16.6, v: hookLand - 0.25 }, { t: 17.2, v: hookLand + 0.6 }, { t: 24, v: 26, e: 'inOutSine' }];
    const swing = 0.12 * Math.sin(T * 0.9) * (1 - smooth(invLerp(10, 14.5, T)));
    const attached = T < 16.8;
    s.crane.setState({ slew: sampleKeys(slewK, T), trolley: sampleKeys(trolK, T), hookY: sampleKeys(hookK, T), swing, loadAttached: attached });
    this.landedLoad.visible = !attached;

    // ---- hoist cage shuttles between floors
    const cyc = ((T + 100) % 44) / 44;
    s.building.hoistCage.position.y = 0.15 + 9 * smooth(clamp(Math.sin(cyc * Math.PI * 2) * 1.6 + 0.5, 0, 1));

    // ---- guardrail bay: bad take = removed by 小李, good take = stays
    const top = s.building.gapTopRail, mid = s.building.gapMidRail;
    const installed = (m: THREE.Mesh, h: number) => { m.position.set((L.gapX0 + L.gapX1) / 2, L.deckY + h, L.railZ); m.rotation.set(0, 0, 0); };
    const lean = (m: THREE.Mesh, bottom: THREE.Vector3, tip: THREE.Vector3) => {
      m.position.copy(bottom).add(tip).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tip.clone().sub(bottom).normalize());
    };
    const leanTopB = new THREE.Vector3(3.62, Y + 0.026, 6.3), leanTopT = new THREE.Vector3(3.27, Y + 1.9, 6.62);
    const leanMidB = new THREE.Vector3(3.68, Y + 0.026, 6.42), leanMidT = new THREE.Vector3(3.28, Y + 1.88, 6.78);
    if (take === 'good') { installed(top, L.railTop); installed(mid, L.railMid); }
    else {
      lean(top, leanTopB, leanTopT);
      const LP = this.li.puppet;
      const hl = LP.j.handL.localToWorld(new THREE.Vector3(0, -0.09, 0.02)), hr = LP.j.handR.localToWorld(new THREE.Vector3(0, -0.09, 0.02));
      if (T < 0.95) installed(mid, L.railMid);
      else if (T < 2.8) {
        const c = hl.clone().add(hr).multiplyScalar(0.5);
        const w = smooth(invLerp(0.95, 1.1, T));
        const home = new THREE.Vector3((L.gapX0 + L.gapX1) / 2, L.deckY + L.railMid, L.railZ);
        mid.position.copy(home.lerp(c, w));
        const axis = new THREE.Vector3().subVectors(hl, hr).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
        mid.quaternion.slerpQuaternions(new THREE.Quaternion(), q, w);
      } else {
        const u = smooth(invLerp(2.8, 3.35, T));
        const c = hl.clone().add(hr).multiplyScalar(0.5);
        const axis = new THREE.Vector3().subVectors(hl, hr).normalize();
        const qa = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
        const qb = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), leanMidT.clone().sub(leanMidB).normalize());
        mid.position.lerpVectors(c, leanMidB.clone().add(leanMidT).multiplyScalar(0.5), u);
        mid.quaternion.slerpQuaternions(qa, qb, u);
      }
    }
    this.li.puppet.setGrip('L', take === 'bad' && T > 0.9 && T < 3.3 ? 1 : 0.2);
    this.li.puppet.setGrip('R', take === 'bad' && T > 0.9 && T < 3.3 ? 1 : 0.2);

    // ---- the off-cut rolls when stepped on
    const oc = s.props.offcut;
    const roll = smooth(invLerp(T_SLIP, T_SLIP + 0.3, T)) * Math.min(take === 'bad' ? 0.16 : 0.1, L.toeZ - 0.035 - this.offcutHome.z);
    oc.position.set(this.offcutHome.x, this.offcutHome.y, this.offcutHome.z + roll);
    oc.rotation.set(roll / 0.011, 0, 0);

    // ---- lanyard: clipped to the lifeline ring / in the hand / parked on the hip loop
    const dr = P.dRing.getWorldPosition(new THREE.Vector3());
    const hand = P.j.handR.localToWorld(new THREE.Vector3(0, -0.1, 0.03));
    const hip = P.hipLoop.getWorldPosition(new THREE.Vector3());
    let end: THREE.Vector3, gate = 0;
    if (take === 'bad') {
      if (T < 6.75) end = RING.clone();
      else if (T < 7.25) { const u = smooth(invLerp(6.75, 7.25, T)); end = RING.clone().lerp(hand, u); gate = T < 7.1 ? smooth(invLerp(6.75, 6.95, T)) : 1 - smooth(invLerp(7.1, 7.25, T)); }
      else if (T < 8.3) end = hand;
      else end = hand.clone().lerp(hip, smooth(invLerp(8.3, 8.6, T)));
    } else end = RING.clone();
    this.lanyard.update(dr, end, gate);
    s.building.lifeRing.position.copy(RING); s.building.lifeRing.rotation.set(0, Math.PI / 2, 0);
    P.setGrip('R', (take === 'bad' && T > 6.7 && T < 8.5) || (take === 'good' && T > 6.7 && T < 7.7) ? 0.9 : 0.25);

    // ---- helmet: flies off (chin strap undone) at the start of the fall, frozen mid-air in the freeze frame
    const tD = 11.95;
    if (take === 'bad' && T > tD) {
      if (!this.helmetDetach) {
        const T0 = T; this.zhou.evaluate(tD); P.helmet.updateMatrixWorld(true);
        this.helmetDetach = P.helmet.matrixWorld.clone(); this.zhou.evaluate(T0, boil, frame);
      }
      const dt = T - tD;
      const pos = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
      this.helmetDetach.decompose(pos, q, sc);
      pos.add(new THREE.Vector3(0.1 * dt, 1.4 * dt - 4.9 * dt * dt, 1.9 * dt));
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-3.2 * dt, 0.8 * dt, 0.5 * dt)));
      const dyn = s.scene.getObjectByName('dynamic')!;
      if (P.helmet.parent !== dyn) dyn.add(P.helmet);
      P.helmet.position.copy(pos); P.helmet.quaternion.copy(q); P.helmet.scale.copy(sc);
    } else if (P.helmet.parent !== P.j.head) {
      P.j.head.add(P.helmet); this.helmetHome.decompose(P.helmet.position, P.helmet.quaternion, P.helmet.scale);
    }
    if (take === 'bad' && T > tD) P.setChinStrap(false, -0.6);
  }

  /** Penetration test of the three hero puppets against registered colliders. Returns worst depth per sample. */
  collisions(): { who: string; part: string; tag: string; depth: number }[] {
    const out: { who: string; part: string; tag: string; depth: number }[] = [];
    const v = new THREE.Vector3();
    const cols = this.site.colliders;
    for (const a of [this.zhou, this.li, this.lin]) {
      const P = a.puppet;
      P.samplePts.forEach((o, i) => {
        o.getWorldPosition(v);
        for (const c of cols) {
          if (v.x > c.min.x && v.x < c.max.x && v.y > c.min.y && v.y < c.max.y && v.z > c.min.z && v.z < c.max.z) {
            const depth = Math.min(v.x - c.min.x, c.max.x - v.x, v.y - c.min.y, c.max.y - v.y, v.z - c.min.z, c.max.z - v.z);
            if (depth > 0.01) out.push({ who: P.style.name, part: P.sampleNames[i], tag: c.tag, depth: +depth.toFixed(3) });
          }
        }
        // floor: nothing below the deck while standing on it
        if (a.def.floorY === Y && v.y < L.deckY - 0.02 && v.z < L.bz1 - 0.05) out.push({ who: P.style.name, part: P.sampleNames[i], tag: 'deck', depth: +(L.deckY - v.y).toFixed(3) });
      });
    }
    return out;
  }
}

// anticipation before standing up: weight shifts forward, head dips (十二法则: 预备动作)
const POSE_ANTIC: JointRot = {
  hips: [26, 0, 0], spine: [30, 0, 0], chest: [16, 0, 0], neck: [8, 0, 0], head: [6, 0, 0],
  thighL: [-112, -8, 6], shinL: [128, 0, 0], thighR: [-108, 8, -6], shinR: [124, 0, 0],
  upperArmL: [-30, 0, 14], forearmL: [-50, 0, 0], upperArmR: [-34, 0, -12], forearmR: [-46, 0, 0],
};

/** the rear (right) foot shoots back as the off-cut rolls; w scales how far */
function slipLeg(t: number, rot: JointRot, w: number) {
  const u = smooth(invLerp(T_SLIP, T_SLIP + 0.22, t)) * w;
  if (u <= 0) return;
  addRot(rot, { thighR: [18 * u, 0, 0], shinR: [8 * u, 0, 0], footR: [-14 * u, 0, 0], thighL: [-18 * u, 0, 0], shinL: [24 * u, 0, 0] });
}

void lerp; void materials;
