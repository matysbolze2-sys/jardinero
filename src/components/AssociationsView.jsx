import { useProfile } from '../hooks/useProfile'
import { ASSOCIATIONS } from '../data/associations'

// Vérifie si une plante compagne est déjà dans le jardin de l'utilisateur
function estDansJardin(nomCompagne, gardenPlants) {
  const norm = nomCompagne.toLowerCase().trim()
  return gardenPlants.some(p => p.name.toLowerCase().trim() === norm)
}

// Ligne d'une plante compagne (bonne ou mauvaise)
function LigneCompagne({ item, dansJardin, type }) {
  const isBonne = type === 'bonne'
  return (
    <div
      className="flex items-start gap-2.5 py-2.5 border-b last:border-0"
      style={{ borderColor: isBonne ? '#EAF3DE' : '#FEE2E2' }}
    >
      <span className="text-xl leading-none flex-shrink-0 mt-0.5">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: '#1A2010' }}>{item.plante}</span>
          {dansJardin && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-chip font-semibold flex-shrink-0"
              style={
                isBonne
                  ? { background: '#EAF3DE', color: '#3B6D11', border: '1px solid #97C459' }
                  : { background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA' }
              }
            >
              {isBonne ? '✓ Dans votre jardin' : '⚠️ Dans votre jardin'}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B7A5C' }}>{item.raison}</p>
      </div>
    </div>
  )
}

// Carte d'associations pour une plante
function CarteAssociation({ plant, gardenPlants }) {
  const assoc = ASSOCIATIONS[plant.plantId]
  if (!assoc) return null

  const conflits = assoc.mauvaises.filter(m => estDansJardin(m.plante, gardenPlants))
  const synergies = assoc.bonnes.filter(b => estDansJardin(b.plante, gardenPlants))

  return (
    <div
      className="rounded-card overflow-hidden mb-4"
      style={{ border: conflits.length > 0 ? '2px solid #FECACA' : '1px solid #DDE8CC', background: 'white' }}
    >
      {/* En-tête plante */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: conflits.length > 0 ? '#FEF2F2' : '#F8FFF4' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{plant.emoji}</span>
          <span className="font-fraunces font-semibold text-base" style={{ color: '#1A2010' }}>{plant.name}</span>
        </div>
        <div className="flex gap-1.5">
          {synergies.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-chip font-semibold" style={{ background: '#EAF3DE', color: '#3B6D11' }}>
              ✓ {synergies.length} synergie{synergies.length > 1 ? 's' : ''}
            </span>
          )}
          {conflits.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-chip font-semibold" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
              ⚠️ {conflits.length} conflit{conflits.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Bonnes associations */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#3B6D11' }}>
          ✅ Bonnes voisines
        </p>
        {assoc.bonnes.map((item, i) => (
          <LigneCompagne
            key={i}
            item={item}
            dansJardin={estDansJardin(item.plante, gardenPlants)}
            type="bonne"
          />
        ))}
      </div>

      {/* Mauvaises associations */}
      <div className="px-4 pt-3 pb-3">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#B91C1C' }}>
          ❌ Mauvaises voisines
        </p>
        {assoc.mauvaises.map((item, i) => (
          <LigneCompagne
            key={i}
            item={item}
            dansJardin={estDansJardin(item.plante, gardenPlants)}
            type="mauvaise"
          />
        ))}
      </div>
    </div>
  )
}

export default function AssociationsView() {
  const { profile } = useProfile()
  const plants = profile.plants ?? []

  // Plantes du jardin qui ont des données d'associations
  const plantsAvecAssoc = plants.filter(p => p.plantId && ASSOCIATIONS[p.plantId])

  // Conflits détectés dans le jardin actuel
  const conflitsJardin = []
  for (const plant of plantsAvecAssoc) {
    const assoc = ASSOCIATIONS[plant.plantId]
    for (const mauvaise of assoc.mauvaises) {
      if (estDansJardin(mauvaise.plante, plants)) {
        conflitsJardin.push({ plante: plant.name, compagne: mauvaise.plante, raison: mauvaise.raison })
      }
    }
  }

  if (plants.length === 0) return null

  if (plantsAvecAssoc.length === 0) {
    return (
      <div className="mt-4 text-center py-10 px-4" style={{ color: '#6B7A5C' }}>
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-sm">Aucune donnée d'association pour vos plantes actuelles.</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6B7A5C' }}>
        Le compagnonnage optimise votre jardin — certaines plantes se protègent mutuellement, d'autres se nuisent.
        Les badges <span style={{ color: '#3B6D11', fontWeight: 600 }}>✓ Dans votre jardin</span> et <span style={{ color: '#B91C1C', fontWeight: 600 }}>⚠️ Dans votre jardin</span> signalent les plantes déjà présentes.
      </p>

      {/* Alerte conflits détectés */}
      {conflitsJardin.length > 0 && (
        <div
          className="rounded-card p-4 mb-5"
          style={{ background: '#FEF2F2', border: '2px solid #FECACA' }}
        >
          <p className="font-semibold text-sm mb-2" style={{ color: '#B91C1C' }}>
            ⚠️ {conflitsJardin.length} conflit{conflitsJardin.length > 1 ? 's' : ''} détecté{conflitsJardin.length > 1 ? 's' : ''} dans votre jardin
          </p>
          {conflitsJardin.map((c, i) => (
            <p key={i} className="text-xs mb-1 leading-relaxed" style={{ color: '#7F1D1D' }}>
              • <strong>{c.plante}</strong> + <strong>{c.compagne}</strong> — {c.raison}
            </p>
          ))}
        </div>
      )}

      {/* Cartes par plante */}
      {plantsAvecAssoc.map(plant => (
        <CarteAssociation key={plant.id} plant={plant} gardenPlants={plants} />
      ))}

      {/* Plantes sans données */}
      {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length > 0 && (
        <p className="text-xs text-center mt-2" style={{ color: '#6B7A5C' }}>
          {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length} plante(s) sans données de compagnonnage
        </p>
      )}
    </div>
  )
}
