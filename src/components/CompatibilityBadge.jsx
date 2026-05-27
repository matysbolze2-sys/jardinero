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

  const hasFort   = conflicts.some(c => c.level === 'forte')
  const icon      = hasFort ? '🚫' : '⚠️'
  const label     = hasFort ? 'Conflit' : 'Attention'
  const color     = hasFort ? '#E05A3A' : '#f0b86c'
  const bg        = hasFort ? 'rgba(224,90,58,0.1)' : 'rgba(240,184,108,0.1)'
  const border    = hasFort ? 'rgba(224,90,58,0.25)' : 'rgba(240,184,108,0.25)'

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        style={{
          fontSize:    size === 'sm' ? 10 : 11,
          padding:     size === 'sm' ? '2px 6px' : '3px 8px',
          borderRadius: 999,
          background:  bg,
          color,
          border:      `1px solid ${border}`,
          fontWeight:  600,
          fontFamily:  'var(--jd-font-body)',
          cursor:      'pointer',
          lineHeight:  1,
        }}
      >
        {icon} {label}
      </button>

      {open && (
        <>
          {/* Dismiss overlay */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
            onClick={e => { e.stopPropagation(); setOpen(false) }}
          />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position:  'absolute',
              bottom:    'calc(100% + 4px)',
              left:      0,
              zIndex:    200,
              background:'var(--jd-surface)',
              border:    '1px solid var(--jd-border)',
              borderRadius: 10,
              padding:   '8px 10px',
              minWidth:  190,
              fontSize:  11,
              color:     'var(--jd-ink)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              textAlign: 'left',
            }}
          >
            {conflicts.map((c, i) => (
              <p key={i} style={{ margin: i > 0 ? '4px 0 0' : 0, lineHeight: 1.4 }}>
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
