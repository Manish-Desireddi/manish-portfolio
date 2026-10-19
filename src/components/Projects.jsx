import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS, PROJECTS_META } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import PrivateRepoModal from './PrivateRepoModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playSubBassCue } from '../utils/audioContext'
import { syncCanvasDimensions, drawCanvasFrame } from '../utils/canvasScrubber'
import { trackEvent } from '../utils/analytics'

gsap.registerPlugin(ScrollTrigger)

const ProjectCardFront = ({ project, onOpenDemo, onOpenRepo, onFlip, isFlipped }) => (
  <div
    className={`absolute inset-0 w-full h-full bg-zinc-950/95 border-l-4 border-pink-500 p-5 sm:p-7 md:p-9 flex flex-col justify-between shrink-0 overflow-hidden group shadow-[inset_0_0_24px_rgba(217,70,239,0.18)] ${
      isFlipped ? 'pointer-events-none z-10' : 'pointer-events-auto z-20'
    }`}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
    }}
  >
    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-pink-500/80" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-pink-500/80" />

    <div className="shrink-0 mb-2">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="font-mono text-[10px] tracking-widest text-pink-400 uppercase">
          SEC // {project.id}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onFlip()
          }}
          className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 hover:text-pink-400 tracking-wider transition-colors uppercase cursor-pointer"
        >
          <span>FLIP FOR TELEMETRY</span>
          <span className="text-pink-400">➔</span>
        </button>
      </div>

      <h3 className="font-heading text-xl sm:text-2xl md:text-3xl uppercase tracking-tighter text-white mb-2 group-hover:text-pink-400 transition-colors">
        {project.title}
      </h3>
    </div>

    <div className="overflow-y-auto no-scrollbar min-h-0 flex-1 pr-1 mb-2">
      <p className="text-zinc-300 font-sans leading-relaxed text-xs sm:text-sm">
        {project.description}
      </p>
    </div>

    <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
      <div className="flex flex-wrap gap-2.5 md:gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenDemo(project)
          }}
          className="px-4 md:px-5 py-2 md:py-2.5 bg-white text-black font-heading uppercase hover:bg-pink-400 hover:text-black transition-colors text-xs sm:text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          Explore Demo
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenRepo(project)
          }}
          className="px-4 md:px-5 py-2 md:py-2.5 border-2 border-zinc-700 text-white font-heading uppercase hover:bg-white/10 hover:border-white transition-colors text-xs sm:text-sm cursor-pointer"
        >
          View Source
        </button>
      </div>

      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
        CLICK CARD TO FLIP
      </span>
    </div>
  </div>
)

