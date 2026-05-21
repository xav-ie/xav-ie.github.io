import { defineConfig, presetWind3 } from "unocss";

// Breakpoints intentionally match the legacy flexboxgrid scheme this
// site grew up on — components still read `.col-xs-12 .col-sm-4` etc,
// just expressed atomically now (col-span-12 sm:col-span-4).
const BREAKPOINTS = {
  sm: "48em", // 768px — was xs ↔ sm boundary
  md: "64em", // 1024px
  lg: "75em", // 1200px
} as const;

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    breakpoints: BREAKPOINTS,
  },
  shortcuts: [
    // .section is a semantic container used by every top-level page
    // region (#about_me, #projects, #oss, #doodles, footer). Keeping it
    // named instead of inlining mt-12 across the templates keeps the
    // intent readable.
    ["section", "mt-12"],
    // Headings inside a .section adopt the display serif. Composed as a
    // shortcut so `<h2 class="section-heading">` reads cleanly.
    ["section-heading", "font-heading"],
  ],
  rules: [
    // .shadow and .shadow-lift carry multi-value box-shadows / inset
    // highlights that don't atomize into preset utilities cleanly.
    // Defined as full rules so the resulting CSS is identical to the
    // pre-migration global.css.
    [
      "shadow",
      {
        "box-shadow":
          "10px 10px 24px -2px var(--shadow), -2px -2px 4px -3px var(--highlight), inset 1px 1px 2px rgba(255,255,255,0.14), inset 6px 6px 14px rgba(255,255,255,0.04), inset -4px -4px 5px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(255,255,255,0.1)",
        transition:
          "color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background 0.2s ease-in-out, transform 0.2s ease-in-out",
      },
    ],
    [
      "round",
      {
        "border-radius": "2em",
      },
    ],
    // bg-noise-gradient-{angle} — repeated noise overlay on top of a
    // surface-top → surface-bottom linear gradient. Used by section
    // cards, OSS chips, and the sticky header nav.
    [
      /^bg-noise-gradient-(\d+)$/,
      ([, deg]) => ({
        "background-image": `var(--noise-image), linear-gradient(${deg}deg, var(--surface-top) 0%, var(--surface-bottom) 100%)`,
        "background-size": "var(--noise-size), auto",
        "background-repeat": "repeat, no-repeat",
      }),
    ],
  ],
  // image-frame and shadow-lift have pseudo-elements (::before/::after)
  // and :hover variants that don't fit the rule format. Inject them as
  // preflight CSS so they live alongside the rest of the UnoCSS output.
  preflights: [
    {
      getCSS: () => `
.shadow-lift:hover {
  box-shadow:
    14px 14px 30px -2px var(--shadow),
    -3px -3px 6px -3px var(--highlight),
    inset 1px 1px 2px rgba(255, 255, 255, 0.18),
    inset 6px 6px 14px rgba(255, 255, 255, 0.06),
    inset -4px -4px 5px rgba(0, 0, 0, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.13),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12),
    inset -1px 0 0 rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.image-frame {
  position: relative;
  overflow: hidden;
  display: block;
  line-height: 0;
  box-shadow:
    10px 10px 24px -2px var(--shadow),
    -2px -2px 4px -3px var(--highlight);
}

.image-frame:hover {
  box-shadow:
    14px 14px 30px -2px var(--shadow),
    -3px -3px 6px -3px var(--highlight);
  transform: translateY(-1px);
}

.image-frame > picture {
  display: block;
  line-height: 0;
  border-radius: inherit;
}

.image-frame img,
.image-frame > svg,
.image-frame > video {
  display: block;
  width: 100%;
  border-radius: inherit;
}

.image-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image: var(--noise-image);
  background-size: var(--noise-size);
  background-repeat: repeat;
  z-index: 1;
}

.image-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 2;
  box-shadow:
    inset 1px 1px 2px rgba(255, 255, 255, 0.14),
    inset 6px 6px 14px rgba(255, 255, 255, 0.04),
    inset -4px -4px 5px rgba(0, 0, 0, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset -1px 0 0 rgba(255, 255, 255, 0.1);
}

/* CSS-columns masonry layout for Projects + Doodles (no JS). Items flow
   column-major: top → bottom of column 1, then column 2. Override is
   inherited so child <.project> elements stack vertically inside their
   columns. */
.masonry-grid {
  display: block;
  margin: 0;
  column-count: 1;
  column-gap: 1rem;
}

@media (min-width: 48em) {
  .masonry-grid {
    column-count: 2;
  }
}

.masonry-grid > .project {
  width: 100%;
  margin: 0 0 1rem;
  break-inside: avoid;
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .shadow-lift:hover,
  .image-frame:hover,
  .oss-card:hover {
    transform: none;
  }
}
`,
    },
  ],
});
