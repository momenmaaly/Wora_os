/**
 * Keeps the default R3F camera on the approved HOME pose and applies the responsive FOV rule
 * whenever the canvas size changes. When `frozen` is false the pose is left to OrbitControls
 * (dev inspection only); "Reset to HOME" re-applies the exact config.
 */
import { useEffect, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { applyHomeCamera, type FovRule } from './camera';

export function CameraRig({ homeToken = 0, onRule }: { homeToken?: number; onRule?: (rule: FovRule, fovDeg: number) => void }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) throw new Error('Greybox requires a perspective camera (approved projection).');
    const rule = applyHomeCamera(camera, size.width / size.height);
    onRule?.(rule, camera.fov);
    invalidate();
  }, [camera, size.width, size.height, homeToken, onRule, invalidate]);

  useEffect(() => {
    (window as unknown as { __WORA_CAMERA__?: PerspectiveCamera }).__WORA_CAMERA__ = camera as PerspectiveCamera;
  }, [camera]);

  return null;
}
