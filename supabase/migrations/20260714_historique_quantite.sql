-- ─────────────────────────────────────────────────────────────────────────────
-- Quantité récoltée (optionnelle) sur l'historique de récolte
--
-- Permet d'affiner l'estimation de la valeur en euros des récoltes. Si NULL,
-- l'app retombe sur le rendement moyen par plant (data/prixRecoltes.js).
--
-- Comment appliquer (le projet n'utilise pas la CLI de migrations Supabase) :
--   1. Dashboard Supabase → SQL Editor → New query
--   2. Colle ce fichier → Run
--   Ré-applicable sans risque (IF NOT EXISTS).
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE historique ADD COLUMN IF NOT EXISTS quantite_kg NUMERIC;
