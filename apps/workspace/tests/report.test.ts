/**
 * Writes the metrics quoted by the greybox validation report when WRITE_METRICS=1:
 *   WRITE_METRICS=1 npx vitest run tests/report.test.ts
 * Output: docs/design/main-workspace/greybox/data/greybox-metrics.json (numbers only, no images).
 */
import { expect, test } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { allMetrics } from '../src/validation/metrics';

test('metrics are computable', () => {
  const m = allMetrics();
  expect(m.robots.count).toBe(47);
  if (process.env.WRITE_METRICS === '1') {
    const dir = join(__dirname, '..', '..', '..', 'docs', 'design', 'main-workspace', 'greybox', 'data');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'greybox-metrics.json'), JSON.stringify(m, null, 1) + '\n');
  }
});
