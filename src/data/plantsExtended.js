// Plantes par catégorie — waterDays = intervalle de base en jours entre deux arrosages
// (sol limoneux, printemps/automne). Les multiplicateurs sol+saison s'appliquent ensuite.

export const CATEGORIES = [
  { id: 'legumes',     label: 'Légumes',     emoji: '🥦', defaultEmoji: '🥬' },
  { id: 'fruits',      label: 'Fruits',      emoji: '🍓', defaultEmoji: '🍇' },
  { id: 'aromatiques', label: 'Aromatiques', emoji: '🌿', defaultEmoji: '🌿' },
  { id: 'fleurs',      label: 'Fleurs',      emoji: '🌸', defaultEmoji: '🌺' },
  { id: 'arbres',      label: 'Arbres',      emoji: '🌳', defaultEmoji: '🌳' },
]

export const PLANTS_BY_CATEGORY = {
  legumes: [
    { id: 'tomate',       label: 'Tomate',         emoji: '🍅', waterDays: 2  },
    { id: 'courgette',    label: 'Courgette',       emoji: '🥒', waterDays: 3  },
    { id: 'carotte',      label: 'Carotte',         emoji: '🥕', waterDays: 3  },
    { id: 'salade',       label: 'Salade',          emoji: '🥗', waterDays: 2  },
    { id: 'haricot',      label: 'Haricot',         emoji: '🫘', waterDays: 3  },
    { id: 'poireau',      label: 'Poireau',         emoji: '🧅', waterDays: 5  },
    { id: 'radis',        label: 'Radis',           emoji: '🔴', waterDays: 2  },
    { id: 'pomme-terre',  label: 'Pomme de terre',  emoji: '🥔', waterDays: 6  },
    { id: 'poivron',      label: 'Poivron',         emoji: '🫑', waterDays: 2  },
    { id: 'concombre',    label: 'Concombre',       emoji: '🥒', waterDays: 2  },
    { id: 'oignon',       label: 'Oignon',          emoji: '🧅', waterDays: 6  },
    { id: 'epinard',      label: 'Épinard',         emoji: '🌿', waterDays: 3  },
    { id: 'aubergine',    label: 'Aubergine',       emoji: '🍆', waterDays: 2  },
    { id: 'brocoli',      label: 'Brocoli',         emoji: '🥦', waterDays: 3  },
    { id: 'chou',         label: 'Chou',            emoji: '🥬', waterDays: 4  },
    { id: 'potiron',      label: 'Potiron',         emoji: '🎃', waterDays: 4  },
    { id: 'petits-pois',  label: 'Petits pois',     emoji: '🫛', waterDays: 3  },
    { id: 'navet',        label: 'Navet',           emoji: '🥔', waterDays: 4  },
    { id: 'betterave',    label: 'Betterave',       emoji: '🔴', waterDays: 3  },
    { id: 'fenouil',      label: 'Fenouil',         emoji: '🌿', waterDays: 3  },
  ],
  fruits: [
    // Fruits du jardin : besoins modérés à forts en période de fructification
    { id: 'fraise',        label: 'Fraise',         emoji: '🍓', waterDays: 2  },
    { id: 'framboise',     label: 'Framboise',      emoji: '🍇', waterDays: 3  },
    { id: 'myrtille',      label: 'Myrtille',       emoji: '🫐', waterDays: 3  },
    { id: 'melon',         label: 'Melon',          emoji: '🍈', waterDays: 3  },
    { id: 'pasteque',      label: 'Pastèque',       emoji: '🍉', waterDays: 3  },
    { id: 'groseille',     label: 'Groseille',      emoji: '🍇', waterDays: 4  },
    { id: 'cassis',        label: 'Cassis',         emoji: '🫐', waterDays: 4  },
    { id: 'tomate-cerise', label: 'Tomate cerise',  emoji: '🍒', waterDays: 2  },
    { id: 'physalis',      label: 'Physalis',       emoji: '🧡', waterDays: 3  },
    { id: 'raisin',        label: 'Raisin',         emoji: '🍇', waterDays: 6  },
  ],
  aromatiques: [
    // Grand écart de tolérance à la sécheresse entre les espèces
    { id: 'basilic',     label: 'Basilic',     emoji: '🌿', waterDays: 2  }, // Très sensible
    { id: 'persil',      label: 'Persil',      emoji: '🌿', waterDays: 2  },
    { id: 'menthe',      label: 'Menthe',      emoji: '🌿', waterDays: 2  }, // Aime l'humidité
    { id: 'ciboulette',  label: 'Ciboulette',  emoji: '🌿', waterDays: 3  },
    { id: 'coriandre',   label: 'Coriandre',   emoji: '🌿', waterDays: 2  },
    { id: 'aneth',       label: 'Aneth',       emoji: '🌿', waterDays: 2  },
    { id: 'estragon',    label: 'Estragon',    emoji: '🌿', waterDays: 4  },
    { id: 'sauge',       label: 'Sauge',       emoji: '🌿', waterDays: 7  }, // Méditerranéen
    { id: 'thym',        label: 'Thym',        emoji: '🌿', waterDays: 10 }, // Très résistant à la sécheresse
    { id: 'origan',      label: 'Origan',      emoji: '🌿', waterDays: 7  },
    { id: 'romarin',     label: 'Romarin',     emoji: '🌿', waterDays: 12 }, // Xérophyte
    { id: 'lavande',     label: 'Lavande',     emoji: '💜', waterDays: 14 }, // Ne supporte pas l'excès d'eau
  ],
  fleurs: [
    { id: 'tournesol',  label: 'Tournesol',  emoji: '🌻', waterDays: 4  },
    { id: 'rose',       label: 'Rose',       emoji: '🌹', waterDays: 3  },
    { id: 'capucine',   label: 'Capucine',   emoji: '🌺', waterDays: 3  },
    { id: 'souci',      label: 'Souci',      emoji: '🌼', waterDays: 3  },
    { id: 'cosmos',     label: 'Cosmos',     emoji: '🌸', waterDays: 4  },
    { id: 'dahlia',     label: 'Dahlia',     emoji: '🌺', waterDays: 3  },
    { id: 'marguerite', label: 'Marguerite', emoji: '🌼', waterDays: 3  },
    { id: 'pensee',     label: 'Pensée',     emoji: '🌸', waterDays: 2  },
    { id: 'geranium',   label: 'Géranium',   emoji: '🌺', waterDays: 3  },
    { id: 'pivoine',    label: 'Pivoine',    emoji: '🌸', waterDays: 4  },
  ],
  arbres: [
    // Arbres adultes établis — besoins nettement moindres qu'un jeune plant
    { id: 'pommier',    label: 'Pommier',    emoji: '🍎', waterDays: 10 },
    { id: 'poirier',    label: 'Poirier',    emoji: '🍐', waterDays: 10 },
    { id: 'cerisier',   label: 'Cerisier',   emoji: '🍒', waterDays: 8  },
    { id: 'prunier',    label: 'Prunier',    emoji: '🍑', waterDays: 10 },
    { id: 'figuier',    label: 'Figuier',    emoji: '🌿', waterDays: 7  }, // Tolère bien la sécheresse
    { id: 'citronnier', label: 'Citronnier', emoji: '🍋', waterDays: 5  }, // Plus exigeant
    { id: 'olivier',    label: 'Olivier',    emoji: '🫒', waterDays: 14 }, // Xérophyte méditerranéen
    { id: 'noisetier',  label: 'Noisetier',  emoji: '🌰', waterDays: 10 },
    { id: 'murier',     label: 'Mûrier',     emoji: '🫐', waterDays: 7  },
    { id: 'abricotier', label: 'Abricotier', emoji: '🍑', waterDays: 8  },
  ],
}
