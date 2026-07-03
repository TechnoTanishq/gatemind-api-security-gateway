import {
  KeyRound,
  Gauge,
  Database,
  Code2,
  FolderTree,
  Terminal,
  Fingerprint,
  Server,
  Globe,
} from 'lucide-react'

const CHECKPOINTS = [
  { key: 'auth', label: 'API Key Auth', icon: KeyRound },
  { key: 'rate', label: 'Rate Limit', icon: Gauge },
  { key: 'sqli', label: 'SQL Injection', icon: Database },
  { key: 'xss', label: 'XSS', icon: Code2 },
  { key: 'path', label: 'Path Traversal', icon: FolderTree },
  { key: 'cmd', label: 'Cmd Injection', icon: Terminal },
  { key: 'ua', label: 'Suspicious UA', icon: Fingerprint },
]

/**
 * The signature element: a request packet travels left to right through
 * every checkpoint GateMind enforces. One packet clears all seven checks
 * and reaches the backend; a second is stopped mid-way and never does.
 * This is the literal mechanic of the product, not a decorative flourish.
 */
export default function GatewayDiagram({ compact = false }) {
  const nodeCount = CHECKPOINTS.length + 2 // client + checkpoints + backend

  return (
    <div className="relative w-full overflow-x-auto">
      <style>{`
        @keyframes gm-travel-pass {
          0% { left: 0%; opacity: 0; }
          6% { opacity: 1; }
          92% { opacity: 1; background-color: rgb(var(--c-cyan)); }
          100% { left: 100%; opacity: 0; background-color: rgb(var(--c-success)); }
        }
        @keyframes gm-travel-block {
          0% { left: 0%; opacity: 0; background-color: rgb(var(--c-cyan)); }
          6% { opacity: 1; }
          38% { left: 28%; background-color: rgb(var(--c-cyan)); }
          44% { background-color: rgb(var(--c-danger)); transform: translate(-50%,-50%) scale(1.6); }
          60% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          62% { opacity: 0; }
          100% { opacity: 0; left: 28%; }
        }
        .gm-packet-pass {
          animation: gm-travel-pass 7s linear infinite;
        }
        .gm-packet-block {
          animation: gm-travel-block 7s linear infinite;
          animation-delay: 1.4s;
        }
      `}</style>

      <div
        className={`relative min-w-[720px] ${compact ? 'h-28' : 'h-36'}`}
        style={{ minWidth: compact ? 640 : 760 }}
      >
        {/* base line */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border-default" />

        {/* animated packets riding the line */}
        <div
          className="gm-packet-pass absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full shadow-glow"
          style={{ backgroundColor: 'rgb(var(--c-cyan))' }}
        />
        <div
          className="gm-packet-block absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: 'rgb(var(--c-cyan))' }}
        />

        {/* nodes */}
        <div className="relative flex h-full items-center justify-between">
          <Node icon={Globe} label="Client" sublabel="Request" nodeCount={nodeCount} />
          {CHECKPOINTS.map((cp) => (
            <Node key={cp.key} icon={cp.icon} label={cp.label} check nodeCount={nodeCount} />
          ))}
          <Node icon={Server} label="Backend" sublabel="Protected" success nodeCount={nodeCount} />
        </div>
      </div>
    </div>
  )
}

function Node({ icon: Icon, label, sublabel, check, success, nodeCount }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-2" style={{ width: `${100 / nodeCount}%` }}>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-base ${
          success
            ? 'border-success/40 text-success'
            : check
              ? 'border-border-default text-text-secondary'
              : 'border-cyan/40 text-cyan'
        }`}
      >
        <Icon size={15} />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium text-text-secondary leading-tight">{label}</p>
        {sublabel && <p className="text-[10px] text-text-muted leading-tight">{sublabel}</p>}
      </div>
    </div>
  )
}
