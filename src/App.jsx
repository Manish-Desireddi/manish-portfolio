import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Intro from './components/Intro'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Expertise from './components/Expertise'
import Leadership from './components/Leadership'
import Certifications from './components/Certifications'
import InteractiveCLI from './components/InteractiveCLI'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Background from './components/Background'
import DownloadPage from './components/DownloadPage'
import NotFoundPage from './components/NotFoundPage'
import ToastManager, { showToast } from './components/ToastManager'
import CookieConsent from './components/CookieConsent'
import EnterOverlay from './components/EnterOverlay'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { syncCanvasDimensions, drawCanvasFrame, useAssetPreloader } from './utils/canvasScrubber'
import { trackEvent, getConsentPreferences } from './utils/analytics'
import { SITE_METADATA } from './data/portfolioData'
import { resolveDownloadProject } from './utils/assetVerifier'

gsap.registerPlugin(ScrollTrigger)

const PreloaderOverlay = ({ progress = 0 }) => (
  <motion.div
    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-app-dark"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
  >
    <div className="relative flex flex-col items-center">
      <div className="relative mb-8 flex items-center justify-center">
        <motion.svg
          width="280"
          height="160"
          viewBox="0 0 280 160"
          className="overflow-visible"
          aria-label="Manish Desireddi Monogram"
        >
          <defs>
            <filter id="md-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
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
            filter="url(#md-glow)"
            initial={{ strokeDasharray: 800, strokeDashoffset: 800 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          >
            {SITE_METADATA.preloader.monogram}
          </motion.text>
        </motion.svg>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-pink-400">
            {SITE_METADATA.preloader.buffering}
          </span>
        </div>

        <div className="relative w-64 sm:w-80 h-1.5 bg-zinc-900 border border-zinc-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>

        <div className="flex justify-between w-64 sm:w-80 text-[10px] font-mono text-zinc-500 tracking-wider">
          <span>{SITE_METADATA.preloader.frameCounter}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  </motion.div>
)

const getDownloadMetadata = (proj, originPath) => ({
  title: proj.title,
  desc: proj.description,
  canonical: originPath + proj.route,
})

const getNotFoundMetadata = (originPath) => ({
  title: 'SYS.ERR // 404 — Sector Not Found',
  desc: 'Requested coordinate route does not exist in Manish Desireddi portfolio.',
  canonical: originPath,
})

const isValidPathname = (pathname) =>
  pathname === '/' || pathname === '/index.html' || pathname === ''

const VALID_HASHES = new Set([
  '',
  '#',
  '#about',
  '#experience',
  '#projects',
  '#expertise',
  '#leadership',
  '#certifications',
  '#cli',
  '#terminal',
  '#contact',
  '#footer',
])

const isDownloadHash = (hash) =>
  typeof hash === 'string' && (hash.startsWith('#/downloads') || hash.startsWith('#downloads'))

const isKnownHash = (hash) => VALID_HASHES.has(hash) || isDownloadHash(hash)

const isNotFoundLocation = (pathname, hash) =>
  !isValidPathname(pathname) || !isKnownHash(hash)

const resolveMetadata = (pathname, hash) => {
  const originPath = window.location.origin + window.location.pathname
  const downloadProj = resolveDownloadProject(hash)
  if (downloadProj) return getDownloadMetadata(downloadProj, originPath)
  if (isNotFoundLocation(pathname, hash)) return getNotFoundMetadata(originPath)
  return {
    title: SITE_METADATA.defaultTitle,
    desc: SITE_METADATA.defaultDescription,
    canonical: originPath,
  }
}

const usePortfolioMetadata = (pathname, hash) => {
  useEffect(() => {
    const { title, desc, canonical } = resolveMetadata(pathname, hash)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
  }, [pathname, hash])
}

const useKeyboardModality = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard')
      }
    }
    const handlePointerDown = () => {
      document.body.classList.remove('using-keyboard')
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('touchstart', handlePointerDown, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('touchstart', handlePointerDown)
      document.body.classList.remove('using-keyboard')
    }
  }, [])
}

