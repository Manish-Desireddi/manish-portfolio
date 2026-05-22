import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, ChevronRight } from 'lucide-react'

// Two-line tagline — staggered clip reveal for stronger visual impact
const TAGLINE_LINES = [
  'Engineering Intelligence.',
  'Scaling Thought into Systems.',
]

/**
 * Hero — full-screen fixed overlay covering main content until the
 * intro video finishes or the user skips.
 *
 * Audio strategy:
 *   1. Attempt unmuted autoplay — most browsers block on first visit.
 *   2. Fall back to muted autoplay (always succeeds).
 *   3. Register one-shot user interaction listener to restore audio silently.
 *   4. Show "Tap to enable sound" hint only while blocked.
 */
const Hero = ({ onVideoEnd }) => {
  const videoRef                        = useRef(null)
  const [muted, setMuted]               = useState(true)
  const [audioBlocked, setAudioBlocked] = useState(false)

  // ── Audio: unmuted attempt with first-interaction fallback ─────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    const attempt = video.play()
    if (!attempt) return

    attempt
      .then(() => setMuted(false))
      .catch(() => {
        // Autoplay policy blocked unmuted — fall back to muted
        video.muted = true
        video.play().catch(() => {})
        setMuted(true)
        setAudioBlocked(true)

        // Restore audio on first user gesture without requiring explicit button press
        const unlock = () => {
          const v = videoRef.current
          if (!v) return
          v.muted = false
          setMuted(false)
          setAudioBlocked(false)
        }
        document.addEventListener('click',      unlock, { once: true })
        document.addEventListener('touchstart', unlock, { once: true, passive: true })
      })
  }, [])

  const toggleAudio = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (audioBlocked) setAudioBlocked(false)
  }, [audioBlocked])

  const handleVideoEnd = useCallback(() => {
    setTimeout(() => onVideoEnd?.(), 400)
  }, [onVideoEnd])

  const skipIntro = useCallback(() => onVideoEnd?.(), [onVideoEnd])

  return (
    <motion.section
      id="home"
      className="fixed inset-0 z-[60] bg-zinc-950 overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Intro section"
    >
      {/* ── Full-screen background video ──────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/assets/avatar-intro.mp4"
        autoPlay
        playsInline
        loop={false}
        onEnded={handleVideoEnd}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        aria-hidden="true"
      />

      {/* ── Left gradient — readable text zone, unobstructed face ─────────── */}
      <div className="absolute inset-0 z-[1] hero-left-mask" aria-hidden="true" />

      {/* ── Bottom page-fade ──────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[1]"
        style={{ background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ── Ambient cyan orb behind text ──────────────────────────────────── */}
      <div
        className="absolute top-1/4 left-0 w-[450px] h-[450px] rounded-full z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ── Text content ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-2xl xl:max-w-3xl">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/12 text-zinc-300 text-xs font-mono tracking-wide backdrop-blur-sm w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
          Automation Engineer Intern · Nokia Solutions and Networks
        </motion.div>

        {/* Signature name */}
        <h1 className="mb-2 select-none" aria-label="Manish Desireddi">
          {['Manish', 'Desireddi'].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, x: -50, filter: 'blur(16px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 1.05,
                delay: 0.35 + i * 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block signature-name"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Animated underline drawn after name appears */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="signature-underline mb-10 w-72 md:w-96"
          aria-hidden="true"
        />

        {/* Tagline — each line clips up from below with stagger */}
        <div className="mb-10 space-y-1.5" aria-label="Tagline">
          {TAGLINE_LINES.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.72,
                  delay: 1.1 + i * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={
                  i === 0
                    ? 'text-xl sm:text-2xl md:text-3xl text-white font-semibold tracking-tight'
                    : 'text-lg sm:text-xl md:text-2xl text-zinc-400 font-light tracking-wide'
                }
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Skip intro */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={skipIntro}
          className="group inline-flex items-center gap-1.5 text-xs font-mono text-black-600 hover:text-zinc-300 transition-colors w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
          aria-label="Skip intro and go to portfolio"
        >
          Skip intro
          <ChevronRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {/* ── Audio hint (only while browser has blocked audio) ─────────────── */}
      {audioBlocked && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={toggleAudio}
          className="absolute bottom-8 right-8 z-[3] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/12 text-zinc-300 text-xs font-mono backdrop-blur-sm hover:bg-zinc-800/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          aria-label={muted ? 'Enable audio' : 'Mute audio'}
        >
          {muted ? (
            <VolumeX size={14} aria-hidden="true" />
          ) : (
            <Volume2 size={14} aria-hidden="true" />
          )}
          {muted ? 'Tap to enable sound' : 'Mute'}
        </motion.button>
      )}
    </motion.section>
  )
}

export default Hero
