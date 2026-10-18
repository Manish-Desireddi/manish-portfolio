// Modular Telemetry & Event Dispatcher
// Gates all analytics events behind user privacy preferences (GDPR/ePrivacy compliant)

const STORAGE_KEY = 'sys_privacy_consent_v1'

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
    window.dispatchEvent(new CustomEvent('sys-privacy-consent-changed', { detail: prefs }))
  } catch {
    // Safe storage fallback
  }
}

const canDispatchEvent = (category, prefs) => {
  if (category === 'essential') return true
  return Boolean(prefs?.analytics)
}

const isDebugTelemetryEnabled = () => {
  if (typeof window === 'undefined') return false
  return window.location.search.includes('debug=true') || Boolean(import.meta.env?.DEV)
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

  if (isDebugTelemetryEnabled()) {
    console.debug('[SYS.TELEMETRY]', payload)
  }

  globalThis.window?.dataLayer?.push(payload)
}
