-- Profiles utilisateur
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  region TEXT,
  soil TEXT,
  coords JSONB,
  settings JSONB DEFAULT '{"onboardingDone": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plantes en cours
CREATE TABLE plants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  plant_id TEXT,
  planted_at DATE,
  status TEXT DEFAULT 'sowed',
  status_override TEXT,
  variety TEXT,
  plot_id UUID,
  estimated_harvest_start DATE,
  estimated_harvest_end DATE,
  season_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historique d'arrosage
CREATE TABLE arrosages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  watered_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal de bord par plante
CREATE TABLE journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  texte TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historique des récoltes
CREATE TABLE historique (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  plant_id TEXT,
  planted_at DATE,
  harvested_at DATE NOT NULL,
  variety TEXT,
  plot_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jardins
CREATE TABLE gardens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Mon jardin',
  width NUMERIC,
  height NUMERIC,
  orientation TEXT DEFAULT 'N',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcelles
CREATE TABLE plots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garden_id UUID REFERENCES gardens(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  x NUMERIC DEFAULT 0,
  y NUMERIC DEFAULT 0,
  width NUMERIC DEFAULT 1,
  height NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liaison parcelles <-> plantes
CREATE TABLE plot_plants (
  plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  PRIMARY KEY (plot_id, plant_id)
);

-- Checklist hebdomadaire
CREATE TABLE checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_key DATE NOT NULL,
  tache_text TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────────────────

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrosages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal     ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gardens     ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE plot_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist   ENABLE ROW LEVEL SECURITY;

-- Policies : chaque utilisateur ne voit que ses propres données
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own plants"
  ON plants FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own arrosages"
  ON arrosages FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journal"
  ON journal FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own historique"
  ON historique FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own gardens"
  ON gardens FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own plots"
  ON plots FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own plot_plants"
  ON plot_plants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM plots WHERE plots.id = plot_plants.plot_id
      AND plots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own checklist"
  ON checklist FOR ALL USING (auth.uid() = user_id);

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, settings)
  VALUES (NEW.id, '{"onboardingDone": false}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
