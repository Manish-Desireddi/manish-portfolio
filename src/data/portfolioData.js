// --- Site Metadata & System Config -------------------------------------------
export const SITE_METADATA = {
  version: '0.1.0',
  displayVersion: 'v0.1.0',
  canonicalBase: 'https://manish-desireddi.vercel.app',
  defaultTitle: 'Manish Desireddi — AI Systems Architect & Full-Stack Engineer',
  defaultDescription: 'Personal portfolio of Manish Desireddi — AI Engineer specializing in Autonomous Multi-Agent Systems, C++/CUDA Neural Inference, and Distributed Automation Pipelines.',
  preloader: {
    buffering: 'BUFFERING SYSTEM',
    frameCounter: 'Loading...',
    monogram: 'MD',
  },
  offlineBanner: 'OFFLINE MODE // LOCAL CACHE ACTIVE',
  hudDrawerFooter: 'PORTFOLIO SYSTEM // HYPERION HUD v0.1.0',
  routes: {
    downloadAura: {
      title: 'AURA AI OS // Desktop Client Download — Manish Desireddi',
      description: 'Download the Windows x64 desktop installer for AURA AI Operating System v0.1.0.',
    },
  },
}

// --- Dynamic Theme Palettes (Tailwind static class tokens) ------------------
export const PROJECT_THEME_PALETTES = {
  teal: {
    bg: 'bg-teal-500',
    bgHover: 'hover:bg-teal-400',
    text: 'text-teal-500',
    textLight: 'text-teal-400',
    border: 'border-teal-500',
    hoverBorder: 'hover:border-teal-500',
    scanline: 'via-teal-500/10',
    glow: 'shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    hex: '#14b8a6',
    borderGlow: 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]',
    badgeBg: 'bg-teal-950/40 text-teal-400 border-teal-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-400',
    text: 'text-emerald-500',
    textLight: 'text-emerald-400',
    border: 'border-emerald-500',
    hoverBorder: 'hover:border-emerald-500',
    scanline: 'via-emerald-500/10',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    hex: '#10b981',
    borderGlow: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    badgeBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
  },
  cyan: {
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-400',
    text: 'text-cyan-500',
    textLight: 'text-cyan-400',
    border: 'border-cyan-500',
    hoverBorder: 'hover:border-cyan-500',
    scanline: 'via-cyan-500/10',
    glow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    hex: '#06b6d4',
    borderGlow: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    badgeBg: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30',
  },
  amber: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-400',
    text: 'text-amber-500',
    textLight: 'text-amber-400',
    border: 'border-amber-500',
    hoverBorder: 'hover:border-amber-500',
    scanline: 'via-amber-500/10',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    hex: '#f59e0b',
    borderGlow: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    badgeBg: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
  },
  violet: {
    bg: 'bg-violet-500',
    bgHover: 'hover:bg-violet-400',
    text: 'text-violet-500',
    textLight: 'text-violet-400',
    border: 'border-violet-500',
    hoverBorder: 'hover:border-violet-500',
    scanline: 'via-violet-500/10',
    glow: 'shadow-[0_0_25px_rgba(139,92,246,0.35)]',
    hex: '#8b5cf6',
    borderGlow: 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]',
    badgeBg: 'bg-violet-950/40 text-violet-400 border-violet-500/30',
  },
  pink: {
    bg: 'bg-pink-500',
    bgHover: 'hover:bg-pink-400',
    text: 'text-pink-500',
    textLight: 'text-pink-400',
    border: 'border-pink-500',
    hoverBorder: 'hover:border-pink-500',
    scanline: 'via-pink-500/10',
    glow: 'shadow-[0_0_25px_rgba(236,72,153,0.35)]',
    hex: '#ec4899',
    borderGlow: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]',
    badgeBg: 'bg-pink-950/40 text-pink-400 border-pink-500/30',
  },
}

