export default function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-surface p-5 shadow-card animate-fade-up ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
