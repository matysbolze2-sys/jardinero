import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import { useMeteo } from '../hooks/useMeteo'
import { getRegionById } from '../data/regions'
import { MOIS_LABELS } from '../data/plants'
import { getPlantsToSowThisMonth, getPlantsToHarvestThisMonth } from '../utils/calendarUtils'
import MeteoWidget from '../components/MeteoWidget'
import { getTachesSemaine, getWeekKey } from '../data/taches'
import { openmoji } from '../utils/openmoji'
import { getEffectiveStatus, ALL_STATUT_LABELS } from '../utils/plantStatusUtils'
import { getDailyAlerts, getWeeklyActions, getSeasonalContext } from '../utils/homeInsights'

// ── Shared icons ───────────────────────────────────────────────────────────────

function ArrowIcon() {
  const s = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return <svg viewBox="0 0 24 24" style={s}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function SproutIcon() {
  const s = { width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M12 21v-7" />
      <path d="M12 14c-3 0-5-2-5-5 2 0 5 .5 5 5z" />
      <path d="M12 14c3 0 5-2 5-5-2 0-5 .5-5 5z" />
    </svg>
  )
}

// ── PlantChip ──────────────────────────────────────────────────────────────────

function PlantChip({ emoji, label, onClick }) {
  return (
    <button onClick={onClick} className="jd-chip flex-shrink-0 tap-scale">
      <img
        src={openmoji(emoji)}
        alt=""
        style={{ width: 16, height: 16, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4)) drop-shadow(0 0 6px rgba(166,227,107,0.35))' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      {label}
    </button>
  )
}

// ── AlertCard ──────────────────────────────────────────────────────────────────

const ALERT_STYLES = {
  water_urgent:    { bg: 'rgba(224,90,58,0.1)',   border: 'rgba(224,90,58,0.3)',   color: '#E05A3A',   icon: '🚿' },
  ready_harvest:   { bg: 'var(--jd-warning-soft)', border: 'rgba(240,184,108,0.3)', color: 'var(--jd-warning)', icon: '🧺' },
  stage_change:    { bg: 'rgba(166,227,107,0.1)',  border: 'rgba(166,227,107,0.3)', color: 'var(--jd-accent)', icon: '✨' },
  germinating:     { bg: 'rgba(166,227,107,0.06)', border: 'rgba(166,227,107,0.18)', color: 'var(--jd-accent)', icon: '🌱' },
  perennial_start: { bg: 'rgba(166,227,107,0.08)', border: 'rgba(166,227,107,0.22)', color: 'var(--jd-accent)', icon: '🌿' },
  frost_risk:      { bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.3)', color: '#93C5FD',   icon: '🧊' },
}

function AlertCard({ alert, onNavigate }) {
  const s = ALERT_STYLES[alert.type] ?? ALERT_STYLES.stage_change
  return (
    <button
      onClick={() => onNavigate('mon-jardin')}
      className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{s.icon}</span>
      <p className="flex-1 font-bold text-sm leading-snug" style={{ color: s.color }}>
        {alert.message}
      </p>
      <span style={{ color: s.color, opacity: 0.7, flexShrink: 0 }}><ArrowIcon /></span>
    </button>
  )
}

// ── SectionAlertesJour ─────────────────────────────────────────────────────────

function SectionAlertesJour({ plants, soilId, arrosages, regionOffset, meteoAlerts, onNavigate }) {
  const alerts = getDailyAlerts(plants, arrosages, soilId, regionOffset, meteoAlerts)

  return (
    <div className="mb-5">
      <div className="jd-kicker mb-3">Aujourd'hui dans ton jardin</div>

      {plants.length === 0 && (
        <button
          onClick={() => onNavigate('mon-jardin')}
          className="w-full rounded-card p-4 flex items-center gap-3 tap-scale text-left"
          style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
        >
          <span style={{ fontSize: 28 }}>🌱</span>
          <div>
            <p className="font-bold text-sm">Commence ton jardin</p>
            <p className="text-xs opacity-75 mt-0.5">Ajoute ta première plante maintenant</p>
          </div>
          <span className="ml-auto text-lg opacity-75">→</span>
        </button>
      )}

      {plants.length > 0 && alerts.length === 0 && (
        <div
          className="rounded-card p-4 flex items-center gap-3"
          style={{ background: 'var(--jd-surface-glass)', backdropFilter: 'blur(var(--jd-blur))', WebkitBackdropFilter: 'blur(var(--jd-blur))', border: '1px solid var(--jd-border)' }}
        >
          <div
            style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, var(--jd-accent), var(--jd-accent-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--jd-accent-ink)' }}
          >
            <SproutIcon />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--jd-accent)' }}>Tout est en ordre !</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>Aucune action requise aujourd'hui</p>
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map((alert, i) => <AlertCard key={i} alert={alert} onNavigate={onNavigate} />)}
        </div>
      )}
    </div>
  )
}

