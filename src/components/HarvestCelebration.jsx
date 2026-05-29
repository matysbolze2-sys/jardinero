import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import EmojiIllo from './EmojiIllo'

const CONFETTI_COLORS = ['var(--jd-accent)', '#6c9a3a', 'var(--jd-warning)', 'var(--jd-harvest)', 'var(--jd-ink)', 'var(--jd-bg)', 'var(--jd-accent)']
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

  useEffect(() => {
    addHistorique({
      id:          crypto.randomUUID(),
      name:        plant.name,
      emoji:       plant.emoji,
      plantId:     plant.plantId,
      plantedAt:   plant.plantedAt,
      harvestedAt: new Date().toISOString().split('T')[0],
      variety:     plant.variety ?? null,
      plotId:      plant.plotId ?? null,
    })
    const t = setTimeout(() => setPhase('replant'), 2200)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReplant = () => { removePlant(plant.id); onReplant() }
  const handleDone    = () => { removePlant(plant.id); onClose()   }

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
          <div style={{ animation: 'bounce-ready 0.6s ease infinite' }}>
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
          <p className="text-sm mb-6" style={{ color: 'var(--jd-ink-muted)' }}>
            Tu veux replanter immédiatement ?
          </p>

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
