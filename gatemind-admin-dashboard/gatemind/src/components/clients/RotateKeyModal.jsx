import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Modal from '../ui/Modal'
import { rotateApiKey } from '../../api/clientsApi'

export default function RotateKeyModal({ open, onClose, client, onRotated }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setSubmitting(true)
    setError('')
    try {
      const result = await rotateApiKey(client.clientId)
      onRotated(result)
    } catch (err) {
      setError(err?.message || 'Could not rotate this API key. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!client) return null

  return (
    <Modal open={open} onClose={onClose} title="Rotate API key">
      <div className="space-y-4">
        <div className="flex gap-3 rounded-lg border border-signal/30 bg-signal/10 px-3 py-2.5">
          <RefreshCw size={15} className="mt-0.5 shrink-0 text-signal" />
          <p className="text-xs leading-relaxed text-signal">
            Rotating the API key for <span className="font-semibold">{client.companyName}</span>{' '}
            immediately invalidates their current key. Any requests still using it will start
            failing authentication right away.
          </p>
        </div>

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="focus-ring flex-1 rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="focus-ring flex-1 rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Rotating…' : 'Rotate key'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
