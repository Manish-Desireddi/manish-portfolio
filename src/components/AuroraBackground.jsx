import React, { memo } from 'react'

/**
 * AuroraBackground — single fixed-position canvas that sits behind ALL
 * post-hero content. Sections render transparent over it, eliminating
 * seams between About / Experience / Projects / Architecture / Footer.
 *
 * Pure CSS — three drifting radial-gradient blobs + a faint dot grid mask.
 * GPU-composited (transform + opacity only), zero JS per frame.
 */
const AuroraBackground = memo(() => (
  <div
    className="fixed inset-0 -z-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
    style={{ background: '#09090b' }}
  >
    {/* Base vignette so edges feel deeper than centre */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(24,24,27,0) 0%, rgba(9,9,11,0.85) 100%)',
      }}
    />

    {/* Aurora blob 1 — cyan, top-left */}
    <div
      className="aurora-blob absolute rounded-full"
      style={{
        top: '-15%',
        left: '-10%',
        width: '70vw',
        height: '70vw',
        background:
          'radial-gradient(circle at center, rgba(6,182,212,0.28) 0%, rgba(6,182,212,0.08) 35%, transparent 65%)',
        filter: 'blur(60px)',
        animationDelay: '0s',
      }}
    />

    {/* Aurora blob 2 — violet, mid-right */}
    <div
      className="aurora-blob absolute rounded-full"
      style={{
        top: '25%',
        right: '-15%',
        width: '65vw',
        height: '65vw',
        background:
          'radial-gradient(circle at center, rgba(139,92,246,0.26) 0%, rgba(139,92,246,0.07) 35%, transparent 65%)',
        filter: 'blur(70px)',
        animationDelay: '-7s',
      }}
    />

    {/* Aurora blob 3 — indigo, bottom-centre */}
    <div
      className="aurora-blob absolute rounded-full"
      style={{
        bottom: '-20%',
        left: '20%',
        width: '75vw',
        height: '75vw',
        background:
          'radial-gradient(circle at center, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.06) 35%, transparent 65%)',
        filter: 'blur(80px)',
        animationDelay: '-14s',
      }}
    />

    {/* Aurora blob 4 — soft pink/magenta accent */}
    <div
      className="aurora-blob absolute rounded-full"
      style={{
        top: '55%',
        left: '35%',
        width: '50vw',
        height: '50vw',
        background:
          'radial-gradient(circle at center, rgba(192,38,211,0.16) 0%, rgba(192,38,211,0.04) 35%, transparent 65%)',
        filter: 'blur(90px)',
        animationDelay: '-3s',
      }}
    />

    {/* Subtle dot grid overlay — masked at edges */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage:
          'radial-gradient(ellipse 90% 90% at 50% 50%, black 25%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 90% 90% at 50% 50%, black 25%, transparent 100%)',
      }}
    />

    {/* Top + bottom fade so blobs feel infinite */}
    <div
      className="absolute top-0 left-0 right-0 h-32"
      style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.85), transparent)' }}
    />
  </div>
))

AuroraBackground.displayName = 'AuroraBackground'
export default AuroraBackground
