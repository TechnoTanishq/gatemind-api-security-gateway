import ClientRow from './ClientRow'

export default function ClientTable({ clients, onView, onEditPlan, onRotateKey, onUpdateStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted">
            <th className="pb-2.5 pr-4 font-medium">Company</th>
            <th className="pb-2.5 pr-4 font-medium">Plan</th>
            <th className="pb-2.5 pr-4 font-medium">Status</th>
            <th className="pb-2.5 pr-4 font-medium">Created</th>
            <th className="pb-2.5 pl-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow
              key={client.clientId}
              client={client}
              onView={onView}
              onEditPlan={onEditPlan}
              onRotateKey={onRotateKey}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
