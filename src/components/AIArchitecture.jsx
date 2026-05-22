import React, { memo } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import AnimatedBackground from './AnimatedBackground'

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

const SystemCard = memo(({ system, index }) => {
  const { dot, badge, glow } = ACCENT_MAP[system.accent]

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      className="relative group rounded-2xl border border-white/8 bg-zinc-900/40 p-7 overflow-hidden hover:border-white/16 transition-colors duration-300"
    >
      {/* Per-card accent glow on hover — GPU composited, no layout cost */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${glow} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className={`w-2 h-2 rounded-full ${dot} mt-1.5 shrink-0`} aria-hidden="true" />
          <span className="text-[10px] font-mono text-zinc-700 tracking-wider">{system.label}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-3 leading-snug">{system.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{system.body}</p>

        <div className="flex flex-wrap gap-1.5">
          {system.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border ${badge}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
})
SystemCard.displayName = 'SystemCard'

const AIArchitecture = () => (
  <section id="architecture" className="relative py-28 px-6 overflow-hidden bg-zinc-950">
    <AnimatedBackground variant="architecture" showGrid={true} />

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
