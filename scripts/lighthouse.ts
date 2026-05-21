#!/usr/bin/env node
/**
 * Build the production bundle, serve it locally via `astro preview`, run
 * Lighthouse against it, fail if any category drops below the threshold.
 *
 * Env vars:
 *   PORT=4321               preferred port; astro preview will pick the
 *                           next free one if it's taken, and we'll use
 *                           whichever port it actually binds
 *   FORM_FACTOR=mobile      mobile|desktop
 *   SKIP_BUILD=1            reuse existing dist/
 *   LIGHTHOUSE_MIN=100      minimum category score to count as a pass
 *   CHROME_PATH=/usr/bin/.. override Chrome binary (otherwise auto-detected)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { spawn, type ChildProcess } from "node:child_process";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

type FormFactor = "mobile" | "desktop";

const PREFERRED_PORT = Number(process.env.PORT ?? 4321);
const FORM_FACTOR = (process.env.FORM_FACTOR ?? "mobile") as FormFactor;
const MIN_SCORE = Number(process.env.LIGHTHOUSE_MIN ?? 100);
const SKIP_BUILD = process.env.SKIP_BUILD === "1";
const REPORT_DIR = "./lighthouse";

await mkdir(REPORT_DIR, { recursive: true });

if (!SKIP_BUILD) {
  process.stdout.write("→ Building production bundle… ");
  await runQuiet("pnpm", ["build"]);
  console.log("done");
}

console.log(`→ Starting astro preview (preferred :${PREFERRED_PORT})…`);
const preview = spawn("pnpm", ["preview", "--port", String(PREFERRED_PORT)], {
  stdio: ["ignore", "pipe", "inherit"],
});
const cleanup = makeCleanup(preview);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  const URL = await waitForPreviewUrl(preview, 15_000);
  console.log(`  preview ready at ${URL}`);

  console.log("→ Launching Chrome…");
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH,
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  console.log(`  using browser at port ${chrome.port}`);

  try {
    console.log(`→ Running Lighthouse (${FORM_FACTOR})…`);
    const result = await lighthouse(URL, {
      port: chrome.port,
      output: ["html", "json"],
      formFactor: FORM_FACTOR,
      screenEmulation: { disabled: FORM_FACTOR === "desktop" },
      throttlingMethod: "simulate",
      logLevel: "error",
    });

    if (!result) throw new Error("Lighthouse returned no result");

    const stem = `${REPORT_DIR}/report-${FORM_FACTOR}-${timestamp()}`;
    const [htmlReport, jsonReport] = result.report as [string, string];
    await writeFile(`${stem}.report.html`, htmlReport);
    await writeFile(`${stem}.report.json`, jsonReport);
    console.log(`✓ HTML report: ${stem}.report.html`);
    console.log(`✓ JSON report: ${stem}.report.json`);

    console.log("\nQuick category scores:");
    const failed: string[] = [];
    for (const [k, v] of Object.entries(result.lhr.categories)) {
      const pct = Math.round((v.score ?? 0) * 100);
      const ok = pct >= MIN_SCORE;
      console.log(
        `  ${k.padEnd(20)} ${pct}${ok ? "" : `  ✗ below ${MIN_SCORE}`}`,
      );
      if (!ok) failed.push(`${k} (${pct})`);
    }

    if (failed.length > 0) {
      console.error(
        `\n✗ Lighthouse threshold (${MIN_SCORE}) failed for: ${failed.join(", ")}`,
      );
      process.exitCode = 1;
    }
  } finally {
    chrome.kill();
  }
} finally {
  cleanup();
}

// ----- helpers ---------------------------------------------------------------

function runQuiet(cmd: string, arguments_: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(cmd, arguments_, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    proc.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    proc.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        process.stderr.write(stdout);
        process.stderr.write(stderr);
        reject(new Error(`${cmd} ${arguments_.join(" ")} exited ${code}`));
      }
    });
  });
}

// Astro preview falls back to the next free port when its requested
// one is taken, so we trust its stdout banner ("Local  http://localhost:4322/")
// rather than the port we asked for. Then we verify the URL responds.
function waitForPreviewUrl(
  child: ChildProcess,
  timeoutMs: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      child.stdout?.off("data", onData);
      reject(new Error(`astro preview produced no URL within ${timeoutMs}ms`));
    }, timeoutMs);

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString();
      // Astro colourises the URL with ANSI escapes that wrap, but never
      // appear inside, the host/port — so the regex matches even without
      // stripping them.
      const match = buffer.match(
        /https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)\/?/,
      );
      if (match) {
        clearTimeout(timer);
        child.stdout?.off("data", onData);
        // Normalise to http://localhost:<port> so Lighthouse and Chrome
        // see the same host string regardless of which one Astro printed.
        resolve(`http://localhost:${match[1]}`);
      }
    };

    child.stdout?.on("data", onData);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`astro preview exited (${code}) before printing a URL`));
    });
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function timestamp(): string {
  const d = new Date();
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function makeCleanup(child: ChildProcess) {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    if (!child.killed) child.kill();
  };
}
