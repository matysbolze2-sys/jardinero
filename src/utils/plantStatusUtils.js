import { PLANT_DURATIONS } from '../data/plantDurations'

// ── Labels ───────────────────────────────────────────────────────────────────

export const PERENNIAL_STATUT_LABELS = {
  perennial_dormant:   { label: 'En repos hivernal', color: '#6B9BA3' },
  perennial_growing:   { label: 'En végétation',     color: '#6db842' },
  perennial_producing: { label: 'En production',     color: '#a6e36b' },
  perennial_longcycle: { label: 'Première récolte',  color: '#f0b86c' },
}

// Includes both annual and perennial statuses, with a brighter growing color for dark backgrounds
export const ALL_STATUT_LABELS = {
  sowed:     { label: 'Semé',       color: '#97C459' },
  growing:   { label: 'En pousse',  color: '#6db842' },
  flowering: { label: 'En fleurs',  color: '#FAC775' },
  ready:     { label: 'À récolter', color: '#E05A3A' },
  ...PERENNIAL_STATUT_LABELS,
}

// ── Contextual flowering messages ─────────────────────────────────────────────

const FLOWERING_MESSAGES = {
  'tomate':      'Floraison — retire les gourmands, arrose au pied',
  'poivron':     'Floraison — retire les gourmands, arrose au pied',
  'aubergine':   'Floraison — retire les gourmands, arrose au pied',
  'courgette':   "Floraison — pollinise manuellement si peu d'insectes",
  'concombre':   "Floraison — pollinise manuellement si peu d'insectes",
  'haricot':     'Floraison — ne touche plus au sol maintenant',
  'petits-pois': 'Floraison — ne touche plus au sol maintenant',
}

// ── Annual status computation ─────────────────────────────────────────────────

export function computeAnnualStatus(plant, regionOffset = 0) {
  const d = PLANT_DURATIONS[plant.plantId]
  if (!d || d.type === 'perennial') return plant.status ?? 'sowed'
  if (!plant.plantedAt) return plant.status ?? 'sowed'

  const daysSincePlanted = Math.max(0, Math.floor(
    (Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000
  ))

  // Non-linear regional offset: warmer regions advance thresholds, colder regions delay them
  const offsetDays = Math.round(regionOffset * 7 * (1.0 + regionOffset * 0.05))
  const adj = (base) => (base ?? 0) + offsetDays

  const toGrowing   = adj(d.daysToGrowing  ?? 7)
  const toFlowering = d.daysToFlowering != null ? adj(d.daysToFlowering) : null
  const toReady     = adj(d.daysToReady   ?? (d.daysToHarvest ?? 90) - 10)

  if (daysSincePlanted < toGrowing) return 'sowed'

  if (d.hasFlowering && toFlowering !== null) {
    if (daysSincePlanted < toFlowering) return 'growing'
    if (daysSincePlanted < toReady)     return 'flowering'
  } else {
    if (daysSincePlanted < toReady) return 'growing'
  }

  return 'ready'
}

// ── Perennial status computation ──────────────────────────────────────────────

export function computePerennialStatus(plant) {
  const d = PLANT_DURATIONS[plant.plantId]
  if (!d || d.type !== 'perennial') return 'perennial_growing'

  // Long-cycle: check if first harvest year hasn't been reached yet
  if (d.longCycle && plant.plantedAt) {
    const yearsSincePlanted =
      (Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / (365.25 * 86400000)
    if (yearsSincePlanted < (d.firstHarvestYears ?? 0)) return 'perennial_longcycle'
  }

  const mois = new Date().getMonth()
  if (d.dormancyMonths?.includes(mois))  return 'perennial_dormant'
  if (d.productionMonths?.includes(mois)) return 'perennial_producing'
  return 'perennial_growing'
}

// ── Main entry point ──────────────────────────────────────────────────────────

// Returns the effective status, respecting manual override if set
export function getEffectiveStatus(plant, regionOffset = 0) {
  if (plant.statusOverride != null) return plant.statusOverride

  const d = PLANT_DURATIONS[plant.plantId]
  if (!d) return plant.status ?? 'sowed'
  if (d.type === 'perennial') return computePerennialStatus(plant)
  return computeAnnualStatus(plant, regionOffset)
}

// ── Cycle progress (annuals only) ─────────────────────────────────────────────

// Returns 0–100. Returns 0 for perennials or plants with no duration data.
export function getCycleProgress(plant, regionOffset = 0) {
  const d = PLANT_DURATIONS[plant.plantId]
  if (!d || d.type === 'perennial' || !plant.plantedAt) return 0

  const daysSincePlanted = Math.max(0, Math.floor(
    (Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000
  ))
  const offsetDays  = Math.round(regionOffset * 7 * (1.0 + regionOffset * 0.05))
  const totalCycle  = (d.daysToHarvest ?? 90) + (d.harvestWindow ?? 30) + offsetDays

  return Math.min(100, Math.round((daysSincePlanted / Math.max(1, totalCycle)) * 100))
}

// ── Stage message ─────────────────────────────────────────────────────────────

export function getStageMessage(plant, regionOffset = 0) {
  const status = getEffectiveStatus(plant, regionOffset)
  const d = PLANT_DURATIONS[plant.plantId]

  switch (status) {
    case 'sowed':     return 'Germination en cours — maintiens le sol humide'
    case 'growing':   return 'En pleine croissance — arrose régulièrement'
    case 'flowering': return FLOWERING_MESSAGES[plant.plantId] ?? 'Floraison en cours — arrose régulièrement'
    case 'ready':     return 'Prêt à récolter !'
    case 'perennial_dormant':   return 'En repos hivernal'
    case 'perennial_growing':   return 'En végétation'
    case 'perennial_producing': return 'En production'
    case 'perennial_longcycle': {
      if (d?.firstHarvestYears && plant.plantedAt) {
        const planted = new Date(plant.plantedAt + 'T12:00:00')
        const target  = new Date(planted)
        target.setFullYear(target.getFullYear() + Math.ceil(d.firstHarvestYears))
        const months = Math.max(0, Math.round((target - Date.now()) / (30 * 86400000)))
        return months <= 0
          ? 'Première récolte imminente !'
          : `Première récolte estimée dans ${months} mois`
      }
      return 'Première récolte dans quelques années'
    }
    default: return ''
  }
}
