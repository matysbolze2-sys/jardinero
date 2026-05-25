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

## Crédit OpenMoji (obligatoire)

Met ça dans ton footer / page À propos :

> Illustrations: © [OpenMoji](https://openmoji.org/) – CC BY-SA 4.0
