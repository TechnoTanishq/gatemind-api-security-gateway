// import { useState } from 'react'
// import { Copy, Check, RefreshCw, ShieldHalf, LogOut, ExternalLink, ShieldX, ShieldAlert, TrendingUp } from 'lucide-react'
// import { useClientAuth } from '../context/ClientAuthContext'
// import { useFetch } from '../utils/useFetch'
// import { getMyProfile, rotateMyKey } from '../api/clientsApi'
// import { getClientStats } from '../api/analyticsApi'
// import StatusBadge from '../components/clients/StatusBadge'
// import PlanBadge from '../components/clients/PlanBadge'
// import { formatTimestamp, colorForThreat } from '../utils/formatters'

// const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// export default function ClientPortalPage() {
//   const { token, session, logout, storedApiKey, updateStoredApiKey } = useClientAuth()
//   const profile = useFetch(() => getMyProfile(token), [token])
//   const stats = useFetch(
//     () => session?.clientId ? getClientStats(session.clientId) : Promise.resolve(null),
//     [session?.clientId]
//   )

//   const [masked, setMasked] = useState(true)
//   const [rotating, setRotating] = useState(false)
//   const [rotateError, setRotateError] = useState('')
//   const [copied, setCopied] = useState(false)

//   // The key we show — either the freshly rotated one or the one stored at signup
//   const apiKey = storedApiKey

//   const p = profile.data

//   function copy() {
//     if (!apiKey) return
//     navigator.clipboard.writeText(apiKey)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   async function handleRotate() {
//     if (!confirm('This will immediately invalidate your current API key. Continue?')) return
//     setRotating(true)
//     setRotateError('')
//     try {
//       const result = await rotateMyKey(token)
//       updateStoredApiKey(result.apiKey)
//       setMasked(false)
//     } catch (err) {
//       setRotateError(err?.message || 'Failed to rotate key.')
//     } finally {
//       setRotating(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-void">
//       {/* Top nav */}
//       <header className="border-b border-border-subtle bg-base/80 backdrop-blur sticky top-0 z-10">
//         <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
//               <ShieldHalf size={14} />
//             </div>
//             <span className="font-display text-sm font-semibold text-text-primary">GateMind</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-xs text-text-muted hidden sm:block">{session?.email}</span>
//             <button onClick={logout}
//               className="focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition">
//               <LogOut size={13} /> Sign out
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
//         {/* Welcome */}
//         <div>
//           <h1 className="font-display text-xl font-semibold text-text-primary">
//             Welcome, {session?.companyName}
//           </h1>
//           <p className="mt-1 text-sm text-text-secondary">
//             Your API security portal — manage your key and monitor your integration.
//           </p>
//         </div>

//         {profile.isLoading && (
//           <div className="space-y-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="h-24 animate-pulse rounded-xl bg-surface" />
//             ))}
//           </div>
//         )}

//         {profile.isError && (
//           <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
//             Failed to load profile.{' '}
//             <button onClick={profile.refetch} className="underline">Retry</button>
//           </div>
//         )}

//         {p && (
//           <div className="space-y-4">
//             {/* Status row */}
//             <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface px-5 py-4">
//               <div className="flex-1">
//                 <p className="text-xs text-text-muted">Account status</p>
//                 <div className="mt-1"><StatusBadge status={p.status} /></div>
//               </div>
//               <div className="flex-1">
//                 <p className="text-xs text-text-muted">Plan</p>
//                 <div className="mt-1"><PlanBadge plan={p.plan} /></div>
//               </div>
//               <div className="flex-1">
//                 <p className="text-xs text-text-muted">Member since</p>
//                 <p className="mt-1 text-sm text-text-primary">
//                   {new Date(p.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             {/* API Key card */}
//             <div className="rounded-xl border border-border-subtle bg-surface px-5 py-5 space-y-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-sm font-semibold text-text-primary">API Key</h2>
//                   <p className="text-xs text-text-muted mt-0.5">
//                     Include this in every request as{' '}
//                     <code className="text-cyan">X-API-Key</code>
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleRotate}
//                   disabled={rotating}
//                   className="focus-ring flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary disabled:opacity-50 transition"
//                 >
//                   <RefreshCw size={12} className={rotating ? 'animate-spin' : ''} />
//                   Rotate key
//                 </button>
//               </div>

