import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { ASSOCIATIONS } from '../data/associations'
import { getFrequencePlante } from '../utils/arrosageUtils'
import { getEffectiveStatus, getStageMessage, getCycleProgress, ALL_STATUT_LABELS } from '../utils/plantStatusUtils'
import { getRegionById } from '../data/regions'
import AddPlantModal from './AddPlantModal'

const COLS = 3
const MIN_SLOTS = 6

const TODAY = new Date().toISOString().split('T')[0]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConflictSet(plots) {
  const set = new Set()
  plots.forEach((plot, idx) => {
    if (!plot?.plantId || !ASSOCIATIONS[plot.plantId]) return
    const bad = ASSOCIATIONS[plot.plantId].mauvaises
    ;[idx - 1, idx + 1, idx - COLS, idx + COLS].forEach(ni => {
      const n = plots[ni]
      if (!n?.name) return
      if (bad.some(m => m.plante.toLowerCase().trim() === n.name.toLowerCase().trim())) {
        set.add(idx); set.add(ni)
      }
    })
  })
  return set
}

function daysUntilReady(status) {
  return { sowed: 28, growing: 14, flowering: 5 }[status] ?? 0
}

function nextWaterLabel(plant, profile) {
  const freq = getFrequencePlante(plant, profile.soil)
  const hist = (profile.arrosages ?? {})[plant.id] ?? []
  const last = hist.length
    ? new Date([...hist].sort().at(-1))
    : new Date(plant.plantedAt ?? Date.now())
  last.setHours(0, 0, 0, 0)
  const next = new Date(last)
  next.setDate(next.getDate() + freq)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.round((next - today) / 86400000)
  if (diff <= 0) return "Aujourd'hui ⚠️"
  if (diff === 1) return 'Demain'
  return `Dans ${diff} jours`
}

// ─── Soil background per effective status ────────────────────────────────────

function getSoilBg(effectiveStatus, isWatered, isEmpty) {
  if (isEmpty) return 'repeating-conic-gradient(#7A5020 0%, #7A5020 25%, #6A4018 0%, #6A4018 50%) 0 0 / 10px 10px'
  if (isWatered) return 'radial-gradient(ellipse at 50% 70%, #2E1A0A 0%, #1A0E04 100%)'
  switch (effectiveStatus) {
    case 'ready':               return 'radial-gradient(ellipse at 50% 60%, #8B6914 0%, #5C4A0A 100%)'
    case 'sowed':               return 'radial-gradient(ellipse at 50% 70%, #6B3A1C 0%, #4A2810 100%)'
    case 'flowering':           return 'radial-gradient(ellipse at 50% 70%, #5A3818 0%, #3A2010 100%)'
    case 'perennial_dormant':   return 'radial-gradient(ellipse at 50% 70%, #8A7050 0%, #6A5438 100%)'
    case 'perennial_producing': return 'radial-gradient(ellipse at 50% 60%, #7A6014 0%, #4A3C08 100%)'
    case 'perennial_longcycle': return 'radial-gradient(ellipse at 50% 70%, #565660 0%, #3A3A44 100%)'
    default:                    return 'radial-gradient(ellipse at 50% 70%, #5A3818 0%, #3A2010 100%)'
  }
}

// ─── Confetti ────────────────────────────────────────────────────────────────

function Confetti() {
  const COLS_CONF = ['#FAC775', '#97C459', '#E05A3A', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA']
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit', zIndex: 30 }}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * 360
        const dist  = 30 + Math.random() * 40
        const tx    = Math.cos((angle * Math.PI) / 180) * dist
        const ty    = Math.sin((angle * Math.PI) / 180) * dist
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 5, height: 5,
              borderRadius: i % 3 === 0 ? '50%' : 1,
              background: COLS_CONF[i % COLS_CONF.length],
              animation: 'confetti-burst 0.75s ease-out forwards',
              animationDelay: `${i * 0.03}s`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Water drops ─────────────────────────────────────────────────────────────

function WaterDrops() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, display: 'flex', justifyContent: 'center' }}>
      {[0, 1, 2, 3].map(i => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: -8,
            left: `${20 + i * 18}%`,
            fontSize: 16,
            animation: 'water-drop 0.65s ease-in forwards',
            animationDelay: `${i * 0.1}s`,
          }}
        >💧</span>
      ))}
    </div>
  )
}

// ─── Plot tile content per stage ─────────────────────────────────────────────

function TileContent({ effectiveStatus, plot, stageMsg }) {
  switch (effectiveStatus) {
    case 'sowed':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#97C459',
            boxShadow: '0 0 8px rgba(151,196,89,0.6)',
            margin: '0 auto 4px',
          }} />
          <p style={{ fontSize: 8, color: 'rgba(255,225,170,0.55)', fontWeight: 600, lineHeight: 1.2, padding: '0 2px' }}>
            {plot.name}
          </p>
        </div>
      )

    case 'growing':
    case 'perennial_growing':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 1, marginBottom: 1 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                fontSize: 13, display: 'inline-block',
                animation: 'stem-sway 2s ease-in-out infinite',
                animationDelay: `${i * 0.38}s`,
                transformOrigin: 'bottom center',
              }}>🌱</span>
            ))}
          </div>
          <span style={{ fontSize: effectiveStatus === 'perennial_growing' ? 16 : 11 }}>{plot.emoji}</span>
        </div>
      )

    case 'flowering':
      return (
        <div style={{ textAlign: 'center', position: 'relative', paddingTop: 8 }}>
          <span style={{
            position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
            fontSize: 10,
            animation: 'stem-sway 3s ease-in-out infinite',
            display: 'block',
          }}>✿</span>
          <span style={{ fontSize: 20, display: 'block', lineHeight: 1 }}>{plot.emoji}</span>
        </div>
      )

    case 'ready':
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: 30, display: 'block', lineHeight: 1,
            animation: 'bounce-ready 0.9s ease-in-out infinite',
          }}>{plot.emoji}</span>
          <div style={{
            display: 'inline-block',
            background: '#FAC775', color: '#7A4E00',
            fontSize: 8, fontWeight: 800,
            padding: '2px 5px', borderRadius: 4, marginTop: 2,
            animation: 'badge-bounce 1s ease-in-out infinite',
          }}>Prêt !</div>
        </div>
      )

    case 'perennial_dormant':
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 20, display: 'block', filter: 'grayscale(1)', opacity: 0.55 }}>{plot.emoji}</span>
          <div style={{
            display: 'inline-block',
            background: 'rgba(138,112,80,0.4)', color: '#D4C4A8',
            fontSize: 8, fontWeight: 700,
            padding: '2px 5px', borderRadius: 4, marginTop: 2,
          }}>Repos</div>
        </div>
      )

    case 'perennial_producing':
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: 28, display: 'block', lineHeight: 1,
            animation: 'tile-glow 2.2s ease-in-out infinite',
          }}>{plot.emoji}</span>
          <div style={{
            display: 'inline-block',
            background: 'rgba(249,168,37,0.2)', color: '#F9C84A',
            fontSize: 8, fontWeight: 700,
            padding: '2px 5px', borderRadius: 4, marginTop: 2,
          }}>✨ Récolte</div>
        </div>
      )

    case 'perennial_longcycle':
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 18, display: 'block', lineHeight: 1 }}>⏳</span>
          <p style={{ fontSize: 7, color: 'rgba(200,200,230,0.65)', fontWeight: 600, marginTop: 3, lineHeight: 1.2, padding: '0 2px' }}>
            {stageMsg ?? 'Longue culture'}
          </p>
        </div>
      )

    default:
      return null
  }
}

// ─── Individual plot tile ────────────────────────────────────────────────────

