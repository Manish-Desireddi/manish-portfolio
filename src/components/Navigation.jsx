import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  User,
  Briefcase,
  Code2,
  Terminal,
  Cpu,
  Award,
  Target,
  Menu,
  X,
  Download,
  Mail,
  ChevronRight,
} from 'lucide-react'
import { NAV_ITEMS, SITE_METADATA, ABOUT_DATA } from '../data/portfolioData'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trackEvent } from '../utils/analytics'
import { verifyAndTriggerDownload } from '../utils/assetVerifier'

const ICON_MAP = {
  Home,
  User,
  Briefcase,
  Code2,
  Cpu,
  Target,
  Award,
  Terminal,
  Mail,
}

const NAV_ENTRIES = NAV_ITEMS.map((item) => ({
  ...item,
  Icon: ICON_MAP[item.icon] || Terminal,
}))

// fallow-ignore-next-line complexity
const DrawerMenuLink = ({ href, onClick, label, icon: Icon, isActive, badge }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center justify-between p-4 border transition-all ${
      isActive
        ? 'border-pink-500 bg-pink-950/20 text-white'
        : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-600 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className={isActive ? 'text-pink-400' : 'text-zinc-500'} />}
      <span className="font-heading uppercase text-sm sm:text-base tracking-wide">{label}</span>
    </div>
    {isActive ? (
      <span className="font-mono text-[10px] text-pink-400 uppercase tracking-widest border border-pink-500/50 px-2 py-0.5">
        ACTIVE
      </span>
    ) : badge ? (
      <span className="font-mono text-[10px] uppercase tracking-widest">{badge}</span>
    ) : (
      <ChevronRight size={16} className="text-zinc-600" />
    )}
  </a>
)

const DesktopNavStrip = ({ activeId, onSelect }) => (
  <div className="hidden md:flex items-center flex-nowrap md:overflow-visible">
    {NAV_ENTRIES.map(({ id, label, Icon }) => {
      const isActive = activeId === id
      return (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => onSelect(e, id)}
          aria-label={`Navigate to ${label} section`}
          aria-current={isActive ? 'page' : undefined}
          className="relative shrink-0 flex flex-col items-center justify-center w-14 h-14 transition-colors border-r border-zinc-800 hover:bg-zinc-900 group"
        >
          {isActive && (
            <motion.div
              layoutId="nav-dock-highlight"
              className="absolute inset-0 border-b-4 border-pink-400 bg-pink-950/20"
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            />
          )}
          <Icon
            size={18}
            className={`relative z-10 transition-colors duration-200 ${
              isActive ? 'text-pink-400' : 'text-zinc-500 group-hover:text-white'
            }`}
          />
          <span className="absolute -top-9 px-2 py-1 bg-black border border-zinc-800 text-white font-mono text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
            {label}
          </span>
        </a>
      )
    })}
  </div>
)

const MobileMenuButton = ({ drawerOpen, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={drawerOpen ? 'Close command drawer' : 'Open command drawer'}
    aria-expanded={drawerOpen}
    className="md:hidden flex items-center justify-center w-12 h-12 bg-zinc-950 hover:bg-pink-950/30 text-pink-400 border-zinc-800 transition-colors shrink-0"
  >
    {drawerOpen ? <X size={20} /> : <Menu size={20} />}
  </button>
)

const HudCommandDrawer = ({ isOpen, onClose, activeId, onSelect, onResumeDownload, drawerRef }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col p-6 sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Command Navigation Drawer"
      ref={drawerRef}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-heading uppercase text-sm sm:text-base tracking-widest text-pink-400">
            SYS.NAV // HUD COMMAND DRAWER
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-pink-500 transition-colors"
          aria-label="Close command drawer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl w-full mx-auto flex-1 overflow-y-auto no-scrollbar py-2">
        {NAV_ENTRIES.map(({ id, label, Icon }) => (
          <DrawerMenuLink
            key={id}
            href={`#${id}`}
            onClick={(e) => onSelect(e, id)}
            label={label}
            icon={Icon}
            isActive={activeId === id}
          />
        ))}


        <DrawerMenuLink
          href={ABOUT_DATA.resumeUrl}
          onClick={onResumeDownload}
          label="Download Official Resume"
          icon={Download}
          isActive={false}
          badge="PDF"
        />
      </div>

      <div className="border-t border-zinc-900 pt-4 text-center">
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          {SITE_METADATA.hudDrawerFooter}
        </span>
      </div>
    </motion.div>
  )
}

const Navigation = ({ onRequestHero, isModalActive }) => {
  const [activeId, setActiveId] = useState('home')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef(null)

  // fallow-ignore-next-line complexity
  const getScrollOffset = useCallback((id) => {
    if (id === 'home') return 0
    const el = document.getElementById(id)
    if (!el) return 0
    const st = ScrollTrigger.getAll().find(
      (t) => t.pin === el || (t.trigger === el && Boolean(t.vars?.pin))
    )
    if (st) return st.start
    const pinSpacer = el.closest('.pin-spacer')
    const target = pinSpacer || el
    return target.getBoundingClientRect().top + window.scrollY
  }, [])

  const handleScroll = useCallback(() => {
    const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60
    if (isBottom) {
      setActiveId('contact')
      return
    }

    const midpoint = window.scrollY + window.innerHeight * 0.4
    let current = 'home'
    const items = [...NAV_ITEMS, { id: 'contact' }]
    for (const { id } of items) {
      if (getScrollOffset(id) <= midpoint) current = id
    }
    setActiveId(current)
  }, [getScrollOffset])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    if (drawerOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const goToSection = useCallback(
    (e, id) => {
      e?.preventDefault()
      setActiveId(id)
      setDrawerOpen(false)
      trackEvent('navigation', 'nav_jump', { section: id })

      if (id === 'home') {
        if (window.lenis) {
          window.lenis.scrollTo(0, {
            immediate: false,
            duration: 3.5,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            onComplete: () => onRequestHero?.(),
          })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => onRequestHero?.(), 400)
        }
        return
      }

      const targetScroll = getScrollOffset(id)
      const dur = Math.max(Math.abs(window.scrollY - targetScroll) / 2000, 1.8)
      if (window.lenis) {
        window.lenis.scrollTo(targetScroll, {
          duration: dur,
          offset: 0,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    },
    [onRequestHero, getScrollOffset]
  )

  const handleResumeDownload = async (e) => {
    e?.preventDefault()
    setDrawerOpen(false)
    trackEvent('download', 'resume_pdf', { source: 'drawer_navigation' })
    await verifyAndTriggerDownload(ABOUT_DATA.resumeUrl, ABOUT_DATA.resumeFileName)
  }

  if (isModalActive) return null

  return (
    <>
      <nav
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        aria-label="Primary navigation"
      >
        <div className="flex items-center bg-black/90 border-2 border-zinc-800 shadow-2xl backdrop-blur-md rounded-none max-w-[95vw]">
          <DesktopNavStrip activeId={activeId} onSelect={goToSection} />
          <MobileMenuButton drawerOpen={drawerOpen} onToggle={() => setDrawerOpen((p) => !p)} />
        </div>
      </nav>

      <AnimatePresence>
        <HudCommandDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          activeId={activeId}
          onSelect={goToSection}
          onResumeDownload={handleResumeDownload}
          drawerRef={drawerRef}
        />
      </AnimatePresence>
    </>
  )
}

export default Navigation
