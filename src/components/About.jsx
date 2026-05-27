import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import ProfileCard from './ProfileCard'

// Alphabetically sorted at definition time
const SORTED_TECH = [...TECH_STACK].sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase()),
)

// Duplicate for seamless 50%-translate infinite loop
const MARQUEE_ITEMS = [...SORTED_TECH, ...SORTED_TECH]

const CHIPS = [
  { label: 'AI Models',           cls: 'text-emerald-400 border-emerald-400/25 bg-emerald-400/8' },
  { label: 'AI Pipelines',        cls: 'text-cyan-400    border-cyan-400/25    bg-cyan-400/8'    },
  { label: 'Automation',          cls: 'text-violet-400  border-violet-400/25  bg-violet-400/8'  },
  { label: 'Distributed Systems', cls: 'text-indigo-400  border-indigo-400/25  bg-indigo-400/8'  },
]

const STAT_TILES = [
  { value: '3+',  label: 'AI Projects' },
  { value: '8.2', label: 'CGPA'        },
  { value: '9 mos+', label: 'Nokia'       },
]

// Memoized chip — avoids re-render when parent updates
const Chip = memo(({ label, cls }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${cls}`}>
    {label}
  </span>
))
Chip.displayName = 'Chip'

const About = () => {
  return (
    <section id="about" className="relative py-28 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="01 // About"
          title="Engineer by discipline."
          subtitle="AI architect by obsession."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20 items-center">

          {/* â”€â”€ Left: ProfileCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85 }}
            className="flex items-center justify-center"
          >
            {/*
             * Wrapping div carries an extra ambient glow to help the card
             * feel fused into the dark background rather than sitting on top.
             */}
            <div className="relative w-full max-w-sm">
              <div
                className="absolute -inset-10 blur-3xl opacity-15 pointer-events-none rounded-full"
                style={{ background: 'radial-gradient(ellipse, #06b6d4 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              <ProfileCard
                name="Manish Desireddi"
                title="AI & Automation Engineer"
                handle="manishdesireddi"
                status="Open to Work"
                contactText="Connect"
                avatarUrl="/assets/profile-casual.jpg"
                enableTilt={true}
                behindGlowEnabled={true}
              />
            </div>
          </motion.div>

          {/* â”€â”€ Right: Bio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, delay: 0.12 }}
            className="flex flex-col gap-6"
          >
            {/* Capability chips */}
            <div className="flex flex-wrap gap-2">
              {CHIPS.map(({ label, cls }) => (
                <Chip key={label} label={label} cls={cls} />
              ))}
            </div>

            <p className="text-zinc-300 text-lg leading-relaxed">
              I'm a final-year B.Tech student in{' '}
              <span className="text-white font-semibold">
                Artificial Intelligence &amp; Data Science
              </span>
              , engineering production-grade AI systems that survive at scale. My work spans{' '}
              <span className="text-cyan-400">Generative AI</span> &mdash; fine-tuning LLMs with LoRA
              and quantization &mdash; and assembling{' '}
              <span className="text-violet-400">agentic pipelines</span> that automate complex
              multi-step workflows end-to-end.
            </p>

            <p className="text-zinc-400 text-base leading-relaxed">
              At Nokia Solutions and Networks, I architect automation and data ingestion systems
              using Apache Airflow and distributed event-driven patterns. I write infrastructure
              that observes itself: Grafana dashboards, reliable DAG orchestration, and pipelines
              with measurable SLAs.
            </p>

            <p className="text-zinc-400 text-base leading-relaxed">
              Outside of work, I research distributed system design, local LLM deployments,
              retrieval-augmented generation, and multi-modal generative models. I care about AI
              that is efficient, explainable, and enterprise-deployable.
            </p>

            {/* Quick stats */}
            <div className="mt-2 pt-6 border-t border-white/8 grid grid-cols-3 gap-4">
              {STAT_TILES.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* â”€â”€ Tech stack marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="mt-24">
          <p className="text-center text-[10px] font-mono text-zinc-700 tracking-[0.25em] uppercase mb-8">
            Technologies
          </p>

          <div
            className="marquee-wrapper overflow-hidden relative select-none"
            aria-label="Scrolling list of technologies"
          >
            {/* Edge fades */}
            <div
              className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #09090b, transparent)' }}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #09090b, transparent)' }}
              aria-hidden="true"
            />

            {/* Duplicated items â€” hover fills with electric cyan */}
            <div className="marquee-track items-center gap-14 py-2">
              {MARQUEE_ITEMS.map((tech, idx) => (
                <span
                  key={`${tech}-${idx}`}
                  className="text-stroke text-2xl md:text-3xl font-black tracking-tight uppercase whitespace-nowrap"
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
