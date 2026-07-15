import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { getRegionById } from '../data/regions'
import { getSoilById } from '../data/soils'
import { CONSEILS_MENSUELS } from '../data/conseils'
import { MOIS_LABELS } from '../data/plants'
import { ALL_STATUT_LABELS } from '../utils/plantStatusUtils'
import { getPersonalizedAdvice, getEnrichedMonthlyAdvice } from '../utils/adviceEngine'
import SuggestionsProactives from '../components/SuggestionsProactives'
import RisquesSaison from '../components/RisquesSaison'
import AiChat from '../components/AiChat'
import { useGeminiSuggestions } from '../hooks/useGemini'

// ── PlantAdviceCard ────────────────────────────────────────────────────────────

function PlantAdviceCard({ plant, stade, conseils }) {
  const [expanded, setExpanded] = useState(false)

  const statut   = ALL_STATUT_LABELS[stade] ?? ALL_STATUT_LABELS.sowed
  const visible  = expanded ? conseils : conseils.slice(0, 2)
  const hasMore  = conseils.length > 2

  return (
    <div
      className="rounded-card p-4 mb-3"
      style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 22, lineHeight: 1 }}>{plant.emoji}</span>
          <span className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>
            {plant.name}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-chip"
          style={{ background: 'var(--jd-surface-alt)', color: statut.color }}
        >
          {statut.label}
        </span>
      </div>

      {conseils.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>
          Pas de conseil spécifique pour ce stade — continue sur ta lancée !
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((c, i) => (
            <div
              key={i}
              className="flex gap-2.5 text-sm"
              style={{ color: 'var(--jd-ink)' }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--jd-accent)', fontSize: 11 }}>▸</span>
              <p className="leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 text-xs font-semibold tap-scale"
          style={{ color: 'var(--jd-accent)' }}
        >
          {expanded ? '▲ Voir moins' : `▼ Voir les ${conseils.length - 2} autres conseils`}
        </button>
      )}
    </div>
  )
}

// ── ConseilUniversel ───────────────────────────────────────────────────────────

function ConseilUniversel({ text, index }) {
  return (
    <div
      className="flex gap-3 p-4 rounded-card"
      style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
    >
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)' }}
      >
        {index + 1}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--jd-ink)' }}>{text}</p>
    </div>
  )
}

// ── Conseiller ─────────────────────────────────────────────────────────────────

