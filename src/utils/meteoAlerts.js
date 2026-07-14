// ─────────────────────────────────────────────────────────────────────────────
// Alertes météo actionnables — logique pure, sans React, testable.
// Reçoit `daily` : l'objet daily d'Open-Meteo déjà récupéré par useMeteo
// (time[], temperature_2m_min[], temperature_2m_max[], precipitation_sum[]).
//
// Robuste à `past_days` : les fonctions repèrent l'index d'aujourd'hui via
// time.indexOf(today), donc peu importe si le tableau commence hier ou aujourd'hui.
// ─────────────────────────────────────────────────────────────────────────────

import { getFamillePlante } from '../data/rotation'

// Seuils nommés — pas de nombres magiques dispersés dans le code.
export const SEUIL_GEL           = 2   // °C : nuit ≤ 2°C → risque de gel
export const SEUIL_GEL_SEVERE    = -1  // °C : nuit ≤ -1°C → gel sévère
export const SEUIL_PLUIE_PASSEE_MM = 5 // mm cumulés hier+aujourd'hui → sauter l'arrosage
export const SEUIL_PLUIE_PREVUE_MM = 8 // mm prévus dans les 24h → attendre avant d'arroser

const FENETRE_GEL_JOURS = 3 // on regarde les 3 prochains jours

// Familles entièrement sensibles au gel
const FAMILLES_SENSIBLES = new Set(['Solanacées', 'Cucurbitacées'])
// Sensibles non couverts par ces familles : basilic (aucune famille rotation),
// haricot (Légumineuses, mais gélif contrairement aux fèves/pois), maïs, tomate cerise.
const IDS_SENSIBLES = new Set(['basilic', 'haricot', 'mais-doux', 'tomate-cerise'])

function todayIndex(daily) {
  const today = new Date().toISOString().split('T')[0]
  const idx = daily?.time?.indexOf(today) ?? -1
  return idx === -1 ? 0 : idx
}

// Retourne null ou { type: 'gel'|'gel_severe', date, tempMin, dansJours }
// Première occurrence d'une nuit ≤ SEUIL_GEL sur les 3 prochains jours.
export function detectFrostRisk(daily) {
  const mins = daily?.temperature_2m_min
  if (!mins || !daily?.time) return null

  const t0 = todayIndex(daily)
  for (let i = 0; i < FENETRE_GEL_JOURS; i++) {
    const idx = t0 + i
    if (idx >= mins.length) break
    const tempMin = mins[idx]
    if (tempMin == null) continue
    if (tempMin <= SEUIL_GEL) {
      return {
        type:      tempMin <= SEUIL_GEL_SEVERE ? 'gel_severe' : 'gel',
        date:      daily.time[idx],
        tempMin,
        dansJours: i,
      }
    }
  }
  return null
}

// Retourne { skip: boolean, raison: string|null, mm: number }
// skip si pluie passée (hier+aujourd'hui) ≥ 5mm, ou pluie prévue (demain) ≥ 8mm.
export function shouldSkipWatering(daily) {
  const rien = { skip: false, raison: null, mm: 0 }
  const p = daily?.precipitation_sum
  if (!p || !daily?.time) return rien

  const t0     = todayIndex(daily)
  const hier   = t0 - 1 >= 0        ? (p[t0 - 1] ?? 0) : 0
  const auj    = p[t0] ?? 0
  const demain = t0 + 1 < p.length  ? (p[t0 + 1] ?? 0) : 0

  const mmPasse = hier + auj
  if (mmPasse >= SEUIL_PLUIE_PASSEE_MM) {
    const mm = Math.round(mmPasse)
    return { skip: true, mm, raison: `Il a plu ${mm} mm — tu peux sauter l'arrosage aujourd'hui.` }
  }
  if (demain >= SEUIL_PLUIE_PREVUE_MM) {
    const mm = Math.round(demain)
    return { skip: true, mm, raison: `${mm} mm prévus demain — attends avant d'arroser.` }
  }
  return rien
}

// Plantes du jardin sensibles au gel (via famille de rotation + liste d'ids)
export function getFrostSensitivePlants(plants) {
  return (plants ?? []).filter(p => {
    if (IDS_SENSIBLES.has(p.plantId)) return true
    const famille = getFamillePlante(p.plantId)
    return famille ? FAMILLES_SENSIBLES.has(famille) : false
  })
}
