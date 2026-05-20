type Props = {
  size?: string | number;
  title?: string;
};

const HEART =
  '0.5 5.5 3.5 5.5 3.5 0.5 13.5 0.5 13.5 5.5 18.5 5.5 18.5 0.5 28.5 0.52 28.5 5.5 31.5 5.5 31.5 16.5 27.5 16.43 27.5 20.5 23.5 20.5 23.46 26.5 19.5 26.5 19.5 31.5 12.5 31.5 12.5 26.5 8.5 26.5 8.5 20.5 4.5 20.5 4.5 16.5 0.5 16.5 0.5 5.5';
const GOLD_BORDER =
  'M20,32H12V27H8V21H4V17H0V5H3V0H14V5h4V0L29,0V5h3V17l-4-.07V21H24L24,27H20Zm-7-1h6V26h4l0-6h4V15.92L31,16V6H28V1L19,1V6H13V1H4V6H1V16H5v4H9v6h4Z';
const CPU =
  '28 10 28 11 20 11 20 15 18 15 18 13 17 13 17 10 24 10 24 4 25 4 25 2 22 2 22 4 23 4 23 9 17 9 16 9 9 9 9 4 10 4 10 2 7 2 7 4 8 4 8 10 16 10 16 13 14 13 14 14 12 14 12 11 4 11 4 10 2 10 2 13 4 13 4 12 11 12 11 14 7 14 7 17 6 17 6 19 9 19 9 17 8 17 8 15 11 15 14 15 14 17 15 17 14.99 19 11 19 11 23 10 23 10 25 13 25 13 23 12 23 12 20 15 20 15 28 14 28 14 30 17 30 17 28 16 28 16 20 20 20 20 23 19 23 19 25 22 25 22 23 21 23 21 19 16 19 16 17 18 17 18 16 20 16 20 18 24 18 24 19 26 19 26 16 24 16 24 17 21 17 21 16 21 15 21 12 28 12 28 13 30 13 30 10 28 10';

