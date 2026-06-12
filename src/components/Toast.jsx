import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans un ToastProvider')
  return ctx
}

const ICONS = {
  success: { glyph: '✓', color: 'var(--jd-accent)' },
  warning: { glyph: '⚠', color: 'var(--jd-warning)' },
}

// Provider monté une fois (App.jsx). Expose toast(message, type).
// Un seul toast à la fois, disparition auto après 2,5 s.
export function ToastProvider({ children }) {
  const [current, setCurrent] = useState(null) // { id, message, type, leaving }
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const toast = useCallback((message, type = 'success') => {
    clearTimers()
    const id = Date.now()
    setCurrent({ id, message, type, leaving: false })

    // Sortie après 2,5 s, puis retrait du DOM après l'animation
    timers.current.push(setTimeout(() => {
      setCurrent(c => (c && c.id === id ? { ...c, leaving: true } : c))
      timers.current.push(setTimeout(() => {
        setCurrent(c => (c && c.id === id ? null : c))
      }, 220))
    }, 2500))
  }, [])

  const cfg = current ? (ICONS[current.type] ?? ICONS.success) : null

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {current && (
        <div
          role="status"
          aria-live="polite"
          className={current.leaving ? 'jd-toast jd-toast--leaving' : 'jd-toast'}
          style={{
            position:     'fixed',
            left:         '50%',
            bottom:       'calc(80px + env(safe-area-inset-bottom))',
            zIndex:       90,
            display:      'flex',
            alignItems:   'center',
            gap:          8,
            maxWidth:     'calc(100vw - 32px)',
            padding:      '10px 16px',
            background:   'var(--jd-surface)',
            border:       '1px solid var(--jd-border)',
            borderRadius: 'var(--jd-radius-pill)',
            boxShadow:    'var(--jd-shadow-card)',
            color:        'var(--jd-ink)',
            fontSize:     13,
            fontWeight:   600,
            fontFamily:   'var(--jd-font-sans)',
            pointerEvents:'none',
          }}
        >
          <span style={{ color: cfg.color, fontSize: 15, lineHeight: 1 }}>{cfg.glyph}</span>
          <span>{current.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}
