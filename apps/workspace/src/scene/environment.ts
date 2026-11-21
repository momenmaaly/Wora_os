/**
 * Mission 006-A environment model (WORA-3D-SCENE-006-A): fascia, facade glazing, back exterior
 * walls, balustrade frames, plinth details, light strips and backdrop scenery.
 *
 * Every measured value comes from scene-architecture.json `environment` (schema v2, measured from
 * the locked reference in the 2026-11-20 scratch probe). Scenery is placed by back-projection onto
 * assumed planes (projects back to its reference pixels in HOME by construction; CR-02 background).
 * Scope guard: NO robots, NO furniture, NO decorative effects beyond the catalogued emissive strips.
 */
import {
  DEPARTMENTS,
  ENV,
  fasciaPlusXBot,
  fasciaPlusZBot,
  SCALE,
} from '../config/sceneConfig';
import {
  slabFootprint,
  type BoxSpec,
  type CylinderSpec,
  type DiscSpec,
  type LabelSpec,
  type RibbonSpec,
  SIGN_LENGTH_M,
} from './model';

export interface EnvironmentModel {
  fascia: RibbonSpec[];
  facadePanes: RibbonSpec[];
  facadeMullions: BoxSpec[];
  facadeTransoms: BoxSpec[];
  backGlazingPanes: BoxSpec[];
  backGlazingMullions: BoxSpec[];
  balustradeFrames: BoxSpec[];
  plinthRim: CylinderSpec;
  plinthLabels: LabelSpec[];
  signFaces: LabelSpec[];
  partitionStrips: BoxSpec[];
  edgeStrips: BoxSpec[];
  backdropCity: BoxSpec[];
  backdropDecks: BoxSpec[];
  backdropParapet: RibbonSpec[];
  backdropParapetStrips: RibbonSpec[];
  backdropTrees: DiscSpec[];
  /** VF-5: trunks under the terrace trees (catalogued structure, positions on the same assumed planes). */
  backdropTreeTrunks: CylinderSpec[];
}

export const SIGN_ICONS: Record<string, string> = {
  'SIGN-01': 'crown',
  'SIGN-02': 'megaphone',
  'SIGN-03': 'code',
  'SIGN-04': 'palette',
  'SIGN-05': 'chart',
  'SIGN-06': 'flask',
  'SIGN-07': 'shield',
};

const FLOOR_BOTTOM = ENV.facade_glazing.bottom_m;
const BAY = ENV.facade_glazing.mullion_bay_m;
const TRANSOM = ENV.facade_glazing.transom_spacing_m;

function ribbon(key: string, material: RibbonSpec['material'], axis: 'x' | 'z', at: number, pts: { u: number; yTop: number; yBot: number }[], refId?: string): RibbonSpec {
  return { key, refId, kind: 'ribbon', material, axis, at, pts };
}

function fasciaRibbons(): RibbonSpec[] {
  const { x0, x1, z0, z1 } = slabFootprint();
  const out: RibbonSpec[] = [];
  // +Z (lower-left on screen): fitted bottom y = -0.374 - 0.0121 x (measured x -9.5..4.4)
  {
    const n = 16;
    const pts = Array.from({ length: n + 1 }, (_, i) => {
      const u = x0 + ((x1 - x0) * i) / n;
      return { u, yTop: 0, yBot: fasciaPlusZBot(u) };
    });
    out.push(ribbon('fascia-plusZ', 'fascia', 'x', z1 + 0.012, pts, 'ENV-014'));
  }
  // +X (lower-right on screen): piecewise; vanishes for z <= -4.23 (measured z -3.15..2.35)
  {
    const u0 = ENV.fascia.plusX.piecewise[1].z_range[0];
    const n = 16;
    const pts = Array.from({ length: n + 1 }, (_, i) => {
      const u = u0 + ((z1 - u0) * i) / n;
      return { u, yTop: 0, yBot: fasciaPlusXBot(u) };
    });
    out.push(ribbon('fascia-plusX', 'fascia', 'z', x1 + 0.012, pts, 'ENV-015'));
  }
  // -X / -Z: straight est. bands (no measurable reference line; styled after the +Z range)
  {
    const n = 8;
    out.push(
      ribbon(
        'fascia-minusX',
        'fascia',
        'z',
        x0 - 0.012,
        Array.from({ length: n + 1 }, (_, i) => ({ u: z0 + ((z1 - z0) * i) / n, yTop: 0, yBot: -ENV.fascia.minusX.thickness_m })),
        'ENV-014',
      ),
      ribbon(
        'fascia-minusZ',
        'fascia',
        'x',
        z0 - 0.012,
        Array.from({ length: n + 1 }, (_, i) => ({ u: x0 + ((x1 - x0) * i) / n, yTop: 0, yBot: -ENV.fascia.minusZ.thickness_m })),
        'ENV-015',
      ),
    );
  }
  return out;
}

