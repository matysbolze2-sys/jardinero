import { createContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getToday } from '../utils/arrosageUtils'
import { getWeekKey } from '../data/taches'
import { calculatePlantDates } from '../data/plantDurations'
import { getRegionById } from '../data/regions'

export const ProfileContext = createContext(null)

const PROFIL_INITIAL = {
  region:        null,
  soil:          null,
  coords:        null,    // { lat, lon } — coordonnées GPS précises (optionnel)
  plants:        [],
  arrosages:     {},      // { [plantUUID]: ["YYYY-MM-DD", ...] }
  journal:       {},      // { [plantUUID]: [{ id, date, texte }] }
  checklistWeek: {},      // { [weekMondayDate]: ["tache text", ...] }
  historique:    [],      // [{ id, name, emoji, plantId, plantedAt, harvestedAt, variety }]
  gardens:       [],      // [{ id, name, width, height, orientation, plots }]
  activeGardenId: null,
  settings:      { onboardingDone: false },
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useLocalStorage('jardinero_profile', PROFIL_INITIAL)

  const updateProfile = useCallback((partial) => {
    setProfile(prev => ({ ...prev, ...partial }))
  }, [setProfile])

  const completeOnboarding = useCallback((region, soil, coords = null) => {
    setProfile(prev => ({
      ...prev,
      region,
      soil,
      coords,
      settings: { ...prev.settings, onboardingDone: true },
    }))
  }, [setProfile])

  const addPlant = useCallback((plant) => {
    setProfile(prev => {
      const regionOffset = getRegionById(prev.region)?.offset ?? 0
      const dates = calculatePlantDates(plant.plantId, plant.plantedAt, regionOffset)
      return {
        ...prev,
        plants: [...(prev.plants ?? []), { ...plant, ...dates }],
      }
    })
  }, [setProfile])

  const removePlant = useCallback((plantId) => {
    setProfile(prev => {
      const arrosages = { ...(prev.arrosages ?? {}) }
      const journal   = { ...(prev.journal ?? {}) }
      delete arrosages[plantId]
      delete journal[plantId]
      return {
        ...prev,
        plants: prev.plants.filter(p => p.id !== plantId),
        arrosages,
        journal,
      }
    })
  }, [setProfile])

  const updatePlantStatus = useCallback((plantId, status) => {
    setProfile(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, status } : p),
    }))
  }, [setProfile])

  const marquerArrose = useCallback((plantId) => {
    const today = getToday()
    setProfile(prev => {
      const history = prev.arrosages?.[plantId] ?? []
      if (history.includes(today)) return prev
      return {
        ...prev,
        arrosages: { ...(prev.arrosages ?? {}), [plantId]: [...history, today] },
      }
    })
  }, [setProfile])

  // ── Journal ──────────────────────────────────────────────────────────────

  const addJournalNote = useCallback((plantId, texte) => {
    const note = { id: crypto.randomUUID(), date: getToday(), texte: texte.slice(0, 500) }
    setProfile(prev => {
      const current = prev.journal?.[plantId] ?? []
      return {
        ...prev,
        journal: { ...(prev.journal ?? {}), [plantId]: [note, ...current] },
      }
    })
  }, [setProfile])

  const deleteJournalNote = useCallback((plantId, noteId) => {
    setProfile(prev => {
      const current = prev.journal?.[plantId] ?? []
      return {
        ...prev,
        journal: { ...(prev.journal ?? {}), [plantId]: current.filter(n => n.id !== noteId) },
      }
    })
  }, [setProfile])

  // ── Historique des récoltes ───────────────────────────────────────────────

  const addHistorique = useCallback((entry) => {
    setProfile(prev => ({
      ...prev,
      historique: [entry, ...(prev.historique ?? [])],
    }))
  }, [setProfile])

  // ── Jardins (multi) ───────────────────────────────────────────────────────

  const addGarden = useCallback((name) => {
    const newGarden = {
      id:          crypto.randomUUID(),
      name:        (name ?? 'Mon jardin').slice(0, 40),
      width:       null,
      height:      null,
      orientation: 'N',
      plots:       [],
    }
    setProfile(prev => ({
      ...prev,
      gardens:       [...(prev.gardens ?? []), newGarden],
      activeGardenId: newGarden.id,
    }))
  }, [setProfile])

  const removeGarden = useCallback((gardenId) => {
    setProfile(prev => {
      const gardens = (prev.gardens ?? []).filter(g => g.id !== gardenId)
      const activeGardenId = prev.activeGardenId === gardenId
        ? (gardens[0]?.id ?? null)
        : prev.activeGardenId
      return { ...prev, gardens, activeGardenId }
    })
  }, [setProfile])

  const renameGarden = useCallback((gardenId, name) => {
    setProfile(prev => ({
      ...prev,
      gardens: (prev.gardens ?? []).map(g =>
        g.id === gardenId ? { ...g, name: name.slice(0, 40) } : g
      ),
    }))
  }, [setProfile])

  const setActiveGarden = useCallback((gardenId) => {
    setProfile(prev => ({ ...prev, activeGardenId: gardenId }))
  }, [setProfile])

  const saveGarden = useCallback((data) => {
    setProfile(prev => ({
      ...prev,
      gardens: (prev.gardens ?? []).map(g =>
        g.id === prev.activeGardenId ? { ...g, ...data } : g
      ),
    }))
  }, [setProfile])

  const assignPlantToPlot = useCallback((plotId, plantId) => {
    setProfile(prev => ({
      ...prev,
      gardens: (prev.gardens ?? []).map(g => {
        if (g.id !== prev.activeGardenId) return g
        return {
          ...g,
          plots: g.plots.map(plot =>
            plot.id === plotId && !plot.plants.includes(plantId)
              ? { ...plot, plants: [...plot.plants, plantId] }
              : plot
          ),
        }
      }),
    }))
  }, [setProfile])

  const removePlantFromPlot = useCallback((plotId, plantId) => {
    setProfile(prev => ({
      ...prev,
      gardens: (prev.gardens ?? []).map(g => {
        if (g.id !== prev.activeGardenId) return g
        return {
          ...g,
          plots: g.plots.map(plot =>
            plot.id === plotId
              ? { ...plot, plants: plot.plants.filter(id => id !== plantId) }
              : plot
          ),
        }
      }),
    }))
  }, [setProfile])

  // ── Checklist hebdomadaire ────────────────────────────────────────────────

  const toggleChecklistTask = useCallback((tacheText) => {
    const weekKey = getWeekKey()
    setProfile(prev => {
      const checked = prev.checklistWeek?.[weekKey] ?? []
      const next    = checked.includes(tacheText)
        ? checked.filter(t => t !== tacheText)
        : [...checked, tacheText]
      return {
        ...prev,
        checklistWeek: { ...(prev.checklistWeek ?? {}), [weekKey]: next },
      }
    })
  }, [setProfile])

  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      completeOnboarding,
      addPlant,
      removePlant,
      updatePlantStatus,
      marquerArrose,
      addJournalNote,
      deleteJournalNote,
      toggleChecklistTask,
      addHistorique,
      addGarden,
      removeGarden,
      renameGarden,
      setActiveGarden,
      saveGarden,
      assignPlantToPlot,
      removePlantFromPlot,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}
