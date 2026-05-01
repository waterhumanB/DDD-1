import { memo } from 'react'
import { findActiveDiscovery } from '../data/discoveries'

function Discoveries({ items, characterX, characterY, isCombatActive }) {
  if (isCombatActive || !items || items.length === 0) return null
  const active = findActiveDiscovery(items, characterX, characterY)
  return (
    <>
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
            </div>
          )
        })}
      </div>
      {active && <div className="discovery-callout">{active.text}</div>}
    </>
  )
}

export default memo(Discoveries)