//               {apiKey ? (
//                 <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5">
//                   <code className="flex-1 font-mono text-xs text-cyan truncate">
//                     {masked
//                       ? `${apiKey.slice(0, 12)}${'•'.repeat(20)}`
//                       : apiKey
//                     }
//                   </code>
//                   <button
//                     onClick={() => setMasked(s => !s)}
//                     className="text-[11px] text-text-muted hover:text-text-secondary transition shrink-0"
//                   >
//                     {masked ? 'Reveal' : 'Hide'}
//                   </button>
//                   <button
//                     onClick={copy}
//                     className="shrink-0 text-text-muted hover:text-text-primary transition"
//                   >
//                     {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
//                   </button>
//                 </div>
//               ) : (
//                 <div className="rounded-lg border border-signal/30 bg-signal/10 px-3 py-2.5">
//                   <p className="text-xs text-signal">
//                     API key not available — it was only shown once at registration.
//                     Use <strong>Rotate key</strong> to generate a new one.
//                   </p>
//                 </div>
//               )}

//               {rotateError && (
//                 <p className="text-xs text-danger">{rotateError}</p>
//               )}
//             </div>

//             {/* Gateway integration card */}
//             <div className="rounded-xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
//               <h2 className="text-sm font-semibold text-text-primary">Your Integration</h2>

//               <div className="grid gap-3 sm:grid-cols-2">
//                 <InfoRow label="Your Backend URL" value={p.backendBaseUrl} mono />
//                 <InfoRow label="GateMind Gateway URL" value={GATEWAY_URL} mono accent />
//               </div>

//               <div className="space-y-2">
//                 <p className="text-xs font-medium text-text-secondary">
//                   Replace your base URL with the GateMind gateway and add the header:
//                 </p>
//                 <pre className="overflow-x-auto rounded-lg border border-border-default bg-elevated p-3 text-[11px] text-text-secondary leading-relaxed">
// {`# Before
// curl ${p.backendBaseUrl}/your-endpoint

// # After — route through GateMind
// curl ${GATEWAY_URL}/your-endpoint \\
//   -H "X-API-Key: <your-api-key>"`}
//                 </pre>
//               </div>

//               <a
//                 href="https://github.com/TechnoTanishq/gatemind-api-security-gateway"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center gap-1.5 text-xs text-cyan hover:underline"
//               >
//                 View documentation <ExternalLink size={12} />
//               </a>
//             </div>

//             {/* Per-client security stats */}
//             {stats.data && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="rounded-xl border border-border-subtle bg-surface px-5 py-4">
//                     <div className="flex items-center gap-2 mb-1">
//                       <ShieldX size={14} className="text-danger" />
//                       <p className="text-xs text-text-muted">Total Blocked</p>
//                     </div>
//                     <p className="text-2xl font-semibold font-display text-text-primary">
//                       {stats.data.totalBlocked}
//                     </p>
//                   </div>
//                   <div className="rounded-xl border border-border-subtle bg-surface px-5 py-4">
//                     <div className="flex items-center gap-2 mb-1">
//                       <ShieldAlert size={14} className="text-signal" />
//                       <p className="text-xs text-text-muted">Blocked Today</p>
//                     </div>
//                     <p className="text-2xl font-semibold font-display text-text-primary">
//                       {stats.data.blockedToday}
//                     </p>
//                   </div>
//                 </div>

//                 {stats.data.topThreats?.length > 0 && (
//                   <div className="rounded-xl border border-border-subtle bg-surface px-5 py-5 space-y-3">
//                     <h2 className="text-sm font-semibold text-text-primary">Threats Against Your API</h2>
//                     <div className="space-y-2">
//                       {stats.data.topThreats.map((t) => (
//                         <div key={t.threatType} className="flex items-center justify-between">
//                           <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
//                             style={{ color: colorForThreat(t.threatType), borderColor: `${colorForThreat(t.threatType)}40`, backgroundColor: `${colorForThreat(t.threatType)}15` }}>
//                             {t.threatType}
//                           </span>
//                           <span className="text-xs font-semibold text-text-primary">{t.count}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {stats.data.recentThreats?.length > 0 && (
//                   <div className="rounded-xl border border-border-subtle bg-surface px-5 py-5 space-y-3">
//                     <div className="flex items-center gap-2">
//                       <TrendingUp size={14} className="text-text-muted" />
//                       <h2 className="text-sm font-semibold text-text-primary">Recent Threats</h2>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="w-full min-w-[480px] text-xs">
//                         <thead>
//                           <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted border-b border-border-subtle">
//                             <th className="pb-2 pr-4 font-medium">Time</th>
//                             <th className="pb-2 pr-4 font-medium">Type</th>
//                             <th className="pb-2 pr-4 font-medium">Path</th>
//                             <th className="pb-2 font-medium">IP</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {stats.data.recentThreats.map((t, i) => (
//                             <tr key={i} className="border-t border-border-subtle">
//                               <td className="py-2.5 pr-4 font-mono text-text-muted whitespace-nowrap">{formatTimestamp(t.timestamp)}</td>
//                               <td className="py-2.5 pr-4">
//                                 <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
//                                   style={{ color: colorForThreat(t.eventType), borderColor: `${colorForThreat(t.eventType)}40`, backgroundColor: `${colorForThreat(t.eventType)}15` }}>
//                                   {t.eventType}
//                                 </span>
//                               </td>
//                               <td className="py-2.5 pr-4 font-mono text-text-muted max-w-[160px] truncate">{t.path}</td>
//                               <td className="py-2.5 font-mono text-text-secondary">{t.ipAddress}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 {stats.data.totalBlocked === 0 && (
//                   <div className="rounded-xl border border-border-subtle bg-surface px-5 py-8 text-center">
//                     <ShieldX size={24} className="mx-auto mb-2 text-text-muted" />
//                     <p className="text-sm font-medium text-text-secondary">No threats detected yet</p>
//                     <p className="text-xs text-text-muted mt-1">Start routing traffic through GateMind to see security events here.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// function InfoRow({ label, value, mono, accent }) {
//   return (
//     <div className="rounded-lg border border-border-default bg-elevated px-3 py-2.5">
//       <p className="text-[11px] text-text-muted mb-1">{label}</p>
//       <p className={`text-xs truncate ${mono ? 'font-mono' : ''} ${accent ? 'text-cyan' : 'text-text-primary'}`}>
//         {value}
//       </p>
//     </div>
//   )
// }