const ProjectCardBack = ({ project, onFlip, isFlipped }) => (
  <div
    className={`absolute inset-0 w-full h-full bg-zinc-950/95 border-l-4 border-orange-500 p-5 sm:p-7 md:p-9 flex flex-col justify-between shrink-0 overflow-hidden shadow-[inset_0_0_24px_rgba(251,146,60,0.18)] ${
      isFlipped ? 'pointer-events-auto z-20' : 'pointer-events-none z-10'
    }`}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateY(180deg) translateZ(1px)',
    }}
  >
    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-500/80" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-500/80" />

    <div className="flex items-center justify-between gap-3 mb-2 border-b border-zinc-800 pb-2 shrink-0">
      <span className="font-mono text-[10px] tracking-widest text-orange-400 uppercase">
        TELEMETRY // SPECIFICATIONS
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onFlip()
        }}
        className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 hover:text-orange-400 tracking-wider transition-colors uppercase cursor-pointer"
      >
        <span className="text-orange-400">↩</span>
        <span>RETURN TO OVERVIEW</span>
      </button>
    </div>

    <div className="overflow-y-auto no-scrollbar min-h-0 flex-1 space-y-3 pr-1 mb-2">
      <div>
        <h4 className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
          Stack Architecture
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-pink-300 font-mono text-[10px] tracking-tight"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {project.highlights && project.highlights.length > 0 && (
        <div>
          <h4 className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
            Engineering Highlights
          </h4>
          <ul className="space-y-1">
            {project.highlights.map((item, idx) => (
              <li key={idx} className="font-sans text-xs text-zinc-300 flex items-start gap-1.5">
                <span className="text-orange-400 font-mono text-[10px] mt-0.5">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {project.metrics && (
      <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
        {Object.entries(project.metrics).map(([key, val]) => (
          <div key={key} className="bg-zinc-950/80 border border-zinc-800 p-2">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-400 truncate">
              {key}
            </span>
            <span className="block font-mono text-xs sm:text-sm font-bold text-amber-400 truncate">
              {val}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)

const ProjectCard = ({ project, onOpenDemo, onOpenRepo }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const toggleFlip = () => setIsFlipped((prev) => !prev)

  return (
    <div className="w-[100vw] h-full flex items-center justify-center px-4 sm:px-8 lg:px-20 shrink-0">
      <div
        className="project-card w-full max-w-2xl md:max-w-3xl h-full max-h-[clamp(260px,48vh,420px)] cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={toggleFlip}
        role="region"
        aria-label={`Project card for ${project.title}`}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <ProjectCardFront
            project={project}
            onOpenDemo={onOpenDemo}
            onOpenRepo={onOpenRepo}
            onFlip={toggleFlip}
            isFlipped={isFlipped}
          />
          <ProjectCardBack
            project={project}
            onFlip={toggleFlip}
            isFlipped={isFlipped}
          />
        </motion.div>
      </div>
    </div>
  )
}

const ScrollDownIndicator = () => (
  <div
    className="absolute bottom-16 md:bottom-[84px] left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
    aria-hidden="true"
  >
    <div className="w-5 h-8 border-2 border-zinc-400 rounded-full flex justify-center pt-1.5">
      <div className="w-1 h-2 bg-pink-400 rounded-full animate-bounce" />
    </div>
    <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase">
      SCROLL DOWN
    </span>
  </div>
)

const restoreScrollPosition = () => {
  try {
    const savedY = sessionStorage.getItem('returnScrollY')
    if (savedY !== null) {
      sessionStorage.removeItem('returnScrollY')
      const targetY = parseFloat(savedY)
      if (!Number.isNaN(targetY)) {
        window.scrollTo(0, targetY)
        window.lenis?.scrollTo(targetY, { immediate: true })
      }
    }
  } catch {
    // Storage access unavailable
  }
}

const Projects = ({ projectFrames = [], onModalStateChange }) => {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const titleRef = useRef(null)

  const [demoState, setDemoState] = useState({ open: false, variantId: null, title: '' })
  const [repoState, setRepoState] = useState({ open: false, title: null })

  const isReady = projectFrames && projectFrames.length > 0

  useEffect(() => {
    onModalStateChange?.(Boolean(demoState.open || repoState.open))
  }, [demoState.open, repoState.open, onModalStateChange])

  useEffect(() => {
    if (!isReady) return

    const canvas = document.getElementById('projects-canvas')
    const context = canvas ? canvas.getContext('2d') : null

    const frames = { frame: 0 }
    const frameCount = projectFrames.length

    const render = () => {
      if (!canvas || !context) return
      const img = projectFrames[Math.round(frames.frame)] || projectFrames[0]
      drawCanvasFrame(canvas, context, img)
    }

    const handleResize = () => syncCanvasDimensions(canvas, render)
    handleResize()

    const ro = new ResizeObserver(handleResize)
    if (containerRef.current) ro.observe(containerRef.current)

    const ctx = gsap.context(() => {
      const total = PROJECTS.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=1000%',
          scrub: 1.5,
          invalidateOnRefresh: true,
          onEnter: () => playSubBassCue(),
        },
      })

      gsap.set('.projects-content', { opacity: 0, y: 30 })
      tl.to('.projects-content', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0)
      tl.to(titleRef.current, { scale: 1.1, ease: 'none', duration: total }, 0.5)

      tl.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        duration: total,
      }, 0.5)

      if (canvas && context) {
        render()

        tl.to(frames, {
          frame: frameCount - 1,
          snap: 'frame',
          ease: 'none',
          duration: total + 0.5,
          onUpdate: render,
        }, 0)
      }

      const cards = gsap.utils.toArray('.project-card')
      cards.forEach((card, i) => {
        if (i > 0) {
          gsap.set(card, { scale: 0.85, opacity: 0.3 })
          tl.to(card, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, i - 1)
        }
        if (i < total - 1) {
          tl.to(card, { scale: 0.85, opacity: 0.3, duration: 1, ease: 'power2.in' }, i + 0.5)
        }
      })
    }, containerRef)

    setTimeout(() => {
      ScrollTrigger.refresh()
      window.lenis?.resize()
      restoreScrollPosition()
    }, 120)

    return () => {
      ro.disconnect()
      ctx.revert()
    }
  }, [isReady, projectFrames])

  const handleOpenDemo = (project) => {
    trackEvent('interaction', 'project_demo_open', { projectId: project.id })
    if (project.demoKind === 'download-aura') {
      try {
        sessionStorage.setItem('returnScrollY', String(window.scrollY))
      } catch {
        // Storage access unavailable
      }
      window.lenis?.stop()
      window.location.hash = `#/downloads/${project.downloadSlug || 'aura'}`
    } else {
      setDemoState({ open: true, variantId: project.demoKind, title: project.title })
    }
  }

  const handleOpenRepo = (project) => {
    trackEvent('interaction', 'project_repo_open', { projectId: project.id })
    if (project.id === 'subq-audio-engine') {
      window.open(project.github, '_blank', 'noopener,noreferrer')
    } else {
      setRepoState({ open: true, title: project.title })
    }
  }

  return (
    <>
      <section ref={containerRef} id="projects" className="relative w-full h-[100svh] md:h-[100dvh] bg-app-dark overflow-hidden">
        <canvas
          id="projects-canvas"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" aria-hidden="true" />

        <div className="projects-content relative z-10 w-full h-full pt-4 md:pt-8 pb-28 md:pb-32 overflow-hidden flex flex-col justify-between">
          <div ref={titleRef} className="text-center origin-top px-4 sm:px-6 flex-shrink-0">
            <SectionHeader
              index={PROJECTS_META.index}
              category={PROJECTS_META.category}
              title={PROJECTS_META.title}
              subtitle={PROJECTS_META.subtitle}
            />
          </div>

          <div
            ref={trackRef}
            className="flex-1 min-h-0 w-full flex items-center overflow-visible no-scrollbar flex-nowrap"
          >
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDemo={handleOpenDemo}
                onOpenRepo={handleOpenRepo}
              />
            ))}
          </div>
        </div>

        <ScrollDownIndicator />
      </section>

      <DemoModal
        isOpen={demoState.open}
        onClose={() => setDemoState({ ...demoState, open: false })}
        variantId={demoState.variantId}
        projectTitle={demoState.title}
      />
      <PrivateRepoModal
        isOpen={repoState.open}
        onClose={() => setRepoState({ ...repoState, open: false })}
        projectTitle={repoState.title}
      />
    </>
  )
}

export default Projects
