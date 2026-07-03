import LandingNavbar from '../components/landing/LandingNavbar'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import ArchitectureSection from '../components/landing/ArchitectureSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import RoadmapSection from '../components/landing/RoadmapSection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <HowItWorksSection />
      <RoadmapSection />
      <Footer />
    </div>
  )
}
