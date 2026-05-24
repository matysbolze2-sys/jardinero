import { PLANTS } from '../data/plants'

// Applique l'offset régional sur le calendrier d'une plante
// L'offset représente un retard en semaines (positif = plus tard)
// On le convertit en décalage de mois arrondi pour simplifier
export function getCalendarWithOffset(calendar, offsetWeeks) {
  if (!offsetWeeks) return calendar

  const offsetMonths = Math.round(offsetWeeks / 4)
  if (offsetMonths === 0) return calendar

  // Décale le calendrier positivement (vers la droite = plus tard)
  const shifted = [...calendar]
  if (offsetMonths > 0) {
    // Retard : on reporte les activités vers les mois suivants
    for (let i = 11; i >= 0; i--) {
      shifted[i] = i >= offsetMonths ? calendar[i - offsetMonths] : 0
    }
  } else {
    // Avance : on avance les activités
    const advance = Math.abs(offsetMonths)
    for (let i = 0; i < 12; i++) {
      shifted[i] = i + advance < 12 ? calendar[i + advance] : 0
    }
  }
  return shifted
}

// Retourne le statut calendrier d'une plante pour le mois courant
// Tient compte de l'offset régional
export function getPlantStatusThisMonth(plantId, offsetWeeks) {
  const plant = PLANTS.find(p => p.id === plantId)
  if (!plant) return 0

  const calendar = getCalendarWithOffset(plant.calendar, offsetWeeks)
  return calendar[new Date().getMonth()]
}

// Retourne les plantes actives ce mois-ci (semis ou croissance ou récolte)
export function getActivePlantsThisMonth(offsetWeeks) {
  const month = new Date().getMonth()
  return PLANTS.filter(plant => {
    const cal = getCalendarWithOffset(plant.calendar, offsetWeeks)
    return cal[month] > 0
  })
}

// Retourne les plantes à semer ce mois-ci
export function getPlantsToSowThisMonth(offsetWeeks) {
  const month = new Date().getMonth()
  return PLANTS.filter(plant => {
    const cal = getCalendarWithOffset(plant.calendar, offsetWeeks)
    return cal[month] === 1
  })
}

// Retourne les plantes à récolter ce mois-ci
export function getPlantsToHarvestThisMonth(offsetWeeks) {
  const month = new Date().getMonth()
  return PLANTS.filter(plant => {
    const cal = getCalendarWithOffset(plant.calendar, offsetWeeks)
    return cal[month] === 3
  })
}
