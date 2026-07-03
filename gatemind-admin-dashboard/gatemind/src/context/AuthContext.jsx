import { createContext, useContext, useState } from 'react'
import { AUTH_STORAGE_KEY, TEMP_ADMIN_CREDENTIALS } from '../config/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  function login(username, password) {
    if (
      username === TEMP_ADMIN_CREDENTIALS.username &&
      password === TEMP_ADMIN_CREDENTIALS.password
    ) {
      const newSession = { username, loggedInAt: new Date().toISOString() }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession))
      setSession(newSession)
      return { success: true }
    }
    return { success: false, error: 'Incorrect username or password.' }
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
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
