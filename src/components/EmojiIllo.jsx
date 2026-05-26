import { useState } from 'react'
import { openmoji } from '../utils/openmoji'

export default function EmojiIllo({ emoji, size = 56, ring = true }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className="jd-illo"
      style={{ '--illo-size': `${size}px` }}
      data-ring={ring}
    >
      {failed ? (
        <span style={{ fontSize: size * 0.5, lineHeight: 1, position: 'relative', zIndex: 1 }}>{emoji}</span>
      ) : (
        <img src={openmoji(emoji)} alt="" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
