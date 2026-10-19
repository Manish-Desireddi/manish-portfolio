import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ShieldCheck, Mail } from 'lucide-react'
import { DEMO_VARIANTS } from '../data/portfolioData'
import { modalSpring } from '../utils/motionVariants'
import { useModalLifecycle, scrollToContactSection } from '../utils/useModalLifecycle'
import { trackEvent } from '../utils/analytics'

const DEFAULT_VARIANT = {
  title: 'Demo Under Development',
  body: 'This project demo is currently under active engineering refinement.',
  status: 'PENDING RELEASE',
  gateStatus: 'pending',
}

const DeploymentTelemetryPipeline = ({ variant }) => {
  const isGateVerified = variant.gateStatus === 'verified'

  return (
    <div className="my-6 p-3.5 bg-zinc-950/90 border border-zinc-900 text-left">
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-900 pb-1.5">
        <span>DEPLOYMENT PIPELINE</span>
        <span className="text-pink-400">TELEMETRY 3-NODE</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">[01] CORE ARCHITECTURE</span>
          </div>
          <span className="text-emerald-400 text-[11px] font-bold">VERIFIED</span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">[02] WEIGHTS & RUNTIME</span>
          </div>
          <span className="text-emerald-400 text-[11px] font-bold">VERIFIED</span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isGateVerified ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-zinc-300">[03] PUBLIC ACCESS GATE</span>
          </div>
          <span
            className={`text-[11px] font-bold ${
              isGateVerified ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {variant.status || 'PENDING RELEASE'}
          </span>
        </div>
      </div>
    </div>
  )
}

const DemoModal = ({ isOpen, onClose, variantId, projectTitle }) => {
  const variant = DEMO_VARIANTS[variantId] ?? DEFAULT_VARIANT
  const closeBtnRef = useRef(null)

  useModalLifecycle(isOpen, onClose, closeBtnRef)

  const handleRequestWalkthrough = () => {
    trackEvent('contact', 'request_demo_walkthrough', { project: projectTitle, variantId })
    onClose()
    scrollToContactSection()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="demo-backdrop"
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
              key="demo-panel"
              role="dialog"
              aria-modal="true"
              aria-label={variant.title}
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
                <ShieldCheck size={16} />
                <span>DEPLOYMENT PROTOCOL // SANDBOX STATUS</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-heading text-white uppercase tracking-tight mb-3">
                {variant.title}
              </h3>

              <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed mb-4">
                Telemetry for <span className="text-pink-400 font-bold">{projectTitle || 'Target Architecture'}</span>: {variant.body}
              </p>

              <DeploymentTelemetryPipeline variant={variant} />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {variantId === 'modal-subq' ? (
                  <a
                    href="https://github.com/Manish-Desireddi/Sub-Quadratic-Audio-Transformer-Engine"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('interaction', 'open_subq_repo')}
                    className="px-6 py-3 bg-pink-500 hover:bg-white text-black font-heading uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  >
                    <ExternalLink size={16} /> ACCESS GITHUB REPOSITORY
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestWalkthrough}
                    className="px-6 py-3 bg-pink-500 hover:bg-white text-black font-heading uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  >
                    <Mail size={16} /> REQUEST LIVE WALKTHROUGH
                  </button>
                )}

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

export default DemoModal
