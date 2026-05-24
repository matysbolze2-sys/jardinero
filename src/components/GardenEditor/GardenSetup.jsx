import { useState } from 'react'

const ORIENTATIONS = [
  { id: 'N', label: 'Nord',  emoji: '⬆️' },
  { id: 'S', label: 'Sud',   emoji: '⬇️' },
  { id: 'E', label: 'Est',   emoji: '➡️' },
  { id: 'O', label: 'Ouest', emoji: '⬅️' },
]

function NumberInput({ label, value, onChange, min = 1, max = 50, unit = 'm' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: '#3B6D11' }}>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: '#EAF3DE', color: '#3B6D11' }}
          onClick={() => onChange(Math.max(min, value - 0.5))}
        >−</button>
        <span className="text-xl font-bold w-16 text-center" style={{ color: '#1A2010' }}>
          {value} <span className="text-sm font-normal">{unit}</span>
        </span>
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: '#EAF3DE', color: '#3B6D11' }}
          onClick={() => onChange(Math.min(max, value + 0.5))}
        >+</button>
      </div>
    </div>
  )
}

export default function GardenSetup({ garden, onSave }) {
  const [name,        setName]        = useState(garden?.name        ?? '')
  const [width,       setWidth]       = useState(garden?.width       ?? 5)
  const [height,      setHeight]      = useState(garden?.height      ?? 4)
  const [orientation, setOrientation] = useState(garden?.orientation ?? 'N')

  function handleSave() {
    onSave({ name: name.trim() || 'Mon jardin', width, height, orientation })
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-5">
      <div>
        <h2 className="font-fraunces text-xl mb-1" style={{ color: '#1A2010' }}>
          🌿 Configurer le jardin
        </h2>
        <p className="text-sm" style={{ color: '#5A7040' }}>
          Définissez le nom et la taille de votre espace.
        </p>
      </div>

      {/* Nom */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold" style={{ color: '#3B6D11' }}>Nom du jardin</label>
        <input
          type="text"
          placeholder="Ex : Potager principal, Balcon…"
          value={name}
          onChange={e => setName(e.target.value.slice(0, 40))}
          className="px-3 py-2.5 rounded-card text-sm"
          style={{ border: '1.5px solid #97C459', outline: 'none', color: '#1A2010' }}
        />
      </div>

      <div className="flex justify-around">
        <NumberInput label="Largeur" value={width}  onChange={setWidth}  />
        <NumberInput label="Longueur" value={height} onChange={setHeight} />
      </div>

      {/* Aperçu proportionnel */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold" style={{ color: '#5A7040' }}>Aperçu</p>
        <div style={{ position: 'relative', width: 200, height: 160 }}>
          {(() => {
            const scale = Math.min(180 / width, 140 / height)
            const pw = width  * scale
            const ph = height * scale
            return (
              <div
                style={{
                  width:        pw,
                  height:       ph,
                  position:     'absolute',
                  top:          '50%',
                  left:         '50%',
                  transform:    'translate(-50%,-50%)',
                  background:   '#D4EAB0',
                  border:       '2px solid #97C459',
                  borderRadius: 6,
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                }}
              >
                <span className="text-xs font-medium" style={{ color: '#3B6D11' }}>
                  {width} × {height} m
                </span>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Orientation */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: '#3B6D11' }}>Orientation (côté ensoleillé)</p>
        <div className="grid grid-cols-4 gap-2">
          {ORIENTATIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOrientation(o.id)}
              className="flex flex-col items-center gap-1 py-2 rounded-card text-sm font-medium transition-all"
              style={{
                background: orientation === o.id ? '#3B6D11' : '#EAF3DE',
                color:      orientation === o.id ? 'white'   : '#3B6D11',
                border:     `2px solid ${orientation === o.id ? '#3B6D11' : '#97C459'}`,
              }}
            >
              <span>{o.emoji}</span>
              <span className="text-xs">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3 rounded-card font-semibold text-white"
        style={{ background: '#3B6D11' }}
      >
        Suivant — Placer les parcelles →
      </button>
    </div>
  )
}