const HeartGoldSvg = ({ size = '6em', title = 'Heart' }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -3.25 36 36"
      role="img"
      aria-label={title}
      style={{
        width: size,
        height: size,
        display: 'block',
        overflow: 'visible',
        filter:
          'drop-shadow(10px -5px 10px #f9e43e36) drop-shadow(-10px 5px 10px #17031c30)',
      }}
    >
      <defs>
        {/* Diagonal gradient: near-silver at top-right (mirroring the env
            reflection on Three.js's polished metal) → deep chocolate at
            bottom-left. */}
        {/* Three.js gold (metalness=1) stays uniformly bright everywhere — the
            env reflection lights it on both sides. Lifting the dark stops so
            the shadow side reads as warm amber, not near-black. */}
        {/* Highlight palette — visible as a thin upper-right rim on each gold
            piece (the part of the base NOT covered by the offset main-gold
            overlay). Stays bright across the whole heart so every piece
            catches a rim highlight. */}
        <radialGradient id="hgs-gold" cx="0.82" cy="0.18" r="0.92">
          <stop offset="0%" stopColor="#fffae0" />
          <stop offset="50%" stopColor="#fff2b8" />
          <stop offset="100%" stopColor="#ffe890" />
        </radialGradient>

        {/* Main gold palette — visible as the BULK of each gold piece (the
            offset overlay paints over most of the base, leaving only the rim).
            Radial so the bulk lights up brighter near the upper-right of the
            heart and darkens into amber at the lower-left. */}
        <radialGradient
          id="hgs-gold-body"
          gradientUnits="userSpaceOnUse"
          cx="26.24"
          cy="5.76"
          r="29.44"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="10%" stopColor="#ffffff" />
          <stop offset="24%" stopColor="#f5c850" />
          <stop offset="42%" stopColor="#e8ab2c" />
          <stop offset="60%" stopColor="#c8861a" />
          <stop offset="78%" stopColor="#6a4410" />
          <stop offset="92%" stopColor="#1a1003" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        <radialGradient
          id="hgs-gold-shadow"
          gradientUnits="userSpaceOnUse"
          cx="5.76"
          cy="26.24"
          r="29.44"
        >
          <stop offset="0%" stopColor="#0a0501" />
          <stop offset="100%" stopColor="#2a1804" />
        </radialGradient>

        {/* Glass — Three.js's env-clearcoat reflection covers the entire RIGHT
            HALF of the heart, not just an upper-right corner. Use a near-
            horizontal gradient direction and stops that hold the bright zone
            across ~40-50% of the area. */}
        {/* Three.js: vibrant-green left, near-silver right, with a relatively
            sharp vertical transition between them. More horizontal gradient
            direction + tighter transition band + saturated green stops. */}
        {/* Glass stays luminous on the shadow side — unlike the gold (which
            falls to near-black), the glass should glow from within, so the
            far stops hold saturated green rather than dropping into darkness. */}
        <radialGradient id="hgs-glass" cx="0.82" cy="0.18" r="0.92">
          <stop offset="0%" stopColor="#c8ff90" />
          <stop offset="18%" stopColor="#6cf040" />
          <stop offset="32%" stopColor="#1ad048" />
          <stop offset="55%" stopColor="#0da430" />
          <stop offset="78%" stopColor="#088026" />
          <stop offset="100%" stopColor="#066020" />
        </radialGradient>

        {/* Single radial highlight in upper-right to match the Three.js
            key-light direction (position [6, 8, 10] in three is upper-right). */}
        {/* Tinted green-white core + soft outer bloom — sells "internal glow"
            inside a piece of glass rather than a flat white reflection. */}
        <radialGradient id="hgs-glass-hotspot" cx="0.78" cy="0.22" r="0.45">
          <stop offset="0%" stopColor="rgba(240,255,220,0.65)" />
          <stop offset="14%" stopColor="rgba(200,255,160,0.42)" />
          <stop offset="34%" stopColor="rgba(140,240,100,0.18)" />
          <stop offset="65%" stopColor="rgba(100,220,80,0.05)" />
          <stop offset="100%" stopColor="rgba(80,200,60,0)" />
        </radialGradient>

        {/* Bloom filter for the glass highlight — soft blur enlarges the
            bright core so it reads as emitted glow rather than a flat overlay. */}
        <filter id="hgs-glass-bloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>

        <clipPath id="hgs-heart-clip">
          <polygon points={HEART} />
        </clipPath>

        {/* Single specular hotspot for the gold — radial gradient, positioned
            upper-right, applied as an overlay clipped to the gold shape. */}
        <radialGradient id="hgs-gold-hotspot" cx="0.72" cy="0.2" r="0.4">
          <stop offset="0%" stopColor="rgba(255,255,250,0.95)" />
          <stop offset="22%" stopColor="rgba(255,250,210,0.25)" />
          <stop offset="60%" stopColor="rgba(255,240,180,0)" />
        </radialGradient>

        {/* Inner rim palette — tight range of gold tones (no white core, no
            near-black falloff) so every piece's bottom-left rim reads as a
            consistent gold regardless of where it sits in the heart. */}
        <radialGradient id="hgs-red-rim" cx="0.18" cy="0.82" r="0.92">
          <stop offset="0%" stopColor="#ffd870" />
          <stop offset="50%" stopColor="#e8ab2c" />
          <stop offset="100%" stopColor="#a06c12" />
        </radialGradient>

        {/* Mask = (body overlay coverage) − (gold offset up-right). White is
            the union of the three down-left offsets the body overlay uses, so
            the red rim is naturally trimmed to NOT enter the top-right cream
            rim region — cream wins at the corners where the rims would meet. */}
        <mask id="hgs-bottom-left-rim-mask">
          <g transform="translate(-0.175, 0.175)">
            <path d={GOLD_BORDER} fill="white" />
            <polygon points={CPU} fill="white" />
          </g>
          <g transform="translate(-0.21, 0.14)">
            <path d={GOLD_BORDER} fill="white" />
            <polygon points={CPU} fill="white" />
          </g>
          <g transform="translate(-0.14, 0.21)">
            <path d={GOLD_BORDER} fill="white" />
            <polygon points={CPU} fill="white" />
          </g>
          <g transform="translate(0.0875, -0.0875)">
            <path d={GOLD_BORDER} fill="black" />
            <polygon points={CPU} fill="black" />
          </g>
          <g transform="translate(0.105, -0.07)">
            <path d={GOLD_BORDER} fill="black" />
            <polygon points={CPU} fill="black" />
          </g>
          <g transform="translate(0.07, -0.105)">
            <path d={GOLD_BORDER} fill="black" />
            <polygon points={CPU} fill="black" />
          </g>
        </mask>

        {/* Soft drop shadow under the whole heart. */}
        <filter id="hgs-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.7" />
          <feOffset dx="-0.3" dy="0.7" result="off" />
          <feComponentTransfer in="off" result="shadow">
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#hgs-shadow)">
        {/* Gold prism extrusion — stack of offset copies between (0, 0) and
            (0.35, -0.35). Each step paints the gold shape at a slightly
            different offset; together they fill the diagonal side faces that
            connect the gold's original position (front face) to the offset
            rim (back face), like the sides of a prism. */}
        {Array.from({ length: 14 }, (_, i) => {
          const t = (i + 1) / 14;
          return (
            <g key={i} transform={`translate(${0.35 * t}, ${-0.35 * t})`}>
              <path d={GOLD_BORDER} fill="url(#hgs-gold-body)" />
              <polygon points={CPU} fill="url(#hgs-gold-body)" />
            </g>
          );
        })}

        {/* Glass base at 50% opacity so the red rim underneath shows through */}
        <polygon points={HEART} fill="url(#hgs-glass)" opacity="0.5" />
        {/* Inner-rim darkening — gives glass body its 3D "thickness" */}
        <polygon
          points={HEART}
          fill="none"
          stroke="rgba(0,30,10,0.55)"
          strokeWidth="0.5"
          clipPath="url(#hgs-heart-clip)"
        />
        {/* Single specular hotspot from upper-right (matches Three.js key) —
            blurred for a glassy bloom feel. */}
        <polygon
          points={HEART}
          fill="url(#hgs-glass-hotspot)"
          clipPath="url(#hgs-heart-clip)"
          filter="url(#hgs-glass-bloom)"
        />

        {/* Shadow prism extrusion — stepped copies going DOWN-LEFT (opposite to
            the gold extrusion). Connects the shadow's offset position to the
            gold's original position via diagonal stepped fill, matching the
            prism treatment of the gold body. */}
        {Array.from({ length: 14 }, (_, i) => {
          const t = (i + 1) / 14;
          return (
            <g
              key={`shadow-${i}`}
              transform={`translate(${-0.15 * t}, ${0.25 * t})`}
              opacity="0.082"
            >
              <path d={GOLD_BORDER} fill="url(#hgs-gold-shadow)" />
              <polygon points={CPU} fill="url(#hgs-gold-shadow)" />
            </g>
          );
        })}

        {/* Gold base */}
        <g>
          <path d={GOLD_BORDER} fill="url(#hgs-gold)" />
          <polygon points={CPU} fill="url(#hgs-gold)" />
        </g>

        {/* Main gold overlay — paints the bulk of each gold piece in the main
            gold color. Offset down-left + clipped to the gold so the only part
            of the base palette that peeks through is a thin upper-right rim,
            which is where the bright highlight lives. */}
        <clipPath id="hgs-gold-clip">
          <path d={GOLD_BORDER} />
          <polygon points={CPU} />
        </clipPath>
        <g clipPath="url(#hgs-gold-clip)">
          <g transform="translate(-0.175, 0.175)">
            <path d={GOLD_BORDER} fill="url(#hgs-gold-body)" />
            <polygon points={CPU} fill="url(#hgs-gold-body)" />
          </g>
        </g>
        {/* Soft radial sparkle on top, also clipped to gold. */}
        <rect
          x="-2"
          y="-2"
          width="36"
          height="36"
          fill="url(#hgs-gold-hotspot)"
          clipPath="url(#hgs-gold-clip)"
        />

        {/* Red rim glints — painted on top through the bottom-left rim mask,
            so red only shows on the inverse edge of each gold piece. */}
        <g mask="url(#hgs-bottom-left-rim-mask)">
          <path d={GOLD_BORDER} fill="url(#hgs-red-rim)" />
          <polygon points={CPU} fill="url(#hgs-red-rim)" />
        </g>
      </g>
    </svg>
  );
};

export default HeartGoldSvg;
