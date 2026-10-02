import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import ProfileCard from './ProfileCard'

const SORTED_TECH = [...TECH_STACK].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
const MARQUEE_ITEMS = [...SORTED_TECH, ...SORTED_TECH]

const CHIPS = [
  { label: 'AI Models', cls: 'text-zinc-100 border-zinc-700 bg-zinc-900' },
  { label: 'AI Pipelines', cls: 'text-pink-400 border-pink-400/30 bg-pink-950/40' },
  { label: 'Automation', cls: 'text-orange-400 border-orange-400/30 bg-violet-950/40' },
  { label: 'Distributed Systems', cls: 'text-zinc-100 border-zinc-700 bg-zinc-900' },
]

const STAT_TILES = [
  { value: '4+', label: 'AI Projects' },
  { value: '8.65', label: 'CGPA' },
  { value: '11 mos', label: 'Nokia' },
]

const Chip = memo(({ label, cls }) => (
  <span className={`px-4 py-1.5 text-xs font-mono font-medium border uppercase tracking-wider ${cls}`}>
    {label}
  </span>
))
Chip.displayName = 'Chip'

const About = () => {
  return (
    <section id="about" className="relative py-28 px-6 bg-transparent overflow-hidden">
      {/* HUD Scanline Overlay for entire section */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[length:100%_4px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-16 relative">
          {/* HUD Targeting Box for Header */}
          <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-pink-500/50" />
          <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-pink-500/50" />

          <SectionHeader
            eyebrow="SYS.LOG // About"
            title="ENGINEER BY DISCIPLINE."
            subtitle="> AI ARCHITECT BY OBSESSION..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md">
              <ProfileCard
                name="Manish Desireddi"
                title="AI & Automation Engineer"
                handle="manishdesireddi"
                status="Open to Work"
                contactText="Connect"
                avatarUrl="/assets/profile-casual.jpg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-wrap gap-3">
              {CHIPS.map(({ label, cls }) => (
                <Chip key={label} label={label} cls={cls} />
              ))}
            </div>

            <p className="text-zinc-300 font-sans text-xl leading-relaxed">
              I'm a Recent B.Tech Graduate in <span className="text-white font-heading uppercase">Artificial Intelligence &amp; Data Science</span>, engineering production-grade AI systems that survive at scale.
            </p>

            <p className="text-zinc-400 font-sans text-lg leading-relaxed">
              My work spans <span className="text-pink-400 uppercase tracking-widest font-mono text-sm">Generative AI</span> fine-tuning LLMs with LoRA and quantization—and assembling <span className="text-orange-400 uppercase tracking-widest font-mono text-sm">agentic pipelines</span> that automate complex multi-step workflows end-to-end.
            </p>

            <p className="text-zinc-500 font-sans text-base leading-relaxed">
              At Nokia Solutions and Networks, I architect automation and data ingestion systems using Apache Airflow and distributed event-driven patterns. I write infrastructure that observes itself: Grafana dashboards, reliable DAG orchestration, and pipelines with measurable SLAs.
            </p>

            {/* Tactical stats */}
            <div className="mt-4 pt-8 border-t border-pink-500/20 grid grid-cols-3 gap-6 relative z-10">
              {STAT_TILES.map(({ value, label }) => (
                <div key={label} className="flex flex-col border-l-4 border-pink-500/50 pl-4 hover:border-pink-400 transition-colors">
                  <span className="text-4xl font-heading text-white tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
                  <span className="text-xs text-pink-200/70 font-mono uppercase tracking-widest mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tech stack marquee in tactical style */}
        <div className="mt-32 py-8 bg-transparent overflow-hidden relative backdrop-blur-sm z-10">
          <div className="absolute left-0 top-0 h-full w-32 z-10 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-32 z-10 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />

          <div className="marquee-wrapper flex select-none" aria-label="Scrolling list of technologies">
            <div className="marquee-track flex items-center gap-16 animate-marquee">
              {MARQUEE_ITEMS.map((tech, idx) => (
                <span
                  key={`${tech}-${idx}`}
                  className="text-stroke text-4xl sm:text-5xl font-heading tracking-tight uppercase whitespace-nowrap opacity-20 hover:opacity-100 hover:text-pink-400 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
