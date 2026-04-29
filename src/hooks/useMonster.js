import { useEffect, useRef, useState } from 'react'

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

export function useMonster({ monster, controlledHp, isCleared, resetKey, onDefeat }) {
  const isInteractive = monster?.mode === 'interactive'
  const isScroll = monster?.mode === 'scroll'

  const [internalHp, setInternalHp] = useState(monster?.hp ?? 0)
  const [hits, setHits] = useState([])
  const [defeated, setDefeated] = useState(false)
  const onDefeatRef = useRef(onDefeat)
  onDefeatRef.current = onDefeat
  const lastHpRef = useRef(monster?.hp ?? 0)
  const hitTimeoutsRef = useRef(new Set())

  const displayHp = isScroll ? Math.max(0, controlledHp ?? monster?.hp ?? 0) : internalHp

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
    lastHpRef.current = monster?.hp ?? 0
  }, [monster, resetKey])

  useEffect(() => {
    return () => {
      hitTimeoutsRef.current.forEach((id) => clearTimeout(id))
      hitTimeoutsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!isScroll || isCleared) return
    if (displayHp > 0 && defeated) setDefeated(false)
  }, [isScroll, displayHp, defeated, isCleared])

  useEffect(() => {
    if (isCleared || isInteractive || isScroll || !monster) return
    const timeoutId = setTimeout(() => {
      setDefeated(true)
      onDefeatRef.current?.()
    }, AUTO_DEFEAT_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [monster, isInteractive, isScroll, isCleared])

  useEffect(() => {
    if (!isScroll || isCleared) return
    if (displayHp < lastHpRef.current) {
      const diff = lastHpRef.current - displayHp
      if (diff > 0) pushHit(diff)
    }
    lastHpRef.current = displayHp
    if (displayHp <= 0 && !defeated) {
      setDefeated(true)
      onDefeatRef.current?.()
    }
  }, [isScroll, displayHp, defeated, isCleared])

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

  return { isInteractive, isScroll, displayHp, hits, defeated, attack }
}
