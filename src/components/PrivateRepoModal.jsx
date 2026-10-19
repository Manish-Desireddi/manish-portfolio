import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { modalSpring } from '../utils/motionVariants'
import { useModalLifecycle, scrollToContactSection } from '../utils/useModalLifecycle'
import { trackEvent } from '../utils/analytics'
import { MODALS_DATA } from '../data/portfolioData'

const PrivateRepoModal = ({ isOpen, onClose, projectTitle }) => {
  const closeBtnRef = useRef(null)

  useModalLifecycle(isOpen, onClose, closeBtnRef)

  const handleRequestAccess = () => {
    trackEvent('contact', 'request_private_repo_access', { project: projectTitle })
    onClose()
    scrollToContactSection()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="repo-backdrop"
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
              key="repo-panel"
              role="dialog"
              aria-modal="true"
              aria-label={MODALS_DATA.privateRepo.title}
              variants={modalSpring}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg pointer-events-auto bg-black/90 border-2 border-pink-500/80 shadow-[0_0_50px_rgba(236,72,153,0.25)] p-6 sm:p-8 text-center"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500"
                aria-hidden="true"
              />

              <div className="flex items-center justify-center gap-2 mb-4 text-orange-400 font-mono text-xs uppercase tracking-widest">
                <Lock size={16} />
                <span>{MODALS_DATA.privateRepo.badge}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-heading text-white uppercase tracking-tight mb-3">
                {MODALS_DATA.privateRepo.title}
              </h3>

              <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                Source code for <span className="text-pink-400 font-bold">{projectTitle}</span> contains proprietary architecture, patent-pending IP, or enterprise client logic.
              </p>

              <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-8 bg-zinc-950 p-3 border border-zinc-900">
                {MODALS_DATA.privateRepo.message}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRequestAccess}
                  className="px-6 py-3 bg-pink-500 hover:bg-white text-black font-heading uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                >
                  <Mail size={16} /> {MODALS_DATA.privateRepo.actionButton}
                </button>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-heading uppercase tracking-wider text-xs sm:text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Dismiss Notice
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PrivateRepoModal
