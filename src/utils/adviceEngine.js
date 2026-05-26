import { PLANT_ADVICE } from '../data/plantAdvice'
import { getEffectiveStatus } from './plantStatusUtils'

const SOIL_TIPS = {
  sableux:  "Sol sableux : arrose plus fréquemment et paille généreusement pour limiter l'évaporation.",
  argileux: "Sol argileux : évite de travailler le sol mouillé et aère régulièrement pour éviter la compaction.",
  humifere: "Sol humifère : très fertile, mais surveille l'acidité — amende à la chaux si nécessaire.",
}

const STAGE_PRIORITY = {
  ready:               0,
  flowering:           1,
  overdue:             1, // treated as urgent
  sowed:               2,
  growing:             3,
  perennial_producing: 4,
  perennial_growing:   5,
  perennial_longcycle: 6,
  perennial_dormant:   7,
}

export function getPersonalizedAdvice(plants, regionOffset = 0, soilId = 'inconnu') {
  const seen = new Set()
  const result = []

  for (const plant of plants) {
    if (seen.has(plant.plantId)) continue
    seen.add(plant.plantId)

    const stade    = getEffectiveStatus(plant, regionOffset)
    const advices  = PLANT_ADVICE[plant.plantId]?.[stade] ?? []
    const priority = STAGE_PRIORITY[stade] ?? 5

    let conseils = [...advices]

    // Soil-specific tip injected as last conseil for non-neutral soils
    const soilTip = SOIL_TIPS[soilId]
    if (soilTip && conseils.length > 0 && (stade === 'growing' || stade === 'perennial_growing')) {
      conseils = [...conseils, soilTip]
    }

    result.push({ plant, stade, conseils, priority })
  }

  result.sort((a, b) => a.priority - b.priority)
  return result
}

export function getEnrichedMonthlyAdvice(moisIdx, plants, regionOffset = 0) {
  const activeStades = new Set(
    plants.map(p => getEffectiveStatus(p, regionOffset))
  )

  const enrichments = []
  if (activeStades.has('ready')) {
    enrichments.push("🧺 Tu as des plantes prêtes à récolter — priorité à la récolte cette semaine.")
  }
  if (activeStades.has('sowed')) {
    enrichments.push("🌱 Des semis en cours — maintiens une humidité constante sans détremper.")
  }
  if (activeStades.has('flowering')) {
    enrichments.push("🌸 En période de floraison — évite les pesticides pour protéger les pollinisateurs.")
  }
  if (activeStades.has('perennial_dormant')) {
    enrichments.push("❄️ Certaines vivaces sont en repos — c'est le moment de diviser ou tailler.")
  }

  return enrichments
}
