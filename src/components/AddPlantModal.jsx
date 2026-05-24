import { useState } from 'react'
import { CATEGORIES, PLANTS_BY_CATEGORY } from '../data/plantsExtended'
import { PLANT_DURATIONS, calculatePlantDates, formatDateFRShort } from '../data/plantDurations'

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

  // Dates estimées calculées en direct
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
      style={{ background: 'rgba(26,32,16,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-in w-full max-w-[768px] mx-auto rounded-t-[28px] flex flex-col"
        style={{ background: '#FAF8F3', maxHeight: '90dvh', boxShadow: '0 -4px 28px rgba(0,0,0,0.2)' }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-semibold tap-scale"
                style={{ color: '#6B7A5C' }}
              >
                ←
              </button>
            )}
            <h2 className="font-fraunces text-xl font-bold" style={{ color: '#3B6D11' }}>
              {step === 1 && 'Quelle catégorie ?'}
              {step === 2 && `${cat?.emoji} ${cat?.label}`}
              {step === 3 && (selectedPlant ? selectedPlant.label : 'Plante personnalisée')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold tap-scale"
            style={{ background: '#EAF3DE', color: '#3B6D11', fontSize: 18 }}
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
              style={{ background: s <= step ? '#97C459' : '#DDE8CC' }}
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
                  style={{ background: 'white', border: '2px solid #DDE8CC' }}
                >
                  <span
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: '#EAF3DE' }}
                  >
                    {cat.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: '#1A2010' }}>{cat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>
                      {PLANTS_BY_CATEGORY[cat.id]?.length ?? 0} plantes disponibles
                    </p>
                  </div>
                  <span style={{ color: '#DDE8CC', fontSize: 20 }}>›</span>
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
                    style={{ background: 'white', border: '2px solid #DDE8CC' }}
                  >
                    <span style={{ fontSize: 36, lineHeight: 1 }}>{plant.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: '#1A2010' }}>{plant.label}</span>
                    {dur && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-chip font-medium"
                        style={{ background: '#EAF3DE', color: '#3B6D11' }}
                      >
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
                style={{ background: '#FAF8F3', border: '2px dashed #DDE8CC' }}
              >
                <span style={{ fontSize: 28 }}>✏️</span>
                <span className="text-sm font-medium" style={{ color: '#6B7A5C' }}>Autre (nom libre)</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 3 : Date + variété ── */}
        {step === 3 && (
          <>
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              {/* Plante choisie ou champ libre */}
              {selectedPlant ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-card mb-4"
                  style={{ background: '#EAF3DE', border: '2px solid #97C459' }}
                >
                  <span style={{ fontSize: 32 }}>{selectedPlant.emoji}</span>
                  <span className="font-semibold" style={{ color: '#3B6D11' }}>{selectedPlant.label}</span>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6B7A5C' }}>
                    Nom de la plante *
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="ex: Basilic pourpre, Cactus…"
                    className="w-full px-4 py-3 rounded-card text-sm outline-none"
                    style={{ border: '2px solid #DDE8CC', background: 'white', color: '#1A2010' }}
                    onFocus={e => (e.target.style.borderColor = '#97C459')}
                    onBlur={e => (e.target.style.borderColor = '#DDE8CC')}
                  />
                </div>
              )}

              {/* Date de plantation */}
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6B7A5C' }}>
                Date de plantation
              </label>
              <input
                type="date"
                value={plantedAt}
                onChange={e => setPlantedAt(e.target.value)}
                max={getToday()}
                className="w-full px-4 py-3 rounded-card text-sm outline-none mb-4"
                style={{ border: '2px solid #DDE8CC', background: 'white', color: '#1A2010' }}
                onFocus={e => (e.target.style.borderColor = '#97C459')}
                onBlur={e => (e.target.style.borderColor = '#DDE8CC')}
              />

              {/* Dates estimées */}
              {estimatedDates?.estimatedHarvestStart && (
                <div className="rounded-xl p-3 mb-4 flex gap-3" style={{ background: '#EAF3DE', border: '1px solid #DDE8CC' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>📅</span>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#3B6D11' }}>Récolte estimée</p>
                    <p className="text-sm" style={{ color: '#1A2010' }}>
                      {formatDateFRShort(estimatedDates.estimatedHarvestStart)}
                      {' → '}
                      {formatDateFRShort(estimatedDates.estimatedHarvestEnd)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>
                      Estimation basée sur la région et la saison
                    </p>
                  </div>
                </div>
              )}

              {/* Variété optionnelle */}
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6B7A5C' }}>
                Variété (optionnel)
              </label>
              <input
                type="text"
                value={variety}
                onChange={e => setVariety(e.target.value)}
                placeholder="ex: Cherry Roma, Ratte…"
                className="w-full px-4 py-3 rounded-card text-sm outline-none"
                style={{ border: '2px solid #DDE8CC', background: 'white', color: '#1A2010' }}
                onFocus={e => (e.target.style.borderColor = '#97C459')}
                onBlur={e => (e.target.style.borderColor = '#DDE8CC')}
              />
            </div>

            {/* Bouton fixe en bas */}
            <div className="px-4 pt-3 flex-shrink-0" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
              <button
                onClick={handleAdd}
                disabled={!canConfirm}
                className="w-full py-4 rounded-card font-bold text-sm tap-scale transition-all"
                style={{
                  background: canConfirm ? '#3B6D11' : '#DDE8CC',
                  color:      canConfirm ? 'white'   : '#6B7A5C',
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
