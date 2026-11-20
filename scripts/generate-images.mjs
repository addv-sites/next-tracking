#!/usr/bin/env node
/**
 * Generates the hyperrealistic marketing photos for the site using the
 * OpenAI Images API, then downsizes/converts them to optimized WebP.
 *
 * Run locally (never in CI — this needs your personal OPENAI_API_KEY and
 * only needs to run once per image set):
 *
 *   OPENAI_API_KEY=sk-... npm run generate:images
 *
 * Or put OPENAI_API_KEY in a local .env (gitignored) and use a tool like
 * `dotenv-cli`, or just export it in your shell before running.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import OpenAI from 'openai';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Falta OPENAI_API_KEY en el entorno. Ejemplo:\n  OPENAI_API_KEY=sk-... npm run generate:images');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const JOBS = [
  {
    file: 'hero-fleet',
    size: '1536x1024',
    targetWidth: 1600,
    prompt:
      'Ultra-realistic professional photograph of a convoy of modern cargo trucks (tractocamiones) and a pickup truck driving on a wide Mexican highway at golden hour, slight motion blur on wheels, dramatic warm sunset light, shallow depth of field, shot on a full-frame camera 35mm lens, corporate fleet logistics advertising photography, clean asphalt, mountains in the background, no text, no logos, no watermarks, photorealistic, high detail.',
  },
  {
    file: 'hardware-closeup',
    size: '1536x1024',
    targetWidth: 1200,
    prompt:
      'Ultra-realistic close-up photograph of a professional technician installing a small GPS tracking device under the dashboard of a commercial truck, focused hands and device in sharp focus, soft interior cabin lighting, shallow depth of field, photojournalistic advertising style, no text, no logos, no watermarks, photorealistic, high detail.',
  },
];

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  for (const job of JOBS) {
    console.log(`Generando ${job.file}...`);
    const result = await client.images.generate({
      model: 'gpt-image-1',
      prompt: job.prompt,
      size: job.size,
      quality: 'high',
      n: 1,
    });

    const b64 = result.data[0].b64_json;
    const buffer = Buffer.from(b64, 'base64');
    const rawPath = path.join(OUT_DIR, `${job.file}.raw.png`);
    writeFileSync(rawPath, buffer);

    const outPath = path.join(OUT_DIR, `${job.file}.webp`);
    await sharp(buffer)
      .resize({ width: job.targetWidth })
      .webp({ quality: 82 })
      .toFile(outPath);

    console.log(`  -> ${outPath}`);
  }

  // Open Graph cover derived from the hero shot (1200x630 standard OG size).
  // Lives in public/ (not src/assets) so it gets a stable, unhashed URL that
  // matches the hardcoded og:image / twitter:image meta tags in index.html.
  const heroWebp = path.join(OUT_DIR, 'hero-fleet.webp');
  if (existsSync(heroWebp)) {
    await sharp(heroWebp)
      .resize({ width: 1200, height: 630, fit: 'cover' })
      .jpeg({ quality: 82 })
      .toFile(path.join(PUBLIC_DIR, 'og-cover.jpg'));
    console.log('  -> public/og-cover.jpg');
  }

  console.log('\nListo. Revisa src/assets/images/ y borra los *.raw.png si no los necesitas.');
}

run().catch((err) => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