/** Glazing below the fascia on the two visible sides (ENV-014 / ENV-015). */
function facade(): { panes: RibbonSpec[]; mullions: BoxSpec[]; transoms: BoxSpec[] } {
  const { x0, x1, z0, z1 } = slabFootprint();
  const panes: RibbonSpec[] = [];
  const mullions: BoxSpec[] = [];
  const transoms: BoxSpec[] = [];
  // +Z pane
  {
    const n = 16;
    panes.push(
      ribbon(
        'facade-plusZ',
        'glazing',
        'x',
        z1 + 0.012,
        Array.from({ length: n + 1 }, (_, i) => {
          const u = x0 + ((x1 - x0) * i) / n;
          return { u, yTop: fasciaPlusZBot(u), yBot: FLOOR_BOTTOM };
        }),
        'ENV-014',
      ),
    );
    for (let u = x0 + BAY / 2; u < x1; u += BAY) {
      const yTop = fasciaPlusZBot(u);
      mullions.push({ key: `facade-plusZ-mullion-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [u, (yTop + FLOOR_BOTTOM) / 2, z1 + 0.012], size: [0.06, yTop - FLOOR_BOTTOM, 0.06], rotationY: 0, refId: 'ENV-014' });
    }
    for (let y = -TRANSOM; y > FLOOR_BOTTOM + 0.5; y -= TRANSOM) {
      transoms.push({ key: `facade-plusZ-transom-${y}`, kind: 'box', material: 'frame', center: [(x0 + x1) / 2, y, z1 + 0.012], size: [x1 - x0, 0.05, 0.05], rotationY: 0, refId: 'ENV-014' });
    }
  }
  // +X pane
  {
    const u0 = ENV.fascia.plusX.piecewise[1].z_range[0];
    const n = 16;
    panes.push(
      ribbon(
        'facade-plusX',
        'glazing',
        'z',
        x1 + 0.012,
        Array.from({ length: n + 1 }, (_, i) => {
          const u = u0 + ((z1 - u0) * i) / n;
          return { u, yTop: Math.min(fasciaPlusXBot(u), -0.3), yBot: FLOOR_BOTTOM };
        }),
        'ENV-015',
      ),
    );
    for (let u = z0 + BAY / 2; u < z1; u += BAY) {
      const yTop = Math.min(fasciaPlusXBot(u), -0.3);
      mullions.push({ key: `facade-plusX-mullion-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [x1 + 0.012, (yTop + FLOOR_BOTTOM) / 2, u], size: [0.06, yTop - FLOOR_BOTTOM, 0.06], rotationY: 0, refId: 'ENV-015' });
    }
    for (let y = -TRANSOM; y > FLOOR_BOTTOM + 0.5; y -= TRANSOM) {
      transoms.push({ key: `facade-plusX-transom-${y}`, kind: 'box', material: 'frame', center: [x1 + 0.012, y, (z0 + z1) / 2], size: [0.05, 0.05, z1 - z0], rotationY: 0, refId: 'ENV-015' });
    }
  }
  return { panes, mullions, transoms };
}

