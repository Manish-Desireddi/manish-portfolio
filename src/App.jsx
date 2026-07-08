import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import AIArchitecture from './components/AIArchitecture'
import Footer from './components/Footer'
import DownloadPage from './components/DownloadPage'
import Hero from './components/Hero'
import EnterOverlay from './components/EnterOverlay'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOWNLOAD_ROUTE = '#/downloads/ai-assistant'

const App = () => {
  const [hasEntered, setHasEntered] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const [route, setRoute]           = useState(() => window.location.hash)

  // Tiny hash router so the AI Assistant page works without a router dep.
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])



  // Initialize Lenis
  useEffect(() => {
    if (!hasEntered) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    window.lenis = lenis // Expose for Navigation components

    return () => {
      delete window.lenis
      lenis.destroy()
    }
  }, [hasEntered])

  // Global Video Scrubbing logic
  useEffect(() => {
    if (!hasEntered) return
    let ctx = gsap.context(() => {
      const canvas = document.getElementById('hero-canvas')
      if (!canvas) return
      const context = canvas.getContext('2d')
      
      const frameCount = 592
      const currentFrame = (index) => (
        `/assets/hero_frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
      )
      
      const images = []
      const scrubObj = { frame: 0 }
      
      for (let i = 0; i < frameCount; i++) {
        const img = new Image()
        img.onload = () => {
          if (Math.floor(scrubObj.frame) === i || (i === 0 && scrubObj.frame === 0)) {
            render()
          }
        }
        img.src = currentFrame(i)
        images.push(img)
      }
      
      function render() {
        const img = images[Math.floor(scrubObj.frame)]
        if (img && img.complete && img.naturalWidth !== 0) {
          const hRatio = canvas.width / img.width
          const vRatio = canvas.height / img.height
          const ratio = Math.max(hRatio, vRatio)
          const centerShift_x = (canvas.width - img.width * ratio) / 2
          const centerShift_y = (canvas.height - img.height * ratio) / 2
          
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0, img.width, img.height,
                            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)
        }
      }

      gsap.ticker.add(render)

      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        render()
      }
      
      handleResize()
      window.addEventListener('resize', handleResize)



      gsap.to(scrubObj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: "#scrub-zone",
          start: "top top",
          end: "bottom 80%",
          scrub: true, // Perfect sync for GTA VI style scrubbing
        },
      })
      
      // Fade out canvas when reaching projects
      gsap.to(canvas, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top 50%",
          end: "top top",
          scrub: true,
        }
      })
      
      return () => {
        gsap.ticker.remove(render)
        window.removeEventListener('resize', handleResize)
      }
    })
    return () => ctx.revert()
  }, [hasEntered])

  useEffect(() => {
    const lock = heroActive && route !== DOWNLOAD_ROUTE
    document.body.style.overflow = lock ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [heroActive, route])

  const handleVideoEnd = useCallback(() => setHeroActive(false), [])
  const handleRequestHero = useCallback(() => {
    setHeroActive(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (hasEntered && !heroActive && route === DOWNLOAD_ROUTE) {
      setRoute(DOWNLOAD_ROUTE)
    }
  }, [hasEntered, heroActive, route])

  // Initial scroll restoration
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  if (route === DOWNLOAD_ROUTE) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-app-dark">
        <CustomCursor />
        <DownloadPage />
      </div>
    )
  }

  if (!hasEntered) {
    return (
      <>
        <CustomCursor />
        <EnterOverlay onEnter={() => setHasEntered(true)} />
      </>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-app-dark">
      <CustomCursor />

      {!heroActive && <Navigation onRequestHero={handleRequestHero} />}

      <AnimatePresence
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        {heroActive && <Intro key="intro" onVideoEnd={handleVideoEnd} />}
      </AnimatePresence>

      <div id="home" aria-hidden="true" />

      {/* Global Background Canvas spanning NewHero to Experience */}
      <canvas
        id="hero-canvas"
        className="fixed top-0 left-0 w-full h-screen z-0 mix-blend-screen pointer-events-none opacity-90"
      />
      {/* Texture Overlay */}
      <div className="fixed top-0 left-0 w-full h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply opacity-30 z-0 pointer-events-none" />

      <main className="relative z-10">
        <div id="scrub-zone">
          <Hero />
          <About />
          <Experience />
        </div>
        <Projects />
        <AIArchitecture />
        <Footer />
      </main>
    </div>
  )
}

export default App
