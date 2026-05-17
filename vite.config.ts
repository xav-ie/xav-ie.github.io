import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` is left as default `/` — this is a GitHub user site
// (xav-ie.github.io / xav.ie) served from the root, not a project page.
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/.direnv/**', '**/.devenv/**'],
    },
  },
})
