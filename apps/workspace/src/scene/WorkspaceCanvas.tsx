import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { CAMERA } from '../config/sceneConfig';
import { CameraRig } from './CameraRig';
import { Greybox, type GreyboxLayers, DEFAULT_LAYERS } from './Greybox';
import { Lights } from './Lights';
import { BACKGROUND_COLOR } from './materials';
import type { FovRule } from './camera';

export function WorkspaceCanvas({
  layers = DEFAULT_LAYERS,
  flat = false,
  homeToken,
  onRule,
  children,
}: {
  layers?: GreyboxLayers;
  flat?: boolean;
  homeToken?: number;
  onRule?: (rule: FovRule, fovDeg: number) => void;
  children?: ReactNode;
}) {
  return (
    <Canvas
      camera={{ fov: CAMERA.fovVerticalDeg, near: CAMERA.near, far: CAMERA.far, position: CAMERA.position }}
      dpr={[1, 2]}
      gl={{ antialias: !flat, preserveDrawingBuffer: true }}
      style={{ position: 'absolute', inset: 0 }}
      data-testid="greybox-canvas"
    >
      <color attach="background" args={[flat ? '#000000' : BACKGROUND_COLOR]} />
      <CameraRig homeToken={homeToken} onRule={onRule} />
      {!flat && <Lights />}
      <Greybox layers={layers} flat={flat} />
      {children}
    </Canvas>
  );
}
