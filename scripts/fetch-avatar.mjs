#!/usr/bin/env node
import { writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Displayed at 268x268 in src/components/AboutMe.astro; fetch at 2x
// for retina sharpness.
const DISPLAY_SIZE = 268;
const FETCH_SIZE = DISPLAY_SIZE * 2;

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = resolve(__dirname, "../public/me.jpg");
const source = `https://github.com/xav-ie.png?size=${FETCH_SIZE}`;

try {
  const res = await fetch(source, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  console.log(`fetched avatar → public/me.jpg (${buf.length} bytes)`);
} catch (err) {
  try {
    await stat(target);
    console.warn(
      `avatar fetch failed (${err.message}); keeping existing public/me.jpg`,
    );
  } catch {
    console.error(
      `avatar fetch failed (${err.message}) and no fallback file exists`,
    );
    process.exit(1);
  }
}
