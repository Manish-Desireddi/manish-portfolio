import { showToast } from '../components/ToastManager'
import { DOWNLOAD_PROJECTS } from '../data/portfolioData'

const ASSET_UNAVAILABLE_TOAST = {
  type: 'error',
  title: 'SYS.ERR // ASSET UNAVAILABLE',
  message: 'This resource is not available at the moment.',
}

/**
 * Normalizes a route string or slug and resolves the matching download project.
 * @param {string} routeOrSlug
 * @returns {object|null}
 */
export function resolveDownloadProject(routeOrSlug) {
  if (!routeOrSlug || typeof routeOrSlug !== 'string') return null
  const clean = routeOrSlug
    .replace(/^#\/?/, '')
    .replace(/^downloads\/?/, '')
    .replace(/^\//, '')
    .split('/')[0]
    .trim()
    .toLowerCase()

  return DOWNLOAD_PROJECTS[clean] || null
}

/**
 * Triggers a download by dynamically injecting an anchor tag.
 * @param {string} url
 * @param {string} fileName
 */
function executeBrowserDownload(url, fileName) {
  const link = document.createElement('a')
  link.href = url
  if (fileName) link.download = fileName
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const isAssetAccessible = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    const contentType = res.headers.get('content-type')
    const isHtml = typeof contentType === 'string' && contentType.includes('text/html')
    return res.ok && !isHtml
  } catch {
    return false
  }
}

/**
 * Performs pre-flight HEAD verification on an asset URL before triggering browser download.
 * Flags missing resources or SPA text/html fallbacks with a styled HUD error toast.
 *
 * @param {string} url - Target asset URL
 * @param {string} [fileName] - Suggested download filename
 * @param {Function} [onVerified] - Optional callback executed on verification success
 * @returns {Promise<boolean>}
 */
export async function verifyAndTriggerDownload(url, fileName, onVerified) {
  if (!url) {
    showToast(ASSET_UNAVAILABLE_TOAST)
    return false
  }

  const accessible = await isAssetAccessible(url)
  if (!accessible) {
    showToast(ASSET_UNAVAILABLE_TOAST)
    return false
  }

  executeBrowserDownload(url, fileName)
  if (typeof onVerified === 'function') onVerified()
  return true
}
