/**
 * Scene lighting. Mission 006-A: LGT-01 mood (cool sky / warm ground balance), LGT-02 key-light
 * direction (shadows fall to the screen lower-left → key from the +X/−Z upper right), LGT-03
 * emissives are HDR materials (see materials.ts).
 * VF-1 (owner-approved): the key light casts soft shadows (VAC-LGT-02 contact shadows to the
 * lower-left; softness/radius EST. — reference shows soft, short contact shadows, no hard long
 * shadows). Light colours and intensities are unchanged from 006-A.
 */
export function Lights() {
  return (
    <>
      <hemisphereLight args={['#D6E4F0', '#A3938A', 1.5]} />
      <directionalLight
        position={[35, 50, -15]}
        intensity={1.5}
        color="#FFF1E0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-camera-near={10}
        shadow-camera-far={180}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </>
  );
}
