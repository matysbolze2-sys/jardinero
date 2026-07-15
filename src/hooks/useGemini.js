import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getEffectiveStatus, getCycleProgress, getStageMessage } from '../utils/plantStatusUtils'
import { ASSOCIATIONS } from '../data/associations'

const SUGGESTIONS_STORAGE_KEY = 'jd_suggestions_cache'
const MAX_CHAT = 10

// ── Proxy serverless ──────────────────────────────────────────────────────────
// La clé Gemini vit uniquement côté serveur (api/gemini.js). On relaie le payload
// Gemini construit ici, avec le token Supabase pour l'auth + les quotas serveur.

async function callGemini(kind, payload) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? ''}`,
    },
    body: JSON.stringify({ kind, ...payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Une erreur est survenue, réessaie.')
  return data // { text, remaining }
}

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
  const [history, setHistory]     = useState([])
  const [loading, setLoading]     = useState(false)
  // Le quota fait désormais foi côté serveur. On l'affiche optimiste à MAX_CHAT
  // et on se resynchronise sur le `remaining` renvoyé à chaque réponse.
  const [remaining, setRemaining] = useState(MAX_CHAT)

  // Nettoyage de l'ancien compteur localStorage, désormais obsolète.
  useEffect(() => {
    localStorage.removeItem('jd_chat_usage')
  }, [])

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading || remaining <= 0) return

    const newEntry = { user: userMessage, assistant: null }
    setHistory(prev => [...prev, newEntry])
    setLoading(true)

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

    try {
      const data = await callGemini('chat', {
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 400,
        },
      })
      const text = data.text ?? 'Pas de réponse.'
      if (typeof data.remaining === 'number') setRemaining(data.remaining)
      setHistory(prev => prev.map((h, i) =>
        i === prev.length - 1 ? { ...h, assistant: text } : h
      ))
    } catch (err) {
      // Les messages du proxy sont déjà en français et sûrs.
      setHistory(prev => prev.map((h, i) =>
        i === prev.length - 1
          ? { ...h, assistant: err.message }
          : h
      ))
      // Épuisement du quota : bascule l'UI en état "reviens demain".
      if (/Reviens demain/.test(err.message)) setRemaining(0)
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
      const data  = await callGemini('suggestions', {
        contents:         [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
      })
      const text  = data.text ?? '{}'
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
