/**
 * VF-2 architectural completion + VF-3 department interiors (owner-approved Visual Foundation
 * Completion Plan, 2026-11-20). Pure data builders — every placement comes from
 * scene-architecture.json `interiors` (derived from the catalogued analysis/03 §3–§6 screen boxes
 * via the approved HOME camera inverse projection) or is computed here from the measured
 * footprints (walnut wall, partition frames). No invented content: uncatalogued details are
 * omitted and documented in greybox/10–11 reports.
 *
 * VF-2 (structure):
 *  - DEPT-01 walnut slat back wall (scene.walnut #897047 MEASURED sample; position BY CONSTRUCTION
 *    on the measured back footprint edge, inner face).
 *  - Partition frame rhythm on every atrium-facing glass front: thin anthracite vertical mullions
 *    + top/bottom rails (analysis/03 §2.2). Bay 0.96 m = the MEASURED facade bay applied to
 *    partitions (EST. for partitions — the partition rhythm itself is not separately measurable).
 *  - White wall slabs behind the Management whiteboard and Creative Studio pin-board (§2.2),
 *    placed at the solver-derived wall-adjacent points (scratch vf34solver, documented).
 * VF-3 (furniture): desks/chairs/monitors per seated robot cluster, displays with catalogued
 *  content types, shelves, boards, racks, plants, atrium lounge set ENV-005…013.
 */
import { DEPARTMENTS, INTERIORS, SCALE, type InteriorItem, type Vec3 } from '../config/sceneConfig';
import type { BoxSpec, CylinderSpec, PrimitiveSpec, SphereSpec } from './model';

type P = PrimitiveSpec;

let seq = 0;
function box(material: BoxSpec['material'], center: Vec3, size: Vec3, rotationY = 0, keyPrefix = 'I'): BoxSpec {
  seq += 1;
  return { key: `${keyPrefix}-${seq}`, kind: 'box', material, center, size, rotationY };
}
function cyl(material: CylinderSpec['material'], center: Vec3, radius: number, height: number, segments = 20, keyPrefix = 'I'): CylinderSpec {
  seq += 1;
  return { key: `${keyPrefix}-${seq}`, kind: 'cylinder', material, center, radius, height, segments };
}
function sphere(material: SphereSpec['material'], center: Vec3, radius: number, keyPrefix = 'I'): SphereSpec {
  seq += 1;
  return { key: `${keyPrefix}-${seq}`, kind: 'sphere', material, center, radius };
}

/** Atrium-facing front edge of a department (the footprint edge whose outward normal points toward the plinth centre). */
function frontEdge(fp: { x0: number; x1: number; z0: number; z1: number }): { axis: 'x' | 'z'; at: number; from: number; to: number } {
  const cx = 0;
  const cz = 0;
  // distances from each edge to the atrium centre (0,0); the closest edge is the front
  const cands = [
    { axis: 'z' as const, at: fp.z1, d: Math.abs(fp.z1 - cz), from: fp.x0, to: fp.x1, dir: 1 },
    { axis: 'z' as const, at: fp.z0, d: Math.abs(fp.z0 - cz), from: fp.x0, to: fp.x1, dir: -1 },
    { axis: 'x' as const, at: fp.x1, d: Math.abs(fp.x1 - cx), from: fp.z0, to: fp.z1, dir: 1 },
    { axis: 'x' as const, at: fp.x0, d: Math.abs(fp.x0 - cx), from: fp.z0, to: fp.z1, dir: -1 },
  ];
  cands.sort((a, b) => a.d - b.d);
  return cands[0];
}

