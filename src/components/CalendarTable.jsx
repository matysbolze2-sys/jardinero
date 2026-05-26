import { PLANTS, MOIS_LABELS } from '../data/plants'
import { getCalendarWithOffset } from '../utils/calendarUtils'

const CELL_CONFIG = {
  0: { label: '',   bg: 'transparent',           text: '',                  dot: false },
  1: { label: 'S', bg: 'rgba(166,227,107,0.18)', text: 'var(--jd-accent)', dot: false },
  2: { label: '·', bg: 'rgba(166,227,107,0.06)', text: 'var(--jd-accent-dim)', dot: true },
  3: { label: 'R', bg: 'rgba(240,184,108,0.15)', text: 'var(--jd-warning)', dot: false },
}

export default function CalendarTable({ offsetWeeks = 0, filterMonth = null, filterValue = null, onSowClick = null }) {
  const currentMonth = new Date().getMonth()

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full border-collapse" style={{ minWidth: 420 }}>
        <thead>
          <tr>
            <th
              className="text-left py-2 pr-3 text-xs font-semibold uppercase tracking-wide sticky left-0"
              style={{ color: 'var(--jd-ink-muted)', minWidth: 110, background: 'var(--jd-bg)' }}
            >
              Légume
            </th>
            {MOIS_LABELS.map((mois, i) => (
              <th
                key={i}
                className="text-center py-2 text-xs font-semibold"
                style={{
                  color:        i === currentMonth ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
                  background:   i === currentMonth ? 'var(--jd-accent-soft)' : 'transparent',
                  borderRadius: i === currentMonth ? '8px 8px 0 0' : 0,
                  minWidth: 28,
                }}
              >
                {mois.slice(0, 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLANTS.map((plant) => {
            const cal = getCalendarWithOffset(plant.calendar, offsetWeeks)

            if (filterMonth !== null) {
              if (filterValue !== null && cal[filterMonth] !== filterValue) return null
              if (filterValue === null && cal[filterMonth] === 0) return null
            }

            return (
              <tr key={plant.id} className="border-t" style={{ borderColor: 'var(--jd-border)' }}>
                <td
                  className="py-2.5 pr-3 text-xs font-medium sticky left-0"
                  style={{ color: 'var(--jd-ink)', whiteSpace: 'nowrap', background: 'var(--jd-bg)' }}
                >
                  <span className="mr-1.5">{plant.emoji}</span>
                  {plant.label}
                </td>

                {cal.map((val, mi) => {
                  const cfg            = CELL_CONFIG[val]
                  const isCurrentMonth = mi === currentMonth
                  const isSowCell      = val === 1 && onSowClick

                  return (
                    <td
                      key={mi}
                      className="text-center py-1.5"
                      style={{ background: isCurrentMonth ? 'var(--jd-accent-soft)' : 'transparent' }}
                    >
                      {val > 0 && (
                        isSowCell ? (
                          <button
                            onClick={() => onSowClick(plant, mi)}
                            className="inline-flex items-center justify-center rounded text-xs font-bold tap-scale"
                            style={{
                              background: cfg.bg,
                              color:      cfg.text,
                              width:      22,
                              height:     22,
                              fontSize:   10,
                              cursor:     'pointer',
                            }}
                            title={`Semer ${plant.label} — ${MOIS_LABELS[mi]}`}
                          >
                            S
                          </button>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center rounded text-xs font-bold"
                            style={{
                              background: cfg.bg,
                              color:      cfg.text,
                              width:      22,
                              height:     22,
                              fontSize:   cfg.dot ? 18 : 10,
                              lineHeight: 1,
                            }}
                          >
                            {cfg.label}
                          </span>
                        )
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4 flex-wrap">
        {[
          { bg: 'rgba(166,227,107,0.18)', text: 'var(--jd-accent)',     label: 'Semis (tap pour ajouter)' },
          { bg: 'rgba(166,227,107,0.06)', text: 'var(--jd-accent-dim)', label: 'Croissance' },
          { bg: 'rgba(240,184,108,0.15)', text: 'var(--jd-warning)',    label: 'Récolte' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            <span
              className="inline-block rounded"
              style={{ width: 14, height: 14, background: item.bg, flexShrink: 0 }}
            />
            {item.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
          <span
            className="inline-block rounded"
            style={{ width: 14, height: 14, background: 'var(--jd-accent-soft)', border: '1px solid var(--jd-accent-ring)', flexShrink: 0 }}
          />
          Mois actuel
        </div>
      </div>
    </div>
  )
}
