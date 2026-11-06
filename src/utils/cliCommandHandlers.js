import { getStoredMetricsSummary } from './analytics'
import { CLI_DATA, PROJECTS } from '../data/portfolioData'

const renderBar = (pct) => {
  const filled = Math.min(Math.max(Math.round(pct / 5), 1), 20)
  return `[${'█'.repeat(filled)}${'░'.repeat(20 - filled)}]`
}

const formatTelemetryTime = (timestamp) => {
  if (!timestamp) return 'RECORDED'
  try {
    return new Date(timestamp).toLocaleTimeString('en-GB', { hour12: false })
  } catch {
    return 'RECORDED'
  }
}

const formatTelemetryDetail = (ev) => {
  const { action, metadata = {} } = ev
  if (action === 'preloader_complete') {
    const assets = metadata.totalAssets || 1202
    const duration = metadata.loadDurationMs || 420
    return `preloader_complete (${assets} assets in ${duration}ms)`
  }
  if (action === 'nav_jump') {
    return `nav_jump → #${metadata.section || 'home'}`
  }
  if (action === 'project_demo_open' || action === 'project_repo_open' || action === 'project_card_flip') {
    return `${action} → ${metadata.projectId || 'project'}`
  }
  if (action === 'cli_command') {
    return `cli_command → "${metadata.command || ''}"`
  }
  if (action === 'audio_haptic_toggle') {
    return `audio_haptic_toggle (${metadata.muted ? 'muted' : 'active'})`
  }
  return action
}

const getTelemetryOutput = () => {
  const summary = getStoredMetricsSummary()
  const domPct = Math.min((summary.domLoadMs / 600) * 100, 100)
  const bufPct = Math.min((summary.bufferMs / 1200) * 100, 100)

  const lines = [
    '================================================================================',
    ' HYPERION TELEMETRY ENGINE // LIVE SYSTEM VITALS v0.2.0',
    '================================================================================',
    ` DOM Load Time        : ${summary.domLoadMs}ms  ${renderBar(domPct)} (Optimal)`,
    ` Loading Time         : ${summary.bufferMs}ms  ${renderBar(bufPct)} (Ready)`,
    ` Device Pixel Ratio   : ${summary.dpr}x`,
    ` Viewport Resolution : ${summary.viewport}`,
    ` Heap / Memory Status : ${summary.memory}`,
    '--------------------------------------------------------------------------------',
    ' RECENT TELEMETRY EVENTS:',
  ]

  if (summary.recentEvents && summary.recentEvents.length > 0) {
    summary.recentEvents.slice(0, 3).forEach((ev) => {
      const timeStr = formatTelemetryTime(ev.timestamp)
      const detailStr = formatTelemetryDetail(ev)
      lines.push(`   ${timeStr} [${ev.category || 'telemetry'}] ${detailStr}`)
    })
  } else {
    lines.push('   RECORDED [performance] preloader_complete (1202 assets in 420ms)')
    lines.push('   RECORDED [interaction] session_initialized')
  }

  lines.push('================================================================================')
  lines.push(' Telemetry active & Core Web Vitals live.')
  return lines
}

const getProjectsOutput = () => {
  const lines = [
    '================================================================================',
    ' MANISH DESIREDDI // PRODUCTION SYSTEMS & CATALOG',
    '================================================================================',
  ]

  PROJECTS.forEach((project, idx) => {
    const num = String(idx + 1).padStart(2, '0')
    const tagsStr = project.tags && project.tags.length > 0 ? ` [${project.tags.slice(0, 4).join('/')}]` : ''
    let statusStr = 'ENGINEERING PREVIEW'
    if (project.isPublicRepo) {
      statusStr = project.id === 'cascade-eta' ? 'LIVE DEPLOYMENT' : 'LIVE ON GITHUB'
    } else if (project.demoKind === 'download-aura') {
      statusStr = 'DESKTOP RELEASE v0.1.0'
    } else if (project.demoKind === 'modal-commercial') {
      statusStr = 'COMMERCIAL LICENSE'
    } else if (project.demoKind === 'modal-storefront') {
      statusStr = 'COMMERCE PIPELINE'
    } else if (project.demoKind === 'modal-3d') {
      statusStr = 'TRAINING CONVERGENCE'
    }

    const routeStr = project.downloadSlug ? `#/downloads/${project.downloadSlug}` : '#projects'

    lines.push(` ${num}. ${project.title}${tagsStr}`)
    lines.push(`     ${project.description.slice(0, 85)}...`)
    lines.push(`     Route: ${routeStr} | Status: ${statusStr}`)
    if (idx < PROJECTS.length - 1) {
      lines.push('')
    }
  })

  lines.push('================================================================================')
  lines.push(' Type "npx install aura" to launch the desktop installer workspace.')
  return lines
}

const handleClear = (callbacks) => {
  callbacks.setHistory([{ type: 'system', content: 'Terminal cleared. Type "help" for available commands.' }])
  return true
}

const handleTelemetry = (trimmed, callbacks) => {
  callbacks.setHistory((prev) => [
    ...prev,
    { type: 'user', content: [`$ ${trimmed}`] },
    { type: 'system', content: getTelemetryOutput() },
  ])
  return true
}

const handleProjects = (trimmed, callbacks) => {
  callbacks.setHistory((prev) => [
    ...prev,
    { type: 'user', content: [`$ ${trimmed}`] },
    { type: 'system', content: getProjectsOutput() },
  ])
  return true
}

const handleAuraDownload = (trimmed, callbacks) => {
  if (typeof window !== 'undefined') {
    window.location.hash = '#/downloads/aura'
  }
  callbacks.setHistory((prev) => [
    ...prev,
    { type: 'user', content: [`$ ${trimmed}`] },
    {
      type: 'system',
      content: [
        '[SYS.ROUTER] Navigating to AURA Agentic OS desktop download coordinate...',
        '[ROUTE] #/downloads/aura',
      ],
    },
  ])
  return true
}

const handleAgentSimulation = (trimmed, callbacks) => {
  callbacks.setHistory((prev) => [
    ...prev,
    { type: 'user', content: [`$ ${trimmed}`] },
    { type: 'system', content: CLI_DATA.agentSimulationSteps.slice(0, 2) },
  ])
  setTimeout(() => {
    callbacks.setHistory((prev) => [
      ...prev,
      { type: 'system', content: CLI_DATA.agentSimulationSteps.slice(2) },
    ])
  }, 1500)
  return true
}

// fallow-ignore-next-line complexity
export const executeCliDirective = (key, trimmed, callbacks) => {
  if (key === 'clear') return handleClear(callbacks)
  if (key === 'python telemetry.py' || key === 'telemetry') return handleTelemetry(trimmed, callbacks)
  if (key === 'cat projects' || key === 'cat projects.txt' || key === 'projects') return handleProjects(trimmed, callbacks)
  if (key === 'npx install aura' || key === 'download aura') return handleAuraDownload(trimmed, callbacks)
  if (key === 'python agent.py' || key === 'run agent') return handleAgentSimulation(trimmed, callbacks)
  return false
}
