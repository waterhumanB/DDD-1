import { useCallback, useEffect } from 'react'
import {
  AUTO_ADVANCE_DELAY_MS,
  COMBAT_CLEANUP_DELAY_MS,
  MANUAL_STRIKE_COOLDOWN_MS,
} from '../lib/combat.js'
import { canMove, findNeighbor, indexOfScene, isBossScene } from '../lib/navigation.js'
import { useGameSession } from './useGameSession.js'

export function useGameOrchestrator(scenes, opts) {
  const {
    partyRef, monsterRef, onCombatReset,
    onSceneChange, onNavBlocked, onAttackHit, onBossDefeat, onCombatStart,
  } = opts
  const session = useGameSession({ partyRef, monsterRef, onCombatReset })
  const { state, setters, refs, helpers } = session

  const goToScene = useCallback(
    (idx, direction = 'right') => {
      if (idx < 0 || idx >= scenes.length) return
      if (idx === state.currentSceneIndex) return
      helpers.cancelAutoAdvance()
      helpers.clearCombatTransforms()
      setters.setActiveCombatSceneId(null)
      setters.setCurrentSceneIndex(idx)
      onSceneChange?.(idx, direction)
    },
    [scenes.length, state.currentSceneIndex, setters, helpers, onSceneChange]
  )

  const move = useCallback(
    (direction) => {
      const current = scenes[state.currentSceneIndex]
      if (!current) return
      const target = findNeighbor(scenes, current.id, direction)
      if (!target) {
        onNavBlocked?.()
        return
      }
      if (!canMove(
        scenes,
        current.id,
        direction,
        refs.completedBossesRef.current,
        refs.clearedMonstersRef.current
      )) {
        onNavBlocked?.()
        return
      }
      const targetIdx = indexOfScene(scenes, target.id)
      if (targetIdx < 0) return
      goToScene(targetIdx, direction)
    },
    [scenes, state.currentSceneIndex, refs, goToScene, onNavBlocked]
  )

  const handleMonsterDefeat = useCallback(
    (sceneId) => {
      if (refs.clearedMonstersRef.current[sceneId]) return
      const idx = indexOfScene(scenes, sceneId)
      if (idx < 0) return
      const scene = scenes[idx]
      refs.clearedMonstersRef.current[sceneId] = true
      setters.setClearedMonsterMap((prev) => ({ ...prev, [sceneId]: true }))
      if (!isBossScene(scene)) return

      refs.completedBossesRef.current[sceneId] = true
      setters.setActiveCombatSceneId(null)
      onBossDefeat?.()
      const cleanup = setTimeout(() => {
        refs.cleanupTimeoutsRef.current.delete(cleanup)
        helpers.clearCombatTransforms()
      }, COMBAT_CLEANUP_DELAY_MS)
      refs.cleanupTimeoutsRef.current.add(cleanup)
      if (!scene.next) return
      const nextIdx = indexOfScene(scenes, scene.next.sceneId)
      if (nextIdx < 0) return
      refs.autoAdvanceTimeoutRef.current = setTimeout(() => {
        refs.autoAdvanceTimeoutRef.current = null
        goToScene(nextIdx, scene.next.direction)
      }, AUTO_ADVANCE_DELAY_MS)
    },
    [scenes, setters, refs, helpers, goToScene, onBossDefeat]
  )

  const triggerAttack = useCallback(() => {
    const now = Date.now()
    if (now - refs.lastManualStrikeRef.current < MANUAL_STRIKE_COOLDOWN_MS) return
    const sceneId = state.activeCombatSceneId
    const scene = scenes.find((s) => s.id === sceneId)
    if (isBossScene(scene)) {
      const currentHp = refs.lastBossHpRef.current[sceneId] ?? scene.monster.hp
      const nextHp = Math.max(0, currentHp - 1)
      if (currentHp === nextHp) return
      refs.lastBossHpRef.current[sceneId] = nextHp
      refs.isFinisherRef.current = nextHp === 0
      setters.setBossHpMap((prev) => ({ ...prev, [sceneId]: nextHp }))
      onAttackHit?.(nextHp)
    } else {
      refs.isFinisherRef.current = false
    }
    refs.lastManualStrikeRef.current = now
    setters.setAttackTrigger((p) => p + 1)
  }, [scenes, state.activeCombatSceneId, refs, setters, onAttackHit])

  const startBossCombat = useCallback(
    (sceneId) => {
      const scene = scenes.find((s) => s.id === sceneId)
      if (!isBossScene(scene)) return
      if (refs.clearedMonstersRef.current[scene.id]) return
      if (refs.completedBossesRef.current[scene.id]) return
      helpers.ensureBossHp(scene)
      setters.setActiveCombatSceneId(scene.id)
      onCombatStart?.()
    },
    [scenes, refs, helpers, setters, onCombatStart]
  )

  useEffect(() => {
    const scene = scenes[state.currentSceneIndex]
    if (!scene) return
    if (!isBossScene(scene)) return
    if (refs.clearedMonstersRef.current[scene.id]) return
    if (refs.completedBossesRef.current[scene.id]) return
    helpers.ensureBossHp(scene)
  }, [scenes, state.currentSceneIndex, refs, helpers])

  return {
    currentSceneIndex: state.currentSceneIndex,
    activeCombatSceneId: state.activeCombatSceneId,
    bossHpMap: state.bossHpMap,
    clearedMonsterMap: state.clearedMonsterMap,
    attackTrigger: state.attackTrigger,
    isFinisherRef: refs.isFinisherRef,
    move,
    goToScene,
    handleMonsterDefeat,
    startBossCombat,
    triggerAttack,
  }
}
