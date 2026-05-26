// Durées et cycles par plante — source de vérité pour les calculs de dates et d'arrosage
// Annuelles : daysToHarvest, harvestWindow, daysToGrowing, daysToFlowering, daysToReady, hasFlowering
// Vivaces   : productionMonths, dormancyMonths, longCycle, firstHarvestYears

export const PLANT_DURATIONS = {

  // ── Annuelles ───────────────────────────────────────────────────────────────

  'tomate': {
    daysToHarvest: 90, harvestWindow: 60,
    daysToGrowing: 12, daysToFlowering: 65, daysToReady: 80, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'courgette': {
    daysToHarvest: 55, harvestWindow: 45,
    daysToGrowing: 8, daysToFlowering: 35, daysToReady: 48, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'carotte': {
    daysToHarvest: 75, harvestWindow: 30,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 65, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },
  'salade': {
    daysToHarvest: 45, harvestWindow: 14,
    daysToGrowing: 6, daysToFlowering: null, daysToReady: 38, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'haricot': {
    daysToHarvest: 60, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: 40, daysToReady: 52, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'poireau': {
    daysToHarvest: 150, harvestWindow: 60,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 130, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 5, automne: 6 },
  },
  'radis': {
    daysToHarvest: 28, harvestWindow: 10,
    daysToGrowing: 4, daysToFlowering: null, daysToReady: 22, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 1, printemps: 2, automne: 2 },
  },
  'pomme-terre': {
    daysToHarvest: 100, harvestWindow: 30,
    daysToGrowing: 20, daysToFlowering: null, daysToReady: 90, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },
  'poivron': {
    daysToHarvest: 90, harvestWindow: 45,
    daysToGrowing: 14, daysToFlowering: 65, daysToReady: 80, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'concombre': {
    daysToHarvest: 55, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: 38, daysToReady: 48, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 1, printemps: 2, automne: 2 },
  },
  'oignon': {
    daysToHarvest: 120, harvestWindow: 30,
    daysToGrowing: 12, daysToFlowering: null, daysToReady: 105, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'epinard': {
    daysToHarvest: 45, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 38, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'aubergine': {
    daysToHarvest: 80, harvestWindow: 45,
    daysToGrowing: 14, daysToFlowering: 55, daysToReady: 70, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'brocoli': {
    daysToHarvest: 80, harvestWindow: 14,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 70, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'chou': {
    daysToHarvest: 90, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 80, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'navet': {
    daysToHarvest: 60, harvestWindow: 21,
    daysToGrowing: 6, daysToFlowering: null, daysToReady: 52, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'betterave': {
    daysToHarvest: 70, harvestWindow: 30,
    daysToGrowing: 10, daysToFlowering: null, daysToReady: 60, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'potiron': {
    daysToHarvest: 100, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 85, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'fenouil': {
    daysToHarvest: 80, harvestWindow: 21,
    daysToGrowing: 10, daysToFlowering: null, daysToReady: 70, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'basilic': {
    daysToHarvest: 30, harvestWindow: 90,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 25, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'persil': {
    daysToHarvest: 40, harvestWindow: 120,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 35, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'ciboulette': {
    daysToHarvest: 30, harvestWindow: 180,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 80, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'menthe': {
    daysToHarvest: 30, harvestWindow: 150,
    daysToGrowing: 10, daysToFlowering: null, daysToReady: 25, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'fraise': {
    daysToHarvest: 60, harvestWindow: 30,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 50, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'courge': {
    daysToHarvest: 90, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 80, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  // Legacy entry — kept for backward compat (use 'framboisier' for the perennial)
  'framboise': {
    daysToHarvest: 365, harvestWindow: 30,
    type: 'perennial',
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },

  // ── Nouvelles annuelles ─────────────────────────────────────────────────────

  'ail': {
    daysToHarvest: 210, harvestWindow: 14,
    daysToGrowing: 30, daysToFlowering: null, daysToReady: 195, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 6, printemps: 8, automne: 10 },
  },
  'roquette': {
    daysToHarvest: 30, harvestWindow: 30,
    daysToGrowing: 4, daysToFlowering: null, daysToReady: 25, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 1, printemps: 2, automne: 2 },
  },
  'mache': {
    daysToHarvest: 60, harvestWindow: 45,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 52, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'chou-fleur': {
    daysToHarvest: 90, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 80, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'chou-bruxelles': {
    daysToHarvest: 130, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 115, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'chou-rouge': {
    daysToHarvest: 90, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 80, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'potimarron': {
    daysToHarvest: 100, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 88, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'butternut': {
    daysToHarvest: 100, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 88, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'mais-doux': {
    daysToHarvest: 90, harvestWindow: 14,
    daysToGrowing: 8, daysToFlowering: 70, daysToReady: 82, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'celeri-branche': {
    daysToHarvest: 120, harvestWindow: 30,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 108, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'celeri-rave': {
    daysToHarvest: 150, harvestWindow: 30,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 135, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'bette': {
    daysToHarvest: 60, harvestWindow: 60,
    daysToGrowing: 10, daysToFlowering: null, daysToReady: 52, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'feve': {
    daysToHarvest: 90, harvestWindow: 21,
    daysToGrowing: 10, daysToFlowering: 75, daysToReady: 82, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 3, printemps: 4, automne: 4 },
  },
  'cerfeuil': {
    daysToHarvest: 45, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 38, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'coriandre': {
    daysToHarvest: 35, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 28, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'aneth': {
    daysToHarvest: 40, harvestWindow: 30,
    daysToGrowing: 8, daysToFlowering: null, daysToReady: 33, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'panais': {
    daysToHarvest: 120, harvestWindow: 30,
    daysToGrowing: 14, daysToFlowering: null, daysToReady: 108, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'scarole': {
    daysToHarvest: 75, harvestWindow: 21,
    daysToGrowing: 6, daysToFlowering: null, daysToReady: 65, hasFlowering: false,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'melon': {
    daysToHarvest: 85, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: 65, daysToReady: 78, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'pasteque': {
    daysToHarvest: 90, harvestWindow: 14,
    daysToGrowing: 10, daysToFlowering: 75, daysToReady: 83, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },
  'petits-pois': {
    daysToHarvest: 65, harvestWindow: 21,
    daysToGrowing: 8, daysToFlowering: 55, daysToReady: 58, hasFlowering: true,
    type: 'annual',
    wateringFrequency: { ete: 2, printemps: 3, automne: 3 },
  },

  // ── Vivaces ─────────────────────────────────────────────────────────────────

  'fraisier': {
    type: 'perennial',
    productionMonths: [4, 5, 6, 7],
    dormancyMonths:   [11, 0, 1],
    longCycle: false,
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'framboisier': {
    type: 'perennial',
    productionMonths: [6, 7, 8],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },
  'groseillier': {
    type: 'perennial',
    productionMonths: [6, 7],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'cassissier': {
    type: 'perennial',
    productionMonths: [6, 7],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'myrtillier': {
    type: 'perennial',
    productionMonths: [6, 7, 8],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },
  'asperge': {
    type: 'perennial',
    productionMonths: [3, 4, 5],
    dormancyMonths:   [10, 11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 3,
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'artichaut': {
    type: 'perennial',
    productionMonths: [6, 7, 8, 9],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 1.5,
    wateringFrequency: { ete: 2, printemps: 3, automne: 4 },
  },
  'rhubarbe': {
    type: 'perennial',
    productionMonths: [4, 5, 6, 7],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 3, printemps: 5, automne: 6 },
  },
  'thym': {
    type: 'perennial',
    productionMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dormancyMonths:   [],
    longCycle: false,
    wateringFrequency: { ete: 7, printemps: 10, automne: 12 },
  },
  'romarin': {
    type: 'perennial',
    productionMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dormancyMonths:   [],
    longCycle: false,
    wateringFrequency: { ete: 12, printemps: 14, automne: 16 },
  },
  'sauge': {
    type: 'perennial',
    productionMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dormancyMonths:   [],
    longCycle: false,
    wateringFrequency: { ete: 7, printemps: 10, automne: 12 },
  },
  'origan': {
    type: 'perennial',
    productionMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dormancyMonths:   [],
    longCycle: false,
    wateringFrequency: { ete: 7, printemps: 10, automne: 12 },
  },
  'lavande': {
    type: 'perennial',
    productionMonths: [5, 6, 7],
    dormancyMonths:   [],
    longCycle: false,
    wateringFrequency: { ete: 14, printemps: 14, automne: 16 },
  },
  'estragon': {
    type: 'perennial',
    productionMonths: [3, 4, 5, 6, 7, 8, 9],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 4, printemps: 5, automne: 6 },
  },
  'melisse': {
    type: 'perennial',
    productionMonths: [3, 4, 5, 6, 7, 8, 9],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: false,
    wateringFrequency: { ete: 3, printemps: 4, automne: 5 },
  },
  'pommier': {
    type: 'perennial',
    productionMonths: [8, 9, 10],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 10, printemps: 12, automne: 14 },
  },
  'poirier': {
    type: 'perennial',
    productionMonths: [8, 9, 10],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 10, printemps: 12, automne: 14 },
  },
  'cerisier': {
    type: 'perennial',
    productionMonths: [5, 6],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 5, printemps: 7, automne: 8 },
  },
  'prunier': {
    type: 'perennial',
    productionMonths: [7, 8, 9],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 10, printemps: 12, automne: 14 },
  },
  'figuier': {
    type: 'perennial',
    productionMonths: [8, 9, 10],
    dormancyMonths:   [11, 0, 1],
    longCycle: true, firstHarvestYears: 3,
    wateringFrequency: { ete: 3, printemps: 5, automne: 6 },
  },
  'abricotier': {
    type: 'perennial',
    productionMonths: [6, 7],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 8, printemps: 10, automne: 12 },
  },
  'citronnier': {
    type: 'perennial',
    productionMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dormancyMonths:   [],
    longCycle: true, firstHarvestYears: 3,
    wateringFrequency: { ete: 5, printemps: 7, automne: 8 },
  },
  'olivier': {
    type: 'perennial',
    productionMonths: [10, 11],
    dormancyMonths:   [],
    longCycle: true, firstHarvestYears: 5,
    wateringFrequency: { ete: 14, printemps: 16, automne: 18 },
  },
  'cognassier': {
    type: 'perennial',
    productionMonths: [9, 10, 11],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 10, printemps: 12, automne: 14 },
  },
  'pecher': {
    type: 'perennial',
    productionMonths: [7, 8],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 8, printemps: 10, automne: 12 },
  },
  'noisetier': {
    type: 'perennial',
    productionMonths: [9, 10],
    dormancyMonths:   [11, 0, 1, 2],
    longCycle: true, firstHarvestYears: 4,
    wateringFrequency: { ete: 10, printemps: 12, automne: 14 },
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const MOIS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

function getSaison(moisIdx) {
  if (moisIdx >= 5 && moisIdx <= 7) return 'ete'
  if (moisIdx >= 8 && moisIdx <= 10) return 'automne'
  return 'printemps'
}

export function calculatePlantDates(plantId, plantedAt, regionOffset = 0) {
  const durations = PLANT_DURATIONS[plantId]
  if (!durations || !plantedAt || durations.type === 'perennial') return {}

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

export function formatDateFRShort(dateStr) {
  if (!dateStr) return '–'
  const d = new Date(dateStr + 'T12:00:00')
  const mois = MOIS_FR[d.getMonth()]
  const jour = d.getDate()
  if (jour <= 10) return `début ${mois}`
  if (jour <= 20) return `mi-${mois}`
  return `fin ${mois}`
}

export function getWateringFrequencyForPlant(plantId) {
  const durations = PLANT_DURATIONS[plantId]
  if (!durations) return 3
  const saison = getSaison(new Date().getMonth())
  return durations.wateringFrequency?.[saison] ?? 3
}