/** Exterior wall above the floor on the two back sides (y 0..partition height, est.). */
function backGlazing(): { panes: BoxSpec[]; mullions: BoxSpec[] } {
  const { x0, x1, z0, z1 } = slabFootprint();
  const h = SCALE.partitionHeight;
  const panes: BoxSpec[] = [
    { key: 'backglazing-minusZ', kind: 'box', material: 'partition', center: [(x0 + x1) / 2, h / 2, z0 - 0.02], size: [x1 - x0, h, 0.04], rotationY: 0, refId: 'ENV-016' },
    { key: 'backglazing-minusX', kind: 'box', material: 'partition', center: [x0 - 0.02, h / 2, (z0 + z1) / 2], size: [0.04, h, z1 - z0], rotationY: 0, refId: 'ENV-016' },
  ];
  const mullions: BoxSpec[] = [];
  for (let u = x0 + BAY / 2; u < x1; u += BAY) mullions.push({ key: `backglazing-minusZ-m-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [u, h / 2, z0 - 0.02], size: [0.04, h, 0.04], rotationY: 0, refId: 'ENV-016' });
  for (let u = z0 + BAY / 2; u < z1; u += BAY) mullions.push({ key: `backglazing-minusX-m-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [x0 - 0.02, h / 2, u], size: [0.04, h, 0.04], rotationY: 0, refId: 'ENV-016' });
  return { panes, mullions };
}

