import { useProfile } from '../hooks/useProfile'
import {
  getFamillePlante, FAMILLES_ROTATION, ROTATION_SUCCESSION,
  respecteRotation, getHistoriqueByPlot,
} from '../data/rotation'

// ── Palette des 4 groupes de rotation ─────────────────────────────────────────
//   Légumineuses  → lime  (--jd-accent)
//   Feuilles      → teal  (--jd-water)
//   Fruits        → bark  (--jd-harvest)
//   Racines       → abricot (--jd-warning)

const FAMILLE_GROUPE = {
  'Légumineuses':   'legumineuses',
  'Solanacées':     'fruits',
  'Cucurbitacées':  'fruits',
  'Poaceae':        'fruits',
  'Brassicacées':   'feuilles',
  'Chénopodiacées': 'feuilles',
  'Astéracées':     'feuilles',
  'Apiacées':       'racines',
  'Alliacées':      'racines',
  'Liliacées':      'racines',
}

const GROUPE_CONFIG = {
  legumineuses: { color: 'var(--jd-accent)',   soft: 'var(--jd-accent-soft)',   ring: 'var(--jd-accent-ring)',   label: 'Légumineuses' },
  feuilles:     { color: 'var(--jd-water)',    soft: 'var(--jd-water-soft)',    ring: 'var(--jd-water-ring)',    label: 'Feuilles' },
  fruits:       { color: 'var(--jd-harvest)',  soft: 'var(--jd-harvest-soft)',  ring: 'var(--jd-harvest-ring)',  label: 'Fruits' },
  racines:      { color: 'var(--jd-warning)',  soft: 'var(--jd-warning-soft)',  ring: 'var(--jd-warning-ring)',  label: 'Racines' },
}

function getGC(famille) {
  return GROUPE_CONFIG[FAMILLE_GROUPE[famille] ?? 'racines']
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function getSaisonSuggestions() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return {
    label: 'Ce printemps', icon: '🌱',
    families: [
      { famille: 'Légumineuses',  note: 'fixent l\'azote' },
      { famille: 'Cucurbitacées', note: 'chaleur printanière' },
      { famille: 'Solanacées',    note: 'après les gelées' },
    ],
  }
  if (month >= 6 && month <= 8) return {
    label: 'Cet été', icon: '☀️',
    families: [
      { famille: 'Cucurbitacées',  note: 'plein été' },
      { famille: 'Astéracées',     note: 'petites laitues d\'été' },
      { famille: 'Légumineuses',   note: 'haricots en saison' },
    ],
  }
  if (month >= 9 && month <= 11) return {
    label: 'Cet automne', icon: '🍂',
    families: [
      { famille: 'Brassicacées',   note: 'choux d\'hiver' },
      { famille: 'Alliacées',      note: 'plantation ail/échalotes' },
      { famille: 'Chénopodiacées', note: 'épinards d\'automne' },
    ],
  }
  return {
    label: 'Cet hiver', icon: '❄️',
    families: [
      { famille: 'Alliacées',    note: 'ail, oignons en pots' },
      { famille: 'Brassicacées', note: 'choux résistants' },
    ],
  }
}

// ── FamilleBadge — pill jd-chip aux couleurs du groupe ───────────────────────

function FamilleBadge({ famille }) {
  const info = FAMILLES_ROTATION[famille]
  const gc   = getGC(famille)
  return (
    <span
      className="jd-chip"
      style={{ background: gc.soft, color: gc.color, borderColor: gc.ring, fontSize: 9, padding: '2px 8px' }}
    >
      {info?.emoji ?? '🌿'} {famille}
    </span>
  )
}

// ── SectionParcelles ──────────────────────────────────────────────────────────

