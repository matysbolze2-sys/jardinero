import { useState, useEffect } from 'react'
import { REGIONS } from '../data/regions'
import { SOILS } from '../data/soils'
import { useSoilData } from '../hooks/useSoilData'
import EmojiIllo from './EmojiIllo'

const REGION_EMOJI = {
  'nord': '❄️', 'idf': '🏙️', 'grand-est': '🌲', 'bretagne': '🌊',
  'loire': '🌿', 'rhone-alpes': '⛰️', 'montagne': '🏔️',
  'sud-ouest': '🍷', 'mediterranee': '☀️',
}

const MOIS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

function getClosestRegion(lat, lon) {
  return REGIONS.reduce((best, r) => {
    const d     = (r.lat - lat) ** 2 + (r.lon - lon) ** 2
    const dBest = (best.lat - lat) ** 2 + (best.lon - lon) ** 2
    return d < dBest ? r : best
  })
}

// ── Indicateur de progression — points ────────────────────────────────────────
function StepDots({ step, total }) {
  return (
    <div className="flex justify-center items-center gap-2 pt-4 pb-1 flex-shrink-0">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width:        i === step - 1 ? 24 : 8,
            height:       8,
            borderRadius: 4,
            background:   i === step - 1 ? 'var(--jd-accent)' : 'var(--jd-border)',
            transition:   'all 0.3s var(--jd-ease-out)',
          }}
        />
      ))}
    </div>
  )
}

