export default function LoadingState({ label = 'Loading data', rows = 4, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} role="status" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-elevated animate-pulse-slow"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}
