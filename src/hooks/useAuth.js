import { supabase } from '../lib/supabase'

function mapAuthError(error) {
  if (!error) return null
  const msg = error.message ?? ''
  if (msg.includes('Invalid login credentials'))          return 'Email ou mot de passe incorrect.'
  if (msg.includes('Email not confirmed'))                return 'Confirmez votre email avant de vous connecter.'
  if (msg.includes('User already registered'))            return 'Un compte existe déjà avec cet email.'
  if (msg.includes('Password should be at least'))        return 'Le mot de passe doit faire au moins 8 caractères.'
  if (msg.includes('Unable to validate email address'))   return 'Adresse email invalide.'
  return 'Une erreur est survenue, réessayez.'
}

export function useAuth() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) console.error('Erreur connexion Google:', error)
  }

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: mapAuthError(error) }
  }

  const signUpWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: mapAuthError(error) }
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: mapAuthError(error) }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut }
}
