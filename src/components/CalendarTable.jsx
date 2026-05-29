import { Fragment } from 'react'
import { PLANTS_UNIFIED } from '../data/plantsUnified'
import { PLANT_DURATIONS } from '../data/plantDurations'
import { MOIS_LABELS } from '../data/plants'
import { getCalendarWithOffset, getCalendarForPerennial } from '../utils/calendarUtils'

// ── Data ───────────────────────────────────────────────────────────────────────

const ANNUAL_PLANTS = PLANTS_UNIFIED.filter(p => p.type === 'annual' && p.calendar)

// ── Config ─────────────────────────────────────────────────────────────────────

const CELL_CONFIG = {
  0: { label: '',  bg: 'transparent',           text: '',                   dot: false },
  1: { label: 'S', bg: 'rgba(166,227,107,0.18)', text: 'var(--jd-accent)',  dot: false },
  2: { label: '·', bg: 'rgba(166,227,107,0.06)', text: 'var(--jd-accent-dim)', dot: true },
  3: { label: 'R', bg: 'var(--jd-warning-soft)', text: 'var(--jd-warning)', dot: false },
}

// Colors for user progress bars
const STAGE_COLORS = {
  sowed:     { bar: 'rgba(151,196,89,0.55)',  text: 'var(--jd-accent)' },
  growing:   { bar: 'rgba(109,184,66,0.65)',  text: '#6db842' },
  flowering: { bar: 'rgba(250,199,117,0.6)',  text: 'var(--jd-warning)' },
  ready:     { bar: 'rgba(224,90,58,0.55)',   text: 'var(--jd-harvest)' },
}

// Colors for perennial calendar bars
const PERENNIAL_COLORS = {
  0: 'rgba(163,184,168,0.12)',          // dormant
  2: 'rgba(166,227,107,0.18)',          // végétation
  3: 'rgba(166,227,107,0.55)',          // production
}

// ── Stage helper for user rows ─────────────────────────────────────────────────

// Returns the plant stage at the mid-point of a given calendar month (current year).
function getStageForMonth(plant, monthIdx, regionOffset) {
  const d = PLANT_DURATIONS[plant.plantId]
  if (!d || !plant.plantedAt || d.type === 'perennial') return 'none'

  const planted = new Date(plant.plantedAt + 'T12:00:00')
  const midMonth = new Date(new Date().getFullYear(), monthIdx, 15)

  const daysSincePlanted = Math.floor((midMonth - planted) / 86400000)
  if (daysSincePlanted < 0) return 'none'

  const offsetDays = Math.round(regionOffset * 7 * (1.0 + regionOffset * 0.05))
  const adj = base => (base ?? 0) + offsetDays

  const toGrowing   = adj(d.daysToGrowing ?? 7)
  const toFlowering = d.daysToFlowering != null ? adj(d.daysToFlowering) : null
  const toReady     = adj(d.daysToReady ?? (d.daysToHarvest ?? 90) - 10)
  const toEnd       = (d.daysToHarvest ?? 90) + (d.harvestWindow ?? 14) + offsetDays

  if (daysSincePlanted > toEnd) return 'none'
  if (daysSincePlanted >= toReady) return 'ready'
  if (d.hasFlowering && toFlowering !== null && daysSincePlanted >= toFlowering) return 'flowering'
  if (daysSincePlanted >= toGrowing) return 'growing'
  return 'sowed'
}

// ── Sub-components ─────────────────────────────────────────────────────────────

