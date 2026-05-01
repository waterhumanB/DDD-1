import { memo, useEffect, useRef } from 'react'
import { markUserInteraction } from '../lib/sound.js'

const KEY_CODE = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
const ARROW = { up: '▲', down: '▼', left: '◀', right: '▶' }

function ArrowBtn({ dir, onMoveDirect }) {
  const ref = useRef(null)
  const frameRef = useRef(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let activePointerId = null
    const dispatch = (type) => {
      if (onMoveDirect) return
      const code = KEY_CODE[dir]
      window.dispatchEvent(
        new KeyboardEvent(type, { code, key: code, bubbles: true, cancelable: true })
      )
    }
    const stopDirectMove = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
    const directMoveTick = (now) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now
      onMoveDirect?.(dir, dt)
      frameRef.current = requestAnimationFrame(directMoveTick)
    }
    const startDirectMove = () => {
      if (!onMoveDirect || frameRef.current) return
      lastTimeRef.current = performance.now()
      onMoveDirect(dir, 1 / 60)
      frameRef.current = requestAnimationFrame(directMoveTick)
    }
    const start = (e) => {
      markUserInteraction()
      e.preventDefault()
      e.stopPropagation()
      startDirectMove()
      dispatch('keydown')
      if (e.pointerId != null) {
        activePointerId = e.pointerId
        try {
          el.setPointerCapture?.(e.pointerId)
        } catch {
          // Some synthetic/mobile browser paths do not allow capture; hold state is already set.
        }
      }
    }
    const end = (e) => {
      if (e.pointerId != null && activePointerId != null && e.pointerId !== activePointerId) return
      e.preventDefault?.()
      e.stopPropagation?.()
      if (e.pointerId != null) {
        if (el.hasPointerCapture?.(e.pointerId)) {
          el.releasePointerCapture(e.pointerId)
        }
        activePointerId = null
      }
      stopDirectMove()
      dispatch('keyup')
    }
    const blockMove = (e) => e.preventDefault()
    const preventContext = (e) => e.preventDefault()

    if (window.PointerEvent) {
      el.addEventListener('pointerdown', start)
      el.addEventListener('pointerup', end)
      el.addEventListener('pointercancel', end)
      el.addEventListener('lostpointercapture', end)
      el.addEventListener('pointermove', blockMove)
    } else {
      el.addEventListener('touchstart', start, { passive: false })
      el.addEventListener('touchmove', blockMove, { passive: false })
      el.addEventListener('touchend', end, { passive: false })
      el.addEventListener('touchcancel', end, { passive: false })
      el.addEventListener('mousedown', start)
      el.addEventListener('mouseup', end)
      el.addEventListener('mouseleave', end)
    }
    el.addEventListener('contextmenu', preventContext)

    return () => {
      el.removeEventListener('pointerdown', start)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('lostpointercapture', end)
      el.removeEventListener('pointermove', blockMove)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchmove', blockMove)
      el.removeEventListener('touchend', end)
      el.removeEventListener('touchcancel', end)
      el.removeEventListener('mousedown', start)
      el.removeEventListener('mouseup', end)
      el.removeEventListener('mouseleave', end)
      el.removeEventListener('contextmenu', preventContext)
      stopDirectMove()
    }
  }, [dir, onMoveDirect])

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

function VirtualDPad({ isCombatActive, onMoveDirect }) {
  if (isCombatActive) return null
  return (
    <div className="dpad" data-nav-skip="true" aria-hidden="false">
      <ArrowBtn dir="up" onMoveDirect={onMoveDirect} />
      <ArrowBtn dir="left" onMoveDirect={onMoveDirect} />
      <span className="dpad__center" />
      <ArrowBtn dir="right" onMoveDirect={onMoveDirect} />
      <ArrowBtn dir="down" onMoveDirect={onMoveDirect} />
    </div>
  )
}

export default memo(VirtualDPad)
