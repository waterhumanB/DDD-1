import { memo } from 'react'
import { findActiveDiscovery } from '../data/discoveries'

function Discoveries({ items, characterX, characterY, isCombatActive }) {
  if (isCombatActive || !items || items.length === 0) return null
  const active = findActiveDiscovery(items, characterX, characterY)
  return (
    <div className="discoveries" aria-hidden="true">
      {items.map((item, idx) => {
        const isActive = active === item
        return (
          <div
            key={idx}
            className={`discovery ${isActive ? 'is-active' : ''}`}
            style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%` }}
          >
            <span className="discovery__orb" />
            {isActive && <span className="discovery__text">{item.text}</span>}
          </div>
        )
      })}
    </div>
  )
}

export default memo(Discoveries)
