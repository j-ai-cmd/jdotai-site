import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  // The SSR pass is build-only scaffolding: it must not re-copy public/,
  // which would duplicate the legacy site and both demo videos into dist/server.
  ...(process.argv.includes('--ssr') ? { publicDir: false as const } : {}),
  build: {
    // Route-level chunks keep the homepage's critical path small — the old
    // live site shipped 1.1 MB in a single bundle.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) return 'charts'
            if (id.includes('react-router')) return 'router'
            return 'vendor'
          }
        },
      },
    },
  },
})