/** VF-2: walnut back wall + partition frame rhythm (computed from measured footprints). */
export function buildStructureCompletion(): P[] {
  const out: P[] = [];
  const H = SCALE.partitionHeight;

  // DEPT-01 walnut slat back wall (scene.walnut #897047; analysis/03 §2.2 + §4)
  const d1 = DEPARTMENTS.find((d) => d.id === 'DEPT-01')!.footprint;
  const backEdgeZ = Math.abs(d1.z0) > Math.abs(d1.z1) ? d1.z0 : d1.z1;
  const inner = backEdgeZ + (backEdgeZ < 0 ? 0.08 : -0.08);
  const w = d1.x1 - d1.x0 - 0.6;
  const walnutWall = box('walnut', [(d1.x0 + d1.x1) / 2, H / 2, inner], [w, H, 0.08], 0, 'WAL');
  walnutWall.refId = INTERIORS.find(i => i.kind === 'walnut-wall')?.id;
  out.push(walnutWall);

  // Partition frame rhythm on every atrium-facing glass front (analysis/03 §2.2)
  for (const d of DEPARTMENTS) {
    const e = frontEdge(d.footprint);
    const len = e.to - e.from;
    const bay = 0.96; // MEASURED facade bay (ENV-015) applied to partitions — EST. for partitions
    const n = Math.max(2, Math.round(len / bay));
    const t = 0.03;
    for (let i = 1; i < n; i++) {
      const u = e.from + (len * i) / n;
      const c: Vec3 = e.axis === 'z' ? [u, H / 2, e.at] : [e.at, H / 2, u];
      out.push(box('frame', c, e.axis === 'z' ? [t, H, t] : [t, H, t], 0, 'PF'));
    }
    // top + bottom rails
    const mid = (e.from + e.to) / 2;
    const sizeAlong = len;
    for (const [y] of [[H - 0.02], [0.05]] as const) {
      const c: Vec3 = e.axis === 'z' ? [mid, y, e.at] : [e.at, y, mid];
      out.push(box('frame', c, e.axis === 'z' ? [sizeAlong, 0.04, t] : [t, 0.04, sizeAlong], 0, 'PF'));
    }
  }
  return out;
}

/** VF-2: white wall slabs behind the Management whiteboard and Creative Studio pin-board (§2.2). */
function buildWallPanels(): P[] {
  const panels = INTERIORS.filter((i) => i.kind === 'wall-panel');
  return panels.map((p) => {
    const [w, , h] = p.size!;
    const panel = box('floor', [p.floor_xz![0], (p.centre_y ?? h / 2), p.floor_xz![1]], [w, h, 0.06], p.rot_y ?? 0, 'WP');
    panel.refId = p.id;
    return panel;
  });
}

const DESK_DEPT_MATERIAL: Record<string, 'deskwood' | 'floor' | 'darkwood'> = {
  // analysis/03 §6: light wood (Marketing), white (Engineering), grey/white (Creative, Research), wood/dark (QA), dark wood (Executive)
  'DEPT-01': 'darkwood', // review R21: ref Executive desk reads dark walnut (r20 row-2 zoom)
  'DEPT-02': 'deskwood',
  'DEPT-03': 'floor',
  'DEPT-04': 'floor',
  'DEPT-05': 'deskwood',
  'DEPT-06': 'floor',
  'DEPT-07': 'deskwood',
};

/** Standard heights/depths per kind (EST., analysis/03 §6 types); widths are px-derived. */
const KIND_DIM: Record<string, { d: (w: number) => number; h: (w: number, hpx: number) => number; mount?: number }> = {
  'exec-desk': { d: () => 0.9, h: () => 0.75 },
  desk: { d: () => 0.7, h: () => 0.75 },
  'conference-table': { d: () => 1.4, h: () => 0.75 },
  'lounge-chair': { d: (w) => w * 0.8, h: () => 0.85 },
  sofa: { d: () => 0.85, h: () => 0.8 },
  bench: { d: () => 0.6, h: () => 0.45 },
  ottoman: { d: (w) => w * 0.8, h: () => 0.4 },
  rug: { d: (w) => w * 0.55, h: () => 0.02 },
  'rug-round': { d: (w) => w, h: () => 0.02 },
  plant: { d: (w) => w, h: (_w, hpx) => hpx },
  tree: { d: (w) => w, h: (_w, hpx) => hpx },
  'planter-cyl': { d: (w) => w, h: (_w, hpx) => hpx },
  'planter-box': { d: (w) => w * 0.5, h: () => 0.5 },
  cabinet: { d: (w) => w * 0.5, h: () => 0.7 },
  rack: { d: (w) => w * 0.6, h: (_w, hpx) => hpx },
  'shelf-stand': { d: () => 0.35, h: (_w, hpx) => hpx },
  'shelf-wall': { d: () => 0.25, h: (_w, hpx) => hpx, mount: 1.2 },
  'display-wall': { d: () => 0.08, h: (_w, hpx) => hpx, mount: 0.9 },
  'display-stand': { d: () => 0.3, h: (_w, hpx) => hpx, mount: 0.5 },
  whiteboard: { d: () => 0.06, h: (_w, hpx) => hpx, mount: 0.8 },
};

