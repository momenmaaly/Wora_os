/**
 * Greybox validation metrics (Mission 004). Pure functions over the same model that is rendered.
 * Used by tests/*.test.ts (assertions) and by tests/report.test.ts (writes the metrics JSON that the
 * validation report quotes). Nothing here changes geometry.
 */
import { PerspectiveCamera, Raycaster, Vector2, Vector3, Plane } from 'three';
import {
  ARCHITECTURE,
  DEPARTMENTS,
  MEASURED,
  PLINTH,
  REFERENCE,
  ROBOT_POSITIONS,
  UI_OCCLUDERS,
  type DeptId,
  type Vec3,
} from '../config/sceneConfig';
import {
  DIGITISED_CORNERS,
  RING_OFFSETS_PX,
  SIGN_ANGLES_DEG,
  SLAB_EDGE_LINES,
} from '../config/referencePoints';
import { createHomeCamera, fovForAspect, applyHomeCamera, projectToPixels, REFERENCE_ASPECT } from '../scene/camera';
import { boxCorners, buildGreyboxModel, footprintCorners, slabFootprint, type BoxSpec } from '../scene/model';

const W: number = REFERENCE.width;
const H: number = REFERENCE.height;
const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const r3 = (n: number) => Math.round(n * 1000) / 1000;
type Px = [number, number];

export function homeCamera(): PerspectiveCamera {
  return createHomeCamera(REFERENCE_ASPECT);
}

const proj = (cam: PerspectiveCamera, p: Vec3, w = W, h = H): Px => {
  const q = projectToPixels(cam, p, w, h);
  return [q.x, q.y];
};
const dist = (a: Px, b: Px) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function bbox(points: Px[]) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
}

/** Pose derived from the three.js camera itself (independent of the JSON angles). */
export function cameraPose(cam: PerspectiveCamera) {
  const dir = new Vector3();
  cam.getWorldDirection(dir);
  const pitch = (Math.asin(-dir.y) * 180) / Math.PI;
  let yaw = (Math.atan2(dir.x, dir.z) * 180) / Math.PI; // 0° = +Z
  if (yaw < 0) yaw += 360;
  const right = new Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
  const roll = (Math.asin(right.y) * 180) / Math.PI;
  const vfov = cam.fov;
  const hfov = (2 * Math.atan(Math.tan((vfov * Math.PI) / 360) * cam.aspect) * 180) / Math.PI;
  const focalPx = H / 2 / Math.tan((vfov * Math.PI) / 360);
  return { yawDeg: r3(yaw), pitchDeg: r3(pitch), rollDeg: r3(roll), vfovDeg: r3(vfov), hfovDeg: r3(hfov), focalPx: r1(focalPx) };
}

/** Projected plinth ellipse bbox (top + bottom rims) vs ENV-002 (VAC-CAM-01, VAC-CAM-03). */
export function plinthMetrics(cam: PerspectiveCamera) {
  const pts: Px[] = [];
  for (let i = 0; i < 720; i++) {
    const a = (i / 720) * Math.PI * 2;
    for (const y of [0, PLINTH.topY]) pts.push(proj(cam, [PLINTH.centre[0] + PLINTH.radius * Math.cos(a), y, PLINTH.centre[2] + PLINTH.radius * Math.sin(a)]));
  }
  const b = bbox(pts);
  const top = bbox(pts.filter((_, i) => i % 2 === 1));
  const m = MEASURED['ENV-002'];
  const centre: Px = [b.x + b.w / 2, b.y + b.h / 2];
  return {
    topEllipse: { box: [r1(top.x), r1(top.y), r1(top.w), r1(top.h)], aspect: r3(top.w / top.h), heightDeltaPx: r1(top.h - m.h) },
    projectedBox: [r1(b.x), r1(b.y), r1(b.w), r1(b.h)],
    measuredBox: [m.x, m.y, m.w, m.h],
    centreDeltaPx: [r1(centre[0] - m.cx), r1(centre[1] - m.cy)],
    centreErrorPx: r1(dist(centre, [m.cx, m.cy])),
    widthDeltaPx: r1(b.w - m.w),
    heightDeltaPx: r1(b.h - m.h),
    aspect: r3(b.w / b.h),
    measuredAspect: r3(m.w / m.h),
  };
}

