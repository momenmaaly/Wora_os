/**
 * Projects marker world points every frame and writes the result straight into SVG nodes
 * (no React re-render). Lives inside <Canvas> so it shares the live camera.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { RefObject } from 'react';
import type { MarkerPair } from './markerSets';

const v = new Vector3();

export function ProjectedMarkers({ markers, svgRef }: { markers: MarkerPair[]; svgRef: RefObject<SVGSVGElement | null> }) {
  const size = useThree((s) => s.size);
  useFrame(({ camera }) => {
    const svg = svgRef.current;
    if (!svg) return;
    markers.forEach((m, i) => {
      const node = svg.querySelector<SVGGElement>(`[data-proj="${i}"]`);
      if (!node) return;
      v.set(...m.world).project(camera);
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      node.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      const link = svg.querySelector<SVGLineElement>(`[data-link="${i}"]`);
      if (link) {
        link.setAttribute('x2', x.toFixed(2));
        link.setAttribute('y2', y.toFixed(2));
      }
    });
  });
  return null;
}
