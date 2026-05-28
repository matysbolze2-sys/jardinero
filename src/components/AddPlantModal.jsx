import { useState } from 'react'
import { CATEGORIES, PLANTS_BY_CATEGORY } from '../data/plantsExtended'
import { PLANT_DURATIONS, calculatePlantDates, formatDateFRShort } from '../data/plantDurations'
import { ASSOCIATIONS, getConflictLevel, getBestNeighbors } from '../data/associations'
import { getRotationConflicts, respecteRotation, getFamillePlante, FAMILLES_ROTATION } from '../data/rotation'
import { useProfile } from '../hooks/useProfile'
import EmojiIllo from './EmojiIllo'

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function moisDepuis(dateStr) {
  const months = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 30))
  if (months < 1) return 'récemment'
  if (months === 1) return 'il y a 1 mois'
  return `il y a ${months} mois`
}

function CompatibilitySection({ selectedPlant, plantsOfCat, onSelectPlant }) {
  const { profile } = useProfile()
  if (!selectedPlant) return null

  const gardenPlants = profile.plants ?? []
  const historique   = profile.historique ?? []
  if (gardenPlants.length === 0 && historique.length === 0) return null

  // Conflits directs avec le jardin
  const conflitsMauvaises = (ASSOCIATIONS[selectedPlant.id]?.mauvaises ?? []).filter(m =>
    gardenPlants.some(p => (p.name ?? '').toLowerCase() === m.plante.toLowerCase())
  )

  // Synergies avec plantes existantes
  const synergies = (ASSOCIATIONS[selectedPlant.id]?.bonnes ?? []).filter(b =>
    gardenPlants.some(p => (p.name ?? '').toLowerCase() === b.plante.toLowerCase())
  )

  // Rotation
  const rotationConflicts = getRotationConflicts(selectedPlant.id, historique)
  const mostRecent = rotationConflicts.length > 0
    ? rotationConflicts.sort((a, b) => new Date(b.harvestedAt) - new Date(a.harvestedAt))[0]
    : null
  const rotationCheck = mostRecent ? respecteRotation(selectedPlant.id, mostRecent.harvestedAt) : { ok: true }
  const famille = getFamillePlante(selectedPlant.id)
  const familleInfo = famille ? FAMILLES_ROTATION[famille] : null

  // Suggestions de remplacement (même catégorie, sans conflit fort)
  const showSuggestions = conflitsMauvaises.some(m => m.intensite === 'forte') || !rotationCheck.ok
  const suggestions = showSuggestions
    ? plantsOfCat
        .filter(p => p.id !== selectedPlant.id)
        .filter(p => !gardenPlants.some(gp => gp.plantId && getConflictLevel(p.id, gp.plantId) === 'forte'))
        .slice(0, 3)
    : []

  // Rien à montrer
  if (conflitsMauvaises.length === 0 && synergies.length === 0 && rotationCheck.ok) return null

  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        Compatibilité avec ton jardin
      </p>

      {/* Cas 1 : Rotation */}
      {!rotationCheck.ok && (
        <div
          className="rounded-card p-3 mb-2"
          style={{ background: 'rgba(240,184,108,0.08)', border: '1px solid rgba(240,184,108,0.35)' }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#f0b86c' }}>
            🔄 Rotation des cultures
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
            Tu as récolté {familleInfo?.emoji ?? ''} <strong style={{ color: 'var(--jd-ink)' }}>{mostRecent.name}</strong>{' '}
            ({famille}) {moisDepuis(mostRecent.harvestedAt)}.{' '}
            Attends encore{' '}
            <strong style={{ color: '#f0b86c' }}>{rotationCheck.moisRestants} mois</strong>{' '}
            avant de replanter cette famille.
          </p>
        </div>
      )}

      {/* Cas 2 : Conflits */}
      {conflitsMauvaises.length > 0 && (
        <div
          className="rounded-card p-3 mb-2"
          style={{ background: 'rgba(224,90,58,0.06)', border: '1px solid rgba(224,90,58,0.35)' }}
        >
          <p className="text-sm font-semibold mb-1.5" style={{ color: '#E05A3A' }}>
            ⚠️ Attention aux voisines
          </p>
          {conflitsMauvaises.map((m, i) => {
            const gp = gardenPlants.find(p => (p.name ?? '').toLowerCase() === m.plante.toLowerCase())
            return (
              <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                <span style={{ fontSize: 16, flexShrink: 0 }}>{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color: 'var(--jd-ink)' }}>
                      Tu as {gp?.name ?? m.plante}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-chip font-bold flex-shrink-0"
                      style={{
                        background: m.intensite === 'forte' ? 'rgba(224,90,58,0.15)' : 'rgba(240,184,108,0.15)',
                        color:      m.intensite === 'forte' ? '#E05A3A' : '#f0b86c',
                        fontSize: 9,
                      }}
                    >
                      {m.intensite === 'forte' ? 'FORT' : m.intensite === 'moderee' ? 'MODÉRÉ' : 'FAIBLE'}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>{m.raison}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cas 3 : Synergies */}
      {conflitsMauvaises.length === 0 && synergies.length > 0 && (
        <div
          className="rounded-card p-3 mb-2"
          style={{ background: 'rgba(166,227,107,0.06)', border: '1px solid rgba(166,227,107,0.3)' }}
        >
          <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--jd-accent)' }}>
            ✅ Bonnes nouvelles
          </p>
          {synergies.slice(0, 2).map((b, i) => {
            const gp = gardenPlants.find(p => (p.name ?? '').toLowerCase() === b.plante.toLowerCase())
            return (
              <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                <span style={{ fontSize: 16, flexShrink: 0 }}>{b.emoji}</span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
                  <strong style={{ color: 'var(--jd-ink)' }}>{gp?.name ?? b.plante}</strong>{' '}
                  {b.raison.charAt(0).toLowerCase() + b.raison.slice(1)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Suggestions de remplacement */}
      {suggestions.length > 0 && (
        <div className="rounded-card p-3" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
            💡 À la place, tu pourrais planter :
          </p>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPlant(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill tap-scale text-xs font-semibold"
                style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', border: '1px solid var(--jd-accent-ring)' }}
              >
                <span>{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AddPlantModal({ onAdd, onClose }) {
  const [step, setStep]                   = useState(1)
  const [submitting, setSubmitting]       = useState(false)
  const [addError, setAddError]           = useState(null)
  const [selectedCat, setSelectedCat]     = useState(null)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [customName, setCustomName]       = useState('')
  const [variety, setVariety]             = useState('')
  const [plantedAt, setPlantedAt]         = useState(getToday())

  const cat         = CATEGORIES.find(c => c.id === selectedCat)
  const plantsOfCat = selectedCat ? PLANTS_BY_CATEGORY[selectedCat] ?? [] : []

  const estimatedDates = selectedPlant
    ? calculatePlantDates(selectedPlant.id, plantedAt)
    : null

  const handleSelectCat = (catId) => {
    setSelectedCat(catId)
    setSelectedPlant(null)
    setCustomName('')
    setStep(2)
  }

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant)
    setCustomName('')
    setStep(3)
  }

  const handleSelectAutre = () => {
    setSelectedPlant(null)
    setStep(3)
  }

  const handleAdd = async () => {
    const name  = selectedPlant ? selectedPlant.label : customName.trim()
    const emoji = selectedPlant ? selectedPlant.emoji  : (cat?.defaultEmoji ?? '🌿')
    if (!name) return
    setSubmitting(true)
    setAddError(null)
    const result = await onAdd({
      id:        crypto.randomUUID(),
      name,
      emoji,
      plantId:   selectedPlant?.id ?? null,
      plantedAt,
      status:    'sowed',
      variety:   variety.trim() || null,
    })
    setSubmitting(false)
    if (result?.error) {
      setAddError(result.error)
      return
    }
    onClose()
  }

  const canConfirm = selectedPlant || customName.trim().length > 0

  return (
    <div
      className="modal-overlay"
      style={{ background: 'rgba(13,20,15,0.85)' }}
    >
      <div className="modal-spacer" onClick={onClose} />
      <div
        className="modal-card fade-in"
        style={{ background: 'var(--jd-surface)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-semibold tap-scale"
                style={{ color: 'var(--jd-ink-muted)' }}
              >
                ←
              </button>
            )}
            <h2 className="font-display font-bold text-xl" style={{ color: 'var(--jd-accent)' }}>
              {step === 1 && 'Quelle catégorie ?'}
              {step === 2 && `${cat?.emoji} ${cat?.label}`}
              {step === 3 && (selectedPlant ? selectedPlant.label : 'Plante personnalisée')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold tap-scale"
            style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-accent)', fontSize: 18 }}
          >
            ✕
          </button>
        </div>

        {/* Barre de progression */}
        <div className="flex gap-1.5 px-5 mb-3 flex-shrink-0">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? 'var(--jd-accent)' : 'var(--jd-accent-soft)' }}
            />
          ))}
        </div>

        {/* ── Étape 1 : Catégorie ── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))', minHeight: 0 }}>
            <div className="flex flex-col gap-2 pb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCat(cat.id)}
                  className="flex items-center gap-4 px-4 py-4 rounded-card text-left tap-scale"
                  style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}
                >
                  <span
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'var(--jd-accent-soft)' }}
                  >
                    {cat.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>{cat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>
                      {PLANTS_BY_CATEGORY[cat.id]?.length ?? 0} plantes disponibles
                    </p>
                  </div>
                  <span style={{ color: 'var(--jd-ink-muted)', fontSize: 20 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Étape 2 : Plante ── */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))', minHeight: 0 }}>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {plantsOfCat.map(plant => {
                const dur = PLANT_DURATIONS[plant.id]
                return (
                  <button
                    key={plant.id}
                    onClick={() => handleSelectPlant(plant)}
                    className="flex flex-col items-center gap-2 px-3 py-4 rounded-card text-center tap-scale transition-all"
                    style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}
                  >
                    <span style={{ fontSize: 36, lineHeight: 1 }}>{plant.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>{plant.label}</span>
                    {dur && (
                      <span className="jd-chip">
                        ~{dur.daysToHarvest} jours
                      </span>
                    )}
                  </button>
                )
              })}
              <button
                onClick={handleSelectAutre}
                className="flex flex-col items-center gap-2 px-3 py-4 rounded-card text-center tap-scale col-span-2"
                style={{ background: 'var(--jd-bg)', border: '2px dashed var(--jd-border)' }}
              >
                <span style={{ fontSize: 28 }}>✏️</span>
                <span className="text-sm font-medium" style={{ color: 'var(--jd-ink-muted)' }}>Autre (nom libre)</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 3 : Date + variété ── */}
        {step === 3 && (
          <>
            <div className="flex-1 overflow-y-auto px-4 pb-2" style={{ minHeight: 0 }}>
              {selectedPlant ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-card mb-4"
                  style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-accent-ring)' }}
                >
                  <EmojiIllo emoji={selectedPlant.emoji} size={52} />
                  <span className="font-semibold" style={{ color: 'var(--jd-accent)' }}>{selectedPlant.label}</span>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
                    Nom de la plante *
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="ex: Basilic pourpre, Cactus…"
                    className="w-full px-4 py-3 rounded-card text-sm outline-none"
                    style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-alt)', color: 'var(--jd-ink)' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--jd-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--jd-border)')}
                  />
                </div>
              )}

              {/* Date de plantation */}
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
                Date de plantation
              </label>
              <input
                type="date"
                value={plantedAt}
                onChange={e => setPlantedAt(e.target.value)}
                max={getToday()}
                className="w-full px-4 py-3 rounded-card text-sm outline-none mb-4"
                style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-alt)', color: 'var(--jd-ink)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--jd-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--jd-border)')}
              />

              {/* Dates estimées */}
              {estimatedDates?.estimatedHarvestStart && (
                <div className="rounded-xl p-3 mb-4 flex gap-3" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>📅</span>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--jd-accent)' }}>Récolte estimée</p>
                    <p className="text-sm" style={{ color: 'var(--jd-ink)' }}>
                      {formatDateFRShort(estimatedDates.estimatedHarvestStart)}
                      {' → '}
                      {formatDateFRShort(estimatedDates.estimatedHarvestEnd)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>
                      Estimation basée sur la région et la saison
                    </p>
                  </div>
                </div>
              )}

              {/* Section compatibilité */}
              <CompatibilitySection
                selectedPlant={selectedPlant}
                plantsOfCat={plantsOfCat}
                onSelectPlant={handleSelectPlant}
              />

              {/* Variété optionnelle */}
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--jd-ink-muted)' }}>
                Variété (optionnel)
              </label>
              <input
                type="text"
                value={variety}
                onChange={e => setVariety(e.target.value)}
                placeholder="ex: Cherry Roma, Ratte…"
                className="w-full px-4 py-3 rounded-card text-sm outline-none"
                style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-alt)', color: 'var(--jd-ink)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--jd-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--jd-border)')}
              />
            </div>

            {/* Bouton fixe en bas */}
            <div className="px-4 pt-3 flex-shrink-0" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
              {addError && (
                <div className="mb-3 px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)', color: '#E05A3A' }}>
                  Erreur : {addError}
                </div>
              )}
              <button
                onClick={handleAdd}
                disabled={!canConfirm || submitting}
                className="w-full py-4 rounded-card font-bold text-sm tap-scale transition-all"
                style={{
                  background: canConfirm && !submitting ? 'var(--jd-accent)' : 'var(--jd-accent-soft)',
                  color:      canConfirm && !submitting ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
                  cursor:     canConfirm && !submitting ? 'pointer' : 'not-allowed',
                }}
              >
                {submitting ? 'Ajout en cours…' : 'Ajouter au jardin 🌱'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
