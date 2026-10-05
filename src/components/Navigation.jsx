import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Briefcase, Code2, Trophy, Microscope, Terminal, Cpu, Award, Target } from 'lucide-react'
import { NAV_ITEMS } from '../data/portfolioData'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ICON_MAP = { Home, User, Briefcase, Code2, Trophy, Microscope, Terminal, Cpu, Award, Target }

const NAV_ENTRIES = NAV_ITEMS.map((item) => ({
  ...item,
  Icon: ICON_MAP[item.icon],
}))

const Navigation = ({ onRequestHero, isModalActive }) => {
  const [activeId, setActiveId] = useState('home')
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  const getScrollOffset = useCallback((id) => {
    if (id === 'home') return 0;
    const el = document.getElementById(id)
    if (!el) return 0;

    // Check if element has an associated ScrollTrigger that pins it
    const st = ScrollTrigger.getAll().find(t => t.trigger === el || t.pin === el || (t.trigger && t.trigger.id === id))
    if (st) {
      return st.start;
    }

    return el.getBoundingClientRect().top + window.scrollY;
  }, [])

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    setVisible(currentY < lastScrollY.current || currentY < 80)
    lastScrollY.current = currentY

    const midpoint = currentY + window.innerHeight * 0.45
    let current = 'home'
    for (const { id } of NAV_ITEMS) {
      const offset = getScrollOffset(id)
      if (offset <= midpoint) {
        current = id
      }
    }
    setActiveId(current)
  }, [getScrollOffset])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const goToSection = useCallback((id) => {
    if (id === 'home') {
      if (window.lenis) {
        const dur = Math.max(Math.abs(window.scrollY - 0) / 2000, 1.5);
        window.lenis.scrollTo(0, { duration: dur, easing: (t) => 1 - Math.pow(1 - t, 4) })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      setTimeout(() => {
        onRequestHero?.()
      }, 1200)
      return
    }

    const targetScroll = getScrollOffset(id)
    if (window.lenis) {
      const dur = Math.max(Math.abs(window.scrollY - targetScroll) / 2000, 1.5);
      window.lenis.scrollTo(targetScroll, { duration: dur, offset: 0, easing: (t) => 1 - Math.pow(1 - t, 4) })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [onRequestHero, getScrollOffset])

  return (
    <AnimatePresence>
      {visible && activeId !== 'projects' && !isModalActive && (
        <motion.nav
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-6 left-1/2 z-50"
          aria-label="Primary navigation"
        >
          {/* Rigid Horizontal Block */}
          <div className="flex items-center bg-black border-2 border-zinc-800 shadow-2xl flex-nowrap overflow-x-auto no-scrollbar max-w-[95vw]">
            {NAV_ENTRIES.map(({ id, label, Icon }) => {
              const isActive = activeId === id
              return (
                <button
                  key={id}
                  onClick={() => goToSection(id)}
                  aria-label={`Go to ${label} section`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative shrink-0 flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 transition-colors border-r border-zinc-800 last:border-r-0 hover:bg-zinc-900 group`}
                >
                  {/* Active highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-highlight"
                      className="absolute inset-0 border-b-4 border-pink-400 bg-pink-950/20"
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  )}

                  <Icon
                    size={20}
                    className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-pink-400' : 'text-zinc-500 group-hover:text-white'
                      }`}
                  />

                  {/* Hover tooltip */}
                  <span className="absolute -top-10 px-2 py-1 bg-black border border-zinc-800 text-white font-mono text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {label}
                  </span>
                </button>
              )
            })}

          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default Navigation
