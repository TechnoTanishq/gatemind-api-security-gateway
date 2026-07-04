import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import ClientProtectedRoute from './ClientProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import ClientLoginPage from '../pages/ClientLoginPage'
import SignupPage from '../pages/SignupPage'
import ClientPortalPage from '../pages/ClientPortalPage'
import DashboardPage from '../pages/DashboardPage'
import ClientsPage from '../pages/ClientsPage'
import AnalyticsPage from '../pages/AnalyticsPage'
import SettingsPage from '../pages/SettingsPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/client-login" element={<ClientLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Client self-service portal */}
        <Route element={<ClientProtectedRoute />}>
          <Route path="/portal" element={<ClientPortalPage />} />
        </Route>

        {/* Admin dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
