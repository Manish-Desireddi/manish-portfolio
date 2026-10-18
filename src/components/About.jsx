import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { TECH_STACK, ABOUT_DATA } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import ProfileCard from './ProfileCard'
import { verifyAndTriggerDownload } from '../utils/assetVerifier'
import { trackEvent } from '../utils/analytics'

const SORTED_TECH = [...TECH_STACK].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
const MARQUEE_ITEMS = [...SORTED_TECH, ...SORTED_TECH]

const CHIP_STYLES = [
  'text-pink-400 border-pink-400/30 bg-pink-950/40',
  'text-orange-400 border-orange-400/30 bg-orange-950/40',
  'text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-950/40',
  'text-amber-400 border-amber-400/30 bg-amber-950/40',
]

const Chip = memo(({ label, index }) => (
  <span className={`px-4 py-1.5 text-xs font-mono font-medium border uppercase tracking-wider ${CHIP_STYLES[index % CHIP_STYLES.length]}`}>
    {label}
  </span>
))
Chip.displayName = 'Chip'

const TechStackMarquee = () => (
  <div className="mt-24 sm:mt-32 py-8 bg-transparent overflow-hidden relative backdrop-blur-sm z-10">
    <div className="absolute left-0 top-0 h-full w-16 sm:w-32 z-10 bg-gradient-to-r from-black/90 to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 h-full w-16 sm:w-32 z-10 bg-gradient-to-l from-black/90 to-transparent pointer-events-none" />

    <div className="marquee-wrapper flex select-none" aria-label="Scrolling list of technologies">
      <div className="marquee-track flex items-center gap-12 sm:gap-16">
        {MARQUEE_ITEMS.map((tech, idx) => (
          <span
            key={`${tech}-${idx}`}
            className="text-stroke text-3xl sm:text-5xl font-heading tracking-tight uppercase whitespace-nowrap opacity-25 hover:opacity-100 hover:text-pink-400 transition-all duration-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>
)

const AboutStats = ({ stats }) => (
  <div className="mt-2 pt-6 border-t border-pink-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10">
    {stats.map(({ value, label, sub }) => (
      <div key={label} className="flex flex-col border-l-4 border-pink-500/50 pl-3 sm:pl-4 hover:border-pink-400 transition-colors">
        <span className="text-2xl sm:text-3xl font-heading text-white tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
          {value}
        </span>
        <span className="text-[10px] sm:text-xs text-pink-200/70 font-mono uppercase tracking-widest mt-1">
          {label}
        </span>
        {sub && <span className="text-[9px] text-zinc-500 font-mono mt-0.5">{sub}</span>}
      </div>
    ))}
  </div>
)

const About = () => {
  const handleResumeDownload = async (e) => {
    e.preventDefault()
    trackEvent('download', 'resume_pdf', { source: 'about_section' })
    await verifyAndTriggerDownload(ABOUT_DATA.resumeUrl, ABOUT_DATA.resumeFileName)
  }

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 bg-transparent overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-16 relative">
          <SectionHeader
            index={ABOUT_DATA.index}
            category={ABOUT_DATA.category}
            title={ABOUT_DATA.title}
            subtitle={ABOUT_DATA.subtitle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md">
              <ProfileCard />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {ABOUT_DATA.chips.map((label, idx) => (
                <Chip key={label} label={label} index={idx} />
              ))}
            </div>

            {ABOUT_DATA.bioParagraphs.map((para, i) => (
              <p key={i} className="text-zinc-300 font-sans text-base sm:text-lg leading-relaxed">
                {para}
              </p>
            ))}

            <AboutStats stats={ABOUT_DATA.statTiles} />

            <div className="mt-4 flex justify-start">
              <button
                type="button"
                onClick={handleResumeDownload}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-pink-500 text-black font-heading uppercase tracking-widest text-xs sm:text-sm hover:bg-white transition-colors border border-transparent hover:border-pink-500 cursor-pointer"
              >
                <Download size={18} />
                {ABOUT_DATA.resumeButtonLabel}
              </button>
            </div>
          </motion.div>
        </div>

        <TechStackMarquee />
      </div>
    </section>
  )
}

export default About