///--------------------------------------------------------------------------------------------------------















// import { useState } from 'react'
// import {
//   Copy, Check, RefreshCw, ShieldHalf, LogOut, ExternalLink,
//   ShieldX, ShieldAlert, TrendingUp, Activity, Clock, ArrowUpRight
// } from 'lucide-react'
// import { useClientAuth } from '../context/ClientAuthContext'
// import { useFetch } from '../utils/useFetch'
// import { getMyProfile, rotateMyKey } from '../api/clientsApi'
// import { getClientStats } from '../api/analyticsApi'
// import StatusBadge from '../components/clients/StatusBadge'
// import PlanBadge from '../components/clients/PlanBadge'
// import { formatTimestamp, colorForThreat } from '../utils/formatters'

// const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// export default function ClientPortalPage() {
//   const { token, session, logout, storedApiKey, updateStoredApiKey } = useClientAuth()
//   const profile = useFetch(() => getMyProfile(token), [token])
//   const stats = useFetch(
//     () => session?.clientId ? getClientStats(session.clientId) : Promise.resolve(null),
//     [session?.clientId]
//   )

//   const [masked, setMasked] = useState(true)
//   const [rotating, setRotating] = useState(false)
//   const [rotateError, setRotateError] = useState('')
//   const [copied, setCopied] = useState(false)

//   const apiKey = storedApiKey
//   const p = profile.data
//   const s = stats.data

//   const maxThreatCount = s?.topThreats?.length
//     ? Math.max(...s.topThreats.map(t => t.count))
//     : 0

//   function copy() {
//     if (!apiKey) return
//     navigator.clipboard.writeText(apiKey)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   async function handleRotate() {
//     if (!confirm('This will immediately invalidate your current API key. Continue?')) return
//     setRotating(true)
//     setRotateError('')
//     try {
//       const result = await rotateMyKey(token)
//       updateStoredApiKey(result.apiKey)
//       setMasked(false)
//     } catch (err) {
//       setRotateError(err?.message || 'Failed to rotate key.')
//     } finally {
//       setRotating(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-void">
//       {/* Top nav */}
//       <header className="border-b border-border-subtle bg-base/80 backdrop-blur sticky top-0 z-10">
//         <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
//           <div className="flex items-center gap-2">
//             <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
//               <ShieldHalf size={14} />
//             </div>
//             <span className="font-display text-sm font-semibold text-text-primary">GateMind</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-xs text-text-muted hidden sm:block">{session?.email}</span>
//             <button onClick={logout}
//               className="focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition">
//               <LogOut size={13} /> Sign out
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 py-8">

//         {profile.isLoading && (
//           <div className="space-y-4">
//             <div className="h-28 animate-pulse rounded-2xl bg-surface" />
//             <div className="grid gap-4 lg:grid-cols-3">
//               <div className="h-64 animate-pulse rounded-2xl bg-surface lg:col-span-2" />
//               <div className="h-64 animate-pulse rounded-2xl bg-surface" />
//             </div>
//           </div>
//         )}

//         {profile.isError && (
//           <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
//             Failed to load profile.{' '}
//             <button onClick={profile.refetch} className="underline">Retry</button>
//           </div>
//         )}

//         {p && (
//           <div className="space-y-6">