/** Room floor corners projected by three.js vs the M003 solver's projected corners. */
export function roomCornerConsistency(cam: PerspectiveCamera) {
  return DEPARTMENTS.map((d) => {
    const proj4 = footprintCorners(d).map((c) => proj(cam, c));
    const errs = proj4.map((p, i) => dist(p, d.projectedFloorCornersPx[i]));
    return { id: d.id, name: d.name, cornersPx: proj4.map((p) => [r1(p[0]), r1(p[1])]), maxErrVsSolverPx: r2(Math.max(...errs)) };
  });
}

function cornerWorld(dept: DeptId, corner: string): Vec3 {
  const f = DEPARTMENTS.find((x) => x.id === dept)!.footprint;
  return [corner.startsWith('x0') ? f.x0 : f.x1, 0, corner.endsWith('z0') ? f.z0 : f.z1];
}

/** Digitised partition floor corners (in-sample for the adopted fit; ±5 px digitising). */
export function digitisedCornerMetrics(cam: PerspectiveCamera) {
  return DIGITISED_CORNERS.map((c) => {
    const p = proj(cam, cornerWorld(c.dept, c.corner));
    return { name: c.name, dept: c.dept, corner: c.corner, measuredPx: c.px, projectedPx: [r1(p[0]), r1(p[1])], deltaPx: [r1(p[0] - c.px[0]), r1(p[1] - c.px[1])], errorPx: r1(dist(p, c.px)) };
  });
}

