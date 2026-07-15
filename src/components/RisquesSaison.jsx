import { useState } from 'react'
import { getRisquesActifs, GRAVITE_LABEL } from '../data/ravageursSaison'
import { MOIS_LABELS } from '../data/plants'

// ── RisqueCard ───────────────────────────────────────────────────────────────
// Compacte par défaut, s'étend au tap pour révéler signes + prévention en entier.

function RisqueCard({ risque, plantesTouchees }) {
  const [expanded, setExpanded] = useState(false)
  const forte = risque.gravite === 'forte'

  // Emojis uniques des plantes du jardin concernées ("touche : 🍅 🥔")
  const emojisTouches = [...new Set(plantesTouchees.map(p => p.emoji))]

  const theme = forte
    ? { color: 'var(--jd-harvest)', badge: 'var(--jd-harvest-soft)' }
    : { color: 'var(--jd-warning)', badge: 'var(--jd-warning-soft)' }

  return (
    <div
      className="rounded-card mb-3 overflow-hidden"
      style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4 tap-scale"
        style={{ background: 'transparent' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{risque.emoji}</span>
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--jd-ink)' }}>
              {risque.nom}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-chip flex-shrink-0"
              style={{ background: theme.badge, color: theme.color }}
            >
              {GRAVITE_LABEL[risque.gravite]}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>touche</span>
            {emojisTouches.map((e, i) => (
              <span key={i} style={{ fontSize: 15, lineHeight: 1 }}>{e}</span>
            ))}
          </div>
        </div>

        {!expanded && (
          <p
            className="text-xs mt-2 leading-relaxed"
            style={{ color: 'var(--jd-ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {risque.prevention}
          </p>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-xs font-semibold mb-1" style={{ color: theme.color }}>Signes à repérer</p>
          <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--jd-ink)' }}>
            {risque.signes}
          </p>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--jd-accent)' }}>Prévention</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--jd-ink)' }}>
            {risque.prevention}
          </p>
        </div>
      )}
    </div>
  )
}

// ── RisquesSaison ────────────────────────────────────────────────────────────
// N'affiche rien si aucun risque actif ce mois pour les plantes du jardin.

export default function RisquesSaison({ plants }) {
  const actifs = getRisquesActifs(plants)
  if (actifs.length === 0) return null

  const moisIdx = new Date().getMonth()

  return (
    <div className="mb-5">
      <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--jd-accent)' }}>
        🛡️ À surveiller en {MOIS_LABELS[moisIdx].toLowerCase()}
      </h2>
      {actifs.map(({ risque, plantesTouchees }) => (
        <RisqueCard key={risque.id} risque={risque} plantesTouchees={plantesTouchees} />
      ))}
    </div>
  )
}