function buildItem(it: InteriorItem): P[] {
  const out: P[] = [];
  const [x, z] = it.floor_xz!;
  const yaw = it.rot_y ?? 0;
  const pxW = it.size![0];
  const pxH = it.size![2];
  const dim = KIND_DIM[it.kind] ?? { d: (w) => w * 0.6, h: (_w, hpx) => hpx };
  const d = dim.d(pxW);
  const h = dim.h(pxW, pxH);
  const mount = dim.mount ?? 0;
  const refId = it.id;

  switch (it.kind) {
    case 'walnut-wall':
      return out; // emitted by buildStructureCompletion (footprint-derived)
    case 'wall-panel':
      return out; // emitted by buildWallPanels
    case 'exec-desk':
    case 'desk': {
      const mat = DESK_DEPT_MATERIAL[it.dept ?? ''] ?? 'deskwood';
      // Separate thin worktop from supports so the under-desk opening and desk silhouette remain visible.
      out.push(box(it.dept === 'DEPT-01' ? 'deskwood' : mat, [x, h - 0.025, z], [pxW, 0.05, d], yaw, 'D'));
      if (it.kind === 'exec-desk') {
        // The reference executive desk has a warm wood top and two light pedestal-like supports.
        for (const side of [-1, 1]) {
          const dx = side * pxW * 0.32;
          out.push(box('parapet', [x + Math.cos(yaw) * dx, h * 0.48, z - Math.sin(yaw) * dx], [pxW * 0.24, h * 0.86, d * 0.7], yaw, 'D'));
        }
        // A dark, open laptop is visible on the measured desktop; content remains abstract.
        const lx = x - Math.sin(yaw) * 0.08;
        const lz = z - Math.cos(yaw) * 0.08;
        out.push(box('darkwood', [lx, h + 0.025, lz], [0.42, 0.025, 0.28], yaw, 'LP'));
        out.push(box('frame', [lx + Math.sin(yaw) * 0.11, h + 0.13, lz + Math.cos(yaw) * 0.11], [0.4, 0.2, 0.035], yaw, 'LP'));
      } else {
        const legMat = mat === 'darkwood' ? 'darkwood' : 'frame';
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const lx = x + Math.cos(yaw) * sx * pxW * 0.43 + Math.sin(yaw) * sz * d * 0.38;
          const lz = z - Math.sin(yaw) * sx * pxW * 0.43 + Math.cos(yaw) * sz * d * 0.38;
          out.push(box(legMat, [lx, (h - 0.06) / 2, lz], [0.045, h - 0.06, 0.045], yaw, 'D'));
        }
      }
      if (it.dept === 'DEPT-01') {
        // measured walnut back-wall treatment
        out.push(box('walnut', [x - Math.sin(yaw) * (d * 0.5 + 0.14), 0.78, z - Math.cos(yaw) * (d * 0.5 + 0.14)], [pxW * 0.95, 1.56, 0.12], yaw, 'D'));
      }
      break;
    }
    case 'conference-table': {
      out.push(box('deskwood', [x, h - 0.03, z], [pxW, 0.06, d], yaw, 'CT'));
      // Preserve the open knee space under the long wooden conference top.
      for (const side of [-1, 1]) {
        const lx = x + Math.cos(yaw) * side * pxW * 0.34;
        const lz = z - Math.sin(yaw) * side * pxW * 0.34;
        out.push(box('deskwood', [lx, h * 0.48, lz], [0.12, h * 0.88, d * 0.82], yaw, 'CT'));
      }
      break;
    }
    case 'chair': {
      // Task-chair seat, back, centre post and five-spoke caster base (reference catalogue §6).
      out.push(box('rug', [x, 0.45, z], [0.48, 0.07, 0.48], yaw, 'CH'));
      out.push(box('rug', [x - Math.sin(yaw) * 0.2, 0.72, z - Math.cos(yaw) * 0.2], [0.46, 0.55, 0.07], yaw, 'CH'));
      out.push(cyl('frame', [x, 0.25, z], 0.045, 0.38, 10, 'CH'));
      for (let spoke = 0; spoke < 5; spoke++) {
        const a = yaw + spoke * Math.PI * 2 / 5;
        const r = 0.22;
        out.push(box('frame', [x + Math.sin(a) * r * 0.5, 0.07, z + Math.cos(a) * r * 0.5], [0.27, 0.035, 0.045], a, 'CH'));
        out.push(cyl('rug', [x + Math.sin(a) * r, 0.045, z + Math.cos(a) * r], 0.045, 0.06, 8, 'CH'));
      }
      break;
    }
    case 'lounge-chair': {
      out.push(box('bench', [x, 0.3, z], [pxW, 0.35, d], yaw, 'LC'));
      out.push(box('bench', [x - Math.sin(yaw) * d * 0.35, 0.6, z - Math.cos(yaw) * d * 0.35], [pxW, 0.5, 0.12], yaw, 'LC'));
      break;
    }
    case 'sofa': {
      out.push(box('leather', [x, 0.28, z], [pxW, 0.4, d], yaw, 'SF'));
      out.push(box('leather', [x - Math.sin(yaw) * d * 0.35, 0.55, z - Math.cos(yaw) * d * 0.35], [pxW, 0.5, 0.16], yaw, 'SF'));
      out.push(box('leather', [x + Math.cos(yaw) * pxW * 0.45, 0.45, z - Math.sin(yaw) * pxW * 0.45], [0.14, 0.35, d], yaw, 'SF'));
      out.push(box('leather', [x - Math.cos(yaw) * pxW * 0.45, 0.45, z + Math.sin(yaw) * pxW * 0.45], [0.14, 0.35, d], yaw, 'SF'));
      break;
    }
    case 'bench':
      out.push(box('bench', [x, h / 2, z], [pxW, h, d], yaw, 'BN'));
      break;
    case 'ottoman':
      out.push(box('rug', [x, h / 2, z], [pxW, h, d], yaw, 'OT'));
      break;
    case 'rug':
      // The measured Executive Office rug is an elongated rectangular textile, not a circular mat:
      // keep the catalog-derived width and depth rather than using the former width-sized cylinder.
      out.push(box('rug', [x, 0.011, z], [pxW, 0.022, d], yaw, 'RG'));
      break;
    case 'rug-round':
      out.push(cyl('rug', [x, 0.011, z], Math.max(pxW, d) / 2, 0.022, 28, 'RG'));
      break;
    case 'plant': {
      // reset: the reference plants are lush multi-cluster canopies filling their measured extent
      const potH = Math.min(0.42, h * 0.28);
      const potR = Math.min(pxW * 0.32, 0.35);
      out.push(cyl('parapet', [x, potH / 2, z], potR, potH, 16, 'PL'));
      const canopy = h - potH;
      const rMain = Math.min(pxW * 0.55, canopy * 0.42);
      out.push(sphere('foliage', [x, potH + canopy * 0.52, z], rMain, 'PL'));
      for (const [dx, dy, dz, k] of [[0.55, 0.22, 0.1, 0.72], [-0.5, 0.3, -0.15, 0.66], [0.15, 0.5, -0.5, 0.6], [-0.3, 0.6, 0.45, 0.55], [0.1, -0.15, 0.4, 0.5]] as const) {
        out.push(sphere('foliage', [x + dx * rMain, potH + canopy * (0.5 + dy), z + dz * rMain], rMain * k, 'PL'));
      }
      break;
    }
    case 'tree': {
      const trunkH = h * 0.45;
      out.push(cyl('deskwood', [x, trunkH / 2, z], Math.max(0.08, pxW * 0.05), trunkH, 10, 'TR'));
      out.push(sphere('foliage', [x, trunkH + h * 0.28, z], pxW * 0.52, 'TR'));
      for (const [dx, dy, dz, k] of [[0.6, 0.35, 0.1, 0.6], [-0.55, 0.3, -0.2, 0.55], [0.1, 0.55, -0.5, 0.5], [-0.2, 0.5, 0.45, 0.45]] as const) {
        out.push(sphere('foliage', [x + dx * pxW * 0.5, trunkH + h * (0.28 + dy * 0.4), z + dz * pxW * 0.5], pxW * 0.5 * k, 'TR'));
      }
      break;
    }
    case 'planter-cyl': {
      out.push(cyl('planter', [x, h / 2, z], pxW / 2, h, 24, 'PC'));
      out.push(cyl('foliage', [x, h + 0.02, z], pxW * 0.44, 0.12, 20, 'PC'));
      break;
    }
    case 'planter-box': {
      out.push(box('deskwood', [x, h / 2, z], [pxW, h, d], yaw, 'PB'));
      out.push(box('foliage', [x, h + 0.06, z], [pxW * 0.85, 0.12, d * 0.8], yaw, 'PB'));
      break;
    }
    case 'cabinet':
      out.push(box('bench', [x, h / 2, z], [pxW, h, d], yaw, 'CB'));
      break;
    case 'rack': {
      out.push(box('frame', [x, h / 2, z], [pxW, h, d], yaw, 'RK'));
      // reset: the reference server banks glow blue across the whole front face
      out.push(box('screen', [x, h * 0.55, z], [pxW * 0.88, h * 0.66, d * 1.02], yaw, 'RK'));
      break;
    }
    case 'shelf-stand': {
      const shelves = 3;
      // Floor-standing bookcases in Marketing, Creative Studio and Research visibly hold books/decor.
      out.push(box('deskwood', [x, h / 2, z - Math.cos(yaw) * d * 0.42], [pxW * 0.94, h * 0.96, 0.045], yaw, 'SH'));
      for (let i = 0; i < shelves; i++) {
        const y = (h * (i + 1)) / (shelves + 1);
        out.push(box('deskwood', [x, y, z], [pxW, 0.045, d], yaw, 'SH'));
        const bookCount = Math.max(4, Math.min(10, Math.floor(pxW / 0.16)));
        const bookW = Math.min(0.12, (pxW * 0.76) / bookCount);
        for (let k = 0; k < bookCount; k++) {
          const u = (k - (bookCount - 1) / 2) * (pxW * 0.76 / bookCount);
          const bookH = h * (0.13 + ((k * 7 + i * 3) % 4) * 0.018);
          const bookY = y + bookH / 2 + 0.025;
          const bookX = x + Math.cos(yaw) * u;
          const bookZ = z - Math.sin(yaw) * u;
          const bookMat = ['darkwood', 'leather', 'deskwood'][(k + i) % 3] as BoxSpec['material'];
          out.push(box(bookMat, [bookX, bookY, bookZ], [bookW, bookH, d * 0.62], yaw, 'BK'));
        }
      }
      out.push(box('deskwood', [x - Math.cos(yaw) * pxW * 0.48, h / 2, z + Math.sin(yaw) * pxW * 0.48], [0.055, h, d], yaw, 'SH'));
      out.push(box('deskwood', [x + Math.cos(yaw) * pxW * 0.48, h / 2, z - Math.sin(yaw) * pxW * 0.48], [0.055, h, d], yaw, 'SH'));
      break;
    }
    case 'shelf-wall': {
      // The catalogue centre_y is measured from the floor; the previous mount=1.2 m offset
      // displaced these shelves well above their reference boxes (DEPT-01 by up to 65 px).
      const shelfCentreY = it.centre_y ?? mount + h / 2;
      for (const [fy, fw] of [[0.3, 1], [0.62, 1], [0.9, 0.8]] as const) {
        const shelfY = shelfCentreY + h * (fy - 0.5);
        out.push(box('deskwood', [x, shelfY, z], [pxW * fw, 0.04, d], yaw, 'SW'));
        const n = 3;
        for (let i = 0; i < n; i++) {
          const ox = (i - (n - 1) / 2) * pxW * 0.22;
          const oy = shelfY + 0.09;
          if (i % 2 === 0) out.push(cyl('foliage', [x + Math.cos(yaw) * ox, oy, z - Math.sin(yaw) * ox], 0.055, 0.1, 10, 'SW'));
          else out.push(box('leather', [x + Math.cos(yaw) * ox, oy - 0.02, z - Math.sin(yaw) * ox], [0.07, 0.14, 0.07], yaw, 'SW'));
        }
      }
      break;
    }
    case 'display-wall':
    case 'display-stand': {
      // review R22: centre_y in the JSON is the MEASURED screen centre when present (px-box derived);
      // the KIND_DIM mount default only applies when no measurement exists.
      const cy = it.centre_y ?? mount + h / 2;
      out.push(box('frame', [x, cy, z], [pxW, h, 0.06], yaw, 'DP'));
      // reset: the reference shows display screens glowing from both sides — slab proud of the frame
      out.push(box('screen', [x, cy, z], [pxW * 0.96, h * 0.94, 0.07], yaw, 'DP'));
      if (it.kind === 'display-stand') out.push(box('frame', [x, mount / 2, z], [0.08, mount, 0.08], yaw, 'DP'));
      break;
    }
    case 'whiteboard': {
      // centre_y stores the measured wall-panel centre when present; do not add an estimated mount offset.
      const cy = it.centre_y ?? mount + h / 2;
      out.push(box('floor', [x, cy, z], [pxW, h, 0.05], yaw, 'WBS'));
      out.push(box('frame', [x, cy, z], [pxW * 1.02, h * 1.02, 0.03], yaw, 'WBF'));
      break;
    }
    case 'laptop': {
      const y = it.centre_y ?? 0.75;
      out.push(box('frame', [x, y + 0.01, z], [0.34, 0.02, 0.24], yaw, 'LP'));
      out.push(box('screen', [x - Math.sin(yaw) * 0.1, y + 0.12, z - Math.cos(yaw) * 0.1], [0.32, 0.22, 0.035], yaw, 'LP'));
      break;
    }
    case 'monitor': {
      out.push(box('frame', [x, 0.75 + 0.12, z], [0.06, 0.24, 0.05], yaw, 'MO'));
      // The reference shows desk displays as dark-bezel monitors with blue UI content. Keep the
      // abstract, non-text UI on the screen face only; exact per-monitor content is not legible.
      const TILT = 0.6;
      out.push({ ...box('frame', [x, 0.93, z], [0.55, 0.36, 0.04], yaw, 'MOF'), tilt: TILT });
      out.push({ ...box('monitorscreen', [x, 0.93, z], [0.56, 0.37, 0.052], yaw, 'MOS'), tilt: TILT });
      break;
    }
    default:
      break;
  }
  if (out.length) for (const s of out) s.refId = s.refId ?? refId;
  return out;
}

/** VF-3: all furniture/large-display primitives from the measured data. */
export function buildInteriors(): P[] {
  seq = 0;
  const out: P[] = [...buildWallPanels()];
  for (const it of INTERIORS) {
    if (it.kind === 'wall-panel' || it.kind === 'walnut-wall') continue;
    out.push(...buildItem(it));
  }
  return out;
}
