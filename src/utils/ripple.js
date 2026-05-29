/**
 * triggerRipple — déclenche un ripple lime au point de clic.
 * Le bouton cible doit avoir style={{ position:'relative', overflow:'hidden' }}.
 *
 * Usage :
 *   import { triggerRipple } from '../utils/ripple'
 *   <button onClick={e => { triggerRipple(e); handleAction() }} style={{ position:'relative', overflow:'hidden' }}>
 */
export function triggerRipple(e) {
  const el   = e.currentTarget
  const span = document.createElement('span')
  span.className = 'jd-ripple'

  const rect = el.getBoundingClientRect()
  const sz   = Math.max(rect.width, rect.height)

  span.style.width  = `${sz}px`
  span.style.height = `${sz}px`
  span.style.left   = `${e.clientX - rect.left  - sz / 2}px`
  span.style.top    = `${e.clientY - rect.top   - sz / 2}px`

  el.appendChild(span)
  span.addEventListener('animationend', () => span.remove(), { once: true })
}
