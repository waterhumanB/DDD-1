import { useCallback } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AUTO_ADVANCE_DELAY_MS,
  COMBAT_CLEANUP_DELAY_MS,
  MANUAL_STRIKE_COOLDOWN_MS,
} from '../lib/combat.js'
import { useGameSession } from './useGameSession.js'
import { useSceneTriggers } from './useSceneTriggers.js'
import { useScrollReset } from './useScrollReset.js'
import { useBossScrollLock } from './useBossScrollLock.js'

export function useGameOrchestrator(scenes, opts) {
  const session = useGameSession(scenes, opts)
  const { state, setters, refs, helpers } = session

  const handleMonsterDefeat = useCallback(
    (sceneId) => {
      if (refs.clearedMonstersRef.current[sceneId]) return
      const idx = scenes.findIndex((s) => s.id === sceneId)
      if (idx < 0) return
      const scene = scenes[idx]
      refs.clearedMonstersRef.current[sceneId] = true
      setters.setClearedMonsterMap((prev) => ({ ...prev, [sceneId]: true }))

      if (scene.monster?.mode !== 'scroll') return
      refs.completedBossesRef.current[sceneId] = true
      helpers.setActiveBossScene(null)
      const trigger = refs.monsterTriggersRef.current[sceneId]
      if (trigger) {
        trigger.disable(true, false)
        requestAnimationFrame(() => ScrollTrigger.refresh())
      }
      const cleanup = setTimeout(() => {
        refs.cleanupTimeoutsRef.current.delete(cleanup)
        helpers.clearCombatTransforms()
      }, COMBAT_CLEANUP_DELAY_MS)
      refs.cleanupTimeoutsRef.current.add(cleanup)
      if (idx >= scenes.length - 1) return
      refs.autoAdvanceTimeoutRef.current = setTimeout(() => {
        refs.autoAdvanceTimeoutRef.current = null
        helpers.scrollToSceneIndex(idx + 1)
      }, AUTO_ADVANCE_DELAY_MS)
    },
    [scenes, setters, refs, helpers]
  )

  const triggerAttack = useCallback(() => {
    const now = Date.now()
    if (now - refs.lastManualStrikeRef.current < MANUAL_STRIKE_COOLDOWN_MS) return
    const sceneId = refs.activeBossSceneIdRef.current
    const scene = scenes.find((s) => s.id === sceneId)
    if (scene?.monster?.mode === 'scroll') {
      const currentHp = refs.lastBossHpRef.current[sceneId] ?? scene.monster.hp
      const nextHp = Math.max(0, currentHp - 1)
      if (currentHp === nextHp) return
      refs.lastBossHpRef.current[sceneId] = nextHp
      refs.isFinisherRef.current = nextHp === 0
      setters.setBossHpMap((prev) => ({ ...prev, [sceneId]: nextHp }))
    } else {
      refs.isFinisherRef.current = false
    }
    refs.lastManualStrikeRef.current = now
    setters.setAttackTrigger((p) => p + 1)
  }, [scenes, setters, refs])

  useScrollReset(
    useCallback(() => {
      setters.setCurrentSceneIndex(0)
      helpers.setActiveBossScene(null)
      helpers.cancelAutoAdvance()
      helpers.clearCombatTransforms()
    }, [setters, helpers])
  )

  useSceneTriggers(scenes, session)
  useBossScrollLock(helpers.isBossScrollLocked, refs.lockedScrollYRef)

  return {
    sceneRefs: refs.sceneRefs,
    currentSceneIndex: state.currentSceneIndex,
    activeCombatSceneId: state.activeCombatSceneId,
    bossHpMap: state.bossHpMap,
    clearedMonsterMap: state.clearedMonsterMap,
    attackTrigger: state.attackTrigger,
    isFinisherRef: refs.isFinisherRef,
    hasScrolled: state.hasScrolled,
    handleMonsterDefeat,
    triggerAttack,
  }
}
