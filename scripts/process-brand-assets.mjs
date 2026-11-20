#!/usr/bin/env node
/**
 * One-off: process the client-supplied brand PNGs (dropped in public/ by hand)
 * into optimized web assets, then remove the raw source PNGs from public/
 * (they don't need to ship — only the processed outputs do).
 *
 * - "Nextracking Blue Satellite Logo.png" -> src/assets/images/logo-nextracking.webp
 *   Source has a baked-in near-white background (no real alpha channel), so we
 *   chroma-key white -> transparent (safe here: the mark has no white pixels).
 * - "Blue-Cyan Satellite Location Logo.png" -> public/favicon-32.png,
 *   public/apple-touch-icon.png (180), public/icon-512.png (already has alpha).
 */
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const IMG_DIR = path.join(ROOT, 'src', 'assets', 'images');

const LOGO_SRC = path.join(PUBLIC_DIR, 'Nextracking Blue Satellite Logo.png');
const FAVICON_SRC = path.join(PUBLIC_DIR, 'Blue-Cyan Satellite Location Logo.png');

async function whiteToAlpha(inputPath) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const min = Math.min(r, g, b);
    const alpha = 255 - min; // near-white -> near-transparent
    const outIdx = i * 4;
    if (alpha === 0) {
      out[outIdx] = 0;
      out[outIdx + 1] = 0;
      out[outIdx + 2] = 0;
    } else {
      // un-premultiply so colors don't darken near the faded edge
      const scale = 255 / alpha;
      out[outIdx] = Math.min(255, Math.round(r * scale));
      out[outIdx + 1] = Math.min(255, Math.round(g * scale));
      out[outIdx + 2] = Math.min(255, Math.round(b * scale));
    }
    out[outIdx + 3] = alpha;
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

async function run() {
  // Logo wordmark: restore alpha, trim transparent padding, export @2x webp.
  const logo = await whiteToAlpha(LOGO_SRC);
  await logo
    .png() // trim needs a real format to re-read from
    .toBuffer()
    .then((buf) =>
      sharp(buf)
        .trim({ threshold: 10 })
        .resize({ height: 96 }) // @2x for a ~48px-tall header logo
        .webp({ quality: 92 })
        .toFile(path.join(IMG_DIR, 'logo-nextracking.webp'))
    );
  console.log('-> src/assets/images/logo-nextracking.webp');

  // Favicon family from the satellite/location mark (already has real alpha).
  await sharp(FAVICON_SRC).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'favicon-32.png'));
  await sharp(FAVICON_SRC).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  await sharp(FAVICON_SRC).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
  console.log('-> public/favicon-32.png, apple-touch-icon.png, icon-512.png');

  // Clean up the raw drops — they're large, unoptimized, and not referenced.
  for (const f of [LOGO_SRC, FAVICON_SRC]) {
    if (existsSync(f)) rmSync(f);
  }
  console.log('Raw source PNGs removed from public/.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
