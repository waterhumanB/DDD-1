import { forwardRef } from 'react'
import { monsterSprites } from './monster/MonsterSprites.jsx'
import { useMonster } from '../hooks/useMonster.js'

function MonsterHud({ isScroll, isInteractive, displayHp, maxHp, isCombatActive }) {
  const ratio = maxHp > 0 ? displayHp / maxHp : 0
  return (
    <>
      <div className="monster__hpbar">
        <div className="monster__hp" style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="monster__hptext">
        HP {Math.max(0, Math.round(displayHp))} / {maxHp}
      </div>
      <div className="monster__hint">
        {isScroll
          ? isCombatActive
            ? '▶ ATTACK TO CONTINUE'
            : '▶ PREPARE FOR BATTLE'
          : isInteractive
            ? '▶ CLICK or [SPACE]'
            : ''}
      </div>
    </>
  )
}

const Monster = forwardRef(function Monster(
  { monster, controlledHp, onDefeat, isCombatActive = false, isCleared = false, resetKey = 0 },
  ref
) {
  const { isInteractive, isScroll, displayHp, hits, defeated, attack } = useMonster({
    monster,
    controlledHp,
    isCleared,
    resetKey,
    onDefeat,
  })

  if (!monster) return null

  const Sprite = monsterSprites[monster.sprite] || monsterSprites.slime
  const hpRatio = monster.hp > 0 ? displayHp / monster.hp : 0
  const phaseClass =
    hpRatio <= 0.25 ? 'monster--danger' : hpRatio <= 0.5 ? 'monster--wounded' : ''

  if (isCleared) return null
  if (defeated && !isInteractive && !isScroll) return null

  const modeClass = `monster--${isInteractive ? 'interactive' : isScroll ? 'scroll' : 'auto'}`
  const showHud = (isInteractive || isScroll) && !defeated

  return (
    <div
      ref={ref}
      className={`monster ${modeClass} ${isCombatActive ? 'monster--combat' : ''} ${
        defeated ? 'monster--defeated' : ''
      } ${phaseClass} ${monster.isFinalBoss ? 'monster--boss-final' : ''}`}
      onClick={isInteractive ? attack : undefined}
    >
      <div className="monster__sprite-wrap">
        <Sprite />
      </div>
      <div className="monster__name">{monster.name}</div>
      {showHud && (
        <MonsterHud
          isScroll={isScroll}
          isInteractive={isInteractive}
          displayHp={displayHp}
          maxHp={monster.hp}
          isCombatActive={isCombatActive}
        />
      )}
      {hits.map((h) => (
        <div
          key={h.id}
          className="monster__damage"
          style={{ left: `calc(50% + ${h.offset}px)` }}
        >
          -{h.value}
        </div>
      ))}
    </div>
  )
})

export default Monster
