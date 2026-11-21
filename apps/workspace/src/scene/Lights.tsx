/**
 * Scene lighting. Mission 006-A: LGT-01 mood (cool sky / warm ground balance), LGT-02 key-light
 * direction (shadows fall to the screen lower-left → key from the +X/−Z upper right), LGT-03
 * emissives are unlit materials (see materials.ts); bloom is art-pass scope (Q-3D-07: emissive).
 */
export function Lights() {
  return (
    <>
      <hemisphereLight args={['#D6E4F0', '#A3938A', 1.5]} />
      <directionalLight position={[35, 50, -15]} intensity={1.5} color="#FFF1E0" />
    </>
  );
}
