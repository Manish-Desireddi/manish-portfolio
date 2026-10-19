import React, { useState, useEffect } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { Linkedin, Github, Instagram, ArrowUp, AlertCircle, CheckCircle2, Cookie } from 'lucide-react'
import { showToast } from './ToastManager'
import { trackEvent } from '../utils/analytics'
import { FOOTER_DATA } from '../data/portfolioData'

const DeveloperBadge = () => (
  <div className="w-[120px] shrink-0 border-4 border-white bg-black flex overflow-hidden self-start shadow-xl">
    <div className="w-1/3 border-r-4 border-white flex flex-col items-center justify-center p-2 bg-white text-black">
      <span className="font-heading text-5xl leading-none tracking-tighter">
        {FOOTER_DATA.developerStamp.symbol}
      </span>
    </div>
    <div className="w-2/3 flex flex-col p-2 justify-center">
      <span className="font-oswald text-[10px] leading-tight font-bold uppercase tracking-widest text-white border-b-2 border-white pb-1 mb-1">
        {FOOTER_DATA.developerStamp.name}
      </span>
      <span className="font-oswald text-[8px] leading-tight font-bold uppercase tracking-wider text-white">
        {FOOTER_DATA.developerStamp.role}
      </span>
    </div>
  </div>
)

const TransmissionConfirmedCard = ({ onReset }) => (
  <div className="bg-black/80 border border-emerald-500/60 p-6 sm:p-8 space-y-4">
    <div className="flex items-center gap-3 text-emerald-400">
      <CheckCircle2 size={24} />
      <h3 className="font-heading uppercase text-lg sm:text-xl tracking-tight">
        {FOOTER_DATA.successMessage}
      </h3>
    </div>
    <p className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed">
      Your dispatch has been ingested and logged into the communications buffer. Response protocols will initiate within 24 standard hours.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-4 px-6 py-2.5 bg-zinc-900 hover:bg-emerald-500 hover:text-black text-emerald-400 font-heading uppercase text-xs tracking-wider border border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
    >
      Send Another Transmission
    </button>
  </div>
)

const FormAlertBanners = ({ isOnline, hasErrors }) => (
  <>
    {!isOnline && (
      <div className="p-3 bg-red-950/60 border border-red-500/80 text-red-200 text-xs font-mono flex items-center gap-2">
        <AlertCircle size={16} className="text-red-400 shrink-0" />
        <span>SYS.OFFLINE // Re-establish connectivity to submit messages.</span>
      </div>
    )}
    {hasErrors && (
      <div className="p-3 bg-red-950/60 border border-red-500/80 text-red-200 text-xs font-mono">
        <p className="font-bold mb-1">ERR_TRANSMISSION_FAILED:</p>
        <p>{FOOTER_DATA.errorMessage}</p>
      </div>
    )}
  </>
)

const FieldInput = ({ id, type, name, label, placeholder, disabled, errors }) => (
  <div>
    <label htmlFor={id} className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">
      {label}
    </label>
    <input
      id={id}
      type={type}
      name={name}
      required
      disabled={disabled}
      className="w-full bg-black/60 border border-zinc-800 hover:border-zinc-700 p-3.5 sm:p-4 text-white text-sm font-mono outline-none transition-colors"
      placeholder={placeholder}
    />
    <ValidationError prefix={label} field={name} errors={errors} className="text-red-400 text-xs font-mono mt-1" />
  </div>
)

const FieldTextarea = ({ id, name, label, placeholder, disabled, errors }) => (
  <div>
    <label htmlFor={id} className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      rows={4}
      required
      disabled={disabled}
      className="w-full bg-black/60 border border-zinc-800 hover:border-zinc-700 p-3.5 sm:p-4 text-white text-sm font-mono outline-none transition-colors resize-none"
      placeholder={placeholder}
    />
    <ValidationError prefix={label} field={name} errors={errors} className="text-red-400 text-xs font-mono mt-1" />
  </div>
)

const FormInputFields = ({ isOnline, submitting, errors }) => {
  const disabled = !isOnline || submitting
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldInput
          id="contact-name"
          type="text"
          name="name"
          label={FOOTER_DATA.fields.name.label}
          placeholder={FOOTER_DATA.fields.name.placeholder}
          disabled={disabled}
          errors={errors}
        />
        <FieldInput
          id="contact-email"
          type="email"
          name="email"
          label={FOOTER_DATA.fields.email.label}
          placeholder={FOOTER_DATA.fields.email.placeholder}
          disabled={disabled}
          errors={errors}
        />
      </div>

      <FieldInput
        id="contact-subject"
        type="text"
        name="subject"
        label={FOOTER_DATA.fields.subject.label}
        placeholder={FOOTER_DATA.fields.subject.placeholder}
        disabled={disabled}
        errors={errors}
      />

      <FieldTextarea
        id="contact-message"
        name="message"
        label={FOOTER_DATA.fields.message.label}
        placeholder={FOOTER_DATA.fields.message.placeholder}
        disabled={disabled}
        errors={errors}
      />
    </div>
  )
}