const useConsentPreferences = () => {
  const [prefs, setPrefs] = useState(() => getConsentPreferences())
  useEffect(() => {
    const handleConsentChange = (e) => {
      setPrefs(e.detail || getConsentPreferences())
    }
    const handleStorage = (e) => {
      if (e.key === 'sys_privacy_consent_v1') {
        setPrefs(getConsentPreferences())
      }
    }
    window.addEventListener('sys-privacy-consent-changed', handleConsentChange)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('sys-privacy-consent-changed', handleConsentChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])
  return prefs
}

const TelemetryProviders = ({ prefs }) => (
  <>
    {prefs?.analytics && <Analytics />}
    {prefs?.telemetry && <SpeedInsights />}
  </>
)

const setupLenisInstance = () => {
  ScrollTrigger.config({ ignoreMobileResize: true })
  return new Lenis({
    duration: 3.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    smoothTouch: false,
    wheelMultiplier: 0.6,
    touchMultiplier: 0.8,
  })
}

const useLenisController = (hasEntered, isReady, isPaused) => {
  // fallow-ignore-next-line complexity
  useEffect(() => {
    if (!hasEntered || !isReady) return

    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const lenis = setupLenisInstance()

    lenis.on('scroll', ScrollTrigger.update)
    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()
    window.lenis = lenis

    return () => {
      gsap.ticker.remove(update)
      delete window.lenis
      lenis.destroy()
    }
  }, [hasEntered, isReady])

  useEffect(() => {
    document.body.style.overflow = isPaused ? 'hidden' : ''
    if (!window.lenis) return
    if (isPaused) {
      window.lenis.stop()
    } else {
      window.lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isPaused])
}

const observeScrollRegionResize = () => {
  let timeoutId = null
  const observer = new ResizeObserver(() => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  })

  const scrubZone = document.getElementById('scrub-zone')
  const expEl = document.getElementById('experience')
  if (scrubZone) observer.observe(scrubZone)
  if (expEl) observer.observe(expEl)

  return () => {
    clearTimeout(timeoutId)
    observer.disconnect()
  }
}

const HeroBackgroundCanvas = ({ heroFrames }) => {
  // fallow-ignore-next-line complexity
  useEffect(() => {
    if (!heroFrames || heroFrames.length === 0) return

    const canvas = document.getElementById('hero-canvas')
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const frames = { frame: 0 }
    const render = () => {
      const img = heroFrames[Math.round(frames.frame)] || heroFrames[0]
      drawCanvasFrame(canvas, context, img)
    }

    const handleResize = () => syncCanvasDimensions(canvas, render)
    handleResize()
    window.addEventListener('resize', handleResize)
    const cleanupObserver = observeScrollRegionResize()

    const ctx = gsap.context(() => {
      render()

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scrub-zone',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      tl.to(frames, {
        frame: heroFrames.length - 1,
        snap: 'frame',
        ease: 'none',
        duration: 1,
        onUpdate: render,
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'top center',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }).to(canvas, { opacity: 0, ease: 'none' })

      ScrollTrigger.refresh()
    })

    return () => {
      cleanupObserver()
      window.removeEventListener('resize', handleResize)
      ctx.revert()
    }
  }, [heroFrames])

  return (
    <canvas
      id="hero-canvas"
      className="fixed inset-0 w-full h-[100dvh] object-cover z-0 mix-blend-screen pointer-events-none opacity-90"
      aria-hidden="true"
    />
  )
}

