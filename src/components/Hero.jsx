import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_DATA } from '../data/portfolioData'

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
          },
        })
        tl.fromTo(
          textRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
          0,
        )
      }, containerRef)
      return () => ctx.revert()
    })

    // Desktop: cinematic extended scrub depth
    mm.add('(min-width: 769px)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=1200',
            scrub: 1,
            pin: true,
          },
        })
        tl.fromTo(
          textRef.current,
          { scale: 0.7, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0,
        )
      }, containerRef)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-[100svh] md:h-[100dvh] overflow-hidden bg-transparent flex items-center justify-center"
      aria-label="Portfolio Home"
    >
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pointer-events-none"
      >
        <h1 className="font-heading text-[clamp(2.5rem,10vw,8rem)] leading-[0.88] text-white tracking-tighter uppercase drop-shadow-2xl">
          <span className="block text-pink-400 opacity-90">{HERO_DATA.heroHeading}</span>
          <span className="block mt-2">{HERO_DATA.nameWords.join(' ')}</span>
        </h1>
      </div>
    </section>
  )
}

export default Hero
