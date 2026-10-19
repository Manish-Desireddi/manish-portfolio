import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { fadeUpVariant } from '../utils/motionVariants'
import { EXPERTISE_DATA } from '../data/portfolioData'

const ACCENT_MAP = {
  pink: { bg: 'bg-pink-950/40', border: 'border-pink-400', text: 'text-pink-400', groupHoverBorder: 'group-hover:border-pink-400' },
  orange: { bg: 'bg-orange-950/40', border: 'border-orange-400', text: 'text-orange-400', groupHoverBorder: 'group-hover:border-orange-400' },
  fuchsia: { bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-400', text: 'text-fuchsia-400', groupHoverBorder: 'group-hover:border-fuchsia-400' },
  amber: { bg: 'bg-amber-950/40', border: 'border-amber-400', text: 'text-amber-400', groupHoverBorder: 'group-hover:border-amber-400' },
}

const ACCENT_KEYS = ['pink', 'orange', 'fuchsia', 'amber']

const ExpertiseCard = ({ system, index }) => {
  const accentKey = ACCENT_KEYS[index % ACCENT_KEYS.length]
  const { bg, border, text, groupHoverBorder } = ACCENT_MAP[accentKey]

  return (
    <motion.article
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
      className="expertise-card group relative bg-app-dark border border-zinc-800 p-8 flex flex-col hover:border-zinc-500 transition-colors"
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${bg} border-t-2 ${border} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />

      <div className="flex items-center justify-between mb-6">
        <span className={`font-heading text-4xl ${text} opacity-50 group-hover:opacity-100 transition-opacity`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className={`w-8 h-8 border border-zinc-800 flex items-center justify-center ${groupHoverBorder} transition-colors`}>
          <div className="w-2 h-2 bg-zinc-800 group-hover:bg-white transition-colors" />
        </div>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">
        {system.category}
      </p>

      <h3 className="font-heading text-2xl uppercase text-white mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
        {system.name}
      </h3>

      <p className="text-zinc-400 font-sans text-sm leading-relaxed flex-grow mb-8">
        {system.description}
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
            index={EXPERTISE_DATA.index}
            category={EXPERTISE_DATA.category}
            title={EXPERTISE_DATA.title}
            subtitle={EXPERTISE_DATA.subtitle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {EXPERTISE_DATA.systems.map((system, idx) => (
            <ExpertiseCard key={system.id} system={system} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Expertise
