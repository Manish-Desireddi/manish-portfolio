// Shared Web Audio API Engine & Global Haptic Sound System
const HAPTIC_STORAGE_KEY = 'portfolio_audio_haptic_muted'
let sharedAudioContext = null
let clickAudioInstance = null
const audioBufferCache = new Map()
const bufferLoadingPromises = new Map()

export const isAudioHapticMuted = () => {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(HAPTIC_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const setAudioHapticMuted = (muted) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HAPTIC_STORAGE_KEY, muted ? 'true' : 'false')
    window.dispatchEvent(
      new CustomEvent('portfolio-audio-haptic-changed', { detail: { muted: Boolean(muted) } })
    )
  } catch {
    // Safe storage fallback
  }
}

export const toggleAudioHaptic = () => {
  const current = isAudioHapticMuted()
  const next = !current
  setAudioHapticMuted(next)
  return next
}

const initAudioContextInstance = () => {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  return AudioContextClass ? new AudioContextClass() : null
}

const getSharedAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!sharedAudioContext) {
    sharedAudioContext = initAudioContextInstance()
  }
  return sharedAudioContext
}

const loadAudioBuffer = async (src) => {
  if (typeof window === 'undefined') return null
  if (audioBufferCache.has(src)) {
    return audioBufferCache.get(src)
  }
  if (bufferLoadingPromises.has(src)) {
    return bufferLoadingPromises.get(src)
  }

  const loadPromise = (async () => {
    const ctx = getSharedAudioContext()
    if (!ctx) return null
    try {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer)
      audioBufferCache.set(src, decodedBuffer)
      return decodedBuffer
    } catch {
      return null
    } finally {
      bufferLoadingPromises.delete(src)
    }
  })()

  bufferLoadingPromises.set(src, loadPromise)
  return loadPromise
}

const preloadAudioBuffers = async () => {
  const assets = [
    '/assets/sfx/leadership-reveal.mp3',
    '/assets/sfx/cgpa-count.mp3',
    '/assets/sfx/expertise-reveal.mp3',
    '/assets/sfx/experience-zipway.mp3',
    '/assets/sfx/cert-slide.mp3',
  ]
  return Promise.all(assets.map((src) => loadAudioBuffer(src)))
}

export const unlockAudioContext = async () => {
  const ctx = getSharedAudioContext()
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      // Ignore user gesture rejection
    }
  }
  preloadAudioBuffers().catch(() => {})
  return ctx
}

export const playMechanicalClick = () => {
  if (isAudioHapticMuted()) return
  try {
    if (typeof Audio === 'undefined') return
    if (!clickAudioInstance) {
      clickAudioInstance = new Audio('/assets/mech-click.mp3')
      clickAudioInstance.volume = 0.25
    }
    clickAudioInstance.currentTime = 0
    clickAudioInstance.play().catch(() => {})
  } catch {
    // Safe audio fallback
  }
}

export const playSubBassCue = () => {
  if (isAudioHapticMuted()) return
  try {
    const ctx = getSharedAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.5)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.5)
  } catch {
    // Safe audio fallback
  }
}

// Low-latency AudioBuffer player with seamless HTMLAudioElement fallback
const playBufferSfx = (src, volume = 0.3, loop = false) => {
  if (isAudioHapticMuted()) {
    const noop = () => {}
    noop.stop = noop
    return noop
  }

  const ctx = getSharedAudioContext()
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const buffer = audioBufferCache.get(src)
    if (buffer) {
      try {
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = loop

        const gainNode = ctx.createGain()
        gainNode.gain.setValueAtTime(volume, ctx.currentTime)

        source.connect(gainNode)
        gainNode.connect(ctx.destination)
        source.start(0)

        const stopFn = () => {
          try {
            source.stop()
          } catch {
            // Already stopped
          }
        }
        stopFn.stop = stopFn
        stopFn.sourceNode = source
        stopFn.gainNode = gainNode
        return stopFn
      } catch {
        // Fallback to HTMLAudioElement
      }
    } else {
      // Trigger background decode for next play
      loadAudioBuffer(src).catch(() => {})
    }
  }

  // HTMLAudioElement Fallback
  if (typeof Audio !== 'undefined') {
    try {
      const audio = new Audio(src)
      audio.volume = volume
      audio.loop = loop
      const promise = audio.play()
      const stopFn = () => {
        if (promise !== undefined) {
          promise.then(() => {
            audio.pause()
            audio.currentTime = 0
          }).catch(() => {})
        } else {
          audio.pause()
          audio.currentTime = 0
        }
      }
      stopFn.stop = stopFn
      return stopFn
    } catch {
      const noop = () => {}
      noop.stop = noop
      return noop
    }
  }

  const noop = () => {}
  noop.stop = noop
  return noop
}

