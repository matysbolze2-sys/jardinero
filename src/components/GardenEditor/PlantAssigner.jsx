import { useProfile } from '../../hooks/useProfile'

export default function PlantAssigner({ plotId, onClose }) {
  const { profile, assignPlantToPlot, removePlantFromPlot } = useProfile()

  const plot = profile.garden?.plots?.find(p => p.id === plotId)
  if (!plot) return null

  const assigned = new Set(plot.plants ?? [])

  function toggle(plantId) {
    if (assigned.has(plantId)) {
      removePlantFromPlot(plotId, plantId)
    } else {
      assignPlantToPlot(plotId, plantId)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl pb-8 pt-4"
        style={{ background: 'white', maxHeight: '60vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pb-3" style={{ borderBottom: '1px solid #DDE8CC' }}>
          <h3 className="font-fraunces text-base" style={{ color: '#1A2010' }}>
            Plantes dans « {plot.label || 'Parcelle'} »
          </h3>
          <button onClick={onClose} style={{ color: '#5A7040', fontSize: 20 }}>✕</button>
        </div>

        {profile.plants.length === 0 ? (
          <p className="px-4 py-6 text-sm text-center" style={{ color: '#5A7040' }}>
            Aucune plante dans ton jardin pour l'instant.
          </p>
        ) : (
          <div className="px-4 py-3 flex flex-col gap-2">
            {profile.plants.map(plant => {
              const isAssigned = assigned.has(plant.id)
              return (
                <button
                  key={plant.id}
                  onClick={() => toggle(plant.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-card text-left transition-all"
                  style={{
                    background: isAssigned ? '#EAF3DE' : '#F8FBF3',
                    border:     `1.5px solid ${isAssigned ? '#3B6D11' : '#DDE8CC'}`,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{plant.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#1A2010' }}>{plant.name}</p>
                    {plant.variety && (
                      <p className="text-xs" style={{ color: '#5A7040' }}>{plant.variety}</p>
                    )}
                  </div>
                  {isAssigned && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-chip" style={{ background: '#3B6D11', color: 'white' }}>
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
