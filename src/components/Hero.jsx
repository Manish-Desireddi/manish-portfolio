import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    // Mobile: shorter scrub distance
    mm.add('(max-width: 768px)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=500',
            scrub: true,
            pin: true,
          }
        })
        tl.fromTo(
          textRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
          0
        )
      }, containerRef)
      return () => ctx.revert()
    })

    // Desktop: cinematic extended scrub depth for 120hz momentum
    mm.add('(min-width: 769px)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=1200',
            scrub: 1,
            pin: true,
          }
        })
        tl.fromTo(
          textRef.current,
          { scale: 0.7, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0
        )
      }, containerRef)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden bg-transparent flex items-center justify-center">
      
      {/* Layer D: Typography (Behind Avatar) */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-6 mt-[-10vh] pointer-events-none">
        <h1 className="font-heading text-[12vw] sm:text-[130px] leading-[0.8] text-white tracking-tighter uppercase drop-shadow-2xl">
          <span className="block text-pink-400 opacity-90">Portfolio</span>
          <span className="block mt-2">Manish Desireddi</span>
        </h1>
      </div>
    </section>
  )
}

export default Hero
