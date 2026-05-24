import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import GardenSetup   from './GardenSetup'
import PlotEditor     from './PlotEditor'
import GardenView3D  from './GardenView3D'
import PlantAssigner  from './PlantAssigner'

function deriveInitialMode(garden) {
  if (!garden?.width) return 'setup'
  if ((garden.plots?.length ?? 0) === 0) return 'edit'
  return 'view'
}

// ── Sélecteur / liste de jardins ─────────────────────────────────────────────
function GardenPicker({ gardens, activeId, onSelect, onAdd, onDelete, onRename }) {
  const [adding,   setAdding]   = useState(false)
  const [newName,  setNewName]  = useState('')
  const [editId,   setEditId]   = useState(null)
  const [editName, setEditName] = useState('')

  function confirmAdd() {
    const n = newName.trim() || 'Mon jardin'
    onAdd(n)
    setNewName('')
    setAdding(false)
  }

  function confirmRename(id) {
    if (editName.trim()) onRename(id, editName.trim())
    setEditId(null)
    setEditName('')
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #DDE8CC' }}
      >
        <h2 className="font-fraunces text-base" style={{ color: '#1A2010' }}>Mes jardins</h2>
        <button
          onClick={() => setAdding(true)}
          className="text-sm font-semibold px-3 py-1.5 rounded-chip"
          style={{ background: '#3B6D11', color: 'white' }}
        >
          + Nouveau
        </button>
      </div>

      {/* New garden form */}
      {adding && (
        <div className="flex gap-2 px-4 py-3" style={{ background: '#F8FBF3', borderBottom: '1px solid #DDE8CC' }}>
          <input
            autoFocus
            type="text"
            placeholder="Nom du jardin…"
            value={newName}
            onChange={e => setNewName(e.target.value.slice(0, 40))}
            onKeyDown={e => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') setAdding(false) }}
            className="flex-1 px-3 py-1.5 rounded-chip text-sm"
            style={{ border: '1.5px solid #97C459', outline: 'none' }}
          />
          <button onClick={confirmAdd} className="text-sm font-semibold px-3 py-1.5 rounded-chip" style={{ background: '#3B6D11', color: 'white' }}>OK</button>
          <button onClick={() => setAdding(false)} className="text-sm px-2 py-1.5 rounded-chip" style={{ background: '#EAF3DE', color: '#5A7040' }}>✕</button>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col divide-y" style={{ borderColor: '#EAF3DE' }}>
        {gardens.length === 0 && (
          <p className="px-4 py-10 text-sm text-center" style={{ color: '#5A7040' }}>
            Aucun jardin — créez-en un !
          </p>
        )}
        {gardens.map(g => (
          <div
            key={g.id}
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: g.id === activeId ? '#EAF3DE' : 'white' }}
          >
            {editId === g.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value.slice(0, 40))}
                  onKeyDown={e => { if (e.key === 'Enter') confirmRename(g.id); if (e.key === 'Escape') setEditId(null) }}
                  className="flex-1 px-2 py-1 rounded text-sm"
                  style={{ border: '1.5px solid #97C459', outline: 'none' }}
                />
                <button onClick={() => confirmRename(g.id)} className="text-xs font-semibold" style={{ color: '#3B6D11' }}>✓</button>
                <button onClick={() => setEditId(null)} className="text-xs" style={{ color: '#5A7040' }}>✕</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelect(g.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold" style={{ color: '#1A2010' }}>
                    🌿 {g.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A7040' }}>
                    {g.width && g.height
                      ? `${g.width} × ${g.height} m · ${g.plots?.length ?? 0} parcelle${(g.plots?.length ?? 0) !== 1 ? 's' : ''}`
                      : 'Non configuré'}
                  </p>
                </button>
                <button
                  onClick={() => { setEditId(g.id); setEditName(g.name) }}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: '#5A7040' }}
                  title="Renommer"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer « ${g.name} » ?`)) onDelete(g.id)
                  }}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: '#DC2626' }}
                  title="Supprimer"
                >
                  🗑
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Éditeur d'un jardin sélectionné ──────────────────────────────────────────
function ActiveGardenEditor({ garden, plants }) {
  const { saveGarden, assignPlantToPlot, removePlantFromPlot } = useProfile()
  const [mode,            setMode]            = useState(() => deriveInitialMode(garden))
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
      {/* Tab bar */}
      {gardenReady && (
        <div className="flex border-b" style={{ borderColor: '#DDE8CC' }}>
          {[
            { id: 'setup', label: '⚙️ Taille'    },
            { id: 'edit',  label: '🗺️ Parcelles'  },
            { id: 'view',  label: '🌿 Vue 3D'     },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className="flex-1 py-2.5 text-xs font-semibold"
              style={{
                color:        mode === tab.id ? '#3B6D11' : '#5A7040',
                borderBottom: mode === tab.id ? '2px solid #3B6D11' : '2px solid transparent',
                background:   'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Header du jardin actif */}
      <div className="px-4 py-2" style={{ background: '#F8FBF3', borderBottom: '1px solid #DDE8CC' }}>
        <p className="text-xs font-semibold" style={{ color: '#3B6D11' }}>🌿 {garden.name}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {mode === 'setup' && (
          <GardenSetup garden={garden} onSave={handleSetupSave} />
        )}

        {mode === 'edit' && gardenReady && (
          <PlotEditor
            garden={garden}
            onSave={handlePlotSave}
            onBack={() => setMode('setup')}
          />
        )}

        {mode === 'view' && gardenReady && (
          <div className="flex flex-col gap-3 p-4">
            <div
              className="rounded-card overflow-hidden"
              style={{ height: 300, border: '1px solid #DDE8CC' }}
            >
              <GardenView3D garden={garden} plants={plants} />
            </div>

            {garden.plots?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#3B6D11' }}>Parcelles</h3>
                <div className="flex flex-col gap-2">
                  {garden.plots.map(plot => {
                    const assignedPlants = (plot.plants ?? [])
                      .map(id => plants?.find(p => p.id === id))
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

      {assigningPlotId && (
        <PlantAssigner plotId={assigningPlotId} onClose={() => setAssigningPlotId(null)} />
      )}
    </div>
  )
}

// ── Orchestrateur principal ───────────────────────────────────────────────────
export default function GardenEditor() {
  const { profile, addGarden, removeGarden, renameGarden, setActiveGarden } = useProfile()

  const gardens      = profile.gardens      ?? []
  const activeId     = profile.activeGardenId ?? null
  const activeGarden = gardens.find(g => g.id === activeId) ?? null

  // Vue liste ou vue éditeur
  const [view, setView] = useState(activeGarden ? 'editor' : 'list')

  function handleSelect(id) {
    setActiveGarden(id)
    setView('editor')
  }

  function handleAdd(name) {
    addGarden(name)
    setView('editor')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb / back */}
      {view === 'editor' && activeGarden && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #DDE8CC' }}>
          <button
            onClick={() => setView('list')}
            className="text-sm font-medium"
            style={{ color: '#5A7040' }}
          >
            ← Tous les jardins
          </button>
        </div>
      )}

      {view === 'list' && (
        <GardenPicker
          gardens={gardens}
          activeId={activeId}
          onSelect={handleSelect}
          onAdd={handleAdd}
          onDelete={removeGarden}
          onRename={renameGarden}
        />
      )}

      {view === 'editor' && activeGarden && (
        <ActiveGardenEditor
          key={activeGarden.id}
          garden={activeGarden}
          plants={profile.plants}
        />
      )}
    </div>
  )
}
