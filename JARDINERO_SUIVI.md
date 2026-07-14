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

---

# Alertes gel & pluie — passe du 2026-07-14

Transforme la météo décorative en météo actionnable, en s'appuyant sur l'appel
Open-Meteo déjà présent dans `useMeteo` (aucun nouvel appel réseau ajouté).

## 1. `src/utils/meteoAlerts.js` (nouveau) — logique pure, testée

- Seuils nommés en tête : `SEUIL_GEL=2`, `SEUIL_GEL_SEVERE=-1`,
  `SEUIL_PLUIE_PASSEE_MM=5`, `SEUIL_PLUIE_PREVUE_MM=8`.
- `detectFrostRisk(daily)` → `null` ou `{ type:'gel'|'gel_severe', date, tempMin, dansJours }`,
  première nuit ≤ 2°C sur les 3 prochains jours (sévère si ≤ -1°C).
- `shouldSkipWatering(daily)` → `{ skip, raison, mm }` : skip si pluie hier+aujourd'hui
  ≥ 5 mm, ou pluie prévue demain ≥ 8 mm.
- `getFrostSensitivePlants(plants)` : familles Solanacées/Cucurbitacées (via
  `PLANTE_FAMILLE` de `rotation.js`) + ids sensibles (basilic, haricot, maïs, tomate-cerise).
- **Robustesse index** : chaque fonction repère aujourd'hui via `time.indexOf(today)`,
  donc insensible au décalage introduit par `past_days`.
- Validé par mocks (esbuild+node) : min -3°C à J+1 → `gel_severe` ; 12 mm hier → skip ;
  10 mm demain → skip ; scénario calme → `null` / `skip:false`.

## 2. `useMeteo.js` — `past_days=1`

- Ajout de `&past_days=1` à l'URL pour récupérer la **pluie d'hier** (nécessaire au
  point 3). Conséquence : `time[0]` devient hier.
- Tous les consommateurs internes rendus robustes : `useMeteo` calcule et expose
  `todayIdx` ; les boucles gel/sécheresse et `MeteoWidget` (widget 7 jours) partent
  de cet index. `aPluiePrevue` était déjà indexé par date (inchangé).

## 3. `src/components/FrostAlert.jsx` (nouveau)

- Bannière proéminente en **haut de Home** (au-dessus de MeteoWidget et des insights),
  affichée **uniquement** si `detectFrostRisk` retourne un risque.
- Rouge doux (`--jd-harvest-*`) pour `gel_severe`, ambre doux (`--jd-warning-*`) pour `gel`.
- Liste des plantes sensibles du jardin (OpenMoji + nom) ; si aucune → version courte,
  moins alarmante.
- Libellé « cette nuit / la nuit prochaine / dans la nuit de X à Y » selon `dansJours`.
- **Dismissable par jour** : `localStorage 'jd_frost_dismissed' = date du jour`.
  Réapparaît le lendemain si le risque persiste.

## 4. Suggestion pluie dans l'arrosage (suggestion, pas d'annulation)

- `ArrosageCalendar.jsx` : bannière en tête de section quand `shouldSkipWatering().skip`
  (`🌧️ Il a plu 12 mm — tu peux sauter l'arrosage` / `10 mm prévus demain — attends`).
  Passe désormais `profile.coords` à `useMeteo` (comme Home) pour la précision GPS.
- `Home.jsx` : la même suggestion s'affiche sous les insights **uniquement** s'il existe
  par ailleurs une alerte `water_urgent` (sinon hors-sujet).
- **Aucune** donnée d'arrosage ni compteur modifié — l'utilisateur reste maître.

## 5. Déduplication du gel (zéro bruit)

Le gel était affiché à 3 endroits potentiels. Centralisé sur `FrostAlert` :
- `MeteoWidget.jsx` : bannière « gel » retirée (garde la sécheresse). Vouvoiement
  résiduel corrigé (« pensez » → « pense », « Touchez » → « Touche »).
- `homeInsights.js` : insight `frost_risk` et le set `FROST_SENSITIVE` supprimés
  (`getDailyAlerts` ne prend plus le paramètre `meteoAlerts`).

## 6. Accroche notifications — TODO

`src/hooks/useNotifications.js` **n'existe pas** (prompt Notifs non encore exécuté).
`detectFrostRisk` est exporté proprement et prêt à brancher.
- [ ] **TODO (quand le prompt Notifs sera fait)** : ajouter un type d'alerte `gel`
  (activé par défaut) envoyant une notification à 18h le jour même quand
  `detectFrostRisk` détecte un gel pour la nuit suivante. Anti-doublon :
  `localStorage 'jd_last_gel_notif' = date`.

## Validation

- `npm run build` : ✅ sans erreur.
- `npx eslint` sur les fichiers touchés : seules subsistent 3 erreurs **préexistantes**
  (setState-in-effect dans `useMeteo`, `weekKey` inutilisé dans `Home`, bloc catch vide
  dans `homeInsights`) — aucune introduite par cette passe. `meteoAlerts.js` et
  `FrostAlert.jsx` sont clean.
- Logique pure validée par mocks (voir §1).
- Test manuel restant : vérifier le rendu réel avec des coords ayant un gel/pluie prévus
  (dépend de la météo réelle Open-Meteo).
