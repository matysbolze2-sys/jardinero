import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        window.location.replace('/')
      })
    } else {
      window.location.replace('/')
    }
  }, [])

  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: 'var(--jd-bg)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <p style={{ fontSize: 48 }}>🌱</p>
        <p style={{ color: 'var(--jd-ink-muted)', fontSize: 14 }}>
          Connexion en cours…
        </p>
      </div>
    </div>
  )
}
