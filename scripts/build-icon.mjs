#!/usr/bin/env node
// Generates the stylized-heart icon assets shared with HeartGoldSvg
// (see src/heart-svg.ts):
//
//   public/favicon.svg               — tab/browser favicon. Heart fills
//                                       its natural viewBox. CSS drop-
//                                       shadow filter is omitted so the
//                                       SVG renders identically across
//                                       favicon parsers that ignore CSS
//                                       on the root element. Whitespace
//                                       between tags is stripped to keep
//                                       the per-tab payload small.
//
//   public/apple-touch-icon.png      — iOS home-screen icon. 180×180, no
//                                       safe-zone padding (iOS rounds
//                                       corners with a fixed radius, no
//                                       circle/squircle masks).
//
//   public/icon-512-maskable.png     — PWA home-screen icon. Heart is
//                                       confined to the inner 80% safe
//                                       zone over a #12081a fill so
//                                       Android/Chromium can apply circle
//                                       /squircle masks without cropping
//                                       the logo (per the maskable icon
//                                       spec).

import { writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import {
  buildHeartInner,
  buildHeartSvg,
  HEART_VIEWBOX,
} from "../src/heart-svg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(__dirname, "../public");
const faviconPath = path.resolve(publicDirectory, "favicon.svg");
const appleTouchPath = path.resolve(publicDirectory, "apple-touch-icon.png");
const maskablePath = path.resolve(publicDirectory, "icon-512-maskable.png");

const APPLE_SIZE = 180;
const MASK_SIZE = 512;
const MASK_SAFE = 0.8; // content fits in the inner 80% (safe zone for masks)
const BG = "#12081a"; // matches theme-color

// Strip newlines and runs of whitespace between tags. Safe for SVG since
// none of our text/attr values contain meaningful runs of spaces.
function minifySvg(svg) {
  return svg.replaceAll(/>\s+</g, "><").replaceAll(/\s+/g, " ").trim();
}

async function buildFavicon() {
  // Drop-shadow CSS filter is intentionally disabled — Chrome and Safari
  // ignore CSS filters declared via inline `style` on the SVG root when
  // rendering favicons, so the drop-shadow would only show in some
  // contexts and not others. The internal hgs-shadow SVG filter still
  // gives the heart its inset shadow.
  const svg = minifySvg(
    buildHeartSvg({ size: "32", title: "xav.ie", dropShadow: false }),
  );
  await writeFile(faviconPath, svg);
  console.log(`generated favicon.svg → public/ (${svg.length} bytes)`);
}

async function buildAppleTouch() {
  // iOS applies a fixed-radius rounded-square mask (it doesn't use the
  // maskable spec). Filling more of the canvas keeps the heart at the
  // visual size users expect on a home screen, without a noticeable
  // border. Same #12081a fill so the corners under iOS's rounding match
  // the theme.
  const inner = buildHeartInner();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${APPLE_SIZE}" height="${APPLE_SIZE}" viewBox="0 0 ${APPLE_SIZE} ${APPLE_SIZE}"><rect width="${APPLE_SIZE}" height="${APPLE_SIZE}" fill="${BG}"/><svg x="0" y="0" width="${APPLE_SIZE}" height="${APPLE_SIZE}" viewBox="${HEART_VIEWBOX}" overflow="visible">${inner}</svg></svg>`;

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: APPLE_SIZE },
    background: BG,
  })
    .render()
    .asPng();

  await writeFile(appleTouchPath, png);
  console.log(`generated apple-touch-icon.png → public/ (${png.length} bytes)`);
}

async function buildMaskable() {
  // Nest the heart inside an outer SVG that paints the maskable-friendly
  // background and confines the heart to the safe zone via a child <svg>
  // with its own viewBox. The inner <svg> auto-fits its viewBox into the
  // declared width/height — no manual translate/scale needed.
  const inner = buildHeartInner();
  const safeSize = Math.round(MASK_SIZE * MASK_SAFE);
  const offset = Math.round((MASK_SIZE - safeSize) / 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MASK_SIZE}" height="${MASK_SIZE}" viewBox="0 0 ${MASK_SIZE} ${MASK_SIZE}"><rect width="${MASK_SIZE}" height="${MASK_SIZE}" fill="${BG}"/><svg x="${offset}" y="${offset}" width="${safeSize}" height="${safeSize}" viewBox="${HEART_VIEWBOX}" overflow="visible">${inner}</svg></svg>`;

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: MASK_SIZE },
    background: BG,
  })
    .render()
    .asPng();

  await writeFile(maskablePath, png);
  console.log(
    `generated icon-512-maskable.png → public/ (${png.length} bytes)`,
  );
}

async function main() {
  await Promise.all([buildFavicon(), buildAppleTouch(), buildMaskable()]);
}

try {
  await main();
} catch (error) {
  // Best-effort fallback: if every output already exists on disk, warn
  // and keep them so the build doesn't fail. Only exit nonzero if any
  // are missing.
  const checks = await Promise.all(
    [faviconPath, appleTouchPath, maskablePath].map((p) =>
      stat(p).then(
        () => true,
        () => false,
      ),
    ),
  );
  if (checks.every(Boolean)) {
    console.warn(
      `icon generation failed (${error.message}); keeping existing favicon.svg, apple-touch-icon.png, and icon-512-maskable.png`,
    );
  } else {
    console.error(
      `icon generation failed (${error.message}) and some fallbacks are missing`,
    );
    process.exit(1);
  }
}
