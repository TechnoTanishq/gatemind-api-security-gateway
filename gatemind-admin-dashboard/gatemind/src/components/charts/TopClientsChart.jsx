import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function TopClientsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 8, bottom: 0 }}
        barCategoryGap={14}
      >
        <CartesianGrid strokeDasharray="3 6" stroke="rgb(var(--c-border-subtle))" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: 'rgb(var(--c-text-muted))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="companyName"
          tick={{ fill: 'rgb(var(--c-text-secondary))', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          contentStyle={{
            background: 'rgb(var(--c-elevated))',
            border: '1px solid rgb(var(--c-border-default))',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgb(var(--c-text-primary))',
          }}
          cursor={{ fill: 'rgb(var(--c-border-subtle))' }}
        />
        <Bar dataKey="count" fill="#8B7CF6" radius={[0, 6, 6, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}
