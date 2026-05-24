import { useState } from 'react'
import { ProfileProvider } from './context/ProfileContext'
import { useProfile } from './hooks/useProfile'
import BottomNav from './components/BottomNav'
import OnboardingModal from './components/OnboardingModal'
import Home from './pages/Home'
import Conseiller from './pages/Conseiller'
import Calendrier from './pages/Calendrier'
import MonJardin from './pages/MonJardin'

// Composant interne qui accède au contexte profil
function AppContent() {
  const [activePage, setActivePage] = useState('home')
  const { profile, completeOnboarding } = useProfile()

  const renderPage = () => {
    switch (activePage) {
      case 'home':       return <Home onNavigate={setActivePage} />
      case 'conseiller': return <Conseiller />
      case 'calendrier': return <Calendrier onNavigate={setActivePage} />
      case 'mon-jardin': return <MonJardin />
      default:           return <Home onNavigate={setActivePage} />
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-cream">
      {/* Modal onboarding au premier lancement */}
      {!profile.settings.onboardingDone && (
        <OnboardingModal onComplete={completeOnboarding} />
      )}

      {/* Contenu de la page — padding bas pour la nav fixe */}
      <main className="flex-1" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        <div key={activePage} className="page-enter">
          {renderPage()}
        </div>
      </main>

      {/* Navigation fixe en bas */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  )
}
