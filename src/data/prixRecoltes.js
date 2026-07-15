// ─────────────────────────────────────────────────────────────────────────────
// Valeur des récoltes — prix moyen constaté (grande surface / marché, €/kg) et
// rendement typique par plant pour un potager amateur (kg/plant/saison).
//
// Ce sont des ORDRES DE GRANDEUR réalistes pour la France, pas une précision
// illusoire : la valeur affichée est toujours préfixée d'un « ~ ».
//
//   prixKg         : € par kg
//   rendementPlant : kg récoltés par plant sur la saison (défaut si non saisi)
//   poidsPiece     : (optionnel) kg par pièce, pour saisir la récolte à l'unité
//                    (salade, radis…) au lieu du poids
//
// Les plantes purement ornementales (fleurs) n'ont pas d'entrée → non valorisées.
// ─────────────────────────────────────────────────────────────────────────────

export const PRIX_RECOLTES = {
  // ── Légumes-fruits ──────────────────────────────────────────────────────────
  'tomate':         { prixKg: 3.5,  rendementPlant: 3.0,  poidsPiece: 0.12 },
  'tomate-cerise':  { prixKg: 6.0,  rendementPlant: 2.0 },
  'courgette':      { prixKg: 2.5,  rendementPlant: 5.0,  poidsPiece: 0.25 },
  'concombre':      { prixKg: 2.5,  rendementPlant: 3.0,  poidsPiece: 0.4 },
  'aubergine':      { prixKg: 3.5,  rendementPlant: 2.0,  poidsPiece: 0.3 },
  'poivron':        { prixKg: 4.0,  rendementPlant: 1.5,  poidsPiece: 0.15 },
  'melon':          { prixKg: 2.5,  rendementPlant: 1.5,  poidsPiece: 0.9 },
  'pasteque':       { prixKg: 1.5,  rendementPlant: 4.0,  poidsPiece: 4.0 },
  'potiron':        { prixKg: 1.5,  rendementPlant: 5.0,  poidsPiece: 3.0 },
  'potimarron':     { prixKg: 2.5,  rendementPlant: 3.0,  poidsPiece: 1.5 },
  'butternut':      { prixKg: 2.5,  rendementPlant: 3.0,  poidsPiece: 1.2 },
  'physalis':       { prixKg: 15,   rendementPlant: 0.3 },
  'mais-doux':      { prixKg: 3.0,  rendementPlant: 0.4,  poidsPiece: 0.3 },

  // ── Légumes-feuilles ────────────────────────────────────────────────────────
  'salade':         { prixKg: 4.0,  rendementPlant: 0.4,  poidsPiece: 0.4 },
  'scarole':        { prixKg: 3.5,  rendementPlant: 0.4,  poidsPiece: 0.4 },
  'mache':          { prixKg: 12,   rendementPlant: 0.15 },
  'roquette':       { prixKg: 12,   rendementPlant: 0.15 },
  'epinard':        { prixKg: 4.5,  rendementPlant: 0.3 },
  'bette':          { prixKg: 3.5,  rendementPlant: 0.6 },
  'chou':           { prixKg: 1.8,  rendementPlant: 1.0,  poidsPiece: 1.0 },
  'chou-rouge':     { prixKg: 2.5,  rendementPlant: 1.0,  poidsPiece: 1.0 },
  'chou-fleur':     { prixKg: 3.0,  rendementPlant: 0.8,  poidsPiece: 0.8 },
  'brocoli':        { prixKg: 4.0,  rendementPlant: 0.4,  poidsPiece: 0.4 },
  'chou-bruxelles': { prixKg: 4.0,  rendementPlant: 0.5 },
  'artichaut':      { prixKg: 5.0,  rendementPlant: 0.5,  poidsPiece: 0.25 },
  'fenouil':        { prixKg: 3.5,  rendementPlant: 0.3,  poidsPiece: 0.3 },
  'celeri-branche': { prixKg: 3.0,  rendementPlant: 0.5,  poidsPiece: 0.5 },

  // ── Légumes-racines / bulbes ────────────────────────────────────────────────
  'carotte':        { prixKg: 2.0,  rendementPlant: 0.1,  poidsPiece: 0.1 },
  'radis':          { prixKg: 4.5,  rendementPlant: 0.03, poidsPiece: 0.02 },
  'navet':          { prixKg: 2.5,  rendementPlant: 0.2,  poidsPiece: 0.15 },
  'betterave':      { prixKg: 2.5,  rendementPlant: 0.25, poidsPiece: 0.2 },
  'panais':         { prixKg: 3.0,  rendementPlant: 0.2,  poidsPiece: 0.2 },
  'celeri-rave':    { prixKg: 3.0,  rendementPlant: 0.6,  poidsPiece: 0.6 },
  'pomme-terre':    { prixKg: 2.0,  rendementPlant: 1.0 },
  'oignon':         { prixKg: 2.0,  rendementPlant: 0.15, poidsPiece: 0.12 },
  'ail':            { prixKg: 12,   rendementPlant: 0.05 },
  'poireau':        { prixKg: 3.0,  rendementPlant: 0.3,  poidsPiece: 0.3 },

  // ── Légumineuses ────────────────────────────────────────────────────────────
  'haricot':        { prixKg: 6.0,  rendementPlant: 0.8 },
  'petits-pois':    { prixKg: 6.0,  rendementPlant: 0.3 },
  'feve':           { prixKg: 5.0,  rendementPlant: 0.4 },

  // ── Aromatiques (chères au kilo, petits rendements) ─────────────────────────
  'basilic':        { prixKg: 25,   rendementPlant: 0.15 },
  'persil':         { prixKg: 15,   rendementPlant: 0.2 },
  'ciboulette':     { prixKg: 20,   rendementPlant: 0.1 },
  'coriandre':      { prixKg: 18,   rendementPlant: 0.1 },
  'menthe':         { prixKg: 15,   rendementPlant: 0.2 },
  'thym':           { prixKg: 25,   rendementPlant: 0.1 },
  'romarin':        { prixKg: 20,   rendementPlant: 0.15 },
  'sauge':          { prixKg: 20,   rendementPlant: 0.1 },
  'estragon':       { prixKg: 25,   rendementPlant: 0.1 },
  'aneth':          { prixKg: 18,   rendementPlant: 0.1 },
  'cerfeuil':       { prixKg: 18,   rendementPlant: 0.1 },
  'origan':         { prixKg: 22,   rendementPlant: 0.1 },
  'melisse':        { prixKg: 18,   rendementPlant: 0.15 },

  // ── Fruits (petits fruits & vivaces) ────────────────────────────────────────
  'fraise':         { prixKg: 8.0,  rendementPlant: 0.5 },
  'fraisier':       { prixKg: 8.0,  rendementPlant: 0.5 },
  'framboise':      { prixKg: 12,   rendementPlant: 0.8 },
  'framboisier':    { prixKg: 12,   rendementPlant: 0.8 },
  'groseille':      { prixKg: 10,   rendementPlant: 1.0 },
  'groseillier':    { prixKg: 10,   rendementPlant: 1.0 },
  'cassis':         { prixKg: 10,   rendementPlant: 1.2 },
  'cassissier':     { prixKg: 10,   rendementPlant: 1.2 },
  'myrtille':       { prixKg: 15,   rendementPlant: 0.8 },
  'myrtillier':     { prixKg: 15,   rendementPlant: 0.8 },
  'murier':         { prixKg: 10,   rendementPlant: 1.0 },
  'raisin':         { prixKg: 4.0,  rendementPlant: 2.0 },
  'rhubarbe':       { prixKg: 4.0,  rendementPlant: 1.5 },

  // ── Fruits (arbres) ─────────────────────────────────────────────────────────
  'abricotier':     { prixKg: 3.5,  rendementPlant: 15 },
  'cerisier':       { prixKg: 6.0,  rendementPlant: 15 },
  'pommier':        { prixKg: 2.5,  rendementPlant: 25 },
  'poirier':        { prixKg: 3.0,  rendementPlant: 20 },
  'prunier':        { prixKg: 3.5,  rendementPlant: 20 },
  'pecher':         { prixKg: 4.0,  rendementPlant: 15 },
  'figuier':        { prixKg: 6.0,  rendementPlant: 8 },
  'cognassier':     { prixKg: 3.0,  rendementPlant: 12 },
  'noisetier':      { prixKg: 12,   rendementPlant: 3 },
  'citronnier':     { prixKg: 3.5,  rendementPlant: 8 },
  'olivier':        { prixKg: 6.0,  rendementPlant: 8 },
  'asperge':        { prixKg: 12,   rendementPlant: 0.3 },
}

function round2(n) {
  return Math.round(n * 100) / 100
}

// Valeur estimée en € d'une récolte. quantiteKg null → rendement par défaut.
// Retourne null si la plante n'a pas de prix connu (ex. ornementales).
export function estimerValeurRecolte(plantId, quantiteKg = null) {
  const p = PRIX_RECOLTES[plantId]
  if (!p) return null
  const kg = quantiteKg ?? p.rendementPlant
  return round2(kg * p.prixKg)
}

// Poids retenu pour une entrée (saisi ou rendement par défaut). null si inconnu.
export function poidsRecolte(plantId, quantiteKg = null) {
  const p = PRIX_RECOLTES[plantId]
  if (!p) return null
  return quantiteKg ?? p.rendementPlant
}

// Infos de saisie à l'unité (pièces) pour une plante, ou null si non pertinent.
export function uniteSaisie(plantId) {
  const p = PRIX_RECOLTES[plantId]
  if (!p?.poidsPiece) return null
  return { poidsPiece: p.poidsPiece }
}
