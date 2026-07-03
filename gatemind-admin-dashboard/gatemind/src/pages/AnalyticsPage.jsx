import { BarChart3 } from 'lucide-react'
import PlaceholderPage from '../components/layout/PlaceholderPage'

export default function AnalyticsPage() {
  return (
    <PlaceholderPage
      icon={BarChart3}
      title="Deeper analytics are on the way"
      description="Historical trends, anomaly scoring, and exportable reports will live here once the extended analytics API ships alongside the AI risk-scoring engine."
      roadmap={['AI Risk Scoring', 'Explainable AI', 'Custom date ranges']}
    />
  )
}
