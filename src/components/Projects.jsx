import React, { useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { PROJECTS } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import DemoModal from './DemoModal'
import AnimatedBackground from './AnimatedBackground'

// Accent palettes keyed by project.accent
const ACCENT = {
  cyan: {
    tag:    'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
    glow:   'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.45)',
  },
  violet: {
    tag:    'bg-violet-400/10 text-violet-300 border-violet-400/20',
    glow:   'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.45)',
  },
  indigo: {
    tag:    'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',
    glow:   'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.45)',
  },
}

const TILT_SPRING = { damping: 22, stiffness: 220 }
const GLOW_SPRING = { damping: 24, stiffness: 200 }

/**
 * Project card with GPU-friendly 3D tilt effect driven entirely by MotionValues.
 * Mouse position is normalized to [-0.5, 0.5] and mapped to rotateX/Y.
 * No React state is involved — zero extra re-renders on mouse move.
 */
const ProjectCard = React.memo(({ project, index, onDemoClick }) => {
  const cardRef = useRef(null)
  const palette = ACCENT[project.accent] ?? ACCENT.cyan

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-9, 9]),  TILT_SPRING)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]),  TILT_SPRING)

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
    rawX.set(0)
    rawY.set(0)
    glowOpacity.set(0)
  }, [rawX, rawY, glowOpacity])

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative rounded-2xl bg-zinc-900/60 border border-white/8 backdrop-blur-sm overflow-hidden transition-[border-color] duration-300 hover:border-white/18"
      aria-label={project.title}
    >
      {/* Radial glow follows cursor into card */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          opacity: springGlow,
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${palette.glow} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-7 flex flex-col h-full">
        {/* Card number + action links */}
        <div className="flex items-start justify-between mb-5">
          <span className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-[11px] font-mono text-zinc-500 shrink-0">
            0{index + 1}
          </span>

          <div className="flex gap-2">
            <a
              href={project.github}
              aria-label={`View ${project.title} source on GitHub`}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 hover:border-white/25 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              <Github size={12} aria-hidden="true" />
              GitHub
            </a>
            <button
              type="button"
              onClick={() => onDemoClick(project.id)}
              aria-label={`View demo info for ${project.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 hover:border-white/25 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              <ExternalLink size={12} aria-hidden="true" />
              Demo
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-snug">{project.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{project.description}</p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
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
  const [modalOpen, setModalOpen] = useState(false)

  const handleDemoClick = useCallback(() => setModalOpen(true), [])
  const handleModalClose = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <section id="projects" className="relative py-28 px-6 overflow-hidden bg-zinc-950">
        <AnimatedBackground variant="projects" showGrid={true} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="03 // Projects"
            title="What I've built."
            subtitle="AI-first engineering across generative models, automation, and intelligent systems."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onDemoClick={handleDemoClick}
              />
            ))}
          </div>
        </div>
      </section>

      <DemoModal isOpen={modalOpen} onClose={handleModalClose} />
    </>
  )
}

export default Projects
