import { Building2 } from 'lucide-react'
import Modal from '../ui/Modal'
import PlanBadge from './PlanBadge'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/formatters'

export default function ViewClientModal({ open, onClose, client }) {
  if (!client) return null

  const rows = [
    { label: 'Client ID', value: `#${client.clientId}` },
    { label: 'Plan', value: <PlanBadge plan={client.plan} /> },
    { label: 'Status', value: <StatusBadge status={client.status} /> },
    { label: 'Registered on', value: formatDate(client.createdAt) },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Client details">
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-elevated px-3.5 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default bg-base text-sm font-semibold text-text-secondary">
            {client.companyName?.charAt(0)?.toUpperCase() || <Building2 size={16} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{client.companyName}</p>
            <p className="text-xs text-text-muted">Registered GateMind client</p>
          </div>
        </div>

        <dl className="divide-y divide-border-subtle">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
              <dt className="text-text-muted">{row.label}</dt>
              <dd className="font-medium text-text-primary">{row.value}</dd>
            </div>
          ))}
        </dl>

        <button
          onClick={onClose}
          className="focus-ring w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
