import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { MOIS_LABELS, STATUT_LABELS } from '../data/plants'
import { getPlantsToSowThisMonth, getPlantsToHarvestThisMonth } from '../utils/calendarUtils'
import MeteoWidget from '../components/MeteoWidget'
import { getTachesSemaine, getWeekKey } from '../data/taches'
import { getEtatArrosage, getFrequencePlante } from '../utils/arrosageUtils'
import { openmoji } from '../utils/openmoji'

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

function ArrowIcon() {
  const s = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return <svg viewBox="0 0 24 24" style={s}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function SectionAujourdhui({ plants, soilId, arrosages, onNavigate }) {
  const aArroser = plants.filter(p => {
    const freq = getFrequencePlante(p, soilId)
    const etat = getEtatArrosage(p.id, p.plantedAt, arrosages, freq)
    return etat === 'due' || etat === 'overdue'
  })

  const aRecolter     = plants.filter(p => p.status === 'ready')
  const enGermination = plants.filter(p => {
    if (p.status !== 'sowed' || !p.plantedAt) return false
    return Math.floor((Date.now() - new Date(p.plantedAt)) / 86400000) < 10
  })

  const nothing = aArroser.length === 0 && aRecolter.length === 0 && enGermination.length === 0

  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="jd-kicker">Aujourd'hui dans ton jardin</div>
      </div>

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

      {plants.length > 0 && nothing && (
        <div
          className="rounded-card p-4 flex items-center gap-3"
          style={{
            background:           'var(--jd-surface-glass)',
            backdropFilter:       'blur(var(--jd-blur))',
            WebkitBackdropFilter: 'blur(var(--jd-blur))',
            border:               '1px solid var(--jd-border)',
          }}
        >
          <div
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--jd-accent), var(--jd-accent-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--jd-accent-ink)',
            }}
          >
            <SproutIcon />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--jd-accent)' }}>Tout est en ordre !</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>Aucune action requise aujourd'hui</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2">
        {aArroser.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{ background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)' }}
          >
            <span style={{ fontSize: 26 }}>🚿</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#E05A3A' }}>
                {aArroser.length} plante{aArroser.length > 1 ? 's' : ''} à arroser
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#E05A3A', opacity: 0.8 }}>
                {aArroser.slice(0, 3).map(p => p.name).join(', ')}
                {aArroser.length > 3 ? ` +${aArroser.length - 3}` : ''}
              </p>
            </div>
            <ArrowIcon />
          </button>
        )}

        {aRecolter.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{ background: 'var(--jd-warning-soft)', border: '1px solid rgba(240,184,108,0.3)' }}
          >
            <span style={{ fontSize: 26 }}>🧺</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: 'var(--jd-warning)' }}>
                {aRecolter.length} prête{aRecolter.length > 1 ? 's' : ''} à récolter !
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--jd-warning)', opacity: 0.8 }}>
                {aRecolter.slice(0, 3).map(p => p.name).join(', ')}
              </p>
            </div>
            <ArrowIcon />
          </button>
        )}

        {enGermination.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{
              background:           'var(--jd-surface-glass)',
              backdropFilter:       'blur(var(--jd-blur))',
              WebkitBackdropFilter: 'blur(var(--jd-blur))',
              border:               '1px solid var(--jd-accent-ring)',
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--jd-accent), var(--jd-accent-dim))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--jd-accent-ink)',
              }}
            >
              <SproutIcon />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: 'var(--jd-accent)' }}>
                {enGermination.length} en germination
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--jd-ink-muted)' }}>
                Surveille l'humidité du sol ces 10 premiers jours
              </p>
            </div>
            <ArrowIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Home({ onNavigate }) {
  const { profile, toggleChecklistTask } = useProfile()
  const region      = getRegionById(profile.region)
  const offsetWeeks = region?.offset ?? 0
  const moisIdx     = new Date().getMonth()
  const moisLabel   = MOIS_LABELS[moisIdx]
  const plants      = profile.plants ?? []

  const plantesSemer   = getPlantsToSowThisMonth(offsetWeeks)
  const plantesRecolte = getPlantsToHarvestThisMonth(offsetWeeks)

  const heure = new Date().getHours()
  const salut = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'

  const plantIds      = plants.map(p => p.plantId).filter(Boolean)
  const tachesSemaine = getTachesSemaine(moisIdx, plantIds, 5)
  const weekKey       = getWeekKey()
  const checkedTaches = profile.checklistWeek?.[weekKey] ?? []

  return (
    <div className="px-4 pt-5 pb-4">

      {/* Hero */}
      <div
        className="rounded-card mb-4 overflow-hidden relative"
        style={{
          height: 160,
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

      <SectionAujourdhui
        plants={plants}
        soilId={profile.soil}
        arrosages={profile.arrosages ?? {}}
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

      {tachesSemaine.length > 0 && (
        <div className="mb-5">
          <div className="jd-kicker mb-3">Cette semaine au jardin</div>
          <div
            className="rounded-card overflow-hidden"
            style={{ border: '1px solid var(--jd-border)', background: 'var(--jd-surface-glass)', backdropFilter: 'blur(var(--jd-blur))', WebkitBackdropFilter: 'blur(var(--jd-blur))' }}
          >
            {tachesSemaine.map((tache, i) => {
              const isChecked = checkedTaches.includes(tache.tache)
              return (
                <button
                  key={tache.tache}
                  onClick={() => toggleChecklistTask(tache.tache)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left tap-scale"
                  style={{
                    background:   isChecked ? 'rgba(166,227,107,0.04)' : 'transparent',
                    borderBottom: i < tachesSemaine.length - 1 ? '1px solid var(--jd-border)' : 'none',
                  }}
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center transition-all"
                    style={{
                      borderRadius:    5,
                      background: isChecked ? 'var(--jd-accent)' : 'transparent',
                      border:     isChecked ? '2px solid var(--jd-accent)' : '1.5px solid var(--jd-accent)',
                    }}
                  >
                    {isChecked && <span style={{ fontSize: 11, color: 'var(--jd-accent-ink)', fontWeight: 800 }}>✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14 }}>{tache.icone}</span>
                      <p
                        className="text-sm leading-snug"
                        style={{
                          color:          isChecked ? 'var(--jd-ink-muted)' : 'var(--jd-ink)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {tache.tache}
                      </p>
                    </div>
                    {tache.plante && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--jd-accent)', fontWeight: 600 }}>
                        Pour votre {tache.plante}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <p className="text-xs mt-1.5 text-right" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
            {checkedTaches.length}/{tachesSemaine.length} · remise à zéro chaque lundi
          </p>
        </div>
      )}

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
            style={{
              background:           'var(--jd-surface-glass)',
              backdropFilter:       'blur(var(--jd-blur))',
              WebkitBackdropFilter: 'blur(var(--jd-blur))',
              border:               '1px solid var(--jd-border)',
            }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
              {plants.length} plante{plants.length > 1 ? 's' : ''} en cours
            </p>
            <div className="flex flex-wrap gap-2">
              {plants.slice(0, 5).map(p => {
                const statut = STATUT_LABELS[p.status]
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

    </div>
  )
}
