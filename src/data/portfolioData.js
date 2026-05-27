// --- Navigation -------------------------------------------------------------
// Icon names are resolved to lucide-react components inside Navigation.jsx
// to avoid storing JSX in data.
export const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'Home'      },
  { id: 'about',      label: 'About',      icon: 'User'      },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects',   label: 'Projects',   icon: 'Code2'     },
  { id: 'leadership', label: 'Leadership', icon: 'Trophy'    },
]

// --- Tech Stack -------------------------------------------------------------
export const TECH_STACK = [
  'Python', 'PyTorch', 'LoRA', 'React', 'FastAPI',
  'Docker', 'Airflow', 'RAG', 'FAISS', 'Redis',
  'RabbitMQ', 'Grafana', 'Mistral', 'Llama-3',
]

// --- Experience -------------------------------------------------------------
export const EXPERIENCE = [
  {
    id: 'nokia-2025',
    title: 'Automation Engineer Intern',
    company: 'Nokia Solutions and Networks',
    location: 'India',
    date: 'Aug 2025 - Present',
    responsibilities: [
      'Orchestrating DAGs in Apache Airflow for automated data workflows',
      'Building and maintaining ESDB data ingestion pipelines',
      'Designing Grafana dashboards for operational visibility',
      'Improving automation reliability and monitoring workflows',
      'Supporting scalable data-driven engineering processes',
    ],
  },
]

// --- Projects ---------------------------------------------------------------
// accent: 'cyan' | 'violet' | 'indigo' | 'emerald'
// demoKind: 'modal-3d' | 'download-cloud' | 'modal-storefront' | 'modal-commercial'
// githubKind: 'private' (default) | 'public-url'
export const PROJECTS = [
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
    accent: 'cyan',
  },
  {
    id: 'agentic-desktop-classic',
    title: 'Agentic Desktop AI Assistant - Classic',
    description:
      'Multi-GPU offline desktop AI. Qwen2.5-14B + Whisper large-v3 on AMD via Vulkan, XTTS v2 + IndicF5 on NVIDIA via CUDA / DeepSpeed. 8-node LangGraph DAG with 5-level risk gating, Human-in-the-Loop confirmation, and 54 governed tools. ChromaDB RAG with cross-encoder reranking and 6-algorithm Reciprocal Rank Fusion. React 18 + Tauri v2 frontend.',
    highlights: [
      'Dual-GPU inference: AMD Vulkan + NVIDIA CUDA',
      '8-node LangGraph DAG with 5-level risk gating',
      '54 governed tools with HITL confirmation',
      '6-algorithm Reciprocal Rank Fusion RAG',
    ],
    metrics: { tools: '54', latency: '<2s', mode: 'Offline' },
    tags: ['Qwen2.5-14B', 'LangGraph', 'XTTS v2', 'Whisper', 'ChromaDB', 'Vulkan', 'Tauri'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'modal-commercial',
    accent: 'violet',
  },
  {
    id: 'agentic-desktop-cloud',
    title: 'Agentic Desktop AI Assistant - Cloud',
    description:
      '6-provider LLM routing (Groq / Cerebras / Gemini / OpenRouter / Mistral / SambaNova) with priority failover, health-tracked auto-demotion, and sub-500ms first-token latency. Zero-GPU 300 MB cloud backend on Render with SQLite-checkpointed LangGraph sessions, Gemini-embedded ChromaDB RAG, MMR diversity, and hash-deterministic fallback embeddings. Browser-side STT / TTS, SSRF-validated tool surface.',
    highlights: [
      '6-provider LLM router with priority failover',
      'Sub-500ms first-token latency',
      'SQLite-checkpointed LangGraph sessions',
      'Zero-GPU 300MB footprint on Render free tier',
    ],
    metrics: { providers: '6', latency: '<500ms', footprint: '300MB' },
    tags: ['Llama-3.3-70B', 'Gemini 2.0', 'LangGraph', 'ChromaDB', 'FastAPI', 'Render', 'Tauri'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'download-cloud',
    accent: 'emerald',
  },
  {
    id: 'ai-pc-platform',
    title: 'AI PC Building Platform',
    description:
      'AI-powered PC configuration and recommendation platform. React frontend backed by FastAPI, Llama-3 recommendation intelligence, Redis + Celery for background orchestration - built for scalable buyer guidance.',
    highlights: [
      'Llama-3 recommendation engine for components',
      'Celery workers for async inference tasks',
      'Redis caching + session management',
      'Streaming model responses with real-time UI',
    ],
    metrics: { model: 'Llama-3', cache: 'Redis', workers: 'Celery' },
    tags: ['React', 'FastAPI', 'Llama-3', 'Redis', 'Celery'],
    github: 'https://github.com/Manish-Desireddi',
    demoKind: 'modal-storefront',
    accent: 'indigo',
  },
]

// --- Leadership & Education -------------------------------------------------
export const LEADERSHIP = {
  vp: {
    title: 'VP Student Body - KL-SAC',
    details: [
      'Led student-body coordination and large-scale event operations',
      'Managed NAAC inspection planning and institutional execution',
      'Coordinated cross-functional teams and campus-wide initiatives',
      'Strengthened leadership, communication, and operational planning',
    ],
  },
  education: {
    degree: 'B.Tech - Artificial Intelligence & Data Science',
    institution: 'KL University',
    cgpa: '8.2',
    highlights: [
      'Focus on AI/ML, data systems, and software engineering',
      'Scalable automation research and distributed computing',
    ],
  },
}

// --- Demo modal variants ----------------------------------------------------
export const DEMO_VARIANTS = {
  'modal-3d': {
    title: '3D latents are still cooking.',
    body: 'The diffusion pipeline is currently in active training on ShapeNet. A live preview will be available once the latents converge - check back soon.',
    progress: [1, 1, 0.74, 0.42, 0.18],
  },
  'modal-storefront': {
    title: 'Storefront is being assembled.',
    body: 'The AI PC Builder commerce experience is wiring up payments, inventory, and the recommendation engine. Launching soon.',
    progress: [1, 1, 0.66, 0.5, 0.22],
  },
  'modal-commercial': {
    title: 'Available on commercial license.',
    body: 'The Classic build runs fully offline on multi-GPU hardware and is being prepared for commercial release. Reach out for a private trial, demo, or licensing conversation.',
    progress: [1, 1, 1, 0.85, 0.6],
  },
}
