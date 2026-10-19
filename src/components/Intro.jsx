import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, ChevronRight } from 'lucide-react'
import { showToast } from './ToastManager'
import { trackEvent } from '../utils/analytics'
import { INTRO_DATA, HERO_DATA } from '../data/portfolioData'

const useIntroMedia = (isPreloaderDismissed, onVideoEnd) => {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!isPreloaderDismissed) return
    const video = videoRef.current
    if (!video) return

    video.muted = false
    const attempt = video.play()
    if (!attempt) return

    attempt
      .then(() => setMuted(false))
      .catch(() => {
        video.muted = true
        video.play().catch(() => {})
        setMuted(true)
      })
  }, [isPreloaderDismissed])

  const toggleAudio = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
    trackEvent('interaction', 'intro_audio_toggle', { muted: nextMuted })
    showToast({
      title: 'AUDIO TELEMETRY',
      message: nextMuted ? 'Telemetry muted' : 'Audio stream active',
      type: 'info',
      duration: 2000,
    })
  }, [])

  const handleVideoEnd = useCallback(() => {
    setTimeout(() => onVideoEnd?.(), 400)
  }, [onVideoEnd])

  return { videoRef, muted, toggleAudio, handleVideoEnd }
}

const IntroOverlayContent = ({ animState, onSkip }) => (
  <div className="absolute inset-0 z-[2] flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 max-w-2xl xl:max-w-3xl">
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -24 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate={animState}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-950/80 border border-pink-400/30 text-pink-400 text-xs font-mono tracking-wide backdrop-blur-md shadow-[0_0_10px_rgba(217,70,239,0.2)] w-fit"
    >
      <span className="w-1.5 h-1.5 bg-pink-400 animate-pulse" aria-hidden="true" />
      {HERO_DATA.statusBadge}
    </motion.div>

    <div
      role="heading"
      aria-level="2"
      className="mb-2 select-none font-heading text-[clamp(2.5rem,8vw,5.5rem)] tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none"
      aria-label={HERO_DATA.nameWords.join(' ')}
    >
      {HERO_DATA.nameWords.map((word, i) => (
        <motion.span
          key={word}
          variants={{
            hidden: { opacity: 0, x: -50, filter: 'blur(16px)' },
            visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
          }}
          initial="hidden"
          animate={animState}
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
    </div>

    <motion.div
      variants={{
        hidden: { scaleX: 0 },
        visible: { scaleX: 1 },
      }}
      initial="hidden"
      animate={animState}
      transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0 }}
      className="mb-8 w-[clamp(180px,50vw,384px)] h-1 bg-pink-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]"
      aria-hidden="true"
    />

    <div className="mb-8 space-y-1.5" aria-label="Tagline">
      {HERO_DATA.taglines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.p
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1 },
            }}
            initial="hidden"
            animate={animState}
            transition={{
              duration: 0.72,
              delay: 1.1 + i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              i === 0
                ? 'text-[clamp(1.1rem,3vw,1.75rem)] text-white font-heading uppercase tracking-widest'
                : 'text-[clamp(0.95rem,2.5vw,1.4rem)] text-zinc-400 font-sans tracking-wide'
            }
          >
            {line}
          </motion.p>
        </div>
      ))}
    </div>

    <motion.button
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate={animState}
      transition={{ delay: 1.8 }}
      onClick={onSkip}
      className="group mt-2 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-heading uppercase text-sm hover:bg-pink-400 hover:text-black transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] cursor-pointer"
      aria-label="Skip intro broadcast"
    >
      {INTRO_DATA.skipLabel}
      <ChevronRight
        size={16}
        className="group-hover:translate-x-1 transition-transform"
        aria-hidden="true"
      />
    </motion.button>
  </div>
)

// fallow-ignore-next-line complexity
const Intro = ({ onVideoEnd, onVideoReady, isPreloaderDismissed }) => {
  const { videoRef, muted, toggleAudio, handleVideoEnd } = useIntroMedia(
    isPreloaderDismissed,
    onVideoEnd,
  )

  const skipIntro = () => {
    trackEvent('interaction', 'intro_skip')
    onVideoEnd?.()
  }

  const animState = isPreloaderDismissed ? 'visible' : 'hidden'

  return (
    <motion.section
      className="fixed inset-0 z-[60] bg-zinc-950 overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Introductory broadcast"
    >
      <video
        ref={videoRef}
        src={INTRO_DATA.videoSrc}
        preload="auto"
        muted={false}
        playsInline
        loop={false}
        onEnded={handleVideoEnd}
        onCanPlayThrough={onVideoReady}
        onLoadedData={onVideoReady}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-[1] hero-left-mask" aria-hidden="true" />

      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[1]"
        style={{ background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      <div
        className="absolute top-1/4 left-0 w-[clamp(280px,40vw,450px)] h-[clamp(280px,40vw,450px)] rounded-full z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(217,70,239,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <IntroOverlayContent animState={animState} onSkip={skipIntro} />

      <motion.button
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={animState}
        transition={{ delay: 0.8 }}
        onClick={toggleAudio}
        className="absolute bottom-8 right-8 z-[3] flex items-center gap-3 px-6 py-3 bg-white text-black font-heading uppercase text-sm border-2 border-transparent hover:bg-black hover:text-pink-400 hover:border-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        aria-label={muted ? 'Unmute audio broadcast' : 'Mute audio broadcast'}
      >
        {muted ? (
          <VolumeX size={18} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
        <span>{muted ? INTRO_DATA.unmuteLabel : INTRO_DATA.muteLabel}</span>
      </motion.button>
    </motion.section>
  )
}

export default Intro
