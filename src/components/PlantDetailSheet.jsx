import { useState, useRef, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { PLANT_DURATIONS } from '../data/plantDurations'
import { getRegionById } from '../data/regions'
import { getSoilById } from '../data/soils'
import {
  getEffectiveStatus,
  getCycleProgress,
  getStageMessage,
  ALL_STATUT_LABELS,
} from '../utils/plantStatusUtils'
import { getFrequencePlante } from '../utils/arrosageUtils'
import { getSymptomsForPlant, getUrgenceConfig } from '../data/diagnostics'
import EmojiIllo from './EmojiIllo'
import HarvestCelebration from './HarvestCelebration'
import { useToast } from './Toast'

// ── Palette de stade — tokens CSS + base rgba pour alpha compositing ─────────
const STAGE = {
  sowed:               { color: 'var(--jd-badge-sowed)',              rgba: 'rgba(139,154,80,' },
  growing:             { color: 'var(--jd-badge-growing)',            rgba: 'rgba(157,192,68,' },
  flowering:           { color: 'var(--jd-warning)',                  rgba: 'rgba(252,186,106,' },
  ready:               { color: 'var(--jd-harvest)',                  rgba: 'rgba(222,95,29,' },
  perennial_dormant:   { color: 'var(--jd-stage-perennial-dormant)',  rgba: 'rgba(128,149,168,' },
  perennial_growing:   { color: 'var(--jd-stage-perennial-growing)',  rgba: 'rgba(109,186,120,' },
  perennial_producing: { color: 'var(--jd-stage-perennial-producing)',rgba: 'rgba(232,160,64,' },
  perennial_longcycle: { color: 'var(--jd-stage-perennial-longcycle)',rgba: 'rgba(157,168,168,' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateFR(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const s = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23a3b8a8' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`

// ── Kicker — label de section mono uppercase coloré ───────────────────────────
function Kicker({ color, label }) {
  return (
    <p style={{
      fontFamily:    'var(--jd-font-mono)',
      fontSize:      9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      marginBottom:  8,
    }}>
      {label}
    </p>
  )
}

// ── Onglet Infos ──────────────────────────────────────────────────────────────

function TabInfos({ plant, onClose, onHarvest }) {
  const { updatePlantStatusOverride, removePlant, profile } = useProfile()
  const regionOffset = getRegionById(profile.region)?.offset ?? 0

  const effectiveStatus = getEffectiveStatus(plant, regionOffset)
  const progress        = getCycleProgress(plant, regionOffset)
  const message         = getStageMessage(plant, regionOffset)
  const statut          = ALL_STATUT_LABELS[effectiveStatus] ?? ALL_STATUT_LABELS.sowed
  const stage           = STAGE[effectiveStatus] ?? STAGE.sowed
  const stageColor      = stage.color
  const stageRgba       = stage.rgba
  const isManual        = plant.statusOverride != null

  const durations    = PLANT_DURATIONS[plant.plantId]
  const isPerennial  = durations?.type === 'perennial'
  const hasFlowering = durations?.hasFlowering ?? false
  const frequence    = getFrequencePlante(plant, profile.soil, regionOffset)
  const sol          = getSoilById(profile.soil)

  const annualSteps = ['sowed', 'growing', ...(hasFlowering ? ['flowering'] : []), 'ready']
  const stepIndex   = annualSteps.indexOf(effectiveStatus)

  const daysSincePlanted = plant.plantedAt
    ? Math.floor((Date.now() - new Date(plant.plantedAt + 'T12:00:00')) / 86400000)
    : null

  function handleDelete() {
    if (window.confirm(`Supprimer ${plant.name} du jardin ?`)) {
      removePlant(plant.id)
      onClose()
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Stade actuel ── */}
      <div>
        <Kicker color={stageColor} label="◉ Stade actuel" />
        <div
          className="rounded-card p-4 flex flex-col gap-3"
          style={{ background: stageRgba + '0.09)', border: `1px solid ${stageRgba}0.25)` }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2.5 py-0.5 rounded-chip font-bold"
              style={{ background: stageRgba + '0.19)', color: stageColor }}
            >
              {statut.label}
            </span>
            {isManual && (
              <span
                className="text-xs px-2 py-0.5 rounded-chip font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--jd-ink-muted)', border: '1px solid var(--jd-border)' }}
              >
                Modifié manuellement
              </span>
            )}
          </div>

          <p className="text-sm leading-snug" style={{ color: 'var(--jd-ink)' }}>{message}</p>

          {!isPerennial && progress > 0 && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>Progression du cycle</span>
                <span className="text-xs font-bold" style={{ color: stageColor, fontFamily: 'var(--jd-font-mono)' }}>
                  {progress}%
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: stageColor }}
                />
              </div>
            </div>
          )}

          {daysSincePlanted !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--jd-ink-muted)' }}>Dans le jardin depuis</span>
              <span style={{ fontFamily: 'var(--jd-font-mono)', fontSize: 13, fontWeight: 700, color: stageColor }}>
                J+{daysSincePlanted}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Arrosage ── */}
      <div>
        <Kicker color="var(--jd-water)" label="💧 Arrosage" />
        <div
          className="rounded-card p-4 flex flex-col gap-2.5"
          style={{ background: 'var(--jd-water-soft)', border: '1px solid var(--jd-water-ring)' }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--jd-ink)' }}>Fréquence recommandée</span>
            <span style={{ fontFamily: 'var(--jd-font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--jd-water)' }}>
              {frequence > 0 ? `/${frequence}j` : '—'}
            </span>
          </div>
          {sol && (
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--jd-ink)' }}>Sol</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--jd-water)' }}>{sol.label}</span>
            </div>
          )}
          {plant.plantedAt && (
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--jd-ink)' }}>Planté le</span>
              <span className="text-xs font-medium" style={{ color: 'var(--jd-ink-muted)' }}>
                {formatDateFR(plant.plantedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Cycle de croissance ── */}
      {!isPerennial && (
        <div>
          <Kicker color="var(--jd-warning)" label="☀️ Cycle de croissance" />
          <div className="flex flex-col gap-1.5">
            {annualSteps.map((key, i) => {
              const s        = ALL_STATUT_LABELS[key]
              const stg      = STAGE[key] ?? STAGE.sowed
              const sc       = stg.color
              const scRgba   = stg.rgba
              const isActive = key === effectiveStatus
              const isPast   = i < stepIndex
              const isFuture = !isActive && !isPast
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: isActive ? scRgba + '0.09)' : 'transparent',
                    border:     isActive ? `1px solid ${scRgba}0.27)` : '1px solid transparent',
                    opacity:    isFuture ? 0.4 : 1,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{
                      fontSize:   9,
                      background: isActive ? sc : isPast ? 'var(--jd-accent)' : 'var(--jd-surface-alt)',
                      color:      isActive || isPast ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
                    }}
                  >
                    {isPast ? '✓' : i + 1}
                  </div>
                  <p className="text-sm font-semibold flex-1" style={{ color: isActive ? sc : 'var(--jd-ink)' }}>
                    {s.label}
                  </p>
                  {isActive && (
                    <span className="text-xs font-bold" style={{ color: sc }}>● Actuel</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Ajustement manuel ── */}
      {!isPerennial && (
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--jd-ink-muted)' }}>Ajuster le stade manuellement</p>
          <select
            value={isManual ? (plant.statusOverride ?? '') : ''}
            onChange={e => updatePlantStatusOverride(plant.id, e.target.value || null)}
            className="w-full rounded-card px-3 py-3 text-sm"
            style={{
              border:              '1px solid var(--jd-border)',
              background:          'var(--jd-surface-alt)',
              color:               'var(--jd-ink)',
              appearance:          'none',
              backgroundImage:     SELECT_CHEVRON,
              backgroundRepeat:    'no-repeat',
              backgroundPosition:  'right 12px center',
              paddingRight:        36,
            }}
          >
            <option value="">— Automatique —</option>
            {annualSteps.map(key => (
              <option key={key} value={key}>{ALL_STATUT_LABELS[key]?.label ?? key}</option>
            ))}
          </select>
        </div>
      )}

      {isManual && (
        <button
          onClick={() => updatePlantStatusOverride(plant.id, null)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold tap-scale"
          style={{ background: 'rgba(180,233,122,0.08)', color: 'var(--jd-accent)', border: '1px solid var(--jd-accent-ring)' }}
        >
          ↺ Revenir au calcul automatique
        </button>
      )}

      {/* ── Récolter ── */}
      {effectiveStatus === 'ready' && (
        <button
          onClick={onHarvest}
          className="w-full py-3.5 rounded-xl text-sm font-bold tap-scale"
          style={{ background: 'var(--jd-harvest)', color: 'var(--jd-ink)' }}
        >
          🧺 Récolter maintenant
        </button>
      )}

      {/* ── Supprimer ── */}
      <button
        onClick={handleDelete}
        className="w-full py-3 rounded-xl text-sm font-semibold tap-scale"
        style={{ background: 'var(--jd-harvest-soft)', color: 'var(--jd-harvest)', border: '1px solid var(--jd-harvest-ring)' }}
      >
        🗑 Supprimer du jardin
      </button>
    </div>
  )
}

// ── Onglet Journal ────────────────────────────────────────────────────────────

function TabJournal({ plant }) {
  const { profile, addJournalNote, deleteJournalNote } = useProfile()
  const { toast } = useToast()
  const notes = profile.journal?.[plant.id] ?? []
  const [texte, setTexte]       = useState('')
  const [confirming, setConfirming] = useState(null)

  async function handleAdd() {
    const trimmed = texte.trim()
    if (!trimmed) return
    setTexte('') // vide le champ immédiatement ; la note apparaît en optimiste
    const res = await addJournalNote(plant.id, trimmed)
    if (!res?.error) toast('Note enregistrée')
    else { setTexte(trimmed); toast('⚠ Échec de l\'enregistrement', 'warning') }
  }

  function handleDelete(noteId) {
    if (confirming === noteId) {
      deleteJournalNote(plant.id, noteId)
      setConfirming(null)
    } else {
      setConfirming(noteId)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card p-3" style={{ background: 'var(--jd-surface-alt)', border: '1px solid var(--jd-border)' }}>
        <textarea
          value={texte}
          onChange={e => setTexte(e.target.value.slice(0, 500))}
          placeholder="Observer, mesurer, traiter… notez tout ici"
          className="w-full text-sm resize-none outline-none bg-transparent"
          style={{ color: 'var(--jd-ink)', minHeight: 80 }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: texte.length > 450 ? 'var(--jd-harvest)' : 'var(--jd-ink-muted)' }}>
            {texte.length}/500
          </span>
          <button
            onClick={handleAdd}
            disabled={!texte.trim()}
            className="px-4 py-1.5 rounded-chip text-xs font-semibold tap-scale"
            style={{
              background: texte.trim() ? 'var(--jd-accent)' : 'var(--jd-accent-soft)',
              color:      texte.trim() ? 'var(--jd-accent-ink)' : 'var(--jd-ink-muted)',
            }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📓</p>
          <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>Aucune note pour l&apos;instant</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map(note => (
            <div key={note.id} className="rounded-card p-3" style={{ background: 'var(--jd-surface)', border: '1px solid var(--jd-border)' }}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold" style={{ color: 'var(--jd-accent)' }}>
                  {formatDateFR(note.date)}
                </p>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs px-2 py-0.5 rounded-chip flex-shrink-0 tap-scale"
                  style={{
                    background: confirming === note.id ? 'var(--jd-harvest-soft)' : 'var(--jd-surface-alt)',
                    color:      confirming === note.id ? 'var(--jd-harvest)' : 'var(--jd-ink-muted)',
                    fontWeight: 500,
                  }}
                >
                  {confirming === note.id ? 'Confirmer ?' : '✕'}
                </button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--jd-ink)' }}>{note.texte}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Onglet Diagnostic ─────────────────────────────────────────────────────────

function TabDiagnostic({ plant }) {
  const symptoms = getSymptomsForPlant(plant.plantId)
  const [selected, setSelected] = useState('')
  const diag    = symptoms.find(s => s.symptome === selected) ?? null
  const urgConf = diag ? getUrgenceConfig(diag.urgence) : null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--jd-ink-muted)' }}>
          Quel symptôme observez-vous ?
        </p>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full rounded-card px-3 py-3 text-sm"
          style={{
            border:             '1px solid var(--jd-border)',
            background:         'var(--jd-surface-alt)',
            color:              selected ? 'var(--jd-ink)' : 'var(--jd-ink-muted)',
            appearance:         'none',
            backgroundImage:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23a3b8a8' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
            backgroundRepeat:   'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight:       36,
          }}
        >
          <option value="">— Choisir un symptôme —</option>
          {symptoms.some(s => s._specific) && (
            <optgroup label={`Spécifique ${plant.name}`}>
              {symptoms.filter(s => s._specific).map(s => (
                <option key={s.symptome} value={s.symptome}>{s.symptome}</option>
              ))}
            </optgroup>
          )}
          <optgroup label="Symptômes généraux">
            {symptoms.filter(s => !s._specific).map(s => (
              <option key={s.symptome} value={s.symptome}>{s.symptome}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {diag && urgConf ? (
        <div className="rounded-card p-4 flex flex-col gap-3" style={{ background: urgConf.bg, border: `1px solid ${urgConf.badge}44` }}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm" style={{ color: 'var(--jd-ink)' }}>{diag.symptome}</p>
            <span className="text-xs px-2.5 py-1 rounded-chip font-bold flex-shrink-0" style={{ background: urgConf.badge, color: 'var(--jd-ink)' }}>
              {urgConf.label}
            </span>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--jd-warning)' }}>🔎 Cause probable</p>
            <p className="text-sm" style={{ color: 'var(--jd-ink)' }}>{diag.cause}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--jd-accent)' }}>✅ Solution</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--jd-ink)' }}>{diag.solution}</p>
          </div>
        </div>
      ) : (
        !selected && (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: 'var(--jd-ink-muted)' }}>
              Sélectionnez un symptôme pour voir le diagnostic
            </p>
          </div>
        )
      )}
    </div>
  )
}

// ── Sheet principale ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'infos',      label: '🌱 Infos' },
  { id: 'journal',    label: '📓 Journal' },
  { id: 'diagnostic', label: '🔍 Problème ?' },
]

export default function PlantDetailSheet({ plant, initialTab = 'infos', onClose, onReplant }) {
  const [activeTab,   setActiveTab]   = useState(initialTab)
  const [showHarvest, setShowHarvest] = useState(false)
  const cardRef = useRef(null)

  // Scroll en haut à chaque changement d'onglet
  useEffect(() => {
    cardRef.current?.scrollTo({ top: 0 })
  }, [activeTab])

  const { profile } = useProfile()
  const regionOffset         = getRegionById(profile.region)?.offset ?? 0
  const effectiveStatus      = getEffectiveStatus(plant, regionOffset)
  const statut               = ALL_STATUT_LABELS[effectiveStatus] ?? ALL_STATUT_LABELS.sowed
  const stageColor           = (STAGE[effectiveStatus] ?? STAGE.sowed).color
  const stageRgba            = (STAGE[effectiveStatus] ?? STAGE.sowed).rgba

  return (
    <>
      {showHarvest && (
        <HarvestCelebration
          plant={plant}
          onClose={() => { setShowHarvest(false); onClose() }}
          onReplant={() => { setShowHarvest(false); onReplant?.(); onClose() }}
        />
      )}

      <div
        onClick={onClose}
        className="modal-overlay"
        style={{ background: 'rgba(0,0,0,0.6)' }}
      >
        <div className="modal-spacer" />

        {/* Card avec spring d'entrée */}
        <div
          ref={cardRef}
          onClick={e => e.stopPropagation()}
          className="modal-card sheet-enter"
          style={{
            background:         'var(--jd-surface)',
            boxShadow:          '0 -4px 40px rgba(0,0,0,0.5)',
            overscrollBehavior: 'contain',
          }}
        >

          {/* ── Sticky : handle + fermer + onglets ── */}
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--jd-surface)' }}>
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <div style={{ flex: 1 }} />
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--jd-accent-ring)' }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-base tap-scale"
                  style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-accent)' }}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex gap-1 px-4 py-2" style={{ borderBottom: '1px solid var(--jd-border)' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all tap-scale"
                  style={{
                    background: activeTab === tab.id ? 'var(--jd-surface-alt)' : 'transparent',
                    color:      activeTab === tab.id ? 'var(--jd-accent)' : 'var(--jd-ink-muted)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Hero : EmojiIllo 96 + nom + variété + badge stade ── */}
          <div
            className="flex flex-col items-center px-5 pt-7 pb-6"
            style={{ borderBottom: '1px solid var(--jd-border)' }}
          >
            <EmojiIllo emoji={plant.emoji} size={96} ring />

            <h2
              className="jd-title text-center mt-4"
              style={{ fontSize: 26, color: 'var(--jd-ink)', letterSpacing: '-0.02em' }}
            >
              {plant.name}
            </h2>

            {plant.variety && (
              <p style={{
                fontFamily:    'var(--jd-font-mono)',
                fontSize:      11,
                color:         'var(--jd-ink-muted)',
                marginTop:     4,
                letterSpacing: '0.06em',
              }}>
                {plant.variety}
              </p>
            )}

            <span style={{
              marginTop:    12,
              background:   stageRgba + '0.16)',
              color:        stageColor,
              padding:      '5px 14px',
              borderRadius: 999,
              fontSize:     12,
              fontWeight:   700,
              letterSpacing:'0.04em',
            }}>
              {statut.label}
            </span>
          </div>

          {/* ── Contenu de l'onglet actif ── */}
          <div
            className="px-5 pt-5"
            style={{ paddingBottom: 'max(28px, env(safe-area-inset-bottom))' }}
          >
            {activeTab === 'infos'      && <TabInfos plant={plant} onClose={onClose} onHarvest={() => setShowHarvest(true)} />}
            {activeTab === 'journal'    && <TabJournal    plant={plant} />}
            {activeTab === 'diagnostic' && <TabDiagnostic plant={plant} />}
          </div>
        </div>
      </div>
    </>
  )
}
