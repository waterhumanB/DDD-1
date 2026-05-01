import { useCallback, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

export function useGameSession({ partyRef, monsterRef, onCombatReset }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [bossHpMap, setBossHpMap] = useState({})
  const [clearedMonsterMap, setClearedMonsterMap] = useState({})
  const [activeCombatSceneId, setActiveCombatSceneId] = useState(null)
  const [attackTrigger, setAttackTrigger] = useState(0)

  const lastBossHpRef = useRef({})
  const completedBossesRef = useRef({})
  const clearedMonstersRef = useRef({})
  const isFinisherRef = useRef(false)
  const lastManualStrikeRef = useRef(0)
  const cleanupTimeoutsRef = useRef(new Set())
  const autoAdvanceTimeoutRef = useRef(null)

  const ensureBossHp = useCallback((scene) => {
    if (!scene?.monster) return
    if (lastBossHpRef.current[scene.id] != null) return
    lastBossHpRef.current[scene.id] = scene.monster.hp
    setBossHpMap((prev) => ({ ...prev, [scene.id]: scene.monster.hp }))
  }, [])

  const clearCombatTransforms = useCallback(() => {
    cleanupTimeoutsRef.current.forEach((id) => clearTimeout(id))
    cleanupTimeoutsRef.current.clear()
    onCombatReset?.()
    if (partyRef.current) {
      const members = Array.from(partyRef.current.querySelectorAll('.party__member'))
      gsap.killTweensOf(members)
      gsap.set(members, { clearProps: 'transform' })
    }
    if (monsterRef.current) {
      gsap.killTweensOf(monsterRef.current)
      gsap.set(monsterRef.current, { clearProps: 'transform' })
    }
  }, [partyRef, monsterRef, onCombatReset])

  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }
  }, [])

  const refs = useMemo(
    () => ({
      lastBossHpRef, completedBossesRef, clearedMonstersRef,
      isFinisherRef, lastManualStrikeRef, cleanupTimeoutsRef, autoAdvanceTimeoutRef,
    }),
    []
  )
  const setters = useMemo(
    () => ({
      setCurrentSceneIndex, setBossHpMap, setClearedMonsterMap,
      setActiveCombatSceneId, setAttackTrigger,
    }),
    []
  )
  const helpers = useMemo(
    () => ({ ensureBossHp, clearCombatTransforms, cancelAutoAdvance }),
    [ensureBossHp, clearCombatTransforms, cancelAutoAdvance]
  )

  return {
    state: { currentSceneIndex, bossHpMap, clearedMonsterMap, activeCombatSceneId, attackTrigger },
    refs, setters, helpers,
  }
}
