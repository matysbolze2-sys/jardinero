import { useState, useRef, useCallback } from 'react'
import { snapToGrid, checkCollision, clampPlot, hasCollision } from './gardenUtils'
import { useProfile } from '../../hooks/useProfile'
import { getHistoriqueByPlot, getFamillePlante, FAMILLES_ROTATION, respecteRotation } from '../../data/rotation'

const SCALE    = 60
const MIN_SIZE = 0.5
const SNAP     = 0.5

function makePlot(x, y) {
  return { id: crypto.randomUUID(), x, y, width: 1, height: 1, plants: [], label: '' }
}

function getPlotFill(plotId, historique, selected) {
  if (selected) return 'rgba(180,233,122,0.18)'
  const hist = getHistoriqueByPlot(plotId, historique)
  if (hist.length === 0) return 'url(#plot-soil)'
  const last = hist[0]
  if (!last.plantId) return 'url(#plot-soil)'
  const famille = getFamillePlante(last.plantId)
  if (!famille) return 'url(#plot-soil)'
  const check = respecteRotation(last.plantId, last.harvestedAt)
  if (check.ok) return 'url(#plot-soil)'
  return FAMILLES_ROTATION[famille]?.couleur ?? 'url(#plot-soil)'
}

function getPlotStroke(plotId, historique, selected) {
  const hist = getHistoriqueByPlot(plotId, historique)
  if (hist.length > 0) {
    const last = hist[0]
    if (last.plantId) {
      const famille = getFamillePlante(last.plantId)
      if (famille) {
        const check = respecteRotation(last.plantId, last.harvestedAt)
        if (!check.ok) {
          return FAMILLES_ROTATION[famille]?.couleurBord
            ?? (selected ? 'var(--jd-accent)' : 'var(--jd-accent-ring)')
        }
      }
    }
  }
  return selected ? 'var(--jd-accent)' : 'var(--jd-accent-ring)'
}

function PlotRect({ plot, selected, onSelect, onDrag, onResize, scale }) {
  const { profile } = useProfile()
  const dragStart   = useRef(null)
  const resizeStart = useRef(null)

  const historique     = profile.historique ?? []
  const px = plot.x      * scale
  const py = plot.y      * scale
  const pw = plot.width  * scale
  const ph = plot.height * scale

  const assignedPlants = (plot.plants ?? [])
    .map(id => profile.plants.find(p => p.id === id))
    .filter(Boolean)

  const fill   = getPlotFill(plot.id, historique, selected)
  const stroke = getPlotStroke(plot.id, historique, selected)

  function onPointerDownPlot(e) {
    e.stopPropagation()
    onSelect(plot.id)
    const startX = e.clientX
    const startY = e.clientY
    const origX  = plot.x
    const origY  = plot.y
    dragStart.current = { startX, startY, origX, origY }

    function onMove(ev) {
      if (!dragStart.current) return
      const dx = (ev.clientX - dragStart.current.startX) / scale
      const dy = (ev.clientY - dragStart.current.startY) / scale
      const nx = snapToGrid(dragStart.current.origX + dx, SNAP)
      const ny = snapToGrid(dragStart.current.origY + dy, SNAP)
      onDrag(plot.id, nx, ny)
    }
    function onUp() {
      dragStart.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
  }

  function onPointerDownResize(e) {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const origW  = plot.width
    const origH  = plot.height
    resizeStart.current = { startX, startY, origW, origH }

    function onMove(ev) {
      if (!resizeStart.current) return
      const dw = (ev.clientX - resizeStart.current.startX) / scale
      const dh = (ev.clientY - resizeStart.current.startY) / scale
      const nw = Math.max(MIN_SIZE, snapToGrid(resizeStart.current.origW + dw, SNAP))
      const nh = Math.max(MIN_SIZE, snapToGrid(resizeStart.current.origH + dh, SNAP))
      onResize(plot.id, nw, nh)
    }
    function onUp() {
      resizeStart.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
  }

  return (
    <g>
      <rect
        x={px} y={py} width={pw} height={ph}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={selected ? 2 : 1.5}
        style={{ cursor: 'grab', touchAction: 'none' }}
        onPointerDown={onPointerDownPlot}
      />

      {/* Label */}
      {plot.label && (
        <text
          x={px + pw / 2} y={py + 14}
          textAnchor="middle" fontSize={10} fill="var(--jd-accent)"
          style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: 600 }}
        >
          {plot.label}
        </text>
      )}

      {/* Plantes assignées */}
      {assignedPlants.slice(0, 4).map((p, i) => (
        <text
          key={p.id}
          x={px + 8 + (i % 2) * 18}
          y={py + ph - 8 - Math.floor(i / 2) * 18}
          fontSize={14}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {p.emoji}
        </text>
      ))}

      {/* Dimensions */}
      <text
        x={px + pw / 2} y={py + ph / 2 + (plot.label ? 6 : 4)}
        textAnchor="middle" fontSize={9} fill="var(--jd-ink-muted)"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {plot.width}×{plot.height}m
      </text>

      {/* Poignée de redimensionnement — pastille var(--jd-accent) */}
      {selected && (
        <circle
          cx={px + pw - 6}
          cy={py + ph - 6}
          r={6}
          fill="var(--jd-accent)"
          style={{ cursor: 'se-resize', touchAction: 'none' }}
          onPointerDown={onPointerDownResize}
        />
      )}
    </g>
  )
}

