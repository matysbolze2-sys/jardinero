# jardinero-design-system

Drop ces fichiers dans ton repo :

```
ton-repo/
├── CLAUDE.md           ← à la racine (lu par Claude Code)
├── public/
│   └── openmoji/       ← (optionnel, pour la prod) télécharge depuis openmoji.org
├── src/
│   ├── styles/
│   │   └── tokens.css  ← importe-le dans ton entry CSS global
│   └── components/
│       ├── openmoji.ts
│       └── EmojiIllo.tsx
└── ...
```

## Quick start

1. **`CLAUDE.md`** → racine du repo. Claude Code le lira à chaque session.
2. **`tokens.css`** → importe-le en global :
   ```css
   @import './styles/tokens.css';
   /* ou dans Next.js : import './tokens.css' dans _app.tsx */
   ```
3. **`openmoji.ts` + `EmojiIllo.tsx`** → ajuste les paths selon ta structure (composants partagés).
4. Ajoute la balise `<link>` Google Fonts (Plus Jakarta Sans + Manrope + JetBrains Mono) dans ton `<head>` — voir section 2 de CLAUDE.md.
5. Ouvre ton premier prompt Claude Code : *"Refais l'écran Accueil en suivant CLAUDE.md, en gardant la data actuelle"*.

## PWA — icônes

L'app est une PWA installable (manifest + service worker auto-update via
`vite-plugin-pwa`). Les icônes d'écran d'accueil sont dans `public/icons/` :

| Fichier | Taille | Usage |
|---|---|---|
| `icon-192.png` | 192×192 | écran d'accueil (et `apple-touch-icon`) |
| `icon-512.png` | 512×512 | splash / haute résolution |
| `icon-512-maskable.png` | 512×512 | masque adaptatif Android (safe-zone) |

Pour les (re)générer — 🌱 OpenMoji centré sur le fond `#16261b` :

```bash
npm i -D sharp            # si pas déjà installé
node scripts/gen-icons.mjs
```

Le script lit `scripts/sprout-openmoji.svg` (OpenMoji `1F331`, CC BY-SA 4.0) et
écrit les 3 PNG dans `public/icons/`.

## Crédit OpenMoji (obligatoire)

Met ça dans ton footer / page À propos :

> Illustrations: © [OpenMoji](https://openmoji.org/) – CC BY-SA 4.0
