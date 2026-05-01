import { memo, useEffect, useRef } from 'react'

const KEY_CODE = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
const ARROW = { up: '▲', down: '▼', left: '◀', right: '▶' }

function ArrowBtn({ dir }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const dispatch = (type) => {
      const code = KEY_CODE[dir]
      window.dispatchEvent(
        new KeyboardEvent(type, { code, key: code, bubbles: true, cancelable: true })
      )
    }
    const start = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dispatch('keydown')
    }
    const end = (e) => {
      e.preventDefault?.()
      e.stopPropagation?.()
      dispatch('keyup')
    }
    const blockMove = (e) => e.preventDefault()

    el.addEventListener('touchstart', start, { passive: false })
    el.addEventListener('touchmove', blockMove, { passive: false })
    el.addEventListener('touchend', end, { passive: false })
    el.addEventListener('touchcancel', end, { passive: false })
    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', end)
    el.addEventListener('mouseleave', end)
    el.addEventListener('contextmenu', (e) => e.preventDefault())

    return () => {
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchmove', blockMove)
      el.removeEventListener('touchend', end)
      el.removeEventListener('touchcancel', end)
      el.removeEventListener('mousedown', start)
      el.removeEventListener('mouseup', end)
      el.removeEventListener('mouseleave', end)
    }
  }, [dir])

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={-1}
      data-nav-skip="true"
      className={`dpad__btn dpad__btn--${dir}`}
      aria-label={dir}
    >
      {ARROW[dir]}
    </div>
  )
}

function VirtualDPad({ isCombatActive }) {
  if (isCombatActive) return null
  return (
    <div className="dpad" data-nav-skip="true" aria-hidden="false">
      <ArrowBtn dir="up" />
      <ArrowBtn dir="left" />
      <span className="dpad__center" />
      <ArrowBtn dir="right" />
      <ArrowBtn dir="down" />
    </div>
  )
}

export default memo(VirtualDPad)
