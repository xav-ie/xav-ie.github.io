#!/usr/bin/env bash
# Build the production bundle, serve it locally with `astro preview`,
# run Lighthouse against it, and clean up. Reports land in ./lighthouse/.
#
# Usage:
#   ./scripts/lighthouse.sh           # mobile audit (default)
#   FORM_FACTOR=desktop ./scripts/lighthouse.sh
#   PORT=4322 ./scripts/lighthouse.sh
#   SKIP_BUILD=1 ./scripts/lighthouse.sh   # reuse existing dist/

set -euo pipefail

PORT="${PORT:-4321}"
URL="http://localhost:${PORT}"
FORM_FACTOR="${FORM_FACTOR:-mobile}"
REPORT_DIR="./lighthouse"
mkdir -p "$REPORT_DIR"

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "→ Building production bundle…"
  pnpm build
fi

# `astro preview` needs the dist/ to already exist (which `pnpm build` creates above).
echo "→ Starting astro preview on :${PORT}…"
pnpm preview --port "$PORT" > /tmp/astro-preview.log 2>&1 &
PREVIEW_PID=$!
trap "kill $PREVIEW_PID 2>/dev/null || true" EXIT

echo "→ Waiting for server to respond…"
for _ in $(seq 1 40); do
  if curl -fs "$URL" > /dev/null 2>&1; then
    break
  fi
  sleep 0.25
done
if ! curl -fs "$URL" > /dev/null 2>&1; then
  echo "✗ astro preview did not come up on $URL. Log:"
  cat /tmp/astro-preview.log
  exit 1
fi

# Try common Chrome binary locations; user can override with CHROME_PATH.
if [[ -z "${CHROME_PATH:-}" ]]; then
  CHROME_PATH="$(command -v chromium 2>/dev/null \
                || command -v google-chrome-stable 2>/dev/null \
                || command -v google-chrome 2>/dev/null \
                || true)"
fi
if [[ -z "$CHROME_PATH" ]]; then
  echo "✗ No Chrome/Chromium found. Install one or set CHROME_PATH=/path/to/binary."
  exit 1
fi
export CHROME_PATH
echo "→ Using browser: $CHROME_PATH"

TS=$(date +%Y%m%d-%H%M%S)
STEM="${REPORT_DIR}/report-${FORM_FACTOR}-${TS}"

echo "→ Running Lighthouse (${FORM_FACTOR})…"
pnpm exec lighthouse "$URL" \
  --quiet \
  --output html \
  --output json \
  --output-path "$STEM" \
  --form-factor "$FORM_FACTOR" \
  --screen-emulation.disabled="$(if [[ $FORM_FACTOR == desktop ]]; then echo true; else echo false; fi)" \
  --throttling-method simulate \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"

echo ""
echo "✓ HTML report: ${STEM}.report.html"
echo "✓ JSON report: ${STEM}.report.json"
echo ""
echo "Quick category scores:"
node -e "
  const r = require('./${STEM}.report.json');
  for (const [k, v] of Object.entries(r.categories)) {
    const pct = Math.round((v.score ?? 0) * 100);
    console.log('  ' + k.padEnd(20) + ' ' + pct);
  }
"
