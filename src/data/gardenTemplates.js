// ─────────────────────────────────────────────────────────────────────────────
// Jardins prêts à l'emploi proposés à la fin de l'onboarding (et depuis l'état
// vide de Mon Jardin). Chaque template crée un lot de plantes via addPlant.
//
// Note d'implémentation — saisonnalité :
//   Le modèle de statuts actuel (plantStatusUtils.js) ne représente PAS l'état
//   « à semer / pas encore la saison » : une plante sans date retombe sur 'sowed'
//   (Semé) et apparaît « à arroser », ce qui serait contradictoire. On applique
//   donc le template en créant toutes les plantes comme semées aujourd'hui, et
//   c'est le calendrier / le Conseiller qui guident la saisonnalité (conforme au
//   « sinon ajoute tout et laisse le calendrier guider » du cahier des charges).
//   `getTemplatePlants` expose tout de même `enSaison` (fenêtre de semis du mois
//   courant) pour l'affichage.
// ─────────────────────────────────────────────────────────────────────────────

import { getPlantById } from './plantsUnified'
import { getCalendarWithOffset } from '../utils/calendarUtils'

export const GARDEN_TEMPLATES = [
  {
    id: 'balcon-debutant',
    nom: 'Balcon du débutant',
    emoji: '🪴',
    description: '5 plantes faciles en pots, récoltes rapides, peu d’entretien',
    container: true,
    plantes: ['tomate-cerise', 'basilic', 'radis', 'salade', 'ciboulette'],
  },
  {
    id: 'carre-famille',
    nom: 'Carré potager familial',
    emoji: '🥕',
    description: '10 m², les classiques qui nourrissent : tomates, courgettes, haricots…',
    container: false,
    plantes: ['tomate', 'courgette', 'haricot', 'carotte', 'salade', 'radis', 'basilic'],
  },
  {
    id: 'aromatiques-cuisine',
    nom: 'Coin aromatiques',
    emoji: '🌿',
    description: 'Le kit du cuisinier : à portée de main toute la saison',
    container: true,
    plantes: ['basilic', 'persil', 'ciboulette', 'thym', 'coriandre'],
  },
  {
    id: 'anti-rate',
    nom: 'Impossible à rater',
    emoji: '💪',
    description: 'Les plantes les plus tolérantes pour reprendre confiance',
    container: false,
    plantes: ['radis', 'salade', 'bette', 'haricot'],
  },
]

export function getTemplateById(id) {
  return GARDEN_TEMPLATES.find(t => t.id === id) ?? null
}

// Ce mois-ci est-il dans la fenêtre de semis (calendrier === 1) de la plante ?
function estEnSaisonSemis(plant, regionOffset = 0, date = new Date()) {
  if (!Array.isArray(plant.calendar)) return true // vivaces/aromatiques sans calendrier → toujours proposables
  const cal = getCalendarWithOffset(plant.calendar, regionOffset)
  return cal[date.getMonth()] === 1
}

// Résout les plantes valides d'un template.
// Un plantId absent de plantsUnified.js déclenche un console.warn explicite et
// est ignoré (plutôt qu'un crash ou un id inventé).
// Retourne [{ id, name, emoji, enSaison }].
export function getTemplatePlants(template, { regionOffset = 0, date = new Date() } = {}) {
  if (!template) return []
  const out = []
  for (const plantId of template.plantes) {
    const plant = getPlantById(plantId)
    if (!plant) {
      console.warn(`[gardenTemplates] plantId inconnu dans le template "${template.id}" : "${plantId}" — ignoré`)
      continue
    }
    out.push({
      id:       plant.id,
      name:     plant.label,
      emoji:    plant.emoji,
      enSaison: estEnSaisonSemis(plant, regionOffset, date),
    })
  }
  return out
}
