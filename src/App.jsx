import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scenes } from './data/scenes'
import Scene from './components/Scene'
import Party from './components/Party'
import Monster from './components/Monster'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const sceneRefs = useRef([])
  const partyRef = useRef(null)
  const monsterRef = useRef(null)

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [bossHpMap, setBossHpMap] = useState({})
  const lastBossHpRef = useRef({})
  const maxProgressRef = useRef({}) // 보스 hp 단방향 감소를 위한 최대 progress 추적
  const [attackTrigger, setAttackTrigger] = useState(0)
  const [slashes, setSlashes] = useState([])

  useEffect(() => {
    const enterTriggers = sceneRefs.current.map((sceneEl, idx) => {
      if (!sceneEl) return null
      return ScrollTrigger.create({
        trigger: sceneEl,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => setCurrentSceneIndex(idx),
        onEnterBack: () => setCurrentSceneIndex(idx),
      })
    })

    // 보스 씬: pin + scrub. 스크롤이 멈추고 progress가 공격으로 변환됨
    const bossTriggers = scenes
      .map((scene, idx) => {
        if (scene.monster?.mode !== 'scroll') return null
        const sceneEl = sceneRefs.current[idx]
        if (!sceneEl) return null
        return ScrollTrigger.create({
          trigger: sceneEl,
          start: 'top top',
          end: 'bottom bottom',
          pin: '.scene__inner',
          pinSpacing: false,
          scrub: 0.4,
          onUpdate: (self) => {
            // 단방향 progress (위로 스크롤해도 hp 회복 안 됨)
            const maxSoFar = Math.max(
              maxProgressRef.current[scene.id] ?? 0,
              self.progress
            )
            maxProgressRef.current[scene.id] = maxSoFar
            const newHp = Math.max(
              0,
              Math.round(scene.monster.hp * (1 - maxSoFar) * 100) / 100
            )
            const last = lastBossHpRef.current[scene.id] ?? scene.monster.hp
            if (Math.floor(last) !== Math.floor(newHp) && newHp < last) {
              setAttackTrigger((p) => p + 1)
            }
            lastBossHpRef.current[scene.id] = newHp
            setBossHpMap((prev) => {
              if (prev[scene.id] === newHp) return prev
              return { ...prev, [scene.id]: newHp }
            })
          },
        })
      })
      .filter(Boolean)

    const onScroll = () => {
      if (window.scrollY > 80) setHasScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      enterTriggers.forEach((t) => t && t.kill())
      bossTriggers.forEach((t) => t && t.kill())
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // 씬 변경 시 파티 점프
  useEffect(() => {
    if (!partyRef.current) return
    gsap.fromTo(
      partyRef.current,
      { y: 0 },
      {
        keyframes: [
          { y: -28, duration: 0.18 },
          { y: 0, duration: 0.28, ease: 'bounce.out' },
        ],
      }
    )
  }, [currentSceneIndex])

  // 공격 모션 — hero 도약 슬래시 + 보스 흔들림 + 화면 진동 + 슬래시 이펙트
  useEffect(() => {
    if (attackTrigger === 0) return

    // hero 도약하며 검 휘두름
    if (partyRef.current) {
      const hero = partyRef.current.querySelector('.party__member--hero')
      if (hero) {
        gsap.fromTo(
          hero,
          { x: 0, y: 0, rotation: 0, scale: 1 },
          {
            keyframes: [
              { x: 60, y: -50, rotation: -25, scale: 1.15, duration: 0.12 },
              { x: 80, y: -30, rotation: 25, scale: 1.1, duration: 0.08 },
              { x: 40, y: -10, rotation: 10, scale: 1.05, duration: 0.1 },
              { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.out' },
            ],
          }
        )
      }
    }

    // 보스 흔들림 (강하게)
    if (monsterRef.current) {
      gsap.fromTo(
        monsterRef.current,
        { x: 0, rotation: 0 },
        {
          keyframes: [
            { x: -14, rotation: -3, duration: 0.04 },
            { x: 14, rotation: 3, duration: 0.04 },
            { x: -10, rotation: -2, duration: 0.04 },
            { x: 8, rotation: 2, duration: 0.04 },
            { x: 0, rotation: 0, duration: 0.06 },
          ],
        }
      )
    }

    // 화면 진동
    gsap.fromTo(
      document.body,
      { x: 0, y: 0 },
      {
        keyframes: [
          { x: -4, y: 2, duration: 0.04 },
          { x: 4, y: -2, duration: 0.04 },
          { x: -2, y: 1, duration: 0.04 },
          { x: 0, y: 0, duration: 0.06 },
        ],
      }
    )

    // 슬래시 이펙트 추가
    const id = `${Date.now()}-${Math.random()}`
    const angle = -25 + Math.random() * 50
    setSlashes((prev) => [...prev, { id, angle }])
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== id))
    }, 500)
  }, [attackTrigger])

  const currentScene = scenes[currentSceneIndex]
  const currentBossHp =
    currentScene.monster?.mode === 'scroll'
      ? bossHpMap[currentScene.id] ?? currentScene.monster.hp
      : undefined

  return (
    <>
      <div className="hud">
        <span className="hud__panel">QUEST LOG</span>
        <span className="hud__panel">
          {currentScene.floor} · {currentSceneIndex + 1}/{scenes.length}
        </span>
      </div>

      <Party
        ref={partyRef}
        party={currentScene.party}
        newAlly={currentScene.newAlly}
        moveDirection={currentScene.moveDirection}
        sceneIndex={currentSceneIndex}
        attackTrigger={attackTrigger}
      />
      <Monster
        ref={monsterRef}
        monster={currentScene.monster}
        controlledHp={currentBossHp}
      />

      {/* 슬래시 이펙트 — 보스 공격 시 잠시 표시 */}
      <div className="slash-layer" aria-hidden="true">
        {slashes.map((s) => (
          <div
            key={s.id}
            className="slash"
            style={{ transform: `translate(-50%, -50%) rotate(${s.angle}deg)` }}
          />
        ))}
      </div>

      <main>
        {scenes.map((scene, idx) => (
          <Scene
            key={scene.id}
            ref={(el) => (sceneRefs.current[idx] = el)}
            scene={scene}
            index={idx}
          />
        ))}
      </main>

      <div className={`scroll-hint ${hasScrolled ? 'is-hidden' : ''}`}>
        ▼ SCROLL TO START ▼
      </div>
    </>
  )
}
