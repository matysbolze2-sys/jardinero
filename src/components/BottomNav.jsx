import { useProfile } from '../hooks/useProfile'
import { getEtatArrosage, getFrequencePlante } from '../utils/arrosageUtils'

const TABS = [
  { id: 'home',       label: 'Accueil',    emoji: '🏡' },
  { id: 'conseiller', label: 'Conseiller', emoji: '💬' },
  { id: 'calendrier', label: 'Calendrier', emoji: '📅' },
  { id: 'mon-jardin', label: 'Mon jardin', emoji: '🌱' },
]

function useGardenBadge() {
  const { profile } = useProfile()
  const plants    = profile.plants ?? []
  const soilId    = profile.soil
  const arrosages = profile.arrosages ?? {}

  let count = 0
  for (const p of plants) {
    if (p.status === 'ready') { count++; continue }
    const freq = getFrequencePlante(p, soilId)
    const etat = getEtatArrosage(p.id, p.plantedAt, arrosages, freq)
    if (etat === 'due' || etat === 'overdue') count++
  }
  return count
}

export default function BottomNav({ activePage, onNavigate }) {
  const badge = useGardenBadge()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[768px] bg-white z-50"
      style={{ borderTop: '1px solid #DDE8CC', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {TABS.map(tab => {
          const isActive    = activePage === tab.id
          const showBadge   = tab.id === 'mon-jardin' && badge > 0 && !isActive
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative tap-scale"
              style={{ color: isActive ? '#3B6D11' : '#6B7A5C' }}
            >
              {/* Indicateur actif — pill */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-all"
                  style={{ width: 40, height: 3, background: '#97C459' }}
                />
              )}

              {/* Emoji + badge */}
              <span className="relative leading-none mt-0.5" style={{ fontSize: 22 }}>
                {tab.emoji}
                {showBadge && (
                  <span
                    className="absolute -top-1.5 -right-2 rounded-full flex items-center justify-center font-bold"
                    style={{
                      background: '#E05A3A',
                      color:      'white',
                      fontSize:   9,
                      minWidth:   16,
                      height:     16,
                      paddingInline: 3,
                      lineHeight: 1,
                    }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>

              <span
                className="text-xs leading-none"
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
