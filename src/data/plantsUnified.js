// Source de vérité unique — fusion de plants.js et plantsExtended.js
// calendar : tableau 12 mois (0=rien,1=semis,2=croissance,3=récolte) | null pour les vivaces
// type     : 'annual' | 'perennial'
// waterDays: intervalle de base entre arrosages (sol limoneux, printemps/automne)

export const CATEGORIES_UNIFIED = [
  { id: 'legumes',     label: 'Légumes',     emoji: '🥦', defaultEmoji: '🥬' },
  { id: 'fruits',      label: 'Fruits',      emoji: '🍓', defaultEmoji: '🍇' },
  { id: 'aromatiques', label: 'Aromatiques', emoji: '🌿', defaultEmoji: '🌿' },
  { id: 'fleurs',      label: 'Fleurs',      emoji: '🌸', defaultEmoji: '🌺' },
  { id: 'arbres',      label: 'Arbres',      emoji: '🌳', defaultEmoji: '🌳' },
  { id: 'vivaces',     label: 'Vivaces',     emoji: '🪴', defaultEmoji: '🌱' },
]

export const PLANTS_BY_CATEGORY_UNIFIED = {

  // ── Légumes ─────────────────────────────────────────────────────────────────

  legumes: [
    { id: 'tomate',         label: 'Tomate',          emoji: '🍅', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,1,1,2,2,3,3,3,3,0,0] },
    { id: 'courgette',      label: 'Courgette',       emoji: '🥒', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,0,0,1,1,2,3,3,3,3,0,0] },
    { id: 'carotte',        label: 'Carotte',         emoji: '🥕', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,1,2,2,3,3,3,3,1,0] },
    { id: 'salade',         label: 'Salade',          emoji: '🥗', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,1,2,3,3,3,2,1,2,2,0] },
    { id: 'haricot',        label: 'Haricot',         emoji: '🫘', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,0,0,1,1,2,3,3,3,0,0,0] },
    { id: 'poireau',        label: 'Poireau',         emoji: '🧅', category: 'legumes', type: 'annual', waterDays: 5, calendar: [1,1,2,2,2,2,2,2,3,3,3,3] },
    { id: 'radis',          label: 'Radis',           emoji: '🔴', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,2,3,3,0,0,1,2,3,0,0] },
    { id: 'pomme-terre',    label: 'Pomme de terre',  emoji: '🥔', category: 'legumes', type: 'annual', waterDays: 6, calendar: [0,0,1,1,2,2,3,3,3,2,0,0] },
    { id: 'poivron',        label: 'Poivron',         emoji: '🫑', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,1,2,2,2,2,3,3,3,0,0] },
    { id: 'concombre',      label: 'Concombre',       emoji: '🥒', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,0,0,1,1,2,3,3,3,0,0,0] },
    { id: 'oignon',         label: 'Oignon',          emoji: '🧅', category: 'legumes', type: 'annual', waterDays: 6, calendar: [0,0,1,1,2,2,2,3,3,0,0,0] },
    { id: 'epinard',        label: 'Épinard',         emoji: '🌿', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,3,3,0,1,2,3,3,0] },
    { id: 'aubergine',      label: 'Aubergine',       emoji: '🍆', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,1,2,2,2,2,3,3,3,0,0] },
    { id: 'brocoli',        label: 'Brocoli',         emoji: '🥦', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,2,2,3,3,3,3,0,0] },
    { id: 'chou',           label: 'Chou',            emoji: '🥬', category: 'legumes', type: 'annual', waterDays: 4, calendar: [1,1,2,2,2,2,2,2,2,3,3,3] },
    { id: 'potiron',        label: 'Potiron',         emoji: '🎃', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,0,0,1,1,2,2,2,3,3,0,0] },
    { id: 'petits-pois',    label: 'Petits pois',     emoji: '🫛', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,2,2,3,3,0,0,1,2,3,0] },
    { id: 'navet',          label: 'Navet',           emoji: '🥔', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,0,1,2,3,3,0,0,1,2,3,3] },
    { id: 'betterave',      label: 'Betterave',       emoji: '🔴', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,2,3,3,3,3,2,1,0] },
    { id: 'fenouil',        label: 'Fenouil',         emoji: '🌿', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,0,0,1,1,2,2,3,3,2,0,0] },
    // Nouvelles annuelles
    { id: 'roquette',       label: 'Roquette',        emoji: '🌿', category: 'legumes', type: 'annual', waterDays: 2, calendar: [0,1,2,3,3,0,0,1,2,3,3,0] },
    { id: 'mache',          label: 'Mâche',           emoji: '🥗', category: 'legumes', type: 'annual', waterDays: 3, calendar: [3,3,0,0,0,0,0,0,1,2,3,3] },
    { id: 'chou-fleur',     label: 'Chou-fleur',      emoji: '🥦', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,2,2,3,3,3,0,0,0] },
    { id: 'chou-bruxelles', label: 'Chou de Bruxelles', emoji: '🥦', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,1,1,2,2,2,2,2,2,3,3,3] },
    { id: 'chou-rouge',     label: 'Chou rouge',      emoji: '🥬', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,1,1,2,2,2,2,3,3,3,0,0] },
    { id: 'potimarron',     label: 'Potimarron',      emoji: '🎃', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,0,0,1,1,2,2,2,3,3,0,0] },
    { id: 'butternut',      label: 'Butternut',       emoji: '🎃', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,0,0,1,1,2,2,2,3,3,0,0] },
    { id: 'mais-doux',      label: 'Maïs doux',       emoji: '🌽', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,0,0,1,1,2,2,3,3,0,0,0] },
    { id: 'celeri-branche', label: 'Céleri branche',  emoji: '🌿', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,2,2,2,2,3,3,0,0] },
    { id: 'celeri-rave',    label: 'Céleri rave',     emoji: '🥔', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,1,1,2,2,2,2,2,2,3,3,0] },
    { id: 'bette',          label: 'Bette',           emoji: '🌿', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,1,1,2,2,3,3,3,3,2,1,0] },
    { id: 'feve',           label: 'Fève',            emoji: '🫘', category: 'legumes', type: 'annual', waterDays: 4, calendar: [0,0,1,2,2,3,3,0,0,1,2,2] },
    { id: 'panais',         label: 'Panais',          emoji: '🥕', category: 'legumes', type: 'annual', waterDays: 5, calendar: [0,0,1,1,2,2,2,2,2,3,3,3] },
    { id: 'scarole',        label: 'Scarole',         emoji: '🥗', category: 'legumes', type: 'annual', waterDays: 3, calendar: [0,0,1,1,2,2,3,3,3,2,1,0] },
    { id: 'ail',            label: 'Ail',             emoji: '🧄', category: 'legumes', type: 'annual', waterDays: 8, calendar: [0,0,0,0,0,0,2,2,2,1,1,1] },
  ],

  // ── Fruits ──────────────────────────────────────────────────────────────────

  fruits: [
    { id: 'fraise',        label: 'Fraise',        emoji: '🍓', category: 'fruits', type: 'annual',   waterDays: 2, calendar: [0,0,1,2,3,3,3,2,1,0,0,0] },
    { id: 'melon',         label: 'Melon',         emoji: '🍈', category: 'fruits', type: 'annual',   waterDays: 3, calendar: [0,0,0,1,1,2,2,3,3,0,0,0] },
    { id: 'pasteque',      label: 'Pastèque',      emoji: '🍉', category: 'fruits', type: 'annual',   waterDays: 3, calendar: [0,0,0,1,1,2,2,3,3,0,0,0] },
    { id: 'tomate-cerise', label: 'Tomate cerise', emoji: '🍒', category: 'fruits', type: 'annual',   waterDays: 2, calendar: [0,1,1,1,2,2,3,3,3,3,0,0] },
    { id: 'physalis',      label: 'Physalis',      emoji: '🧡', category: 'fruits', type: 'annual',   waterDays: 3, calendar: [0,0,1,1,2,2,3,3,3,0,0,0] },
    { id: 'framboise',     label: 'Framboise',     emoji: '🍇', category: 'fruits', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'myrtille',      label: 'Myrtille',      emoji: '🫐', category: 'fruits', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'groseille',     label: 'Groseille',     emoji: '🍇', category: 'fruits', type: 'perennial', waterDays: 4, calendar: null },
    { id: 'cassis',        label: 'Cassis',        emoji: '🫐', category: 'fruits', type: 'perennial', waterDays: 4, calendar: null },
    { id: 'raisin',        label: 'Raisin',        emoji: '🍇', category: 'fruits', type: 'perennial', waterDays: 6, calendar: null },
  ],

  // ── Aromatiques ─────────────────────────────────────────────────────────────

  aromatiques: [
    // Annuelles
    { id: 'basilic',    label: 'Basilic',    emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 2,  calendar: [0,0,0,1,2,3,3,3,0,0,0,0] },
    { id: 'persil',     label: 'Persil',     emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 2,  calendar: [0,0,1,2,3,3,3,3,3,3,2,0] },
    { id: 'menthe',     label: 'Menthe',     emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 2,  calendar: [0,0,1,2,3,3,3,3,3,2,1,0] },
    { id: 'ciboulette', label: 'Ciboulette', emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 3,  calendar: [0,0,1,2,3,3,3,3,3,3,2,0] },
    { id: 'coriandre',  label: 'Coriandre',  emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 2,  calendar: [0,0,1,2,3,3,0,1,2,3,0,0] },
    { id: 'aneth',      label: 'Aneth',      emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 2,  calendar: [0,0,1,2,3,3,3,0,0,0,0,0] },
    { id: 'cerfeuil',   label: 'Cerfeuil',   emoji: '🌿', category: 'aromatiques', type: 'annual',    waterDays: 3,  calendar: [1,1,2,3,3,0,0,1,2,3,3,1] },
    // Vivaces
    { id: 'estragon',   label: 'Estragon',   emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 4,  calendar: null },
    { id: 'sauge',      label: 'Sauge',      emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 7,  calendar: null },
    { id: 'thym',       label: 'Thym',       emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 10, calendar: null },
    { id: 'origan',     label: 'Origan',     emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 7,  calendar: null },
    { id: 'romarin',    label: 'Romarin',    emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 12, calendar: null },
    { id: 'lavande',    label: 'Lavande',    emoji: '💜', category: 'aromatiques', type: 'perennial', waterDays: 14, calendar: null },
    { id: 'melisse',    label: 'Mélisse',    emoji: '🌿', category: 'aromatiques', type: 'perennial', waterDays: 4,  calendar: null },
  ],

  // ── Fleurs ──────────────────────────────────────────────────────────────────

  fleurs: [
    { id: 'tournesol',  label: 'Tournesol',  emoji: '🌻', category: 'fleurs', type: 'annual',    waterDays: 4, calendar: [0,0,0,1,2,3,3,3,0,0,0,0] },
    { id: 'capucine',   label: 'Capucine',   emoji: '🌺', category: 'fleurs', type: 'annual',    waterDays: 3, calendar: [0,0,0,1,2,3,3,3,0,0,0,0] },
    { id: 'souci',      label: 'Souci',      emoji: '🌼', category: 'fleurs', type: 'annual',    waterDays: 3, calendar: [0,0,1,2,3,3,3,0,0,0,0,0] },
    { id: 'cosmos',     label: 'Cosmos',     emoji: '🌸', category: 'fleurs', type: 'annual',    waterDays: 4, calendar: [0,0,0,1,2,3,3,3,0,0,0,0] },
    { id: 'dahlia',     label: 'Dahlia',     emoji: '🌺', category: 'fleurs', type: 'annual',    waterDays: 3, calendar: [0,0,0,1,2,3,3,3,2,0,0,0] },
    { id: 'pensee',     label: 'Pensée',     emoji: '🌸', category: 'fleurs', type: 'annual',    waterDays: 2, calendar: [0,0,1,2,3,3,0,0,1,2,3,0] },
    { id: 'rose',       label: 'Rose',       emoji: '🌹', category: 'fleurs', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'marguerite', label: 'Marguerite', emoji: '🌼', category: 'fleurs', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'geranium',   label: 'Géranium',   emoji: '🌺', category: 'fleurs', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'pivoine',    label: 'Pivoine',    emoji: '🌸', category: 'fleurs', type: 'perennial', waterDays: 4, calendar: null },
  ],

  // ── Arbres ──────────────────────────────────────────────────────────────────

  arbres: [
    { id: 'pommier',    label: 'Pommier',    emoji: '🍎', category: 'arbres', type: 'perennial', waterDays: 10, calendar: null },
    { id: 'poirier',    label: 'Poirier',    emoji: '🍐', category: 'arbres', type: 'perennial', waterDays: 10, calendar: null },
    { id: 'cerisier',   label: 'Cerisier',   emoji: '🍒', category: 'arbres', type: 'perennial', waterDays: 8,  calendar: null },
    { id: 'prunier',    label: 'Prunier',    emoji: '🍑', category: 'arbres', type: 'perennial', waterDays: 10, calendar: null },
    { id: 'figuier',    label: 'Figuier',    emoji: '🌿', category: 'arbres', type: 'perennial', waterDays: 7,  calendar: null },
    { id: 'citronnier', label: 'Citronnier', emoji: '🍋', category: 'arbres', type: 'perennial', waterDays: 5,  calendar: null },
    { id: 'olivier',    label: 'Olivier',    emoji: '🫒', category: 'arbres', type: 'perennial', waterDays: 14, calendar: null },
    { id: 'noisetier',  label: 'Noisetier',  emoji: '🌰', category: 'arbres', type: 'perennial', waterDays: 10, calendar: null },
    { id: 'murier',     label: 'Mûrier',     emoji: '🫐', category: 'arbres', type: 'perennial', waterDays: 7,  calendar: null },
    { id: 'abricotier', label: 'Abricotier', emoji: '🍑', category: 'arbres', type: 'perennial', waterDays: 8,  calendar: null },
    { id: 'cognassier', label: 'Cognassier', emoji: '🍏', category: 'arbres', type: 'perennial', waterDays: 12, calendar: null },
    { id: 'pecher',     label: 'Pêcher',     emoji: '🍑', category: 'arbres', type: 'perennial', waterDays: 10, calendar: null },
  ],

  // ── Vivaces ─────────────────────────────────────────────────────────────────

  vivaces: [
    { id: 'fraisier',    label: 'Fraisier',    emoji: '🍓', category: 'vivaces', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'framboisier', label: 'Framboisier', emoji: '🍇', category: 'vivaces', type: 'perennial', waterDays: 4, calendar: null },
    { id: 'groseillier', label: 'Groseillier', emoji: '🍇', category: 'vivaces', type: 'perennial', waterDays: 5, calendar: null },
    { id: 'cassissier',  label: 'Cassissier',  emoji: '🫐', category: 'vivaces', type: 'perennial', waterDays: 5, calendar: null },
    { id: 'myrtillier',  label: 'Myrtillier',  emoji: '🫐', category: 'vivaces', type: 'perennial', waterDays: 4, calendar: null },
    { id: 'asperge',     label: 'Asperge',     emoji: '🌱', category: 'vivaces', type: 'perennial', waterDays: 5, calendar: null },
    { id: 'artichaut',   label: 'Artichaut',   emoji: '🌿', category: 'vivaces', type: 'perennial', waterDays: 3, calendar: null },
    { id: 'rhubarbe',    label: 'Rhubarbe',    emoji: '🌿', category: 'vivaces', type: 'perennial', waterDays: 5, calendar: null },
  ],
}

// ── Flat array & helpers ─────────────────────────────────────────────────────

export const PLANTS_UNIFIED = Object.values(PLANTS_BY_CATEGORY_UNIFIED).flat()

export function getPlantById(id) {
  return PLANTS_UNIFIED.find(p => p.id === id) ?? null
}

export function getPlantsByCategory(category) {
  return PLANTS_BY_CATEGORY_UNIFIED[category] ?? []
}
