import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { scenes } from './data/scenes'
import Scene from './components/Scene'
import Party from './components/Party'
import Monster from './components/Monster'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function App() {
  const sceneRefs = useRef([])
  const partyRef = useRef(null)
  const monsterRef = useRef(null)
  const monsterTriggersRef = useRef({})

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [bossHpMap, setBossHpMap] = useState({})
  const lastBossHpRef = useRef({})
  const maxProgressRef = useRef({})
  const [attackTrigger, setAttackTrigger] = useState(0)
  const [slashes, setSlashes] = useState([])
  const isAutoScrollingRef = useRef(false)

  function scrollToSceneIndex(idx) {
    const sceneEl = sceneRefs.current[idx]
    if (!sceneEl) return
    isAutoScrollingRef.current = true
    gsap.to(window, {
      scrollTo: { y: sceneEl, offsetY: 0, autoKill: true },
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        isAutoScrollingRef.current = false
      },
    })
  }

  function handleMonsterDefeat(sceneId) {
    const idx = scenes.findIndex((s) => s.id === sceneId)
    if (idx < 0) return
    const scene = scenes[idx]
    // 자동 진행은 보스 씬(mode === 'scroll')에서만. auto는 자연 흐름 유지.
    if (scene.monster?.mode !== 'scroll') return
    // 보스 ScrollTrigger 비활성화 (사용자 자유 스크롤 허용)
    const trigger = monsterTriggersRef.current[sceneId]
    if (trigger) trigger.disable(false, true)
    // 마지막 씬이면 더 진행할 곳 없음
    if (idx >= scenes.length - 1) return
    setTimeout(() => {
      scrollToSceneIndex(idx + 1)
    }, 700)
  }

  useEffect(() => {
    // 씬 진입 인덱스 추적
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

    // 보스 씬(mode === 'scroll')만 pin + scrub. auto 씬은 자연 흐름.
    const monsterTriggers = []
    scenes.forEach((scene, idx) => {
      if (scene.monster?.mode !== 'scroll') return
      const sceneEl = sceneRefs.current[idx]
      if (!sceneEl) return

      const trigger = ScrollTrigger.create({
        trigger: sceneEl,
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
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
      monsterTriggers.push(trigger)
      monsterTriggersRef.current[scene.id] = trigger
    })

    // 레이아웃 변경 후 ScrollTrigger 위치 재계산
    ScrollTrigger.refresh()

    const onScroll = () => {
      if (window.scrollY > 80) setHasScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      enterTriggers.forEach((t) => t && t.kill())
      monsterTriggers.forEach((t) => t && t.kill())
      monsterTriggersRef.current = {}
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

  // 공격 모션 — hero 도약 + 보스 흔들림 + 화면 진동 + 슬래시
  useEffect(() => {
    if (attackTrigger === 0) return

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
        onDefeat={() => handleMonsterDefeat(currentScene.id)}
      />

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
