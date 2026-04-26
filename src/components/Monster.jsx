import { useEffect, useState, useRef, forwardRef } from 'react'

// 4종 몬스터 픽셀 SVG.
// shadow / slime / giant / demon

const ShadowSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="3" y="2" width="6" height="1" fill="#1a0a2e" opacity="0.7" />
      <rect x="2" y="3" width="8" height="6" fill="#1a0a2e" opacity="0.9" />
      <rect x="1" y="4" width="1" height="4" fill="#1a0a2e" opacity="0.6" />
      <rect x="10" y="4" width="1" height="4" fill="#1a0a2e" opacity="0.6" />
      <rect x="3" y="9" width="2" height="1" fill="#1a0a2e" opacity="0.4" />
      <rect x="7" y="9" width="2" height="1" fill="#1a0a2e" opacity="0.4" />
      <rect x="4" y="5" width="1" height="1" fill="#ff5577" />
      <rect x="7" y="5" width="1" height="1" fill="#ff5577" />
    </g>
  </svg>
)

const SlimeSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="4" y="5" width="4" height="1" fill="#6bff9a" />
      <rect x="3" y="6" width="6" height="4" fill="#6bff9a" />
      <rect x="2" y="7" width="1" height="3" fill="#6bff9a" />
      <rect x="9" y="7" width="1" height="3" fill="#6bff9a" />
      <rect x="4" y="6" width="1" height="1" fill="#fff" opacity="0.7" />
      <rect x="4" y="7" width="1" height="1" fill="#000" />
      <rect x="7" y="7" width="1" height="1" fill="#000" />
    </g>
  </svg>
)

const GiantSprite = () => (
  <svg viewBox="0 0 12 12" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="2" y="4" width="8" height="7" fill="#7a3030" />
      <rect x="3" y="3" width="6" height="1" fill="#7a3030" />
      <rect x="3" y="1" width="6" height="3" fill="#a04040" />
      <rect x="2" y="2" width="1" height="2" fill="#a04040" />
      <rect x="9" y="2" width="1" height="2" fill="#a04040" />
      <rect x="4" y="2" width="1" height="1" fill="#ffd54a" />
      <rect x="7" y="2" width="1" height="1" fill="#ffd54a" />
      <rect x="4" y="3" width="1" height="1" fill="#fff" />
      <rect x="7" y="3" width="1" height="1" fill="#fff" />
      <rect x="0" y="5" width="2" height="3" fill="#7a3030" />
      <rect x="10" y="5" width="2" height="3" fill="#7a3030" />
    </g>
  </svg>
)

const DemonSprite = () => (
  <svg viewBox="-1 -2 14 14" className="monster__sprite">
    <g shapeRendering="crispEdges">
      <rect x="2" y="0" width="2" height="2" fill="#1a0a2e" />
      <rect x="8" y="0" width="2" height="2" fill="#1a0a2e" />
      <rect x="3" y="-1" width="1" height="1" fill="#1a0a2e" />
      <rect x="8" y="-1" width="1" height="1" fill="#1a0a2e" />
      <rect x="2" y="1" width="8" height="4" fill="#7a1f50" />
      <rect x="3" y="2" width="2" height="2" fill="#ffd54a" />
      <rect x="7" y="2" width="2" height="2" fill="#ffd54a" />
      <rect x="3" y="3" width="2" height="1" fill="#ff5577" />
      <rect x="7" y="3" width="2" height="1" fill="#ff5577" />
      <rect x="4" y="4" width="4" height="1" fill="#000" />
      <rect x="5" y="4" width="1" height="1" fill="#fff" />
      <rect x="6" y="4" width="1" height="1" fill="#fff" />
      <rect x="2" y="5" width="8" height="6" fill="#3d0e3a" />
      <rect x="0" y="6" width="2" height="3" fill="#3d0e3a" />
      <rect x="10" y="6" width="2" height="3" fill="#3d0e3a" />
      <rect x="5" y="7" width="2" height="1" fill="#ff5577" />
      <rect x="5" y="9" width="2" height="1" fill="#ff5577" />
    </g>
  </svg>
)

