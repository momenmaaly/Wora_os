/**
 * Fidelity-reset UI shell tests — the reference's dashboard interface is part of the design and
 * must be reproduced verbatim at its measured positions (analysis/04; measurements.json).
 * Additive; the existing suites are untouched.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ACTIVITY_ROWS, NAV_ITEMS, REF_FRAME, STATUS_METRICS, UI_STRINGS, VIEW_TABS, uiBox } from '../src/ui/uiSpec';
import measurements from '@analysis/measurements.json';

const SRC = join(__dirname, '..', 'src');

describe('UI shell: verbatim reference strings (analysis/04 rule: never rename/shorten)', () => {
  const srcFiles = ((): string[] => {
    const out: string[] = [];
    for (const f of ['UiShell.tsx', 'uiSpec.ts']) out.push(readFileSync(join(SRC, 'ui', f), 'utf8'));
    return out;
  })();
  const all = srcFiles.join('\n');

  const verbatim = [
    UI_STRINGS.wordmark, UI_STRINGS.badge, UI_STRINGS.company, UI_STRINGS.live,
    UI_STRINGS.upgradeTitle, UI_STRINGS.upgradeLine1, UI_STRINGS.upgradeLine2, UI_STRINGS.upgradeButton,
    UI_STRINGS.searchPlaceholder, UI_STRINGS.operational, UI_STRINGS.profileName, UI_STRINGS.profileRole,
    UI_STRINGS.activityTitle, UI_STRINGS.viewAll, UI_STRINGS.commandTitle, UI_STRINGS.commandPlaceholder,
    ...NAV_ITEMS.map((n) => n.label),
    ...ACTIVITY_ROWS.flatMap((r) => [r.name, r.detail, r.time]),
    ...STATUS_METRICS.map((m) => m.label),
    ...VIEW_TABS.map((t) => t.label),
  ];
  test('every catalogued label appears verbatim in the shell sources', () => {
    for (const str of verbatim) expect(all.includes(str), JSON.stringify(str)).toBe(true);
  });

  test('the immutable status counts are 24 / 08 / 03 / 01', () => {
    expect(STATUS_METRICS.map((m) => m.value)).toEqual(['24', '08', '03', '01']);
    expect(all.includes("'24'")).toBe(true);
  });
});

describe('UI shell: measured geometry', () => {
  test('nav has 11 rows, activity 4 rows, tabs 3 — matching the catalogue', () => {
    expect(NAV_ITEMS.length).toBe(11);
    expect(ACTIVITY_ROWS.length).toBe(4);
    expect(VIEW_TABS.length).toBe(3);
    expect(NAV_ITEMS[0]).toMatchObject({ label: 'Company Overview', active: true });
    expect(VIEW_TABS[0]).toMatchObject({ label: '3D View', active: true });
  });

  test('key element boxes equal the measured inventory (REG + spot UI boxes)', () => {
    const cases: [string, number, number, number, number][] = [
      ['REG-01', 0, 0, 295, 67],
      ['REG-02', 0, 67, 235, 874],
      ['REG-06', 1420, 83, 236, 266],
      ['REG-07', 481, 829, 852, 112],
      ['REG-08', 1369, 853, 288, 73],
      ['UI-016', 13, 175, 203, 40],
      ['UI-031', 19, 727, 197, 166],
      ['UI-040', 560, 10, 562, 47],
      ['UI-050', 550, 63, 590, 64],
      ['UI-083', 553, 867, 764, 49],
      ['UI-085', 1272, 874, 37, 37],
    ];
    for (const [id, x, y, w, h] of cases) {
      const b = uiBox(id);
      expect([b.x, b.y, b.w, b.h], id).toEqual([x, y, w, h]);
    }
    const measured = measurements.elements.find((e) => e.id === 'UI-020');
    expect(measured).toBeDefined();
    expect(uiBox('UI-020').x).toBe(measured!.x);
  });

  test('reference frame matches the locked image dimensions', () => {
    expect(REF_FRAME).toEqual({ w: 1672, h: 941 });
  });
});

describe('UI shell: implementation form', () => {
  test('the shell is DOM components, not an image (no reference file usage)', () => {
    const shell = readFileSync(join(SRC, 'ui', 'UiShell.tsx'), 'utf8');
    expect(shell.includes('wora-main-workspace.png')).toBe(false);
    expect(shell.includes('backgroundImage')).toBe(false);
    expect(shell.includes('data-testid="ui-shell"')).toBe(true);
  });
});
