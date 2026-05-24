// Familles botaniques des plantes — pour la rotation des cultures
// rotation : nombre d'années à attendre avant de replanter la même famille au même endroit

export const FAMILLES_BOTANIQUES = {
  'tomate':      { famille: 'Solanacées',      couleur: '#FEF2F2', couleurBord: '#FECACA', rotation: 3 },
  'poivron':     { famille: 'Solanacées',      couleur: '#FEF2F2', couleurBord: '#FECACA', rotation: 3 },
  'aubergine':   { famille: 'Solanacées',      couleur: '#FEF2F2', couleurBord: '#FECACA', rotation: 3 },
  'pomme-terre': { famille: 'Solanacées',      couleur: '#FEF2F2', couleurBord: '#FECACA', rotation: 3 },
  'courgette':   { famille: 'Cucurbitacées',   couleur: '#ECFDF5', couleurBord: '#A7F3D0', rotation: 3 },
  'concombre':   { famille: 'Cucurbitacées',   couleur: '#ECFDF5', couleurBord: '#A7F3D0', rotation: 3 },
  'potiron':     { famille: 'Cucurbitacées',   couleur: '#ECFDF5', couleurBord: '#A7F3D0', rotation: 3 },
  'melon':       { famille: 'Cucurbitacées',   couleur: '#ECFDF5', couleurBord: '#A7F3D0', rotation: 3 },
  'pasteque':    { famille: 'Cucurbitacées',   couleur: '#ECFDF5', couleurBord: '#A7F3D0', rotation: 3 },
  'haricot':     { famille: 'Légumineuses',    couleur: '#EFF6FF', couleurBord: '#BFDBFE', rotation: 2 },
  'petits-pois': { famille: 'Légumineuses',    couleur: '#EFF6FF', couleurBord: '#BFDBFE', rotation: 2 },
  'oignon':      { famille: 'Alliacées',       couleur: '#FFF7ED', couleurBord: '#FED7AA', rotation: 3 },
  'poireau':     { famille: 'Alliacées',       couleur: '#FFF7ED', couleurBord: '#FED7AA', rotation: 3 },
  'carotte':     { famille: 'Apiacées',        couleur: '#FFFBEB', couleurBord: '#FDE68A', rotation: 3 },
  'fenouil':     { famille: 'Apiacées',        couleur: '#FFFBEB', couleurBord: '#FDE68A', rotation: 3 },
  'brocoli':     { famille: 'Brassicacées',    couleur: '#F0FDF4', couleurBord: '#BBF7D0', rotation: 3 },
  'chou':        { famille: 'Brassicacées',    couleur: '#F0FDF4', couleurBord: '#BBF7D0', rotation: 3 },
  'navet':       { famille: 'Brassicacées',    couleur: '#F0FDF4', couleurBord: '#BBF7D0', rotation: 3 },
  'radis':       { famille: 'Brassicacées',    couleur: '#F0FDF4', couleurBord: '#BBF7D0', rotation: 2 },
  'epinard':     { famille: 'Chénopodiacées',  couleur: '#F5F3FF', couleurBord: '#DDD6FE', rotation: 2 },
  'betterave':   { famille: 'Chénopodiacées',  couleur: '#F5F3FF', couleurBord: '#DDD6FE', rotation: 2 },
  'salade':      { famille: 'Astéracées',      couleur: '#FDF4FF', couleurBord: '#E9D5FF', rotation: 2 },
}

export function getFamilleById(plantId) {
  return FAMILLES_BOTANIQUES[plantId] ?? null
}
