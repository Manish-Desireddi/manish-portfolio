import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import SectionHeader from './SectionHeader'
import { Terminal, CornerDownLeft } from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import { CLI_DATA } from '../data/portfolioData'

const handleArrowUp = (input, container, history, index, setIdx, setInput) => {
  if (!input && container) {
    container.scrollTop -= 40
    return
  }
  const next = Math.min(index + 1, history.length - 1)
  if (history[next]) {
    setIdx(next)
    setInput(history[next])
  }
}

const handleArrowDown = (input, container, history, index, setIdx, setInput) => {
  if (!input && container) {
    container.scrollTop += 40
    return
  }
  const next = index - 1
  setIdx(next)
  setInput(history[next] || '')
}

const TerminalMessageHistory = ({ history }) => (
  <>
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
  </>
)

const handlePageScroll = (key, container) => {
  if (!container) return
  container.scrollTop += key === 'PageUp' ? -180 : 180
}

const useTerminalDismiss = (isActive, onDismiss, wrapperRef, inputRef) => {
  useEffect(() => {
    if (!isActive) return

    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onDismiss(false)
        inputRef.current?.blur()
      }
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onDismiss(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isActive, onDismiss, wrapperRef, inputRef])
}

const useScrollLock = (isActive, isHovered) => {
  useEffect(() => {
    if (isActive && isHovered) {
      window.lenis?.stop()
    } else {
      window.lenis?.start()
    }
    return () => {
      window.lenis?.start()
    }
  }, [isActive, isHovered])
}

const InteractiveCLI = () => {
  const [history, setHistory] = useState(() =>
    CLI_DATA.bootMessages.map((msg) => ({ type: 'system', content: msg })),
  )
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTerminalActive, setIsTerminalActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const terminalWrapperRef = useRef(null)
  const lastOutputStartRef = useRef(0)

  useTerminalDismiss(isTerminalActive, setIsTerminalActive, terminalWrapperRef, inputRef)
  useScrollLock(isTerminalActive, isHovered)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    if (lastOutputStartRef.current > 0) {
      el.scrollTop = lastOutputStartRef.current
      lastOutputStartRef.current = 0
    } else {
      el.scrollTop = el.scrollHeight
    }
  }, [history])

  const executeSpecialCommand = (key, trimmed) => {
    if (key === 'clear') {
      setHistory([{ type: 'system', content: 'Terminal cleared. Type "help" for available commands.' }])
      return true
    }
    if (key === 'run agent') {
      setHistory((prev) => [
        ...prev,
        { type: 'user', content: [`$ ${trimmed}`] },
        { type: 'system', content: CLI_DATA.agentSimulationSteps.slice(0, 2) },
      ])
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: 'system', content: CLI_DATA.agentSimulationSteps.slice(2) },
        ])
      }, 1500)
      return true
    }
    return false
  }

  // fallow-ignore-next-line complexity
  const handleCommand = (cmd) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    setCommandHistory((prev) => [trimmed, ...prev])
    setHistoryIndex(-1)
    trackEvent('interaction', 'cli_command', { command: trimmed })

    const key = trimmed.toLowerCase()
    if (executeSpecialCommand(key, trimmed)) return

    if (key === 'cat skills.txt' && containerRef.current) {
      lastOutputStartRef.current = containerRef.current.scrollHeight
    }

    const commandResult = CLI_DATA.commands[key]
    const output = commandResult
      ? commandResult.split('\n')
      : [CLI_DATA.fallbackError, 'Try typing "help" to view executable commands.']

    setHistory((prev) => [
      ...prev,
      { type: 'user', content: [`$ ${trimmed}`] },
      { type: 'system', content: output },
    ])
  }

  // fallow-ignore-next-line complexity
  const handleTerminalKeyDown = (e) => {
    const c = containerRef.current
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleArrowUp(input, c, commandHistory, historyIndex, setHistoryIndex, setInput)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleArrowDown(input, c, commandHistory, historyIndex, setHistoryIndex, setInput)
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault()
      handlePageScroll(e.key, c)
    }
  }

  const handleTerminalClick = () => {
    setIsTerminalActive(true)
    if (!window.getSelection()?.toString()) {
      inputRef.current?.focus()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleCommand(input)
    setInput('')
  }

  return (
    <section id="cli" className="relative py-28 px-4 sm:px-6 bg-transparent border-t border-zinc-900">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionHeader
            index={CLI_DATA.header.index}
            category={CLI_DATA.header.category}
            title={CLI_DATA.header.title}
            subtitle={CLI_DATA.header.subtitle}
          />
        </div>

        <div
          ref={terminalWrapperRef}
          onClick={handleTerminalClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-black/60 backdrop-blur-xl border-2 border-zinc-800 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.1)] cursor-text"
        >
          <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-pink-500" />
              <span className="font-mono text-xs text-zinc-400">{CLI_DATA.promptLabel}</span>
            </div>
            <span
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${isTerminalActive ? 'text-emerald-400' : 'text-zinc-500'
                }`}
            >
              {isTerminalActive ? 'ACTIVE // CLICK OUTSIDE TO EXIT' : 'CLICK TO ACTIVATE INPUT'}
            </span>
          </div>

          <div
            ref={containerRef}
            data-lenis-prevent={isTerminalActive ? 'true' : undefined}
            tabIndex={0}
            className={`p-4 sm:p-6 h-[clamp(280px,50vh,420px)] no-scrollbar font-mono text-xs sm:text-sm relative outline-none ${isTerminalActive ? 'overflow-y-auto' : 'overflow-y-hidden pointer-events-none'
              } ${isTerminalActive && isHovered ? 'overscroll-contain' : ''}`}
          >
            <TerminalMessageHistory history={history} />

            <form onSubmit={onSubmit} className="flex gap-2 items-center mt-4 relative">
              <span className="text-pink-400 font-bold shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                className="flex-1 bg-transparent border-0 outline-none text-zinc-100 font-mono text-xs sm:text-sm focus:ring-0 p-0 m-0 caret-pink-500"
                placeholder="type 'help' or commands here..."
                aria-label="Interactive CLI command prompt"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="send"
              />
              <button
                type="submit"
                className="text-zinc-600 hover:text-pink-400 transition-colors p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Submit command"
              >
                <CornerDownLeft size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveCLI
