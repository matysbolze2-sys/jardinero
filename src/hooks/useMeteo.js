import { useState, useEffect } from 'react'
import { getRegionById } from '../data/regions'

export function describeWeatherCode(code) {
  if (code === 0)        return { emoji: '☀️',  label: 'Ensoleillé' }
  if (code <= 2)         return { emoji: '🌤️', label: 'Peu nuageux' }
  if (code === 3)        return { emoji: '☁️',  label: 'Couvert' }
  if (code <= 48)        return { emoji: '🌫️', label: 'Brouillard' }
  if (code <= 55)        return { emoji: '🌦️', label: 'Bruine' }
  if (code <= 65)        return { emoji: '🌧️', label: 'Pluie' }
  if (code <= 77)        return { emoji: '❄️',  label: 'Neige' }
  if (code <= 82)        return { emoji: '🌧️', label: 'Averses' }
  if (code <= 86)        return { emoji: '🌨️', label: 'Averses neige' }
  return                        { emoji: '⛈️',  label: 'Orage' }
}

// regionId  : id de région (fallback)
// coordsOverride : { lat, lon } — coordonnées GPS précises (prioritaire si présentes)
export function useMeteo(regionId, coordsOverride = null) {
  const [meteo, setMeteo]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const lat = coordsOverride?.lat ?? getRegionById(regionId)?.lat
  const lon = coordsOverride?.lon ?? getRegionById(regionId)?.lon

  useEffect(() => {
    if (!lat || !lon) return

    setLoading(true)
    setError(null)

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode` +
      `&timezone=Europe%2FParis&forecast_days=7`

    fetch(url)
      .then(r => { if (!r.ok) throw new Error('réseau'); return r.json() })
      .then(data => { setMeteo(data); setLoading(false) })
      .catch(err => { setError(err); setLoading(false) })
  }, [lat, lon])

  const alertes = []
  if (meteo?.daily) {
    const { temperature_2m_min, precipitation_sum } = meteo.daily

    for (let i = 0; i < Math.min(3, temperature_2m_min.length); i++) {
      if (temperature_2m_min[i] < 2) {
        alertes.push({ type: 'gel', dansNJours: i })
        break
      }
    }

    let secCount = 0
    for (const pluie of precipitation_sum) {
      if ((pluie ?? 0) < 1) { secCount++; if (secCount >= 4) { alertes.push({ type: 'secheresse' }); break } }
      else secCount = 0
    }
  }

  function aPluiePrevue(dateStr) {
    if (!meteo?.daily) return false
    const idx = meteo.daily.time.indexOf(dateStr)
    if (idx === -1) return false
    return (meteo.daily.precipitation_sum[idx] ?? 0) >= 3
  }

  return { meteo, loading, error, alertes, aPluiePrevue }
}
