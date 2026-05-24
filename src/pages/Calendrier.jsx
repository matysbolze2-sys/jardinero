import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { MOIS_LABELS } from '../data/plants'
import CalendarTable from '../components/CalendarTable'
import { ASSOCIATIONS } from '../data/associations'

const FILTRES = [
  { id: null,       label: 'Tous' },
  { id: 'semer',    label: '🌱 À semer' },
  { id: 'recolter', label: '🧺 À récolter' },
]

// ─── Bottom sheet "Semer" ─────────────────────────────────────────────────────

function SowSheet({ plant, monthIdx, onClose, onAdd }) {
  const moisLabel = MOIS_LABELS[monthIdx]
  const assocs    = ASSOCIATIONS[plant.id]?.bonnes?.slice(0, 3) ?? []

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in w-full max-w-[768px] mx-auto flex flex-col"
        style={{
          background: '#FAF8F3',
          borderRadius: '20px 20px 0 0',
          maxHeight: '80vh',
          boxShadow: '0 -4px 28px rgba(0,0,0,0.2)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#DDE8CC' }} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-3" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {/* Header plante */}
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontSize: 52, lineHeight: 1 }}>{plant.emoji}</span>
            <div>
              <h2 className="font-fraunces text-xl font-bold" style={{ color: '#1A2010' }}>
                {plant.label}
              </h2>
              <span
                className="inline-block text-xs px-2.5 py-1 rounded-chip font-semibold mt-1"
                style={{ background: '#C0DD97', color: '#27500A' }}
              >
                🌱 Semis — {moisLabel}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: '#EAF3DE', border: '1px solid #DDE8CC' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>☀️</span>
            <p className="text-sm" style={{ color: '#1A2010' }}>
              C'est le bon moment pour semer{' '}
              <strong>{plant.label}</strong> — {moisLabel} est idéal pour cette variété dans ta région.
            </p>
          </div>

          {/* Associations */}
          {assocs.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold mb-2" style={{ color: '#6B7A5C' }}>
                BONNES ASSOCIATIONS
              </p>
              <div className="flex flex-col gap-2">
                {assocs.map(a => (
                  <div
                    key={a.plante}
                    className="flex items-start gap-3 px-3 py-2 rounded-xl"
                    style={{ background: 'white', border: '1px solid #DDE8CC' }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{a.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1A2010' }}>{a.plante}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>{a.raison}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => { onAdd(plant); onClose() }}
            className="w-full py-4 rounded-card font-bold text-sm tap-scale"
            style={{ background: '#3B6D11', color: 'white' }}
          >
            Ajouter {plant.label} à mon jardin →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page Calendrier ──────────────────────────────────────────────────────────

export default function Calendrier({ onNavigate }) {
  const { profile, addPlant } = useProfile()
  const [filterType, setFilterType] = useState(null)
  const [sowSheet, setSowSheet]     = useState(null) // { plant, monthIdx }

  const region       = getRegionById(profile.region)
  const offsetWeeks  = region?.offset ?? 0
  const currentMonth = new Date().getMonth()

  const filterValue = filterType === 'semer' ? 1 : filterType === 'recolter' ? 3 : null

  const handleSowClick = (plant, monthIdx) => {
    setSowSheet({ plant, monthIdx })
  }

  const handleAddFromCalendar = (plant) => {
    addPlant({
      id:        crypto.randomUUID(),
      name:      plant.label,
      emoji:     plant.emoji,
      plantId:   plant.id,
      plantedAt: new Date().toISOString().split('T')[0],
      status:    'sowed',
      variety:   null,
    })
    onNavigate?.('mon-jardin')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="font-fraunces text-2xl" style={{ color: '#3B6D11' }}>
        Calendrier
      </h1>
      <p className="text-sm mt-1" style={{ color: '#6B7A5C' }}>
        {region ? region.label : 'Région non définie'} — {MOIS_LABELS[currentMonth]}
      </p>

      {offsetWeeks !== 0 && (
        <div
          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-chip text-xs font-medium"
          style={{ background: '#EAF3DE', color: '#3B6D11', border: '1px solid #97C459' }}
        >
          🗺️ Décalage régional :{' '}
          {offsetWeeks > 0 ? `+${offsetWeeks}` : offsetWeeks} semaines
        </div>
      )}

      {/* Filtres rapides */}
      <div className="flex gap-2 mt-4 mb-5 overflow-x-auto pb-1 hide-scrollbar">
        {FILTRES.map(f => (
          <button
            key={String(f.id)}
            onClick={() => setFilterType(f.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-chip text-sm font-medium transition-all tap-scale"
            style={{
              background: filterType === f.id ? '#3B6D11' : 'white',
              color:      filterType === f.id ? 'white'   : '#6B7A5C',
              border:     filterType === f.id ? '2px solid #3B6D11' : '2px solid #DDE8CC',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <CalendarTable
        offsetWeeks={offsetWeeks}
        filterMonth={filterType ? currentMonth : null}
        filterValue={filterValue}
        onSowClick={handleSowClick}
      />

      {/* Sheet "semer" */}
      {sowSheet && (
        <SowSheet
          plant={sowSheet.plant}
          monthIdx={sowSheet.monthIdx}
          onClose={() => setSowSheet(null)}
          onAdd={handleAddFromCalendar}
        />
      )}
    </div>
  )
}
