import { useMemo, useState } from 'react'
import { Search, ShieldX } from 'lucide-react'
import { formatTimestamp, colorForThreat } from '../../utils/formatters'
import EmptyState from '../ui/EmptyState'

export default function RecentThreatsTable({ data }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) =>
      [row.companyName, row.eventType, row.ipAddress, row.path, row.reason]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [data, query])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-elevated px-3 py-2 focus-within:border-cyan/40">
        <Search size={14} className="text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company, threat, IP, or path…"
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching threats"
          description="Try a different company, IP, or keyword."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Threat</th>
                <th className="pb-2 font-medium">IP Address</th>
                <th className="pb-2 font-medium">Path</th>
                <th className="pb-2 font-medium">Reason</th>
                <th className="pb-2 font-medium">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-border-subtle transition hover:bg-elevated/60"
                >
                  <td className="py-2.5 font-mono text-xs text-text-muted whitespace-nowrap">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className="py-2.5 text-text-primary whitespace-nowrap">{row.companyName}</td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        color: colorForThreat(row.eventType),
                        borderColor: `${colorForThreat(row.eventType)}40`,
                        backgroundColor: `${colorForThreat(row.eventType)}15`,
                      }}
                    >
                      {row.eventType}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-xs text-text-secondary">{row.ipAddress}</td>
                  <td className="py-2.5 font-mono text-xs text-text-muted max-w-[160px] truncate">
                    {row.path}
                  </td>
                  <td className="py-2.5 text-xs text-text-secondary max-w-[200px] truncate">
                    {row.reason}
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
                      <ShieldX size={13} /> Blocked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
