import { forwardRef } from 'react'
import PixelCharacter from './PixelCharacter'

// 파티 — 여러 동료를 가로로 배치.
// 새 동료(newAlly)는 합류 애니메이션 적용.
// moveDirection: 'left' | 'right' | 'up' — 화면 내 이동 방향

const Party = forwardRef(function Party(
  { party, newAlly, moveDirection = 'right' },
  ref
) {
  // 'left'면 캐릭터들이 좌측을 바라보도록 좌우 반전
  const facing = moveDirection === 'left' ? 'flip' : 'normal'

  return (
    <div
      ref={ref}
      className={`party party--${moveDirection} party--${facing}`}
      aria-hidden="true"
    >
      {party.map((id, i) => {
        const isNew = id === newAlly
        return (
          <div
            key={id}
            className={`party__member ${isNew ? 'party__member--new' : ''}`}
            style={{
              animationDelay: `${i * 0.08}s`,
              zIndex: party.length - i,
            }}
          >
            <PixelCharacter characterClass={id} />
          </div>
        )
      })}
    </div>
  )
})

export default Party
