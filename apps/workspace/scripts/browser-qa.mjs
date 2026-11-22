import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chromiumBinary, { inflate } from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const repoRoot = path.resolve(appRoot, '../..');
const output = path.join(repoRoot, 'docs/design/main-workspace/greybox/qa-browser');
const baseURL = process.env.WORA_BASE_URL ?? 'http://127.0.0.1:5173';
await mkdir(output, { recursive: true });

// The npm-packaged Chromium includes its AL2023 shared libraries; extract them on Debian too.
const chromiumBin = path.join(path.dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))), '..', 'bin');
await inflate(path.join(chromiumBin, 'al2023.tar.br'));
process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;
const executablePath = await chromiumBinary.executablePath();
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: chromiumBinary.args.filter(arg => arg !== '--mute-audio'),
});
const errors = [];
const viewportResults = [];
const allViewports = [
  [1920, 1080, 'desktop-1920x1080'],
  [1440, 900, 'desktop-1440x900'],
  [1366, 768, 'desktop-1366x768'],
  [390, 844, 'mobile-390x844'],
  [430, 932, 'mobile-430x932'],
];
const requested = process.env.WORA_QA_VIEWPORTS?.split(',').map(x => x.trim());
const viewports = requested ? allViewports.filter(([, , label]) => requested.includes(label)) : allViewports;
if (!viewports.length) throw new Error('WORA_QA_VIEWPORTS did not match a known viewport label.');

