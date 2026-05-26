import { useState } from 'react'
import { CATEGORIES, PLANTS_BY_CATEGORY } from '../data/plantsExtended'
import { PLANT_DURATIONS, calculatePlantDates, formatDateFRShort } from '../data/plantDurations'
import EmojiIllo from './EmojiIllo'

function getToday() {
  return new Date().toISOString().split('T')[0]
}

// Modal d'ajout en 3 étapes : catégorie → plante → date + variété
export default function AddPlantModal({ onAdd, onClose }) {
  const [step, setStep]                   = useState(1)
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

  const handleAdd = () => {
    const name  = selectedPlant ? selectedPlant.label : customName.trim()
    const emoji = selectedPlant ? selectedPlant.emoji  : (cat?.defaultEmoji ?? '🌿')
    if (!name) return
    onAdd({
      id:        crypto.randomUUID(),
      name,
      emoji,
      plantId:   selectedPlant?.id ?? null,
      plantedAt,
      status:    'sowed',
      variety:   variety.trim() || null,
    })
    onClose()
  }

  const canConfirm = selectedPlant || customName.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col justify-end"
      style={{ background: 'rgba(13,20,15,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-in w-full max-w-[768px] mx-auto rounded-t-[28px] flex flex-col"
        style={{ background: 'var(--jd-surface)', maxHeight: '90dvh', boxShadow: '0 -4px 28px rgba(0,0,0,0.5)' }}
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
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
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
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
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
              {/* Option "Autre" */}
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
            <div className="flex-1 overflow-y-auto px-4 pb-2">
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
              <button
                onClick={handleAdd}
                disabled={!canConfirm}
                className="w-full py-4 rounded-card font-bold text-sm tap-scale transition-all"
                style={{
                  background: canConfirm ? 'var(--jd-accent)' : 'var(--jd-accent-soft)',
                  color:      canConfirm ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
                  cursor:     canConfirm ? 'pointer' : 'not-allowed',
                }}
              >
                Ajouter au jardin 🌱
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
