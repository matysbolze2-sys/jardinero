import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import PlantCard from '../components/PlantCard'
import AddPlantModal from '../components/AddPlantModal'
import ArrosageCalendar from '../components/ArrosageCalendar'
import AssociationsView from '../components/AssociationsView'
import GardenEditor from '../components/GardenEditor'
import PlantDetailSheet from '../components/PlantDetailSheet'
import { STATUT_LABELS } from '../data/plants'
import { ASSOCIATIONS } from '../data/associations'

export default function MonJardin() {
  const { profile, addPlant } = useProfile()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab,    setActiveTab]    = useState('plantes')
  const [detailSheet,  setDetailSheet]  = useState(null)

  const plants = profile.plants ?? []

  const hasConflits = plants.some(p => {
    if (!p.plantId || !ASSOCIATIONS[p.plantId]) return false
    return ASSOCIATIONS[p.plantId].mauvaises.some(m =>
      plants.some(other => other.name.toLowerCase().trim() === m.plante.toLowerCase().trim())
    )
  })

  const progressScore = plants.length === 0 ? 0 : Math.round(
    plants.reduce((sum, p) => {
      const keys = Object.keys(STATUT_LABELS)
      return sum + keys.indexOf(p.status)
    }, 0) / (plants.length * (Object.keys(STATUT_LABELS).length - 1)) * 100
  )

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
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-chip font-semibold text-sm tap-scale"
          style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
        >
          + Ajouter
        </button>
      </div>

      {plants.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
            <span>Progression globale</span>
            <span className="font-semibold" style={{ color: 'var(--jd-accent)' }}>{progressScore}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--jd-accent-soft)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressScore}%`, background: 'var(--jd-accent)' }}
            />
          </div>
        </div>
      )}

      {plants.length > 0 && (
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'var(--jd-surface)' }}>
          {[
            { id: 'plantes',      label: '🌱 Plantes' },
            { id: 'arrosage',     label: '💧 Arrosage' },
            { id: 'associations', label: hasConflits ? '⚠️ Voisines' : '🤝 Voisines' },
            { id: 'jardin3d',     label: '🌿 Jardin 3D' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
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
            Votre jardin est vide
          </p>
          <p className="text-sm mb-5" style={{ color: 'var(--jd-ink-muted)' }}>
            Ajoutez vos premières plantes pour commencer à suivre votre potager.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-card font-semibold text-sm tap-scale"
            style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
          >
            Ajouter ma première plante
          </button>
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

      {plants.length > 0 && activeTab === 'associations' && <AssociationsView />}

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
