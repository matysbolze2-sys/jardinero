import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const INPUT_STYLE = {
  width: '100%',
  background: 'var(--jd-surface)',
  border: '1px solid var(--jd-border)',
  borderRadius: 'var(--jd-radius-sm)',
  padding: '12px 14px',
  fontSize: 16,           // ≥16px — empêche le zoom iOS
  color: 'var(--jd-ink)',
  outline: 'none',
  fontFamily: 'var(--jd-font-sans)',
  boxSizing: 'border-box',
}

const LABEL_STYLE = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--jd-ink-muted)',
  marginBottom: 6,
  fontFamily: 'var(--jd-font-sans)',
}

function Separator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--jd-border)' }} />
      <span style={{ fontSize: 12, color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>ou</span>
      <div style={{ flex: 1, height: 1, background: 'var(--jd-border)' }} />
    </div>
  )
}

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: 'rgba(224,90,58,0.1)',
      border: '1px solid rgba(224,90,58,0.35)',
      borderRadius: 'var(--jd-radius-sm)',
      padding: '10px 14px',
      fontSize: 13,
      color: 'var(--jd-harvest)',
      marginBottom: 16,
      fontFamily: 'var(--jd-font-sans)',
    }}>
      {message}
    </div>
  )
}

function SuccessBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: 'rgba(166,227,107,0.1)',
      border: '1px solid rgba(166,227,107,0.35)',
      borderRadius: 'var(--jd-radius-sm)',
      padding: '10px 14px',
      fontSize: 13,
      color: 'var(--jd-accent)',
      marginBottom: 16,
      fontFamily: 'var(--jd-font-sans)',
    }}>
      {message}
    </div>
  )
}

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()

  const [mode, setMode]           = useState('login')   // 'login' | 'signup'
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(null)
  const [resetSent, setResetSent] = useState(false)

  const resetForm = () => {
    setError(null)
    setSuccess(null)
    setPassword('')
    setConfirm('')
    setResetSent(false)
  }

  const switchMode = (next) => {
    setMode(next)
    resetForm()
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!email.trim() || !password) {
      setError('Remplis tous les champs.')
      return
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setError('Le mot de passe doit faire au moins 8 caractères.')
        return
      }
      if (password !== confirm) {
        setError('Les mots de passe ne correspondent pas.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error: err } = await signUpWithEmail(email.trim(), password)
        if (err) { setError(err); return }
        setSuccess('Vérifie tes emails pour confirmer ton compte. 📬')
      } else {
        const { error: err } = await signInWithEmail(email.trim(), password)
        if (err) setError(err)
        // Si succès : onAuthStateChange dans App.jsx prend le relais
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Entre ton email pour recevoir le lien de réinitialisation.')
      return
    }
    setLoading(true)
    const { error: err } = await resetPassword(email.trim())
    setLoading(false)
    if (err) { setError(err); return }
    setResetSent(true)
    setSuccess('Email de réinitialisation envoyé. Vérifie ta boîte mail.')
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--jd-bg)' }}
    >
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-10">
        <p style={{ fontSize: 72, lineHeight: 1, marginBottom: 16 }}>🌱</p>
        <h1
          className="font-display font-extrabold"
          style={{ fontSize: 48, color: 'var(--jd-accent)', marginBottom: 8 }}
        >
          Jardinero
        </h1>
        <p style={{ color: 'var(--jd-ink-muted)', fontSize: 16 }}>
          Ton potager intelligent
        </p>
      </div>

      {/* Feature list */}
      <div
        className="w-full max-w-sm rounded-card p-5 mb-8"
        style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
      >
        {[
          { icon: '🌦️', label: 'Météo adaptée à ta région' },
          { icon: '📅', label: 'Calendrier des semis personnalisé' },
          { icon: '💧', label: 'Arrosage intelligent' },
          { icon: '🤝', label: 'Associations de plantes' },
          { icon: '🔄', label: 'Rotation des cultures' },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-3 py-2">
            <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
            <p style={{ color: 'var(--jd-ink)', fontSize: 14 }}>{f.label}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm">

        {/* Google */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-card font-semibold tap-scale"
          style={{
            background: 'white',
            color: 'var(--jd-accent-ink)',
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <Separator />

        {/* Formulaire email/mdp */}
        <div
          className="rounded-card p-5"
          style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
        >
          {/* Toggle login / signup */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--jd-bg)', borderRadius: 'var(--jd-radius-sm)', padding: 4 }}>
            {[
              { id: 'login',  label: 'Se connecter' },
              { id: 'signup', label: 'Créer un compte' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => switchMode(tab.id)}
                className="tap-scale"
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--jd-font-sans)',
                  cursor: 'pointer',
                  background: mode === tab.id ? 'var(--jd-surface)' : 'transparent',
                  color: mode === tab.id ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
                  boxShadow: mode === tab.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ErrorBanner message={error} />
          <SuccessBanner message={success} />

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL_STYLE}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ton@email.com"
              autoComplete="email"
              style={INPUT_STYLE}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: mode === 'signup' ? 14 : 8 }}>
            <label style={LABEL_STYLE}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'signup' ? 'Minimum 8 caractères' : '••••••••'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              style={INPUT_STYLE}
            />
          </div>

          {/* Confirmation (signup seulement) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: 20 }}>
              <label style={LABEL_STYLE}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                autoComplete="new-password"
                style={INPUT_STYLE}
              />
            </div>
          )}

          {/* Mot de passe oublié (login seulement) */}
          {mode === 'login' && !resetSent && (
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="tap-scale"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--jd-ink-muted)',
                  fontFamily: 'var(--jd-font-sans)',
                  textDecoration: 'underline',
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !!success}
            className="tap-scale"
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 'var(--jd-radius-sm)',
              border: 'none',
              cursor: loading || success ? 'default' : 'pointer',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'var(--jd-font-sans)',
              background: loading || success ? 'var(--jd-surface-alt)' : 'var(--jd-accent)',
              color: loading || success ? 'var(--jd-ink-muted)' : 'var(--jd-accent-ink)',
              transition: 'background 0.15s',
            }}
          >
            {loading
              ? '…'
              : mode === 'login'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </button>
        </div>

      </div>

      <p
        className="mt-6 text-center text-xs px-8"
        style={{ color: 'var(--jd-ink-muted)' }}
      >
        En te connectant, tu acceptes que tes données de jardinage
        soient sauvegardées de façon sécurisée.
      </p>
    </div>
  )
}
