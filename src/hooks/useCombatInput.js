import { useEffect } from 'react'

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

export function useCombatInput(isActive, onAttack) {
  useEffect(() => {
    if (!isActive) return

    const onPointerDown = (event) => {
      if (!isCoarsePointer()) return
      if (event.pointerType === 'mouse') return
      const target = event.target
      if (target?.closest?.('button, a, input, textarea, [data-nav-skip="true"]')) return
      onAttack()
    }
    const onKeyDown = (event) => {
      if (isCoarsePointer()) return
      if (event.code !== 'Space') return
      event.preventDefault()
      onAttack()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isActive, onAttack])
}
