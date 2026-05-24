// Associations de plantes (compagnonnage) — bonnes et mauvaises voisines
// Les ids correspondent aux ids de plants.js

export const ASSOCIATIONS = {
  'tomate': {
    bonnes: [
      { plante: 'Basilic',        emoji: '🌿', raison: 'Repousse les pucerons et améliore le goût' },
      { plante: 'Carotte',        emoji: '🥕', raison: 'La carotte ameublit le sol autour des racines' },
      { plante: 'Persil',         emoji: '🌱', raison: 'Repousse les insectes nuisibles' },
      { plante: "Œillet d'Inde",  emoji: '🌼', raison: 'Éloigne les nématodes et mouches blanches' },
    ],
    mauvaises: [
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance de presque toutes les plantes' },
      { plante: 'Chou',           emoji: '🥬', raison: 'Concurrence nutritive importante' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Propagation des maladies fongiques communes' },
    ],
  },
  'carotte': {
    bonnes: [
      { plante: 'Oignon',  emoji: '🧅', raison: 'Repousse la mouche de la carotte mutuellement' },
      { plante: 'Poireau', emoji: '🌱', raison: 'Protection mutuelle contre leurs parasites respectifs' },
      { plante: 'Salade',  emoji: '🥗', raison: "Occupe l'espace en surface pendant que la carotte pousse en profondeur" },
      { plante: 'Tomate',  emoji: '🍅', raison: 'La tomate repousse la mouche de la carotte' },
    ],
    mauvaises: [
      { plante: 'Aneth',    emoji: '🌿', raison: 'Inhibe la germination des carottes' },
      { plante: 'Betterave',emoji: '🔴', raison: 'Concurrence pour les minéraux en profondeur' },
    ],
  },
  'courgette': {
    bonnes: [
      { plante: 'Haricot',   emoji: '🫘', raison: "Le haricot fixe l'azote bénéfique pour la courgette" },
      { plante: 'Maïs',      emoji: '🌽', raison: 'Association des 3 sœurs, ombre partielle bénéfique' },
      { plante: 'Capucine',  emoji: '🌺', raison: 'Attire les pucerons loin de la courgette' },
    ],
    mauvaises: [
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Concurrence hydrique et maladies communes' },
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance de la courgette' },
    ],
  },
  'salade': {
    bonnes: [
      { plante: 'Radis',   emoji: '🔴', raison: 'Le radis repousse les altises qui attaquent la salade' },
      { plante: 'Carotte', emoji: '🥕', raison: 'Cohabitation harmonieuse, racines à niveaux différents' },
      { plante: 'Fraise',  emoji: '🍓', raison: "Association classique, optimise l'espace" },
    ],
    mauvaises: [
      { plante: 'Persil', emoji: '🌱', raison: 'Ralentit la croissance de la salade' },
      { plante: 'Céleri', emoji: '🌿', raison: 'Concurrence nutritive forte' },
    ],
  },
  'haricot': {
    bonnes: [
      { plante: 'Courgette', emoji: '🥒', raison: "Le haricot enrichit le sol en azote pour la courgette" },
      { plante: 'Maïs',      emoji: '🌽', raison: "Le haricot grimpe sur le maïs, association des 3 sœurs" },
      { plante: 'Carotte',   emoji: '🥕', raison: 'Améliore la structure du sol mutuellement' },
    ],
    mauvaises: [
      { plante: 'Oignon',  emoji: '🧅', raison: "L'oignon inhibe la croissance du haricot" },
      { plante: 'Fenouil', emoji: '🌿', raison: 'Toxique pour la plupart des légumineuses' },
      { plante: 'Poireau', emoji: '🧅', raison: "Même famille que l'oignon, même effet négatif" },
    ],
  },
  'poireau': {
    bonnes: [
      { plante: 'Carotte', emoji: '🥕', raison: 'Protection mutuelle contre mouche de la carotte et teigne du poireau' },
      { plante: 'Céleri',  emoji: '🌿', raison: 'Association très bénéfique reconnue en permaculture' },
      { plante: 'Tomate',  emoji: '🍅', raison: 'Le poireau éloigne certains insectes nuisibles de la tomate' },
    ],
    mauvaises: [
      { plante: 'Haricot', emoji: '🫘', raison: 'Le poireau freine le développement du haricot' },
      { plante: 'Pois',    emoji: '🌱', raison: 'Même effet négatif que sur le haricot' },
    ],
  },
  'radis': {
    bonnes: [
      { plante: 'Salade',    emoji: '🥗', raison: 'Le radis repousse les altises de la salade' },
      { plante: 'Courgette', emoji: '🥒', raison: 'Repousse les insectes rampants' },
      { plante: 'Concombre', emoji: '🥒', raison: 'Éloigne les coléoptères du concombre' },
    ],
    mauvaises: [
      { plante: 'Hysope', emoji: '🌿', raison: 'Inhibe la croissance du radis' },
    ],
  },
  'concombre': {
    bonnes: [
      { plante: 'Radis',   emoji: '🔴', raison: 'Éloigne les coléoptères du concombre' },
      { plante: 'Aneth',   emoji: '🌿', raison: 'Attire les insectes bénéfiques pollinisateurs' },
      { plante: 'Haricot', emoji: '🫘', raison: "Fixation d'azote bénéfique" },
    ],
    mauvaises: [
      { plante: 'Tomate',         emoji: '🍅', raison: 'Concurrence hydrique et maladies communes' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies fongiques communes' },
    ],
  },
  'oignon': {
    bonnes: [
      { plante: 'Carotte', emoji: '🥕', raison: 'Protection mutuelle contre leurs parasites respectifs' },
      { plante: 'Tomate',  emoji: '🍅', raison: "L'oignon repousse certains nuisibles de la tomate" },
      { plante: 'Fraise',  emoji: '🍓', raison: "L'oignon protège les fraisiers des maladies fongiques" },
    ],
    mauvaises: [
      { plante: 'Haricot', emoji: '🫘', raison: "L'oignon inhibe fortement la croissance du haricot" },
      { plante: 'Pois',    emoji: '🌱', raison: 'Même effet inhibiteur que sur le haricot' },
    ],
  },
  'epinard': {
    bonnes: [
      { plante: 'Fraise',  emoji: '🍓', raison: 'Association très complémentaire, niveaux de racines différents' },
      { plante: 'Haricot', emoji: '🫘', raison: "Le haricot apporte de l'azote bénéfique à l'épinard" },
      { plante: 'Radis',   emoji: '🔴', raison: 'Bonne cohabitation, cycles complémentaires' },
    ],
    mauvaises: [
      { plante: 'Betterave', emoji: '🔴', raison: 'Concurrence pour les nitrates dans le sol' },
    ],
  },
  'pomme-terre': {
    bonnes: [
      { plante: 'Haricot',        emoji: '🫘', raison: "Le haricot fixe l'azote dont la pomme de terre a besoin" },
      { plante: 'Chou',           emoji: '🥬', raison: 'Bonne cohabitation reconnue' },
      { plante: "Œillet d'Inde",  emoji: '🌼', raison: 'Repousse les nématodes du sol' },
    ],
    mauvaises: [
      { plante: 'Tomate',    emoji: '🍅', raison: 'Maladies fongiques communes (mildiou)' },
      { plante: 'Concombre', emoji: '🥒', raison: 'Maladies communes et concurrence' },
      { plante: 'Fenouil',   emoji: '🌿', raison: 'Inhibe la croissance de la pomme de terre' },
    ],
  },
  'poivron': {
    bonnes: [
      { plante: 'Basilic',       emoji: '🌿', raison: 'Repousse les pucerons et thrips du poivron' },
      { plante: 'Carotte',       emoji: '🥕', raison: 'Ameublissement du sol bénéfique' },
      { plante: "Œillet d'Inde", emoji: '🌼', raison: 'Repousse les nématodes et insectes nuisibles' },
    ],
    mauvaises: [
      { plante: 'Fenouil',        emoji: '🌿', raison: 'Inhibe la croissance du poivron' },
      { plante: 'Pomme de terre', emoji: '🥔', raison: 'Maladies communes, notamment le mildiou' },
    ],
  },
}