/** Screen angle (deg, y-down, CSS rotation sign) of a plate's long axis through its front-face centre. */
function plateScreenAngle(cam: PerspectiveCamera, b: BoxSpec): number {
  const half = b.size[0] / 2;
  const c = Math.cos(b.rotationY);
  const s = Math.sin(b.rotationY);
  const a = proj(cam, [b.center[0] - half * c, b.center[1], b.center[2] + half * s]);
  const e = proj(cam, [b.center[0] + half * c, b.center[1], b.center[2] - half * s]);
  const [p, q] = a[0] <= e[0] ? [a, e] : [e, a];
  return (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
}

export function signMetrics(cam: PerspectiveCamera) {
  const model = buildGreyboxModel();
  return model.departments.map((d) => {
    const m = MEASURED[d.sign.refId!];
    const anchor = proj(cam, d.sign.center);
    const b = bbox(boxCorners(d.sign).map((p) => proj(cam, p)));
    const angle = plateScreenAngle(cam, d.sign);
    const measuredAngle = SIGN_ANGLES_DEG[d.sign.refId!];
    return {
      id: d.sign.refId!,
      dept: d.id,
      wall: d.config.sign.wall,
      plateLengthM: d.sign.size[0],
      anchorRoundTripPx: r2(dist(anchor, [m.cx, m.cy])),
      projectedBox: [r1(b.x), r1(b.y), r1(b.w), r1(b.h)],
      measuredBox: [m.x, m.y, m.w, m.h],
      boxCentreErrorPx: r1(dist([b.x + b.w / 2, b.y + b.h / 2], [m.cx, m.cy])),
      boxHeightDeltaPx: r1(b.h - m.h),
      screenAngleDeg: r1(angle),
      measuredAngleDeg: measuredAngle,
      angleErrorDeg: r1(angle - measuredAngle),
      withinCam02: Math.abs(angle - measuredAngle) <= 3,
    };
  });
}

/** Fit the plate length so its projected bbox width equals the measured sign-box width (height fixed). */
export function fitSignLength(cam: PerspectiveCamera, spec: BoxSpec, measuredW: number): number {
  const width = (L: number) => bbox(boxCorners({ ...spec, size: [L, spec.size[1], spec.size[2]] }).map((p) => proj(cam, p))).w;
  let lo = 0.3;
  let hi = 12;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (width(mid) < measuredW) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** Room envelope (floor + partition tops) centre offsets from the plinth centre (VAC-GEO-04). */
export function ringMetrics(cam: PerspectiveCamera) {
  const model = buildGreyboxModel();
  const plinth: Px = [MEASURED['ENV-002'].cx, MEASURED['ENV-002'].cy];
  return model.departments.map((d) => {
    const b = bbox(boxCorners(d.hitVolume).map((p) => proj(cam, p)));
    const off: Px = [b.x + b.w / 2 - plinth[0], b.y + b.h / 2 - plinth[1]];
    const ref = RING_OFFSETS_PX[d.id];
    const err = dist(off, ref);
    return { id: d.id, name: d.name, projectedEnvelope: [r1(b.x), r1(b.y), r1(b.x + b.w), r1(b.y + b.h)], measuredEnvelope: d.config.measuredEnvelopePx, offsetPx: [r1(off[0]), r1(off[1])], referenceOffsetPx: ref, errorPx: r1(err), withinGeo04: err <= 20 };
  });
}

/** Robots: head round trip and floor containment. Robots are markers only (no models). */
export function robotMetrics(cam: PerspectiveCamera) {
  const zoneToDept = Object.fromEntries(DEPARTMENTS.map((d) => [d.name, d]));
  let maxRoundTrip = 0;
  let zoneTotal = 0;
  let zoneInside = 0;
  let freeTotal = 0;
  let freeOutside = 0;
  const failures: string[] = [];
  for (const r of ROBOT_POSITIONS) {
    const p = proj(cam, [r.floorXZ[0], r.assumedHeadH, r.floorXZ[1]]);
    maxRoundTrip = Math.max(maxRoundTrip, dist(p, r.headPx));
    const [x, z] = r.floorXZ;
    const inside = (d: (typeof DEPARTMENTS)[number]) => x >= d.footprint.x0 && x <= d.footprint.x1 && z >= d.footprint.z0 && z <= d.footprint.z1;
    const dept = zoneToDept[r.zone];
    if (dept) {
      zoneTotal++;
      if (inside(dept)) zoneInside++;
      else failures.push(r.id);
    } else {
      freeTotal++;
      if (!DEPARTMENTS.some(inside)) freeOutside++;
      else failures.push(r.id);
    }
  }
  return { count: ROBOT_POSITIONS.length, maxHeadRoundTripPx: r3(maxRoundTrip), zoneInside, zoneTotal, freeOutside, freeTotal, failures };
}

/** Signed perpendicular distance (px) from point p to the infinite line through a→b. */
function lineDistance(a: Px, b: Px, p: Px): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / Math.hypot(dx, dy);
}

/** Back-project a reference px onto the horizontal plane y = h (HOME camera at reference size). */
export function backProject(cam: PerspectiveCamera, px: Px, h = 0): Vec3 {
  const rc = new Raycaster();
  rc.setFromCamera(new Vector2((px[0] / W) * 2 - 1, 1 - (px[1] / H) * 2), cam);
  const out = new Vector3();
  rc.ray.intersectPlane(new Plane(new Vector3(0, 1, 0), -h), out);
  return [out.x, out.y, out.z];
}

/** Slab-edge comparison and the +X (lower-right) discrepancy investigation (Q-ARCH-05). */
export function slabEdgeMetrics(cam: PerspectiveCamera) {
  const f = slabFootprint();
  const edgeZ: [Px, Px] = [proj(cam, [-5.9, 0, f.z1]), proj(cam, [4.4, 0, f.z1])];
  const edgeX: [Px, Px] = [proj(cam, [f.x1, 0, -9.4]), proj(cam, [f.x1, 0, 3.4])];
  const angle = (a: Px, b: Px) => {
    const [p, q] = a[0] <= b[0] ? [a, b] : [b, a];
    return (Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180) / Math.PI; // + = rising to the right
  };
  const lines = SLAB_EDGE_LINES.map((l) => {
    const model = l.edge === '+Z' ? edgeZ : edgeX;
    const samples = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => {
      const p: Px = [l.a[0] + (l.b[0] - l.a[0]) * t, l.a[1] + (l.b[1] - l.a[1]) * t];
      return r1(Math.abs(lineDistance(model[0], model[1], p)));
    });
    // investigation: back-project the measured line to the floor and to other plausible heights
    const atHeight = (h: number) => {
      const A = backProject(cam, l.a, h);
      const B = backProject(cam, l.b, h);
      // angle of the world line relative to the grid axis it should follow
      const axisDeg = l.edge === '+X' ? (Math.atan2(B[0] - A[0], B[2] - A[2]) * 180) / Math.PI : (Math.atan2(B[2] - A[2], B[0] - A[0]) * 180) / Math.PI;
      let skew = axisDeg % 180;
      if (skew > 90) skew -= 180;
      if (skew < -90) skew += 180;
      return { h, a: A.map(r2), b: B.map(r2), skewFromAxisDeg: r1(skew) };
    };
    return {
      id: l.id,
      edge: l.edge,
      label: l.label,
      measuredAngleDeg: r1(angle(l.a, l.b)),
      modelAngleDeg: r1(angle(model[0], model[1])),
      angleDeltaDeg: r1(angle(l.a, l.b) - angle(model[0], model[1])),
      distanceAtFractionsPx: samples,
      maxDistancePx: Math.max(...samples),
      backProjection: [0, -0.3, SCALE_BALUSTRADE].map(atHeight),
    };
  });
  // Best grid-aligned x for the +X edge per measured line (least squares over 11 samples on the floor).
  const bestX = SLAB_EDGE_LINES.filter((l) => l.edge === '+X').map((l) => {
    const xs: number[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      xs.push(backProject(cam, [l.a[0] + (l.b[0] - l.a[0]) * t, l.a[1] + (l.b[1] - l.a[1]) * t], 0)[0]);
    }
    return { id: l.id, floorXAlongLine: [r2(xs[0]), r2(xs[10])], meanX: r2(xs.reduce((s, x) => s + x, 0) / xs.length) };
  });
  // Can a different camera inside the M003 bootstrap interval remove the +X skew without breaking +Z?
  const sweep = (yawDelta: number, pitchDelta: number) => {
    const c = cam.clone();
    const target = new Vector3(...CAMERA_TARGET);
    const off = c.position.clone().sub(target);
    const r = off.length();
    const yaw0 = Math.atan2(off.x, off.z);
    const pitch0 = Math.asin(off.y / r);
    const yaw = yaw0 + (yawDelta * Math.PI) / 180;
    const pitch = pitch0 + (pitchDelta * Math.PI) / 180;
    c.position.set(target.x + r * Math.cos(pitch) * Math.sin(yaw), target.y + r * Math.sin(pitch), target.z + r * Math.cos(pitch) * Math.cos(yaw));
    c.lookAt(target);
    c.updateMatrixWorld(true);
    const z: [Px, Px] = [proj(c, [-5.9, 0, f.z1]), proj(c, [4.4, 0, f.z1])];
    const x: [Px, Px] = [proj(c, [f.x1, 0, -9.4]), proj(c, [f.x1, 0, 3.4])];
    return { yawDelta, pitchDelta, plusZAngleDeg: r1(angle(...z)), plusXAngleDeg: r1(angle(...x)) };
  };
  const cameraSweep = [
    sweep(0, 0),
    sweep(-1.47, 0),
    sweep(1.74, 0),
    sweep(0, -0.22),
    sweep(0, 0.23),
    sweep(-5, 0),
    sweep(5, 0),
    sweep(0, 5),
  ];
  return {
    cameraSweep,
    model: {
      plusZ: { z: f.z1, endpointsPx: edgeZ.map((p) => p.map(r1)), angleDeg: r1(angle(...edgeZ)), undersideEndpointsPx: [proj(cam, [-5.9, -0.3, f.z1]), proj(cam, [4.4, -0.3, f.z1])].map((p) => p.map(r1)) },
      plusX: { x: f.x1, endpointsPx: edgeX.map((p) => p.map(r1)), angleDeg: r1(angle(...edgeX)), undersideEndpointsPx: [proj(cam, [f.x1, -0.3, -9.4]), proj(cam, [f.x1, -0.3, 3.4])].map((p) => p.map(r1)) },
    },
    lines,
    plusXGridFit: bestX,
    adoptedPlusX: f.x1,
    measuredRangePlusX: ARCHITECTURE.building.slab_edges['+X (lower-right on screen)'].x_range,
  };
}
const SCALE_BALUSTRADE = ARCHITECTURE.scale.derived.balustrade_height_m;
const CAMERA_TARGET = ARCHITECTURE.camera.target as Vec3;

