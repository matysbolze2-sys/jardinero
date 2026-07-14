import { useProfile } from '../hooks/useProfile'
import { useMeteo, describeWeatherCode } from '../hooks/useMeteo'

const JOURS_COURTS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function JourMeteo({ dateStr, tMax, tMin, pluie, weathercode, isToday }) {
  const { emoji } = describeWeatherCode(weathercode ?? 0)
  const d       = new Date(dateStr)
  const label   = isToday ? 'Auj.' : JOURS_COURTS[d.getDay()]
  const isRainy = pluie >= 1

  return (
    <div
      className="flex flex-col items-center gap-0.5 flex-1"
      style={{
        background:   isToday ? 'var(--jd-water-soft)' : 'transparent',
        borderRadius: 8,
        padding:      '6px 2px',
      }}
    >
      <span
        className="text-xs font-semibold"
        style={{ color: isToday ? 'var(--jd-water)' : 'var(--jd-ink-muted)' }}
      >
        {label}
      </span>
      <span style={{ fontSize: 20, lineHeight: 1.2 }}>{emoji}</span>
      <span
        className="text-xs font-bold"
        style={{ color: isRainy ? 'var(--jd-water)' : 'var(--jd-warning)' }}
      >
        {Math.round(tMax)}°
      </span>
      <span className="text-xs" style={{ color: 'var(--jd-ink-muted)', opacity: 0.7 }}>
        {Math.round(tMin)}°
      </span>
      {isRainy && (
        <span className="text-xs font-medium" style={{ color: 'var(--jd-water)' }}>
          {Math.round(pluie)}mm
        </span>
      )}
    </div>
  )
}

export default function MeteoWidget() {
  const { profile } = useProfile()
  const { meteo, loading, error, alertes, todayIdx } = useMeteo(profile.region, profile.coords)

  if (!profile.region) return null
  if (loading) return (
    <div className="rounded-card p-4 mb-4 flex items-center gap-2" style={{ background: 'var(--jd-surface)', color: 'var(--jd-water)' }}>
      <span>🌤️</span>
      <span className="text-sm font-medium">Chargement météo…</span>
    </div>
  )
  if (error || !meteo?.daily) return null

  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, weathercode } = meteo.daily

  // 7 jours à partir d'aujourd'hui (past_days décale l'origine des tableaux).
  // Le gel est désormais porté par <FrostAlert> en haut de Home → on ne garde
  // ici que la sécheresse pour éviter le doublon.
  const jours = time.slice(todayIdx, todayIdx + 7)
  const secheresse = alertes.filter(a => a.type === 'secheresse')

  return (
    <div className="mb-4">
      {/* Alertes (sécheresse uniquement) */}
      {secheresse.map((alerte, i) => (
        <div
          key={i}
          className="rounded-card px-4 py-3 mb-2 flex items-center gap-2"
          style={{ background: '#1A1208', border: '1px solid rgba(252,186,106,0.3)' }}
        >
          <span className="text-xl flex-shrink-0">☀️</span>
          <p className="text-sm font-semibold" style={{ color: 'var(--jd-warning)' }}>
            4+ jours sans pluie — pense à arroser
          </p>
        </div>
      ))}

      {/* Widget 7 jours */}
      <div
        className="rounded-card p-3 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--jd-bg) 0%, var(--jd-surface) 100%)',
          border:     '0.5px solid var(--jd-water-ring)',
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--jd-water)' }}>
          ☁️ Météo 7 jours
        </p>
        <div className="flex gap-1">
          {jours.map((dateStr, i) => {
            const idx = todayIdx + i
            return (
              <JourMeteo
                key={dateStr}
                dateStr={dateStr}
                tMax={temperature_2m_max[idx]}
                tMin={temperature_2m_min[idx]}
                pluie={precipitation_sum[idx] ?? 0}
                weathercode={weathercode[idx]}
                isToday={i === 0}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
