import EmojiIllo from './EmojiIllo'

export default function SuggestionsProactives({ suggestions, loading, onSuggestionClick }) {
  if (loading) return (
    <div className="flex flex-col" style={{ gap: 'var(--jd-space-2)' }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            height:       56,
            background:   'var(--jd-accent-soft)',
            border:       '1px solid var(--jd-accent-ring)',
            borderRadius: 'var(--jd-radius-sm)',
            opacity:      0.25,
          }}
        />
      ))}
    </div>
  )

  if (!suggestions.length) return null

  return (
    <div>
      {/* Kicker mono + icône */}
      <div className="flex items-center gap-2 mb-2">
        <EmojiIllo emoji="💡" size={24} ring={false} />
        <span className="jd-kicker">Suggestions du jour</span>
      </div>

      <div className="flex flex-col" style={{ gap: 'var(--jd-space-2)' }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s)}
            className="tap-scale fade-in flex items-start gap-3 text-left w-full"
            style={{
              background:    'var(--jd-accent-soft)',
              border:        '1px solid var(--jd-accent-ring)',
              borderRadius:  'var(--jd-radius-sm)',
              padding:       '12px 14px',
              cursor:        'pointer',
              animationDelay: `${i * 80}ms`,
            }}
          >
            <EmojiIllo emoji="🌿" size={28} ring={false} />
            <span
              style={{
                fontSize:   'var(--jd-text-sm)',
                color:      'var(--jd-ink)',
                lineHeight: 1.45,
                fontFamily: 'var(--jd-font-sans)',
                paddingTop: 2,
              }}
            >
              {s}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
