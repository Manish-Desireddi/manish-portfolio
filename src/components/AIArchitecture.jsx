import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionHeader from './SectionHeader'

const SYSTEMS = [
  {
    id: 'generative',
    label: '01',
    title: 'Generative AI Pipelines',
    body: 'Fine-tuned LLMs (Mistral-7B, Llama-3) with LoRA and QLoRA adapters for domain-specific tasks. Text-to-3D generation over ShapeNet with GAN-based geometry modelling and FAISS-powered RAG for retrieval context injection.',
    tags: ['LoRA / QLoRA', 'GANs', 'Text-to-3D', 'FAISS RAG'],
    accent: 'pink',
  },
  {
    id: 'agentic',
    label: '02',
    title: 'Agentic Automation Systems',
    body: 'Multi-step autonomous pipelines built on local LLMs with real-time voice input via Distil-Whisper. RabbitMQ dispatches asynchronous task queues — fully offline, zero cloud dependencies, complete data privacy.',
    tags: ['Agentic AI', 'Distil-Whisper', 'RabbitMQ', 'Local LLM'],
    accent: 'orange',
  },
  {
    id: 'infra',
    label: '03',
    title: 'Data & Automation Infra',
    body: 'Enterprise-grade Apache Airflow DAG orchestration, event-sourced ESDB ingestion pipelines, Redis caching layers, and Grafana observability dashboards tuned to measurable SLA thresholds.',
    tags: ['Apache Airflow', 'ESDB', 'Redis', 'Grafana'],
    accent: 'fuchsia',
  },
  {
    id: 'fullstack',
    label: '04',
    title: 'AI-Powered Full-Stack',
    body: 'React + FastAPI products where AI is the core value: LLM recommendation engines, Celery-backed async inference workers, Redis session management, and streaming model responses with real-time feedback.',
    tags: ['FastAPI', 'React', 'Celery', 'Streaming AI'],
    accent: 'amber',
  },
]

const ACCENT_MAP = {
  pink: { bg: 'bg-pink-950/40', border: 'border-pink-400', text: 'text-pink-400', groupHoverBorder: 'group-hover:border-pink-400', groupHoverText: 'group-hover:text-pink-400' },
  orange: { bg: 'bg-orange-950/40', border: 'border-orange-400', text: 'text-orange-400', groupHoverBorder: 'group-hover:border-orange-400', groupHoverText: 'group-hover:text-orange-400' },
  fuchsia: { bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-400', text: 'text-fuchsia-400', groupHoverBorder: 'group-hover:border-fuchsia-400', groupHoverText: 'group-hover:text-fuchsia-400' },
  amber: { bg: 'bg-amber-950/40', border: 'border-amber-400', text: 'text-amber-400', groupHoverBorder: 'group-hover:border-amber-400', groupHoverText: 'group-hover:text-amber-400' },
}

const TacticalCard = ({ system, index }) => {
  const { bg, border, text, groupHoverBorder, groupHoverText } = ACCENT_MAP[system.accent]

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-app-dark border border-zinc-800 p-8 flex flex-col hover:border-zinc-500 transition-colors`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${bg} border-t-2 ${border} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />

      <div className="flex items-center justify-between mb-6">
        <span className={`font-heading text-4xl ${text} opacity-50 group-hover:opacity-100 transition-opacity`}>
          {system.label}
        </span>
        <div className={`w-8 h-8 border border-zinc-800 flex items-center justify-center ${groupHoverBorder} transition-colors`}>
          <div className={`w-2 h-2 bg-zinc-800 group-hover:bg-white transition-colors`} />
        </div>
      </div>

      <h3 className="font-heading text-2xl uppercase text-white mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
        {system.title}
      </h3>

      <p className="text-zinc-400 font-sans text-sm leading-relaxed flex-grow mb-8">
        {system.body}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {system.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-widest group-hover:border-zinc-600 group-hover:text-zinc-300 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

const AIArchitecture = () => {
  const containerRef = useRef(null)

  return (
    <section id="architecture" className="relative py-32 px-6 bg-transparent border-t border-zinc-900 overflow-hidden" ref={containerRef}>
      {/* Animated Synthwave Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,70,239,0.15)_0%,transparent_70%)]" />
        <motion.div
          className="absolute w-[200vw] h-[200vh] left-[-50vw] top-[10vh] opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(217,70,239,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(217,70,239,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transformOrigin: 'top center',
          }}
          animate={{
            transform: [
              'rotateX(75deg) translateY(0px)',
              'rotateX(75deg) translateY(60px)'
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionHeader
            eyebrow="SYS.LOG // Expertise"
            title="TECHNICAL MASTERY"
            subtitle="A multidisciplinary foundation across AI model fine-tuning, distributed automation, and full-stack engineering."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SYSTEMS.map((system, idx) => (
            <TacticalCard key={system.id} system={system} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AIArchitecture
