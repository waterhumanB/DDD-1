import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scenes } from './data/scenes'
import Scene from './components/Scene'
import Character from './components/Character'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const sceneRefs = useRef([])
  const characterRef = useRef(null)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const triggers = sceneRefs.current.map((sceneEl, idx) => {
      if (!sceneEl) return null
      return ScrollTrigger.create({
        trigger: sceneEl,
        start: 'top 60%',
        end: 'bottom 40%',
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

  // 씬이 바뀔 때 캐릭터 점프 애니메이션 (전직 이펙트)
  useEffect(() => {
    if (!characterRef.current) return
    gsap.fromTo(
      characterRef.current,
      { y: 0, scale: 1, rotation: 0 },
      {
        keyframes: [
          { y: -50, scale: 1.15, rotation: -5, duration: 0.18 },
          { y: -70, scale: 1.25, rotation: 5, duration: 0.12 },
          { y: 0, scale: 1, rotation: 0, duration: 0.25, ease: 'bounce.out' },
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

      <Character
        ref={characterRef}
        characterClass={currentScene.characterClass}
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
