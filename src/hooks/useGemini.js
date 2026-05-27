import { useState, useEffect } from 'react'
import { getEffectiveStatus, getCycleProgress, getStageMessage } from '../utils/plantStatusUtils'
import { ASSOCIATIONS } from '../data/associations'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const CHAT_STORAGE_KEY        = 'jd_chat_usage'
const SUGGESTIONS_STORAGE_KEY = 'jd_suggestions_cache'
const MAX_CHAT = 10

// ── Garden context builder — exported for reuse by Diagnostic prompt ──────────

export function buildGardenContext(profile, regionOffset) {
  const today = new Date()
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

  const plantsEnriched = (profile.plants ?? []).map(plant => {
    const status         = getEffectiveStatus(plant, regionOffset)
    const progress       = getCycleProgress(plant, regionOffset)
    const message        = getStageMessage(plant, regionOffset)
    const daysSincePlanted = plant.plantedAt
      ? Math.floor((Date.now() - new Date(plant.plantedAt)) / 86400000)
      : null
    const lastWatered = (profile.arrosages?.[plant.id] ?? []).sort().at(-1) ?? null

    return {
      nom:                   plant.name,
      emoji:                 plant.emoji,
      type:                  plant.type ?? 'annual',
      stade:                 status,
      progression:           progress ? `${progress}%` : null,
      message_stade:         message,
      jours_depuis_plantation: daysSincePlanted,
      dernier_arrosage:      lastWatered,
      variete:               plant.variety ?? null,
    }
  })

  const conflits = []
  for (const plant of profile.plants ?? []) {
    if (!plant.plantId || !ASSOCIATIONS[plant.plantId]) continue
    for (const mauvaise of ASSOCIATIONS[plant.plantId].mauvaises) {
      const conflict = (profile.plants ?? []).find(
        p => p.name.toLowerCase().trim() === mauvaise.plante.toLowerCase().trim()
      )
      if (conflict) {
        conflits.push(`${plant.name} + ${conflict.name} : ${mauvaise.raison}`)
      }
    }
  }

  return `
CONTEXTE DU JARDIN - ${today.getDate()} ${mois[today.getMonth()]} ${today.getFullYear()}

Région : ${profile.region ?? 'non définie'}
Sol : ${profile.soil ?? 'inconnu'}
Décalage régional : ${regionOffset > 0 ? `+${regionOffset} semaines (printemps tardif)` : regionOffset < 0 ? `${regionOffset} semaines (printemps précoce)` : 'aucun'}

Plantes dans le jardin (${plantsEnriched.length}) :
${plantsEnriched.map(p =>
  `- ${p.emoji} ${p.nom}${p.variete ? ` (${p.variete})` : ''} — stade: ${p.stade}${p.progression ? `, avancement: ${p.progression}` : ''}${p.jours_depuis_plantation ? `, planté il y a ${p.jours_depuis_plantation}j` : ''}${p.dernier_arrosage ? `, dernier arrosage: ${p.dernier_arrosage}` : ''}`
).join('\n')}

${conflits.length > 0 ? `Conflits d'associations détectés :\n${conflits.map(c => `- ${c}`).join('\n')}` : "Aucun conflit d'associations détecté."}
  `.trim()
}

// ── Chat hook ─────────────────────────────────────────────────────────────────

export function useGeminiChat(profile, regionOffset) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const getUsage = () => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY)
      if (!raw) return { count: 0, date: null }
      return JSON.parse(raw)
    } catch { return { count: 0, date: null } }
  }

  const today      = new Date().toDateString()
  const usage      = getUsage()
  const usedToday  = usage.date === today ? usage.count : 0
  const remaining  = MAX_CHAT - usedToday

  const incrementUsage = () => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({
      count: usedToday + 1,
      date:  today,
    }))
  }

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading || remaining <= 0) return

    const newEntry = { user: userMessage, assistant: null }
    setHistory(prev => [...prev, newEntry])
    setLoading(true)
    incrementUsage()

    const gardenContext = buildGardenContext(profile, regionOffset)
    const systemPrompt = `
Tu es Jardinero, un assistant jardinage expert, chaleureux et pratique.
Tu connais parfaitement le jardin de l'utilisateur grâce au contexte ci-dessous.

${gardenContext}

RÈGLES :
- Réponds toujours en français
- Réponses courtes et concrètes (3-5 phrases max sauf si une explication longue est vraiment nécessaire)
- Utilise les données du jardin pour personnaliser chaque réponse
- Si tu n'as pas assez d'infos, pose UNE seule question ciblée
- Ton chaleureux, pas de jargon inutile
- Pas de listes à puces sauf si vraiment nécessaire
`

    const conversationHistory = history.map(h => ([
      { role: 'user',  parts: [{ text: h.user }] },
      { role: 'model', parts: [{ text: h.assistant ?? '' }] },
    ])).flat()

    const body = {
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature:      0.7,
        maxOutputTokens:  400,
      },
    }

    try {
      const res = await fetch(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        console.error('[Gemini chat error]', res.status, errBody)
        throw new Error(`${res.status} — ${errBody?.error?.message ?? 'erreur API'}`)
      }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Pas de réponse.'
      setHistory(prev => prev.map((h, i) =>
        i === prev.length - 1 ? { ...h, assistant: text } : h
      ))
    } catch (err) {
      console.error('[Gemini chat]', err)
      setHistory(prev => prev.map((h, i) =>
        i === prev.length - 1
          ? { ...h, assistant: `Erreur : ${err.message}` }
          : h
      ))
    } finally {
      setLoading(false)
    }
  }

  return { history, loading, remaining, max: MAX_CHAT, sendMessage }
}

// ── Suggestions hook ──────────────────────────────────────────────────────────

export function useGeminiSuggestions(profile, regionOffset) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (!profile?.plants?.length) return
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    try {
      const raw = localStorage.getItem(SUGGESTIONS_STORAGE_KEY)
      if (raw) {
        const cached = JSON.parse(raw)
        const age    = Date.now() - cached.timestamp
        if (age < 24 * 60 * 60 * 1000 && cached.suggestions?.length) {
          setSuggestions(cached.suggestions)
          return
        }
      }
    } catch {}

    setLoading(true)
    const gardenContext = buildGardenContext(profile, regionOffset)
    const prompt = `
${gardenContext}

Génère exactement 3 suggestions d'actions ou questions pertinentes pour ce jardinier aujourd'hui.
Chaque suggestion doit être une phrase courte (max 12 mots), actionnable ou intrigante.
Basées sur les stades actuels des plantes, la saison, et les éventuels conflits.

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans texte avant ou après :
{"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]}
`

    try {
      const res = await fetch(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            contents:         [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
          }),
        }
      )
      const data  = await res.json()
      const text  = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      const result = parsed.suggestions ?? []
      setSuggestions(result)
      localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify({
        suggestions: result,
        timestamp:   Date.now(),
      }))
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  return { suggestions, loading }
}
