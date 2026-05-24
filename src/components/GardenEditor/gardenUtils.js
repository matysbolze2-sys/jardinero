// px = m * scale (scale = px per metre, e.g. 40)
export function metersToPixels(m, scale) {
  return m * scale
}

export function pixelsToMeters(px, scale) {
  return px / scale
}

// Axis-aligned bounding-box collision — returns true if the two plots overlap
export function checkCollision(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

// Returns the centre point of a plot (in metres)
export function getPlotCenter(plot) {
  return {
    x: plot.x + plot.width  / 2,
    y: plot.y + plot.height / 2,
  }
}

// Snap a value to the nearest multiple of step
export function snapToGrid(val, step = 0.5) {
  return Math.round(val / step) * step
}

// Clamp a plot inside garden bounds after drag/resize
export function clampPlot(plot, gardenWidth, gardenHeight) {
  const x = Math.max(0, Math.min(plot.x, gardenWidth  - plot.width))
  const y = Math.max(0, Math.min(plot.y, gardenHeight - plot.height))
  return { ...plot, x, y }
}

// Check if any OTHER plot in `plots` collides with `candidate`
export function hasCollision(candidate, plots) {
  return plots.some(p => p.id !== candidate.id && checkCollision(candidate, p))
}
