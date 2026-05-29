import EmojiIllo from './EmojiIllo'
import CompatibilityBadge from './CompatibilityBadge'
import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getEffectiveStatus, getCycleProgress, ALL_STATUT_LABELS } from '../utils/plantStatusUtils'

export default function PlantCard({ plant, onOpenDetail }) {
  const { profile } = useProfile()
  const regionOffset = getRegionById(profile.region)?.offset ?? 0

  const effectiveStatus  = getEffectiveStatus(plant, regionOffset)
  const progress         = getCycleProgress(plant, regionOffset)
  const statut           = ALL_STATUT_LABELS[effectiveStatus] ?? ALL_STATUT_LABELS.sowed
  const isManual         = plant.statusOverride != null

  const otherPlants      = (profile.plants ?? []).filter(p => p.id !== plant.id)

  const daysSincePlanted = plant.plantedAt
    ? Math.floor((Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000)
    : null

  return (
    <button
      onClick={() => onOpenDetail(plant, 'infos')}
      className="w-full text-left card-hover tap-scale"
      style={{
        background:           'var(--jd-surface-glass)',
        backdropFilter:       'blur(var(--jd-blur))',
        WebkitBackdropFilter: 'blur(var(--jd-blur))',
        border:               '1px solid var(--jd-border)',
        borderRadius:         'var(--jd-radius)',
        padding:              12,
        display:              'flex',
        gap:                  14,
        alignItems:           'center',
      }}
    >
      <EmojiIllo emoji={plant.emoji} size={56} ring />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-baseline justify-between">
          <p
            className="font-bold text-sm leading-snug"
            style={{ color: 'var(--jd-ink)', letterSpacing: '-0.01em', fontSize: 15 }}
          >
            {plant.name}
          </p>
          {daysSincePlanted !== null && (
            <span style={{ fontSize: 10, color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)', flexShrink: 0 }}>
              J+{daysSincePlanted}
            </span>
          )}
        </div>

        {plant.variety && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)', fontSize: 10.5 }}>{plant.variety}</p>
        )}

        {/* Progress bar */}
        <div className="rounded-full mt-2 overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
          {progress > 0 ? (
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: statut.color }}
            />
          ) : (
            // Perennial or no data: solid color band showing current state
            <div className="h-full rounded-full" style={{ width: '100%', background: statut.color + '66' }} />
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              className="jd-chip"
              style={{
                background: statut.color + '22',
                color:      statut.color,
                border:     `1px solid ${statut.color}44`,
                fontSize: 10,
                padding: '3px 8px',
              }}
            >
              {statut.label}
            </span>
            <CompatibilityBadge plantId={plant.plantId} gardenPlants={otherPlants} size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isManual && (
              <span style={{ fontSize: 9, fontFamily: 'var(--jd-font-mono)', color: 'var(--jd-ink-muted)' }}>
                Manuel
              </span>
            )}
            <span style={{ fontSize: 10, color: 'var(--jd-ink-muted)' }}>Toucher →</span>
          </div>
        </div>
      </div>
    </button>
  )
}

