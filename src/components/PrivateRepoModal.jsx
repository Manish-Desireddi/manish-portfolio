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
            className="fixed inset-0 z-[70] bg-zinc-950/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="repo-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Repository is private"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md pointer-events-auto rounded-2xl bg-zinc-900/92 border border-white/10 backdrop-blur-xl overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-1/4 right-1/4 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.7), transparent)' }}
                aria-hidden="true"
              />

              {/* Ambient glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-25 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #a855f7 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 p-8">
                <motion.button
                  ref={closeBtnRef}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  aria-label="Close"
                >
                  <X size={14} aria-hidden="true" />
                </motion.button>

                {/* Lock icon medallion */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 14 }}
                  className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-400/30 flex items-center justify-center mb-5"
                >
                  <Lock size={22} className="text-violet-300" aria-hidden="true" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                  This repository is resting in private.
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="mailto:manishdesireddi@gmail.com?subject=Repository%20walkthrough%20request"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-semibold hover:bg-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <Mail size={14} aria-hidden="true" />
                    Request a walkthrough
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  >
                    Maybe later
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
