import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, Download } from 'lucide-react'
import { NOT_FOUND_DATA } from '../data/portfolioData'

const NotFoundPage = ({ onReturnHome }) => {
  useEffect(() => {
    document.title = NOT_FOUND_DATA.title
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleHome = () => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.history.pushState({}, '', '/')
    }
    window.location.hash = ''
    onReturnHome?.()
  }

  const handleDownload = () => {
    window.location.hash = '#/downloads/aura'
  }

  return (
    <div className="relative min-h-[100dvh] bg-black text-white flex items-center justify-center px-6 overflow-hidden">
      <div className="fixed inset-0 bg-[url('/assets/cubes.png')] mix-blend-overlay opacity-15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl w-full border-2 border-pink-500/80 bg-zinc-950/90 p-8 sm:p-12 shadow-[0_0_50px_rgba(236,72,153,0.2)] text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/50 text-red-400 font-mono text-xs uppercase tracking-widest mb-6">
          <AlertTriangle size={14} />
          {NOT_FOUND_DATA.code} // ROUTE_UNRESOLVED
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading uppercase tracking-tighter mb-4 text-white">
          {NOT_FOUND_DATA.title}
        </h1>

        <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8">
          {NOT_FOUND_DATA.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={handleHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-pink-500 text-black font-heading uppercase text-sm tracking-wider hover:bg-white transition-colors cursor-pointer"
          >
            <Home size={18} />
            {NOT_FOUND_DATA.returnButton}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-700 hover:border-pink-500 text-white font-heading uppercase text-sm tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Download size={18} />
            AURA OS Download
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
