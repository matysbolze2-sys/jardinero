// Durées réalistes par plante — utilisées pour calculer les dates estimées à l'ajout
// daysToHarvest : jours depuis la plantation jusqu'au début de la récolte
// harvestWindow  : durée de la fenêtre de récolte (jours)
// wateringFrequency : fréquence de base par saison (jours entre deux arrosages)

export const PLANT_DURATIONS = {
  'tomate':      { daysToHarvest: 90,  harvestWindow: 60, wateringFrequency: { ete: 2, printemps: 3, automne: 4 } },
  'courgette':   { daysToHarvest: 55,  harvestWindow: 45, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'carotte':     { daysToHarvest: 75,  harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 5 } },
  'salade':      { daysToHarvest: 45,  harvestWindow: 14, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'haricot':     { daysToHarvest: 60,  harvestWindow: 21, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'poireau':     { daysToHarvest: 150, harvestWindow: 60, wateringFrequency: { ete: 3, printemps: 5, automne: 6 } },
  'radis':       { daysToHarvest: 28,  harvestWindow: 10, wateringFrequency: { ete: 1, printemps: 2, automne: 2 } },
  'pomme-terre': { daysToHarvest: 100, harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 5 } },
  'poivron':     { daysToHarvest: 90,  harvestWindow: 45, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'concombre':   { daysToHarvest: 55,  harvestWindow: 30, wateringFrequency: { ete: 1, printemps: 2, automne: 2 } },
  'oignon':      { daysToHarvest: 120, harvestWindow: 30, wateringFrequency: { ete: 4, printemps: 5, automne: 6 } },
  'epinard':     { daysToHarvest: 45,  harvestWindow: 21, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'aubergine':   { daysToHarvest: 80,  harvestWindow: 45, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'brocoli':     { daysToHarvest: 80,  harvestWindow: 14, wateringFrequency: { ete: 2, printemps: 3, automne: 4 } },
  'basilic':     { daysToHarvest: 30,  harvestWindow: 90, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'fraise':      { daysToHarvest: 60,  harvestWindow: 30, wateringFrequency: { ete: 2, printemps: 3, automne: 4 } },
  'figuier':     { daysToHarvest: 730, harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 5, automne: 6 } },
  'chou':        { daysToHarvest: 90,  harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
  'navet':       { daysToHarvest: 60,  harvestWindow: 21, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
  'betterave':   { daysToHarvest: 70,  harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
  'potiron':     { daysToHarvest: 100, harvestWindow: 21, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
  'persil':      { daysToHarvest: 40,  harvestWindow: 120, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'thym':        { daysToHarvest: 60,  harvestWindow: 180, wateringFrequency: { ete: 7, printemps: 10, automne: 12 } },
  'ciboulette':  { daysToHarvest: 30,  harvestWindow: 180, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
  'menthe':      { daysToHarvest: 30,  harvestWindow: 150, wateringFrequency: { ete: 2, printemps: 3, automne: 3 } },
  'framboise':   { daysToHarvest: 365, harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 5 } },
  'cerisier':    { daysToHarvest: 365, harvestWindow: 21, wateringFrequency: { ete: 5, printemps: 7, automne: 8 } },
  'ail':         { daysToHarvest: 210, harvestWindow: 14, wateringFrequency: { ete: 5, printemps: 7, automne: 8 } },
  'courge':      { daysToHarvest: 90,  harvestWindow: 30, wateringFrequency: { ete: 3, printemps: 4, automne: 4 } },
}

const MOIS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

function getSaison(moisIdx) {
  if (moisIdx >= 5 && moisIdx <= 7) return 'ete'
  if (moisIdx >= 8 && moisIdx <= 10) return 'automne'
  return 'printemps'
}

// Calcule les dates clés d'une plante à partir de sa date de plantation
export function calculatePlantDates(plantId, plantedAt, regionOffset = 0) {
  const durations = PLANT_DURATIONS[plantId]
  if (!durations || !plantedAt) return {}

  const planted = new Date(plantedAt + 'T12:00:00')
  const offsetDays = regionOffset * 7

  const harvestStart = new Date(planted)
  harvestStart.setDate(harvestStart.getDate() + durations.daysToHarvest + offsetDays)

  const harvestEnd = new Date(harvestStart)
  harvestEnd.setDate(harvestEnd.getDate() + durations.harvestWindow)

  const seasonEnd = new Date(harvestEnd)
  seasonEnd.setDate(seasonEnd.getDate() + 30)

  return {
    estimatedHarvestStart: harvestStart.toISOString().split('T')[0],
    estimatedHarvestEnd:   harvestEnd.toISOString().split('T')[0],
    seasonEnd:             seasonEnd.toISOString().split('T')[0],
  }
}

// Formatte une date ISO en texte français court ("début août", "mi-septembre")
export function formatDateFRShort(dateStr) {
  if (!dateStr) return '–'
  const d = new Date(dateStr + 'T12:00:00')
  const mois = MOIS_FR[d.getMonth()]
  const jour = d.getDate()
  if (jour <= 10)  return `début ${mois}`
  if (jour <= 20)  return `mi-${mois}`
  return `fin ${mois}`
}

// Retourne la saison actuelle et la fréquence d'arrosage pour une plante
export function getWateringFrequencyForPlant(plantId) {
  const durations = PLANT_DURATIONS[plantId]
  if (!durations) return 3
  const saison = getSaison(new Date().getMonth())
  return durations.wateringFrequency[saison] ?? 3
}
