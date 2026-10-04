import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  logLevel: 'warn',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
})
