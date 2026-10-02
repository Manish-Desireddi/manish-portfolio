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

const MDPreloader = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1.2, delay: 0.5 } }}
    className="fixed inset-0 z-[9999] bg-app-dark flex items-center justify-center pointer-events-none"
  >
    <svg width="200" height="200" viewBox="0 0 200 200" className="filter drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
      <motion.text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="80"
        fontFamily="sans-serif"
        fontWeight="bold"
        fill="transparent"
        stroke="#ec4899"
        strokeWidth="2"
        initial={{ strokeDasharray: 400, strokeDashoffset: 400 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      >
        MD
      </motion.text>
    </svg>
  </motion.div>
)

const App = () => {
  const [hasEntered, setHasEntered] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const [route, setRoute]           = useState(() => window.location.hash)
  const [imagesFetched, setImagesFetched] = useState(false)
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isCertModalActive, setIsCertModalActive] = useState(false)
  const loadedImagesRef = useRef([])
  const loadedProjectImagesRef = useRef([])
  // Tracks whether first canvas frame has been drawn — combined with isVideoReady to gate preloader
  const canvasReadyRef = useRef(false)

  // Dual-gate: only clear preloader once BOTH canvas AND intro video are ready
  useEffect(() => {
    if (canvasReadyRef.current && isVideoReady) {
      setIsAssetsLoaded(true)
    }
  }, [isVideoReady])

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
    
    const heroFrameCount = 592
    const projectsFrameCount = 600
    
    const heroFrameUrl = index => `/assets/hero_frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    const projectFrameUrl = index => `/assets/projects_frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`

    const heroImages = []
    const projectImages = []
    const promises = []

    const loadFrame = (url, arrayToPush) => {
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      const promise = fetch(url)
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
          img.src = URL.createObjectURL(blob)
        }))
        .catch(() => Promise.resolve())
      arrayToPush.push(img)
      promises.push(promise)
    }

    for (let i = 0; i < heroFrameCount; i++) {
      loadFrame(heroFrameUrl(i), heroImages)
    }

    for (let i = 0; i < projectsFrameCount; i++) {
      loadFrame(projectFrameUrl(i), projectImages)
    }

    Promise.all(promises).then(() => {
      if (isCancelled) return
      loadedImagesRef.current = heroImages
      loadedProjectImagesRef.current = projectImages
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
            // Flag canvas as ready; dual-gate useEffect fires setIsAssetsLoaded once video is also ready
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                canvasReadyRef.current = true;
                // If video was already ready before canvas, resolve immediately
                setIsVideoReady(prev => {
                  if (prev) setIsAssetsLoaded(true)
                  return prev
                })
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

      // Phase 4: Hero Canvas Bleeding fix
      ScrollTrigger.create({
        trigger: "#projects",
        start: "top bottom", // when the top of #projects hits the bottom of the viewport
        onEnter: () => gsap.to('#hero-canvas', { opacity: 0, duration: 0.5 }),
        onLeaveBack: () => gsap.to('#hero-canvas', { opacity: 0.9, duration: 0.5 })
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
      
      <AnimatePresence>
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
          {heroActive && <Intro key="intro" onVideoEnd={handleVideoEnd} onVideoReady={() => setIsVideoReady(true)} />}
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
          <Projects frames={loadedProjectImagesRef.current} />
          <div className="relative">
            {/* Unified Background for bottom sections */}
            <div className="absolute inset-0 z-0 bg-app-dark overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.05),transparent_80%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:64px_64px]" />
            </div>
            
            <div className="relative z-10">
              <AIArchitecture />
              <Certifications onModalStateChange={setIsCertModalActive} />
              <InteractiveCLI />
            </div>
          </div>
          <Footer />
        </main>
      </motion.div>
    </div>
  )
}

export default App
