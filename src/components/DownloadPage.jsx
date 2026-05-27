import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, ShieldCheck, Cloud, Zap, Mic2, HardDrive } from 'lucide-react'
import Neural3DBackground from './Neural3DBackground'

const EXE_HREF   = '/downloads/AUTOS-Cloud-Setup-v0.1.0.exe'
const FILE_NAME  = 'AUTOS-Cloud-Setup-v0.1.0.exe'
const FILE_SIZE  = '~ 42 MB'
const SHA_256    = '7e2c4d91...b8a3 (verify after release)'

const FEATURES = [
  { Icon: Cloud,       title: '6-provider LLM routing',  text: 'Priority failover across Groq, Cerebras, Gemini, OpenRouter, Mistral, and SambaNova with health-tracked auto-demotion.' },
  { Icon: Zap,         title: 'Sub-500ms first token',   text: 'Streaming-first architecture with provider race + restart semantics keeps perceived latency under half a second.' },
  { Icon: Mic2,        title: 'Browser-native voice',    text: 'Web Speech API and SpeechSynthesis - zero local model weights, zero GPU dependency, instant cold start.' },
  { Icon: ShieldCheck, title: 'Hardened tool surface',   text: '20-pattern shell blocklist, SSRF-validated networking, 100 MB payload cap, SQLite-checkpointed sessions.' },
]

const SYS_REQ = [
  ['OS',     'Windows 10 / 11 (x64)'],
  ['CPU',    'Any modern 4-core CPU'],
  ['RAM',    '4 GB minimum (no GPU required)'],
  ['Net',    'Internet connection for cloud inference'],
  ['Disk',   '250 MB free space'],
]

const goHome = () => {
  window.location.hash = ''
  window.scrollTo({ top: 0, behavior: 'instant' })
}

const DownloadPage = () => {
  useEffect(() => {
    document.title = 'Agentic Desktop AI - Cloud Build'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Neural3DBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-mono mb-12 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to portfolio
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-5">
            <img src="/downloads/autos-logo.png" alt="AUTOS" className="w-14 h-14 rounded-2xl shadow-lg shadow-emerald-500/20" />
            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-[10px] font-mono tracking-[0.2em] uppercase">
              Windows / x64 / Cloud-powered
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-5">
            AUTOS — Cloud Edition
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            A featherweight desktop client that routes through six frontier LLM providers with priority failover.
            Sub-500ms first token, zero local GPU, ~300 MB runtime footprint. v0.1.0 — download the installer to run it on your machine.
          </p>
        </motion.div>

        {/* Download card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl p-6 md:p-8 overflow-hidden relative"
        >
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                Latest build
              </p>
              <p className="text-white font-mono text-lg break-all">{FILE_NAME}</p>
              <p className="text-zinc-500 text-xs font-mono mt-2">
                {FILE_SIZE} &nbsp;&middot;&nbsp; SHA-256 {SHA_256}
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.03, boxShadow: '0 0 44px rgba(52,211,153,0.35)' }}
              whileTap={{ scale: 0.97 }}
              href={EXE_HREF}
              download
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-semibold text-base hover:bg-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Download size={18} aria-hidden="true" />
              Download .exe
            </motion.a>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="rounded-2xl bg-zinc-900/50 border border-white/8 p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center mb-4">
                <Icon size={18} className="text-emerald-300" aria-hidden="true" />
              </div>
              <h3 className="text-white font-semibold mb-1.5">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* System requirements */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 rounded-2xl bg-zinc-900/50 border border-white/8 p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <HardDrive size={16} className="text-zinc-400" aria-hidden="true" />
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase">
              System Requirements
            </h3>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {SYS_REQ.map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-3 border-b border-white/5 pb-2">
                <dt className="text-zinc-500 text-xs font-mono uppercase tracking-wider w-12 shrink-0">{k}</dt>
                <dd className="text-zinc-300 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Footer note */}
        <p className="mt-10 text-zinc-600 text-xs font-mono text-center">
          Build is provided as-is. Verify the SHA-256 hash before installation.
        </p>
      </div>
    </div>
  )
}

export default DownloadPage