//             {/* Hero / welcome banner */}
//             <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface px-6 py-6 sm:px-8 sm:py-7">
//               <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
//               <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-xs font-medium uppercase tracking-wide text-cyan">Client Portal</p>
//                   <h1 className="mt-1 font-display text-2xl font-semibold text-text-primary">
//                     Welcome back, {session?.companyName}
//                   </h1>
//                   <p className="mt-1.5 text-sm text-text-secondary">
//                     Manage your API key and monitor your integration's security in real time.
//                   </p>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-2.5">
//                   <StatusBadge status={p.status} />
//                   <PlanBadge plan={p.plan} />
//                   <span className="flex items-center gap-1.5 rounded-full border border-border-default bg-elevated px-3 py-1 text-xs text-text-muted">
//                     <Clock size={12} />
//                     Since {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick stat strip */}
//             {s && (
//               <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//                 <StatCard
//                   icon={<ShieldX size={16} className="text-danger" />}
//                   label="Total Blocked"
//                   value={s.totalBlocked}
//                   tint="danger"
//                 />
//                 <StatCard
//                   icon={<ShieldAlert size={16} className="text-signal" />}
//                   label="Blocked Today"
//                   value={s.blockedToday}
//                   tint="signal"
//                 />
//                 <StatCard
//                   icon={<Activity size={16} className="text-cyan" />}
//                   label="Threat Types"
//                   value={s.topThreats?.length ?? 0}
//                   tint="cyan"
//                 />
//                 <StatCard
//                   icon={<TrendingUp size={16} className="text-green-400" />}
//                   label="Recent Events"
//                   value={s.recentThreats?.length ?? 0}
//                   tint="green"
//                 />
//               </div>
//             )}

//             {/* Main grid: key + integration (left) / threat breakdown (right) */}
//             <div className="grid gap-6 lg:grid-cols-3">

//               {/* Left column */}
//               <div className="space-y-6 lg:col-span-2">

//                 {/* API Key card */}
//                 <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 sm:px-6 sm:py-6 space-y-3.5">
//                   <div className="flex items-center justify-between gap-3">
//                     <div>
//                       <h2 className="text-sm font-semibold text-text-primary">API Key</h2>
//                       <p className="text-xs text-text-muted mt-0.5">
//                         Include this in every request as{' '}
//                         <code className="text-cyan">X-API-Key</code>
//                       </p>
//                     </div>
//                     <button
//                       onClick={handleRotate}
//                       disabled={rotating}
//                       className="focus-ring flex shrink-0 items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary disabled:opacity-50 transition"
//                     >
//                       <RefreshCw size={12} className={rotating ? 'animate-spin' : ''} />
//                       Rotate key
//                     </button>
//                   </div>

//                   {apiKey ? (
//                     <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5">
//                       <code className="flex-1 font-mono text-xs text-cyan truncate">
//                         {masked
//                           ? `${apiKey.slice(0, 12)}${'•'.repeat(20)}`
//                           : apiKey
//                         }
//                       </code>
//                       <button
//                         onClick={() => setMasked(s => !s)}
//                         className="text-[11px] text-text-muted hover:text-text-secondary transition shrink-0"
//                       >
//                         {masked ? 'Reveal' : 'Hide'}
//                       </button>
//                       <button
//                         onClick={copy}
//                         className="shrink-0 text-text-muted hover:text-text-primary transition"
//                       >
//                         {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="rounded-lg border border-signal/30 bg-signal/10 px-3 py-2.5">
//                       <p className="text-xs text-signal">
//                         API key not available — it was only shown once at registration.
//                         Use <strong>Rotate key</strong> to generate a new one.
//                       </p>
//                     </div>
//                   )}

//                   {rotateError && (
//                     <p className="text-xs text-danger">{rotateError}</p>
//                   )}
//                 </div>

//                 {/* Gateway integration card */}
//                 <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 sm:px-6 sm:py-6 space-y-4">
//                   <h2 className="text-sm font-semibold text-text-primary">Your Integration</h2>

//                   <div className="grid gap-3 sm:grid-cols-2">
//                     <InfoRow label="Your Backend URL" value={p.backendBaseUrl} mono />
//                     <InfoRow label="GateMind Gateway URL" value={GATEWAY_URL} mono accent />
//                   </div>

//                   <div className="space-y-2">
//                     <p className="text-xs font-medium text-text-secondary">
//                       Replace your base URL with the GateMind gateway and add the header:
//                     </p>
//                     <pre className="overflow-x-auto rounded-lg border border-border-default bg-elevated p-3 text-[11px] text-text-secondary leading-relaxed">
// {`# Before
// curl ${p.backendBaseUrl}/your-endpoint

// # After — route through GateMind
// curl ${GATEWAY_URL}/your-endpoint \\
//   -H "X-API-Key: <your-api-key>"`}
//                     </pre>
//                   </div>

