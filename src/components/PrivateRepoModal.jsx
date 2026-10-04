import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Mail } from 'lucide-react'

/**
 * PrivateRepoModal - shown when a user clicks a project's GitHub button.
 * Repos are intentionally kept private because they may be commercialised.
 * Tone: apologetic, warm, sincere.
 */
const PrivateRepoModal = ({ isOpen, onClose, projectTitle }) => {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      window.lenis?.stop()
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      window.lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      window.lenis?.start()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => closeBtnRef.current?.focus(), 80)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="repo-backdrop"
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
              key="repo-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Repository is private"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[100dvh] pointer-events-auto rounded-none bg-black/80 border-t-2 border-b-2 border-pink-500/50 shadow-[inset_0_0_100px_rgba(232,58,115,0.15)] overflow-y-auto flex flex-col items-center justify-center p-4 md:p-12"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, #d946ef, #e83a73, #ffb03a)' }}
                aria-hidden="true"
              />

              {/* Ambient glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] blur-[100px] opacity-25 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #e83a73 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
                <motion.button
                  ref={closeBtnRef}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="fixed top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-black/50 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white hover:bg-pink-500/20 transition-colors focus-visible:outline-none backdrop-blur-md z-50"
                  aria-label="Close"
                >
                  <X size={24} aria-hidden="true" />
                </motion.button>

                {/* Lock icon medallion */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 14 }}
                  className="w-14 h-14 bg-black border border-pink-500/50 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(232,58,115,0.4)]"
                >
                  <Lock size={26} className="text-pink-400" aria-hidden="true" />
                </motion.div>

                <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-tight mb-3 text-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  Restricted Access.
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  I'm sorry for the closed door here{projectTitle ? <> on <span className="text-white font-medium">{projectTitle}</span></> : null}.
                  This codebase is being kept private for now because it may grow into something
                  commercial, and I want to be careful with the work before it's ready for the world.
                </p>

                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  Thank you for the curiosity - it genuinely means a lot. If you'd like a guided
                  walkthrough, architecture notes, or a demo, I'd be more than happy to share
                  privately.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full">
                  <a
                    href="mailto:manishdesireddi@gmail.com?subject=Repository%20walkthrough%20request"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 text-black text-sm font-heading uppercase hover:bg-white transition-colors border border-transparent hover:border-pink-500 w-full sm:w-auto"
                  >
                    <Mail size={18} aria-hidden="true" />
                    Request Access
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-8 py-4 bg-black border border-zinc-600 text-white font-heading uppercase hover:border-pink-400 transition-colors w-full sm:w-auto text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PrivateRepoModal