// fallow-ignore-next-line complexity
const ContactForm = ({ isOffline }) => {
  const [formState, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID || 'placeholder')
  const [submitted, setSubmitted] = useState(false)
  const isOnline = !isOffline

  useEffect(() => {
    if (formState.succeeded) {
      setSubmitted(true)
      trackEvent('contact', 'form_dispatched')
      showToast({
        title: 'TRANSMISSION DISPATCHED',
        message: 'Message delivered to Manish Desireddi.',
        type: 'success',
        duration: 4000,
      })
    }
  }, [formState.succeeded])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!isOnline) {
      showToast({
        title: 'NETWORK OFFLINE',
        message: 'Cannot transmit form while system is offline.',
        type: 'error',
        duration: 4000,
      })
      return
    }
    await handleSubmit(e)
  }

  if (submitted) {
    return <TransmissionConfirmedCard onReset={() => setSubmitted(false)} />
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
      <FormAlertBanners isOnline={isOnline} hasErrors={Boolean(formState.errors?.length)} />
      <FormInputFields isOnline={isOnline} submitting={formState.submitting} errors={formState.errors} />

      <button
        type="submit"
        disabled={!isOnline || formState.submitting}
        className="w-full py-4 bg-pink-500 hover:bg-white text-black font-heading uppercase text-sm sm:text-base tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(236,72,153,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer"
      >
        {formState.submitting ? FOOTER_DATA.submittingButton : FOOTER_DATA.submitButton}
      </button>
    </form>
  )
}

const FooterSectorDirectory = () => (
  <div>
    <h3 className="font-heading uppercase text-sm tracking-widest text-zinc-400 mb-4 border-b border-zinc-800 pb-2">
      SYSTEM SECTOR DIRECTORY
    </h3>
    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
      <a href="#home" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">01 // HOME</a>
      <a href="#about" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">02 // ABOUT</a>
      <a href="#experience" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">03 // EXPERIENCE</a>
      <a href="#projects" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">04 // PROJECTS</a>
      <a href="#architecture" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">05 // EXPERTISE</a>
      <a href="#leadership" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">06 // LEADERSHIP</a>
      <a href="#certifications" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">07 // ACCREDITATIONS</a>
      <a href="#cli" className="hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500">08 // TERMINAL CLI</a>
    </div>
  </div>
)

const FooterSocialLinks = () => (
  <div>
    <p className="font-heading uppercase text-xs tracking-widest text-zinc-400 mb-3">EXTERNAL CHANNELS</p>
    <div className="flex gap-4">
      <a
        href="https://linkedin.com/in/Manish-Desireddi"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        aria-label="Manish Desireddi on LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <a
        href="https://github.com/Manish-Desireddi"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        aria-label="Manish Desireddi on GitHub"
      >
        <Github size={20} />
      </a>
      <a
        href="https://huggingface.co/manishdesireddi"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        aria-label="Manish Desireddi on HuggingFace"
      >
        <div
          className="w-5 h-5 bg-current transition-colors"
          style={{
            WebkitMaskImage: "url('/assets/huggingface_logo.svg')",
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: "url('/assets/huggingface_logo.svg')",
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
          }}
        />
      </a>
      <a
        href="https://instagram.com/the.manish.desireddi_"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center hover:bg-pink-900/40 hover:border-pink-400 transition-all text-zinc-400 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        aria-label="Manish Desireddi on Instagram"
      >
        <Instagram size={20} />
      </a>
    </div>
  </div>
)

const Footer = ({ isOffline = false }) => {
  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 3.5,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const openPrivacySettings = () => {
    window.dispatchEvent(new CustomEvent('app:open-privacy'))
  }

  return (
    <footer id="contact" className="relative bg-zinc-950 text-white overflow-hidden border-t-4 border-zinc-900 pb-28 sm:pb-20">
      <div
        className="absolute inset-0 mix-blend-multiply opacity-30 bg-[url('/assets/black-paper.png')] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8 flex flex-col gap-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          <div className="flex-1 max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-none mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {FOOTER_DATA.title}<br />
              <span className="text-pink-400">{FOOTER_DATA.subtitle}</span>
            </h2>

            <ContactForm isOffline={isOffline} />
          </div>

          <div className="flex flex-col justify-between gap-10">
            <FooterSectorDirectory />
            <FooterSocialLinks />

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-pink-500 font-mono text-xs uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer"
                aria-label="Return to top of page"
              >
                <ArrowUp size={14} /> Back to Top
              </button>
              <button
                type="button"
                onClick={openPrivacySettings}
                className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-pink-400 font-mono text-xs uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer"
              >
                <Cookie size={14} /> Cookie Settings
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <p>{FOOTER_DATA.copyright}</p>
          <DeveloperBadge />
        </div>
      </div>
    </footer>
  )
}

export default Footer
