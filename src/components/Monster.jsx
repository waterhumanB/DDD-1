import { useEffect, useState, useRef } from 'react'

// 4종 몬스터 픽셀 SVG.
// shadow: 의심/안개 (auto), slime: 버그 (auto), giant: 거인 보스 (interactive), demon: 마왕 (final)

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

export default function Monster({ monster, onDefeat }) {
  if (!monster) return null

  const isInteractive = monster.mode === 'interactive'
  const Sprite = sprites[monster.sprite] || sprites.slime

  const [hp, setHp] = useState(monster.hp)
  const [hits, setHits] = useState([])
  const [defeated, setDefeated] = useState(false)
  const onDefeatRef = useRef(onDefeat)
  onDefeatRef.current = onDefeat

  // 새 몬스터 들어오면 상태 리셋
  useEffect(() => {
    setHp(monster.hp)
    setHits([])
    setDefeated(false)
  }, [monster])

  // 자동 처치 (auto): 1.5초 후 자동 사라짐
  useEffect(() => {
    if (isInteractive) return
    const t = setTimeout(() => {
      setDefeated(true)
      onDefeatRef.current?.()
    }, 1500)
    return () => clearTimeout(t)
  }, [monster, isInteractive])

  // 키보드 SPACE 공격
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
  }, [isInteractive, hp, defeated])

  function attack() {
    if (defeated) return
    setHp((prev) => {
      const next = Math.max(0, prev - 1)
      if (next === 0) {
        setDefeated(true)
        setTimeout(() => onDefeatRef.current?.(), 400)
      }
      return next
    })
    const id = `${Date.now()}-${Math.random()}`
    const offset = Math.random() * 60 - 30
    setHits((prev) => [...prev, { id, offset }])
    setTimeout(() => {
      setHits((prev) => prev.filter((h) => h.id !== id))
    }, 700)
  }

  if (defeated && !isInteractive) return null

  return (
    <div
      className={`monster ${isInteractive ? 'monster--interactive' : 'monster--auto'} ${
        defeated ? 'monster--defeated' : ''
      } ${monster.isFinalBoss ? 'monster--boss-final' : ''}`}
      onClick={isInteractive ? attack : undefined}
    >
      <div className="monster__sprite-wrap">
        <Sprite />
      </div>
      <div className="monster__name">{monster.name}</div>
      {isInteractive && !defeated && (
        <>
          <div className="monster__hpbar">
            <div
              className="monster__hp"
              style={{ width: `${(hp / monster.hp) * 100}%` }}
            />
          </div>
          <div className="monster__hptext">
            HP {hp} / {monster.hp}
          </div>
          <div className="monster__hint">▶ CLICK or [SPACE]</div>
        </>
      )}
      {hits.map((h) => (
        <div
          key={h.id}
          className="monster__damage"
          style={{ left: `calc(50% + ${h.offset}px)` }}
        >
          -1
        </div>
      ))}
    </div>
  )
}
