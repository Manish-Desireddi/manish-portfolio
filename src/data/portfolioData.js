// --- Navigation -------------------------------------------------------------
// Icon names are resolved to lucide-react components inside Navigation.jsx
// to avoid storing JSX in data.
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'Code2' },
  { id: 'architecture', label: 'Expertise', icon: 'Cpu' },
  { id: 'leadership', label: 'Leadership', icon: 'Target' },
  { id: 'certifications', label: 'Accreditations', icon: 'Award' },
  { id: 'cli', label: 'Terminal', icon: 'Terminal' },
]

export const CERTIFICATIONS = [
  {
    category: "Artificial Intelligence",
    items: [
      { id: "cert1", title: "Azure AI Engineer Associate", issuer: "Microsoft", date: "Jan 15, 2026", idBadge: "AZ-102", link: "https://learn.microsoft.com/api/credentials/share/en-in/ManishDesireddi-7062/BFC025FD51AAEEFB?sharingId=79004611549A2A1D", clearance: "active", aspectRatio: "16/9" },
      { id: "cert2", title: "OCI 2024 Certified Professional, Generative AI", issuer: "Oracle", date: "July 31, 2024", idBadge: "1Z0-1127-24", link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=E0958DD90E958E58EF7E18513DD608C77E3012702968124269433C4FD28E17C2", clearance: "expired", aspectRatio: "4/3" },
      { id: "cert3", title: "Salesforce Certified AI Associate", issuer: "Salesforce", date: "Oct 19, 2024", idBadge: "N/A", link: "https://trailhead.salesforce.com/en/credentials/aiassociate", clearance: "retired", aspectRatio: "4/3" },
      { id: "cert4", title: "LinkedIn AI for Gaming", issuer: "LinkedIn", date: "Oct 05, 2023", link: "https://lnkd.in/p/d5tBEFHX", clearance: "active", aspectRatio: "4/3" },
    ]
  },
  {
    category: "Cloud Infrastructure & DevOps",
    items: [
      { id: "cert5", title: "OCI 2025 Certified Developer Professional", issuer: "Oracle", date: "Oct 08, 2025", idBadge: "1Z0-1084-25", link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=84A9816BEBDB724467CF275B00FCA4D5A81599FB1D9A7F60EAE12B61FC4B198F", clearance: "active", aspectRatio: "4/3" },
      { id: "cert6", title: "OCI 2025 Certified DevOps Professional", issuer: "Oracle", date: "Oct 15, 2025", idBadge: "1Z0-1109-25", link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C6FDEFE8B8BB195AE5831EF033F4F050AB4B16F87FC75CC05A727BDE3B58DD50", clearance: "active", aspectRatio: "4/3" },
    ]
  },
  {
    category: "Software Development",
    items: [
      { id: "cert8", title: "Unity Certified User: Programmer", issuer: "Unity Technologies", date: "Mar 31, 2025", link: "https://www.credly.com/badges/602b940c-c99c-400b-a172-e7416818db02/public_url", clearance: "active", aspectRatio: "4/3" },
      { id: "cert7", title: "IBMCE CEPYT1IN Python Certificate", issuer: "IBM", date: "Oct 16, 2023", idBadge: "CEPYT1IN", link: "https://courses.etrain.skillsnetwork.site/certificates/fe160acd6c1243b48c7dca486adc2cc9", clearance: "active", aspectRatio: "4/3" },
    ]
  },
  {
    category: "Automation & Professional Experience",
    items: [
      { id: "cert9", title: "Essentials RPA Professional", issuer: "Automation Anywhere", date: "Mar 03, 2026", idBadge: "AAESS-A360", link: "https://certificates.automationanywhere.com/a88994c0-dfab-4d12-b31a-76e94e14db40?record_view=true", clearance: "active", aspectRatio: "3/4" },
      { id: "cert10", title: "Nokia Internship Certificate", issuer: "Nokia", date: "Jun 30, 2026", clearance: "active", aspectRatio: "3/4" },
    ]
  },
];

export const TECH_STACK = [
  // Languages
  'Python', 'C++', 'C#', 'JavaScript', 'TypeScript', 'SQL', 'Bash', 'HTML5', 'CSS3',

  // AI, ML & Core Concepts
  'Generative AI', 'Agentic AI', 'LLMs', 'Deep Learning', 'ML', 'Computer Vision', 'NLP', 'RAG', 'Predictive Modeling',

  // AI/ML Frameworks & Libraries
  'PyTorch', 'TensorFlow', 'scikit-learn', 'LangChain', 'LangGraph', 'HuggingFace', 'Transformers', 'Embeddings', 'LoRA', 'QLoRA', 'Pandas', 'NumPy', 'Matplotlib', 'spaCy', 'NLTK',

  // Backend & Frontend Web
  'FastAPI', 'Flask', 'Django', 'Spring Boot', 'REST APIs', 'React.js', 'Next.js', 'Tailwind CSS', 'Electron', 'Tauri',

  // Databases & Message Brokers
  'PostgreSQL', 'MySQL', 'MongoDB', 'VectorDB', 'ESDB', 'Redis', 'RabbitMQ', 'Celery',

  // Cloud, Infrastructure & DevOps
  'Docker', 'Kubernetes', 'Azure', 'AWS', 'Cloudflare', 'Linux', 'Windows', 'Apache Airflow', 'Jenkins', 'GitHub Actions', 'CI/CD', 'MLOps',

  // Testing, Workflow & Project Management
  'Selenium', 'Robot Framework', 'LoadRunner', 'Git', 'CMake', 'Jira', 'Confluence', 'Agile', 'SDLC',

  // Core Engineering & Hardware Acceleration
  'OOPS', 'Data Structures & Algorithms', 'System Design', 'CUDA', 'ROCm',

  // Graphics & Game Engines
  'Unity', 'Unreal Engine', 'Three.js', 'WebGL', 'Pygame'
];

// --- Experience -------------------------------------------------------------
export const EXPERIENCE = [
  {
    id: 'nokia-2025',
    title: 'Student Intern',
    company: 'Nokia Solutions and Networks',
    location: 'Bengaluru, India',
    date: 'Aug 2025 - Jun 2026',
    responsibilities: [
      'Executed and monitored network configuration modules via Airflow DAGs to verify operational status, analyzed sub-network activation logs, and tracked metrics like execution time and ESDB data pushes.',
      'Parsed execution logs to enforce a strict <4GB memory utilization threshold for specific supported modules, mapping the entire UI workflow into Python Selenium scripts to automate testing across ~80 repetitive scenarios.',
      'Integrated an automated test suite into the existing Test_PetInitStability.py framework to dynamically discover Network Element (NE) master nodes, perform status checks, and push parsed telemetry to Elasticsearch for continuous stability monitoring.',
      'Replaced static XML generation with a dynamic automation script that systematically iterates through base stations and cells, assigning context-specific parameters (e.g., unique cellNames) to resolve duplicate value violations and ensure RAML compliance.',
      'Developed an automated Airflow pipeline leveraging the Druid SQL API over SSH to retrieve and validate KPI timestamps against expected intervals, quantifying missing records across 15-minute, hourly, and daily aggregations and logging health statuses to Elasticsearch.',
      'Created the module_analyser tool to discover script instances via the GUI database, parse execution logs triggered by Airflow DAGs, and generate consolidated CSV/Excel reports detailing errors and execution summaries for Elasticsearch integration.',
      'Built an Airflow ETL pipeline to process raw performance logs, calculating net response durations from virtual user transaction timestamps (with think time and wasted time factors), applying a two-decimal ceiling round-up, and exporting to structured JSON.',
      'Designed and executed a targeted suite of sanity test cases to rapidly validate the cell building module post-build, provisioning test data, triggering critical-path scenarios, and actively monitoring logs to confirm foundational stability without fatal errors.',
      'Conducted core research and developed machine learning components for a Self-Healing UI project, automating the detection and dynamic resolution of interface anomalies during performance verification.',
      'Contributed to the design and implementation of a "Load Model AI", utilizing predictive analytics to simulate complex, high-stress network conditions and benchmark system resilience.',
      'Developed robust data pipelines using Apache Airflow to extract and ingest telemetry metrics into Elasticsearch, feeding real-time data into AI models for continuous performance monitoring.',
      'Integrated AI-driven testing workflows with Jenkins and Robot Framework, enhancing the automation infrastructure to reduce manual verification effort and accelerate release cycles.',
      'Engineered Python-based utility modules to support a scalable AI test automation environment, streamlining test data management, log processing, and model configuration.',
      'Created performance monitoring dashboards using Grafana to visualize key AI metrics and distributed database health, enabling stakeholders to rapidly identify performance bottlenecks.',
    ],
  },
]

// --- Projects ---------------------------------------------------------------
// accent: 'pink' | 'orange' | 'pink' | 'orange'
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
    github: 'https://github.com/Manish-Desireddi', // Update with actual repo if public
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
    accent: 'orange',
  },
]

// --- Leadership & Education -------------------------------------------------
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
        desc: ''
      },
      {
        id: 'prod',
        label: 'Production Operations (Mrs. India 2025)',
        desc: ''
      }
    ],
  },
  education: {
    degree: 'B.Tech - Artificial Intelligence & Data Science',
    institution: 'KL University',
    cgpa: '8.65',
    location: 'Vijayawada, India',
    date: '2022 - 2026'
  },
}


// --- Demo modal variants ----------------------------------------------------
export const DEMO_VARIANTS = {
  'modal-subq': {
    title: 'Audio Transformer is Done & Dusted.',
    body: 'The Sub-Quadratic Audio Transformer Engine is Ready in Github, feel free to Test it.',
  },
  'modal-3d': {
    title: '3D latents are still cooking.',
    body: 'The diffusion pipeline is currently in active training on ShapeNet. A live preview will be available once the latents converge - check back soon.',
    progress: [1, 0.86, 0.64, 0.42, 0.20],
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
