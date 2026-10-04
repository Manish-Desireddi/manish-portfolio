import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'
import { X, Award, ShieldCheck, ChevronRight, ExternalLink, AlertTriangle, XCircle } from 'lucide-react'
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
  const clampedScroll = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true })
  const smoothProgress = useSpring(clampedScroll, { damping: 40, stiffness: 90, mass: 1 })
  const trackWidthVw = (allCerts.length - 1) * 100
  const x = useTransform(smoothProgress, [0, 1], ["0%", `-${trackWidthVw}vw`])

  useMotionValueEvent(smoothProgress, "change", (latest) => {
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
        data-lenis-prevent="true"
        className="relative w-full h-[100dvh] overflow-y-scroll overflow-x-hidden bg-black no-scrollbar overscroll-none"
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
            <motion.div style={{ x, width: `${allCerts.length * 100}vw` }} className="flex h-full">
              {allCerts.map((cert) => (
                <motion.div key={cert.id} className="w-[100vw] shrink-0 flex-shrink-0 overflow-hidden h-[100dvh] flex flex-col md:flex-row border-r border-zinc-900">
                  
                  {/* Left Column - Media */}
                  <div className="flex-1 hidden md:flex items-center justify-center relative border-b md:border-b-0 border-zinc-900 overflow-hidden">
                    {/* Inner Wrapper */}
                    <div 
                      style={{ height: 'calc(100dvh - 80px)', aspectRatio: cert.aspectRatio }}
                        className="relative z-[5] m-auto flex justify-center items-center filter drop-shadow-[0_0_30px_rgba(217,70,239,0.15)] pointer-events-none"
                    >
                      {/* Certificate image — fills wrapper without letterboxing */}
                      <SecureCanvasImage 
                        src={`/assets/certs/${cert.id}.png`} 
                        alt={cert.title}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Right Column - Data */}
                  <div className="w-full md:w-[460px] shrink-0 flex flex-col h-full min-h-[100dvh] overflow-hidden bg-black py-[3vh] px-8 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-pink-500" />
                    
                    <div className="flex items-center gap-4 mb-[2vh]">
                      <ShieldCheck className="text-pink-500" size={32} />
                      <span className="font-mono text-[clamp(0.75rem,1.5vh,0.875rem)] text-zinc-500 border border-zinc-800 px-3 py-1 bg-zinc-950">
                        {cert.date}
                      </span>
                    </div>

                    <h2 className="font-heading text-[clamp(1.5rem,4vw,3.5rem)] uppercase tracking-tighter leading-none text-white mb-[1.5vh] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                      {cert.title}
                    </h2>
                    <p className="font-oswald text-orange-400 uppercase tracking-widest text-[clamp(0.875rem,2vh,1.25rem)] mb-[3vh]">
                      {cert.issuer}
                    </p>

                    <div className="flex-1 min-h-0 flex flex-col justify-center gap-[2vh] shrink overflow-hidden">
                      <div className="bg-zinc-950 border border-zinc-900 p-[2vh] shadow-inner shrink">
                        <p className="text-[clamp(0.6rem,1.2vh,0.8rem)] font-mono text-zinc-600 mb-1">CLEARANCE LEVEL</p>
                        {cert.clearance === 'active' && (
                          <p className="text-[clamp(0.75rem,1.5vh,0.875rem)] font-heading uppercase text-green-400 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            ACTIVE / VERIFIED
                          </p>
                        )}
                        {cert.clearance === 'retired' && (
                          <p className="text-[clamp(0.75rem,1.5vh,0.875rem)] font-heading uppercase text-amber-500 tracking-widest flex items-center gap-2">
                            <AlertTriangle size={16} />
                            RETIRED
                          </p>
                        )}
                        {cert.clearance === 'expired' && (
                          <p className="text-[clamp(0.75rem,1.5vh,0.875rem)] font-heading uppercase text-red-500 tracking-widest flex items-center gap-2">
                            <XCircle size={16} />
                            EXPIRED
                          </p>
                        )}
                      </div>
                      
                      {cert.idBadge && (
                        <div className="bg-zinc-950 border border-zinc-900 p-[2vh] shadow-inner shrink">
                          <p className="text-[clamp(0.6rem,1.2vh,0.8rem)] font-mono text-zinc-600 mb-1">CREDENTIAL ID</p>
                          <p className="text-[clamp(1rem,2vh,1.25rem)] font-mono text-pink-400 tracking-widest">{cert.idBadge}</p>
                        </div>
                      )}
                      
                      <div className="bg-zinc-950 border border-zinc-900 p-[2vh] shadow-inner shrink">
                        <p className="text-[clamp(0.6rem,1.2vh,0.8rem)] font-mono text-zinc-600 mb-1">CATEGORY</p>
                        <p className="text-[clamp(0.75rem,1.5vh,0.875rem)] font-oswald text-zinc-300 uppercase tracking-wider">{cert.category}</p>
                      </div>
                    </div>

                    {cert.link && (
                      <a 
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between px-6 py-[2vh] mt-[2vh] bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-heading uppercase tracking-widest transition-colors group shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] shrink-0"
                      >
                        Verify Credential
                        <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    
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

  const openModal = () => {
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
    }
    onModalStateChange?.(isModalOpen)
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isModalOpen, onModalStateChange])

  return (
    <section id="certifications" className="relative py-32 bg-transparent overflow-hidden">

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
          
          <SecureCanvasImage 
            src={`/assets/certs/${allCerts[0]?.id}.png`} 
            alt="Credentials Preview"
            className="w-full h-full object-contain opacity-50 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 pointer-events-none"
          />
          
          
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
