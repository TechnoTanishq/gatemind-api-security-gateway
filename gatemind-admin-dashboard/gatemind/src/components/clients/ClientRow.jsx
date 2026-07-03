import { Eye, KeyRound, RefreshCw, ShieldQuestion } from 'lucide-react'
import PlanBadge from './PlanBadge'
import StatusBadge from './StatusBadge'
import DropdownMenu from '../ui/DropdownMenu'
import { formatDate } from '../../utils/formatters'

export default function ClientRow({ client, onView, onEditPlan, onRotateKey, onUpdateStatus }) {
  const menuItems = [
    { label: 'View details', icon: Eye, onClick: () => onView(client) },
    { label: 'Edit plan', icon: KeyRound, onClick: () => onEditPlan(client) },
    { label: 'Rotate API key', icon: RefreshCw, onClick: () => onRotateKey(client) },
    { divider: true },
    { label: 'Update status', icon: ShieldQuestion, onClick: () => onUpdateStatus(client) },
  ]

  return (
    <tr className="border-t border-border-subtle transition hover:bg-elevated/50">
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-default bg-elevated text-xs font-semibold text-text-secondary">
            {client.companyName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{client.companyName}</p>
            <p className="font-mono text-[11px] text-text-muted">#{client.clientId}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <PlanBadge plan={client.plan} />
      </td>
      <td className="py-3.5 pr-4">
        <StatusBadge status={client.status} />
      </td>
      <td className="py-3.5 pr-4 text-xs text-text-secondary whitespace-nowrap">
        {formatDate(client.createdAt)}
      </td>
      <td className="py-3.5 pl-2 text-right">
        <DropdownMenu items={menuItems} />
      </td>
    </tr>
  )
}
