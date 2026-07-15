import { createContext, useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getRegionById } from '../data/regions'
import { calculatePlantDates } from '../data/plantDurations'
import { getWeekKey } from '../data/taches'
import { getToday } from '../utils/arrosageUtils'
import { getTemplateById, getTemplatePlants } from '../data/gardenTemplates'

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
          // quantity peut ne pas exister sur les bases déjà déployées → défaut 1
          plantQuantities: Object.fromEntries(
            (p.plot_plants ?? []).map(pp => [pp.plant_id, pp.quantity ?? 1])
          ),
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
        container: p.container ?? false,
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
          container: h.container ?? false,
          quantiteKg: h.quantite_kg ?? null,
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
      container: plant.container ?? false,
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
          container: data.container ?? false,
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
    if ((profile.arrosages?.[plantId] ?? []).includes(today)) return { error: null }

    // Optimiste : l'état (et donc statut + humidité) se met à jour immédiatement
    setProfile(prev => ({
      ...prev,
      arrosages: {
        ...prev.arrosages,
        [plantId]: [...(prev.arrosages?.[plantId] ?? []), today],
      },
    }))

    const { error } = await supabase.from('arrosages').insert({
      user_id: user.id,
      plant_id: plantId,
      watered_at: today,
    })

    if (error) {
      // Rollback si l'écriture échoue
      console.error('Erreur marquerArrose:', error)
      setProfile(prev => ({
        ...prev,
        arrosages: {
          ...prev.arrosages,
          [plantId]: (prev.arrosages?.[plantId] ?? []).filter(d => d !== today),
        },
      }))
      return { error: error.message }
    }
    return { error: null }
  }, [user, profile.arrosages])

  // ── Journal ─────────────────────────────────────────────────────────────────

  const addJournalNote = useCallback(async (plantId, texte) => {
    // Optimiste : la note apparaît immédiatement (id temporaire), forme
    // fonctionnelle pour ne perdre aucune note ajoutée en rafale.
    const tempId = `tmp-${crypto.randomUUID()}`
    const note   = { id: tempId, date: getToday(), texte: texte.slice(0, 500) }

    setProfile(prev => ({
      ...prev,
      journal: {
        ...prev.journal,
        [plantId]: [note, ...(prev.journal?.[plantId] ?? [])],
      },
    }))

    const { data, error } = await supabase.from('journal').insert({
      user_id: user.id,
      plant_id: plantId,
      date: note.date,
      texte: note.texte,
    }).select().single()

    if (error || !data) {
      // Rollback : retire la note optimiste
      console.error('Erreur addJournalNote:', error)
      setProfile(prev => ({
        ...prev,
        journal: {
          ...prev.journal,
          [plantId]: (prev.journal?.[plantId] ?? []).filter(n => n.id !== tempId),
        },
      }))
      return { error: error?.message ?? 'Échec de l\'enregistrement' }
    }

    // Réconcilie l'id temporaire avec l'id réel renvoyé par la base
    setProfile(prev => ({
      ...prev,
      journal: {
        ...prev.journal,
        [plantId]: (prev.journal?.[plantId] ?? []).map(n =>
          n.id === tempId ? { id: data.id, date: data.date, texte: data.texte } : n
        ),
      },
    }))
    return { error: null }
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
      container: entry.container ?? false,
      quantite_kg: entry.quantiteKg ?? null,
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
          container: data.container ?? false,
          quantiteKg: data.quantite_kg ?? null,
        }, ...prev.historique],
      }))
    }
  }, [user])

  // ── Templates de jardin ───────────────────────────────────────────────────────

  // Crée en un lot les plantes d'un template. regionId est passé explicitement
  // (l'état profile.region peut ne pas encore être à jour pendant l'onboarding).
  const applyGardenTemplate = useCallback(async (templateId, regionId = null) => {
    const template = getTemplateById(templateId)
    if (!template) {
      console.warn('[applyGardenTemplate] template introuvable :', templateId)
      return { error: 'Template introuvable', count: 0 }
    }

    const offset = getRegionById(regionId ?? profile.region)?.offset ?? 0
    const today  = getToday()
    const resolved = getTemplatePlants(template, { regionOffset: offset })
    if (resolved.length === 0) return { error: null, count: 0 }

    const rows = resolved.map(p => {
      const dates = calculatePlantDates(p.id, today, offset)
      return {
        user_id: user.id,
        name: p.name,
        emoji: p.emoji,
        plant_id: p.id,
        planted_at: today,
        status: 'sowed',
        status_override: null,
        variety: null,
        container: template.container,
        estimated_harvest_start: dates?.estimatedHarvestStart ?? null,
        estimated_harvest_end: dates?.estimatedHarvestEnd ?? null,
        season_end: dates?.seasonEnd ?? null,
      }
    })

    const { data, error } = await supabase.from('plants').insert(rows).select()
    if (error) {
      console.error('Erreur applyGardenTemplate:', error)
      return { error: error.message, count: 0 }
    }

    const mapped = (data ?? []).map(d => ({
      id: d.id,
      name: d.name,
      emoji: d.emoji,
      plantId: d.plant_id,
      plantedAt: d.planted_at,
      status: d.status,
      statusOverride: null,
      variety: d.variety,
      container: d.container ?? false,
      estimatedHarvestStart: d.estimated_harvest_start,
      estimatedHarvestEnd: d.estimated_harvest_end,
      seasonEnd: d.season_end,
    }))
    setProfile(prev => ({ ...prev, plants: [...prev.plants, ...mapped] }))
    return { error: null, count: mapped.length }
  }, [user, profile.region])

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
    if (!gardenId) return { error: null }

    const { error: gardenError } = await supabase.from('gardens').update({
      name: data.name,
      width: data.width,
      height: data.height,
      orientation: data.orientation,
      updated_at: new Date().toISOString(),
    }).eq('id', gardenId).eq('user_id', user.id)

    if (gardenError) {
      console.error('Erreur saveGarden (jardin):', gardenError)
      return { error: gardenError.message }
    }

    if (data.plots) {
      // RPC transactionnel : delete + insert atomiques côté Postgres,
      // un échec ne détruit pas les parcelles existantes.
      const { error } = await supabase.rpc('save_garden', {
        p_garden_id: gardenId,
        p_plots: data.plots.map(p => ({
          id: p.id,
          label: p.label ?? null,
          x: p.x, y: p.y,
          width: p.width, height: p.height,
          plants: (p.plants ?? []).map(plantId => ({
            plant_id: plantId,
            quantity: p.plantQuantities?.[plantId] ?? 1,
          })),
        })),
      })

      if (error) {
        console.error('Erreur saveGarden (parcelles):', error)
        return { error: error.message }
      }
    }

    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => g.id === gardenId ? { ...g, ...data } : g),
      plants: data.plots
        ? prev.plants.map(pl => {
            const plot = data.plots.find(p => (p.plants ?? []).includes(pl.id))
            return { ...pl, plotId: plot?.id ?? null }
          })
        : prev.plants,
    }))
    return { error: null }
  }, [user, profile.activeGardenId])

  const assignPlantToPlot = useCallback(async (plotId, plantId) => {
    await supabase.from('plot_plants').upsert({ plot_id: plotId, plant_id: plantId })
    // plants.plot_id : source de vérité pour la rotation par parcelle
    await supabase.from('plants')
      .update({ plot_id: plotId, updated_at: new Date().toISOString() })
      .eq('id', plantId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, plotId } : p),
      gardens: prev.gardens.map(g => ({
        ...g,
        plots: g.plots.map(p =>
          p.id === plotId && !p.plants.includes(plantId)
            ? {
                ...p,
                plants: [...p.plants, plantId],
                plantQuantities: { ...(p.plantQuantities ?? {}), [plantId]: 1 },
              }
            : p
        ),
      })),
    }))
  }, [user])

  const removePlantFromPlot = useCallback(async (plotId, plantId) => {
    await supabase.from('plot_plants').delete().eq('plot_id', plotId).eq('plant_id', plantId)
    await supabase.from('plants')
      .update({ plot_id: null, updated_at: new Date().toISOString() })
      .eq('id', plantId).eq('plot_id', plotId).eq('user_id', user.id)
    setProfile(prev => ({
      ...prev,
      plants: prev.plants.map(p =>
        p.id === plantId && p.plotId === plotId ? { ...p, plotId: null } : p
      ),
      gardens: prev.gardens.map(g => ({
        ...g,
        plots: g.plots.map(p => {
          if (p.id !== plotId) return p
          const plantQuantities = { ...(p.plantQuantities ?? {}) }
          delete plantQuantities[plantId]
          return { ...p, plants: p.plants.filter(id => id !== plantId), plantQuantities }
        }),
      })),
    }))
  }, [user])

  // Met à jour la quantité d'une plante dans une parcelle.
  // État immédiat (immuable) + persistance best-effort : la colonne
  // plot_plants.quantity peut ne pas exister sur les bases déjà déployées,
  // auquel cas l'erreur est ignorée et la quantité reste correcte en session.
  const updatePlotQuantity = useCallback(async (plotId, plantId, qty) => {
    const safe = Math.max(1, Math.round(qty))
    setProfile(prev => ({
      ...prev,
      gardens: prev.gardens.map(g => ({
        ...g,
        plots: g.plots.map(p =>
          p.id === plotId
            ? { ...p, plantQuantities: { ...(p.plantQuantities ?? {}), [plantId]: safe } }
            : p
        ),
      })),
    }))
    try {
      await supabase.from('plot_plants')
        .update({ quantity: safe })
        .eq('plot_id', plotId).eq('plant_id', plantId)
    } catch { /* colonne quantity optionnelle */ }
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
      user,
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
      applyGardenTemplate,
      addGarden,
      removeGarden,
      renameGarden,
      setActiveGarden,
      saveGarden,
      assignPlantToPlot,
      removePlantFromPlot,
      updatePlotQuantity,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}
