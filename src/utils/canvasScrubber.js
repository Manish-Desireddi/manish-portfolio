// Centralized Canvas Scrubber & Frame Loader Utilities
// Centralizes dynamic concurrency, mobile ImageBitmap decoding, DPR-clamped sizing, aspect-fill crop math, and unified preloader

import { useEffect, useState } from 'react'

/**
 * Updates canvas backing store dimensions clamped to DPR limits.
 * Width-guarded: skips resize when only innerHeight changes (iOS URL bar collapses).
 */
export const syncCanvasDimensions = (canvas, onResized) => {
  if (!canvas) return false
  const currentWidth = Math.round(window.visualViewport?.width || window.innerWidth)
  if (canvas.dataset?.syncedWidth === String(currentWidth) && canvas.width > 0) {
    return false
  }
  if (canvas.dataset) {
    canvas.dataset.syncedWidth = String(currentWidth)
  }
  const isMobile = currentWidth < 768
  const maxDpr = isMobile ? 1.5 : 2.0
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  const currentHeight = Math.round(window.visualViewport?.height || window.innerHeight)
  canvas.width = Math.round(currentWidth * dpr)
  canvas.height = Math.round(currentHeight * dpr)
  onResized?.()
  return true
}


const computeCropDimensions = (cw, ch, iw, ih) => {
  const canvasAspect = cw / ch
  const imageAspect = iw / ih

  if (canvasAspect > imageAspect) {
    const drawH = cw / imageAspect
    return { drawW: cw, drawH, dx: 0, dy: (ch - drawH) / 2 }
  }
  const drawW = ch * imageAspect
  return { drawW, drawH: ch, dx: (cw - drawW) / 2, dy: 0 }
}

const getImageDimensions = (img) => {
  if (!img) return null
  const width = img.naturalWidth || img.width || 0
  const height = img.naturalHeight || img.height || 0
  if (width === 0 || height === 0) return null
  return { width, height }
}

/**
 * Draws an image or ImageBitmap into a canvas context with centered aspect-fill focal crop.
 */
// fallow-ignore-next-line complexity
export const drawCanvasFrame = (canvas, context, img) => {
  if (!canvas || !context || !img) return
  const dims = getImageDimensions(img)
  if (!dims) return
  const { drawW, drawH, dx, dy } = computeCropDimensions(
    canvas.width,
    canvas.height,
    dims.width,
    dims.height
  )
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(img, dx, dy, drawW, drawH)
}

const decodeFrame = async (blob, isMobile) => {
  if (isMobile && typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob, {
        resizeWidth: 960,
        resizeQuality: 'medium',
      })
    } catch {
      // Fallback to Image element
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.loading = 'eager'
    const objectUrl = URL.createObjectURL(blob)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(null)
    }
    img.src = objectUrl
  })
}

const fetchSingleFrameWithRetry = async (url, isMobile) => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const decoded = await decodeFrame(blob, isMobile)
      if (decoded) return decoded
    } catch {
      // Retry once on failure
    }
  }
  return null
}

const mapConcurrent = async (items, concurrency, fn) => {
  const results = new Array(items.length)
  let currentIndex = 0

  const worker = async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex
      currentIndex += 1
      results[idx] = await fn(items[idx], idx)
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  )
  await Promise.all(workers)
  return results
}

const fillMissingFrames = (frames) => {
  let lastValid = null
  for (let i = 0; i < frames.length; i += 1) {
    if (frames[i]) {
      lastValid = frames[i]
    } else if (lastValid) {
      frames[i] = lastValid
    }
  }
  if (lastValid) {
    for (let i = 0; i < frames.length; i += 1) {
      if (!frames[i]) frames[i] = lastValid
      else break
    }
  }
  return frames
}

const getDeviceConcurrency = () => {
  if (typeof window === 'undefined') return 16
  const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
  const hardwareCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4
  if (isMobile) {
    return Math.min(16, Math.max(8, hardwareCores * 2))
  }
  return Math.min(24, Math.max(16, hardwareCores * 3))
}

/**
 * Hook to concurrently preload all 1,192 frames (592 hero + 600 projects).
 * Tracks an atomic counter from 0 to 1192 and exposes bufferProgress (0-100%).
 */
export const useAssetPreloader = (hasEntered) => {
  const [bufferProgress, setBufferProgress] = useState(0)
  const [isPreloadComplete, setIsPreloadComplete] = useState(false)
  const [heroFrames, setHeroFrames] = useState([])
  const [projectFrames, setProjectFrames] = useState([])

  useEffect(() => {
    if (!hasEntered) return
    let isCancelled = false

    const isMobile = typeof window !== 'undefined'
      && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)
    const projectDir = isMobile ? 'projects_frames_mobile' : 'projects_frames'
    const concurrency = getDeviceConcurrency()

    const heroUrls = Array.from({ length: 592 }, (_, i) =>
      `/assets/hero_frames/frame_${(i + 1).toString().padStart(4, '0')}.jpg`
    )
    const projectUrls = Array.from({ length: 600 }, (_, i) =>
      `/assets/${projectDir}/frame_${(i + 1).toString().padStart(4, '0')}.jpg`
    )

    const totalFrames = heroUrls.length + projectUrls.length
    let loadedCount = 0

    const loadWithProgress = (url) =>
      fetchSingleFrameWithRetry(url, isMobile).then((frame) => {
        if (!isCancelled) {
          loadedCount += 1
          setBufferProgress(Math.round((loadedCount / totalFrames) * 100))
        }
        return frame
      })

    Promise.all([
      mapConcurrent(heroUrls, concurrency, loadWithProgress),
      mapConcurrent(projectUrls, concurrency, loadWithProgress),
    ]).then(([heroes, projects]) => {
      if (isCancelled) return
      setHeroFrames(fillMissingFrames(heroes))
      setProjectFrames(fillMissingFrames(projects))
      setIsPreloadComplete(true)
    })

    return () => {
      isCancelled = true
    }
  }, [hasEntered])

  return {
    bufferProgress,
    isPreloadComplete,
    heroFrames,
    projectFrames,
  }
}
