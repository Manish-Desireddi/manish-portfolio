import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reusable section heading with eyebrow label, main title, and optional subtitle.
 * Utilizes a GSAP-driven clip-path wipe transition (circle(0% at center) to circle(100%)).
 */
const SectionHeader = React.memo(({ eyebrow, title, subtitle }) => {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
        { 
          clipPath: 'circle(150% at 50% 50%)', 
          opacity: 1, 
          duration: 1.2, 
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: "play none none reverse"
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="mb-6 md:mb-16 text-center" style={{ willChange: 'clip-path, opacity' }}>
      {eyebrow && (
        <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-pink-400 uppercase mb-2 md:mb-4">
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 md:mt-4 text-zinc-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed hidden sm:block">
          {subtitle}
        </p>
      )}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'
export default SectionHeader