function RotationTooltip({ plotId, historique }) {
  const hist = getHistoriqueByPlot(plotId, historique)
  if (hist.length === 0) return null
  const last = hist[0]
  if (!last.plantId) return null
  const famille = getFamillePlante(last.plantId)
  const check   = famille ? respecteRotation(last.plantId, last.harvestedAt) : { ok: true }
  const famInfo = famille ? FAMILLES_ROTATION[famille] : null

  const dateStr = last.harvestedAt
    ? new Date(last.harvestedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div
      className="mt-1 rounded-lg px-3 py-2 text-xs"
      style={{
        background: check.ok ? 'var(--jd-accent-soft)' : (famInfo?.couleur ?? 'var(--jd-warning-soft)'),
        border:     `1px solid ${check.ok ? 'var(--jd-accent-ring)' : (famInfo?.couleurBord ?? 'var(--jd-warning-ring)')}`,
        color:      check.ok ? 'var(--jd-accent)' : 'var(--jd-warning)',
      }}
    >
      <p>
        <strong>Dernière culture :</strong> {last.emoji} {last.name}
        {famille && <span style={{ opacity: 0.7 }}> ({famille})</span>}
        {' — '} récolté {dateStr}
      </p>
      {!check.ok && (
        <p className="mt-0.5" style={{ color: 'var(--jd-warning)' }}>
          ⏳ {famille} déconseillé{famInfo ? '' : 'es'} encore {check.moisRestants} mois
          {check.dateAutorisee && ` (jusqu'à ${new Date(check.dateAutorisee).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })})`}
        </p>
      )}
      {check.ok && (
        <p className="mt-0.5" style={{ opacity: 0.7 }}>✓ Rotation respectée — libre à planter</p>
      )}
    </div>
  )
}

