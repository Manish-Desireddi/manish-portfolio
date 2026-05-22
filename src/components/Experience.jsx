import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { CalendarDays, MapPin, CheckCircle2 } from 'lucide-react'
import { EXPERIENCE } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import AnimatedBackground from './AnimatedBackground'

/**
 * Single timeline entry card.
 * Animates in from the right when it enters the viewport.
 */
const TimelineCard = React.memo(({ entry }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="flex gap-6 md:gap-8"
  >
    {/* Dot column — aligns with the central line */}
    <div className="shrink-0 flex flex-col items-center" aria-hidden="true">
      <div className="w-[18px] h-[18px] rounded-full bg-cyan-400 border-4 border-zinc-950 shadow-[0_0_18px_rgba(6,182,212,0.7)] mt-1 z-10" />
    </div>

    {/* Card */}
    <motion.div
      whileHover={{
        borderColor: 'rgba(6,182,212,0.45)',
        boxShadow: '0 0 40px rgba(6,182,212,0.08)',
      }}
      transition={{ duration: 0.2 }}
      className="flex-1 mb-12 p-6 md:p-8 rounded-2xl bg-zinc-900/60 border border-white/8 backdrop-blur-sm"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-xl font-bold text-white">{entry.title}</h3>
          <p className="text-cyan-400 font-medium mt-0.5 text-sm">{entry.company}</p>
        </div>

        <div className="flex flex-col gap-1.5 sm:items-end shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono whitespace-nowrap">
            <CalendarDays size={12} aria-hidden="true" />
            {entry.date}
          </span>
          {entry.location && (
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 font-mono">
              <MapPin size={11} aria-hidden="true" />
              {entry.location}
            </span>
          )}
        </div>
      </div>

      {/* Responsibilities */}
      <ul className="space-y-2.5" aria-label={`Responsibilities at ${entry.company}`}>
        {entry.responsibilities.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed"
          >
            <CheckCircle2 size={14} className="text-cyan-500 mt-0.5 shrink-0" aria-hidden="true" />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  </motion.div>
))

TimelineCard.displayName = 'TimelineCard'

const Experience = () => {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 25%'],
  })

  // Spring-smoothed progress drives the line growth from top → bottom
  const lineScaleY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { damping: 28, stiffness: 110 },
  )

  return (
    <section id="experience" ref={sectionRef} className="relative py-28 px-6 overflow-hidden bg-zinc-950">
      <AnimatedBackground variant="experience" showGrid={false} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="02 // Experience"
          title="Where I've shipped."
          subtitle="Production systems at enterprise scale."
        />

        {/* Timeline container */}
        <div className="relative">
          {/* Static track line */}
          <div
            className="absolute left-[8px] top-0 bottom-0 w-px bg-zinc-800"
            aria-hidden="true"
          />

          {/* Animated fill line — grows as the user scrolls through the section */}
          <motion.div
            className="absolute left-[8px] top-0 w-px timeline-gradient origin-top"
            style={{ scaleY: lineScaleY, height: '100%' }}
            aria-hidden="true"
          />

          {/* Timeline entries */}
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
