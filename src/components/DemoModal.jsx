import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, ShieldCheck } from 'lucide-react'
import { DEMO_VARIANTS } from '../data/portfolioData'
import { modalSpring } from '../utils/motionVariants'
import { useModalLifecycle } from '../utils/useModalLifecycle'
import { trackEvent } from '../utils/analytics'

const DEFAULT_VARIANT = {
  title: 'Demo under development.',
  body: 'This project demo is currently under active development. A live preview will be available soon - check back shortly.',
  progress: [1, 1, 1, 0.6, 0.22],
}

const useTypewriterEffect = (isOpen, text) => {
  const [displayed, setDisplayed] = useState('')
  const [glitchOn, setGlitchOn] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef(null)
  const glitchRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setDisplayed('')
      setGlitchOn(false)
      indexRef.current = 0
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
      return
    }

    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1))
          indexRef.current += 1
        } else {
          clearInterval(timerRef.current)
          glitchRef.current = setInterval(() => {
            setGlitchOn(true)
            setTimeout(() => setGlitchOn(false), 160)
          }, 3200)
        }
      }, 40)
    }, 200)

    return () => {
      clearTimeout(startTimer)
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
    }
  }, [isOpen, text])

  return { displayed, glitchOn }
}

// fallow-ignore-next-line complexity
const DemoModal = ({ isOpen, onClose, variantId }) => {
  const variant = DEMO_VARIANTS[variantId] ?? DEFAULT_VARIANT
  const closeBtnRef = useRef(null)

  useModalLifecycle(isOpen, onClose, closeBtnRef)
  const { displayed, glitchOn } = useTypewriterEffect(isOpen, variant.title)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-zinc-950/90 backdrop-blur-2xl"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label={variant.title}
              variants={modalSpring}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl pointer-events-auto bg-black/90 border-2 border-pink-500/80 shadow-[0_0_50px_rgba(236,72,153,0.25)] p-6 sm:p-10 text-center"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500"
                aria-hidden="true"
              />

              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 border border-zinc-700 text-pink-400 hover:text-white hover:border-pink-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close demo modal"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="flex items-center justify-center gap-2 mb-6 text-pink-500 font-mono text-xs uppercase tracking-widest">
                <ShieldCheck size={16} />
                <span>SYS.MODULE // STATUS_TELEMETRY</span>
              </div>

              <div className="mb-4 min-h-[3rem] flex items-center justify-center">
                <p
                  className={`text-2xl sm:text-3xl font-heading text-white uppercase tracking-tight ${
                    glitchOn ? 'glitch-text text-pink-400' : ''
                  }`}
                  aria-live="polite"
                >
                  {displayed}
                </p>
              </div>

              <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
                {variant.body}
              </p>

              {variantId === 'modal-subq' ? (
                <div className="mt-8 flex justify-center">
                  <a
                    href="https://github.com/Manish-Desireddi/Sub-Quadratic-Audio-Transformer-Engine"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('interaction', 'open_subq_repo')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-black font-heading uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                  >
                    Open GitHub Repository <ExternalLink size={18} />
                  </a>
                </div>
              ) : (
                variant.progress && (
                  <div className="space-y-2.5 max-w-md mx-auto pt-4" aria-label="Build progress">
                    {variant.progress.map((fill, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-zinc-950 border border-zinc-800 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: fill }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                            style={{ originX: 0 }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 w-10 text-right">
                          {Math.round(fill * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DemoModal