try {
  const first = viewports[0];
  const page = await browser.newPage({ viewport: { width: first[0], height: first[1] }, deviceScaleFactor: 1 });
  let currentLabel = first[2];
  page.on('pageerror', error => errors.push(`${currentLabel}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`${currentLabel} console: ${message.text()}`); });
  for (const [width, height, label] of viewports) {
    currentLabel = label;
    await page.setViewportSize({ width, height });
    const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) throw new Error(`${label}: app returned ${response?.status()}`);
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForFunction(() => window.__WORA_CAMERA__ && document.querySelector('[data-testid="ui-shell"]'), null, { timeout: 30000 });
    await page.waitForTimeout(1200);
    const renderInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      return {
        canvasWidth: canvas?.width ?? 0,
        canvasHeight: canvas?.height ?? 0,
        renderer: gl && ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl ? gl.getParameter(gl.RENDERER) : 'no-webgl-context',
        speechSynthesis: 'speechSynthesis' in window,
        speechVoices: 'speechSynthesis' in window ? speechSynthesis.getVoices().length : 0,
        homeCamera: window.__WORA_CAMERA__?.position.toArray() ?? null,
      };
    });
    const shot = path.join(output, `${label}.png`);
    await page.screenshot({ path: shot, fullPage: false, animations: 'disabled', timeout: 120000 });
    viewportResults.push({ label, width, height, screenshot: path.relative(repoRoot, shot), ...renderInfo });

    // Compare actual browser pixels to the exact source resized to this viewport. This is a raw
    // mismatch ratio, not a perceptual/fidelity score: it intentionally records all composition
    // and reconstruction differences rather than declaring an acceptance threshold.
    const refBytes = await (await import('node:fs/promises')).readFile(path.join(repoRoot, 'docs/design/main-workspace/reference/wora-main-workspace.png'));
    const ref = PNG.sync.read(refBytes);
    const shotPng = PNG.sync.read(await (await import('node:fs/promises')).readFile(shot));
    const scaled = new PNG({ width, height });
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const sx = Math.min(ref.width - 1, Math.floor(x * ref.width / width));
      const sy = Math.min(ref.height - 1, Math.floor(y * ref.height / height));
      const si = (sy * ref.width + sx) * 4, di = (y * width + x) * 4;
      scaled.data.set(ref.data.subarray(si, si + 4), di);
    }
    const diff = new PNG({ width, height });
    const mismatchPixels = pixelmatch(scaled.data, shotPng.data, diff.data, width, height, { threshold: 0.12, includeAA: true });
    const diffPath = path.join(output, `${label}-diff.png`);
    await writeFile(diffPath, PNG.sync.write(diff));
    viewportResults[viewportResults.length - 1].rawPixelDiff = {
      comparedAgainst: 'original 1672x941 source resized with nearest-neighbor; raw diagnostic only',
      threshold: 0.12,
      mismatchedPixels: mismatchPixels,
      totalPixels: width * height,
      mismatchRatio: Number((mismatchPixels / (width * height)).toFixed(5)),
      diffImage: path.relative(repoRoot, diffPath),
    };
  }

  // Functional browser smoke checks, kept separate from the pristine viewport captures.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[data-mobile-ui-shell]', { timeout: 15000 });
  const search = page.getByLabel('Search across your company…');
  const architecture = JSON.parse(await readFile(path.join(repoRoot, 'docs/design/main-workspace/architecture/data/scene-architecture.json'), 'utf8'));
  const actorRows = new Map(architecture.robot_visual.rows.map(row => [row.id, row]));
  const employeeAudit = [];
  for (let n = 1; n <= 47; n++) {
    const name = `WORA Employee ${String(n).padStart(3, '0')}`;
    const id = `ROBOT-${String(n).padStart(3, '0')}`;
    await search.fill(name);
    const option = page.getByRole('option').first();
    await option.waitFor({ timeout: 15000 });
    const searchSummary = await option.textContent();
    await option.click();
    const details = page.locator(`aside[aria-label="${name} information"]`);
    await details.waitFor({ timeout: 15000 });
    const detailText = await details.innerText();
    const expected = actorRows.get(id);
    const shownLocation = detailText.match(/Measured floor location \(X, Z\):\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
    const expectedLocation = expected?.floor_xz.map(value => Number(value).toFixed(3));
    if (!expected || !detailText.includes(id) || !detailText.includes('Status:') || !detailText.includes(expected.zone) || !searchSummary?.includes(id) || !shownLocation || shownLocation[1] !== expectedLocation?.[0] || shownLocation[2] !== expectedLocation?.[1]) {
      throw new Error(`Employee browser audit failed for ${id}: expected catalogue identity, department, location, and visible status to match.`);
    }
    employeeAudit.push({ id, name, department: expected.zone, expectedLocation, shownLocation: shownLocation.slice(1), identityAndLocationMatched: true, detailsExposeStatus: true });
    if (n === 1) {
      const voiceCount = await page.evaluate(() => ('speechSynthesis' in window ? window.speechSynthesis.getVoices().length : 0));
      const playDisabled = await details.getByRole('button', { name: 'Play employee introduction', exact: true }).isDisabled();
      const audioFallback = (await details.innerText()).includes('Audio unavailable; text fallback is available.');
      if (voiceCount === 0 && (!playDisabled || !audioFallback)) throw new Error('Missing-voice speech fallback is not exposed.');
      employeeAudit[0].speechVoicesInBrowser = voiceCount;
      employeeAudit[0].playDisabledWithoutVoice = playDisabled;
      employeeAudit[0].textFallbackVisible = audioFallback;
      await details.getByRole('button', { name: 'Mute employee introduction' }).click();
      const muted = await details.getByRole('button', { name: 'Mute employee introduction' }).getAttribute('aria-pressed');
      await details.getByRole('button', { name: 'Mute employee introduction' }).click();
      if (muted !== 'true') throw new Error('Employee speech mute toggle failed.');
    }
    await details.getByRole('button', { name: 'Close employee details' }).click();
  }
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Agent Directory', exact: true }).click();
  const directoryCount = await page.locator('section[aria-label="Agent Directory"] button').count();
  if (directoryCount !== 48) throw new Error(`Expected 47 directory entries plus close control, got ${directoryCount}.`);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.getByRole('button', { name: 'Floor Plan' }).click();
  const floorPlanShot = path.join(output, 'mobile-floor-plan-390x844.png');
  await page.screenshot({ path: floorPlanShot, fullPage: false, animations: 'disabled', timeout: 120000 });
  await page.getByRole('button', { name: 'Live View' }).click();
  const lifePanel = page.getByRole('region', { name: 'Employee life simulation' });
  await lifePanel.waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
  const liveViewShot = path.join(output, 'mobile-live-view-390x844.png');
  await page.screenshot({ path: liveViewShot, fullPage: false, animations: 'disabled', timeout: 120000 });
  const raf = await page.evaluate(() => new Promise(resolve => {
    let frames = 0;
    const start = performance.now();
    const tick = now => { frames++; if (now - start >= 2000) resolve({ frames, durationMs: now - start, fps: Math.round(frames * 1000 / (now - start)) }); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Executive Command', exact: true }).click();
  await page.getByLabel('Tell your company what to do').fill('browser QA not-sent check');
  await page.getByRole('button', { name: 'Submit command' }).click();
  const commandResponse = await page.getByRole('status').filter({ hasText: 'Not sent: no connected task runtime.' }).count();
  if (!commandResponse) throw new Error('Executive Command did not disclose its disconnected runtime.');
  await writeFile(path.join(output, 'browser-interactions.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), mobileSearchSelectionCount: employeeAudit.length, employeeAudit, directoryButtonsIncludingClose: directoryCount, viewSwitches: ['Floor Plan', 'Live View'], modeScreenshots: [path.relative(repoRoot, floorPlanShot), path.relative(repoRoot, liveViewShot)], lifePanelVisible: true, softwareWebGlRafSample: raf, commandNotSentDisclosure: true, muteToggle: 'passed', note: 'Browser clicks inspect local demo data; RAF sample is headless SwiftShader, not representative hardware FPS. These checks do not establish live backend behavior or audible output.' }, null, 2)}\n`);
} finally {
  await browser.close();
}
const report = { generatedAt: new Date().toISOString(), browser: 'Chromium 153 via @sparticuz/chromium; headless + SwiftShader (software WebGL)', baseURL, viewports: viewportResults, browserErrors: errors };
await writeFile(path.join(output, 'browser-qa.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
