import { forwardRef } from 'react'
import PixelCharacter from './PixelCharacter'
import { levelOf } from '../data/scenes'

// 파티 — 표시 순서대로 캐릭터 배치 (hero가 가운데 인덱스에 위치).
// sceneIndex로 각 멤버의 진화 레벨 자동 계산.
// moveDirection: 'left' | 'right' | 'up'

const Party = forwardRef(function Party(
  {
    party,
    newAlly,
    moveDirection = 'right',
    sceneIndex = 0,
    attackTrigger = 0,
    isCombatActive = false,
  },
  ref
) {
  const facing = moveDirection === 'left' ? 'flip' : 'normal'

  return (
    <div
      ref={ref}
      className={`party party--${moveDirection} party--${facing} ${
        isCombatActive ? 'party--combat' : ''
      }`}
      data-attack={attackTrigger}
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
