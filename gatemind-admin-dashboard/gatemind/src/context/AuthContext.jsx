import { createContext, useContext, useState } from 'react'
import { adminLogin } from '../api/clientsApi'

const ADMIN_TOKEN_KEY = 'gatemind_token'
const ADMIN_SESSION_KEY = 'gatemind_admin_session'

const AuthContext = createContext(null)

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

function isExpired(token) {
  const p = parseJwt(token)
  if (!p?.exp) return true
  return Date.now() / 1000 > p.exp
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token && !isExpired(token)) {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    }
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_SESSION_KEY)
    return null
  })

  async function login(email, password) {
    try {
      const result = await adminLogin({ email, password })
      const newSession = { email: result.email, companyName: result.companyName }
      localStorage.setItem(ADMIN_TOKEN_KEY, result.token)
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(newSession))
      setSession(newSession)
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.message || 'Incorrect credentials.' }
    }
  }

  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_SESSION_KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
