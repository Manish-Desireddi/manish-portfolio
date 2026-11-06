// In-App Browser & Mobile WebView Detector
// Handles embedded WebViews across Instagram, Facebook, LinkedIn, X/Twitter, WhatsApp, etc.

const IN_APP_REGEX = /Instagram|FBAN|FBAV|LinkedInApp|Twitter|WhatsApp|Line|Snapchat|wv/i
const IOS_WEBVIEW_REGEX = /(iPhone|iPad|iPod).*AppleWebKit(?!.*Safari)/i

const APP_MATCHERS = [
  [/Instagram/i, 'Instagram'],
  [/LinkedInApp/i, 'LinkedIn'],
  [/Twitter/i, 'X / Twitter'],
  [/WhatsApp/i, 'WhatsApp'],
  [/FBAN|FBAV/i, 'Facebook'],
]

export const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export const isInAppBrowser = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return IN_APP_REGEX.test(ua) || IOS_WEBVIEW_REGEX.test(ua)
}

export const getInAppBrowserName = () => {
  if (typeof navigator === 'undefined') return ''
  const ua = navigator.userAgent || ''
  const found = APP_MATCHERS.find(([regex]) => regex.test(ua))
  if (found) return found[1]
  return isInAppBrowser() ? 'Embedded WebView' : ''
}
