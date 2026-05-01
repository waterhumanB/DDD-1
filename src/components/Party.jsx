import { forwardRef } from 'react'
import PixelCharacter from './PixelCharacter'
import { levelOf } from '../data/scenes'

const Party = forwardRef(function Party(
  {
    party,
    newAlly,
    facing = 'right',
    sceneIndex = 0,
    attackTrigger = 0,
    isCombatActive = false,
  },
  ref
) {
  const flipClass = facing === 'left' ? 'party--flip' : 'party--normal'

  return (
    <div
      ref={ref}
      className={`party ${flipClass} ${isCombatActive ? 'party--combat' : ''}`}
      data-attack={attackTrigger}
      data-facing={facing}
      aria-hidden="true"
    >
      {party.map((id, i) => {
        const isNew = id === newAlly
        const isHero = id === 'hero'
        const level = levelOf(id, sceneIndex)
        return (
          <div
            key={id}
            className={`party__member ${isNew ? 'party__member--new' : ''} ${
              isHero ? 'party__member--hero' : ''
            }`}
            data-member={id}
            data-party-index={i}
            style={{
              animationDelay: `${i * 0.08}s`,
              zIndex: isHero ? 99 : party.length - i,
            }}
          >
            <PixelCharacter characterClass={id} level={level} />
          </div>
        )
      })}
    </div>
  )
})

export default Party
