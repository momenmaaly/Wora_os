/**
 * Rendered-frame self-check (dev only). Requires the dev route in flat ID-colour mode
 * (`?dev&flat=1&partitions=0&balustrades=0&markers=0&edges=0&panel=0`, HOME camera).
 *
 * Reads the actual WebGL canvas pixels, segments the unlit ID colours and compares what was
 * RENDERED with what the camera math PROJECTS for the same model. This proves the running app
 * draws the validated geometry (renderer ≡ projection), independent of the unit tests.
 * Exposed as `window.__WORA_RENDERED_CHECK__()` for scripted runs.
 */
import type { PerspectiveCamera } from 'three';
import { projectToPixels } from '../scene/camera';
import { boxCorners, buildGreyboxModel, footprintCorners } from '../scene/model';
import { DEPT_FLAT_COLORS, FLAT_COLORS } from '../scene/materials';
import { PLINTH } from '../config/sceneConfig';

type Px = [number, number];
const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;

export interface RenderedCheckResult {
  canvas: [number, number];
  plinth: { rendered: number[]; projected: number[]; maxEdgeErrPx: number };
  floors: { id: string; maxCornerErrPx: number | null; corners: { rendered: Px; projected: Px; inFrame: boolean; occluded: boolean }[] }[];
  signs: { id: string; rendered: number[]; projected: number[]; maxEdgeErrPx: number }[];
  summary: { plinthMaxPx: number; floorCornerMaxPx: number; signMaxPx: number };
}

export function renderedCheck(canvas: HTMLCanvasElement, camera: PerspectiveCamera): RenderedCheckResult {
  const W = canvas.width;
  const H = canvas.height;
  const c2 = document.createElement('canvas');
  c2.width = W;
  c2.height = H;
  const ctx = c2.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(canvas, 0, 0);
  const data = ctx.getImageData(0, 0, W, H).data;
  const near = (i: number, c: [number, number, number]) => Math.abs(data[i] - c[0]) + Math.abs(data[i + 1] - c[1]) + Math.abs(data[i + 2] - c[2]) < 40;

  const scan = (color: string, region?: { x0: number; y0: number; x1: number; y1: number }) => {
    const c = hex(color);
    const pts: Px[] = [];
    const x0 = Math.max(0, Math.floor(region?.x0 ?? 0));
    const y0 = Math.max(0, Math.floor(region?.y0 ?? 0));
    const x1 = Math.min(W - 1, Math.ceil(region?.x1 ?? W - 1));
    const y1 = Math.min(H - 1, Math.ceil(region?.y1 ?? H - 1));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (near((y * W + x) * 4, c)) pts.push([x, y]);
    return pts;
  };
  const box = (pts: Px[]) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs) + 1, Math.max(...ys) + 1];
  };
  /** continuous bbox of projected points, [x0, y0, x1, y1] — comparable to pixel-edge boxes */
  const projBox = (pts: Px[]) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  };
  const proj = (p: [number, number, number]): Px => {
    const q = projectToPixels(camera, p, W, H);
    return [q.x, q.y];
  };
  const boxErr = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));

  // plinth
  const ring: Px[] = [];
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    for (const y of [0, PLINTH.topY]) ring.push(proj([PLINTH.radius * Math.cos(a), y, PLINTH.radius * Math.sin(a)]));
  }
  const pProj = projBox(ring);
  const pRend = box(scan(FLAT_COLORS.plinth));

  const model = buildGreyboxModel();
  const floors = model.departments.map((d) => {
    const pts = scan(DEPT_FLAT_COLORS[d.id]);
    const pick = (f: (p: Px, q: Px) => boolean) => pts.reduce((b, p) => (f(p, b) ? p : b));
    // footprint corner order (x0,z0) top, (x1,z0) right, (x1,z1) bottom, (x0,z1) left (screen)
    const rendered: Px[] = [pick((p, b) => p[1] < b[1]), pick((p, b) => p[0] > b[0]), pick((p, b) => p[1] > b[1]), pick((p, b) => p[0] < b[0])];
    const projected = footprintCorners(d.config, d.floor.size[1]).map(proj);
    const fc = hex(DEPT_FLAT_COLORS[d.id]);
    const centre = projected.reduce<Px>((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]);
    const corners = rendered.map((r, i) => {
      const p = projected[i];
      const inFrame = p[0] >= 1 && p[0] <= W - 2 && p[1] >= 1 && p[1] <= H - 2;
      // A corner hidden behind another element (e.g. a sign plate) cannot be measured: probe 4 px inside it.
      const k = 4 / Math.hypot(centre[0] - p[0], centre[1] - p[1]);
      const qx = Math.round(p[0] + (centre[0] - p[0]) * k);
      const qy = Math.round(p[1] + (centre[1] - p[1]) * k);
      const occluded = inFrame && !near((qy * W + qx) * 4, fc);
      return { rendered: [r[0] + 0.5, r[1] + 0.5] as Px, projected: [r1(p[0]), r1(p[1])] as Px, inFrame, occluded };
    });
    const errs = corners.filter((c) => c.inFrame && !c.occluded).map((c) => Math.hypot(c.rendered[0] - c.projected[0], c.rendered[1] - c.projected[1]));
    return { id: d.id, maxCornerErrPx: errs.length ? r1(Math.max(...errs)) : null, corners };
  });

  const signs = model.departments.map((d) => {
    const pb = projBox(boxCorners(d.sign).map(proj));
    const pad = 6;
    const rb = box(scan(FLAT_COLORS.sign, { x0: pb[0] - pad, y0: pb[1] - pad, x1: pb[2] + pad, y1: pb[3] + pad }));
    return { id: d.sign.refId!, rendered: rb, projected: pb.map(r1), maxEdgeErrPx: r1(boxErr(rb, pb)) };
  });

  return {
    canvas: [W, H],
    plinth: { rendered: pRend, projected: pProj.map(r1), maxEdgeErrPx: r1(boxErr(pRend, pProj)) },
    floors,
    signs,
    summary: {
      plinthMaxPx: r1(boxErr(pRend, pProj)),
      floorCornerMaxPx: Math.max(...floors.map((f) => f.maxCornerErrPx ?? 0)),
      signMaxPx: Math.max(...signs.map((s) => s.maxEdgeErrPx)),
    },
  };
}
