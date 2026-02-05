// scripts/clean-images.js
// Remove generated optimized images and manifest

import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';

const outDir = path.join(process.cwd(), 'assets', 'images', 'optimized');
const manifest = path.join(process.cwd(), 'assets', 'images', 'manifest.json');

async function main() {
  const files = glob.sync(path.join(outDir, '*'));
  await Promise.all(files.map(f => fs.unlink(f).catch(() => {})));
  await fs.rmdir(outDir).catch(() => {});
  await fs.unlink(manifest).catch(() => {});
  console.log('Cleaned optimized images and manifest');
}

main().catch(err => console.error(err));
