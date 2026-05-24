import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import PlantCard from '../components/PlantCard'
import AddPlantModal from '../components/AddPlantModal'
import ArrosageCalendar from '../components/ArrosageCalendar'
import AssociationsView from '../components/AssociationsView'
import JardinVisuel from '../components/JardinVisuel'
import PlantDetailSheet from '../components/PlantDetailSheet'
import { STATUT_LABELS } from '../data/plants'
import { ASSOCIATIONS } from '../data/associations'

export default function MonJardin() {
  const { profile, addPlant, removePlant, updatePlantStatus } = useProfile()
  const [showAddModal, setShowAddModal]     = useState(false)
  const [showVisuel, setShowVisuel]         = useState(false)
  const [activeTab, setActiveTab]           = useState('plantes') // 'plantes' | 'arrosage' | 'associations'
  const [detailSheet, setDetailSheet]       = useState(null) // { plant, tab }

  const plants = profile.plants ?? []

  // Détecte si des conflits d'associations existent dans le jardin actuel
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
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-fraunces text-2xl" style={{ color: '#3B6D11' }}>Mon Jardin</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7A5C' }}>
            {plants.length === 0
              ? 'Aucune plante pour le moment'
              : `${plants.length} plante${plants.length > 1 ? 's' : ''} en cours`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton vue visuelle */}
          {plants.length > 0 && (
            <button
              onClick={() => setShowVisuel(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-chip text-sm font-medium"
              style={{ background: '#0D1A07', color: '#97C459', border: '1px solid #3B6D11' }}
            >
              ✨ Visuel
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-chip font-semibold text-sm"
            style={{ background: '#3B6D11', color: 'white' }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* Barre de progression globale */}
      {plants.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#6B7A5C' }}>
            <span>Progression globale</span>
            <span className="font-semibold" style={{ color: '#3B6D11' }}>{progressScore}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#DDE8CC' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressScore}%`, background: '#97C459' }}
            />
          </div>
        </div>
      )}

      {/* Onglets Plantes / Arrosage / Associations */}
      {plants.length > 0 && (
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: '#EAF3DE' }}>
          {[
            { id: 'plantes',      label: '🌱 Plantes' },
            { id: 'arrosage',     label: '💧 Arrosage' },
            { id: 'associations', label: hasConflits ? '⚠️ Voisines' : '🤝 Voisines' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                color:      activeTab === tab.id ? '#3B6D11' : '#6B7A5C',
                boxShadow:  activeTab === tab.id ? '0 1px 4px rgba(59,109,17,0.15)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* État vide */}
      {plants.length === 0 && (
        <div
          className="mt-8 flex flex-col items-center text-center py-12 px-6 rounded-card"
          style={{ background: '#EAF3DE', border: '2px dashed #97C459' }}
        >
          <span className="text-5xl mb-4">🌱</span>
          <p className="font-fraunces text-lg mb-1" style={{ color: '#3B6D11' }}>
            Votre jardin est vide
          </p>
          <p className="text-sm mb-5" style={{ color: '#6B7A5C' }}>
            Ajoutez vos premières plantes pour commencer à suivre votre potager.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-card font-semibold text-sm"
            style={{ background: '#3B6D11', color: 'white' }}
          >
            Ajouter ma première plante
          </button>
        </div>
      )}

      {/* Onglet Mes plantes */}
      {plants.length > 0 && activeTab === 'plantes' && (
        <div className="grid grid-cols-2 gap-3">
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onOpenDetail={(p, tab) => setDetailSheet({ plant: p, tab })}
            />
          ))}
        </div>
      )}

      {/* Onglet Arrosage */}
      {plants.length > 0 && activeTab === 'arrosage' && (
        <ArrosageCalendar />
      )}

      {/* Onglet Associations */}
      {plants.length > 0 && activeTab === 'associations' && (
        <AssociationsView />
      )}

      {/* Modal ajout */}
      {showAddModal && (
        <AddPlantModal
          onAdd={addPlant}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Fiche détail plante */}
      {detailSheet && (
        <PlantDetailSheet
          plant={detailSheet.plant}
          initialTab={detailSheet.tab}
          onClose={() => setDetailSheet(null)}
          onReplant={() => { setDetailSheet(null); setShowAddModal(true) }}
        />
      )}

      {/* Vue Jardin Visuel */}
      {showVisuel && (
        <JardinVisuel
          onClose={() => setShowVisuel(false)}
          onGoToAssociations={() => { setShowVisuel(false); setActiveTab('associations') }}
        />
      )}
    </div>
  )
}
