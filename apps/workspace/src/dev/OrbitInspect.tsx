/** Dev-only free orbit, to inspect the greybox as real 3D. "Reset to HOME" restores the exact config. */
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMERA } from '../config/sceneConfig';

export function OrbitInspect() {
  const camera = useThree((s) => s.camera);
  const dom = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const controls = new OrbitControls(camera, dom);
    controls.target.copy(new Vector3(...CAMERA.target));
    controls.update();
    return () => controls.dispose();
  }, [camera, dom]);
  return null;
}
