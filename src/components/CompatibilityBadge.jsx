import { useState } from 'react'
import { getConflictLevel } from '../data/associations'

export default function CompatibilityBadge({ plantId, gardenPlants = [], size = 'sm' }) {
  const [open, setOpen] = useState(false)
  if (!plantId) return null

  const conflicts = gardenPlants
    .filter(p => p.plantId && p.plantId !== plantId)
    .map(p => ({ plant: p, level: getConflictLevel(plantId, p.plantId) }))
    .filter(c => c.level !== null)

  if (conflicts.length === 0) return null

  const hasFort = conflicts.some(c => c.level === 'forte')
  const icon    = hasFort ? '🚫' : '⚠️'
  const label   = hasFort ? 'Conflit' : 'Attention'
  const color   = hasFort ? 'var(--jd-harvest)' : 'var(--jd-warning)'
  const bg      = hasFort ? 'var(--jd-harvest-soft)' : 'var(--jd-warning-soft)'
  const border  = hasFort ? 'var(--jd-harvest-ring)' : 'var(--jd-warning-ring)'

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        className="jd-chip tap-scale"
        style={{
          background:  bg,
          color,
          borderColor: border,
          fontSize:    size === 'sm' ? 10 : 12,
          padding:     size === 'sm' ? '2px 8px' : '4px 10px',
          cursor:      'pointer',
        }}
      >
        {icon} {label}
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
            onClick={e => { e.stopPropagation(); setOpen(false) }}
          />
          <div
            onClick={e => e.stopPropagation()}
            className="jd-card"
            style={{
              position:  'absolute',
              bottom:    'calc(100% + 6px)',
              left:      0,
              zIndex:    200,
              padding:   '10px 12px',
              minWidth:  200,
              boxShadow: '0 4px 24px rgba(0,0,0,0.55)',
              textAlign: 'left',
            }}
          >
            {conflicts.map((c, i) => (
              <p
                key={i}
                className="text-xs"
                style={{ margin: i > 0 ? '5px 0 0' : 0, color: 'var(--jd-ink)', lineHeight: 1.5 }}
              >
                <strong>{c.plant.name}</strong>
                <span style={{ color: 'var(--jd-ink-muted)' }}>
                  {' — '}{c.level === 'forte' ? 'Conflit fort' : 'Conflit modéré'}
                </span>
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
