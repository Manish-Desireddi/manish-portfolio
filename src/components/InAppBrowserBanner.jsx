import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Copy, X, Smartphone } from 'lucide-react'
import { isInAppBrowser, getInAppBrowserName } from '../utils/browserDetect'
import { showToast } from './ToastManager'
import { SITE_METADATA } from '../data/portfolioData'

const STORAGE_DISMISS_KEY = 'portfolio_iab_banner_dismissed_v1'

const copyCurrentUrl = async () => {
  try {
    await navigator.clipboard?.writeText(window.location.href)
    showToast({
      type: 'success',
      title: 'URL COPIED TO CLIPBOARD',
      message: 'Paste into Safari, Chrome, or Edge for the full 120Hz canvas experience.',
    })
  } catch {
    showToast({ type: 'info', title: 'BROWSER DIRECTIVE', message: 'Copy URL and open in default browser.' })
  }
}

const openExternalUrl = () => {
  const url = window.location.href
  if (/android/i.test(navigator.userAgent || '')) {
    window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`
  } else {
    window.open(url, '_system')
  }
  showToast({ type: 'info', title: 'DISPATCHING EXTERNAL BROWSER', message: 'Launching native browser...' })
}

const InAppBrowserBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return sessionStorage.getItem(STORAGE_DISMISS_KEY) === 'true'
    } catch {
      return false
    }
  })

  if (!isInAppBrowser() || dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(STORAGE_DISMISS_KEY, 'true')
    } catch {
      // Safe fallback
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-zinc-950/95 border-b border-pink-500/60 backdrop-blur-md px-3 py-2 text-xs font-mono text-zinc-300 shadow-[0_4px_25px_rgba(236,72,153,0.2)] flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Smartphone size={14} className="text-pink-400 shrink-0 animate-pulse" />
          <p className="truncate text-[11px] sm:text-xs">
            <span className="text-pink-400 font-bold uppercase mr-1">[{getInAppBrowserName() || 'WEBVIEW'}]</span>
            {SITE_METADATA.inAppBrowserBanner?.eyebrow || 'VIEWING IN EMBEDDED WEBVIEW // OPEN IN SAFARI/CHROME FOR 120HZ EXPERIENCE'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={copyCurrentUrl}
            className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-700 hover:border-pink-500 text-[10px] text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Copy size={11} />
            <span className="hidden sm:inline">{SITE_METADATA.inAppBrowserBanner?.copyLink || 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={openExternalUrl}
            className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500 hover:bg-white text-black font-heading text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ExternalLink size={11} />
            <span className="hidden sm:inline">{SITE_METADATA.inAppBrowserBanner?.openBrowser || 'Open Browser'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            aria-label={SITE_METADATA.inAppBrowserBanner?.dismissNotice || 'Dismiss Banner'}
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InAppBrowserBanner
