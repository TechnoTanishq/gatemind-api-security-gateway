import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useFetch } from '../utils/useFetch'
import { getClients } from '../api/clientsApi'

import SearchBar from '../components/clients/SearchBar'
import FilterBar from '../components/clients/FilterBar'
import ClientTable from '../components/clients/ClientTable'
import ClientsSkeleton from '../components/clients/ClientsSkeleton'
import ClientsEmptyState from '../components/clients/ClientsEmptyState'
import ClientsErrorState from '../components/clients/ClientsErrorState'

import RegisterClientModal from '../components/clients/RegisterClientModal'
import ApiKeyRevealModal from '../components/clients/ApiKeyRevealModal'
import RotateKeyModal from '../components/clients/RotateKeyModal'
import UpdatePlanModal from '../components/clients/UpdatePlanModal'
import UpdateStatusModal from '../components/clients/UpdateStatusModal'
import ViewClientModal from '../components/clients/ViewClientModal'

export default function ClientsPage() {
  const { data, isLoading, isError, error, refetch } = useFetch(getClients, [])

  // Local, mutable copy of the list so plan/status/rotate/register updates
  // reflect instantly without waiting on a full refetch.
  const [clients, setClients] = useState(null)
  const activeClients = clients ?? data ?? []

  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [registerOpen, setRegisterOpen] = useState(false)
  const [apiKeyModal, setApiKeyModal] = useState({ open: false, companyName: '', apiKey: '', title: '' })
  const [rotateTarget, setRotateTarget] = useState(null)
  const [planTarget, setPlanTarget] = useState(null)
  const [statusTarget, setStatusTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)

  const filtered = useMemo(() => {
    return activeClients.filter((c) => {
      const matchesSearch = c.companyName?.toLowerCase().includes(search.trim().toLowerCase())
      const matchesPlan = planFilter === 'ALL' || c.plan === planFilter
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
      return matchesSearch && matchesPlan && matchesStatus
    })
  }, [activeClients, search, planFilter, statusFilter])

  function syncClients(updater) {
    setClients((prev) => updater(prev ?? data ?? []))
  }

  function handleRegistered(result) {
    setRegisterOpen(false)
    syncClients((list) => [
      {
        clientId: result.clientId,
        companyName: result.companyName,
        plan: result.plan || 'FREE',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      ...list,
    ])
    setApiKeyModal({
      open: true,
      companyName: result.companyName,
      apiKey: result.apiKey,
      title: 'Client registered',
    })
  }

  function handleRotated(result) {
    setApiKeyModal({
      open: true,
      companyName: rotateTarget?.companyName,
      apiKey: result.apiKey,
      title: 'API key rotated',
    })
    setRotateTarget(null)
  }

  function handlePlanUpdated(clientId, patch) {
    syncClients((list) => list.map((c) => (c.clientId === clientId ? { ...c, ...patch } : c)))
    setPlanTarget(null)
  }

  function handleStatusUpdated(clientId, patch) {
    syncClients((list) => list.map((c) => (c.clientId === clientId ? { ...c, ...patch } : c)))
    setStatusTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-text-primary">Clients</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all registered GateMind customers.
          </p>
        </div>
        <button
          onClick={() => setRegisterOpen(true)}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 self-start sm:self-auto"
        >
          <Plus size={16} />
          Register Client
        </button>
      </div>

      {!isLoading && !isError && activeClients.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            plan={planFilter}
            onPlanChange={setPlanFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      )}

      <div className="rounded-xl border border-border-subtle bg-surface p-5 shadow-card">
        {isLoading ? (
          <ClientsSkeleton />
        ) : isError ? (
          <ClientsErrorState onRetry={refetch} />
        ) : activeClients.length === 0 ? (
          <ClientsEmptyState onRegister={() => setRegisterOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm font-medium text-text-secondary">No clients match your filters.</p>
            <p className="mt-1 text-xs text-text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <ClientTable
            clients={filtered}
            onView={setViewTarget}
            onEditPlan={setPlanTarget}
            onRotateKey={setRotateTarget}
            onUpdateStatus={setStatusTarget}
          />
        )}
      </div>

      <RegisterClientModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <ApiKeyRevealModal
        open={apiKeyModal.open}
        onClose={() => setApiKeyModal({ open: false, companyName: '', apiKey: '', title: '' })}
        companyName={apiKeyModal.companyName}
        apiKey={apiKeyModal.apiKey}
        title={apiKeyModal.title}
      />

      <RotateKeyModal
        open={!!rotateTarget}
        onClose={() => setRotateTarget(null)}
        client={rotateTarget}
        onRotated={handleRotated}
      />

      <UpdatePlanModal
        open={!!planTarget}
        onClose={() => setPlanTarget(null)}
        client={planTarget}
        onUpdated={handlePlanUpdated}
      />

      <UpdateStatusModal
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        client={statusTarget}
        onUpdated={handleStatusUpdated}
      />

      <ViewClientModal open={!!viewTarget} onClose={() => setViewTarget(null)} client={viewTarget} />
    </div>
  )
}
