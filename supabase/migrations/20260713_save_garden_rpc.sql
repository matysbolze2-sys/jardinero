-- ─────────────────────────────────────────────────────────────────────────────
-- save_garden : sauvegarde transactionnelle des parcelles d'un jardin
--
-- Pourquoi : côté client, la séquence delete(plots) → insert(plots) →
-- insert(plot_plants) pouvait détruire le jardin si un insert échouait après
-- le delete (réseau, RLS, contrainte). Une fonction plpgsql est atomique :
-- tout passe ou rien ne change.
--
-- Comment appliquer (le projet n'utilise pas la CLI de migrations Supabase) :
--   1. Dashboard Supabase → SQL Editor → New query
--   2. Colle le contenu entier de ce fichier → Run
--   Ré-applicable sans risque (CREATE OR REPLACE + IF NOT EXISTS).
--
-- Format attendu pour p_plots :
-- [
--   {
--     "id": "uuid", "label": "Carré nord", "x": 0, "y": 0,
--     "width": 1.5, "height": 1,
--     "plants": [ { "plant_id": "uuid", "quantity": 2 }, ... ]
--   },
--   ...
-- ]
-- ─────────────────────────────────────────────────────────────────────────────

-- Colonne quantity : présente dans schema.sql mais peut manquer sur les bases
-- déjà déployées — la fonction en a besoin.
ALTER TABLE plot_plants ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION public.save_garden(p_garden_id uuid, p_plots jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  -- SECURITY DEFINER contourne RLS : vérification de propriété explicite
  IF NOT EXISTS (SELECT 1 FROM gardens WHERE id = p_garden_id AND user_id = v_user) THEN
    RAISE EXCEPTION 'Jardin introuvable ou non autorisé';
  END IF;

  -- Détache les plantes des anciennes parcelles de ce jardin
  -- (plants.plot_id est la source de vérité pour la rotation par parcelle)
  UPDATE plants SET plot_id = NULL, updated_at = NOW()
   WHERE user_id = v_user
     AND plot_id IN (SELECT id FROM plots WHERE garden_id = p_garden_id);

  DELETE FROM plots WHERE garden_id = p_garden_id;

  INSERT INTO plots (id, garden_id, user_id, label, x, y, width, height)
  SELECT COALESCE((p->>'id')::uuid, gen_random_uuid()),
         p_garden_id,
         v_user,
         NULLIF(p->>'label', ''),
         COALESCE((p->>'x')::numeric, 0),
         COALESCE((p->>'y')::numeric, 0),
         COALESCE((p->>'width')::numeric, 1),
         COALESCE((p->>'height')::numeric, 1)
  FROM jsonb_array_elements(COALESCE(p_plots, '[]'::jsonb)) AS p;

  INSERT INTO plot_plants (plot_id, plant_id, quantity)
  SELECT (p->>'id')::uuid,
         (pl->>'plant_id')::uuid,
         GREATEST(1, COALESCE((pl->>'quantity')::int, 1))
  FROM jsonb_array_elements(COALESCE(p_plots, '[]'::jsonb)) AS p,
       jsonb_array_elements(COALESCE(p->'plants', '[]'::jsonb)) AS pl
  WHERE pl->>'plant_id' IS NOT NULL;

  -- Réaligne plants.plot_id sur les nouvelles affectations
  UPDATE plants pt
     SET plot_id = pp.plot_id, updated_at = NOW()
    FROM plot_plants pp
    JOIN plots pl ON pl.id = pp.plot_id
   WHERE pp.plant_id = pt.id
     AND pl.garden_id = p_garden_id
     AND pt.user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.save_garden(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_garden(uuid, jsonb) TO authenticated;
