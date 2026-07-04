import clientsAxiosClient from './clientsAxiosClient'

// All client-management network calls live here — components and modals
// never touch axios directly, only these functions. This service talks
// to the Client Management microservice (see config/app.js for its port),
// mounted under /api/v1/clients on that service.

const BASE = '/api/v1/clients'

export async function getClients() {
  const { data } = await clientsAxiosClient.get(BASE)
  return data
}

export async function registerClient({ companyName, email, backendBaseUrl, plan }) {
  // POST /api/v1/clients — returns CreateClientResponse: { clientId, companyName, email, backendBaseUrl, apiKey, plan }
  const { data } = await clientsAxiosClient.post(BASE, { companyName, email, backendBaseUrl, plan })
  return data
}

export async function rotateApiKey(clientId) {
  // POST /api/v1/clients/{id}/rotate-key — returns ApiKeyResponse: { apiKey }
  const { data } = await clientsAxiosClient.post(`${BASE}/${clientId}/rotate-key`)
  return data
}

export async function updateClientPlan(clientId, plan) {
  // PUT /api/v1/clients/{id}/plan — returns a plain-text confirmation message
  const { data } = await clientsAxiosClient.put(`${BASE}/${clientId}/plan`, { plan })
  return data
}

// There's no single "update status" endpoint on the backend — ACTIVE,
// SUSPENDED, and REVOKED are three separate POST endpoints. This function
// keeps the same (clientId, status) signature the UI already uses and
// routes to the right one under the hood.
const STATUS_ENDPOINTS = {
  ACTIVE: 'activate',
  SUSPENDED: 'suspend',
  REVOKED: 'revoke',
}

export async function updateClientStatus(clientId, status) {
  const action = STATUS_ENDPOINTS[status]
  if (!action) {
    throw new Error(`Unknown status "${status}" — expected ACTIVE, SUSPENDED, or REVOKED.`)
  }
  const { data } = await clientsAxiosClient.post(`${BASE}/${clientId}/${action}`)
  return data
}

// ---------------------------------------------------------------------------
// Auth & Client self-service — routed through gateway (port 8080)
// These use axiosClient (not clientsAxiosClient) because the gateway
// forwards /auth/** and /me/** to the client-service internally.
// ---------------------------------------------------------------------------
import axiosClient from './axiosClient'

export async function signup(payload) {
  // POST /auth/signup — returns AuthResponse: { token, role, clientId, companyName, email, apiKey }
  const { data } = await axiosClient.post('/auth/signup', payload)
  return data
}

export async function clientLogin(payload) {
  // POST /auth/login — returns AuthResponse: { token, role, clientId, companyName, email }
  const { data } = await axiosClient.post('/auth/login', payload)
  return data
}

export async function adminLogin(payload) {
  // POST /auth/admin/login — returns AuthResponse with ROLE_ADMIN
  const { data } = await axiosClient.post('/auth/admin/login', payload)
  return data
}

export async function getMyProfile(token) {
  // GET /me — returns ClientProfileResponse
  const { data } = await axiosClient.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export async function rotateMyKey(token) {
  // POST /me/rotate-key — returns ApiKeyResponse: { apiKey }
  const { data } = await axiosClient.post('/me/rotate-key', null, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}
