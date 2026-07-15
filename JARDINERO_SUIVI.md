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

---

# Alertes ravageurs & maladies saisonnières — passe du 2026-07-14

Prévention **avant** dégâts : croisement mois courant × plantes du jardin → conseils
ciblés. 100 % statique, zéro appel réseau/IA, fonctionne hors-ligne.

## 1. `src/data/ravageursSaison.js` (nouveau)

- `RISQUES_SAISON` : 11 risques documentés pour le climat français (mildiou, oïdium,
  doryphore, piéride du chou, mouche de la carotte, pucerons, limaces/escargots,
  altises, teigne du poireau, cul noir/carence calcium, fonte des semis). Chaque entrée :
  `mois`, `cibles`, `gravite`, `signes`, `prevention`, et `conseilCourt` (accroche Home).
- `cibles` accepte des `plantId` **ou** des familles préfixées `fam:` résolues via
  `PLANTE_FAMILLE` de `rotation.js` (ex : `fam:Brassicacées` couvre chou, radis, roquette…).
- `getRisquesActifs(plants, date=new Date())` → `[{ risque, plantesTouchees }]`,
  gravité forte d'abord. Retourne `[]` si aucune plante concernée (pas de faux positif).

## 2. `src/components/RisquesSaison.jsx` (nouveau)

- Section « 🛡️ À surveiller en {mois} » insérée dans `Conseiller.jsx` **entre le hero
  mensuel et les enrichissements/conseils** existants.
- Cards compactes (nom + badge gravité + emojis des plantes touchées), **expand au tap**
  pour révéler `signes` + `prevention` complets. Tri gravité forte d'abord.
- **N'affiche rien** si aucun risque actif ce mois pour ce jardin (pas de section vide).
- Bouton « Photographier un doute » **omis** : aucun composant `DiagnosticFlow`/flux photo
  n'existe dans le code (le diagnostic actuel est un sélecteur de symptômes texte dans
  `PlantDetailSheet`). Conforme à la consigne « seulement si le composant existe ».
- Style aligné sur les cards existantes du Conseiller (tokens `--jd-*`, emojis bruts
  comme le reste de la page).

## 3. Insight Home (`homeInsights.js`)

- **Un seul** insight ajouté quand un risque `gravite: 'forte'` est actif pour ≥ 1 plante :
  `🛡️ Période à risque mildiou pour tes plants de tomate — évite d'arroser le feuillage…`
