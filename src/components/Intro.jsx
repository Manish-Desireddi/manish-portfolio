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
const Intro = ({ onVideoEnd }) => {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    // Attempt autoplay. We set muted=false explicitly.
    // If the browser blocks it, it will throw an error, which we catch.
    const video = videoRef.current
    if (!video) return

    video.muted = false
    const attempt = video.play()
    if (!attempt) return

    attempt
      .then(() => setMuted(false))
      .catch(() => {
        // We do NOT fall back to muted.
        // We just let it pause and wait for the user to click play.
        // Since the video is the background, it might just show the first frame.
        // Actually, if we want it to at least play the video silently if unmuted fails:
        video.muted = true
        video.play().catch(() => {})
        setMuted(true)

        const unlock = () => {
          const v = videoRef.current
          if (!v) return
          v.muted = false
          setMuted(false)
        }
        document.addEventListener('click', unlock, { once: true })
        document.addEventListener('touchstart', unlock, { once: true, passive: true })
      })
  }, [])

  const toggleAudio = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

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
        muted={false}
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
          background: 'radial-gradient(ellipse, rgba(217,70,239,0.07) 0%, transparent 70%)',
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
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-950/80 border border-pink-400/30 text-pink-400 text-xs font-mono tracking-wide backdrop-blur-md shadow-[0_0_10px_rgba(217,70,239,0.2)] w-fit"
        >
          <span className="w-1.5 h-1.5 bg-pink-400 animate-pulse" aria-hidden="true" />
          ex-Student Intern · Nokia Solutions and Networks
        </motion.div>

        {/* Signature name - Brutalist Style */}
        <h1 className="mb-2 select-none font-heading text-5xl sm:text-6xl md:text-8xl tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" aria-label="Manish Desireddi">
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
              className="block"
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
          className="mb-10 w-72 md:w-96 h-1 bg-pink-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]"
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
                    ? 'text-xl sm:text-2xl md:text-3xl text-white font-heading uppercase tracking-widest'
                    : 'text-lg sm:text-xl md:text-2xl text-zinc-400 font-sans tracking-wide'
                }
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Skip intro - Brutalist Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={skipIntro}
          className="group mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-heading uppercase text-sm hover:bg-pink-400 hover:text-black transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.6)]"
          aria-label="Skip intro and go to portfolio"
        >
          SKIP INTRO
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {/* ── Persistent audio toggle — brutalist style ────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={toggleAudio}
        className="absolute bottom-8 right-8 z-[3] flex items-center gap-3 px-6 py-3 bg-white text-black font-heading uppercase text-sm border-2 border-transparent hover:bg-black hover:text-pink-400 hover:border-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? (
          <VolumeX size={18} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
        <span>{muted ? 'UNMUTE' : 'MUTE'}</span>
      </motion.button>
    </motion.section>
  )
}

export default Intro
