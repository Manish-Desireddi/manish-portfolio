import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  logLevel: 'info',
  server: {
    open: true,
  },
  plugins: [
    react(),
    {
      name: 'api-feedback-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/api/feedback', async (req, res) => {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            if (body) {
              try {
                req.body = JSON.parse(body)
              } catch {
                req.body = {}
              }
            }
            res.status = (code) => {
              res.statusCode = code
              return res
            }
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return res
            }
            try {
              const { default: handler } = await server.ssrLoadModule('/api/feedback.js')
              await handler(req, res)
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        })
      },
    },
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-vendor'
            if (id.includes('gsap')) return 'gsap-vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