export default function Conseiller({ onNavigate }) {
  const { profile }  = useProfile()
  const [showAllConseils, setShowAllConseils] = useState(false)

  const region  = getRegionById(profile.region)
  const sol     = getSoilById(profile.soil)
  const moisIdx = new Date().getMonth()
  const conseil = CONSEILS_MENSUELS[moisIdx]

  const offsetWeeks      = region?.offset ?? 0
  const plants           = profile.plants ?? []
  const personalizedList = getPersonalizedAdvice(plants, offsetWeeks, profile.soil)
  const enrichments      = getEnrichedMonthlyAdvice(moisIdx, plants, offsetWeeks)

  const { suggestions, loading: suggestionsLoading } = useGeminiSuggestions(profile, offsetWeeks)
  const [chatInitialMessage, setChatInitialMessage]   = useState(null)

  const universalConseils = conseil.conseils
  const visibleConseils   = showAllConseils ? universalConseils : universalConseils.slice(0, 2)

  return (
    <div className="px-4 pt-6 pb-4">

      {/* En-tête mois */}
      <div
        className="rounded-card p-5 mb-5"
        style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--jd-accent)' }}>
          {MOIS_LABELS[moisIdx]}
        </p>
        <h1 className="font-display font-extrabold text-2xl leading-tight mb-1" style={{ color: 'var(--jd-ink)' }}>
          {conseil.emoji} {conseil.humeur}
        </h1>
        <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>
          {conseil.intro}
        </p>

        <div className="flex gap-2 mt-3 flex-wrap">
          {profile.coords ? (
            <span className="jd-chip">
              📍 {profile.coords.lat.toFixed(2)}°N, {profile.coords.lon.toFixed(2)}°E
            </span>
          ) : region && (
            <span className="jd-chip">
              🗺️ {region.label}
            </span>
          )}
          {sol && (
            <span className="jd-chip">
              {sol.emoji} Sol {sol.label.toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Ravageurs & maladies à surveiller ce mois-ci (rien si aucun risque) */}
      <RisquesSaison plants={plants} />

      {/* Enrichissements contextuels */}
      {enrichments.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          {enrichments.map((e, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--jd-accent-soft)', color: 'var(--jd-accent)', border: '1px solid var(--jd-accent-ring)' }}
            >
              {e}
            </div>
          ))}
        </div>
      )}

      {/* Mes plantes ce mois-ci */}
      <div className="mb-5">
        <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--jd-accent)' }}>
          🌿 Mes plantes ce mois-ci
        </h2>

        {plants.length === 0 ? (
          <div
            className="rounded-card p-5 flex flex-col items-center text-center"
            style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}
          >
            <span style={{ fontSize: 40, lineHeight: 1, marginBottom: 12 }}>🪴</span>
            <p className="text-sm mb-4" style={{ color: 'var(--jd-ink-muted)' }}>
              Ajoute tes plantes pour recevoir des conseils personnalisés adaptés à chaque stade.
            </p>
            <button
              onClick={() => onNavigate?.('mon-jardin')}
              className="px-5 py-2.5 rounded-card text-sm font-semibold tap-scale"
              style={{ background: 'var(--jd-accent)', color: 'var(--jd-accent-ink)' }}
            >
              Ajoute tes plantes pour des conseils personnalisés →
            </button>
          </div>
        ) : (
          personalizedList.map(({ plant, stade, conseils }) => (
            <PlantAdviceCard
              key={plant.id}
              plant={plant}
              stade={stade}
              conseils={conseils}
            />
          ))
        )}
      </div>

      {/* Conseils pratiques universels */}
      <div className="mb-5">
        <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--jd-accent)' }}>
          Conseils pratiques
        </h2>
        <div className="flex flex-col gap-2">
          {visibleConseils.map((c, i) => (
            <ConseilUniversel key={i} text={c} index={i} />
          ))}
        </div>
        {universalConseils.length > 2 && (
          <button
            onClick={() => setShowAllConseils(v => !v)}
            className="mt-3 text-sm font-semibold tap-scale"
            style={{ color: 'var(--jd-accent)' }}
          >
            {showAllConseils
              ? '▲ Voir moins'
              : `▼ Voir les ${universalConseils.length - 2} autres conseils`}
          </button>
        )}
      </div>

      {/* Sol */}
      {sol && sol.id !== 'inconnu' && (
        <div
          className="p-4 rounded-card"
          style={{ background: 'var(--jd-warning-soft)', border: '1px solid rgba(240,184,108,0.3)' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--jd-warning)' }}>
            💡 Pour ton sol {sol.label.toLowerCase()}
          </p>
          <p className="text-sm" style={{ color: 'var(--jd-ink)' }}>{sol.tips}</p>
        </div>
      )}

      {/* Séparateur */}
      <div style={{ height: 1, background: 'var(--jd-border)', margin: 'var(--jd-space-6) 0' }} />

      {/* Suggestions proactives Gemini */}
      <SuggestionsProactives
        suggestions={suggestions}
        loading={suggestionsLoading}
        onSuggestionClick={(text) => {
          setChatInitialMessage(text)
          document.getElementById('jardinero-chat')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <div style={{ height: 'var(--jd-space-6)' }} />

      {/* Chat IA */}
      <div id="jardinero-chat">
        <AiChat
          key={chatInitialMessage}
          profile={profile}
          regionOffset={offsetWeeks}
          initialMessage={chatInitialMessage}
        />
      </div>

    </div>
  )
}
