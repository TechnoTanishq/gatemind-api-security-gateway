import { createContext, useContext, useState } from 'react'
import { clientLogin, signup } from '../api/clientsApi'

const CLIENT_TOKEN_KEY = 'gatemind_client_token'
const CLIENT_SESSION_KEY = 'gatemind_client_session'
const CLIENT_APIKEY_KEY = 'gatemind_client_apikey'

const ClientAuthContext = createContext(null)

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function isExpired(token) {
  const payload = parseJwt(token)
  if (!payload?.exp) return true
  return Date.now() / 1000 > payload.exp
}

export function ClientAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem(CLIENT_TOKEN_KEY)
    if (t && !isExpired(t)) return t
    localStorage.removeItem(CLIENT_TOKEN_KEY)
    localStorage.removeItem(CLIENT_SESSION_KEY)
    localStorage.removeItem(CLIENT_APIKEY_KEY)
    return null
  })

  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(CLIENT_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const [storedApiKey, setStoredApiKey] = useState(() => {
    return localStorage.getItem(CLIENT_APIKEY_KEY) || null
  })

  function persist(authResponse) {
    const { token: t, clientId, companyName, email, apiKey } = authResponse
    const newSession = { clientId, companyName, email }
    localStorage.setItem(CLIENT_TOKEN_KEY, t)
    localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(newSession))
    if (apiKey) {
      localStorage.setItem(CLIENT_APIKEY_KEY, apiKey)
      setStoredApiKey(apiKey)
    }
    setToken(t)
    setSession(newSession)
  }

  async function register(payload) {
    const result = await signup(payload)
    persist(result)
    return result // includes apiKey — caller must capture and show it
  }

  async function login(email, password) {
    const result = await clientLogin({ email, password })
    persist(result)
    return result
  }

  function logout() {
    localStorage.removeItem(CLIENT_TOKEN_KEY)
    localStorage.removeItem(CLIENT_SESSION_KEY)
    localStorage.removeItem(CLIENT_APIKEY_KEY)
    setToken(null)
    setSession(null)
    setStoredApiKey(null)
  }

  function updateStoredApiKey(key) {
    localStorage.setItem(CLIENT_APIKEY_KEY, key)
    setStoredApiKey(key)
  }

  return (
    <ClientAuthContext.Provider
      value={{ token, session, storedApiKey, isAuthenticated: !!token, register, login, logout, updateStoredApiKey }}
    >
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const ctx = useContext(ClientAuthContext)
  if (!ctx) throw new Error('useClientAuth must be used within ClientAuthProvider')
  return ctx
}
