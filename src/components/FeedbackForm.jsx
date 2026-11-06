import React, { useState } from 'react'
import { MessageSquarePlus, Star } from 'lucide-react'
import { showToast } from './ToastManager'
import { FEEDBACK_META } from '../data/portfolioData'

const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole|cunt|dick|prank|spam|scam)\b/i

const FeedbackForm = ({ onFormSubmit, isSubmitting }) => {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (honeypot) return

    const cleanName = name.trim()
    const cleanRole = role.trim() || 'Visitor'
    const cleanCompany = company.trim()
    const cleanMsg = message.trim()

    if (!cleanName || !cleanMsg) return

    if (PROFANITY_REGEX.test(cleanName) || PROFANITY_REGEX.test(cleanMsg)) {
      showToast({
        type: 'error',
        title: 'SYS.FILTER // CONTENT BLOCKED',
        message: 'Transmission rejected by content safety heuristics.',
      })
      return
    }

    onFormSubmit({
      name: cleanName,
      role: cleanRole,
      company: cleanCompany,
      rating,
      message: cleanMsg,
    })

    setName('')
    setRole('')
    setCompany('')
    setRating(5)
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:col-span-5 bg-zinc-950/90 border border-zinc-800 p-6 sm:p-8 relative space-y-4 shadow-[0_0_30px_rgba(236,72,153,0.08)]"
    >
      <div className="flex items-center gap-2 text-pink-400 font-heading uppercase text-sm tracking-wider mb-2">
        <MessageSquarePlus size={18} />
        <span>{FEEDBACK_META.formHeading}</span>
      </div>

      <input
        type="text"
        name="website_url_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-1.5">
          {FEEDBACK_META.fields.name.label}
        </label>
        <input
          type="text"
          required
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={FEEDBACK_META.fields.name.placeholder}
          className="w-full bg-black border border-zinc-800 focus:border-pink-500 p-3 text-white text-xs sm:text-sm font-mono outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-1.5">
            {FEEDBACK_META.fields.role.label}
          </label>
          <input
            type="text"
            maxLength={50}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={FEEDBACK_META.fields.role.placeholder}
            className="w-full bg-black border border-zinc-800 focus:border-pink-500 p-3 text-white text-xs sm:text-sm font-mono outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-1.5">
            {FEEDBACK_META.fields.organization.label}
          </label>
          <input
            type="text"
            maxLength={50}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={FEEDBACK_META.fields.organization.placeholder}
            className="w-full bg-black border border-zinc-800 focus:border-pink-500 p-3 text-white text-xs sm:text-sm font-mono outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-1.5">
          {FEEDBACK_META.fields.rating.label}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1.5 border border-zinc-800 bg-black hover:border-pink-500 transition-colors cursor-pointer"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={16}
                className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-1.5">
          {FEEDBACK_META.fields.message.label}
        </label>
        <textarea
          rows={3}
          required
          maxLength={320}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={FEEDBACK_META.fields.message.placeholder}
          className="w-full bg-black border border-zinc-800 focus:border-pink-500 p-3 text-white text-xs sm:text-sm font-mono outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-pink-500 hover:bg-white text-black font-heading uppercase text-xs sm:text-sm tracking-widest transition-colors cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? FEEDBACK_META.submittingButton : FEEDBACK_META.submitButton}
      </button>
    </form>
  )
}

export default FeedbackForm
