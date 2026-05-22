import React, { memo } from 'react'

// ─── Static data — defined ONCE at module scope, never recreated ───────────────
// Positions in a viewBox="0 0 100 100" coordinate space (percentage-like units).
// preserveAspectRatio="xMidYMid slice" fills the container, cropping excess.
const NODES = [
  { cx: 8,  cy: 18, r: 0.85, del: '0s'   },
  { cx: 24, cy: 55, r: 0.72, del: '0.9s' },
  { cx: 46, cy: 10, r: 1.05, del: '1.8s' },
  { cx: 70, cy: 38, r: 0.80, del: '0.4s' },
  { cx: 88, cy: 62, r: 0.95, del: '2.4s' },
  { cx: 62, cy: 78, r: 0.72, del: '1.3s' },
  { cx: 38, cy: 68, r: 0.85, del: '0.7s' },
  { cx: 14, cy: 82, r: 0.65, del: '2.9s' },
  { cx: 80, cy: 22, r: 0.90, del: '1.5s' },
  { cx: 52, cy: 44, r: 1.15, del: '0.2s' },
  { cx: 95, cy: 88, r: 0.60, del: '3.2s' },
  { cx: 30, cy: 33, r: 0.75, del: '2.1s' },
  { cx: 3,  cy: 50, r: 0.55, del: '3.8s' },
  { cx: 58, cy: 25, r: 0.80, del: '1.1s' },
]

const EDGES = [
  [0, 11], [11, 1], [1,  6], [6,  7],
  [2, 13], [13, 3], [3,  8], [8,  4],
  [4,  5], [5,  6], [9,  2], [9,  3],
  [9,  5], [11, 9], [1,  9], [0, 12],
  [12, 7], [13,10], [10, 5], [8,  9],
]

// ─── Per-variant colour presets ────────────────────────────────────────────────
const PRESETS = {
  // About section
  about: {
    nodeColor: 'rgba(6,182,212,0.55)',
    edgeColor: 'rgba(6,182,212,0.10)',
    orb1: { pos: '-top-32 -left-20',  color: 'rgba(6,182,212,0.20)',   size: 'w-[500px] h-[500px]', delay: '0s'  },
    orb2: { pos: '-bottom-20 -right-24', color: 'rgba(124,58,237,0.16)', size: 'w-[420px] h-[420px]', delay: '-4s' },
  },
  // Experience section
  experience: {
    nodeColor: 'rgba(6,182,212,0.48)',
    edgeColor: 'rgba(6,182,212,0.08)',
    orb1: { pos: 'top-1/3 -left-24',   color: 'rgba(6,182,212,0.18)',   size: 'w-[450px] h-[450px]', delay: '-2s' },
    orb2: { pos: 'bottom-1/4 -right-20', color: 'rgba(99,102,241,0.14)',  size: 'w-[380px] h-[380px]', delay: '-6s' },
  },
  // Projects section
  projects: {
    nodeColor: 'rgba(99,102,241,0.55)',
    edgeColor: 'rgba(99,102,241,0.09)',
    orb1: { pos: 'top-1/2 -right-24 -translate-y-1/2', color: 'rgba(99,102,241,0.20)',  size: 'w-[480px] h-[480px]', delay: '-3s' },
    orb2: { pos: '-top-20 left-1/4',                   color: 'rgba(6,182,212,0.14)',   size: 'w-[360px] h-[360px]', delay: '-7s' },
  },
  // AI Architecture section
  architecture: {
    nodeColor: 'rgba(6,182,212,0.50)',
    edgeColor: 'rgba(6,182,212,0.08)',
    orb1: { pos: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', color: 'rgba(6,182,212,0.15)', size: 'w-[600px] h-[400px]', delay: '-1s' },
    orb2: { pos: '-bottom-16 -right-20', color: 'rgba(124,58,237,0.12)', size: 'w-[380px] h-[380px]', delay: '-5s' },
  },
  // Footer / leadership section
  footer: {
    nodeColor: 'rgba(124,58,237,0.52)',
    edgeColor: 'rgba(124,58,237,0.09)',
    orb1: { pos: 'top-1/4 left-1/3',   color: 'rgba(124,58,237,0.18)',  size: 'w-[440px] h-[440px]', delay: '-2s' },
    orb2: { pos: 'bottom-1/4 right-1/4', color: 'rgba(6,182,212,0.13)',  size: 'w-[360px] h-[360px]', delay: '-8s' },
  },
}

// ─── Dot-grid helper ───────────────────────────────────────────────────────────
const DOT_GRID_STYLE = {
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)',
  backgroundSize: '44px 44px',
  maskImage:
    'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * AnimatedBackground — drop this as the FIRST child inside any section that
 * uses `position: relative`. The section must have `overflow-hidden`.
 *
 * Usage:
 *   <section className="relative overflow-hidden ...">
 *     <AnimatedBackground variant="about" />
 *     <div className="relative z-10 ...">...</div>
 *   </section>
 */
const AnimatedBackground = memo(({ variant = 'about', showGrid = true }) => {
  const p = PRESETS[variant] ?? PRESETS.about

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Dot grid ──────────────────────────────────────────────────────── */}
      {showGrid && (
        <div className="absolute inset-0" style={DOT_GRID_STYLE} />
      )}

      {/* ── Neural network SVG ──────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connection edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke={p.edgeColor}
            strokeWidth="0.20"
          />
        ))}

        {/* Pulsing nodes */}
        {NODES.map(({ cx, cy, r, del }, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill={p.nodeColor}
            className="neural-node"
            style={{ animationDelay: del }}
          />
        ))}
      </svg>

      {/* ── Gradient orb 1 ──────────────────────────────────────────────── */}
      <div
        className={`gradient-orb absolute rounded-full ${p.orb1.size} ${p.orb1.pos}`}
        style={{
          background: `radial-gradient(ellipse, ${p.orb1.color} 0%, transparent 70%)`,
          animationDelay: p.orb1.delay,
          filter: 'blur(70px)',
        }}
      />

      {/* ── Gradient orb 2 ──────────────────────────────────────────────── */}
      <div
        className={`gradient-orb absolute rounded-full ${p.orb2.size} ${p.orb2.pos}`}
        style={{
          background: `radial-gradient(ellipse, ${p.orb2.color} 0%, transparent 70%)`,
          animationDelay: p.orb2.delay,
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
})

AnimatedBackground.displayName = 'AnimatedBackground'
export default AnimatedBackground
