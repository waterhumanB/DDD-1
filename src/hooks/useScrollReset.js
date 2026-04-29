import { useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const RESET_DELAYS_MS = [0, 80, 240, 900]
const STORAGE_KEY = 'dungeon-quest:cleared-monsters:v1'

export function useScrollReset(onReset) {
  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    ScrollTrigger.clearScrollMemory?.()

    const reset = () => {
      onReset?.()
      try {
        window.sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // Storage restrictions in some browsers; in-memory state still resets.
      }
      window.scrollTo(0, 0)
    }

    reset()
    const frameId = requestAnimationFrame(reset)
    const timeoutIds = RESET_DELAYS_MS.map((delay) => setTimeout(reset, delay))

    return () => {
      cancelAnimationFrame(frameId)
      timeoutIds.forEach((id) => clearTimeout(id))
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [onReset])
}
