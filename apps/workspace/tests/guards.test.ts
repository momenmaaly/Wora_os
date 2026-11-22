/** Mission 004 guard rails: protected values and forbidden content. */
import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import measurements from '@analysis/measurements.json';
import { ROBOT_POSITIONS } from '../src/config/sceneConfig';
import { buildGreyboxModel } from '../src/scene/model';

const SRC = join(__dirname, '..', 'src');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));

describe('protected values', () => {
  test('the "24" / "AI Employees" status group is unchanged in the measured data', () => {
    const el = (measurements.elements as { id: string; name: string }[]).find((e) => e.name.includes('AI Employees'));
    expect(el?.name).toBe('Group "24" / "AI Employees"');
  });
  test('47 visible robots are preserved as data (no robot models in the scene)', () => {
    expect(ROBOT_POSITIONS.length).toBe(47);
    expect((measurements as unknown as { robots: unknown[] }).robots.length).toBe(47);
  });
});

describe('forbidden content', () => {
  const model = buildGreyboxModel();
  test('only structural element types are generated', () => {
    const allowed = new Set(['slab', 'mass', 'floor', 'partition', 'balustrade', 'plinth', 'sign']);
    const specs = [model.slab, model.mass, model.plinth, ...model.balustrades, ...model.departments.flatMap((d) => [d.floor, d.sign, ...d.walls])];
    for (const s of specs) expect(allowed.has(s.material)).toBe(true);
    expect(model.departments.every((d) => d.walls.length === 4)).toBe(true); // closed partitions: no unverified doors
  });
  test('source never imports or embeds the reference image or other raster assets', () => {
    for (const f of files(SRC)) {
      const text = readFileSync(f, 'utf8');
      expect(text).not.toMatch(/import[^;]*\.(png|jpe?g|webp)['"]/);
      expect(text).not.toMatch(/wora-main-workspace\.png/);
    }
  });
  test('the reference overlay URL is DEV-gated', () => {
    const dev = readFileSync(join(SRC, 'dev', 'DevInspector.tsx'), 'utf8');
    expect(dev).toMatch(/import\.meta\.env\.DEV \? __REFERENCE_OVERLAY_URL__ : ''/);
  });
});
