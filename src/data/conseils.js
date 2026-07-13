// Conseils mensuels statiques — un tableau de 12 entrées (Jan → Déc)
// Chaque entrée : titre + liste de conseils pratiques pour le mois

export const CONSEILS_MENSUELS = [
  // Janvier
  {
    humeur: 'Repos du jardin',
    emoji:  '❄️',
    intro:  'Le potager se repose. C\'est le moment de planifier et de préparer.',
    conseils: [
      'Commande tes graines en catalogue pour la saison à venir.',
      'Protège tes légumes d\'hiver (poireaux, épinards) avec un voile de forçage si gel annoncé.',
      'Amende ton sol avec du compost en surface — les vers se chargent du reste.',
      'Nettoie et affûte tes outils avant la reprise.',
    ],
  },
  // Février
  {
    humeur: 'Les premières semences',
    emoji:  '🌡️',
    intro:  'Les jours rallongent. On peut démarrer les premiers semis sous abri.',
    conseils: [
      'Sème tomates et poivrons en godets sous abri chauffé (20°C minimum).',
      'Plante des pommes de terre germées dans des bacs si tu as un abri.',
      'Bêche légèrement les plates-bandes et apporte du compost.',
      'Vérifie tes réserves de semences — teste la germination sur papier humide.',
    ],
  },
  // Mars
  {
    humeur: 'Le réveil du jardin',
    emoji:  '🌿',
    intro:  'Le sol se réchauffe. La saison démarre vraiment.',
    conseils: [
      'Sème carottes, radis et salades directement en pleine terre.',
      'Plante les échalotes et les oignons blancs.',
      'Continue les semis de tomates et poivrons sous abri si pas encore fait.',
      'Attention aux gelées nocturnes encore possibles — garde un voile à portée de main.',
    ],
  },
  // Avril
  {
    humeur: 'Pleine activité',
    emoji:  '🌸',
    intro:  'Le jardin s\'éveille pleinement. Beaucoup à faire mais c\'est la belle période.',
    conseils: [
      'Sème haricots, courgettes et concombres sous abri ou en pleine terre (après le 15).',
      'Repique tes plants de tomates en pots plus grands.',
      'Arrose régulièrement en cas de sécheresse printanière.',
      'Bine entre les rangs pour éliminer les mauvaises herbes naissantes.',
    ],
  },
  // Mai
  {
    humeur: 'Plantations de printemps',
    emoji:  '☀️',
    intro:  'Les Saints de Glace passés (11-13 mai), on peut tout planter dehors.',
    conseils: [
      'Transplante tomates, poivrons et aubergines en pleine terre après le 15 mai.',
      'Plante courgettes et concombres directement au jardin.',
      'Paille le sol autour des plants pour conserver l\'humidité.',
      'Installe des tuteurs et des filets anti-insectes selon les besoins.',
    ],
  },
  // Juin
  {
    humeur: 'Arrosage et surveillance',
    emoji:  '🌞',
    intro:  'La chaleur s\'installe. L\'arrosage devient la priorité.',
    conseils: [
      'Arrose tôt le matin ou le soir pour limiter l\'évaporation.',
      'Récolte salades et radis avant qu\'ils ne montent en graines.',
      'Taille et ébourgeonne les tomates : retire les gourmands.',
      'Sème des haricots en décalé pour une récolte étalée.',
    ],
  },
  // Juillet
  {
    humeur: 'Pleine récolte',
    emoji:  '🧺',
    intro:  'Les premières grosses récoltes arrivent. Profites-en !',
    conseils: [
      'Récolte tomates, courgettes et concombres régulièrement pour stimuler la production.',
      'Arrose en profondeur plutôt que souvent — favorise les racines profondes.',
      'Élimine les feuilles malades immédiatement pour éviter la propagation.',
      'Paille épais sous les tomates pour prévenir les éclaboussures de terre.',
    ],
  },
  // Août
  {
    humeur: 'Abondance et récoltes',
    emoji:  '🍅',
    intro:  'Le jardin est à son pic. Anticipe aussi la fin de saison.',
    conseils: [
      'Récolte quotidiennement — les courgettes géantes n\'ont aucune valeur gustative.',
      'Sème épinards et mâche pour l\'automne.',
      'Arrose le soir pour éviter les coups de chaud.',
      'Prépare-toi à conserver ou partager les surplus (congélation, bocaux).',
    ],
  },
  // Septembre
  {
    humeur: 'La fin de l\'été',
    emoji:  '🍂',
    intro:  'Les nuits fraîchissent. On bascule vers les légumes d\'automne.',
    conseils: [
      'Récolte courges et potirons avant les premières gelées.',
      'Arrache les plants épuisés et composte-les.',
      'Sème en place : mâche, épinards, navets et radis d\'hiver.',
      'Plante les oignons blancs d\'automne et les ails.',
    ],
  },
  // Octobre
  {
    humeur: 'Rangement et préparation',
    emoji:  '🌾',
    intro:  'Le potager se prépare pour l\'hiver. Beaucoup de rangement à faire.',
    conseils: [
      'Arrache et composte les tiges de tomates et courgettes.',
      'Rentre les dernières courges — elles se conservent plusieurs mois au sec.',
      'Apporte du compost en surface sur toutes les plates-bandes vides.',
      'Plante l\'ail d\'hiver pour une récolte en juin.',
    ],
  },
  // Novembre
  {
    humeur: 'Le jardin s\'endort',
    emoji:  '🍃',
    intro:  'La saison s\'achève. C\'est le moment de soigner la terre pour l\'année prochaine.',
    conseils: [
      'Protège les légumes restants (poireaux, choux) avec un voile ou de la paille.',
      'Enfouis un engrais vert semé plus tôt (phacélie, moutarde).',
      'Nettoie les outils et range-les après les avoir huilés.',
      'Passe en revue tes semences et note ce qui a bien marché cette année.',
    ],
  },
  // Décembre
  {
    humeur: 'Bilan et planification',
    emoji:  '📖',
    intro:  'Le potager est en sommeil. C\'est le moment idéal pour planifier.',
    conseils: [
      'Feuillette les catalogues de graines et commande pour la saison prochaine.',
      'Fais le bilan : qu\'est-ce qui a bien marché ? Qu\'est-ce qui a raté ?',
      'Améliore ton composteur si besoin — profite de l\'hiver.',
      'Réfléchis à tes rotations de cultures pour éviter les maladies.',
    ],
  },
]
