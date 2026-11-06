import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { unlockAudioContext } from '../utils/audioContext'
import { trackEvent } from '../utils/analytics'
import { HANDSHAKE_DATA } from '../data/portfolioData'
import { primeIntroVideo } from './Intro'

const EnterOverlay = ({ onEnter }) => {
  const handleInitiate = async (e) => {
    e.preventDefault()
    trackEvent('interaction', 'handshake_initiated')
    primeIntroVideo()
    await unlockAudioContext()
    onEnter?.()
  }

  return (
    <AnimatePresence>
      <motion.div
        key="enter-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-app-dark px-6 text-center select-none"
      >
        <button
          type="button"
          autoFocus
          onClick={handleInitiate}
          aria-label={HANDSHAKE_DATA.ariaLabel}
          className="relative z-10 flex flex-col items-center gap-6 p-8 bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        >
          <motion.span
            animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="font-heading text-[clamp(2rem,8vw,5.5rem)] text-pink-500 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(236,72,153,0.6)] leading-none text-center"
          >
            {HANDSHAKE_DATA.title}
          </motion.span>
          <span className="font-oswald text-zinc-400 uppercase tracking-[0.25em] text-[clamp(0.75rem,2vw,1rem)] border-b border-zinc-700 pb-2 group-hover:text-white transition-colors">
            {HANDSHAKE_DATA.subtitle}
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default EnterOverlay
