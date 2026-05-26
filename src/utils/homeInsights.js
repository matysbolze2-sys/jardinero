import { PLANT_DURATIONS } from '../data/plantDurations'
import { getEffectiveStatus } from './plantStatusUtils'
import { getFrequencePlante, getEtatArrosage } from './arrosageUtils'

// ── Constants ──────────────────────────────────────────────────────────────────

const FROST_SENSITIVE = new Set([
  'tomate', 'tomate-cerise', 'basilic', 'courgette', 'concombre',
  'poivron', 'aubergine', 'melon', 'pasteque', 'haricot', 'mais-doux',
])

const STAGE_ACTIONS = {
  'tomate': {
    flowering: { action: "Ébourgeonner les gourmands", reason: "Concentre l'énergie sur les fruits" },
    growing:   { action: "Vérifier les tuteurs", reason: "La tige grossit rapidement" },
    ready:     { action: "Récolter avant surmaturité", reason: "La tomate se détache facilement" },
  },
  'tomate-cerise': {
    flowering: { action: "Ébourgeonner légèrement", reason: "Limite la végétation au profit des fruits" },
    ready:     { action: "Récolter régulièrement en grappe", reason: "Stimule la production continue" },
  },
  'courgette': {
    flowering: { action: "Polliniser si peu d'insectes", reason: "Passe une fleur mâle sur la fleur femelle" },
    ready:     { action: "Récolter petit (15-20 cm)", reason: "Stimule la production" },
  },
  'carotte': {
    growing: { action: "Éclaircir si serré", reason: "10 cm minimum entre chaque carotte" },
    ready:   { action: "Tester en arrachant une carotte", reason: "Goût et taille optimaux" },
  },
  'pomme-terre': {
    growing: { action: "Butter les plants", reason: "La tige fait maintenant ~20 cm" },
    ready:   { action: "Arracher après jaunissement des fanes", reason: "Signe de maturité" },
  },
  'poireau': {
    growing: { action: "Butter pour blanchir", reason: "Couvrir le bas de la tige de terre" },
  },
  'haricot': {
    flowering: { action: "Arroser sans mouiller le feuillage", reason: "Phase critique pour la nouaison" },
    ready:     { action: "Récolter avant durcissement des grains", reason: "Qualité optimale" },
  },
  'petits-pois': {
    flowering: { action: "Arroser régulièrement sans excès", reason: "Formation des gousses" },
    ready:     { action: "Récolter à bonne taille", reason: "Les pois deviennent farineux si trop mûrs" },
  },
  'salade': {
    ready: { action: "Récolter le matin", reason: "Plus fraîche et croquante à cette heure" },
  },
  'radis': {
    ready: { action: "Récolter maintenant", reason: "Risque de devenir creux après 30 jours" },
  },
  'concombre': {
    flowering: { action: "Pincer la tige principale", reason: "Favorise la ramification et la fructification" },
    ready:     { action: "Récolter régulièrement", reason: "Stimule la production de nouveaux fruits" },
  },
  'aubergine': {
    flowering: { action: "Limiter à 3-4 fruits par plant", reason: "Meilleure qualité de récolte" },
    ready:     { action: "Récolter brillant, avant le terne", reason: "Signe de maturité optimale" },
  },
  'poivron': {
    growing: { action: "Protéger du vent", reason: "Les jeunes plants sont fragiles" },
    ready:   { action: "Récolter vert ou attendre le rouge", reason: "Le rouge est plus doux et sucré" },
  },
  'basilic': {
    growing: { action: "Pincer les fleurs dès leur apparition", reason: "Maintient le feuillage savoureux" },
    ready:   { action: "Cueillir en pinçant les feuilles du haut", reason: "Stimule la ramification" },
  },
  'ail': {
    growing: { action: "Ne pas trop arroser", reason: "L'ail déteste les sols gorgés d'eau" },
    ready:   { action: "Arracher quand la moitié des feuilles est jaune", reason: "Signe de maturité" },
  },
  'oignon': {
    growing: { action: "Espacer à 15 cm si trop serré", reason: "Les bulbes ont besoin d'espace" },
    ready:   { action: "Arrêter l'arrosage", reason: "Le feuillage couché signale la maturité" },
  },
  'brocoli': {
    ready: { action: "Récolter avant floraison", reason: "Le brocoli monte vite en graine par chaleur" },
  },
  'melon': {
    growing: { action: "Pincer à 2 feuilles après les premières fleurs", reason: "Favorise la fructification" },
    ready:   { action: "Tester : la queue doit se détacher seule", reason: "Un melon mûr se détache tout seul" },
  },
  'potiron': {
    growing: { action: "Guider les tiges pour optimiser l'espace", reason: "Les courges envahissent vite" },
    ready:   { action: "Attendre que la queue se liège avant de couper", reason: "Signe que le potiron est bien mûr" },
  },
  'fraisier': {
    perennial_producing: { action: "Ramasser quotidiennement", reason: "Les fraises mûrissent vite par chaleur" },
  },
  'framboisier': {
    perennial_producing: { action: "Récolter 2-3 fois par semaine", reason: "Les framboises s'abîment rapidement" },
  },
  'groseillier': {
    perennial_producing: { action: "Récolter par grappes entières", reason: "Plus simple et moins traumatisant pour le plant" },
  },
  'asperge': {
    perennial_producing: { action: "Couper ras du sol chaque matin", reason: "La tige durcit très rapidement" },
  },
  'rhubarbe': {
    perennial_producing: { action: "Tirer les tiges latéralement, ne pas couper", reason: "Préserve le plant" },
  },
}

