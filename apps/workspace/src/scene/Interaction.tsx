/**
 * VF-7 interaction layer (owner-approved Visual Foundation Completion Plan; Q-VF-05 default
 * subset: selection + info). Presentation-only:
 *  - raycast hover/click on catalogued entities via userData.refId (departments, robots, plinth,
 *    signs) — no geometry or material identity is modified; the highlight is an additive floor
 *    ring + beacon rendered beside the selection and removed on clear;
 *  - an info chip (DOM, App.tsx) shows the department name + its measured robot count and the
 *    immutable global figures (24 AI Employees · 47 visible robots);
 *  - the HOME camera is never moved by interaction (orbit/reset remain inspector capabilities).
 */
import { useRef, useState, useCallback } from 'react';
import { Raycaster, Vector2, DoubleSide, type Intersection, type Mesh, type Object3D } from 'three';
import { useThree } from '@react-three/fiber';
import { DEPARTMENTS, ROBOT_POSITIONS } from '../config/sceneConfig';

export interface Selection {
  refId: string;
  label: string;
  kind: 'department' | 'robot' | 'structure';
  /** world floor position of the highlight ring */
  pos: [number, number, number];
  ringR: number;
  detail: string;
}

const ROBOT_ZONE_DEPT: Record<string, string> = {
  'Executive Office': 'DEPT-01', 'Marketing': 'DEPT-02', 'Engineering': 'DEPT-03', 'Creative Studio': 'DEPT-04',
  'Management': 'DEPT-05', 'Research': 'DEPT-06', 'QA & Testing': 'DEPT-07',
};

const ROBOT_COUNTS: Record<string, number> = ROBOT_POSITIONS.reduce((acc, r) => {
  acc[r.zone] = (acc[r.zone] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

function resolve(hit: Object3D): Selection | null {
  let o: Object3D | null = hit;
  while (o) {
    const refId = (o.userData as { refId?: string }).refId;
    const name = (o.userData as { name?: string }).name;
    // department groups carry the display name (Greybox renders name={d.name}); accept both forms
    const asDept = DEPARTMENTS.find((d) => d.id === name || d.name === name);
    if (name && asDept) {
      const dept = asDept;
      const fp = dept.footprint;
      const count = ROBOT_COUNTS[dept.name] ?? 0;
      return {
        refId: name,
        label: dept.name,
        kind: 'department',
        pos: [(fp.x0 + fp.x1) / 2, 0.03, (fp.z0 + fp.z1) / 2],
        ringR: Math.max(fp.x1 - fp.x0, fp.z1 - fp.z0) / 2 + 0.4,
        detail: `${count} robot${count === 1 ? '' : 's'} in this department`,
      };
    }
    if (refId && refId.startsWith('ROBOT-')) {
      const r = ROBOT_POSITIONS.find((x) => x.id === refId)!;
      const dept = ROBOT_ZONE_DEPT[r.zone];
      const deptName = DEPARTMENTS.find((d) => d.id === dept)?.name ?? r.zone;
      return {
        refId,
        label: refId.replace('ROBOT-', 'Robot '),
        kind: 'robot',
        pos: [r.floorXZ[0], 0.03, r.floorXZ[1]],
        ringR: 0.45,
        detail: `${deptName} · zone: ${r.zone}`,
      };
    }
    if (refId === 'ENV-002') {
      return { refId: 'ENV-002', label: 'WORA plinth', kind: 'structure', pos: [0, 0.145, 0], ringR: 2.7, detail: 'Central dais — glowing rim, W mark + wordmark' };
    }
    if (refId && refId.startsWith('SIGN-')) {
      const dept = DEPARTMENTS.find((d) => d.sign.id === refId)!;
      return {
        refId,
        label: refId.replace('SIGN-', 'Sign '),
        kind: 'structure',
        pos: [dept.sign.anchorWorld[0], 0.03, dept.sign.anchorWorld[2]],
        ringR: 1.0,
        detail: `${dept.name} department sign`,
      };
    }
    o = o.parent;
  }
  return null;
}

function pickMeshes(root: Object3D | undefined | null): Mesh[] {
  // every Mesh under the world: resolve() walks up the ancestors for userData (refId/name live on
  // groups for box primitives, on the mesh for ribbons/discs/spheres)
  const out: Mesh[] = [];
  root?.traverse((o) => {
    const m = o as Mesh;
    if (m.isMesh) out.push(m);
  });
  return out;
}

export function SceneInteraction({ onSelection }: { onSelection: (s: Selection | null) => void }) {
  const { gl, scene, camera } = useThree();
  const ray = useRef(new Raycaster());
  const v2 = useRef(new Vector2());
  const [hover, setHover] = useState<Selection | null>(null);

  const cast = useCallback(
    (cx: number, cy: number): Selection | null => {
      const rect = gl.domElement.getBoundingClientRect();
      v2.current.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
      ray.current.setFromCamera(v2.current, camera);
      const world = scene.getObjectByName('World');
      const hits: Intersection[] = ray.current.intersectObjects(pickMeshes(world), false);
      return hits.length ? resolve(hits[0].object) : null;
    },
    [gl, scene, camera],
  );

  return (
    <>
      <mesh
        userData={{ refId: 'pick-plane' }}
        onPointerMove={(e) => {
          e.stopPropagation();
          const s = cast(e.clientX, e.clientY);
          if ((s?.refId ?? null) !== (hover?.refId ?? null)) {
            setHover(s);
            gl.domElement.style.cursor = s ? 'pointer' : 'default';
          }
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          const s = cast(e.clientX, e.clientY);
          setHover(s);
          onSelection(s);
        }}
        onPointerLeave={() => {
          setHover(null);
          gl.domElement.style.cursor = 'default';
        }}
      >
        {/* picking plane: covers the whole scene extent; never rendered (material.visible=false
            keeps it invisible while Mesh.raycast still intersects it — clicks on empty space land
            here and clear the selection). userData.refId makes it a raycast target. */}
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial visible={false} side={DoubleSide} />
      </mesh>
      {(hover ?? null) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={hover!.pos} renderOrder={30}>
          <ringGeometry args={[hover!.ringR * 0.92, hover!.ringR, 48]} />
          <meshBasicMaterial color="#2FD2FF" transparent opacity={0.55} toneMapped={false} side={DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export type SelectionState = Selection | null;