const sprites = {
  shadow: ShadowSprite,
  slime: SlimeSprite,
  giant: GiantSprite,
  demon: DemonSprite,
}

// Monster — 3가지 mode
// - 'auto': 자동 컷씬 (1.5초 후 사라짐)
// - 'interactive': 클릭 또는 SPACE 공격
// - 'scroll': 외부에서 controlledHp prop으로 hp 제어 (보스 씬 스크롤 진행에 따라)
const Monster = forwardRef(function Monster(
  { monster, controlledHp, onDefeat },
  ref
) {
  if (!monster) return null

  const isInteractive = monster.mode === 'interactive'
  const isScroll = monster.mode === 'scroll'
  const Sprite = sprites[monster.sprite] || sprites.slime

  const [internalHp, setInternalHp] = useState(monster.hp)
  const [hits, setHits] = useState([])
  const [defeated, setDefeated] = useState(false)
  const onDefeatRef = useRef(onDefeat)
  onDefeatRef.current = onDefeat
  const lastHpRef = useRef(monster.hp)

  const displayHp = isScroll
    ? Math.max(0, controlledHp ?? monster.hp)
    : internalHp

  // 새 몬스터 들어오면 리셋
  useEffect(() => {
    setInternalHp(monster.hp)
    setHits([])
    setDefeated(false)
    lastHpRef.current = monster.hp
  }, [monster])

  // auto 자동 처치
  useEffect(() => {
    if (isInteractive || isScroll) return
    const t = setTimeout(() => {
      setDefeated(true)
      onDefeatRef.current?.()
    }, 1500)
    return () => clearTimeout(t)
  }, [monster, isInteractive, isScroll])

  // scroll: hp가 줄면 데미지 숫자 표시, 0되면 처치
  useEffect(() => {
    if (!isScroll) return
    if (displayHp < lastHpRef.current) {
      const diff = lastHpRef.current - displayHp
      if (diff > 0) {
        const id = `${Date.now()}-${Math.random()}`
        const offset = Math.random() * 60 - 30
        setHits((prev) => [...prev, { id, offset, value: diff }])
        setTimeout(() => {
          setHits((prev) => prev.filter((h) => h.id !== id))
        }, 700)
      }
    }
    lastHpRef.current = displayHp
    if (displayHp <= 0 && !defeated) {
      setDefeated(true)
      onDefeatRef.current?.()
    }
  }, [isScroll, displayHp, defeated])

  // interactive: 키보드 SPACE
  useEffect(() => {
    if (!isInteractive) return
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        attack()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInteractive, internalHp, defeated])

  function attack() {
    if (defeated) return
    setInternalHp((prev) => {
      const next = Math.max(0, prev - 1)
      if (next === 0) {
        setDefeated(true)
        setTimeout(() => onDefeatRef.current?.(), 400)
      }
      return next
    })
    const id = `${Date.now()}-${Math.random()}`
    const offset = Math.random() * 60 - 30
    setHits((prev) => [...prev, { id, offset, value: 1 }])
    setTimeout(() => {
      setHits((prev) => prev.filter((h) => h.id !== id))
    }, 700)
  }

  if (defeated && !isInteractive && !isScroll) return null

  return (
    <div
      ref={ref}
      className={`monster monster--${
        isInteractive ? 'interactive' : isScroll ? 'scroll' : 'auto'
      } ${defeated ? 'monster--defeated' : ''} ${
        monster.isFinalBoss ? 'monster--boss-final' : ''
      }`}
      onClick={isInteractive ? attack : undefined}
    >
      <div className="monster__sprite-wrap">
        <Sprite />
      </div>
      <div className="monster__name">{monster.name}</div>
      {(isInteractive || isScroll) && !defeated && (
        <>
          <div className="monster__hpbar">
            <div
              className="monster__hp"
              style={{ width: `${(displayHp / monster.hp) * 100}%` }}
            />
          </div>
          <div className="monster__hptext">
            HP {Math.max(0, Math.round(displayHp))} / {monster.hp}
          </div>
          <div className="monster__hint">
            {isScroll ? '▼ SCROLL TO ATTACK ▼' : '▶ CLICK or [SPACE]'}
          </div>
        </>
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
