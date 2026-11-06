import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import {
  Download,
  ArrowLeft,
  Shield,
  Cpu,
  Database,
  Terminal,
  HardDrive,
  Check,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import {
  DOWNLOAD_PROJECTS,
  PROJECT_THEME_PALETTES,
} from '../data/portfolioData'
import { resolveDownloadProject, verifyAndTriggerDownload } from '../utils/assetVerifier'
import { showToast } from './ToastManager'
import { blockRevealVariant } from '../utils/motionVariants'

const ICON_MAP = {
  Cpu,
  Database,
  Terminal,
  Shield,
  HardDrive,
}

function useScrambleText(target, enabled = true) {
  const [text, setText] = useState(target)

  useEffect(() => {
    if (!enabled || !target) return undefined
    const chars = '0123456789ABCDEF'
    let iteration = 0
    const totalSteps = target.length

    const interval = setInterval(() => {
      setText(
        target
          .split('')
          .map((char, index) => {
            if (index < iteration) return target[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(''),
      )
      iteration += Math.max(1, Math.floor(totalSteps / 15))
      if (iteration >= totalSteps) {
        setText(target)
        clearInterval(interval)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [target, enabled])

  return text
}

const CornerBrackets = ({ palette }) => (
  <>
    <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 ${palette.border} pointer-events-none transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5`} />
    <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 ${palette.border} pointer-events-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
    <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 ${palette.border} pointer-events-none transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5`} />
    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 ${palette.border} pointer-events-none transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5`} />
  </>
)

const MonogramBadge = ({ monogram, palette }) => (
  <div className="relative">
    <div className={`absolute -inset-1.5 rounded-sm border ${palette.border} opacity-40 animate-ping pointer-events-none`} />
    <div className={`w-16 h-16 ${palette.bg} flex items-center justify-center font-heading text-black text-3xl font-bold shadow-lg relative z-10`}>
      {monogram}
    </div>
  </div>
)

const DownloadHeader = ({ project, palette }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="lg:col-span-7 flex flex-col justify-center"
  >
    <div className="flex items-center gap-4 mb-6">
      <MonogramBadge monogram={project.monogram} palette={palette} />
      <div className={`px-3 py-1 border-2 ${palette.border} ${palette.textLight} font-mono text-xs uppercase tracking-[0.3em] bg-black/60`}>
        {project.platformBadge}
      </div>
    </div>

    <h1 className="text-5xl md:text-7xl font-heading uppercase tracking-tighter leading-none mb-3 text-white">
      {project.title.split(' ')[0]}
      <br />
      <span className={palette.text}>{project.title.split(' ').slice(1).join(' ')}</span>
    </h1>

    <p className={`font-mono text-xs uppercase tracking-widest ${palette.textLight} mb-6`}>
      {project.editionSubtitle}
    </p>

    <p className="text-zinc-400 font-sans text-lg max-w-xl leading-relaxed">
      {project.description}
    </p>
  </motion.div>
)

const ChecksumRow = ({ sha256, palette, project }) => {
  const [copied, setCopied] = useState(false)
  const scrambledHash = useScrambleText(sha256)

  const handleCopy = () => {
    navigator.clipboard?.writeText(sha256)
    setCopied(true)
    showToast({
      type: 'success',
      title: 'CHECKSUM COPIED',
      message: 'SHA-256 hash copied to clipboard.',
      duration: 2500,
    })
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800">
      <div className="flex items-center justify-between text-zinc-500 font-mono text-xs mb-1.5">
        <span>{project?.labels?.sha256Checksum || 'SHA-256 CHECKSUM'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 hover:${palette.textLight} transition-colors p-1 cursor-pointer`}
          aria-label="Copy SHA-256 checksum"
        >
          {copied ? <Check size={12} className={palette.textLight} /> : <Copy size={12} />}
          <span className={copied ? palette.textLight : ''}>
            {copied ? 'VERIFIED' : 'COPY'}
          </span>
        </button>
      </div>
      <p className="font-mono text-[11px] text-zinc-400 break-all leading-tight">
        {scrambledHash}
      </p>
    </div>
  )
}

const DownloadCta = ({ project, palette, isMobile, verifying, onDownload }) => {
  const buttonText = verifying ? 'VERIFYING TELEMETRY...' : (project?.labels?.downloadInstaller || 'DOWNLOAD INSTALLER (.EXE)')

  return (
    <div className="mt-6">
      {isMobile && (
        <div className={`mb-3 p-3 border ${palette.border} bg-black/80 flex items-start gap-2.5`}>
          <AlertTriangle size={16} className={`shrink-0 ${palette.textLight} mt-0.5`} />
          <p className="font-mono text-xs text-zinc-300 leading-snug">
            {project.desktopOnlyNotice}
          </p>
        </div>
      )}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDownload}
        disabled={verifying}
        className={`w-full py-4 ${palette.bg} ${palette.bgHover} text-black font-heading uppercase text-lg font-bold flex items-center justify-center gap-3 transition-colors ${palette.borderGlow} disabled:opacity-75 relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
      >
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] -translate-x-[150%] animate-shimmer pointer-events-none" />
        <Download size={20} className={verifying ? 'animate-bounce relative z-10' : 'relative z-10'} />
        <span className="relative z-10">{buttonText}</span>
      </motion.button>
    </div>
  )
}

const SpotlightCard = ({ children, palette, className = '' }) => {
  const cardRef = useRef(null)
  const isTouch = typeof window !== 'undefined'
    && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  const handleMouseMove = (e) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    mouseX.set((clientX / rect.width) - 0.5)
    mouseY.set((clientY / rect.height) - 0.5)
    spotlightX.set(clientX)
    spotlightY.set(clientY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  if (isTouch) {
    return <div className={`relative ${className}`}>{children}</div>
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, ${palette.hex}22, transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  )
}

const DownloadModule = ({ project, palette }) => {
  const [verifying, setVerifying] = useState(false)
  const isMobile = typeof window !== 'undefined'
    && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)

  const scrambledFileName = useScrambleText(project.fileName)
  const scrambledSize = useScrambleText(project.fileSize)

  const handleDownloadClick = async () => {
    if (isMobile) {
      showToast({
        type: 'warning',
        title: 'SYS.WARN // DESKTOP ONLY',
        message: 'Windows x64 desktop support only. Please access from a desktop workstation to run this installer.',
      })
      return
    }

    setVerifying(true)
    await verifyAndTriggerDownload(project.fileUrl, project.fileName)
    setVerifying(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="lg:col-span-5 relative"
    >
      <SpotlightCard palette={palette} className="group">
        <motion.div
          variants={blockRevealVariant}
          initial="hidden"
          animate="visible"
          className={`absolute inset-0 ${palette.bg} z-30 pointer-events-none`}
        />

        <div className="bg-zinc-950 border-2 border-zinc-800 p-8 h-full flex flex-col justify-between relative group hover:border-zinc-700 transition-colors overflow-hidden">
          <CornerBrackets palette={palette} />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`w-full h-12 bg-gradient-to-b from-transparent ${palette.scanline} to-transparent animate-scan-line`} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className={`font-heading uppercase tracking-widest text-xs ${palette.textLight}`}>
                {project.labels?.latestBuildTelemetry || 'LATEST BUILD TELEMETRY'}
              </span>
              <span className="font-mono text-xs text-zinc-500">{project.version}</span>
            </div>

            <p className="text-white font-mono text-xl font-bold break-all mb-3">
              {scrambledFileName}
            </p>

            <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
              <span>PAYLOAD: {scrambledSize}</span>
              <span className="text-zinc-600">|</span>
              <span className={palette.textLight}>{project.labels?.archWin || 'ARCH: x64 WIN'}</span>
            </div>

            <ChecksumRow sha256={project.sha256} palette={palette} project={project} />
          </div>

          <div className="relative z-10">
            <DownloadCta
              project={project}
              palette={palette}
              isMobile={isMobile}
              verifying={verifying}
              onDownload={handleDownloadClick}
            />
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

const FeatureCard = ({ feature, palette, index }) => {
  const IconComponent = ICON_MAP[feature.icon] || Cpu

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="bg-black border border-zinc-800 p-6 relative group hover:border-zinc-700 transition-colors overflow-hidden"
    >
      <CornerBrackets palette={palette} />
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 border border-zinc-800 bg-zinc-950 ${palette.textLight} group-hover:scale-110 transition-transform`}>
          <IconComponent size={20} />
        </div>
        <h3 className="font-heading uppercase text-base tracking-tight text-white">
          {feature.title}
        </h3>
      </div>
      <p className="text-zinc-400 font-sans text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

const SystemSpecsPanel = ({ requirements, palette, project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="bg-zinc-950 border border-zinc-800 p-8 relative overflow-hidden flex flex-col justify-between"
  >
    <motion.div
      variants={blockRevealVariant}
      initial="hidden"
      animate="visible"
      className={`absolute inset-0 ${palette.bg} z-30 pointer-events-none`}
    />

    <div className="relative z-10">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <HardDrive size={20} className={palette.textLight} />
          <h3 className="font-heading uppercase text-lg tracking-tight text-white">
            {project?.labels?.hardwareSpecifications || 'HARDWARE SPECIFICATIONS'}
          </h3>
        </div>
        <div className={`px-2.5 py-0.5 border ${palette.border} bg-black/60 font-mono text-[10px] ${palette.textLight} tracking-widest uppercase flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${palette.bg} animate-pulse`} />
          NOMINAL
        </div>
      </div>

      <div className="space-y-4">
        {requirements.map((req, i) => (
          <div key={req.label} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                // {req.label}
              </span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 border ${palette.border} bg-black/50 text-[10px] font-mono ${palette.textLight}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${palette.bg} animate-pulse`} />
                [ READY ]
              </div>
            </div>
            <p className="text-zinc-200 font-mono text-xs tracking-tight">{req.value}</p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="h-px bg-zinc-900 origin-left mt-3"
            />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)

const goHome = () => {
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    window.history.pushState({}, '', '/')
  }
  window.location.hash = ''
}

const getActivePalette = (themeColor) => PROJECT_THEME_PALETTES[themeColor] || PROJECT_THEME_PALETTES.teal

const resolvePageProject = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  return resolveDownloadProject(hash) || DOWNLOAD_PROJECTS.aura
}

const DownloadPage = () => {
  const project = resolvePageProject()
  const palette = getActivePalette(project.themeColor)

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo(0, 0)
    const frameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    document.title = project.title
  }, [project.title])

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-teal-500 selection:text-black font-sans"
      style={{ '--color-hud-primary': palette.hex }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-heading uppercase tracking-widest mb-16 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <ArrowLeft size={16} />
          {project.labels?.returnToPortfolio || 'Return to Portfolio'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <DownloadHeader project={project} palette={palette} />
          <DownloadModule project={project} palette={palette} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                palette={palette}
                index={i}
              />
            ))}
          </div>

          <SystemSpecsPanel
            requirements={project.systemRequirements}
            palette={palette}
            project={project}
          />
        </div>
      </div>
    </div>
  )
}

export default DownloadPage