// ── Étape 1 : Bienvenue ───────────────────────────────────────────────────────
function StepWelcome({ onNext }) {
  return (
    <div className="flex flex-col items-center px-6 pt-6" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

      <div className="fade-up" style={{ animationDelay: '0ms' }}>
        <EmojiIllo emoji="🌱" size={120} ring />
      </div>

      <h1
        className="jd-title fade-up"
        style={{ fontSize: 48, color: 'var(--jd-accent)', letterSpacing: '-0.03em', marginTop: 20, animationDelay: 'var(--jd-stagger)' }}
      >
        Jardinero
      </h1>

      <p className="text-base font-medium mt-2 fade-up" style={{ color: 'var(--jd-ink)', animationDelay: 'calc(var(--jd-stagger) * 2)' }}>
        Votre potager intelligent
      </p>
      <p className="text-sm mt-1 mb-8 fade-up" style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 3)' }}>
        Calendrier · Conseils · Météo
      </p>

      <div className="w-full grid grid-cols-3 gap-3 mb-8 fade-up" style={{ animationDelay: 'calc(var(--jd-stagger) * 4)' }}>
        {[
          { emoji: '🌦️', label: 'Météo\nadaptée' },
          { emoji: '📅', label: 'Calendrier\npersonnalisé' },
          { emoji: '💧', label: 'Arrosage\nintelligent' },
        ].map(f => (
          <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--jd-surface-alt)' }}>
            <EmojiIllo emoji={f.emoji} size={36} ring={false} />
            <p className="text-xs text-center font-medium leading-tight" style={{ color: 'var(--jd-ink-muted)', whiteSpace: 'pre-line' }}>{f.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-card font-bold text-base tap-scale fade-up"
        style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)', animationDelay: 'calc(var(--jd-stagger) * 5)' }}
      >
        Commencer →
      </button>
    </div>
  )
}

// ── Étape 2 : Région + GPS ────────────────────────────────────────────────────
function StepRegion({ selected, coords, geoLoading, geoError, onSelect, onBack, onRequestGPS }) {
  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-sm font-semibold mb-3" style={{ color: 'var(--jd-ink-muted)' }}>← Retour</button>

        <div className="flex flex-col items-center mb-4">
          <div className="fade-up" style={{ animationDelay: '0ms' }}>
            <EmojiIllo emoji="🗺️" size={96} ring />
          </div>
          <h2
            className="jd-title mt-3 text-center fade-up"
            style={{ fontSize: 26, color: 'var(--jd-ink)', animationDelay: 'var(--jd-stagger)' }}
          >
            Où est ton jardin ?
          </h2>
          <p
            className="text-sm mt-1 text-center fade-up"
            style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 2)' }}
          >
            Pour la météo et le calendrier des semis.
          </p>
        </div>

        <button
          onClick={onRequestGPS}
          disabled={geoLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-card font-semibold text-sm mb-2 tap-scale fade-up"
          style={{
            background:      coords ? 'var(--jd-surface-alt)' : 'var(--jd-accent)',
            color:           coords ? 'var(--jd-accent)'      : 'var(--jd-accent-ink)',
            border:          coords ? '1px solid var(--jd-accent-ring)' : 'none',
            animationDelay:  'calc(var(--jd-stagger) * 3)',
          }}
        >
          {geoLoading ? (
            <><span style={{ display: 'inline-block', animation: 'spin-star 1s linear infinite', fontSize: 18 }}>⟳</span> Localisation…</>
          ) : coords ? (
            <>✓ Position : {coords.lat.toFixed(2)}°, {coords.lon.toFixed(2)}°</>
          ) : (
            <>📍 Utiliser ma position GPS</>
          )}
        </button>

        {geoError && (
          <p className="text-xs mb-2 px-1" style={{ color: 'var(--jd-harvest)' }}>⚠️ {geoError}</p>
        )}

        <p className="text-xs font-semibold mb-2 fade-up" style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 4)' }}>
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
                  background: isSelected ? 'var(--jd-surface-alt)' : 'var(--jd-surface)',
                  border:     `1px solid ${isSelected ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
                }}
              >
                <EmojiIllo emoji={REGION_EMOJI[region.id] ?? '🌍'} size={36} ring={isSelected} />
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: isSelected ? 'var(--jd-accent)' : 'var(--jd-ink)' }}>{region.label}</p>
                  <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--jd-ink-muted)' }}>{region.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Étape 3 : Sol ─────────────────────────────────────────────────────────────
function StepSol({ selected, coords, onSelect, onBack }) {
  const { soilId, clay, sand, silt, isFallback, loading } = useSoilData(coords?.lat, coords?.lon)
  const [dismissed, setDismissed] = useState(false)

  const showAutoCard = coords && !dismissed
  const soilData    = SOILS.find(s => s.id === soilId)
  const headerLabel = isFallback
    ? '🗺️ Sol suggéré par zone géographique'
    : '🛰️ Sol détecté automatiquement via SoilGrids'

  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-sm font-semibold mb-3" style={{ color: 'var(--jd-ink-muted)' }}>← Retour</button>

        <div className="flex flex-col items-center mb-4">
          <div className="fade-up" style={{ animationDelay: '0ms' }}>
            <EmojiIllo emoji="🌍" size={96} ring />
          </div>
          <h2
            className="jd-title mt-3 text-center fade-up"
            style={{ fontSize: 26, color: 'var(--jd-ink)', animationDelay: 'var(--jd-stagger)' }}
          >
            Quel type de sol ?
          </h2>
          <p
            className="text-sm mt-1 text-center fade-up"
            style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 2)' }}
          >
            Les conseils d'arrosage s'ajustent à ton sol.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        {showAutoCard && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1px solid ${isFallback ? 'var(--jd-warning-ring)' : 'var(--jd-accent-ring)'}` }}>
            <div className="px-4 py-2" style={{ background: isFallback ? 'var(--jd-warning-soft)' : 'var(--jd-accent-soft)' }}>
              <p className="text-xs font-bold" style={{ color: isFallback ? 'var(--jd-warning)' : 'var(--jd-accent)' }}>{headerLabel}</p>
            </div>

            {loading ? (
              <div className="px-4 py-5 flex items-center gap-3" style={{ background: 'var(--jd-surface)' }}>
                <span style={{ fontSize: 22, animation: 'spin-star 1.2s linear infinite', display: 'inline-block' }}>⟳</span>
                <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>Analyse du sol en cours…</p>
              </div>
            ) : soilId ? (
              <div className="px-4 py-4" style={{ background: 'var(--jd-surface)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <EmojiIllo emoji={soilData?.emoji ?? '🌱'} size={44} ring />
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--jd-ink)' }}>{soilData?.label ?? soilId}</p>
                    {isFallback ? (
                      <p className="text-xs" style={{ color: 'var(--jd-warning)' }}>Données non disponibles — sol suggéré</p>
                    ) : (
                      <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>Argile {clay}% · Sable {sand}% · Limon {silt}%</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelect(soilId)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold tap-scale"
                    style={{
                      background: selected === soilId ? 'var(--jd-accent)' : 'var(--jd-surface-alt)',
                      color:      selected === soilId ? 'var(--jd-accent-ink)' : 'var(--jd-accent)',
                    }}
                  >
                    {selected === soilId ? '✓ Sélectionné' : 'Utiliser ce sol'}
                  </button>
                  <button
                    onClick={() => setDismissed(true)}
                    className="px-3 py-2.5 rounded-xl text-xs tap-scale"
                    style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-ink-muted)' }}
                  >
                    Choisir manuellement
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

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
                    background: isSelected ? 'var(--jd-surface-alt)' : 'var(--jd-surface)',
                    border:     `1px solid ${isSelected ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
                  }}
                >
                  <EmojiIllo emoji={soil.emoji} size={44} ring={isSelected} />
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: isSelected ? 'var(--jd-accent)' : 'var(--jd-ink)' }}>{soil.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>{soil.desc}</p>
                  </div>
                  {isSelected && <span style={{ color: 'var(--jd-accent)', fontSize: 20 }}>✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {showAutoCard && !dismissed && selected && (
          <p className="text-xs text-center pb-4" style={{ color: 'var(--jd-ink-muted)' }}>
            Sol sélectionné — passe à l'étape suivante ↑
          </p>
        )}
      </div>
    </div>
  )
}

// ── Étape 4 : Confirmation ────────────────────────────────────────────────────
function StepConfirmation({ region, soil, coords, onConfirm, onSkip, onBack }) {
  const mois = MOIS_FR[new Date().getMonth()]

  const benefits = [
    { emoji: '🌦️', text: `Météo ${coords ? 'ultra-précise à ta position GPS' : `locale adaptée à ${region?.label ?? 'ta région'}`}` },
    { emoji: '📅', text: 'Calendrier des semis personnalisé pour ce mois de ' + mois },
    { emoji: '💧', text: "Fréquences d'arrosage ajustées à ton type de sol" },
  ]

  return (
    <div className="flex flex-col px-5 pt-4" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
      <button onClick={onBack} className="text-sm font-semibold mb-3" style={{ color: 'var(--jd-ink-muted)' }}>← Retour</button>

      <div className="flex flex-col items-center mb-5">
        <div className="fade-up" style={{ animationDelay: '0ms' }}>
          <EmojiIllo emoji="🌿" size={96} ring />
        </div>
        <h2
          className="jd-title mt-3 text-center fade-up"
          style={{ fontSize: 26, color: 'var(--jd-ink)', animationDelay: 'var(--jd-stagger)' }}
        >
          Tout est prêt !
        </h2>
        <p
          className="text-sm mt-1 text-center fade-up"
          style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 2)' }}
        >
          Voici ton profil pour ce mois de {mois}.
        </p>
      </div>

      <div className="flex gap-3 mb-4 fade-up" style={{ animationDelay: 'calc(var(--jd-stagger) * 3)' }}>
        <div className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
          {coords ? (
            <>
              <EmojiIllo emoji="📍" size={44} />
              <p className="text-xs font-bold text-center mt-1" style={{ color: 'var(--jd-accent)' }}>
                {coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E
              </p>
              <p className="text-xs text-center" style={{ color: 'var(--jd-ink-muted)' }}>GPS précis</p>
            </>
          ) : (
            <>
              <EmojiIllo emoji={REGION_EMOJI[region?.id] ?? '🌍'} size={44} />
              <p className="text-xs font-bold text-center mt-1" style={{ color: 'var(--jd-accent)' }}>{region?.label ?? '—'}</p>
            </>
          )}
        </div>
        <div className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
          <EmojiIllo emoji={soil?.emoji ?? '🌱'} size={44} />
          <p className="text-xs font-bold text-center mt-1" style={{ color: 'var(--jd-accent)' }}>Sol {soil?.label ?? '—'}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6 fade-up" style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)', animationDelay: 'calc(var(--jd-stagger) * 4)' }}>
        {benefits.map(b => (
          <div key={b.emoji} className="flex items-start gap-3 py-2">
            <EmojiIllo emoji={b.emoji} size={24} ring={false} />
            <p className="text-sm leading-snug" style={{ color: 'var(--jd-ink)' }}>{b.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-4 rounded-card font-bold text-base mb-3 tap-scale fade-up"
        style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)', animationDelay: 'calc(var(--jd-stagger) * 5)' }}
      >
        C'est parti ! 🌱
      </button>
      <button
        onClick={onSkip}
        className="w-full py-2 text-sm fade-up"
        style={{ color: 'var(--jd-ink-muted)', animationDelay: 'calc(var(--jd-stagger) * 6)' }}
      >
        Passer pour l'instant
      </button>
    </div>
  )
}

// ── Modal principale ──────────────────────────────────────────────────────────

const TOTAL_STEPS = 4
const STORAGE_KEY = 'jd_onboarding'

export default function OnboardingModal({ onComplete }) {
  const [step,           setStep]           = useState(1)
  const [direction,      setDirection]      = useState('forward')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedSoil,   setSelectedSoil]   = useState(null)
  const [coords,         setCoords]         = useState(null)
  const [geoLoading,     setGeoLoading]     = useState(false)
  const [geoError,       setGeoError]       = useState(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
      if (saved?.step > 1) {
        setStep(saved.step)
        setSelectedRegion(saved.region ?? null)
        setSelectedSoil(saved.soil ?? null)
        setCoords(saved.coords ?? null)
      }
    } catch {}
  }, [])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      step, region: selectedRegion, soil: selectedSoil, coords,
    }))
  }, [step, selectedRegion, selectedSoil, coords])

  const region = REGIONS.find(r => r.id === selectedRegion)
  const soil   = SOILS.find(s => s.id === selectedSoil)

  const goTo = (target, dir = 'forward') => {
    setDirection(dir)
    setStep(target)
  }

  const handleRequestGPS = () => {
    if (!navigator.geolocation) { setGeoError('Géolocalisation non supportée.'); return }
    setGeoLoading(true); setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setCoords(c); setGeoLoading(false)
        setSelectedRegion(getClosestRegion(c.lat, c.lon).id)
        goTo(3, 'forward')
      },
      () => { setGeoError('Localisation refusée. Sélectionne ta région manuellement.'); setGeoLoading(false) },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleSelectRegion = (id) => { setSelectedRegion(id); goTo(3, 'forward') }
  const handleSelectSoil   = (id) => { setSelectedSoil(id);   goTo(4, 'forward') }

  const handleConfirm = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    onComplete(selectedRegion ?? 'loire', selectedSoil ?? 'inconnu', coords)
  }
  const handleSkip = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    onComplete(selectedRegion ?? 'loire', selectedSoil ?? 'inconnu', coords)
  }

  const enterClass = direction === 'back' ? 'page-enter-back' : 'page-enter'

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end" style={{ background: 'rgba(13,20,15,0.88)' }}>
      <div
        className="sheet-enter w-full max-w-[768px] mx-auto rounded-t-[28px] flex flex-col"
        style={{ background: 'var(--jd-surface)', maxHeight: '93dvh', boxShadow: '0 -4px 32px rgba(0,0,0,0.55)' }}
      >
        <StepDots step={step} total={TOTAL_STEPS} />

        <div className="flex-1 overflow-y-auto">
          <div key={step} className={enterClass}>
            {step === 1 && <StepWelcome onNext={() => goTo(2, 'forward')} />}
            {step === 2 && (
              <StepRegion
                selected={selectedRegion}
                coords={coords}
                geoLoading={geoLoading}
                geoError={geoError}
                onSelect={handleSelectRegion}
                onBack={() => goTo(1, 'back')}
                onRequestGPS={handleRequestGPS}
              />
            )}
            {step === 3 && (
              <StepSol
                selected={selectedSoil}
                coords={coords}
                onSelect={handleSelectSoil}
                onBack={() => goTo(2, 'back')}
              />
            )}
            {step === 4 && (
              <StepConfirmation
                region={region}
                soil={soil}
                coords={coords}
                onConfirm={handleConfirm}
                onSkip={handleSkip}
                onBack={() => goTo(3, 'back')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
