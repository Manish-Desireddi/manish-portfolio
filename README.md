# Manish Desireddi — Developer Portfolio

> **AI & Automation Engineer** | Nokia Solutions and Networks · KL University  
> A premium, futuristic single-page portfolio designed to showcase deep-tech projects, professional experience, and technical breadth — built to impress recruiter, hiring manager, and peer engineer alike.

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square)](https://www.framer.com/motion/)

---

## Overview

A fully custom, performance-first React portfolio demonstrating advanced frontend engineering alongside AI/automation expertise. Every section uses GPU-composited animations, Framer Motion spring physics, and a coordinated dark/cyan/violet design language.

**Design philosophy:** No template. No UI library. Every pixel is handcrafted in Tailwind CSS with purpose.

---

## Features

| Feature | Detail |
|---|---|
| **Hero intro overlay** | Full-screen animated intro with avatar video, typewriter taglines, and audio ambience. Exits with spring-physics slide-up transition |
| **3D tilt ProfileCard** | Cursor-following perspective tilt + atmospheric behind-glow + surface light reflection — all via Framer MotionValues (zero React re-renders) |
| **Neural network backgrounds** | SVG dot graphs with CSS-pulsing nodes and gradient orbs in every section — unique colour palette per section |
| **Scroll-driven timeline** | useScroll fills the experience timeline line precisely as the user scrolls |
| **3D project cards** | Hardware-accelerated tilt with per-card glow, demo modal, GitHub/demo links |
| **AI Architecture section** | Four system cards describing real production-grade AI work |
| **Education / Leadership bento** | Responsive bento grid for academic credentials and student leadership roles |
| **Tech marquee** | Infinite smooth horizontal scroll of 20+ technologies — pure CSS, no JS |
| **Floating bottom nav** | Spring-animated pill that hides on scroll down; icon-only on mobile |
| **Resume download** | One-click PDF download from the nav bar |
| **Keyboard / accessibility** | Focus rings, aria-label, aria-current, semantic HTML throughout |
| **Cursor orb** | Ambient cursor trail rendered on a canvas — GPU composited |
| **Performance** | MotionValues for cursor/tilt (no setState), memo() on pure components, manual Vite chunk splitting |

---

## Tech Stack

```
React 18.3.1           – UI layer, function components, hooks
Vite 5.3.1             – Build tool, HMR, ESM dev server
Tailwind CSS 3.4.4     – Utility-first styling (JIT mode)
Framer Motion 11.3.0   – Animations, spring physics, MotionValues
lucide-react 0.400.0   – SVG icon set
PostCSS / Autoprefixer – CSS processing
Google Fonts           – Inter · JetBrains Mono · Caveat
```

**Zero runtime dependencies beyond the above list.**

---

## Project Structure

```
portfolio/
├── public/
│   └── assets/
│       ├── avatar-intro.mp4      ← Hero background video
│       ├── profile-casual.jpg    ← ProfileCard portrait photo
│       ├── campus.jpg            ← Optional background image
│       └── resume.pdf            ← Downloadable resume
│
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx  ← Reusable neural SVG + orbs backdrop
│   │   ├── Hero.jsx                ← Full-screen intro overlay
│   │   ├── Navigation.jsx          ← Bottom floating nav pill
│   │   ├── About.jsx               ← Bio + ProfileCard + tech marquee
│   │   ├── ProfileCard.jsx         ← 3D tilt identity card
│   │   ├── Experience.jsx          ← Scroll-driven timeline
│   │   ├── Projects.jsx            ← 3D tilt project cards + DemoModal
│   │   ├── DemoModal.jsx           ← Full-screen project showcase modal
│   │   ├── AIArchitecture.jsx      ← "What I Build" system cards
│   │   ├── Footer.jsx              ← Education bento + contact CTA
│   │   ├── SectionHeader.jsx       ← Reusable animated section heading
│   │   └── CursorOrb.jsx           ← Ambient cursor trail (canvas)
│   │
│   ├── data/
│   │   └── portfolioData.js        ← All content: projects, experience, skills
│   │
│   ├── styles/
│   │   └── animations.css          ← Custom keyframes and CSS animation classes
│   │
│   ├── App.jsx                     ← Root: heroActive state, AnimatePresence
│   └── main.jsx                    ← ReactDOM.createRoot entry point
│
├── index.html                      ← Vite HTML shell, Google Fonts import
├── tailwind.config.js              ← Custom font families + keyframes
├── postcss.config.js
├── vite.config.js                  ← Manual chunk splitting
└── package.json
```

---

## Installation & Setup

### Prerequisites

- **Node.js ≥ 18** (LTS recommended)
- **npm ≥ 9**

```bash
# 1. Clone the repository
git clone https://github.com/Manish-Desireddi/portfolio.git
cd portfolio

# 2. Install dependencies
npm install
```

### Required Assets

Place the following files in `public/assets/` before running the dev server:

| File | Purpose |
|---|---|
| `avatar-intro.mp4` | Hero section background video (muted, looping) |
| `profile-casual.jpg` | Profile photo displayed in the ProfileCard |
| `campus.jpg` | Optional background image |
| `resume.pdf` | Downloadable resume PDF |

---

## Development Commands

```bash
# Start the local dev server (hot module replacement)
npm run dev
# → http://localhost:5173

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
# → http://localhost:4173
```

---

## Customisation

All personal content lives in **`src/data/portfolioData.js`** — edit once to update the entire site:

```js
export const NAV_ITEMS    = [...]   // Navigation sections
export const EXPERIENCE   = [...]   // Work timeline entries
export const PROJECTS     = [...]   // Project cards
export const TECH_STACK   = [...]   // Marquee tech items
export const LEADERSHIP   = [...]   // Education & leadership bento
```

To change colours, fonts, or animation timings, edit `tailwind.config.js` and `src/styles/animations.css`.

---

## Deployment

### Vercel (Recommended)

Connect your GitHub repository at [vercel.com](https://vercel.com) — Vite is auto-detected.

**Build settings** (auto-configured):
```
Framework Preset : Vite
Build Command    : npm run build
Output Directory : dist
Install Command  : npm install
```

Or use the CLI:
```bash
npm i -g vercel
vercel
```

### Netlify

1. Push to GitHub  
2. Connect repo at [app.netlify.com](https://app.netlify.com)  
3. Build command: `npm run build` · Publish directory: `dist`

### Manual

```bash
npm run build
# Upload the dist/ folder to any static host (S3, GitHub Pages, Cloudflare Pages)
```

---

## Performance Notes

- **No `setState` for cursor/tilt**: All cursor tracking uses Framer `MotionValue` — values pipe directly to DOM transforms without triggering React re-renders.
- **`memo()` on all pure components**: No unnecessary re-renders on any leaf component.
- **CSS animations over JS**: Marquee, neural pulse, orb drift, cursor blink — all pure CSS `@keyframes`.
- **Manual Vite chunk splitting**: `react-vendor` and `framer` chunks load in parallel.
- **`will-change: transform`** only on animated elements to promote GPU layers without over-allocating.

---

## Accessibility

- All images have descriptive `alt` attributes
- Navigation buttons use `aria-label` and `aria-current="page"` for the active section
- Interactive elements have `focus-visible` rings styled in cyan
- Hero video is `muted`, `playsInline`, `aria-hidden`; audio is opt-in
- Decorative SVGs are `aria-hidden="true"`
- Semantic HTML throughout: `<section>`, `<article>`, `<nav>`, `<footer>`, `<main>`

---

## Contact

**Manish Desireddi**  
AI & Automation Engineer · B.Tech AI & Data Science, KL University (CGPA 8.2)  
Nokia Solutions and Networks | VP Student Body, KL-SAC

- GitHub: [github.com/Manish-Desireddi](https://github.com/Manish-Desireddi)
- LinkedIn: [linkedin.com/in/manishdesireddi](https://linkedin.com/in/manishdesireddi)
- Email: manishdesireddi@gmail.com

---

## License

Personal portfolio — all rights reserved.
