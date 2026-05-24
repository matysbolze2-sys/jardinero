// Zones climatiques françaises
// offset : décalage en semaines par rapport à la région de référence (Loire)
// Valeur positive = printemps plus tardif (planter plus tard)
// Valeur négative = printemps plus précoce (planter plus tôt)

export const REGIONS = [
  {
    id:     'nord',
    label:  'Nord / Hauts-de-France',
    offset: 3,
    lat:    50.63,
    lon:    3.07,
    desc:   'Hivers longs, printemps tardifs, étés doux',
  },
  {
    id:     'idf',
    label:  'Île-de-France',
    offset: 2,
    lat:    48.85,
    lon:    2.35,
    desc:   'Climat continental tempéré, gelées tardives possibles',
  },
  {
    id:     'grand-est',
    label:  'Grand Est / Alsace',
    offset: 2,
    lat:    48.57,
    lon:    7.75,
    desc:   'Hivers froids et secs, étés chauds',
  },
  {
    id:     'bretagne',
    label:  'Bretagne / Normandie',
    offset: 1,
    lat:    48.11,
    lon:    -1.68,
    desc:   "Climat océanique, doux et humide toute l'année",
  },
  {
    id:     'loire',
    label:  'Pays de la Loire / Centre',
    offset: 0,
    lat:    47.38,
    lon:    0.69,
    desc:   'Région de référence, climat tempéré équilibré',
  },
  {
    id:     'rhone-alpes',
    label:  'Rhône-Alpes',
    offset: 1,
    lat:    45.74,
    lon:    4.83,
    desc:   'Influence continentale, étés chauds, gelées printanières',
  },
  {
    id:     'montagne',
    label:  'Montagne (altitude > 600m)',
    offset: 4,
    lat:    45.18,
    lon:    5.72,
    desc:   'Saison courte, gelées tardives et précoces',
  },
  {
    id:     'sud-ouest',
    label:  'Sud-Ouest / Bordeaux',
    offset: -1,
    lat:    44.84,
    lon:    -0.58,
    desc:   'Doux en hiver, étés secs et chauds',
  },
  {
    id:     'mediterranee',
    label:  'Méditerranée / PACA / Corse',
    offset: -2,
    lat:    43.30,
    lon:    5.37,
    desc:   'Hivers doux, étés très chauds et secs',
  },
]

// Retourne une région par son id
export function getRegionById(id) {
  return REGIONS.find(r => r.id === id) ?? REGIONS.find(r => r.id === 'loire')
}
