import { useContext } from 'react'
import { ProfileContext } from '../context/ProfileContext'

// Hook pour accéder au profil utilisateur (région + sol + plantes)
export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile doit être utilisé dans un ProfileProvider')
  }
  return context
}
