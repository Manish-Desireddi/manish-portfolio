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
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'run agent') {
      setHistory((prev) => [
        ...prev,
        { type: 'user', content: `$ ${trimmed}` },
        { type: 'system', content: '[OK] Agent initialized.\n[INFO] Polling for tasks...' },
      ]);

      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: 'system', content: '[SYSTEM] Found 1 pending task. Syncing context... [SUCCESS] Ready.' },
        ]);
      }, 2000);
      return;
    }

    let response = '';
    switch (trimmed.toLowerCase()) {
      case 'help':
        response = 'Available commands:\n  whoami          - Print user info\n  cat skills.txt  - List core competencies\n  run agent       - Initialize background agent\n  clear           - Clear terminal';
        break;
      case 'whoami':
        response = 'guest@manish-os ~ $ \nAccess Level: VISITOR\nStatus: Evaluating Manish\'s Profile.';
        break;
      case 'cat skills.txt':
        response = `[AI & ML]
  - Machine Learning, Deep Learning, LLMs, Agentic AI
  - NLP, Predictive Modeling, PyTorch, spaCy, NLTK, LangChain

[Data Science]
  - Pandas, NumPy

[Infrastructure]
  - MLOps, System Design, CUDA, Apache Airflow, Docker, Git

[Core & Frameworks]
  - Python, C++, SQL, OOP, Data Structures & Algorithms
  - REST APIs, SDLC, Flask, FastAPI`;
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        response = `bash: ${trimmed}: command not found`;
    }

    setHistory((prev) => [
      ...prev,
      { type: 'user', content: `$ ${trimmed}` },
      { type: 'system', content: response },
    ]);
  };

  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    }
    handleCommand(input);
    setInput('');
  };

  return (
    <section id="cli" className="relative py-32 px-6 bg-transparent border-t border-zinc-900">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionHeader
            eyebrow="SYS.LOG // Terminal"
            title="INTERACTIVE CLI"
            subtitle="Access the system backend directly."
          />
        </div>

        <div className="bg-black border-2 border-zinc-800 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.1)]">
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
            <Terminal size={16} className="text-pink-500" />
            <span className="font-mono text-xs text-zinc-400">guest@manish-os ~</span>
          </div>
          <div ref={containerRef} className="p-6 h-[400px] overflow-y-auto no-scrollbar font-mono text-sm">
            {history.map((line, i) => (
              <div
                key={i}
                className={`mb-2 whitespace-pre-wrap ${line.type === 'user' ? 'text-pink-400' : 'text-zinc-300'}`}
              >
                {line.content}
              </div>
            ))}
            <form onSubmit={onSubmit} className="flex gap-2 items-center mt-4">
              <span className="text-pink-400">$</span>
              <div className="relative flex-1 flex items-center">
                <span className="text-zinc-100 absolute pointer-events-none whitespace-pre font-mono">
                  {input}<span className="inline-block w-2 h-4 bg-zinc-400 animate-pulse align-middle ml-[2px]" />
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (commandHistory.length > 0) {
                        const nextIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                        setHistoryIndex(nextIndex);
                        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
                      }
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (historyIndex > 0) {
                        const nextIndex = historyIndex - 1;
                        setHistoryIndex(nextIndex);
                        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
                      } else if (historyIndex === 0) {
                        setHistoryIndex(-1);
                        setInput('');
                      }
                    }
                  }}
                  className="w-full bg-transparent outline-none text-transparent caret-transparent font-mono z-10"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCLI;
