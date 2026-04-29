export function lockScrollAt(lockedRef, scrollY = window.scrollY) {
  lockedRef.current = Math.round(scrollY)
}

export function clearScrollLock(lockedRef) {
  lockedRef.current = null
}

export function restoreLockedScroll(lockedRef) {
  if (lockedRef.current == null) return
  if (Math.abs(window.scrollY - lockedRef.current) <= 1) return
  window.scrollTo(0, lockedRef.current)
}
