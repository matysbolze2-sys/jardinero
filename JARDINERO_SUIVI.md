# JARDINERO — Suivi des corrections fondations

> Passe du 2026-07-13 sur les 5 problèmes structurels identifiés en revue de code
> (base : `main`, après `1e1b2bf`).

## 1. `useAuth` ne retournait pas `user` — ✅ corrigé

- Source de vérité unique : le listener `onAuthStateChange` de `App.jsx`, qui passe
  déjà `user` en prop à `ProfileProvider`.
- `ProfileContext` expose maintenant `user` dans sa value ; `Home.jsx` le lit via
  `useProfile()` (et garde `signOut` de `useAuth`). Aucun listener dupliqué.

## 2. Flow "mot de passe oublié" — ✅ corrigé (sans router)

- `useAuth.resetPassword` : `redirectTo` pointe désormais sur la racine
  (`window.location.origin`) au lieu de `/reset-password` qui ne pouvait pas exister.
- `App.jsx` écoute l'événement `PASSWORD_RECOVERY` et affiche le nouveau composant
  `src/pages/ResetPasswordView.jsx` : nouveau mot de passe + confirmation,
  `supabase.auth.updateUser({ password })`, messages d'erreur en français,
  bouton de retour à l'app connectée. Style aligné sur `LoginPage.jsx` (tokens `--jd-*`).

## 3. `saveGarden` transactionnel — ✅ corrigé

- Nouvelle migration `supabase/migrations/20260713_save_garden_rpc.sql` :
  fonction plpgsql `save_garden(p_garden_id uuid, p_plots jsonb)`,
  `SECURITY DEFINER` avec vérification `auth.uid()` = propriétaire du jardin.
  Delete + insert des plots et plot_plants dans une seule transaction :
  un échec ne détruit plus le jardin.
- **⚠️ À appliquer manuellement** : dashboard Supabase → SQL Editor → coller le
  fichier → Run (le projet n'utilise pas la CLI de migrations). Tant que la
  fonction n'est pas créée, la sauvegarde des parcelles renvoie une erreur
  (mais ne détruit rien).
- Côté client, `saveGarden` appelle `supabase.rpc('save_garden', …)` et retourne
  `{ error }` ; l'état local n'est mis à jour qu'en cas de succès.

## 4. `plants.plot_id` — source de vérité — ✅ corrigé

- Constat confirmé : la colonne existait dans le schéma mais n'était jamais écrite ;
  `plant.plotId` était toujours `null` à la récolte → `historique.plot_id` null →
  rotation par parcelle inopérante.
- `plants.plot_id` est maintenant la source de vérité plante → parcelle :
  - `assignPlantToPlot` écrit `plants.plot_id` (en plus de `plot_plants`) ;
  - `removePlantFromPlot` le remet à null ;
  - le RPC `save_garden` réaligne `plants.plot_id` sur les nouvelles affectations ;
  - l'état local (`profile.plants[].plotId`) est synchronisé dans les trois cas.
- Résultat : après récolte d'une plante assignée, `historique.plot_id` est non null
  (via `HarvestCelebration` → `addHistorique`).
- **Note — redondance `plot_plants`** : la table ne reste utile que pour la colonne
  `quantity` (nombre de plants par parcelle). Le lien plante↔parcelle lui-même est
  redondant avec `plants.plot_id`. On pourrait déplacer `quantity` vers `plants` et
  supprimer la table, mais **pas fait sans confirmation** (migration destructive).

## 5. Code mort et dépendance inutile — ✅ nettoyé

- `three` désinstallé (`npm uninstall three`) — jamais importé, `GardenView3D` est en SVG/CSS.
- `src/components/JardinVisuel.jsx` supprimé (importé nulle part).
- `src/data/botanical.js` supprimé (remplacé par `rotation.js`, vérifié par grep).
- `console.log` de debug supprimés dans `useSoilData.js` (les logs `[StepSol]` / `[GPS]`
  d'`OnboardingModal.jsx` mentionnés en revue n'existaient déjà plus).

## 6. Passe tu/vous — ✅ tutoiement partout

- Chaînes UI corrigées dans : `useAuth.js`, `App.jsx`, `LoginPage.jsx`, `MonJardin.jsx`,
  `Home.jsx`, `Conseiller.jsx`, `OnboardingModal.jsx`, `MeteoWidget.jsx`,
  `PlantDetailSheet.jsx`, `CalendarTable.jsx` (badge « Vous » → « Toi »),
  `GardenSetup.jsx`, `GardenView3D.jsx`, `soils.js`, et réécriture complète des
  impératifs de `conseils.js` (Semez → Sème, etc.).
- Non touché : commentaires de code, données botaniques.

## Validation

- `npm run build` : ✅ sans erreur.
- `npx eslint src` : 21 erreurs **préexistantes** (setState-in-effect, imports
  inutilisés, clé dupliquée dans `LoginPage`) — aucune introduite par cette passe.
- `grep "from 'three'" src` : vide ; `three` absent de `package.json`.
- `grep -rn "\bvous\b\|\bvotre\b\|\bvos\b" src` : plus aucune chaîne UI.
- Tests manuels restants (nécessitent la base + un compte) :
  - [ ] flow email "mot de passe oublié" de bout en bout ;
  - [ ] appliquer la migration SQL puis sauvegarder un jardin ;
  - [ ] récolter une plante assignée et vérifier `historique.plot_id` non null.
