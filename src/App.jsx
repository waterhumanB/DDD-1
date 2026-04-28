import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { scenes } from './data/scenes'
import { getBossHpFromProgress, getBossScrollDistance } from './lib/bossScene'
import Scene from './components/Scene'
import Party from './components/Party'
import Monster from './components/Monster'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const COMBAT_COLORS = ['#fff7c2', '#ffd54a', '#ff5577', '#8aa9ff', '#6bff9a']
const IMPACT_WORDS = ['SLASH', 'CRITICAL', 'BREAK', 'COMBO']

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
  const activeBossSceneIdRef = useRef(null)
  const defeatedBossesRef = useRef({})
  const [activeCombatSceneId, setActiveCombatSceneId] = useState(null)
  const [attackTrigger, setAttackTrigger] = useState(0)
  const [slashes, setSlashes] = useState([])
  const [impactWords, setImpactWords] = useState([])
  const [combatBolts, setCombatBolts] = useState([])
  const isAutoScrollingRef = useRef(false)
  const lastManualStrikeRef = useRef(0)

  function setActiveBossScene(sceneId) {
    activeBossSceneIdRef.current = sceneId
    setActiveCombatSceneId(sceneId)
  }

  function triggerCombatFlourish() {
    const now = Date.now()
    if (now - lastManualStrikeRef.current < 240) return
    lastManualStrikeRef.current = now
    setAttackTrigger((p) => p + 1)
  }

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
    if (defeatedBossesRef.current[sceneId]) return

    const idx = scenes.findIndex((s) => s.id === sceneId)
    if (idx < 0) return
    const scene = scenes[idx]
    // 자동 진행은 보스 씬(mode === 'scroll')에서만. auto는 자연 흐름 유지.
    if (scene.monster?.mode !== 'scroll') return
    defeatedBossesRef.current[sceneId] = true
    setActiveBossScene(null)
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
        onEnter: () => {
          const activeBossSceneId = activeBossSceneIdRef.current
          if (activeBossSceneId && activeBossSceneId !== scenes[idx].id) return
          setCurrentSceneIndex(idx)
        },
        onEnterBack: () => {
          const activeBossSceneId = activeBossSceneIdRef.current
          if (activeBossSceneId && activeBossSceneId !== scenes[idx].id) return
          setCurrentSceneIndex(idx)
        },
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
        end: () => `+=${getBossScrollDistance(scene.monster.hp, window.innerHeight)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: true,
        onEnter: () => {
          setActiveBossScene(scene.id)
          setCurrentSceneIndex(idx)
        },
        onEnterBack: () => {
          setActiveBossScene(scene.id)
          setCurrentSceneIndex(idx)
        },
        onLeave: () => {
          if (activeBossSceneIdRef.current === scene.id) {
            setActiveBossScene(null)
          }
        },
        onLeaveBack: () => {
          if (activeBossSceneIdRef.current === scene.id) {
            setActiveBossScene(null)
          }
        },
        onUpdate: (self) => {
          const maxSoFar = Math.max(
            maxProgressRef.current[scene.id] ?? 0,
            self.progress
          )
          maxProgressRef.current[scene.id] = maxSoFar
          const newHp = getBossHpFromProgress(scene.monster.hp, maxSoFar)
          const last = lastBossHpRef.current[scene.id] ?? scene.monster.hp
          if (last !== newHp && newHp < last) {
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
    // 픽셀 폰트(Press Start 2P/VT323/Noto Sans KR)는 늦게 로드돼 씬 높이를 바꿈 →
    // pin start/end 좌표가 어긋남. 폰트 준비되면 한 번 더 재계산.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

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

  const currentScene = scenes[currentSceneIndex]
  const isCombatActive = Boolean(activeCombatSceneId)

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

  useEffect(() => {
    if (!isCombatActive) return

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      triggerCombatFlourish()
    }
    const onKeyDown = (event) => {
      if (event.code !== 'Space' && event.code !== 'Enter') return
      event.preventDefault()
      triggerCombatFlourish()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isCombatActive])

  // 공격 모션 — hero 도약 + 보스 흔들림 + 화면 진동 + 슬래시
  useEffect(() => {
    if (attackTrigger === 0) return

    if (isCombatActive) {
      confetti({
        particleCount: 84,
        angle: 138,
        spread: 72,
        startVelocity: 58,
        decay: 0.86,
        gravity: 0.78,
        ticks: 86,
        scalar: 1.15,
        origin: { x: 0.76, y: 0.58 },
        colors: COMBAT_COLORS,
        shapes: ['star', 'square'],
        zIndex: 720,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 44,
        angle: 38,
        spread: 58,
        startVelocity: 46,
        decay: 0.88,
        gravity: 0.72,
        ticks: 72,
        scalar: 0.92,
        origin: { x: 0.43, y: 0.7 },
        colors: COMBAT_COLORS,
        shapes: ['circle', 'square'],
        zIndex: 720,
        disableForReducedMotion: true,
      })
    }

    if (partyRef.current) {
      const members = Array.from(partyRef.current.querySelectorAll('.party__member'))
      members.forEach((member, index) => {
        const isHero = member.classList.contains('party__member--hero')
        const direction = index % 2 === 0 ? -1 : 1
        const delay = isHero ? 0 : 0.03 + index * 0.035

        gsap.killTweensOf(member)
        gsap.fromTo(
          member,
          { x: 0, y: 0, rotation: 0, scale: 1 },
          {
            delay,
            keyframes: isHero
              ? [
                  { x: 82, y: -64, rotation: -28, scale: 1.2, duration: 0.12 },
                  { x: 112, y: -34, rotation: 24, scale: 1.16, duration: 0.08 },
                  { x: 52, y: -16, rotation: 8, scale: 1.08, duration: 0.1 },
                  { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.16, ease: 'power2.out' },
                ]
              : [
                  { x: 22, y: -22, rotation: direction * 8, scale: 1.12, duration: 0.11 },
                  { x: 34, y: -8, rotation: direction * -6, scale: 1.08, duration: 0.08 },
                  { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.18, ease: 'back.out(1.8)' },
                ],
          }
        )
      })
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

    const id = `${Date.now()}-${Math.random()}`
    const angle = -28 + Math.random() * 56
    const top = 42 + Math.random() * 18
    const left = 50 + Math.random() * 18
    const boltId = `bolt-${id}`
    const supportBoltId = `support-${id}`
    setSlashes((prev) => [...prev, { id, angle, top, left }])
    setCombatBolts((prev) => [
      ...prev,
      { id: boltId, top: 60 + Math.random() * 11, delay: 0, color: '#ffd54a' },
      { id: supportBoltId, top: 51 + Math.random() * 12, delay: 0.08, color: '#8aa9ff' },
    ])
    setImpactWords((prev) => [
      ...prev,
      {
        id,
        text: IMPACT_WORDS[Math.floor(Math.random() * IMPACT_WORDS.length)],
        top: 22 + Math.random() * 16,
        left: 46 + Math.random() * 18,
      },
    ])
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== id))
      setImpactWords((prev) => prev.filter((w) => w.id !== id))
      setCombatBolts((prev) =>
        prev.filter((bolt) => bolt.id !== boltId && bolt.id !== supportBoltId)
      )
    }, 500)
  }, [attackTrigger, isCombatActive])

  const currentBossHp =
    currentScene.monster?.mode === 'scroll'
      ? bossHpMap[currentScene.id] ?? currentScene.monster.hp
      : undefined

  return (
    <div className={`app-shell ${isCombatActive ? 'app-shell--combat' : ''}`}>
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
        isCombatActive={isCombatActive}
      />
      <Monster
        ref={monsterRef}
        monster={currentScene.monster}
        controlledHp={currentBossHp}
        onDefeat={() => handleMonsterDefeat(currentScene.id)}
        isCombatActive={isCombatActive}
      />

      <div
        key={`battle-${attackTrigger}`}
        className={`battle-overlay ${isCombatActive ? 'is-active' : ''} ${
          attackTrigger > 0 ? 'is-impact' : ''
        }`}
        aria-hidden="true"
      />

      <div className="slash-layer" aria-hidden="true">
        {slashes.map((s) => (
          <div
            key={s.id}
            className="slash"
            style={{
              '--angle': `${s.angle}deg`,
              left: `${s.left}%`,
              top: `${s.top}%`,
            }}
          />
        ))}
        {impactWords.map((word) => (
          <div
            key={word.id}
            className="impact-word"
            style={{
              left: `${word.left}%`,
              top: `${word.top}%`,
            }}
          >
            {word.text}
          </div>
        ))}
        {combatBolts.map((bolt) => (
          <div
            key={bolt.id}
            className="combat-bolt"
            style={{
              '--bolt-color': bolt.color,
              '--bolt-delay': `${bolt.delay}s`,
              top: `${bolt.top}%`,
            }}
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
            isCombatActive={activeCombatSceneId === scene.id}
          />
        ))}
      </main>

      <div className={`scroll-hint ${hasScrolled ? 'is-hidden' : ''}`}>
        ▼ SCROLL TO START ▼
      </div>
    </div>
  )
}
