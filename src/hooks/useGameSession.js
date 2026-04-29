import { useCallback, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { shouldLockBossScroll } from '../lib/bossScene.js'
import {
  clearScrollLock,
  lockScrollAt,
  restoreLockedScroll as restoreLockedScrollHelper,
} from '../lib/scrollLock.js'

export function useGameSession(scenes, { partyRef, monsterRef, onCombatReset }) {
  const sceneRefs = useRef([])
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [bossHpMap, setBossHpMap] = useState({})
  const [clearedMonsterMap, setClearedMonsterMap] = useState({})
  const [activeCombatSceneId, setActiveCombatSceneId] = useState(null)
  const [attackTrigger, setAttackTrigger] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  const lastBossHpRef = useRef({})
  const activeBossSceneIdRef = useRef(null)
  const lockedScrollYRef = useRef(null)
  const clearedMonstersRef = useRef({})
  const completedBossesRef = useRef({})
  const monsterTriggersRef = useRef({})
  const isFinisherRef = useRef(false)
  const lastManualStrikeRef = useRef(0)
  const autoScrollTweenRef = useRef(null)
  const autoAdvanceTimeoutRef = useRef(null)
  const cleanupTimeoutsRef = useRef(new Set())

  const setActiveBossScene = useCallback((sceneId, scrollY) => {
    activeBossSceneIdRef.current = sceneId
    if (sceneId) lockScrollAt(lockedScrollYRef, scrollY)
    else clearScrollLock(lockedScrollYRef)
    setActiveCombatSceneId(sceneId)
  }, [])

  const restoreLockedScroll = useCallback(
    () => restoreLockedScrollHelper(lockedScrollYRef),
    []
  )

  const ensureBossHp = useCallback((scene) => {
    if (!scene?.monster) return
    if (lastBossHpRef.current[scene.id] != null) return
    lastBossHpRef.current[scene.id] = scene.monster.hp
    setBossHpMap((prev) => ({ ...prev, [scene.id]: scene.monster.hp }))
  }, [])

  const getBossHp = useCallback(
    (scene) => lastBossHpRef.current[scene.id] ?? scene.monster.hp,
    []
  )

  const isBossScrollLocked = useCallback(() => {
    const sceneId = activeBossSceneIdRef.current
    const scene = scenes.find((s) => s.id === sceneId)
    if (clearedMonstersRef.current[sceneId]) return false
    return shouldLockBossScroll(
      sceneId,
      completedBossesRef.current,
      lastBossHpRef.current,
      scene?.monster?.hp ?? 0
    )
  }, [scenes])

  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }
    if (autoScrollTweenRef.current) {
      autoScrollTweenRef.current.kill()
      autoScrollTweenRef.current = null
    }
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

  const scrollToSceneIndex = useCallback(
    (idx) => {
      const sceneEl = sceneRefs.current[idx]
      if (!sceneEl) return
      cancelAutoAdvance()
      autoScrollTweenRef.current = gsap.to(window, {
        scrollTo: { y: sceneEl, offsetY: 0, autoKill: true },
        duration: 1.0,
        ease: 'power2.inOut',
        onComplete: () => {
          autoScrollTweenRef.current = null
          setCurrentSceneIndex(idx)
        },
        onInterrupt: () => {
          autoScrollTweenRef.current = null
        },
      })
    },
    [cancelAutoAdvance]
  )

  const refs = useMemo(
    () => ({
      sceneRefs, lastBossHpRef, activeBossSceneIdRef, lockedScrollYRef,
      clearedMonstersRef, completedBossesRef, monsterTriggersRef,
      isFinisherRef, lastManualStrikeRef, autoAdvanceTimeoutRef, cleanupTimeoutsRef,
    }),
    []
  )
  const setters = useMemo(
    () => ({ setCurrentSceneIndex, setBossHpMap, setClearedMonsterMap, setAttackTrigger, setHasScrolled }),
    []
  )
  const helpers = useMemo(
    () => ({
      setActiveBossScene, restoreLockedScroll, ensureBossHp, getBossHp,
      isBossScrollLocked, cancelAutoAdvance, clearCombatTransforms, scrollToSceneIndex,
    }),
    [setActiveBossScene, restoreLockedScroll, ensureBossHp, getBossHp,
     isBossScrollLocked, cancelAutoAdvance, clearCombatTransforms, scrollToSceneIndex]
  )

  return {
    state: { currentSceneIndex, bossHpMap, clearedMonsterMap, activeCombatSceneId, attackTrigger, hasScrolled },
    refs, setters, helpers,
  }
}
