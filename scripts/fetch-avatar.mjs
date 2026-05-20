#!/usr/bin/env node
import { writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Displayed at 300x300 max in src/components/AboutMe.astro. We fetch a 1x
// and a 2x JPEG so the <img srcset> can serve the right one per DPR.
// (GitHub caps this avatar at ~460 server-side, so the "2x" request
// usually returns 460x460, not 600x600 — still a meaningful improvement
// for retina screens.)
const SIZES = [
  { suffix: "", fetchSize: 300 },
  { suffix: "-2x", fetchSize: 600 },
];

const __dirname = dirname(fileURLToPath(import.meta.url));

async function fetchOne({ suffix, fetchSize }) {
  const target = resolve(__dirname, `../public/me${suffix}.jpg`);
  const source = `https://github.com/xav-ie.png?size=${fetchSize}`;
  try {
    const res = await fetch(source, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(target, buf);
    console.log(`fetched avatar → ${target} (${buf.length} bytes)`);
  } catch (err) {
    try {
      await stat(target);
      console.warn(
        `avatar fetch failed for ${target} (${err.message}); keeping existing file`,
      );
    } catch {
      console.error(
        `avatar fetch failed for ${target} (${err.message}) and no fallback file exists`,
      );
      process.exit(1);
    }
  }
}

await Promise.all(SIZES.map(fetchOne));
