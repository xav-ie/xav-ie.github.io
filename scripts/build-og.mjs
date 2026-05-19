#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const heart = resolve(__dirname, '../public/heart.svg');
const output = resolve(__dirname, '../public/og.png');

const bg = '#150b1e';
const fg = '#fff17b';

const args = [
  '-size', '1200x630', `xc:${bg}`,
  '(', '-background', 'none', heart, '-resize', '360x360', ')',
  '-gravity', 'East', '-geometry', '+100+0', '-composite',
  '-gravity', 'NorthWest', '-fill', fg, '-font', 'DejaVu-Sans-Bold',
  '-pointsize', '110', '-annotate', '+90+200', 'Xavier Ruiz',
  '-gravity', 'NorthWest', '-fill', fg, '-font', 'DejaVu-Sans',
  '-pointsize', '50', '-annotate', '+92+330', 'Full-Stack Developer',
  '-gravity', 'NorthWest', '-fill', fg, '-font', 'DejaVu-Sans',
  '-pointsize', '36', '-annotate', '+92+540', 'xav.ie',
  output,
];

try {
  execFileSync('magick', args, { stdio: 'pipe' });
  console.log('generated og.png → public/og.png');
} catch (err) {
  if (existsSync(output)) {
    console.warn(`og.png generation failed (${err.message}); keeping existing public/og.png`);
  } else {
    console.error(`og.png generation failed (${err.message}) and no fallback exists`);
    process.exit(1);
  }
}
