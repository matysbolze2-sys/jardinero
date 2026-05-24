import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'

const CONFETTI_COLORS = ['#97C459', '#3B6D11', '#FAC975', '#E05A3A', '#fff', '#DDE8CC']
const CONFETTI_COUNT  = 40

function generateConfetti() {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id:    i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x:     Math.random() * 100,      // % from left
    delay: Math.random() * 0.6,      // s
    size:  8 + Math.random() * 10,   // px
    rot:   Math.random() * 360,
    speed: 1.2 + Math.random() * 1,  // s
  }))
}

export default function HarvestCelebration({ plant, onClose, onReplant }) {
  const { addHistorique, removePlant } = useProfile()
  const [phase, setPhase]             = useState('celebrate') // 'celebrate' | 'replant'
  const [confetti]                    = useState(generateConfetti)

  // Sauvegarde dans l'historique et passe en phase "replant" après 2s
  useEffect(() => {
    addHistorique({
      id:         crypto.randomUUID(),
      name:       plant.name,
      emoji:      plant.emoji,
      plantId:    plant.plantId,
      plantedAt:  plant.plantedAt,
      harvestedAt: new Date().toISOString().split('T')[0],
      variety:    plant.variety ?? null,
    })

    const t = setTimeout(() => setPhase('replant'), 2200)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReplant = () => {
    removePlant(plant.id)
    onReplant()
  }

  const handleDone = () => {
    removePlant(plant.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
      style={{ background: 'rgba(26,32,16,0.88)' }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {confetti.map(c => (
          <div
            key={c.id}
            style={{
              position:  'absolute',
              left:      `${c.x}%`,
              top:       '-10%',
              width:     c.size,
              height:    c.size * 0.5,
              background: c.color,
              borderRadius: 2,
              transform: `rotate(${c.rot}deg)`,
              animation: `confettiFall ${c.speed}s ease-in ${c.delay}s both`,
            }}
          />
        ))}
      </div>

      {/* Carte centrale */}
      {phase === 'celebrate' && (
        <div className="flex flex-col items-center text-center px-8 fade-in">
          <p style={{ fontSize: 80, lineHeight: 1, animation: 'bounce-ready 0.6s ease infinite' }}>
            {plant.emoji}
          </p>
          <p className="font-fraunces text-5xl mt-4" style={{ color: '#97C459' }}>
            Récolté !
          </p>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {plant.name}{plant.variety ? ` · ${plant.variety}` : ''}
          </p>
        </div>
      )}

      {phase === 'replant' && (
        <div
          className="mx-5 w-full max-w-sm rounded-[24px] flex flex-col items-center text-center px-6 py-8 fade-in"
          style={{ background: '#FAF8F3', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          <p style={{ fontSize: 56 }}>{plant.emoji}</p>
          <h2 className="font-fraunces text-2xl font-bold mt-3 mb-1" style={{ color: '#1A2010' }}>
            Belle récolte !
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7A5C' }}>
            Tu veux replanter immédiatement ?
          </p>

          <button
            onClick={handleReplant}
            className="w-full py-4 rounded-card font-bold text-base mb-3 tap-scale"
            style={{ background: '#3B6D11', color: 'white' }}
          >
            Replanter maintenant 🌱
          </button>
          <button
            onClick={handleDone}
            className="w-full py-3 text-sm font-semibold tap-scale"
            style={{ color: '#6B7A5C' }}
          >
            Pas pour l'instant
          </button>
        </div>
      )}
    </div>
  )
}
