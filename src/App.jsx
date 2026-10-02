import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import AIArchitecture from './components/AIArchitecture'
import Certifications from './components/Certifications'
import InteractiveCLI from './components/InteractiveCLI'
import Footer from './components/Footer'
import DownloadPage from './components/DownloadPage'
import Hero from './components/Hero'
import EnterOverlay from './components/EnterOverlay'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOWNLOAD_ROUTE = '#/downloads/ai-assistant'

const MDPreloader = ({ isAssetsLoaded }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: isAssetsLoaded ? 0 : 1 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className={`fixed inset-0 z-[9999] bg-app-dark flex items-center justify-center ${isAssetsLoaded ? 'pointer-events-none' : ''}`}
  >
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-t-transparent border-pink-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.8)] flex items-center justify-center"
    >
      <img src="/favicon.svg" alt="MD Logo" className="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
    </motion.div>
  </motion.div>
)

const App = () => {
  const [hasEntered, setHasEntered] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const [route, setRoute]           = useState(() => window.location.hash)
  const [imagesFetched, setImagesFetched] = useState(false)
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false)
  const [isCertModalActive, setIsCertModalActive] = useState(false)
  const loadedImagesRef = useRef([])

  // Tiny hash router so the AI Assistant page works without a router dep.
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Initialize Lenis
  useEffect(() => {
    if (!hasEntered || route === DOWNLOAD_ROUTE || !isAssetsLoaded) return
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

    ScrollTrigger.refresh()

    window.lenis = lenis // Expose for Navigation components

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      delete window.lenis
      lenis.destroy()
    }
  }, [hasEntered, route, isAssetsLoaded])

  // Phase 1: Asset Preloading logic
  useEffect(() => {
    if (!hasEntered || route === DOWNLOAD_ROUTE) return
    let isCancelled = false
    
    const frameCount = 592
    const currentFrame = index => (
      `/assets/hero_frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    )

    const images = []
    const promises = []

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      const promise = fetch(currentFrame(i))
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
          img.src = URL.createObjectURL(blob)
        }))
        .catch(() => Promise.resolve())
      images.push(img)
      promises.push(promise)
    }

    Promise.all(promises).then(() => {
      if (isCancelled) return
      loadedImagesRef.current = images
      setImagesFetched(true)
    })

    return () => {
      isCancelled = true
    }
  }, [hasEntered, route])

  // Phase 1: Global Canvas Scrubbing initialization (runs after assets fetched)
  useEffect(() => {
    if (!hasEntered || !imagesFetched || route === DOWNLOAD_ROUTE) return
    
    const canvas = document.getElementById('hero-canvas')
    if (!canvas) return
    
    const context = canvas.getContext('2d')
    canvas.width = 1920
    canvas.height = 1080

    const images = loadedImagesRef.current
    const frames = { frame: 0 }
    
    let isFirstRender = true;

    let ctx = gsap.context(() => {
      const render = () => {
        if (images[Math.round(frames.frame)]) {
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(images[Math.round(frames.frame)], 0, 0, canvas.width, canvas.height)
          
          if (isFirstRender) {
            isFirstRender = false;
            // Delaying state update slightly allows the DOM to composite the canvas
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsAssetsLoaded(true);
              });
            });
          }
        }
      }

      render() // Initial render

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scrub-zone",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        }
      })

      tl.to(frames, {
        frame: images.length - 1,
        snap: "frame",
        ease: "none",
        duration: 1,
        onUpdate: render,
      })
    })

    return () => {
      if (ctx) ctx.revert()
    }
  }, [hasEntered, imagesFetched, route])

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
      <div className="relative min-h-[100dvh] bg-app-dark no-scrollbar">
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
    <div className="relative min-h-[100dvh] bg-app-dark no-scrollbar">
      <CustomCursor />
      
      <MDPreloader isAssetsLoaded={isAssetsLoaded} />

      <motion.div 
        key="main-app" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: isAssetsLoaded ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
        className={!imagesFetched ? "hidden" : ""}
      >
        {!heroActive && <Navigation onRequestHero={handleRequestHero} isModalActive={isCertModalActive} />}

        <AnimatePresence
          onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          {heroActive && <Intro key="intro" onVideoEnd={handleVideoEnd} />}
        </AnimatePresence>

        <div id="home" aria-hidden="true" />

        {/* Global Background Canvas spanning NewHero to Experience */}
        <canvas
          id="hero-canvas"
          className="fixed top-0 left-0 w-full h-[100dvh] object-cover z-0 mix-blend-screen pointer-events-none opacity-90"
        />
        {/* Texture Overlay */}
        <div className="fixed top-0 left-0 w-full h-[100dvh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply opacity-30 z-0 pointer-events-none" />

        <main className="relative z-10">
          <div id="scrub-zone" className="relative">
            <Hero />
            <About />
            <Experience />
          </div>
          <Projects />
          <AIArchitecture />
          <Certifications onModalStateChange={setIsCertModalActive} />
          <InteractiveCLI />
          <Footer />
        </main>
      </motion.div>
    </div>
  )
}

export default App
