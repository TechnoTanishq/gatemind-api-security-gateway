import axiosClient from './axiosClient'

// All analytics-related network calls live here so components never touch
// axios directly. Each function returns response.data or throws a
// normalized error for the calling hook to handle.

export async function getStats() {
  const { data } = await axiosClient.get('/analytics/stats')
  return data
}

export async function getAttackTrend() {
  const { data } = await axiosClient.get('/analytics/attack-trend')
  // Transform backend { date, attacks } to { label, attacks } for the chart
  return data.map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attacks: item.attacks,
  }))
}

export async function getTopThreats() {
  const { data } = await axiosClient.get('/analytics/top-threats')
  return data
}

export async function getTopClients() {
  const { data } = await axiosClient.get('/analytics/top-clients')
  return data
}

export async function getTopIps() {
  const { data } = await axiosClient.get('/analytics/top-ips')
  return data
}

export async function getRecentThreats() {
  const { data } = await axiosClient.get('/analytics/recent')
  return data
}

export async function getClientStats(clientId) {
  const { data } = await axiosClient.get(`/analytics/client-stats?clientId=${clientId}`)
  return data
}
