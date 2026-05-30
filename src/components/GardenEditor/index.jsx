import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { getEffectiveStatus } from '../../utils/plantStatusUtils'
import { getRegionById } from '../../data/regions'
import GardenSetup   from './GardenSetup'
import PlotEditor     from './PlotEditor'
import GardenView3D  from './GardenView3D'
import PlantAssigner  from './PlantAssigner'

function deriveInitialMode(garden) {
  if (!garden?.width) return 'setup'
  if ((garden.plots?.length ?? 0) === 0) return 'edit'
  return 'view'
}

// ── Garden picker ─────────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--jd-border)',
      }}>
        <div className="jd-kicker">Mes jardins</div>
        <button
          onClick={() => setAdding(true)}
          className="tap-scale"
          style={{
            fontSize: 12, fontWeight: 600,
            padding: '6px 14px', borderRadius: 999,
            background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)',
          }}
        >
          + Nouveau
        </button>
      </div>

      {adding && (
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          background: 'var(--jd-surface-alt)',
          borderBottom: '1px solid var(--jd-border)',
        }}>
          <input
            autoFocus
            type="text"
            placeholder="Nom du jardin…"
            value={newName}
            onChange={e => setNewName(e.target.value.slice(0, 40))}
            onKeyDown={e => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') setAdding(false) }}
            style={{
              flex: 1, padding: '7px 12px', borderRadius: 999, fontSize: 13,
              background: 'var(--jd-surface)', color: 'var(--jd-ink)',
              border: '1.5px solid var(--jd-accent-ring)', outline: 'none',
            }}
          />
          <button onClick={confirmAdd} className="tap-scale" style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 999, background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}>OK</button>
          <button onClick={() => setAdding(false)} className="tap-scale" style={{ fontSize: 12, padding: '7px 10px', borderRadius: 999, background: 'var(--jd-surface-alt)', color: 'var(--jd-ink-muted)', border: '1px solid var(--jd-border)' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {gardens.length === 0 && (
          <p style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13, color: 'var(--jd-ink-muted)' }}>
            Aucun jardin — créez-en un !
          </p>
        )}
        {gardens.map(g => (
          <div
            key={g.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: g.id === activeId ? 'var(--jd-surface-alt)' : 'transparent',
              borderBottom: '1px solid var(--jd-border)',
            }}
          >
            {editId === g.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value.slice(0, 40))}
                  onKeyDown={e => { if (e.key === 'Enter') confirmRename(g.id); if (e.key === 'Escape') setEditId(null) }}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: 8, fontSize: 13, background: 'var(--jd-surface)', color: 'var(--jd-ink)', border: '1.5px solid var(--jd-accent)', outline: 'none' }}
                />
                <button onClick={() => confirmRename(g.id)} className="tap-scale" style={{ fontSize: 12, fontWeight: 700, color: 'var(--jd-accent)' }}>✓</button>
                <button onClick={() => setEditId(null)} className="tap-scale" style={{ fontSize: 12, color: 'var(--jd-ink-muted)' }}>✕</button>
              </>
            ) : (
              <>
                <button onClick={() => onSelect(g.id)} className="tap-scale" style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--jd-ink)' }}>🌿 {g.name}</p>
                  <p style={{ fontSize: 11, marginTop: 2, color: 'var(--jd-ink-muted)' }}>
                    {g.width && g.height
                      ? `${g.width} × ${g.height} m · ${g.plots?.length ?? 0} parcelle${(g.plots?.length ?? 0) !== 1 ? 's' : ''}`
                      : 'Non configuré'}
                  </p>
                </button>
                <button
                  onClick={() => { setEditId(g.id); setEditName(g.name) }}
                  className="tap-scale"
                  style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, color: 'var(--jd-ink-muted)' }}
                  title="Renommer"
                >✏️</button>
                <button
                  onClick={() => { if (window.confirm(`Supprimer « ${g.name} » ?`)) onDelete(g.id) }}
                  className="tap-scale"
                  style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, color: 'var(--jd-harvest)' }}
                  title="Supprimer"
                >🗑</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Active garden editor ──────────────────────────────────────────────────────
function ActiveGardenEditor({ garden, plants }) {
  const { saveGarden, profile } = useProfile()
  const regionOffset    = getRegionById(profile.region)?.offset ?? 0
  const enrichedPlants  = (plants ?? []).map(p => ({
    ...p,
    effectiveStatus: getEffectiveStatus(p, regionOffset),
  }))
  const [mode,            setMode]            = useState(() => deriveInitialMode(garden))
  const [assigningPlotId, setAssigningPlotId] = useState(null)

  const gardenReady = garden.width && garden.height

  const TABS = [
    { id: 'setup', label: '⚙️ Taille'   },
    { id: 'edit',  label: '🗺️ Parcelles' },
    { id: 'view',  label: '🌿 Vue 3D'    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      {gardenReady && (
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--jd-border)',
          background: 'var(--jd-surface)',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className="tap-scale"
              style={{
                flex: 1, padding: '10px 0',
                fontSize: 11, fontWeight: 600,
                color:        mode === tab.id ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
                borderBottom: mode === tab.id ? '2px solid var(--jd-accent)' : '2px solid transparent',
                background:   'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Garden name header */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--jd-border)', background: 'var(--jd-surface-alt)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--jd-accent)' }}>🌿 {garden.name}</p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mode === 'setup' && (
          <GardenSetup garden={garden} onSave={data => { saveGarden(data); setMode('edit') }} />
        )}

        {mode === 'edit' && gardenReady && (
          <PlotEditor
            garden={garden}
            onSave={data => { saveGarden(data); setMode('view') }}
            onBack={() => setMode('setup')}
          />
        )}

        {mode === 'view' && gardenReady && (
          <div style={{ padding: 16 }}>
            <GardenView3D garden={garden} plants={enrichedPlants} />

            <button
              onClick={() => setMode('edit')}
              className="w-full tap-scale"
              style={{
                marginTop: 14, padding: '10px 0', fontSize: 13, fontWeight: 600,
                borderRadius: 'var(--jd-radius)',
                background: 'var(--jd-surface-alt)',
                border: '1px solid var(--jd-border)',
                color: 'var(--jd-accent)',
              }}
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

// ── Root ──────────────────────────────────────────────────────────────────────
export default function GardenEditor() {
  const { profile, addGarden, removeGarden, renameGarden, setActiveGarden } = useProfile()

  const gardens      = profile.gardens       ?? []
  const activeId     = profile.activeGardenId ?? null
  const activeGarden = gardens.find(g => g.id === activeId) ?? null

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--jd-bg)' }}>
      {view === 'editor' && activeGarden && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--jd-border)' }}>
          <button
            onClick={() => setView('list')}
            className="tap-scale"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--jd-ink-muted)' }}
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
