import React, { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const TILT_SPRING = { damping: 22, stiffness: 200, mass: 0.7 }
const GLOW_SPRING = { damping: 24, stiffness: 160 }

const STATS = [
  { label: 'Age', value: '21+' },
  { label: 'Location', value: 'Hyderabad' },
  { label: 'Country', value: 'India' },
]

/**
 * ProfileCard — 3D tilt card with cursor-following light reflection and
 * atmospheric behind-glow. Designed to sit on a dark bg without looking
 * like a generic UI card.
 */
const ProfileCard = ({
  name         = 'Manish Desireddi',
  title        = 'AI & Automation Engineer',
  handle       = 'manishdesireddi',
  status       = 'Open to Work',
  contactText  = 'Connect',
  avatarUrl    = '/assets/profile-casual.jpg',
  enableTilt   = true,
  behindGlowEnabled = true,
}) => {
  const cardRef = useRef(null)

  // Raw normalised mouse position within the card (-0.5 to 0.5)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Spring-smoothed tilt
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), TILT_SPRING)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]),  TILT_SPRING)

  // Glow opacity driven by hover state
  const glowOpacity = useMotionValue(0)
  const springGlow  = useSpring(glowOpacity, GLOW_SPRING)

  // Cursor-following light reflection — maps mouse position to CSS gradient
  const lightBg = useTransform([rawX, rawY], ([x, y]) => {
    const lx = Math.round((x + 0.5) * 100)
    const ly = Math.round((y + 0.5) * 100)
    return `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.065) 0%, transparent 55%)`
  })

  const onMouseMove = useCallback(
    (e) => {
      if (!enableTilt || !cardRef.current) return
      const { left, top, width, height } = cardRef.current.getBoundingClientRect()
      rawX.set((e.clientX - left) / width  - 0.5)
      rawY.set((e.clientY - top)  / height - 0.5)
    },
    [enableTilt, rawX, rawY],
  )

  const onMouseEnter = useCallback(() => glowOpacity.set(1), [glowOpacity])

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    glowOpacity.set(0)
  }, [rawX, rawY, glowOpacity])

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ perspective: '1200px' }}>
      {/* Atmospheric glow behind the card — only visible on hover */}
      {behindGlowEnabled && (
        <motion.div
          className="absolute -inset-6 -z-10 blur-3xl rounded-[40px]"
          style={{
            opacity: springGlow,
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.35) 0%, rgba(124,58,237,0.2) 50%, transparent 80%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Card surface */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl"
        role="region"
        aria-label={`Profile card for ${name}`}
      >
        {/* Cursor-following surface reflection */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
          style={{ opacity: springGlow, background: lightBg }}
          aria-hidden="true"
        />

        {/* Top edge highlight line */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px z-10"
          style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.55), transparent)' }}
          aria-hidden="true"
        />

        {/* ── Avatar ───────────────────────────────────────────────────────── */}
        <div className="relative">
          <img
            src={avatarUrl}
            alt={`${name} — profile photo`}
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full block"
            style={{
              filter: 'brightness(0.90) contrast(1.05)',
              userSelect: 'none',
            }}
          />
          {/* Photo → card body fade */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(24,24,27,0.97) 100%)' }}
            aria-hidden="true"
          />

          {/* Live status badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/75 border border-cyan-400/20 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-mono text-green-300 tracking-wide">{status}</span>
          </div>
        </div>

        {/* ── Info ─────────────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 -mt-1">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white leading-tight select-none">{name}</h3>
            <p className="text-cyan-400 text-sm font-medium mt-0.5">{title}</p>
            <p className="text-zinc-600 text-xs font-mono mt-0.5">@{handle}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mb-5 pt-4 border-t border-white/8">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.a
            href="mailto:manishdesireddi@gmail.com"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="block w-full text-center py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            aria-label={`Send email to ${name}`}
          >
            {contactText}
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileCard
