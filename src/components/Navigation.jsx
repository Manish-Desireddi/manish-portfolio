import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Briefcase, Code2, Trophy, Download } from 'lucide-react'
import { NAV_ITEMS } from '../data/portfolioData'

const ICON_MAP = { Home, User, Briefcase, Code2, Trophy }

const NAV_ENTRIES = NAV_ITEMS.map((item) => ({
  ...item,
  Icon: ICON_MAP[item.icon],
}))

const Navigation = ({ onRequestHero }) => {
  const [activeId, setActiveId] = useState('home')
  const [visible, setVisible]   = useState(true)
  const lastScrollY             = useRef(0)

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    setVisible(currentY < lastScrollY.current || currentY < 80)
    lastScrollY.current = currentY

    const midpoint = currentY + window.innerHeight * 0.45
    let current = 'home'
    for (const { id } of NAV_ITEMS) {
      const el = document.getElementById(id)
      if (el && el.offsetTop <= midpoint) current = id
    }
    setActiveId(current)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const goToSection = useCallback((id) => {
    if (id === 'home') {
      onRequestHero?.()
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [onRequestHero])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="nav-pill"
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-5 left-1/2 z-50"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-0.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-zinc-900/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60">
            {NAV_ENTRIES.map(({ id, label, Icon }) => {
              const isActive = activeId === id
              return (
                <button
                  key={id}
                  onClick={() => goToSection(id)}
                  aria-label={`Go to ${label} section`}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative flex flex-col items-center gap-0.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/8"
                      transition={{ type: 'spring', damping: 28, stiffness: 400 }}
                    />
                  )}
                  <Icon
                    size={17}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-200'
                    }`}
                  />
                  <span
                    className={`relative z-10 text-[9px] font-mono tracking-wide transition-colors duration-200 hidden sm:block ${
                      isActive ? 'text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              )
            })}

            <div className="w-px h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1 shrink-0" aria-hidden="true" />

            <a
              href="/assets/resume.pdf"
              download
              aria-label="Download resume PDF"
              className="relative flex flex-col items-center gap-0.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
            >
              <Download
                size={17}
                className="text-zinc-500 group-hover:text-zinc-200 transition-colors duration-200"
                aria-hidden="true"
              />
              <span className="text-[9px] font-mono tracking-wide text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200 hidden sm:block">
                Resume
              </span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default Navigation
