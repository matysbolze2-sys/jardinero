import { STATUT_LABELS } from '../data/plants'

export default function PlantCard({ plant, onOpenDetail }) {
  const statut       = STATUT_LABELS[plant.status] ?? STATUT_LABELS.sowed
  const statutKeys   = Object.keys(STATUT_LABELS)
  const currentIndex = statutKeys.indexOf(plant.status)

  const daysSincePlanted = plant.plantedAt
    ? Math.floor((Date.now() - new Date(plant.plantedAt)) / 86400000)
    : null

  return (
    <button
      onClick={() => onOpenDetail(plant, 'infos')}
      className="bg-white rounded-card p-4 card-hover flex flex-col gap-3 w-full text-left"
      style={{ border: '1px solid #DDE8CC' }}
    >
      {/* Emoji + nom + J+ */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl leading-none">{plant.emoji}</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#1A2010' }}>{plant.name}</p>
            {plant.variety && (
              <p className="text-xs" style={{ color: '#6B7A5C' }}>{plant.variety}</p>
            )}
          </div>
        </div>
        {daysSincePlanted !== null && (
          <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#9CAB8C' }}>
            J+{daysSincePlanted}
          </span>
        )}
      </div>

      {/* Badge statut */}
      <span
        className="self-start inline-flex items-center px-2.5 py-1 rounded-chip text-xs font-semibold"
        style={{ background: statut.color + '22', color: statut.color, border: `1px solid ${statut.color}55` }}
      >
        {statut.label}
      </span>

      {/* Barre de progression */}
      <div className="flex gap-1">
        {statutKeys.map((key, i) => (
          <div
            key={key}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: i <= currentIndex ? '#97C459' : '#DDE8CC' }}
          />
        ))}
      </div>

      {/* Hint */}
      <p className="text-xs" style={{ color: '#BCC9A8' }}>
        Toucher pour gérer →
      </p>
    </button>
  )
}
