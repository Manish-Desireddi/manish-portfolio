// Centralized Motion Primitives Module
// Easing: [0.22, 1, 0.36, 1] (Cubic Bezier for premium snappy HUD physics)

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

export const isReducedMotion = () => prefersReducedMotion

const standardEase = [0.22, 1, 0.36, 1]

export const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 20,
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.05 : 0.6,
      delay: prefersReducedMotion ? 0 : custom * 0.1,
      ease: standardEase,
    },
  }),
}

export const blockRevealVariant = {
  hidden: {
    scaleY: 0,
    originY: 0,
  },
  // fallow-ignore-next-line complexity
  visible: (custom = 0) => ({
    scaleY: prefersReducedMotion ? [0, 0, 0] : [0, 1, 0],
    originY: [0, 0, 1],
    transition: {
      duration: prefersReducedMotion ? 0.05 : 0.8,
      delay: prefersReducedMotion ? 0 : custom * 0.08,
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    },
  }),
}

export const modalSpring = {
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: prefersReducedMotion ? 'tween' : 'spring',
      damping: 30,
      stiffness: 300,
      duration: prefersReducedMotion ? 0.05 : undefined,
    },
  },
  exit: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.97,
    transition: {
      duration: prefersReducedMotion ? 0.05 : 0.2,
      ease: standardEase,
    },
  },
}
