#!/usr/bin/env node
/**
 * One-off: on-brand gradient placeholders so the build/dev server works
 * before the real AI photos are generated (see scripts/generate-images.mjs).
 * Safe to delete once real images exist at the same paths.
 */
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

function gradientSvg(w, h, label) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="55%" stop-color="#004cca"/>
          <stop offset="100%" stop-color="#00c2ff"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.round(h * 0.06)}" fill="rgba(255,255,255,0.55)" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>
  `);
}

async function run() {
  await sharp(gradientSvg(1600, 900, 'NEXTRACKING — placeholder hero-fleet')).webp({ quality: 80 }).toFile(path.join(IMG_DIR, 'hero-fleet.webp'));
  await sharp(gradientSvg(1200, 800, 'NEXTRACKING — placeholder hardware-closeup')).webp({ quality: 80 }).toFile(path.join(IMG_DIR, 'hardware-closeup.webp'));
  await sharp(gradientSvg(1200, 630, 'NEXTRACKING')).jpeg({ quality: 80 }).toFile(path.join(PUBLIC_DIR, 'og-cover.jpg'));
  console.log('Placeholders listos en src/assets/images/ y public/.');
}

run();
