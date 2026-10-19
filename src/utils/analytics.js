// Modular Telemetry & Event Dispatcher
// Gates all analytics events behind user privacy preferences (GDPR/ePrivacy compliant)
import { track } from '@vercel/analytics'

const STORAGE_KEY = 'sys_privacy_consent_v1'
const PERF_METRICS_KEY = 'sys_perf_metrics'
const MAX_METRICS_RECORDS = 50

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
    window.dispatchEvent(new CustomEvent('sys-privacy-consent-changed', { detail: prefs }))
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
 */
export const trackEvent = (category, action, metadata = {}) => {
  const prefs = getConsentPreferences()
  if (!canDispatchEvent(category, prefs)) return

  const payload = {
    category,
    action,
    metadata,
    timestamp: new Date().toISOString(),
    viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
  }

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