/** VAC-CAM-05: extreme corner of each room's occluded side must fall behind a UI panel or off-frame. */
export function occlusionMetrics(cam: PerspectiveCamera) {
  const model = buildGreyboxModel();
  return model.departments
    .filter((d) => d.config.occludedSides.length > 0)
    .map((d) => {
      const pts = boxCorners(d.hitVolume).map((p) => proj(cam, p));
      return d.config.occludedSides.map((side) => {
        const pick = (cmp: (a: Px, b: Px) => boolean) => pts.reduce((best, p) => (cmp(p, best) ? p : best));
        const p = side === 'top' ? pick((a, b) => a[1] < b[1]) : side === 'left' ? pick((a, b) => a[0] < b[0]) : side === 'right' ? pick((a, b) => a[0] > b[0]) : pick((a, b) => a[1] > b[1]);
        const offFrame = p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H;
        const panel = UI_OCCLUDERS.find((r) => p[0] >= r.x && p[0] <= r.x + r.w && p[1] >= r.y && p[1] <= r.y + r.h);
        return { id: d.id, name: d.name, side, extremePx: [r1(p[0]), r1(p[1])], hiddenBy: offFrame ? 'off-frame' : panel ? panel.id : null };
      });
    })
    .flat();
}

/** Clockwise department order around the plinth on screen (adjacency / order preservation). */
export function ringOrder(cam: PerspectiveCamera): DeptId[] {
  const c: Px = [MEASURED['ENV-002'].cx, MEASURED['ENV-002'].cy];
  return DEPARTMENTS.map((d) => {
    const f = d.footprint;
    const p = proj(cam, [(f.x0 + f.x1) / 2, 0, (f.z0 + f.z1) / 2]);
    // angle measured clockwise from screen-up
    let a = (Math.atan2(p[0] - c[0], -(p[1] - c[1])) * 180) / Math.PI;
    if (a < 0) a += 360;
    return { id: d.id, a };
  })
    .sort((p, q) => p.a - q.a)
    .map((p) => p.id);
}

