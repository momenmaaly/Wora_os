/**
 * Maps original reference px (1672 × 941) onto the current canvas for the HOME camera.
 * The principal point is the image centre (architecture/03 §2), so the reference frame is
 * centred on the canvas and scaled by the ratio of focal lengths.
 */
import { CAMERA, REFERENCE } from '../config/sceneConfig';
import { FOCAL_PX } from '../scene/camera';

export interface OverlayTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function overlayTransform(canvasW: number, canvasH: number, fovDeg: number): OverlayTransform {
  const focalCanvas = canvasH / 2 / Math.tan((fovDeg * Math.PI) / 360);
  const scale = focalCanvas / FOCAL_PX;
  const [ppx, ppy] = CAMERA.principalPointPx;
  return { scale, offsetX: canvasW / 2 - ppx * scale, offsetY: canvasH / 2 - ppy * scale };
}

export function refToCanvas(t: OverlayTransform, [u, v]: [number, number]): [number, number] {
  return [t.offsetX + u * t.scale, t.offsetY + v * t.scale];
}

export const REF_W = REFERENCE.width;
export const REF_H = REFERENCE.height;
