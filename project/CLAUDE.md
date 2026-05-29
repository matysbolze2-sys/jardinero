# JARDINERO — Design System

> **Direction visuelle : Forêt Profonde v2**
> App de potager (Sud-Ouest / Bordeaux) · Mobile-first
>
> Ce fichier est lu automatiquement par Claude Code à chaque session. Il fait foi pour tout ce qui touche au design (couleurs, polices, espacements, illustrations, composants). N'introduis pas de valeurs en dur — référence toujours les tokens.

---

## 1. Identité visuelle

**Forêt Profonde v2** — vert profond aéré, polices rondes et friendly, illustrations OpenMoji avec halo lumineux. Le but : un app qui se sent à la fois **premium** (verres dépolis, ombres douces, accent lime qui pop) et **chaleureux** (formes arrondies, illustrations colorées, langage clair).

- Fond dark vert (jamais noir pur)
- Accent lime `#a6e36b` parcimonieux mais expressif
- Pas de serif. Que des sans-serif rondes (Plus Jakarta Sans, Manrope)
- Illustrations : emojis rendus via OpenMoji SVG (jamais d'emoji système, jamais d'icône custom)

---

## 2. Polices

Charger via Google Fonts dans `<head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

| Rôle | Famille | Poids habituels |
|---|---|---|
| Display (titres, chiffres expressifs) | **Plus Jakarta Sans** | 700 / 800 |
| Body / UI | **Manrope** | 400 / 500 / 600 |
| Mono (kicker, ID, dimensions, code) | **JetBrains Mono** | 400 / 500 |

---

## 3. Tokens

Tous les tokens sont dans **`tokens.css`** (à la racine, importé en global). Référence-les avec `var(--jd-name)`. **Jamais de hex en dur** dans les composants.

Tokens principaux (rappel) :

```
--jd-bg            #16261b   /* fond global */
--jd-surface       #1f3225   /* card opaque */
--jd-surface-glass rgba(255,255,255,0.06)
--jd-ink           #f1f6ed
--jd-ink-muted     #a3b8a8
--jd-accent        #a6e36b   /* lime */
--jd-warning       #f0b86c
--jd-earth         #a06840
--jd-radius        18px
--jd-radius-sm     10px
--jd-radius-pill   999px
```

---

## 4. Illustrations — OpenMoji + halo

**Toutes les illustrations** (plantes, légumes, météo, objets) sont des emojis **rendus en SVG via OpenMoji** ([openmoji.org](https://openmoji.org/), licence CC-BY-SA 4.0). Avantage : identique sur tous les devices, ~2 ko chacun, zéro design à produire.

### Helper

```ts
// utils/openmoji.ts
export function openmoji(emoji: string): string {
  const codes = [...emoji]
    .map(c => c.codePointAt(0)!)
    .filter(cp => cp !== 0xFE0F) // strip variation-selector
    .map(cp => cp.toString(16).toUpperCase().padStart(4, '0'))
    .join('-');
  return `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/${codes}.svg`;
}
```

**En production** : télécharge juste les SVGs dont tu as besoin (~30 légumes + UI) depuis openmoji.org, héberge-les dans `/public/openmoji/`, et remplace l'URL CDN par `/openmoji/${codes}.svg`. Crédit `CC-BY-SA 4.0 OpenMoji` à mettre quelque part (à propos / footer).

### Composant EmojiIllo

```tsx
type Props = {
  emoji: string;
  size?: number;   // px, default 56
  ring?: boolean;  // ajoute le cercle de fond
};

export function EmojiIllo({ emoji, size = 56, ring = false }: Props) {
  return (
    <div
      className="jd-illo"
      data-ring={ring}
      style={{ ['--illo-size' as any]: `${size}px` }}
    >
      <img src={openmoji(emoji)} alt="" />
    </div>
  );
}
```

CSS associé déjà dans `tokens.css` (`.jd-illo` avec halo radial + drop-shadow lime).

### Tailles types

| Contexte | Taille | Ring |
|---|---|---|
| Card plante (liste Mon Jardin) | 56 | oui |
| Card parcelle (Vue 3D) | 44 | oui |
| Chip / pill (Accueil) | 16 (img direct, pas de wrapper) | — |
| Hero / onboarding | 96–120 | oui |

### Mapping légume → emoji

```ts
// data/veggie-emoji.ts
export const VEGGIE_EMOJI: Record<string, string> = {
  'Tomate':         '🍅',
  'Tomate cerise':  '🍅',
  'Courgette':      '🥒',
  'Carotte':        '🥕',
  'Salade':         '🥬',
  'Haricot':        '🫘',
  'Poireau':        '🌿',
  'Radis':          '🥬',
  'Pomme de terre': '🥔',
  'Poivron':        '🫑',
  'Concombre':      '🥒',
  'Oignon':         '🧅',
  'Épinard':        '🌿',
  'Basilic':        '🌿',
  'Aromates':       '🌿',
  'Abricotier':     '🍑',
  'Thym':           '🌿',
};
```

---

## 5. Composants clés

### ScreenShell — chrome mobile commun

```
┌──────────────────────────────┐
│ status bar  (9:41 · battery) │  flex-shrink: 0
├──────────────────────────────┤
│ body (scroll si besoin)      │  flex: 1, overflow: auto
│                              │
├──────────────────────────────┤
│ bottom tabs (glass)          │  flex-shrink: 0
└──────────────────────────────┘
```

### BottomTabs

- Hauteur 64px, fond `rgba(13,22,15,0.85)`, `backdrop-filter: blur(20px)`
- Border-top `var(--jd-border)`
- 4 tabs : Accueil, Conseiller, Calendrier, Mon jardin
- Tab actif : icône + label en `var(--jd-accent)`, weight 600
- Tab inactif : `var(--jd-ink-muted)`, weight 400
- Icônes : SVG lined (stroke 1.7px, round)

### Chip

Voir `.jd-chip` dans `tokens.css`. Accepte un emoji optionnel rendu en OpenMoji 16×16 avec drop-shadow.

```tsx
<span className="jd-chip">
  <img src={openmoji('🥒')} alt="" />
  Courgette
