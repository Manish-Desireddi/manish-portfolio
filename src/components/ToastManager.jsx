import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

// Global toast dispatch helper
export const showToast = (toast) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sys-show-toast', { detail: toast }))
  }
}

const TOAST_STYLE_MAP = {
  error: {
    container: 'border-red-500/80 text-red-200',
    icon: <AlertTriangle size={18} className="text-red-400" />,
  },
  warning: {
    container: 'border-amber-500/80 text-amber-200',
    icon: <AlertTriangle size={18} className="text-amber-400" />,
  },
  success: {
    container: 'border-emerald-500/80 text-emerald-200',
    icon: <CheckCircle2 size={18} className="text-emerald-400" />,
  },
  info: {
    container: 'border-pink-500/80 text-zinc-100',
    icon: <Info size={18} className="text-pink-400" />,
  },
}

const ToastItem = ({ id, title, message, type, onDismiss }) => {
  const style = TOAST_STYLE_MAP[type] || TOAST_STYLE_MAP.info

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto p-4 border bg-black/90 backdrop-blur-md shadow-2xl flex items-start gap-3 relative overflow-hidden ${style.container}`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-80" />
      <div className="mt-0.5 shrink-0">{style.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-heading uppercase tracking-wider text-xs mb-1 text-white">{title}</p>}
        <p className="font-mono text-xs leading-relaxed opacity-90 break-words">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="text-zinc-500 hover:text-white transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

const ToastManager = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (e) => {
      const { id = Date.now(), title, message, type = 'info', duration = 4000 } = e.detail
      setToasts((prev) => [...prev, { id, title, message, type }])

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
      }
    }

    window.addEventListener('sys-show-toast', handleToast)
    return () => window.removeEventListener('sys-show-toast', handleToast)
  }, [])

  return (
    <div
      className="fixed top-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastManager
