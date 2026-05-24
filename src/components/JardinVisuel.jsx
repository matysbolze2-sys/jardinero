import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { ASSOCIATIONS } from '../data/associations'
import { getFrequencePlante } from '../utils/arrosageUtils'
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

// ─── Individual plot tile ────────────────────────────────────────────────────

function PlotTile({ plot, index, isConflict, waterMode, onTap, profile }) {
  const [fx, setFx] = useState(null) // 'harvest' | 'water' | null

  const isEmpty   = !plot
  const isReady   = plot?.status === 'ready'
  const isGrowing = plot?.status === 'growing' || plot?.status === 'flowering'
  const isSowed   = plot?.status === 'sowed'
  const isWatered = plot && (profile.arrosages?.[plot.id] ?? []).includes(TODAY)

  const soilBg = isEmpty
    ? 'repeating-conic-gradient(#7A5020 0%, #7A5020 25%, #6A4018 0%, #6A4018 50%) 0 0 / 10px 10px'
    : isReady
    ? 'radial-gradient(ellipse at 50% 60%, #8B6914 0%, #5C4A0A 100%)'
    : isWatered
    ? 'radial-gradient(ellipse at 50% 70%, #2E1A0A 0%, #1A0E04 100%)'
    : isSowed
    ? 'radial-gradient(ellipse at 50% 70%, #6B3A1C 0%, #4A2810 100%)'
    : 'radial-gradient(ellipse at 50% 70%, #5A3818 0%, #3A2010 100%)'

  const woodColor   = isConflict ? '#C05010' : '#5C3A15'
  const borderColor = isConflict ? '#F97316' : isReady ? '#FAC775' : '#7A4E20'

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

  const pct = plot?.status === 'flowering' ? 75 : plot?.status === 'growing' ? 40 : 0

  return (
    <div onClick={handleClick} style={{ position: 'relative', cursor: 'pointer', marginBottom: 10 }}>

      {/* Top face */}
      <div
        style={{
          width: '100%',
          paddingTop: '88%',
          position: 'relative',
          borderRadius: 7,
          background: soilBg,
          border: `2px solid ${borderColor}`,
          boxShadow: isReady
            ? `0 0 18px rgba(250,199,117,0.55), 0 5px 0 ${woodColor}, 0 7px 10px rgba(0,0,0,0.4)`
            : `0 5px 0 ${woodColor}, 0 7px 10px rgba(0,0,0,0.35)`,
          animation: isReady ? 'tile-glow 2.2s ease-in-out infinite' : 'none',
          overflow: 'hidden',
        }}
      >
        {/* Soil groove lines */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 7,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 1px, transparent 9px)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>

          {/* Empty */}
          {isEmpty && (
            <span style={{ fontSize: 22, color: 'rgba(255,210,140,0.35)', fontWeight: 700 }}>+</span>
          )}

          {/* Sowed */}
          {isSowed && (
            <div style={{ textAlign: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: 18 }}>{plot.emoji}</span>
              <p style={{ fontSize: 8, color: 'rgba(255,225,170,0.65)', fontWeight: 600, marginTop: 2, lineHeight: 1.2 }}>
                {plot.name}
              </p>
            </div>
          )}

          {/* Growing */}
          {isGrowing && (
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
              <span style={{ fontSize: 11 }}>{plot.emoji}</span>
            </div>
          )}

          {/* Ready */}
          {isReady && (
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
          )}

          {/* Conflict badge */}
          {isConflict && (
            <span style={{ position: 'absolute', top: 3, right: 3, fontSize: 10 }}>⚠️</span>
          )}
          {/* Watered badge */}
          {isWatered && !isEmpty && (
            <span style={{ position: 'absolute', top: 3, left: 3, fontSize: 10 }}>💧</span>
          )}

          {/* Effects */}
          {fx === 'harvest' && <Confetti />}
          {fx === 'water' && <WaterDrops />}
        </div>
      </div>

      {/* Growth progress bar */}
      {isGrowing && (
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

export default function JardinVisuel({ onClose, onGoToAssociations }) {
  const raw = useProfile()
  const { profile, addPlant, removePlant, marquerArrose } = raw

  // Inject marquerArrose into profile for tile access
  profile._marquerArrose = marquerArrose

  const plants = profile.plants ?? []

  // Build slot array — min 6 slots, always multiple of COLS, at least 1 empty slot
  const slotCount = Math.max(
    MIN_SLOTS,
    Math.ceil((plants.length + 1) / COLS) * COLS
  )
  const plots = Array.from({ length: slotCount }, (_, i) => plants[i] ?? null)
  const conflictSet = getConflictSet(plots)

  const [waterMode, setWaterMode]     = useState(false)
  const [popup, setPopup]             = useState(null)    // { plant }
  const [showAddModal, setShowAddModal] = useState(false)

  // Roaming creature
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
    if (plot.status === 'ready') {
      // Harvest handled inside PlotTile (confetti then remove)
      setTimeout(() => removePlant(plot.id), 850)
      return
    }
    setPopup({ plant: plot })
  }

  // Creature position (approximate, for the overlay)
  const creatureRow = Math.floor(creatureSlot / COLS)
  const creatureCol = creatureSlot % COLS

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden"
      style={{ maxWidth: 768, left: '50%', transform: 'translateX(-50%)', background: '#162B0A' }}
    >
      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        background: '#0D1A07',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
      }}>
        <button onClick={onClose} style={{ color: '#97C459', fontWeight: 600, fontSize: 14 }}>← Retour</button>
        <p className="font-fraunces" style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>🌿 Mon Jardin</p>
        <button
          onClick={() => setWaterMode(m => !m)}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: waterMode ? '#1D4ED8' : '#3B6D11',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: waterMode ? '2px solid #93C5FD' : '2px solid #97C459',
            boxShadow: waterMode ? '0 0 10px rgba(147,197,253,0.5)' : 'none',
            transition: 'all 0.2s',
            animation: waterMode ? 'water-wiggle 0.4s ease' : 'none',
          }}
        >💧</button>
      </div>

      {/* Watering mode banner */}
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

      {/* ── Scrollable garden ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0', paddingBottom: 'max(100px, calc(80px + env(safe-area-inset-bottom)))' }}>

        {/* ISO perspective wrapper */}
        <div style={{ perspective: '900px', perspectiveOrigin: '50% -20%' }}>
          <div style={{ transform: 'rotateX(32deg)', transformOrigin: 'top center' }}>

            {/* Grass board */}
            <div style={{
              background: 'linear-gradient(180deg, #3B8A28 0%, #2D6A1F 100%)',
              borderRadius: 14,
              padding: '14px 10px 30px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.25)',
              position: 'relative',
            }}>

              {/* Wooden fence */}
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

              {/* Plot grid */}
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
                  />
                ))}

                {/* Roaming creature */}
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

              {/* Fence bottom */}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { emoji: '🌱', label: 'Semé' },
            { emoji: '🌿', label: 'En pousse' },
            { badge: true,  label: 'Prêt !' },
            { emoji: '💧', label: 'Arrosé' },
            { emoji: '⚠️', label: 'Conflit' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {item.badge ? (
                <span style={{
                  background: '#FAC775', color: '#7A4E00',
                  fontSize: 8, fontWeight: 800,
                  padding: '1px 5px', borderRadius: 3,
                }}>Prêt !</span>
              ) : (
                <span style={{ fontSize: 12 }}>{item.emoji}</span>
              )}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popup growing plant ── */}
      {popup && (
        <div
          onClick={() => setPopup(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 75,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end',
          }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <span style={{ fontSize: 44, lineHeight: 1 }}>{popup.plant.emoji}</span>
              <div>
                <p className="font-fraunces" style={{ fontSize: 20, fontWeight: 700, color: '#1A2010' }}>
                  {popup.plant.name}
                </p>
                <p style={{ fontSize: 12, color: '#6B7A5C' }}>En cours de croissance</p>
              </div>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#EAF3DE', borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: '#6B7A5C' }}>⏱ Récolte estimée</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#3B6D11', marginTop: 3 }}>
                  ~{daysUntilReady(popup.plant.status)} jours
                </p>
              </div>
              <div style={{ background: '#EAF3DE', borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: '#6B7A5C' }}>💧 Prochain arrosage</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#3B6D11', marginTop: 3 }}>
                  {nextWaterLabel(popup.plant, profile)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setPopup(null)
                  if (onGoToAssociations) onGoToAssociations()
                  else onClose()
                }}
                style={{
                  flex: 1, padding: '13px',
                  background: '#EAF3DE', color: '#3B6D11',
                  borderRadius: 12, fontWeight: 600, fontSize: 13,
                  border: '1px solid #97C459',
                }}
              >
                🤝 Associations
              </button>
              <button
                onClick={() => setPopup(null)}
                style={{
                  flex: 1, padding: '13px',
                  background: '#3B6D11', color: 'white',
                  borderRadius: 12, fontWeight: 600, fontSize: 13,
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add plant modal ── */}
      {showAddModal && (
        <AddPlantModal
          onAdd={plant => { addPlant(plant); setShowAddModal(false) }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
