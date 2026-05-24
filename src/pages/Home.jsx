import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { MOIS_LABELS, STATUT_LABELS } from '../data/plants'
import { getPlantsToSowThisMonth, getPlantsToHarvestThisMonth } from '../utils/calendarUtils'
import MeteoWidget from '../components/MeteoWidget'
import { getTachesSemaine, getWeekKey } from '../data/taches'
import { getEtatArrosage, getFrequencePlante, ETAT_CONFIG } from '../utils/arrosageUtils'

// ─── Composants locaux ────────────────────────────────────────────────────────

function PlantChip({ emoji, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-chip text-xs font-medium flex-shrink-0 tap-scale"
      style={{ background: '#EAF3DE', color: '#3B6D11', border: '1px solid #97C459' }}
    >
      {emoji} {label}
    </button>
  )
}

// ─── Section "Aujourd'hui" ────────────────────────────────────────────────────

function SectionAujourdhui({ plants, soilId, arrosages, onNavigate }) {
  const today = new Date().toISOString().split('T')[0]

  const aArroser = plants.filter(p => {
    const freq  = getFrequencePlante(p, soilId)
    const etat  = getEtatArrosage(p.id, p.plantedAt, arrosages, freq)
    return etat === 'due' || etat === 'overdue'
  })

  const aRecolter = plants.filter(p => p.status === 'ready')

  const enGermination = plants.filter(p => {
    if (p.status !== 'sowed' || !p.plantedAt) return false
    const jours = Math.floor((Date.now() - new Date(p.plantedAt)) / 86400000)
    return jours < 10
  })

  const nothing = aArroser.length === 0 && aRecolter.length === 0 && enGermination.length === 0

  return (
    <div className="mb-5">
      <h2 className="font-fraunces text-base mb-3" style={{ color: '#3B6D11' }}>
        🌿 Aujourd'hui dans ton jardin
      </h2>

      {plants.length === 0 && (
        <button
          onClick={() => onNavigate('mon-jardin')}
          className="w-full rounded-card p-4 flex items-center gap-3 tap-scale text-left"
          style={{ background: '#3B6D11', color: 'white' }}
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
        <div className="rounded-card p-4 text-center" style={{ background: '#EAF3DE', border: '1px solid #DDE8CC' }}>
          <p style={{ fontSize: 32 }}>☀️</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#3B6D11' }}>Tout est en ordre !</p>
          <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>Aucune action requise aujourd'hui</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Plantes à arroser */}
        {aArroser.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{ background: '#FFF0ED', border: '2px solid #E05A3A33' }}
          >
            <span style={{ fontSize: 26 }}>🚿</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#B91C1C' }}>
                {aArroser.length} plante{aArroser.length > 1 ? 's' : ''} à arroser
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#9A6010' }}>
                {aArroser.slice(0, 3).map(p => p.emoji + ' ' + p.name).join(', ')}
                {aArroser.length > 3 ? ` +${aArroser.length - 3}` : ''}
              </p>
            </div>
            <span style={{ color: '#B91C1C', fontSize: 16 }}>→</span>
          </button>
        )}

        {/* Plantes à récolter */}
        {aRecolter.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{ background: '#FFF8EC', border: '2px solid #FAC77533' }}
          >
            <span style={{ fontSize: 26 }}>🧺</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#C27C12' }}>
                {aRecolter.length} prête{aRecolter.length > 1 ? 's' : ''} à récolter !
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#9A6010' }}>
                {aRecolter.slice(0, 3).map(p => p.emoji + ' ' + p.name).join(', ')}
              </p>
            </div>
            <span style={{ color: '#C27C12', fontSize: 16 }}>→</span>
          </button>
        )}

        {/* En germination */}
        {enGermination.length > 0 && (
          <button
            onClick={() => onNavigate('mon-jardin')}
            className="w-full rounded-card p-3 flex items-center gap-3 tap-scale text-left"
            style={{ background: '#F0FAE8', border: '2px solid #97C45933' }}
          >
            <span style={{ fontSize: 26 }}>🌱</span>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#3B6D11' }}>
                {enGermination.length} en germination
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7A5C' }}>
                Surveille l'humidité du sol ces 10 premiers jours
              </p>
            </div>
            <span style={{ color: '#3B6D11', fontSize: 16 }}>→</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

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
    <div className="px-4 pt-6 pb-4">

      {/* Hero */}
      <div
        className="rounded-card p-5 mb-5 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #3B6D11 0%, #527A20 100%)' }}
      >
        <div
          className="absolute -top-8 -right-8 rounded-full opacity-10"
          style={{ width: 140, height: 140, background: '#97C459' }}
        />
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#97C459' }}>
          {salut} 👋
        </p>
        <h1 className="font-fraunces text-2xl text-white leading-tight">
          {moisLabel} au potager
        </h1>
        {region && (
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
            🗺️ {region.label}
          </p>
        )}
      </div>

      {/* Météo */}
      <MeteoWidget />

      {/* Aujourd'hui dans ton jardin */}
      <SectionAujourdhui
        plants={plants}
        soilId={profile.soil}
        arrosages={profile.arrosages ?? {}}
        onNavigate={onNavigate}
      />

      {/* À semer ce mois */}
      {plantesSemer.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-fraunces text-base" style={{ color: '#3B6D11' }}>
              🌱 À semer en {moisLabel.toLowerCase()}
            </h2>
            <button onClick={() => onNavigate('conseiller')} className="text-xs font-semibold tap-scale" style={{ color: '#97C459' }}>
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

      {/* À récolter ce mois */}
      {plantesRecolte.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-fraunces text-base" style={{ color: '#3B6D11' }}>
              🧺 À récolter en {moisLabel.toLowerCase()}
            </h2>
            <button onClick={() => onNavigate('mon-jardin')} className="text-xs font-semibold tap-scale" style={{ color: '#97C459' }}>
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

      {/* Checklist hebdomadaire */}
      {tachesSemaine.length > 0 && (
        <div className="mb-5">
          <h2 className="font-fraunces text-base mb-2.5" style={{ color: '#3B6D11' }}>
            ✅ Cette semaine au jardin
          </h2>
          <div
            className="rounded-card overflow-hidden"
            style={{ border: '1px solid #DDE8CC', background: 'white' }}
          >
            {tachesSemaine.map((tache, i) => {
              const isChecked = checkedTaches.includes(tache.tache)
              return (
                <button
                  key={tache.tache}
                  onClick={() => toggleChecklistTask(tache.tache)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left tap-scale"
                  style={{
                    background:   isChecked ? '#F0FAE8' : 'white',
                    borderBottom: i < tachesSemaine.length - 1 ? '1px solid #EAF3DE' : 'none',
                  }}
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                    style={{
                      background: isChecked ? '#97C459' : 'white',
                      border:     isChecked ? '2px solid #97C459' : '2px solid #DDE8CC',
                    }}
                  >
                    {isChecked && <span style={{ fontSize: 11, color: 'white', fontWeight: 800 }}>✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14 }}>{tache.icone}</span>
                      <p
                        className="text-sm leading-snug"
                        style={{
                          color:          isChecked ? '#6B7A5C' : '#1A2010',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {tache.tache}
                      </p>
                    </div>
                    {tache.plante && (
                      <p className="text-xs mt-0.5" style={{ color: '#97C459', fontWeight: 600 }}>
                        Pour votre {tache.plante}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <p className="text-xs mt-1.5 text-right" style={{ color: '#9CAB8C' }}>
            {checkedTaches.length}/{tachesSemaine.length} · Se remet à zéro chaque lundi
          </p>
        </div>
      )}

      {/* Résumé Mon Jardin */}
      {plants.length > 0 && (
        <div className="mb-5">
          <h2 className="font-fraunces text-base mb-2.5" style={{ color: '#3B6D11' }}>
            Mon jardin
          </h2>
          <div className="rounded-card p-4" style={{ background: 'white', border: '1px solid #DDE8CC' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-sm" style={{ color: '#1A2010' }}>
                {plants.length} plante{plants.length > 1 ? 's' : ''} en cours
              </p>
              <button
                onClick={() => onNavigate('mon-jardin')}
                className="text-xs font-semibold tap-scale"
                style={{ color: '#3B6D11' }}
              >
                Voir tout →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {plants.slice(0, 5).map(p => {
                const statut = STATUT_LABELS[p.status]
                return (
                  <div key={p.id} className="flex items-center gap-1.5">
                    <span className="text-lg">{p.emoji}</span>
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
                <span className="text-xs" style={{ color: '#6B7A5C' }}>+{plants.length - 5} autres</span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
