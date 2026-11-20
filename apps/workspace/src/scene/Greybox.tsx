/**
 * Renders the structural greybox from the pure model (model.ts). One mesh per descriptor,
 * plus outline edges so partition lines remain readable for structural review.
 */
import { useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, EdgesGeometry, type Material } from 'three';
import { buildGreyboxModel, type BoxSpec, type CylinderSpec, type PrimitiveSpec } from './model';
import { createFlatMaterial, createMaterials, DEPT_FLAT_COLORS, EDGE_COLOR } from './materials';

const unitBox = new BoxGeometry(1, 1, 1);
const unitBoxEdges = new EdgesGeometry(unitBox);

function BoxPrimitive({ spec, materials, edges }: { spec: BoxSpec; materials: Record<string, Material>; edges: boolean }) {
  return (
    <group position={spec.center} rotation={[0, spec.rotationY, 0]} scale={spec.size} name={spec.key} userData={{ refId: spec.refId }}>
      <mesh geometry={unitBox} material={materials[spec.material]} renderOrder={spec.material === 'partition' || spec.material === 'balustrade' ? 2 : 0} />
      {edges && (
        <lineSegments geometry={unitBoxEdges}>
          <lineBasicMaterial color={EDGE_COLOR} />
        </lineSegments>
      )}
    </group>
  );
}

function CylinderPrimitive({ spec, materials, edges }: { spec: CylinderSpec; materials: Record<string, Material>; edges: boolean }) {
  const geometry = useMemo(() => new CylinderGeometry(spec.radius, spec.radius, spec.height, spec.segments), [spec]);
  const edgeGeometry = useMemo(() => new EdgesGeometry(geometry, 30), [geometry]);
  return (
    <group position={spec.center} name={spec.key} userData={{ refId: spec.refId }}>
      <mesh geometry={geometry} material={materials[spec.material]} />
      {edges && (
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial color={EDGE_COLOR} />
        </lineSegments>
      )}
    </group>
  );
}

function Primitive({ spec, materials, edges = true }: { spec: PrimitiveSpec; materials: Record<string, Material>; edges?: boolean }) {
  return spec.kind === 'box' ? <BoxPrimitive spec={spec} materials={materials} edges={edges} /> : <CylinderPrimitive spec={spec} materials={materials} edges={edges} />;
}

export interface GreyboxLayers {
  mass: boolean;
  partitions: boolean;
  signs: boolean;
  balustrades: boolean;
}

export const DEFAULT_LAYERS: GreyboxLayers = { mass: true, partitions: true, signs: true, balustrades: true };

export function Greybox({ layers = DEFAULT_LAYERS, flat = false }: { layers?: GreyboxLayers; flat?: boolean }) {
  const model = useMemo(() => buildGreyboxModel(), []);
  const materials = useMemo(() => createMaterials(flat), [flat]);
  const deptFloor = useMemo(
    () => Object.fromEntries(model.departments.map((d) => [d.id, flat ? { ...materials, floor: createFlatMaterial(DEPT_FLAT_COLORS[d.id]) } : materials])),
    [model, materials, flat],
  );
  const edges = !flat;
  return (
    <group name="World">
      <group name="Building">
        <Primitive spec={model.slab} materials={materials} edges={edges} />
        {layers.mass && <Primitive spec={model.mass} materials={materials} edges={edges} />}
        {layers.balustrades && model.balustrades.map((b) => <Primitive key={b.key} spec={b} materials={materials} edges={edges} />)}
      </group>
      <group name="Atrium">
        <Primitive spec={model.plinth} materials={materials} edges={edges} />
      </group>
      <group name="Departments">
        {model.departments.map((d) => (
          <group key={d.id} name={d.id} userData={{ name: d.name }}>
            <Primitive spec={d.floor} materials={deptFloor[d.id]} edges={false} />
            {layers.partitions && d.walls.map((w) => <Primitive key={w.key} spec={w} materials={materials} edges={edges} />)}
            {layers.signs && <Primitive spec={d.sign} materials={materials} edges={edges} />}
          </group>
        ))}
      </group>
    </group>
  );
}
