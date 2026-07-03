export default function TopIpsTable({ data }) {
  const max = Math.max(...data.map((row) => row.count), 1)

  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted">
            <th className="pb-2 font-medium">IP Address</th>
            <th className="pb-2 font-medium">Requests Blocked</th>
            <th className="pb-2 font-medium hidden sm:table-cell">Origin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-border-subtle">
              <td className="py-2.5 font-mono text-xs text-text-primary">{row.ipAddress}</td>
              <td className="py-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-tabular text-xs text-text-secondary w-8">{row.count}</span>
                  <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-danger"
                      style={{ width: `${(row.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-2.5 hidden sm:table-cell text-xs text-text-muted">
                {row.country || 'Unknown'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
