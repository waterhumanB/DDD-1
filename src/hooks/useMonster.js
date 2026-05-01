import { useEffect, useRef, useState } from 'react'

const AUTO_HIT_DELAY_MS = 800
const AUTO_DEFEAT_DELAY_MS = 1500
const HIT_LIFETIME_MS = 700
const INTERACTIVE_DEFEAT_DELAY_MS = 400

function makeHit(value) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    offset: Math.random() * 60 - 30,
    value,
  }
}

export function useMonster({ monster, controlledHp, isCleared, resetKey, onDefeat, autoBattleStarted = false }) {
  const isInteractive = monster?.mode === 'interactive'
  const isBoss = monster?.mode === 'boss'

  const [internalHp, setInternalHp] = useState(monster?.hp ?? 0)
  const [hits, setHits] = useState([])
  const [defeated, setDefeated] = useState(false)
  const [autoStruck, setAutoStruck] = useState(false)
  const onDefeatRef = useRef(onDefeat)
  onDefeatRef.current = onDefeat
  const lastHpRef = useRef(monster?.hp ?? 0)
  const hitTimeoutsRef = useRef(new Set())

  const displayHp = isBoss ? Math.max(0, controlledHp ?? monster?.hp ?? 0) : internalHp

  function pushHit(value) {
    const hit = makeHit(value)
    setHits((prev) => [...prev, hit])
    const timeoutId = setTimeout(() => {
      setHits((prev) => prev.filter((h) => h.id !== hit.id))
      hitTimeoutsRef.current.delete(timeoutId)
    }, HIT_LIFETIME_MS)
    hitTimeoutsRef.current.add(timeoutId)
  }

  useEffect(() => {
    hitTimeoutsRef.current.forEach((id) => clearTimeout(id))
    hitTimeoutsRef.current.clear()
    setInternalHp(monster?.hp ?? 0)
    setHits([])
    setDefeated(false)
    setAutoStruck(false)
    lastHpRef.current = monster?.hp ?? 0
  }, [monster, resetKey])

  useEffect(() => {
    return () => {
      hitTimeoutsRef.current.forEach((id) => clearTimeout(id))
      hitTimeoutsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!isBoss || isCleared) return
    if (displayHp > 0 && defeated) setDefeated(false)
  }, [isBoss, displayHp, defeated, isCleared])

  useEffect(() => {
    if (isCleared || isInteractive || isBoss || !monster || !autoBattleStarted) return
    const hitTimeout = setTimeout(() => {
      setAutoStruck(true)
      pushHit(1)
    }, AUTO_HIT_DELAY_MS)
    const defeatTimeout = setTimeout(() => {
      setDefeated(true)
      onDefeatRef.current?.()
    }, AUTO_DEFEAT_DELAY_MS)
    return () => {
      clearTimeout(hitTimeout)
      clearTimeout(defeatTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monster, isInteractive, isBoss, isCleared, autoBattleStarted])

  useEffect(() => {
    if (!isBoss || isCleared) return
    if (displayHp < lastHpRef.current) {
      const diff = lastHpRef.current - displayHp
      if (diff > 0) pushHit(diff)
    }
    lastHpRef.current = displayHp
    if (displayHp <= 0 && !defeated) {
      setDefeated(true)
      onDefeatRef.current?.()
    }
  }, [isBoss, displayHp, defeated, isCleared])

  function attack() {
    if (defeated) return
    setInternalHp((prev) => {
      const next = Math.max(0, prev - 1)
      if (next === 0) {
        setDefeated(true)
        setTimeout(() => onDefeatRef.current?.(), INTERACTIVE_DEFEAT_DELAY_MS)
      }
      return next
    })
    pushHit(1)
  }

  useEffect(() => {
    if (!isInteractive) return
    const handler = (event) => {
      if (event.code !== 'Space') return
      event.preventDefault()
      attack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInteractive, internalHp, defeated])

  return { isInteractive, isBoss, displayHp, hits, defeated, autoStruck, attack }
}
