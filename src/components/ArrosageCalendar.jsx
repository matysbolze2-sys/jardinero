import { useProfile } from '../hooks/useProfile'
import { getSoilById } from '../data/soils'
import { useMeteo } from '../hooks/useMeteo'
import {
  getFrequencePlante,
  getPlanning7Jours,
  getEtatArrosage,
  ETAT_CONFIG,
} from '../utils/arrosageUtils'

// Point du planning hebdomadaire pour un jour donné
function JourDot({ jour, isToday, onArroser, pluiePrevue }) {
  const { wasWatered, needsWatering, label } = jour

  let bg = 'transparent'
  let icon = '·'
  let textColor = '#DDE8CC'

  if (wasWatered)                              { bg = '#97C459'; icon = '✓'; textColor = 'white' }
  else if (pluiePrevue && needsWatering)       { bg = '#93C5FD'; icon = '🌧️'; textColor = 'white' }
  else if (isToday && needsWatering)           { bg = '#E05A3A'; icon = '💧'; textColor = 'white' }
  else if (isToday)                            { bg = '#EAF3DE'; icon = '·'; textColor = '#3B6D11' }
  else if (needsWatering)                      { bg = '#DDE8CC'; icon = '💧'; textColor = '#6B7A5C' }

  const canClick = isToday && needsWatering && !wasWatered && !pluiePrevue

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs" style={{ color: isToday ? '#3B6D11' : '#6B7A5C', fontWeight: isToday ? 700 : 400 }}>
        {label}
      </span>
      <button
        onClick={canClick ? onArroser : undefined}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all"
        style={{
          background: bg,
          color: textColor,
          cursor: canClick ? 'pointer' : 'default',
          border: isToday ? '2px solid #97C459' : '2px solid transparent',
          fontSize: wasWatered || (needsWatering && !wasWatered) ? 13 : 16,
        }}
      >
        {icon}
      </button>
    </div>
  )
}

// Ligne d'une plante dans le calendrier d'arrosage
function LignePlante({ plant, frequence, arrosages, onArroser, aPluiePrevue }) {
  const planning  = getPlanning7Jours(plant.id, plant.plantedAt, arrosages, frequence)
  const etat      = getEtatArrosage(plant.id, plant.plantedAt, arrosages, frequence)
  const cfg       = ETAT_CONFIG[etat]
  const today     = planning[0]
  const arrosAuj  = today.wasWatered
  const pluieAuj  = aPluiePrevue(today.dateStr)

  return (
    <div
      className="rounded-card p-3 mb-3"
      style={{ background: 'white', border: `1px solid ${arrosAuj ? '#97C45955' : '#DDE8CC'}` }}
    >
      {/* En-tête plante + état */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{plant.emoji}</span>
          <div>
            <span className="font-semibold text-sm" style={{ color: '#1A2010' }}>{plant.name}</span>
            <span className="block text-xs" style={{ color: '#6B7A5C' }}>
              tous les {frequence} jour{frequence > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-chip"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.icon} {cfg.label}
        </span>
      </div>

      {/* Planning 7 jours */}
      <div className="flex justify-between">
        {planning.map((jour, i) => (
          <JourDot
            key={jour.dateStr}
            jour={jour}
            isToday={i === 0}
            pluiePrevue={aPluiePrevue(jour.dateStr)}
            onArroser={() => onArroser(plant.id)}
          />
        ))}
      </div>

      {/* Message pluie prévue aujourd'hui */}
      {pluieAuj && !arrosAuj && (today.needsWatering || etat === 'due' || etat === 'overdue') && (
        <div
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-center"
          style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD' }}
        >
          🌧️ Pluie prévue — pas besoin d&apos;arroser
        </div>
      )}

      {/* Bouton arroser si dû aujourd'hui et pas encore fait */}
      {!pluieAuj && (etat === 'due' || etat === 'overdue') && !arrosAuj && (
        <button
          onClick={() => onArroser(plant.id)}
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#EAF3DE', color: '#3B6D11', border: '1px solid #97C459' }}
        >
          💧 Arroser maintenant
        </button>
      )}
      {arrosAuj && (
        <div
          className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-center"
          style={{ background: '#EAF3DE', color: '#3B6D11' }}
        >
          ✓ Arrosé aujourd&apos;hui
        </div>
      )}
    </div>
  )
}

export default function ArrosageCalendar() {
  const { profile, marquerArrose } = useProfile()
  const plants    = profile.plants ?? []
  const arrosages = profile.arrosages ?? {}
  const sol       = getSoilById(profile.soil)
  const { aPluiePrevue } = useMeteo(profile.region)

  if (plants.length === 0) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-fraunces text-lg" style={{ color: '#3B6D11' }}>
          💧 Arrosage
        </h2>
        {sol && (
          <span className="text-xs" style={{ color: '#6B7A5C' }}>
            Sol {sol.label.toLowerCase()}
          </span>
        )}
      </div>
      <p className="text-xs mb-4" style={{ color: '#6B7A5C' }}>
        Fréquences adaptées à chaque plante · Touchez 💧 pour cocher · 🌧️ = pluie prévue
      </p>

      {plants.map(plant => {
        const frequence = getFrequencePlante(plant, profile.soil)
        return (
          <LignePlante
            key={plant.id}
            plant={plant}
            frequence={frequence}
            arrosages={arrosages}
            onArroser={marquerArrose}
            aPluiePrevue={aPluiePrevue}
          />
        )
      })}
    </div>
  )
}
