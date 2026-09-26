import * as THREE from "three";
import type { Episode, Shot, StageTime, WorldManifest, WorldState } from "./types";
import { resolveStates, shotStarts, shotFrames, stateAt, totalFrames } from "./clock";
import { applyCamera, sampleCamera } from "./camera";
import { compileShot, sampleTrack, type Track } from "./acting";
import { blendPose, mergeSpec, resolvePose, type PoseSpec, type Puppet, type ResolvedPose, type AnchorLookup } from "./rig";
import { GBuffer, fsPass, indexNoOutline, type Pass } from "./post";
import { drawMG } from "./mg";
import { makePrims, type BuildRegistry } from "../looks/prims";
import type { LookDef } from "../looks/types";
import { SCREENS } from "../looks/screens";
import { clamp01, ease } from "./rng";

/**
 * FILM RUNTIME — the thin contract between a sandbox world, looks, and an episode.
 *   frame → StageTime (two clocks) → state (continuity) → poses (IK, stepped) → look pipeline(s)
 *   → composite (cut / wipe / bands) → MG overlay → one image.
 * Pure function of the frame number. The capture harness only ever calls render(frame).
 */
export interface WorldHandles {
  root: THREE.Group;
  actors: Record<string, Puppet>;
  seatTop: Record<string, number>;
  anchors: (actor: string) => AnchorLookup;
  colliders: THREE.Mesh[];
}

export interface WorldHooks<H extends WorldHandles> {
  build(P: ReturnType<typeof makePrims>, variant: string, reg: BuildRegistry): H;
  /** state-driven world updates (props, particles) for one look's copy */
  update(h: H, state: WorldState, shot: Shot, time: StageTime): void;
  /** camera-dependent visibility (wild walls, ceiling) */
  beforeRender(h: H, camera: THREE.PerspectiveCamera): void;
}

export interface FilmConfig<H extends WorldHandles> {
  world: WorldManifest;
  episode: Episode & { screens?: Record<string, string> };
  looks: Record<string, LookDef>;
  poses: Record<string, PoseSpec>;
  palette: Record<string, string>;
  hooks: WorldHooks<H>;
  canvas: HTMLCanvasElement; // WebGL canvas
  out: HTMLCanvasElement; // 2D canvas (final image with MG)
  /** screen index → texture made outside (e.g. the TV logo) */
  staticScreens?: Record<number, THREE.Texture>;
}

interface Stage<H> {
  look: LookDef;
  scene: THREE.Scene;
  handles: H;
  reg: BuildRegistry;
}

