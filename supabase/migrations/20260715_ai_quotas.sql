-- ─────────────────────────────────────────────────────────────────────────────
-- ai_quotas : quotas IA journaliers par utilisateur (chat + diagnostic)
--
-- Pourquoi : les quotas vivaient en localStorage (bypassables en vidant le
-- stockage). Ils sont maintenant comptés côté serveur, écrits uniquement par le
-- service role via la fonction serverless api/gemini.js.
--
-- À appliquer manuellement dans le SQL Editor Supabase (le projet n'utilise pas
-- la CLI de migrations) :
--   1. Dashboard Supabase → SQL Editor → New query
--   2. Colle le contenu entier de ce fichier → Run
--   Ré-applicable sans risque (IF NOT EXISTS + CREATE OR REPLACE).
-- ─────────────────────────────────────────────────────────────────────────────

-- Quotas IA journaliers par utilisateur
create table if not exists public.ai_quotas (
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null default (now() at time zone 'utc')::date,
  chat_count  int  not null default 0,
  diag_count  int  not null default 0,
  primary key (user_id, day)
);

alter table public.ai_quotas enable row level security;

-- Lecture par le propriétaire uniquement (le client peut afficher son quota restant)
drop policy if exists "ai_quotas_select_own" on public.ai_quotas;
create policy "ai_quotas_select_own" on public.ai_quotas
  for select using (auth.uid() = user_id);

-- Aucune policy insert/update : seul le service role (serverless) écrit.

-- Incrément atomique avec vérification de plafond.
-- Retourne le nouveau compteur, ou -1 si le plafond est atteint (pas d'incrément).
create or replace function public.increment_ai_quota(
  p_user_id uuid,
  p_kind    text,       -- 'chat' | 'diag'
  p_max     int
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into ai_quotas (user_id, day)
  values (p_user_id, (now() at time zone 'utc')::date)
  on conflict (user_id, day) do nothing;

  if p_kind = 'chat' then
    update ai_quotas
      set chat_count = chat_count + 1
      where user_id = p_user_id
        and day = (now() at time zone 'utc')::date
        and chat_count < p_max
      returning chat_count into v_count;
  elsif p_kind = 'diag' then
    update ai_quotas
      set diag_count = diag_count + 1
      where user_id = p_user_id
        and day = (now() at time zone 'utc')::date
        and diag_count < p_max
      returning diag_count into v_count;
  else
    raise exception 'kind invalide';
  end if;

  return coalesce(v_count, -1);
end;
$$;

revoke execute on function public.increment_ai_quota(uuid, text, int) from public, anon, authenticated;