/** Minimum gap between two axis-aligned footprints (m) — the derived walkway clearance. */
export function clearance(a: DeptId, b: DeptId): number {
  const A = DEPARTMENTS.find((d) => d.id === a)!.footprint;
  const B = DEPARTMENTS.find((d) => d.id === b)!.footprint;
  const gx = Math.max(0, Math.max(A.x0, B.x0) - Math.min(A.x1, B.x1));
  const gz = Math.max(0, Math.max(A.z0, B.z0) - Math.min(A.z1, B.z1));
  return Math.hypot(gx, gz);
}

/** Responsive behaviour per aspect: rule, FOV, safe-rect containment, plinth position. */
export function responsiveMetrics(sizes: [number, number][]) {
  const model = buildGreyboxModel();
  const safeBoxes = [...model.departments.map((d) => d.sign)];
  return sizes.map(([w, h]) => {
    const cam = new PerspectiveCamera();
    const aspect = w / h;
    const rule = applyHomeCamera(cam, aspect);
    const pts: Px[] = [];
    for (const b of safeBoxes) for (const p of boxCorners(b)) pts.push(proj(cam, p, w, h));
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push(proj(cam, [PLINTH.radius * Math.cos(a), 0, PLINTH.radius * Math.sin(a)], w, h));
    }
    const sb = bbox(pts);
    const plinth = proj(cam, [0, PLINTH.topY, 0], w, h);
    const tanV = Math.tan((cam.fov * Math.PI) / 360);
    const scale = h / 2 / tanV / (H / 2 / Math.tan((fovForAspect(REFERENCE_ASPECT).fovDeg * Math.PI) / 360));
    return {
      size: `${w}x${h}`,
      aspect: r3(aspect),
      rule,
      vfovDeg: r3(cam.fov),
      hfovDeg: r3((2 * Math.atan(tanV * aspect) * 180) / Math.PI),
      /** canvas extent in units of the reference frame (> 1 = shows area beyond the reference, i.e. ND content) */
      canvasOverReference: { width: r3(w / (W * scale)), height: r3(h / (H * scale)) },
      safeRectPx: [r1(sb.x), r1(sb.y), r1(sb.x + sb.w), r1(sb.y + sb.h)],
      /** largest overflow of the projected sign plates + plinth beyond the canvas (px, 0 = fully inside) */
      safeRectOverflowPx: r1(Math.max(0, -sb.x, -sb.y, sb.x + sb.w - w, sb.y + sb.h - h)),
      plinthNormalised: [r3(plinth[0] / w), r3(plinth[1] / h)],
    };
  });
}

