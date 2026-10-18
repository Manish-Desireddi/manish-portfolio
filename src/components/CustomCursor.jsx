import React, { useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const GLOW_SPRING = { damping: 28, stiffness: 160, mass: 0.6 }

const CURSOR_ACCENT_CLASSES = {
  pink: 'border-pink-400/40 bg-gradient-to-tr from-pink-500/10 to-orange-400/10',
  teal: 'border-teal-400/40 bg-gradient-to-tr from-teal-500/10 to-teal-400/10',
}

/**
 * Desktop-only custom cursor with an instant dot and a spring-lagged glow ring.
 * Mouse position is tracked via MotionValues — no React state, no re-renders.
 * Disabled entirely on touch/pointer-coarse devices.
 */
const CustomCursorInner = ({ accentColor = 'pink' }) => {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  const springX = useSpring(mouseX, GLOW_SPRING)
  const springY = useSpring(mouseY, GLOW_SPRING)

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

  const glowClass = CURSOR_ACCENT_CLASSES[accentColor] || CURSOR_ACCENT_CLASSES.pink

  return (
    <>
      <motion.div
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[9999999] pointer-events-none w-10 h-10 rounded-full border ${glowClass}`}
        style={{ x: glowX, y: glowY }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999999] pointer-events-none"
        style={{ x: dotX, y: dotY }}
      >
        <svg
          width="24"
          height="32"
          viewBox="0 0 24 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'translate(-4px, -4px)' }}
        >
          <path
            d="M2 2 L9 24 L13 16 L20 16 Z"
            fill="black"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
      </motion.div>
    </>
  )
}

const CustomCursor = ({ accentColor = 'pink' }) => {
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }
  return <CustomCursorInner accentColor={accentColor} />
}

export default CustomCursor
