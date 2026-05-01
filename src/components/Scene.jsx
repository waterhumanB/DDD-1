import { forwardRef, memo, useEffect, useState } from 'react'
import SceneDecor from './SceneDecor'
import SceneObjects from './scene-objects/SceneObjects'

function TypewriterText({ text, className }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisibleCount(text.length)
      return undefined
    }
    const step = Math.max(2, Math.ceil(text.length / 90))
    const id = setInterval(() => {
      setVisibleCount((current) => {
        const next = Math.min(text.length, current + step)
        if (next >= text.length) clearInterval(id)
        return next
      })
    }, 18)
    return () => clearInterval(id)
  }, [text])

  const isDone = visibleCount >= text.length
  return (
    <p className={`${className} ${isDone ? 'is-complete' : 'is-typing'}`}>
      {text.slice(0, visibleCount)}
    </p>
  )
}

const Scene = forwardRef(function Scene({ scene, index, isCombatActive = false }, ref) {
  return (
    <section
      ref={ref}
      className={`scene scene--${scene.id}`}
      data-scene={scene.id}
      data-character-class={scene.characterClass}
      data-index={index}
      data-monster-mode={scene.monster?.mode || 'none'}
      data-combat-active={isCombatActive ? 'true' : 'false'}
      style={{ '--grid-x': scene.gridX ?? 0, '--grid-y': scene.gridY ?? 0 }}
    >
      <SceneDecor sceneId={scene.id} />
      <SceneObjects sceneId={scene.id} />
      {scene.monster && (
        <div className="scene__battle-stage" aria-hidden="true">
          <div className="scene__battle-floor" />
        </div>
      )}
      <div className="scene__inner">
        <div className="scene__floor">{scene.floor}</div>
        <h2 className="scene__title">{scene.title}</h2>
        <TypewriterText key={scene.id} text={scene.body} className="scene__body" />
        {scene.transition && (
          <div className="scene__transition">▶ {scene.transition}</div>
        )}
      </div>
    </section>
  )
})

export default memo(Scene)
