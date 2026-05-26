import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import EmojiIllo from '../EmojiIllo'
import { openmoji } from '../../utils/openmoji'
import { ALL_STATUT_LABELS } from '../../utils/plantStatusUtils'

// Stage-aware visual config for ISO/top dots
const STATUS_CONFIG = {
  sowed:               { color: '#8B9A50', r: 0.8 },
  growing:             { color: '#97C459', r: 1.0 },
  flowering:           { color: '#F9C84A', r: 1.0 },
  ready:               { color: '#F9A825', r: 1.2 },
  perennial_dormant:   { color: '#8B7355', r: 0.7 },
  perennial_growing:   { color: '#7DB87A', r: 0.9 },
  perennial_producing: { color: '#F9A825', r: 1.1 },
  perennial_longcycle: { color: '#A0A0A0', r: 0.5 },
}
const DEFAULT_CFG = { color: '#97C459', r: 1.0 }

const PX  = 30
const A30 = Math.PI / 6

function iso(x, y, z = 0, cx = 0, cy = 0) {
  return {
    x: cx + (x - y) * Math.cos(A30) * PX,
    y: cy + (x + y) * Math.sin(A30) * PX - z * PX,
  }
}

const CX = 145, CY = 30, BED_Z = 0.18

function bedCorners(p) {
  return {
    tl0: iso(p.x,       p.y,       0,     CX, CY),
    tr0: iso(p.x + p.w, p.y,       0,     CX, CY),
    br0: iso(p.x + p.w, p.y + p.h, 0,     CX, CY),
    bl0: iso(p.x,       p.y + p.h, 0,     CX, CY),
    tl1: iso(p.x,       p.y,       BED_Z, CX, CY),
    tr1: iso(p.x + p.w, p.y,       BED_Z, CX, CY),
    br1: iso(p.x + p.w, p.y + p.h, BED_Z, CX, CY),
    bl1: iso(p.x,       p.y + p.h, BED_Z, CX, CY),
  }
}

const FIREFLIES = [
  { left: '14%', top: '18%' }, { left: '38%', top: '36%' },
  { left: '74%', top: '14%' }, { left: '88%', top: '62%' },
  { left: '22%', top: '78%' }, { left: '56%', top: '88%' },
]

// ── Shared scene defs ────────────────────────────────────────────────────────
function SceneDefs() {
  return (
    <defs>
      <radialGradient id="jd3d-soil" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#3d2818" />
        <stop offset="100%" stopColor="#1c1209" />
      </radialGradient>
      <linearGradient id="jd3d-wt" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%"   stopColor="#5a3a22" />
        <stop offset="100%" stopColor="#3d2615" />
      </linearGradient>
      <linearGradient id="jd3d-ws" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%"   stopColor="#3a2410" />
        <stop offset="100%" stopColor="#1f1306" />
      </linearGradient>
      <filter id="jd3d-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
  )
}

// ── Quantity counter chip ────────────────────────────────────────────────────
function QtyControl({ value, onMinus, onPlus }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button
        onClick={onMinus}
        style={{
          width: 28, height: 28, borderRadius: '8px 0 0 8px',
          background: 'var(--jd-surface-alt)', color: 'var(--jd-ink-muted)',
          border: '1px solid var(--jd-border)', fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >−</button>
      <div style={{
        width: 32, height: 28,
        background: 'var(--jd-surface)', borderTop: '1px solid var(--jd-border)',
        borderBottom: '1px solid var(--jd-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--jd-font-mono)', fontSize: 12, fontWeight: 600,
        color: 'var(--jd-accent)',
      }}>
        {value}
      </div>
      <button
        onClick={onPlus}
        style={{
          width: 28, height: 28, borderRadius: '0 8px 8px 0',
          background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)',
          border: '1px solid var(--jd-accent)', fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700,
        }}
      >+</button>
    </div>
  )
}

