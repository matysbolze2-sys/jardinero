import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { estimerValeurRecolte, poidsRecolte } from '../data/prixRecoltes'

const MOIS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function euroCourt(v) {
  return `~${Math.round(v)} €`
}
function euroPrecis(v) {
  return `~${v.toFixed(2).replace('.', ',')} €`
}
function moisAnnee(iso) {
  const d = new Date(iso)
  return `${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ emoji, valeur, label, accent }) {
  return (
    <div
      className="rounded-card p-3 flex flex-col gap-0.5"
      style={{
        background: accent ? 'var(--jd-accent-soft)' : 'var(--jd-surface)',
        border:     `1px solid ${accent ? 'var(--jd-accent-ring)' : 'var(--jd-border)'}`,
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
      <span
        className="font-display font-extrabold"
        style={{ fontSize: 22, lineHeight: 1.1, color: accent ? 'var(--jd-accent)' : 'var(--jd-ink)' }}
      >
        {valeur}
      </span>
      <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>{label}</span>
    </div>
  )
}

// ── RecoltesView ─────────────────────────────────────────────────────────────
export default function RecoltesView() {
  const { profile } = useProfile()
  const historique  = profile.historique ?? []

  const annees = [...new Set(historique.map(h => new Date(h.harvestedAt).getFullYear()))]
    .sort((a, b) => b - a)

  const [anneeChoisie, setAnneeChoisie] = useState(null)
  const annee = anneeChoisie ?? annees[0] ?? new Date().getFullYear()

  if (historique.length === 0) {
    return (
      <div
        className="rounded-card p-6 text-center mt-2"
        style={{ background: 'var(--jd-surface)', border: '1px dashed var(--jd-accent-ring)' }}
      >
        <p className="text-3xl mb-2">🧺</p>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--jd-ink)' }}>Aucune récolte enregistrée</p>
        <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
          Récolte une plante depuis sa fiche pour voir tes récoltes et leur valeur ici.
        </p>
      </div>
    )
  }

  const entries = historique
    .filter(h => new Date(h.harvestedAt).getFullYear() === annee)
    .sort((a, b) => new Date(b.harvestedAt) - new Date(a.harvestedAt))

  const valeurs     = entries.map(e => estimerValeurRecolte(e.plantId, e.quantiteKg)).filter(v => v !== null)
  const totalValeur = valeurs.reduce((s, v) => s + v, 0)
  const hasValeur   = valeurs.length > 0
  const totalPoids  = entries
    .map(e => poidsRecolte(e.plantId, e.quantiteKg))
    .filter(v => v !== null)
    .reduce((s, v) => s + v, 0)
  const nbVarietes  = new Set(entries.map(e => e.plantId ?? e.name)).size

  return (
    <div className="mt-2">
      {/* Filtre année */}
      {annees.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar -mx-1 px-1">
          {annees.map(a => (
            <button
              key={a}
              onClick={() => setAnneeChoisie(a)}
              className="px-3 py-1.5 rounded-pill text-xs font-semibold flex-shrink-0 tap-scale"
              style={{
                background: a === annee ? 'var(--jd-accent)' : 'var(--jd-surface)',
                color:      a === annee ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
                border:     `1px solid ${a === annee ? 'var(--jd-accent)' : 'var(--jd-border)'}`,
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {/* Cartes de stats */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <StatCard emoji="🧺" valeur={entries.length} label={`récolte${entries.length > 1 ? 's' : ''}`} />
        <StatCard emoji="🌿" valeur={nbVarietes} label={`variété${nbVarietes > 1 ? 's' : ''}`} />
        {hasValeur && (
          <StatCard emoji="⚖️" valeur={`~${totalPoids.toFixed(totalPoids < 10 ? 1 : 0)} kg`} label="poids estimé" />
        )}
        {hasValeur && (
          <StatCard emoji="💶" valeur={euroCourt(totalValeur)} label="estimation prix marché" accent />
        )}
      </div>

      {/* Liste des récoltes */}
      <div className="flex flex-col gap-2">
        {entries.map(h => {
          const valeur = estimerValeurRecolte(h.plantId, h.quantiteKg)
          return (
            <div
              key={h.id}
              className="rounded-card p-3 flex items-center gap-3"
              style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--jd-ink)' }}>
                  {h.name}
                  {h.variety && (
                    <span className="font-normal ml-1.5" style={{ color: 'var(--jd-ink-muted)', fontSize: 12 }}>{h.variety}</span>
                  )}
                </p>
                <p className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>
                  Récoltée {moisAnnee(h.harvestedAt)}
                  {h.container && ' · 🪴 pot'}
                </p>
              </div>
              {valeur !== null && (
                <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--jd-accent)' }}>
                  {euroPrecis(valeur)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {hasValeur && (
        <p className="text-xs mt-4 text-center" style={{ color: 'var(--jd-ink-muted)' }}>
          Estimations basées sur les prix moyens du marché — un ordre de grandeur, pas un montant exact.
        </p>
      )}
    </div>
  )
}
