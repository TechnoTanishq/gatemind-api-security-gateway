import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ClientAuthProvider } from './context/ClientAuthContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientAuthProvider>
          <AppRouter />
        </ClientAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
