import { useProfile } from '../hooks/useProfile'
import { useMeteo, describeWeatherCode } from '../hooks/useMeteo'

const JOURS_COURTS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function JourMeteo({ dateStr, tMax, tMin, pluie, weathercode, isToday }) {
  const { emoji } = describeWeatherCode(weathercode ?? 0)
  const d     = new Date(dateStr)
  const label = isToday ? 'Auj.' : JOURS_COURTS[d.getDay()]

  return (
    <div
      className="flex flex-col items-center gap-0.5 flex-1"
      style={{
        background:   isToday ? 'rgba(255,255,255,0.18)' : 'transparent',
        borderRadius: 8,
        padding:      '6px 2px',
      }}
    >
      <span className="text-xs font-semibold" style={{ color: isToday ? 'white' : 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
      <span style={{ fontSize: 20, lineHeight: 1.2 }}>{emoji}</span>
      <span className="text-xs font-bold" style={{ color: 'white' }}>{Math.round(tMax)}°</span>
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{Math.round(tMin)}°</span>
      {pluie >= 1 && (
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {Math.round(pluie)}mm
        </span>
      )}
    </div>
  )
}

export default function MeteoWidget() {
  const { profile } = useProfile()
  const { meteo, loading, error, alertes } = useMeteo(profile.region, profile.coords)

  if (!profile.region) return null
  if (loading) return (
    <div className="rounded-card p-4 mb-4 flex items-center gap-2" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
      <span>🌤️</span>
      <span className="text-sm font-medium">Chargement météo…</span>
    </div>
  )
  if (error || !meteo?.daily) return null

  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, weathercode } = meteo.daily

  return (
    <div className="mb-4">
      {/* Alertes */}
      {alertes.map((alerte, i) => (
        <div
          key={i}
          className="rounded-card px-4 py-3 mb-2 flex items-center gap-2"
          style={
            alerte.type === 'gel'
              ? { background: '#EFF6FF', border: '2px solid #BAE6FD' }
              : { background: '#FFFBEB', border: '2px solid #FDE68A' }
          }
        >
          <span className="text-xl flex-shrink-0">{alerte.type === 'gel' ? '🧊' : '☀️'}</span>
          <p className="text-sm font-semibold" style={{ color: alerte.type === 'gel' ? '#0369A1' : '#92400E' }}>
            {alerte.type === 'gel'
              ? `Risque de gel ${alerte.dansNJours === 0 ? "aujourd'hui" : alerte.dansNJours === 1 ? 'demain' : `dans ${alerte.dansNJours} jours`} — protégez vos semis !`
              : '4+ jours sans pluie — pensez à arroser'}
          </p>
        </div>
      ))}

      {/* Widget 7 jours — palette verte */}
      <div
        className="rounded-card p-3 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2D5A0E 0%, #3B6D11 55%, #527A20 100%)' }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
          ☁️ Météo 7 jours
        </p>
        <div className="flex gap-1">
          {time.map((dateStr, i) => (
            <JourMeteo
              key={dateStr}
              dateStr={dateStr}
              tMax={temperature_2m_max[i]}
              tMin={temperature_2m_min[i]}
              pluie={precipitation_sum[i] ?? 0}
              weathercode={weathercode[i]}
              isToday={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
