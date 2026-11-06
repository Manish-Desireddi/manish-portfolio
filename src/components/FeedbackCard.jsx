import React from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'

const RatingStars = ({ count = 5 }) => (
  <div className="flex items-center gap-0.5 shrink-0">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
    ))}
  </div>
)

const FeedbackCard = ({ item, onVote, userVote }) => {
  const formattedDate = new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const isUpvoted = userVote === 'up'
  const isDownvoted = userVote === 'down'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-zinc-950/85 border border-zinc-800 hover:border-pink-500/40 p-5 flex flex-col justify-between relative group transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 pr-2">
            <h4 className="font-heading text-sm uppercase text-white tracking-wide flex items-center gap-1.5 truncate">
              <span>{item.name}</span>
              {item.verified !== false && (
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" title="Verified Signal" />
              )}
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 font-mono text-[10px]">
              <span className="text-orange-400 uppercase tracking-wider">{item.role || 'Visitor'}</span>
              {item.company && <span className="text-zinc-500">@ {item.company}</span>}
            </div>
          </div>

          <RatingStars count={item.rating || 5} />
        </div>

        <p className="text-zinc-300 font-sans text-xs leading-relaxed break-words mb-4">
          &ldquo;{item.message}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
        <span>{formattedDate}</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onVote(item.id, 'up')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-mono transition-colors cursor-pointer ${
              isUpvoted
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.3)] font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-pink-500/50 hover:text-white'
            }`}
            title="Upvote transmission"
            aria-label={`Upvote feedback by ${item.name}`}
          >
            <ChevronUp size={12} className={isUpvoted ? 'text-pink-400' : ''} />
            <span>{item.upvotes || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onVote(item.id, 'down')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-mono transition-colors cursor-pointer ${
              isDownvoted
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-cyan-500/50 hover:text-white'
            }`}
            title="Downvote transmission"
            aria-label={`Downvote feedback by ${item.name}`}
          >
            <ChevronDown size={12} className={isDownvoted ? 'text-cyan-400' : ''} />
            <span>{item.downvotes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FeedbackCard