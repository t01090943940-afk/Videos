import * as THREE from 'three';
import * as T from './textures';

// One shared material library. World-space UVs (see world/geo.ts) mean `uvScale` is metres per texture tile.

export interface MatDef { mat: THREE.Material; uvScale: number }

export type MatKey =
  | 'concrete' | 'concreteDark' | 'concreteOld' | 'plywood' | 'timber' | 'rebar' | 'craneYellow' | 'craneWhite' | 'steelDark'
  | 'galv' | 'railRW' | 'toeYB' | 'greenMesh' | 'flatNet' | 'dirt' | 'asphalt' | 'grass' | 'paving' | 'brick' | 'block'
  | 'containerWhite' | 'containerBlue' | 'roofBlue' | 'glass' | 'cable' | 'rubber' | 'kerb' | 'lineWhite' | 'lineYellow'
  | 'hoardingBlue' | 'treeLeaf' | 'treeLeaf2' | 'bark' | 'facadeA' | 'facadeB' | 'facadeC' | 'facadeD' | 'roofGrey'
  | 'orangePlastic' | 'rebarDeck' | 'cementBag' | 'waterBlack' | 'lamp' | 'redPaint' | 'blackMatte';

let lib: Record<MatKey, MatDef> | null = null;

function std(p: THREE.MeshStandardMaterialParameters, tex?: T.TexSet): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ ...p });
  if (tex) { m.map = tex.map; if (tex.normalMap) m.normalMap = tex.normalMap; if (tex.roughnessMap) m.roughnessMap = tex.roughnessMap; }
  return m;
}

