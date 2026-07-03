import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { colorForThreat } from '../../utils/formatters'

export default function ThreatDistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={colorForThreat(entry.type)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'rgb(var(--c-elevated))',
            border: '1px solid rgb(var(--c-border-default))',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgb(var(--c-text-primary))',
          }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: 'rgb(var(--c-text-secondary))' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
