import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { STATUT_LABELS } from '../data/plants'
import { getSymptomsForPlant, getUrgenceConfig } from '../data/diagnostics'
import HarvestCelebration from './HarvestCelebration'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateFR(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const s = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Onglet Infos ─────────────────────────────────────────────────────────────

function TabInfos({ plant, onClose, onHarvest }) {
  const { updatePlantStatus, removePlant } = useProfile()
  const statutKeys   = Object.keys(STATUT_LABELS)
  const currentIndex = statutKeys.indexOf(plant.status)

  const daysSincePlanted = plant.plantedAt
    ? Math.floor((Date.now() - new Date(plant.plantedAt)) / 86400000)
    : null

  function handleDelete() {
    if (window.confirm(`Supprimer ${plant.name} du jardin ?`)) {
      removePlant(plant.id)
      onClose()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progression */}
      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: '#6B7A5C' }}>
          STADE DE CROISSANCE
        </p>
        <div className="flex flex-col gap-2">
          {statutKeys.map((key, i) => {
            const s         = STATUT_LABELS[key]
            const isActive  = key === plant.status
            const isPast    = i < currentIndex
            const canSelect = i === currentIndex + 1 // seulement l'étape suivante
            return (
              <button
                key={key}
                disabled={!canSelect && !isActive}
                onClick={() => canSelect && updatePlantStatus(plant.id, key)}
                className="flex items-center gap-3 w-full rounded-xl px-4 py-3 transition-all text-left"
                style={{
                  background: isActive
                    ? s.color + '18'
                    : canSelect
                    ? '#F8FFF4'
                    : 'transparent',
                  border: isActive
                    ? `2px solid ${s.color}`
                    : canSelect
                    ? '2px dashed #DDE8CC'
                    : '2px solid transparent',
                  opacity: !isActive && !isPast && !canSelect ? 0.35 : 1,
                  cursor: canSelect ? 'pointer' : 'default',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: isActive ? s.color : isPast ? '#97C459' : '#DDE8CC',
                    color: 'white',
                  }}
                >
                  {isPast ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: isActive ? s.color : '#1A2010' }}>
                    {s.label}
                  </p>
                  {canSelect && (
                    <p className="text-xs" style={{ color: '#97C459' }}>Toucher pour passer à cette étape</p>
                  )}
                </div>
                {isActive && <span className="text-xs font-bold" style={{ color: s.color }}>● Actuel</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Méta */}
      {(daysSincePlanted !== null || plant.variety) && (
        <div className="flex gap-3">
          {daysSincePlanted !== null && (
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#EAF3DE' }}>
              <p className="text-xs" style={{ color: '#6B7A5C' }}>Dans le jardin</p>
              <p className="text-lg font-bold" style={{ color: '#3B6D11' }}>J+{daysSincePlanted}</p>
            </div>
          )}
          {plant.variety && (
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#EAF3DE' }}>
              <p className="text-xs" style={{ color: '#6B7A5C' }}>Variété</p>
              <p className="text-sm font-bold" style={{ color: '#3B6D11' }}>{plant.variety}</p>
            </div>
          )}
        </div>
      )}

      {/* Récolter — visible uniquement quand le plant est prêt */}
      {plant.status === 'ready' && (
        <button
          onClick={onHarvest}
          className="w-full py-3 rounded-xl text-sm font-bold tap-scale"
          style={{ background: '#97C459', color: 'white' }}
        >
          🧺 Récolter maintenant
        </button>
      )}

      {/* Supprimer */}
      <button
        onClick={handleDelete}
        className="w-full py-3 rounded-xl text-sm font-semibold tap-scale"
        style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}
      >
        🗑 Supprimer du jardin
      </button>
    </div>
  )
}

// ─── Onglet Journal ───────────────────────────────────────────────────────────

function TabJournal({ plant }) {
  const { profile, addJournalNote, deleteJournalNote } = useProfile()
  const notes = profile.journal?.[plant.id] ?? []
  const [texte, setTexte] = useState('')
  const [confirming, setConfirming] = useState(null)

  function handleAdd() {
    const trimmed = texte.trim()
    if (!trimmed) return
    addJournalNote(plant.id, trimmed)
    setTexte('')
  }

  function handleDelete(noteId) {
    if (confirming === noteId) {
      deleteJournalNote(plant.id, noteId)
      setConfirming(null)
    } else {
      setConfirming(noteId)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card p-3" style={{ background: '#F8FFF4', border: '1px solid #DDE8CC' }}>
        <textarea
          value={texte}
          onChange={e => setTexte(e.target.value.slice(0, 500))}
          placeholder="Observer, mesurer, traiter… notez tout ici"
          className="w-full text-sm resize-none outline-none bg-transparent"
          style={{ color: '#1A2010', minHeight: 80 }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: texte.length > 450 ? '#E05A3A' : '#6B7A5C' }}>
            {texte.length}/500
          </span>
          <button
            onClick={handleAdd}
            disabled={!texte.trim()}
            className="px-4 py-1.5 rounded-chip text-xs font-semibold"
            style={{
              background: texte.trim() ? '#3B6D11' : '#DDE8CC',
              color: texte.trim() ? 'white' : '#6B7A5C',
            }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📓</p>
          <p className="text-sm" style={{ color: '#6B7A5C' }}>Aucune note pour l&apos;instant</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map(note => (
            <div key={note.id} className="rounded-card p-3" style={{ background: 'white', border: '1px solid #DDE8CC' }}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold" style={{ color: '#97C459' }}>
                  {formatDateFR(note.date)}
                </p>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs px-2 py-0.5 rounded-chip flex-shrink-0"
                  style={{
                    background: confirming === note.id ? '#FEE2E2' : '#F3F4F6',
                    color:      confirming === note.id ? '#B91C1C' : '#9CA3AF',
                    fontWeight: 500,
                  }}
                >
                  {confirming === note.id ? 'Confirmer ?' : '✕'}
                </button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#1A2010' }}>{note.texte}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Onglet Diagnostic ────────────────────────────────────────────────────────

function TabDiagnostic({ plant }) {
  const symptoms = getSymptomsForPlant(plant.plantId)
  const [selected, setSelected] = useState('')
  const diag     = symptoms.find(s => s.symptome === selected) ?? null
  const urgConf  = diag ? getUrgenceConfig(diag.urgence) : null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs mb-2" style={{ color: '#6B7A5C' }}>
          Quel symptôme observez-vous ?
        </p>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full rounded-card px-3 py-3 text-sm"
          style={{
            border: '1px solid #DDE8CC',
            background: 'white',
            color: selected ? '#1A2010' : '#6B7A5C',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B7A5C' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: 36,
          }}
        >
          <option value="">— Choisir un symptôme —</option>
          {symptoms.some(s => s._specific) && (
            <optgroup label={`Spécifique ${plant.name}`}>
              {symptoms.filter(s => s._specific).map(s => (
                <option key={s.symptome} value={s.symptome}>{s.symptome}</option>
              ))}
            </optgroup>
          )}
          <optgroup label="Symptômes généraux">
            {symptoms.filter(s => !s._specific).map(s => (
              <option key={s.symptome} value={s.symptome}>{s.symptome}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {diag && urgConf ? (
        <div className="rounded-card p-4 flex flex-col gap-3" style={{ background: urgConf.bg, border: `1px solid ${urgConf.badge}44` }}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm" style={{ color: '#1A2010' }}>{diag.symptome}</p>
            <span className="text-xs px-2.5 py-1 rounded-chip font-bold flex-shrink-0" style={{ background: urgConf.badge, color: 'white' }}>
              {urgConf.label}
            </span>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.65)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#C27C12' }}>🔎 Cause probable</p>
            <p className="text-sm" style={{ color: '#1A2010' }}>{diag.cause}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.65)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#3B6D11' }}>✅ Solution</p>
            <p className="text-sm leading-relaxed" style={{ color: '#1A2010' }}>{diag.solution}</p>
          </div>
        </div>
      ) : (
        !selected && (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: '#6B7A5C' }}>Sélectionnez un symptôme pour voir le diagnostic</p>
          </div>
        )
      )}
    </div>
  )
}

// ─── Sheet principale ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'infos',      label: '🌱 Infos' },
  { id: 'journal',    label: '📓 Journal' },
  { id: 'diagnostic', label: '🔍 Problème ?' },
]

export default function PlantDetailSheet({ plant, initialTab = 'infos', onClose, onReplant }) {
  const [activeTab, setActiveTab]   = useState(initialTab)
  const [showHarvest, setShowHarvest] = useState(false)
  const statut = STATUT_LABELS[plant.status] ?? STATUT_LABELS.sowed

  const handleHarvest = () => setShowHarvest(true)

  return (
    <>
    {showHarvest && (
      <HarvestCelebration
        plant={plant}
        onClose={() => { setShowHarvest(false); onClose() }}
        onReplant={() => { setShowHarvest(false); onReplant?.(); onClose() }}
      />
    )}
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          width: '100%', maxWidth: 768, margin: '0 auto',
          background: '#FAF8F3',
          borderRadius: '20px 20px 0 0',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -4px 28px rgba(0,0,0,0.2)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#DDE8CC' }} />
        </div>

        {/* Header plante */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #DDE8CC' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 38, lineHeight: 1 }}>{plant.emoji}</span>
            <div>
              <p className="font-fraunces font-bold text-base" style={{ color: '#1A2010' }}>{plant.name}</p>
              {plant.variety && <p className="text-xs" style={{ color: '#6B7A5C' }}>{plant.variety}</p>}
              <span className="text-xs px-2 py-0.5 rounded-chip font-semibold" style={{ background: statut.color + '22', color: statut.color }}>
                {statut.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: '#EAF3DE', color: '#3B6D11' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #DDE8CC' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? '#3B6D11' : 'transparent',
                color:      activeTab === tab.id ? 'white' : '#6B7A5C',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pt-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {activeTab === 'infos'      && <TabInfos plant={plant} onClose={onClose} onHarvest={handleHarvest} />}
          {activeTab === 'journal'    && <TabJournal    plant={plant} />}
          {activeTab === 'diagnostic' && <TabDiagnostic plant={plant} />}
        </div>
      </div>
    </div>
    </>
  )
}
