import { useProfile } from '../hooks/useProfile'
import {
  getFamillePlante, FAMILLES_ROTATION, ROTATION_SUCCESSION,
  respecteRotation, getHistoriqueByPlot,
} from '../data/rotation'

function moisDepuis(dateStr) {
  const months = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 30))
  if (months < 1) return 'récemment'
  if (months === 1) return 'il y a 1 mois'
  return `il y a ${months} mois`
}

function dateLocale(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Which families are ideal to plant in current season
function getSaisonSuggestions() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) {
    return {
      label: 'Ce printemps',
      icon: '🌱',
      families: [
        { famille: 'Légumineuses', note: 'fixent l\'azote' },
        { famille: 'Cucurbitacées', note: 'chaleur printanière' },
        { famille: 'Solanacées', note: 'après les gelées' },
      ],
    }
  }
  if (month >= 6 && month <= 8) {
    return {
      label: 'Cet été',
      icon: '☀️',
      families: [
        { famille: 'Cucurbitacées', note: 'plein été' },
        { famille: 'Astéracées', note: 'petites laitues d\'été' },
        { famille: 'Légumineuses', note: 'haricots en saison' },
      ],
    }
  }
  if (month >= 9 && month <= 11) {
    return {
      label: 'Cet automne',
      icon: '🍂',
      families: [
        { famille: 'Brassicacées', note: 'choux d\'hiver' },
        { famille: 'Alliacées', note: 'plantation ail/échalotes' },
        { famille: 'Chénopodiacées', note: 'épinards d\'automne' },
      ],
    }
  }
  return {
    label: 'Cet hiver',
    icon: '❄️',
    families: [
      { famille: 'Alliacées', note: 'ail, oignons en pots' },
      { famille: 'Brassicacées', note: 'choux résistants' },
    ],
  }
}

function FamilleBadge({ famille }) {
  const info = FAMILLES_ROTATION[famille]
  if (!info) return <span>{famille}</span>
  return (
    <span
      style={{
        fontSize: 10, padding: '2px 7px', borderRadius: 999,
        background: info.couleur, color: '#333',
        border: `1px solid ${info.couleurBord}`,
        fontWeight: 600, whiteSpace: 'nowrap',
      }}
    >
      {info.emoji} {famille}
    </span>
  )
}

