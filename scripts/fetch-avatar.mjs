#!/usr/bin/env node
import { writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Displayed at 300x300 max in src/components/AboutMe.astro. We fetch at
// 600 so Astro's image pipeline has enough resolution to generate a 2x
// variant for retina screens. (GitHub caps this avatar at ~460
// server-side, so the request usually returns 460x460 — still a
// meaningful improvement over the 1x baseline.)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(__dirname, "../src/assets/me.jpg");
const source = "https://github.com/xav-ie.png?size=600";

try {
  const response = await fetch(source, { redirect: "follow" });
  if (!response.ok)
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  const buf = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buf);
  console.log(`fetched avatar → ${target} (${buf.length} bytes)`);
} catch (error) {
  try {
    await stat(target);
    console.warn(
      `avatar fetch failed for ${target} (${error.message}); keeping existing file`,
    );
  } catch {
    console.error(
      `avatar fetch failed for ${target} (${error.message}) and no fallback file exists`,
    );
    process.exit(1);
  }
}
