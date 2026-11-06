import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import FeedbackCard from './FeedbackCard'
import FeedbackForm from './FeedbackForm'
import { FEEDBACK_META } from '../data/portfolioData'
import { showToast } from './ToastManager'
import { trackEvent } from '../utils/analytics'

const USER_VOTES_KEY = 'portfolio_user_votes_v3'

const getLocalVotes = () => {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(USER_VOTES_KEY) || '{}')
  } catch {
    return {}
  }
}

// fallow-ignore-next-line complexity
const calculateVoteDeltas = (currentVote, direction) => {
  if (direction === 'up') {
    if (currentVote === 'up') return { nextVote: null, upDelta: -1, downDelta: 0 }
    if (currentVote === 'down') return { nextVote: 'up', upDelta: 1, downDelta: -1 }
    return { nextVote: 'up', upDelta: 1, downDelta: 0 }
  }
  if (currentVote === 'down') return { nextVote: null, upDelta: 0, downDelta: -1 }
  if (currentVote === 'up') return { nextVote: 'down', upDelta: -1, downDelta: 1 }
  return { nextVote: 'down', upDelta: 0, downDelta: 1 }
}

const rescueStrandedFeedbacks = async (serverFeedbacks) => {
  if (typeof window === 'undefined') return []
  try {
    const rawV3 = localStorage.getItem('portfolio_feedbacks_v3')
    const rawV2 = localStorage.getItem('portfolio_feedbacks_v2')
    const listV3 = rawV3 ? JSON.parse(rawV3) : []
    const listV2 = rawV2 ? JSON.parse(rawV2) : []
    const combined = [...(Array.isArray(listV3) ? listV3 : []), ...(Array.isArray(listV2) ? listV2 : [])]

    const candidates = combined.filter(
      (item) => item && typeof item === 'object' && !String(item.id).startsWith('seed-') && item.name && item.message
    )

    if (candidates.length === 0) {
      localStorage.removeItem('portfolio_feedbacks_v3')
      localStorage.removeItem('portfolio_feedbacks_v2')
      return []
    }

    const serverSignatures = new Set(serverFeedbacks.map((s) => `${s.name.trim()}:::${s.message.trim()}`))
    const stranded = candidates.filter((c) => !serverSignatures.has(`${c.name.trim()}:::${c.message.trim()}`))

    if (stranded.length === 0) {
      localStorage.removeItem('portfolio_feedbacks_v3')
      localStorage.removeItem('portfolio_feedbacks_v2')
      return []
    }

    const rescued = []
    let allSucceeded = true

    for (const item of stranded) {
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            role: item.role,
            company: item.company,
            rating: item.rating,
            message: item.message,
            created_at: item.created_at,
          }),
        })
        if (res.status === 201) {
          const saved = await res.json()
          rescued.push(saved)
        } else {
          allSucceeded = false
        }
      } catch {
        allSucceeded = false
      }
    }

    if (allSucceeded) {
      localStorage.removeItem('portfolio_feedbacks_v3')
      localStorage.removeItem('portfolio_feedbacks_v2')
    }

    return rescued
  } catch {
    return []
  }
}

const FeedbackEmptyState = () => (
  <div className="lg:col-span-7 flex flex-col items-center justify-center p-12 bg-zinc-950/80 border border-zinc-800 text-center min-h-[300px]">
    <div className="text-pink-400 font-mono text-xs sm:text-sm uppercase tracking-widest mb-2">
      {FEEDBACK_META.emptyState.title} // {FEEDBACK_META.emptyState.subtitle}
    </div>
    <p className="text-zinc-500 font-sans text-xs max-w-sm leading-relaxed">
      {FEEDBACK_META.emptyState.description}
    </p>
  </div>
)

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userVotes, setUserVotes] = useState(() => getLocalVotes())

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          const cleanData = data.filter((item) => !String(item.id).startsWith('seed-'))
          const rescued = await rescueStrandedFeedbacks(cleanData)
          setFeedbacks(rescued.length > 0 ? [...rescued, ...cleanData] : cleanData)
          return
        }
      }
    } catch {
      // Neon database unreachable or network failure
    }
    // Neon Postgres is the single source of truth - zero localStorage or in-memory fallback
    setFeedbacks([])
  }, [])

  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_hidden_feedback_ids_v2')
      localStorage.removeItem('portfolio_user_upvotes_v2')
    } catch {
      // Safe fallback if localStorage is unavailable
    }
    fetchFeedbacks()
  }, [fetchFeedbacks])

  const sortedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0)
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0)
      if (scoreB !== scoreA) return scoreB - scoreA
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
  }, [feedbacks])

  const handleVote = async (id, direction) => {
    const currentVote = userVotes[id] || null
    const { nextVote, upDelta, downDelta } = calculateVoteDeltas(currentVote, direction)

    const prevUserVotes = { ...userVotes }
    const prevFeedbacks = feedbacks

    const nextUserVotes = { ...userVotes }
    if (nextVote) {
      nextUserVotes[id] = nextVote
    } else {
      delete nextUserVotes[id]
    }
    setUserVotes(nextUserVotes)

    try {
      localStorage.setItem(USER_VOTES_KEY, JSON.stringify(nextUserVotes))
    } catch {
      // Storage unavailable
    }

    setFeedbacks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          upvotes: Math.max(0, (item.upvotes || 0) + upDelta),
          downvotes: Math.max(0, (item.downvotes || 0) + downDelta),
        }
      })
    )

    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, upDelta, downDelta }),
      })
      if (!res.ok) {
        throw new Error('Database vote patch failed')
      }
      trackEvent('interaction', `feedback_${direction}voted`, { feedbackId: id, toggled: !nextVote })
    } catch {
      // Rollback on database or network error
      setUserVotes(prevUserVotes)
      setFeedbacks(prevFeedbacks)
      try {
        localStorage.setItem(USER_VOTES_KEY, JSON.stringify(prevUserVotes))
      } catch {
        // Safe storage fallback
      }
      showToast({
        type: 'error',
        title: 'VOTE FAILED',
        message: 'Unable to record vote to ledger. Please try again.',
      })
    }
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        const saved = await res.json()
        setFeedbacks((prev) => [saved, ...prev.filter((f) => f.id !== saved.id)])
        setIsSubmitting(false)
        trackEvent('interaction', 'feedback_submitted', { rating: formData.rating })
        showToast({
          type: 'success',
          title: 'FEEDBACK LOGGED',
          message: 'Your endorsement is now active on the public telemetry wall.',
        })
        return true
      }
    } catch {
      // Offline or Neon database failure
    }

    setIsSubmitting(false)
    showToast({
      type: 'error',
      title: 'TRANSMISSION FAILED',
      message: 'Unable to save feedback to database. Please try again.',
      duration: 5000,
    })
    return false
  }

  return (
    <section id="feedback" className="relative py-28 px-4 sm:px-6 bg-transparent border-t border-zinc-900">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          index={FEEDBACK_META.index}
          category={FEEDBACK_META.category}
          title={FEEDBACK_META.title}
          subtitle={FEEDBACK_META.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          <FeedbackForm onFormSubmit={handleFormSubmit} isSubmitting={isSubmitting} />

          {sortedFeedbacks.length === 0 ? (
            <FeedbackEmptyState />
          ) : (
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence>
                {sortedFeedbacks.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    onVote={handleVote}
                    userVote={userVotes[item.id] || null}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeedbackSection
