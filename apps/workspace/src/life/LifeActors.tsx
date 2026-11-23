import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { ROBOT_VISUAL } from '../config/sceneConfig';
import { lifeMotion, type EmployeeLife } from './employeeLife';
import type { ReactNode } from 'react';

/** One frame subscription for all 47 actors; no React state/geometry allocations per frame. */
export function LifeActors({ engine, renderActor }: { engine?: EmployeeLife; renderActor: (id: string) => ReactNode }) {
  const groups = useRef<(Group | null)[]>([]);
  const reducedMotion = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotion.current = query.matches; };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useFrame((_, delta) => {
    if (!engine || document.hidden) return;
    engine.advance(delta);
    if (engine.paused) return;
    const reduced = reducedMotion.current;
    const started = performance.now();
    engine.employees.forEach((e, i) => {
      const group = groups.current[i];
      if (!group) return;
      const m = lifeMotion(e, reduced);
      const [x, z] = ROBOT_VISUAL[i].floorXZ;
      // Pivot around the actor's measured location, not the world origin.
      group.position.set(x, m.y, z);
      group.rotation.y = m.yaw;
    });
    engine.actorUpdateMs = performance.now() - started;
  });
  return <group name="Robots">{ROBOT_VISUAL.map((r, i) => <group key={r.id} ref={(g) => { groups.current[i] = g; }} position={[...r.floorXZ.slice(0, 1), 0, r.floorXZ[1]] as [number, number, number]}>
    <group position={[-r.floorXZ[0], 0, -r.floorXZ[1]]}>{renderActor(r.id)}</group>
  </group>)}</group>;
}
