import * as THREE from 'three';
import { Engine } from '../core/engine';
import { Stage } from './stage';
import { SHOTS, FPS, shotStarts, TOTAL, type Shot, type MGCtx } from './shots';
import { sampleKeys, sampleVecKeys, hash2 } from '../core/math';
import type { Site } from '../world/site';

// Film timeline: global frame → (shot, quantised local time) → stage state + camera + grade + MG.
// Stop-motion rules live here: time is quantised to the shot's step (on twos/ones), the puppets "boil" only on frames
// where they were actually re-posed, and the key light flickers by ±1.5% per re-shot frame, like real practical lights.

export interface FrameKey { shot: number; lq: number; key: string }

export class Film {
  engine: Engine; stage: Stage; site: Site;
  overlay: HTMLCanvasElement; g: CanvasRenderingContext2D;
  starts = shotStarts();
  totalFrames = Math.round(TOTAL * FPS);
  private v = new THREE.Vector3();
  private state3D = '';
  private last3D = '';
  private cap: HTMLCanvasElement | null = null;

  constructor(engine: Engine, site: Site, stage: Stage, overlay: HTMLCanvasElement) {
    this.engine = engine; this.site = site; this.stage = stage; this.overlay = overlay;
    this.g = overlay.getContext('2d', { willReadFrequently: true })!;
  }

  locate(frame: number): { index: number; shot: Shot; lt: number } {
    const t = frame / FPS;
    let i = SHOTS.length - 1;
    for (let k = 0; k < SHOTS.length; k++) if (t < this.starts[k] + SHOTS[k].dur - 1e-6) { i = k; break; }
    return { index: i, shot: SHOTS[i], lt: t - this.starts[i] };
  }
  stepOf(shot: Shot, lt: number) { return typeof shot.step === 'function' ? shot.step(lt) : shot.step; }
  /** quantised local time for a frame (on twos → pairs of identical frames) */
  frameKey(frame: number): FrameKey {
    const { index, shot, lt } = this.locate(frame);
    const localFrame = Math.round(lt * FPS);
    const step = this.stepOf(shot, lt);
    const lq = (Math.floor(localFrame / step) * step) / FPS;
    return { shot: index, lq, key: `${index}:${lq.toFixed(4)}` };
  }

  /** Put the whole world into the state of `frame`. Returns the frame key. */
  seek(frame: number): FrameKey {
    const fk = this.frameKey(frame);
    const shot = SHOTS[fk.shot], lq = fk.lq;
    const e = this.engine, cam = e.camera;
    const seed = fk.shot * 10000 + Math.round(lq * FPS);

    // ---- stage (take time), with boil only when the puppets actually moved since the previous exposure
    if (shot.take !== 'none') {
      const T = sampleKeys(shot.tk, lq);
      const Tprev = sampleKeys(shot.tk, Math.max(0, lq - this.stepOf(shot, lq) / FPS));
      const moving = Math.abs(T - Tprev) > 1e-5 || lq === 0 && shot.tk.length > 1;
      this.stage.apply(shot.take, T, seed, moving ? (shot.boil ?? 0.35) : 0);
      this.site.light.sun.intensity = this.site.light.baseIntensity * (moving ? 1 + (hash2(seed, 7) - 0.5) * 0.03 : 1);
    }
    // ---- camera
    const p = sampleVecKeys(shot.cam.pos, lq), q = sampleVecKeys(shot.cam.tgt, lq);
    cam.position.set(p[0], p[1], p[2]); cam.lookAt(q[0], q[1], q[2]);
    cam.fov = sampleKeys(shot.cam.fov, lq); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    this.site.light.focusShadow(new THREE.Vector3(...shot.shadow.c), shot.shadow.r);
    this.site.light.update(cam);
    this.site.building.deckRebar.visible = cam.position.distanceTo(this.v.set(5, 15, 4)) < 36;
    // ---- depth of field
    const bk = e.bokeh;
    if (shot.dof) {
      bk.enabled = true;
      const u = bk.uniforms as Record<string, { value: number }>;
      u.focus.value = sampleKeys(shot.dof.focus, lq); u.aperture.value = shot.dof.aperture; u.maxblur.value = 0.01;
    } else bk.enabled = false;
    // ---- grade
    const gu = e.grade.uniforms;
    const d = { saturation: 1.05, keepRed: 0, warmth: 0.02, fade: 0, flash: 0, exposure: 1, vignette: 0.28, contrast: 1.04, ...(shot.grade?.(lq) ?? {}) };
    for (const [k2, val] of Object.entries(d)) gu[k2].value = val;
    gu.seed.value = seed % 997;
    // identity of the rendered 3D image: if nothing visible changed (held frame, still camera), reuse it
    const Tk = shot.take === 'none' ? 'none' : `${shot.take}:${sampleKeys(shot.tk, lq).toFixed(4)}`;
    this.state3D = [Tk, p.map(x => x.toFixed(4)), q.map(x => x.toFixed(4)), cam.fov.toFixed(3), JSON.stringify(d), bk.enabled ? (bk.uniforms as Record<string, { value: number }>).focus.value.toFixed(3) : '-'].join('|');
    // ---- MG overlay
    const g = this.g;
    g.clearRect(0, 0, 1920, 1080);
    if (shot.mg) {
      const ctx: MGCtx = {
        stage: this.stage,
        project: (w: THREE.Vector3) => {
          const s = w.clone().project(cam);
          return { x: (s.x * 0.5 + 0.5) * 1920, y: (-s.y * 0.5 + 0.5) * 1080, vis: s.z < 1 && s.z > -1 };
        },
        world: (who, joint, local = [0, 0, 0]) => {
          const P = who === 'zhou' ? this.stage.zhou.puppet : this.stage.li.puppet;
          const j = (P.j as Record<string, THREE.Object3D>)[joint];
          return j.localToWorld(new THREE.Vector3(...local));
        },
      };
      shot.mg(g, lq, ctx);
    }
    return fk;
  }

  render(frame: number): FrameKey {
    const fk = this.seek(frame);
    const shot = SHOTS[fk.shot];
    if (shot.take === 'none') {
      const r = this.engine.renderer; r.setClearColor(0x111418, 1); r.clear();
    } else if (this.state3D !== this.last3D || !this.engine.renderer.getContextAttributes()?.preserveDrawingBuffer) this.engine.render();
    this.last3D = this.state3D;
    return fk;
  }

  /** JPEG of the composited frame (3D + MG), for the offline renderer. */
  capture(quality = 0.94): string {
    // CPU-backed canvases: a GPU 2D canvas can hand drawImage a stale snapshot under software GL
    if (!this.cap) { this.cap = document.createElement('canvas'); this.cap.width = 1920; this.cap.height = 1080; }
    const c = this.cap;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.clearRect(0, 0, 1920, 1080);
    g.drawImage(this.engine.renderer.domElement, 0, 0, 1920, 1080);
    g.drawImage(this.overlay, 0, 0);
    return c.toDataURL('image/jpeg', quality);
  }
}
