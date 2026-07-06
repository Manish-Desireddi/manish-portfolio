import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { CalendarDays, MapPin, CheckSquare } from 'lucide-react'
import { EXPERIENCE } from '../data/portfolioData'
import SectionHeader from './SectionHeader'

const TimelineCard = React.memo(({ entry }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex gap-6 md:gap-8 group"
  >
    {/* Dot column */}
    <div className="shrink-0 flex flex-col items-center z-10" aria-hidden="true">
      <div className="w-4 h-4 bg-black border-2 border-cyan-400 mt-2 flex items-center justify-center group-hover:scale-125 group-hover:bg-cyan-400 transition-all">
        <div className="w-1 h-1 bg-cyan-400 group-hover:bg-black transition-colors" />
      </div>
    </div>

    {/* HUD Card */}
    <div className="flex-1 mb-16 p-8 bg-black/40 backdrop-blur-sm border border-cyan-500/20 group-hover:border-cyan-400/60 transition-colors shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden">
      {/* HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/50" />
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan-line pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-cyan-500/20 group-hover:border-cyan-400/50 transition-colors relative z-10">
        <div>
          <h3 className="text-2xl font-heading uppercase tracking-tight text-white mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">[ {entry.title} ]</h3>
          <p className="text-cyan-400 font-oswald uppercase tracking-widest text-sm">{entry.company}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end shrink-0">
          <span className="inline-flex items-center gap-2 text-xs text-cyan-200 font-mono bg-cyan-950/40 px-3 py-1.5 border border-cyan-500/30">
            <CalendarDays size={14} className="text-cyan-400" />
            T-{entry.date}
          </span>
          {entry.location && (
            <span className="inline-flex items-center gap-2 text-xs text-zinc-400 font-mono tracking-widest uppercase">
              <MapPin size={12} className="text-cyan-500" />
              LOC: {entry.location}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-4 relative z-10" aria-label={`Responsibilities at ${entry.company}`}>
        {entry.responsibilities.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-cyan-50/70 text-sm font-sans leading-relaxed">
            <CheckSquare size={16} className="text-cyan-500/50 mt-0.5 shrink-0 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] transition-all" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
))

TimelineCard.displayName = 'TimelineCard'

const Experience = () => {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 25%'],
  })

  const lineScaleY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { damping: 30, stiffness: 100 },
  )

  return (
    <section id="experience" ref={sectionRef} className="relative py-28 px-6 bg-transparent overflow-hidden">
      {/* HUD Scanline Overlay for entire section */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[length:100%_4px] z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center md:text-left mb-20 relative">
          {/* HUD Targeting Box for Header */}
          <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
          <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
          
          <SectionHeader
            eyebrow="SYS.LOG // Experience"
            title="WHERE I'VE SHIPPED."
            subtitle="> EXECUTING PRODUCTION PROTOCOLS AT SCALE..."
          />
        </div>

        <div className="relative pl-2 md:pl-4">
          {/* Static track line */}
          <div className="absolute left-[24px] md:left-[32px] top-0 bottom-0 w-[2px] bg-cyan-900/30" aria-hidden="true" />

          {/* Animated fill line */}
          <motion.div
            className="absolute left-[24px] md:left-[32px] top-0 w-1 bg-cyan-400 origin-top"
            style={{ scaleY: lineScaleY, height: '100%' }}
            aria-hidden="true"
          />

          <div>
            {EXPERIENCE.map((entry) => (
              <TimelineCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
