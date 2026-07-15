import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { estimerValeurRecolte, uniteSaisie } from '../data/prixRecoltes'
import EmojiIllo from './EmojiIllo'

function formatEuro(v) {
  return `~${v.toFixed(2).replace('.', ',')} €`
}

const CONFETTI_COLORS = ['#a6e36b', '#9DC044', '#DE5F1D', '#FCBA6A', '#f1f6ed']
const CONFETTI_COUNT  = 40

function generateConfetti() {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id:    i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x:     Math.random() * 100,
    delay: Math.random() * 0.6,
    size:  8 + Math.random() * 10,
    rot:   Math.random() * 360,
    speed: 1.2 + Math.random() * 1,
  }))
}

export default function HarvestCelebration({ plant, onClose, onReplant }) {
  const { addHistorique, removePlant } = useProfile()
  const [phase,    setPhase]    = useState('celebrate')
  const [confetti]              = useState(generateConfetti)
  const [quantite, setQuantite] = useState('')
  const piece    = uniteSaisie(plant.plantId)              // { poidsPiece } ou null
  const [unite,  setUnite]      = useState(piece ? 'piece' : 'kg')

  useEffect(() => {
    const t = setTimeout(() => setPhase('replant'), 2200)
    return () => clearTimeout(t)
  }, [])

  // Quantité saisie → kg (null si vide/invalide → l'estimation utilise le rendement)
  const raw = parseFloat(quantite.replace(',', '.'))
  const quantiteKg = !isNaN(raw) && raw > 0
    ? (unite === 'piece' && piece ? raw * piece.poidsPiece : raw)
    : null

  const valeur = estimerValeurRecolte(plant.plantId, quantiteKg)

  // L'écriture de l'historique se fait ici (pas au montage) pour inclure la quantité
  const persistHarvest = () => {
    addHistorique({
      id:          crypto.randomUUID(),
      name:        plant.name,
      emoji:       plant.emoji,
      plantId:     plant.plantId,
      plantedAt:   plant.plantedAt,
      harvestedAt: new Date().toISOString().split('T')[0],
      variety:     plant.variety ?? null,
      plotId:      plant.plotId ?? null,
      container:   plant.container ?? false,
      quantiteKg,
    })
  }

  const handleReplant = () => { persistHarvest(); removePlant(plant.id); onReplant() }
  const handleDone    = () => { persistHarvest(); removePlant(plant.id); onClose()   }

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
      style={{ background: 'rgba(22,38,27,0.95)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {confetti.map(c => (
          <div
            key={c.id}
            style={{
              position:     'absolute',
              left:         `${c.x}%`,
              top:          '-10%',
              width:        c.size,
              height:       c.size * 0.5,
              background:   c.color,
              borderRadius: 2,
              transform:    `rotate(${c.rot}deg)`,
              animation:    `confettiFall ${c.speed}s ease-in ${c.delay}s both`,
            }}
          />
        ))}
      </div>

      {phase === 'celebrate' && (
        <div className="flex flex-col items-center text-center px-8 fade-in">
          <div className="plant-pop">
            <EmojiIllo emoji={plant.emoji} size={80} />
          </div>
          <p className="font-display font-extrabold text-5xl mt-4" style={{ color: 'var(--jd-accent)' }}>
            Récolté !
          </p>
          <p className="text-lg mt-2" style={{ color: 'rgba(241,246,237,0.85)' }}>
            {plant.name}{plant.variety ? ` · ${plant.variety}` : ''}
          </p>
        </div>
      )}

      {phase === 'replant' && (
        <div
          className="mx-5 w-full max-w-sm rounded-[24px] flex flex-col items-center text-center px-6 py-8 fade-in"
          style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        >
          <EmojiIllo emoji={plant.emoji} size={56} />
          <h2 className="font-display font-extrabold text-2xl mt-3 mb-1" style={{ color: 'var(--jd-ink)' }}>
            Belle récolte !
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--jd-ink-muted)' }}>
            Tu veux replanter immédiatement ?
          </p>

          {/* Quantité récoltée — optionnel, discret. Sert à affiner la valeur en € */}
          {valeur !== null && (
            <div className="w-full mb-5">
              <label className="block text-xs font-semibold mb-1.5 text-left" style={{ color: 'var(--jd-ink-muted)' }}>
                Quantité récoltée (optionnel)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={quantite}
                  onChange={e => setQuantite(e.target.value)}
                  placeholder={piece ? 'ex : 3' : 'ex : 1,5'}
                  className="flex-1 px-4 py-3 rounded-card text-sm outline-none"
                  style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-alt)', color: 'var(--jd-ink)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--jd-accent-ring)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--jd-border)')}
                />
                {piece ? (
                  <div className="flex rounded-card overflow-hidden" style={{ border: '1px solid var(--jd-border)' }}>
                    {['piece', 'kg'].map(u => (
                      <button
                        key={u}
                        onClick={() => setUnite(u)}
                        className="px-3 text-sm font-semibold tap-scale"
                        style={{
                          background: unite === u ? 'var(--jd-accent)' : 'var(--jd-surface-alt)',
                          color:      unite === u ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
                        }}
                      >
                        {u === 'piece' ? 'pièces' : 'kg'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span
                    className="flex items-center px-4 rounded-card text-sm font-semibold"
                    style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-ink-muted)', border: '1px solid var(--jd-border)' }}
                  >
                    kg
                  </span>
                )}
              </div>
              <p className="text-sm mt-2 text-left font-semibold" style={{ color: 'var(--jd-accent)' }}>
                💶 {formatEuro(valeur)}
                <span className="font-normal" style={{ color: 'var(--jd-ink-muted)' }}>
                  {quantiteKg === null ? ' (estimation par défaut)' : ''}
                </span>
              </p>
            </div>
          )}

          <button
            onClick={handleReplant}
            className="w-full py-4 rounded-card font-bold text-base mb-3 tap-scale"
            style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
          >
            Replanter maintenant 🌱
          </button>
          <button
            onClick={handleDone}
            className="w-full py-3 text-sm font-semibold tap-scale"
            style={{ color: 'var(--jd-ink-muted)' }}
          >
            Pas pour l'instant
          </button>
        </div>
      )}
    </div>
  )
}
