import { useProfile } from '../hooks/useProfile'
import { ASSOCIATIONS } from '../data/associations'

function estDansJardin(nomCompagne, gardenPlants) {
  const norm = nomCompagne.toLowerCase().trim()
  return gardenPlants.some(p => p.name.toLowerCase().trim() === norm)
}

function LigneCompagne({ item, dansJardin, type }) {
  const isBonne = type === 'bonne'
  return (
    <div
      className="flex items-start gap-2.5 py-2.5 border-b last:border-0"
      style={{ borderColor: isBonne ? 'var(--jd-accent-ring)' : 'rgba(224,90,58,0.2)' }}
    >
      <span className="text-xl leading-none flex-shrink-0 mt-0.5">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>{item.plante}</span>
          {dansJardin && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-chip font-semibold flex-shrink-0"
              style={
                isBonne
                  ? { background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', border: '1px solid var(--jd-accent-ring)' }
                  : { background: 'rgba(224,90,58,0.1)', color: '#E05A3A', border: '1px solid rgba(224,90,58,0.3)' }
              }
            >
              {isBonne ? '✓ Dans votre jardin' : '⚠️ Dans votre jardin'}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>{item.raison}</p>
      </div>
    </div>
  )
}

function CarteAssociation({ plant, gardenPlants }) {
  const assoc = ASSOCIATIONS[plant.plantId]
  if (!assoc) return null

  const conflits  = assoc.mauvaises.filter(m => estDansJardin(m.plante, gardenPlants))
  const synergies = assoc.bonnes.filter(b => estDansJardin(b.plante, gardenPlants))

  return (
    <div
      className="rounded-card overflow-hidden mb-4"
      style={{
        border:     conflits.length > 0 ? '1px solid rgba(224,90,58,0.4)' : '1px solid var(--jd-border)',
        background: 'var(--jd-surface)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: conflits.length > 0 ? 'rgba(224,90,58,0.08)' : 'var(--jd-surface-alt)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{plant.emoji}</span>
          <span className="font-display font-semibold text-base" style={{ color: 'var(--jd-ink)' }}>{plant.name}</span>
        </div>
        <div className="flex gap-1.5">
          {synergies.length > 0 && (
            <span className="jd-chip">
              ✓ {synergies.length} synergie{synergies.length > 1 ? 's' : ''}
            </span>
          )}
          {conflits.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-chip font-semibold" style={{ background: 'rgba(224,90,58,0.15)', color: '#E05A3A' }}>
              ⚠️ {conflits.length} conflit{conflits.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--jd-accent)' }}>
          ✅ Bonnes voisines
        </p>
        {assoc.bonnes.map((item, i) => (
          <LigneCompagne key={i} item={item} dansJardin={estDansJardin(item.plante, gardenPlants)} type="bonne" />
        ))}
      </div>

      <div className="px-4 pt-3 pb-3">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#E05A3A' }}>
          ❌ Mauvaises voisines
        </p>
        {assoc.mauvaises.map((item, i) => (
          <LigneCompagne key={i} item={item} dansJardin={estDansJardin(item.plante, gardenPlants)} type="mauvaise" />
        ))}
      </div>
    </div>
  )
}

export default function AssociationsView() {
  const { profile } = useProfile()
  const plants = profile.plants ?? []

  const plantsAvecAssoc = plants.filter(p => p.plantId && ASSOCIATIONS[p.plantId])

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
      <div className="mt-4 text-center py-10 px-4" style={{ color: 'var(--jd-ink-muted)' }}>
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-sm">Aucune donnée d'association pour vos plantes actuelles.</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
        Le compagnonnage optimise votre jardin — certaines plantes se protègent mutuellement, d'autres se nuisent.
        Les badges <span style={{ color: 'var(--jd-accent)', fontWeight: 600 }}>✓ Dans votre jardin</span> et{' '}
        <span style={{ color: '#E05A3A', fontWeight: 600 }}>⚠️ Dans votre jardin</span> signalent les plantes déjà présentes.
      </p>

      {conflitsJardin.length > 0 && (
        <div
          className="rounded-card p-4 mb-5"
          style={{ background: 'rgba(224,90,58,0.08)', border: '1px solid rgba(224,90,58,0.4)' }}
        >
          <p className="font-semibold text-sm mb-2" style={{ color: '#E05A3A' }}>
            ⚠️ {conflitsJardin.length} conflit{conflitsJardin.length > 1 ? 's' : ''} détecté{conflitsJardin.length > 1 ? 's' : ''} dans votre jardin
          </p>
          {conflitsJardin.map((c, i) => (
            <p key={i} className="text-xs mb-1 leading-relaxed" style={{ color: '#E05A3A', opacity: 0.85 }}>
              • <strong>{c.plante}</strong> + <strong>{c.compagne}</strong> — {c.raison}
            </p>
          ))}
        </div>
      )}

      {plantsAvecAssoc.map(plant => (
        <CarteAssociation key={plant.id} plant={plant} gardenPlants={plants} />
      ))}

      {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length > 0 && (
        <p className="text-xs text-center mt-2" style={{ color: 'var(--jd-ink-muted)' }}>
          {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length} plante(s) sans données de compagnonnage
        </p>
      )}
    </div>
  )
}
