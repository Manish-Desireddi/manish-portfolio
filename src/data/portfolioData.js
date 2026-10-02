// --- Navigation -------------------------------------------------------------
// Icon names are resolved to lucide-react components inside Navigation.jsx
// to avoid storing JSX in data.
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'Code2' },
  { id: 'architecture', label: 'Expertise', icon: 'Cpu' },
  { id: 'certifications', label: 'Accreditations', icon: 'Award' },
  { id: 'cli', label: 'Terminal', icon: 'Terminal' },
]

export const CERTIFICATIONS = [
  {
    category: "Cloud & Enterprise Architecture",
    items: [
      { id: "cert1", title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024", idBadge: "AWS-CSA-PRO" },
      { id: "cert2", title: "Azure Security Engineer", issuer: "Microsoft", date: "2023", idBadge: "AZ-500" },
      { id: "cert3", title: "GCP Professional Cloud Architect", issuer: "Google Cloud", date: "2023", idBadge: "GCP-PCA" }
    ]
  },
  {
    category: "Autonomous AI & Intelligent Systems",
    items: [
      { id: "cert4", title: "Deep Learning Specialization", issuer: "DeepLearning.AI", date: "2023", idBadge: "DL-AI-01" },
      { id: "cert5", title: "Generative AI Fundamentals", issuer: "Google", date: "2024", idBadge: "GEN-AI-01" },
      { id: "cert6", title: "AI Engineering Professional", issuer: "IBM", date: "2023", idBadge: "IBM-AI-01" }
    ]
  },
  {
    category: "Core Engineering & Industry Experience",
    items: [
      { id: "cert7", title: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2024", idBadge: "CKA-01" },
      { id: "cert8", title: "Full-Stack Web Development", issuer: "Meta", date: "2022", idBadge: "META-FS-01" },
      { id: "cert9", title: "Advanced React Patterns", issuer: "Frontend Masters", date: "2023", idBadge: "FM-REACT-01" }
    ]
  }
];

// --- Tech Stack -------------------------------------------------------------
export const TECH_STACK = [
  'Python', 'C++', 'SQL', 'OOP', 'Data Structures & Algorithms', 'Machine Learning', 'Deep Learning', 'LLMs', 'Agentic AI', 'NLP', 'Predictive Modeling', 'REST APIs', 'SDLC', 'Git', 'MLOps', 'System Design', 'PyTorch', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'spaCy', 'NLTK', 'CUDA', 'Apache Airflow', 'LangChain', 'Docker'
]

// --- Experience -------------------------------------------------------------
export const EXPERIENCE = [
  {
    id: 'nokia-2025',
    title: 'Student Intern',
    company: 'Nokia Solutions and Networks',
    location: 'Bengaluru, India',
    date: 'Aug 2025 - Jun 2026',
    responsibilities: [
      'Conducted core research and developed machine learning components for a Self-Healing UI project, automating the detection and dynamic resolution of interface anomalies during performance verification.',
      'Contributed to the design and implementation of a "Load Model AI", utilizing predictive analytics to simulate complex, high-stress network conditions and benchmark system resilience.',
      'Developed robust data pipelines using Apache Airflow to extract and ingest telemetry metrics into Elasticsearch, feeding real-time data into AI models for continuous performance monitoring.',
      'Integrated AI-driven testing workflows with Jenkins and Robot Framework, enhancing the automation infrastructure to reduce manual verification effort and accelerate release cycles.',
      'Engineered Python-based utility modules to support a scalable AI test automation environment, streamlining test data management, log processing, and model configuration.',
      'Created performance monitoring dashboards using Grafana to visualize key AI metrics and distributed database health, enabling stakeholders to rapidly identify performance bottlenecks.'
    ],
  },
]

// --- Projects ---------------------------------------------------------------
// accent: 'pink' | 'orange' | 'fuchsia' | 'amber'
// demoKind: 'modal-3d' | 'download-cloud' | 'modal-storefront' | 'modal-commercial'
// githubKind: 'private' (default) | 'public-url'
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
    demoKind: 'video-demo',
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
    github: 'https://github.com/Manish-Desireddi', // Update with actual repo if public
    demoKind: 'modal-storefront',
    accent: 'fuchsia',
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
    github: 'https://github.com/Manish-Desireddi', // Update with actual repo if public
    demoKind: 'modal-commercial',
    accent: 'orange',
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
    accent: 'amber',
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
    cgpa: '8.65',
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
    body: 'The Classic build runs fully offline on multi-GPU(AMD Radeon AI Pro r9700 32 GB+ NVIDIA RTX 3060 12 GB OC) hardware and is being prepared for commercial release. Reach out for a private trial, demo, or licensing conversation.',
    progress: [1, 1, 1, 0.85, 0.6],
  },
}
