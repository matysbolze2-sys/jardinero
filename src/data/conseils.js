// Conseils mensuels statiques — un tableau de 12 entrées (Jan → Déc)
// Chaque entrée : titre + liste de conseils pratiques pour le mois

export const CONSEILS_MENSUELS = [
  // Janvier
  {
    humeur: 'Repos du jardin',
    emoji:  '❄️',
    intro:  'Le potager se repose. C\'est le moment de planifier et de préparer.',
    conseils: [
      'Commandez vos graines en catalogue pour la saison à venir.',
      'Protégez vos légumes d\'hiver (poireaux, épinards) avec un voile de forçage si gel annoncé.',
      'Amandez votre sol avec du compost en surface — les vers se chargent du reste.',
      'Nettoyez et affûtez vos outils avant la reprise.',
    ],
  },
  // Février
  {
    humeur: 'Les premières semences',
    emoji:  '🌡️',
    intro:  'Les jours rallongent. On peut démarrer les premiers semis sous abri.',
    conseils: [
      'Semez tomates et poivrons en godets sous abri chauffé (20°C minimum).',
      'Plantez des pommes de terre germées dans des bacs si vous avez un abri.',
      'Bêchez légèrement les plates-bandes et apportez du compost.',
      'Vérifiez vos réserves de semences — testez la germination sur papier humide.',
    ],
  },
  // Mars
  {
    humeur: 'Le réveil du jardin',
    emoji:  '🌿',
    intro:  'Le sol se réchauffe. La saison démarre vraiment.',
    conseils: [
      'Semez carottes, radis et salades directement en pleine terre.',
      'Plantez les échalotes et les oignons blancs.',
      'Continuez les semis de tomates et poivrons sous abri si pas encore fait.',
      'Attention aux gelées nocturnes encore possibles — gardez un voile à portée de main.',
    ],
  },
  // Avril
  {
    humeur: 'Pleine activité',
    emoji:  '🌸',
    intro:  'Le jardin s\'éveille pleinement. Beaucoup à faire mais c\'est la belle période.',
    conseils: [
      'Semez haricots, courgettes et concombres sous abri ou en pleine terre (après le 15).',
      'Repliquez vos plants de tomates en pots plus grands.',
      'Arrosez régulièrement en cas de sécheresse printanière.',
      'Binez entre les rangs pour éliminer les mauvaises herbes naissantes.',
    ],
  },
  // Mai
  {
    humeur: 'Plantations de printemps',
    emoji:  '☀️',
    intro:  'Les Saints de Glace passés (11-13 mai), on peut tout planter dehors.',
    conseils: [
      'Transplantez tomates, poivrons et aubergines en pleine terre après le 15 mai.',
      'Plantez courgettes et concombres directement au jardin.',
      'Paillez le sol autour des plants pour conserver l\'humidité.',
      'Installez des tuteurs et des filets anti-insectes selon les besoins.',
    ],
  },
  // Juin
  {
    humeur: 'Arrosage et surveillance',
    emoji:  '🌞',
    intro:  'La chaleur s\'installe. L\'arrosage devient la priorité.',
    conseils: [
      'Arrosez tôt le matin ou le soir pour limiter l\'évaporation.',
      'Récoltez salades et radis avant qu\'ils ne montent en graines.',
      'Taillez et ébourgeonnez les tomates : retirez les gourmands.',
      'Semez des haricots en décalé pour une récolte étalée.',
    ],
  },
  // Juillet
  {
    humeur: 'Pleine récolte',
    emoji:  '🧺',
    intro:  'Les premières grosses récoltes arrivent. Profitez !',
    conseils: [
      'Récoltez tomates, courgettes et concombres régulièrement pour stimuler la production.',
      'Arrosez en profondeur plutôt que souvent — favorise les racines profondes.',
      'Éliminez les feuilles malades immédiatement pour éviter la propagation.',
      'Paillez épais sous les tomates pour prévenir les éclaboussures de terre.',
    ],
  },
  // Août
  {
    humeur: 'Abondance et récoltes',
    emoji:  '🍅',
    intro:  'Le jardin est à son pic. Anticipez aussi la fin de saison.',
    conseils: [
      'Récoltez quotidiennement — les courgettes géantes n\'ont aucune valeur gustative.',
      'Semez épinards et mâche pour l\'automne.',
      'Arrosez le soir pour éviter les coups de chaud.',
      'Préparez-vous à conserver ou partager les surplus (congélation, bocaux).',
    ],
  },
  // Septembre
  {
    humeur: 'La fin de l\'été',
    emoji:  '🍂',
    intro:  'Les nuits fraîchissent. On bascule vers les légumes d\'automne.',
    conseils: [
      'Récoltez courges et potirons avant les premières gelées.',
      'Arrachez les plants épuisés et compostez-les.',
      'Semez en place : mâche, épinards, navets et radis d\'hiver.',
      'Plantez les oignons blancs d\'automne et les ails.',
    ],
  },
  // Octobre
  {
    humeur: 'Rangement et préparation',
    emoji:  '🌾',
    intro:  'Le potager se prépare pour l\'hiver. Beaucoup de rangement à faire.',
    conseils: [
      'Arrachez et compostez les tiges de tomates et courgettes.',
      'Rentrez les dernières courges — elles se conservent plusieurs mois au sec.',
      'Apportez du compost en surface sur toutes les plates-bandes vides.',
      'Plantez l\'ail d\'hiver pour une récolte en juin.',
    ],
  },
  // Novembre
  {
    humeur: 'Le jardin s\'endort',
    emoji:  '🍃',
    intro:  'La saison s\'achève. C\'est le moment de soigner la terre pour l\'année prochaine.',
    conseils: [
      'Protégez les légumes restants (poireaux, choux) avec un voile ou de la paille.',
      'Enfouissez un engrais vert semé plus tôt (phacélie, moutarde).',
      'Nettoyez les outils et rangez-les après les avoir huilés.',
      'Passez en revue vos semences et notez ce qui a bien marché cette année.',
    ],
  },
  // Décembre
  {
    humeur: 'Bilan et planification',
    emoji:  '📖',
    intro:  'Le potager est en sommeil. C\'est le moment idéal pour planifier.',
    conseils: [
      'Feuilletez les catalogues de graines et commandez pour la saison prochaine.',
      'Faites le bilan : qu\'est-ce qui a bien marché ? Qu\'est-ce qui a raté ?',
      'Améliorez votre composteur si besoin — profitez de l\'hiver.',
      'Réfléchissez à vos rotations de cultures pour éviter les maladies.',
    ],
  },
]
