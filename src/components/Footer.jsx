import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowUp, Github, Linkedin, ChevronRight } from 'lucide-react'
import { LEADERSHIP } from '../data/portfolioData'
import SectionHeader from './SectionHeader'

const CONTACT_EMAIL = 'manishdesireddi@gmail.com'

/** Reusable bento box card with entrance animation */
const BentoBox = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, delay }}
    className={`relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-white/8 backdrop-blur-sm ${className}`}
  >
    {children}
  </motion.div>
)

const Footer = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer id="leadership" className="relative pt-28 pb-8 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="05 // Education & Leadership"
          title="Beyond the code."
          subtitle="Academic excellence and community leadership at scale."
        />

        {/* ── Bento grid — Education first, Leadership second ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">

          {/* Box 1: Education */}
          <BentoBox delay={0} className="min-h-[320px] p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-violet-400/10 border border-violet-400/20 text-violet-400 text-[10px] font-mono tracking-wider uppercase mb-5">
                Education
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                {LEADERSHIP.education.degree}
              </h3>
              <p className="text-zinc-500 text-sm font-mono">{LEADERSHIP.education.institution}</p>
            </div>

            <div>
              {/* CGPA display */}
              <div className="flex items-end gap-3 my-6">
                <span className="text-6xl font-black text-white leading-none">
                  {LEADERSHIP.education.cgpa}
                </span>
                <div className="mb-1.5">
                  <p className="text-xs text-zinc-400 font-mono">CGPA</p>
                  <p className="text-xs text-zinc-600">out of 10.0</p>
                </div>
              </div>

              <ul className="space-y-2">
                {LEADERSHIP.education.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <ChevronRight size={14} className="text-violet-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </BentoBox>

          {/* Box 2: VP Student Body */}
          <BentoBox delay={0.1} className="group min-h-[320px] p-8">
            {/* Campus photo — desaturated, low opacity, dark overlay */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
              <img
                src="/assets/campus.jpg"
                alt=""
                className="w-full h-full object-cover grayscale opacity-[0.10] scale-105 group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.8) 50%, rgba(9,9,11,0.94) 100%)',
                }}
              />
            </div>

            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono tracking-wider uppercase mb-5">
                Leadership
              </span>
              <h3 className="text-2xl font-bold text-white mb-5">{LEADERSHIP.vp.title}</h3>
              <ul className="space-y-2.5">
                {LEADERSHIP.vp.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed"
                  >
                    <ChevronRight size={14} className="text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </BentoBox>
        </div>

        {/* ── Contact CTA ───────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.25em] text-zinc-600 uppercase mb-4"
          >
            Open to Opportunities
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl xl:text-8xl font-black text-white tracking-tighter mb-10 leading-none"
          >
            Let's Connect
          </motion.h2>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 44px rgba(6,182,212,0.35)' }}
            whileTap={{ scale: 0.97 }}
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-cyan-500 text-black font-semibold text-base hover:bg-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label={`Send email to Manish at ${CONTACT_EMAIL}`}
          >
            <Mail size={18} aria-hidden="true" />
            {CONTACT_EMAIL}
          </motion.a>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-white/8">
          <p className="text-zinc-600 text-sm text-center sm:text-left">
            © 2026 Manish Desireddi. Built with React, Tailwind CSS, and Framer Motion.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Manish-Desireddi"
              aria-label="GitHub profile"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-600 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded p-1"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/"
              aria-label="LinkedIn profile"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-600 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded p-1"
            >
              <Linkedin size={18} />
            </a>

            {/* Scroll-to-top */}
            <motion.button
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={scrollToTop}
              aria-label="Scroll back to the top of the page"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ml-1"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