const PRIORITY = {
  water_urgent:    0,
  ready_harvest:   1,
  frost_risk:      2,
  stage_change:    3,
  germinating:     4,
  perennial_start: 5,
}

const STATUS_LABELS = {
  sowed:               'semis',
  growing:             'pousse',
  flowering:           'floraison',
  ready:               'récolte',
  perennial_dormant:   'repos hivernal',
  perennial_growing:   'végétation',
  perennial_producing: 'production',
  perennial_longcycle: 'développement',
}

// ── localStorage helpers ───────────────────────────────────────────────────────

const LAST_STATUS_KEY = 'jardinero_last_statuses'

function loadLastStatuses() {
  try { return JSON.parse(localStorage.getItem(LAST_STATUS_KEY) ?? '{}') }
  catch { return {} }
}

function saveLastStatuses(map) {
  try { localStorage.setItem(LAST_STATUS_KEY, JSON.stringify(map)) }
  catch {}
}

// ── getDailyAlerts ─────────────────────────────────────────────────────────────

// Returns sorted array of daily alerts (max 5).
// meteoAlerts: alertes[] from useMeteo — passed optionally for frost_risk detection.
export function getDailyAlerts(plants, arrosages, soilId, regionOffset, meteoAlerts = []) {
  if (!plants?.length) return []

  const today = new Date().toISOString().split('T')[0]
  const lastStatuses = loadLastStatuses()
  const nextStatuses = { ...lastStatuses }
  const alerts = []

  // ── water_urgent (consolidated) ────────────────────────────────────────────
  const aArroser = plants.filter(p => {
    const freq = getFrequencePlante(p, soilId)
    return ['due', 'overdue'].includes(getEtatArrosage(p.id, p.plantedAt, arrosages, freq))
  })
  if (aArroser.length > 0) {
    const overdue = aArroser.filter(p => {
      const freq = getFrequencePlante(p, soilId)
      return getEtatArrosage(p.id, p.plantedAt, arrosages, freq) === 'overdue'
    })
    const suffix = overdue.length > 0 ? ` (${overdue.length} en retard)` : ''
    const msg = aArroser.length === 1
      ? `${aArroser[0].name} à arroser${overdue.length > 0 ? ' — en retard !' : ''}`
      : `${aArroser.length} plantes à arroser${suffix}`
    alerts.push({ type: 'water_urgent', plants: aArroser, message: msg, priority: PRIORITY.water_urgent })
  }

  // ── ready_harvest (consolidated) ───────────────────────────────────────────
  const aRecolter = plants.filter(p => getEffectiveStatus(p, regionOffset) === 'ready')
  if (aRecolter.length > 0) {
    const msg = aRecolter.length === 1
      ? `${aRecolter[0].name} est prête à récolter !`
      : `${aRecolter.length} plantes prêtes à récolter !`
    alerts.push({ type: 'ready_harvest', plants: aRecolter, message: msg, priority: PRIORITY.ready_harvest })
  }

  // ── per-plant alerts ────────────────────────────────────────────────────────
  for (const plant of plants) {
    const status = getEffectiveStatus(plant, regionOffset)
    nextStatuses[plant.id] = { status, date: today }

    const d = PLANT_DURATIONS[plant.plantId]

    // germinating — sowed within daysToGrowing window
    if (status === 'sowed' && plant.plantedAt && d?.type !== 'perennial') {
      const days = Math.floor((Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000)
      if (days < (d?.daysToGrowing ?? 7)) {
        alerts.push({
          type: 'germinating',
          plant,
          message: `${plant.name} germe — maintiens le sol humide`,
          priority: PRIORITY.germinating,
        })
      }
    }

    // stage_change — status changed since yesterday's stored value
    const prev = lastStatuses[plant.id]
    if (prev && prev.date !== today && prev.status !== status) {
      alerts.push({
        type: 'stage_change',
        plant,
        message: `${plant.name} passe en phase "${STATUS_LABELS[status] ?? status}"`,
        newStatus: status,
        priority: PRIORITY.stage_change,
      })
    }

    // perennial_start — enters productionMonths this month (not last month)
    if (d?.type === 'perennial' && d.productionMonths) {
      const mois = new Date().getMonth()
      const prevMois = (mois - 1 + 12) % 12
      if (d.productionMonths.includes(mois) && !d.productionMonths.includes(prevMois)) {
        alerts.push({
          type: 'perennial_start',
          plant,
          message: `${plant.name} entre en production ce mois-ci`,
          priority: PRIORITY.perennial_start,
        })
      }
    }
  }

  // ── frost_risk ─────────────────────────────────────────────────────────────
  if (meteoAlerts.some(a => a.type === 'gel')) {
    const fragiles = plants.filter(p => FROST_SENSITIVE.has(p.plantId))
    if (fragiles.length > 0) {
      const names = fragiles.slice(0, 2).map(p => p.name).join(', ')
      const extra = fragiles.length > 2 ? ` +${fragiles.length - 2}` : ''
      alerts.push({
        type: 'frost_risk',
        plants: fragiles,
        message: `Risque de gel — protège ${names}${extra}`,
        priority: PRIORITY.frost_risk,
      })
    }
  }

  saveLastStatuses(nextStatuses)
  return alerts.sort((a, b) => a.priority - b.priority).slice(0, 5)
}

// ── getWeeklyActions ───────────────────────────────────────────────────────────

// Returns 0-6 recommended actions based on real plant stages.
export function getWeeklyActions(plants, regionOffset) {
  if (!plants?.length) return []

  const actions = []

  for (const plant of plants) {
    const status = getEffectiveStatus(plant, regionOffset)
    const specific = STAGE_ACTIONS[plant.plantId]?.[status]

    if (specific) {
      actions.push({
        plant,
        action:  specific.action,
        reason:  specific.reason,
        urgency: status === 'ready' ? 'high' : 'normal',
      })
    } else {
      const generic = genericAction(status)
      if (generic) actions.push({ plant, ...generic, urgency: status === 'ready' ? 'high' : 'normal' })
    }
  }

  return actions
    .sort((a, b) => (b.urgency === 'high' ? 1 : 0) - (a.urgency === 'high' ? 1 : 0))
    .slice(0, 6)
}

function genericAction(status) {
  switch (status) {
    case 'sowed':               return { action: 'Maintenir le sol humide', reason: 'Germination en cours — phase délicate' }
    case 'growing':             return { action: 'Arroser régulièrement', reason: 'Pleine croissance' }
    case 'flowering':           return { action: 'Arroser au pied sans mouiller les fleurs', reason: 'Floraison en cours' }
    case 'ready':               return { action: 'Récolter dès que possible', reason: 'À pleine maturité' }
    case 'perennial_producing': return { action: 'Surveiller et récolter', reason: 'En pleine production' }
    default:                    return null
  }
}

// ── getSeasonalContext ─────────────────────────────────────────────────────────

// Returns a one-line summary of the garden's current state for the hero banner.
export function getSeasonalContext(plants, regionOffset) {
  if (!plants?.length) return "Ton jardin est vide — ajoute tes premières plantes"

  const statuses  = plants.map(p => getEffectiveStatus(p, regionOffset))
  const ready     = statuses.filter(s => s === 'ready').length
  const flowering = statuses.filter(s => s === 'flowering').length
  const producing = statuses.filter(s => s === 'perennial_producing').length
  const growing   = statuses.filter(s => s === 'growing' || s === 'perennial_growing').length

  if (ready >= 2) return `${ready} plantes prêtes à récolter · ne tarde pas !`
  if (ready === 1) {
    const p = plants.find(p => getEffectiveStatus(p, regionOffset) === 'ready')
    return `${p?.name ?? 'Une plante'} est prête · ${plants.length} plante${plants.length > 1 ? 's' : ''} en cours`
  }
  if (flowering > 0) return `${flowering} en floraison${growing > 0 ? ` · ${growing} en croissance` : ''} · belle saison !`
  if (producing > 0) return `${producing} vivace${producing > 1 ? 's' : ''} en production · ${plants.length} plante${plants.length > 1 ? 's' : ''} au total`
  return `${plants.length} plante${plants.length > 1 ? 's' : ''} en cours · arrose régulièrement`
}
