import { ArrowDown, Globe, ShieldHalf, KeyRound, ShieldAlert, Gauge, BarChart3, Server } from 'lucide-react'

const STAGES = [
  { icon: Globe, label: 'Client Application', desc: 'Sends the original request', tone: 'neutral' },
  { icon: ShieldHalf, label: 'GateMind Gateway', desc: 'Intercepts every request', tone: 'cyan' },
  { icon: KeyRound, label: 'Authentication', desc: 'Verifies the API key', tone: 'cyan' },
  { icon: ShieldAlert, label: 'Threat Detection', desc: 'Scans for injection & XSS', tone: 'signal' },
  { icon: Gauge, label: 'Rate Limiting', desc: 'Enforces limits via Redis', tone: 'violet' },
  { icon: BarChart3, label: 'Analytics Logging', desc: 'Writes to PostgreSQL', tone: 'violet' },
  { icon: Server, label: 'Backend Service', desc: 'Only clean requests arrive', tone: 'success' },
]

const TONE_STYLES = {
  neutral: 'border-border-default text-text-secondary',
  cyan: 'border-cyan/40 text-cyan bg-cyan/5',
  signal: 'border-signal/40 text-signal bg-signal/5',
  violet: 'border-violet/40 text-violet bg-violet/5',
  success: 'border-success/40 text-success bg-success/5',
}

export default function ArchitectureDiagram() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      {STAGES.map((stage, i) => (
        <div key={stage.label} className="flex w-full flex-col items-center">
          <div
            className={`flex w-full items-center gap-3 rounded-xl border bg-surface px-4 py-3 shadow-card ${TONE_STYLES[stage.tone]}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-current/30 bg-base">
              <stage.icon size={16} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-text-primary">{stage.label}</p>
              <p className="text-xs text-text-muted">{stage.desc}</p>
            </div>
          </div>
          {i < STAGES.length - 1 && (
            <ArrowDown size={16} className="my-1.5 text-text-muted" strokeWidth={1.5} />
          )}
        </div>
      ))}
    </div>
  )
}
