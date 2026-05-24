// Calendrier : tableau 12 valeurs (Jan → Déc)
// 0=rien | 1=semis | 2=croissance | 3=récolte
//
// waterDays : intervalle de base entre deux arrosages (en jours)
// pour un sol limoneux au printemps/automne.
// Le module arrosageUtils applique ensuite les correctifs sol + saison.

export const PLANTS = [
  {
    id: 'tomate', label: 'Tomate', emoji: '🍅',
    // Semis indoor fév-mars, plantation mai, récolte juil-oct
    calendar:  [0,1,1,1,2,2,3,3,3,3,0,0],
    waterDays: 2, // Exigeante en eau, surtout en fructification
  },
  {
    id: 'courgette', label: 'Courgette', emoji: '🥒',
    // Semis indoor avr-mai, récolte juin-oct
    calendar:  [0,0,0,1,1,2,3,3,3,3,0,0],
    waterDays: 3,
  },
  {
    id: 'carotte', label: 'Carotte', emoji: '🥕',
    // Semis en place fév-juil (plusieurs cycles), récolte juin-nov
    calendar:  [0,1,1,1,2,2,3,3,3,3,1,0],
    waterDays: 3,
  },
  {
    id: 'salade', label: 'Salade', emoji: '🥗',
    // Plusieurs cycles : fév-avr et août-oct
    calendar:  [0,1,1,2,3,3,3,2,1,2,2,0],
    waterDays: 2, // Très sensible au manque d'eau
  },
  {
    id: 'haricot', label: 'Haricot', emoji: '🫘',
    // Semis en place avr-juil, récolte juil-oct
    calendar:  [0,0,0,1,1,2,3,3,3,0,0,0],
    waterDays: 3,
  },
  {
    id: 'poireau', label: 'Poireau', emoji: '🧅',
    // Semis indoor jan-avr, repiquage mai-juil, récolte oct-mars
    calendar:  [1,1,2,2,2,2,2,2,3,3,3,3],
    waterDays: 5, // Résistant à la sécheresse une fois bien établi
  },
  {
    id: 'radis', label: 'Radis', emoji: '🔴',
    // Cycle très court (~25j). 2 saisons : mars-juin et août-oct
    calendar:  [0,1,2,3,3,0,0,1,2,3,0,0],
    waterDays: 2, // Croissance rapide = arrosage régulier
  },
  {
    id: 'pomme-terre', label: 'Pomme de terre', emoji: '🥔',
    // Plantation tubercules mars-avr, récolte juil-oct
    calendar:  [0,0,1,1,2,2,3,3,3,2,0,0],
    waterDays: 6, // Espacé, surtout important à la formation des tubercules
  },
  {
    id: 'poivron', label: 'Poivron', emoji: '🫑',
    // Semis indoor fév-mars (chaleur nécessaire), plantation mai-juin, récolte août-oct
    calendar:  [0,1,1,2,2,2,2,3,3,3,0,0],
    waterDays: 2,
  },
  {
    id: 'concombre', label: 'Concombre', emoji: '🥒',
    // Semis indoor avr-mai, récolte juil-sept
    calendar:  [0,0,0,1,1,2,3,3,3,0,0,0],
    waterDays: 2, // Très exigeant, fruits à 96% d'eau
  },
  {
    id: 'oignon', label: 'Oignon', emoji: '🧅',
    // Plantation de bulbilles mars-avr, récolte juil-août
    calendar:  [0,0,1,1,2,2,2,3,3,0,0,0],
    waterDays: 6, // Résistant à la sécheresse, excès d'eau nuit aux bulbes
  },
  {
    id: 'epinard', label: 'Épinard', emoji: '🌿',
    // 2 cycles : semis fév-avr (récolte avr-juin) et août-sept (récolte oct-déc)
    calendar:  [0,1,1,2,3,3,0,1,2,3,3,0],
    waterDays: 3,
  },
]

export const STATUT_LABELS = {
  sowed:     { label: 'Semé',        color: '#97C459' },
  growing:   { label: 'En pousse',   color: '#3B6D11' },
  flowering: { label: 'En fleurs',   color: '#FAC775' },
  ready:     { label: 'À récolter',  color: '#E05A3A' },
}

export const CALENDAR_LABELS = {
  0: null,
  1: 'Semis',
  2: 'Croissance',
  3: 'Récolte',
}

export const MOIS_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]
