import { useState } from 'react'
import Modal from '../ui/Modal'
import PlanBadge from './PlanBadge'
import { PLANS } from '../../config/clients'
import { updateClientPlan } from '../../api/clientsApi'

export default function UpdatePlanModal({ open, onClose, client, onUpdated }) {
  const [plan, setPlan] = useState(client?.plan || 'FREE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!client) return null

  async function handleSave() {
    setSubmitting(true)
    setError('')
    try {
      await updateClientPlan(client.clientId, plan)
      onUpdated(client.clientId, { plan })
    } catch (err) {
      setError(err?.message || 'Could not update the plan. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit plan"
      description={`Change the subscription plan for ${client.companyName}.`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          Current plan <PlanBadge plan={client.plan} />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {PLANS.map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`focus-ring flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${
                plan === p
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-border-default bg-elevated text-text-secondary hover:border-border-default/80'
              }`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
              {plan === p && <span className="text-xs">Selected</span>}
            </button>
          ))}
        </div>

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
            disabled={submitting || plan === client.plan}
            className="focus-ring flex-1 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
