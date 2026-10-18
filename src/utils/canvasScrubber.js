// Centralized Canvas Scrubber & Frame Loader Utilities
// Centralizes Blob fetching, revokeObjectURL, DPR-clamped sizing, aspect-fill crop math, and unified preloader

import { useEffect, useState } from 'react'

/**
 * Updates canvas backing store dimensions clamped to DPR limits.
 */
export const syncCanvasBackingStore = (canvas) => {
  if (!canvas) return
  const isMobile = window.innerWidth < 768
  const maxDpr = isMobile ? 1.5 : 2.0
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  canvas.width = Math.round(window.innerWidth * dpr)
  canvas.height = Math.round(window.innerHeight * dpr)
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

/**
 * Draws an image into a canvas context with centered aspect-fill focal crop.
 */
// fallow-ignore-next-line complexity
export const drawAspectFillFrame = (canvas, context, img) => {
  if (!canvas || !context || !img?.naturalWidth) return
  const { drawW, drawH, dx, dy } = computeCropDimensions(
    canvas.width,
    canvas.height,
    img.naturalWidth,
    img.naturalHeight
  )
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(img, dx, dy, drawW, drawH)
}

/**
 * Loads a single image via Blob URL with guaranteed cleanup.
 */
const fetchSingleFrame = (url) => {
  const img = new Image()
  img.decoding = 'async'
  img.loading = 'eager'

  return fetch(url)
    .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`HTTP ${res.status}`))))
    .then(
      (blob) =>
        new Promise((resolve) => {
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
    )
    .catch(() => Promise.resolve(null))
}

const preloadBatch = async (urls, onFrameLoaded) => {
  const promises = urls.map((url) =>
    fetchSingleFrame(url).then((img) => {
      onFrameLoaded?.()
      return img
    })
  )
  return Promise.all(promises)
}

/**
 * Hook to concurrently preload all 1,192 frames (592 hero + 600 projects).
 * Tracks an atomic counter from 0 to 1192 and exposes bufferProgress (0-100%).
 */
export const useUnifiedPreloader = (hasEntered, isVideoReady) => {
  const [bufferProgress, setBufferProgress] = useState(0)
  const [isPreloadComplete, setIsPreloadComplete] = useState(false)
  const [heroFrames, setHeroFrames] = useState([])
  const [projectFrames, setProjectFrames] = useState([])

  useEffect(() => {
    if (!hasEntered) return
    let isCancelled = false

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    const projectDir = isMobile ? 'projects_frames_mobile' : 'projects_frames'

    const heroUrls = Array.from({ length: 592 }, (_, i) =>
      `/assets/hero_frames/frame_${(i + 1).toString().padStart(4, '0')}.jpg`
    )
    const projectUrls = Array.from({ length: 600 }, (_, i) =>
      `/assets/${projectDir}/frame_${(i + 1).toString().padStart(4, '0')}.jpg`
    )

    const totalFrames = heroUrls.length + projectUrls.length
    let loadedCount = 0

    const onFrameLoaded = () => {
      if (isCancelled) return
      loadedCount += 1
      setBufferProgress(Math.round((loadedCount / totalFrames) * 100))
    }

    Promise.all([
      preloadBatch(heroUrls, onFrameLoaded),
      preloadBatch(projectUrls, onFrameLoaded),
    ]).then(([heroes, projects]) => {
      if (isCancelled) return
      setHeroFrames(heroes)
      setProjectFrames(projects)
      setIsPreloadComplete(true)
    })

    return () => {
      isCancelled = true
    }
  }, [hasEntered])

  return {
    bufferProgress,
    isPreloadComplete,
    isAllReady: isPreloadComplete && isVideoReady,
    heroFrames,
    projectFrames,
  }
}
