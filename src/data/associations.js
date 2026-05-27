export const ASSOCIATIONS = {

  // ── LÉGUMES FRUITS ──────────────────────────────────────────────────────

  'tomate': {
    bonnes: [
      { plante: 'Basilic',       emoji: '🌿', raison: 'Repousse pucerons et mouches blanches, améliore le goût',      categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Carotte',       emoji: '🥕', raison: 'Ameublit le sol autour des racines',                           categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Persil',        emoji: '🌿', raison: 'Stimule la croissance, repousse certains insectes',            categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Poireau',       emoji: '🧅', raison: 'Éloigne certains insectes nuisibles',                          categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Céleri',        emoji: '🌿', raison: 'Repousse les altises et certains ravageurs',                   categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Capucine',      emoji: '🌺', raison: 'Attire les pucerons loin des tomates (plante piège)',          categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: "Œillet d'Inde", emoji: '🌼', raison: 'Repousse les nématodes et mouches blanches',                   categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Sécrétions racinaires inhibent la croissance',                categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Chou',           emoji: '🥬', raison: 'Forte concurrence nutritive, mêmes maladies fongiques',       categorie: 'concurrence',   intensite: 'forte',   distance: 'proche' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Propagation du mildiou entre les deux solanacées',            categorie: 'maladie',       intensite: 'forte',   distance: 'loin' },
      { plante: 'Betterave',      emoji: '🔴', raison: 'Compétition racinaire et nutritive',                          categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Maïs',           emoji: '🌽', raison: 'Ombre excessive pour les tomates',                            categorie: 'structure',     intensite: 'moderee', distance: 'proche' },
    ],
  },

  'courgette': {
    bonnes: [
      { plante: 'Haricot',  emoji: '🫘', raison: "Fixe l'azote bénéfique pour la courgette",                        categorie: 'nutrition',     intensite: 'forte',   distance: 'proche' },
      { plante: 'Maïs',     emoji: '🌽', raison: "Association des 3 sœurs, ombre partielle protectrice",            categorie: 'structure',     intensite: 'forte',   distance: 'contact' },
      { plante: 'Capucine', emoji: '🌺', raison: 'Attire les pucerons loin de la courgette',                        categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Aneth',    emoji: '🌿', raison: 'Attire les pollinisateurs pour la fécondation des fleurs',        categorie: 'pollinisation', intensite: 'moderee', distance: 'proche' },
      { plante: 'Radis',    emoji: '🔴', raison: 'Repousse les insectes rampants',                                  categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Concurrence hydrique et maladies communes',                  categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance des cucurbitacées',                     categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  'concombre': {
    bonnes: [
      { plante: 'Radis',   emoji: '🔴', raison: 'Repousse les coléoptères du concombre',                            categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Aneth',   emoji: '🌿', raison: 'Attire les insectes pollinisateurs et bénéfiques',                 categorie: 'pollinisation', intensite: 'moderee', distance: 'proche' },
      { plante: 'Haricot', emoji: '🫘', raison: "Fixation d'azote bénéfique",                                       categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Maïs',    emoji: '🌽', raison: 'Support naturel pour les tiges grimpantes',                        categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Tomate',         emoji: '🍅', raison: 'Concurrence hydrique et maladies fongiques communes',       categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies fongiques communes',                               categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
      { plante: 'Sauge',          emoji: '🌿', raison: 'Inhibe la croissance du concombre',                         categorie: 'allelopathie',  intensite: 'faible',  distance: 'contact' },
    ],
  },

  'poivron': {
    bonnes: [
      { plante: 'Basilic',       emoji: '🌿', raison: 'Repousse pucerons et thrips',                                categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Carotte',       emoji: '🥕', raison: 'Ameublissement du sol bénéfique',                           categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: "Œillet d'Inde", emoji: '🌼', raison: 'Repousse nématodes et insectes nuisibles',                   categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Tomate',        emoji: '🍅', raison: 'Même famille, besoins similaires, cohabitation possible',   categorie: 'structure',     intensite: 'faible',  distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance',                                      categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies communes (mildiou)',                               categorie: 'maladie',       intensite: 'forte',   distance: 'proche' },
    ],
  },

  'aubergine': {
    bonnes: [
      { plante: 'Haricot',       emoji: '🫘', raison: "Fixation d'azote, bonne cohabitation",                      categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Basilic',       emoji: '🌿', raison: 'Repousse les pucerons et insectes',                         categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: "Œillet d'Inde", emoji: '🌼', raison: 'Repousse nématodes du sol',                                  categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Thym',          emoji: '🌿', raison: 'Répulsif général contre insectes nuisibles',                categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance',                                      categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies communes aux solanacées',                         categorie: 'maladie',       intensite: 'forte',   distance: 'proche' },
    ],
  },

  'melon': {
    bonnes: [
      { plante: 'Maïs',     emoji: '🌽', raison: "Ombre légère bénéfique en forte chaleur",                        categorie: 'structure',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Radis',    emoji: '🔴', raison: 'Repousse certains insectes rampants',                            categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
      { plante: 'Capucine', emoji: '🌺', raison: 'Attire pollinisateurs',                                          categorie: 'pollinisation', intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies communes et concurrence hydrique',                categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
      { plante: 'Tomate',         emoji: '🍅', raison: 'Concurrence hydrique importante',                          categorie: 'concurrence',   intensite: 'moderee', distance: 'proche' },
    ],
  },

  'mais-doux': {
    bonnes: [
      { plante: 'Haricot',   emoji: '🫘', raison: "Association des 3 sœurs : le haricot grimpe sur le maïs et fixe l'azote", categorie: 'nutrition', intensite: 'forte',   distance: 'contact' },
      { plante: 'Courgette', emoji: '🥒', raison: "Association des 3 sœurs : la courgette couvre le sol",         categorie: 'structure',     intensite: 'forte',   distance: 'contact' },
      { plante: 'Concombre', emoji: '🥒', raison: 'Utilise le maïs comme support naturel',                        categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Tomate',    emoji: '🍅', raison: 'Ombre excessive nuisant aux tomates',                           categorie: 'structure',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Betterave', emoji: '🔴', raison: 'Concurrence racinaire',                                         categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Fenouil',   emoji: '🌿', raison: 'Inhibe la croissance du maïs',                                  categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  // ── LÉGUMES RACINES ──────────────────────────────────────────────────────

  'carotte': {
    bonnes: [
      { plante: 'Oignon',     emoji: '🧅', raison: "Protection mutuelle contre mouche de la carotte et oignon",    categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Poireau',    emoji: '🧅', raison: "Même protection mutuelle contre leurs parasites respectifs",   categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Salade',     emoji: '🥗', raison: "Occupe la surface pendant que la carotte pousse en profondeur",categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Tomate',     emoji: '🍅', raison: 'La tomate repousse la mouche de la carotte',                   categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Romarin',    emoji: '🌿', raison: 'Répulsif contre la mouche de la carotte',                      categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Ciboulette', emoji: '🌿', raison: 'Repousse la mouche de la carotte',                             categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Aneth',     emoji: '🌿', raison: 'Inhibe la germination des carottes',                            categorie: 'allelopathie',  intensite: 'moderee', distance: 'contact' },
      { plante: 'Betterave', emoji: '🔴', raison: 'Concurrence pour les minéraux en profondeur',                   categorie: 'racines',       intensite: 'moderee', distance: 'contact' },
      { plante: 'Fenouil',   emoji: '🌿', raison: 'Inhibe la croissance',                                          categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  'radis': {
    bonnes: [
      { plante: 'Salade',    emoji: '🥗', raison: 'Repousse les altises qui attaquent la salade',                  categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Courgette', emoji: '🥒', raison: 'Repousse les insectes rampants des cucurbitacées',             categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Concombre', emoji: '🥒', raison: 'Éloigne les coléoptères du concombre',                         categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Carotte',   emoji: '🥕', raison: 'Bonne cohabitation, cycles complémentaires',                   categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Tomate',    emoji: '🍅', raison: 'Attire les altises loin des tomates (plante piège)',            categorie: 'protection',    intensite: 'faible',  distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Cerfeuil', emoji: '🌿', raison: 'Donne un goût piquant indésirable aux radis',                   categorie: 'allelopathie',  intensite: 'moderee', distance: 'contact' },
      { plante: 'Hysope',   emoji: '🌿', raison: 'Inhibe la croissance du radis',                                  categorie: 'allelopathie',  intensite: 'moderee', distance: 'contact' },
    ],
  },

  'betterave': {
    bonnes: [
      { plante: 'Oignon', emoji: '🧅', raison: "Bonne cohabitation, protection contre certains insectes",          categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
      { plante: 'Salade', emoji: '🥗', raison: 'Cohabitation harmonieuse, niveaux de racines différents',         categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Chou',   emoji: '🥬', raison: 'Bonne association reconnue',                                      categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Ail',    emoji: '🧅', raison: 'Protection contre maladies fongiques',                            categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Épinard', emoji: '🌿', raison: 'Concurrence pour les nitrates dans le sol',                      categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Haricot', emoji: '🫘', raison: 'Mauvaise cohabitation reconnue',                                  categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Tomate',  emoji: '🍅', raison: 'Compétition racinaire et nutritive',                             categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
    ],
  },

  'navet': {
    bonnes: [
      { plante: 'Pois',    emoji: '🫛', raison: "Les pois fixent l'azote bénéfique pour le navet",               categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Haricot', emoji: '🫘', raison: 'Bonne cohabitation',                                             categorie: 'nutrition',     intensite: 'faible',  distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate',   emoji: '🍅', raison: 'Compétition racinaire',                                         categorie: 'concurrence',   intensite: 'faible',  distance: 'contact' },
      { plante: 'Moutarde', emoji: '🌿', raison: 'Même famille, maladies communes',                               categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
    ],
  },

  'panais': {
    bonnes: [
      { plante: 'Radis',  emoji: '🔴', raison: 'Bonne cohabitation, cycles complémentaires',                      categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Salade', emoji: '🥗', raison: 'Occupe la surface pendant la croissance du panais',              categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Oignon', emoji: '🧅', raison: 'Protection mutuelle contre les ravageurs',                       categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Carotte', emoji: '🥕', raison: 'Même famille, attaquées par les mêmes ravageurs ensemble',      categorie: 'maladie',       intensite: 'moderee', distance: 'contact' },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Inhibe la croissance',                                          categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  'ail': {
    bonnes: [
      { plante: 'Carotte',  emoji: '🥕', raison: 'Repousse la mouche de la carotte',                              categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Tomate',   emoji: '🍅', raison: "Repousse les nuisibles, protège contre maladies fongiques",    categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Fraisier', emoji: '🍓', raison: 'Protège les fraisiers des maladies fongiques',                 categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Rosier',   emoji: '🌹', raison: 'Protection contre pucerons et maladies',                       categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Haricot',      emoji: '🫘', raison: "L'ail inhibe fortement la croissance du haricot",         categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Petits pois',  emoji: '🫛', raison: 'Même effet inhibiteur que sur le haricot',                categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Fève',         emoji: '🌿', raison: 'Inhibe les légumineuses en général',                      categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
    ],
  },

  // ── LÉGUMES FEUILLES ─────────────────────────────────────────────────────

  'salade': {
    bonnes: [
      { plante: 'Radis',    emoji: '🔴', raison: 'Le radis repousse les altises qui attaquent la salade',         categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Carotte',  emoji: '🥕', raison: 'Cohabitation harmonieuse, niveaux de racines différents',      categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Fraisier', emoji: '🍓', raison: "Association classique, optimise l'espace",                     categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Oignon',   emoji: '🧅', raison: 'Repousse certains insectes nuisibles',                         categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Persil', emoji: '🌿', raison: 'Ralentit la croissance de la salade',                            categorie: 'allelopathie',  intensite: 'moderee', distance: 'contact' },
      { plante: 'Céleri', emoji: '🌿', raison: 'Concurrence nutritive forte',                                    categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
    ],
  },

  'epinard': {
    bonnes: [
      { plante: 'Fraisier', emoji: '🍓', raison: 'Association très complémentaire',                               categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Haricot',  emoji: '🫘', raison: "Le haricot apporte de l'azote",                                categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Radis',    emoji: '🔴', raison: 'Bonne cohabitation, cycles complémentaires',                   categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Ail',      emoji: '🧅', raison: 'Protection contre certaines maladies',                         categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Betterave', emoji: '🔴', raison: 'Concurrence pour les nitrates dans le sol',                   categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
    ],
  },

  'bette': {
    bonnes: [
      { plante: 'Ail',    emoji: '🧅', raison: 'Protection contre maladies fongiques',                           categorie: 'protection',    intensite: 'faible',  distance: 'contact' },
      { plante: 'Oignon', emoji: '🧅', raison: 'Bonne cohabitation',                                             categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Chou',   emoji: '🥬', raison: 'Association harmonieuse',                                        categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Radis',  emoji: '🔴', raison: 'Cycles complémentaires',                                         categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Épinard', emoji: '🌿', raison: 'Même famille, concurrence nutritive',                           categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Maïs',    emoji: '🌽', raison: 'Concurrence racinaire',                                         categorie: 'concurrence',   intensite: 'faible',  distance: 'contact' },
    ],
  },

  'mache': {
    bonnes: [
      { plante: 'Bette',   emoji: '🌿', raison: 'Bonne cohabitation hivernal/automnal',                          categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Épinard', emoji: '🌿', raison: 'Même saison, cohabitation possible',                            categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [],
  },

  'roquette': {
    bonnes: [
      { plante: 'Salade', emoji: '🥗', raison: 'Même saison, complémentaires en goût et en espace',             categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Radis',  emoji: '🔴', raison: 'Cycles ultra-courts compatibles',                               categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Fraise', emoji: '🍓', raison: 'Peut favoriser certains ravageurs communs aux brassicacées',    categorie: 'maladie',       intensite: 'faible',  distance: 'contact' },
    ],
  },

  'scarole': {
    bonnes: [
      { plante: 'Carotte', emoji: '🥕', raison: 'Association classique des salades et racines',                  categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Radis',   emoji: '🔴', raison: 'Bonne cohabitation',                                            categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [],
  },

  // ── LÉGUMES TIGES / BULBES ───────────────────────────────────────────────

  'poireau': {
    bonnes: [
      { plante: 'Carotte', emoji: '🥕', raison: 'Protection mutuelle : poireau éloigne la mouche de la carotte', categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Céleri',  emoji: '🌿', raison: 'Association très bénéfique en permaculture',                    categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: 'Tomate',  emoji: '🍅', raison: 'Le poireau éloigne certains insectes nuisibles de la tomate',  categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Haricot',     emoji: '🫘', raison: 'Le poireau freine le développement du haricot',            categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
      { plante: 'Petits pois', emoji: '🫛', raison: 'Même effet négatif que sur le haricot',                    categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
      { plante: 'Fève',        emoji: '🌿', raison: 'Inhibe les légumineuses',                                  categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
    ],
  },

  'oignon': {
    bonnes: [
      { plante: 'Carotte',  emoji: '🥕', raison: 'Protection mutuelle contre mouche carotte / teigne oignon',   categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Tomate',   emoji: '🍅', raison: "Repousse certains nuisibles de la tomate",                    categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Fraisier', emoji: '🍓', raison: "Protège les fraisiers des maladies fongiques",                categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Betterave',emoji: '🔴', raison: 'Bonne cohabitation reconnue',                                 categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Haricot',     emoji: '🫘', raison: "L'oignon inhibe fortement la croissance du haricot",      categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Petits pois', emoji: '🫛', raison: 'Même effet inhibiteur',                                   categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Fève',        emoji: '🌿', raison: 'Inhibe les légumineuses',                                  categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
    ],
  },

  'celeri-branche': {
    bonnes: [
      { plante: 'Tomate',  emoji: '🍅', raison: 'Repousse les altises et certains ravageurs',                   categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Poireau', emoji: '🧅', raison: 'Association très bénéfique',                                   categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: 'Chou',    emoji: '🥬', raison: 'Repousse la mouche du chou',                                   categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Salade', emoji: '🥗', raison: 'Concurrence nutritive forte',                                   categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Maïs',   emoji: '🌽', raison: 'Concurrence importante',                                        categorie: 'concurrence',   intensite: 'moderee', distance: 'proche' },
    ],
  },

  // ── LÉGUMINEUSES ─────────────────────────────────────────────────────────

  'haricot': {
    bonnes: [
      { plante: 'Courgette', emoji: '🥒', raison: "Fixe l'azote, association des 3 sœurs",                      categorie: 'nutrition',     intensite: 'forte',   distance: 'proche' },
      { plante: 'Maïs',      emoji: '🌽', raison: "Grimpe sur le maïs, fixe l'azote pour lui",                  categorie: 'nutrition',     intensite: 'forte',   distance: 'contact' },
      { plante: 'Carotte',   emoji: '🥕', raison: 'Améliore la structure du sol mutuellement',                  categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Bette',     emoji: '🌿', raison: 'Bonne cohabitation',                                         categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Oignon',  emoji: '🧅', raison: "L'oignon inhibe la croissance du haricot",                    categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Ail',     emoji: '🧅', raison: 'Même effet inhibiteur',                                        categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Poireau', emoji: '🧅', raison: "Même famille que l'oignon, effet négatif",                    categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Toxique pour les légumineuses',                               categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  'feve': {
    bonnes: [
      { plante: 'Épinard',        emoji: '🌿', raison: "La fève fixe l'azote bénéfique pour l'épinard",        categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Chou',           emoji: '🥬', raison: 'Bonne cohabitation, azote pour les choux',             categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: "Fixation d'azote bénéfique",                           categorie: 'nutrition',     intensite: 'faible',  distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Ail',    emoji: '🧅', raison: 'Inhibe les légumineuses',                                       categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
      { plante: 'Oignon', emoji: '🧅', raison: 'Inhibe les légumineuses',                                       categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
    ],
  },

  'petits-pois': {
    bonnes: [
      { plante: 'Carotte', emoji: '🥕', raison: "Fixation d'azote bénéfique pour les carottes",               categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Navet',   emoji: '🥔', raison: 'Bonne cohabitation',                                          categorie: 'nutrition',     intensite: 'faible',  distance: 'proche' },
      { plante: 'Salade',  emoji: '🥗', raison: 'Cohabitation harmonieuse',                                    categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
      { plante: 'Radis',   emoji: '🔴', raison: 'Complémentarité des cycles',                                  categorie: 'structure',     intensite: 'faible',  distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Oignon',  emoji: '🧅', raison: 'Inhibe les légumineuses',                                     categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Ail',     emoji: '🧅', raison: 'Inhibe les légumineuses',                                     categorie: 'allelopathie',  intensite: 'forte',   distance: 'proche' },
      { plante: 'Poireau', emoji: '🧅', raison: 'Inhibe les légumineuses',                                     categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Toxique pour les légumineuses',                               categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  // ── BRASSICACÉES ─────────────────────────────────────────────────────────

  'chou': {
    bonnes: [
      { plante: 'Céleri',  emoji: '🌿', raison: 'Repousse la mouche du chou et la piéride',                    categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: 'Aneth',   emoji: '🌿', raison: "Repousse les pucerons du chou",                               categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Romarin', emoji: '🌿', raison: 'Repousse la mouche du chou',                                  categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Thym',    emoji: '🌿', raison: 'Répulsif général contre les insectes du chou',               categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Fève',    emoji: '🌿', raison: "Fixe l'azote, bonne cohabitation",                           categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate',         emoji: '🍅', raison: 'Forte concurrence nutritive et maladies communes',    categorie: 'concurrence',   intensite: 'forte',   distance: 'proche' },
      { plante: 'Fraise',         emoji: '🍓', raison: 'Mauvaise cohabitation',                               categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Concurrence et maladies communes',                    categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
    ],
  },

  'brocoli': {
    bonnes: [
      { plante: 'Céleri',  emoji: '🌿', raison: 'Repousse la piéride du chou',                                 categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: 'Romarin', emoji: '🌿', raison: 'Répulsif contre insectes du brocoli',                        categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Aneth',   emoji: '🌿', raison: 'Repousse les pucerons',                                      categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate',  emoji: '🍅', raison: 'Concurrence nutritive forte',                                 categorie: 'concurrence',   intensite: 'forte',   distance: 'proche' },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Inhibe la croissance',                                       categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  'chou-fleur': {
    bonnes: [
      { plante: 'Céleri', emoji: '🌿', raison: 'Repousse la piéride et la mouche',                            categorie: 'protection',    intensite: 'forte',   distance: 'proche' },
      { plante: 'Thym',   emoji: '🌿', raison: 'Répulsif général',                                            categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
      { plante: 'Aneth',  emoji: '🌿', raison: 'Repousse certains ravageurs',                                 categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate', emoji: '🍅', raison: 'Concurrence nutritive',                                       categorie: 'concurrence',   intensite: 'forte',   distance: 'proche' },
      { plante: 'Fraise', emoji: '🍓', raison: 'Mauvaise cohabitation',                                       categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
    ],
  },

  // ── POMME DE TERRE ───────────────────────────────────────────────────────

  'pomme-terre': {
    bonnes: [
      { plante: 'Haricot',       emoji: '🫘', raison: "Le haricot fixe l'azote nécessaire",                   categorie: 'nutrition',     intensite: 'moderee', distance: 'proche' },
      { plante: 'Chou',          emoji: '🥬', raison: 'Bonne cohabitation reconnue',                          categorie: 'structure',     intensite: 'faible',  distance: 'proche' },
      { plante: "Œillet d'Inde", emoji: '🌼', raison: 'Repousse les nématodes du sol',                        categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Thym',          emoji: '🌿', raison: 'Répulsif contre doryphores',                           categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate',    emoji: '🍅', raison: 'Propagation mildiou entre les deux solanacées',            categorie: 'maladie',       intensite: 'forte',   distance: 'loin' },
      { plante: 'Concombre', emoji: '🥒', raison: 'Maladies communes et concurrence',                         categorie: 'maladie',       intensite: 'moderee', distance: 'proche' },
      { plante: 'Fenouil',   emoji: '🌿', raison: 'Inhibe la croissance',                                     categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Tournesol', emoji: '🌻', raison: 'Allélopathie racinaire néfaste',                           categorie: 'allelopathie',  intensite: 'moderee', distance: 'proche' },
    ],
  },

  // ── AROMATIQUES ──────────────────────────────────────────────────────────

  'basilic': {
    bonnes: [
      { plante: 'Tomate',  emoji: '🍅', raison: 'Association emblématique — repousse pucerons et mouches',    categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Poivron', emoji: '🫑', raison: 'Mêmes effets que sur la tomate',                             categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Sauge', emoji: '🌿', raison: "Compétition entre aromatiques méditerranéens",                 categorie: 'concurrence',   intensite: 'faible',  distance: 'contact' },
    ],
  },

  'fenouil': {
    bonnes: [
      { plante: 'Céleri', emoji: '🌿', raison: 'Les apiacées se protègent mutuellement',                      categorie: 'protection',    intensite: 'moderee', distance: 'proche' },
    ],
    mauvaises: [
      { plante: 'Tomate',         emoji: '🍅', raison: 'Inhibe la croissance de presque tout',                categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Courgette',      emoji: '🥒', raison: 'Inhibe les cucurbitacées',                            categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Haricot',        emoji: '🫘', raison: 'Inhibe les légumineuses',                             categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Inhibe la croissance',                                categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
      { plante: 'Carotte',        emoji: '🥕', raison: 'Inhibe la croissance des carottes',                   categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

  // ── VIVACES / FRUITS ─────────────────────────────────────────────────────

  'fraisier': {
    bonnes: [
      { plante: 'Ail',     emoji: '🧅', raison: 'Protection contre maladies fongiques',                       categorie: 'protection',    intensite: 'forte',   distance: 'contact' },
      { plante: 'Oignon',  emoji: '🧅', raison: 'Même protection fongique',                                   categorie: 'protection',    intensite: 'moderee', distance: 'contact' },
      { plante: 'Salade',  emoji: '🥗', raison: "Association classique, complémentaire en espace",            categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
      { plante: 'Épinard', emoji: '🌿', raison: 'Très complémentaire',                                        categorie: 'structure',     intensite: 'moderee', distance: 'contact' },
    ],
    mauvaises: [
      { plante: 'Chou',    emoji: '🥬', raison: 'Mauvaise cohabitation',                                      categorie: 'concurrence',   intensite: 'moderee', distance: 'contact' },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Inhibe la croissance',                                       categorie: 'allelopathie',  intensite: 'forte',   distance: 'loin' },
    ],
  },

}

// ── Helpers ──────────────────────────────────────────────────────────────────

const INTENSITE_SCORE = { forte: 3, moderee: 2, faible: 1 }

export function getConflictLevel(plantId1, plantId2) {
  const check = (id, target) => {
    const assoc = ASSOCIATIONS[id]
    if (!assoc) return null
    const entry = assoc.mauvaises.find(m =>
      m.plante.toLowerCase() === target.toLowerCase() ||
      m.plante.toLowerCase().replace(/[^a-z]/g, '') === target.toLowerCase().replace(/[^a-z]/g, '')
    )
    return entry?.intensite ?? null
  }
  return check(plantId1, plantId2) ?? check(plantId2, plantId1) ?? null
}

export function isGeneralInhibitor(plantId) {
  const assoc = ASSOCIATIONS[plantId]
  if (!assoc) return false
  return assoc.mauvaises.filter(m => m.intensite === 'forte').length >= 4
}

export function getBestNeighbors(plantId, gardenPlants = []) {
  const assoc = ASSOCIATIONS[plantId]
  if (!assoc) return []
  const gardenNames = new Set((gardenPlants ?? []).map(p => (p.name ?? '').toLowerCase()))
  return assoc.bonnes
    .filter(b => !gardenNames.has(b.plante.toLowerCase()))
    .sort((a, b) => (INTENSITE_SCORE[b.intensite] ?? 0) - (INTENSITE_SCORE[a.intensite] ?? 0))
}

export function getActiveConflicts(gardenPlants = []) {
  const conflicts = []
  for (let i = 0; i < gardenPlants.length; i++) {
    for (let j = i + 1; j < gardenPlants.length; j++) {
      const a = gardenPlants[i]
      const b = gardenPlants[j]
      const level = getConflictLevel(a.plantId ?? a.id, b.plantId ?? b.id)
      if (level) {
        conflicts.push({ plant1: a, plant2: b, intensite: level })
      }
    }
  }
  return conflicts.sort((a, b) => (INTENSITE_SCORE[b.intensite] ?? 0) - (INTENSITE_SCORE[a.intensite] ?? 0))
}
