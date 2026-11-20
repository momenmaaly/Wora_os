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
