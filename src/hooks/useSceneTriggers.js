import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createBossPinConfig } from '../lib/bossPinConfig.js'

const HAS_SCROLLED_THRESHOLD_PX = 80

export function useSceneTriggers(scenes, session) {
  const { refs, setters, helpers } = session

  useEffect(() => {
    const factoryInput = {
      refs: {
        activeBossSceneIdRef: refs.activeBossSceneIdRef,
        clearedMonstersRef: refs.clearedMonstersRef,
        completedBossesRef: refs.completedBossesRef,
      },
      setCurrentSceneIndex: setters.setCurrentSceneIndex,
      setActiveBossScene: helpers.setActiveBossScene,
      ensureBossHp: helpers.ensureBossHp,
      getBossHp: helpers.getBossHp,
      cancelAutoAdvance: helpers.cancelAutoAdvance,
      clearCombatTransforms: helpers.clearCombatTransforms,
      isBossScrollLocked: helpers.isBossScrollLocked,
      restoreLockedScroll: helpers.restoreLockedScroll,
    }

    const enterTriggers = refs.sceneRefs.current.map((sceneEl, idx) => {
      if (!sceneEl) return null
      const onScene = () => {
        const activeId = refs.activeBossSceneIdRef.current
        if (activeId && activeId !== scenes[idx].id) return
        setters.setCurrentSceneIndex(idx)
      }
      return ScrollTrigger.create({
        trigger: sceneEl,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: onScene,
        onEnterBack: onScene,
      })
    })

    const bossTriggers = []
    scenes.forEach((scene, idx) => {
      if (scene.monster?.mode !== 'scroll') return
      if (refs.clearedMonstersRef.current[scene.id]) return
      const sceneEl = refs.sceneRefs.current[idx]
      if (!sceneEl) return
      const trigger = ScrollTrigger.create(
        createBossPinConfig({ scene, idx, sceneEl, session: factoryInput })
      )
      bossTriggers.push(trigger)
      refs.monsterTriggersRef.current[scene.id] = trigger
    })

    ScrollTrigger.refresh()
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())

    const onScroll = () => {
      if (window.scrollY > HAS_SCROLLED_THRESHOLD_PX) setters.setHasScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      enterTriggers.forEach((t) => t && t.kill())
      bossTriggers.forEach((t) => t && t.kill())
      refs.monsterTriggersRef.current = {}
      helpers.clearCombatTransforms()
      helpers.cancelAutoAdvance()
      window.removeEventListener('scroll', onScroll)
    }
  }, [scenes, refs, setters, helpers])
}
