import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Download } from 'lucide-react'
import { PROJECTS } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import PrivateRepoModal from './PrivateRepoModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const containerRef = useRef(null)
  const stickyRef = useRef(null)
  const trackRef = useRef(null)
  const titleRef = useRef(null)
  const audioRef = useRef(null)
  const imagesRef = useRef([])

  const [demoState, setDemoState] = useState({ open: false, variantId: null })
  const [repoState, setRepoState] = useState({ open: false, title: null })
  const [isAllLoaded, setIsAllLoaded] = useState(false)

  // Sub-bass audio cue
  useEffect(() => {
    audioRef.current = {
      play: () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext
          if (!AudioContext) return
          const ctx = new AudioContext()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(45, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.5)
          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 1.5)
        } catch (e) { }
      }
    }
  }, [])

  // Synchronous frame loader
  useEffect(() => {
    let isCancelled = false
    const frameCount = 600
    imagesRef.current = Array(frameCount).fill(null)

    const fetchAll = async () => {
      const promises = []
      for (let i = 0; i < frameCount; i++) {
        const img = new Image()
        const promise = fetch(`/assets/projects_frames/frame_${(i + 1).toString().padStart(4, '0')}.jpg`)
          .then(res => res.blob())
          .then(blob => new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
            img.src = URL.createObjectURL(blob)
          }))
          .catch(() => Promise.resolve())
        imagesRef.current[i] = img
        promises.push(promise)

      }

      await Promise.all(promises)
      if (!isCancelled) setIsAllLoaded(true)
    }

    fetchAll()

    return () => { isCancelled = true }
  }, [])

  // Timeline instantiation
  useEffect(() => {
    if (!isAllLoaded) return

    let ctx = gsap.context(() => {
      const total = PROJECTS.length
      const frames = { frame: 0 }
      const frameCount = 600

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=1000%',
          scrub: 1.5,
          invalidateOnRefresh: true,
          onEnter: () => audioRef.current?.play()
        }
      })

      gsap.set('.projects-content', { opacity: 0, y: 30 })
      tl.to('.projects-content', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0)
      tl.to(titleRef.current, { scale: 1.15, ease: 'none', duration: total }, 0.5)

      // Measure true scroll width dynamically
      tl.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        duration: total
      }, 0.5)

      const canvas = document.getElementById('projects-canvas')
      if (canvas) {
        const context = canvas.getContext('2d')
        canvas.width = 1920
        canvas.height = 1080

        const render = () => {
          const img = imagesRef.current[Math.round(frames.frame)]
          if (img && img.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(img, 0, 0, canvas.width, canvas.height)
          }
        }

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
          gsap.set(card, { scale: 0.8, opacity: 0.2 })
          tl.to(card, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, i - 1)
        }
        if (i < total - 1) {
          tl.to(card, { scale: 0.8, opacity: 0.2, duration: 1, ease: 'power2.in' }, i + 0.5)
        }
      })
    }, containerRef)

    // Force Lenis and ScrollTrigger to sync dimensions after building timeline
    setTimeout(() => {
      ScrollTrigger.refresh()
      window.lenis?.resize()
    }, 100)

    return () => {
      if (ctx) ctx.revert()
    }
  }, [isAllLoaded])

  return (
    <>
      <section ref={containerRef} id="projects" className="relative w-full h-[100dvh] bg-app-dark">
        <canvas id="projects-canvas" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

        <div className="projects-content relative z-10 w-full h-full pt-16 md:pt-32 pb-4 md:pb-12 overflow-hidden flex flex-col justify-between">
            <div ref={titleRef} className="text-center origin-top px-6 flex-shrink-0">
              <SectionHeader
                eyebrow={`SYS.LOG // Projects`}
                title={`ENGINEERED TO SCALE`}
                subtitle="> High-performance AI pipelines & autonomous systems."
              />
            </div>

            <div
              ref={trackRef}
              className="flex h-full flex-grow items-center mt-6 md:mt-12 overflow-visible no-scrollbar flex-nowrap"
            >
              {PROJECTS.map((project) => (
                <div key={project.id} className="w-[100vw] h-full flex items-center justify-center px-6 lg:px-24 shrink-0">
                  <div className="project-card w-full max-w-6xl flex flex-col-reverse justify-end md:justify-start md:grid md:grid-cols-2 gap-4 md:gap-16 max-h-[85vh] md:max-h-[65vh] overflow-y-auto overflow-x-hidden md:overflow-hidden no-scrollbar" data-lenis-prevent="true">
                    <div className="bg-black/60 border-l-4 border-pink-500/80 p-6 md:p-8 shadow-[inset_0_0_20px_rgba(217,70,239,0.15)] backdrop-blur-xl flex flex-col h-auto md:h-full shrink-0 snap-start relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500/80" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/80" />

                      <h3 className="font-heading text-3xl md:text-4xl uppercase tracking-tighter text-white mb-2 shrink-0 group-hover:text-pink-400 transition-colors">{project.title}</h3>
                      <div className="text-zinc-300 font-sans leading-relaxed mb-6 md:mb-8 text-sm md:text-base relative z-10 overflow-y-auto flex-grow min-h-0 no-scrollbar pb-2">
                        {project.description}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-zinc-700/50 md:border-t-0 md:pt-0 shrink-0">
                        <button
                          onClick={() => {
                            if (project.demoKind === 'download-cloud') window.location.hash = '#/downloads/ai-assistant'
                            else setDemoState({ open: true, variantId: project.demoKind })
                          }}
                          className="px-4 py-2 md:px-6 md:py-3 bg-white text-black font-heading uppercase hover:bg-pink-400 hover:text-black transition-colors text-sm md:text-base shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.6)]"
                        >
                          Explore Demo
                        </button>
                        <button
                          onClick={() => {
                            if (project.id === 'subq-audio-engine') window.open(project.github, '_blank', 'noopener,noreferrer');
                            else setRepoState({ open: true, title: project.title });
                          }}
                          className="px-4 py-2 md:px-6 md:py-3 border-2 border-zinc-600/80 text-white font-heading uppercase hover:bg-white/10 hover:border-white transition-colors text-sm md:text-base"
                        >
                          View Source
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 md:gap-4 justify-start shrink-0 pb-8 md:pb-0 h-auto md:h-full w-full overflow-x-auto md:overflow-y-auto md:overflow-x-hidden no-scrollbar snap-x snap-mandatory" data-lenis-prevent="true">
                      <div className="w-[85vw] md:w-auto bg-black/60 border border-zinc-700/50 p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:border-pink-400 transition-colors backdrop-blur-xl snap-center shrink-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-black/80 flex items-center justify-center font-heading text-pink-400 text-xl md:text-2xl border border-pink-500/30 shrink-0">01</div>
                        <div>
                          <h4 className="font-oswald uppercase text-white tracking-widest text-base md:text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Built With</h4>
                          <p className="text-pink-100/70 text-xs md:text-sm font-mono mt-1 whitespace-normal break-words">{project.tags.slice(0, 3).join(' // ')}</p>
                        </div>
                      </div>

                      <div className="w-[85vw] md:w-auto bg-black/60 border border-zinc-700/50 p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:border-orange-400 transition-colors backdrop-blur-xl snap-center shrink-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-black/80 flex items-center justify-center font-heading text-orange-400 text-xl md:text-2xl border border-orange-500/30 shrink-0">02</div>
                        <div>
                          <h4 className="font-oswald uppercase text-white tracking-widest text-base md:text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Key Feature</h4>
                          <p className="text-orange-100/70 text-xs md:text-sm font-mono mt-1 whitespace-normal break-words">{project.highlights[0]}</p>
                        </div>
                      </div>

                      {project.metrics && (
                        <div className="w-[85vw] md:w-auto bg-black/60 border border-zinc-700/50 p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:border-amber-400 transition-colors backdrop-blur-xl snap-center shrink-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-black/80 flex items-center justify-center font-heading text-amber-400 text-xl md:text-2xl border border-amber-500/30 shrink-0">03</div>
                          <div>
                            <h4 className="font-oswald uppercase text-white tracking-widest text-base md:text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Metrics</h4>
                            <p className="text-amber-100/70 text-xs md:text-sm font-mono mt-1 whitespace-normal break-words">
                              {Object.entries(project.metrics).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' | ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      <DemoModal isOpen={demoState.open} onClose={() => setDemoState({ ...demoState, open: false })} variantId={demoState.variantId} />
      <PrivateRepoModal isOpen={repoState.open} onClose={() => setRepoState({ ...repoState, open: false })} projectTitle={repoState.title} />
    </>
  )
}

export default Projects
