/** Responsive rule (architecture/03 §6): pose never changes, only the FOV; safe rect stays visible. */
import { describe, expect, test } from 'vitest';
import { fovForAspect, REFERENCE_ASPECT, SAFE_RECT } from '../src/scene/camera';
import { responsiveMetrics } from '../src/validation/metrics';

describe('responsive FOV rule', () => {
  test('safe rectangle tangents match architecture/03 §6', () => {
    expect(SAFE_RECT.px).toEqual({ left: 248, right: 1580, top: 141, bottom: 642 });
    expect(SAFE_RECT.tan.left).toBeCloseTo(-0.1314, 3);
    expect(SAFE_RECT.tan.right).toBeCloseTo(0.1662, 3);
    expect(SAFE_RECT.tan.top).toBeCloseTo(-0.0736, 3);
    expect(SAFE_RECT.tan.bottom).toBeCloseTo(0.0383, 3);
  });
  test('rule boundaries: keep hFOV above the reference aspect, keep vFOV down to ≈1.581, then fit the safe width', () => {
    expect(fovForAspect(REFERENCE_ASPECT).rule).toBe('reference');
    expect(fovForAspect(2.37).rule).toBe('fit-width');
    expect(fovForAspect(1.6).rule).toBe('keep-vertical');
    expect(fovForAspect(1.585).rule).toBe('keep-vertical');
    expect(fovForAspect(1.575).rule).toBe('fit-safe-width');
    expect(fovForAspect(2.6).rule).toBe('fit-safe-height');
    expect(fovForAspect(1.333).fovDeg).toBeCloseTo((2 * Math.atan(0.1662 / 1.333) * 180) / Math.PI, 1);
  });
  test('safe rectangle stays inside the canvas and the plinth keeps its normalised position', () => {
    const r = responsiveMetrics([
      [1672, 941], [1920, 1080], [2560, 1440], [2560, 1080], [3440, 1440], [1440, 900], [1280, 800], [1366, 768], [1024, 768],
    ]);
    for (const x of r) {
      // ≤ 2 px: the rule fits the MEASURED safe rect exactly; projected plates exceed it by ≤ 1.6 px
      expect(x.safeRectOverflowPx).toBeLessThanOrEqual(2);
      expect(Math.abs(x.plinthNormalised[0] - 0.54)).toBeLessThan(0.01);
      expect(Math.abs(x.plinthNormalised[1] - 0.531)).toBeLessThan(0.015);
    }
  });
});
