import * as THREE from 'three';
import type { Key } from '../core/math';
import { L } from '../world/layout';
import { T_FREEZE } from './stage';
import type { Stage, TakeName } from './stage';
import * as M from './mg';

// The shot list = the director's breakdown (docs/DIRECTOR.md §4) as data.
// A shot picks a take, maps shot-local time → take time (tk), and defines camera, depth of field, grade, MG and sound.
// step: 2 = on twos (12 unique images/s), 1 = on ones. Everything (camera, puppets, MG) is quantised to the step.

export interface Cam { pos: Key<number[]>[]; tgt: Key<number[]>[]; fov: Key<number>[] }
export interface MGCtx { stage: Stage; project: (v: THREE.Vector3) => M.Pt; world: (who: 'zhou' | 'li', joint: string, local?: [number, number, number]) => THREE.Vector3 }
export interface Cue { t: number; id: string; gain?: number }
export interface Shot {
  id: string; dur: number; title: string;
  take: TakeName | 'none';
  tk: Key<number>[];
  step: number | ((t: number) => number);
  cam: Cam;
  dof?: { focus: Key<number>[]; aperture: number };
  shadow: { c: [number, number, number]; r: number };
  grade?: (t: number) => Partial<{ saturation: number; keepRed: number; warmth: number; fade: number; flash: number; exposure: number; vignette: number; contrast: number }>;
  mg?: (g: CanvasRenderingContext2D, t: number, c: MGCtx) => void;
  sfx?: Cue[];
  amb?: number;           // ambience bed level 0..1
  music?: 'A' | 'B' | null;
  boil?: number;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const Y = L.standY;
const k = (t: number, v: number[] | number, e?: Key<number>['e']) => ({ t, v, e }) as never;
const still = (p: number[], q: number[], fov: number): Cam => ({ pos: [k(0, p)], tgt: [k(0, q)], fov: [k(0, fov)] });
// S12/S13 continue from the new low S11 set-up
const DECK_SHADOW = { c: [5, 15, 4.5] as [number, number, number], r: 14 };

// Camera set-ups reused between the two takes so the comparison reads instantly (匹配镜头)
const CAM_EDGE_OUT = { p: [9.3, 15.75, 10.9], q: [5.4, 15.95, 7.1] };     // outside, 6F height, looking at the gap
const CAM_RAIL = { p: [7.7, 16.15, 5.05], q: [4.75, 15.7, 6.45] };          // 小李 at the rail
const CAM_CHIN = { p: [6.05, 16.78, 4.18], q: [5.2, 16.66, 4.96] };          // 老周 head CU
const CAM_RING = { p: [5.78, 17.3, 5.42], q: [5.2, 17.02, 4.82] };           // hook on lifeline ECU
const CAM_SIDE = { p: [11.4, 16.35, 5.75], q: [5.2, 15.95, 5.75] };          // deck side WS (movement → screen-left)

export const SHOTS: Shot[] = [
  {
    id: 'S01', dur: 4.0, title: '倒叙钩子 · 定格帧环绕', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: { pos: [k(0, [9.9, 15.7, 9.8]), k(4, [6.3, 16.2, 11.8], 'inOutSine')], tgt: [k(0, [5.4, 15.9, 7.3])], fov: [k(0, 30), k(4, 27)] },
    dof: { focus: [k(0, 5.2), k(4, 4.9)], aperture: 0.0016 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: t => ({ keepRed: 0.55, saturation: 0.9, contrast: 1.1, fade: Math.max(0, 1 - t / 0.5) * 0.9 }),
    mg: (g, t) => { M.freezeUI(g, t, 0.2, '09:41:52:07'); M.caption(g, t, 0.9, 3.9, '如果时间能定格在这一帧——', '', 'll'); },
    sfx: [{ t: 0, id: 'heart', gain: 0.9 }, { t: 1.05, id: 'heart', gain: 0.9 }, { t: 2.1, id: 'heart', gain: 0.9 }, { t: 3.15, id: 'heart', gain: 0.9 }, { t: 0.9, id: 'type' }], amb: 0,
  },
  {
    id: 'S02', dur: 3.0, title: '片名', take: 'none', tk: [k(0, 0)], step: 2, cam: still([0, 0, 0], [0, 0, -1], 30), shadow: DECK_SHADOW,
    mg: (g, t) => M.titleCard(g, t, '定格', '一次高处坠落的复盘'),
    sfx: [{ t: 0.0, id: 'slam' }, { t: 0.4, id: 'hit' }, { t: 0.55, id: 'hit', gain: 0.6 }], music: 'A', amb: 0,
  },
  {
    id: 'S03', dur: 6.0, title: '航拍建立空间', take: 'bad', tk: [k(0, -6), k(6, 0, 'linear')], step: 2,
    cam: { pos: [k(0, [66, 46, 74]), k(6, [34, 28.5, 38], 'inOutSine')], tgt: [k(0, [0, 9, -2]), k(6, [4, 14, 3], 'inOutSine')], fov: [k(0, 38), k(6, 36)] },
    shadow: { c: [0, 0, 0], r: 65 },
    mg: (g, t) => M.caption(g, t, 1.0, 5.6, '上午 9:40 · 住宅楼 6F 作业面', '主体结构施工 · 绑扎楼板钢筋'),
    sfx: [{ t: 2.5, id: 'whistleFar', gain: 0.4 }], amb: 0.9, music: 'A',
  },
  {
    id: 'S04', dur: 4.0, title: '人物登场', take: 'bad', tk: [k(0, -3.6), k(2.1, -1.5, 'linear')], step: 2,
    cam: { pos: [k(0, [8.7, 16.3, 5.45]), k(4, [8.15, 16.22, 5.3], 'inOutSine')], tgt: [k(0, [5.2, 15.72, 4.95])], fov: [k(0, 34)] },
    dof: { focus: [k(0, 3.5), k(4, 3.0)], aperture: 0.0012 }, shadow: DECK_SHADOW,
    mg: (g, t, c) => M.characterCard(g, t, 2.15, c.project(c.world('zhou', 'head', [0, 0.1, 0])), '老周', ['钢筋工 · 干了 22 年', '“这活我闭着眼都会”']),
    sfx: [{ t: 0.2, id: 'tie' }, { t: 0.95, id: 'tie' }, { t: 1.7, id: 'tie' }, { t: 2.15, id: 'stamp' }], amb: 0.8, music: 'A',
  },
  {
    id: 'S05', dur: 4.0, title: '第一个洞：临边防护被拆', take: 'bad', tk: [k(0, 0), k(4, 4, 'linear')], step: 2,
    cam: still(CAM_RAIL.p, CAM_RAIL.q, 36), dof: { focus: [k(0, 3.2)], aperture: 0.0008 }, shadow: DECK_SHADOW,
    mg: (g, t, c) => M.callout(g, t, 2.9, 4.0, c.project(V(5.0, L.deckY + 0.9, L.railZ)), 1, '临边防护被拆开', M.C.red, 1),
    sfx: [{ t: 0.95, id: 'pipeLift' }, { t: 3.25, id: 'pipeDrop' }, { t: 3.9, id: 'step' }], amb: 0.8, music: 'A',
  },
  {
    id: 'S06', dur: 3.0, title: '第二个洞：下颏带没系', take: 'bad', tk: [k(0, 3.6), k(3, 6.1, 'linear')], step: 2,
    cam: still(CAM_CHIN.p, CAM_CHIN.q, 30), dof: { focus: [k(0, 1.15)], aperture: 0.002 }, shadow: { c: [5, 15, 5], r: 6 },
    mg: (g, t, c) => M.callout(g, t, 1.5, 3.0, c.project(c.world('zhou', 'head', [0, -0.06, 0.07])), 2, '下颏带没系', M.C.red, -1, -60),
    sfx: [{ t: 0.4, id: 'cloth' }, { t: 1.3, id: 'breath' }], amb: 0.7,
  },
  {
    id: 'S07', dur: 3.0, title: '动机：吊物来了', take: 'bad', tk: [k(0, 4.4), k(3, 7.4, 'linear')], step: 2,
    cam: { pos: [k(0, [7.9, 15.45, 6.2])], tgt: [k(0, [5.5, 22.8, 2.4]), k(3, [5.5, 21.6, 2.3])], fov: [k(0, 40)] }, shadow: { c: [5, 20, 2], r: 14 },
    sfx: [{ t: -0.5, id: 'whistle' }, { t: 0.0, id: 'craneHum', gain: 0.8 }], amb: 0.75,
  },
  {
    id: 'S08', dur: 3.0, title: '第三个洞：安全带解开', take: 'bad', tk: [k(0, 6.3), k(3, 7.9, 'linear')], step: 2,
    cam: still(CAM_RING.p, CAM_RING.q, 30), dof: { focus: [k(0, 0.8)], aperture: 0.0026 }, shadow: { c: [5, 16, 5], r: 5 },
    mg: (g, t, c) => M.callout(g, t, 1.8, 3.0, c.project(V(5.2, Y + L.lifeH - 0.1, L.lifeZ + 0.05)), 3, '安全带解开 · 省 3 秒', M.C.red, -1, 80),
    sfx: [{ t: 0.95, id: 'click', gain: 1.0 }, { t: 1.5, id: 'webbing' }], amb: 0.7,
  },
  {
    id: 'S09', dur: 3.5, title: '走向缺口', take: 'bad', tk: [k(0, 7.9), k(3.5, 11.4, 'linear')], step: 2,
    cam: still(CAM_SIDE.p, CAM_SIDE.q, 38), dof: { focus: [k(0, 6.1)], aperture: 0.0005 }, shadow: DECK_SHADOW,
    sfx: [{ t: 0.9, id: 'step', gain: 0.6 }, { t: 1.8, id: 'step', gain: 0.6 }, { t: 2.7, id: 'step', gain: 0.6 }, { t: 0.4, id: 'whistle', gain: 0.5 }], amb: 0.7,
  },
  {
    id: 'S10', dur: 2.0, title: '意外触发', take: 'bad', tk: [k(0, 11.15), k(2, 11.75, 'linear')], step: 1,
    cam: still([6.55, 15.32, 6.05], [5.3, 15.16, 6.7], 32), dof: { focus: [k(0, 1.35)], aperture: 0.0022 }, shadow: { c: [5.3, 15, 6.6], r: 4 },
    grade: t => ({ saturation: 1 - t * 0.1 }),
    sfx: [{ t: 0.6, id: 'rebarRoll' }, { t: 0.62, id: 'scuff' }], amb: 0.6,
  },
  {
    id: 'S11', dur: 2.5, title: '坠落 → 定格', take: 'bad', tk: [k(0, 11.6), k(1.4, T_FREEZE, 'linear')], step: t => (t < 1.4 ? 1 : 2),
    cam: still(CAM_EDGE_OUT.p, CAM_EDGE_OUT.q, 30), dof: { focus: [k(0, 5.0)], aperture: 0.0012 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: t => ({ keepRed: t > 1.4 ? 0.55 : 0, flash: t > 1.4 && t < 1.5 ? 0.6 : 0, saturation: t > 1.4 ? 0.9 : 0.95, contrast: t > 1.4 ? 1.1 : 1.04 }),
    mg: (g, t) => M.freezeUI(g, t, 1.4, '09:41:52:07'),
    sfx: [{ t: 0.1, id: 'gasp' }, { t: 1.4, id: 'freeze' }, { t: 1.45, id: 'heart', gain: 1 }], amb: 0,
  },
  {
    id: 'S12', dur: 7.0, title: '分析：三层防护同时失效', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: { pos: [k(0, CAM_EDGE_OUT.p), k(7, [8.6, 15.9, 10.2], 'inOutSine')], tgt: [k(0, CAM_EDGE_OUT.q), k(7, [5.9, 15.95, 7.0], 'inOutSine')], fov: [k(0, 30), k(7, 34)] },
    dof: { focus: [k(0, 5.0)], aperture: 0.0006 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ keepRed: 0.75, saturation: 0.85, contrast: 1.1, exposure: 0.85 }),
    mg: (g, t, c) => {
      M.freezeUI(g, t, 0, '09:41:52:07');
      M.callout(g, t, 0.2, 6.9, c.project(V(5.0, L.deckY + 0.6, L.railZ)), 1, '护栏缺口', M.C.red, 1, 0, 700);
      M.callout(g, t, 0.45, 6.9, c.project(c.world('zhou', 'hips', [0.16, 0.0, -0.06])), 3, '安全带未挂', M.C.red, 1, 0, 540);
      M.callout(g, t, 0.7, 6.9, c.project(c.world('zhou', 'head', [0, -0.05, 0.07])), 2, '下颏带未系', M.C.red, 1, 0, 380);
      M.swissCheese(g, t, 1.2, ['临边防护', '安全带', '安全帽']);
      M.caption(g, t, 3.8, 6.9, '不是一个错误', '是三层防护，在同一秒同时失效');
    },
    sfx: [{ t: 0.05, id: 'heart', gain: 0.8 }, { t: 1.1, id: 'heart', gain: 0.7 }, { t: 2.15, id: 'heart', gain: 0.6 }, { t: 0.2, id: 'pop' }, { t: 0.45, id: 'pop' }, { t: 0.7, id: 'pop' }, { t: 1.5, id: 'whoosh', gain: 0.5 }, { t: 3.4, id: 'riser' }, { t: 3.8, id: 'hit', gain: 0.7 }], amb: 0,
  },
  {
    id: 'S13', dur: 5.0, title: '数据', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: still([8.6, 15.9, 10.2], [5.9, 15.95, 7.0], 34), shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ keepRed: 0.9, saturation: 0.6, exposure: 0.7 }),
    mg: (g, t) => M.statCard(g, t, 59.07, '全国房屋市政工程生产安全事故中，高处坠落占比', '数据来源：住房和城乡建设部办公厅《关于2020年房屋市政工程生产安全事故情况的通报》（建办质〔2021〕17号），689 起中 407 起'),
    sfx: [{ t: 0.3, id: 'counter' }, { t: 1.7, id: 'hit', gain: 0.8 }], amb: 0,
  },
  {
    id: 'S14', dur: 4.0, title: '倒带', take: 'bad', tk: [k(0, T_FREEZE), k(1.3, T_FREEZE), k(4.0, -0.3, 'inCubic')], step: 1,
    cam: { pos: [k(0, [12.2, 18.6, 12.4]), k(4, [11.4, 18.0, 11.5], 'inOutSine')], tgt: [k(0, [4.9, 15.6, 5.3])], fov: [k(0, 40)] }, shadow: DECK_SHADOW,
    grade: t => ({ keepRed: t < 1.3 ? 0.75 : 0.35, saturation: t < 1.3 ? 0.85 : 0.7, contrast: 1.12 }),
    mg: (g, t) => {
      if (t < 1.3) M.freezeUI(g, t, 0, '09:41:52:07');
      M.caption(g, t, 0.15, 1.35, '现实没有暂停键。', '', 'center');
      if (t >= 1.3) { M.rewindUI(g, t, 1.3, M.fmtTime(Math.max(0, 112 - (t - 1.3) * 40))); M.caption(g, t, 1.5, 4.0, '但这一次，倒回去重来', '', 'll'); }
    },
    sfx: [{ t: 1.3, id: 'rewind' }], amb: 0,
  },
  {
    id: 'S15', dur: 5.0, title: '关上第一个洞：护栏不拆', take: 'good', tk: [k(0, 0), k(5, 5, 'linear')], step: 2,
    cam: still(CAM_RAIL.p, CAM_RAIL.q, 36), dof: { focus: [k(0, 3.2)], aperture: 0.0006 }, shadow: DECK_SHADOW,
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => {
      const post = (x: number, y: number) => c.project(V(x, L.deckY + y, L.railPostZ + 0.03));
      M.dimension(g, t, 1.2, 5.0, post(6, 0), post(6, L.railTop), '上杆 1.2 m', [60, 0]);
      M.dimension(g, t, 1.6, 5.0, post(4, L.railTop + 0.12), post(6, L.railTop + 0.12), '立杆间距 ≤ 2 m', [0, -40]);
      M.dimension(g, t, 2.0, 5.0, post(3.3, 0), post(3.3, L.toeH), '挡脚板 ≥ 180 mm', [-50, 0]);
      M.caption(g, t, 2.6, 5.0, '临边防护 · 不拆、不缺', 'JGJ 80-2016《建筑施工高处作业安全技术规范》', 'tr', M.C.paper);
    },
    sfx: [{ t: 1.8, id: 'pipeKnock' }, { t: 2.15, id: 'pipeKnock', gain: 0.8 }, { t: 1.2, id: 'tick' }, { t: 1.6, id: 'tick' }, { t: 2.0, id: 'tick' }], amb: 0.8, music: 'B',
  },
  {
    id: 'S16', dur: 3.0, title: '关上第二个洞：下颏带系紧', take: 'good', tk: [k(0, 3.8), k(3, 6.8, 'linear')], step: 2,
    cam: still(CAM_CHIN.p, CAM_CHIN.q, 30), dof: { focus: [k(0, 1.15)], aperture: 0.002 }, shadow: { c: [5, 15, 5], r: 6 },
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => M.callout(g, t, 1.3, 3.0, c.project(c.world('zhou', 'head', [0, -0.06, 0.07])), 2, '下颏带 · 系紧', M.C.green, -1, -60),
    sfx: [{ t: 1.2, id: 'buckle', gain: 1.0 }], amb: 0.7, music: 'B',
  },
  {
    id: 'S17', dur: 3.0, title: '关上第三个洞：挂在上方', take: 'good', tk: [k(0, 6.0), k(3, 8.2, 'linear')], step: 2,
    cam: still(CAM_RING.p, CAM_RING.q, 30), dof: { focus: [k(0, 0.8)], aperture: 0.0026 }, shadow: { c: [5, 16, 5], r: 5 },
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => {
      M.callout(g, t, 1.4, 3.0, c.project(V(5.2, Y + L.lifeH - 0.1, L.lifeZ + 0.05)), 3, '安全带 · 挂在上方', M.C.green, -1, 80);
      M.caption(g, t, 1.6, 3.0, '优先使用上方牢固挂点（高挂低用）', 'GB 23468-2025《坠落防护装备的选择、使用和维护》', 'top');
    },
    sfx: [{ t: 1.1, id: 'tug' }, { t: 1.7, id: 'tug', gain: 0.8 }], amb: 0.7, music: 'B',
  },
  {
    id: 'S18', dur: 3.5, title: '同样的工作', take: 'good', tk: [k(0, 7.9), k(3.5, 11.4, 'linear')], step: 2,
    cam: still(CAM_SIDE.p, CAM_SIDE.q, 38), dof: { focus: [k(0, 6.1)], aperture: 0.0005 }, shadow: DECK_SHADOW,
    grade: () => ({ warmth: 0.03, saturation: 1.08 }),
    sfx: [{ t: 0.9, id: 'step', gain: 0.6 }, { t: 1.8, id: 'step', gain: 0.6 }, { t: 2.7, id: 'step', gain: 0.6 }, { t: 0.4, id: 'whistle', gain: 0.5 }], amb: 0.7,
  },
  {
    id: 'S19', dur: 3.5, title: '同样的意外，不同的结局', take: 'good', tk: [k(0, 11.1), k(1.3, 11.75, 'linear'), k(3.5, 12.9, 'linear')], step: t => (t < 1.3 ? 1 : 2),
    cam: still(CAM_EDGE_OUT.p, CAM_EDGE_OUT.q, 30), dof: { focus: [k(0, 5.0)], aperture: 0.0012 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ warmth: 0.03, saturation: 1.05 }),
    sfx: [{ t: 0.5, id: 'rebarRoll' }, { t: 0.8, id: 'railHit' }, { t: 0.82, id: 'ropeTaut' }], amb: 0.6,
  },
  {
    id: 'S20', dur: 3.0, title: '情绪落地', take: 'good', tk: [k(0, 12.9), k(3, 15.1, 'linear')], step: 2,
    cam: { pos: [k(0, [5.95, 16.45, 5.1]), k(3, [5.9, 16.42, 4.95])], tgt: [k(0, [5.25, 16.4, 6.45])], fov: [k(0, 32)] },
    dof: { focus: [k(0, 1.6)], aperture: 0.0016 }, shadow: { c: [5, 15, 6], r: 6 },
    grade: () => ({ warmth: 0.04, saturation: 1.08 }),
    sfx: [{ t: 0.6, id: 'exhale' }, { t: 2.2, id: 'whistle2', gain: 0.5 }], amb: 0.75,
  },
  {
    id: 'S21', dur: 7.0, title: '拉开：回到全局', take: 'good', tk: [k(0, 15.5), k(7, 22.5, 'linear')], step: 2,
    cam: { pos: [k(0, [13.5, 19.5, 15.5]), k(7, [72, 56, 86], 'inOutCubic')], tgt: [k(0, [5.2, 15.8, 5.5]), k(7, [1, 10, -1], 'inOutCubic')], fov: [k(0, 36), k(7, 40)] },
    shadow: { c: [0, 0, 0], r: 60 },
    grade: t => ({ warmth: 0.03, saturation: 1.06, fade: Math.max(0, (t - 6.3) / 0.7) }),
    mg: (g, t) => { M.caption(g, t, 1.0, 3.9, '定格，只存在于视频里。', '', 'center'); M.caption(g, t, 4.0, 6.8, '现实里，没有倒带。', '', 'center', M.C.yellow); },
    sfx: [{ t: 0.5, id: 'whistleFar', gain: 0.4 }], amb: 0.9, music: 'A',
  },
  {
    id: 'S22', dur: 5.0, title: '结尾卡', take: 'none', tk: [k(0, 0)], step: 2, cam: still([0, 0, 0], [0, 0, -1], 30), shadow: DECK_SHADOW,
    mg: (g, t) => M.endCard(g, t),
    sfx: [{ t: 0.2, id: 'pop' }, { t: 0.5, id: 'pop' }, { t: 0.8, id: 'pop' }, { t: 1.4, id: 'chime' }], music: 'A', amb: 0,
  },
];

export const FPS = 24;
export function shotStarts(): number[] { const s: number[] = []; let acc = 0; for (const sh of SHOTS) { s.push(acc); acc += sh.dur; } return s; }
export const TOTAL = SHOTS.reduce((a, s) => a + s.dur, 0);
