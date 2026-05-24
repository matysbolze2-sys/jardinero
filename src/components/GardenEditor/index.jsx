import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import GardenSetup   from './GardenSetup'
import PlotEditor     from './PlotEditor'
import GardenView3D  from './GardenView3D'
import PlantAssigner  from './PlantAssigner'

// mode: 'setup' | 'edit' | 'view'
function deriveInitialMode(garden) {
  if (!garden?.width) return 'setup'
  if ((garden.plots?.length ?? 0) === 0) return 'edit'
  return 'view'
}

export default function GardenEditor() {
  const { profile, saveGarden } = useProfile()
  const garden = profile.garden ?? {}

  const [mode,           setMode]           = useState(() => deriveInitialMode(garden))
  const [assigningPlotId, setAssigningPlotId] = useState(null)

  function handleSetupSave(data) {
    saveGarden(data)
    setMode('edit')
  }

  function handlePlotSave(data) {
    saveGarden(data)
    setMode('view')
  }

  const gardenReady = garden.width && garden.height

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar (only when garden is configured) */}
      {gardenReady && (
        <div
          className="flex border-b"
          style={{ borderColor: '#DDE8CC' }}
        >
          {[
            { id: 'setup', label: '⚙️ Taille'    },
            { id: 'edit',  label: '🗺️ Parcelles'  },
            { id: 'view',  label: '🌿 Vue 3D'     },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className="flex-1 py-2.5 text-xs font-semibold transition-all"
              style={{
                color:           mode === tab.id ? '#3B6D11' : '#5A7040',
                borderBottom:    mode === tab.id ? '2px solid #3B6D11' : '2px solid transparent',
                background:      'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {mode === 'setup' && (
          <GardenSetup
            garden={garden}
            onSave={handleSetupSave}
          />
        )}

        {mode === 'edit' && gardenReady && (
          <div className="h-full flex flex-col">
            <PlotEditor
              garden={garden}
              onSave={handlePlotSave}
              onBack={() => setMode('setup')}
            />
            {/* Assign plants button when a plot is selected */}
          </div>
        )}

        {mode === 'view' && gardenReady && (
          <div className="flex flex-col gap-3 p-4 h-full">
            {/* 3D canvas */}
            <div
              className="rounded-card overflow-hidden flex-1"
              style={{ minHeight: 320, border: '1px solid #DDE8CC' }}
            >
              <GardenView3D
                garden={garden}
                plants={profile.plants}
              />
            </div>

            {/* Plot list with plant assignment */}
            {garden.plots?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#3B6D11' }}>
                  Parcelles
                </h3>
                <div className="flex flex-col gap-2">
                  {garden.plots.map(plot => {
                    const assignedPlants = (plot.plants ?? [])
                      .map(id => profile.plants.find(p => p.id === id))
                      .filter(Boolean)
                    return (
                      <div
                        key={plot.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-card"
                        style={{ background: '#F8FBF3', border: '1px solid #DDE8CC' }}
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1A2010' }}>
                            {plot.label || 'Parcelle'}{' '}
                            <span className="text-xs font-normal" style={{ color: '#5A7040' }}>
                              {plot.width}×{plot.height}m
                            </span>
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#5A7040' }}>
                            {assignedPlants.length > 0
                              ? assignedPlants.map(p => p.emoji).join(' ')
                              : 'Aucune plante'}
                          </p>
                        </div>
                        <button
                          onClick={() => setAssigningPlotId(plot.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-chip"
                          style={{ background: '#EAF3DE', color: '#3B6D11' }}
                        >
                          Gérer
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => setMode('edit')}
              className="text-sm font-medium py-2 rounded-card"
              style={{ background: '#EAF3DE', color: '#3B6D11' }}
            >
              ✏️ Modifier les parcelles
            </button>
          </div>
        )}
      </div>

      {/* Plant assigner sheet */}
      {assigningPlotId && (
        <PlantAssigner
          plotId={assigningPlotId}
          onClose={() => setAssigningPlotId(null)}
        />
      )}
    </div>
  )
}
