import { STATUS_DOT, STATUS_STYLES } from '../../config/clients'

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[status] || STATUS_STYLES.ACTIVE}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.ACTIVE}`} />
      {status}
    </span>
  )
}
