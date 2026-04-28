import { forwardRef } from 'react'
import SceneDecor from './SceneDecor'

const Scene = forwardRef(function Scene({ scene, index, isCombatActive = false }, ref) {
  return (
    <section
      ref={ref}
      className={`scene scene--${scene.id}`}
      data-scene={scene.id}
      data-character-class={scene.characterClass}
      data-index={index}
      data-monster-mode={scene.monster?.mode || 'none'}
      data-final={scene.id === 'final' ? 'true' : 'false'}
      data-combat-active={isCombatActive ? 'true' : 'false'}
    >
      <SceneDecor sceneId={scene.id} />
      {scene.monster?.mode === 'scroll' && (
        <div className="scene__battle-stage" aria-hidden="true">
          <div className="scene__battle-moon" />
          <div className="scene__battle-floor" />
        </div>
      )}
      <div className="scene__inner">
        <div className="scene__floor">{scene.floor}</div>
        <h2 className="scene__title">{scene.title}</h2>
        <p className="scene__body">{scene.body}</p>
        {scene.transition && (
          <div className="scene__transition">▶ {scene.transition}</div>
        )}
      </div>
    </section>
  )
})

export default Scene
