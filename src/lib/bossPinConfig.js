import gsap from 'gsap'
import { getBossPinDistance } from './bossScene.js'
import { BOSS_LOCK_OFFSET } from './combat.js'

export function createBossPinConfig({ scene, idx, sceneEl, session }) {
  const {
    refs,
    setCurrentSceneIndex,
    setActiveBossScene,
    ensureBossHp,
    getBossHp,
    cancelAutoAdvance,
    clearCombatTransforms,
    isBossScrollLocked,
    restoreLockedScroll,
  } = session

  return {
    trigger: sceneEl,
    start: 'top top',
    end: () => `+=${getBossPinDistance(window.innerHeight)}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onEnter: (self) => {
      if (refs.clearedMonstersRef.current[scene.id]) {
        setCurrentSceneIndex(idx)
        return
      }
      setActiveBossScene(scene.id, self.start + BOSS_LOCK_OFFSET)
      setCurrentSceneIndex(idx)
      ensureBossHp(scene)
    },
    onEnterBack: (self) => {
      if (refs.completedBossesRef.current[scene.id]) {
        cancelAutoAdvance()
        clearCombatTransforms()
        setActiveBossScene(null)
        setCurrentSceneIndex(idx)
        return
      }
      cancelAutoAdvance()
      ensureBossHp(scene)
      clearCombatTransforms()
      setActiveBossScene(scene.id, self.start + BOSS_LOCK_OFFSET)
      restoreLockedScroll()
      setCurrentSceneIndex(idx)
    },
    onLeave: () => {
      if (!refs.completedBossesRef.current[scene.id] && getBossHp(scene) > 0) {
        cancelAutoAdvance()
        setActiveBossScene(scene.id)
        setCurrentSceneIndex(idx)
        gsap.to(window, {
          scrollTo: { y: sceneEl, offsetY: 0, autoKill: false },
          duration: 0.25,
          ease: 'power2.out',
        })
        return
      }
      if (refs.activeBossSceneIdRef.current === scene.id) {
        setActiveBossScene(null)
      }
    },
    onLeaveBack: () => {
      cancelAutoAdvance()
      clearCombatTransforms()
      if (refs.activeBossSceneIdRef.current === scene.id) {
        setActiveBossScene(null)
      }
    },
    onUpdate: (self) => {
      const cleared = refs.clearedMonstersRef.current[scene.id]
      const completed = refs.completedBossesRef.current[scene.id]
      const shouldShowCombat = !cleared && (!completed || getBossHp(scene) > 0)
      if (
        self.isActive &&
        shouldShowCombat &&
        refs.activeBossSceneIdRef.current !== scene.id
      ) {
        setActiveBossScene(scene.id, self.start + BOSS_LOCK_OFFSET)
        setCurrentSceneIndex(idx)
      }
      if (refs.activeBossSceneIdRef.current === scene.id && isBossScrollLocked()) {
        restoreLockedScroll()
      }
    },
  }
}
