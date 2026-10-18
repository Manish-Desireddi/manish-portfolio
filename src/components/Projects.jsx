import React, { useRef, useState, useEffect } from 'react'
import { PROJECTS, PROJECTS_META } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import PrivateRepoModal from './PrivateRepoModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playSubBassCue } from '../utils/audioContext'
import { isReducedMotion } from '../utils/motionVariants'
import { syncCanvasBackingStore, drawAspectFillFrame } from '../utils/canvasScrubber'
import { trackEvent } from '../utils/analytics'

gsap.registerPlugin(ScrollTrigger)

const ProjectCard = ({ project, onOpenDemo, onOpenRepo }) => (
  <div className="w-[100vw] h-full flex items-center justify-center px-4 sm:px-8 lg:px-20 shrink-0">
    <div className="project-card w-full max-w-5xl flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 max-h-[85vh] md:max-h-[70vh] overflow-y-auto md:overflow-visible no-scrollbar">
      <div className="md:col-span-7 bg-black/80 border-l-4 border-pink-500 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between shrink-0 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(217,70,239,0.15)]">
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-pink-500/80" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-pink-500/80" />

        <div>
          <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-tighter text-white mb-2 group-hover:text-pink-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-zinc-300 font-sans leading-relaxed text-xs sm:text-sm mb-6">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => onOpenDemo(project)}
            className="px-5 py-2.5 bg-white text-black font-heading uppercase hover:bg-pink-400 hover:text-black transition-colors text-xs sm:text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            Explore Demo
          </button>
          <button
            type="button"
            onClick={() => onOpenRepo(project)}
            className="px-5 py-2.5 border-2 border-zinc-700 text-white font-heading uppercase hover:bg-white/10 hover:border-white transition-colors text-xs sm:text-sm"
          >
            View Source
          </button>
        </div>
      </div>

      <div className="md:col-span-5 flex flex-col gap-3 justify-center">
        <div className="bg-black/75 border border-zinc-800 p-4 sm:p-5 flex items-center gap-4 hover:border-pink-400 transition-colors backdrop-blur-xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center font-heading text-pink-400 text-lg sm:text-xl border border-pink-500/30 shrink-0">
            01
          </div>
          <div className="min-w-0">
            <h4 className="font-oswald uppercase text-white tracking-widest text-xs sm:text-sm">Built With</h4>
            <p className="text-pink-200/80 text-xs font-mono mt-0.5 truncate">{project.tags.slice(0, 3).join(' // ')}</p>
          </div>
        </div>

        <div className="bg-black/75 border border-zinc-800 p-4 sm:p-5 flex items-center gap-4 hover:border-orange-400 transition-colors backdrop-blur-xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center font-heading text-orange-400 text-lg sm:text-xl border border-orange-500/30 shrink-0">
            02
          </div>
          <div className="min-w-0">
            <h4 className="font-oswald uppercase text-white tracking-widest text-xs sm:text-sm">Key Highlight</h4>
            <p className="text-orange-200/80 text-xs font-mono mt-0.5 truncate">{project.highlights[0]}</p>
          </div>
        </div>

        {project.metrics && (
          <div className="bg-black/75 border border-zinc-800 p-4 sm:p-5 flex items-center gap-4 hover:border-amber-400 transition-colors backdrop-blur-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center font-heading text-amber-400 text-lg sm:text-xl border border-amber-500/30 shrink-0">
              03
            </div>
            <div className="min-w-0">
              <h4 className="font-oswald uppercase text-white tracking-widest text-xs sm:text-sm">Telemetry</h4>
              <p className="text-amber-200/80 text-xs font-mono mt-0.5 truncate">
                {Object.entries(project.metrics).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' | ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)

const restorePersistedScroll = () => {
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

  const [demoState, setDemoState] = useState({ open: false, variantId: null })
  const [repoState, setRepoState] = useState({ open: false, title: null })

  const isReady = projectFrames && projectFrames.length > 0

  useEffect(() => {
    onModalStateChange?.(Boolean(demoState.open || repoState.open))
  }, [demoState.open, repoState.open, onModalStateChange])

  useEffect(() => {
    if (!isReady) return

    const canvas = document.getElementById('projects-canvas')
    const context = canvas ? canvas.getContext('2d') : null

    const handleResize = () => syncCanvasBackingStore(canvas)
    handleResize()

    const ro = new ResizeObserver(handleResize)
    if (containerRef.current) ro.observe(containerRef.current)

    const ctx = gsap.context(() => {
      const total = PROJECTS.length
      const frames = { frame: 0 }
      const frameCount = projectFrames.length

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
        const render = () => {
          const img = projectFrames[Math.round(frames.frame)] || projectFrames[0]
          drawAspectFillFrame(canvas, context, img)
        }

        render()

        if (!isReducedMotion()) {
          tl.to(frames, {
            frame: frameCount - 1,
            snap: 'frame',
            ease: 'none',
            duration: total + 0.5,
            onUpdate: render,
          }, 0)
        }
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
      restorePersistedScroll()
    }, 120)

    return () => {
      ro.disconnect()
      ctx.revert()
    }
  }, [isReady, projectFrames])

  const handleOpenDemo = (project) => {
    trackEvent('interaction', 'project_demo_open', { projectId: project.id })
    if (project.demoKind === 'download-cloud') {
      try {
        sessionStorage.setItem('returnScrollY', String(window.scrollY))
      } catch {
        // Storage access unavailable
      }
      window.lenis?.stop()
      window.location.hash = `#/downloads/${project.downloadSlug || 'aura'}`
    } else {
      setDemoState({ open: true, variantId: project.demoKind })
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
      <section ref={containerRef} id="projects" className="relative w-full h-[100dvh] bg-app-dark overflow-hidden">
        <canvas
          id="projects-canvas"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" aria-hidden="true" />

        <div className="projects-content relative z-10 w-full h-full pt-16 md:pt-24 pb-6 md:pb-12 overflow-hidden flex flex-col justify-between">
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
            className="flex h-full flex-grow items-center mt-4 md:mt-8 overflow-visible no-scrollbar flex-nowrap"
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
      </section>

      <DemoModal
        isOpen={demoState.open}
        onClose={() => setDemoState({ ...demoState, open: false })}
        variantId={demoState.variantId}
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