- Intégré au mécanisme existant : nouveau type `pest_risk` dans la table `PRIORITY`
  (priorité 2, l'ancien slot `frost_risk` désormais libre), tri + `slice(0, 5)` inchangés.
- **Tap → onglet Conseiller** : ajout d'un champ optionnel `navigateTo` sur l'alerte ;
  `AlertCard` navigue vers `alert.navigateTo ?? 'mon-jardin'`.

## Validation

- `npm run build` : ✅ sans erreur.
- Mocks (esbuild+node) :
  - tomates/juillet → `mildiou-tomate[forte]` visible + insight Home « → conseiller » ;
  - mâche seule/juillet → `[]` (aucun faux positif) ;
  - `fam:Brassicacées` matche bien chou **et** radis ;
  - tri gravité forte d'abord (Mildiou, Doryphore avant les modérés).
- `npx eslint` sur les fichiers touchés : seules 2 erreurs **préexistantes** subsistent
  (`weekKey` inutilisé dans `Home`, catch vide dans `homeInsights`). `ravageursSaison.js`
  et `RisquesSaison.jsx` sont clean.
- Aucun appel réseau ajouté (données 100 % statiques).

---

# Templates de jardins à l'onboarding + mode pot — passe du 2026-07-14

Réduire l'abandon à l'entrée : proposer des jardins prêts à l'emploi après la
confirmation région/sol, et ajouter un mode « culture en pot » minimal.

## 1. `src/data/gardenTemplates.js` (nouveau)

- 4 templates : Balcon du débutant (pot), Carré potager familial, Coin aromatiques
  (pot), Impossible à rater. Chaque `plantId` **vérifié** contre `plantsUnified.js`
  (tous existent).
- `getTemplatePlants(template, { regionOffset, date })` : résout les plantes, **ignore
  avec `console.warn` explicite** tout `plantId` absent de `plantsUnified` (pas de crash
  ni d'id inventé), et expose `enSaison` (fenêtre de semis du mois via `calendarUtils`).
- **Décision saisonnalité** : le modèle de statuts n'a pas d'état « à semer / pas encore
  la saison » (une plante sans date retombe sur `sowed`/« à arroser »). On crée donc
  toutes les plantes du template comme **semées aujourd'hui** (cohérent avec AddPlantModal),
  et le calendrier/Conseiller guident — conforme au « sinon ajoute tout et laisse le
  calendrier guider ». `enSaison` sert d'info d'affichage (note « certaines se sèment
  plus tard »).

## 2. Onboarding — nouvelle étape `StepTemplate` (5e étape)

- Après StepConfirmation : « C'est parti ! » → StepTemplate ; « Passer pour l'instant »
  → jardin vide (comportement inchangé).
- Cards tapables (nom, description, aperçu emojis) via le composant partagé
  `GardenTemplateList.jsx`. Lien discret **« Je préfère partir de zéro »** = complétion
  vide, strictement identique à avant.
- Au choix d'un template : `applyGardenTemplate` (batch insert) **puis** écran de fin
  « Ton jardin est prêt 🌱 — N plantes t'attendent » **avant** de compléter l'onboarding
  (sinon la modal serait démontée par `onboardingDone` avant l'écran de succès).
- `applyGardenTemplate(templateId, regionId)` dans `ProfileContext` : `regionId` passé
  explicitement car `profile.region` n'est pas encore à jour pendant l'onboarding.
- Point d'entrée aussi dans **l'état vide de Mon Jardin** (`TemplatePicker.jsx`) pour les
  utilisateurs existants qui ne revoient jamais l'onboarding.

## 3. Mode pot (`container: boolean`) — minimal

- **Migration** `supabase/migrations/20260714_container_mode.sql` : `ALTER TABLE`
  ajoutant `container` sur `plants` **et** `historique` (à appliquer à la main via le
  dashboard, cf. en-tête du fichier). Propagé partout : `loadProfile`, `addPlant`,
  `addHistorique`, `applyGardenTemplate`, HarvestCelebration.
- **Arrosage** : facteur nommé `CONTAINER_FACTOR = 0.6` dans `arrosageUtils.getFrequencePlante`
  (les pots sèchent plus vite → intervalle raccourci).
- **Rotation** : les plantes en pot sont exclues des calculs/alertes — filtre `!h.container`
  dans `getRotationConflicts` et `getHistoriqueByPlot` (`rotation.js`) et en amont du
  `RotationDashboard`. C'est pourquoi `historique` porte aussi `container`.
- **AddPlantModal** : toggle « 🪴 Culture en pot » à l'étape 3.
- **PlantCard** : badge discret « 🪴 Pot ».
- GardenEditor **non touché** (hors scope).

## Validation

- `npm run build` : ✅ sans erreur.
- Mocks (esbuild+node) : les 4 templates résolvent toutes leurs plantes ; un `plantId`
  bidon déclenche un `console.warn` explicite et est ignoré (pas de crash) ; `enSaison`
  calculé correctement depuis le calendrier.
- `npx eslint` sur les fichiers touchés : seules des erreurs **préexistantes** subsistent
  (`getBestNeighbors` inutilisé dans AddPlantModal, setState-in-effect + catch vide dans
  OnboardingModal/ProfileContext, `Date.now()` en render dans PlantCard). Les nouveaux
  fichiers (`gardenTemplates.js`, `GardenTemplateList.jsx`, `TemplatePicker.jsx`) sont clean.
- Tests manuels restants (nécessitent la base + la migration appliquée) :
  - [ ] onboarding neuf → « Balcon du débutant » → 5 plantes créées, `container=true` ;
  - [ ] « Partir de zéro » → jardin vide, comportement identique à avant ;
  - [ ] plante en pot → fréquence d'arrosage raccourcie, absente des alertes de rotation,
    badge 🪴 visible.

---

# Valeur des récoltes en euros — passe du 2026-07-14

« Le chiffre le plus motivant » : estimer en € la valeur de ce que le jardin a produit.
La page « Mes Récoltes » de base n'existait pas → **vue Récoltes construite** (choix
utilisateur) comme onglet de Mon Jardin.

## 1. `src/data/prixRecoltes.js` (nouveau)

- `PRIX_RECOLTES` : prix marché (€/kg) + rendement amateur (kg/plant/saison) pour ~80
  plantes comestibles de `plantsUnified` (légumes, aromatiques, petits fruits, arbres).
  Ordres de grandeur assumés (jamais de fausse précision → toujours préfixé « ~ »).
  Les ornementales n'ont pas d'entrée → non valorisées.
- `poidsPiece` optionnel (salade, radis, courgette…) pour saisir la récolte à l'unité.
- `estimerValeurRecolte(plantId, quantiteKg = null)` → € (rendement par défaut si non
  saisi), ou `null` si la plante n'a pas de prix connu. + `poidsRecolte`, `uniteSaisie`.

## 2. Saisie optionnelle à la récolte (`HarvestCelebration.jsx`)

- Champ discret « Quantité récoltée (optionnel) » à l'écran de récolte : input numérique
  + unité **kg**, ou bascule **pièces/kg** pour les plantes vendues à l'unité (converti
  via `poidsPiece`). Estimation « 💶 ~X,XX € » affichée en direct.
- `quantiteKg` (nullable) stocké dans l'entrée historique. L'écriture de l'historique a
  été **déplacée du montage vers les boutons** (Replanter / Pas pour l'instant) pour
  inclure la quantité saisie. Colonne SQL : migration
  `supabase/migrations/20260714_historique_quantite.sql` (`historique.quantite_kg`,
  à appliquer via le dashboard). Propagé dans `addHistorique` + `loadProfile`.

## 3. Affichage (`src/components/RecoltesView.jsx`, onglet « 🧺 Récoltes »)

- **Filtre par année** (déduit des dates de récolte) ; toutes les stats suivent l'année active.
- Cartes de stats : Récoltes (nb), Variétés (distinctes), Poids estimé ~, et la carte
  vedette **« 💶 ~87 € · estimation prix marché »** (accent). Les cartes Poids/Valeur
  **n'apparaissent pas** si aucune plante de l'historique n'a de prix connu.
- Liste des récoltes de l'année : chaque entrée affiche « ~4,50 € » si estimable.
- Le `~` est **toujours** présent (estimation assumée) ; totaux arrondis à l'euro,
  entrées au centime.
- Monté comme 5e onglet de Mon Jardin, **et** rendu dans l'état vide (0 plante) si un
  historique existe — pour que le chiffre reste visible même après avoir tout récolté.

## Validation

- `npm run build` : ✅ sans erreur.
- Mocks (esbuild+node) : tomate sans saisie → 10,50 € (rendement défaut) ; tomate 2 kg →
  7 € (recalcul) ; salade 3 pièces → 4,80 € ; ornementale → `null` ; total annuel 2026
  cohérent (12,10 €, entrées d'autres années et sans prix exclues).
- `npx eslint` : `prixRecoltes.js`, `RecoltesView.jsx`, `HarvestCelebration.jsx` clean ;
  seules des erreurs **préexistantes** subsistent dans `ProfileContext`.
- Aucun appel réseau ajouté.
- Test manuel restant : appliquer la migration `quantite_kg`, récolter une plante avec/sans
  quantité, vérifier la carte € et le filtre année en conditions réelles.

---

# Proxy Gemini serverless + quotas serveur — passe du 2026-07-15

**Problème corrigé** : `useGemini.js` appelait l'API Gemini directement depuis le
client avec `VITE_GEMINI_API_KEY`. La clé était donc **lisible dans le bundle JS de
prod** (extractible par n'importe qui), et les quotas (10 messages/jour) vivaient en
localStorage, contournables en vidant le stockage.

## 1. Fonction serverless `api/gemini.js` (nouveau)

- Runtime Node (Vercel). Toutes les requêtes Gemini passent par `POST /api/gemini`.
  La clé Gemini vit **uniquement côté serveur**, jamais dans le client.
- **Auth** : header `Authorization: Bearer <access_token Supabase>`, vérifié via
  `supabase.auth.getUser(token)` (client créé avec la **service role key**). Pas de
  token / token invalide → 401 « Session expirée, reconnecte-toi. »
- **Modèle hardcodé côté serveur** (`gemini-2.0-flash-lite`) : le client ne choisit
  ni le modèle ni l'URL. `maxOutputTokens` plafonné à 800 quoi que demande le client.
  Taille du body plafonnée (~6 Mo, marge pour les images du futur diagnostic).
- **Quotas dans Supabase** (chat 10/j, diagnostic 5/j ; suggestions sans quota) via
  `increment_ai_quota` appelée **avant** l'appel Gemini. Retour `-1` → 429 « Tu as
  utilisé tous tes messages du jour. Reviens demain ! 🌱 ». La réponse succès renvoie
  `remaining` (quota restant) pour resynchroniser l'UI.
- **Mapping erreurs upstream → français** (jamais le corps brut Gemini) : 429 → 503
  « très sollicité » ; 400 → 502 « n'a pas compris » ; 5xx/timeout/réseau → 503
  « momentanément indisponible » ; réponse sans candidates (blocage safety) → 200 avec
  message neutre « Reformule ta question sur ton jardin. 🌱 ». Timeout ~25 s.
- Le case `kind === 'diagnostic'` est **déjà prévu** (quota `diag`, images
  `inline_data` dans `contents`) : le prompt Diagnostic s'y branchera sans retoucher
  ce fichier.

## 2. Migration `supabase/migrations/20260715_ai_quotas.sql` (nouveau)

- Table `ai_quotas (user_id, day, chat_count, diag_count)`, RLS activée : **select
  par le propriétaire** uniquement, **aucune policy insert/update** (seul le service
  role écrit).
- Fonction `increment_ai_quota(p_user_id, p_kind, p_max)` `SECURITY DEFINER` :
  incrément atomique avec vérification de plafond, retourne le nouveau compteur ou
  `-1` si plafond atteint. `EXECUTE` révoqué à `public/anon/authenticated`.
- **⚠️ À appliquer manuellement** : dashboard Supabase → SQL Editor → coller le
  fichier → Run (le projet n'utilise pas la CLI de migrations).

## 3. Refactor `src/hooks/useGemini.js`

- Suppression de `GEMINI_API_URL`, `GEMINI_API_KEY` et de toute référence à
  `VITE_GEMINI_API_KEY`. Nouveau helper `callGemini(kind, payload)` qui joint le token
  Supabase et appelle `/api/gemini`.
- `useGeminiChat` : plus de compteur localStorage (`jd_chat_usage` nettoyé via
  `localStorage.removeItem`). `remaining` initialisé à `MAX_CHAT`, resynchronisé sur
  la réponse serveur ; sur épuisement (429) l'UI bascule en « Reviens demain ». Les
  erreurs (déjà en français et sûres) s'affichent dans la bulle assistant.
- `useGeminiSuggestions` : cache localStorage 24h **conservé** ; fetch direct remplacé
  par `callGemini('suggestions', …)`.
- `buildGardenContext` : **inchangée et toujours exportée**. `AiChat.jsx` et
  `Conseiller.jsx` fonctionnent sans modification (mêmes retours de hooks).

## ⚠️ Actions manuelles restantes (à faire par toi)

1. **Appliquer la migration SQL** `20260715_ai_quotas.sql` (SQL Editor Supabase).
2. **Variables d'environnement Vercel** (Settings → Environment Variables) :
   - `GEMINI_API_KEY` = l'ancienne clé (déplacée hors du client) ;
   - `SUPABASE_URL` = même valeur que `VITE_SUPABASE_URL` ;
   - `SUPABASE_SERVICE_ROLE_KEY` = clé service role (Supabase → Settings → API →
     `service_role`). **Ne jamais** la préfixer `VITE_` ni l'exposer au client.
3. **RÉVOQUER / RÉGÉNÉRER l'ancienne clé Gemini** dans Google AI Studio : elle a été
   exposée dans les bundles JS **déjà déployés** en prod, donc considère-la comme
   compromise. Génère-en une nouvelle et mets `GEMINI_API_KEY` (Vercel) à jour avec.
4. `VITE_GEMINI_API_KEY` a été retirée de `.env.local` — retire-la aussi côté Vercel
   si elle y était (elle ne sert plus).

## Dev local

`vite dev` (`npm run dev`) **ne sert pas** le dossier `api/` : pour tester le proxy en
local, lancer `npx vercel dev` (avec les variables serveur dans un `.env` Vercel).
Si `/api/gemini` échoue en `npm run dev`, l'erreur s'affiche proprement dans le chat
(bulle assistant) — la page ne plante pas.

## Validation

- `npm run build` : ✅ sans erreur.
- `grep -rn "VITE_GEMINI\|generativelanguage.googleapis" src/` : **vide**.
- Bundle `dist/` après build : **aucune** trace de la clé (`AIzaSy…`), de l'URL Gemini
  ni de `VITE_GEMINI` (vérifié par grep).
- `.env.local` et `.env` sont bien dans `.gitignore` (`.env` + `.env.*`).
- Tests manuels restants (nécessitent `vercel dev` + variables serveur + migration) :
  - [ ] requête sans token → 401 message français ;
  - [ ] 11e message chat du jour → 429 « Reviens demain », UI en état épuisé ;
  - [ ] suggestions toujours chargées (cache 24h intact) ;
  - [ ] diagnostic (quand le prompt sera fait) → quota `diag` 5/j.
