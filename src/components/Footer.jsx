import React, { useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react'
import { useForm, ValidationError } from '@formspree/react'

const ContactForm = ({ onSuccess }) => {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID)

  useEffect(() => {
    if (state.succeeded) {
      onSuccess()
    }
  }, [state.succeeded, onSuccess])

  return (
    <form
      className="mt-8 flex flex-col gap-4 max-w-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="name"
          placeholder="ENTER NAME"
          required
          disabled={state.submitting}
          className="flex-1 bg-black/60 border border-zinc-700 px-6 py-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-pink-400 transition-colors placeholder:text-zinc-600 disabled:opacity-50"
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
        <input
          type="tel"
          name="phone"
          placeholder="ENTER PHONE"
          required
          disabled={state.submitting}
          className="flex-1 bg-black/60 border border-zinc-700 px-6 py-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-pink-400 transition-colors placeholder:text-zinc-600 disabled:opacity-50"
        />
        <ValidationError prefix="Phone" field="phone" errors={state.errors} />
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="ENTER EMAIL ADDRESS"
          required
          disabled={state.submitting}
          className="w-full bg-black/60 border border-zinc-700 px-6 py-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-pink-400 transition-colors placeholder:text-zinc-600 disabled:opacity-50"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
        <textarea
          name="message"
          placeholder="ENTER MESSAGE"
          required
          disabled={state.submitting}
          rows="4"
          className="w-full bg-black/60 border border-zinc-700 px-6 py-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-pink-400 transition-colors placeholder:text-zinc-600 disabled:opacity-50 resize-none"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={state.submitting}
          className="bg-zinc-100 text-black px-10 py-4 font-heading text-xl uppercase tracking-wider hover:bg-pink-400 transition-colors disabled:opacity-50 sm:w-auto w-full"
        >
          {state.submitting ? 'Sending...' : state.succeeded ? 'Sent!' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

const Footer = () => {
  const [formKey, setFormKey] = useState(0)

  const handleSuccess = useCallback(() => {
    setTimeout(() => {
      setFormKey(prev => prev + 1)
    }, 5000)
  }, [])

  const scrollToTop = useCallback(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 3.5, easing: (t) => 1 - Math.pow(1 - t, 4) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <footer id="contact" className="relative bg-zinc-950 text-white overflow-hidden border-t-4 border-zinc-900">
      <div
        className="absolute inset-0 mix-blend-multiply opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-28 sm:pb-12 flex flex-col gap-24">

        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">

          <div className="flex-1">
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-none mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Interested in my work or<br />
              have an opportunity?<br />
              <span className="text-pink-400">Let's talk.</span>
            </h2>

            <ContactForm key={formKey} onSuccess={handleSuccess} />
          </div>

          <div className="flex flex-col gap-8 justify-end">
            <div className="flex gap-6">
              <a href="https://linkedin.com/in/Manish-Desireddi" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Manish-Desireddi" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400">
                <Github size={24} />
              </a>
              <a href="https://huggingface.co/manishdesireddi" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400">
                <div
                  className="w-6 h-6 bg-current transition-colors"
                  style={{
                    WebkitMaskImage: "url('https://huggingface.co/front/assets/huggingface_logo.svg')",
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: "url('https://huggingface.co/front/assets/huggingface_logo.svg')",
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                  }}
                />
              </a>
              <a href="https://instagram.com/the.manish.desireddi_" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row justify-between items-start lg:items-end gap-16 border-t border-zinc-800 pt-12">

          <div className="flex-1">
            <p className="font-mono text-xs sm:text-sm text-zinc-500 leading-relaxed uppercase tracking-wider max-w-3xl">
              COPYRIGHT @ 2026 // SITE BY Manish Desireddi // DESIGNED IN HYDERABAD, INDIA // ALL TRADEMARKS BELONG TO THE RESPECTIVE OWNER.
            </p>
          </div>

          <div className="w-[120px] shrink-0 border-4 border-white bg-black flex overflow-hidden self-start">
            <div className="w-1/3 border-r-4 border-white flex flex-col items-center justify-center p-2 bg-white text-black">
              <span className="font-heading text-5xl leading-none tracking-tighter">!</span>
            </div>
            <div className="w-2/3 flex flex-col p-2 justify-center">
              <span className="font-oswald text-[10px] leading-tight font-bold uppercase tracking-widest text-white border-b-2 border-white pb-1 mb-1">
                Manish<br />Desireddi
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
        className="absolute bottom-8 right-8 w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-pink-400 z-[60]"
      >
        <ArrowUp size={20} />
      </motion.button>

    </footer>
  )
}

export default Footer
