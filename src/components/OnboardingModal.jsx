import { useState } from 'react'
import { REGIONS } from '../data/regions'
import { SOILS } from '../data/soils'
import { useSoilData } from '../hooks/useSoilData'

const REGION_EMOJI = {
  'nord': '❄️', 'idf': '🏙️', 'grand-est': '🌲', 'bretagne': '🌊',
  'loire': '🌿', 'rhone-alpes': '⛰️', 'montagne': '🏔️',
  'sud-ouest': '🍷', 'mediterranee': '☀️',
}

const MOIS_FR    = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const VEG_EMOJIS = ['🥕','🍅','🥦','🌽','🥒','🧅','🫑','🥬','🫛']

const SOIL_LABELS = { argileux: 'Argileux', sableux: 'Sableux', limoneux: 'Limoneux', humifere: 'Humifère', inconnu: 'Inconnu' }

// Trouve la région la plus proche des coordonnées GPS
function getClosestRegion(lat, lon) {
  return REGIONS.reduce((best, r) => {
    const d    = (r.lat - lat) ** 2 + (r.lon - lon) ** 2
    const dBest = (best.lat - lat) ** 2 + (best.lon - lon) ** 2
    return d < dBest ? r : best
  })
}

// ─── Étape 1 : Bienvenue ──────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  return (
    <div className="flex flex-col items-center px-6 pt-8" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
      <div className="relative w-full overflow-hidden mb-4" style={{ height: 96 }} aria-hidden="true">
        {VEG_EMOJIS.map((emoji, i) => (
          <span
            key={i}
            style={{
              position: 'absolute', fontSize: 24 + (i % 3) * 8,
              left: `${i * 11 + 1}%`, top: 0,
              animation: `vegFall ${2.2 + (i % 3) * 0.6}s ease-in-out ${i * 0.18}s infinite`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="text-center flex-1 flex flex-col items-center justify-center py-6">
        <p className="text-6xl mb-4">🌱</p>
        <h1 className="font-fraunces font-bold mb-3" style={{ fontSize: 42, color: '#3B6D11', fontStyle: 'italic', lineHeight: 1.1 }}>
          Jardinero
        </h1>
        <p className="text-base font-medium mb-1" style={{ color: '#6B7A5C' }}>Votre potager intelligent</p>
        <p className="text-sm" style={{ color: '#97C459' }}>Calendrier · Conseils · Météo</p>
      </div>

      <div className="w-full grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: '🌦️', label: 'Météo\nadaptée' },
          { icon: '📅', label: 'Calendrier\npersonnalisé' },
          { icon: '💧', label: 'Arrosage\nintelligent' },
        ].map(f => (
          <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl" style={{ background: '#EAF3DE' }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <p className="text-xs text-center font-medium leading-tight" style={{ color: '#3B6D11', whiteSpace: 'pre-line' }}>{f.label}</p>
          </div>
        ))}
      </div>

      <button onClick={onNext} className="w-full py-4 rounded-card font-bold text-base tap-scale" style={{ background: '#3B6D11', color: 'white' }}>
        Commencer →
      </button>
    </div>
  )
}

// ─── Étape 2 : Région + GPS ───────────────────────────────────────────────────

function StepRegion({ selected, coords, geoLoading, geoError, onSelect, onBack, onRequestGPS }) {
  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-sm font-semibold mb-3" style={{ color: '#6B7A5C' }}>← Retour</button>
        <h2 className="font-fraunces text-2xl font-bold" style={{ color: '#1A2010' }}>Où est ton jardin ?</h2>
        <p className="text-sm mt-1 mb-4" style={{ color: '#6B7A5C' }}>Pour la météo et le calendrier des semis.</p>

        {/* Bouton GPS */}
        <button
          onClick={onRequestGPS}
          disabled={geoLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-card font-semibold text-sm mb-2 tap-scale"
          style={{
            background: coords ? '#EAF3DE' : '#3B6D11',
            color:      coords ? '#3B6D11' : 'white',
            border:     coords ? '2px solid #97C459' : 'none',
          }}
        >
          {geoLoading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin-star 1s linear infinite', fontSize: 18 }}>⟳</span>
              Localisation en cours…
            </>
          ) : coords ? (
            <>✓ Position détectée — {coords.lat.toFixed(2)}°, {coords.lon.toFixed(2)}°</>
          ) : (
            <>📍 Utiliser ma position GPS</>
          )}
        </button>

        {geoError && (
          <p className="text-xs mb-3 px-1" style={{ color: '#E05A3A' }}>⚠️ {geoError}</p>
        )}

        <p className="text-xs font-semibold mb-2" style={{ color: '#6B7A5C' }}>
          {coords ? 'Ou choisis une région pour le calendrier :' : 'Ou sélectionne ta région :'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-2 gap-2 pb-4">
          {REGIONS.map(region => {
            const isSelected = selected === region.id
            return (
              <button
                key={region.id}
                onClick={() => onSelect(region.id)}
                className="flex items-start gap-3 p-3 rounded-card text-left tap-scale transition-all"
                style={{
                  background: isSelected ? '#EAF3DE' : 'white',
                  border: `2px solid ${isSelected ? '#97C459' : '#DDE8CC'}`,
                }}
              >
                <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{REGION_EMOJI[region.id] ?? '🌍'}</span>
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: isSelected ? '#3B6D11' : '#1A2010' }}>{region.label}</p>
                  <p className="text-xs mt-0.5 leading-tight" style={{ color: '#6B7A5C' }}>{region.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Étape 3 : Sol + détection automatique ────────────────────────────────────

function StepSol({ selected, coords, onSelect, onBack }) {
  console.log('[StepSol] coords reçus :', coords)
  const { soilId, clay, sand, silt, loading, error } = useSoilData(coords?.lat, coords?.lon)
  const [dismissed, setDismissed] = useState(false)

  const showAutoCard = coords && !dismissed && !error

  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-sm font-semibold mb-3" style={{ color: '#6B7A5C' }}>← Retour</button>
        <h2 className="font-fraunces text-2xl font-bold" style={{ color: '#1A2010' }}>Quel type de sol ?</h2>
        <p className="text-sm mt-1" style={{ color: '#6B7A5C' }}>Les conseils d'arrosage s'ajustent à ton sol.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        {/* Carte de détection automatique */}
        {showAutoCard && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '2px solid #97C459' }}>
            <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#3B6D11' }}>
              <span style={{ fontSize: 16 }}>🛰️</span>
              <p className="text-xs font-bold text-white">Sol détecté automatiquement via SoilGrids</p>
            </div>

            {loading ? (
              <div className="px-4 py-5 flex items-center gap-3" style={{ background: '#F8FFF4' }}>
                <span style={{ fontSize: 22, animation: 'spin-star 1.2s linear infinite', display: 'inline-block' }}>⟳</span>
                <p className="text-sm" style={{ color: '#6B7A5C' }}>Analyse du sol en cours…</p>
              </div>
            ) : soilId ? (
              <div className="px-4 py-4" style={{ background: '#F8FFF4' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ fontSize: 36 }}>{SOILS.find(s => s.id === soilId)?.emoji ?? '🌱'}</span>
                  <div>
                    <p className="font-bold text-base" style={{ color: '#1A2010' }}>
                      {SOILS.find(s => s.id === soilId)?.label ?? SOIL_LABELS[soilId]}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7A5C' }}>
                      Argile {clay ?? '?'}% · Sable {sand ?? '?'}% · Limon {silt ?? '?'}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelect(soilId)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold tap-scale"
                    style={{
                      background: selected === soilId ? '#3B6D11' : '#EAF3DE',
                      color:      selected === soilId ? 'white' : '#3B6D11',
                    }}
                  >
                    {selected === soilId ? '✓ Sélectionné' : 'Utiliser ce sol'}
                  </button>
                  <button
                    onClick={() => setDismissed(true)}
                    className="px-3 py-2.5 rounded-xl text-xs tap-scale"
                    style={{ background: '#F3F4F6', color: '#6B7A5C' }}
                  >
                    Choisir manuellement
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Sélection manuelle */}
        {(!showAutoCard || dismissed) && (
          <div className="flex flex-col gap-2 pb-4">
            {SOILS.map(soil => {
              const isSelected = selected === soil.id
              return (
                <button
                  key={soil.id}
                  onClick={() => onSelect(soil.id)}
                  className="flex items-center gap-4 px-4 py-4 rounded-card text-left tap-scale transition-all"
                  style={{
                    background: isSelected ? '#EAF3DE' : 'white',
                    border: `2px solid ${isSelected ? '#97C459' : '#DDE8CC'}`,
                  }}
                >
                  <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{soil.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: isSelected ? '#3B6D11' : '#1A2010' }}>{soil.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>{soil.desc}</p>
                  </div>
                  {isSelected && <span style={{ color: '#97C459', fontSize: 20 }}>✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {/* Bouton continuer si sol auto sélectionné et carte visible */}
        {showAutoCard && !dismissed && selected && (
          <p className="text-xs text-center pb-4" style={{ color: '#6B7A5C' }}>
            Sol sélectionné — passe à l'étape suivante ↑
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Étape 4 : Confirmation ───────────────────────────────────────────────────

function StepConfirmation({ region, soil, coords, onConfirm, onSkip, onBack }) {
  const mois = MOIS_FR[new Date().getMonth()]

  return (
    <div className="flex flex-col px-5 pt-5" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
      <button onClick={onBack} className="text-sm font-semibold mb-4" style={{ color: '#6B7A5C' }}>← Retour</button>
      <h2 className="font-fraunces text-2xl font-bold mb-1" style={{ color: '#1A2010' }}>Tout est prêt !</h2>
      <p className="text-sm mb-5" style={{ color: '#6B7A5C' }}>Voici ton profil pour ce mois de {mois}.</p>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1" style={{ background: '#EAF3DE', border: '2px solid #DDE8CC' }}>
          {coords ? (
            <>
              <span style={{ fontSize: 28 }}>📍</span>
              <p className="text-xs font-bold text-center mt-1" style={{ color: '#3B6D11' }}>
                {coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E
              </p>
              <p className="text-xs text-center" style={{ color: '#6B7A5C' }}>GPS précis</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: 32 }}>{REGION_EMOJI[region?.id] ?? '🌍'}</span>
              <p className="text-xs font-bold text-center mt-1" style={{ color: '#3B6D11' }}>{region?.label ?? '—'}</p>
            </>
          )}
        </div>
        <div className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1" style={{ background: '#EAF3DE', border: '2px solid #DDE8CC' }}>
          <span style={{ fontSize: 32 }}>{soil?.emoji ?? '🌱'}</span>
          <p className="text-xs font-bold text-center mt-1" style={{ color: '#3B6D11' }}>Sol {soil?.label ?? '—'}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ background: '#F8FFF4', border: '1px solid #DDE8CC' }}>
        {[
          { icon: '🌦️', text: `Météo ${coords ? 'ultra-précise à ta position GPS' : `locale adaptée à ${region?.label ?? 'ta région'}`}` },
          { icon: '📅', text: 'Calendrier des semis personnalisé pour ce mois de ' + mois },
          { icon: '💧', text: "Fréquences d'arrosage ajustées à ton type de sol" },
        ].map(f => (
          <div key={f.icon} className="flex items-start gap-3 py-2">
            <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
            <p className="text-sm leading-snug" style={{ color: '#1A2010' }}>{f.text}</p>
          </div>
        ))}
      </div>

      <button onClick={onConfirm} className="w-full py-4 rounded-card font-bold text-base mb-3 tap-scale" style={{ background: '#3B6D11', color: 'white' }}>
        C'est parti ! 🌱
      </button>
      <button onClick={onSkip} className="w-full py-2 text-sm" style={{ color: '#6B7A5C' }}>
        Passer pour l'instant
      </button>
    </div>
  )
}

// ─── Modal principale ─────────────────────────────────────────────────────────

const TOTAL_STEPS = 4

export default function OnboardingModal({ onComplete }) {
  const [step, setStep]                         = useState(1)
  const [selectedRegion, setSelectedRegion]     = useState(null)
  const [selectedSoil, setSelectedSoil]         = useState(null)
  const [coords, setCoords]                     = useState(null)  // { lat, lon }
  const [geoLoading, setGeoLoading]             = useState(false)
  const [geoError, setGeoError]                 = useState(null)

  const region = REGIONS.find(r => r.id === selectedRegion)
  const soil   = SOILS.find(s => s.id === selectedSoil)

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGeoError('Géolocalisation non supportée par ce navigateur.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        console.log('[GPS] coordonnées obtenues :', c)
        setCoords(c)
        setGeoLoading(false)
        const closest = getClosestRegion(c.lat, c.lon)
        console.log('[GPS] région la plus proche :', closest.id)
        setSelectedRegion(closest.id)
        console.log('[GPS] passage à step 3 avec coords :', c)
        setStep(3)
      },
      () => {
        setGeoError('Localisation refusée. Sélectionne ta région manuellement.')
        setGeoLoading(false)
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleSelectRegion = (id) => {
    setSelectedRegion(id)
    setStep(3)
  }

  const handleSelectSoil = (id) => {
    setSelectedSoil(id)
    setStep(4)
  }

  const handleConfirm = () => {
    onComplete(selectedRegion ?? 'loire', selectedSoil ?? 'inconnu', coords)
  }

  const handleSkip = () => {
    onComplete(selectedRegion ?? 'loire', selectedSoil ?? 'inconnu', coords)
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end" style={{ background: 'rgba(26,32,16,0.72)' }}>
      <div
        className="fade-in w-full max-w-[768px] mx-auto rounded-t-[28px] flex flex-col"
        style={{ background: '#FAF8F3', maxHeight: '93dvh', boxShadow: '0 -4px 28px rgba(0,0,0,0.2)' }}
      >
        {/* Barre de progression */}
        <div className="flex gap-1.5 px-5 pt-4 pb-0 flex-shrink-0">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i + 1 <= step ? '#97C459' : '#DDE8CC' }}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 1 && <StepWelcome onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepRegion
              selected={selectedRegion}
              coords={coords}
              geoLoading={geoLoading}
              geoError={geoError}
              onSelect={handleSelectRegion}
              onBack={() => setStep(1)}
              onRequestGPS={handleRequestGPS}
            />
          )}
          {step === 3 && (
            <StepSol
              selected={selectedSoil}
              coords={coords}
              onSelect={handleSelectSoil}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepConfirmation
              region={region}
              soil={soil}
              coords={coords}
              onConfirm={handleConfirm}
              onSkip={handleSkip}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
