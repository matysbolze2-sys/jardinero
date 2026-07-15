import { GARDEN_TEMPLATES, getTemplatePlants } from '../data/gardenTemplates'

// Liste présentationnelle des templates de jardin, réutilisée par l'onboarding
// (StepTemplate) et par l'état vide de Mon Jardin (TemplatePicker).
// onPick(templateId) est appelé au tap ; busyId désactive la carte en cours d'ajout.

function TemplateCard({ template, onPick, busy, disabled }) {
  const apercu = getTemplatePlants(template) // emojis des plantes (ids invalides déjà filtrés)

  return (
    <button
      onClick={() => onPick(template.id)}
      disabled={disabled}
      className="w-full text-left rounded-card p-4 tap-scale transition-all"
      style={{
        background: 'var(--jd-surface-alt)',
        border:     '1px solid var(--jd-border)',
        opacity:    disabled && !busy ? 0.5 : 1,
        cursor:     disabled ? 'default' : 'pointer',
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{template.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>{template.nom}</p>
            {template.container && (
              <span className="jd-chip" style={{ fontSize: 9, padding: '2px 6px', color: 'var(--jd-ink-muted)', background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}>
                🪴 en pot
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--jd-ink-muted)' }}>
            {template.description}
          </p>
        </div>
        {busy && (
          <span style={{ fontSize: 18, animation: 'spin-star 1s linear infinite', display: 'inline-block', flexShrink: 0 }}>⟳</span>
        )}
      </div>

      {/* Aperçu des plantes */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {apercu.map(p => (
          <span key={p.id} style={{ fontSize: 18, lineHeight: 1 }} title={p.name}>{p.emoji}</span>
        ))}
        <span className="text-xs ml-1" style={{ color: 'var(--jd-ink-muted)' }}>
          {apercu.length} plante{apercu.length > 1 ? 's' : ''}
        </span>
      </div>
    </button>
  )
}

export default function GardenTemplateList({ onPick, busyId = null }) {
  const busy = busyId != null
  return (
    <div className="flex flex-col gap-3">
      {GARDEN_TEMPLATES.map(t => (
        <TemplateCard
          key={t.id}
          template={t}
          onPick={onPick}
          busy={busyId === t.id}
          disabled={busy}
        />
      ))}
    </div>
  )
}
