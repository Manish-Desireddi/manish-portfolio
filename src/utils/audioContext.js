// Shared Audio Context Singleton
let sharedAudioContext = null

const initAudioContextInstance = () => {
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

export const unlockAudioContext = async () => {
  const ctx = getSharedAudioContext()
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      // Ignore audio unlock failure if user gesture not accepted
    }
  }
  return ctx
}

export const playSubBassCue = () => {
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
    // Audio safe fallback
  }
}