// --- Leadership Reveal Whoosh (150ms deduplication cooldown) ---
let lastLeadershipWhooshTime = 0
export const playLeadershipRevealSfx = () => {
  if (typeof performance === 'undefined') return () => {}
  const now = performance.now()
  if (now - lastLeadershipWhooshTime < 150) {
    const noop = () => {}
    noop.stop = noop
    return noop
  }
  lastLeadershipWhooshTime = now
  return playBufferSfx('/assets/sfx/leadership-reveal.mp3', 0.35)
}

// --- Leadership CGPA Counter Loop ---
export const playCgpaCountSfx = () => {
  return playBufferSfx('/assets/sfx/cgpa-count.mp3', 0.3, true)
}

// --- Expertise Section Card Hover / Tap ---
export const playExpertiseRevealSfx = () => {
  return playBufferSfx('/assets/sfx/expertise-reveal.mp3', 0.3)
}

// --- Certifications Slide (Untouched Contract) ---
export const playCertSlideSfx = () => {
  return playBufferSfx('/assets/sfx/cert-slide.mp3', 0.25)
}

// --- Experience Zipway Rail Audio Controller ---
let zipwaySourceNode = null
let zipwayGainNode = null

export const updateExperienceZipwayAudio = (velocity, inBounds) => {
  if (isAudioHapticMuted()) {
    stopExperienceZipwayAudio()
    return
  }

  const ctx = getSharedAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }

  const buffer = audioBufferCache.get('/assets/sfx/experience-zipway.mp3')
  if (!buffer) {
    loadAudioBuffer('/assets/sfx/experience-zipway.mp3').catch(() => {})
    return
  }

  const now = ctx.currentTime

  if (!inBounds || velocity <= 0.001) {
    if (zipwayGainNode) {
      // Smoothly ramp gain down to 0 within ~120ms (3 * 0.04s time constant)
      zipwayGainNode.gain.cancelScheduledValues(now)
      zipwayGainNode.gain.setTargetAtTime(0, now, 0.04)
    }
    return
  }

  if (!zipwaySourceNode) {
    try {
      zipwaySourceNode = ctx.createBufferSource()
      zipwaySourceNode.buffer = buffer
      zipwaySourceNode.loop = true

      zipwayGainNode = ctx.createGain()
      zipwayGainNode.gain.setValueAtTime(0, now)

      zipwaySourceNode.connect(zipwayGainNode)
      zipwayGainNode.connect(ctx.destination)
      zipwaySourceNode.start(0)

      zipwaySourceNode.onended = () => {
        zipwaySourceNode = null
        zipwayGainNode = null
      }
    } catch {
      return
    }
  }

  // Modulate playbackRate (0.6x to 1.8x) & gain (0.05 to 0.40) based on velocity
  const targetRate = Math.min(1.8, Math.max(0.6, 0.75 + velocity * 1.4))
  const targetGain = Math.min(0.4, Math.max(0.05, velocity * 2.4))

  zipwayGainNode.gain.cancelScheduledValues(now)
  zipwaySourceNode.playbackRate.cancelScheduledValues(now)

  zipwaySourceNode.playbackRate.setTargetAtTime(targetRate, now, 0.03)
  zipwayGainNode.gain.setTargetAtTime(targetGain, now, 0.03)
}

export const stopExperienceZipwayAudio = () => {
  const ctx = getSharedAudioContext()
  if (zipwayGainNode && ctx) {
    const now = ctx.currentTime
    zipwayGainNode.gain.cancelScheduledValues(now)
    zipwayGainNode.gain.setTargetAtTime(0, now, 0.04)
  }
}