export function materials(): Record<MatKey, MatDef> {
  if (lib) return lib;
  const conc = T.concrete(1);
  const concOld = T.concrete(5, [150, 148, 142]);
  const stripesRW = T.stripes('#f2f0ea', '#d0262a', 3);
  const stripesYB = T.stripes('#f4c20d', '#1b1b1b', 3);
  const mesh = T.safetyMesh();
  const facadeTex = [
    T.facade({ wall: [226, 218, 204], accent: [180, 150, 120], glass: [70, 96, 120], seed: 21 }),
    T.facade({ wall: [206, 214, 222], accent: [120, 132, 150], glass: [60, 86, 110], seed: 22 }),
    T.facade({ wall: [232, 206, 180], accent: [170, 120, 90], glass: [76, 96, 112], seed: 23 }),
    T.facade({ wall: [196, 190, 182], accent: [140, 136, 130], glass: [58, 74, 92], seed: 24 }),
  ];
  const fac = (i: number) => std({ roughness: 1, metalness: 0, normalScale: new THREE.Vector2(0.6, 0.6) }, facadeTex[i]);

  lib = {
    concrete: { mat: std({ roughness: 1, normalScale: new THREE.Vector2(0.8, 0.8) }, conc), uvScale: 2.44 },
    concreteDark: { mat: std({ roughness: 1, color: 0xb8b4ae }, conc), uvScale: 2.44 },
    concreteOld: { mat: std({ roughness: 1 }, concOld), uvScale: 3 },
    rebarDeck: { mat: std({ roughness: 1 }, T.rebarDeck(14)), uvScale: 2.4 },
    plywood: { mat: std({ roughness: 1 }, T.plywood(2)), uvScale: 2.44 },
    timber: { mat: std({ roughness: 1 }, T.timber(3)), uvScale: 1.2 },
    rebar: { mat: std({ roughness: 1, metalness: 0.55 }, T.rust(4)), uvScale: 0.6 },
    craneYellow: { mat: std({ roughness: 1, metalness: 0.35 }, T.paintedSteel(11, [236, 178, 22])), uvScale: 1.5 },
    craneWhite: { mat: std({ roughness: 1, metalness: 0.3 }, T.paintedSteel(12, [226, 226, 220])), uvScale: 1.5 },
    steelDark: { mat: std({ color: 0x3a3d42, roughness: 0.55, metalness: 0.7 }), uvScale: 1 },
    galv: { mat: std({ roughness: 1, metalness: 0.75 }, T.galvanized(6)), uvScale: 1 },
    railRW: { mat: std({ map: stripesRW, roughness: 0.45, metalness: 0.2 }), uvScale: 0.8 },
    toeYB: { mat: std({ map: stripesYB, roughness: 0.55 }), uvScale: 0.9 },
    greenMesh: { mat: std({ map: mesh.map, alphaMap: mesh.alpha, transparent: true, opacity: 0.92, side: THREE.DoubleSide, roughness: 0.9, depthWrite: true }), uvScale: 1.8 },
    flatNet: { mat: std({ map: T.flatNet(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9, transparent: false }), uvScale: 0.8 },
    dirt: { mat: std({ roughness: 1, normalScale: new THREE.Vector2(1.2, 1.2) }, T.dirt(7)), uvScale: 9 },
    asphalt: { mat: std({ roughness: 1 }, T.asphalt(8)), uvScale: 6 },
    grass: { mat: std({ roughness: 1 }, T.grass(9)), uvScale: 8 },
    paving: { mat: std({ roughness: 1 }, T.paving(10)), uvScale: 2.4 },
    brick: { mat: std({ roughness: 1 }, T.brick(11)), uvScale: 1.0 },
    block: { mat: std({ roughness: 1, color: 0xd8d4cc }, T.concrete(13, [210, 206, 196], 256)), uvScale: 1.2 },
    containerWhite: { mat: std({ color: 0xeef0f0, roughness: 0.55, metalness: 0.2 }), uvScale: 1 },
    containerBlue: { mat: std({ color: 0x1e5aa8, roughness: 0.5, metalness: 0.25 }), uvScale: 1 },
    roofBlue: { mat: std({ color: 0x2a64b0, roughness: 0.5, metalness: 0.35 }), uvScale: 1 },
    glass: { mat: new THREE.MeshPhysicalMaterial({ color: 0x5f7a8c, roughness: 0.05, metalness: 0.1, transmission: 0, reflectivity: 0.8, clearcoat: 1 }), uvScale: 1 },
    cable: { mat: std({ color: 0x2b2b2b, roughness: 0.4, metalness: 0.8 }), uvScale: 1 },
    rubber: { mat: std({ color: 0x1a1a1a, roughness: 0.9 }), uvScale: 1 },
    kerb: { mat: std({ roughness: 1, color: 0xcfcac2 }, conc), uvScale: 1.2 },
    lineWhite: { mat: std({ color: 0xe8e8e2, roughness: 0.7 }), uvScale: 1 },
    lineYellow: { mat: std({ color: 0xe0b400, roughness: 0.7 }), uvScale: 1 },
    hoardingBlue: { mat: std({ color: 0x1d4f91, roughness: 0.5, metalness: 0.3 }), uvScale: 1 },
    treeLeaf: { mat: std({ color: 0x4d7a36, roughness: 0.85, flatShading: true }), uvScale: 1 },
    treeLeaf2: { mat: std({ color: 0x3f6b30, roughness: 0.85, flatShading: true }), uvScale: 1 },
    bark: { mat: std({ color: 0x5a4636, roughness: 1 }), uvScale: 1 },
    facadeA: { mat: fac(0), uvScale: 1 }, facadeB: { mat: fac(1), uvScale: 1 }, facadeC: { mat: fac(2), uvScale: 1 }, facadeD: { mat: fac(3), uvScale: 1 },
    roofGrey: { mat: std({ roughness: 1, color: 0x9a978f }, concOld), uvScale: 4 },
    orangePlastic: { mat: std({ color: 0xff6a13, roughness: 0.5 }), uvScale: 1 },
    cementBag: { mat: std({ color: 0xd9d2c0, roughness: 0.95 }), uvScale: 1 },
    waterBlack: { mat: std({ color: 0x1b1d20, roughness: 0.25, metalness: 0.2 }), uvScale: 1 },
    lamp: { mat: std({ color: 0xffffff, emissive: 0xfff4d6, emissiveIntensity: 0.4 }), uvScale: 1 },
    redPaint: { mat: std({ color: 0xc62828, roughness: 0.45, metalness: 0.2 }), uvScale: 1 },
    blackMatte: { mat: std({ color: 0x151618, roughness: 0.8 }), uvScale: 1 },
  };
  return lib;
}
