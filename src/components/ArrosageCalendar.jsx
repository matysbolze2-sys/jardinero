import { useProfile } from '../hooks/useProfile'
import { getSoilById } from '../data/soils'
import { getRegionById } from '../data/regions'
import { useMeteo } from '../hooks/useMeteo'
import { getEffectiveStatus, getStageMessage } from '../utils/plantStatusUtils'
import {
  getFrequencePlante,
  getPlanning7Jours,
  getEtatArrosage,
  shouldWaterToday,
  ETAT_CONFIG,
} from '../utils/arrosageUtils'

// ── JourDot ────────────────────────────────────────────────────────────────────

function JourDot({ jour, isToday, onArroser, pluiePrevue }) {
  const { wasWatered, needsWatering, label } = jour

  let bg        = 'var(--jd-accent-soft)'
  let icon      = '·'
  let textColor = 'var(--jd-ink-muted)'

  if (wasWatered)                        { bg = 'var(--jd-accent)';      icon = '✓';   textColor = 'var(--jd-accent-ink)' }
  else if (pluiePrevue && needsWatering) { bg = '#93C5FD';               icon = '🌧️'; textColor = '#0D1520' }
  else if (isToday && needsWatering)     { bg = 'var(--jd-harvest)';     icon = '💧'; textColor = 'white'                }
  else if (isToday)                      { bg = 'var(--jd-accent-soft)'; icon = '·';   textColor = 'var(--jd-accent)'    }
  else if (needsWatering)                { bg = 'var(--jd-accent-soft)'; icon = '💧'; textColor = 'var(--jd-ink-muted)' }

  const canClick = isToday && needsWatering && !wasWatered && !pluiePrevue

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs" style={{ color: isToday ? 'var(--jd-accent)' : 'var(--jd-ink-muted)', fontWeight: isToday ? 700 : 400 }}>
        {label}
      </span>
      <button
        onClick={canClick ? onArroser : undefined}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all"
        style={{
          background: bg,
          color:      textColor,
          cursor:     canClick ? 'pointer' : 'default',
          border:     isToday ? '2px solid var(--jd-accent)' : '2px solid transparent',
          fontSize:   wasWatered || (needsWatering && !wasWatered) ? 13 : 16,
        }}
      >
        {icon}
      </button>
    </div>
  )
}

// ── Frequency label ────────────────────────────────────────────────────────────

function freqLabel(frequence, status) {
  const ctx = {
    perennial_producing: ' (production)',
    perennial_growing:   ' (végétation)',
  }[status] ?? ''
  return `tous les ${frequence} jour${frequence > 1 ? 's' : ''}${ctx}`
}

// ── LignePlante (active) ───────────────────────────────────────────────────────

function LignePlante({ plant, frequence, status, stageMessage, arrosages, onArroser, aPluiePrevue }) {
  const planning = getPlanning7Jours(plant.id, plant.plantedAt, arrosages, frequence)
  const etat     = getEtatArrosage(plant.id, plant.plantedAt, arrosages, frequence)
  const cfg      = ETAT_CONFIG[etat]
  const today    = planning[0]
  const arrosAuj = today.wasWatered
  const pluieAuj = aPluiePrevue(today.dateStr)

  return (
    <div
      className="rounded-card p-3 mb-3"
      style={{ background: 'var(--jd-surface)', border: `1px solid ${arrosAuj ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{plant.emoji}</span>
          <div>
            <span className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>{plant.name}</span>
            {stageMessage && (
              <span className="block" style={{ fontSize: 10, color: 'var(--jd-ink-muted)', marginTop: 1 }}>
                {stageMessage}
              </span>
            )}
            <span className="block text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
              {freqLabel(frequence, status)}
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

      {pluieAuj && !arrosAuj && (today.needsWatering || etat === 'due' || etat === 'overdue') && (
        <div
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-center"
          style={{ background: '#0D1520', color: '#93C5FD', border: '1px solid rgba(147,197,253,0.3)' }}
        >
          🌧️ Pluie prévue — pas besoin d&apos;arroser
        </div>
      )}

      {!pluieAuj && (etat === 'due' || etat === 'overdue') && !arrosAuj && (
        <button
          onClick={() => onArroser(plant.id)}
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', border: '1px solid var(--jd-accent-ring)' }}
        >
          💧 Arroser maintenant
        </button>
      )}
      {arrosAuj && (
        <div
          className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-center"
          style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)' }}
        >
          ✓ Arrosé aujourd&apos;hui
        </div>
      )}
    </div>
  )
}

// ── LigneDormante ──────────────────────────────────────────────────────────────

function LigneDormante({ plant }) {
  return (
    <div
      className="rounded-card p-3 mb-3 flex items-center gap-3"
      style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)', opacity: 0.6 }}
    >
      <span className="text-xl leading-none" style={{ filter: 'grayscale(1)' }}>{plant.emoji}</span>
      <div>
        <span className="font-semibold text-sm" style={{ color: 'var(--jd-ink-muted)' }}>{plant.name}</span>
        <span className="block text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>
          ❄️ En repos hivernal — arrosage suspendu
        </span>
      </div>
    </div>
  )
}

// ── ArrosageCalendar ───────────────────────────────────────────────────────────

export default function ArrosageCalendar() {
  const { profile, marquerArrose } = useProfile()
  const plants       = profile.plants ?? []
  const arrosages    = profile.arrosages ?? {}
  const sol          = getSoilById(profile.soil)
  const regionOffset = getRegionById(profile.region)?.offset ?? 0
  const { aPluiePrevue } = useMeteo(profile.region)

  if (plants.length === 0) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-bold text-lg" style={{ color: 'var(--jd-accent)' }}>
          💧 Arrosage
        </h2>
        {sol && (
          <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            Sol {sol.label.toLowerCase()}
          </span>
        )}
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--jd-ink-muted)' }}>
        Fréquences adaptées à chaque plante · Touchez 💧 pour cocher · 🌧️ = pluie prévue
      </p>

      {plants.map(plant => {
        if (!shouldWaterToday(plant, regionOffset)) {
          return <LigneDormante key={plant.id} plant={plant} />
        }

        const status       = getEffectiveStatus(plant, regionOffset)
        const stageMessage = getStageMessage(plant, regionOffset)
        const frequence    = getFrequencePlante(plant, profile.soil, regionOffset)

        return (
          <LignePlante
            key={plant.id}
            plant={plant}
            frequence={frequence}
            status={status}
            stageMessage={stageMessage}
            arrosages={arrosages}
            onArroser={marquerArrose}
            aPluiePrevue={aPluiePrevue}
          />
        )
      })}
    </div>
  )
}
