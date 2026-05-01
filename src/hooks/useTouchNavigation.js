import { useEffect } from 'react'

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

export function useTouchNavigation(isEnabled, onPrev, onNext) {
  useEffect(() => {
    if (!isEnabled) return
    const onPointerDown = (event) => {
      if (!isCoarsePointer()) return
      if (event.pointerType === 'mouse') return
      const target = event.target
      if (target?.closest?.('button, a, input, textarea, [data-nav-skip="true"]')) return
      const half = window.innerWidth / 2
      if (event.clientX < half) onPrev()
      else onNext()
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [isEnabled, onPrev, onNext])
}
