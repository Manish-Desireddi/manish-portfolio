import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { DEMO_VARIANTS } from '../data/portfolioData'

const DEFAULT_VARIANT = {
  title: 'Demo under development.',
  body: 'This project demo is currently under active development. A live preview will be available soon - check back shortly.',
  progress: [1, 1, 1, 0.6, 0.22],
}

/**
 * DemoModal - opens when a project "Demo" button is clicked.
 * Content is variant-driven so each project can show its own status.
 */
const DemoModal = ({ isOpen, onClose, variantId }) => {
  const variant = DEMO_VARIANTS[variantId] ?? DEFAULT_VARIANT

  const [displayed, setDisplayed] = useState('')
  const [glitchOn, setGlitchOn] = useState(false)
  const [videoSrc, setVideoSrc] = useState('')
  const indexRef = useRef(0)
  const timerRef = useRef(null)
  const glitchRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (isOpen && variantId === 'video-demo') {
      fetch('/assets/demo.mp4')
        .then(res => res.blob())
        .then(blob => setVideoSrc(URL.createObjectURL(blob)))
        .catch(err => console.error(err))
    } else {
      setVideoSrc('')
    }
  }, [isOpen, variantId])

  useEffect(() => {
    if (!isOpen) {
      setDisplayed('')
      setGlitchOn(false)
      indexRef.current = 0
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
      return
    }

    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 80)

    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (indexRef.current < variant.title.length) {
          setDisplayed(variant.title.slice(0, indexRef.current + 1))
          indexRef.current += 1
        } else {
          clearInterval(timerRef.current)
          glitchRef.current = setInterval(() => {
            setGlitchOn(true)
            setTimeout(() => setGlitchOn(false), 160)
          }, 3200)
        }
      }, 48)
    }, 320)

    return () => {
      clearTimeout(focusTimer)
      clearTimeout(startTimer)
      clearInterval(timerRef.current)
      clearInterval(glitchRef.current)
    }
  }, [isOpen, variant.title])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Prevent background scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-zinc-950/90 backdrop-blur-2xl"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[71] flex items-center justify-center pointer-events-none">
            <motion.div
              key="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label={variant.title}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[100dvh] pointer-events-auto rounded-none bg-black/80 border-t-2 border-b-2 border-pink-500/50 shadow-[inset_0_0_100px_rgba(217,70,239,0.15)] overflow-y-auto flex flex-col items-center justify-center p-4 md:p-12"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, #ffb03a, #e83a73, #d946ef)' }}
                aria-hidden="true"
              />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] blur-[100px] opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #e83a73 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
                <motion.button
                  ref={closeBtnRef}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="fixed top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-black/50 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white hover:bg-pink-500/20 transition-colors focus-visible:outline-none backdrop-blur-md z-50"
                  aria-label="Close demo modal"
                >
                  <X size={24} aria-hidden="true" />
                </motion.button>

                <div className="flex items-center justify-center gap-3 mb-8 w-full">
                  <div className="flex gap-1 items-end" aria-hidden="true">
                    {[4, 6, 8, 6, 4].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                        style={{ originY: 1, height: `${h * 1.5}px` }}
                        className="w-1.5 rounded-full bg-pink-400 opacity-80 block"
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm font-mono text-pink-500 tracking-[0.2em] uppercase">
                    System Status
                  </span>
                </div>

                {variantId === 'video-demo' ? (
                  <div className="mt-4 w-full max-w-5xl mx-auto">
                    {videoSrc ? (
                      <video
                        src={videoSrc}
                        controls
                        autoPlay
                        muted
                        playsInline
                        onLoadedData={() => URL.revokeObjectURL(videoSrc)}
                        className="w-full aspect-video rounded-sm border border-pink-500/50 shadow-[0_0_30px_rgba(232,58,115,0.4)] bg-black"
                      />
                    ) : (
                      <div className="w-full aspect-video rounded-sm border border-pink-500/50 shadow-[0_0_30px_rgba(232,58,115,0.4)] bg-black flex flex-col items-center justify-center">
                        <span className="text-pink-400 font-mono animate-pulse">DECRYPTING ASSET...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-2xl mx-auto">
                    <div className="mb-3 min-h-[2.5rem]">
                      <p
                        className={`text-2xl font-bold font-heading text-white uppercase tracking-tight ${glitchOn ? 'glitch-text text-pink-400' : ''}`}
                        aria-live="polite"
                      >
                        {displayed}
                      </p>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-7">
                      {variant.body}
                    </p>

                    <div className="space-y-2" aria-label="Training / build progress">
                      {variant.progress?.map((fill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-black border border-zinc-700 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-pink-400 to-pink-500 shadow-[0_0_10px_rgba(232,58,115,0.5)]"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: fill }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                              style={{ originX: 0 }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-600 w-8 text-right">
                            {Math.round(fill * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DemoModal
