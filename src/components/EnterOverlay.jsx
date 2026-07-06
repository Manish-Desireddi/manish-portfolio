import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EnterOverlay = ({ onEnter }) => {
  return (
    <AnimatePresence>
      <motion.div
        key="enter-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black"
        onClick={onEnter}
      >
        {/* GTA VI Style Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-black to-orange-500/20 opacity-50 pointer-events-none" />
        
        {/* Scanning Line */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <span className="font-heading text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            CLICK TO ENTER
          </span>
          <span className="font-oswald text-zinc-400 uppercase tracking-[0.3em] text-sm md:text-base border-b border-zinc-700 pb-2">
            AUDIO EXPERIENCE RECOMMENDED
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EnterOverlay
