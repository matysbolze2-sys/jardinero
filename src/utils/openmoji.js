export function openmoji(emoji) {
  const codes = [...emoji]
    .map(c => c.codePointAt(0))
    .filter(cp => cp !== 0xFE0F)
    .map(cp => cp.toString(16).toUpperCase().padStart(4, '0'))
    .join('-')
  return `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/${codes}.svg`
}
