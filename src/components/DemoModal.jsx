import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const TYPING_TEXT = 'Demo under development...'
const PROGRESS_BARS = [1, 1, 1, 0.6, 0.22] // fill ratios for the 5 AI progress bars

/**
 * DemoModal — shown when a project "Live Demo" button is clicked.
 *
 * Features:
 * - Typing animation for the status message
 * - Glitch flicker on the typed text after it completes
 * - AI-style progress indicator bar
 * - Framer Motion spring entrance/exit
 * - Keyboard accessible (Escape to close, focus trap via role=dialog)
 */
const DemoModal = ({ isOpen, onClose }) => {
  const [displayed, setDisplayed]   = useState('')
  const [glitchOn, setGlitchOn]     = useState(false)
  const indexRef    = useRef(0)
  const timerRef    = useRef(null)
  const glitchRef   = useRef(null)
  const closeBtnRef = useRef(null)

  // Reset & start typing when modal opens
  useEffect(() => {
    if (!isOpen) {
      setDisplayed('')
      setGlitchOn(false)
      indexRef.current = 0
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
      return
    }

    // Auto-focus close button for keyboard users
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 80)

    // Typing animation
    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (indexRef.current < TYPING_TEXT.length) {
          setDisplayed(TYPING_TEXT.slice(0, indexRef.current + 1))
          indexRef.current += 1
        } else {
          clearInterval(timerRef.current)
          // Periodic glitch flicker after typing completes
          glitchRef.current = setInterval(() => {
            setGlitchOn(true)
            setTimeout(() => setGlitchOn(false), 160)
          }, 3200)
        }
      }, 58)
    }, 350)

    return () => {
      clearTimeout(focusTimer)
      clearTimeout(startTimer)
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
    }
  }, [isOpen])

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-zinc-950/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              key="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Project demo coming soon"
              initial={{ opacity: 0, scale: 0.86, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.92,  y: 12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md pointer-events-auto rounded-2xl bg-zinc-900/92 border border-white/10 backdrop-blur-xl overflow-hidden"
            >
              {/* Top edge glow */}
              <div
                className="absolute top-0 left-1/4 right-1/4 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.6), transparent)' }}
                aria-hidden="true"
              />

              {/* Inner ambient orb */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #06b6d4 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 p-8">
                {/* Close button */}
                <motion.button
                  ref={closeBtnRef}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  aria-label="Close demo modal"
                >
                  <X size={14} aria-hidden="true" />
                </motion.button>

                {/* AI system indicator */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex gap-1 items-end" aria-hidden="true">
                    {[4, 6, 8, 6, 4].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                        style={{ originY: 1, height: `${h}px` }}
                        className="w-1 rounded-full bg-cyan-400 opacity-80 block"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500 tracking-[0.18em] uppercase">
                    System Status
                  </span>
                </div>

                {/* Typing headline */}
                <div className="mb-3 min-h-[2.5rem]">
                  <p
                    className={`text-2xl font-bold font-mono text-white typing-cursor ${
                      glitchOn ? 'glitch-text' : ''
                    }`}
                    aria-live="polite"
                    aria-label="Demo coming soon"
                  >
                    {displayed}
                  </p>
                </div>

                <p className="text-zinc-500 text-sm leading-relaxed mb-7">
                  This project demo is currently under active development. A live preview
                  will be available soon — check back shortly.
                </p>

                {/* AI-style progress bars */}
                <div className="space-y-2" aria-label="Development progress indicators">
                  {PROGRESS_BARS.map((fill, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: fill }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                          style={{ originX: 0 }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-700 w-8 text-right">
                        {Math.round(fill * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DemoModal
