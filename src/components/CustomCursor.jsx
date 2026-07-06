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
        className="fixed top-0 left-0 z-[9999999] pointer-events-none w-10 h-10 rounded-full border border-pink-400/40 bg-gradient-to-tr from-pink-500/10 to-orange-400/10"
        style={{ x: glowX, y: glowY }}
      />
      {/* Dot — GTA VI Style Arrow */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999999] pointer-events-none"
        style={{ x: dotX, y: dotY }}
      >
        {/* SVG mimicking a thick black arrow with a white outline (GTA style) */}
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translate(-4px, -4px)' }}>
          <path d="M2 2 L9 24 L13 16 L20 16 Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="miter"/>
        </svg>
      </motion.div>
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