// Badge chip "Vous"
function YouBadge() {
  return (
    <span
      style={{
        fontSize: 8,
        fontFamily: 'var(--jd-font-mono)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: 'var(--jd-accent-soft)',
        color: 'var(--jd-accent)',
        border: '1px solid var(--jd-accent-ring)',
        borderRadius: 4,
        padding: '1px 4px',
        marginRight: 4,
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      Vous
    </span>
  )
}

// Month header row — shared between annual and perennial sections
function MonthHeaders({ currentMonth }) {
  return (
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
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CalendarTable({
  offsetWeeks   = 0,
  filterMonth   = null,
  filterValue   = null,
  onSowClick    = null,
  userPlants    = [],
  onlyUserPlants = false,
  onPlantClick  = null,
}) {
  const currentMonth = new Date().getMonth()
  const regionOffset = offsetWeeks // region.offset is in weeks, same numeric value used for day offset

  // Perennial user plants
  const vivaceUserPlants = userPlants.filter(up => {
    const d = PLANT_DURATIONS[up.plantId]
    return d?.type === 'perennial'
  })

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full border-collapse" style={{ minWidth: 420 }}>

        {/* ── Annual plants ── */}
        <thead>
          <MonthHeaders currentMonth={currentMonth} />
        </thead>
        <tbody>
          {ANNUAL_PLANTS.map(plant => {
            const cal = getCalendarWithOffset(plant.calendar, offsetWeeks)
            const matchingUserPlants = userPlants.filter(up => up.plantId === plant.id)

            // Apply filters
            if (onlyUserPlants && matchingUserPlants.length === 0) return null
            if (!onlyUserPlants && filterMonth !== null) {
              if (filterValue !== null && cal[filterMonth] !== filterValue) return null
              if (filterValue === null && cal[filterMonth] === 0) return null
            }

            return (
              <Fragment key={plant.id}>
                {/* Generic row */}
                <tr className="border-t" style={{ borderColor: 'var(--jd-border)' }}>
                  <td
                    className="py-2.5 pr-3 text-xs font-medium sticky left-0"
                    style={{ color: 'var(--jd-ink)', whiteSpace: 'nowrap', background: 'var(--jd-bg)' }}
                  >
                    <span className="mr-1.5">{plant.emoji}</span>
                    {plant.label}
                  </td>
                  {cal.map((val, mi) => {
                    const cfg       = CELL_CONFIG[val]
                    const isCurrent = mi === currentMonth
                    const isSowCell = val === 1 && onSowClick

                    return (
                      <td
                        key={mi}
                        className="text-center py-1.5"
                        style={{ background: isCurrent ? 'var(--jd-accent-soft)' : 'transparent' }}
                      >
                        {val > 0 && (
                          isSowCell ? (
                            <button
                              onClick={() => onSowClick(plant, mi)}
                              className="inline-flex items-center justify-center rounded text-xs font-bold tap-scale"
                              style={{ background: cfg.bg, color: cfg.text, width: 22, height: 22, fontSize: 10, cursor: 'pointer' }}
                              title={`Semer ${plant.label} — ${MOIS_LABELS[mi]}`}
                            >
                              S
                            </button>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center rounded text-xs font-bold"
                              style={{ background: cfg.bg, color: cfg.text, width: 22, height: 22, fontSize: cfg.dot ? 18 : 10, lineHeight: 1 }}
                            >
                              {cfg.label}
                            </span>
                          )
                        )}
                      </td>
                    )
                  })}
                </tr>

                {/* User sub-rows */}
                {matchingUserPlants.map(up => (
                  <tr
                    key={up.id}
                    onClick={() => onPlantClick?.(up)}
                    style={{
                      background: 'rgba(166,227,107,0.03)',
                      borderTop: '1px dashed rgba(166,227,107,0.15)',
                      cursor: onPlantClick ? 'pointer' : 'default',
                    }}
                  >
                    <td
                      className="py-1.5 pr-3 sticky left-0"
                      style={{ background: 'rgba(22,38,27,0.97)', whiteSpace: 'nowrap' }}
                    >
                      <div className="flex items-center gap-1 pl-3">
                        <YouBadge />
                        <span className="text-xs" style={{ color: 'var(--jd-ink-muted)', fontStyle: 'italic', fontSize: 11 }}>
                          {up.name}
                        </span>
                      </div>
                    </td>
                    {Array.from({ length: 12 }, (_, mi) => {
                      const stage = getStageForMonth(up, mi, regionOffset)
                      const c     = STAGE_COLORS[stage]
                      const isCur = mi === currentMonth

                      return (
                        <td
                          key={mi}
                          style={{
                            background: isCur ? 'var(--jd-accent-soft)' : 'transparent',
                            padding: '3px 0',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {stage !== 'none' && (
                              <div style={{ width: 16, height: 5, borderRadius: 2, background: c.bar }} />
                            )}
                            {isCur && stage !== 'none' && (
                              <span style={{ fontSize: 6, lineHeight: 1, color: c.text }}>▼</span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </Fragment>
            )
          })}
        </tbody>

        {/* ── Perennial / vivaces section ── */}
        {vivaceUserPlants.length > 0 && (
          <tbody>
            {/* Section header */}
            <tr>
              <td
                colSpan={13}
                className="sticky left-0"
                style={{ paddingTop: 24, paddingBottom: 8, background: 'var(--jd-bg)' }}
              >
                <div className="jd-kicker">Mes plantes vivaces</div>
              </td>
            </tr>

            {vivaceUserPlants.map(up => {
              const d          = PLANT_DURATIONS[up.plantId]
              const isWaiting  = d?.longCycle && up.plantedAt &&
                (Date.now() - new Date(up.plantedAt + 'T12:00:00')) / (365.25 * 86400000) < (d.firstHarvestYears ?? 0)

              let monthsUntil = 0
              if (isWaiting && d?.firstHarvestYears && up.plantedAt) {
                const planted = new Date(up.plantedAt + 'T12:00:00')
                const target  = new Date(planted)
                target.setFullYear(target.getFullYear() + Math.ceil(d.firstHarvestYears))
                monthsUntil = Math.max(0, Math.round((target - Date.now()) / (30 * 86400000)))
              }

              const cal = isWaiting ? Array(12).fill(-1) : getCalendarForPerennial(up.plantId)

              return (
                <tr
                  key={up.id}
                  className="border-t"
                  style={{ borderColor: 'var(--jd-border)', cursor: onPlantClick ? 'pointer' : 'default' }}
                  onClick={() => onPlantClick?.(up)}
                >
                  <td
                    className="py-2 pr-3 sticky left-0"
                    style={{ background: 'var(--jd-bg)', whiteSpace: 'nowrap' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 14 }}>{up.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--jd-ink)' }}>{up.name}</span>
                      {isWaiting && (
                        <span
                          style={{
                            fontSize: 9, fontFamily: 'var(--jd-font-mono)',
                            background: 'var(--jd-warning-soft)', color: 'var(--jd-warning)',
                            border: '1px solid var(--jd-warning-ring)',
                            borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap',
                          }}
                        >
                          {monthsUntil > 0 ? `1re récolte dans ${monthsUntil} mois` : '1re récolte imminente !'}
                        </span>
                      )}
                    </div>
                  </td>
                  {cal.map((val, mi) => {
                    const isCur = mi === currentMonth
                    let barBg = isWaiting ? 'rgba(163,184,168,0.2)' : PERENNIAL_COLORS[val] ?? 'transparent'

                    return (
                      <td
                        key={mi}
                        style={{ background: isCur ? 'var(--jd-accent-soft)' : 'transparent', padding: '4px 0', textAlign: 'center' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <div style={{ width: 18, height: 6, borderRadius: 2, background: barBg }} />
                          {isCur && !isWaiting && val === 3 && (
                            <span style={{ fontSize: 6, lineHeight: 1, color: 'var(--jd-accent)' }}>▼</span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        )}
      </table>

      {/* ── Legend ── */}
      <div className="flex gap-4 mt-4 flex-wrap">
        {[
          { bg: 'rgba(166,227,107,0.18)', text: 'var(--jd-accent)',     label: 'Semis (tap pour ajouter)' },
          { bg: 'rgba(166,227,107,0.06)', text: 'var(--jd-accent-dim)', label: 'Croissance' },
          { bg: 'var(--jd-warning-soft)', text: 'var(--jd-warning)',    label: 'Récolte' },
          { bg: 'rgba(166,227,107,0.55)', text: 'var(--jd-accent)',     label: 'Vivace en production' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            <span className="inline-block rounded" style={{ width: 14, height: 14, background: item.bg, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
          <span className="inline-block rounded" style={{ width: 14, height: 14, background: 'var(--jd-accent-soft)', border: '1px solid var(--jd-accent-ring)', flexShrink: 0 }} />
          Mois actuel
        </div>
      </div>
    </div>
  )
}
