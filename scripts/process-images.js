// scripts/process-images.js
// - Optimizes SVGs with SVGO
// - Rasterizes SVGs to WebP at several widths using sharp
// - Creates assets/images/manifest.json with srcset info
// - Builds an SVG sprite from assets/icons/*.svg

import fs from 'fs/promises';
import path from 'path';
import { optimize } from 'svgo';
import { sync as globSync } from 'glob';
import sharp from 'sharp';

const root = process.cwd();
const imgDir = path.join(root, 'assets', 'images');
const iconsDir = path.join(root, 'assets', 'icons');
const outDir = path.join(imgDir, 'optimized');

const widths = [320, 640, 960, 1280];

async function ensure(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function basenameNoExt(p) {
  return path.basename(p, path.extname(p));
}

async function optimizeSVG(file) {
  const raw = await fs.readFile(file, 'utf8');
  const res = optimize(raw, { path: file, multipass: true });
  await fs.writeFile(file, res.data, 'utf8');
}

async function rasterizeSVG(file) {
  const name = basenameNoExt(file);
  const src = path.join(outDir);
  await Promise.all(widths.map(async (w) => {
    const out = path.join(src, `${name}-${w}.webp`);
    // sharp will rasterize at width while preserving aspect ratio
    await sharp(file).resize(w).webp({ quality: 80 }).toFile(out);
  }));
}

async function buildManifest() {
  const files = globSync(outDir.replace(/\\\\/g, '/') + '/*.webp');
  const manifest = {};
  // files example: assets/images/optimized/corte-h-320.webp
  files.forEach(fpath => {
    const file = path.basename(fpath);
    const m = file.match(/^(.*)-(\d+)\.webp$/);
    if (!m) return;
    const name = m[1];
    const w = m[2];
    manifest[name] = manifest[name] || { placeholder: `assets/images/${name}.svg`, sizes: "(max-width: 800px) 100vw, 300px", src: '', srcsetArr: [] };
    manifest[name].srcsetArr.push(`${path.posix.join('assets/images/optimized', file)} ${w}w`);
    // set largest as src (we'll pick the max width)
    const currentSrc = manifest[name].src ? manifest[name].src : '';
    const currentW = currentSrc ? Number(currentSrc.match(/-(\d+)\.webp$/)[1]) : 0;
    if (Number(w) > currentW) {
      manifest[name].src = path.posix.join('assets/images/optimized', file);
    }
  });
  // finalize srcset strings
  Object.keys(manifest).forEach(k => {
    manifest[k].srcset = manifest[k].srcsetArr.sort((a,b) => {
      const wa = Number(a.match(/-(\d+)\.webp/)[1]);
      const wb = Number(b.match(/-(\d+)\.webp/)[1]);
      return wa - wb;
    }).join(', ');
    delete manifest[k].srcsetArr;
  });
  await fs.writeFile(path.join(imgDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Generated manifest.json');
}

async function buildIconSprite() {
  const iconPattern = iconsDir.replace(/\\\\/g, '/') + '/*.svg';
  const files = globSync(iconPattern);
  let spriteContent = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n';
  for (const f of files) {
    const raw = await fs.readFile(f, 'utf8');
    const name = basenameNoExt(f).replace(/\s+/g, '-');
    // Extract inner SVG content (naive)
    const inner = raw.replace(/<\/?svg[^>]*>/g, '');
    spriteContent += `<symbol id="icon-${name}" viewBox="0 0 24 24">${inner}</symbol>\n`;
  }
  spriteContent += '</svg>';
  await fs.writeFile(path.join(iconsDir, 'sprite.svg'), spriteContent, 'utf8');
  console.log('Built icons/sprite.svg');
}

async function main() {
  console.log('Starting image processing...');
  await ensure(outDir);
  const svgPattern = imgDir.replace(/\\\\/g, '/') + '/*.svg';
  const svgs = globSync(svgPattern);
  console.log('Found svgs:', svgs);
  for (const s of svgs) {
    console.log('Optimizing SVG', s);
    await optimizeSVG(s);
    console.log('Rasterizing', s);
    await rasterizeSVG(s);
  }
  await buildManifest();
  await buildIconSprite();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
