import { defineConfig } from "astro/config";

// xav-ie.github.io is a GitHub *user* site served from the root.
export default defineConfig({
  site: "https://xav.ie",
  trailingSlash: "ignore",
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
