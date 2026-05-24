// Diagnostics statiques par symptôme
// urgence : 'haute' | 'moyenne' | 'basse'

export const DIAGNOSTICS = {
  universel: [
    {
      symptome: "Feuilles qui jaunissent",
      cause: "Manque d'azote ou excès d'eau",
      solution: "Réduire l'arrosage et apporter du compost bien décomposé au pied de la plante",
      urgence: "moyenne",
    },
    {
      symptome: "Feuilles qui brunissent et sèchent",
      cause: "Manque d'eau ou coup de soleil",
      solution: "Arroser en profondeur le soir et pailler le sol pour conserver l'humidité",
      urgence: "haute",
    },
    {
      symptome: "Petits insectes verts ou noirs sous les feuilles",
      cause: "Pucerons",
      solution: "Pulvériser de l'eau savonneuse (1 cuillère de savon noir dans 1 L d'eau) le matin pendant 3 jours",
      urgence: "haute",
    },
    {
      symptome: "Taches blanches poudreuses sur les feuilles",
      cause: "Oïdium (champignon)",
      solution: "Pulvériser du bicarbonate de soude dilué (1 cuillère pour 1 L d'eau) et améliorer la circulation d'air",
      urgence: "moyenne",
    },
    {
      symptome: "Taches noires ou brunes sur les feuilles",
      cause: "Mildiou ou maladie fongique",
      solution: "Retirer les feuilles atteintes, ne plus mouiller le feuillage et traiter à la bouillie bordelaise",
      urgence: "haute",
    },
    {
      symptome: "La plante ne pousse plus",
      cause: "Sol tassé, manque de nutriments ou racines à l'étroit",
      solution: "Aérer le sol en surface avec une griffe, apporter du compost et vérifier que le pot est assez grand",
      urgence: "basse",
    },
    {
      symptome: "Trous dans les feuilles",
      cause: "Limaces ou chenilles",
      solution: "Poser des pièges à bière pour les limaces ou ramasser les chenilles à la main le soir",
      urgence: "moyenne",
    },
    {
      symptome: "Plante qui s'affaisse et tombe",
      cause: "Excès d'eau ou maladie des racines",
      solution: "Cesser d'arroser plusieurs jours, vérifier que le drainage est suffisant et retirer les parties pourries",
      urgence: "haute",
    },
  ],
  tomate: [
    {
      symptome: "Tomates qui noircissent par le bas",
      cause: "Nécrose apicale, manque de calcium",
      solution: "Arroser régulièrement et uniformément, éviter les excès ou manques d'eau brusques",
      urgence: "moyenne",
    },
    {
      symptome: "Tomates qui éclatent ou se fendent",
      cause: "Arrosage irrégulier après une période sèche",
      solution: "Maintenir un arrosage régulier et pailler le sol pour stabiliser l'humidité",
      urgence: "basse",
    },
  ],
  courgette: [
    {
      symptome: "Les fleurs tombent sans donner de fruit",
      cause: "Manque de pollinisation ou températures trop basses",
      solution: "Polliniser manuellement avec un pinceau entre une fleur mâle et une fleur femelle le matin",
      urgence: "moyenne",
    },
  ],
  carotte: [
    {
      symptome: "Carottes fourchues ou tordues",
      cause: "Sol trop compact ou caillouteux",
      solution: "Ameublir le sol en profondeur (40 cm) avant de semer et retirer les cailloux",
      urgence: "basse",
    },
  ],
  'pomme-terre': [
    {
      symptome: "Feuilles avec taches brunes qui se propagent vite",
      cause: "Mildiou, maladie grave de la pomme de terre",
      solution: "Retirer et brûler les feuilles atteintes immédiatement, traiter à la bouillie bordelaise, ne pas composter",
      urgence: "haute",
    },
  ],
  epinard: [
    {
      symptome: "Montée en graines prématurée",
      cause: "Jours trop longs ou chaleur excessive",
      solution: "Semer à l'automne ou très tôt au printemps, choisir des variétés résistantes à la montaison",
      urgence: "basse",
    },
  ],
  haricot: [
    {
      symptome: "Gousses vides ou mal formées",
      cause: "Pollinisation insuffisante ou stress hydrique pendant la floraison",
      solution: "Arroser régulièrement à la floraison et éviter de travailler le sol autour",
      urgence: "moyenne",
    },
  ],
  salade: [
    {
      symptome: "Feuilles molles et translucides",
      cause: "Coup de gel ou brûlure de l'eau",
      solution: "Protéger avec un voile de forçage la nuit, arroser au pied et non sur les feuilles",
      urgence: "haute",
    },
  ],
}

const URGENCE_CONFIG = {
  haute:   { label: 'Urgent',  bg: '#FEE2E2', color: '#B91C1C', badge: '#EF4444' },
  moyenne: { label: 'Modéré',  bg: '#FFF7ED', color: '#C27C12', badge: '#F97316' },
  basse:   { label: 'Mineur',  bg: '#F3F4F6', color: '#4B5563', badge: '#9CA3AF' },
}

export function getUrgenceConfig(urgence) {
  return URGENCE_CONFIG[urgence] ?? URGENCE_CONFIG.basse
}

// Retourne la liste des symptômes pour une plante : spécifiques d'abord, puis universels
export function getSymptomsForPlant(plantId) {
  const specifiques = DIAGNOSTICS[plantId] ?? []
  const universels  = DIAGNOSTICS.universel ?? []
  return [
    ...specifiques.map(d => ({ ...d, _specific: true })),
    ...universels.map(d => ({ ...d, _specific: false })),
  ]
}
