import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  logLevel: 'info',
  server: {
    open: true,
  },
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 800, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-vendor';
            if (id.includes('gsap')) return 'gsap-vendor';
            return 'vendor'; // Groups remaining dependencies
          }
        }
      }
    }
  },
})
