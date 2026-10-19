import React from 'react'
import { motion } from 'framer-motion'
import { fadeUpVariant } from '../utils/motionVariants'

const SectionBadge = ({ index, category }) => (
  <motion.div
    variants={fadeUpVariant}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    custom={0}
    className="flex items-center justify-center gap-3 mb-2 md:mb-4"
  >
    <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-pink-500/40" />
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/60 border border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.15)]">
      {index && (
        <span className="font-mono text-[10px] md:text-xs font-bold text-pink-400 tracking-wider">
          [ {index} ]
        </span>
      )}
      <span className="font-mono text-[10px] md:text-xs text-zinc-300 tracking-[0.2em] uppercase font-semibold">
        // {category}
      </span>
    </div>
    <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-pink-500/40" />
  </motion.div>
)

/**
 * Reusable section heading with tactical index badge, category, main title, and subtitle.
 */
const SectionHeader = React.memo(({ index, category, eyebrow, number, title, subtitle }) => {
  const displayIndex = index || number || null
  const displayCategory = category || eyebrow?.replace(/^SYS\.LOG\s*\/\/\s*/i, '').trim().toUpperCase()

  return (
    <div className="mb-6 md:mb-16 text-center">
      {displayCategory && (
        <SectionBadge index={displayIndex} category={displayCategory} />
      )}

      <motion.h2
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        custom={1}
        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={2}
          className="mt-2 md:mt-4 text-zinc-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed hidden sm:block"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'
export default SectionHeader
