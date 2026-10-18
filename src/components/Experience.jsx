import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { CalendarDays, MapPin, CheckCircle2, Shield } from 'lucide-react'
import { EXPERIENCE, EXPERIENCE_META } from '../data/portfolioData'
import SectionHeader from './SectionHeader'

const ExperienceHeaderBar = ({ entry }) => (
  <div className="sticky top-20 z-20 mb-8 p-4 sm:p-5 bg-black/40 backdrop-blur-md border border-pink-500/30 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
      <div>
        <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white">
          {entry.title} <span className="text-pink-400">·</span> {entry.company}
        </h3>
        <p className="font-mono text-xs text-zinc-400">ROLE PROTOCOL // AI Automation for Performance, Verification and Validation Team</p>
      </div>
    </div>

    <div className="flex items-center gap-4 text-xs font-mono">
      <span className="inline-flex items-center gap-1.5 text-pink-300 bg-pink-950/40 px-2.5 py-1 border border-pink-500/30">
        <CalendarDays size={13} className="text-pink-400" />
        {entry.date}
      </span>
      {entry.location && (
        <span className="inline-flex items-center gap-1.5 text-zinc-400">
          <MapPin size={13} className="text-pink-500" />
          {entry.location}
        </span>
      )}
    </div>
  </div>
)

const ExperienceNodeCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    className="group relative p-5 sm:p-6 bg-black/15 backdrop-blur-[2px] border border-zinc-800/80 hover:border-pink-500/50 transition-all shadow-[inset_0_0_15px_rgba(236,72,153,0.05)] flex flex-col justify-between"
  >
    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-pink-500/40 group-hover:border-pink-400 transition-colors" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-pink-500/40 group-hover:border-pink-400 transition-colors" />

    <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={16}
          className="text-pink-500 group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.9)] transition-all shrink-0"
        />
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          NODE 0{index + 1} // VERIFIED DIRECTIVE
        </span>
      </div>
      <Shield size={12} className="text-pink-500/60" />
    </div>

    <p className="text-zinc-200 text-xs sm:text-sm font-sans leading-relaxed break-words">
      {item}
    </p>
  </motion.div>
)

const ExperienceTimeline = ({ entry }) => (
  <div className="relative">
    <ExperienceHeaderBar entry={entry} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {entry.responsibilities.map((item, i) => (
        <ExperienceNodeCard key={i} item={item} index={i} />
      ))}
    </div>
  </div>
)

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
    <section id="experience" ref={sectionRef} className="relative py-28 px-4 sm:px-6 bg-transparent">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          index={EXPERIENCE_META.index}
          category={EXPERIENCE_META.category}
          title={EXPERIENCE_META.title}
          subtitle={EXPERIENCE_META.subtitle}
        />

        <div className="relative mt-12">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-pink-900/30" aria-hidden="true" />
          <motion.div
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-pink-500 to-orange-500 origin-top"
            style={{ scaleY: lineScaleY, height: '100%' }}
            aria-hidden="true"
          />

          <div className="pl-4 sm:pl-8">
            {EXPERIENCE.map((entry) => (
              <ExperienceTimeline key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
