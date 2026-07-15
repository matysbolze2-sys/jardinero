import { PLANTS } from '../data/plants'
import { PLANTS_BY_CATEGORY } from '../data/plantsExtended'
import { getEffectiveStatus } from './plantStatusUtils'
import { PALETTE } from '../styles/palette'

// ─── Multiplicateurs sol ───────────────────────────────────────────────────────
// Ajustent la fréquence de base selon la capacité de rétention du sol.
// > 1 = on attend plus longtemps (sol retient l'eau)
// < 1 = on arrose plus souvent (sol draine vite)
const MULTIPLICATEUR_SOL = {
  argileux: 1.4,  // Lourd, retient longtemps → on attend
  sableux:  0.65, // Drainant, se dessèche vite → on arrose souvent
  limoneux: 1.0,  // Référence équilibrée
  humifere: 1.2,  // Riche en matière organique, retient bien
  inconnu:  1.0,
}

// ─── Multiplicateurs saison ───────────────────────────────────────────────────
// La chaleur et l'évapotranspiration augmentent les besoins en été.
function getMultiplicateurSaison() {
  const m = new Date().getMonth()
  if (m >= 5 && m <= 7)  return 0.65 // Été (juin-août) : chaleur, évaporation → plus souvent
  if (m >= 8 && m <= 10) return 1.3  // Automne (sep-nov) : fraîcheur → moins souvent
  if (m === 11 || m <= 1) return 2.0 // Hiver (déc-fév) : quasi-dormance → très peu
  return 1.0                          // Printemps (mar-mai) : référence
}

// ─── Recherche des waterDays d'une plante ────────────────────────────────────
// Cherche dans PLANTS, puis dans PLANTS_BY_CATEGORY, sinon retourne 3j par défaut.
function getWaterDays(plantId) {
  if (!plantId) return 3
  const fromBase = PLANTS.find(p => p.id === plantId)
  if (fromBase?.waterDays) return fromBase.waterDays
  for (const list of Object.values(PLANTS_BY_CATEGORY)) {
    const found = list.find(p => p.id === plantId)
    if (found?.waterDays) return found.waterDays
  }
  return 3
}

// ─── Facteur « culture en pot » ───────────────────────────────────────────────
// Les pots ont un faible volume de substrat et sèchent plus vite que la pleine
// terre → on raccourcit l'intervalle entre deux arrosages.
const CONTAINER_FACTOR = 0.6

// ─── Multiplicateurs par stade ────────────────────────────────────────────────
const STAGE_MULT = {
  sowed:               0.7,  // germination → arrosage plus fréquent
  growing:             1.0,  // référence
  flowering:           0.85, // floraison → un peu plus souvent
  ready:               1.2,  // prêt à récolter → on peut ralentir
  perennial_dormant:   3.0,  // quasi rien
  perennial_growing:   1.0,
  perennial_producing: 0.85,
  perennial_longcycle: 1.0,
}

// ─── Fréquence par plante ─────────────────────────────────────────────────────
// Combine waterDays × sol × saison × stade.
// C'est la fonction principale à utiliser dans les composants.
export function getFrequencePlante(gardenPlant, soilId, regionOffset = 0) {
  if (!gardenPlant) return 3
  const waterDays  = getWaterDays(gardenPlant.plantId)
  const solMult    = MULTIPLICATEUR_SOL[soilId] ?? 1.0
  const saisonMult = getMultiplicateurSaison()
  const status     = getEffectiveStatus(gardenPlant, regionOffset)
  const stageMult  = STAGE_MULT[status] ?? 1.0
  const potMult    = gardenPlant.container ? CONTAINER_FACTOR : 1.0
  return Math.max(1, Math.round(waterDays * solMult * saisonMult * stageMult * potMult))
}

// ─── Suspension d'arrosage ───────────────────────────────────────────────────
// Retourne false si la plante n'a pas besoin d'être arrosée (dormance, etc.)
export function shouldWaterToday(gardenPlant, regionOffset = 0) {
  if (!gardenPlant) return false
  const status = getEffectiveStatus(gardenPlant, regionOffset)
  if (status === 'perennial_dormant') return false
  return true
}

// ─── Utilitaires communs ──────────────────────────────────────────────────────

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getDernierArrosage(plantId, arrosages) {
  const history = arrosages?.[plantId] ?? []
  if (history.length === 0) return null
  return [...history].sort().at(-1)
}

// ─── Planning 7 jours ────────────────────────────────────────────────────────
// frequence : en jours, calculée via getFrequencePlante
export function getPlanning7Jours(plantId, plantedAt, arrosages, frequence) {
  const today   = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = getToday()
  const history  = arrosages?.[plantId] ?? []
  const lastStr  = getDernierArrosage(plantId, arrosages)
  const lastDate = lastStr ? new Date(lastStr) : (plantedAt ? new Date(plantedAt) : today)
  lastDate.setHours(0, 0, 0, 0)

  const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  return Array.from({ length: 7 }, (_, i) => {
    const date      = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr   = date.toISOString().split('T')[0]
    const diffJours = Math.round((date - lastDate) / 86400000)
    const needsWatering = diffJours > 0 && diffJours % frequence === 0
    const wasWatered    = history.includes(dateStr)
    const isToday       = dateStr === todayStr
    return {
      dateStr,
      label:  isToday ? 'Auj.' : JOURS[date.getDay()],
      needsWatering,
      wasWatered,
      isToday,
    }
  })
}

// ─── État de santé hydrique ───────────────────────────────────────────────────
export function getEtatArrosage(plantId, plantedAt, arrosages, frequence) {
  const lastStr = getDernierArrosage(plantId, arrosages)
  if (!lastStr && !plantedAt) return 'due'

  const last  = new Date(lastStr ?? plantedAt)
  const today = new Date()
  const diffJ = Math.floor((today - last) / 86400000)

  if (diffJ === 0)             return 'ok'
  if (diffJ < frequence - 1)   return 'ok'
  if (diffJ === frequence - 1) return 'soon'
  if (diffJ === frequence)     return 'due'
  return 'overdue'
}

// Thème sombre Forêt — fonds semi-transparents, famille teal/eau
export const ETAT_CONFIG = {
  ok:      { color: PALETTE.water,     bg: 'rgba(61,130,138,0.16)',  label: 'Hydraté',   icon: '💧' },
  soon:    { color: PALETTE.accentDim, bg: 'rgba(166,227,107,0.10)', label: 'Bientôt',   icon: '⏳' },
  due:     { color: PALETTE.warning,   bg: 'rgba(252,186,106,0.14)', label: 'À arroser', icon: '🚿' },
  overdue: { color: PALETTE.harvest,   bg: 'rgba(222,95,29,0.14)',   label: 'En retard', icon: '⚠️' },
}
