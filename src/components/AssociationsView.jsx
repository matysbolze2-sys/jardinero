import { useProfile } from '../hooks/useProfile'
import { ASSOCIATIONS, getBestNeighbors } from '../data/associations'
import { respecteRotation, getFamillePlante, FAMILLES_ROTATION } from '../data/rotation'
import EmojiIllo from './EmojiIllo'

// ── Config couleurs associations ───────────────────────────────────────────────
//   Favorable  → --jd-accent     + --jd-accent-soft
//   Défavorable→ --jd-harvest    + --jd-harvest-soft
//   Neutre     → --jd-ink-muted  + --jd-surface-alt

const INTENSITE_CONFIG = {
  forte:   { label: 'FORT',   color: 'var(--jd-accent)',     bg: 'var(--jd-accent-soft)',   border: 'var(--jd-accent-ring)' },
  moderee: { label: 'MODÉRÉ', color: 'var(--jd-warning)',    bg: 'var(--jd-warning-soft)',  border: 'var(--jd-warning-ring)' },
  faible:  { label: 'FAIBLE', color: 'var(--jd-ink-muted)',  bg: 'var(--jd-surface-alt)',   border: 'var(--jd-border)' },
}

const INTENSITE_MAUVAISE = {
  forte:   { label: 'FORT',   color: 'var(--jd-harvest)',    bg: 'var(--jd-harvest-soft)',  border: 'var(--jd-harvest-ring)' },
  moderee: { label: 'MODÉRÉ', color: 'var(--jd-warning)',    bg: 'var(--jd-warning-soft)',  border: 'var(--jd-warning-ring)' },
  faible:  { label: 'FAIBLE', color: 'var(--jd-ink-muted)',  bg: 'var(--jd-surface-alt)',   border: 'var(--jd-border)' },
}

const CAT_LABELS = {
  protection:    { label: 'Protection',    icon: '🛡️' },
  nutrition:     { label: 'Nutrition',     icon: '💚' },
  pollinisation: { label: 'Pollinisation', icon: '🐝' },
  structure:     { label: 'Structure',     icon: '🌿' },
}

const DISTANCE_LABEL = {
  contact: '🤝 Contact',
  proche:  '📍 Proche',
  loin:    '🌍 À distance',
}

// ── IntensitéBadge — pill jd-chip avec couleur d'association ──────────────────

function IntensiteBadge({ intensite, type = 'bonne' }) {
  const cfg = (type === 'bonne' ? INTENSITE_CONFIG : INTENSITE_MAUVAISE)[intensite] ?? INTENSITE_CONFIG.faible
  return (
    <span
      className="jd-chip"
      style={{
        background:  cfg.bg,
        color:       cfg.color,
        borderColor: cfg.border,
        fontSize:    9,
        padding:     '2px 7px',
      }}
    >
      {cfg.label}
    </span>
  )
}

// ── LigneAssociation ──────────────────────────────────────────────────────────

function LigneAssociation({ item, dansJardin, type }) {
  const isBonne = type === 'bonne'
  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b last:border-0"
      style={{ borderColor: isBonne ? 'var(--jd-accent-ring)' : 'var(--jd-harvest-ring)' }}
    >
      <EmojiIllo emoji={item.emoji} size={44} ring />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>{item.plante}</span>
          <IntensiteBadge intensite={item.intensite} type={type} />
          {item.distance && (
            <span style={{ fontSize: 9, color: 'var(--jd-ink-muted)', fontFamily: 'var(--jd-font-mono)' }}>
              {DISTANCE_LABEL[item.distance]}
            </span>
          )}
          {dansJardin && (
            <span
              className="jd-chip"
              style={{
                background:  isBonne ? 'var(--jd-accent-soft)'   : 'var(--jd-harvest-soft)',
                color:       isBonne ? 'var(--jd-accent)'         : 'var(--jd-harvest)',
                borderColor: isBonne ? 'var(--jd-accent-ring)'    : 'var(--jd-harvest-ring)',
                fontSize:    9,
                padding:     '2px 7px',
              }}
            >
              {isBonne ? '✓ Dans ton jardin' : '⚠️ Dans ton jardin'}
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>{item.raison}</p>
      </div>
    </div>
  )
}

// ── GroupeBonnes ──────────────────────────────────────────────────────────────

function GroupeBonnes({ items, gardenPlants, categorie }) {
  const cfg = CAT_LABELS[categorie]
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ fontSize: 14 }}>{cfg?.icon ?? '✅'}</span>
        <p
          className="jd-kicker"
          style={{ color: 'var(--jd-accent)' }}
        >
          {cfg?.label ?? categorie}
        </p>
      </div>
      {items.map((item, i) => {
        const dansJardin = gardenPlants.some(p => (p.name ?? '').toLowerCase() === item.plante.toLowerCase())
        return <LigneAssociation key={i} item={item} dansJardin={dansJardin} type="bonne" />
      })}
    </div>
  )
}

