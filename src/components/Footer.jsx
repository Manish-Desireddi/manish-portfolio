import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = useCallback(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 2.5 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <footer id="leadership" className="relative bg-zinc-950 text-white overflow-hidden border-t-4 border-zinc-900">
      {/* Background texture for concrete/dark vibe */}
      <div 
        className="absolute inset-0 mix-blend-multiply opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col gap-24">
        
        {/* Top Section: Connect & Propaganda */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          
          <div className="flex-1">
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-none mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Get the latest updates &<br/>
              Collaborations:<br/>
              <span className="text-cyan-400">Connect with me.</span>
            </h2>
            
            {/* Input fields mimicking Rockstar Propaganda sign up */}
            <form 
              className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl" 
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.elements[0].value;
                if (!email) return;
                window.open(`mailto:manishdesireddi@gmail.com?subject=Newsletter Subscription&body=Hi Manish,%0D%0A%0D%0APlease add ${email} to your updates list!`);
                e.target.reset();
                alert("Subscription request staged in your email client!");
              }}
            >
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                required
                className="flex-1 bg-black/60 border border-zinc-700 px-6 py-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                className="bg-zinc-100 text-black px-10 py-4 font-heading text-xl uppercase tracking-wider hover:bg-cyan-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-8 justify-end">
            <div className="flex gap-6">
              <a href="https://linkedin.com/in/Manish-Desireddi" target="_blank" rel="noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-zinc-400 hover:text-cyan-400">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Manish-Desireddi" target="_blank" rel="noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-zinc-400 hover:text-cyan-400">
                <Github size={24} />
              </a>
              <a href="https://huggingface.co/manishdesireddi" target="_blank" rel="noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-zinc-400 hover:text-cyan-400 group">
                <img src="https://huggingface.co/front/assets/huggingface_logo.svg" alt="Hugging Face" className="w-6 h-6 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              </a>
              <a href="https://instagram.com/manishdesireddi" target="_blank" rel="noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-zinc-400 hover:text-cyan-400">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: ESRB & Legal */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-start lg:items-end gap-16 border-t border-zinc-800 pt-12">
          
          <div className="flex-1">
            <p className="font-mono text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-wider max-w-3xl">
              COPYRIGHT © 2026 // SITE BY Manish Desireddi // DESIGNED IN HYDERABAD, INDIA // ALL TRADEMARKS BELONG TO THEIR RESPECTIVE OWNERS.
            </p>
          </div>

          {/* Custom ESRB Box */}
          <div className="w-[120px] shrink-0 border-4 border-white bg-black flex overflow-hidden self-start">
            <div className="w-1/3 border-r-4 border-white flex flex-col items-center justify-center p-2 bg-white text-black">
              <span className="font-heading text-5xl leading-none tracking-tighter">!</span>
            </div>
            <div className="w-2/3 flex flex-col p-2 justify-center">
              <span className="font-oswald text-[10px] leading-tight font-bold uppercase tracking-widest text-white border-b-2 border-white pb-1 mb-1">
                Manish<br/>Desireddi
              </span>
              <span className="font-oswald text-[8px] leading-tight font-bold uppercase tracking-wider text-white">
                AI Developer
              </span>
            </div>
          </div>

        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-cyan-400 z-20"
      >
        <ArrowUp size={20} />
      </motion.button>

    </footer>
  )
}

export default Footer
