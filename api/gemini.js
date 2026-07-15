// ─────────────────────────────────────────────────────────────────────────────
// Proxy Gemini serverless (runtime Node, Vercel)
//
// Pourquoi : la clé Gemini était appelée directement depuis le client, donc
// visible dans le bundle JS de prod. Ici elle ne vit que côté serveur. Les
// quotas sont comptés dans Supabase (table ai_quotas) et non plus en
// localStorage. Le modèle et les URLs sont hardcodés : le client ne choisit rien.
//
// Variables d'environnement serveur (sans préfixe VITE_) :
//   GEMINI_API_KEY              — la clé Gemini
//   SUPABASE_URL                — même valeur que VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   — clé service role (Supabase → Settings → API)
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const GEMINI_MODEL = 'gemini-2.0-flash-lite'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const MAX_CHAT = 10
const MAX_DIAG = 5
const MAX_OUTPUT_TOKENS = 800          // plafond serveur, quel que soit le client
const MAX_BODY_CHARS = 6_000_000       // ~6 Mo : marge pour les images du diagnostic
const GEMINI_TIMEOUT_MS = 25_000

// Un seul client service role réutilisé entre invocations chaudes
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function send(res, status, payload) {
  res.status(status).json(payload)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Méthode non autorisée.' })
  }

  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    return send(res, 401, { error: 'Session expirée, reconnecte-toi.' })
  }

  let userId
  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      return send(res, 401, { error: 'Session expirée, reconnecte-toi.' })
    }
    userId = data.user.id
  } catch (err) {
    console.error('[gemini] auth check failed', err?.message)
    return send(res, 401, { error: 'Session expirée, reconnecte-toi.' })
  }

  // ── 2. Validation ────────────────────────────────────────────────────────────
  const body = req.body ?? {}
  const { kind, contents, systemInstruction, generationConfig } = body

  if (!['chat', 'suggestions', 'diagnostic'].includes(kind)) {
    return send(res, 400, { error: 'Requête invalide.' })
  }
  if (!Array.isArray(contents) || contents.length === 0) {
    return send(res, 400, { error: 'Requête invalide.' })
  }

  let rawSize
  try {
    rawSize = JSON.stringify(contents).length
  } catch {
    return send(res, 400, { error: 'Requête invalide.' })
  }
  if (rawSize > MAX_BODY_CHARS) {
    return send(res, 413, { error: 'Ta demande est trop volumineuse.' })
  }

  // ── 3. Quotas (avant l'appel Gemini) ─────────────────────────────────────────
  // suggestions : pas de quota (le cache client 24h suffit)
  let remaining = null
  if (kind === 'chat' || kind === 'diagnostic') {
    const rpcKind = kind === 'chat' ? 'chat' : 'diag'
    const max = kind === 'chat' ? MAX_CHAT : MAX_DIAG
    try {
      const { data, error } = await supabase.rpc('increment_ai_quota', {
        p_user_id: userId,
        p_kind: rpcKind,
        p_max: max,
      })
      if (error) throw error
      const count = data
      if (count === -1) {
        return send(res, 429, {
          error: 'Tu as utilisé tous tes messages du jour. Reviens demain ! 🌱',
        })
      }
      remaining = Math.max(0, max - count)
    } catch (err) {
      console.error('[gemini] quota rpc failed', userId, err?.message)
      return send(res, 503, { error: 'Le conseiller est momentanément indisponible.' })
    }
  }

  // ── 4. Appel Gemini ──────────────────────────────────────────────────────────
  const geminiBody = { contents }
  if (typeof systemInstruction === 'string' && systemInstruction.trim()) {
    geminiBody.system_instruction = { parts: [{ text: systemInstruction }] }
  }
  const cfg = (generationConfig && typeof generationConfig === 'object') ? generationConfig : {}
  geminiBody.generationConfig = {
    ...cfg,
    maxOutputTokens: Math.min(Number(cfg.maxOutputTokens) || MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS),
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

  let upstream
  try {
    upstream = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    console.error('[gemini] upstream fetch failed', userId, err?.name, err?.message)
    return send(res, 503, { error: 'Le conseiller est momentanément indisponible.' })
  }
  clearTimeout(timeout)

  // ── 5. Mapping erreurs upstream → français (jamais le corps brut Gemini) ──────
  if (!upstream.ok) {
    console.error('[gemini] upstream error', upstream.status, 'user', userId)
    if (upstream.status === 429) {
      return send(res, 503, { error: 'Le conseiller est très sollicité, réessaie dans quelques minutes.' })
    }
    if (upstream.status === 400) {
      return send(res, 502, { error: "Le conseiller n'a pas compris la demande, réessaie." })
    }
    // 5xx et tout autre statut (401/403 config clé, etc.)
    return send(res, 503, { error: 'Le conseiller est momentanément indisponible.' })
  }

  let data
  try {
    data = await upstream.json()
  } catch (err) {
    console.error('[gemini] upstream json parse failed', userId, err?.message)
    return send(res, 503, { error: 'Le conseiller est momentanément indisponible.' })
  }

  // Réponse sans candidates (blocage safety) → 200 avec message neutre
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    return send(res, 200, {
      text: 'Je ne peux pas répondre à cette demande. Reformule ta question sur ton jardin. 🌱',
      remaining,
    })
  }

  return send(res, 200, { text, remaining })
}
