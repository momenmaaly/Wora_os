import type { EmployeeLife } from '../life/employeeLife';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { CAMERA } from '../config/sceneConfig';
import { CameraRig } from './CameraRig';
import { Greybox, type GreyboxLayers, DEFAULT_LAYERS } from './Greybox';
import { Lights } from './Lights';
import { SceneEnvironment } from './SceneEnvironment';
import { SceneInteraction, type Selection } from './sceneInteractionBridge';
import { BACKGROUND_COLOR } from './materials';
import type { FovRule } from './camera';

/**
 * Review R1/R2 (reset): scene-wide tone calibration — measured scene patches read +20…+55 RGB vs
 * the reference at the VF-1 light budget; hemisphere/dir scaled (1.5→0.95 / 1.55→1.15, both
 * further trimmed after R2) and robot shells given a slight emissive so figures read bright on
 * darker floors exactly as in the reference. Flat mode skips lights entirely (unchanged).
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
  onSelection,
  children,
  life,
  view = '3d',
}: {
  layers?: GreyboxLayers;
  flat?: boolean;
  homeToken?: number;
  onRule?: (rule: FovRule, fovDeg: number) => void;
  onSelection?: (s: Selection | null) => void;
  children?: ReactNode;
  life?: EmployeeLife;
  view?: '3d' | 'floor-plan';
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
      <CameraRig homeToken={homeToken} onRule={onRule} view={view} />
      {!flat && (
        <>
          <SceneEnvironment />
          <Lights />
        </>
      )}
      <Greybox layers={layers} flat={flat} life={life} />
      {!flat && onSelection && <SceneInteraction onSelection={onSelection} />}
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
