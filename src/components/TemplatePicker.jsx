import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import GardenTemplateList from './GardenTemplateList'

// Modal léger pour appliquer un template de jardin depuis l'état vide de Mon Jardin
// (les utilisateurs existants ne revoient jamais l'onboarding).
export default function TemplatePicker({ onClose }) {
  const { profile, applyGardenTemplate } = useProfile()
  const [busyId, setBusyId] = useState(null)

  const handlePick = async (templateId) => {
    if (busyId) return
    setBusyId(templateId)
    await applyGardenTemplate(templateId, profile.region)
    setBusyId(null)
    onClose()
  }

  return (
    <div className="modal-overlay" style={{ background: 'rgba(13,20,15,0.85)' }}>
      <div className="modal-spacer" onClick={busyId ? undefined : onClose} />
      <div className="modal-card sheet-enter" style={{ background: 'var(--jd-surface)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--jd-surface)' }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="jd-title" style={{ fontSize: 20, color: 'var(--jd-accent)' }}>
              🌱 Partir d'un modèle
            </h2>
            <button
              onClick={onClose}
              disabled={busyId != null}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold tap-scale"
              style={{ background: 'var(--jd-surface-alt)', color: 'var(--jd-accent)', fontSize: 18 }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--jd-ink-muted)' }}>
            Un jardin prêt à l'emploi ajoute plusieurs plantes d'un coup. Tu pourras tout
            ajuster ensuite.
          </p>
          <GardenTemplateList onPick={handlePick} busyId={busyId} />
        </div>
      </div>
    </div>
  )
}
