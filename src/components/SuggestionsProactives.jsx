export default function SuggestionsProactives({ suggestions, loading, onSuggestionClick }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--jd-space-2)' }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            height: 48,
            background: 'var(--jd-surface)',
            borderRadius: 'var(--jd-radius-sm)',
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  )

  if (!suggestions.length) return null

  return (
    <div>
      <div className="jd-kicker" style={{ marginBottom: 'var(--jd-space-2)' }}>
        💡 Suggestions du jour
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--jd-space-2)' }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s)}
            className="tap-scale"
            style={{
              background:   'var(--jd-surface)',
              border:       '1px solid var(--jd-border)',
              borderRadius: 'var(--jd-radius-sm)',
              padding:      '12px 16px',
              textAlign:    'left',
              cursor:       'pointer',
              fontSize:     'var(--jd-text-sm)',
              color:        'var(--jd-ink)',
              lineHeight:   1.4,
              width:        '100%',
              fontFamily:   'var(--jd-font-sans)',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
