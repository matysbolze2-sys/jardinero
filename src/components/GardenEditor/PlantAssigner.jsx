import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { getConflictLevel, ASSOCIATIONS } from '../../data/associations'
import { getHistoriqueByPlot, getFamillePlante, FAMILLES_ROTATION, respecteRotation } from '../../data/rotation'
import EmojiIllo from '../EmojiIllo'

function getAdjacentPlots(targetPlot, allPlots, maxDistance = 1.0) {
  return allPlots.filter(other => {
    if (other.id === targetPlot.id) return false
    const gapX = Math.max(0,
      Math.max(targetPlot.x, other.x) -
      Math.min(targetPlot.x + targetPlot.width, other.x + other.width)
    )
    const gapY = Math.max(0,
      Math.max(targetPlot.y, other.y) -
      Math.min(targetPlot.y + targetPlot.height, other.y + other.height)
    )
    return Math.sqrt(gapX * gapX + gapY * gapY) <= maxDistance
  })
}

function RotationWarning({ plotId, historique }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const hist = getHistoriqueByPlot(plotId, historique)
  if (hist.length === 0) return null
  const last = hist[0]
  if (!last.plantId) return null
  const check = respecteRotation(last.plantId, last.harvestedAt)
  if (check.ok) return null

  const famille = getFamillePlante(last.plantId)

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-3 py-2.5"
      style={{
        background: 'var(--jd-warning-soft)',
        border:     '1px solid var(--jd-warning-ring)',
      }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--jd-warning)' }}>
        🔄 Rotation non respectée
      </p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
        Cette parcelle a accueilli des <strong style={{ color: 'var(--jd-ink)' }}>{famille ?? 'plantes'}</strong> il y a moins de{' '}
        {FAMILLES_ROTATION[famille ?? '']?.rotation ?? '?'} ans.
        Encore <strong style={{ color: 'var(--jd-warning)' }}>{check.moisRestants} mois</strong> avant de replanter cette famille.
      </p>
      <button
        className="text-xs mt-1.5 font-semibold tap-scale"
        style={{ color: 'var(--jd-warning)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setDismissed(true)}
      >
        Continuer quand même ▼
      </button>
    </div>
  )
}

function AssociationWarning({ plotId, allPlots, gardenPlants, plantBeingAssigned }) {
  if (!plantBeingAssigned?.plantId) return null

  const plot = allPlots.find(p => p.id === plotId)
  if (!plot) return null
  const adjacentPlots = getAdjacentPlots(plot, allPlots)

  const adjacentPlants = adjacentPlots.flatMap(ap =>
    (ap.plants ?? [])
      .map(pid => gardenPlants.find(gp => gp.id === pid))
      .filter(Boolean)
  )

  const conflicts = adjacentPlants
    .filter(ap => ap.plantId)
    .map(ap => ({
      plant: ap,
      level: getConflictLevel(plantBeingAssigned.plantId, ap.plantId),
    }))
    .filter(c => c.level !== null)

  if (conflicts.length === 0) return null
  const hasFort = conflicts.some(c => c.level === 'forte')

  return (
    <div
      className="mx-4 mt-2 rounded-xl px-3 py-2"
      style={{
        background: hasFort ? 'var(--jd-harvest-soft)' : 'var(--jd-warning-soft)',
        border:     `1px solid ${hasFort ? 'var(--jd-harvest-ring)' : 'var(--jd-warning-ring)'}`,
      }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: hasFort ? 'var(--jd-harvest)' : 'var(--jd-warning)' }}>
        {hasFort ? '⚠️ Conflit avec une parcelle adjacente' : '💡 Attention voisinage'}
      </p>
      {conflicts.slice(0, 2).map((c, i) => (
        <p key={i} className="text-xs" style={{ color: hasFort ? 'var(--jd-harvest)' : 'var(--jd-warning)', opacity: 0.85 }}>
          {c.plant.emoji} <strong>{c.plant.name}</strong> (à côté) —{' '}
          {c.level === 'forte' ? 'conflit fort' : 'conflit modéré'}
        </p>
      ))}
    </div>
  )
}

export default function PlantAssigner({ plotId, onClose }) {
  const { profile, assignPlantToPlot, removePlantFromPlot } = useProfile()
  const [hoveredPlant, setHoveredPlant] = useState(null)

  const activeGarden = (profile.gardens ?? []).find(g => g.id === profile.activeGardenId)
  const plot         = activeGarden?.plots?.find(p => p.id === plotId)
  const allPlots     = activeGarden?.plots ?? []
  const historique   = profile.historique ?? []

  if (!plot) return null

  const assigned = new Set(plot.plants ?? [])

  function toggle(plant) {
    if (assigned.has(plant.id)) {
      removePlantFromPlot(plotId, plant.id)
    } else {
      assignPlantToPlot(plotId, plant.id)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end"
      style={{ background: 'rgba(13,20,15,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[28px] pb-8 pt-4 sheet-enter"
        style={{ background: 'var(--jd-surface)', maxHeight: '72dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div
          className="flex items-center justify-between px-4 pb-3"
          style={{ borderBottom: '1px solid var(--jd-border)' }}
        >
          <h3 className="jd-title" style={{ fontSize: 16, color: 'var(--jd-ink)' }}>
            Plantes dans « {plot.label || 'Parcelle'} »
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center tap-scale"
            style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-ink-muted)', fontSize: 18 }}
          >
            ✕
          </button>
        </div>

        {/* Alerte rotation */}
        <RotationWarning plotId={plotId} historique={historique} />

        {/* Alerte association adjacente */}
        {hoveredPlant && (
          <AssociationWarning
            plotId={plotId}
            allPlots={allPlots}
            gardenPlants={profile.plants}
            plantBeingAssigned={hoveredPlant}
          />
        )}

        {profile.plants.length === 0 ? (
          <p className="px-4 py-6 text-sm text-center" style={{ color: 'var(--jd-ink-muted)' }}>
            Aucune plante dans ton jardin pour l'instant.
          </p>
        ) : (
          <div className="px-4 py-3 flex flex-col gap-2">
            {profile.plants.map(plant => {
              const isAssigned = assigned.has(plant.id)

              const plotPlants = (plot.plants ?? [])
                .map(pid => profile.plants.find(p => p.id === pid))
                .filter(Boolean)
              const hasConflict = plotPlants.some(pp =>
                pp.plantId && plant.plantId && getConflictLevel(plant.plantId, pp.plantId) === 'forte'
              )

              return (
                <button
                  key={plant.id}
                  onClick={() => toggle(plant)}
                  onPointerEnter={() => setHoveredPlant(plant)}
                  onPointerLeave={() => setHoveredPlant(null)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-card text-left tap-scale transition-all"
                  style={{
                    background: isAssigned   ? 'var(--jd-accent-soft)'  :
                                hasConflict  ? 'var(--jd-harvest-soft)' :
                                              'var(--jd-surface-alt)',
                    border: `1px solid ${
                      isAssigned   ? 'var(--jd-accent-ring)'  :
                      hasConflict  ? 'var(--jd-harvest-ring)' :
                                    'var(--jd-border)'
                    }`,
                  }}
                >
                  <EmojiIllo emoji={plant.emoji} size={36} ring={false} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--jd-ink)' }}>{plant.name}</p>
                    {plant.variety && (
                      <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>{plant.variety}</p>
                    )}
                    {hasConflict && !isAssigned && (
                      <p className="text-xs" style={{ color: 'var(--jd-harvest)' }}>
                        ⚠️ Conflit avec une plante de cette parcelle
                      </p>
                    )}
                  </div>
                  {isAssigned && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-chip"
                      style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