// ── CarteAssociation ──────────────────────────────────────────────────────────

function CarteAssociation({ plant, gardenPlants, onAddPlant, delay = 0 }) {
  const assoc = ASSOCIATIONS[plant.plantId]
  if (!assoc) return null

  const conflits  = assoc.mauvaises.filter(m => gardenPlants.some(p => (p.name ?? '').toLowerCase() === m.plante.toLowerCase()))
  const synergies = assoc.bonnes.filter(b => gardenPlants.some(p => (p.name ?? '').toLowerCase() === b.plante.toLowerCase()))

  // Grouper les bonnes par catégorie
  const grouped = {}
  for (const b of assoc.bonnes) {
    const cat = b.categorie ?? 'structure'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(b)
  }
  const catOrder    = ['protection', 'nutrition', 'pollinisation', 'structure']
  const sortedGroups = catOrder.filter(c => grouped[c]).concat(Object.keys(grouped).filter(c => !catOrder.includes(c)))

  const manquantes = getBestNeighbors(plant.plantId, gardenPlants).slice(0, 3)

  return (
    <div
      className="rounded-card overflow-hidden mb-4 page-enter"
      style={{
        border:         conflits.length > 0 ? '1px solid var(--jd-harvest-ring)' : '1px solid var(--jd-border)',
        background:     'var(--jd-surface)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* En-tête — EmojiIllo 44 ring + nom + compteurs */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: conflits.length > 0 ? 'var(--jd-harvest-soft)' : 'var(--jd-surface-alt)' }}
      >
        <div className="flex items-center gap-3">
          <EmojiIllo emoji={plant.emoji} size={44} ring />
          <span className="font-display font-bold text-base" style={{ color: 'var(--jd-ink)' }}>
            {plant.name}
          </span>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {synergies.length > 0 && (
            <span className="jd-chip">
              ✓ {synergies.length} synergie{synergies.length > 1 ? 's' : ''}
            </span>
          )}
          {conflits.length > 0 && (
            <span
              className="jd-chip"
              style={{ background: 'var(--jd-harvest-soft)', color: 'var(--jd-harvest)', borderColor: 'var(--jd-harvest-ring)' }}
            >
              ⚠️ {conflits.length} conflit{conflits.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Bonnes associations groupées par catégorie */}
      {assoc.bonnes.length > 0 && (
        <div className="px-4 pt-3 pb-1">
          {sortedGroups.map(cat => (
            <GroupeBonnes key={cat} items={grouped[cat]} gardenPlants={gardenPlants} categorie={cat} />
          ))}
        </div>
      )}

      {/* Mauvaises associations */}
      {assoc.mauvaises.length > 0 && (
        <div className="px-4 pt-2 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span style={{ fontSize: 14 }}>⚠️</span>
            <p className="jd-kicker" style={{ color: 'var(--jd-harvest)' }}>À éviter</p>
          </div>
          {assoc.mauvaises.map((item, i) => {
            const dansJardin = gardenPlants.some(p => (p.name ?? '').toLowerCase() === item.plante.toLowerCase())
            return <LigneAssociation key={i} item={item} dansJardin={dansJardin} type="mauvaise" />
          })}
        </div>
      )}

      {/* Suggestions de plantes manquantes */}
      {manquantes.length > 0 && onAddPlant && (
        <div
          className="px-4 py-3 flex items-start gap-3"
          style={{ borderTop: '1px solid var(--jd-border)', background: 'var(--jd-bg)' }}
        >
          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>💡</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
              Pour optimiser, ajoute :
            </p>
            <div className="flex gap-2 flex-wrap">
              {manquantes.map((n, i) => (
                <button
                  key={i}
                  onClick={onAddPlant}
                  className="jd-chip tap-scale"
                  style={{ cursor: 'pointer' }}
                >
                  {n.emoji} {n.plante} →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SectionRotation ───────────────────────────────────────────────────────────

function SectionRotation({ historique }) {
  const latestByPlant = {}
  for (const h of historique) {
    if (!h.plantId) continue
    if (!latestByPlant[h.plantId] || h.harvestedAt > latestByPlant[h.plantId].harvestedAt) {
      latestByPlant[h.plantId] = h
    }
  }

  const alerts = Object.values(latestByPlant)
    .map(h => {
      const check = respecteRotation(h.plantId, h.harvestedAt)
      if (check.ok) return null
      const famille = getFamillePlante(h.plantId)
      return { ...h, famille, familleInfo: famille ? FAMILLES_ROTATION[famille] : null, moisRestants: check.moisRestants, dateAutorisee: check.dateAutorisee }
    })
    .filter(Boolean)
    .sort((a, b) => b.moisRestants - a.moisRestants)

  function moisDepuis(dateStr) {
    const months = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 30))
    if (months < 1) return 'récemment'
    if (months === 1) return '1 mois'
    return `${months} mois`
  }

  return (
    <div className="mt-6 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 18 }}>🔄</span>
        <h3 className="font-display font-bold text-base" style={{ color: 'var(--jd-ink)' }}>
          Rotation des cultures
        </h3>
      </div>

      {alerts.length === 0 ? (
        <div
          className="rounded-card p-4 text-center"
          style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>
            Tes récoltes passées s'afficheront ici pour guider tes rotations.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-card page-enter"
              style={{ background: 'var(--jd-warning-soft)', border: '1px solid var(--jd-warning-ring)', animationDelay: `${i * 40}ms` }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>{a.name}</span>
                  {a.famille && (
                    <span
                      className="jd-chip"
                      style={{ background: 'var(--jd-warning-soft)', color: 'var(--jd-warning)', borderColor: 'var(--jd-warning-ring)', fontSize: 9, padding: '2px 7px' }}
                    >
                      {a.famille}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
                  Récolté il y a {moisDepuis(a.harvestedAt)} · Évite de replanter avant{' '}
                  <strong style={{ color: 'var(--jd-warning)' }}>
                    {new Date(a.dateAutorisee).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </strong>
                  {' '}({a.moisRestants} mois restants)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── AssociationsView ──────────────────────────────────────────────────────────

export default function AssociationsView({ onAddPlant }) {
  const { profile } = useProfile()
  const plants     = profile.plants ?? []
  const historique = profile.historique ?? []

  const plantsAvecAssoc = plants.filter(p => p.plantId && ASSOCIATIONS[p.plantId])

  const conflitsJardin = []
  for (const plant of plantsAvecAssoc) {
    const assoc = ASSOCIATIONS[plant.plantId]
    for (const mauvaise of assoc.mauvaises) {
      if (plants.some(p => (p.name ?? '').toLowerCase() === mauvaise.plante.toLowerCase())) {
        const cfg = INTENSITE_MAUVAISE[mauvaise.intensite] ?? INTENSITE_MAUVAISE.faible
        conflitsJardin.push({ plante: plant.name, compagne: mauvaise.plante, raison: mauvaise.raison, intensite: mauvaise.intensite, cfg })
      }
    }
  }

  if (plants.length === 0) return null

  if (plantsAvecAssoc.length === 0) {
    return (
      <div className="mt-4 text-center py-10 px-4" style={{ color: 'var(--jd-ink-muted)' }}>
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-sm">Aucune donnée d'association pour tes plantes actuelles.</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      {/* Légende */}
      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--jd-ink-muted)' }}>
        Certaines plantes se protègent mutuellement, d'autres se nuisent.
        Les badges{' '}
        <strong style={{ color: 'var(--jd-accent)' }}>✓ Dans ton jardin</strong> et{' '}
        <strong style={{ color: 'var(--jd-harvest)' }}>⚠️ Dans ton jardin</strong>{' '}
        signalent les plantes déjà présentes.
      </p>

      {/* Bannière conflits globaux */}
      {conflitsJardin.length > 0 && (
        <div
          className="rounded-card p-4 mb-5"
          style={{ background: 'var(--jd-harvest-soft)', border: '1px solid var(--jd-harvest-ring)' }}
        >
          <p className="font-semibold text-sm mb-2" style={{ color: 'var(--jd-harvest)' }}>
            ⚠️ {conflitsJardin.length} conflit{conflitsJardin.length > 1 ? 's' : ''} détecté{conflitsJardin.length > 1 ? 's' : ''} dans ton jardin
          </p>
          {conflitsJardin.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
              <span
                className="jd-chip"
                style={{ background: c.cfg.bg, color: c.cfg.color, borderColor: c.cfg.border, fontSize: 9, padding: '2px 7px' }}
              >
                {c.cfg.label}
              </span>
              <p className="text-xs" style={{ color: 'var(--jd-harvest)', opacity: 0.9 }}>
                <strong>{c.plante}</strong> + <strong>{c.compagne}</strong> — {c.raison}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Cartes par plante — cascade page-enter */}
      {plantsAvecAssoc.map((plant, i) => (
        <CarteAssociation
          key={plant.id}
          plant={plant}
          gardenPlants={plants}
          onAddPlant={onAddPlant}
          delay={i * 40}
        />
      ))}

      {/* Section rotation */}
      <SectionRotation historique={historique} />

      {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length > 0 && (
        <p className="text-xs text-center mt-2" style={{ color: 'var(--jd-ink-muted)' }}>
          {plants.filter(p => !p.plantId || !ASSOCIATIONS[p.plantId]).length} plante(s) sans données de compagnonnage
        </p>
      )}
    </div>
  )
}
