import { useState } from 'react'
import { openmoji } from '../utils/openmoji'
import { detectFrostRisk, getFrostSensitivePlants } from '../utils/meteoAlerts'

const DISMISS_KEY = 'jd_frost_dismissed'
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

function today() {
  return new Date().toISOString().split('T')[0]
}

// "cette nuit" / "la nuit prochaine" / "dans la nuit de jeudi à vendredi"
function nuitLabel(risk) {
  if (risk.dansJours === 0) return 'cette nuit'
  if (risk.dansJours === 1) return 'la nuit prochaine'
  const d      = new Date(risk.date + 'T12:00:00')
  const veille = new Date(d)
  veille.setDate(d.getDate() - 1)
  return `dans la nuit de ${JOURS[veille.getDay()]} à ${JOURS[d.getDay()]}`
}

// Bannière proéminente affichée en haut de Home uniquement si un gel est détecté.
// Dismissable pour la journée (réapparaît le lendemain si le risque persiste).
export default function FrostAlert({ daily, plants }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === today() } catch { return false }
  })

  const risk = detectFrostRisk(daily)
  if (!risk || dismissed) return null

  const severe    = risk.type === 'gel_severe'
  const sensibles = getFrostSensitivePlants(plants)

  const theme = severe
    ? { bg: 'var(--jd-harvest-soft)', border: 'var(--jd-harvest-ring)', color: 'var(--jd-harvest)' }
    : { bg: 'var(--jd-warning-soft)', border: 'var(--jd-warning-ring)', color: 'var(--jd-warning)' }

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, today()) } catch { /* stockage indisponible */ }
    setDismissed(true)
  }

  return (
    <div className="rounded-card mb-4 p-4" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
      <div className="flex items-start gap-3">
        <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>🥶</span>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-snug" style={{ color: theme.color }}>
            Gel annoncé {nuitLabel(risk)} ({Math.round(risk.tempMin)}°C)
          </p>

          {sensibles.length > 0 && (
            <p
              className="text-xs mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1"
              style={{ color: 'var(--jd-ink)' }}
            >
              <span style={{ color: 'var(--jd-ink-muted)' }}>Tes plantes sensibles :</span>
              {sensibles.slice(0, 4).map(p => (
                <span key={p.id} className="inline-flex items-center gap-1">
                  <img
                    src={openmoji(p.emoji)}
                    alt=""
                    style={{ width: 14, height: 14 }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  {p.name}
                </span>
              ))}
              {sensibles.length > 4 && (
                <span style={{ color: 'var(--jd-ink-muted)' }}>+{sensibles.length - 4}</span>
              )}
            </p>
          )}

          <p className="text-xs mt-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
            {sensibles.length > 0
              ? '→ Rentre les pots, voile les plants en pleine terre.'
              : '→ Protège les jeunes semis et les plants fragiles.'}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          aria-label="Masquer l'alerte gel"
          className="tap-scale"
          style={{
            flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
            color: theme.color, opacity: 0.55, fontSize: 18, lineHeight: 1, padding: 2,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
