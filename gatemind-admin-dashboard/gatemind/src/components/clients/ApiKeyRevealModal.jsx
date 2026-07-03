import { AlertTriangle, KeyRound } from 'lucide-react'
import Modal from '../ui/Modal'
import CopyButton from '../ui/CopyButton'

export default function ApiKeyRevealModal({ open, onClose, companyName, apiKey, title }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'API key generated'}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-elevated px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
            <KeyRound size={14} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Company</p>
            <p className="text-sm font-medium text-text-primary">{companyName}</p>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-text-secondary">API Key</p>
          <div className="flex items-center gap-2 rounded-lg border border-border-default bg-base px-3 py-2.5">
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-text-primary">
              {apiKey}
            </code>
            <CopyButton value={apiKey} />
          </div>
        </div>

        <div className="flex gap-2.5 rounded-lg border border-signal/30 bg-signal/10 px-3 py-2.5">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-signal" />
          <p className="text-xs leading-relaxed text-signal">
            This API key will only be displayed once. Store it securely — GateMind cannot
            show it to you again.
          </p>
        </div>

        <button
          onClick={onClose}
          className="focus-ring w-full rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90"
        >
          Done
        </button>
      </div>
    </Modal>
  )
}