// --- Downloadable Software Catalog -------------------------------------------
export const DOWNLOAD_PROJECTS = {
  aura: {
    id: 'proj-5',
    slug: 'aura',
    route: '#/downloads/aura',
    version: 'v0.1.0',
    themeColor: 'teal',
    monogram: 'AU',
    platformBadge: 'Win 11 / Zero-Cloud Engess',
    desktopOnly: true,
    desktopOnlyNotice: 'WINDOWS 11 DESKTOP SUPPORT ONLY — ACCESS FROM A DESKTOP WORKSTATION TO DOWNLOAD INSTALLER',
    title: 'AURA AGENTIC OS',
    editionSubtitle: 'Desktop Edition v0.1.0',
    description: 'A native Windows 11 desktop AI assistant built on a PyWebView/FastAPI architecture with a React 19 frontend. Features an autonomous LangGraph ReAct multi-worker agent, Hybrid RAG (FTS5 BM25 + ChromaDB + Cross-Encoder), and a multimodal Vision Q&A pipeline. Implements Microsoft Edge Neural TTS with a reactive 3D Globe visualizer driven by real-time Web Audio FFT frequency bins.',
    fileName: 'AURA-Setup-v0.1.0.exe',
    fileUrl: '/downloads/AURA-Setup-v0.1.0.exe',
    fileSize: '78.4 MB',
    sha256: '9f83b2a1c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    features: [
      {
        id: 'feat-1',
        title: 'Autonomous Multi-Agent Routing',
        description: 'LangGraph StateGraph coordinating parallel specialist sub-agents with ReAct tool execution.',
        icon: 'Cpu',
      },
      {
        id: 'feat-2',
        title: 'Hybrid Neural RAG Memory',
        description: 'Dual retrieval layer blending SQLite FTS5 BM25 with ChromaDB dense vector indexing and Cross-Encoder reranking.',
        icon: 'Database',
      },
      {
        id: 'feat-3',
        title: 'Multimodal Vision Q&A',
        description: 'Native screen analysis and window context perception guarded by Human-in-the-Loop execution checkpoints.',
        icon: 'Terminal',
      },
      {
        id: 'feat-4',
        title: '3D Audio-Reactive Telemetry',
        description: 'Microsoft Edge Neural TTS paired with Web Audio FFT frequency visualization in a dynamic 3D globe.',
        icon: 'Shield',
      },
    ],
    systemRequirements: [
      { key: 'OS', label: 'OPERATING SYSTEM', value: 'Windows 10 / 11 64-bit', status: 'READY' },
      { key: 'CPU', label: 'PROCESSOR / ARCH', value: 'Any Modern Multi-Core x64 CPU', status: 'READY' },
      { key: 'RAM', label: 'SYSTEM MEMORY', value: '8 GB RAM Minimum (16 GB Recommended)', status: 'READY' },
      { key: 'DISK', label: 'LOCAL STORAGE', value: '500 MB Available Storage', status: 'READY' },
      { key: 'NET', label: 'NETWORK INTERFACE', value: 'Broadband Internet Link for Cloud Telemetry', status: 'READY' },
    ],
  },
}
DOWNLOAD_PROJECTS['ai-assistant'] = DOWNLOAD_PROJECTS.aura

// --- Navigation -------------------------------------------------------------
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'Code2' },
  { id: 'architecture', label: 'Expertise', icon: 'Cpu' },
  { id: 'leadership', label: 'Leadership', icon: 'Target' },
  { id: 'certifications', label: 'Accreditations', icon: 'Award' },
  { id: 'cli', label: 'Terminal', icon: 'Terminal' },
  { id: 'contact', label: 'Contact Dispatch', icon: 'Mail' },
]

// --- Handshake / Overlay ----------------------------------------------------
export const HANDSHAKE_DATA = {
  title: 'INITIALIZE SYSTEM',
  subtitle: 'CLICK TO ESTABLISH NEURAL UPLINK',
  ariaLabel: 'Enter portfolio experience',
}

// --- Intro Cinematic --------------------------------------------------------
export const INTRO_DATA = {
  videoSrc: '/assets/avatar-intro.mp4',
  skipLabel: 'SKIP INTRO',
  muteLabel: 'MUTE',
  unmuteLabel: 'UNMUTE',
}

// --- Hero Section -----------------------------------------------------------
export const HERO_DATA = {
  statusBadge: 'SYSTEM OPERATIONAL // NEURAL UPLINK STABLE',
  nameWords: ['MANISH', 'DESIREDDI'],
  taglines: [
    'Engineering Intelligence.',
    'Scaling throught into Systems.',
  ],
  heroHeading: 'Portfolio',
}

