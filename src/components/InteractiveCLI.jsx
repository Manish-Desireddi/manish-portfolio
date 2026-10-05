import React, { useState, useRef, useLayoutEffect } from 'react';
import SectionHeader from './SectionHeader';
import { Terminal } from 'lucide-react';
import { TECH_STACK } from '../data/portfolioData';

const InteractiveCLI = () => {
  const [history, setHistory] = useState([
    { type: 'system', content: 'Manish-OS v2.4.1 initialized.' },
    { type: 'system', content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const prevBehavior = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollTop = el.scrollHeight;
      el.style.scrollBehavior = prevBehavior;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === 'run agent') {
      setHistory((prev) => [
        ...prev,
        { type: 'user', content: [`$ ${trimmed}`] },
        { type: 'system', content: ['[OK] Agent initialized.', '[INFO] Polling for tasks...'] },
      ]);

      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: 'system', content: ['[SYSTEM] Found 1 pending task. Syncing context... [SUCCESS] Ready.'] },
        ]);
      }, 2000);
      return;
    }

    let response = [];
    switch (trimmed.toLowerCase()) {
      case 'help':
        response = [
          'Available commands:',
          '  whoami          - Print user info',
          '  cat skills.txt  - List core competencies',
          '  run agent       - Initialize background agent',
          '  clear           - Clear terminal'
        ];
        break;
      case 'whoami':
        response = [
          'guest@manish-os ~ $ ',
          'Access Level: VISITOR',
          "Status: Evaluating Manish's Profile."
        ];
        break;
      case 'cat skills.txt':
        response = [
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
          '  - Git, SDLC, Agile, CI/CD, CMake'
        ];
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        response = [`bash: ${trimmed}: command not found`];
    }

    setHistory((prev) => [
      ...prev,
      { type: 'user', content: [`$ ${trimmed}`] },
      { type: 'system', content: response },
    ]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <section id="cli" className="relative py-32 px-6 bg-transparent border-t border-zinc-900">
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }
      `}</style>
      <div className="max-w-4xl mx-auto relative z-10" onClick={() => {
        const inputEl = document.getElementById('cli-hidden-input');
        if (inputEl) inputEl.focus();
      }}>
        <div className="text-center mb-16">
          <SectionHeader
            eyebrow="SYS.LOG // Terminal"
            title="INTERACTIVE CLI"
            subtitle="> Access the system backend directly."
          />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border-2 border-zinc-800 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.1)]">
          <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
            <Terminal size={16} className="text-pink-500" />
            <span className="font-mono text-xs text-zinc-400">guest@manish-os ~</span>
          </div>
          <div ref={containerRef} className="p-6 h-[400px] overflow-y-auto no-scrollbar font-mono text-sm relative">
            {history.map((line, i) => (
              <div
                key={i}
                className={`mb-2 ${line.type === 'user' ? 'text-pink-400' : 'text-zinc-300'}`}
              >
                {Array.isArray(line.content) ? (
                  line.content.map((cLine, j) => <div key={j}>{cLine || '\u00A0'}</div>)
                ) : (
                  <div>{line.content}</div>
                )}
              </div>
            ))}
            <form onSubmit={onSubmit} className="flex gap-2 items-center mt-4 relative">
              <span className="text-pink-400">$</span>
              <div className="flex-1 relative flex items-center h-full">
                <input
                  id="cli-hidden-input"
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setCursorPosition(e.target.selectionStart || 0); }}
                  onSelect={(e) => setCursorPosition(e.target.selectionStart || 0)}
                  onKeyUp={(e) => setCursorPosition(e.target.selectionStart || 0)}
                  onClick={(e) => setCursorPosition(e.target.selectionStart || 0)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      if (!input && containerRef.current) {
                        containerRef.current.scrollBy({ top: -50 });
                        e.preventDefault();
                        return;
                      }
                      e.preventDefault();
                      if (commandHistory.length > 0) {
                        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                        setHistoryIndex(nextIndex);
                        const val = commandHistory[nextIndex];
                        setInput(val);
                        setCursorPosition(val.length);
                      }
                    } else if (e.key === 'ArrowDown') {
                      if (!input && containerRef.current) {
                        containerRef.current.scrollBy({ top: 50 });
                        e.preventDefault();
                        return;
                      }
                      e.preventDefault();
                      if (historyIndex > 0) {
                        const nextIndex = historyIndex - 1;
                        setHistoryIndex(nextIndex);
                        const val = commandHistory[nextIndex];
                        setInput(val);
                        setCursorPosition(val.length);
                      } else if (historyIndex === 0) {
                        setHistoryIndex(-1);
                        setInput('');
                        setCursorPosition(0);
                      }
                    }
                  }}
                  className="absolute opacity-0 pointer-events-none w-[1px] h-[1px]"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="text-zinc-100 whitespace-pre">{input.slice(0, cursorPosition)}</span>
                {isFocused ? (
                  <span className="animate-cursor-blink bg-pink-500 text-black whitespace-pre">{input[cursorPosition] || ' '}</span>
                ) : (
                  <span className="text-zinc-100 whitespace-pre">{input[cursorPosition] || ''}</span>
                )}
                <span className="text-zinc-100 whitespace-pre">{input.slice(cursorPosition + 1)}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCLI;