export class Film<H extends WorldHandles> {
  renderer: THREE.WebGLRenderer;
  camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 400);
  gbuf: GBuffer;
  stages: Record<string, Stage<H>> = {};
  tracks: Record<string, Track>[] = [];
  starts: WorldState[];
  frameStarts: number[];
  total: number;
  private rts: THREE.WebGLRenderTarget[] = [];
  private screenRTs: Record<number, THREE.WebGLRenderTarget> = {};
  private poseCache = new Map<string, ResolvedPose>();
  private copy: Pass;
  private wipe: Pass;
  private bands: Pass;
  private g2: CanvasRenderingContext2D;
  W: number;
  H: number;

  constructor(public cfg: FilmConfig<H>) {
    const ep = cfg.episode;
    this.W = ep.width;
    this.H = ep.height;
    this.renderer = new THREE.WebGLRenderer({ canvas: cfg.canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.W, this.H, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // post passes encode sRGB themselves
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.gbuf = new GBuffer(this.W, this.H);
    for (let i = 0; i < 7; i++) this.rts.push(new THREE.WebGLRenderTarget(this.W, this.H));
    this.g2 = cfg.out.getContext("2d")!;
    cfg.out.width = this.W;
    cfg.out.height = this.H;
    this.starts = resolveStates(ep, cfg.world.state);
    this.frameStarts = shotStarts(ep);
    this.total = totalFrames(ep);
    this.tracks = ep.shots.map((s) => compileShot(s, cfg.world));
    this.copy = fsPass(`uniform sampler2D tA; void main(){ gl_FragColor = vec4(texture2D(tA, vUv).rgb, 1.); }`, { tA: { value: null } });
    this.wipe = fsPass(/* glsl */ `
      uniform sampler2D tA, tB; uniform float uP; uniform vec3 uAccent;
      void main(){
        float s = (vUv.x + (1. - vUv.y) * .35) / 1.35;
        float edge = uP * 1.3 - .15 + (fbm(vUv * vec2(6., 18.)) - .5) * .09;
        float m = smoothstep(edge + .004, edge - .004, s);
        vec3 c = mix(texture2D(tA, vUv).rgb, texture2D(tB, vUv).rgb, m);
        float line = smoothstep(.012, 0., abs(s - edge)) * step(.001, uP) * step(uP, .999);
        gl_FragColor = vec4(mix(c, uAccent, line * .9), 1.);
      }`, { tA: { value: null }, tB: { value: null }, uP: { value: 0 }, uAccent: { value: new THREE.Color() } });
    this.bands = fsPass(/* glsl */ `
      uniform sampler2D t0, t1, t2, t3, t4, t5, tBase; uniform float uN; uniform float uR[6];
      vec3 pick(int i, vec2 uv){ return i==0 ? texture2D(t0,uv).rgb : i==1 ? texture2D(t1,uv).rgb : i==2 ? texture2D(t2,uv).rgb : i==3 ? texture2D(t3,uv).rgb : i==4 ? texture2D(t4,uv).rgb : texture2D(t5,uv).rgb; }
      void main(){
        float fi = floor(vUv.x * uN); int i = int(fi);
        float r = i==0 ? uR[0] : i==1 ? uR[1] : i==2 ? uR[2] : i==3 ? uR[3] : i==4 ? uR[4] : uR[5];
        float edge = 1. - r * 1.15 + (fbm(vec2(vUv.x * 30., fi)) - .5) * .06;
        float m = smoothstep(edge - .004, edge + .004, 1. - vUv.y) ;
        m = r >= .999 ? 1. : m * step(.001, r);
        vec3 c = mix(texture2D(tBase, vUv).rgb, pick(i, vUv), m);
        float bx = fract(vUv.x * uN); float sep = step(bx, 2. / uRes.x * uN) * step(.001, r);
        gl_FragColor = vec4(mix(c, vec3(.98, .96, .92), sep), 1.);
      }`, {
      t0: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null }, t4: { value: null }, t5: { value: null }, tBase: { value: null },
      uN: { value: 6 }, uR: { value: [0, 0, 0, 0, 0, 0] },
    });
  }

  /** Build one copy of the world per look, then render the monitor thumbnails. */
  init() {
    const { cfg } = this;
    Object.entries(cfg.staticScreens ?? {}).forEach(([i, t]) => (SCREENS[Number(i)] = t));
    for (const [i] of Object.entries(cfg.episode.screens ?? {})) {
      const rt = new THREE.WebGLRenderTarget(this.W, this.H, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
      this.screenRTs[Number(i)] = rt;
      SCREENS[Number(i)] = rt.texture;
    }
    const need = new Set<string>(Object.values(cfg.episode.screens ?? {}));
    for (const s of cfg.episode.shots) {
      need.add(s.look);
      if (s.transition?.from) need.add(s.transition.from);
      s.bands?.looks.forEach((l) => need.add(l));
    }
    for (const id of need) this.stage(id);
    // monitor thumbnails: each look renders the thumbnail camera with all screens hidden
    const thumb = cfg.world.cameras.find((c) => c.role === "monitor-content");
    if (thumb) {
      for (const [i, lookId] of Object.entries(cfg.episode.screens ?? {})) {
        const st = this.stage(lookId);
        const time: StageTime = { frame: 0, fps: 24, shotIndex: 0, localFrame: 0, t: 0, poseT: 0, u: 0 };
        this.poseActors(st, 0, 0, true);
        applyCamera(this.camera, sampleCamera(thumb, 0), this.W / this.H);
        cfg.hooks.beforeRender(st.handles, this.camera);
        const vis = st.reg.screens.map((m) => m.visible);
        st.reg.screens.forEach((m) => (m.visible = false));
        cfg.hooks.update(st.handles, cfg.world.state, cfg.episode.shots[0], time);
        st.look.post({ renderer: this.renderer, gbuf: this.gbuf, scene: st.scene, camera: this.camera, out: this.screenRTs[Number(i)], time, width: this.W, height: this.H });
        st.reg.screens.forEach((m, k) => (m.visible = vis[k]));
      }
    }
  }

  stage(lookId: string): Stage<H> {
    if (this.stages[lookId]) return this.stages[lookId];
    const look = this.cfg.looks[lookId];
    if (!look) throw new Error(`unknown look "${lookId}"`);
    const reg: BuildRegistry = { colliders: [], screens: [] };
    const P = makePrims(look, this.cfg.palette, reg);
    const scene = new THREE.Scene();
    const handles = this.cfg.hooks.build(P, look.variant, reg);
    scene.add(handles.root);
    look.setup(scene, { variant: look.variant, handles: handles as never, renderer: this.renderer });
    indexNoOutline(scene);
    return (this.stages[lookId] = { look, scene, handles, reg });
  }

  /** stepped pose time for a given look inside the current shot */
  private steppedT(localFrame: number, look: LookDef) {
    const fps = this.cfg.episode.fps;
    const hold = Math.max(1, Math.round(fps / look.poseFps));
    return (Math.floor(localFrame / hold) * hold) / fps;
  }

  resolved(st: Stage<H>, actor: string, pose: string): ResolvedPose {
    const key = `${actor}|${pose}`;
    let p = this.poseCache.get(key);
    if (!p) {
      const pup = st.handles.actors[actor];
      const spec = mergeSpec(pose, this.cfg.poses);
      p = resolvePose(pup, spec, st.handles.anchors(actor), st.handles.seatTop[actor] ?? 0.46);
      this.poseCache.set(key, p);
    }
    return p;
  }

  /** Apply every actor's pose at stepped time `poseT` of shot `si`. */
  poseActors(st: Stage<H>, si: number, poseT: number, idle = false) {
    for (const [id, pup] of Object.entries(st.handles.actors)) {
      if (idle) {
        pup.apply(this.resolved(st, id, "seated_idle"));
        continue;
      }
      const tr = this.tracks[si][id];
      const s = sampleTrack(tr, poseT);
      const a = this.resolved(st, id, s.a);
      const p = s.u > 0 ? blendPose(a, this.resolved(st, id, s.b), s.u) : a;
      pup.apply(p);
    }
    st.handles.root.updateMatrixWorld(true);
  }

  timeAt(frame: number, look: LookDef): StageTime {
    const ep = this.cfg.episode;
    let i = ep.shots.length - 1;
    for (let k = 0; k < ep.shots.length; k++) if (frame < this.frameStarts[k] + shotFrames(ep.shots[k], ep.fps)) { i = k; break; }
    const len = shotFrames(ep.shots[i], ep.fps);
    const local = Math.min(Math.max(0, frame - this.frameStarts[i]), len - 1);
    return { frame, fps: ep.fps, shotIndex: i, localFrame: local, t: local / ep.fps, poseT: this.steppedT(local, look), u: local / Math.max(1, len - 1) };
  }

  /** Render one look's view of this frame into rts[slot]. */
  private renderLook(frame: number, lookId: string, slot: number) {
    const st = this.stage(lookId);
    const time = this.timeAt(frame, st.look);
    const shot = this.cfg.episode.shots[time.shotIndex];
    const state = stateAt(shot, this.starts[time.shotIndex], time.poseT);
    const cam = this.cfg.world.cameras.find((c) => c.id === shot.camera);
    if (!cam) throw new Error(`shot ${shot.id}: unknown camera ${shot.camera}`);
    const len = shotFrames(shot, this.cfg.episode.fps);
    const u = st.look.cameraOnTwos ? (Math.floor(time.localFrame / 2) * 2) / Math.max(1, len - 1) : time.u;
    applyCamera(this.camera, sampleCamera(cam, u), this.W / this.H);
    this.poseActors(st, time.shotIndex, time.poseT);
    this.cfg.hooks.update(st.handles, state, shot, time);
    this.cfg.hooks.beforeRender(st.handles, this.camera);
    st.look.update?.(st.scene, { variant: st.look.variant, handles: st.handles as never }, time);
    st.look.post({ renderer: this.renderer, gbuf: this.gbuf, scene: st.scene, camera: this.camera, out: this.rts[slot], time, width: this.W, height: this.H });
    return { time, shot };
  }

  /** THE contract: draw frame `f` into the 2D output canvas. */
  render(frame: number) {
    const ep = this.cfg.episode;
    const base = this.timeAt(frame, this.cfg.looks[ep.shots[0].look]);
    const shot = ep.shots[base.shotIndex];
    const look = this.cfg.looks[shot.look];
    const r = this.renderer;
    const tr = shot.transition;
    const wf = tr?.type === "wipe" ? tr.frames ?? 14 : 0;
    if (shot.bands) {
      const b = shot.bands;
      const local = base.localFrame / ep.fps;
      this.renderLook(frame, shot.look, 6);
      const rr = b.looks.map((_, i) => clamp01((local - b.start - i * b.stagger) / 0.55));
      b.looks.forEach((l, i) => (rr[i] > 0 ? this.renderLook(frame, l, i) : null));
      const u = this.bands.u;
      b.looks.forEach((_, i) => (u[`t${i}`].value = this.rts[i].texture));
      u.tBase.value = this.rts[6].texture;
      u.uN.value = b.looks.length;
      u.uR.value = rr.map((x) => ease.inOut(x));
      (u.uRes.value as THREE.Vector2).set(this.W, this.H);
      this.bands.run(r, null);
    } else if (tr?.type === "wipe" && tr.from && base.localFrame < wf + 1) {
      this.renderLook(frame, tr.from, 0);
      this.renderLook(frame, shot.look, 1);
      this.wipe.u.tA.value = this.rts[0].texture;
      this.wipe.u.tB.value = this.rts[1].texture;
      this.wipe.u.uP.value = ease.inOut(clamp01(base.localFrame / wf));
      (this.wipe.u.uAccent.value as THREE.Color).set(look.accent);
      this.wipe.run(r, null);
    } else {
      this.renderLook(frame, shot.look, 0);
      this.copy.u.tA.value = this.rts[0].texture;
      this.copy.run(r, null);
    }
    // final image = WebGL plate + MG layer
    const g = this.g2;
    g.clearRect(0, 0, this.W, this.H);
    g.drawImage(this.cfg.canvas, 0, 0, this.W, this.H);
    const time = this.timeAt(frame, look);
    drawMG({ g, w: this.W, h: this.H, shot, time, accent: look.accent });
    return { shot: shot.id, look: shot.look };
  }

  /**
   * QC probe for one frame (no pixels): contact errors of keyed reaches and puppet/set
   * penetration depth, plus a pose signature for on-twos checks.
   */
  inspect(frame: number) {
    const ep = this.cfg.episode;
    const t0 = this.timeAt(frame, this.cfg.looks[ep.shots[0].look]);
    const shot = ep.shots[t0.shotIndex];
    const st = this.stage(shot.look);
    const time = this.timeAt(frame, st.look);
    this.poseActors(st, time.shotIndex, time.poseT);
    const state = stateAt(shot, this.starts[time.shotIndex], time.poseT);
    this.cfg.hooks.update(st.handles, state, shot, time);
    st.handles.root.updateMatrixWorld(true);
    const contacts: { actor: string; hand: string; mode: string; pose: string; gap: number; surface: number }[] = [];
    const pen: { actor: string; part: string; collider: string; depth: number }[] = [];
    const sig: Record<string, string> = {};
    const v = new THREE.Vector3();
    const boxes = st.handles.colliders.map((c) => ({ name: c.name || c.userData.sem, box: new THREE.Box3().setFromObject(c) }));
    for (const [id, pup] of Object.entries(st.handles.actors)) {
      const tr = this.tracks[time.shotIndex][id];
      const s = sampleTrack(tr, time.poseT);
      sig[id] = `${s.a}>${s.b}@${s.u.toFixed(3)}`;
      if (s.u === 0) {
        const p = this.resolved(st, id, s.a);
        for (const c of p.contacts) {
          if (c.mode === "free") continue;
          // exact: distance from the target point to the hand box; surface: lowest corner vs surface (− = sinking)
          contacts.push({
            actor: id, hand: c.hand, mode: c.mode, pose: s.a,
            gap: +pup.handDistance(c.hand as "L" | "R", c.target).toFixed(4),
            surface: +(pup.handLowestY(c.hand as "L" | "R") - c.target.y).toFixed(4),
          });
        }
      }
      for (const part of pup.parts) {
        part.mesh.updateMatrixWorld(true);
        for (const b of boxes) {
          let depth = 0;
          for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
            v.set(sx * part.half.x, sy * part.half.y, sz * part.half.z).applyMatrix4(part.mesh.matrixWorld);
            if (b.box.containsPoint(v)) {
              const d = Math.min(v.x - b.box.min.x, b.box.max.x - v.x, v.y - b.box.min.y, b.box.max.y - v.y, v.z - b.box.min.z, b.box.max.z - v.z);
              depth = Math.max(depth, d);
            }
          }
          if (depth > 0.004) pen.push({ actor: id, part: part.name, collider: b.name, depth: +depth.toFixed(4) });
        }
      }
    }
    return { frame, shot: shot.id, look: shot.look, localFrame: time.localFrame, poseT: time.poseT, sig, contacts, pen, state };
  }

  meta() {
    const ep = this.cfg.episode;
    return {
      title: ep.title, fps: ep.fps, width: this.W, height: this.H, total: this.total,
      shots: ep.shots.map((s, i) => ({ id: s.id, look: s.look, start: this.frameStarts[i], frames: shotFrames(s, ep.fps), camera: s.camera, beat: s.beat })),
      events: ep.shots.flatMap((s, i) => (s.events ?? []).map((e) => ({ shot: s.id, frame: this.frameStarts[i] + Math.round(e.t * ep.fps), set: e.set }))),
    };
  }
}
