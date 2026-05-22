/**
 * Env vars: PORT, FORM_FACTOR (mobile|desktop), SKIP_BUILD, LIGHTHOUSE_MIN, CHROME_PATH.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn, type ChildProcess } from 'node:child_process';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

type FormFactor = 'mobile' | 'desktop';

const PREFERRED_PORT = Number(process.env.PORT ?? 4321);
const FORM_FACTOR = (process.env.FORM_FACTOR ?? 'mobile') as FormFactor;
const MIN_SCORE = Number(process.env.LIGHTHOUSE_MIN ?? 100);
const SKIP_BUILD = process.env.SKIP_BUILD === '1';
const REPORT_DIR = './lighthouse';

await mkdir(REPORT_DIR, { recursive: true });

if (!SKIP_BUILD) {
  process.stdout.write('→ Building production bundle… ');
  await runQuiet('pnpm', ['build']);
  console.log('done');
}

console.log(`→ Starting astro preview (preferred :${PREFERRED_PORT})…`);
// eslint-disable-next-line sonarjs/no-os-command-from-path -- intentional: pnpm is the package manager and must be on PATH
const preview = spawn('pnpm', ['preview', '--port', String(PREFERRED_PORT)], {
  stdio: ['ignore', 'pipe', 'inherit'],
});
const cleanup = makeCleanup(preview);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(143);
});

try {
  const URL = await waitForPreviewUrl(preview, 15_000);
  console.log(`  preview ready at ${URL}`);

  console.log('→ Launching Chrome…');
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH,
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });
  console.log(`  using browser at port ${chrome.port}`);

  try {
    console.log(`→ Running Lighthouse (${FORM_FACTOR})…`);
    const result = await lighthouse(URL, {
      port: chrome.port,
      output: ['html', 'json'],
      formFactor: FORM_FACTOR,
      screenEmulation: { disabled: FORM_FACTOR === 'desktop' },
      throttlingMethod: 'simulate',
      logLevel: 'error',
    });

    if (!result) throw new Error('Lighthouse returned no result');

    const stem = `${REPORT_DIR}/report-${FORM_FACTOR}-${timestamp()}`;
    const [htmlReport, jsonReport] = result.report as [string, string];
    await writeFile(`${stem}.report.html`, htmlReport);
    await writeFile(`${stem}.report.json`, jsonReport);
    console.log(`✓ HTML report: ${stem}.report.html`);
    console.log(`✓ JSON report: ${stem}.report.json`);

    console.log('\nQuick category scores:');
    const failed: string[] = [];
    for (const [k, v] of Object.entries(result.lhr.categories)) {
      const pct = Math.round((v.score ?? 0) * 100);
      const ok = pct >= MIN_SCORE;
      const threshold = ok ? '' : `  ✗ below ${MIN_SCORE}`;
      console.log(`  ${k.padEnd(20)} ${pct}${threshold}`);
      if (!ok) failed.push(`${k} (${pct})`);
    }

    if (failed.length > 0) {
      console.error(
        `\n✗ Lighthouse threshold (${MIN_SCORE}) failed for: ${failed.join(', ')}`,
      );
      process.exitCode = 1;
    }
  } finally {
    chrome.kill();
  }
} finally {
  cleanup();
}

function runQuiet(cmd: string, arguments_: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(cmd, arguments_, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    proc.stderr?.on('data', (d: Buffer) => {
      stderr += d.toString();
    });
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        process.stderr.write(stdout);
        process.stderr.write(stderr);
        reject(new Error(`${cmd} ${arguments_.join(' ')} exited ${code}`));
      }
    });
  });
}

function waitForPreviewUrl(
  child: ChildProcess,
  timeoutMs: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => {
      child.stdout?.off('data', onData);
      reject(new Error(`astro preview produced no URL within ${timeoutMs}ms`));
    }, timeoutMs);

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString();
      const match = buffer.match(
        /https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)\/?/,
      );
      if (match) {
        clearTimeout(timer);
        child.stdout?.off('data', onData);
        resolve(`http://localhost:${match[1]}`);
      }
    };

    child.stdout?.on('data', onData);
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`astro preview exited (${code}) before printing a URL`));
    });
  });
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
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
