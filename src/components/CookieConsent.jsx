import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Settings, Check, X } from 'lucide-react'
import { getConsentPreferences, setConsentPreferences } from '../utils/analytics'
import { PRIVACY_DATA } from '../data/portfolioData'

const CookiePreferencesForm = ({
  analyticsAllowed,
  setAnalyticsAllowed,
  telemetryAllowed,
  setTelemetryAllowed,
  onSave,
}) => (
  <div className="space-y-4 pt-4 border-t border-zinc-800">
    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
      <div>
        <p className="font-heading text-xs uppercase tracking-wider text-white">Essential System Ops</p>
        <p className="font-mono text-[10px] text-zinc-400">Strictly required for session telemetry & routing.</p>
      </div>
      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/40">
        REQUIRED
      </span>
    </div>

    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
      <div>
        <p className="font-heading text-xs uppercase tracking-wider text-white">Performance Analytics</p>
        <p className="font-mono text-[10px] text-zinc-400">Collects anonymous frame load & viewport metrics.</p>
      </div>
      <input
        type="checkbox"
        checked={analyticsAllowed}
        onChange={(e) => setAnalyticsAllowed(e.target.checked)}
        className="w-4 h-4 accent-pink-500 rounded bg-black border-zinc-700"
      />
    </div>

    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
      <div>
        <p className="font-heading text-xs uppercase tracking-wider text-white">Error & Event Telemetry</p>
        <p className="font-mono text-[10px] text-zinc-400">Anonymous debug logs to improve WebGL/Canvas rendering.</p>
      </div>
      <input
        type="checkbox"
        checked={telemetryAllowed}
        onChange={(e) => setTelemetryAllowed(e.target.checked)}
        className="w-4 h-4 accent-pink-500 rounded bg-black border-zinc-700"
      />
    </div>

    <button
      type="button"
      onClick={onSave}
      className="w-full py-2.5 bg-pink-500 hover:bg-white text-black font-heading text-xs uppercase tracking-wider transition-colors"
    >
      Save Preferences
    </button>
  </div>
)

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)
  const [telemetryAllowed, setTelemetryAllowed] = useState(false)

  useEffect(() => {
    if (!getConsentPreferences()) {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleOpenRequest = () => {
      const current = getConsentPreferences() || { essential: true, analytics: false, telemetry: false }
      setAnalyticsAllowed(Boolean(current.analytics))
      setTelemetryAllowed(Boolean(current.telemetry))
      setShowConfig(true)
      setIsOpen(true)
    }

    window.addEventListener('sys-open-privacy-settings', handleOpenRequest)
    return () => window.removeEventListener('sys-open-privacy-settings', handleOpenRequest)
  }, [])

  const handleAcceptAll = () => {
    setConsentPreferences({ essential: true, analytics: true, telemetry: true })
    setIsOpen(false)
    setShowConfig(false)
  }

  const handleEssentialOnly = () => {
    setConsentPreferences({ essential: true, analytics: false, telemetry: false })
    setIsOpen(false)
    setShowConfig(false)
  }

  const handleSaveCustom = () => {
    setConsentPreferences({ essential: true, analytics: analyticsAllowed, telemetry: telemetryAllowed })
    setIsOpen(false)
    setShowConfig(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-[9999] bg-black/95 border-2 border-pink-500/80 p-6 shadow-2xl backdrop-blur-xl text-white font-sans"
          role="dialog"
          aria-modal="true"
          aria-label={PRIVACY_DATA.title}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-pink-400">
              <Shield size={18} />
              <span className="font-heading uppercase text-xs sm:text-sm tracking-wider">
                {PRIVACY_DATA.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Close privacy notice"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-zinc-300 font-mono text-xs leading-relaxed mb-4">
            {PRIVACY_DATA.description}
          </p>

          {!showConfig ? (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="py-2.5 px-3 bg-pink-500 hover:bg-white text-black font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> {PRIVACY_DATA.acceptButton}
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="py-2.5 px-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {PRIVACY_DATA.declineButton}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowConfig(true)}
                className="py-2 text-zinc-400 hover:text-pink-400 font-mono text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Settings size={12} /> Custom Preferences
              </button>
            </div>
          ) : (
            <CookiePreferencesForm
              analyticsAllowed={analyticsAllowed}
              setAnalyticsAllowed={setAnalyticsAllowed}
              telemetryAllowed={telemetryAllowed}
              setTelemetryAllowed={setTelemetryAllowed}
              onSave={handleSaveCustom}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
