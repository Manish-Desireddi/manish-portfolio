import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { CERTIFICATIONS, CERTIFICATIONS_META } from '../data/portfolioData'
import SectionHeader from './SectionHeader'
import { useModalLifecycle } from '../utils/useModalLifecycle'
import { trackEvent } from '../utils/analytics'

const CATEGORIES = CERTIFICATIONS_META.categories

const CLEARANCE_BADGE_MAP = {
  active: {
    textColor: 'text-emerald-400',
    icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />,
  },
  retired: {
    textColor: 'text-amber-400',
    icon: <AlertTriangle size={14} className="shrink-0 text-amber-400" />,
  },
  expired: {
    textColor: 'text-red-400',
    icon: <XCircle size={14} className="shrink-0 text-red-400" />,
  },
}

const SecureCanvasImage = ({ src, alt, className }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let objectUrl = ''
    fetch(src)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((blob) => {
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
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
        }
        img.src = objectUrl
      })
      .catch(() => {
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = 600
          canvas.height = 400
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#0a0a0a'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.strokeStyle = '#ec4899'
          ctx.lineWidth = 2
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
          ctx.fillStyle = '#ec4899'
          ctx.font = 'bold 20px monospace'
          ctx.textAlign = 'center'
          ctx.fillText('ACCREDITATION VERIFIED', 300, 200)
        }
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />
}