//                   <a
//                     href="https://github.com/TechnoTanishq/gatemind-api-security-gateway"
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-1.5 text-xs text-cyan hover:underline"
//                   >
//                     View documentation <ExternalLink size={12} />
//                   </a>
//                 </div>

//                 {/* Recent threats table */}
//                 {s?.recentThreats?.length > 0 && (
//                   <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 sm:px-6 sm:py-6 space-y-3.5">
//                     <div className="flex items-center gap-2">
//                       <TrendingUp size={14} className="text-text-muted" />
//                       <h2 className="text-sm font-semibold text-text-primary">Recent Threats</h2>
//                     </div>
//                     <div className="overflow-x-auto -mx-1">
//                       <table className="w-full min-w-[480px] text-xs">
//                         <thead>
//                           <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted border-b border-border-subtle">
//                             <th className="pb-2.5 pr-4 px-1 font-medium">Time</th>
//                             <th className="pb-2.5 pr-4 font-medium">Type</th>
//                             <th className="pb-2.5 pr-4 font-medium">Path</th>
//                             <th className="pb-2.5 font-medium">IP</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {s.recentThreats.map((t, i) => (
//                             <tr key={i} className="border-t border-border-subtle hover:bg-elevated/60 transition-colors">
//                               <td className="py-2.5 pr-4 px-1 font-mono text-text-muted whitespace-nowrap">{formatTimestamp(t.timestamp)}</td>
//                               <td className="py-2.5 pr-4">
//                                 <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
//                                   style={{ color: colorForThreat(t.eventType), borderColor: `${colorForThreat(t.eventType)}40`, backgroundColor: `${colorForThreat(t.eventType)}15` }}>
//                                   {t.eventType}
//                                 </span>
//                               </td>
//                               <td className="py-2.5 pr-4 font-mono text-text-muted max-w-[160px] truncate">{t.path}</td>
//                               <td className="py-2.5 font-mono text-text-secondary">{t.ipAddress}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//               </div>

//               {/* Right column — analytics sidebar */}
//               <div className="space-y-6">

//                 {/* Threat breakdown */}
//                 {s?.topThreats?.length > 0 ? (
//                   <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 sm:px-6 sm:py-6 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-sm font-semibold text-text-primary">Threats Against Your API</h2>
//                       <ArrowUpRight size={14} className="text-text-muted" />
//                     </div>
//                     <div className="space-y-3.5">
//                       {s.topThreats.map((t) => {
//                         const color = colorForThreat(t.threatType)
//                         const pct = maxThreatCount ? Math.max((t.count / maxThreatCount) * 100, 6) : 0
//                         return (
//                           <div key={t.threatType} className="space-y-1.5">
//                             <div className="flex items-center justify-between text-xs">
//                               <span className="font-medium" style={{ color }}>{t.threatType}</span>
//                               <span className="font-semibold text-text-primary">{t.count}</span>
//                             </div>
//                             <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
//                               <div
//                                 className="h-full rounded-full transition-all"
//                                 style={{ width: `${pct}%`, backgroundColor: color }}
//                               />
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 ) : s && (
//                   <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-8 text-center">
//                     <ShieldX size={22} className="mx-auto mb-2 text-text-muted" />
//                     <p className="text-sm font-medium text-text-secondary">No threats detected yet</p>
//                     <p className="text-xs text-text-muted mt-1">Route traffic through GateMind to see security events here.</p>
//                   </div>
//                 )}

//                 {/* Security tip card */}
//                 <div className="rounded-2xl border border-cyan/20 bg-cyan/5 px-5 py-5 sm:px-6 sm:py-6 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <ShieldHalf size={14} className="text-cyan" />
//                     <h2 className="text-sm font-semibold text-text-primary">Keep your key safe</h2>
//                   </div>
//                   <p className="text-xs text-text-secondary leading-relaxed">
//                     Rotate your API key immediately if you suspect it's been exposed. Old keys stop
//                     working the moment a new one is generated.
//                   </p>
//                 </div>

//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// function StatCard({ icon, label, value, tint }) {
//   return (
//     <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-4 sm:px-5 sm:py-4.5">
//       <div className="flex items-center gap-2 mb-2">
//         {icon}
//         <p className="text-xs text-text-muted">{label}</p>
//       </div>
//       <p className="text-2xl font-semibold font-display text-text-primary">{value}</p>
//     </div>
//   )
// }

// function InfoRow({ label, value, mono, accent }) {
//   return (
//     <div className="rounded-lg border border-border-default bg-elevated px-3 py-2.5">
//       <p className="text-[11px] text-text-muted mb-1">{label}</p>
//       <p className={`text-xs truncate ${mono ? 'font-mono' : ''} ${accent ? 'text-cyan' : 'text-text-primary'}`}>
//         {value}
//       </p>
//     </div>
//   )
// }


import { useState, useMemo } from 'react'
import {
  Copy, Check, RefreshCw, ShieldHalf, LogOut, ExternalLink,
  ShieldX, ShieldAlert, LayoutDashboard, BookOpen, Settings,
  Download, ChevronLeft, ChevronRight, ChevronDown, KeyRound
} from 'lucide-react'
import { useClientAuth } from '../context/ClientAuthContext'
import { useFetch } from '../utils/useFetch'
import { getMyProfile, rotateMyKey } from '../api/clientsApi'
import { getClientStats } from '../api/analyticsApi'
import StatusBadge from '../components/clients/StatusBadge'
import PlanBadge from '../components/clients/PlanBadge'
import { formatTimestamp, colorForThreat } from '../utils/formatters'

const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const PAGE_SIZE = 6
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Builds a 7-day blocked-request histogram from the recent threats list —
// no extra endpoint required.
function useWeeklySeries(recentThreats) {
  return useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      days.push({ date: d, label: DAY_LABELS[d.getDay()], count: 0 })
    }
    ;(recentThreats || []).forEach(t => {
      const ts = new Date(t.timestamp)
      ts.setHours(0, 0, 0, 0)
      const bucket = days.find(d => d.date.getTime() === ts.getTime())
      if (bucket) bucket.count += 1
    })
    return days
  }, [recentThreats])
}

