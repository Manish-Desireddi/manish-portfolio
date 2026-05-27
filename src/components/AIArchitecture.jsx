import React, { memo, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import SectionHeader from './SectionHeader'

// Static data — defined outside component to prevent recreation on re-renders
const SYSTEMS = [
  {
    id:      'generative',
    label:   '01',
    title:   'Generative AI Pipelines',
    body:    'Fine-tuned LLMs (Mistral-7B, Llama-3) with LoRA and QLoRA adapters for domain-specific tasks. Text-to-3D generation over ShapeNet with GAN-based geometry modelling and FAISS-powered RAG for retrieval context injection.',
    tags:    ['LoRA / QLoRA', 'GANs', 'Text-to-3D', 'FAISS RAG'],
    accent:  'cyan',
  },
  {
    id:      'agentic',
    label:   '02',
    title:   'Agentic Automation Systems',
    body:    'Multi-step autonomous pipelines built on local LLMs with real-time voice input via Distil-Whisper. RabbitMQ dispatches asynchronous task queues — fully offline, zero cloud dependencies, complete data privacy.',
    tags:    ['Agentic AI', 'Distil-Whisper', 'RabbitMQ', 'Local LLM'],
    accent:  'violet',
  },
  {
    id:      'infra',
    label:   '03',
    title:   'Data & Automation Infrastructure',
    body:    'Enterprise-grade Apache Airflow DAG orchestration, event-sourced ESDB ingestion pipelines, Redis caching layers, and Grafana observability dashboards tuned to measurable SLA thresholds.',
    tags:    ['Apache Airflow', 'ESDB', 'Redis', 'Grafana'],
    accent:  'indigo',
  },
  {
    id:      'fullstack',
    label:   '04',
    title:   'AI-Powered Full-Stack Products',
    body:    'React + FastAPI products where AI is the core value: LLM recommendation engines, Celery-backed async inference workers, Redis session management, and streaming model responses with real-time feedback.',
    tags:    ['FastAPI', 'React', 'Celery', 'Streaming AI'],
    accent:  'emerald',
  },
]

const ACCENT_MAP = {
  cyan:    { dot: 'bg-cyan-400',    badge: 'text-cyan-400    border-cyan-400/20    bg-cyan-400/8',    glow: 'rgba(6,182,212,0.10)'   },
  violet:  { dot: 'bg-violet-400',  badge: 'text-violet-400  border-violet-400/20  bg-violet-400/8',  glow: 'rgba(124,58,237,0.10)'  },
  indigo:  { dot: 'bg-indigo-400',  badge: 'text-indigo-400  border-indigo-400/20  bg-indigo-400/8',  glow: 'rgba(99,102,241,0.10)'  },
  emerald: { dot: 'bg-emerald-400', badge: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/8', glow: 'rgba(52,211,153,0.10)'  },
}

const MAGNETIC_SPRING = { damping: 20, stiffness: 180 }

const SystemCard = memo(({ system, index }) => {
  const { dot, badge, glow } = ACCENT_MAP[system.accent]
  const cardRef = useRef(null)

  // Magnetic hover: card subtly follows cursor
  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)
  const springX = useSpring(magnetX, MAGNETIC_SPRING)
  const springY = useSpring(magnetY, MAGNETIC_SPRING)

  const onMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const cx = (e.clientX - left) / width - 0.5
    const cy = (e.clientY - top) / height - 0.5
    magnetX.set(cx * 12)
    magnetY.set(cy * 8)
  }, [magnetX, magnetY])

  const onMouseLeave = useCallback(() => {
    magnetX.set(0)
    magnetY.set(0)
  }, [magnetX, magnetY])

  // Alternating entry: even from left, odd from right
  const fromLeft = index % 2 === 0

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: fromLeft ? -80 : 80, rotate: fromLeft ? -3 : 3 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.75,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative group rounded-2xl border border-white/8 bg-zinc-900/40 p-7 overflow-hidden hover:border-white/16 transition-colors duration-300"
    >
      {/* Accent glow follows cursor via radial gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${glow} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className={`w-2.5 h-2.5 rounded-full ${dot} mt-1.5 shrink-0 group-hover:scale-150 transition-transform duration-300`} aria-hidden="true" />
          <span className="text-[10px] font-mono text-zinc-700 tracking-wider">{system.label}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:translate-x-1 transition-transform duration-300">{system.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{system.body}</p>

        <div className="flex flex-wrap gap-1.5">
          {system.tags.map((tag, tagIdx) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + tagIdx * 0.05 }}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border ${badge}`}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.article>
  )
})
SystemCard.displayName = 'SystemCard'

const AIArchitecture = () => (
  <section id="architecture" className="relative py-28 px-6">
    <div className="relative z-10 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="04 // Architecture"
        title="What I build."
        subtitle="Four pillars of AI engineering — from model fine-tuning to infrastructure operating at scale."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SYSTEMS.map((system, idx) => (
          <SystemCard key={system.id} system={system} index={idx} />
        ))}
      </div>
    </div>
  </section>
)

export default AIArchitecture
