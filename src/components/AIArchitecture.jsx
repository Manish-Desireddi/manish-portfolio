import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionHeader from './SectionHeader'

const SYSTEMS = [
  {
    id:     'generative',
    label:  '01',
    title:  'Generative AI Pipelines',
    body:   'Fine-tuned LLMs (Mistral-7B, Llama-3) with LoRA and QLoRA adapters for domain-specific tasks. Text-to-3D generation over ShapeNet with GAN-based geometry modelling and FAISS-powered RAG for retrieval context injection.',
    tags:   ['LoRA / QLoRA', 'GANs', 'Text-to-3D', 'FAISS RAG'],
    accent: 'cyan',
  },
  {
    id:     'agentic',
    label:  '02',
    title:  'Agentic Automation Systems',
    body:   'Multi-step autonomous pipelines built on local LLMs with real-time voice input via Distil-Whisper. RabbitMQ dispatches asynchronous task queues — fully offline, zero cloud dependencies, complete data privacy.',
    tags:   ['Agentic AI', 'Distil-Whisper', 'RabbitMQ', 'Local LLM'],
    accent: 'violet',
  },
  {
    id:     'infra',
    label:  '03',
    title:  'Data & Automation Infrastructure',
    body:   'Enterprise-grade Apache Airflow DAG orchestration, event-sourced ESDB ingestion pipelines, Redis caching layers, and Grafana observability dashboards tuned to measurable SLA thresholds.',
    tags:   ['Apache Airflow', 'ESDB', 'Redis', 'Grafana'],
    accent: 'indigo',
  },
  {
    id:     'fullstack',
    label:  '04',
    title:  'AI-Powered Full-Stack Products',
    body:   'React + FastAPI products where AI is the core value: LLM recommendation engines, Celery-backed async inference workers, Redis session management, and streaming model responses with real-time feedback.',
    tags:   ['FastAPI', 'React', 'Celery', 'Streaming AI'],
    accent: 'emerald',
  },
]

const ACCENT_MAP = {
  cyan:    { dot: 'bg-cyan-400',    badge: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/8',    border: '#22d3ee', glow: 'rgba(6,182,212,0.12)' },
  violet:  { dot: 'bg-violet-400',  badge: 'text-violet-400 border-violet-400/20 bg-violet-400/8',  border: '#a78bfa', glow: 'rgba(124,58,237,0.12)' },
  indigo:  { dot: 'bg-indigo-400',  badge: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/8',  border: '#818cf8', glow: 'rgba(99,102,241,0.12)' },
  emerald: { dot: 'bg-emerald-400', badge: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/8', border: '#34d399', glow: 'rgba(52,211,153,0.12)' },
}

// Each card in the stack fans out based on scroll progress
const STACK_OFFSETS = [
  { y: 0,    rotate: 0,    x: 0   },
  { y: -8,   rotate: -2.5, x: -12 },
  { y: -16,  rotate: 2,    x: 10  },
  { y: -24,  rotate: -1.5, x: -6  },
]

const FannedCard = ({ system, index, scrollProgress }) => {
  const { dot, badge, border, glow } = ACCENT_MAP[system.accent]
  const offset = STACK_OFFSETS[index]

  // Fan-out: stacked → spread as scroll progresses (0 → 1)
  const fanY = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [offset.y, index * 6, index * 0, 0])
  const fanRotate = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [offset.rotate, offset.rotate * 0.5, 0, 0])
  const fanX = useTransform(scrollProgress, [0, 0.3, 0.6, 1], [offset.x, offset.x * 0.3, 0, 0])
  const fanScale = useTransform(scrollProgress, [0, 0.4, 1], [1 - index * 0.03, 1, 1])
  const fanOpacity = useTransform(scrollProgress, [0, 0.15 + index * 0.08, 0.4 + index * 0.08], [index === 0 ? 1 : 0.4, 1, 1])

  return (
    <motion.article
      style={{
        y: fanY,
        rotate: fanRotate,
        x: fanX,
        scale: fanScale,
        opacity: fanOpacity,
        zIndex: SYSTEMS.length - index,
      }}
      className="relative group rounded-2xl border border-white/8 bg-zinc-900/50 p-7 overflow-hidden hover:border-white/16 transition-colors duration-300"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${glow} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Accent line at top */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${border}, transparent)` }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className={`w-2.5 h-2.5 rounded-full ${dot} mt-1.5 shrink-0 group-hover:scale-150 transition-transform duration-300`} aria-hidden="true" />
          <span className="text-[10px] font-mono text-zinc-700 tracking-wider">{system.label}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:translate-x-1 transition-transform duration-300">
          {system.title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{system.body}</p>

        <div className="flex flex-wrap gap-1.5">
          {system.tags.map((tag) => (
            <span key={tag} className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border ${badge}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

const AIArchitecture = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  return (
    <section id="architecture" className="relative py-28 px-6" ref={containerRef}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="04 // Architecture"
          title="What I build."
          subtitle="Four pillars of AI engineering — from model fine-tuning to infrastructure operating at scale."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SYSTEMS.map((system, idx) => (
            <FannedCard key={system.id} system={system} index={idx} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AIArchitecture