// ── ChecklistSemaine ───────────────────────────────────────────────────────────

function ChecklistSemaine({ plants, moisIdx, regionOffset, checkedTaches, weekKey, onToggle }) {
  const plantIds = plants.map(p => p.plantId).filter(Boolean)

  // Dynamic actions when plants exist, static fallback otherwise
  const dynamicActions = getWeeklyActions(plants, regionOffset)
  const useStatic = plants.length === 0 || dynamicActions.length === 0
  const staticTaches = getTachesSemaine(moisIdx, plantIds, 5)

  const items = useStatic
    ? staticTaches.map(t => ({
        id:     t.tache,
        icon:   <span style={{ fontSize: 14 }}>{t.icone}</span>,
        label:  t.tache,
        sub:    t.plante ? `Pour votre ${t.plante}` : null,
        subColor: 'var(--jd-accent)',
      }))
    : dynamicActions.map(({ plant, action, reason }) => ({
        id:     `${plant.id}::${action}`,
        icon:   (
          <img
            src={openmoji(plant.emoji)}
            alt=""
            style={{ width: 18, height: 18, flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ),
        label:  action,
        sub:    reason,
        subColor: 'var(--jd-ink-muted)',
      }))

  if (items.length === 0) return null

  return (
    <div className="mb-5">
      <div className="jd-kicker mb-3">Cette semaine au jardin</div>
      <div
        className="rounded-card overflow-hidden"
        style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-glass)', backdropFilter: 'blur(var(--jd-blur))', WebkitBackdropFilter: 'blur(var(--jd-blur))' }}
      >
        {items.map((item, i) => {
          const isChecked = checkedTaches.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left tap-scale"
              style={{
                background:   isChecked ? 'rgba(166,227,107,0.04)' : 'transparent',
                borderBottom: i < items.length - 1 ? '1px solid var(--jd-border)' : 'none',
              }}
            >
              <div
                className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center transition-all"
                style={{
                  borderRadius: 5,
                  background: isChecked ? 'var(--jd-accent)' : 'transparent',
                  border:     isChecked ? '2px solid var(--jd-accent)' : '1.5px solid var(--jd-accent)',
                }}
              >
                {isChecked && <span style={{ fontSize: 11, color: 'var(--jd-accent-ink)', fontWeight: 800 }}>✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <p
                    className="text-sm leading-snug"
                    style={{ color: isChecked ? 'var(--jd-ink-muted)' : 'var(--jd-ink)', textDecoration: isChecked ? 'line-through' : 'none' }}
                  >
                    {item.label}
                  </p>
                </div>
                {item.sub && (
                  <p className="text-xs mt-0.5" style={{ color: isChecked ? 'var(--jd-ink-muted)' : item.subColor, fontWeight: 500 }}>
                    {item.sub}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-xs mt-1.5 text-right" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        {checkedTaches.filter(t => items.some(it => it.id === t)).length}/{items.length} · remise à zéro chaque lundi
      </p>
    </div>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────────

export default function Home({ onNavigate }) {
  const { profile, toggleChecklistTask } = useProfile()
  const { signOut, user } = useAuth()
  const region      = getRegionById(profile.region)
  const regionOffset = region?.offset ?? 0
  const moisIdx     = new Date().getMonth()
  const moisLabel   = MOIS_LABELS[moisIdx]
  const plants      = profile.plants ?? []

  const { alertes: meteoAlerts } = useMeteo(profile.region, profile.coords)

  const plantesSemer   = getPlantsToSowThisMonth(regionOffset)
  const plantesRecolte = getPlantsToHarvestThisMonth(regionOffset)

  const heure = new Date().getHours()
  const salut = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'

  const weekKey       = getWeekKey()
  const checkedTaches = profile.checklistWeek?.[weekKey] ?? []

  const seasonalContext = getSeasonalContext(plants, regionOffset)

  return (
    <div className="px-4 pt-5 pb-4">

      {/* Hero */}
      <div
        className="rounded-card mb-4 overflow-hidden relative"
        style={{
          height: 168,
          background: 'linear-gradient(135deg, #1e3a24 0%, #0d160f 70%), radial-gradient(circle at 70% 30%, var(--jd-accent) 0%, transparent 50%)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 80% 110%, #2d5230 0%, transparent 60%), radial-gradient(ellipse at 20% -10%, #1a4022 0%, transparent 50%)' }}
        />
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div>
            <div className="jd-kicker mb-1.5">{salut}</div>
            <h1 className="jd-title" style={{ fontSize: 26, color: 'var(--jd-ink)' }}>
              {moisLabel} au <em style={{ fontStyle: 'italic', color: 'var(--jd-accent)' }}>potager</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 5, fontFamily: 'var(--jd-font-sans)' }}>
              {seasonalContext}
            </p>
          </div>
          {region && (
            <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--jd-ink-muted)' }}>
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" /><circle cx="12" cy="9" r="2" />
              </svg>
              {region.label}
            </div>
          )}
        </div>
      </div>

      <MeteoWidget />

      <SectionAlertesJour
        plants={plants}
        soilId={profile.soil}
        arrosages={profile.arrosages ?? {}}
        regionOffset={regionOffset}
        meteoAlerts={meteoAlerts ?? []}
        onNavigate={onNavigate}
      />

      {plantesSemer.length > 0 && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="jd-kicker">À semer en {moisLabel.toLowerCase()}</div>
            <button onClick={() => onNavigate('conseiller')} className="text-xs font-semibold tap-scale" style={{ color: 'var(--jd-accent)' }}>
              Voir le calendrier →
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
            {plantesSemer.map(p => (
              <PlantChip key={p.id} emoji={p.emoji} label={p.label} onClick={() => onNavigate('mon-jardin')} />
            ))}
          </div>
        </div>
      )}

      {plantesRecolte.length > 0 && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="jd-kicker">À récolter en {moisLabel.toLowerCase()}</div>
            <button onClick={() => onNavigate('mon-jardin')} className="text-xs font-semibold tap-scale" style={{ color: 'var(--jd-accent)' }}>
              Mon jardin →
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
            {plantesRecolte.map(p => (
              <PlantChip key={p.id} emoji={p.emoji} label={p.label} onClick={() => onNavigate('mon-jardin')} />
            ))}
          </div>
        </div>
      )}

      <ChecklistSemaine
        plants={plants}
        moisIdx={moisIdx}
        regionOffset={regionOffset}
        checkedTaches={checkedTaches}
        weekKey={weekKey}
        onToggle={toggleChecklistTask}
      />

      {plants.length > 0 && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="jd-kicker">Mon jardin</div>
            <button onClick={() => onNavigate('mon-jardin')} className="text-xs font-semibold tap-scale" style={{ color: 'var(--jd-accent)' }}>
              Voir tout →
            </button>
          </div>
          <div
            className="rounded-card p-3"
            style={{ background: 'var(--jd-surface-glass)', backdropFilter: 'blur(var(--jd-blur))', WebkitBackdropFilter: 'blur(var(--jd-blur))', border: '1px solid var(--jd-border)' }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
              {plants.length} plante{plants.length > 1 ? 's' : ''} en cours
            </p>
            <div className="flex flex-wrap gap-2">
              {plants.slice(0, 5).map(p => {
                const status = getEffectiveStatus(p, regionOffset)
                const statut = ALL_STATUT_LABELS[status] ?? ALL_STATUT_LABELS.sowed
                return (
                  <div key={p.id} className="flex items-center gap-1.5">
                    <img
                      src={openmoji(p.emoji)}
                      alt=""
                      style={{ width: 18, height: 18 }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    <span
                      className="text-xs px-2 py-0.5 rounded-chip font-medium"
                      style={{ background: statut.color + '22', color: statut.color }}
                    >
                      {statut.label}
                    </span>
                  </div>
                )
              })}
              {plants.length > 5 && (
                <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>+{plants.length - 5} autres</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign-out */}
      <div className="mt-8 flex items-center justify-between" style={{ opacity: 0.55 }}>
        <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
          {user?.email}
        </span>
        <button
          onClick={signOut}
          className="text-xs tap-scale"
          style={{ color: 'var(--jd-ink-muted)' }}
        >
          Se déconnecter
        </button>
      </div>

    </div>
  )
}
