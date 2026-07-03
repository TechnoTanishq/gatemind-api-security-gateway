import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

export default function AttackTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#8B7CF6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="rgb(var(--c-border-subtle))" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'rgb(var(--c-text-muted))', fontSize: 11 }}
          axisLine={{ stroke: 'rgb(var(--c-border-subtle))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgb(var(--c-text-muted))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: 'rgb(var(--c-elevated))',
            border: '1px solid rgb(var(--c-border-default))',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgb(var(--c-text-primary))',
          }}
          labelStyle={{ color: 'rgb(var(--c-text-secondary))', marginBottom: 4 }}
          cursor={{ stroke: 'rgb(var(--c-border-default))', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="attacks"
          stroke="url(#trendStroke)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#22D3EE' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
