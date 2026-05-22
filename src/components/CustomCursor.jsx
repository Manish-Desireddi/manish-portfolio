import React, { useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const GLOW_SPRING = { damping: 28, stiffness: 160, mass: 0.6 }

/**
 * Desktop-only custom cursor with an instant dot and a spring-lagged glow ring.
 * Mouse position is tracked via MotionValues — no React state, no re-renders.
 * Disabled entirely on touch/pointer-coarse devices.
 */
const CustomCursorInner = () => {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Spring-smoothed position for the glow ring (creates the lag effect)
  const springX = useSpring(mouseX, GLOW_SPRING)
  const springY = useSpring(mouseY, GLOW_SPRING)

  // Offset transforms so each element is centered on the cursor
  const dotX = useTransform(mouseX, (x) => x - 4)
  const dotY = useTransform(mouseY, (y) => y - 4)
  const glowX = useTransform(springX, (x) => x - 20)
  const glowY = useTransform(springY, (y) => y - 20)

  const onMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    },
    [mouseX, mouseY],
  )

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  return (
    <>
      {/* Glow ring — spring-lagged, larger */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-10 h-10 rounded-full border border-cyan-400/40 bg-cyan-400/4"
        style={{ x: glowX, y: glowY }}
      />
      {/* Dot — snaps immediately to cursor */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-cyan-400"
        style={{ x: dotX, y: dotY }}
      />
    </>
  )
}

const CustomCursor = () => {
  // Render nothing on touch devices — avoids a redundant invisible overlay
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }
  return <CustomCursorInner />
}

export default CustomCursor
