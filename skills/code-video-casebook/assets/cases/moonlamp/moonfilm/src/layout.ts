/**
 * LAYOUT — the set, in meters. +y up. The window wall is the plane z = 0; the room is z < 0,
 * the night outside is z > 0. She sits facing +z (the window), so HER right hand is at −x
 * (frame-right when we stand behind her) and her left at +x.
 */
export const ROOM = { x0: -1.85, x1: 1.85, zBack: -3.7, h: 2.72, wallT: 0.2 };
export const WIN = { x0: -0.86, x1: 0.86, y0: 0.93, y1: 2.34, zIn: -0.1, zOut: 0.1 };
export const DESK = { x0: -0.74, x1: 0.74, zNear: -0.74, zFar: -0.12, top: 0.74, t: 0.04 };
export const CHAIR = { x: 0, z: -1.1, seat: 0.45 };
/** open book: spine along z at x = 0; pages are PAGE_W wide each side, PAGE_D deep */
export const BOOK = { x: 0, z: -0.45, y: DESK.top + 0.018, pageW: 0.165, pageD: 0.235 };
export const LAMP = { x: 0.52, z: -0.3 };
export const STACK = { x: -0.55, z: -0.3 };
export const MUG = { x: 0.34, z: -0.25 };
export const PLATE = { x: 0.33, z: -0.62 };
export const PEN_REST = { x: -0.25, z: -0.58 };

/** where she sits */
export const HIPS = { x: 0, y: CHAIR.seat + 0.04, z: -1.07 };

const norm = (x: number, y: number, z: number): [number, number, number] => {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
};
/** the moon: slightly to her left (+x), a rising moon ~12° above the horizon, straight out of the window */
export const MOON_DIR = norm(0.1361, 0.2079, 0.9686);
export const MOON_ANG_R = 0.068; // angular radius (rad) ≈ 3.5° — a poet's moon, not an astronomer's

/** string of lanterns in the courtyard, in front of the window */
export const LANTERN_ROPE = { a: [2.85, 2.45, 4.2] as [number, number, number], b: [-2.85, 2.45, 4.2] as [number, number, number], sag: 0.22 };
export const LANTERN_COUNT = 6;

/** constellation plane: to the right of the moon (−x), in the sky */
export const CONST = { az: -0.27, el: 0.3, dist: 90, unit: 9.2 };
