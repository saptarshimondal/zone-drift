const fs = require('fs');
const path = require('path');

const tmpDist = path.join(__dirname, '../.vite-dist');
const finalDist = path.join(__dirname, '../dist');
const chromeDist = path.join(finalDist, 'chrome');
const firefoxDist = path.join(finalDist, 'firefox');

// 1. Ensure dist folder exists and is empty
if (fs.existsSync(finalDist)) {
  fs.rmSync(finalDist, { recursive: true, force: true });
}
fs.mkdirSync(finalDist, { recursive: true });

if (!fs.existsSync(tmpDist)) {
  console.error("Temporary build folder not found. Build failed?");
  process.exit(1);
}

// 2. Move tmpDist to dist/chrome
fs.renameSync(tmpDist, chromeDist);

// 3. Copy dist/chrome to dist/firefox
fs.cpSync(chromeDist, firefoxDist, { recursive: true });

// 4. Patch dist/firefox/manifest.json for Firefox MV3 compatibility
const firefoxManifestPath = path.join(firefoxDist, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(firefoxManifestPath, 'utf8'));

if (manifest.background && manifest.background.service_worker) {
  manifest.background.scripts = [manifest.background.service_worker];
  delete manifest.background.service_worker; // Remove service_worker so it uses scripts exclusively
}

fs.writeFileSync(firefoxManifestPath, JSON.stringify(manifest, null, 2));

console.log('✅ Successfully generated dist/chrome and dist/firefox!');
