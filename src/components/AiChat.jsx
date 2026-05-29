import { useState, useRef, useEffect } from 'react'
import { useGeminiChat } from '../hooks/useGemini'

// ── Indicateur "en train d'écrire" ─────────────────────────────────────────────
// 3 points qui rebondissent séquentiellement en var(--jd-accent)

function TypingIndicator() {
  return (
    <>
      <style>{`
        @keyframes jd-typing-dot {
          0%, 70%, 100% { transform: translateY(0);   opacity: 0.3; }
          35%            { transform: translateY(-4px); opacity: 1;   }
        }
      `}</style>
      <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', padding: '3px 0' }}>
        {[0, 1, 2].map(n => (
          <span
            key={n}
            style={{
              width:          7,
              height:         7,
              borderRadius:   '50%',
              background:     'var(--jd-accent)',
              display:        'inline-block',
              animation:      'jd-typing-dot 1.1s var(--jd-ease-soft, cubic-bezier(0.25,0.46,0.45,0.94)) infinite',
              animationDelay: `${n * 0.18}s`,
            }}
          />
        ))}
      </span>
    </>
  )
}

// ── BulleUtilisateur ───────────────────────────────────────────────────────────

function BulleUtilisateur({ text, delay }) {
  return (
    <div
      className="flex justify-end fade-in"
      style={{ animationDelay: `${delay}ms`, marginBottom: 'var(--jd-space-2)' }}
    >
      <div
        style={{
          background:   'var(--jd-accent)',
          color:        'var(--jd-accent-ink)',
          borderRadius: '18px 18px 4px 18px',
          padding:      '10px 14px',
          maxWidth:     '80%',
          fontSize:     'var(--jd-text-md)',
          fontWeight:   500,
          lineHeight:   1.4,
        }}
      >
        {text}
      </div>
    </div>
  )
}

// ── BulleIA ────────────────────────────────────────────────────────────────────

function BulleIA({ text, delay, isTyping = false }) {
  return (
    <div
      className="flex gap-2 items-start fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>🌱</span>
      <div
        className="glass-card"
        style={{
          borderRadius: '4px 18px 18px 18px',
          padding:      '10px 14px',
          maxWidth:     '85%',
          fontSize:     'var(--jd-text-md)',
          color:        'var(--jd-ink)',
          lineHeight:   1.5,
          whiteSpace:   'pre-wrap',
        }}
      >
        {isTyping ? <TypingIndicator /> : text}
      </div>
    </div>
  )
}

// ── AiChat ─────────────────────────────────────────────────────────────────────

export default function AiChat({ profile, regionOffset, initialMessage }) {
  const { history, loading, remaining, max, sendMessage } = useGeminiChat(profile, regionOffset)
  const [input,   setInput]   = useState('')
  const [focused, setFocused] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    if (initialMessage) sendMessage(initialMessage)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const handleSend = () => {
    if (!input.trim() || loading || remaining <= 0) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--jd-space-4)' }}>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="jd-kicker">💬 Pose ta question</div>
        <span
          style={{
            fontSize:   'var(--jd-text-xs)',
            color:      remaining <= 3 ? 'var(--jd-warning)' : 'var(--jd-ink-muted)',
            fontFamily: 'var(--jd-font-mono)',
          }}
        >
          {remaining}/{max} restants
        </span>
      </div>

      {/* Historique des messages */}
      {history.length > 0 && (
        <div
          className="hide-scrollbar"
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           'var(--jd-space-2)',
            maxHeight:     400,
            overflowY:     'auto',
            padding:       'var(--jd-space-1)',
          }}
        >
          {history.map((msg, i) => {
            const baseDelay = 0 // already entered, no stagger on old messages
            return (
              <div key={i}>
                <BulleUtilisateur text={msg.user} delay={baseDelay} />
                {msg.assistant !== null ? (
                  <BulleIA text={msg.assistant} delay={baseDelay} />
                ) : loading && i === history.length - 1 ? (
                  <BulleIA text="" delay={baseDelay} isTyping />
                ) : null}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Zone de saisie */}
      {remaining > 0 ? (
        <div style={{ display: 'flex', gap: 'var(--jd-space-2)', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Une question sur ton jardin…"
            rows={2}
            style={{
              flex:         1,
              background:   'var(--jd-surface)',
              border:       `1px solid ${focused ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
              borderRadius: 'var(--jd-radius-sm)',
              padding:      '10px 14px',
              fontSize:     'var(--jd-text-md)',
              color:        'var(--jd-ink)',
              resize:       'none',
              outline:      'none',
              fontFamily:   'var(--jd-font-sans)',
              transition:   `border-color var(--jd-dur-fast) var(--jd-ease-soft)`,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="tap-scale"
            style={{
              background:   input.trim() && !loading ? 'var(--jd-accent)' : 'var(--jd-surface-alt)',
              color:        input.trim() && !loading ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
              border:       'none',
              borderRadius: 'var(--jd-radius-sm)',
              padding:      '0 18px',
              fontWeight:   700,
              fontSize:     18,
              cursor:       input.trim() && !loading ? 'pointer' : 'default',
              alignSelf:    'stretch',
              fontFamily:   'var(--jd-font-sans)',
              transition:   `background var(--jd-dur-fast) var(--jd-ease-soft), color var(--jd-dur-fast) var(--jd-ease-soft)`,
              minWidth:     48,
            }}
          >
            {loading ? '…' : '→'}
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign:    'center',
            fontSize:     'var(--jd-text-sm)',
            color:        'var(--jd-ink-muted)',
            padding:      'var(--jd-space-4)',
            background:   'var(--jd-surface)',
            borderRadius: 'var(--jd-radius-sm)',
          }}
        >
          Tu as utilisé tes {max} messages d'aujourd'hui. Reviens demain ! 🌱
        </div>
      )}
    </div>
  )
}
