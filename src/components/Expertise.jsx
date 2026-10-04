import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionHeader from './SectionHeader'

const SYSTEMS = [
  {
    id: 'generative',
    label: '01',
    title: 'Generative AI & LLMs',
    body: 'Designing and deploying tailored language models and semantic search solutions. Expertise in optimizing model inference, prompt engineering, and building robust Retrieval-Augmented Generation (RAG) pipelines for accurate, context-aware AI outputs.',
    tags: ['LLMs', 'RAG', 'Prompt Engineering', 'Vector Search'],
    accent: 'pink',
  },
  {
    id: 'agentic',
    label: '02',
    title: 'Agentic Workflows',
    body: 'Architecting multi-agent systems capable of dynamic reasoning and tool execution. Focused on building autonomous, event-driven loops that handle complex API integrations, data processing, and stateful decision-making without manual intervention.',
    tags: ['Autonomous Agents', 'Workflow Orchestration', 'Event-Driven', 'Tool Calling'],
    accent: 'orange',
  },
  {
    id: 'infra',
    label: '03',
    title: 'Data Infra & MLOps',
    body: 'Building resilient ETL pipelines and orchestrating scheduled data workflows. Experienced in implementing comprehensive telemetry, logging, and observability dashboards to maintain strict performance SLAs and system health.',
    tags: ['Data Pipelines', 'CI/CD', 'ETL', 'Observability'],
    accent: 'fuchsia',
  },
  {
    id: 'fullstack',
    label: '04',
    title: 'Full-Stack Architecture',
    body: 'Developing complete end-to-end applications where AI is the core engine. Skilled in designing scalable REST APIs, managing asynchronous background workers, and building responsive user interfaces for seamless human-computer interaction.',
    tags: ['Backend Systems', 'API Design', 'Async Processing', 'UI/UX'],
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

const Expertise = () => {
  const containerRef = useRef(null)

  return (
    <section id="architecture" className="relative py-32 px-6 bg-transparent border-t border-zinc-900 overflow-hidden" ref={containerRef}>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionHeader
            eyebrow="SYS.LOG // Expertise"
            title="TECHNICAL MASTERY"
            subtitle="> A multidisciplinary foundation across software engineering."
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

export default Expertise
