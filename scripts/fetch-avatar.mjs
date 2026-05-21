#!/usr/bin/env node
import { writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(__dirname, "../src/assets/me.jpg");
const source = "https://github.com/xav-ie.png?size=600";
const TTL_MS = 24 * 60 * 60 * 1000;

try {
  try {
    const existing = await stat(target);
    if (Date.now() - existing.mtimeMs < TTL_MS) {
      console.log(`avatar fresh (< 24h old), skipping fetch → ${target}`);
      process.exit(0);
    }
  } catch {
    /* missing file → fall through to fetch */
  }
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
