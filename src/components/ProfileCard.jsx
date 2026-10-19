import React from 'react'
import { PROFILE_DATA } from '../data/portfolioData'

const ProfileCard = ({
  name = PROFILE_DATA.name,
  title = PROFILE_DATA.title,
  handle = PROFILE_DATA.handle,
  status = PROFILE_DATA.status,
  contactText = PROFILE_DATA.contactText,
  contactEmail = PROFILE_DATA.contactEmail,
  avatarUrl = PROFILE_DATA.avatarUrl,
  quickStats = PROFILE_DATA.quickStats,
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto group">
      <div className="relative p-2 transition-all duration-300">
        <div className="relative border-2 border-zinc-800 overflow-hidden mb-6">
          <img
            src={avatarUrl}
            alt={`${name} — profile photo`}
            loading="lazy"
            draggable={false}
            className="w-full h-auto block grayscale group-hover:grayscale-0 transition-all duration-500"
            style={{
              filter: 'contrast(1.2) brightness(0.9)',
            }}
          />

          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 bg-black border border-emerald-500">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-heading text-emerald-400 uppercase tracking-widest">{status}</span>
          </div>
        </div>

        <div className="px-2">
          <div className="mb-6">
            <h3 className="text-4xl font-heading text-pink-500 tracking-tighter leading-none mb-2 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">
              {name}
            </h3>
            <p className="text-orange-400 font-oswald uppercase tracking-widest text-sm drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">
              {title}
            </p>
            <p className="text-pink-300/70 text-xs font-mono mt-1">ID: {handle}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6 pt-4 border-t border-pink-900/40">
            {quickStats.map(({ label, value }) => (
              <div key={label} className="text-left border-l-2 border-pink-500/30 pl-2 group-hover:border-pink-400 transition-colors">
                <p className="text-xl font-heading text-white tracking-tight">{value}</p>
                <p className="text-[9px] font-mono text-orange-400/80 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>

          <a
            href={`mailto:${contactEmail}`}
            className="block w-full text-center py-3 bg-pink-950/20 border border-pink-500/50 text-white font-heading uppercase tracking-widest hover:bg-pink-500 hover:border-pink-500 hover:text-black transition-all shadow-[0_0_15px_rgba(236,72,153,0)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            {contactText}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