</span>
```

### SectionTitle (kicker)

```tsx
<div className="jd-kicker">Aujourd'hui dans ton jardin</div>
```

ou pour les hero titles :

```tsx
<h1 className="jd-title" style={{ fontSize: 26 }}>
  Mai au <em style={{ fontStyle: 'italic', color: 'var(--jd-accent)' }}>potager</em>
</h1>
```

---

## 6. Vue 3D du jardin

Reconstruction priorité — l'actuelle est trop rudimentaire.

- **Scène nocturne** : dégradé radial `#1a3024 → var(--jd-bg)`
- **Sol** : polygon iso terreux (gradient radial brun foncé)
- **Parcelles** : bois sombre en relief (extrusion z=0.18m, 3 faces visibles : front, right, top)
- **Plants** : points lumineux `var(--jd-accent)` avec `filter: drop-shadow(0 0 6px accent)` + petite tige
- **Label parcelle** : OpenMoji du légume principal flottant à `z=0.55m`, dans un disque foncé bordé accent
- **Toggle Iso/Top** en haut à droite (style chip)
- **Projection iso** : `screen_x = (x - y) * cos(30°) * PX`, `screen_y = (x + y) * sin(30°) * PX − z * PX`, avec `PX = 30` (pixels par mètre)

Sous la scène : liste des parcelles, chacune avec `<EmojiIllo size={44} ring />`, label, dimensions en mono, comptage de plants en chip accent.

---

## 7. Règles de design — DO / DON'T

### ✅ DO

- Sans-serif rondes (Plus Jakarta Sans / Manrope) **partout**
- Tokens CSS (`var(--jd-*)`) — jamais de hex en dur
- Verres dépolis (`.jd-glass`) pour les cards sur fond bg
- Halo radial accent sous les illustrations (`.jd-illo`)
- Kicker mono uppercase pour les labels de section
- Chiffres importants en display (Plus Jakarta 700/800)
- Italique parcimonieux : 1 seul mot par titre max, toujours coloré en accent
- Bottom tab bar : `backdrop-filter: blur(20px)` indispensable
- Espace généreux entre cards (`var(--jd-space-3)` minimum)

### ❌ DON'T

- Pas de serif (Fraunces, Georgia, etc.)
- Pas de fond `#000` pur ; toujours teinté vert
- Pas d'emoji **système** rendu en texte — toujours OpenMoji via `<EmojiIllo>`
- Pas d'icône custom dessinée — utiliser OpenMoji ou les `<Glyph>` lined existants
- Pas de gradient bariolé en fond (max : radial subtil bg → surface)
- Pas de drop-shadow sur les cards (utiliser `--jd-shadow-card`, ombre directionnelle douce)
- Pas de border épaisse (> 1px) sauf cas exceptionnel
- Pas de `border-left: 3px solid accent` sur les cards (cliché d'AI slop)

---

## 8. Workflow avec Claude Code

Quand tu me demandes un nouveau composant ou un refactor :

1. **Tu pars de ce fichier + `tokens.css`**. Si quelque chose manque, propose un nouveau token au lieu de hardcoder.
2. **Tu travailles écran par écran**, pas tout d'un coup. Demande : *"refais l'écran Calendrier en suivant CLAUDE.md, en gardant la même data"*.
3. **Pour ajouter un légume** : ajoute son emoji dans `VEGGIE_EMOJI` puis utilise `<EmojiIllo emoji={VEGGIE_EMOJI['Carotte']} />`. Rien d'autre.
4. **Pour ajouter une couleur sémantique** (ex: erreur, info) : ajoute-la dans `tokens.css` comme `--jd-error: oklch(...)` puis utilise-la. Une variable, jamais un hex inline.
5. **Quand tu doutes** : reproduis le pattern d'un composant existant (Chip, EmojiIllo, ScreenShell) plutôt que d'inventer.

---

## 9. Stack & dépendances suggérées

- **Polices** : Google Fonts (déjà importé via `<link>`)
- **Icônes lined** : `lucide-react` (cohérent avec le style stroke 1.7 / round)
- **Illustrations** : pack OpenMoji local dans `/public/openmoji/` (téléchargé une fois depuis openmoji.org)

Crédit OpenMoji obligatoire quelque part (about, footer, mentions légales) :
> Illustrations: © [OpenMoji](https://openmoji.org/) – CC BY-SA 4.0
