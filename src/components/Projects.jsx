import React, { useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Download, ChevronDown } from 'lucide-react'
import { PROJECTS } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import PrivateRepoModal from './PrivateRepoModal'

const ACCENT = {
  cyan:    { tag: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',       glow: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)',   metric: 'text-cyan-400'    },
  violet:  { tag: 'bg-violet-400/10 text-violet-300 border-violet-400/20', glow: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.35)',  metric: 'text-violet-400'  },
  indigo:  { tag: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20', glow: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.35)',  metric: 'text-indigo-400'  },
  emerald: { tag: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20', glow: 'rgba(52,211,153,0.17)', border: 'rgba(52,211,153,0.35)', metric: 'text-emerald-400' },
}

const TILT_SPRING = { damping: 22, stiffness: 220 }
const GLOW_SPRING = { damping: 24, stiffness: 200 }

const ProjectCard = React.memo(({ project, index, onDemoClick, onGithubClick }) => {
  const cardRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const palette = ACCENT[project.accent] ?? ACCENT.cyan

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), TILT_SPRING)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), TILT_SPRING)

  const glowOpacity = useMotionValue(0)
  const springGlow  = useSpring(glowOpacity, GLOW_SPRING)

  const onMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return
      const { left, top, width, height } = cardRef.current.getBoundingClientRect()
      rawX.set((e.clientX - left) / width  - 0.5)
      rawY.set((e.clientY - top)  / height - 0.5)
    },
    [rawX, rawY],
  )

  const onMouseEnter = useCallback(() => glowOpacity.set(1), [glowOpacity])
  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); glowOpacity.set(0)
  }, [rawX, rawY, glowOpacity])

  const isDownload = project.demoKind === 'download-cloud'
  const DemoIcon   = isDownload ? Download : ExternalLink
  const demoLabel  = isDownload ? 'Download' : 'Demo'

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative rounded-2xl overflow-hidden transition-all duration-500"
      aria-label={project.title}
    >
      {/* Frosted glass layer */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          opacity: springGlow,
          boxShadow: `inset 0 0 0 1px ${palette.border}, 0 0 40px ${palette.glow}, 0 0 80px ${palette.glow}`,
        }}
        aria-hidden="true"
      />

      {/* Resting border */}
      <div className="absolute inset-0 rounded-2xl border border-white/8 pointer-events-none" />

      {/* Accent glow orb */}
      <motion.div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
        style={{
          opacity: springGlow,
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 65%)`,
          filter: 'blur(30px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-7 flex flex-col h-full min-h-[340px]">
        <div className="flex items-start justify-between mb-5">
          <span
            className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[11px] font-mono shrink-0"
            style={{ color: palette.border, background: palette.glow }}
          >
            0{index + 1}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onGithubClick(project)}
              aria-label={`View ${project.title} repository status`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 bg-white/5 hover:border-white/25 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              <Github size={12} aria-hidden="true" />
              GitHub
            </button>
            <button
              type="button"
              onClick={() => onDemoClick(project)}
              aria-label={`${demoLabel} for ${project.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 bg-white/5 hover:border-white/25 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              <DemoIcon size={12} aria-hidden="true" />
              {demoLabel}
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-snug">{project.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">{project.description}</p>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors mb-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
          aria-expanded={expanded}
        >
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={14} />
          </motion.span>
          {expanded ? 'less' : 'more details'}
        </button>

        {/* Expanded section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              {project.metrics && (
                <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-white/8">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center px-3">
                      <span className={`text-sm font-bold font-mono ${palette.metric}`}>{value}</span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{key}</span>
                    </div>
                  ))}
                </div>
              )}
              {project.highlights && (
                <ul className="space-y-2 mb-4">
                  {project.highlights.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: palette.border }} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags pinned to bottom */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-1 rounded-md text-xs font-mono border ${palette.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
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
