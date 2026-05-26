import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getEffectiveStatus } from '../utils/plantStatusUtils'
import { getEtatArrosage, getFrequencePlante, shouldWaterToday } from '../utils/arrosageUtils'

const iconStyle = {
  width: 20, height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function TabIcon({ kind }) {
  if (kind === 'home') return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
  if (kind === 'conseiller') return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  )
  if (kind === 'calendrier') return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  )
  if (kind === 'mon-jardin') return (
    <svg viewBox="0 0 24 24" style={iconStyle}>
      <path d="M12 21v-7" />
      <path d="M12 14c-3 0-5-3-5-6 2 0 5 1 5 6z" />
      <path d="M12 14c3 0 5-3 5-6-2 0-5 1-5 6z" />
    </svg>
  )
  return null
}

const TABS = [
  { id: 'home',       label: 'Accueil',    kind: 'home' },
  { id: 'conseiller', label: 'Conseiller', kind: 'conseiller' },
  { id: 'calendrier', label: 'Calendrier', kind: 'calendrier' },
  { id: 'mon-jardin', label: 'Mon jardin', kind: 'mon-jardin' },
]

function useGardenBadge() {
  const { profile } = useProfile()
  const plants       = profile.plants ?? []
  const soilId       = profile.soil
  const arrosages    = profile.arrosages ?? {}
  const regionOffset = getRegionById(profile.region)?.offset ?? 0

  let count = 0
  for (const p of plants) {
    const status = getEffectiveStatus(p, regionOffset)
    if (status === 'ready') { count++; continue }
    if (!shouldWaterToday(p, regionOffset)) continue
    const freq = getFrequencePlante(p, soilId, regionOffset)
    const etat = getEtatArrosage(p.id, p.plantedAt, arrosages, freq)
    if (etat === 'due' || etat === 'overdue') count++
  }
  return count
}

export default function BottomNav({ activePage, onNavigate }) {
  const badge = useGardenBadge()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[768px] z-50"
      style={{
        height: 64,
        background: 'rgba(13,22,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--jd-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
    >
      {TABS.map(tab => {
        const isActive  = activePage === tab.id
        const showBadge = tab.id === 'mon-jardin' && badge > 0 && !isActive
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center justify-center gap-1 relative tap-scale"
            style={{ color: isActive ? 'var(--jd-accent)' : 'var(--jd-ink-muted)' }}
          >
            <span className="relative">
              <TabIcon kind={tab.kind} />
              {showBadge && (
                <span
                  className="absolute -top-1.5 -right-2 rounded-full flex items-center justify-center font-bold"
                  style={{
                    background:    '#E05A3A',
                    color:         'white',
                    fontSize:      9,
                    minWidth:      16,
                    height:        16,
                    paddingInline: 3,
                    lineHeight:    1,
                  }}
                >
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: isActive ? 600 : 400, lineHeight: 1 }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
