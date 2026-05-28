import React, { useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Download } from 'lucide-react'
import { PROJECTS } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import PrivateRepoModal from './PrivateRepoModal'

const ACCENT = {
  cyan:    { tag: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',       glow: 'rgba(6,182,212,0.18)',   border: 'rgba(6,182,212,0.45)',   metric: 'text-cyan-400',    shimmer: '#22d3ee' },
  violet:  { tag: 'bg-violet-400/10 text-violet-300 border-violet-400/20', glow: 'rgba(139,92,246,0.18)',  border: 'rgba(139,92,246,0.45)',  metric: 'text-violet-400',  shimmer: '#a78bfa' },
  indigo:  { tag: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20', glow: 'rgba(99,102,241,0.18)',  border: 'rgba(99,102,241,0.45)',  metric: 'text-indigo-400',  shimmer: '#818cf8' },
  emerald: { tag: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20', glow: 'rgba(52,211,153,0.20)', border: 'rgba(52,211,153,0.45)', metric: 'text-emerald-400', shimmer: '#34d399' },
}

const TILT_SPRING = { damping: 20, stiffness: 260 }

const ProjectCard = React.memo(({ project, index, onDemoClick, onGithubClick }) => {
  const cardRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const palette = ACCENT[project.accent] ?? ACCENT.cyan

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), TILT_SPRING)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), TILT_SPRING)

  // Shimmer position tracks cursor for holographic effect
  const shimmerX = useMotionValue(50)
  const shimmerY = useMotionValue(50)

  const onMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return
      const { left, top, width, height } = cardRef.current.getBoundingClientRect()
      const nx = (e.clientX - left) / width
      const ny = (e.clientY - top) / height
      rawX.set(nx - 0.5)
      rawY.set(ny - 0.5)
      shimmerX.set(nx * 100)
      shimmerY.set(ny * 100)
    },
    [rawX, rawY, shimmerX, shimmerY],
  )

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  const isDownload = project.demoKind === 'download-cloud'
  const DemoIcon = isDownload ? Download : ExternalLink
  const demoLabel = isDownload ? 'Download' : 'Demo'

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => setFlipped((f) => !f)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      aria-label={project.title}
    >
      {/* Holographic shimmer border — follows cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${palette.border}, 0 0 30px ${palette.glow}, 0 0 60px ${palette.glow}`,
        }}
        aria-hidden="true"
      />

      {/* Resting border */}
      <div className="absolute inset-0 rounded-2xl border border-white/8 pointer-events-none z-10" />

      {/* Flip container */}
      <div className="relative w-full" style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait" initial={false}>
          {!flipped ? (
            /* ─── Front face ─── */
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 p-7 flex flex-col"
              style={{ minHeight: 380, backfaceVisibility: 'hidden' }}
            >
              {/* Glass bg */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              />

              {/* Accent orb */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle, ${palette.glow} 0%, transparent 65%)`,
                  filter: 'blur(25px)',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col h-full" style={{ minHeight: 330 }}>
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[11px] font-mono shrink-0"
                    style={{ color: palette.border, background: palette.glow }}
                  >
                    0{index + 1}
                  </span>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onGithubClick(project)}
                      aria-label={`View ${project.title} repository`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 bg-white/5 hover:border-white/25 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <Github size={12} aria-hidden="true" />
                      GitHub
                    </button>
                    <button
                      type="button"
                      onClick={() => onDemoClick(project)}
                      aria-label={`${demoLabel} for ${project.title}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 bg-white/5 hover:border-white/25 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <DemoIcon size={12} aria-hidden="true" />
                      {demoLabel}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{project.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-3">{project.description}</p>

                {/* Tags pinned at bottom */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className={`px-2.5 py-1 rounded-md text-xs font-mono border ${palette.tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] font-mono text-zinc-600 mt-4 text-center tracking-wider select-none">
                  click to flip · details →
                </p>
              </div>
            </motion.div>
          ) : (
            /* ─── Back face — metrics + highlights ─── */
            <motion.div
              key="back"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 p-7 flex flex-col"
              style={{ minHeight: 380, backfaceVisibility: 'hidden' }}
            >
              {/* Glass bg */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              />

              <div className="relative z-10 flex flex-col h-full" style={{ minHeight: 330 }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white leading-snug">{project.title}</h3>
                  <span className="text-[10px] font-mono text-zinc-500 tracking-wider select-none">← flip back</span>
                </div>

                {/* Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-6 pb-5 border-b border-white/8">
                    {Object.entries(project.metrics).map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="flex flex-col items-center"
                      >
                        <span className={`text-xl font-bold font-mono ${palette.metric}`}>{value}</span>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mt-1">{key}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {project.highlights && (
                  <ul className="space-y-3 flex-1">
                    {project.highlights.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-3 text-sm text-zinc-300"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: palette.border }} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Buttons on back face */}
                <div className="flex gap-3 mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onGithubClick(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-zinc-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    <Github size={13} aria-hidden="true" />
                    Source
                  </button>
                  <button
                    type="button"
                    onClick={() => onDemoClick(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200"
                    style={{ borderColor: palette.border, color: palette.shimmer, background: palette.glow }}
                  >
                    <DemoIcon size={13} aria-hidden="true" />
                    {demoLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
})

ProjectCard.displayName = 'ProjectCard'

const Projects = () => {
  const [demoState, setDemoState] = useState({ open: false, variantId: null })
  const [repoState, setRepoState] = useState({ open: false, title: null })

  const handleDemoClick = useCallback((project) => {
    if (project.demoKind === 'download-cloud') {
      window.location.hash = '#/downloads/ai-assistant'
      return
    }
    setDemoState({ open: true, variantId: project.demoKind })
  }, [])

  const handleGithubClick = useCallback((project) => {
    setRepoState({ open: true, title: project.title })
  }, [])

  const closeDemo = useCallback(() => setDemoState((s) => ({ ...s, open: false })), [])
  const closeRepo = useCallback(() => setRepoState((s) => ({ ...s, open: false })), [])

  return (
    <>
      <section id="projects" className="relative py-28 px-6">
        <div className="relative z-10 max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="03 // Projects"
            title="What I've built."
            subtitle="AI-first engineering across generative models, automation, and intelligent systems."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onDemoClick={handleDemoClick}
                onGithubClick={handleGithubClick}
              />
            ))}
          </div>
        </div>
      </section>

      <DemoModal isOpen={demoState.open} onClose={closeDemo} variantId={demoState.variantId} />
      <PrivateRepoModal isOpen={repoState.open} onClose={closeRepo} projectTitle={repoState.title} />
    </>
  )
}

export default Projects
