#!/usr/bin/env node
/**
 * Release guard: the production bundle must not contain the locked reference image (or any copy of
 * it), nor the dev-only overlay path. Run after `npm run build` (part of `npm run validate`).
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const shaFile = join(here, '..', '..', '..', 'docs/design/main-workspace/reference/wora-main-workspace.png.sha256');
if (!existsSync(dist)) {
  console.error('check-dist: dist/ not found — run `npm run build` first.');
  process.exit(1);
}
const refSha = readFileSync(shaFile, 'utf8').trim().split(/\s+/)[0];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const problems = [];
const all = walk(dist);
for (const f of all) {
  const buf = readFileSync(f);
  const rel = relative(dist, f);
  if (/\.(png|jpe?g|webp|gif|avif)$/i.test(f)) problems.push(`raster asset in bundle: ${rel}`);
  if (createHash('sha256').update(buf).digest('hex') === refSha) problems.push(`reference image copy: ${rel}`);
  if (/\.(js|html|css)$/.test(f)) {
    // The bundled JSON data carries the reference path as provenance metadata (reference.path). That
    // string is allowed; any other mention (e.g. an <img src> or url()) is not.
    const text = buf
      .toString('utf8')
      .replace(/path:\s*[`'"]docs\/design\/main-workspace\/reference\/wora-main-workspace\.png[`'"]/g, '')
      .replace(/"path":\s*"docs\/design\/main-workspace\/reference\/wora-main-workspace\.png"/g, '');
    if (text.includes('wora-main-workspace.png')) problems.push(`reference path used outside provenance metadata in ${rel}`);
    if (text.includes('Locked reference (DEV overlay)')) problems.push(`dev overlay code not eliminated in ${rel}`);
    if (text.includes('/@fs/')) problems.push(`dev-server /@fs/ path in ${rel}`);
  }
}
if (problems.length) {
  console.error('check-dist: FAILED\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`check-dist: OK (${all.length} files, no reference image, no raster assets, no dev overlay path)`);
