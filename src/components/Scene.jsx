import { forwardRef } from 'react'
import SceneDecor from './SceneDecor'

const Scene = forwardRef(function Scene({ scene, index }, ref) {
  return (
    <section
      ref={ref}
      className={`scene scene--${scene.id}`}
      data-scene={scene.id}
      data-character-class={scene.characterClass}
      data-index={index}
    >
      <SceneDecor sceneId={scene.id} />
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
