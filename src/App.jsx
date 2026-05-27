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
import Neural3DBackground from './components/Neural3DBackground'
import DownloadPage from './components/DownloadPage'

const DOWNLOAD_ROUTE = '#/downloads/ai-assistant'

const App = () => {
  const [heroActive, setHeroActive] = useState(true)
  const [route, setRoute]           = useState(() => window.location.hash)

  // Tiny hash router so the AI Assistant page works without a router dep.
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const lock = heroActive && route !== DOWNLOAD_ROUTE
    document.body.style.overflow = lock ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [heroActive, route])

  const handleVideoEnd    = useCallback(() => setHeroActive(false), [])
  const handleRequestHero = useCallback(() => {
    setHeroActive(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Route: standalone AI Assistant download page
  if (route === DOWNLOAD_ROUTE) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-zinc-950">
        <CustomCursor />
        <DownloadPage />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950">
      <CustomCursor />

      {/* Continuous aurora background — sits behind every post-hero section */}
      <Neural3DBackground />

      {!heroActive && <Navigation onRequestHero={handleRequestHero} />}

      <AnimatePresence
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        {heroActive && <Hero key="hero" onVideoEnd={handleVideoEnd} />}
      </AnimatePresence>

      <div id="home" aria-hidden="true" />

      <main className="relative z-10">
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
