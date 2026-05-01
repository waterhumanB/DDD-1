import { forwardRef, useEffect, useState } from 'react'
import { monsterSprites } from './monster/MonsterSprites.jsx'
import { useMonster } from '../hooks/useMonster.js'

const POOF_DURATION_MS = 420

function MonsterHud({ isBoss, isInteractive, displayHp, maxHp, isCombatActive }) {
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
        {isBoss
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
  const { isInteractive, isBoss, displayHp, hits, defeated, autoStruck, attack } = useMonster({
    monster,
    controlledHp,
    isCleared,
    resetKey,
    onDefeat,
  })

  const isAuto = !isInteractive && !isBoss
  const [poofPlaying, setPoofPlaying] = useState(false)

  useEffect(() => {
    if (isAuto && defeated) {
      setPoofPlaying(true)
      const t = setTimeout(() => setPoofPlaying(false), POOF_DURATION_MS)
      return () => clearTimeout(t)
    }
  }, [isAuto, defeated])

  useEffect(() => { setPoofPlaying(false) }, [resetKey])

  if (!monster) return null

  const Sprite = monsterSprites[monster.sprite] || monsterSprites.slime
  const hpRatio = monster.hp > 0 ? displayHp / monster.hp : 0
  const phaseClass =
    hpRatio <= 0.25 ? 'monster--danger' : hpRatio <= 0.5 ? 'monster--wounded' : ''

  if (isCleared && !poofPlaying) return null

  const isPoofing = isAuto && (defeated || poofPlaying)
  const modeClass = `monster--${isInteractive ? 'interactive' : isBoss ? 'scroll' : 'auto'}`
  const reactionClass = [
    autoStruck && !defeated ? 'monster--auto-struck' : '',
    isPoofing ? 'monster--poof' : '',
  ].filter(Boolean).join(' ')
  const showHud = (isInteractive || isBoss) && !defeated

  return (
    <div
      ref={ref}
      className={`monster ${modeClass} ${isCombatActive ? 'monster--combat' : ''} ${
        defeated ? 'monster--defeated' : ''
      } ${phaseClass} ${monster.isFinalBoss ? 'monster--boss-final' : ''} ${reactionClass}`}
      onClick={isInteractive ? attack : undefined}
    >
      <div className="monster__sprite-wrap">
        <Sprite />
      </div>
      <div className="monster__name">{monster.name}</div>
      {showHud && (
        <MonsterHud
          isBoss={isBoss}
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
