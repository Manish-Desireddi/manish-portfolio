import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable section heading with eyebrow label, main title, and optional subtitle.
 * All three elements animate in from below when they enter the viewport.
 */
const SectionHeader = React.memo(({ eyebrow, title, subtitle }) => {
  return (
    <div className="mb-16 text-center">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-[0.2em] text-cyan-400 uppercase mb-4"
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'
export default SectionHeader
