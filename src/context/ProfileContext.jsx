import { createContext, useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getRegionById } from '../data/regions'
import { calculatePlantDates } from '../data/plantDurations'
import { getWeekKey } from '../data/taches'
import { getToday } from '../utils/arrosageUtils'

export const ProfileContext = createContext(null)

const PROFIL_INITIAL = {
  region: null, soil: null, coords: null,
  plants: [], arrosages: {}, journal: {},
  checklistWeek: {}, historique: [],
  gardens: [], activeGardenId: null,
  settings: { onboardingDone: false },
}

export function ProfileProvider({ children, user }) {
  const [profile, setProfile] = useState(PROFIL_INITIAL)
  const [loading, setLoading] = useState(true)

  // ── Chargement initial ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) { setProfile(PROFIL_INITIAL); setLoading(false); return }
    loadProfile()
  }, [user])

  async function loadProfile() {
    setLoading(true)
    try {
      const [
        { data: profileData },
        { data: plantsData },
        { data: arrosagesData },
        { data: journalData },
        { data: historiqueData },
        { data: gardensData },
        { data: checklistData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('plants').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('arrosages').select('*').eq('user_id', user.id),
        supabase.from('journal').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('historique').select('*').eq('user_id', user.id).order('harvested_at', { ascending: false }),
        supabase.from('gardens').select('*, plots(*, plot_plants(*))').eq('user_id', user.id),
        supabase.from('checklist').select('*').eq('user_id', user.id),
      ])

      // Arrosages : { [plantId]: ["YYYY-MM-DD", ...] }
      const arrosages = {}
      for (const a of (arrosagesData ?? [])) {
        if (!arrosages[a.plant_id]) arrosages[a.plant_id] = []
        arrosages[a.plant_id].push(a.watered_at)
      }

      // Journal : { [plantId]: [{ id, date, texte }] }
      const journal = {}
      for (const n of (journalData ?? [])) {
        if (!journal[n.plant_id]) journal[n.plant_id] = []
        journal[n.plant_id].push({ id: n.id, date: n.date, texte: n.texte })
      }

      // Checklist : { [weekKey]: ["tache text", ...] }
      const checklistWeek = {}
      for (const c of (checklistData ?? [])) {
        const key = c.week_key
        if (!checklistWeek[key]) checklistWeek[key] = []
        if (c.checked) checklistWeek[key].push(c.tache_text)
      }

      const activeGarden = gardensData?.find(g => g.is_active)
      const gardens = (gardensData ?? []).map(g => ({
        id: g.id,
        name: g.name,
        width: g.width,
        height: g.height,
        orientation: g.orientation,
        plots: (g.plots ?? []).map(p => ({
          id: p.id,
          x: p.x, y: p.y,
          width: p.width, height: p.height,
          label: p.label,
          plants: (p.plot_plants ?? []).map(pp => pp.plant_id),
        })),
      }))

      const plants = (plantsData ?? []).map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        plantId: p.plant_id,
        plantedAt: p.planted_at,
        status: p.status,
        statusOverride: p.status_override,
        variety: p.variety,
        plotId: p.plot_id,
        estimatedHarvestStart: p.estimated_harvest_start,
        estimatedHarvestEnd: p.estimated_harvest_end,
        seasonEnd: p.season_end,
      }))

      setProfile({
        region: profileData?.region ?? null,
        soil: profileData?.soil ?? null,
        coords: profileData?.coords ?? null,
        settings: profileData?.settings ?? { onboardingDone: false },
        plants,
        arrosages,
        journal,
        checklistWeek,
        historique: (historiqueData ?? []).map(h => ({
          id: h.id,
          name: h.name,
          emoji: h.emoji,
          plantId: h.plant_id,
          plantedAt: h.planted_at,
          harvestedAt: h.harvested_at,
          variety: h.variety,
          plotId: h.plot_id,
        })),
        gardens,
        activeGardenId: activeGarden?.id ?? null,
      })
    } catch (err) {
      console.error('Erreur chargement profil:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Onboarding ──────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(async (region, soil, coords = null) => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      region, soil, coords,
      settings: { onboardingDone: true },
      updated_at: new Date().toISOString(),
    })
    if (error) console.error('Erreur completeOnboarding:', error)
    setProfile(prev => ({
      ...prev, region, soil, coords,
      settings: { ...prev.settings, onboardingDone: true },
    }))
  }, [user])

  // ── Plantes ─────────────────────────────────────────────────────────────────

  const addPlant = useCallback(async (plant) => {
    const regionOffset = getRegionById(profile.region)?.offset ?? 0
    const dates = calculatePlantDates(plant.plantId, plant.plantedAt, regionOffset)

    const { data, error } = await supabase.from('plants').insert({
      user_id: user.id,
      name: plant.name,
      emoji: plant.emoji,
      plant_id: plant.plantId,
      planted_at: plant.plantedAt,
      status: plant.status ?? 'sowed',
      status_override: null,
      variety: plant.variety ?? null,
      estimated_harvest_start: dates?.estimatedHarvestStart ?? null,
      estimated_harvest_end: dates?.estimatedHarvestEnd ?? null,
      season_end: dates?.seasonEnd ?? null,
    }).select().single()

    if (error) {
      console.error('Erreur addPlant:', error)
      return { error: error.message }
    }
    if (data) {
      setProfile(prev => ({
        ...prev,
        plants: [...prev.plants, {
          id: data.id,
          name: data.name,
          emoji: data.emoji,
          plantId: data.plant_id,
          plantedAt: data.planted_at,
          status: data.status,
          statusOverride: null,
          variety: data.variety,
          ...(dates ?? {}),
        }],
      }))
    }
    return { error: null }
  }, [user, profile.region])

  const removePlant = useCallback(async (plantId) => {
    await supabase.from('plants').delete().eq('id', plantId).eq('user_id', user.id)
    setProfile(prev => {
      const arrosages = { ...prev.arrosages }
      const journal   = { ...prev.journal }
      delete arrosages[plantId]
      delete journal[plantId]
      return { ...prev, plants: prev.plants.filter(p => p.id !== plantId), arrosages, journal }
    })
  }, [user])

  const updatePlantStatus = useCallback(async (plantId, status) => {
    await supabase.from('plants')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', plantId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, status } : p),
    }))
  }, [user])

  const updatePlantStatusOverride = useCallback(async (plantId, statusOverride) => {
    await supabase.from('plants')
      .update({ status_override: statusOverride, updated_at: new Date().toISOString() })
      .eq('id', plantId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, statusOverride } : p),
    }))
  }, [user])

  // ── Arrosage ────────────────────────────────────────────────────────────────

  const marquerArrose = useCallback(async (plantId) => {
    const today = getToday()
    if ((profile.arrosages?.[plantId] ?? []).includes(today)) return

    await supabase.from('arrosages').insert({
      user_id: user.id,
      plant_id: plantId,
      watered_at: today,
    })
    setProfile(prev => ({
      ...prev,
      arrosages: {
        ...prev.arrosages,
        [plantId]: [...(prev.arrosages?.[plantId] ?? []), today],
      },
    }))
  }, [user, profile.arrosages])

  // ── Journal ─────────────────────────────────────────────────────────────────

  const addJournalNote = useCallback(async (plantId, texte) => {
    const { data, error } = await supabase.from('journal').insert({
      user_id: user.id,
      plant_id: plantId,
      date: getToday(),
      texte: texte.slice(0, 500),
    }).select().single()

    if (!error && data) {
      setProfile(prev => ({
        ...prev,
        journal: {
          ...prev.journal,
          [plantId]: [{ id: data.id, date: data.date, texte: data.texte }, ...(prev.journal?.[plantId] ?? [])],
        },
      }))
    }
  }, [user])

  const deleteJournalNote = useCallback(async (plantId, noteId) => {
    await supabase.from('journal').delete().eq('id', noteId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      journal: {
        ...prev.journal,
        [plantId]: (prev.journal?.[plantId] ?? []).filter(n => n.id !== noteId),
      },
    }))
  }, [user])

  // ── Historique ──────────────────────────────────────────────────────────────

  const addHistorique = useCallback(async (entry) => {
    const { data, error } = await supabase.from('historique').insert({
      user_id: user.id,
      name: entry.name,
      emoji: entry.emoji,
      plant_id: entry.plantId ?? null,
      planted_at: entry.plantedAt ?? null,
      harvested_at: entry.harvestedAt,
      variety: entry.variety ?? null,
      plot_id: entry.plotId ?? null,
    }).select().single()

    if (!error && data) {
      setProfile(prev => ({
        ...prev,
        historique: [{
          id: data.id,
          name: data.name,
          emoji: data.emoji,
          plantId: data.plant_id,
          plantedAt: data.planted_at,
          harvestedAt: data.harvested_at,
          variety: data.variety,
          plotId: data.plot_id,
        }, ...prev.historique],
      }))
    }
  }, [user])

  // ── Checklist ───────────────────────────────────────────────────────────────

  const toggleChecklistTask = useCallback(async (tacheText) => {
    const weekKey  = getWeekKey()
    const checked  = profile.checklistWeek?.[weekKey] ?? []
    const isChecked = checked.includes(tacheText)

    if (isChecked) {
      await supabase.from('checklist')
        .delete()
        .eq('user_id', user.id)
        .eq('week_key', weekKey)
        .eq('tache_text', tacheText)
    } else {
      await supabase.from('checklist').upsert({
        user_id: user.id,
        week_key: weekKey,
        tache_text: tacheText,
        checked: true,
      })
    }

    setProfile(prev => {
      const current = prev.checklistWeek?.[weekKey] ?? []
      return {
        ...prev,
        checklistWeek: {
          ...prev.checklistWeek,
          [weekKey]: isChecked ? current.filter(t => t !== tacheText) : [...current, tacheText],
        },
      }
    })
  }, [user, profile.checklistWeek])

  // ── Jardins ─────────────────────────────────────────────────────────────────

  const addGarden = useCallback(async (name) => {
    await supabase.from('gardens').update({ is_active: false }).eq('user_id', user.id)

    const { data, error } = await supabase.from('gardens').insert({
      user_id: user.id,
      name: (name ?? 'Mon jardin').slice(0, 40),
      is_active: true,
    }).select().single()

    if (!error && data) {
      setProfile(prev => ({
        ...prev,
        gardens: [...prev.gardens, { id: data.id, name: data.name, width: null, height: null, orientation: 'N', plots: [] }],
        activeGardenId: data.id,
      }))
    }
  }, [user])

  const removeGarden = useCallback(async (gardenId) => {
    await supabase.from('gardens').delete().eq('id', gardenId).eq('user_id', user.id)
    setProfile(prev => {
      const gardens = prev.gardens.filter(g => g.id !== gardenId)
      return {
        ...prev,
        gardens,
        activeGardenId: prev.activeGardenId === gardenId ? (gardens[0]?.id ?? null) : prev.activeGardenId,
      }
    })
  }, [user])

  const renameGarden = useCallback(async (gardenId, name) => {
    await supabase.from('gardens')
      .update({ name: name.slice(0, 40), updated_at: new Date().toISOString() })
      .eq('id', gardenId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => g.id === gardenId ? { ...g, name: name.slice(0, 40) } : g),
    }))
  }, [user])

  const setActiveGarden = useCallback(async (gardenId) => {
    await supabase.from('gardens').update({ is_active: false }).eq('user_id', user.id)
    await supabase.from('gardens').update({ is_active: true }).eq('id', gardenId)
    setProfile(prev => ({ ...prev, activeGardenId: gardenId }))
  }, [user])

  const saveGarden = useCallback(async (data) => {
    const gardenId = profile.activeGardenId
    if (!gardenId) return

    await supabase.from('gardens').update({
      name: data.name,
      width: data.width,
      height: data.height,
      orientation: data.orientation,
      updated_at: new Date().toISOString(),
    }).eq('id', gardenId).eq('user_id', user.id)

    if (data.plots) {
      await supabase.from('plots').delete().eq('garden_id', gardenId)

      if (data.plots.length > 0) {
        await supabase.from('plots').insert(
          data.plots.map(p => ({
            id: p.id,
            garden_id: gardenId,
            user_id: user.id,
            label: p.label ?? null,
            x: p.x, y: p.y,
            width: p.width, height: p.height,
          }))
        )

        const plotPlants = []
        for (const p of data.plots) {
          for (const plantId of (p.plants ?? [])) {
            plotPlants.push({ plot_id: p.id, plant_id: plantId })
          }
        }
        if (plotPlants.length > 0) {
          await supabase.from('plot_plants').insert(plotPlants)
        }
      }
    }

    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => g.id === gardenId ? { ...g, ...data } : g),
    }))
  }, [user, profile.activeGardenId])

  const assignPlantToPlot = useCallback(async (plotId, plantId) => {
    await supabase.from('plot_plants').upsert({ plot_id: plotId, plant_id: plantId })
    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => ({
        ...g,
        plots: g.plots.map(p =>
          p.id === plotId && !p.plants.includes(plantId)
            ? { ...p, plants: [...p.plants, plantId] }
            : p
        ),
      })),
    }))
  }, [user])

  const removePlantFromPlot = useCallback(async (plotId, plantId) => {
    await supabase.from('plot_plants').delete().eq('plot_id', plotId).eq('plant_id', plantId)
    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => ({
        ...g,
        plots: g.plots.map(p =>
          p.id === plotId
            ? { ...p, plants: p.plants.filter(id => id !== plantId) }
            : p
        ),
      })),
    }))
  }, [user])

  // ── updateProfile générique ─────────────────────────────────────────────────

  const updateProfile = useCallback(async (partial) => {
    if (user && (partial.region !== undefined || partial.soil !== undefined || partial.coords !== undefined)) {
      await supabase.from('profiles').update({
        ...partial,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)
    }
    setProfile(prev => ({ ...prev, ...partial }))
  }, [user])

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      updateProfile,
      completeOnboarding,
      addPlant,
      removePlant,
      updatePlantStatus,
      updatePlantStatusOverride,
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
