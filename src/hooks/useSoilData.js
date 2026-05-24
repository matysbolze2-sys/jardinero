import { useState, useEffect } from 'react'

// Détermine le type de sol à partir des pourcentages argile/sable/limon
function classifySoil(clay, sand, silt) {
  if (clay != null && clay > 35) return 'argileux'
  if (sand != null && sand > 50) return 'sableux'
  if (silt != null && silt > 40) return 'limoneux'
  if (clay != null)              return 'humifere'
  return 'inconnu'
}

// Appelle SoilGrids REST API v2 pour obtenir la composition du sol à partir de coordonnées GPS.
// Les valeurs retournées sont en g/kg → on divise par 10 pour obtenir des %.
export function useSoilData(lat, lon) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (lat == null || lon == null) return

    setLoading(true)
    setError(null)
    setData(null)

    const url =
      `https://rest.isric.org/soilgrids/v2.0/properties/query` +
      `?lon=${lon}&lat=${lat}` +
      `&property=clay&property=sand&property=silt` +
      `&depth=0-5cm&value=mean`

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`SoilGrids ${r.status}`); return r.json() })
      .then(json => {
        const layers = json.properties?.layers ?? []

        const getVal = (name) => {
          const layer = layers.find(l => l.name === name)
          const raw   = layer?.depths?.[0]?.values?.mean ?? null
          return raw !== null ? Math.round(raw / 10) : null // g/kg → %
        }

        const clay = getVal('clay')
        const sand = getVal('sand')
        const silt = getVal('silt')

        setData({ soilId: classifySoil(clay, sand, silt), clay, sand, silt })
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [lat, lon])

  return {
    soilId:  data?.soilId ?? null,
    clay:    data?.clay   ?? null,
    sand:    data?.sand   ?? null,
    silt:    data?.silt   ?? null,
    loading,
    error,
  }
}
