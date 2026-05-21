// Stylized heart SVG used both by HeartGoldSvg.astro (site logo) and
// scripts/build-icon.mjs (PWA maskable icon). Centralised here so the
// rendered logo and the home-screen icon can never drift apart.

export type HeartSvgOptions = {
  size?: string | number;
  title?: string;
};

const HEART =
  "0.5 5.5 3.5 5.5 3.5 0.5 13.5 0.5 13.5 5.5 18.5 5.5 18.5 0.5 28.5 0.52 28.5 5.5 31.5 5.5 31.5 16.5 27.5 16.43 27.5 20.5 23.5 20.5 23.46 26.5 19.5 26.5 19.5 31.5 12.5 31.5 12.5 26.5 8.5 26.5 8.5 20.5 4.5 20.5 4.5 16.5 0.5 16.5 0.5 5.5";
const GOLD_BORDER =
  "M20,32H12V27H8V21H4V17H0V5H3V0H14V5h4V0L29,0V5h3V17l-4-.07V21H24L24,27H20Zm-7-1h6V26h4l0-6h4V15.92L31,16V6H28V1L19,1V6H13V1H4V6H1V16H5v4H9v6h4Z";
const CPU =
  "28 10 28 11 20 11 20 15 18 15 18 13 17 13 17 10 24 10 24 4 25 4 25 2 22 2 22 4 23 4 23 9 17 9 16 9 9 9 9 4 10 4 10 2 7 2 7 4 8 4 8 10 16 10 16 13 14 13 14 14 12 14 12 11 4 11 4 10 2 10 2 13 4 13 4 12 11 12 11 14 7 14 7 17 6 17 6 19 9 19 9 17 8 17 8 15 11 15 14 15 14 17 15 17 14.99 19 11 19 11 23 10 23 10 25 13 25 13 23 12 23 12 20 15 20 15 28 14 28 14 30 17 30 17 28 16 28 16 20 20 20 20 23 19 23 19 25 22 25 22 23 21 23 21 19 16 19 16 17 18 17 18 16 20 16 20 18 24 18 24 19 26 19 26 16 24 16 24 17 21 17 21 16 21 15 21 12 28 12 28 13 30 13 30 10 28 10";

const EXTRUSION = Array.from({ length: 14 }, (_, index) => (index + 1) / 14);

const DEFS = `<defs>
  <radialGradient id="hgs-gold" cx="0.82" cy="0.18" r="0.92">
    <stop offset="0%" stop-color="#fffae0"/>
    <stop offset="50%" stop-color="#fff2b8"/>
    <stop offset="100%" stop-color="#ffe890"/>
  </radialGradient>
  <radialGradient id="hgs-gold-body" gradientUnits="userSpaceOnUse" cx="26.24" cy="5.76" r="29.44">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="10%" stop-color="#ffffff"/>
    <stop offset="24%" stop-color="#f5c850"/>
    <stop offset="42%" stop-color="#e8ab2c"/>
    <stop offset="60%" stop-color="#c8861a"/>
    <stop offset="78%" stop-color="#6a4410"/>
    <stop offset="92%" stop-color="#1a1003"/>
    <stop offset="100%" stop-color="#000000"/>
  </radialGradient>
  <radialGradient id="hgs-gold-shadow" gradientUnits="userSpaceOnUse" cx="5.76" cy="26.24" r="29.44">
    <stop offset="0%" stop-color="#0a0501"/>
    <stop offset="100%" stop-color="#2a1804"/>
  </radialGradient>
  <radialGradient id="hgs-glass" cx="0.82" cy="0.18" r="0.92">
    <stop offset="0%" stop-color="#c8ff90"/>
    <stop offset="18%" stop-color="#6cf040"/>
    <stop offset="32%" stop-color="#1ad048"/>
    <stop offset="55%" stop-color="#0da430"/>
    <stop offset="78%" stop-color="#088026"/>
    <stop offset="100%" stop-color="#066020"/>
  </radialGradient>
  <radialGradient id="hgs-glass-hotspot" cx="0.78" cy="0.22" r="0.45">
    <stop offset="0%" stop-color="rgba(240,255,220,0.65)"/>
    <stop offset="14%" stop-color="rgba(200,255,160,0.42)"/>
    <stop offset="34%" stop-color="rgba(140,240,100,0.18)"/>
    <stop offset="65%" stop-color="rgba(100,220,80,0.05)"/>
    <stop offset="100%" stop-color="rgba(80,200,60,0)"/>
  </radialGradient>
  <filter id="hgs-glass-bloom" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="0.6"/>
  </filter>
  <clipPath id="hgs-heart-clip">
    <polygon points="${HEART}"/>
  </clipPath>
  <radialGradient id="hgs-gold-hotspot" cx="0.72" cy="0.2" r="0.4">
    <stop offset="0%" stop-color="rgba(255,255,250,0.95)"/>
    <stop offset="22%" stop-color="rgba(255,250,210,0.25)"/>
    <stop offset="60%" stop-color="rgba(255,240,180,0)"/>
  </radialGradient>
  <radialGradient id="hgs-red-rim" cx="0.18" cy="0.82" r="0.92">
    <stop offset="0%" stop-color="#ffd870"/>
    <stop offset="50%" stop-color="#e8ab2c"/>
    <stop offset="100%" stop-color="#a06c12"/>
  </radialGradient>
  <mask id="hgs-bottom-left-rim-mask">
    <g transform="translate(-0.175, 0.175)">
      <path d="${GOLD_BORDER}" fill="white"/>
      <polygon points="${CPU}" fill="white"/>
    </g>
    <g transform="translate(-0.21, 0.14)">
      <path d="${GOLD_BORDER}" fill="white"/>
      <polygon points="${CPU}" fill="white"/>
    </g>
    <g transform="translate(-0.14, 0.21)">
      <path d="${GOLD_BORDER}" fill="white"/>
      <polygon points="${CPU}" fill="white"/>
    </g>
    <g transform="translate(0.0875, -0.0875)">
      <path d="${GOLD_BORDER}" fill="black"/>
      <polygon points="${CPU}" fill="black"/>
    </g>
    <g transform="translate(0.105, -0.07)">
      <path d="${GOLD_BORDER}" fill="black"/>
      <polygon points="${CPU}" fill="black"/>
    </g>
    <g transform="translate(0.07, -0.105)">
      <path d="${GOLD_BORDER}" fill="black"/>
      <polygon points="${CPU}" fill="black"/>
    </g>
  </mask>
  <filter id="hgs-shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="0.7"/>
    <feOffset dx="-0.3" dy="0.7" result="off"/>
    <feComponentTransfer in="off" result="shadow">
      <feFuncA type="linear" slope="0.6"/>
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="shadow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
  <clipPath id="hgs-gold-clip">
    <path d="${GOLD_BORDER}"/>
    <polygon points="${CPU}"/>
  </clipPath>
</defs>`;

