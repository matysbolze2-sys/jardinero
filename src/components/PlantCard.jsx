import EmojiIllo from './EmojiIllo'
import CompatibilityBadge from './CompatibilityBadge'
import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getEffectiveStatus, getCycleProgress, ALL_STATUT_LABELS } from '../utils/plantStatusUtils'

// Badge colors per growth stage — mapped to design tokens
const BADGE = {
  sowed:               { color: 'var(--jd-badge-sowed)',              soft: 'var(--jd-badge-sowed-soft)',              ring: 'var(--jd-badge-sowed-ring)' },
  growing:             { color: 'var(--jd-badge-growing)',            soft: 'var(--jd-badge-growing-soft)',            ring: 'var(--jd-badge-growing-ring)' },
  flowering:           { color: 'var(--jd-warning)',                  soft: 'var(--jd-warning-soft)',                  ring: 'var(--jd-warning-ring)' },
  ready:               { color: 'var(--jd-harvest)',                  soft: 'var(--jd-harvest-soft)',                  ring: 'var(--jd-harvest-ring)' },
  perennial_dormant:   { color: 'var(--jd-stage-perennial-dormant)',   soft: 'rgba(128,149,168,0.14)', ring: 'rgba(128,149,168,0.30)' },
  perennial_growing:   { color: 'var(--jd-stage-perennial-growing)',   soft: 'rgba(109,186,120,0.14)', ring: 'rgba(109,186,120,0.30)' },
  perennial_producing: { color: 'var(--jd-stage-perennial-producing)', soft: 'rgba(232,160,64,0.14)',  ring: 'rgba(232,160,64,0.30)' },
  perennial_longcycle: { color: 'var(--jd-stage-perennial-longcycle)', soft: 'rgba(157,168,168,0.14)', ring: 'rgba(157,168,168,0.30)' },
}

export default function PlantCard({ plant, onOpenDetail }) {
  const { profile } = useProfile()
  const regionOffset = getRegionById(profile.region)?.offset ?? 0

  const effectiveStatus = getEffectiveStatus(plant, regionOffset)
  const progress        = getCycleProgress(plant, regionOffset)
  const statut          = ALL_STATUT_LABELS[effectiveStatus] ?? ALL_STATUT_LABELS.sowed
  const badge           = BADGE[effectiveStatus] ?? BADGE.sowed
  const isManual        = plant.statusOverride != null

  const otherPlants = (profile.plants ?? []).filter(p => p.id !== plant.id)

  const daysSincePlanted = plant.plantedAt
    ? Math.floor((Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000)
    : null

  return (
    <button
      onClick={() => onOpenDetail(plant, 'infos')}
      className="w-full text-left glass-card card-hover tap-scale flex items-center"
      style={{ padding: 12, gap: 14 }}
    >
      <EmojiIllo emoji={plant.emoji} size={56} ring />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Nom + jours */}
        <div className="flex items-baseline justify-between">
          <p
            className="font-bold leading-snug"
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
          <p className="mt-0.5" style={{ color: 'var(--jd-ink-muted)', fontSize: 10.5 }}>{plant.variety}</p>
        )}

        {/* Barre de progression dans la couleur du stade */}
        <div className="rounded-full mt-2 overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
          {progress > 0 ? (
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: badge.color }}
            />
          ) : (
            <div className="h-full rounded-full" style={{ width: '100%', background: badge.soft }} />
          )}
        </div>

        {/* Badge stade + compatibilité */}
        <div className="flex items-center justify-between mt-1.5">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              className="jd-chip"
              style={{
                background: badge.soft,
                color:      badge.color,
                border:     `1px solid ${badge.ring}`,
                fontSize:   10,
                padding:    '3px 8px',
              }}
            >
              {statut.label}
            </span>
            {plant.container && (
              <span
                className="jd-chip"
                title="Culture en pot"
                style={{
                  background: 'var(--jd-surface-alt)',
                  color:      'var(--jd-ink-muted)',
                  border:     '1px solid var(--jd-border)',
                  fontSize:   10,
                  padding:    '3px 7px',
                }}
              >
                🪴 Pot
              </span>
            )}
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