/** Anthracite top rail + posts on the two visible balustrades (styling est.). */
function balustradeFrames(): BoxSpec[] {
  const { x0, x1, z0, z1 } = slabFootprint();
  const bh = SCALE.balustradeHeight;
  const bay = ENV.balustrade_frame.post_bay_m;
  const out: BoxSpec[] = [
    { key: 'balframe-plusZ-rail', kind: 'box', material: 'frame', center: [(x0 + x1) / 2, bh + 0.025, z1], size: [x1 - x0, 0.04, 0.06], rotationY: 0, refId: 'G-02' },
    { key: 'balframe-plusX-rail', kind: 'box', material: 'frame', center: [x1, bh + 0.025, (z0 + z1) / 2], size: [0.06, 0.04, z1 - z0], rotationY: 0, refId: 'G-03' },
  ];
  for (let u = x0 + bay / 2; u < x1; u += bay) out.push({ key: `balframe-plusZ-post-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [u, bh / 2, z1], size: [0.025, bh, 0.025], rotationY: 0, refId: 'G-02' });
  for (let u = z0 + bay / 2; u < z1; u += bay) out.push({ key: `balframe-plusX-post-${u.toFixed(2)}`, kind: 'box', material: 'frame', center: [x1, bh / 2, u], size: [0.025, bh, 0.025], rotationY: 0, refId: 'G-03' });
  return out;
}

/** Emissive strips: partition tops (28) + the two visible slab-edge bases (analysis/03 §9). */
function strips(): { partition: BoxSpec[]; edge: BoxSpec[] } {
  const partition: BoxSpec[] = [];
  for (const d of DEPARTMENTS) {
    const { x0, x1, z0, z1 } = d.footprint;
    const h = d.partitionHeight;
    const t = 0.05;
    const cx = (x0 + x1) / 2;
    const cz = (z0 + z1) / 2;
    const sx = x1 - x0 + t;
    const sz = z1 - z0 + t;
    const y = h + 0.01;
    partition.push(
      { key: `${d.id}-strip-z0`, kind: 'box', material: 'strip', center: [cx, y, z0], size: [sx, 0.03, 0.03], rotationY: 0, refId: d.id },
      { key: `${d.id}-strip-z1`, kind: 'box', material: 'strip', center: [cx, y, z1], size: [sx, 0.03, 0.03], rotationY: 0, refId: d.id },
      { key: `${d.id}-strip-x0`, kind: 'box', material: 'strip', center: [x0, y, cz], size: [0.03, 0.03, sz], rotationY: 0, refId: d.id },
      { key: `${d.id}-strip-x1`, kind: 'box', material: 'strip', center: [x1, y, cz], size: [0.03, 0.03, sz], rotationY: 0, refId: d.id },
    );
  }
  const { x0, x1, z0, z1 } = slabFootprint();
  const edge: BoxSpec[] = [
    { key: 'slab-strip-plusZ', kind: 'box', material: 'strip', center: [(x0 + x1) / 2, 0.01, z1], size: [x1 - x0, 0.03, 0.03], rotationY: 0, refId: 'G-02' },
    { key: 'slab-strip-plusX', kind: 'box', material: 'strip', center: [x1, 0.01, (z0 + z1) / 2], size: [0.03, 0.03, z1 - z0], rotationY: 0, refId: 'G-03' },
  ];
  return { partition, edge };
}

function plinthDetails(): { rim: CylinderSpec; labels: LabelSpec[] } {
  const logo = ENV.plinth_details.logo;
  const word = ENV.plinth_details.wordmark;
  const rim: CylinderSpec = {
    key: 'plinth-rim',
    refId: 'ENV-002',
    kind: 'cylinder',
    material: 'rim',
    center: [0, 0.059, 0],
    radius: 2.393,
    // 0.118 < dais top 0.12 so the drum top stays measurable in flat mode; ring stays proud
    height: 0.118,
    segments: 128,
  };
  const labels: LabelSpec[] = [
    { key: 'plinth-logo', refId: logo.ref, kind: 'label', text: '', icon: 'wora-mark', center: logo.center_world as [number, number, number], size: [logo.size_m[0], logo.size_m[1]], rotationY: Math.PI / 4, orientation: 'flat' },
    { key: 'plinth-wordmark', refId: word.ref, kind: 'label', text: 'WORA', color: '#68646B', center: word.center_world as [number, number, number], size: [word.size_m[0], word.size_m[1]], rotationY: Math.PI / 4, orientation: 'flat' },
  ];
  return { rim, labels };
}

/** Sign-face label planes (catalogued text + icon), 0.027 m in front of each plate. */
function signFaces(): LabelSpec[] {
  const out: LabelSpec[] = [];
  for (const d of DEPARTMENTS) {
    const a = d.sign.anchorWorld;
    let normal: [number, number, number];
    let rotationY: number;
    if (d.sign.wall === 'x0') {
      normal = [1, 0, 0];
      rotationY = Math.PI / 2;
    } else if (d.sign.wall === 'z0') {
      normal = [0, 0, 1];
      rotationY = 0;
    } else {
      normal = [Math.SQRT1_2, 0, Math.SQRT1_2];
      rotationY = Math.PI / 4;
    }
    out.push({
      key: `${d.sign.id}-face`,
      refId: d.sign.id,
      kind: 'label',
      text: d.name,
      icon: SIGN_ICONS[d.sign.id],
      center: [a[0] + normal[0] * 0.027, a[1] + normal[1] * 0.027, a[2] + normal[2] * 0.027],
      size: [SIGN_LENGTH_M[d.sign.id], 0.93],
      rotationY,
      orientation: 'upright',
    });
  }
  return out;
}

/** Backdrop scenery (CR-02): city cards, terrace decks + parapet bands, greenery discs. */
function backdrop(): { city: BoxSpec[]; decks: BoxSpec[]; parapet: RibbonSpec[]; parapetStrips: RibbonSpec[]; trees: DiscSpec[]; trunks: CylinderSpec[] } {
  const bd = ENV.backdrop;
  // reset: the reference shows a continuous bright stone terrace outside the balustrades; the
  // deck extents are EST. between the building edges (CR-01/02) and the assumed parapet planes
  const decks: BoxSpec[] = [];
  const td = (ENV as { terrace_decks?: Record<string, { x_range: [number, number]; z_range: [number, number]; top_y: number; thickness: number }> }).terrace_decks;
  if (td) {
    for (const [name, t] of Object.entries(td)) {
      decks.push({
        key: `terrace-deck-${name}`,
        kind: 'box',
        material: 'deck',
        center: [(t.x_range[0] + t.x_range[1]) / 2, t.top_y - t.thickness / 2, (t.z_range[0] + t.z_range[1]) / 2],
        size: [t.x_range[1] - t.x_range[0], t.thickness, t.z_range[1] - t.z_range[0]],
        rotationY: 0,
        refId: 'ENV-016',
      });
    }
  }
  const p = bd.planes;
  const city: BoxSpec[] = [
    {
      key: 'city-back-right',
      kind: 'box',
      material: 'city',
      center: [(bd.city.back_right.x_range[0] + bd.city.back_right.x_range[1]) / 2, (bd.city.back_right.y_range[0] + bd.city.back_right.y_range[1]) / 2, p.city_right_z],
      size: [bd.city.back_right.x_range[1] - bd.city.back_right.x_range[0], bd.city.back_right.y_range[1] - bd.city.back_right.y_range[0], 0.1],
      rotationY: 0,
      refId: 'ENV-016',
    },
    {
      key: 'city-back-left',
      kind: 'box',
      material: 'city',
      center: [p.city_left_x, (bd.city.back_left.y_range[0] + bd.city.back_left.y_range[1]) / 2, (bd.city.back_left.z_range[0] + bd.city.back_left.z_range[1]) / 2],
      size: [0.1, bd.city.back_left.y_range[1] - bd.city.back_left.y_range[0], bd.city.back_left.z_range[1] - bd.city.back_left.z_range[0]],
      rotationY: 0,
      refId: 'ENV-016',
    },
  ];
  const parapet: RibbonSpec[] = [];
  const parapetStrips: RibbonSpec[] = [];
  for (const [name, band] of [['right', bd.terrace_parapet_right], ['left', bd.terrace_parapet_left]] as const) {
    const axis = band.ribbon_axis as 'x' | 'z';
    const at = axis === 'x' ? p.back_right_z : p.back_left_x;
    const raw = ((band as { top_pts_world_xy?: number[][]; top_pts_world_zy?: number[][] }).top_pts_world_xy ?? (band as { top_pts_world_zy?: number[][] }).top_pts_world_zy) as [number, number][];
    // reset: the pts' world-y swing (−0.46…−5.5) is a documented artifact of the assumed constant
    // plane; the reconstruction uses a constant balustrade top over the deck (top_y_reset=1.05)
    const topY = (band as { top_y_reset?: number }).top_y_reset ?? 1.05;
    const pts = raw.map(([u]) => ({ u, yTop: topY, yBot: topY - band.depth_m }));
    parapet.push(ribbon(`parapet-${name}`, 'parapet', axis, at, pts, 'ENV-016'));
    parapetStrips.push(
      ribbon(
        `parapet-${name}-strip`,
        'strip',
        axis,
        at + (axis === 'x' ? 0.0 : 0.0),
        pts.map((q) => ({ u: q.u, yTop: q.yTop + 0.012, yBot: q.yTop - 0.018 })),
        'ENV-016',
      ),
    );
  }
  const trees: DiscSpec[] = [];
  const trunks: CylinderSpec[] = [];
  for (const [name, list, normal] of [['right_terrace', bd.trees.right_terrace, 'z'], ['left_terrace', bd.trees.left_terrace, 'x'], ['bottom_right', bd.trees.bottom_right, 'x']] as const) {
    for (const [i, t] of (list as { c: [number, number, number]; r_m: number }[]).entries()) {
      trees.push({ key: `tree-${name}-${i}`, kind: 'disc', material: 'foliage', center: t.c, radius: t.r_m, normal: normal as 'x' | 'z', refId: 'ENV-016' });
      // VF-5: the reference shows light trunks under the terrace canopies (analysis/03 §3/§4).
      // Trunk length EST. (r × 1.5) on the same assumed plane (CR-02); canopy position unchanged.
      const trunkLen = t.r_m * 1.5;
      const c: [number, number, number] = [t.c[0], t.c[1] - t.r_m * 0.6 - trunkLen / 2, t.c[2]];
      trunks.push({ key: `tree-${name}-${i}-trunk`, kind: 'cylinder', material: 'deskwood', center: c, radius: Math.max(0.06, t.r_m * 0.12), height: trunkLen, segments: 10, refId: 'ENV-016' });
    }
  }
  return { city, decks, parapet, parapetStrips, trees, trunks };
}

export function buildEnvironmentModel(): EnvironmentModel {
  const facadeParts = facade();
  const back = backGlazing();
  const s = strips();
  const plinth = plinthDetails();
  const bd = backdrop();
  return {
    fascia: fasciaRibbons(),
    facadePanes: facadeParts.panes,
    facadeMullions: facadeParts.mullions,
    facadeTransoms: facadeParts.transoms,
    backGlazingPanes: back.panes,
    backGlazingMullions: back.mullions,
    balustradeFrames: balustradeFrames(),
    plinthRim: plinth.rim,
    plinthLabels: plinth.labels,
    signFaces: signFaces(),
    partitionStrips: s.partition,
    edgeStrips: s.edge,
    backdropCity: bd.city,
    backdropDecks: bd.decks,
    backdropParapet: bd.parapet,
    backdropParapetStrips: bd.parapetStrips,
    backdropTrees: bd.trees,
    backdropTreeTrunks: bd.trunks,
  };
}
