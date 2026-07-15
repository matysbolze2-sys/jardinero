-- ─────────────────────────────────────────────────────────────────────────────
-- Mode « culture en pot »
--
-- Ajoute un drapeau `container` sur les plantes (et sur l'historique de récolte,
-- pour que les cultures en pot soient exclues des calculs de rotation même après
-- récolte — le substrat d'un pot se change, la rotation n'a pas de sens).
--
-- Comment appliquer (le projet n'utilise pas la CLI de migrations Supabase) :
--   1. Dashboard Supabase → SQL Editor → New query
--   2. Colle ce fichier → Run
--   Ré-applicable sans risque (IF NOT EXISTS).
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE plants     ADD COLUMN IF NOT EXISTS container BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE historique ADD COLUMN IF NOT EXISTS container BOOLEAN NOT NULL DEFAULT FALSE;
