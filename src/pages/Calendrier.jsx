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

function SowSheet({ plant, monthIdx, onClose, onAdd }) {
  const moisLabel = MOIS_LABELS[monthIdx]
  const assocs    = ASSOCIATIONS[plant.id]?.bonnes?.slice(0, 3) ?? []

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in w-full max-w-[768px] mx-auto flex flex-col"
        style={{
          background:   'var(--jd-surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight:    '80vh',
          boxShadow:    '0 -4px 28px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--jd-accent-ring)' }} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-3" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontSize: 52, lineHeight: 1 }}>{plant.emoji}</span>
            <div>
              <h2 className="font-display font-bold text-xl" style={{ color: 'var(--jd-ink)' }}>
                {plant.label}
              </h2>
              <span className="jd-chip mt-1 inline-block">
                🌱 Semis — {moisLabel}
              </span>
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>☀️</span>
            <p className="text-sm" style={{ color: 'var(--jd-ink)' }}>
              C'est le bon moment pour semer{' '}
              <strong style={{ color: 'var(--jd-accent)' }}>{plant.label}</strong> — {moisLabel} est idéal pour cette variété dans ta région.
            </p>
          </div>

          {assocs.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
                BONNES ASSOCIATIONS
              </p>
              <div className="flex flex-col gap-2">
                {assocs.map(a => (
                  <div
                    key={a.plante}
                    className="flex items-start gap-3 px-3 py-2 rounded-xl"
                    style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{a.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>{a.plante}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>{a.raison}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { onAdd(plant); onClose() }}
            className="w-full py-4 rounded-card font-bold text-sm tap-scale"
            style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
          >
            Ajouter {plant.label} à mon jardin →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Calendrier({ onNavigate }) {
  const { profile, addPlant } = useProfile()
  const [filterType, setFilterType] = useState(null)
  const [sowSheet, setSowSheet]     = useState(null)

  const region       = getRegionById(profile.region)
  const offsetWeeks  = region?.offset ?? 0
  const currentMonth = new Date().getMonth()
  const filterValue  = filterType === 'semer' ? 1 : filterType === 'recolter' ? 3 : null

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
      <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--jd-accent)' }}>
        Calendrier
      </h1>
      <p className="text-sm mt-1" style={{ color: 'var(--jd-ink-muted)' }}>
        {region ? region.label : 'Région non définie'} — {MOIS_LABELS[currentMonth]}
      </p>

      {offsetWeeks !== 0 && (
        <div
          className="jd-chip inline-flex mt-2"
        >
          🗺️ Décalage régional :{' '}
          {offsetWeeks > 0 ? `+${offsetWeeks}` : offsetWeeks} semaines
        </div>
      )}

      <div className="flex gap-2 mt-4 mb-5 overflow-x-auto pb-1 hide-scrollbar">
        {FILTRES.map(f => (
          <button
            key={String(f.id)}
            onClick={() => setFilterType(f.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-chip text-sm font-medium transition-all tap-scale"
            style={
              filterType === f.id
                ? { background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)', border: '1px solid transparent' }
                : { background: 'var(--jd-surface)', color: 'var(--jd-ink-muted)', border: '1px solid var(--jd-border)' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <CalendarTable
        offsetWeeks={offsetWeeks}
        filterMonth={filterType ? currentMonth : null}
        filterValue={filterValue}
        onSowClick={(plant, mi) => setSowSheet({ plant, monthIdx: mi })}
      />

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