/** VAC-CAM-01 framing anchors. Planter / Executive sign points are M003 back-projections (by construction). */
export function framingAnchors(cam: PerspectiveCamera) {
  const planterWorld = (ARCHITECTURE.atrium.reference_points as Record<string, number[]>)['ENV-005 planter centre (floor, est.)'] as Vec3;
  const exec = DEPARTMENTS.find((d) => d.id === 'DEPT-01')!.sign;
  const pl = plinthMetrics(cam);
  const items: { id: string; reference: Px; projected: Px; independent: boolean; note?: string }[] = [
    { id: 'plinth centre (ellipse box centre)', reference: [903, 500], projected: [pl.projectedBox[0] + pl.projectedBox[2] / 2, pl.projectedBox[1] + pl.projectedBox[3] / 2], independent: false },
    { id: 'planter (ENV-005 floor point)', reference: [802, 402], projected: proj(cam, planterWorld), independent: false, note: 'Not evaluated: ENV-005 is the floor-level base point (M003 est.), (802,402) is the visible planter centre above it; the planter is furniture and not part of the greybox.' },
    { id: 'Executive Office sign anchor', reference: [876, 158], projected: proj(cam, exec.anchorWorld), independent: false },
  ];
  return items.map((i) => ({ ...i, projected: i.projected.map(r1), errorPx: r1(dist(i.projected, i.reference)), withinCam01: dist(i.projected, i.reference) <= 5 }));
}

export function allMetrics() {
  const cam = homeCamera();
  return {
    schema: 'wora-greybox-metrics/v1',
    generatedBy: 'apps/workspace/tests/report.test.ts (three.js projection of the rendered model)',
    reference: { width: W, height: H, sha256: REFERENCE.sha256 },
    camera: cameraPose(cam),
    plinth: plinthMetrics(cam),
    framingAnchors: framingAnchors(cam),
    roomCornerConsistency: roomCornerConsistency(cam),
    digitisedCorners: digitisedCornerMetrics(cam),
    signs: signMetrics(cam),
    ring: ringMetrics(cam),
    ringOrderClockwise: ringOrder(cam),
    robots: robotMetrics(cam),
    slabEdges: slabEdgeMetrics(cam),
    occlusion: occlusionMetrics(cam),
    slabFootprint: slabFootprint(),
    responsive: responsiveMetrics([
      [1672, 941],
      [1920, 1080],
      [2560, 1440],
      [2560, 1080],
      [3440, 1440],
      [1440, 900],
      [1280, 800],
      [1366, 768],
      [1024, 768],
    ]),
  };
}
