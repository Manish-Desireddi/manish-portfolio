import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { Target, Users, Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { LEADERSHIP } from '../data/portfolioData'
import SectionHeader from './SectionHeader'

const MagneticIcon = ({ children }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    x.set(middleX * 0.4)
    y.set(middleY * 0.4)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="p-2 -m-2 cursor-pointer inline-flex"
    >
      {children}
    </motion.div>
  )
}

const TerminalBlockReveal = ({ color }) => (
  <motion.div
    className={`absolute inset-0 z-30 ${color}`}
    initial={{ height: "0%", top: 0 }}
    whileInView={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.5, 1] }}
  />
)

const Leadership = () => {
  const sectionRef = useRef(null)
  const cgpaRef = useRef(null)
  const isCgpaInView = useInView(cgpaRef, { once: true, margin: "-100px" })
  const [cgpa, setCgpa] = useState(0)

  useEffect(() => {
    if (isCgpaInView) {
      const target = parseFloat(LEADERSHIP.education.cgpa)
      const controls = animate(0, target, {
        duration: 2,
        ease: "easeOut",
        delay: 0.8,
        onUpdate(value) {
          setCgpa(value)
        }
      })
      return () => controls.stop()
    }
  }, [isCgpaInView])

  return (
    <section id="leadership" ref={sectionRef} className="py-24 px-6 md:px-12 bg-transparent relative z-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="SYS.LOG // Leadership" title="COMMAND & OPERATIONS" />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {/* Left Column: VP Role */}
          <motion.div
            variants={{
              hidden: { opacity: 1 },
              visible: { opacity: 1 }
            }}
            className="lg:col-span-2 relative bg-black border border-pink-500 rounded-xl p-8 overflow-hidden group"
          >
            <TerminalBlockReveal color="bg-pink-500" />

            {/* HUD Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500 rounded-br-lg" />

            <motion.div
              className="relative z-20"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: 0.4, duration: 0 } }
              }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-oswald uppercase tracking-wide text-pink-500 mb-1">
                    {LEADERSHIP.vp.title}
                  </h3>
                  <p className="text-zinc-300 font-medium">{LEADERSHIP.vp.role}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-black border border-pink-500 px-3 py-1 rounded-full flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-pink-500" />
                    <span className="text-xs font-mono text-pink-500">{LEADERSHIP.vp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
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
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.label}</h4>
                      {item.desc && (
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Column: Split */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Top Right: Education */}
            <motion.div
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1 }
              }}
              className="flex-1 relative bg-black border border-amber-500 rounded-xl p-8 overflow-hidden flex flex-col justify-center"
            >
              <TerminalBlockReveal color="bg-amber-500" />

              {/* HUD Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg" />

              <motion.div
                className="relative z-20"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.4, duration: 0 } }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-black border border-amber-500 flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-oswald uppercase tracking-wide text-amber-500 mb-2">
                  {LEADERSHIP.education.degree}
                </h3>
                <p className="text-white font-medium mb-1">{LEADERSHIP.education.institution}</p>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{LEADERSHIP.education.location}</span>
                </div>
                <div className="inline-block bg-black border border-amber-500 px-3 py-1 rounded-full">
                  <span className="text-xs font-mono text-amber-500">{LEADERSHIP.education.date}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Right: CGPA */}
            <motion.div
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1 }
              }}
              ref={cgpaRef}
              className="h-48 relative bg-black rounded-xl p-8 overflow-hidden flex flex-col items-center justify-center border border-orange-500"
            >
              <TerminalBlockReveal color="bg-orange-500" />

              {/* HUD Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500 rounded-br-lg" />

              <motion.div
                className="relative z-20 text-center"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.4, duration: 0 } }
                }}
              >
                <div className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-2">
                  Cumulative Academic Metric
                </div>
                <div className="text-6xl font-heading text-white">
                  {cgpa.toFixed(2)}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Leadership
