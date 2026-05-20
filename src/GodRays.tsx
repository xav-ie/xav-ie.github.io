import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_RAY_CONFIG } from './godRaysConfig';
import './GodRays.css';

const lcg = (seed: number) => {
  let s = (seed | 0) || 1;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223;
    return ((s >>> 0) / 0xffffffff);
  };
};

const buildRays = (
  count: number,
  maxWidth: number,
  jitter: number,
  seed: number,
) => {
  const rand = lcg(seed);
  return Array.from({ length: count }, (_, i) => {
    const baseAngle = (i / count) * 360;
    const angle = baseAngle + (rand() - 0.5) * 2 * jitter;
    const strokeWidth = 0.4 + rand() * Math.max(0.1, maxWidth - 0.4);
    const opacity = 0.15 + rand() * 0.55;
    const lengthScale = 0.65 + rand() * 0.5;
    return { angle, strokeWidth, opacity, lengthScale };
  });
};

const GodRays = () => {
  const c = DEFAULT_RAY_CONFIG;
  const rays = useMemo(
    () => buildRays(c.rayCount, c.rayMaxWidth, c.angleJitter, c.seed),
    [c.rayCount, c.rayMaxWidth, c.angleJitter, c.seed],
  );
  const spinRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 200 });

  useLayoutEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setSize({ w: Math.round(r.width), h: Math.round(r.height) });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (c.rotationSeconds <= 0) {
      if (spinRef.current) spinRef.current.removeAttribute('transform');
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const angle = (((now - start) / 1000) / c.rotationSeconds) * 360;
      spinRef.current?.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [c.rotationSeconds]);

  const { w, h } = size;
  const sunPxX = (c.sunX / 100) * w;
  const sunPxY = c.sunY;
  const maskExtent = c.rayLength * 1.4;

  return (
    <svg
      ref={svgRef}
      className="god-rays"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gr-mask-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop
            offset={`${Math.max(5, Math.min(95, c.maskFalloff))}%`}
            stopColor="white"
            stopOpacity="0.55"
          />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask
          id="gr-ray-mask"
          maskUnits="userSpaceOnUse"
          x={-maskExtent}
          y={-maskExtent}
          width={maskExtent * 2}
          height={maskExtent * 2}
        >
          <rect
            x={-maskExtent}
            y={-maskExtent}
            width={maskExtent * 2}
            height={maskExtent * 2}
            fill="url(#gr-mask-grad)"
          />
        </mask>

        <filter
          id="gr-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation={c.blur} />
        </filter>

        {c.dust && (
          <filter
            id="gr-dust"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="userSpaceOnUse"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
              seed={c.seed}
            />
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 0.95   0 0 0 0 0.48   0 0 0 0.55 -0.2" />
          </filter>
        )}
      </defs>

      <g transform={`translate(${sunPxX} ${sunPxY})`}>
        <g ref={spinRef}>
          <g
            mask="url(#gr-ray-mask)"
            opacity={c.intensity}
            filter="url(#gr-blur)"
          >
            {rays.map((r, i) => {
              const length = c.rayLength * r.lengthScale;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-length}
                  stroke={c.color}
                  strokeWidth={r.strokeWidth}
                  strokeOpacity={r.opacity}
                  transform={`rotate(${r.angle})`}
                />
              );
            })}
          </g>
        </g>
      </g>

      {c.dust && (
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          filter="url(#gr-dust)"
          opacity="0.35"
        />
      )}
    </svg>
  );
};

export default GodRays;
