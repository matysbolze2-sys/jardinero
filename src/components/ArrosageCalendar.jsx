import { triggerRipple } from '../utils/ripple'
import { useProfile } from '../hooks/useProfile'
import { useToast } from './Toast'
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
// Règle couleurs :
//   eau (besoin d'arroser, goutte)   → --jd-water / --jd-water-soft
//   validation (✓ arrosé)            → --jd-accent (lime)
//   navigation (label aujourd'hui)   → --jd-accent
//   pluie prévue                     → #93C5FD / #0D1520 (météo spécifique)

function JourDot({ jour, isToday, onArroser, pluiePrevue }) {
  const { wasWatered, needsWatering, label } = jour

  let bg        = 'transparent'
  let icon      = '·'
  let textColor = 'var(--jd-ink-muted)'
  let iconSize  = 16

  if (wasWatered) {
    bg = 'var(--jd-accent)'; icon = '✓'; textColor = 'var(--jd-accent-ink)'; iconSize = 13
  } else if (pluiePrevue && needsWatering) {
    bg = '#93C5FD'; icon = '🌧️'; textColor = '#0D1520'; iconSize = 13
  } else if (isToday && needsWatering) {
    bg = 'var(--jd-water)'; icon = '💧'; textColor = 'white'; iconSize = 13
  } else if (isToday) {
    bg = 'var(--jd-water-soft)'; icon = '·'; textColor = 'var(--jd-water)'; iconSize = 16
  } else if (needsWatering) {
    bg = 'var(--jd-water-soft)'; icon = '💧'; textColor = 'var(--jd-water)'; iconSize = 13
  }

  const canClick = isToday && needsWatering && !wasWatered && !pluiePrevue

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-xs"
        style={{
          color:      isToday ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
          fontWeight: isToday ? 700 : 400,
        }}
      >
        {label}
      </span>
      <button
        onClick={canClick ? onArroser : undefined}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale"
        style={{
          background: bg,
          color:      textColor,
          cursor:     canClick ? 'pointer' : 'default',
          border:     isToday ? '2px solid var(--jd-accent-ring)' : '2px solid transparent',
          fontSize:   iconSize,
          lineHeight: 1,
        }}
      >
        {icon}
      </button>
    </div>
  )
}

// ── MoistureBar ────────────────────────────────────────────────────────────────
// Barre de progression d'humidité basée sur le dernier arrosage.
// Pleine = vient d'être arrosé, vide = sec/en retard.

function MoistureBar({ plant, arrosages, frequence }) {
  const hist = [...(arrosages?.[plant.id] ?? [])].sort()
  const lastWatered = hist.at(-1)
  if (!lastWatered || frequence <= 0) return null

  const daysSince = Math.floor((Date.now() - new Date(lastWatered)) / 86400000)
  const pct       = Math.max(0, Math.min(100, Math.round((1 - daysSince / frequence) * 100)))

  return (
    <div
      style={{
        marginTop: 10,
        height: 3,
        borderRadius: 2,
        background: 'var(--jd-border)',
        overflow: 'hidden',
      }}
      title={`Humidité estimée : ${pct}%`}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 2,
          background: 'linear-gradient(90deg, var(--jd-water-ring), var(--jd-water))',
          transition: 'width 0.6s var(--jd-ease-out)',
        }}
      />
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

// ── LignePlante ────────────────────────────────────────────────────────────────

function LignePlante({ plant, frequence, status, stageMessage, arrosages, onArroser, aPluiePrevue, delay }) {
  const planning = getPlanning7Jours(plant.id, plant.plantedAt, arrosages, frequence)
  const etat     = getEtatArrosage(plant.id, plant.plantedAt, arrosages, frequence)
  const cfg      = ETAT_CONFIG[etat]
  const today    = planning[0]
  const arrosAuj = today.wasWatered
  const pluieAuj = aPluiePrevue(today.dateStr)

  return (
    <div
      className="rounded-card p-3 mb-3 page-enter"
      style={{
        background:      'var(--jd-surface)',
        border:          `1px solid ${arrosAuj ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
        animationDelay:  `${delay}ms`,
      }}
    >
      {/* En-tête plante */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{plant.emoji}</span>
          <div>
            <span className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>
              {plant.name}
            </span>
            {stageMessage && (
              <span className="block" style={{ fontSize: 10, color: 'var(--jd-ink-muted)', marginTop: 1 }}>
                {stageMessage}
              </span>
            )}
            <span className="block text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
              💧 {freqLabel(frequence, status)}
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

      {/* Barre d'humidité */}
      <MoistureBar plant={plant} arrosages={arrosages} frequence={frequence} />

      {/* Bannière pluie prévue */}
      {pluieAuj && !arrosAuj && (today.needsWatering || etat === 'due' || etat === 'overdue') && (
        <div
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-center"
          style={{ background: '#0D1520', color: '#93C5FD', border: '1px solid rgba(147,197,253,0.3)' }}
        >
          🌧️ Pluie prévue — pas besoin d&apos;arroser
        </div>
      )}

      {/* CTA arroser */}
      {!pluieAuj && (etat === 'due' || etat === 'overdue') && !arrosAuj && (
        <button
          onClick={e => { triggerRipple(e); onArroser(plant.id) }}
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all tap-scale"
          style={{
            background: 'var(--jd-water-soft)',
            color:      'var(--jd-water)',
            border:     '1px solid var(--jd-water-ring)',
            position:   'relative',
            overflow:   'hidden',
          }}
        >
          💧 Arroser maintenant
        </button>
      )}

      {/* Confirmation arrosé */}
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

function LigneDormante({ plant, delay }) {
  return (
    <div
      className="rounded-card p-3 mb-3 flex items-center gap-3 page-enter"
      style={{
        background:     'var(--jd-surface)',
        border:         '1px solid var(--jd-border)',
        opacity:        0.55,
        animationDelay: `${delay}ms`,
      }}
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
  const { toast }    = useToast()
  const plants       = profile.plants ?? []
  const arrosages    = profile.arrosages ?? {}
  const sol          = getSoilById(profile.soil)
  const regionOffset = getRegionById(profile.region)?.offset ?? 0
  const { aPluiePrevue } = useMeteo(profile.region)

  const handleArroser = async (plantId) => {
    const res = await marquerArrose(plantId)
    if (!res?.error) toast('💧 Arrosage enregistré')
  }

  if (plants.length === 0) return null

  return (
    <div className="mt-2">
      {/* En-tête section */}
      <div className="flex items-center justify-between mb-1">
        <h2
          className="font-display font-bold text-lg"
          style={{ color: 'var(--jd-water)' }}
        >
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

      {/* Cartes plantes avec cascade */}
      {plants.map((plant, i) => {
        const delay = i * 40 // --jd-stagger

        if (!shouldWaterToday(plant, regionOffset)) {
          return <LigneDormante key={plant.id} plant={plant} delay={delay} />
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
            onArroser={handleArroser}
            aPluiePrevue={aPluiePrevue}
            delay={delay}
          />
        )
      })}
    </div>
  )
}
