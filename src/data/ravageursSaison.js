// ─────────────────────────────────────────────────────────────────────────────
// Ravageurs & maladies saisonnières — données de référence pour le climat français.
// Croise le mois en cours × les plantes du jardin → conseils de prévention ciblés.
// 100 % statique : zéro appel IA, zéro réseau, fonctionne hors-ligne.
//
// Champs d'un risque :
//   mois       : numéros 1-12 (période à risque)
//   cibles     : plantIds (ex 'tomate') OU familles de rotation.js préfixées 'fam:'
//                (ex 'fam:Brassicacées'), résolues via PLANTE_FAMILLE
//   gravite    : 'forte' | 'moderee'
//   signes     : ce que l'utilisateur peut observer
//   prevention : action concrète AVANT les dégâts
//   conseilCourt : accroche d'une ligne pour l'insight Home (optionnel)
// ─────────────────────────────────────────────────────────────────────────────

import { getFamillePlante } from './rotation'

export const GRAVITE_LABEL = {
  forte:   'risque fort',
  moderee: 'risque modéré',
}

export const RISQUES_SAISON = [
  {
    id: 'mildiou-tomate',
    nom: 'Mildiou',
    emoji: '🍄',
    mois: [6, 7, 8, 9],
    cibles: ['tomate', 'pomme-terre'],
    gravite: 'forte',
    signes: 'Taches brunes huileuses sur les feuilles et les tiges, duvet blanchâtre au revers, fruits qui brunissent et pourrissent.',
    prevention: "N'arrose jamais le feuillage : arrose au pied, le matin. Espace et tuteure les plants pour aérer, retire les feuilles basses, et paille le sol. Traite préventivement à la bouillie bordelaise avant les périodes humides.",
    conseilCourt: "évite d'arroser le feuillage et aère les plants",
  },
  {
    id: 'oidium',
    nom: 'Oïdium',
    emoji: '🤍',
    mois: [5, 6, 7, 8, 9],
    cibles: ['fam:Cucurbitacées'],
    gravite: 'moderee',
    signes: 'Feutrage blanc poudreux sur le dessus des feuilles, qui jaunissent puis se dessèchent.',
    prevention: "Arrose au pied sans mouiller le feuillage et évite les excès d'azote. Aère en supprimant les feuilles atteintes. Pulvérise du bicarbonate (5 g/L + un peu de savon noir) dès les premières taches.",
  },
  {
    id: 'doryphore',
    nom: 'Doryphore',
    emoji: '🪲',
    mois: [5, 6, 7, 8],
    cibles: ['pomme-terre', 'aubergine'],
    gravite: 'forte',
    signes: 'Coléoptères rayés jaune et noir, larves rouges dodues, feuilles dévorées jusqu\'aux nervures.',
    prevention: "Inspecte le dessous des feuilles chaque semaine et écrase les pontes orange. Ramasse adultes et larves à la main dès leur apparition. Un paillage épais gêne la remontée des adultes au printemps.",
    conseilCourt: 'inspecte le dessous des feuilles et retire larves et pontes',
  },
  {
    id: 'pieride-chou',
    nom: 'Piéride du chou',
    emoji: '🦋',
    mois: [4, 5, 6, 7, 8, 9],
    cibles: ['fam:Brassicacées'],
    gravite: 'moderee',
    signes: 'Papillons blancs, œufs jaunes en amas sous les feuilles, chenilles vertes qui criblent le feuillage de trous.',
    prevention: 'Pose un filet anti-insectes dès la plantation. Inspecte le revers des feuilles et retire les amas d\'œufs. Le purin d\'ortie et la présence d\'aromates à proximité limitent les pontes.',
  },
  {
    id: 'mouche-carotte',
    nom: 'Mouche de la carotte',
    emoji: '🪰',
    mois: [5, 6, 8, 9],
    cibles: ['fam:Apiacées'],
    gravite: 'moderee',
    signes: 'Feuillage rougissant puis jaunissant, galeries brunes creusées dans les racines par les asticots.',
    prevention: 'Protège le semis d\'un voile anti-insectes. Sème clair pour éviter d\'éclaircir (l\'odeur attire la mouche) ou éclaircis le soir. Associe carottes et oignons/poireaux pour brouiller les pistes.',
  },
  {
    id: 'pucerons',
    nom: 'Pucerons',
    emoji: '🐛',
    mois: [4, 5, 6],
    cibles: ['fam:Solanacées', 'fam:Cucurbitacées', 'fam:Brassicacées', 'fam:Légumineuses', 'fam:Apiacées', 'fam:Astéracées'],
    gravite: 'moderee',
    signes: 'Amas de petits insectes verts ou noirs sous les feuilles et sur les jeunes pousses, feuilles collantes et recroquevillées, fourmis actives.',
    prevention: 'Favorise les coccinelles et syrphes (fleurs mellifères à proximité). Douche les colonies au jet d\'eau puis pulvérise de l\'eau savonneuse (savon noir) le matin. Évite les excès d\'azote qui attirent les pucerons.',
  },
  {
    id: 'limaces',
    nom: 'Limaces & escargots',
    emoji: '🐌',
    mois: [3, 4, 5, 9, 10],
    cibles: ['fam:Astéracées', 'fam:Brassicacées', 'fam:Chénopodiacées'],
    gravite: 'moderee',
    signes: 'Jeunes plants et feuilles dévorés du jour au lendemain, traces de mucus argenté visibles au petit matin, surtout par temps humide.',
    prevention: 'Arrose le matin plutôt que le soir pour un sol sec la nuit. Installe des barrières (cendre, coquilles, marc de café) autour des semis et des pièges à bière. Ramasse à la main à la tombée du jour.',
  },
  {
    id: 'altises',
    nom: 'Altises',
    emoji: '🦗',
    mois: [4, 5, 6],
    cibles: ['fam:Brassicacées'],
    gravite: 'moderee',
    signes: 'Multitude de petits trous ronds criblant les jeunes feuilles (radis, roquette, choux), surtout par temps sec et chaud.',
    prevention: 'Maintiens le sol frais et humide (les altises détestent l\'humidité) et arrose en pluie fine. Pose un voile anti-insectes sur les jeunes semis et évite les semis en pleine sécheresse.',
  },
  {
    id: 'teigne-poireau',
    nom: 'Teigne du poireau',
    emoji: '🪱',
    mois: [4, 5, 8, 9],
    cibles: ['fam:Alliacées'],
    gravite: 'moderee',
    signes: 'Stries blanchâtres longitudinales sur les feuilles, galeries dans le fût, pourriture qui s\'installe au cœur du poireau.',
    prevention: 'Couvre la culture d\'un filet anti-insectes pendant les vols (printemps et fin d\'été). Retire et détruis les feuilles atteintes. Pratique la rotation et éloigne les nouvelles plantations des anciennes.',
  },
  {
    id: 'cul-noir-tomate',
    nom: 'Cul noir (nécrose apicale)',
    emoji: '🍅',
    mois: [7, 8],
    cibles: ['tomate', 'poivron', 'aubergine'],
    gravite: 'moderee',
    signes: 'Tache brun-noir, plate et cuirée, sur le dessous du fruit. Trouble physiologique (carence en calcium) lié à un arrosage irrégulier, pas une maladie contagieuse.',
    prevention: "Arrose régulièrement, sans à-coups, et paille le sol pour lisser l'humidité. Évite les excès d'azote et vérifie que le sol n'est pas trop acide (le calcium se fixe mal en sol déséquilibré).",
  },
  {
    id: 'fonte-semis',
    nom: 'Fonte des semis',
    emoji: '🌱',
    mois: [2, 3, 4],
    cibles: [
      'fam:Solanacées', 'fam:Cucurbitacées', 'fam:Brassicacées', 'fam:Apiacées',
      'fam:Astéracées', 'fam:Chénopodiacées', 'fam:Alliacées', 'fam:Légumineuses',
    ],
    gravite: 'moderee',
    signes: 'Jeunes plantules qui s\'affaissent au niveau du collet, tige étranglée et brunie, semis qui ne lèvent pas ou s\'effondrent en masse.',
    prevention: 'Sème moins dense dans un terreau sain, à bonne température. Évite l\'excès d\'eau et d\'humidité stagnante, aère chaque jour les semis sous abri. Arrose de préférence par le bas et à l\'eau non froide.',
  },
]

// Résout une cible ('plantId' ou 'fam:Famille') contre une plante du profil.
function cibleMatchePlante(cible, plant) {
  if (cible.startsWith('fam:')) {
    return getFamillePlante(plant.plantId) === cible.slice(4)
  }
  return plant.plantId === cible
}

// Risques actifs ce mois-ci pour les plantes du jardin de l'utilisateur.
// Retourne [{ risque, plantesTouchees }], gravité forte en premier.
export function getRisquesActifs(plants, date = new Date()) {
  if (!plants?.length) return []
  const mois = date.getMonth() + 1 // getMonth() est 0-indexé

  const actifs = []
  for (const risque of RISQUES_SAISON) {
    if (!risque.mois.includes(mois)) continue
    const plantesTouchees = plants.filter(p =>
      risque.cibles.some(cible => cibleMatchePlante(cible, p))
    )
    if (plantesTouchees.length > 0) {
      actifs.push({ risque, plantesTouchees })
    }
  }

  // Gravité forte d'abord, en préservant l'ordre de déclaration à gravité égale
  const rang = { forte: 0, moderee: 1 }
  return actifs.sort((a, b) => rang[a.risque.gravite] - rang[b.risque.gravite])
}
