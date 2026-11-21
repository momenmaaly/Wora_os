/**
 * VF-1: scene-wide reflections via three's local RoomEnvironment (no external assets, no CDN —
 * P-6). Gives glass, marble and metal something to reflect (VAC-LGT-04/06 specular streaks).
 * Intensity kept moderate so the catalogued flat palette still dominates. EST. intensity.
 */
import { useEffect } from 'react';
import { PMREMGenerator, type Texture } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useThree } from '@react-three/fiber';

export function SceneEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture as Texture;
    scene.environmentIntensity = 0.2;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}
