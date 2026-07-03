import { ShieldBan, Flame, Layers, Building2 } from 'lucide-react'
import StatCard from '../components/cards/StatCard'
import Panel from '../components/cards/Panel'
import DataState from '../components/ui/DataState'
import AttackTrendChart from '../components/charts/AttackTrendChart'
import ThreatDistributionChart from '../components/charts/ThreatDistributionChart'
import TopClientsChart from '../components/charts/TopClientsChart'
import TopIpsTable from '../components/tables/TopIpsTable'
import RecentThreatsTable from '../components/tables/RecentThreatsTable'
import { useFetch } from '../utils/useFetch'
import { formatExactNumber } from '../utils/formatters'
import {
  getStats,
  getAttackTrend,
  getTopThreats,
  getTopClients,
  getTopIps,
  getRecentThreats,
} from '../api/analyticsApi'
import { getClients } from '../api/clientsApi'

export default function DashboardPage() {
  const stats = useFetch(getStats, [])
  const trend = useFetch(getAttackTrend, [])
  const threats = useFetch(getTopThreats, [])
  const clients = useFetch(getTopClients, [])
  const ips = useFetch(getTopIps, [])
  const recent = useFetch(getRecentThreats, [])
  const clientCount = useFetch(getClients, [])

  const s = stats.data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-text-primary">Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Live status of every request GateMind has inspected across all registered clients.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DataState {...pickStates(stats)} loadingRows={2}>
          <StatCard
            label="Total Blocked Requests"
            value={formatExactNumber(s.totalBlocked)}
            icon={ShieldBan}
            accent="danger"
          />
        </DataState>
        <DataState {...pickStates(stats)} loadingRows={2}>
          <StatCard
            label="Today's Attacks"
            value={formatExactNumber(s.todayBlocked)}
            icon={Flame}
            accent="signal"
          />
        </DataState>
        <DataState {...pickStates(stats)} loadingRows={2}>
          <StatCard
            label="Threat Types Detected"
            value={formatExactNumber(
              [s.sqlInjection, s.xss, s.pathTraversal, s.commandInjection].filter(Boolean).length
            )}
            icon={Layers}
            accent="violet"
          />
        </DataState>
        <DataState {...pickStates(clientCount)} loadingRows={2}>
          <StatCard
            label="Registered Clients"
            value={formatExactNumber(clientCount.data?.length || 0)}
            icon={Building2}
            accent="cyan"
          />
        </DataState>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Attack Trend" subtitle="Requests flagged per hour, last 24h" className="xl:col-span-2">
          <DataState
            {...pickStates(trend)}
            emptyTitle="No attack activity"
            emptyDescription="No threats have been logged for this time window yet."
          >
            <AttackTrendChart data={trend.data || []} />
          </DataState>
        </Panel>

        <Panel title="Threat Distribution" subtitle="Share of blocked requests by type">
          <DataState
            {...pickStates(threats)}
            emptyTitle="No threats classified"
            emptyDescription="Threat types will appear once requests are inspected."
          >
            <ThreatDistributionChart data={threats.data || []} />
          </DataState>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Top Clients" subtitle="By total request volume" className="xl:col-span-2">
          <DataState
            {...pickStates(clients)}
            emptyTitle="No client traffic yet"
            emptyDescription="Client request volume will populate as traffic flows through the gateway."
          >
            <TopClientsChart data={clients.data || []} />
          </DataState>
        </Panel>

        <Panel title="Top Attacking IPs" subtitle="Ranked by blocked requests">
          <DataState
            {...pickStates(ips)}
            emptyTitle="No repeat offenders"
            emptyDescription="IPs with blocked requests will be ranked here."
          >
            <TopIpsTable data={ips.data || []} />
          </DataState>
        </Panel>
      </div>

      {/* Recent threats table */}
      <Panel title="Recent Threats" subtitle="Live feed of the latest flagged requests">
        <DataState
          {...pickStates(recent)}
          loadingRows={6}
          emptyTitle="No recent threats"
          emptyDescription="Flagged requests will show up here in real time."
        >
          <RecentThreatsTable data={recent.data || []} />
        </DataState>
      </Panel>
    </div>
  )
}

function pickStates(hook) {
  return {
    isLoading: hook.isLoading,
    isError: hook.isError,
    isEmpty: hook.isEmpty,
    error: hook.error,
    onRetry: hook.refetch,
  }
}
