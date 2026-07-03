import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal'
import StatusBadge from './StatusBadge'
import { STATUSES } from '../../config/clients'
import { updateClientStatus } from '../../api/clientsApi'

const STATUS_WARNINGS = {
  SUSPENDED: 'Suspended clients are temporarily blocked at the gateway until reactivated.',
  REVOKED: 'Revoked clients are permanently blocked. Their API key will stop working immediately.',
}

export default function UpdateStatusModal({ open, onClose, client, onUpdated }) {
  const [status, setStatus] = useState(client?.status || 'ACTIVE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!client) return null

  async function handleSave() {
    setSubmitting(true)
    setError('')
    try {
      await updateClientStatus(client.clientId, status)
      onUpdated(client.clientId, { status })
    } catch (err) {
      setError(err?.message || 'Could not update the status. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update status"
      description={`Change the account status for ${client.companyName}.`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          Current status <StatusBadge status={client.status} />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`focus-ring flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${
                status === s
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-border-default bg-elevated text-text-secondary hover:border-border-default/80'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
              {status === s && <span className="text-xs">Selected</span>}
            </button>
          ))}
        </div>

        {STATUS_WARNINGS[status] && (
          <div className="flex gap-2.5 rounded-lg border border-signal/30 bg-signal/10 px-3 py-2.5">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-signal" />
            <p className="text-xs leading-relaxed text-signal">{STATUS_WARNINGS[status]}</p>
          </div>
        )}

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="focus-ring flex-1 rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting || status === client.status}
            className="focus-ring flex-1 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
