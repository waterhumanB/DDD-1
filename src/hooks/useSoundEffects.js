import { useCallback, useEffect, useRef, useState } from 'react'
import { markUserInteraction, playSoundPreset } from '../lib/sound.js'

const STORAGE_KEY = 'rpg:muted'

function readInitialMuted() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistMuted(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
  } catch {
    // localStorage unavailable; mute state stays in memory only.
  }
}

export function useSoundEffects() {
  const [muted, setMuted] = useState(readInitialMuted)
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  useEffect(() => {
    const wakeOnInteraction = () => markUserInteraction()
    window.addEventListener('pointerdown', wakeOnInteraction, { once: true })
    window.addEventListener('touchstart', wakeOnInteraction, { once: true, passive: true })
    window.addEventListener('keydown', wakeOnInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', wakeOnInteraction)
      window.removeEventListener('touchstart', wakeOnInteraction)
      window.removeEventListener('keydown', wakeOnInteraction)
    }
  }, [])

  const play = useCallback((preset) => {
    if (mutedRef.current) return
    playSoundPreset(preset)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      persistMuted(next)
      return next
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== 'KeyM') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      toggleMute()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleMute])

  return { muted, toggleMute, play }
}