const CertModalHeader = ({ onClose, closeBtnRef, selectedCategory, onSelectCategory, activeIndex, totalCerts }) => (
  <div className="flex flex-col gap-2 border-b border-zinc-800 pb-3 z-20">
    <div className="flex items-center justify-between">
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-800 hover:border-pink-500 bg-black/60 transition-colors"
        aria-label="Close credentials database"
      >
        <X size={16} />
        <span className="font-heading uppercase text-xs tracking-wider">Close Database</span>
      </button>

      <div className="font-mono text-pink-400 text-xs tracking-widest bg-zinc-950 px-2.5 py-1 border border-zinc-800">
        INDEX: {activeIndex + 1} / {totalCerts}
      </div>
    </div>

    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelectCategory(cat)}
          className={`px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider transition-colors border shrink-0 ${
            selectedCategory === cat
              ? 'border-pink-500 bg-pink-950/40 text-pink-400 font-bold'
              : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
)

// fallow-ignore-next-line complexity
const CertSlideView = ({ cert }) => {
  if (!cert) return null
  const clearanceKey = cert.clearance?.toLowerCase() || 'active'
  const clearanceStyle = CLEARANCE_BADGE_MAP[clearanceKey] || CLEARANCE_BADGE_MAP.active

  return (
    <motion.div
      key={cert.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl max-h-[80vh] md:max-h-[75vh] flex flex-col md:flex-row border border-zinc-800 bg-[#0B0914] shadow-2xl overflow-y-auto md:overflow-hidden no-scrollbar"
    >
      <div className="w-full md:w-3/5 h-[clamp(160px,24vh,320px)] md:h-auto flex items-center justify-center p-3 sm:p-5 bg-black/80 border-b md:border-b-0 md:border-r border-zinc-900 shrink-0">
        <SecureCanvasImage
          src={`/assets/certs/${cert.id}.png`}
          alt={`${cert.title} Certificate`}
          className="w-full h-full object-contain shadow-lg"
        />
      </div>

      <div className="w-full md:w-2/5 p-4 sm:p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-pink-500" size={18} />
            <span className="font-mono text-xs text-zinc-500 bg-black border border-zinc-800 px-2 py-0.5">
              {cert.date}
            </span>
          </div>

          <h3 className="font-heading text-lg sm:text-xl uppercase tracking-tight text-white mb-1">
            {cert.title}
          </h3>
          <p className="font-oswald text-orange-400 uppercase tracking-widest text-xs mb-3">
            {cert.issuer}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-black/90 border border-zinc-900 p-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Clearance</p>
              <p className={`text-xs font-heading uppercase ${clearanceStyle.textColor} flex items-center gap-1.5 mt-0.5 truncate`}>
                {clearanceStyle.icon}
                {cert.clearance || 'ACTIVE'}
              </p>
            </div>

            <div className="bg-black/90 border border-zinc-900 p-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Category</p>
              <p className="text-xs font-mono text-pink-400 truncate mt-0.5">{cert.category}</p>
            </div>

            {cert.idBadge && (
              <div className="col-span-2 bg-black/90 border border-zinc-900 p-2">
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Credential ID</p>
                <p className="text-xs font-mono text-zinc-300 truncate mt-0.5">{cert.idBadge}</p>
              </div>
            )}
          </div>
        </div>

        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('interaction', 'verify_cert_external', { cert: cert.id })}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-heading uppercase text-xs tracking-wider transition-colors shadow-md mt-2"
          >
            Verify Credential <ExternalLink size={14} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

const CertModalPagination = ({ activeIndex, totalCerts, onPrev, onNext }) => (
  <div className="flex items-center justify-between border-t border-zinc-800 pt-3 z-20">
    <button
      type="button"
      onClick={onPrev}
      disabled={activeIndex === 0}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 bg-black text-white disabled:opacity-40 disabled:pointer-events-none hover:border-pink-500 transition-colors"
      aria-label="Previous certificate"
    >
      <ChevronLeft size={16} />
      <span className="font-heading uppercase text-xs hidden sm:inline">Previous</span>
    </button>

    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest hidden sm:inline">
      SWIPE OR USE ARROW KEYS TO NAVIGATE
    </span>

    <button
      type="button"
      onClick={onNext}
      disabled={activeIndex === totalCerts - 1}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 bg-black text-white disabled:opacity-40 disabled:pointer-events-none hover:border-pink-500 transition-colors"
      aria-label="Next certificate"
    >
      <span className="font-heading uppercase text-xs hidden sm:inline">Next</span>
      <ChevronRight size={16} />
    </button>
  </div>
)

// fallow-ignore-next-line complexity
const CertificationModal = ({ allCerts, onClose, initialIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const touchStartXRef = useRef(0)
  const closeBtnRef = useRef(null)

  useModalLifecycle(true, onClose, closeBtnRef)

  const filteredCerts =
    selectedCategory === 'All'
      ? allCerts
      : allCerts.filter((c) => c.category.toLowerCase().includes(selectedCategory.toLowerCase()))

  const currentCerts = filteredCerts.length > 0 ? filteredCerts : allCerts
  const activeCert = currentCerts[Math.min(activeIndex, currentCerts.length - 1)]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(prev + 1, currentCerts.length - 1))
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentCerts.length])

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const diff = touchStartXRef.current - e.changedTouches[0].clientX
    if (diff > 50) {
      setActiveIndex((prev) => Math.min(prev + 1, currentCerts.length - 1))
    } else if (diff < -50) {
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[100000] bg-[#0B0914] flex flex-col justify-between p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Accreditation & Credentials Modal"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CertModalHeader
        onClose={onClose}
        closeBtnRef={closeBtnRef}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat)
          setActiveIndex(0)
        }}
        activeIndex={activeIndex}
        totalCerts={currentCerts.length}
      />

      <div className="flex-1 flex items-center justify-center my-2 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <CertSlideView key={activeCert?.id} cert={activeCert} />
        </AnimatePresence>
      </div>

      <CertModalPagination
        activeIndex={activeIndex}
        totalCerts={currentCerts.length}
        onPrev={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
        onNext={() => setActiveIndex((prev) => Math.min(prev + 1, currentCerts.length - 1))}
      />
    </motion.div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}

const Certifications = ({ onModalStateChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allCerts = CERTIFICATIONS.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  )

  const openModal = () => {
    setIsModalOpen(true)
    onModalStateChange?.(true)
    trackEvent('interaction', 'open_certifications_modal')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    onModalStateChange?.(false)
  }

  return (
    <section id="certifications" className="relative py-28 px-4 sm:px-6 bg-transparent overflow-hidden">
      <div className="relative z-10 w-full mb-12 max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeader
          index={CERTIFICATIONS_META.index}
          category={CERTIFICATIONS_META.category}
          title={CERTIFICATIONS_META.title}
          subtitle={CERTIFICATIONS_META.subtitle}
        />

        <div
          onClick={openModal}
          className="mt-10 relative w-full max-w-4xl h-[45vh] sm:h-[60vh] border border-zinc-800 bg-black cursor-pointer overflow-hidden group shadow-[0_0_50px_rgba(217,70,239,0.1)] hover:shadow-[0_0_80px_rgba(217,70,239,0.2)] transition-shadow duration-500"
        >
          <SecureCanvasImage
            src={`/assets/certs/${allCerts[0]?.id}.png`}
            alt="Credentials Preview"
            className="w-full h-full object-contain opacity-50 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-400 text-black px-6 sm:px-10 py-3.5 sm:py-5 font-heading text-lg sm:text-2xl uppercase tracking-wider transition-colors flex items-center gap-3 shadow-[0_0_20px_rgba(217,70,239,0.5)] cursor-pointer"
            >
              {CERTIFICATIONS_META.viewCredential} <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && <CertificationModal allCerts={allCerts} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  )
}

export default Certifications
