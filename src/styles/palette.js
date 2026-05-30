/**
 * PALETTE — source unique JS pour les couleurs du design system.
 *
 * Chaque clé correspond à un token CSS --jd-* dans tokens.css.
 * Utiliser PALETTE dans les fichiers .js/.jsx qui ne peuvent pas
 * consommer directement les CSS custom properties (maps de config,
 * calculs avec opacité, etc.).
 *
 * Ne jamais écrire de hex en dur ailleurs — toujours PALETTE.<clé>.
 */
export const PALETTE = {
  accent:         '#a6e36b', // --jd-accent
  accentDim:      '#6c9a3a', // --jd-accent-dim
  forest:         '#20512E', // --jd-forest
  harvest:        '#DE5F1D', // --jd-harvest
  warning:        '#FCBA6A', // --jd-warning
  water:          '#3D828A', // --jd-water
  inkMuted:       '#a3b8a8', // --jd-ink-muted
  stageSowed:     '#8B9A50', // --jd-badge-sowed
  stageGrowing:   '#9DC044', // --jd-badge-growing
  stageFlowering: '#FCBA6A', // --jd-warning   (même valeur)
  stageReady:     '#DE5F1D', // --jd-harvest   (même valeur)
}
