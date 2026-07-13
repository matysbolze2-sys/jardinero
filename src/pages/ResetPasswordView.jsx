import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

// Affichée par-dessus l'app quand Supabase émet PASSWORD_RECOVERY
// (l'utilisateur arrive via le lien email de réinitialisation).
export default function ResetPasswordView({ onDone }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [done, setDone]         = useState(false)

  const handleSubmit = async () => {
    setError(null)
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) {
      const msg = err.message ?? ''
      if (msg.includes('should be different')) {
        setError("Le nouveau mot de passe doit être différent de l'ancien.")
      } else if (msg.includes('rate limit')) {
        setError('Trop de tentatives. Réessaie dans quelques minutes.')
      } else {
        setError(`Erreur : ${msg}`)
      }
      return
    }
    setDone(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--jd-bg)' }}
    >
      <div className="flex flex-col items-center text-center mb-8">
        <p style={{ fontSize: 56, lineHeight: 1, marginBottom: 16 }}>🔑</p>
        <h1
          className="font-display font-extrabold"
          style={{ fontSize: 26, color: 'var(--jd-ink)', marginBottom: 8 }}
        >
          Nouveau mot de passe
        </h1>
        <p style={{ color: 'var(--jd-ink-muted)', fontSize: 14 }}>
          {done
            ? 'Ton mot de passe a bien été mis à jour. 🌱'
            : 'Choisis ton nouveau mot de passe pour retrouver ton jardin.'}
        </p>
      </div>

      <div
        className="w-full max-w-sm rounded-card p-5"
        style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
      >
        {done ? (
          <button
            onClick={onDone}
            className="tap-scale"
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 'var(--jd-radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'var(--jd-font-sans)',
              background: 'var(--jd-accent)',
              color: 'var(--jd-accent-ink)',
            }}
          >
            Retourner à mon jardin
          </button>
        ) : (
          <>
            <ErrorBanner message={error} />

            <div style={{ marginBottom: 14 }}>
              <label style={LABEL_STYLE}>Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
                style={INPUT_STYLE}
              />
            </div>

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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="tap-scale"
              style={{
                width: '100%',
                padding: '13px 0',
                borderRadius: 'var(--jd-radius-sm)',
                border: 'none',
                cursor: loading ? 'default' : 'pointer',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'var(--jd-font-sans)',
                background: loading ? 'var(--jd-surface-alt)' : 'var(--jd-accent)',
                color: loading ? 'var(--jd-ink-muted)' : 'var(--jd-accent-ink)',
                transition: 'background 0.15s',
              }}
            >
              {loading ? '…' : 'Valider le mot de passe'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