function downloadThreatsCsv(threats) {
  if (!threats?.length) return
  const header = ['Time', 'Type', 'Path', 'IP']
  const rows = threats.map(t => [formatTimestamp(t.timestamp), t.eventType, t.path, t.ipAddress])
  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gatemind-threats.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ClientPortalPage() {
  const { token, session, logout, storedApiKey, updateStoredApiKey } = useClientAuth()
  const profile = useFetch(() => getMyProfile(token), [token])
  const stats = useFetch(
    () => session?.clientId ? getClientStats(session.clientId) : Promise.resolve(null),
    [session?.clientId]
  )

  const [masked, setMasked] = useState(true)
  const [rotating, setRotating] = useState(false)
  const [rotateError, setRotateError] = useState('')
  const [copied, setCopied] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const apiKey = storedApiKey
  const p = profile.data
  const s = stats.data

  const weeklySeries = useWeeklySeries(s?.recentThreats)
  const maxDayCount = Math.max(1, ...weeklySeries.map(d => d.count))

  const threatTypes = useMemo(
    () => Array.from(new Set((s?.recentThreats || []).map(t => t.eventType))),
    [s]
  )

  const filteredThreats = useMemo(() => {
    let list = s?.recentThreats || []
    if (typeFilter !== 'all') list = list.filter(t => t.eventType === typeFilter)
    list = [...list].sort((a, b) => {
      const diff = new Date(a.timestamp) - new Date(b.timestamp)
      return sortDir === 'asc' ? diff : -diff
    })
    return list
  }, [s, typeFilter, sortDir])

  const totalPages = Math.max(1, Math.ceil(filteredThreats.length / PAGE_SIZE))
  const pagedThreats = filteredThreats.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function copy() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRotate() {
    if (!confirm('This will immediately invalidate your current API key. Continue?')) return
    setRotating(true)
    setRotateError('')
    try {
      const result = await rotateMyKey(token)
      updateStoredApiKey(result.apiKey)
      setMasked(false)
    } catch (err) {
      setRotateError(err?.message || 'Failed to rotate key.')
    } finally {
      setRotating(false)
    }
  }

  function setType(v) { setTypeFilter(v); setPage(1) }
  function toggleSort() { setSortDir(d => d === 'desc' ? 'asc' : 'desc'); setPage(1) }

  const initials = (session?.companyName || '?').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-void">

      {/* Icon sidebar */}
      <aside className="hidden lg:flex w-16 shrink-0 flex-col items-center border-r border-border-subtle bg-base py-5 gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
          <ShieldHalf size={16} />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-2">
          <SideIcon icon={<LayoutDashboard size={17} />} label="Dashboard" active />
          <SideIcon icon={<KeyRound size={17} />} label="API Key" />
          <SideIcon icon={<BookOpen size={17} />} label="Docs" href="https://github.com/TechnoTanishq/gatemind-api-security-gateway" />
          <SideIcon icon={<Settings size={17} />} label="Settings" />
        </nav>
        <button onClick={logout} title="Sign out"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-elevated hover:text-text-primary transition">
          <LogOut size={16} />
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="border-b border-border-subtle bg-base/80 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
                <ShieldHalf size={14} />
              </div>
              <span className="font-display text-sm font-semibold text-text-primary">GateMind</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-text-muted">Welcome back</p>
              <h1 className="font-display text-base font-semibold text-text-primary leading-tight">
                {session?.companyName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {s && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-[11px] font-medium text-danger">
                    {s.totalBlocked} blocked total
                  </span>
                  <span className="rounded-full border border-signal/30 bg-signal/10 px-2.5 py-1 text-[11px] font-medium text-signal">
                    {s.blockedToday} today
                  </span>
                </div>
              )}
              <button onClick={logout}
                className="focus-ring lg:hidden flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition">
                <LogOut size={13} /> Sign out
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated border border-border-default text-[11px] font-semibold text-text-primary">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 py-6">

          {profile.isLoading && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="h-52 animate-pulse rounded-2xl bg-surface" />
                <div className="h-52 animate-pulse rounded-2xl bg-surface" />
                <div className="h-52 animate-pulse rounded-2xl bg-surface" />
              </div>
              <div className="h-72 animate-pulse rounded-2xl bg-surface" />
            </div>
          )}

          {profile.isError && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              Failed to load profile.{' '}
              <button onClick={profile.refetch} className="underline">Retry</button>
            </div>
          )}

          {p && (
            <div className="space-y-6">

              {/* Hero row: weekly chart / quick actions / key card */}
              <div className="grid gap-5 lg:grid-cols-3">

                {/* Weekly blocked requests chart */}
                <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
                  <div>
                    <p className="text-xs text-text-muted">Last 7 days</p>
                    <h2 className="text-sm font-semibold text-text-primary">Blocked Requests</h2>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-28">
                    {weeklySeries.map(d => (
                      <div key={d.label + d.date} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center h-20">
                          <div
                            className="w-full max-w-[18px] rounded-t-md bg-cyan/70"
                            style={{ height: `${Math.max((d.count / maxDayCount) * 100, d.count > 0 ? 12 : 4)}%`, opacity: d.count > 0 ? 1 : 0.25 }}
                            title={`${d.count} blocked`}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
                  <div>
                    <p className="text-xs text-text-muted">Manage</p>
                    <h2 className="text-sm font-semibold text-text-primary">Quick Actions</h2>
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={handleRotate}
                      disabled={rotating}
                      className="focus-ring w-full flex items-center justify-between rounded-lg border border-cyan/30 bg-cyan/10 px-3.5 py-2.5 text-xs font-medium text-cyan hover:bg-cyan/15 disabled:opacity-50 transition"
                    >
                      Rotate API key
                      <RefreshCw size={13} className={rotating ? 'animate-spin' : ''} />
                    </button>
                    <button
                      onClick={copy}
                      disabled={!apiKey}
                      className="focus-ring w-full flex items-center justify-between rounded-lg border border-border-default bg-elevated px-3.5 py-2.5 text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 transition"
                    >
                      {copied ? 'Copied to clipboard' : 'Copy API key'}
                      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                    <a
                      href="https://github.com/TechnoTanishq/gatemind-api-security-gateway"
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring w-full flex items-center justify-between rounded-lg border border-border-default bg-elevated px-3.5 py-2.5 text-xs font-medium text-text-secondary hover:text-text-primary transition"
                    >
                      View documentation
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Key summary card */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan/25 bg-gradient-to-br from-cyan/10 via-surface to-surface px-5 py-5 flex flex-col justify-between">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <p className="text-xs text-text-muted">Your API Key</p>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={p.status} />
                      <PlanBadge plan={p.plan} />
                    </div>
                  </div>

                  {apiKey ? (
                    <div className="relative mt-4 space-y-2">
                      <code className="block truncate font-mono text-sm text-text-primary">
                        {masked ? `${apiKey.slice(0, 14)}${'•'.repeat(16)}` : apiKey}
                      </code>
                      <div className="flex items-center gap-3 text-[11px]">
                        <button onClick={() => setMasked(s => !s)} className="text-cyan hover:underline">
                          {masked ? 'Reveal' : 'Hide'}
                        </button>
                        <button onClick={copy} className="text-text-muted hover:text-text-secondary transition">
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="relative mt-4 text-xs text-signal leading-relaxed">
                      Key hidden after registration — rotate to generate a new one.
                    </p>
                  )}

                  {rotateError && <p className="relative mt-2 text-xs text-danger">{rotateError}</p>}

                  <div className="relative mt-5 flex items-center justify-between text-[11px] text-text-muted">
                    <span>Member since {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    <code className="text-cyan">X-API-Key</code>
                  </div>
                </div>
              </div>

              {/* Secondary row: integration + threat breakdown */}
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary">Your Integration</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoRow label="Your Backend URL" value={p.backendBaseUrl} mono />
                    <InfoRow label="GateMind Gateway URL" value={GATEWAY_URL} mono accent />
                  </div>
                  <pre className="overflow-x-auto rounded-lg border border-border-default bg-elevated p-3 text-[11px] text-text-secondary leading-relaxed">
{`# Before
curl ${p.backendBaseUrl}/your-endpoint

# After — route through GateMind
curl ${GATEWAY_URL}/your-endpoint \\
  -H "X-API-Key: <your-api-key>"`}
                  </pre>
                </div>

                <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary">Threat Breakdown</h2>
                  {s?.topThreats?.length > 0 ? (
                    <div className="space-y-3">
                      {s.topThreats.map(t => {
                        const color = colorForThreat(t.threatType)
                        const max = Math.max(...s.topThreats.map(x => x.count), 1)
                        const pct = Math.max((t.count / max) * 100, 6)
                        return (
                          <div key={t.threatType} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium" style={{ color }}>{t.threatType}</span>
                              <span className="font-semibold text-text-primary">{t.count}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <ShieldX size={20} className="mx-auto mb-2 text-text-muted" />
                      <p className="text-xs text-text-muted">No threats detected yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent threats table */}
              <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-text-primary">Recent Threats</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => downloadThreatsCsv(filteredThreats)}
                      disabled={!filteredThreats.length}
                      className="focus-ring flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                    <div className="relative">
                      <select
                        value={typeFilter}
                        onChange={e => setType(e.target.value)}
                        className="focus-ring appearance-none rounded-lg border border-border-default bg-elevated pl-3 pr-7 py-1.5 text-xs text-text-secondary hover:text-text-primary transition cursor-pointer"
                      >
                        <option value="all">All types</option>
                        {threatTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                    <button
                      onClick={toggleSort}
                      className="focus-ring flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition"
                    >
                      Time <ChevronDown size={12} className={`transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {pagedThreats.length > 0 ? (
                  <>
                    <div className="overflow-x-auto -mx-1">
                      <table className="w-full min-w-[480px] text-xs">
                        <thead>
                          <tr className="text-left text-[11px] uppercase tracking-wide text-text-muted border-b border-border-subtle">
                            <th className="pb-2.5 pr-4 px-1 font-medium">Time</th>
                            <th className="pb-2.5 pr-4 font-medium">Type</th>
                            <th className="pb-2.5 pr-4 font-medium">Path</th>
                            <th className="pb-2.5 font-medium">IP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedThreats.map((t, i) => (
                            <tr key={i} className="border-t border-border-subtle hover:bg-elevated/60 transition-colors">
                              <td className="py-2.5 pr-4 px-1 font-mono text-text-muted whitespace-nowrap">{formatTimestamp(t.timestamp)}</td>
                              <td className="py-2.5 pr-4">
                                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                                  style={{ color: colorForThreat(t.eventType), borderColor: `${colorForThreat(t.eventType)}40`, backgroundColor: `${colorForThreat(t.eventType)}15` }}>
                                  {t.eventType}
                                </span>
                              </td>
                              <td className="py-2.5 pr-4 font-mono text-text-muted max-w-[160px] truncate">{t.path}</td>
                              <td className="py-2.5 font-mono text-text-secondary">{t.ipAddress}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-text-muted">
                        Page {page} of {totalPages} · {filteredThreats.length} events
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-border-default bg-elevated text-text-secondary hover:text-text-primary disabled:opacity-30 transition"
                        >
                          <ChevronLeft size={13} />
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-border-default bg-elevated text-text-secondary hover:text-text-primary disabled:opacity-30 transition"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <ShieldAlert size={22} className="mx-auto mb-2 text-text-muted" />
                    <p className="text-sm font-medium text-text-secondary">No matching events</p>
                    <p className="text-xs text-text-muted mt-1">Try a different filter, or check back once traffic flows through GateMind.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function SideIcon({ icon, label, active, href }) {
  const className = `focus-ring flex h-9 w-9 items-center justify-center rounded-lg transition ${
    active ? 'bg-cyan/15 text-cyan' : 'text-text-muted hover:bg-elevated hover:text-text-primary'
  }`
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" title={label} className={className}>
        {icon}
      </a>
    )
  }
  return <button title={label} className={className}>{icon}</button>
}

function InfoRow({ label, value, mono, accent }) {
  return (
    <div className="rounded-lg border border-border-default bg-elevated px-3 py-2.5">
      <p className="text-[11px] text-text-muted mb-1">{label}</p>
      <p className={`text-xs truncate ${mono ? 'font-mono' : ''} ${accent ? 'text-cyan' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}