import { PLANTS } from '../data/plants'
import { PLANTS_BY_CATEGORY } from '../data/plantsExtended'

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

// ─── Fréquence par plante ─────────────────────────────────────────────────────
// Combine waterDays propre à la plante × sol × saison.
// C'est la fonction principale à utiliser dans les composants.
export function getFrequencePlante(gardenPlant, soilId) {
  const waterDays     = getWaterDays(gardenPlant?.plantId)
  const solMult       = MULTIPLICATEUR_SOL[soilId] ?? 1.0
  const saisonMult    = getMultiplicateurSaison()
  return Math.max(1, Math.round(waterDays * solMult * saisonMult))
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

export const ETAT_CONFIG = {
  ok:      { color: '#3B6D11', bg: '#EAF3DE', label: 'Hydraté',   icon: '💧' },
  soon:    { color: '#C27C12', bg: '#FFF8EC', label: 'Bientôt',   icon: '⏳' },
  due:     { color: '#E05A3A', bg: '#FFF0ED', label: 'À arroser', icon: '🚿' },
  overdue: { color: '#B91C1C', bg: '#FEE2E2', label: 'En retard', icon: '⚠️' },
}
