/** Neutral greybox lighting (architecture/05 G-20): one hemisphere + one directional light, no effects. */
export function Lights() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#6b6f75', 1.6]} />
      <directionalLight position={[20, 40, 10]} intensity={1.4} />
    </>
  );
}
