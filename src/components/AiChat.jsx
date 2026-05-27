import { useState, useRef, useEffect } from 'react'
import { useGeminiChat } from '../hooks/useGemini'

export default function AiChat({ profile, regionOffset, initialMessage }) {
  const { history, loading, remaining, max, sendMessage } = useGeminiChat(profile, regionOffset)
  const [input, setInput] = useState('')
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

      {/* En-tête avec compteur */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="jd-kicker">💬 Pose ta question</div>
        <span style={{
          fontSize:   'var(--jd-text-xs)',
          color:      remaining <= 3 ? 'var(--jd-warning)' : 'var(--jd-ink-muted)',
          fontFamily: 'var(--jd-font-mono)',
        }}>
          {remaining}/{max} restants
        </span>
      </div>

      {/* Historique */}
      {history.length > 0 && (
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           'var(--jd-space-3)',
          maxHeight:     400,
          overflowY:     'auto',
          padding:       'var(--jd-space-2)',
        }}>
          {history.map((msg, i) => (
            <div key={i}>
              {/* Message utilisateur */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--jd-space-2)' }}>
                <div style={{
                  background:   'var(--jd-accent)',
                  color:        'var(--jd-accent-ink)',
                  borderRadius: '18px 18px 4px 18px',
                  padding:      '10px 14px',
                  maxWidth:     '80%',
                  fontSize:     'var(--jd-text-md)',
                  fontWeight:   500,
                  lineHeight:   1.4,
                }}>
                  {msg.user}
                </div>
              </div>

              {/* Réponse IA */}
              {msg.assistant !== null ? (
                <div style={{ display: 'flex', gap: 'var(--jd-space-2)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>🌱</span>
                  <div style={{
                    background:   'var(--jd-surface)',
                    border:       '1px solid var(--jd-border)',
                    borderRadius: '4px 18px 18px 18px',
                    padding:      '10px 14px',
                    maxWidth:     '85%',
                    fontSize:     'var(--jd-text-md)',
                    color:        'var(--jd-ink)',
                    lineHeight:   1.5,
                    whiteSpace:   'pre-wrap',
                  }}>
                    {msg.assistant}
                  </div>
                </div>
              ) : loading && i === history.length - 1 ? (
                <div style={{ display: 'flex', gap: 'var(--jd-space-2)', alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>🌱</span>
                  <div style={{
                    background:   'var(--jd-surface)',
                    border:       '1px solid var(--jd-border)',
                    borderRadius: '4px 18px 18px 18px',
                    padding:      '10px 14px',
                    color:        'var(--jd-ink-muted)',
                    fontSize:     'var(--jd-text-md)',
                  }}>
                    …
                  </div>
                </div>
              ) : null}
            </div>
          ))}
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
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Une question sur ton jardin…"
            rows={2}
            style={{
              flex:        1,
              background:  'var(--jd-surface)',
              border:      '1px solid var(--jd-border)',
              borderRadius:'var(--jd-radius-sm)',
              padding:     '10px 14px',
              fontSize:    'var(--jd-text-md)',
              color:       'var(--jd-ink)',
              resize:      'none',
              outline:     'none',
              fontFamily:  'var(--jd-font-sans)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{
              background:   input.trim() && !loading ? 'var(--jd-accent)' : 'var(--jd-surface)',
              color:        input.trim() && !loading ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
              border:       'none',
              borderRadius: 'var(--jd-radius-sm)',
              padding:      '8px 16px',
              fontWeight:   600,
              fontSize:     'var(--jd-text-sm)',
              cursor:       input.trim() && !loading ? 'pointer' : 'default',
              alignSelf:    'stretch',
              fontFamily:   'var(--jd-font-sans)',
            }}
          >
            {loading ? '…' : '→'}
          </button>
        </div>
      ) : (
        <div style={{
          textAlign:    'center',
          fontSize:     'var(--jd-text-sm)',
          color:        'var(--jd-ink-muted)',
          padding:      'var(--jd-space-4)',
          background:   'var(--jd-surface)',
          borderRadius: 'var(--jd-radius-sm)',
        }}>
          Tu as utilisé tes {max} messages d'aujourd'hui. Reviens demain ! 🌱
        </div>
      )}
    </div>
  )
}
