import React, { useRef, useState, useEffect } from 'react'
import { motion, animate } from 'framer-motion'
import { Target, Users, Briefcase, GraduationCap, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LEADERSHIP, LEADERSHIP_META } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import { blockRevealVariant } from '../utils/motionVariants'
import { playLeadershipRevealSfx, playCgpaCountSfx } from '../utils/audioContext'

gsap.registerPlugin(ScrollTrigger)

const MagneticIcon = ({ children }) => (
  <div className="p-2 -m-2 inline-flex">{children}</div>
)

const cardContentVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.4 } },
}

const BlockReveal = ({ color }) => (
  <motion.div
    className={`absolute inset-0 z-30 pointer-events-none ${color}`}
    style={{ transform: 'translateZ(0)' }}
    variants={blockRevealVariant}
  />
)

const VpExperienceCard = ({ cardRef, isRevealed }) => (
  <motion.div
    ref={cardRef}
    initial="hidden"
    animate={isRevealed ? 'visible' : 'hidden'}
    className="lg:col-span-2 relative bg-black border border-pink-500 rounded-xl p-6 sm:p-8 overflow-hidden group"
  >
    <BlockReveal color="bg-pink-500" />
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-500 rounded-tl-lg pointer-events-none" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500 rounded-tr-lg pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500 rounded-bl-lg pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500 rounded-br-lg pointer-events-none" />

    <motion.div
      className="relative z-20"
      variants={cardContentVariant}
    >
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-oswald uppercase tracking-wide text-pink-500 mb-1">
            {LEADERSHIP.vp.title}
          </h3>
          <p className="text-zinc-300 font-medium text-sm sm:text-base">{LEADERSHIP.vp.role}</p>
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end">
          <div className="bg-black border border-pink-500 px-3 py-1 rounded-full flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-mono text-pink-500">{LEADERSHIP.vp.date}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{LEADERSHIP.vp.location}</span>
          </div>
        </div>
      </div>

      <ul className="space-y-6">
        {LEADERSHIP.vp.details.map((item, i) => (
          <li key={item.id} className="flex gap-4 items-start">
            <MagneticIcon>
              <div className="w-10 h-10 rounded-full bg-black border border-pink-500 flex items-center justify-center shrink-0">
                {i === 0 ? <Users className="w-5 h-5 text-pink-500" /> : <Target className="w-5 h-5 text-pink-500" />}
              </div>
            </MagneticIcon>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium mb-1 text-sm sm:text-base">{item.label}</h4>
              {item.desc && (
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  </motion.div>
)

const EducationCard = ({ cardRef, isRevealed }) => (
  <motion.div
    ref={cardRef}
    initial="hidden"
    animate={isRevealed ? 'visible' : 'hidden'}
    className="flex-1 relative bg-black border border-amber-500 rounded-xl p-6 sm:p-8 overflow-hidden flex flex-col justify-center"
  >
    <BlockReveal color="bg-amber-500" />
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg pointer-events-none" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg pointer-events-none" />

    <motion.div
      className="relative z-20"
      variants={cardContentVariant}
    >
      <div className="w-12 h-12 rounded-full bg-black border border-amber-500 flex items-center justify-center mb-6">
        <GraduationCap className="w-6 h-6 text-amber-500" />
      </div>
      <h3 className="text-lg sm:text-xl font-oswald uppercase tracking-wide text-amber-500 mb-2">
        {LEADERSHIP.education.degree}
      </h3>
      <p className="text-white font-medium mb-1 text-sm sm:text-base">{LEADERSHIP.education.institution}</p>
      <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm mb-4">
        <MapPin className="w-3.5 h-3.5" />
        <span>{LEADERSHIP.education.location}</span>
      </div>
      <div className="inline-block bg-black border border-amber-500 px-3 py-1 rounded-full">
        <span className="text-xs font-mono text-amber-500">{LEADERSHIP.education.date}</span>
      </div>
    </motion.div>
  </motion.div>
)

const CgpaCard = ({ cardRef, isRevealed, cgpa }) => (
  <motion.div
    ref={cardRef}
    initial="hidden"
    animate={isRevealed ? 'visible' : 'hidden'}
    className="min-h-[clamp(140px,20vh,192px)] relative bg-black rounded-xl p-6 sm:p-8 overflow-hidden flex flex-col items-center justify-center border border-orange-500"
  >
    <BlockReveal color="bg-orange-500" />
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500 rounded-tl-lg pointer-events-none" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-lg pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500 rounded-bl-lg pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500 rounded-br-lg pointer-events-none" />

    <motion.div
      className="relative z-20 text-center"
      variants={cardContentVariant}
    >
      <div className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-2">
        {LEADERSHIP.education.metricLabel || 'Cumulative Academic Metric'}
      </div>
      <div className="text-5xl sm:text-6xl font-heading text-white">
        {cgpa.toFixed(2)}
      </div>
    </motion.div>
  </motion.div>
)

const registerCardTrigger = (cardEl, onEnterAction) => {
  if (!cardEl) return
  ScrollTrigger.create({
    trigger: cardEl,
    start: 'top 90%',
    onEnter: (self) => {
      if (window.scrollY > window.innerHeight * 0.7) {
        onEnterAction()
        self.kill()
      }
    },
    onUpdate: (self) => {
      if ((self.isActive || self.progress > 0) && window.scrollY > window.innerHeight * 0.7) {
        onEnterAction()
        self.kill()
      }
    },
  })
}

const Leadership = ({ isReady = true }) => {
  const sectionRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)

  const [isCard1Revealed, setIsCard1Revealed] = useState(false)
  const [isCard2Revealed, setIsCard2Revealed] = useState(false)
  const [isCard3Revealed, setIsCard3Revealed] = useState(false)
  const [cgpa, setCgpa] = useState(0)
  const hasAnimatedCgpaRef = useRef(false)

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return

    let ctx = null
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      ctx = gsap.context(() => {
        registerCardTrigger(card1Ref.current, () => {
          setIsCard1Revealed(true)
          playLeadershipRevealSfx()
        })

        registerCardTrigger(card2Ref.current, () => {
          setIsCard2Revealed(true)
          playLeadershipRevealSfx()
        })

        registerCardTrigger(card3Ref.current, () => {
          setIsCard3Revealed(true)
          playLeadershipRevealSfx()
        })
      }, sectionRef.current)
    })

    return () => {
      cancelAnimationFrame(rafId)
      ctx?.revert()
    }
  }, [isReady])

  useEffect(() => {
    if (isCard3Revealed && !hasAnimatedCgpaRef.current) {
      hasAnimatedCgpaRef.current = true
      const target = parseFloat(LEADERSHIP.education.cgpa)
      let stopCgpaSfx = null
      let sfxStarted = false

      animate(0, target, {
        duration: 2,
        ease: 'easeOut',
        delay: 0.3,
        onUpdate: (val) => {
          setCgpa(val)
          if (!sfxStarted && val > 0.01) {
            sfxStarted = true
            stopCgpaSfx = playCgpaCountSfx()
          }
        },
        onComplete: () => {
          if (stopCgpaSfx) {
            if (typeof stopCgpaSfx.stop === 'function') {
              stopCgpaSfx.stop()
            } else if (typeof stopCgpaSfx === 'function') {
              stopCgpaSfx()
            }
          }
        },
      })
    }
  }, [isCard3Revealed])

  return (
    <section ref={sectionRef} id="leadership" className="py-24 px-4 sm:px-8 md:px-12 bg-transparent relative z-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          index={LEADERSHIP_META.index}
          category={LEADERSHIP_META.category}
          title={LEADERSHIP_META.title}
          subtitle={LEADERSHIP_META.subtitle}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <VpExperienceCard cardRef={card1Ref} isRevealed={isCard1Revealed} />
          <div className="lg:col-span-1 flex flex-col gap-6">
            <EducationCard cardRef={card2Ref} isRevealed={isCard2Revealed} />
            <CgpaCard cardRef={card3Ref} isRevealed={isCard3Revealed} cgpa={cgpa} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Leadership