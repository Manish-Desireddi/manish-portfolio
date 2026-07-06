import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, ShieldCheck, Cloud, Zap, Mic2, HardDrive } from 'lucide-react'

const EXE_HREF   = '/downloads/AUTOS-Cloud-Setup-v0.1.0.exe'
const FILE_NAME  = 'AUTOS-Cloud-Setup-v0.1.0.exe'
const FILE_SIZE  = '~ 42 MB'
const SHA_256    = '7e2c4d91...b8a3 (verify after release)'

const FEATURES = [
  { Icon: Cloud,       title: '6-Provider LLM Routing',  text: 'Priority failover across Groq, Cerebras, Gemini, OpenRouter, Mistral, and SambaNova with health-tracked auto-demotion.' },
  { Icon: Zap,         title: 'Sub-500ms First Token',   text: 'Streaming-first architecture with provider race + restart semantics keeps perceived latency under half a second.' },
  { Icon: Mic2,        title: 'Browser-Native Voice',    text: 'Web Speech API and SpeechSynthesis - zero local model weights, zero GPU dependency, instant cold start.' },
  { Icon: ShieldCheck, title: 'Hardened Tool Surface',   text: '20-pattern shell blocklist, SSRF-validated networking, 100 MB payload cap, SQLite-checkpointed sessions.' },
]

const SYS_REQ = [
  ['OS',     'Windows 10 / 11 (x64)'],
  ['CPU',    'Any modern 4-core CPU'],
  ['RAM',    '4 GB minimum (no GPU req)'],
  ['Net',    'Internet connection req'],
  ['Disk',   '250 MB free space'],
]

const goHome = () => {
  window.location.hash = ''
  window.scrollTo({ top: 0, behavior: 'instant' })
}

const DownloadPage = () => {
  useEffect(() => {
    document.title = 'AUTOS - Cloud Edition'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Background Texture */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Navigation */}
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-heading uppercase tracking-widest mb-16 transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Portfolio
        </button>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center font-heading text-black text-3xl">AU</div>
              <div className="px-3 py-1 border-2 border-emerald-500 text-emerald-400 font-mono text-xs uppercase tracking-[0.3em]">
                Win x64 / Cloud-Powered
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading uppercase tracking-tighter leading-none mb-6">
              AUTOS<br/><span className="text-emerald-500">Cloud Edition</span>
            </h1>
            
            <p className="text-zinc-400 font-sans text-lg max-w-xl leading-relaxed">
              A featherweight desktop client routing through six frontier LLM providers with priority failover. 
              Sub-500ms first token, zero local GPU, ~300 MB runtime footprint.
            </p>
          </motion.div>

          {/* Download Module */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="bg-zinc-950 border-2 border-zinc-800 p-8 h-full flex flex-col justify-between relative group hover:border-emerald-500 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              
              <div>
                <p className="text-emerald-500 font-heading uppercase tracking-widest text-sm mb-4">Latest Build</p>
                <p className="text-white font-mono text-xl break-all mb-2">{FILE_NAME}</p>
                <div className="flex flex-wrap gap-4 text-zinc-500 font-mono text-xs">
                  <span>SIZE: {FILE_SIZE}</span>
                  <span>SHA-256: {SHA_256}</span>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={EXE_HREF}
                download
                className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-black font-heading uppercase text-lg hover:bg-emerald-400 transition-colors"
              >
                <Download size={20} />
                Download Installer
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Features & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-black border border-zinc-800 p-6 hover:border-zinc-500 transition-colors"
              >
                <Icon size={24} className="text-emerald-500 mb-4" />
                <h3 className="font-heading uppercase text-lg tracking-tight mb-2">{title}</h3>
                <p className="text-zinc-400 font-sans text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-950 border border-zinc-800 p-8"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <HardDrive size={20} className="text-zinc-500" />
              <h3 className="font-heading uppercase text-lg tracking-tight">System Specs</h3>
            </div>
            
            <dl className="space-y-4">
              {SYS_REQ.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-zinc-500 font-oswald uppercase tracking-widest text-xs mb-1">{k}</dt>
                  <dd className="text-zinc-200 font-mono text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default DownloadPage
