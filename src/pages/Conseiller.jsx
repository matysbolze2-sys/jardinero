import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getSoilById } from '../data/soils'
import { CONSEILS_MENSUELS } from '../data/conseils'
import { getPlantsToSowThisMonth, getPlantsToHarvestThisMonth } from '../utils/calendarUtils'
import { MOIS_LABELS } from '../data/plants'

// Carte de conseil individuelle
function ConseilCard({ text, index }) {
  return (
    <div
      className="flex gap-3 p-4 rounded-card"
      style={{ background: 'white', border: '1px solid #DDE8CC' }}
    >
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: '#EAF3DE', color: '#3B6D11' }}
      >
        {index + 1}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: '#1A2010' }}>{text}</p>
    </div>
  )
}

// Section légumes du moment (semis ou récolte)
function PlantesDuMoment({ title, emoji, plants }) {
  if (plants.length === 0) return null
  return (
    <div className="mb-5">
      <h3 className="font-semibold text-sm mb-2" style={{ color: '#3B6D11' }}>
        {emoji} {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {plants.map(p => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-chip text-sm font-medium"
            style={{ background: '#EAF3DE', color: '#3B6D11', border: '1px solid #97C459' }}
          >
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

  const offsetWeeks  = region?.offset ?? 0
  const plantesSemer   = getPlantsToSowThisMonth(offsetWeeks)
  const plantesRecolte = getPlantsToHarvestThisMonth(offsetWeeks)

  return (
    <div className="px-4 pt-6 pb-4">
      {/* En-tête mois */}
      <div
        className="rounded-card p-5 mb-5"
        style={{ background: '#3B6D11' }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#97C459' }}>
          {MOIS_LABELS[moisIdx]}
        </p>
        <h1 className="font-fraunces text-2xl text-white leading-tight mb-1">
          {conseil.emoji} {conseil.humeur}
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {conseil.intro}
        </p>

        {/* Infos région + sol */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {region && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-chip text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              🗺️ {region.label}
            </span>
          )}
          {sol && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-chip text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              {sol.emoji} Sol {sol.label.toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Légumes du moment */}
      <PlantesDuMoment
        title="À semer ce mois-ci"
        emoji="🌱"
        plants={plantesSemer}
      />
      <PlantesDuMoment
        title="À récolter ce mois-ci"
        emoji="🧺"
        plants={plantesRecolte}
      />

      {/* Conseils pratiques du mois */}
      <div>
        <h2 className="font-fraunces text-lg mb-3" style={{ color: '#3B6D11' }}>
          Conseils pratiques
        </h2>
        <div className="flex flex-col gap-2">
          {conseil.conseils.map((c, i) => (
            <ConseilCard key={i} text={c} index={i} />
          ))}
        </div>
      </div>

      {/* Conseil sol spécifique */}
      {sol && sol.id !== 'inconnu' && (
        <div
          className="mt-5 p-4 rounded-card"
          style={{ background: '#FAF8F3', border: '2px solid #FAC775' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: '#C27C12' }}>
            💡 Pour votre sol {sol.label.toLowerCase()}
          </p>
          <p className="text-sm" style={{ color: '#1A2010' }}>{sol.tips}</p>
        </div>
      )}
    </div>
  )
}
