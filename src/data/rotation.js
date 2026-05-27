export const FAMILLES_ROTATION = {
  'Solanacées':     { rotation: 3, couleur: '#FEF2F2', couleurBord: '#FECACA', emoji: '🍅', notes: "Attendre 3 ans pour éviter mildiou et autres maladies communes" },
  'Cucurbitacées':  { rotation: 3, couleur: '#ECFDF5', couleurBord: '#A7F3D0', emoji: '🥒', notes: "Rotation indispensable pour éviter l'épuisement du sol en nutriments" },
  'Légumineuses':   { rotation: 2, couleur: '#EFF6FF', couleurBord: '#BFDBFE', emoji: '🫘', notes: "Peuvent revenir plus vite grâce à leur fixation d'azote" },
  'Alliacées':      { rotation: 3, couleur: '#FFF7ED', couleurBord: '#FED7AA', emoji: '🧅', notes: "Risque de maladies du bulbe si trop fréquent" },
  'Apiacées':       { rotation: 3, couleur: '#FFFBEB', couleurBord: '#FDE68A', emoji: '🥕', notes: "Alternance avec légumineuses recommandée" },
  'Brassicacées':   { rotation: 3, couleur: '#F0FDF4', couleurBord: '#BBF7D0', emoji: '🥦', notes: "Famille très exigeante — sol à régénérer entre deux cycles" },
  'Chénopodiacées': { rotation: 2, couleur: '#F5F3FF', couleurBord: '#DDD6FE', emoji: '🌿', notes: "Retour possible après 2 ans avec apport de compost" },
  'Astéracées':     { rotation: 2, couleur: '#FDF4FF', couleurBord: '#E9D5FF', emoji: '🥗', notes: "Famille peu exigeante, rotation courte suffisante" },
  'Liliacées':      { rotation: 2, couleur: '#FFF1F2', couleurBord: '#FFE4E6', emoji: '🌷', notes: "Retour possible après 2 ans" },
  'Poaceae':        { rotation: 2, couleur: '#FFFBEB', couleurBord: '#FEF08A', emoji: '🌽', notes: "Maïs — rotation recommandée pour éviter la fatigue du sol" },
}

export const PLANTE_FAMILLE = {
  // Solanacées
  'tomate':           'Solanacées',
  'poivron':          'Solanacées',
  'aubergine':        'Solanacées',
  'pomme-terre':      'Solanacées',
  // Cucurbitacées
  'courgette':        'Cucurbitacées',
  'concombre':        'Cucurbitacées',
  'potiron':          'Cucurbitacées',
  'potimarron':       'Cucurbitacées',
  'butternut':        'Cucurbitacées',
  'melon':            'Cucurbitacées',
  'pasteque':         'Cucurbitacées',
  // Légumineuses
  'haricot':          'Légumineuses',
  'petits-pois':      'Légumineuses',
  'feve':             'Légumineuses',
  // Alliacées
  'oignon':           'Alliacées',
  'poireau':          'Alliacées',
  'ail':              'Alliacées',
  'ciboulette':       'Alliacées',
  // Apiacées
  'carotte':          'Apiacées',
  'fenouil':          'Apiacées',
  'celeri-branche':   'Apiacées',
  'celeri-rave':      'Apiacées',
  'panais':           'Apiacées',
  'cerfeuil':         'Apiacées',
  'aneth':            'Apiacées',
  'persil':           'Apiacées',
  'coriandre':        'Apiacées',
  // Brassicacées
  'brocoli':          'Brassicacées',
  'chou':             'Brassicacées',
  'chou-fleur':       'Brassicacées',
  'chou-bruxelles':   'Brassicacées',
  'chou-rouge':       'Brassicacées',
  'navet':            'Brassicacées',
  'radis':            'Brassicacées',
  'roquette':         'Brassicacées',
  // Chénopodiacées
  'epinard':          'Chénopodiacées',
  'betterave':        'Chénopodiacées',
  'bette':            'Chénopodiacées',
  // Astéracées
  'salade':           'Astéracées',
  'scarole':          'Astéracées',
  'mache':            'Astéracées',
  // Poaceae
  'mais-doux':        'Poaceae',
}

export function getFamillePlante(plantId) {
  return PLANTE_FAMILLE[plantId] ?? null
}

export function getDelaiRotation(plantId) {
  const famille = getFamillePlante(plantId)
  if (!famille) return 0
  return FAMILLES_ROTATION[famille]?.rotation ?? 2
}

export function respecteRotation(plantId, harvestedAt) {
  const delai = getDelaiRotation(plantId)
  if (!harvestedAt || delai === 0) return { ok: true, moisRestants: 0 }
  const dateRecolte = new Date(harvestedAt)
  const dateAutorisee = new Date(dateRecolte)
  dateAutorisee.setFullYear(dateAutorisee.getFullYear() + delai)
  const aujourdhui = new Date()
  if (aujourdhui >= dateAutorisee) return { ok: true, moisRestants: 0 }
  const moisRestants = Math.ceil((dateAutorisee - aujourdhui) / (1000 * 60 * 60 * 24 * 30))
  return { ok: false, moisRestants, dateAutorisee: dateAutorisee.toISOString().split('T')[0] }
}

export function getHistoriqueByPlot(plotId, historique) {
  return (historique ?? [])
    .filter(h => h.plotId === plotId)
    .sort((a, b) => new Date(b.harvestedAt) - new Date(a.harvestedAt))
}

// Suggested successor families after each family (agronomic rotation logic)
export const ROTATION_SUCCESSION = {
  'Solanacées':     ['Légumineuses', 'Astéracées',    'Alliacées'],
  'Cucurbitacées':  ['Légumineuses', 'Alliacées',     'Apiacées'],
  'Légumineuses':   ['Solanacées',   'Cucurbitacées', 'Brassicacées'],
  'Alliacées':      ['Astéracées',   'Cucurbitacées', 'Apiacées'],
  'Apiacées':       ['Légumineuses', 'Brassicacées',  'Astéracées'],
  'Brassicacées':   ['Légumineuses', 'Solanacées',    'Cucurbitacées'],
  'Chénopodiacées': ['Légumineuses', 'Solanacées',    'Apiacées'],
  'Astéracées':     ['Légumineuses', 'Brassicacées',  'Solanacées'],
  'Poaceae':        ['Légumineuses', 'Solanacées',    'Cucurbitacées'],
}

export function getRotationConflicts(plantId, historique) {
  const famille = getFamillePlante(plantId)
  if (!famille) return []
  const delai = getDelaiRotation(plantId)
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - delai)
  return (historique ?? []).filter(h => {
    const famH = getFamillePlante(h.plantId)
    if (famH !== famille) return false
    const dateRecolte = new Date(h.harvestedAt)
    return dateRecolte > cutoff
  })
}
