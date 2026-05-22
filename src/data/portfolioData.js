// â”€â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Icon names are resolved to lucide-react components inside Navigation.jsx
// to avoid storing JSX in data.
export const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'Home'      },
  { id: 'about',      label: 'About',      icon: 'User'      },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects',   label: 'Projects',   icon: 'Code2'     },
  { id: 'leadership', label: 'Leadership', icon: 'Trophy'    },
]

// â”€â”€â”€ Tech Stack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const TECH_STACK = [
  'Python', 'PyTorch', 'LoRA', 'React', 'FastAPI',
  'Docker', 'Airflow', 'RAG', 'FAISS', 'Redis',
  'RabbitMQ', 'Grafana', 'Mistral', 'Llama-3',
]

// â”€â”€â”€ Experience â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const EXPERIENCE = [
  {
    id: 'nokia-2025',
    title: 'Automation Engineer Intern',
    company: 'Nokia Solutions and Networks',
    location: 'India',
    date: 'Aug 2025 â€“ Present',
    responsibilities: [
      'Orchestrating DAGs in Apache Airflow for automated data workflows',
      'Building and maintaining ESDB data ingestion pipelines',
      'Designing Grafana dashboards for operational visibility',
      'Improving automation reliability and monitoring workflows',
      'Supporting scalable data-driven engineering processes',
    ],
  },
]

// â”€â”€â”€ Projects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// accent: 'cyan' | 'violet' | 'indigo'
export const PROJECTS = [
  {
    id: 'text-to-3d',
    title: 'Text to 3D Generative AI',
    description:
      'Deep learning pipelines for text-conditioned 3D asset generation. Implements LoRA adapters for parameter-efficient fine-tuning, GAN-based modeling on ShapeNet, and a local FAISS RAG pipeline for retrieval-augmented context injection.',
    tags: ['Deep Learning', 'LoRA', 'GANs', 'ShapeNet', 'FAISS', 'RAG'],
    github: 'https://github.com/Manish-Desireddi',
    demo: '#',
    accent: 'cyan',
  },
  {
    id: 'windows-assistant',
    title: 'Windows Personal Assistant',
    description:
      'Local intelligent desktop assistant for Windows workflows. Fine-tuned 4-bit Mistral-7B-Instruct with Distil-Whisper voice input and RabbitMQ for asynchronous task handling â€” fully private, low-latency, offline automation.',
    tags: ['Mistral-7B', '4-bit LLM', 'Distil-Whisper', 'RabbitMQ', 'Automation'],
    github: 'https://github.com/Manish-Desireddi',
    demo: '#',
    accent: 'violet',
  },
  {
    id: 'ai-pc-platform',
    title: 'AI PC Building Platform',
    description:
      'AI-powered PC configuration and recommendation platform. React frontend backed by FastAPI, Llama-3 recommendation intelligence, Redis + Celery for background orchestration â€” built for scalable buyer guidance.',
    tags: ['React', 'FastAPI', 'Llama-3', 'Redis', 'Celery'],
    github: 'https://github.com/Manish-Desireddi',
    demo: '#',
    accent: 'indigo',
  },
]

// â”€â”€â”€ Leadership & Education â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LEADERSHIP = {
  vp: {
    title: 'VP Student Body â€” KL-SAC',
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
