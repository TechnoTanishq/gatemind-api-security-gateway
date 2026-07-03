import { AlertTriangle, RotateCw } from 'lucide-react'

export default function ClientsErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/20 bg-danger/5 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 text-danger">
        <AlertTriangle size={20} />
      </div>
      <p className="text-sm font-medium text-text-primary">Unable to fetch clients.</p>
      <p className="max-w-xs text-xs text-text-muted">
        The GateMind API didn't respond. Check that the backend is running and try again.
      </p>
      <button
        onClick={onRetry}
        className="focus-ring mt-1 inline-flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-4 py-2 text-sm font-medium text-text-primary transition hover:border-cyan/40 hover:text-cyan"
      >
        <RotateCw size={14} />
        Retry
      </button>
    </div>
  )
}
