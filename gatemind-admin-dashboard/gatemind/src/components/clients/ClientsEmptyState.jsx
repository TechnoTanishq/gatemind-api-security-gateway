import { Building2, Plus } from 'lucide-react'

export default function ClientsEmptyState({ onRegister }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-default bg-surface/50 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-default bg-elevated text-text-muted">
        <Building2 size={20} />
      </div>
      <p className="text-sm font-medium text-text-secondary">No clients registered yet.</p>
      <button
        onClick={onRegister}
        className="focus-ring mt-1 inline-flex items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-void transition hover:opacity-90"
      >
        <Plus size={15} />
        Register First Client
      </button>
    </div>
  )
}
