import { PLAN_STYLES } from '../../config/clients'

export default function PlanBadge({ plan }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${PLAN_STYLES[plan] || PLAN_STYLES.FREE}`}
    >
      {plan}
    </span>
  )
}
