import { defineConfig } from 'astro/config';

// xav-ie.github.io is a GitHub *user* site served from the root.
export default defineConfig({
  site: 'https://xav.ie',
  trailingSlash: 'ignore',
  vite: {
    server: {
      watch: {
        ignored: ['**/.direnv/**', '**/.devenv/**'],
      },
    },
  },
});
