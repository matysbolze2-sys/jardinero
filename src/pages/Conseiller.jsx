import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getSoilById } from '../data/soils'
import { CONSEILS_MENSUELS } from '../data/conseils'
import { getPlantsToSowThisMonth, getPlantsToHarvestThisMonth } from '../utils/calendarUtils'
import { MOIS_LABELS } from '../data/plants'

function ConseilCard({ text, index }) {
  return (
    <div
      className="flex gap-3 p-4 rounded-card"
      style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
    >
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)' }}
      >
        {index + 1}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--jd-ink)' }}>{text}</p>
    </div>
  )
}

function PlantesDuMoment({ title, emoji, plants }) {
  if (plants.length === 0) return null
  return (
    <div className="mb-5">
      <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--jd-accent)' }}>
        {emoji} {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {plants.map(p => (
          <span key={p.id} className="jd-chip">
            {p.emoji} {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Conseiller() {
  const { profile } = useProfile()
  const region  = getRegionById(profile.region)
  const sol     = getSoilById(profile.soil)
  const moisIdx = new Date().getMonth()
  const conseil = CONSEILS_MENSUELS[moisIdx]

  const offsetWeeks    = region?.offset ?? 0
  const plantesSemer   = getPlantsToSowThisMonth(offsetWeeks)
  const plantesRecolte = getPlantsToHarvestThisMonth(offsetWeeks)

  return (
    <div className="px-4 pt-6 pb-4">
      {/* En-tête mois */}
      <div
        className="rounded-card p-5 mb-5"
        style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--jd-accent)' }}>
          {MOIS_LABELS[moisIdx]}
        </p>
        <h1 className="font-display font-extrabold text-2xl leading-tight mb-1" style={{ color: 'var(--jd-ink)' }}>
          {conseil.emoji} {conseil.humeur}
        </h1>
        <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>
          {conseil.intro}
        </p>

        <div className="flex gap-2 mt-3 flex-wrap">
          {profile.coords ? (
            <span className="jd-chip">
              📍 {profile.coords.lat.toFixed(2)}°N, {profile.coords.lon.toFixed(2)}°E
            </span>
          ) : region && (
            <span className="jd-chip">
              🗺️ {region.label}
            </span>
          )}
          {sol && (
            <span className="jd-chip">
              {sol.emoji} Sol {sol.label.toLowerCase()}
            </span>
          )}
        </div>
      </div>

      <PlantesDuMoment title="À semer ce mois-ci"   emoji="🌱" plants={plantesSemer}   />
      <PlantesDuMoment title="À récolter ce mois-ci" emoji="🧺" plants={plantesRecolte} />

      <div>
        <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--jd-accent)' }}>
          Conseils pratiques
        </h2>
        <div className="flex flex-col gap-2">
          {conseil.conseils.map((c, i) => (
            <ConseilCard key={i} text={c} index={i} />
          ))}
        </div>
      </div>

      {sol && sol.id !== 'inconnu' && (
        <div
          className="mt-5 p-4 rounded-card"
          style={{ background: 'var(--jd-warning-soft)', border: '1px solid rgba(240,184,108,0.3)' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--jd-warning)' }}>
            💡 Pour votre sol {sol.label.toLowerCase()}
          </p>
          <p className="text-sm" style={{ color: 'var(--jd-ink)' }}>{sol.tips}</p>
        </div>
      )}
    </div>
  )
}
