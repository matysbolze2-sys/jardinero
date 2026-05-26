import { useState } from 'react'
import { ProfileProvider } from './context/ProfileContext'
import { useProfile } from './hooks/useProfile'
import { useAuth } from './hooks/useAuth'
import BottomNav from './components/BottomNav'
import OnboardingModal from './components/OnboardingModal'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import Conseiller from './pages/Conseiller'
import Calendrier from './pages/Calendrier'
import MonJardin from './pages/MonJardin'

function AppContent() {
  const [activePage, setActivePage] = useState('home')
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, completeOnboarding } = useProfile()

  const renderPage = () => {
    switch (activePage) {
      case 'home':       return <Home onNavigate={setActivePage} />
      case 'conseiller': return <Conseiller onNavigate={setActivePage} />
      case 'calendrier': return <Calendrier onNavigate={setActivePage} />
      case 'mon-jardin': return <MonJardin />
      default:           return <Home onNavigate={setActivePage} />
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: 'var(--jd-bg)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <p style={{ fontSize: 48 }}>🌱</p>
          <p style={{ color: 'var(--jd-ink-muted)', fontSize: 14 }}>
            Chargement de votre jardin…
          </p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--jd-bg)' }}>
      {!profile.settings.onboardingDone && (
        <OnboardingModal onComplete={completeOnboarding} />
      )}

      <main className="flex-1" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        <div key={activePage} className="page-enter">
          {renderPage()}
        </div>
      </main>

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
