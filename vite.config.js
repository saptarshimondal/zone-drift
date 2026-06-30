import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import manifest from './src/manifest.json' with { type: 'json' };

import { execSync } from 'child_process';

function patchManifestForFirefox() {
  return {
    name: 'patch-manifest-for-firefox',
    closeBundle() {
      try {
        console.log('Running post-build manifest patch...');
        execSync('node scripts/patch-manifest.js', { stdio: 'inherit' });
      } catch (err) {
        console.error('Failed to run patch script:', err);
      }
    }
  };
}

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../.vite-dist',
    emptyOutDir: true,
  },
  plugins: [
    tailwindcss(),
    crx({ manifest }),
    patchManifestForFirefox()
  ],
});
