import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import AIArchitecture from './components/AIArchitecture'
import Footer from './components/Footer'

const App = () => {
  const [heroActive, setHeroActive] = useState(true)

  // Lock body scroll while the hero intro overlay is covering the page
  useEffect(() => {
    document.body.style.overflow = heroActive ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [heroActive])

  const handleVideoEnd     = useCallback(() => setHeroActive(false), [])
  const handleRequestHero  = useCallback(() => {
    setHeroActive(true)
    // Snap to top so the overlay covers from the correct position
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="relative bg-zinc-950 min-h-screen overflow-x-hidden">
      <CustomCursor />

      {/* Navigation only appears after the hero intro slides out */}
      {!heroActive && <Navigation onRequestHero={handleRequestHero} />}

      {/* Fixed ambient gradient orbs — always behind content */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="gradient-orb absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.055) 0%, transparent 70%)' }}
        />
        <div
          className="gradient-orb absolute top-[60%] right-[8%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.065) 0%, transparent 70%)',
            animationDelay: '-5s',
          }}
        />
        <div
          className="gradient-orb absolute top-[40%] left-[55%] w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.045) 0%, transparent 70%)',
            animationDelay: '-2.5s',
          }}
        />
      </div>

      {/*
       * Hero is a fixed full-screen overlay (z-[60]).
       * Main content is always in the DOM behind it — no flash or layout jump
       * when hero slides away on video end.
       */}
      <AnimatePresence
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        {heroActive && <Hero key="hero" onVideoEnd={handleVideoEnd} />}
      </AnimatePresence>

      {/* Anchor target so the Home nav item works after hero is gone */}
      <div id="home" aria-hidden="true" />

      <main>
        <About />
        <Experience />
        <Projects />
        <AIArchitecture />
        <Footer />
      </main>
    </div>
  )
}

export default App
