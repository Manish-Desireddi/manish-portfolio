// Modular Telemetry & Event Dispatcher
// Gates all analytics events behind user privacy preferences (GDPR/ePrivacy compliant)
import { track } from '@vercel/analytics'

const STORAGE_KEY = 'sys_privacy_consent_v1'
const PERF_METRICS_KEY = 'sys_perf_metrics'
const MAX_METRICS_RECORDS = 50
const MAX_SESSION_EVENTS = 100
const MAX_PENDING_QUEUE = 50

// In-memory queues
const pendingConsentQueue = []
const liveSessionEvents = []

const purgeNonEssentialStorage = (prefs) => {
  if (typeof window === 'undefined') return
  try {
    if (!prefs?.telemetry) {
      sessionStorage.removeItem('returnScrollY')
      localStorage.removeItem(PERF_METRICS_KEY)
      sessionStorage.removeItem(PERF_METRICS_KEY)
    }
    if (!prefs?.analytics) {
      const nonEssentialKeys = ['sys_analytics_id', 'sys_visitor_session', 'telemetry_cache']
      nonEssentialKeys.forEach((key) => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    }
  } catch {
    // Safe storage fallback
  }
}

export const getConsentPreferences = () => {
  if (typeof window === 'undefined') return { essential: true, analytics: false, telemetry: false }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return { essential: true, analytics: false, telemetry: false }
  }
}

export const setConsentPreferences = (prefs) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    if (!prefs?.analytics || !prefs?.telemetry) {
      purgeNonEssentialStorage(prefs)
    }

    // 1. Dispatch custom event first to sync UI/providers
    window.dispatchEvent(new CustomEvent('sys-privacy-consent-changed', { detail: prefs }))

    // 2. Track explicit cookie_consent_updated event
    try {
      if (prefs?.analytics) {
        track('cookie_consent_updated', {
          analytics: Boolean(prefs.analytics),
          telemetry: Boolean(prefs.telemetry),
        })
      }
    } catch {
      // Vercel analytics fallback
    }

    // 3. Defer pre-consent event queue flush by 150ms so window.va is initialized
    setTimeout(() => {
      if (pendingConsentQueue.length > 0) {
        if (prefs?.analytics) {
          pendingConsentQueue.forEach((ev) => {
            try {
              track(ev.action, { category: ev.category, ...ev.metadata })
            } catch {
              // Vercel analytics fallback
            }
          })
        }
        if (prefs?.telemetry) {
          pendingConsentQueue.forEach((ev) => {
            appendPerfMetric({
              action: ev.action,
              category: ev.category,
              metadata: ev.metadata,
              timestamp: ev.timestamp,
            })
          })
        }
        pendingConsentQueue.length = 0
      }
    }, 150)
  } catch {
    // Safe storage fallback
  }
}

const canDispatchEvent = (category, prefs) => {
  if (category === 'essential') return true
  if (category === 'navigation' || category === 'interaction' || category === 'download' || category === 'contact') {
    return Boolean(prefs?.analytics)
  }
  if (category === 'telemetry' || category === 'error' || category === 'performance') {
    return Boolean(prefs?.telemetry)
  }
  return false
}

const isDebugTelemetryEnabled = () => {
  if (typeof window === 'undefined') return false
  return window.location.search.includes('debug=true') || Boolean(import.meta.env?.DEV)
}

const appendPerfMetric = (metric) => {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(PERF_METRICS_KEY)
    const list = raw ? JSON.parse(raw) : []
    const updated = Array.isArray(list) ? list : []
    updated.push(metric)
    if (updated.length > MAX_METRICS_RECORDS) {
      updated.splice(0, updated.length - MAX_METRICS_RECORDS)
    }
    localStorage.setItem(PERF_METRICS_KEY, JSON.stringify(updated))
  } catch {
    // Safe storage fallback
  }
}

/**
 * Dispatches an event according to category and telemetry permission.
 * Buffers pre-consent events in pendingConsentQueue until user interacts with CookieConsent.
 * Records liveSessionEvents regardless of consent for in-session CLI display.
 */
export const trackEvent = (category, action, metadata = {}) => {
  const payload = {
    category,
    action,
    metadata,
    timestamp: new Date().toISOString(),
    viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
  }

  // Record into in-memory live session events for immediate CLI vitals display
  liveSessionEvents.push(payload)
  if (liveSessionEvents.length > MAX_SESSION_EVENTS) {
    liveSessionEvents.shift()
  }

  const prefs = getConsentPreferences()

  // Pre-consent: queue until user sets preferences
  if (prefs === null) {
    pendingConsentQueue.push(payload)
    if (pendingConsentQueue.length > MAX_PENDING_QUEUE) {
      pendingConsentQueue.shift()
    }
    if (isDebugTelemetryEnabled()) {
      console.debug('[SYS.TELEMETRY:QUEUED]', payload)
    }
    return
  }

  if (!canDispatchEvent(category, prefs)) return

  if (prefs?.telemetry) {
    appendPerfMetric({ action, category, metadata, timestamp: payload.timestamp })
  }

  if (prefs?.analytics) {
    try {
      track(action, { category, ...metadata })
    } catch {
      // Vercel analytics fallback
    }
  }

  if (isDebugTelemetryEnabled()) {
    console.debug('[SYS.TELEMETRY]', payload)
  }

  globalThis.window?.dataLayer?.push(payload)
}

const readNavDomLoadMs = () => {
  try {
    const nav = window.performance?.getEntriesByType?.('navigation')?.[0]
    return nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) || Math.round(nav.duration) : 140
  } catch {
    return 140
  }
}

const readStoredPerfMetrics = () => {
  try {
    const raw = localStorage.getItem(PERF_METRICS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const getJsHeapMemory = () => {
  const mem = window.performance?.memory?.usedJSHeapSize
  return mem ? `${Math.round(mem / 1048576)}MB` : 'Active'
}

/**
 * Exports aggregated telemetry and performance metrics for the Interactive CLI & Admin Bar.
 * Strictly limits recentEvents to the last 3 events.
 */
export const getStoredMetricsSummary = () => {
  if (typeof window === 'undefined') {
    return { domLoadMs: 0, bufferMs: 0, dpr: 1, recentEvents: [] }
  }

  const events = liveSessionEvents.length > 0 ? liveSessionEvents : readStoredPerfMetrics()
  const preloader = events.find((ev) => ev.action === 'preloader_complete')

  return {
    domLoadMs: Math.max(readNavDomLoadMs(), 140),
    bufferMs: preloader?.metadata?.loadDurationMs || 420,
    dpr: window.devicePixelRatio || 1,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    memory: getJsHeapMemory(),
    recentEvents: events.slice(-3).reverse(),
  }
}
