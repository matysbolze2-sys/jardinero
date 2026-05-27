import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { ProfileProvider } from './context/ProfileContext'
import { useProfile } from './hooks/useProfile'
import BottomNav from './components/BottomNav'
import OnboardingModal from './components/OnboardingModal'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import Home from './pages/Home'
import Conseiller from './pages/Conseiller'
import Calendrier from './pages/Calendrier'
import MonJardin from './pages/MonJardin'

function LoadingScreen() {
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

function AppContent() {
  const [activePage, setActivePage] = useState('home')
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

  if (profileLoading) return <LoadingScreen />

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
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // Gère le callback PKCE — doit être vérifié avant tout rendu conditionnel
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />
  }

  if (loading) return <LoadingScreen />

  // SIGNED_OUT ou pas de session → login
  if (!user) return <LoginPage />

  // SIGNED_IN → dashboard, ProfileProvider monté seulement ici
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  )
}