// --- About Section ----------------------------------------------------------
export const ABOUT_DATA = {
  index: '01',
  category: 'About',
  sectionNumber: '01',
  title: 'IDENTITY',
  subtitle: '> SYSTEM SPECIFICATIONS // BIOGRAPHY',
  chips: ['Autonomous Systems', 'Generative AI', 'Full-Stack Architecture', 'Distributed Systems'],
  bioParagraphs: [
    'I am an AI Systems Architect and Software Engineer dedicated to constructing deterministic, high-throughput autonomous systems and neural inference engines. My engineering focus bridges bare-metal C++/CUDA performance with scalable full-stack web architectures.',
    'Previously at Nokia Solutions and Networks, I engineered automated Airflow data pipelines and machine learning frameworks for self-healing UI testing, optimizing complex telecom network activations across distributed nodes.',
  ],
  statTiles: [
    { label: 'PROJECTS', value: '5+', sub: 'COMPLETED' },
    { label: 'CLEARANCES', value: '10', sub: 'ACCREDITATIONS' },
    { label: 'EXPERIENCE', value: '11 Mos', sub: 'Nokia' },
  ],
  resumeUrl: '/assets/Manish_Desireddi_Resume.pdf',
  resumeFileName: 'Manish_Desireddi_Resume.pdf',
  resumeButtonLabel: 'DOWNLOAD DOSSIER',
}

// --- Experience Meta --------------------------------------------------------
export const EXPERIENCE_META = {
  index: '02',
  category: 'EXPERIENCE',
  title: "WHERE I'VE SHIPPED.",
  subtitle: '> EXECUTING PRODUCTION PROTOCOLS AT SCALE...',
}

// --- Projects Meta ----------------------------------------------------------
export const PROJECTS_META = {
  index: '03',
  category: 'PROJECTS',
  title: 'ENGINEERED TO SCALE',
  subtitle: '> High-performance AI pipelines & autonomous systems.',
}

// --- Profile Card -----------------------------------------------------------
export const PROFILE_DATA = {
  name: 'Manish Desireddi',
  title: 'AI & Full-Stack Engineer',
  handle: '@manishdesireddi',
  status: 'AVAILABLE FOR HIRE',
  avatarUrl: '/assets/profile-casual.jpg',
  contactEmail: 'manishdesireddi@gmail.com',
  contactText: 'TRANSMIT SIGNAL',
  quickStats: [
    { label: 'LEVEL', value: 'FRESHER' },
    { label: 'DOMAIN', value: 'AI/SDE' },
    { label: 'BASE', value: 'Hyd, IN' },
  ],
}

// --- Core Expertise ---------------------------------------------------------
export const EXPERTISE_DATA = {
  index: '04',
  category: 'EXPERTISE',
  sectionNumber: '04',
  title: 'CORE CAPABILITIES',
  subtitle: '> ENGINEERING DOMAINS & ARCHITECTURES',
  systems: [
    {
      id: 'agentic',
      category: 'AUTONOMOUS ARCHITECTURE',
      name: 'Agentic AI & Orchestration',
      description: 'Multi-agent frameworks utilizing LangGraph StateGraphs, hierarchical ReAct planning loops, semantic tool-calling routers, and deterministic state transitions.',
      tags: ['LangGraph', 'ReAct', 'Multi-Agent', 'StateGraphs', 'Tool Calling'],
    },
    {
      id: 'inference',
      category: 'NEURAL INFERENCE',
      name: 'High-Performance AI Systems',
      description: 'Sub-quadratic causal attention architectures, bare-metal C++ kernels, custom CUDA/HIP macros, zero-copy PyBind11 bindings, and parameter-efficient LoRA/QLoRA pipelines.',
      tags: ['C++', 'CUDA', 'ROCm', 'PyTorch', 'LoRA', 'ONNX Runtime'],
    },
    {
      id: 'fullstack',
      category: 'FULL-STACK SYSTEMS',
      name: 'Modern Web & Desktop Apps',
      description: 'Distributed web platforms and native desktop utilities built with React 19, Next.js, Vite, Tailwind CSS, PyWebView, FastAPI, and WebSocket real-time streams.',
      tags: ['React 19', 'Next.js', 'FastAPI', 'PyWebView', 'Tailwind', 'GSAP'],
    },
    {
      id: 'automation',
      category: 'DISTRIBUTED INFRASTRUCTURE',
      name: 'Data Pipelines & Automation',
      description: 'High-volume ETL telemetry pipelines, Apache Airflow DAGs, Celery task distribution, Redis message brokering, Elasticsearch log aggregation, and self-healing test automation.',
      tags: ['Apache Airflow', 'Elasticsearch', 'Redis', 'Celery', 'Docker', 'Selenium'],
    },
  ],
}

