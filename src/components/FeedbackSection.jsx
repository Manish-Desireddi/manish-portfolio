import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import FeedbackCard from './FeedbackCard'
import FeedbackForm from './FeedbackForm'
import { FEEDBACK_META } from '../data/portfolioData'
import { showToast } from './ToastManager'
import { trackEvent } from '../utils/analytics'

const LOCAL_STORAGE_KEY = 'portfolio_feedbacks_v3'
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
          setFeedbacks(cleanData)
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanData))
          } catch {
            // Storage unavailable
          }
          return
        }
      }
    } catch {
      // Fallback to local storage on network/dev failure
    }

    try {
      const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY)
      const parsed = localRaw ? JSON.parse(localRaw) : []
      setFeedbacks(Array.isArray(parsed) ? parsed.filter((item) => !String(item.id).startsWith('seed-')) : [])
    } catch {
      setFeedbacks([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_feedbacks_v2')
      localStorage.removeItem('portfolio_hidden_feedback_ids_v2')
      localStorage.removeItem('portfolio_user_upvotes_v2')
    } catch {
      // Safe fallback if localStorage is unavailable
    }
    fetchFeedbacks()
  }, [fetchFeedbacks])

  const sortedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
  }, [feedbacks])

  const handleVote = (id, direction) => {
    const currentVote = userVotes[id] || null
    const { nextVote, upDelta, downDelta } = calculateVoteDeltas(currentVote, direction)

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

    setFeedbacks((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          upvotes: Math.max(0, (item.upvotes || 0) + upDelta),
          downvotes: Math.max(0, (item.downvotes || 0) + downDelta),
        }
      })
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Storage unavailable
      }
      return updated
    })

    fetch('/api/feedback', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, upDelta, downDelta }),
    }).catch(() => {})

    trackEvent('interaction', `feedback_${direction}voted`, { feedbackId: id, toggled: !nextVote })
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    const newEntry = {
      id: `fb-${Date.now()}`,
      ...formData,
      verified: false,
      upvotes: 1,
      downvotes: 0,
      is_hidden: false,
      created_at: new Date().toISOString(),
    }

    let serverEntry = null
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        serverEntry = await res.json()
      }
    } catch {
      // Offline fallback
    }

    const entryToUse = serverEntry || newEntry
    try {
      const updated = [entryToUse, ...feedbacks.filter((f) => f.id !== entryToUse.id)]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      setFeedbacks(updated)
    } catch {
      setFeedbacks((prev) => [entryToUse, ...prev.filter((f) => f.id !== entryToUse.id)])
    }

    setIsSubmitting(false)
    trackEvent('interaction', 'feedback_submitted', { rating: formData.rating })
    showToast({
      type: 'success',
      title: 'FEEDBACK LOGGED',
      message: 'Your endorsement is now active on the public telemetry wall.',
    })
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
