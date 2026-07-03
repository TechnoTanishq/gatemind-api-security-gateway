import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No data has been reported for this period.',
  icon: Icon = Inbox,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-10 text-center ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border-subtle">
        <Icon size={18} className="text-text-muted" />
      </div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-xs text-text-muted max-w-xs">{description}</p>
    </div>
  )
}
