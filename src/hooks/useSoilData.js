import { useState, useEffect } from 'react'

// Classifie le type de sol depuis les % d'argile/sable/limon
function classifySoil(clay, sand, silt) {
  if (clay != null && clay > 35) return 'argileux'
  if (sand != null && sand > 50) return 'sableux'
  if (silt != null && silt > 40) return 'limoneux'
  if (clay != null)              return 'humifere'
  return 'limoneux' // défaut si classification impossible
}

// Fallback géographique pour la France si SoilGrids ne retourne pas de données
function guessSoilFromCoords(lat, lon) {
  if (lat > 50.5)                        return 'argileux'  // Flandres
  if (lat < 43.8 && lon > 4)             return 'sableux'   // Côte méditerranéenne
  if (lat < 45.5 && lon < -0.5)          return 'argileux'  // Sud-Ouest argilo-calcaire
  if (lon > 6.5 && lat > 46 && lat < 48) return 'limoneux'  // Alsace
  return 'limoneux'                                          // défaut France
}

// Extrait et convertit les valeurs d'une réponse SoilGrids (g/kg → %)
function parseLayers(json) {
  const layers = json?.properties?.layers ?? []
  const get = (name) => {
    const raw = layers.find(l => l.name === name)?.depths[0]?.values?.mean ?? null
    return raw !== null ? Math.round(raw / 10) : null // g/kg → %
  }
  return { clay: get('clay'), sand: get('sand'), silt: get('silt') }
}

function buildUrl(lat, lon, depth) {
  return (
    `https://rest.isric.org/soilgrids/v2.0/properties/query` +
    `?lon=${lon}&lat=${lat}` +
    `&property=clay&property=sand&property=silt` +
    `&depth=${depth}&value=mean`
  )
}

// Hook principal — priorité : 0-5cm → 5-15cm → fallback géographique
export function useSoilData(lat, lon) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {

    if (!lat || !lon) {
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    async function run() {
      try {
        // Tentative 1 : profondeur 0-5cm
        const url1 = buildUrl(lat, lon, '0-5cm')
        const r1   = await fetch(url1)
        if (!r1.ok) throw new Error(`SoilGrids HTTP ${r1.status}`)
        const json1 = await r1.json()

        let { clay, sand, silt } = parseLayers(json1)

        const allNull = clay == null && sand == null && silt == null

        // Tentative 2 : profondeur 5-15cm si tout est null
        if (allNull) {
          const url2  = buildUrl(lat, lon, '5-15cm')
          const r2    = await fetch(url2)
          if (!r2.ok) throw new Error(`SoilGrids HTTP ${r2.status}`)
          const json2 = await r2.json()
          ;({ clay, sand, silt } = parseLayers(json2))
        }

        // Fallback géographique si toujours null
        const stillNull = clay == null && sand == null && silt == null
        if (cancelled) return

        if (stillNull) {
          const fallbackSoilId = guessSoilFromCoords(lat, lon)
          setData({ soilId: fallbackSoilId, clay: null, sand: null, silt: null, isFallback: true })
        } else {
          const soilId = classifySoil(clay, sand, silt)
          setData({ soilId, clay, sand, silt, isFallback: false })
        }

        setLoading(false)
      } catch (err) {
        console.error('[useSoilData] erreur:', err.message)
        if (cancelled) return
        // En cas d'erreur réseau, fallback géo silencieux
        const fallbackSoilId = guessSoilFromCoords(lat, lon)
        setData({ soilId: fallbackSoilId, clay: null, sand: null, silt: null, isFallback: true })
        setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [lat, lon])

  if (!lat || !lon) {
    return { soilId: null, clay: null, sand: null, silt: null, loading: false, error: null, isFallback: false }
  }

  return {
    soilId:     data?.soilId    ?? null,
    clay:       data?.clay      ?? null,
    sand:       data?.sand      ?? null,
    silt:       data?.silt      ?? null,
    isFallback: data?.isFallback ?? false,
    loading,
    error,
  }
}
