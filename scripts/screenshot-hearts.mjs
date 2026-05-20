#!/usr/bin/env node
/**
 * screenshot-hearts.mjs
 *
 * Captures a tight crop of the heart SVG (role="img" inside .logo) for review.
 *
 * Usage:
 *   node scripts/screenshot-hearts.mjs [label]
 *
 * Outputs:
 *   /tmp/svg-<label>.png         — close-up of the heart
 *   /tmp/svg-<label>-page.png    — wider context shot (page top-left)
 *
 * Requirements:
 *   - puppeteer installed (pnpm add -D puppeteer)
 *   - Chromium available at /etc/profiles/per-user/x/bin/chromium (Nix)
 *     OR set CHROMIUM_PATH env var to a custom path
 *   - Dev server running at http://localhost:5173/  (override with HEART_URL)
 */

import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import path from 'path';

const label = process.argv[2] ?? 'r1';
const BASE_URL = process.env.HEART_URL ?? 'http://localhost:5173/';
const OUT_DIR = '/tmp';
const VIEWPORT_W = 1400;
const VIEWPORT_H = 900;
const DPR = 2;
const PAD = 24;

const CHROMIUM_PATH =
  process.env.CHROMIUM_PATH ?? '/etc/profiles/per-user/x/bin/chromium';

const CHROME_ARGS = [
  '--use-gl=swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--disable-gpu-sandbox',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  `--window-size=${VIEWPORT_W},${VIEWPORT_H}`,
];

console.log(`[screenshot-hearts] label=${label}  url=${BASE_URL}`);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROMIUM_PATH,
  args: CHROME_ARGS,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: VIEWPORT_W, height: VIEWPORT_H, deviceScaleFactor: DPR });

  console.log('  → navigating…');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30_000 });

  await new Promise(r => setTimeout(r, 800));

  const rect = await page.evaluate(() => {
    const heart =
      document.querySelector('.logo svg[role="img"]') ??
      document.querySelector('svg[role="img"]');
    if (!heart) return null;
    const r = heart.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });

  if (!rect) {
    throw new Error('No heart SVG (role="img") found on the page.');
  }

  console.log(`  → heart rect: ${rect.width.toFixed(1)}×${rect.height.toFixed(1)} at (${rect.left.toFixed(1)},${rect.top.toFixed(1)})`);

  async function screenshotCrop(cssX, cssY, cssW, cssH, outFile) {
    const buf = await page.screenshot({
      type: 'png',
      clip: { x: cssX, y: cssY, width: cssW, height: cssH, scale: DPR },
    });
    const filePath = path.join(OUT_DIR, outFile);
    await writeFile(filePath, buf);
    console.log(`  ✓ ${filePath}`);
    return filePath;
  }

  await screenshotCrop(
    Math.max(0, rect.left - PAD),
    Math.max(0, rect.top - PAD),
    rect.width + PAD * 2,
    rect.height + PAD * 2,
    `svg-${label}.png`,
  );

  console.log('[screenshot-hearts] done.');
} finally {
  await browser.close();
}
