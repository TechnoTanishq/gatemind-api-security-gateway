import { AlertTriangle, RotateCw } from 'lucide-react'

export default function ErrorState({
  message = 'Could not load this data.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-10 text-center ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 border border-danger/30">
        <AlertTriangle size={18} className="text-danger" />
      </div>
      <p className="text-sm font-medium text-text-primary">Something went wrong</p>
      <p className="text-xs text-text-muted max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded-md border border-border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary transition hover:border-cyan/50 hover:text-cyan"
        >
          <RotateCw size={13} />
          Retry
        </button>
      )}
    </div>
  )
}
