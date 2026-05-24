import { useState, useEffect } from 'react'

function classifySoil(clay, sand, silt) {
  if (clay != null && clay > 35) return 'argileux'
  if (sand != null && sand > 50) return 'sableux'
  if (silt != null && silt > 40) return 'limoneux'
  if (clay != null)              return 'humifere'
  return 'inconnu'
}

export function useSoilData(lat, lon) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    console.log('[useSoilData] useEffect déclenché — lat:', lat, 'lon:', lon)

    if (!lat || !lon) {
      console.log('[useSoilData] coords invalides, fetch ignoré')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    const url =
      `https://rest.isric.org/soilgrids/v2.0/properties/query` +
      `?lon=${lon}&lat=${lat}` +
      `&property=clay&property=sand&property=silt` +
      `&depth=0-5cm&value=mean`

    console.log('[useSoilData] fetch →', url)

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`SoilGrids HTTP ${r.status}`); return r.json() })
      .then(json => {
        console.log('[useSoilData] réponse API :', json)

        const layers = json.properties?.layers ?? []

        const getVal = (name) => {
          const layer = layers.find(l => l.name === name)
          const raw   = layer?.depths?.[0]?.values?.mean ?? null
          return raw !== null ? Math.round(raw / 10) : null // g/kg → %
        }

        const clay = getVal('clay')
        const sand = getVal('sand')
        const silt = getVal('silt')

        console.log('[useSoilData] clay:', clay, 'sand:', sand, 'silt:', silt)

        setData({ soilId: classifySoil(clay, sand, silt), clay, sand, silt })
        setLoading(false)
      })
      .catch(err => {
        console.error('[useSoilData] erreur fetch :', err.message)
        setError(err.message)
        setLoading(false)
      })
  }, [lat, lon])

  // Guard après les hooks — retour neutre si pas de coordonnées valides
  if (!lat || !lon) {
    return { soilId: null, clay: null, sand: null, silt: null, loading: false, error: null }
  }

  return {
    soilId:  data?.soilId ?? null,
    clay:    data?.clay   ?? null,
    sand:    data?.sand   ?? null,
    silt:    data?.silt   ?? null,
    loading,
    error,
  }
}
