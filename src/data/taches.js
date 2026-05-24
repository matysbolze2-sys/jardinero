// Tâches hebdomadaires automatiques
// mois : tableau de numéros 1–12
// plante : id de plante (optionnel, si absent = tâche universelle)

export const TACHES = [
  // ── Universelles par mois ─────────────────────────────────────────────────
  { mois: [3,4,5],    tache: "Biner la terre entre les rangs pour éviter les mauvaises herbes",         icone: "🪴" },
  { mois: [4,5,6],    tache: "Semer en godets et placer en pleine lumière, protéger des gelées nocturnes", icone: "🌱" },
  { mois: [6,7,8],    tache: "Arroser tôt le matin ou en soirée, jamais en pleine chaleur",              icone: "💧" },
  { mois: [6,7,8],    tache: "Surveiller l'apparition de pucerons sous les feuilles",                   icone: "🔍" },
  { mois: [7,8,9],    tache: "Récolter régulièrement pour stimuler la production",                       icone: "🧺" },
  { mois: [9,10],     tache: "Préparer le compost avec les feuilles mortes",                             icone: "🍂" },
  { mois: [10,11],    tache: "Pailler les pieds des plantes pour protéger du gel",                       icone: "🌾" },
  { mois: [11,12,1],  tache: "Nettoyer et ranger les outils, les huiler pour l'hiver",                   icone: "🔧" },
  { mois: [1,2,12],   tache: "Planifier les rotations de culture pour la saison à venir",                icone: "📋" },
  { mois: [2,3],      tache: "Préparer les semences pour les semis de printemps",                        icone: "🌱" },
  { mois: [3,4],      tache: "Amender le sol avec du compost avant les premières plantations",           icone: "🌍" },
  // ── Par plante ────────────────────────────────────────────────────────────
  { plante: "tomate",       mois: [5,6],     tache: "Installer les tuteurs pour soutenir les plants de tomates",          icone: "🪵" },
  { plante: "tomate",       mois: [6,7,8],   tache: "Ébourgeonner les gourmands des tomates chaque semaine",              icone: "✂️" },
  { plante: "tomate",       mois: [7,8],     tache: "Retirer les feuilles du bas en contact avec le sol (mildiou)",       icone: "🍃" },
  { plante: "courgette",    mois: [6,7,8],   tache: "Récolter les courgettes avant qu'elles deviennent trop grosses",     icone: "🥒" },
  { plante: "courgette",    mois: [5,6],     tache: "Polliniser les fleurs à la main si peu d'insectes",                  icone: "🌸" },
  { plante: "carotte",      mois: [4,5],     tache: "Éclaircir les carottes à 5 cm d'espacement",                         icone: "🥕" },
  { plante: "carotte",      mois: [3,4,5],   tache: "Maintenir le sol humide jusqu'à la levée (2–3 semaines)",            icone: "💧" },
  { plante: "pomme-terre",  mois: [5,6],     tache: "Butter les pommes de terre quand les tiges font 20 cm",              icone: "🥔" },
  { plante: "pomme-terre",  mois: [6,7],     tache: "Surveiller les signes de mildiou sur le feuillage",                  icone: "🔍" },
  { plante: "poireau",      mois: [7,8],     tache: "Butter les poireaux pour les faire blanchir",                        icone: "🧅" },
  { plante: "salade",       mois: [4,5,6],   tache: "Récolter les salades le matin pour plus de fraîcheur",               icone: "🥗" },
  { plante: "haricot",      mois: [6,7],     tache: "Arroser les haricots régulièrement pendant la floraison",            icone: "🫘" },
  { plante: "oignon",       mois: [7,8],     tache: "Arrêter d'arroser quand les feuilles tombent (maturation)",          icone: "🧅" },
  { plante: "concombre",    mois: [6,7,8],   tache: "Pincer l'extrémité des tiges pour favoriser la ramification",        icone: "🥒" },
  { plante: "poivron",      mois: [5,6],     tache: "Protéger les poivrons du vent, abri ou tuteur léger",                icone: "🫑" },
  { plante: "epinard",      mois: [3,4,9,10],tache: "Récolter les feuilles du bas avant la montée en graines",            icone: "🌿" },
  { plante: "radis",        mois: [3,4,5],   tache: "Récolter les radis avant qu'ils deviennent creux (25–30 j)",         icone: "🔴" },
]

// Retourne les tâches pertinentes pour la semaine courante
// moisIdx : 0–11, plantIds : tableau d'ids de plantes dans le jardin
export function getTachesSemaine(moisIdx, plantIds, max = 5) {
  const mois = moisIdx + 1
  const relevant = TACHES.filter(t => {
    if (!t.mois.includes(mois)) return false
    if (t.plante && !plantIds.includes(t.plante)) return false
    return true
  })
  const specifiques  = relevant.filter(t => t.plante)
  const universelles = relevant.filter(t => !t.plante)
  return [...specifiques, ...universelles].slice(0, max)
}

// Clé de semaine = date du lundi de la semaine courante (YYYY-MM-DD)
export function getWeekKey() {
  const d = new Date()
  const day = d.getDay() // 0=dim
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return monday.toISOString().split('T')[0]
}
