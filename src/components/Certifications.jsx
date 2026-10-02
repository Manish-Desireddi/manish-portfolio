import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { X, Award, ShieldCheck, ChevronRight } from 'lucide-react'
import { CERTIFICATIONS } from '../data/portfolioData'
import SectionHeader from './SectionHeader'

const SecureCanvasImage = ({ src, alt, className }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let objectUrl = ''
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        objectUrl = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (canvas) {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          }
          URL.revokeObjectURL(objectUrl)
        }
        img.src = objectUrl
      })
      .catch(err => {
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = 800
          canvas.height = 600
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#111'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = '#333'
          ctx.font = '30px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`Image Pending`, 400, 300)
        }
      })

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src])

  return <canvas ref={canvasRef} className={className} aria-label={alt} />
}

const CertificationModal = ({ allCerts, onClose }) => {
  const modalRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({ container: modalRef })
  const trackWidthVw = (allCerts.length - 1) * 100
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${trackWidthVw}vw`])
  const parallaxX = useTransform(scrollYProgress, [0, 1], ["0%", `${(allCerts.length - 1) * 20}vw`])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveIndex(Math.round(latest * (allCerts.length - 1)))
  })

  useLayoutEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        layoutId="cert-container"
        ref={modalRef}
        className="relative w-full h-[100dvh] overflow-y-auto overflow-x-hidden bg-black no-scrollbar"
      >
        <div className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-black/80 px-4 py-3 border border-zinc-800 hover:border-pink-500 backdrop-blur-md"
          >
            <X size={20} /> <span className="font-heading uppercase tracking-widest text-sm md:text-base">Close Database</span>
          </button>
          <div className="pointer-events-auto bg-black/80 border border-zinc-800 px-6 py-3 font-mono text-pink-400 text-lg">
            {activeIndex + 1} / {allCerts.length}
          </div>
        </div>

        <div style={{ height: `${allCerts.length * 100}vh` }} className="w-full relative">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
            <motion.div style={{ x }} className="flex h-full w-max">
              {allCerts.map((cert) => (
                <motion.div key={cert.id} className="max-w-[90vw] w-auto overflow-hidden h-[100dvh] shrink-0 flex flex-col md:flex-row border-r border-zinc-900">
                  
                  {/* Left Column (50%) - Media */}
                  <div className="relative w-full md:w-1/2 max-h-[35vh] md:max-h-none md:h-full bg-zinc-950 overflow-hidden border-b md:border-b-0 border-zinc-900 shrink-0">
                    <motion.div style={{ x: parallaxX }} className="w-full h-full relative flex items-center justify-center p-8 md:p-12">
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-amber-500/5 pointer-events-none" />
                      <SecureCanvasImage 
                        src={`/assets/certs/${cert.id}.png`} 
                        alt={cert.title}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(217,70,239,0.15)] pointer-events-none"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
                  </div>

                  {/* Right Column (50%) - Data */}
                  <div className="w-full md:w-1/2 flex-1 overflow-y-auto md:overflow-visible md:h-full bg-black p-8 md:p-16 flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500" />
                    
                    <div className="flex items-center gap-4 mb-6 shrink-0">
                      <ShieldCheck className="text-pink-500" size={32} />
                      <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-3 py-1 bg-zinc-950">
                        {cert.date}
                      </span>
                    </div>

                    <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-none text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] shrink-0">
                      {cert.title}
                    </h2>
                    <p className="font-oswald text-orange-400 uppercase tracking-widest text-lg md:text-xl mb-12 shrink-0">
                      {cert.issuer}
                    </p>

                    <div className="space-y-6 shrink-0">
                      <div className="bg-zinc-950 border border-zinc-900 p-6 shadow-inner">
                        <p className="text-xs font-mono text-zinc-600 mb-2">CLEARANCE LEVEL</p>
                        <p className="text-sm font-heading uppercase text-green-400 tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          ACTIVE / VERIFIED
                        </p>
                      </div>
                      
                      <div className="bg-zinc-950 border border-zinc-900 p-6 shadow-inner">
                        <p className="text-xs font-mono text-zinc-600 mb-2">CREDENTIAL ID</p>
                        <p className="text-xl font-mono text-pink-400 tracking-widest">{cert.idBadge}</p>
                      </div>
                      
                      <div className="bg-zinc-950 border border-zinc-900 p-6 shadow-inner">
                        <p className="text-xs font-mono text-zinc-600 mb-2">CATEGORY</p>
                        <p className="text-sm font-oswald text-zinc-300 uppercase tracking-wider">{cert.category}</p>
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Certifications = ({ onModalStateChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Flatten all certs for the carousel
  const allCerts = CERTIFICATIONS.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.category })))

  const savedScrollY = useRef(0)

  const openModal = () => {
    savedScrollY.current = window.scrollY
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Lock background scrolling when modal is open and propagate state
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      if (savedScrollY.current > 0) {
        window.scrollTo({ top: savedScrollY.current, behavior: 'instant' })
      }
    }
    onModalStateChange?.(isModalOpen)
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isModalOpen, onModalStateChange])

  return (
    <section id="certifications" className="relative py-32 bg-app-dark overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(217,70,239,0.1),transparent_70%)] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px)] bg-[length:100%_4px] z-0" />

      {/* Landing Container */}
      <div className="relative z-10 w-full mb-16 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeader
          eyebrow="SYS.LOG // Accreditations"
          title="CLEARANCE & CREDENTIALS"
          subtitle="> VALIDATED EXPERTISE ACROSS ENTERPRISE CLOUD AND INTELLIGENT SYSTEMS."
        />

        <motion.div 
          layoutId="cert-container"
          onClick={openModal}
          className="mt-12 relative w-full max-w-5xl h-[60vh] md:h-[70vh] border border-zinc-800 bg-black cursor-pointer overflow-hidden group shadow-[0_0_50px_rgba(217,70,239,0.1)] hover:shadow-[0_0_80px_rgba(217,70,239,0.2)] transition-shadow duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 pointer-events-none z-10" />
          <SecureCanvasImage 
            src={`/assets/certs/${allCerts[0]?.id}.png`} 
            alt="Credentials Preview"
            className="w-full h-full object-contain opacity-50 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button className="bg-pink-500 hover:bg-pink-400 text-black px-6 md:px-10 py-4 md:py-5 font-heading text-xl md:text-2xl uppercase tracking-wider transition-colors flex items-center gap-3 shadow-[0_0_20px_rgba(217,70,239,0.5)]">
              View Credentials <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Full-Screen Morph (Scroll-Jacked Gallery) */}
      <AnimatePresence>
        {isModalOpen && (
          <CertificationModal allCerts={allCerts} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Certifications
