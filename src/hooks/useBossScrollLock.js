import { useEffect } from 'react'
import { SCROLL_LOCK_KEYS } from '../lib/combat.js'
import { restoreLockedScroll } from '../lib/scrollLock.js'

export function useBossScrollLock(isLocked, lockedScrollYRef) {
  useEffect(() => {
    const preventLockedScroll = (event) => {
      if (!isLocked()) return
      event.preventDefault()
      restoreLockedScroll(lockedScrollYRef)
    }
    const onKeyDown = (event) => {
      if (!SCROLL_LOCK_KEYS.has(event.code)) return
      preventLockedScroll(event)
    }
    const onScroll = () => restoreLockedScroll(lockedScrollYRef)

    window.addEventListener('wheel', preventLockedScroll, { passive: false })
    window.addEventListener('touchmove', preventLockedScroll, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', preventLockedScroll)
      window.removeEventListener('touchmove', preventLockedScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isLocked, lockedScrollYRef])
}
