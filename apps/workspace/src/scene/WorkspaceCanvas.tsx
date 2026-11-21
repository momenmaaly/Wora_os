import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { CAMERA } from '../config/sceneConfig';
import { CameraRig } from './CameraRig';
import { Greybox, type GreyboxLayers, DEFAULT_LAYERS } from './Greybox';
import { Lights } from './Lights';
import { SceneEnvironment } from './SceneEnvironment';
import { BACKGROUND_COLOR } from './materials';
import type { FovRule } from './camera';

/**
 * VF-1: shadow-mapped key light (VAC-LGT-02) + ACES tone mapping (r3f default) + selective bloom
 * (VAC-LGT-03: only HDR emitters — rim ×6, strips ×5.5 — clear the threshold-3 band that diffuse albedo cannot reach;
 * intensity budget subtle per approved default Q-VF-03). Flat measurement mode skips the
 * environment, shadows and post-processing entirely, so pixel measurements stay neutral.
 */
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
      shadows={!flat}
      gl={{ antialias: !flat, preserveDrawingBuffer: true }}
      style={{ position: 'absolute', inset: 0 }}
      data-testid="greybox-canvas"
    >
      <color attach="background" args={[flat ? '#000000' : BACKGROUND_COLOR]} />
      <CameraRig homeToken={homeToken} onRule={onRule} />
      {!flat && (
        <>
          <SceneEnvironment />
          <Lights />
        </>
      )}
      <Greybox layers={layers} flat={flat} />
      {!flat && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={3.0} luminanceSmoothing={0.4} radius={0.65} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
      {children}
    </Canvas>
  );
}
