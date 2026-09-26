// Single source of truth for site dimensions (metres). Shots, takes, collision and props all read from here,
// so moving a column or the guardrail gap updates the whole film consistently.

export const L = {
  floorH: 3.0,
  bx0: -15, bx1: 15, bz0: -7, bz1: 7,          // building footprint
  colX: [-14.75, -9, -3, 3, 9, 14.75],
  colZ: [-6.75, 0, 6.75],
  col: 0.5,
  slab: 0.12,
  pouredLevels: 4,                              // slabs at y=3,6,9,12 are poured concrete
  deckY: 15.0,                                  // 6F formwork deck (plywood top)
  standY: 15.1,                                 // top of the rebar mesh = where feet stand
  cageTop: 17.2,                                // column starter cages above the deck

  // south-edge guardrail (JGJ 80-2016: top rail 1.2m, posts ≤2m, toe board ≥180mm)
  railPostZ: 6.92, railZ: 6.87, toeZ: 6.9,
  railTop: 1.2, railMid: 0.6, toeH: 0.18,
  railPostXs: [-14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14],
  gapX0: 4, gapX1: 6,                           // the bay 小李 opens

  // horizontal lifeline (steel wire rope) over the working area
  lifeZ: 4.8, lifeX0: 1.0, lifeX1: 11.0, lifeH: 2.0,

  // load landing sleepers
  landX: 5.5, landZ: 2.2,

  // tower crane
  craneX: 0, craneZ: -15, craneJibY: 36, craneJibLen: 50, craneCounterLen: 13, mast: 1.8,

  // site boundary (hoarding)
  sx0: -42, sx1: 42, sz0: -40, sz1: 26,
  hoardH: 2.5,
  roadW: 14,
};

export const edgeZ = L.bz1; // south slab edge (z = 7)