export default function PlotEditor({ garden, onSave, onBack }) {
  const { profile }              = useProfile()
  const [plots,    setPlots]     = useState(garden?.plots ?? [])
  const [selected, setSelected]  = useState(null)
  const svgRef = useRef(null)

  const historique   = profile.historique ?? []
  const gw = garden.width  * SCALE
  const gh = garden.height * SCALE

  const selectedPlot = plots.find(p => p.id === selected) ?? null

  function handleSvgClick(e) {
    if (e.target === svgRef.current) setSelected(null)
  }

  function handleAddPlot(e) {
    if (e.target !== svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x    = snapToGrid((e.clientX - rect.left) / SCALE, SNAP)
    const y    = snapToGrid((e.clientY - rect.top)  / SCALE, SNAP)
    const newPlot = makePlot(
      Math.max(0, Math.min(x, garden.width  - 1)),
      Math.max(0, Math.min(y, garden.height - 1)),
    )
    setPlots(prev => [...prev, newPlot])
    setSelected(newPlot.id)
  }

  const handleDrag = useCallback((plotId, nx, ny) => {
    setPlots(prev => {
      const updated   = prev.map(p => p.id === plotId ? { ...p, x: nx, y: ny } : p)
      const candidate = updated.find(p => p.id === plotId)
      const clamped   = clampPlot(candidate, garden.width, garden.height)
      if (hasCollision(clamped, updated)) return prev
      return updated.map(p => p.id === plotId ? clamped : p)
    })
  }, [garden.width, garden.height])

  const handleResize = useCallback((plotId, nw, nh) => {
    setPlots(prev => {
      const updated   = prev.map(p => p.id === plotId ? { ...p, width: nw, height: nh } : p)
      const candidate = updated.find(p => p.id === plotId)
      const clamped   = clampPlot(candidate, garden.width, garden.height)
      if (hasCollision(clamped, updated)) return prev
      return updated.map(p => p.id === plotId ? clamped : p)
    })
  }, [garden.width, garden.height])

  function handleDelete() {
    setPlots(prev => prev.filter(p => p.id !== selected))
    setSelected(null)
  }

  function handleLabelChange(val) {
    setPlots(prev => prev.map(p => p.id === selected ? { ...p, label: val.slice(0, 20) } : p))
  }

  function handleSave() {
    onSave({ plots })
  }

  return (
    <div className="flex flex-col gap-0 h-full">

      {/* Barre de navigation */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--jd-border)' }}
      >
        <button
          onClick={onBack}
          className="text-sm font-medium tap-scale"
          style={{ color: 'var(--jd-ink-muted)' }}
        >
          ← Dimensions
        </button>
        <h2 className="jd-title" style={{ fontSize: 15, color: 'var(--jd-ink)' }}>Parcelles</h2>
        <button
          onClick={handleSave}
          className="text-sm font-semibold px-3 py-1 rounded-chip tap-scale"
          style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
        >
          Suivant →
        </button>
      </div>

      <p className="text-xs text-center py-2" style={{ color: 'var(--jd-ink-muted)' }}>
        Double-clic sur le sol pour ajouter une parcelle. Glisse pour déplacer.
      </p>

      {/* Canvas SVG */}
      <div className="overflow-auto flex-1 flex items-start justify-center p-4">
        <svg
          ref={svgRef}
          width={gw} height={gh}
          style={{
            background:   'var(--jd-bg)',
            border:       '1.5px solid var(--jd-accent-ring)',
            borderRadius: 8,
            cursor:       'crosshair',
            touchAction:  'none',
            display:      'block',
          }}
          onClick={handleSvgClick}
          onDoubleClick={handleAddPlot}
        >
          <defs>
            {/* Sol sombre radial — inspiré de jd3d-soil dans GardenView3D */}
            <radialGradient id="plot-soil" cx="50%" cy="50%" r="70%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#253d2a" />
              <stop offset="100%" stopColor="#172a1c" />
            </radialGradient>
          </defs>

          {/* Grille */}
          {Array.from({ length: Math.floor(garden.width  / SNAP) + 1 }, (_, i) => (
            <line key={`v${i}`} x1={i*SNAP*SCALE} y1={0} x2={i*SNAP*SCALE} y2={gh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
          ))}
          {Array.from({ length: Math.floor(garden.height / SNAP) + 1 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i*SNAP*SCALE} x2={gw} y2={i*SNAP*SCALE} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
          ))}

          {plots.map(plot => (
            <PlotRect
              key={plot.id}
              plot={plot}
              selected={selected === plot.id}
              gardenWidth={garden.width}
              gardenHeight={garden.height}
              scale={SCALE}
              onSelect={setSelected}
              onDrag={handleDrag}
              onResize={handleResize}
            />
          ))}
        </svg>
      </div>

      {/* Toolbar parcelle sélectionnée */}
      {selectedPlot && (
        <div
          className="px-4 py-3 flex flex-col gap-2"
          style={{ background: 'var(--jd-surface-alt)', borderTop: '1px solid var(--jd-border)' }}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nom de la parcelle…"
              value={selectedPlot.label}
              onChange={e => handleLabelChange(e.target.value)}
              className="flex-1 text-sm px-3 py-1.5 rounded-chip outline-none"
              style={{
                border:     '1px solid var(--jd-border)',
                background: 'var(--jd-surface)',
                color:      'var(--jd-ink)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--jd-accent-ring)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--jd-border)')}
            />
            <button
              onClick={handleDelete}
              className="text-sm px-3 py-1.5 rounded-chip font-medium tap-scale"
              style={{ background: 'var(--jd-harvest-soft)', color: 'var(--jd-harvest)', border: '1px solid var(--jd-harvest-ring)' }}
            >
              Supprimer
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            {selectedPlot.width} × {selectedPlot.height} m — {(selectedPlot.width * selectedPlot.height).toFixed(1)} m²
          </p>
          <RotationTooltip plotId={selectedPlot.id} historique={historique} />
        </div>
      )}

      {/* Pas de parcelle sélectionnée — bouton ajout */}
      {!selectedPlot && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--jd-border)' }}>
          <button
            onClick={() => {
              const newPlot = makePlot(0, 0)
              setPlots(prev => [...prev, newPlot])
              setSelected(newPlot.id)
            }}
            className="w-full py-2.5 rounded-card text-sm font-semibold tap-scale"
            style={{
              background: 'var(--jd-surface-alt)',
              color:      'var(--jd-accent)',
              border:     '1px dashed var(--jd-accent-ring)',
            }}
          >
            + Ajouter une parcelle
          </button>
        </div>
      )}
    </div>
  )
}
