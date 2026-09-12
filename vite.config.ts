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
          if (!id.includes('node_modules')) return
          // Anything dynamically imported must be left alone: naming a chunk
          // here overrides the import() split and drags the module into the
          // first load. That is how the 1 MB WebCodecs engine ended up in the
          // homepage bundle.
          if (id.includes('@diffusionstudio')) return
          if (id.includes('lucide-react')) return
          // Recharts + d3 only ever load with the instrument grid.
          if (id.includes('recharts') || id.includes('/d3-') || id.includes('victory')) return 'charts'
          // Two animation libraries are installed: framer-motion (amicro's
          // entrance components, used in the hero) and motion (a couple of
          // the charts). Keep them out of the shared vendor chunk so the
          // hero does not pay for the chart set's copy.
          // framer-motion and motion share internals, so splitting them into
          // two chunks makes them circular. One animation chunk.
          if (id.includes('framer-motion') || id.includes('/motion/')
              || id.includes('/motion-dom/') || id.includes('/motion-utils/')) return 'motion'
          if (id.includes('@radix-ui')) return 'radix'
          if (id.includes('react-router')) return 'router'
          return 'vendor'
        },
      },
    },
  },
})
