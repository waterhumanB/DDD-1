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
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const triggers = sceneRefs.current.map((sceneEl, idx) => {
      if (!sceneEl) return null
      return ScrollTrigger.create({
        trigger: sceneEl,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => setCurrentSceneIndex(idx),
        onEnterBack: () => setCurrentSceneIndex(idx),
      })
    })

    const onScroll = () => {
      if (window.scrollY > 80) setHasScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      triggers.forEach((t) => t && t.kill())
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

  const currentScene = scenes[currentSceneIndex]

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
      />
      <Monster monster={currentScene.monster} />

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
