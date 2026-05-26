// Conseils pratiques par plante et par stade
// Stades annuelles : sowed | growing | flowering | ready
// Stades vivaces   : perennial_growing | perennial_producing | perennial_dormant | perennial_longcycle

export const PLANT_ADVICE = {

  // ── Légumes annuelles ──────────────────────────────────────────────────────

  'tomate': {
    sowed: [
      "Maintiens le sol humide mais pas détrempé — la tomate germe entre 20 et 25°C",
      "Évite de laisser la surface sécher complètement les 10 premiers jours",
      "Si tu as semé sous abri, place les godets dans l'endroit le plus lumineux disponible",
    ],
    growing: [
      "Installe les tuteurs maintenant, avant que la tige ne prenne de la hauteur",
      "Pince les gourmands (pousses entre la tige et les feuilles) chaque semaine",
      "Apporte un engrais riche en potassium toutes les 2 semaines",
      "Arrose régulièrement et de façon uniforme — les alternances sèche/humide favorisent l'éclatement des fruits",
    ],
    flowering: [
      "Arrose au pied, jamais sur le feuillage — réduit fortement le risque de mildiou",
      "Retire les feuilles du bas qui touchent le sol",
      "Ne supprime pas les fleurs — chaque fleur est une future tomate",
      "Agite légèrement les tiges à la main si peu d'insectes — aide la pollinisation",
    ],
    ready: [
      "Récolte quand la tomate se détache facilement en tournant légèrement",
      "Récolte régulièrement pour stimuler la production des fruits suivants",
      "Les tomates se conservent à température ambiante — jamais au frigo (perd son goût)",
    ],
  },

  'courgette': {
    sowed: [
      "Sol chaud nécessaire (>15°C) — attends si le sol est encore froid",
      "Sème à 2-3 cm de profondeur, une graine tous les 60 cm",
    ],
    growing: [
      "La courgette pousse vite — surveille la taille des feuilles qui peuvent ombrager les voisines",
      "Arrose copieusement au pied : 2-3 litres par plant et par arrosage",
    ],
    flowering: [
      "Passe délicatement une fleur mâle (sans renflement à la base) sur une fleur femelle le matin",
      "La floraison est courte — un seul passage suffit par fleur",
      "Si les premières courgettes tombent avant de grossir, c'est un problème de pollinisation",
    ],
    ready: [
      "Récolte à 15-20 cm — les grosses courgettes n'ont plus de goût",
      "Vérifie tous les 2 jours — elles grossissent très vite",
      "Coupe avec un couteau propre sans tirer sur la tige",
    ],
  },

  'carotte': {
    sowed: [
      "Maintiens la surface du sol humide jusqu'à la levée — elle peut prendre 2 à 3 semaines",
      "Sème fin et en ligne, puis éclaircis à 5-8 cm une fois levée",
      "Évite de trop travailler le sol après le semis — une croûte superficielle empêche la levée",
    ],
    growing: [
      "Éclaircis à 10 cm minimum entre chaque plant si ce n'est pas encore fait",
      "Arrose régulièrement mais modérément — les carottes n'aiment pas les excès d'eau",
      "Bine légèrement entre les rangs pour aérer le sol sans blesser les racines",
    ],
    ready: [
      "Teste en arrachant une carotte : si elle est bien formée et colorée, elles sont prêtes",
      "Arrache par temps sec pour une meilleure conservation",
      "Les carottes peuvent rester en terre plusieurs semaines — arrachage progressif possible",
    ],
  },

  'salade': {
    sowed: [
      "Maintiens la surface humide — la salade germe rapidement (3-5 jours) par beau temps",
      "Sème en ligne fine, très peu en profondeur (recouvre juste les graines)",
    ],
    growing: [
      "Arrose le soir pour éviter l'évaporation et les brûlures de feuilles",
      "Éclaircis si les plants sont trop serrés — 25 cm d'espacement minimum",
    ],
    ready: [
      "Récolte le matin quand les feuilles sont encore fraîches et gorgées d'eau",
      "Coupe la pommette sans arracher le plant — il peut repartir pour une 2e coupe",
      "Si les feuilles du cœur commencent à monter, récolte sans attendre (montée en graines)",
    ],
  },

  'haricot': {
    sowed: [
      "Sème par temps chaud uniquement (sol >12°C) — les haricots pourrissent dans un sol froid",
      "Espace les graines de 10 cm, en lignes espacées de 40 cm",
    ],
    growing: [
      "Les haricots fixent l'azote de l'air — inutile d'apporter de l'engrais azoté",
      "Arrose régulièrement mais ne mouille pas le feuillage",
    ],
    flowering: [
      "Phase critique — un manque d'eau pendant la floraison fait tomber les fleurs sans fructification",
      "Ne bine plus le sol autour des pieds : les racines azotées sont superficielles",
    ],
    ready: [
      "Récolte avant que les grains ne forment de bosses visibles — qualité optimale",
      "Récolte régulièrement tous les 2-3 jours pour stimuler la production",
    ],
  },

  'radis': {
    sowed: [
      "Très facile et rapide — idéal pour marquer les rangées de légumes plus lents",
      "Maintiens humide : le radis germe en 3-4 jours si le sol est frais",
    ],
    growing: [
      "Arrose régulièrement pour éviter que les radis soient creux ou trop piquants",
      "Éclaircis si nécessaire — 5 cm minimum entre chaque plant",
    ],
    ready: [
      "Récolte dès que le radis fait environ 2 cm — il devient creux et piquant s'il attend",
      "Arrache en tenant la feuille du bas, proprement",
    ],
  },

  'poireau': {
    sowed: [
      "Sème en godets ou en pépinière — le repiquage se fait quand les plants font 15-20 cm",
      "Germination lente (10-15 jours) — maintiens humide sans noyer",
    ],
    growing: [
      "Butter progressivement pour blanchir le bas de la tige — 2-3 buttages espacés d'un mois",
      "Arrose modérément : le poireau résiste bien à la sécheresse une fois établi",
    ],
    ready: [
      "Arrache au fur et à mesure — le poireau peut rester en terre tout l'hiver",
      "Coupe les feuilles du haut avant de consommer si elles sont jaunies",
    ],
  },

  'oignon': {
    sowed: [
      "Si tu plantes des bulbilles (petits oignons), enfonce-les pointe vers le haut à 2 cm de profondeur",
      "Espace les bulbilles de 10-15 cm en tous sens",
    ],
    growing: [
      "N'arrose plus une fois les feuilles bien formées — l'excès d'eau gêne la formation des bulbes",
      "Ne buttez pas les oignons : le bulbe doit rester visible en surface pour bien grossir",
    ],
    ready: [
      "Récolte quand la moitié des feuilles est couchée et jaunit",
      "Laisse sécher 2-3 semaines au soleil avant de stocker en lieu frais et sec",
    ],
  },

  'epinard': {
    sowed: [
      "Sème par temps frais (printemps ou automne) — l'épinard monte vite en graines par chaleur",
      "Maintiens humide les premiers jours",
    ],
    growing: [
      "Arrose régulièrement — l'épinard a besoin d'humidité constante",
      "Enlève les feuilles jaunes au fur et à mesure",
    ],
    ready: [
      "Récolte les grandes feuilles extérieures en laissant le cœur — le plant continue à produire",
      "Ne tarde pas si les premières fleurs apparaissent au cœur — récolte tout",
    ],
  },

  'poivron': {
    sowed: [
      "Germination lente et capricieuse — maintiens à 22-25°C, en germoir si possible",
      "Le poivron est très gourmand en chaleur : ne plante dehors qu'après les dernières gelées",
    ],
    growing: [
      "Protège du vent — les jeunes plants sont fragiles",
      "Apporte un engrais équilibré toutes les 3 semaines",
      "Tuteurer légèrement si la tige s'incline sous le poids des fruits",
    ],
    flowering: [
      "Évite les arrosages sur le feuillage pendant la floraison",
      "Agite délicatement les tiges pour favoriser la pollinisation en l'absence d'insectes",
    ],
    ready: [
      "Récolte vert pour une production continue, ou attends le rouge pour plus de douceur et de goût",
      "Coupe avec des ciseaux propres plutôt que d'arracher",
    ],
  },

  'concombre': {
    sowed: [
      "Sol chaud indispensable — attends que la terre dépasse 15°C",
      "Sème 2-3 graines par poquet, à 2 cm de profondeur, puis ne garde que le plant le plus vigoureux",
    ],
    growing: [
      "Le concombre est très gourmand en eau — arrose copieusement et régulièrement",
      "Pince l'extrémité de la tige principale après 5-6 feuilles pour favoriser les tiges latérales",
    ],
    flowering: [
      "Pince à 2 feuilles au-dessus de chaque fleur femelle pour concentrer l'énergie",
      "Les fleurs femelles ont un petit concombre à leur base — surveille-les",
    ],
    ready: [
      "Récolte avant que la peau ne jaunisse — la texture devient spongieuse et amère",
      "Récolte régulièrement pour stimuler la production",
    ],
  },

  'aubergine': {
    sowed: [
      "Très longue germination (15-20 jours) — maintiens à 25°C minimum",
      "L'aubergine aime les étés chauds — c'est la plus thermophile de nos légumes",
    ],
    growing: [
      "Tuteurer dès que la tige dépasse 30 cm",
      "Apporte un engrais riche en potassium toutes les 2 semaines",
    ],
    flowering: [
      "Limite à 3-4 fruits par plant pour une meilleure qualité",
      "Retire les fleurs les plus tardives qui n'auraient pas le temps de donner des fruits",
    ],
    ready: [
      "Récolte quand la peau est bien brillante — une peau terne signifie sur-maturité",
      "Coupe avec un sécateur — la tige est ligneuse",
    ],
  },

  'brocoli': {
    sowed: [
      "Sème en godets et repique à 50 cm d'espacement",
      "Le brocoli préfère les sols riches et bien arrosés",
    ],
    growing: [
      "Arrose régulièrement — un stress hydrique provoque une montée en graines prématurée",
      "Apporte du compost ou un engrais azoté en cours de croissance",
    ],
    ready: [
      "Récolte avant que les petits boutons floraux ne s'ouvrent (fleurs jaunes = trop tard)",
      "Après la coupe centrale, des pousses latérales vont former de nouveaux mini-brocolis",
    ],
  },

  'pomme-terre': {
    sowed: [
      "Plante les tubercules 'yeux' vers le haut, à 10-12 cm de profondeur",
      "Espace de 30-35 cm sur le rang, 70 cm entre les rangs",
    ],
    growing: [
      "Butter régulièrement quand les tiges font 15-20 cm — un tubercule vert est toxique !",
      "Surveille les signes de mildiou : taches brunes sur les feuilles avec liseré jaune",
    ],
    ready: [
      "Attend que le feuillage jaunisse et se couche naturellement avant de récolter",
      "Par temps sec, arrache et laisse sécher les pommes de terre 2h à l'air avant de stocker",
    ],
  },

  'petits-pois': {
    sowed: [
      "Sème tôt au printemps — les petits pois apprécient le froid et détestent la chaleur",
      "Trempe les graines 12h dans l'eau pour accélérer la germination",
    ],
    growing: [
      "Installe un filet ou des brindilles dès 10 cm — les vrilles ont besoin de support",
      "Arrose modérément : trop d'eau favorise les maladies fongiques",
    ],
    flowering: [
      "Maintiens une humidité régulière pendant la floraison — crucial pour la nouaison",
      "Ne bine plus le sol autour des pieds",
    ],
    ready: [
      "Récolte quand les gousses sont bien rebondies mais encore bien vertes",
      "Les pois deviennent farineux si on attend trop — goûte pour tester",
    ],
  },

  'feve': {
    sowed: [
      "Plante les fèves dès l'automne ou en début de printemps — elles adorent le froid",
      "Sème à 5 cm de profondeur, espacées de 15 cm",
    ],
    growing: [
      "Tuteure si nécessaire — les tiges peuvent dépasser 1 mètre",
      "Attention aux pucerons noirs sur les tiges : pince l'extrémité des tiges qui en sont envahies",
    ],
    flowering: [
      "Belle floraison blanc et noir — chaque fleur peut donner une gousse",
      "Continue d'arroser régulièrement",
    ],
    ready: [
      "Les gousses sont prêtes quand elles sont bien gonflées et commencent à se coucher",
      "Mange les jeunes fèves sans les éplucher — elles sont tendres",
    ],
  },

  'ail': {
    sowed: [
      "Plante les caïeux (gousses individuelles) pointe vers le haut, à 3-4 cm de profondeur",
      "Plante à l'automne pour une récolte en juin-juillet, ou au printemps pour une récolte en automne",
    ],
    growing: [
      "L'ail déteste les excès d'eau — arrose très peu, surtout par temps frais",
      "Coupe les hampes florales (tiges enroulées) pour concentrer l'énergie sur les bulbes",
    ],
    ready: [
      "Récolte quand 1/3 à 1/2 des feuilles est jauni et couché",
      "Laisse sécher les bulbes 3 à 4 semaines dans un endroit sec et ventilé avant de consommer",
    ],
  },

  'mache': {
    sowed: [
      "Sème à l'automne pour une récolte d'hiver ou de printemps",
      "Sème dru, en petites touffes, à la volée ou en ligne",
    ],
    growing: [
      "La mâche pousse lentement — sois patient et arrose modérément",
      "Résiste bien au froid, même en dessous de 0°C sous protection légère",
    ],
    ready: [
      "Récolte les rosettes entières en coupant à la base",
      "La mâche se récolte tout l'hiver et au printemps avant la montée en graines",
    ],
  },

  'roquette': {
    sowed: [
      "Sème à la volée ou en ligne, très peu profond — la graine a besoin de lumière",
      "Germination rapide par temps chaud (3-5 jours)",
    ],
    growing: [
      "Arrose régulièrement — la sécheresse rend la roquette très piquante et amère",
      "Éclaircis si trop dense pour éviter la montée en graines prématurée",
    ],
    ready: [
      "Récolte les feuilles extérieures en laissant le cœur pour une production continue",
      "Évite de récolter par grande chaleur — les feuilles perdent leur saveur",
    ],
  },

  'bette': {
    sowed: [
      "La 'graine' de bette contient en réalité 2-3 graines — éclaircis après levée",
      "Maintiens le sol humide jusqu'à la levée",
    ],
    growing: [
      "Arrose régulièrement — la bette a besoin d'humidité pour garder ses feuilles tendres",
      "Apporte un peu de compost en cours de saison",
    ],
    ready: [
      "Récolte les feuilles extérieures en laissant le cœur — production sur plusieurs mois",
      "Les tiges colorées sont aussi comestibles, cuites comme des asperges",
    ],
  },

  'mais-doux': {
    sowed: [
      "Plante en bloc carré (pas en ligne simple) pour favoriser la pollinisation par le vent",
      "Sol chaud indispensable — attends la mi-mai en région tempérée",
    ],
    growing: [
      "Apporte un engrais riche en azote — le maïs est très gourmand",
      "Arrose abondamment, surtout pendant la formation des épis",
    ],
    flowering: [
      "Les soies (fils rouges) doivent être pollinisées par les fleurs du sommet — pas besoin d'intervenir si planté en bloc",
    ],
    ready: [
      "Teste en piquant un grain : si le jus est laiteux, c'est le bon moment — sucré et tendre",
      "Se mange le jour de la récolte pour un maximum de sucre",
    ],
  },

  'melon': {
    sowed: [
      "Sème sous abri 3-4 semaines avant la plantation, à 20-22°C",
      "Repique avec précaution — les melons n'aiment pas qu'on touche aux racines",
    ],
    growing: [
      "Pince la tige principale à 4-5 feuilles pour favoriser les tiges latérales fruitières",
      "Surélève les fruits sur une tuile ou un bout de bois pour éviter la pourriture",
    ],
    flowering: [
      "Pollinise à la main si peu d'insectes — passe une fleur mâle sur chaque fleur femelle le matin",
      "Limite à 2-3 fruits par plant pour des melons bien sucrés",
    ],
    ready: [
      "La queue commence à se lézarder et un léger parfum suave s'échappe — c'est le moment",
      "Une légère pression du pouce sur le bout opposé à la queue doit marquer légèrement",
    ],
  },

  'potimarron': {
    sowed: [
      "Sème en godets à 20°C, 3-4 semaines avant la plantation en pleine terre",
      "Plante après les dernières gelées, espacé de 1,5 m minimum",
    ],
    growing: [
      "Guide les tiges pour occuper l'espace disponible — elles peuvent faire 3-4 mètres",
      "Arrose copieusement en été — le manque d'eau stoppe la fructification",
    ],
    ready: [
      "La peau devient dure et ne se raye plus à l'ongle — c'est le signe de maturité",
      "Coupe avec 5-10 cm de tige attachée pour une meilleure conservation",
      "Se conserve plusieurs mois dans un endroit frais et sec",
    ],
  },

  'basilic': {
    sowed: [
      "Maintiens à 20°C minimum — le basilic est très sensible au froid (ne supporte pas <10°C)",
      "Sème en godets sous abri, jamais en pleine terre avant juin",
    ],
    growing: [
      "Pince les tiges florales dès qu'elles apparaissent pour maintenir la production de feuilles",
      "Arrose au pied, jamais sur le feuillage — les taches noires sur les feuilles sont fatales",
    ],
    ready: [
      "Cueille en pinçant juste au-dessus d'une paire de feuilles — deux tiges repartent",
      "Récolte le matin pour un arôme maximum",
    ],
  },

  'persil': {
    sowed: [
      "Germination longue (15-21 jours) — trempe les graines 24h avant de semer pour accélérer",
      "Maintiens humide sans noyer",
    ],
    growing: [
      "Arrose régulièrement — le persil aime un sol frais",
      "Enlève les tiges qui montent en graines (montaison) pour prolonger la production",
    ],
    ready: [
      "Récolte les tiges extérieures en laissant le cœur intact — production continue",
      "Plus on récolte, plus le persil pousse",
    ],
  },

  'menthe': {
    sowed: [
      "La menthe s'étale agressivement — plante-la en pot enterré ou en bac isolé",
      "Facile à bouturer depuis une tige achetée en épicerie",
    ],
    growing: [
      "Arrose régulièrement — la menthe aime l'humidité",
      "Taille régulièrement pour éviter que la plante ne devienne ligneuse",
    ],
    ready: [
      "Récolte les tiges avant la floraison pour un maximum d'arôme",
      "Une taille à 5 cm du sol en fin d'été stimule une belle repousse automnale",
    ],
  },

  'celeri-branche': {
    sowed: [
      "Germination lente (15-20 jours) — maintiens à 18-20°C",
      "Repique en pleine terre après les gelées, espacé de 30 cm",
    ],
    growing: [
      "Arrose régulièrement et copieusement — le céleri est très gourmand en eau",
      "Blanchis les tiges en les enveloppant de papier journal 2 semaines avant la récolte",
    ],
    ready: [
      "Récolte les tiges extérieures en laissant le cœur",
      "Se récolte de l'été jusqu'aux premières gelées",
    ],
  },

  'fenouil': {
    sowed: [
      "Sème en place — le fenouil n'aime pas les transplantations",
      "Sème en ligne, éclaircis à 30 cm",
    ],
    growing: [
      "Butter la base du bulbe quand il commence à grossir pour le blanchir",
      "Arrose régulièrement pour éviter la montée en graines prématurée",
    ],
    ready: [
      "Récolte quand le bulbe fait 8-10 cm de diamètre",
      "Arrache entièrement — le fenouil ne repart pas après la coupe du bulbe",
    ],
  },

  'navet': {
    sowed: [
      "Sème directement en place, très peu profond, en ligne",
      "Germination rapide (4-6 jours) — trop d'humidité fait pourrir les graines",
    ],
    growing: [
      "Éclaircis à 10 cm d'espacement — les navets serrés restent petits",
      "Arrose modérément",
    ],
    ready: [
      "Récolte jeune (5-6 cm de diamètre) — plus ils grossissent, plus ils deviennent fibreux",
      "Se conserve très bien en terre tout l'hiver",
    ],
  },

  'betterave': {
    sowed: [
      "La 'graine' contient plusieurs graines — éclaircis après levée, espace de 10 cm",
      "Trempe les graines 12h dans l'eau tiède pour accélérer la levée",
    ],
    growing: [
      "Bine régulièrement entre les rangs pour aérer le sol",
      "Arrose régulièrement par temps chaud",
    ],
    ready: [
      "Récolte quand le collet (haut de la betterave) mesure 5-8 cm — encore tendre à ce stade",
      "Tord les fanes plutôt que de les couper — évite le saignement",
    ],
  },

  // ── Aromatiques vivaces ────────────────────────────────────────────────────

  'thym': {
    perennial_growing: [
      "Le thym n'a besoin de presque rien — un sol drainant et du soleil suffisent",
      "Taille légèrement après la floraison pour garder un port compact",
    ],
    perennial_producing: [
      "Cueille les tiges avant ou pendant la floraison — arôme maximum",
      "Se récolte toute l'année, même en hiver sous abri léger",
    ],
  },

  'romarin': {
    perennial_growing: [
      "Le romarin est rustique — sol très drainé, peu d'arrosage, plein soleil",
      "Taille légèrement chaque année pour éviter que les tiges s'emballent",
    ],
    perennial_producing: [
      "Cueille les jeunes pousses en priorité — plus aromatiques",
      "Excellent en compagnie des légumes méditerranéens (aubergine, poivron)",
    ],
  },

  'sauge': {
    perennial_growing: [
      "La sauge déteste avoir les racines dans l'eau — sol drainant impératif",
      "Taille en printemps pour rajeunir les vieilles tiges ligneuses",
    ],
    perennial_producing: [
      "Récolte les feuilles avant la floraison pour un arôme maximum",
      "Belle floraison bleue ou violette attrayante pour les insectes pollinisateurs",
    ],
  },

  'lavande': {
    perennial_growing: [
      "Taille après la floraison — ne pas couper dans le vieux bois ligneux",
      "Sol calcaire et drainé, exposition plein sud : conditions idéales",
    ],
    perennial_producing: [
      "Récolte les épis floraux en début de floraison pour le meilleur parfum",
      "Laisse sécher à l'envers, en bouquet, dans un endroit ventilé",
    ],
  },

  'estragon': {
    perennial_dormant: [
      "L'estragon est bien en repos — pas d'arrosage ni de taille en hiver",
      "Protège le pied avec un peu de paille si gel intense prévu",
    ],
    perennial_growing: [
      "Taille légèrement pour stimuler les jeunes pousses tendres",
      "Divise la touffe tous les 3 ans pour maintenir la vigueur",
    ],
    perennial_producing: [
      "Récolte avant la floraison — les feuilles deviennent amères après",
      "L'estragon français n'a pas de graines valables — propage par division ou bouturage",
    ],
  },

  'melisse': {
    perennial_dormant: [
      "La mélisse disparaît en hiver mais repart vigoureusement au printemps",
    ],
    perennial_growing: [
      "Taille régulièrement pour éviter que la plante ne monte en graines et se ressème partout",
    ],
    perennial_producing: [
      "Récolte les feuilles de préférence le matin avant la chaleur",
      "Sèche facilement — étale les feuilles sur un papier en lieu sec et ventilé",
    ],
  },

  // ── Vivaces fruitières ─────────────────────────────────────────────────────

  'fraisier': {
    perennial_dormant: [
      "C'est le bon moment pour diviser les touffes et renouveler les plants",
      "Supprime les stolons si tu ne veux pas multiplier — ils épuisent la plante mère",
      "Paille le pied des plants pour protéger les couronnes du gel",
    ],
    perennial_growing: [
      "Désherbe soigneusement autour des plants — ils n'aiment pas la concurrence",
      "Paille sous les plants pour garder les fruits propres et conserver l'humidité",
      "Enlève les stolons (longues tiges rampantes) sauf si tu veux créer de nouveaux plants",
    ],
    perennial_producing: [
      "Récolte le matin quand les fruits sont encore frais et bien sucrés",
      "Coupe avec un bout de tige attachée — cela conserve mieux la fraise",
      "Récupère les stolons les plus vigoureux pour renouveler ta plantation",
    ],
  },

  'framboisier': {
    perennial_dormant: [
      "Taille les vieilles tiges (celles qui ont porté des fruits) à ras du sol en hiver",
      "Garde 5-6 belles tiges jeunes par touffe pour la saison suivante",
    ],
    perennial_growing: [
      "Palisse les tiges sur un fil tendu pour éviter qu'elles ne tombent sous le poids des fruits",
      "Arrose régulièrement à la base — les framboises n'aiment pas la sécheresse",
    ],
    perennial_producing: [
      "Récolte dès que le fruit se détache facilement avec une légère pression",
      "Récolte tous les 2-3 jours — les framboises mûres s'abîment très vite",
      "Consomme ou congèle dans la journée pour préserver l'arôme",
    ],
  },

  'groseillier': {
    perennial_dormant: [
      "Taille les vieilles branches en hiver — renouvelle un tiers des tiges chaque année",
    ],
    perennial_growing: [
      "Arrose modérément — les groseilliers sont rustiques une fois établis",
    ],
    perennial_producing: [
      "Récolte les grappes entières dès que la majorité des baies est rouge",
      "Se conserve mieux en grappes qu'égrappé",
    ],
  },

  'myrtillier': {
    perennial_dormant: [
      "Le myrtillier a besoin d'un sol acide (pH 4-5) — acidifie avec de la tourbe ou du soufre si nécessaire",
      "Belle coloration automnale du feuillage avant la chute des feuilles",
    ],
    perennial_growing: [
      "Arrose avec de l'eau de pluie si possible — l'eau calcaire détériore le sol acide",
      "Paille avec de l'écorce de pin pour maintenir l'acidité",
    ],
    perennial_producing: [
      "Récolte plusieurs fois par semaine — les baies mûrissent progressivement",
      "Les myrtilles se récoltent à pleine maturité (bleu profond), sans les cueillir en avance",
    ],
  },

  'cassissier': {
    perennial_dormant: [
      "Taille légèrement après la récolte pour stimuler la croissance de nouvelles pousses",
    ],
    perennial_growing: [
      "Arrose en période sèche, surtout en début de saison",
    ],
    perennial_producing: [
      "Récolte quand toutes les baies de la grappe sont uniformément noires",
      "Très riche en vitamine C — idéal pour gelées et sirops",
    ],
  },

  'asperge': {
    perennial_dormant: [
      "C'est en hiver que se prépare la belle saison — amende le sol avec du compost",
      "Ne touche pas aux griffes en dormance",
    ],
    perennial_growing: [
      "Les premières années : ne récolte pas — laisse la fougère monter pour renforcer les griffes",
      "Bine légèrement et désherbe autour des griffes",
    ],
    perennial_producing: [
      "Récolte quand les pointes font 15-20 cm, avant que les écailles ne s'écartent",
      "Coupe avec un couteau à 5 cm sous terre — beau geste franc",
      "Arrête la récolte après 8 semaines pour laisser la fougère se développer",
    ],
    perennial_longcycle: [
      "L'asperge demande 3 ans de patience avant la 1re récolte — ça vaut le coup !",
      "Pendant ces années d'attente, laisse toujours la fougère monter",
    ],
  },

  'artichaut': {
    perennial_dormant: [
      "Protège le pied avec de la paille si ta région est sujette au gel",
      "Profite-en pour diviser les œilletons pour créer de nouveaux plants",
    ],
    perennial_growing: [
      "Arrose copieusement — l'artichaut est très gourmand en eau",
      "Apporte un engrais équilibré en début de saison",
    ],
    perennial_producing: [
      "Récolte avant que les feuilles du capitule ne commencent à s'écarter",
      "Le capitule principal est toujours le plus gros — récolte-le en premier",
    ],
    perennial_longcycle: [
      "La première année est consacrée à l'établissement de la plante",
      "Quelques capitules en fin de première saison — ne les récolte pas tous pour laisser mûrir les graines",
    ],
  },

  'rhubarbe': {
    perennial_dormant: [
      "En hiver, le feuillage meurt — c'est tout à fait normal, la plante repart au printemps",
      "Apporte du compost en surface autour de la couronne",
    ],
    perennial_growing: [
      "Ne récolte pas les toutes premières années — laisse la plante s'établir",
      "Enlève les hampes florales dès qu'elles apparaissent pour renforcer la couronne",
    ],
    perennial_producing: [
      "Tire les tiges latéralement plutôt que de les couper — cela évite les maladies",
      "Ne prélève jamais plus d'un tiers des tiges à la fois",
      "Laisse toujours les feuilles au jardin (mais ne les mange pas — elles sont toxiques !)",
    ],
  },

  // ── Arbres fruitiers ───────────────────────────────────────────────────────

  'pommier': {
    perennial_dormant: [
      "C'est le moment idéal pour la taille de fructification — avant le gonflement des bourgeons",
      "Badigeonne le tronc de chaux en hiver pour prévenir les parasites",
    ],
    perennial_growing: [
      "Éclaircis les fruits en juin pour avoir de plus gros pommes — laisse 1 pomme toutes les 15 cm",
      "Surveille les pucerons cendrés sur les nouvelles pousses",
    ],
    perennial_producing: [
      "La pomme est mûre si elle se détache facilement en tournant à 90°",
      "Récupère les pommes tombées régulièrement — elles propagent des maladies si elles pourrissent",
    ],
    perennial_longcycle: [
      "Les 3-4 premières années, concentre la taille sur la mise en forme du squelette",
      "Quelques fruits les premières années : laisse-les pour observer le comportement de la variété",
    ],
  },

  'cerisier': {
    perennial_dormant: [
      "Évite de tailler le cerisier en hiver — risque de chancre. Préfère la taille après récolte",
    ],
    perennial_growing: [
      "Couvre l'arbre avec un filet anti-oiseaux dès que les cerises commencent à verdir",
      "Arrose aux périodes sèches, surtout la première année",
    ],
    perennial_producing: [
      "Récolte avec la queue — les cerises sans queue pourrissent très vite",
      "Cueille par temps sec si possible pour une meilleure conservation",
    ],
  },

  'figuier': {
    perennial_dormant: [
      "Le figuier peut perdre ses feuilles en hiver dans les régions froides — c'est normal",
      "Protège le pied avec de la paille si gel intense prévu",
    ],
    perennial_growing: [
      "Le figuier pousse vite en été — taille légèrement après la récolte pour maîtriser la taille",
      "Très peu d'arrosage nécessaire une fois établi",
    ],
    perennial_producing: [
      "La figue est mûre quand elle se courbe légèrement et que la peau se fissure en bas",
      "Récolte le matin — les figues mûres de la veille sont au maximum de leur douceur",
    ],
  },

  'olivier': {
    perennial_dormant: [
      "L'olivier est persistant — il garde ses feuilles toute l'année",
      "Taille légèrement tous les 2-3 ans pour aérer le houppier",
    ],
    perennial_growing: [
      "Très peu d'arrosage nécessaire — l'olivier est adapté à la sécheresse",
      "Sol caillouteux et drainé : parfait pour l'olivier",
    ],
    perennial_producing: [
      "Récolte les olives en octobre-novembre pour l'huile, ou en décembre pour les olives noires",
      "Étend une bâche sous l'arbre et secoue les branches pour récupérer les olives",
    ],
  },
}