// --- Certifications & Accreditations ----------------------------------------
export const CERTIFICATIONS_META = {
  index: '06',
  category: 'ACCREDITATIONS',
  sectionNumber: '06',
  title: 'CREDENTIALS & HONORS',
  subtitle: '> VERIFIED CLEARANCES & ACADEMIC MERIT',
  categories: ['All', 'AI', 'Cloud & DevOps', 'Software', 'Automation'],
  modalClose: 'CLOSE CREDENTIAL VIEWER',
  viewCredential: 'VIEW CREDENTIAL',
}

export const CERTIFICATIONS = [
  {
    category: 'AI',
    items: [
      { id: 'cert1', title: 'Azure AI Engineer Associate', issuer: 'Microsoft', date: 'Jan 15, 2026', idBadge: 'AZ-102', link: 'https://learn.microsoft.com/api/credentials/share/en-in/ManishDesireddi-7062/BFC025FD51AAEEFB?sharingId=79004611549A2A1D', clearance: 'active', aspectRatio: '16/9' },
      { id: 'cert2', title: 'OCI 2024 Certified Professional, Generative AI', issuer: 'Oracle', date: 'July 31, 2024', idBadge: '1Z0-1127-24', link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=E0958DD90E958E58EF7E18513DD608C77E3012702968124269433C4FD28E17C2', clearance: 'expired', aspectRatio: '4/3' },
      { id: 'cert3', title: 'Salesforce Certified AI Associate', issuer: 'Salesforce', date: 'Oct 19, 2024', link: 'https://trailhead.salesforce.com/en/credentials/aiassociate', clearance: 'retired', aspectRatio: '4/3' },
      { id: 'cert4', title: 'LinkedIn AI for Gaming', issuer: 'LinkedIn', date: 'Oct 05, 2023', link: 'https://www.linkedin.com/learning/certificates/bd6703c9e794e9c78a06d7109c7ca717c43cad26762477e946eb899979c148b8?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BB5EbvmRFTfau3qAzO9r25w%3D%3D', clearance: 'active', aspectRatio: '4/3' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { id: 'cert5', title: 'OCI 2025 Certified DevOps Professional', issuer: 'Oracle', date: 'Oct 08, 2025', idBadge: '1Z0-1084-25', link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=84A9816BEBDB724467CF275B00FCA4D5A81599FB1D9A7F60EAE12B61FC4B198F', clearance: 'active', aspectRatio: '4/3' },
      { id: 'cert6', title: 'OCI 2025 Certified Developer Professional', issuer: 'Oracle', date: 'Oct 15, 2025', idBadge: '1Z0-1109-25', link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=C6FDEFE8B8BB195AE5831EF033F4F050AB4B16F87FC75CC05A727BDE3B58DD50', clearance: 'active', aspectRatio: '4/3' },
    ],
  },
  {
    category: 'Software',
    items: [
      { id: 'cert8', title: 'Unity Certified User: Programmer', issuer: 'Unity Technologies', date: 'Mar 31, 2025', link: 'https://www.credly.com/badges/9582429d-a450-48f8-8c8d-6d42fcb5b1e1/public_url', clearance: 'active', aspectRatio: '4/3' },
      { id: 'cert7', title: 'IBMCE CEPYT1IN Python Certificate', issuer: 'IBM', date: 'Oct 16, 2023', idBadge: 'CEPYT1IN', link: 'https://courses.etrain.skillsnetwork.site/certificates/fe160acd6c1243b48c7dca486adc2cc9', clearance: 'active', aspectRatio: '4/3' },
    ],
  },
  {
    category: 'Automation',
    items: [
      { id: 'cert9', title: 'Essentials RPA Professional', issuer: 'Automation Anywhere', date: 'Mar 03, 2026', idBadge: 'AAESS-A360', link: 'https://certificates.automationanywhere.com/a88994c0-dfab-4d12-b31a-76e94e14db40?record_view=true', clearance: 'active', aspectRatio: '3/4' },
      { id: 'cert10', title: 'Nokia Internship Certificate', issuer: 'Nokia', date: 'Jun 30, 2026', link: 'https://lnkd.in/p/d9M3xGT3', clearance: 'active', aspectRatio: '3/4' },
    ],
  },
]

// --- Tech Stack Marquee -----------------------------------------------------
export const TECH_STACK = [
  'Python', 'C++', 'C#', 'JavaScript', 'TypeScript', 'SQL', 'Bash', 'HTML5', 'CSS3',
  'Generative AI', 'Agentic AI', 'LLMs', 'Deep Learning', 'ML', 'Computer Vision', 'NLP', 'RAG', 'Predictive Modeling',
  'PyTorch', 'TensorFlow', 'scikit-learn', 'LangChain', 'LangGraph', 'HuggingFace', 'Transformers', 'Embeddings', 'LoRA', 'QLoRA', 'Pandas', 'NumPy', 'Matplotlib', 'spaCy', 'NLTK',
  'FastAPI', 'Flask', 'Django', 'Spring Boot', 'REST APIs', 'React.js', 'Next.js', 'Tailwind CSS', 'Electron', 'Tauri',
  'PostgreSQL', 'MySQL', 'MongoDB', 'VectorDB', 'ESDB', 'Redis', 'RabbitMQ', 'Celery',
  'Docker', 'Kubernetes', 'Azure', 'AWS', 'Cloudflare', 'Linux', 'Windows', 'Apache Airflow', 'Jenkins', 'GitHub Actions', 'CI/CD', 'MLOps',
  'Selenium', 'Robot Framework', 'LoadRunner', 'Git', 'CMake', 'Jira', 'Confluence', 'Agile', 'SDLC',
  'OOPS', 'Data Structures & Algorithms', 'System Design', 'CUDA', 'ROCm',
  'Unity', 'Unreal Engine', 'Three.js', 'WebGL', 'Pygame',
]

// --- Work Experience --------------------------------------------------------
export const EXPERIENCE = [
  {
    id: 'nokia-2025',
    title: 'Student Intern',
    company: 'Nokia Solutions and Networks',
    location: 'Bengaluru, India',
    date: 'AUG 2025 — JUN 2026',
    responsibilities: [
      'Researched and developed machine learning components for a UI Self-Healing poc and a Load Model, utilizing predictive analytics to simulate high-stress network conditions, benchmark system resilience, and dynamically resolve interface anomalies during performance verification.',
      'Architected Python Selenium automation on Chromium browsers to execute ~80 repetitive UI workflows—enforcing strict <4GB memory thresholds—and designed targeted sanity suites to provision test data and validate cell-building modules on critical paths.',
      'Built robust Apache Airflow ETL pipelines leveraging Druid SQL over SSH to process raw performance logs and VUser transaction timestamps into structured JSON, quantifying missing KPI records across 15-minute, hourly, and daily intervals for Elasticsearch ingestion.',
      'Replaced static XML generation with dynamic automation to systematically iterate base stations and assign context-specific parameters for RAML compliance, while integrating the PetInitStability framework to dynamically discover Network Element (NE) master nodes.',
      'Engineered Python utility modules and the module_analyser tool to parse DAG execution logs from GUI databases into consolidated CSV/Excel reports, integrating these AI-driven testing workflows with Jenkins and Robot Framework to accelerate release cycles.',
      'Created comprehensive Grafana performance monitoring dashboards to visualize key AI metrics, execution times, ESDB data pushes, and distributed database health, enabling stakeholders to rapidly identify bottlenecks using real-time Elasticsearch telemetry.'
    ],
  },
]

// --- Showcase Projects ------------------------------------------------------
export const PROJECTS = [
  {
    id: 'subq-audio-engine',
    title: 'Sub-Quadratic Audio Transformer',
    description:
      'A bare-metal, lock-free O(N) linear attention engine for infinite continuous audio streaming. Implements an analytical reverse adjoint backward pass with exact PyTorch TRL integration. Built entirely in C++ with custom CUDA/HIP macros to bypass the standard O(N²) memory barriers of traditional transformers.',
    highlights: [
      'O(1) memory causal attention via associative scan',
      'Zero-copy PyBind11 polymorphic tensor interoperability',
      'Cross-compiles to AMD ROCm/HIP and NVIDIA CUDA',
      'Lock-free SPSC ring ingestion for WebSocket audio',
    ],
    metrics: { memory: 'O(1)', throughput: '>200k tok/s', bounds: '< 256MB VRAM' },
    tags: ['C++', 'CUDA', 'PyTorch', 'PyBind11', 'CMake', 'GSAP'],
    github: 'https://github.com/Manish-Desireddi/Sub-Quadratic-Audio-Transformer-Engine',
    demoKind: 'modal-subq',
    accent: 'pink',
  },
  {
    id: 'text-to-3d',
    title: 'Text to 3D Generative AI',
    description:
      'Deep learning pipelines for text-conditioned 3D asset generation. Implements LoRA adapters for parameter-efficient fine-tuning, GAN-based modeling on ShapeNet, and a local FAISS RAG pipeline for retrieval-augmented context injection.',
    highlights: [
      'LoRA + QLoRA adapters on tight VRAM budgets',
      'GAN geometry pipeline on ShapeNet meshes',
      'FAISS retrieval for context-grounded generation',
      'Latents in active training — checkpoints incoming',
    ],
    metrics: { param: '7B', dataset: 'ShapeNet', method: 'LoRA + GAN' },
    tags: ['Deep Learning', 'LoRA', 'GANs', 'ShapeNet', 'FAISS', 'RAG'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'modal-3d',
    accent: 'pink',
  },
  {
    id: 'agentic-commerce',
    title: 'Agentic Commerce Platform',
    description:
      'A multi-tier autonomous commerce architecture featuring LangGraph StateGraphs and dynamic ReAct tool-calling loops. It orchestrates specialized agents—including a Negotiator, Critic, and Resolution Planner—to handle dynamic pricing, Dual-RAG FAISS semantic search, and post-purchase reverse logistics via JSON-RPC. Built for robust, fail-forward execution using Celery and Redis.',
    highlights: [
      'LangGraph orchestrator for dynamic, multi-agent paradigm routing',
      'Dual-RAG hydration using FAISS and PostgreSQL',
      'Agent-to-Agent (A2A) negotiation via JSON-RPC over Redis',
      'Cryptographic idempotency for autonomous mandates',
    ],
    metrics: { agents: '15 Active', db: 'FAISS & Postgres', protocol: 'JSON-RPC' },
    tags: ['Python', 'LangGraph', 'FAISS', 'Redis', 'Celery', 'Next.js'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'modal-storefront',
    accent: 'pink',
  },
  {
    id: 'self-healing-ui',
    title: 'Self-Healing UI Automation Engine',
    description:
      'An intent-free, embedding-based self-healing element locator for UI automation. It intercepts failed Selenium find_element calls, parsing broken selectors to infer intent, and matches them against a growing DOM baseline. Uses a 7-factor weighted scoring ensemble (including BM25 and structural tree edit distance) to dynamically heal tests in real-time, rewriting automation scripts on disk.',
    highlights: [
      'Zero-hallucination semantic DOM matching via ONNX embeddings',
      '7-factor scoring ensemble (Semantic, Spatial, Structural, etc.)',
      'Robust iframe, shadow DOM, and React portal traversal',
      'Context-aware bug identification and reporting system',
    ],
    metrics: { factors: '7-Weight Scoring', backend: 'ONNX/FastEmbed', fallback: 'BM25' },
    tags: ['Python', 'Selenium', 'ONNX', 'FAISS', 'DOM Analysis', 'XPath'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'modal-commercial',
    accent: 'orange',
  },
  {
    id: 'aura-os',
    title: 'Aura Agentic OS',
    description:
      'A native Windows 11 desktop AI assistant built on a PyWebView/FastAPI architecture with a React 19 frontend. Features an autonomous LangGraph ReAct multi-worker agent, Hybrid RAG (FTS5 BM25 + ChromaDB + Cross-Encoder), and a multimodal Vision Q&A pipeline. Implements Microsoft Edge Neural TTS with a reactive 3D Globe visualizer driven by real-time Web Audio FFT frequency bins.',
    highlights: [
      'Standalone PyWebView desktop architecture with native Win32/UIA controls',
      'Multimodal Vision Q&A pipeline with Human-In-The-Loop (HITL) security gates',
      'Microsoft Edge Neural TTS synced with 3D canvas audio visualization',
      'Hybrid RAG memory using SQLite FTS5, ChromaDB, and Cross-Encoder reranking',
    ],
    metrics: { memory: 'SQLite + ChromaDB', ui: 'React 19 + GSAP', tts: 'Edge Neural' },
    tags: ['Python', 'LangGraph', 'React 19', 'FastAPI', 'ChromaDB', 'PyWebView', 'Tailwind v4'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'download-aura',
    downloadSlug: 'aura',
    accent: 'orange',
  },
]

// --- Leadership & Education -------------------------------------------------
export const LEADERSHIP_META = {
  index: '05',
  category: 'LEADERSHIP',
  title: 'COMMAND & OPERATIONS',
  subtitle: '> ORGANIZATIONAL GOVERNANCE & SCHOLASTIC MERIT',
}

export const LEADERSHIP = {
  vp: {
    title: 'Vice President - Student Activity Centre',
    role: 'Additional Initiatives',
    date: 'Academic Year 2024-25',
    location: 'Guntur, India',
    details: [
      {
        id: 'math',
        label: 'Mathematics Educator (Social Internship)',
        desc: 'Mentored and instructed underprivileged high-school cohorts in foundational mathematics and analytical logic, designing structured lesson tracks and problem sets.',
      },
      {
        id: 'prod',
        label: 'Production Operations (Mrs. India 2025)',
        desc: 'Coordinated live stage infrastructure, lighting sequencing, audio engineering pipelines, and vendor operations for a national-scale pageant production.',
      },
    ],
  },
  education: {
    degree: 'B.Tech - Artificial Intelligence & Data Science',
    institution: 'KL University',
    cgpa: '8.65',
    location: 'Vijayawada, India',
    date: '2022 - 2026',
  },
}

// --- Interactive CLI Config & Data ------------------------------------------
const SKILLS_TXT_LINES = [
  '[AI & Machine Learning]',
  '  - Generative AI, Deep Learning, Machine Learning, GANs, Transformers',
  '  - Agentic AI, Open Source LLMs, NLP, Computer Vision, Predictive Modelling',
  '  - RAG, Embeddings, LoRA, QLoRA, Pandas, NumPy, Matplotlib, spaCy, NLTK',
  '',
  '[Backend & Web Technologies]',
  '  - FastAPI, Flask, Django, Java (Spring Boot), REST APIs, React.js, Next.js,',
  '  - Electron, Tauri, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS',
  '',
  '[Databases & Message Brokers]',
  '  - MongoDB, PostgreSQL, VectorDB, ESDB, Redis, RabbitMQ, Celery',
  '',
  '[Cloud, Infrastructure & DevOps]',
  '  - AWS, Azure, Docker, Kubernetes, Apache Airflow, Jenkins, MLOps',
  '  - Grafana, Git, GitHub Actions, Cloudflare, Windows, Linux',
  '',
  '[Core Engineering & Hardware Acceleration]',
  '  - OOPS, Data Structures & Algorithms, System Design, CUDA, ROCm',
  '',
  '[Simulation & Game Dev]',
  '  - Unity, Unreal Engine, Three.js, WebGL, PyGame',
  '',
  '[Testing, Workflow & Project Management]',
  '  - Robot Framework, LoadRunner, Jira, Confluence',
  '  - Git, SDLC, Agile, CI/CD, CMake',
]

export const CLI_DATA = {
  header: {
    index: '07',
    category: 'TERMINAL',
    title: 'INTERACTIVE CLI',
    subtitle: '> DIRECT NEURAL TERMINAL ACCESS',
  },
  promptLabel: 'guest@manish-os ~',
  bootMessages: [
    'Manish-OS v0.1.0 initialized.',
    'Type "help" to see available commands.',
  ],
  commands: {
    help: 'Available commands: whoami, cat skills.txt, run agent, clear, help',
    whoami: 'Manish Desireddi — AI & Full-Stack Engineer.\nB.Tech AI & Data Science (KL University, CGPA 8.65). Ex-Nokia Intern.',
    'cat skills.txt': SKILLS_TXT_LINES.join('\n'),
    clear: 'CLEAR_TERMINAL',
  },
  agentSimulationSteps: [
    '[AGENT] Initializing neural orchestrator...',
    '[AGENT] Querying knowledge base & hybrid RAG...',
    '[AGENT] Generating sub-tasks & dispatching parallel workers...',
    '[AGENT] Task executed successfully with 0 errors.',
  ],
  fallbackError: 'Command not recognized. Type "help" for valid directives.',
}

// --- Footer & Contact Form --------------------------------------------------
export const FOOTER_DATA = {
  title: 'INITIATE CONTACT',
  subtitle: 'TRANSMIT SECURE TELEMETRY',
  fields: {
    name: { label: 'CODENAME / NAME', placeholder: 'e.g. John Doe' },
    email: { label: 'SIGNAL ADDRESS / EMAIL', placeholder: 'john@example.com' },
    subject: { label: 'DIRECTIVE / SUBJECT', placeholder: 'Project Inquiry' },
    message: { label: 'TRANSMISSION / MESSAGE', placeholder: 'Enter encrypted mission brief...' },
  },
  submitButton: 'DISPATCH TRANSMISSION',
  submittingButton: 'TRANSMITTING...',
  successMessage: 'TRANSMISSION RECEIVED // TELEMETRY ACKNOWLEDGED',
  errorMessage: 'TRANSMISSION FAILED // PLEASE RETRY',
  socials: [
    { label: 'GitHub', url: 'https://github.com/Manish-Desireddi' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/Manish-Desireddi' },
    { label: 'HuggingFace', url: 'https://huggingface.co/manishdesireddi' },
    { label: 'Email', url: 'mailto:manishdesireddi@gmail.com' },
  ],
  copyright: '© 2026 MANISH DESIREDDI. ALL RIGHTS RESERVED.',
  developerStamp: {
    symbol: '!',
    name: 'Manish Desireddi',
    role: 'AI Developer',
  },
}

// --- Modals Data ------------------------------------------------------------
export const MODALS_DATA = {
  privateRepo: {
    title: 'RESTRICTED REPOSITORY',
    badge: 'SECURITY PROTOCOL',
    message: 'This codebase is protected under commercial IP and proprietary licensing.',
    actionButton: 'REQUEST ACCESS CLEARANCE',
  },
  demo: {
    title: 'SYSTEM SIMULATION',
    closeLabel: 'TERMINATE SIMULATION',
  },
}

// --- Privacy / Cookie Consent -----------------------------------------------
export const PRIVACY_DATA = {
  title: 'Cookie & Privacy Preferences',
  description: 'We use cookies and local storage to remember your preferences and understand how visitors interact with this portfolio. Choose "Accept All" to enable all features, or "Essential Only" for basic site functionality.',
  acceptButton: 'Accept All',
  declineButton: 'Essential Only',
  customizeButton: 'Customize Cookies',
  categories: {
    essential: {
      title: 'Essential Cookies',
      badge: 'Always Active',
      description: 'Required for basic website navigation and remembering your cookie preferences.',
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'Helps us see which projects and sections visitors explore the most.',
    },
    performance: {
      title: 'Performance Cookies',
      description: 'Helps us monitor animation smoothness and loading speed across different devices.',
    },
  },
}

// --- Not Found (404) Data ---------------------------------------------------
export const NOT_FOUND_DATA = {
  badge: '[ 404 ] // ROUTE UNRESOLVED',
  code: '404',
  title: 'SYS.ERR // COORDINATE NOT FOUND',
  message: 'The requested coordinate route does not exist in the neural topology.',
  returnButton: 'RETURN TO PORTFOLIO',
}

// --- Demo Modal Project Variants --------------------------------------------
export const DEMO_VARIANTS = {
  'modal-subq': {
    title: 'Audio Transformer is Live on GitHub.',
    body: 'The Sub-Quadratic Audio Transformer Engine is open-source and ready for testing. Access the repository directly below.',
    status: 'LIVE ON GITHUB',
    gateStatus: 'verified',
  },
  'modal-3d': {
    title: '3D latents are still cooking.',
    body: 'The diffusion pipeline is currently in active training on ShapeNet. A live preview will be available once the latents converge - check back soon.',
    status: 'TRAINING CONVERGENCE',
    gateStatus: 'pending',
  },
  'modal-storefront': {
    title: 'Storefront is being assembled.',
    body: 'The AI PC Builder commerce experience is wiring up payments, inventory, and the recommendation engine. Launching soon.',
    status: 'COMMERCE PIPELINE',
    gateStatus: 'pending',
  },
  'modal-commercial': {
    title: 'Available on commercial license.',
    body: 'The Classic build runs fully offline on multi-GPU hardware (AMD Radeon AI Pro + NVIDIA RTX 3060) and is being prepared for commercial release. Reach out for a private trial, demo, or licensing conversation.',
    status: 'COMMERCIAL LICENSE',
    gateStatus: 'pending',
  },
}