// ── Plant picker sheet ────────────────────────────────────────────────────────
function PlantPicker({ plotId, assignedIds, allPlants, onAdd, onClose }) {
  const available = allPlants.filter(p => !assignedIds.has(p.id))
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxHeight: '55vh', overflowY: 'auto',
          background: 'var(--jd-surface)', borderRadius: '20px 20px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid var(--jd-border)' }}>
          <div className="jd-kicker">Ajouter une plante</div>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--jd-ink-muted)' }}>✕</button>
        </div>

        {available.length === 0 ? (
          <p style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--jd-ink-muted)' }}>
            Toutes vos plantes sont déjà dans cette parcelle.
          </p>
        ) : (
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {available.map(plant => (
              <button
                key={plant.id}
                onClick={() => onAdd(plotId, plant.id)}
                className="tap-scale"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--jd-radius-sm)',
                  background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)',
                  textAlign: 'left',
                }}
              >
                <img
                  src={openmoji(plant.emoji)}
                  alt=""
                  style={{ width: 28, height: 28 }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--jd-ink)' }}>{plant.name}</p>
                  {plant.variety && <p style={{ fontSize: 11, color: 'var(--jd-ink-muted)' }}>{plant.variety}</p>}
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 18, color: 'var(--jd-accent)', fontWeight: 700 }}>+</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Selected parcel management panel ────────────────────────────────────────
function ParcelPanel({ parcel, allPlants, onAdjust, onAdd, onDeselect }) {
  const [showPicker, setShowPicker] = useState(false)
  const assignedIds = new Set(parcel.assigned.map(p => p.id))

  return (
    <>
      <div style={{
        marginTop: 12,
        background: 'var(--jd-surface-glass)',
        backdropFilter: 'blur(var(--jd-blur))',
        WebkitBackdropFilter: 'blur(var(--jd-blur))',
        border: '1px solid var(--jd-accent-ring)',
        borderRadius: 'var(--jd-radius)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: parcel.assigned.length > 0 ? '1px solid var(--jd-border)' : 'none',
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--jd-ink)' }}>{parcel.label}</span>
            <span style={{ marginLeft: 8, fontFamily: 'var(--jd-font-mono)', fontSize: 10, color: 'var(--jd-ink-muted)' }}>{parcel.size}</span>
          </div>
          <button onClick={onDeselect} style={{ fontSize: 14, color: 'var(--jd-ink-muted)', padding: '2px 6px' }}>✕</button>
        </div>

        {/* Assigned plants with qty controls */}
        {parcel.assigned.map((plant, i) => (
          <div
            key={plant.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderBottom: i < parcel.assigned.length - 1 ? '1px solid var(--jd-border)' : 'none',
            }}
          >
            <img
              src={openmoji(plant.emoji)}
              alt=""
              style={{ width: 24, height: 24, flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--jd-ink)' }}>{plant.name}</span>
            <QtyControl
              value={plant.qty}
              onMinus={() => onAdjust(parcel.id, plant.id, -1)}
              onPlus={()  => onAdjust(parcel.id, plant.id, +1)}
            />
          </div>
        ))}

        {/* Add plant button */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-full tap-scale"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            borderTop: parcel.assigned.length > 0 ? '1px solid var(--jd-border)' : 'none',
            color: 'var(--jd-accent)', fontSize: 13, fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Ajouter une plante
        </button>
      </div>

      {showPicker && (
        <PlantPicker
          plotId={parcel.id}
          assignedIds={assignedIds}
          allPlants={allPlants}
          onAdd={(plotId, plantId) => { onAdd(plotId, plantId); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function GardenView3D({ garden, plants: allPlants = [] }) {
  const { saveGarden } = useProfile()
  const [view,   setView]   = useState('iso')
  const [selId,  setSelId]  = useState(null)

  // Build parcel data with quantities
  const parcels = (garden.plots ?? [])
    .map(plot => {
      const quantities = plot.plantQuantities ?? {}
      const assigned   = (plot.plants ?? [])
        .map(id => allPlants.find(p => p.id === id))
        .filter(Boolean)
        .map(p => ({ ...p, qty: quantities[p.id] ?? 1 }))
      const totalCount = assigned.reduce((sum, p) => sum + p.qty, 0)
      return {
        id:       plot.id,
        label:    plot.label || 'Parcelle',
        size:     `${plot.width}×${plot.height}m`,
        x: plot.x, y: plot.y, w: plot.width, h: plot.height,
        emoji:    assigned[0]?.emoji ?? '🌱',
        count:    totalCount,
        assigned,
        crop:     assigned.map(p => `${p.name}${p.qty > 1 ? ` ×${p.qty}` : ''}`).join(' · ') || 'Vide',
      }
    })
    .sort((a, b) => (a.y + a.h) - (b.y + b.h))

  const selParcel = parcels.find(p => p.id === selId) ?? null

  // Ground extents
  const gW = Math.max(...parcels.map(p => p.x + p.w), 2) + 0.3
  const gH = Math.max(...parcels.map(p => p.y + p.h), 1) + 0.3
  const g0 = iso(-0.3, -0.3, 0, CX, CY), g1 = iso(gW, -0.3, 0, CX, CY)
  const g2 = iso(gW,    gH,  0, CX, CY), g3 = iso(-0.3, gH, 0, CX, CY)
  const groundPts = `${g0.x},${g0.y} ${g1.x},${g1.y} ${g2.x},${g2.y} ${g3.x},${g3.y}`

  // Data operations
  function adjustQty(plotId, plantId, delta) {
    const plot = garden.plots.find(p => p.id === plotId)
    if (!plot) return
    const quantities = { ...(plot.plantQuantities ?? {}) }
    const next = Math.max(0, (quantities[plantId] ?? 1) + delta)
    const newIds = next === 0
      ? plot.plants.filter(id => id !== plantId)
      : [...new Set([...plot.plants, plantId])]
    if (next === 0) delete quantities[plantId]; else quantities[plantId] = next
    saveGarden({ plots: garden.plots.map(p => p.id === plotId ? { ...p, plants: newIds, plantQuantities: quantities } : p) })
    // Deselect if plant was removed and none left
    if (next === 0 && newIds.length === 0) { /* keep panel open */ }
  }

  function addToPlot(plotId, plantId) {
    const plot = garden.plots.find(p => p.id === plotId)
    if (!plot || plot.plants.includes(plantId)) return
    const quantities = { ...(plot.plantQuantities ?? {}), [plantId]: 1 }
    saveGarden({ plots: garden.plots.map(p => p.id === plotId ? { ...p, plants: [...p.plants, plantId], plantQuantities: quantities } : p) })
  }

  // ── ISO Scene ──────────────────────────────────────────────────────────────
  function renderIso() {
    return (
      <svg
        viewBox="-20 -10 300 180"
        style={{ width: '100%', height: 200, display: 'block', cursor: 'pointer' }}
        onClick={() => setSelId(null)}
      >
        <SceneDefs />
        <polygon points={groundPts} fill="#0c1a10" stroke="rgba(166,227,107,0.06)" strokeWidth="0.5" />

        {parcels.map(p => {
          const c = bedCorners(p)
          const sel = p.id === selId

          // Distribute dots across assigned plants (proportional)
          const dotPositions = []
          let slotIdx = 0
          for (const ap of p.assigned) {
            const slots = Math.min(ap.qty, Math.max(1, Math.round(ap.qty / Math.max(p.count, 1) * 8)))
            const cfg   = STATUS_CONFIG[ap.effectiveStatus] ?? DEFAULT_CFG
            for (let i = 0; i < slots && dotPositions.length < 8; i++) {
              dotPositions.push({ idx: slotIdx, emoji: ap.emoji, cfg })
              slotIdx++
            }
          }
          // fill remaining with generic
          while (dotPositions.length < Math.min(p.count, 8)) {
            dotPositions.push({ idx: slotIdx++, emoji: null, cfg: DEFAULT_CFG })
          }

          return (
            <g
              key={p.id}
              onClick={e => { e.stopPropagation(); setSelId(p.id === selId ? null : p.id) }}
              style={{ cursor: 'pointer' }}
            >
              {/* Front face */}
              <polygon
                points={`${c.bl0.x},${c.bl0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#jd3d-ws)" stroke={sel ? 'var(--jd-accent)' : '#000'} strokeWidth={sel ? 0.8 : 0.3}
              />
              {/* Right face */}
              <polygon
                points={`${c.tr0.x},${c.tr0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.tr1.x},${c.tr1.y}`}
                fill="#241509" stroke={sel ? 'var(--jd-accent)' : '#000'} strokeWidth={sel ? 0.8 : 0.3}
              />
              {/* Top (soil) — selection highlight overlay */}
              <polygon
                points={`${c.tl1.x},${c.tl1.y} ${c.tr1.x},${c.tr1.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#jd3d-soil)"
                stroke={sel ? 'var(--jd-accent)' : 'url(#jd3d-wt)'}
                strokeWidth={sel ? 1.8 : 1.5}
              />
              {sel && (
                <polygon
                  points={`${c.tl1.x},${c.tl1.y} ${c.tr1.x},${c.tr1.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                  fill="rgba(166,227,107,0.10)"
                  stroke="none"
                />
              )}

              {/* Plants — luminous dots sized/colored by stage */}
              {dotPositions.map((dot, i) => {
                const px2 = p.x + (i % 4 + 0.5) * (p.w / 4)
                const py2 = p.y + (Math.floor(i / 4) + 0.5) * (p.h / 2)
                const pt  = iso(px2, py2, 0.23, CX, CY)
                const { color, r } = dot.cfg
                return (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r={4 * r}   fill={color} opacity="0.25" filter="url(#jd3d-glow)" />
                    <circle cx={pt.x} cy={pt.y} r={1.6 * r} fill={color} />
                    <line x1={pt.x} y1={pt.y - 2} x2={pt.x} y2={pt.y - 2 - (4 * r)}
                      stroke={color} strokeWidth="1" strokeLinecap="round" />
                  </g>
                )
              })}

              {/* Floating emoji label */}
              {(() => {
                const m = iso(p.x + p.w / 2, p.y + p.h / 2, 0.55, CX, CY)
                return (
                  <g>
                    {sel && <circle cx={m.x} cy={m.y - 2} r="12" fill="rgba(166,227,107,0.15)" stroke="none" />}
                    <circle cx={m.x} cy={m.y - 2} r="9"
                      fill="var(--jd-bg)"
                      stroke="var(--jd-accent)"
                      strokeOpacity={sel ? 0.85 : 0.45}
                      strokeWidth={sel ? 1.2 : 0.7}
                    />
                    <text x={m.x} y={m.y + 2} textAnchor="middle" fontSize="11">{p.emoji}</text>
                  </g>
                )
              })()}
            </g>
          )
        })}
      </svg>
    )
  }

  // ── Top view ───────────────────────────────────────────────────────────────
  function renderTop() {
    const maxX  = Math.max(...parcels.map(p => p.x + p.w), 2)
    const maxY  = Math.max(...parcels.map(p => p.y + p.h), 1)
    const scale = 200 / Math.max(maxX, maxY)
    const pad   = 18
    return (
      <svg
        viewBox="0 0 260 200"
        style={{ width: '100%', height: 200, display: 'block', cursor: 'pointer' }}
        onClick={() => setSelId(null)}
      >
        <defs>
          <radialGradient id="jd3d-soil-t" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#3d2818" />
            <stop offset="100%" stopColor="#1c1209" />
          </radialGradient>
          <filter id="jd3d-glow-t" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect x={pad - 8} y={pad - 8} width={maxX * scale + 16} height={maxY * scale + 16}
          fill="#0c1a10" stroke="rgba(166,227,107,0.08)" strokeWidth="0.6" rx="4" />
        {parcels.map(p => {
          const x = pad + p.x * scale, y = pad + p.y * scale
          const w = p.w * scale,       h = p.h * scale
          const sel = p.id === selId
          return (
            <g key={p.id} onClick={e => { e.stopPropagation(); setSelId(p.id === selId ? null : p.id) }} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={w} height={h}
                fill="url(#jd3d-soil-t)"
                stroke={sel ? 'var(--jd-accent)' : 'rgba(90,58,34,0.8)'}
                strokeWidth={sel ? 2 : 1.5} rx="2" />
              {sel && <rect x={x} y={y} width={w} height={h} fill="rgba(166,227,107,0.10)" stroke="none" rx="2" />}
              {p.count > 0 && (() => {
                // Build same dotPositions for top view
                const dots = []
                let si = 0
                for (const ap of p.assigned) {
                  const slots = Math.min(ap.qty, Math.max(1, Math.round(ap.qty / Math.max(p.count, 1) * 8)))
                  const cfg   = STATUS_CONFIG[ap.effectiveStatus] ?? DEFAULT_CFG
                  for (let k = 0; k < slots && dots.length < 8; k++) dots.push({ si: si++, cfg })
                }
                while (dots.length < Math.min(p.count, 8)) dots.push({ si: si++, cfg: DEFAULT_CFG })
                return dots.map((dot, i) => {
                  const px2 = x + (i % 4 + 0.5) * (w / 4)
                  const py2 = y + (Math.floor(i / 4) + 0.5) * (h / 2)
                  const { color, r } = dot.cfg
                  return (
                    <g key={i}>
                      <circle cx={px2} cy={py2} r={3.5 * r} fill={color} opacity="0.25" filter="url(#jd3d-glow-t)" />
                      <circle cx={px2} cy={py2} r={1.5 * r} fill={color} />
                    </g>
                  )
                })
              })()}
              <circle cx={x + w/2} cy={y + h/2} r={sel ? 11 : 9}
                fill="var(--jd-bg)" stroke="var(--jd-accent)" strokeOpacity={sel ? 0.85 : 0.45} strokeWidth={sel ? 1.2 : 0.7} />
              <text x={x + w/2} y={y + h/2 + 4} textAnchor="middle" fontSize="11">{p.emoji}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* 3D Scene */}
      <div style={{
        background:   'radial-gradient(ellipse at 50% 40%, #1a3024 0%, var(--jd-bg) 80%)',
        border:       '1px solid var(--jd-border)',
        borderRadius: 'var(--jd-radius)',
        padding:      10,
        overflow:     'hidden',
        position:     'relative',
      }}>
        {FIREFLIES.map((f, i) => (
          <div key={i} style={{
            position: 'absolute', left: f.left, top: f.top,
            width: 2, height: 2, borderRadius: 2,
            background: 'var(--jd-accent)', opacity: 0.4,
            boxShadow: '0 0 6px var(--jd-accent)', pointerEvents: 'none',
          }} />
        ))}

        {parcels.length === 0 ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--jd-ink-muted)', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
              Aucune parcelle.<br />Allez dans « Parcelles » pour en ajouter.
            </p>
          </div>
        ) : view === 'iso' ? renderIso() : renderTop()}

        {/* View toggle */}
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 4 }}>
          {[{ k: 'iso', l: 'Iso' }, { k: 'top', l: 'Top' }].map(({ k, l }) => {
            const active = view === k
            return (
              <button key={k} onClick={e => { e.stopPropagation(); setView(k) }} style={{
                padding: '4px 9px', fontSize: 9.5, fontFamily: 'var(--jd-font-mono)',
                background: active ? 'rgba(166,227,107,0.15)' : 'rgba(255,255,255,0.04)',
                color:      active ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
                border:     `1px solid ${active ? 'rgba(166,227,107,0.55)' : 'var(--jd-border)'}`,
                borderRadius: 6, cursor: 'pointer',
              }}>{l}</button>
            )
          })}
        </div>
      </div>

      {/* Hint or selected parcel panel */}
      {!selId ? (
        <p style={{ marginTop: 10, fontSize: 11, color: 'var(--jd-ink-muted)', textAlign: 'center' }}>
          Tapez une parcelle pour gérer ses plantes
        </p>
      ) : selParcel ? (
        <ParcelPanel
          parcel={selParcel}
          allPlants={allPlants}
          onAdjust={adjustQty}
          onAdd={addToPlot}
          onDeselect={() => setSelId(null)}
        />
      ) : null}

      {/* Compact parcels overview */}
      {parcels.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="jd-kicker" style={{ marginBottom: 10 }}>Parcelles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {parcels.map(p => (
              <button
                key={p.id}
                onClick={() => setSelId(p.id === selId ? null : p.id)}
                className="tap-scale w-full text-left"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px 10px 10px',
                  background: p.id === selId ? 'var(--jd-surface-alt)' : 'var(--jd-surface-glass)',
                  backdropFilter: 'blur(var(--jd-blur))', WebkitBackdropFilter: 'blur(var(--jd-blur))',
                  border: `1px solid ${p.id === selId ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
                  borderRadius: 'var(--jd-radius)',
                }}
              >
                <EmojiIllo emoji={p.emoji} size={44} ring />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--jd-ink)' }}>
                    {p.label}
                    <span style={{ marginLeft: 8, fontFamily: 'var(--jd-font-mono)', fontSize: 10, fontWeight: 400, color: 'var(--jd-ink-muted)' }}>
                      {p.size}
                    </span>
                  </div>
                  {p.assigned.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                      {p.assigned.map(ap => {
                        const statut = ALL_STATUT_LABELS[ap.effectiveStatus] ?? ALL_STATUT_LABELS.sowed
                        return (
                          <span
                            key={ap.id}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 3,
                              fontSize: 10, fontWeight: 600,
                              padding: '2px 6px', borderRadius: 999,
                              background: 'var(--jd-surface-alt)',
                              color: statut.color,
                            }}
                          >
                            {ap.emoji} {statut.label}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: 'var(--jd-ink-muted)', marginTop: 1 }}>{p.crop}</div>
                  )}
                </div>
                {p.count > 0 && (
                  <div style={{
                    padding: '4px 9px', fontSize: 10, fontFamily: 'var(--jd-font-mono)', fontWeight: 600,
                    background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', borderRadius: 6,
                  }}>
                    {p.count}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
