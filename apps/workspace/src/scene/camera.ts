/**
 * HOME camera (architecture/03 §1–2) and the responsive FOV rule (architecture/03 §6).
 * Perspective projection is approved (Mission 004 decision). Values are never tuned for looks.
 */
import { PerspectiveCamera, Vector3 } from 'three';
import { CAMERA, MEASURED, REFERENCE, type Vec3 } from '../config/sceneConfig';

const DEG = Math.PI / 180;
export const REFERENCE_ASPECT = REFERENCE.width / REFERENCE.height;
/** tan(vFOV/2) of the HOME camera. */
export const TAN_HALF_V = Math.tan((CAMERA.fovVerticalDeg / 2) * DEG);
export const TAN_HALF_H = TAN_HALF_V * REFERENCE_ASPECT;
/** Focal length in px at the reference height, derived from the FOV so it is self-consistent. */
export const FOCAL_PX = REFERENCE.height / 2 / TAN_HALF_V;

/**
 * Composition safe rectangle: union of the seven sign plates and the plinth (03 §6), expressed as
 * tangents relative to the principal point (canvas centre).
 */
export const SAFE_RECT = (() => {
  const ids = ['SIGN-01', 'SIGN-02', 'SIGN-03', 'SIGN-04', 'SIGN-05', 'SIGN-06', 'SIGN-07', 'ENV-002'];
  const boxes = ids.map((id) => MEASURED[id]);
  const px = {
    left: Math.min(...boxes.map((b) => b.x)),
    right: Math.max(...boxes.map((b) => b.x + b.w)),
    top: Math.min(...boxes.map((b) => b.y)),
    bottom: Math.max(...boxes.map((b) => b.y + b.h)),
  };
  const cx = REFERENCE.width / 2;
  const cy = REFERENCE.height / 2;
  return {
    px,
    tan: {
      left: (px.left - cx) / FOCAL_PX,
      right: (px.right - cx) / FOCAL_PX,
      top: (px.top - cy) / FOCAL_PX,
      bottom: (px.bottom - cy) / FOCAL_PX,
    },
  };
})();

export type FovRule = 'reference' | 'fit-width' | 'keep-vertical' | 'fit-safe-width' | 'fit-safe-height';

/**
 * Vertical FOV (degrees) for a canvas aspect ratio, per architecture/03 §6:
 *  - a ≥ reference: keep hFOV (crop top/bottom) while the safe rect still fits vertically;
 *  - 1.581 ≤ a < reference: keep vFOV;
 *  - narrower: widen until the safe rect fits horizontally (reveals ND content above/below — flagged).
 */
export function fovForAspect(aspect: number): { fovDeg: number; rule: FovRule } {
  const safeH = Math.max(-SAFE_RECT.tan.left, SAFE_RECT.tan.right);
  const safeV = Math.max(-SAFE_RECT.tan.top, SAFE_RECT.tan.bottom);
  let tanV: number;
  let rule: FovRule;
  if (Math.abs(aspect - REFERENCE_ASPECT) < 1e-3) {
    // within 0.001 of 1672:941 (e.g. 1920×1080, 1366×768, letterboxed dev frame): use the HOME FOV exactly
    tanV = TAN_HALF_V;
    rule = 'reference';
  } else if (aspect > REFERENCE_ASPECT) {
    tanV = TAN_HALF_H / aspect;
    rule = 'fit-width';
    if (tanV < safeV) {
      tanV = safeV;
      rule = 'fit-safe-height';
    }
  } else if (TAN_HALF_V * aspect >= safeH) {
    tanV = TAN_HALF_V;
    rule = 'keep-vertical';
  } else {
    tanV = safeH / aspect;
    rule = 'fit-safe-width';
  }
  return { fovDeg: (2 * Math.atan(tanV)) / DEG, rule };
}

/** Apply the HOME pose and the responsive FOV to a PerspectiveCamera. */
/** Optional top-down workspace projection; HOME remains the only default/reference projection. */
export function applyFloorPlanCamera(camera: PerspectiveCamera): void {
  camera.position.set(0, 48, 0);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, 0, 0);
  camera.fov = 40;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

export function applyHomeCamera(camera: PerspectiveCamera, aspect: number): FovRule {
  const { fovDeg, rule } = fovForAspect(aspect);
  camera.fov = fovDeg;
  camera.aspect = aspect;
  camera.near = CAMERA.near;
  camera.far = CAMERA.far;
  camera.position.set(...CAMERA.position);
  camera.up.set(...CAMERA.up);
  camera.lookAt(new Vector3(...CAMERA.target));
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return rule;
}

export function createHomeCamera(aspect = REFERENCE_ASPECT): PerspectiveCamera {
  const camera = new PerspectiveCamera(CAMERA.fovVerticalDeg, aspect, CAMERA.near, CAMERA.far);
  applyHomeCamera(camera, aspect);
  return camera;
}

/** Project a world point to canvas pixels (origin top-left). */
export function projectToPixels(
  camera: PerspectiveCamera,
  world: Vec3,
  width: number = REFERENCE.width,
  height: number = REFERENCE.height,
): { x: number; y: number; inFront: boolean } {
  const v = new Vector3(...world);
  const inFront = v.clone().applyMatrix4(camera.matrixWorldInverse).z < 0;
  v.project(camera);
  return { x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height, inFront };
}
