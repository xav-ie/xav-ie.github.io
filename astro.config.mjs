import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// xav-ie.github.io is a GitHub *user* site served from the root.
export default defineConfig({
  site: "https://xav.ie",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      // /font-tuner is a dev-only utility (noindex). Keep it out of the
      // public sitemap so it doesn't show up in search.
      filter: (page) => !page.includes("/font-tuner"),
    }),
  ],
  fonts: [
    // Self-hosted via astro:fonts — Astro downloads the subset, emits the
    // @font-face under a hashed unique name, and we preload the woff2 in
    // Base.astro. The CSS variables here are referenced by global.css's
    // --font-body / --font-heading stacks alongside the manually tuned
    // metric-matched fallbacks. optimizedFallbacks is off because those
    // hand-tuned fallbacks already cover Palatino/Noto/Helvetica/Roboto.
    //
    // weights/styles are pinned so astro:fonts only subsets + preloads
    // exactly what the site uses — one upright 400 per family. Italic and
    // other weights aren't referenced anywhere in src/styles, so omitting
    // them keeps the preload payload to two woff2 files total.
    {
      provider: fontProviders.google(),
      name: "IBM Plex Sans",
      cssVariable: "--font-ibm-plex-sans",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: "Sorts Mill Goudy",
      cssVariable: "--font-sorts-mill-goudy",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: [],
      optimizedFallbacks: false,
    },
  ],
  build: {
    // Inline the small site-wide CSS bundle into every <head> so first
    // paint doesn't wait on a separate stylesheet request.
    inlineStylesheets: "always",
  },
  vite: {
    server: {
      watch: {
        ignored: ["**/.direnv/**", "**/.devenv/**"],
      },
    },
  },
});
