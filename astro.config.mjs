import fs from "node:fs";
import path from "node:path";
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import seoGraph from "@jdevalk/astro-seo-graph/integration";
import UnoCSS from "@unocss/astro";

// xav-ie.github.io is a GitHub *user* site served from the root.
export default defineConfig({
  site: "https://xav.ie",
  trailingSlash: "always",
  integrations: [
    // injectReset:false — we keep our own resets in global.css (which
    // includes hand-tuned font fallbacks and a noise background) and
    // don't want UnoCSS overwriting them.
    UnoCSS({ injectReset: false }),
    sitemap({
      // /font-tuner is a dev-only utility (noindex). Keep it out of the
      // public sitemap so it doesn't show up in search.
      filter: (page) => !page.includes("/font-tuner"),
      // Use the build date as lastmod so Google has a signal for recrawl
      // priority. A static site only rebuilds on deploy, so build date ≈
      // last content change date.
      serialize(item) {
        return { ...item, lastmod: new Date().toISOString().split("T")[0] };
      },
    }),
    seoGraph({
      // SERP title/description length bounds are aimed at content-heavy
      // sites; the intentionally terse "xav.ie" titles fall well below
      // the 30-char minimum, so the warnings would be noise here.
      validateMetadataLength: false,
      validateH1: false,
      // Emit <link rel="alternate" type="text/markdown"> on every page so
      // AI crawlers can find the .md sibling served by src/pages/**/[slug].md.ts.
      markdownAlternate: true,
      // Generate /llms.txt — a markdown sitemap LLMs read to summarise the
      // site. Pages are auto-collected from the crawled build output; the
      // filter mirrors the sitemap one so dev-only routes stay out.
      llmsTxt: {
        title: "xav.ie",
        siteUrl: "https://xav.ie",
        summary:
          "Personal site of Xavier Ruiz — a full-stack developer in Boston.",
        filter: (url) => !url.includes("/font-tuner") && !url.endsWith("/404"),
      },
      // IndexNow submission is gated on a CI env var so local builds don't
      // burn quota or accidentally fire before the key file is deployed.
      // The key file at /<key>.txt is *always* emitted (harmless to ship);
      // the env var only controls whether build:done pings the IndexNow API.
      ...(process.env.INDEXNOW_ENABLED === "1"
        ? {
            indexNow: {
              key: "746319963627bdb95c8404d2507c888c",
              host: "xav.ie",
              siteUrl: "https://xav.ie",
            },
          }
        : {}),
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
    plugins: [
      // Astro + Vite + each integration (content, fonts, UnoCSS, sitemap,
      // seo-graph) attaches its own listeners to the shared FSWatcher,
      // which trips Node's 10-listener leak heuristic. The listeners are
      // legitimate; raise the cap so the warning stops firing on dev start
      // and on every config-triggered restart.
      {
        name: "raise-watcher-max-listeners",
        configureServer(server) {
          server.watcher.setMaxListeners(20);
        },
      },
      {
        // Vite 7's servePublicMiddleware only matches exact file paths from
        // a pre-built set — directory paths like /projects/smart-rockets
        // are never in that set and fall through to Astro's 404 handler.
        // This pre-middleware rewrites directory requests to index.html before
        // servePublicMiddleware sees them, restoring directory index serving.
        name: "public-dir-index",
        configureServer(server) {
          server.middlewares.use((request, _response, next) => {
            const pathname = (request.url ?? "").split("?")[0];
            if (!pathname || pathname === "/") return next();
            const diskPath = path.join(server.config.publicDir, pathname);
            if (
              fs.statSync(diskPath, { throwIfNoEntry: false })?.isDirectory()
            ) {
              const indexPath = path.join(diskPath, "index.html");
              if (fs.existsSync(indexPath)) {
                request.url =
                  (pathname.endsWith("/") ? pathname : pathname + "/") +
                  "index.html";
              }
            }
            next();
          });
        },
      },
    ],
  },
});
