// Types de sol disponibles à la sélection
export const SOILS = [
  {
    id:    'argileux',
    label: 'Argileux',
    emoji: '🟤',
    desc:  "Retient bien l'eau, lourd, tendance à former des mottes",
    tips:  'Aérez régulièrement et apportez du compost pour alléger.',
  },
  {
    id:    'sableux',
    label: 'Sableux',
    emoji: '🟡',
    desc:  'Drainage rapide, léger, se dessèche vite',
    tips:  "Arrosez plus souvent et paillez pour conserver l'humidité.",
  },
  {
    id:    'limoneux',
    label: 'Limoneux',
    emoji: '🟢',
    desc:  'Fertile, équilibré, idéal pour le potager',
    tips:  'Excellent sol — maintenez avec un apport de compost annuel.',
  },
  {
    id:    'humifere',
    label: 'Humifère',
    emoji: '⚫',
    desc:  'Riche en matière organique, sombre et souple',
    tips:  'Très fertile, veillez à ne pas tasser en travaillant humide.',
  },
  {
    id:    'inconnu',
    label: 'Je ne sais pas',
    emoji: '❓',
    desc:  'Conseils généraux prudents adaptés à tout type de sol',
    tips:  "Pas de problème ! Les conseils seront adaptés à votre sol.",
  },
]

// Retourne un sol par son id
export function getSoilById(id) {
  return SOILS.find(s => s.id === id) ?? SOILS.find(s => s.id === 'inconnu')
}