function PlotTile({ plot, index, isConflict, waterMode, onTap, profile, regionOffset }) {
  const [fx, setFx] = useState(null)

  const isEmpty        = !plot
  const effectiveStatus = isEmpty ? null : getEffectiveStatus(plot, regionOffset)
  const stageMsg        = isEmpty ? null : getStageMessage(plot, regionOffset)

  const isReady            = effectiveStatus === 'ready'
  const isPerennialProducing = effectiveStatus === 'perennial_producing'
  const isDormant          = effectiveStatus === 'perennial_dormant'
  const isLongCycle        = effectiveStatus === 'perennial_longcycle'
  const isGrowingAny       = effectiveStatus === 'growing' || effectiveStatus === 'flowering'

  const isWatered = plot && (profile.arrosages?.[plot.id] ?? []).includes(TODAY)

  const soilBg     = getSoilBg(effectiveStatus, isWatered && !isEmpty, isEmpty)
  const woodColor  = isConflict ? '#C05010' : '#5C3A15'
  const borderColor = isConflict
    ? '#F97316'
    : (isReady || isPerennialProducing) ? '#FAC775'
    : isDormant ? '#8A7050'
    : isLongCycle ? '#666680'
    : '#7A4E20'

  const glowAnim = (isReady || isPerennialProducing) ? 'tile-glow 2.2s ease-in-out infinite' : 'none'
  const boxShadow = (isReady || isPerennialProducing)
    ? `0 0 18px rgba(250,199,117,0.55), 0 5px 0 ${woodColor}, 0 7px 10px rgba(0,0,0,0.4)`
    : `0 5px 0 ${woodColor}, 0 7px 10px rgba(0,0,0,0.35)`

  const showProgress = isGrowingAny
  const pct = effectiveStatus === 'flowering' ? 75 : effectiveStatus === 'growing' ? 40 : 0

  function handleClick() {
    if (waterMode) {
      if (!plot || isReady) return
      if (isWatered) { alert("Déjà arrosé aujourd'hui !"); return }
      setFx('water')
      profile._marquerArrose(plot.id)
      setTimeout(() => setFx(null), 700)
      return
    }
    if (isReady) {
      setFx('harvest')
      setTimeout(() => { onTap(index, plot); setFx(null) }, 850)
      return
    }
    onTap(index, plot)
  }

  return (
    <div onClick={handleClick} style={{ position: 'relative', cursor: 'pointer', marginBottom: 10 }}>
      <div
        style={{
          width: '100%',
          paddingTop: '88%',
          position: 'relative',
          borderRadius: 7,
          background: soilBg,
          border: `2px solid ${borderColor}`,
          boxShadow,
          animation: glowAnim,
          overflow: 'hidden',
        }}
      >
        {/* Soil groove lines */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 7,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 1px, transparent 9px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {isEmpty && (
            <span style={{ fontSize: 22, color: 'rgba(255,210,140,0.35)', fontWeight: 700 }}>+</span>
          )}

          {!isEmpty && (
            <TileContent effectiveStatus={effectiveStatus} plot={plot} stageMsg={stageMsg} />
          )}

          {isConflict && (
            <span style={{ position: 'absolute', top: 3, right: 3, fontSize: 10 }}>⚠️</span>
          )}
          {isWatered && !isEmpty && (
            <span style={{ position: 'absolute', top: 3, left: 3, fontSize: 10 }}>💧</span>
          )}

          {fx === 'harvest' && <Confetti />}
          {fx === 'water' && <WaterDrops />}
        </div>
      </div>

      {/* Growth progress bar — annual only */}
      {showProgress && (
        <div style={{
          position: 'absolute', bottom: -10, left: 2, right: 2,
          height: 3, background: 'rgba(0,0,0,0.25)', borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #97C459, #BEE37A)',
            borderRadius: 2,
            animation: 'shimmer 2s linear infinite',
            backgroundSize: '200% 100%',
          }} />
        </div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function JardinVisuel({ onClose, onGoToAssociations, ctaBanner, onCtaClick }) {
  const raw = useProfile()
  const { profile, addPlant, removePlant, marquerArrose } = raw

  profile._marquerArrose = marquerArrose

  const regionOffset = getRegionById(profile.region)?.offset ?? 0
  const plants = profile.plants ?? []

  const slotCount = Math.max(
    MIN_SLOTS,
    Math.ceil((plants.length + 1) / COLS) * COLS
  )
  const plots      = Array.from({ length: slotCount }, (_, i) => plants[i] ?? null)
  const conflictSet = getConflictSet(plots)

  const [waterMode,    setWaterMode]    = useState(false)
  const [popup,        setPopup]        = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const [creatureSlot, setCreatureSlot] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setCreatureSlot(s => {
        let next = Math.floor(Math.random() * slotCount)
        if (next === s) next = (next + 1) % slotCount
        return next
      })
    }, 5000)
    return () => clearInterval(id)
  }, [slotCount])

  function handleTap(index, plot) {
    if (!plot) { setShowAddModal(true); return }
    const eff = getEffectiveStatus(plot, regionOffset)
    if (eff === 'ready') {
      setTimeout(() => removePlant(plot.id), 850)
      return
    }
    setPopup({ plant: plot })
  }

  const creatureRow = Math.floor(creatureSlot / COLS)
  const creatureCol = creatureSlot % COLS

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden"
      style={{ maxWidth: 768, left: '50%', transform: 'translateX(-50%)', background: '#162B0A' }}
    >
      {/* Header */}
      <div style={{
        flexShrink: 0,
        background: '#0D1A07',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
      }}>
        <button onClick={onClose} style={{ color: '#97C459', fontWeight: 600, fontSize: 14 }}>← Retour</button>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'var(--jd-font-display)' }}>🌿 Mon Jardin</p>
        <button
          onClick={() => setWaterMode(m => !m)}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: waterMode ? '#1D4ED8' : '#3B6D11',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: waterMode ? '2px solid #93C5FD' : '2px solid #97C459',
            boxShadow: waterMode ? '0 0 10px rgba(147,197,253,0.5)' : 'none',
            transition: 'all 0.2s',
          }}
        >💧</button>
      </div>

      {/* Optional CTA banner */}
      {ctaBanner && (
        <button
          onClick={onCtaClick}
          style={{
            flexShrink: 0,
            background: 'rgba(166,227,107,0.1)', color: '#97C459',
            textAlign: 'center', fontSize: 12, fontWeight: 600,
            padding: '8px 16px',
            borderBottom: '1px solid rgba(166,227,107,0.2)',
          }}
        >
          {ctaBanner}
        </button>
      )}

      {waterMode && (
        <div style={{
          flexShrink: 0,
          background: '#1D4ED8', color: 'white',
          textAlign: 'center', fontSize: 12, fontWeight: 600,
          padding: '6px 16px',
        }}>
          Mode arrosage actif — touchez une parcelle pour arroser
        </div>
      )}

      {/* Scrollable garden */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0', paddingBottom: 'max(100px, calc(80px + env(safe-area-inset-bottom)))' }}>
        <div style={{ perspective: '900px', perspectiveOrigin: '50% -20%' }}>
          <div style={{ transform: 'rotateX(32deg)', transformOrigin: 'top center' }}>
            <div style={{
              background: 'linear-gradient(180deg, #3B8A28 0%, #2D6A1F 100%)',
              borderRadius: 14,
              padding: '14px 10px 30px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.25)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 18,
                    background: '#C4873A', borderRadius: 2,
                    border: '1px solid #8B5E3C',
                    boxShadow: '0 3px 0 #5C3A15',
                  }} />
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: '22px 10px',
                position: 'relative',
              }}>
                {plots.map((plot, i) => (
                  <PlotTile
                    key={i}
                    plot={plot}
                    index={i}
                    isConflict={conflictSet.has(i)}
                    waterMode={waterMode}
                    onTap={handleTap}
                    profile={profile}
                    regionOffset={regionOffset}
                  />
                ))}

                <div style={{
                  position: 'absolute',
                  top: `calc(${creatureRow} * (100% / ${Math.ceil(slotCount / COLS)}) + 10px)`,
                  left: `calc(${creatureCol} * (100% / ${COLS}) + 12px)`,
                  fontSize: 13,
                  transition: 'top 1.2s ease, left 1.2s ease',
                  animation: 'creature-bob 1s ease-in-out infinite',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}>🐞</div>
              </div>

              <div style={{ display: 'flex', gap: 3, marginTop: 16 }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 18,
                    background: '#C4873A', borderRadius: 2,
                    border: '1px solid #8B5E3C',
                    boxShadow: '0 3px 0 #5C3A15',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { dot: true,   label: 'Semé' },
            { emoji: '🌱', label: 'En pousse' },
            { emoji: '✿',  label: 'En fleurs' },
            { badge: true,  label: 'Prêt !' },
            { emoji: '⏳',  label: 'Longue culture' },
            { emoji: '💧', label: 'Arrosé' },
            { emoji: '⚠️', label: 'Conflit' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {item.dot ? (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#97C459', boxShadow: '0 0 4px rgba(151,196,89,0.8)' }} />
              ) : item.badge ? (
                <span style={{ background: '#FAC775', color: '#7A4E00', fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3 }}>Prêt !</span>
              ) : (
                <span style={{ fontSize: 12 }}>{item.emoji}</span>
              )}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {popup && (() => {
        const effStatus = getEffectiveStatus(popup.plant, regionOffset)
        const stageMsg  = getStageMessage(popup.plant, regionOffset)
        const progress  = getCycleProgress(popup.plant, regionOffset)
        const statut    = ALL_STATUT_LABELS[effStatus] ?? ALL_STATUT_LABELS.sowed
        const isPerennial = effStatus.startsWith('perennial_')
        const showDays    = !isPerennial && daysUntilReady(effStatus) > 0

        return (
          <div
            onClick={() => setPopup(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 75, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 768, margin: '0 auto',
                background: 'white',
                borderRadius: '20px 20px 0 0',
                padding: '22px 20px 40px',
                boxShadow: '0 -4px 28px rgba(0,0,0,0.22)',
              }}
            >
              {/* Plant header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 44, lineHeight: 1 }}>{popup.plant.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#1A2010', fontFamily: 'var(--jd-font-display)' }}>
                    {popup.plant.name}
                  </p>
                  <span style={{
                    display: 'inline-block', marginTop: 3,
                    fontSize: 11, fontWeight: 600, color: statut.color,
                    background: 'rgba(90,120,60,0.1)',
                    padding: '2px 8px', borderRadius: 999,
                  }}>
                    {statut.label}
                  </span>
                  {stageMsg && (
                    <p style={{ fontSize: 11, color: '#6B7A5C', marginTop: 4 }}>{stageMsg}</p>
                  )}
                </div>
              </div>

              {/* Cycle progress bar (annual only) */}
              {progress > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#6B7A5C' }}>Progression du cycle</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#3B6D11' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 4, background: '#EAF3DE', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#97C459', borderRadius: 2 }} />
                  </div>
                </div>
              )}

              {/* Info cards */}
              <div style={{ display: 'grid', gridTemplateColumns: showDays ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 16 }}>
                {showDays && (
                  <div style={{ background: '#EAF3DE', borderRadius: 12, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: '#6B7A5C' }}>⏱ Récolte estimée</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#3B6D11', marginTop: 3 }}>
                      ~{daysUntilReady(effStatus)} jours
                    </p>
                  </div>
                )}
                {effStatus === 'perennial_dormant' ? (
                  <div style={{ background: '#F5F0E8', borderRadius: 12, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: '#8A7050' }}>❄️ En repos hivernal</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#8A7050', marginTop: 3 }}>
                      Reprendra au printemps
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#EAF3DE', borderRadius: 12, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: '#6B7A5C' }}>💧 Prochain arrosage</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#3B6D11', marginTop: 3 }}>
                      {nextWaterLabel(popup.plant, profile)}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setPopup(null); if (onGoToAssociations) onGoToAssociations(); else onClose() }}
                  style={{ flex: 1, padding: '13px', background: '#EAF3DE', color: '#3B6D11', borderRadius: 12, fontWeight: 600, fontSize: 13, border: '1px solid #97C459' }}
                >
                  🤝 Associations
                </button>
                <button
                  onClick={() => setPopup(null)}
                  style={{ flex: 1, padding: '13px', background: '#3B6D11', color: 'white', borderRadius: 12, fontWeight: 600, fontSize: 13 }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {showAddModal && (
        <AddPlantModal
          onAdd={plant => { addPlant(plant); setShowAddModal(false) }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
