/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const referencePng = path.join(repoRoot, 'docs/design/main-workspace/reference/wora-main-workspace.png');

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      // Single source of truth for all measured / solved values (Mission 003).
      '@architecture': path.join(repoRoot, 'docs/design/main-workspace/architecture/data'),
      '@analysis': path.join(repoRoot, 'docs/design/main-workspace/analysis/data'),
    },
  },
  define: {
    // The locked reference may be shown as a QA overlay in DEV only (analysis/06 P-6).
    // In production builds this is an empty string and the overlay code is dead-code-eliminated.
    __REFERENCE_OVERLAY_URL__: JSON.stringify(command === 'serve' ? `/@fs${referencePng}` : ''),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    fs: { allow: [repoRoot] },
  },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: {
    outDir: 'dist', sourcemap: true, chunkSizeWarningLimit: 1500,
    // Keep the heavy, shared 3D/runtime packages out of the app entry chunk.
    rolldownOptions: { output: { codeSplitting: { groups: [{ name: 'vendor', test: /node_modules/ }] } } },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
}));
