import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import Leadership from './components/Leadership'
import Projects from './components/Projects'
import Expertise from './components/Expertise'
import Certifications from './components/Certifications'
import InteractiveCLI from './components/InteractiveCLI'
import Footer from './components/Footer'
import DownloadPage from './components/DownloadPage'
import Hero from './components/Hero'
import EnterOverlay from './components/EnterOverlay'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Background from './components/Background'

gsap.registerPlugin(ScrollTrigger)

const DOWNLOAD_ROUTE = '#/downloads/ai-assistant'
const sectionClickSfx = typeof window !== 'undefined' ? new Audio('/assets/mech-click.mp3') : null;

const MDPreloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2.5, delay: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-app-dark flex items-center justify-center pointer-events-none drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"
    >
      <motion.svg
        width="200"
        height="100"
        viewBox="0 0 200 100"
      >
        <motion.text
          x="50%"
          y="50%"
          className="font-heading"
          fontWeight="900"
          fontSize="64"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="transparent"
          stroke="#ec4899"
          strokeWidth="2"
          initial={{ strokeDasharray: 800, strokeDashoffset: 800 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        >
          MD
        </motion.text>
      </motion.svg>
    </motion.div>
  )
}

const App = () => {
  const [hasEntered, setHasEntered] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const [route, setRoute] = useState(() => window.location.hash)
  const [imagesFetched, setImagesFetched] = useState(false)
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isPreloaderDismissed, setIsPreloaderDismissed] = useState(false)
  const [isCertModalActive, setIsCertModalActive] = useState(false)
  const loadedImagesRef = useRef([])
  const [minTimerDone, setMinTimerDone] = useState(false)

  // Timer promise (3s min)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimerDone(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Dual-gate: only clear preloader once BOTH timer AND intro video are ready
  useEffect(() => {
    if (minTimerDone && isVideoReady) {
      setIsAssetsLoaded(true)
    }
  }, [isVideoReady, minTimerDone])

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
      duration: 3.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.6, touchMultiplier: 0.8,
    })

    if (heroActive) lenis.stop()

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
    const currentFrame = index => {
      return `/assets/hero_frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    }

    const images = Array(frameCount).fill(null)
    loadedImagesRef.current = images

    const fetchChunk = async (start, chunkSize) => {
      const end = Math.min(start + chunkSize, frameCount)
      const promises = []

      for (let i = start; i < end; i++) {
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
        images[i] = img
        promises.push(promise)
      }

      await Promise.all(promises)
      if (isCancelled) return

      if (start === 0) {
        setImagesFetched(true)
      }

      if (end < frameCount) {
        setTimeout(() => fetchChunk(end, 50), 200)
      }
    }

    if (isVideoReady) {
      fetchChunk(0, 30)
    }

    return () => {
      isCancelled = true
    }
  }, [hasEntered, route, isVideoReady])

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
        const img = images[Math.round(frames.frame)]
        // Add naturalWidth > 0 to verify the image is not broken
        if (img && img.naturalWidth > 0) {
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }

      render() // Initial render

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scrub-zone",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      })

      tl.to(frames, {
        frame: images.length - 1,
        snap: "frame",
        ease: "none",
        duration: 1,
        onUpdate: render,
      })

      const fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#projects",
          start: "top bottom",
          end: "top center",
          scrub: true,
          onEnter: () => { if (sectionClickSfx) { sectionClickSfx.currentTime = 0; sectionClickSfx.play().catch(() => { }) } },
          onEnterBack: () => { if (sectionClickSfx) { sectionClickSfx.currentTime = 0; sectionClickSfx.play().catch(() => { }) } },
        }
      })
      fadeTl.to(["#hero-canvas", "#texture-overlay"], {
        opacity: 0,
        ease: "none"
      })
    })

    return () => {
      if (ctx) ctx.revert()
    }
  }, [hasEntered, imagesFetched, route])

  useEffect(() => {
    const lock = heroActive && route !== DOWNLOAD_ROUTE
    document.body.style.overflow = lock ? 'hidden' : ''
    if (lock) {
      window.lenis?.stop()
    } else {
      window.lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      window.lenis?.start()
    }
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

      <AnimatePresence onExitComplete={() => setIsPreloaderDismissed(true)}>
        {!isAssetsLoaded && <MDPreloader key="preloader" />}
      </AnimatePresence>

      <motion.div
        key="main-app"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAssetsLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {!heroActive && <Navigation onRequestHero={handleRequestHero} isModalActive={isCertModalActive} />}

        <AnimatePresence
          onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          {heroActive && <Intro key="intro" onVideoEnd={handleVideoEnd} onVideoReady={() => setIsVideoReady(true)} isPreloaderDismissed={isPreloaderDismissed} />}
        </AnimatePresence>

        <div id="home" aria-hidden="true" />

        {/* Global Background Canvas spanning NewHero to Experience */}
        <canvas
          id="hero-canvas"
          className="fixed top-0 left-0 w-full h-[100dvh] object-cover z-0 mix-blend-screen pointer-events-none opacity-90"
        />
        {/* Texture Overlay */}
        <div id="texture-overlay" className="fixed top-0 left-0 w-full h-[100dvh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply opacity-30 z-0 pointer-events-none" />

        <Background />

        <main className="relative z-10">
          <div id="scrub-zone" className="relative">
            <Hero />
            <About />
            <Experience />
          </div>
          <Projects />
          <Expertise />
          <Leadership />
          <Certifications onModalStateChange={setIsCertModalActive} />
          <InteractiveCLI />
          <Footer />
        </main>
      </motion.div>
    </div>
  )
}

export default App
