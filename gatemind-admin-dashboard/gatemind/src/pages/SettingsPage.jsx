import { Settings } from 'lucide-react'
import PlaceholderPage from '../components/layout/PlaceholderPage'

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      title="Admin settings"
      description="User management, JWT-based authentication, notification preferences, and billing configuration will be managed from here."
      roadmap={['User Management', 'JWT Authentication', 'Billing']}
    />
  )
}
