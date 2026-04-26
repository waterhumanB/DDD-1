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
  // 보스 씬 hp 맵 — { sceneId: hp }
  const [bossHpMap, setBossHpMap] = useState({})
  const lastBossHpRef = useRef({})
  // 공격 트리거 — 증가할 때마다 hero 검 휘두름 모션
  const [attackTrigger, setAttackTrigger] = useState(0)

  useEffect(() => {
    // 일반 진입 트리거 (씬 전환 인덱스 추적)
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

    // 보스 씬 (mode === 'scroll') — 스크롤 진행도에 따라 hp 감소
    const bossTriggers = scenes
      .map((scene, idx) => {
        if (scene.monster?.mode !== 'scroll') return null
        const sceneEl = sceneRefs.current[idx]
        if (!sceneEl) return null
        return ScrollTrigger.create({
          trigger: sceneEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          onUpdate: (self) => {
            const progress = self.progress
            const newHp = Math.max(
              0,
              Math.round(scene.monster.hp * (1 - progress) * 100) / 100
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

  // 씬 변경 시 파티 점프 (전직 → 합류 이벤트)
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

  // 공격 모션 — hero 검 휘두름 + 보스 흔들림
  useEffect(() => {
    if (attackTrigger === 0) return

    if (partyRef.current) {
      const hero = partyRef.current.querySelector('.party__member--hero')
      if (hero) {
        gsap.fromTo(
          hero,
          { rotation: 0, y: 0 },
          {
            keyframes: [
              { rotation: -18, y: -8, duration: 0.07 },
              { rotation: 8, y: 2, duration: 0.06 },
              { rotation: 0, y: 0, duration: 0.1, ease: 'power2.out' },
            ],
          }
        )
      }
    }

    if (monsterRef.current) {
      gsap.fromTo(
        monsterRef.current,
        { x: 0 },
        {
          keyframes: [
            { x: -8, duration: 0.04 },
            { x: 8, duration: 0.04 },
            { x: -5, duration: 0.04 },
            { x: 0, duration: 0.06 },
          ],
        }
      )
    }
  }, [attackTrigger])

  const currentScene = scenes[currentSceneIndex]
  const currentBossHp = currentScene.monster?.mode === 'scroll'
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
