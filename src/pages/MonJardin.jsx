import { useState } from 'react'
import { triggerRipple } from '../utils/ripple'
import { useProfile } from '../hooks/useProfile'
import PlantCard from '../components/PlantCard'
import AddPlantModal from '../components/AddPlantModal'
import ArrosageCalendar from '../components/ArrosageCalendar'
import AssociationsView from '../components/AssociationsView'
import RotationDashboard from '../components/RotationDashboard'
import GardenEditor from '../components/GardenEditor'
import PlantDetailSheet from '../components/PlantDetailSheet'
import TemplatePicker from '../components/TemplatePicker'
import RecoltesView from '../components/RecoltesView'
import { ASSOCIATIONS } from '../data/associations'
import { getRegionById } from '../data/regions'
import { PLANT_DURATIONS } from '../data/plantDurations'
import { getCycleProgress } from '../utils/plantStatusUtils'

export default function MonJardin() {
  const { profile, addPlant } = useProfile()
  const [showAddModal,     setShowAddModal]     = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [activeTab,      setActiveTab]      = useState('plantes')
  const [assocSubTab,    setAssocSubTab]    = useState('voisines')
  const [detailSheet,    setDetailSheet]    = useState(null)

  const plants       = profile.plants ?? []
  const regionOffset = getRegionById(profile.region)?.offset ?? 0

  const hasConflits = plants.some(p => {
    if (!p.plantId || !ASSOCIATIONS[p.plantId]) return false
    return ASSOCIATIONS[p.plantId].mauvaises.some(m =>
      plants.some(other => other.name.toLowerCase().trim() === m.plante.toLowerCase().trim())
    )
  })

  // Progression globale = moyenne des progressions de cycle calculables.
  // On exclut les vivaces et les plantes sans durée/date (getCycleProgress y
  // renvoie 0, ce qui fausserait la moyenne). Aucune calculable → null → « — ».
  const progresses = plants
    .filter(p => {
      const d = PLANT_DURATIONS[p.plantId]
      return d && d.type !== 'perennial' && p.plantedAt
    })
    .map(p => getCycleProgress(p, regionOffset))

  const progressScore = progresses.length
    ? Math.round(progresses.reduce((sum, v) => sum + v, 0) / progresses.length)
    : null

  return (
    <div className="px-4 pt-6 pb-4 relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--jd-accent)' }}>Mon Jardin</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>
            {plants.length === 0
              ? 'Aucune plante pour le moment'
              : `${plants.length} plante${plants.length > 1 ? 's' : ''} en cours`}
          </p>
        </div>
        <button
          onClick={e => { triggerRipple(e); setShowAddModal(true) }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-chip font-semibold text-sm tap-scale"
          style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)', position: 'relative', overflow: 'hidden' }}
        >
          + Ajouter
        </button>
      </div>

      {plants.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
            <span>Progression globale</span>
            <span className="font-semibold" style={{ color: 'var(--jd-accent)' }}>
              {progressScore === null ? '—' : `${progressScore}%`}
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--jd-accent-soft)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressScore ?? 0}%`, background: 'var(--jd-accent)' }}
            />
          </div>
          {progressScore === null && (
            <p className="text-xs mt-1" style={{ color: 'var(--jd-ink-muted)' }}>
              Tes plantes vivaces n'ont pas de cycle annuel à suivre.
            </p>
          )}
        </div>
      )}

      {plants.length > 0 && (
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'var(--jd-surface)' }}>
          {[
            { id: 'plantes',      label: '🌱 Plantes',   onClick: () => setActiveTab('plantes') },
            { id: 'arrosage',     label: '💧 Arrosage',  onClick: () => setActiveTab('arrosage') },
            { id: 'associations', label: hasConflits ? '⚠️ Voisines' : '🤝 Voisines', onClick: () => setActiveTab('associations') },
            { id: 'recoltes',     label: '🧺 Récoltes',  onClick: () => setActiveTab('recoltes') },
            { id: 'jardin3d',     label: '🌿 Jardin 3D', onClick: () => setActiveTab('jardin3d') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all tap-scale"
              style={{
                background: activeTab === tab.id ? 'var(--jd-surface-alt)' : 'transparent',
                color:      activeTab === tab.id ? 'var(--jd-accent)'      : 'var(--jd-ink-muted)',
                boxShadow:  activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {plants.length === 0 && (
        <div
          className="mt-8 flex flex-col items-center text-center py-12 px-6 rounded-card"
          style={{ background: 'var(--jd-surface)', border: '1px dashed var(--jd-accent-ring)' }}
        >
          <span className="text-5xl mb-4">🌱</span>
          <p className="font-display font-bold text-lg mb-1" style={{ color: 'var(--jd-accent)' }}>
            Ton jardin est vide
          </p>
          <p className="text-sm mb-5" style={{ color: 'var(--jd-ink-muted)' }}>
            Ajoute tes premières plantes pour commencer à suivre ton potager.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-card font-semibold text-sm tap-scale"
            style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
          >
            Ajouter ma première plante
          </button>
          <button
            onClick={() => setShowTemplatePicker(true)}
            className="mt-3 text-sm font-semibold tap-scale"
            style={{ color: 'var(--jd-accent)' }}
          >
            🌱 Ou partir d'un modèle de jardin →
          </button>
        </div>
      )}

      {/* Récoltes toujours accessibles, même sans plante en cours */}
      {plants.length === 0 && (profile.historique?.length ?? 0) > 0 && (
        <div className="mt-6">
          <h2 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--jd-accent)' }}>
            🧺 Tes récoltes
          </h2>
          <RecoltesView />
        </div>
      )}

      {plants.length > 0 && activeTab === 'plantes' && (
        <div className="flex flex-col gap-3">
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onOpenDetail={(p, tab) => setDetailSheet({ plant: p, tab })}
            />
          ))}
        </div>
      )}

      {plants.length > 0 && activeTab === 'arrosage' && <ArrosageCalendar />}

      {plants.length > 0 && activeTab === 'recoltes' && <RecoltesView />}

      {plants.length > 0 && activeTab === 'associations' && (
        <>
          {/* Sub-toggle Voisines / Rotation */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'var(--jd-surface)' }}>
            {[
              { id: 'voisines', label: '🤝 Voisines' },
              { id: 'rotation', label: '🔄 Rotation' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setAssocSubTab(sub.id)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all tap-scale"
                style={{
                  background: assocSubTab === sub.id ? 'var(--jd-surface-alt)' : 'transparent',
                  color:      assocSubTab === sub.id ? 'var(--jd-accent)'      : 'var(--jd-ink-muted)',
                  boxShadow:  assocSubTab === sub.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
          {assocSubTab === 'voisines'
            ? <AssociationsView onAddPlant={() => setShowAddModal(true)} />
            : <RotationDashboard />
          }
        </>
      )}

      {activeTab === 'jardin3d' && (
        <div style={{ margin: '0 -16px', height: 'calc(100vh - 220px)' }}>
          <GardenEditor />
        </div>
      )}

      {showAddModal && (
        <AddPlantModal
          onAdd={addPlant}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showTemplatePicker && (
        <TemplatePicker onClose={() => setShowTemplatePicker(false)} />
      )}

      {detailSheet && (
        <PlantDetailSheet
          plant={detailSheet.plant}
          initialTab={detailSheet.tab}
          onClose={() => setDetailSheet(null)}
          onReplant={() => { setDetailSheet(null); setShowAddModal(true) }}
        />
      )}
    </div>
  )
}