const BODY = `<g filter="url(#hgs-shadow)">
  ${EXTRUSION.map(
    (t) => `<g transform="translate(${0.35 * t}, ${-0.35 * t})">
    <path d="${GOLD_BORDER}" fill="url(#hgs-gold-body)"/>
    <polygon points="${CPU}" fill="url(#hgs-gold-body)"/>
  </g>`,
  ).join("\n  ")}
  <polygon points="${HEART}" fill="url(#hgs-glass)" opacity="0.5"/>
  <polygon points="${HEART}" fill="none" stroke="rgba(0,30,10,0.55)" stroke-width="0.5" clip-path="url(#hgs-heart-clip)"/>
  <polygon points="${HEART}" fill="url(#hgs-glass-hotspot)" clip-path="url(#hgs-heart-clip)" filter="url(#hgs-glass-bloom)"/>
  ${EXTRUSION.map(
    (t) => `<g transform="translate(${-0.15 * t}, ${0.25 * t})" opacity="0.082">
    <path d="${GOLD_BORDER}" fill="url(#hgs-gold-shadow)"/>
    <polygon points="${CPU}" fill="url(#hgs-gold-shadow)"/>
  </g>`,
  ).join("\n  ")}
  <g>
    <path d="${GOLD_BORDER}" fill="url(#hgs-gold)"/>
    <polygon points="${CPU}" fill="url(#hgs-gold)"/>
  </g>
  <g clip-path="url(#hgs-gold-clip)">
    <g transform="translate(-0.175, 0.175)">
      <path d="${GOLD_BORDER}" fill="url(#hgs-gold-body)"/>
      <polygon points="${CPU}" fill="url(#hgs-gold-body)"/>
    </g>
  </g>
  <rect x="-2" y="-2" width="36" height="36" fill="url(#hgs-gold-hotspot)" clip-path="url(#hgs-gold-clip)"/>
  <g mask="url(#hgs-bottom-left-rim-mask)">
    <path d="${GOLD_BORDER}" fill="url(#hgs-red-rim)"/>
    <polygon points="${CPU}" fill="url(#hgs-red-rim)"/>
  </g>
</g>`;

// The shared viewBox the heart draws into.
export const HEART_VIEWBOX = "-2 -3.25 36 36";

/**
 * Full <svg> markup for the stylized heart logo. Used in the header
 * (with the soft drop-shadow CSS filter) and as the inner content of
 * the maskable PWA icon.
 *
 * When `dropShadow` is true the outer SVG gets a CSS drop-shadow filter
 * matching the header's appearance. Disable for raster targets where
 * resvg's CSS-filter support is patchy.
 */
export function buildHeartSvg(
  options: HeartSvgOptions & { dropShadow?: boolean } = {},
): string {
  const { size = "6em", title = "Heart", dropShadow = true } = options;
  const sizeAttribute = typeof size === "number" ? `${size}` : size;
  const style = dropShadow
    ? `width:${sizeAttribute};height:${sizeAttribute};display:block;overflow:visible;filter:drop-shadow(10px -5px 10px #f9e43e36) drop-shadow(-10px 5px 10px #17031c30)`
    : `width:${sizeAttribute};height:${sizeAttribute};display:block;overflow:visible`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${HEART_VIEWBOX}" role="img" aria-label="${title}" style="${style}">${DEFS}${BODY}</svg>`;
}

/**
 * Just the heart contents (defs + body) — for embedding inside another
 * SVG with its own viewBox / sizing.
 */
export function buildHeartInner(): string {
  return `${DEFS}${BODY}`;
}
