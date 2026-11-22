/**
 * Reference-image features (original px, 1672 × 941) used to validate the greybox. These are
 * copied verbatim from the Mission 002/003 documents. They are measurements, not geometry
 * inputs: nothing here moves any part of the scene.
 */
import type { DeptId } from './sceneConfig';

export type CornerKey = 'x0z0' | 'x1z0' | 'x1z1' | 'x0z1';

/**
 * Digitised partition floor corners (architecture/05 §3.5; corner indices from the M003 solver:
 * screen +X runs right-down, screen +Z runs left-down). Uncertainty ±5 px (digitising).
 */
export const DIGITISED_CORNERS: { dept: DeptId; name: string; px: [number, number]; corner: CornerKey }[] = [
  { dept: 'DEPT-02', name: 'Marketing near floor corner', px: [371, 420], corner: 'x1z1' },
  { dept: 'DEPT-05', name: 'Management left corner-post foot', px: [1260, 539], corner: 'x0z1' },
  { dept: 'DEPT-05', name: 'Management near floor corner', px: [1508, 653], corner: 'x1z1' },
  { dept: 'DEPT-06', name: 'Research right corner-post foot', px: [885, 720], corner: 'x1z0' },
  { dept: 'DEPT-07', name: 'QA right wall-end foot', px: [1323, 750], corner: 'x1z0' },
];

/** Leave-one-out residuals from architecture/05 §3.5, reported for context (px). */
export const DIGITISED_CORNERS_LOO_PX: Record<string, number> = {
  'Marketing near floor corner': 26.5,
  'Management left corner-post foot': 13.7,
  'Management near floor corner': 72.1,
  'Research right corner-post foot': 33.2,
  'QA right wall-end foot': 10.5,
};

/** Slab-edge line measurements (architecture/05 §3.6, M003 scratch valid.py). */
export const SLAB_EDGE_LINES: { id: string; edge: '+Z' | '+X'; label: string; a: [number, number]; b: [number, number] }[] = [
  { id: 'LL_02_spec', edge: '+Z', label: 'analysis/02 + 03 lower-left line (erratum E-02)', a: [237, 597], b: [480, 826] },
  { id: 'LL_crop_est', edge: '+Z', label: 'M003 re-measured lower-left edge', a: [235, 630], b: [560, 820] },
  { id: 'LL_measured_hough', edge: '+Z', label: 'M003 Hough lower-left segment', a: [534, 785], b: [583, 817] },
  { id: 'LR_02_spec', edge: '+X', label: 'analysis/02 lower-right line (ENV-015 top edge)', a: [1333, 821], b: [1672, 597] },
  { id: 'LR_measured_hough', edge: '+X', label: 'M003 longest Hough lower-right segment', a: [1360, 839], b: [1669, 576] },
];

/** Measured sign-plate screen rotations (deg, analysis/02 §4; architecture/05 §3.3). */
export const SIGN_ANGLES_DEG: Record<string, number> = {
  'SIGN-01': 0,
  'SIGN-02': -24,
  'SIGN-03': 26,
  'SIGN-04': -24,
  'SIGN-05': 22,
  'SIGN-06': -27,
  'SIGN-07': 26,
};

/** Measured envelope-centre offsets from the plinth centre (architecture/05 §3.8, VAC-GEO-04). */
export const RING_OFFSETS_PX: Record<DeptId, [number, number]> = {
  'DEPT-01': [-38, -275],
  'DEPT-02': [-457, -215],
  'DEPT-03': [347, -210],
  'DEPT-04': [-467, 65],
  'DEPT-05': [558, 30],
  'DEPT-06': [-228, 178],
  'DEPT-07': [247, 178],
};

/** Plinth centre in the reference (ENV-002 box centre). */
export const PLINTH_CENTRE_PX: [number, number] = [903, 500];

/* ── Mission 006-A measured fascia steps (scratch luminance probe, 2026-11-20) ── */
/**
 * Strongest bright→dark step below the slab edge = bottom of the bright fascia band.
 * [screenX, stepY] pairs, original reference px, 1672×941. Used only for validation.
 */
export const FASCIA_STEP_PX: { edge: '+Z' | '+X'; u: number; px: [number, number] }[] = [
  // +Z: strongest bright→dark step below the model edge, sx 250..450 (u = x on the edge plane,
  // solved exactly with the HOME projector; sx 350 had a tracker glitch and is excluded)
  ...([
    [250, 656, -5.3606], [270, 670, -4.6925], [290, 683, -4.0304], [310, 696, -3.3743], [330, 709, -2.7241],
    [370, 736, -1.4407], [390, 749, -0.8075], [410, 762, -0.1799], [430, 776, 0.4423], [450, 789, 1.0591],
  ] as [number, number, number][]).map(([sx, sy, u]) => ({ edge: '+Z' as const, u, px: [sx, sy] as [number, number] })),
  // +X: sx 1350..1570 (u = z on the edge plane, solved exactly with the HOME projector)
  ...([
    [1350, 847, 2.3189], [1370, 831, 1.7038], [1390, 815, 1.0832], [1410, 799, 0.4572], [1430, 783, -0.1743],
    [1450, 767, -0.8114], [1470, 752, -1.4542], [1490, 737, -2.1027], [1510, 721, -2.7571], [1530, 706, -3.4173],
    [1550, 691, -4.0836], [1570, 675, -4.7559],
  ] as [number, number, number][]).map(([sx, sy, u]) => ({ edge: '+X' as const, u, px: [sx, sy] as [number, number] })),
];
