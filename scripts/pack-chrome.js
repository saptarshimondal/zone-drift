const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const distDir = path.resolve(__dirname, '../dist/chrome');
const outputDir = path.resolve(__dirname, '../web-ext-artifacts/chrome');
const zipFile = path.join(outputDir, 'chrome-extension.zip');

if (!fs.existsSync(distDir)) {
  console.error('\n❌ Chrome distribution folder not found. Please run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  if (process.platform === 'win32') {
    execFileSync('powershell', [
      '-NoProfile',
      '-NonInteractive',
      'Compress-Archive',
      '-Path',
      distDir + '\\*',
      '-DestinationPath',
      zipFile,
      '-Force'
    ], { stdio: 'inherit' });
  } else {
    execFileSync('zip', ['-r', zipFile, '.', '-x', '*.map'], { stdio: 'inherit', cwd: distDir });
  }
  console.log(`\n✅ Chrome extension packed successfully: ${zipFile}`);
} catch (error) {
  console.error('\n❌ Failed to create zip file.');
  process.exit(1);
}