function SectionParcelles({ gardens, historique }) {
  const allPlots = (gardens ?? []).flatMap(g =>
    (g.plots ?? []).map(p => ({ ...p, gardenName: g.name }))
  ).filter(p => getHistoriqueByPlot(p.id, historique).length > 0)

  if (allPlots.length === 0) return null

  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        Parcelles configurées
      </p>
      <div className="flex flex-col gap-3">
        {allPlots.map(plot => {
          const hist = getHistoriqueByPlot(plot.id, historique)
          const last = hist[0]
          const famille = last?.plantId ? getFamillePlante(last.plantId) : null
          const check = (famille && last) ? respecteRotation(last.plantId, last.harvestedAt) : { ok: true }
          const famInfo = famille ? FAMILLES_ROTATION[famille] : null
          const successors = famille ? (ROTATION_SUCCESSION[famille] ?? []).slice(0, 3) : []

          return (
            <div
              key={plot.id}
              className="rounded-card p-3"
              style={{
                background: check.ok ? 'var(--jd-surface-alt)' : (famInfo?.couleur ?? 'var(--jd-surface-alt)'),
                border: `1px solid ${check.ok ? 'var(--jd-border)' : (famInfo?.couleurBord ?? 'var(--jd-border)')}`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>
                    {plot.label || 'Parcelle sans nom'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
                    {plot.width}×{plot.height}m
                  </span>
                </div>
                {!check.ok && (
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: famInfo?.couleurBord ?? '#FED7AA', color: '#92400E', fontWeight: 700 }}>
                    ⏳ {check.moisRestants} mois
                  </span>
                )}
                {check.ok && last && (
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: 'rgba(166,227,107,0.15)', color: 'var(--jd-accent)', fontWeight: 700 }}>
                    ✓ Libre
                  </span>
                )}
              </div>
              {last && (
                <p className="text-xs mb-1" style={{ color: 'var(--jd-ink-muted)' }}>
                  Dernière culture : {last.emoji} <strong style={{ color: 'var(--jd-ink)' }}>{last.name}</strong>
                  {famille && <span> · {famille}</span>}
                  {' · '}récolté {moisDepuis(last.harvestedAt)}
                </p>
              )}
              {!check.ok && (
                <p className="text-xs mb-1.5" style={{ color: '#92400E' }}>
                  Recommandé à partir de <strong>{dateLocale(check.dateAutorisee)}</strong>
                </p>
              )}
              {successors.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>Suggestions :</span>
                  {successors.map(f => <FamilleBadge key={f} famille={f} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionSansParcelle({ historique }) {
  const latestByPlant = {}
  for (const h of historique) {
    if (!h.plantId || h.plotId) continue
    if (!latestByPlant[h.plantId] || h.harvestedAt > latestByPlant[h.plantId].harvestedAt) {
      latestByPlant[h.plantId] = h
    }
  }
  const entries = Object.values(latestByPlant)
    .map(h => {
      const check = respecteRotation(h.plantId, h.harvestedAt)
      if (check.ok) return null
      return { ...h, check }
    })
    .filter(Boolean)

  if (entries.length === 0) return null

  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        Récoltes sans parcelle assignée
      </p>
      <div className="flex flex-col gap-2">
        {entries.map((h, i) => {
          const famille = getFamillePlante(h.plantId)
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-card"
              style={{ background: 'rgba(240,184,108,0.07)', border: '1px solid rgba(240,184,108,0.3)' }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{h.emoji}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>
                  {h.name}
                  {famille && <span className="text-xs font-normal ml-1.5" style={{ color: 'var(--jd-ink-muted)' }}>({famille})</span>}
                </p>
                <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
                  Récolté {moisDepuis(h.harvestedAt)} · Évite cette famille avant{' '}
                  <strong style={{ color: '#f0b86c' }}>{dateLocale(h.check.dateAutorisee)}</strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionFamillesSures({ historique }) {
  const allFamilies = Object.keys(FAMILLES_ROTATION)

  const familiesEnRotation = new Set(
    (historique ?? [])
      .filter(h => h.plantId)
      .filter(h => !respecteRotation(h.plantId, h.harvestedAt).ok)
      .map(h => getFamillePlante(h.plantId))
      .filter(Boolean)
  )

  const latestByFamily = {}
  for (const h of (historique ?? [])) {
    if (!h.plantId) continue
    const fam = getFamillePlante(h.plantId)
    if (!fam) continue
    if (!latestByFamily[fam] || h.harvestedAt > latestByFamily[fam]) {
      latestByFamily[fam] = h.harvestedAt
    }
  }

  const sures = allFamilies.filter(f => !familiesEnRotation.has(f))
  if (sures.length === 0) return null

  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        Familles libres à planter
      </p>
      <div className="flex flex-wrap gap-2">
        {sures.map(f => {
          const info = FAMILLES_ROTATION[f]
          const lastDate = latestByFamily[f]
          return (
            <div
              key={f}
              className="flex items-center gap-1.5 px-3 py-2 rounded-card"
              style={{ background: info?.couleur ?? 'var(--jd-surface-alt)', border: `1px solid ${info?.couleurBord ?? 'var(--jd-border)'}` }}
            >
              <span>{info?.emoji ?? '🌿'}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--jd-ink)' }}>✅ {f}</p>
                <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
                  {lastDate ? `Dernière culture ${moisDepuis(lastDate)}` : 'Aucune culture récente'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionProchaines({ historique }) {
  const saisonInfo = getSaisonSuggestions()

  const familiesEnRotation = new Set(
    (historique ?? [])
      .filter(h => h.plantId && !respecteRotation(h.plantId, h.harvestedAt).ok)
      .map(h => getFamillePlante(h.plantId))
      .filter(Boolean)
  )

  const disponibles = saisonInfo.families.filter(f => !familiesEnRotation.has(f.famille))

  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
        Prochaines rotations conseillées
      </p>
      <div
        className="rounded-card p-3"
        style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--jd-ink)' }}>
          {saisonInfo.icon} {saisonInfo.label}
        </p>
        {disponibles.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            Toutes les familles conseillées sont actuellement en rotation. Patiente encore quelques mois.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {disponibles.map(({ famille, note }) => {
              const info = FAMILLES_ROTATION[famille]
              return (
                <div key={famille} className="flex items-center gap-2">
                  <span>{info?.emoji ?? '🌿'}</span>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--jd-ink)' }}>{famille}</span>
                    <span className="text-xs ml-1" style={{ color: 'var(--jd-ink-muted)' }}>— {note}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RotationDashboard() {
  const { profile } = useProfile()
  const historique  = profile.historique ?? []
  const gardens     = profile.gardens    ?? []

  const hasAnyData = historique.length > 0

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: 20 }}>🔄</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
          La rotation des cultures évite l'épuisement du sol et réduit les maladies en changeant de famille botanique chaque saison.
        </p>
      </div>

      {!hasAnyData ? (
        <div
          className="rounded-card p-6 text-center"
          style={{ background: 'var(--jd-surface)', border: '1px dashed var(--jd-accent-ring)' }}
        >
          <p className="text-3xl mb-2">🌱</p>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--jd-ink)' }}>Aucune récolte enregistrée</p>
          <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            Tes récoltes passées s'afficheront ici pour guider tes rotations futures.
          </p>
        </div>
      ) : (
        <>
          <SectionParcelles gardens={gardens} historique={historique} />
          <SectionSansParcelle historique={historique} />
          <SectionFamillesSures historique={historique} />
          <SectionProchaines historique={historique} />
        </>
      )}
    </div>
  )
}
