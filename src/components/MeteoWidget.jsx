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
        background:   isToday ? 'rgba(123,201,0,0.12)' : 'transparent',
        borderRadius: 8,
        padding:      '6px 2px',
      }}
    >
      <span className="text-xs font-semibold" style={{ color: isToday ? '#F0F7E8' : 'rgba(240,247,232,0.6)' }}>
        {label}
      </span>
      <span style={{ fontSize: 20, lineHeight: 1.2 }}>{emoji}</span>
      <span className="text-xs font-bold" style={{ color: '#F0F7E8' }}>{Math.round(tMax)}°</span>
      <span className="text-xs" style={{ color: 'rgba(240,247,232,0.5)' }}>{Math.round(tMin)}°</span>
      {pluie >= 1 && (
        <span className="text-xs font-medium" style={{ color: 'var(--jd-accent)' }}>
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
    <div className="rounded-card p-4 mb-4 flex items-center gap-2" style={{ background: 'var(--jd-surface)', color: 'var(--jd-accent)' }}>
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
              ? { background: '#0D1520', border: '1px solid rgba(147,197,253,0.3)' }
              : { background: '#1A1208', border: '1px solid rgba(250,199,117,0.3)' }
          }
        >
          <span className="text-xl flex-shrink-0">{alerte.type === 'gel' ? '🧊' : '☀️'}</span>
          <p className="text-sm font-semibold" style={{ color: alerte.type === 'gel' ? '#93C5FD' : 'var(--jd-warning)' }}>
            {alerte.type === 'gel'
              ? `Risque de gel ${alerte.dansNJours === 0 ? "aujourd'hui" : alerte.dansNJours === 1 ? 'demain' : `dans ${alerte.dansNJours} jours`} — protégez vos semis !`
              : '4+ jours sans pluie — pensez à arroser'}
          </p>
        </div>
      ))}

      {/* Widget 7 jours */}
      <div
        className="rounded-card p-3 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D1208 0%, #151E0F 100%)',
          border: '0.5px solid rgba(123,201,0,0.15)',
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
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
