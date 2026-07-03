import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

const ACCENTS = {
  cyan: 'text-cyan bg-cyan/10 border-cyan/20',
  signal: 'text-signal bg-signal/10 border-signal/20',
  danger: 'text-danger bg-danger/10 border-danger/20',
  violet: 'text-violet bg-violet/10 border-violet/20',
  success: 'text-success bg-success/10 border-success/20',
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'cyan',
  trend,
  trendDirection = 'up',
  isPlaceholder = false,
  suffix,
}) {
  const trendUp = trendDirection === 'up'
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-subtle bg-surface p-5 shadow-card transition hover:border-border-default hover:shadow-elevated animate-fade-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold text-text-primary font-tabular">
              {value}
            </span>
            {suffix && <span className="text-xs text-text-muted">{suffix}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${ACCENTS[accent]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      {isPlaceholder ? (
        <p className="mt-3 text-[11px] font-medium text-text-muted">Awaiting backend endpoint</p>
      ) : trend ? (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium">
          {trendUp ? (
            <ArrowUpRight size={12} className="text-danger" />
          ) : (
            <ArrowDownRight size={12} className="text-success" />
          )}
          <span className={trendUp ? 'text-danger' : 'text-success'}>{trend}</span>
          <span className="text-text-muted">vs. yesterday</span>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${
          accent === 'cyan'
            ? 'bg-cyan/20'
            : accent === 'signal'
              ? 'bg-signal/20'
              : accent === 'danger'
                ? 'bg-danger/20'
                : accent === 'violet'
                  ? 'bg-violet/20'
                  : 'bg-success/20'
        }`}
      />
    </div>
  )
}