// fallow-ignore-next-line complexity
const PortfolioLayout = ({
  isOffline,
  isAssetsReady,
  bufferProgress,
  setIsPreloaderDismissed,
  heroActive,
  handleVideoEnd,
  setIsVideoReady,
  isPreloaderDismissed,
  heroFrames,
  projectFrames,
  setIsCertModalActive,
  setIsProjectModalActive,
  handleRequestHero,
  isModalActive,
}) => (
  <div className="relative min-h-[100dvh] bg-app-dark no-scrollbar">
    <CustomCursor />
    <ToastManager />
    <CookieConsent />

    {isOffline && (
      <div className="fixed top-0 left-0 right-0 z-[10001] bg-red-600 text-white font-mono text-xs py-1.5 px-4 text-center tracking-widest uppercase">
        {SITE_METADATA.offlineBanner}
      </div>
    )}

    <AnimatePresence onExitComplete={() => setIsPreloaderDismissed(true)}>
      {!isAssetsReady && <PreloaderOverlay key="preloader" progress={bufferProgress} />}
    </AnimatePresence>

    <motion.div
      key="main-app"
      initial={{ opacity: 0 }}
      animate={{ opacity: isAssetsReady ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence
        onExitComplete={() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
          ScrollTrigger.refresh()
        }}
      >
        {heroActive && (
          <Intro
            key="intro"
            onVideoEnd={handleVideoEnd}
            onVideoReady={() => setIsVideoReady(true)}
            isPreloaderDismissed={isPreloaderDismissed}
          />
        )}
      </AnimatePresence>

      <HeroBackgroundCanvas heroFrames={heroFrames} />
      <Background />

      <main className="relative z-10">
        <div id="scrub-zone" className="relative">
          <Hero />
          <About />
          <Experience />
        </div>
        <Projects
          projectFrames={projectFrames}
          onModalStateChange={setIsProjectModalActive}
        />
        <Expertise />
        <Leadership />
        <Certifications onModalStateChange={setIsCertModalActive} />
        <InteractiveCLI />
        <Footer isOffline={isOffline} />
      </main>

      {!heroActive && (
        <Navigation onRequestHero={handleRequestHero} isModalActive={isModalActive} />
      )}
    </motion.div>
  </div>
)

// fallow-ignore-next-line complexity
const App = () => {
  const [hasEntered, setHasEntered] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const [locState, setLocState] = useState(() => ({
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }))
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isPreloaderDismissed, setIsPreloaderDismissed] = useState(false)
  const [isCertModalActive, setIsCertModalActive] = useState(false)
  const [isProjectModalActive, setIsProjectModalActive] = useState(false)
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false)

  const isModalActive = isCertModalActive || isProjectModalActive
  usePortfolioMetadata(locState.pathname, locState.hash)
  useKeyboardModality()
  const consentPrefs = useConsentPreferences()

  const { bufferProgress, isPreloadComplete, heroFrames, projectFrames } =
    useAssetPreloader(hasEntered)

  const isAssetsReady = isPreloadComplete
  useLenisController(hasEntered, isAssetsReady, heroActive || isModalActive)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      showToast({ title: 'CONNECTIVITY RESTORED', message: 'Online telemetry linked', type: 'success' })
    }
    const handleOffline = () => {
      setIsOffline(true)
      showToast({ title: 'CONNECTIVITY SEVERED', message: 'System operating in offline mode', type: 'error' })
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const syncLocation = () => {
      setLocState({
        pathname: window.location.pathname,
        hash: window.location.hash,
      })
    }
    window.addEventListener('hashchange', syncLocation)
    window.addEventListener('popstate', syncLocation)
    return () => {
      window.removeEventListener('hashchange', syncLocation)
      window.removeEventListener('popstate', syncLocation)
    }
  }, [])

  const handleVideoEnd = useCallback(() => {
    trackEvent('interaction', 'intro_completed')
    setHeroActive(false)
  }, [])

  const handleRequestHero = useCallback(() => {
    setHeroActive(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleReturnHome = useCallback(() => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.history.pushState({}, '', '/')
    }
    window.location.hash = ''
    setLocState({
      pathname: window.location.pathname,
      hash: window.location.hash,
    })
  }, [])

  const downloadProject = resolveDownloadProject(locState.hash)
  const isDownloadRoute = isDownloadHash(locState.hash)
  const is404 = isNotFoundLocation(locState.pathname, locState.hash)

  useEffect(() => {
    if (isDownloadRoute && !downloadProject) {
      showToast({
        type: 'error',
        title: 'SYS.ERR // ASSET UNAVAILABLE',
        message: 'This resource is not available at the moment.',
      })
      window.location.hash = '#projects'
    }
  }, [isDownloadRoute, downloadProject])

  if (isDownloadRoute && downloadProject) {
    return (
      <div className="relative min-h-[100dvh] bg-app-dark no-scrollbar">
        <TelemetryProviders prefs={consentPrefs} />
        <CustomCursor accentColor="teal" />
        <ToastManager />
        <DownloadPage />
      </div>
    )
  }

  if (is404) {
    return (
      <div className="relative min-h-[100dvh] bg-app-dark no-scrollbar">
        <TelemetryProviders prefs={consentPrefs} />
        <CustomCursor />
        <ToastManager />
        <NotFoundPage onReturnHome={handleReturnHome} />
      </div>
    )
  }

  if (!hasEntered) {
    return (
      <>
        <TelemetryProviders prefs={consentPrefs} />
        <CustomCursor />
        <EnterOverlay onEnter={() => setHasEntered(true)} />
      </>
    )
  }

  return (
    <>
      <TelemetryProviders prefs={consentPrefs} />
      <PortfolioLayout
        isOffline={isOffline}
        isAssetsReady={isAssetsReady}
        bufferProgress={bufferProgress}
        setIsPreloaderDismissed={setIsPreloaderDismissed}
        heroActive={heroActive}
        handleVideoEnd={handleVideoEnd}
        setIsVideoReady={setIsVideoReady}
        isPreloaderDismissed={isPreloaderDismissed}
        heroFrames={heroFrames}
        projectFrames={projectFrames}
        setIsCertModalActive={setIsCertModalActive}
        setIsProjectModalActive={setIsProjectModalActive}
        handleRequestHero={handleRequestHero}
        isModalActive={isModalActive}
      />
    </>
  )
}

export default App