function SectionParcelles({ gardens, historique }) {
  const allPlots = (gardens ?? []).flatMap(g =>
    (g.plots ?? []).map(p => ({ ...p, gardenName: g.name }))
  ).filter(p => getHistoriqueByPlot(p.id, historique).length > 0)

  if (allPlots.length === 0) return null

  return (
    <div className="mb-6">
      <p className="jd-kicker mb-3">Parcelles configurées</p>
      <div className="flex flex-col gap-3">
        {allPlots.map((plot, i) => {
          const hist     = getHistoriqueByPlot(plot.id, historique)
          const last     = hist[0]
          const famille  = last?.plantId ? getFamillePlante(last.plantId) : null
          const check    = (famille && last) ? respecteRotation(last.plantId, last.harvestedAt) : { ok: true }
          const gc       = famille ? getGC(famille) : null
          const successors = famille ? (ROTATION_SUCCESSION[famille] ?? []).slice(0, 3) : []

          return (
            <div
              key={plot.id}
              className="glass-card p-3 page-enter"
              style={{
                background:     check.ok ? 'var(--jd-surface-glass)' : (gc?.soft ?? 'var(--jd-surface-glass)'),
                border:         `1px solid ${check.ok ? 'var(--jd-border)' : (gc?.ring ?? 'var(--jd-border)')}`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              {/* En-tête parcelle */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>
                    {plot.label || 'Parcelle sans nom'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
                    {plot.width}×{plot.height}m
                  </span>
                </div>
                {!check.ok && gc ? (
                  <span
                    className="jd-chip"
                    style={{ background: gc.soft, color: gc.color, borderColor: gc.ring, fontSize: 9, padding: '2px 8px' }}
                  >
                    ⏳ {check.moisRestants} mois
                  </span>
                ) : check.ok && last ? (
                  <span
                    className="jd-chip"
                    style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', borderColor: 'var(--jd-accent-ring)', fontSize: 9, padding: '2px 8px' }}
                  >
                    ✓ Libre
                  </span>
                ) : null}
              </div>

              {/* Dernière culture */}
              {last && (
                <p className="text-xs mb-1" style={{ color: 'var(--jd-ink-muted)' }}>
                  Dernière culture : {last.emoji}{' '}
                  <strong style={{ color: 'var(--jd-ink)' }}>{last.name}</strong>
                  {famille && <span> · {famille}</span>}
                  {' · '}récolté {moisDepuis(last.harvestedAt)}
                </p>
              )}

              {/* Alerte rotation */}
              {!check.ok && gc && (
                <p className="text-xs mb-1.5" style={{ color: gc.color }}>
                  Recommandé à partir de <strong>{dateLocale(check.dateAutorisee)}</strong>
                </p>
              )}

              {/* Suggestions de succession */}
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

// ── SectionSansParcelle ───────────────────────────────────────────────────────

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
      <p className="jd-kicker mb-3">Récoltes sans parcelle assignée</p>
      <div className="flex flex-col gap-2">
        {entries.map((h, i) => {
          const famille = getFamillePlante(h.plantId)
          const gc      = famille ? getGC(famille) : null
          return (
            <div
              key={i}
              className="glass-card flex items-start gap-3 p-3 page-enter"
              style={{
                background:     gc?.soft ?? 'var(--jd-warning-soft)',
                border:         `1px solid ${gc?.ring ?? 'var(--jd-warning-ring)'}`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{h.emoji}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>
                  {h.name}
                  {famille && (
                    <span className="text-xs font-normal ml-1.5" style={{ color: 'var(--jd-ink-muted)' }}>({famille})</span>
                  )}
                </p>
                <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
                  Récolté {moisDepuis(h.harvestedAt)} · Évite cette famille avant{' '}
                  <strong style={{ color: gc?.color ?? 'var(--jd-warning)' }}>
                    {dateLocale(h.check.dateAutorisee)}
                  </strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SectionFamillesSures ──────────────────────────────────────────────────────

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
      <p className="jd-kicker mb-3">Familles libres à planter</p>
      <div className="flex flex-wrap gap-2">
        {sures.map(f => {
          const info    = FAMILLES_ROTATION[f]
          const gc      = getGC(f)
          const lastDate = latestByFamily[f]
          return (
            <div
              key={f}
              className="glass-card flex items-center gap-2 px-3 py-2.5"
              style={{ background: gc.soft, border: `1px solid ${gc.ring}` }}
            >
              <span style={{ fontSize: 20 }}>{info?.emoji ?? '🌿'}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: gc.color }}>✓ {f}</p>
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

// ── SectionProchaines ─────────────────────────────────────────────────────────

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
      <p className="jd-kicker mb-3">Prochaines rotations conseillées</p>
      <div className="glass-card p-3">
        <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--jd-ink)' }}>
          {saisonInfo.icon} {saisonInfo.label}
        </p>
        {disponibles.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
            Toutes les familles conseillées sont actuellement en rotation. Patiente encore quelques mois.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {disponibles.map(({ famille, note }) => {
              const info = FAMILLES_ROTATION[famille]
              const gc   = getGC(famille)
              return (
                <div key={famille} className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: gc.soft, fontSize: 16 }}
                  >
                    {info?.emoji ?? '🌿'}
                  </span>
                  <div>
                    <span className="text-xs font-semibold" style={{ color: gc.color }}>{famille}</span>
                    <span className="text-xs ml-1.5" style={{ color: 'var(--jd-ink-muted)' }}>— {note}</span>
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

// ── RotationDashboard ─────────────────────────────────────────────────────────

export default function RotationDashboard() {
  const { profile } = useProfile()
  const historique  = profile.historique ?? []
  const gardens     = profile.gardens    ?? []
  const hasAnyData  = historique.length > 0

  return (
    <div className="mt-2">
      {/* Intro */}
      <div className="flex items-start gap-2 mb-4">
        <span style={{ fontSize: 20, flexShrink: 0 }}>🔄</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
          La rotation des cultures évite l'épuisement du sol et réduit les maladies
          en changeant de famille botanique chaque saison.
        </p>
      </div>

      {/* Légende groupes */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(GROUPE_CONFIG).map(([key, gc]) => (
          <span
            key={key}
            className="jd-chip"
            style={{ background: gc.soft, color: gc.color, borderColor: gc.ring, fontSize: 9, padding: '3px 10px' }}
          >
            {gc.label}
          </span>
        ))}
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
